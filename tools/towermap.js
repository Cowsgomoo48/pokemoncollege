// ===================== Battle Tower v2: branching tower maps, rooms, relics, card upgrades =====================
// Each tower (one environment) is a map of rows; row i is floor start+i and the top row is the boss.
// After every room you pick a connected room on the next row (Slay-the-Spire style).
const TW_LEN={easy:[14,18],balanced:[16,20],hard:[14,22]};
const TW_LEN_NAME={easy:'Easy · 8–10 floors',balanced:'Balanced · 10–12 floors',hard:'Hard · 8–16 floors'};
const TW_ROOM={battle:['⚔️','Battle'],treasure:['💎','Treasure Room'],event:['❓','? Room'],rest:['🔥','Rest Site'],shop:['🛒','Merchant'],elite:['😈','Elite'],boss:['👑','Boss']};
function twGenMap(r){const [a,b]=TW_LEN[r.diff]||TW_LEN.balanced,len=a+Math.floor(Math.random()*(b-a+1)),rows=[];
 for(let i=0;i<len;i++){if(i===len-1){rows.push([{t:'boss'}]);continue}const n=i===0?4:3+Math.floor(Math.random()*3),row=[];
  for(let k=0;k<n;k++){let t='battle';const x=Math.random();
   if(i===len-2)t='rest';else if(i>0){if(x<.22)t='event';else if(x<.32&&i>=2)t='treasure';else if(x<.41&&i>=3)t='rest';else if(x<.49&&i>=2)t='shop';else if(x<.6&&i>=3&&i<len-2)t='elite'}
   row.push({t})}rows.push(row)}
 // at least one Merchant around the middle of every tower
 const mid=Math.max(2,Math.floor((len-1)/2));if(len>5&&!rows.slice(1,len-2).some(w=>w.some(n=>n.t==='shop')))rows[mid][Math.floor(Math.random()*rows[mid].length)].t='shop';
 // at least one Elite in towers of 8+ floors
 if(len>=8&&!rows.some(w=>w.some(n=>n.t==='elite'))){const ri=3+Math.floor(Math.random()*Math.max(1,len-5));const w=rows[Math.min(ri,len-3)];w[Math.floor(Math.random()*w.length)].t='elite'}
 // links: each room leads to 1–2 nearby rooms on the next row, and every room can be reached
 for(let i=0;i<rows.length-1;i++){const A=rows[i],B=rows[i+1];A.forEach((nd,k)=>{const pos=k/Math.max(1,A.length-1),j=Math.round(pos*(B.length-1));nd.to=[j];if(Math.random()<.45&&B.length>1){const j2=Math.min(B.length-1,Math.max(0,j+(Math.random()<.5?-1:1)));if(!nd.to.includes(j2))nd.to.push(j2)}});
  B.forEach((_,j)=>{if(!A.some(nd=>nd.to.includes(j))){let best=0,bd=9;A.forEach((nd,k)=>{const d=Math.abs(k/Math.max(1,A.length-1)-j/Math.max(1,B.length-1));if(d<bd){bd=d;best=k}});A[best].to.push(j)}})}
 const m={seg:r.tmap?r.tmap.seg+1:0,start:(r.cleared||0)+1,len,rows,row:-1,col:null};twNoForcedElite(m);return m}
// every room (and the entrance) must lead to at least one room that isn't an Elite
function twNoForcedElite(m){const R=m.rows,el=(ri,j)=>R[ri][j]&&R[ri][j].t==='elite';
 if(R[0].every((_,j)=>el(0,j)))R[0][0].t='battle';
 for(let i=Math.max(0,m.row);i<R.length-1;i++){const B=R[i+1];if(B.every((_,j)=>el(i+1,j)))B[Math.floor(B.length/2)].t='battle';
  R[i].forEach((nd,k)=>{if(!nd.to||!nd.to.length||!nd.to.every(j=>el(i+1,j)))return;const pos=k/Math.max(1,R[i].length-1);let best=-1,bd=9;B.forEach((b,j)=>{if(b.t==='elite')return;const d=Math.abs(j/Math.max(1,B.length-1)-pos);if(d<bd){bd=d;best=j}});if(best>=0)nd.to.push(best)})}}
function twMapEnsure(r){const m=r.tmap;if(!m||(m.row===m.len-1&&(r.cleared||0)>=m.start+m.len-1)){r.tmap=twGenMap(r);save()}else if(!m.noForce){twNoForcedElite(m);m.noForce=1;save()}return r.tmap}
// ---------- the map: the tower itself, one slab per floor, with that floor's rooms on it ----------
const TW_SWORDS='<svg class="tw-swords" viewBox="0 0 24 24" aria-hidden="true"><g stroke-linecap="round"><path d="M5.5 18.5L18 4.5M18.5 18.5L6 4.5" stroke="#3d4a5c" stroke-width="3.4"/><path d="M5.5 18.5L18 4.5M18.5 18.5L6 4.5" stroke="#e8eef6" stroke-width="1.8"/><path d="M4 15.5l4.5 4.5M20 15.5l-4.5 4.5" stroke="#8a5a2b" stroke-width="2.8"/><path d="M3.6 20.4l1.6-1.6M20.4 20.4l-1.6-1.6" stroke="#d9a441" stroke-width="2.6"/></g></svg>';
const twIco=t=>t==='battle'?TW_SWORDS:TW_ROOM[t][0];
function twMapHTML(r,live){const m=r.tmap,e=twEnv(r),env=twEnvKey(r),avail=m.row<0?m.rows[0].map((_,i)=>i):((m.rows[m.row]||[])[m.col]||{}).to||[];
 let h='<div class="tw-tower'+(live?' live':'')+'" style="--envbg:url(./assets/tower/'+env+'.jpg)"><div class="tw-maphead"><b>'+e.icon+' '+esc(e.name)+'</b>'+(live?'<button class="btn smallbtn tw-deckbtn" onclick="dcDeckView()" aria-label="Your deck">🃏 '+(r.deck||[]).length+'</button>':'')+'<small>Floors '+m.start+'–'+(m.start+m.len-1)+' · 🎟️ '+(r.tickets||0)+' · ❤️ '+Math.max(0,r.php)+'/'+r.pmax+'</small>'+twRelicStrip(r)+'</div><div class="tw-tscroll"><div class="tw-tstack">';
 for(let ri=m.rows.length-1;ri>=0;ri--){const row=m.rows[ri],boss=row.length===1&&row[0].t==='boss';
  h+='<div class="tw-tslab'+(boss?' boss':'')+(ri===m.row?' cur':'')+(ri<m.row?' past':'')+'" data-r="'+ri+'" style="background-image:url(./assets/tower/'+env+'.jpg)"><b class="tw-tf">'+(m.start+ri)+'F</b><div class="tw-trow">'+row.map((nd,ci)=>{const can=live&&ri===m.row+1&&avail.includes(ci),here=ri===m.row&&ci===m.col;
   return '<button class="tw-node t-'+nd.t+(can?' can':'')+(nd.visited?' done':'')+(here?' here':'')+'" data-r="'+ri+'" data-c="'+ci+'" '+(can?'onclick="twMapGo('+ri+','+ci+')"':'disabled')+' title="'+TW_ROOM[nd.t][1]+'">'+twIco(nd.t)+'</button>'}).join('')+'</div></div>'}
 h+='<div class="tw-tslab ground" data-r="-1"><b>🏁 Entrance</b></div><svg class="tw-maplines"></svg><div class="tw-tteam">'+r.party.map(q=>{const pm=partyMon(q);return pm?monSprite(pm,'',30):''}).join('')+'</div></div></div>';
 return h+(live?'<p class="tw-hint">Tap a glowing room to climb to it.</p>':'')+'<div class="tw-maplegend">'+Object.keys(TW_ROOM).map(k=>'<span>'+twIco(k)+' '+TW_ROOM[k][1]+'</span>').join('')+'</div></div>'}
// lines between linked rooms (drawn across the gaps between floors) and the team standing on its current room
function twMapLines(box){const r=runOf(),m=r&&r.tmap,stack=box&&box.querySelector('.tw-tstack'),svg=box&&box.querySelector('.tw-maplines');if(!m||!stack||!svg)return;const B=stack.getBoundingClientRect();svg.setAttribute('width',stack.offsetWidth);svg.setAttribute('height',stack.offsetHeight);let d='',dd='';
 const pt=(ri,ci)=>{const el=stack.querySelector('.tw-node[data-r="'+ri+'"][data-c="'+ci+'"]');if(!el)return null;const b=el.getBoundingClientRect();return [b.left-B.left+b.width/2,b.top-B.top+b.height/2]};
 m.rows.forEach((row,ri)=>row.forEach((nd,ci)=>(nd.to||[]).forEach(j=>{const a=pt(ri,ci),b=pt(ri+1,j);if(!a||!b)return;const s='M'+a[0].toFixed(1)+' '+a[1].toFixed(1)+'L'+b[0].toFixed(1)+' '+b[1].toFixed(1);if(nd.visited&&m.rows[ri+1][j].visited)dd+=s;else d+=s})));
 svg.innerHTML='<path d="'+d+'" class="l"/><path d="'+dd+'" class="v"/>';twMapTeam(box,m.row,m.col,false)}
