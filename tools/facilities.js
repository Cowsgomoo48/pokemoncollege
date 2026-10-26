// ===================== FACILITIES =====================
// Extra habitat tabs, unlocked from Boxes. One Pokémon trains inside each. A Pokémon in a Facility also gets EXP from
// your completed tasks. Whenever it gains EXP there, the Facility gains the same EXP and levels up (max Lv 10).
// A Facility Ticket raises a Facility by one level. Facilities hold small and medium decor; their background is fixed.
// Level bonuses are totals for that level, not added on top of the level before.
const FAC={gym:{name:'Workout Gym',icon:'🏋️',item:'fac_gym',bg:'./assets/fac/gym.jpg',
 levels:[null,{exp:0,wake:0,start:1},{exp:0,wake:2,start:1},{exp:5,wake:4,start:1},{exp:5,wake:6,start:1.25},{exp:10,wake:8,start:1.25},{exp:10,wake:10,start:1.5},{exp:15,wake:12,start:1.5},{exp:15,wake:15,start:1.75},{exp:20,wake:18,start:2},{exp:25,wake:20,start:2.5}]}};
const FAC_XP=[0,0,60000,160000,320000,560000,900000,1360000,1960000,2720000,3700000]; // total Facility EXP for each level
const FAC_STATS=['HP','Attack','Defense','Sp. Atk','Sp. Def','Speed'],GYM_GROW=g=>.75-.63*(g-1)/12,GYM_SLEEP_H=6,MON_XP_HOUR=4537.5; // one hour of training is worth half an hour as your companion
function facs(){return db.facilities||(db.facilities={})}
function facOwned(){return Object.keys(facs()).length>0}
function facLv(f){let L=1;while(L<10&&(f.xp||0)>=FAC_XP[L+1])L++;return L}
function facBonus(id){const f=facs()[id];return FAC[id].levels[f?facLv(f):1]}
function facMon(f){return f&&f.mon?db.pokemon.find(p=>p.id===f.mon)||null:null}
function facOf(monId){return Object.keys(facs()).find(k=>facs()[k].mon===monId)||null}
function facName(p){return p?(p.nickname||p.species):''}
// EXP for a Pokémon inside a Facility; the Facility earns the same and may level up
function facGain(id,p,xp,ev){const f=facs()[id],lb=monLv(p),fb=facLv(f);p.pxp=(p.pxp||0)+xp;f.xp=(f.xp||0)+xp;
 if(monLv(p)>lb&&ev)ev.push('⬆ '+facName(p)+' grew to Lv '+monLv(p)+'!');if(facLv(f)>fb&&ev)ev.push(FAC[id].icon+' '+FAC[id].name+' reached Lv '+facLv(f)+'!')}
function facUnlock(item){const it=ITEMS[item];if(!it||!inv()[item])return;const id=it.fac;if(facs()[id]){toast('You already have the '+FAC[id].name);return}
 invAdd(item,-1);facs()[id]={xp:0,mon:null,decor:{small:[],medium:[null,null,null,null]},last:0,since:0,chance:FAC[id].levels[1].start,wins:0,sleepUntil:0,log:[]};save();closeModal();closeInv();go('home');hab.scene=id;drawHabitat();toast(FAC[id].icon+' '+FAC[id].name+' unlocked! It’s a new tab in your habitat.')}
function facTicketUse(id){const f=facs()[id];if(!f||!inv().facticket)return;const L=facLv(f);if(L>=10){toast(FAC[id].name+' is already Lv 10');return}
 invAdd('facticket',-1);f.xp=Math.max(f.xp||0,FAC_XP[L+1]);save();closeModal();closeInv();render();toast('🎫 '+FAC[id].name+' is now Lv '+facLv(f)+'!')}
function facTicketPick(){const ids=Object.keys(facs());if(!ids.length){toast('Unlock a Facility first (they come from Boxes)');return}if(ids.length===1)return facTicketUse(ids[0]);
 modal('FACILITY TICKET','<p class="small">Which Facility should go up a level?</p><div class="actions">'+ids.map(id=>'<button class="btn" onclick="facTicketUse(\''+id+'\')">'+FAC[id].icon+' '+FAC[id].name+' · Lv '+facLv(facs()[id])+'</button>').join('')+'</div>')}
// put a Pokémon in (your main companion stays home; a Pokémon can only be in one Facility)
function facPlace(id,monId){const f=facs()[id];if(!f)return;if(monId===db.mainId){toast('Your companion stays in the habitat. Pick another Pokémon.');return}
 const other=facOf(monId);if(other&&other!==id){facs()[other].mon=null}const now=Date.now();f.mon=monId;f.last=now;f.since=now;f.wins=0;f.chance=facBonus(id).start;
 save();closeModal();drawHabitat();const p=facMon(f);toast(FAC[id].icon+' '+facName(p)+' started training!')}
