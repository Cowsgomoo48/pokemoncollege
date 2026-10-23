// ===================== MINIGAMES =====================
// Question bank from summaries: "Term: definition" lines and AI quiz questions.
function mgBank(sids){const out=[];for(const s of db.summaries){if(!sids.includes(s.id))continue;
 termsFor(s).forEach(t=>out.push({kind:'term',sid:s.id,key:s.id+'|t|'+t.term,front:t.term,back:t.definition}));
 (s.quiz||[]).forEach(q=>out.push({kind:'mc',sid:s.id,key:s.id+'|q|'+q.question,front:q.question,back:q.answer,wrong:(q.wrong||[]).slice(0,3)}));
 // practice problems made in code: two fresh ones per problem type each game
 prOf(s).forEach(id=>{for(let k=0;k<2;k++){const p=prInstance(id);if(p)out.push({kind:'gen',gid:id,sid:s.id,key:s.id+'|g|'+id+'|'+k,front:p.q,back:p.a,wrong:p.w,explain:p.ex})}})}return out}
function qstat(key){const q=db.qstats||(db.qstats={});return q[key]||(q[key]={r:0,w:0,last:0,miss:0})}
function qRecord(item,ok){const s=qstat(item.key);if(ok){s.r++;s.miss=Math.max(0,s.miss-1)}else{s.w++;s.miss=Math.min(5,s.miss+2)}s.last=Date.now()}
function isWeak(item){const s=(db.qstats||{})[item.key];return !!s&&(s.miss>0||s.w>s.r/2)}
// Study modes: smart (broad pass first, then weak spots), learn (repeat each item until it's right twice), weak (weak points only)
function mgPicker(bank,mode){const P={mode,bank,queue:[],phase:1,mastery:{},done:false,last:null};
 if(mode==='weak')P.bank=bank.filter(isWeak);
 const unseenFirst=a=>shuffle([...a]).sort((x,y)=>((db.qstats||{})[x.key]?1:0)-((db.qstats||{})[y.key]?1:0));
 P.queue=mode==='learn'?shuffle([...P.bank]):unseenFirst(P.bank);
 P.weight=it=>{const s=(db.qstats||{})[it.key]||{r:0,w:0,miss:0};return 1+s.miss*3+Math.max(0,s.w-s.r)};
 P.next=()=>{if(!P.bank.length)return null;let it;
  if(P.queue.length)it=P.queue.shift();
  else{if(mode==='learn'&&!P.done){P.done=true;[...new Set(P.bank.map(b=>b.sid))].forEach(sid=>{(db.learned||(db.learned={}))[sid]=true});save()}
   P.phase=2;const tot=P.bank.reduce((a,b)=>a+P.weight(b),0);let r=Math.random()*tot;it=P.bank[P.bank.length-1];for(const b of P.bank){r-=P.weight(b);if(r<0){it=b;break}}}
  if(P.last&&it===P.last&&P.bank.length>1&&P.queue.length){P.queue.push(it);it=P.queue.shift()}P.last=it;return it};
 P.report=(it,res)=>{if(mode==='learn'&&!P.done){if(res==='full')P.mastery[it.key]=(P.mastery[it.key]||0)+1;if((P.mastery[it.key]||0)<2){const at=Math.min(P.queue.length,res==='full'?P.queue.length:3);P.queue.splice(at,0,it)}}};
 P.progress=()=>mode==='learn'&&!P.done?P.bank.filter(b=>(P.mastery[b.key]||0)>=2).length+' / '+P.bank.length+' learned':'';
 return P}
// Multiple-choice question for an item. variant 0 asks one way, 1 the other way (used for Make-Up questions).
function mgQuestion(item,bank,variant){const others=bank.filter(b=>b!==item),pick=(arr,f)=>shuffle(arr.filter(f)).slice(0,3);
 if(item.kind==='gen'){const p=prInstance(item.gid)||{q:item.front,a:item.back,w:item.wrong,ex:item.explain};return {prompt:p.q,sub:(PR[item.gid]?PR[item.gid].name+' · ':'')+'work it out.',options:shuffle([{t:p.a,ok:true},...p.w.map(w=>({t:w,ok:false}))]),explain:p.ex}}
 if(item.kind==='mc'&&variant===0)return {prompt:item.front,sub:'Choose the right answer.',options:shuffle([{t:item.back,ok:true},...item.wrong.map(w=>({t:w,ok:false}))]),explain:'The answer is “'+item.back+'”.'};
 if(item.kind==='mc'){const tie=bank.find(b=>b.kind==='term'&&b.front.toLowerCase()===String(item.back).toLowerCase());if(tie)return mgQuestion(tie,bank,1);return {prompt:item.front,sub:'Make-Up: think it through once more.',options:shuffle([{t:item.back,ok:true},...item.wrong.map(w=>({t:w,ok:false}))]),explain:'The answer is “'+item.back+'”.'}}
 const terms=others.filter(b=>b.kind==='term');
 if(variant===0)return {prompt:item.back,sub:'Which term matches this definition?',options:shuffle([{t:item.front,ok:true},...pick(terms,()=>true).map(b=>({t:b.front,ok:false}))]),explain:'“'+item.front+'” means: '+item.back};
 return {prompt:'What does “'+item.front+'” mean?',sub:'Pick the best definition.',options:shuffle([{t:item.back,ok:true},...pick(terms,()=>true).map(b=>({t:b.back,ok:false}))]),explain:'“'+item.front+'” means: '+item.back}}
