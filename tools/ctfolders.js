// ===================== ChatTalk: recording folders, multi-select, PokeSplicer =====================
let ctOpen=null,ctMs=null,ctDrag=null;const ctSplice={a:null,b:null,mode:'seamless',busy:false};
const ctFolders=()=>db.ctFolders||(db.ctFolders=[]);
const ctRec=id=>(db.recordings||[]).find(r=>r.id===id);
const ctIn=f=>(db.recordings||[]).filter(r=>(r.folder||null)===f);
function ctFolderNew(){const n=prompt('Folder name:','');if(n===null||!n.trim())return;ctFolders().push({id:uid(),name:n.trim().slice(0,40)});save();drawChat()}
function ctFolderRename(id){const f=ctFolders().find(x=>x.id===id);if(!f)return;const n=prompt('Rename folder:',f.name);if(n===null||!n.trim())return;f.name=n.trim().slice(0,40);save();drawChat()}
function ctFolderDelete(id){const f=ctFolders().find(x=>x.id===id);if(!f)return;const n=ctIn(id).length;if(!confirm('Delete the folder "'+f.name+'"?'+(n?' Its '+n+' recording'+(n===1?'':'s')+' will move back out, not be deleted.':'')))return;
 ctIn(id).forEach(r=>r.folder=null);db.ctFolders=ctFolders().filter(x=>x.id!==id);if(ctOpen===id)ctOpen=null;save();drawChat()}
function ctOpenFolder(id){if(ctMs&&ctDrag)return;ctOpen=id;drawChat()}
function ctMove(ids,f){let n=0;ids.forEach(id=>{const r=ctRec(id);if(r&&(r.folder||null)!==f){r.folder=f;n++}});if(!n)return;save();const fo=ctFolders().find(x=>x.id===f);toast('📁 '+n+' recording'+(n===1?'':'s')+' moved to '+(fo?fo.name:'All recordings'));if(ctMs)ctMs.clear();drawChat()}
function ctMoveMenu(){const ids=[...(ctMs||[])];if(!ids.length)return;
 modal('MOVE TO FOLDER','<div class="ct-movelist">'+(ctOpen?'<button class="btn" onclick="closeModal();ctMove(['+ids.map(i=>"'"+i+"'").join(',')+'],null)">⬅ All recordings (no folder)</button>':'')+ctFolders().filter(f=>f.id!==ctOpen).map(f=>'<button class="btn" onclick="closeModal();ctMove(['+ids.map(i=>"'"+i+"'").join(',')+'],\''+f.id+'\')">📁 '+esc(f.name)+'</button>').join('')+'<button class="btn blue" onclick="closeModal();ctFolderNew()">+ NEW FOLDER</button></div>')}
function ctMsStart(id){if(ctMs)return;ctMs=new Set(id?[id]:[]);drawChat();toast('Select recordings · drag one onto a folder to move them all')}
function ctMsExit(){ctMs=null;drawChat()}
function ctMsDelete(){const ids=[...(ctMs||[])];if(!ids.length)return;if(ids.some(id=>(ctRec(id)||{}).status==='recording')){toast('Stop the recording first');return}
 modal('DELETE RECORDINGS','<p class="small">Delete <b>'+ids.length+' recording'+(ids.length===1?'':'s')+'</b> and their audio? This cannot be undone.</p><div class="actions"><button class="btn" onclick="closeModal()">CANCEL</button><button class="btn red" onclick="ctMsDeleteDo()">DELETE</button></div>')}
