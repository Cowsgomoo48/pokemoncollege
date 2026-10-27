const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '../www/index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
new vm.Script(script);
const migration = script.slice(script.indexOf('const RETIRED_SPECIES='), script.indexOf('const EVO='));
const mons = script.match(/const MONS=(\[[\s\S]*?\]);/)[0];
const evo = script.match(/const EVO=(\{[^\n]*\});/)[0];
const ctx = vm.createContext({assert, Date, console});
vm.runInContext(`${mons}\n${evo}\n${migration}\nfunction stamp(){return new Date().toISOString()}`, ctx);
vm.runInContext(`
const excluded=['Tirtouga','Carracosta','Wo-Chien','Chien-Pao'];
assert.equal(MONS.length,168);
assert.equal(new Set(MONS.map(x=>x[0])).size,168);
for(const name of excluded){assert(!MONS.some(m=>m[0]===name));assert(!EVO[name]);}
for(const targets of Object.values(EVO))for(const [target] of targets)assert(MONS.some(m=>m[0]===target));
for(let tier=0;tier<5;tier++)assert(MONS.some(m=>m[2]===tier));
for(const [kind,cost] of Object.entries({standard:20,shiny:50,deluxe:100})){
 const keep={id:'keep',species:'Magearna',nickname:'Gearfriend',shiny:true};
 const old=excluded.map((species,i)=>({id:'old'+i,species,nickname:'Old '+i,shiny:true,size:1.1,mainSeconds:20,mainSince:i===0?new Date(Date.now()-2000).toISOString():null}));
 const data={pokemon:[keep,...old],mainId:'old0',cogs:1.25,tasks:[{title:'Keep task'}],summaries:[{title:'Keep notes'}],pendingSafari:{id:'encounter',kind,balls:[{species:'Snom'},{species:'Tirtouga'},{species:'Magearna'}]}};
 assert.equal(migrateRetiredSpecies(data),true);
 assert.equal(data.pokemon.length,1);assert.equal(data.pokemon[0],keep);
 assert.equal(data.mainId,null);assert.equal(data.retiredPokemon.length,4);
 assert.equal(data.retiredPokemon[0].nickname,'Old 0');assert.equal(data.retiredPokemon[0].shiny,true);
 assert(data.retiredPokemon[0].mainSeconds>=21);assert.equal(data.retiredPokemon[0].mainSince,null);
 assert.equal(data.cogs,Math.round(1.25+cost));assert.equal(data.pendingSafari,null);
 assert.equal(data.retiredSafariEncounters.length,1);assert.equal(data.retiredSafariEncounters[0].refundedCogs,cost);
 assert.equal(data.tasks[0].title,'Keep task');assert.equal(data.summaries[0].title,'Keep notes');
 const snapshot=JSON.stringify(data);assert.equal(migrateRetiredSpecies(data),false);assert.equal(JSON.stringify(data),snapshot);
 const imported=JSON.parse(snapshot);assert.equal(migrateRetiredSpecies(imported),false);assert.equal(JSON.stringify(imported),snapshot);
}
const clean={pokemon:[{id:'m',species:'Magearna'}],mainId:'m',cogs:100,pendingSafari:{kind:'deluxe',balls:[{species:'Snom'},{species:'Mew'},{species:'Magearna'}]}};
const before=JSON.stringify(clean);assert.equal(migrateRetiredSpecies(clean),false);assert.equal(JSON.stringify(clean),before);
`, ctx);
assert(script.includes('function ensureMoveData(){let changed=migrateRetiredSpecies(db);'));
assert(script.includes('db=candidate;\n  migrateRetiredSpecies(db);'));
assert(script.includes('db=payload;migrateRetiredSpecies(db);'));
assert(script.includes('if(pcStorageReady)ensureMoveData();'));
console.log('PASS: full-script syntax, 168-species roster, evolution targets, all rarity tiers, legacy collection archiving, companion handling, all three ticket refunds, repeat/import idempotence, unaffected saves, and migration entry points.');
