// frontend/src/webapp.mjs
import React from "react";
import * as SDK from "@hermes/plugin-sdk";

// frontend/src/i18n.mjs
var translations = {
  "en": {
    "locale": "en-US",
    "language": "Language",
    "workspace": "PERSONAL SPACE",
    "heading": "My Tasks",
    "subtitle": "Write it down. Break it into steps. Check it off.",
    "details": "Task details",
    "overallProgress": "Overall progress",
    "newTask": "New task",
    "taskPlaceholder": "What needs to be done?",
    "search": "Search tasks",
    "filters": "Task filters",
    "all": "All tasks",
    "starred": "Important",
    "add": "Add",
    "refresh": "Refresh",
    "saveError": "Unable to save changes. Please try again.",
    "requestError": "Unable to complete the request. Please try again.",
    "staleDraft": "This item has changed. Your draft is preserved; reload it before retrying.",
    "reloadDraft": "Discard draft and reload",
    "reopenLabel": "Reopen: ",
    "completeLabel": "Complete: ",
    "progress": "{done} of {total} completed",
    "noResults": "No tasks found",
    "allDone": "All done",
    "start": "Start with one task",
    "searchHint": "Try another search or view all tasks.",
    "doneHint": "Take a breath. Add your next plans when you're ready.",
    "startHint": "Add a task above, then break it into small steps.",
    "completed": "Completed",
    "stepsProgress": "{done} of {total} steps",
    "unstar": "Remove from important",
    "star": "Mark as important",
    "detailHint": "Every task has a next step",
    "selectHint": "Select a task to add a description, subtasks, and notes.",
    "taskTitle": "Task title",
    "descriptionPlaceholder": "Description, links, or expected result\u2026",
    "taskDescription": "Task description",
    "task": "Task",
    "description": "Description",
    "save": "Save",
    "subtasks": "Subtasks",
    "subtaskTitle": "Subtask title",
    "subtaskDescription": "Subtask description",
    "stepPlaceholder": "Describe this step\u2026",
    "saveStep": "Save step",
    "you": "You",
    "addStep": "Add a step\u2026",
    "newSubtask": "New subtask",
    "addSubtask": "Add subtask",
    "notes": "Notes and results",
    "notesHint": "Keep track of what you have done and where you left off.",
    "notePlaceholder": "What did you accomplish?",
    "newComment": "New comment",
    "addNote": "Add note",
    "completedHeading": "COMPLETED",
    "detailsHeading": "DETAILS",
    "close": "Close",
    "reopen": "Reopen task",
    "complete": "Mark as completed",
    "lastChanged": "Last updated: {actor} \xB7 {date}",
    "active": "Active",
    "archive": "Archive",
    "trash": "Trash",
    "edit": "Edit",
    "menu": "Actions",
    "moveTrash": "Move to Trash",
    "restore": "Restore",
    "purge": "Delete permanently",
    "emptyTrash": "Empty Trash",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "trashQuestion": 'Move "{title}" and its subtasks to Trash? You can restore them later.',
    "purgeQuestion": 'Permanently delete "{title}" and its subtasks, notes and history? This cannot be undone.',
    "emptyTrashQuestion": "Permanently delete all {count} groups currently in Trash? This cannot be undone.",
    "emptyTrashHint": "Deleted items appear here. Restore them or delete them permanently.",
    "archiveHint": "Completed task groups appear here.",
    "cascadeHint": "Completing this task also completes its active subtasks.",
    "restoreParent": "Restore the parent task first",
    "reopenParent": "Reopen the parent task first",
    "staleNotice": "This form has changed elsewhere. Your draft keeps its original revision.",
    "saved": "Saved",
    "syncing": "Saving?",
    "noTasks": "No active tasks",
    "taskNotes": "Notes",
    "parentTask": "Parent task",
    "completedAt": "Completed: {date}",
    "back": "Back",
    "trashCount": "Trash ({count})"
  },
  "ru": {
    "locale": "ru-RU",
    "language": "\u042F\u0437\u044B\u043A",
    "workspace": "\u041B\u0418\u0427\u041D\u041E\u0415 \u041F\u0420\u041E\u0421\u0422\u0420\u0410\u041D\u0421\u0422\u0412\u041E",
    "heading": "\u041C\u043E\u0438 \u0437\u0430\u0434\u0430\u0447\u0438",
    "subtitle": "\u0417\u0430\u043F\u0438\u0448\u0438\u0442\u0435. \u0420\u0430\u0437\u0431\u0435\u0439\u0442\u0435 \u043D\u0430 \u0448\u0430\u0433\u0438. \u041E\u0442\u043C\u0435\u0442\u044C\u0442\u0435 \u0441\u0434\u0435\u043B\u0430\u043D\u043D\u043E\u0435.",
    "details": "\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u043E\u0441\u0442\u0438 \u0437\u0430\u0434\u0430\u0447\u0438",
    "overallProgress": "\u041E\u0431\u0449\u0438\u0439 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441",
    "newTask": "\u041D\u043E\u0432\u0430\u044F \u0437\u0430\u0434\u0430\u0447\u0430",
    "taskPlaceholder": "\u0427\u0442\u043E \u043D\u0443\u0436\u043D\u043E \u0441\u0434\u0435\u043B\u0430\u0442\u044C?",
    "search": "\u041F\u043E\u0438\u0441\u043A \u0437\u0430\u0434\u0430\u0447",
    "filters": "\u0424\u0438\u043B\u044C\u0442\u0440 \u0437\u0430\u0434\u0430\u0447",
    "all": "\u0412\u0441\u0435 \u0437\u0430\u0434\u0430\u0447\u0438",
    "starred": "\u0412\u0430\u0436\u043D\u044B\u0435",
    "add": "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C",
    "refresh": "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C",
    "saveError": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F. \u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u043E\u043F\u044B\u0442\u043A\u0443.",
    "requestError": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0432\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u0437\u0430\u043F\u0440\u043E\u0441. \u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u043E\u043F\u044B\u0442\u043A\u0443.",
    "staleDraft": "\u042D\u0442\u043E\u0442 \u043F\u0443\u043D\u043A\u0442 \u0438\u0437\u043C\u0435\u043D\u0451\u043D. \u0427\u0435\u0440\u043D\u043E\u0432\u0438\u043A \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D; \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u0430\u043A\u0442\u0443\u0430\u043B\u044C\u043D\u0443\u044E \u0432\u0435\u0440\u0441\u0438\u044E \u043F\u0435\u0440\u0435\u0434 \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u043E\u0439 \u043F\u043E\u043F\u044B\u0442\u043A\u043E\u0439.",
    "reloadDraft": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0447\u0435\u0440\u043D\u043E\u0432\u0438\u043A \u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0437\u0430\u043D\u043E\u0432\u043E",
    "reopenLabel": "\u0412\u0435\u0440\u043D\u0443\u0442\u044C \u0432 \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0435: ",
    "completeLabel": "\u0412\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E: ",
    "progress": "{done} \u0438\u0437 {total} \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E",
    "noResults": "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E",
    "allDone": "\u0412\u0441\u0451 \u0441\u0434\u0435\u043B\u0430\u043D\u043E",
    "start": "\u041D\u0430\u0447\u043D\u0438\u0442\u0435 \u0441 \u043E\u0434\u043D\u043E\u0439 \u0437\u0430\u0434\u0430\u0447\u0438",
    "searchHint": "\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0434\u0440\u0443\u0433\u043E\u0439 \u043F\u043E\u0438\u0441\u043A \u0438\u043B\u0438 \u043E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0432\u0441\u0435 \u0437\u0430\u0434\u0430\u0447\u0438.",
    "doneHint": "\u041C\u043E\u0436\u043D\u043E \u0432\u044B\u0434\u043E\u0445\u043D\u0443\u0442\u044C. \u041D\u043E\u0432\u044B\u0435 \u043F\u043B\u0430\u043D\u044B \u2014 \u043A\u043E\u0433\u0434\u0430 \u0431\u0443\u0434\u0435\u0442\u0435 \u0433\u043E\u0442\u043E\u0432\u044B.",
    "startHint": "\u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u0437\u0430\u0434\u0430\u0447\u0443 \u0432\u044B\u0448\u0435, \u0430 \u0437\u0430\u0442\u0435\u043C \u0440\u0430\u0437\u0431\u0435\u0439\u0442\u0435 \u0435\u0451 \u043D\u0430 \u043D\u0435\u0431\u043E\u043B\u044C\u0448\u0438\u0435 \u0448\u0430\u0433\u0438.",
    "completed": "\u0412\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043D\u044B\u0435",
    "stepsProgress": "{done} \u0438\u0437 {total} \u0448\u0430\u0433\u043E\u0432",
    "unstar": "\u0423\u0431\u0440\u0430\u0442\u044C \u0438\u0437 \u0432\u0430\u0436\u043D\u044B\u0445",
    "star": "\u041E\u0442\u043C\u0435\u0442\u0438\u0442\u044C \u0432\u0430\u0436\u043D\u043E\u0439",
    "detailHint": "\u0423 \u043A\u0430\u0436\u0434\u043E\u0439 \u0437\u0430\u0434\u0430\u0447\u0438 \u2014 \u0441\u0432\u043E\u0439 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0448\u0430\u0433",
    "selectHint": "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0437\u0430\u0434\u0430\u0447\u0443, \u0447\u0442\u043E\u0431\u044B \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435, \u043F\u043E\u0434\u0437\u0430\u0434\u0430\u0447\u0438 \u0438 \u0437\u0430\u043C\u0435\u0442\u043A\u0438.",
    "taskTitle": "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0437\u0430\u0434\u0430\u0447\u0438",
    "descriptionPlaceholder": "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435, \u0441\u0441\u044B\u043B\u043A\u0438 \u0438\u043B\u0438 \u043E\u0436\u0438\u0434\u0430\u0435\u043C\u044B\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u2026",
    "taskDescription": "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0437\u0430\u0434\u0430\u0447\u0438",
    "task": "\u0417\u0430\u0434\u0430\u0447\u0430",
    "description": "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435",
    "save": "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C",
    "subtasks": "\u041F\u043E\u0434\u0437\u0430\u0434\u0430\u0447\u0438",
    "subtaskTitle": "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043F\u043E\u0434\u0437\u0430\u0434\u0430\u0447\u0438",
    "subtaskDescription": "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043F\u043E\u0434\u0437\u0430\u0434\u0430\u0447\u0438",
    "stepPlaceholder": "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0448\u0430\u0433\u0430\u2026",
    "saveStep": "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0448\u0430\u0433",
    "you": "\u0412\u044B",
    "addStep": "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0448\u0430\u0433\u2026",
    "newSubtask": "\u041D\u043E\u0432\u0430\u044F \u043F\u043E\u0434\u0437\u0430\u0434\u0430\u0447\u0430",
    "addSubtask": "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u043E\u0434\u0437\u0430\u0434\u0430\u0447\u0443",
    "notes": "\u0417\u0430\u043C\u0435\u0442\u043A\u0438 \u0438 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B",
    "notesHint": "\u0417\u0434\u0435\u0441\u044C \u043C\u043E\u0436\u043D\u043E \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C, \u0447\u0442\u043E \u0441\u0434\u0435\u043B\u0430\u043D\u043E \u0438 \u043D\u0430 \u0447\u0451\u043C \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u043B\u0438\u0441\u044C.",
    "notePlaceholder": "\u0427\u0442\u043E \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u0434\u0435\u043B\u0430\u0442\u044C?",
    "newComment": "\u041D\u043E\u0432\u044B\u0439 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439",
    "addNote": "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u043C\u0435\u0442\u043A\u0443",
    "completedHeading": "\u0412\u042B\u041F\u041E\u041B\u041D\u0415\u041D\u041E",
    "detailsHeading": "\u041F\u041E\u0414\u0420\u041E\u0411\u041D\u041E\u0421\u0422\u0418",
    "close": "\u0417\u0430\u043A\u0440\u044B\u0442\u044C",
    "reopen": "\u0412\u0435\u0440\u043D\u0443\u0442\u044C \u0432 \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0435",
    "complete": "\u041E\u0442\u043C\u0435\u0442\u0438\u0442\u044C \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043D\u043E\u0439",
    "lastChanged": "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435: {actor} \xB7 {date}",
    "active": "????????",
    "archive": "?????",
    "trash": "???????",
    "edit": "?????????????",
    "menu": "????????",
    "moveTrash": "? ???????",
    "restore": "????????????",
    "purge": "??????? ????????",
    "emptyTrash": "???????? ???????",
    "cancel": "??????",
    "confirm": "???????????",
    "trashQuestion": "??????????? ?{title}? ? ?? ????????? ? ???????? ?? ????? ????? ????????????.",
    "purgeQuestion": "???????? ??????? ?{title}?, ?? ?????????, ??????? ? ???????? ??? ???????? ?????? ????????.",
    "emptyTrashQuestion": "???????? ??????? ??? ?????? ?? ??????? ({count})? ??? ???????? ?????? ????????.",
    "emptyTrashHint": "????? ????????? ????????? ??????. ?? ????? ???????????? ??? ??????? ????????.",
    "archiveHint": "????? ????????? ??????????? ?????? ? ???????????.",
    "cascadeHint": "?????????? ?????? ????? ???????? ?? ???????? ?????????.",
    "restoreParent": "??????? ???????????? ???????????? ??????",
    "reopenParent": "??????? ??????? ???????????? ?????? ? ????????",
    "staleNotice": "????? ???????? ? ?????? ??????????. ???????? ????????? ???????? ???????.",
    "saved": "?????????",
    "syncing": "???????????",
    "noTasks": "??? ???????? ?????",
    "taskNotes": "???????",
    "parentTask": "???????? ??????",
    "completedAt": "?????????: {date}",
    "back": "?????",
    "trashCount": "??????? ({count})"
  }
};
function savedLanguage() {
  try {
    const value = localStorage.getItem("ptm.language");
    return Object.hasOwn(translations, value) ? value : "en";
  } catch {
    return "en";
  }
}
function translate(language, key, values = {}) {
  const c = Object.hasOwn(translations, language) ? translations[language] : translations.en;
  return (c[key] || translations.en[key] || key).replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? `{${name}}`));
}

