// ===== Mystery Dungeon room variety: shaped rooms, themed rooms and rooms with mechanics =====
// o[5] = shape (L, cross, round, pillars); o[6] = mechanic (mh = Monster House, dark, trap); o[7] = mechanic triggered
function drShape(g,rooms,big,house,r){if(r.tower)return;const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
 rooms.forEach((o,i)=>{if(!i||o===big||o===house||o[2]<5||o[3]<4||o[2]*o[3]>=42||Math.random()>.45)return;const [x,y,w,h]=o,cx=x+(w>>1),cy=y+(h>>1),cut=(i,j)=>{if(i!==cx&&j!==cy)g[j][i]=0};
  const opts=['L','L','round'].concat(h>=5?['cross','pillars','round']:[]),s=opts[rnd(0,opts.length-1)];o[5]=s;
  if(s==='L'){const L=Math.random()<.5,T=Math.random()<.5;for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if((L?i<cx:i>cx)&&(T?j<cy:j>cy))cut(i,j)}
  else if(s==='cross'){const a=Math.max(1,Math.floor(w/3)),b=Math.max(1,Math.floor(h/3));for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if((i<x+a||i>=x+w-a)&&(j<y+b||j>=y+h-b))cut(i,j)}
  else if(s==='round'){const mx=x+w/2,my=y+h/2;for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++){const dx=(i+.5-mx)/(w/2),dy=(j+.5-my)/(h/2);if(dx*dx+dy*dy>1.08)cut(i,j)}}
  else for(let j=y+1;j<y+h-1;j+=2)for(let i=x+1;i<x+w-1;i+=2)cut(i,j);
  // drop any floor bits the cut left stranded from the room's centre
  const keep=new Set([cx+','+cy]),q=[[cx,cy]];while(q.length){const [a,b]=q.pop();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=a+dx,ny=b+dy,k=nx+','+ny;if(nx<x||ny<y||nx>=x+w||ny>=y+h||keep.has(k)||!g[ny][nx])continue;keep.add(k);q.push([nx,ny])}}
  for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(g[j][i]&&!keep.has(i+','+j))g[j][i]=0})}
function drMech(r,fl,rooms,far,en,put,takeIn,taken,avg,cap,sd,spread){if(r.tower||rooms.length<4||Math.random()>.4)return;
 const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),cand=rooms.map((o,i)=>i).filter(i=>i&&i!==far&&!(fl.houses||[]).includes(rooms[i])&&rooms[i]!==fl.bossRoom);if(!cand.length)return;
 const o=rooms[cand[rnd(0,cand.length-1)]],fx=mdFx(r),kinds=['mh','mh','dark'].concat(fx.hz?['trap','trap']:[]),k=kinds[rnd(0,kinds.length-1)];o[6]=k;
 if(k==='mh'){for(let n=rnd(4,6);n>0;n--){const e=makeEnemy(mdSp(0,2),spread(avg,sd,avg-4,cap));put(e,o);if(en.includes(e)){e.mh=1;e.dormant=1;e.aware=0}}
  en.forEach(e=>{if(gdInRect(e,o)&&!e.boss){e.mh=1;e.dormant=1;e.aware=0}});
  for(let n=rnd(2,3);n>0;n--){const t=takeIn(o);if(!t)break;if(Math.random()<.5)fl.items.push({x:t[0],y:t[1],tickets:mdTix(rnd(5,10))});else{const pool=Object.keys(DITEMS).filter(id=>!DITEMS[id].mdOnly&&id!=='snag').map(id=>({id,w:DITEM_TIER_W[DITEMS[id].tier||0]}));fl.items.push({x:t[0],y:t[1],k:pickWeighted(pool).id})}}}
 else if(k==='trap'){const hz=fl.hz||{};for(let n=rnd(4,6),t=0;n>0&&t<40;t++){const x=rnd(o[0],o[0]+o[2]-1),y=rnd(o[1],o[1]+o[3]-1),key=gdKey(x,y);if(!(+fl.tiles[y][x]>0)||taken.has(key)||hz[key]||(fl.ob&&fl.ob[y*fl.w+x]==='1')||(fl.stairs[0]===x&&fl.stairs[1]===y))continue;hz[key]=fx.hz[0];taken.add(key);n--}fl.hz=hz;
  const t=takeIn(o);if(t)fl.specials.push({x:t[0],y:t[1],k:'chest'})}}
