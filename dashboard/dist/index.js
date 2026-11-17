(function () {
  "use strict";
  const API = "/api/plugins/personal-task-manager/tasks";
  const LANGUAGE_KEY = "ptm.language";
  const translations = {
    en: {
      locale: "en-US", language: "Language", workspace: "PERSONAL SPACE", heading: "My Tasks",
      subtitle: "Write it down. Break it into steps. Check it off.", details: "Task details",
      overallProgress: "Overall progress", newTask: "New task", taskPlaceholder: "What needs to be done?",
      search: "Search tasks", filters: "Task filters", all: "All tasks", starred: "Important",
      add: "Add", refresh: "Refresh", saveError: "Unable to save changes. Please try again.",
      requestError: "Unable to complete the request. Please try again.",
      staleDraft: "This item has changed. Your draft is preserved; reload it before retrying.",
      reloadDraft: "Discard draft and reload",
      reopenLabel: "Reopen: ", completeLabel: "Complete: ", progress: "{done} of {total} completed",
      noResults: "No tasks found", allDone: "All done", start: "Start with one task",
      searchHint: "Try another search or view all tasks.", doneHint: "Take a breath. Add your next plans when you're ready.",
      startHint: "Add a task above, then break it into small steps.", completed: "Completed",
      stepsProgress: "{done} of {total} steps", unstar: "Remove from important", star: "Mark as important",
      detailHint: "Every task has a next step", selectHint: "Select a task to add a description, subtasks, and notes.",
      taskTitle: "Task title", descriptionPlaceholder: "Description, links, or expected result…",
      taskDescription: "Task description", task: "Task", description: "Description", save: "Save",
      subtasks: "Subtasks", subtaskTitle: "Subtask title", subtaskDescription: "Subtask description",
      stepPlaceholder: "Describe this step…", saveStep: "Save step", you: "You", addStep: "Add a step…",
      newSubtask: "New subtask", addSubtask: "Add subtask", notes: "Notes and results",
      notesHint: "Keep track of what you have done and where you left off.",
      notePlaceholder: "What did you accomplish?", newComment: "New comment", addNote: "Add note",
      completedHeading: "COMPLETED", detailsHeading: "DETAILS", close: "Close",
      reopen: "Reopen task", complete: "Mark as completed", lastChanged: "Last updated: {actor} · {date}"
    },
    ru: {
      locale: "ru-RU", language: "Язык", workspace: "ЛИЧНОЕ ПРОСТРАНСТВО", heading: "Мои задачи",
      subtitle: "Запишите. Разбейте на шаги. Отметьте сделанное.", details: "Подробности задачи",
      overallProgress: "Общий прогресс", newTask: "Новая задача", taskPlaceholder: "Что нужно сделать?",
      search: "Поиск задач", filters: "Фильтр задач", all: "Все задачи", starred: "Важные",
      add: "Добавить", refresh: "Обновить", saveError: "Не удалось сохранить изменения. Повторите попытку.",
      requestError: "Не удалось выполнить запрос. Повторите попытку.",
      staleDraft: "Этот пункт изменён. Черновик сохранён; загрузите актуальную версию перед повторной попыткой.",
      reloadDraft: "Удалить черновик и загрузить заново",
      reopenLabel: "Вернуть в активные: ", completeLabel: "Выполнено: ", progress: "{done} из {total} выполнено",
      noResults: "Ничего не найдено", allDone: "Всё сделано", start: "Начните с одной задачи",
      searchHint: "Попробуйте другой поиск или откройте все задачи.", doneHint: "Можно выдохнуть. Новые планы — когда будете готовы.",
      startHint: "Добавьте задачу выше, а затем разбейте её на небольшие шаги.", completed: "Выполненные",
      stepsProgress: "{done} из {total} шагов", unstar: "Убрать из важных", star: "Отметить важной",
      detailHint: "У каждой задачи — свой следующий шаг", selectHint: "Выберите задачу, чтобы добавить описание, подзадачи и заметки.",
      taskTitle: "Название задачи", descriptionPlaceholder: "Описание, ссылки или ожидаемый результат…",
      taskDescription: "Описание задачи", task: "Задача", description: "Описание", save: "Сохранить",
      subtasks: "Подзадачи", subtaskTitle: "Название подзадачи", subtaskDescription: "Описание подзадачи",
      stepPlaceholder: "Описание шага…", saveStep: "Сохранить шаг", you: "Вы", addStep: "Добавить шаг…",
      newSubtask: "Новая подзадача", addSubtask: "Добавить подзадачу", notes: "Заметки и результаты",
      notesHint: "Здесь можно сохранить, что сделано и на чём остановились.",
      notePlaceholder: "Что удалось сделать?", newComment: "Новый комментарий", addNote: "Добавить заметку",
      completedHeading: "ВЫПОЛНЕНО", detailsHeading: "ПОДРОБНОСТИ", close: "Закрыть",
      reopen: "Вернуть в активные", complete: "Отметить выполненной", lastChanged: "Последнее изменение: {actor} · {date}"
    }
  };
  function savedLanguage() {
    try {
      const saved = localStorage.getItem(LANGUAGE_KEY);
      return Object.hasOwn(translations, saved) ? saved : "en";
    }
    catch (_) { return "en"; }
  }
  function translate(language, key, values = {}) {
    const catalog = Object.hasOwn(translations, language) ? translations[language] : translations.en;
    return (catalog[key] || translations.en[key] || key)
      .replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? `{${name}}`));
  }
  const el = (tag, attrs, ...children) => {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs || {})) {
      if (key.startsWith("on")) node.addEventListener(key.slice(2).toLowerCase(), value);
      else if (key === "className") node.className = value;
      else if (value !== undefined && value !== null) node.setAttribute(key, value);
    }
    for (const child of children.flat()) {
      if (child !== null && child !== undefined) node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    }
    return node;
  };
  const button = (label, action, className = "ptm-button") => el("button", {type: "button", className, onclick: action}, label);

  function mount(root, transport) {
    let language = savedLanguage();
    const t = (key, values = {}) => translate(language, key, values);
    const date = (stamp) => new Date(stamp).toLocaleString(t("locale"), {dateStyle: "medium", timeStyle: "short"});
    const request = (url, options = {}) => transport(url, {...options, headers: {...options.headers, "Accept-Language": language}});
    let data = {tasks: [], comments: [], events: [], progress: {total: 0, done: 0, percent: 0}};
    let selected = null, filter = "all", query = "", showDone = false, pending = false, disposed = false;
    // Drafts belong to a form and retain the revision of their first edit.
    const drafts = new Map(), expanded = new Map();
    let refreshSequence = 0, mutationGeneration = 0;
    function bindDraft(key, task, fields, initial) {
      const draft = drafts.get(key);
      for (const [name, field] of Object.entries(fields)) {
        field.value = draft?.values[name] ?? initial[name];
        field.addEventListener("input", () => {
          const previous = drafts.get(key);
          const values = {...previous?.values, [name]: field.value};
          if (field.value === initial[name] && (!previous || previous.revision === task.revision)) delete values[name];
          if (Object.keys(values).length) drafts.set(key, {revision: previous?.revision ?? task.revision, values});
          else drafts.delete(key);
        });
      }
      return async action => {
        const submitted = drafts.get(key);
        await action(submitted?.revision ?? task.revision, submitted?.values ?? initial);
        // Typing during the request creates a different draft; do not erase it.
        if (drafts.get(key) === submitted) drafts.delete(key);
      };
    }
    function draftWarning(key, task) {
      const draft = drafts.get(key);
      return draft && draft.revision !== task.revision ? el("p", {className: "ptm-muted", role: "status"},
        t("staleDraft"), " ", button(t("reloadDraft"), () => {drafts.delete(key); renderDetail();})) : null;
    }
    root.classList.add("ptm");
    const message = el("div", {className: "ptm-message", role: "status", "aria-live": "polite"});
    const list = el("div", {className: "ptm-list"});
    const detail = el("aside", {className: "ptm-detail", "aria-label": t("details")});
    const total = el("span", {className: "ptm-count"}, "0");
    const stats = el("div", {className: "ptm-stats"});
    const progress = el("progress", {max: "100", value: "0", "aria-label": t("overallProgress")});
    const input = el("input", {placeholder: t("taskPlaceholder"), "aria-label": t("newTask"), maxlength: "300", required: "", autocomplete: "off"});
    const search = el("input", {type: "search", placeholder: t("search"), "aria-label": t("search"), oninput: (event) => {query = event.target.value.toLocaleLowerCase(); renderList();}});
    const tabs = el("nav", {className: "ptm-tabs", "aria-label": t("filters")});
    const tabButtons = [];
    for (const key of ["all", "starred"]) {
      const tab = button(t(key), () => {filter = key; renderList();}, "ptm-tab");
      tab.dataset.filter = key;
      tabs.append(tab);
      tabButtons.push(tab);
    }
    const addButton = el("button", {type: "submit", className: "ptm-button ptm-primary"}, t("add"));
    const form = el("form", {className: "ptm-add", onsubmit: async (event) => {
      event.preventDefault();
      const title = input.value.trim();
      if (!title || pending) return;
      await mutate(async () => {
        const task = await request(API, {method: "POST", body: JSON.stringify({title})});
        input.value = ""; selected = task.id;
      });
    }}, el("span", {className: "ptm-plus", "aria-hidden": "true"}, "+"), input,
    addButton);
    const refreshButton = button(t("refresh"), () => refresh().catch(report));
    const eyebrow = el("div", {className: "ptm-eyebrow"}, t("workspace"));
    const heading = el("span", {}, t("heading") + " ");
    const subtitle = el("p", {className: "ptm-muted"}, t("subtitle"));
    const languageSelect = el("select", {className: "ptm-language", "aria-label": t("language"), onchange: event => changeLanguage(event.target.value)},
      el("option", {value: "en", lang: "en"}, "English"), el("option", {value: "ru", lang: "ru"}, "Русский"));
    languageSelect.value = language;
    root.replaceChildren(
      el("header", {className: "ptm-header"},
        el("div", {}, eyebrow, el("h1", {}, heading, total), subtitle),
        el("div", {className: "ptm-header-actions"}, languageSelect, refreshButton)),
      el("section", {className: "ptm-progress"}, stats, progress),
      el("div", {className: "ptm-toolbar"}, tabs, search), form, message,
      el("div", {className: "ptm-workspace"}, el("main", {className: "ptm-main"}, list), detail));

    function applyLanguage() {
      root.setAttribute("lang", language);
      if (window.__PTM_LOCAL_PREVIEW__) {
        document.documentElement.lang = language;
        document.title = t("heading");
      }
    }
    function changeLanguage(next) {
      if (!Object.hasOwn(translations, next)) return;
      language = next;
      try { localStorage.setItem(LANGUAGE_KEY, language); } catch (_) { /* Storage may be disabled. */ }
      applyLanguage();
      eyebrow.textContent = t("workspace"); heading.textContent = t("heading") + " "; subtitle.textContent = t("subtitle");
      languageSelect.setAttribute("aria-label", t("language"));
      refreshButton.textContent = t("refresh"); addButton.textContent = t("add");
      input.placeholder = t("taskPlaceholder"); input.setAttribute("aria-label", t("newTask"));
      search.placeholder = t("search"); search.setAttribute("aria-label", t("search"));
      detail.setAttribute("aria-label", t("details")); progress.setAttribute("aria-label", t("overallProgress"));
      tabs.setAttribute("aria-label", t("filters"));
      for (const tab of tabButtons) tab.textContent = t(tab.dataset.filter);
      message.textContent = "";
      renderList(); renderDetail();
    }
    applyLanguage();

    function report(error) {
      message.textContent = error instanceof TypeError ? t("requestError") : error.message || t("saveError");
      message.classList.add("ptm-error");
    }
    async function refresh() {
      const sequence = ++refreshSequence, generation = mutationGeneration;
      const next = await request(API);
      if (disposed || sequence !== refreshSequence || generation !== mutationGeneration) return;
      data = next;
      renderList();
      renderDetail();
    }
    async function mutate(action) {
      if (pending) return;
      pending = true;
      ++mutationGeneration;
      root.setAttribute("aria-busy", "true");
      message.textContent = "";
      message.classList.remove("ptm-error");
      try { await action(); await refresh(); }
      catch (error) { report(error); }
      finally { pending = false; root.removeAttribute("aria-busy"); }
    }
    function patch(task, changes) {
      return request(API + "/" + encodeURIComponent(task.id), {
        method: "PATCH", body: JSON.stringify({revision: task.revision, ...changes})
      });
    }
    function checkbox(task) {
      const box = el("input", {type: "checkbox", className: "ptm-check", "aria-label": t(task.done ? "reopenLabel" : "completeLabel") + task.title,
        onchange: (event) => {
          const done = event.target.checked;
          event.target.checked = task.done;
          mutate(() => patch(task, {done}));
        }});
      box.checked = task.done;
      return box;
    }
    function renderList() {
      total.textContent = data.progress.total;
      stats.replaceChildren(el("strong", {}, t("progress", data.progress)),
        el("span", {className: "ptm-muted"}, `${data.progress.percent}%`));
      progress.value = data.progress.percent;
      for (const tab of tabButtons) tab.setAttribute("aria-pressed", String(tab.dataset.filter === filter));
      let tasks = data.tasks.filter(task => task.parent_id === null);
      if (filter === "starred") tasks = tasks.filter(task => task.starred);
      if (query) tasks = tasks.filter(task => [task, ...data.tasks.filter(child => child.parent_id === task.id)]
        .some(item => (item.title + " " + item.description).toLocaleLowerCase().includes(query)));
      const active = tasks.filter(task => !task.done), done = tasks.filter(task => task.done);
      const rows = active.map(taskRow);
      if (!active.length) rows.push(el("div", {className: "ptm-empty"},
        el("span", {className: "ptm-empty-icon", "aria-hidden": "true"}, "✓"),
        el("h2", {}, t(query || filter === "starred" ? "noResults" : data.progress.total ? "allDone" : "start")),
        el("p", {className: "ptm-muted"}, t(query || filter === "starred" ? "searchHint" : data.progress.total ? "doneHint" : "startHint"))));
      if (done.length) {
        rows.push(button(`${showDone ? "▾" : "▸"} ${t("completed")} · ${done.length}`, () => {showDone = !showDone; renderList();}, "ptm-completed-toggle"));
        if (showDone) rows.push(...done.map(taskRow));
      }
      list.replaceChildren(...rows);
    }
    function taskRow(task) {
      const children = data.tasks.filter(child => child.parent_id === task.id);
      const completed = children.filter(child => child.done).length;
      const label = button(task.title, () => {selected = task.id; renderList(); renderDetail();}, "ptm-task-title");
      const summary = el("div", {className: "ptm-task-summary"}, label);
      if (children.length) summary.append(el("span", {className: "ptm-muted ptm-small"}, t("stepsProgress", {done: completed, total: children.length})));
      else if (task.description) summary.append(el("span", {className: "ptm-muted ptm-small ptm-preview"}, task.description));
      const star = button(task.starred ? "★" : "☆", () => mutate(() => patch(task, {starred: !task.starred})), "ptm-star" + (task.starred ? " is-starred" : ""));
      star.setAttribute("aria-label", t(task.starred ? "unstar" : "star"));
      star.setAttribute("aria-pressed", String(task.starred));
      return el("div", {className: `ptm-row${task.done ? " is-done" : ""}${selected === task.id ? " is-selected" : ""}`}, checkbox(task), summary, star);
    }
    function renderDetail() {
      const task = data.tasks.find(item => item.id === selected);
      if (!task) {
        detail.replaceChildren(el("div", {className: "ptm-detail-placeholder"}, el("span", {"aria-hidden": "true"}, "☷"),
          el("p", {}, t("detailHint")), el("p", {className: "ptm-muted ptm-small"}, t("selectHint"))));
        return;
      }
      const title = el("input", {value: task.title, "data-draft-key": "title", "aria-label": t("taskTitle"), maxlength: "300", required: ""});
      const description = el("textarea", {"data-draft-key": "description", placeholder: t("descriptionPlaceholder"), "aria-label": t("taskDescription"), rows: "4", maxlength: "20000"}, task.description);
      const saveEdit = bindDraft(task.id + ":edit", task, {title, description}, {title: task.title, description: task.description});
      const edit = el("form", {className: "ptm-edit", onsubmit: event => {
        event.preventDefault(); mutate(() => saveEdit((revision, values) => patch({...task, revision}, values)));
      }}, el("label", {}, t("task"), title), el("label", {}, t("description"), description),
        draftWarning(task.id + ":edit", task),
        el("button", {type: "submit", className: "ptm-button"}, t("save")));
      const children = data.tasks.filter(child => child.parent_id === task.id);
      const steps = el("section", {className: "ptm-steps"}, el("h3", {}, t("subtasks"),
        el("span", {className: "ptm-muted ptm-small"}, ` ${children.filter(child => child.done).length}/${children.length}`)));
      for (const child of children) {
        const childTitle = el("input", {value: child.title, "data-draft-key": child.id + ":title", "aria-label": t("subtaskTitle"), maxlength: "300", required: ""});
        const childDescription = el("textarea", {rows: "2", "data-draft-key": child.id + ":description", "aria-label": t("subtaskDescription"), placeholder: t("stepPlaceholder"), maxlength: "20000"}, child.description);
        const saveChild = bindDraft(child.id + ":edit", child, {title: childTitle, description: childDescription}, {title: child.title, description: child.description});
        const childEditor = el("details", {className: "ptm-child-editor", "data-subtask": child.id},
          el("summary", {}, child.title),
          el("form", {onsubmit: event => {event.preventDefault(); mutate(() => saveChild((revision, values) => patch({...child, revision}, values)));}},
            childTitle, childDescription, draftWarning(child.id + ":edit", child), el("button", {type: "submit", className: "ptm-button"}, t("saveStep"))));
        childEditor.open = expanded.get(child.id) || false;
        childEditor.addEventListener("toggle", () => expanded.set(child.id, childEditor.open));
        const notes = data.comments.filter(comment => comment.task_id === child.id);
        for (const note of notes) childEditor.append(el("p", {className: "ptm-small ptm-child-note"}, `${note.actor === "hermes" ? "Hermes" : t("you")}: ${note.body}`));
        steps.append(el("div", {className: "ptm-subtask" + (child.done ? " is-done" : "")}, checkbox(child), childEditor));
      }
      if (!task.done) {
        const childInput = el("input", {placeholder: t("addStep"), "data-draft-key": "new-subtask", "aria-label": t("newSubtask"), required: "", maxlength: "300"});
        const saveNewChild = bindDraft(task.id + ":new-subtask", task, {title: childInput}, {title: ""});
        steps.append(el("form", {className: "ptm-subtask-add", onsubmit: event => {
          event.preventDefault(); mutate(() => saveNewChild((_, values) => request(API, {method: "POST", body: JSON.stringify({...values, parent_id: task.id})})));
        }}, childInput, el("button", {type: "submit", className: "ptm-button", "aria-label": t("addSubtask")}, "+")));
      }
      const notes = el("section", {className: "ptm-notes"}, el("h3", {}, t("notes")));
      const taskNotes = data.comments.filter(comment => comment.task_id === task.id);
      if (!taskNotes.length) notes.append(el("p", {className: "ptm-muted ptm-small"}, t("notesHint")));
      for (const note of taskNotes) notes.append(el("article", {className: "ptm-note"},
        el("div", {className: "ptm-muted ptm-small"}, `${note.actor === "hermes" ? "Hermes" : t("you")} · ${date(note.created_at)}`), el("p", {}, note.body)));
      const noteInput = el("textarea", {placeholder: t("notePlaceholder"), "data-draft-key": "new-comment", "aria-label": t("newComment"), rows: "2", required: "", maxlength: "10000"});
      const saveNote = bindDraft(task.id + ":note", task, {comment: noteInput}, {comment: ""});
      notes.append(el("form", {onsubmit: event => {event.preventDefault(); mutate(() => saveNote((revision, values) => patch({...task, revision}, values)));}},
        noteInput, draftWarning(task.id + ":note", task), el("button", {type: "submit", className: "ptm-button"}, t("addNote"))));
      const last = data.events.filter(event => event.task_id === task.id).at(-1);
      detail.replaceChildren(el("div", {className: "ptm-detail-heading"}, el("span", {className: "ptm-eyebrow"}, t(task.done ? "completedHeading" : "detailsHeading")),
        button(t("close"), () => {selected = null; renderList(); renderDetail();}, "ptm-close")), edit, steps, notes,
        el("footer", {className: "ptm-detail-footer"},
          button(t(task.done ? "reopen" : "complete"), () => mutate(() => patch(task, {done: !task.done})), "ptm-button ptm-primary"),
          last ? el("p", {className: "ptm-muted ptm-small"}, t("lastChanged", {actor: last.actor === "hermes" ? "Hermes" : t("you"), date: date(last.created_at)})) : null));
    }
    refresh().catch(report);
    // Keep the shared list current while preserving text being edited in the detail panel.
    const timer = setInterval(() => {if (!pending && !document.hidden) refresh().catch(report);}, 10000);
    return () => {disposed = true; clearInterval(timer); root.replaceChildren();};
  }

  if (typeof window !== "undefined" && window.__HERMES_PLUGIN_SDK__ && window.__HERMES_PLUGINS__) {
    const SDK = window.__HERMES_PLUGIN_SDK__;
    function TasksPage() {
      const ref = SDK.React.useRef(null);
      SDK.React.useEffect(() => mount(ref.current, SDK.fetchJSON), []);
      return SDK.React.createElement("div", {ref});
    }
    window.__HERMES_PLUGINS__.register("personal-task-manager", TasksPage);
  } else if (typeof window !== "undefined" && window.__PTM_LOCAL_PREVIEW__) {
    const request = async (url, options = {}) => {
      const response = await fetch(url, {...options, headers: {"Content-Type": "application/json", "X-PTM-Token": window.__PTM_LOCAL_PREVIEW__, ...options.headers}});
      const payload = await response.json();
      if (!response.ok) throw new Error(typeof payload.detail === "string" ? payload.detail : translate(options.headers?.["Accept-Language"] || savedLanguage(), "requestError"));
      return payload;
    };
    mount(document.getElementById("app"), request);
  }
  // Pure translation helpers can also be verified without a browser.
  if (typeof module === "object" && module.exports) module.exports = {translations, savedLanguage, translate};
})();
