// ===================== GENDERS · STUDY HALL · NURSERY =====================
// Genders: assigned once per Pokémon (legendaries and genderless species have none)
const GENDERLESS=new Set(['Magnemite','Magneton','Magnezone','Voltorb','Electrode','Staryu','Starmie','Porygon','Porygon2','Porygon-Z','Beldum','Metang','Metagross','Bronzor','Bronzong','Klink','Klang','Klinklang','Golett','Golurk','Rotom','Carbink','Minior','Dhelmise','Sinistea','Polteageist','Baltoy','Claydol','Lunatone','Solrock','Shedinja','Cryogonal','Ditto','Unown']);
const FEMALE_ONLY=new Set(['Hatenna','Hattrem','Hatterene','Froslass','Salazzle','Vespiquen','Combee','Kangaskhan','Miltank','Chansey','Blissey','Happiny','Jynx','Smoochum','Nidoran♀','Nidorina','Nidoqueen','Petilil','Lilligant','Vullaby','Mandibuzz','Flabébé','Floette','Florges','Bounsweet','Steenee','Tsareena']);
const MALE_ONLY=new Set(['Gallade','Tyrogue','Hitmonlee','Hitmonchan','Hitmontop','Throh','Sawk','Rufflet','Braviary','Tauros','Nidoran♂','Nidorino','Nidoking','Impidimp','Morgrem','Grimmsnarl','Mothim','Tinkatink']);
function monGender(p){if(!p)return null;if(p.gender!==undefined)return p.gender;const sp=p.species,t=INDEX[sp]?INDEX[sp].tier:0;p.gender=t>=4||GENDERLESS.has(sp)?null:FEMALE_ONLY.has(sp)?'F':MALE_ONLY.has(sp)?'M':Math.random()<.5?'M':'F';return p.gender}
function monGenderHTML(p){const g=monGender(p);return g==='M'?'<span class="g-m">♂\uFE0E</span>':g==='F'?'<span class="g-f">♀\uFE0E</span>':''}
// ---------- shared answer hook: called for every study answer ----------
function facAnswer(ok,full){try{if(!db||!db.facilities)return;if(full){studyAnswer();nurseryAnswer()}}catch(e){}}
// ---------- Study Hall: the Pokémon inside earns EXP for every fully correct answer you give ----------
Object.assign(FAC,{study:{name:'Study Hall',icon:'📚',item:'fac_study',bg:'./assets/fac/study.jpg',verb:'opened its books!',
 levels:[null,...Array.from({length:10},(_,i)=>({xp:Math.round(400*(1+.1*i)),cogs:i>=8?3:i>=5?2:i>=2?1:0}))],
 status:id=>{const f=facs()[id],p=facMon(f),B=facBonus(id);return p?'📖 '+facName(p)+' · +'+money(B.xp)+' EXP per correct answer · '+(f.today||0)+' today':'Empty: tap, then “Choose Pokémon”'},
 info:id=>studyInfo(id)}});
function studyAnswer(){const f=facs().study;if(!f)return;const p=facMon(f);if(!p)return;const B=facBonus('study'),ev=[],day=new Date().toDateString();if(f.day!==day){f.day=day;f.today=0}
 f.today=(f.today||0)+1;f.n=(f.n||0)+1;facGain('study',p,B.xp,ev);if(B.cogs&&f.n%10===0){db.cogs=Math.round((db.cogs||0)+B.cogs);ev.push('📚 Study Hall: +'+B.cogs+' Cogs for 10 correct answers')}if(ev.length)setTimeout(()=>toast(ev.join(' · ')),400)}
function studyInfo(id){const f=facs()[id],L=facLv(f),next=L<10?FAC_XP[L+1]:null,p=facMon(f);
 modal('📚 STUDY HALL · LV '+L,'<p class="small">'+(p?esc(facName(p))+' is studying here. ':'Nobody is studying here yet. ')+'Every question you answer fully correctly (first try, no Make-Up or Halfsies) gives the Pokémon here EXP, and the Study Hall earns the same. From Lv 3 it also pays Cogs for every 10 correct answers.</p>'
  +'<div class="fac-xp"><span style="width:'+(next?Math.min(100,((f.xp||0)-FAC_XP[L])/(next-FAC_XP[L])*100):100)+'%"></span></div><p class="small muted">'+(next?money(Math.round((f.xp||0)-FAC_XP[L]))+' / '+money(next-FAC_XP[L])+' Facility EXP to Lv '+(L+1)+' · Facility Tickets add a level':'Max level')+'</p>'
  +'<table class="fac-tbl"><tr><th>Level</th><th>EXP per answer</th><th>Cogs per 10</th></tr>'+FAC.study.levels.slice(1).map((b,i)=>'<tr'+(i+1===L?' class="on"':'')+'><td>Lv '+(i+1)+'</td><td>+'+money(b.xp)+'</td><td>'+(b.cogs||'—')+'</td></tr>').join('')+'</table>'
  +'<p class="small muted">Answers so far: '+money(f.n||0)+' · today: '+(f.today||0)+'</p><div class="actions">'+(inv().facticket&&L<10?'<button class="btn blue" onclick="facTicketUse(\''+id+'\')">USE FACILITY TICKET</button>':'')+'<button class="btn" onclick="closeModal()">CLOSE</button></div>')}