// frontend/src/state.mjs
var empty = () => ({ tasks: [], trash: [], comments: [], events: [], progress: { total: 0, done: 0, percent: 0 } });
function createController({ transport, scope = "default", storage } = {}) {
  if (storage === void 0) {
    try {
      storage = globalThis.localStorage;
    } catch {
    }
  }
  const listeners = /* @__PURE__ */ new Set();
  const key = `ptm.view:${scope}`;
  let prefs = {};
  try {
    const parsed = JSON.parse(storage?.getItem(key) || "{}");
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) prefs = parsed;
  } catch {
  }
  let state = {
    data: empty(),
    language: savedLanguage(),
    view: "active",
    query: "",
    starred: false,
    expanded: new Set(Array.isArray(prefs.expanded) ? prefs.expanded.filter((id) => typeof id === "string") : []),
    editing: null,
    drafts: /* @__PURE__ */ new Map(),
    newTitle: "",
    pending: false,
    loaded: false,
    error: "",
    confirmation: null
  };
  let sequence = 0, generation = 0, disposed = false;
  const emit = (patch2) => {
    if (disposed) return;
    state = { ...state, ...patch2 };
    for (const listener of listeners) listener();
  };
  const t = (name, values) => translate(state.language, name, values);
  const report = (error) => emit({ error: error instanceof TypeError ? t("requestError") : error.message || t("saveError") });
  const request = (path, options = {}) => transport(path, { ...options, language: state.language });
  function persist() {
    try {
      storage?.setItem(key, JSON.stringify({ expanded: [...state.expanded] }));
    } catch {
    }
  }
  async function refresh(internal = false) {
    if (disposed || state.pending && !internal) return;
    const id = ++sequence, epoch = generation;
    try {
      const next = await request("/tasks");
      if (disposed || id !== sequence || epoch !== generation) return;
      emit({ data: { ...empty(), ...next }, loaded: true, error: "" });
    } catch (error) {
      if (!disposed && id === sequence && epoch === generation) report(error);
    }
  }
  async function mutate(action, optimistic) {
    if (state.pending || disposed) return null;
    const epoch = ++generation, previous = state.data;
    emit({ pending: true, error: "", ...optimistic ? { data: optimistic(previous) } : {} });
    let result = null, written = false;
    try {
      result = await action();
      written = true;
      if (disposed || epoch !== generation) return result;
      await refresh(true);
    } catch (error) {
      if (!disposed && epoch === generation) {
        if (!written) emit({ data: previous });
        await refresh(true);
        if (!disposed && epoch === generation) report(error);
      }
    } finally {
      if (!disposed && epoch === generation) emit({ pending: false });
    }
    return result;
  }
  const patch = (task, values) => request(`/tasks/${encodeURIComponent(task.id)}`, { method: "PATCH", body: { revision: task.revision, ...values } });
  const formKey = (id, form) => `${id}:${form}`;
  function draft(id, form, field, value) {
    const task = [...state.data.tasks, ...state.data.trash].find((item) => item.id === id);
    if (!task || task.trashed_at) return;
    const key2 = formKey(id, form), old = state.drafts.get(key2);
    const baseline = old?.baseline ?? (form === "edit" ? { title: task.title, description: task.description } : form === "note" ? { comment: "" } : { title: "" });
    const values = { ...old?.values, [field]: value };
    if (value === baseline[field]) delete values[field];
    const drafts = new Map(state.drafts);
    if (Object.keys(values).length) drafts.set(key2, { revision: old?.revision ?? task.revision, baseline, values });
    else drafts.delete(key2);
    emit({ drafts });
  }
  async function submit(task, form) {
    const key2 = formKey(task.id, form), submitted = state.drafts.get(key2);
    if (!submitted) return;
    const values = { ...submitted.values };
    return mutate(async () => {
      const result = form === "child" ? await request("/tasks", { method: "POST", body: { title: values.title, parent_id: task.id } }) : await patch({ ...task, revision: submitted.revision }, values);
      if (state.drafts.get(key2) === submitted) {
        const drafts = new Map(state.drafts);
        drafts.delete(key2);
        emit({ drafts });
      }
      return result;
    });
  }
  async function add() {
    const title = state.newTitle.trim();
    if (!title) return;
    const original = state.newTitle;
    return mutate(async () => {
      const task = await request("/tasks", { method: "POST", body: { title } });
      const expanded = new Set(state.expanded);
      expanded.add(task.id);
      emit({ expanded, editing: task.id, view: "active", query: "", starred: false, ...state.newTitle === original ? { newTitle: "" } : {} });
      persist();
      return task;
    });
  }
  function toggle(task) {
    const done = !task.done;
    return mutate(() => patch(task, { done }), (data) => ({ ...data, tasks: data.tasks.map((item) => item.id === task.id || done && item.parent_id === task.id ? { ...item, done } : item) }));
  }
  function confirm(action, task) {
    const tasks = action === "empty" ? state.data.trash.filter((item) => !state.data.trash.some((parent) => parent.id === item.parent_id)) : [task];
    emit({ confirmation: { action, tasks: tasks.map((item) => ({ ...item })) } });
  }
  async function acceptConfirmation() {
    const current = state.confirmation;
    if (!current || state.pending) return;
    emit({ confirmation: null });
    return mutate(async () => {
      let result;
      for (const task of current.tasks) {
        result = await patch(task, { action: current.action === "empty" ? "purge" : current.action, ...current.action === "trash" ? {} : { confirmed: true } });
      }
      return result;
    });
  }
  return {
    getSnapshot: () => state,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    set: (patch2) => emit(patch2),
    refresh,
    add,
    toggle,
    submit,
    draft,
    confirm,
    acceptConfirmation,
    restore: (task) => mutate(() => patch(task, { action: "restore" })),
    star: (task) => mutate(() => patch(task, { starred: !task.starred })),
    discard(id, form) {
      const drafts = new Map(state.drafts);
      drafts.delete(formKey(id, form));
      emit({ drafts });
    },
    expand(id) {
      const expanded = new Set(state.expanded);
      expanded.has(id) ? expanded.delete(id) : expanded.add(id);
      emit({ expanded });
      persist();
    },
    language(language) {
      if (!["en", "ru"].includes(language)) return;
      try {
        storage?.setItem("ptm.language", language);
      } catch {
      }
      emit({ language, error: "" });
    },
    dispose() {
      disposed = true;
      ++sequence;
      ++generation;
      listeners.clear();
    },
    pause() {
      ++sequence;
      ++generation;
      emit({ pending: false });
    }
  };
}
function visibleRoots(state) {
  const items = state.view === "trash" ? state.data.trash : state.data.tasks;
  const query = state.query.trim().toLocaleLowerCase();
  return items.filter((task) => state.view === "trash" ? !items.some((parent) => parent.id === task.parent_id) : task.parent_id === null && task.done === (state.view === "archive")).filter((task) => !state.starred || task.starred).filter((task) => !query || [task, ...items.filter((child) => child.parent_id === task.id)].some((item) => `${item.title} ${item.description}`.toLocaleLowerCase().includes(query)));
}

