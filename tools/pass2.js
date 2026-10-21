// ---- Habitat: decor, backgrounds, feeding, toys and decor interactions ----
const MED_SLOTS=[[16,86],[84,90],[12,52],[88,52]]; // % of the habitat (bottom-centre of each medium decor)
const hab={queue:[],sleeping:false,wokeAt:Date.now(),big:false,edit:false,tab:'small'};
function decor(){const d=db.decor||(db.decor={small:[],medium:[null,null,null,null],bg:'bg_default'});if(!Array.isArray(d.medium))d.medium=[null,null,null,null];if(!d.bg)d.bg='bg_default';return d}
function isNight(){const h=new Date().getHours();return h>=22||h<7}
function drawHabitat(){const box=$('pasture');if(!box)return;const d=decor(),bg=ITEMS[d.bg];
 const art=box.querySelector('.pasture-art'),hb=$('habBg');if(art)art.style.display=d.bg==='bg_default'?'':'none';if(hb){hb.style.backgroundImage=d.bg!=='bg_default'&&bg&&bg.url?'url('+bg.url+')':'none'}
 $('habDecor').innerHTML=d.small.map((s,i)=>'<img class="hab-small" data-i="'+i+'" src="./assets/items/'+s.item+'.png" style="left:'+s.x+'%;top:'+s.y+'%" alt="">').join('')+d.medium.map((m,i)=>m?'<img class="hab-med hab-'+m+'" data-slot="'+i+'" src="./assets/items/'+m+'.png" style="left:'+MED_SLOTS[i][0]+'%;top:'+MED_SLOTS[i][1]+'%" alt="">':(hab.edit?'<span class="hab-slot" style="left:'+MED_SLOTS[i][0]+'%;top:'+MED_SLOTS[i][1]+'%"></span>':'')).join('');
 $('habNight').classList.toggle('on',hab.sleeping);document.querySelector('.habitat').classList.toggle('big',hab.big);document.querySelector('.habitat').classList.toggle('editing',hab.edit);
 drawTray()}
function drawTray(){const tray=$('habTray'),ed=$('habEdit');if(!tray)return;if(!hab.big){tray.innerHTML='';ed.innerHTML='';return}const v=inv();
 const snacks=Object.keys(v).filter(id=>ITEMS[id]&&ITEMS[id].kind==='snack'),toys=Object.keys(v).filter(id=>ITEMS[id]&&ITEMS[id].kind==='toy');
 tray.innerHTML='<div class="tray-row">'+(snacks.length||toys.length?snacks.map(id=>'<button class="tray-it" onclick="habFeed(\''+id+'\')" aria-label="Feed '+esc(ITEMS[id].name)+'">'+itemIcon(id)+'<b>'+v[id]+'</b></button>').join('')+toys.map(id=>'<button class="tray-it toy" onclick="habToy(\''+id+'\')" aria-label="Play with '+esc(ITEMS[id].name)+'">'+itemIcon(id)+'</button>').join(''):'<span class="small" style="color:#cfe6f7">No snacks or toys yet. Find them in boxes and Daily Deals.</span>')+'</div><div class="tray-actions"><button class="btn smallbtn" onclick="hab.edit=!hab.edit;drawHabitat()">'+(hab.edit?'✓ DONE':'✎ EDIT')+'</button><button class="btn smallbtn" onclick="closeHabitat()">✕</button></div>';
 if(!hab.edit){ed.innerHTML='';return}
 const tabs={small:'Small Decor',medium:'Medium Decor',bg:'Backgrounds'},ids=Object.keys(v).filter(id=>ITEMS[id]&&ITEMS[id].kind===hab.tab);
 ed.innerHTML='<div class="inv-tabs">'+Object.entries(tabs).map(([k,n])=>'<button class="'+(hab.tab===k?'on':'')+'" onclick="hab.tab=\''+k+'\';drawTray()">'+n+'</button>').join('')+'</div><div class="edit-row">'+(ids.length?ids.map(id=>'<div class="edit-it" data-id="'+id+'" title="'+esc(ITEMS[id].name)+'">'+itemIcon(id)+'<b>'+v[id]+'</b></div>').join(''):'<span class="small">None in your bag.</span>')+'</div><p class="small muted">'+(hab.tab==='small'?'Drag decor anywhere in the habitat. Drag placed decor out of the habitat to put it away.':hab.tab==='medium'?'Drag onto one of the 4 spots. Dropping on a used spot swaps it back to your bag.':'Drag a background into the habitat to switch. The old one goes back to your bag.')+'</p>';
 ed.querySelectorAll('.edit-it').forEach(el=>el.addEventListener('pointerdown',e=>habDrag(e,{from:'bag',id:el.dataset.id})))}
function openHabitat(edit){hab.big=true;if(edit){hab.edit=true;const k=Object.keys(inv()).map(id=>ITEMS[id]&&ITEMS[id].kind).find(k=>k==='small'||k==='medium'||k==='bg');if(k)hab.tab=k}drawHabitat();setTimeout(()=>document.querySelector('.habitat').scrollIntoView({behavior:'smooth',block:'start'}),60)}
function closeHabitat(){hab.big=false;hab.edit=false;drawHabitat()}
function habDrop(spec,cx,cy){const box=$('pasture'),r=box.getBoundingClientRect(),inside=cx>=r.left&&cx<=r.right&&cy>=r.top&&cy<=r.bottom,d=decor(),it=ITEMS[spec.id];
 const px=Math.max(3,Math.min(97,(cx-r.left)/r.width*100)),py=Math.max(8,Math.min(97,(cy-r.top)/r.height*100));
 if(spec.from==='small'){if(inside){d.small[spec.i].x=+px.toFixed(1);d.small[spec.i].y=+py.toFixed(1)}else{invAdd(d.small[spec.i].item);d.small.splice(spec.i,1)}}
 else if(spec.from==='medium'){const m=d.medium[spec.slot];if(inside){const k=nearestSlot(px,py);if(k!==spec.slot){const other=d.medium[k];d.medium[k]=m;d.medium[spec.slot]=other}}else{invAdd(m);d.medium[spec.slot]=null}}
 else if(inside&&it){invAdd(spec.id,-1);
  if(it.kind==='small')d.small.push({item:spec.id,x:+px.toFixed(1),y:+py.toFixed(1)});
  else if(it.kind==='medium'){const k=nearestSlot(px,py);if(d.medium[k])invAdd(d.medium[k]);d.medium[k]=spec.id}
  else if(it.kind==='bg'){invAdd(d.bg);d.bg=spec.id}}
 save();drawHabitat()}