window.facPick_study=pid=>facPlace('study',pid);
// ---------- Nursery: two parents (♀ + ♂, sharing a type, no legendaries) breed an egg, then the egg hatches ----------
// Each phase takes 6 hours at Lv 1 (5% less per level). Every fully correct answer makes the current phase run 1% faster (more per level), stacking.
Object.assign(FAC,{nursery:{name:'Nursery',icon:'🥚',item:'fac_nursery',bg:'./assets/fac/nursery.jpg',verb:'',
 levels:[null,...Array.from({length:10},(_,i)=>({hrs:+(6*(1-.05*i)).toFixed(2),per:+(1+.1*i).toFixed(1)}))],
 status:id=>nurStatus(),info:id=>nurInfo(),draw:id=>nurDraw(),tray:id=>nurTray()}});
function nur(){const f=facs().nursery;if(f){f.phase=f.phase||'idle';f.speed=f.speed||1}return f}
const NUR_SHINY=1/4096;
function nurRoot(sp){let s=sp,g=0;while(PRE_EVO[s]&&PRE_EVO[s]!==s&&g++<5)s=PRE_EVO[s];return s}
function nurTypes(p){return (SPECIES_DATA[p.species]||{types:[]}).types.map(t=>String(t).toLowerCase())}
const NUR_BABY=new Set(['Pichu','Cleffa','Igglybuff','Togepi','Tyrogue','Smoochum','Elekid','Magby','Azurill','Wynaut','Budew','Chingling','Bonsly','Mime Jr.','Happiny','Munchlax','Riolu','Mantyke','Toxel']);
const nurDitto=p=>p&&p.species==='Ditto';
function nurCan(p){return p&&(INDEX[p.species]?INDEX[p.species].tier:0)<4&&!NUR_BABY.has(p.species)&&(monGender(p)!==null||nurDitto(p))&&!inRun(p.id)}
// a Pokémon that is breeding can't be changed (like one on a dungeon run)
function nurBusy(id){const f=db&&db.facilities&&db.facilities.nursery;return !!f&&f.phase==='breeding'&&(f.mother===id||f.father===id)}
function nurPair(f){const m=f&&db.pokemon.find(p=>p.id===f.mother),d=f&&db.pokemon.find(p=>p.id===f.father);return {m,d}}
function nurOdds(m,d){if(!m||!d)return null;const dm=nurDitto(m),dd=nurDitto(d);if(dm&&dd)return {bad:'Two Ditto can’t breed with each other.'};const shared=dm||dd||nurTypes(m).some(t=>nurTypes(d).includes(t));if(!shared)return {bad:'These two don’t share a type, so they can’t breed.'};
 const rm=nurRoot(m.species),rd=nurRoot(d.species),same=rm===rd,shM=1+[m,d].reduce((a,p)=>a+(p.shiny?1:0)+(nurDitto(p)?.25:0),0),cM=1+.15*[m,d].filter(p=>p.costume).length,sh=NUR_SHINY*shM*(1+.05*(facLv(facs().nursery)-1)),opts=dm?[{sp:rd,p:1}]:dd?[{sp:rm,p:1}]:same?[{sp:rm,p:1}]:[{sp:rm,p:.7},{sp:rd,p:.3}];
 return {shiny:sh,opts,fast:dd?null:d.fastMove,disc:dd?null:d.discMove,moveP:dd?0:.3,costume:cM>1?cM:0,shM,cM,ditto:dm||dd}}
