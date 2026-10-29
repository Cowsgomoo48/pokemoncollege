// ===================== MYSTERY DUNGEON · digging, stones and Hatterene's shops =====================
// Dig spots: sparkles on the floor. Stand on one with no awake foe in sight to dig: up to 2–5 questions in a row, each
// harder than the last and each paying better. A wrong answer caves the spot in (you keep what you found).
// Stones: 🟠 Fire (offense), 🔵 Water (defense), 🟢 Leaf (utility). Found by digging and dropped by foes; spent at
// Hatterene's Upgrade Shop together with Tickets on upgrades that last for the run.
// Soul Stones 🟣: earned at the end of a run, spent at the ghostly Hatterene's Death Deals on permanent levels, which
// every later run starts with. Levels bought during a run go on top of those and are lost when the run ends.
// how much each level adds (change these to tune the upgrades)
const MD_PER={expert:.015,fists:.01,focus:.01,opening:.03,sharp:.02,charge:3,finisher:.02,bossbreak:.015,hide:.01,guard:.01,breath:.01,evasion:.005,footing:.15,stairrest:.03,lucky:.04,magnet:.03,bargain:.03,forager:.05};
const mdPct=(id,l)=>String(+(MD_PER[id]*l*100).toFixed(1));
const MDU={
 expert:{tab:'fire',name:'Expert Schooling',ico:'books',max:20,t:10,d:l=>'Super-effective hits deal '+mdPct('expert',l)+'% more damage.'},
 fists:{tab:'fire',name:'Punchier Fists',ico:'fist',max:20,t:8,d:l=>'Physical moves deal '+mdPct('fists',l)+'% more damage.'},
 focus:{tab:'fire',name:'Focused Mind',ico:'brain',max:20,t:8,d:l=>'Special moves deal '+mdPct('focus',l)+'% more damage.'},
 opening:{tab:'fire',name:'Opening Strike',ico:'bolt',max:10,t:9,d:l=>'Each Pokémon’s first attack on a floor deals '+mdPct('opening',l)+'% more damage.'},
 sharp:{tab:'fire',name:'Sharp Eye',ico:'target',max:10,t:10,d:l=>'The critical-hit zone on the timing bar is '+mdPct('sharp',l)+'% wider.'},
 charge:{tab:'fire',name:'Charge Up',ico:'battery',max:10,t:7,d:l=>'When a battle starts, your team gains '+MD_PER.charge*l+' Stamina.'},
 finisher:{tab:'fire',name:'Finisher',ico:'swords',max:10,t:9,d:l=>'Attacks on foes below 30% HP deal '+mdPct('finisher',l)+'% more damage.'},
 bossbreak:{tab:'fire',name:'Boss Breaker',ico:'crown',max:10,t:12,d:l=>'Attacks on bosses, Totems and Alphas deal '+mdPct('bossbreak',l)+'% more damage.'},
 weathered:{tab:'water',name:'Weathered Warriors',ico:'storm',max:10,t:6,d:l=>'Environment damage and hazards can’t bring your Pokémon below '+(1+l)+' HP.'},
 rough:{tab:'water',name:'Rough Skin',ico:'rock',max:5,t:9,d:l=>'When a foe next to you hits you with a physical move, it takes '+l+' damage back.'},
 hide:{tab:'water',name:'Thick Hide',ico:'shield',max:20,t:9,d:l=>'Your team takes '+mdPct('hide',l)+'% less damage from foes.'},
 guard:{tab:'water',name:'Guard Training',ico:'helmet',max:10,t:7,d:l=>'Guard blocks '+mdPct('guard',l)+'% more damage.'},
 breath:{tab:'water',name:'Second Breath',ico:'heart',max:10,t:8,d:l=>'When a battle ends, your team heals '+mdPct('breath',l)+'% of its max HP.'},
 evasion:{tab:'water',name:'Evasion Drills',ico:'dash',max:10,t:9,d:l=>'Your Pokémon dodge attacks '+mdPct('evasion',l)+'% more often.'},
 footing:{tab:'water',name:'Sure Footing',ico:'paw',max:5,t:6,d:l=>mdPct('footing',l)+'% chance to step over a hazard without getting hurt.'},
 stairrest:{tab:'water',name:'Stairwell Rest',ico:'ladder',max:10,t:6,d:l=>'Going down the stairs heals '+(20+MD_PER.stairrest*100*l)+'% HP instead of 20%.'},
 patches:{tab:'leaf',name:'Shinier Patches',ico:'sparkles',max:5,t:6,d:l=>['Dig spots are faint sparkles that are easy to miss.','Dig spots sparkle brighter.','A “?” pops over an ally’s head for a moment when they step onto a dig spot.','Dig spots sparkle much more often.','Dig spots show as little craters.','Dig spots give off a little light, so you can see them from further away.'][l]},
 deeper:{tab:'leaf',name:'Deeper Digs',ico:'pickaxe',max:3,t:12,d:l=>'Dig spots can be dug at least '+(2+l)+' times (up to 5).'},
 spots:{tab:'leaf',name:'Prospector',ico:'flag',max:5,t:9,d:l=>'+'+l+' dig spot'+(l===1?'':'s')+' on every floor.'},
 lucky:{tab:'leaf',name:'Lucky Finds',ico:'gem',max:10,t:8,d:l=>'Foes drop stones '+mdPct('lucky',l)+'% more often.'},
 magnet:{tab:'leaf',name:'Ticket Magnet',ico:'magnet',max:10,t:7,d:l=>'+'+mdPct('magnet',l)+'% Tickets from foes and Ticket piles.'},
 bargain:{tab:'leaf',name:'Bargain Hunter',ico:'tag',max:10,t:8,d:l=>'Items in Hatterene’s shop cost '+mdPct('bargain',l)+'% less.'},
 light:{tab:'leaf',name:'Light Bearer',ico:'lantern',max:3,t:9,d:l=>'In dark sublayers you see '+(2+l)+' tiles around your team instead of 2.'},
 scout:{tab:'leaf',name:'Scout’s Map',ico:'compass',max:3,t:10,d:l=>['The minimap shows only what you’ve seen.','The minimap shows the stairs.','The minimap shows the stairs and dig spots.','The minimap shows the stairs, dig spots and items.'][l]},
 forager:{tab:'leaf',name:'Forager',ico:'backpack',max:5,t:8,d:l=>mdPct('forager',l)+'% chance to find an item on each new floor.'}};
