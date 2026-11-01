// Viability is a roster-independent heuristic, not a battle simulator.
// Potential projects the owned Pokémon to Lv 100 with its growth/nature and current moves.
// Viability uses actual stats. Fixed perfect-growth roster ceilings avoid collection bias.
function boxProjectedStats(p,base,level){
 const g=monGrowth(p),nat=monNature(p);
 return base.map((b,i)=>{const B=b/10,BV=g[(i+5)%6]/100,AV=g[i]/100,N=nat.length>1?(i===nat[1]?1:i===nat[2]?-1:0):0;
 return Math.max(1,Math.round(i===0?B+(level-1)*(2*B*(BV+AV)+1)/10:B+B*(level-1)*BV*(1+AV)/10)+N)})
}
function boxViabilityScorer(mode='viability'){
 const ready=mode==='battleReady',clamp=n=>Math.max(0,Math.min(1,Number.isFinite(n)?n:0)),roster=Object.values(SPECIES_DATA),types=Object.keys(TYPE_CHART);
 const ceiling=Array.from({length:6},(_,i)=>Math.max(1,...roster.map(s=>{const B=s.stats[i]/10,L=100;return Math.max(1,Math.round(i===0?B+(L-1)*(2*B*.28+1)/10:B+B*(L-1)*.14*1.14/10)+1)})));
 const caps={fast:1,charged:1};
 const coefficient=(name,mv)=>((mv[3]==='fast'?mv[1]/6+1:mv[1]/18+2)*multiAvg(name));
 for(const [name,mv] of Object.entries(MOVE_STATS))caps[mv[3]==='fast'?'fast':'charged']=Math.max(caps[mv[3]==='fast'?'fast':'charged'],coefficient(name,mv));
 return p=>{
 const species=SPECIES_DATA[p.species],base=species?.stats||[0,0,0,0,0,0],ownTypes=species?.types||[],st=ready?monStats(p,base):boxProjectedStats(p,base,100),n=st.map((v,i)=>clamp(v/ceiling[i]));
 const attackFor=cat=>cat==='S'?3:cat==='P'?1:(st[3]>st[1]?3:1);
 const moves=[p.fastMove,p.discMove].map(name=>{
  const mv=MOVE_STATS[name];if(!mv)return {value:0,eff:()=>0,aligned:false};
  const ai=attackFor(moveCat(mv)),stab=ownTypes.includes(String(mv[0]).toLowerCase())?1.2:1,shape=gdShape(name,mv);
  // Modest bonuses: geometry does not guarantee extra targets in a real encounter.
  const utility=1+Math.min(.12,Math.max(0,shape.r-1)*.03)+(shape.k==='area'?.12:shape.k==='beam'?.08:0)+(MOVE_DRAIN[name]?.06:0);
  return {value:clamp(coefficient(name,mv)/caps[mv[3]==='fast'?'fast':'charged']*n[ai]*(stab/1.2)*utility/1.3),eff:t=>typeEff(mv[0],t),aligned:st[ai]>=Math.max(st[1],st[3])*.9,shape};
 });
 const stats=25*(.4*Math.max(n[1],n[3])+.4*Math.sqrt(n[0]*(n[2]+n[4])/2)+.2*n[5]);
 const moveScore=35*(.3*moves[0].value+.7*moves[1].value);
 const incoming=types.map(t=>typeEff(t,ownTypes)),typing=20*incoming.reduce((a,e)=>a+1/(1+e),0)/Math.max(1,incoming.length);
 // Best available ordinary move against each actual species, including dual typing.
 const coverageRatio=roster.reduce((a,s)=>a+clamp(Math.max(...moves.map(m=>m.eff(s.types)))/2),0)/Math.max(1,roster.length),coverage=10*coverageRatio;
 const U=ultOf(p);let ultimate=0;
 if(U){
  const ai=attackFor(ULT_CAT[U.move]),power=U.fx==='warp'?0:U.power||180;
  const damage=.55*clamp(power/180)*n[ai],area=U.t==='all'?.15:0;
  // Explicit implemented effects; never infer combat effects from descriptive prose.
  const support={warp:.85,slam:.15,freeze:.1,drill:.15,star:.2,arcs:.15,orbital:.2,beam:U.move==='Fleur Cannon'?.15:0,shadow:.2,nuts:.1,bash:.2,cage:.15,wing:.2,plasma:.2,ruin:.2,cudgel:.15,mountain:.15,diamonds:.3,suddenbreath:.1,vaporize:.2,coreenforcer:.1};
  const risk=U.fx==='eternabeam'?.15:U.fx==='orbs'?.05:U.fx==='dragon'?.05:U.fx==='mountain'?.1:0;
  ultimate=10*clamp(damage+area+(support[U.fx]||0)-risk);
 }
 const tags=[];
 tags.push(st[3]>st[1]*1.15?'Special attacker':st[1]>st[3]*1.15?'Physical attacker':'Mixed attacker');
 if(moves.every(m=>m.aligned))tags.push('Moves suit attack stats');else tags.push('Move/stat mismatch');
 tags.push(coverageRatio>=.6?'Wide type coverage':'Limited type coverage');
 if(incoming.some(e=>e>=2.5))tags.push('Stacked type weakness');
 if(Math.sqrt(n[0]*(n[2]+n[4])/2)<.3)tags.push('Low durability');
 if(U)tags.push('Ultimate unlocked');
 const parts={stats,moves:moveScore,typing,coverage,ultimate};
 return {total:Object.values(parts).reduce((a,b)=>a+b,0),...parts,tags};
 }
}
function boxViabilityHTML(p){
 const mode=$('boxSort').value;if(!['viability','battleReady'].includes(mode))return '';
 const s=boxViabilityScorer(mode)(p),labels={stats:'Stat distribution',moves:'Equipped moves',typing:'Defensive typing',coverage:'Type coverage',ultimate:'Ultimate'},caps={stats:25,moves:35,typing:20,coverage:10,ultimate:10};
 return '<div class="bx-viability"><b>'+ (mode==='battleReady'?'Viability':'Potential')+' · '+s.total.toFixed(1)+'/100</b><p>'+s.tags.map(esc).join(' · ')+'</p><details><summary>Score breakdown</summary>'+Object.entries(labels).map(([k,label])=>'<div class="row"><span>'+label+'</span><b>'+s[k].toFixed(1)+' / '+caps[k]+'</b></div>').join('')+'<p>'+(mode==='battleReady'?'Current level and stats.':'Projected to Lv 100, including growth and nature.')+' Equipped moves and unlocked Ultimates only. General dungeon estimate; does not predict a specific boss, team, terrain, or temporary run bonuses. Ultimate utility bonuses are estimates.</p></details></div>';
}

// Store the Box sort with normal app progress so recovery and backups retain it.
function boxSortValue(value){return ['newest','species','rarity','size','shiny','friendship','viability','battleReady'].includes(value)?value:'newest'}
function restoreBoxSort(){const value=boxSortValue(db.boxSort);$('boxSort').value=value;return value}
function changeBoxSort(value){db.boxSort=boxSortValue(value);boxPageNum=0;save();drawCollection()}
