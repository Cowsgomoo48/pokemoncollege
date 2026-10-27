// ===================== EXPORT STUDY DATA =====================
// Builds a plain-text (Markdown) report of how each study set is going: right/wrong per item, first-try answers, hints,
// the wrong answers you picked, practice-problem mistakes and a day-by-day tally. Copy it or save it as a file, then paste it
// into a tutoring chat so the tutor can see what to work on.
function sdDate(t){return t?new Date(t).toLocaleDateString([],{month:'short',day:'numeric'}):'never'}
function sdPct(r,w){return r+w?Math.round(r/(r+w)*100)+'%':'–'}
function sdCell(t){return String(t==null?'':t).replace(/\s+/g,' ').replace(/\|/g,'/').trim()}
function sdCut(t,n){t=sdCell(t);return t.length>n?t.slice(0,n-1)+'…':t}
// one row per thing you study: each term, each quiz question, and each practice problem type (its 2 slots added together)
function sdItems(s){const Q=db.qstats||{},out=[],get=k=>Q[k]||null;
 termsFor(s).forEach(t=>out.push({kind:'Term',name:t.term,detail:t.definition,st:[get(s.id+'|t|'+t.term)]}));
 (s.quiz||[]).forEach(q=>out.push({kind:'Quiz',name:q.question,detail:q.answer,st:[get(s.id+'|q|'+q.question)]}));
 prOf(s).forEach(id=>out.push({kind:'Practice',name:PR[id].name,detail:PR[id].subject||'',gid:id,st:[get(s.id+'|g|'+id+'|0'),get(s.id+'|g|'+id+'|1')]}));
 return out.map(it=>{const S=it.st.filter(Boolean),sum=k=>S.reduce((a,x)=>a+(x[k]||0),0);
  return Object.assign(it,{r:sum('r'),w:sum('w'),ft:sum('ft'),mk:sum('mk'),h:sum('h'),g:sum('g'),miss:Math.max(0,...S.map(x=>x.miss||0)),last:Math.max(0,...S.map(x=>x.last||0)),wp:S.flatMap(x=>x.wp||[]).sort((a,b)=>b.at-a.at).slice(0,3),seen:S.length>0})})}
