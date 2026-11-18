"""Real host UI regression. Creates/purges only its own UUID-named test group.

Supply two authenticated Playwright state files (never commit them) and a
disposable profile. Hosts, passwords, and tokens are not embedded in this test.
"""
import argparse
import json
import re
import uuid
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

def check_layout(pages, args):
    from playwright.sync_api import expect
    for surface, page in pages.items():
        page.bring_to_front()
        if surface == "webapp":
            original_mode = page.locator("html").get_attribute("data-hermes-mode")
        else:
            original_mode = None
            original_theme = page.get_by_role("button", name="Switch theme", exact=True).get_attribute("title").split(": ", 1)[1]
        painted = []
        for mode in ("light", "dark"):
            page.set_viewport_size({"width": 1440, "height": 1000})
            if surface == "webapp":
                if page.locator("html").get_attribute("data-hermes-mode") != mode:
                    page.locator(".ptm h1").click()
                    page.keyboard.press("Shift+X")
                    expect(page.locator("html")).to_have_attribute("data-hermes-mode", mode)
            else:
                theme = "Nous Blue" if mode == "light" else "Hermes Teal"
                page.get_by_role("button", name="Switch theme", exact=True).click()
                page.get_by_role("option", name=re.compile("^" + re.escape(theme) + r"\b", re.I)).first.click()
                expect(page.get_by_role("button", name="Switch theme", exact=True)).to_have_attribute("title", "Switch theme: " + theme)
            painted.append(page.locator(".ptm-toolbar input").evaluate("n => getComputedStyle(n).backgroundColor"))
            for width in (1440, 1024, 768, 390, 360):
                page.set_viewport_size({"width": width, "height": 1000 if width >= 768 else 844})
                widget = page.locator(".ptm")
                assert widget.evaluate("n => n.scrollWidth <= n.clientWidth + 1"), (surface, mode, width, "content overflow")
                assert widget.evaluate("n => n.getBoundingClientRect().right <= innerWidth + 1"), (surface, mode, width, "viewport overflow")
                widget.screenshot(path=str(args.artifacts / f"{surface}-{mode}-{width}.png"))
        page.set_viewport_size({"width": 1440, "height": 1000})
        if surface == "webapp" and page.locator("html").get_attribute("data-hermes-mode") != original_mode:
            page.locator(".ptm h1").click()
            page.keyboard.press("Shift+X")
        if surface == "dashboard":
            page.get_by_role("button", name="Switch theme", exact=True).click()
            page.get_by_role("option", name=re.compile("^" + re.escape(original_theme) + r"\b", re.I)).first.click()
        assert painted[0] != painted[1], (surface, "Plugin did not inherit the host's changed theme")
        page.set_viewport_size({"width": 1440, "height": 1000})
    print("PASS browser: desktop/tablet/mobile widths, light/dark host surfaces and no horizontal overflow")


