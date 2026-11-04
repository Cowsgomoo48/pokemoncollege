// ===================== GENDERS · STUDY HALL · NURSERY =====================
// Genders: assigned once per Pokémon (legendaries and genderless species have none)
const GENDERLESS=new Set(['Magnemite','Magneton','Magnezone','Voltorb','Electrode','Staryu','Starmie','Porygon','Porygon2','Porygon-Z','Beldum','Metang','Metagross','Bronzor','Bronzong','Klink','Klang','Klinklang','Golett','Golurk','Rotom','Carbink','Minior','Dhelmise','Sinistea','Polteageist','Baltoy','Claydol','Lunatone','Solrock','Shedinja','Cryogonal','Ditto','Unown']);
const FEMALE_ONLY=new Set(['Hatenna','Hattrem','Hatterene','Froslass','Salazzle','Vespiquen','Combee','Kangaskhan','Miltank','Chansey','Blissey','Happiny','Jynx','Smoochum','Nidoran♀','Nidorina','Nidoqueen','Petilil','Lilligant','Vullaby','Mandibuzz','Flabébé','Floette','Florges','Bounsweet','Steenee','Tsareena']);
const MALE_ONLY=new Set(['Gallade','Tyrogue','Hitmonlee','Hitmonchan','Hitmontop','Throh','Sawk','Rufflet','Braviary','Tauros','Nidoran♂','Nidorino','Nidoking','Impidimp','Morgrem','Grimmsnarl','Mothim','Tinkatink']);
function monGender(p){if(!p)return null;if(p.gender!==undefined)return p.gender;const sp=p.species,t=INDEX[sp]?INDEX[sp].tier:0;p.gender=t>=4||GENDERLESS.has(sp)?null:FEMALE_ONLY.has(sp)?'F':MALE_ONLY.has(sp)?'M':Math.random()<.5?'M':'F';return p.gender}
function monGenderHTML(p){const g=monGender(p);return g==='M'?'<span class="g-m">♂</span>':g==='F'?'<span class="g-f">♀</span>':''}
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
 const rm=nurRoot(m.species),rd=nurRoot(d.species),same=rm===rd,sh=NUR_SHINY*(m.shiny&&d.shiny?8:m.shiny||d.shiny?4:1)*(dm||dd?1.5:1)*(1+.1*(facLv(facs().nursery)-1)),opts=dm?[{sp:rd,p:1}]:dd?[{sp:rm,p:1}]:same?[{sp:rm,p:1}]:[{sp:rm,p:.7},{sp:rd,p:.3}];
 return {shiny:sh,opts,fast:dd?null:d.fastMove,disc:dd?null:d.discMove,moveP:dd?0:.3,costume:!!(m.costume||d.costume),ditto:dm||dd}}
function nurDur(){return facBonus('nursery').hrs*36e5}
function nurTick(now){const f=nur();if(!f)return [];now=now||Date.now();const ev=[];if(f.phase==='idle'){f.last=now;return ev}
 const {m,d}=nurPair(f);if(f.phase==='breeding'&&(!m||!d)){f.phase='idle';return ev}
 f.prog=(f.prog||0)+Math.max(0,now-(f.last||now))*(f.speed||1);f.last=now;
 if(f.phase==='breeding'&&f.prog>=f.dur){const o=nurOdds(m,d);if(!o||o.bad){f.phase='idle';return ev}let r=Math.random(),sp=o.opts[0].sp;for(const x of o.opts){if(r<x.p){sp=x.sp;break}r-=x.p}
  f.egg={sp,costume:rollCostume(sp)||(o.costume?rollCostume(sp)||rollCostume(sp):null),shiny:Math.random()<o.shiny,fast:Math.random()<o.moveP?o.fast:null,disc:Math.random()<o.moveP?o.disc:null,growth:[0,1,2,3,4,5].map(i=>Math.random()<.5?monGrowth(Math.random()<.5?m:d)[i]:null),at:now};
  f.phase='egg';f.prog=0;f.dur=nurDur();f.speed=1;ev.push('🥚 Nursery: '+facName(m)+' and '+facName(d)+' left an egg! It hatches in '+fmtHM(f.dur)+'.')}
 if(f.phase==='egg'&&f.prog>=f.dur){const e=f.egg,tier=INDEX[e.sp]?INDEX[e.sp].tier:0,g=rollGrowth().map((v,i)=>e.growth&&e.growth[i]!=null?e.growth[i]:v);
  const mm=giveMon({species:e.sp,tier,shiny:e.shiny,costume:e.costume||null,size:rollSize(),growth:g});if(e.fast)mm.fastMove=e.fast;if(e.disc)mm.discMove=e.disc;monGender(mm);
  facs().nursery.xp=(facs().nursery.xp||0)+150000;f.hatched=(f.hatched||0)+1;f.lastHatch={id:mm.id,sp:e.sp,shiny:e.shiny};f.egg=null;ev.push('🐣 The egg hatched: '+(e.shiny?'✨ Shiny ':'')+(e.costume?'costumed ':'')+e.sp+' '+monGenderHTML(mm).replace(/<[^>]+>/g,'')+' joined your Box!'+(e.fast||e.disc?' It learned '+(e.fast&&e.disc?e.fast+' and '+e.disc:e.fast||e.disc)+' from its father.':''));
  if(m&&d){f.phase='breeding';f.prog=0;f.dur=nurDur();f.speed=1}else f.phase='idle'}
 return ev}
