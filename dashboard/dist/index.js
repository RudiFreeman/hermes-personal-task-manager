var PTMDashboard = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // frontend/src/dashboard.mjs
  var dashboard_exports = {};
  __export(dashboard_exports, {
    LocalizedError: () => LocalizedError,
    savedLanguage: () => savedLanguage,
    translate: () => translate,
    translations: () => translations
  });

  // locales/en.json
  var en_default = {
    locale: "en-US",
    language: "Language",
    heading: "My Tasks",
    details: "Task details",
    resizePanels: "Resize task list and details",
    expandTask: "Expand: {title}",
    collapseTask: "Collapse: {title}",
    overallProgress: "Overall progress",
    newTask: "New task",
    taskPlaceholder: "What needs to be done?",
    search: "Search tasks",
    filters: "Task filters",
    starred: "Important",
    add: "Add",
    addTask: "Add task",
    refresh: "Refresh",
    saveError: "Unable to save changes. Please try again.",
    requestError: "Unable to complete the request. Please try again.",
    reloadDraft: "Discard draft and reload",
    reopenLabel: "Reopen: ",
    completeLabel: "Complete: ",
    progress: "{done} of {total} completed",
    noResults: "No tasks found",
    stepsProgress: "{done} of {total} steps",
    unstar: "Remove from important",
    star: "Mark as important",
    taskTitle: "Task title",
    taskDescription: "Task description",
    description: "Description",
    save: "Save",
    subtaskTitle: "Subtask title",
    subtaskDescription: "Subtask description",
    you: "You",
    addStep: "Add a step\u2026",
    newSubtask: "New subtask",
    addSubtask: "Add subtask",
    notes: "Notes and results",
    notePlaceholder: "What did you accomplish?",
    newComment: "New comment",
    addNote: "Add note",
    close: "Close",
    lastChanged: "Last updated: {actor} \xB7 {date}",
    active: "Active",
    archive: "Archive",
    trash: "Trash",
    edit: "Edit",
    menu: "Actions",
    moveTrash: "Move to Trash",
    restore: "Restore",
    purge: "Delete permanently",
    emptyTrash: "Empty Trash",
    cancel: "Cancel",
    confirm: "Confirm",
    trashQuestion: 'Move "{title}" and its subtasks to Trash? You can restore them later.',
    purgeQuestion: 'Permanently delete "{title}" and its subtasks, notes and history? This cannot be undone.',
    emptyTrashQuestion: "Permanently delete all {count} groups currently in Trash? This cannot be undone.",
    emptyTrashHint: "Deleted items appear here. Restore them or delete them permanently.",
    archiveHint: "Completed task groups appear here.",
    cascadeHint: "Completing this task also completes its active subtasks.",
    restoreParent: "Restore the parent task first",
    reopenParent: "Reopen the parent task first",
    staleNotice: "This form has changed elsewhere. Your draft keeps its original revision.",
    syncing: "Saving\u2026",
    noTasks: "No active tasks",
    completedAt: "Completed: {date}",
    trashCount: "Trash ({count})",
    languageName: "English",
    settings: "Settings",
    autoLanguage: "Automatic",
    languageHelp: "Automatic follows Hermes, then the browser or system language.",
    languageSourceManual: "Selected in this app",
    languageSourceHermes: "Following Hermes",
    languageSourceBrowser: "Following browser or system",
    languageSourceFallback: "Default language",
    connectionChanged: "The active Hermes connection changed. Please try again.",
    errorNewerDatabase: "The database was created by a newer plugin version",
    errorTaskId: "A task ID is required",
    errorNotFound: "Task not found",
    errorTooManySubtasks: "Add at most 100 subtasks at a time",
    errorSubtaskDepth: "Only one level of subtasks is supported",
    errorSubtaskFields: "A subtask may contain only a title and description",
    errorReopenParent: "Reopen the parent task first",
    errorLifecycleSeparate: "Send a lifecycle action separately from edits",
    errorNoChanges: "Provide a title, description, completion state, importance, or comment",
    errorEvidence: "Hermes must describe what was completed and the supporting evidence",
    errorRevision: "This task has changed. Refresh the list and try again",
    errorRestoreFirst: "Restore this item from Trash first",
    errorLifecycleUnknown: "Unknown lifecycle action",
    errorNotInTrash: "This item is not in Trash",
    errorRestoreParent: "Restore the parent task first",
    errorPurgeConfirmation: "Confirm permanent deletion explicitly",
    errorArgumentObject: "Expected an argument object",
    errorArgumentUnknown: "Unknown argument",
    errorReadRevision: "Read the list first and supply the task revision",
    errorJsonContentType: "Expected application/json",
    errorRequestSize: "Invalid request size",
    errorJsonObject: "Expected a JSON object",
    errorUnknownField: "Unknown field",
    errorRevisionRequired: "A task revision is required",
    errorLocalAddress: "Use the 127.0.0.1 address",
    errorAccessDenied: "Local API access denied",
    errorOrigin: "Request origin is not allowed",
    errorRouteNotFound: "Not found",
    errorInvalidData: "Invalid request data",
    errorSaveData: "Unable to save data",
    errorTextType: "{field}: expected text",
    errorTextLength: "{field}: must contain {minimum} to {maximum} characters",
    errorBoolean: "{field}: expected true or false",
    "field.title": "title",
    "field.description": "description",
    "field.subtask title": "subtask title",
    "field.comment": "comment",
    requiredField: "Fill in this field.",
    detailsWidth: "Default details width",
    detailsWidthHelp: "Desktop panel width when opened. On mobile, details use the full width."
  };

  // locales/ru.json
  var ru_default = {
    locale: "ru-RU",
    language: "\u042F\u0437\u044B\u043A",
    heading: "\u041C\u043E\u0438 \u0437\u0430\u0434\u0430\u0447\u0438",
    details: "\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u043E\u0441\u0442\u0438 \u0437\u0430\u0434\u0430\u0447\u0438",
    resizePanels: "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0448\u0438\u0440\u0438\u043D\u0443 \u0441\u043F\u0438\u0441\u043A\u0430 \u0438 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438",
    expandTask: "\u0420\u0430\u0437\u0432\u0435\u0440\u043D\u0443\u0442\u044C: {title}",
    collapseTask: "\u0421\u0432\u0435\u0440\u043D\u0443\u0442\u044C: {title}",
    overallProgress: "\u041E\u0431\u0449\u0438\u0439 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441",
    newTask: "\u041D\u043E\u0432\u0430\u044F \u0437\u0430\u0434\u0430\u0447\u0430",
    taskPlaceholder: "\u0427\u0442\u043E \u043D\u0443\u0436\u043D\u043E \u0441\u0434\u0435\u043B\u0430\u0442\u044C?",
    search: "\u041F\u043E\u0438\u0441\u043A \u0437\u0430\u0434\u0430\u0447",
    filters: "\u0424\u0438\u043B\u044C\u0442\u0440 \u0437\u0430\u0434\u0430\u0447",
    starred: "\u0412\u0430\u0436\u043D\u044B\u0435",
    add: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C",
    addTask: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0443",
    refresh: "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C",
    saveError: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F. \u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u043E\u043F\u044B\u0442\u043A\u0443.",
    requestError: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0432\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u0437\u0430\u043F\u0440\u043E\u0441. \u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u043E\u043F\u044B\u0442\u043A\u0443.",
    reloadDraft: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0447\u0435\u0440\u043D\u043E\u0432\u0438\u043A \u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0437\u0430\u043D\u043E\u0432\u043E",
    reopenLabel: "\u0412\u0435\u0440\u043D\u0443\u0442\u044C \u0432 \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0435: ",
    completeLabel: "\u0412\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E: ",
    progress: "{done} \u0438\u0437 {total} \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E",
    noResults: "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E",
    stepsProgress: "{done} \u0438\u0437 {total} \u0448\u0430\u0433\u043E\u0432",
    unstar: "\u0423\u0431\u0440\u0430\u0442\u044C \u0438\u0437 \u0432\u0430\u0436\u043D\u044B\u0445",
    star: "\u041E\u0442\u043C\u0435\u0442\u0438\u0442\u044C \u0432\u0430\u0436\u043D\u043E\u0439",
    taskTitle: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0437\u0430\u0434\u0430\u0447\u0438",
    taskDescription: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0437\u0430\u0434\u0430\u0447\u0438",
    description: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435",
    save: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C",
    subtaskTitle: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043F\u043E\u0434\u0437\u0430\u0434\u0430\u0447\u0438",
    subtaskDescription: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043F\u043E\u0434\u0437\u0430\u0434\u0430\u0447\u0438",
    you: "\u0412\u044B",
    addStep: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0448\u0430\u0433\u2026",
    newSubtask: "\u041D\u043E\u0432\u0430\u044F \u043F\u043E\u0434\u0437\u0430\u0434\u0430\u0447\u0430",
    addSubtask: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u043E\u0434\u0437\u0430\u0434\u0430\u0447\u0443",
    notes: "\u0417\u0430\u043C\u0435\u0442\u043A\u0438 \u0438 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B",
    notePlaceholder: "\u0427\u0442\u043E \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u0434\u0435\u043B\u0430\u0442\u044C?",
    newComment: "\u041D\u043E\u0432\u044B\u0439 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439",
    addNote: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u043C\u0435\u0442\u043A\u0443",
    close: "\u0417\u0430\u043A\u0440\u044B\u0442\u044C",
    lastChanged: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435: {actor} \xB7 {date}",
    active: "\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0435",
    archive: "\u0410\u0440\u0445\u0438\u0432",
    trash: "\u041A\u043E\u0440\u0437\u0438\u043D\u0430",
    edit: "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C",
    menu: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F",
    moveTrash: "\u0412 \u043A\u043E\u0440\u0437\u0438\u043D\u0443",
    restore: "\u0412\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C",
    purge: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043D\u0430\u0432\u0441\u0435\u0433\u0434\u0430",
    emptyTrash: "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u043A\u043E\u0440\u0437\u0438\u043D\u0443",
    cancel: "\u041E\u0442\u043C\u0435\u043D\u0430",
    confirm: "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C",
    trashQuestion: "\u041F\u0435\u0440\u0435\u043C\u0435\u0441\u0442\u0438\u0442\u044C \xAB{title}\xBB \u0438 \u0435\u0451 \u043F\u043E\u0434\u0437\u0430\u0434\u0430\u0447\u0438 \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443? \u0418\u0445 \u043C\u043E\u0436\u043D\u043E \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C.",
    purgeQuestion: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043D\u0430\u0432\u0441\u0435\u0433\u0434\u0430 \xAB{title}\xBB, \u0435\u0451 \u043F\u043E\u0434\u0437\u0430\u0434\u0430\u0447\u0438, \u0437\u0430\u043C\u0435\u0442\u043A\u0438 \u0438 \u0438\u0441\u0442\u043E\u0440\u0438\u044E? \u042D\u0442\u043E \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043D\u0435\u043B\u044C\u0437\u044F \u043E\u0442\u043C\u0435\u043D\u0438\u0442\u044C.",
    emptyTrashQuestion: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043D\u0430\u0432\u0441\u0435\u0433\u0434\u0430 \u0432\u0441\u0435 \u0437\u0430\u0434\u0430\u0447\u0438 \u0438\u0437 \u043A\u043E\u0440\u0437\u0438\u043D\u044B ({count})? \u042D\u0442\u043E \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043D\u0435\u043B\u044C\u0437\u044F \u043E\u0442\u043C\u0435\u043D\u0438\u0442\u044C.",
    emptyTrashHint: "\u0417\u0434\u0435\u0441\u044C \u043F\u043E\u044F\u0432\u044F\u0442\u0441\u044F \u0443\u0434\u0430\u043B\u0451\u043D\u043D\u044B\u0435 \u0437\u0430\u0434\u0430\u0447\u0438. \u0418\u0445 \u043C\u043E\u0436\u043D\u043E \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u0438\u043B\u0438 \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u043D\u0430\u0432\u0441\u0435\u0433\u0434\u0430.",
    archiveHint: "\u0417\u0434\u0435\u0441\u044C \u043F\u043E\u044F\u0432\u044F\u0442\u0441\u044F \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043D\u043D\u044B\u0435 \u0437\u0430\u0434\u0430\u0447\u0438 \u0438 \u043F\u043E\u0434\u0437\u0430\u0434\u0430\u0447\u0438.",
    cascadeHint: "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u0435 \u0437\u0430\u0434\u0430\u0447\u0438 \u0442\u0430\u043A\u0436\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u0442 \u0435\u0451 \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0435 \u043F\u043E\u0434\u0437\u0430\u0434\u0430\u0447\u0438.",
    restoreParent: "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0435 \u0440\u043E\u0434\u0438\u0442\u0435\u043B\u044C\u0441\u043A\u0443\u044E \u0437\u0430\u0434\u0430\u0447\u0443",
    reopenParent: "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0432\u0435\u0440\u043D\u0438\u0442\u0435 \u0440\u043E\u0434\u0438\u0442\u0435\u043B\u044C\u0441\u043A\u0443\u044E \u0437\u0430\u0434\u0430\u0447\u0443 \u0432 \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0435",
    staleNotice: "\u0417\u0430\u0434\u0430\u0447\u0430 \u0438\u0437\u043C\u0435\u043D\u0438\u043B\u0430\u0441\u044C \u0432 \u0434\u0440\u0443\u0433\u043E\u043C \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0435. \u041F\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u0444\u043E\u0440\u043C\u0443 \u043F\u0435\u0440\u0435\u0434 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435\u043C.",
    syncing: "\u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F\u2026",
    noTasks: "\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0445 \u0437\u0430\u0434\u0430\u0447",
    completedAt: "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E: {date}",
    trashCount: "\u041A\u043E\u0440\u0437\u0438\u043D\u0430 ({count})",
    languageName: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
    settings: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",
    autoLanguage: "\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438",
    languageHelp: "\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0432\u044B\u0431\u043E\u0440 \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u0435\u0442 \u044F\u0437\u044B\u043A Hermes, \u0437\u0430\u0442\u0435\u043C \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0430 \u0438\u043B\u0438 \u0441\u0438\u0441\u0442\u0435\u043C\u044B.",
    languageSourceManual: "\u0412\u044B\u0431\u0440\u0430\u043D\u043E \u0432 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0438",
    languageSourceHermes: "\u041A\u0430\u043A \u0432 Hermes",
    languageSourceBrowser: "\u041A\u0430\u043A \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435 \u0438\u043B\u0438 \u0441\u0438\u0441\u0442\u0435\u043C\u0435",
    languageSourceFallback: "\u042F\u0437\u044B\u043A \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E",
    connectionChanged: "\u0410\u043A\u0442\u0438\u0432\u043D\u043E\u0435 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 Hermes \u0438\u0437\u043C\u0435\u043D\u0438\u043B\u043E\u0441\u044C. \u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u043E\u043F\u044B\u0442\u043A\u0443.",
    errorNewerDatabase: "\u0411\u0430\u0437\u0430 \u0441\u043E\u0437\u0434\u0430\u043D\u0430 \u0431\u043E\u043B\u0435\u0435 \u043D\u043E\u0432\u043E\u0439 \u0432\u0435\u0440\u0441\u0438\u0435\u0439 \u043F\u043B\u0430\u0433\u0438\u043D\u0430",
    errorTaskId: "\u0423\u043A\u0430\u0436\u0438\u0442\u0435 ID \u0437\u0430\u0434\u0430\u0447\u0438",
    errorNotFound: "\u0417\u0430\u0434\u0430\u0447\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430",
    errorTooManySubtasks: "\u0417\u0430 \u043E\u0434\u0438\u043D \u0440\u0430\u0437 \u043C\u043E\u0436\u043D\u043E \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0434\u043E 100 \u043F\u043E\u0434\u0437\u0430\u0434\u0430\u0447",
    errorSubtaskDepth: "\u041F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u043E\u0434\u0438\u043D \u0443\u0440\u043E\u0432\u0435\u043D\u044C \u043F\u043E\u0434\u0437\u0430\u0434\u0430\u0447",
    errorSubtaskFields: "\u041F\u043E\u0434\u0437\u0430\u0434\u0430\u0447\u0430 \u043C\u043E\u0436\u0435\u0442 \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0438 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435",
    errorReopenParent: "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0432\u0435\u0440\u043D\u0438\u0442\u0435 \u0440\u043E\u0434\u0438\u0442\u0435\u043B\u044C\u0441\u043A\u0443\u044E \u0437\u0430\u0434\u0430\u0447\u0443 \u0432 \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0435",
    errorLifecycleSeparate: "\u041E\u0442\u043F\u0440\u0430\u0432\u044C\u0442\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u0441 \u043A\u043E\u0440\u0437\u0438\u043D\u043E\u0439 \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u043E \u043E\u0442 \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F",
    errorNoChanges: "\u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435, \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435, \u0433\u0430\u043B\u043E\u0447\u043A\u0443, \u0432\u0430\u0436\u043D\u043E\u0441\u0442\u044C \u0438\u043B\u0438 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439",
    errorEvidence: "\u041F\u0440\u0438 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u0438 Hermes \u0434\u043E\u043B\u0436\u0435\u043D \u0443\u043A\u0430\u0437\u0430\u0442\u044C, \u0447\u0442\u043E \u0441\u0434\u0435\u043B\u0430\u043D\u043E \u0438 \u0447\u0435\u043C \u044D\u0442\u043E \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u043E",
    errorRevision: "\u0417\u0430\u0434\u0430\u0447\u0430 \u0443\u0436\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0430. \u041E\u0431\u043D\u043E\u0432\u0438\u0442\u0435 \u0441\u043F\u0438\u0441\u043E\u043A \u0438 \u043F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435",
    errorRestoreFirst: "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0435 \u043F\u0443\u043D\u043A\u0442 \u0438\u0437 \u043A\u043E\u0440\u0437\u0438\u043D\u044B",
    errorLifecycleUnknown: "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u0441 \u043A\u043E\u0440\u0437\u0438\u043D\u043E\u0439",
    errorNotInTrash: "\u042D\u0442\u043E\u0442 \u043F\u0443\u043D\u043A\u0442 \u043D\u0435 \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0435",
    errorRestoreParent: "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0435 \u0440\u043E\u0434\u0438\u0442\u0435\u043B\u044C\u0441\u043A\u0443\u044E \u0437\u0430\u0434\u0430\u0447\u0443",
    errorPurgeConfirmation: "\u042F\u0432\u043D\u043E \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u043E\u043A\u043E\u043D\u0447\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0435",
    errorArgumentObject: "\u041E\u0436\u0438\u0434\u0430\u0435\u0442\u0441\u044F \u043E\u0431\u044A\u0435\u043A\u0442 \u0430\u0440\u0433\u0443\u043C\u0435\u043D\u0442\u043E\u0432",
    errorArgumentUnknown: "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u0430\u0440\u0433\u0443\u043C\u0435\u043D\u0442",
    errorReadRevision: "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u0439\u0442\u0435 \u0441\u043F\u0438\u0441\u043E\u043A \u0438 \u0443\u043A\u0430\u0436\u0438\u0442\u0435 \u0440\u0435\u0432\u0438\u0437\u0438\u044E \u0437\u0430\u0434\u0430\u0447\u0438",
    errorJsonContentType: "\u041E\u0436\u0438\u0434\u0430\u0435\u0442\u0441\u044F application/json",
    errorRequestSize: "\u041D\u0435\u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u044B\u0439 \u0440\u0430\u0437\u043C\u0435\u0440 \u0437\u0430\u043F\u0440\u043E\u0441\u0430",
    errorJsonObject: "\u041E\u0436\u0438\u0434\u0430\u0435\u0442\u0441\u044F \u043E\u0431\u044A\u0435\u043A\u0442 JSON",
    errorUnknownField: "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E\u0435 \u043F\u043E\u043B\u0435",
    errorRevisionRequired: "\u041F\u0435\u0440\u0435\u0434\u0430\u0439\u0442\u0435 revision \u0437\u0430\u0434\u0430\u0447\u0438",
    errorLocalAddress: "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u0430\u0434\u0440\u0435\u0441 127.0.0.1",
    errorAccessDenied: "\u041D\u0435\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u043A \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E\u043C\u0443 API",
    errorOrigin: "\u041D\u0435\u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u044B\u0439 \u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A \u0437\u0430\u043F\u0440\u043E\u0441\u0430",
    errorRouteNotFound: "\u041D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E",
    errorInvalidData: "\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u0437\u0430\u043F\u0440\u043E\u0441\u0430",
    errorSaveData: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435",
    errorTextType: "{field}: \u0442\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F \u0442\u0435\u043A\u0441\u0442",
    errorTextLength: "{field}: \u043E\u0442 {minimum} \u0434\u043E {maximum} \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
    errorBoolean: "{field}: \u0442\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F true \u0438\u043B\u0438 false",
    "field.title": "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435",
    "field.description": "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435",
    "field.subtask title": "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043F\u043E\u0434\u0437\u0430\u0434\u0430\u0447\u0438",
    "field.comment": "\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439",
    requiredField: "\u0417\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u0435 \u044D\u0442\u043E \u043F\u043E\u043B\u0435.",
    detailsWidth: "\u041D\u0430\u0447\u0430\u043B\u044C\u043D\u0430\u044F \u0448\u0438\u0440\u0438\u043D\u0430 \u043F\u0430\u043D\u0435\u043B\u0438",
    detailsWidthHelp: "\u0428\u0438\u0440\u0438\u043D\u0430 \u043F\u0430\u043D\u0435\u043B\u0438 \u043F\u0440\u0438 \u043E\u0442\u043A\u0440\u044B\u0442\u0438\u0438 \u043D\u0430 \u043A\u043E\u043C\u043F\u044C\u044E\u0442\u0435\u0440\u0435. \u041D\u0430 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0435 \u043F\u0430\u043D\u0435\u043B\u044C \u0437\u0430\u043D\u0438\u043C\u0430\u0435\u0442 \u0432\u0441\u044E \u0448\u0438\u0440\u0438\u043D\u0443."
  };

  // locales/es.json
  var es_default = {
    locale: "es-ES",
    language: "Idioma",
    heading: "Mis tareas",
    details: "Detalles de la tarea",
    resizePanels: "Ajustar el ancho de la lista y los detalles",
    expandTask: "Expandir: {title}",
    collapseTask: "Contraer: {title}",
    overallProgress: "Progreso general",
    newTask: "Nueva tarea",
    taskPlaceholder: "\xBFQu\xE9 hay que hacer?",
    search: "Buscar tareas",
    filters: "Filtros de tareas",
    starred: "Importantes",
    add: "A\xF1adir",
    addTask: "A\xF1adir tarea",
    refresh: "Actualizar",
    saveError: "No se pudieron guardar los cambios. Int\xE9ntalo de nuevo.",
    requestError: "No se pudo completar la solicitud. Int\xE9ntalo de nuevo.",
    reloadDraft: "Descartar borrador y recargar",
    reopenLabel: "Reabrir: ",
    completeLabel: "Completar: ",
    progress: "{done} de {total} completadas",
    noResults: "No se encontraron tareas",
    stepsProgress: "{done} de {total} pasos",
    unstar: "Quitar de importantes",
    star: "Marcar como importante",
    taskTitle: "T\xEDtulo de la tarea",
    taskDescription: "Descripci\xF3n de la tarea",
    description: "Descripci\xF3n",
    save: "Guardar",
    subtaskTitle: "T\xEDtulo de la subtarea",
    subtaskDescription: "Descripci\xF3n de la subtarea",
    you: "T\xFA",
    addStep: "A\xF1adir un paso\u2026",
    newSubtask: "Nueva subtarea",
    addSubtask: "A\xF1adir subtarea",
    notes: "Notas y resultados",
    notePlaceholder: "\xBFQu\xE9 has conseguido?",
    newComment: "Nuevo comentario",
    addNote: "A\xF1adir nota",
    close: "Cerrar",
    lastChanged: "\xDAltima actualizaci\xF3n: {actor} \xB7 {date}",
    active: "Activas",
    archive: "Archivo",
    trash: "Papelera",
    edit: "Editar",
    menu: "Acciones",
    moveTrash: "Mover a la papelera",
    restore: "Restaurar",
    purge: "Eliminar definitivamente",
    emptyTrash: "Vaciar papelera",
    cancel: "Cancelar",
    confirm: "Confirmar",
    trashQuestion: "\xBFMover \xAB{title}\xBB y sus subtareas a la papelera? Podr\xE1s restaurarlas despu\xE9s.",
    purgeQuestion: "\xBFEliminar definitivamente \xAB{title}\xBB, sus subtareas, notas e historial? Esta acci\xF3n no se puede deshacer.",
    emptyTrashQuestion: "\xBFEliminar definitivamente todos los grupos de la papelera ({count})? Esta acci\xF3n no se puede deshacer.",
    emptyTrashHint: "Las tareas eliminadas aparecen aqu\xED. Puedes restaurarlas o eliminarlas definitivamente.",
    archiveHint: "Los grupos de tareas completados aparecen aqu\xED.",
    cascadeHint: "Al completar esta tarea tambi\xE9n se completan sus subtareas activas.",
    restoreParent: "Primero restaura la tarea principal",
    reopenParent: "Primero reabre la tarea principal",
    staleNotice: "La tarea ha cambiado en otro lugar. Se conserva la revisi\xF3n original del borrador.",
    syncing: "Guardando\u2026",
    noTasks: "No hay tareas activas",
    completedAt: "Completada: {date}",
    trashCount: "Papelera ({count})",
    languageName: "Espa\xF1ol",
    settings: "Ajustes",
    autoLanguage: "Autom\xE1tico",
    languageHelp: "El modo autom\xE1tico usa el idioma de Hermes o, si no est\xE1 disponible, el del navegador o sistema.",
    languageSourceManual: "Elegido en esta aplicaci\xF3n",
    languageSourceHermes: "Seg\xFAn Hermes",
    languageSourceBrowser: "Seg\xFAn el navegador o sistema",
    languageSourceFallback: "Idioma predeterminado",
    connectionChanged: "La conexi\xF3n activa de Hermes ha cambiado. Int\xE9ntalo de nuevo.",
    errorNewerDatabase: "La base de datos se cre\xF3 con una versi\xF3n m\xE1s reciente del complemento",
    errorTaskId: "Se requiere el ID de la tarea",
    errorNotFound: "Tarea no encontrada",
    errorTooManySubtasks: "A\xF1ade como m\xE1ximo 100 subtareas a la vez",
    errorSubtaskDepth: "Solo se admite un nivel de subtareas",
    errorSubtaskFields: "Una subtarea solo puede contener un t\xEDtulo y una descripci\xF3n",
    errorReopenParent: "Primero reabre la tarea principal",
    errorLifecycleSeparate: "Env\xEDa la acci\xF3n de la papelera por separado de los cambios",
    errorNoChanges: "Indica un t\xEDtulo, una descripci\xF3n, el estado de finalizaci\xF3n, la importancia o un comentario",
    errorEvidence: "Hermes debe describir lo que se ha completado y las pruebas que lo confirman",
    errorRevision: "Esta tarea ha cambiado. Actualiza la lista e int\xE9ntalo de nuevo",
    errorRestoreFirst: "Primero restaura este elemento de la papelera",
    errorLifecycleUnknown: "Acci\xF3n de papelera desconocida",
    errorNotInTrash: "Este elemento no est\xE1 en la papelera",
    errorRestoreParent: "Primero restaura la tarea principal",
    errorPurgeConfirmation: "Confirma expl\xEDcitamente la eliminaci\xF3n definitiva",
    errorArgumentObject: "Se esperaba un objeto de argumentos",
    errorArgumentUnknown: "Argumento desconocido",
    errorReadRevision: "Primero consulta la lista e indica la revisi\xF3n de la tarea",
    errorJsonContentType: "Se esperaba application/json",
    errorRequestSize: "Tama\xF1o de solicitud no v\xE1lido",
    errorJsonObject: "Se esperaba un objeto JSON",
    errorUnknownField: "Campo desconocido",
    errorRevisionRequired: "Se requiere la revisi\xF3n de la tarea",
    errorLocalAddress: "Usa la direcci\xF3n 127.0.0.1",
    errorAccessDenied: "Acceso a la API local denegado",
    errorOrigin: "El origen de la solicitud no est\xE1 permitido",
    errorRouteNotFound: "No encontrado",
    errorInvalidData: "Datos de solicitud no v\xE1lidos",
    errorSaveData: "No se pudieron guardar los datos",
    errorTextType: "{field}: se esperaba texto",
    errorTextLength: "{field}: debe contener entre {minimum} y {maximum} caracteres",
    errorBoolean: "{field}: se esperaba true o false",
    "field.title": "t\xEDtulo",
    "field.description": "descripci\xF3n",
    "field.subtask title": "t\xEDtulo de la subtarea",
    "field.comment": "comentario",
    requiredField: "Rellena este campo.",
    detailsWidth: "Ancho inicial del panel",
    detailsWidthHelp: "Ancho del panel al abrirlo en el escritorio. En el m\xF3vil, ocupa todo el ancho."
  };

  // locales/pt-BR.json
  var pt_BR_default = {
    locale: "pt-BR",
    language: "Idioma",
    heading: "Minhas tarefas",
    details: "Detalhes da tarefa",
    resizePanels: "Ajustar a largura da lista e dos detalhes",
    expandTask: "Expandir: {title}",
    collapseTask: "Recolher: {title}",
    overallProgress: "Progresso geral",
    newTask: "Nova tarefa",
    taskPlaceholder: "O que precisa ser feito?",
    search: "Buscar tarefas",
    filters: "Filtros de tarefas",
    starred: "Importantes",
    add: "Adicionar",
    addTask: "Adicionar tarefa",
    refresh: "Atualizar",
    saveError: "N\xE3o foi poss\xEDvel salvar as altera\xE7\xF5es. Tente novamente.",
    requestError: "N\xE3o foi poss\xEDvel concluir a solicita\xE7\xE3o. Tente novamente.",
    reloadDraft: "Descartar rascunho e recarregar",
    reopenLabel: "Reabrir: ",
    completeLabel: "Concluir: ",
    progress: "{done} de {total} conclu\xEDdas",
    noResults: "Nenhuma tarefa encontrada",
    stepsProgress: "{done} de {total} etapas",
    unstar: "Remover das importantes",
    star: "Marcar como importante",
    taskTitle: "T\xEDtulo da tarefa",
    taskDescription: "Descri\xE7\xE3o da tarefa",
    description: "Descri\xE7\xE3o",
    save: "Salvar",
    subtaskTitle: "T\xEDtulo da subtarefa",
    subtaskDescription: "Descri\xE7\xE3o da subtarefa",
    you: "Voc\xEA",
    addStep: "Adicionar uma etapa\u2026",
    newSubtask: "Nova subtarefa",
    addSubtask: "Adicionar subtarefa",
    notes: "Notas e resultados",
    notePlaceholder: "O que voc\xEA realizou?",
    newComment: "Novo coment\xE1rio",
    addNote: "Adicionar nota",
    close: "Fechar",
    lastChanged: "\xDAltima atualiza\xE7\xE3o: {actor} \xB7 {date}",
    active: "Ativas",
    archive: "Arquivo",
    trash: "Lixeira",
    edit: "Editar",
    menu: "A\xE7\xF5es",
    moveTrash: "Mover para a lixeira",
    restore: "Restaurar",
    purge: "Excluir permanentemente",
    emptyTrash: "Esvaziar lixeira",
    cancel: "Cancelar",
    confirm: "Confirmar",
    trashQuestion: "Mover \xAB{title}\xBB e suas subtarefas para a lixeira? Voc\xEA poder\xE1 restaur\xE1-las depois.",
    purgeQuestion: "Excluir permanentemente \xAB{title}\xBB, suas subtarefas, notas e hist\xF3rico? Esta a\xE7\xE3o n\xE3o pode ser desfeita.",
    emptyTrashQuestion: "Excluir permanentemente todos os grupos da lixeira ({count})? Esta a\xE7\xE3o n\xE3o pode ser desfeita.",
    emptyTrashHint: "As tarefas exclu\xEDdas aparecem aqui. Voc\xEA pode restaur\xE1-las ou exclu\xED-las permanentemente.",
    archiveHint: "Os grupos de tarefas conclu\xEDdos aparecem aqui.",
    cascadeHint: "Concluir esta tarefa tamb\xE9m conclui suas subtarefas ativas.",
    restoreParent: "Restaure a tarefa principal primeiro",
    reopenParent: "Reabra a tarefa principal primeiro",
    staleNotice: "A tarefa foi alterada em outro lugar. A revis\xE3o original do rascunho foi mantida.",
    syncing: "Salvando\u2026",
    noTasks: "Nenhuma tarefa ativa",
    completedAt: "Conclu\xEDda: {date}",
    trashCount: "Lixeira ({count})",
    languageName: "Portugu\xEAs (Brasil)",
    settings: "Configura\xE7\xF5es",
    autoLanguage: "Autom\xE1tico",
    languageHelp: "O modo autom\xE1tico usa o idioma do Hermes ou, se indispon\xEDvel, o do navegador ou sistema.",
    languageSourceManual: "Selecionado neste aplicativo",
    languageSourceHermes: "Seguindo o Hermes",
    languageSourceBrowser: "Seguindo o navegador ou sistema",
    languageSourceFallback: "Idioma padr\xE3o",
    connectionChanged: "A conex\xE3o ativa do Hermes mudou. Tente novamente.",
    errorNewerDatabase: "O banco de dados foi criado por uma vers\xE3o mais recente do plugin",
    errorTaskId: "O ID da tarefa \xE9 obrigat\xF3rio",
    errorNotFound: "Tarefa n\xE3o encontrada",
    errorTooManySubtasks: "Adicione no m\xE1ximo 100 subtarefas por vez",
    errorSubtaskDepth: "Apenas um n\xEDvel de subtarefas \xE9 permitido",
    errorSubtaskFields: "Uma subtarefa pode conter apenas t\xEDtulo e descri\xE7\xE3o",
    errorReopenParent: "Reabra a tarefa principal primeiro",
    errorLifecycleSeparate: "Envie a a\xE7\xE3o da lixeira separadamente das altera\xE7\xF5es",
    errorNoChanges: "Informe t\xEDtulo, descri\xE7\xE3o, estado de conclus\xE3o, import\xE2ncia ou coment\xE1rio",
    errorEvidence: "O Hermes deve descrever o que foi conclu\xEDdo e as evid\xEAncias que comprovam isso",
    errorRevision: "Esta tarefa foi alterada. Atualize a lista e tente novamente",
    errorRestoreFirst: "Restaure este item da lixeira primeiro",
    errorLifecycleUnknown: "A\xE7\xE3o da lixeira desconhecida",
    errorNotInTrash: "Este item n\xE3o est\xE1 na lixeira",
    errorRestoreParent: "Restaure a tarefa principal primeiro",
    errorPurgeConfirmation: "Confirme explicitamente a exclus\xE3o permanente",
    errorArgumentObject: "Era esperado um objeto de argumentos",
    errorArgumentUnknown: "Argumento desconhecido",
    errorReadRevision: "Consulte a lista primeiro e informe a revis\xE3o da tarefa",
    errorJsonContentType: "Era esperado application/json",
    errorRequestSize: "Tamanho de solicita\xE7\xE3o inv\xE1lido",
    errorJsonObject: "Era esperado um objeto JSON",
    errorUnknownField: "Campo desconhecido",
    errorRevisionRequired: "A revis\xE3o da tarefa \xE9 obrigat\xF3ria",
    errorLocalAddress: "Use o endere\xE7o 127.0.0.1",
    errorAccessDenied: "Acesso \xE0 API local negado",
    errorOrigin: "A origem da solicita\xE7\xE3o n\xE3o \xE9 permitida",
    errorRouteNotFound: "N\xE3o encontrado",
    errorInvalidData: "Dados de solicita\xE7\xE3o inv\xE1lidos",
    errorSaveData: "N\xE3o foi poss\xEDvel salvar os dados",
    errorTextType: "{field}: era esperado texto",
    errorTextLength: "{field}: deve conter de {minimum} a {maximum} caracteres",
    errorBoolean: "{field}: era esperado true ou false",
    "field.title": "t\xEDtulo",
    "field.description": "descri\xE7\xE3o",
    "field.subtask title": "t\xEDtulo da subtarefa",
    "field.comment": "coment\xE1rio",
    requiredField: "Preencha este campo.",
    detailsWidth: "Largura inicial do painel",
    detailsWidthHelp: "Largura do painel ao abrir no computador. No celular, ocupa toda a largura."
  };

  // locales/de.json
  var de_default = {
    locale: "de-DE",
    language: "Sprache",
    heading: "Meine Aufgaben",
    details: "Aufgabendetails",
    resizePanels: "Breite von Liste und Details \xE4ndern",
    expandTask: "Aufklappen: {title}",
    collapseTask: "Zuklappen: {title}",
    overallProgress: "Gesamtfortschritt",
    newTask: "Neue Aufgabe",
    taskPlaceholder: "Was muss erledigt werden?",
    search: "Aufgaben durchsuchen",
    filters: "Aufgabenfilter",
    starred: "Wichtig",
    add: "Hinzuf\xFCgen",
    addTask: "Aufgabe hinzuf\xFCgen",
    refresh: "Aktualisieren",
    saveError: "Die \xC4nderungen konnten nicht gespeichert werden. Bitte erneut versuchen.",
    requestError: "Die Anfrage konnte nicht abgeschlossen werden. Bitte erneut versuchen.",
    reloadDraft: "Entwurf verwerfen und neu laden",
    reopenLabel: "Wieder \xF6ffnen: ",
    completeLabel: "Abschlie\xDFen: ",
    progress: "{done} von {total} abgeschlossen",
    noResults: "Keine Aufgaben gefunden",
    stepsProgress: "{done} von {total} Schritten",
    unstar: "Markierung als wichtig entfernen",
    star: "Als wichtig markieren",
    taskTitle: "Aufgabentitel",
    taskDescription: "Aufgabenbeschreibung",
    description: "Beschreibung",
    save: "Speichern",
    subtaskTitle: "Titel der Unteraufgabe",
    subtaskDescription: "Beschreibung der Unteraufgabe",
    you: "Du",
    addStep: "Schritt hinzuf\xFCgen\u2026",
    newSubtask: "Neue Unteraufgabe",
    addSubtask: "Unteraufgabe hinzuf\xFCgen",
    notes: "Notizen und Ergebnisse",
    notePlaceholder: "Was hast du erledigt?",
    newComment: "Neuer Kommentar",
    addNote: "Notiz hinzuf\xFCgen",
    close: "Schlie\xDFen",
    lastChanged: "Zuletzt aktualisiert: {actor} \xB7 {date}",
    active: "Aktiv",
    archive: "Archiv",
    trash: "Papierkorb",
    edit: "Bearbeiten",
    menu: "Aktionen",
    moveTrash: "In den Papierkorb",
    restore: "Wiederherstellen",
    purge: "Endg\xFCltig l\xF6schen",
    emptyTrash: "Papierkorb leeren",
    cancel: "Abbrechen",
    confirm: "Best\xE4tigen",
    trashQuestion: "\u201E{title}\u201C und die zugeh\xF6rigen Unteraufgaben in den Papierkorb verschieben? Du kannst sie sp\xE4ter wiederherstellen.",
    purgeQuestion: "\u201E{title}\u201C, die zugeh\xF6rigen Unteraufgaben, Notizen und den Verlauf endg\xFCltig l\xF6schen? Dies kann nicht r\xFCckg\xE4ngig gemacht werden.",
    emptyTrashQuestion: "Alle Gruppen im Papierkorb ({count}) endg\xFCltig l\xF6schen? Dies kann nicht r\xFCckg\xE4ngig gemacht werden.",
    emptyTrashHint: "Gel\xF6schte Aufgaben erscheinen hier. Du kannst sie wiederherstellen oder endg\xFCltig l\xF6schen.",
    archiveHint: "Abgeschlossene Aufgabengruppen erscheinen hier.",
    cascadeHint: "Beim Abschlie\xDFen dieser Aufgabe werden auch ihre aktiven Unteraufgaben abgeschlossen.",
    restoreParent: "Stelle zuerst die \xFCbergeordnete Aufgabe wieder her",
    reopenParent: "\xD6ffne zuerst die \xFCbergeordnete Aufgabe wieder",
    staleNotice: "Die Aufgabe wurde an anderer Stelle ge\xE4ndert. Der Entwurf beh\xE4lt seine urspr\xFCngliche Revision.",
    syncing: "Wird gespeichert\u2026",
    noTasks: "Keine aktiven Aufgaben",
    completedAt: "Abgeschlossen: {date}",
    trashCount: "Papierkorb ({count})",
    languageName: "Deutsch",
    settings: "Einstellungen",
    autoLanguage: "Automatisch",
    languageHelp: "Automatisch wird die Sprache von Hermes verwendet, sonst die des Browsers oder Systems.",
    languageSourceManual: "In dieser App ausgew\xE4hlt",
    languageSourceHermes: "Wie in Hermes",
    languageSourceBrowser: "Wie im Browser oder System",
    languageSourceFallback: "Standardsprache",
    connectionChanged: "Die aktive Hermes-Verbindung hat sich ge\xE4ndert. Bitte erneut versuchen.",
    errorNewerDatabase: "Die Datenbank wurde mit einer neueren Plugin-Version erstellt",
    errorTaskId: "Eine Aufgaben-ID ist erforderlich",
    errorNotFound: "Aufgabe nicht gefunden",
    errorTooManySubtasks: "F\xFCge h\xF6chstens 100 Unteraufgaben auf einmal hinzu",
    errorSubtaskDepth: "Es wird nur eine Ebene von Unteraufgaben unterst\xFCtzt",
    errorSubtaskFields: "Eine Unteraufgabe darf nur einen Titel und eine Beschreibung enthalten",
    errorReopenParent: "\xD6ffne zuerst die \xFCbergeordnete Aufgabe wieder",
    errorLifecycleSeparate: "Sende die Papierkorb-Aktion getrennt von Bearbeitungen",
    errorNoChanges: "Gib einen Titel, eine Beschreibung, den Abschlussstatus, die Wichtigkeit oder einen Kommentar an",
    errorEvidence: "Hermes muss beschreiben, was erledigt wurde und welche Nachweise dies belegen",
    errorRevision: "Diese Aufgabe wurde ge\xE4ndert. Aktualisiere die Liste und versuche es erneut",
    errorRestoreFirst: "Stelle diesen Eintrag zuerst aus dem Papierkorb wieder her",
    errorLifecycleUnknown: "Unbekannte Papierkorb-Aktion",
    errorNotInTrash: "Dieser Eintrag befindet sich nicht im Papierkorb",
    errorRestoreParent: "Stelle zuerst die \xFCbergeordnete Aufgabe wieder her",
    errorPurgeConfirmation: "Best\xE4tige das endg\xFCltige L\xF6schen ausdr\xFCcklich",
    errorArgumentObject: "Ein Argumentobjekt wurde erwartet",
    errorArgumentUnknown: "Unbekanntes Argument",
    errorReadRevision: "Lies zuerst die Liste und gib die Revision der Aufgabe an",
    errorJsonContentType: "application/json wurde erwartet",
    errorRequestSize: "Ung\xFCltige Anfragegr\xF6\xDFe",
    errorJsonObject: "Ein JSON-Objekt wurde erwartet",
    errorUnknownField: "Unbekanntes Feld",
    errorRevisionRequired: "Die Revision der Aufgabe ist erforderlich",
    errorLocalAddress: "Verwende die Adresse 127.0.0.1",
    errorAccessDenied: "Zugriff auf die lokale API verweigert",
    errorOrigin: "Die Herkunft der Anfrage ist nicht zul\xE4ssig",
    errorRouteNotFound: "Nicht gefunden",
    errorInvalidData: "Ung\xFCltige Anfragedaten",
    errorSaveData: "Daten konnten nicht gespeichert werden",
    errorTextType: "{field}: Text erwartet",
    errorTextLength: "{field}: muss {minimum} bis {maximum} Zeichen enthalten",
    errorBoolean: "{field}: true oder false erwartet",
    "field.title": "Titel",
    "field.description": "Beschreibung",
    "field.subtask title": "Titel der Unteraufgabe",
    "field.comment": "Kommentar",
    requiredField: "F\xFClle dieses Feld aus.",
    detailsWidth: "Standardbreite des Detailbereichs",
    detailsWidthHelp: "Breite beim \xD6ffnen auf dem Desktop. Auf dem Smartphone wird die volle Breite genutzt."
  };

  // locales/fr.json
  var fr_default = {
    locale: "fr-FR",
    language: "Langue",
    heading: "Mes t\xE2ches",
    details: "D\xE9tails de la t\xE2che",
    resizePanels: "Redimensionner la liste et les d\xE9tails",
    expandTask: "D\xE9velopper : {title}",
    collapseTask: "R\xE9duire : {title}",
    overallProgress: "Progression globale",
    newTask: "Nouvelle t\xE2che",
    taskPlaceholder: "Que faut-il faire ?",
    search: "Rechercher des t\xE2ches",
    filters: "Filtres des t\xE2ches",
    starred: "Importantes",
    add: "Ajouter",
    addTask: "Ajouter une t\xE2che",
    refresh: "Actualiser",
    saveError: "Impossible d\u2019enregistrer les modifications. R\xE9essayez.",
    requestError: "Impossible de traiter la demande. R\xE9essayez.",
    reloadDraft: "Abandonner le brouillon et recharger",
    reopenLabel: "Rouvrir : ",
    completeLabel: "Terminer : ",
    progress: "{done} sur {total} termin\xE9es",
    noResults: "Aucune t\xE2che trouv\xE9e",
    stepsProgress: "{done} \xE9tapes sur {total}",
    unstar: "Retirer des t\xE2ches importantes",
    star: "Marquer comme importante",
    taskTitle: "Titre de la t\xE2che",
    taskDescription: "Description de la t\xE2che",
    description: "Description",
    save: "Enregistrer",
    subtaskTitle: "Titre de la sous-t\xE2che",
    subtaskDescription: "Description de la sous-t\xE2che",
    you: "Vous",
    addStep: "Ajouter une \xE9tape\u2026",
    newSubtask: "Nouvelle sous-t\xE2che",
    addSubtask: "Ajouter une sous-t\xE2che",
    notes: "Notes et r\xE9sultats",
    notePlaceholder: "Qu\u2019avez-vous accompli ?",
    newComment: "Nouveau commentaire",
    addNote: "Ajouter une note",
    close: "Fermer",
    lastChanged: "Derni\xE8re modification : {actor} \xB7 {date}",
    active: "Actives",
    archive: "Archives",
    trash: "Corbeille",
    edit: "Modifier",
    menu: "Actions",
    moveTrash: "Mettre \xE0 la corbeille",
    restore: "Restaurer",
    purge: "Supprimer d\xE9finitivement",
    emptyTrash: "Vider la corbeille",
    cancel: "Annuler",
    confirm: "Confirmer",
    trashQuestion: "Mettre \xAB {title} \xBB et ses sous-t\xE2ches \xE0 la corbeille ? Vous pourrez les restaurer plus tard.",
    purgeQuestion: "Supprimer d\xE9finitivement \xAB {title} \xBB, ses sous-t\xE2ches, ses notes et son historique ? Cette action est irr\xE9versible.",
    emptyTrashQuestion: "Supprimer d\xE9finitivement tous les groupes de la corbeille ({count}) ? Cette action est irr\xE9versible.",
    emptyTrashHint: "Les t\xE2ches supprim\xE9es apparaissent ici. Vous pouvez les restaurer ou les supprimer d\xE9finitivement.",
    archiveHint: "Les groupes de t\xE2ches termin\xE9s apparaissent ici.",
    cascadeHint: "Terminer cette t\xE2che termine aussi ses sous-t\xE2ches actives.",
    restoreParent: "Restaurez d\u2019abord la t\xE2che principale",
    reopenParent: "Rouvrez d\u2019abord la t\xE2che principale",
    staleNotice: "La t\xE2che a \xE9t\xE9 modifi\xE9e ailleurs. Le brouillon conserve sa r\xE9vision d\u2019origine.",
    syncing: "Enregistrement\u2026",
    noTasks: "Aucune t\xE2che active",
    completedAt: "Termin\xE9e : {date}",
    trashCount: "Corbeille ({count})",
    languageName: "Fran\xE7ais",
    settings: "Param\xE8tres",
    autoLanguage: "Automatique",
    languageHelp: "Le mode automatique utilise la langue de Hermes, sinon celle du navigateur ou du syst\xE8me.",
    languageSourceManual: "Choisie dans cette application",
    languageSourceHermes: "Selon Hermes",
    languageSourceBrowser: "Selon le navigateur ou le syst\xE8me",
    languageSourceFallback: "Langue par d\xE9faut",
    connectionChanged: "La connexion active de Hermes a chang\xE9. R\xE9essayez.",
    errorNewerDatabase: "La base de donn\xE9es a \xE9t\xE9 cr\xE9\xE9e par une version plus r\xE9cente du plugin",
    errorTaskId: "L\u2019ID de la t\xE2che est requis",
    errorNotFound: "T\xE2che introuvable",
    errorTooManySubtasks: "Ajoutez au maximum 100 sous-t\xE2ches \xE0 la fois",
    errorSubtaskDepth: "Un seul niveau de sous-t\xE2ches est pris en charge",
    errorSubtaskFields: "Une sous-t\xE2che ne peut contenir qu\u2019un titre et une description",
    errorReopenParent: "Rouvrez d\u2019abord la t\xE2che principale",
    errorLifecycleSeparate: "Envoyez l\u2019action li\xE9e \xE0 la corbeille s\xE9par\xE9ment des modifications",
    errorNoChanges: "Indiquez un titre, une description, un \xE9tat d\u2019ach\xE8vement, une importance ou un commentaire",
    errorEvidence: "Hermes doit d\xE9crire ce qui a \xE9t\xE9 accompli et les \xE9l\xE9ments qui le confirment",
    errorRevision: "Cette t\xE2che a \xE9t\xE9 modifi\xE9e. Actualisez la liste et r\xE9essayez",
    errorRestoreFirst: "Restaurez d\u2019abord cet \xE9l\xE9ment depuis la corbeille",
    errorLifecycleUnknown: "Action li\xE9e \xE0 la corbeille inconnue",
    errorNotInTrash: "Cet \xE9l\xE9ment n\u2019est pas dans la corbeille",
    errorRestoreParent: "Restaurez d\u2019abord la t\xE2che principale",
    errorPurgeConfirmation: "Confirmez explicitement la suppression d\xE9finitive",
    errorArgumentObject: "Un objet d\u2019arguments est attendu",
    errorArgumentUnknown: "Argument inconnu",
    errorReadRevision: "Consultez d\u2019abord la liste et indiquez la r\xE9vision de la t\xE2che",
    errorJsonContentType: "Le type application/json est attendu",
    errorRequestSize: "Taille de la demande non valide",
    errorJsonObject: "Un objet JSON est attendu",
    errorUnknownField: "Champ inconnu",
    errorRevisionRequired: "La r\xE9vision de la t\xE2che est requise",
    errorLocalAddress: "Utilisez l\u2019adresse 127.0.0.1",
    errorAccessDenied: "Acc\xE8s \xE0 l\u2019API locale refus\xE9",
    errorOrigin: "L\u2019origine de la demande n\u2019est pas autoris\xE9e",
    errorRouteNotFound: "Introuvable",
    errorInvalidData: "Donn\xE9es de la demande non valides",
    errorSaveData: "Impossible d\u2019enregistrer les donn\xE9es",
    errorTextType: "{field} : du texte est attendu",
    errorTextLength: "{field} : doit contenir de {minimum} \xE0 {maximum} caract\xE8res",
    errorBoolean: "{field} : true ou false est attendu",
    "field.title": "titre",
    "field.description": "description",
    "field.subtask title": "titre de la sous-t\xE2che",
    "field.comment": "commentaire",
    requiredField: "Renseignez ce champ.",
    detailsWidth: "Largeur initiale du panneau",
    detailsWidthHelp: "Largeur \xE0 l\u2019ouverture sur ordinateur. Sur mobile, le panneau occupe toute la largeur."
  };

  // locales/pl.json
  var pl_default = {
    locale: "pl-PL",
    language: "J\u0119zyk",
    heading: "Moje zadania",
    details: "Szczeg\xF3\u0142y zadania",
    resizePanels: "Zmie\u0144 szeroko\u015B\u0107 listy i szczeg\xF3\u0142\xF3w",
    expandTask: "Rozwi\u0144: {title}",
    collapseTask: "Zwi\u0144: {title}",
    overallProgress: "Og\xF3lny post\u0119p",
    newTask: "Nowe zadanie",
    taskPlaceholder: "Co trzeba zrobi\u0107?",
    search: "Szukaj zada\u0144",
    filters: "Filtry zada\u0144",
    starred: "Wa\u017Cne",
    add: "Dodaj",
    addTask: "Dodaj zadanie",
    refresh: "Od\u015Bwie\u017C",
    saveError: "Nie uda\u0142o si\u0119 zapisa\u0107 zmian. Spr\xF3buj ponownie.",
    requestError: "Nie uda\u0142o si\u0119 wykona\u0107 \u017C\u0105dania. Spr\xF3buj ponownie.",
    reloadDraft: "Odrzu\u0107 wersj\u0119 robocz\u0105 i wczytaj ponownie",
    reopenLabel: "Otw\xF3rz ponownie: ",
    completeLabel: "Uko\u0144cz: ",
    progress: "Uko\u0144czono: {done} z {total}",
    noResults: "Nie znaleziono zada\u0144",
    stepsProgress: "Kroki: {done} z {total}",
    unstar: "Usu\u0144 z wa\u017Cnych",
    star: "Oznacz jako wa\u017Cne",
    taskTitle: "Tytu\u0142 zadania",
    taskDescription: "Opis zadania",
    description: "Opis",
    save: "Zapisz",
    subtaskTitle: "Tytu\u0142 podzadania",
    subtaskDescription: "Opis podzadania",
    you: "Ty",
    addStep: "Dodaj krok\u2026",
    newSubtask: "Nowe podzadanie",
    addSubtask: "Dodaj podzadanie",
    notes: "Notatki i wyniki",
    notePlaceholder: "Co uda\u0142o si\u0119 zrobi\u0107?",
    newComment: "Nowy komentarz",
    addNote: "Dodaj notatk\u0119",
    close: "Zamknij",
    lastChanged: "Ostatnia zmiana: {actor} \xB7 {date}",
    active: "Aktywne",
    archive: "Archiwum",
    trash: "Kosz",
    edit: "Edytuj",
    menu: "Dzia\u0142ania",
    moveTrash: "Przenie\u015B do kosza",
    restore: "Przywr\xF3\u0107",
    purge: "Usu\u0144 trwale",
    emptyTrash: "Opr\xF3\u017Cnij kosz",
    cancel: "Anuluj",
    confirm: "Potwierd\u017A",
    trashQuestion: "Przenie\u015B\u0107 \u201E{title}\u201D i jego podzadania do kosza? Mo\u017Cesz je p\xF3\u017Aniej przywr\xF3ci\u0107.",
    purgeQuestion: "Trwale usun\u0105\u0107 \u201E{title}\u201D, jego podzadania, notatki i histori\u0119? Tej operacji nie mo\u017Cna cofn\u0105\u0107.",
    emptyTrashQuestion: "Trwale usun\u0105\u0107 wszystkie grupy z kosza ({count})? Tej operacji nie mo\u017Cna cofn\u0105\u0107.",
    emptyTrashHint: "Tutaj pojawiaj\u0105 si\u0119 usuni\u0119te zadania. Mo\u017Cesz je przywr\xF3ci\u0107 lub trwale usun\u0105\u0107.",
    archiveHint: "Tutaj pojawiaj\u0105 si\u0119 uko\u0144czone grupy zada\u0144.",
    cascadeHint: "Uko\u0144czenie tego zadania ko\u0144czy tak\u017Ce jego aktywne podzadania.",
    restoreParent: "Najpierw przywr\xF3\u0107 zadanie nadrz\u0119dne",
    reopenParent: "Najpierw otw\xF3rz ponownie zadanie nadrz\u0119dne",
    staleNotice: "Zadanie zmieniono w innym miejscu. Wersja robocza zachowuje pierwotn\u0105 rewizj\u0119.",
    syncing: "Zapisywanie\u2026",
    noTasks: "Brak aktywnych zada\u0144",
    completedAt: "Uko\u0144czono: {date}",
    trashCount: "Kosz ({count})",
    languageName: "Polski",
    settings: "Ustawienia",
    autoLanguage: "Automatycznie",
    languageHelp: "Tryb automatyczny u\u017Cywa j\u0119zyka Hermes, a gdy jest niedost\u0119pny \u2014 j\u0119zyka przegl\u0105darki lub systemu.",
    languageSourceManual: "Wybrany w tej aplikacji",
    languageSourceHermes: "Zgodnie z Hermes",
    languageSourceBrowser: "Zgodnie z przegl\u0105dark\u0105 lub systemem",
    languageSourceFallback: "J\u0119zyk domy\u015Blny",
    connectionChanged: "Aktywne po\u0142\u0105czenie Hermes uleg\u0142o zmianie. Spr\xF3buj ponownie.",
    errorNewerDatabase: "Baza danych zosta\u0142a utworzona przez nowsz\u0105 wersj\u0119 wtyczki",
    errorTaskId: "Wymagany jest ID zadania",
    errorNotFound: "Nie znaleziono zadania",
    errorTooManySubtasks: "Mo\u017Cna doda\u0107 najwy\u017Cej 100 podzada\u0144 naraz",
    errorSubtaskDepth: "Obs\u0142ugiwany jest tylko jeden poziom podzada\u0144",
    errorSubtaskFields: "Podzadanie mo\u017Ce zawiera\u0107 tylko tytu\u0142 i opis",
    errorReopenParent: "Najpierw otw\xF3rz ponownie zadanie nadrz\u0119dne",
    errorLifecycleSeparate: "Wy\u015Blij dzia\u0142anie dotycz\u0105ce kosza oddzielnie od zmian",
    errorNoChanges: "Podaj tytu\u0142, opis, stan uko\u0144czenia, wa\u017Cno\u015B\u0107 lub komentarz",
    errorEvidence: "Hermes musi opisa\u0107 wykonane dzia\u0142ania i dowody ich uko\u0144czenia",
    errorRevision: "To zadanie zosta\u0142o zmienione. Od\u015Bwie\u017C list\u0119 i spr\xF3buj ponownie",
    errorRestoreFirst: "Najpierw przywr\xF3\u0107 ten element z kosza",
    errorLifecycleUnknown: "Nieznane dzia\u0142anie dotycz\u0105ce kosza",
    errorNotInTrash: "Tego elementu nie ma w koszu",
    errorRestoreParent: "Najpierw przywr\xF3\u0107 zadanie nadrz\u0119dne",
    errorPurgeConfirmation: "Wyra\u017Anie potwierd\u017A trwa\u0142e usuni\u0119cie",
    errorArgumentObject: "Oczekiwano obiektu argument\xF3w",
    errorArgumentUnknown: "Nieznany argument",
    errorReadRevision: "Najpierw odczytaj list\u0119 i podaj rewizj\u0119 zadania",
    errorJsonContentType: "Oczekiwano application/json",
    errorRequestSize: "Nieprawid\u0142owy rozmiar \u017C\u0105dania",
    errorJsonObject: "Oczekiwano obiektu JSON",
    errorUnknownField: "Nieznane pole",
    errorRevisionRequired: "Wymagana jest rewizja zadania",
    errorLocalAddress: "U\u017Cyj adresu 127.0.0.1",
    errorAccessDenied: "Odmowa dost\u0119pu do lokalnego API",
    errorOrigin: "Niedozwolone \u017Ar\xF3d\u0142o \u017C\u0105dania",
    errorRouteNotFound: "Nie znaleziono",
    errorInvalidData: "Nieprawid\u0142owe dane \u017C\u0105dania",
    errorSaveData: "Nie uda\u0142o si\u0119 zapisa\u0107 danych",
    errorTextType: "{field}: oczekiwano tekstu",
    errorTextLength: "{field}: musi zawiera\u0107 od {minimum} do {maximum} znak\xF3w",
    errorBoolean: "{field}: oczekiwano true lub false",
    "field.title": "tytu\u0142",
    "field.description": "opis",
    "field.subtask title": "tytu\u0142 podzadania",
    "field.comment": "komentarz",
    requiredField: "Wype\u0142nij to pole.",
    detailsWidth: "Pocz\u0105tkowa szeroko\u015B\u0107 panelu",
    detailsWidthHelp: "Szeroko\u015B\u0107 panelu po otwarciu na komputerze. Na telefonie panel zajmuje ca\u0142\u0105 szeroko\u015B\u0107."
  };

  // frontend/src/i18n.mjs
  var translations = { en: en_default, ru: ru_default, es: es_default, "pt-BR": pt_BR_default, de: de_default, fr: fr_default, pl: pl_default };
  var supportedLanguages = Object.entries(translations).map(([code, catalog]) => ({ code, name: catalog.languageName }));
  var LANGUAGE_KEY = "ptm.language";
  function normalizeLanguage(value) {
    if (typeof value !== "string") return null;
    const tag = value.split(",")[0].split(";")[0].trim().replaceAll("_", "-").toLowerCase();
    const exact = supportedLanguages.find((item) => item.code.toLowerCase() === tag);
    if (exact) return exact.code;
    const base = tag.split("-")[0];
    if (base === "pt") return "pt-BR";
    return Object.hasOwn(translations, base) ? base : null;
  }
  function browserLanguages() {
    const nav = globalThis.window?.navigator || globalThis.navigator;
    return nav?.languages?.length ? [...nav.languages] : nav?.language ? [nav.language] : [];
  }
  function languageStorage() {
    try {
      return globalThis.localStorage || globalThis.window?.localStorage;
    } catch {
      return void 0;
    }
  }
  function languagePreference(storage = languageStorage()) {
    try {
      return normalizeLanguage(storage?.getItem(LANGUAGE_KEY));
    } catch {
      return null;
    }
  }
  function resolveLanguage({ manual, hermes, browser = browserLanguages() } = {}) {
    const selected = normalizeLanguage(manual);
    if (selected) return { language: selected, source: "Manual" };
    if (typeof hermes === "string" && hermes.trim() && hermes.toLowerCase() !== "auto") {
      const inherited = normalizeLanguage(hermes);
      return { language: inherited || "en", source: inherited ? "Hermes" : "Fallback" };
    }
    for (const candidate of Array.isArray(browser) ? browser : [browser]) {
      const inherited = normalizeLanguage(candidate);
      if (inherited) return { language: inherited, source: "Browser" };
    }
    return { language: "en", source: "Fallback" };
  }
  function savedLanguage() {
    return resolveLanguage({ manual: languagePreference() }).language;
  }
  function localeFor(language) {
    return translations[normalizeLanguage(language) || "en"].locale;
  }
  function formatNumber(language, value) {
    return new Intl.NumberFormat(localeFor(language)).format(value);
  }
  function formatDateTime(language, stamp) {
    const date = new Date(stamp);
    return Number.isNaN(date.valueOf()) ? "\u2014" : new Intl.DateTimeFormat(localeFor(language), { dateStyle: "medium", timeStyle: "short" }).format(date);
  }
  function translate(language, key, values = {}) {
    const code = normalizeLanguage(language) || "en", catalog = translations[code];
    const message = Object.hasOwn(catalog, key) && catalog[key] || Object.hasOwn(en_default, key) && en_default[key] || key;
    return message.replace(/\{(\w+)\}/g, (_, name) => {
      const value = values[name];
      if (value === void 0) return `{${name}}`;
      if (name === "field") return catalog[`field.${value}`] || en_default[`field.${value}`] || String(value);
      return typeof value === "number" ? formatNumber(code, value) : String(value);
    });
  }
  var LocalizedError = class extends Error {
    constructor(key, values = {}) {
      super(translate("en", key, values));
      this.key = key;
      this.values = values;
    }
  };
  var escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  var errorPatterns = Object.values(translations).flatMap((catalog) => Object.entries(catalog).filter(([key]) => key.startsWith("error") || ["connectionChanged", "requestError", "saveError"].includes(key)).map(([key, message]) => {
    const names = [];
    const pattern = message.split(/(\{\w+\})/).map((part) => {
      if (/^\{\w+\}$/.test(part)) {
        names.push(part.slice(1, -1));
        return "(.+?)";
      }
      return escape(part);
    }).join("");
    return { key, names, pattern: new RegExp(`^${pattern}$`), catalog };
  }));
  function describeError(error, fallback = "requestError") {
    if (error instanceof LocalizedError && Object.hasOwn(en_default, error.key)) return { key: error.key, values: error.values };
    for (const entry of errorPatterns) {
      const match = entry.pattern.exec(error?.message || "");
      if (!match) continue;
      const values = {};
      entry.names.forEach((name, index) => {
        const value = match[index + 1];
        if (name === "field") values[name] = Object.keys(entry.catalog).find((key) => key.startsWith("field.") && entry.catalog[key] === value)?.slice(6) || value;
        else if (["minimum", "maximum", "count"].includes(name)) values[name] = Number(value.replace(/[,\.\s\u00a0\u202f]/g, ""));
        else values[name] = value;
      });
      return { key: entry.key, values };
    }
    return { key: fallback, values: {} };
  }

  // frontend/src/state.mjs
  var empty = () => ({ tasks: [], trash: [], comments: [], events: [], progress: { total: 0, done: 0, percent: 0 } });
  function createController({ transport, scope = "default", storage, hermesLanguage, browserLanguages: browserLanguages2 = browserLanguages() } = {}) {
    if (storage === void 0) storage = languageStorage();
    const listeners = /* @__PURE__ */ new Set();
    const key = `ptm.view:${scope}`;
    let prefs = {};
    try {
      const parsed = JSON.parse(storage?.getItem(key) || "{}");
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) prefs = parsed;
    } catch {
    }
    let manualLanguage = languagePreference(storage);
    let inheritedLanguage = hermesLanguage, machineLanguages = browserLanguages2;
    const initialLanguage = resolveLanguage({ manual: manualLanguage, hermes: inheritedLanguage, browser: machineLanguages });
    let state = {
      data: empty(),
      language: initialLanguage.language,
      languagePreference: manualLanguage || "auto",
      languageSource: initialLanguage.source,
      detailsWidth: Number.isInteger(prefs.detailsWidth) && prefs.detailsWidth >= 30 && prefs.detailsWidth <= 70 ? prefs.detailsWidth : 50,
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
      errorDetail: null,
      confirmation: null
    };
    let sequence = 0, generation = 0, disposed = false;
    const emit = (patch2) => {
      if (disposed) return;
      state = { ...state, ...patch2 };
      for (const listener of listeners) listener();
    };
    const t = (name, values) => translate(state.language, name, values);
    const report = (error, fallback = "requestError") => {
      const detail = describeError(error, fallback);
      emit({ error: t(detail.key, detail.values), errorDetail: detail });
    };
    function applyLanguage() {
      const next = resolveLanguage({ manual: manualLanguage, hermes: inheritedLanguage, browser: machineLanguages });
      if (next.language === state.language && next.source === state.languageSource && (manualLanguage || "auto") === state.languagePreference) return;
      emit({
        language: next.language,
        languagePreference: manualLanguage || "auto",
        languageSource: next.source,
        ...state.errorDetail ? { error: translate(next.language, state.errorDetail.key, state.errorDetail.values) } : {}
      });
    }
    const request = (path, options = {}) => transport(path, { ...options, language: state.language });
    function persist() {
      try {
        storage?.setItem(key, JSON.stringify({ expanded: [...state.expanded], detailsWidth: state.detailsWidth }));
      } catch {
      }
    }
    async function refresh(internal = false) {
      if (disposed || state.pending && !internal) return;
      const id = ++sequence, epoch = generation;
      try {
        const next = await request("/tasks");
        if (disposed || id !== sequence || epoch !== generation) return;
        emit({ data: { ...empty(), ...next }, loaded: true, error: "", errorDetail: null });
      } catch (error) {
        if (!disposed && id === sequence && epoch === generation) report(error);
      }
    }
    async function mutate(action, optimistic) {
      if (state.pending || disposed) return null;
      const epoch = ++generation, previous = state.data;
      emit({ pending: true, error: "", errorDetail: null, ...optimistic ? { data: optimistic(previous) } : {} });
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
          if (!disposed && epoch === generation) report(error, "saveError");
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
      detailsWidth(value) {
        const width = Number(value);
        if (!Number.isInteger(width) || width < 30 || width > 70) return;
        emit({ detailsWidth: width });
        persist();
      },
      language(language) {
        if (language !== "auto" && !normalizeLanguage(language)) return;
        manualLanguage = language === "auto" ? null : normalizeLanguage(language);
        try {
          storage?.setItem(LANGUAGE_KEY, manualLanguage || "auto");
        } catch {
        }
        applyLanguage();
      },
      inheritLanguage(language, browser = browserLanguages()) {
        inheritedLanguage = language;
        machineLanguages = browser;
        applyLanguage();
      },
      syncLanguagePreference() {
        try {
          if (storage?.getItem) {
            manualLanguage = normalizeLanguage(storage.getItem(LANGUAGE_KEY));
            applyLanguage();
          }
        } catch {
        }
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
  var formValidation = (t) => ({
    onInvalid: (event) => event.target.setCustomValidity?.(t(event.target.validity?.valueMissing ? "requiredField" : "errorInvalidData")),
    onInputCapture: (event) => event.target.setCustomValidity?.("")
  });
  function createTasksView(React, kit = {}) {
    const h = React.createElement;
    const Input = kit.Input || "input", Textarea = kit.Textarea || "textarea";
    const Button = ({ className, ...props }) => h(kit.Button || "button", {
      ...props,
      className: ["ptm-control", !kit.Button && "ptm-button", className].filter(Boolean).join(" ") || void 0
    });
    const act = (label, onClick, props = {}) => h(Button, { type: "button", onClick, ...props }, label);
    const icon = (name, glyph) => h("span", { className: `ptm-icon ptm-icon-${name}`, "aria-hidden": true }, glyph);
    const withIcon = (name, label) => h("span", { className: "ptm-icon-label" }, icon(name, name === "plus" ? "+" : void 0), label);
    function Confirmation({ state, controller, t }) {
      const ref = React.useRef(null), previous = React.useRef(null);
      React.useEffect(() => {
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
      const panel = React.useRef(null);
      React.useEffect(() => {
        panel.current?.focus();
      }, [task.id]);
      const close = () => {
        const widget = panel.current?.closest(".ptm");
        controller.set({ editing: null });
        queueMicrotask(() => [...widget?.querySelectorAll("[data-task-id]") || []].find((row) => row.dataset.taskId === task.id)?.querySelector(".ptm-task-title")?.focus());
      };
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
      const date = (stamp) => formatDateTime(state.language, stamp);
      const notes = state.data.comments.filter((note) => note.task_id === task.id);
      const event = state.data.events.filter((item) => item.task_id === task.id).at(-1);
      return h(
        "section",
        {
          ref: panel,
          className: "ptm-editor",
          tabIndex: -1,
          "aria-label": t("details"),
          onKeyDown: (event2) => {
            if (event2.key === "Escape") {
              event2.stopPropagation();
              close();
            }
          }
        },
        h(
          "div",
          { className: "ptm-editor-header" },
          h("strong", {}, t("details")),
          act(icon("close"), close, { className: "ptm-close", "aria-label": t("close"), title: t("close") })
        ),
        h(
          "form",
          { ...formValidation(t), className: "ptm-edit", onSubmit: submit("edit") },
          h("label", {}, t(task.parent_id ? "subtaskTitle" : "taskTitle"), h(Textarea, {
            rows: 2,
            className: "ptm-title-input",
            value: input("edit", "title", task.title),
            maxLength: 300,
            required: true,
            "data-draft-key": prefix + "title",
            "aria-label": t(task.parent_id ? "subtaskTitle" : "taskTitle"),
            onChange: change("edit", "title")
          })),
          h("label", {}, t("description"), h(Textarea, {
            value: input("edit", "description", task.description),
            rows: 6,
            maxLength: 2e4,
            "data-draft-key": prefix + "description",
            "aria-label": t(task.parent_id ? "subtaskDescription" : "taskDescription"),
            onChange: change("edit", "description")
          })),
          warning("edit"),
          h(Button, { type: "submit", className: "ptm-primary", disabled: state.pending || !dirty("edit") }, t("save"))
        ),
        !task.parent_id && !task.done && h(
          "form",
          { ...formValidation(t), className: "ptm-subtask-add", onSubmit: submit("child") },
          h(Input, {
            value: input("child", "title", ""),
            "data-draft-key": "new-subtask",
            placeholder: t("addStep"),
            "aria-label": t("newSubtask"),
            required: true,
            maxLength: 300,
            onChange: change("child", "title")
          }),
          h(Button, { type: "submit", className: "ptm-primary", disabled: state.pending }, withIcon("plus", t("addSubtask")))
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
            { ...formValidation(t), onSubmit: submit("note") },
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
            h(Button, { type: "submit", className: "ptm-primary", disabled: state.pending || !dirty("note") }, t("addNote"))
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
          { className: `ptm-row${task.done ? " is-done" : ""}${state.editing === task.id && !trashed ? " is-selected" : ""}` },
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
          !child && h("button", {
            type: "button",
            className: "ptm-expand",
            "aria-expanded": expanded,
            "aria-label": t(expanded ? "collapseTask" : "expandTask", { title: task.title }),
            onClick: () => controller.expand(task.id)
          }, icon("chevron")),
          h(
            "button",
            {
              type: "button",
              className: "ptm-task-title",
              title: task.title,
              "aria-current": state.editing === task.id && !trashed ? "true" : void 0,
              onClick: () => {
                if (trashed) {
                  if (!child) controller.expand(task.id);
                  return;
                }
                if (!child && !expanded) controller.expand(task.id);
                controller.set({ editing: task.id });
              }
            },
            h("span", { className: "ptm-title-text" }, task.title)
          ),
          !trashed && h("button", {
            type: "button",
            className: "ptm-star-toggle",
            title: t(task.starred ? "unstar" : "star"),
            "aria-label": t("star"),
            "aria-pressed": task.starred,
            disabled: state.pending,
            onClick: () => controller.star(task)
          }, task.starred ? "\u2605" : "\u2606"),
          children.length ? h(
            "small",
            { className: "ptm-step-count", "aria-label": t("stepsProgress", { done: children.filter((c) => c.done).length, total: children.length }) },
            `${formatNumber(state.language, children.filter((c) => c.done).length)}/${formatNumber(state.language, children.length)}`
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
              !trashed && menuAction(t("edit"), () => controller.set({ editing: task.id })),
              !trashed && menuAction(t(task.starred ? "unstar" : "star"), () => controller.star(task), { disabled: state.pending }),
              !trashed && menuAction(withIcon("trash", t("moveTrash")), () => controller.confirm("trash", task), { disabled: state.pending }),
              trashed && menuAction(t("restore"), () => controller.restore(task), { disabled: state.pending || Boolean(parent?.trashed_at), title: parent?.trashed_at ? t("restoreParent") : void 0 }),
              trashed && menuAction(withIcon("trash", t("purge")), () => controller.confirm("purge", task), { className: "ptm-danger", disabled: state.pending })
            )
          )
        ),
        expanded && !child && h(
          "div",
          { className: "ptm-children" },
          children.map((item) => h(TaskRow, { key: item.id, task: item, children: [], state, controller, t, child: true })),
          !trashed && !task.done && act(withIcon("plus", t("addSubtask")), () => controller.set({ editing: task.id }), { className: "ptm-add-child" })
        )
      );
    }
    return function TasksView({ transport, scope = "default", preferenceScope = scope, surface = "dashboard", schedule, controller: supplied, hermesLanguage }) {
      const controllers = React.useRef(/* @__PURE__ */ new Map());
      const transportRef = React.useRef(transport);
      transportRef.current = transport;
      if (!controllers.current.has(scope)) controllers.current.set(scope, supplied || createController({ scope: preferenceScope, hermesLanguage, transport: (...args) => transportRef.current(...args) }));
      const controller = controllers.current.get(scope);
      const state = React.useSyncExternalStore(controller.subscribe, controller.getSnapshot);
      const t = (name, values) => translate(state.language, name, values);
      React.useEffect(() => {
        if (surface === "preview") {
          document.title = translate(state.language, "heading");
          document.documentElement.lang = state.language;
        }
      }, [surface, state.language]);
      React.useEffect(() => {
        controller.syncLanguagePreference();
      }, [controller]);
      React.useEffect(() => {
        const update = () => controller.inheritLanguage(hermesLanguage);
        const sync = (event) => {
          if (event.key === "ptm.language" || event.key === null) controller.syncLanguagePreference();
        };
        update();
        window.addEventListener("languagechange", update);
        window.addEventListener("storage", sync);
        return () => {
          window.removeEventListener("languagechange", update);
          window.removeEventListener("storage", sync);
        };
      }, [controller, hermesLanguage]);
      React.useEffect(() => {
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
          for (const menu of document.querySelectorAll(".ptm-menu[open], .ptm-settings[open]")) if (!menu.contains(event.target)) menu.removeAttribute("open");
        };
        document.addEventListener("pointerdown", closeMenus);
        return () => {
          stop();
          window.removeEventListener("focus", poll);
          document.removeEventListener("pointerdown", closeMenus);
          controller.pause();
        };
      }, [controller]);
      const mounted = React.useRef(false);
      React.useEffect(() => {
        mounted.current = true;
        return () => {
          mounted.current = false;
          queueMicrotask(() => {
            if (!mounted.current) for (const c of controllers.current.values()) c.dispose();
          });
        };
      }, []);
      const [split, setSplit] = React.useState(100 - state.detailsWidth);
      const [addingAtEnd, setAddingAtEnd] = React.useState(false);
      const bottomForm = React.useRef(null);
      React.useEffect(() => {
        setAddingAtEnd(false);
      }, [controller, state.view]);
      React.useEffect(() => {
        if (addingAtEnd) bottomForm.current?.querySelector("input")?.focus();
      }, [addingAtEnd]);
      const workspace = React.useRef(null);
      const resize = (event) => {
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
      const selected = state.view !== "trash" && items.find((task) => task.id === state.editing && !task.trashed_at && roots.some((root) => root.id === task.id || root.id === task.parent_id));
      React.useEffect(() => {
        if (state.editing && !selected && !state.pending) controller.set({ editing: null });
      }, [controller, state.editing, selected?.id, state.pending]);
      React.useEffect(() => {
        setSplit(100 - state.detailsWidth);
      }, [controller, state.detailsWidth, Boolean(selected)]);
      const trashRoots = state.data.trash.filter((task) => !state.data.trash.some((parent) => parent.id === task.parent_id));
      return h(
        "section",
        { className: "ptm", "data-surface": surface, "data-scope": scope, "data-loaded": String(state.loaded), lang: state.language, "aria-busy": state.pending ? "true" : void 0 },
        h(
          "header",
          { className: "ptm-header" },
          h("h1", {}, t("heading"), h("span", { className: "ptm-count" }, formatNumber(state.language, state.data.progress.total))),
          h(
            "div",
            { className: "ptm-header-actions" },
            h(
              "details",
              { className: "ptm-settings" },
              h("summary", { "aria-label": t("settings"), title: t("settings") }, icon("settings", "\u2699")),
              h(
                "div",
                { className: "ptm-settings-panel" },
                h("strong", {}, t("settings")),
                h("label", {}, t("language"), h(
                  "select",
                  {
                    className: "ptm-language",
                    value: state.languagePreference,
                    "aria-label": t("language"),
                    onChange: (event) => controller.language(event.target.value)
                  },
                  h("option", { value: "auto" }, t("autoLanguage")),
                  supportedLanguages.map(({ code, name }) => h("option", { key: code, value: code, lang: code }, name))
                )),
                h("small", { className: "ptm-muted" }, t(`languageSource${state.languageSource}`)),
                h("small", { className: "ptm-muted" }, t("languageHelp")),
                h(
                  "label",
                  {},
                  h(
                    "span",
                    { className: "ptm-width-label" },
                    t("detailsWidth"),
                    h("output", {}, new Intl.NumberFormat(state.language, { style: "percent" }).format(state.detailsWidth / 100))
                  ),
                  h("input", {
                    type: "range",
                    className: "ptm-details-width",
                    min: 30,
                    max: 70,
                    step: 5,
                    value: state.detailsWidth,
                    "aria-label": t("detailsWidth"),
                    onChange: (event) => controller.detailsWidth(event.target.value)
                  })
                ),
                h("small", { className: "ptm-muted" }, t("detailsWidthHelp"))
              )
            ),
            act(t("refresh"), () => controller.refresh(), { disabled: state.pending })
          )
        ),
        h(
          "div",
          { className: "ptm-progress" },
          h("span", { className: "ptm-stats" }, t("progress", state.data.progress)),
          h("progress", { max: 100, value: state.data.progress.percent, "aria-label": t("overallProgress") })
        ),
        h("nav", { className: "ptm-tabs", "aria-label": t("filters") }, ["active", "archive", "trash"].map((view) => act(view === "trash" ? withIcon("trash", t("trashCount", { count: trashRoots.length })) : t(view), () => controller.set({ view, editing: null }), { key: view, "aria-pressed": state.view === view }))),
        h(
          "div",
          { ref: workspace, className: `ptm-workspace${selected ? " has-details" : ""}`, style: { "--ptm-list-width": `${split}%` } },
          h(
            "div",
            { className: "ptm-list-pane" },
            h(
              "div",
              { className: "ptm-toolbar" },
              h(
                "div",
                { className: "ptm-search" },
                icon("search"),
                h(Input, {
                  type: "search",
                  value: state.query,
                  placeholder: t("search"),
                  "aria-label": t("search"),
                  onChange: (event) => controller.set({ query: event.target.value })
                })
              ),
              act(t("starred"), () => controller.set({ starred: !state.starred }), { "aria-pressed": state.starred }),
              state.view === "trash" && trashRoots.length > 0 && act(withIcon("trash", t("emptyTrash")), () => controller.confirm("empty"), { className: "ptm-danger", disabled: state.pending })
            ),
            state.view === "active" && h(
              "form",
              { ...formValidation(t), className: "ptm-add", onSubmit: (event) => {
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
              h(Button, { type: "submit", className: "ptm-add-task ptm-primary", disabled: state.pending }, withIcon("plus", t("add")))
            ),
            h("div", { className: "ptm-message", role: "status", "aria-live": "polite" }, state.error || (state.pending ? t("syncing") : "")),
            h(
              "div",
              { className: "ptm-list" },
              roots.length ? roots.map((task) => h(TaskRow, { key: task.id, task, state, controller, t, children: items.filter((child) => child.parent_id === task.id) })) : h("p", { className: "ptm-empty" }, t(state.query || state.starred ? "noResults" : state.view === "trash" ? "emptyTrashHint" : state.view === "archive" ? "archiveHint" : "noTasks")),
              state.view === "active" && (addingAtEnd ? h(
                "form",
                {
                  ...formValidation(t),
                  ref: bottomForm,
                  className: "ptm-add-bottom",
                  onKeyDown: (event) => {
                    if (event.key === "Escape") {
                      event.preventDefault();
                      cancelBottomAdd();
                    }
                  },
                  onSubmit: async (event) => {
                    event.preventDefault();
                    if (await controller.add()) setAddingAtEnd(false);
                  }
                },
                h(Input, {
                  value: state.newTitle,
                  placeholder: t("taskPlaceholder"),
                  "aria-label": t("newTask"),
                  maxLength: 300,
                  required: true,
                  onChange: (event) => controller.set({ newTitle: event.target.value })
                }),
                h(
                  "div",
                  { className: "ptm-add-bottom-actions" },
                  h(Button, { type: "submit", className: "ptm-add-task ptm-primary", disabled: state.pending }, withIcon("plus", t("add"))),
                  act(t("cancel"), cancelBottomAdd)
                )
              ) : act(withIcon("plus", t("addTask")), () => setAddingAtEnd(true), { className: "ptm-add-root", disabled: state.pending }))
            )
          ),
          selected && h("div", {
            className: "ptm-divider",
            role: "separator",
            tabIndex: 0,
            "aria-label": t("resizePanels"),
            "aria-orientation": "vertical",
            "aria-valuemin": 30,
            "aria-valuemax": 70,
            "aria-valuenow": Math.round(split),
            onPointerDown: (event) => {
              if (event.button === 0) {
                event.preventDefault();
                event.currentTarget.focus();
                event.currentTarget.setPointerCapture(event.pointerId);
              }
            },
            onPointerMove: resize,
            onPointerUp: (event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
            },
            onDoubleClick: () => setSplit(100 - state.detailsWidth),
            onKeyDown: (event) => {
              const next = { ArrowLeft: split - 5, ArrowRight: split + 5, Home: 30, End: 70 }[event.key];
              if (next !== void 0) {
                event.preventDefault();
                setSplit(Math.max(30, Math.min(70, next)));
              }
            }
          }),
          selected && h(Editor, { key: `${scope}:${selected.id}`, task: selected, state, controller, t })
        ),
        h(Confirmation, { state, controller, t })
      );
    };
  }

  // frontend/src/dashboard.mjs
  if (typeof window !== "undefined" && window.__HERMES_PLUGIN_SDK__ && window.__HERMES_PLUGINS__) {
    let TasksPage = function() {
      const hostLanguage = useHostI18n()?.locale;
      const [scope, setScope] = React.useState(currentScope);
      React.useEffect(() => {
        const id = setInterval(() => setScope(currentScope()), 500);
        return () => clearInterval(id);
      }, []);
      const transport = React.useCallback(async (path, { body, language, ...options } = {}) => {
        if (scope !== currentScope()) throw new LocalizedError("connectionChanged");
        const epoch = scope;
        const result = await SDK.fetchJSON(`/api/plugins/personal-task-manager${path}?language=${encodeURIComponent(language || "en")}`, {
          ...options,
          headers: { "Content-Type": "application/json", "Accept-Language": language || "en" },
          ...body === void 0 ? {} : { body: JSON.stringify(body) }
        });
        if (epoch !== currentScope()) throw new LocalizedError("connectionChanged");
        return result;
      }, [scope]);
      return React.createElement(View, { transport, scope, surface: "dashboard", hermesLanguage: hostLanguage });
    };
    const SDK = window.__HERMES_PLUGIN_SDK__, React = SDK.React;
    const kit = { ...SDK.components };
    if (kit.Button) {
      const HostButton = kit.Button;
      kit.Button = ({ className, ...props }) => React.createElement(HostButton, {
        ...props,
        className: ["ptm-compact-button", className].filter(Boolean).join(" ")
      });
    }
    if (SDK.components?.ConfirmDialog) {
      kit.ConfirmDialog = ({ onClose, ...props }) => React.createElement(SDK.components.ConfirmDialog, { ...props, onCancel: onClose });
    }
    const View = createTasksView(React, kit);
    const currentScope = () => `${location.origin}:${new URLSearchParams(location.search).get("profile") || "default"}`;
    const useHostI18n = typeof SDK.useI18n === "function" ? SDK.useI18n : () => null;
    window.__HERMES_PLUGINS__.register("personal-task-manager", TasksPage);
  }
  return __toCommonJS(dashboard_exports);
})();
if (typeof module === 'object' && module.exports) module.exports = PTMDashboard;
