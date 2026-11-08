// ===================== MISC TAB: Pokédex + Advancements =====================
// Advancement progress lives in db.adv: c = counters, f = one-time flags, s = sets (stored as arrays),
// claimed / seen = advancement ids. Counters only go up, so tiered advancements (I, II, III…) share one counter.
const ADV_RW={1:{cogs:25,pxp:2000},2:{cogs:60,pxp:5000,items:{exp_t1:1}},3:{cogs:150,pxp:12000,items:{hasten:1}},4:{cogs:400,pxp:30000,items:{facticket:1},egg:2},5:{cogs:1000,pxp:80000,items:{facticket:1,exp_t3:1},egg:3},one:{cogs:50,pxp:4000},big:{cogs:120,pxp:10000,egg:1},boss:{cogs:300,pxp:20000,items:{facticket:1},egg:3}};
const ADV_CATS=[['study','Study'],['log','“Logging” In'],['mon','Pokémon'],['dun','Dungeon']];
function advSt(){const a=db.adv||(db.adv={c:{},f:{},s:{},claimed:{},seen:{},day:{}});a.c=a.c||{};a.f=a.f||{};a.s=a.s||{};a.claimed=a.claimed||{};a.seen=a.seen||{};a.day=a.day||{};return a}
const advC=k=>advSt().c[k]||0,advF=k=>!!advSt().f[k],advSet=k=>advSt().s[k]||(advSt().s[k]=[]);
function advInc(k,n=1){advSt().c[k]=advC(k)+n}
function advFlag(k){const a=advSt();if(!a.f[k]){a.f[k]=Date.now();advPing()}}
function advAdd(k,v){const s=advSet(k);if(!s.includes(v))s.push(v)}
function advDay(){const a=advSt(),d=ymd(new Date());if(a.day.d!==d)a.day={d,correct:0,sets:[],task:0,bought:0};return a.day}
// ---------- definitions ----------
const fam=(id,cat,icon,name,goals,desc,val)=>goals.map((g,i)=>({id:id+(i+1),fam:id,tier:i+1,cat,icon,name:name+' '+['I','II','III','IV','V'][i],desc:desc(g),goal:g,val,rw:ADV_RW[i+1]}));
const one=(id,cat,icon,name,desc,flag,rw)=>({id,cat,icon,name,desc,goal:1,val:()=>advF(flag||id)?1:0,rw:rw||ADV_RW.one});
const ADV=[
 ...fam('ans','study','brain','Answerer',[10,30,100,500,2000],g=>'Answer '+money(g)+' questions correctly.',()=>advC('correct')),
 ...fam('typed','study','memo','Show Your Work',[5,25,100],g=>'Correctly solve '+g+' questions using typed answers.',()=>advC('typed')),
 ...fam('sw','study','repeat','Second Wind',[5,25,100],g=>'Correctly answer '+g+' different questions you previously answered incorrectly.',()=>advSet('sw').length),
 one('hang','study','calendar','Getting the Hang of It','Answer a previously missed question correctly on three separate study days.'),
 one('hint','study','bulb','A Little Help','Use a hint, then correctly answer the question.'),
 one('own','study','fist','On My Own','Correctly answer a question without hints after previously needing a hint for it.'),
 one('mixed','study','books','Mixed Bag','Correctly answer questions from three different study sets in one day.'),
 ...fam('leaf','log','herb','Leaf by Leaf',[5,25,100,300],g=>'Complete '+g+' Sutodo tasks.',()=>advC('tasks')),
 ...fam('ahead','log','alarm','Ahead of the Curve',[3,15,50],g=>'Complete '+g+' tasks at least 24 hours before their deadlines.',()=>advC('early')),
 one('late','log','hourglass','Still Counts','Complete an overdue task.'),
 one('oldest','log','clipboard','One Less Thing','Complete the oldest unfinished task on your list.'),
 one('room','log','inbox','Making Room','Finish every task that was due today, with at least three completed.'),
 one('calibur','log','shooting_star','EXP-Calibur','Have every kind of EXP Ticket active at once.',null,ADV_RW.big),
 one('full','mon','house','Full-House','Enter a Mystery Dungeon with 4 Pokémon.'),
 one('apple','mon','apple','Scrumptious','While under a Golden Apple, level a Lv 1 Pokémon up to Lv 50 before it wears off.',null,ADV_RW.big),
 ...fam('decor','mon','potted','Interior Designer',[5,15,30],g=>'Own '+g+' different decorations.',()=>advDecorOwned()),
 one('home','mon','frame','Make Yourself at Home','Equip a decoration you bought.'),
 one('refresh','mon','palette','Room Refresh','Change both your background and an equipped decoration.'),
 one('treat','mon','gift','A Well-Earned Treat','Complete a Sutodo task and correctly answer 10 study questions, then buy something from the shop that day.'),
 ...fam('dex','mon','pokedex','Professor’s Pal',[10,25,50,100,200],g=>'Have '+g+' different Pokémon species in the Pokédex.',()=>advDexCount()),
 ...fam('evo','mon','seedling','Growing Together',[1,10,30],g=>g===1?'Evolve your first Pokémon.':'Evolve '+g+' Pokémon.',()=>advC('evolves')),
 one('familiar','mon','eyes','A Familiar Face','Obtain a Pokémon species you already own.'),
 one('shiny','mon','sparkles','A Shiny Color','Obtain your first shiny Pokémon.',null,{cogs:150,pxp:8000,items:{facticket:1}}),
 one('costume','mon','ribbon','Dressed for the Occasion','Obtain your first costumed Pokémon.',null,{cogs:150,pxp:8000,items:{facticket:1}}),
 one('both','mon','crown','Double Take','Obtain a Pokémon that is both shiny and costumed.',null,{cogs:500,pxp:30000,items:{facticket:2},egg:3}),
 one('tm','mon','disc','Signature Style','Equip a TM Disc move on a Pokémon.'),
 one('ult','mon','bolt','UNLIMITED POWERRRR','Unlock a Pokémon’s Ultimate.',null,ADV_RW.big),
 one('sig','mon','medal','Truly You','Equip a Pokémon with that species’ signature move.'),
 ...fam('floor','dun','ladder','Down We Go',[5,25,100,500],g=>'Clear '+g+' Mystery Dungeon floors in total.',()=>advC('floors')),
 ...fam('slay','dun','swords','Giant Slayer',[1,10,50],g=>g===1?'Defeat your first dungeon boss.':'Defeat '+g+' dungeon bosses.',()=>advC('bosses')),
 one('swarm','dun','bee','Crowd Control','Win a Swarm encounter.'),
 one('alpha','dun','dragon','Against the Odds','Defeat an Alpha Boss.',null,ADV_RW.big),
 one('revive','dun','heart','Not Done Yet','Revive a fainted teammate and then win that encounter.'),
 one('clutch','dun','target','Clutch Answer','Correctly answer an attack question while the acting Pokémon has 25% HP or less, then defeat the target with that attack.'),
 one('home2','dun','flag','Everyone Comes Home','Clear a dungeon’s final floor with every party member conscious.',null,ADV_RW.big),
 one('perfect','dun','star','Perfect Execution','Win a battle after answering at least five questions, every one right on the first try.'),
 one('planb','dun','link','Plan B','Defeat an enemy with a Disc Move after it survives your Basic Move.'),
 one('finish','dun','firecracker','The Big Finish','Defeat a boss with an Ultimate.',null,ADV_RW.big),
 {id:'types',cat:'dun',icon:'burst',name:'Type Advantage',desc:'Land super-effective attacks using five different move types across your adventures.',goal:5,val:()=>advSet('types').length,rw:ADV_RW.big},
 one('brink','dun','dizzy_face','Back From The Brink','Have a party member survive an attack on 1 HP.'),
 one('manaphy','dun','wave','Down the Drain','Defeat Manaphy, the named boss of the first layer.',null,ADV_RW.boss),
 one('regirock','dun','moai','Put to Bed-rock','Defeat Regirock, the named boss of the second layer.',null,ADV_RW.boss)];
