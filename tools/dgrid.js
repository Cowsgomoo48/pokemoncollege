// ===================== MYSTERY DUNGEON · grid floors =====================
// Mystery Dungeon is played on tile floors: rooms joined by corridors, stairs down, items on the ground and wild Pokémon in
// the rooms. On your turn, every Pokémon may move once (up to its move range, set by its species' Speed) and then act once
// (Fight, Item or Guard). Only actions ask a study question. Moves have reach and shapes, so where you stand matters.
// Every few floors a boss guards the stairs. This file replaces the old room map: functions with the same names as in the
// battle code above (dgOpen, dgDrawBattle, dgAfterAction, dgEnemyPhase…) take over from those versions.
const GD_T=40,GD_DEPTH={easy:3,balanced:4,hard:5},GD_SIZE={easy:[22,20,6],balanced:[26,24,7],hard:[28,26,8]};
const GD_THEMES=[
 {name:'Grassy Plains',f1:'#d6e4a2',f2:'#cbdb94',w1:'#6e9a44',w2:'#5b8637',e:'#3f6229',g:'#a9c46f'},
 {name:'Rocky Cave',f1:'#cdb898',f2:'#c0aa89',w1:'#7a6650',w2:'#675442',e:'#463a2d',g:'#a8916f'},
 {name:'Frosty Grotto',f1:'#dcebf3',f2:'#cfe2ed',w1:'#7aa3c1',w2:'#668faf',e:'#46698a',g:'#b2cfe2'},
 {name:'Ember Caverns',f1:'#e3b893',f2:'#d8aa84',w1:'#8a3f2c',w2:'#753423',e:'#52231a',g:'#c78f68'},
 {name:'Crystal Depths',f1:'#d8cfea',f2:'#ccc0e2',w1:'#6a58a0',w2:'#58498b',e:'#3c3166',g:'#b4a6d6'}];
const GD_DIRS=[[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]]; // sprite-sheet rows: S SE E NE N NW W SW
const GD_SPECIAL={shop:{icon:'🛒',name:'Kecleon Shop'},chest:{icon:'💎',name:'Treasure Chest'},spring:{icon:'⛲',name:'Healing Spring'}};
function gdDirOf(dx,dy){const i=GD_DIRS.findIndex(d=>d[0]===Math.sign(dx)&&d[1]===Math.sign(dy));return i<0?0:i}
function gdMV(species){const s=((SPECIES_DATA[species]||{}).stats||[0,0,0,0,0,60])[5];return s<50?2:s<80?3:s<110?4:5}
function gdTheme(r){return mdTheme(r)}
function gdIsBossFloor(r){return r.floor!==14&&(r.floor+1)%(GD_DEPTH[r.diff]||3)===0||mdIsLast(r)}
function gdTile(fl,x,y){return x<0||y<0||x>=fl.w||y>=fl.h?0:fl.ob&&fl.ob[y*fl.w+x]==='1'?0:fl.ffOn&&fl.ffOn[y*fl.w+x]==='1'?0:+fl.tiles[y][x]}
function gdInRect(p,o){return p.x>=o[0]&&p.x<o[0]+o[2]&&p.y>=o[1]&&p.y<o[1]+o[3]}
const gdKey=(x,y)=>x+','+y,gdCheb=(a,b)=>Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y));
// ---------- floor generation ----------
function gdNewFloor(r){mdPlan(r);const [W,H,NR]=GD_SIZE[r.diff]||GD_SIZE.easy,g=Array.from({length:H},()=>Array(W).fill(0)),rooms=[],rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
 // boss floors: one big room toward the far (right) side for the boss arena
 let big=null;if(gdIsBossFloor(r)){for(let t=0;t<60&&!big;t++){const w=Math.min(W-6,rnd(9,12)),h=Math.min(H-6,rnd(7,9)),x=W-w-2-rnd(0,2),y=rnd(1,H-h-2);if(x>6)big=[x,y,w,h]}if(big)rooms.push(big)}
 for(let t=0;t<400&&rooms.length<NR;t++){const w=rnd(4,7),h=rnd(4,6),x=rnd(1,W-w-2),y=rnd(1,H-h-2);if(rooms.some(o=>x<o[0]+o[2]+2&&o[0]<x+w+2&&y<o[1]+o[3]+2&&o[1]<y+h+2))continue;rooms.push([x,y,w,h])}
 rooms.sort((a,b)=>a[0]-b[0]);rooms.forEach(([x,y,w,h])=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)g[j][i]=1});
 const ctr=o=>[o[0]+(o[2]>>1),o[1]+(o[3]>>1)],dig=(a,b)=>{let [x,y]=a;const [tx,ty]=b,set=()=>{if(!g[y][x])g[y][x]=2};const hf=Math.random()<.5;
  if(hf){while(x!==tx){x+=Math.sign(tx-x);set()}while(y!==ty){y+=Math.sign(ty-y);set()}}else{while(y!==ty){y+=Math.sign(ty-y);set()}while(x!==tx){x+=Math.sign(tx-x);set()}}};
 for(let i=0;i<rooms.length-1;i++)dig(ctr(rooms[i]),ctr(rooms[i+1]));for(let k=0;k<2&&rooms.length>3;k++){const a=rnd(0,rooms.length-1),b=rnd(0,rooms.length-1);if(Math.abs(a-b)>1)dig(ctr(rooms[a]),ctr(rooms[b]))}
 const tiles=g.map(row=>row.join('')),fl={w:W,h:H,tiles,rooms,items:[],specials:[],seen:'0'.repeat(W*H),boss:gdIsBossFloor(r),stairsHidden:false,id:uid()};
 // the farthest room (by walking distance) holds the stairs, and the boss on a boss floor
 const dist=gdBFS(fl,ctr(rooms[0]),()=>false,999),far0=rooms.map((o,i)=>[i,(dist.get(gdKey(...ctr(o)))||{d:0}).d]).sort((a,b)=>b[1]-a[1])[0][0],bi=big?rooms.indexOf(big):-1,far=fl.boss&&bi>0&&dist.has(gdKey(...ctr(big)))?bi:far0;fl.stairs=ctr(rooms[far]);fl.stairsHidden=fl.boss;
 const free=o=>{const out=[];for(let j=o[1];j<o[1]+o[3];j++)for(let i=o[0];i<o[0]+o[2];i++)out.push([i,j]);return shuffle(out)},taken=new Set([gdKey(...fl.stairs)]);
 const takeIn=o=>{for(const t of free(o))if(!taken.has(gdKey(...t))){taken.add(gdKey(...t));return t}return null};
 // your team starts together in the first room
 const s0=ctr(rooms[0]),spots=[[0,0],[1,0],[0,1],[1,1],[-1,0],[0,-1]].map(([dx,dy])=>[s0[0]+dx,s0[1]+dy]).filter(([x,y])=>gdTile(fl,x,y)===1);
 r.party.forEach((m,i)=>{const p=spots[i]||takeIn(rooms[0]);m.x=p[0];m.y=p[1];m.dir=0;m.moved=false;m.acted=false;taken.add(gdKey(m.x,m.y));delete m.hurt;delete m.hurtR;delete m.koR});
 // this sublayer's obstacles and hazards; nothing else spawns on them or anywhere they wall off
 mdDress(r,fl,taken);if(fl.ob)for(let k=0;k<fl.ob.length;k++)if(fl.ob[k]==='1')taken.add(gdKey(k%W,Math.floor(k/W)));if(fl.hz)Object.keys(fl.hz).forEach(k=>taken.add(k));
 {const rch=gdBFS(fl,s0,()=>false,999);rooms.forEach(o=>{for(let j=o[1];j<o[1]+o[3];j++)for(let i=o[0];i<o[0]+o[2];i++)if(!rch.has(gdKey(i,j)))taken.add(gdKey(i,j))})}
 // wild Pokémon
 const D=DIFF[r.diff],seg=Math.floor(r.floor/(GD_DEPTH[r.diff]||3)),inSeg=r.floor%(GD_DEPTH[r.diff]||3),bump=(dgGamey(r)?seg*(D.step||2):0)+inSeg,avg=partyAvgLv()+bump,cap=avg+D.cap;
 const spread=(mid,sd,lo,hi)=>{const z=(Math.random()+Math.random()+Math.random()-1.5)*2;return Math.max(1,Math.min(hi,Math.max(lo,Math.round(mid+z*sd))))},sd=r.diff==='hard'?3.5:r.diff==='easy'?2.5:3,en=[];
 const put=(e,o)=>{const t=takeIn(o);if(!t)return;e.x=t[0];e.y=t[1];e.dir=0;e.mv=gdMV(e.species);en.push(e)};
 rooms.forEach((o,i)=>{if(!i)return;
  if(i===far&&fl.boss){const kind=r.diff==='easy'?'boss':Math.random()<.4?(r.diff==='hard'&&Math.random()<.5?'alpha':'totem'):'boss',evolved=MONS.filter(m=>PRE_EVO[m[0]]&&m[2]>=1),sp=kind==='boss'?mdSp(2,4):evolved[Math.floor(Math.random()*evolved.length)][0];
   const b=makeEnemy(sp,cap+rnd(0,2),{hpMul:D.bh*(kind==='totem'?.85:kind==='alpha'?1.2:1),atkMul:kind==='alpha'?1.3:1.2,boss:kind,twice:kind==='alpha'});taken.delete(gdKey(...fl.stairs));b.x=fl.stairs[0];b.y=fl.stairs[1];b.dir=0;b.mv=gdMV(sp);b.aware=1;en.push(b);taken.add(gdKey(b.x,b.y));
   if(kind==='totem'){const pre=PRE_EVO[sp]||sp;for(let k=0;k<rnd(2,3);k++)put(makeEnemy(pre,spread(avg-2,2,avg-6,avg+1),{hpMul:.8}),o)}else put(makeEnemy(mdSp(0,2),spread(avg,sd,avg-4,cap)),o);
   // everything in the boss room waits, idle, until your whole team is inside
   fl.bossRoom=o.slice();en.forEach(e=>{if(gdInRect(e,o)){e.aware=0;e.dormant=1}});return}
  if(i>1&&Math.random()<.14){const sp=mdSp(0,0);for(let k=0;k<rnd(4,6);k++){const e=makeEnemy(sp,spread(avg-6,2,avg-10,avg-3),{hpMul:.7,atkMul:.75});e.swarm=1;put(e,o)}return}
  if(Math.random()<.62){const n=rnd(1,r.diff==='hard'?3:2);for(let k=0;k<n;k++)put(makeEnemy(mdSp(0,2),spread(avg+(cap-avg)*.4,sd,avg-6,cap+3),{hpMul:1.15}),o)}});
 dgFoeScale(r,en);
 // items lying on the ground, and special spots
 const mid=rooms.map((o,i)=>i).filter(i=>i&&i!==far),nIt=rnd(2,4)+(mdFx(r).items||0);for(let k=0;k<nIt;k++){const o=rooms[rnd(0,rooms.length-1)],t=takeIn(o);if(!t)continue;
  if(Math.random()<.35)fl.items.push({x:t[0],y:t[1],tickets:mdTix(rnd(3,8)+inSeg)});else{const pool=Object.keys(DITEMS).filter(id=>!DITEMS[id].mdOnly&&(id!=='snag'||Math.random()<.15)).map(id=>({id,w:DITEM_TIER_W[DITEMS[id].tier||0]}));fl.items.push({x:t[0],y:t[1],k:pickWeighted(pool).id})}}
 const sp2=[['chest',.65],['spring',.35],['shop',.35]];for(const [k,p] of sp2){if(Math.random()>p||!mid.length)continue;const t=takeIn(rooms[mid[rnd(0,mid.length-1)]]);if(t)fl.specials.push({x:t[0],y:t[1],k})}
 mdPlaceDigs(r,fl,takeIn,rooms);if(Math.random()<MD_PER.forager*mdLvOf(r,'forager')){const k=twItem(0);r.bag[k]=(r.bag[k]||0)+1;setTimeout(()=>toast('🎒 Forager: you found '+DITEMS[k].icon+' '+DITEMS[k].name+'!'),900)}
 r.fl=fl;r.battle={kind:'floor',enemies:en,turn:0,round:1,overclock:0,skip:false,guard:{},done:false,enemyPhase:false,diy:fl.boss||Math.random()<.5};gdSee(r);if(DG){DG.gmode='select';DG.msg=''}if(r.floor===14&&!r.ocManaphyCleared)ocAttach(r)}