// frontend/src/view.mjs
function createTasksView(React2, kit = {}) {
  const h = React2.createElement;
  const Input = kit.Input || "input", Textarea = kit.Textarea || "textarea";
  const Button = ({ className, ...props }) => h(kit.Button || "button", {
    ...props,
    className: [!kit.Button && "ptm-button", className].filter(Boolean).join(" ") || void 0
  });
  const act = (label, onClick, props = {}) => h(Button, { type: "button", onClick, ...props }, label);
  function Confirmation({ state, controller, t }) {
    const ref = React2.useRef(null), previous = React2.useRef(null);
    React2.useEffect(() => {
      if (!state.confirmation || kit.ConfirmDialog) return;
      previous.current = document.activeElement;
      const node = ref.current;
      if (node?.showModal) node.showModal();
      node?.querySelector("button")?.focus();
      return () => {
        if (node?.open) node.close();
        previous.current?.focus?.();
      };
    }, [Boolean(state.confirmation)]);
    const current = state.confirmation;
    if (!current) return null;
    const text = current.action === "empty" ? t("emptyTrashQuestion", { count: current.tasks.length }) : t(current.action === "trash" ? "trashQuestion" : "purgeQuestion", { title: current.tasks[0].title });
    if (kit.ConfirmDialog) return h(kit.ConfirmDialog, {
      open: true,
      title: t(current.action === "trash" ? "moveTrash" : "purge"),
      description: text,
      confirmLabel: t("confirm"),
      cancelLabel: t("cancel"),
      destructive: true,
      onClose: () => controller.set({ confirmation: null }),
      onConfirm: () => controller.acceptConfirmation()
    });
    return h(
      "dialog",
      { ref, className: "ptm-dialog", "aria-labelledby": "ptm-confirm-title", onCancel: (event) => {
        event.preventDefault();
        controller.set({ confirmation: null });
      } },
      h("h2", { id: "ptm-confirm-title" }, t(current.action === "trash" ? "moveTrash" : "purge")),
      h("p", {}, text),
      h(
        "div",
        { className: "ptm-dialog-actions" },
        act(t("cancel"), () => controller.set({ confirmation: null })),
        act(t("confirm"), () => controller.acceptConfirmation(), { className: "ptm-danger" })
      )
    );
  }
  function Editor({ task, state, controller, t }) {
    const input = (form, field, fallback) => state.drafts.get(`${task.id}:${form}`)?.values[field] ?? fallback;
    const dirty = (form) => state.drafts.get(`${task.id}:${form}`);
    const warning = (form) => dirty(form)?.revision !== void 0 && dirty(form).revision !== task.revision ? h(
      "div",
      { className: "ptm-stale", role: "status" },
      t("staleNotice"),
      act(t("reloadDraft"), () => controller.discard(task.id, form))
    ) : null;
    const submit = (form) => (event2) => {
      event2.preventDefault();
      controller.submit(task, form);
    };
    const change = (form, field) => (event2) => controller.draft(task.id, form, field, event2.target.value);
    const prefix = task.parent_id ? `${task.id}:` : "";
    const date = (stamp) => new Date(stamp).toLocaleString(t("locale"), { dateStyle: "medium", timeStyle: "short" });
    const notes = state.data.comments.filter((note) => note.task_id === task.id);
    const event = state.data.events.filter((item) => item.task_id === task.id).at(-1);
    return h(
      "section",
      { className: "ptm-editor", "aria-label": t("details") },
      h("div", { className: "ptm-editor-header" }, h("strong", {}, t("details")), act(t("close"), () => controller.set({ editing: null }))),
      h(
        "form",
        { className: "ptm-edit", onSubmit: submit("edit") },
        h("label", {}, t("taskTitle"), h(Input, {
          value: input("edit", "title", task.title),
          maxLength: 300,
          required: true,
          "data-draft-key": prefix + "title",
          "aria-label": t(task.parent_id ? "subtaskTitle" : "taskTitle"),
          onChange: change("edit", "title")
        })),
        h("label", {}, t("description"), h(Textarea, {
          value: input("edit", "description", task.description),
          rows: 3,
          maxLength: 2e4,
          "data-draft-key": prefix + "description",
          "aria-label": t(task.parent_id ? "subtaskDescription" : "taskDescription"),
          onChange: change("edit", "description")
        })),
        warning("edit"),
        h(Button, { type: "submit", disabled: state.pending || !dirty("edit") }, t("save"))
      ),
      !task.parent_id && !task.done && h(
        "form",
        { className: "ptm-subtask-add", onSubmit: submit("child") },
        h(Input, {
          value: input("child", "title", ""),
          "data-draft-key": "new-subtask",
          placeholder: t("addStep"),
          "aria-label": t("newSubtask"),
          required: true,
          maxLength: 300,
          onChange: change("child", "title")
        }),
        h(Button, { type: "submit", disabled: state.pending }, t("addSubtask"))
      ),
      h(
        "section",
        { className: "ptm-notes" },
        h("h3", {}, t("notes")),
        ...notes.map((note) => h(
          "article",
          { className: "ptm-note", key: note.id },
          h("small", {}, `${note.actor === "hermes" ? "Hermes" : t("you")} \xB7 ${date(note.created_at)}`),
          h("p", {}, note.body)
        )),
        h(
          "form",
          { onSubmit: submit("note") },
          h(Textarea, {
            value: input("note", "comment", ""),
            "data-draft-key": "new-comment",
            "aria-label": t("newComment"),
            placeholder: t("notePlaceholder"),
            rows: 2,
            maxLength: 1e4,
            required: true,
            onChange: change("note", "comment")
          }),
          warning("note"),
          h(Button, { type: "submit", disabled: state.pending || !dirty("note") }, t("addNote"))
        )
      ),
      task.completed_at && h("small", {}, t("completedAt", { date: date(task.completed_at) })),
      event && h("small", { className: "ptm-muted" }, t("lastChanged", { actor: event.actor === "hermes" ? "Hermes" : t("you"), date: date(event.created_at) }))
    );
  }
  function TaskRow({ task, children, state, controller, t, child = false }) {
    const trashed = Boolean(task.trashed_at), expanded = state.expanded.has(task.id) || Boolean(state.query);
    const parent = [...state.data.tasks, ...state.data.trash].find((item) => item.id === task.parent_id);
    const locked = !trashed && Boolean(parent?.done);
    const closeMenu = (event) => event.currentTarget.closest("details")?.removeAttribute("open");
    function menuAction(label, action, props = {}) {
      return act(label, (event) => {
        closeMenu(event);
        action();
      }, { role: "menuitem", ...props });
    }
    return h(
      "div",
      { className: `ptm-group${child ? " ptm-child" : ""}`, "data-task-id": task.id },
      h(
        "div",
        { className: `ptm-row${task.done ? " is-done" : ""}` },
        !trashed && h(
          "label",
          { className: "ptm-check-hit", title: locked ? t("reopenParent") : !child ? t("cascadeHint") : void 0 },
          h("input", {
            type: "checkbox",
            className: "ptm-check",
            checked: task.done,
            disabled: state.pending || locked,
            "aria-label": t(task.done ? "reopenLabel" : "completeLabel") + task.title,
            onChange: () => controller.toggle(task)
          })
        ),
        h(
          "button",
          {
            type: "button",
            className: "ptm-task-title",
            "aria-expanded": !child ? expanded : void 0,
            onClick: () => !child ? controller.expand(task.id) : controller.set({ editing: state.editing === task.id ? null : task.id })
          },
          children.length ? h("span", { className: "ptm-chevron", "aria-hidden": true }, expanded ? "\u25BE" : "\u25B8") : null,
          h("span", { className: "ptm-title-text" }, task.title)
        ),
        task.starred && h("span", { className: "ptm-important", title: t("star"), "aria-label": t("star") }, "\u2605"),
        children.length ? h(
          "small",
          { className: "ptm-step-count", "aria-label": t("stepsProgress", { done: children.filter((c) => c.done).length, total: children.length }) },
          `${children.filter((c) => c.done).length}/${children.length}`
        ) : null,
        h(
          "details",
          { className: "ptm-menu", onKeyDown: (event) => {
            if (event.key === "Escape") {
              event.currentTarget.removeAttribute("open");
              event.currentTarget.querySelector("summary").focus();
            }
          } },
          h("summary", { "aria-label": t("menu") + ": " + task.title }, "\u22EF"),
          h(
            "div",
            { role: "menu", className: "ptm-menu-items" },
            !trashed && menuAction(t("edit"), () => controller.set({ editing: state.editing === task.id ? null : task.id })),
            !trashed && menuAction(t(task.starred ? "unstar" : "star"), () => controller.star(task), { disabled: state.pending }),
            !trashed && menuAction(t("moveTrash"), () => controller.confirm("trash", task), { disabled: state.pending }),
            trashed && menuAction(t("restore"), () => controller.restore(task), { disabled: state.pending || Boolean(parent?.trashed_at), title: parent?.trashed_at ? t("restoreParent") : void 0 }),
            trashed && menuAction(t("purge"), () => controller.confirm("purge", task), { className: "ptm-danger", disabled: state.pending })
          )
        )
      ),
      state.editing === task.id && !trashed && h(Editor, { task, state, controller, t }),
      expanded && !child && h(
        "div",
        { className: "ptm-children" },
        children.map((item) => h(TaskRow, { key: item.id, task: item, children: [], state, controller, t, child: true })),
        !trashed && !task.done && act(t("addSubtask"), () => controller.set({ editing: task.id }), { className: "ptm-add-child" })
      )
    );
  }
  return function TasksView({ transport, scope = "default", surface = "dashboard", schedule, controller: supplied }) {
    const controllers = React2.useRef(/* @__PURE__ */ new Map());
    const transportRef = React2.useRef(transport);
    transportRef.current = transport;
    if (!controllers.current.has(scope)) controllers.current.set(scope, supplied || createController({ scope, transport: (...args) => transportRef.current(...args) }));
    const controller = controllers.current.get(scope);
    const state = React2.useSyncExternalStore(controller.subscribe, controller.getSnapshot);
    const t = (name, values) => translate(state.language, name, values);
    React2.useEffect(() => {
      controller.refresh();
      const poll = () => {
        if (!document.hidden) controller.refresh();
      };
      const stop = schedule ? schedule(poll, 3e3) : (() => {
        const id = setInterval(poll, 3e3);
        return () => clearInterval(id);
      })();
      window.addEventListener("focus", poll);
      const closeMenus = (event) => {
        for (const menu of document.querySelectorAll(".ptm-menu[open]")) if (!menu.contains(event.target)) menu.removeAttribute("open");
      };
      document.addEventListener("pointerdown", closeMenus);
      return () => {
        stop();
        window.removeEventListener("focus", poll);
        document.removeEventListener("pointerdown", closeMenus);
        controller.pause();
      };
    }, [controller]);
    const mounted = React2.useRef(false);
    React2.useEffect(() => {
      mounted.current = true;
      return () => {
        mounted.current = false;
        queueMicrotask(() => {
          if (!mounted.current) for (const c of controllers.current.values()) c.dispose();
        });
      };
    }, []);
    const roots = visibleRoots(state);
    const items = state.view === "trash" ? state.data.trash : state.data.tasks;
    const trashRoots = state.data.trash.filter((task) => !state.data.trash.some((parent) => parent.id === task.parent_id));
    return h(
      "section",
      { className: "ptm", "data-surface": surface, "data-scope": scope, "data-loaded": String(state.loaded), lang: state.language, "aria-busy": state.pending ? "true" : void 0 },
      h(
        "header",
        { className: "ptm-header" },
        h("h1", {}, t("heading"), h("span", { className: "ptm-count" }, state.data.progress.total)),
        h("div", { className: "ptm-header-actions" }, h(
          "select",
          { className: "ptm-language", value: state.language, "aria-label": t("language"), onChange: (event) => controller.language(event.target.value) },
          h("option", { value: "en" }, "English"),
          h("option", { value: "ru" }, "\u0420\u0443\u0441\u0441\u043A\u0438\u0439")
        ), act(t("refresh"), () => controller.refresh(), { disabled: state.pending }))
      ),
      h(
        "div",
        { className: "ptm-progress" },
        h("span", { className: "ptm-stats" }, t("progress", state.data.progress)),
        h("progress", { max: 100, value: state.data.progress.percent, "aria-label": t("overallProgress") })
      ),
      h("nav", { className: "ptm-tabs", "aria-label": t("filters") }, ["active", "archive", "trash"].map((view) => act(view === "trash" ? t("trashCount", { count: trashRoots.length }) : t(view), () => controller.set({ view, editing: null }), { key: view, "aria-pressed": state.view === view }))),
      h(
        "div",
        { className: "ptm-toolbar" },
        h(Input, {
          type: "search",
          value: state.query,
          placeholder: t("search"),
          "aria-label": t("search"),
          onChange: (event) => controller.set({ query: event.target.value })
        }),
        act(t("starred"), () => controller.set({ starred: !state.starred }), { "aria-pressed": state.starred }),
        state.view === "trash" && trashRoots.length > 0 && act(t("emptyTrash"), () => controller.confirm("empty"), { className: "ptm-danger", disabled: state.pending })
      ),
      state.view === "active" && h(
        "form",
        { className: "ptm-add", onSubmit: (event) => {
          event.preventDefault();
          controller.add();
        } },
        h(Input, {
          value: state.newTitle,
          placeholder: t("taskPlaceholder"),
          "aria-label": t("newTask"),
          maxLength: 300,
          required: true,
          onChange: (event) => controller.set({ newTitle: event.target.value })
        }),
        h(Button, { type: "submit", disabled: state.pending }, t("add"))
      ),
      h("div", { className: "ptm-message", role: "status", "aria-live": "polite" }, state.error || (state.pending ? t("syncing") : "")),
      h("div", { className: "ptm-list" }, roots.length ? roots.map((task) => h(TaskRow, { key: task.id, task, state, controller, t, children: items.filter((child) => child.parent_id === task.id) })) : h("p", { className: "ptm-empty" }, t(state.query || state.starred ? "noResults" : state.view === "trash" ? "emptyTrashHint" : state.view === "archive" ? "archiveHint" : "noTasks"))),
      h(Confirmation, { state, controller, t })
    );
  };
}

