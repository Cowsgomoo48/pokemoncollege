const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const src=fs.readFileSync(__dirname+'/../tools/rescue.js','utf8');
function setup(results,options={}){const r={floor:options.from||0,bag:{rescue_drill:1},fl:{},battle:{usedItem:true},party:[],digs:[]};let calls=0,flags=0,plans=0;
 const el={remove(){},style:{setProperty(){}},classList:{toggle(){},remove(){}},querySelector(){return {textContent:''}}};
 const c=vm.createContext({console,Math:Object.assign(Object.create(Math),{random:()=>.26}),DG:{bank:[],P:{report(){}}},dgEpoch:1,MD_TOTAL:152,dgTarget:null,__qMiss:null,runOf:()=>r,save(){},toast(){},mdIsLast:r=>r.floor===151,dgPanelBattle(){},mdDigItem:()=>({key:'test'}),askQ:async()=>{calls++;return results.shift()||'fail'},dgSleep:async()=>{},gdDrawBattle(){},mdPlan(){plans++},gdNewFloor(r){r.sub={k:'test'}},mdDig:async()=>{flags++},recapAdd(){}});
 vm.runInContext(src,c);c.mdRescueScene=()=>el;c.mdRescueStatus=()=>{};return {c,r,stats:()=>({calls,flags,plans})}}
(async()=>{
 for(const [answers,n] of [[['full','fail','full'],2],[['fail','makeup','half'],0],[['full','full','full'],3]]){const {c,r,stats}=setup(answers);await c.mdRescueDrill();assert.equal(r.floor,n);assert.equal(r.bag.rescue_drill,0);assert.equal(r.rescueDrill,undefined);assert.equal(stats().calls,3);assert.equal(stats().flags,n?1:0);assert.equal(c.DG.busy,0);assert.equal(r.clearedFloors,undefined)}
 {const {c,r}=setup(['full','full','full'],{from:150});await c.mdRescueDrill();assert.equal(r.floor,151)}
 {const {c,r,stats}=setup(['full','fail']);r.bag.rescue_drill=0;r.rescueDrill={from:0,max:3,done:1,correct:1};await c.mdRescueDrill();assert.equal(stats().calls,2);assert.equal(r.floor,2);assert.equal(r.bag.rescue_drill,0)}
 {const {c,r}=setup([]);r.tower=true;c.Math.random=()=>0;assert.equal(c.mdRescueFind(r),false);assert.equal(r.bag.rescue_drill,1);r.tower=false;assert.equal(c.mdRescueFind(r),true);assert.equal(r.bag.rescue_drill,2);r.rescueDrill={};assert.equal(c.mdRescueFind(r),false)}
 {const {c,r}=setup([]);let finish;c.askQ=()=>new Promise(res=>finish=res);const pending=c.mdRescueDrill();await new Promise(res=>setImmediate(res));c.dgEpoch++;finish('full');await pending;assert.equal(r.floor,0);assert.equal(r.rescueDrill.done,0);assert.equal(r.bag.rescue_drill,0)}
 const h=fs.readFileSync(__dirname+'/../www/index.html','utf8');assert(h.includes(src.trim()));
 console.log('PASS: correct-only depth; fixed attempt count; no-correct outcome; final-floor cap; single consumption; saved resume; stale question guard; Tower exclusion; no skipped-boss rewards; embedded code matches.');
})().catch(e=>{console.error(e);process.exitCode=1});