async function ctMsDeleteDo(){const ids=[...(ctMs||[])];for(const id of ids){try{await ct('remove',{id})}catch(e){}}db.recordings=db.recordings.filter(r=>!ids.includes(r.id));ctMs=null;save();closeModal();drawChat();toast('🗑 '+ids.length+' deleted')}
// ---------- drawing ----------
(()=>{const dc=drawChat;drawChat=function(){const all=db.recordings||[];if(ctOpen&&!ctFolders().some(f=>f.id===ctOpen))ctOpen=null;const shown=all.filter(r=>(r.folder||null)===ctOpen);
 db.recordings=shown;try{dc.apply(this,arguments)}finally{db.recordings=all}
 $('ctCount').textContent=all.length+' RECORDING'+(all.length===1?'':'S');const L=$('ctList');if(!L)return;
 const items=[...L.querySelectorAll('.ct-item')];items.forEach((el,i)=>{const r=shown[i];if(!r)return;el.dataset.rid=r.id;const h=el.querySelector('h4');if(h&&r.status==='saved')h.insertAdjacentHTML('afterbegin','<i class="ct-grip" aria-label="Drag to a folder">⠿</i>');
  if(ctMs){const on=ctMs.has(r.id);el.classList.toggle('m-sel',on);el.insertAdjacentHTML('afterbegin','<i class="ms-chk'+(on?' on':'')+'">'+(on?'✓':'')+'</i>')}});
 L.classList.toggle('ms-on',!!ctMs);
 const fo=ctFolders().find(f=>f.id===ctOpen);
 const top='<div class="ct-tools"><button class="btn ct-splice-btn" onclick="ctSplicer()">🧬 POKESPLICER</button><button class="btn" onclick="ctFolderNew()">📁 NEW FOLDER</button>'+(all.length?'<button class="btn" onclick="ctMsStart()">☑ SELECT</button><button class="btn" onclick="ctExport()">💾 EXPORT</button>':'')+'</div>'
  +(fo?'<div class="ct-crumb"><button class="ct-folder ct-back" data-fid="" onclick="ctOpenFolder(null)">⬅ All recordings</button><b>📁 '+esc(fo.name)+'</b><button class="ct-fbtn" onclick="ctFolderRename(\''+fo.id+'\')" aria-label="Rename folder">✎</button><button class="ct-fbtn" onclick="ctFolderDelete(\''+fo.id+'\')" aria-label="Delete folder">🗑</button></div>'
   :(ctFolders().length?'<div class="ct-folders">'+ctFolders().map(f=>'<button class="ct-folder" data-fid="'+f.id+'" onclick="ctOpenFolder(\''+f.id+'\')"><span>📁</span><b>'+esc(f.name)+'</b><small>'+ctIn(f.id).length+'</small></button>').join('')+'</div>':''));
 L.insertAdjacentHTML('afterbegin',top);if(fo&&!shown.length)L.insertAdjacentHTML('beforeend','<div class="empty">This folder is empty.<br>Drag recordings here with ⠿, or use Select → Move.</div>');
 msBar('chat',ctMs?'<span>'+ctMs.size+' selected</span><button class="btn" onclick="ctMsExit()">EXIT</button><button class="btn blue" onclick="ctMoveMenu()"'+(ctMs.size?'':' disabled')+'>MOVE</button><button class="btn red" onclick="ctMsDelete()"'+(ctMs.size?'':' disabled')+'>DELETE</button>':'')}})();
// ---------- touch drag onto folders ----------
(()=>{const L=$('ctList');if(!L)return;
 msLongPress(L,e=>{const it=e.target.closest('.ct-item[data-rid]');if(it&&!e.target.closest('.ct-grip,button,audio,.ct-text'))ctMsStart(it.dataset.rid)});
 L.addEventListener('click',e=>{if(!ctMs)return;const it=e.target.closest('.ct-item[data-rid]');if(!it||e.target.closest('.ct-tools,.ct-crumb,audio'))return;e.stopPropagation();e.preventDefault();if(Date.now()-msLongAt<350)return;const id=it.dataset.rid;if(ctMs.has(id))ctMs.delete(id);else ctMs.add(id);drawChat()},true);
 L.addEventListener('pointerdown',e=>{const g=e.target.closest('.ct-grip');if(!g)return;e.preventDefault();const it=g.closest('.ct-item'),id=it.dataset.rid,ids=ctMs&&ctMs.has(id)?[...ctMs]:[id];
  const gh=document.createElement('div');gh.className='ct-ghost';gh.textContent='🎙 '+(ids.length>1?ids.length+' recordings':(ctRec(id)||{}).title||'');document.body.appendChild(gh);ctDrag={ids,gh,over:null};it.classList.add('ct-dragging');
  const mv=ev=>{gh.style.left=ev.clientX+'px';gh.style.top=ev.clientY+'px';const t=document.elementFromPoint(ev.clientX,ev.clientY),f=t&&t.closest('.ct-folder');document.querySelectorAll('.ct-folder.hot').forEach(x=>x.classList.remove('hot'));if(f)f.classList.add('hot');ctDrag.over=f?(f.dataset.fid||null):undefined};
  const up=()=>{document.removeEventListener('pointermove',mv);document.removeEventListener('pointerup',up);document.removeEventListener('pointercancel',up);gh.remove();it.classList.remove('ct-dragging');const d=ctDrag;ctDrag=null;if(d&&d.over!==undefined)ctMove(d.ids,d.over);else document.querySelectorAll('.ct-folder.hot').forEach(x=>x.classList.remove('hot'))};
  mv(e);document.addEventListener('pointermove',mv);document.addEventListener('pointerup',up);document.addEventListener('pointercancel',up)})})();
