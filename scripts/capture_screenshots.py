"""Capture native host UI with synthetic API responses, without task DB writes.

Requires Playwright and operator-supplied private authenticated browser states.
This development tool is never loaded by the plugin runtime.
"""
import argparse
import json
import re
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

ROOT = Path(__file__).resolve().parents[1]


def example_data():
    stamp = "2026-11-17T09:00:00+00:00"

    def item(identity, title, parent=None, done=False, starred=False):
        return dict(id=identity, parent_id=parent, title=title, description="",
                    done=done, starred=starred, revision=1, created_at=stamp,
                    updated_at=stamp, completed_at=stamp if done else None,
                    trashed_at=None, trash_batch=None)

    return dict(tasks=[item("review", "Prepare the weekly review", starred=True),
                       item("notes", "Gather notes and completed work", "review", done=True),
                       item("priorities", "Review priorities for next week", "review"),
                       item("plan", "Write the next steps", "review"),
                       item("workspace", "Organize the workspace"),
                       item("reading", "Read the plugin documentation")],
                trash=[], comments=[], events=[], progress=dict(total=3, done=0, percent=0))


def run(args):
    from playwright.sync_api import sync_playwright, expect
    args.output.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path=args.chromium, headless=True, args=["--no-sandbox"])
        for surface, url, state_file in [("dashboard", args.dashboard_url, args.dashboard_state),
                                         ("webapp", args.webapp_url, args.webapp_state)]:
            assert parse_qs(urlsplit(url).query).get("profile") == [args.profile]
            saved = json.loads(state_file.read_text(encoding="utf-8"))
            context = browser.new_context(storage_state=saved.get("storage", saved), viewport=dict(width=1280, height=1000))
            if saved.get("session"):
                origin = f"{urlsplit(url).scheme}://{urlsplit(url).netloc}"
                context.add_init_script("if (location.origin === " + json.dumps(origin) + ") for (const [k,v] of Object.entries(" + json.dumps(saved["session"]) + ")) sessionStorage.setItem(k,v)")
            overridden = set()

            def intercept(route):
                request = route.request
                parsed = urlsplit(request.url)
                # WebApp may be reverse-proxied under /Webapp; match the API
                # suffix without assuming a deployment prefix.
                api_path = "/api/" + parsed.path.split("/api/", 1)[1] if "/api/" in parsed.path else parsed.path
                if api_path.startswith("/api/plugins/personal-task-manager/tasks"):
                    assert request.method == "GET", "Screenshot capture must never mutate task data"
                    route.fulfill(json=example_data())
                    return
                if "/personal-task-manager/" in parsed.path and parsed.path.startswith("/dashboard-plugins/"):
                    for suffix, filename, mime in [("/dist/index.js", "dashboard/dist/index.js", "text/javascript"),
                                                    ("/dist/style.css", "dashboard/dist/style.css", "text/css")]:
                        if parsed.path.endswith(suffix):
                            overridden.add(filename)
                            route.fulfill(path=ROOT / filename, content_type=mime)
                            return
                if api_path == "/api/desktop-plugins/read":
                    path = parse_qs(parsed.query).get("path", [""])[0].replace("\\", "/")
                    if path.endswith("/personal-task-manager/plugin.js"):
                        data = (ROOT / "desktop/plugin.js").read_text(encoding="utf-8")
                        overridden.add("desktop/plugin.js")
                        route.fulfill(json=dict(text=data, path=path, byteSize=len(data.encode()), truncated=False))
                        return
                route.continue_()

            context.route("**/*", intercept)
            page = context.new_page()
            page.goto(url, wait_until="domcontentloaded")
            if surface == "webapp":
                page.locator("style[data-ptm=webapp]").wait_for(state="attached", timeout=30000)
                page.evaluate("location.hash='/personal-tasks'")
            widget = page.locator(".ptm")
            expect(widget).to_have_attribute("data-loaded", "true", timeout=30000)
            widget.locator(".ptm-language").select_option("en")
            title = widget.locator('[data-task-id="review"] > .ptm-row .ptm-task-title')
            if title.get_attribute("aria-expanded") != "true":
                title.click()
            expect(widget.locator('[data-task-id="notes"]')).to_be_visible()
            expected = {"desktop/plugin.js"} if surface == "webapp" else {"dashboard/dist/index.js", "dashboard/dist/style.css"}
            assert expected <= overridden, (surface, "Candidate bundle was not loaded", overridden)
            original = page.locator("html").get_attribute("data-hermes-mode") if surface == "webapp" else page.get_by_role("button", name="Switch theme", exact=True).get_attribute("title").split(": ", 1)[1]

            def mode(value):
                page.set_viewport_size(dict(width=1280, height=1000))
                if surface == "webapp":
                    if page.locator("html").get_attribute("data-hermes-mode") != value:
                        widget.locator("h1").click()
                        page.keyboard.press("Shift+X")
                        expect(page.locator("html")).to_have_attribute("data-hermes-mode", value)
                else:
                    name = {"light": "Nous Blue", "dark": "Hermes Teal"}.get(value, value)
                    page.get_by_role("button", name="Switch theme", exact=True).click()
                    page.get_by_role("option", name=re.compile("^" + re.escape(name) + r"\b", re.I)).first.click()

            try:
                for theme in ("light", "dark"):
                    mode(theme)
                    assert widget.evaluate("n => n.scrollWidth <= n.clientWidth + 1")
                    widget.screenshot(path=str(args.output / f"{surface}-{theme}.png"))
                if surface == "webapp":
                    mode("light")
                    page.set_viewport_size(dict(width=390, height=1000))
                    assert widget.evaluate("n => n.scrollWidth <= n.clientWidth + 1")
                    widget.screenshot(path=str(args.output / "webapp-mobile.png"))
            finally:
                mode(original)
                context.close()
            print("Captured", surface, "with synthetic GET responses and candidate bundles")
        browser.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dashboard-url", required=True)
    parser.add_argument("--webapp-url", required=True)
    parser.add_argument("--dashboard-state", type=Path, required=True)
    parser.add_argument("--webapp-state", type=Path, required=True)
    parser.add_argument("--profile", required=True)
    parser.add_argument("--chromium")
    parser.add_argument("--output", type=Path, default=ROOT / "docs/screenshots")
    run(parser.parse_args())
