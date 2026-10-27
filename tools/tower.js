// ===================== BATTLE TOWER =====================
// Battles back to back: no map, rooms or rests. A boss waits every 10th floor. Battles can drop Tickets and battle items
// into the run bag. Every 5 floors you choose a perk, and every 10 floors the environment changes. Uses the same battle
// engine as Mystery Dungeon (runOf() points at db.tower while you're in the Tower). Leftover Tickets become Cogs at the end.
var dgMode='dungeon',dgPickFor='dungeon';
const TW_ENVS={
 electric:{name:'Electric Workshop',icon:'⚡',desc:'Electric-type moves deal 30% more damage.',boost:{electric:1.3},plat:'#7d8799'},
 grass:{name:'Grass Jungle',icon:'🌿',desc:'Grass-type moves deal 30% more damage.',boost:{grass:1.3},plat:'#6aa04d'},
 misty:{name:'Misty World',icon:'🌸',desc:'Fairy-type moves deal 30% more damage.',boost:{fairy:1.3},plat:'#e9bcdc'},
 psychic:{name:'Psychic Mindscape',icon:'🔮',desc:'Psychic-type moves deal 30% more damage.',boost:{psychic:1.3},plat:'#a95fbe'},
 concrete:{name:'Concrete Jungle',icon:'🏙️',desc:'Grass- and Rock-type moves deal 15% more damage.',boost:{grass:1.15,rock:1.15},plat:'#9a9aa2'},
 wilds:{name:'Vicious Wilds',icon:'🐾',desc:'Multi-hit moves only hit once.',single:true,plat:'#96683f'},
 holy:{name:'Holy Sanctum',icon:'🕊️',desc:'At the end of your turn, your Pokémon heal 2 HP.',heal:2},
 sludge:{name:'Sludge Hell',icon:'☣️',desc:'After both sides have moved, the floor bubbles: 1 damage to every Pokémon that isn’t Poison or Steel type.',chip:{d:1,safe:['poison','steel'],icon:'☣️'}},
 dragon:{name:'Dragon Cavern',icon:'🐉',desc:'Dragon-type Pokémon take 10% less damage from all attacks.',dragon:true},
 legend:{name:'Legend’s Temple',icon:'🏛️',desc:'Legendary Pokémon take 5% less damage and deal 10% more damage.',legend:true},
 trepid:{name:'Trepidation Habitat',icon:'🌊',desc:'Water-type attacks deal extra damage equal to 5% of the attacker’s max HP.',water:true},
 sleepless:{name:'Sleepless Hollow',icon:'🌙',desc:'Items can’t be used.',noItems:true},
 dank:{name:'Dank Depths',icon:'🦇',desc:'Dark-types dodge as if they had +4 Speed. Foe Dark-types can dodge your attack: 20% after a Make-Up answer, 40% after a wrong one.',dank:true},
 crystal:{name:'Crystal Mines',icon:'💎',desc:'Rock- and Ground-type foes are more common. After both sides have moved, every Pokémon that isn’t Ground, Steel or Rock type takes 1 damage.',chip:{d:1,safe:['ground','steel','rock'],icon:'💎'},rockFoes:true},
 snow:{name:'Snowscape',icon:'❄️',desc:'Ice-types take 10% less damage from attacks.',ice:true},
 dice:{name:'Dice Arena',icon:'🎲',desc:'Moves that hit 2–5 times always hit at least 3 times.',dice:true},
 spook:{name:'Spook Zone',icon:'👻',desc:'Every attack heals the attacker 10% of each hit’s damage (rounded down, at least 1 HP per hit).',spook:true},
 king:{name:'King’s Battlefield',icon:'👑',desc:'The highest-level Pokémon on each side glows gold: it deals 15% more damage and takes 5% less. If it faints, each of its teammates loses 20% of their max HP.',king:true},
 center:{name:'Pokémon Center',icon:'🏥',desc:'Revived Pokémon get back up with 15% of their max HP instead of 1 HP.',center:true},
 lifeblock:{name:'Lifeblock Gym',icon:'🧱',desc:'Guarding also heals the guard for half the Stamina it gains (rounded down).',lifeblock:true}};
const TW_PERKS={
 meal:{icon:'🍲',name:'Hot Meal',desc:'Heal every Pokémon 50% of its HP (fainted ones get back up with 25%).'},
 revive:{icon:'💫',name:'Revival Herb',desc:'Every fainted Pokémon gets back up with 50% HP.'},
 power:{icon:'💪',name:'Power Charm',desc:'+10% damage for the rest of the run.'},
 guard:{icon:'🛡️',name:'Iron Shell',desc:'Take 10% less damage for the rest of the run (up to 30%).'},
 battery:{icon:'🔋',name:'Battery Pack',desc:'Every battle starts with +20 Stamina for each Pokémon.'},
 lucky:{icon:'🍀',name:'Lucky Ticket',desc:'+25% Tickets from battles for the rest of the run.'},
 supply:{icon:'📦',name:'Supply Drop',desc:'2 random battle items right now.'}};
