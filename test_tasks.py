"""Behavior tests for shared UI / Hermes data, with temporary databases only."""
from concurrent.futures import ThreadPoolExecutor
import importlib.util
import json
from pathlib import Path
import re
import sys
import threading
from urllib.error import HTTPError
from urllib.request import Request, urlopen

import pytest

# GitHub's repository name contains hyphens, so load the plugin under an explicit
# package name rather than relying on the checkout directory being importable.
spec = importlib.util.spec_from_file_location(
    "ptm_test_plugin", Path(__file__).with_name("__init__.py"),
    submodule_search_locations=[str(Path(__file__).parent)],
)
plugin = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = plugin
spec.loader.exec_module(plugin)
register = plugin.register
tools = __import__("ptm_test_plugin.tools", fromlist=["tools"])
storage = __import__("ptm_test_plugin.store", fromlist=["Store"])
preview = __import__("ptm_test_plugin.preview", fromlist=["make_server"])
Store, TaskError = storage.Store, storage.TaskError
API, make_server = preview.API, preview.make_server


@pytest.fixture
def store(tmp_path, monkeypatch):
    monkeypatch.setenv("PTM_DATA_DIR", str(tmp_path))
    return Store()


def test_task_and_subtasks_survive_reopening(store):
    task = store.add("Подключить почту", "Проверить доступ", subtasks=[
        {"title": "Выбрать способ", "description": "OAuth"}, {"title": "Проверить чтение"}])
    snapshot = Store(store.path).snapshot()
    assert len(snapshot["tasks"]) == 3
    assert sum(t["parent_id"] == task["id"] for t in snapshot["tasks"]) == 2
    assert snapshot["progress"] == {"done": 0, "total": 1, "percent": 0}


def test_completion_requires_children_and_does_not_complete_parent(store):
    parent = store.add("Почта", subtasks=[{"title": "Доступ"}])
    child = next(t for t in store.snapshot()["tasks"] if t["parent_id"])
    with pytest.raises(TaskError, match="subtasks first"):
        store.update(parent["id"], {"done": True})
    store.update(child["id"], {"done": True})
    assert store.snapshot()["progress"]["done"] == 0
    store.update(parent["id"], {"done": True})
    assert Store(store.path).snapshot()["progress"]["percent"] == 100
    with pytest.raises(TaskError, match="parent task"):
        store.update(child["id"], {"done": False})
    store.update(parent["id"], {"done": False})
    assert store.snapshot()["progress"]["done"] == 0


def test_hermes_and_ui_share_data_and_evidence(store):
    result = json.loads(tools.personal_tasks_add({"title": "Почта", "subtasks": [{"title": "Доступ"}]}))
    assert result["ok"]
    snapshot = store.snapshot()
    child = next(t for t in snapshot["tasks"] if t["parent_id"])
    bad = json.loads(tools.personal_tasks_update({"task_id": child["id"], "revision": child["revision"], "done": True}))
    assert not bad["ok"]
    good = json.loads(tools.personal_tasks_update({"task_id": child["id"], "revision": child["revision"], "done": True,
                                                 "comment": "Пользователь подтвердил успешное чтение письма"}))
    assert good["ok"]
    snapshot = json.loads(tools.personal_tasks_list({}))["result"]
    assert snapshot["comments"][0]["actor"] == "hermes"
    assert snapshot["events"][-1]["action"] == "completed"
    assert snapshot["progress"]["done"] == 0


def test_stale_writes_preserve_the_other_writer(store):
    task = store.add("Первое название")
    store.update(task["id"], {"title": "Изменено в чате"}, expected_revision=1)
    with pytest.raises(TaskError, match="has changed"):
        store.update(task["id"], {"title": "Устаревшая вкладка"}, expected_revision=1)
    assert store.snapshot()["tasks"][0]["title"] == "Изменено в чате"


def test_invalid_subtasks_are_atomic(store):
    with pytest.raises(TaskError):
        store.add("План", subtasks=[{"title": "Первый"}, {"title": " "}])
    assert store.snapshot()["tasks"] == []
    task = store.add("План", subtasks=[{"title": "Шаг"}])
    child = next(t for t in store.snapshot()["tasks"] if t["parent_id"])
    with pytest.raises(TaskError):
        store.add("Третий уровень", parent_id=child["id"])
    assert len(store.snapshot()["tasks"]) == 2


