// ---- Legendary Ultimates: a third ability (Power 180, costs the full Stamina Bar), unlocked for 25 Rare Candy in the Box ----
const ULT_COST=25;
const ULTS={
 'Mew':{move:'Genetic Implosion',type:'Psychic',t:'one',fx:'orbs',desc:'Always neutral. Its damage also hits every Pokémon (allies included) of the target\'s species; super effective if 3+ of that species are on the field.'},
 'Celebi':{move:'Time Warp',type:'Grass',t:'none',fx:'warp',desc:'No damage. On a correct answer, every enemy skips its next turn (like a Time Gear).'},
 'Regirock':{move:'Earthen Barricade',type:'Rock',t:'all',fx:'slam',desc:'Hits all foes. Your team takes 10% less damage during the enemy\'s next turn, on top of Guard.'},
 'Regice':{move:'Permafrost',type:'Ice',t:'all',fx:'freeze',desc:'Hits all foes. On your next turn the attack bar moves 10% slower.'},
 'Registeel':{move:'Corkscrew Cannon',type:'Steel',t:'one',fx:'drill',desc:'At the start of your next turn, your whole team restores 10 Stamina.'},
 'Kyogre':{move:'Origin Pulse',type:'Water',t:'all',fx:'wave',desc:'A huge wave washes over all foes.'},
 'Jirachi':{move:'Doom Desire',type:'Steel',t:'one',fx:'star',desc:'Lands at the start of your next turn, ignoring resistances; then your team recovers 15% HP.'},
 'Genesect':{move:'Techno Blast',type:'best:Fire,Water,Electric,Ice',t:'one',fx:'beam',desc:'Becomes whichever of Fire, Water, Electric or Ice hits the target hardest.'},
 'Xurkitree':{move:'Overload Surge',type:'Electric',t:'all',fx:'arcs',desc:'Hits all foes; each has a 30% chance to be paralyzed and skip its next attack.'},
 'Celesteela':{move:'Orbital Strike',type:'Steel',t:'all',fx:'orbital',desc:'Hits all foes. Celesteela stays in the sky during the enemy\'s next turn and can\'t be targeted.'},
 'Magearna':{move:'Fleur Cannon',type:'Fairy',t:'one',fx:'beam',desc:'Soul-Heart: if it knocks the target out, your team deals 10% more damage for the rest of the battle.'},
 'Marshadow':{move:'Spectral Thief',type:'Ghost',t:'one',fx:'shadow',desc:'Steals all of the target\'s Stamina and splits it among your team.'},
 'Meltan':{move:'Hex Nut Swarm',type:'Steel',t:'all',fx:'nuts',desc:'Hits all foes. If Melmetal is on your team, its Stamina Bar fills up.'},
 'Melmetal':{move:'Double Iron Bash',type:'Steel',t:'one',fx:'bash',desc:'Two hits of 90 power. If the target survives, it flinches and skips its next turn.'},
 'Regieleki':{move:'Thunder Cage',type:'Electric',t:'one',fx:'cage',desc:'Cages the target: it loses 10% of its max HP at the end of each round for 3 rounds.'},
 'Regidrago':{move:'Dragon Energy',type:'Dragon',t:'all',fx:'dragon',desc:'Hits all foes. Power scales with Regidrago\'s HP: 180 at full, down to 90.'},
 'Slither Wing':{move:'Ancient Wingbeat',type:'Bug',t:'all',fx:'wing',desc:'Hits all foes; your team deals 10% more damage for the rest of the battle.'},
 'Iron Moth':{move:'Ion Flare',type:'Fire',t:'all',fx:'plasma',desc:'Hits all foes and Melts them: +15% damage taken from everything for 2 rounds.'},
 'Chi-Yu':{move:'Ruination Blaze',type:'Fire',t:'all',fx:'ruin',desc:'Hits all foes; any foe above half HP drops to at most half.'},
 'Iron Valiant':{move:'Mirror Edge',type:'Fairy',t:'one',fx:'blade',desc:'Always a critical hit, on top of what the attack bar gives.'},
 'Ogerpon':{move:'Ivy Cudgel',type:'best:Grass,Water,Fire,Rock',t:'one',fx:'cudgel',desc:'Becomes whichever of Grass, Water, Fire or Rock hits hardest. Your attack bar moves 25% slower for it.'},
 'Groudon':{move:'Precipice Blades',type:'Ground',t:'all',fx:'blades',desc:'A row of earthen blades tears across the field, hitting all foes.'},
 'Regigigas':{move:'Display of Power',type:'Normal',t:'all',fx:'mountain',desc:'Hits all foes. On your next turn your team takes 2 less damage from every attack, restores 6 Stamina, and the attack bar moves 10% slower. Regigigas must rest that turn.'},
 'Diancie':{move:'Diamond Storm',type:'Rock',t:'all',fx:'diamonds',desc:'Hits all foes but is never super effective. A diamond shield protects your whole team from all damage during the enemy\'s turn.'}};
