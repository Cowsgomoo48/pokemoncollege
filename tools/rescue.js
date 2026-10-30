// Rescue Drill: random study loot, never a timed or guaranteed drop.
const MD_RESCUE_CHANCE=1/80;
function mdRescueFind(r){if(!r||r.tower||!r.fl||r.rescueDrill||Math.random()>=MD_RESCUE_CHANCE)return false;r.bag.rescue_drill=(r.bag.rescue_drill||0)+1;save();toast('Rescue Drill found! Added to your run bag.');return true}
function mdRescueDepth(from,correct){const r=runOf(),gate=r&&!r.ocManaphyCleared&&from<=14?14:MD_TOTAL-1;return Math.max(0,Math.min(correct,gate-from))}
function mdRescueScene(r){document.querySelectorAll('.md-rescue').forEach(x=>x.remove());const el=document.createElement('div');el.className='md-rescue';el.innerHTML='<div class="md-rescue-tunnel"><i></i><img src="./assets/items/rescue_drill.png" alt="Rescue Drill tunneling downward"><div class="md-rescue-rocks">'+Array.from({length:12},(_,i)=>'<b style="--i:'+i+'"></b>').join('')+'</div></div><div class="md-rescue-status" role="status"></div>';document.body.appendChild(el);return el}
function mdRescueStatus(el,p){const status=el.querySelector('.md-rescue-status');if(status)status.textContent='RESCUE DRILL · '+p.done+'/'+p.max+' questions · '+p.correct+' floors dug';el.style.setProperty('--depth',p.correct)}
async function mdRescueDrill(){const r=runOf(),state=DG,ep=dgEpoch;if(!r||!state||r.tower||!r.fl||state.rescueActive)return;if(r.floor===14&&!r.ocManaphyCleared){state.busy=0;toast('Defeat the Oceanic Crust guardian before drilling deeper.');return}state.rescueActive=true;if(!r.rescueDrill){if(!r.bag.rescue_drill||mdIsLast(r)){state.rescueActive=false;state.busy=0;dgPanelBattle();return}r.rescueDrill={max:2+Math.floor(Math.random()*4),done:0,correct:0,from:r.floor};r.bag.rescue_drill--;save()}
 const p=r.rescueDrill;state.busy=1;dgTarget=null;const el=mdRescueScene(r),valid=()=>runOf()===r&&DG===state&&dgEpoch===ep;
 try{mdRescueStatus(el,p);await dgSleep(650);
  while(p.done<p.max&&valid()){const tier=p.done+1,it=mdDigItem(tier);if(!it)throw new Error('No study question available');
   const res=await askQ(it,state.bank,{title:'RESCUE DRILL · QUESTION '+tier+'/'+p.max,typed:tier>=3?undefined:false,typedChance:tier>=3?1:0,halfsies:!!r.halfsies});if(!valid())return;
   state.P.report(it,res==='half'?'fail':res);if(res!=='full'&&__qMiss)recapAdd(it,__qMiss);if(res==='full'){p.correct++;r.qOk=(r.qOk||0)+1}p.done++;save();mdRescueStatus(el,p);
   el.classList.toggle('md-rescue-hit',res==='full');toast(res==='full'?'Drilled one floor deeper!':'No depth gained. Keep going.');await dgSleep(750);el.classList.remove('md-rescue-hit');
  }
  if(!valid())return;const steps=mdRescueDepth(p.from,p.correct);if(steps){
   // Advance sublayer planning for bypassed floors, generating only the destination.
   for(let i=1;i<steps;i++){r.floor=p.from+i;mdPlan(r)}r.floor=p.from+steps;gdNewFloor(r);
   // Even a landing within the same sublayer gets the requested flag transition.
   if(!r.digs||r.digs[r.digs.length-1]?.f!==r.floor){(r.digs=r.digs||[]).push({f:r.floor,k:r.sub.k});if(r.digs.length>40)r.digs.shift()}
  }
  delete r.rescueDrill;save();el.remove();state.busy=0;gdDrawBattle(true);
  if(steps){toast('Rescue Drill: descended '+steps+' floor'+(steps===1?'':'s')+' to B'+(r.floor+1)+'F.');state.busy=1;try{await mdDig(r)}finally{if(valid())state.busy=0}}else toast('The drill ran out of power. No floors skipped.');
 }catch(e){if(valid()){toast('Drilling paused. Save and continue the run to resume.');console.error(e)}}finally{state.rescueActive=false;el.remove();if(valid()){state.busy=0;if(r.battle)r.battle.usedItem=false;gdDrawBattle()}}
}
