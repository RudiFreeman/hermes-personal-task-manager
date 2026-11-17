# Hermes VPS validation — 2026-11-17

Version under test: 0.1.1 plus the JSON-header fix released as 0.1.2.
All task writes used the disposable `ptm-check-20261117` profile. The plugin was
not enabled in the working profile. No working task database was used.

## Environment

- Ubuntu 24.04.5 LTS, x86-64.
- Hermes Agent v0.23.1, installed revision `3b4215785882`.
- Python 3.14.9, FastAPI 0.133.1, Pydantic 2.14.1.
- Node.js 26.12.1; headless Chromium 145.0.7632.6 with Playwright 1.58.0.
- Test Python dependencies and extracted browser libraries were placed under the
  disposable profile. No Python dependencies or OS packages were installed into
  the working Hermes environment.

## Passed checks

- Plugin installation pinned to `23d6c1a05f1601ac0fab092089e2504d29ce7ee6`;
  Plugin Doctor passed manifest parsing, discovery, import, and registration of
  all three tools.
- All **16 Python tests**, including concurrent first use, rollback after an
  injected schema failure, revision conflicts, and completion rules.
- `node test_i18n.cjs` and `node test_ui.cjs`.
- Actual Dashboard plugin discovery and FastAPI routes, including unauthorized
  requests (HTTP 401), session-authenticated access, strict validation, Russian
  validation errors, and stale revisions (HTTP 409).
- Shared tool/UI SQLite storage through `plugin_data_dir`, with no `PTM_DATA_DIR`
  override. Completing children did not complete their parent automatically;
  reopening a child of a completed parent was rejected. Hermes completion without
  a result comment was rejected.
- Actual model sessions called `personal_tasks_list`, `personal_tasks_add`, and
  `personal_tasks_update`. Tool calls were verified in the test session database;
  created tasks, completion states, and Hermes evidence comments were independently
  checked in the task database.
- Real browser creation/saving, independent draft preservation, expanded child
  editors, clean-panel polling, stale parent/child edits after language switching,
  explicit draft reload, saved Russian preference, and persistence after reloading.
  No uncaught JavaScript errors occurred. Desktop and mobile screenshots were
  captured in the disposable profile.
- The complete task/comment/event snapshot remained unchanged after restarting
  the test ASGI process.

## Additional bug found and fixed

The Hermes SDK's `fetchJSON` forwards request headers without adding a JSON content
type. A string request body sent by the plugin therefore received a browser
`text/plain` content type and FastAPI returned HTTP 422. The standalone preview
added its own JSON header, which hid this integration error.

Version 0.1.2 explicitly supplies `Content-Type: application/json` in the plugin's
transport wrapper. The permanent UI transport regression now requires that header
on writes. Real browser writes passed after this change.

## Host behavior and remaining limits

Launching `hermes dashboard --isolated` for the test profile unexpectedly claimed
machine-level host ownership on this installation. The existing Dashboard service
stopped, and then refused to start while the test process owned the host. The test
process was terminated and the original Dashboard service was restored. The
Gateway remained running. Both working services were confirmed active afterward.

Further browser checks used a loopback-only test harness around the installed
Hermes ASGI application, plugin discovery/mounting, and genuine host React/SDK,
without host-ownership registration, cron startup, or service management. This
does not establish that `--isolated` is safe on other multi-profile installations.

The existing production Dashboard's username/password login was not exercised:
its separate password was unavailable, and its stored hash/settings were not
changed. Telegram and other messaging channels, other Hermes versions, sustained
load, backup/restore, and production-profile rollout remain outside this check.

Test scripts, logs, screenshots, and disposable data are retained under
`~/.hermes/profiles/ptm-check-20261117/` for inspection. Credentials are not part of
this report or the repository.
