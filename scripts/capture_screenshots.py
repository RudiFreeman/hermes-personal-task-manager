"""Capture native host UI with synthetic API responses, without task DB writes.

Requires Playwright and operator-supplied private authenticated browser states.
This development tool is never loaded by the plugin runtime.
"""
import argparse
import json
import hashlib
import struct
import time
from datetime import datetime, timezone
import re
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

ROOT = Path(__file__).resolve().parents[1]


def example_data(language="en"):
    russian = language.lower().startswith("ru")
    stamp = "2026-11-18T09:00:00+00:00"

    def item(identity, english, translated, parent=None, done=False, starred=False):
        return dict(id=identity, parent_id=parent, title=translated if russian else english, description="",
                    done=done, starred=starred, revision=1, created_at=stamp,
                    updated_at=stamp, completed_at=stamp if done else None,
                    trashed_at=None, trash_batch=None)

    tasks = [item("review", "Prepare the product demo", "Подготовить демонстрацию продукта", starred=True),
             item("outline", "Draft the demo outline", "Составить план демонстрации", "review", done=True),
             item("examples", "Choose three clear examples", "Выбрать три наглядных примера", "review"),
             item("rehearsal", "Rehearse the walkthrough", "Провести репетицию", "review"),
             item("workspace", "Organize the shared workspace", "Навести порядок в рабочем пространстве"),
             item("reading", "Read the release notes", "Прочитать заметки к выпуску")]
    tasks[0]["description"] = ("Показать, как записать задачу, разбить её на шаги и сохранить результат.\n\nПодготовить короткую демонстрацию для команды." if russian else
        "Show how to capture a task, break it into steps, and record the result.\n\nPrepare a short walkthrough for the team.")
    return dict(tasks=tasks, trash=[], comments=[dict(id=1, task_id="review", actor="user", created_at=stamp,
        body="План готов. Осталось подобрать примеры и провести репетицию." if russian else
             "The outline is ready. Next: choose the examples and rehearse the walkthrough.")],
        events=[dict(id=1, task_id="review", actor="user", created_at=stamp)], progress=dict(total=3, done=0, percent=0))