const MD_TABS={fire:{name:'Offense',emoji:'🟠',ico:'fire_stone'},water:{name:'Defense',emoji:'🔵',ico:'water_stone'},leaf:{name:'Utility',emoji:'🟢',ico:'leaf_stone'}};
// ---------- levels and prices ----------
function mdUpRun(){const r=runOf();return r&&!r.tower&&r.fl?r:null}
function mdPerm(id){return Math.min(MDU[id].max,((db.mdPerm||{})[id])||0)}
function mdLv(id){const r=mdUpRun();if(!r)return 0;return Math.min(MDU[id].max,mdPerm(id)+((r.up||{})[id]||0))}
function mdLvOf(r,id){return Math.min(MDU[id].max,mdPerm(id)+((r&&r.up||{})[id]||0))}
// next level n costs n stones of the upgrade's colour plus Tickets that grow with the level
function mdCost(id,n){const U=MDU[id];return {stones:n,tix:Math.round(U.t*(1+.35*(n-1)))}}
// a permanent level n costs Soul Stones
function mdSoulCost(id,n){return Math.max(1,Math.round(MDU[id].t/4*(1+.5*(n-1))))}
// ---------- the upgrades at work ----------
// offense bonuses are added together (not multiplied), so a maxed set gives a steady boost instead of doubling damage
function mdUpAtk(x,e,mv,eff){const r=mdUpRun();if(!r)return 1;let k=0;const cat=moveCat(mv)||'P';
 if(eff>1.2)k+=MD_PER.expert*mdLv('expert');k+=cat==='P'?MD_PER.fists*mdLv('fists'):MD_PER.focus*mdLv('focus');
 const op=mdLv('opening');if(op&&x.m.mdOpen!==r.fl.id){x.m.mdOpen=r.fl.id;k+=MD_PER.opening*op}
 if(e.hp>0&&e.hp<=e.maxhp*.3)k+=MD_PER.finisher*mdLv('finisher');if(e.boss)k+=MD_PER.bossbreak*mdLv('bossbreak');return 1+k}