const TW_CHAL={
 noitem:{t:'Win without using a battle item',ok:b=>!b.usedItem},
 q4:{t:'Answer 4 questions right on the first try this battle',ok:b=>(b.qFull||0)>=4},
 nofaint:{t:'Win without any of your Pokémon fainting',ok:b=>!b.koAny},
 quick:{t:'Win within 6 rounds',ok:b=>b.round<=6}};
function twEnvKey(r){r=r||runOf();if(!r||!r.envs)return 'electric';if(r.envs.length<Object.keys(TW_ENVS).length){const miss=Object.keys(TW_ENVS).filter(k=>!r.envs.includes(k));r.envs.push(...shuffle(miss))}return r.envs[Math.floor(Math.max(0,(r.floor||1)-1)/10)%r.envs.length]}
function twEnv(r){return TW_ENVS[twEnvKey(r)]}
// hooks used by the battle engine (always 1 / false outside the Tower)
function dgEnvMult(type){const r=runOf();if(!r||!r.tower)return 1;const e=twEnv(r);return (e.boost&&e.boost[String(type).toLowerCase()])||1}
function dgEnvSingle(){const r=runOf();return !!(r&&r.tower&&twEnv(r).single)}
function twPowMult(){const r=runOf();return r&&r.tower?1+.1*((r.perks||{}).power||0):1}
function dgFoeMult(type){const r=runOf();if(!r||!r.tower)return 1;return dgEnvMult(type)*(1-Math.min(.3,.1*((r.perks||{}).guard||0)))}
function twStats(){return db.towerStats||(db.towerStats={best:0,bosses:0,runs:0,floors:0,challenges:0,bestAt:null})}
// ---------- entry & setup ----------
function towerEntry(){const r=db.tower,S=twStats(),rec='<div class="tw-rec"><div><b>'+S.best+'</b><small>Top floor</small></div><div><b>'+S.bosses+'</b><small>Bosses beaten</small></div><div><b>'+S.challenges+'</b><small>Challenges won</small></div><div><b>'+S.runs+'</b><small>Runs</small></div></div>';
 if(r){modal('🗼 BATTLE TOWER',rec+'<div class="notice">Run in progress: floor '+r.floor+' with '+r.party.length+' Pokémon.</div><div class="actions"><button class="btn" onclick="if(confirm(\'End this run? Leftover Tickets become Cogs.\')){closeModal();dgMode=\'tower\';twEnd(true)}">END RUN</button><button class="btn red" onclick="closeModal();dgOpen(\'tower\')">CONTINUE</button></div>');return}
 modal('🗼 BATTLE TOWER',rec+'<p class="small">Battles back to back with no breaks. A boss waits every 10th floor, every 5 floors you pick a perk, and every 10 floors the environment changes. Battles can drop Tickets and items. Leftover Tickets become Cogs when the run ends.</p><div class="actions"><button class="btn red" onclick="closeModal();dgPickFor=\'tower\';dgPick=[];dgPickParty()">CHOOSE A TEAM</button></div>')}
function twSetupSets(){const sets=db.summaries.filter(s=>termsFor(s).length+(s.quiz?s.quiz.length:0)+prOf(s).length>0);if(!sets.length){modal('BATTLE TOWER','<div class="notice">The Tower asks questions from your study sets. Add a summary first.</div>');return}
 modal('STUDY SETS','<div class="mg-sets">'+sets.map(s=>'<label><input type="checkbox" value="'+s.id+'" checked> <span>'+esc(s.title)+'<small>'+(termsFor(s).length+(s.quiz?s.quiz.length:0))+' items</small></span></label>').join('')+'</div><p class="small" style="margin-top:10px">Study mode</p><div class="mg-modes"><label><input type="radio" name="mgm" value="smart" checked> <b>Smart Study</b></label><label><input type="radio" name="mgm" value="learn"> <b>Learn</b></label><label><input type="radio" name="mgm" value="weak"> <b>Review Weak Points</b></label></div><div class="actions"><button class="btn red" onclick="twStartRun()">ENTER THE TOWER</button></div>')}
