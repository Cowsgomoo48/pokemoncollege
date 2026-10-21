// ---- Items & inventory ----
const BGS=__BGS__;
const ITEMS={
 apple:{name:'Crunchy Apple',kind:'snack',tier:0,mult:1.25,hours:1,desc:'+25% companion EXP per hour for 1 hour.'},
 cookie:{name:'Gear Cookie',kind:'snack',tier:0,mult:1.25,hours:2,desc:'+25% companion EXP per hour for 2 hours.'},
 honey:{name:'Honey Pot',kind:'snack',tier:1,mult:1.5,hours:2,desc:'+50% companion EXP per hour for 2 hours.'},
 riceball:{name:'Rice Ball',kind:'snack',tier:1,mult:1.5,hours:3,desc:'+50% companion EXP per hour for 3 hours.'},
 cake:{name:'Celebration Cake',kind:'snack',tier:2,mult:2,hours:3,desc:'Double companion EXP per hour for 3 hours.'},
 goldapple:{name:'Golden Apple',kind:'snack',tier:3,mult:3,hours:4,desc:'Triple companion EXP per hour for 4 hours.'},
 ball:{name:'Bouncy Ball',kind:'toy',tier:1,desc:'A toy for the habitat. Toss it and your Pokémon will chase it.'},
 yarn:{name:'Yarn Ball',kind:'toy',tier:1,desc:'A toy for the habitat. Toss it and your Pokémon will chase it.'},
 plush:{name:'Gear Plushie',kind:'toy',tier:2,desc:'A toy for the habitat. Toss it and your Pokémon will chase it.'},
 grass:{name:'Grass Tuft',kind:'small',tier:0,desc:'Small decor. Place it anywhere in the habitat.'},
 rock:{name:'Pebble Pile',kind:'small',tier:0,desc:'Small decor. Place it anywhere in the habitat.'},
 flower:{name:'Flower Patch',kind:'small',tier:0,desc:'Small decor. Place it anywhere in the habitat.'},
 path:{name:'Stepping Stone',kind:'small',tier:0,desc:'Small decor. Line a few up to make a path.'},
 candle:{name:'Candle',kind:'small',tier:1,desc:'Small decor. Place it anywhere in the habitat.'},
 lantern:{name:'Hanging Lantern',kind:'small',tier:1,desc:'Small decor. Place it anywhere in the habitat.'},
 mushroom:{name:'Mushroom',kind:'small',tier:1,desc:'Small decor. Place it anywhere in the habitat.'},
 sign:{name:'Little Signpost',kind:'small',tier:1,desc:'Small decor. Place it anywhere in the habitat.'},
 crystal:{name:'Glow Crystal',kind:'small',tier:2,desc:'Small decor. Place it anywhere in the habitat.'},
 bowl:{name:'Feeding Bowl',kind:'medium',tier:1,desc:'Medium decor. Your Pokémon will wander over to eat from it.'},
 dummy:{name:'Training Dummy',kind:'medium',tier:1,desc:'Medium decor. Your Pokémon will practice attacks on it.'},
 bed:{name:'Cozy Bed',kind:'medium',tier:2,desc:'Medium decor. Your Pokémon sleeps here at night.'},
 t_standard:{name:'Safari Ticket',kind:'ticket',ticket:'standard',tier:0,icon:'ticket',desc:'A free standard Safari pull.'},
 t_shiny:{name:'Shiny Safari Ticket',kind:'ticket',ticket:'shiny',tier:1,icon:'ticket',desc:'A free Shiny Safari pull (double shiny odds).'},
 t_deluxe:{name:'Deluxe Safari Ticket',kind:'ticket',ticket:'deluxe',tier:2,icon:'ticket',desc:'A free Deluxe Safari pull.'},
 shinyticket:{name:'Shiny Ticket',kind:'shinyticket',tier:2,desc:'Use it to triple shiny chances for your next 3 Safaris. Stacks with other boosts.'},
 box_poke:{name:'PokeBox',kind:'box',box:'poke',tier:1,desc:'1–5 random goodies.'},
 box_greater:{name:'GreaterBox',kind:'box',box:'greater',tier:2,desc:'1–5 random goodies, better odds.'},
 box_ultra:{name:'UltraBox',kind:'box',box:'ultra',tier:3,desc:'1–5 random goodies, the best odds.'},
 bg_default:{name:'Pasture',kind:'bg',tier:0,desc:'The original habitat background.'}
};
BGS.forEach(b=>ITEMS[b.id]={name:b.name,kind:'bg',tier:b.tier,url:b.url,desc:'A habitat background.'});
const TIER_NAMES=['Common','Uncommon','Rare','Legendary'];
function itemIcon(id,cls=''){const it=ITEMS[id];if(!it)return '❔';if(it.kind==='bg')return '<span class="it-bg '+cls+'" style="background-image:url('+(it.url||'')+')">'+(it.url?'':'🌿')+'</span>';return '<img class="it-ico '+cls+'" src="./assets/items/'+(it.icon||id)+'.png" alt="">'}
function inv(){return db.inv||(db.inv={})}
function invAdd(id,n=1){const v=inv();v[id]=(v[id]||0)+n;if(v[id]<=0)delete v[id]}
// ---- Snack buffs: extra companion EXP while active, counting down even when not the main Pokémon ----
function buffLive(p){const b=p&&p.buff;if(!b||p.id!==db.mainId||!p.mainSince)return 0;const from=Math.max(b.from,new Date(p.mainSince).getTime()),to=Math.min(Date.now(),b.until);return to>from?(to-from)/3600000*9075*(b.mult-1):0}
function buffBake(p){if(!p||!p.buff)return;p.pxp=(p.pxp||0)+buffLive(p);p.buff.from=Date.now();if(Date.now()>=p.buff.until)p.buff=null}
function buffOn(p){return !!(p&&p.buff&&Date.now()<p.buff.until)}
function feedSnack(id){const it=ITEMS[id],p=db.pokemon.find(x=>x.id===db.mainId);if(!it||!p){toast('Pick a main Pokémon first');return}if(!inv()[id])return;buffBake(p);const now=Date.now(),old=buffOn(p)?p.buff:null;p.buff={mult:Math.max(it.mult,old?old.mult:1),until:Math.max(old?old.until:now,now)+it.hours*3600000,from:now};invAdd(id,-1);save();closeModal();render();toast('😋 '+(p.nickname||p.species)+' ate the '+it.name+'! ×'+p.buff.mult+' EXP')}
function buffText(p){if(!buffOn(p))return '';const m=Math.ceil((p.buff.until-Date.now())/60000);return '×'+p.buff.mult+' EXP · '+(m>=60?Math.floor(m/60)+'h '+(m%60)+'m':m+'m')+' left'}
// ---- Pokémon from shops and boxes ----
function giveMon(m){const entry={id:uid(),species:m.species,nickname:'',shiny:!!m.shiny,costume:m.costume||null,size:m.size,growth:m.growth||rollGrowth(),rarity:RARITIES[m.tier],obtainedAt:stamp(),mainSeconds:0,mainSince:null,...rollMoves(m.species)};db.pokemon.push(entry);return entry}
function rollGrowth(){if(Math.random()<1/4096)return [14,14,14,14,14,14];return [0,1,2,3,4,5].map(()=>1+Math.min(13,Math.floor((Math.random()+Math.random())/2*14)))}
function monOfTier(minTier,maxTier){let m;for(let i=0;i<40;i++){m=rollMon(false);if(m.tier>=minTier&&m.tier<=maxTier)break}return {...m,growth:rollGrowth()}}
// ---- Box opening ----
const BOXES={poke:{name:'PokeBox',item:'box_poke',puffs:5,odds:[40,35,20,5]},greater:{name:'GreaterBox',item:'box_greater',puffs:10,odds:[30,35,25,10]},ultra:{name:'UltraBox',item:'box_ultra',puffs:15,odds:[25,25,30,20]}};
// what can come out of a box, by tier; w = weight inside its tier
const LOOT=[
 ...['apple','cookie','grass','rock','flower','path','t_standard'].map(id=>({id,tier:0})),{cogs:15,tier:0},{cogs:25,tier:0},
 ...['honey','riceball','ball','yarn','candle','lantern','mushroom','sign','bowl','dummy','t_shiny'].map(id=>({id,tier:1})),{cogs:50,tier:1},{candy:1,tier:1},
 ...['cake','plush','crystal','bed','t_deluxe','shinyticket'].map(id=>({id,tier:2})),{cogs:120,tier:2},{candy:3,tier:2},{mon:'any',tier:2,w:.6},
 ...['goldapple'].map(id=>({id,tier:3})),{cogs:300,tier:3},{candy:8,tier:3},{mon:'rare',tier:3},{mon:'shiny',tier:3,w:.12},{mon:'costume',tier:3,w:.12},
 ...BGS.map(b=>({id:b.id,tier:Math.min(3,b.tier),w:b.tier===1?.25:.35}))];
