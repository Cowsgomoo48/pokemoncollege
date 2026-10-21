// ---- Due times & reminder modes ----
function dueAt(t){if(!t.due)return null;const d=dateStart(t.due),p=(t.dueTime||'23:59').split(':').map(Number);d.setHours(p[0]||0,p[1]||0,0,0);return d}
function wakeHours(d){const x=new Date(d);if(x.getHours()<8)x.setHours(8,0,0,0);else if(x.getHours()>=22)x.setHours(21,0,0,0);return x}
function fmtDue(t){const d=dueAt(t);return d?d.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'})+(t.dueTime?' '+d.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'}):''):''}
// Default: 75% / 50% / 25% of the time left + the day before. Pester: a day after it was set, 80/60/40/20% left, the day before and the day it's due. Urgent: every day.
function taskReminders(t,o){const end=dueAt(t);if(!end)return [];const start=new Date(t.rewardSetAt||t.createdAt||Date.now()).getTime(),span=end-start,out=[],mode=t.remind||'default',when=dueText=>fmtDue(t);
 const pct=left=>({at:wakeHours(new Date(start+span*(1-left))),title:'⏰ '+t.title,body:Math.round(left*100)+'% of your time left · due '+fmtDue(t)});
 const dayBefore={at:(()=>{const d=new Date(end);d.setDate(d.getDate()-1);const p=o.evening.split(':').map(Number);d.setHours(p[0],p[1],0,0);return d})(),title:'Due tomorrow: '+t.title,body:'Due '+fmtDue(t)+(t.assignment?' · finish tonight for the early bonus':'')};
 const dayOf={at:(()=>{const d=new Date(end);const p=o.morning.split(':').map(Number);d.setHours(p[0],p[1],0,0);return d})(),title:'Due today: '+t.title,body:'Due '+fmtDue(t)+' · check it off in PokemonCollege 🌳'};
 if(span<=0)return [dayOf];
 if(mode==='urgent'){const d=new Date();const p=o.morning.split(':').map(Number);d.setHours(p[0],p[1],0,0);if(d.getTime()<Date.now())d.setDate(d.getDate()+1);for(let k=0;k<60&&d<end;k++){out.push({at:new Date(d),title:'🚨 '+t.title,body:'Due '+fmtDue(t)+' · a little today goes a long way'});d.setDate(d.getDate()+1)}return out}
 if(mode==='pester'){out.push({at:wakeHours(new Date(start+864e5)),title:'👀 '+t.title,body:'Just checking in · due '+fmtDue(t)},pct(.8),pct(.6),pct(.4),pct(.2),dayBefore,dayOf);return out}
 out.push(pct(.75),pct(.5),pct(.25),dayBefore);return out}
// ---- Rewards pass: tap the level bar ----
const PASS_MAX=100;
function passReward(l){const r=seededRand('pass'+l),pick=a=>a[Math.floor(r()*a.length)];
 const special={12:{item:'bg_a12'},15:{item:'bowl'},20:{item:'dummy',candy:2},30:{mon:'rare'},35:{item:'bed'},40:{item:'shinyticket',box:'greater'},50:{mon:'rare',box:'ultra'},60:{item:'goldapple',box:'greater'},75:{mon:'shiny'},90:{item:'shinyticket',box:'ultra'},100:{mon:'costume',box:'ultra',cogs:500}};
 if(special[l])return special[l];
 if(l%25===0)return {box:'ultra',item:'shinyticket'};
 if(l%10===0)return {box:'greater',candy:2};
 if(l%5===0)return {box:'poke',tm:true};
 if(l%3===0)return {item:pick(l<40?['t_standard','t_standard','t_shiny']:['t_shiny','t_shiny','t_deluxe'])};
 if(l%2===0)return {item:pick(l<30?['apple','cookie','grass','flower','rock','path']:l<60?['honey','riceball','candle','lantern','mushroom','ball','yarn']:['cake','plush','crystal','riceball'])};
 return {cogs:15+l}}