function mdHideMult(){return 1-MD_PER.hide*mdLv('hide')}
function mdFloorHP(){return 1+mdLv('weathered')}
function mdRough(r,i,e,hits,mv){const l=mdLv('rough');if(!l||moveCat(mv)!=='P'||e.hp<=0)return;const near=hits.some(h=>h.dmg>0&&gdCheb(h.tm,e)<=1);if(!near)return;const d=Math.min(l,e.hp);e.hp-=d;setTimeout(()=>dgFloat('.dg-foe[data-i="'+i+'"]','-'+d+' 🪨','env'),250)}
// a battle starts / ends (called when free roam switches off / on)
function mdBattleStart(r){const l=mdLv('charge');if(!l)return;r.party.forEach((m,i)=>{if(m.hp>0){m.energy=Math.min(100,(m.energy||0)+MD_PER.charge*l);setTimeout(()=>dgFloat('.dg-ally[data-i="'+i+'"]','+⚡'+MD_PER.charge*l,'en'),100)}})}
function mdBattleEnd(r){const l=mdLv('breath');if(!l)return;r.party.forEach((m,i)=>{if(m.hp<=0)return;const c=combatant(partyMon(m)),h=Math.min(c.hp-m.hp,Math.max(1,Math.round(c.hp*MD_PER.breath*l)));if(h>0){m.hp+=h;setTimeout(()=>dgFloat('.dg-ally[data-i="'+i+'"]','+'+h+' HP','heal'),150)}})}
// stones dropped by a beaten foe
function mdStoneDrop(r,e){const p=e.boss?1:(e.swarm?.08:.2)*(1+MD_PER.lucky*mdLvOf(r,'lucky'));const n=e.boss?2:Math.random()<p?1:0;const got=[];for(let k=0;k<n;k++){const t=prPick(['fire','water','leaf']);mdGive(r,t,1);got.push(MD_TABS[t].emoji)}return got.join('')}
function mdGive(r,t,n){r.stones=r.stones||{fire:0,water:0,leaf:0};r.stones[t]=(r.stones[t]||0)+n}
function mdStonesHTML(r){const s=r.stones||{};return ['fire','water','leaf'].map(t=>'<span class="mds-cur">'+icoHTML(MD_TABS[t].ico)+'<b>'+(s[t]||0)+'</b></span>').join('')}
// ---------- dig spots ----------
function mdPlaceDigs(r,fl,takeIn,rooms){const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),n=rnd(1,2)+mdLvOf(r,'spots'),lo=Math.min(5,2+mdLvOf(r,'deeper'));fl.digs=[];
 for(let k=0;k<n;k++){const o=rooms[rnd(1,Math.max(1,rooms.length-1))]||rooms[0],t=takeIn(o);if(t)fl.digs.push({x:t[0],y:t[1],max:rnd(lo,5),done:0})}}