function pickWeighted(list,rnd=Math.random){const tot=list.reduce((a,x)=>a+(x.w??1),0);let r=rnd()*tot;for(const x of list){r-=(x.w??1);if(r<0)return x}return list[list.length-1]}
function rollTier(odds,rnd=Math.random){let r=rnd()*100;for(let i=0;i<odds.length;i++){r-=odds[i];if(r<0)return i}return odds.length-1}
function boxCount(kind){const roll=()=>1+Math.floor(Math.random()*5);let n=roll();if(kind==='greater'&&n===1)n=roll();if(kind==='ultra'){if(n<2)n=roll();if(n<2)n=roll()}return n}
function grantLoot(l){
 if(l.cogs){db.cogs=Math.round((db.cogs+l.cogs)*100)/100;return {icon:'<span class="it-emoji">⚙️</span>',name:l.cogs+' Cogs',tier:l.tier}}
 if(l.candy){db.candies+=l.candy;return {icon:'<span class="it-emoji">🍬</span>',name:'Rare Candy ×'+l.candy,tier:l.tier}}
 if(l.mon){const m=l.mon==='rare'?monOfTier(2,4):monOfTier(0,4);if(l.mon==='shiny')m.shiny=true;if(l.mon==='costume')m.costume=seasonCostume();const e=giveMon(m);return {icon:portraitHTML(e.species,'it-mon')+hatHTML(e),name:(e.shiny?'✨ Shiny ':'')+(e.costume?'Costumed ':'')+e.species,tier:l.tier,mon:true}}
 invAdd(l.id);return {icon:itemIcon(l.id),name:ITEMS[l.id].name,tier:l.tier}}
