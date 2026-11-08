// ===================== MYSTERY DUNGEON · vistas (decoration only) =====================
// Some floors open parts of their walls onto deep backgrounds: mine shafts beside rooms, corridors that become rope
// bridges or railways over chasms, and huge rooms that overlook ruins or abandoned wooden houses far below.
// Opened tiles stay walls in the game logic. The background is a separate canvas that scrolls slower (parallax).
const DV_F=.55;   // background moves at 55% of the map's speed
const DV_LAYER=[ // per dungeon layer: far-below glow, haze, rock tone
 {glow:'#3fb6c9',haze:'#123a4a',rock:'#1c2c3a',water:1},{glow:'#6fae5a',haze:'#16261a',rock:'#1f2a20'},{glow:'#c9c2b0',haze:'#24221f',rock:'#2a2622'},
 {glow:'#ffb347',haze:'#14141c',rock:'#1b1b24'},{glow:'#2f7fd6',haze:'#0b1a33',rock:'#101c30',water:1},{glow:'#b8d43c',haze:'#1c2410',rock:'#222a14'},
 {glow:'#ff5a1f',haze:'#2a0d06',rock:'#26100a',lava:1},{glow:'#ffd23f',haze:'#2a2108',rock:'#2b230e',lava:1}];
function dvLayer(r){const s=r&&!r.tower&&r.sub&&r.sub.k,i=s?MD_LAYERS.findIndex(L=>L.subs.includes(s)):-1;return DV_LAYER[i]||{glow:'#8aa0c0',haze:'#141a26',rock:'#1a2030'}}
function dvRng(seed){let s=(typeof mdHash==='function'?mdHash(String(seed)):7)||7;return ()=>{s=(s*16807)%2147483647;return s/2147483647}}
// Work out (once per floor) which wall tiles open up and which corridor tiles become bridges.
function dvLi(r){const s=r&&!r.tower&&r.sub&&r.sub.k;return s&&typeof MD_LAYERS!=='undefined'?MD_LAYERS.findIndex(L=>L.subs.includes(s)):-1}
function dvPlan(fl,r){if(fl._dv&&fl._dv.id===fl.id)return fl._dv;const li=dvLi(r||(typeof runOf==='function'?runOf():null));const R=dvRng('dv'+fl.id),W=fl.w,H=fl.h,fl1=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&+fl.tiles[y][x]>0,
 inRoom=(x,y)=>fl.rooms.some(o=>x>=o[0]&&x<o[0]+o[2]&&y>=o[1]&&y<o[1]+o[3]),voids=new Map(),bridges=new Map(),scenes=[];
 const wallOK=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&!fl1(x,y);
 const open=(cells,kind)=>{const ok=cells.filter(c=>!voids.has(c[0]+','+c[1]));if(ok.length<3)return false;ok.forEach(c=>voids.set(c[0]+','+c[1],kind));const xs=ok.map(c=>c[0]),ys=ok.map(c=>c[1]);scenes.push({kind,x0:Math.min(...xs),y0:Math.min(...ys),x1:Math.max(...xs),y1:Math.max(...ys)});return true};
 // 1) bridges / railways: the longest straight 1-wide corridor run
 if(R()<.5){let best=null;
  for(const hz of [1,0])for(let a=1;a<(hz?H:W)-1;a++){let run=[];for(let b=0;b<=(hz?W:H);b++){const x=hz?b:a,y=hz?a:b,n1=hz?[x,y-1]:[x-1,y],n2=hz?[x,y+1]:[x+1,y];
   if(fl1(x,y)&&!inRoom(x,y)&&!fl1(...n1)&&!fl1(...n2))run.push([x,y]);else{if(run.length>=4&&(!best||run.length>best.run.length))best={run,hz};run=[]}}}
  if(best){const {run,hz}=best,cells=[],own=(a,b)=>run.some(c=>c[0]===a&&c[1]===b),rail=R()<.45;
   run.slice(1,-1).forEach(([x,y])=>{for(const s of [-1,1])for(let d=1;d<=2;d++){const a=hz?x:x+s*d,b=hz?y+s*d:y;if(wallOK(a,b,own))cells.push([a,b])}});
   if(open(cells,'chasm'))run.slice(1,-1).forEach(([x,y])=>bridges.set(x+','+y,{hz,rail}))}}
 // 2) huge rooms overlook ruins or abandoned houses far below
 const isH=o=>(fl.houses||[]).some(h=>h[0]===o[0]&&h[1]===o[1]),big=fl.rooms.filter(o=>o[2]*o[3]>=42&&!isH(o)).sort((a,b)=>b[2]*b[3]-a[2]*a[3]);
 if(big.length&&R()<.45){const o=big[0],own=(a,b)=>a>=o[0]&&a<o[0]+o[2]&&b>=o[1]&&b<o[1]+o[3],kinds=['ruins','houses','fossil',...([0,4].includes(li)?['ship','ship']:[]),...([2,3,7].includes(li)?['crystal','crystal']:[])],kind=kinds[Math.floor(R()*kinds.length)];
  for(const side of [0,1,2,3].sort(()=>R()-.5).slice(0,2)){const cells=[];
   for(let d=1;d<=5;d++)for(let k=0;k<(side%2?o[3]:o[2]);k++){const x=side===0?o[0]+k:side===2?o[0]+k:side===1?o[0]+o[2]-1+d:o[0]-d,y=side===0?o[1]-d:side===2?o[1]+o[3]-1+d:o[1]+k;if(wallOK(x,y,own))cells.push([x,y])}
   open(cells,kind)}}
 // 3) mine shafts opening beside rooms
 const nm=R()<.55?1+(R()<.4):0;for(let i=0;i<nm;i++){const o=fl.rooms[Math.floor(R()*fl.rooms.length)];if(!o)break;if((fl.houses||[]).some(h=>h[0]===o[0]&&h[1]===o[1]))continue;const own=(a,b)=>a>=o[0]&&a<o[0]+o[2]&&b>=o[1]&&b<o[1]+o[3],side=Math.floor(R()*4),len=3+Math.floor(R()*4),dep=2+Math.floor(R()*3),cells=[];
  const span=side%2?o[3]:o[2],st=Math.max(0,Math.floor(R()*(span-len)));
  for(let d=1;d<=dep;d++)for(let k=st;k<st+len&&k<span;k++){const x=side===0||side===2?o[0]+k:side===1?o[0]+o[2]-1+d:o[0]-d,y=side===0?o[1]-d:side===2?o[1]+o[3]-1+d:o[1]+k;if(wallOK(x,y,own))cells.push([x,y])}
  if(!cells.some(([x,y])=>[...voids.keys()].some(k=>{const [a,b]=k.split(',').map(Number);return Math.abs(a-x)+Math.abs(b-y)<5})))open(cells,'mine')}
 Object.defineProperty(fl,'_dv',{value:{id:fl.id,voids,bridges,scenes},enumerable:false,configurable:true,writable:true});return fl._dv}
