import {createController, visibleRoots} from "./state.mjs";
import {translate, supportedLanguages, formatNumber, formatDateTime} from "./i18n.mjs";

const formValidation = t => ({
  onInvalid: event => event.target.setCustomValidity?.(t(event.target.validity?.valueMissing ? "requiredField" : "errorInvalidData")),
  onInputCapture: event => event.target.setCustomValidity?.("")
});

export function createTasksView(React, kit = {}) {
  const h = React.createElement;
  const Input = kit.Input || "input", Textarea = kit.Textarea || "textarea";
  // All host adapters share control styles; never inspect host component markup.
  const Button = ({className, ...props}) => h(kit.Button || "button", {...props,
    className: ["ptm-control", !kit.Button && "ptm-button", className].filter(Boolean).join(" ") || undefined});
  const act = (label, onClick, props = {}) => h(Button, {type: "button", onClick, ...props}, label);
  const icon = (name, glyph) => h("span", {className: `ptm-icon ptm-icon-${name}`, "aria-hidden": true}, glyph);
  const withIcon = (name, label) => h("span", {className: "ptm-icon-label"}, icon(name, name === "plus" ? "+" : undefined), label);

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
    const panel = React.useRef(null);
    React.useEffect(() => {panel.current?.focus();}, [task.id]);
    const close = () => {
      const widget = panel.current?.closest(".ptm");
      controller.set({editing: null});
      queueMicrotask(() => [...(widget?.querySelectorAll("[data-task-id]") || [])]
        .find(row => row.dataset.taskId === task.id)?.querySelector(".ptm-task-title")?.focus());
    };
    const input = (form, field, fallback) => state.drafts.get(`${task.id}:${form}`)?.values[field] ?? fallback;
    const dirty = form => state.drafts.get(`${task.id}:${form}`);
    const warning = form => dirty(form)?.revision !== undefined && dirty(form).revision !== task.revision
      ? h("div", {className: "ptm-stale", role: "status"}, t("staleNotice"),
        act(t("reloadDraft"), () => controller.discard(task.id, form))) : null;
    const submit = form => event => {event.preventDefault(); controller.submit(task, form);};
    const change = (form, field) => event => controller.draft(task.id, form, field, event.target.value);
    const prefix = task.parent_id ? `${task.id}:` : "";
    const date = stamp => formatDateTime(state.language, stamp);
    const notes = state.data.comments.filter(note => note.task_id === task.id);
    const event = state.data.events.filter(item => item.task_id === task.id).at(-1);
    return h("section", {ref: panel, className: "ptm-editor", tabIndex: -1, "aria-label": t("details"),
      onKeyDown: event => {if (event.key === "Escape") {event.stopPropagation(); close();}}},
      h("div", {className: "ptm-editor-header"}, h("strong", {}, t("details")),
        act(icon("close"), close, {className: "ptm-close", "aria-label": t("close"), title: t("close")})),
      h("form", {...formValidation(t), className: "ptm-edit", onSubmit: submit("edit")},
        h("label", {}, t(task.parent_id ? "subtaskTitle" : "taskTitle"), h(Textarea, {rows: 2, className: "ptm-title-input", value: input("edit", "title", task.title), maxLength: 300, required: true,
          "data-draft-key": prefix + "title", "aria-label": t(task.parent_id ? "subtaskTitle" : "taskTitle"), onChange: change("edit", "title")})),
        h("label", {}, t("description"), h(Textarea, {value: input("edit", "description", task.description), rows: 6, maxLength: 20000,
          "data-draft-key": prefix + "description", "aria-label": t(task.parent_id ? "subtaskDescription" : "taskDescription"), onChange: change("edit", "description")})),
        warning("edit"), h(Button, {type: "submit", className: "ptm-primary", disabled: state.pending || !dirty("edit")}, t("save"))),
      !task.parent_id && !task.done && h("form", {...formValidation(t), className: "ptm-subtask-add", onSubmit: submit("child")},
        h(Input, {value: input("child", "title", ""), "data-draft-key": "new-subtask", placeholder: t("addStep"),
          "aria-label": t("newSubtask"), required: true, maxLength: 300, onChange: change("child", "title")}),
        h(Button, {type: "submit", className: "ptm-primary", disabled: state.pending}, withIcon("plus", t("addSubtask")))),
      h("section", {className: "ptm-notes"}, h("h3", {}, t("notes")),
        ...notes.map(note => h("article", {className: "ptm-note", key: note.id},
          h("small", {}, `${note.actor === "hermes" ? "Hermes" : t("you")} · ${date(note.created_at)}`), h("p", {}, note.body))),
        h("form", {...formValidation(t), onSubmit: submit("note")}, h(Textarea, {value: input("note", "comment", ""), "data-draft-key": "new-comment",
          "aria-label": t("newComment"), placeholder: t("notePlaceholder"), rows: 2, maxLength: 10000, required: true,
          onChange: change("note", "comment")}), warning("note"),
        h(Button, {type: "submit", className: "ptm-primary", disabled: state.pending || !dirty("note")}, t("addNote")))),
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
      h("div", {className: `ptm-row${task.done ? " is-done" : ""}${state.editing === task.id && !trashed ? " is-selected" : ""}`},
        !trashed && h("label", {className: "ptm-check-hit", title: locked ? t("reopenParent") : !child ? t("cascadeHint") : undefined},
          h("input", {type: "checkbox", className: "ptm-check", checked: task.done, disabled: state.pending || locked,
            "aria-label": t(task.done ? "reopenLabel" : "completeLabel") + task.title, onChange: () => controller.toggle(task)})),
        !child && h("button", {type: "button", className: "ptm-expand", "aria-expanded": expanded,
          "aria-label": t(expanded ? "collapseTask" : "expandTask", {title: task.title}),
          onClick: () => controller.expand(task.id)}, icon("chevron")),
        h("button", {type: "button", className: "ptm-task-title", title: task.title,
          "aria-current": state.editing === task.id && !trashed ? "true" : undefined,
          onClick: () => {
            if (trashed) {if (!child) controller.expand(task.id); return;}
            if (!child && !expanded) controller.expand(task.id);
            controller.set({editing: task.id});
          }},
        h("span", {className: "ptm-title-text"}, task.title)),
        !trashed && h("button", {type: "button", className: "ptm-star-toggle",
          title: t(task.starred ? "unstar" : "star"), "aria-label": t("star"), "aria-pressed": task.starred,
          disabled: state.pending, onClick: () => controller.star(task)}, task.starred ? "★" : "☆"),
        children.length ? h("small", {className: "ptm-step-count", "aria-label": t("stepsProgress", {done: children.filter(c => c.done).length, total: children.length})},
          `${formatNumber(state.language, children.filter(c => c.done).length)}/${formatNumber(state.language, children.length)}`) : null,
        h("details", {className: "ptm-menu", onKeyDown: event => {if (event.key === "Escape") {event.currentTarget.removeAttribute("open"); event.currentTarget.querySelector("summary").focus();}}},
          h("summary", {"aria-label": t("menu") + ": " + task.title}, "⋯"),
          h("div", {role: "menu", className: "ptm-menu-items"},
            !trashed && menuAction(t("edit"), () => controller.set({editing: task.id})),
            !trashed && menuAction(t(task.starred ? "unstar" : "star"), () => controller.star(task), {disabled: state.pending}),
            !trashed && menuAction(withIcon("trash", t("moveTrash")), () => controller.confirm("trash", task), {disabled: state.pending}),
            trashed && menuAction(t("restore"), () => controller.restore(task), {disabled: state.pending || Boolean(parent?.trashed_at), title: parent?.trashed_at ? t("restoreParent") : undefined}),
            trashed && menuAction(withIcon("trash", t("purge")), () => controller.confirm("purge", task), {className: "ptm-danger", disabled: state.pending})))),
      expanded && !child && h("div", {className: "ptm-children"},
        children.map(item => h(TaskRow, {key: item.id, task: item, children: [], state, controller, t, child: true})),
        !trashed && !task.done && act(withIcon("plus", t("addSubtask")), () => controller.set({editing: task.id}), {className: "ptm-add-child"})));
  }

  return function TasksView({transport, scope = "default", preferenceScope = scope, surface = "dashboard", schedule, controller: supplied, hermesLanguage}) {
    const controllers = React.useRef(new Map());
    const transportRef = React.useRef(transport); transportRef.current = transport;
    if (!controllers.current.has(scope)) controllers.current.set(scope, supplied || createController({scope: preferenceScope, hermesLanguage, transport: (...args) => transportRef.current(...args)}));
    const controller = controllers.current.get(scope);
    const state = React.useSyncExternalStore(controller.subscribe, controller.getSnapshot);
    const t = (name, values) => translate(state.language, name, values);
    React.useEffect(() => {
      if (surface === "preview") {document.title = translate(state.language, "heading"); document.documentElement.lang = state.language;}
    }, [surface, state.language]);
    React.useEffect(() => {controller.syncLanguagePreference();}, [controller]);
    React.useEffect(() => {
      const update = () => controller.inheritLanguage(hermesLanguage);
      const sync = event => {if (event.key === "ptm.language" || event.key === null) controller.syncLanguagePreference();};
      update();
      window.addEventListener("languagechange", update);
      window.addEventListener("storage", sync);
      return () => {window.removeEventListener("languagechange", update); window.removeEventListener("storage", sync);};
    }, [controller, hermesLanguage]);
    React.useEffect(() => {
      controller.refresh();
      const poll = () => {if (!document.hidden) controller.refresh();};
      const stop = schedule ? schedule(poll, 3000) : (() => {const id = setInterval(poll, 3000); return () => clearInterval(id);})();
      window.addEventListener("focus", poll);
      const closeMenus = event => {for (const menu of document.querySelectorAll(".ptm-menu[open], .ptm-settings[open]")) if (!menu.contains(event.target)) menu.removeAttribute("open");};
      document.addEventListener("pointerdown", closeMenus);
      return () => {stop(); window.removeEventListener("focus", poll); document.removeEventListener("pointerdown", closeMenus); controller.pause();};
    }, [controller]);
    const mounted = React.useRef(false);
    React.useEffect(() => {
      mounted.current = true;
      return () => {mounted.current = false; queueMicrotask(() => {if (!mounted.current) for (const c of controllers.current.values()) c.dispose();});};
    }, []);
    const [split, setSplit] = React.useState(100 - state.detailsWidth);
    const [addingAtEnd, setAddingAtEnd] = React.useState(false);
    const bottomForm = React.useRef(null);
    React.useEffect(() => {setAddingAtEnd(false);}, [controller, state.view]);
    React.useEffect(() => {if (addingAtEnd) bottomForm.current?.querySelector("input")?.focus();}, [addingAtEnd]);
    const workspace = React.useRef(null);
    const resize = event => {
      if (!event.currentTarget.hasPointerCapture?.(event.pointerId)) return;
      const box = workspace.current.getBoundingClientRect();
      setSplit(Math.max(30, Math.min(70, (event.clientX - box.left) / box.width * 100)));
    };
    const cancelBottomAdd = () => {
      setAddingAtEnd(false);
      queueMicrotask(() => workspace.current?.querySelector(".ptm-add-root")?.focus());
    };
    const roots = visibleRoots(state);
    const items = state.view === "trash" ? state.data.trash : state.data.tasks;
    const selected = state.view !== "trash" && items.find(task => task.id === state.editing && !task.trashed_at &&
      roots.some(root => root.id === task.id || root.id === task.parent_id));
    React.useEffect(() => {if (state.editing && !selected && !state.pending) controller.set({editing: null});}, [controller, state.editing, selected?.id, state.pending]);
    React.useEffect(() => {setSplit(100 - state.detailsWidth);}, [controller, state.detailsWidth, Boolean(selected)]);
    const trashRoots = state.data.trash.filter(task => !state.data.trash.some(parent => parent.id === task.parent_id));
    return h("section", {className: "ptm", "data-surface": surface, "data-scope": scope, "data-loaded": String(state.loaded), lang: state.language, "aria-busy": state.pending ? "true" : undefined},
      h("header", {className: "ptm-header"}, h("h1", {}, t("heading"), h("span", {className: "ptm-count"}, formatNumber(state.language, state.data.progress.total))),
        h("div", {className: "ptm-header-actions"},
          h("details", {className: "ptm-settings"},
            h("summary", {"aria-label": t("settings"), title: t("settings")}, icon("settings", "⚙")),
            h("div", {className: "ptm-settings-panel"}, h("strong", {}, t("settings")),
              h("label", {}, t("language"), h("select", {className: "ptm-language", value: state.languagePreference,
                "aria-label": t("language"), onChange: event => controller.language(event.target.value)},
                h("option", {value: "auto"}, t("autoLanguage")),
                supportedLanguages.map(({code, name}) => h("option", {key: code, value: code, lang: code}, name)))),
              h("small", {className: "ptm-muted"}, t(`languageSource${state.languageSource}`)),
              h("small", {className: "ptm-muted"}, t("languageHelp")),
              h("label", {}, h("span", {className: "ptm-width-label"}, t("detailsWidth"),
                h("output", {}, new Intl.NumberFormat(state.language, {style: "percent"}).format(state.detailsWidth / 100))),
                h("input", {type: "range", className: "ptm-details-width", min: 30, max: 70, step: 5, value: state.detailsWidth,
                  "aria-label": t("detailsWidth"), onChange: event => controller.detailsWidth(event.target.value)})),
              h("small", {className: "ptm-muted"}, t("detailsWidthHelp")))),
          act(t("refresh"), () => controller.refresh(), {disabled: state.pending}))),
      h("div", {className: "ptm-progress"}, h("span", {className: "ptm-stats"}, t("progress", state.data.progress)),
        h("progress", {max: 100, value: state.data.progress.percent, "aria-label": t("overallProgress")})),
      h("nav", {className: "ptm-tabs", "aria-label": t("filters")}, ["active", "archive", "trash"].map(view =>
        act(view === "trash" ? withIcon("trash", t("trashCount", {count: trashRoots.length})) : t(view), () => controller.set({view, editing: null}), {key: view, "aria-pressed": state.view === view}))),
      h("div", {ref: workspace, className: `ptm-workspace${selected ? " has-details" : ""}`, style: {"--ptm-list-width": `${split}%`}},
      h("div", {className: "ptm-list-pane"},
      h("div", {className: "ptm-toolbar"}, h("div", {className: "ptm-search"}, icon("search"),
        h(Input, {type: "search", value: state.query, placeholder: t("search"), "aria-label": t("search"),
          onChange: event => controller.set({query: event.target.value})})), act(t("starred"), () => controller.set({starred: !state.starred}), {"aria-pressed": state.starred}),
        state.view === "trash" && trashRoots.length > 0 && act(withIcon("trash", t("emptyTrash")), () => controller.confirm("empty"), {className: "ptm-danger", disabled: state.pending})),
      state.view === "active" && h("form", {...formValidation(t), className: "ptm-add", onSubmit: event => {event.preventDefault(); controller.add();}},
        h(Input, {value: state.newTitle, placeholder: t("taskPlaceholder"), "aria-label": t("newTask"), maxLength: 300, required: true,
          onChange: event => controller.set({newTitle: event.target.value})}), h(Button, {type: "submit", className: "ptm-add-task ptm-primary", disabled: state.pending}, withIcon("plus", t("add")))),
      h("div", {className: "ptm-message", role: "status", "aria-live": "polite"}, state.error || (state.pending ? t("syncing") : "")),
      h("div", {className: "ptm-list"}, roots.length ? roots.map(task => h(TaskRow, {key: task.id, task, state, controller, t, children: items.filter(child => child.parent_id === task.id)})) :
        h("p", {className: "ptm-empty"}, t(state.query || state.starred ? "noResults" : state.view === "trash" ? "emptyTrashHint" : state.view === "archive" ? "archiveHint" : "noTasks")),
        state.view === "active" && (addingAtEnd ? h("form", {...formValidation(t), ref: bottomForm, className: "ptm-add-bottom",
          onKeyDown: event => {if (event.key === "Escape") {event.preventDefault(); cancelBottomAdd();}},
          onSubmit: async event => {event.preventDefault(); if (await controller.add()) setAddingAtEnd(false);}},
          h(Input, {value: state.newTitle, placeholder: t("taskPlaceholder"), "aria-label": t("newTask"), maxLength: 300, required: true,
            onChange: event => controller.set({newTitle: event.target.value})}),
          h("div", {className: "ptm-add-bottom-actions"},
            h(Button, {type: "submit", className: "ptm-add-task ptm-primary", disabled: state.pending}, withIcon("plus", t("add"))),
            act(t("cancel"), cancelBottomAdd))) :
          act(withIcon("plus", t("addTask")), () => setAddingAtEnd(true), {className: "ptm-add-root", disabled: state.pending}))),
      ),
      selected && h("div", {className: "ptm-divider", role: "separator", tabIndex: 0,
        "aria-label": t("resizePanels"), "aria-orientation": "vertical", "aria-valuemin": 30, "aria-valuemax": 70, "aria-valuenow": Math.round(split),
        onPointerDown: event => {if (event.button === 0) {event.preventDefault(); event.currentTarget.focus(); event.currentTarget.setPointerCapture(event.pointerId);}},
        onPointerMove: resize, onPointerUp: event => {if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);},
        onDoubleClick: () => setSplit(100 - state.detailsWidth),
        onKeyDown: event => {
          const next = {ArrowLeft: split - 5, ArrowRight: split + 5, Home: 30, End: 70}[event.key];
          if (next !== undefined) {event.preventDefault(); setSplit(Math.max(30, Math.min(70, next)));}
        }}),
      selected && h(Editor, {key: `${scope}:${selected.id}`, task: selected, state, controller, t})),
      h(Confirmation, {state, controller, t}));
  };
}
