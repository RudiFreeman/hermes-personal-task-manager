"""Shared SQLite storage. No agent execution, shell calls or network access."""
from contextlib import contextmanager
from datetime import datetime, timezone
import os
from pathlib import Path
import sqlite3
import time
import uuid


class TaskError(ValueError):
    """English by default, with a Russian rendering for localized HTTP clients."""
    def __init__(self, message, russian=None):
        super().__init__(message)
        self.russian = russian or message

    def localized(self, language="en"):
        return self.russian if language.split(",")[0].split(";")[0].strip().lower().split("-")[0] == "ru" else str(self)


def default_path():
    override = os.environ.get("PTM_DATA_DIR")
    if override:
        return Path(override) / "tasks.db"
    # Use the active Hermes profile's supported durable storage location.
    # Fail explicitly on unsupported Hermes; never silently use a different DB.
    from plugins.plugin_storage import plugin_data_dir
    return Path(plugin_data_dir("personal-task-manager")) / "tasks.db"


def now():
    return datetime.now(timezone.utc).isoformat()


def text(value, label, maximum, required=False):
    russian = {"title": "Название", "description": "Описание", "subtask title": "Название подзадачи", "comment": "Комментарий"}.get(label, label)
    if not isinstance(value, str):
        raise TaskError(f"{label}: expected text", f"{russian}: требуется текст")
    value = value.strip()
    if (required and not value) or len(value) > maximum:
        minimum = 1 if required else 0
        raise TaskError(f"{label}: must contain {minimum} to {maximum} characters",
                        f"{russian}: от {minimum} до {maximum} символов")
    return value


