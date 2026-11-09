// ===================== MYSTERY DUNGEON · living floors (decoration only) =====================
// Textured walls with raised front faces, themed floor dressing, special rooms (pond / mossy garden / cracked lava)
// and light CSS ambient motion (torches, drips, drifting spores/bubbles/embers, glowing crystals). Nothing here
// changes movement or combat.
const DL_STYLE=[ // per dungeon layer: wall texture, face accent, floor dressing, ambient particle, torch colour
 {wall:'rock',acc:'#cfe3e8',dress:'puddle',mote:'bubble',torch:'#7fe0ff',rooms:['pond','flooded','crystal','garden']},
 {wall:'rock',acc:'#5f9a46',dress:'moss',mote:'spore',torch:'#ffcf6b',rooms:['garden','mushroom','ruin','pond']},
 {wall:'spike',acc:'#e8e2d0',dress:'crack',mote:'dust',torch:'#ffd08a',crystal:'#bfe3ff',rooms:['crystal','bones','mine','pond']},
 {wall:'brick',acc:'#8a8fa8',dress:'coal',mote:'dust',torch:'#ffb347',crystal:'#9f8cff',rooms:['mine','crystal','ruin','garden']},
 {wall:'brick',acc:'#4f8f6a',dress:'puddle',mote:'bubble',torch:'#6fd0ff',rooms:['flooded','ruin','mushroom','pond']},
 {wall:'rock',acc:'#d8d23c',dress:'sulfur',mote:'steam',torch:'#d8ff6b',rooms:['pond','bones','crystal','lava']},
 {wall:'basalt',acc:'#ff6a1f',dress:'ash',mote:'ember',torch:'#ff8a3d',rooms:['lava','bones','mine']},
 {wall:'basalt',acc:'#ffd23f',dress:'gold',mote:'spark',torch:'#ffe27a',crystal:'#ffe9a0',rooms:['lava','crystal','mine']}];
function dlStyle(r){const s=r&&!r.tower&&r.sub&&r.sub.k,i=s&&typeof MD_LAYERS!=='undefined'?MD_LAYERS.findIndex(L=>L.subs.includes(s)):-1;return DL_STYLE[i]||DL_STYLE[2]}
function dlPlan(r,fl){if(fl._dl&&fl._dl.id===fl.id)return fl._dl;const R=dvRng('dl'+fl.id),S=dlStyle(r),V=typeof dvPlan==='function'?dvPlan(fl):{voids:new Map(),bridges:new Map()},room=[];
 const free=(x,y)=>!V.voids.has(x+','+y)&&!V.bridges.has(x+','+y);
 const cand=fl.rooms.filter(o=>o[2]>=5&&o[3]>=5&&o[2]*o[3]<120&&!o[5]&&!(fl.houses||[]).some(h=>h[0]===o[0]&&h[1]===o[1]));
 for(let n=0;n<2&&cand.length&&R()<(n?.4:.7);n++){const o=cand.splice(Math.floor(R()*cand.length),1)[0],st=fl.stairs,hasSt=st&&st[0]>=o[0]&&st[0]<o[0]+o[2]&&st[1]>=o[1]&&st[1]<o[1]+o[3];let kind=S.rooms[Math.floor(R()*S.rooms.length)];if(kind==='pond'&&hasSt)kind='garden';const cracks=[];
  if(kind==='lava'){const T=GD_T;for(let i=0;i<5+o[2];i++){let x=(o[0]+R()*o[2])*T,y=(o[1]+R()*o[3])*T;const seg=[[x,y]];for(let k=0;k<5;k++){x=Math.max(o[0]*T+4,Math.min((o[0]+o[2])*T-4,x+(R()-.5)*44));y=Math.max(o[1]*T+4,Math.min((o[1]+o[3])*T-4,y+(R()-.5)*44));seg.push([x,y])}cracks.push(seg)}}
  room.push({o,kind,cracks})}
 const torches=[],drips=[],crystals=[];
 for(let y=0;y<fl.h-1;y++)for(let x=0;x<fl.w;x++){const wall=!(+fl.tiles[y][x]>0)&&!V.voids.has(x+','+y),below=+fl.tiles[y+1][x]>0&&free(x,y+1);if(!wall||!below)continue;
  const r0=R();if(r0<.14)torches.push([x,y]);else if(r0<.24&&(S.mote==='bubble'||S.dress==='moss'||S.dress==='puddle'))drips.push([x,y])}
 if(S.crystal)for(let y=1;y<fl.h-1;y++)for(let x=1;x<fl.w-1;x++){if(+fl.tiles[y][x]>0&&free(x,y)&&!(+fl.tiles[y-1][x]>0)&&R()<.08)crystals.push([x,y])}
 const P={id:fl.id,room,torches:torches.slice(0,10),drips:drips.slice(0,8),crystals:crystals.slice(0,6),free};Object.defineProperty(fl,'_dl',{value:P,enumerable:false,configurable:true,writable:true});return P}
