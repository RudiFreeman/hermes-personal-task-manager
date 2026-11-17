import {createController, visibleRoots} from "./state.mjs";
import {translate} from "./i18n.mjs";

export function createTasksView(React, kit = {}) {
  const h = React.createElement;
  const Input = kit.Input || "input", Textarea = kit.Textarea || "textarea";
  // Own the fallback styling explicitly; never inspect host component markup.
  const Button = ({className, ...props}) => h(kit.Button || "button", {...props,
    className: [!kit.Button && "ptm-button", className].filter(Boolean).join(" ") || undefined});
  const act = (label, onClick, props = {}) => h(Button, {type: "button", onClick, ...props}, label);

  function Confirmation({state, controller, t}) {
    const ref = React.useRef(null), previous = React.useRef(null);
    React.useEffect(() => {
      if (!state.confirmation || kit.ConfirmDialog) return;
      previous.current = document.activeElement;
      const node = ref.current;
      if (node?.showModal) node.showModal();
      node?.querySelector("button")?.focus();
      return () => {if (node?.open) node.close(); previous.current?.focus?.();};
    }, [Boolean(state.confirmation)]);
    const current = state.confirmation; if (!current) return null;
    const text = current.action === "empty" ? t("emptyTrashQuestion", {count: current.tasks.length}) :
      t(current.action === "trash" ? "trashQuestion" : "purgeQuestion", {title: current.tasks[0].title});
    if (kit.ConfirmDialog) return h(kit.ConfirmDialog, {open: true, title: t(current.action === "trash" ? "moveTrash" : "purge"),
      description: text, confirmLabel: t("confirm"), cancelLabel: t("cancel"), destructive: true,
      onClose: () => controller.set({confirmation: null}), onConfirm: () => controller.acceptConfirmation()});
    return h("dialog", {ref, className: "ptm-dialog", "aria-labelledby": "ptm-confirm-title", onCancel: event => {
      event.preventDefault(); controller.set({confirmation: null});
    }}, h("h2", {id: "ptm-confirm-title"}, t(current.action === "trash" ? "moveTrash" : "purge")), h("p", {}, text),
    h("div", {className: "ptm-dialog-actions"}, act(t("cancel"), () => controller.set({confirmation: null})),
      act(t("confirm"), () => controller.acceptConfirmation(), {className: "ptm-danger"})));
  }

  function Editor({task, state, controller, t}) {
    const input = (form, field, fallback) => state.drafts.get(`${task.id}:${form}`)?.values[field] ?? fallback;
    const dirty = form => state.drafts.get(`${task.id}:${form}`);
    const warning = form => dirty(form)?.revision !== undefined && dirty(form).revision !== task.revision
      ? h("div", {className: "ptm-stale", role: "status"}, t("staleNotice"),
        act(t("reloadDraft"), () => controller.discard(task.id, form))) : null;
    const submit = form => event => {event.preventDefault(); controller.submit(task, form);};
    const change = (form, field) => event => controller.draft(task.id, form, field, event.target.value);
    const prefix = task.parent_id ? `${task.id}:` : "";
    const date = stamp => new Date(stamp).toLocaleString(t("locale"), {dateStyle: "medium", timeStyle: "short"});
    const notes = state.data.comments.filter(note => note.task_id === task.id);
    const event = state.data.events.filter(item => item.task_id === task.id).at(-1);
    return h("section", {className: "ptm-editor", "aria-label": t("details")},
      h("div", {className: "ptm-editor-header"}, h("strong", {}, t("details")), act(t("close"), () => controller.set({editing: null}))),
      h("form", {className: "ptm-edit", onSubmit: submit("edit")},
        h("label", {}, t("taskTitle"), h(Input, {value: input("edit", "title", task.title), maxLength: 300, required: true,
          "data-draft-key": prefix + "title", "aria-label": t(task.parent_id ? "subtaskTitle" : "taskTitle"), onChange: change("edit", "title")})),
        h("label", {}, t("description"), h(Textarea, {value: input("edit", "description", task.description), rows: 3, maxLength: 20000,
          "data-draft-key": prefix + "description", "aria-label": t(task.parent_id ? "subtaskDescription" : "taskDescription"), onChange: change("edit", "description")})),
        warning("edit"), h(Button, {type: "submit", disabled: state.pending || !dirty("edit")}, t("save"))),
      !task.parent_id && !task.done && h("form", {className: "ptm-subtask-add", onSubmit: submit("child")},
        h(Input, {value: input("child", "title", ""), "data-draft-key": "new-subtask", placeholder: t("addStep"),
          "aria-label": t("newSubtask"), required: true, maxLength: 300, onChange: change("child", "title")}),
        h(Button, {type: "submit", disabled: state.pending}, t("addSubtask"))),
      h("section", {className: "ptm-notes"}, h("h3", {}, t("notes")),
        ...notes.map(note => h("article", {className: "ptm-note", key: note.id},
          h("small", {}, `${note.actor === "hermes" ? "Hermes" : t("you")} · ${date(note.created_at)}`), h("p", {}, note.body))),
        h("form", {onSubmit: submit("note")}, h(Textarea, {value: input("note", "comment", ""), "data-draft-key": "new-comment",
          "aria-label": t("newComment"), placeholder: t("notePlaceholder"), rows: 2, maxLength: 10000, required: true,
          onChange: change("note", "comment")}), warning("note"),
        h(Button, {type: "submit", disabled: state.pending || !dirty("note")}, t("addNote")))),
      task.completed_at && h("small", {}, t("completedAt", {date: date(task.completed_at)})),
      event && h("small", {className: "ptm-muted"}, t("lastChanged", {actor: event.actor === "hermes" ? "Hermes" : t("you"), date: date(event.created_at)})));
  }

  function TaskRow({task, children, state, controller, t, child = false}) {
    const trashed = Boolean(task.trashed_at), expanded = state.expanded.has(task.id) || Boolean(state.query);
    const parent = [...state.data.tasks, ...state.data.trash].find(item => item.id === task.parent_id);
    const locked = !trashed && Boolean(parent?.done);
    const closeMenu = event => event.currentTarget.closest("details")?.removeAttribute("open");
    function menuAction(label, action, props = {}) {
      return act(label, event => {closeMenu(event); action();}, {role: "menuitem", ...props});
    }
    return h("div", {className: `ptm-group${child ? " ptm-child" : ""}`, "data-task-id": task.id},
      h("div", {className: `ptm-row${task.done ? " is-done" : ""}`},
        !trashed && h("label", {className: "ptm-check-hit", title: locked ? t("reopenParent") : !child ? t("cascadeHint") : undefined},
          h("input", {type: "checkbox", className: "ptm-check", checked: task.done, disabled: state.pending || locked,
            "aria-label": t(task.done ? "reopenLabel" : "completeLabel") + task.title, onChange: () => controller.toggle(task)})),
        h("button", {type: "button", className: "ptm-task-title", "aria-expanded": !child ? expanded : undefined,
          onClick: () => !child ? controller.expand(task.id) : controller.set({editing: state.editing === task.id ? null : task.id})},
        children.length ? h("span", {className: "ptm-chevron", "aria-hidden": true}, expanded ? "▾" : "▸") : null,
        h("span", {className: "ptm-title-text"}, task.title)),
        task.starred && h("span", {className: "ptm-important", title: t("star"), "aria-label": t("star")}, "★"),
        children.length ? h("small", {className: "ptm-step-count", "aria-label": t("stepsProgress", {done: children.filter(c => c.done).length, total: children.length})},
          `${children.filter(c => c.done).length}/${children.length}`) : null,
        h("details", {className: "ptm-menu", onKeyDown: event => {if (event.key === "Escape") {event.currentTarget.removeAttribute("open"); event.currentTarget.querySelector("summary").focus();}}},
          h("summary", {"aria-label": t("menu") + ": " + task.title}, "⋯"),
          h("div", {role: "menu", className: "ptm-menu-items"},
            !trashed && menuAction(t("edit"), () => controller.set({editing: state.editing === task.id ? null : task.id})),
            !trashed && menuAction(t(task.starred ? "unstar" : "star"), () => controller.star(task), {disabled: state.pending}),
            !trashed && menuAction(t("moveTrash"), () => controller.confirm("trash", task), {disabled: state.pending}),
            trashed && menuAction(t("restore"), () => controller.restore(task), {disabled: state.pending || Boolean(parent?.trashed_at), title: parent?.trashed_at ? t("restoreParent") : undefined}),
            trashed && menuAction(t("purge"), () => controller.confirm("purge", task), {className: "ptm-danger", disabled: state.pending})))),
      state.editing === task.id && !trashed && h(Editor, {task, state, controller, t}),
      expanded && !child && h("div", {className: "ptm-children"},
        children.map(item => h(TaskRow, {key: item.id, task: item, children: [], state, controller, t, child: true})),
        !trashed && !task.done && act(t("addSubtask"), () => controller.set({editing: task.id}), {className: "ptm-add-child"})));
  }

  return function TasksView({transport, scope = "default", surface = "dashboard", schedule, controller: supplied}) {
    const controllers = React.useRef(new Map());
    const transportRef = React.useRef(transport); transportRef.current = transport;
    if (!controllers.current.has(scope)) controllers.current.set(scope, supplied || createController({scope, transport: (...args) => transportRef.current(...args)}));
    const controller = controllers.current.get(scope);
    const state = React.useSyncExternalStore(controller.subscribe, controller.getSnapshot);
    const t = (name, values) => translate(state.language, name, values);
    React.useEffect(() => {
      controller.refresh();
      const poll = () => {if (!document.hidden) controller.refresh();};
      const stop = schedule ? schedule(poll, 3000) : (() => {const id = setInterval(poll, 3000); return () => clearInterval(id);})();
      window.addEventListener("focus", poll);
      const closeMenus = event => {for (const menu of document.querySelectorAll(".ptm-menu[open]")) if (!menu.contains(event.target)) menu.removeAttribute("open");};
      document.addEventListener("pointerdown", closeMenus);
      return () => {stop(); window.removeEventListener("focus", poll); document.removeEventListener("pointerdown", closeMenus); controller.pause();};
    }, [controller]);
    const mounted = React.useRef(false);
    React.useEffect(() => {
      mounted.current = true;
      return () => {mounted.current = false; queueMicrotask(() => {if (!mounted.current) for (const c of controllers.current.values()) c.dispose();});};
    }, []);
    const roots = visibleRoots(state);
    const items = state.view === "trash" ? state.data.trash : state.data.tasks;
    const trashRoots = state.data.trash.filter(task => !state.data.trash.some(parent => parent.id === task.parent_id));
    return h("section", {className: "ptm", "data-surface": surface, "data-scope": scope, "data-loaded": String(state.loaded), lang: state.language, "aria-busy": state.pending ? "true" : undefined},
      h("header", {className: "ptm-header"}, h("h1", {}, t("heading"), h("span", {className: "ptm-count"}, state.data.progress.total)),
        h("div", {className: "ptm-header-actions"}, h("select", {className: "ptm-language", value: state.language, "aria-label": t("language"), onChange: event => controller.language(event.target.value)},
          h("option", {value: "en"}, "English"), h("option", {value: "ru"}, "Русский")), act(t("refresh"), () => controller.refresh(), {disabled: state.pending}))),
      h("div", {className: "ptm-progress"}, h("span", {className: "ptm-stats"}, t("progress", state.data.progress)),
        h("progress", {max: 100, value: state.data.progress.percent, "aria-label": t("overallProgress")})),
      h("nav", {className: "ptm-tabs", "aria-label": t("filters")}, ["active", "archive", "trash"].map(view =>
        act(view === "trash" ? t("trashCount", {count: trashRoots.length}) : t(view), () => controller.set({view, editing: null}), {key: view, "aria-pressed": state.view === view}))),
      h("div", {className: "ptm-toolbar"}, h(Input, {type: "search", value: state.query, placeholder: t("search"), "aria-label": t("search"),
        onChange: event => controller.set({query: event.target.value})}), act(t("starred"), () => controller.set({starred: !state.starred}), {"aria-pressed": state.starred}),
        state.view === "trash" && trashRoots.length > 0 && act(t("emptyTrash"), () => controller.confirm("empty"), {className: "ptm-danger", disabled: state.pending})),
      state.view === "active" && h("form", {className: "ptm-add", onSubmit: event => {event.preventDefault(); controller.add();}},
        h(Input, {value: state.newTitle, placeholder: t("taskPlaceholder"), "aria-label": t("newTask"), maxLength: 300, required: true,
          onChange: event => controller.set({newTitle: event.target.value})}), h(Button, {type: "submit", disabled: state.pending}, t("add"))),
      h("div", {className: "ptm-message", role: "status", "aria-live": "polite"}, state.error || (state.pending ? t("syncing") : "")),
      h("div", {className: "ptm-list"}, roots.length ? roots.map(task => h(TaskRow, {key: task.id, task, state, controller, t, children: items.filter(child => child.parent_id === task.id)})) :
        h("p", {className: "ptm-empty"}, t(state.query || state.starred ? "noResults" : state.view === "trash" ? "emptyTrashHint" : state.view === "archive" ? "archiveHint" : "noTasks"))),
      h(Confirmation, {state, controller, t}));
  };
}
