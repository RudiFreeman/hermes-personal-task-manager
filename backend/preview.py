"""Loopback-only development preview of the same UI and SQLite store. No dependencies."""
import argparse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
import secrets
from urllib.parse import urlsplit, parse_qs
if __package__:
    from .store import Store, TaskError
else:
    from store import Store, TaskError

ROOT = Path(__file__).resolve().parents[1]
API = "/api/plugins/personal-task-manager/tasks"


def make_server(port=8765, db_path=None):
    token = secrets.token_urlsafe(32)
    store = Store(db_path or ROOT / ".local" / "tasks.db")

    class Handler(BaseHTTPRequestHandler):
        def reply(self, status, payload, content_type="application/json; charset=utf-8"):
            body = json.dumps(payload, ensure_ascii=False).encode("utf-8") if content_type.startswith("application/json") else payload
            self.send_response(status)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.send_header("X-Content-Type-Options", "nosniff")
            self.send_header("X-Frame-Options", "DENY")
            self.send_header("Content-Security-Policy", "default-src 'self'; script-src 'self' 'nonce-" + token + "'; style-src 'self' 'unsafe-inline'; connect-src 'self'; frame-ancestors 'none'")
            self.end_headers()
            self.wfile.write(body)

        def handle_request(self):
            authority = f"127.0.0.1:{self.server.server_port}"
            if self.headers.get("Host") != authority:
                self.reply(403, {"detail": self.error("Use the 127.0.0.1 address")})
                return
            path = urlsplit(self.path).path
            if self.command == "GET" and path == "/":
                html = f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>My Tasks</title>
<link rel="stylesheet" href="/style.css"><style>body{{margin:0;background:#efeff5;padding:36px 16px}}@media(max-width:600px){{body{{padding:8px}}}}@media(prefers-color-scheme:dark){{body{{background:#17171d}}}}</style>
</head><body><div id="app"></div><script nonce="{token}">window.__PTM_LOCAL_PREVIEW__={json.dumps(token)};</script><script src="/preview.js"></script></body></html>"""
                self.reply(200, html.encode("utf-8"), "text/html; charset=utf-8")
                return
            if self.command == "GET" and path in {"/index.js", "/preview.js", "/style.css"}:
                asset = ROOT / "dashboard" / "dist" / path[1:]
                self.reply(200, asset.read_bytes(), "text/javascript; charset=utf-8" if path.endswith(".js") else "text/css; charset=utf-8")
                return
            if self.headers.get("X-PTM-Token") != token:
                self.reply(401, {"detail": self.error("Local API access denied")})
                return
            if self.headers.get("Origin") not in {None, f"http://{authority}"}:
                self.reply(403, {"detail": self.error("Request origin is not allowed")})
                return
            try:
                if self.command == "GET" and path == API:
                    result = store.snapshot()
                elif self.command in {"POST", "PATCH"}:
                    if self.headers.get("Content-Type", "").split(";")[0] != "application/json":
                        raise TaskError("Expected application/json")
                    length = int(self.headers.get("Content-Length", "0"))
                    if not 0 < length <= 3_000_000:
                        raise TaskError("Invalid request size")
                    body = json.loads(self.rfile.read(length))
                    if not isinstance(body, dict):
                        raise TaskError("Expected a JSON object")
                    if self.command == "POST" and path == API:
                        if set(body) - {"title", "description", "parent_id", "subtasks"}:
                            raise TaskError("Unknown field")
                        result = store.add(**body)
                    elif self.command == "PATCH" and path.startswith(API + "/"):
                        revision = body.pop("revision", None)
                        if type(revision) is not int or revision < 1:
                            raise TaskError("A task revision is required")
                        result = store.update(path[len(API) + 1:], body, expected_revision=revision)
                    else:
                        self.reply(404, {"detail": self.error("Not found")})
                        return
                else:
                    self.reply(404, {"detail": self.error("Not found")})
                    return
                self.reply(200, result)
            except TaskError as exc:
                self.reply(409, {"detail": exc.localized(self.language())})
            except (ValueError, TypeError):
                self.reply(409, {"detail": self.error("Invalid request data")})
            except Exception:
                self.log_error("Storage operation failed")
                self.reply(500, {"detail": self.error("Unable to save data")})

        def error(self, english):
            return TaskError(english).localized(self.language())

        def language(self):
            return parse_qs(urlsplit(self.path).query).get("language", [self.headers.get("Accept-Language", "en")])[0]

        do_GET = handle_request
        do_POST = handle_request
        do_PATCH = handle_request

    return ThreadingHTTPServer(("127.0.0.1", port), Handler)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8765)
    args = parser.parse_args()
    server = make_server(args.port)
    print(f"Personal Task Manager: http://127.0.0.1:{server.server_port}", flush=True)
    print(f"Data: {ROOT / '.local' / 'tasks.db'}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
