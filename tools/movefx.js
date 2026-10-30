// ---- Move animations: every type has a weak (power 70 or less) and a strong (over 70) version, used by Basic and Disc moves on both sides ----
function mvSpr(sel){return document.querySelector(sel+' .dg-spr')}
function mvZoom(el){return parseFloat(el&&el.style.zoom)||1}
// Finite sprite motion always releases its Web Animation, including cancellation and detached nodes.
function mvAnimate(el,frames,options){if(!el||!el.animate)return null;const opt=typeof options==='number'?{duration:options}:options,a=el.animate(frames,opt),duration=(+opt.duration||0)*(+opt.iterations||1)+(+opt.delay||0);let timer,done=false;
 const finish=()=>{if(done)return;done=true;clearTimeout(timer);a.cancel()};if(a.finished&&typeof a.finished.then==='function')a.finished.then(finish,finish);if(Number.isFinite(duration))timer=setTimeout(finish,duration+100);return a}
// move a battler's sprite toward a point (fraction of the way) and back; translate is divided by zoom because the sprite is zoomed
function mvRush(sel,to,frac,ms,hold){const el=mvSpr(sel),from=fxPos(sel);if(!el||!from||!to)return Promise.resolve();const z=mvZoom(el),dx=(to.x-from.x)*frac/z,dy=(to.y-from.y)*frac/z,h=hold||0;
 mvAnimate(el,[{translate:'0 0'},{translate:dx+'px '+dy+'px',offset:.35},{translate:dx+'px '+dy+'px',offset:.35+h},{translate:'0 0'}],{duration:ms,easing:'ease-in-out'});return dgSleep(ms*.35)}
function mvMove(sel,frames,ms){const el=mvSpr(sel);if(!el)return;const z=mvZoom(el);mvAnimate(el,frames.map(f=>Object.assign({},f,f.y!=null||f.x!=null?{translate:((f.x||0)/z)+'px '+((f.y||0)/z)+'px'}:{})).map(f=>{delete f.x;delete f.y;return f}),{duration:ms,easing:'ease-in-out'})}
function mvShake(sel,ms){mvMove(sel,[{x:0},{x:-6},{x:6},{x:-5},{x:5},{x:-3},{x:0}],ms||450)}
// play the Pokémon's own Attack animation once (swaps to its Attack sheet, then back)
async function mvAttackAnim(sel){const el=mvSpr(sel);if(!el)return;const token={};el._attackToken=token;el._spriteRender=(el._spriteRender||0)+1;let applied=false;
 try{let a;try{a=await loadAnims(el.dataset.sp)}catch(e){return}const at=a&&a.Attack;if(!at||!el.isConnected||el._attackToken!==token)return;
 const row=+el.dataset.row,r=row<(at.rows||8)?row:0,z=el.style.zoom,dur=at.d.reduce((x,y)=>x+y,0)/60,base=a.Idle||a.Walk||at,footI=-(parseFloat(el.style.marginBottom)||0),foot=footI+(at.h-base.h)/2;
 el.style.cssText='width:'+at.w+'px;height:'+at.h+'px;margin-bottom:'+(-foot)+'px;background-image:url('+at.url+');background-position:0 '+(-r*at.h)+'px;--fw:'+at.w+'px;--fn:'+at.frames+';animation:dsxonce '+dur.toFixed(2)+'s steps('+Math.max(1,at.frames-1)+') 1 forwards;zoom:'+z+';';applied=true;
 await dgSleep(Math.min(2500,Math.max(1,dur*1000)));
 }finally{if(el._attackToken===token){el._attackToken=null;if(applied&&el.isConnected){el.classList.remove('ok');await dgFillSprites()}}}}

function mvArc(from,to,cls,ms,lift,style){const d=fxEl(cls,Object.assign({left:from.x+'px',top:from.y+'px'},style||{}));if(!d)return;const dx=to.x-from.x,dy=to.y-from.y;
 d.animate([{transform:'translate(-50%,-50%)'},{transform:'translate(calc(-50% + '+dx/2+'px),calc(-50% + '+(dy/2-(lift||60))+'px)) rotate(180deg)'},{transform:'translate(calc(-50% + '+dx+'px),calc(-50% + '+dy+'px)) rotate(360deg)'}],{duration:ms,easing:'linear',fill:'forwards'});fxGone(d,ms+40)}