// physical or special, matching each signature move
const ULT_CAT={'Genetic Implosion':'S','Earthen Barricade':'P','Permafrost':'S','Corkscrew Cannon':'P','Origin Pulse':'S','Doom Desire':'S','Techno Blast':'S','Overload Surge':'S','Orbital Strike':'P','Fleur Cannon':'S','Spectral Thief':'P','Hex Nut Swarm':'P','Double Iron Bash':'P','Thunder Cage':'S','Dragon Energy':'S','Ancient Wingbeat':'P','Ion Flare':'S','Ruination Blaze':'S','Mirror Edge':'P','Ivy Cudgel':'P','Precipice Blades':'P','Display of Power':'P','Diamond Storm':'P'};
function ultOf(p){return p&&p.ult?ULTS[p.species]||null:null}
function ultType(U,e){if(!U.type.startsWith('best:'))return U.type;const opts=U.type.slice(5).split(',');return opts.reduce((a,t)=>typeEff(t,e.types)>typeEff(a,e.types)?t:a,opts[0])}
// ---- Box: show / unlock the Ultimate ----
function ultBoxHTML(p){const U=ULTS[p.species];if(!U)return '';const tc=TYPE_COLOR[U.type]||'#d6b24a',tl=U.type.startsWith('best:')?'Adapts':U.type;
 if(p.ult)return '<div class="bx-move bx-ult"><i class="bx-mc" style="background:'+(U.type.startsWith('best:')?'conic-gradient(#ee8130,#6390f0,#7ac74c,#b6a136,#ee8130)':tc)+'"></i><div><small>ULTIMATE · '+tl.toUpperCase()+' · FULL ⚡</small><b>✦ '+esc(U.move)+'</b><p>'+esc(U.desc)+'</p></div><span>180</span></div>';
 return '<div class="bx-ultlock"><div><small>LEGENDARY ULTIMATE</small><b>✦ '+esc(U.move)+'</b><p>'+esc(U.desc)+'</p></div><button class="btn red" '+(db.candies<ULT_COST?'disabled':'')+' onclick="unlockUlt(\''+p.id+'\')">UNLOCK · '+ULT_COST+' 🍬</button></div>'}
function unlockUlt(id){const p=db.pokemon.find(x=>x.id===id),U=p&&ULTS[p.species];if(!U||p.ult)return;if(db.candies<ULT_COST){toast('You need '+ULT_COST+' Rare Candy');return}
 if(!confirm('Spend '+ULT_COST+' Rare Candy to unlock '+U.move+' for '+(p.nickname||p.species)+'?'))return;db.candies-=ULT_COST;p.ult=true;save();render();toast('✦ '+(p.nickname||p.species)+' unlocked '+U.move+'!')}
// ---- splash screen: your torn black band, the Pokémon's head sliding down to its left edge while the move name scrawls by ----
// the head on the splash: the top of the Pokémon's front-facing idle sprite (transparent, unlike the portraits)
const ultBusts={};
function ultBust(species){return ultBusts[species]||(ultBusts[species]=loadAnims(species).then(a=>new Promise(ok=>{const an=a.Idle||a.Walk,im=new Image();im.onload=()=>{try{const c=document.createElement('canvas');c.width=an.w;c.height=an.h;const g=c.getContext('2d');g.drawImage(im,0,0,an.w,an.h,0,0,an.w,an.h);
 const d=g.getImageData(0,0,an.w,an.h).data;let x0=an.w,y0=an.h,x1=0,y1=0;for(let y=0;y<an.h;y++)for(let x=0;x<an.w;x++)if(d[(y*an.w+x)*4+3]>20){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}
 const h=Math.max(8,Math.round((y1-y0+1)*.72)),w=x1-x0+1,s=Math.max(w,h),o=document.createElement('canvas');o.width=s;o.height=s;o.getContext('2d').drawImage(c,x0,y0,w,h,Math.round((s-w)/2),s-h,w,h);ok(o.toDataURL())}catch(e){ok(portrait(species)||'')}};im.onerror=()=>ok(portrait(species)||'');im.src=an.url})).catch(()=>portrait(species)||''))}
