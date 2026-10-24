from __future__ import annotations

import json
import os
import re
import sqlite3
import xml.etree.ElementTree as ET
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterator


SCHEMA_VERSION = 1
ROLES = {"lead", "design", "investigate", "tests", "build", "review"}
EVENT_TYPES = {
    "run_started",
    "slice_queued",
    "invocation_started",
    "phase_changed",
    "evidence_attached",
    "review_requested",
    "review_returned",
    "handoff_sent",
    "handoff_received",
    "decision_needed",
    "blocked",
    "completion_claimed",
    "failed",
    "interrupted",
    "note",
}
STATUSES = {
    "queued",
    "in_progress",
    "awaiting_review",
    "claimed_complete",
    "blocked",
    "failed",
    "interrupted",
}
EVIDENCE_KINDS = {"test_result", "build_result", "review", "diff", "report", "other"}
DEFAULT_REQUIRED_EVIDENCE = ["test_result", "review"]
ID_PATTERN = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$")
SECRET_PATTERNS = (
    re.compile(r"(?i)\b(password|passwd|token|secret|api[_-]?key)\s*[:=]\s*([^\s,;]+)"),
    re.compile(r"(?i)\bBearer\s+[A-Za-z0-9._~+/-]+=*"),
    re.compile(r"(?i)(AccountKey|SharedAccessSignature)=([^;\s]+)"),
)


class JournalError(ValueError):
    """A rejected journal request with a concrete, safe explanation."""


def _now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def _validate_id(value: Any, field: str) -> str:
    if not isinstance(value, str) or not ID_PATTERN.fullmatch(value):
        raise JournalError(f"{field} must be a 1-128 character identifier using letters, digits, '.', '_', ':', or '-'.")
    return value


def _clean_text(value: Any, field: str, limit: int, optional: bool = False) -> str:
    if optional and (value is None or isinstance(value, str) and not value.strip()):
        return ""
    if not isinstance(value, str) or not value.strip():
        raise JournalError(f"{field} must be a non-empty string.")
    if len(value) > limit:
        raise JournalError(f"{field} exceeds the {limit}-character limit.")
    text = value.strip()
    for pattern in SECRET_PATTERNS:
        text = pattern.sub(lambda match: (match.group(1) + "=[REDACTED]") if match.lastindex and match.lastindex > 1 else "[REDACTED]", text)
    return text


