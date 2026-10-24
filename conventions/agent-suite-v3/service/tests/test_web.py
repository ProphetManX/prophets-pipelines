from __future__ import annotations

import json
import tempfile
import threading
import unittest
from http.server import ThreadingHTTPServer
from pathlib import Path
from unittest.mock import patch
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from agent_suite.journal import Journal
from agent_suite.web import make_handler


class DashboardTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        self.project = self.root / "project"
        self.project.mkdir()
        self.journal = Journal(self.root / "journal.sqlite3")
        self.journal.register_run("run-1", "Logger", str(self.project), "See approved work")
        self.server = ThreadingHTTPServer(("127.0.0.1", 0), make_handler(self.journal))
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.base_url = f"http://127.0.0.1:{self.server.server_address[1]}"

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join(timeout=2)
        self.temporary.cleanup()

    def test_health_and_local_run_api(self):
        with urlopen(self.base_url + "/health") as response:
            self.assertEqual("ok", json.load(response)["status"])
            self.assertEqual("nosniff", response.headers["X-Content-Type-Options"])
            self.assertEqual("no-store", response.headers["Cache-Control"])
        with urlopen(self.base_url + "/api/runs") as response:
            self.assertEqual("run-1", json.load(response)["runs"][0]["run_id"])
        with urlopen(self.base_url + "/api/runs/run-1") as response:
            self.assertEqual("See approved work", json.load(response)["objective"])

    def test_page_uses_local_static_resources(self):
        for path, expected_type in (("/", "text/html"), ("/app.js", "text/javascript"), ("/styles.css", "text/css")):
            with urlopen(self.base_url + path) as response:
                self.assertIn(expected_type, response.headers["Content-Type"])

    def test_dashboard_is_read_only(self):
        request = Request(self.base_url + "/api/runs", data=b"{}", method="POST")
        with self.assertRaises(HTTPError) as error:
            urlopen(request)
        self.assertEqual(405, error.exception.code)

    def test_unknown_run_and_paths_are_not_exposed(self):
        with self.assertRaises(HTTPError) as error:
            urlopen(self.base_url + "/api/runs/missing")
        self.assertEqual(404, error.exception.code)
        with self.assertRaises(HTTPError) as error:
            urlopen(self.base_url + "/../../journal.sqlite3")
        self.assertEqual(404, error.exception.code)

    def test_server_refuses_non_loopback_binding(self):
        from agent_suite.web import serve

        with self.assertRaisesRegex(ValueError, "loopback"):
            serve("0.0.0.0", 47831)

    def test_server_refuses_a_second_listener_on_the_dashboard_port(self):
        from agent_suite.web import serve

        with patch("agent_suite.web.Journal.from_environment", return_value=self.journal):
            with patch.object(ThreadingHTTPServer, "serve_forever"):
                with self.assertRaises(OSError):
                    serve("127.0.0.1", self.server.server_address[1])


if __name__ == "__main__":
    unittest.main()
