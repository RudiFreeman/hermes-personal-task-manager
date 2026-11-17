import React from "react";
import {createRoot} from "react-dom/client";
import {createTasksView} from "./view.mjs";

const View = createTasksView(React);
const transport = async (path, {body, language, ...options} = {}) => {
  const response = await fetch(`/api/plugins/personal-task-manager${path}?language=${encodeURIComponent(language || "en")}`, {...options,
    headers: {"Content-Type": "application/json", "Accept-Language": language || "en", "X-PTM-Token": window.__PTM_LOCAL_PREVIEW__},
    ...(body === undefined ? {} : {body: JSON.stringify(body)})});
  const payload = await response.json();
  if (!response.ok) throw new Error(typeof payload.detail === "string" ? payload.detail : "Request failed");
  return payload;
};
createRoot(document.getElementById("app")).render(React.createElement(View, {transport, scope: `${location.origin}:preview`, surface: "preview"}));
