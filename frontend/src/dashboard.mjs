import {createTasksView} from "./view.mjs";
import {translations, savedLanguage, translate} from "./i18n.mjs";

export {translations, savedLanguage, translate};

if (typeof window !== "undefined" && window.__HERMES_PLUGIN_SDK__ && window.__HERMES_PLUGINS__) {
  const SDK = window.__HERMES_PLUGIN_SDK__, React = SDK.React;
  const kit = {...SDK.components};
  if (SDK.components?.ConfirmDialog) {
    // Dashboard uses an AlertDialog with onCancel; Desktop/WebApp uses onClose.
    kit.ConfirmDialog = ({onClose, ...props}) => React.createElement(SDK.components.ConfirmDialog, {...props, onCancel: onClose});
  }
  const View = createTasksView(React, kit);
  const currentScope = () => `${location.origin}:${new URLSearchParams(location.search).get("profile") || "default"}`;
  function TasksPage() {
    const [scope, setScope] = React.useState(currentScope);
    React.useEffect(() => {const id = setInterval(() => setScope(currentScope()), 500); return () => clearInterval(id);}, []);
    const transport = React.useCallback(async (path, {body, language, ...options} = {}) => {
      if (scope !== currentScope()) throw new Error(translate(language, "requestError"));
      const epoch = scope;
      const result = await SDK.fetchJSON(`/api/plugins/personal-task-manager${path}?language=${encodeURIComponent(language || "en")}`, {
        ...options, headers: {"Content-Type": "application/json", "Accept-Language": language || "en"}, ...(body === undefined ? {} : {body: JSON.stringify(body)})});
      if (epoch !== currentScope()) throw new Error(translate(language, "requestError"));
      return result;
    }, [scope]);
    return React.createElement(View, {transport, scope, surface: "dashboard"});
  }
  window.__HERMES_PLUGINS__.register("personal-task-manager", TasksPage);
}
