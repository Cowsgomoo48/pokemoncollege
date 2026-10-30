const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const ocean=fs.readFileSync(__dirname+'/../tools/oceanic.js','utf8'),dungeon=fs.readFileSync(__dirname+'/../tools/dungeon.js','utf8');
const c=vm.createContext({Math,typeEff:()=>1,moveCat:()=> 'S'});vm.runInContext(ocean,c);vm.runInContext(dungeon.slice(dungeon.indexOf('function dgDamage('),dungeon.indexOf('function dgHit(')),c);
for(const [diff,stat]of [['easy',12],['balanced',15],['hard',17]]){
 const e={ocBoss:true,hp:48,maxhp:125,atk:145,def:145,spa:145,spd:145,spe:145,phase:2,diving:true,daze:0,turns:6,pending:[{kind:'rain',due:7,tiles:[[1,2]]}],x:10,y:11};
 const r={diff,fl:{oc:'arena'},battle:{round:9,enemies:[e]},party:[{hp:18,energy:42}]};const before=JSON.stringify({hp:e.hp,maxhp:e.maxhp,phase:e.phase,diving:e.diving,pending:e.pending,turns:e.turns,round:r.battle.round,party:r.party});
 assert.equal(c.ocBoss(r),e);for(const k of ['atk','def','spa','spd','spe'])assert.equal(e[k],stat);
 assert.equal(JSON.stringify({hp:e.hp,maxhp:e.maxhp,phase:e.phase,diving:e.diving,pending:e.pending,turns:e.turns,round:r.battle.round,party:r.party}),before);
 const once=JSON.stringify(e);c.ocBoss(r);assert.equal(JSON.stringify(e),once,'migration idempotence');
 for(const cat of ['P','S']){
 const att={atk:15,spa:15,types:[]},mv=['Normal',90,50,'charged'];
 const bad=c.dgDamage(att,{def:145,spd:145,types:['water']},mv,1,1,cat).dmg;
 const good=c.dgDamage(att,e,mv,1,1,cat).dmg;assert.equal(bad,1);assert(good>=6&&good<=9,cat+' charged damage '+good);
 console.log(diff,cat,'90-power neutral charged move:',bad,'->',good);
 }
}
assert.equal(c.ocBoss({fl:{oc:'approach'},battle:{enemies:[]}}),false);
assert.equal(c.ocBalanceStats({},null),null);
console.log('PASS: actual physical/special damage formula escapes 1-damage floor; all difficulties; saved HP/phase/turn/telegraph/party preservation; idempotent migration.');