const ADV_BY=Object.fromEntries(ADV.map(a=>[a.id,a]));
function advDone(a){return a.val()>=a.goal}
function advPrevOk(a){if(!a.fam||a.tier===1)return true;return advDone(ADV_BY[a.fam+(a.tier-1)])}
function advClaimable(a){return advDone(a)&&advPrevOk(a)&&!advSt().claimed[a.id]}
function advAnyClaim(){return ADV.some(advClaimable)}
// ---------- derived counts ----------
const ADV_DECOR_KINDS=new Set(['small','medium','bg','floor']);
function advDecorOwned(){const own=new Set(Object.keys(inv()).filter(id=>inv()[id]>0&&ITEMS[id]&&ADV_DECOR_KINDS.has(ITEMS[id].kind)&&id!=='bg_default'));const d=db.decor||{};[...(d.small||[]),...(d.medium||[])].forEach(x=>{const id=x&&(x.id||x);if(id&&ITEMS[id])own.add(id)});if(d.bg&&d.bg!=='bg_default')own.add(d.bg);advSet('decorEver').forEach(x=>own.add(x));own.forEach(x=>advAdd('decorEver',x));return own.size}
function advDexCount(){(db.pokemon||[]).forEach(p=>advAdd('dex',p.species));return advSet('dex').length}
// ---------- one-time seeding from what the app already recorded ----------
function advSeed(){const a=advSt();if(a.v)return;a.v=1;const q=db.qstats||{};
 a.c.correct=Math.max(a.c.correct||0,Object.values(q).reduce((n,s)=>n+(s.r||0),0));Object.keys(q).forEach(k=>{if(q[k].r>0&&q[k].w>0)advAdd('sw',k)});
 const done=(db.tasks||[]).filter(t=>t.done);a.c.tasks=Math.max(a.c.tasks||0,done.length);
 a.c.early=Math.max(a.c.early||0,done.filter(t=>t.due&&t.completedAt&&dueAt(t)-new Date(t.completedAt)>=864e5).length);
 advMonScan(true)}
