# Hermes Personal Task Manager

![Version 0.2.0](https://img.shields.io/badge/version-0.2.0-4c9b59)
![Python 3.10 or newer](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)
![Shared JavaScript UI](https://img.shields.io/badge/JavaScript-shared_UI-F7DF1E?logo=javascript&logoColor=black)
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

- Compact, collapsible task/subtask rows with descriptions and round checkboxes.
- Progress tracking for the whole list and individual task steps.
- Important tasks, text search, an Archive, and a restorable Trash.
- Notes and result comments attributed to you or Hermes.
- Persistent local SQLite storage.
- An English interface by default, with an optional Russian translation.
- Dashboard and WebApp adapters sharing the same view, controller, API and database.

**Integration status:** Tools, the Dashboard API, and the browser UI have been
checked against Hermes v0.23.1 in a disposable VPS profile. This includes real
model tool calls and browser checks using the installed Hermes ASGI app and SDK.
See [0.2.0 validation](V020_VALIDATION.md) for scope and remaining limitations.

**Possible future extensions:** Project organization, richer step-by-step
checklists, Kanban views, task dependencies, and export/backup with restoration.
These are roadmap ideas, not features of the current prototype. The first version
deliberately focuses on a simple personal checklist.

---

## Current version

Version 0.2.0 is a local prototype with one personal task list and one level of
subtasks. Tasks can be completed, reopened, starred, searched, and grouped into
active and archived sections. Completing a parent atomically completes its active
subtasks. Completion records its timestamp; reopening the parent preserves child
completion. Trash preserves content and completion state until explicitly purged.
Comments and change events record their author and timestamp.

Overall progress counts completed top-level tasks. Each task also shows how many
of its subtasks are complete. SQLite stores the data with a schema version, and
revision checks prevent stale edits from overwriting newer changes.

The plugin has been tested on a VPS in a separate disposable profile; it has not
been enabled in the working profile. The source repository is
[RudiFreeman/hermes-personal-task-manager](https://github.com/RudiFreeman/hermes-personal-task-manager).

## Technology stack

| Component | Technology | Role |
| --- | --- | --- |
| Backend and tools | Python 3.10+ | Task storage, validation, Hermes tools, and local preview |
| Web interface | Shared JavaScript, React view and CSS | Compact tree, editors, Archive, Trash, language and responsive layout |
| Host integration | Dashboard SDK and Desktop Plugin SDK | Native host controls, React and theme tokens; WebApp uses the Desktop SDK |
| Dashboard API | FastAPI and Pydantic 2 | HTTP routes and request validation inside Hermes |
| Storage | SQLite 3 through Python's `sqlite3` module | Persistent tasks, comments, and change events |
| Testing | pytest and Node.js assertions | Storage/API behavior and translation checks |

The current version is **0.2.0** (local prototype), declared in `plugin.yaml` and
`dashboard/manifest.json`. The preview uses only the Python standard library;
FastAPI, Pydantic, and the host React SDK are used when running inside Hermes.
Installation uses committed bundles: no npm installation or build step is needed
on the Hermes host. Frontend development and DOM tests use npm (see below).
Host dependencies vary; the tested
installation used FastAPI 0.133.1 and Pydantic 2.14.1.

Version 0.1.1 fixes editor draft preservation and revision tracking, live detail
refreshes, out-of-order responses, and concurrent SQLite schema initialization.
It adds permanent regression tests for all five fixes; the database schema stays
at version 1.

Version 0.1.2 explicitly sends JSON content headers when using the Hermes SDK,
fixing HTTP 422 responses to UI writes. Integration checks passed on Hermes
v0.23.1 with FastAPI 0.133.1 and Pydantic 2.14.1 in a disposable profile.

Version 0.2.0 adds the WebApp adapter, host-native themes and controls, an inline
task tree, cascading parent completion, and Trash with restoration and confirmed
permanent deletion. All three original tool names remain unchanged.

The first 0.2.0 storage operation migrates schema 1 to schema 2 in one transaction.
Existing IDs, content, revisions, comments, events and completion timestamps are
preserved. Update all processes sharing that database together: an older plugin
intentionally refuses schema 2. Downgrading the schema is not supported.

## Local preview on Windows

Requires Python 3.10+. No additional packages are needed for the preview.

```powershell
cd C:\python\Personal_Task_Manager
python preview.py
```

Open **<http://127.0.0.1:8765>**. Press Ctrl+C to stop the server.
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
| --- | --- |
| `personal_tasks_list` | Read tasks, subtasks, comments, and progress |
| `personal_tasks_add` | Record a task with described subtasks, or add a single subtask |
| `personal_tasks_update` | Edit, complete/reopen, star, comment, or explicitly trash/restore/purge an item |

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

An explicit completion of a parent also completes its active subtasks in the
same transaction. Hermes supplies the result comment as evidence for the whole
group. Finishing the last child alone does not complete its parent. Reopening a
parent returns it from the Archive while preserving child checkmarks. To reopen
a child of a completed parent, reopen the parent first. Checking never executes it.

The user may authorize changes either through the UI or through an explicit chat
request such as “add”, “mark complete”, or “review the confirmed results”. There
are no background task executors, autonomous completion hooks, or “in progress”
transitions. Hermes must not infer completion from a plan or promise.

“Move to Trash” confirms before hiding an item/group. Restore keeps its notes and
prior completion state; restoring a parent does not resurrect a child that was
already trashed independently. Purge requires a second, explicit permanent-delete
confirmation. Tools use `action: "trash" | "restore" | "purge"`; send these
separately from edits, with the latest `revision`. Purge also requires
`confirmed: true` after the user's explicit confirmation. Trash is a separate
`trash` array in the snapshot; `tasks` continues to contain non-trashed items.

Both interfaces refresh every three seconds while visible, after writes, and on
focus. Dirty forms retain their original revision, values and focus. On a stale
edit, review/copy the draft, then explicitly discard/reload before retrying.

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
  dist/preview.js          Standalone preview with its own React runtime
desktop/plugin.js          WebApp/Desktop single-file ESM adapter
frontend/src/              Shared state, view, translations and SDK adapters
scripts/build_frontend.mjs Rebuilds all committed bundles from those sources
preview.py                 Local preview without extra dependencies
test_tasks.py              Behavior tests
test_i18n.cjs              Translation and language preference tests
test_ui.cjs                Editor drafts, polling, and request ordering tests
test_webapp.cjs            Desktop SDK body/profile/unload contract tests
test_api.py                Real FastAPI routes with temporary databases
test_browser.py            Authenticated cross-surface browser workflow/layouts
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

For WebApp, the same package also supplies `desktop/plugin.js`. Hermes copies
that half into the host's app-level `desktop-plugins` directory. Turn on its
Desktop switch in WebApp → Capabilities → Plugins. The page appears as **My Tasks**.
This is one package with two SDK entry points, not two applications or databases.
Dashboard uses `SDK.fetchJSON` with explicit JSON headers; WebApp uses the
profile-aware `ctx.rest` with object bodies. Only host-provided React/UI components
are used in these adapters. The standalone development preview bundles React.

Select the same profile in both surfaces to see the same list. Different profiles
retain separate storage and editor state. No task content is stored in the
app-level Desktop plugin copy. Keep both the agent backend and the Desktop half
enabled; a UI-only install cannot provide the storage API. Reload Desktop plugins
after updating the WebApp bundle, and use a new chat session for updated tools.

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

For frontend development and DOM regressions:

Use Node.js 26+, or another version supported by the locked jsdom dependency
(`^22.22.2 || ^24.15.0 || >=26.0.0`). No Node installation is needed to run the
prebuilt plugin in Hermes or the Python preview.

```powershell
npm ci
npm run build
npm test
```

Edit `frontend/src/*`, then rebuild; `dashboard/dist/*` and `desktop/plugin.js`
are generated deliverables. Development dependencies are lockfile-pinned and
are not installed into Hermes. `npm test` checks translations, the actual
Dashboard bundle with React DOM, the shared controller with deferred promises,
and the WebApp SDK contract, including profile changes and unload cleanup.
They do not replace a browser smoke check. If the default temporary test directory
cannot be cleared, use a fresh disposable path, for example
`python -m pytest -q --basetemp=.local/fix-tests-20261117`.

`test_api.py` runs when FastAPI and httpx are available; otherwise pytest reports
that module as skipped. Run it in the Hermes runtime to exercise the adapter.
`test_browser.py --help` describes an optional real-host check (Playwright needed).
Provide authenticated state files outside Git and URLs explicitly selecting a
disposable profile. It creates a UUID-named group, verifies edits, synchronization,
conflicts, Archive/Trash/restore and purge, checks both native host themes at five
widths, and purges only that newly-created group. `--layout-only` performs no task
writes. Never commit browser state files: they contain authentication credentials.

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