class Store:
    def __init__(self, path=None):
        self.path = Path(path) if path is not None else default_path()
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with self.connection() as db:
            # Serialize first use before checking the version. DDL and version
            # changes share this transaction and roll back together on failure.
            db.execute("BEGIN IMMEDIATE")
            version = db.execute("PRAGMA user_version").fetchone()[0]
            if version > 2:
                raise TaskError("The database was created by a newer plugin version", "База создана более новой версией плагина")
            if version == 0:
                schema = """
                    CREATE TABLE tasks (
                        id TEXT PRIMARY KEY,
                        parent_id TEXT REFERENCES tasks(id),
                        title TEXT NOT NULL,
                        description TEXT NOT NULL DEFAULT '',
                        done INTEGER NOT NULL DEFAULT 0 CHECK(done IN (0,1)),
                        starred INTEGER NOT NULL DEFAULT 0 CHECK(starred IN (0,1)),
                        created_at TEXT NOT NULL,
                        updated_at TEXT NOT NULL,
                        completed_at TEXT,
                        revision INTEGER NOT NULL DEFAULT 1
                    );
                    CREATE INDEX tasks_parent ON tasks(parent_id);
                    CREATE TABLE comments (
                        id INTEGER PRIMARY KEY,
                        task_id TEXT NOT NULL REFERENCES tasks(id),
                        body TEXT NOT NULL,
                        actor TEXT NOT NULL,
                        created_at TEXT NOT NULL
                    );
                    CREATE TABLE events (
                        id INTEGER PRIMARY KEY,
                        task_id TEXT NOT NULL REFERENCES tasks(id),
                        action TEXT NOT NULL,
                        actor TEXT NOT NULL,
                        created_at TEXT NOT NULL
                    );
                    PRAGMA user_version=1;
                """
                for statement in schema.split(";"):
                    if statement.strip():
                        db.execute(statement.strip())
            if version < 2:
                db.execute("ALTER TABLE tasks ADD COLUMN trashed_at TEXT")
                db.execute("ALTER TABLE tasks ADD COLUMN trash_batch TEXT")
                db.execute("CREATE INDEX tasks_trash ON tasks(trashed_at)")
                db.execute("PRAGMA user_version=2")

    @contextmanager
    def connection(self):
        db = sqlite3.connect(self.path, timeout=10)
        try:
            db.row_factory = sqlite3.Row
            db.execute("PRAGMA foreign_keys=ON")
            # Initial WAL conversion can return SQLITE_BUSY without waiting for
            # the connection timeout. Retry only transient locking failures.
            for attempt in range(6):
                try:
                    db.execute("PRAGMA journal_mode=WAL")
                    break
                except sqlite3.OperationalError as exc:
                    if getattr(exc, "sqlite_errorcode", None) not in (sqlite3.SQLITE_BUSY, sqlite3.SQLITE_LOCKED) or attempt == 5:
                        raise
                    time.sleep(0.02 * (2 ** attempt))
            with db:
                yield db
        finally:
            db.close()

    def _get(self, db, task_id):
        if not isinstance(task_id, str):
            raise TaskError("A task ID is required", "Укажите ID задачи")
        row = db.execute("SELECT * FROM tasks WHERE id=?", (task_id,)).fetchone()
        if row is None:
            raise TaskError("Task not found", "Задача не найдена")
        return dict(row)

    def snapshot(self):
        with self.connection() as db:
            db.execute("BEGIN")
            # A batch shares one timestamp. Random UUIDs are not creation order;
            # the durable creation-event sequence preserves that batch's order,
            # including items written by older versions. No data migration needed.
            tasks = [dict(row) for row in db.execute("""
                SELECT task.* FROM tasks AS task
                LEFT JOIN (
                    SELECT task_id, MIN(id) AS creation_order FROM events
                    WHERE action='created' GROUP BY task_id
                ) AS creation ON creation.task_id=task.id
                ORDER BY task.created_at, COALESCE(creation.creation_order, task.rowid), task.id
            """)]
            comments = [dict(row) for row in db.execute("SELECT * FROM comments ORDER BY id")]
            events = [dict(row) for row in db.execute("SELECT * FROM events ORDER BY id")]
        for task in tasks:
            task["done"] = bool(task["done"])
            task["starred"] = bool(task["starred"])
        trash = [task for task in tasks if task["trashed_at"] is not None]
        tasks = [task for task in tasks if task["trashed_at"] is None]
        roots = [task for task in tasks if task["parent_id"] is None]
        done = sum(task["done"] for task in roots)
        return {"tasks": tasks, "trash": trash, "comments": comments, "events": events,
                "progress": {"total": len(roots), "done": done,
                             "percent": round(100 * done / len(roots)) if roots else 0}}

    def add(self, title, description="", parent_id=None, subtasks=None, actor="user"):
        title = text(title, "title", 300, True)
        description = text(description, "description", 20000)
        if subtasks is None:
            subtasks = []
        if not isinstance(subtasks, list) or len(subtasks) > 100:
            raise TaskError("Add at most 100 subtasks at a time", "За один раз можно добавить до 100 подзадач")
        if parent_id is not None and subtasks:
            raise TaskError("Only one level of subtasks is supported", "Поддерживается один уровень подзадач")
        children = []
        for child in subtasks:
            if not isinstance(child, dict) or set(child) - {"title", "description"}:
                raise TaskError("A subtask may contain only a title and description", "Подзадача может содержать только название и описание")
            children.append((text(child.get("title"), "subtask title", 300, True),
                             text(child.get("description", ""), "description", 20000)))
        stamp = now()
        task_id = uuid.uuid4().hex
        with self.connection() as db:
            db.execute("BEGIN IMMEDIATE")
            if parent_id is not None:
                parent = self._get(db, parent_id)
                self._active(parent)
                if parent["parent_id"] is not None:
                    raise TaskError("Only one level of subtasks is supported", "Поддерживается один уровень подзадач")
                if parent["done"]:
                    raise TaskError("Reopen the parent task first", "Сначала верните родительскую задачу в активные")
            for item_id, item_parent, item_title, item_description in [
                (task_id, parent_id, title, description),
                *((uuid.uuid4().hex, task_id, t, d) for t, d in children),
            ]:
                db.execute("""INSERT INTO tasks
                    (id,parent_id,title,description,created_at,updated_at) VALUES (?,?,?,?,?,?)""",
                           (item_id, item_parent, item_title, item_description, stamp, stamp))
                db.execute("INSERT INTO events(task_id,action,actor,created_at) VALUES (?,?,?,?)",
                           (item_id, "created", actor, stamp))
            if parent_id is not None:
                db.execute("UPDATE tasks SET revision=revision+1,updated_at=? WHERE id=?",
                           (stamp, parent_id))
            return self._get(db, task_id)

    def update(self, task_id, changes, actor="user", expected_revision=None):
        if isinstance(changes, dict) and "action" in changes:
            if set(changes) - {"action", "confirmed"}:
                raise TaskError("Send a lifecycle action separately from edits", "Отправьте действие с корзиной отдельно от редактирования")
            return self.lifecycle(task_id, changes["action"], actor, expected_revision, changes.get("confirmed", False))
        if not isinstance(changes, dict) or not changes or set(changes) - {
            "title", "description", "done", "starred", "comment"
        }:
            raise TaskError("Provide a title, description, completion state, importance, or comment", "Укажите название, описание, галочку, важность или комментарий")
        fields = {}
        for field in ("title", "description"):
            if field in changes:
                fields[field] = text(changes[field], field, 300 if field == "title" else 20000,
                                     field == "title")
        for field in ("done", "starred"):
            if field in changes:
                if type(changes[field]) is not bool:
                    raise TaskError(f"{field}: expected true or false", f"{field}: требуется true или false")
                fields[field] = changes[field]
        comment = text(changes.get("comment", ""), "comment", 10000)
        if actor == "hermes" and changes.get("done") is True and not comment:
            raise TaskError("Hermes must describe what was completed and the supporting evidence", "При завершении Hermes должен указать, что сделано и чем это подтверждено")
        stamp = now()
        with self.connection() as db:
            db.execute("BEGIN IMMEDIATE")
            task = self._get(db, task_id)
            self._active(task)
            if expected_revision is not None and expected_revision != task["revision"]:
                raise TaskError("This task has changed. Refresh the list and try again", "Задача уже изменена. Обновите список и повторите действие")
            if fields.get("done") is True and not task["done"]:
                children = db.execute("SELECT id FROM tasks WHERE parent_id=? AND done=0 AND trashed_at IS NULL", (task_id,)).fetchall()
                for child in children:
                    db.execute("UPDATE tasks SET done=1,completed_at=?,updated_at=?,revision=revision+1 WHERE id=?", (stamp, stamp, child["id"]))
                    db.execute("INSERT INTO events(task_id,action,actor,created_at) VALUES (?,?,?,?)", (child["id"], "completed", actor, stamp))
                    if comment:
                        db.execute("INSERT INTO comments(task_id,body,actor,created_at) VALUES (?,?,?,?)", (child["id"], comment, actor, stamp))
            if fields.get("done") is False and task["done"] and task["parent_id"]:
                parent = self._get(db, task["parent_id"])
                if parent["done"]:
                    raise TaskError("Reopen the parent task first", "Сначала верните родительскую задачу в активные")
            if "done" in fields and fields["done"] != bool(task["done"]):
                fields["completed_at"] = stamp if fields["done"] else None
            changed = {key: value for key, value in fields.items() if task[key] != value}
            for key, value in changed.items():
                # Column names only come from the fixed allowlist above.
                db.execute(f"UPDATE tasks SET {key}=? WHERE id=?", (value, task_id))
            if comment:
                db.execute("INSERT INTO comments(task_id,body,actor,created_at) VALUES (?,?,?,?)",
                           (task_id, comment, actor, stamp))
            if changed or comment:
                db.execute("UPDATE tasks SET revision=revision+1,updated_at=? WHERE id=?", (stamp, task_id))
                action = "completed" if changed.get("done") else "reopened" if "done" in changed else "updated"
                db.execute("INSERT INTO events(task_id,action,actor,created_at) VALUES (?,?,?,?)",
                           (task_id, action, actor, stamp))
            return self._get(db, task_id)

    @staticmethod
    def _active(task):
        if task["trashed_at"] is not None:
            raise TaskError("Restore this item from Trash first", "Сначала восстановите пункт из корзины")

    def lifecycle(self, task_id, action, actor="user", expected_revision=None, confirmed=False):
        if action not in ("trash", "restore", "purge") or type(confirmed) is not bool:
            raise TaskError("Unknown lifecycle action", "Неизвестное действие с корзиной")
        stamp = now()
        with self.connection() as db:
            db.execute("BEGIN IMMEDIATE")
            task = self._get(db, task_id)
            if expected_revision is not None and expected_revision != task["revision"]:
                raise TaskError("This task has changed. Refresh the list and try again", "Задача уже изменена. Обновите список и повторите действие")
            if action == "trash":
                if task["trashed_at"] is not None:
                    return task
                batch = uuid.uuid4().hex
                items = db.execute("SELECT id FROM tasks WHERE (id=? OR parent_id=?) AND trashed_at IS NULL", (task_id, task_id)).fetchall()
                for item in items:
                    db.execute("UPDATE tasks SET trashed_at=?,trash_batch=?,updated_at=?,revision=revision+1 WHERE id=?", (stamp, batch, stamp, item["id"]))
            else:
                if task["trashed_at"] is None:
                    raise TaskError("This item is not in Trash", "Этот пункт не в корзине")
                if action == "restore":
                    if task["parent_id"]:
                        parent = self._get(db, task["parent_id"])
                        if parent["trashed_at"] is not None:
                            raise TaskError("Restore the parent task first", "Сначала восстановите родительскую задачу")
                        if parent["done"] and not task["done"]:
                            raise TaskError("Reopen the parent task first", "Сначала верните родительскую задачу в активные")
                    items = db.execute("SELECT id FROM tasks WHERE (id=? OR parent_id=?) AND trash_batch=?", (task_id, task_id, task["trash_batch"])).fetchall()
                    for item in items:
                        db.execute("UPDATE tasks SET trashed_at=NULL,trash_batch=NULL,updated_at=?,revision=revision+1 WHERE id=?", (stamp, item["id"]))
                else:
                    if not confirmed:
                        raise TaskError("Confirm permanent deletion explicitly", "Явно подтвердите окончательное удаление")
                    items = db.execute("SELECT id FROM tasks WHERE id=? OR parent_id=? ORDER BY parent_id IS NULL", (task_id, task_id)).fetchall()
                    for item in items:
                        db.execute("DELETE FROM comments WHERE task_id=?", (item["id"],))
                        db.execute("DELETE FROM events WHERE task_id=?", (item["id"],))
                        db.execute("DELETE FROM tasks WHERE id=?", (item["id"],))
            if action != "purge":
                for item in items:
                    db.execute("INSERT INTO events(task_id,action,actor,created_at) VALUES (?,?,?,?)", (item["id"], "trashed" if action == "trash" else "restored", actor, stamp))
            if task["parent_id"]:
                db.execute("UPDATE tasks SET revision=revision+1,updated_at=? WHERE id=?", (stamp, task["parent_id"]))
            return {"id": task_id, "purged": True} if action == "purge" else self._get(db, task_id)
