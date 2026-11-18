"use strict";
const assert = require("node:assert/strict"), {build} = require("esbuild"), {JSDOM} = require("jsdom"), React = require("react");
const {act} = React;
const flush = async fn => act(async () => {await fn?.(); for (let i = 0; i < 30; i++) await Promise.resolve();});
const atom = initial => {let value = initial; const listeners = new Set(); return {get: () => value, subscribe: f => {listeners.add(f); return () => listeners.delete(f);}, set: next => {value = next; for (const f of listeners) f();}};};
(async () => {
  const dom = new JSDOM('<div id="app"></div>', {url: "http://webapp.test", pretendToBeVisual: true});
  global.window = dom.window; global.document = dom.window.document; global.Node = dom.window.Node; global.IS_REACT_ACT_ENVIRONMENT = true;
  const {createRoot} = require("react-dom/client");
  const profile = atom("one"), epoch = atom(1), locale = atom("es");
  global.__PTM_SDK__ = {useI18n:()=>({locale:React.useSyncExternalStore(locale.subscribe,locale.get)}), host: {state: {profile}}, useValue: item => React.useSyncExternalStore(item.subscribe, item.get),
    useGatewayActivationEpoch: () => React.useSyncExternalStore(epoch.subscribe, epoch.get), gatewayActivationEpoch: epoch.get,
    ROUTES_AREA: "routes", SIDEBAR_NAV_AREA: "sidebar.nav", Button: "button", Input: "input", Textarea: "textarea"};
  const bundle = await build({entryPoints: ["frontend/src/webapp.mjs"], bundle: true, write: false, platform: "node", format: "cjs",
    external: ["react"], loader: {".css": "text"}, plugins: [{name: "real-sdk-contract-fixture", setup(builder) {
      builder.onResolve({filter: /^@hermes\/plugin-sdk$/}, () => ({path: "sdk", namespace: "fixture"}));
      builder.onLoad({filter: /.*/, namespace: "fixture"}, () => ({contents: Object.keys(global.__PTM_SDK__).map(key => "export const " + key + " = globalThis.__PTM_SDK__." + key + ";").join("\n"), loader: "js"}));
    }}]});
  const module = {exports: {}}; new Function("require", "module", "exports", bundle.outputFiles[0].text)(require, module, module.exports);
  const registered = [], timers = new Map(), calls = []; let nextTimer = 0, release, hold = false;
  const item = name => ({id: name, parent_id: null, title: name, description: "", done: false, starred: false, revision: 1});
  const data = {one: [item("Profile one")], two: [item("Profile two")]};
  const disposers = [];
  const ctx = {onDispose: fn => disposers.push(fn), registerMany: items => {registered.push(...items); const stop = () => registered.splice(0); disposers.push(stop); return stop;},
    setInterval: (fn, ms) => {const id = ++nextTimer; timers.set(id, {fn, ms}); return () => timers.delete(id);},
    rest: async (path, options) => {
      const scope = profile.get(); calls.push({path, options, scope});
      assert.ok(path.startsWith("/tasks?language="));
      if (options.method) {assert.equal(typeof options.body, "object"); assert.ok(!options.headers); const created = item(options.body.title); data[scope].push(created); return created;}
      const result = {tasks: structuredClone(data[scope]), trash: [], comments: [], events: [], progress: {total: data[scope].length, done: 0, percent: 0}};
      if (hold) {hold = false; return new Promise(resolve => {release = () => resolve(result);});}
      return result;
    }};
  assert.equal(module.exports.default.register(ctx), undefined, "Hermes register is void; cleanup belongs to ctx.onDispose");
  assert.ok(registered.some(item => item.area === "sidebar.nav" && item.data.path === "/personal-tasks"));
  const Page = registered.find(item => item.area === "routes").render;
  const root = createRoot(document.getElementById("app")); await flush(() => root.render(React.createElement(Page)));
  assert.match(document.querySelector(".ptm-list").textContent, /Profile one/);
  assert.equal(document.querySelector(".ptm").lang,"es","WebApp inherits the real SDK locale shape");
  for(const code of ["en","ru","es","pt-BR","de","fr","pl"]){await flush(()=>locale.set(code));assert.equal(document.querySelector(".ptm").lang,code);}
  await flush(()=>{const select=document.querySelector(".ptm-language");select.value="fr";select.dispatchEvent(new dom.window.Event("change",{bubbles:true}));});
  await flush(()=>locale.set("de"));assert.equal(document.querySelector(".ptm").lang,"fr");
  await flush(()=>{const select=document.querySelector(".ptm-language");select.value="auto";select.dispatchEvent(new dom.window.Event("change",{bubbles:true}));});
  assert.equal(document.querySelector(".ptm").lang,"de");
  await flush(()=>locale.set("en"));
  await flush(()=>{const slider=document.querySelector(".ptm-details-width");Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype,"value").set.call(slider,"30");slider.dispatchEvent(new dom.window.Event("input",{bubbles:true}));});
  assert.equal(JSON.parse(dom.window.localStorage.getItem("ptm.view:one")).detailsWidth,30);
  await flush(()=>epoch.set(2));
  assert.equal(document.querySelector(".ptm-details-width").value,"30","WebApp width survives gateway activation epochs");
  const title = document.querySelector(".ptm-add input");
  await flush(() => {Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, "value").set.call(title, "Created from WebApp"); title.dispatchEvent(new dom.window.Event("input", {bubbles: true}));});
  await flush(() => document.querySelector(".ptm-add").dispatchEvent(new dom.window.Event("submit", {bubbles: true, cancelable: true})));
  assert.equal(data.one.length, 2); assert.ok(calls.some(call => call.options.method === "POST"));
  await flush(() => document.querySelector(".ptm-close").click());
  assert.ok(document.querySelector(".ptm-list > .ptm-add-root"));
  await flush(() => document.querySelector(".ptm-add-root").click());
  const bottom = document.querySelector(".ptm-add-bottom input");
  assert.equal(document.activeElement,bottom);
  await flush(() => {Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, "value").set.call(bottom, "Bottom task from WebApp"); bottom.dispatchEvent(new dom.window.Event("input", {bubbles: true}));});
  await flush(() => document.querySelector(".ptm-add-bottom").dispatchEvent(new dom.window.Event("submit", {bubbles: true, cancelable: true})));
  assert.equal(data.one.length,3);
  assert.equal(calls.filter(call => call.options.method === "POST").at(-1).options.body.parent_id,undefined);
  assert.ok(document.querySelector(".ptm-editor .ptm-close .ptm-icon-close"));
  hold = true; await flush(() => [...timers.values()][0].fn());
  await flush(() => {profile.set("two"); epoch.set(2);});
  assert.match(document.querySelector(".ptm-list").textContent, /Profile two/);
  assert.equal(document.querySelector(".ptm-details-width").value,"50","Width preferences are profile scoped");
  await flush(() => release()); assert.doesNotMatch(document.querySelector(".ptm-list").textContent, /Profile one/);
  assert.doesNotMatch(document.querySelector(".ptm-list").textContent, /Created from WebApp/);
  await flush(() => root.unmount()); for (const stop of disposers) stop();
  assert.equal(timers.size, 0); assert.equal(registered.length, 0); assert.equal(document.querySelectorAll("style[data-ptm]").length, 0);
  dom.window.close(); delete global.__PTM_SDK__;
  console.log("PASS: WebApp SDK registration, object-body REST, profile isolation, late-response rejection and unload cleanup");
})().catch(error => {console.error(error); process.exitCode = 1;});