function mvCurve(from,to,cls,ms,bend,style){const d=fxEl(cls,Object.assign({left:from.x+'px',top:from.y+'px'},style||{}));if(!d)return;const dx=to.x-from.x,dy=to.y-from.y,len=Math.hypot(dx,dy)||1,nx=-dy/len*bend,ny=dx/len*bend;
 d.animate([{transform:'translate(-50%,-50%)'},{transform:'translate(calc(-50% + '+(dx*.3+nx)+'px),calc(-50% + '+(dy*.3+ny)+'px))'},{transform:'translate(calc(-50% + '+(dx*.7+nx*.6)+'px),calc(-50% + '+(dy*.7+ny*.6)+'px))'},{transform:'translate(calc(-50% + '+dx+'px),calc(-50% + '+dy+'px))'}],{duration:ms,easing:'ease-in',fill:'forwards'});fxGone(d,ms+40)}
function mvSparks(at,color,n,spread){for(let k=0;k<n;k++){const a=Math.random()*6.28,r=(spread||34)*(.5+Math.random()*.7);fxFly(at,{x:at.x+Math.cos(a)*r,y:at.y+Math.sin(a)*r},'spark',360+Math.random()*160,{'--c':color},'ease-out')}}
function mvSlash(at,color,w){fxGone(fxEl('slash',{left:at.x+'px',top:at.y+'px','--c':color||'#fff','--w':(w||70)+'px'}),450)}
// Bug (weak): a pair of white fanged jaws snap shut over the target, with a pink burst and sparkles behind them
function mvJawPath(n,len){const P=[],top=x=>12+14*((x-50)/45)**2;for(let x=5;x<=95;x+=5)P.push(x+','+top(x).toFixed(1));const w=90/n;
 for(let k=n-1;k>=0;k--){const xa=5+k*w,xb=xa+w,xm=(xa+xb)/2,c=1-Math.abs(xm-50)/50,tip=top(xm)+12+len*(.55+.45*c);P.push(xb+','+(top(xb)+12).toFixed(1),xm+','+tip.toFixed(1),xa+','+(top(xa)+12).toFixed(1))}
 return 'M'+P.join(' L')+' Z'}
async function mvChomp(T){const W=Math.max(44,T.w*.75),H=W*.95,spikes=Array.from({length:28},(_,k)=>{const a=k/28*6.283,r=k%2?28:48;return (50+Math.cos(a)*r).toFixed(1)+','+(50+Math.sin(a)*r).toFixed(1)}).join(' ');
 const jaw=(n,len,cls)=>'<svg class="'+cls+'" viewBox="0 0 100 60" preserveAspectRatio="none"><defs><linearGradient id="mvjg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9f78f"/><stop offset="1" stop-color="#8cc63a"/></linearGradient></defs><path d="'+mvJawPath(n,len)+'" fill="url(#mvjg)" stroke="#4d7a12" stroke-width="2" stroke-linejoin="round"/></svg>';
 const d=fxEl('chomp',{left:T.x+'px',top:T.y+'px',width:W+'px',height:H+'px'},'<svg class="burst" viewBox="0 0 100 100"><polygon points="'+spikes+'" fill="#5fae1e"/><polygon points="'+spikes+'" fill="#c6ef72" transform="translate(50 50) scale(.55) translate(-50 -50)"/></svg>'+jaw(7,30,'up')+jaw(8,24,'dn'));if(!d){await dgSleep(400);return}
 const up=d.querySelector('.up'),dn=d.querySelector('.dn'),b=d.querySelector('.burst');
 up.animate([{transform:'translateY(-62%)',opacity:0},{transform:'translateY(-48%)',opacity:1,offset:.45},{transform:'translateY(-8%)',offset:.62},{transform:'translateY(-12%)',offset:.72},{transform:'translateY(-12%)',opacity:1,offset:.88},{transform:'translateY(-12%)',opacity:0}],{duration:820,easing:'ease-in',fill:'forwards'});
 dn.animate([{transform:'scaleY(-1) translateY(-62%)',opacity:0},{transform:'scaleY(-1) translateY(-48%)',opacity:1,offset:.45},{transform:'scaleY(-1) translateY(-8%)',offset:.62},{transform:'scaleY(-1) translateY(-12%)',offset:.72},{transform:'scaleY(-1) translateY(-12%)',opacity:1,offset:.88},{transform:'scaleY(-1) translateY(-12%)',opacity:0}],{duration:820,easing:'ease-in',fill:'forwards'});
 b.animate([{transform:'scale(0) rotate(0)',opacity:0},{transform:'scale(0) rotate(0)',opacity:0,offset:.55},{transform:'scale(1.15) rotate(20deg)',opacity:.95,offset:.68},{transform:'scale(1) rotate(30deg)',opacity:.8,offset:.85},{transform:'scale(1.1) rotate(36deg)',opacity:0}],{duration:820,fill:'forwards'});
 fxGone(d,860);await dgSleep(510)}