function buyBox(kind){const b=BOXES[kind];if((db.puffs||0)<b.puffs){toast('Not enough Poképuffs (earned by finishing tasks)');return}db.puffs-=b.puffs;save();render();openBox(kind)}
function openBoxItem(id){const it=ITEMS[id];if(!it||!inv()[id])return;invAdd(id,-1);save();closeModal();closeInv();openBox(it.box)}
function openBox(kind){const b=BOXES[kind],n=boxCount(kind),got=[];for(let i=0;i<n;i++){const tier=rollTier(b.odds);got.push(grantLoot(pickWeighted(LOOT.filter(l=>l.tier===tier))))}save();render();
 const fx=document.createElement('div');fx.className='boxfx';fx.innerHTML='<div class="boxfx-shadow"></div><img class="boxfx-box" src="./assets/items/'+b.item+'.png" alt=""><div class="boxfx-loot"></div><p class="boxfx-tip">Tap to continue</p>';document.body.appendChild(fx);
 const box=fx.querySelector('.boxfx-box'),sh=fx.querySelector('.boxfx-shadow'),reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,H=innerHeight;
 requestAnimationFrame(()=>fx.classList.add('on'));
 const fly=reduce?{finished:Promise.resolve()}:box.animate([{transform:'translate(-50%,'+(H*.6)+'px) rotate(0deg) scale(.6)'},{transform:'translate(-50%,-'+(H*.22)+'px) rotate(540deg) scale(1.1)',offset:.65},{transform:'translate(-50%,0) rotate(720deg) scale(1)',offset:.85},{transform:'translate(-50%,-14px) rotate(720deg) scale(1)',offset:.93},{transform:'translate(-50%,0) rotate(720deg) scale(1)'}],{duration:1300,easing:'cubic-bezier(.3,.6,.4,1)',fill:'forwards'});
 fly.finished.then(()=>{sh.classList.add('on');return reduce?null:box.animate([{transform:'translate(-50%,0) rotate(0)'},{transform:'translate(-50%,0) rotate(-8deg)'},{transform:'translate(-50%,0) rotate(8deg)'},{transform:'translate(-50%,0) rotate(-5deg)'},{transform:'translate(-50%,0) scale(1.15)'}],{duration:520,fill:'forwards'}).finished}).then(()=>{
  box.classList.add('pop');sh.classList.remove('on');for(let i=0;i<18;i++){const s=document.createElement('i');s.className='boxfx-spark';s.style.setProperty('--a',(i*20)+'deg');s.style.setProperty('--d',(70+Math.random()*60)+'px');fx.appendChild(s)}
  const lootEl=fx.querySelector('.boxfx-loot');lootEl.innerHTML=got.map((g,i)=>'<div class="boxfx-card t'+g.tier+'" style="animation-delay:'+(.15+i*.18)+'s">'+g.icon+'<b>'+esc(g.name)+'</b><small>'+TIER_NAMES[g.tier]+'</small></div>').join('');fx.classList.add('done')});
 fx.onclick=()=>{if(!fx.classList.contains('done'))return;fx.classList.remove('on');setTimeout(()=>fx.remove(),300);toast(n+' item'+(n===1?'':'s')+' added to your bag 🎒')}}
