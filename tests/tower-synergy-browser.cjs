const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});const p=await b.newPage({viewport:{width:390,height:844}});await p.emulateMedia({reducedMotion:'reduce'});const errs=[];p.on('pageerror',e=>errs.push(e.message));if(process.env.V)p.on('console',m=>console.log('>',m.text()));
await p.goto('http://127.0.0.1:8767/index.html');await p.waitForTimeout(1500);
const R=await p.evaluate(async()=>{const out=[],ok=(c,m)=>{if(window.__inv){const D=r_().dc,all=[...D.draw,...D.hand,...D.disc,...D.void,...D.field.map(x=>x.u)];const want=[...r_().deck.map(c=>c.u),...D.temp.map(c=>c.u)];const miss=want.filter(u=>!all.includes(u));if(miss.length&&!window.__rep){window.__rep=1;console.log('LOST after: '+m+' '+miss.map(u=>(dcInst(r_(),u)||{}).d))}}out.push((c?'PASS ':'FAIL ')+m);console.log((c?'PASS ':'FAIL ')+m)},W=ms=>new Promise(r=>setTimeout(r,ms));window.dgQ=async()=>'full';const r_=()=>db.tower;
 const ids=[];for(const s of ['Magearna','Magnezone','Tyranitar']){giveMon({...rollMon(false),species:s,tier:INDEX[s].tier});ids.push(db.pokemon.at(-1).id)}
 const cmb=combatant;window.combatant=p=>Object.assign({},cmb(p),{hp:60});
 db.tower={tower:true,sids:[],mode:'smart',party:ids.map(id=>({id,hp:60,energy:20})),floor:0,cleared:0,bag:{},tickets:0,cogs:0,studyMs:0,envs:Object.keys(TW_ENVS),cards:{},perkDone:[],bosses:0,challengesWon:0};const r=db.tower;dcInitRun(r);dgMode='tower';go('minigames');dgOpen('tower');await W(300);r.floor=6;twBattle(null);await W(50);
 const dc=()=>r.dc,F=i=>dc().foes[i];window.__inv=1;
 dcDmgCap=()=>0;const reset=()=>{const D=dc();D.foes=[0,1,2].map(i=>({species:'Zubat',lv:5,maxhp:200,hp:200,atk:10,blk:0,st:{burn:0,poison:0,chill:0,weak:0,str:0,vuln:0,enf:0,toxin:0},it:{k:'block',n:1},last:null,hpDealt:false}));D.pb=0;D.pkeep=0;D.pburn=0;r.php=r.pmax;D.buffs={};D.once={};D.hitsOn={};D.ok=0;D.atkOk=0;D.blk=0;D.ap=20;D.costDown=0;D.pst={weak:0,vuln:0,str:0,enf:0,toxin:0};D.instT=0;D.frost=0;D.frostHit={};D.ffLose=0;D.tookLast=0;D.isekai=[];D.angel.forEach(u=>D.disc.push(u));D.angel=[];D.charge=0;D.seeds=[];D.ward=0;D.dodge=0;D.field.forEach(x=>D.disc.push(x.u));D.field=[];const T=new Set(D.temp.map(c=>c.u));['draw','hand','disc','void'].forEach(z=>D[z]=D[z].filter(u=>!T.has(u)));D.temp=[];D.barr=[];D.noBlk=0;D.post=null;D.postQ=[];D.koT=0;D.discT=0;D.hw=null;D.fly=0;D.flyT=0;D.cons.forEach(k=>D.disc.push(k.u,...k.parts));D.cons=[];D.cocoons.forEach(k=>{D.disc.push(k.u);if(k.held)D.disc.push(k.held)});D.cocoons=[];D.vault=0;D.wwall=0;D.fossil=0;D.hoard=0;D.wish=0;D.wishLost=0;D.slip=0;D.slipDrop=0;D.geode=0;D.geodeHit=0;D.tscreen=0;D.fproof=0;D.cdU={};D.awaken=0;D.fsight=[];D.burrow.forEach(u=>{});D.burrow=[];D.endNow=0;D.big3=0;D.plays=0;D.retainU=[];D.ribbon=[];D.retained=[];D.scales=null;D.bmDraw=0;D.rehearse=[];D.morbidU=[];D.exileU=[];D.hand=D.hand.filter(u=>{const i=dcInst(r,u);if(i&&dcDefOf(i.d).haste){D.disc.push(u);return false}return true})};
 const add=(d,t,zone)=>{const c={u:uid(),d,t:t||DC_SIG[d]&&DC_SIG[d].type||'normal'};r.deck.push(c);dc()[zone||'hand'].push(c.u);return c};
 const play=async(d,target,side,t)=>{const c=add(d,t);dcSel=c.u;await dcGo(target,side);await W(10);return c};
 const E=(b,t,k)=>Math.floor(b*dcMult(r,t,k||'dmg')+1e-9);
 let ok0=true;
 const clrV=()=>{dc().disc.push(...dc().void);dc().void=[]};const ET=async(w)=>{await dcEndTurn();await W(w||200)};const AL=()=>dc().foes.filter(f=>f.hp>0);
 window.dcScryUI=(r,cards)=>Promise.resolve({top:[],bottom:cards.slice()});
 // tokens
 reset();dcAddToken(r,'wisp',2);const tk=dc().hand.filter(u=>dcIsToken(r,u));ok(tk.length===2&&!r.deck.some(c=>tk.includes(c.u)),'Tokens go to hand, never into the deck');
 dcSel=tk[0];await dcGo(0,'f');await W(10);ok(dc().void.includes(tk[0])&&F(0).hp===200-E(3,'ghost'),'Wisp: 3 damage, then into the Void');
 for(let k=0;k<30;k++)ok0=dcRollOffer(r).every(o=>!DC_SIG[o.d]||(!DC_SIG[o.d].token&&!DC_SIG[o.d].retired));ok(ok0,'Rewards never offer tokens or retired cards');
 // Threshold
 reset();await play('hollowchoir',0);ok(F(0).hp<200&&F(1).hp===200,'Hollow Choir below Threshold: one enemy');
 reset();for(let k=0;k<6;k++)dc().void.push(add('strike','steel','hand').u),dc().hand.pop();await play('hollowchoir',0);ok(F(0).hp<200&&F(1).hp<200&&F(2).hp<200,'Hollow Choir Threshold 6: all enemies');
 reset();await play('massgrave');ok(dc().hand.filter(u=>dcIsToken(r,u)).length===2,'Mass Grave: 2 Wisps');
 reset();for(let k=0;k<8;k++)dc().void.push(add('strike','steel').u),dc().hand.pop();await play('massgrave');ok(dc().hand.filter(u=>dcIsToken(r,u)).length===4,'Mass Grave Threshold 8: 4 Wisps');
 reset();for(let k=0;k<10;k++)dc().void.push(add('strike','steel').u),dc().hand.pop();const ap0=dc().ap;await play('soulharvest',null,'p');ok(dc().pb>=E(20,'ghost','blk')&&dc().ap===ap0-1+1,'Soul Harvest: 2 Block per Void card, Threshold 10 gives 1 AP');
 reset();clrV();await play('echoofthelost');ok(dc().hand.some(u=>dcIsToken(r,u)),'Echo of the Lost: Wisp below Threshold');
 reset();const back=add('heavyblow','dark');dc().hand=dc().hand.filter(u=>u!==back.u);dc().void.push(back.u);for(let k=0;k<3;k++){const w=dcAddToken(r,'wisp',1)[0];dc().hand=dc().hand.filter(u=>u!==w);dc().void.push(w)}await play('echoofthelost');const ret=dc().hand.find(u=>!dcIsToken(r,u)&&dc().exileU.includes(u));ok(!!ret&&dcCost(r,dcInst(r,ret))===0,'Echo of the Lost Threshold 4: a Void card returns, costs 0, Exiles after play');
 // Void Pact + Kindle the Dead
 reset();dc().buffs.voidpact=1;dc().buffs.kindlethedead=1;for(let k=0;k<5;k++)add('strike','steel','draw');const h0=dc().hand.length;const w1=dcAddToken(r,'wisp',2);dcSel=w1[0];await dcGo(0,'f');await dcPost();await W(20);dcSel=w1[1];await dcGo(0,'f');await dcPost();await W(20);ok(dc().hand.length===h0+1,'Void Pact: draws once per turn');ok(dc().foes.reduce((a,f)=>a+f.st.burn,0)===2,'Kindle the Dead: each Exile burns a random enemy');
 // Wisp Lantern / Noxious Cloud / Wildfire at turn start
 reset();dc().buffs.wisplantern=1;dc().buffs.noxiouscloud=1;dc().buffs.wildfire=1;F(0).st.burn=3;F(1).st.burn=3;dc().foes.forEach(f=>f.it={k:'block',n:1});await ET();ok(dc().hand.filter(u=>dcInst(r,u).d==='wisp').length===1,'Wisp Lantern: a Wisp at turn start');ok(dc().hand.filter(u=>dcInst(r,u).d==='ember').length===2,'Wildfire: an Ember per Burned enemy, up to 2');ok(F(2).st.poison===2,'Noxious Cloud: 2 Poison to all enemies');
 ok(!dc().disc.some(u=>dcIsToken(r,u)),'Tokens never land in the discard pile');
 // discard engine
 reset();dc().buffs.tidepool=1;dc().buffs.toxicspikes=1;const d1=add('strike','steel'),d2=add('guard','steel');dcDiscardU(r,d1.u);dc().hand=dc().hand.filter(u=>u!==d1.u);dcDiscardU(r,d2.u);dc().hand=dc().hand.filter(u=>u!==d2.u);ok(dc().hand.filter(u=>dcInst(r,u).d==='ripple').length===1,'Tidepool: one Ripple per turn');ok(dc().foes.reduce((a,f)=>a+f.st.poison,0)===2,'Toxic Spikes: 1 Poison per discard');
 await play('washout',0);ok(F(0).hp===200-E(8,'water'),'Wash Out: 4 per card discarded this turn');
 // scry engine
 reset();for(let k=0;k<6;k++)add('strike','steel','draw');dc().buffs.deepinsight=1;const hs=dc().hand.length;await play('foresee',0);await dcPost();await W(30);ok(F(0).hp===200-E(6,'psychic'),'Foresee: 2 damage per card moved to the bottom');ok(dc().hand.length===hs+1,'Deep Insight: draw 1 after Scrying to the bottom');
 // poison / burn payoffs
 reset();F(0).st.poison=5;await play('festeringwound',0);ok(F(0).st.poison===10&&dc().void.length>=1,'Festering Wound doubles Poison, then Exiles');
 reset();F(0).st.poison=1;await play('plaguebearer',0);ok(F(0).st.poison===4,'Plague Bearer: +1 Poison per hit on a Poisoned enemy');
 reset();clrV();await play('fantheflames');ok(dc().hand.filter(u=>dcInst(r,u).d==='ember').length===2,'Fan the Flames: 2 Embers');
 reset();F(0).st.burn=4;F(1).st.burn=2;await play('heatwave');ok(F(0).hp===200-E(4,'fire')&&F(1).hp===200-E(2,'fire')&&F(2).hp===200&&F(0).st.burn===4,'Heat Wave: damage equal to Burn, Burn stays');
 // reworks
 reset();for(let k=0;k<4;k++)add('strike','steel','draw');dc().drawnT=7;const apm=dc().ap;await play('moonlight');ok(dc().ap===apm+1,'Moonlight: 8th card drawn gives 1 AP');
 reset();await play('static',0);ok(dc().charge===1,'Static: Charge 1');
 reset();dc().tookLast=1;for(let k=0;k<3;k++)add('strike','steel','draw');const hh=dc().hand.length;await play('helpinghand',null,'p');ok(dc().hand.length===hh+1,'Helping Hand: draws when the party lost HP last turn');
 ok(!!DC_SIG.bounty.plant&&!DC_SIG.bounty.run,'Bounty is now a Plant card');

 // ===== engine pack 2 =====
 const blk3=()=>dc().foes.forEach(f=>f.it={k:'block',n:1});
 reset();dc().buffs.capacitor=1;dc().buffs.deepfreeze=1;dc().buffs.thermal=1;dc().buffs.overgrowth=1;blk3();await ET();ok(dc().charge===1,'Capacitor: Charge 1 each turn');ok(F(0).st.chill>=1,'Deep Freeze: Chill 1 to all');ok(dc().fly===1,'Thermal: +1 Fly each turn');
 reset();dc().charge=3;await play('discharge',0);ok(dc().charge===0&&F(0).hp===200-E(16,'electric'),'Discharge: spends all Charge, 4 + 4 each');
 reset();dc().charge=2;await play('lightningrod',null,'p');ok(dc().pb===E(9,'electric','blk')&&dc().charge===3,'Lightning Rod: Block scales with Charge, then Charge 1');
 reset();dc().charge=5;await play('chainlightning');ok(dc().charge===3&&F(2).hp===200-3*E(4,'electric'),'Chain Lightning: repeats once per Charge spent (max 2)');
 reset();await play('guardiancharm',null,'p');ok(dc().ward===1,'Guardian Charm: 1 Ward');
 reset();dc().ward=2;await play('wardburst',0);ok(dc().ward===0&&F(0).hp===200-E(18,'fairy'),'Ward Burst: 6 + 6 per Ward');
 reset();dc().buffs.moonblessing=1;const pw=add('patientwish','fairy');blk3();await ET();ok(dc().hand.includes(pw.u)&&dc().pb>=3,'Moonblessing: 3 Block per Retained card');const pb0=dc().pb;dcSel=pw.u;await dcGo(null,'p');await W(10);ok(dc().pb-pb0===E(7,'fairy','blk'),'Patient Wish: +3 Block per turn Retained');
 reset();F(0).st.chill=4;await play('shatter',0);ok(F(0).st.chill===0&&F(0).hp===200-E(12,'ice'),'Shatter: 3 per Chill removed');
 reset();F(0).st.chill=1;await play('frostbite',0);ok(F(0).hp===200-E(10,'ice')&&F(0).st.vuln===1,'Frostbite: 10 + Vulnerable on a Chilled enemy');
 reset();F(0).st.chill=2;F(1).st.chill=3;await play('glacierwall',null,'p');ok(dc().pb>=E(5,'ice','blk')+5-1,'Glacier Wall: +1 per Chill on enemies');
 reset();dc().cons.push({u:add('watchtower','steel','disc').u,parts:[add('strike','steel','disc').u,add('guard','steel','disc').u],n:0});dc().disc=dc().disc.filter(u=>!dc().cons[0].parts.includes(u)&&u!==dc().cons[0].u);await play('pistonpunch',0);ok(F(0).hp===200-E(11,'steel'),'Piston Punch: +3 per attached card');
 dc().buffs.foreman=1;blk3();await ET();ok(dc().pb>=4,'Foreman: 4 Block per active Construct');
 reset();dc().flyT=0;await play('aerialace',0);const a1=200-F(0).hp;dc().flyT=1;await play('aerialace',1);ok(a1===E(6,'flying')&&200-F(1).hp===E(10,'flying'),'Aerial Ace: 10 after gaining Fly this turn');
 reset();dc().fly=2;await play('skycover',null,'p');ok(dc().fly===2&&dc().pb===E(10,'flying','blk'),'Sky Cover: +3 Block per Fly, Fly kept');
 reset();dc().fly=2;await play('featherstorm');ok(dc().fly===0&&dc().foes.reduce((a,f)=>a+200-f.hp,0)===3*E(3,'flying'),'Feather Storm: one hit + one per Fly spent');
 reset();await play('furyswipes',0);ok(F(0).hp===200-5*E(2,'normal'),'Fury Swipes: 2 × 5');
 reset();dc().buffs.momentum=1;const apM=dc().ap;await play('furyswipes',0);await play('rapidjab',0);ok(dc().ap===apM-1-0+1,'Momentum: 6th hit this turn gives 1 AP');
 reset();await play('dragondance');ok(dc().pst.str===1,'Dragon Dance: 1 Strength');reset();dc().big3=1;await play('dragondance');ok(dc().pst.str===3,'Dragon Dance: 3 after a 3+ cost card');
 reset();dc().big3n=2;const dr=add('dragonrage','dragon');ok(dcCost(r,dr)===1,'Dragon Rage: 1 less per 3+ cost card this turn');
 reset();dc().apLeft=1;await play('scaleshot');ok(dc().foes.reduce((a,f)=>a+200-f.hp,0)===5*E(4,'dragon'),'Scale Shot: 5 hits after unspent AP');
 reset();dc().disc.push(...dc().hand);dc().hand=[];add('strike','steel');add('guard','dark');add('emergencyguard','fairy');for(let k=0;k<4;k++)add('strike','steel','draw');await play('versatile');ok(dc().hand.length===6,'Versatile: draws 1 per type in hand');
 reset();dc().buffs.teamwork=1;dc().lastTy=null;await play('strike',0,'f','steel');await play('strike',0,'f','dark');ok(dc().pb===2,'Teamwork: 2 Block when the type changes');
 reset();dc().field.push({u:add('oran','grass','disc').u,n:3});dc().disc.pop();for(let k=0;k<3;k++)add('strike','steel','draw');const hp0=dc().hand.length;await play('pruningshears');ok(dc().field[0].n===2&&dc().hand.length===hp0+1,'Pruning Shears: −1 counter each, draw per counter');
 await play('thornwall',null,'p');ok(dc().pb===E(8,'grass','blk'),'Thornwall: +2 Block per Plant counter');
 for(let k=0;k<20;k++){const o=dcRollOffer(r);if(o.some(x=>DC_SIG[x.d]&&(DC_SIG[x.d].token||DC_SIG[x.d].retired)))ok0=false}ok(ok0,'Still no tokens or retired cards in rewards');
 const D=dc(),all=[...D.draw,...D.hand,...D.disc,...D.void,...D.field.map(x=>x.u),...D.cons.flatMap(k=>[k.u,...k.parts]),...D.cocoons.flatMap(k=>k.held?[k.u,k.held]:[k.u]),...D.angel],want=[...r.deck.map(c=>c.u),...D.temp.map(c=>c.u)];ok(all.length===want.length&&new Set(all).size===all.length,'zones invariant after all signature tests '+JSON.stringify([all.length,want.length,new Set(all).size,want.filter(u=>!all.includes(u)).map(u=>(dcInst(r,u)||{}).d),all.filter(u=>!want.includes(u)).length,all.filter((u,k)=>all.indexOf(u)!==k).map(u=>(dcInst(r,u)||{}).d)]));
 return out.join('\n')});console.log(R);console.log('errs',errs.slice(0,6));await b.close()})();