function twMapTeamXY(box,ri,ci){const stack=box.querySelector('.tw-tstack'),B=stack.getBoundingClientRect(),el=ri<0?stack.querySelector('.tw-tslab.ground'):stack.querySelector('.tw-node[data-r="'+ri+'"][data-c="'+ci+'"]');if(!el)return null;const b=el.getBoundingClientRect();return [b.left-B.left+b.width/2,b.top-B.top+(ri<0?b.height*.35:-4)]}
function twMapTeam(box,ri,ci,anim){const t=box.querySelector('.tw-tteam'),p=twMapTeamXY(box,ri,ci);if(!t||!p)return;t.style.transition=anim?'transform .9s cubic-bezier(.45,0,.25,1)':'none';t.style.transform='translate('+p[0].toFixed(1)+'px,'+p[1].toFixed(1)+'px) translate(-50%,-100%)'}
function twMapFocus(box,ri,smooth){const sc=box.querySelector('.tw-tscroll'),sl=box.querySelector('.tw-tslab[data-r="'+ri+'"]');if(!sc||!sl)return;const top=sl.offsetTop-sc.clientHeight*.55+sl.offsetHeight/2;sc.scrollTo({top:Math.max(0,top),behavior:smooth&&!dcRM()?'smooth':'auto'})}
function twMapScreen(){const r=runOf(),st=$('dgStage');if(!r)return;twMapEnsure(r);if(!st)return;st.innerHTML=twMapHTML(r,true);$('dgPanel').innerHTML='';const box=st.querySelector('.tw-tower');requestAnimationFrame(()=>{twMapLines(box);twMapFocus(box,r.tmap.row+1,false)});if(r.typePick&&typeof dcTypePickShow==='function')dcTypePickShow()}
function twMapView(){const r=runOf();if(!r||!r.tmap)return;modal('🗺️ TOWER MAP',twMapHTML(r,false)+'<div class="actions"><button class="btn red" onclick="closeModal()">CLOSE</button></div>');setTimeout(()=>{const box=[...document.querySelectorAll('.tw-tower')].pop();twMapLines(box);twMapFocus(box,Math.max(0,r.tmap.row),false)},60)}
let twMapBusy=false;
async function twMapGo(ri,ci){const r=runOf(),m=r&&r.tmap;if(!m||ri!==m.row+1||twMapBusy)return;const nd=m.rows[ri][ci],box=document.querySelector('#dgStage .tw-tower');m.row=ri;m.col=ci;nd.visited=true;r.room=null;r.floor=m.start+ri;save();
 if(box&&!dcRM()){twMapBusy=true;try{const ep=dgEpoch;box.querySelectorAll('.tw-node.can').forEach(b=>{b.classList.remove('can');b.disabled=true});const tgt=box.querySelector('.tw-node[data-r="'+ri+'"][data-c="'+ci+'"]');if(tgt)tgt.classList.add('here');
  const nk=nd.t,first=ri===0,e=twEnv(r),ban=document.createElement('div');ban.className='tw-mapban';ban.innerHTML=(first?e.icon+' <b>'+esc(e.name)+'</b><br>':'')+twIco(nk)+' <b>'+(nk==='battle'?'Floor '+r.floor:TW_ROOM[nk][1])+'</b>';box.appendChild(ban);
  twMapFocus(box,ri,true);twMapTeam(box,ri,ci,true);await dgSleep(first||nk!=='battle'?1300:1000);if(ep!==dgEpoch||runOf()!==r)return}finally{twMapBusy=false}}
 twFloor(m.start+ri)}
// the room you just reached (twFloor calls this for v2 runs)
function twRoom(){const r=runOf(),m=r.tmap,nd=m&&m.rows[m.row]&&m.rows[m.row][m.col];const t=nd?nd.t:'battle';
 if(t==='battle'||t==='boss'||t==='elite'){twBattle(null);return}r.room={t};if(t==='event')r.room.ev=twPickEvent(r);save();twRoomOpen()}
function twRoomOpen(){const r=runOf(),t=r.room&&r.room.t;if(t==='rest')twRest();else if(t==='treasure')twTreasure();else if(t==='event')twEvent();else if(t==='shop')twShopOpen();else twNext()}
function twRoomDone(){const r=runOf();if(!r)return;r.cleared=Math.max(r.cleared||0,r.floor);r.room=null;const S=twStats();if(r.floor>S.best){S.best=r.floor;S.bestAt=stamp()}save();twNext()}
function twRoomFrame(icon,title,body,bg){return '<div class="dg-room tw-room twr" style="background-image:url(./assets/tower/'+(bg||twEnvKey(runOf()))+'.jpg)"><span class="dg-big">'+icon+'</span><h3>'+title+'</h3>'+body+'</div>'}
function twHpLine(r){return '<p class="small">❤️ Team HP '+Math.max(0,r.php)+' / '+r.pmax+' · 🎟️ '+(r.tickets||0)+' Tickets · 🃏 '+r.deck.length+' cards</p>'}
// ---------- deck manipulation ----------
function twDeckIds(r,f){return r.deck.filter(c=>{const d=dcDefOf(c.d);return d&&(!f||f(c,d))}).map(c=>c.u)}
async function twUpgradeFlow(){const r=runOf(),ids=twDeckIds(r,(c,d)=>!c.up&&!d.status);if(!ids.length){toast('Every card is already upgraded');return false}
 const pick=await dcChooseCards('UPGRADE WHICH CARD?',ids,1,1);if(!pick||!pick.length)return false;const c=r.deck.find(x=>x.u===pick[0]),nu=Object.assign({},c,{up:1});
 const ok=await new Promise(res=>{window.twUpOk=v=>{closeModal();res(v)};modal('UPGRADE','<div class="tw-upg"><div>'+dcCardHTML(r,c,'big')+'<small>Now</small></div><b>➜</b><div>'+dcCardHTML(r,nu,'big')+'<small>'+esc(dcDefOf(c.d).name)+'+</small></div></div><p class="small">'+dcUpNote(nu)+'</p><div class="actions"><button class="btn" onclick="twUpOk(false)">BACK</button><button class="btn red" onclick="twUpOk(true)">UPGRADE</button></div>')});
 if(!ok)return false;c.up=1;save();toast('⬆️ '+dcDefOf(c.d).name+'+');return true}
async function twRemoveFlow(title){const r=runOf(),ids=twDeckIds(r);if(r.deck.length<=5){toast('Your deck needs at least 5 cards');return false}const pick=await dcChooseCards(title||'REMOVE WHICH CARD?',ids,1,1);if(!pick||!pick.length)return false;const c=r.deck.find(x=>x.u===pick[0]);r.deck=r.deck.filter(x=>x!==c);save();toast('🗑️ '+dcName(c)+' removed from your deck');return true}
// ---------- Rest Site ----------
function twRest(){const r=runOf(),st=$('dgStage'),pct=25,h=Math.min(r.pmax-r.php,Math.ceil(r.pmax*pct/100));
 st.innerHTML=twRoomFrame('🔥','Rest Site','<img class="dg-rest-art" src="assets/rest_camp.webp" alt="Your team resting around a campfire">'+twHpLine(r)+'<div class="tw-choices"><button class="btn red" onclick="twRestHeal()">🔥 REST<small>Heal '+pct+'% of Max HP (+'+h+')</small></button><button class="btn blue" onclick="twRestUp()">⬆️ SMITH<small>Upgrade a card</small></button></div>');$('dgPanel').innerHTML=''}
function twRestHeal(){const r=runOf(),pct=25,h=Math.min(r.pmax-r.php,Math.ceil(r.pmax*pct/100));r.php+=Math.max(0,h);toast('🔥 +'+h+' HP');twRoomDone()}
async function twRestUp(){if(await twUpgradeFlow())twRoomDone()}
// ---------- Treasure Room: a few questions, a reward for each right answer ----------
async function twTreasure(){const r=runOf(),R=r.room;if(R.n==null){R.n=2+Math.floor(Math.random()*2);R.i=0;R.right=0;save()}
 const st=$('dgStage');st.innerHTML=twRoomFrame('💎','Treasure Room','<p>Answer '+R.n+' questions. Every right answer opens a chest.</p>');$('dgPanel').innerHTML='';await dcWait(500);
 while(R.i<R.n){const res=await dgQ('💎 TREASURE '+(R.i+1)+'/'+R.n);if(runOf()!==r||r.room!==R)return;if(res==='full'||res==='makeup')R.right++;R.i++;save()}
 if(!R.got){const got=[];let card=false;for(let k=0;k<R.right;k++){const x=Math.random();
   if(x<.35&&!card){card=true;got.push('🃏 A card of your choice')}else if(x<.6){const t=6+Math.floor(Math.random()*5);r.tickets=(r.tickets||0)+t;r.cogs=(r.cogs||0)+t;got.push('+'+t+' 🎟️ Tickets')}
   else if(x<.8){invAdd('box_poke',1);got.push('📦 PokeBox (to your Bag)')}else{const ids=twDeckIds(r,(c,d)=>!c.up&&!d.status);const c0=ids.length?r.deck.find(z=>z.u===ids[Math.floor(Math.random()*ids.length)]):null;if(c0){const c=c0;c.up=1;got.push('⬆️ '+dcDefOf(c.d).name+' upgraded to '+dcDefOf(c.d).name+'+')}else{r.tickets+=6;got.push('+6 🎟️ Tickets')}}}
  if(R.right===R.n&&R.n>=3){if(Math.random()<.35){const id=twRelicRoll(r);if(id){twGainRelic(r,id);got.push(TW_RELICS[id].icon+' Relic: '+TW_RELICS[id].name)}}else{invAdd('box_greater',1);got.push('📦 GreaterBox (to your Bag)')}}
  if(!got.length)got.push('The chests were empty…');R.got=got;R.card=card;save()}
 st.innerHTML=twRoomFrame('💎',R.right+' / '+R.n+' right','<p>'+R.got.join('<br>')+'</p><button class="btn red" onclick="twTreasureNext()">'+(R.card?'CHOOSE A CARD':'CONTINUE')+'</button>')}
