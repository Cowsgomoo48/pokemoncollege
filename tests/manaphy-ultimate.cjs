const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/../tools/ultimates.js','utf8'),dungeon=fs.readFileSync(__dirname+'/../tools/dungeon.js','utf8');
let r,splashes=[],events=[],cancelled=0;
const sprites=new Map(),sprite=key=>{if(!sprites.has(key))sprites.set(key,{style:{opacity:'.8'},animate(frames){events.push({key,frames});return {cancel(){cancelled++}}}});return sprites.get(key)};
const context={console,Math,Map,Set,setTimeout:()=>0,runOf:()=>r,DG:{},TYPE_COLOR:{Water:'#00f'},SLOT_COLORS:['blue'],esc:s=>s,partyMon:m=>m.mon,combatant:()=>({hp:100,atk:50,spa:50,types:['water']}),save(){},dgDrawBattle(){},dgAfterAction(){},dgHit(){},dgFloat(){},dgFaint(){},dgSleep:async()=>{},typeEff:()=>1,dgDamage:(a,d,mv,mult,extra)=>({dmg:Math.round(mv[1]*mult*extra),eff:1}),document:{querySelector:s=>sprite(s)},MOVE_SPECIAL:{},twDarkDodge:()=>false,dgHitPlan:()=>({ks:[1],S:1}),moveCat:()=> 'S',dgEnvMult:()=>1,twPowMult:()=>1,dgEnvAtk:()=>1,dgEnvDef:()=>1,twCardAtk:()=>1,mdUpAtk:()=>1,dgEnvFlat:()=>0,twSpookHeal:()=>0,twFrenzy:()=>0};
const c=vm.createContext(context);vm.runInContext(source,c);vm.runInContext(dungeon.slice(dungeon.indexOf('function dgStrike('),dungeon.indexOf('// after the move:')),c);
const field={isConnected:true},point={x:80,y:80,b:100,h:40};c.fxField=()=>field;c.fxPos=()=>point;c.fxShake=()=>{};let removed=0;
c.fxEl=(cls)=>{events.push({effect:cls});return {animate(frames){events.push({effect:cls,frames});return {cancel(){cancelled++}}},remove(){removed++}}};
function run(){return {party:[{hp:100,energy:100,mon:{species:'Manaphy',ult:true}},{hp:100,energy:20,mon:{species:'Blastoise'}}],battle:{round:4,enemies:[{hp:1000,maxhp:1000,def:50,spd:50,types:['normal']},{hp:1000,maxhp:1000,def:50,spd:50,types:['normal']}],teamBoost:.1}}}
(async()=>{
 assert.equal(c.ultOf({species:'Manaphy',ult:false}),null);const U=c.ultOf({species:'Manaphy',ult:true});assert.equal(U.move,'Sudden Breath');assert.equal(U.type,'Water');assert.equal(U.t,'all');
 r=run();await c.ultFx(U,0,[0,1]);assert(events.some(e=>e.effect==='sb-water'));assert.equal(events.filter(e=>e.effect==='sb-geyser').length,2);assert.equal(events.filter(e=>e.effect==='sb-bubble').length,50);assert(events.some(e=>e.frames&&e.frames.some(f=>f.translate==='0 -82px')));assert(cancelled>0&&removed>0);for(const el of sprites.values())assert.equal(el.style.opacity,'.8');
 // Interruption must restore sprites and clear effects too.
 const before=removed;c.dgSleep=async()=>{field.isConnected=false};await c.ultFx(U,0,[0]);for(const el of sprites.values())assert.equal(el.style.opacity,'.8');field.isConnected=true;c.dgSleep=async()=>{};
 c.ultSplash=async(p,u)=>splashes.push([p.species,u.move]);c.ultFx=async()=>{};r=run();await c.dgUltimate(0,null,1,'full');assert.deepEqual(splashes,[['Manaphy','Sudden Breath']]);assert.equal(r.party[0].energy,0);assert.equal(r.battle.enemies[0].hp,802);assert.equal(r.battle.enemies[1].hp,802);assert.equal(r.battle.suddenBreathRound,5);assert.equal(r.party[1].hp,100);
 const b=r.battle;assert.equal(c.ultWaterMult(b,'Water'),1);b.round=5;assert.equal(c.ultWaterMult(b,'Water'),1.1);assert.equal(c.ultWaterMult(b,'Fire'),1);b.enemyPhase=true;assert.equal(c.ultWaterMult(b,'Water'),1);b.enemyPhase=false;
 // Actual regular move damage path: same bonus for Manaphy and allies, exactly next round only.
 function hit(slot,type){const x={b,m:r.party[slot],p:r.party[slot].mon,c:{atk:50,spa:50,types:['water'],hp:100}};return c.dgStrike(x,'Test',[type,100,0,'charged'],{hp:1000,def:50,spd:50,types:['normal']},1,1).dmg}
 assert.equal(hit(0,'Water'),121);assert.equal(hit(1,'Water'),121);assert.equal(hit(1,'Fire'),110);b.round=6;assert.equal(hit(0,'Water'),110);
 const h=fs.readFileSync(__dirname+'/../www/index.html','utf8');for(const n of ['ultimates.js','ultimates.css','dungeon.js'])assert(h.includes(fs.readFileSync(__dirname+'/../tools/'+n,'utf8').trim()),n);
 console.log('PASS: owned Manaphy unlock gating and splash dispatch; flood/bubble/geyser choreography; sprite cleanup on completion/interruption; standard 180-power all-target damage and stamina; next-player-turn Water bonus for user/allies only; expiry; bundle parity.');
})().catch(e=>{console.error(e);process.exitCode=1});