const dlR=(g,c,x,y,w,h)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
// ---------- static paint (into the cached tile canvas, under the existing props) ----------
function dlPaint(g,r,fl,th){if(fl.rc)return;const T=GD_T,S=dlStyle(r),P=dlPlan(r,fl),R=dvRng('dlp'+fl.id),isF=(x,y)=>x>=0&&y>=0&&x<fl.w&&y<fl.h&&+fl.tiles[y][x]>0;P.lights=[];P.puddles=new Set();delete P.fire;delete P.seal;
 if(typeof dpFloor==='function')dpFloor(g,r,fl,th,dvRng('dpf'+fl.id));
 // walls: texture on top, a taller raised face where a wall meets the floor below it
 for(let y=0;y<fl.h;y++)for(let x=0;x<fl.w;x++){if(isF(x,y))continue;const X=x*T,Y=y*T;
  if(S.wall==='brick'){for(let k=0;k<4;k++){dlR(g,'rgba(0,0,0,.18)',X+2,Y+2+k*9+8,T-4,1);dlR(g,'rgba(0,0,0,.18)',X+2+((k+y)%2?18:8),Y+2+k*9,1,9)}}
  else if(S.wall==='basalt'){dlR(g,'rgba(0,0,0,.2)',X+R()*20+4,Y+4,1,T-8);dlR(g,'rgba(0,0,0,.2)',X+4,Y+R()*20+8,T-8,1);if(R()<.25)dlR(g,S.acc+'66',X+6+R()*22,Y+6+R()*22,6,2)}
  else{if(R()<.6){const cx=X+6+R()*24,cy=Y+6+R()*24;dlR(g,'rgba(0,0,0,.2)',cx,cy,8,1);dlR(g,'rgba(0,0,0,.2)',cx+7,cy,1,5)}if(R()<.4)dlR(g,'rgba(255,255,255,.07)',X+4+R()*24,Y+4+R()*24,6,2)}
  if(isF(x,y+1)){const fy=Y+T-14;dlR(g,th.e,X,fy,T,14);dlR(g,'rgba(255,255,255,.14)',X,fy,T,2);dlR(g,'rgba(0,0,0,.3)',X,Y+T-3,T,3);
   if(S.wall==='brick'){dlR(g,'rgba(0,0,0,.28)',X,fy+7,T,1);for(let i=(x%2)*10;i<T;i+=20)dlR(g,'rgba(0,0,0,.28)',X+i,fy+2,1,5);for(let i=((x+1)%2)*10;i<T;i+=20)dlR(g,'rgba(0,0,0,.28)',X+i,fy+8,1,5)}
   else for(let i=3;i<T;i+=7+Math.floor(R()*5))dlR(g,'rgba(0,0,0,.25)',X+i,fy+3,1,8+R()*3);
   if(S.wall==='spike')for(let i=4;i<T;i+=12){g.fillStyle=S.acc;g.beginPath();g.moveTo(X+i,Y+T-3);g.lineTo(X+i+3,Y+T+5);g.lineTo(X+i+6,Y+T-3);g.fill()}
   if(S.dress==='moss')for(let i=2;i<T;i+=6)if(R()<.6)dlR(g,S.acc,X+i,Y+T-3,3,3+R()*6);
   if(S.dress==='sulfur'&&R()<.6)dlR(g,S.acc+'aa',X+R()*28,fy+4,10,3);
   if(S.wall==='basalt'&&R()<.5)dlR(g,S.acc,X+4+R()*28,fy+5+R()*5,8,1)}}
 // floor dressing
 for(let y=0;y<fl.h;y++)for(let x=0;x<fl.w;x++){if(!isF(x,y)||!P.free(x,y)||R()>.13)continue;const X=x*T,Y=y*T,ox=X+6+R()*16,oy=Y+8+R()*18;if(S.dress==='puddle')P.puddles.add(x+','+y);
  ({puddle:()=>{g.fillStyle='rgba(120,190,230,.35)';g.beginPath();g.ellipse(ox+8,oy+5,9+R()*5,4+R()*2,0,0,7);g.fill();dlR(g,'rgba(255,255,255,.5)',ox+4,oy+3,4,1)},
   moss:()=>{for(let k=0;k<5;k++)dlR(g,k%2?S.acc:'#4c7f38',ox+R()*14,oy+R()*10,4,3)},
   crack:()=>{let cx=ox,cy=oy;for(let k=0;k<4;k++){const nx=cx+3+R()*5,ny=cy+(R()-.5)*8;g.strokeStyle='rgba(0,0,0,.28)';g.lineWidth=1;g.beginPath();g.moveTo(cx,cy);g.lineTo(nx,ny);g.stroke();cx=nx;cy=ny}},
   coal:()=>{for(let k=0;k<3;k++)dlR(g,'#2b2b33',ox+R()*14,oy+R()*10,3+R()*3,3);if(R()<.3)dlR(g,'#9f8cff',ox+6,oy+4,2,2)},
   sulfur:()=>{g.fillStyle='rgba(216,210,60,.32)';g.beginPath();g.ellipse(ox+8,oy+5,8+R()*6,5,0,0,7);g.fill()},
   ash:()=>{for(let k=0;k<6;k++)dlR(g,'rgba(60,50,50,.4)',ox+R()*16,oy+R()*12,2,2);if(R()<.4)dlR(g,'#ff6a1f',ox+R()*14,oy+R()*10,2,1)},
   gold:()=>{for(let k=0;k<4;k++)dlR(g,'#ffd23f',ox+R()*16,oy+R()*12,2,2)}})[S.dress]()}
 if(typeof dpEdges==='function')dpEdges(g,r,fl,th,dvRng('dpe'+fl.id),P);
 (fl.houses||[]).forEach(o=>o[4]&&o[4]!=='house'&&typeof dpLandmark==='function'?dpLandmark(g,fl,o,th,R,P):dlHouse(g,fl,o,th,R));
 // special rooms (ponds are painted after the props, so nothing stands in the water)
 dlRooms(g,P,S,false);if(typeof drPaintMech==='function')drPaintMech(g,fl)}