function twTreasureNext(){const r=runOf(),R=r.room;if(R&&R.card){r.cleared=Math.max(r.cleared||0,r.floor);r.room=null;r.offer={floor:r.floor,cards:dcRollOffer(r),got:[],title:'💎 Treasure'};save();dcOfferScreen();return}twRoomDone()}
// ---------- ? Rooms: multi-page events ----------
// run() returns: a string (event over, show it), null (cancelled, stay), '@offer', '@fight', or {page,msg} (go to a page, msg shows on top)
const twTix=(r,n)=>{r.tickets=Math.max(0,(r.tickets||0)+n);if(n>0)r.cogs=(r.cogs||0)+n};
const twPct=(r,p)=>Math.max(1,Math.ceil(r.pmax*p/100));
function twHealP(r,p){const h=Math.min(r.pmax-r.php,twPct(r,p));r.php+=Math.max(0,h);return Math.max(0,h)}
function twHurt(r,n){const d=Math.min(n,r.php-1);r.php-=Math.max(0,d);return Math.max(0,d)}
function twMaxHP(r,n){r.pmax=Math.max(10,r.pmax+n);r.php=n>0?r.php+n:Math.min(r.php,r.pmax)}
function twAddCard(r,d,t,up){r.deck.push({u:uid(),d,t:t||'',up:up?1:0});return dcDefOf(d).name+(up?'+':'')}
function twXform(r,c,up){const pool=DC_REWARD_POOL.concat(Object.keys(DC_SIG).filter(id=>DC_SIG[id].type===c.t||DC_SIG[id].type2===c.t)).filter(id=>id!==c.d);c.d=pool[Math.floor(Math.random()*pool.length)];c.up=up?1:0;return dcName(c)}
function twRandCard(r,up,notT){let c=null;for(let k=0;k<6&&!c;k++)c=dcRollOffer(r).find(x=>!notT||x.t!==notT)||null;c=c||dcRollOffer(r)[0];return twAddCard(r,c.d,c.t,up)}
function twRelicGet(r){const id=twRelicRoll(r);if(!id){twTix(r,15);return '+15 🎟️ Tickets'}twGainRelic(r,id);return TW_RELICS[id].icon+' '+TW_RELICS[id].name}
const twRealCards=r=>r.deck.filter(c=>{const d=dcDefOf(c.d);return d&&!d.status});
const twSay=(who,t)=>'<i class="tw-evsay">'+(who?'<b>'+who+':</b> ':'')+'“'+t+'”</i>';
const TW_BREWS={heal:{icon:'❤️',name:'Healing Draught',p:8,s:'Heal 30% of Max HP now.'},str:{icon:'💪',name:'Strength Tonic',p:9,s:'Start your next fight with 2 Strength.'},fizz:{icon:'⚡',name:'Fizzy Elixir',p:9,s:'Next fight: +2 AP and draw 2 extra cards on turn 1.'}};
function twBrewStart(r){const b=r.brews,dc=r.dc;if(!b||!dc)return;if(b.str)dc.pst.str=(dc.pst.str||0)+b.str;if(b.ap)dc.ap+=b.ap;if(b.draw){const g=dcDrawN(r,b.draw);dc.drawn=(dc.drawn||[]).concat(g)}r.brews=null}
function twBrew(r,k,n){r.brews=r.brews||{};r.brews[k]=(r.brews[k]||0)+n}
const twUpRand=(r,n)=>{const L=shuffle(twDeckIds(r,(c,d)=>!c.up&&!d.status)).slice(0,n);return L.map(u=>{const c=r.deck.find(x=>x.u===u);c.up=1;return dcName(c)})};
const TW_MELO={
 a:[{s:'Upgrade a random card.',run:r=>{const L=twUpRand(r,1);return L.length?'⬆️ '+L[0]+'.':'Your cards glow softly.'}},{s:'+10 🎟️ Tickets.',run:r=>{twTix(r,10);return '+10 🎟️.'}},{s:'Heal 25% of Max HP.',run:r=>'+'+twHealP(r,25)+' HP.'},{s:'Gain a random card.',run:r=>'<b>'+twRandCard(r)+'</b> joins your deck.'}],
 d:[{s:'Upgrade 3 random cards.',run:r=>{const L=twUpRand(r,3);return L.length?'⬆️ '+L.join(', ')+'.':'Your cards glow darkly.'}},{s:'+35 🎟️ Tickets.',run:r=>{twTix(r,35);return '+35 🎟️.'}},{s:r=>'Gain '+twPct(r,12)+' Max HP and fully heal.',run:r=>{twMaxHP(r,twPct(r,12));r.php=r.pmax;return 'Max HP up, fully healed.'}},{s:'Gain a Relic.',run:r=>twRelicGet(r)+'!'}]};