class Journal:
    """Append-only activity journal with mechanical evidence checks."""

    def __init__(self, database: str | Path):
        self.database = Path(database)
        self.database.parent.mkdir(parents=True, exist_ok=True)
        self._initialize()

    @classmethod
    def from_environment(cls) -> "Journal":
        root = Path(os.environ.get("LOCALAPPDATA", Path.home() / "AppData/Local"))
        directory = Path(os.environ.get("PW_AGENT_SUITE_HOME", root / "ProphetsWay/AgentSuite/v3"))
        return cls(directory / "journal.sqlite3")

    @contextmanager
    def _connect(self) -> Iterator[sqlite3.Connection]:
        connection = sqlite3.connect(self.database, timeout=10)
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA foreign_keys = ON")
        connection.execute("PRAGMA busy_timeout = 10000")
        try:
            yield connection
            connection.commit()
        except Exception:
            connection.rollback()
            raise
        finally:
            connection.close()

    def _initialize(self) -> None:
        with self._connect() as db:
            db.execute("PRAGMA journal_mode = WAL")
            version = db.execute("PRAGMA user_version").fetchone()[0]
            if version not in (0, SCHEMA_VERSION):
                raise JournalError(f"Journal schema version {version} is unsupported; use a reviewed migration.")
            if version == 0:
                db.executescript(
                    """
                    CREATE TABLE runs (
                        run_id TEXT PRIMARY KEY,
                        project_name TEXT NOT NULL,
                        project_path TEXT NOT NULL,
                        objective TEXT NOT NULL,
                        requirements_ref TEXT NOT NULL,
                        created_at TEXT NOT NULL
                    );
                    CREATE TABLE slices (
                        run_id TEXT NOT NULL REFERENCES runs(run_id),
                        slice_id TEXT NOT NULL,
                        title TEXT NOT NULL,
                        acceptance TEXT NOT NULL,
                        required_evidence TEXT NOT NULL,
                        created_at TEXT NOT NULL,
                        PRIMARY KEY(run_id, slice_id)
                    );
                    CREATE TABLE invocations (
                        invocation_id TEXT PRIMARY KEY,
                        run_id TEXT NOT NULL,
                        slice_id TEXT NOT NULL,
                        role TEXT NOT NULL,
                        started_at TEXT NOT NULL,
                        FOREIGN KEY(run_id, slice_id) REFERENCES slices(run_id, slice_id)
                    );
                    CREATE TABLE events (
                        event_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        run_id TEXT NOT NULL,
                        slice_id TEXT NOT NULL,
                        invocation_id TEXT NOT NULL,
                        event_type TEXT NOT NULL,
                        status TEXT NOT NULL,
                        summary TEXT NOT NULL,
                        gaps TEXT NOT NULL,
                        created_at TEXT NOT NULL,
                        counterparty_invocation_id TEXT,
                        FOREIGN KEY(invocation_id) REFERENCES invocations(invocation_id),
                        FOREIGN KEY(counterparty_invocation_id) REFERENCES invocations(invocation_id)
                    );
                    CREATE TABLE evidence (
                        evidence_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        event_id INTEGER NOT NULL REFERENCES events(event_id),
                        kind TEXT NOT NULL,
                        uri TEXT NOT NULL,
                        summary TEXT NOT NULL,
                        check_result TEXT NOT NULL
                    );
                    CREATE INDEX events_run_order ON events(run_id, event_id);
                    CREATE INDEX events_invocation_order ON events(invocation_id, event_id);
                    PRAGMA user_version = 1;
                    """
                )

    def register_run(
        self,
        run_id: Any,
        project_name: Any,
        project_path: Any,
        objective: Any,
        requirements_ref: Any = "",
    ) -> dict[str, Any]:
        run_id = _validate_id(run_id, "run_id")
        project_name = _clean_text(project_name, "project_name", 160)
        objective = _clean_text(objective, "objective", 1200)
        requirements_ref = _clean_text(requirements_ref, "requirements_ref", 500, optional=True)
        if not isinstance(project_path, str) or not Path(project_path).is_dir():
            raise JournalError("project_path must refer to an existing directory.")
        resolved = str(Path(project_path).resolve())
        with self._connect() as db:
            try:
                db.execute(
                    "INSERT INTO runs VALUES (?, ?, ?, ?, ?, ?)",
                    (run_id, project_name, resolved, objective, requirements_ref, _now()),
                )
            except sqlite3.IntegrityError as error:
                raise JournalError("That run_id is already registered; create a new run identifier.") from error
        return {"recorded": True, "run_id": run_id, "status": "active"}

    def register_slice(
        self,
        run_id: Any,
        slice_id: Any,
        title: Any,
        acceptance: Any,
        required_evidence: Any = None,
    ) -> dict[str, Any]:
        run_id = _validate_id(run_id, "run_id")
        slice_id = _validate_id(slice_id, "slice_id")
        title = _clean_text(title, "title", 200)
        acceptance = _clean_text(acceptance, "acceptance", 1600)
        required = DEFAULT_REQUIRED_EVIDENCE.copy() if required_evidence is None else required_evidence
        if not isinstance(required, list) or any(kind not in EVIDENCE_KINDS for kind in required):
            raise JournalError("required_evidence must be a list of supported evidence kinds.")
        if len(required) != len(set(required)):
            raise JournalError("required_evidence must not contain duplicates.")
        with self._connect() as db:
            if not db.execute("SELECT 1 FROM runs WHERE run_id = ?", (run_id,)).fetchone():
                raise JournalError("The run is not registered.")
            try:
                db.execute(
                    "INSERT INTO slices VALUES (?, ?, ?, ?, ?, ?)",
                    (run_id, slice_id, title, acceptance, json.dumps(required), _now()),
                )
            except sqlite3.IntegrityError as error:
                raise JournalError("That slice_id is already registered for this run.") from error
        return {"recorded": True, "run_id": run_id, "slice_id": slice_id}

    def start_invocation(
        self, run_id: Any, slice_id: Any, invocation_id: Any, role: Any
    ) -> dict[str, Any]:
        run_id = _validate_id(run_id, "run_id")
        slice_id = _validate_id(slice_id, "slice_id")
        invocation_id = _validate_id(invocation_id, "invocation_id")
        if role not in ROLES:
            raise JournalError(f"role must be one of: {', '.join(sorted(ROLES))}.")
        with self._connect() as db:
            if not db.execute(
                "SELECT 1 FROM slices WHERE run_id = ? AND slice_id = ?", (run_id, slice_id)
            ).fetchone():
                raise JournalError("The slice is not registered for this run.")
            try:
                db.execute(
                    "INSERT INTO invocations VALUES (?, ?, ?, ?, ?)",
                    (invocation_id, run_id, slice_id, role, _now()),
                )
            except sqlite3.IntegrityError as error:
                raise JournalError("That invocation_id is already registered.") from error
        return {"recorded": True, "invocation_id": invocation_id, "role": role}

    def _check_evidence(
        self,
        project_path: str,
        evidence: Any,
        required: list[str],
    ) -> tuple[list[dict[str, str]], list[str]]:
        if evidence is None:
            evidence = []
        if not isinstance(evidence, list):
            raise JournalError("evidence must be a list.")
        checked: list[dict[str, str]] = []
        gaps: list[str] = []
        supplied: set[str] = set()
        root = Path(project_path).resolve()
        for index, item in enumerate(evidence):
            if not isinstance(item, dict):
                raise JournalError(f"evidence[{index}] must be an object.")
            kind = item.get("kind")
            if kind not in EVIDENCE_KINDS:
                raise JournalError(f"evidence[{index}].kind must be one of: {', '.join(sorted(EVIDENCE_KINDS))}.")
            uri = _clean_text(item.get("uri"), f"evidence[{index}].uri", 800)
            summary = _clean_text(item.get("summary"), f"evidence[{index}].summary", 500)
            supplied.add(kind)
            result = "reference_only"
            if kind in {"test_result", "build_result", "review", "diff", "report"}:
                candidate = Path(uri)
                if not candidate.is_absolute():
                    candidate = root / candidate
                try:
                    resolved = candidate.resolve(strict=True)
                    resolved.relative_to(root)
                    if not resolved.is_file():
                        raise OSError("not a regular file")
                except (OSError, ValueError):
                    gaps.append(f"Evidence {kind} is missing or outside the registered project: {uri}")
                    result = "missing_or_outside_project"
                else:
                    result = "present_not_independently_verified"
                    if kind == "test_result":
                        trx_result = self._check_trx(resolved)
                        if trx_result == "tests_passed_mechanically":
                            result = "tests_passed_mechanically; not independently verified"
                        else:
                            result = trx_result
                            gaps.append(f"Test result did not establish a nonzero passing run: {uri} ({result})")
            checked.append({"kind": kind, "uri": uri, "summary": summary, "check_result": result})
        for kind in required:
            if kind not in supplied:
                gaps.append(f"Required evidence is missing: {kind}")
        return checked, gaps

    @staticmethod
    def _check_trx(path: Path) -> str:
        try:
            root = ET.parse(path).getroot()
            summary = next(node for node in root.iter() if node.tag.endswith("ResultSummary"))
            if summary.get("outcome") not in {"Completed", "Passed"}:
                return "tests_failed" if summary.get("outcome") == "Failed" else "trx_summary_not_passing"
            counters = summary.find(".//{*}Counters")
            if counters is None:
                return "trx_counters_missing"
            values = {name: int(counters.attrib[name])
                      for name in ("total", "executed", "passed", "failed", "notExecuted")}
            if any(value < 0 for value in values.values()):
                return "trx_counters_inconsistent"
            if values["executed"] == 0 or values["total"] == 0:
                return "zero_tests_executed"
            if values["failed"]:
                return "tests_failed"
            if values["notExecuted"]:
                return "tests_skipped_require_review"
            if values["total"] != values["executed"] or values["passed"] != values["executed"]:
                return "trx_counters_inconsistent"
            return "tests_passed_mechanically"
        except (ET.ParseError, OSError, StopIteration, ValueError, KeyError):
            return "trx_invalid_or_unreadable"

    def report(
        self,
        invocation_id: Any,
        event_type: Any,
        status: Any,
        summary: Any,
        evidence: Any = None,
        counterparty_invocation_id: Any = None,
    ) -> dict[str, Any]:
        invocation_id = _validate_id(invocation_id, "invocation_id")
        if event_type not in EVENT_TYPES:
            raise JournalError(f"event_type must be one of: {', '.join(sorted(EVENT_TYPES))}.")
        if status not in STATUSES:
            raise JournalError(f"status must be one of: {', '.join(sorted(STATUSES))}.")
        summary = _clean_text(summary, "summary", 2000)
        with self._connect() as db:
            invocation = db.execute(
                """SELECT i.*, r.project_path, s.required_evidence
                   FROM invocations i
                   JOIN runs r ON r.run_id = i.run_id
                   JOIN slices s ON s.run_id = i.run_id AND s.slice_id = i.slice_id
                   WHERE i.invocation_id = ?""",
                (invocation_id,),
            ).fetchone()
            if invocation is None:
                raise JournalError("The invocation is not registered.")
            counterparty = None
            if counterparty_invocation_id is not None:
                counterparty_id = _validate_id(counterparty_invocation_id, "counterparty_invocation_id")
                counterparty = db.execute(
                    "SELECT run_id, invocation_id FROM invocations WHERE invocation_id = ?",
                    (counterparty_id,),
                ).fetchone()
                if counterparty is None or counterparty["run_id"] != invocation["run_id"]:
                    raise JournalError("The counterparty invocation is not registered for this run.")
                if counterparty_id == invocation_id:
                    raise JournalError("A handoff must reference a different invocation.")
            if event_type in {"handoff_sent", "handoff_received"} and counterparty is None:
                raise JournalError("Handoff events require a registered counterparty_invocation_id.")
            required = json.loads(invocation["required_evidence"])
            checked, gaps = self._check_evidence(
                invocation["project_path"],
                evidence,
                required if status == "claimed_complete" else [],
            )
            if status == "claimed_complete" and gaps:
                visible_status = "claimed_with_gaps"
            elif status == "claimed_complete":
                visible_status = "claim_recorded_not_verified"
                gaps.append("Completion remains a worker claim; independent review and parent acceptance are not inferred by the journal.")
            else:
                visible_status = status
            cursor = db.execute(
                """INSERT INTO events
                   (run_id, slice_id, invocation_id, event_type, status, summary, gaps, created_at,
                    counterparty_invocation_id)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    invocation["run_id"],
                    invocation["slice_id"],
                    invocation_id,
                    event_type,
                    visible_status,
                    summary,
                    json.dumps(gaps),
                    _now(),
                    counterparty["invocation_id"] if counterparty else None,
                ),
            )
            event_id = cursor.lastrowid
            for item in checked:
                db.execute(
                    "INSERT INTO evidence (event_id, kind, uri, summary, check_result) VALUES (?, ?, ?, ?, ?)",
                    (event_id, item["kind"], item["uri"], item["summary"], item["check_result"]),
                )
        return {
            "recorded": True,
            "event_id": event_id,
            "status": visible_status,
            "gaps": gaps,
            "evidence": checked,
            "notice": "Journal status and mechanical file checks are not an independent product review or completion verification.",
        }

    def list_runs(self) -> list[dict[str, Any]]:
        with self._connect() as db:
            rows = db.execute(
                """SELECT r.run_id, r.project_name, r.objective, r.created_at,
                          (SELECT COUNT(*) FROM slices s WHERE s.run_id = r.run_id) AS slice_count,
                          (SELECT COUNT(*) FROM events e WHERE e.run_id = r.run_id) AS event_count
                   FROM runs r ORDER BY r.created_at DESC LIMIT 100"""
            ).fetchall()
        return [dict(row) for row in rows]

    def get_run(self, run_id: Any) -> dict[str, Any]:
        run_id = _validate_id(run_id, "run_id")
        with self._connect() as db:
            run = db.execute(
                "SELECT run_id, project_name, project_path, objective, requirements_ref, created_at FROM runs WHERE run_id = ?",
                (run_id,),
            ).fetchone()
            if run is None:
                raise JournalError("The run is not registered.")
            slices = db.execute(
                "SELECT slice_id, title, acceptance, required_evidence, created_at FROM slices WHERE run_id = ? ORDER BY created_at, slice_id",
                (run_id,),
            ).fetchall()
            invocations = db.execute(
                """SELECT i.invocation_id, i.slice_id, i.role, i.started_at,
                          COALESCE(e.status, 'registered') AS status,
                          e.created_at AS last_reported_at
                   FROM invocations i
                   LEFT JOIN events e ON e.event_id = (
                       SELECT MAX(latest.event_id) FROM events latest
                       WHERE latest.invocation_id = i.invocation_id
                   )
                   WHERE i.run_id = ? ORDER BY i.started_at, i.invocation_id""",
                (run_id,),
            ).fetchall()
            events = db.execute(
                """SELECT e.event_id, e.slice_id, e.invocation_id, i.role AS role,
                          e.counterparty_invocation_id, peer.role AS counterparty_role,
                          e.event_type, e.status, e.summary, e.gaps, e.created_at
                   FROM events e
                   JOIN invocations i ON i.invocation_id = e.invocation_id
                   LEFT JOIN invocations peer ON peer.invocation_id = e.counterparty_invocation_id
                   WHERE e.run_id = ? ORDER BY e.event_id""",
                (run_id,),
            ).fetchall()
            event_items = []
            for event in events:
                item = dict(event)
                item["gaps"] = json.loads(item["gaps"])
                item["evidence"] = [
                    dict(row)
                    for row in db.execute(
                        "SELECT kind, uri, summary, check_result FROM evidence WHERE event_id = ? ORDER BY evidence_id",
                        (item["event_id"],),
                    )
                ]
                event_items.append(item)
            latest_by_slice: dict[str, str] = {}
            for item in event_items:
                latest_by_slice[item["slice_id"]] = item["status"]
        run_data = dict(run)
        run_data["slices"] = [
            {
                **dict(row),
                "required_evidence": json.loads(row["required_evidence"]),
                "status": latest_by_slice.get(row["slice_id"], "queued"),
            }
            for row in slices
        ]
        run_data["events"] = event_items
        run_data["invocations"] = [dict(row) for row in invocations]
        return run_data