// Cut the opened tiles out of the tile canvas, draw cliff lips, and lay the bridges.
function dvApply(g,r,fl,th){if(fl.rc)return;const P=dvPlan(fl),T=GD_T;if(!P.voids.size)return;const isV=(x,y)=>P.voids.has(x+','+y);
 P.voids.forEach((k,key)=>{const [x,y]=key.split(',').map(Number),X=x*T,Y=y*T;g.clearRect(X,Y,T,T);
  if(!isV(x,y-1)){g.fillStyle=th.e;g.fillRect(X,Y,T,9);g.fillStyle='rgba(0,0,0,.35)';g.fillRect(X,Y+9,T,5);g.fillStyle=th.g;for(let i=4;i<T;i+=11)g.fillRect(X+i,Y+2,4,2)}
  if(!isV(x-1,y)){g.fillStyle='rgba(0,0,0,.45)';g.fillRect(X,Y,3,T)}if(!isV(x+1,y)){g.fillStyle='rgba(0,0,0,.45)';g.fillRect(X+T-3,Y,3,T)}
  if(!isV(x,y+1)){g.fillStyle=th.w2;g.fillRect(X,Y+T-4,T,4)}});
 P.bridges.forEach((b,key)=>{const [x,y]=key.split(',').map(Number),X=x*T,Y=y*T;g.clearRect(X,Y,T,T);const wood=['#8a5a32','#7a4e2a','#966438'];
  if(b.hz){for(let i=0;i<T;i+=8){g.fillStyle=wood[(i/8+x)%3];g.fillRect(X+i,Y+5,7,T-10)}g.fillStyle='#4a2f18';g.fillRect(X,Y+5,T,2);g.fillRect(X,Y+T-7,T,2);
   if(b.rail){g.fillStyle='#b9c2cc';g.fillRect(X,Y+12,T,3);g.fillRect(X,Y+T-15,T,3);g.fillStyle='#6d7680';g.fillRect(X,Y+15,T,1);g.fillRect(X,Y+T-12,T,1)}
   else{g.fillStyle='#d8c48e';g.fillRect(X,Y+2,T,2);g.fillRect(X,Y+T-4,T,2);g.fillStyle='#5a3a1e';g.fillRect(X+2,Y,3,6);g.fillRect(X+2,Y+T-6,3,6)}}
  else{for(let i=0;i<T;i+=8){g.fillStyle=wood[(i/8+y)%3];g.fillRect(X+5,Y+i,T-10,7)}g.fillStyle='#4a2f18';g.fillRect(X+5,Y,2,T);g.fillRect(X+T-7,Y,2,T);
   if(b.rail){g.fillStyle='#b9c2cc';g.fillRect(X+12,Y,3,T);g.fillRect(X+T-15,Y,3,T);g.fillStyle='#6d7680';g.fillRect(X+15,Y,1,T);g.fillRect(X+T-12,Y,1,T)}
   else{g.fillStyle='#d8c48e';g.fillRect(X+2,Y,2,T);g.fillRect(X+T-4,Y,2,T);g.fillStyle='#5a3a1e';g.fillRect(X,Y+2,6,3);g.fillRect(X+T-6,Y+2,6,3)}}})}
