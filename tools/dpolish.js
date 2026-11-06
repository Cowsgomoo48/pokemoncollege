// ===================== MYSTERY DUNGEON · polish (decoration only, except landmark walls made in dgrid.js) =====================
// Softer floor checker, blended floor patches, uneven wall edges with rubble, dark "void" for deep wall, corridor
// dressing, landmark rooms, boss-arena dressing, lighting, mist, cave weather and small reactions to footsteps.
const DP_DARK=[.1,.18,.22,.34,.3,.3,.24,.38],DP_SAND=new Set(['tidal','driftwood','shellstone','saltstone','saltbound']);
const dpLi=r=>typeof dvLi==='function'?dvLi(r):-1;
function dpMix(a,b,t){const p=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)),A=p(a),B=p(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')}
function dpShadow(g,x,y,rx,ry){g.fillStyle='rgba(0,0,0,.22)';g.beginPath();g.ellipse(x,y,rx,ry,0,0,7);g.fill()}
// ---------- floors: softer checker + blended patches of a second material ----------
function dpFloor(g,r,fl,th,R){const T=GD_T,isF=(x,y)=>x>=0&&y>=0&&x<fl.w&&y<fl.h&&+fl.tiles[y][x]>0,mid=dpMix(th.f1,th.f2,.5);
 g.globalAlpha=.55;for(let y=0;y<fl.h;y++)for(let x=0;x<fl.w;x++)if(isF(x,y)){g.fillStyle=mid;g.fillRect(x*T,y*T,T,T)}g.globalAlpha=1;
 const alt=[dpMix(th.f1,th.e,.25),dpMix(th.f2,th.g,.45),dpMix(th.f1,'#ffffff',.18)],blobs=[];for(let i=0;i<4+Math.floor(R()*4);i++)blobs.push([R()*fl.w*T,R()*fl.h*T,(1.5+R()*2.5)*T,alt[i%3]]);
 const S=10;for(let y=0;y<fl.h;y++)for(let x=0;x<fl.w;x++){if(!isF(x,y))continue;for(let j=0;j<T;j+=S)for(let i=0;i<T;i+=S){const px=x*T+i+S/2,py=y*T+j+S/2;
  for(const [bx,by,br,c] of blobs){const d=Math.hypot(px-bx,py-by)/br;if(d<1){g.globalAlpha=(1-d)*.55;g.fillStyle=c;g.fillRect(x*T+i,y*T+j,S,S)}}}}g.globalAlpha=1}
// ---------- edges, rubble, void walls, corridors, arena ----------
function dpEdges(g,r,fl,th,R,P){const T=GD_T,isF=(x,y)=>x>=0&&y>=0&&x<fl.w&&y<fl.h&&+fl.tiles[y][x]>0,V=typeof dvPlan==='function'?dvPlan(fl,r):{voids:new Map(),bridges:new Map()},inH=(x,y)=>(fl.houses||[]).some(o=>x>=o[0]-1&&x<=o[0]+o[2]&&y>=o[1]-1&&y<=o[1]+o[3]);
 // void: wall far from any floor fades to near-black
 for(let y=0;y<fl.h;y++)for(let x=0;x<fl.w;x++){if(isF(x,y)||V.voids.has(x+','+y))continue;let d=9;for(let j=-3;j<=3;j++)for(let i=-3;i<=3;i++)if(isF(x+i,y+j))d=Math.min(d,Math.max(Math.abs(i),Math.abs(j)));
  if(d>=2){g.fillStyle='rgba(6,7,12,'+(d===2?.38:.72)+')';g.fillRect(x*T,y*T,T,T)}}
 // uneven edges and rounded inner corners where floor meets wall; pebbles along wall bases
 const wc=th.w2;for(let y=0;y<fl.h;y++)for(let x=0;x<fl.w;x++){if(!isF(x,y)||inH(x,y))continue;const X=x*T,Y=y*T,wL=!isF(x-1,y)&&!V.voids.has((x-1)+','+y),wR=!isF(x+1,y)&&!V.voids.has((x+1)+','+y),wU=!isF(x,y-1)&&!V.voids.has(x+','+(y-1)),wD=!isF(x,y+1)&&!V.voids.has(x+','+(y+1));
  g.fillStyle=wc;
  if(wL)for(let k=0;k<T;k+=6)if(R()<.5)g.fillRect(X,Y+k,1+Math.floor(R()*3),6);if(wR)for(let k=0;k<T;k+=6)if(R()<.5){const w=1+Math.floor(R()*3);g.fillRect(X+T-w,Y+k,w,6)}
  if(wD)for(let k=0;k<T;k+=6)if(R()<.5){const h=1+Math.floor(R()*3);g.fillRect(X+k,Y+T-h,6,h)}
  for(const [a,b,cx,cy] of [[wL,wU,X,Y],[wR,wU,X+T,Y],[wL,wD,X,Y+T],[wR,wD,X+T,Y+T]])if(a&&b){g.beginPath();g.moveTo(cx,cy);g.lineTo(cx+(cx===X?9:-9),cy);g.quadraticCurveTo(cx+(cx===X?2:-2),cy+(cy===Y?2:-2),cx,cy+(cy===Y?9:-9));g.closePath();g.fill()}
  if(wU)for(let k=0;k<3;k++)if(R()<.55){const px=X+3+R()*(T-8),py=Y+2+R()*6;dpShadow(g,px+2,py+3,3,1.5);g.fillStyle=R()<.5?th.e:th.w1;g.fillRect(Math.round(px),Math.round(py),3+Math.floor(R()*3),2+Math.floor(R()*2))}}
 // corridors: rails (stalagmite/deepslate/core), rope lines elsewhere, lantern posts every few tiles
 const li=dpLi(r),rails=[2,3,7].includes(li),inRoom=(x,y)=>fl.rooms.some(o=>x>=o[0]&&x<o[0]+o[2]&&y>=o[1]&&y<o[1]+o[3]);
 if(R()<.75){let n=0;for(let y=0;y<fl.h;y++)for(let x=0;x<fl.w;x++){if(+fl.tiles[y][x]!==2||inRoom(x,y)||V.bridges.has(x+','+y))continue;const X=x*T,Y=y*T,hz=isF(x-1,y)&&isF(x+1,y)&&!isF(x,y-1)&&!isF(x,y+1),vt=isF(x,y-1)&&isF(x,y+1)&&!isF(x-1,y)&&!isF(x+1,y);if(!hz&&!vt)continue;n++;
  if(rails){if(hz){for(let i=2;i<T;i+=10)g.fillStyle='#4a3020',g.fillRect(X+i,Y+11,5,18);g.fillStyle='#9aa4ae';g.fillRect(X,Y+14,T,2);g.fillRect(X,Y+24,T,2)}
   else{for(let i=2;i<T;i+=10)g.fillStyle='#4a3020',g.fillRect(X+11,Y+i,18,5);g.fillStyle='#9aa4ae';g.fillRect(X+14,Y,2,T);g.fillRect(X+24,Y,2,T)}}
  else{g.strokeStyle='#b89a64';g.lineWidth=1.5;g.beginPath();if(hz){g.moveTo(X,Y+4);g.quadraticCurveTo(X+T/2,Y+9,X+T,Y+4);g.moveTo(X,Y+T-4);g.quadraticCurveTo(X+T/2,Y+T+1,X+T,Y+T-4)}else{g.moveTo(X+4,Y);g.quadraticCurveTo(X+9,Y+T/2,X+4,Y+T);g.moveTo(X+T-4,Y);g.quadraticCurveTo(X+T+1,Y+T/2,X+T-4,Y+T)}g.stroke();
   g.fillStyle='#5a3a1e';if(hz){g.fillRect(X,Y+1,3,6);g.fillRect(X,Y+T-7,3,6)}else{g.fillRect(X+1,Y,6,3);g.fillRect(X+T-7,Y,6,3)}}
  if(n%4===2){const lx=hz?X+T/2:X+3,ly=hz?Y+2:Y+T/2;dpShadow(g,lx+2,ly+6,4,2);g.fillStyle='#3a2614';g.fillRect(lx,ly-10,2,14);g.fillStyle='#ffd27a';g.fillRect(lx-2,ly-14,6,5);P.lights.push([lx+1,ly-12,62,'lamp'])}}}
 // boss arena: banners on the top wall, pillar caps on the corners, a seal on the floor
 if(fl.boss&&fl.stairs&&!fl.rc){const o=fl.rooms.find(o=>fl.stairs[0]>=o[0]&&fl.stairs[0]<o[0]+o[2]&&fl.stairs[1]>=o[1]&&fl.stairs[1]<o[1]+o[3]);if(o){const S=typeof dlStyle==='function'?dlStyle(r):{acc:'#c9c2b0',torch:'#ffd08a'},cx=(o[0]+o[2]/2)*T,cy=(o[1]+o[3]/2)*T;
  for(let x=o[0];x<o[0]+o[2];x+=2){const X=x*T+T/2-7,Y=(o[1]-1)*T+T-14;dpShadow(g,X+7,Y+30,8,2);g.fillStyle='#5a1820';g.fillRect(X,Y,14,26);g.fillStyle=S.acc;g.fillRect(X,Y,14,3);g.fillRect(X+5,Y+10,4,8);g.fillStyle='#5a1820';g.beginPath();g.moveTo(X,Y+26);g.lineTo(X+7,Y+32);g.lineTo(X+14,Y+26);g.fill()}
  for(const [px,py] of [[o[0]-1,o[1]-1],[o[0]+o[2],o[1]-1],[o[0]-1,o[1]+o[3]],[o[0]+o[2],o[1]+o[3]]]){const X=px*T,Y=py*T;g.fillStyle='#8a8576';g.fillRect(X+6,Y+6,T-12,T-12);g.fillStyle='#a8a291';g.fillRect(X+6,Y+6,T-12,4);g.fillStyle='rgba(0,0,0,.3)';g.fillRect(X+T-10,Y+6,4,T-12)}
  const rr=Math.max(8,Math.min(o[2],o[3])*T*.32);g.strokeStyle=S.acc;g.lineWidth=3;g.globalAlpha=.55;g.beginPath();g.arc(cx,cy,rr,0,7);g.stroke();g.beginPath();g.arc(cx,cy,rr*.7,0,7);g.stroke();
  for(let k=0;k<6;k++){const a=k*Math.PI/3;g.beginPath();g.moveTo(cx+Math.cos(a)*rr*.7,cy+Math.sin(a)*rr*.7);g.lineTo(cx+Math.cos(a+2.09)*rr*.7,cy+Math.sin(a+2.09)*rr*.7);g.stroke()}g.globalAlpha=1;
  P.lights.push([cx,cy,rr*1.4,'seal']);P.seal=[cx,cy,rr]}}}
// ---------- landmark rooms (their walls are real; see gdLandmark) ----------
function dpLandmark(g,fl,o,th,R,P){const T=GD_T,[x0,y0,w,h,kind]=o,isF=(x,y)=>x>=0&&y>=0&&x<fl.w&&y<fl.h&&+fl.tiles[y][x]>0,inH=(x,y)=>x>=x0&&x<x0+w&&y>=y0&&y<y0+h,cx=(x0+w/2)*T,cy=(y0+h/2)*T;
 const floorT=kind==='shrine'?['#8d887a','#7f7a6d']:kind==='camp'?['#7a6448','#6e5940']:kind==='library'?['#4f3a29','#5a4330']:['#5a4330','#634a35'];
 for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){const X=x*T,Y=y*T;
  if(kind==='shrine'){g.fillStyle=floorT[(x+y)%2];g.fillRect(X,Y,T,T);g.fillStyle='rgba(0,0,0,.18)';g.fillRect(X,Y,T,1);g.fillRect(X,Y,1,T)}
  else if(kind==='camp'){g.fillStyle=floorT[0];g.fillRect(X,Y,T,T);for(let k=0;k<5;k++){g.fillStyle=R()<.5?floorT[1]:'#86704f';g.fillRect(X+R()*36,Y+R()*36,3+R()*4,2)}}
  else{for(let k=0;k<5;k++){g.fillStyle=floorT[(k+x+y)%2];g.fillRect(X,Y+k*8,T,8);g.fillStyle='rgba(0,0,0,.35)';g.fillRect(X,Y+k*8+7,T,1)}}
  if(kind==='library'&&R()<.35){g.fillStyle='rgba(90,160,210,.38)';g.beginPath();g.ellipse(X+20,Y+22,16+R()*6,9+R()*4,0,0,7);g.fill();g.fillStyle='rgba(255,255,255,.4)';g.fillRect(X+12,Y+18,6,1)}}
 // objects standing on the inner wall tiles
 for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){if(isF(x,y))continue;const X=x*T,Y=y*T;
  if(kind==='shrine'){if(x===Math.floor(x0+w/2)||x===x0+(w>>1)){dpShadow(g,X+20,Y+36,15,4);g.fillStyle='#9a9484';g.fillRect(X+6,Y+26,28,12);g.fillStyle='#b8b2a0';g.fillRect(X+12,Y+6,16,22);g.fillRect(X+9,Y+2,22,8);g.fillStyle='#d8d2bf';g.fillRect(X+15,Y-6,10,10);g.fillStyle='#7a7466';g.fillRect(X+12,Y+14,16,2);P.lights.push([X+20,Y+10,70,'statue'])}
   else{dpShadow(g,X+20,Y+36,13,3);g.fillStyle='#8a8576';g.fillRect(X+8,Y+4,24,32);g.fillStyle='#a8a291';g.fillRect(X+8,Y+4,24,4);g.fillRect(X+5,Y+32,30,5);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(X+26,Y+8,6,24)}}
  else if(kind==='camp'){g.fillStyle=floorT[0];g.fillRect(X,Y,T,T)}
  else if(kind==='library'){dpShadow(g,X+20,Y+37,18,3);g.fillStyle='#3a2414';g.fillRect(X+1,Y+2,T-2,T-4);g.fillStyle='#24160c';g.fillRect(X+1,Y+14,T-2,2);g.fillRect(X+1,Y+26,T-2,2);
   for(const sy of [4,16,28])for(let i=3;i<T-4;i+=4){g.fillStyle=['#7a3b3b','#3b5a7a','#6a6a3b','#4a6a4a','#8a6a3a'][Math.floor(R()*5)];g.fillRect(X+i,Y+sy+(R()<.15?3:0),3,R()<.15?7:9)}}
  else{dpShadow(g,X+20,Y+38,18,3);g.fillStyle='#3a322d';g.fillRect(X,Y,T,T);g.fillStyle='#4b3a2c';g.fillRect(X,Y+T-14,T,14);g.fillStyle='#24180f';g.fillRect(X,Y+T/2-2,T,4)}}
 if(kind==='camp'){const t=[];for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)if(!isF(x,y))t.push([x,y]);if(t.length){const xs=t.map(p=>p[0]),ys=t.map(p=>p[1]),X=Math.min(...xs)*T,Y=Math.min(...ys)*T,W=(Math.max(...xs)+1)*T-X,H=(Math.max(...ys)+1)*T-Y;
   dpShadow(g,X+W/2,Y+H-2,W/2,6);g.fillStyle='#4f6b3a';g.beginPath();g.moveTo(X+2,Y+H-2);g.lineTo(X+W/2,Y+6);g.lineTo(X+W-2,Y+H-2);g.closePath();g.fill();g.fillStyle='#3f5a2e';g.beginPath();g.moveTo(X+W/2,Y+6);g.lineTo(X+W-2,Y+H-2);g.lineTo(X+W/2,Y+H-2);g.closePath();g.fill();
   g.fillStyle='#1c140c';g.beginPath();g.moveTo(X+W/2-10,Y+H-2);g.lineTo(X+W/2,Y+H-26);g.lineTo(X+W/2+10,Y+H-2);g.fill();g.fillStyle='#8a6a3a';g.fillRect(X+W/2-1,Y+4,2,6)}
  const fx=cx+(R()<.5?-T:T),fy=cy+T*.6;dpShadow(g,fx,fy+6,14,4);for(let k=0;k<6;k++){g.save();g.translate(fx,fy);g.rotate(k*1.05);g.fillStyle='#6a4a2a';g.fillRect(-2,-12,4,12);g.restore()}g.fillStyle='#ff9a3d';g.fillRect(fx-5,fy-8,10,8);g.fillStyle='#ffe08a';g.fillRect(fx-2,fy-10,4,6);P.lights.push([fx,fy-4,96,'fire']);P.fire=[fx,fy];
  for(let k=0;k<2;k++){const bx=x0*T+T*(1+k*2.2)+R()*10,by=(y0+h-2)*T+R()*10;dpShadow(g,bx+14,by+12,15,3);g.fillStyle=['#7a3b3b','#3b5a7a'][k];g.fillRect(bx,by,28,12);g.fillStyle='#e8e0cc';g.fillRect(bx,by,8,12)}}
 if(kind==='office'){for(let k=0;k<2;k++){const dx=(x0+1+k*(w-3))*T+4,dy=(y0+1)*T+10;dpShadow(g,dx+16,dy+24,18,4);g.fillStyle='#6a4a2c';g.fillRect(dx,dy,34,18);g.fillStyle='#8a6440';g.fillRect(dx,dy,34,3);g.fillStyle='#e8e0cc';g.fillRect(dx+6,dy+5,10,7);g.fillStyle='#ffd27a';g.fillRect(dx+24,dy+3,5,6);P.lights.push([dx+26,dy+4,60,'lamp'])}
  const mx=(x0+(w>>1))*T,my=(y0+h-1)*T+8;g.fillStyle='#c9b98a';g.fillRect(mx-12,my,30,20);g.strokeStyle='#7a3b3b';g.lineWidth=1;g.beginPath();g.moveTo(mx-8,my+4);g.lineTo(mx+2,my+12);g.lineTo(mx+12,my+6);g.stroke()}
 if(kind==='library')for(let k=0;k<4;k++){const bx=(x0+R()*w)*T,by=(y0+R()*h)*T;if(!isF(Math.floor(bx/T),Math.floor(by/T)))continue;g.save();g.translate(bx,by);g.rotate(R()*3);g.fillStyle=['#7a3b3b','#3b5a7a','#6a6a3b'][k%3];g.fillRect(-6,-4,12,8);g.fillStyle='#e8e0cc';g.fillRect(-5,-3,10,1);g.restore()}
 if(kind==='shrine'){g.strokeStyle='#ffe9a0';g.globalAlpha=.4;g.lineWidth=2;g.beginPath();g.arc(cx,cy,T*1.1,0,7);g.stroke();g.globalAlpha=1}}
