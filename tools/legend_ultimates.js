// Custom Legendary Ultimates. Geometry is frozen before animations and never alters map positions.
Object.assign(ULTS,{
 Zygarde:{move:'Core Enforcer',type:'Dragon',t:'all',fx:'coreenforcer',power:180,custom:true,desc:'Choose a tile within 10 tiles. Green energy traces a Z, then explodes across a 3×3 area centered there.'},
 Volcanion:{move:'Vaporize',type:'Water',t:'all',fx:'vaporize',power:90,custom:true,desc:'Steam floods the screen for 90 power. Targets below 15% HP before or after the hit instantly faint.'},
 Eternatus:{move:'Eternabeam',type:'Dragon',t:'all',fx:'eternabeam',power:180,custom:true,desc:'Choose one of eight directions. A piercing crimson-pink beam strikes every Pokémon in its lane until a wall, including allies.'}
});Object.assign(ULT_CAT,{'Core Enforcer':'S','Vaporize':'S','Eternabeam':'S'});
function legendRay(fl,m,dir){const [dx,dy]=GD_DIRS[dir],out=[];for(let x=m.x+dx,y=m.y+dy;gdTile(fl,x,y);x+=dx,y+=dy)out.push([x,y]);return out}
function legendTiles(r,m,U,aim){if(U.fx==='coreenforcer'){const out=[];for(let y=aim.y-1;y<=aim.y+1;y++)for(let x=aim.x-1;x<=aim.x+1;x++)if(gdTile(r.fl,x,y))out.push([x,y]);return out}return U.fx==='eternabeam'?legendRay(r.fl,m,aim.dir):[]}
function legendFoes(r,U,tiles){const grid=!!r.fl,lit=grid&&U.fx==='vaporize'?gdLit(r):null;return r.battle.enemies.map((e,i)=>[e,i]).filter(([e])=>e.hp>0&&!e.done&&!e.gdOut&&!e.diving&&(U.fx==='vaporize'?(!lit||lit.has(gdKey(e.x,e.y))):!grid||tiles.some(([x,y])=>e.x===x&&e.y===y)))}
function legendCancelAim(){const D=DG;if(!D)return;D.legendAim=null;D.legendGo=null;D.legendAura?.remove();D.legendAura=null;D.hl=null;D.busy=0;D.gmode='select';gdHighlight();dgPanelBattle()}
async function legendGridStart(U){const r=runOf(),b=r?.battle,D=DG,slot=b?.turn,m=r?.party[slot],ep=dgEpoch;if(!b||D.busy||!m||m.acted||m.energy<100)return;D.busy=1;
 const res=await dgQ('✦ '+U.move.toUpperCase(),{hint:true});if(runOf()!==r||DG!==D||dgEpoch!==ep||r.battle!==b)return;
 const mult=r.slider?await dgSlider(res,dgBarSlow(b)):dgRandMult();if(runOf()!==r||DG!==D||dgEpoch!==ep||r.battle!==b||m.energy<100||m.acted)return;
 const go=aim=>{D.legendAim=null;D.legendGo=null;D.legendAura?.remove();D.legendAura=null;D.hl=null;gdHighlight();D.gmode='select';D.busy=1;legendUltimate(slot,U,mult,aim)};
 if(U.fx==='vaporize'){go({});return}
 D.gmode='legend-target';const cancel='<button class="btn" onclick="legendCancelAim()">CANCEL</button>';
 if(U.fx==='coreenforcer'){
  const tiles=ocTiles(r.fl).filter(([x,y])=>gdCheb(m,{x,y})<=10);D.hl={cls:'tg',tiles};gdHighlight();
  const aura=document.createElement('div');aura.className='lg-core-idle';aura.style.left=m.x*GD_T+'px';aura.style.top=m.y*GD_T+'px';aura.innerHTML=Array.from({length:12},(_,i)=>'<i style="--a:'+i*30+'deg;--delay:'+(-i*.1)+'s"></i>').join('');document.querySelector('.gd-map')?.appendChild(aura);D.legendAura=aura;
  D.legendAim=(x,y)=>{if(runOf()!==r||DG!==D||dgEpoch!==ep||r.battle!==b)return;if(gdTile(r.fl,x,y)&&gdCheb(m,{x,y})<=10)go({x,y})};
  $('dgPanel').innerHTML='<div class="dg-msg">Choose the center of Core Enforcer’s 3×3 blast within 10 tiles.</div>'+cancel;
 }else{
  D.legendAim=(x,y)=>{if(x===m.x&&y===m.y)return;const dir=gdDirOf(x-m.x,y-m.y);if(legendRay(r.fl,m,dir).length)go({dir})};
  D.legendGo=dir=>{if(runOf()===r&&DG===D&&ep===dgEpoch&&r.battle===b&&legendRay(r.fl,m,dir).length)go({dir})};
  $('dgPanel').innerHTML='<div class="dg-msg">Choose Eternabeam’s direction. Allies in its lane will also be hit.</div><div class="dg-acts">'+['↓','↘','→','↗','↑','↖','←','↙'].map((a,i)=>'<button class="btn" onclick="DG.legendGo('+i+')">'+a+'</button>').join('')+'</div>'+cancel;
 }
}
function legendSteam(at){if(!at)return;for(let i=0;i<12;i++)fxFly({x:at.x+(i%4-1.5)*8,y:at.b||at.y},{x:at.x+(Math.random()-.5)*100,y:at.y-50-Math.random()*45},'lg-steam',600+Math.random()*300,{'--c':'#f4ffff'})}
async function legendFx(U,slot,targets,aim,tiles){const r=runOf(),b=r.battle,D=DG,ep=dgEpoch,valid=()=>runOf()===r&&r.battle===b&&DG===D&&ep===dgEpoch;const els=[],animations=[];
 const make=(cls,style,html)=>{const e=fxEl(cls,style,html);if(e)els.push(e);return e};
 const animate=(e,frames,ms)=>{if(e){const a=e.animate(frames,{duration:ms,fill:'forwards',easing:'ease-in-out'});animations.push(a);return a}};
 try{
  const A=fxA(slot);if(!A)return;
  if(U.fx==='coreenforcer'){
   const map=document.querySelector('.gd-map'),field=fxField();let points;
   if(map&&field&&r.fl){const c=DG&&DG.cam,mr=map.getBoundingClientRect(),fr=field.getBoundingClientRect(),t=c?c.T:mr.width/r.fl.w,ox=c?c.tx:mr.left-fr.left,oy=c?c.ty:mr.top-fr.top;points=[[aim.x-1,aim.y-1],[aim.x+1,aim.y-1],[aim.x-1,aim.y+1],[aim.x+1,aim.y+1]].map(([x,y])=>({x:ox+(x+.5)*t,y:oy+(y+.5)*t}))}
   else{const T=targets[0]?fxF(targets[0][1]):A;points=[{x:T.x-45,y:T.y-40},{x:T.x+45,y:T.y-40},{x:T.x-45,y:T.y+40},{x:T.x+45,y:T.y+40}]}
   if(typeof DG!=='undefined'&&DG)DG.camLock=true;for(let k=0;k<3;k++){if(!valid()){if(DG)DG.camLock=false;return}fxBeam(points[k],points[k+1],'#8aff43',2300-k*420,9);await dgSleep(420)}if(!valid())return;
   const center={x:(points[0].x+points[3].x)/2,y:(points[0].y+points[3].y)/2},tile=Math.abs(points[1].x-points[0].x)/2||40;await legendMushroom(center,tile,valid);
  }else if(U.fx==='vaporize'){
   const sprite=document.querySelector('.dg-ally[data-i="'+slot+'"] .dg-spr');legendSteam(A);
   animate(sprite,[{filter:'none'},{filter:'sepia(1) saturate(10) hue-rotate(315deg)',offset:.16},{filter:'none',offset:.32},{filter:'sepia(1) saturate(10) hue-rotate(315deg)',offset:.48},{filter:'none',offset:.64},{filter:'sepia(1) saturate(10) hue-rotate(315deg)',offset:.8},{filter:'none'}],1800);
   const heat=make('lg-heat',{});await dgSleep(1800);if(!valid())return;
   animate(sprite,[{scale:'1'},{scale:'1.6 1.35',offset:.35},{scale:'.65 .5',opacity:.5,offset:.8},{scale:'.3 .2',opacity:0}],1800);animate(heat,[{opacity:0},{opacity:.85,offset:.8},{opacity:0}],1800);
   await dgSleep(1800);if(!valid())return;for(const [,i]of targets)legendSteam(fxF(i));fxShake();await dgSleep(700);
  }else{
   const endpoint=tiles.length?tiles[tiles.length-1]:null;let end=targets.length?fxF(targets[targets.length-1][1]):{x:A.x,y:0};
   if(endpoint&&r.fl){const mp=document.querySelector('.gd-map').getBoundingClientRect(),fr=fxField().getBoundingClientRect(),t=mp.width/r.fl.w;end={x:mp.left-fr.left+(endpoint[0]+.5)*t,y:mp.top-fr.top+(endpoint[1]+.5)*t}}
   const beam=make('lg-eternabeam',{left:A.x+'px',top:A.y+'px',width:Math.hypot(end.x-A.x,end.y-A.y)+'px',transform:'rotate('+Math.atan2(end.y-A.y,end.x-A.x)*180/Math.PI+'deg)'});
   animate(beam,[{clipPath:'inset(0 100% 0 0)',opacity:0},{clipPath:'inset(0 0 0 0)',opacity:1,offset:.35},{opacity:1,offset:.85},{opacity:0}],1500);
   const shaken=targets.map(([,i])=>'.dg-foe[data-i="'+i+'"]');if(r.fl)r.party.forEach((m,i)=>{if(i!==slot&&m.hp>0&&tiles.some(([x,y])=>m.x===x&&m.y===y))shaken.push('.dg-ally[data-i="'+i+'"]')});
   for(const selector of shaken){const el=document.querySelector(selector+' .dg-spr');if(el){const a=el.animate([{translate:'-4px 0'},{translate:'4px 0'}],{duration:70,iterations:20});animations.push(a)}}
   await dgSleep(1500);if(!valid())return;for(const selector of shaken){const T=fxPos(selector);fxBoom(T,'#ef367c',90);fxRing(T,'#ff7da9',450,3)}fxShake();await dgSleep(550);

  }
 }finally{animations.forEach(a=>a.cancel());els.forEach(e=>e.remove())}
}
async function legendUltimate(slot,U,mult,aim={}){const r=runOf(),b=r?.battle,m=r?.party[slot],D=DG,ep=dgEpoch,p=m&&partyMon(m);if(!b||!p||m.hp<=0||m.energy<100||!p.ult||m.acted)return;const valid=()=>runOf()===r&&r.battle===b&&DG===D&&dgEpoch===ep;
 const grid=!!r.fl;let tiles=[];if(grid){if(U.fx==='coreenforcer'&&(!gdTile(r.fl,aim.x,aim.y)||gdCheb(m,aim)>10))return;if(U.fx==='eternabeam'&&(!Number.isInteger(aim.dir)||aim.dir<0||aim.dir>7))return;tiles=legendTiles(r,m,U,aim)}
 const targets=legendFoes(r,U,tiles);if(grid&&U.fx==='eternabeam')m.dir=aim.dir;else if(grid&&U.fx==='coreenforcer')m.dir=gdDirOf(aim.x-m.x,aim.y-m.y);m.energy=0;save();try{if(grid){dgDrawBattle();await dgFillSprites()}await ultSplash(p,U);if(!valid())return;
 if(grid&&U.fx==='eternabeam'&&DG.cam&&tiles.length){await legendEternabeamRun(slot,U,mult,targets,tiles,valid);return}
 await legendFx(U,slot,targets,aim,tiles);if(!valid())return;
 const c=combatant(p),hits=[];for(const [e,i]of targets){if(e.hp<=0||e.diving)continue;const before=e.hp;const mv=[U.type,U.power||180,0,'charged'],extra=(1+(b.overclock||0)+(b.teamBoost||0))*ultWaterMult(b,U.type)*(e.melt>0?1.15:1);const {dmg,eff}=dgDamage(c,e,mv,mult,extra,'S');e.hp=Math.max(0,e.hp-dmg);let execution=false;
 if(U.fx==='vaporize'&&((before/e.maxhp)<.15||(e.hp>0&&e.hp/e.maxhp<.15))){e.hp=0;execution=true;legendSteam(fxF(i))}hits.push({e,i,dmg:before-e.hp,eff,execution});}
 if(grid&&U.fx==='eternabeam')r.party.forEach((ally,i)=>{if(i===slot||ally.hp<=0||!tiles.some(([x,y])=>x===ally.x&&y===ally.y))return;const tc=combatant(partyMon(ally)),d=dgDamage(c,tc,[U.type,180,0,'charged'],mult,1,'S').dmg;ally.hp=Math.max(0,ally.hp-d);dgHurt(b,ally,d);dgFloat('.dg-ally[data-i="'+i+'"]','-'+d,'super')});
 save();D.msg='✦ '+esc(p.nickname||p.species)+' used <b>'+esc(U.move)+'</b>! '+hits.map(h=>esc(h.e.species)+(h.execution?' vaporized!':' −'+h.dmg)).join(' · ');dgDrawBattle();for(const h of hits){dgHit('.dg-foe[data-i="'+h.i+'"]',true);dgFloat('.dg-foe[data-i="'+h.i+'"]',h.execution?'VAPORIZED':'-'+h.dmg,h.eff>1?'super':'crit')}
 await dgSleep(1000);if(valid())dgAfterAction();
 }catch(error){if(valid()){D.busy=0;dgDrawBattle()}throw error}}