// ---------- the deep background ----------
function dvPaint(r,fl){const P=dvPlan(fl),T=GD_T,mw=fl.w*T,mh=fl.h*T,ox=(1-DV_F)*mw,oy=(1-DV_F)*mh,c=document.createElement('canvas');c.width=Math.ceil(mw+ox);c.height=Math.ceil(mh+oy);
 const g=c.getContext('2d'),L=dvLayer(r),R=dvRng('deep'+fl.id),Wv=400,Hv=560,px=x=>DV_F*x*T+(1-DV_F)*(Wv/2)+ox,py=y=>DV_F*y*T+(1-DV_F)*(Hv/2)+oy;
 // abyss: haze fading into a glow far below
 let gr=g.createLinearGradient(0,0,0,c.height);gr.addColorStop(0,'#05060a');gr.addColorStop(.6,L.haze);gr.addColorStop(1,L.glow+'55');g.fillStyle=gr;g.fillRect(0,0,c.width,c.height);
 for(let i=0;i<260;i++){g.fillStyle=R()<.5?L.rock:'rgba(0,0,0,.35)';const w=8+R()*60,h=4+R()*14;g.fillRect(Math.round(R()*c.width),Math.round(R()*c.height),Math.round(w),Math.round(h))}
 for(let i=0;i<90;i++){g.fillStyle=L.glow+(R()<.3?'aa':'44');g.fillRect(Math.round(R()*c.width),Math.round(R()*c.height),2,2)}
 [...P.scenes].sort((a,b)=>(a.kind==='mine'?0:/chasm|waterfall/.test(a.kind)?1:2)-(b.kind==='mine'?0:/chasm|waterfall/.test(b.kind)?1:2)).forEach(s=>{const x0=px(s.x0-1.5),y0=py(s.y0-1.5),x1=px(s.x1+2.5),y1=py(s.y1+2.5),w=Math.max(T*3,x1-x0),h=Math.max(T*3,y1-y0);g.save();g.beginPath();g.rect(x0-T,y0-T,w+T*2,h+T*2);g.clip();
  ({mine:dvMine,chasm:dvChasm,ruins:dvRuins,houses:dvHouses,ship:dvShip,fossil:dvFossil,crystal:dvCrystal,waterfall:dvFall})[s.kind](g,x0-T,y0-T,w+T*2,h+T*2,L,R);g.restore()});
 return c}