function advMonScan(seed){const ps=db.pokemon||[],seen={};ps.forEach(p=>{advAdd('dex',p.species);seen[p.species]=(seen[p.species]||0)+1;if(p.shiny)advFlag('shiny');if(p.costume)advFlag('costume');if(p.shiny&&p.costume)advFlag('both');
  if(typeof ultUnlocked==='function'&&typeof ultAvailable==='function'&&ultUnlocked(p,ultAvailable(p)))advFlag('ult');if(advSigOk(p))advFlag('sig')});
 if(seed&&Object.values(seen).some(n=>n>1))advFlag('familiar')}
function advSigOk(p){if(typeof SIGNATURE_EXTRA==='undefined')return false;return [p.fastMove,p.discMove].some(m=>m&&SIGNATURE_EXTRA[m]&&!SIGNATURE_EXTRA[m].includes(p.species)&&typeof canLearn==='function'&&canLearn(p.species,m))}
// ---------- study hooks (called from qRecord) ----------
function advQ(item,ok,I,before){try{advSeed();const key=item&&item.key,day=advDay(),hadMiss=before&&before.w>0,hadHint=before&&before.h>0;
 if(mgState&&/dungeon|tower/.test(mgState.game)&&typeof runOf==='function'){const b=runOf()&&runOf().battle;if(b){b._advQ=(b._advQ||0)+1;if(!ok||!I.first)b._advBad=1}}
 if(!ok)return;advInc('correct');day.correct++;if(I.typed)advInc('typed');
 if(item&&item.sid&&!day.sets.includes(item.sid)){day.sets.push(item.sid);if(day.sets.length>=3)advFlag('mixed')}
 if(I.hints)advFlag('hint');else if(hadHint)advFlag('own');
 if(key&&hadMiss){advAdd('sw',key);const H=advSt().s.hang||(advSt().s.hang={});const ds=H[key]||(H[key]=[]);if(!ds.includes(day.d))ds.push(day.d);if(ds.length>=3)advFlag('hang')}
 advPing()}catch(e){}}