function dlPaintPost(g,r,fl){if(fl.rc)return;const P=dlPlan(r,fl);dlRooms(g,P,dlStyle(r),true)}
function dlRooms(g,P,S,post){const T=GD_T,R=dvRng('dlr'+P.id);P.room.forEach(({o,kind,cracks})=>{if((kind==='pond')!==post)return;const X0=o[0]*T,Y0=o[1]*T,W=o[2]*T,H=o[3]*T,cx=X0+W/2,cy=Y0+H/2;
  if(kind==='pond'){const rx=W/2-T*1.1,ry=H/2-T*1.1,water=S.mote==='steam'?['#7fae4a','#9cc95a']:['#3f8fc4','#5fb0dc'];
   g.fillStyle='#8c8778';g.beginPath();g.ellipse(cx,cy,rx+6,ry+6,0,0,7);g.fill();g.fillStyle=water[0];g.beginPath();g.ellipse(cx,cy,rx,ry,0,0,7);g.fill();
   g.fillStyle=water[1];g.beginPath();g.ellipse(cx-rx*.15,cy-ry*.2,rx*.7,ry*.55,0,0,7);g.fill();
   for(let a=0;a<6.28;a+=.45){dlR(g,R()<.5?'#a29c87':'#77725f',cx+Math.cos(a)*(rx+5)-4,cy+Math.sin(a)*(ry+5)-3,8,6)}
   for(let k=0;k<3;k++){const lx=cx+(R()-.5)*rx,ly=cy+(R()-.5)*ry;g.fillStyle='#5fa04a';g.beginPath();g.arc(lx,ly,5,0,5.6);g.fill()}}
  else if(kind==='garden'){for(let y=o[1];y<o[1]+o[3];y++)for(let x=o[0];x<o[0]+o[2];x++){const X=x*T,Y=y*T;g.fillStyle='rgba(80,140,60,.38)';g.fillRect(X,Y,T,T);
    for(let k=0;k<5;k++)dlR(g,R()<.5?'#6fae4f':'#4c8a38',X+R()*34,Y+R()*34,3,4);
    if(R()<.22){const fx=X+8+R()*20,fy=Y+8+R()*20,c=['#ff8fb8','#ffe36b','#ffffff','#b48cff'][Math.floor(R()*4)];dlR(g,'#4c8a38',fx+2,fy+3,1,5);dlR(g,c,fx,fy,5,4);dlR(g,'#ffd23f',fx+2,fy+1,1,1)}}
   for(let x=o[0];x<o[0]+o[2];x++)for(const y of [o[1],o[1]+o[3]-1])if(R()<.35){g.fillStyle='#3f7a30';g.beginPath();g.arc(x*T+T/2,y*T+T/2,9,0,7);g.fill();dlR(g,'#5fa04a',x*T+T/2-4,y*T+T/2-6,5,4)}}
  else if(kind==='lava'){g.fillStyle='rgba(30,16,14,.45)';g.fillRect(X0,Y0,W,H);g.lineCap='round';
   cracks.forEach(seg=>{g.strokeStyle='#3a1208';g.lineWidth=6;g.beginPath();seg.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();g.strokeStyle='#c2410c';g.lineWidth=3;g.stroke();g.strokeStyle='#ff9a3d';g.lineWidth=1;g.stroke()})}
  else if(typeof drPaintRoom==='function')drPaintRoom(g,o,kind,S,R)})}
