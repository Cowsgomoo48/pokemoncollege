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
   if(map&&field&&r.fl){const mr=map.getBoundingClientRect(),fr=field.getBoundingClientRect(),t=mr.width/r.fl.w;points=[[aim.x-1,aim.y-1],[aim.x+1,aim.y-1],[aim.x-1,aim.y+1],[aim.x+1,aim.y+1]].map(([x,y])=>({x:mr.left-fr.left+(x+.5)*t,y:mr.top-fr.top+(y+.5)*t}))}
   else{const T=targets[0]?fxF(targets[0][1]):A;points=[{x:T.x-45,y:T.y-40},{x:T.x+45,y:T.y-40},{x:T.x-45,y:T.y+40},{x:T.x+45,y:T.y+40}]}
   for(let k=0;k<3;k++){if(!valid())return;fxBeam(points[k],points[k+1],'#8aff43',1500-k*300,9);await dgSleep(300)}if(!valid())return;
   const center={x:(points[0].x+points[3].x)/2,y:(points[0].y+points[3].y)/2};fxRing(center,'#b3ff66',650,5);fxBoom(center,'#7dff31',150);fxShake();await dgSleep(700);
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
 const targets=legendFoes(r,U,tiles);if(grid&&U.fx==='eternabeam')m.dir=aim.dir;else if(grid&&U.fx==='coreenforcer')m.dir=gdDirOf(aim.x-m.x,aim.y-m.y);m.energy=0;save();try{if(grid){dgDrawBattle();await dgFillSprites()}await ultSplash(p,U);if(!valid())return;await legendFx(U,slot,targets,aim,tiles);if(!valid())return;
 const c=combatant(p),hits=[];for(const [e,i]of targets){if(e.hp<=0||e.diving)continue;const before=e.hp;const mv=[U.type,U.power||180,0,'charged'],extra=(1+(b.overclock||0)+(b.teamBoost||0))*ultWaterMult(b,U.type)*(e.melt>0?1.15:1);const {dmg,eff}=dgDamage(c,e,mv,mult,extra,'S');e.hp=Math.max(0,e.hp-dmg);let execution=false;
 if(U.fx==='vaporize'&&((before/e.maxhp)<.15||(e.hp>0&&e.hp/e.maxhp<.15))){e.hp=0;execution=true;legendSteam(fxF(i))}hits.push({e,i,dmg:before-e.hp,eff,execution});}
 if(grid&&U.fx==='eternabeam')r.party.forEach((ally,i)=>{if(i===slot||ally.hp<=0||!tiles.some(([x,y])=>x===ally.x&&y===ally.y))return;const tc=combatant(partyMon(ally)),d=dgDamage(c,tc,[U.type,180,0,'charged'],mult,1,'S').dmg;ally.hp=Math.max(0,ally.hp-d);dgHurt(b,ally,d);dgFloat('.dg-ally[data-i="'+i+'"]','-'+d,'super')});
 save();D.msg='✦ '+esc(p.nickname||p.species)+' used <b>'+esc(U.move)+'</b>! '+hits.map(h=>esc(h.e.species)+(h.execution?' vaporized!':' −'+h.dmg)).join(' · ');dgDrawBattle();for(const h of hits){dgHit('.dg-foe[data-i="'+h.i+'"]',true);dgFloat('.dg-foe[data-i="'+h.i+'"]',h.execution?'VAPORIZED':'-'+h.dmg,h.eff>1?'super':'crit')}
 await dgSleep(1000);if(valid())dgAfterAction();
 }catch(error){if(valid()){D.busy=0;dgDrawBattle()}throw error}}