function twStartRun(){const sids=[...document.querySelectorAll('.mg-sets input:checked')].map(x=>x.value),mode=(document.querySelector('input[name=mgm]:checked')||{}).value||'smart';if(!sids.length){toast('Pick at least one study set');return}
 if(mode==='weak'&&!sids.some(id=>(db.learned||{})[id])){toast('Finish Learn mode on one of these sets first');return}if(!mgPicker(mgBank(sids),mode).bank.length){toast('No questions for that mode here');return}
 db.tower={tower:true,diff:'balanced',style:'game',sids,mode,party:dgPick.map(id=>{const p=db.pokemon.find(x=>x.id===id),c=combatant(p);return {id,hp:c.hp,energy:20,starf:null}}),floor:0,cleared:0,bag:{oran:2},tickets:0,cogs:0,studyMs:0,rooms:0,startedAt:stamp(),slider:true,battle:null,
  envs:shuffle(Object.keys(TW_ENVS)),perks:{},perkDone:[],bosses:0,challengesWon:0,log:[]};dgPick=[];dgPickFor='dungeon';save();closeModal();go('minigames');dgOpen('tower')}
// ---------- floors ----------
function twPanel(){const r=runOf();return '<div class="dg-row"><span>⏱ <b id="dgTime">'+fmtMin(r.studyMs)+'</b></span><span>🗼 '+(r.floor||1)+'F</span><span>🎟️ '+(r.tickets||0)+'</span><span>'+twEnv(r).icon+'</span></div><div class="dg-partyrow">'+r.party.map((m,i)=>{const p=partyMon(m),c=combatant(p);return '<div class="dg-mini" style="--c:'+SLOT_COLORS[i]+'">'+monSprite(p,'',34)+'<span><i style="width:'+Math.max(0,m.hp/c.hp*100)+'%"></i></span><small>'+m.hp+'/'+c.hp+' · ⚡'+m.energy+'</small></div>'}).join('')+'</div><div class="dg-bag">'+(Object.keys(r.bag).filter(k=>r.bag[k]>0).map(k=>'<span title="'+DITEMS[k].name+'">'+DITEMS[k].icon+'×'+r.bag[k]+'</span>').join('')||'<span class="small muted">No items</span>')+'</div>'+(Object.keys(r.perks||{}).length?'<div class="tw-perks">'+Object.entries(r.perks).map(([k,n])=>'<span title="'+TW_PERKS[k].name+'">'+TW_PERKS[k].icon+(n>1?'×'+n:'')+'</span>').join('')+'</div>':'')+'<div class="dg-row"><button class="btn smallbtn" onclick="dgSettings()">⚙</button><button class="btn smallbtn" onclick="dgSaveExit()">💾 SAVE & EXIT</button></div>'}
// after a win (or when opening a run between floors): perk every 5 floors, then the next floor
function twNext(){const r=runOf();if(!r)return;if(r.cleared&&r.cleared%5===0&&!r.perkDone.includes(r.cleared)){twPerkPick();return}twClimb(r.cleared+1)}
function twFloor(f){const r=runOf();r.floor=f;save();const st=$('dgStage');if(!st)return;const newEnv=(f-1)%10===0,boss=f%10===0;
 if(twIsShop(r,f)){r.rooms=f;r.battle=null;save();dgShop();return}
 if(boss&&!r.chalOffered){r.chalOffered=f;const k=shuffle(Object.keys(TW_CHAL).filter(c=>!(c==='noitem'&&twEnv(r).noItems)))[0];r.chalPick=k;save();
  st.innerHTML='<div class="dg-room tw-room" style="background-image:url(./assets/tower/'+twEnvKey(r)+'.jpg)"><span class="dg-big">👑</span><h3>Floor '+f+': Boss floor!</h3><p class="small">Optional challenge for bonus loot (extra Tickets, a rare item and a Rare Candy):</p><div class="notice">🎯 '+TW_CHAL[k].t+'</div><div class="actions"><button class="btn" onclick="twGo(null)">SKIP</button><button class="btn red" onclick="twGo(\''+k+'\')">ACCEPT</button></div></div>';$('dgPanel').innerHTML=twPanel();return}
 if(newEnv&&r.envShown!==f){r.envShown=f;save();const e=twEnv(r);st.innerHTML='<div class="dg-room tw-room" style="background-image:url(./assets/tower/'+twEnvKey(r)+'.jpg)"><span class="dg-big">'+e.icon+'</span><h3>'+e.name+'</h3><p>'+e.desc+'</p><p class="small">Floors '+f+'–'+(f+9)+'</p><button class="btn red" onclick="twFloor('+f+')">FIGHT ▶</button></div>';$('dgPanel').innerHTML=twPanel();return}
 twBattle(boss?r.chalPick&&r.chalAccepted===f?r.chalPick:null:null)}