// ---------- lighting: a dark veil with soft holes at every light; the party carries its own light ----------
function dpLight(r,fl,P,S){const T=GD_T,li=dpLi(r),a=DP_DARK[li]??.2,c=document.createElement('canvas');c.width=fl.w*T;c.height=fl.h*T;const g=c.getContext('2d');
 g.fillStyle='rgba(4,6,14,'+a+')';g.fillRect(0,0,c.width,c.height);g.globalCompositeOperation='destination-out';
 const hole=(x,y,rad,k=1)=>{const gr=g.createRadialGradient(x,y,0,x,y,rad);gr.addColorStop(0,'rgba(0,0,0,'+k+')');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x-rad,y-rad,rad*2,rad*2)};
 (P.torches||[]).forEach(([x,y])=>hole(x*T+T/2,y*T+T-14,78));(P.crystals||[]).forEach(([x,y])=>hole(x*T+12,y*T+10,46,.8));(P.lights||[]).forEach(([x,y,rad])=>hole(x,y,rad));
 (P.room||[]).forEach(({kind,cracks})=>{if(kind==='lava')cracks.forEach(seg=>seg.forEach(([x,y])=>hole(x,y,34,.7)))});
 g.globalCompositeOperation='source-over';
 c.className='dl-dark';return c}
