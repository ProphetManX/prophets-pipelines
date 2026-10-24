from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from agent_suite.journal import Journal
from agent_suite.mcp_server import TOOLS, JournalTools, handle_request


class McpServerTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        self.project = self.root / "project"
        self.project.mkdir()
        self.tools = JournalTools(Journal(self.root / "journal.sqlite3"))

    def tearDown(self):
        self.temporary.cleanup()

    def request(self, method, params=None, identifier=1):
        return handle_request(
            {"jsonrpc": "2.0", "id": identifier, "method": method, "params": params or {}},
            self.tools,
        )

    def test_initialize_negotiates_and_advertises_tools(self):
        initialized = self.request("initialize", {"protocolVersion": "2025-06-18"})
        self.assertEqual("2025-06-18", initialized["result"]["protocolVersion"])
        self.assertIn("tools", initialized["result"]["capabilities"])
        listed = self.request("tools/list")
        names = {tool["name"] for tool in listed["result"]["tools"]}
        self.assertIn("journal_report", names)
        self.assertEqual(len(TOOLS), len(names))

    def test_initialize_selects_supported_version_instead_of_echoing_unsupported_request(self):
        initialized = self.request("initialize", {"protocolVersion": "2099-01-01"})
        self.assertEqual("2025-06-18", initialized["result"]["protocolVersion"])
        self.assertIn("tools", initialized["result"]["capabilities"])

    def test_list_runs_tools_call_returns_an_object_with_an_empty_runs_array(self):
        response = self.request("tools/call", {"name": "journal_list_runs", "arguments": {}})

        self.assertFalse(response["result"]["isError"])
        structured = response["result"]["structuredContent"]
        self.assertIsInstance(structured, dict)
        self.assertEqual({"runs": []}, structured)
        self.assertEqual(structured, json.loads(response["result"]["content"][0]["text"]))

    def test_list_runs_tools_call_wraps_registered_runs_without_losing_them(self):
        for run_id in ("run-1", "run-2"):
            self.tools.call(
                "journal_register_run",
                {
                    "run_id": run_id,
                    "project_name": "Logger",
                    "project_path": str(self.project),
                    "objective": "Test " + run_id,
                },
            )
        response = self.request("tools/call", {"name": "journal_list_runs", "arguments": {}})

        self.assertFalse(response["result"]["isError"])
        structured = response["result"]["structuredContent"]
        self.assertIsInstance(structured, dict)
        self.assertIn("runs", structured)
        self.assertIsInstance(structured["runs"], list)
        self.assertEqual(2, len(structured["runs"]))
        self.assertEqual({"run-1", "run-2"}, {run["run_id"] for run in structured["runs"]})
        self.assertEqual(structured, json.loads(response["result"]["content"][0]["text"]))

    def test_missing_evidence_returns_a_tool_error_and_stores_no_false_success(self):
        self.tools.call(
            "journal_register_run",
            {"run_id": "run", "project_name": "Logger", "project_path": str(self.project), "objective": "Test"},
        )
        self.tools.call(
            "journal_register_slice",
            {"run_id": "run", "slice_id": "slice", "title": "Slice", "acceptance": "Approved"},
        )
        self.tools.call(
            "journal_start_invocation",
            {"run_id": "run", "slice_id": "slice", "invocation_id": "build-1", "role": "build"},
        )
        response = self.request(
            "tools/call",
            {
                "name": "journal_report",
                "arguments": {
                    "invocation_id": "build-1",
                    "event_type": "completion_claimed",
                    "status": "claimed_complete",
                    "summary": "Done",
                },
            },
        )
        self.assertTrue(response["result"]["isError"] is False)
        self.assertEqual("claimed_with_gaps", response["result"]["structuredContent"]["status"])
        self.assertTrue(response["result"]["structuredContent"]["gaps"])

    def test_unknown_tool_returns_explicit_error(self):
        response = self.request("tools/call", {"name": "journal_drop_database", "arguments": {}})
        self.assertTrue(response["result"]["isError"])

    def test_notifications_do_not_emit_responses(self):
        result = handle_request(
            {"jsonrpc": "2.0", "method": "notifications/initialized"}, self.tools
        )
        self.assertIsNone(result)

    def test_unsupported_method_uses_json_rpc_error(self):
        result = self.request("arbitrary/sql")
        self.assertEqual(-32601, result["error"]["code"])


if __name__ == "__main__":
    unittest.main()