// Water (strong): steam leaks from under the target's feet, then a geyser erupts and throws them upward (the hit lands on the way up)
async function mvGeyser(T,tSel){const S=dgSleep,W=Math.max(46,T.w*.8),H=Math.max(120,T.h*2.4);
 fxGone(fxEl('gpool',{left:T.x+'px',top:(T.b-4)+'px',width:(W*1.3)+'px'}),1900);
 for(let k=0;k<18;k++){setTimeout(()=>{const x=T.x+(Math.random()-.5)*W*.9,p=fxEl('steam',{left:x+'px',top:(T.b-6)+'px','--sz':(10+Math.random()*12)+'px'});if(!p)return;p.animate([{transform:'translate(-50%,-50%) scale(.4)',opacity:0},{opacity:.75,offset:.25},{transform:'translate(calc(-50% + '+((Math.random()-.5)*16)+'px),calc(-50% - '+(26+Math.random()*24)+'px)) scale(1.4)',opacity:0}],{duration:700,easing:'ease-out',fill:'forwards'});fxGone(p,720)},k*38)}
 mvShake(tSel,640);await S(720);
 const g=fxEl('geyser',{left:T.x+'px',top:T.b+'px',width:W+'px',height:H+'px'},'<i></i><i></i><i></i>');
 if(g){g.animate([{transform:'translate(-50%,-100%) scaleY(0)',opacity:1},{transform:'translate(-50%,-100%) scaleY(1.05)',offset:.22},{transform:'translate(-50%,-100%) scaleY(.95)',offset:.4},{transform:'translate(-50%,-100%) scaleY(1)',opacity:1,offset:.75},{transform:'translate(-50%,-100%) scaleY(.2)',opacity:0}],{duration:1150,easing:'ease-out',fill:'forwards'});fxGone(g,1180)}
 fxRing({x:T.x,y:T.b-4},'#9fd0ff',500,2.5);
 mvMove(tSel,[{y:0,rotate:'0deg'},{y:-H*.55,rotate:'-10deg',offset:.4},{y:-H*.6,rotate:'8deg',offset:.55},{y:0,rotate:'0deg'}],1250);
 for(let k=0;k<14;k++)setTimeout(()=>{const top={x:T.x,y:T.b-H*.9},a=-1.57+(Math.random()-.5)*2.4,r=30+Math.random()*40;fxFly(top,{x:top.x+Math.cos(a)*r,y:top.y+Math.sin(a)*r+40},'spark',520,{'--c':'#a8d4ff'},'ease-out')},120+k*30);
 await S(420);fxBoom({x:T.x,y:T.y-H*.5},'#5b9dff',62);await S(160)}