const dvR=(g,c,x,y,w,h)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
function dvDepth(g,x,y,w,h,L){const gr=g.createLinearGradient(0,y,0,y+h);gr.addColorStop(0,'rgba(0,0,0,.4)');gr.addColorStop(.6,'rgba(0,0,0,.05)');gr.addColorStop(1,L.glow+'40');g.fillStyle=gr;g.fillRect(x,y,w,h)}
function dvMine(g,x,y,w,h,L,R){dvR(g,'#0d0c10',x,y,w,h);for(let i=0;i<30;i++)dvR(g,L.rock,x+R()*w,y+R()*h,10+R()*30,4+R()*8);
 const n=Math.max(2,Math.round(w/70));for(let i=0;i<n;i++){const bx=x+(i+.5)*w/n,s=.6+.4*((i%2)?.7:1);  // receding timber frames
  dvR(g,'#4a2e18',bx-26*s,y+h*.15,7*s,h*.75);dvR(g,'#4a2e18',bx+19*s,y+h*.15,7*s,h*.75);dvR(g,'#5e3a1e',bx-30*s,y+h*.15,60*s,8*s);
  dvR(g,'#2a1a0e',bx-26*s,y+h*.15+8*s,7*s,3);dvR(g,L.glow,bx-3,y+h*.15+12*s,6,8);g.fillStyle=L.glow+'33';g.beginPath();g.arc(bx,y+h*.15+16*s,18*s,0,7);g.fill()}
 for(let k=0;k<2;k++){const ry=y+h*(.55+k*.25);dvR(g,'#3a2a1c',x,ry,w,6);for(let i=0;i<w;i+=14)dvR(g,'#2a1c10',x+i,ry-2,8,10);dvR(g,'#8d96a0',x,ry,w,2);dvR(g,'#8d96a0',x,ry+5,w,2)}
 const cx=x+w*.3+R()*w*.4,cy=y+h*.55;dvR(g,'#5c4330',cx,cy-16,30,14);dvR(g,'#3d2b1d',cx+3,cy-2,8,8);dvR(g,'#3d2b1d',cx+19,cy-2,8,8);dvR(g,'#6c7076',cx+4,cy-20,22,6);  // mine cart
 for(let i=0;i<14;i++)dvR(g,R()<.5?'#cfe8ff':L.glow,x+R()*w,y+R()*h,3,3);dvDepth(g,x,y,w,h,L)}
function dvChasm(g,x,y,w,h,L,R){const gr=g.createLinearGradient(0,y,0,y+h);gr.addColorStop(0,'#030305');gr.addColorStop(1,L.haze);g.fillStyle=gr;g.fillRect(x,y,w,h);
 for(let i=0;i<7;i++){const sw=18+R()*40,sx=x+R()*w,sh=h*(.4+R()*.6);dvR(g,L.rock,sx,y+h-sh,sw,sh);dvR(g,'rgba(255,255,255,.05)',sx,y+h-sh,4,sh);dvR(g,'rgba(0,0,0,.3)',sx+sw-5,y+h-sh,5,sh)}
 for(let k=0;k<3;k++){g.fillStyle='rgba(200,215,235,'+(.05+k*.03)+')';g.fillRect(x,y+h*(.45+k*.15),w,10+k*4)}
 if(L.water||L.lava){const c=L.lava?'#ff6a2a':'#3a9fd0';dvR(g,c+'88',x,y+h-14,w,14);for(let i=0;i<w;i+=18)dvR(g,L.lava?'#ffd27a':'#bfe6ff',x+i+R()*8,y+h-12+R()*6,8,2)}
 else for(let i=0;i<20;i++)dvR(g,L.glow+'88',x+R()*w,y+h*.7+R()*h*.3,2,2);dvDepth(g,x,y,w,h,L)}
function dvRuins(g,x,y,w,h,L,R){dvChasm(g,x,y,w,h,L,R);const stone=['#8c8778','#77725f','#a29c87'],base=y+h*.86;dvR(g,'#5d594b',x,base,w,h-(base-y));
 for(let i=0;i<w;i+=26){const st=stone[Math.floor(R()*3)];dvR(g,st,x+i,base-6,24,6)}
 for(let i=0;i<Math.max(3,w/55);i++){const cx=x+20+R()*(w-40),ch=30+R()*70,broken=R()<.5;dvR(g,stone[0],cx,base-ch,14,ch);dvR(g,stone[2],cx,base-ch,3,ch);dvR(g,'#5d594b',cx+11,base-ch,3,ch);
  if(!broken){dvR(g,stone[1],cx-4,base-ch-6,22,6)}else{dvR(g,stone[1],cx+14,base-8,18,8);dvR(g,stone[1],cx+30,base-5,10,5)}if(R()<.5)dvR(g,'#5f8a4a',cx,base-ch*(.3+R()*.4),14,4)}
 if(w>140){const ax=x+w*.5-34,ah=60;dvR(g,stone[0],ax,base-ah,10,ah);dvR(g,stone[0],ax+58,base-ah,10,ah);for(let k=0;k<7;k++)dvR(g,stone[k%2?1:2],ax+k*10-1,base-ah-6-Math.sin(k/6*Math.PI)*16,12,8)}
 for(let i=0;i<12;i++)dvR(g,L.glow+'99',x+R()*w,y+R()*h*.8,2,2);dvDepth(g,x,y,w,h,L)}