// Shared question pop-up. Resolves 'full' (first try right), 'makeup' (Make-Up right) or 'fail'.
function askQ(item,bank,opts={}){return new Promise(res=>{const ov=document.createElement('div');ov.className='mgq';document.body.appendChild(ov);const v0=Math.random()<.5?0:1;
 const show=(q,isMakeUp)=>{ov.innerHTML='<div class="mgq-card">'+(opts.title?'<span class="badge">'+esc(opts.title)+'</span> ':'')+(isMakeUp?'<span class="badge mk">MAKE-UP</span>':'')+'<h3>'+esc(q.prompt)+'</h3><p class="small muted">'+esc(q.sub)+'</p>'+(opts.hint&&!isMakeUp?'<button class="btn smallbtn mgq-hint">💡 Hint</button>':'')+q.options.map((o,i)=>'<button class="answer" data-i="'+i+'">'+esc(o.t)+'</button>').join('')+'</div>';
  const hb=ov.querySelector('.mgq-hint');if(hb)hb.onclick=()=>{const wrong=[...ov.querySelectorAll('.answer')].filter(x=>!q.options[+x.dataset.i].ok);shuffle(wrong).slice(0,Math.max(1,wrong.length-1)).forEach(x=>x.classList.add('ans-gone'));hb.remove()};
  ov.querySelectorAll('.answer').forEach(b=>b.onclick=()=>{const o=q.options[+b.dataset.i];ov.querySelectorAll('.answer').forEach(x=>{x.disabled=true;if(q.options[+x.dataset.i].ok)x.classList.add('correct')});
   if(o.ok){qRecord(item,true);setTimeout(()=>{ov.remove();res(isMakeUp?'makeup':'full')},550);return}
   b.classList.add('wrong');qRecord(item,false);const card=ov.querySelector('.mgq-card');
   card.insertAdjacentHTML('beforeend','<div class="notice mgq-ex">'+esc(q.explain)+'</div><button class="btn '+(isMakeUp||opts.makeUp===false?'blue':'red')+' mgq-go">'+(isMakeUp||opts.makeUp===false?'CONTINUE':'MAKE-UP QUESTION →')+'</button>');
   card.querySelector('.mgq-go').onclick=()=>{if(isMakeUp||opts.makeUp===false){ov.remove();res('fail')}else show(mgQuestion(item,bank,1-v0),true)}})};
 show(mgQuestion(item,bank,v0),false)})}
// ---------- menu & setup ----------
const MG={dungeon:{name:'Mystery Dungeon',icon:'🏰',desc:'Lead up to 4 Pokémon through a study dungeon.'},luxor:{name:'Luxor',icon:'🔮',desc:'Fire type-marbles to break the chain. Questions push it back.'},flash:{name:'Flashcards',icon:'🎴',desc:'Flip, check yourself, repeat.'},match:{name:'Match-Up',icon:'🧩',desc:'Flip-free card matching: pair each term with its meaning.'},speed:{name:'Speed Round',icon:'⚡',desc:'15 seconds a question. Faster answers score more.'}};
const MG_ENDLESS={luxor:1,match:1,speed:1};
let mgState=null,mgLast=null;
function drawMinigame(){const el=$('mgArea');if(!el||mgState)return;const k=Object.keys(MG);
 el.innerHTML='<button class="mg-big" '+(MG.dungeon.soon?'disabled':'')+' onclick="mgSetup(\'dungeon\')"><span>'+MG.dungeon.icon+'</span><b>'+MG.dungeon.name+'</b><small>'+(db.run?'🎒 Run in progress · tap to continue':MG.dungeon.desc)+'</small>'+(MG.dungeon.soon?'<em>COMING NEXT</em>':'')+'</button><div class="mg-grid">'+k.slice(1).map(g=>'<button class="mg-tile" onclick="mgSetup(\''+g+'\')"><span>'+MG[g].icon+'</span><b>'+MG[g].name+'</b><small>'+MG[g].desc+'</small></button>').join('')+'</div><p class="small muted">Games use your summaries (key terms and AI quiz questions). Finishing a game earns 5 Cogs and EXP, plus Poképuffs (grade ÷ 10) and Rare Candy (grade ÷ 33).</p>'}