function twGo(ch){const r=runOf();if(ch)r.chalAccepted=r.floor;save();twBattle(ch)}
function twBattle(ch){const r=runOf(),f=r.floor,avg=partyAvgLv(),boss=f%10===0,en=[],k=Math.min(4,Math.floor(f/12)),lvl=avg+Math.floor(f*.6)-2,hp=1.25+f*.03,atk=1.05+f*.012,rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));let kind='battle';
 if(boss)kind=f>=30&&Math.random()<.35?'alpha':f>=10&&Math.random()<.4?'totem':'boss';else if(f>2&&Math.random()<.15)kind='swarm';
 if(kind==='battle'){const n=rnd(1,Math.min(4,2+Math.floor(f/8)));for(let i=0;i<n;i++)en.push(makeEnemy(twSp(0,Math.min(4,1+k)),Math.max(1,lvl+rnd(-3,2)),{hpMul:hp,atkMul:atk}))}
 else if(kind==='swarm'){const sp=twSp(0,Math.min(1,k)),n=rnd(4,6);for(let i=0;i<n;i++)en.push(makeEnemy(sp,Math.max(1,lvl-5+rnd(-2,1)),{hpMul:hp*.6,atkMul:atk*.8}))}
 else{const evolved=MONS.filter(m=>PRE_EVO[m[0]]&&m[2]>=1),sp=kind==='boss'?speciesOfTier(2,4):evolved[Math.floor(Math.random()*evolved.length)][0],bh=3.2*(1+f/40);
  if(kind==='alpha')en.push(makeEnemy(sp,lvl+4,{hpMul:bh*1.2,atkMul:atk*1.3,boss:'alpha',twice:true}));
  else{en.push(makeEnemy(sp,lvl+3,{hpMul:bh*(kind==='totem'?.85:1),atkMul:atk*1.2,boss:kind}));if(kind==='totem'){const pre=PRE_EVO[sp]||sp;for(let i=0;i<rnd(2,3);i++)en.push(makeEnemy(pre,lvl-1,{hpMul:hp*.8,atkMul:atk}))}}}
 const bat=20*((r.perks||{}).battery||0);if(bat)r.party.forEach(m=>{if(m.hp>0)m.energy=Math.min(100,m.energy+bat)});r.party.forEach(q=>{delete q.hurt;delete q.hurtR;delete q.koR});
 r.battle={kind,enemies:en,turn:0,round:1,overclock:0,skip:false,guard:{},done:false,challenge:ch||null};twCrown(r,r.battle);if(DG)DG.msg='';save();dgDrawBattle(true)}
// ---------- loot ----------
function twItem(minTier){const pool=Object.keys(DITEMS).filter(id=>(DITEMS[id].tier||0)>=(minTier||0)).map(id=>({id,w:[10,7,4,1.2][DITEMS[id].tier||0]}));return pickWeighted(pool).id}
function twWin(){const r=runOf(),b=r.battle,f=r.floor,boss=b.kind!=='battle'&&b.kind!=='swarm',got=[],luck=1+.25*((r.perks||{}).lucky||0);
 let tix=b.kind==='swarm'?5+Math.floor(f/4):boss?12+Math.floor(f/2)+(b.kind!=='boss'?5:0):3+Math.floor(f/4);tix=Math.round(tix*luck);
 const items=[];if(boss){items.push(twItem(1),twItem(0))}else if(Math.random()<(b.kind==='swarm'?.45:.3))items.push(twItem(0));
 let candy=boss&&Math.random()<.3?1:0;
 if(b.challenge){const C=TW_CHAL[b.challenge];if(C.ok(b)){tix*=2;items.push(twItem(2));candy++;r.challengesWon=(r.challengesWon||0)+1;got.push('🎯 Challenge complete: '+C.t+'!')}else got.push('🎯 Challenge missed: '+C.t)}
 r.tickets=(r.tickets||0)+tix;r.cogs=(r.cogs||0)+tix;got.push('+'+tix+' 🎟️ Tickets');items.forEach(k=>{r.bag[k]=(r.bag[k]||0)+1;got.push(DITEMS[k].icon+' '+DITEMS[k].name)});if(candy){db.candies=(db.candies||0)+candy;got.push('🍬 Rare Cand'+(candy>1?'ies ×'+candy:'y'))}
 const exp=Math.round((boss?4500:b.kind==='swarm'?2000:1500)*(1+.06*f));r.party.forEach(m=>{const p=partyMon(m);if(p)p.pxp=(p.pxp||0)+exp});got.push('Team +'+exp.toLocaleString()+' EXP each');
 if(boss)r.bosses=(r.bosses||0)+1;
 if(b.kind==='totem'||b.kind==='alpha'){const big=b.enemies[0],sp=PRE_EVO[big.species]||big.species,m=dgBossMon(sp,b.kind),e=giveMon(m);got.push('🎁 '+(e.shiny?'✨ Shiny ':'')+e.species+' joined your Box!')}
 r.cleared=f;r.battle=null;r.chalOffered=0;const S=twStats();if(f>S.best){S.best=f;S.bestAt=stamp()}if(DG)DG.msg='';save();if(!$('dgStage'))return;
 $('dgStage').innerHTML='<div class="dg-room tw-room" style="background-image:url(./assets/tower/'+twEnvKey(r)+'.jpg)"><span class="dg-big">'+(boss?'👑':'🏆')+'</span><h3>Floor '+f+' cleared!</h3><p>'+got.join('<br>')+'</p><button class="btn red" onclick="twNext()">▶ FLOOR '+(f+1)+'</button></div>';$('dgPanel').innerHTML=twPanel()}