// breadth-first search over walkable tiles; blocked(x,y) says a tile can't be entered
function gdBFS(fl,start,blocked,max){const q=[[start[0],start[1]]],seen=new Map([[gdKey(...start),{d:0,prev:null}]]);
 while(q.length){const [x,y]=q.shift(),cur=seen.get(gdKey(x,y));if(cur.d>=max)continue;
  for(const [dx,dy] of GD_DIRS){const nx=x+dx,ny=y+dy,k=gdKey(nx,ny);if(seen.has(k)||!gdTile(fl,nx,ny))continue;if(dx&&dy&&(!gdTile(fl,x+dx,y)||!gdTile(fl,x,y+dy)))continue;if(blocked(nx,ny))continue;seen.set(k,{d:cur.d+1,prev:gdKey(x,y)});q.push([nx,ny])}}
 return seen}
function gdPath(reach,k){const out=[];while(k){out.unshift(k.split(',').map(Number));k=reach.get(k).prev}return out}
function gdAliveFoes(b){return b.enemies.map((e,i)=>[e,i]).filter(([e])=>(e.hp>0||e.gdOut)&&!e.done)}
function gdUnitAt(r,x,y){const b=r.battle;const ai=r.party.findIndex(m=>m.x===x&&m.y===y);if(ai>=0)return {side:'ally',i:ai};const fi=b.enemies.findIndex(e=>(e.hp>0||e.gdOut)&&!e.diving&&!e.done&&e.x===x&&e.y===y);return fi>=0?{side:'foe',i:fi}:null}
// ---------- what you can see ----------
function gdRoomOf(fl,x,y){return fl.rooms.findIndex(o=>x>=o[0]&&x<o[0]+o[2]&&y>=o[1]&&y<o[1]+o[3])}
function gdLit(r){if(r.fl.oc==='arena')return new Set(r.fl.tiles.flatMap((row,y)=>[...row].map((v,x)=>v!=='0'?gdKey(x,y):null).filter(Boolean)));const fl=r.fl,L=new Set();r.party.forEach(m=>{const ri=gdRoomOf(fl,m.x,m.y);if(ri>=0&&!mdFx(r).dark){const o=fl.rooms[ri];for(let j=o[1]-1;j<=o[1]+o[3];j++)for(let i=o[0]-1;i<=o[0]+o[2];i++)L.add(gdKey(i,j))}
  const lr=mdFx(r).dark?2+mdLvOf(r,'light'):2;for(let dy=-lr;dy<=lr;dy++)for(let dx=-lr;dx<=lr;dx++)L.add(gdKey(m.x+dx,m.y+dy))});return L}
function gdSee(r){const fl=r.fl,L=gdLit(r),s=fl.seen.split('');L.forEach(k=>{const [x,y]=k.split(',').map(Number);if(x>=0&&y>=0&&x<fl.w&&y<fl.h)s[y*fl.w+x]='1'});fl.seen=s.join('');
 // wild Pokémon that can see your team wake up and start hunting
 r.battle.enemies.forEach(e=>{if(!e.aware&&!e.dormant&&e.hp>0&&L.has(gdKey(e.x,e.y))&&r.party.some(m=>gdCheb(m,e)<=5))e.aware=1});return L}
// ---------- move shapes ----------
// adjacent: the 8 tiles around you · line: the first foe in a straight line · beam: every foe in the line · area: every foe within reach
function gdShape(name,mv){const cat=moveCat(mv)||'P';if(MOVE_SPREAD.has(name))return {k:'area',r:2,label:'All foes within 2'};if(mv[3]==='fast')return cat==='S'?{k:'line',r:3,label:'Line · 3'}:{k:'adj',r:1,label:'Next to you'};
 if(cat==='P')return {k:'line',r:2,label:'Lunge · 2'};return /beam|pump|thrower|bolt|pulse|cannon|blast|laser|ray|hurricane|thunder$/i.test(name)?{k:'beam',r:5,label:'Beam · 5, pierces'}:{k:'line',r:4,label:'Line · 4'}}
// options = [{key:target index, hits:[indices]}] for a user at (ux,uy) against a list of [unit, index] targets
function gdOptions(fl,ux,uy,shape,targets){const at=new Map(targets.map(([u,i])=>[gdKey(u.x,u.y),i])),out=[];
 if(shape.k==='area'){const hits=targets.filter(([u])=>gdCheb(u,{x:ux,y:uy})<=shape.r).map(([,i])=>i);return hits.length?[{key:hits[0],hits,all:true}]:[]}
 if(shape.k==='adj'){targets.forEach(([u,i])=>{if(gdCheb(u,{x:ux,y:uy})===1)out.push({key:i,hits:[i]})});return out}
 for(const [dx,dy] of GD_DIRS){let x=ux,y=uy;const line=[];for(let s=1;s<=shape.r;s++){x+=dx;y+=dy;if(!gdTile(fl,x,y))break;const i=at.get(gdKey(x,y));if(i!=null){line.push(i);if(shape.k==='line')break}}
  if(!line.length)continue;if(shape.k==='line')out.push({key:line[0],hits:[line[0]]});else line.forEach(i=>out.push({key:i,hits:line}))}
 return out}
function gdFoeTargets(r){const L=gdLit(r);return gdAliveFoes(r.battle).filter(([e])=>e.hp>0&&!e.diving&&!e.dormant&&L.has(gdKey(e.x,e.y)))}
// ---------- drawing ----------
function gdTilesCanvas(r){const fl=r.fl,th=gdTheme(r),T=GD_T;if(DG&&DG.tilesFor===fl.id&&DG.tiles)return DG.tiles;const c=document.createElement('canvas');c.width=fl.w*T;c.height=fl.h*T;const g=c.getContext('2d');
 let seed=7;const rr=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
 for(let y=0;y<fl.h;y++)for(let x=0;x<fl.w;x++){const t=+fl.tiles[y][x],X=x*T,Y=y*T;
  if(t){g.fillStyle=(x+y)%2?th.f1:th.f2;g.fillRect(X,Y,T,T);if(rr()<.25){g.fillStyle=th.g;g.fillRect(X+4+rr()*26,Y+4+rr()*26,4,3)}}
  else{g.fillStyle=th.w1;g.fillRect(X,Y,T,T);g.fillStyle=th.w2;g.fillRect(X+2,Y+2,T-4,T-4);if(rr()<.3){g.fillStyle=th.e;g.fillRect(X+8+rr()*20,Y+8+rr()*20,6,6)}
   // edge shading where a wall meets a floor tile, so walls read as raised
   if(+((fl.tiles[y+1]||'')[x]||0)){g.fillStyle=th.e;g.fillRect(X,Y+T-7,T,7)}}}
 mdDecorate(g,r,fl,th);if(DG){DG.tiles=c;DG.tilesFor=fl.id}return c}