// ---- Daily deals: 9 picks, new every 6 hours, plus one free refresh per day ----
function dealKey(){return Math.floor(Date.now()/216e5)+'|'+(db.dealSalt||0)}
function dealsList(){const rnd=seededRand('deals|'+dealKey()),out=[],used=new Set(),price=[12,28,65,150];
 while(out.length<9){const r=rnd();let d;
  if(r<.12){const slot=rnd()<.4?'fast':'charged',all=Object.entries(MOVE_STATS).filter(x=>x[1][3]===slot),mv=all[Math.floor(rnd()*all.length)][0];d={type:'tm',slot,move:mv,cost:slot==='fast'?30:50,key:'tm'+mv}}
  else if(r<.22){const k=['poke','greater','ultra'][rollTier([55,32,13],rnd)];d={type:'box',box:k,cost:{poke:50,greater:100,ultra:150}[k],key:'box'+k}}
  else if(r<.26){const tier=rollTier([45,30,17,7,1],rnd),ch=MONS.filter(m=>m[2]===tier),m=ch[Math.floor(rnd()*ch.length)];d={type:'mon',species:m[0],tier,cost:[90,150,240,380,600][tier],key:'mon'+m[0]}}
  else{const tier=rollTier([40,32,20,8],rnd),pool=Object.keys(ITEMS).filter(id=>ITEMS[id].tier===tier&&ITEMS[id].kind!=='box'&&id!=='bg_default');const id=pool[Math.floor(rnd()*pool.length)];if(!id)continue;d={type:'item',id,cost:Math.round(price[tier]*(.85+rnd()*.3)),key:'it'+id}}
  if(used.has(d.key))continue;used.add(d.key);out.push(d)}return out}
function dealBought(){const k=dealKey();if(!db.dealBought||db.dealBought.key!==k)db.dealBought={key:k,list:[]};return db.dealBought.list}
function buyDeal(i){const d=dealsList()[i],b=dealBought();if(!d||b.includes(i))return;if(db.cogs<d.cost){toast('Not enough Cogs');return}db.cogs=Math.round((db.cogs-d.cost)*100)/100;b.push(i);
 let msg='';if(d.type==='tm'){db.tmDiscs.push(makeTM(d.slot,d.move,'Daily Deal'));msg=d.move+' TM added'}else if(d.type==='box'){invAdd(BOXES[d.box].item);msg=BOXES[d.box].name+' added to your bag'}else if(d.type==='mon'){const m=rollMon(false);const e=giveMon({...m,species:d.species,tier:d.tier,shiny:Math.floor(Math.random()*4096)===0,growth:rollGrowth()});msg=e.species+' joined your Box!'}else{invAdd(d.id);msg=ITEMS[d.id].name+' added to your bag'}
 save();render();magSay(['Thank you!','Great pick!','Enjoy!'][Math.floor(Math.random()*3)]);toast(msg)}