// ---------- ambient motion (DOM + CSS animation, rebuilt once per floor) ----------
function dlAmb(field,r){const fl=r&&r.fl,mp=field&&field.querySelector('.gd-map');if(!fl||!mp)return;let el=mp.querySelector('.gd-amb');if(el&&el.dataset.fl===String(fl.id)){if(typeof dpFeet==='function')dpFeet(el,r,fl,dlPlan(r,fl));return}if(el)el.remove();mp.querySelectorAll('.dl-dark').forEach(c=>c.remove());
 const T=GD_T,S=dlStyle(r),P=dlPlan(r,fl),R=dvRng('dla'+fl.id),h=[];el=document.createElement('div');el.className='gd-amb';el.dataset.fl=fl.id;el.style.setProperty('--tc',S.torch);el.style.setProperty('--mc',S.acc);
 const d=()=>(-R()*6).toFixed(2)+'s';
 P.torches.forEach(([x,y])=>h.push('<i class="dl-torch'+(S.mote==='bubble'?' shell':'')+'" style="left:'+(x*T+T/2)+'px;top:'+(y*T+T-14)+'px;animation-delay:'+d()+'"><b></b></i>'));
 P.drips.forEach(([x,y])=>h.push('<i class="dl-drip" style="left:'+(x*T+8+Math.floor(R()*24))+'px;top:'+(y*T+T-2)+'px;animation-delay:'+d()+'"></i>'));
 P.crystals.forEach(([x,y])=>h.push('<i class="dl-crys" style="left:'+(x*T+6+Math.floor(R()*20))+'px;top:'+(y*T+4)+'px;--cc:'+S.crystal+';animation-delay:'+d()+'"></i>'));
 const rooms=fl.rooms.filter(o=>o[2]*o[3]>=12);for(let i=0;i<12&&rooms.length;i++){const o=rooms[Math.floor(R()*rooms.length)],x=(o[0]+R()*o[2])*T,y=(o[1]+R()*o[3])*T;if(!P.free(Math.floor(x/T),Math.floor(y/T)))continue;
  h.push('<i class="dl-mote m-'+S.mote+'" style="left:'+Math.round(x)+'px;top:'+Math.round(y)+'px;animation-delay:'+d()+';animation-duration:'+(5+R()*5).toFixed(1)+'s"></i>')}
 P.room.forEach(({o,kind,cracks})=>{const X0=o[0]*T,Y0=o[1]*T,W=o[2]*T,H=o[3]*T;
  if(kind==='pond'){for(let k=0;k<5;k++)h.push('<i class="dl-glint" style="left:'+Math.round(X0+W/2+(R()-.5)*(W-3*T))+'px;top:'+Math.round(Y0+H/2+(R()-.5)*(H-3*T))+'px;animation-delay:'+d()+'"></i>')}
  else if(kind==='garden'){for(let k=0;k<4;k++)h.push('<i class="dl-fly" style="left:'+Math.round(X0+R()*W)+'px;top:'+Math.round(Y0+R()*H)+'px;animation-delay:'+d()+';--fc:'+['#ff8fb8','#ffe36b','#b48cff','#9dffb0'][k]+'"></i>')}
  else if(kind==='lava'){const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');g.lineCap='round';g.translate(-X0,-Y0);g.strokeStyle='#ffd27a';g.shadowColor='#ff6a1f';g.shadowBlur=8;g.lineWidth=2;
   cracks.forEach(seg=>{g.beginPath();seg.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke()});c.className='dl-lava';c.style.left=X0+'px';c.style.top=Y0+'px';el.appendChild(c);
   for(let k=0;k<5;k++)h.push('<i class="dl-mote m-ember" style="left:'+Math.round(X0+R()*W)+'px;top:'+Math.round(Y0+R()*H)+'px;animation-delay:'+d()+'"></i>')}});
 if(typeof dpAmbient==='function')dpAmbient(el,field,r,fl,P,S,R,h);
 el.insertAdjacentHTML('beforeend',h.join(''));const objs=mp.querySelector('.gd-objs');mp.insertBefore(el,objs||null);
 if(typeof dpLight==='function')mp.insertBefore(dpLight(r,fl,P,S),el);if(typeof dpFeet==='function')dpFeet(el,r,fl,P)}

