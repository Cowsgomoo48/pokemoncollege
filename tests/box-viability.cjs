const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=__dirname+'/..',html=fs.readFileSync(root+'/www/index.html','utf8'),script=html.match(/<script>([\s\S]*?)<\/script>/)[1],scorer=fs.readFileSync(root+'/tools/box_sort.js','utf8');
new vm.Script(script);assert(script.includes(scorer),'Bundled scorer parity');
const line=name=>script.split('\n').find(l=>l.startsWith(name));
const defs=['SPECIES_DATA','MOVE_MULTI','MOVE_DRAIN','NATURES','TYPE_CHART','MOVE_CAT','MOVE_SPREAD'].map(n=>line('const '+n+'=')).join('\n');
const funcs=['multiAvg','monGrowth','monNature','seededRand','typeEff'].map(n=>line('function '+n+'(')).join('\n');
const ctx=vm.createContext({assert,console});
const dg=fs.readFileSync(root+'/tools/dgrid.js','utf8'),ult=fs.readFileSync(root+'/tools/ultimates.js','utf8');
vm.runInContext(defs+'\n'+script.match(/const MOVE_STATS=([\s\S]*?);/)[0]+'\n'+funcs+'\n'+script.split('\n').filter(l=>l.startsWith('Object.assign(MOVE_STATS,')).join('\n')+'\n'+ult.slice(ult.indexOf('const ULTS='),ult.indexOf('function ultType('))+'\n'+fs.readFileSync(root+'/tools/legend_ultimates.js','utf8').split('// ----')[0].split('// Box:')[0],ctx);
vm.runInContext(`
function monLv(p){return p.lv||1}
${script.slice(script.indexOf('function monStats('),script.indexOf('function hexSVG('))}
${script.slice(script.indexOf('const MOVE_CAT_ARR='),script.indexOf('// difficulty: Pokémon'))}
${dg.slice(dg.indexOf('function gdShape('),dg.indexOf('// options ='))}
${scorer}
const p={id:'test',species:'Gardevoir',growth:[7,7,7,7,7,7],fastMove:'Tackle',discMove:'Test Hit',lv:1};
MOVE_STATS['Test Hit']=['Normal',90,50,'charged'];MOVE_STATS['Test Hit'].cat='P';
const a=boxViabilityScorer()(p).moves;MOVE_STATS['Test Hit'].cat='S';assert(boxViabilityScorer()(p).moves>a,'Category synergy');
const pot=boxViabilityScorer(),ready=boxViabilityScorer('battleReady'),pt=pot(p).total,rd=ready(p).total;
p.lv=100;assert.equal(pot(p).total,pt);assert(ready(p).total>rd);assert.equal(pot(p).total,ready(p).total,'Potential equals current viability at max level');
const before=JSON.stringify(p);pot(p);ready(p);assert.equal(JSON.stringify(p),before);
assert(pot({...p,growth:[14,14,14,14,14,14]}).total>pot({...p,growth:[1,1,1,1,1,1]}).total);
assert(pot({...p,species:'Regirock',ult:true}).ultimate>pot({...p,species:'Regirock',ult:false}).ultimate);
for(const species of Object.keys(SPECIES_DATA))for(const mode of ['viability','battleReady']){const s=boxViabilityScorer(mode)({...p,species,ult:true});assert.equal(pot({...p,species,ult:true}).total,ready({...p,species,ult:true}).total,'Max-level parity: '+species);assert(Number.isFinite(s.total)&&s.total>=0&&s.total<=100,species);assert.equal(s.total,s.stats+s.moves+s.typing+s.coverage+s.ultimate)}
MOVE_STATS['Test Hit'].cat='S';MOVE_STATS['Test Hit'][0]='Normal';const plain=pot(p).moves;MOVE_STATS['Test Hit'][0]='Psychic';assert(pot(p).moves>plain,'Same-type bonus');
MOVE_STATS['Test Beam']=['Psychic',90,50,'charged'];MOVE_STATS['Test Beam'].cat='S';assert(pot({...p,discMove:'Test Beam'}).moves>pot(p).moves,'Piercing range utility');
MOVE_STATS['Test Water']=['Water',90,50,'charged'];MOVE_STATS['Test Water'].cat='S';assert(pot({...p,fastMove:'Test Water'}).coverage>pot({...p,fastMove:'Test Hit'}).coverage,'Complementary coverage');
let selectedMode='viability';globalThis.$=()=>({value:selectedMode});globalThis.esc=x=>String(x).replaceAll('&','&amp;').replaceAll('<','&lt;');
assert(boxViabilityHTML(p).includes('Potential'));selectedMode='battleReady';assert(boxViabilityHTML(p).includes('Viability'));selectedMode='newest';assert.equal(boxViabilityHTML(p),'');
const missing=pot({...p,discMove:'Missing',fastMove:'Missing'});assert.equal(missing.moves,0);assert.equal(missing.coverage,0);
console.log('PASS: score bounds for entire roster, category synergy, level independence/current readiness, growth, Ultimates, missing moves, non-mutating evaluation, bundle parity and app syntax.');
`,ctx);