function nurseryAnswer(){const f=nur();if(!f||f.phase==='idle')return;nurTick();f.speed=+((f.speed||1)+facBonus('nursery').per/100).toFixed(4);save()}
function nurLeft(f){return Math.max(0,(f.dur-(f.prog||0))/(f.speed||1))}
function nurStatus(){const f=nur();if(!f)return '';if(f.phase==='breeding')return '💞 Breeding · egg in ~'+fmtHM(nurLeft(f))+' · speed ×'+(f.speed||1).toFixed(2);if(f.phase==='egg')return '🥚 Egg · hatches in ~'+fmtHM(nurLeft(f))+' · speed ×'+(f.speed||1).toFixed(2);return 'Empty: tap to choose two parents'}
let nurSel={mother:null,father:null};
function nurOpen(){const f=nur();if(!f)return;if(f.phase!=='idle'){nurInfo();return}nurSel={mother:f.mother||null,father:f.father||null};nurMenu()}
function nurMenu(){const m=db.pokemon.find(p=>p.id===nurSel.mother),d=db.pokemon.find(p=>p.id===nurSel.father),o=nurOdds(m,d),ok=o&&!o.bad;
 const slot=(p,role,label)=>'<button class="nur-slot '+(p?'full':'')+'" onclick="nurPick(\''+role+'\')">'+(p?monSprite(p,'',64)+'<b>'+esc(facName(p))+' '+monGenderHTML(p)+'</b>':'<span class="nur-plus">＋</span><b>'+label+'</b>')+'</button>';
 const stats=ok?'<div class="nur-stats"><div><span>Shiny chance</span><b>1 in '+money(Math.round(1/o.shiny))+'</b></div><div><span>Rarity bucket</span><b>'+o.opts.map(x=>RARITIES[INDEX[x.sp]?INDEX[x.sp].tier:0]).filter((v,i,a)=>a.indexOf(v)===i).join(' / ')+'</b></div><div><span>Species chance</span><b>'+o.opts.map(x=>esc(x.sp)+' '+Math.round(x.p*100)+'%').join(' · ')+'</b></div>'+(o.moveP?'<div><span>From father</span><b>'+Math.round(o.moveP*100)+'% '+esc(o.fast)+' · '+Math.round(o.moveP*100)+'% '+esc(o.disc)+'</b></div>':'')+(o.costume?'<div><span>Costume chance</span><b>Boosted (costumed parent)</b></div>':'')+(o.ditto?'<div><span>Ditto</span><b>Takes after the partner · shiny ×1.5</b></div>':'')+'<div><span>Time</span><b>'+fmtHM(nurDur())+' to breed + '+fmtHM(nurDur())+' to hatch</b></div></div>':'<p class="small muted nur-hint">'+(o&&o.bad?o.bad:'Choose a ♀ mother and a ♂ father that share a type (no legendaries or babies). Ditto can stand in for either.')+'</p>';
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
function nurRemove(){const f=nur();if(!f)return;if(f.phase==='egg'){toast('Wait for the egg to hatch first');return}f.mother=f.father=null;f.phase='idle';f.prog=0;save();drawHabitat();toast('The parents left the Nursery')}
function nurTray(){const f=nur();return '<div class="tray-actions fac-actions">'+(f.phase==='idle'?'<button class="btn smallbtn red" onclick="nurOpen()">＋ CHOOSE PARENTS</button>':'<button class="btn smallbtn red" onclick="nurInfo()">'+(f.phase==='egg'?'🥚 EGG':'💞 BREEDING')+'</button>'+(f.phase==='breeding'?'<button class="btn smallbtn" onclick="nurRemove()">REMOVE PARENTS</button>':''))+'<button class="btn smallbtn" onclick="nurInfo()">LV '+facLv(f)+' · INFO</button><button class="btn smallbtn" onclick="hab.edit=!hab.edit;drawHabitat()">'+(hab.edit?'✓ DONE':'✎ DECOR')+'</button><button class="btn smallbtn" onclick="closeHabitat()">✕</button></div>'}
function nurInfo(){const f=nur(),L=facLv(f),next=L<10?FAC_XP[L+1]:null,{m,d}=nurPair(f),B=facBonus('nursery');
 const cur=f.phase==='idle'?'<p class="small">Nobody is breeding right now.</p>':'<div class="nur-now"><div class="nur-pair">'+(m?monSprite(m,'',48):'')+(d?monSprite(d,'',48):'')+'</div><p><b>'+(f.phase==='egg'?'🥚 An egg is warming up':'💞 '+esc(facName(m))+' and '+esc(facName(d))+' are breeding')+'</b><br>'+(f.phase==='egg'?'Hatches':'Egg')+' in about '+fmtHM(nurLeft(f))+' · speed ×'+(f.speed||1).toFixed(2)+'</p><div class="fac-xp"><span style="width:'+Math.min(100,(f.prog||0)/f.dur*100)+'%"></span></div></div>';
 modal('🥚 NURSERY · LV '+L,cur+'<p class="small">Put a ♀ and a ♂ that share a type (no legendaries or babies) in the Nursery; Ditto can pair with anything and gives a small shiny boost. Shiny parents raise shiny odds, and a costumed parent raises costume odds. Parents are locked while they breed. After the breeding time they leave an egg; after the hatching time it hatches into the first stage of the mother’s line (70%) or the father’s (30%), sometimes knowing the father’s moves. Each fully correct answer makes the current timer run '+B.per+'% faster, stacking until the phase ends. Each hatch gives the Nursery Facility EXP.</p>'
  +'<div class="fac-xp"><span style="width:'+(next?Math.min(100,((f.xp||0)-FAC_XP[L])/(next-FAC_XP[L])*100):100)+'%"></span></div><p class="small muted">'+(next?money(Math.round((f.xp||0)-FAC_XP[L]))+' / '+money(next-FAC_XP[L])+' Facility EXP to Lv '+(L+1):'Max level')+'</p>'
  +'<table class="fac-tbl"><tr><th>Level</th><th>Breed / hatch</th><th>Speed per answer</th></tr>'+FAC.nursery.levels.slice(1).map((b,i)=>'<tr'+(i+1===L?' class="on"':'')+'><td>Lv '+(i+1)+'</td><td>'+fmtHM(b.hrs*36e5)+' each</td><td>+'+b.per+'%</td></tr>').join('')+'</table>'
  +'<p class="small muted">Eggs hatched: '+(f.hatched||0)+'</p><div class="actions">'+(f.phase==='idle'?'<button class="btn red" onclick="nurOpen()">CHOOSE PARENTS</button>':'')+(inv().facticket&&L<10?'<button class="btn blue" onclick="facTicketUse(\'nursery\')">USE FACILITY TICKET</button>':'')+'<button class="btn" onclick="closeModal()">CLOSE</button></div>')}
async function nurDraw(){const box=$('pasture');if(!box)return;let el=$('facMon');const f=nur(),{m,d}=nurPair(f),sig=f.phase+'|'+(m?m.id:'')+'|'+(d?d.id:'');if(el&&el.dataset.sig===sig)return;
 if(!el){el=document.createElement('div');el.id='facMon';box.appendChild(el)}el.className='fac-mon nur-scene';el.dataset.sig=sig;el.style.cssText='';
 el.innerHTML=(f.phase!=='idle'&&m&&d?'<span class="nur-p">'+monSprite(m,'',60)+'</span><span class="nur-heart">'+(f.phase==='breeding'?'💞':'')+'</span><span class="nur-p">'+monSprite(d,'',60)+'</span>':'')+(f.phase==='egg'?'<span class="nur-egg-in">'+(typeof icoHTML==='function'?icoHTML('egg'):'🥚')+'</span>':'')}
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