function mdDigHTML(r,fl,T,seenAt){const L=mdLvOf(r,'patches'),lv=L<=1?L:L-1;return (fl.digs||[]).filter(d=>d.done<d.max&&seenAt(d.x,d.y)).map(d=>'<div class="gd-obj md-dig-spot lv'+lv+'" style="left:'+d.x*T+'px;top:'+d.y*T+'px;--d:'+((d.x*7+d.y*3)%10)/10+'s">'+icoHTML('dig_sparkle')+'</div>').join('')}
// which question each dig asks: 1 normal, 2 harder (both multiple choice), 3 typed, 4 typed from your weak spots,
// 5 typed from the hard ones you miss most
function mdDigItem(tier){const B=DG.bank,S=db.qstats||{},st=b=>S[b.key]||{r:0,w:0},typ=b=>{try{return !!saPlan(b)}catch(e){return false}},any=a=>a[Math.floor(Math.random()*a.length)];
 if(tier===1)return DG.P.next();
 if(tier===2){const hard=[...B].sort((a,b)=>(st(b).w-st(b).r*.4+(b.kind==='gen'?1:0))-(st(a).w-st(a).r*.4+(a.kind==='gen'?1:0))).slice(0,Math.max(3,Math.ceil(B.length*.35)));return any(hard)}
 const T=B.filter(typ);if(!T.length)return DG.P.next();
 if(tier===3)return any(T);
 if(tier===4){const w=T.filter(isWeak);return any(w.length?w:T)}
 const often=T.filter(b=>st(b).w>=2).sort((a,b)=>st(b).w-st(a).w).slice(0,6);if(often.length)return any(often);const w=T.filter(isWeak);return any(w.length?w:T)}
function mdDigLoot(tier,half){const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),L={tix:0,st:[],items:[],soul:0},stone=()=>L.st.push(prPick(['fire','water','leaf']));
 if(tier===1){L.tix=rnd(3,5);if(Math.random()<.35)stone()}else if(tier===2){L.tix=rnd(5,8);stone()}else if(tier===3){L.tix=rnd(4,7);stone();if(Math.random()<.5)stone();if(Math.random()<.5)L.items.push(twItem?twItem(0):'oran')}
 else if(tier===4){L.tix=rnd(6,10);stone();stone();L.items.push(twItem?twItem(1):'apple')}else{L.tix=rnd(8,12);L.st.push('fire','water','leaf');L.items.push(twItem?twItem(2):'starf');L.soul=1}
 if(half){L.tix=Math.ceil(L.tix/2);L.st=L.st.slice(0,Math.ceil(L.st.length/2));L.items=[];L.soul=0}return L}
function mdLootText(L){return [L.tix?'+'+L.tix+' 🎟️':'',L.st.map(t=>MD_TABS[t].emoji).join(''),L.items.map(k=>DITEMS[k].icon+' '+DITEMS[k].name).join(', '),L.soul?'+1 🟣 Soul Stone':''].filter(Boolean).join(' · ')}
async function mdDigSpot(sp){const r=runOf();if(!r||!DG||DG.busy)return;if(!gdFree(r)){toast('⛏ Can’t dig with a foe awake nearby');return}DG.busy=1;const tierName=['','A question from your set','A harder one (multiple choice)','Type the answer','Type it: one you’ve struggled with','Type it: a hard one you often miss'];
 let exit=false;$('dgPanel').innerHTML='<div class="dg-msg">⛏ Digging… ('+sp.done+'/'+sp.max+')</div>';
 while(sp.done<sp.max&&!exit){const tier=sp.done+1,it=mdDigItem(tier);let exitRes;const ex=new Promise(res=>exitRes=res);
  const q=askQ(it,DG.bank,{title:'⛏ DIG '+tier+'/'+sp.max+' · '+tierName[tier].toUpperCase(),typed:tier>=3?undefined:false,typedChance:tier>=3?1:0,halfsies:!!r.halfsies});
  if(sp.done>0)setTimeout(()=>{const ov=[...document.querySelectorAll('.mgq')].pop(),card=ov&&ov.querySelector('.mgq-card');if(card&&!card.querySelector('.md-exitdig')){const b=document.createElement('button');b.className='btn md-exitdig';b.textContent='EXIT DIG (keep what you found)';b.onclick=()=>{ov.remove();exitRes('exit')};card.appendChild(b)}},60);
  let res=await Promise.race([q,ex]);if(res==='exit'){exit=true;break}const half=res==='half';if(half)res='makeup';
  if(DG&&DG.P)DG.P.report(it,half?'fail':res);if(res!=='full'&&__qMiss)recapAdd(it,__qMiss);if(res==='full')r.qOk=(r.qOk||0)+1;
  if(res==='fail'){sp.done=sp.max;save();toast('💥 The dig spot caved in! You keep what you found.');break}
  sp.done++;const L=mdDigLoot(tier,res==='makeup');r.tickets=(r.tickets||0)+L.tix;r.cogs=(r.cogs||0)+L.tix;L.st.forEach(t=>mdGive(r,t,1));L.items.forEach(k=>r.bag[k]=(r.bag[k]||0)+1);if(L.soul)r.souls=(r.souls||0)+1;r.digTotal=(r.digTotal||0)+1;save();
  toast('⛏ Dig '+tier+': '+mdLootText(L)+(sp.done<sp.max?' · keep digging for better finds!':' · the spot is dug out.'))}
 DG.busy=0;save();gdDrawBattle()}