function dvHouses(g,x,y,w,h,L,R){dvChasm(g,x,y,w,h,L,R);const base=y+h*.86;dvR(g,'#4a3828',x,base,w,h-(base-y));g.fillStyle=L.glow+'26';g.fillRect(x,base-60,w,60);
 for(let i=0;i<Math.max(2,w/70);i++){const hx=x+12+R()*(w-70),hw=40+R()*22,hh=26+R()*16,tilt=R()<.4,top=base-hh;
  dvR(g,'#9a6e44',hx,top,hw,hh);for(let k=0;k<hh;k+=6)dvR(g,'#7a5434',hx,top+k,hw,2);dvR(g,'#b38556',hx,top,3,hh);
  g.fillStyle='#6a3f22';g.beginPath();g.moveTo(hx-6,top);g.lineTo(hx+hw/2,top-20-(tilt?6:0));g.lineTo(hx+hw+6,top+(tilt?6:0));g.closePath();g.fill();
  dvR(g,'#1a120c',hx+hw*.2,top+8,9,9);dvR(g,R()<.6?'#ffd27a':'#1a120c',hx+hw*.62,top+8,9,9);dvR(g,'#24180f',hx+hw*.42,base-14,10,14);if(tilt)dvR(g,'#7d5a38',hx+hw-6,top+4,4,hh-4)}
 for(let i=0;i<w;i+=10)dvR(g,'#7a5434',x+i,base-8,3,8);dvR(g,'#7a5434',x,base-6,w,2);
 for(let i=0;i<6;i++){const lx=x+R()*w,ly=y+R()*h*.4;dvR(g,'#3a2a1c',lx,y,1,ly-y);dvR(g,L.glow,lx-2,ly,5,6)}dvDepth(g,x,y,w,h,L)}
// put the background behind the tiles (once per floor) and keep it in step with the camera
function dvDeep(field,r){const fl=r&&r.fl;if(!fl||!field)return;const mp=field.querySelector('.gd-map');if(!mp)return;let c=mp.querySelector('.gd-deep');const P=dvPlan(fl);
 if(!P.voids.size&&!P.bridges.size){mp.querySelectorAll('.gd-deepwrap').forEach(w=>w.remove());return}
 if(c&&c.dataset.fl===String(fl.id))return;mp.querySelectorAll('.gd-deepwrap').forEach(w=>w.remove());c=dvPaint(r,fl);c.className='gd-deep';c.dataset.fl=fl.id;c.style.left=-(1-DV_F)*fl.w*GD_T+'px';c.style.top=-(1-DV_F)*fl.h*GD_T+'px';
 // the background is larger than the map (for parallax); clip it to the map so it never shows past the edges
 const wrap=document.createElement('div');wrap.className='gd-deepwrap';wrap.style.width=fl.w*GD_T+'px';wrap.style.height=fl.h*GD_T+'px';wrap.appendChild(c);mp.prepend(wrap);
 if(DG&&DG.cam)dvParallax(mp,DG.cam.tx,DG.cam.ty,DG.cam.T/GD_T)}
function dvParallax(mp,tx,ty,sc){const c=mp&&mp.querySelector('.gd-deep');if(!c)return;sc=sc||1;c.style.transform='translate('+Math.round((DV_F-1)*tx/sc)+'px,'+Math.round((DV_F-1)*ty/sc)+'px)'}

