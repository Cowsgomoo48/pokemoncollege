// Viability compares intrinsic strength and the currently equipped moves, independent of level.
// Fixed roster/move ceilings keep scores comparable without depending on which Pokémon are owned.
function boxViabilityScorer(){
 const bstMax=Math.max(1,...Object.values(SPECIES_DATA).map(s=>s.stats.reduce((a,b)=>a+b,0))),caps={fast:1,charged:1};
 for(const [name,mv] of Object.entries(MOVE_STATS)){const slot=mv[3]==='fast'?'fast':'charged';caps[slot]=Math.max(caps[slot],movePow(name))}
 const clamp=n=>Math.max(0,Math.min(1,Number.isFinite(n)?n:0));
 return p=>{const s=SPECIES_DATA[p.species],bst=s?s.stats.reduce((a,b)=>a+b,0):0,types=s?.types||[],matchups=Object.keys(TYPE_CHART).map(t=>typeEff(t,types)),growth=monGrowth(p);
  const stats=35*clamp(bst/bstMax),moves=20*clamp(movePow(p.discMove)/caps.charged)+5*clamp(movePow(p.fastMove)/caps.fast),typing=20*(matchups.reduce((sum,m)=>sum+1/(1+m),0)/Math.max(1,matchups.length)),ultimate=ultOf(p)?10:0,genes=10*clamp(growth.reduce((a,b)=>a+(Number(b)||0),0)/84);
  return {total:stats+moves+typing+ultimate+genes,stats,moves,typing,ultimate,growth:genes};
 }
}
