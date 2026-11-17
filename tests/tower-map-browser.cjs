const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});const p=await b.newPage({viewport:{width:390,height:844}});await p.emulateMedia({reducedMotion:'reduce'});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text())});
await p.goto('http://127.0.0.1:8767/index.html');await p.waitForTimeout(1500);
const R=await p.evaluate(async()=>{const out=[],ok=(c,m)=>out.push((c?'PASS ':'FAIL ')+m);const W=ms=>new Promise(r=>setTimeout(r,ms));
 window.dgQ=async()=>'full';
 const ids=[];for(const s of ['Magearna','Magnezone','Tyranitar']){giveMon({...rollMon(false),species:s,tier:INDEX[s].tier});ids.push(db.pokemon.at(-1).id)}
 db.tower={tower:true,diff:'hard',style:'game',sids:[],mode:'smart',quick:false,party:ids.map(id=>({id,hp:60,energy:20,starf:null})),floor:0,cleared:0,bag:{},tickets:0,cogs:0,studyMs:0,rooms:0,startedAt:stamp(),slider:true,battle:null,envs:shuffle(Object.keys(TW_ENVS)),cards:{},perkDone:[],bosses:0,challengesWon:0,log:[]};
 const r=db.tower;dcInitRun(r);dgMode='tower';go('minigames');dgOpen('tower');await W(400);if(!r.tmap){return ['FAIL dbg '+JSON.stringify([typeof twMapScreen,r.v,!!$('dgStage'),runOf()===r,dgMode,!!r.offer,!!r.dc,r.room])]}
 const m=r.tmap;ok(!!m&&m.len>=14&&m.len<=22,'Hard tower: '+(m&&m.len)+' floors (14–22)');ok(m.rows.at(-1).length===1&&m.rows.at(-1)[0].t==='boss','Top floor is the boss');ok(m.rows.at(-2).every(n=>n.t==='rest'),'Floor before the boss: Rest Sites');ok(m.rows[0].every(n=>n.t==='battle'),'First floor: battles');
 let reach=true;for(let i=1;i<m.rows.length;i++)m.rows[i].forEach((_,j)=>{if(!m.rows[i-1].some(n=>n.to.includes(j)))reach=false});ok(reach,'Every room can be reached');
 ok(document.querySelectorAll('#dgStage .tw-node.can').length===m.rows[0].length,'Map screen: first-floor rooms are selectable');
 const lens={easy:[14,18],balanced:[16,20]};let lok=true;for(const k in lens){for(let t=0;t<20;t++){const g=twGenMap({diff:k,cleared:0});if(g.len<lens[k][0]||g.len>lens[k][1])lok=false}}ok(lok,'Easy 14–18 · Balanced 16–20 floors');
 // battle room
 twMapGo(0,0);for(let k=0;k<30&&!r.dc;k++)await W(100);ok(!!r.dc&&r.floor===m.start,'Battle room → fight on floor '+r.floor);
 dcWin(r);await W(50);ok(!!r.offer,'Win → card offer');dcTake(null);await W(80);const av=m.rows[0][0].to;ok(document.querySelectorAll('#dgStage .tw-node.can').length===av.length,'Map: only connected rooms selectable ('+av.length+')');
 // rest
 const j1=av[0];m.rows[1][j1].t='rest';r.php=r.pmax-30;const h0=r.php;twMapGo(1,j1);await W(80);ok(r.room&&r.room.t==='rest'&&!!document.querySelector('.twr'),'Rest Site opens');twRestHeal();await W(50);ok(r.php===h0+Math.ceil(r.pmax*.25)&&r.cleared===r.floor&&!r.room,'Rest: heal 25% of Max HP');
 // upgrade via smith
 const j2=m.rows[1][j1].to[0];m.rows[2][j2].t='rest';twMapGo(2,j2);await W(80);dcChooseCards=async(t,ids)=>[ids[0]];const pr=twRestUp();await W(80);window.twUpOk(true);await pr;await W(50);const up=r.deck.find(c=>c.up);ok(!!up,'Smith: a card was upgraded ('+(up&&dcName(up))+')');
 const st=r.deck.find(c=>c.d==='strike');st.up=1;ok(dcEff(r,st,5,'dmg')===Math.floor(Math.ceil(6.5)*dcMult(r,st.t,'dmg')+1e-9),'Strike+: 5 → 7 base');ok(/Strike\+/.test(dcCardHTML(r,st,'')),'Card name shows +');
 // shop
 const j3=m.rows[2][j2].to[0];m.rows[3][j3].t='shop';r.tickets=200;twMapGo(3,j3);await W(80);const S=r.room;ok(S&&S.cards.length===6&&S.relics.length===3&&!!document.querySelector('#twIsf'),'Merchant: 6 cards, 3 relics, Madame Isfrid');
 ok(S.rm===10+Math.floor(r.floor/2),'Card Removal price: '+S.rm);const n0=r.deck.length,t0=r.tickets,c0=S.cards[0];twBuyCard(c0.u);ok(r.deck.length===n0+1&&r.tickets===t0-twPrice(r,c0.p)&&c0.sold,'Bought a card');
 twBuyRelic(S.relics[0].id);ok(r.relics.length===1,'Bought a relic: '+r.relics[0]);
 const n1=r.deck.length;await twShopRemove();ok(r.deck.length===n1-1&&S.rmDone&&r.removals===1,'Card Removal: one card removed');await twShopRemove();ok(r.deck.length===n1-1,'Card Removal: once per shop');
 twRoomDone();await W(50);
 // treasure
 const j4=m.rows[3][j3].to[0];m.rows[4][j4].t='treasure';twMapGo(4,j4);for(let k=0;k<80&&!(r.room&&r.room.got);k++)await W(100);ok(r.room&&r.room.got&&r.room.right===r.room.n,'Treasure: '+(r.room&&r.room.right)+'/'+(r.room&&r.room.n)+' → '+((r.room&&r.room.got)||[]).join(' | '));twTreasureNext();await W(80);if(r.offer){dcTake(null);await W(50)}
 // event
 const j5=m.rows[4][j4].to[0];m.rows[5][j5].t='event';const ev0=twPickEvent;twPickEvent=()=>'snorlax';r.php=r.pmax-Math.ceil(r.pmax*.3);const h5=r.php;twMapGo(5,j5);await W(80);ok(!!document.querySelector('.tw-ev'),'Event room renders');await twEventPick(0);ok(r.php===h5+Math.ceil(r.pmax*.2),'Event (Snorlax berry): heal 20%');twEventEnd();await W(50);twPickEvent=ev0;
 // relic in battle: Quick Claw
 r.relics=['crownofthefirstmove','pocketshield'];const j6=m.rows[5][j5].to[0];m.rows[6][j6].t='battle';twMapGo(6,j6);for(let k=0;k<30&&!r.dc;k++)await W(100);ok(r.dc&&r.dc.ap===4&&r.dc.pb===5,'Relics: Crown 4 AP turn 1, Pocket Shield 5 Block');ok(!!document.querySelector('.dc-mapbtn')&&!!document.querySelector('.dc-relics'),'Battle: map button and relic strip');
 twMapView();await W(120);ok(!!document.querySelector('.modal .tw-tower .tw-maplines path')||document.querySelectorAll('.tw-tower .tw-maplines path').length>2,'Map view modal with path lines');closeModal();
 // boss → next tower
 dcWin(r);dcTake(null);await W(50);m.row=m.len-2;m.col=0;const seg0=m.seg,env0=twEnvKey(r);twMapGo(m.len-1,0);for(let k=0;k<30&&!r.dc;k++)await W(100);ok(r.dc&&r.dc.kind!=='battle'&&r.dc.kind!=='swarm','Boss floor → boss fight ('+(r.dc&&r.dc.kind)+')');
 dcWin(r);dcTake(null);await W(80);ok(r.tmap.seg===seg0+1&&r.tmap.start===r.cleared+1&&twEnvKey(r)!==env0,'Boss beaten → new tower (seg '+r.tmap.seg+', starts '+r.tmap.start+'F)');
 return out});
R.forEach(x=>console.log(x));console.log('errs',errs);await b.close();if(R.some(x=>x.startsWith('FAIL'))||errs.length)process.exit(1)})();