function nearestSlot(px,py){let b=0,bd=1e9;MED_SLOTS.forEach((s,i)=>{const dd=(s[0]-px)**2+(s[1]-py)**2;if(dd<bd){bd=dd;b=i}});return b}
function habDrag(e,spec){e.preventDefault();const src=spec.from==='bag'?ITEMS[spec.id]:null,g=document.createElement('div');g.className='drag-ghost';g.innerHTML=spec.from==='bag'?itemIcon(spec.id,'big'):'<img class="it-ico big" src="'+e.target.src+'" alt="">';document.body.appendChild(g);
 const moveTo=(x,y)=>{g.style.left=x+'px';g.style.top=y+'px'};moveTo(e.clientX,e.clientY);if(spec.from!=='bag')e.target.style.opacity='.3';
 const mv=ev=>moveTo(ev.clientX,ev.clientY),up=ev=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);removeEventListener('pointercancel',up);g.remove();habDrop(spec,ev.clientX,ev.clientY)};
 addEventListener('pointermove',mv);addEventListener('pointerup',up);addEventListener('pointercancel',up)}
$('habDecor').addEventListener('pointerdown',e=>{if(!hab.edit)return;const t=e.target;if(t.classList.contains('hab-small'))habDrag(e,{from:'small',i:+t.dataset.i});else if(t.classList.contains('hab-med'))habDrag(e,{from:'medium',slot:+t.dataset.slot})});
// double-tap the habitat to open it; any tap wakes a sleeping Pokémon
(function(){let last=0;$('pasture').addEventListener('pointerup',e=>{if(hab.edit)return;if(hab.sleeping){habWake();return}const now=Date.now();if(now-last<330){last=0;hab.big?closeHabitat():openHabitat(false)}else last=now})})();
function habWake(){if(!hab.sleeping)return;hab.sleeping=false;hab.wokeAt=Date.now();drawHabitat()}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)habWake()});
// ---- what the companion does: snacks, toys, and visiting medium decor ----
const animOf=k=>(window.__curAnims||{})[k];
function habFeed(id){const p=db.pokemon.find(x=>x.id===db.mainId);if(!p){toast('Pick a main Pokémon first');return}feedSnack(id);hab.queue.push(async(walkTo,show)=>{habPop(id);show(animOf('Eat')?'Eat':'Idle',0);await sleepMs(2200)});drawTray()}
function habPop(id){const w=$('wander');if(!w)return;const i=document.createElement('img');i.className='hab-pop';i.src='./assets/items/'+(ITEMS[id].icon||id)+'.png';w.appendChild(i);setTimeout(()=>i.remove(),1300)}
function habToy(id){const box=$('pasture'),W=box.clientWidth,H=box.clientHeight,tx=30+Math.random()*(W-60),ty=H*.55+Math.random()*H*.35,t=document.createElement('img');t.className='hab-toy';t.src='./assets/items/'+id+'.png';t.style.left=tx+'px';t.style.top=ty+'px';box.appendChild(t);
 hab.queue.push(async(walkTo,show)=>{await walkTo(tx-18,ty+6);show(animOf('Attack')?'Attack':'Idle',2);t.classList.add('hit');await sleepMs(1300);show('Idle',0);t.remove()})}
function habPickAct(W,H){const d=decor(),slot=k=>d.medium.findIndex(m=>m===k),at=i=>[MED_SLOTS[i][0]/100*W,MED_SLOTS[i][1]/100*H];
 const bed=slot('bed');if(bed>=0&&isNight()&&!hab.sleeping&&Date.now()-hab.wokeAt>60000){const [bx,by]=at(bed);return async(walkTo,show)=>{if(!await walkTo(bx,by-6))return;hab.sleeping=true;drawHabitat();show(animOf('Sleep')?'Sleep':'Idle',0);while(hab.sleeping&&isNight()&&currentPage==='home')await sleepMs(1000);hab.sleeping=false;drawHabitat();show('Idle',0)}}
 if(Math.random()>.3)return null;const opts=[];const bowl=slot('bowl'),dummy=slot('dummy');
 if(bowl>=0)opts.push(async(walkTo,show)=>{const [bx,by]=at(bowl);if(!await walkTo(bx+(bx>W/2?-26:26),by))return;show(animOf('Eat')?'Eat':'Idle',0);await sleepMs(2600);show('Idle',0)});
 if(dummy>=0)opts.push(async(walkTo,show)=>{const [bx,by]=at(dummy),left=bx>W/2;if(!await walkTo(bx+(left?-34:34),by))return;const dm=document.querySelector('.hab-dummy');for(let k=0;k<3;k++){show(animOf('Attack')?'Attack':'Idle',left?2:6);if(dm){dm.classList.remove('hit');void dm.offsetWidth;dm.classList.add('hit')}await sleepMs(700)}show('Idle',0)});
 return opts.length?opts[Math.floor(Math.random()*opts.length)]:null}