// ---------- wrap existing actions (they keep working exactly as before) ----------
function advWrap(name,before,after){const f=window[name];if(typeof f!=='function'||f.__adv)return;const w=function(){let ctx;try{ctx=before&&before.apply(this,arguments)}catch(_){}const out=f.apply(this,arguments);const fin=v=>{try{after&&after(ctx,arguments,v)}catch(_){}return v};return out&&typeof out.then==='function'?out.then(fin):fin(out)};w.__adv=1;window[name]=w}
function advInstall(){
 advWrap('completeTask',id=>{const t=db.tasks.find(x=>x.id===id);if(!t||t.done)return null;const open=db.tasks.filter(x=>!x.done&&!x.permeate),now=Date.now();
   return {t,late:!!(t.due&&dueAt(t)<now),oldest:open.length>1&&open.every(x=>(x.createdAt||'')>=(t.createdAt||'')),early:!!(t.due&&dueAt(t)-now>=864e5),before:t.permeate?JSON.stringify(t.doneDates||t.done||''):null}},
  ctx=>{if(!ctx)return;const t=ctx.t;if(!t.done&&!t.permeate)return;advInc('tasks');const day=advDay();day.task=1;if(ctx.late)advFlag('late');if(ctx.oldest)advFlag('oldest');if(ctx.early)advInc('early');
   const td=ymd(new Date()),due=db.tasks.filter(x=>x.due===td&&!x.permeate);if(due.length>=3&&due.every(x=>x.done))advFlag('room');advPing()});
 advWrap('feedSnack',id=>{const p=db.pokemon.find(x=>x.id===db.mainId);return {p,lv:p&&monLv(p),id}},ctx=>{if(ctx&&ctx.id==='goldapple'&&ctx.p&&ctx.lv===1&&ctx.p.buff)ctx.p.advGA=ctx.p.buff.until});
 advWrap('evolveMon',id=>{const p=db.pokemon.find(x=>x.id===id);return {p,sp:p&&p.species}},ctx=>{if(ctx&&ctx.p&&ctx.p.species!==ctx.sp){advInc('evolves');advAdd('dex',ctx.p.species);advPing()}});
 advWrap('giveMon',m=>({owned:(db.pokemon||[]).some(p=>p.species===m.species)}),(ctx,args,p)=>{if(!p)return;if(ctx&&ctx.owned)advFlag('familiar');advAdd('dex',p.species);if(p.shiny)advFlag('shiny');if(p.costume)advFlag('costume');if(p.shiny&&p.costume)advFlag('both');advPing()});
 advWrap('equipTM',(monId)=>{const p=db.pokemon.find(x=>x.id===monId);return p&&{p,d:p.discMove,f:p.fastMove}},ctx=>{if(!ctx)return;if(ctx.p.discMove!==ctx.d)advFlag('tm');if(advSigOk(ctx.p))advFlag('sig')});
 advWrap('unlockUlt',null,()=>advMonScan());
 const shop=()=>({inv:{...inv()},cogs:db.cogs}),shopAfter=ctx=>{if(!ctx||db.cogs>=ctx.cogs)return;const day=advDay();day.bought=1;Object.keys(inv()).forEach(id=>{if((inv()[id]||0)>(ctx.inv[id]||0))advAdd('bought',id)});if(day.task&&day.correct>=10)advFlag('treat');advPing()};
 advWrap('buyDeal',shop,shopAfter);advWrap('buyItem',shop,shopAfter);
 advWrap('dgStartRun',null,()=>{const r=runOf();if(r&&r.party&&r.party.length>=4)advFlag('full')});
 advWrap('gdStairs',()=>{const r=runOf();return r&&{f:r.floor}},ctx=>{const r=runOf();if(ctx&&r&&r.floor>ctx.f)advInc('floors')});
 advWrap('dgFloorClear',()=>{const r=runOf();return r&&{last:typeof mdIsLast==='function'&&mdIsLast(r),up:r.party.every(m=>m.hp>0)}},ctx=>{if(!ctx)return;advInc('floors');if(ctx.last&&ctx.up)advFlag('home2');advPing()});
 // which player attack is happening, so kills and super-effective hits can be credited
 const atk=kind=>function(slot,a2,a3,a4,a5){const r=runOf(),b=r&&r.battle,m=b&&r.party[slot];let lowHp=false;try{const c=combatant(partyMon(m));lowHp=m.hp/c.hp<=.25}catch(_){}
   const mv=kind==='mv4'?a4:kind==='mv3'?a3:null,k=kind==='ult'?'ult':mv&&mv[3]==='fast'?'fast':'disc',mult=kind==='mv4'?a5:kind==='mv3'?a4:a2;DG.advLast={k,lowHp,ok:(mult??1)>=1,t:Date.now()}};
 advWrap('dgAttack',atk('mv4'));advWrap('dgAttackAll',atk('mv3'));advWrap('gdAttackMulti',atk('mv3'));advWrap('dgUltimate',atk('ult'));advWrap('legendUltimate',atk('ult'));
 advWrap('dgDamage',(att,def,mv)=>{const L=DG&&DG.advLast,b=runOf()&&runOf().battle;if(L&&Date.now()-L.t<20000&&b&&!b.enemyPhase&&def&&mv&&typeof typeEff==='function'&&typeEff(mv[0],def.types)>1)advAdd('types',String(mv[0]).toLowerCase())});
 ['gdDrawBattle','dgDrawBattle'].forEach(n=>advWrap(n,null,()=>advBattleWatch()));
 advWrap('ocDefeat',null,()=>{advFlag('manaphy');advInc('bosses')});advWrap('rcDefeat',null,()=>{advFlag('regirock');advInc('bosses')});
 advWrap('go',null,(c,args)=>{if(args[0]==='misc'){miscView='menu';drawMisc()}advBadge()});}
// Compares the battle with the last time it was drawn: kills, revives, 1-HP survivals and battle wins.
function advBattleWatch(){const r=typeof runOf==='function'&&runOf(),b=r&&r.battle;if(!b)return;const prev=b._advSnap,L=DG&&DG.advLast,recent=L&&Date.now()-L.t<20000;
 const snap={p:r.party.map(m=>m.hp),e:b.enemies.map(e=>e.hp)};
 if(prev&&prev.e.length===b.enemies.length){
  r.party.forEach((m,i)=>{const was=prev.p[i];if(was==null)return;if(was<=0&&m.hp>0)b._advRevived=1;if(was>1&&m.hp===1)advFlag('brink')});
  b.enemies.forEach((e,i)=>{const was=prev.e[i];if(was==null||was<=0)return;
   if(e.hp>0&&e.hp<was&&recent&&!b.enemyPhase&&L.k==='fast')e._advFast=1;
   if(e.hp<=0&&recent){if(L.k==='disc'&&e._advFast)advFlag('planb');if(L.lowHp&&L.ok)advFlag('clutch');if(e.boss&&L.k==='ult')advFlag('finish')}
   if(e.hp<=0&&e.boss&&!e.ocBoss&&!e.rcBoss){advInc('bosses');if(e.boss==='alpha')advFlag('alpha')}});
  const wasLive=prev.e.some(h=>h>0),nowLive=b.enemies.some(e=>e.hp>0&&!e.gdOut);
  if(wasLive&&!nowLive&&r.party.some(m=>m.hp>0)&&!b._advWon){b._advWon=1;if(b.enemies.some(e=>e.swarm))advFlag('swarm');if(b._advRevived)advFlag('revive');if((b._advQ||0)>=5&&!b._advBad)advFlag('perfect')}}
 Object.defineProperty(b,'_advSnap',{value:snap,enumerable:false,configurable:true,writable:true})}
