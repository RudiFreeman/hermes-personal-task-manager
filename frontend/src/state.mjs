import {savedLanguage, translate} from "./i18n.mjs";

const empty = () => ({tasks: [], trash: [], comments: [], events: [], progress: {total: 0, done: 0, percent: 0}});

export function createController({transport, scope = "default", storage} = {}) {
  if (storage === undefined) {try {storage = globalThis.localStorage;} catch { /* Disabled storage. */ }}
  const listeners = new Set();
  const key = `ptm.view:${scope}`;
  let prefs = {};
  try {const parsed = JSON.parse(storage?.getItem(key) || "{}"); if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) prefs = parsed;} catch { /* Private browsing. */ }
  let state = {data: empty(), language: savedLanguage(), view: "active", query: "", starred: false,
    expanded: new Set(Array.isArray(prefs.expanded) ? prefs.expanded.filter(id => typeof id === "string") : []), editing: null,
    drafts: new Map(), newTitle: "", pending: false, loaded: false, error: "", confirmation: null};
  let sequence = 0, generation = 0, disposed = false;
  const emit = patch => {if (disposed) return; state = {...state, ...patch}; for (const listener of listeners) listener();};
  const t = (name, values) => translate(state.language, name, values);
  const report = error => emit({error: error instanceof TypeError ? t("requestError") : error.message || t("saveError")});
  const request = (path, options = {}) => transport(path, {...options, language: state.language});
  function persist() {try {storage?.setItem(key, JSON.stringify({expanded: [...state.expanded]}));} catch { /* Session state still works. */ }}
  async function refresh(internal = false) {
    if (disposed || (state.pending && !internal)) return;
    const id = ++sequence, epoch = generation;
    try {
      const next = await request("/tasks");
      if (disposed || id !== sequence || epoch !== generation) return;
      emit({data: {...empty(), ...next}, loaded: true, error: ""});
    } catch (error) {
      if (!disposed && id === sequence && epoch === generation) report(error);
    }
  }
  async function mutate(action, optimistic) {
    if (state.pending || disposed) return null;
    const epoch = ++generation, previous = state.data;
    emit({pending: true, error: "", ...(optimistic ? {data: optimistic(previous)} : {})});
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
        if (!disposed && epoch === generation) report(error);
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
      if (!["en", "ru"].includes(language)) return;
      try {storage?.setItem("ptm.language", language);} catch { /* Session fallback. */ }
      emit({language, error: ""});
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
