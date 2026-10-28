// ===================== STUDY PLUS: typed answers, Do It Yourself, confidence, mistake recap =====================
// ---------- checking a typed answer ----------
// Lenient on purpose: spacing and capitals don't matter, "4" counts for "x = 4", units can be left off, a number that's
// within 1% counts (answers are rounded), equivalent algebra counts ("2(x+1)" = "2x+2"), and a small typo in a word is fine.
const SA_SUP={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-'};
function saNorm(s){return String(s==null?'':s).toLowerCase().replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g,m=>'^'+[...m].map(c=>SA_SUP[c]).join('')).replace(/[−–—]/g,'-').replace(/[×·]/g,'*').replace(/÷/g,'/').replace(/[“”"'’]/g,'').replace(/\s+/g,'').replace(/\^\{([^}]*)\}/g,'^($1)').replace(/,(?=\d{3}(\D|$))/g,'')}
function saNum(s){const v=calcEval(String(s).replace(/\*/g,'×').replace(/\//g,'÷'));return v==null||!isFinite(v)?null:v}
function saClose(a,b){return Math.abs(a-b)<=Math.max(1e-9,.01*Math.abs(b))}
// split "40ω" into a number part and a unit part
function saSplit(n){const m=n.match(/^[-+*/^().0-9π]+(e[-+]?\d+)?/);return m?[m[0],n.slice(m[0].length)]:['',n]}
function saExprEq(a,b){if(!/x/.test(a)||!/x/.test(b))return false;for(const x of [1.37,-0.71,2.13]){const sub=t=>t.replace(/x/g,'('+x+')'),va=saNum(sub(a)),vb=saNum(sub(b));if(va==null||vb==null||!saClose(va,vb))return false}return true}
function saLev(a,b){const d=Array.from({length:a.length+1},(_,i)=>[i]);for(let j=1;j<=b.length;j++)d[0][j]=j;for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[a.length][b.length]}
function saMatch(user,ans){let u=saNorm(user),a=saNorm(ans);if(!u)return false;if(u===a)return true;
 const strip=t=>t.replace(/^[a-z]=/,'');if(/^[a-z]=/.test(a)&&strip(u)===strip(a))return true;u=strip(u);a=strip(a);
 // tuples like (5, 5)
 const tu=t=>{const m=t.match(/^\((.*)\)$/);return m&&m[1].includes(',')?m[1].split(','):null},tu1=tu(u),tu2=tu(a);
 if(tu1&&tu2)return tu1.length===tu2.length&&tu1.every((x,i)=>{const p=saNum(x),q=saNum(tu2[i]);return p!=null&&q!=null?saClose(p,q):x===tu2[i]});
 // numbers, with or without the unit
 const [an,au]=saSplit(a),[un,uu]=saSplit(u);
 const unitLike=t=>/^([a-zωμ°%/]|\^-?\d)*$/.test(t)&&!/x|or|and/.test(t);
 if(an&&un&&(uu===au||(uu===''&&unitLike(au))||(unitLike(uu)&&unitLike(au)&&saLev(uu,au)<=1))){const p=saNum(un),q=saNum(an);if(p!=null&&q!=null&&saClose(p,q))return true}
 if(saExprEq(u,a))return true;
 // words: allow a small typo
 if(!/\d/.test(a)&&a.length>=4)return saLev(u,a)<=Math.max(1,Math.floor(a.length/6));return false}
// which questions can be typed: practice problems, terms (type the term), and quiz questions with a short answer
function saPlan(item){if(item.kind==='gen'){const p=prInstance(item.gid)||{q:item.front,a:item.back,steps:item.steps,ex:item.explain};const cmd=!!(PR[item.gid]&&PR[item.gid].cmd);if(cmd&&!/`/.test(p.a))return null;return {prompt:p.q,answer:p.a,sub:(PR[item.gid]?PR[item.gid].name+' · ':'')+(cmd?'type the command.':'type your answer.'),steps:p.steps||[],explain:p.ex,math:!cmd,cmd,alts:p.alts||[]}}
 if(item.kind==='term'&&String(item.front).length<=32)return {prompt:item.back,answer:item.front,sub:'Type the term that matches this definition.',steps:[],explain:'“'+item.front+'” means: '+item.back};
 if(item.kind==='mc'&&String(item.back).length<=24&&String(item.back).split(/\s+/).length<=3)return {prompt:item.front,answer:item.back,sub:'Type your answer.',steps:[],explain:'The answer is “'+item.back+'”.'};return null}
const SA_KEYS=['x','²','^','√','π','×','÷','−','/','(',')','=','.'];
const SA_CMD_KEYS=['"','*','.','/','|','-','^','$','~','>','{}','\\;'];
function saKeysHTML(cmd){return '<div class="sa-keys">'+(cmd?SA_CMD_KEYS:SA_KEYS).map(k=>'<button type="button" data-k="'+k+'">'+k+'</button>').join('')+'</div>'}
function saInsert(inp,t){if(!inp)return;const a=inp.selectionStart??inp.value.length,b=inp.selectionEnd??a;inp.value=inp.value.slice(0,a)+t+inp.value.slice(b);inp.focus();const c=a+t.length;try{inp.setSelectionRange(c,c)}catch(e){}}
// the calculator's current expression and result, ready to drop into a line
function saCalcText(root){const ex=(root.querySelector('.calc-exp')||{}).value||'',rs=((root.querySelector('.calc-res')||{}).textContent||'').replace(/^=\s*/,'');return ex?(rs&&rs!==ex?ex+' = '+rs:ex):rs}

// ---------- confidence tap ----------
function qGuessed(item){const s=qstat(item.key);s.g=(s.g||0)+1;s.miss=Math.max(s.miss||0,2);save()}

// ---------- mistake recap ----------
function recapAdd(item,miss){const r=typeof runOf==='function'&&runOf();if(!r||!miss)return;const L=r.recap||(r.recap=[]);const i=L.findIndex(x=>x.k===item.key);if(i>=0)L.splice(i,1);
 L.push({k:item.key,prompt:String(miss.prompt||'').slice(0,300),pick:String(miss.pick==null?'':miss.pick).slice(0,160),answer:String(miss.answer||'').slice(0,200),why:String(miss.why||'').slice(0,240)});if(L.length>30)L.shift()}
function recapHTML(L){if(!L||!L.length)return '';return '<div class="recap"><h3>📋 What you missed this run</h3><p class="small muted">A quick look now helps it stick for next time.</p>'+L.slice().reverse().slice(0,15).map(x=>'<div class="recap-i"><div class="recap-q">'+mathHTML(x.prompt)+'</div>'+(x.pick?'<div class="recap-no">✗ '+mathHTML(x.pick)+'</div>':'')+'<div class="recap-ok">✓ '+mathHTML(x.answer)+'</div>'+(x.why?'<div class="recap-why">'+mathHTML(x.why)+'</div>':'')+'</div>').join('')+'</div>'}
function recapShow(){const r=runOf();modal('📋 MISTAKES THIS RUN',(r&&r.recap&&r.recap.length)?recapHTML(r.recap):'<p>No mistakes yet this run. Nice.</p>')}

// ---------- Do It Yourself ----------
// Work a practice problem out line by line, like on paper. Each line's arithmetic is checked, the last line has to land on
// the answer, and the worked solution is shown next to yours. With a Gemini key, the AI tutor can point at the first slip.
function diyLineCheck(line,ansX){const n=saNorm(line);if(!n)return null;const segs=n.split(/=|≈/).map(t=>t.replace(/[a-wyzα-ορ-ωµ°%]+(\/[a-z]+)?(\^-?\d+)?/g,m=>/^(sin|cos|tan|asin|acos|atan|ln|log|e)$/.test(m)?m:''));
 if(segs.length<2)return {mark:'•'};
 for(let i=0;i<segs.length-1;i++){const a=segs[i],b=segs[i+1];if(!a||!b)continue;
  if(/x/.test(a)||/x/.test(b)){if(ansX!=null){const sub=t=>t.replace(/x/g,'('+ansX+')'),va=saNum(sub(a)),vb=saNum(sub(b));if(va!=null&&vb!=null&&!saClose(va,vb))return {mark:'✗',msg:'With the real answer x = '+calcFmt(ansX)+', the two sides don’t match.'};continue}
   if(/x/.test(a)&&/x/.test(b)&&!saExprEq(a,b)){const va=saNum(a.replace(/x/g,'(1.37)')),vb=saNum(b.replace(/x/g,'(1.37)'));if(va!=null&&vb!=null)return {mark:'✗',msg:'These two expressions aren’t equal.'}}continue}
  const va=saNum(a),vb=saNum(b);if(va!=null&&vb!=null&&!saClose(va,vb))return {mark:'✗',msg:'Left side is '+calcFmt(va)+', but the right side is '+calcFmt(vb)+'.'}}
 return {mark:'✓'}}
function askDIY(item,opts={}){return new Promise(res=>{const p=prInstance(item.gid)||{q:item.front,a:item.back,steps:item.steps||[],ex:item.explain},ov=document.createElement('div');ov.className='mgq';document.body.appendChild(ov);if(typeof __qMissReset==='function')__qMissReset();
 const ansX=(()=>{const m=saNorm(p.a).match(/^x=(.+)$/);return m?saNum(m[1]):null})(),t0=performance.now();let active=null,hi=0;
 ov.innerHTML='<div class="mgq-card diy"><span class="badge diy-b">🛠 DO IT YOURSELF</span>'+(opts.title?' <span class="badge">'+esc(opts.title)+'</span>':'')+'<h3>'+mathHTML(p.q)+'</h3><p class="small muted">Work it out one line at a time, like on paper. The calculator’s “↳ Add” button drops its result into your line. Your last line should end with the answer.</p>'
  +'<div class="diy-lines"></div><div class="diy-row"><button type="button" class="btn smallbtn diy-add">＋ LINE</button>'+(p.steps&&p.steps.length?'<button type="button" class="btn smallbtn diy-hint">💡 Hint</button>':'')+'</div><div class="mgq-hints"></div>'+saKeysHTML()+calcHTML()+'<button class="btn red diy-go">CHECK MY WORK</button></div>';
 calcInit(ov);const calc=ov.querySelector('.calc');calc.open=true;calc.querySelector('.calc-in').insertAdjacentHTML('beforeend','<button type="button" class="btn smallbtn blue diy-put">↳ Add to my line</button>');
 const box=ov.querySelector('.diy-lines'),addLine=(v='')=>{const n=box.children.length+1;box.insertAdjacentHTML('beforeend','<div class="diy-line"><span>'+n+'</span><input class="diy-in" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="'+(n===1?'e.g. 6x = 30':'next step…')+'"></div>');const inp=box.lastElementChild.querySelector('input');inp.onfocus=()=>active=inp;inp.value=v;active=inp;return inp};
 addLine();addLine();
 ov.querySelector('.diy-add').onclick=()=>addLine().focus();
 ov.querySelectorAll('.sa-keys button').forEach(b=>b.onclick=e=>{e.preventDefault();saInsert(active||box.querySelector('input'),b.dataset.k)});
 ov.querySelector('.diy-put').onclick=e=>{e.preventDefault();const t=saCalcText(ov);if(!t)return;const inp=active||box.querySelector('input');saInsert(inp,(inp.value&&!/[=\s]$/.test(inp.value)?' ':'')+t)};
 const hb=ov.querySelector('.diy-hint');if(hb)hb.onclick=()=>{if(hi>=p.steps.length)return;ov.querySelector('.mgq-hints').insertAdjacentHTML('beforeend','<div class="mgq-step"><b>Step '+(hi+1)+'.</b> '+mathHTML(p.steps[hi][0])+'</div>');hi++;if(hi>=p.steps.length)hb.remove()};
 ov.querySelector('.diy-go').onclick=()=>{const lines=[...box.querySelectorAll('input')].map(i=>i.value.trim()).filter(Boolean);if(!lines.length){toast('Write at least one line');return}
  const checks=lines.map(l=>diyLineCheck(l,ansX)),last=lines[lines.length-1],lastSeg=last.split(/=|≈/).pop(),ok=saMatch(lastSeg,p.a)||saMatch(last,p.a);
  if(typeof apNote==='function')apNote({ms:performance.now()-t0,ok,chars:400,hinted:true});
  qRecord(item,ok,ok?{first:true,hints:hi}:{pick:last,prompt:p.q,answer:p.a,hints:hi});
  if(!ok&&typeof __qMissSet==='function')__qMissSet({prompt:p.q,pick:last,answer:p.a,why:(p.steps&&p.steps.length?p.steps[p.steps.length-1][1]||p.steps[p.steps.length-1][0]:p.ex)});
  const card=ov.querySelector('.mgq-card');
  card.innerHTML='<span class="badge diy-b">🛠 DO IT YOURSELF</span><h3>'+mathHTML(p.q)+'</h3><div class="notice '+(ok?'diy-ok':'diy-no')+'">'+(ok?'✅ Your answer is right!':'❌ Your last line doesn’t reach the answer.')+' The answer is <b>'+mathHTML(p.a)+'</b>.</div>'
   +'<div class="diy-cols"><div><b>Your work</b><ol class="diy-mine">'+lines.map((l,i)=>{const c=checks[i]||{mark:'•'};return '<li class="m'+(c.mark==='✗'?'x':c.mark==='✓'?'k':'n')+'"><span class="mk">'+c.mark+'</span> '+mathHTML(l)+(c.msg?'<small>'+esc(c.msg)+'</small>':'')+'</li>'}).join('')+'</ol></div>'
   +(p.steps&&p.steps.length?'<div><b>Worked solution</b><ol class="diy-ref">'+p.steps.map(x=>'<li>'+mathHTML(x[0])+(x[1]?'<span class="mgq-work">'+mathHTML(x[1])+'</span>':'')+'</li>').join('')+'</ol></div>':'')+'</div>'
   +'<p class="small muted">✓ the maths on that line checks out · ✗ something doesn’t add up · • couldn’t be checked automatically (words or a step with x).</p>'
   +(gmKey()?'<button class="btn smallbtn blue diy-ai">💭 Ask the tutor where I went wrong</button><div class="diy-aiout small"></div>':'')
   +'<button class="btn '+(ok?'red':'blue')+' mgq-go">CONTINUE</button>';
  const ab=card.querySelector('.diy-ai');if(ab)ab.onclick=async()=>{ab.disabled=true;ab.textContent='💭 Reading your work…';const out=card.querySelector('.diy-aiout');
   try{const r=await gmGenerate([{text:'A college student solved this problem line by line.\nProblem: '+p.q+'\nCorrect answer: '+p.a+'\nTheir lines:\n'+lines.map((l,i)=>(i+1)+'. '+l).join('\n')+'\n\nAs a kind, concise tutor: say whether their method works, point to the first line with a mistake (if any) and explain the slip in one or two sentences, then give one tip for writing solution steps more clearly. Plain text with Unicode math, no LaTeX.'}],{type:'OBJECT',properties:{feedback:{type:'STRING'}},required:['feedback']});out.innerHTML=mathHTML(mathPlain(String(r.json.feedback||'')));ab.remove()}
   catch(e){ab.disabled=false;ab.textContent='💭 Ask the tutor where I went wrong';out.textContent='The tutor couldn’t answer right now.'}};
  card.querySelector('.mgq-go').onclick=()=>{ov.remove();res(ok?'full':'fail')}}})}