function mgSetup(game,presel,mode){if(game==='dungeon'){dungeonEntry();return}if(MG[game].soon)return;const sets=db.summaries.filter(s=>termsFor(s).length+(s.quiz?s.quiz.length:0)+prOf(s).length>0);
 if(!sets.length){modal(MG[game].name.toUpperCase(),'<div class="notice">No study sets yet. Add “Term: Definition” lines to a summary, or let ChatTalk / PokéPics make one.</div><div class="actions"><button class="btn blue" onclick="closeModal();go(\'summaries\')">OPEN SUMMARIES</button></div>');return}
 const isSel=id=>!presel||presel===id||Array.isArray(presel)&&presel.includes(id);
 const learned=db.learned||{},opt=(game==='luxor'?'<div class="field"><label>Question every <b id="mgFreqV">'+(db.lxFreq||5)+'</b> seconds</label><input type="range" id="mgFreq" min="5" max="60" step="5" value="'+(db.lxFreq||5)+'" oninput="$(\'mgFreqV\').textContent=this.value"></div>':'')+(MG_ENDLESS[game]?'<label class="mg-endless"><input type="checkbox" id="mgEndless" '+(mgLast&&mgLast.game===game&&mgLast.endless?'checked':'')+'> <b>♾ Endless Mode</b><small>Keeps going after the set is covered. Leave any time with ✕ to collect your rewards.</small></label>':'');
 modal(MG[game].name.toUpperCase(),'<p class="small">Study sets</p><div class="mg-sets">'+sets.map(s=>'<label><input type="checkbox" value="'+s.id+'" '+(isSel(s.id)?'checked':'')+'> <span>'+esc(s.title)+'<small>'+(termsFor(s).length+(s.quiz?s.quiz.length:0))+' items'+(prOf(s).length?' · 🧮 '+prOf(s).length+' practice type'+(prOf(s).length>1?'s':''):'')+(learned[s.id]?' · learned':'')+(mgBank([s.id]).filter(isWeak).length?' · '+mgBank([s.id]).filter(isWeak).length+' weak spots':'')+'</small></span></label>').join('')+'</div><p class="small" style="margin-top:12px">Study mode</p><div class="mg-modes"><label><input type="radio" name="mgm" value="smart" '+(mode&&mode!=='smart'?'':'checked')+'> <b>Smart Study</b><small>Covers the whole topic once, then brings back what you missed one more time.</small></label><label><input type="radio" name="mgm" value="learn" '+(mode==='learn'?'checked':'')+'> <b>Learn</b><small>Repeats each item until you get it right twice.</small></label><label><input type="radio" name="mgm" value="weak" '+(mode==='weak'?'checked':'')+'> <b>Review Weak Points</b><small>Only what you’ve missed. Unlocks after finishing Learn on a set.</small></label></div>'+opt+'<div class="actions"><button class="btn red" onclick="mgStart(\''+game+'\')">START</button></div>')}
function mgStart(game){const sids=[...document.querySelectorAll('.mg-sets input:checked')].map(x=>x.value),mode=(document.querySelector('input[name=mgm]:checked')||{}).value||'smart';if(!sids.length){toast('Pick at least one study set');return}
 if(mode==='weak'&&!sids.some(id=>(db.learned||{})[id])){toast('Finish Learn mode on one of these sets first');return}
 const opts={freq:+($('mgFreq')||{}).value||5};if(game==='luxor'){db.lxFreq=opts.freq;save()}
 if(mgLaunch(game,sids,mode,opts,!!($('mgEndless')||{}).checked))closeModal()}
function mgLaunch(game,sids,mode,opts,endless){const bank=mgBank(sids);const P=mgPicker(bank,mode);if(!P.bank.length){toast(mode==='weak'?'No weak spots here. Nice!':'These sets have no questions yet');return false}
 mgLast={game,sids,mode,opts,endless};mgState={game,bank,P,C:mgCourse(P,mode,endless),mode,opts,endless,startedAt:Date.now()};const el=$('mgArea');el.innerHTML='';window.scrollTo(0,0);({flash:flashStart,match:matchStart,speed:speedStart,luxor:luxorStart})[game](el);return true}
