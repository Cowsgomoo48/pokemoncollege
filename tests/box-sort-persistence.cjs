const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/../www/index.html','utf8'),tools=fs.readFileSync(__dirname+'/../tools/box_sort.js','utf8');
const helpers=tools.slice(tools.indexOf('function boxSortValue('));
const storage=new Map();
const saveBridge=html.slice(html.indexOf('function persistNow('),html.indexOf('let pcIDB='));
function session(data){
 const select={value:'newest'},ctx=vm.createContext({db:data,boxPageNum:4,pcStorageReady:true,STORAGE_MAIN:'main',STORAGE_RECOVERY:'recovery',localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},mirrorToIndexedDB:()=>{},goodSave:p=>p?.schema===1,parseSaved:raw=>JSON.parse(raw),$:()=>select,drawCollection:()=>{},assert});
 vm.runInContext(saveBridge+'\nfunction save(){persistNow()}\n'+helpers,ctx);return {ctx,select};
}
for(const value of ['newest','species','rarity','size','shiny','friendship','viability','battleReady']){
 const {ctx,select}=session({schema:1,pokemon:[{id:'keep'}]});ctx.changeBoxSort(value);
 assert.equal(ctx.boxPageNum,0);assert.equal(JSON.parse(storage.get('main')).boxSort,value);
 select.value='newest';assert.equal(ctx.restoreBoxSort(),value);assert.equal(select.value,value,'Menu re-entry');
 const restarted=session(JSON.parse(storage.get('main')));assert.equal(restarted.ctx.restoreBoxSort(),value);assert.equal(restarted.select.value,value,'App restart');
 assert.equal(restarted.ctx.db.pokemon[0].id,'keep');
}
for(const value of [undefined,null,'bogus','Potential','Stats',{},42]){
 const {ctx,select}=session({schema:1,boxSort:value});assert.equal(ctx.restoreBoxSort(),'newest');assert.equal(select.value,'newest');
}
assert(html.includes('onchange="changeBoxSort(this.value)"'));assert(html.includes('const sort=restoreBoxSort();'));assert(html.includes(tools));
console.log('PASS: all eight sorts persisted through real save bridge; menu reset, restart, pagination, legacy/invalid fallback, existing progress preservation and bundled UI wiring.');