function nurDur(){return facBonus('nursery').hrs*36e5}
// ---------- Eggs: kept in db.eggs (bag) and hatched in Nursery nests ----------
const EGG_MIN=[60,90,120,180,360],EGG_COGS=[3,6,12,25,50],NEST_LV=[1,4,6];
function eggs(){return db.eggs||(db.eggs=[])}
const eggVal=e=>Math.round(EGG_COGS[Math.min(4,e.tier||0)]*(e.src==='breed'?.1:1));
const eggDur=e=>EGG_MIN[Math.min(4,e.tier||0)]*6e4*(facs().nursery?facBonus('nursery').hrs/6:1);
const nestsOpen=()=>{const f=facs().nursery;if(!f)return 0;const L=facLv(f);return NEST_LV.filter(l=>L>=l).length};
function eggAdd(e){e.id=e.id||uid();e.at=e.at||Date.now();eggs().push(e);return e}
// Totem / Alpha rewards arrive as eggs (their boosted growth and size are kept; shiny is rolled on hatching)
function eggFromBoss(m,kind){return eggAdd({sp:m.species,tier:m.tier||0,shinyP:1/4096+.05,growth:m.growth,size:m.size,src:kind})}
function nestArr(f){f.nests=f.nests||[null,null,null];return f.nests}
function nurTick(now){const f=nur();if(!f)return [];now=now||Date.now();const ev=[];
 if(f.phase==='egg'){if(f.egg){const e=f.egg;nestArr(f)[0]=nestArr(f)[0]||{egg:eggAdd({sp:e.sp,tier:INDEX[e.sp]?INDEX[e.sp].tier:0,shinyP:e.shiny?1:NUR_SHINY,growth:e.growth,fast:e.fast,disc:e.disc,moveP:1,costumeM:e.costume?1.15:1,src:'breed'}),prog:f.prog||0,dur:0,speed:f.speed||1,last:now};eggs().pop();f.egg=null}const {m,d}=nurPair(f);f.phase=m&&d?'breeding':'idle';f.prog=0;f.speed=1;f.dur=nurDur()}
 // hatching nests
 nestArr(f).forEach((n,i)=>{if(!n)return;n.dur=n.dur||eggDur(n.egg);n.prog=(n.prog||0)+Math.max(0,now-(n.last||now))*(n.speed||1);n.last=now;if(n.prog<n.dur)return;
  const e=n.egg,g=rollGrowth().map((v,k)=>e.growth&&e.growth[k]!=null?e.growth[k]:v),shiny=Math.random()<(e.shinyP||NUR_SHINY);
  const cm=e.costumeM||(e.costume?1.15:1),costume=RARE_COSTUMES[e.sp]&&Math.random()<cm/2048?RARE_COSTUMES[e.sp].id:Math.random()<cm/496?seasonCostume():null;
  const mm=giveMon({species:e.sp,tier:e.tier,shiny,costume:costume||null,size:e.size||rollSize(),growth:g}),fast=e.fast&&Math.random()<(e.moveP??.3)?e.fast:null,disc=e.disc&&Math.random()<(e.moveP??.3)?e.disc:null;
  if(fast)mm.fastMove=fast;if(disc)mm.discMove=disc;mm.hatched=true;monGender(mm);f.xp=(f.xp||0)+150000;f.hatched=(f.hatched||0)+1;f.nests[i]=null;
  ev.push('🐣 An egg hatched: '+(shiny?'✨ Shiny ':'')+(costume?'costumed ':'')+e.sp+' '+monGenderHTML(mm).replace(/<[^>]+>/g,'')+' joined your Box!'+(fast||disc?' It learned '+(fast&&disc?fast+' and '+disc:fast||disc)+' from its father.':''))});
 if(f.phase==='idle'){f.last=now;return ev}
 const {m,d}=nurPair(f);if(!m||!d){f.phase='idle';return ev}
 f.prog=(f.prog||0)+Math.max(0,now-(f.last||now))*(f.speed||1);f.last=now;
 if(f.prog>=f.dur){const o=nurOdds(m,d);if(!o||o.bad){f.phase='idle';return ev}let r=Math.random(),sp=o.opts[0].sp;for(const x of o.opts){if(r<x.p){sp=x.sp;break}r-=x.p}
  eggAdd({sp,tier:INDEX[sp]?INDEX[sp].tier:0,shinyP:o.shiny,costumeM:o.cM,fast:o.fast,disc:o.disc,moveP:o.moveP,growth:[0,1,2,3,4,5].map(i=>Math.random()<.5?monGrowth(Math.random()<.5?m:d)[i]:null),src:'breed',from:[facName(m),facName(d)]});
  f.prog=0;f.dur=nurDur();f.speed=1;ev.push('🥚 Nursery: '+facName(m)+' and '+facName(d)+' left an egg! It’s in your Bag; put it in a nest to hatch it.')}
 return ev}
function nurseryAnswer(){const f=nur();if(!f)return;nurTick();const per=facBonus('nursery').per/100;if(f.phase==='breeding')f.speed=+((f.speed||1)+per).toFixed(4);nestArr(f).forEach(n=>{if(n)n.speed=+((n.speed||1)+per).toFixed(4)});save()}
function nurLeft(f){return Math.max(0,(f.dur-(f.prog||0))/(f.speed||1))}
function nurStatus(){const f=nur();if(!f)return '';const h=nestArr(f).filter(Boolean).length,eg=h?' · 🥚 '+h+' hatching':'';if(f.phase==='breeding')return '💞 Breeding · egg in ~'+fmtHM(nurLeft(f))+' · speed ×'+(f.speed||1).toFixed(2)+eg;return (h?'🥚 '+h+' hatching':'Empty')+': tap to choose two parents'}
let nurSel={mother:null,father:null};
function nurOpen(){const f=nur();if(!f)return;if(f.phase!=='idle'){nurInfo();return}nurSel={mother:f.mother||null,father:f.father||null};nurMenu()}
function nurMenu(){const m=db.pokemon.find(p=>p.id===nurSel.mother),d=db.pokemon.find(p=>p.id===nurSel.father),o=nurOdds(m,d),ok=o&&!o.bad;
 const slot=(p,role,label)=>'<button class="nur-slot '+(p?'full':'')+'" onclick="nurPick(\''+role+'\')">'+(p?monSprite(p,'',64)+'<b>'+esc(facName(p))+' '+monGenderHTML(p)+'</b>':'<span class="nur-plus">＋</span><b>'+label+'</b>')+'</button>';
 const stats=ok?'<div class="nur-stats"><div><span>Shiny chance</span><b>1 in '+money(Math.round(1/o.shiny))+(o.shM>1?' (×'+o.shM+')':'')+'</b></div><div><span>Rarity bucket</span><b>'+o.opts.map(x=>RARITIES[INDEX[x.sp]?INDEX[x.sp].tier:0]).filter((v,i,a)=>a.indexOf(v)===i).join(' / ')+'</b></div><div><span>Species chance</span><b>'+o.opts.map(x=>esc(x.sp)+' '+Math.round(x.p*100)+'%').join(' · ')+'</b></div>'+(o.moveP?'<div><span>From father</span><b>'+Math.round(o.moveP*100)+'% '+esc(o.fast)+' · '+Math.round(o.moveP*100)+'% '+esc(o.disc)+'</b></div>':'')+(o.cM>1?'<div><span>Costume chance</span><b>×'+o.cM.toFixed(2)+' (costumed parent)</b></div>':'')+(o.ditto?'<div><span>Ditto</span><b>Takes after the partner · shiny +0.25×</b></div>':'')+'<div><span>Time</span><b>'+fmtHM(nurDur())+' to breed, then hatch it in a nest</b></div></div>':'<p class="small muted nur-hint">'+(o&&o.bad?o.bad:'Choose a ♀ mother and a ♂ father that share a type (no legendaries or babies). Ditto can stand in for either.')+'</p>';
 modal('🥚 NURSERY','<div class="nur '+(m&&d?'paired':'')+' '+(ok?'ok':'')+'"><div class="nur-row">'+slot(m,'mother','♀ Mother')+slot(d,'father','♂ Father')+'</div>'
  +'<svg class="nur-lines" viewBox="0 0 200 60" preserveAspectRatio="none"><path class="ln" d="M40 0 V24 H100"/><path class="ln" d="M160 0 V24 H100"/><path class="ar" d="M100 24 V52 M92 44 L100 54 L108 44"/></svg>'
  +'<div class="nur-egg">'+(typeof icoHTML==='function'?icoHTML('egg'):'🥚')+'</div>'+stats
  +'<div class="actions"><button class="btn" onclick="closeModal()">CLOSE</button><button class="btn red" '+(ok?'':'disabled')+' onclick="nurStart()">START BREEDING</button></div></div>')}