// What a game asks, and when it's over.
// Smart: every item once (unseen first), then each item you missed comes back one more time.
// Learn: until every item has been right twice. Weak: each weak spot once.
// Endless: after that, it keeps going with your weakest items weighted up until you leave.
function mgCourse(P,mode,endless){const C={asked:0,right:0,retry:[],retried:new Set(),back:[],queue:mode==='learn'?null:P.queue.splice(0)};
 C.done=()=>!C.back.length&&(mode==='learn'?!P.queue.length:!C.queue.length&&!C.retry.length);
 C.over=()=>!endless&&C.done();
 C.next=()=>{if(C.back.length)return C.back.shift();if(mode==='learn')return C.done()&&!endless?null:P.next();if(C.queue.length)return C.queue.shift();if(C.retry.length)return C.retry.shift();return endless?P.next():null};
 C.putBack=it=>C.back.unshift(it);
 C.report=(it,res)=>{C.asked++;if(res==='full')C.right++;if(mode==='learn')P.report(it,res);else if(mode==='smart'&&res!=='full'&&!C.retried.has(it.key)&&C.queue){C.retried.add(it.key);C.retry.push(it)}
  if(mode==='learn'&&!P.queue.length&&!P.done){P.done=true;[...new Set(P.bank.map(b=>b.sid))].forEach(sid=>{(db.learned||(db.learned={}))[sid]=true})}};
 C.left=()=>mode==='learn'?P.progress():C.done()?(endless?'♾':''):(C.queue.length+C.retry.length+C.back.length)+' left';
 C.grade=()=>C.asked?Math.round(C.right/C.asked*100):0;
 return C}
function mgQuit(){if(mgState&&mgState.stop)mgState.stop();mgState=null;drawMinigame()}
function mgExit(){const S=mgState;if(!S)return;if(S.endless&&S.finishNow){if(confirm('End Endless Mode and turn this game into rewards?'))S.finishNow();return}if(confirm('Leave this game? Progress in this round is lost.'))mgQuit()}
// Rewards: 5 Cogs (+ any game bonus), Poképuffs = grade ÷ 10 rounded down, Rare Candy = grade ÷ 33 rounded to nearest.
function mgFinish(lines,extraCogs){if(!mgState)return;const S=mgState,g=S.game;if(S.stop)S.stop();const mins=Math.max(1,Math.round((Date.now()-S.startedAt)/60000));mgState=null;
 const grade=S.C.grade(),cogs=5+Math.max(0,Math.round(extraCogs||0)),puffs=Math.floor(grade/10),candy=Math.round(grade/33);
 db.cogs=Math.round(db.cogs+cogs);db.puffs=(db.puffs||0)+puffs;db.candies=(db.candies||0)+candy;grantXp(15);save();render();
 const rw=['+'+cogs+' ⚙️ Cogs',puffs?'+'+puffs+' 🧁 Poképuffs':'',candy?'+'+candy+' 🍬 Rare Cand'+(candy>1?'ies':'y'):'','+15 EXP'].filter(Boolean);
 $('mgArea').innerHTML='<div class="reveal mg-end"><h2>🎉 '+esc(MG[g].name)+' complete</h2>'+lines.map(l=>'<p>'+l+'</p>').join('')+'<p class="mg-grade">Grade <b>'+grade+'%</b> <small>('+S.C.right+' / '+S.C.asked+' right first try)</small></p><p class="small muted">'+mins+' min of studying</p><div class="mg-rw">'+rw.map(x=>'<span>'+x+'</span>').join('')+'</div><div class="actions mg-again"><button class="btn" onclick="mgQuit()">MENU</button><button class="btn blue" onclick="mgAgain(false)">STUDY AGAIN</button><button class="btn red" onclick="mgAgain(true)">STUDY WEAK SPOTS</button></div></div>';toast(rw.slice(0,3).join(' · '))}
function mgAgain(weak){const L=mgLast;if(!L)return mgQuit();if(!weak){mgState=null;drawMinigame();mgSetup(L.game,L.sids,L.mode);return}
 if(!mgBank(L.sids).some(isWeak)){toast('No weak spots in these sets right now. Nice!');return}mgLaunch(L.game,L.sids,'weak',L.opts,false)}
function mgHead(extra){return '<div class="mg-head"><button class="btn smallbtn" onclick="mgExit()">'+(mgState.endless?'🏁':'✕')+'</button><b>'+esc(MG[mgState.game].name)+(mgState.endless?' ♾':'')+'</b><span id="mgInfo">'+(extra||'')+'</span></div>'}
// ---------- Flashcards ----------
function flashStart(el){const S=mgState;if(S.C.queue)S.P.queue=S.C.queue.splice(0);S.count=0;S.right=0;S.limit=S.mode==='learn'?999:Math.min(20,Math.max(8,S.P.bank.length));const nextCard=()=>{if(!mgState)return;
  if(S.mode==='learn'&&S.P.done||S.mode!=='learn'&&S.count>=S.limit){mgFinish([S.right+' / '+S.count+' marked “Got it”'+(S.mode==='learn'?' · set learned ✓':'')]);return}
  const it=S.P.next();if(!it){mgFinish(['No cards left']);return}S.cur=it;S.count++;
  el.innerHTML=mgHead(S.P.progress()||('Card '+S.count+' / '+S.limit))+'<div class="flash" onclick="this.classList.toggle(\'flip\')"><div class="flash-in"><div class="flash-face"><small>'+(it.kind!=='term'?'QUESTION':'TERM')+'</small><b>'+esc(it.front)+'</b><span class="small muted">Tap to flip</span></div><div class="flash-face back"><small>'+(it.kind!=='term'?'ANSWER':'MEANING')+'</small><b>'+esc(it.back)+'</b></div></div></div><div class="flash-btns"><button class="btn" id="fcNo">😵 Still learning</button><button class="btn blue" id="fcYes">✅ Got it</button></div>';
  $('fcNo').onclick=()=>{qRecord(it,false);S.P.report(it,'fail');S.C.asked++;nextCard()};$('fcYes').onclick=()=>{qRecord(it,true);S.right++;S.P.report(it,'full');S.C.asked++;S.C.right++;nextCard()}};
 nextCard()}