function freeRefresh(){if(db.dealFreeDay===localDay())return;db.dealFreeDay=localDay();db.dealSalt=(db.dealSalt||0)+1;save();render();magSay('Fresh stock!')}
function dealCard(d,i,bought){let icon,name,sub;
 if(d.type==='tm'){icon='<span class="it-emoji">💿</span>';name=d.move;sub=(d.slot==='fast'?'Basic':'Disc')+' TM'}
 else if(d.type==='box'){icon=itemIcon(BOXES[d.box].item);name=BOXES[d.box].name;sub='Box · Daily price'}
 else if(d.type==='mon'){icon=portraitHTML(d.species,'it-mon');name=d.species;sub=RARITIES[d.tier]+' Pokémon'}
 else{const it=ITEMS[d.id];icon=itemIcon(d.id);name=it.name;sub=TIER_NAMES[it.tier]}
 return '<button class="deal t'+(d.type==='mon'?Math.min(3,d.tier):d.type==='item'?ITEMS[d.id].tier:d.type==='box'?{poke:1,greater:2,ultra:3}[d.box]:1)+(bought?' sold':'')+'" '+(bought?'disabled':'')+' onclick="buyDeal('+i+')"><span class="deal-ico">'+icon+'</span><b>'+esc(name)+'</b><small>'+esc(sub)+'</small><em>'+(bought?'SOLD':d.cost+' ⚙')+'</em></button>'}
function drawShop(){const el=$('shopArea');if(!el)return;const deals=dealsList(),b=dealBought(),left=216e5-(Date.now()%216e5),h=Math.floor(left/36e5),m=Math.floor(left%36e5/6e4);
 el.innerHTML='<div class="shelf"><div class="shelf-head"><b>🗓 DAILY DEALS</b><span>New stock in '+h+'h '+m+'m</span></div><div class="shelf-grid">'+deals.map((d,i)=>dealCard(d,i,b.includes(i))).join('')+'</div><button class="btn smallbtn shelf-refresh" '+(db.dealFreeDay===localDay()?'disabled':'')+' onclick="freeRefresh()">🔄 '+(db.dealFreeDay===localDay()?'Free refresh used today':'Free refresh (once a day)')+'</button></div>'
 +'<div class="bar" style="margin-top:16px">🎁 BOX SHOP <span>🧁 '+(db.puffs||0)+'</span></div>'+Object.entries(BOXES).map(([k,x])=>'<div class="shopitem boxitem">'+itemIcon(x.item,'big')+'<div class="shopmain"><b>'+x.name+'</b><small>'+x.odds.map((o,i)=>o+'% '+TIER_NAMES[i]).join(' · ')+'</small></div><button class="btn smallbtn" '+((db.puffs||0)<x.puffs?'disabled':'')+' onclick="buyBox(\''+k+'\')">'+x.puffs+' 🧁</button></div>').join('')
 +'<p class="small muted">Poképuffs come from finishing tasks. Boxes open right away; boxes from Daily Deals go to your bag.</p>'}