// state checks (every 30 s and when the Misc tab opens)
function advTick(){try{if(!db)return;advSeed();advMonScan();advDecorOwned();advDexCount();
 if(typeof expBoostActive==='function'&&typeof EXP_TICKETS!=='undefined'&&expBoostActive().length>=Object.keys(EXP_TICKETS).length)advFlag('calibur');
 (db.pokemon||[]).forEach(p=>{if(p.advGA){if(Date.now()>p.advGA+60000)delete p.advGA;else if(monLv(p)>=50)advFlag('apple')}});
 const d=db.decor||{},sig=JSON.stringify([d.small,d.medium]),a=advSt();if(a.decSig&&a.decSig!==sig){a.f.decCh=a.f.decCh||Date.now();const placed=[...(d.small||[]),...(d.medium||[])].map(x=>x&&(x.id||x)).filter(Boolean);if(placed.some(id=>advSet('bought').includes(id)))advFlag('home')}
 if(a.bgSig&&a.bgSig!==d.bg)a.f.bgCh=a.f.bgCh||Date.now();a.decSig=sig;a.bgSig=d.bg;if(a.f.decCh&&a.f.bgCh)advFlag('refresh');advBadge()}catch(e){}}
let advPingT=0;function advPing(){clearTimeout(advPingT);advPingT=setTimeout(advBadge,300)}
function advBadge(){const on=advAnyClaim();document.querySelectorAll('.dock-misc,.misc-adv').forEach(el=>el.classList.toggle('adv-ready',on))}
// ---------- rewards ----------
function advRewardList(rw){const out=[];if(rw.cogs)out.push(['cog','+'+money(rw.cogs)+' Cogs']);if(rw.pxp)out.push(['star','+'+money(rw.pxp)+' EXP']);Object.entries(rw.items||{}).forEach(([id,n])=>out.push([id,(n>1?n+'× ':'')+ITEMS[id].name]));if(rw.egg)out.push(['egg',RARITIES[Math.min(4,rw.egg)]+' Egg']);return out}
function advRewardHTML(rw){return advRewardList(rw).map(([ic,t])=>'<span class="adv-rw">'+(ITEMS[ic]?itemIcon(ic):icoHTML(ic))+'<b>'+esc(t)+'</b></span>').join('')}
function advGrant(rw){db.cogs=Math.round((db.cogs||0)+(rw.cogs||0));const p=db.pokemon.find(x=>x.id===db.mainId);if(p&&rw.pxp)p.pxp=(p.pxp||0)+rw.pxp;Object.entries(rw.items||{}).forEach(([id,n])=>invAdd(id,n));
 if(rw.egg&&typeof eggAdd==='function'){const pool=Object.keys(INDEX).filter(sp=>INDEX[sp].tier===rw.egg&&!PRE_EVO[sp]&&!(typeof NUR_BABY!=='undefined'&&NUR_BABY.has(sp))),sp=pool[Math.floor(Math.random()*pool.length)]||Object.keys(INDEX)[0];eggAdd({sp,tier:INDEX[sp].tier,shinyP:1/4096,src:'adv'})}}
function advClaim(ids){const got=[];ids.forEach(id=>{const a=ADV_BY[id];if(!a||!advClaimable(a))return;advSt().claimed[id]=Date.now();advGrant(a.rw);got.push(...advRewardList(a.rw))});if(!got.length)return;save();advFlow(got);advBadge();if($('advBoard')){advDrawBoard(true);if(!advAnyClaim())document.querySelectorAll('.adv-claimall').forEach(b=>b.remove())}}
function advFlow(list){let box=document.querySelector('.adv-flow');if(box)box.remove();box=document.createElement('div');box.className='adv-flow';box.innerHTML='<div class="adv-flow-box">'+icoHTML('gift')+'<b>Rewards claimed</b><div class="adv-flow-list"></div></div>';document.body.appendChild(box);
 const L=box.querySelector('.adv-flow-list');list.forEach(([ic,t],i)=>setTimeout(()=>{const s=document.createElement('span');s.className='adv-rw fly';s.innerHTML=(ITEMS[ic]?itemIcon(ic):icoHTML(ic))+'<b>'+esc(t)+'</b>';L.appendChild(s)},180+i*160));
 setTimeout(()=>box.classList.add('out'),1400+list.length*160);setTimeout(()=>box.remove(),1900+list.length*160)}
// ---------- Misc tab ----------
let miscView='menu';
function drawMisc(){const el=$('miscBody');if(!el)return;advTick();
 if(miscView==='dex')return dexDraw(el);if(miscView==='adv')return advDraw(el);
 el.innerHTML='<div class="misc-menu"><button class="misc-big" onclick="miscView=\'dex\';drawMisc()">'+icoHTML('pokedex')+'<b>Pokédex</b><small>'+advDexCount()+' / '+dexAll().length+' species</small></button><button class="misc-big misc-adv" onclick="miscView=\'adv\';drawMisc()">'+icoHTML('trophy')+'<b>Advancements</b><small>'+ADV.filter(a=>advSt().claimed[a.id]).length+' / '+ADV.length+' claimed</small><i class="adv-bang">!</i></button></div>';advBadge()}