// ---------- weather, mist and footsteps (called from dlAmb) ----------
function dpAmbient(el,field,r,fl,P,S,R,h){const T=GD_T,li=dpLi(r),sub=r&&r.sub&&r.sub.k,V=typeof dvPlan==='function'?dvPlan(fl,r):{scenes:[]},mc=({0:'#cfe8f0',1:'#cfe6c0',4:'#9fc0e6',5:'#e6e8b0',6:'#e0a080',7:'#ffe9b0'})[li]||'#d8dde6';
 V.scenes.forEach(s=>h.push('<i class="dl-mist" style="left:'+((s.x0-1)*T)+'px;top:'+(s.y0*T)+'px;width:'+((s.x1-s.x0+3)*T)+'px;height:'+((s.y1-s.y0+1)*T)+'px;--mc:'+mc+'"></i>'));
 if([1,4,5].includes(li)){const big=fl.rooms.filter(o=>o[2]*o[3]>=20);for(let i=0;i<2&&big.length;i++){const o=big[Math.floor(R()*big.length)];h.push('<i class="dl-mist low" style="left:'+(o[0]*T)+'px;top:'+((o[1]+o[3]-2)*T)+'px;width:'+(o[2]*T)+'px;height:'+(2*T)+'px;--mc:'+mc+';animation-delay:-'+(R()*9).toFixed(1)+'s"></i>')}}
 if([0,1,4].includes(li)){let n=0;for(let t=0;t<40&&n<3;t++){const o=fl.rooms[Math.floor(R()*fl.rooms.length)],x=o[0]+Math.floor(R()*o[2]),y=o[1]+Math.floor(R()*o[3]);if(!P.free(x,y))continue;n++;h.push('<i class="dl-stream" style="left:'+(x*T+18)+'px;top:'+(y*T-60)+'px;animation-delay:-'+(R()*2).toFixed(1)+'s"></i><i class="dl-splash" style="left:'+(x*T+20)+'px;top:'+(y*T+26)+'px;animation-delay:-'+(R()*.8).toFixed(1)+'s"></i>')}}
 if(li===1)for(let i=0;i<4;i++){const o=fl.rooms[Math.floor(R()*fl.rooms.length)];h.push('<i class="dl-spores" style="left:'+((o[0]+R()*o[2])*T)+'px;top:'+((o[1]+R()*o[3])*T)+'px;animation-delay:-'+(R()*12).toFixed(1)+'s"></i>')}
 if(P.fire)h.push('<i class="dl-fire" style="left:'+P.fire[0]+'px;top:'+(P.fire[1]-6)+'px"></i>');if(P.seal)h.push('<i class="dl-seal" style="left:'+(P.seal[0]-P.seal[2])+'px;top:'+(P.seal[1]-P.seal[2])+'px;width:'+(P.seal[2]*2)+'px;height:'+(P.seal[2]*2)+'px;--sc:'+S.acc+'"></i>');
 (P.lights||[]).filter(l=>l[3]==='lamp').forEach(([x,y])=>h.push('<i class="dl-lamp" style="left:'+(x-3)+'px;top:'+(y-3)+'px;animation-delay:-'+(R()*2).toFixed(1)+'s"></i>'));
 // screen-space weather in the field (ash in fiery places, sand in sandy sublayers)
 let wx=field.querySelector('.gd-weather');if(wx)wx.remove();const kind=(li===6||sub==='ashen')?'ash':DP_SAND.has(sub)?'sand':li===7?'glow':'';if(kind){wx=document.createElement('div');wx.className='gd-weather w-'+kind;const mpEl=field.querySelector('.gd-map');mpEl.after(wx)}}
