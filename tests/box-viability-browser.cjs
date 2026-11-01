const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',async r=>{try{const f=path.join(__dirname,'../www',new URL(r.request().url()).pathname==='/'?'index.html':decodeURIComponent(new URL(r.request().url()).pathname));await r.fulfill({body:fs.readFileSync(f),contentType:({'.html':'text/html','.js':'application/javascript','.json':'application/json','.png':'image/png','.woff2':'font/woff2'})[path.extname(f)]||'application/octet-stream'})}catch{await r.abort()}});
 await page.goto('http://game.test/');await page.waitForTimeout(500);
 const result=await page.evaluate(()=>{
  const check=(v,m)=>{if(!v)throw Error(m)};
  const p=giveMon({species:'Gardevoir',tier:INDEX.Gardevoir.tier,size:1});
  p.mainSince=null;p.mainSeconds=0;p.pxp=0;
  const physical=Object.keys(MOVE_STATS).find(n=>MOVE_STATS[n][3]==='charged'&&moveCat(MOVE_STATS[n])==='P');
  const special=Object.keys(MOVE_STATS).find(n=>MOVE_STATS[n][3]==='charged'&&moveCat(MOVE_STATS[n])==='S');
  // Use identical power/type/geometry to isolate the attacking stat.
  const original=MOVE_STATS[physical],other=MOVE_STATS[special];
  MOVE_STATS[physical]=['Normal',90,50,'charged'];MOVE_STATS[physical].cat='P';
  MOVE_STATS[special]=['Normal',90,50,'charged'];MOVE_STATS[special].cat='S';
  const score=boxViabilityScorer();p.discMove=physical;const phys=score(p).moves;p.discMove=special;const spec=score(p).moves;
  check(spec>phys,'Special attacker must prefer matching category');
  MOVE_STATS[physical]=original;MOVE_STATS[special]=other;
  const potential=boxViabilityScorer(),ready=boxViabilityScorer('battleReady');
  const snapshot=JSON.stringify(p),a=potential(p).total,b=ready(p).total;p.pxp=19602000;
  check(potential(p).total===a,'Potential must ignore current level');check(ready(p).total>b,'Viability must reward level');
  p.pxp=0;const before=JSON.stringify(p);potential(p);ready(p);check(JSON.stringify(p)===before,'Scoring must not mutate saves');
  for(const species of Object.keys(SPECIES_DATA))for(const mode of ['viability','battleReady']){
   const mon={...p,species,ult:true},s=boxViabilityScorer(mode)(mon);
   check(Number.isFinite(s.total)&&s.total>=0&&s.total<=100,species+' bounded score');
   const parts=['stats','moves','typing','coverage','ultimate'].reduce((a,k)=>a+s[k],0);check(Math.abs(parts-s.total)<1e-9,'Parts sum');
  }
  const ceiling=potential(p).total;db.pokemon.push({...p,id:'unrelated'});check(potential(p).total===ceiling,'Collection independent');db.pokemon.pop();
  const growth=potential({...p,growth:[14,14,14,14,14,14]}).total;check(growth>potential({...p,growth:[1,1,1,1,1,1]}).total,'Growth matters');
  const noUlt=potential({...p,species:'Regirock',ult:false}),yesUlt=potential({...p,species:'Regirock',ult:true});check(yesUlt.ultimate>noUlt.ultimate,'Unlocked Ultimate matters');
  go('collection');changeBoxSort('viability');viewMon(p.id);
  check(document.querySelector('.bx-viability').textContent.includes('Potential'),'Potential panel');
  changeBoxSort('battleReady');check(document.querySelector('.bx-viability').textContent.includes('Viability'),'Ready panel');
  check(!$('boxSortInfo').hidden,'Explanation visible');
  return {species:Object.keys(SPECIES_DATA).length,synergy:true,level:true,growth:true,ultimates:true,savePreservation:true,breakdown:true};
 });
 await page.locator('.bx-viability summary').click();await page.locator('.bx-viability').screenshot({path:process.env.PC_BOX_SCREENSHOT||'/tmp/box-viability.png'});
 assert.deepEqual(errors,[]);console.log('PASS',result);
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
