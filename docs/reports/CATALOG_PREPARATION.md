# Catalog preparation: 0.2.1 candidate

Prepared locally on 2026-11-17. Nothing in this preparation has been pushed to
GitHub, and no fork, remote branch, issue or catalog pull request was created.
The owner will first install the prepared source through the normal Git
installer and explicitly approve it before an upstream submission.

## Prepared materials

- Native and Dashboard manifests: version 0.2.1; native manifest declares the
  conservative tested floor `requires_hermes: ">=0.23.1"`, author/homepage and
  explicit empty hooks/middleware/required environment variables.
- Shared UI fallback buttons now use the plugin's own `ptm-button` class.
  Dashboard compact controls use an explicit ptm-compact-button class on native
  components. No reliance on the host's data-slot markup. The child-add control
  has a transparent background so its label stays readable in light themes.
  All generated Dashboard/Desktop/preview bundles were rebuilt.
- English installation-first README with lifecycle behavior, migration,
  compatibility, data/network/execution disclosures and development instructions.
- Full MIT notices for the preview's bundled react, react-dom and scheduler in
  THIRD_PARTY_NOTICES.md. At the owner's explicit request, original project code
  and documentation are dual-licensed MIT OR Apache-2.0, at the recipient's
  option, with both full license texts and a root LICENSE statement.
- Five clean native-host screenshots in docs/screenshots, including both themes
  and mobile WebApp. Synthetic API responses and candidate bundles were supplied
  only inside the capture browser; no task mutation was sent to the server.
- Catalog entry template with `tier: community`, `category: tools`, all three
  tools, full-SHA/image URL placeholders and quoted version.
- English PR description/disclosures template and an offline renderer producing
  the single upstream YAML and patch from an exact local Git commit.
- Owner acceptance checklist in docs/INSTALLER_ACCEPTANCE.md.

## Checks performed

### Local development environment

- `npm run build`: passed; rebuilds all committed bundles from shared sources.
- `npm test`: passed translation, shared-controller/Dashboard DOM and WebApp
  SDK suites. The DOM check additionally verifies Dashboard compact controls and
  standalone fallback buttons use their own explicit plugin classes.
- `python -m pytest -q --basetemp=.local/catalog-prep-tests`: **23 passed,
  1 optional API module skipped** because FastAPI/httpx are absent locally.

### Isolated current Hermes environment

Hermes **v0.23.2**, public release commit
`ae2a81ccc00e9b7c06301523e5bb09608397149c`, was cloned into a temporary directory.
Its own dependency environment was created under a temporary HERMES_HOME using
the release's package manager and lock. The running installation was not updated.

The official `hermes plugins validate PLUGIN_PATH --install-deps --json` command
was executed against the candidate sources using that checkout/environment:

- **Exit 0; 16 checks passed; zero warnings.**
- Security scan: **safe**.
- Actual registration matches three tools, zero hooks/middleware; no built-in
  collisions, runtime core overrides or forbidden Desktop surface operations.
- Compatibility floor parses; no Python dependencies are declared to install.
- Isolated host readiness: `host_ready=true`.

Python regressions in this Hermes environment: **25 passed** with FastAPI
0.133.1 and Pydantic 2.14.1. Two dependency/test-runner warnings were emitted:
pytest could not rewrite an already-imported anyio module, and Starlette's
TestClient deprecated its httpx transport. They are not test failures or
Hermes admission warnings.

Logs and the separate Hermes checkout are retained in the VPS's temporary
catalog-preparation directory; downloaded reports are under ignored
`.local/catalog-audit`. They contain no submitted credentials.

### Native screenshots

Playwright/Chromium captured the actual candidate Dashboard and WebApp bundles
inside the running Hermes v0.23.1 hosts. The capture tool verifies the bundles
were intercepted from this source tree, checks no panel overflow and restores
the original native themes afterward. It handles reverse-proxied WebApp API
paths. Example tasks exist only in synthetic GET responses.

This capture is a rendering check, not a new end-to-end mutation test. The full
cross-surface completion/Trash/conflict/browser tests for the unchanged business
logic are documented in V020_VALIDATION.md. Physical devices, Safari, Firefox,
messaging channels and the owner's normal Git installation remain unverified.

## Remaining release gates

1. Approve pushing the prepared source to the plugin repository for the owner's
   Git-installer test. This is separate from catalog submission approval.
2. Install/test that exact public commit through the normal installer and record
   explicit owner acceptance. Do not substitute an untested SHA afterward.
3. Render/recheck the final YAML/PR body, verify public image URLs, then obtain
   the owner's explicit approval to create the catalog PR. Upstream human review
   and catalog CI are not completed by these local checks.

The staging renderer never contacts GitHub or creates a PR. Its rendered PR
body deliberately marks owner acceptance and final submitted-pin validation as
pending. No current source SHA or screenshot URL should be advertised as public
until publication is authorized and actually succeeds.

## Runtime safeguards

No working tasks or plugin installation were changed. The test browser's
Desktop half was enabled through native UI for capture, using the existing
disposable profile. Dashboard and Gateway remained active with the original
process IDs throughout; no services were restarted. Browser authentication
state is private, excluded from all source archives, and removed after use.
