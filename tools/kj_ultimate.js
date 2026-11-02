// KJ cinematic: integer-pixel canvas, original costume sheets, no interpolated art.
const KJ_LENGTH=10200;
function kjPhase(t){return t<900?'eyes':t<1700?'tear':t<2900?'approach':t<3500?'uppercut':t<4900?'flurry':t<5600?'kick':t<6500?'roll':t<7600?'shoulder':t<9400?'dropkick':'shatter'}
async function kjSprite(p,row=2){try{const r=rareCostume(p),a=r?await loadRareAnims({...r,variant:p.shiny?'shiny':'normal'}):await loadAnims(p.species),an=a.Idle||a.Walk;
 return await new Promise(resolve=>{const im=new Image(),timer=setTimeout(()=>resolve(null),1600);im.onload=()=>{clearTimeout(timer);const c=document.createElement('canvas');c.width=an.w;c.height=an.h;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(im,0,Math.min(row,an.rows-1)*an.h,an.w,an.h,0,0,an.w,an.h);const data=g.getImageData(0,0,c.width,c.height).data;let x0=c.width,y0=c.height,x1=-1,y1=-1;for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(data[(y*c.width+x)*4+3]){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}if(x1<0)return resolve(null);const crop=document.createElement('canvas');crop.width=x1-x0+1;crop.height=y1-y0+1;crop.getContext('2d').drawImage(c,x0,y0,crop.width,crop.height,0,0,crop.width,crop.height);resolve(crop)};im.onerror=()=>{clearTimeout(timer);resolve(null)};im.src=an.url});}catch{return null}}