def run(args):
    from playwright.sync_api import sync_playwright, expect, TimeoutError as PlaywrightTimeout
    args.output.mkdir(parents=True, exist_ok=True)
    started = time.time()
    theme_checks = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path=args.chromium, headless=True, args=["--no-sandbox"])
        for surface, url, state_file in [("dashboard", args.dashboard_url, args.dashboard_state),
                                         ("webapp", args.webapp_url, args.webapp_state)]:
            assert parse_qs(urlsplit(url).query).get("profile") == [args.profile]
            saved = json.loads(state_file.read_text(encoding="utf-8"))
            context = browser.new_context(storage_state=saved.get("storage", saved), viewport=dict(width=1280, height=1000), locale="en-US", timezone_id="Europe/Moscow")
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
                    route.fulfill(json=example_data(parse_qs(parsed.query).get("language", ["en"])[0]))
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
                if args.skip_test_onboarding:
                    # Only for an explicitly disposable test host: no provider,
                    # credential or subscription is configured by this choice.
                    later = page.get_by_role("button", name="I'll choose a provider later", exact=True)
                    try:
                        later.wait_for(state="visible", timeout=20000)
                        later.click()
                        later.wait_for(state="hidden", timeout=10000)
                    except PlaywrightTimeout:
                        pass
            widget = page.locator(".ptm")
            expect(widget).to_have_attribute("data-loaded", "true", timeout=30000)
            def language(code):
                settings = widget.locator(".ptm-settings")
                if settings.get_attribute("open") is None:
                    settings.locator("summary").click()
                widget.locator(".ptm-language").select_option(code)
                widget.locator("h1").click()
                widget.locator(".ptm-header-actions > button").click()
                expect(widget).to_have_attribute("lang", code)
                expect(widget).not_to_have_attribute("aria-busy", "true")
            language("en")
            widget.locator(".ptm-settings summary").click()
            widget.locator(".ptm-details-width").press("Home")
            expect(widget.locator(".ptm-details-width")).to_have_value("30")
            widget.locator("h1").click()
            title = widget.locator('[data-task-id="review"] > .ptm-row .ptm-task-title')
            title.click()
            assert widget.locator(".ptm-workspace").evaluate("n => n.style.getPropertyValue('--ptm-list-width')") == "70%"
            expect(widget.locator('[data-task-id="outline"]')).to_be_visible()
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

            def dismiss_update_notice():
                # A host update toast is unrelated to the plugin demonstration.
                # Dismiss through its own icon button rather than altering pixels.
                notice = page.get_by_text("Update ready", exact=True)
                if notice.count() and notice.first.is_visible():
                    card = notice.first.locator("xpath=ancestor::*[.//button[not(normalize-space())]][1]")
                    close = card.locator("button").filter(has_text=re.compile(r"^\s*$")).first
                    close.click()
                    expect(notice).not_to_be_visible()

            try:
                for theme in ("light", "dark"):
                    mode(theme)
                    dismiss_update_notice()
                    page.mouse.move(0, 0)
                    page.wait_for_timeout(400)  # Let native theme transitions settle.
                    button_style = widget.evaluate("""root => {
                        const primary = root.querySelector('.ptm-add-task'), secondary = root.querySelector('.ptm-toolbar button'), close = root.querySelector('.ptm-close');
                        const probe = document.createElement('span'); probe.style.backgroundColor = 'var(--ptm-accent)'; root.append(probe);
                        const expected = getComputedStyle(probe).backgroundColor; probe.remove();
                        return {primary: getComputedStyle(primary).backgroundColor, expected,
                            radius: getComputedStyle(primary).borderRadius, secondaryRadius: getComputedStyle(secondary).borderRadius,
                            closeRadius: getComputedStyle(close).borderRadius, secondaryBackground: getComputedStyle(secondary).backgroundColor,
                            foreground: getComputedStyle(primary).color};
                    }""")
                    assert button_style["primary"] == button_style["expected"], (surface, theme, "Primary must follow host accent", button_style)
                    assert button_style["radius"] == button_style["secondaryRadius"] == button_style["closeRadius"], (surface, theme, "Mismatched corners", button_style)
                    theme_checks.append({"surface": surface, "theme": theme, **button_style})
                    assert widget.evaluate("n => n.scrollWidth <= n.clientWidth + 1")
                    widget.screenshot(path=str(args.output / f"{surface}-{theme}.png"))
                mode("dark")
                language("ru")
                expect(widget.locator("h1")).to_contain_text("Мои задачи")
                expect(widget.locator(".ptm-editor")).to_be_visible()
                dismiss_update_notice()
                widget.screenshot(path=str(args.output / f"{surface}-ru.png"))
                language("en")
                mode("light")
                page.set_viewport_size(dict(width=390, height=1000))
                if surface == "dashboard":
                    widget.locator(".ptm-close").click()
                expect(widget.locator(".ptm-editor" if surface == "webapp" else ".ptm-list-pane")).to_be_visible()
                assert widget.evaluate("n => n.scrollWidth <= n.clientWidth + 1")
                assert widget.evaluate("n => n.getBoundingClientRect().right <= innerWidth + 1")
                dismiss_update_notice()
                widget.screenshot(path=str(args.output / f"{surface}-mobile.png"))
            finally:
                mode(original)
                context.close()
            print("Captured", surface, "with synthetic GET responses and candidate bundles")
        browser.close()
    expected_names = ("dashboard-light.png", "dashboard-dark.png", "dashboard-mobile.png", "dashboard-ru.png",
                      "webapp-light.png", "webapp-dark.png", "webapp-mobile.png", "webapp-ru.png")
    images = {}
    for name in expected_names:
        path = args.output / name
        if not path.is_file() or path.stat().st_mtime < started - 1:
            raise RuntimeError("Missing fresh capture: " + name)
        png = path.read_bytes()
        width, height = struct.unpack(">II", png[16:24])
        images[name] = {"sha256": hashlib.sha256(png).hexdigest(), "width": width, "height": height,
                        "language": "ru" if "-ru." in name else "en", "viewport_width": 390 if "-mobile." in name else 1280}
    raw_bundles = {name: (ROOT / name).read_bytes()
                   for name in ("dashboard/dist/index.js", "dashboard/dist/style.css", "desktop/plugin.js")}
    bundles = {name: hashlib.sha256(data.replace(b"\r\n", b"\n")).hexdigest() for name, data in raw_bundles.items()}
    record = {"plugin_version": json.loads((ROOT / "package.json").read_text(encoding="utf-8"))["version"],
              "captured_at": datetime.now(timezone.utc).isoformat(), "native_host": True, "details_width_percent": 30,
              "synthetic_data": True, "task_mutations": 0, "privacy_reviewed": False, "theme_checks": theme_checks,
              "bundle_hash_normalization": "LF", "bundles": bundles,
              "captured_bundle_bytes": {name: hashlib.sha256(data).hexdigest() for name, data in raw_bundles.items()},
              "screenshots": images}
    (args.output / "capture.json").write_text(json.dumps(record, indent=2) + "\n", encoding="utf-8")
    print("Captured eight native images. Review them for privacy before marking capture.json privacy_reviewed.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dashboard-url", required=True)
    parser.add_argument("--webapp-url", required=True)
    parser.add_argument("--dashboard-state", type=Path, required=True)
    parser.add_argument("--webapp-state", type=Path, required=True)
    parser.add_argument("--profile", required=True)
    parser.add_argument("--chromium")
    parser.add_argument("--skip-test-onboarding", action="store_true", help="Choose provider later only on a disposable native test host")
    parser.add_argument("--output", type=Path, default=ROOT / "docs/screenshots")
    run(parser.parse_args())
