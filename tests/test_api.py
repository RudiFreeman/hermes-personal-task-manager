"""The shared real FastAPI adapter, with disposable SQLite data only."""
import importlib.util
from pathlib import Path

import pytest

pytest.importorskip("fastapi")
pytest.importorskip("httpx")
from fastapi import FastAPI
from fastapi.testclient import TestClient


@pytest.fixture
def client(tmp_path, monkeypatch):
    monkeypatch.setenv("PTM_DATA_DIR", str(tmp_path))
    spec = importlib.util.spec_from_file_location("ptm_api_check", Path(__file__).resolve().parents[1] / "dashboard/plugin_api.py")
    api = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(api)
    app = FastAPI()
    app.include_router(api.router, prefix="/tasks-api")
    with TestClient(app) as value:
        yield value


def test_dashboard_and_webapp_share_cascade_trash_and_restoration(client):
    parent = client.post("/tasks-api/tasks", json={"title": "Shared", "subtasks": [{"title": "Child"}]}).json()
    result = client.patch("/tasks-api/tasks/" + parent["id"], json={"revision": 1, "done": True})
    assert result.status_code == 200
    snapshot = client.get("/tasks-api/tasks").json()
    assert all(task["done"] for task in snapshot["tasks"])
    assert client.patch("/tasks-api/tasks/" + parent["id"], json={"revision": 1, "title": "Stale"}).status_code == 409
    trashed = client.patch("/tasks-api/tasks/" + parent["id"], json={"revision": 2, "action": "trash"}).json()
    snapshot = client.get("/tasks-api/tasks").json()
    assert snapshot["tasks"] == [] and len(snapshot["trash"]) == 2
    assert client.patch("/tasks-api/tasks/" + parent["id"], json={"revision": trashed["revision"], "action": "restore"}).status_code == 200
    assert len(client.get("/tasks-api/tasks").json()["tasks"]) == 2


def test_strict_json_language_and_purge_confirmation(client):
    assert client.post("/tasks-api/tasks", content='{"title":"wrong type"}', headers={"Content-Type": "text/plain"}).status_code == 422
    assert client.post("/tasks-api/tasks?language=ru", json={"title": " "}).json()["detail"].startswith("Название")
    parent = client.post("/tasks-api/tasks", json={"title": "Disposable"}).json()
    client.patch("/tasks-api/tasks/" + parent["id"], json={"revision": 1, "action": "trash"})
    endpoint = "/tasks-api/tasks/" + parent["id"]
    assert client.patch(endpoint, json={"revision": 2, "action": "purge"}).status_code == 409
    assert client.patch(endpoint, json={"revision": 2, "action": "purge", "confirmed": "true"}).status_code == 422
    assert client.patch(endpoint, json={"revision": 2, "action": "purge", "confirmed": True}).status_code == 200