function nurPick(role){const want=role==='mother'?'F':'M',other=role==='mother'?nurSel.father:nurSel.mother,op=db.pokemon.find(p=>p.id===other);
 const list=db.pokemon.filter(p=>p.id!==db.mainId&&p.id!==other&&nurCan(p)&&(nurDitto(p)?!nurDitto(op):monGender(p)===want)&&!facOf(p.id)&&(!op||nurDitto(p)||nurDitto(op)||nurTypes(p).some(t=>nurTypes(op).includes(t))));
 if(!list.length){toast('No '+(want==='F'?'♀':'♂')+' Pokémon that can breed'+(op?' with '+facName(op):'')+' (not legendary or a baby, not your companion, not on a run or in a Facility'+(op?', sharing a type':'')+'). Ditto can breed with anything.');return}
 monChooser('CHOOSE '+(role==='mother'?'♀ MOTHER':'♂ FATHER'),list,'nurSet_'+role,'<p class="small muted">'+(op?'Showing Pokémon that share a type with '+esc(facName(op))+'.':'Pick a '+(want==='F'?'female':'male')+' Pokémon.')+'</p>')}
window.nurSet_mother=id=>{nurSel.mother=id;nurMenu()};window.nurSet_father=id=>{nurSel.father=id;nurMenu()};
function nurStart(){const f=nur(),m=db.pokemon.find(p=>p.id===nurSel.mother),d=db.pokemon.find(p=>p.id===nurSel.father),o=nurOdds(m,d);if(!f||!o||o.bad)return;
 f.mother=m.id;f.father=d.id;f.phase='breeding';f.prog=0;f.dur=nurDur();f.speed=1;f.last=Date.now();save();closeModal();drawHabitat();toast('💞 '+facName(m)+' and '+facName(d)+' are in the Nursery. An egg in about '+fmtHM(f.dur)+'.')}
