// Per-question reading protection. Use deadlines so background timer throttling cannot prolong a lock.
function tapProtectionTiming(prompt){
 const text=String(prompt??'').replace(/<\/?[A-Za-z][^>]*>/g,' ').trim();
 const words=text?text.split(/\s+/u).filter(w=>/[\p{L}\p{N}]/u.test(w)).length:0;
 return {words,skim:words*40,read:words*1500,total:words*1540};
}
function tapProtectionPhase(timing,elapsed){return elapsed<timing.skim?'skim':elapsed<timing.total?'read':'ready'}
function tapProtectionStart(card,prompt,selector){
 if(card._tapProtection)card._tapProtection.stop();
 const timing=tapProtectionTiming(prompt),start=Date.now(),buttons=[...card.querySelectorAll(selector)],original=new Map(buttons.map(b=>[b,b.disabled]));
 const status=document.createElement('p');status.className='tp-status';status.setAttribute('role','timer');status.setAttribute('aria-live','off');
 const heading=card.querySelector('h3');if(heading)heading.insertAdjacentElement('afterend',status);else card.prepend(status);
 let timer=0,stopped=false;
 const stop=()=>{if(stopped)return;stopped=true;clearInterval(timer);card.classList.remove('tp-skim','tp-read');status.remove();buttons.forEach(b=>{b.classList.remove('tp-locked');b.removeAttribute('aria-disabled');b.disabled=original.get(b)});if(card._tapProtection===api)delete card._tapProtection};
 const update=()=>{if(!card.isConnected){stop();return}const elapsed=Math.max(0,Date.now()-start),phase=tapProtectionPhase(timing,elapsed),locked=phase!=='ready';
  card.classList.toggle('tp-skim',phase==='skim');card.classList.toggle('tp-read',phase==='read');
  const remaining=Math.max(0,(phase==='skim'?timing.skim:timing.total)-elapsed);
  status.textContent=phase==='ready'?'Ready to answer':(phase==='skim'?'Tap Protection · Skim':'Tap Protection · Read')+' · '+(remaining/1000).toFixed(1)+'s';
  buttons.forEach(b=>{b.disabled=locked||original.get(b);b.classList.toggle('tp-locked',locked);b.setAttribute('aria-disabled',String(b.disabled))});
  if(!locked)clearInterval(timer);
 };
 const api={duration:timing.total,allowed:()=>!stopped&&card.isConnected&&Date.now()-start>=timing.total,stop};card._tapProtection=api;
 update();if(!stopped&&timing.total)timer=setInterval(update,100);return api;
}