// ---------- perks ----------
function twPerkPick(){const r=runOf(),down=r.party.some(m=>m.hp<=0),opts=shuffle(Object.keys(TW_PERKS).filter(k=>!(k==='revive'&&!down)&&!(k==='guard'&&((r.perks||{}).guard||0)>=3))).slice(0,3);r.perkOpts=opts;save();
 $('dgStage').innerHTML='<div class="dg-room tw-room" style="background-image:url(./assets/tower/'+twEnvKey(r)+'.jpg)"><span class="dg-big">✨</span><h3>Choose a perk</h3><p class="small">Floor '+r.cleared+' reached. Pick one:</p><div class="tw-perkpick">'+opts.map(k=>'<button class="btn" onclick="twPerk(\''+k+'\')"><b>'+TW_PERKS[k].icon+' '+TW_PERKS[k].name+'</b><small>'+TW_PERKS[k].desc+'</small></button>').join('')+'</div></div>';$('dgPanel').innerHTML=twPanel()}
function twPerk(k){const r=runOf();if(!r||!TW_PERKS[k]||r.perkDone.includes(r.cleared))return;r.perkDone.push(r.cleared);
 if(k==='meal')r.party.forEach(m=>{const c=combatant(partyMon(m));m.hp=Math.min(c.hp,m.hp>0?m.hp+Math.ceil(c.hp*.5):Math.ceil(c.hp*.25))});
 else if(k==='revive')r.party.forEach(m=>{if(m.hp<=0)m.hp=Math.ceil(combatant(partyMon(m)).hp*.5)});
 else if(k==='supply'){for(let i=0;i<2;i++){const it=twItem(0);r.bag[it]=(r.bag[it]||0)+1}}
 else r.perks[k]=(r.perks[k]||0)+1;
 save();toast(TW_PERKS[k].icon+' '+TW_PERKS[k].name+'!');twClimb(r.cleared+1)}
// ---------- the end ----------
function twLoseScreen(){const r=runOf();r.battle=null;save();if(!$('dgStage'))return;$('dgStage').innerHTML='<div class="dg-room tw-room" style="background-image:url(./assets/tower/'+twEnvKey(r)+'.jpg)"><span class="dg-big">💤</span><h3>Your team fainted on floor '+r.floor+'</h3><p>You cleared '+(r.cleared||0)+' floor'+(r.cleared===1?'':'s')+'. Leftover Tickets become Cogs.</p><button class="btn red" onclick="twEnd(false)">LEAVE THE TOWER</button></div>';$('dgPanel').innerHTML=''}
function twEnd(quit){const r=db.tower;if(!r)return;const tix=Math.max(0,Math.round(r.tickets||0)),S=twStats();db.cogs=Math.round(db.cogs+tix);S.runs++;S.bosses+=r.bosses||0;S.challenges+=r.challengesWon||0;S.floors+=r.cleared||0;const newBest=(r.cleared||0)>=S.best&&(r.cleared||0)>0;S.best=Math.max(S.best,r.cleared||0);grantXp(10+2*(r.cleared||0));
 const lines=[quit?'Run ended on floor '+r.floor+'.':'Run over.','🗼 Floors cleared: '+(r.cleared||0)+(newBest?' · 🏅 personal best!':''),'👑 Bosses beaten: '+(r.bosses||0),'🎯 Challenges won: '+(r.challengesWon||0),'🎟️ Tickets earned: '+(r.cogs||0)+' · '+tix+' left over → +'+tix+' Cogs','Time studying: '+fmtMin(r.studyMs)];
 db.tower=null;save();if(mgState)mgState.stop&&mgState.stop();mgState=null;dgMode='dungeon';render();
 const el=$('mgArea');if(el)el.innerHTML='<div class="reveal mg-end"><h2>🗼 Battle Tower</h2>'+lines.map(l=>'<p>'+l+'</p>').join('')+'<p class="small muted">Records: top floor '+S.best+' · bosses '+S.bosses+' · challenges '+S.challenges+' · runs '+S.runs+'</p><div class="actions"><button class="btn" onclick="mgQuit()">MENU</button></div></div>'}