function passIcon(rw){if(rw.mon)return '<span class="it-emoji">'+(rw.mon==='shiny'?'✨':rw.mon==='costume'?'🎀':'🐾')+'</span>';if(rw.box)return itemIcon(BOXES[rw.box].item);if(rw.item)return itemIcon(rw.item);if(rw.tm)return '<span class="it-emoji">💿</span>';if(rw.candy)return '<span class="it-emoji">🍬</span>';return '<span class="it-emoji">⚙️</span>'}
function passText(rw){const p=[];if(rw.mon)p.push(rw.mon==='shiny'?'Shiny Pokémon':rw.mon==='costume'?'Costumed Pokémon':'Rare Pokémon');if(rw.box)p.push(BOXES[rw.box].name);if(rw.item)p.push(ITEMS[rw.item].name);if(rw.tm)p.push('TM Disc');if(rw.candy)p.push(rw.candy+' Rare Cand'+(rw.candy>1?'ies':'y'));if(rw.cogs)p.push(rw.cogs+' Cogs');return p.join(' + ')}
function playerLevel(){return 1+Math.floor((db.xp||0)/100)}
function passClaimed(){return db.passClaimed||(db.passClaimed=[])}
function passUnclaimed(){const lv=Math.min(PASS_MAX,playerLevel()),c=new Set(passClaimed()),out=[];for(let l=2;l<=lv;l++)if(!c.has(l))out.push(l);return out}
function claimPass(l){if(l>playerLevel()||passClaimed().includes(l))return;const rw=passReward(l),got=[];
 if(rw.cogs){db.cogs=Math.round(db.cogs+rw.cogs);got.push(rw.cogs+' Cogs')}
 if(rw.candy){db.candies+=rw.candy;got.push(rw.candy+' 🍬')}
 if(rw.item){invAdd(rw.item);got.push(ITEMS[rw.item].name)}
 if(rw.box){invAdd(BOXES[rw.box].item);got.push(BOXES[rw.box].name)}
 if(rw.tm){const slot=Math.random()<.35?'fast':'charged',pool=Object.entries(MOVE_STATS).filter(x=>x[1][3]===slot);const mv=pool[Math.floor(Math.random()*pool.length)][0];db.tmDiscs.push(makeTM(slot,mv,'Level '+l+' reward'));got.push(mv+' TM')}
 if(rw.mon){const m=rw.mon==='rare'?monOfTier(2,4):monOfTier(0,4);if(rw.mon==='shiny')m.shiny=true;if(rw.mon==='costume')m.costume=seasonCostume();const e=giveMon(m);got.push((e.shiny?'✨ ':'')+(e.costume?'🎀 ':'')+e.species)}
 passClaimed().push(l);save();render();drawPass();toast('🎁 Lv '+l+': '+got.join(', '))}
function claimAllPass(){passUnclaimed().forEach(l=>claimPass(l))}
function openPass(){modal('TRAINER REWARDS','<div id="passBox"></div>');drawPass(true)}
function drawPass(scroll){const el=$('passBox');if(!el)return;const lv=playerLevel(),c=new Set(passClaimed()),un=passUnclaimed();
 let h='<div class="pass-head"><b>Lv '+lv+'</b><span>'+(un.length?un.length+' reward'+(un.length>1?'s':'')+' ready':'All caught up')+'</span>'+(un.length>1?'<button class="btn smallbtn red" onclick="claimAllPass()">CLAIM ALL</button>':'')+'</div><div class="pass-track" id="passTrack">';
 for(let l=2;l<=PASS_MAX;l++){const rw=passReward(l),got=c.has(l),ready=l<=lv&&!got,big=!!(rw.box||rw.mon||rw.item==='shinyticket');
  h+='<div class="pass-node'+(got?' got':ready?' ready':' locked')+(big?' big':'')+'" data-l="'+l+'"><span class="pass-lv">Lv '+l+'</span><span class="pass-ico">'+passIcon(rw)+'</span><small>'+esc(passText(rw))+'</small>'+(ready?'<button class="btn smallbtn" onclick="claimPass('+l+')">CLAIM</button>':got?'<em>✓</em>':'<em>🔒</em>')+'</div>'}
 el.innerHTML=h+'</div><p class="small muted">Every level has a reward: Cogs, snacks, decor and Safari Tickets along the way, a PokeBox every 5 levels, a GreaterBox every 10 and an UltraBox every 25, plus special rewards at 12, 15, 20, 30, 35, 40, 50, 60, 75, 90 and 100.</p>';
 if(scroll){const t=$('passTrack'),target=t.querySelector('.ready')||t.querySelector('[data-l="'+Math.min(PASS_MAX,lv+1)+'"]');if(target)setTimeout(()=>t.scrollLeft=target.offsetLeft-t.clientWidth/2+target.clientWidth/2,30)}}