function facRemove(id){const f=facs()[id];if(!f||!f.mon)return;const p=facMon(f);f.mon=null;save();drawHabitat();toast(facName(p)+' left the '+FAC[id].name)}
function facChooser(id){const list=db.pokemon.filter(p=>p.id!==db.mainId);if(!list.length){toast('Catch another Pokémon first: your companion stays home');return}
 monChooser(FAC[id].icon+' '+FAC[id].name.toUpperCase(),list,'facPick_'+id,'<p class="small muted">Pick who trains here. Your main companion stays in the habitat.</p>')}
Object.keys(FAC).forEach(id=>{window['facPick_'+id]=pid=>facPlace(id,pid)});
// ---- Workout Gym: one check every hour it's awake ----
// The check starts at the level's chance (1% at Lv 1); every miss doubles it (1 → 2 → 4 → 8 → 16 → 32 → 64 → 100%).
// A hit pays EXP for the hours trained since the last hit and works on one random growth rate. It may be a breakthrough
// that raises that rate a grade: 75% at F, sliding down to 12% at A (a typical Pokémon maxes out all six in about 2 months).
// After 3 hits the lights go out and it sleeps (6 hours, shorter at higher levels), then starts over.
function gymTick(now){const f=facs().gym;if(!f)return [];now=now||Date.now();const ev=[],B=()=>FAC.gym.levels[facLv(f)];
 if(!f.mon){f.last=now;return ev}const p=facMon(f);if(!p){f.mon=null;return ev}
 for(let guard=0;guard<2000;guard++){
  if(f.sleepUntil){if(now<f.sleepUntil)break;f.last=f.since=f.sleepUntil;f.sleepUntil=0;f.chance=B().start;continue}
  if(f.last+36e5>now)break;f.last+=36e5;
  if(Math.random()*100<f.chance){const g=[...monGrowth(p)],open=g.map((v,i)=>v<14?i:-1).filter(i=>i>=0),hrs=(f.last-f.since)/36e5,xp=Math.round(hrs*MON_XP_HOUR*(1+B().exp/100));let line;
   if(!open.length)line='growth already maxed';else{const i=open[Math.floor(Math.random()*open.length)];if(Math.random()<GYM_GROW(g[i])){g[i]++;p.growth=g;line='breakthrough! '+FAC_STATS[i]+' growth → '+GRADES[g[i]-1]}else line='good workout'}
   ev.push('💪 '+facName(p)+': '+line+' (+'+money(xp)+' EXP)');facGain('gym',p,xp,ev);f.log=[{at:f.last,t:line,xp,mon:p.id},...(f.log||[])].slice(0,20);
   f.since=f.last;f.chance=B().start;f.wins=(f.wins||0)+1;
   if(f.wins>=3){f.wins=0;f.sleepUntil=f.last+GYM_SLEEP_H*36e5*(1-B().wake/100);ev.push('💤 Lights out: '+facName(p)+' is sleeping for '+fmtHM(f.sleepUntil-f.last)+'.')}}
  else f.chance=Math.min(100,f.chance*2)}
 return ev}
function facPct(c){return (c<10?+c.toFixed(2):Math.round(c))+'%'}
function fmtHM(ms){const t=Math.max(0,Math.round(ms/6e4)),h=Math.floor(t/60),m=t%60;return (h?h+'h ':'')+m+'m'}
function facTick(){if(!db||!facOwned())return;const ev=gymTick();if(!ev.length)return;save();
 gmNotice(ev.length<=2?ev.join(' · '):'🏋️ While you were away: '+ev.filter(x=>x.startsWith('💪')).length+' training boosts · '+ev.slice(-1)[0]);try{if(currentPage==='home')drawHabitat()}catch(e){}}
// EXP from completed tasks also reaches Pokémon inside Facilities (and so the Facilities)
function facTaskXp(xp){const out=[];for(const id of Object.keys(facs())){const f=facs()[id],p=facMon(f);if(!p||p.id===db.mainId)continue;facGain(id,p,xp,null);out.push({fac:id,id:p.id,xp})}return out}
function facTaskXpUndo(list){for(const x of list||[]){const p=db.pokemon.find(q=>q.id===x.id),f=facs()[x.fac];if(p)p.pxp=Math.max(0,(p.pxp||0)-x.xp);if(f)f.xp=Math.max(0,(f.xp||0)-x.xp)}}
// ---- drawing it inside the habitat ----
function facStatus(id){const f=facs()[id],p=facMon(f),now=Date.now();if(!p)return 'Empty: tap, then “Choose Pokémon”';if(f.sleepUntil>now)return '💤 Lights out · wakes in '+fmtHM(f.sleepUntil-now);
 return '💪 '+facName(p)+' · next check in '+fmtHM(f.last+36e5-now)+' · '+facPct(f.chance)+' · boosts '+(f.wins||0)+'/3'}
