const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});const p=await b.newPage({viewport:{width:390,height:844}});await p.emulateMedia({reducedMotion:'reduce'});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text());else if(/^DBG/.test(m.text()))console.log(m.text())});
await p.goto('http://127.0.0.1:8767/index.html');await p.waitForTimeout(1500);
const R=await p.evaluate(async()=>{const out=[],ok=(c,m)=>out.push((c?'PASS ':'FAIL ')+m);const W=ms=>new Promise(r=>setTimeout(r,ms));
 window.__ans=[];window.dgQ=async()=>{window.__asked=(window.__asked||0)+1;return window.__ans.length?window.__ans.shift():'full'};
 const ids=[];for(const s of ['Magearna','Magnezone','Tyranitar']){giveMon({...rollMon(false),species:s,tier:INDEX[s].tier});ids.push(db.pokemon.at(-1).id)}
 db.summaries=db.summaries||[];db.tower={tower:true,diff:'balanced',style:'game',sids:[],mode:'smart',quick:false,party:ids.map(id=>{const pp=db.pokemon.find(x=>x.id===id),c=combatant(pp);return {id,hp:c.hp*6,energy:20,starf:null}}),floor:0,cleared:0,bag:{},tickets:0,cogs:0,studyMs:0,rooms:0,startedAt:stamp(),slider:true,battle:null,envs:shuffle(Object.keys(TW_ENVS)),cards:{},perkDone:[],bosses:0,challengesWon:0,log:[]};
 let r=db.tower;const cmb=combatant;window.combatant=p=>{const c=cmb(p);return Object.assign({},c,{hp:60})};
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

 dc.foes.forEach(f=>{f.hp=f.maxhp=500;f.blk=0});
 const D=()=>r.dc,st=(id,to,up)=>dcAddStatus(r,id,1,to||'hand',up)[0],calm=()=>{D().foes.forEach(f=>{if(f.hp>0)f.it={k:'block',n:1}})};
 const clear=()=>{const d=D();d.draw.push(...d.hand);d.hand=[];const S=u=>!!dcStId(r,u);const gone=[...d.draw,...d.disc].filter(S);d.draw=d.draw.filter(u=>!S(u));d.disc=d.disc.filter(u=>!S(u));d.void.push(...gone);d.sq=[];d.ap=3;d.pb=0;d.retainU=[];d.tunnel=null;d.qAdd=0};
 const endTurn=async ans=>{window.__ans=ans||[];window.__asked=0;calm();await dcEndTurn();await W(250)};
 const where=u=>{const d=D();return d.hand.includes(u)?'hand':d.void.includes(u)?'void':d.disc.includes(u)?'disc':d.draw.includes(u)?'draw':'?'};
 r.php=r.pmax;
 // ordinary cards: no prompt
 clear();const s1=mk('strike','steel');setHand([s1]);window.__asked=0;dcSel=s1.u;await dcGo(0);ok(window.__asked===0&&where(s1.u)==='disc','ordinary Tower card resolves with no question');
 // Scorch / Whirlpool (Ghastly): three outcomes
 clear();let sc=st('scorch');let hp=r.php;D().pb=40;await endTurn(['full']);ok(window.__asked===1&&where(sc)==='void'&&r.php===hp,'Scorch correct: 1 question, nothing happens, Exiled');
 clear();sc=st('scorch');hp=r.php;D().pb=40;await endTurn(['makeup']);ok(window.__asked===1&&r.php===hp-2&&where(sc)==='void','Scorch Make-Up: 2 damage straight to HP (Block ignored), Exiled');
 clear();sc=st('scorch');hp=r.php;await endTurn(['fail']);ok(window.__asked===1&&r.php===hp-6&&where(sc)!=='void','Scorch incorrect: discarded instead of Exiled, 6 damage ('+where(sc)+')');
 clear();let wp=st('whirlpool');hp=r.php;await endTurn(['makeup']);ok(window.__asked===1&&r.php===hp-2&&where(wp)==='void','Whirlpool works like Scorch');
 clear();sc=st('scorch');hp=r.php;D().hand=D().hand.filter(x=>x!==sc);dcDiscardU(r,sc);await endTurn(['fail']);ok(window.__asked===0&&r.php===hp,'Scorch discarded before end of turn: no question');
 clear();const a=st('scorch'),b2=st('scorch');hp=r.php;await endTurn(['full','fail']);ok(window.__asked===2&&where(a)==='void'&&where(b2)!=='void'&&r.php===hp-6,'two Scorches resolve one at a time in hand order (correct, then incorrect)');
 ok(inv(),'zones invariant after Scorch');
 // reload during a pending question
 clear();sc=st('scorch');hp=r.php;let release=null;window.dgQ=()=>new Promise(res=>{release=res});calm();dcEndTurn();await W(80);
 const saved=JSON.parse(JSON.stringify(db.tower));ok(saved.dc.ending===1&&saved.dc.sq.length===1&&saved.dc.sq[0].k==='scorch'&&!saved.dc.sq[0].res&&saved.php===hp,'saved mid-question: Scorch still pending, no damage yet');
 dgEpoch++;dcLock=false;db.tower=saved;window.__asked=0;window.__ans=['fail'];window.dgQ=async()=>{window.__asked=(window.__asked||0)+1;return window.__ans.length?window.__ans.shift():'full'};dcResume();await W(300);
 let R2=db.tower;ok(window.__asked===1&&R2.php===hp-6&&R2.dc.phase==='player'&&!R2.dc.ending,'reopening asks the pending question again once, 6 damage once, turn continues');release&&release('full');await W(80);ok(db.tower.php===hp-6,'old answer after reload is ignored');
 {const d=R2.dc;d.qAdd=0;d.draw.push(...d.hand);d.hand=[];const s2=dcAddStatus(R2,'scorch',1,'hand')[0];d.sq=[{k:'scorch',u:s2,res:'makeup'}];d.ending=1;d.foes.forEach(f=>{if(f.hp>0)f.it={k:'block',n:1}});save();const snap=JSON.parse(JSON.stringify(db.tower)),h0=R2.php;
  dgEpoch++;dcLock=false;db.tower=snap;window.__asked=0;dcResume();await W(300);ok(window.__asked===0&&db.tower.php===h0-2,'saved answer: reopening applies Make-Up once without asking again');
  const snap2=JSON.parse(JSON.stringify(db.tower));dgEpoch++;dcLock=false;db.tower=snap2;dcResume();await W(200);ok(db.tower.php===h0-2,'reopening again never repeats the damage')}
 r=db.tower;const mk2=(d,t)=>{const c={u:uid(),d,t};r.deck.push(c);D().draw.push(c.u);return c};const setHand2=list=>{const d=D();d.draw.push(...d.hand);d.hand=[];list.forEach(c=>{d.draw=d.draw.filter(x=>x!==c.u);d.hand.push(c.u)})};
 // Daze / Mind Haze: plain clogs
 clear();const dz=st('daze'),mh=st('mindhaze');await endTurn();ok(window.__asked===0&&where(dz)!=='void'&&where(mh)!=='void'&&!dcCanPlay(r,dz),'Daze and Mind Haze: unplayable, no question, discarded normally (not Exiled)');
 // Static Cling
 clear();const cl=st('staticcling'),t1=mk2('trumpcard','steel'),s2=mk2('strike','steel');setHand2([t1,s2]);D().draw=D().draw.filter(x=>x!==cl);D().hand.push(cl);st('staticcling');
 ok(dcCost(r,t1)===1&&dcCost(r,s2)===2&&dcCost(r,dcInst(r,cl))===1,'Static Cling: first card costs +1 (0→1, 1→2); its own cost stays 1');dcSel=t1.u;await dcGo(0);ok(D().ap===2&&dcCost(r,s2)===1,'surcharge only on the first card each turn (shared by copies)');
 dcSel=cl;await dcGo(null);ok(where(cl)==='void'&&D().ap===1,'playing Static Cling costs 1 and Exiles it');
 // Shrapnel
 clear();const sh=st('shrapnel');D().pb=10;D().sq=dcEndQ(r);await dcRunSQ(r);ok(D().pb===6&&where(sh)==='void','Shrapnel: lose 4 Block, Exiled');
 // Snare
 clear();const sn=st('snare');const h0=D().hand.length;dcDrawN(r,2);ok(D().hand.length===h0,'Snare: no draws while it’s in your hand');window.__ans=['full'];window.__asked=0;dcSel=sn;await dcGo(null);await W(30);if(D().post)await dcPost();ok(window.__asked===1&&where(sn)==='void'&&D().ap===3,'Snare played (0 AP): correct → Exiled');dcDrawN(r,1);ok(D().hand.length===h0,'draws work again after Snare is gone');
 clear();const sn2=st('snare');window.__ans=['fail'];window.__asked=0;dcSel=sn2;await dcGo(null);await W(30);if(D().post)await dcPost();ok(window.__asked===1&&where(sn2)==='hand'&&D().retainU.includes(sn2),'Snare incorrect: back in hand with Retain');await endTurn();ok(where(sn2)==='hand','retained Snare stays through the end of turn');
 // question-card cap
 clear();D().qAdd=0;const added=dcAddStatus(r,'scorch',5,'disc');ok(added.length===3&&dcQLeft(r)===0,'at most 3 question cards (Scorch / Whirlpool / Snare) per fight');D().disc=D().disc.filter(u=>!added.includes(u));D().void.push(...added);D().qAdd=0;
 // curses
 const curse=id=>{twAddCard(r,id);const c=r.deck[r.deck.length-1];D().draw.unshift(c.u);return c.u};
 clear();let uf=curse('unpaidfavor');dcDrawN(r,1);window.__ans=['fail'];window.__asked=0;await dcPost();await W(50);ok(window.__asked===1&&D().ap===2&&where(uf)==='disc','Unpaid Favor wrong: −1 AP, discarded');D().disc=D().disc.filter(x=>x!==uf);D().draw.unshift(uf);window.__asked=0;dcDrawN(r,1);await dcPost();ok(window.__asked===0&&where(uf)==='hand','Unpaid Favor asks only the first time it’s drawn each fight');
 clear();const ld=curse('lingeringdoubt');dcDrawN(r,1);await endTurn(['fail']);ok(window.__asked===1&&D().ap===2,'Lingering Doubt wrong: next turn starts with 1 less AP');
 clear();D().draw=D().draw.filter(x=>x!==ld);D().disc=D().disc.filter(x=>x!==ld);D().hand=D().hand.filter(x=>x!==ld);D().void=D().void.filter(x=>x!==ld);D().hand.push(ld);D().ap=0;await endTurn(['fail']);ok(window.__asked===0&&D().ap===3,'Lingering Doubt: no question when no AP is left');
 clear();const ff=curse('frayedfocus');dcDrawN(r,1);const n0=D().hand.length;dcDrawN(r,2);ok(D().hand.length===n0+1,'Frayed Focus: first extra draw is 1 smaller');dcDrawN(r,2);ok(D().hand.length===n0+3,'Frayed Focus: only once per turn');
 clear();while(D().foes.length<3)D().foes.push(JSON.parse(JSON.stringify(D().foes[0])));D().foes.forEach((f,i)=>{f.hp=100+i*10;f.maxhp=500});D().foes[1].hp=50;const tv=curse('tunnelvision');dcDrawN(r,1);const sdef=dcDefOf('strike');ok(D().tunnel===1&&!dcFoeOk(r,sdef,0)&&dcFoeOk(r,sdef,1)&&dcFoeOk(r,dcDefOf('guard'),0),'Tunnel Vision: single-target Attacks only on the lowest-HP enemy');
 clear();const dw=curse('deadweight');dcDrawN(r,1);await endTurn();ok(where(dw)==='hand','Dead Weight stays in hand between turns');
 ok(inv(),'zones invariant after curses');
 // enemy moves and intents
 const f0=D().foes[0];f0.it={k:'card',id:'mindhaze',n:1,to:'hand'};ok(/Mind Haze ×1/.test(dcIntentHTML(r,f0)),'intent shows Mind Haze ×1');f0.it={k:'card',id:'staticcling',n:1,to:'hand'};ok(/Static Cling ×1/.test(dcIntentHTML(r,f0)),'intent shows Static Cling ×1');
 clear();f0.it={k:'card',id:'shrapnel',n:2,to:'hand'};await dcAct(r,f0,0);ok(D().hand.filter(u=>dcStId(r,u)==='shrapnel').length===2,'Stealth Rock-style move puts 2 Shrapnel straight into your hand');
 ok(DC_MOVES.fire.some(m=>m[0]==='Will-O-Wisp'&&m[3](x=>x).id==='scorch')&&DC_MOVES.water.some(m=>m[0]==='Whirlpool'&&m[3](x=>x).fx.card[0]==='whirlpool')&&DC_MOVES.normal.some(m=>m[0]==='Yawn'&&m[3](x=>x).id==='daze')&&DC_MOVES.psychic.some(m=>m[0]==='Hypnosis'&&m[3](x=>x).id==='mindhaze')&&DC_MOVES.rock.some(m=>m[0]==='Stealth Rock'&&m[3](x=>x).id==='shrapnel')&&DC_MOVES.electric.some(m=>m[0]==='Thunder Wave'&&m[3](x=>x).id==='staticcling')&&DC_MOVES.grass.some(m=>m[0]==='Stun Spore'&&m[3](x=>x).id==='snare'),'each type’s status card has a type move');
 {const ok2=Object.entries(DC_SETS).every(([sp,set])=>set.flat().every(n=>DC_MV[n]));r.dc.foes[0].species='Torkoal';r.dc.foes[0].ps=0;const seq=[0,1,2,3,4].map(()=>dcPlan(r,r.dc.foes[0],0).name);ok(ok2&&seq[0]==='Stealth Rock'&&seq[1]==='Lava Plume'&&seq[2]==='Rapid Spin'&&['Yawn','Protect'].includes(seq[3])&&seq[4]==='Stealth Rock','Torkoal pattern: '+seq.join(' > '))}
 // curses persist between fights; statuses don't
 clear();const keepC=r.deck.filter(c=>DC_STATUS[c.d]&&DC_STATUS[c.d].curse).length;dcToVoid(r,dw);D().hand=D().hand.filter(x=>x!==dw);const tempN=D().temp.length;
 r.dc=null;dcStart(r,'battle',[{species:'Rattata',maxhp:30,atk:5,lv:5,types:['normal']}]);await W(50);const all=[...r.dc.draw,...r.dc.hand,...r.dc.disc];
 ok(r.deck.filter(c=>DC_STATUS[c.d]&&DC_STATUS[c.d].curse).length===keepC&&all.includes(dw)&&r.dc.temp.length===0&&tempN>0,'next fight: Exiled curse is back in the deck, enemy status cards are gone');
 r.deck=r.deck.filter(c=>c.u!==dw);ok(!r.deck.some(c=>c.u===dw),'removing a curse from the run deck (Merchant removal) is permanent');
 // events: previews and bargains
 const evs=[['gholdengo',1,'unpaidfavor','Unpaid Debt'],['cinderace',3,'lingeringdoubt','Lingering Doubt'],['snorlax',1,'deadweight','Dead Weight'],['unown',1,'frayedfocus','Frayed Focus']];
 for(const [id,i,cid,nm] of evs){r.dc=null;r.room={t:'event',ev:id,s:{}};twEvent();await W(30);const o=TW_EVENTS[id].pages.start.opts[i],sv=typeof o.s==='function'?o.s(r,r.room):o.s;const n=r.deck.filter(c=>c.d===cid).length;await twEventPick(i);await W(40);ok(sv.includes('1 × '+nm+' (curse)')&&r.deck.filter(c=>c.d===cid).length===n+1,id+': preview names 1 × '+nm+' and the reward; accepting adds it')}
 // lethal Scorch stops pending prompts
 r.room=null;dcStart(r,'battle',[{species:'Rattata',maxhp:300,atk:1,lv:5,types:['normal']}]);await W(50);window.__ans=[];await dcPost();await W(30);clear();st('scorch');st('scorch');r.php=5;await endTurn(['fail','fail']);ok(window.__asked===1&&!r.dc,'lethal Scorch ends the fight; the second Scorch never asks');
 return out.join('\n')});console.log(R);console.log('errs',errs.slice(0,6));await b.close()})();