function twMelo(r,R){if(R.s.ma==null){R.s.ma=Math.floor(Math.random()*4);R.s.md=Math.floor(Math.random()*4);save()}const a=TW_MELO.a[R.s.ma],d=TW_MELO.d[R.s.md];return {a,d:{s:twEvF(d.s,r,R),run:d.run}}}
const TW_EVENTS={
 meowscarada:{w:3,title:'The Great Meowscarada',art:'meowscarada',pages:{
  start:{text:(r,R)=>'A Meowscarada in a top hat twirls her cane on a little stage. '+twSay('Meowscarada','Ladies and gentlemen, spooks and specters! For my next trick, I need a volunteer…'),opts:[
   {l:'🎩 Volunteer',s:'Choose a card. It vanishes… and comes back as 2 random cards of its type.',can:r=>twRealCards(r).length>0,run:async r=>{const p=await dcChooseCards('WHICH CARD VANISHES?',twDeckIds(r,(c,d)=>!d.status),1,1);if(!p||!p.length)return null;const c=r.deck.find(x=>x.u===p[0]),old=dcName(c),t=c.t;r.deck=r.deck.filter(x=>x!==c);twAddCard(r,c.d,t);const n1=twXform(r,r.deck[r.deck.length-1]);twAddCard(r,c.d,t);const n2=twXform(r,r.deck[r.deck.length-1]);return 'Poof! '+old+' is gone. In its place: <b>'+n1+'</b> and <b>'+n2+'</b>. '+twSay('','Ta-da!')}},
   {l:'🃏 “Pick a card, any card”',s:()=>'Three cards, face down: a Relic, an upgraded card, or a trick that adds 1 × Sleight of Paw (curse) to your deck: '+twCurseText('sleightofpaw'),run:async(r,R)=>{R.s.deal=shuffle(['relic','card','trick']);return {page:'pick'}}},
   {l:'🎟️ Toss Tickets in her hat',s:'Pay 15 🎟️. She pulls something out of it.',can:r=>(r.tickets||0)>=15,run:async r=>{twTix(r,-15);return 'She reaches into the hat… and pulls out '+twRelicGet(r)+'! '+twSay('Meowscarada','Thank you, thank you!')}},
   {l:'🚶 Leave',run:async r=>'You slip out. She bows anyway.'}]},
  pick:{text:()=>twSay('Meowscarada','Pick a card, any card! Don’t be shy.'),cards:1,opts:[0,1,2].map(i=>({l:'❔',run:async(r,R)=>{const o=R.s.deal[i];
    if(o==='relic')return 'You flip it over: a Relic! '+twRelicGet(r)+'. '+twSay('Meowscarada','Is THIS your card?');
    if(o==='card')return 'You flip it over: <b>'+twRandCard(r,true)+'</b>, already upgraded. It joins your deck.';
    twAddCard(r,'sleightofpaw');return 'You flip it over… it’s blank! 🐾 Sleight of Paw falls out of her sleeve and into your deck. '+twSay('Meowscarada','Gotcha!')}}))}}},
 gardevoir:{w:3,title:'The Brew Stall',art:'gardevoir',pages:{
  start:{text:(r,R)=>(R.s.said||'A Gardevoir in a witch hat sits on her stool, stirring a bubbling pot. She doesn’t look up. '+twSay('Gardevoir','Potions. Brews. Elixirs. Don’t touch the green one.')),opts:[
   ...Object.keys(TW_BREWS).map(k=>({l:r=>TW_BREWS[k].icon+' '+TW_BREWS[k].name+' · '+TW_BREWS[k].p+' 🎟️',s:TW_BREWS[k].s,can:(r,R)=>!R.s[k]&&(r.tickets||0)>=TW_BREWS[k].p,run:async(r,R)=>{twTix(r,-TW_BREWS[k].p);R.s[k]=1;if(k==='heal')toast('❤️ +'+twHealP(r,30)+' HP');else if(k==='str')twBrew(r,'str',2);else{twBrew(r,'ap',2);twBrew(r,'draw',2)}R.s.said=twSay('Gardevoir',['Hmph. Don’t drink it all at once.','Fine. Tickets on the counter.','No refunds.'][Math.floor(Math.random()*3)]);return {page:'start'}}})),
   {l:'🫧 Mystery Concoction · free',s:'“It’s… experimental.” Something random happens.',can:(r,R)=>!R.s.mys,run:async(r,R)=>{R.s.mys=1;const x=Math.floor(Math.random()*6);let m;
     if(x===0)m='It tastes like berries! +'+twHealP(r,50)+' HP.';else if(x===1){const n=twPct(r,8);twMaxHP(r,n);m='You feel sturdier. +'+n+' Max HP.'}else if(x===2)m='Your bag feels heavier… '+twRelicGet(r)+'!';
     else if(x===3)m='Ugh. Your team feels sick. −'+twHurt(r,twPct(r,10))+' HP.';else if(x===4){twAddCard(r,'scorch');m='It burns going down. A Scorch card is added to your deck.'}
     else{const L=twRealCards(r);const c=L[Math.floor(Math.random()*L.length)];const old=dcName(c);m=old+' turned into <b>'+twXform(r,c,true)+'</b>!'}
     R.s.said=m+' '+twSay('Gardevoir','…You actually drank that?');return {page:'start'}}},
   {l:'🚶 Leave',run:async r=>twSay('Gardevoir','Mm. Bye.')}]}}},
 cinderace:{w:3,title:'The Fortune Teller',art:'cinderace',pages:{
  start:{text:()=>'Behind a veil, a Cinderace waves a paw over her crystal ball. '+twSay('Cinderace','Sit, sit. The cards have been waiting for you. Choose one, and I’ll read it.'),opts:[
   {l:'🌙 The Moon',s:'2 random cards in your deck change into other cards. They come back upgraded.',can:r=>twRealCards(r).length>=2,run:async r=>{const L=shuffle(twRealCards(r).slice()).slice(0,2),out=L.map(c=>{const o=dcName(c);return o+' ➜ <b>'+twXform(r,c,true)+'</b>'});return twSay('Cinderace','Change is coming.')+'<br>'+out.join('<br>')}},
   {l:'⭐ The Star',s:r=>'Gain a Relic. Lose '+twPct(r,8)+' Max HP.',run:async r=>{const n=twPct(r,8);twMaxHP(r,-n);return twSay('Cinderace','A gift from the stars… but they always take something back.')+'<br>'+twRelicGet(r)+' · −'+n+' Max HP'}},
   {l:'☀️ The Sun',s:()=>'Heal 50% of Max HP. Add 1 × Sunstroke (curse) to your deck: '+twCurseText('sunstroke'),run:async r=>{const h=twHealP(r,50);twAddCard(r,'sunstroke');return twSay('Cinderace','Warmth… and a little too much of it.')+'<br>+'+h+' HP · 🥵 Sunstroke added'}},
   {l:'🗼 The Tower',s:()=>'Gain a Relic and upgrade 2 random cards. Add 1 × Lingering Doubt (curse) to your deck: '+twCurseText('lingeringdoubt'),run:async r=>{const g=twRelicGet(r),up=shuffle(twRealCards(r).filter(c=>!c.up)).slice(0,2);up.forEach(c=>c.up=1);twAddCard(r,'lingeringdoubt');return twSay('Cinderace','The Tower… everything you built, shaken.')+'<br>'+g+(up.length?' · upgraded '+up.map(c=>dcName(c)).join(' and '):'')+' · ❔ Lingering Doubt added'}},
   {l:'🔮 Ask the crystal ball · 5 🎟️',s:'Choose what the next floor holds.',can:r=>(r.tickets||0)>=5&&!!twNextRow(r),run:async r=>{twTix(r,-5);return {page:'ball'}}},
   {l:'🚶 Leave',run:async r=>twSay('Cinderace','The cards will wait for you.')}]},
  ball:{text:()=>'The crystal ball swirls with smoke. '+twSay('Cinderace','What do you wish to see on the next floor?'),opts:[['treasure','💎 Treasure'],['rest','🔥 A Rest Site'],['shop','🛒 The Merchant']].map(([t,l])=>({l,run:async r=>{const row=twNextRow(r);if(row)row.forEach(n=>n.t=t);return 'The smoke clears. Every room on the next floor is now '+l.slice(l.indexOf(' ')+1)+'. '+twSay('Cinderace','So it is written.')}}))}}},
 gholdengo:{w:2,title:'Mountain of Coins',icon:'🪙',pages:{
  start:{text:(r,R)=>(R.s.g?'You got away with it. The Gholdengo hasn’t moved… yet.':'A huge pile of glittering coins blocks the stairs. On top sits a Gholdengo, very still. Suspiciously still.'),opts:[
   {l:'🤏 Grab a handful',s:(r,R)=>'+'+(8+Math.floor(r.floor/3))+' 🎟️. '+25*((R.s.g||0)+1)+'% chance it wakes up.',run:async(r,R)=>{R.s.g=(R.s.g||0)+1;const t=8+Math.floor(r.floor/3);twTix(r,t);toast('+'+t+' 🎟️');if(Math.random()<.25*R.s.g)return {page:'woke'};return {page:'start'}}},
   {l:'🧾 Take a loan',s:r=>'Gain '+(25+r.floor)+' 🎟️ now. Add 1 × Unpaid Debt (curse) to your deck: '+twCurseText('unpaidfavor'),run:async r=>{const t=25+r.floor;twTix(r,t);twAddCard(r,'unpaidfavor');return 'The Gholdengo slides a stack of coins your way and writes something in a tiny ledger. +'+t+' 🎟️ · 🧾 Unpaid Debt added'}},
   {l:'⚔️ Challenge it',s:'A tough fight. Win: +20 🎟️ and a Relic.',run:async r=>{r.evFight='boss';r.evBonus={tix:20,relic:1};return '@fight'}},
   {l:'🚶 Leave',run:async(r,R)=>R.s.g?'You tiptoe away with your pockets full.':'You leave the coins alone.'}]},
  woke:{text:()=>'Its eyes snap open. The coins start to float. <b>Gholdengo wants its Tickets back!</b>',opts:[{l:'⚔️ FIGHT',run:async r=>{r.evFight='boss';return '@fight'}}]}}},
 unown:{w:2,title:'The Unown Archive',icon:'📖',pages:{
  start:{text:(r,R)=>['A dusty book lies open on a stand. The letters are moving. They’re Unown.','The Unown swirl off the page and nip at your team. The next page glows brighter.','The book shakes. Most of the words are gone now. You can almost read the last page.'][R.s.p||0],opts:[
   {l:(r,R)=>(R.s.p?'📖 Keep reading':'📖 Read'),s:(r,R)=>(R.s.p===2?'Lose '+twPct(r,12)+' HP. Gain a Relic.':'Lose '+twPct(r,[4,7][R.s.p||0])+' HP.'),run:async(r,R)=>{const p=R.s.p||0,d=twHurt(r,twPct(r,[4,7,12][p]));toast('−'+d+' HP');if(p===2)return 'The last page tears itself out and turns into '+twRelicGet(r)+'.';R.s.p=p+1;return {page:'start'}}},
   {l:'✂️ Tear out the last page',s:()=>'Gain a Relic now without reading. Add 1 × Frayed Focus (curse) to your deck: '+twCurseText('frayedfocus'),run:async r=>{twAddCard(r,'frayedfocus');return 'The page rips free and turns into '+twRelicGet(r)+'. The Unown scatter, and your thoughts feel a little frayed. 🧵 Frayed Focus added'}},
   {l:'📕 Close the book',run:async r=>'You close it. The Unown settle down.'}]}}},
 spinda:{w:2,title:'Spinda’s Wheel',icon:'🎡',pages:{
  start:{text:()=>'A dizzy Spinda wobbles next to a giant prize wheel. It points at the wheel, then at you, then at the wheel.',opts:[
   {l:'🎡 Spin!',s:'Anything could happen.',run:async r=>{const x=Math.floor(Math.random()*6);await dcWait(400);
     if(x===0){const t=20+Math.floor(r.floor/2);twTix(r,t);return '🎟️ Jackpot! +'+t+' Tickets.'}if(x===1)return '❤️ +'+twHealP(r,35)+' HP.';if(x===2)return '🎁 '+twRelicGet(r)+'!';
     if(x===3){if(await twRemoveFlow('THE WHEEL TAKES A CARD'))return '🗑️ The wheel took a card off your hands.';return 'The wheel wobbles to a stop on nothing.'}
     if(x===4){twAddCard(r,'daze');return '💫 Dizzy! A Daze card is added to your deck.'}return '💥 Ouch! −'+twHurt(r,twPct(r,10))+' HP.'}},
   {l:'🚶 Leave',run:async r=>'The Spinda falls over. You decide not to.'}]}}},
 snorlax:{w:2,title:'Sleeping Snorlax',icon:'😴',pages:{
  start:{text:()=>'A Snorlax is fast asleep on a huge pile of berries. It’s snoring loudly.',opts:[
   {l:'🫐 Sneak one berry',s:'Heal 20% of Max HP.',run:async r=>'Crunch. Snorlax keeps snoring. +'+twHealP(r,20)+' HP.'},
   {l:'🛏️ Borrow its pillow',s:r=>'Gain '+twPct(r,15)+' Max HP. No fight. Add 1 × Dead Weight (curse) to your deck: '+twCurseText('deadweight'),run:async r=>{const n=twPct(r,15);twMaxHP(r,n);twAddCard(r,'deadweight');return 'You tug the pillow free. Snorlax rolls over and keeps snoring. +'+n+' Max HP · ⚓ Dead Weight added'}},
   {l:'🧺 Take the whole pile',s:r=>'Gain '+twPct(r,10)+' Max HP. Then you have to fight.',run:async r=>{twMaxHP(r,twPct(r,10));r.evFight='battle';return '@fight'}},
   {l:'🚶 Leave',run:async r=>'You let it sleep.'}]}}},
 kecleon:{w:2,title:'Kecleon’s Swap Meet',icon:'🦎',pages:{
  start:{text:()=>'A Kecleon has spread a blanket full of odd cards. '+twSay('Kecleon','One for one. Fair trade. Mine are better.'),opts:[
   {l:'🔁 Trade a card',s:'Give up a card. Get a random upgraded card of another type.',run:async r=>{const p=await dcChooseCards('GIVE WHICH CARD?',twDeckIds(r,(c,d)=>!d.status),1,1);if(!p||!p.length)return null;const c=r.deck.find(x=>x.u===p[0]),old=dcName(c);r.deck=r.deck.filter(x=>x!==c);return 'You hand over '+old+' and get <b>'+twRandCard(r,true,c.t)+'</b>.'}},
   {l:'🔁🔁 Trade two',s:'Give up 2 cards. Get 2 random upgraded cards.',can:r=>r.deck.length>6,run:async r=>{const p=await dcChooseCards('GIVE WHICH 2 CARDS?',twDeckIds(r,(c,d)=>!d.status),2,2);if(!p||p.length<2)return null;const old=p.map(u=>{const c=r.deck.find(x=>x.u===u);r.deck=r.deck.filter(x=>x!==c);return dcName(c)});return 'You hand over '+old.join(' and ')+'. You get <b>'+twRandCard(r,true)+'</b> and <b>'+twRandCard(r,true)+'</b>.'}},
   {l:'🚶 Leave',run:async r=>twSay('Kecleon','Your loss.')}]}}},
 shedinja:{w:2,title:'Shedinja’s Bargain',icon:'👻',pages:{
  start:{text:()=>'A Shedinja floats out of the dark. You can see right through it. '+twSay('Shedinja','Your shell is so full… Give me some, and I’ll take what weighs you down.'),opts:[
   {l:'🫥 Give it your strength',s:r=>'Lose '+twPct(r,10)+' Max HP. Remove up to 2 cards.',can:r=>r.deck.length>5,run:async r=>{const p=await dcChooseCards('REMOVE UP TO 2 CARDS',twDeckIds(r),1,Math.min(2,r.deck.length-5));if(!p||!p.length)return null;const n=twPct(r,10);twMaxHP(r,-n);const old=p.map(u=>{const c=r.deck.find(x=>x.u===u);r.deck=r.deck.filter(x=>x!==c);return dcName(c)});return 'It takes '+n+' Max HP… and '+old.join(' and ')+' with it.'}},
   {l:'👁️ Stare into its shell',s:()=>'Remove up to 2 cards. No Max HP lost. Add 1 × Tunnel Vision (curse) to your deck: '+twCurseText('tunnelvision'),can:r=>r.deck.length>5,run:async r=>{const p=await dcChooseCards('REMOVE UP TO 2 CARDS',twDeckIds(r),1,Math.min(2,r.deck.length-5));if(!p||!p.length)return null;const old=p.map(u=>{const c=r.deck.find(x=>x.u===u);r.deck=r.deck.filter(x=>x!==c);return dcName(c)});twAddCard(r,'tunnelvision');return 'You stare into the empty shell until it’s all you can see. '+old.join(' and ')+' fade away. 🔭 Tunnel Vision added'}},
   {l:'🚶 Refuse',run:async r=>'It drifts back into the dark.'}]}}},
 meloetta:{w:3,title:'Two Meloetta',duo:['meloetta_angel','meloetta_devil'],pages:{
  start:{text:()=>'Two Meloetta float down, one on each side of you. '+twSay('Angel Meloetta','Take my gift. It’s small, but it’s kind.')+twSay('Devil Meloetta','Or take mine! It’s MUCH better… it just comes with a little curse.'),duo:1,opts:[
   {l:'😇 Accept the blessing',s:(r,R)=>twMelo(r,R).a.s,run:async(r,R)=>twMelo(r,R).a.run(r)+' '+twSay('Angel Meloetta','Be well.')},
   {l:'😈 Make the deal',s:(r,R)=>twMelo(r,R).d.s+' Add 1 × Broken Chord (curse) to your deck: '+twCurseText('brokenchord'),run:async(r,R)=>{const m=twMelo(r,R).d.run(r);twAddCard(r,'brokenchord');return m+' 🎼 Broken Chord is added to your deck. '+twSay('Devil Meloetta','Pleasure doing business!')}},
   {l:'🚶 Refuse both',run:async r=>'They both pout and fly away.'}]}}},
 alakazam:{w:2,title:'Double or Nothing',icon:'🥄',pages:{
  start:{text:(r,R)=>(R.s.n?'<b>'+R.s.n+' right!</b> The pot is '+R.s.bank+' 🎟️. ':'An Alakazam bends a spoon and grins. ')+twSay('Alakazam',R.s.n?'Again? Miss one and the pot is mine.':'Answer my questions. Every right answer doubles the pot. Miss one and you lose it all.'),opts:[
   {l:(r,R)=>R.s.n?'🧠 Keep going':'🧠 Play',s:(r,R)=>R.s.n===3?'Win: the pot and a Relic.':'Next: '+[6,12,24,48][R.s.n||0]+' 🎟️ in the pot.',run:async(r,R)=>{const res=await dgQ('🥄 QUESTION '+((R.s.n||0)+1)+'/4');if(runOf()!==r||r.room!==R)return null;if(!(res==='full'||res==='makeup')){const b=R.s.bank||0;return 'Wrong! '+(b?'The '+b+' 🎟️ pot vanishes. ':'')+twSay('Alakazam','Better luck next time.')}
     R.s.n=(R.s.n||0)+1;R.s.bank=[6,12,24,48][R.s.n-1];if(R.s.n===4){twTix(r,R.s.bank);return '4 for 4! +'+R.s.bank+' 🎟️ and '+twRelicGet(r)+'. '+twSay('Alakazam','…Impressive.')}return {page:'start'}}},
   {l:(r,R)=>R.s.n?'💰 Cash out':'🚶 Leave',s:(r,R)=>R.s.n?'Take '+R.s.bank+' 🎟️.':'',run:async(r,R)=>{if(!R.s.n)return 'The Alakazam shrugs.';twTix(r,R.s.bank);return '+'+R.s.bank+' 🎟️. '+twSay('Alakazam','Smart.')}}]}}}};
