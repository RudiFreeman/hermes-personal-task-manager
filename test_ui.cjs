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
 const {createController}=await import("./frontend/src/state.mjs");
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
 function DashboardConfirm(props){assert.equal(typeof props.onCancel,"function","Dashboard ConfirmDialog requires onCancel, not onClose");return props.open?React.createElement("div",{role:"alertdialog"},React.createElement("button",{onClick:props.onCancel},props.cancelLabel),React.createElement("button",{onClick:props.onConfirm},props.confirmLabel)):null;}
 dom.window.__HERMES_PLUGIN_SDK__={React,components:{Button:"button",Input:"input",ConfirmDialog:DashboardConfirm},fetchJSON:async(path,options)=>{assert.equal(options.headers["Content-Type"],"application/json");return s.transport(path.replace("/api/plugins/personal-task-manager",""),{...options,body:options.body?JSON.parse(options.body):undefined});}};
 dom.window.__HERMES_PLUGINS__={register:(name,component)=>{assert.equal(name,"personal-task-manager");Page=component;}};
 dom.window.eval(fs.readFileSync("dashboard/dist/index.js","utf8"));
 const root=createRoot(document.getElementById("app"));await flush(()=>root.render(React.createElement(React.StrictMode,null,React.createElement(Page))));
 const one=selector=>{const node=document.querySelector(selector);assert.ok(node,selector);return node;};
 const click=selector=>flush(()=>one(selector).click());
 const type=(selector,value)=>flush(()=>{const node=one(selector),proto=node.tagName==="TEXTAREA"?dom.window.HTMLTextAreaElement.prototype:dom.window.HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,"value").set.call(node,value);node.dispatchEvent(new dom.window.Event("input",{bubbles:true}));});
 await click('[data-task-id="a"] > .ptm-row .ptm-task-title');assert.ok(document.querySelector('[data-task-id="child"]'));
 await click('[data-task-id="a"] > .ptm-row .ptm-menu [role="menuitem"]');
 const desc='[data-task-id="a"] [data-draft-key="description"]';await type(desc,"DOM draft");assert.equal(one(desc).value,"DOM draft");
 const same=one(desc);same.focus();s.data.tasks[0].title="Remote title";s.data.tasks[0].revision++;
 await flush(()=>{for(const timer of timers.values())if(timer.ms===3000)timer.fn();});
 assert.equal(one(desc),same);assert.equal(document.activeElement,same);assert.equal(one(desc).value,"DOM draft");assert.equal(one('[data-draft-key="title"]').value,"Remote title");
 await flush(()=>{one(".ptm-language").value="ru";one(".ptm-language").dispatchEvent(new dom.window.Event("change",{bubbles:true}));});
 await flush(()=>one(".ptm-edit").dispatchEvent(new dom.window.Event("submit",{bubbles:true,cancelable:true})));
 assert.equal(s.writes.at(-1).revision,1);assert.equal(one(desc).value,"DOM draft");
 await click('[data-task-id="a"] > .ptm-row .ptm-menu [role="menuitem"]:last-child');assert.ok(one('[role="alertdialog"]'));const before=s.writes.length;
 await click('[role="alertdialog"] button');assert.equal(s.writes.length,before);assert.ok(!document.querySelector('[role="alertdialog"]'));
 await click('[data-task-id="a"] > .ptm-row .ptm-menu [role="menuitem"]:last-child');await click('[role="alertdialog"] button:last-child');assert.equal(s.writes.at(-1).action,"trash");assert.equal(s.data.trash.length,2);
 await flush(()=>root.unmount());assert.equal(timers.size,0);dom.window.close();
 delete global.window;delete global.document;delete global.HTMLElement;delete global.Node;
 console.log("PASS: actual Dashboard bundle/React DOM, JSON headers, tree, focus, language, stale saves and confirmed Trash");
}
(async()=>{await controllerTests();await domTests();})().catch(error=>{console.error(error);process.exitCode=1;});
