from __future__ import annotations

import json
import sys
from typing import Any

from .journal import Journal, JournalError


SERVER_NAME = "pw-journal"
SERVER_VERSION = "3.0.0"
PROTOCOL_VERSION = "2025-06-18"

TOOLS = [
    {
        "name": "journal_register_run",
        "description": "Register a new approved assignment in the local append-only activity journal. This does not grant work or operation authority.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "run_id": {"type": "string"},
                "project_name": {"type": "string"},
                "project_path": {"type": "string"},
                "objective": {"type": "string"},
                "requirements_ref": {"type": "string"},
            },
            "required": ["run_id", "project_name", "project_path", "objective"],
            "additionalProperties": False,
        },
    },
    {
        "name": "journal_register_slice",
        "description": "Register one approved work slice and its agreed evidence kinds. If omitted, completion claims require test_result and review evidence; provide an explicit list for a different approved evidence policy.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "run_id": {"type": "string"},
                "slice_id": {"type": "string"},
                "title": {"type": "string"},
                "acceptance": {"type": "string"},
                "required_evidence": {
                    "type": "array",
                    "description": "Evidence kinds required for a completion claim. Defaults to test_result and review when omitted.",
                    "items": {
                        "type": "string",
                        "enum": ["test_result", "build_result", "review", "diff", "report", "other"],
                    },
                },
            },
            "required": ["run_id", "slice_id", "title", "acceptance"],
            "additionalProperties": False,
        },
    },
    {
        "name": "journal_start_invocation",
        "description": "Register a unique worker invocation against an existing approved run and slice.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "run_id": {"type": "string"},
                "slice_id": {"type": "string"},
                "invocation_id": {"type": "string"},
                "role": {
                    "type": "string",
                    "enum": ["lead", "design", "investigate", "tests", "build", "review"],
                },
            },
            "required": ["run_id", "slice_id", "invocation_id", "role"],
            "additionalProperties": False,
        },
    },
    {
        "name": "journal_report",
        "description": "Append an observable worker milestone, blocker, review, completion claim, or interruption. Completion is never independently verified by this tool.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "invocation_id": {"type": "string"},
                "event_type": {
                    "type": "string",
                    "enum": [
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
                    ],
                },
                "status": {
                    "type": "string",
                    "enum": [
                        "queued",
                        "in_progress",
                        "awaiting_review",
                        "claimed_complete",
                        "blocked",
                        "failed",
                        "interrupted",
                    ],
                },
                "summary": {"type": "string"},
                "counterparty_invocation_id": {"type": "string"},
                "evidence": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "kind": {
                                "type": "string",
                                "enum": ["test_result", "build_result", "review", "diff", "report", "other"],
                            },
                            "uri": {"type": "string"},
                            "summary": {"type": "string"},
                        },
                        "required": ["kind", "uri", "summary"],
                        "additionalProperties": False,
                    },
                },
            },
            "required": ["invocation_id", "event_type", "status", "summary"],
            "additionalProperties": False,
        },
    },
    {
        "name": "journal_list_runs",
        "description": "List recent local journal runs and recorded activity counts.",
        "inputSchema": {"type": "object", "properties": {}, "additionalProperties": False},
    },
    {
        "name": "journal_get_run",
        "description": "Read one run, its registered slices, append-only event history, gaps, and evidence references.",
        "inputSchema": {
            "type": "object",
            "properties": {"run_id": {"type": "string"}},
            "required": ["run_id"],
            "additionalProperties": False,
        },
    },
]


class JournalTools:
    def __init__(self, journal: Journal | None = None):
        self.journal = journal or Journal.from_environment()

    def call(self, name: str, arguments: dict[str, Any]) -> dict[str, Any]:
        if not isinstance(arguments, dict):
            raise JournalError("Tool arguments must be a JSON object.")
        methods = {
            "journal_register_run": self.journal.register_run,
            "journal_register_slice": self.journal.register_slice,
            "journal_start_invocation": self.journal.start_invocation,
            "journal_report": self.journal.report,
            "journal_list_runs": self.journal.list_runs,
            "journal_get_run": self.journal.get_run,
        }
        method = methods.get(name)
        if method is None:
            raise JournalError(f"Unknown journal tool: {name}.")
        result = method(**arguments)
        return {"runs": result} if name == "journal_list_runs" else result


def _message(identifier: Any, result: Any) -> dict[str, Any]:
    return {"jsonrpc": "2.0", "id": identifier, "result": result}


def _error(identifier: Any, code: int, message: str) -> dict[str, Any]:
    return {"jsonrpc": "2.0", "id": identifier, "error": {"code": code, "message": message}}


def handle_request(request: dict[str, Any], tools: JournalTools) -> dict[str, Any] | None:
    if not isinstance(request, dict) or request.get("jsonrpc") != "2.0":
        return _error(request.get("id") if isinstance(request, dict) else None, -32600, "Invalid JSON-RPC request.")
    identifier = request.get("id")
    method = request.get("method")
    params = request.get("params", {})
    if not isinstance(method, str) or not isinstance(params, dict):
        return _error(identifier, -32600, "Invalid JSON-RPC request.")
    if identifier is None and method.startswith("notifications/"):
        return None
    if method == "initialize":
        return _message(
            identifier,
            {
                "protocolVersion": PROTOCOL_VERSION,
                "capabilities": {"tools": {"listChanged": False}},
                "serverInfo": {"name": SERVER_NAME, "version": SERVER_VERSION},
                "instructions": "Local append-only work journal. Recorded activity and mechanical checks are not independent approval or product verification.",
            },
        )
    if method == "notifications/initialized":
        return None
    if method == "ping":
        return _message(identifier, {})
    if method == "tools/list":
        return _message(identifier, {"tools": TOOLS})
    if method == "tools/call":
        name = params.get("name")
        arguments = params.get("arguments", {})
        try:
            result = tools.call(name, arguments)
        except (JournalError, TypeError) as error:
            payload = {"error": str(error)}
            return _message(
                identifier,
                {"content": [{"type": "text", "text": json.dumps(payload)}], "structuredContent": payload, "isError": True},
            )
        return _message(
            identifier,
            {
                "content": [{"type": "text", "text": json.dumps(result, ensure_ascii=False)}],
                "structuredContent": result,
                "isError": False,
            },
        )
    return _error(identifier, -32601, f"Unsupported method: {method}.")


def serve() -> None:
    tools = JournalTools()
    for raw_line in sys.stdin.buffer:
        try:
            request = json.loads(raw_line)
        except (json.JSONDecodeError, UnicodeDecodeError):
            response = _error(None, -32700, "Parse error.")
        else:
            response = handle_request(request, tools)
        if response is not None:
            sys.stdout.buffer.write((json.dumps(response, separators=(",", ":"), ensure_ascii=False) + "\n").encode("utf-8"))
            sys.stdout.buffer.flush()


if __name__ == "__main__":
    serve()