const twCurseText=id=>DC_STATUS[id].text.replace(/^Curse · /,'');
// ---------- Potions: 2 slots per run, single use, free (no AP, no question) ----------
const TW_POTIONS={
 potion:{icon:'🧃',name:'Potion',desc:'Heal 8 HP, up to your maximum HP.'},
 guardtonic:{icon:'🛡️',name:'Guard Tonic',desc:'Gain 10 Block.'},
 aptonic:{icon:'⚡',name:'AP Tonic',desc:'Gain 1 AP this turn.'},
 focustonic:{icon:'🧠',name:'Focus Tonic',desc:'Draw 2 cards.'},
 fullheal:{icon:'💊',name:'Full Heal',desc:'Clear one debuff affecting your team (you choose), including all of its stacks.',tgt:'debuff'},
 exposuretonic:{icon:'🎯',name:'Exposure Tonic',desc:'Apply Vulnerable 2 to one enemy.',tgt:'enemy'}};
// drop chances after a win, by fight kind, and how often each potion shows up (tune here)
const TW_POTION_DROP={battle:.3,swarm:.3,elite:.5,weights:{potion:3,guardtonic:3,aptonic:2,focustonic:2,fullheal:2,exposuretonic:2}};
const twPots=r=>{if(!Array.isArray(r.potions)||r.potions.length!==2)r.potions=[(r.potions||[])[0]||null,(r.potions||[])[1]||null];r.potions=r.potions.map(p=>p&&TW_POTIONS[p]?p:null);return r.potions};
function twPotionDrop(kind){const ch=TW_POTION_DROP[kind];if(!ch||Math.random()>=ch)return null;const W=TW_POTION_DROP.weights;return pickWeighted(Object.keys(W).map(id=>({id,w:W[id]}))).id}
function twPotionBar(r){const P=twPots(r),dc=r.dc,ready=twPotReady(r);return '<div class="dc-pots">'+P.map((id,k)=>id?'<button class="dc-pot'+(ready?' ready':'')+'" onclick="twPotionInfo('+k+')" title="'+esc(TW_POTIONS[id].name+': '+TW_POTIONS[id].desc)+'">'+TW_POTIONS[id].icon+'</button>':'<span class="dc-pot empty" title="Empty potion slot">·</span>').join('')+'</div>'}
const twPotReady=r=>{const dc=r&&r.dc;return !!dc&&dc.phase==='player'&&!dc.pend&&!dc.post&&!dc.hw&&!dcLock&&dc.foes.some(f=>f.hp>0)&&r.php>0};
function twPotCan(r,id){const dc=r.dc;if(!twPotReady(r))return false;if(id==='fullheal')return dcOwnDebuffs(r).length>0;return true}
function twPotionInfo(k){const r=runOf(),id=twPots(r)[k];if(!id)return;const X=TW_POTIONS[id],inFight=!!(r.dc),can=inFight&&twPotCan(r,id);
 modal(X.icon+' '+X.name.toUpperCase(),'<p class="small tw-tier">Potion · single use · no AP, no question</p><p>'+X.desc+'</p>'+(inFight&&!can?'<p class="small muted">'+(id==='fullheal'&&twPotReady(r)?'Your team has no debuffs right now.':'Usable during your turn.')+'</p>':'')+'<div class="actions"><button class="btn" onclick="closeModal()">CLOSE</button>'+(inFight?'<button class="btn red" onclick="closeModal();twPotionUse('+k+')"'+(can?'':' disabled')+'>USE</button>':'')+'</div>')}
async function twPotionUse(k){const r=runOf(),dc=r&&r.dc,P=twPots(r),id=P[k];if(!id||!twPotCan(r,id))return;const X=TW_POTIONS[id];let tgt=null;
 if(X.tgt){dcLock=true;try{if(X.tgt==='enemy'){const al=dc.foes.map((f,i)=>f.hp>0?i:-1).filter(i=>i>=0);tgt=al.length===1?al[0]:await dcChooseFoe('🎯 EXPOSURE TONIC: WHICH ENEMY?',-1)}
  else{const L=dcOwnDebuffs(r);const j=await dcChooseOpt('💊 FULL HEAL: CLEAR WHICH DEBUFF?',L.map(x=>x.label));tgt=j==null?null:L[j].k}}finally{dcLock=false}
  if(tgt==null||r.dc!==dc||P[k]!==id||!twPotReady(r))return;if(X.tgt==='enemy'&&!(dc.foes[tgt]&&dc.foes[tgt].hp>0))return}
 P[k]=null;dcMsg(X.icon+' '+X.name);
 if(id==='potion')dcHeal(r,8);else if(id==='guardtonic')dcAddBlock(r,10);else if(id==='aptonic'){dc.ap+=1;dcFx('p',0,'+1 AP','st')}else if(id==='focustonic')dcDrawAuto(r,2);
 else if(id==='fullheal'){if(tgt==='burn')dc.pburn=0;else dc.pst[tgt]=0;dcFx('p',0,'💊','st')}
 else if(id==='exposuretonic'){const f=dc.foes[tgt];f.st.vuln=(f.st.vuln||0)+2;dcFx('f',tgt,'🎯+2','st')}
 save();dcRender();if(dc.post)dcPost();else dcCheckEnd(r)}
function twPotionOfferScreen(){const r=runOf(),o=r&&r.offer,st=$('dgStage');if(!o||!o.potion||o.potDone||!st)return dcOfferScreen();const P=twPots(r),N=TW_POTIONS[o.potion],row=(X,extra)=>'<div class="tw-potrow"><span>'+X.icon+'</span><div><b>'+X.name+'</b><small>'+X.desc+'</small></div>'+(extra||'')+'</div>';
 st.innerHTML='<div class="dg-room tw-room dc-reward" style="background-image:url(./assets/tower/'+twEnvKey(r)+'.jpg)"><span class="dg-big">🧪</span><h3>New potion</h3>'+row(N)+'<p class="small">Both potion slots are full. Replace one, or leave the new potion behind.</p><div class="tw-pots">'+P.map((id,k)=>row(TW_POTIONS[id],'<button class="btn red" onclick="twPotionPick('+k+')">REPLACE</button>')).join('')+'</div><div class="actions"><button class="btn" onclick="twPotionPick(null)">LEAVE IT</button></div></div>';$('dgPanel').innerHTML=''}
function twPotionPick(k){const r=runOf(),o=r&&r.offer;if(!o||!o.potion||o.potDone)return;const P=twPots(r),N=TW_POTIONS[o.potion];o.potDone=1;if(k!=null&&P[k]!==undefined){const old=P[k];P[k]=o.potion;o.got=(o.got||[]).concat(N.icon+' Potion: '+N.name+(old?' (replaced '+TW_POTIONS[old].name+')':''))}else o.got=(o.got||[]).concat('Left '+N.name+' behind');save();dcOfferScreen()}
function twNextRow(r){const m=r.tmap,row=m&&m.rows[m.row+1];return row&&!row.some(n=>n.t==='boss')?row:null}
function twPickEvent(r){if(Math.random()<.15)return 'ambush';const all=Object.keys(TW_EVENTS);let seen=(r.seenEv||[]).filter(k=>all.includes(k));if(seen.length>=all.length)seen=[];const pool=all.filter(k=>!seen.includes(k)).map(id=>({id,w:TW_EVENTS[id].w}));const id=pickWeighted(pool).id;r.seenEv=seen.concat(id);return id}
const twEvF=(v,r,R)=>typeof v==='function'?v(r,R):v;
let twEvBusy=false;
function twEvFrame(E,body){const top=E.duo?'':E.art?'<img class="tw-evart" src="assets/events/'+E.art+'.webp" alt="'+esc(E.title)+'">':'<span class="dg-big">'+E.icon+'</span>';return '<div class="dg-room tw-room twr tw-ev" style="background-image:url(./assets/tower/'+twEnvKey(runOf())+'.jpg)">'+top+'<h3>'+E.title+'</h3>'+body+'</div>'}
function twEvent(){const r=runOf(),R=r.room,st=$('dgStage');$('dgPanel').innerHTML='';
 if(R.ev==='ambush'){st.innerHTML=twRoomFrame('❓','Ambush!','<p>Wild Pokémon jump out from the shadows!</p><button class="btn red" onclick="twEventFight()">FIGHT ▶</button>');return}
 const E=TW_EVENTS[R.ev];if(!E){R.ev=twPickEvent(r);save();return twEvent()}R.s=R.s||{};R.page=R.page||'start';
 if(R.msg!=null){st.innerHTML=twEvFrame(E,'<p class="tw-evtext">'+R.msg+'</p>'+twHpLine(r)+'<button class="btn red" onclick="twEventEnd()">CONTINUE</button>');return}
 const P=E.pages[R.page],opts=P.opts.map((o,i)=>{const s=twEvF(o.s,r,R),dis=o.can&&!o.can(r,R);return P.cards?'<button class="tw-evcard" onclick="twEventPick('+i+')">'+twEvF(o.l,r,R)+'</button>':'<button class="btn'+(i===P.opts.length-1?'':' red')+'" onclick="twEventPick('+i+')"'+(dis?' disabled':'')+'>'+twEvF(o.l,r,R)+(s?'<small>'+s+'</small>':'')+'</button>'});
 if(P.duo){st.innerHTML=twEvFrame(E,'<div class="tw-evduo">'+E.duo.map((a,i)=>'<div><img class="tw-evart" src="assets/events/'+a+'.webp" alt="">'+opts[i]+'</div>').join('')+'</div><p class="tw-evtext">'+twEvF(P.text,r,R)+'</p>'+twHpLine(r)+'<div class="tw-choices">'+opts.slice(2).join('')+'</div>');return}
 st.innerHTML=twEvFrame(E,'<p class="tw-evtext">'+twEvF(P.text,r,R)+'</p>'+twHpLine(r)+'<div class="'+(P.cards?'tw-evcards':'tw-choices')+'">'+opts.join('')+'</div>')}