// ---------- shop floors ----------
// one floor in every 10 (somewhere between its 3rd and 8th floor) is a Kecleon Shop instead of a battle
function twIsShop(r,f){if(f<3||f%10===0)return false;const b=Math.floor((f-1)/10);r.shops=r.shops||{};if(r.shops[b]==null){r.shops[b]=b*10+3+Math.floor(Math.random()*6);save()}return f===r.shops[b]}
function twShopDone(){const r=runOf();if(!r)return;r.cleared=Math.max(r.cleared||0,r.floor);const S=twStats();if(r.cleared>S.best){S.best=r.cleared;S.bestAt=stamp()}save();twNext()}
function twKind(r,f){return f%10===0?'boss':twIsShop(r,f)?'shop':'battle'}
// ---------- climbing between floors ----------
// The camera zooms out to show the tower, your team rides up one floor, a banner says what's next (a shop, a boss, a new
// environment), then the camera zooms back in on the new floor. Tap to skip.
const TW_SLAB=84,TW_GAP=8;
async function twClimb(to){const r=runOf(),st=$('dgStage');if(!r||!st)return;const from=Math.max(0,to-1),ep=dgEpoch;
 if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches){twFloor(to);return}
 const lo=Math.max(0,from-3),hi=to+3,K={battle:['⚔️','Battle'],boss:['👑','Boss'],shop:['🛒','Kecleon Shop']},env=n=>TW_ENVS[r.envs[Math.floor(Math.max(0,n-1)/10)%r.envs.length]];
 let slabs='';for(let n=hi;n>=lo;n--){if(n===0){slabs+='<div class="tw-slab ground" data-n="0"><b>🏁 Entrance</b></div>';continue}const k=twKind(r,n),e=env(n),done=n<=(r.cleared||0);
  slabs+='<div class="tw-slab'+(n===to?' next':'')+(done?' done':'')+(k==='boss'?' boss':'')+'" data-n="'+n+'" style="background-image:url(./assets/tower/'+r.envs[Math.floor((n-1)/10)%r.envs.length]+'.jpg)"><b>'+n+'F</b><span>'+(done?'✓':K[k][0]+' '+K[k][1])+'</span><i>'+e.icon+'</i></div>'}
 const team=r.party.map(m=>{const p=partyMon(m);return monSprite(p,m.hp<=0?'ko':'',30)}).join('');
 const nk=twKind(r,to),newEnv=(to-1)%10===0,e=env(to),msg=[];if(newEnv){msg.push(e.icon+' <b>'+e.name+'</b><small>'+e.desc+'</small>');r.envShown=to}if(nk==='boss')msg.push('👑 <b>Boss floor!</b>');else if(nk==='shop')msg.push('🛒 <b>Kecleon Shop</b><small>Spend your Tickets before the next battle.</small>');else if(!newEnv)msg.push('⚔️ <b>Floor '+to+'</b>');save();
 st.innerHTML='<div class="tw-climb"><div class="tw-cam"><div class="tw-stack">'+slabs+'</div><div class="tw-team">'+team+'</div></div><div class="tw-banner">'+msg.join('')+'</div><small class="tw-skip">Tap to skip</small></div>';$('dgPanel').innerHTML=twPanel();
 const box=st.querySelector('.tw-climb'),cam=box.querySelector('.tw-cam'),stack=box.querySelector('.tw-stack'),ban=box.querySelector('.tw-banner'),H=box.clientHeight,step=TW_SLAB+TW_GAP;
 // the stack is listed top floor first, so floor n sits (hi-n) slabs from the top
 const yFor=n=>Math.round(H/2-((hi-n)*step+TW_SLAB/2)),place=n=>'translateY('+yFor(n)+'px)';stack.style.transform=place(from);
 let skip=false;const gone=()=>ep!==dgEpoch||runOf()!==r;box.addEventListener('click',()=>{skip=true;box.getAnimations({subtree:true}).forEach(a=>a.finish())});
 const run=(el,kf,o)=>skip?Promise.resolve():el.animate(kf,Object.assign({fill:'forwards'},o)).finished.catch(()=>{});
 await run(cam,[{transform:'scale(3.4)',opacity:.4},{transform:'scale(1)',opacity:1}],{duration:650,easing:'cubic-bezier(.2,.8,.3,1)'});if(gone())return;
 await run(stack,[{transform:place(from)},{transform:place(to)}],{duration:900,easing:'cubic-bezier(.45,0,.25,1)'});if(gone())return;
 stack.querySelector('[data-n="'+to+'"]')?.classList.add('arrive');
 await run(ban,[{opacity:0,transform:'translate(-50%,10px)'},{opacity:1,transform:'translate(-50%,0)'}],{duration:280});
 for(let t=0;t<(newEnv||nk!=='battle'?1150:550)&&!skip;t+=50)await dgSleep(50);if(gone())return;
 run(ban,[{opacity:1},{opacity:0}],{duration:250});await run(cam,[{transform:'scale(1)',opacity:1},{transform:'scale(3.4)',opacity:0}],{duration:600,easing:'cubic-bezier(.6,0,.8,.4)'});
 if(ep!==dgEpoch||runOf()!==r)return;twFloor(to)}
