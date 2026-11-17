"""Render a local catalog entry/PR patch from an exact committed source tree.

No network access, publishing, forking or PR creation. Output is ignored by Git.
"""
import argparse
import difflib
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCREENSHOTS = ("dashboard-light.png", "dashboard-dark.png", "webapp-light.png", "webapp-mobile.png")


def git(*args):
    return subprocess.check_output(["git", "-C", str(ROOT), *args])


def render(sha, output):
    if not re.fullmatch(r"[0-9a-f]{40}", sha):
        raise ValueError("Use the full lowercase 40-character commit SHA")
    if git("rev-parse", f"{sha}^{{commit}}").decode().strip() != sha:
        raise ValueError("The pin must identify a commit")

    def committed(path):
        return git("show", f"{sha}:{path}")

    manifest = committed("plugin.yaml").decode("utf-8")
    version = re.search(r"^version:\s*[\"']?([0-9]+\.[0-9]+\.[0-9]+)[\"']?\s*$", manifest, re.M)
    if not version or 'requires_hermes: ">=0.23.1"' not in manifest:
        raise ValueError("Pinned manifest must declare a release version and the tested Hermes floor")
    for path in ("dashboard/manifest.json", "package.json"):
        if json.loads(committed(path))["version"] != version.group(1):
            raise ValueError("Pinned versions disagree: " + path)
    for name in SCREENSHOTS:
        if not committed("docs/screenshots/" + name).startswith(b"\x89PNG\r\n\x1a\n"):
            raise ValueError("Missing or invalid committed screenshot: " + name)
    committed("THIRD_PARTY_NOTICES.md")
    # Project licensing is an owner decision, not something a generator grants.
    license_ready = "LICENSE" in git("ls-tree", "--name-only", sha).decode().splitlines()
    replacements = {"@SHA@": sha, "@VERSION@": version.group(1),
                    "@VALIDATION@": "PENDING: attach validation of this exact commit on current Hermes; do not submit yet.",
                    "@OWNER_ACCEPTANCE@": "PENDING: owner must install this commit through the normal Git installer and explicitly approve it. Do not open a PR yet.",
                    "@LICENSE_STATUS@": "Project license is included in LICENSE." if license_ready else "PENDING: the owner has not selected a project license. Third-party preview notices are included; no project license is granted by this staging package."}

    def template(name):
        value = committed("catalog-submission/" + name).decode("utf-8")
        for key, replacement in replacements.items():
            value = value.replace(key, replacement)
        if re.search(r"@[A-Z_]+@", value):
            raise ValueError("Unresolved template placeholder")
        return value

    entry = "\n".join(line for line in template("personal-task-manager.yaml.in").splitlines()
                      if not line.startswith("#")) + "\n"
    body = template("PR_BODY.md.in")
    entry_path = output / "plugin-catalog" / "personal-task-manager.yaml"
    entry_path.parent.mkdir(parents=True, exist_ok=True)
    entry_path.write_text(entry, encoding="utf-8")
    (output / "PR_BODY.md").write_text(body, encoding="utf-8")
    target = "plugin-catalog/personal-task-manager.yaml"
    patch = f"diff --git a/{target} b/{target}\nnew file mode 100644\n" + "".join(
        difflib.unified_diff([], entry.splitlines(keepends=True), fromfile="/dev/null", tofile="b/" + target))
    (output / "catalog.patch").write_text(patch, encoding="utf-8")
    print(f"Prepared {version.group(1)} at {sha} under {output}")
    print("Local artifacts only. Public SHA/image availability and owner acceptance are NOT verified.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--sha", required=True)
    parser.add_argument("--output", type=Path, default=ROOT / ".local" / "catalog-submission")
    args = parser.parse_args()
    try:
        render(args.sha, args.output)
    except (ValueError, subprocess.CalledProcessError) as error:
        parser.exit(1, f"Catalog preparation failed: {error}\n")
