const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=__dirname+'/..',source=fs.readFileSync(root+'/tools/tap_protection.js','utf8'),html=fs.readFileSync(root+'/www/index.html','utf8');
let now=0,id=0;const timers=new Map();
function node(){const classes=new Set();return {disabled:false,isConnected:true,attrs:{},classList:{add:x=>classes.add(x),remove:(...xs)=>xs.forEach(x=>classes.delete(x)),toggle:(x,v)=>v?classes.add(x):classes.delete(x),contains:x=>classes.has(x)},setAttribute(k,v){this.attrs[k]=v},removeAttribute(k){delete this.attrs[k]},remove(){this.isConnected=false}}}
const ctx=vm.createContext({Date:{now:()=>now},document:{createElement:()=>node()},setInterval:f=>{timers.set(++id,f);return id},clearInterval:id=>timers.delete(id)});vm.runInContext(source,ctx);
const advance=ms=>{now+=ms;for(const f of [...timers.values()])f()};
function card(){const c=node(),buttons=[node(),node()],head={insertAdjacentElement:(where,status)=>c.status=status};c.querySelectorAll=()=>buttons;c.querySelector=()=>head;c.buttons=buttons;return c}
const prompt=Array(20).fill('word').join(' '),timing=ctx.tapProtectionTiming(prompt);assert.equal(timing.words,20);assert.equal(timing.skim,800);assert(Math.abs(timing.read-6666.6666667)<.001);assert(Math.abs(timing.total-7466.6666667)<.001);
assert.equal(ctx.tapProtectionTiming('   ').total,0);assert.equal(ctx.tapProtectionTiming('<b>How many</b>\n apples?').words,3);assert.equal(ctx.tapProtectionTiming('2 + 2 = ?').words,2);
const c=card(),api=ctx.tapProtectionStart(c,prompt,'.answer');assert(!api.allowed());assert(c.classList.contains('tp-skim'));assert(c.buttons.every(b=>b.disabled&&b.classList.contains('tp-locked')));
advance(799);assert(!api.allowed());advance(1);assert(c.classList.contains('tp-read'));assert(!c.classList.contains('tp-skim'));assert(c.status.textContent.includes('6.7s'));advance(timing.read-1);assert(!api.allowed());advance(2);assert(api.allowed());assert(c.buttons.every(b=>!b.disabled&&!b.classList.contains('tp-locked')));assert.equal(timers.size,0);
const old=ctx.tapProtectionStart(c,'one two','.answer'),fresh=ctx.tapProtectionStart(c,'three four five','.answer');assert(!old.allowed());assert(!fresh.allowed());assert.equal(timers.size,1);c.isConnected=false;advance(100);assert.equal(timers.size,0);assert(!fresh.allowed());
const b=card();b.buttons[1].disabled=true;const bp=ctx.tapProtectionStart(b,'one','.answer');advance(10000);assert(bp.allowed());assert(!b.buttons[0].disabled);assert(b.buttons[1].disabled);bp.stop();assert(!bp.allowed());
const bg=card(),guard=ctx.tapProtectionStart(bg,'one','.answer');now+=400;assert(guard.allowed());guard.stop();
const empty=ctx.tapProtectionStart(card(),'','.answer');assert(empty.allowed());assert.equal(timers.size,0);empty.stop();
for(const name of ['tap_protection.js','minigames.js','studyplus.js','dgrid.js','dungeon.js'])assert(html.includes(fs.readFileSync(root+'/tools/'+name,'utf8')),name+' bundle parity');
assert(html.includes('if(submitted||!protection.allowed())return;'));assert(html.includes('const answerStart=t0+protection.duration'));assert(html.includes("!$('quizArea')._tapProtection?.allowed()"));
new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
console.log('PASS: two-stage timing, red/blue/ready states, disabled controls, cleanup, question replacement, background deadlines, empty prompts, bundle parity, guards, Speed Round allowance and app syntax.');
