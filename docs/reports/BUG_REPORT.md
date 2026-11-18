# Code review: actionable bug backlog

Review date: 2026-11-17. Project: `C:\python\Personal_Task_Manager`.

## Owner acceptance feedback — 2026-11-18

### BUG-07 — Equal-timestamp tasks are sorted by random UUID

**Confirmed:** snapshot() ordered by created_at and id. Items created in one
atomic add share a timestamp, so UUID order shuffled siblings and could shuffle
same-timestamp parents. A deterministic fixture with descending UUIDs returned
1.9 through 1.1 after receiving 1.1 through 1.9.

**Working-tree fix:** use the existing durable created-event sequence to break
timestamp ties. This restores order for previously-created data, keeps the same
snapshot fields, and requires no schema or real-data migration. A stable rowid
fallback applies to records without a creation event. Timestamps are not altered.

**Regression coverage:** test_equal_timestamp_items_keep_original_creation_order
checks parent/sibling order through reopening, the Hermes list handler, edits,
Trash and restoration with deliberately reverse-sorted UUIDs and one timestamp.
test_tool_unicode_description_needs_no_ascii_escaping checks both raw Unicode
and escaped JSON descriptions with Cyrillic, guillemets, quotes, backslashes
and newlines through the real update handler and persistence.

**Checks:** local Python **25 passed, one optional API module skipped**;
translation, Dashboard/controller and WebApp SDK Node suites passed. These
checks use temporary databases only. This working-tree follow-up is not yet a
published release, a VPS deployment, or new owner acceptance of the catalog pin.

The reported tool_call batch-size/JSON parsing errors are outside these native
handlers. Valid raw-Unicode JSON passes the plugin. The exact cause of the failed
wrapper payloads cannot be established without the actual failing arguments;
escaping all Cyrillic is not a demonstrated plugin requirement.

The root-only progress total is intentional existing behavior. Subtask totals,
filtered/compact list responses, atomic batch editing and safe clickable links
are enhancement candidates. Any batch update should retain per-item revisions
and roll back on conflict; removing revision checks or adding force is not part
of this fix. Descriptions can already be supplied in personal_tasks_add for the
parent and each child, avoiding a second update per newly-created item.

## Implementation status — 2026-11-17

### Version 0.2.0 follow-up

All five fixes remain covered after the shared Dashboard/WebApp UI refactor.
The permanent tests now use deferred controller requests and the actual React
DOM instead of the earlier minimal DOM fixture. Native browser checks passed
against both running Hermes interfaces, including Russian stale saves,
preserved focus/drafts, cross-interface synchronization, Archive, Trash and
restoration. Both host themes passed at five viewport widths.

Final checks: **23 local Python tests passed, one optional API module skipped**;
**25 Python tests passed in Hermes**, including the real API; translation,
Dashboard/controller and WebApp SDK Node suites all passed. Plugin Doctor and
explicit model tool calls also passed. See [0.2.0 validation](V020_VALIDATION.md)
for scope, environment and remaining limits. Historical results below describe
the corresponding earlier release, not current verification gaps.

The user explicitly changed the completion contract for this version: checking
a parent completes its active children atomically and archives the group.
Reopening preserves child checkmarks; finishing the last child still does not
complete its parent. Revision protection, evidence requirements, translations
and original Hermes tool names remain intact. Transactional schema migration
now ends at version **2**, so the historical BUG-05 version-1 acceptance below
is evaluated with that updated version expectation.

All five reported bugs are fixed. The original findings below are retained as
historical reproduction evidence; their **Actual** sections describe the reviewed
code before these fixes.

| ID | Status | Implemented fix and permanent coverage |
| --- | --- | --- |
| BUG-01 | Fixed | Per-form drafts keyed by task/subtask ID retain their original revision through language changes and polling. Only dirty fields are submitted. `test_ui.cjs` verifies parent and child conflicts, remote data preservation, retained failed drafts, and successful language switching without a remote change. |
| BUG-02 | Fixed | Independent mutations preserve drafts and expanded editors. Only the successfully submitted form is cleared; drafts remain associated with their original task when selecting another task. `test_ui.cjs` covers importance, subtask completion, notes, new subtasks, failed writes, and repeated saves. |
| BUG-03 | Fixed | Polls rebuild clean fields and read-only details from current data while dirty fields retain their base revision. Localized stale-draft warnings offer an explicit discard/reload action. `test_ui.cjs` covers remote titles, comments, subtasks, completion, current clean revisions, and dirty conflicts. |
| BUG-04 | Fixed | Monotonic refresh IDs and mutation generations reject obsolete GET responses; disposed views reject updates. Deferred-promise tests in `test_ui.cjs` cover pre-mutation GETs, reverse GET ordering, failed mutations/GETs, recovery, and disposal. |
| BUG-05 | Fixed | `BEGIN IMMEDIATE` precedes schema inspection. Fixed DDL statements and version assignment run in one transaction. WAL setup retries only transient SQLite locking errors with a bounded backoff; setup failures close the connection. `test_tasks.py` covers simultaneous absent-database initialization and writes, serialized version reads, injected DDL rollback/retry, version compatibility, and setup cleanup. |