function gdDrawBattle(entering){const r=runOf(),b=r&&r.battle,st=$('dgStage');if(!b||!st||!r.fl)return;const fl=r.fl,T=GD_T,L=gdSee(r),th=gdTheme(r);
 let field=st.querySelector('.gd-field');if(!field||entering){st.innerHTML='<div class="dg-field gd-field"><div class="gd-map"><canvas class="gd-tiles"></canvas><div class="gd-objs"></div><canvas class="gd-fog"></canvas><div class="gd-hl"></div><div class="gd-units"></div></div><canvas class="gd-mini"></canvas><div class="gd-envslot"></div><div class="gd-floor"></div><div class="gd-stones" role="group" aria-label="Stones carried in this dungeon run"></div></div>';field=st.querySelector('.gd-field');field.addEventListener('click',gdTap);
  const mp=field.querySelector('.gd-map');mp.style.width=fl.w*T+'px';mp.style.height=fl.h*T+'px';const tc=field.querySelector('.gd-tiles');tc.width=fl.w*T;tc.height=fl.h*T;tc.getContext('2d').drawImage(gdTilesCanvas(r),0,0)}
 let tk=field.querySelector('.dg-ticker');if(DG&&DG.msg){if(!tk){tk=document.createElement('div');tk.className='dg-ticker';field.appendChild(tk)}tk.innerHTML=DG.msg}else if(tk)tk.remove();
 field.querySelector('.gd-floor').innerHTML='B'+(r.floor+1)+'F · '+th.name+(fl.boss?' · 👑':'');field.querySelector('.gd-envslot').innerHTML=mdEnvBtn(r);field.style.background=mdShade(th.w2,.45);field.querySelector('.gd-stones').innerHTML=mdStonesHTML(r);
 // fog: black where you've never been, dim where you can't see right now
 const fc=field.querySelector('.gd-fog');fc.width=fl.w*T;fc.height=fl.h*T;const fg=fc.getContext('2d');for(let y=0;y<fl.h;y++)for(let x=0;x<fl.w;x++){const seen=fl.seen[y*fl.w+x]==='1';if(!seen){fg.fillStyle='#05070d';fg.fillRect(x*T,y*T,T,T)}else if(!L.has(gdKey(x,y))){fg.fillStyle='rgba(5,7,13,.45)';fg.fillRect(x*T,y*T,T,T)}}
 const vis=(x,y)=>L.has(gdKey(x,y)),seenAt=(x,y)=>fl.seen[y*fl.w+x]==='1';
 field.querySelector('.gd-objs').innerHTML=(!fl.stairsHidden&&seenAt(...fl.stairs)?'<div class="gd-obj stairs" style="left:'+fl.stairs[0]*T+'px;top:'+fl.stairs[1]*T+'px">🪜</div>':'')
  +fl.items.filter(it=>seenAt(it.x,it.y)).map(it=>'<div class="gd-obj" style="left:'+it.x*T+'px;top:'+it.y*T+'px">'+(it.tickets?'🎟️':DITEMS[it.k].icon)+'</div>').join('')
  +fl.specials.filter(s=>seenAt(s.x,s.y)).map(s=>'<div class="gd-obj sp'+(GD_LOCKED[s.k]&&!gdFree(r)?' gd-off':'')+'" style="left:'+s.x*T+'px;top:'+s.y*T+'px">'+(s.k==='shop'?'🎩':GD_SPECIAL[s.k].icon)+'</div>').join('')+mdDigHTML(r,fl,T,seenAt)+(fl.ffOn&&fl.ff?fl.ff.map(k=>{const [x,y]=k.split(',').map(Number);return '<div class="gd-obj gd-ff" style="left:'+x*T+'px;top:'+y*T+'px"></div>'}).join(''):'');
 // units (sprites keep their element between redraws so animations and effects stay smooth)
 const U=field.querySelector('.gd-units'),want=new Set();
 const unit=(cls,i,x,y,sp,row,hpPct,extra,color,anim)=>{const id=cls+i;want.add(id);let el=U.querySelector('[data-u="'+id+'"]');if(!el){el=document.createElement('div');el.dataset.u=id;el.innerHTML='<div class="gd-hp"><i></i></div><div class="dg-spr" data-sp="'+esc(sp)+'" data-row="'+row+'" data-sz="'+(extra.includes('big')?1:.82)+'"></div><b class="dg-xh"></b>';U.appendChild(el)}
  el.className='gd-u '+cls+' '+extra;el.dataset.i=i;el.style.left=x*T+'px';el.style.top=y*T+'px';el.style.zIndex=10+y;if(color)el.style.setProperty('--c',color);const s=el.querySelector('.dg-spr');if(+s.dataset.row!==row){s.dataset.row=row;s.classList.remove('ok')}if((s.dataset.anim||'')!==(anim||'')){s.dataset.anim=anim||'';s.classList.remove('ok')}
  const hp=el.querySelector('.gd-hp i');hp.style.width=Math.max(0,Math.min(100,hpPct))+'%';hp.className=hpPct<=20?'low':hpPct<=50?'mid':''};
 const now=Date.now();
 r.party.forEach((m,i)=>{const c=combatant(partyMon(m));if(m.hp>0)delete m.koAt;else if(!m.koAt){m.koAt=now;gdKoFx('dg-ally'+i,false)}const ko=m.hp>0?0:now-m.koAt;unit('dg-ally',i,m.x,m.y,partyMon(m).species,m.dir||0,m.hp/c.hp*100,(m.hp<=0?'ko ':'')+(m.hp<=0&&ko<700?'gd-stagger ':'')+(b.turn===i&&!b.enemyPhase?'active ':'')+(m.acted?'done ':'')+(b.guard[i]?'guard ':''),SLOT_COLORS[i],m.hp<=0&&ko>=600?'Sleep':'')});
 // a fainted foe staggers, falls asleep and fades out instead of vanishing
 b.enemies.forEach((e,i)=>{if(e.ocBoss&&e.diving)return;if(e.ocBoss&&e.hp<=0){if(!e.done)unit('dg-foe',i,e.x,e.y,e.species,e.dir||0,0,'big oc-rest',null,'Sleep');return}const dead=e.hp<=0&&!e.gdOut;if(dead&&!e.koAt&&!e.done){e.koAt=now;gdKoFx('dg-foe'+i,true)}if(dead?!(e.koAt&&now-e.koAt<1500):e.done)return;if(!vis(e.x,e.y))return;
  unit('dg-foe',i,e.x,e.y,e.species,e.dir||0,dead?0:(e.gdOut?e.gdHp:e.hp)/e.maxhp*100,(e.boss?'big ':'')+(e.ocBoss&&e.pending?.some(p=>p.kind==='beam')?'oc-charge ':'')+(e.aware||dead?'':e.dormant?'gd-idle ':'asleep ')+(dead?'gd-faint ':''),null,dead&&now-e.koAt>=600?'Sleep':'')});
 U.querySelectorAll('.gd-u').forEach(el=>{if(!want.has(el.dataset.u))el.remove()});dgFillSprites();
 if(gdBossSeal(r)){gdDrawBattle();return}
 if(DG){const free=gdFree(r);if(DG.wasFree===true&&!free)mdBattleStart(r);if(DG.wasFree===false&&free)mdBattleEnd(r);DG.bcam=free?null:gdBattleCam(r);DG.wasFree=free}
 if(entering)gdFit();gdHighlight();gdMini(r,L);if(entering||DG&&DG.follow!==false)gdCamera();else gdOverlap();gdOverlays();setTimeout(gdOverlays,340);ocDecor(r);
 if(DG&&DG.busy&&!b.enemyPhase)$('dgPanel').innerHTML='<div class="dg-msg">…</div>';else dgPanelBattle()}
// fit the dungeon between the page header and the bottom dock, so the action buttons are never hidden
function gdFit(){const dg=document.querySelector('.dg.gd');if(!dg)return;const dock=document.querySelector('nav.dock'),top=dg.getBoundingClientRect().top,db_=dock&&dock.getBoundingClientRect(),bot=db_&&db_.height&&db_.top>top?db_.top:innerHeight;dg.style.minHeight='0';dg.style.height=Math.max(400,Math.round(bot-top-6))+'px'}
addEventListener('resize',()=>{if(document.querySelector('.dg.gd')){gdFit();gdCamera()}});
function gdMini(r,L){const fl=r.fl,c=document.querySelector('.gd-mini');if(!c)return;const s=4;c.width=fl.w*s;c.height=fl.h*s;const g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);
 for(let y=0;y<fl.h;y++)for(let x=0;x<fl.w;x++)if(fl.seen[y*fl.w+x]==='1'&&gdTile(fl,x,y)){g.fillStyle=L.has(gdKey(x,y))?'#ffffffcc':'#ffffff66';g.fillRect(x*s,y*s,s,s)}
 const sc=mdLvOf(r,'scout');if(sc>=2)(fl.digs||[]).forEach(d=>{if(d.done<d.max){g.fillStyle='#ffe066';g.fillRect(d.x*s,d.y*s,s,s)}});if(sc>=3)fl.items.forEach(it=>{g.fillStyle='#ffd34d';g.fillRect(it.x*s,it.y*s,s,s)});
 if(!fl.stairsHidden&&(sc>=1||fl.seen[fl.stairs[1]*fl.w+fl.stairs[0]]==='1')){g.fillStyle='#4aa3ff';g.fillRect(fl.stairs[0]*s-1,fl.stairs[1]*s-1,s+2,s+2)}
 fl.items.forEach(it=>{if(fl.seen[it.y*fl.w+it.x]==='1'){g.fillStyle='#ffd34d';g.fillRect(it.x*s,it.y*s,s,s)}});
 r.battle.enemies.forEach(e=>{if(e.hp>0&&!e.done&&L.has(gdKey(e.x,e.y))){g.fillStyle='#ff4d4d';g.fillRect(e.x*s,e.y*s,s,s)}});
 r.party.forEach((m,i)=>{g.fillStyle=SLOT_COLORS[i];g.fillRect(m.x*s-1,m.y*s-1,s+2,s+2)})}
function gdCamera(x,y){const r=runOf(),f=document.querySelector('.gd-field'),mp=f&&f.querySelector('.gd-map');if(!mp)return;const b=r.battle,m=r.party[b.turn]||r.party[0];let sc=1;if(x==null&&DG&&DG.bcam){[x,y,sc]=DG.bcam;sc=sc||1}x=x??m.x;y=y??m.y;
 const W=f.clientWidth,H=f.clientHeight,T=GD_T*sc,mw=r.fl.w*T,mh=r.fl.h*T;let tx=W/2-(x+.5)*T,ty=H/2-(y+.5)*T;tx=Math.min(0,Math.max(W-mw,tx));ty=Math.min(0,Math.max(H-mh,ty));if(mw<W)tx=(W-mw)/2;if(mh<H)ty=(H-mh)/2;mp.style.transform='translate('+Math.round(tx)+'px,'+Math.round(ty)+'px) scale('+sc+')';if(DG)DG.cam={tx,ty,T};gdOverlap()}
// The floor label, info button, minimap and message bar stay solid, but turn see-through (and let taps pass) while a
// Pokémon is underneath one. Worked out from where the camera is heading, so it's right before the slide finishes.
function gdOverlap(){const f=document.querySelector('.gd-field'),r=runOf();if(!f||!DG||!DG.cam||!r||!r.battle)return;const {tx,ty,T}=DG.cam,fr=f.getBoundingClientRect(),pts=[];
 r.party.forEach(m=>pts.push([m.x,m.y]));r.battle.enemies.forEach(e=>{if((e.hp>0||e.gdOut)&&!e.done)pts.push([e.x,e.y])});
 f.querySelectorAll('.gd-floor,.gd-envslot .tw-envbtn,.gd-mini,.gd-stones,.dg-ticker,.oc-health').forEach(el=>{const b=el.getBoundingClientRect();if(!b.width)return;const L=b.left-fr.left,Tp=b.top-fr.top,R=L+b.width,B=Tp+b.height;
  const hit=pts.some(([x,y])=>{const ux=tx+x*T,uy=ty+(y-.4)*T;return ux<R&&ux+T>L&&uy<B&&uy+T*1.4>Tp});el.classList.toggle('see-thru',hit)})}