function sdSetHasData(s){return sdItems(s).some(it=>it.seen)}
function sdFolderOf(s){const k=sumKey(s);return k?sumKeyName(k):''}
function sdSheet(sids){const sets=db.summaries.filter(s=>sids.includes(s.id)),now=new Date();let all={r:0,w:0};const L=[],rows=[];
 for(const s of sets){const its=sdItems(s),r=its.reduce((a,x)=>a+x.r,0),w=its.reduce((a,x)=>a+x.w,0);all.r+=r;all.w+=w;rows.push({s,its,r,w})}
 L.push('# Study data from PokémonCollege','','Exported '+now.toLocaleString([],{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'})+' · '+sets.length+' study set'+(sets.length===1?'':'s')+' · '+(all.r+all.w)+' answers · '+sdPct(all.r,all.w)+' right overall','',
  '> For a tutor: these are my results from study games built from my class notes. "Right" and "Wrong" count every answer. "1st try" means right on the first attempt. "Guessed" means I got it right but said I was guessing. "Make-Up" means I missed it, then got a second version right. "Hints" counts answers where I opened hints first. Please look at what I keep missing and help me understand those topics, step by step.','');
 for(const {s,its,r,w} of rows){const seen=its.filter(x=>x.seen),unseen=its.filter(x=>!x.seen),last=Math.max(0,...its.map(x=>x.last)),folder=sdFolderOf(s),n=k=>its.filter(x=>x.kind===k).length;
  L.push('## '+sdCell(s.title)+(folder?' ('+sdCell(folder)+')':''),'');
  L.push('- Items: '+[n('Term')&&n('Term')+' term'+(n('Term')>1?'s':''),n('Quiz')&&n('Quiz')+' quiz question'+(n('Quiz')>1?'s':''),n('Practice')&&n('Practice')+' practice problem type'+(n('Practice')>1?'s':'')].filter(Boolean).join(', ')+'.');
  L.push('- Answered '+(r+w)+' times · '+sdPct(r,w)+' right · practiced '+seen.length+' of '+its.length+' items · last studied '+sdDate(last)+(db.learned&&db.learned[s.id]?' · finished Learn mode':'')+'.');
  const H=(db.qhist||{})[s.id]||{},days=Object.keys(H).sort().slice(-10);
  if(days.length)L.push('- Recent days: '+days.map(d=>{const [y,m,dd]=d.split('-').map(Number);return sdDate(new Date(y,m-1,dd))+' '+H[d][0]+'✓ '+H[d][1]+'✗'}).join(' · ')+'.');
  L.push('');
  if(!seen.length){L.push('Not practiced yet.','');continue}
  const weak=seen.filter(x=>x.w>0||x.g>0).sort((a,b)=>(b.w+b.g*.7-b.r*.5+b.miss)-(a.w+a.g*.7-a.r*.5+a.miss)||b.w-a.w).slice(0,15);
  if(weak.length){L.push('### Struggling with (most missed first)','','| Item | Type | Right | Wrong | 1st try | Guessed | Make-Up | Hints | Last missed |','|---|---|---|---|---|---|---|---|---|');
   weak.forEach(x=>L.push('| '+sdCut(x.name,70)+' | '+x.kind+' | '+x.r+' | '+x.w+' | '+x.ft+' | '+x.g+' | '+x.mk+' | '+x.h+' | '+sdDate(x.wp[0]&&x.wp[0].at||x.last)+' |'));L.push('');
   const mis=weak.filter(x=>x.wp.length);
   if(mis.length){L.push('### What I picked when I got it wrong','');
    mis.slice(0,10).forEach(x=>{L.push('- **'+sdCut(x.name,90)+'**'+(x.kind==='Term'?' (means: '+sdCut(x.detail,120)+')':x.kind==='Quiz'?' (answer: '+sdCut(x.detail,120)+')':''));
     x.wp.forEach(p=>L.push('  - '+(x.kind==='Term'&&sdCell(p.q)===sdCell(x.detail)?'Asked which term means “'+sdCut(p.q,120)+'” · ':x.kind==='Practice'||sdCell(p.q)!==sdCell(x.name)?'Question: '+sdCut(p.q,200)+' · ':'')+'I picked: '+sdCut(p.p,120)+(p.a?' · Correct: '+sdCut(p.a,120):'')))});L.push('')}}
  const good=seen.filter(x=>x.r>=2&&x.w===0||x.r>=4&&x.r>=x.w*4);
  if(good.length)L.push('### Doing well','',good.map(x=>sdCut(x.name,50)).join(' · '),'');
  if(unseen.length)L.push('### Not practiced yet','',unseen.map(x=>sdCut(x.name,50)).join(' · '),'')}
 return L.join('\n').replace(/\n{3,}/g,'\n\n').trim()+'\n'}
// ---------- the export window ----------
function sdOpen(only){const sets=db.summaries.filter(s=>termsFor(s).length+(s.quiz?s.quiz.length:0)+prOf(s).length>0);if(!sets.length){toast('No study sets yet');return}
 const on=s=>only?s.id===only:sdSetHasData(s);
 modal('📊 EXPORT STUDY DATA','<p class="small">A sheet of how each study set is going: what you get right, what you keep missing and which wrong answers you picked. Copy it into a chat with Claude or another tutor so they can see what to work on.</p><div class="mg-sets sd-sets">'+sets.map(s=>'<label><input type="checkbox" value="'+s.id+'" '+(on(s)?'checked':'')+' onchange="sdPreview()"> <span>'+esc(s.title)+'<small>'+(sdSetHasData(s)?'has results':'not practiced yet')+'</small></span></label>').join('')+'</div><textarea id="sdText" class="sd-text" readonly></textarea><div class="actions"><button class="btn" onclick="sdSaveFile()">💾 SAVE FILE</button><button class="btn red" onclick="sdCopy()">📋 COPY</button></div>');sdPreview()}
function sdChosen(){return [...document.querySelectorAll('.sd-sets input:checked')].map(x=>x.value)}
function sdPreview(){const t=$('sdText');if(!t)return;const ids=sdChosen();t.value=ids.length?sdSheet(ids):'Tick at least one study set.'}
async function sdCopy(){const t=$('sdText');if(!t||!sdChosen().length)return;const txt=t.value;
 try{await navigator.clipboard.writeText(txt);toast('📋 Study data copied. Paste it into your tutoring chat.');return}catch(e){}
 // older iOS web views: select the text and copy it the old way
 t.removeAttribute('readonly');t.focus();t.select();t.setSelectionRange(0,txt.length);let ok=false;try{ok=document.execCommand('copy')}catch(e){}t.setAttribute('readonly','');toast(ok?'📋 Study data copied':'Select the text and copy it')}
async function sdSaveFile(){const ids=sdChosen();if(!ids.length)return;const txt=sdSheet(ids),d=new Date(),pad=n=>String(n).padStart(2,'0'),nm='Study-data-'+localDay()+'-'+pad(d.getHours())+pad(d.getMinutes())+'.md',FS=fsPlugin();
 if(FS){try{await FS.writeFile({path:'Study Data/'+nm,data:txt,directory:'DOCUMENTS',encoding:'utf8',recursive:true});toast('💾 Saved to Files → PokémonCollege → Study Data');return}catch(e){toast('Couldn’t save: '+String(e&&e.message||e).slice(0,80));return}}
 const file=new File([txt],nm,{type:'text/markdown'});try{if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:'Study data'});return}}catch(e){if(e.name==='AbortError')return}
 const url=URL.createObjectURL(file),a=document.createElement('a');a.href=url;a.download=nm;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)}