Validation of the implementation:

- `python -m pytest -q --basetemp=.local/fix-tests-20261117-02`: **16 passed**. All databases were disposable test databases. Existing completion rules, revision conflicts, translations, Hermes registration/tool invocation, and protected preview HTTP tests still pass.
- `node test_i18n.cjs`: **passed**; both language catalogs and placeholders remain consistent.
- `node test_ui.cjs`: **passed**; permanent regressions load the actual application JS with a minimal DOM and controlled transport promises, without timing sleeps or real task data.
- `git diff --check`: **passed** (Git emitted only Windows line-ending notices).
- The initial default `python -m pytest -q` could not prepare the existing `.pytest-temp` directory due to a Windows access-denied error. Re-running the entire suite with a fresh disposable `--basetemp` succeeded. The existing directory was not altered to bypass its permissions.
- Browser smoke testing was attempted through the available computer-use runtime, but that runtime exited before opening a browser: `windows sandbox failed: helper_unknown_error: setup refresh had errors`. Browser rendering, focus behavior, and real multi-client browser interaction therefore remain unverified. The Node checks are not a substitute for this smoke test.
- The real Hermes installation, Plugin Doctor, Dashboard authentication, and FastAPI adapter runtime remain unverified. No deployment was performed; no real task database was used.

Release follow-up: the user subsequently authorized updating the version and
pushing the source changes to GitHub. Plugin and Dashboard manifests and README
now declare **0.1.1**; the SQLite schema version remains **1**. The release check
`python -m pytest -q --basetemp=.local/release-0.1.1-tests` passed all **16 tests**;
`node test_i18n.cjs`, `node test_ui.cjs`, and `git diff --check` also passed.

## VPS follow-up — BUG-06 fixed in 0.1.2

Real Hermes v0.23.1 browser testing found that SDK `fetchJSON` does not add a JSON
content header. UI POST/PATCH bodies were sent as browser string bodies and
FastAPI returned HTTP 422. The preview's own transport added this header, masking
the integration error. The shared UI request wrapper now explicitly sends
`Content-Type: application/json`. The permanent `test_ui.cjs` transport asserts
the header on every write; real browser creation and saving passed after the fix.

VPS checks passed all 16 Python tests, both Node suites, Plugin Doctor, the actual
FastAPI adapter, authenticated session access, real model invocation of all three
tools, browser draft/polling/conflict scenarios, and snapshot persistence after a
test-server restart. See [VPS validation](VPS_VALIDATION.md) for precise scope,
the host Dashboard ownership incident and restoration, and remaining limitations.

## Original implementation instructions

Fix the five confirmed bugs below. Application code was not changed during this review. Work on one bug at a time, add the specified regression coverage, and preserve existing task completion rules, revision checks, translations, and tool contracts. Do not disable optimistic concurrency to make UI tests pass. Do not modify real task data, deploy, or publish anything.

Suggested order: BUG-01, BUG-02, BUG-03, BUG-04, BUG-05. The first three share editor state management and can use the same small draft-state helper. Prefer explicit state over a framework migration. Line numbers refer to the reviewed source; use the named functions after edits.

Priority: P1 means potential loss of user work; P2 means incorrect behavior or an intermittent failed operation.

| ID | Priority | Problem | Main location |
| --- | --- | --- | --- |
| BUG-01 | P1 | Changing language silently bypasses stale-draft conflict detection | `dashboard/dist/index.js:136` |
| BUG-02 | P1 | Unrelated successful actions discard unsaved editor text | `dashboard/dist/index.js:170` |
| BUG-03 | P2 | Polling never refreshes the open task details, even when clean | `dashboard/dist/index.js:279` |
| BUG-04 | P2 | Late GET responses overwrite newer client state | `dashboard/dist/index.js:163` |
| BUG-05 | P2 | Concurrent first use races during SQLite schema creation | `store.py:47` |

## Review scope and evidence

Read README.md, plugin.yaml, dashboard/manifest.json, all application Python files, dashboard/dist/index.js, dashboard/dist/style.css, and both existing test files. No applicable AGENTS.md was found in the project or checked parent locations. No code-review skill is present in the available skill catalog or local personal skills directory; unrelated artifact skills were not applied.