def test_completion_is_idempotent_and_reversible(store):
    task = store.add("Задача")
    store.update(task["id"], {"done": True})
    before = store.snapshot()
    store.update(task["id"], {"done": True})
    assert store.snapshot() == before
    store.update(task["id"], {"done": False})
    assert store.snapshot()["tasks"][0]["completed_at"] is None


def test_sql_html_and_shell_are_only_stored_text(store):
    title = "<script>alert(1)</script> '; DROP TABLE tasks; -- $(whoami)"
    task = store.add(title)
    store.update(task["id"], {"comment": "<img src=x onerror=alert(1)>"})
    snapshot = store.snapshot()
    assert snapshot["tasks"][0]["title"] == title
    assert snapshot["comments"][0]["body"].startswith("<img")


def test_registration_and_invocation_through_host_contract(store):
    class Context:
        def __init__(self):
            self.tools = {}

        def register_tool(self, **kwargs):
            self.tools[kwargs["name"]] = kwargs

    ctx = Context()
    register(ctx)
    assert len(ctx.tools) == 3
    handler = ctx.tools["personal_tasks_add"]["handler"]
    result = json.loads(handler({"title": "Из Telegram"}, conversation_id="conversation-1"))
    assert result["ok"]
    assert store.snapshot()["tasks"][0]["title"] == "Из Telegram"


def test_concurrent_writes_do_not_lose_tasks(store):
    with ThreadPoolExecutor(max_workers=4) as pool:
        list(pool.map(lambda i: Store(store.path).add(f"Задача {i}"), range(12)))
    assert len(store.snapshot()["tasks"]) == 12


def test_preview_api_auth_create_complete_and_restart(tmp_path):
    server = make_server(0, tmp_path / "preview.db")
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    base = f"http://127.0.0.1:{server.server_port}"
    try:
        with urlopen(base) as response:
            html = response.read().decode()
        assert '<html lang="en">' in html
        assert '<title>My Tasks</title>' in html
        token = re.search(r'window.__PTM_LOCAL_PREVIEW__="([^"]+)"', html).group(1)
        with pytest.raises(HTTPError) as denied:
            urlopen(base + API)
        assert denied.value.code == 401

        def request(path, method="GET", body=None, origin=None, language=None):
            headers = {"X-PTM-Token": token, "Content-Type": "application/json"}
            if language:
                headers["Accept-Language"] = language
            if origin:
                headers["Origin"] = origin
            req = Request(base + path, data=json.dumps(body).encode() if body is not None else None,
                          headers=headers, method=method)
            with urlopen(req) as response:
                return json.loads(response.read())

        with pytest.raises(HTTPError) as cross_origin:
            request(API, origin="https://untrusted.example")
        assert cross_origin.value.code == 403
        for language, expected in [(None, "title: must contain"), ("ru-RU,ru;q=0.9", "Название: от"), ("fr", "title: must contain")]:
            with pytest.raises(HTTPError) as invalid:
                request(API, "POST", {"title": " "}, language=language)
            assert expected in json.load(invalid.value)["detail"]
        task = request(API, "POST", {"title": "Из интерфейса"})
        request(API + "/" + task["id"], "PATCH", {"revision": 1, "done": True})
        assert request(API)["progress"]["percent"] == 100
        assert Store(tmp_path / "preview.db").snapshot()["tasks"][0]["done"]
        with pytest.raises(HTTPError):
            request(API + "/" + task["id"], "PATCH", {"revision": 1, "done": False})
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=2)


def test_validation_errors_default_to_english_and_support_russian(store):
    with pytest.raises(TaskError) as invalid:
        store.add(" ")
    assert str(invalid.value).startswith("title: must contain")
    assert invalid.value.localized("ru").startswith("Название: от")
    assert invalid.value.localized("en-US") == str(invalid.value)
    assert invalid.value.localized("de") == str(invalid.value)
    result = json.loads(tools.personal_tasks_update({"task_id": "unknown"}))
    assert result["error"] == "Read the list first and supply the task revision"
