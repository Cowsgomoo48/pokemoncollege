const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});const p=await b.newPage({viewport:{width:390,height:844}});await p.emulateMedia({reducedMotion:'reduce'});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text())});
await p.goto('http://127.0.0.1:8767/index.html');await p.waitForTimeout(1500);
const R=await p.evaluate(async()=>{const out=[],ok=(c,m)=>out.push((c?'PASS ':'FAIL ')+m);const W=ms=>new Promise(r=>setTimeout(r,ms));
 window.__ans=[];window.dgQ=async()=>{window.__asked=(window.__asked||0)+1;return window.__ans.length?window.__ans.shift():'full'};
 const ids=[];for(const s of ['Magearna','Magnezone','Tyranitar']){giveMon({...rollMon(false),species:s,tier:INDEX[s].tier});ids.push(db.pokemon.at(-1).id)}
 db.summaries=db.summaries||[];db.tower={tower:true,diff:'balanced',style:'game',sids:[],mode:'smart',quick:false,party:ids.map(id=>{const pp=db.pokemon.find(x=>x.id===id),c=combatant(pp);return {id,hp:c.hp*6,energy:20,starf:null}}),floor:0,cleared:0,bag:{},tickets:0,cogs:0,studyMs:0,rooms:0,startedAt:stamp(),slider:true,battle:null,envs:shuffle(Object.keys(TW_ENVS)),cards:{},perkDone:[],bosses:0,challengesWon:0,log:[]};
 const r=db.tower;const cmb=combatant;window.combatant=p=>{const c=cmb(p);return Object.assign({},c,{hp:60})};
 dcInitRun(r);dgMode='tower';
 const inv=()=>{const r=db.tower,dc=r&&r.dc;if(!dc)return true;const all=[...dc.draw,...dc.hand,...dc.disc,...dc.void,...(dc.pend?[dc.pend.u]:[])];const want=[...r.deck.map(c=>c.u),...dc.temp.map(c=>c.u)];return all.length===want.length&&new Set(all).size===all.length&&want.every(u=>all.includes(u))};
 // type bonuses
 const T=dcPartyTypes(r);ok(T.steel===2&&T.fairy===1&&T.electric===1&&T.rock===1&&T.dark===1,'party types '+JSON.stringify(T));
 ok(dcMult(r,'steel','dmg')===1.5&&dcMult(r,'steel','blk')===1.3&&dcMult(r,'fairy','dmg')===1.25&&Math.abs(dcMult(r,'dark','blk')-1.15)<1e-9,'type multipliers Steel 1.50/1.30, others 1.25/1.15');
 ok(r.deck.length===10&&r.deck.filter(c=>c.d==='strike').length===5,'starter deck 5 Strike 5 Guard; types '+r.deck.map(c=>c.t[0]).join(''));
 // enter floor 1
 go('minigames');dgOpen('tower');await W(400);r.floor=1;twBattle(null);await W(200);const dc=r.dc;
 ok(dc.hand.length===5&&dc.draw.length===5&&dc.ap===3&&dc.turn===1,'floor entry: 5 drawn, AP 3, turn 1 (hand '+dc.hand.length+')');ok(inv(),'zones invariant @entry');
 dcRender();await W(50);ok(r.dc.hand.length===5,'no extra draw after render');ok(dc.foes.every(f=>f.it),'initial intents shown');
 // force a known hand: put specific cards
 const mk=(d,t)=>{const c={u:uid(),d,t};r.deck.push(c);dc.draw.push(c.u);return c};
 const setHand=list=>{dc.draw.push(...dc.hand);dc.hand=[];list.forEach(c=>{dc.draw=dc.draw.filter(x=>x!==c.u);dc.hand.push(c.u)})};
 dc.foes.forEach(f=>{f.hp=f.maxhp=500;f.blk=0});const F=dc.foes[0];
 const sS=mk('strike','steel'),om=mk('openingmove','steel'),ft=mk('followthrough','rock'),rf=mk('reinforce','steel'),tc=mk('trumpcard','steel'),eg=mk('emergencyguard','fairy');
 setHand([om,sS,ft,rf,tc]);
 // Opening Move first success: 14*1.5=21
 let hp=F.hp;dcSel=om.u;await dcGo(0);ok(hp-F.hp===21&&dc.ap===2&&dc.disc.includes(om.u),'Opening Move first = 21, AP 3→2 (dealt '+(hp-F.hp)+', AP '+dc.ap+')');ok(inv(),'invariant');
 // failed Strike: AP spent, no damage, discarded, ok count unchanged
 hp=F.hp;const okBefore=dc.ok;window.__ans=['fail'];window.__asked=0;dcSel=sS.u;await dcGo(0);ok(F.hp<hp&&dc.ap===1&&dc.disc.includes(sS.u)&&dc.ok===okBefore+1&&window.__asked===0,'Strike resolves with no study question (AP spent once, counted as a play)');window.__ans=[];
 // makeup Follow Through: 7*1.25=8 and draw 1 (another succeeded)
 hp=F.hp;const hn=dc.hand.length;window.__ans=[];dcSel=ft.u;await dcGo(0);ok(hp-F.hp===8&&dc.hand.length===hn-1+1&&dc.ap===0,'makeup Follow Through = 8 dmg + draw 1 (hand '+dc.hand.length+')');ok(inv(),'invariant');
 // can't play without AP
 dcSel=rf.u;await dcGo(null);ok(dc.hand.includes(rf.u)&&dc.ap===0,'cannot commit Reinforce with 0 AP');
 // Trump Card 0 AP Safeguard wrong -> base 4*1.5=6, Exiled
 hp=F.hp;window.__ans=[];dcSel=tc.u;await dcGo(0);ok(hp-F.hp===12&&dc.void.includes(tc.u)&&dc.ap===0,'Trump Card: old right-answer effect on every play (8 × 1.5 = 12), Exiled to Void');
 // end turn: ally block survives enemy turn; enemy block survives player turn
 dc.ap=1;dcSel=rf.u;await dcGo(null);const blk1=dc.pb;ok(blk1===5,'Reinforce with no earlier Block = floor(4×1.3)=5 only (got '+blk1+')');
 dc.ap=1;const rf2=mk('reinforce','steel');setHand([rf2]);dcSel=rf2.u;await dcGo(null);ok(dc.pb-blk1===5+7,'Reinforce after Block = 5 + floor(6×1.3)=7 separately (got +'+(dc.pb-blk1)+')');
 // Opening Move second this turn = 8*1.5=12
 const om2=mk('openingmove','steel');setHand([om2]);dc.ap=1;hp=F.hp;dcSel=om2.u;await dcGo(0);ok(hp-F.hp===12,'Opening Move not first = 12 (got '+(hp-F.hp)+')');
 // set enemy intents: foe0 attacks ally1 for known dmg; foe0 gains block next
 dc.foes.forEach((f,i)=>{f.it=i===0?{k:'atk',dmg:10,hits:1}:{k:'block',n:9}});const prev=dcHit(dc.foes[0],dc.foes[0].it);const ally1hp=r.php,allyBlk=dc.pb;
 const voidN=dc.void.length;await dcEndTurn();await W(100);
 ok(r.php===ally1hp-Math.max(0,prev-allyBlk),'shared Block absorbed enemy hit during enemy turn (preview '+prev+', block '+allyBlk+', team hp '+ally1hp+'→'+r.php+')');
 ok(dc.pb===0,'team Block expired at start of next player turn');
 ok(dc.foes.length<2||dc.foes[1].blk===9||dc.foes[1].hp<=0,'enemy Block persists through player turn ('+(dc.foes[1]||{}).blk+')');
 ok(dc.hand.length===5&&dc.disc.length===0&&dc.void.length===voidN&&dc.void.includes(tc.u)&&!dc.draw.includes(tc.u),'next turn: discard shuffled back, Void excluded, 5 drawn');ok(inv(),'invariant after turn');
 // empty draw mid-turn
 dc.disc.push(...dc.draw);dc.draw=[];const ft2=mk('followthrough','rock');dc.draw=dc.draw.filter(x=>x!==ft2.u);dc.hand.push(ft2.u);dc.ok=1;dc.ap=3;const h0=dc.hand.length;dcSel=ft2.u;await dcGo(0);ok(dc.hand.length===h0-1&&inv(),'draw with empty draw pile draws nothing, no recycle');
 // double tap
 const s2=mk('strike','steel');setHand([s2]);dc.ap=3;window.__asked=0;dcSel=s2.u;const pA=dcGo(0);dcSel=s2.u;const pB=dcGo(0);await pA;await pB;ok(window.__asked===0&&dc.ap===2,'double tap commits once (questions '+window.__asked+', AP '+dc.ap+')');
 // save during question: commit, then 'reload' with pending
 const s3=mk('strike','steel');setHand([s3]);dc.ap=2;dc.hand=dc.hand.filter(x=>x!==s3.u);dc.ap-=1;dc.pend={u:s3.u,target:0,side:'f',choice:{}};save();
 const saved=JSON.parse(JSON.stringify(db.tower));ok(saved.dc.pend&&saved.dc.pend.u===s3.u&&saved.dc.ap===1&&!saved.dc.hand.includes(s3.u),'saved after commit: AP already paid, card committed');
 dgEpoch++;dcLock=false;db.tower=saved;const r2=db.tower;window.__asked=0;hp=r2.dc.foes[0].hp;dcResume();await W(150);
 ok(!r2.dc.pend&&r2.dc.ap===1&&r2.dc.disc.includes(s3.u)&&r2.dc.foes[0].hp===hp-7&&window.__asked===0,'resume resolves the committed card once, no question, no refund (AP '+r2.dc.ap+')');
 // dynamic cost + ability stacking (real signature cards)
 const D=r2.dc,ab1={u:uid(),d:'flamebody',t:'fire'},ab2={u:uid(),d:'flamebody',t:'fire'};r2.deck.push(ab1,ab2);D.hand=D.hand.concat([ab1.u,ab2.u]);D.ap=4;dcSel=ab1.u;await dcGo(null);dcSel=ab2.u;await dcGo(null);
 ok(D.buffs.flamebody===2&&D.void.includes(ab1.u)&&D.void.includes(ab2.u)&&D.ap===0,'Ability: buff granted, stacks ×2, cards to Void, AP paid');
 const pom={u:uid(),d:'pompeii',t:'fire'};r2.deck.push(pom);D.hand.push(pom.u);D.foes.forEach(f=>f.st.burn=0);const c0=dcCost(r2,pom);D.foes.forEach(f=>{if(f.hp>0)f.st.burn=2});const c1=dcCost(r2,pom);
 ok(c0===6&&c1===6-D.foes.filter(f=>f.hp>0).length,'dynamic cost: Pompeii 6 → '+c1+' with '+D.foes.filter(f=>f.hp>0).length+' Burned');
 for(let k=0;k<8;k++)D.foes.push({species:'Zubat',lv:1,maxhp:9,hp:9,atk:3,blk:0,st:{burn:1,poison:0,chill:0,weak:0,str:0},it:null,last:null});ok(dcCost(r2,pom)===0,'dynamic cost clamps at 0 ('+dcCost(r2,pom)+')');D.foes.splice(-8);
 const ab3={u:uid(),d:'flamebody',t:'fire'};r2.deck.push(ab3);D.hand.push(ab3.u);D.ap=3;window.__ans=['fail'];window.__asked=0;dcSel=ab3.u;await dcGo(null);ok(D.buffs.flamebody===3&&D.void.includes(ab3.u)&&D.ap===1&&window.__asked===0,'third Ability installs with no question');window.__ans=[];
 D.foes.forEach(f=>f.st.burn=0);delete D.buffs.flamebody;
 // simultaneous knockout via Sweep -> win, offer saved, no reroll on reload
 D.foes.forEach(f=>{if(f.hp>0){f.hp=3;f.blk=0}});const sw={u:uid(),d:'sweep',t:'rock'};r2.deck.push(sw);D.hand.push(sw.u);D.ap=3;dcSel=sw.u;await dcGo(null);await W(100);
 ok(!r2.dc&&r2.offer&&r2.offer.cards.length===3&&r2.cleared===1,'Sweep KOs all at once → win, 3 card offers');const offer=JSON.stringify(r2.offer.cards);dcResume();await W(50);ok(JSON.stringify(r2.offer.cards)===offer,'reopening does not reroll rewards');
 ok(r2.offer.cards.every(c=>dcTypes(c).some(x=>Object.keys(T).includes(x))),'offers use party types: '+r2.offer.cards.map(c=>c.d+'/'+c.t).join(', '));
 const deckN=r2.deck.length;dcTake(r2.offer.cards[0].u);await W(300);ok(r2.deck.length===deckN+1,'taking a card adds it permanently');
 {const m=twMapEnsure(r2),row=m.row+1,j=m.row<0?0:m.rows[m.row][m.col].to[0];m.rows[row][j].t='battle';twMapGo(row,j);for(let k=0;k<40&&!r2.dc;k++)await W(100)}
 // next floor: void restored
 ok(r2.dc&&r2.floor>=1&&r2.dc.void.length===0&&r2.dc.hand.length===5&&r2.dc.draw.length===r2.deck.length-5&&inv(),'floor 2: Void cards returned, all cards gathered, 5 drawn (floor '+r2.floor+')');
 // retarget + faint
 const D2=r2.dc;D2.foes.forEach(f=>{f.it=null});const f0=D2.foes[0];f0.hp=f0.maxhp=999;f0.st={burn:0,poison:0,chill:0,weak:0,str:0};f0.it={k:'atk',dmg:5,hits:3};r2.php=60;D2.pb=0;D2.foes.forEach((f,i)=>{if(i)f.hp=0});
 await dcEndTurn();await W(100);ok(r2.php===45&&r2.pmax===r2.party.length*60,'multi-hit hits the shared team HP 3× (60→'+r2.php+', max '+r2.pmax+')');
 // status card in hand at end turn
 const sc={u:uid(),d:'scorch',t:''};D2.temp.push(sc);D2.hand.push(sc.u);const lh=r2.php;f0.it={k:'block',n:1};window.__ans=['fail'];await dcEndTurn();await W(150);ok(r2.php===lh-6,'Scorch: wrong answer at end of turn = 6 HP damage ('+lh+'→'+r2.php+')');window.__ans=[];ok(inv(),'invariant with status cards');
 // intent preview consistency with weak/str
 ['draw','hand','disc'].forEach(z=>D2[z]=D2[z].filter(x=>x!==sc.u));if(!D2.void.includes(sc.u))D2.void.push(sc.u);f0.st.str=2;f0.st.weak=1;f0.it={k:'atk',dmg:8,hits:1};const pv=dcHit(f0,f0.it),bh=r2.php;D2.pb=0;await dcEndTurn();await W(100);ok(bh-r2.php===pv&&pv===Math.floor(10*.75),'intent preview = actual damage with Strength + Weak ('+pv+')');
 // all faint -> lose
 r2.php=1;D2.pb=0;f0.it={k:'aoe',dmg:50,hits:3};await dcEndTurn();await W(200);ok(!r2.dc&&/fainted/.test(document.getElementById('dgStage').textContent),'team HP 0 → lose screen');
 return out.join('\n')});console.log(R);