// ---------- environment effects that need more than a damage multiplier ----------
// (all of these do nothing outside the Tower)
const twIsType=(types,t)=>(types||[]).some(x=>String(x).toLowerCase()===t),twLegend=sp=>!!(INDEX[sp]&&INDEX[sp].tier===4);
function twOn(){const r=runOf();return r&&r.tower?twEnv(r):null}
// the attacker's damage boost (Legend's Temple) and the target's damage cut (Dragon Cavern, Legend's Temple)
function dgEnvAtk(types,sp,u){const e=twOn();if(!e)return 1;let k=1;if(e.legend&&twLegend(sp))k*=1.1;if(e.king&&u&&u.king)k*=1.15;return k}
function dgEnvDef(types,sp,u){const e=twOn();if(!e)return 1;let k=1;if(e.dragon&&twIsType(types,'dragon'))k*=.9;if(e.legend&&twLegend(sp))k*=.95;if(e.ice&&twIsType(types,'ice'))k*=.9;if(e.king&&u&&u.king)k*=.95;return k}
// Trepidation Habitat: a Water-type attacker adds 5% of its max HP to each hit target
function dgEnvFlat(types,maxhp){const e=twOn();return e&&e.water&&twIsType(types,'water')?Math.max(1,Math.round(maxhp*.05)):0}
function dgEnvNoItems(){const e=twOn();return !!(e&&e.noItems)}
// a foe's hit on your team, after the usual damage cap
function twFoeHit(raw,e,types,sp,u){twCur=twOn()?{att:e,types}:null;if(!twOn()||raw<=0)return raw;return Math.max(1,Math.round(raw*dgEnvAtk(e.types,e.species,e)*dgEnvDef(types,sp,u)))+dgEnvFlat(e.types,e.maxhp)}
// Holy Sanctum: your team heals when your turn ends
function twTurnEnd(r,b){const e=r&&r.tower?twEnv(r):null;if(!e||!e.heal)return;r.party.forEach((m,i)=>{if(m.hp<=0)return;const c=combatant(partyMon(m)),h=Math.min(e.heal,c.hp-m.hp);if(h>0){m.hp+=h;setTimeout(()=>dgFloat('.dg-ally[data-i="'+i+'"]','+'+h+' 🕊️','heal'),60)}})}
// Sludge Hell and Crystal Mines: after both sides have moved, everyone without a safe type takes 1 damage
function twRoundEnd(r,b){twCur=null;const e=r&&r.tower?twEnv(r):null;if(!e||!e.chip)return;const C=e.chip,safe=t=>C.safe.some(x=>twIsType(t,x));
 r.party.forEach((m,i)=>{if(m.hp<=0)return;const c=combatant(partyMon(m));if(safe(c.types))return;m.hp=Math.max(0,m.hp-C.d);dgHurt(b,m,C.d);dgFloat('.dg-ally[data-i="'+i+'"]','-'+C.d+' '+C.icon,'weak')});
 b.enemies.forEach((f,i)=>{if(f.hp<=0||safe(f.types))return;f.hp=Math.max(0,f.hp-C.d);dgFloat('.dg-foe[data-i="'+i+'"]','-'+C.d+' '+C.icon,'weak')});twKingCheck(r,b)}