// ---------- Pokédex ----------
function dexAll(){return Object.keys(INDEX).filter(sp=>!(typeof RETIRED_SPECIES!=='undefined'&&RETIRED_SPECIES.has(sp))).sort((a,b)=>INDEX[a].number-INDEX[b].number)}
function dexDraw(el){const have=new Set(advSet('dex')),all=dexAll();
 el.innerHTML='<div class="misc-top"><button class="btn smallbtn" onclick="miscView=\'menu\';drawMisc()">‹ BACK</button><b>Pokédex · '+all.filter(s=>have.has(s)).length+'/'+all.length+'</b></div><div class="dex-grid">'+all.map(sp=>'<button class="dex-cell'+(have.has(sp)?'':' unk')+'" onclick="dexOpen(\''+esc(sp)+'\')"><small>#'+String(INDEX[sp].number).padStart(4,'0')+'</small>'+(have.has(sp)?monSprite({species:sp},'',52):'<span class="dex-q">?</span>')+'<b>'+(have.has(sp)?esc(sp):'???')+'</b></button>').join('')+'</div>';fillMonSprites(el)}
let dexAnim=null;
function dexOpen(sp){const have=advSet('dex').includes(sp);if(!have){toast('You haven’t caught this one yet');return}const D=SPECIES_DATA[sp]||{},st=D.stats||[0,0,0,0,0,0],L=['HP','Atk','Def','Sp. Atk','Sp. Def','Speed'];
 modal('#'+String(INDEX[sp].number).padStart(4,'0')+' '+sp.toUpperCase(),'<div class="dex-detail"><canvas id="dexCv" width="160" height="160"></canvas><div class="dex-types">'+(D.types||[]).map(t=>'<span class="type-pill t-'+t+'">'+t.toUpperCase()+'</span>').join('')+'</div>'
  +'<div class="dex-stats">'+st.map((v,i)=>'<div><span>'+L[i]+'</span><b>'+v+'</b><i><em style="width:'+Math.min(100,v/1.6)+'%"></em></i></div>').join('')+'<div class="dex-total"><span>Total</span><b>'+st.reduce((a,b)=>a+b,0)+'</b></div></div>'
  +'<div class="dex-anims" id="dexAnims"><small class="muted">Loading animations…</small></div><button class="btn smallbtn" onclick="dexTurn()">↻ TURN</button></div>');
 dexAnim={sp,anim:'Idle',dir:0};loadAnims(sp).then(a=>{dexAnim.all=a;const names=['Idle','Walk','Attack','Sleep','Hurt','Eat','Charge','Shoot','Hop','Swing'].filter(n=>a[n]);const box=$('dexAnims');if(box)box.innerHTML=names.map(n=>'<button class="btn smallbtn'+(n==='Idle'?' blue':'')+'" onclick="dexPlay(\''+n+'\',this)">'+n+'</button>').join('');dexLoop()}).catch(()=>{const box=$('dexAnims');if(box)box.innerHTML='<small class="muted">No animations bundled.</small>'})}
function dexPlay(n,btn){if(!dexAnim)return;dexAnim.anim=n;document.querySelectorAll('#dexAnims .btn').forEach(b=>b.classList.toggle('blue',b===btn))}
function dexTurn(){if(dexAnim)dexAnim.dir=(dexAnim.dir+1)%8}
function dexLoop(){const cv=$('dexCv');if(!cv||!dexAnim||!dexAnim.all)return;const g=cv.getContext('2d'),A=dexAnim.all[dexAnim.anim]||dexAnim.all.Idle;if(!A)return;
 const img=A._img||(A._img=Object.assign(new Image(),{src:A.url}));const tot=A.d.reduce((a,b)=>a+b,0),t=Math.floor(performance.now()/1000*60)%tot;let f=0,acc=0;for(;f<A.d.length;f++){acc+=A.d[f];if(t<acc)break}
 const row=(A.rows||1)>=8?dexAnim.dir:0,k=Math.min(4,Math.floor(150/Math.max(A.w,A.h)));g.imageSmoothingEnabled=false;g.clearRect(0,0,160,160);
 if(img.complete&&img.naturalWidth)g.drawImage(img,f*A.w,row*A.h,A.w,A.h,80-A.w*k/2,84-A.h*k/2,A.w*k,A.h*k);requestAnimationFrame(dexLoop)}