// Core Enforcer finale: a chain of small blasts across the 3×3, then a green mushroom cloud; returns as the cloud starts to fade (damage lands then)
async function legendMushroom(c,t,valid){const unlock=()=>{if(typeof DG!=='undefined'&&DG)DG.camLock=false};try{
 for(let k=0;k<8;k++){if(!valid())return;const p={x:c.x+(Math.round(Math.random()*2-1))*t+(Math.random()-.5)*t*.5,y:c.y+(Math.round(Math.random()*2-1))*t+(Math.random()-.5)*t*.5};fxBoom(p,k%2?'#d9ff6a':'#8aff43',t*(1+Math.random()*.6));if(k%3===0){fxRing(p,'#c8ff7a',420,2.2);fxShake()}await dgSleep(85+Math.random()*40)}
 if(!valid())return;const f=fxField();if(!f){unlock();return}
 const flash=fxEl('lg-flash',{});if(flash){flash.animate([{opacity:.9},{opacity:0}],{duration:420,easing:'ease-out',fill:'forwards'});fxGone(flash,440)}
 fxRing({x:c.x,y:c.y+t*.4},'#e9ffb0',900,10);fxShake();
 const capH=t*2.3,H=Math.max(t*1.6,Math.min(t*3.4,c.y+t*.5-capH*.55-6)),root=fxEl('lg-cloud',{left:c.x+'px',top:(c.y+t*.5)+'px'},'<div class="lg-stem"></div><div class="lg-torus"></div><div class="lg-cap">'+Array.from({length:9},(_,i)=>'<i style="--x:'+(Math.cos(i/9*6.283)*.32).toFixed(2)+';--y:'+(Math.sin(i/9*6.283)*.18).toFixed(2)+';--d:'+(-i*.13)+'s"></i>').join('')+'<b></b></div>');if(!root)return;
 root.style.setProperty('--t',t+'px');root.style.setProperty('--h',H+'px');
 const stem=root.querySelector('.lg-stem'),cap=root.querySelector('.lg-cap'),tor=root.querySelector('.lg-torus');
 stem.animate([{height:'0px',opacity:1},{height:H+'px',opacity:1}],{duration:900,easing:'cubic-bezier(.2,.8,.3,1)',fill:'forwards'});
 cap.animate([{transform:'translate(-50%,-50%) translateY(0) scale(.25)',opacity:1},{transform:'translate(-50%,-50%) translateY('+(-H)+'px) scale(1)',opacity:1}],{duration:950,easing:'cubic-bezier(.2,.8,.3,1)',fill:'forwards'});
 tor.animate([{transform:'translate(-50%,-50%) translateY(0) scale(.3)',opacity:0},{transform:'translate(-50%,-50%) translateY('+(-H*.45)+'px) scale(1)',opacity:.9}],{duration:1000,easing:'ease-out',fill:'forwards'});
 (async()=>{await dgSleep(120);for(let k=0;k<14;k++){if(!valid())return;const a=Math.random()*6.283,r=t*(1.2+Math.random()*2.5);fxFly({x:c.x,y:c.y},{x:c.x+Math.cos(a)*r,y:c.y-Math.abs(Math.sin(a))*r*.6},'spark',600,{'--c':k%2?'#eaff8a':'#7dff31'},'ease-out');await dgSleep(40)}})();
 await dgSleep(1050);if(!valid()){root.remove();return}
 root.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY('+(-t*.8)+'px)'}],{duration:1300,easing:'ease-in',fill:'forwards'});fxGone(root,1350);await dgSleep(250);(async()=>{await dgSleep(1150);unlock()})();return}finally{if(!valid())unlock()}}

// Eternabeam (Mystery Dungeon): work out the full damage for everything in the lane, pool it, then a persistent beam
// pays it out 1 HP at a time (every 0.1 s, then 0.03 s, then 0.01 s) until the pool is spent or nothing in the lane is left
async function legendEternabeamRun(slot,U,mult,targets,tiles,valid){const r=runOf(),b=r.battle,m=r.party[slot],p=partyMon(m),c=combatant(p),D=DG,plan=[];
 for(const [e,i] of targets){if(e.hp<=0||e.diving)continue;const mv=[U.type,U.power||180,0,'charged'],extra=(1+(b.overclock||0)+(b.teamBoost||0))*ultWaterMult(b,U.type)*(e.melt>0?1.15:1),{dmg,eff}=dgDamage(c,e,mv,mult,extra,'S');plan.push({foe:true,o:e,i,sel:'.dg-foe[data-i="'+i+'"]',max:e.maxhp,dmg,eff,dealt:0,acc:0})}
 r.party.forEach((ally,i)=>{if(i===slot||ally.hp<=0||!tiles.some(([x,y])=>x===ally.x&&y===ally.y))return;const tc=combatant(partyMon(ally)),d=dgDamage(c,tc,[U.type,180,0,'charged'],mult,1,'S').dmg;plan.push({foe:false,o:ally,i,sel:'.dg-ally[data-i="'+i+'"]',max:tc.hp,dmg:d,eff:1,dealt:0,acc:0})});
 let pool=plan.reduce((a,q)=>a+q.dmg,0);const total=Math.min(pool,plan.reduce((a,q)=>a+q.o.hp,0));
 D.camLock=true;const cam=D.cam,A=fxA(slot),end=tiles[tiles.length-1],T=cam.T,E={x:cam.tx+(end[0]+.5)*T,y:cam.ty+(end[1]+.5)*T},len=Math.hypot(E.x-A.x,E.y-A.y)+T*.5,ang=Math.atan2(E.y-A.y,E.x-A.x),els=[],anims=[];
 const el=(cls,st,html)=>{const e=fxEl(cls,st,html);if(e)els.push(e);return e},an=(e,f,o)=>{if(e){const a=e.animate(f,o);anims.push(a);return a}};
 try{
  // charge: a small orb, then a thin beam that swells, then the full beam releases
  const orb=el('lg-eorb',{left:A.x+'px',top:A.y+'px','--s':T+'px'});an(orb,[{transform:'translate(-50%,-50%) scale(.2)',opacity:.6},{transform:'translate(-50%,-50%) scale(1.5)',opacity:1}],{duration:650,easing:'ease-in',fill:'forwards'});
  const beam=el('lg-ebeam',{left:A.x+'px',top:A.y+'px',width:len+'px',transform:'rotate('+ang+'rad)','--h':'3px'},'<i class="glow"></i><i class="core"></i><svg width="'+Math.round(len)+'" height="'+Math.round(T*2.4)+'" viewBox="0 0 '+Math.round(len)+' '+Math.round(T*2.4)+'"></svg>');
  const shake=plan.map(q=>{const s=document.querySelector(q.sel+' .dg-spr');return s?an(s,[{translate:'-3px 0'},{translate:'3px 0'}],{duration:60,iterations:Infinity}):null});
  await dgSleep(450);if(!valid())return;
  const svg=beam.querySelector('svg'),H2=T*1.2,crackle=()=>{let h='';for(let n=0;n<4;n++){let pts='0,'+H2;for(let x=14;x<len;x+=14+Math.random()*12)pts+=' '+x.toFixed(0)+','+(H2+(Math.random()-.5)*T*(n<2?2.2:1.4)).toFixed(0);h+='<polyline points="'+pts+'" fill="none" stroke="'+(n%2?'#ffd0e6':'#ff2d6f')+'" stroke-width="'+(n%2?1.5:2.5)+'" stroke-linejoin="round" opacity=".9"/>'}svg.innerHTML=h};
  // damage numbers draw above the laser
  const num=(q,n)=>{const P=fxPos(q.sel);if(!P)return;const d=el('lg-dmg',{left:(P.x+(Math.random()-.5)*12)+'px',top:(P.y-P.h*.3)+'px'},'-'+n);if(!d)return;d.classList.toggle('sup',q.eff>1);an(d,[{transform:'translate(-50%,-50%) scale(1.25)',opacity:1},{transform:'translate(-50%,-50%) translateY(-10px) scale(1)',opacity:1,offset:.6},{transform:'translate(-50%,-50%) translateY(-22px)',opacity:0}],{duration:520,easing:'ease-out',fill:'forwards'});setTimeout(()=>d.remove(),560)};
  let last=0,flushAt=0,rr=0,dealtAll=0;const flush=force=>{const now=performance.now();if(!force&&now-flushAt<130)return;flushAt=now;plan.forEach(q=>{if(q.acc){num(q,q.acc);q.acc=0}})};
  const bar=q=>{const b2=document.querySelector(q.sel+' .gd-hp i');if(b2)b2.style.width=Math.max(0,q.o.hp/q.max*100)+'%'};
  // three beam sizes: small (every 0.1 s), medium (every 0.03 s), giant crackling laser (every 0.01 s); each holds a moment before growing
  const phases=[{h:T*.18,ms:100},{h:T*.55,ms:30,shake:true},{h:T*1.2,ms:10,full:true}];
  for(let ph=0;ph<3;ph++){const P=phases[ph],quota=Math.round(total*(ph+1)/3)-dealtAll;beam.style.setProperty('--h',P.h+'px');if(P.shake){fxShake();fxRing(A,'#ff7da9',420,2.5)}if(P.full){beam.classList.add('full');fxShake();fxRing(A,'#ff7da9',520,4)}
   for(let k=0;k<quota;k++){if(!valid())return;const alive=plan.filter(q=>q.o.hp>0);if(!alive.length||pool<=0)break;const q=alive[rr++%alive.length];q.o.hp-=1;q.dealt++;pool--;dealtAll++;bar(q);num(q,1);
    if(q.o.hp<=0){q.o.hp=0;fxBoom(fxPos(q.sel),'#ef367c',90);fxRing(fxPos(q.sel),'#ff7da9',450,3)}
    const now=performance.now();if(P.full&&now-last>55){crackle();last=now}await dgSleep(P.ms)}
   flush(true);if(!plan.some(q=>q.o.hp>0)||pool<=0)break;
   const hold=performance.now();while(performance.now()-hold<280){if(!valid())return;if(P.full)crackle();await dgSleep(55)}}
  flush(true);if(!valid())return;
  an(beam,[{opacity:1},{opacity:0}],{duration:420,fill:'forwards'});an(orb,[{opacity:1},{opacity:0}],{duration:420,fill:'forwards'});shake.forEach(a=>a&&a.cancel());await dgSleep(430);
 }finally{anims.forEach(a=>{try{a.cancel()}catch(e){}});els.forEach(e=>e.remove());D.camLock=false}
 if(!valid())return;plan.filter(q=>!q.foe&&q.dealt).forEach(q=>dgHurt(b,q.o,q.dealt));save();
 D.msg='✦ '+esc(p.nickname||p.species)+' used <b>'+esc(U.move)+'</b>! '+plan.filter(q=>q.foe).map(q=>esc(q.o.species)+' −'+q.dealt).join(' · ')+plan.filter(q=>!q.foe&&q.dealt).map(q=>' · '+esc(partyMon(q.o).nickname||partyMon(q.o).species)+' −'+q.dealt).join('');
 dgDrawBattle();await dgSleep(900);if(valid())dgAfterAction()}