// ---------- ruined houses: wooden floors, inner walls, windows and scattered debris (walls are real; debris is not) ----------
function dlHouse(g,fl,o,th,R){const T=GD_T,[x0,y0,w,h]=o,isF=(x,y)=>x>=0&&y>=0&&x<fl.w&&y<fl.h&&+fl.tiles[y][x]>0,inH=(x,y)=>x>=x0&&x<x0+w&&y>=y0&&y<y0+h;
 const wood=['#5a4330','#4f3a29','#634a35'],tileA='#3d3a3a',tileB='#343131';
 // floors: tiled kitchen in one corner area, worn planks elsewhere
 const tx=x0+(R()<.5?0:Math.floor(w/2)),ty=y0;
 for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){if(!isF(x,y))continue;const X=x*T,Y=y*T;
  if(x>=tx&&x<tx+Math.ceil(w/2)&&y<ty+Math.floor(h/2)-0){for(let j=0;j<4;j++)for(let i=0;i<4;i++)dlR(g,(i+j)%2?tileA:tileB,X+i*10,Y+j*10,10,10);dlR(g,'rgba(0,0,0,.15)',X,Y,T,1)}
  else{for(let k=0;k<5;k++){dlR(g,wood[(k+y*2+x)%3],X,Y+k*8,T,8);dlR(g,'rgba(0,0,0,.35)',X,Y+k*8+7,T,1);if((k+x)%3===0)dlR(g,'rgba(0,0,0,.35)',X+((k*13+x*7)%30)+4,Y+k*8,1,7)}}
  if(R()<.3){g.fillStyle='rgba(15,12,10,.16)';g.beginPath();g.ellipse(X+20,Y+20,10+R()*6,6+R()*4,R()*3,0,7);g.fill()}}
 // walls: inner walls and the ring around the house look like timber-framed plaster; windows on the outer walls
 for(let y=y0-1;y<=y0+h;y++)for(let x=x0-1;x<=x0+w;x++){if(isF(x,y)||x<0||y<0||x>=fl.w||y>=fl.h)continue;const X=x*T,Y=y*T,ring=!inH(x,y);
  dlR(g,'#2a2422',X,Y,T,T);dlR(g,'#3a322d',X+2,Y+2,T-4,T-4);dlR(g,'#24180f',X,Y+T/2-2,T,4);
  if(isF(x,y+1)){dlR(g,'#4b3a2c',X,Y+T-16,T,16);dlR(g,'#6a5240',X,Y+T-16,T,2);for(let i=4;i<T;i+=9)dlR(g,'#3a2b1f',X+i,Y+T-14,1,13);
   if(ring&&x%3===0){dlR(g,'#1c2a30',X+10,Y+T-30,20,14);dlR(g,'#7fb2c8',X+12,Y+T-28,7,10);dlR(g,'#9cc8da',X+21,Y+T-28,7,10);dlR(g,'#2a2422',X+19,Y+T-28,2,10);if(R()<.5)dlR(g,'#1c2a30',X+14,Y+T-24,10,2)}}
  else if(ring&&(isF(x+1,y)||isF(x-1,y))&&y%3===1){const lx=isF(x+1,y)?X+T-8:X+2;dlR(g,'#1c2a30',lx,Y+8,6,24);dlR(g,'#7fb2c8',lx+1,Y+10,4,20)}}
 // debris: broken crates, planks, a couch, rubble, a toppled chair, shelves along the top wall
 const fx=[];for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)if(isF(x,y))fx.push([x,y]);
 const pick=()=>fx.splice(Math.floor(R()*fx.length),1)[0],put=(f)=>{const p=pick();if(p){if(typeof dpShadow==='function')dpShadow(g,p[0]*T+20,p[1]*T+31,15,4);f(p[0]*T,p[1]*T)}};
 for(let i=0;i<Math.round(fx.length*.22);i++)put([
  (X,Y)=>{dlR(g,'#7a5434',X+8,Y+10,22,18);dlR(g,'#5a3d24',X+8,Y+10,22,3);dlR(g,'#5a3d24',X+8,Y+18,22,2);dlR(g,'#3a2614',X+8,Y+10,2,18);dlR(g,'#3a2614',X+28,Y+10,2,18)},
  (X,Y)=>{g.save();g.translate(X+20,Y+20);g.rotate(R()*3);dlR(g,'#8a6440',-16,-3,32,6);dlR(g,'#5a3d24',-16,2,32,1);g.restore();g.save();g.translate(X+18,Y+24);g.rotate(R()*3);dlR(g,'#7a5434',-12,-2,24,4);g.restore()},
  (X,Y)=>{for(let k=0;k<7;k++)dlR(g,k%2?'#6a6460':'#57524e',X+8+R()*20,Y+10+R()*18,4+R()*5,3+R()*4)},
  (X,Y)=>{dlR(g,'#5a3d24',X+10,Y+14,14,12);dlR(g,'#3a2614',X+10,Y+8,3,8);dlR(g,'#3a2614',X+22,Y+26,3,6);dlR(g,'#3a2614',X+10,Y+26,3,6)},
  (X,Y)=>{g.fillStyle='rgba(180,200,210,.5)';for(let k=0;k<5;k++){g.beginPath();g.moveTo(X+10+R()*20,Y+10+R()*20);g.lineTo(X+14+R()*20,Y+12+R()*20);g.lineTo(X+10+R()*20,Y+16+R()*20);g.fill()}}
 ][Math.floor(R()*5)]);
 if(w>=8)put((X,Y)=>{dlR(g,'#2f4a2c',X+2,Y+6,36,28);dlR(g,'#3f5f3a',X+4,Y+8,32,12);dlR(g,'#3a5536',X+4,Y+22,15,10);dlR(g,'#3a5536',X+21,Y+22,15,10);dlR(g,'#24381f',X+2,Y+6,4,28);dlR(g,'#24381f',X+34,Y+6,4,28)});
 for(let x=x0;x<x0+w;x++)if(isF(x,y0)&&!isF(x,y0-1)&&R()<.3){const X=x*T,Y=y0*T;dlR(g,'#4a2f1b',X+4,Y,32,10);for(let k=0;k<5;k++)dlR(g,['#7a3b3b','#3b5a7a','#6a6a3b','#4a6a4a'][k%4],X+6+k*6,Y+1,4,7)}}