// legacy run migration + narrow screen render
const L=await p.evaluate(async()=>{const S0=twStats().runs,c0=db.cogs;db.tower={tower:true,party:[],floor:7,cleared:6,tickets:12,cogs:12,studyMs:0,bag:{},envs:Object.keys(TW_ENVS),cards:{},perkDone:[]};dgMode='tower';closeModal();towerEntry();await new Promise(r=>setTimeout(r,200));return (db.tower===null)+' runs+'+(twStats().runs-S0)+' cogs+'+(db.cogs-c0)+' modal:'+/REBUILT/.test(document.body.innerText)});console.log('legacy:',L);
for(const w of [320,390]){await p.setViewportSize({width:w,height:780});await p.evaluate(async()=>{closeModal();const ids=db.pokemon.slice(-3).map(x=>x.id);db.tower={tower:true,diff:'balanced',sids:[],mode:'smart',party:ids.map(id=>({id,hp:combatant(db.pokemon.find(x=>x.id===id)).hp,energy:20})),floor:0,cleared:0,bag:{},tickets:0,cogs:0,studyMs:0,envs:Object.keys(TW_ENVS),cards:{},perkDone:[],bosses:0,challengesWon:0};dcInitRun(db.tower);dgMode='tower';go('minigames');dgOpen('tower');await new Promise(r=>setTimeout(r,500));const r=db.tower;r.floor=1;twBattle(null);r.dc.deck=0;const x={u:uid(),d:'trumpcard',t:'fairy'},y={u:uid(),d:'reinforce',t:'steel'};r.deck.push(x,y);r.dc.hand.push(x.u,y.u);dcRender({drawn:[]});dcTap(r.dc.hand[0])});await p.waitForTimeout(600);await p.screenshot({path:'dk_'+w+'.png',fullPage:false});
 console.log(w,'overflowX', await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'endBtn',await p.evaluate(()=>{const e=document.getElementById('dcEnd').getBoundingClientRect();return Math.round(e.bottom)+'/'+innerHeight}))}
console.log('errs',errs.slice(0,6));await b.close()})();