async function twEventPick(i){const r=runOf(),R=r.room,E=TW_EVENTS[R&&R.ev];if(!E||R.msg!=null||twEvBusy)return;const o=E.pages[R.page||'start'].opts[i];if(!o||(o.can&&!o.can(r,R)))return;twEvBusy=true;let m=null;try{m=await o.run(r,R)}finally{twEvBusy=false}
 if(runOf()!==r||r.room!==R)return;if(m==null){twEvent();return}if(m==='@offer'){r.cleared=Math.max(r.cleared||0,r.floor);r.room=null;save();dcOfferScreen();return}if(m==='@fight'){twEventFight();return}
 if(typeof m==='object'){R.page=m.page||R.page;save();twEvent();return}R.msg=m;save();twEvent()}
function twEventEnd(){twRoomDone()}
function twEventFight(){const r=runOf();r.room=null;save();twBattle(null)}
// ---------- Relics ----------
const TW_TIERS={b:['Boss',0,[0,0]],c:['Common',50,[18,24]],u:['Uncommon',28,[26,33]],r:['Rare',14,[36,44]],s:['Super Rare',6,[50,60]],l:['Legendary',2,[72,86]]};
const TW_RELICS={
 pocketshield:{t:'c',icon:'🛡️',name:'Pocket Shield',desc:'Start each combat with 5 Block.'},
 whetstone:{t:'c',icon:'🪨',name:'Whetstone',desc:'Your first attack each combat deals 3 extra damage to one target it hits. Applies once, even if the attack hits multiple times.'},
 bookmark:{t:'c',icon:'🔖',name:'Bookmark',desc:'Draw 1 extra card in your opening hand on turn two.'},
 travelersbiscuit:{t:'c',icon:'🍪',name:'Traveler’s Biscuit',desc:'Heal 2 HP after clearing a combat floor.'},
 loosechange:{t:'c',icon:'🪙',name:'Loose Change',desc:'Gain 1 AP on turn one of every third combat. Boss combats count.'},
 practicewraps:{t:'c',icon:'🩹',name:'Practice Wraps',desc:'The first card you successfully play each combat that both deals damage and grants Block gives 3 extra Block.'},
 sparebutton:{t:'c',icon:'🔘',name:'Spare Button',desc:'The first time your party loses HP each combat, gain 4 Block after the damage resolves.'},
 pocketfan:{t:'c',icon:'🪭',name:'Pocket Fan',desc:'The first time you discard a card through a card effect each combat, draw 1 card after that effect resolves.'},
 luckymarble:{t:'c',icon:'🔮',name:'Lucky Marble',desc:'The first time you play a 0 AP card each combat, gain 3 Block.'},
 weatheredlens:{t:'c',icon:'🔍',name:'Weathered Lens',desc:'The first time you Scry each combat, look at 1 additional card.'},
 charcoalchip:{t:'c',icon:'🔥',name:'Charcoal Chip',desc:'The first time you apply Burn each combat, apply 1 extra Burn to one affected enemy.'},
 coppercoil:{t:'c',icon:'🧲',name:'Copper Coil',desc:'Start each combat with 1 Charge.'},
 seedpacket:{t:'c',icon:'🌱',name:'Seed Packet',desc:'The first card you Plant each combat starts with 1 extra Plant counter.'},
 spoolofsilk:{t:'c',icon:'🧵',name:'Spool of Silk',desc:'The first time you land three hits on the same enemy in one turn each combat, gain 5 Block.'},
 smoothpebble:{t:'c',icon:'🪨',name:'Smooth Pebble',desc:'Keep up to 3 unspent Block through your first Block reset after turn one.'},
 ribbonclip:{t:'c',icon:'🎀',name:'Ribbon Clip',desc:'The first card you carry into a new turn with Retain each combat grants 4 Block after that turn’s Block reset.'},
 safetygoggles:{t:'u',icon:'🥽',name:'Safety Goggles',desc:'Start each combat with 1 Ward.'},
 forgedbracket:{t:'u',icon:'🔩',name:'Forged Bracket',desc:'The first time you attach a component to a Construct each combat, gain 6 Block.'},
 windsock:{t:'u',icon:'🎐',name:'Wind Sock',desc:'The first time you gain a Fly counter each combat, draw 1 card.'},
 porcelainbell:{t:'u',icon:'🔔',name:'Porcelain Bell',desc:'The first time a Brittle effect resolves each combat, gain 6 Block.'},
 mothlantern:{t:'u',icon:'🏮',name:'Moth Lantern',desc:'The first time a card returns to your hand through Isekai each combat, draw 1 card.'},
 surveyorspeg:{t:'u',icon:'📍',name:'Surveyor’s Peg',desc:'The first time each combat that one of your effects removes an enemy’s last point of Block without dealing damage, apply Vulnerable 1 to that enemy.'},
 poisonersfunnel:{t:'u',icon:'🧪',name:'Poisoner’s Funnel',desc:'The first time each combat you apply Poison to two or more enemies with a single card, choose one of those enemies and apply 2 extra Poison to it.'},
 firstaidtin:{t:'u',icon:'🩺',name:'First-Aid Tin',desc:'Once per combat, if you start a turn below half HP, heal 4 HP.'},
 heavypurse:{t:'u',icon:'💰',name:'Heavy Purse',desc:'The first card you play each combat with a base cost of at least 3 AP refunds 1 AP after resolving.'},
 counterweightcharm:{t:'u',icon:'⚖️',name:'Counterweight Charm',desc:'The first time each combat you spend at least 5 Block on a single card effect, draw 2 cards.'},
 smokedglass:{t:'u',icon:'🕶️',name:'Smoked Glass',desc:'Once per turn, when you move at least two cards to the bottom of your draw pile in a single Scry, gain 3 Block.'},
 brassalarm:{t:'u',icon:'⏰',name:'Brass Alarm',desc:'On turn one, gain 2 Block for each enemy with an Attack intent, up to 8 Block.'},
 emergencywhistle:{t:'u',icon:'📯',name:'Emergency Whistle',desc:'The first Haste card you play during an enemy’s Attack step each combat costs 1 less AP, to a minimum of 0.'},
 hollowlocket:{t:'u',icon:'📿',name:'Hollow Locket',desc:'The first time each combat you Exile a card from your hand without playing it, gain 1 AP.'},
 prismbadge:{t:'r',icon:'🌈',name:'Prism Badge',desc:'The first turn each combat that you play cards of three distinct Pokémon types, draw 2 cards and gain 5 Block.'},
 preservedember:{t:'r',icon:'🕯️',name:'Preserved Ember',desc:'Once per combat, when you use a card to remove Burn from an enemy, reapply half the removed stacks, rounded down, after the card resolves if the enemy survives.'},
 toxichourglass:{t:'r',icon:'⏳',name:'Toxic Hourglass',desc:'The first time each combat you apply Toxin to an enemy, resolve one immediate Toxin tick on it, including the normal loss of 1 stack.'},
 greenhousekey:{t:'r',icon:'🔑',name:'Greenhouse Key',desc:'The first time one of your Planted cards would run out of Plant counters each combat, leave it Planted with 1 counter instead.'},
 stormbattery:{t:'r',icon:'🔋',name:'Storm Battery',desc:'The first time you spend at least 2 Charge in one turn each combat, gain 1 Charge and draw 1 card.'},
 faultcompass:{t:'r',icon:'🧭',name:'Fault Compass',desc:'Once per turn, when you use a card effect to remove Block from an enemy without dealing damage, you may swap the top and bottom cards of your draw pile.'},
 cloudharness:{t:'r',icon:'☁️',name:'Cloud Harness',desc:'Once per combat, when you play a card that spends a Fly counter, refund 1 Fly counter after the card resolves.'},
 obsidiantablet:{t:'r',icon:'🗿',name:'Obsidian Tablet',desc:'On the first turn each combat that you enter with at least 8 Block carried through your reset, gain 1 AP and draw 1 card.'},
 hauntedbookmark:{t:'r',icon:'📖',name:'Haunted Bookmark',desc:'The first time an Ability card enters the Void after being played each combat, choose another card in your hand and give it Isekai if it can receive it.'},
 gildedcocoon:{t:'r',icon:'🦋',name:'Gilded Cocoon',desc:'Once per combat, at the start of your turn, you may Exile a card you Retained from the previous turn. If you do, gain 1 AP and draw 2 extra cards.'},
 locksmithskit:{t:'r',icon:'🔐',name:'Locksmith’s Kit',desc:'Once per combat, when an enemy adds a harmful status card to your deck, move that card to the Void for the rest of the combat and gain 5 Block.'},
 echochamber:{t:'r',icon:'📢',name:'Echo Chamber',desc:'The third time you play an attack card in one turn, apply Weakened 1 to one enemy hit by that card. Triggers once each turn.'},
 architectsblueprint:{t:'s',icon:'📐',name:'Architect’s Blueprint',desc:'Once per combat, you may satisfy 1 of a Construct’s required components with a temporary blank component. It has no attachment effect and disappears when detached.'},
 glassorrery:{t:'s',icon:'🔭',name:'Glass Orrery',desc:'Before your opening hand each combat, Scry 7. Choose one card still among those on top to start in your hand, then draw the remaining four cards normally.'},
 dragonstreasury:{t:'s',icon:'🐉',name:'Dragon’s Treasury',desc:'Once per combat, if you end a turn with at least 2 AP unspent, gain 2 additional AP on your next turn.'},
 funeraltithe:{t:'s',icon:'⚱️',name:'Funeral Tithe',desc:'The first three times each combat that a card enters the Void, gain 3 Block. On the third, also draw 2 cards.'},
 moltenheart:{t:'s',icon:'🌋',name:'Molten Heart',desc:'Once per combat, when a Burned enemy faints, transfer up to 6 of its remaining Burn stacks to a surviving enemy of your choice.'},
 secondbloom:{t:'s',icon:'🌸',name:'Second Bloom',desc:'Once per combat, when you use a Planted card’s Reap effect, immediately trigger that card’s Harvest effect afterward without removing a Plant counter.'},
 bastioncore:{t:'s',icon:'🏰',name:'Bastion Core',desc:'Once per combat, when an enemy hit would break your Block, spend all your current Block to absorb that hit completely. Any remaining hits in the attack resolve normally.'},
 loadedmirror:{t:'s',icon:'🪞',name:'Loaded Mirror',desc:'Once per combat after drawing your opening hand for a turn, you may discard any number of cards and draw that many replacements. This triggers discard effects and cannot draw the discarded cards back during that replacement draw.',act:1},
 oathkeepersring:{t:'s',icon:'💍',name:'Oathkeeper’s Ring',desc:'Once per combat, when a Ward prevents an enemy debuff from reaching your party, apply the prevented stacks to the enemy that inflicted them. This effect waits for a debuff even if an earlier Ward prevented a status card.'},
 chimeraemblem:{t:'s',icon:'🦁',name:'Chimera Emblem',desc:'At the start of combat, choose a type represented in your party. The first two cards you successfully play of that type each combat grant either 5 Block or 1 card draw. Choose the bonus separately for each card.'},
 crownofthefirstmove:{t:'l',icon:'👑',name:'Crown of the First Move',desc:'Your first three turns each combat start with 4 AP, 3 AP, and 2 AP, respectively, before other bonuses. The 4 AP opening also draws 1 extra card. From turn four onward, start with the usual 3 AP.'},
 eternalworkshop:{t:'l',icon:'🛠️',name:'Eternal Workshop',desc:'Once per turn, you may swap one component on an active Construct for an eligible card from your hand. The old component returns to your hand, and the new component’s attachment effect triggers.',act:1},
 phoenixledger:{t:'l',icon:'🐦‍🔥',name:'Phoenix Ledger',desc:'Once per combat, when a non-Ability card you played would Exile itself, return it to your hand at the start of your next turn instead. The next time you play it that combat, it goes to the Void after resolving.'},
 livingfortress:{t:'l',icon:'🏯',name:'Living Fortress',desc:'Keep up to 10 Block through every Block reset. On any turn you carry at least 8 Block through the reset this way, your first attack deals 8 extra damage to one target it hits. Use the highest applicable Block retention limit.'},
 witchseye:{t:'l',icon:'👁️',name:'The Witch’s Eye',desc:'Once per turn after drawing your opening hand, you may swap one card in your hand with the bottom card of your draw pile. The swapped-out card goes to the bottom without triggering discard effects.',act:1},
 moonlitcontract:{t:'l',icon:'🌙',name:'Moonlit Contract',desc:'At the start of each combat, choose one oath. Fulfill it once to gain 2 additional AP and draw 1 extra card on your next turn. Choose from playing three different Pokémon types in one turn, carrying at least 6 Block through a reset, or having a card return through Isekai.'},
 glassmenagerie:{t:'l',icon:'🫙',name:'Glass Menagerie',desc:'The first time each combat that a card’s Brittle effect resolves, return that card to your hand at the start of your next turn if it’s still in your discard pile or the Void. Its Brittle effect can trigger one more time that combat, then the card loses Brittle until combat ends.'},
 conductorsbaton:{t:'l',icon:'🪄',name:'Conductor’s Baton',desc:'The first time each turn you play three different Pokémon types in succession, the next card you play that turn costs 1 less AP if it’s a fourth distinct type. The first time you complete that four-type sequence each combat, also gain 8 Block and draw 2 cards.'}};