async function ultSplash(p,U){const head=await ultBust(p.species);return new Promise(res=>{const ov=document.createElement('div');ov.className='ult-splash';
 ov.innerHTML='<div class="ult-band"><img class="ult-bandimg" src="./assets/ult/band.png" alt=""><div class="ult-clip"><img class="ult-head" src="'+head+'" alt=""><div class="ult-txt"><b>'+esc(U.move.toUpperCase())+'</b><small>'+esc((p.nickname||p.species).toUpperCase())+' · ULTIMATE</small></div></div></div>';
 document.body.appendChild(ov);setTimeout(()=>ov.classList.add('out'),1950);setTimeout(()=>{ov.remove();res()},2250)})}
// ---- tiny effect toolkit (positions are relative to the battle field) ----
function fxField(){return document.querySelector('.dg-field')}
function fxPos(sel){const f=fxField(),el=document.querySelector(sel);if(!f||!el)return null;const a=f.getBoundingClientRect(),s=(el.querySelector('.dg-spr')||el).getBoundingClientRect();return {x:s.left-a.left+s.width/2,y:s.top-a.top+s.height/2,w:s.width,h:s.height,b:s.bottom-a.top}}
const fxA=i=>fxPos('.dg-ally[data-i="'+i+'"]'),fxF=i=>fxPos('.dg-foe[data-i="'+i+'"]');
function fxEl(cls,style,html){const f=fxField();if(!f)return null;const d=document.createElement('div');d.className='ufx '+cls;for(const k in style||{})d.style.setProperty(k,style[k]);if(html)d.innerHTML=html;f.appendChild(d);return d}
function fxGone(d,ms){if(d)setTimeout(()=>d.remove(),ms)}
function fxFly(from,to,cls,ms,style,ease){const d=fxEl(cls,Object.assign({left:from.x+'px',top:from.y+'px'},style||{}));if(!d)return;d.animate([{transform:'translate(-50%,-50%)'},{transform:'translate(calc(-50% + '+(to.x-from.x)+'px),calc(-50% + '+(to.y-from.y)+'px))'}],{duration:ms,easing:ease||'ease-in',fill:'forwards'});fxGone(d,ms+40)}
function fxBoom(at,color,size){if(!at)return;fxGone(fxEl('boom',{left:at.x+'px',top:at.y+'px','--c':color,'--s':(size||64)+'px'}),620)}
function fxRing(at,color,ms,scale){if(!at)return;fxGone(fxEl('ring',{left:at.x+'px',top:at.y+'px','--c':color,'--k':scale||8,animation:'uring '+(ms||700)+'ms ease-out forwards'}),ms||700)}
function fxOver(cls,ms){fxGone(fxEl('ov '+cls,{'--ms':(ms||900)+'ms'}),ms||900)}
function fxSpr(sel,cls,ms){const el=document.querySelector(sel+' .dg-spr');if(!el)return;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);setTimeout(()=>el.classList.remove(cls),ms)}
function fxBeam(from,to,color,ms,thick){if(!from||!to)return;const dx=to.x-from.x,dy=to.y-from.y,len=Math.hypot(dx,dy),ang=Math.atan2(dy,dx)*180/Math.PI;fxGone(fxEl('beam',{left:from.x+'px',top:from.y+'px',width:len+'px','--c':color,'--t':(thick||14)+'px',transform:'rotate('+ang+'deg)',animation:'ubeam '+(ms||500)+'ms ease-out forwards'}),ms||500)}
function fxShake(){const f=fxField();if(f){f.classList.remove('shake');void f.offsetWidth;f.classList.add('shake');setTimeout(()=>f.classList.remove('shake'),450)}}
const TC=t=>TYPE_COLOR[t]||'#cccccc';
// ---- one unique animation per Ultimate ----
async function ultFx(U,slot,tis,col,allyIs){const A=fxA(slot),T=tis.map(fxF).filter(Boolean),aSel='.dg-ally[data-i="'+slot+'"]',S=dgSleep;if(!A){await S(300);return}
 const top={x:A.x,y:-40};
 switch(U.fx){
 case 'orbs':{const ring=fxEl('orbring',{left:A.x+'px',top:A.y+'px'},Object.values(TYPE_COLOR).map((c,i)=>'<i style="--c:'+c+';transform:rotate('+(i*20)+'deg) translateX(46px)"></i>').join(''));await S(800);if(ring)ring.remove();
  const MT=T.concat((allyIs||[]).map(fxA).filter(Boolean)); // every Pokémon the implosion will damage, allies included
  Object.values(TYPE_COLOR).forEach((c,i)=>{const tg=MT[i%Math.max(1,MT.length)]||top,a=i*20*Math.PI/180,st={x:A.x+46*Math.cos(a),y:A.y+46*Math.sin(a)},to={x:tg.x+(Math.random()-.5)*30,y:tg.y+(Math.random()-.5)*30};setTimeout(()=>{fxFly(st,to,'orb',260,{'--c':c});setTimeout(()=>fxBoom(to,c,36),250)},i*35)});await S(18*35+420);break}
 case 'warp':{fxSpr(aSel,'u-bounce',500);await S(350);fxRing(A,'#bff5c0',750,14);await S(700);break}
 case 'slam':case 'groundslam':{fxSpr(aSel,'u-slam',950);await S(640);fxRing({x:A.x,y:A.b},'#c9a46a',500,5);fxShake();T.forEach((t,k)=>setTimeout(()=>fxGone(fxEl('spikes',{left:t.x+'px',top:t.b+'px','--c':'#a8875a'}),700),120+k*80));await S(800);break}
 case 'freeze':{fxSpr(aSel,'u-widen',1100);await S(250);fxOver('blizzard',1100);T.forEach(t=>setTimeout(()=>fxBoom(t,'#cdf3ff',80),500));await S(1000);break}
 case 'drill':{const t=T[0];const ball=fxEl('gball',{left:A.x+'px',top:(A.y-20)+'px'});await S(450);if(ball)ball.remove();if(t){fxBeam({x:A.x,y:A.y-20},t,'#7b6a55',900,10);fxFly({x:A.x,y:A.y-20},t,'drill',380,{transform:'rotate('+(Math.atan2(t.y-A.y+20,t.x-A.x)*180/Math.PI)+'deg)'},'linear');await S(380);fxBoom(t,'#cfd5de',84);fxShake()}await S(400);break}
 case 'wave':{fxSpr(aSel,'u-roar',800);await S(450);fxOver('wave',1000);T.forEach(t=>setTimeout(()=>fxBoom(t,'#6aa8ff',70),550));await S(950);break}
 case 'star':{fxFly({x:A.x,y:A.y-20},top,'star',700,{},'ease-out');fxSpr(aSel,'u-glow',700);await S(750);break}
 case 'beam':{const c=col||TC(U.type),t=T[0];if(U.move==='Fleur Cannon'){for(let k=0;k<10;k++){const a=Math.random()*6.28;fxFly({x:A.x+Math.cos(a)*70,y:A.y+Math.sin(a)*70},A,'petal',420,{'--c':'#ff9fc9'},'ease-out')}}
  const ch=fxEl('charge',{left:A.x+'px',top:(A.y-10)+'px','--c':c});await S(500);if(ch)ch.remove();if(t){fxBeam({x:A.x,y:A.y-10},t,c,520,22);await S(200);fxBoom(t,c,96);fxShake()}await S(420);break}
 case 'arcs':{fxOver('flicker',800);const pts=[A].concat(T);for(let rep=0;rep<3;rep++){const d=fxEl('zap',{},'<svg width="100%" height="100%"><polyline points="'+pts.map((p,i)=>{if(!i)return p.x+','+p.y;const q=pts[i-1],mid=[];for(let s=1;s<4;s++)mid.push((q.x+(p.x-q.x)*s/4+(Math.random()-.5)*26)+','+(q.y+(p.y-q.y)*s/4+(Math.random()-.5)*26));return mid.join(' ')+' '+p.x+','+p.y}).join(' ')+'" fill="none" stroke="#fff27a" stroke-width="4" stroke-linejoin="round"/></svg>');fxGone(d,150);await S(180)}T.forEach(t=>fxBoom(t,'#f7d02c',70));await S(350);break}
 case 'orbital':{fxSpr(aSel,'u-launch',900);await S(700);T.forEach((t,k)=>setTimeout(()=>{fxFly({x:t.x+30,y:-30},t,'streak',300,{},'ease-in');setTimeout(()=>fxBoom(t,'#cfd5de',70),290)},k*120));await S(500+T.length*120);break}
 case 'shadow':{const t=T[0];fxSpr(aSel,'u-sink',1300);await S(350);if(t){fxGone(fxEl('shade',{left:(t.x+20)+'px',top:t.y+'px'}),900);for(let k=0;k<5;k++){await S(110);fxBoom({x:t.x+(Math.random()-.5)*30,y:t.y+(Math.random()-.5)*30},'#6b4aa8',48)}}await S(450);break}
 case 'nuts':{for(let k=0;k<24;k++){const t=T[k%Math.max(1,T.length)]||top,a=Math.random()*6.28,mid={x:A.x+Math.cos(a)*60,y:A.y-30+Math.sin(a)*40};setTimeout(()=>fxFly(mid,{x:t.x+(Math.random()-.5)*40,y:t.y+(Math.random()-.5)*30},'nut',320,{},'ease-in'),k*35)}fxSpr(aSel,'u-pop',600);await S(24*35+380);T.forEach(t=>fxBoom(t,'#b7b7ce',60));await S(250);break}
 case 'bash':{const t=T[0];for(let k=0;k<2;k++){fxSpr(aSel,'lunge',380);await S(260);if(t){fxBoom(t,'#b7b7ce',90);fxShake()}await S(280)}break}
 case 'cage':{const t=T[0];fxSpr(aSel,'u-dash',600);if(t)fxBeam(A,t,'#f7d02c',420,8);await S(380);if(t){fxGone(fxEl('cagebars',{left:t.x+'px',top:t.y+'px'}),1100);fxBoom(t,'#f7d02c',60)}await S(800);break}
 case 'dragon':{const ch=fxEl('charge big',{left:A.x+'px',top:(A.y-20)+'px','--c':'#8b5cf6'});await S(650);if(ch)ch.remove();fxOver('dblast',800);fxShake();T.forEach(t=>fxBoom(t,'#8b5cf6',80));await S(700);break}
 case 'wing':{fxSpr(aSel,'u-flap',900);fxOver('heat',1000);for(let k=0;k<26;k++){const t=T[k%Math.max(1,T.length)]||top;setTimeout(()=>fxFly({x:A.x+(Math.random()-.5)*60,y:A.y},{x:t.x+(Math.random()-.5)*70,y:t.y+(Math.random()-.5)*50},'ember',420,{},'ease-out'),k*28)}await S(900);T.forEach(t=>fxBoom(t,'#ff8a3c',64));await S(250);break}
 case 'plasma':{fxRing(A,'#ff9a3c',600,6);await S(300);fxOver('plasmawave',800);T.forEach(t=>setTimeout(()=>fxBoom(t,'#ff7a2c',76),400));await S(800);break}
 case 'ruin':{fxOver('crimson',1100);for(let k=0;k<16;k++){const t=T[k%Math.max(1,T.length)]||top;setTimeout(()=>fxFly({x:A.x,y:A.y-10},{x:t.x+(Math.random()-.5)*40,y:t.y+(Math.random()-.5)*30},'bead',360,{},'ease-out'),k*40)}await S(16*40+380);T.forEach(t=>fxBoom(t,'#8b1020',80));await S(250);break}
 case 'blade':{const t=T[0];fxSpr(aSel,'u-dash',600);if(t){fxBeam(A,t,'#ffffff',380,6);await S(300);fxGone(fxEl('xslash',{left:t.x+'px',top:t.y+'px'}),600);fxShake()}await S(550);break}
 case 'cudgel':{const t=T[0],c=col||'#7ac74c';fxSpr(aSel,'u-masks',700);await S(650);if(t){fxGone(fxEl('club',{left:t.x+'px',top:(t.y-40)+'px'}),500);await S(260);fxBoom(t,c,96);fxShake()}await S(380);break}
 case 'blades':{fxSpr(aSel,'u-roar',800);fxRing(A,'#e0683c',700,5);await S(820);fxSpr(aSel,'u-slamw',1000);await S(680);fxShake();fxRing({x:A.x,y:A.b},'#c9763a',500,6);
  const n=7,st=95,ground={x:A.x,y:A.b};T.forEach(t=>{const tg={x:t.x,y:t.b};for(let k=1;k<=n;k++){const f=k/n,p={x:ground.x+(tg.x-ground.x)*f,y:ground.y+(tg.y-ground.y)*f};setTimeout(()=>fxGone(fxEl('blade',{left:p.x+'px',top:p.y+'px','--h':Math.round(30+f*34)+'px'}),620),k*st)}
   setTimeout(()=>{fxGone(fxEl('blade big',{left:t.x+'px',top:(t.b+4)+'px','--h':Math.round(Math.max(90,t.h*1.25))+'px'}),760);fxBoom(t,'#e0683c',88);fxShake()},(n+1)*st)});await S((n+1)*st+700);break}
 case 'mountain':{fxSpr(aSel,'u-hop',560);await S(360);fxShake();const mt=fxEl('mount',{left:A.x+'px',top:(A.y-A.h/2+4)+'px','--w':Math.round(Math.max(110,A.w*1.6))+'px'});fxSpr(aSel,'u-lift',1300);await S(650);
  if(mt){mt.animate([{transform:'translate(-50%,-100%) rotate(0)'},{transform:'translate(-50%,-100%) translateY(-30px) rotate(-8deg)',offset:.25},{transform:'translate(-50%,-100%) translateY(-'+(A.y+260)+'px) rotate(14deg) scale(.6)'}],{duration:520,easing:'ease-in',fill:'forwards'});fxGone(mt,540)}
  await S(800);const F=fxField(),W=F?F.clientWidth:400,cx=T.length?T.reduce((a,t)=>a+t.x,0)/T.length:W*.7,gy=T.length?Math.max(...T.map(t=>t.b)):A.y,big=fxEl('mount big',{left:cx+'px',top:gy+'px','--w':Math.round(W*.95)+'px'});
  if(big){big.animate([{transform:'translate(-50%,-100%) translateY(-'+(gy+40)+'px)'},{transform:'translate(-50%,-100%) translateY(0)',offset:.55},{transform:'translate(-50%,-100%) translateY(0) scale(1.03,.97)',offset:.7},{transform:'translate(-50%,-100%) translateY(0)',opacity:1,offset:.85},{transform:'translate(-50%,-100%) translateY(10px)',opacity:0}],{duration:900,easing:'ease-in',fill:'forwards'});fxGone(big,920)}
  await S(500);fxShake();T.forEach(t=>{fxBoom(t,'#a8a77a',96);fxGone(fxEl('dust',{left:t.x+'px',top:t.b+'px'}),700)});await S(650);break}
 case 'diamonds':{fxSpr(aSel,'u-rise',2600);fxRing(A,'#ffc2e6',700,4);await S(300);for(let k=0;k<22;k++){const a=Math.random()*6.28,d=70+Math.random()*50;setTimeout(()=>fxFly({x:A.x+Math.cos(a)*d,y:A.y-26+Math.sin(a)*d},{x:A.x,y:A.y-26},'dia',360,{'--z':(6+Math.random()*5)+'px'},'ease-in'),k*22)}
  await S(22*22+380);fxGone(fxEl('charge',{left:A.x+'px',top:(A.y-26)+'px','--c':'#ff9fd6'}),500);await S(380);const F=fxField(),W=F?F.clientWidth:400,H=F?F.clientHeight:600,half=H*.52,D=half+70;fxOver('glint',1900);
  const N=190,gap=8;for(let k=0;k<N;k++){const x0=-D+Math.random()*(W+D),y0=-40-Math.random()*30,ms=420+Math.random()*180;setTimeout(()=>fxFly({x:x0,y:y0},{x:x0+D,y:y0+D},'shard',ms,{'--z':(9+Math.random()*8)+'px'},'linear'),k*gap)}
  T.forEach((t,j)=>[350,700,1050,1400].forEach(ms=>setTimeout(()=>fxBoom(t,'#ffc2e6',56),ms+j*40)));await S(N*gap+560);break}
 default:await S(400)}}