// ---------- the shop screens ----------
function mdShopStock(r){if(!r.mdStock||r.mdStockAt!==r.rooms){const pool=Object.keys(DITEMS).map(id=>({id,w:DITEM_TIER_W[DITEMS[id].tier||0]})),st=[];while(st.length<6&&pool.length){const x=pickWeighted(pool);st.push(x.id);pool.splice(pool.indexOf(x),1)}r.mdStock=st;r.mdSold=[];r.mdStockAt=r.rooms}return r.mdStock}
function mdItemPrice(k){return Math.max(1,Math.round(DITEMS[k].cost*twShopMult()))}
const MD_SAY={shop:['Fufu… what will it be today?','Stones and Tickets, please. I keep the change.','A little stronger for the road down?','The deeper you go, the more you’ll need.','Mind the hat. It has opinions.'],
 ghost:['Ah… you came back to me.','Souls remember. So will your next run.','Spend what you earned down there.','Nothing is lost that you can buy back.','The core is waiting. Again.']};
let mdTab='fire';
function mdShopOpen(ghost){const r=runOf();if(!ghost&&!mdUpRun())return;document.querySelectorAll('.mds').forEach(x=>x.remove());const ov=document.createElement('div');ov.className='mds'+(ghost?' ghost':'');document.body.appendChild(ov);mdShopDraw(ghost);setTimeout(()=>ov.classList.add('on'),10);mdSay(ghost)}
function mdShopClose(){const ov=document.querySelector('.mds');if(!ov)return;ov.classList.remove('on');setTimeout(()=>ov.remove(),250);const r=runOf();if(r&&r.fl&&!r.tower&&$('dgStage')){save();gdDrawBattle(true)}}
function mdSay(ghost,line){const b=document.querySelector('.mds-say');if(!b)return;const L=MD_SAY[ghost?'ghost':'shop'];b.textContent=line||L[Math.floor(Math.random()*L.length)];b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop')}
function mdShopDraw(ghost){const ov=document.querySelector('.mds');if(!ov)return;const r=runOf(),run=ghost?null:r,souls=mdSouls();
 const cur=ghost?'<span class="mds-cur">'+icoHTML('soul_stone')+'<b>'+souls+'</b></span>':'<span class="mds-cur">'+icoHTML('ticket')+'<b>'+(run.tickets||0)+'</b></span>'+mdStonesHTML(run);
 const stock=ghost?'':'<div class="mds-h">Today’s stock <small>items for this run · paid in Tickets</small></div><div class="mds-stock">'+mdShopStock(run).map((k,i)=>{const sold=(run.mdSold||[]).includes(i),p=mdItemPrice(k);return '<button class="mds-item'+(sold?' sold':'')+'" '+(sold||(run.tickets||0)<p?'disabled':'')+' onclick="mdBuyItem('+i+')">'+icoHTML(ICO_MAP[DITEMS[k].icon.replace(/️/g,'')]||'gift')+'<b>'+esc(DITEMS[k].name)+'</b><small>'+(sold?'SOLD':p+' 🎟️')+'</small></button>'}).join('')+'</div>';
 const tabs='<div class="mds-tabs">'+Object.entries(MD_TABS).map(([k,T])=>'<button class="'+(mdTab===k?'on':'')+'" onclick="mdTab=\''+k+'\';mdShopDraw('+(ghost?1:0)+')">'+icoHTML(T.ico)+'<span>'+T.name+'</span></button>').join('')+'</div>';
 const cards='<div class="mds-grid">'+Object.entries(MDU).filter(([,U])=>U.tab===mdTab).map(([id,U])=>{const pl=mdPerm(id),lv=ghost?pl:mdLvOf(run,id),maxed=lv>=U.max,n=lv+1,c=mdCost(id,n),sc=mdSoulCost(id,n),can=ghost?souls>=sc:(run.stones||{})[U.tab]>=c.stones&&(run.tickets||0)>=c.tix;
  return '<button class="mds-card t-'+U.tab+(maxed?' maxed':'')+(can&&!maxed?' can':'')+'" onclick="mdCardOpen(\''+id+'\','+(ghost?1:0)+')"><span class="mds-ic">'+icoHTML(U.ico)+'<i>Lv '+lv+(ghost?'':pl?'<em>+'+pl+'</em>':'')+'</i></span><b>'+esc(U.name)+'</b><small>'+esc(U.d(Math.max(1,Math.min(U.max,lv||1))))+'</small><span class="mds-cost">'+(maxed?'MAX':ghost?icoHTML('soul_stone')+sc:icoHTML(MD_TABS[U.tab].ico)+c.stones+' '+icoHTML('ticket')+c.tix)+'</span></button>'}).join('')+'</div>';
 ov.innerHTML='<div class="mds-top"><button class="btn smallbtn" onclick="'+(ghost?'mdDeathClose()':'mdShopClose()')+'">'+(ghost?'DONE':'LEAVE')+'</button><b>'+(ghost?'👻 DEATH DEALS':'🎩 HATTERENE’S UPGRADES')+'</b><span class="mds-curs">'+cur+'</span></div>'
  +'<div class="mds-scene"><div class="mds-say"></div><img class="mds-keeper" src="./assets/mdshop/'+(ghost?'ghost':'hatterene')+'.png" alt="Hatterene" onclick="this.classList.remove(\'squish\');void this.offsetWidth;this.classList.add(\'squish\');mdSay('+(ghost?1:0)+')"><div class="mds-counter"></div></div>'
  +'<div class="mds-body">'+(ghost?'<p class="small mds-note">Levels bought here are <b>permanent</b>: every run starts with them. Levels bought from Hatterene during a run stack on top and last only for that run.</p>':'<p class="small mds-note">Upgrades bought here last for <b>this run</b>. Permanent levels come from the Death Deals at the end of a run.</p>')+stock+tabs+cards+'</div>';mdSay(ghost)}
function mdBuyItem(i){const r=mdUpRun();if(!r)return;const k=mdShopStock(r)[i],p=mdItemPrice(k);if((r.mdSold||[]).includes(i)||(r.tickets||0)<p)return;r.tickets-=p;r.bag[k]=(r.bag[k]||0)+1;(r.mdSold=r.mdSold||[]).push(i);save();mdShopDraw(0);mdSay(0,'A '+DITEMS[k].name+'. Good choice.')}
function mdCardOpen(id,ghost){const U=MDU[id],r=runOf(),pl=mdPerm(id),lv=ghost?pl:mdLvOf(r,id),n=lv+1,maxed=lv>=U.max,c=mdCost(id,n),sc=mdSoulCost(id,n),souls=mdSouls(),can=!maxed&&(ghost?souls>=sc:(r.stones||{})[U.tab]>=c.stones&&(r.tickets||0)>=c.tix);
 modal(U.name.toUpperCase(),'<div class="mds-big t-'+U.tab+'"><span class="mds-ic">'+icoHTML(U.ico)+'<i>Lv '+lv+'/'+U.max+'</i></span><div><p><b>Now:</b> '+esc(lv?U.d(lv):'Not learned yet.')+'</p>'+(maxed?'<p><b>Maxed out.</b></p>':'<p><b>Next (Lv '+n+'):</b> '+esc(U.d(n))+'</p>')+(!ghost&&pl?'<p class="small muted">Lv '+pl+' of this is permanent (from Death Deals).</p>':'')+'</div></div>'
  +(maxed?'':'<p class="mds-price">Cost: '+(ghost?icoHTML('soul_stone')+' '+sc+' Soul Stone'+(sc>1?'s':''):icoHTML(MD_TABS[U.tab].ico)+' '+c.stones+' '+MD_TABS[U.tab].name.replace('Offense','Fire').replace('Defense','Water').replace('Utility','Leaf')+' Stone'+(c.stones>1?'s':'')+' + '+icoHTML('ticket')+' '+c.tix+' Tickets')+'</p>')
  +'<div class="actions"><button class="btn" onclick="closeModal()">BACK</button>'+(maxed?'':'<button class="btn red" '+(can?'':'disabled')+' onclick="mdUpgrade(\''+id+'\','+(ghost?1:0)+')">'+(ghost?'MAKE IT PERMANENT':'UPGRADE')+'</button>')+'</div>')}
function mdUpgrade(id,ghost){const U=MDU[id],r=runOf();if(ghost){const n=mdPerm(id)+1,sc=mdSoulCost(id,n);if(n>U.max||mdSouls()<sc)return;mdSoulAdd(-sc);db.mdPerm=db.mdPerm||{};db.mdPerm[id]=n;save();closeModal();mdShopDraw(1);mdSay(1,U.name+' is yours now. Forever.');return}
 if(!r||!mdUpRun())return;const lv=mdLvOf(r,id),n=lv+1,c=mdCost(id,n);if(n>U.max||(r.stones||{})[U.tab]<c.stones||(r.tickets||0)<c.tix)return;r.stones[U.tab]-=c.stones;r.tickets-=c.tix;r.up=r.up||{};r.up[id]=(r.up[id]||0)+1;save();closeModal();mdShopDraw(0);mdSay(0,U.name+' Lv '+n+'. Don’t waste it.')}
// ---------- end of a run: Soul Stones and the Death Deals ----------
function mdSoulsFor(r,cleared){const st=r.stones||{},left=(st.fire||0)+(st.water||0)+(st.leaf||0);return Math.max(1,(r.floor||0)+1+3*(r.clearedFloors||0)+Math.floor((r.qOk||0)/4)+Math.floor(left/3)+(r.souls||0)+(cleared?2:0))}
function mdDeathOpen(){mdTab='fire';mdShopOpen(true)}
function mdDeathClose(){mdShopClose()}
// Soul Stones live in the Bag (db.inv.soulstone) and are spent from there
ITEMS.soulstone={name:'Soul Stone',kind:'soul',tier:3,w:0,desc:'Earned at the end of a Mystery Dungeon run. Spend them at the ghostly Hatterene’s Death Deals on permanent upgrades.'};
function mdSouls(){if(db.mdSouls){inv().soulstone=(inv().soulstone||0)+db.mdSouls;delete db.mdSouls}return inv().soulstone||0}
function mdSoulAdd(n){const v=mdSouls()+n;if(v>0)inv().soulstone=v;else delete inv().soulstone;save()}
