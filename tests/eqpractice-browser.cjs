const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});const p=await b.newPage({viewport:{width:390,height:844}});await p.emulateMedia({reducedMotion:'reduce'});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://127.0.0.1:8767/index.html');await p.waitForTimeout(1500);
const R=await p.evaluate(async()=>{const out=[],ok=(c,m)=>out.push((c?'PASS ':'FAIL ')+m);
 let bad=[];EQT.forEach(([eq,mk],i)=>{for(let k=0;k<60;k++){const q=mk(),g=EQ_G.find(x=>x.id===EQ[eq].g);
  if(typeof q.a==='number'&&!(isFinite(q.a)&&q.a>0))bad.push(i+' a='+q.a);if(!g.sym.includes(q.unk))bad.push(i+' unk '+q.unk);
  if(/NaN|undefined|Infinity/.test(q.q+JSON.stringify(q.giv)))bad.push(i+' text')}});
 ok(!bad.length,'all '+EQT.length+' problem templates roll valid numbers '+[...new Set(bad)].slice(0,4).join('; '));
 ok(Object.entries(EQPR).every(([id,es])=>PR[id]&&es.every(e=>EQ[e]&&EQT.some(t=>t[0]===e))),'every mapped practice type and equation exists');
 ok(Object.keys(EQ).every(k=>Object.values(EQPR).some(es=>es.includes(k))),'every equation is reachable from some practice type');
 let badP=[];Object.keys(EQPR).forEach(id=>{for(let k=0;k<25;k++){const q=eqPrMake(id);if(!q||!q.eqp||q.w.length!==3||new Set([q.a,...q.w]).size!==4||q.eqp.opts.length<2||!q.eqp.opts.includes(q.eqp.eq)||!EQPR[id].includes(q.eqp.eq)||q.steps.length!==3)badP.push(id)}});
 ok(!badP.length,'equation practice problems: 4 distinct answers, the right equation offered, 3 hint steps '+[...new Set(badP)].join(','));
 let withE=0;for(let k=0;k<60;k++){const q=prInstance('kinematics');if(q&&q.eqp)withE++}ok(withE>20&&withE<60,'Kinematics practice mixes equation-choice problems with the originals ('+withE+'/60)');
 ok(!prInstance('logs')||!prInstance('logs').eqp,'unmapped types (logs) are unchanged');
 ok(typeof MG==='undefined'||!MG.eqlab,'Equation Lab minigame removed');go('minigames');drawMinigame();ok(!$('mgArea').innerHTML.includes('Equation Lab'),'no Equation Lab tile on the Minigames menu');
 // mgQuestion carries the equation data through
 const it={kind:'gen',gid:'ohm',sid:'x',key:'x',front:'q',back:'1',wrong:['2','3','4']};let mq=null;for(let k=0;k<30&&!(mq&&mq.eqp);k++)mq=mgQuestion(it,[it],0);ok(mq&&mq.eqp&&mq.eqp.eq,'practice questions in minigames carry the equation walkthrough data');
 // Help me start walkthrough
 db.eqstats={};const q=eqPrMake('kinematics'),card=document.createElement('div');card.className='mgq-card';card.innerHTML='<div class="guided-final"><button class="answer">x</button></div>';document.body.appendChild(card);let rew=0;
 const st=guidedMount(card,q,{onGuided:()=>rew++});const pan=card.querySelector('.eq-guide');ok(!!pan&&pan.textContent.includes('Help me start'),'equation problems get the new Help me start');
 pan.querySelector('button').click();const fin=card.querySelector('.guided-final');ok(fin.hidden&&pan.querySelectorAll('.eq-chip').length===5,'step 1: answers hidden, quantity chips shown');
 pan.querySelector('.eq-h').click();ok(!!pan.querySelector('.eq-hint'),'step 1 hint');
 const g=EQ_G.find(x=>x.id==='kin'),want={};Object.keys(q.eqp.giv).forEach(k=>{if(g.sym.includes(k))want[k]=1});want[q.eqp.unk]=2;
 g.sym.forEach((s,i)=>{for(let n=0;n<(want[s]||0);n++)pan.querySelectorAll('.eq-chip')[i].click()});pan.querySelector('.eq-chk').click();ok(pan.querySelector('.eq-fb.ok'),'correct inventory is marked right');
 pan.querySelector('.eq-nx').click();const wrongK=q.eqp.opts.find(k=>k!==q.eqp.eq);ok(pan.querySelectorAll('.eq-opt').length===q.eqp.opts.length,'step 2: equation choices');
 pan.querySelector('.eq-opt[data-k="'+wrongK+'"]').click();ok(pan.querySelector('.eq-fb.bad')&&pan.textContent.includes(EQ[q.eqp.eq].when),'wrong equation explains when to use each');ok(db.eqstats[q.eqp.eq].w===1&&db.eqstats[q.eqp.eq].mix[wrongK]===1,'mix-up recorded');
 pan.querySelector('.eq-nx').click();ok(!fin.hidden&&st.complete&&rew===1&&pan.textContent.includes(EQ[q.eqp.eq].f),'step 3: answers shown, setup reward, equation reminder');
 pan.querySelector('.eq-re').click();ok(pan.querySelector('.eq-re-out').textContent.includes(q.eqp.re),'rearranged form on request');card.remove();
 // weak equations come up more
 db.eqstats={k3:{r:0,w:5,mix:{}}};let k3=0;for(let k=0;k<200;k++)if(eqPrMake('kinematics').eqp.eq==='k3')k3++;ok(k3>90,'weak equations come up more often ('+k3+'/200)');db.eqstats={};
 // old non-equation problems keep the old Help me start
 const c2=document.createElement('div');c2.className='mgq-card';c2.innerHTML='<div class="guided-final"></div>';document.body.appendChild(c2);guidedMount(c2,{steps:[['Do a thing','x']]},{});ok(!c2.querySelector('.eq-guide')&&c2.textContent.includes('Help me start'),'other problems keep the step-hint Help me start');c2.remove();

 // ---- Your equations (Gemini, mocked)
 ok(eqCalc('2^3*2')===16&&eqCalc('-2^2')===-4&&Math.abs(eqCalc('sind(30)')-.5)<1e-9&&Math.abs(eqCalc('sqrt(2*g*h)',{h:20})-19.799)<.01,'expression checker: powers, signs, degrees, g');let thr=0;try{eqCalc('2a',{a:1})}catch(e){thr=1}ok(thr,'expression checker rejects implicit multiplication');
 const FAKE={formulas:[{name:'Velocity–time',formula:'v = v₀ + at',when:'distance isn’t given or asked',group:'Kinematics',symbols:[{sym:'v'},{sym:'v₀'},{sym:'a'},{sym:'t'}]},{name:'Velocity–displacement',formula:'v² = v₀² + 2aΔx',when:'time isn’t given or asked',group:'Kinematics',symbols:[{sym:'v'},{sym:'v₀'},{sym:'a'},{sym:'Δx'}]},{name:'Weight',formula:'W = mg',when:'you need the force of gravity on a mass',group:'Forces',symbols:[{sym:'W'},{sym:'m'}]}],
  problems:[{formula:0,text:'A car moving at {v0} m/s speeds up at {a} m/s² for {t} s. How fast is it going then?',vars:[{key:'v0',sym:'v₀',unit:'m/s',min:5,max:20,decimals:0,example:10},{key:'a',sym:'a',unit:'m/s²',min:1,max:5,decimals:0,example:2},{key:'t',sym:'t',unit:'s',min:2,max:8,decimals:0,example:3}],unknownSym:'v',unknownUnit:'m/s',solve:'v0+a*t',mistakes:['a*t','v0*a*t','v0+0.5*a*t'],rearranged:'v = v₀ + at',steps:['Multiply {a} by {t} first.'],exampleAnswer:16},
   {formula:1,text:'A rock is dropped from rest and falls {h} m. How fast is it going when it lands?',vars:[{key:'h',sym:'Δx',unit:'m',min:5,max:40,decimals:0,example:20}],hidden:[{sym:'v₀',value:'0 m/s',phrase:'dropped from rest'},{sym:'a',value:'9.8 m/s²',phrase:'falling'}],unknownSym:'v',unknownUnit:'m/s',solve:'sqrt(2*9.8*h)',mistakes:['2*9.8*h','9.8*h','sqrt(9.8*h)'],rearranged:'v = √(2aΔx)',exampleAnswer:19.799},
   {formula:2,text:'A {m} kg box sits on a table. What is its weight?',vars:[{key:'m',sym:'m',unit:'kg',min:2,max:50,decimals:0,example:10}],unknownSym:'W',unknownUnit:'N',solve:'m*9.8',mistakes:['m','m/9.8','m*10*9.8'],rearranged:'W = mg',exampleAnswer:98},
   {formula:2,text:'A {m} kg crate. Weight?',vars:[{key:'m',sym:'m',unit:'kg',min:2,max:50,example:10}],unknownSym:'W',solve:'m*9.8',rearranged:'W = mg',exampleAnswer:999},
   {formula:0,text:'Speed after {t} s at {a} m/s²?',vars:[{key:'a',sym:'a',min:1,max:5,example:2},{key:'t',sym:'t',min:1,max:5,example:3}],unknownSym:'v',solve:'2a*t',rearranged:'v = at',exampleAnswer:6},
   {formula:0,text:'A car speeds up for {t} s. Speed?',vars:[{key:'a',sym:'a',min:1,max:5,example:2},{key:'t',sym:'t',min:1,max:5,example:3}],unknownSym:'v',solve:'a*t',rearranged:'v = at',exampleAnswer:6}]};
 db.summaries=db.summaries||[];db.summaries.push({id:'S1',title:'Kinematics HW',body:'v = v0 + at and weight'});const _k=gmKey,_g=gmGenerate;gmKey=()=>'test';gmGenerate=async()=>({json:FAKE,model:'gemini-test'});
 await eqUserBuild('S1');const S1=db.summaries.find(x=>x.id==='S1');ok(S1.eqbank&&S1.eqbank.formulas.length===3&&S1.eqbank.problems.length===3,'Gemini equations: wrong answer key, implicit multiplication and missing numbers are thrown out ('+(S1.eqbank&&S1.eqbank.problems.length)+' of 6 kept)');
 let ub=[];for(let k=0;k<60;k++){const q=prInstance('ueq:S1');if(!q||!q.eqp||new Set([q.a,...q.w]).size!==4||!q.eqp.opts.includes(q.eqp.eq)||!Object.keys(q.eqp.giv).every(x=>q.eqp.sym.includes(x))||!q.eqp.sym.includes(q.eqp.unk)||/\{\w+\}/.test(q.q))ub.push(q&&q.q)}ok(!ub.length,'your-equation problems: fresh numbers, 4 answers, right equation offered, chips cover the knowns '+ub.slice(0,2).join(' | '));
 {const seen=new Set();for(let k=0;k<80;k++)seen.add(prInstance('ueq:S1').eqp.eq);ok(seen.size===3,'problems mix all of the set’s equations')}
 {const q=prInstance('ueq:S1');let hits=0;for(let k=0;k<30;k++){const x=prInstance('ueq:S1');if(x.eqp.eq===q.eqp.eq&&x.q!==q.q)hits++}ok(hits>0,'same equation comes back with new numbers')}
 {let hid=null;for(let k=0;k<80&&!hid;k++){const x=prInstance('ueq:S1');if(x.eqp.giv['v₀']&&/from rest/.test(x.eqp.giv['v₀']))hid=x}ok(hid&&/means v₀ = 0/.test(hid.eqp.note),'hidden values (“dropped from rest”) count as givens and are explained')}
 const bank=mgBank(['S1']).filter(x=>x.gid==='ueq:S1');ok(bank.length===6,'games use 6 of your-equation problems for a 3-equation set');const uq=mgQuestion(bank[0],bank,0);ok(uq.eqp&&uq.sub.startsWith('Your equations'),'game questions carry the walkthrough');
 {const q=prInstance('ueq:S1'),card=document.createElement('div');card.innerHTML='<div class="guided-final"><button class="answer">x</button></div>';document.body.appendChild(card);db.eqstats={};const st=guidedMount(card,q,{}),pan=card.querySelector('.eq-guide');pan.querySelector('button').click();
  const want={};Object.keys(q.eqp.giv).forEach(k=>want[k]=1);want[q.eqp.unk]=2;const chips=[...pan.querySelectorAll('.eq-chip')];ok(chips.length===q.eqp.sym.length,'step 1 chips come from your equations');q.eqp.sym.forEach((x,i)=>{for(let n=0;n<(want[x]||0);n++)pan.querySelectorAll('.eq-chip')[i].click()});pan.querySelector('.eq-chk').click();ok(pan.querySelector('.eq-fb.ok'),'step 1 checks against the problem’s knowns');
  pan.querySelector('.eq-nx').click();pan.querySelector('.eq-opt[data-k="'+q.eqp.eq+'"]').click();ok(pan.querySelector('.eq-fb.ok')&&db.eqstats[q.eqp.eq].r===1,'step 2: your equation, right pick recorded');pan.querySelector('.eq-nx').click();ok(st.complete&&!card.querySelector('.guided-final').hidden,'step 3: answers shown');card.remove()}
 ok(sdItems(S1).some(r=>r.gid==='ueq:S1'&&r.name==='Your equations'),'Study Data / Weak Spots track your equations');
 summaryForm('S1');ok($('modalBody').innerHTML.includes('Your equations')&&$('modalBody').innerHTML.includes('W = mg')&&$('modalBody').innerHTML.includes('REDO'),'summary editor lists the equations with Redo and Try One');eqUserTry('S1');ok(!!document.querySelector('#eqUserSample .eq-card'),'Try One shows a sample');closeModal();
 gmGenerate=async()=>{throw new Error('offline')};await eqUserBuild('S1');ok(S1.eqErr==='offline'&&S1.eqbank.problems.length===3,'a failed redo keeps the old equations and shows the error');
 gmKey=_k;gmGenerate=_g;db.summaries=db.summaries.filter(x=>x.id!=='S1');
 return out.join('\n')});console.log(R);console.log('errs',errs.slice(0,6));await b.close()})();