function twRelicRoll(r){const own=r.relics||[],left=Object.keys(TW_RELICS).filter(id=>!own.includes(id));if(!left.length)return null;const tiers=Object.keys(TW_TIERS).filter(t=>left.some(id=>TW_RELICS[id].t===t)).map(t=>({id:t,w:TW_TIERS[t][1]}));const t=pickWeighted(tiers).id,pool=left.filter(id=>TW_RELICS[id].t===t);return pool[Math.floor(Math.random()*pool.length)]}
const twRelicOk=r=>{if(r&&r.relics)r.relics=r.relics.filter(id=>twRelDef(id));return (r&&r.relics)||[]};
const twTierName=id=>TW_TIERS[twRelDef(id).t][0];
// ---------- Boss relics: a separate reward after a Boss room (never in regular rolls or the Merchant) ----------
const TW_BOSS_RELICS={
 overloadedbattery:{t:'b',icon:'🔋',name:'Overloaded Battery',up:'Gain 1 extra AP after every normal start-of-turn AP refresh, including turn one.',down:'Draw one fewer card as part of the normal start-of-turn draw. Draws from cards and other effects work as usual.'},
 sealedpurse:{t:'b',icon:'👛',name:'Sealed Purse',up:'Gain 1 extra AP after the normal start-of-turn AP refresh on turns 1, 3, 5, and so on.',down:'The base Ticket payout from future battle victories is zero. Event, challenge, and other bonus Tickets still work.'},
 glasscrown:{t:'b',icon:'💎',name:'Glass Crown',up:'Your Attack cards deal 30% more damage.',down:'On pickup, set your maximum team HP to 80% of its current value, rounded down to a minimum of 1, and cap your current HP at the new maximum.'}};
Object.values(TW_BOSS_RELICS).forEach(x=>x.desc=x.up+' '+x.down);
const twRelDef=id=>TW_RELICS[id]||TW_BOSS_RELICS[id];
function twBossRelicRoll(r){const own=r.relics||[];return shuffle(Object.keys(TW_BOSS_RELICS).filter(id=>!own.includes(id))).slice(0,3)}
const twBossText=X=>'<p class="tw-bup">✅ '+X.up+'</p><p class="tw-bdown">⚠️ '+X.down+'</p>';
function twBossRelicScreen(){const r=runOf(),o=r&&r.offer,st=$('dgStage');if(!o||!o.boss||o.bossDone||!st)return dcOfferScreen();
 st.innerHTML='<div class="dg-room tw-room dc-reward" style="background-image:url(./assets/tower/'+twEnvKey(r)+'.jpg)"><span class="dg-big">👑</span><h3>Boss Relic</h3><p class="small">Choose one, or skip. Each has a downside.</p><div class="tw-srel tw-boss">'+o.boss.map(id=>{const X=TW_BOSS_RELICS[id];return '<button class="tw-relic" onclick="twBossRelicInfo(\''+id+'\')"><span>'+X.icon+'</span><b>'+X.name+'</b><em class="tw-tier tr-b">Boss</em><small>✅ '+X.up+'<br>⚠️ '+X.down+'</small></button>'}).join('')+'</div><div class="actions"><button class="btn" onclick="twBossRelicPick(null)">SKIP</button></div></div>';$('dgPanel').innerHTML=''}
function twBossRelicInfo(id){const X=TW_BOSS_RELICS[id];if(!X)return;modal(X.icon+' '+X.name.toUpperCase(),'<p class="small tw-tier tr-b">Boss Relic</p>'+twBossText(X)+'<div class="actions"><button class="btn" onclick="closeModal()">BACK</button><button class="btn red" onclick="closeModal();twBossRelicPick(\''+id+'\')">TAKE</button></div>')}
function twBossRelicPick(id){const r=runOf(),o=r&&r.offer;if(!o||!o.boss||o.bossDone)return;if(id!=null&&!o.boss.includes(id))return;o.bossDone=1;if(id){twGainRelic(r,id);const X=TW_BOSS_RELICS[id];o.got=(o.got||[]).concat(X.icon+' Boss Relic: '+X.name);toast(X.icon+' '+X.name)}save();dcOfferScreen()}
function twGainRelic(r,id){r.relics=r.relics||[];if(r.relics.includes(id))return;r.relics.push(id);if(id==='glasscrown'){r.pmax=Math.max(1,Math.floor(r.pmax*DC_BR.crownHp));r.php=Math.min(r.php,r.pmax)}save()}
function twRelicStrip(r){const L=twRelicOk(r);return L.length?'<div class="dc-relics">'+L.map(id=>{const X=twRelDef(id);return '<button class="tr-'+X.t+(twRelicCan(r,id)?' act':'')+'" onclick="twRelicInfo(\''+id+'\')" title="'+esc(X.name+': '+X.desc)+'">'+X.icon+'</button>'}).join('')+'</div>':''}
function twRelicInfo(id){const x=twRelDef(id),r=runOf();if(!x)return;const can=twRelicCan(r,id);modal(x.icon+' '+x.name.toUpperCase(),'<p class="small tw-tier tr-'+x.t+'">'+twTierName(id)+(x.t==='b'?' Relic':'')+'</p>'+(x.t==='b'?twBossText(x):'<p>'+x.desc+'</p>')+'<div class="actions"><button class="btn" onclick="closeModal()">CLOSE</button>'+(x.act&&r&&r.dc?'<button class="btn red" onclick="closeModal();twRelicUse(\''+id+'\')"'+(can?'':' disabled')+'>USE</button>':'')+'</div>')}
// active relics, used from the relic strip during your turn
function twRelicCan(r,id){const dc=r&&r.dc,X=twRelDef(id);if(!dc||!X||!X.act||!dcRel(r,id)||dc.phase!=='player'||dc.pend||dc.post||dcLock)return false;dc.rel=dc.rel||{};dc.relT=dc.relT||{};
 if(id==='loadedmirror')return !dc.rel.mirror&&!dc.plays&&dc.hand.length>0;if(id==='witchseye')return !dc.relT.witch&&dc.hand.length>0&&dc.draw.length>0;
 if(id==='eternalworkshop')return !dc.relT.workshop&&dc.cons.some(k=>k.parts.length||k.blank)&&dc.hand.some(u=>{const i=dcInst(r,u);return i&&!dcDefOf(i.d).status});return false}