// frontend/src/style.css
var style_default = '.ptm { --ptm-bg:var(--background-base,var(--color-background,#fff)); --ptm-soft:var(--color-muted,#f4f4f5); --ptm-line:var(--color-border,#dedee3); --ptm-text:var(--foreground-base,var(--color-foreground,#242428)); --ptm-muted:var(--color-muted-foreground,#71717a); --ptm-accent:var(--color-primary,#52525b); --ptm-danger:var(--color-destructive,#b42318); color:var(--ptm-text); font:inherit; font-size:14px; line-height:1.45; width:100%; min-width:0; padding:16px; box-sizing:border-box; }\n.ptm[data-surface=webapp] { --ptm-bg:var(--ui-bg-editor); --ptm-soft:var(--ui-bg-hover,var(--ui-bg-elevated)); --ptm-line:var(--ui-stroke-secondary); --ptm-text:var(--ui-text-primary); --ptm-muted:var(--ui-text-secondary); --ptm-accent:var(--ui-accent); --ptm-danger:var(--ui-danger,var(--ui-red,var(--ui-accent))); }\n.ptm *, .ptm *::before, .ptm *::after {box-sizing:border-box;}\n.ptm button,.ptm input,.ptm textarea,.ptm select {font:inherit; color:inherit; max-width:100%;}\n.ptm button {cursor:pointer;}\n.ptm button:disabled,.ptm input:disabled {cursor:default; opacity:.55;}\n.ptm .ptm-button,.ptm .ptm-compact-button {background:transparent;border:1px solid var(--ptm-line);border-radius:6px;padding:5px 9px;min-height:32px;}\n.ptm button:hover:not(:disabled),.ptm summary:hover {background:var(--ptm-soft);}\n.ptm :focus-visible {outline:2px solid var(--ptm-accent);outline-offset:2px;}\n.ptm-header,.ptm-header-actions,.ptm-toolbar,.ptm-add,.ptm-progress,.ptm-editor-header,.ptm-subtask-add {display:flex;align-items:center;gap:8px;min-width:0;}\n.ptm-header {justify-content:space-between;flex-wrap:wrap;margin-bottom:12px;}\n.ptm h1 {font-size:18px;font-weight:600;margin:0;line-height:1.4;}\n.ptm h2 {font-size:16px;margin:0;}\n.ptm h3 {font-size:13px;margin:8px 0;}\n.ptm-count {color:var(--ptm-muted);font-size:13px;font-weight:400;margin-left:8px;}\n.ptm .ptm-language {background:var(--ptm-bg);border:1px solid var(--ptm-line);border-radius:6px;padding:5px;min-height:32px;}\n.ptm-progress {color:var(--ptm-muted);font-size:12px;justify-content:space-between;margin-bottom:12px;}\n.ptm progress {appearance:none;border:0;width:100px;height:4px;background:var(--ptm-line);color:var(--ptm-accent);border-radius:4px;overflow:hidden;}\n.ptm progress::-webkit-progress-bar {background:var(--ptm-line);}\n.ptm progress::-webkit-progress-value {background:var(--ptm-accent);}\n.ptm progress::-moz-progress-bar {background:var(--ptm-accent);}\n.ptm-tabs {display:flex;gap:4px;flex-wrap:wrap;border-bottom:1px solid var(--ptm-line);padding-bottom:8px;}\n.ptm [aria-pressed=true] {background:var(--ptm-soft)!important;font-weight:600;}\n.ptm-toolbar {margin:10px 0;flex-wrap:wrap;}\n.ptm-toolbar input {flex:1;min-width:140px;}\n.ptm input:not([type=checkbox]),.ptm textarea {width:100%;min-width:0;background:var(--ptm-bg);border:1px solid var(--ptm-line);border-radius:6px;padding:7px 9px;}\n.ptm textarea {resize:vertical;min-height:60px;}\n.ptm input::placeholder,.ptm textarea::placeholder {color:var(--ptm-muted);}\n.ptm-add {margin:8px 0;}\n.ptm-add input,.ptm-subtask-add input {flex:1;}\n.ptm-message {min-height:22px;font-size:12px;color:var(--ptm-danger);overflow-wrap:anywhere;}\n.ptm-group {min-width:0;}\n.ptm-row {display:flex;align-items:center;gap:5px;min-height:40px;border-bottom:1px solid var(--ptm-line);position:relative;}\n.ptm-row:hover {background:var(--ptm-soft);}\n.ptm-check-hit {display:grid;place-items:center;flex:0 0 34px;min-height:38px;cursor:pointer;}\n.ptm .ptm-check {appearance:none;width:19px;height:19px;border:1.5px solid var(--ptm-muted);border-radius:50%;margin:0;display:grid;place-content:center;cursor:pointer;flex-shrink:0;background:transparent;}\n.ptm .ptm-check:checked {background:var(--ptm-accent);border-color:var(--ptm-accent);}\n.ptm .ptm-check:checked::after {content:"\u2713";font-size:13px;line-height:1;color:var(--ptm-bg);}\n.ptm .ptm-task-title {display:flex;align-items:center;gap:5px;flex:1;min-width:0;min-height:38px;text-align:left;border:0;background:none;padding:6px 2px;}\n.ptm-title-text {overflow-wrap:anywhere;}\n.ptm-chevron {font-size:11px;color:var(--ptm-muted);flex:0 0 12px;}\n.ptm-step-count {font-size:11px;color:var(--ptm-muted);white-space:nowrap;}\n.ptm-important {color:var(--ptm-accent);font-size:12px;}\n.ptm .is-done .ptm-title-text {text-decoration:line-through;color:var(--ptm-muted);}\n.ptm-children {margin-left:24px;border-left:1px solid var(--ptm-line);padding-left:7px;}\n.ptm .ptm-add-child {background:transparent;border:0!important;color:var(--ptm-muted);font-size:12px;margin:4px 0 4px 32px;}\n.ptm-menu {position:relative;flex:0 0 32px;}\n.ptm-menu summary {list-style:none;text-align:center;cursor:pointer;border-radius:4px;min-width:32px;min-height:36px;font-size:20px;}\n.ptm-menu summary::-webkit-details-marker {display:none;}\n.ptm-menu-items {position:absolute;z-index:20;right:0;top:100%;display:grid;min-width:180px;max-width:min(260px,calc(100vw - 50px));padding:4px;background:var(--ptm-bg);border:1px solid var(--ptm-line);border-radius:7px;box-shadow:0 4px 14px #0002;}\n.ptm .ptm-menu-items button {border:0!important;text-align:left;white-space:normal;justify-content:flex-start;}\n.ptm .ptm-danger {color:var(--ptm-danger);}\n.ptm-editor {background:var(--ptm-bg);border-bottom:1px solid var(--ptm-line);padding:12px 8px 16px 34px;min-width:0;display:grid;gap:10px;}\n.ptm-editor-header {justify-content:space-between;font-size:12px;}\n.ptm-edit,.ptm-notes form {display:grid;gap:8px;}\n.ptm-edit label {display:grid;gap:4px;color:var(--ptm-muted);font-size:12px;}\n.ptm-edit button,.ptm-notes form button {justify-self:start;}\n.ptm-note {padding:6px 0;border-bottom:1px solid var(--ptm-line);}\n.ptm-note p {margin:4px 0;white-space:pre-wrap;overflow-wrap:anywhere;}\n.ptm-note small,.ptm-muted {color:var(--ptm-muted);font-size:11px;}\n.ptm-stale {display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:12px;color:var(--ptm-muted);}\n.ptm-empty {padding:24px 8px;text-align:center;color:var(--ptm-muted);font-size:13px;}\n.ptm-dialog {background:var(--ptm-bg);color:var(--ptm-text);border:1px solid var(--ptm-line);border-radius:10px;padding:20px;width:420px;max-width:calc(100vw - 32px);}\n.ptm-dialog p {overflow-wrap:anywhere;}\n.ptm-dialog::backdrop {background:#0006;}\n.ptm-dialog-actions {display:flex;justify-content:flex-end;gap:8px;}\n@media(max-width:600px) { .ptm {padding:10px 8px;} .ptm-children {margin-left:16px;padding-left:4px;} .ptm-editor {padding-left:12px;} .ptm-check-hit {flex-basis:38px;min-height:44px;} .ptm-row {min-height:44px;} .ptm-menu summary {min-height:44px;padding-top:3px;} .ptm-task-title {min-height:44px;} .ptm-subtask-add {align-items:stretch;flex-wrap:wrap;} .ptm-subtask-add input {flex-basis:100%;} }\n.ptm[data-surface=preview] {max-width:960px;margin:auto;background:var(--ptm-bg);}\n@media(prefers-color-scheme:dark) { .ptm[data-surface=preview] {--ptm-bg:#202024;--ptm-soft:#2c2c32;--ptm-line:#414148;--ptm-text:#eeeef0;--ptm-muted:#aaaab3;--ptm-accent:#c4c4d0;--ptm-danger:#f29c96;} }\n';

