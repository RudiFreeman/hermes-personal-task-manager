"""Dashboard mounts this router behind its existing authentication gate."""
import importlib.util
from pathlib import Path
from fastapi import APIRouter, Request
from fastapi.routing import APIRoute
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, Field
from typing import Literal

# Dashboard imports API files independently of native plugin packages.
# Load our own standalone storage module by path, without modifying sys.path.
spec = importlib.util.spec_from_file_location("ptm_dashboard_store", Path(__file__).resolve().parents[1] / "backend" / "store.py")
storage = importlib.util.module_from_spec(spec)
spec.loader.exec_module(storage)
def request_language(request):
    return request.query_params.get("language") or request.headers.get("Accept-Language", "en")


class LocalizedRoute(APIRoute):
    def get_route_handler(self):
        original = super().get_route_handler()

        async def handler(request):
            try:
                return await original(request)
            except RequestValidationError:
                # Keep strict validation and HTTP 422. Do not expose Pydantic's
                # English diagnostic prose or echo task contents into the UI.
                return JSONResponse(status_code=422, content={"detail": storage.localized_message("errorInvalidData", request_language(request)),
                    "error_code": "errorInvalidData", "error_params": {}})
        return handler


router = APIRouter(route_class=LocalizedRoute)


class Child(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)
    title: str = Field(min_length=1, max_length=300)
    description: str = Field(default="", max_length=20000)


class NewTask(Child):
    parent_id: str | None = None
    subtasks: list[Child] = Field(default_factory=list, max_length=100)


class UpdateTask(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)
    revision: int = Field(ge=1)
    title: str = Field(default="", max_length=300)
    description: str = Field(default="", max_length=20000)
    done: bool = False
    starred: bool = False
    comment: str = Field(default="", max_length=10000)
    action: Literal["trash", "restore", "purge"] | None = None
    confirmed: bool = False


def execute(action, request):
    try:
        return action(storage.Store())
    except storage.TaskError as exc:
        return JSONResponse(status_code=409, content={"detail": exc.localized(request_language(request)),
            "error_code": exc.code, "error_params": exc.params})


@router.get("/tasks")
def tasks(request: Request):
    return execute(lambda store: store.snapshot(), request)


@router.post("/tasks")
def add(body: NewTask, request: Request):
    return execute(lambda store: store.add(**body.model_dump()), request)


@router.patch("/tasks/{task_id}")
def update(task_id: str, body: UpdateTask, request: Request):
    changes = body.model_dump(exclude_unset=True, exclude={"revision"})
    return execute(lambda store: store.update(task_id, changes, expected_revision=body.revision), request)