// ---- running an Ultimate ----
function dgBarSlow(b){return b&&(b.slowBar===b.round||b.gigas===b.round)?.9:1}
// damage your team takes from an enemy attack this round: Diamond Storm blocks it all, Display of Power takes 2 off (to a minimum of 0)
function ultGuardDmg(b,dmg){if(!b||!dmg)return dmg;if(b.diamond===b.round)return 0;if(b.gigas===b.round)return Math.max(0,dmg-2);return dmg}
function ultResting(b,m){return !!(b&&m&&m.hp>0&&m.rest===b.round)}
async function dgUltimate(slot,ti,mult,res){const r=runOf(),b=r&&r.battle,m=b&&r.party[slot],p=partyMon(m),U=ultOf(p);if(!U||!b){dgAfterAction();return}
 const c=combatant(p),who='<b style="color:'+SLOT_COLORS[slot]+'">'+esc(p.nickname||p.species)+'</b>';
 if(U.t==='none'&&res==='fail'){if(DG)DG.msg=who+' tried <b>'+esc(U.move)+'</b>… but it fizzled! (Stamina kept)';dgDrawBattle();await dgSleep(1000);dgAfterAction();return}
 m.energy=0;save();
 const foes=b.enemies.map((e,i)=>[e,i]).filter(([e])=>e.hp>0),targets=U.t==='all'?foes:U.t==='one'?foes.filter(([,i])=>i===ti):[];
 const t0=targets[0]&&targets[0][0],col=t0?TC(ultType(U,t0)):TC(U.type);
 await ultSplash(p,U);if(!runOf()||runOf().battle!==b)return;
 let fxFoes=targets.map(([,i])=>i),fxAllies=[];if(U.move==='Genetic Implosion'&&t0){fxFoes=b.enemies.map((e,i)=>e.hp>0&&e.species===t0.species?i:-1).filter(i=>i>=0);fxAllies=r.party.map((x,j)=>x.hp>0&&partyMon(x).species===t0.species?j:-1).filter(j=>j>=0)}
 await ultFx(U,slot,fxFoes,col,fxAllies);if(!runOf()||runOf().battle!==b)return;
 const sb=s=>m.starf&&m.starf.stat===s?2:0,att={atk:c.atk+sb('atk'),spa:c.spa+sb('spa'),types:c.types},UCAT=ULT_CAT[U.move]||'S',extra=1+(b.overclock||0)+(b.teamBoost||0),hits=[],allyHits=[];let note='';
 const strike=(e,i,pw,mm,effOv)=>{const tp=ultType(U,e),mv=[tp,pw,0,'charged'];let {dmg,eff}=dgDamage(att,{def:e.def,spd:e.spd,types:e.types},mv,mm,extra,UCAT);if(effOv!=null){dmg=Math.max(1,Math.round(dmg/Math.max(.01,eff)*effOv));eff=effOv}if(e.melt>0)dmg=Math.round(dmg*1.15);e.hp=Math.max(0,e.hp-dmg);hits.push({i,dmg,eff});return dmg};
 const sp=U.move;
 if(sp==='Genetic Implosion'&&t0){const same=s=>s===t0.species,n=b.enemies.filter(e=>e.hp>0&&same(e.species)).length+r.party.filter(x=>x.hp>0&&same(partyMon(x).species)).length,d=strike(t0,targets[0][1],180,mult,n>=3?2:1);
  b.enemies.forEach((e,i)=>{if(i!==targets[0][1]&&e.hp>0&&same(e.species)){e.hp=Math.max(0,e.hp-d);hits.push({i,dmg:d,eff:n>=3?2:1})}});
  r.party.forEach((x,j)=>{if(x.hp>0&&same(partyMon(x).species)){x.hp=Math.max(0,x.hp-d);allyHits.push({j,dmg:d})}});if(n>=3)note=' Three or more '+esc(t0.species)+' on the field: super effective!'}
 else if(sp==='Time Warp'){b.skip=true;b.warp=true;note=' Time itself bends: every enemy will skip its next turn!'}
 else if(sp==='Doom Desire'&&t0){b.doom={ti:targets[0][1],atk:att.atk,spa:att.spa,types:att.types,mult,extra};note=' A wish-star rises… it will fall at the start of your next turn.'}
 else if(sp==='Double Iron Bash'&&t0){strike(t0,targets[0][1],90,mult);strike(t0,targets[0][1],90,mult);if(t0.hp>0){t0.flinch=true;note=' '+esc(t0.species)+' flinched!'}}
 else if(sp==='Diamond Storm'){targets.forEach(([e,i])=>strike(e,i,180,mult,Math.min(1,typeEff('Rock',e.types))));b.diamond=b.round;note=' A diamond shield forms: your team takes no damage this enemy turn!'}
 else if(sp==='Mirror Edge'&&t0){strike(t0,targets[0][1],180,(mult>=2?2:mult)*2);note=' <span class="t-crit">Critical hit!</span>'}
 else{const pw=sp==='Dragon Energy'?Math.round(90+90*Math.max(0,m.hp)/c.hp):180;
  targets.forEach(([e,i])=>{const before=e.hp;strike(e,i,pw,mult);if(sp==='Ruination Blaze'&&e.hp>0&&e.hp>Math.floor(e.maxhp/2)&&before>e.maxhp/2){const h=hits[hits.length-1],cut=e.hp-Math.floor(e.maxhp/2);e.hp-=cut;h.dmg+=cut}
   if(e.hp>0){if(sp==='Overload Surge'&&Math.random()<.3){e.para=true;note+=' '+esc(e.species)+' is paralyzed!'}if(sp==='Ion Flare')e.melt=2;if(sp==='Thunder Cage'){e.cage=3;note=' '+esc(e.species)+' is trapped in a Thunder Cage!'}}});
  if(sp==='Earthen Barricade'){b.wall=b.round;note=' Your team braces behind earthen walls (−10% damage next enemy turn).'}
  if(sp==='Permafrost'){b.slowBar=b.round+1;note=' The cold slows everything: your next attack bar moves 10% slower.'}
  if(sp==='Corkscrew Cannon'){b.steelRegen=b.round;note=' Your team will restore 10 Stamina next turn.'}
  if(sp==='Orbital Strike'){m.sky=b.round;note=' '+esc(p.species)+' stays up in orbit for the enemy\'s turn.'}
  if(sp==='Fleur Cannon'&&t0&&t0.hp<=0){b.teamBoost=(b.teamBoost||0)+.1;note=' Soul-Heart! Your team deals +10% damage for the rest of the battle.'}
  if(sp==='Display of Power'){b.gigas=b.round+1;m.rest=b.round+1;note=' Next turn your team takes 2 less damage, restores 6 Stamina and the bar slows by 10%. '+esc(p.species)+' will need to rest.'}
  if(sp==='Ancient Wingbeat'){b.teamBoost=(b.teamBoost||0)+.1;note=' Your team deals +10% damage for the rest of the battle.'}
  if(sp==='Ion Flare')note=' The foes are Melted (+15% damage taken for 2 rounds).';
  if(sp==='Spectral Thief'&&t0){const st=t0.energy||0;t0.energy=0;const alive=r.party.filter(x=>x.hp>0);alive.forEach(x=>x.energy=Math.min(100,(x.energy||0)+Math.round(st/Math.max(1,alive.length))));note=st?' Stole '+st+' Stamina and shared it with the team!':' '+esc(t0.species)+' had no Stamina to steal.'}
  if(sp==='Hex Nut Swarm'){const mm=r.party.find(x=>partyMon(x).species==='Melmetal'&&x.hp>0);if(mm){mm.energy=100;note=' Melmetal\'s Stamina Bar is full!'}}}
 save();const tot=hits.reduce((a,h)=>a+h.dmg,0),best=hits.reduce((a,h)=>Math.max(a,h.eff),0);
 if(DG)DG.msg='✦ '+who+' unleashed <b>'+esc(U.move)+'</b>!'+(hits.length?(new Set(hits.map(h=>h.i)).size>1?' Hit '+new Set(hits.map(h=>h.i)).size+' foes for <b>'+tot+'</b>.':' <b>−'+tot+'</b>'):'')+(best>1.2&&sp!=='Genetic Implosion'?' <span class="t-sup">Super effective!</span>':'')+note;
 dgDrawBattle();hits.forEach(h=>{const s='.dg-foe[data-i="'+h.i+'"]';dgHit(s,true);dgFloat(s,'-'+h.dmg,h.eff>1.2?'super':'crit');if(b.enemies[h.i].hp<=0)setTimeout(()=>dgFaint(s),380)});
 allyHits.forEach(h=>{const s='.dg-ally[data-i="'+h.j+'"]';dgHit(s,true);dgFloat(s,'-'+h.dmg,'super');if(r.party[h.j].hp<=0)setTimeout(()=>dgFaint(s),380)});
 await dgSleep(1300);dgAfterAction()}
