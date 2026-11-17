"use strict";
// Real application code with a small DOM and controlled transport; no database.
const fs = require("node:fs"), vm = require("node:vm"), assert = require("node:assert/strict");
class Element {
  constructor(tag = "text", text = "") {
    this.tag = tag; this._text = text; this.children = []; this.attrs = {}; this.dataset = {};
    this.events = {}; this.value = ""; this.className = "";
    this.classList = {add() {}, remove() {}};
  }
  setAttribute(k, v) {
    this.attrs[k] = v;
    if (k === "value") this.value = v;
    if (k.startsWith("data-")) this.dataset[k.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = v;
  }
  removeAttribute(k) {delete this.attrs[k];}
  addEventListener(k, f) {(this.events[k] ??= []).push(f);}
  async fire(k, extra = {}) {for (const f of this.events[k] || []) await f({target: this, preventDefault() {}, ...extra});}
  append(...nodes) {this.children.push(...nodes); for (const n of nodes) n.parent = this; if (this.tag === "textarea") this.value = this.textContent;}
  replaceChildren(...nodes) {this.children = []; this.append(...nodes);}
  get textContent() {return this._text + this.children.map(c => c.textContent).join("");}
  set textContent(v) {this._text = String(v); this.children = [];}
}
function all(n) {return n.children.flatMap(c => [c, ...all(c)]);}
const settle = async () => {for (let i = 0; i < 40; ++i) await Promise.resolve();};
const clone = value => JSON.parse(JSON.stringify(value));
const task = (id, parent_id = null) => ({id, parent_id, title: id, description: "Initial", revision: 1, done: false, starred: false});
async function setup() {
  const root = new Element("root"); let timer, dispose, delayed = [], delayNext = false, failNext = false;
  const server = {tasks: [task("a"), task("b"), task("child", "a")], comments: [], events: [], progress: {total: 2, done: 0, percent: 0}};
  const writes = [];
  const transport = async (url, options = {}) => {
    if (options.method) {
      const body = JSON.parse(options.body), id = decodeURIComponent(url.split("/").at(-1));
      writes.push({id, ...body});
      if (failNext) {failNext = false; throw new Error("failed write");}
      if (options.method === "PATCH") {
        const item = server.tasks.find(t => t.id === id);
        if (body.revision !== item.revision) throw new Error("conflict");
        const {revision, comment, ...changes} = body;
        Object.assign(item, changes, {revision: revision + 1});
        if (comment) server.comments.push({task_id: id, actor: "user", body: comment, created_at: "2026-11-17T10:00:00Z"});
        return clone(item);
      }
      const child = task("new-child", body.parent_id); child.title = body.title; server.tasks.push(child);
      return clone(child);
    }
    const snapshot = clone(server);
    if (delayNext) {delayNext = false; return new Promise((resolve, reject) => delayed.push({resolve: () => resolve(snapshot), reject}));}
    return snapshot;
  };
  const React = {useRef: () => ({current: root}), useEffect: f => {dispose = f();}, createElement() {}};
  vm.runInNewContext(fs.readFileSync(require.resolve("./dashboard/dist/index.js"), "utf8"), {
    Node: Element, document: {createElement: t => new Element(t), createTextNode: t => new Element("text", t), hidden: false},
    window: {__HERMES_PLUGIN_SDK__: {React, fetchJSON: transport}, __HERMES_PLUGINS__: {register: (_, page) => page()}},
    localStorage: {getItem: () => null, setItem() {}}, setInterval: f => (timer = f, 1), clearInterval() {}, console
  });
  await settle();
  const find = pred => all(root).find(pred);
  const field = key => find(n => n.dataset.draftKey === key);
  const select = async id => {await find(n => n.className === "ptm-task-title" && n.textContent === id).fire("click");};
  await select("a");
  return {root, server, writes, find, field, select, dispose: () => dispose(),
    type: async (key, value) => {const n = field(key); n.value = value; await n.fire("input");},
    submit: async key => {let n = field(key); while (n.tag !== "form") n = n.parent; await n.fire("submit"); await settle();},
    language: async () => {await find(n => n.tag === "select").fire("change", {target: {value: "ru"}});},
    tick: async () => {timer(); await settle();},
    refresh: async () => {await find(n => n.tag === "button" && ["Refresh", "Обновить"].includes(n.textContent)).fire("click"); await settle();},
    star: async () => {await find(n => n.className.startsWith("ptm-star")).fire("click"); await settle();},
    delay: () => {delayNext = true;}, release: async (i = 0) => {delayed[i].resolve(); await settle();},
    reject: async (i = 0) => {delayed[i].reject(new Error("failed GET")); await settle();},
    fail: () => {failNext = true;}
  };
}
async function tests() {
  // BUG-01: language changes cannot rebase either parent or child drafts.
  for (const [id, key] of [["a", "description"], ["child", "child:description"]]) {
    const h = await setup(); await h.type(key, "Local");
    Object.assign(h.server.tasks.find(t => t.id === id), {description: "Remote", revision: 2});
    await h.tick(); await h.language(); await h.submit(key);
    assert.equal(h.writes.at(-1).revision, 1);
    assert.equal(h.server.tasks.find(t => t.id === id).description, "Remote");
    assert.equal(h.field(key).value, "Local");
    assert.match(h.root.textContent, /Черновик сохранён/);
  }
  let h = await setup(); await h.type("description", "Local"); await h.language(); await h.submit("description");
  assert.equal(h.server.tasks[0].description, "Local");
  assert.equal(h.writes[0].revision, 1);
  assert.ok(!Object.hasOwn(h.writes[0], "title"), "untouched fields are not submitted");
  // BUG-02: independent actions, task selection and successful/failed submissions.
  h = await setup(); await h.type("description", "Parent draft"); await h.type("new-comment", "Note draft");
  await h.type("child:description", "Step draft"); await h.type("new-subtask", "New step");
  let details = h.find(n => n.tag === "details"); details.open = true; await details.fire("toggle");
  await h.star();
  for (const [key, value] of [["description", "Parent draft"], ["new-comment", "Note draft"], ["child:description", "Step draft"], ["new-subtask", "New step"]]) assert.equal(h.field(key).value, value);
  assert.equal(h.find(n => n.tag === "details").open, true);
  const check = h.find(n => n.attrs["aria-label"] === "Complete: child"); check.checked = true; await check.fire("change"); await settle();
  assert.equal(h.field("description").value, "Parent draft"); assert.equal(h.field("new-comment").value, "Note draft");
  await h.submit("child:description"); // Deliberately stale after completion.
  assert.equal(h.field("child:description").value, "Step draft");
  await h.select("b"); assert.equal(h.field("description").value, "Initial");
  await h.select("a"); assert.equal(h.field("description").value, "Parent draft");
  h = await setup(); await h.type("description", "Saved"); await h.type("new-comment", "Kept note");
  await h.submit("description"); assert.equal(h.server.tasks[0].description, "Saved"); assert.equal(h.field("new-comment").value, "Kept note");
  await h.type("description", "Second save"); await h.submit("description"); assert.equal(h.writes.at(-1).revision, 2);
  h.fail(); await h.submit("new-comment"); assert.equal(h.field("new-comment").value, "Kept note");
  h = await setup(); await h.type("new-comment", "Saved note"); await h.submit("new-comment"); assert.equal(h.field("new-comment").value, "");
  await h.type("new-subtask", "Saved child"); await h.submit("new-subtask"); assert.equal(h.field("new-subtask").value, "");
  // BUG-03: clean fields, read-only sections, and action revisions follow polls.
  h = await setup(); Object.assign(h.server.tasks[0], {title: "Remote title", revision: 2, done: true});
  h.server.tasks.push(task("Remote child", "a"));
  h.server.comments.push({task_id: "a", actor: "hermes", body: "Remote note", created_at: "2026-11-17T10:00:00Z"});
  await h.tick(); assert.equal(h.field("title").value, "Remote title");
  assert.match(h.root.textContent, /Remote note/); assert.match(h.root.textContent, /Remote child/);
  assert.ok(h.find(n => n.tag === "button" && n.textContent === "Reopen task"));
  await h.submit("title"); assert.equal(h.writes[0].revision, 2);
  h = await setup(); await h.type("description", "Dirty"); Object.assign(h.server.tasks[0], {title: "Remote title", revision: 2});
  await h.tick(); assert.equal(h.field("description").value, "Dirty"); assert.equal(h.field("title").value, "Remote title");
  await h.submit("description"); assert.equal(h.writes[0].revision, 1);
  await h.find(n => n.tag === "button" && n.textContent === "Discard draft and reload").fire("click");
  assert.equal(h.field("description").value, "Initial"); await h.submit("title"); assert.equal(h.writes.at(-1).revision, 2);
  // BUG-04: deferred promises explicitly control response ordering.
  h = await setup(); h.delay(); await h.tick(); await h.star(); await h.release();
  assert.equal(h.find(n => n.className.startsWith("ptm-star")).attrs["aria-pressed"], "true");
  h = await setup(); h.delay(); await h.tick(); h.server.tasks[0].title = "Newest"; h.delay(); await h.tick();
  await h.release(1); await h.release(0); assert.equal(h.field("title").value, "Newest");
  h = await setup(); h.delay(); await h.tick(); h.fail(); await h.star(); h.server.tasks[0].title = "Recovered";
  await h.tick(); await h.release(); assert.equal(h.field("title").value, "Recovered");
  h = await setup(); h.delay(); await h.tick(); h.delay(); await h.tick(); await h.reject(1);
  await h.release(0); assert.equal(h.field("title").value, "a");
  h.server.tasks[0].title = "Recovered after failed GET"; await h.tick();
  assert.equal(h.field("title").value, "Recovered after failed GET");
  h = await setup(); h.delay(); await h.tick(); h.dispose(); await h.release(); assert.equal(h.root.children.length, 0);
  console.log("PASS: BUG-01–04 draft revisions, preservation, polling, response ordering, and disposal");
}
tests().catch(error => {console.error(error); process.exitCode = 1;});
