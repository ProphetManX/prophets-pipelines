from __future__ import annotations

import tempfile
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path
from unittest.mock import patch

from agent_suite.journal import Journal, JournalError


TRX_PASS = """<?xml version="1.0" encoding="utf-8"?>
<TestRun xmlns="http://microsoft.com/schemas/VisualStudio/TeamTest/2010">
  <ResultSummary outcome="Completed"><Counters total="2" executed="2" passed="2" failed="0" notExecuted="0" /></ResultSummary>
</TestRun>"""
TRX_ZERO = """<TestRun xmlns="http://microsoft.com/schemas/VisualStudio/TeamTest/2010">
  <ResultSummary outcome="Completed"><Counters total="0" executed="0" passed="0" failed="0" notExecuted="0" /></ResultSummary>
</TestRun>"""
TRX_FAILED = """<TestRun xmlns="http://microsoft.com/schemas/VisualStudio/TeamTest/2010">
  <ResultSummary outcome="Failed"><Counters total="1" executed="1" passed="0" failed="1" notExecuted="0" /></ResultSummary>
</TestRun>"""
PASSING_COUNTERS = {"total": "2", "executed": "2", "passed": "2", "failed": "0", "notExecuted": "0"}


class JournalTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        self.project = self.root / "project"
        self.project.mkdir()
        self.database = self.root / "journal.sqlite3"
        self.journal = Journal(self.database)
        self.journal.register_run("run-1", "Logger", str(self.project), "Implement approved slice")
        self.journal.register_slice("run-1", "slice-1", "Bridge behavior", "Preserve approved state")
        self.journal.start_invocation("run-1", "slice-1", "worker-1", "build")

    def tearDown(self):
        self.temporary.cleanup()

    def _evidence(self, filename: str, body: str, kind: str = "test_result"):
        path = self.project / filename
        path.write_text(body, encoding="utf-8")
        return {"kind": kind, "uri": filename, "summary": "Focused validation evidence."}

    def _claim_with_trx(self, counters, outcome="Completed"):
        root = ET.Element("TestRun", xmlns="http://microsoft.com/schemas/VisualStudio/TeamTest/2010")
        summary = ET.SubElement(
            root, "ResultSummary", {} if outcome is None else {"outcome": outcome}
        )
        ET.SubElement(summary, "Counters", counters)
        return self.journal.report(
            "worker-1",
            "completion_claimed",
            "claimed_complete",
            "Counter-level mechanical checks completed; not product verification.",
            [
                self._evidence("mechanical.trx", ET.tostring(root, encoding="unicode")),
                self._evidence("review.md", "Review reference only.", "review"),
            ],
        )

    def _assert_trx_rejected(self, result):
        self.assertTrue(result["recorded"])
        self.assertEqual("claimed_with_gaps", result["status"])
        self.assertTrue(result["gaps"])
        self.assertNotIn("tests_passed_mechanically", result["evidence"][0]["check_result"])

    def test_get_run_includes_registered_workers_before_their_first_report(self):
        self.journal.start_invocation("run-1", "slice-1", "worker-2", "tests")
        self.journal.register_slice("run-1", "slice-2", "Independent review", "Review the tests")
        self.journal.start_invocation("run-1", "slice-2", "worker-3", "review")
        self.journal.register_run("run-2", "Other", str(self.project), "Separate assignment")
        self.journal.register_slice("run-2", "slice-1", "Other slice", "Separate work")
        self.journal.start_invocation("run-2", "slice-1", "other-worker", "build")

        run = self.journal.get_run("run-1")

        self.assertIn("invocations", run)
        self.assertIsInstance(run["invocations"], list)
        self.assertEqual(3, len(run["invocations"]))
        workers = {item["invocation_id"]: item for item in run["invocations"]}
        self.assertEqual({"worker-1", "worker-2", "worker-3"}, set(workers))
        for invocation_id, role, slice_id in (
            ("worker-1", "build", "slice-1"),
            ("worker-2", "tests", "slice-1"),
            ("worker-3", "review", "slice-2"),
        ):
            with self.subTest(invocation_id=invocation_id):
                worker = workers[invocation_id]
                self.assertEqual(role, worker["role"])
                self.assertEqual(slice_id, worker["slice_id"])
                self.assertEqual("registered", worker["status"])
                self.assertIsNone(worker["last_reported_at"])
        self.assertEqual([], run["events"])

    def test_get_run_uses_each_workers_latest_real_report_without_updating_peers(self):
        self.journal.start_invocation("run-1", "slice-1", "worker-2", "tests")
        self.journal.start_invocation("run-1", "slice-1", "worker-3", "review")
        timestamps = [
            "2026-10-24T06:00:00.000Z",
            "2026-10-24T06:00:01.000Z",
            "2026-10-24T06:00:02.000Z",
        ]
        with patch("agent_suite.journal._now", side_effect=timestamps):
            self.journal.report("worker-1", "phase_changed", "in_progress", "Build started.")
            self.journal.report("worker-2", "phase_changed", "in_progress", "Tests started.")
            self.journal.report(
                "worker-1", "review_requested", "awaiting_review", "Build ready for review."
            )

        run = Journal(self.database).get_run("run-1")

        self.assertIn("invocations", run)
        self.assertIsInstance(run["invocations"], list)
        self.assertEqual(3, len(run["invocations"]))
        workers = {item["invocation_id"]: item for item in run["invocations"]}
        self.assertEqual({"worker-1", "worker-2", "worker-3"}, set(workers))
        self.assertEqual("awaiting_review", workers["worker-1"]["status"])
        self.assertEqual(timestamps[2], workers["worker-1"]["last_reported_at"])
        self.assertEqual("in_progress", workers["worker-2"]["status"])
        self.assertEqual(timestamps[1], workers["worker-2"]["last_reported_at"])
        self.assertEqual("registered", workers["worker-3"]["status"])
        self.assertIsNone(workers["worker-3"]["last_reported_at"])
        self.assertEqual(3, len(run["events"]))

    def test_handoffs_reject_missing_unknown_self_and_cross_run_counterparties_atomically(self):
        self.journal.register_run("run-2", "Other", str(self.project), "Separate assignment")
        self.journal.register_slice("run-2", "slice-1", "Other slice", "Separate work")
        self.journal.start_invocation("run-2", "slice-1", "other-worker", "tests")
        self.journal.report("worker-1", "note", "in_progress", "Existing event is preserved.")
        before = self.journal.get_run("run-1")["events"]
        for event_type in ("handoff_sent", "handoff_received"):
            for target in (None, "not-registered", "worker-1", "other-worker"):
                with self.subTest(event_type=event_type, target=target):
                    arguments = {} if target is None else {"counterparty_invocation_id": target}
                    with self.assertRaises(JournalError):
                        self.journal.report(
                            "worker-1", event_type, "in_progress", "Invalid exchange.", **arguments
                        )
                    self.assertEqual(before, self.journal.get_run("run-1")["events"])
                    self.assertEqual([], self.journal.get_run("run-2")["events"])

    def test_valid_same_run_handoff_exchange_exposes_both_invocation_ids_and_roles(self):
        self.journal.register_slice("run-1", "slice-2", "Test specifications", "Author tests")
        self.journal.start_invocation("run-1", "slice-2", "worker-2", "tests")
        sent = self.journal.report(
            "worker-1", "handoff_sent", "in_progress", "Request regression tests.",
            counterparty_invocation_id="worker-2",
        )
        received = self.journal.report(
            "worker-2", "handoff_received", "in_progress", "Received test assignment.",
            counterparty_invocation_id="worker-1",
        )

        events = Journal(self.database).get_run("run-1")["events"]

        self.assertTrue(sent["recorded"])
        self.assertTrue(received["recorded"])
        self.assertEqual(2, len(events))
        for event, result, event_type, worker_id, role, peer_id, peer_role in (
            (events[0], sent, "handoff_sent", "worker-1", "build", "worker-2", "tests"),
            (events[1], received, "handoff_received", "worker-2", "tests", "worker-1", "build"),
        ):
            with self.subTest(event_type=event_type):
                self.assertEqual(result["event_id"], event["event_id"])
                self.assertEqual(event_type, event["event_type"])
                self.assertEqual(worker_id, event["invocation_id"])
                self.assertEqual(role, event["role"])
                self.assertEqual(peer_id, event["counterparty_invocation_id"])
                self.assertEqual(peer_role, event["counterparty_role"])

    def test_failed_summary_is_not_passing_evidence_even_when_counters_claim_success(self):
        self._assert_trx_rejected(self._claim_with_trx(PASSING_COUNTERS, outcome="Failed"))

    def test_passing_trx_requires_every_counter_to_be_explicit(self):
        for missing in PASSING_COUNTERS:
            with self.subTest(missing_counter=missing):
                counters = {name: value for name, value in PASSING_COUNTERS.items() if name != missing}
                self._assert_trx_rejected(self._claim_with_trx(counters))

    def test_negative_trx_counters_are_not_passing_evidence(self):
        for name in PASSING_COUNTERS:
            with self.subTest(negative_counter=name):
                counters = {**PASSING_COUNTERS, name: "-1"}
                self._assert_trx_rejected(self._claim_with_trx(counters))

    def test_inconsistent_trx_counters_are_not_passing_evidence(self):
        for description, changes in (
            ("no passes despite executions", {"passed": "0"}),
            ("fewer passes than executions", {"passed": "1"}),
            ("more passes than executions", {"passed": "3"}),
            ("total exceeds executed plus skipped", {"total": "3"}),
            ("executed exceeds total", {"total": "1"}),
            ("executed below passed plus failed", {"executed": "1"}),
            ("executed above passed plus failed", {"total": "3", "executed": "3"}),
            ("failed plus passed exceeds executed", {"failed": "1"}),
            ("executed plus skipped exceeds total", {"notExecuted": "1"}),
        ):
            with self.subTest(inconsistency=description):
                self._assert_trx_rejected(self._claim_with_trx({**PASSING_COUNTERS, **changes}))

    def test_consistent_counters_with_skipped_tests_are_not_passing_evidence(self):
        counters = {**PASSING_COUNTERS, "total": "3", "notExecuted": "1"}
        self._assert_trx_rejected(self._claim_with_trx(counters))

    def test_nonpassing_missing_and_unsupported_trx_summary_outcomes_are_rejected(self):
        for outcome in (
            "Aborted", "Error", "Timeout", "Inconclusive", "NotExecuted",
            "Warning", "InProgress", "CustomOutcome", "", None,
        ):
            with self.subTest(outcome=outcome):
                self._assert_trx_rejected(self._claim_with_trx(PASSING_COUNTERS, outcome))

    def test_passing_counter_level_trx_remains_only_mechanical_evidence(self):
        for outcome in ("Completed", "Passed"):
            for count in ("1", "7"):
                with self.subTest(outcome=outcome, count=count):
                    counters = {**PASSING_COUNTERS, "total": count, "executed": count, "passed": count}
                    result = self._claim_with_trx(counters, outcome)
                    self.assertTrue(result["recorded"])
                    self.assertEqual("claim_recorded_not_verified", result["status"])
                    self.assertEqual(1, len(result["gaps"]))
                    self.assertIn("tests_passed_mechanically", result["evidence"][0]["check_result"])
                    self.assertIn("not independently verified", result["evidence"][0]["check_result"])

    def test_completion_claim_is_recorded_with_actionable_evidence_gaps(self):
        result = self.journal.report(
            "worker-1", "completion_claimed", "claimed_complete", "The slice is complete."
        )
        self.assertTrue(result["recorded"])
        self.assertEqual("claimed_with_gaps", result["status"])
        self.assertIn("Required evidence is missing: test_result", result["gaps"])
        self.assertIn("Required evidence is missing: review", result["gaps"])
        self.assertEqual(1, len(self.journal.get_run("run-1")["events"]))

    def test_required_completion_evidence_does_not_block_progress_events(self):
        result = self.journal.report("worker-1", "phase_changed", "in_progress", "Started implementation.")
        self.assertEqual("in_progress", result["status"])
        self.assertEqual([], result["gaps"])

    def test_passing_trx_and_review_reference_still_do_not_verify_completion(self):
        evidence = [
            self._evidence("focused.trx", TRX_PASS),
            self._evidence("review.md", "Reviewed the approved behavior.", "review"),
        ]
        result = self.journal.report(
            "worker-1", "completion_claimed", "claimed_complete", "The checks are complete.", evidence
        )
        self.assertEqual("claim_recorded_not_verified", result["status"])
        self.assertEqual(1, len(result["gaps"]))
        self.assertIn("not independently verified", result["evidence"][0]["check_result"])

    def test_zero_test_run_is_not_passing_evidence(self):
        result = self.journal.report(
            "worker-1",
            "completion_claimed",
            "claimed_complete",
            "Checks completed.",
            [self._evidence("empty.trx", TRX_ZERO), self._evidence("review.md", "Reviewed.", "review")],
        )
        self.assertEqual("claimed_with_gaps", result["status"])
        self.assertTrue(any("zero_tests_executed" in gap for gap in result["gaps"]))

    def test_failed_test_run_is_not_passing_evidence(self):
        result = self.journal.report(
            "worker-1",
            "completion_claimed",
            "claimed_complete",
            "Checks completed.",
            [self._evidence("failed.trx", TRX_FAILED), self._evidence("review.md", "Reviewed.", "review")],
        )
        self.assertTrue(any("tests_failed" in gap for gap in result["gaps"]))

    def test_evidence_outside_project_is_rejected_as_a_gap(self):
        outside = self.root / "outside.trx"
        outside.write_text(TRX_PASS, encoding="utf-8")
        result = self.journal.report(
            "worker-1",
            "completion_claimed",
            "claimed_complete",
            "Checks completed.",
            [
                {"kind": "test_result", "uri": str(outside), "summary": "External result."},
                self._evidence("review.md", "Reviewed.", "review"),
            ],
        )
        self.assertTrue(any("outside the registered project" in gap for gap in result["gaps"]))

    def test_journal_rejects_path_escape_and_unknown_identity(self):
        with self.assertRaises(JournalError):
            self.journal.register_run("run-2", "Logger", str(self.root / "missing"), "Bad root")
        with self.assertRaises(JournalError):
            self.journal.report("not-registered", "note", "in_progress", "Unknown worker.")

    def test_reports_redact_common_secret_shaped_values(self):
        self.journal.report(
            "worker-1",
            "note",
            "in_progress",
            "Checked config token=abc123; password: do-not-store",
        )
        text = self.journal.get_run("run-1")["events"][0]["summary"]
        self.assertNotIn("abc123", text)
        self.assertNotIn("do-not-store", text)
        self.assertIn("[REDACTED]", text)

    def test_run_and_slice_registration_are_append_only(self):
        with self.assertRaises(JournalError):
            self.journal.register_run("run-1", "Logger", str(self.project), "Replacement run")
        with self.assertRaises(JournalError):
            self.journal.register_slice("run-1", "slice-1", "Replacement", "Overwrite")
        self.assertEqual("Implement approved slice", self.journal.get_run("run-1")["objective"])

    def test_unsupported_schema_requires_explicit_migration(self):
        with self.journal._connect() as db:
            db.execute("PRAGMA user_version = 99")
        with self.assertRaisesRegex(JournalError, "reviewed migration"):
            Journal(self.database)


if __name__ == "__main__":
    unittest.main()