// Dice Arena
function dgEnvDice(){const e=twOn();return !!(e&&e.dice)}
// Dank Depths: Dark-types on your team dodge as if 4 Speed faster; foe Dark-types can dodge after a Make-Up or wrong answer
let twCur=null;
function twDodgeBonus(){const e=twOn();return e&&e.dank&&twCur&&twIsType(twCur.types,'dark')?4:0}
function twDarkDodge(b,f){const e=twOn();if(!e||!e.dank||!twIsType(f.types,'dark'))return '';const p=b.lastRes==='makeup'?.2:b.lastRes==='fail'?.4:0;return Math.random()<p?'💨 '+f.species+' slipped away into the dark!':''}
// Spook Zone: attackers heal 10% of each hit (rounded down, at least 1)
function twSpookHeal(m,maxhp,parts){const e=twOn();if(!e||!e.spook||m.hp<=0)return 0;const h=Math.min(maxhp-m.hp,parts.reduce((a,d)=>a+(d>0?Math.max(1,Math.floor(d*.1)):0),0));if(h>0)m.hp+=h;return Math.max(0,h)}
function twSpookFoe(d){const e=twOn();if(!e||!e.spook||!twCur||!twCur.att||d<=0)return;const f=twCur.att,h=Math.min(f.maxhp-f.hp,Math.max(1,Math.floor(d*.1)));if(h>0&&f.hp>0){f.hp+=h;const i=runOf().battle.enemies.indexOf(f);if(i>=0)setTimeout(()=>dgFloat('.dg-foe[data-i="'+i+'"]','+'+h+' 👻','heal'),300)}}
// Pokémon Center and Lifeblock Gym
function twReviveHp(m){const e=twOn();return e&&e.center?Math.max(1,Math.floor(combatant(partyMon(m)).hp*.15)):1}
function twGuardHeal(m,c,gain){const e=twOn();if(!e||!e.lifeblock||m.hp<=0)return 0;const h=Math.min(c.hp-m.hp,Math.floor(gain/2));if(h>0)m.hp+=h;return Math.max(0,h)}
// King's Battlefield: the highest-level Pokémon on each side is the king
function twKingOn(u){const e=twOn();return !!(e&&e.king&&u&&u.king)}
function twCrown(r,b){r.party.forEach(m=>delete m.king);b.enemies.forEach(f=>delete f.king);if(!twEnv(r).king)return;
 const al=r.party.filter(m=>m.hp>0).sort((x,y)=>monLv(partyMon(y))-monLv(partyMon(x)))[0];if(al)al.king=true;const fo=[...b.enemies].sort((x,y)=>y.lv-x.lv)[0];if(fo)fo.king=true;b.kingDown={}}
function twKingCheck(r,b){if(!r||!r.tower||!twEnv(r).king)return;b.kingDown=b.kingDown||{};
 const ak=r.party.find(m=>m.king),fk=b.enemies.find(f=>f.king);
 if(ak&&ak.hp<=0&&!b.kingDown.a){b.kingDown.a=1;r.party.forEach((m,i)=>{if(m===ak||m.hp<=0)return;const d=Math.ceil(combatant(partyMon(m)).hp*.2);m.hp=Math.max(0,m.hp-d);if(m.hp<=0){m.koR=b.round;b.koAny=1}setTimeout(()=>dgFloat('.dg-ally[data-i="'+i+'"]','-'+d+' 👑','super'),200)});if(DG)DG.msg=(DG.msg?DG.msg+'<br>':'')+'👑 Your king fell! The rest of your team loses 20% HP.';save()}
 if(fk&&fk.hp<=0&&!b.kingDown.f){b.kingDown.f=1;b.enemies.forEach((f,i)=>{if(f===fk||f.hp<=0)return;const d=Math.ceil(f.maxhp*.2);f.hp=Math.max(0,f.hp-d);setTimeout(()=>dgFloat('.dg-foe[data-i="'+i+'"]','-'+d+' 👑','super'),200)});if(DG)DG.msg=(DG.msg?DG.msg+'<br>':'')+'👑 The foe’s king fell! Its teammates lose 20% HP.';save()}}
// Crystal Mines: Rock- and Ground-types show up more
function twSp(min,max){const r=runOf();if(r&&r.tower&&twEnv(r).rockFoes&&Math.random()<.6){const ch=MONS.filter(m=>m[2]>=min&&m[2]<=max&&SPECIES_DATA[m[0]]&&(SPECIES_DATA[m[0]].types||[]).some(t=>t==='rock'||t==='ground'));if(ch.length)return ch[Math.floor(Math.random()*ch.length)][0]}return speciesOfTier(min,max)}
