// ===================== MASS SELECT: long-press the Box (release) or Summaries (delete) =====================
let bxMass=null,sumMass=null,msLongAt=0,msFired=false;
function msLongPress(el,start){let t=0,x0=0,y0=0;const off=()=>{clearTimeout(t);t=0};
 el.addEventListener('pointerdown',e=>{x0=e.clientX;y0=e.clientY;off();t=setTimeout(()=>{t=0;msFired=true;msLongAt=Date.now();start(e)},550)});
 el.addEventListener('pointerup',()=>{if(msFired){msFired=false;msLongAt=Date.now()}});
 el.addEventListener('pointermove',e=>{if(t&&Math.hypot(e.clientX-x0,e.clientY-y0)>10)off()});['pointerup','pointercancel','pointerleave'].forEach(k=>el.addEventListener(k,off));
 el.addEventListener('contextmenu',e=>e.preventDefault())}
const msIdOf=el=>{const m=(el.getAttribute('onclick')||'').match(/viewMon\('([^']+)'/);return m&&m[1]};
const msFond=p=>!!(p.nickname||'').trim()||db.mainId===p.id||mainSeconds(p)>=5*3600;
const msReward=p=>monReleaseValue(p);
function msBar(sec,html){let b=document.querySelector('#'+sec+' .ms-bar');if(!html){if(b)b.remove();return}if(!b){b=document.createElement('div');b.className='ms-bar';$(sec).appendChild(b)}b.innerHTML=html}
// ---------- Box: Mass Release ----------
function bxMassDecorate(){const g=$('boxGrid');if(!g)return;g.classList.toggle('ms-on',!!bxMass);
 if(!bxMass){msBar('collection','');return}
 g.querySelectorAll('.bx-slot[onclick]').forEach((b,i)=>{const id=msIdOf(b),p=db.pokemon.find(x=>x.id===id);if(!p)return;const on=bxMass.has(id);b.classList.toggle('m-sel',on);
  const orb=b.querySelector('.bx-orb');orb.style.animationDelay=-(i*.13)+'s';orb.insertAdjacentHTML('beforeend','<i class="ms-chk'+(on?' on':'')+'">'+(on?'✓':'')+'</i>'+(msFond(p)?'<i class="ms-sweat" style="animation-delay:'+(1+Math.random()*4).toFixed(2)+'s">💧</i>':''))});
 msBar('collection','<span>'+bxMass.size+' selected</span><button class="btn" onclick="bxMassExit()">EXIT</button><button class="btn red" onclick="bxMassConfirm()"'+(bxMass.size?'':' disabled')+'>CONFIRM</button>')}
function bxMassStart(){if(bxMass)return;bxMass=new Set();if(typeof closeMon==='function'&&monSheetOpen)closeMon();drawCollection();toast('Mass Release: tap Pokémon to select them')}
function bxMassExit(){bxMass=null;drawCollection()}
function bxMassToggle(id){if(bxMass.has(id))bxMass.delete(id);else{if(runLock(id,'release it'))return;bxMass.add(id)}drawCollection()}
function bxMassConfirm(){const ps=db.pokemon.filter(p=>bxMass&&bxMass.has(p.id));if(!ps.length)return;const t=ps.reduce((a,p)=>{const r=msReward(p);a.cogs+=r.cogs;a.puffs+=r.puffs;return a},{cogs:0,puffs:0});
 modal('MASS RELEASE','<div class="ms-grid">'+ps.map(p=>'<div class="ms-cell r'+Math.max(0,RARITIES.indexOf(p.rarity))+'">'+monSprite(p,'',48)+'<small>'+(p.hatched?'🥚 ':'')+esc(p.nickname||p.species)+'</small><i>Lv '+monLv(p)+'</i></div>').join('')+'</div>'
  +'<p class="ms-count"><b>'+ps.length+' Pokémon selected.</b></p><p class="small">Releasing them earns <b>'+money(t.cogs)+' Cogs</b> and <b>'+money(t.puffs)+' Poképuffs</b>. This cannot be undone.</p>'
  +'<div class="actions"><button class="btn" onclick="closeModal()">CANCEL</button><button class="btn red" onclick="bxMassRelease()">RELEASE ALL</button></div>');fillMonSprites&&fillMonSprites($('modal')||document)}
function bxMassRelease(){if(!bxMass)return;let n=0,cogs=0,puffs=0;for(const id of [...bxMass]){const p=db.pokemon.find(x=>x.id===id);if(!p||inRun(id)||(typeof nurBusy==='function'&&nurBusy(id)))continue;const r=msReward(p);
  if(db.mainId===id){p.mainSeconds=mainSeconds(p);db.mainId=null}db.pokemon=db.pokemon.filter(x=>x.id!==id);n++;cogs+=r.cogs;puffs+=r.puffs}
 db.cogs=Math.round(db.cogs+cogs);db.puffs=(db.puffs||0)+puffs;bxMass=null;save();closeModal();render();toast(n+' Pokémon released · +'+money(cogs)+' Cogs · +'+money(puffs)+' 🧁')}
// ---------- Summaries: mass delete ----------
function sumMassDecorate(){const l=$('summaryList');if(!l)return;l.classList.toggle('ms-on',!!sumMass);if(!sumMass){msBar('summaries','');return}
 l.querySelectorAll('.item[data-sid]').forEach(r=>{const on=sumMass.has(r.dataset.sid);r.classList.toggle('m-sel',on);r.insertAdjacentHTML('afterbegin','<i class="ms-chk'+(on?' on':'')+'">'+(on?'✓':'')+'</i>')});
 msBar('summaries','<span>'+sumMass.size+' selected</span><button class="btn" onclick="sumMassExit()">EXIT</button><button class="btn red" onclick="sumMassDelete()"'+(sumMass.size?'':' disabled')+'>DELETE</button>')}
function sumMassStart(){if(sumMass)return;sumMass=new Set();drawSummaries();toast('Select summaries to delete')}
function sumMassExit(){sumMass=null;drawSummaries()}
function sumMassDelete(){const n=sumMass?sumMass.size:0;if(!n)return;modal('DELETE SUMMARIES','<p class="small">Delete <b>'+n+' summar'+(n===1?'y':'ies')+'</b>? This cannot be undone.</p><div class="actions"><button class="btn" onclick="closeModal()">CANCEL</button><button class="btn red" onclick="sumMassDo()">DELETE</button></div>')}
function sumMassDo(){if(!sumMass)return;const n=sumMass.size;db.summaries=db.summaries.filter(s=>!sumMass.has(s.id));sumMass=null;save();closeModal();render();toast('🗑 '+n+' summar'+(n===1?'y':'ies')+' deleted')}
// ---------- wiring ----------
(()=>{const dc=drawCollection,ds=drawSummaries;drawCollection=function(){dc.apply(this,arguments);bxMassDecorate()};drawSummaries=function(){ds.apply(this,arguments);sumMassDecorate()};
 const g=$('boxGrid'),l=$('summaryList');
 if(g){msLongPress(g,e=>{if(e.target.closest('.bx-slot[onclick]'))bxMassStart()});g.addEventListener('click',e=>{if(!bxMass)return;e.stopPropagation();e.preventDefault();if(Date.now()-msLongAt<350)return;const b=e.target.closest('.bx-slot[onclick]'),id=b&&msIdOf(b);if(id)bxMassToggle(id)},true)}
 if(l){msLongPress(l,e=>{if(e.target.closest('.item[data-sid]'))sumMassStart()});l.addEventListener('click',e=>{if(!sumMass)return;e.stopPropagation();e.preventDefault();if(Date.now()-msLongAt<350)return;const r=e.target.closest('.item[data-sid]');if(!r)return;const id=r.dataset.sid;if(sumMass.has(id))sumMass.delete(id);else sumMass.add(id);drawSummaries()},true)}})();