// ---------- Advancements board ----------
const ADV_T=74;let advCam={x:0,y:0,s:1},advLayout=null;
function advPlace(){if(advLayout)return advLayout;const pos={},heads=[];let X=0;
 ADV_CATS.forEach(([cat,label])=>{const list=ADV.filter(a=>a.cat===cat),fams=[...new Set(list.filter(a=>a.fam).map(a=>a.fam))],singles=list.filter(a=>!a.fam);let x=X,maxY=0;
  fams.forEach((f,i)=>{const chain=list.filter(a=>a.fam===f);chain.forEach((a,j)=>{pos[a.id]={x:x+j*58,y:150+i*96-j*24}});maxY=Math.max(maxY,150+i*96);x=x});
  const fw=Math.max(...fams.map(f=>list.filter(a=>a.fam===f).length*58),58);const sy=maxY+120;singles.forEach((a,i)=>{pos[a.id]={x:X+(i%4)*92,y:sy+Math.floor(i/4)*96}});
  const w=Math.max(fw,Math.min(4,singles.length)*92);heads.push({label,x:X,w});X+=w+150});
 return advLayout={pos,heads,w:X,h:Math.max(...Object.values(pos).map(p=>p.y))+140}}
function advDraw(el){const L=advPlace(),a=advSt();
 el.innerHTML='<div class="misc-top"><button class="btn smallbtn" onclick="miscView=\'menu\';drawMisc()">‹ BACK</button><b>Advancements</b>'+(advAnyClaim()?'<button class="btn smallbtn red adv-claimall" onclick="advClaim(ADV.filter(advClaimable).map(a=>a.id))">CLAIM ALL</button>':'')+'</div><div class="adv-view" id="advView"><div class="adv-board" id="advBoard"></div></div><p class="small muted adv-hint">Drag to look around · pinch to zoom</p>';
 advDrawBoard();advPanZoom($('advView'));const fresh=ADV.filter(x=>advDone(x)&&!a.seen[x.id]);if(fresh.length)advCutscene(fresh);else advCenter(ADV.filter(advClaimable)[0]||ADV[0],false)}
function advDrawBoard(keep){const B=$('advBoard');if(!B)return;const L=advPlace(),a=advSt();B.style.width=L.w+'px';B.style.height=L.h+'px';
 let svg='<svg class="adv-lines" width="'+L.w+'" height="'+L.h+'">';ADV.filter(x=>x.fam&&x.tier>1).forEach(x=>{const p=L.pos[x.id],q=L.pos[x.fam+(x.tier-1)];svg+='<line x1="'+(q.x+28)+'" y1="'+(q.y+28)+'" x2="'+(p.x+28)+'" y2="'+(p.y+28)+'" class="'+(advDone(x)?'on':'')+'"/>'});svg+='</svg>';
 B.innerHTML=svg+L.heads.map(h=>'<div class="adv-head" style="left:'+h.x+'px;width:'+h.w+'px">'+esc(h.label)+'</div>').join('')+ADV.map(x=>{const p=L.pos[x.id],done=advDone(x),cl=a.claimed[x.id],can=advClaimable(x),v=Math.min(x.goal,x.val());
  return '<button class="adv-node'+(done&&a.seen[x.id]?' done':'')+(can?' can':'')+'" data-id="'+x.id+'" style="left:'+p.x+'px;top:'+p.y+'px" onclick="advOpen(\''+x.id+'\')">'+icoHTML(x.icon)+(x.tier?'<i class="adv-tier">'+['I','II','III','IV','V'][x.tier-1]+'</i>':'')+(cl?'<i class="adv-chk">✓</i>':'')+(x.goal>1&&!done?'<em class="adv-bar"><u style="width:'+(v/x.goal*100)+'%"></u></em>':'')+'</button>'}).join('');advApplyCam()}
function advOpen(id){const x=ADV_BY[id],a=advSt(),v=Math.min(x.goal,x.val()),done=advDone(x),can=advClaimable(x),cl=a.claimed[id];
 modal('ADVANCEMENT','<div class="adv-card"><div class="adv-card-l"><div class="adv-card-ico'+(done?'':' off')+'">'+icoHTML(x.icon)+'</div><button class="adv-card-rw'+(can?' can':'')+'" '+(can?'onclick="closeModal();advClaim([\''+id+'\'])"':'disabled')+'>'+advRewardHTML(x.rw)+(can?'<small>Tap to claim</small>':cl?'<small>✓ Claimed</small>':'')+'</button></div>'
  +'<div class="adv-card-r"><h3>'+esc(x.name)+'</h3><p>'+esc(x.desc)+'</p>'+(x.goal>1?'<div class="adv-prog"><i style="width:'+(v/x.goal*100)+'%"></i><b>'+money(v)+' / '+money(x.goal)+'</b></div>':'<p class="small muted">'+(done?'Completed':'Not completed yet')+'</p>')
  +(done&&!advPrevOk(x)?'<p class="small muted">Claim '+esc(ADV_BY[x.fam+(x.tier-1)].name)+' first.</p>':'')+'</div></div>')}
