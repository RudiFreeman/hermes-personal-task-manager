# Version 0.2.0 validation

Validated on 2026-11-17 using disposable databases and the dedicated
`ptm-ui-20261117` Hermes profile. Existing user task databases were not opened or
modified. This report supersedes the UI verification limits in the historical
0.1.1 bug report and complements [0.1.2 validation](VPS_VALIDATION.md).

## Implementation

Dashboard and WebApp use one shared controller, React view, translation catalog,
FastAPI adapter and SQLite store. Each adapter uses its host's React, controls,
transport and theme variables. Only the standalone preview bundles React.

The inline tree supports parent expansion, round completion controls, child
progress, independent editors, notes, importance and search. Explicit parent
completion atomically completes its active children and puts the group in the
Archive. Reopening the parent preserves child completion. Completing the last
child alone does not complete the parent. Hermes acts only on explicit user
requests and still requires completion evidence. The original three tool names
and revision conflict checks are retained.

Trash preserves task content, notes and completion state. Group restoration
does not restore children previously trashed independently. Permanent deletion
requires explicit confirmation. Schema 1 migrates transactionally to schema 2;
all writers sharing a database must be upgraded together.

## Automated checks

- Local Python: **23 passed, 1 skipped**. The optional FastAPI module is skipped
  locally because its dependencies are absent. All databases are temporary.
- Installed Hermes Python runtime: **25 passed**, including both real FastAPI
  route tests. Tests cover migration/rollback, concurrent initialization,
  revisions, completion evidence/cascade, Trash batches, restore and purge.
- `node test_i18n.cjs`: **passed** for English/Russian coverage, interpolation,
  defaults, saved language and blocked storage.
- `node test_ui.cjs`: **passed** for shared-controller deferred-response tests,
  actual Dashboard bundle/React DOM, StrictMode, native confirmation callbacks,
  focus/drafts, stale saves, explicit JSON headers and corrupt storage recovery.
- `node test_webapp.cjs`: **passed** for SDK registration, object REST bodies,
  profile switching, rejected late responses and `ctx.onDispose` cleanup.
- Frontend production build: **passed**; generated host bundles are committed.

## Real Hermes checks

Environment: Hermes v0.23.1 (`3b4215785882`), Ubuntu 24.04.5, Python 3.14.9,
FastAPI 0.133.1, Pydantic 2.14.1, Playwright 1.58 and Chromium 145.

Plugin Doctor passed manifest parsing, runtime discovery/import and registration:
**three tools, zero hooks**. An explicit one-shot model request created a new
parent and two children, completed only the parent with a result comment, then
trashed and restored the group. An independent SQLite read confirmed all three
were completed and restored, with fresh revisions. No preexisting tasks were
included in that request.

`test_browser.py` passed against authenticated, running native Dashboard and
WebApp with the same disposable profile:

- Creation, inline children and editing across both surfaces.
- Bidirectional updates and notes; focus and dirty drafts survive polling.
- Russian stale-revision rejection and explicit draft reload.
- Child toggles, atomic parent completion, Archive and reopening.
- Confirmed group Trash, cancelled permanent deletion and restoration.
- Confirmed permanent deletion of only the browser test's own UUID-named group.
- Both native light/dark themes at **360, 390, 768, 1024 and 1440 px**, without
  horizontal overflow; no uncaught JavaScript errors.

Twenty layout screenshots were captured; mobile Dashboard/WebApp screenshots
were also inspected visually. Native Dashboard `alertdialog` and WebApp `dialog`
confirmation contracts are exercised. Dashboard colors use its actual
`--background-base` / `--foreground-base` tokens; WebApp uses `--ui-*` tokens.

The app-level Desktop half was enabled in WebApp. Backend enablement and task
writes were confined to the disposable profile. Dashboard and Gateway services
remained active with their original process IDs throughout these 0.2.0 checks;
neither service was restarted. Browser-state authentication files are private
test artifacts and must never be committed.

## Remaining limits

Responsive checks used Chromium viewport emulation, not physical phones/tablets.
Safari/iOS, Firefox, other Hermes versions, Telegram and other messaging
channels, sustained load, backup restoration and rollout to a working task
profile were not tested. The plugin had no timer implementation to preserve;
completion timestamps and history remain available. Compatibility has been
verified with the Hermes version above, not with every Hermes release.
