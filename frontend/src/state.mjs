import {languageStorage, languagePreference, resolveLanguage, normalizeLanguage, browserLanguages as readBrowserLanguages, LANGUAGE_KEY, describeError, translate} from "./i18n.mjs";

const empty = () => ({tasks: [], trash: [], comments: [], events: [], progress: {total: 0, done: 0, percent: 0}});

export function createController({transport, scope = "default", storage, hermesLanguage, browserLanguages = readBrowserLanguages()} = {}) {
  if (storage === undefined) storage = languageStorage();
  const listeners = new Set();
  const key = `ptm.view:${scope}`;
  let prefs = {};
  try {const parsed = JSON.parse(storage?.getItem(key) || "{}"); if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) prefs = parsed;} catch { /* Private browsing. */ }
  let manualLanguage = languagePreference(storage);
  let inheritedLanguage = hermesLanguage, machineLanguages = browserLanguages;
  const initialLanguage = resolveLanguage({manual: manualLanguage, hermes: inheritedLanguage, browser: machineLanguages});
  let state = {data: empty(), language: initialLanguage.language, languagePreference: manualLanguage || "auto", languageSource: initialLanguage.source, view: "active", query: "", starred: false,
    expanded: new Set(Array.isArray(prefs.expanded) ? prefs.expanded.filter(id => typeof id === "string") : []), editing: null,
    drafts: new Map(), newTitle: "", pending: false, loaded: false, error: "", errorDetail: null, confirmation: null};
  let sequence = 0, generation = 0, disposed = false;
  const emit = patch => {if (disposed) return; state = {...state, ...patch}; for (const listener of listeners) listener();};
  const t = (name, values) => translate(state.language, name, values);
  const report = (error, fallback = "requestError") => {
    const detail = describeError(error, fallback);
    emit({error: t(detail.key, detail.values), errorDetail: detail});
  };
  function applyLanguage() {
    const next = resolveLanguage({manual: manualLanguage, hermes: inheritedLanguage, browser: machineLanguages});
    if (next.language === state.language && next.source === state.languageSource && (manualLanguage || "auto") === state.languagePreference) return;
    emit({language: next.language, languagePreference: manualLanguage || "auto", languageSource: next.source,
      ...(state.errorDetail ? {error: translate(next.language, state.errorDetail.key, state.errorDetail.values)} : {})});
  }
  const request = (path, options = {}) => transport(path, {...options, language: state.language});
  function persist() {try {storage?.setItem(key, JSON.stringify({expanded: [...state.expanded]}));} catch { /* Session state still works. */ }}
  async function refresh(internal = false) {
    if (disposed || (state.pending && !internal)) return;
    const id = ++sequence, epoch = generation;
    try {
      const next = await request("/tasks");
      if (disposed || id !== sequence || epoch !== generation) return;
      emit({data: {...empty(), ...next}, loaded: true, error: "", errorDetail: null});
    } catch (error) {
      if (!disposed && id === sequence && epoch === generation) report(error);
    }
  }
  async function mutate(action, optimistic) {
    if (state.pending || disposed) return null;
    const epoch = ++generation, previous = state.data;
    emit({pending: true, error: "", errorDetail: null, ...(optimistic ? {data: optimistic(previous)} : {})});
    let result = null, written = false;
    try {
      result = await action(); written = true;
      if (disposed || epoch !== generation) return result;
      await refresh(true);
    } catch (error) {
      if (!disposed && epoch === generation) {
        if (!written) emit({data: previous});
        // A batch may be partially committed, or a response may be lost after
        // the server committed. Reconcile before displaying the failure.
        await refresh(true);
        if (!disposed && epoch === generation) report(error, "saveError");
      }
    } finally {
      if (!disposed && epoch === generation) emit({pending: false});
    }
    return result;
  }
  const patch = (task, values) => request(`/tasks/${encodeURIComponent(task.id)}`, {method: "PATCH", body: {revision: task.revision, ...values}});
  const formKey = (id, form) => `${id}:${form}`;
  function draft(id, form, field, value) {
    const task = [...state.data.tasks, ...state.data.trash].find(item => item.id === id);
    if (!task || task.trashed_at) return;
    const key = formKey(id, form), old = state.drafts.get(key);
    const baseline = old?.baseline ?? (form === "edit" ? {title: task.title, description: task.description} : form === "note" ? {comment: ""} : {title: ""});
    const values = {...old?.values, [field]: value};
    if (value === baseline[field]) delete values[field];
    const drafts = new Map(state.drafts);
    if (Object.keys(values).length) drafts.set(key, {revision: old?.revision ?? task.revision, baseline, values});
    else drafts.delete(key);
    emit({drafts});
  }
  async function submit(task, form) {
    const key = formKey(task.id, form), submitted = state.drafts.get(key);
    if (!submitted) return;
    const values = {...submitted.values};
    return mutate(async () => {
      const result = form === "child"
        ? await request("/tasks", {method: "POST", body: {title: values.title, parent_id: task.id}})
        : await patch({...task, revision: submitted.revision}, values);
      if (state.drafts.get(key) === submitted) {
        const drafts = new Map(state.drafts); drafts.delete(key); emit({drafts});
      }
      return result;
    });
  }
  async function add() {
    const title = state.newTitle.trim(); if (!title) return;
    const original = state.newTitle;
    return mutate(async () => {
      const task = await request("/tasks", {method: "POST", body: {title}});
      const expanded = new Set(state.expanded); expanded.add(task.id);
      emit({expanded, editing: task.id, view: "active", query: "", starred: false, ...(state.newTitle === original ? {newTitle: ""} : {})});
      persist(); return task;
    });
  }
  function toggle(task) {
    const done = !task.done;
    return mutate(() => patch(task, {done}), data => ({...data, tasks: data.tasks.map(item =>
      item.id === task.id || (done && item.parent_id === task.id) ? {...item, done} : item)}));
  }
  function confirm(action, task) {
    const tasks = action === "empty" ? state.data.trash.filter(item => !state.data.trash.some(parent => parent.id === item.parent_id)) : [task];
    emit({confirmation: {action, tasks: tasks.map(item => ({...item}))}});
  }
  async function acceptConfirmation() {
    const current = state.confirmation; if (!current || state.pending) return;
    emit({confirmation: null});
    return mutate(async () => {
      let result;
      for (const task of current.tasks) {
        result = await patch(task, {action: current.action === "empty" ? "purge" : current.action, ...(current.action === "trash" ? {} : {confirmed: true})});
      }
      return result;
    });
  }
  return {
    getSnapshot: () => state,
    subscribe: listener => {listeners.add(listener); return () => listeners.delete(listener);},
    set: patch => emit(patch), refresh, add, toggle, submit, draft, confirm, acceptConfirmation,
    restore: task => mutate(() => patch(task, {action: "restore"})),
    star: task => mutate(() => patch(task, {starred: !task.starred})),
    discard(id, form) {const drafts = new Map(state.drafts); drafts.delete(formKey(id, form)); emit({drafts});},
    expand(id) {const expanded = new Set(state.expanded); expanded.has(id) ? expanded.delete(id) : expanded.add(id); emit({expanded}); persist();},
    language(language) {
      if (language !== "auto" && !normalizeLanguage(language)) return;
      manualLanguage = language === "auto" ? null : normalizeLanguage(language);
      try {storage?.setItem(LANGUAGE_KEY, manualLanguage || "auto");} catch { /* Session fallback. */ }
      applyLanguage();
    },
    inheritLanguage(language, browser = readBrowserLanguages()) {
      inheritedLanguage = language; machineLanguages = browser; applyLanguage();
    },
    syncLanguagePreference() {
      // A cached profile may become active after another profile changed the
      // app-wide preference. Failed storage must not erase an in-memory pick.
      try {if (storage?.getItem) {manualLanguage = normalizeLanguage(storage.getItem(LANGUAGE_KEY)); applyLanguage();}} catch { /* Keep the session choice. */ }
    },
    dispose() {disposed = true; ++sequence; ++generation; listeners.clear();},
    pause() {++sequence; ++generation; emit({pending: false});},
  };
}

export function visibleRoots(state) {
  const items = state.view === "trash" ? state.data.trash : state.data.tasks;
  const query = state.query.trim().toLocaleLowerCase();
  return items.filter(task => state.view === "trash"
    ? !items.some(parent => parent.id === task.parent_id)
    : task.parent_id === null && task.done === (state.view === "archive"))
    .filter(task => !state.starred || task.starred)
    .filter(task => !query || [task, ...items.filter(child => child.parent_id === task.id)]
      .some(item => `${item.title} ${item.description}`.toLocaleLowerCase().includes(query)));
}
