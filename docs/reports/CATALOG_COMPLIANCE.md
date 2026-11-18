# Hermes Plugin Catalog compliance audit

Audit date: 2026-11-17. Plugin version: **0.2.0**.
Audited public commit: `92ddc9292f954bb6c3e9b6845b2dcee14110075f`.

This historical baseline audit describes 0.2.0 before preparation changes.
See [0.2.1 preparation](CATALOG_PREPARATION.md) for the updated candidate status.

## Verdict

The current tree passes the installed Hermes admission validator. It is not yet
submission-ready: compatibility metadata, a reviewer warning, release-facing
documentation, screenshot hosting and catalog/PR artifacts still need work.
This is the initial audit, not a submission or a guarantee of catalog approval.
No source changes were published and no pull request was created for this audit.

Sources:

- [Submission guidelines](https://hermes-agent.nousresearch.com/docs/developer-guide/plugins/catalog-submission)
- [Canonical policy and entry schema](https://github.com/NousResearch/hermes-agent/blob/main/plugin-catalog/README.md)
- [Public plugin API](https://hermes-agent.nousresearch.com/docs/developer-guide/plugins/public-api)
- [Latest published Hermes release](https://github.com/NousResearch/hermes-agent/releases/tag/v0.23.2)

## Reproduced admission check

A fresh checkout of the public commit above was cloned into
`/tmp/ptm-catalog-audit.ViRzZe/plugin` on the previously authorized VPS.
The following command was run against that checkout:

```sh
PTM_DATA_DIR=/tmp/ptm-catalog-audit.ViRzZe/data \
  hermes plugins validate /tmp/ptm-catalog-audit.ViRzZe/plugin \
  --install-deps --json
```

Result: **exit 0; ok=true; 16 checks passed; one warning**.
The JSON report is retained at `/tmp/ptm-catalog-audit.ViRzZe/validation.json`.
The dependency declaration check found no Python dependencies; the flag was
executed, but there were no declared Python packages to install. This does not
verify installing the frontend development dependencies or exercise API routes.

The validator ran on installed Hermes **v0.23.1**, checkout
`3b421578588243f920886e6fe79a6faa87ea026e`. The latest published release at audit
time is **v0.23.2**. Current upstream catalog CI has not been run. Revalidate the
final candidate with current Hermes before submission; do not treat this older
runtime's successful check as proof that future catalog CI is green.

Passed checks: manifest parsing/required fields; requires_hermes syntax (absent);
config schema; environment declarations; OAuth; loadable entrypoints; Python
dependencies; isolated registration probe; declared tools/hooks/middleware;
built-in tool collisions; security scan; no core override; Desktop SDK surface.
The isolation audit reports `host_ready=true` and `verdict=host`.

The warning is `app markup selector (desktop/plugin.js:706)`. It originates in
`frontend/src/style.css:6`:

```css
.ptm button:not([data-slot]):not(.ptm-task-title) { /* fallback button styles */ }
```

Manual review: the selector is scoped to plugin-owned content and distinguishes
host SDK controls rendered by this plugin. It does not query or modify the core
application's markup. Nevertheless, replace the attribute-dependent selector
with explicit plugin classes, rebuild, and rerun validation to remove this
avoidable reviewer warning. Do not suppress the scanner.

## Compliance matrix

| Area | Status | Finding / required follow-up |
| --- | --- | --- |
| Public repository | Pass | GitHub reports the project as public. The audited SHA is reachable. |
| Native layout | Pass | Root plugin.yaml and __init__.py; Dashboard manifest/API/bundle/CSS; Desktop single-file ESM bundle. No plugin.json is needed for this native package. |
| Version consistency | Pass | Plugin/Dashboard manifests and package.json declare 0.2.0. |
| Tools and capabilities | Pass / entry pending | Three declared tools match actual registrations; zero hooks/middleware; no built-in collisions. Mirror these declarations in the catalog entry. |
| Dashboard/WebApp integration | Previously verified | Shared store/controller/view; native host React, transport and controls. Prior 0.2.0 real-host browser checks passed; they were not rerun during this audit. See V020_VALIDATION.md. |
| Hermes compatibility floor | Incomplete | plugin.yaml has no requires_hermes. A conservative candidate is ">=0.23.1", the known tested version, subject to current-runtime validation. Use the same value in the entry. |
| Public API | Pass on reviewed paths | ctx.register_tool, plugins.plugin_storage.plugin_data_dir and Desktop SDK routes/slots/rest/lifecycle. plugin_storage is in the current published public API list. |
| Security scan | Pass | Official installed scanner reports safe. No runtime overrides of Hermes core; Desktop surface check passes. |
| Desktop review warning | Needs change | Remove the data-slot-dependent fallback CSS selector described above. |
| English-first UI/docs | Partial | English README and default UI exist, with Russian optional. README still describes a local prototype and has outdated source-editing/header guidance. Prepare an installation-focused catalog README. |
| Behaviour disclosures | Partial | Add a single explicit section covering storage, UI polling, same-host API calls, optional override/preview/test behaviour, no telemetry, and no task execution. |
| License and notices | Needs owner decision / packaging | No root LICENSE; GitHub reports license=null. Bundled preview React has MIT notice comments but no accompanying full license text. Choose the project's license and include required third-party notices. This is a distribution-readiness issue, not a reported validator failure or an explicit separate license rule in the admission page. |
| Screenshots | Incomplete | Four mobile screenshots exist only in ignored .local/ui-review; remote layout artifacts also exist. Create clean representative screenshots and commit the selected images in docs/screenshots. |
| Catalog entry | Missing | Prepare plugin-catalog/personal-task-manager.yaml for the upstream repository. community is tier, not category; tools is an appropriate category. |
| SHA pin / image URLs | Pending final candidate | Entry needs a full 40-character commit and quoted version; screenshot URLs must resolve to approved GitHub image hosts, preferably pinned to that same commit. Current SHA is only the audited baseline. |
| PR preparation | Not started | Prepare a local branch/patch and English PR description with surfaces, disclosures, validation evidence and screenshots. Creating or publishing the PR requires the user's later confirmation. |

## Manual security review

The runtime does not execute task text, launch shell commands, call external
services, download replacement code, manage OAuth tokens, read Hermes credential
stores, auto-approve actions, or patch Hermes internals. Desktop imports host
React and @hermes/plugin-sdk. UI content is rendered as text, with styles scoped
to .ptm. The Desktop bundle contains no eval, new Function, remote dynamic
imports, script injection, native bridge calls or browser prototype patches.

Task mutations retain revisions, explicit user-request tool instructions and
completion evidence. A confirmed parent completion cascades atomically. Purge
requires explicit confirmation. Authenticated HTTP routing is supplied by Hermes;
the plugin router must not be exposed as an unauthenticated standalone API.

Normal storage is the active profile's plugin data directory. PTM_DATA_DIR is an
optional, non-secret environment override that can select another directory;
document it as a development feature and its profile-isolation implications.
It is not a required secret, so it should not be falsely listed as required.

The standalone preview is opt-in, binds loopback, generates an in-memory API
token and uses its own development database. The optional browser test harness
reads explicitly supplied authentication-state files; it is not imported by
the plugin or a runtime credential acquisition path. Preserve that distinction
in reviewer disclosures. Language/expansion preferences are the only values the
runtime stores in browser localStorage; tasks are stored in SQLite.

A check of all 33 tracked files found no executable binary headers or committed
Python bytecode. Frontend bundles are readable JavaScript and their editable
sources/build script/lockfile are tracked. Development-only npm dependencies
are not needed by the prebuilt host entrypoints. The standalone preview bundles
React; include its full applicable license notices before distribution.

## Proposed preparation work

1. Set a truthful Hermes floor and complete metadata; resolve project licensing
   with the owner and package third-party notices.
2. Replace the flagged fallback selector with plugin classes, rebuild and run
   regressions. Preserve the shared implementation and existing contracts.
3. Refresh the English README and add clean Dashboard/WebApp screenshots with
   synthetic tasks and no credentials or personal information.
4. Validate the exact candidate with --install-deps on current Hermes in an
   isolated environment. Keep working services, configuration and tasks intact.
5. Prepare the community-tier/tools-category YAML and local upstream PR patch
   plus English PR body. Leave final SHA/image URL pinning until the prepared
   source is approved for publication and its commit is available publicly.
6. Present the complete package for confirmation before any push, fork, remote
   branch, issue or pull request is created.

Expected files: plugin.yaml; frontend/src/style.css and view.mjs; generated
Dashboard/Desktop/preview artifacts; relevant frontend regression tests;
README.md; LICENSE and third-party notices (after license selection);
docs/screenshots/*; a local catalog-entry/PR preparation directory; and a final
validation report. The upstream PR should add only the single catalog YAML,
with plugin code and screenshots living in the plugin repository.

## Limits and safeguards

No working task database was accessed, no installed plugin was replaced, and
no service was restarted. Dashboard and Gateway remain active with their
original process IDs. This audit used a disposable clone and validator probe.
The existing 25-test and browser results are historical release evidence, not a
new test run for unimplemented catalog preparation changes. A maintainer's
human review remains necessary even after all checks pass.