function gdHighlight(){const hl=document.querySelector('.gd-hl');if(!hl)return;const T=GD_T,H=DG&&DG.hl;hl.innerHTML=H?H.tiles.map(([x,y])=>'<i class="'+H.cls+'" style="left:'+x*T+'px;top:'+y*T+'px"></i>').join(''):''}
// ---------- tapping the map ----------
function gdTap(ev){const r=runOf(),b=r&&r.battle;if(!b||!r.fl||b.enemyPhase)return;const mp=document.querySelector('.gd-map').getBoundingClientRect(),ts=mp.width/r.fl.w,x=Math.floor((ev.clientX-mp.left)/ts),y=Math.floor((ev.clientY-mp.top)/ts),u=gdUnitAt(r,x,y);
 if(dgTarget){if(dgTarget.side==='ally'&&u&&u.side==='ally'){dgAllyPick(u.i);return}if(dgTarget.side==='foe'&&u&&u.side==='foe'){dgTargetPick(u.i);return}return}
 if(DG.busy&&DG.gmode!=='move'&&DG.gmode!=='target')return;
 if(DG.gmode==='move'){const k=gdKey(x,y);if(DG.reach&&DG.reach.has(k)&&!gdUnitAt(r,x,y)){gdWalkTo(b.turn,x,y);return}DG.gmode='select';DG.hl=null;DG.busy=0;gdHighlight();dgPanelBattle();return}
 if(DG.gmode==='target'){if(u&&u.side==='foe'&&DG.opts){const o=DG.opts.find(o=>o.key===u.i)||DG.opts.find(o=>o.hits.includes(u.i));if(o){DG.pick(o);return}}return}
 if(u&&u.side==='ally'&&!DG.busy){b.turn=u.i;DG.gmode='select';gdCamera();gdDrawBattle();return}
 if(u&&u.side==='foe'){const e=b.enemies[u.i];toast(e.species+' Lv '+e.lv+' · '+e.hp+'/'+e.maxhp+' HP · moves '+e.mv+(e.aware?'':' · not noticed you yet'))}}
// ---------- the action panel ----------
function gdPanelBattle(msg){const r=runOf(),b=r.battle,m=r.party[b.turn],p=m&&partyMon(m);if(!r.fl)return;
 if(b.enemyPhase||!m){$('dgPanel').innerHTML='<div class="dg-msg">'+(msg||'Enemy turn…')+'</div>';return}
 if(ultResting(b,m)&&!m.acted){m.acted=true;m.moved=true;save()}
 const free=gdFree(r),c=combatant(p),fast=MOVE_STATS[p.fastMove]||['Normal',8,8,'fast'],disc=MOVE_STATS[p.discMove]||['Normal',80,50,'charged'],foes=gdFoeTargets(r),U=ultOf(p),canHit=gdOptions(r.fl,m.x,m.y,gdShape(p.fastMove,fast),ocTargets(r,p.fastMove,foes)).length>0||(m.energy>=disc[2]&&gdOptions(r.fl,m.x,m.y,gdShape(p.discMove,disc),ocTargets(r,p.discMove,foes)).length>0)||(U&&m.energy>=100&&(U.t==='none'||foes.some(([e])=>gdCheb(e,m)<=(U.t==='all'?3:5))));
 const chips='<div class="gd-chips">'+r.party.map((q,i)=>{const pp=partyMon(q),cc=combatant(pp);return '<button class="gd-chip'+(i===b.turn?' on':'')+(q.acted?' done':'')+(q.hp<=0?' ko':'')+'" style="--c:'+SLOT_COLORS[i]+'" onclick="gdSelect('+i+')">'+monSprite(pp,'',28)+'<small>'+(q.acted?'✓':q.hp<=0?'💤':q.hp+'/'+cc.hp)+'</small></button>'}).join('')+'</div>';
 const head='<div class="dg-msg"><b style="color:'+SLOT_COLORS[b.turn]+'">'+esc(p.nickname||p.species)+'</b> · '+m.hp+'/'+c.hp+' HP · ⚡'+m.energy+' · 👣 '+Math.max(1,gdMV(p.species)+mdMoveAdj())+(msg?'<br>'+msg:free?'<br>🧭 No wild Pokémon in sight: walk freely, your team follows.':m.acted?' · done this turn':m.moved?' · moved, can still act':'')+'</div>';
 const acts=m.hp<=0?'<div class="dg-acts"><button class="btn red" '+(m.acted?'disabled':'')+' onclick="dgRevive()">💫 ANSWER TO REVIVE</button></div>'
  :'<div class="dg-acts gd-acts">'+(()=>{const dg=gdDigAt(r,m)&&(free||r.fl.oc==='arena')&&gdDigAt(r,m),mv0='<button class="btn'+(free?' blue':'')+'" '+(!free&&(m.moved||m.acted)?'disabled':'')+' onclick="gdMoveStart()">👣 MOVE</button>',fight='<button class="btn red" '+(m.acted||!canHit?'disabled':'')+' onclick="dgFight()">⚔️ FIGHT'+(canHit||m.acted?'':'<small>no foe in reach</small>')+'</button>';return mv0+(dg?'<button class="btn red md-digbtn" onclick="gdDigHere()">⛏ DIG<small>'+dg.done+'/'+dg.max+' dug</small></button>':fight)})()+'<button class="btn blue" '+(m.acted?'disabled':'')+' onclick="dgItem()">🎒 ITEM</button><button class="btn" '+(m.acted?'disabled':'')+' onclick="dgGuard()">🛡 GUARD</button></div>';
 $('dgPanel').innerHTML=head+chips+acts+'<div class="dg-row"><button class="btn smallbtn red" onclick="gdEndTurn()">⏭ END TURN</button><span>⏱ <b id="dgTime">'+fmtMin(r.studyMs)+'</b></span><span>🎟️ '+(r.tickets||0)+'</span><button class="btn smallbtn" onclick="dgSettings()">🔧</button><button class="btn smallbtn" onclick="dgSaveExit()">💾</button></div>'}
// Free roam: while no wild Pokémon is in sight, moving doesn't use up anyone's turn. The picked Pokémon can keep walking
// (up to 6 tiles a step, or more if it's faster), the rest of the team follows, and everyone slowly recovers HP.
const GD_FREE_MV=6;
function gdFree(r){r=r||runOf();return !!(r&&r.fl&&r.battle&&!(r.fl.oc==='arena'&&r.battle.enemies.some(e=>e.ocBoss&&e.hp>0))&&!r.battle.enemyPhase&&!gdFoeTargets(r).some(([e])=>e.aware))}
// battles: the camera holds on the middle of the room (or between your team and the foes in a corridor)
// The camera centres on the middle of the line between the ally and the awake foe that are furthest apart, and zooms
// out (down to 62%) when they wouldn't both fit. It's worked out again on every redraw, so it follows the fight.
// Battle camera. Frames everyone in the fight (living allies + awake foes) inside a safe area that keeps clear of the floor
// badge / minimap / info button. If that won't fit at the zoom limit, it frames the Pokémon whose turn it is (or the foe
// that's acting) with its move range and nearest opponent. Dead zone: the view only changes when something it must show
// is near the edge or off screen, or when it could zoom in a fair bit, so it doesn't jump on every step.
const GD_CAM={min:.62,L:22,R:22,T:66,B:18};
function gdCamFocus(r){const b=r.battle;return DG&&DG.camFocus||r.party[b.turn]||r.party[0]}
function gdCamFit(pts,W,H){const xs=pts.map(p=>p.x),ys=pts.map(p=>p.y),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),T=GD_T;
 const sc=Math.min(1,(W-GD_CAM.L-GD_CAM.R)/((x1-x0+1.4)*T),(H-GD_CAM.T-GD_CAM.B)/((y1-y0+1.4)*T));
 // centre of the safe area, not the field, so the badge/minimap margin is honoured
 const oy=(GD_CAM.T-GD_CAM.B)/2/(T*Math.max(sc,GD_CAM.min)),ox=(GD_CAM.L-GD_CAM.R)/2/(T*Math.max(sc,GD_CAM.min));
 return {sc,cx:(x0+x1)/2-ox,cy:(y0+y1)/2-oy}}
function gdCamSees(pts,W,H){const c=DG&&DG.cam;if(!c)return false;return pts.every(p=>{const sx=(p.x+.5)*c.T+c.tx,sy=(p.y+.5)*c.T+c.ty;return sx>=GD_CAM.L+c.T*.5&&sx<=W-GD_CAM.R-c.T*.5&&sy>=GD_CAM.T+c.T*.5&&sy<=H-GD_CAM.B-c.T*.4})}
function gdBattleCam(r){const b=r.battle,A=r.party.filter(m=>m.hp>0),F=gdFoeTargets(r).filter(([e])=>e.aware).map(([e])=>e),m=gdCamFocus(r);if(!A.length||!F.length)return [m.x,m.y,1];
 const fe=document.querySelector('.gd-field'),W=fe?fe.clientWidth:390,H=fe?fe.clientHeight:400;let pts=A.concat(F),fit=gdCamFit(pts,W,H);
 if(fit.sc<GD_CAM.min){// too spread out: the acting Pokémon, the tiles it can reach, and the closest Pokémon on the other side
  const isFoe=F.includes(m),opp=isFoe?A:F,near=opp.slice().sort((a,c)=>gdCheb(a,m)-gdCheb(c,m))[0],mv=isFoe?(m.mv||3):(()=>{try{return Math.max(1,gdMV(partyMon(m).species)+mdMoveAdj())}catch(e){return 3}})();
  pts=[m,{x:m.x-mv,y:m.y},{x:m.x+mv,y:m.y},{x:m.x,y:m.y-mv},{x:m.x,y:m.y+mv}];fit=gdCamFit(pts.concat(near?[near]:[]),W,H);if(fit.sc<GD_CAM.min){fit=gdCamFit(pts,W,H)}pts=[m].concat(near&&fit.sc>=GD_CAM.min?[near]:[])}
 const sc=Math.max(GD_CAM.min,fit.sc),prev=DG&&DG.bcam;
 // dead zone: keep the current view if it already shows everything needed and isn't zoomed out much more than it needs to be
 if(prev&&prev[2]&&gdCamSees(pts,W,H)&&sc-prev[2]<.12)return prev;
 return [fit.cx,fit.cy,sc]}
// fainting: stagger, then the Sleep animation; foes then fade out (CSS does the motion)
function gdKoFx(id,fade){setTimeout(()=>{const s=document.querySelector('.gd-units [data-u="'+id+'"] .dg-spr');if(s){s.dataset.anim='Sleep';s.classList.remove('ok');dgFillSprites()}},600);if(fade)setTimeout(()=>{const u=document.querySelector('.gd-units [data-u="'+id+'"]');if(u&&u.classList.contains('gd-faint'))u.remove()},1550)}
function gdSelect(i){const r=runOf(),b=r&&r.battle;if(!b||b.enemyPhase||DG.busy)return;b.turn=i;DG.gmode='select';DG.hl=null;gdDrawBattle()}
// ---------- moving ----------
function gdMoveStart(){const r=runOf(),b=r.battle,m=r.party[b.turn];if(!m||m.hp<=0||DG.busy)return;const free=gdFree(r);if(!free&&(m.moved||m.acted))return;const fl=r.fl,mv=free?Math.max(GD_FREE_MV,gdMV(partyMon(m).species)):Math.max(1,gdMV(partyMon(m).species)+mdMoveAdj());
 const reach=gdBFS(fl,[m.x,m.y],(x,y)=>b.enemies.some(e=>(e.hp>0||e.gdOut)&&!e.diving&&!e.done&&e.x===x&&e.y===y),mv);DG.reach=reach;DG.gmode='move';if(!DG.bcam)gdCamera(m.x,m.y);
 DG.hl={cls:'mv',tiles:[...reach.keys()].map(k=>k.split(',').map(Number)).filter(([x,y])=>!(x===m.x&&y===m.y)&&!gdUnitAt(r,x,y))};gdHighlight();$('dgPanel').innerHTML='<div class="dg-msg">👣 Tap a blue tile to move there (up to '+mv+' tiles).'+(free?' No foes in sight, so this doesn’t use up the turn.':'')+'</div><div class="dg-acts"><button class="btn" onclick="DG.gmode=\'select\';DG.hl=null;gdDrawBattle()">CANCEL</button></div>'}
