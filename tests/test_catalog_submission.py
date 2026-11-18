"""Catalog generation reads only an immutable local commit; no publishing."""
import base64
import hashlib
import importlib.util
import json
import subprocess
from pathlib import Path

import pytest


@pytest.fixture
def catalog_repo(tmp_path, monkeypatch):
    root = Path(__file__).resolve().parents[1]
    spec = importlib.util.spec_from_file_location("catalog_prepare_test", root / "scripts/prepare_catalog.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    repo = tmp_path / "repo"
    repo.mkdir()

    def write(name, value):
        path = repo / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(value if isinstance(value, bytes) else value.encode())

    write("plugin.yaml", 'name: personal-task-manager\nversion: 1.0.0\nrequires_hermes: ">=0.23.1"\n')
    write("package.json", json.dumps({"version": "1.0.0"}))
    write("dashboard/manifest.json", json.dumps({"version": "1.0.0"}))
    write("package-lock.json", json.dumps({"version": "1.0.0", "packages": {"": {"version": "1.0.0"}}}))
    write("README.md", "Version **1.0.0**")
    write("LICENSE", "MIT")
    write("THIRD_PARTY_NOTICES.md", "Test notices")
    bundles = {name: hashlib.sha256(b"test bundle").hexdigest() for name in ["dashboard/dist/index.js", "dashboard/dist/style.css", "desktop/plugin.js"]}
    for name in bundles:
        write(name, "test bundle")
    png = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jgqkAAAAASUVORK5CYII=")
    shots = {name: {"sha256": hashlib.sha256(png).hexdigest()} for name in [*module.SCREENSHOTS, "dashboard-ru.png", "webapp-ru.png"]}
    for name in shots:
        write("docs/screenshots/" + name, png)
    write("docs/screenshots/capture.json", json.dumps({"plugin_version": "1.0.0", "synthetic_data": True, "privacy_reviewed": True, "bundle_hash_normalization": "LF", "bundles": bundles, "screenshots": shots}))
    for name in ["personal-task-manager.yaml.in", "PR_BODY.md.in"]:
        write("catalog-submission/" + name, (root / "catalog-submission" / name).read_bytes())
    subprocess.run(["git", "init", "-q", str(repo)], check=True)
    monkeypatch.setattr(module, "ROOT", repo)

    def commit():
        subprocess.run(["git", "-C", str(repo), "add", "."], check=True)
        subprocess.run(["git", "-C", str(repo), "-c", "user.name=Catalog Test", "-c", "user.email=catalog@example.invalid", "commit", "-qm", "fixture"], check=True)
        return subprocess.check_output(["git", "-C", str(repo), "rev-parse", "HEAD"], text=True).strip()

    return module, repo, tmp_path / "output", write, commit


def test_exact_local_pin_and_existing_pr_patch(catalog_repo, tmp_path):
    module, repo, output, write, commit = catalog_repo
    sha = commit()
    previous = tmp_path / "previous.yaml"
    previous.write_text("name: personal-task-manager\nversion: 0.2.3\n")
    module.render(sha, output, previous_entry=previous)
    entry = (output / "plugin-catalog/personal-task-manager.yaml").read_text()
    assert f'sha: "{sha}"' in entry
    assert 'version: "1.0.0"' in entry
    assert entry.count(f"/{sha}/docs/screenshots/") == 6
    assert "@SHA@" not in entry
    assert (output / "SOURCE_COMMIT").read_text().strip() == sha
    assert "existing submission" in (output / "PR_BODY.md").read_text()
    assert "new file mode" not in (output / "pr-update.patch").read_text()
    # A dirty tree must never change the generated pin/version.
    write("package.json", '{"version":"9.9.9"}')
    module.render(sha, output)
    assert 'version: "1.0.0"' in (output / "plugin-catalog/personal-task-manager.yaml").read_text()


@pytest.mark.parametrize("fault", ["lock", "readme", "bundle", "image", "privacy"])
def test_reject_inconsistent_committed_artifacts(catalog_repo, fault):
    module, repo, output, write, commit = catalog_repo
    if fault == "lock":
        write("package-lock.json", '{"version":"1.0.0","packages":{"":{"version":"0.2.3"}}}')
    elif fault == "readme":
        write("README.md", "Version **0.2.3**")
    elif fault == "bundle":
        write("desktop/plugin.js", "stale bundle")
    elif fault == "image":
        write("docs/screenshots/dashboard-light.png", b"stale screenshot")
    else:
        data = json.loads((repo / "docs/screenshots/capture.json").read_text())
        data["privacy_reviewed"] = False
        write("docs/screenshots/capture.json", json.dumps(data))
    with pytest.raises(ValueError):
        module.render(commit(), output)
