"""Verify public immutable screenshot links after the approved source push."""
import argparse
import json
import re
from urllib.request import Request, urlopen

REPO = "RudiFreeman/hermes-personal-task-manager"
IMAGES = ("dashboard-light.png", "dashboard-dark.png", "webapp-light.png", "webapp-dark.png", "dashboard-mobile.png", "webapp-mobile.png")


def verify(sha):
    if not re.fullmatch(r"[0-9a-f]{40}", sha):
        raise ValueError("Use the full lowercase source commit SHA")
    request = Request(f"https://api.github.com/repos/{REPO}/commits/{sha}", headers={"User-Agent": "PTM-catalog-link-check"})
    with urlopen(request, timeout=20) as response:
        commit = json.load(response)
    if commit["sha"] != sha:
        raise ValueError("Public commit does not match the pin")
    for name in IMAGES:
        url = f"https://raw.githubusercontent.com/{REPO}/{sha}/docs/screenshots/{name}"
        with urlopen(Request(url, headers={"User-Agent": "PTM-catalog-link-check"}), timeout=20) as response:
            if response.status != 200 or response.read(8) != b"\x89PNG\r\n\x1a\n":
                raise ValueError("Image is unavailable or is not a PNG: " + name)
        print("PASS", name, url)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--sha", required=True)
    args = parser.parse_args()
    verify(args.sha)