function nurRemove(){const f=nur();if(!f)return;f.mother=f.father=null;f.phase='idle';f.prog=0;save();drawHabitat();toast('The parents left the Nursery')}
function nurTray(){const f=nur();return '<div class="tray-actions fac-actions">'+(f.phase==='idle'?'<button class="btn smallbtn red" onclick="nurOpen()">＋ CHOOSE PARENTS</button>':'<button class="btn smallbtn red" onclick="nurInfo()">💞 BREEDING</button><button class="btn smallbtn" onclick="nurRemove()">REMOVE PARENTS</button>')+'<button class="btn smallbtn" onclick="nestOpen(0)">🪺 NESTS</button><button class="btn smallbtn" onclick="nurInfo()">LV '+facLv(f)+' · INFO</button><button class="btn smallbtn" onclick="hab.edit=!hab.edit;drawHabitat()">'+(hab.edit?'✓ DONE':'✎ DECOR')+'</button><button class="btn smallbtn" onclick="closeHabitat()">✕</button></div>'}
function nurInfo(){const f=nur(),L=facLv(f),next=L<10?FAC_XP[L+1]:null,{m,d}=nurPair(f),B=facBonus('nursery');
 const cur=f.phase==='idle'?'<p class="small">Nobody is breeding right now.</p>':'<div class="nur-now"><div class="nur-pair">'+(m?monSprite(m,'',48):'')+(d?monSprite(d,'',48):'')+'</div><p><b>💞 '+esc(facName(m))+' and '+esc(facName(d))+' are breeding</b><br>Egg in about '+fmtHM(nurLeft(f))+' · speed ×'+(f.speed||1).toFixed(2)+'</p><div class="fac-xp"><span style="width:'+Math.min(100,(f.prog||0)/f.dur*100)+'%"></span></div></div>';
 modal('🥚 NURSERY · LV '+L,cur+'<p class="small">Put a ♀ and a ♂ that share a type (no legendaries or babies) in the Nursery; Ditto can pair with anything and gives a small shiny boost. Each shiny parent adds +1× to the shiny odds and Ditto adds +0.25× (a shiny Ditto +1.25×); each costumed parent adds +0.15× to the costume odds. Parents are locked while they breed. After the breeding time they leave an egg in your Bag. Totems and Alphas also give eggs.</p><p class="small">Put eggs in the nests to hatch them (1 nest at Lv 1, 2 at Lv 4, 3 at Lv 6). Hatching takes '+EGG_MIN.map((m,i)=>RARITIES[i]+' '+fmtHM(m*6e4*B.hrs/6)).join(' · ')+'. An egg can’t leave its nest once it starts. Each fully correct answer makes breeding and every hatching egg '+B.per+'% faster; each egg keeps its own bonus.</p>'
  +'<div class="fac-xp"><span style="width:'+(next?Math.min(100,((f.xp||0)-FAC_XP[L])/(next-FAC_XP[L])*100):100)+'%"></span></div><p class="small muted">'+(next?money(Math.round((f.xp||0)-FAC_XP[L]))+' / '+money(next-FAC_XP[L])+' Facility EXP to Lv '+(L+1):'Max level')+'</p>'
  +'<table class="fac-tbl"><tr><th>Level</th><th>Breed time</th><th>Speed per answer</th><th>Nests</th></tr>'+FAC.nursery.levels.slice(1).map((b,i)=>'<tr'+(i+1===L?' class="on"':'')+'><td>Lv '+(i+1)+'</td><td>'+fmtHM(b.hrs*36e5)+'</td><td>+'+b.per+'%</td><td>'+NEST_LV.filter(l=>i+1>=l).length+'</td></tr>').join('')+'</table>'
  +'<p class="small muted">Eggs hatched: '+(f.hatched||0)+'</p><div class="actions">'+(f.phase==='idle'?'<button class="btn red" onclick="nurOpen()">CHOOSE PARENTS</button>':'')+(inv().facticket&&L<10?'<button class="btn blue" onclick="facTicketUse(\'nursery\')">USE FACILITY TICKET</button>':'')+'<button class="btn" onclick="closeModal()">CLOSE</button></div>')}
// ---------- egg menus ----------
const eggIco=(e,c='')=>'<span class="egg-ico r'+Math.min(4,e.tier||0)+' '+c+'">'+(typeof icoHTML==='function'?icoHTML('egg'):'🥚')+'</span>';
const eggSrc=e=>e.src==='totem'?'Totem egg':e.src==='alpha'?'Alpha egg':e.src==='adv'?'Advancement egg':e.from?'From '+e.from.join(' & '):'Nursery egg';
function eggStatsHTML(e,n){const g=[0,1,2,3,4,5].map(i=>e.growth&&e.growth[i]!=null?GRADES[e.growth[i]-1]||'?':'?');
 return '<div class="nur-stats"><div><span>Rarity</span><b>'+RARITIES[Math.min(4,e.tier||0)]+'</b></div><div><span>Source</span><b>'+esc(eggSrc(e))+'</b></div>'
  +'<div><span>Likely growth</span><b>'+FAC_STATS.map((s,i)=>s+' '+g[i]).join(' · ')+'</b></div><div><span>Shiny chance</span><b>'+(e.shinyP>=1?'Shiny!':'1 in '+money(Math.round(1/(e.shinyP||NUR_SHINY))))+'</b></div>'
  +'<div><span>Inherited moves</span><b>'+(e.fast||e.disc?[e.fast,e.disc].filter(Boolean).map(m=>Math.round((e.moveP??.3)*100)+'% '+esc(m)).join(' · '):'None')+'</b></div>'+(e.costumeM>1||e.costume?'<div><span>Costume chance</span><b>×'+(e.costumeM||1.15).toFixed(2)+'</b></div>':'')
  +'<div><span>Hatch time</span><b>'+(n?fmtHM(Math.max(0,(n.dur-n.prog)/(n.speed||1)))+' left · speed ×'+(n.speed||1).toFixed(2):fmtHM(eggDur(e)))+'</b></div></div>'}
function eggInvHTML(){return eggs().map(e=>'<button class="inv-slot egg-slot t'+Math.min(3,e.tier||0)+'" onclick="eggInfo(\''+e.id+'\')">'+eggIco(e)+'<b>'+RARITIES[Math.min(4,e.tier||0)].replace('Very ','V.')+'</b></button>').join('')}
function eggInfo(id){const e=eggs().find(x=>x.id===id);if(!e)return;const free=facs().nursery?nestArr(nur()).slice(0,nestsOpen()).findIndex(n=>!n):-1;
 modal('🥚 '+RARITIES[Math.min(4,e.tier||0)].toUpperCase()+' EGG','<div class="nur egg-menu">'+eggIco(e,'big')+eggStatsHTML(e)+'</div><div class="actions"><button class="btn" onclick="eggRelease(\''+id+'\')">RELEASE · +'+eggVal(e)+' COGS</button>'+(free>=0?'<button class="btn red" onclick="nestSel=\''+id+'\';nestOpen('+free+')">PUT IN A NEST</button>':'')+'</div>'+(facs().nursery?'':'<p class="small muted">Unlock the Nursery to hatch eggs.</p>'))}