// ---------- Match-Up: 10 cards (5 pairs) on the table; clear them and 5 more pairs are dealt ----------
function matchStart(el){const S=mgState,C=S.C;S.pairs=0;S.misses=0;S.combo=0;S.best=0;S.bonus=0;S.lastMatch=0;S.t0=Date.now();S.boards=0;
 const timer=setInterval(()=>{const i=$('mgInfo');if(i&&mgState===S)i.textContent='⏱ '+Math.floor((Date.now()-S.t0)/1000)+'s · '+S.pairs+' pairs'+(C.left()?' · '+C.left():'');else clearInterval(timer)},500);S.stop=()=>clearInterval(timer);
 const summary=()=>['Matched '+S.pairs+' pairs in '+Math.round((Date.now()-S.t0)/1000)+' s','Misses: '+S.misses+' · best combo ×'+S.best+(S.bonus?' (+'+S.bonus+' bonus Cogs)':'')];
 S.finishNow=()=>mgFinish(summary(),S.bonus);
 const norm=t=>String(t).trim().toLowerCase();
 const deal=()=>{if(mgState!==S)return;const items=[],keys=new Set(),words=new Set(),skipped=[];
  for(let k=0;k<30&&items.length<5;k++){const it=C.next();if(!it)break;if(keys.has(it.key)||words.has(norm(it.front))||words.has(norm(it.back))){skipped.push(it);continue}keys.add(it.key);words.add(norm(it.front));words.add(norm(it.back));items.push(it)}
  skipped.reverse().forEach(it=>C.putBack(it));
  if(!items.length){mgFinish(summary(),S.bonus);return}S.boards++;
  const cards=shuffle(items.flatMap((it,i)=>[{i,t:it.front,s:'f'},{i,t:it.back,s:'b'}])),missed=new Set();let sel=null,left=items.length;
  el.innerHTML=mgHead('')+'<div class="mu-combo" id="muCombo"></div><div class="mu-grid">'+cards.map((c,k)=>'<button class="mu-card'+(c.s==='f'?' f':'')+'" data-k="'+k+'"><span>'+esc(c.t.length>120?c.t.slice(0,117)+'…':c.t)+'</span></button>').join('')+'</div><p class="small muted" style="text-align:center">Tap two cards that go together. Quick matches in a row earn bonus Cogs.</p>';
  const btns=[...el.querySelectorAll('.mu-card')];
  btns.forEach(b=>b.onclick=()=>{if(mgState!==S||b.classList.contains('done'))return;const k=+b.dataset.k;
   if(sel===null){sel=k;b.classList.add('sel');return}
   if(sel===k){sel=null;b.classList.remove('sel');return}
   const a=cards[sel],c=cards[k],A=btns[sel];sel=null;A.classList.remove('sel');
   if(a.i===c.i&&a.s!==c.s){const it=items[a.i],ok=!missed.has(a.i);qRecord(it,ok);C.report(it,ok?'full':'fail');S.pairs++;
    const now=Date.now();S.combo=now-S.lastMatch<3000?S.combo+1:1;S.lastMatch=now;S.best=Math.max(S.best,S.combo);
    if(S.combo>=2){S.bonus++;const cb=$('muCombo');if(cb){cb.textContent='⚡ Combo ×'+S.combo+' · +1 ⚙️';cb.classList.remove('pop');void cb.offsetWidth;cb.classList.add('pop')}}
    [A,b].forEach(x=>x.classList.add('done'));if(--left===0)setTimeout(()=>{if(C.over())mgFinish(summary(),S.bonus);else deal()},420)}
   else{S.misses++;S.combo=0;missed.add(a.i);missed.add(c.i);[A,b].forEach(x=>{x.classList.add('bad');setTimeout(()=>x.classList.remove('bad'),420)})}})};
 deal()}
