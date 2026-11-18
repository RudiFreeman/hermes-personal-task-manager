"use strict";
// Browser test driver: Node's built-in WebSocket speaks Chromium DevTools.
// This avoids a Playwright dependency and Chrome's minimum desktop window width.
const fs = require("node:fs/promises"), path = require("node:path"), {spawn} = require("node:child_process"), assert = require("node:assert/strict");
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
(async () => {
 const [chromium, casesFile] = process.argv.slice(2), cases = JSON.parse(await fs.readFile(casesFile,"utf8"));
 const output = path.dirname(casesFile), profile = path.join(output,"cdp-profile-"+Date.now());
 const browser = spawn(chromium,["--headless","--disable-gpu","--no-sandbox","--no-first-run","--allow-file-access-from-files","--remote-debugging-port=0","--user-data-dir="+profile,"about:blank"],{windowsHide:true,stdio:"ignore"});
 let socket, send;
 try {
  let port;
  for(let i=0;i<100;i++){
   try{port=(await fs.readFile(path.join(profile,"DevToolsActivePort"),"utf8")).split("\n")[0];break;}catch{await delay(100);}
  }
  if(!port)throw Error("Chromium did not open its test debugging port");
  const target=await(await fetch(`http://127.0.0.1:${port}/json/new?about:blank`,{method:"PUT"})).json();
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{socket.addEventListener("open",resolve,{once:true});socket.addEventListener("error",reject,{once:true});});
  let sequence=0;const pending=new Map();
  socket.addEventListener("message",event=>{
   const message=JSON.parse(event.data),current=pending.get(message.id);
   if(current){pending.delete(message.id);clearTimeout(current.timer);message.error?current.reject(Error(JSON.stringify(message.error))):current.resolve(message.result);}
  });
  send=(method,params={})=>new Promise((resolve,reject)=>{
   const id=++sequence,timer=setTimeout(()=>{pending.delete(id);reject(Error("CDP timeout: "+method));},10000);
   pending.set(id,{resolve,reject,timer});socket.send(JSON.stringify({id,method,params}));
  });
  await send("Page.enable");await send("Runtime.enable");
  await send("Emulation.setEmulatedMedia",{features:[{name:"prefers-color-scheme",value:"dark"}]});
  const results=[];
  for(const entry of cases){
   await send("Emulation.setDeviceMetricsOverride",{width:entry.width,height:1000,deviceScaleFactor:1,mobile:entry.width<=700});
   await send("Page.navigate",{url:entry.url});
   let text;
   for(let i=0;i<150;i++){
    const value=await send("Runtime.evaluate",{expression:"document.querySelector('#review-result')?.textContent",returnByValue:true});
    text=value.result?.value;if(text)break;await delay(50);
   }
   assert.ok(text,"Missing browser results: "+entry.code+" "+entry.width);
   const checks=JSON.parse(text);
   assert.equal(checks.length,2,JSON.stringify(checks));
   for(const check of checks){assert.ok(check.passed,JSON.stringify(checks));assert.equal(check.width,entry.width,"Actual viewport width");}
   results.push(...checks);
   const screenshot=await send("Page.captureScreenshot",{format:"png",captureBeyondViewport:false});
   await fs.writeFile(entry.screenshot,Buffer.from(screenshot.data,"base64"));
   console.log(entry.code,entry.width,"PASS: Dashboard and WebApp");
  }
  await fs.writeFile(path.join(output,"results.json"),JSON.stringify(results,null,2));
  console.log("PASS:",results.length,"locale/surface/viewport combinations at verified viewport widths");
 } finally {
  if(send)await send("Browser.close").catch(()=>{});
  socket?.close();if(browser.exitCode===null)browser.kill();
 }
})().catch(error=>{console.error(error);process.exitCode=1;});
