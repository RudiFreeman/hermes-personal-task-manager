"""Check both host adapters in Chromium with synthetic, read-only task data.

Usage: python scripts/check_i18n_layout.py --chromium /path/to/chrome
Requires npm development dependencies. Does not contact Hermes or task databases.
"""
import argparse
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CODES = ["en", "ru", "es", "pt-BR", "de", "fr", "pl"]
CHECKS = r"""
(async()=>{
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 const results=[];
 const check=(condition,message)=>{if(!condition)throw Error(message);};
 try {
  for(let i=0;i<100&&document.querySelectorAll('.ptm[data-loaded=true]').length!==2;i++)await wait(20);
  const apps=[...document.querySelectorAll('.ptm')],code=window.__CHECK_LOCALE__,m=window.__CHECK_MESSAGES__;
  check(apps.length===2,'Both native adapters must mount');
  const pick=(app,value)=>{const select=app.querySelector('.ptm-language');select.value=value;select.dispatchEvent(new Event('change',{bubbles:true}));};
  for(const app of apps){
   check(app.lang===code,'Inherited '+code+' on '+app.dataset.surface);
   check(app.querySelector('h1').textContent.startsWith(m.translations[code].heading),'Localized heading');
   const primary=app.querySelector('.ptm-add-task'),secondary=app.querySelector('.ptm-toolbar button');
   const probe=document.createElement('i');probe.style.backgroundColor='var(--ptm-accent)';app.append(probe);
   check(getComputedStyle(primary).backgroundColor===getComputedStyle(probe).backgroundColor,'Primary follows theme accent');
   check(getComputedStyle(primary).borderRadius===getComputedStyle(secondary).borderRadius,'Consistent control corners');
   probe.remove();
   const input=app.querySelector('.ptm-add input');input.checkValidity();
   check(input.validationMessage===m.translations[code].requiredField,'Localized browser validation');
   input.dispatchEvent(new Event('input',{bubbles:true}));
   app.querySelector('.ptm-settings summary').click();
   const panel=app.querySelector('.ptm-settings-panel').getBoundingClientRect();
   check(panel.left>=0&&panel.right<=innerWidth,'Settings overflow '+app.dataset.surface+' '+code);
   check(app.querySelectorAll('.ptm-language option').length===8,'Auto plus seven languages');
   pick(app,code==='fr'?'de':'fr');
  }
  await wait(60);
  window.__CHECK_SDK__.setLocale('pl');await wait(60);
  for(const app of apps)check(app.lang===(code==='fr'?'de':'fr'),'Manual choice must win');
  for(const app of apps)pick(app,'auto');await wait(60);
  for(const app of apps)check(app.lang==='pl','Returning to automatic');
  window.__CHECK_SDK__.setLocale(code);await wait(60);
  for(const app of apps){
   app.querySelector('.ptm-settings').removeAttribute('open');
   check(app.scrollWidth<=app.clientWidth+1,'App overflow '+app.dataset.surface+' '+code);
   app.querySelector('.ptm-task-title').click();
  }
  await wait(60);
  for(const app of apps){
   check(app.lang===code,'Live inherited language restored');
   const q=s=>app.querySelector(s),c=q('.ptm-close').getBoundingClientRect(),i=q('.ptm-icon-close').getBoundingClientRect();
   check(Math.abs(c.x+c.width/2-i.x-i.width/2)<.5&&Math.abs(c.y+c.height/2-i.y-i.height/2)<.5,'Close icon centered');
   check(app.scrollWidth<=app.clientWidth+1,'Open details overflow');
   check(getComputedStyle(q('.ptm-list-pane')).display===(innerWidth<=700?'none':'flex'),'Responsive details');
   check(q('.ptm-note small').textContent.startsWith(m.translations[code].you),'Translated note author');
   check(q('.ptm-note small').textContent.includes('2026'),'Localized date');
   q('.ptm-close').click();
  }
  await wait(60);
  for(const app of apps){
   const q=s=>app.querySelector(s);
   q('.ptm-menu summary').click();
   const menu=q('.ptm-menu-items').getBoundingClientRect();
   check(menu.left>=0&&menu.right<=innerWidth,'Action menu overflow');
   q('.ptm-menu-items button:last-child').click();
  }
  await wait(60);
  for(const app of apps){
   const dialog=app.querySelector('dialog');check(dialog?.open,'Confirmation opens');
   check(dialog.textContent.includes(m.translations[code].trashQuestion.split('{title}')[0]),'Translated dialog');
   const box=dialog.getBoundingClientRect();check(box.left>=0&&box.right<=innerWidth,'Dialog overflow');
   dialog.querySelector('button').click();
   results.push({surface:app.dataset.surface,locale:code,width:innerWidth,passed:true});
  }
  check(window.__CHECK_ERRORS__.length===0,'Uncaught JavaScript error: '+window.__CHECK_ERRORS__.join(';'));
  // Capture Dashboard on desktop and WebApp on mobile; all assertions ran on both.
  document.getElementById(innerWidth<=700?'dashboard':'webapp').style.display='none';
  document.querySelector('.ptm-task-title')?.focus();
 } catch(error){results.push({error:error.stack});}
 const el=document.createElement('pre');el.id='review-result';el.hidden=true;el.textContent=JSON.stringify(results);document.body.append(el);
})();
"""


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--chromium", required=True)
    parser.add_argument("--output", type=Path, default=ROOT / ".local/i18n-layout")
    args = parser.parse_args()
    args.output = args.output.resolve()
    args.output.mkdir(parents=True, exist_ok=True)
    bundle = args.output / "fixture.js"
    build = """const path=require('path');require('esbuild').build({entryPoints:['tests/fixtures/i18n-layout.mjs'],bundle:true,format:'iife',outfile:process.argv[1],define:{'process.env.NODE_ENV':'\"production\"'},loader:{'.css':'text'},plugins:[{name:'sdk-fixture',setup(b){b.onResolve({filter:/^@hermes\\/plugin-sdk$/},()=>({path:path.resolve('tests/fixtures/i18n-sdk.mjs')}));}}]}).catch(()=>process.exit(1));"""
    subprocess.run(["node", "-e", build, str(bundle)], cwd=ROOT, check=True)
    task = dict(id="review", parent_id=None, title="Release review", description="Review the next release.", done=False, starred=False, revision=1, trashed_at=None)
    data = dict(tasks=[task], trash=[], comments=[dict(id=1, task_id="review", actor="user", body="Review notes", created_at="2026-11-18T12:30:00Z")], events=[], progress=dict(total=12345, done=0, percent=0))
    css = (ROOT / "frontend/src/style.css").read_text(encoding="utf-8")
    all_results = []
    for code in CODES:
        for width in [1200, 360]:
            page = args.output / (code + "-" + str(width) + ".html")
            boot = "window.__CHECK_LOCALE__=" + json.dumps(code) + ";window.__CHECK_DATA__=" + json.dumps(data) + ";localStorage.setItem('ptm.language','auto');window.__CHECK_ERRORS__=[];window.addEventListener('error',e=>window.__CHECK_ERRORS__.push(e.message));"
            content = '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html{color-scheme:dark}body{margin:0;font:14px system-ui;background:#171719;--background-base:#202024;--foreground-base:#eeeef0;--color-muted:#2c2c32;--color-border:#414148;--color-muted-foreground:#aaaab3;--color-primary:#74a1ff;--ui-bg-editor:#202024;--ui-bg-hover:#2c2c32;--ui-stroke-secondary:#414148;--ui-text-primary:#eeeef0;--ui-text-secondary:#aaaab3;--ui-accent:#74a1ff}</style><style>' + css + '</style><div id="dashboard"></div><div id="webapp"></div><script>' + boot + '</script><script src="' + bundle.as_uri() + '"></script><script>' + CHECKS + '</script>'
            # Checks start after the asynchronous adapter modules have mounted.
            content = content.replace('<script>' + CHECKS, '<script>setTimeout(()=>{' + CHECKS).replace(CHECKS + '</script>', CHECKS + '},100);</script>')
            page.write_text(content, encoding="utf-8")
            all_results.append({"code": code, "width": width, "url": page.as_uri(), "screenshot": str(page.with_suffix(".png"))})
    cases = args.output / "cases.json"
    cases.write_text(json.dumps(all_results), encoding="utf-8")
    subprocess.run(["node", str(ROOT / "tests/fixtures/capture-layout.cjs"), args.chromium, str(cases)], cwd=ROOT, check=True)



if __name__ == "__main__":
    main()