async function twRelicUse(id){const r=runOf(),dc=r&&r.dc;if(!twRelicCan(r,id))return;dcLock=true;try{
 if(id==='loadedmirror'){const c=await dcChooseCards('🪞 LOADED MIRROR: DISCARD ANY NUMBER, DRAW THAT MANY',dc.hand.slice(),1,99);if(!c||!c.length||r.dc!==dc)return;dc.rel.mirror=1;c.forEach(u=>{if(dc.hand.includes(u)){dc.hand=dc.hand.filter(x=>x!==u);dcDiscardU(r,u)}});dcDrawN(r,c.length)}
 else if(id==='witchseye'){const c=await dcChooseCards('👁️ THE WITCH’S EYE: SWAP WHICH CARD WITH THE BOTTOM CARD?',dc.hand.slice(),1,1);if(!c||!c.length||r.dc!==dc||!dc.draw.length)return;dc.relT.witch=1;const b=dc.draw.pop();dc.hand=dc.hand.filter(x=>x!==c[0]);dc.hand.push(b);dc.draw.push(c[0]);dcMsg('👁️ Swapped for '+dcDefOf(dcInst(r,b).d).name)}
 else if(id==='eternalworkshop'){const cs=dc.cons.filter(k=>k.parts.length||k.blank);let k=cs[0];if(cs.length>1){const j=await dcChooseOpt('🛠️ WHICH CONSTRUCT?',cs.map(x=>esc(dcDefOf(dcInst(r,x.u).d).name)));if(j==null)return;k=cs[j]}
  const opts=k.parts.map(u=>esc(dcDefOf(dcInst(r,u).d).name)).concat(k.blank?['📐 Blank']:[]);let j=0;if(opts.length>1){j=await dcChooseOpt('🛠️ SWAP OUT WHICH COMPONENT?',opts);if(j==null)return}
  const el=dc.hand.filter(u=>{const i=dcInst(r,u);return i&&!dcDefOf(i.d).status});const c=await dcChooseCards('🛠️ ATTACH WHICH CARD?',el,1,1);if(!c||!c.length||r.dc!==dc||!dc.cons.includes(k))return;dc.relT.workshop=1;
  if(j<k.parts.length){const old=k.parts[j];k.parts[j]=c[0];dc.hand.push(old)}else{k.blank=0;k.parts.push(c[0])}dc.hand=dc.hand.filter(x=>x!==c[0]);dcAttachFx(r,c[0])}
 save()}finally{dcLock=false}dcRender();if(dc.post)dcPost();else dcCheckEnd(r)}
// ---------- Merchant ----------
const twPrice=(r,p)=>Math.max(1,Math.round(p));
function twShopOpen(){const r=runOf(),R=r.room;if(!R.cards){const seen=new Set(),cards=[];for(let k=0;k<6&&cards.length<6;k++){dcRollOffer(r).forEach(c=>{const key=c.d+'|'+c.t;if(cards.length<6&&!seen.has(key)){seen.add(key);cards.push(c)}})}
  R.cards=cards.map(c=>({u:c.u,d:c.d,t:c.t,p:(DC_SIG[c.d]?11:7)+Math.floor(Math.random()*4),sold:0}));if(Math.random()<.45){const s=R.cards[Math.floor(Math.random()*R.cards.length)];s.sale=1;s.p=Math.ceil(s.p/2)}
  const picks=[];for(let k=0;k<12&&picks.length<3;k++){const id=twRelicRoll({relics:twRelicOk(r).concat(picks)});if(id&&!picks.includes(id))picks.push(id)}R.relics=picks.map(id=>{const pr=TW_TIERS[TW_RELICS[id].t][2];return {id,p:pr[0]+Math.floor(Math.random()*(pr[1]-pr[0]+1)),sold:0}});
  R.rm=10+Math.floor((r.floor||1)/2)+4*(r.removals||0);R.rmDone=0;save()}
 const st=$('dgStage'),T=r.tickets||0,card=c=>{const pr=twPrice(r,c.p);return '<div class="tw-sitem'+(c.sold?' sold':'')+'">'+dcCardHTML(r,c,'mini',' onclick="twShopCard(\''+c.u+'\')"')+'<b class="tw-price'+(c.sale?' sale':'')+(T<pr?' poor':'')+'">'+(c.sold?'SOLD':(c.sale?'<s>'+twPrice(r,c.p*2)+'</s> ':'')+pr+' 🎟️')+'</b></div>'};
 st.innerHTML='<div class="tw-shop"><div class="tw-shopscene" style="background-image:url(./assets/tower/shop_bg.jpg)"><img class="tw-merchant" id="twIsf" src="./assets/tower/isfrid_'+twIsf.expr+'.webp" alt="Madame Isfrid" onclick="twIsfTap()"><div class="tw-say" id="twSay">“'+esc(twIsf.line)+'”</div></div>'
  +'<div class="tw-shoppanel"><div class="tw-shoptop"><b>🎟️ '+T+' Tickets</b>'+twRelicStrip(r)+'</div><h4>Cards</h4><div class="tw-sgrid">'+R.cards.map(card).join('')+'</div>'
  +'<h4>Relics</h4><div class="tw-srel">'+R.relics.filter(x=>TW_RELICS[x.id]).map(x=>{const X=TW_RELICS[x.id],pr=twPrice(r,x.p);return '<button class="tw-relic'+(x.sold?' sold':'')+'" onclick="twShopRelic(\''+x.id+'\')"><span>'+X.icon+'</span><b>'+X.name+'</b><em class="tw-tier tr-'+X.t+'">'+twTierName(x.id)+'</em><small>'+X.desc+'</small><i class="tw-price'+(T<pr?' poor':'')+'">'+(x.sold?'SOLD':pr+' 🎟️')+'</i></button>'}).join('')+'</div>'
  +'<h4>Services</h4><button class="tw-remove'+(R.rmDone?' sold':'')+'" onclick="twShopRemove()"><span>🗑️</span><b>Card Removal Service</b><small>Remove a card from your deck. Once per visit.</small><i class="tw-price'+(T<twPrice(r,R.rm)?' poor':'')+'">'+(R.rmDone?'DONE':twPrice(r,R.rm)+' 🎟️')+'</i></button>'
  +'<div class="actions"><button class="btn red" onclick="twShopLeave()">LEAVE SHOP</button></div></div></div>';$('dgPanel').innerHTML='';
 if(!R.greeted){R.greeted=1;save();twIsfSay(db.isfridMet?twPick(TW_ISF.greet):TW_ISF.greet1[0],'neutral',0);db.isfridMet=1;save()}}
// ---------- Madame Isfrid: expressions + lines ----------
const TW_ISF={greet1:['Madame Isfrid, at your service.'],greet:['Welcome back, spooks.'],leave:['Ta ta, spooks.','See you soon.','Have fun out there!'],
 buy:['Ooh, a fine choice~','Pleasure doing business, spooks.','Treat it well~'],big:['Now that’s what I like to see~','Oh my, a big spender.'],remove:['Snip! Gone without a trace~'],
 poor:['You’re a little short, spooks…','Tickets first, darling.'],tap:['Hmm? Something catch your eye?','Browse all you like, spooks.','Everything here is one of a kind~'],annoyed:['I’m not for sale, spooks…']};
let twIsf={expr:'neutral',line:'',timer:null,taps:[]};
const twPick=a=>a[Math.floor(Math.random()*a.length)];
function twIsfSay(line,expr,ms){twIsf.expr=expr||'neutral';twIsf.line=line;clearTimeout(twIsf.timer);const img=$('twIsf'),say=$('twSay');if(img)img.src='./assets/tower/isfrid_'+twIsf.expr+'.webp';if(say){say.textContent='“'+line+'”';say.classList.remove('pop');void say.offsetWidth;say.classList.add('pop')}
 if(ms!==0&&twIsf.expr!=='neutral')twIsf.timer=setTimeout(()=>{twIsf.expr='neutral';const i=$('twIsf');if(i)i.src='./assets/tower/isfrid_neutral.webp'},ms||2600)}
function twIsfTap(){const now=Date.now();twIsf.taps=twIsf.taps.filter(t=>now-t<4000);twIsf.taps.push(now);if(twIsf.taps.length>=5){twIsf.taps=[];twIsfSay(TW_ISF.annoyed[0],'sigh')}else twIsfSay(twPick(TW_ISF.tap),Math.random()<.5?'pleased':'neutral')}
function twIsfBuy(pr){twIsfSay(pr>=15?twPick(TW_ISF.big):twPick(TW_ISF.buy),pr>=15?'content':'pleased')}
function twShopLeave(){const st=$('dgStage');if(st)st.querySelectorAll('.tw-shoppanel button').forEach(b=>b.disabled=true);twIsfSay(twPick(TW_ISF.leave),'pleased',0);setTimeout(()=>{twIsf.expr='neutral';twRoomDone()},dcRM()?150:1300)}
function twShopCard(u){const r=runOf(),R=r.room,c=R&&R.cards.find(x=>x.u===u);if(!c)return;const pr=twPrice(r,c.p);modal(esc(dcDefOf(c.d).name).toUpperCase(),'<div class="dc-zoom">'+dcCardHTML(r,c,'big')+'</div><p class="small">'+dcTypeLbl(c)+' card'+(c.sale?' · ON SALE':'')+'</p><div class="actions"><button class="btn" onclick="closeModal()">BACK</button><button class="btn red" onclick="closeModal();twBuyCard(\''+u+'\')"'+(c.sold?' disabled':'')+'>'+(c.sold?'SOLD':'BUY · '+pr+' 🎟️')+'</button></div>')}
function twBuyCard(u){const r=runOf(),c=r.room.cards.find(x=>x.u===u),pr=twPrice(r,c.p);if(c.sold)return;if((r.tickets||0)<pr){twIsfSay(twPick(TW_ISF.poor),'sigh');return}r.tickets-=pr;c.sold=1;r.deck.push({u:c.u,d:c.d,t:c.t});save();toast('🃏 '+dcDefOf(c.d).name+' added to your deck');twShopOpen();twIsfBuy(pr)}
function twShopRelic(id){const r=runOf(),x=r.room.relics.find(z=>z.id===id),X=TW_RELICS[id],pr=twPrice(r,x.p);if(x.sold)return;modal(X.icon+' '+X.name.toUpperCase(),'<p class="small tw-tier tr-'+X.t+'">'+twTierName(id)+'</p><p>'+X.desc+'</p><div class="actions"><button class="btn" onclick="closeModal()">BACK</button><button class="btn red" onclick="closeModal();twBuyRelic(\''+id+'\')">BUY · '+pr+' 🎟️</button></div>')}
function twBuyRelic(id){const r=runOf(),x=r.room.relics.find(z=>z.id===id),pr=twPrice(r,x.p);if(x.sold)return;if((r.tickets||0)<pr){twIsfSay(twPick(TW_ISF.poor),'sigh');return}r.tickets-=pr;x.sold=1;twGainRelic(r,id);toast(TW_RELICS[id].icon+' '+TW_RELICS[id].name);twShopOpen();twIsfBuy(pr)}
async function twShopRemove(){const r=runOf(),R=r.room,pr=twPrice(r,R.rm);if(R.rmDone)return;if((r.tickets||0)<pr){twIsfSay(twPick(TW_ISF.poor),'sigh');return}if(await twRemoveFlow('REMOVE WHICH CARD? ('+pr+' 🎟️)')){r.tickets-=pr;R.rmDone=1;r.removals=(r.removals||0)+1;save();twShopOpen();twIsfSay(TW_ISF.remove[0],pr>=15?'content':'pleased')}}