// ---------- Speed Round: 15 s per question, 1000 points for an instant answer down to 1 at the buzzer ----------
function speedStart(el){const S=mgState,C=S.C,LIM=15000;S.score=0;S.right=0;S.n=0;S.streak=0;let tick=0;S.stop=()=>clearInterval(tick);
 const summary=()=>['Score: <b>'+S.score.toLocaleString()+'</b> pts','Correct: '+S.right+' / '+C.asked];
 S.finishNow=()=>mgFinish(summary(),Math.floor(S.score/1000));
 const next=()=>{if(mgState!==S)return;clearInterval(tick);if(C.over()){S.finishNow();return}const it=C.next();if(!it){S.finishNow();return}
  const q=mgQuestion(it,S.bank,Math.random()<.5?0:1),t0=performance.now();S.n++;let answered=false;
  el.innerHTML=mgHead('')+'<div class="speed"><div class="sp-top"><span class="sp-q">Q'+S.n+(C.left()?' · '+C.left():'')+'</span><span class="sp-score">'+S.score.toLocaleString()+' pts</span></div><div class="sp-bar"><i id="spBar"></i></div><div class="sp-time" id="spTime">15</div><h3>'+esc(q.prompt)+'</h3>'+q.options.map((o,i)=>'<button class="answer sp-a'+i%4+'" data-i="'+i+'">'+esc(o.t)+'</button>').join('')+'<div class="sp-pts" id="spPts"></div></div>';
  const done=(o,b)=>{if(answered||mgState!==S)return;answered=true;clearInterval(tick);const ms=performance.now()-t0,ok=!!(o&&o.ok);
   el.querySelectorAll('.answer').forEach(x=>{x.disabled=true;if(q.options[+x.dataset.i].ok)x.classList.add('correct')});qRecord(it,ok);C.report(it,ok?'full':'fail');
   const pts=ok?Math.max(1,Math.round(1000*(1-ms/LIM))):0;if(ok){S.right++;S.streak++;S.score+=pts}else{S.streak=0;if(b)b.classList.add('wrong')}
   const p=$('spPts');if(p){p.className='sp-pts '+(ok?'good':'bad');p.textContent=ok?'+'+pts+' pts':(o?'✗ Wrong':'⏰ Time’s up')}
   setTimeout(next,ok?900:1500)};
  el.querySelectorAll('.answer').forEach(b=>b.onclick=()=>done(q.options[+b.dataset.i],b));
  tick=setInterval(()=>{const left=Math.max(0,LIM-(performance.now()-t0)),bar=$('spBar'),tm=$('spTime');if(bar)bar.style.width=(left/LIM*100)+'%';if(tm)tm.textContent=Math.ceil(left/1000);if(left<=0)done(null,null)},100)};
 next()}
