import React from "react";
import * as SDK from "@hermes/plugin-sdk";
import {createTasksView} from "./view.mjs";
import {LocalizedError} from "./i18n.mjs";
import css from "./style.css";

const View = createTasksView(React, SDK);
const useHostI18n = typeof SDK.useI18n === "function" ? SDK.useI18n : () => null;
export default {
  id: "personal-task-manager",
  name: "My Tasks",
  register(ctx) {
    const style = document.createElement("style"); style.textContent = css; style.dataset.ptm = "webapp"; document.head.append(style);
    ctx.onDispose(() => style.remove());
    function TasksPage() {
      // The public SDK hook is reactive; do not read or change Hermes config.
      const hostI18n = useHostI18n();
      const hostLanguage = hostI18n?.isLoadingConfig || hostI18n?.configLoadError ? undefined : hostI18n?.locale;
      const profile = SDK.useValue(SDK.host.state.profile);
      const epoch = SDK.useGatewayActivationEpoch();
      const transport = React.useCallback(async (path, {body, language, ...options} = {}) => {
        if (epoch !== SDK.gatewayActivationEpoch()) throw new LocalizedError("connectionChanged");
        // Unlike Dashboard fetchJSON, ctx.rest accepts an object body and owns authentication.
        const result = await ctx.rest(`${path}?language=${encodeURIComponent(language || "en")}`, {...options, ...(body === undefined ? {} : {body})});
        if (epoch !== SDK.gatewayActivationEpoch()) throw new LocalizedError("connectionChanged");
        return result;
      }, [profile, epoch]);
      return React.createElement(View, {transport, scope: `${profile}:${epoch}`, preferenceScope: profile, surface: "webapp", hermesLanguage: hostLanguage, schedule: ctx.setInterval});
    }
    ctx.registerMany([
      {id: "page", area: SDK.ROUTES_AREA, data: {path: "/personal-tasks"}, render: () => React.createElement(TasksPage)},
      {id: "nav", area: SDK.SIDEBAR_NAV_AREA, data: {path: "/personal-tasks", label: "My Tasks", codicon: "checklist"}},
    ]);
  },
};
