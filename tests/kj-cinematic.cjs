const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
let run={battle:{enemies:[{species:'Mew'}]}},frames=[],timers=[],removed=0,listeners=new Map(),overlay;
const field={isConnected:true,style:{filter:'sepia(.2)'},querySelectorAll:()=>sprites};
const sprites=[0,1].map(i=>({style:{filter:'original'+i},closest:s=>s==='.dg-ally'?{dataset:{i:String(i)}}:null}));
const g=new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
const c=vm.createContext({console,Math,runOf:()=>run,dgEpoch:1,fxField:()=>field,window:{matchMedia:()=>({matches:false})},performance:{now:()=>0},requestAnimationFrame:fn=>(frames.push(fn),frames.length),cancelAnimationFrame(){},setTimeout:fn=>(timers.push(fn),timers.length),clearTimeout(){},document:{hidden:false,addEventListener:(k,v)=>listeners.set(k,v),removeEventListener:k=>listeners.delete(k),createElement:tag=>({style:{},setAttribute(){},getContext:()=>g,remove(){removed++}})}});
vm.runInContext(fs.readFileSync('tools/kj_ultimate.js','utf8'),c);c.kjSprite=async()=>null;
function mount(){return overlay={classList:{add(){}},replaceChildren(canvas,skip){this.canvas=canvas;this.skip=skip}}}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
(async()=>{let promise=c.kjCinematic({species:'Bisharp'},0,0,mount());await tick();assert.equal(field.style.filter,'grayscale(1) contrast(1.4)');assert.equal(sprites[0].style.filter,'brightness(0) invert(1)');overlay.skip.onclick();await promise;assert.equal(field.style.filter,'sepia(.2)');assert.equal(sprites[1].style.filter,'original1');assert.equal(listeners.size,0);assert.equal(removed,2);
frames=[];promise=c.kjCinematic({},0,0,mount());await tick();c.dgEpoch++;frames[0]();await promise;assert.equal(field.style.filter,'sepia(.2)');assert.equal(listeners.size,0);
frames=[];promise=c.kjCinematic({},0,0,mount());await tick();c.document.hidden=true;listeners.get('visibilitychange')();await promise;assert.equal(sprites[0].style.filter,'original0');
console.log('PASS: skip, run interruption, app backgrounding, filter restoration, overlay and listener cleanup');})().catch(e=>{console.error(e);process.exitCode=1});
