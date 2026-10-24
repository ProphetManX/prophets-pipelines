from __future__ import annotations

import json
import re
import socket
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote

from .journal import Journal, JournalError


RUN_ID_PATH = re.compile(r"^/api/runs/([A-Za-z0-9][A-Za-z0-9._:-]{0,127})$")
STATIC_FILES = {
    "/": ("index.html", "text/html; charset=utf-8"),
    "/app.js": ("app.js", "text/javascript; charset=utf-8"),
    "/styles.css": ("styles.css", "text/css; charset=utf-8"),
}
STATIC_ROOT = Path(__file__).with_name("static")


class DashboardServer(ThreadingHTTPServer):
    allow_reuse_address = False

    def server_bind(self) -> None:
        if hasattr(socket, "SO_EXCLUSIVEADDRUSE"):
            self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_EXCLUSIVEADDRUSE, 1)
        super().server_bind()


def make_handler(journal: Journal):
    class DashboardHandler(BaseHTTPRequestHandler):
        server_version = "PWAgentDashboard/3"

        def _send(self, status: int, body: bytes, content_type: str) -> None:
            self.send_response(status)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.send_header("X-Content-Type-Options", "nosniff")
            self.send_header("Referrer-Policy", "no-referrer")
            self.send_header("Content-Security-Policy", "default-src 'self'; object-src 'none'; frame-ancestors 'none'")
            self.end_headers()
            self.wfile.write(body)

        def _json(self, status: int, value) -> None:
            self._send(
                status,
                json.dumps(value, ensure_ascii=False).encode("utf-8"),
                "application/json; charset=utf-8",
            )

        def do_GET(self) -> None:
            if self.path == "/health":
                self._json(200, {"status": "ok", "service": "pw-agent-dashboard"})
                return
            if self.path == "/api/runs":
                self._json(200, {"runs": journal.list_runs()})
                return
            match = RUN_ID_PATH.fullmatch(unquote(self.path))
            if match:
                try:
                    self._json(200, journal.get_run(match.group(1)))
                except JournalError as error:
                    self._json(404, {"error": str(error)})
                return
            static = STATIC_FILES.get(self.path)
            if static:
                name, content_type = static
                self._send(200, (STATIC_ROOT / name).read_bytes(), content_type)
                return
            self._json(404, {"error": "Not found."})

        def do_POST(self) -> None:
            self._json(405, {"error": "This dashboard is read-only."})

        def log_message(self, _format: str, *_args) -> None:
            return

    return DashboardHandler


def serve(host: str = "127.0.0.1", port: int = 47831) -> None:
    if host not in {"127.0.0.1", "::1", "localhost"}:
        raise ValueError("Dashboard host must be a loopback address.")
    server = DashboardServer((host, port), make_handler(Journal.from_environment()))
    server.daemon_threads = True
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=47831)
    options = parser.parse_args()
    serve(options.host, options.port)