function advApplyCam(){const B=$('advBoard');if(B)B.style.transform='translate('+advCam.x+'px,'+advCam.y+'px) scale('+advCam.s+')'}
function advCenter(x,anim){const V=$('advView'),p=advPlace().pos[x.id];if(!V||!p)return;advCam.x=V.clientWidth/2-(p.x+28)*advCam.s;advCam.y=V.clientHeight/2-(p.y+28)*advCam.s;const B=$('advBoard');if(B)B.style.transition=anim?'transform .45s cubic-bezier(.3,.8,.3,1)':'none';advApplyCam()}
function advPanZoom(V){const pts=new Map();let start=null;
 const st=()=>{const a=[...pts.values()];return a.length>1?{cx:(a[0].x+a[1].x)/2,cy:(a[0].y+a[1].y)/2,d:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)}:{cx:a[0].x,cy:a[0].y,d:0}};
 V.addEventListener('pointerdown',e=>{pts.set(e.pointerId,{x:e.clientX,y:e.clientY});start={...st(),cam:{...advCam},moved:false};$('advBoard').style.transition='none'});
 V.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId)||!start)return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});const s=st(),r=V.getBoundingClientRect();
  let sc=start.cam.s;if(s.d&&start.d)sc=Math.max(.35,Math.min(2.2,start.cam.s*s.d/start.d));const ox=start.cx-r.left,oy=start.cy-r.top,wx=(ox-start.cam.x)/start.cam.s,wy=(oy-start.cam.y)/start.cam.s;
  advCam.s=sc;advCam.x=s.cx-r.left-wx*sc;advCam.y=s.cy-r.top-wy*sc;if(Math.hypot(s.cx-start.cx,s.cy-start.cy)>6||s.d)start.moved=true;advApplyCam()});
 const up=e=>{pts.delete(e.pointerId);if(pts.size){start={...st(),cam:{...advCam},moved:true}}else setTimeout(()=>{start=null},0)};['pointerup','pointercancel','pointerleave'].forEach(k=>V.addEventListener(k,up));
 V.addEventListener('click',e=>{if(start&&start.moved){e.stopPropagation();e.preventDefault()}},true);
 V.addEventListener('wheel',e=>{e.preventDefault();const r=V.getBoundingClientRect(),ox=e.clientX-r.left,oy=e.clientY-r.top,wx=(ox-advCam.x)/advCam.s,wy=(oy-advCam.y)/advCam.s;advCam.s=Math.max(.35,Math.min(2.2,advCam.s*(e.deltaY<0?1.1:.9)));advCam.x=ox-wx*advCam.s;advCam.y=oy-wy*advCam.s;advApplyCam()},{passive:false})}
// cutscene: fly to each newly completed advancement, shake it grey, then slam it into colour
async function advCutscene(list){const V=$('advView');if(!V)return;let skip=false;const a=advSt(),finish=()=>{list.forEach(x=>{a.seen[x.id]=Date.now()});save();advDrawBoard();V.classList.remove('adv-cut')};
 const onTap=e=>{skip=true;e.stopPropagation();e.preventDefault()};V.classList.add('adv-cut');V.addEventListener('pointerdown',onTap,true);V.addEventListener('click',onTap,true);
 for(const x of list){if(skip||!V.isConnected)break;advCenter(x,true);await new Promise(r=>setTimeout(r,520));const n=document.querySelector('.adv-node[data-id="'+x.id+'"]');if(!n||skip)break;
  n.classList.add('adv-shake');await new Promise(r=>setTimeout(r,560));if(skip)break;n.classList.remove('adv-shake');n.classList.add('adv-slam','done');a.seen[x.id]=Date.now();await new Promise(r=>setTimeout(r,520));n.classList.remove('adv-slam')}
 V.removeEventListener('pointerdown',onTap,true);setTimeout(()=>V.removeEventListener('click',onTap,true),50);finish()}
// One-time reset (v0.85.1, requested): Answerer and Second Wind start from zero; rewards already claimed from them are taken back.
function advResetStudy(){const a=advSt();if(a.r851)return;a.r851=1;const ids=ADV.filter(x=>x.fam==='ans'||x.fam==='sw').map(x=>x.id);let eggsBack=0;
 ids.forEach(id=>{if(!a.claimed[id])return;const rw=ADV_BY[id].rw;db.cogs=Math.max(0,Math.round((db.cogs||0)-(rw.cogs||0)));const p=db.pokemon.find(x=>x.id===db.mainId);if(p&&rw.pxp)p.pxp=Math.max(0,(p.pxp||0)-rw.pxp);
  Object.entries(rw.items||{}).forEach(([it,n])=>invAdd(it,-Math.min(n,inv()[it]||0)));if(rw.egg)eggsBack++;delete a.claimed[id]});
 for(let i=eggs().length-1;i>=0&&eggsBack>0;i--)if(eggs()[i].src==='adv'){eggs().splice(i,1);eggsBack--}
 ids.forEach(id=>delete a.seen[id]);a.c.correct=0;a.s.sw=[];save()}
// boot
advInstall();setTimeout(()=>{try{advSeed();advResetStudy()}catch(_){}},1500);setTimeout(()=>{advTick();advBadge()},1600);setInterval(advTick,30000);