function eggRelease(id){const e=eggs().find(x=>x.id===id);if(!e)return;modal('RELEASE EGG','<p class="small">Release this '+RARITIES[Math.min(4,e.tier||0)]+' egg for '+eggVal(e)+' Cogs? This cannot be undone.</p><div class="actions"><button class="btn" onclick="eggInfo(\''+id+'\')">CANCEL</button><button class="btn red" onclick="eggReleaseDo(\''+id+'\')">RELEASE</button></div>')}
function eggReleaseDo(id){const e=eggs().find(x=>x.id===id);if(!e)return;db.eggs=eggs().filter(x=>x!==e);db.cogs=Math.round(db.cogs+eggVal(e));save();closeModal();render();try{drawInv()}catch(_){}toast('Egg released · +'+eggVal(e)+' Cogs')}
let nestSel=null;
function nestOpen(i){const f=nur();if(!f)return;nurTick();const open=nestsOpen(),n=nestArr(f)[i];
 const tabs='<div class="nest-tabs">'+[0,1,2].map(k=>'<button class="'+(k===i?'on':'')+(k>=open?' lock':'')+'" onclick="'+(k>=open?'toast(\'Nest '+(k+1)+' opens at Nursery Lv '+NEST_LV[k]+'\')':'nestOpen('+k+')')+'">'+(k>=open?'🔒':nestArr(f)[k]?'🥚':'🪺')+' Nest '+(k+1)+'</button>').join('')+'</div>';
 if(i>=open){toast('Nest '+(i+1)+' opens at Nursery Lv '+NEST_LV[i]);return}
 if(n){modal('🪺 NEST '+(i+1),tabs+'<div class="nur egg-menu">'+eggIco(n.egg,'big wob')+'<div class="fac-xp"><span style="width:'+Math.min(100,n.prog/n.dur*100)+'%"></span></div>'+eggStatsHTML(n.egg,n)+'<p class="small muted">This egg is hatching and can’t be taken out.</p></div><div class="actions"><button class="btn" onclick="closeModal()">CLOSE</button></div>');return}
 const e=eggs().find(x=>x.id===nestSel);if(!e)nestSel=null;
 modal('🪺 NEST '+(i+1),tabs+'<div class="nest-confirm'+(e?' full':'')+'">'+(e?eggIco(e,'big')+eggStatsHTML(e):'<span class="nur-plus">＋</span><b>Choose an egg below</b>')+'</div>'
  +'<p class="small"><b>Your eggs</b></p><div class="nest-eggs">'+(eggs().length?eggs().map(x=>'<button class="inv-slot egg-slot t'+Math.min(3,x.tier||0)+(x.id===nestSel?' on':'')+'" onclick="nestSel=\''+x.id+'\';nestOpen('+i+')">'+eggIco(x)+'<b>'+RARITIES[Math.min(4,x.tier||0)].replace('Very ','V.')+'</b></button>').join(''):'<span class="small muted">No eggs. Breed Pokémon here, or beat Totems and Alphas.</span>')+'</div>'
  +'<div class="actions"><button class="btn" onclick="nestSel=null;closeModal()">CLOSE</button><button class="btn red" '+(e?'':'disabled')+' onclick="nestStart('+i+')">START HATCHING</button></div>')}
function nestStart(i){const f=nur(),e=eggs().find(x=>x.id===nestSel);if(!f||!e||i>=nestsOpen()||nestArr(f)[i])return;db.eggs=eggs().filter(x=>x!==e);f.nests[i]={egg:e,prog:0,dur:eggDur(e),speed:1,last:Date.now()};nestSel=null;save();closeModal();drawHabitat();toast('🥚 The egg is warming up in Nest '+(i+1)+' · hatches in '+fmtHM(f.nests[i].dur))}
function nestsHTML(){const f=nur(),open=nestsOpen();return [0,1,2].map(i=>{const n=nestArr(f)[i];return '<button class="nest'+(i>=open?' lock':'')+(n?' busy':'')+'" onclick="event.stopPropagation();nestOpen('+i+')">'+(i>=open?'<span>🔒</span><small>Lv '+NEST_LV[i]+'</small>':n?eggIco(n.egg,'wob')+'<small>'+fmtHM(Math.max(0,(n.dur-n.prog)/(n.speed||1)))+'</small>':'<span>＋</span><small>Nest '+(i+1)+'</small>')+'</button>'}).join('')}
setInterval(()=>{const el=$('nurNests');if(el&&db&&facs().nursery){nurTick();el.innerHTML=nestsHTML()}},20000);
async function nurDraw(){const box=$('pasture');if(!box)return;let el=$('facMon');const f=nur(),{m,d}=nurPair(f),sig=f.phase+'|'+(m?m.id:'')+'|'+(d?d.id:'');
 let ne=$('nurNests');if(!ne){ne=document.createElement('div');ne.id='nurNests';ne.className='nur-nests';box.appendChild(ne)}ne.innerHTML=nestsHTML();
 if(el&&el.dataset.sig===sig)return;
 if(!el){el=document.createElement('div');el.id='facMon';box.appendChild(el)}el.className='fac-mon nur-scene';el.dataset.sig=sig;el.style.cssText='';
 el.innerHTML=f.phase!=='idle'&&m&&d?'<span class="nur-p">'+monSprite(m,'',60)+'</span><span class="nur-heart">💞</span><span class="nur-p">'+monSprite(d,'',60)+'</span>':''}