async function gdWalk(unitEl,obj,path,isFoe){const T=GD_T;for(let s=1;s<path.length;s++){const [x,y]=path[s],[px,py]=path[s-1];obj.dir=gdDirOf(x-px,y-py);obj.x=x;obj.y=y;if(unitEl){unitEl.style.left=x*T+'px';unitEl.style.top=y*T+'px';unitEl.style.zIndex=10+y;const sp=unitEl.querySelector('.dg-spr');if(sp&&+sp.dataset.row!==obj.dir){sp.dataset.row=obj.dir;sp.classList.remove('ok');dgFillSprites()}}if(!isFoe)gdDigPing(unitEl,x,y);if(DG&&DG.bcam){const nc=gdBattleCam(runOf());if(nc!==DG.bcam){DG.bcam=nc;gdCamera()}else gdOverlap()}else if(!isFoe)gdCamera(x,y);else gdOverlap();gdOverlays();await dgSleep(120)}gdOverlays();setTimeout(gdOverlays,340)}
async function gdWalkTo(slot,x,y){const r=runOf(),b=r.battle,m=r.party[slot],path=gdPath(DG.reach,gdKey(x,y)),wasFree=gdFree(r);DG.gmode='select';DG.hl=null;DG.busy=1;gdHighlight();
 await gdWalk(document.querySelector('.dg-ally[data-i="'+slot+'"]'),m,path,false);if(!runOf()||runOf().battle!==b)return;
 if(wasFree)gdFollow(r,slot,path);gdSee(r);mdHazard(r,m,false,slot);
 // still nothing in sight: the walk was free. A foe came into view: this walk counts as the move, and the battle starts
 if(wasFree&&gdFree(r)){m.moved=false;r.party.forEach(q=>{const c=combatant(partyMon(q));if(q.hp>0&&q.hp<c.hp)q.hp=Math.min(c.hp,q.hp+Math.max(1,Math.round(c.hp*.03)))})}else{m.moved=true;if(wasFree)r.party.forEach((q,i)=>{if(i!==slot)q.moved=false})}
 save();DG.busy=0;
 // pick up what's on the tile
 const fl=r.fl,ii=fl.items.findIndex(it=>it.x===m.x&&it.y===m.y);if(ii>=0){const it=fl.items.splice(ii,1)[0];if(it.tickets){r.tickets=(r.tickets||0)+it.tickets;r.cogs=(r.cogs||0)+it.tickets;toast('🎟️ Found '+it.tickets+' Tickets!')}else{r.bag[it.k]=(r.bag[it.k]||0)+1;toast(DITEMS[it.k].icon+' Picked up '+DITEMS[it.k].name+'!')}save()}
 if(ocTouchDoor(r,m)){gdDrawBattle();return}
 // dig spots don't start by themselves: standing on one out of battle swaps FIGHT for DIG
 if(gdDigAt(r,m)&&gdFree(r)){gdDrawBattle();return}
 const si=fl.specials.findIndex(s=>s.x===m.x&&s.y===m.y&&(gdFree(r)||!GD_LOCKED[s.k]));if(si>=0){const s=fl.specials.splice(si,1)[0];save();r.rooms=(r.rooms||0)+1;if(s.k==='shop'){gdDrawBattle();mdShopOpen()}else if(s.k==='chest')dgTreasure();else dgRest();return}
 if(!fl.stairsHidden&&m.x===fl.stairs[0]&&m.y===fl.stairs[1]){gdDrawBattle();modal('🪜 STAIRS','<p>'+(fl.boss?'The way out of this part of the dungeon.':'Go down to <b>B'+(r.floor+2)+'F</b>? Your whole team comes along.')+'</p><div class="actions"><button class="btn" onclick="closeModal()">NOT YET</button><button class="btn red" onclick="closeModal();gdStairs()">'+(fl.boss?'CONTINUE':'GO DOWN')+'</button></div>');return}
 gdDrawBattle();if(gdFree(r)&&r.battle.turn===slot&&m.hp>0)gdMoveStart()}
// teammates (fainted ones too, so nobody gets left behind) walk behind the leader along its path
function gdFollow(r,slot,path){const b=r.battle,lead=r.party[slot],trail=path.slice(0,-1).reverse(),taken=new Set([gdKey(lead.x,lead.y)]);
 b.enemies.forEach(e=>{if(e.hp>0&&!e.done)taken.add(gdKey(e.x,e.y))});
 const fol=r.party.map((q,i)=>[q,i]).filter(([q,i])=>i!==slot).sort((a,c)=>gdCheb(a[0],lead)-gdCheb(c[0],lead));
 // tiles behind the leader first, then the leader's neighbours
 const spots=[...trail,...GD_DIRS.map(([dx,dy])=>[lead.x+dx,lead.y+dy])].filter(([x,y])=>gdTile(r.fl,x,y));
 fol.forEach(([q,i])=>{if(gdCheb(q,lead)<=1){taken.add(gdKey(q.x,q.y));return}const t=spots.find(([x,y])=>!taken.has(gdKey(x,y)));if(!t){taken.add(gdKey(q.x,q.y));return}
  q.dir=gdDirOf(lead.x-t[0],lead.y-t[1]);q.x=t[0];q.y=t[1];taken.add(gdKey(t[0],t[1]))})}
function gdStairs(){const r=runOf();if(!r||!r.fl||r.fl.stairsHidden||!r.party.some(m=>m.x===r.fl.stairs[0]&&m.y===r.fl.stairs[1]))return;if(r.fl.boss){dgFloorClear();return}r.floor++;r.party.forEach(m=>{const c=combatant(partyMon(m));m.energy=Math.min(100,m.energy+10);if(m.hp>0)m.hp=Math.min(c.hp,m.hp+Math.ceil(c.hp*(.2+MD_PER.stairrest*mdLvOf(r,'stairrest'))));if(m.starf&&--m.starf.rooms<=0)m.starf=null});gdNewFloor(r);save();toast('⬇ B'+(r.floor+1)+'F'+(r.fl.boss?' · something big is waiting here…':''));gdDrawBattle(true);if(r.sub&&r.sub.fresh)mdDig(r)}
// ---------- fighting ----------
async function gdFight(){const r=runOf(),b=r&&r.battle;if(!b||b.enemyPhase||DG.busy)return;const m=r.party[b.turn],p=partyMon(m);if(!m||m.acted||m.hp<=0)return;
 const fast=MOVE_STATS[p.fastMove]||['Normal',8,8,'fast'],disc=MOVE_STATS[p.discMove]||['Normal',80,50,'charged'],X=dgCtx(b.turn),foes=gdFoeTargets(r),U=ultOf(p);
 const opt=(n,mv)=>gdOptions(r.fl,m.x,m.y,gdShape(n,mv),ocTargets(r,n,foes)),o1=opt(p.fastMove,fast),o2=opt(p.discMove,disc),uScope=U?(U.t==='all'?foes.filter(([e])=>gdCheb(e,m)<=3):U.t==='one'?foes.filter(([e])=>gdCheb(e,m)<=5):foes):[];
 $('dgPanel').innerHTML='<div class="dg-msg">Choose a move. Its reach is shown under it.</div><div class="dg-acts">'+dgMoveBtn('dgM1','red',p.fastMove,fast,X,o1.length>0)+dgMoveBtn('dgM2','blue',p.discMove,disc,X,m.energy>=disc[2]&&o2.length>0)+(U?'<button class="btn ult" id="dgM3" '+(m.energy<100||(U.t!=='none'&&!uScope.length)?'disabled':'')+'>✦ '+esc(U.move)+'<small>ULTIMATE · '+(U.t==='all'?'foes within 3':U.t==='one'?'one foe within 5':'self')+' · '+(m.energy<100?m.energy+'/100⚡':'FULL ⚡')+'</small></button>':'')+'</div><div class="dg-acts"><button class="btn" onclick="DG.gmode=\'select\';DG.hl=null;gdDrawBattle()">BACK</button></div>';
 const lab=(id,n,mv)=>{const el=$(id);if(el){const sm=el.querySelector('small');if(sm)sm.insertAdjacentHTML('beforeend','<br>📐 '+gdShape(n,mv).label)}};lab('dgM1',p.fastMove,fast);lab('dgM2',p.discMove,disc);
 const choose=(name,mv,opts)=>{if(!opts.length)return;DG.gmode='target';DG.opts=opts;const T=new Set();opts.forEach(o=>o.hits.forEach(i=>T.add(i)));DG.hl={cls:'tg',tiles:[...T].map(i=>[b.enemies[i].x,b.enemies[i].y])};gdHighlight();
  const go=async o=>{DG.gmode='select';DG.hl=null;gdHighlight();DG.busy=1;const sl=b.turn,ep=dgEpoch,res=await dgQ('⚔️ FIGHT',{hint:true});const mult=r.slider?await dgSlider(res,dgBarSlow(b)):dgRandMult();const r2=runOf();if(ep!==dgEpoch||!r2||r2.battle!==b||b.turn!==sl||m.acted)return;if(mv[3]!=='fast'&&m.energy<mv[2]){DG.busy=0;gdDrawBattle();return}
   const t0=b.enemies[o.key];o.hits.forEach(j=>{if(b.enemies[j])b.enemies[j].aware=1});m.dir=gdDirOf(t0.x-m.x,t0.y-m.y);const s=document.querySelector('.dg-ally[data-i="'+sl+'"] .dg-spr');if(s){s.dataset.row=m.dir;s.classList.remove('ok');await dgFillSprites()}
   if(o.hits.length===1&&!MOVE_SPREAD.has(name))dgAttack(sl,o.key,name,mv,mult);else gdAttackMulti(sl,name,mv,mult,o.hits)};
  DG.pick=go;if(opts.length===1&&opts[0].all){go(opts[0]);return}$('dgPanel').innerHTML='<div class="dg-msg">🎯 Tap a highlighted foe.'+(gdShape(name,mv).k==='beam'?' The beam hits everything in that line.':'')+'</div><div class="dg-acts"><button class="btn" onclick="DG.gmode=\'select\';DG.hl=null;gdDrawBattle()">BACK</button></div>'};
 $('dgM1').onclick=()=>choose(p.fastMove,fast,o1);$('dgM2').onclick=()=>choose(p.discMove,disc,o2);
 if(U&&$('dgM3'))$('dgM3').onclick=async()=>{const sl=b.turn,ep=dgEpoch,run=async i=>{DG.busy=1;if(i!=null)dgCrosshair('foe',i,sl);const res=await dgQ('✦ '+U.move.toUpperCase(),{hint:true});const mult=U.t==='none'?1:r.slider?await dgSlider(res,dgBarSlow(b)*(U.fx==='cudgel'?.75:1)):dgRandMult();const r2=runOf();if(ep!==dgEpoch||!r2||r2.battle!==b||b.turn!==sl||m.acted||m.energy<100)return;
   // foes out of the Ultimate's reach sit this one out
   const keep=new Set(uScope.map(([,j])=>j));b.enemies.forEach((e,j)=>{if(e.hp>0&&!e.done&&!keep.has(j)){e.gdHp=e.hp;e.hp=0;e.gdOut=1}});dgUltimate(sl,i,mult,res)};
  if(U.t==='one'){DG.gmode='target';DG.opts=uScope.map(([,j])=>({key:j,hits:[j]}));DG.hl={cls:'tg',tiles:uScope.map(([e])=>[e.x,e.y])};gdHighlight();DG.pick=o=>{DG.gmode='select';DG.hl=null;gdHighlight();run(o.key)};$('dgPanel').innerHTML='<div class="dg-msg">🎯 Tap a highlighted foe.</div>'}else run(null)}}