async function moveFx(type,strong,uSel,tSel){try{const U=fxPos(uSel),T=fxPos(tSel),S=dgSleep;if(!U||!T){await S(300);return}const c=TC(type),t=String(type).toLowerCase();
 switch(t+(strong?'+':'')){
 case 'normal':mvRush(uSel,T,.18,520);mvAttackAnim(uSel);await S(200);fxFly(U,T,'orb',260,{'--c':'#f4f1e6'});await S(260);fxBoom(T,'#ffffff',54);break;
 case 'normal+':await mvRush(uSel,T,.82,1050,.3);mvAttackAnim(uSel);await S(250);fxBoom(T,'#ffffff',78);mvShake(tSel);await S(380);break;
 case 'fire':fxFly(U,T,'fireball',330,{},'ease-in');await S(330);fxBoom(T,'#ff8a3c',48);mvSparks(T,'#ffb347',9);break;
 case 'fire+':{const g=fxEl('kanji',{left:U.x+'px',top:(U.y-30)+'px'},'火');await S(420);if(g)g.remove();fxFly({x:U.x,y:U.y-30},T,'kanji fly',360,{},'ease-in');await S(360);fxGone(fxEl('kanji boom',{left:T.x+'px',top:T.y+'px'},'火'),650);fxBoom(T,'#ff7a2c',90);mvShake(tSel);await S(300);break}
 case 'water':fxBeam(U,T,'#5b9dff',520,9);await S(330);mvSparks(T,'#a8d4ff',8,28);break;
 case 'water+':{await mvGeyser(T,tSel);break}
 case 'electric':{const d=fxEl('zap',{},'<svg width="100%" height="100%"><polyline points="'+[0,1,2,3,4,5].map(s=>{const k=s/5;return (U.x+(T.x-U.x)*k+(s&&s<5?(Math.random()-.5)*28:0))+','+(U.y+(T.y-U.y)*k+(s&&s<5?(Math.random()-.5)*28:0))}).join(' ')+'" fill="none" stroke="#fff27a" stroke-width="4" stroke-linejoin="round"/></svg>');fxGone(d,240);await S(240);fxBoom(T,'#f7d02c',56);break}
 case 'electric+':{fxGone(fxEl('cloud',{left:T.x+'px',top:(T.y-62)+'px'}),1000);await S(450);const d=fxEl('zap',{},'<svg width="100%" height="100%"><polyline points="'+T.x+','+(T.y-50)+' '+(T.x-9)+','+(T.y-28)+' '+(T.x+7)+','+(T.y-20)+' '+(T.x-4)+','+T.y+'" fill="none" stroke="#fff6a0" stroke-width="6" stroke-linejoin="round"/></svg>');fxGone(d,260);fxOver('flash',260);fxBoom(T,'#f7d02c',84);mvShake(tSel);await S(420);break}
 case 'grass':for(let k=0;k<8;k++)setTimeout(()=>fxFly({x:U.x+(Math.random()-.5)*20,y:U.y+(Math.random()-.5)*20},{x:T.x+(Math.random()-.5)*36,y:T.y+(Math.random()-.5)*30},'leaf',380,{transform:'rotate('+(Math.random()*360)+'deg)'},'ease-out'),k*40);await S(700);fxBoom(T,'#7ac74c',44);break;
 case 'grass+':{const ring=fxEl('petalorb',{left:T.x+'px',top:T.y+'px'},Array.from({length:14},(_,i)=>'<i style="transform:rotate('+(i*26)+'deg) translateX(34px) rotate(40deg)"></i>').join(''));await S(800);if(ring)ring.remove();fxBoom(T,'#ff9fc9',96);mvSparks(T,'#ffc4de',12,50);mvShake(tSel);await S(350);break}
 case 'ice':mvArc(U,T,'snowball',420,50);await S(420);fxBoom(T,'#e6f8ff',52);mvSparks(T,'#ffffff',7,26);break;
 case 'ice+':{const blk=fxEl('iceblock',{left:T.x+'px',top:T.y+'px',width:(T.w*.95)+'px',height:(T.h*.95)+'px'});await S(300);mvShake(tSel,260);await S(330);mvShake(tSel,260);await S(330);if(blk)blk.remove();fxBoom(T,'#cdf3ff',92);mvSparks(T,'#e6f8ff',14,56);await S(250);break}
 case 'fighting':fxBeam(U,T,'#ffffff55',520,T.w*.5);await mvRush(uSel,T,.8,900,.25);mvAttackAnim(uSel);await S(200);fxBoom(T,'#c22e28',60);mvShake(tSel);await S(300);break;
 case 'fighting+':await mvRush(uSel,T,.7,1300,.45);mvShake(tSel,700);for(let k=0;k<6;k++){fxGone(fxEl('fist',{left:(T.x+(Math.random()-.5)*44)+'px',top:(T.y+(Math.random()-.5)*40)+'px'},'👊'),320);await S(95)}fxBoom(T,'#c22e28',72);await S(300);break;
 case 'poison':fxGone(fxEl('fangs',{left:T.x+'px',top:T.y+'px'}),620);await S(380);fxBoom(T,'#a33ea1',58);mvShake(tSel,300);await S(220);break;
 case 'poison+':fxGone(fxEl('stinger',{left:(T.x-38)+'px',top:(T.y-38)+'px'}),620);await S(380);mvSlash(T,'#d58ce0',86);fxBoom(T,'#a33ea1',70);mvShake(tSel);await S(300);break;
 case 'ground':mvShake(tSel,550);fxGone(fxEl('dust',{left:T.x+'px',top:T.b+'px'}),600);await S(560);break;
 case 'ground+':fxGone(fxEl('plume',{left:T.x+'px',top:T.b+'px'}),900);await S(120);mvMove(tSel,[{y:0},{y:-52,offset:.4},{y:-52,offset:.55},{y:0,offset:.85},{y:4},{y:0}],900);await S(780);fxBoom({x:T.x,y:T.b-6},'#c9a46a',80);fxShake();await S(260);break;
 case 'flying':for(let k=0;k<10;k++){const a=k/10*6.28;setTimeout(()=>fxFly({x:T.x+Math.cos(a)*60,y:T.y+Math.sin(a)*46},T,'feather',420,{transform:'rotate('+(a*57)+'deg)'},'ease-in'),k*35)}await S(800);fxBoom(T,'#dcd6ff',50);break;
 case 'flying+':fxGone(fxEl('twister',{left:T.x+'px',top:T.b+'px'}),1150);mvMove(tSel,[{y:0,rotate:'0deg'},{y:-40,rotate:'360deg',offset:.6},{y:-40,rotate:'540deg',offset:.75},{y:0,rotate:'720deg'}],1100);await S(1100);fxBoom({x:T.x,y:T.b-6},'#a98ff3',76);fxShake();await S(200);break;
 case 'psychic':for(let k=0;k<3;k++)setTimeout(()=>fxRing(T,'#f95587',520,2.4),k*140);mvShake(tSel,700);await S(800);break;
 case 'psychic+':fxGone(fxEl('eye',{left:T.x+'px',top:(T.y-64)+'px'}),900);await S(650);fxGone(fxEl('star4',{left:T.x+'px',top:T.y+'px'}),600);fxBoom(T,'#c06bff',90);mvShake(tSel);await S(380);break;
 case 'bug':{mvRush(uSel,T,.55,760,.12);mvAttackAnim(uSel);await S(120);await mvChomp(T);fxBoom(T,'#8fd13a',40);mvSparks(T,'#e6f77a',7,30);mvShake(tSel,380);await S(260);break}
 case 'bug+':{const dx=U.x-T.x,dy=U.y-T.y,L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,ang=Math.atan2(-uy,-ux)*57.3,st={x:T.x+ux*(T.h*.5+34),y:T.y+uy*(T.h*.5+34)};
  const h=fxEl('horn2',{left:st.x+'px',top:st.y+'px',transform:'translate(-50%,-50%) rotate('+ang+'deg)'});if(h){h.animate([{translate:'0 0',opacity:0},{translate:(ux*14)+'px '+(uy*14)+'px',opacity:1,offset:.4},{translate:(-ux*(T.h*.5+30))+'px '+(-uy*(T.h*.5+30))+'px',opacity:1}],{duration:700,easing:'cubic-bezier(.6,0,.9,.6)',fill:'forwards'});fxGone(h,760)}
  await S(700);for(let k=0;k<14;k++){const a=Math.atan2(uy,ux)+(Math.random()-.5)*1.3,r=30+Math.random()*40;fxFly(T,{x:T.x+Math.cos(a)*r,y:T.y+Math.sin(a)*r},'spark',380,{'--c':k%2?'#e4f08a':'#a6b91a'},'ease-out')}
  mvMove(tSel,[{x:0,y:0},{x:-ux*16,y:-uy*16,offset:.35},{x:-ux*16,y:-uy*16,offset:.6},{x:0,y:0}],700);await S(330);fxBoom(T,'#a6b91a',92);fxShake();await S(380);break}
 case 'rock':mvArc(U,T,'boulder',460,70);await S(460);fxBoom(T,'#b6a136',60);mvShake(tSel,300);await S(150);break;
 case 'rock+':for(let k=0;k<4;k++){const x=T.x+(k-1.5)*16;setTimeout(()=>{fxFly({x,y:-30},{x,y:T.y+(Math.random()-.5)*12},'boulder big',300,{},'ease-in');setTimeout(()=>{fxBoom({x,y:T.y},'#b6a136',58);fxShake()},290)},k*130)}await S(4*130+420);mvShake(tSel);break;
 case 'ghost':{const ring=fxEl('wisps',{left:T.x+'px',top:T.y+'px'},'<i></i><i></i><i></i>');await S(800);if(ring)ring.remove();fxBoom(T,'#735797',54);break}
 case 'ghost+':for(let k=0;k<5;k++)setTimeout(()=>mvCurve(U,T,'spirit',520,(k-2)*30),k*70);await S(5*70+520);fxGone(fxEl('wisps fast',{left:T.x+'px',top:T.y+'px'},'<i></i><i></i><i></i><i></i>'),500);await S(420);fxBoom(T,'#9a7fd0',84);mvSparks(T,'#c7b4f0',12,48);await S(250);break;
 case 'dragon':for(let k=0;k<9;k++)setTimeout(()=>fxFly(U,{x:T.x+(Math.random()-.5)*34,y:T.y+(Math.random()-.5)*30},'breath',380,{},'ease-out'),k*35);await S(9*35+380);fxBoom(T,'#8b5cf6',56);break;
 case 'dragon+':{const ch=fxEl('charge',{left:U.x+'px',top:(U.y-10)+'px','--c':'#8b5cf6'});await S(420);if(ch)ch.remove();fxBeam({x:U.x,y:U.y-10},T,'#8b5cf6',600,24);await S(220);fxBoom(T,'#8b5cf6',96);fxShake();await S(380);break}
 case 'dark':{const el=mvSpr(uSel);if(el)el.classList.add('cloak');await mvRush(uSel,T,.82,900,.25);mvSlash(T,'#2a1b30',84);fxBoom(T,'#3a2a3a',56);mvShake(tSel);await S(420);if(el)el.classList.remove('cloak');break}
 case 'dark+':await mvRush(uSel,T,.85,1250,.4);fxGone(fxEl('dustcloud',{left:T.x+'px',top:T.y+'px'}),700);mvSparks(T,'#8a7f74',14,58);mvShake(tSel,600);await S(700);break;
 case 'steel':fxBeam(U,T,'#9aa3ae',480,7);await S(300);fxBoom(T,'#dfe4ea',48);break;
 case 'steel+':{mvMove(uSel,[{y:0},{y:-40,offset:.45},{y:0,offset:.7},{y:0}],600);await S(420);fxShake();const n=6;for(let k=1;k<=n;k++){const p={x:U.x+(T.x-U.x)*k/n,y:(U.b||U.y)+((T.b||T.y)-(U.b||U.y))*k/n};setTimeout(()=>fxGone(fxEl('mspike',{left:p.x+'px',top:p.y+'px'}),520),k*70)}await S(n*70+200);fxBoom(T,'#dfe4ea',80);mvShake(tSel);await S(300);break}
 case 'fairy':{const ch=fxEl('charge',{left:U.x+'px',top:(U.y-8)+'px','--c':'#ff9fc9'});await S(320);if(ch)ch.remove();fxFly({x:U.x,y:U.y-8},T,'orb big',320,{'--c':'#ff9fc9'});await S(320);fxBoom(T,'#ff9fc9',60);break}
 case 'fairy+':{fxGone(fxEl('moon',{left:T.x+'px',top:(T.b+16)+'px'}),1250);await S(450);const dx=T.x-U.x,dy=T.y-U.y,len=Math.hypot(dx,dy);
  fxGone(fxEl('cone',{left:U.x+'px',top:U.y+'px',width:len+'px',transform:'rotate('+(Math.atan2(dy,dx)*57.3)+'deg)'},Array.from({length:7},(_,k)=>'<i style="left:'+(12+k*12)+'%;animation-delay:'+(k*40)+'ms"></i>').join('')),700);
  await S(380);fxBoom(T,'#fff4c8',80);mvSparks(T,'#ffe9a8',12,44);mvShake(tSel);await S(420);break}
 default:mvRush(uSel,T,.2,450);await S(300);fxBoom(T,c,50)}}catch(e){appError(e,'moveFx');await dgSleep(200)}}