// ---------- Luxor (marble chain) ----------
const LX_COLORS=[['#ef7c3a','#ffc08a'],['#3f86e8','#9cc6ff'],['#5bbf45','#b2ec92'],['#f2cd2b','#fff1a0'],['#e2559a','#ffb3d6'],['#7b5fb3','#c5b2f0']];
function luxorStart(el){const S=mgState,C=S.C;el.innerHTML=mgHead('')+'<div class="lx-wrap"><canvas id="lxC"></canvas><div class="lx-hud"><span id="lxScore">0</span><span id="lxQ"></span></div></div><p class="small muted" style="text-align:center">Drag to aim, let go to fire. Match 3 of a type to break them. The game ends once every question in the set is answered.</p>';
 const cv=$('lxC'),W=Math.min(el.clientWidth||360,560),H=Math.round(Math.min(innerHeight*.66,W*1.45)),dpr=devicePixelRatio||1;cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+'px';cv.style.height=H+'px';const g=cv.getContext('2d');g.scale(dpr,dpr);
 const R=Math.max(9,Math.round(W/34)),D=R*2;
 // winding path from the top-left, back and forth down the screen, into a hole
 const pts=[],rows=Math.max(3,Math.floor((H-150)/(D*3.2))),gap=(H-170)/rows;let x=-D,y=46;pts.push([x,y]);
 for(let r=0;r<=rows;r++){const toRight=r%2===0,x2=toRight?W-12-gap*.46:12+gap*.46;const steps=40;for(let k=1;k<=steps;k++)pts.push([x+(x2-x)*k/steps,y]);x=x2;if(r===rows)break;const cx=x,cy=y+gap/2;for(let k=1;k<=20;k++){const a=-Math.PI/2+Math.PI*k/20;pts.push([cx+(toRight?1:-1)*Math.cos(a)*gap/2*.9+0,cy+Math.sin(a)*gap/2])}x=cx;y=y+gap}
 const hole=pts[pts.length-1];const cum=[0];for(let i=1;i<pts.length;i++)cum.push(cum[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));const L=cum[cum.length-1];
 const at=s=>{if(s<=0)return pts[0];if(s>=L)return hole;let lo=0,hi=cum.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(cum[m]<s)lo=m;else hi=m}const t=(s-cum[lo])/(cum[hi]-cum[lo]||1);return [pts[lo][0]+(pts[hi][0]-pts[lo][0])*t,pts[lo][1]+(pts[hi][1]-pts[lo][1])*t]};
 const ncol=S.P.bank.length>12?5:4,total=60+Math.min(40,S.P.bank.length*2);let chain=[],headS=0,spawned=0,lastC=0,speed=55,baseSpeed=22,mod=1,modUntil=0,score=0,combo=0,shot=null,over=false,paused=false,wave=1,clears=0,resets=0;
 const summary=()=>['Score: <b>'+score.toLocaleString()+'</b>','Chains cleared: '+clears+(resets?' · chains that got through: '+resets:'')];
 S.finishNow=()=>{if(over&&!S.endless)return;over=true;mgFinish(summary())};
 const newChain=()=>{chain=[];headS=0;spawned=0;wave++;baseSpeed=22+wave*1.5};
 const randC=()=>{if(Math.random()<.45&&spawned)return lastC;lastC=Math.floor(Math.random()*ncol);return lastC};
 const present=()=>{const s=new Set(chain.map(m=>m.c));return s.size?[...s]:[0]};let cur=randC(),nxt=randC(),toss=0;
 const sling=[W/2,H-82],bubble=[W/2,H-30];let aim=null;
 const mon=db.pokemon.find(p=>p.id===db.mainId),img=new Image();let an=null;loadAnims(mon?mon.species:'Magearna').then(a=>{an=a.Idle||a.Walk;if(an)img.src=an.url}).catch(()=>{});
 const drawMon=now=>{if(!an||!img.complete||!img.naturalWidth)return;const tot=an.d.reduce((x,y)=>x+y,0)||1;let t=Math.floor(now/1000*60)%tot,f=0;while(f<an.d.length-1&&t>=an.d[f]){t-=an.d[f];f++}const s=Math.min(2.4,64/an.h);g.save();g.imageSmoothingEnabled=false;g.fillStyle='#0006';g.beginPath();g.ellipse(bubble[0],bubble[1]+14,20,6,0,0,7);g.fill();g.drawImage(img,f*an.w,0,an.w,an.h,bubble[0]-an.w*s/2,bubble[1]+18-an.h*s*.82,an.w*s,an.h*s);g.restore()};
 const marble=(px,py,c,r=R)=>{const [a,b]=LX_COLORS[c];const gr=g.createRadialGradient(px-r*.35,py-r*.35,r*.15,px,py,r);gr.addColorStop(0,b);gr.addColorStop(1,a);g.fillStyle=gr;g.beginPath();g.arc(px,py,r,0,7);g.fill();g.strokeStyle='#0003';g.lineWidth=1;g.stroke();g.fillStyle='#fff9';g.beginPath();g.arc(px-r*.35,py-r*.4,r*.22,0,7);g.fill()};
 const findRun=i=>{let a=i,b=i;while(a>0&&chain[a-1].c===chain[i].c)a--;while(b<chain.length-1&&chain[b+1].c===chain[i].c)b++;return [a,b]};
 const resolve=i=>{combo=0;let k=i;while(k>=0&&k<chain.length){const [a,b]=findRun(k);if(b-a+1<3)break;combo++;score+=(b-a+1)*10*combo;chain.splice(a,b-a+1);if(a===0||a>=chain.length)break;k=a-1;if(chain[a-1].c!==chain[a].c)break}if(combo>1)popText('COMBO ×'+combo)};
 let pop=null;const popText=t=>{pop={t,until:performance.now()+900}};
 const qEvery=S.opts.freq*1000;let nextQ=performance.now()+qEvery,last=performance.now(),raf=0;
 const askNow=()=>{const it=C.next();if(!it){S.finishNow();return}paused=true;askQ(it,S.bank,{title:'LUXOR'+(C.left()?' · '+C.left():'')}).then(res=>{if(mgState!==S)return;C.report(it,res);if(C.over()){paused=false;S.finishNow();return}if(res==='full'){headS-=4*D;mod=.7;modUntil=performance.now()+15000;popText('PUSHED BACK!')}else if(res==='makeup'){headS-=2*D;mod=.88;modUntil=performance.now()+10000;popText('Pushed back')}else{mod=1.35;modUntil=performance.now()+10000;popText('SPEEDING UP')}nextQ=performance.now()+qEvery;last=performance.now();paused=false})};
 const frame=now=>{if(mgState!==S)return;raf=requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;
  if(!paused&&!over){
   const visible=chain.filter(m=>headS-chain.indexOf(m)*D>0).length;const sp=(spawned<14&&visible<14?speed:baseSpeed)*(now<modUntil?mod:1);headS+=sp*dt;baseSpeed+=dt*.06;
   while(spawned<total&&headS-chain.length*D>=0){chain.push({c:randC(),d:headS-chain.length*D});spawned++}
   chain.forEach((m,i)=>{const t=headS-i*D;m.d+=(t-m.d)*Math.min(1,dt*12)});
   if(chain.length&&headS>=L){resets++;score=Math.max(0,score-200);popText('CHAIN GOT THROUGH −200');newChain()}
   if(!chain.length&&spawned>=total){clears++;score+=500;popText('CHAIN CLEARED +500');newChain()}
   if(shot){shot.x+=shot.vx*dt;shot.y+=shot.vy*dt;if(shot.x<-D||shot.x>W+D||shot.y<-D)shot=null;else{for(let i=0;i<chain.length;i++){const s0=headS-i*D;if(s0<0)continue;const [mx,my]=at(chain[i].d);if(Math.hypot(mx-shot.x,my-shot.y)<D*.95){const [ax,ay]=at(chain[i].d+1);const ahead=(shot.x-mx)*(ax-mx)+(shot.y-my)*(ay-my)>0;const idx=ahead?i:i+1;chain.splice(idx,0,{c:shot.c,d:chain[i].d+(ahead?D:0)});headS+=D;shot=null;resolve(idx);break}}}}
   if(now>=nextQ&&!shot)askNow()}
  // draw
  g.clearRect(0,0,W,H);g.fillStyle='#16324a';g.fillRect(0,0,W,H);g.strokeStyle='#ffffff16';g.lineWidth=D+8;g.lineCap='round';g.lineJoin='round';g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke();
  g.fillStyle='#050d16';g.beginPath();g.arc(hole[0],hole[1],R*1.6,0,7);g.fill();g.strokeStyle='#e2559a88';g.lineWidth=3;g.stroke();
  chain.forEach(m=>{if(m.d>0){const [px,py]=at(m.d);marble(px,py,m.c)}});
  if(aim&&!shot&&!paused){g.strokeStyle='#ffffff55';g.setLineDash([4,6]);g.lineWidth=2;g.beginPath();g.moveTo(sling[0],sling[1]);g.lineTo(sling[0]+Math.cos(aim)*W,sling[1]+Math.sin(aim)*W);g.stroke();g.setLineDash([])}
  g.strokeStyle='#8b5a2b';g.lineWidth=6;g.beginPath();g.moveTo(sling[0]-22,sling[1]+26);g.lineTo(sling[0]-14,sling[1]);g.moveTo(sling[0]+22,sling[1]+26);g.lineTo(sling[0]+14,sling[1]);g.stroke();g.strokeStyle='#d9c08a';g.lineWidth=2;g.beginPath();g.moveTo(sling[0]-14,sling[1]);g.lineTo(sling[0],sling[1]+6);g.lineTo(sling[0]+14,sling[1]);g.stroke();
  if(toss>0){const k=1-toss;const tx=bubble[0]+18+(sling[0]-bubble[0]-18)*k,ty=bubble[1]-8+(sling[1]-bubble[1]+8)*k-Math.sin(k*Math.PI)*40;marble(tx,ty,cur);toss=Math.max(0,toss-dt*4)}else marble(sling[0],sling[1],cur);
  if(shot)marble(shot.x,shot.y,shot.c);
  drawMon(now);
  marble(bubble[0]+30,bubble[1]-6,nxt,R*.8);
  if(pop&&now<pop.until){g.fillStyle='#fff';g.font='900 '+Math.round(W/16)+'px -apple-system,sans-serif';g.textAlign='center';g.fillText(pop.t,W/2,H*.45)}
  $('lxScore').textContent=score+' pts';$('lxQ').textContent=paused?'Question!':'❓ in '+Math.max(0,Math.ceil((nextQ-now)/1000))+'s'+(C.left()?' · '+C.left():'');
 };
 raf=requestAnimationFrame(frame);
 const pt=e=>{const r=cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]},setAim=e=>{const [px,py]=pt(e);let a=Math.atan2(py-sling[1],px-sling[0]);if(a>-.12)a=a>Math.PI/2?-Math.PI+.12:-.12;aim=a};
 cv.addEventListener('pointerdown',e=>{if(paused||over)return;cv.setPointerCapture(e.pointerId);setAim(e)});cv.addEventListener('pointermove',e=>{if(aim!==null)setAim(e)});
 cv.addEventListener('pointerup',()=>{if(aim===null)return;if(!shot&&!paused&&!over&&toss===0){const v=Math.max(560,W*1.6);shot={x:sling[0],y:sling[1],vx:Math.cos(aim)*v,vy:Math.sin(aim)*v,c:cur};const pr=present();cur=pr.includes(nxt)?nxt:pr[Math.floor(Math.random()*pr.length)];nxt=pr[Math.floor(Math.random()*pr.length)];toss=1}aim=null});
 S.dbg=()=>({n:chain.length,score,spawned});document.body.classList.add('mg-on');S.stop=()=>{cancelAnimationFrame(raf);document.body.classList.remove('mg-on')}}
// Older entry point (PokéPics "Quiz" button): open Flashcards with that set.
function startQuiz(id){go('minigames');mgSetup('flash',id)}