// several targets (spread moves, beams): like the all-foes attack above, but only the foes hit
async function gdAttackMulti(slot,name,mv,mult,idx){const r=runOf(),b=r&&r.battle,m=b&&r.party[slot],p=partyMon(m);if(!p)return;const x=dgCtx(slot),who=esc(p.nickname||p.species),asel='.dg-ally[data-i="'+slot+'"]',sc=idx.length>1?.75:1;
 const hits=idx.map(i=>[b.enemies[i],i]).filter(([e])=>e&&e.hp>0).map(([e,i])=>Object.assign(dgStrike(x,name,mv,e,mult,sc),{e,i})),out=dgFinish(x,name,mv,hits);save();
 const ok=hits.filter(h=>!h.fail),best=Math.max(1,...ok.map(h=>h.eff)),tot=ok.reduce((a,h)=>a+h.dmg,0),ko=ok.filter(h=>h.e.hp<=0).map(h=>esc(h.e.species)),crit=ok.some(h=>h.crit),tags=[...new Set(ok.flatMap(h=>h.tags))];
 if(DG)DG.msg='<b style="color:'+SLOT_COLORS[slot]+'">'+who+'</b> used <b>'+esc(name)+'</b>! '+(ok.length?'It hits '+ok.length+' foe'+(ok.length>1?'s':'')+' for <b>'+tot+'</b>.':'But it failed! '+((hits[0]||{}).fail||''))+(crit&&ok.length?' <span class="t-crit">Critical hit!</span>':'')+(best>1.2?' <span class="t-sup">Super effective!</span>':'')+(tags.length?' '+tags.join(' '):'')+(ko.length?' '+ko.join(', ')+' fainted!':'')+dgOutMsg(out);
 if(mv[3]!=='fast'||1)mvAttackAnim(asel);await Promise.all(ok.map((h,k)=>dgSleep(k*70).then(()=>moveFx(mv[0],movePow(name)>70,asel,'.dg-foe[data-i="'+h.i+'"]'))));if(!runOf()||runOf().battle!==b)return;
 hits.forEach(h=>{const s='.dg-foe[data-i="'+h.i+'"]';if(h.fail){dgFloat(s,'No effect','weak');return}dgHit(s,h.crit||h.eff>1.2);dgFloat(s,'-'+h.dmg,h.crit?'crit':h.eff>1.2?'super':h.eff<.8?'weak':'');if(h.e.hp<=0)setTimeout(()=>dgFaint(s),380)});gdDrawBattle();
 if(mv[3]==='fast')dgFloat(asel,'+⚡'+mv[2],'en');dgShowOut(slot,out);await dgSleep(ko.length?1000:850);dgAfterAction()}
// the foe picker for items like the Snag Machine: any foe you can see within 4 tiles
function gdChooseFoe(fn){const r=runOf(),b=r&&r.battle;if(!b)return;const m=r.party[b.turn],opts=gdFoeTargets(r).filter(([e])=>gdCheb(e,m)<=4);if(!opts.length){toast('No foe within 4 tiles');DG.busy=0;dgPanelBattle();return}
 dgTarget={side:'foe',fn};DG.hl={cls:'tg',tiles:opts.map(([e])=>[e.x,e.y])};gdHighlight();$('dgPanel').innerHTML='<div class="dg-msg">🎯 Tap a highlighted foe (within 4 tiles).</div>'}
// ---------- after each action ----------
function gdUnstash(b){b.enemies.forEach(e=>{if(e.gdOut){e.hp=e.gdHp;delete e.gdHp;delete e.gdOut}})}
function gdKills(r){const b=r.battle,dead=b.enemies.find(e=>e.ocBoss&&e.hp<=0&&!e.done);if(dead){if(!dead.defeating)ocDefeat(r,dead);return}const got=[];b.enemies.forEach(e=>{if(e.hp>0||e.done||e.gdOut)return;e.done=1;const boss=!!e.boss,tix=(boss?(e.boss==='boss'?12:18):e.swarm?1:2)+(dgGamey(r)?Math.floor(r.floor/2):0),exp=Math.round((boss?4500:e.swarm?500:1000)*(1+(dgGamey(r)?.1*r.floor:0)));
  const tx=mdTix(tix),stn=mdStoneDrop(r,e);r.tickets=(r.tickets||0)+tx;r.cogs=(r.cogs||0)+tx;r.party.forEach(m=>{const p=partyMon(m);if(p)p.pxp=(p.pxp||0)+exp});got.push((e.caught?'🧲 ':'')+esc(e.species)+': +'+tx+'🎟️'+(stn?' '+stn:'')+' · team +'+money(exp)+' EXP');
  if(boss){const bk=Math.random()<.5?'apple':'starf';r.bag[bk]=(r.bag[bk]||0)+1;got.push(DITEMS[bk].icon+' '+DITEMS[bk].name);if(Math.random()<.2){db.candies++;got.push('🍬 Rare Candy')}
   if(e.boss==='totem'||e.boss==='alpha'){const sp=PRE_EVO[e.species]||e.species,mm=giveMon(dgBossMon(sp,e.boss));got.push('🎁 '+(mm.shiny?'✨ Shiny ':'')+mm.species+' joined your Box!')}
   if(r.fl.boss){r.fl.stairsHidden=false;got.push('🪜 The stairs appeared!');if(r.fl.ffOn){delete r.fl.ffOn;r.fl.ff=null;got.push('🟥 The force fields went down!')}}}});
 if(got.length&&DG)DG.msg=(DG.msg?DG.msg+'<br>':'')+got.join('<br>')}
function gdAfterAction(){const r=runOf(),b=r&&r.battle;if(DG)DG.busy=0;if(!b||!r.fl)return;gdUnstash(b);const m=r.party[b.turn];if(m){m.acted=true;m.moved=true}r.party.forEach(q=>{if(!(q.energy>=0))q.energy=0});dgTarget=null;if(DG){DG.gmode='select';DG.hl=null}gdKills(r);
 if(r.party.every(q=>q.hp<=0)){dgLose();return}
 // no foe awake in sight: the battle is over (or never started), so everyone can move again
 if(gdFree(r)){r.party.forEach(q=>{q.moved=false;q.acted=false;delete q.reviveTried});b.turn=Math.max(0,r.party.findIndex(q=>q.hp>0));b.guard={};save();gdDrawBattle();gdCamera();return}
 const next=r.party.findIndex((q,i)=>!q.acted&&(q.hp>0||!q.acted));
 if(r.party.every(q=>q.acted||(q.hp<=0&&q.reviveTried))){save();gdEnemyPhase();return}if(next>=0)b.turn=next;save();gdDrawBattle()}