def run(args):
    from playwright.sync_api import sync_playwright, expect
    for url in (args.dashboard_url, args.webapp_url):
        assert parse_qs(urlsplit(url).query).get("profile") == [args.profile], "URLs must explicitly select the disposable profile"
    args.artifacts.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path=args.chromium, args=["--no-sandbox"])
        contexts, pages, errors = [], {}, []
        for surface, url, state_path in [("dashboard", args.dashboard_url, args.dashboard_state), ("webapp", args.webapp_url, args.webapp_state)]:
            saved = json.loads(state_path.read_text())
            context = browser.new_context(storage_state=saved.get("storage", saved), viewport={"width": 1440, "height": 1000}, timezone_id="Europe/Moscow")
            contexts.append(context)
            if saved.get("session"):
                origin = f"{urlsplit(url).scheme}://{urlsplit(url).netloc}"
                context.add_init_script("if (location.origin === " + json.dumps(origin) + ") for (const [k,v] of Object.entries(" + json.dumps(saved["session"]) + ")) sessionStorage.setItem(k,v)")
            page = context.new_page()
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.goto(url, wait_until="domcontentloaded")
            if surface == "webapp":
                page.locator("style[data-ptm=webapp]").wait_for(state="attached", timeout=30000)
                page.evaluate("location.hash='/personal-tasks'")
            expect(page.locator(".ptm")).to_have_attribute("data-loaded", "true", timeout=30000)
            assert args.profile in page.locator(".ptm").get_attribute("data-scope"), "Unexpected profile; refusing test writes"
            page.locator(".ptm-language").select_option("en")
            pages[surface] = page
        dash, web = pages["dashboard"], pages["webapp"]
        if args.layout_only:
            check_layout(pages, args)
            for context in contexts:
                context.close()
            browser.close()
            return

        def group(page, identity):
            return page.locator(f'[data-task-id="{identity}"]')

        def idle(page):
            expect(page.locator(".ptm")).not_to_have_attribute("aria-busy", "true")

        def menu(page, identity, label):
            row = group(page, identity).locator(":scope > .ptm-row")
            row.locator(".ptm-menu > summary").click()
            row.get_by_role("menuitem", name=label, exact=True).click()

        def edit(page, identity):
            if not group(page, identity).locator(":scope > .ptm-editor").count():
                menu(page, identity, "Edit")
            return group(page, identity).locator(":scope > .ptm-editor")

        def tab(page, name):
            page.locator(".ptm-tabs").get_by_role("button", name=name, exact=True).click()

        def confirm(page, accept):
            page.get_by_role("dialog").or_(page.get_by_role("alertdialog")).get_by_role("button", name="Confirm" if accept else "Cancel", exact=True).click()
            idle(page)

        def snapshot():
            return dash.evaluate("window.__HERMES_PLUGIN_SDK__.fetchJSON('/api/plugins/personal-task-manager/tasks')")

        title = "PTM browser " + uuid.uuid4().hex[:8]
        dash.locator(".ptm-add input").fill(title)
        dash.locator(".ptm-add button").click()
        expect(dash.locator(".ptm-title-text").filter(has_text=title)).to_be_visible()
        parent_id = dash.locator(".ptm-group").filter(has=dash.locator(".ptm-title-text").filter(has_text=title)).first.get_attribute("data-task-id")
        for name in ("First step", "Second step"):
            editor = edit(dash, parent_id)
            editor.locator('[data-draft-key="new-subtask"]').fill(name)
            editor.locator(".ptm-subtask-add button").click()
            idle(dash)
        expect(group(dash, parent_id).locator(".ptm-child")).to_have_count(2)
        web.bring_to_front()
        expect(group(web, parent_id)).to_be_visible(timeout=15000)
        group(web, parent_id).locator(":scope > .ptm-row .ptm-task-title").click()
        expect(group(web, parent_id).locator(".ptm-child")).to_have_count(2)
        child_id = group(web, parent_id).locator(".ptm-child").first.get_attribute("data-task-id")
        child_editor = edit(web, child_id)
        child_editor.locator(f'[data-draft-key="{child_id}:title"]').fill("Renamed in WebApp")
        child_editor.locator(f'[data-draft-key="{child_id}:description"]').fill("Shared child description")
        child_editor.locator(".ptm-edit button[type=submit]").click()
        idle(web)
        dash.bring_to_front()
        expect(group(dash, child_id).locator(".ptm-title-text")).to_have_text("Renamed in WebApp", timeout=15000)
        print("PASS browser: native Dashboard/WebApp creation, inline children and bidirectional editing")

        editor = edit(dash, parent_id)
        description = editor.locator('[data-draft-key="description"]')
        description.fill("Unsaved Dashboard text")
        editor.locator('[data-draft-key="new-comment"]').fill("Unsaved note")
        original_revision = next(task for task in snapshot()["tasks"] if task["id"] == parent_id)["revision"]
        menu(web, parent_id, "Mark as important")
        idle(web)
        dash.bring_to_front()
        description.focus()
        expect(editor.locator(".ptm-edit")).to_contain_text("This form has changed", timeout=15000)
        assert description.evaluate("n => n === document.activeElement"), "Background refresh stole focus"
        expect(description).to_have_value("Unsaved Dashboard text")
        expect(editor.locator('[data-draft-key="new-comment"]')).to_have_value("Unsaved note")
        dash.locator(".ptm-language").select_option("ru")
        with dash.expect_request(lambda request: request.method == "PATCH" and "/tasks/" in request.url) as sent:
            editor.locator(".ptm-edit button[type=submit]").click()
        assert sent.value.post_data_json["revision"] == original_revision
        expect(dash.locator(".ptm-message")).to_contain_text("Задача уже изменена")
        expect(description).to_have_value("Unsaved Dashboard text")
        assert next(task for task in snapshot()["tasks"] if task["id"] == parent_id)["description"] == ""
        dash.locator(".ptm-language").select_option("en")
        editor.locator(".ptm-edit").get_by_role("button", name="Discard draft and reload", exact=True).click()
        description.fill("Saved after explicit reload")
        editor.locator(".ptm-edit button[type=submit]").click()
        idle(dash)
        expect(editor.locator('[data-draft-key="new-comment"]')).to_have_value("Unsaved note")
        editor.locator(".ptm-notes").get_by_role("button", name="Discard draft and reload", exact=True).click()
        editor.locator('[data-draft-key="new-comment"]').fill("Confirmed browser result")
        editor.locator(".ptm-notes button[type=submit]").click()
        idle(dash)
        web.bring_to_front()
        web_editor = edit(web, parent_id)
        expect(web_editor.locator('[data-draft-key="description"]')).to_have_value("Saved after explicit reload", timeout=15000)
        expect(web_editor.locator(".ptm-notes")).to_contain_text("Confirmed browser result", timeout=15000)
        print("PASS browser: preserved focus/drafts, Russian stale revision rejection, explicit reload and shared notes")

        group(web, child_id).locator(":scope > .ptm-row .ptm-check").click()
        idle(web)
        group(web, parent_id).locator(":scope > .ptm-row .ptm-check").click()
        idle(web)
        tab(web, "Archive")
        expect(group(web, parent_id)).to_be_visible()
        for checkbox in group(web, parent_id).locator(".ptm-check").all():
            expect(checkbox).to_be_checked()
        dash.bring_to_front()
        expect(group(dash, parent_id)).to_have_count(0, timeout=15000)
        tab(dash, "Archive")
        expect(group(dash, parent_id)).to_be_visible(timeout=15000)
        group(dash, parent_id).locator(":scope > .ptm-row .ptm-check").click()
        idle(dash)
        tab(dash, "Active")
        expect(group(dash, parent_id)).to_be_visible()
        assert all(task["done"] for task in snapshot()["tasks"] if task["parent_id"] == parent_id)
        web.bring_to_front()
        tab(web, "Active")
        expect(group(web, parent_id)).to_be_visible(timeout=15000)
        print("PASS browser: single-click child toggles, atomic parent completion, Archive and reopening")

        menu(dash, parent_id, "Move to Trash")
        confirm(dash, False)
        assert any(task["id"] == parent_id for task in snapshot()["tasks"])
        menu(dash, parent_id, "Move to Trash")
        confirm(dash, True)
        web.bring_to_front()
        expect(group(web, parent_id)).to_have_count(0, timeout=15000)
        web.locator(".ptm-tabs button").filter(has_text="Trash").click()
        expect(group(web, parent_id)).to_be_visible(timeout=15000)
        menu(web, parent_id, "Delete permanently")
        confirm(web, False)
        menu(web, parent_id, "Restore")
        idle(web)
        tab(web, "Active")
        expect(group(web, parent_id)).to_be_visible()
        dash.bring_to_front()
        expect(group(dash, parent_id)).to_be_visible(timeout=15000)
        print("PASS browser: confirmed group Trash, cancelled purge and cross-interface restoration")

        check_layout(pages, args)

        menu(dash, parent_id, "Move to Trash")
        confirm(dash, True)
        dash.locator(".ptm-tabs button").filter(has_text="Trash").click()
        menu(dash, parent_id, "Delete permanently")
        confirm(dash, True)
        assert not any(task["id"] == parent_id or task["parent_id"] == parent_id for task in snapshot()["tasks"] + snapshot()["trash"])
        assert not errors, errors
        print("PASS browser: confirmed permanent deletion of this test group; no uncaught JavaScript errors")
        for context in contexts:
            context.close()
        browser.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dashboard-url", required=True)
    parser.add_argument("--webapp-url", required=True)
    parser.add_argument("--dashboard-state", type=Path, required=True)
    parser.add_argument("--webapp-state", type=Path, required=True)
    parser.add_argument("--profile", required=True)
    parser.add_argument("--chromium")
    parser.add_argument("--layout-only", action="store_true", help="Only check host themes and widths; do not create test tasks")
    parser.add_argument("--artifacts", type=Path, required=True)
    run(parser.parse_args())
