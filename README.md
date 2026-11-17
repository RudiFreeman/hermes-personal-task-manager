# Hermes Personal Task Manager

![Version 0.1.2](https://img.shields.io/badge/version-0.1.2-4c9b59)
![Python 3.10 or newer](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)
![Vanilla JavaScript](https://img.shields.io/badge/JavaScript-vanilla-F7DF1E?logo=javascript&logoColor=black)
![React via Hermes SDK](https://img.shields.io/badge/React-Hermes_SDK-61DAFB?logo=react&logoColor=black)
![FastAPI Dashboard API](https://img.shields.io/badge/FastAPI-Dashboard_API-009688?logo=fastapi&logoColor=white)
![SQLite 3](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white)

## About

A lightweight, self-hosted personal task manager being developed as a plugin for
Hermes Agent. Capture an idea, turn it into a task with clear subtasks, and track
your progress through a simple web interface inspired by the clarity of everyday
checklist apps.

The goal is to make working with Hermes easier: keep plans, next steps, and results
in one persistent place, so you can return to your work without reconstructing
everything from chat history.

You can manage your list yourself or ask Hermes to help. Tell it what you want to
do, and it can create a task, break it into steps, and add descriptions. When you
ask it to review completed work, Hermes can check the list against confirmed
results from the conversation or your own updates, mark the relevant items as
done, and leave comments explaining what was accomplished. Uncertain results
should be clarified with you rather than treated as completed work.

**Core principle:** You decide what to work on and what changes Hermes may make.
Hermes assists with planning and keeping your list up to date at your request.
Adding a task or checking it off only records your plan or progress; it never
starts an agent, schedules a job, or executes the task itself.

**Available in the local prototype:**

- Tasks and subtasks with descriptions and completion checkboxes.
- Progress tracking for the whole list and individual task steps.
- Important tasks, text search, and a collapsible completed section.
- Notes and result comments attributed to you or Hermes.
- Persistent local SQLite storage.
- An English interface by default, with an optional Russian translation.

**Integration status:** Tools, the Dashboard API, and the browser UI have been
checked against Hermes v0.23.1 in a disposable VPS profile. This includes real
model tool calls and browser checks using the installed Hermes ASGI app and SDK.
See [VPS validation](VPS_VALIDATION.md) for scope and remaining limitations.

**Possible future extensions:** Project organization, richer step-by-step
checklists, Kanban views, task dependencies, and export/backup with restoration.
These are roadmap ideas, not features of the current prototype. The first version
deliberately focuses on a simple personal checklist.

---

## Current version

Version 0.1.2 is a local prototype with one personal task list and one level of
subtasks. Tasks can be completed, reopened, starred, searched, and grouped into
active and completed sections. Completing a task records its completion time.
Comments and change events record their author and timestamp.

Overall progress counts completed top-level tasks. Each task also shows how many
of its subtasks are complete. SQLite stores the data with a schema version, and
revision checks prevent stale edits from overwriting newer changes.

The plugin has been tested on a VPS in a separate disposable profile; it has not
been enabled in the working profile. The source repository is
[RudiFreeman/hermes-personal-task-manager](https://github.com/RudiFreeman/hermes-personal-task-manager).

## Technology stack

| Component | Technology | Role |
|---|---|---|
| Backend and tools | Python 3.10+ | Task storage, validation, Hermes tools, and local preview |
| Web interface | Vanilla JavaScript and CSS | Task list, subtasks, language selection, and responsive layout |
| Dashboard integration | React from the Hermes Plugin SDK | Mounts the interface inside a Dashboard tab; React is provided by the host |
| Dashboard API | FastAPI and Pydantic 2 | HTTP routes and request validation inside Hermes |
| Storage | SQLite 3 through Python's `sqlite3` module | Persistent tasks, comments, and change events |
| Testing | pytest and Node.js assertions | Storage/API behavior and translation checks |

The current version is **0.1.2** (local prototype), declared in `plugin.yaml` and
`dashboard/manifest.json`. The preview uses only the Python standard library;
FastAPI, Pydantic, and the host React SDK are used when running inside Hermes.
No npm installation or frontend build step is required. Node.js is optional and
used for translation and UI regression checks. Host dependencies vary; the tested
installation used FastAPI 0.133.1 and Pydantic 2.14.1.

Version 0.1.1 fixes editor draft preservation and revision tracking, live detail
refreshes, out-of-order responses, and concurrent SQLite schema initialization.
It adds permanent regression tests for all five fixes; the database schema stays
at version 1.

Version 0.1.2 explicitly sends JSON content headers when using the Hermes SDK,
fixing HTTP 422 responses to UI writes. Integration checks passed on Hermes
v0.23.1 with FastAPI 0.133.1 and Pydantic 2.14.1 in a disposable profile.

## Local preview on Windows

Requires Python 3.10+. No additional packages are needed for the preview.

```powershell
cd C:\python\Personal_Task_Manager
python preview.py
```

Open **http://127.0.0.1:8765**. Press Ctrl+C to stop the server.
To use a different port, run `python preview.py --port 8766`.

The server listens on this computer only and is intended for development, not
public hosting. It serves the same JS/CSS assets and uses the same storage logic
as the plugin. Each run creates a separate local API token.

Preview data is stored in `.local/tasks.db` inside the project, survives restarts,
and is excluded from Git. Before manually copying a SQLite database, stop the
preview and any other writers, and include any existing WAL files.
Full export/import and a dedicated backup workflow are not part of this version.

## Working with Hermes

Once the plugin is installed and enabled, Hermes receives three tools:

| Tool | Purpose |
|---|---|
| `personal_tasks_list` | Read tasks, subtasks, comments, and progress |
| `personal_tasks_add` | Record a task with described subtasks, or add a single subtask |
| `personal_tasks_update` | Edit a task, change its completion or starred state, or add a comment |

Example requests:

> Add a task to connect Gmail. Break it into steps and describe what needs to be checked.

> Review my tasks and mark the work we have already completed in this conversation. Add comments explaining the results.

When reconciling completed work, Hermes reads the list first. To mark an item as
complete, it supplies the task ID, the current revision, and a mandatory result
comment. Tool instructions require confirmed results or user statements as
evidence and call for clarification when uncertain. Storage checks that a comment
exists; it cannot verify whether the model's conclusion is true. This is a record
of work, not an independent completion audit.

A chat request authorizes recording the requested tasks or results; an additional
confirmation in the web interface is not required. The plugin does not monitor
all conversations in the background. Task content is treated as data, not commands.

Complete subtasks first, then explicitly complete the parent task. Finishing the
last subtask does not automatically complete its parent. To reopen a subtask of a
completed task, reopen the parent first. Checking an item never executes it.

The list refreshes every 10 seconds while preserving text in the open editing
form. If an edit conflicts with a newer revision, use the refresh button and
retry the change.

## Project structure

```text
plugin.yaml                Native Hermes manifest
__init__.py                Tool registration
tools.py                   Hermes tool schemas and handlers
store.py                   Shared SQLite logic
dashboard/
  manifest.json            Personal task list tab
  plugin_api.py            FastAPI router
  dist/index.js            Ready-to-load JS; no npm or bundler required
  dist/style.css           Responsive styles
preview.py                 Local preview without extra dependencies
test_tasks.py              Behavior tests
test_i18n.cjs              Translation and language preference tests
test_ui.cjs                Editor drafts, polling, and request ordering tests
pytest.ini                 Local test configuration
.local/                    Local data; excluded from Git
```

## Interface languages

English is the default interface language. Use the language selector in the header
to switch between **English** and **Russian**. Your selection is saved in this
browser and restored when you reopen the application. If browser storage is
unavailable, switching still works for the current session.

Labels, buttons, accessible names, empty states, progress text, and date formatting
follow the selected language. Application validation errors use the same language
through the `Accept-Language` request header. Task descriptions, titles, and notes
remain exactly as entered; changing the interface language does not translate
your content. Unsaved text in the task form is preserved when switching languages.

Translations are defined in the `translations` catalog in `dashboard/dist/index.js`,
with English as the fallback. Add matching keys for future languages there and
extend backend error translations when introducing another supported language.
The Dashboard navigation label is currently fixed to the English name, **My Tasks**;
the selector controls the plugin's own interface. Browser-native validation
messages follow the browser's language settings.

## Dashboard integration and compatibility

The target Hermes version must provide `ctx.register_tool`,
`window.__HERMES_PLUGIN_SDK__`, discovery of `dashboard/manifest.json`, plugin
FastAPI routes, and `plugins.plugin_storage.plugin_data_dir`. The API adapter
requires Pydantic 2. Compatibility was checked with v0.23.1; a minimum Hermes
version has not been established.

Deployment requires separate approval. The project directory is placed at
`<active HERMES_HOME>/plugins/personal-task-manager/`, and the plugin is enabled
using the installed version's plugin management commands. Verification must cover
tool registration, API authentication, the Dashboard tab, and shared data access
from both chat and the interface. New API routes require a planned Dashboard
restart. The project does not change the running Hermes configuration itself.

The API is mounted at `/api/plugins/personal-task-manager/tasks` and relies on
Dashboard authentication. This router must not be exposed publicly outside
Hermes. Synchronous handlers run SQLite operations in FastAPI worker threads.
The UI uses the host's React instance and renders its own content inside its tab.
Text is inserted as DOM text rather than interpreted as HTML. The plugin uses no
external fonts, CDNs, telemetry, or built-in Kanban storage.

In Hermes, the database uses the active profile's durable storage directory via
`plugin_data_dir('personal-task-manager')`, separate from installed source files.
For local tool tests, set `PTM_DATA_DIR` to the absolute path of the project's
`.local` directory. All processes sharing a list must use the same setting.
If the supported storage API is unavailable, the plugin reports an error instead
of silently creating a second database elsewhere.

## Testing

With pytest installed, run:

```powershell
python -m pytest -q
```

Temporary test files are created in `.pytest-temp` inside the project. This
directory is reserved for disposable test data and excluded from Git.

Tests use temporary databases and do not modify real tasks. They cover persistence,
subtasks, progress, Hermes comments, revision conflicts, concurrent writes, tool
invocation through the registration contract, and the protected local HTTP API.
Hermes Plugin Doctor, real model tool calls, and Dashboard integration passed in
the tested VPS environment. The local registration contract test alone is not a
replacement for those checks on another installation.

If Node.js is available, run the translation checks with `node test_i18n.cjs`.
These check language coverage, interpolation, English defaults, saved preferences,
and operation when browser storage is unavailable. They do not replace visual
browser testing.

Run `node test_ui.cjs` for permanent UI regressions using the actual application
code, a minimal DOM, and controlled transport promises. These cover draft revision
conflicts, independent form preservation, polling updates, and out-of-order GETs.
They do not replace a browser smoke check. If the default temporary test directory
cannot be cleared, use a fresh disposable path, for example
`python -m pytest -q --basetemp=.local/fix-tests-20261117`.

## Next steps

1. Review the local interface and task workflow.
2. Verify the installed Hermes version and real plugin integration.
3. Add export/restoration and prepare a release package.

Publishing source code to GitHub and installing on the production VPS require
separate approval.

## Documentation language

All repository documentation is maintained in English, including the README,
setup and update guides, architecture notes, and future release notes. New
documentation and documentation changes should follow this convention.
The application interface defaults to English and also supports Russian. Its
language selection is independent of the repository documentation.

## Official references

- [Extending the Dashboard](https://hermes-agent.nousresearch.com/docs/user-guide/features/extending-the-dashboard)
- [Building Hermes plugins](https://hermes-agent.nousresearch.com/docs/developer-guide/plugins)
- [Official Dashboard example](https://github.com/NousResearch/hermes-example-plugins/tree/main/example-dashboard)