function gdEndTurn(){const r=runOf(),b=r&&r.battle;if(!b||b.enemyPhase||DG.busy)return;if(r.party.some(q=>q.hp>0&&!q.acted)&&!confirm('End the turn? Pokémon that haven’t acted will skip their action.'))return;gdEnemyPhase()}
// ---------- the enemies' turn ----------
async function gdEnemyPhase(){const r=runOf(),b=r.battle;b.enemyPhase=true;DG.gmode='select';DG.hl=null;save();gdDrawBattle();const ep=dgEpoch;
 if(b.skip){b.skip=false;dgPanelBattle('⏱ The enemies are frozen in time!');await dgSleep(1100)}
 else for(let i=0;i<b.enemies.length;i++){const e=b.enemies[i];if(e.hp<=0||e.done)continue;if(e.ocBoss){await ocBossTurn(r,e,i);if(ep!==dgEpoch||runOf()!==r)return;continue}gdSee(r);if(!e.aware)continue;
  if(DG.bcam){DG.camFocus=e;const nc=gdBattleCam(r);if(nc!==DG.bcam){DG.bcam=nc;gdCamera()}}
  for(let k=0;k<(e.twice?2:1);k++){if(ep!==dgEpoch||!runOf()||runOf().battle!==b)return;if(r.party.every(m=>m.hp<=0))break;
   if(k===0&&(e.para||e.flinch)){const why=e.para?'is paralyzed':'flinched';e.para=false;e.flinch=false;DG.msg=esc(e.species)+' '+why+' and can’t move!';gdDrawBattle();await dgSleep(700);break}
   if(e.boss&&k===0&&b.charge){b.charge=false;await gdBossBlast(i,e);continue}
   const disc=MOVE_STATS[e.disc],useDisc=disc&&e.energy>=disc[2]&&Math.random()<.4,name=useDisc?e.disc:e.fast,mv0=useDisc?disc:(MOVE_STATS[e.fast]||['Normal',8,8,'fast']),shape=gdShape(name,mv0);
   const allies=()=>r.party.map((m,j)=>[m,j]).filter(([m])=>m.hp>0);let opts=gdOptions(r.fl,e.x,e.y,shape,allies());
   if(!opts.length&&k===0){// walk toward your team: the closest tile it can attack from, otherwise as close as it can get
    const reach=gdBFS(r.fl,[e.x,e.y],(x,y)=>r.party.some(m=>m.x===x&&m.y===y)||b.enemies.some((o,j)=>j!==i&&o.hp>0&&!o.done&&o.x===x&&o.y===y),e.mv||3);let best=null,bd=1e9;
    reach.forEach((v,kk)=>{const [x,y]=kk.split(',').map(Number),o=gdOptions(r.fl,x,y,shape,allies());const near=Math.min(...allies().map(([m])=>gdCheb(m,{x,y})));const score=o.length?v.d:100+near*10+v.d;if(score<bd){bd=score;best=kk}});
    if(best&&best!==gdKey(e.x,e.y)){const el=document.querySelector('.dg-foe[data-i="'+i+'"]');await gdWalk(el,e,gdPath(reach,best),true);gdDrawBattle();if(mdHazard(r,e,true,i)&&e.hp<=0){gdKills(r);gdDrawBattle();break}}
    opts=gdOptions(r.fl,e.x,e.y,shape,allies())}
   if(!opts.length)break;const o=opts.sort((a,c)=>c.hits.length-a.hits.length)[0];await gdEnemyStrike(i,e,o.hits,useDisc,name,mv0);if(r.party.every(m=>m.hp<=0))break}}
 DG.camFocus=null;if(ep!==dgEpoch||!runOf()||runOf().battle!==b)return;
 const bossUp=b.enemies.find(e=>e.boss&&e.hp>0&&!e.done&&e.aware);if(bossUp&&!bossUp.ocBoss&&!b.charge&&r.party.filter(m=>m.hp>0).length>1&&(b.round%3===2||Math.random()<.2)){b.charge=true;DG.msg='⚠ '+esc(bossUp.species)+' is gathering power for a blast that hits everyone within 3 tiles! 🛡 Guard or get away.'}
 const ocImm=b.enemies.filter(e=>e.ocBoss&&e.diving).map(e=>[e,e.hp]);dgSaltTick(b);await ultEndOfRound(r,b);if(!runOf()||runOf().battle!==b)return;await mdRoundEnd(r,b);if(!runOf()||runOf().battle!==b)return;ocImm.forEach(([e,hp])=>{if(e.diving)e.hp=hp});gdKills(r);
 b.guard={};b.enemyPhase=false;b.round++;
 // like in the games, your team slowly recovers while no wild Pokémon is chasing it
 const Lr=gdLit(r),calm=!b.enemies.some(e=>e.hp>0&&!e.done&&e.aware&&Lr.has(gdKey(e.x,e.y)));if(calm)r.party.forEach(m=>{const c=combatant(partyMon(m));if(m.hp>0&&m.hp<c.hp)m.hp=Math.min(c.hp,m.hp+Math.ceil(c.hp*.05))});
 r.party.forEach(m=>{m.moved=false;m.acted=false;delete m.reviveTried});b.turn=Math.max(0,r.party.findIndex(m=>m.hp>0));
 if(r.party.every(m=>m.hp<=0)){dgLose();return}save();gdDrawBattle()}
async function gdEnemyStrike(i,e,targets,useDisc,name,mv0){const r=runOf(),b=r.battle,disc=MOVE_STATS[e.disc],eh=dgEnemyHits(name),mv=eh>1?Object.assign([mv0[0],Math.round(mv0[1]*eh),mv0[2],mv0[3]],{cat:moveCat(mv0)}):mv0,sc=targets.length>1?.75:1,fsel='.dg-foe[data-i="'+i+'"]';
 const t0=r.party[targets[0]];e.dir=gdDirOf(t0.x-e.x,t0.y-e.y);const s=document.querySelector(fsel+' .dg-spr');if(s){s.dataset.row=e.dir;s.classList.remove('ok');await dgFillSprites()}
 const hits=targets.map(ti=>{const tm=r.party[ti],tp=partyMon(tm),tc=combatant(tp),{dmg:raw0}=dgDamage({atk:e.atk,spa:e.spa,types:e.types},{def:tc.def+(tm.starf&&tm.starf.stat==='def'?2:0),spd:tc.spd+(tm.starf&&tm.starf.stat==='spd'?2:0),types:tc.types},mv,(.85+Math.random()*.3)*sc*mdFoeMult(mv[0],tc.types)),capF=(e.boss?(useDisc?.75:.55):(useDisc?.6:.45))*(DIFF[r.diff].dm||1)*sc,raw=Math.max(1,Math.round(Math.min(raw0,Math.ceil(tc.hp*capF*(.9+Math.random()*.2)))*mdHideMult())),dodged=Math.random()<dgDodge(tc.spe+(tm.starf&&tm.starf.stat==='spe'?2:0),e.spe),dmg=dodged?0:ultGuardDmg(b,Math.max(1,Math.round(raw*(1-Math.min(.9,(b.guard[ti]||0)+(b.wall===b.round?.1:0))))));
  tm.hp=Math.max(0,tm.hp-dmg);dgHurt(b,tm,dmg);return {ti,tm,tp,dmg,dodged,eff:typeEff(mv[0],tc.types)}});
 if(useDisc)e.energy-=disc[2];else e.energy=Math.min(100,e.energy+mv0[2]);e.acted=1;save();
 DG.msg=esc(e.species)+' used <b>'+esc(name)+'</b>'+(hits.length>1?' on '+hits.length+' of your team':' on <b style="color:'+SLOT_COLORS[hits[0].ti]+'">'+esc(hits[0].tp.nickname||hits[0].tp.species)+'</b>')+'! '+hits.map(h=>h.dodged?'💨 '+esc(h.tp.nickname||h.tp.species)+' dodged!':'−'+h.dmg+(b.guard[h.ti]?'🛡':'')).join(' · ')+(eh>1?' (hit '+Math.round(eh)+' times)':'')+(hits.some(h=>h.eff>1.2&&!h.dodged)?' <span class="t-sup">Super effective!</span>':'')+hits.filter(h=>h.tm.hp<=0).map(h=>' '+esc(h.tp.nickname||h.tp.species)+' fainted!').join('');
 dgPanelBattle(esc(e.species)+' used '+esc(name)+'!');mvAttackAnim(fsel);await Promise.all(hits.map((h,k)=>dgSleep(k*70).then(()=>moveFx(mv0[0],mv0[1]>70,fsel,'.dg-ally[data-i="'+h.ti+'"]'))));if(!runOf()||runOf().battle!==b)return;
 gdDrawBattle();dgPanelBattle(esc(e.species)+' used '+esc(name)+'!');hits.forEach(h=>{const a='.dg-ally[data-i="'+h.ti+'"]';if(h.dodged){mvMove(a,[{x:0},{x:-14,offset:.3},{x:-14,offset:.6},{x:0}],450);dgFloat(a,'Dodged!','heal');return}dgHit(a,useDisc||h.eff>1.2);dgFloat(a,'-'+h.dmg+(b.guard[h.ti]?' 🛡':''),h.eff>1.2?'super':h.eff<.8?'weak':'');if(h.tm.hp<=0)setTimeout(()=>dgFaint(a),380)});
 mdRough(r,i,e,hits,mv0);await dgSleep(hits.some(h=>h.tm.hp<=0)?950:750)}
// a boss's charged blast: everyone within 3 tiles
async function gdBossBlast(i,e){const r=runOf(),b=r.battle,t=String((e.types||['normal'])[0]).toLowerCase(),name=SPREAD_MOVES[t]||'Hyper Voice',mv=[t.charAt(0).toUpperCase()+t.slice(1),95,0,'charged'],hits=[];
 r.party.forEach((m,j)=>{if(m.hp<=0||gdCheb(m,e)>3)return;const c=combatant(partyMon(m)),{dmg:raw}=dgDamage({atk:e.atk,spa:e.spa,types:e.types},{def:c.def,spd:c.spd,types:c.types},mv,.75*(.9+Math.random()*.2)),cut=Math.max(1,Math.round(Math.min(raw,Math.ceil(c.hp*.42*(DIFF[r.diff].dm||1)*(.9+Math.random()*.2)))*mdHideMult())),dmg=Math.random()<dgDodge(c.spe,e.spe)?0:ultGuardDmg(b,Math.max(1,Math.round(cut*(1-Math.min(.9,b.guard[j]||0)))));m.hp=Math.max(0,m.hp-dmg);dgHurt(b,m,dmg);hits.push([j,dmg])});save();
 DG.msg='💥 '+esc(e.species)+' used <b>'+name+'</b>!'+(hits.length?' It hits '+hits.length+' of your team!':' Everyone got out of range!');gdDrawBattle();const f=document.querySelector('.gd-field');if(f){f.classList.add('spreadfx');setTimeout(()=>f.classList.remove('spreadfx'),700)}
 hits.forEach(([j,dmg])=>{const s='.dg-ally[data-i="'+j+'"]';if(!dmg){dgFloat(s,'Dodged!','heal');return}dgHit(s,true);dgFloat(s,'-'+dmg+(b.guard[j]?' 🛡':''),'super');if(r.party[j].hp<=0)setTimeout(()=>dgFaint(s),380)});await dgSleep(1200)}
// ---------- taking over from the room-map versions above ----------
// the Battle Tower keeps the classic battle screen (foes on top, team at the bottom); the dungeon uses the tile floors
const gdTower=()=>{const r=runOf();return !!(r&&r.tower)};
function dgDrawBattle(entering){return gdTower()?dgcDrawBattle(entering):gdDrawBattle(entering)}
function dgDrawMap(){return gdDrawBattle(true)}
function dgPanelBattle(msg){return gdTower()?dgcPanelBattle(msg):gdPanelBattle(msg)}
function dgAfterAction(){return gdTower()?dgcAfterAction():gdAfterAction()}
function dgEnemyPhase(){return gdTower()?dgcEnemyPhase():gdEnemyPhase()}
function dgChooseFoe(fn){return gdTower()?dgcChooseFoe(fn):gdChooseFoe(fn)}
function dgFight(){return gdTower()?dgcFight():gdFight()}
function dgNextRoom(){const r=runOf();if(!r)return;if(r.tower){twShopDone();return}save();gdDrawBattle(true)}
function dgWin(){return gdTower()?dgcWin():gdAfterAction()}
function dgDescend(){const r=runOf();if(!r)return;r.floor++;r.party.forEach(m=>{const c=combatant(partyMon(m));if(m.hp>0)m.hp=Math.min(c.hp,m.hp+Math.round(c.hp*.3))});gdNewFloor(r);save();toast('⬇ B'+(r.floor+1)+'F'+(dgGamey(r)?'. The air feels heavier…':''));gdDrawBattle(true);if(r.sub&&r.sub.fresh)mdDig(r)}
function dgFloorClear(){if(mdIsLast(runOf()))return mdFinal();const r=runOf(),D=DIFF[r.diff],seg=Math.floor(r.floor/(GD_DEPTH[r.diff]||3))+1;r.clearedFloors=Math.max(r.clearedFloors||0,seg);save();const bonus=dgFloorBonus(r),g=dgGamey(r);
 $('dgStage').innerHTML='<div class="dg-room"><span class="dg-big">🏁</span><h3>B'+(r.floor+1)+'F boss beaten!</h3><p>Leave now to collect a <b>'+bonus+' Cog</b> bonus'+(g?' ('+r.clearedFloors+' boss'+(r.clearedFloors>1?'es':'')+' × '+(D.fb||10)+')':'')+'.</p><p class="small">'+(g?'Or go deeper: the next floors are about '+((seg)*(D.step||2))+' levels stronger. Your team recovers 30% HP. If your team faints down there, you lose the bonus.':'Or keep exploring deeper. Casual floors stay the same strength, and your team recovers 30% HP on the way down.')+'</p><div class="actions"><button class="btn" onclick="dgEnd(true)">🏠 LEAVE WITH REWARDS</button><button class="btn" onclick="mdShopOpen()">🎩 HATTERENE’S SHOP</button><button class="btn red" onclick="dgDescend()">⬇ GO DEEPER</button></div></div>';$('dgPanel').innerHTML=dgPanelMap()}