function dvShip(g,x,y,w,h,L,R){dvChasm(g,x,y,w,h,L,R);const base=y+h*.88,sx=x+w*.18,sw=w*.64,tilt=.12;g.save();g.translate(sx+sw/2,base-20);g.rotate(tilt);
 g.fillStyle='#4a3020';g.beginPath();g.moveTo(-sw/2,-18);g.lineTo(sw/2,-26);g.lineTo(sw/2-22,10);g.lineTo(-sw/2+16,12);g.closePath();g.fill();
 for(let k=-18;k<8;k+=6){g.fillStyle='#3a2416';g.fillRect(-sw/2+8,k,sw-24,2)}g.fillStyle='#1a120c';g.fillRect(-sw*.1,-10,14,10);g.fillRect(sw*.15,-14,10,8);
 g.fillStyle='#5a3a24';g.fillRect(-6,-sw*.45,6,sw*.45-18);g.fillRect(-sw*.25,-8-sw*.3,6,sw*.3);g.fillStyle='#8a7a60';g.fillRect(-1,-sw*.42,sw*.18,sw*.16);g.fillStyle='#6a5a40';g.fillRect(-1,-sw*.42+sw*.16,sw*.12,4);g.restore();
 dvR(g,'#2a2a2a',x,base,w,h-(base-y));for(let i=0;i<10;i++)dvR(g,L.glow+'88',x+R()*w,y+R()*h*.7,2,2);for(let i=0;i<6;i++){const kx=x+R()*w;dvR(g,'#2f5f3a',kx,base-30-R()*30,3,40)}dvDepth(g,x,y,w,h,L)}
function dvFossil(g,x,y,w,h,L,R){dvChasm(g,x,y,w,h,L,R);const base=y+h*.86,bone='#d9cfb4',sh='#a89f86',cx=x+w*.5,sw=Math.min(w*.8,320);dvR(g,'#4a4236',x,base,w,h-(base-y));
 for(let i=0;i<9;i++){const bx=cx-sw/2+i*sw/10,bh=18+Math.sin(i/9*Math.PI)*28;dvR(g,bone,bx,base-30-bh,5,bh);dvR(g,sh,bx+4,base-30-bh,1,bh)}  // ribs
 dvR(g,bone,cx-sw/2,base-34,sw,6);for(let i=0;i<14;i++)dvR(g,bone,cx-sw/2+i*sw/14,base-38,6,10);  // spine
 const hx=cx+sw/2-6;dvR(g,bone,hx,base-58,44,26);dvR(g,'#2a2620',hx+26,base-50,8,8);for(let i=0;i<6;i++)dvR(g,bone,hx+6+i*6,base-34,3,7);dvR(g,sh,hx,base-36,44,3);  // skull
 for(let i=0;i<10;i++)dvR(g,bone,cx-sw/2-10-i*12,base-30+i*1.5,9,5);dvDepth(g,x,y,w,h,L)}
function dvCrystal(g,x,y,w,h,L,R){dvChasm(g,x,y,w,h,L,R);const cols=['#9f8cff','#7fd6ff','#ff9fd8',L.glow];
 for(let i=0;i<Math.max(6,w/18);i++){const cx=x+R()*w,ch=24+R()*70,cw=10+R()*14,c=cols[Math.floor(R()*cols.length)],by=y+h-R()*h*.15;
  g.fillStyle=c+'33';g.beginPath();g.arc(cx,by-ch/2,ch*.7,0,7);g.fill();g.fillStyle=c;g.beginPath();g.moveTo(cx-cw/2,by);g.lineTo(cx-cw/3,by-ch*.8);g.lineTo(cx,by-ch);g.lineTo(cx+cw/3,by-ch*.8);g.lineTo(cx+cw/2,by);g.closePath();g.fill();
  g.fillStyle='rgba(255,255,255,.45)';g.fillRect(Math.round(cx-cw/4),Math.round(by-ch*.8),2,Math.round(ch*.6))}
 for(let i=0;i<20;i++)dvR(g,'#ffffffaa',x+R()*w,y+R()*h,2,2);dvDepth(g,x,y,w,h,L)}
function dvFall(g,x,y,w,h,L,R){dvChasm(g,x,y,w,h,L,R);const fx=x+w*.35,fw=Math.max(30,w*.3);
 for(let i=0;i<fw;i+=3){const c=i%9<3?'#cfeeff':i%9<6?'#8fc8ea':'#5fa8d8';dvR(g,c,fx+i,y,3,h)}
 g.fillStyle='rgba(230,245,255,.35)';for(let k=0;k<4;k++){g.beginPath();g.ellipse(fx+fw/2,y+h-6,fw*(.7+k*.25),10+k*4,0,0,7);g.fill()}
 dvR(g,'#3a9fd0aa',x,y+h-12,w,12);dvDepth(g,x,y,w,h,L)}
