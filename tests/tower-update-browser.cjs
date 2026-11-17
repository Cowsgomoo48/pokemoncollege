const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});const p=await b.newPage({viewport:{width:390,height:844}});await p.emulateMedia({reducedMotion:'reduce'});const errs=[];p.on('pageerror',e=>errs.push(e.message));if(process.env.V)p.on('console',m=>console.log('>',m.text()));
await p.goto('http://127.0.0.1:8767/index.html');await p.waitForTimeout(1500);
const R=await p.evaluate(async()=>{const out=[],ok=(c,m)=>{if(window.__inv){const D=r_().dc,all=[...D.draw,...D.hand,...D.disc,...D.void,...D.field.map(x=>x.u)];const want=[...r_().deck.map(c=>c.u),...D.temp.map(c=>c.u)];const miss=want.filter(u=>!all.includes(u));if(miss.length&&!window.__rep){window.__rep=1;console.log('LOST after: '+m+' '+miss.map(u=>(dcInst(r_(),u)||{}).d))}}out.push((c?'PASS ':'FAIL ')+m);console.log((c?'PASS ':'FAIL ')+m)},W=ms=>new Promise(r=>setTimeout(r,ms));window.dgQ=async()=>'full';const r_=()=>db.tower;
 const ids=[];for(const s of ['Magearna','Magnezone','Tyranitar']){giveMon({...rollMon(false),species:s,tier:INDEX[s].tier});ids.push(db.pokemon.at(-1).id)}
 const cmb=combatant;window.combatant=p=>Object.assign({},cmb(p),{hp:60});
 db.tower={tower:true,sids:[],mode:'smart',party:ids.map(id=>({id,hp:60,energy:20})),floor:0,cleared:0,bag:{},tickets:0,cogs:0,studyMs:0,envs:Object.keys(TW_ENVS),cards:{},perkDone:[],bosses:0,challengesWon:0};const r=db.tower;dcInitRun(r);dgMode='tower';go('minigames');dgOpen('tower');await W(300);r.floor=6;twBattle(null);await W(50);
 const dc=()=>r.dc,F=i=>dc().foes[i];window.__inv=1;
 const reset=()=>{const D=dc();D.foes=[0,1,2].map(i=>({species:'Zubat',lv:5,maxhp:200,hp:200,atk:10,blk:0,st:{burn:0,poison:0,chill:0,weak:0,str:0,vuln:0,enf:0,toxin:0},it:{k:'block',n:1},last:null,hpDealt:false}));D.pb=0;D.pkeep=0;D.pburn=0;r.php=r.pmax;D.buffs={};D.once={};D.hitsOn={};D.ok=0;D.atkOk=0;D.blk=0;D.ap=20;D.costDown=0;D.pst={weak:0,vuln:0,str:0,enf:0,toxin:0};D.instT=0;D.frost=0;D.frostHit={};D.ffLose=0;D.tookLast=0;D.isekai=[];D.angel.forEach(u=>D.disc.push(u));D.angel=[];D.charge=0;D.seeds=[];D.ward=0;D.dodge=0;D.field.forEach(x=>D.disc.push(x.u));D.field=[];const T=new Set(D.temp.map(c=>c.u));['draw','hand','disc','void'].forEach(z=>D[z]=D[z].filter(u=>!T.has(u)));D.temp=[];D.barr=[];D.noBlk=0;D.post=null;D.postQ=[];D.koT=0;D.discT=0;D.hw=null;D.fly=0;D.flyT=0;D.cons.forEach(k=>D.disc.push(k.u,...k.parts));D.cons=[];D.cocoons.forEach(k=>{D.disc.push(k.u);if(k.held)D.disc.push(k.held)});D.cocoons=[];D.vault=0;D.wwall=0;D.fossil=0;D.hoard=0;D.wish=0;D.wishLost=0;D.slip=0;D.slipDrop=0;D.geode=0;D.geodeHit=0;D.tscreen=0;D.fproof=0;D.cdU={};D.awaken=0;D.fsight=[];D.burrow.forEach(u=>{});D.burrow=[];D.endNow=0;D.big3=0;D.plays=0;D.retainU=[];D.ribbon=[];D.retained=[];D.scales=null;D.bmDraw=0;D.rehearse=[];D.morbidU=[];D.exileU=[];D.hand=D.hand.filter(u=>{const i=dcInst(r,u);if(i&&dcDefOf(i.d).haste){D.disc.push(u);return false}return true})};
 const add=(d,t,zone)=>{const c={u:uid(),d,t:t||DC_SIG[d]&&DC_SIG[d].type||'normal'};r.deck.push(c);dc()[zone||'hand'].push(c.u);return c};
 const play=async(d,target,side,t)=>{const c=add(d,t);dcSel=c.u;await dcGo(target,side);await W(10);return c};
 const E=(b,t,k)=>Math.floor(b*dcMult(r,t,k||'dmg')+1e-9);
 window.__pick=ids=>ids.slice(0,1);dcChooseCards=async(t,ids,min,max)=>window.__pick(ids,min,max);dcChooseFoe=async(t,skip)=>window.__foe;
 window.__opt=0;dcChooseOpt=async(t,o)=>window.__opt;window.__scry=null;dcScryUI=async(r,cards)=>{window.__scryN=cards.length;return window.__scry?window.__scry(cards):{top:cards.slice(),bottom:[]}};
 const RS=(ids)=>{reset();const D=dc();D.rel={};D.relT={};D.phoenixRet=[];D.turn=1;D.phase='player';D.whet=0;D.fortB=0;D.hitBonus=0;r.relics=ids||[];for(let k=0;k<12;k++)add('strike','normal','draw')};
 const S0=()=>dcRelSnap(r);const fin=(d,t,cost)=>{const i=add(d,t,'disc');dc().disc=dc().disc.filter(x=>x!==i.u);dc().void.push(i.u);return i};
 const after=(inst,cost,S)=>dcRelAfter(r,inst,dcDefOf(inst.d),{cost},S);
 const runPost=async()=>{if(dc().post){await dcPost();await W(10)}};
 window.__inv=0;dcHasteAvail=()=>false;
 const W2=()=>W(20);
 const shown=i=>{const el=document.querySelector('.dc-foe[data-i="'+i+'"] .dc-intent');return el?el.textContent:''};
 const num=s=>{const m=s.match(/(\d+)(?:×(\d+))?/);return m?(+m[1])*(m[2]?+m[2]:1):0};
 const boss=(sp,extra)=>{r.relics=[];r.php=r.pmax;r.tmap=null;dcStart(r,'boss',[Object.assign(makeEnemy(sp,12,{hpMul:3,atkMul:1,boss:'boss'}),{mech:sp})].concat(extra||[]));dcRender();const D=dc();D.hand=[];D.ap=20;return D.foes[0]};
 let pbR=null;const _bt=dcBeginTurn;window.dcBeginTurn=function(r,f){pbR=r.dc?r.dc.pb:null;return _bt(r,f)};
 const endT=async()=>{const php=r.php,pb=dc().pb;pbR=null;await dcEndTurn();await W2();return (pb-(pbR==null?dc().pb:pbR))+(php-r.php)};
 const reload=async()=>{const s=JSON.stringify(db.tower);db.tower=JSON.parse(s);r_x=db.tower;dcResume();await W2();return db.tower};let r_x=null;
 // ---- Aggron
 let A=boss('Aggron');ok(A.it.name==='Fortify'&&A.it.k==='block','Aggron opens with Fortify');const B=A.it.n;await endT();
 ok(A.blk===B&&A.it.name==='Siege Breaker','Fortify Block stays up · Siege Breaker next');const base=dcHits(A,{k:'atk',dmg:A.it.dmg},r)[0];
 ok(num(shown(0))===base+Math.floor(B*.5),'Siege Breaker preview = base '+base+' + half of '+B+' Block ('+num(shown(0))+')');
 {const s1=num(shown(0));await play('strike',0,'f','normal');dcRender();const s2=num(shown(0));ok(s2<s1&&s2===dcHits(A,A.it,r)[0],'A hit on its Block lowers the preview ('+s1+' → '+s2+')');
  dcStrip(r,0,Math.min(4,A.blk));dcRender();const s3=num(shown(0));ok(s3<s2,'Direct Block removal lowers it too ('+s2+' → '+s3+')');
  const blkNow=A.blk;db.tower=JSON.parse(JSON.stringify(r));Object.assign(r,db.tower);db.tower=r;dcResume();await W2();A=dc().foes[0];ok(A.blk===blkNow&&num(shown(0))===s3,'Reload keeps Aggron’s Block and preview');
  const took=await endT();ok(took===s3,'Siege Breaker resolves for the shown '+s3+' (took '+took+')');ok(A.blk===0&&A.it.name==='Fortify','Block is spent · back to Fortify')}
 // ---- Gardevoir
 let G=boss('Gardevoir',[makeEnemy('Zubat',5)]);const Z=dc().foes[1];Z.hp=Z.maxhp=999;Z.atk=1;
 ok(G.it.k==='fsmark'&&/in 2/.test(shown(0)),'Gardevoir announces Future Sight (lands in 2)');const fsShown=num(shown(0));const t0=dc().turn;
 dc().foes[1].it={k:'block',n:1};await endT();ok(G.fs&&G.fs.n===2&&G.it.name!=='Future Sight'&&/2 · \d/.test(shown(0)),'Countdown 2 with a light action this turn');
 db.tower=JSON.parse(JSON.stringify(r));Object.assign(r,db.tower);db.tower=r;dcResume();await W2();G=dc().foes[0];ok(G.fs&&G.fs.n===2,'Reload keeps the countdown');
 G.it={k:'block',n:1,name:'Reflect'};dc().foes[1].it={k:'block',n:1};await endT();ok(G.fs&&G.fs.n===1&&G.it.fs&&G.it.name==='Future Sight','Future Sight is the intent on the announced turn');
 {const s=num(shown(0));ok(s===fsShown,'Damage still matches the announcement ('+s+')');dc().foes[1].it={k:'block',n:1};const took=await endT();ok(took===s&&dc().turn===t0+3,'Future Sight lands for '+s+' on the announced turn (took '+took+')');ok(!G.fs&&G.it.k!=='fsmark','Recovery turn: no new Future Sight');dc().foes[1].it={k:'block',n:1};await endT();ok(G.it.k==='fsmark','Then it can foresee again')}
 G=boss('Gardevoir',[makeEnemy('Zubat',5)]);dc().foes[1].hp=dc().foes[1].maxhp=999;dc().foes[1].it={k:'block',n:1};await endT();G.hp=1;dcRaw(r,0,50);ok(G.hp===0,'Gardevoir defeated with Future Sight pending');{const h=r.php,pb=dc().pb;dc().foes[1].it={k:'block',n:1};await endT();dc().foes[1].it={k:'block',n:1};await endT();ok(r.php===h,'Pending Future Sight is canceled')}
 // ---- Tinkaton
 let T=boss('Tinkaton');ok(T.it.name==='Play Rough','Tinkaton: light action first');await endT();ok(T.it.hamNext&&/next/.test(shown(0)),'Hammer telegraphed a turn ahead');await endT();
 ok(T.it.name==='Gigaton Hammer'&&T.it.hits===2&&/×2/.test(shown(0)),'Gigaton Hammer: 2 separate hits shown');{const s=num(shown(0));const took=await endT();ok(took===s,'Hammer resolves for the shown '+s+' (took '+took+')')}
 ok(T.it.k==='recover'&&T.st.vuln>0,'Recovery turn: Tinkaton is Vulnerable and won’t act');{const h=T.hp;await play('strike',0,'f','normal');ok(h-T.hp===Math.floor(E(5,'normal')*1.25+1e-9),'Vulnerable: +25% damage on the recovery turn');db.tower=JSON.parse(JSON.stringify(r));Object.assign(r,db.tower);db.tower=r;dcResume();await W2();T=dc().foes[0];ok(T.it.k==='recover'&&T.st.vuln>0,'Reload keeps the recovery state');const took=await endT();ok(took===0&&T.it.name==='Play Rough','Recovery deals nothing · cycle restarts')}
 // ---- Volcarona
 let V=boss('Volcarona');V.it={k:'atk',name:'Bug Buzz',dmg:3};await endT();ok(V.it.k==='qdance','Quiver Dance announced');{const s0=V.st.str;await endT();ok(V.st.str===s0+1&&V.qd&&V.it.qd&&new RegExp('0/'+V.qd.need).test(shown(0)),'Charging: Fiery Sweep with a '+(V.qd&&V.qd.need)+' damage threshold shown')}
 {const need=V.qd.need;dcRaw(r,0,need-1);dcRender();ok(V.it.qd&&new RegExp((need-1)+'/'+need).test(shown(0)),'Threshold progress shows');db.tower=JSON.parse(JSON.stringify(r));Object.assign(r,db.tower);db.tower=r;dcResume();await W2();V=dc().foes[0];ok(V.qd&&V.qd.dealt===need-1,'Reload keeps the progress');const big=num(shown(0));dcRaw(r,0,1);dcRender();ok(!V.it.qd&&V.it.name==='Broken Dance'&&num(shown(0))<big,'Reaching it swaps the sweep for a weaker attack ('+big+' → '+num(shown(0))+')');const s=num(shown(0));const took=await endT();ok(took===s,'Weaker attack resolves as shown ('+took+')')}
 V=boss('Volcarona');V.it={k:'atk',name:'Bug Buzz',dmg:3};await endT();await endT();{const s=num(shown(0));const took=await endT();ok(took===s&&s>0,'Undisrupted Fiery Sweep hits the whole team for the shown '+s+' (took '+took+')');ok(!V.qd,'Sweep resolved')}
 // ---- Boss rooms only
 {const g=twGenMap({diff:'hard',cleared:0});const seen={};const rd=Math.random;for(const t of ['boss','event','elite']){g.start=r.floor-(g.len-1);g.row=g.len-1;g.col=0;g.rows[g.len-1][0].t=t;r.tmap=g;r.v=2;let mech=0;for(let k=0;k<40;k++){r.dc=null;r.seenHB=[];if(t==='event')r.evFight='boss';twBattle(null);if(DC_BOSSES[r.dc.foes[0].mech])mech++}seen[t]=mech}
  ok(seen.boss>5&&seen.event===0&&seen.elite===0,'Signature bosses only in Boss rooms ('+JSON.stringify(seen)+')');
  const sp=new Set();for(let k=0;k<60;k++){g.rows[g.len-1][0].t='boss';r.dc=null;twBattle(null);sp.add(r.dc.foes[0].mech?r.dc.foes[0].mech:'other')}ok(sp.has('other')&&['Aggron','Gardevoir','Tinkaton','Volcarona'].every(x=>sp.has(x)),'Other bosses stay in rotation: '+[...sp].join(', '));
  r.relics=[];g.rows[g.len-1][0].t='boss';r.dc=null;r.seenHB=['Aggron','Gardevoir','Tinkaton'];Math.random=()=>.1;twBattle(null);Math.random=rd;ok(dc().foes[0].mech==='Volcarona','Unseen signature boss picked first');dcWin(r);ok(r.offer.boss&&r.offer.boss.length===3,'Signature boss win: boss relic offer');twBossRelicPick(r.offer.boss[0]);twBossRelicPick(r.offer.boss[1]);ok(r.relics.length===1,'Boss relic only once');g.rows[g.len-1][0].t='battle';r.potions=[null,null];dcTake(null)}
 // ---- Curses
 dcStart(r,'battle',[makeEnemy('Zubat',5)]);reset();r.relics=[];dc().rel={};dc().relT={};
 {const ch=add('brokenchord','',),s=add('strike','normal');ok(dcCost(r,s)===2,'Broken Chord: first Attack costs +1');const ch2=add('brokenchord','');ok(dcCost(r,s)===2,'Two Broken Chords don’t stack');await play('strike',0,'f','normal');ok(dcCost(r,s)===1,'Only the first Attack each turn');dc().relT={};dc().hand=dc().hand.filter(u=>u!==ch.u&&u!==ch2.u);dc().disc.push(ch.u,ch2.u);ok(dcCost(r,s)===1,'Discarding it first avoids the surcharge')}
 reset();{const ss=add('sunstroke','');r.php=20;dc().foes.forEach(f=>f.it={k:'block',n:1});await dcEndTurn();await W2();ok(r.php===18,'Sunstroke: 2 HP at end of turn');const ss2=add('sunstroke','');r.php=1;dc().foes.forEach(f=>f.it={k:'block',n:1});await dcEndTurn();await W2();ok(r.php===1,'Sunstroke can’t knock you out')}
 reset();{const D=dc();D.hand=[];const a=add('guard','normal'),b2=add('strike','normal');const sp=add('sleightofpaw','','disc');D.disc=D.disc.filter(x=>x!==sp.u);D.draw.unshift(sp.u);dcDrawN(r,1);ok(D.hand[0]===b2.u&&D.draw.at(-1)===a.u&&!D.disc.includes(a.u),'Sleight of Paw: leftmost card to the bottom, not discarded');D.hand=D.hand.filter(x=>x!==sp.u);D.draw.unshift(sp.u);dcDrawN(r,1);ok(D.hand.includes(b2.u),'Only the first draw each fight');
  D.hand=[];D.hand.push(...[]);const sp2=add('sleightofpaw','','disc');D.disc=D.disc.filter(x=>x!==sp2.u);D.draw.unshift(sp2.u);dcDrawN(r,1);ok(D.hand.length===1,'Empty hand: nothing moves')}
 {const n=r.deck.filter(c=>DC_STATUS[c.d]&&DC_STATUS[c.d].curse).length;dcStart(r,'battle',[makeEnemy('Zubat',5)]);const D=dc();const all=[...D.draw,...D.hand];ok(r.deck.filter(c=>DC_STATUS[c.d]&&DC_STATUS[c.d].curse).every(c=>all.includes(c.u))&&n>0,'Curses return for the next fight ('+n+')')}
 {const D=dc();const cs=add('cleanslate','fairy');const cu=add('brokenchord','');const st=D.hand.filter(x=>{const i=dcInst(r,x);return i&&DC_STATUS[i.d]&&!DC_STATUS[i.d].curse});ok(!st.includes(cu.u),'Clean Slate can’t Exile a curse')}
 {r.dc=null;const cur=r.deck.find(c=>c.d==='brokenchord');r.tickets=99;r.room={t:'shop'};twShopOpen();await W2();window.__pick=()=>[cur.u];const pr=r.room.rm;await twShopRemove();ok(!r.deck.includes(cur)&&r.tickets===99-pr&&r.room.rmDone===1,'Merchant removal takes a curse ('+pr+' 🎟️)');r.room=null;window.__pick=ids=>ids.slice(0,1)}
 // ---- Potions
 r.potions=null;ok(JSON.stringify(twPots(r))==='[null,null]','Two empty potion slots');
 const keep=TW_POTION_DROP.battle;TW_POTION_DROP.battle=1;
 for(let k=0;k<2;k++){dcStart(r,'battle',[makeEnemy('Zubat',5)]);dcWin(r);dcRwTake('pot');dcTake(null)}ok(r.potions.every(Boolean),'Drops fill empty slots');
 const before=r.potions.slice();dcStart(r,'battle',[makeEnemy('Zubat',5)]);dcWin(r);await new Promise(q=>setTimeout(q,30));dcRwTake('pot');ok(r.offer.potion&&!!document.querySelector('.tw-potrow'),'Full slots: replace-or-leave screen');
 {const pend=r.offer.potion;db.tower=JSON.parse(JSON.stringify(r));Object.assign(r,db.tower);db.tower=r;dcResume();await W2();ok(r.offer.potion===pend&&!!document.querySelector('.dc-vict'),'Reload restores the same potion offer');dcRwTake('pot');
  twPotionPick(1);twPotionPick(0);ok(r.potions[0]===before[0]&&r.potions[1]===pend&&r.offer.potDone===1&&!!document.querySelector('.dc-vict'),'Replace slot 2, once · then back to the victory screen');dcTake(null)}
 {dcStart(r,'battle',[makeEnemy('Zubat',5)]);dcWin(r);const was=r.potions.slice();twPotionPick(null);twPotionPick(0);ok(JSON.stringify(r.potions)===JSON.stringify(was),'Leave it: inventory unchanged, no duplicate');dcTake(null)}
 TW_POTION_DROP.battle=keep;{let n=0;for(let k=0;k<4000;k++)if(twPotionDrop('battle'))n++;ok(Math.abs(n/4000-TW_POTION_DROP.battle)<.03&&!twPotionDrop('boss'),'Drop rate '+(n/40).toFixed(1)+'% after normal fights · none from bosses')}
 dcStart(r,'battle',[makeEnemy('Zubat',5),makeEnemy('Zubat',5)]);dcRender();reset();const D=dc();D.phase='player';dcLock=false;
 const usePot=async(id,k)=>{r.potions=[id,null];const ok0=D.ok,pl=D.plays,ao=D.atkOk;await twPotionUse(0);return r.potions[0]===null&&D.ok===ok0&&D.plays===pl&&D.atkOk===ao};
 r.php=r.pmax-20;ok(await usePot('potion')&&r.php===r.pmax-12,'Potion: heal 8 · not a card play');
 ok(await usePot('guardtonic')&&D.pb===10,'Guard Tonic: 10 Block');{const a=D.ap;ok(await usePot('aptonic')&&D.ap===a+1,'AP Tonic: +1 AP')}
 {const n=D.hand.length;ok(await usePot('focustonic')&&D.hand.length===n+2,'Focus Tonic: draw 2')}
 D.pst.weak=2;D.pst.vuln=1;window.__opt=0;ok(await usePot('fullheal')&&D.pst.weak===0&&D.pst.vuln===1,'Full Heal: clears all stacks of the chosen debuff');
 D.pst.weak=0;D.pst.vuln=0;D.pburn=0;D.pst.toxin=0;D.pst.enf=0;r.potions=['fullheal',null];ok(!twPotCan(r,'fullheal'),'Full Heal unavailable with no debuffs');
 window.__foe=null;r.potions=['exposuretonic',null];await twPotionUse(0);ok(r.potions[0]==='exposuretonic','Canceling the target keeps the potion');window.__foe=1;await twPotionUse(0);ok(r.potions[0]===null&&F(1).st.vuln===2,'Exposure Tonic: Vulnerable 2 on the chosen enemy');
 r.potions=['potion',null];D.phase='enemy';ok(!twPotCan(r,'potion'),'No potions during the enemy turn');D.phase='player';D.pend={u:'x'};ok(!twPotCan(r,'potion'),'No potions while a card is resolving');D.pend=null;
 ok(!!document.querySelector('.dc-pots'),'Potion slots show in combat');
 return out.join('\n')});console.log(R);console.log('errs',errs.slice(0,6));await b.close()})();