// items that hit "every enemy" hit every foe you can see
async function dgBlastItem(k){if(gdTower())return dgcBlastItem(k);const r=runOf(),b=r.battle,slot=b.turn,I=DITEMS[k],who=partyMon(r.party[slot]);dgCrosshair('ally',slot,slot);const res=await dgQ(I.icon+' '+I.name.toUpperCase());
 if(res==='makeup'&&Math.random()<.25){toast((who.nickname||who.species)+' fumbled the item! (kept, but no effect)');dgAfterAction();return}
 r.bag[k]--;if(res==='fail'){toast('The '+I.name+' was used up with no effect.');save();dgAfterAction();return}
 const alive=gdFoeTargets(r),n=alive.length;if(!n){toast('No foe in sight. The '+I.name+' fizzled.');save();dgAfterAction();return}
 const hits=alive.map(([e,i],j)=>{const d=I.aoe||Math.floor(I.split/n)+(j<I.split%n?1:0);e.hp=Math.max(0,e.hp-d);e.hitR=b.round;return {e,i,d}});save();
 DG.msg=I.icon+' <b>'+I.name+'</b>! '+hits.map(h=>esc(h.e.species)+' −'+h.d).join(', ');const f=document.querySelector('.gd-field');if(f){f.classList.add(k==='stellar'?'spreadfx':'shake');setTimeout(()=>f.classList.remove('spreadfx','shake'),700)}
 hits.forEach(h=>{const s='.dg-foe[data-i="'+h.i+'"]';dgHit(s,true);dgFloat(s,'-'+h.d,'super');if(h.e.hp<=0)setTimeout(()=>dgFaint(s),380)});await dgSleep(1000);dgAfterAction()}
async function dgRevive(){if(gdTower())return dgcRevive();const r=runOf(),b=r&&r.battle;if(!b||b.enemyPhase||DG.busy)return;const m=r.party[b.turn];if(!m||m.hp>0||m.acted)return;DG.busy=1;const res=await dgQ('💫 REVIVE');
 if(res!=='fail'){m.hp=1;save();gdDrawBattle();dgFloat('.dg-ally[data-i="'+b.turn+'"]','Back up! (1 HP)','eff');await dgSleep(700)}else{m.reviveTried=1;toast('Still fainted. Try again next turn.')}dgAfterAction()}
function dgStartRun(){dgMode='dungeon';const sids=[...document.querySelectorAll('.mg-sets input:checked')].map(x=>x.value),mode=(document.querySelector('input[name=mgm]:checked')||{}).value||'smart',diff=(document.querySelector('input[name=dgd]:checked')||{}).value||'easy',style=(document.querySelector('input[name=dgs]:checked')||{}).value||'casual';if(!sids.length){toast('Pick at least one study set');return}
 if(mode==='weak'&&!sids.some(id=>(db.learned||{})[id])){toast('Finish Learn mode on one of these sets first');return}
 if(!mgPicker(mgBank(sids),mode).bank.length){toast('No questions for that mode here');return}
 db.run={diff,style,sids,mode,party:dgPick.map(id=>{const p=db.pokemon.find(x=>x.id===id),c=combatant(p);return {id,hp:c.hp,energy:20,starf:null}}),floor:0,bag:{oran:2},studyMs:0,cogs:0,tickets:0,rooms:0,startedAt:stamp(),slider:true,battle:null,stones:{fire:0,water:0,leaf:0},up:{},themeOff:Math.floor(Math.random()*GD_THEMES.length),log:[]};dgPick=[];gdNewFloor(db.run);save();closeModal();go('minigames');dgOpen();mdDig(db.run)}
function dgOpen(mode){if(mode)dgMode=mode;if(dgMode==='tower')return dgcOpen();const r=runOf();if(!r)return;dgEpoch++;mgState={game:'dungeon',startedAt:Date.now(),stop:()=>{clearInterval(DG&&DG.clock);dgEpoch++;document.querySelectorAll('.mgq,.dg-slider,.md-rescue,.oc-overlay').forEach(x=>x.remove());document.body.classList.remove('mg-on');DG=null}};DG={clock:setInterval(()=>{const rr=runOf();if(!rr||currentPage!=='minigames'||document.hidden)return;rr.studyMs+=1000;const t=$('dgTime');if(t)t.textContent=fmtMin(rr.studyMs)},1000),bank:mgBank(r.sids),gmode:'select'};DG.P=mgPicker(DG.bank,r.mode);document.body.classList.add('mg-on');
 const el=$('mgArea');el.innerHTML='<div class="dg gd"><div class="dg-stage" id="dgStage"></div><div class="dg-panel" id="dgPanel"></div></div>';
 // a run saved by the old room-map version continues on a fresh tile floor
 if(!r.fl||!r.battle||r.battle.kind!=='floor'){r.floor=r.floor||0;if(r.themeOff==null)r.themeOff=0;gdNewFloor(r);save()}
 if(!r.sub){mdPlan(r);r.sub.fresh=false;save()}if(r.floor===14&&!r.ocManaphyCleared&&!r.fl.oc){ocAttach(r);save()}
 if(r.fl.oc==='arena'){const guardian=ocBoss(r);if(guardian)guardian.defeating=false}gdDrawBattle(true);if(r.fl.oc==='arena'&&r.battle.enemies.some(e=>e.ocBoss&&e.hp<=0&&!e.done))gdKills(r);if(r.ocEntering)setTimeout(()=>{if(runOf()===r&&DG)ocEnter()},0);else if(r.rescueDrill)setTimeout(()=>{if(runOf()===r&&DG)mdRescueDrill()},0);else if(r.battle.enemyPhase)gdEnemyPhase()}
// The floor label, sublayer button and minimap stay solid, but go see-through and let taps pass when a Pokémon is under them
function gdOverlays(){const f=document.querySelector('.gd-field');if(!f)return;const U=[...f.querySelectorAll('.gd-u')].map(u=>u.getBoundingClientRect()).filter(b=>b.width);
 f.querySelectorAll('.gd-envslot .tw-envbtn,.gd-floor,.gd-mini,.gd-stones').forEach(o=>{const a=o.getBoundingClientRect(),hit=U.some(b=>b.right>a.left+2&&b.left<a.right-2&&b.bottom>a.top+2&&b.top<a.bottom-2);o.classList.toggle('gd-under',hit)})}

// ---- dig spots: the unit standing on one (out of battle) gets a DIG button ----
function gdDigAt(r,m){const fl=r&&r.fl;if(!fl||!m||m.hp<=0)return null;const oc=ocDigAt(r,m);if(oc)return oc;return (fl.digs||[]).find(d=>d.x===m.x&&d.y===m.y&&d.done<d.max)||null}
function gdDigHere(){const r=runOf();if(!r||!r.battle||DG.busy)return;const m=r.party[r.battle.turn],d=gdDigAt(r,m);if(!d)return;if(d.oc){ocDigManaphy();return}if(!gdFree(r)){toast('⛏ Can’t dig with a foe awake nearby');return}mdDigSpot(d)}
// Shinier Patches Lv2+: a "?" pops over an ally who steps onto a dig spot
function gdDigPing(unitEl,x,y){const r=runOf();if(!unitEl||!r||!r.fl||mdLvOf(r,'patches')<2)return;if(!(r.fl.digs||[]).some(d=>d.x===x&&d.y===y&&d.done<d.max))return;const q=document.createElement('div');q.className='gd-digq';q.textContent='?';unitEl.appendChild(q);setTimeout(()=>q.remove(),1300)}

// ---- boss arena: when every living teammate is inside the boss room, the doorways seal with red force fields,
// the boss's name splashes on screen and the room's Pokémon join the battle. The fields drop when the boss falls.
function gdBossSeal(r){const fl=r&&r.fl,o=fl&&fl.bossRoom;if(!o||fl.sealed)return false;const b=r.battle,boss=b.enemies.find(e=>e.boss&&e.hp>0&&gdInRect(e,o));if(!boss)return false;
 const team=r.party.filter(m=>m.hp>0);if(!team.length||!team.every(m=>gdInRect(m,o)))return false;
 fl.sealed=1;const ff=[],seen=new Set();for(let y=o[1]-1;y<=o[1]+o[3];y++)for(let x=o[0]-1;x<=o[0]+o[2];x++){if(gdInRect({x,y},o))continue;if(+fl.tiles[y]?.[x]>0&&!(fl.ob&&fl.ob[y*fl.w+x]==='1')){const touch=[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>gdInRect({x:x+dx,y:y+dy},o));const k=gdKey(x,y);if(touch&&!seen.has(k)){seen.add(k);ff.push(k)}}}
 const bm=Array(fl.w*fl.h).fill('0');ff.forEach(k=>{const [x,y]=k.split(',').map(Number);bm[y*fl.w+x]='1'});fl.ff=ff;fl.ffOn=bm.join('');
 b.enemies.forEach(e=>{if(e.dormant&&e.hp>0){e.dormant=0;e.aware=1}});save();gdBossSplash(boss);return true}
function gdBossSplash(e){const f=document.querySelector('.gd-field');if(!f)return;const kind=e.boss==='alpha'?'ALPHA':e.boss==='totem'?'TOTEM':'BOSS',d=document.createElement('div');d.className='gd-bsplash';
 d.innerHTML='<div class="gd-bs-band"><small>⚠ '+kind+' BATTLE ⚠</small><b>'+esc(e.species)+'</b><i>The way out is sealed!</i></div>';f.appendChild(d);setTimeout(()=>d.remove(),2300)}

// shops and treasure rooms (and dig spots) shut during battle; they come back when free movement returns
const GD_LOCKED={shop:1,chest:1};
