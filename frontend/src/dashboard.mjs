import {createTasksView} from "./view.mjs";
import {translations, savedLanguage, translate, LocalizedError} from "./i18n.mjs";

export {translations, savedLanguage, translate, LocalizedError};

if (typeof window !== "undefined" && window.__HERMES_PLUGIN_SDK__ && window.__HERMES_PLUGINS__) {
  const SDK = window.__HERMES_PLUGIN_SDK__, React = SDK.React;
  const kit = {...SDK.components};
  if (kit.Button) {
    const HostButton = kit.Button;
    kit.Button = ({className, ...props}) => React.createElement(HostButton, {...props,
      className: ["ptm-compact-button", className].filter(Boolean).join(" ")});
  }
  if (SDK.components?.ConfirmDialog) {
    // Dashboard uses an AlertDialog with onCancel; Desktop/WebApp uses onClose.
    kit.ConfirmDialog = ({onClose, ...props}) => React.createElement(SDK.components.ConfirmDialog, {...props, onCancel: onClose});
  }
  const View = createTasksView(React, kit);
  const currentScope = () => `${location.origin}:${new URLSearchParams(location.search).get("profile") || "default"}`;
  // Official Dashboard SDK: useI18n() returns {locale, setLocale, t}.
  const useHostI18n = typeof SDK.useI18n === "function" ? SDK.useI18n : () => null;
  function TasksPage() {
    const hostLanguage = useHostI18n()?.locale;
    const [scope, setScope] = React.useState(currentScope);
    React.useEffect(() => {const id = setInterval(() => setScope(currentScope()), 500); return () => clearInterval(id);}, []);
    const transport = React.useCallback(async (path, {body, language, ...options} = {}) => {
      if (scope !== currentScope()) throw new LocalizedError("connectionChanged");
      const epoch = scope;
      const result = await SDK.fetchJSON(`/api/plugins/personal-task-manager${path}?language=${encodeURIComponent(language || "en")}`, {
        ...options, headers: {"Content-Type": "application/json", "Accept-Language": language || "en"}, ...(body === undefined ? {} : {body: JSON.stringify(body)})});
      if (epoch !== currentScope()) throw new LocalizedError("connectionChanged");
      return result;
    }, [scope]);
    return React.createElement(View, {transport, scope, surface: "dashboard", hermesLanguage: hostLanguage});
  }
  window.__HERMES_PLUGINS__.register("personal-task-manager", TasksPage);
}
