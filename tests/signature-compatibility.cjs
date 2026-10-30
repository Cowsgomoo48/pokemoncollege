const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/../www/index.html','utf8'),src=fs.readFileSync(__dirname+'/../tools/learnsets.js','utf8');
const base=src.replace(/\n\/\/ Expanded signature TM compatibility[\s\S]*?(?=function canLearn\()/,'\n');
const moveSetup=html.slice(html.indexOf('const MOVE_STATS='),html.indexOf('function choice(xs)'));
function load(s){const c=vm.createContext({});vm.runInContext(moveSetup+s+';globalThis.raw=LEARN_RAW;globalThis.extra=typeof SIGNATURE_EXTRA===\'undefined\'?{}:SIGNATURE_EXTRA;globalThis.moves=Object.keys(MOVE_STATS);',c);return c}

const old=load(base),now=load(src);let grants=0;
for(const n of Object.keys(old.raw))for(const move of old.moves){if(old.canLearn(n,move))assert(now.canLearn(n,move),'Removed '+n+' / '+move);if(!old.canLearn(n,move)&&now.canLearn(n,move))grants++}
for(const [n,m]of [['Blastoise','Shell Trap'],['Magcargo','Shell Trap'],['Poliwag','Sparkling Aria'],['Gyarados','Mountain Gale'],['Skarmory','Flying Press'],['Chi-Yu','Combat Torque'],['Yanmega','Beak Blast'],['Regirock','Stone Axe'],['Pawniard','Stone Axe']])assert(now.canLearn(n,m),n+' / '+m);
for(const [n,m]of [['Slugma','Shell Trap'],['Tyranitar','Combat Torque'],['Pawniard','Combat Torque'],['Kingambit','Combat Torque'],['Gyarados','Flying Press'],['Scyther','Mountain Gale'],['Wooper','Beak Blast']])assert(!now.extra[m].includes(n),n+' unexpectedly granted '+m);
const data=JSON.parse(html.match(/const SPECIES_DATA=(\{[^\n]+\});/)[1]);
assert.deepEqual(Array.from(now.extra['Combat Torque']),Object.keys(data).filter(n=>data[n].types.includes('dark')&&data[n].stats[5]/10>=9));
assert.deepEqual(Array.from(now.extra['Beak Blast']),Object.keys(data).filter(n=>data[n].types.includes('flying')));
for(const [move,names]of Object.entries(now.extra)){assert(now.moves.includes(move),move);assert.equal(new Set(names).size,names.length);for(const n of names)assert(data[n],n)}
assert(now.canLearn('Mew','Stone Axe'));assert(!now.canLearn('Mew','Not a move'));
assert(html.includes(src.trim()),'Embedded learnsets must match');
console.log('PASS: '+grants+' new TM permissions; original learners retained; explicit positive and negative rules; app Speed cutoff; Flying roster coverage; Mew behavior; bundled source synchronized.');