async function facDrawMon(id){const box=$('pasture');if(!box)return;let el=$('facMon');const f=facs()[id],p=facMon(f);
 if(!p){if(el)el.remove();return}const key=f.sleepUntil>Date.now()?'Sleep':'Attack',sig=p.species+'|'+key;if(el&&el.dataset.sig===sig)return;
 if(!el){el=document.createElement('div');el.id='facMon';el.className='fac-mon';box.appendChild(el)}el.dataset.sig=sig;let a=null;try{a=await loadAnims(p.species)}catch(e){}
 const an=a&&(a[key]||(key==='Sleep'?a.Idle:a.Walk)||a.Idle);if(!an){el.innerHTML=portraitHTML(p.species,'dg-port');return}
 el.innerHTML='';el.style.cssText='width:'+an.w+'px;height:'+an.h+'px;background-image:url('+an.url+');background-position:0 0;--fw:'+an.w+'px;--fn:'+an.frames+';animation:dsx '+(an.d.reduce((x,y)=>x+y,0)/60).toFixed(2)+'s steps('+an.frames+') infinite;zoom:'+Math.min(2.4,64/((a.Idle||an).h||an.h)).toFixed(2)}
function facInfo(id){const f=facs()[id],L=facLv(f),B=FAC[id].levels,next=L<10?FAC_XP[L+1]:null,p=facMon(f);
 const rows=B.slice(1).map((b,i)=>'<tr'+(i+1===L?' class="on"':'')+'><td>Lv '+(i+1)+'</td><td>'+b.start+'%</td><td>'+(b.exp?'+'+b.exp+'%':'—')+'</td><td>'+(b.wake?'−'+b.wake+'%':'—')+'</td></tr>').join('');
 modal(FAC[id].icon+' '+FAC[id].name.toUpperCase()+' · LV '+L,'<p class="small">'+(p?esc(facName(p))+' is training here. ':'Nobody is training here yet. ')+'Every hour it’s awake, the gym rolls a check. A hit pays EXP for the hours trained (half the rate of companion time), and works on one random growth rate. It may be a breakthrough that raises that rate a grade: likely for low grades (75% at F), rare for high ones (12% at A). A miss doubles the chance for next time. After 3 hits the lights go out for '+GYM_SLEEP_H+' hours (less at higher levels).</p>'
  +'<div class="fac-xp"><span style="width:'+(next?Math.min(100,((f.xp||0)-FAC_XP[L])/(next-FAC_XP[L])*100):100)+'%"></span></div><p class="small muted">'+(next?money(Math.round((f.xp||0)-FAC_XP[L]))+' / '+money(next-FAC_XP[L])+' Facility EXP to Lv '+(L+1)+' · Facility Tickets add a level':'Max level')+'</p>'
  +'<table class="fac-tbl"><tr><th>Level</th><th>Start chance</th><th>EXP</th><th>Sleep time</th></tr>'+rows+'</table>'
  +((f.log||[]).length?'<p class="small" style="margin-top:10px"><b>Recent boosts</b></p><div class="small muted">'+f.log.slice(0,8).map(x=>new Date(x.at).toLocaleString([],{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})+' · '+esc(facName(db.pokemon.find(q=>q.id===x.mon))||'?')+': '+esc(x.t)+' (+'+money(x.xp)+' EXP)').join('<br>')+'</div>':'')
  +'<div class="actions">'+(inv().facticket&&L<10?'<button class="btn blue" onclick="facTicketUse(\''+id+'\')">USE FACILITY TICKET</button>':'')+'<button class="btn" onclick="closeModal()">CLOSE</button></div>')}
function habTabsHTML(){if(!facOwned())return '◉ COMPANION HABITAT';const s=hab.scene||'home';return '<span class="hab-tabs">'+[['home','◉ HABITAT']].concat(Object.keys(facs()).map(id=>[id,FAC[id].icon+' '+FAC[id].name.toUpperCase().replace('WORKOUT ','')])).map(([k,n])=>'<button class="'+(s===k?'on':'')+'" onclick="event.stopPropagation();hab.scene=\''+k+'\';hab.edit=false;drawHabitat()">'+n+'</button>').join('')+'</span>'}