// ---------- PokeSplicer ----------
function ctSplicer(){const recs=(db.recordings||[]).filter(r=>r.status==='saved');if(recs.length<2){modal('POKESPLICER','<div class="notice">You need at least two saved recordings to splice.</div>');return}
 const slot=k=>{const r=ctRec(ctSplice[k]);return '<button class="sp-slot'+(r?' on':'')+'" onclick="ctSplicePick(\''+k+'\')"><small>'+(k==='a'?'STRAND A · FIRST':'STRAND B · SECOND')+'</small>'+(r?'<b>'+esc(r.title)+'</b><i>'+ctClock(r.seconds)+(r.transcript?' · transcript ✓':' · no transcript')+'</i>':'<b class="sp-empty">+ choose a recording</b>')+'</button>'};
 const A=ctRec(ctSplice.a),B=ctRec(ctSplice.b),ready=A&&B&&!ctSplice.busy;
 modal('🧬 POKESPLICER','<div class="sp-mon"><div class="sp-scan"></div><div class="sp-helix'+(ctSplice.busy?' fast':'')+'">'+Array.from({length:14},(_,i)=>'<i style="--i:'+i+'"></i>').join('')+'</div><div class="sp-readout">'+(ctSplice.busy?'SPLICING SEQUENCE…':ready?'SEQUENCE READY · '+ctClock((A.seconds||0)+(B.seconds||0)):'AWAITING DNA SAMPLES')+'</div></div>'
  +'<div class="sp-slots">'+slot('a')+'<span class="sp-plus">＋</span>'+slot('b')+'</div>'
  +'<div class="sp-modes"><label><input type="radio" name="spm" '+(ctSplice.mode==='seamless'?'checked':'')+' onchange="ctSplice.mode=\'seamless\'"> <b>Seamless</b><small>B plays right after A</small></label><label><input type="radio" name="spm" '+(ctSplice.mode==='fade'?'checked':'')+' onchange="ctSplice.mode=\'fade\'"> <b>Fade</b><small>A fades out at its end, B fades in</small></label></div>'
  +(A&&B&&(!A.transcript||!B.transcript)?'<p class="small muted">Both need transcripts to combine them. Otherwise you can transcribe the spliced recording afterwards.</p>':'')
  +'<div class="actions"><button class="btn" onclick="closeModal()">CLOSE</button><button class="btn red" '+(ready?'':'disabled')+' onclick="ctSpliceGo()">🧬 SPLICE</button></div>')}
function ctSplicePick(k){const other=ctSplice[k==='a'?'b':'a'],recs=(db.recordings||[]).filter(r=>r.status==='saved'&&r.id!==other);
 modal(k==='a'?'STRAND A (PLAYS FIRST)':'STRAND B (PLAYS SECOND)','<div class="sp-pick">'+recs.map(r=>'<button class="ct-item sp-pickrow" onclick="ctSplice.'+k+'=\''+r.id+'\';ctSplicer()"><b>🎙 '+esc(r.title)+'</b><small>'+ctClock(r.seconds)+(r.folder?' · 📁 '+esc((ctFolders().find(f=>f.id===r.folder)||{}).name||''):'')+(r.transcript?' · transcript ✓':'')+'</small></button>').join('')+'</div><div class="actions"><button class="btn" onclick="ctSplicer()">BACK</button></div>')}
async function ctSpliceGo(){const A=ctRec(ctSplice.a),B=ctRec(ctSplice.b);if(!A||!B||ctSplice.busy)return;ctSplice.busy=true;ctSplicer();const id=uid();
 try{const res=await ct('splice',{a:A.id,b:B.id,id,mode:ctSplice.mode});db.recordings=db.recordings||[];
  db.recordings.unshift({id,title:(A.title+' + '+B.title).slice(0,80),createdAt:stamp(),seconds:res.seconds||((A.seconds||0)+(B.seconds||0)),status:'saved',path:res.path,webPath:res.webPath,folder:ctOpen,spliced:[A.id,B.id],spliceMode:ctSplice.mode,
   transcript:A.transcript&&B.transcript?A.transcript.trim()+'\n\n'+B.transcript.trim():undefined});
  ctSplice.a=ctSplice.b=null;save();closeModal();drawChat();toast('🧬 Spliced into one recording ✓')}
 catch(e){toast(e.message||String(e));ctSplicer()}finally{ctSplice.busy=false;if($('modalBody')&&/SPLICING/.test($('modalBody').textContent))ctSplicer()}}
// ---------- Export: Documents/ChatTalk Exports, titled files grouped by folder (see Apple Devices > Files) ----------
async function ctExport(){const recs=(db.recordings||[]).filter(r=>r.status==='saved');if(!recs.length){toast('No saved recordings to export');return}
 const fn=id=>(ctFolders().find(f=>f.id===id)||{}).name||'';
 try{const res=await ct('export',{items:recs.map(r=>({id:r.id,name:r.title,folder:r.folder?fn(r.folder):''}))});toast('💾 '+res.count+' recording'+(res.count===1?'':'s')+' exported to “ChatTalk Exports”')}catch(e){toast(e.message||String(e))}}