// ---- Magearna at the counter ----
let magTimer=null;
function magSay(t){const b=$('shopBubble');if(!b)return;b.textContent=t;b.classList.remove('on');void b.offsetWidth;b.classList.add('on');clearTimeout(magTimer);magTimer=setTimeout(()=>b.classList.remove('on'),1800)}
function magAnim(cls){const m=$('shopMag');if(!m)return;m.classList.remove('squish','hello','bye');void m.offsetWidth;m.classList.add(cls)}
let audioCtx=null;
function magChirp(){try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();const t=audioCtx.currentTime,base=620+Math.random()*380,n=2+Math.floor(Math.random()*3);for(let i=0;i<n;i++){const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=i%2?'triangle':'square';const st=t+i*.085;o.frequency.setValueAtTime(base*(1+i*.18*(Math.random()<.5?1:-.6)),st);o.frequency.exponentialRampToValueAtTime(base*(1.35+Math.random()*.4),st+.07);g.gain.setValueAtTime(.0001,st);g.gain.exponentialRampToValueAtTime(.07,st+.012);g.gain.exponentialRampToValueAtTime(.0001,st+.08);o.connect(g).connect(audioCtx.destination);o.start(st);o.stop(st+.09)}}catch(e){}}
function magTap(){magAnim('squish');magChirp();magSay(['Beep boop!','Hehe!','Need anything?','Bzzt ♪','Hi again!'][Math.floor(Math.random()*5)])}
// ---- Inventory (the gift box): swipe up from the dock, or tap the bag tab ----
let invTab='all';
function openInv(){const w=$('invWrap');drawInv();w.classList.add('open')}
function closeInv(){const w=$('invWrap');if(w)w.classList.remove('open')}
function drawInv(){const el=$('invGrid');if(!el)return;const v=inv(),tabs={all:'All',snack:'Snacks',toy:'Toys',decor:'Decor',bg:'Backgrounds',other:'Tickets & Boxes'};
 const kindTab=k=>k==='snack'?'snack':k==='toy'?'toy':k==='small'||k==='medium'?'decor':k==='bg'?'bg':'other';
 const ids=Object.keys(v).filter(id=>ITEMS[id]&&(invTab==='all'||kindTab(ITEMS[id].kind)===invTab)).sort((a,b)=>ITEMS[b].tier-ITEMS[a].tier||ITEMS[a].name.localeCompare(ITEMS[b].name));
 $('invTabs').innerHTML=Object.entries(tabs).map(([k,n])=>'<button class="'+(invTab===k?'on':'')+'" onclick="invTab=\''+k+'\';drawInv()">'+n+'</button>').join('');
 const main=db.pokemon.find(p=>p.id===db.mainId);$('invInfo').innerHTML=(db.shinyCharges?'✨ Shiny Ticket active: '+db.shinyCharges+' Safari'+(db.shinyCharges===1?'':'s')+' left · ':'')+(main&&buffOn(main)?'😋 '+esc(main.nickname||main.species)+' '+buffText(main):'');
 el.innerHTML=ids.length?ids.map(id=>'<button class="inv-slot t'+ITEMS[id].tier+'" onclick="invItem(\''+id+'\')">'+itemIcon(id)+'<b>×'+v[id]+'</b></button>').join(''):'<div class="empty">Nothing here yet.<br>Boxes and Daily Deals fill your bag.</div>'}
function invItem(id){const it=ITEMS[id];if(!it)return;let act='';
 if(it.kind==='snack')act='<button class="btn red" onclick="feedSnack(\''+id+'\')">FEED MY COMPANION</button>';
 else if(it.kind==='box')act='<button class="btn red" onclick="openBoxItem(\''+id+'\')">OPEN</button>';
 else if(it.kind==='ticket')act='<button class="btn red" onclick="useTicket(\''+id+'\')">USE AT THE SAFARI</button>';
 else if(it.kind==='shinyticket')act='<button class="btn red" onclick="useShinyTicket()">USE</button>';
 else act='<button class="btn blue" onclick="closeModal();closeInv();go(\'home\');openHabitat(true)">PLACE IN HABITAT</button>';
 modal(it.name.toUpperCase(),'<div class="inv-detail">'+itemIcon(id,'big')+'<div><span class="badge">'+TIER_NAMES[it.tier]+'</span> <span class="badge">×'+(inv()[id]||0)+'</span><p>'+esc(it.desc)+'</p></div></div><div class="actions">'+act+'</div>')}
function useShinyTicket(){if(!inv().shinyticket)return;invAdd('shinyticket',-1);db.shinyCharges=(db.shinyCharges||0)+3;save();closeModal();drawInv();toast('✨ Shiny chances tripled for your next 3 Safaris')}
function useTicket(id){const it=ITEMS[id];if(!it||!inv()[id])return;if(db.pendingSafari){toast('Finish the current Safari pull first');return}invAdd(id,-1);closeModal();closeInv();go('safari');buySafari(it.ticket,true)}
(function(){let y0=null;document.addEventListener('touchstart',e=>{const t=e.touches[0],dock=document.querySelector('.dock');if(dock&&t.clientY>=dock.getBoundingClientRect().top-24&&!document.querySelector('.boxfx'))y0=t.clientY;else y0=null},{passive:true});document.addEventListener('touchmove',e=>{if(y0!==null&&y0-e.touches[0].clientY>45){y0=null;openInv()}},{passive:true})})();
