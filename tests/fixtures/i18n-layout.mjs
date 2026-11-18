import React from "react";
import {createRoot} from "react-dom/client";
import * as messages from "../../frontend/src/i18n.mjs";
window.__CHECK_MESSAGES__ = messages;
let locale = window.__CHECK_LOCALE__, listeners = new Set();
const profile = {get:()=>"test",subscribe:()=>()=>{}};
window.__CHECK_SDK__ = {
  host:{state:{profile}}, useValue:atom=>React.useSyncExternalStore(atom.subscribe,atom.get),
  useI18n:()=>({locale:React.useSyncExternalStore(callback=>{listeners.add(callback);return()=>listeners.delete(callback);},()=>locale)}),
  setLocale:value=>{locale=value;for(const callback of listeners)callback();},
  useGatewayActivationEpoch:()=>1,gatewayActivationEpoch:()=>1,
  ROUTES_AREA:"routes",SIDEBAR_NAV_AREA:"sidebar.nav",
  Button:({children,...props})=>React.createElement("button",props,children), Input:"input",Textarea:"textarea"
};
window.__HERMES_PLUGIN_SDK__ = {React,useI18n:window.__CHECK_SDK__.useI18n,
 components:{Button:window.__CHECK_SDK__.Button,Input:"input",Textarea:"textarea"},
 fetchJSON:async(path,options)=>{if(options.method)throw Error("Unexpected task write");return structuredClone(window.__CHECK_DATA__);}};
window.__HERMES_PLUGINS__ = {register:(_,Page)=>createRoot(document.getElementById("dashboard")).render(React.createElement(Page))};
Promise.all([import("../../frontend/src/dashboard.mjs"),import("../../frontend/src/webapp.mjs")]).then(([,webapp])=>{
 webapp.default.register({onDispose(){},setInterval:()=>()=>{},
  registerMany:items=>{const Page=items.find(item=>item.area==="routes").render;createRoot(document.getElementById("webapp")).render(React.createElement(Page));},
  rest:async(path,options)=>{if(options.method)throw Error("Unexpected task write");return structuredClone(window.__CHECK_DATA__);}});
});