window.facPick_nursery=()=>nurOpen();
// ---------- Landfill: a Pokémon runs the press; bag items go on the pile and are crushed one by one ----------
// Each crushed item fills the gauge by its rarity; a full gauge produces a ticket or box.
const LF_PTS=[8,15,30,60],LF_ODDS=[45,33,17,5],LF_XP_ITEM=600,LF_XP_MAKE=15000,LF_OUT=['ticket','expticket','shinyticket','reroll','hasten','facticket','box','monticket'];
Object.assign(FAC,{landfill:{name:'Landfill',icon:'🗜️',item:'fac_landfill',bg:'./assets/fac/landfill.jpg',verb:'took control of the press!',
 levels:[null,...Array.from({length:10},(_,i)=>({min:+(10*(1-.05*i)).toFixed(1),fill:+(1+.1*i).toFixed(1)}))],
 status:id=>lfStatus(),info:id=>lfInfo(),tray:id=>lfTray()}});
function lf(){const f=facs().landfill;if(f){f.pile=f.pile||[];f.gauge=f.gauge||0}return f}
const lfDur=()=>facBonus('landfill').min*6e4,lfOk=id=>ITEMS[id]&&ITEMS[id].kind!=='facility'&&id!=='bg_default';
function lfReward(){const tier=rollTier(LF_ODDS),pool=Object.keys(ITEMS).filter(id=>LF_OUT.includes(ITEMS[id].kind)&&ITEMS[id].tier===tier).map(id=>({id,w:ITEMS[id].w??1}));
 const id=(pool.length?pickWeighted(pool):{id:'box_poke'}).id;invAdd(id,1);return id}
function lfTick(now){const f=lf();if(!f)return [];now=now||Date.now();const ev=[],p=facMon(f);
 if(!p||!f.pile.length){f.last=now;return ev}const B=facBonus('landfill'),d=lfDur();
 for(let g=0;g<5000&&f.pile.length&&f.last+d<=now;g++){f.last+=d;const id=f.pile.shift(),t=ITEMS[id]?ITEMS[id].tier||0:0;
  f.gauge+=LF_PTS[Math.min(3,t)]*B.fill;f.crushed=(f.crushed||0)+1;facGain('landfill',p,LF_XP_ITEM*(t+1),ev);
  while(f.gauge>=100){f.gauge-=100;const r=lfReward();f.made=(f.made||0)+1;facGain('landfill',p,LF_XP_MAKE,ev);ev.push('🗜️ The press made a '+ITEMS[r].name+'! ('+facName(p)+' +'+money(LF_XP_MAKE)+' EXP)')}}
 if(!f.pile.length)f.last=now;return ev}
function lfStatus(){const f=lf(),p=facMon(f);return (p?'🗜️ '+facName(p)+' · ':'Needs a Pokémon to run the press · ')+f.pile.length+' in the pile · gauge '+Math.floor(f.gauge)+'%'}
function lfTray(){const f=lf();return '<div class="tray-actions fac-actions"><button class="btn smallbtn red" onclick="lfOpen()">🗜️ PRESS</button><button class="btn smallbtn" onclick="facChooser(\'landfill\')">'+(f.mon?'↔ SWAP':'＋ CHOOSE POKÉMON')+'</button>'+(f.mon?'<button class="btn smallbtn" onclick="facRemove(\'landfill\')">REMOVE</button>':'')+'<button class="btn smallbtn" onclick="lfInfo()">LV '+facLv(f)+' · INFO</button><button class="btn smallbtn" onclick="hab.edit=!hab.edit;drawHabitat()">'+(hab.edit?'✓ DONE':'✎ DECOR')+'</button><button class="btn smallbtn" onclick="closeHabitat()">✕</button></div>'}
let lfTimer=0;
function lfOpen(){const f=lf();if(!f)return;lfTick();const p=facMon(f),v=inv(),ids=Object.keys(v).filter(id=>lfOk(id)&&v[id]>0).sort((a,b)=>(ITEMS[a].tier||0)-(ITEMS[b].tier||0));
 modal('🗜️ LANDFILL','<div id="lfMenu" class="lf"><p class="small muted">'+(p?esc(facName(p))+' is running the press.':'⚠️ Put a Pokémon in the Landfill to run the press.')+' Drag items from your bag onto the press (or tap them). Rarer items fill the gauge faster; a full gauge makes a ticket or box.</p>'
  +'<div class="lf-press'+(p&&f.pile.length?' on':'')+'" id="lfPress"><div class="lf-ram"></div><div class="lf-bed">'+(f.pile[0]?itemIcon(f.pile[0]):'<span class="small muted">empty</span>')+'</div><div class="lf-prog"><span id="lfProg"></span></div></div>'
  +'<div class="lf-gauge"><span id="lfGauge" style="width:'+Math.min(100,f.gauge)+'%"></span><b id="lfGt">'+Math.floor(f.gauge)+'%</b></div>'
  +'<p class="small"><b>Pile ('+f.pile.length+')</b> · '+lfDur()/6e4+' min per item'+(f.pile.length>1?' · tap to take back':'')+'</p><div class="lf-pile">'+f.pile.map((id,i)=>i?'<button class="lf-it" onclick="lfBack('+i+')" title="'+esc(ITEMS[id].name)+'">'+itemIcon(id)+'</button>':'').join('')+'</div>'
  +'<p class="small"><b>Bag</b></p><div class="lf-bag">'+(ids.length?ids.map(id=>'<div class="lf-it lf-src t'+(ITEMS[id].tier||0)+'" data-id="'+id+'" title="'+esc(ITEMS[id].name)+'">'+itemIcon(id)+'<b>'+v[id]+'</b></div>').join(''):'<span class="small muted">Your bag is empty.</span>')+'</div>'
  +'<div class="actions"><button class="btn" onclick="closeModal()">CLOSE</button></div></div>');
 document.querySelectorAll('#lfMenu .lf-src').forEach(el=>el.addEventListener('pointerdown',e=>lfDrag(e,el)));lfLive();clearInterval(lfTimer);lfTimer=setInterval(lfLive,1000)}