// called every redraw: springs a room's mechanic the first time your team walks in
function drWake(r){const fl=r&&r.fl;if(!fl||!fl.rooms)return false;let hit=false;fl.rooms.forEach(o=>{if(!o[6]||o[7]||!r.party.some(m=>m.hp>0&&gdInRect(m,o)))return;o[7]=1;hit=true;
 if(o[6]==='mh'){r.battle.enemies.forEach(e=>{if(e.mh&&e.hp>0){e.mh=0;e.dormant=0;e.aware=1}});toast('⚠️ It’s a Monster House!');try{navigator.vibrate&&navigator.vibrate(120)}catch(e){}}
 else if(o[6]==='dark')toast('🌑 This room is pitch dark; you can only see close by.');else if(o[6]==='trap')toast('⚠️ This room is full of traps! Something shiny waits inside…');save()});return hit}
// ---------- themed room paint (visual only) ----------
function drPaintRoom(g,o,kind,S,R){const T=GD_T,dR=dlR,X0=o[0]*T,Y0=o[1]*T,W=o[2]*T,H=o[3]*T,each=f=>{for(let y=o[1];y<o[1]+o[3];y++)for(let x=o[0];x<o[0]+o[2];x++)f(x*T,y*T,x,y)};
 if(kind==='crystal'){const c=S.crystal||'#bfe3ff';g.fillStyle='rgba(150,130,255,.12)';g.fillRect(X0,Y0,W,H);
  for(let k=0;k<4+o[2];k++){const bx=X0+8+R()*(W-16),by=Y0+14+R()*(H-20);for(let s=0;s<3;s++){const hgt=10+R()*16,wd=5+R()*4,ox=bx+(s-1)*6;g.fillStyle=s===1?c:c+'bb';g.beginPath();g.moveTo(ox-wd/2,by);g.lineTo(ox,by-hgt);g.lineTo(ox+wd/2,by);g.closePath();g.fill();dR(g,'rgba(255,255,255,.6)',ox-1,by-hgt+4,1,hgt*.5)}g.fillStyle=c+'33';g.beginPath();g.ellipse(bx,by,14,5,0,0,7);g.fill()}}
 else if(kind==='mushroom'){g.fillStyle='rgba(60,40,90,.2)';g.fillRect(X0,Y0,W,H);
  for(let k=0;k<6+o[2];k++){const mx=X0+8+R()*(W-16),my=Y0+12+R()*(H-18),sz=6+R()*7,col=['#e8504a','#5fb0ff','#c58cff','#ffb347'][Math.floor(R()*4)];dR(g,'#efe6d2',mx-1.5,my-sz*.4,3,sz);g.fillStyle=col;g.beginPath();g.ellipse(mx,my-sz*.4,sz,sz*.6,0,Math.PI,0);g.fill();dR(g,'rgba(255,255,255,.75)',mx-sz*.4,my-sz*.75,2,2);dR(g,'rgba(255,255,255,.75)',mx+sz*.2,my-sz*.6,2,2);g.fillStyle=col+'22';g.beginPath();g.arc(mx,my-sz*.4,sz*2,0,7);g.fill()}}
 else if(kind==='flooded'){each((X,Y)=>{dR(g,'rgba(60,140,200,.32)',X,Y,T,T);if(R()<.35)dR(g,'rgba(255,255,255,.28)',X+4+R()*20,Y+6+R()*24,8+R()*6,1)});
  for(let k=0;k<3+o[2];k++){const sx=X0+10+R()*(W-20),sy=Y0+10+R()*(H-20);g.fillStyle='#8c8778';g.beginPath();g.ellipse(sx,sy,8,6,0,0,7);g.fill();g.fillStyle='#a8a291';g.beginPath();g.ellipse(sx-1,sy-1,6,4,0,0,7);g.fill()}}
 else if(kind==='bones'){g.fillStyle='rgba(210,195,160,.16)';g.fillRect(X0,Y0,W,H);
  for(let k=0;k<5+o[2];k++){const bx=X0+8+R()*(W-16),by=Y0+8+R()*(H-16),a=R()*3.14,l=6+R()*6,dx=Math.cos(a)*l,dy=Math.sin(a)*l;g.strokeStyle='#ece3cc';g.lineWidth=3;g.beginPath();g.moveTo(bx-dx,by-dy);g.lineTo(bx+dx,by+dy);g.stroke();g.fillStyle='#ece3cc';for(const s of [-1,1]){g.beginPath();g.arc(bx+dx*s,by+dy*s,2.6,0,7);g.fill()}}
  for(let k=0;k<1+(o[2]>5?1:0);k++){const sx=X0+12+R()*(W-24),sy=Y0+12+R()*(H-24);g.fillStyle='#ece3cc';g.beginPath();g.arc(sx,sy,7,0,7);g.fill();dR(g,'#ece3cc',sx-4,sy+4,8,5);dR(g,'#3a3226',sx-4,sy-1,3,3);dR(g,'#3a3226',sx+1,sy-1,3,3);dR(g,'#3a3226',sx-1,sy+4,1,3);dR(g,'#3a3226',sx+1,sy+4,1,3)}}
 else if(kind==='ruin'){each((X,Y)=>{if(R()<.3){g.strokeStyle='rgba(0,0,0,.22)';g.lineWidth=1;g.strokeRect(X+3,Y+3,T-6,T-6)}if(R()<.18)for(let k=0;k<4;k++)dR(g,k%2?'#5f9a46':'#4c7f38',X+R()*30,Y+R()*30,3,3)});
  for(let k=0;k<2+(o[2]>5?1:0);k++){const px=X0+14+R()*(W-28),py=Y0+16+R()*(H-28),h=14+R()*12;g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(px,py+3,14,5,0,0,7);g.fill();dR(g,'#9a9488',px-10,py-h,20,h);dR(g,'#b8b2a4',px-10,py-h,20,4);dR(g,'rgba(0,0,0,.18)',px+4,py-h,6,h);dR(g,'#9a9488',px+12,py-4,7,5);
   g.strokeStyle='#4c7f38';g.lineWidth=2;g.beginPath();g.moveTo(px-8,py-h+2);g.quadraticCurveTo(px-2,py-h/2,px+6,py);g.stroke()}}
 else if(kind==='mine'){const my=Y0+Math.floor(o[3]/2)*T+T/2;for(let x=X0+2;x<X0+W-2;x+=8)dR(g,'#6b4a2e',x,my-7,4,14);dR(g,'#8a8f9a',X0,my-5,W,2);dR(g,'#8a8f9a',X0,my+3,W,2);
  for(let x=o[0];x<o[0]+o[2];x+=3){const bx=x*T+T/2;dR(g,'#7a5434',bx-14,Y0+2,28,5);dR(g,'#5c3e26',bx-14,Y0+6,4,10);dR(g,'#5c3e26',bx+10,Y0+6,4,10)}
  const cx=X0+T*(1+Math.floor(R()*Math.max(1,o[2]-2)));dR(g,'#4a4f5c',cx,my-14,22,13);dR(g,'#6a7080',cx+2,my-12,18,3);dR(g,'#2b2b33',cx+3,my-1,5,5);dR(g,'#2b2b33',cx+14,my-1,5,5);for(let k=0;k<4;k++)dR(g,['#2b2b33','#ffd23f','#9f8cff'][k%3],cx+3+R()*14,my-17+R()*3,4,3)}}
// dark rooms: a heavy shade painted over the floor
function drPaintMech(g,fl){const T=GD_T;(fl.rooms||[]).forEach(o=>{if(o[6]!=='dark')return;g.fillStyle='rgba(6,8,20,.45)';for(let y=o[1];y<o[1]+o[3];y++)for(let x=o[0];x<o[0]+o[2];x++)if(+fl.tiles[y][x]>0)g.fillRect(x*T,y*T,T,T)})}
