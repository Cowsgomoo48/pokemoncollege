// node tests/shiny-icons-browser.cjs (serve www on port 8767)
const {chromium}=require(process.env.PC_PLAYWRIGHT||'playwright');
const fs=require('fs'),path=require('path'),vm=require('vm');
(async()=>{
 const root=path.resolve(__dirname,'..'),s=fs.readFileSync(path.join(root,'www/index.html'),'utf8');
 const map=JSON.parse(s.match(/const ICO_MAP=(.*?);/)[1]);
 const failures=[],ok=(v,msg)=>{console.log((v?'PASS ':'FAIL ')+msg);if(!v)failures.push(msg)};
 for(const m of s.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))new vm.Script(m[1]);
 ok(Object.values(map).every(n=>fs.existsSync(path.join(root,'www/assets/ico',n+'.png'))),'Every emoji mapping has a bundled asset');
 const b=await chromium.launch({headless:true,args:['--no-sandbox']});
 const p=await b.newPage({viewport:{width:390,height:844},serviceWorkers:'block'});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:8767/index.html');await p.waitForTimeout(1200);
 const result=await p.evaluate(async()=>{
  const out=[],check=(v,msg)=>out.push([!!v,msg]),pause=()=>new Promise(r=>setTimeout(r,60));
  for(const page of ['home','tasks','safari','collection','shop','minigames']){go(page);await pause();check(document.querySelector('.section.current')?.id===page,'Main screen opens: '+page);check(document.documentElement.scrollWidth<=window.innerWidth,'Phone width fits: '+page)}
  const host=document.createElement('section');host.id='icon-audit';document.body.append(host);
  host.innerHTML=Object.keys(ICO_MAP).map(e=>'<span>'+e+'\uFE0F</span>').join('');await pause();
  check(host.querySelectorAll('img.ico').length===Object.keys(ICO_MAP).length,'All mapped emojis render as images, including variation selectors');
  await Promise.all([...host.querySelectorAll('img')].map(im=>im.decode().catch(()=>{})));
  check([...host.querySelectorAll('img')].every(im=>im.complete&&im.naturalWidth>0),'All replacement images load');
  check([...host.querySelectorAll('img')].every(im=>im.alt&&!/\p{Extended_Pictographic}/u.test(im.alt)),'Replacement images have readable accessible names');
  host.innerHTML='<select><option value="potion">🧪 Potion</option></select><textarea>🔥 user text</textarea><div contenteditable="true">🧊 user note</div><code>🧬 code</code><span id="icon-dynamic">plain</span>';await pause();
  const option=host.querySelector('option');check(option.value==='potion'&&!/🧪/.test(option.textContent),'Native menu keeps value and uses a text label');
  check(host.querySelector('textarea').value==='🔥 user text'&&host.querySelector('[contenteditable]').textContent==='🧊 user note'&&host.querySelector('code').textContent==='🧬 code','Editable text and code remain intact');
  host.querySelector('#icon-dynamic').firstChild.nodeValue='🧪 changed';await pause();
  check(!!host.querySelector('#icon-dynamic img'),'Dynamic text updates receive artwork');
  check(twIco('elite').includes('elite_skull.png')&&!twIco('boss').includes('elite_skull'),'Elite skull is distinct from the Boss crown');
  host.remove();
  const ids=[];for(const species of ['Magearna','Magnezone','Tyranitar']){giveMon({...rollMon(false),species,tier:INDEX[species].tier});ids.push(db.pokemon.at(-1).id)}
  db.tower={tower:true,diff:'hard',style:'game',sids:[],mode:'smart',quick:false,party:ids.map(id=>({id,hp:60,energy:20,starf:null})),floor:0,cleared:0,bag:{},tickets:0,cogs:0,studyMs:0,rooms:0,startedAt:stamp(),slider:true,battle:null,envs:shuffle(Object.keys(TW_ENVS)),cards:{},perkDone:[],bosses:0,challengesWon:0,log:[]};
  dcInitRun(db.tower);dgMode='tower';go('minigames');dgOpen('tower');await pause();if(db.tower.typePick)dcTypePickGo();await pause();
  const r=db.tower;r.tmap.rows[0][0].t='elite';twMapScreen();await pause();
  const icon=document.querySelector('.tw-node.t-elite .tw-elite-skull');check(!!icon,'Elite room node uses the skull in the live Tower map');
  if(icon){await icon.decode().catch(()=>{});check(icon.naturalWidth>0&&icon.getBoundingClientRect().width<=48,'Elite skull loads and fits the room node')}
  check(document.documentElement.scrollWidth<=window.innerWidth,'Phone layout has no horizontal page overflow');
  return out;
 });result.forEach(([v,m])=>ok(v,m));
 await p.screenshot({path:path.join(root,'..','tower-icons-phone.png')});
 ok(errors.length===0,'No JavaScript errors: '+errors.join('; '));await b.close();if(failures.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
