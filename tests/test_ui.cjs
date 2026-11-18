"use strict";
const assert=require("node:assert/strict"), fs=require("node:fs"), React=require("react"), {JSDOM}=require("jsdom");
const clone=x=>JSON.parse(JSON.stringify(x));
const task=(id,parent_id=null)=>({id,parent_id,title:id,description:"Initial",revision:1,done:false,starred:false,trashed_at:null});
const flush=async f=>React.act(async()=>{await f?.();for(let i=0;i<40;i++)await Promise.resolve();});
function server(){
 const data={tasks:[task("a"),task("b"),task("child","a")],trash:[],comments:[],events:[]},writes=[],delayed=[];
 let hold=false,fail=false;
 const snapshot=()=>({...clone(data),progress:{total:data.tasks.filter(t=>t.parent_id===null).length,done:data.tasks.filter(t=>t.parent_id===null&&t.done).length,percent:0}});
 const transport=async(path,opts={})=>{
  if(opts.method){
   const body=opts.body;writes.push({path,...clone(body)});
   if(fail){fail=false;throw Error("failed write");}
   if(opts.method==="POST"){const item=task("new"+writes.length,body.parent_id||null);Object.assign(item,body);data.tasks.push(item);return clone(item);}
   const id=path.split("?")[0].split("/").at(-1),item=[...data.tasks,...data.trash].find(t=>t.id===id);
   assert.ok(item,id);if(body.revision!==item.revision)throw Error("conflict");
   if(body.action==="trash"){const group=data.tasks.filter(t=>t.id===id||t.parent_id===id);data.tasks=data.tasks.filter(t=>!group.includes(t));group.forEach(t=>{t.trashed_at="now";t.revision++;});data.trash.push(...group);}
   else if(body.action==="restore"){const group=data.trash.filter(t=>t.id===id||t.parent_id===id);data.trash=data.trash.filter(t=>!group.includes(t));group.forEach(t=>{t.trashed_at=null;t.revision++;});data.tasks.push(...group);}
   else if(body.action==="purge"){assert.equal(body.confirmed,true);data.trash=data.trash.filter(t=>t.id!==id&&t.parent_id!==id);}
   else {const {revision,comment,...changes}=body;Object.assign(item,changes,{revision:revision+1});if(changes.done)data.tasks.filter(t=>t.parent_id===id).forEach(t=>{t.done=true;t.revision++;});if(comment)data.comments.push({id:data.comments.length+1,task_id:id,body:comment,actor:"user",created_at:"2026-11-17T10:00:00Z"});}
   return clone(item);
  }
  const captured=snapshot();if(hold){hold=false;return new Promise((resolve,reject)=>delayed.push({resolve:()=>resolve(captured),reject}));}
  return captured;
 };
 return {data,writes,delayed,transport,delay:()=>{hold=true;},fail:()=>{fail=true;}};
}
async function controllerTests(){
 const {createController}=await import("../frontend/src/state.mjs");
 const setup=async()=>{const s=server(),c=createController({transport:s.transport,storage:{getItem:()=>null,setItem(){}}});await c.refresh();return{s,c};};
 for(const id of ["a","child"]){
  const {s,c}=await setup(),item=s.data.tasks.find(t=>t.id===id);
  c.draft(id,"edit","description","Local draft");item.description="Remote";item.revision++;
  await c.refresh();c.language("ru");await c.submit(item,"edit");
  assert.equal(s.writes.at(-1).revision,1);assert.equal(item.description,"Remote");assert.equal(c.getSnapshot().drafts.get(id+":edit").values.description,"Local draft");
 }
 let {s,c}=await setup();c.draft("a","edit","description","Parent");c.draft("a","note","comment","Note");c.draft("child","edit","title","Step");c.expand("a");
 await c.star(s.data.tasks[0]);await c.toggle(s.data.tasks[2]);assert.equal(c.getSnapshot().drafts.size,3);assert.ok(c.getSnapshot().expanded.has("a"));
 c.set({editing:"b"});c.set({editing:"a"});assert.equal(c.getSnapshot().drafts.get("a:edit").values.description,"Parent");
 ({s,c}=await setup());c.draft("a","edit","description","Saved");c.draft("a","note","comment","Note");c.language("ru");await c.submit(s.data.tasks[0],"edit");
 assert.equal(s.writes[0].revision,1);assert.ok(!Object.hasOwn(s.writes[0],"title"));assert.ok(!c.getSnapshot().drafts.has("a:edit"));assert.ok(c.getSnapshot().drafts.has("a:note"));
 s.fail();await c.submit(s.data.tasks[0],"note");assert.equal(c.getSnapshot().drafts.get("a:note").values.comment,"Note");
 c.discard("a","note");c.draft("a","note","comment","Fresh");await c.submit(s.data.tasks[0],"note");assert.ok(!c.getSnapshot().drafts.has("a:note"));
 ({s,c}=await setup());s.delay();const old=c.refresh();await c.star(s.data.tasks[0]);s.delayed[0].resolve();await old;assert.equal(c.getSnapshot().data.tasks[0].starred,true);
 ({s,c}=await setup());s.data.tasks[0].title="Old";s.delay();const first=c.refresh();s.data.tasks[0].title="New";s.delay();const second=c.refresh();s.delayed[1].resolve();await second;s.delayed[0].resolve();await first;assert.equal(c.getSnapshot().data.tasks[0].title,"New");
 s.delay();const pending=c.refresh();s.fail();await c.star(s.data.tasks[0]);s.delayed[2].resolve();await pending;s.data.tasks[0].title="Recovered";await c.refresh();assert.equal(c.getSnapshot().data.tasks[0].title,"Recovered");
 s.delay();const stale=c.refresh();s.delay();const failed=c.refresh();s.delayed[4].reject(Error("failed GET"));await failed;s.delayed[3].resolve();await stale;assert.equal(c.getSnapshot().data.tasks[0].title,"Recovered");
 s.delay();const disposed=c.refresh();c.dispose();const final=c.getSnapshot();s.delayed[5].resolve();await disposed;assert.equal(c.getSnapshot(),final);
 const savedPrefs=new Map();const widthStorage={getItem:k=>savedPrefs.get(k),setItem:(k,v)=>savedPrefs.set(k,v)};
 const widthController=createController({transport:server().transport,storage:widthStorage});widthController.detailsWidth(30);
 assert.equal(createController({transport:server().transport,storage:widthStorage}).getSnapshot().detailsWidth,30,"Width persists across controller sessions");
 widthController.detailsWidth(0);assert.equal(widthController.getSnapshot().detailsWidth,30,"Invalid widths ignored");
 const blocked=createController({transport:server().transport,storage:{getItem(){throw Error("blocked");},setItem(){throw Error("blocked");}}});await blocked.refresh();blocked.language("ru");blocked.expand("a");assert.equal(blocked.getSnapshot().language,"ru");
 for(const stored of ["null","[]","broken JSON"]){const safe=createController({transport:server().transport,storage:{getItem:()=>stored,setItem(){}}});await safe.refresh();assert.equal(safe.getSnapshot().data.tasks.length,3);}
 console.log("PASS: draft revisions, independent forms, request ordering, failures, disposal and storage fallback");
}
async function domTests(){
 const dom=new JSDOM('<div id="app"></div>',{url:"http://ptm.test/personal-tasks?profile=test",runScripts:"outside-only",pretendToBeVisual:true});
 global.window=dom.window;global.document=dom.window.document;global.HTMLElement=dom.window.HTMLElement;global.Node=dom.window.Node;global.IS_REACT_ACT_ENVIRONMENT=true;
 const {createRoot}=require("react-dom/client"),timers=new Map();let timerId=0,Page;
 dom.window.setInterval=(fn,ms)=>{timers.set(++timerId,{fn,ms});return timerId;};dom.window.clearInterval=id=>timers.delete(id);
 dom.window.HTMLDialogElement.prototype.showModal=function(){this.setAttribute("open","");};dom.window.HTMLDialogElement.prototype.close=function(){this.removeAttribute("open");};
 const s=server();
 let hostLocale="en";const localeListeners=new Set();
 const setHostLocale=value=>{hostLocale=value;for(const listener of localeListeners)listener();};
 const useI18n=()=>({locale:React.useSyncExternalStore(listener=>{localeListeners.add(listener);return()=>localeListeners.delete(listener);},()=>hostLocale)});
 function DashboardConfirm(props){assert.equal(typeof props.onCancel,"function","Dashboard ConfirmDialog requires onCancel, not onClose");return props.open?React.createElement("div",{role:"alertdialog"},React.createElement("button",{onClick:props.onCancel},props.cancelLabel),React.createElement("button",{onClick:props.onConfirm},props.confirmLabel)):null;}
 dom.window.__HERMES_PLUGIN_SDK__={React,useI18n,components:{Button:"button",Input:"input",ConfirmDialog:DashboardConfirm},fetchJSON:async(path,options)=>{assert.equal(options.headers["Content-Type"],"application/json");return s.transport(path.replace("/api/plugins/personal-task-manager",""),{...options,body:options.body?JSON.parse(options.body):undefined});}};
 dom.window.__HERMES_PLUGINS__={register:(name,component)=>{assert.equal(name,"personal-task-manager");Page=component;}};
 dom.window.eval(fs.readFileSync("dashboard/dist/index.js","utf8"));
 const root=createRoot(document.getElementById("app"));await flush(()=>root.render(React.createElement(React.StrictMode,null,React.createElement(Page))));
 const one=selector=>{const node=document.querySelector(selector);assert.ok(node,selector);return node;};
 const click=selector=>flush(()=>one(selector).click());
 const type=(selector,value)=>flush(()=>{const node=one(selector),proto=node.tagName==="TEXTAREA"?dom.window.HTMLTextAreaElement.prototype:dom.window.HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,"value").set.call(node,value);node.dispatchEvent(new dom.window.Event("input",{bubbles:true}));});
 const {translations}=await import("../frontend/src/i18n.mjs");
 for(const code of ["en","ru","es","pt-BR","de","fr","pl"]){
  await flush(()=>setHostLocale(code));
  assert.equal(one(".ptm").lang,code,"Dashboard follows useI18n().locale");
  assert.ok(one("h1").textContent.startsWith(translations[code].heading));
  assert.equal(one(".ptm-language").value,"auto");
 }
 await flush(()=>{one(".ptm-language").value="ru";one(".ptm-language").dispatchEvent(new dom.window.Event("change",{bubbles:true}));});
 await flush(()=>setHostLocale("de"));assert.equal(one(".ptm").lang,"ru","Manual choice overrides host changes");
 assert.equal(dom.window.localStorage.getItem("ptm.language"),"ru");
 await flush(()=>{one(".ptm-language").value="auto";one(".ptm-language").dispatchEvent(new dom.window.Event("change",{bubbles:true}));});
 assert.equal(one(".ptm").lang,"de");
 await flush(()=>setHostLocale("ja"));assert.equal(one(".ptm").lang,"en","Unsupported host language falls back to English");
 await flush(()=>setHostLocale(undefined));
 Object.defineProperty(dom.window.navigator,"languages",{configurable:true,value:["de-DE"]});
 await flush(()=>dom.window.dispatchEvent(new dom.window.Event("languagechange")));
 assert.equal(one(".ptm").lang,"de","Browser language changes are observed when Hermes is unavailable");
 dom.window.localStorage.setItem("ptm.language","fr");
 await flush(()=>dom.window.dispatchEvent(new dom.window.StorageEvent("storage",{key:"ptm.language",newValue:"fr"})));
 assert.equal(one(".ptm").lang,"fr","Manual selection is synchronized across tabs");
 dom.window.localStorage.setItem("ptm.language","auto");
 await flush(()=>dom.window.dispatchEvent(new dom.window.StorageEvent("storage",{key:"ptm.language",newValue:"auto"})));
 Object.defineProperty(dom.window.navigator,"languages",{configurable:true,value:["en-US"]});
 await flush(()=>setHostLocale("en"));
 assert.equal(document.querySelector(".ptm-editor"),null,"No empty details panel");
 assert.ok(!one(".ptm-workspace").classList.contains("has-details"));
 await click('[data-task-id="a"] > .ptm-row .ptm-task-title');assert.ok(document.querySelector('[data-task-id="child"]'));
 assert.ok(one(".ptm-workspace").classList.contains("has-details"));
 assert.equal(document.querySelectorAll(".ptm-editor").length,1);
 assert.equal(one(".ptm-editor").closest(".ptm-list"),null,"Editor sits beside list");
 assert.equal(one(".ptm-close .ptm-icon-close").getAttribute("aria-hidden"),"true");
 assert.equal(one(".ptm-close").getAttribute("aria-label"),"Close");
 const divider=one(".ptm-divider");
 await flush(()=>divider.dispatchEvent(new dom.window.KeyboardEvent("keydown",{key:"ArrowRight",bubbles:true})));
 assert.equal(one(".ptm-divider").getAttribute("aria-valuenow"),"55");
 await flush(()=>divider.dispatchEvent(new dom.window.MouseEvent("dblclick",{bubbles:true})));
 assert.equal(one(".ptm-divider").getAttribute("aria-valuenow"),"50");
 await type(".ptm-details-width","30");
 assert.equal(one(".ptm-workspace").style.getPropertyValue("--ptm-list-width"),"70%","Setting is details width, not list width");
 assert.equal(JSON.parse(dom.window.localStorage.getItem("ptm.view:http://ptm.test:test")).detailsWidth,30);
 await flush(()=>divider.dispatchEvent(new dom.window.KeyboardEvent("keydown",{key:"ArrowLeft",bubbles:true})));
 await flush(()=>divider.dispatchEvent(new dom.window.MouseEvent("dblclick",{bubbles:true})));
 assert.equal(one(".ptm-divider").getAttribute("aria-valuenow"),"70","Divider reset uses preferred width");
 await click(".ptm-close");await click('[data-task-id="a"] > .ptm-row .ptm-task-title');
 assert.equal(one(".ptm-divider").getAttribute("aria-valuenow"),"70","Reopened panel uses preferred width");
 await type(".ptm-details-width","50");
 const star = '[data-task-id="child"] > .ptm-row .ptm-star-toggle';
 await click(star);
 assert.equal(one(star).getAttribute("aria-pressed"), "true");
 await click(star);
 assert.equal(one(star).getAttribute("aria-pressed"), "false");
 await click('[data-task-id="a"] > .ptm-row .ptm-menu [role="menuitem"]');
 const desc='.ptm-editor [data-draft-key="description"]';await type(desc,"DOM draft");assert.equal(one(desc).value,"DOM draft");
 await click(".ptm-close");
 assert.equal(document.querySelector(".ptm-editor"),null);
 assert.equal(document.querySelector(".ptm-divider"),null);
 assert.ok(!one(".ptm-workspace").classList.contains("has-details"));
 assert.equal(document.activeElement,one('[data-task-id="a"] > .ptm-row .ptm-task-title'));
 await click('[data-task-id="child"] > .ptm-row .ptm-task-title');
 assert.ok(one('[data-task-id="child"] > .ptm-row').classList.contains("is-selected"));
 assert.equal(one('[data-draft-key="child:title"]').value,"child");
 await type('[data-draft-key="child:description"]',"Child draft");
 await click('[data-task-id="a"] > .ptm-row .ptm-task-title');
 assert.equal(one(desc).value,"DOM draft","Draft survives closing and switching tasks");
 one(desc).focus();const focusedDraft=one(desc);
 await flush(()=>setHostLocale("pl"));
 assert.equal(document.activeElement,focusedDraft,"Host language change retains focus");
 assert.equal(one(desc).value,"DOM draft");
 await flush(()=>setHostLocale("en"));
 const same=one(desc);same.focus();s.data.tasks[0].title="Remote title";s.data.tasks[0].revision++;
 await flush(()=>{for(const timer of timers.values())if(timer.ms===3000)timer.fn();});
 assert.equal(one(desc),same);assert.equal(document.activeElement,same);assert.equal(one(desc).value,"DOM draft");assert.equal(one('[data-draft-key="title"]').value,"Remote title");
 await flush(()=>{one(".ptm-language").value="ru";one(".ptm-language").dispatchEvent(new dom.window.Event("change",{bubbles:true}));});
 await flush(()=>one(".ptm-edit").dispatchEvent(new dom.window.Event("submit",{bubbles:true,cancelable:true})));
 assert.equal(s.writes.at(-1).revision,1);assert.equal(one(desc).value,"DOM draft");
 await click('[data-task-id="a"] > .ptm-row .ptm-menu [role="menuitem"]:last-child');assert.ok(one('[role="alertdialog"]'));const before=s.writes.length;
 await click('[role="alertdialog"] button');assert.equal(s.writes.length,before);assert.ok(!document.querySelector('[role="alertdialog"]'));
 await click('[data-task-id="a"] > .ptm-row .ptm-menu [role="menuitem"]:last-child');await click('[role="alertdialog"] button:last-child');assert.equal(s.writes.at(-1).action,"trash");assert.equal(s.data.trash.length,2);
 assert.equal(document.querySelectorAll(".ptm-button").length,0,"Host buttons must not use the standalone fallback class");
 assert.ok([...document.querySelectorAll(".ptm-compact-button")].every(button=>button.classList.contains("ptm-control")),"Host buttons must share explicit control styles");
 assert.ok(document.querySelector(".ptm-add-task.ptm-primary.ptm-control"));
 assert.ok(document.querySelector(".ptm-add button.ptm-compact-button"),"Dashboard compact styling uses its own class");
 assert.equal(document.querySelector(".ptm-editor"),null,"Trashed task closes panel");
 await click('[data-task-id="b"] > .ptm-row .ptm-task-title');
 await flush(()=>one(".ptm-editor").dispatchEvent(new dom.window.KeyboardEvent("keydown",{key:"Escape",bubbles:true})));
 assert.equal(document.querySelector(".ptm-editor"),null);
 await click('[data-task-id="b"] > .ptm-row .ptm-task-title');
 s.data.tasks=s.data.tasks.filter(task=>task.id!=="b");
 await flush(()=>{for(const timer of timers.values())if(timer.ms===3000)timer.fn();});
 assert.equal(document.querySelector(".ptm-editor"),null,"Removed task closes panel on refresh");
 assert.equal(one(".ptm-list > .ptm-add-root").textContent.replace("+", "").trim(),"\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0437\u0430\u0434\u0430\u0447\u0443");
 await click(".ptm-add-root");
 assert.equal(document.activeElement,one(".ptm-add-bottom input"));
 await type(".ptm-add-bottom input","New task from the bottom");
 await flush(()=>one(".ptm-add-bottom").dispatchEvent(new dom.window.KeyboardEvent("keydown",{key:"Escape",bubbles:true})));
 assert.equal(document.querySelector(".ptm-add-bottom"),null);
 assert.equal(document.activeElement,one(".ptm-add-root"));
 await click(".ptm-add-root");
 assert.equal(one(".ptm-add-bottom input").value,"New task from the bottom","Cancel preserves new-task draft");
 await flush(()=>one(".ptm-add-bottom").dispatchEvent(new dom.window.Event("submit",{bubbles:true,cancelable:true})));
 assert.equal(s.writes.at(-1).title,"New task from the bottom");
 assert.ok(!s.writes.at(-1).parent_id,"Bottom add creates a root task");
 assert.equal(document.querySelector(".ptm-add-bottom"),null);
 assert.ok(document.querySelector(".ptm-editor"),"Created task opens its details");
 await flush(()=>root.unmount());assert.equal(timers.size,0);assert.equal(localeListeners.size,0);
 const {createTasksView}=await import("../frontend/src/view.mjs");
 const {createController}=await import("../frontend/src/state.mjs");
 const fallbackRoot=createRoot(document.getElementById("app"));
 const fallback=createController({transport:server().transport});
 await flush(()=>fallbackRoot.render(React.createElement(createTasksView(React),{controller:fallback})));
 assert.ok(document.querySelector(".ptm-add button.ptm-button"),"Standalone fallback owns its button class");
 assert.ok(!document.querySelector(".ptm-task-title.ptm-button"),"Task titles retain their dedicated row styling");
 assert.doesNotMatch(fs.readFileSync("frontend/src/style.css","utf8"),/\[data-slot/);
 await flush(()=>fallbackRoot.unmount());assert.equal(timers.size,0);dom.window.close();
 delete global.window;delete global.document;delete global.HTMLElement;delete global.Node;
 console.log("PASS: actual Dashboard bundle/React DOM, JSON headers, tree, focus, language, stale saves and confirmed Trash");
}
(async()=>{await controllerTests();await domTests();})().catch(error=>{console.error(error);process.exitCode=1;});