// ---- effects that resolve at the end of the enemy's turn ----
async function ultEndOfRound(r,b){let any=false;
 b.enemies.forEach((e,i)=>{if(e.hp>0&&e.cage>0){const d=Math.max(1,Math.round(e.maxhp*.1));e.hp=Math.max(0,e.hp-d);e.cage--;any=true;setTimeout(()=>{dgFloat('.dg-foe[data-i="'+i+'"]','-'+d+' ⚡','super');dgHit('.dg-foe[data-i="'+i+'"]')},50)}if(e.melt>0)e.melt--});
 if(b.steelRegen===b.round){r.party.forEach(x=>{if(x.hp>0)x.energy=Math.min(100,(x.energy||0)+10)});if(DG)DG.msg='⚙ Corkscrew Cannon: your team restores 10 Stamina!';any=true}
 if(b.doom){const d=b.doom,e=b.enemies[d.ti];b.doom=null;if(e&&e.hp>0){const tp='Steel',eff=Math.max(1,typeEff(tp,e.types)),{dmg:raw,eff:e0}=dgDamage({atk:d.atk,spa:d.spa,types:d.types},{def:e.def,spd:e.spd,types:e.types},[tp,180,0,'charged'],d.mult,d.extra,'S'),dmg=Math.max(1,Math.round(raw/Math.max(.01,e0)*eff*(e.melt>0?1.15:1)));e.hp=Math.max(0,e.hp-dmg);
   r.party.forEach(x=>{if(x.hp>0){const c=combatant(partyMon(x));x.hp=Math.min(c.hp,x.hp+Math.round(c.hp*.15))}});save();dgDrawBattle();const fp=fxF(d.ti);if(fp){fxGone(fxEl('column',{left:fp.x+'px'}),700);await dgSleep(250);fxBoom(fp,'#fff4a8',100);fxShake()}
   const s='.dg-foe[data-i="'+d.ti+'"]';dgHit(s,true);dgFloat(s,'-'+dmg,'crit');if(DG)DG.msg='🌠 Doom Desire falls on '+esc(e.species)+'! <b>−'+dmg+'</b> · your team recovers 15% HP.';dgSay(DG.msg);if(e.hp<=0)setTimeout(()=>dgFaint(s),380);await dgSleep(1100)}}
 if(b.gigas===b.round+1){r.party.forEach(x=>{if(x.hp>0)x.energy=Math.min(100,(x.energy||0)+6)});if(DG)DG.msg='⛰ Display of Power: your team restores 6 Stamina and braces (−2 damage this turn).';any=true}
 if(b.diamond===b.round){document.querySelectorAll('.dg-ally.dshield').forEach(x=>x.classList.add('dfade'));await dgSleep(550)}
 b.warp=false;if(any){save();dgDrawBattle();await dgSleep(700)}}