The public integration surfaces were also checked against the official [Dashboard extension documentation](https://hermes-agent.nousresearch.com/docs/user-guide/features/extending-the-dashboard) and [plugin documentation](https://hermes-agent.nousresearch.com/docs/developer-guide/plugins). This is not verification against an installed Hermes version.

Executed checks:

- `python -m pytest -q --basetemp=.local/review-tests-20261117`: **11 passed**.
- `node test_i18n.cjs`: **passed**.
- `node .local/review-ui.cjs`: **four targeted reproductions passed**, meaning they confirmed the faulty behavior below. This local diagnostic loads the actual unmodified JS in Node with a minimal DOM and controlled transport/timer. It is not a browser rendering or real HTTP test.
- `python .local/review-storage.py`: **confirmed the schema creation race**, using real SQLite connections and a barrier to force both constructors to observe version zero.
- An additional natural concurrency experiment started eight constructors per fresh database, for 20 databases. **39 of 160 initializations failed with `OperationalError: database is locked`**. This count is timing dependent and is not a deterministic regression assertion.

Diagnostic scripts and disposable databases are under ignored `.local/`. The report's reproduction steps and acceptance criteria are self-contained; the scripts are local supporting evidence, not permanent regression tests. No existing task database was used. FastAPI is not installed in this environment, so the Dashboard HTTP adapter was reviewed statically, not executed. A real browser and production Hermes were not tested.

## BUG-01 — Language changes attach a new revision to an old draft

**Location:** `dashboard/dist/index.js:136-155`, `changeLanguage`; task edit submission in `renderDetail` at lines 233-240.

**Reproduce:**

1. Open a task at revision 1. Edit its description without saving.
2. In another client or through Hermes, update the same description. The stored task becomes revision 2.
3. Allow the ten-second poll to run. The list's `data` now contains revision 2, while the detail form still contains the revision-1 draft.
4. Change the interface language and save the form.

**Actual:** `changeLanguage` captures input values, rebuilds the detail form from the latest `data`, then restores the old input values. The new submit callback captures revision 2. Saving overwrites the remote change without a conflict. The local diagnostic observed a PATCH with revision 2 and the stale draft text.

**Expected:** A language change must not alter the revision against which a draft was started. Saving this draft should produce a conflict, or an explicit merge workflow, rather than silently overwrite remote work.

**Implementation guidance:**

- Store draft values and their base revision outside transient DOM nodes, keyed by task/subtask ID.
- Preserve that base revision across language changes and polling.
- Keep untouched fields distinguishable from edited fields. Do not restore every old field into a form that is treated as current.
- On conflict, retain the draft and let the user explicitly reload or reconcile it. Never silently replace its base revision.

**Regression acceptance:** Run the sequence above for a parent task and a subtask. The outgoing stale edit still uses revision 1, the remote description survives, and the local draft remains available. Changing language without a remote edit still preserves text and saves successfully.

## BUG-02 — Successful actions erase unrelated drafts

**Location:** `dashboard/dist/index.js:170-179`, `mutate`; `refresh` at lines 163-169; `renderDetail` at line 229.

**Reproduce:**

1. Open a task and type an unsaved description.
2. Click its importance star in the task list.
3. Wait for the successful PATCH and subsequent GET.

**Actual:** Every successful `mutate` calls `refresh()` with detail rendering enabled. `renderDetail` replaces the entire form with stored values. The unsaved description disappears. The diagnostic confirmed that `Unsaved draft` becomes the stored `Initial` text after starring. The same rebuild can discard a draft note or subtask text when another independent action succeeds.

**Expected:** Changing importance or completing another item must not silently discard unrelated text.

**Implementation guidance:**

- Preserve dirty fields and expanded subtask editors when refreshing after a mutation.
- Clear only the submitted draft after its write succeeds; keep other drafts.
- Keep drafts separated by task/subtask ID so selecting another task cannot attach text to the wrong item.
- Coordinate with BUG-01: preserving text must not automatically approve overwriting a newer remote revision. Advance a draft baseline only when the corresponding state is known to be safe, not merely because any refresh succeeded.

**Regression acceptance:** Type unsaved parent text and a draft note, then toggle importance or complete a subtask. Both drafts remain. Saving one form clears/updates only that form's draft. Failed writes retain all submitted text.

## BUG-03 — Open details remain permanently stale after polling

**Location:** `dashboard/dist/index.js:279`, interval callback; `refresh` at lines 163-169 and handlers created by `renderDetail`.

**Reproduce:**

1. Open a task, without editing any fields.
2. Change its title or add a comment/subtask through another client.
3. Wait for one or more polls.
4. Try saving or performing a detail-panel action.

**Actual:** Polling always calls `refresh(false)`. The list updates, but the detail panel, notes, subtask list, completion state, and captured revision never refresh. The diagnostic showed a new title in the list, the old title in a clean form, and a subsequent PATCH with revision 1 although revision 2 was already loaded. Users see stale information and avoidable revision errors until a full refresh or reselection.

**Expected:** Clean details and read-only sections should track remote changes. Dirty input should be preserved with its original revision and an appropriate stale-edit indication.

**Implementation guidance:** Track dirty state explicitly. Refresh clean fields and noneditable sections after polling; retain dirty values and their base revisions. Distinguish the revision needed for a draft submission from the latest state used by independent actions. Do not fix this by unconditionally redrawing all inputs or by blindly assigning the latest revision to old text.

**Regression acceptance:** Remote titles, comments, subtasks and completion state appear in the open clean panel after polling. A clean form uses the updated revision. A dirty form retains its text and still detects conflicting edits.

## BUG-04 — Out-of-order refreshes roll the UI back

**Location:** `dashboard/dist/index.js:163-169`, `refresh`; mutation refresh at line 176; polling at line 279.

**Reproduce with controlled transport:**

1. Start a poll GET and delay delivery after it captures the old snapshot.
2. Toggle importance. Let the PATCH and its follow-up GET finish successfully.
3. Deliver the old poll response.

**Actual:** Every GET response assigns `data = next` with no request ordering or mutation-generation check. The older poll replaces the newer snapshot. The diagnostic observed the star return to false although the server had successfully saved true. Subsequent actions can also use old revisions. The `pending` check only prevents starting a poll during a mutation; it does not invalidate a poll already running.

**Expected:** An older in-flight refresh must not replace newer accepted state or resurrect a snapshot from before a mutation.

**Implementation guidance:** Give refreshes monotonically increasing request IDs and invalidate pre-mutation requests when a mutation starts, or implement equivalent serialization/cancellation. Apply results only if they still belong to the current generation and mounted view. Ensure disposal and failed requests cannot accidentally make an old result current again.

**Regression acceptance:** Use deferred promises, not timing sleeps. Resolve a pre-mutation GET after the mutation's GET; the UI remains at the new state. Also resolve two refreshes in reverse order. Test a failed mutation so polling can still recover normally.

## BUG-05 — Initial database creation is neither serialized nor atomic

**Location:** `store.py:47-84`, `Store.__init__`; connection setup at lines 87-98.

**Reproduce:** Point two concurrent Store constructors at the same new database. For a deterministic test, pre-enable WAL on an otherwise empty database and synchronize the constructors just after both execute `PRAGMA user_version`, before either creates tables. Then allow both to proceed.

**Actual:** Both observe version 0 and execute the unconditional CREATE statements. In the diagnostic, one constructor succeeded and the other raised `OperationalError: table tasks already exists`. Natural simultaneous starts also produced lock failures. This affects Dashboard/tool first-use requests because both construct Store instances. The existing concurrency test initializes the database in its fixture before concurrent work, so it misses this path.

The schema script also lacks an explicit transaction. The surrounding Python connection context does not make `executescript` atomic. An interrupted or failed schema script can leave tables present with user_version still zero, making the next attempt fail on CREATE TABLE.

**Expected:** Concurrent first use initializes the schema once and lets all callers proceed. A failed initialization must not leave a partially committed schema.

**Implementation guidance:**

- Acquire a database write lock before reading the schema version, then read the version again while holding that lock.
- Execute schema creation and the version update in one explicit transaction. Avoid an `executescript` call that implicitly commits an already-open transaction; individual fixed DDL statements are a straightforward option.
- Handle initial WAL setup contention deliberately, using bounded retry for transient lock errors if needed. Do not swallow unrelated database errors.
- Put all connection setup PRAGMAs inside the try/finally that closes the connection. Currently a PRAGMA failure occurs before that cleanup guard.
- Preserve rejection of newer schema versions. `CREATE TABLE IF NOT EXISTS` alone does not establish schema validity or solve the transactional issue.

**Regression acceptance:** Several workers simultaneously initialize the same absent database and add distinct tasks without errors or lost writes; schema version ends at 1. Inject a failure during schema initialization and verify rollback and successful retry. Existing version-1 databases and newer-version rejection still behave correctly.

## Final validation after implementation

Run existing Python and translation tests plus permanent regression tests for all five cases. Use temporary databases and controlled transport promises. Perform a browser smoke check of language switching, draft preservation, concurrent edits and background refresh. Keep actual Hermes installation/authentication verification explicitly separate; passing local tests does not establish that compatibility.
