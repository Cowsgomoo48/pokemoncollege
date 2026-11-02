const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=__dirname+'/..',html=fs.readFileSync(root+'/www/index.html','utf8'),guided=fs.readFileSync(root+'/tools/guided_study.js','utf8'),dungeon=fs.readFileSync(root+'/tools/dungeon.js','utf8'),study=fs.readFileSync(root+'/tools/studyplus.js','utf8'),math=fs.readFileSync(root+'/tools/mathfmt.js','utf8');
const c=vm.createContext({assert,console,partyMon:x=>x,combatant:()=>({hp:100}),shuffle:a=>a,esc:String,mathHTML:String});
vm.runInContext(math.slice(math.indexOf('function calcFmt('))+'\n'+study.slice(study.indexOf('const SA_SUP='),study.indexOf('// which questions can be typed'))+'\n'+guided,c);
vm.runInContext(`
for(const [hp,mc,typed,long]of [[0,true,0,0],[24,true,0,0],[25,true,0,0],[26,false,.15,.03],[50,false,.15,.03],[51,false,.4,.12],[100,false,.4,.12]]){const p=dgAnswerPolicy({party:[{hp}],battle:{turn:0}});assert.equal(p.mcOnly,mc);assert.equal(p.typedChance,typed);assert.equal(p.diyChance,long)}
assert.equal(dgAnswerPolicy(null).typedChance,.2);
const q={steps:[['Use Newton’s second law.','F = m × a'],['Substitute mass and acceleration.','10 × 3 = 30 N']],short:'30 N'};
const plan=guidedPlan(q);assert.equal(plan.length,2);assert.equal(plan[0].choices.filter(x=>x.ok).length,1);assert.equal(plan[1].choices.filter(x=>x.ok).length,1);assert.equal(plan[1].choices.find(x=>x.ok).t,'10 × 3');
for(const x of plan[1].choices.filter(x=>!x.ok))assert(!saMatch(x.t,'10 × 3'),'No numerically equivalent distractors');
assert.equal(guidedPlan({cmd:true,steps:q.steps}),null);assert.equal(guidedPlan({steps:[]}),null);
`,c);
vm.runInContext('globalThis.DG=null;'+dungeon.slice(dungeon.indexOf('function apNote('),dungeon.indexOf('function apMaybePrompt(')),c);
for(const [name,entry,want] of [
 ['instant wrong after mandatory wait',{ms:11000,protectedMs:10000,chars:300,ok:false},true],
 ['fast mastery',{ms:10100,protectedMs:10000,chars:300,ok:true},false],
 ['deliberate',{ms:20000,protectedMs:10000,chars:300,ok:false},false],
 ['guided',{ms:10100,protectedMs:10000,chars:300,ok:false,guided:true},false],
 ['hint',{ms:10100,protectedMs:10000,chars:300,ok:false,hinted:true},false]]){
 c.DG={};for(let i=0;i<12;i++)c.apNote(entry);assert.equal(!!c.DG.apWant,want,name);assert(c.DG.ap.length<=6);
}
assert(html.includes(guided));assert(html.includes(dungeon));new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
console.log('PASS: HP boundaries, verified setups, equivalent-answer exclusion, fallback, post-lock detection, mastery/hint/guidance suppression, bounded history, bundle parity and app syntax.');
(async()=>{
 let captured,kind,resolveAnswer,callback;const run={party:[{hp:20}],battle:{turn:0,diy:true},tickets:0,cogs:0};
 Object.assign(c,{dgEpoch:1,runOf:()=>run,PR:{},isWeak:()=>false,save:()=>{},toast:()=>{},recapAdd:()=>{},mdRescueFind:()=>{},apMaybePrompt:()=>{},__qMiss:null,
 askQ:(it,bank,opts)=>{kind='mc';captured=opts;callback=opts.onGuided;return new Promise(r=>resolveAnswer=r)},askDIY:()=>{kind='diy';return Promise.resolve('fail')}});
 c.DG={bank:[{kind:'gen',gid:'math'}],P:{next:()=>({kind:'gen',gid:'math'}),report:()=>{}}};
 vm.runInContext(dungeon.slice(dungeon.indexOf('function dgQ('),dungeon.indexOf('// ---------- autopilot check')),c);
 const pending=c.dgQ('FIGHT',{typed:true});assert.equal(kind,'mc');assert.equal(captured.typed,false,'Low HP overrides typed request');assert.equal(run.battle.diy,true,'Low HP postpones forced DIY');callback();callback();resolveAnswer('fail');await pending;
 assert.equal(run.tickets,2,'Setup bonus even when final wrong, only once');assert.equal(run.cogs,2,'Cumulative earned Tickets includes bonus');
 console.log('PASS: actual dispatcher enforces MC-only, postpones DIY and awards one effort bonus after a wrong final answer.');
})().catch(e=>{console.error(e);process.exitCode=1});
// Exercise guided UI handlers without a browser: final answers stay hidden until both steps succeed.
class Panel{
 constructor(){this.isConnected=true;this.feedback={};this.button={};this.buttons=[]}
 set innerHTML(text){this.html=text;this.feedback={};this.button={};this.buttons=[...text.matchAll(/data-i="(\d+)"/g)].map(m=>({dataset:{i:m[1]},disabled:false}))}
 get innerHTML(){return this.html}
 querySelector(s){return s==='.guided-feedback'?this.feedback:this.button}
 querySelectorAll(){return this.buttons}
}
c.document={createElement:()=>new Panel()};let panel,bonus=0;const answers={hidden:false,before:p=>{panel=p}},card={querySelector:()=>answers};
const question={steps:[['Use mass and acceleration.','F = m × a'],['Substitute.','10 × 3 = 30 N']]};
const state=c.guidedMount(card,question,{onGuided:()=>bonus++});assert(!answers.hidden,'guided steps are optional');panel.button.onclick();assert(answers.hidden);panel.buttons[1].onclick();assert(panel.buttons[1].disabled);assert(answers.hidden);panel.button.onclick();assert(panel.feedback.innerHTML);panel.buttons[0].onclick();assert(answers.hidden);panel.buttons[0].onclick();assert(!answers.hidden);assert(state.complete);assert.equal(bonus,1);
console.log('PASS: actual guided UI starts only on Help me start, hides final answers, handles wrong setups and hints, advances both steps, and calls completion once.');
