from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


class McpStdioTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.project = self.root / "project"
        self.project.mkdir()

    def test_unicode_run_roundtrips_as_utf8_with_cp1252_stdio(self):
        title = "caf\u00e9 \u2194 \u65e5\u672c\u8a9e \U0001f680"
        run_id = "unicode-stdio"
        requests = [
            {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "initialize",
                "params": {
                    "protocolVersion": "2025-06-18",
                    "capabilities": {},
                    "clientInfo": {"name": "stdio-regression", "version": "1"},
                },
            },
            {"jsonrpc": "2.0", "method": "notifications/initialized"},
            {
                "jsonrpc": "2.0",
                "id": 2,
                "method": "tools/call",
                "params": {
                    "name": "journal_register_run",
                    "arguments": {
                        "run_id": run_id,
                        "project_name": "Stdio regression",
                        "project_path": str(self.project),
                        # The run's descriptive field is named objective in the tool schema.
                        "objective": title,
                    },
                },
            },
            {
                "jsonrpc": "2.0",
                "id": 3,
                "method": "tools/call",
                "params": {
                    "name": "journal_get_run",
                    "arguments": {"run_id": run_id},
                },
            },
        ]
        payload = "".join(
            json.dumps(request, ensure_ascii=False) + "\n" for request in requests
        ).encode("utf-8")
        environment = os.environ.copy()
        environment.pop("PYTHONUTF8", None)
        environment.update(
            PYTHONIOENCODING="cp1252",
            PYTHONDONTWRITEBYTECODE="1",
            PYTHONPATH=str(Path(__file__).resolve().parents[1]),
            PW_AGENT_SUITE_HOME=str(self.root / "suite"),
        )

        with subprocess.Popen(
            [sys.executable, "-B", "-m", "agent_suite.mcp_server"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            cwd=self.root,
            env=environment,
        ) as process:
            try:
                stdout, stderr = process.communicate(payload, timeout=20)
            except subprocess.TimeoutExpired:
                process.kill()
                stdout, stderr = process.communicate(timeout=5)
                self.fail(
                    "MCP subprocess timed out.\n"
                    f"stdout bytes: {stdout!r}\n"
                    f"stderr:\n{stderr.decode('utf-8', errors='backslashreplace')}"
                )
            self.assertEqual(
                0,
                process.returncode,
                f"MCP subprocess exit code: {process.returncode}\n"
                f"stdout bytes: {stdout!r}\n"
                f"stderr:\n{stderr.decode('utf-8', errors='backslashreplace')}",
            )

        frames = [json.loads(line) for line in stdout.decode("utf-8").splitlines()]
        responses = {frame["id"]: frame for frame in frames}
        self.assertNotIn("error", responses[1])
        self.assertFalse(responses[2]["result"]["isError"])
        retrieved = responses[3]["result"]
        self.assertFalse(retrieved["isError"])
        self.assertEqual(run_id, retrieved["structuredContent"]["run_id"])
        self.assertEqual(title, retrieved["structuredContent"]["objective"])
        text_content = next(item["text"] for item in retrieved["content"] if item["type"] == "text")
        self.assertEqual(title, json.loads(text_content)["objective"])


if __name__ == "__main__":
    unittest.main()