// frontend/src/webapp.mjs
var View = createTasksView(React, SDK);
var webapp_default = {
  id: "personal-task-manager",
  name: "My Tasks",
  register(ctx) {
    const style = document.createElement("style");
    style.textContent = style_default;
    style.dataset.ptm = "webapp";
    document.head.append(style);
    ctx.onDispose(() => style.remove());
    function TasksPage() {
      const profile = SDK.useValue(SDK.host.state.profile);
      const epoch = SDK.useGatewayActivationEpoch();
      const transport = React.useCallback(async (path, { body, language, ...options } = {}) => {
        if (epoch !== SDK.gatewayActivationEpoch()) throw new Error("The active Hermes connection changed");
        const result = await ctx.rest(`${path}?language=${encodeURIComponent(language || "en")}`, { ...options, ...body === void 0 ? {} : { body } });
        if (epoch !== SDK.gatewayActivationEpoch()) throw new Error("The active Hermes connection changed");
        return result;
      }, [profile, epoch]);
      return React.createElement(View, { transport, scope: `${profile}:${epoch}`, surface: "webapp", schedule: ctx.setInterval });
    }
    ctx.registerMany([
      { id: "page", area: SDK.ROUTES_AREA, data: { path: "/personal-tasks" }, render: () => React.createElement(TasksPage) },
      { id: "nav", area: SDK.SIDEBAR_NAV_AREA, data: { path: "/personal-tasks", label: "My Tasks", codicon: "checklist" } }
    ]);
  }
};
export {
  webapp_default as default
};