// ---- Reset progress ----
function resetPrompt(full){if(full){if(!confirm('FULL RESET erases ALL progress AND all your tasks, summaries, quiz sets, recordings and photos. Continue?'))return;if(!confirm('Are you absolutely sure? This cannot be undone.'))return}
 else{if(!confirm('Reset your progress? Level, Cogs, Poképuffs, Rare Candies, Pokémon, items and decor will be cleared. Your tasks, summaries, recordings and photos stay.'))return;if(!confirm('Are you sure?'))return}
 resetShow(full)}
async function resetShow(full){closeModal();const before={lv:playerLevel(),puffs:db.puffs||0,candies:db.candies||0,cogs:Math.round(db.cogs||0)},mons=(db.pokemon.length?db.pokemon:[{species:'Magearna'}]).slice(0,6);
 const fx=document.createElement('div');fx.className='resetfx';fx.innerHTML='<div class="rs-sky"></div><div class="rs-lake"></div><div class="rs-field"><i></i><i></i><i></i><i></i><i></i></div><div class="rs-walkers"></div><div class="rs-stats"><div><small>LEVEL</small><b id="rsLv">'+before.lv+'</b></div><div><small>🧁</small><b id="rsPf">'+before.puffs+'</b></div><div><small>🍬</small><b id="rsCa">'+before.candies+'</b></div><div><small>⚙</small><b id="rsCo">'+before.cogs.toLocaleString()+'</b></div></div><div class="rs-bar top"></div><div class="rs-bar bot"></div>';document.body.appendChild(fx);
 const walkers=fx.querySelector('.rs-walkers');for(let i=0;i<mons.length;i++){let a;try{a=(await loadAnims(mons[i].species)).Walk}catch(e){a=null}const w=document.createElement('div');w.className='rs-mon';if(a){const k=Math.min(2,72/a.h);w.innerHTML='<div class="rs-spr" style="width:'+a.w+'px;height:'+a.h+'px;background-image:url('+a.url+');transform:scale('+k+')"></div>';const sp=w.firstChild;let f=0;const tick=()=>{if(!w.isConnected)return;sp.style.backgroundPosition=(-f*a.w)+'px '+(-2*a.h)+'px';f=(f+1)%a.frames;setTimeout(tick,Math.max(70,a.d[f%a.d.length]*1000/60))};tick()}else w.textContent='◉';w.style.animationDelay=(i*.45)+'s';walkers.appendChild(w)}
 requestAnimationFrame(()=>fx.classList.add('on'));
 const dur=3200,t0=performance.now()+900,count=now=>{const k=Math.max(0,Math.min(1,(now-t0)/dur)),e=1-k;$('rsLv').textContent=Math.max(1,Math.round(1+(before.lv-1)*e));$('rsPf').textContent=Math.round(before.puffs*e);$('rsCa').textContent=Math.round(before.candies*e);$('rsCo').textContent=Math.round(before.cogs*e).toLocaleString();if(k<1)requestAnimationFrame(count)};requestAnimationFrame(count);
 setTimeout(()=>fx.classList.add('close'),dur+1300);
 setTimeout(async()=>{await resetData(full);render();go('home');fx.classList.add('fade');setTimeout(()=>fx.remove(),700);toast('🌱 A fresh start! 3 Safari Tickets are in your bag')},dur+2300)}
async function resetData(full){const keep=full?{}:{tasks:db.tasks,summaries:db.summaries,recordings:db.recordings,pics:db.pics,picFolders:db.picFolders,focus:db.focus};
 if(full){for(const r of db.recordings||[]){try{await ct('remove',{id:r.id})}catch(e){}}for(const p of db.pics||[]){try{await pp('remove',{id:p.id})}catch(e){}}}
 const settings={notif:db.notif,chatOpts:db.chatOpts};db=Object.assign(blankSave(),keep,settings);
 for(const t of db.tasks||[])if(t.permeate)t.log=[];
 db.inv={t_standard:3};db.levelRewardBaseline=0;db.passClaimed=[];ensureMoveData();save()}