function lfLive(){const el=$('lfProg');if(!el){clearInterval(lfTimer);return}const f=lf(),n=f.pile.length,ev=lfTick();if(ev.length){save();gmNotice(ev.join(' · '),'',2500)}
 if(f.pile.length!==n&&!document.querySelector('.lf-ghost')){lfOpen();return}
 el.style.width=(facMon(f)&&f.pile.length?Math.min(100,(Date.now()-f.last)/lfDur()*100):0)+'%';$('lfGauge').style.width=Math.min(100,f.gauge)+'%';$('lfGt').textContent=Math.floor(f.gauge)+'%'}
function lfAdd(id){if(!inv()[id]||!lfOk(id))return;const f=lf();invAdd(id,-1);if(!f.pile.length)f.last=Date.now();f.pile.push(id);save();lfOpen()}
function lfBack(i){const f=lf();if(!f.pile[i]||!i)return;invAdd(f.pile.splice(i,1)[0],1);save();lfOpen()}
function lfDrag(e,el){e.preventDefault();const id=el.dataset.id,x0=e.clientX,y0=e.clientY;let g=null;
 const mv=ev=>{if(!g&&Math.hypot(ev.clientX-x0,ev.clientY-y0)>6){g=document.createElement('div');g.className='lf-ghost';g.innerHTML=itemIcon(id);document.body.appendChild(g)}if(g){g.style.left=ev.clientX+'px';g.style.top=ev.clientY+'px';const pr=$('lfPress');if(pr){const r=pr.getBoundingClientRect();pr.classList.toggle('hot',ev.clientX>r.left&&ev.clientX<r.right&&ev.clientY>r.top&&ev.clientY<r.bottom)}}};
 const up=ev=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);removeEventListener('pointercancel',up);const pr=$('lfPress');
  if(!g){lfAdd(id);return}g.remove();if(pr){const r=pr.getBoundingClientRect();pr.classList.remove('hot');if(ev.type==='pointerup'&&ev.clientX>r.left&&ev.clientX<r.right&&ev.clientY>r.top&&ev.clientY<r.bottom)lfAdd(id)}};
 addEventListener('pointermove',mv);addEventListener('pointerup',up);addEventListener('pointercancel',up)}
function lfInfo(){const f=lf(),L=facLv(f),next=L<10?FAC_XP[L+1]:null,p=facMon(f);
 modal('🗜️ LANDFILL · LV '+L,'<p class="small">'+(p?esc(facName(p))+' runs the press. ':'Nobody is running the press. ')+'Items on the pile are crushed one at a time. Each one fills the gauge by its rarity (Common '+LF_PTS[0]+'% · Uncommon '+LF_PTS[1]+'% · Rare '+LF_PTS[2]+'% · Epic '+LF_PTS[3]+'%, × the level bonus). A full gauge makes a random ticket or box. The Pokémon gets +'+money(LF_XP_ITEM)+' EXP × rarity per item and +'+money(LF_XP_MAKE)+' EXP per thing made.</p>'
  +'<div class="fac-xp"><span style="width:'+(next?Math.min(100,((f.xp||0)-FAC_XP[L])/(next-FAC_XP[L])*100):100)+'%"></span></div><p class="small muted">'+(next?money(Math.round((f.xp||0)-FAC_XP[L]))+' / '+money(next-FAC_XP[L])+' Facility EXP to Lv '+(L+1):'Max level')+'</p>'
  +'<table class="fac-tbl"><tr><th>Level</th><th>Per item</th><th>Gauge fill</th></tr>'+FAC.landfill.levels.slice(1).map((b,i)=>'<tr'+(i+1===L?' class="on"':'')+'><td>Lv '+(i+1)+'</td><td>'+b.min+' min</td><td>×'+b.fill+'</td></tr>').join('')+'</table>'
  +'<p class="small muted">Crushed: '+money(f.crushed||0)+' · made: '+money(f.made||0)+'</p><div class="actions"><button class="btn red" onclick="lfOpen()">OPEN PRESS</button>'+(inv().facticket&&L<10?'<button class="btn blue" onclick="facTicketUse(\'landfill\')">USE FACILITY TICKET</button>':'')+'<button class="btn" onclick="closeModal()">CLOSE</button></div>')}
window.facPick_landfill=pid=>facPlace('landfill',pid);