function kjTint(im,c){if(!im)return null;const k='_t'+c;if(im[k])return im[k];const cv=document.createElement('canvas');cv.width=im.width;cv.height=im.height;const x=cv.getContext('2d');x.drawImage(im,0,0);x.globalCompositeOperation='source-in';x.fillStyle=c;x.fillRect(0,0,cv.width,cv.height);return im[k]=cv}
function kjDraw(g,t,actor,target,reduced=false){const W=320,H=180,FL=140,FH=g.canvas.height||H,oy=(FH-H)/2,base=()=>g.setTransform(1,0,0,1,0,oy),TX=172,phase=kjPhase(t),clamp=x=>Math.max(0,Math.min(1,x)),R=Math.PI/180;g.imageSmoothingEnabled=false;base();g.clearRect(0,0,W,FH);base();
 const border=()=>{rect(1,1-oy,318,2,'#111');rect(1,FH-oy-3,318,2,'#111');rect(1,1-oy,2,FH-2,'#111');rect(317,1-oy,2,FH-2,'#111')},rect=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
 const line=(x,y,X,Y,c='#000',th=2)=>{x=Math.round(x);y=Math.round(y);X=Math.round(X);Y=Math.round(Y);const dx=Math.abs(X-x),sx=x<X?1:-1,dy=-Math.abs(Y-y),sy=y<Y?1:-1;let e=dx+dy;for(let n=0;n<1000;n++){rect(x-th/2,y-th/2,th,th,c);if(x===X&&y===Y)break;const e2=2*e;if(e2>=dy){e+=dy;x+=sx}if(e2<=dx){e+=dx;y+=sy}}};
 const disk=(x,y,r,c)=>{r=Math.max(0,Math.round(r));{const m=g.getTransform();if(m.b||m.a!==1){g.fillStyle=c;g.beginPath();g.arc(x,y,r+.5,0,7);g.fill();return}}if(0){g.fillStyle=c;g.beginPath();g.arc(x,y,r+.5,0,7);g.fill();return}for(let j=-r;j<=r;j++){const w=Math.floor(Math.sqrt(r*r-j*j));rect(x-w,y+j,w*2+1,1,c)}};
 const hash=n=>{const v=Math.sin(n*127.1)*43758.5453;return v-Math.floor(v)};
 const text=(s,x,y,size,c,k=1,out='#000')=>{g.save();g.translate(Math.round(x),Math.round(y));g.scale(k,k);g.font='bold '+size+'px "Pixelify Sans", monospace';g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';g.lineWidth=5;g.strokeStyle=out;g.strokeText(s,0,0);g.fillStyle=c;g.fillText(s,0,0);g.restore()};
 // stickman: angles in degrees from straight down, + = toward the facing side (right); t = torso lean from upright
 const fig=(x,y,P,c,s=1,out,crest)=>{P=Object.assign({t:0,hip:17,l1:[-10,-3],l2:[10,3],a1:[-25,-10],a2:[25,15]},P);const d=(a,L)=>[Math.sin(a*R)*L*s,Math.cos(a*R)*L*s],segs=[],ends=[];
  const hx=x,hy=y-P.hip*s,nx=hx+Math.sin(P.t*R)*14*s,ny=hy-Math.cos(P.t*R)*14*s,limb=(ox,oy,[a,b],L)=>{const [ax,ay]=d(a,L),[bx,by]=d(b,L);segs.push([ox,oy,ox+ax,oy+ay],[ox+ax,oy+ay,ox+ax+bx,oy+ay+by]);ends.push([ox+ax+bx,oy+ay+by])};
  limb(hx,hy,P.l1,9);limb(hx,hy,P.l2,9);segs.push([hx,hy,nx,ny]);const sx=hx+(nx-hx)*.85,sy=hy+(ny-hy)*.85;limb(sx,sy,P.a1,7.5);limb(sx,sy,P.a2,7.5);
  const hr=Math.round(5*s),cx=nx+Math.sin(P.t*R)*(hr+1),cy=ny-Math.cos(P.t*R)*(hr+1),th=Math.max(2,Math.round(3*s)),cr=[cx+Math.sin(P.t*R)*hr,cy-Math.cos(P.t*R)*hr,cx+Math.sin((P.t+25)*R)*(hr+6*s),cy-Math.cos((P.t+25)*R)*(hr+6*s)];
  if(out){segs.forEach(q=>line(...q,out,th+2));disk(cx,cy,hr+1,out);if(crest)line(...cr,out,th+1)}segs.forEach(q=>line(...q,c,th));disk(cx,cy,hr,c);if(crest)line(...cr,c,Math.max(1,th-1));return {head:[cx,cy],hand:ends[3],hand2:ends[2],foot:ends[0],sh:[sx,sy]}};
 const sprite=(im,x,y,s=1,c='#fff')=>{const tim=kjTint(im,c);if(tim){s=s*42/tim.height;g.drawImage(tim,Math.round(x-tim.width*s/2),Math.round(y-tim.height*s),Math.round(tim.width*s),Math.round(tim.height*s))}else fig(x,y,{},c,s)};
 const bg=(lit=0)=>{rect(-300,-300,W+600,H+600,'#000');for(let y=-120;y<H+150;y+=6){const k=y<FL?clamp((y-50)/(FL-50)):1-clamp((y-FL)/60)*.4,r=Math.round((y<FL?60:95)*k+lit*70*k),gg=Math.round((y<FL?8:14)*k+lit*18*k);rect(-300,y,W+600,7,'rgb('+r+','+gg+','+Math.round(gg*.8)+')')}line(-300,FL,W+300,FL,'#000',3)};
 const cam=(z,fx,fy,rot=0,sh=0)=>{base();g.translate(160+sh,90+sh*.6);g.rotate(rot*R);g.scale(z,z);g.translate(-fx,-fy)};
 const speed=(n,dir=1,off=0,c='#ddd')=>{for(let i=0;i<n;i++){const y=12+hash(i+1)*150,len=20+hash(i+7)*60,x=((hash(i+3)*W-off*dir*(1+hash(i)))%(W+120)+W+120)%(W+120)-60;line(x,y,x+len,y,i%3?'#777':c,1)}};
 const kj=(x,P,s=1.35,y=FL)=>fig(x,y,P,'#fff',s,'#a71e30',true),tw=(()=>{const m=kjTint(target,'#fff');return m?m.width*42/m.height:24})(),TH=TX-tw*.28;
 if(reduced){rect(0,-oy,W,FH,'#101014');text('KJ SERIES',160,65,24,'#fff');text('20-20-20 DROPKICK',160,112,18,'#e8394f');return}
 if(phase==='eyes'||phase==='tear'){
  rect(0,-oy,W,FH,'#000');const eye=clamp((t-240)/300);
  if(eye){g.save();g.translate(0,90*(1-eye));g.scale(1,eye);for(const c of ['#ae1e32','#fff']){const th=c==='#fff'?2:5;line(119,71,119,99,c,th);line(119,85,136,71,c,th);line(119,85,136,99,c,th);line(181,72,201,72,c,th);line(196,72,196,95,c,th);line(196,95,185,100,c,th);line(185,100,178,92,c,th)}g.restore()}
  if(t>680&&t<900){line(128,74,128,88,'#fff',1);line(121,81,135,81,'#fff',1);line(192,74,192,86,'#fff',1);line(186,80,198,80,'#fff',1)}
  return;
 }
 if(phase==='shatter'){const last=g.canvas._kjLast,u=clamp((t-9400)/800),cx=200,cy=96;
  if(u<.25){if(last)g.drawImage(last,0,-oy);const c=u/.25;for(let i=0;i<9;i++){let a=i*40*R+hash(i)*.4,x=cx,y=cy;const L=(40+hash(i+9)*160)*c;for(let k=1;k<=5;k++){const nx=cx+Math.cos(a)*L*k/5+(hash(i*7+k)-.5)*12,ny=cy+Math.sin(a)*L*k/5+(hash(i*5+k)-.5)*12;line(x,y,nx,ny,'#000',3);line(x,y,nx,ny,'#fff',1);x=nx;y=ny}}return}
  const v=(u-.25)/.75;for(let i=0;i<18;i++){const a0=i*20*R,a1=(i+1)*20*R,rad=400,dx=Math.cos((a0+a1)/2),dy=Math.sin((a0+a1)/2),m=v*v*(120+hash(i)*160);g.save();g.globalAlpha=1-v;g.translate(dx*m,dy*m+v*v*60);g.translate(cx,cy);g.rotate((hash(i+3)-.5)*v*2.4);g.translate(-cx,-cy);g.beginPath();g.moveTo(cx,cy);g.lineTo(cx+Math.cos(a0)*rad,cy+Math.sin(a0)*rad);g.lineTo(cx+Math.cos(a1)*rad,cy+Math.sin(a1)*rad);g.closePath();g.clip();if(last)g.drawImage(last,0,-oy);else rect(0,-oy,W,FH,'#111');g.strokeStyle='#fff';g.lineWidth=2;g.stroke();g.restore()}return}
 if(phase==='approach'){const u=clamp((t-1700)/1200),sl=clamp((u-.5)/.5),bx=u<.5?56+40*(u/.5):96+(TX-tw/2-34-96)*(1-(1-sl)*(1-sl));cam(1.15+.3*u,(bx+TX)/2+10*u,FL-28-6*u,-7*sl);bg();sprite(target,TX,FL);
  if(u<.5){const ph=Math.sin(t/70);kj(bx,{l1:[-22*ph,-6],l2:[22*ph,6],a1:[18*ph,10],a2:[-18*ph,-10],hip:17+Math.abs(ph)})}
  else{kj(bx,{t:22,hip:13,l1:[60,45],l2:[-40,-15],a1:[-75,-40],a2:[-55,-25]});for(let i=0;i<9;i++)rect(bx-8-i*5-hash(i)*6,FL-2-hash(i+4)*7*(1-sl),2,2,i%2?'#bbb':'#777')}}
 if(phase==='uppercut'){const v=clamp((t-2900)/600),hit=clamp((v-.3)/.55),lift=Math.sin(Math.PI*Math.min(1,hit*1.2))*30,inv=v>.85&&v<.93,ux=TX-tw/2-30,shk=v>=.3&&v<.5?(Math.floor(t/30)%2?3:-3):0;
  if(v<.3)cam(1.6,ux+18,FL-24,5);else if(v<.55)cam(2-(v-.3)*1.6,TH,FL-40-lift*.6,-6,shk);else cam(1.25,TX-14,FL-48,2);bg();
  if(v<.3)kj(ux,{t:38,hip:12,l1:[60,-5],l2:[-35,8],a1:[70,150],a2:[-40,30]});else if(v<.85)kj(ux+6,{t:-12,hip:19+Math.min(6,lift*.3),l1:[15,0],l2:[-28,-6],a1:[-40,-10],a2:[165,178]});else kj(ux+4,{t:-14,hip:18,l1:[20,0],l2:[-28,-6],a1:[-125,-95],a2:[-115,-85]});
  sprite(target,TX,FL-lift);if(v>=.3&&v<.42){for(let i=0;i<8;i++){const a=i*45*R;line(TH,FL-36-lift,TH+Math.cos(a)*16,FL-36-lift+Math.sin(a)*16,'#fff',2)}}
  base();if(v>=.3&&v<.36)rect(0,-oy,W,FH,'#fff');
  if(inv){rect(0,-oy,W,FH,'#fff');cam(1.25,TX-14,FL-48,2);fig(ux+4,FL,{t:-14,hip:18,l1:[20,0],l2:[-28,-6],a1:[-125,-95],a2:[-115,-85]},'#000',1.35,null,true);sprite(target,TX,FL-lift,1,'#000');line(-300,FL,W+300,FL,'#000',3)}}
 const mir=(x,fn)=>{g.save();g.translate(x,0);g.scale(-1,1);g.translate(-x,0);const r=fn();g.restore();return r};
 const curve=(x0,y0,x1,y1,bend,th,c)=>{const mx=(x0+x1)/2,my=(y0+y1)/2,L=Math.hypot(x1-x0,y1-y0)||1,cx=mx-(y1-y0)/L*bend,cy=my+(x1-x0)/L*bend;let px=x0,py=y0;for(let k=1;k<=10;k++){const q=k/10,nx=(1-q)*(1-q)*x0+2*(1-q)*q*cx+q*q*x1,ny=(1-q)*(1-q)*y0+2*(1-q)*q*cy+q*q*y1;line(px,py,nx,ny,c,Math.max(1,th*q));px=nx;py=ny}};
 const burst=(x,y,r,c='#fff',o='#e8394f')=>{g.save();g.beginPath();for(let k=0;k<16;k++){const a=k*22.5*R,rr=k%2?r*.45:r*(.85+hash(k+x)*.3);g.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}g.closePath();g.fillStyle=o;g.fill();g.translate(x,y);g.scale(.72,.72);g.translate(-x,-y);g.fillStyle=c;g.fill();g.restore()};
 if(phase==='flurry'){const w=(t-3500)/1400,n=Math.min(9,Math.floor(w*10)),p=(w*10)%1,types=['hookR','up','hookL','over','straight','hookR','hookL','up','over','straight'],ty=types[n],hitT=p>=.35&&p<.6,
  knock=n*1.6+(p>=.35?6*Math.max(0,1-(p-.35)/.5):0),tx=TX+knock,bx=tx-tw/2-24+(p<.35?p/.35*4:4),head=[tx-tw*.28,FL-34],body=[tx-tw*.3,FL-20],imp=ty==='up'||ty==='straight'&&n<9?body:head,
  sh=[[1.7,-8],[1.4,7],[2,0],[1.5,-11],[1.9,9]][Math.floor(n/2)],shk=hitT?(Math.floor(t/25)%2?4:-4):0;
  cam(sh[0]+(hitT?.15:0),(bx+tx)/2+6,FL-30,sh[1],shk);bg();
  const tilt={hookR:-12,hookL:10,up:-16,over:14,straight:-8}[ty]*(p>=.35?Math.max(0,1-(p-.35)/.5):0);g.save();g.translate(tx,FL);g.rotate(tilt*R);sprite(target,0,0);g.restore();
  const arm=p<.35?'wind':p<.7?'hit':'back',side=n%2,ext=[90+({up:-35,over:35,hookR:15,hookL:-15,straight:0})[ty],95+({up:-40,over:40,hookR:20,hookL:-20,straight:0})[ty]],pose={t:arm==='hit'?44:28,hip:14,l1:[48,18],l2:[-38,-12]};
  pose[side?'a1':'a2']=arm==='hit'?ext:arm==='wind'?[-60-p*60,-20]:[30,150];pose[side?'a2':'a1']=[20,150];const me=kj(bx,pose);
  if(p>=.2&&p<.75){const st={hookR:[me.sh[0]-26,me.sh[1]-30,34],hookL:[me.sh[0]-24,me.sh[1]+26,-34],up:[me.sh[0]-6,me.sh[1]+34,-30],over:[me.sh[0]-10,me.sh[1]-40,30],straight:[me.sh[0]-34,me.sh[1],0]}[ty],a=clamp((p-.2)/.15),ex=st[0]+(imp[0]-st[0])*a,ey=st[1]+(imp[1]-st[1])*a;curve(st[0],st[1],ex,ey,st[2],n===9?13:9,'#a71e30');curve(st[0],st[1],ex,ey,st[2],n===9?10:6,'#ddd');curve(st[0],st[1],ex,ey,st[2],n===9?6:3,'#fff')}
  if(hitT){const q=(p-.35)/.25;burst(imp[0],imp[1],(n===9?26:18)*(1+q*.3));for(let k=0;k<10;k++){const a=k*36*R+n,L=18+q*30;line(imp[0]+Math.cos(a)*L*.5,imp[1]+Math.sin(a)*L*.5,imp[0]+Math.cos(a)*L,imp[1]+Math.sin(a)*L,'#fff',1)}if(q<.25){base();rect(0,-oy,W,FH,'rgba(255,255,255,.45)')}}}
 if(phase==='kick'){const k=(t-4900)/700,ab=[TX-tw*.3,FL-18];
  if(k<.62){const q=k/.62,a=Math.PI+q*2*Math.PI,dep=Math.sin(a),x=TX+Math.cos(a)*40,yb=FL-dep*5,sc=1.35*(1-dep*.14),left=Math.sin(a)<0?false:true;cam(1.45,TX,FL-26,Math.sin(q*6.28)*7);bg();
   for(let i=1;i<14;i++){const aa=a-i*.16,xx=TX+Math.cos(aa)*40,yy=FL-Math.sin(aa)*5;rect(xx-2,yy-1-hash(i)*3,3,2,i<5?'#ccc':'#666')}g.globalAlpha=.5;line(TX-40,FL-1,TX+40,FL-1,'#2a0505',2);g.globalAlpha=1;
   const pose={t:-28,hip:13,l1:[55,35],l2:[-55,-25],a1:[-95,-60],a2:[70,40]},drawB=()=>{const mv=-Math.sin(a);if(mv<0)mir(x,()=>kj(x,pose,sc,yb));else kj(x,pose,sc,yb)};
   if(dep>0)drawB();g.save();g.translate(TX,FL);g.rotate(Math.sin(t/60)*3*R);sprite(target,0,0);g.restore();if(dep<=0)drawB();for(let i=0;i<3;i++)rect(TX+(hash(i+t%7)-.5)*10,FL-38-hash(i)*8,2,2,'#ffd36b')}
  else{const q=(k-.62)/.38,hit=q>=.1&&q<.35,slide=q>.45?Math.pow((q-.45)/.55,1.6)*90:0,shk=hit?(Math.floor(t/25)%2?5:-5):0;cam(q<.45?2.1-q*.8:1.3,q<.45?ab[0]-8:TX+slide*.6,q<.45?ab[1]:FL-26,q<.45?-6:3,shk);bg();
   const bx=TX-tw/2-22;kj(bx,{t:48,hip:11,l1:[65,12],l2:[-55,-15],a1:[-50,-20],a2:[88,92]});
   g.save();g.translate(TX+slide,FL);g.rotate((q>=.1?-14:0)*R);sprite(target,0,0);g.restore();
   if(slide){for(let i=0;i<12;i++){const dx=TX+slide-tw/2-hash(i)*slide*.8;rect(dx,FL-2-hash(i+3)*10,3,3,i%3?'#888':'#ccc')}line(TX,FL-1,TX+slide,FL-1,'#2a0505',2)}
   if(q>=.1&&q<.55){const r=(q-.1)*90;burst(ab[0],ab[1],24);g.globalAlpha=Math.max(0,1-(q-.1)*2.2);g.strokeStyle='#fff';g.lineWidth=3;g.beginPath();g.ellipse(ab[0],ab[1],r,r*.55,0,0,7);g.stroke();g.globalAlpha=1}
   if(hit&&q<.16){base();rect(0,-oy,W,FH,'#fff')}}}
 if(phase==='roll'){const u=(t-5600)/900,x=150+130*(1-(1-u)*(1-u));cam(1.3-u*.12,x-10,FL-24,3-u*6);bg();speed(18,1,u*900,'#fff');for(let i=0;i<14;i++){const gx=((i*40-u*500)%560+560)%560-120;rect(gx,FL+4+(i%3)*5,10,2,'#5a1010')}
  line(x-120*(1-u*.5),FL-1,x,FL-1,'#2a0505',2);for(let i=0;i<16;i++){const dx=x-6-hash(i)*40*(1-u*.6),dy=FL-2-hash(i+5)*14*(1-u);rect(dx,dy,3,3,i%3?'#999':'#ddd')}for(let i=0;i<5;i++)rect(x+4+hash(i+u)*6,FL-3-hash(i*3)*5,2,2,'#ffd36b');
  g.save();g.translate(x,FL);g.rotate(-14*R*(1-u*.7));sprite(target,0,0);g.restore()}
 if(phase==='shoulder'){const u=(t-6500)/1100,dx=246-u*14,dy=46+u*10;cam(1+u*.18,160+u*20,90-u*8,-3+u*3);for(let y=-oy-60;y<FH;y+=6){const k=clamp(y/H);rect(-40,y,W+80,7,'rgb('+Math.round(150+k*60)+','+Math.round(40+k*30)+','+Math.round(30+k*20)+')')}for(let i=0;i<12;i++){const a=i*30*R,L=30+u*u*220;line(dx+Math.cos(a)*8,dy+Math.sin(a)*8,dx+Math.cos(a)*L,dy+Math.sin(a)*L,'#7a1a14',1)}
  sprite(target,70,222-u*24,4,'#000');disk(dx,dy,1.5+Math.pow(u,4)*34,'#000');base();if(u>.93)rect(0,-oy,W,FH,'#fff')}
 if(phase==='dropkick'){const d=(t-7600)/1800,raw=(x,y,h,sx=1)=>{if(!target){disk(x,y-h/2,h/2,'#8e9cc4');return}const w=target.width*h/target.height;g.save();g.translate(Math.round(x),Math.round(y));g.scale(sx,1);g.drawImage(target,Math.round(-w/2),Math.round(-h),Math.round(w),Math.round(h));g.restore()},RED='#c3302a',TGT='#8e9cc4',poly=(pts,c)=>{g.fillStyle=c;g.beginPath();pts.forEach(([x,y],k)=>k?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill()},th=(pts,c,wd)=>{g.strokeStyle=c;g.lineWidth=wd;g.lineCap='round';g.lineJoin='round';g.beginPath();pts.forEach(([x,y],k)=>k?g.lineTo(x,y):g.moveTo(x,y));g.stroke()},
  eyes=(x,y,r)=>{poly([[x-r*.55,y-r*.75],[x+r*.05,y-r*.05],[x+r*.25,y-r*.6],[x+r*.1,y+r*.05],[x+r*.55,y+r*.55],[x-r*.05,y+r*.12],[x-r*.6,y+r*.35],[x-r*.15,y-r*.08]],'#111')},
  head=(x,y,r,warm)=>{disk(x,y,r+3,'#7a1410');disk(x,y,r,warm?'#fff6dc':'#fff');disk(x+r*.12,y+r*.05,r*.82,warm?'#ffe7a8':'#d8d8d8');eyes(x+r*.12,y,r*.8)};
  if(d<.36){const q=d/.36,bx=64+q*46,by=70+q*10;cam(1.05+q*.08,160,90,-2+q*3);rect(-60,-oy-60,W+120,FH+120,'#000');for(let y=60;y<FH;y+=7)rect(-60,y,W+120,7,'rgb('+Math.round(30+(y-60)*.6)+',6,6)');
   for(let i=0;i<5;i++){const o=i*6;poly([[-60,40+o],[-60,70+o],[178+o,200],[200+o,200]],['#fff','#e6e6e6','#c8c8c8','#999','#666'][i])}g.fillStyle='rgba(255,255,255,.7)';for(let i=0;i<10;i++)rect(bx-40-i*9,by+18+i*7+hash(i)*6,10,3,'#fff');
   th([[bx+18,by+16],[bx+30,by-16],[bx-8,by-30]],RED,11);th([[bx+18,by+16],[bx-20,by+8],[bx-26,by-12]],RED,11);th([[bx+18,by+16],[bx+36,by+30]],RED,12);th([[bx+36,by+30],[bx+56,by+20],[bx+52,by+40]],RED,11);th([[bx+36,by+30],[bx+30,by+48],[bx+48,by+54]],RED,11);
   head(bx,by,18);th([[bx+4,by-18],[bx+14,by-34]],RED,4);
   raw(246,236,190)}
  else{const m=d<.56,q=m?(d-.36)/.2:(d-.56)/.44,hx=92,hy=96,hr=58,reach=m?100+q*50:150,shk=!m&&q<.15?(Math.floor(t/25)%2?4:-4):0;cam(m?1.12-q*.08:1+(q<.12?.12-q:0),160,90,0,shk);
   rect(-60,-oy-60,W+120,FH+120,m?'#fff':'#fbf3e4');if(!m){for(let i=0;i<26;i++){const a=(-60+hash(i)*120)*R,L=80+hash(i+2)*120;th([[hx-hr*.4,hy],[hx-hr*.4-Math.cos(a)*L,hy+Math.sin(a)*L]],['#ff7a1a','#ffd36b','#c3302a','#ffb03b'][i%4],3+hash(i)*7)}}
   poly([[hx+hr*.6,hy-hr*.55],[hx+reach,hy-24],[hx+reach+6,hy-10],[hx+hr*.7,hy+hr*.35]],RED);th([[hx+hr*.6,hy-hr*.4],[hx+reach,hy-18]],'#7a1410',2);
   const fx=hx+reach,fy=hy-14,sq=m?1-q*.12:.86+Math.sin(t/40)*.03,th0=target?target.height:1,tw0=target?target.width*170/th0:90;raw(Math.min(262,fx+tw0*sq*.3)+(m?0:Math.sin(t/25)*2),fy+120,170,sq);for(let k=0;k<8;k++)th([[fx+4+k*5,fy-24+hash(k)*30],[fx+16+k*6,fy-8+hash(k+3)*30]],'rgba(40,20,20,.55)',2);
   disk(hx,hy,hr+5,RED);head(hx,hy,hr,!m);th([[hx-hr*.9,hy-hr*.2],[hx-hr*1.5,hy-hr*.9]],RED,14);
   if(m){base();rect(0,-oy,W,FH,'rgba(255,255,255,'+(.55-q*.2)+')')}
   else if(q>=.08){const k=1+2.2*Math.pow(1-clamp((q-.08)/.14),2);text('20-20-20',160,26,30,'#e0261c',k,'#000');const k2=1+2.2*Math.pow(1-clamp((q-.16)/.14),2);if(q>=.16)for(let r=0;r<3;r++)text('DROPKICK',160+(r-1)*1.5,150+(r%2?1:-1),40,r===1?'#e0261c':'#7a0d08',k2,'#000')}}
  base();border();
  const c=g.canvas;if(!c._kjLast){c._kjLast=document.createElement('canvas');c._kjLast.width=W;c._kjLast.height=FH}const lg=c._kjLast.getContext('2d');lg.clearRect(0,0,W,FH);lg.drawImage(c,0,0);return}
 base();border();
}
// the splash band's torn edges, taken from the band art: per-column inner edge lines plus top/bottom rim pieces
let KJ_BAND=null;
function kjBand(){if(KJ_BAND)return KJ_BAND;if(typeof Image==='undefined')return Promise.resolve(null);
 KJ_BAND=Promise.all(['band.png','band_mask.png'].map(f=>new Promise(ok=>{const im=new Image();im.onload=()=>ok(im);im.onerror=()=>ok(null);im.src='./assets/ult/'+f}))).then(([band,mask])=>{try{if(!band||!mask)return null;const W=band.width,H=band.height,mk=document.createElement('canvas');mk.width=W;mk.height=H;const mg=mk.getContext('2d');mg.drawImage(mask,0,0,W,H);const md=mg.getImageData(0,0,W,H).data,top=new Float32Array(W),bot=new Float32Array(W);
  for(let x=0;x<W;x++){let a=-1,b=-1;for(let y=0;y<H;y++)if(md[(y*W+x)*4+3]>128){if(a<0)a=y;b=y}top[x]=a<0?H/2:a;bot[x]=b<0?H/2:b}
  const half=up=>{const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');x.drawImage(band,0,0,W,H);const d=x.getImageData(0,0,W,H);for(let i=0;i<W;i++)for(let y=0;y<H;y++)if(up?y>=top[i]+3:y<=bot[i]-3)d.data[(y*W+i)*4+3]=0;x.putImageData(d,0,0);return c};
  return {W,H,top,bot,upper:half(true),lower:half(false)}}catch{return null}});return KJ_BAND}
async function kjCinematic(p,slot,ti,overlay,context){const r=runOf(),b=r&&r.battle,epoch=dgEpoch,field=fxField();if(!b||!field||(context&&(context.epoch!==epoch||context.battle!==b)))return;
 const valid=()=>runOf()===r&&r.battle===b&&dgEpoch===epoch&&field.isConnected;
 const reduced=!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 const [actor,target,band]=await Promise.all([kjSprite(p),kjSprite({species:b.enemies[ti]?.species||'Bisharp'},6),kjBand()]);if(!valid())return;
 // the splash band opens up (top edge rises, bottom edge drops) and the cutscene plays between its torn edges
 const vw=window.innerWidth||393,vh=window.innerHeight||852,dpr=Math.min(2,window.devicePixelRatio||1),bw=Math.min(vw*.98,580),bh=bw*436/1200,bx=(vw-bw)/2,by=(vh-bh)/2,DM=Math.min(vh*.22,210),sc=bw/1200;
 const canvas=document.createElement('canvas');canvas.width=Math.round(vw*dpr);canvas.height=Math.round(vh*dpr);canvas.className='kj-view';const v=canvas.getContext('2d');
 const scene=document.createElement('canvas');scene.width=320;scene.height=Math.round(320*(bh+2*DM)/bw);const g=scene.getContext('2d');if(!g||!v)return;
 const skip=document.createElement('button');skip.className='btn smallbtn kj-skip';skip.textContent='SKIP ANIMATION';skip.setAttribute('aria-label','Skip KJ cutscene and resolve attack');
 overlay.classList.add('kj-cinema');overlay.replaceChildren(canvas,skip);const oldFilter=field.style.filter,saved=[];field.style.filter='grayscale(1) contrast(1.4)';
 field.querySelectorAll('.dg-spr').forEach(el=>{saved.push([el,el.style.filter]);el.style.filter=el.closest('.dg-ally')?.dataset.i===String(slot)||el.closest('.dg-foe')?.dataset.i===String(ti)?'brightness(0) invert(1)':'brightness(0)'});
 const last=document.createElement('canvas');last.width=canvas.width;last.height=canvas.height;const lg=last.getContext('2d'),k=bw/320,IX=bx+242*k,IY=by-DM+(82+(scene.height-180)/2)*k,hash=n=>{const q=Math.sin(n*127.1)*43758.5453;return q-Math.floor(q)};
 // shatter: the last dropkick frame (band edges included) cracks from the kick's impact point and flies apart
 const shatter=t=>{const u=Math.min(1,(t-9400)/800);v.setTransform(1,0,0,1,0,0);v.clearRect(0,0,canvas.width,canvas.height);v.setTransform(dpr,0,0,dpr,0,0);const R=Math.hypot(vw,vh);
  if(u<.22){v.drawImage(last,0,0,vw,vh);const c=u/.22;if(u<.05){v.fillStyle='rgba(255,255,255,.8)';v.fillRect(0,0,vw,vh)}v.lineCap='round';for(let i=0;i<14;i++){let a=i*25.7*Math.PI/180+hash(i)*.3,x=IX,y=IY;const L=(60+hash(i+9)*R*.6)*c;for(let q=1;q<=6;q++){const nx=IX+Math.cos(a)*L*q/6+(hash(i*7+q)-.5)*16,ny=IY+Math.sin(a)*L*q/6+(hash(i*5+q)-.5)*16;v.strokeStyle='#000';v.lineWidth=4;v.beginPath();v.moveTo(x,y);v.lineTo(nx,ny);v.stroke();v.strokeStyle='#fff';v.lineWidth=1.5;v.stroke();x=nx;y=ny}}return}
  const w=(u-.22)/.78;for(let i=0;i<22;i++){const a0=i*(360/22)*Math.PI/180,a1=(i+1)*(360/22)*Math.PI/180,dx=Math.cos((a0+a1)/2),dy=Math.sin((a0+a1)/2),m=w*w*(140+hash(i)*220);v.save();v.globalAlpha=Math.max(0,1-w*1.1);v.translate(dx*m,dy*m+w*w*90);v.translate(IX,IY);v.rotate((hash(i+3)-.5)*w*2.6);v.translate(-IX,-IY);v.beginPath();v.moveTo(IX,IY);v.lineTo(IX+Math.cos(a0)*R,IY+Math.sin(a0)*R);v.lineTo(IX+Math.cos(a1)*R,IY+Math.sin(a1)*R);v.closePath();v.clip();v.drawImage(last,0,0,vw,vh);v.strokeStyle='#fff';v.lineWidth=2;v.stroke();v.restore()}};
 const paint=t=>{if(!v.setTransform)return kjDraw(g,t,actor,target,reduced);if(t>=9400&&!reduced)return shatter(t);kjDraw(g,t,actor,target,reduced);const D=DM*(1-Math.pow(1-Math.min(1,t/450),3)),fade=1;v.setTransform(dpr,0,0,dpr,0,0);v.clearRect(0,0,vw,vh);v.save();v.beginPath();
  if(band){for(let x=0;x<band.W;x+=8)v.lineTo(bx+x*sc,by+band.top[x]*sc-D);v.lineTo(bx+bw,by+band.top[band.W-1]*sc-D);v.lineTo(bx+bw,by+band.bot[band.W-1]*sc+D);for(let x=band.W-1;x>=0;x-=8)v.lineTo(bx+x*sc,by+band.bot[x]*sc+D)}else v.rect(bx,by-D,bw,bh+2*D);
  v.closePath();v.clip();v.imageSmoothingEnabled=false;v.drawImage(scene,bx,by-DM,bw,bh+2*DM);
  // the tear: the black splash rips open along the band's own centre line, out to its torn edges
  if(t>=900&&t<1700&&band){const u=Math.min(1,(t-900)/800),e=1-Math.pow(1-u,3);v.globalCompositeOperation='destination-out';v.beginPath();for(let x=0;x<band.W;x+=12){const yc=by+(band.top[x]+band.bot[x])/2*sc,hh=e*((band.bot[x]-band.top[x])/2*sc+D+30);v.lineTo(bx+x*sc,yc-hh+((x/12)%2?6:-6)*(1-e*.5))}for(let x=band.W-1;x>=0;x-=12){const yc=by+(band.top[x]+band.bot[x])/2*sc,hh=e*((band.bot[x]-band.top[x])/2*sc+D+30);v.lineTo(bx+x*sc,yc+hh+((x/12)%2?-6:6)*(1-e*.5))}v.closePath();v.fill();v.globalCompositeOperation='source-over'}
  v.restore();if(band&&fade>0){v.globalAlpha=fade;v.drawImage(band.upper,bx,by-D,bw,bh);v.drawImage(band.lower,bx,by+D,bw,bh);v.globalAlpha=1}if(t>=7600){lg.clearRect(0,0,last.width,last.height);lg.drawImage(canvas,0,0)}};
 try{await new Promise(resolve=>{let frame,timer,done=false;const start=performance.now(),duration=reduced?1500:KJ_LENGTH,finish=()=>{if(done)return;done=true;cancelAnimationFrame(frame);clearTimeout(timer);document.removeEventListener('visibilitychange',hidden);resolve()},hidden=()=>{if(document.hidden)finish()};skip.onclick=finish;document.addEventListener('visibilitychange',hidden);timer=setTimeout(finish,duration+300);
 const draw=()=>{if(done)return;if(!valid())return finish();const elapsed=performance.now()-start;if(elapsed>=duration)return finish();try{paint(elapsed);if(elapsed>=9400){field.style.filter=oldFilter;saved.forEach(([el,filter])=>el.style.filter=filter)}frame=requestAnimationFrame(draw)}catch{finish()}};draw()});
 }finally{field.style.filter=oldFilter;saved.forEach(([el,filter])=>el.style.filter=filter);canvas.remove();skip.remove()}
}