function dpFeet(el,r,fl,P){const T=GD_T,b=r.battle,units=[...r.party,...(b?b.enemies.filter(e=>e.hp>0&&!e.done):[])],last=el._pos||(el._pos={}),fx=[];
 const inRoom=(o,x,y)=>x>=o[0]&&x<o[0]+o[2]&&y>=o[1]&&y<o[1]+o[3];
 units.forEach((u,i)=>{const k=u.x+','+u.y,id=u.id||('e'+i);if(last[id]&&last[id]!==k){let t=(P.puddles&&P.puddles.has(k))?'ripple':'';
   (P.room||[]).forEach(({o,kind})=>{if(inRoom(o,u.x,u.y)){if(kind==='pond'){const cx=o[0]+o[2]/2,cy=o[1]+o[3]/2;if(((u.x+.5-cx)/(o[2]/2-1.1))**2+((u.y+.5-cy)/(o[3]/2-1.1))**2<=1)t='ripple'}else if(kind==='garden')t='leaf';else if(kind==='lava')t='puff'}});
   if(t)fx.push('<i class="dl-step s-'+t+'" style="left:'+(u.x*T+T/2)+'px;top:'+(u.y*T+T-8)+'px"></i>')}last[id]=k});
 // party light follows the team
 el.querySelectorAll('.dl-plight').forEach(e=>e.remove());el.insertAdjacentHTML('beforeend',r.party.filter(m=>m.hp>0&&m.x>=0).map(m=>'<i class="dl-plight" style="left:'+(m.x*T+T/2)+'px;top:'+(m.y*T+T/2)+'px"></i>').join('')+fx.join(''));
 if(fx.length)setTimeout(()=>el.querySelectorAll('.dl-step').forEach(e=>{if(e.getAnimations&&e.getAnimations().every(a=>a.playState==='finished'))e.remove()}),1400)}
