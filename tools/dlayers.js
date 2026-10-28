// ===================== MYSTERY DUNGEON · cave layers =====================
// The dungeon is dug downward through 8 layers (152 floors). Each layer is split into sublayers: a sublayer lasts 1–3
// floors, has its own look (floor colours, props, obstacles, wall decorations) and an effect on battles. A short digging
// cutscene plays whenever a new sublayer starts. Effects use the same hooks as the Battle Tower's environments.
const MD_LAYERS=[
 {name:'Oceanic Crust',floors:15,col:'#fea012',subs:['saltstone','tidal','coralgrave','brine','shellstone','barnacle','driftwood','undertow']},
 {name:'Caves',floors:10,col:'#a36b19',subs:['mossmouth','echoing','rootbound','glowcap','stillwater','batwing']},
 {name:'Stalagmite Layer',floors:20,col:'#a05d03',subs:['needle','ivory','shattered','dripstone','crooked','razor','hanging','thousand','pillarfall','monoliths']},
 {name:'Deepslate Depths',floors:27,col:'#902004',subs:['midnight','sootstone','silent','blackglass','foundry','ironroot','pressure','excavation','gloomstone','sealed','resonant','lightless']},
 {name:'Sunken Sea',floors:35,col:'#6f080c',subs:['fossilzone','archives','abyssal','whalefall','pearlgrave','blackwater','lanternfish','shipwreck','saltbound','palekelp','leviathan','flooded','ammonite','sunless']},
 {name:'Bubbling Caverns',floors:20,col:'#4a0809',subs:['fizzstone','sulfur','geyser','caustic','frothing','steamlock','quicksilver','boilingmire','hissing','blister']},
 {name:'Molten Dungeon',floors:15,col:'#e14702',subs:['cinder','basalt','embervault','slagworks','obsidian','furnace','ashen','crucible']},
 {name:'Unfathomable Core',floors:10,col:'#fccc08',final:true,subs:['crown','lastlight','blackflame','worldscar','heartcrucible','finalseal']}];
const MD_CORE='#fdf456',MD_TOTAL=MD_LAYERS.reduce((a,l)=>a+l.floors,0);
// floor colours: f1/f2 floor checker, w1/w2 wall, e wall edge, g grit/glints, pat floor pattern
const MD_PAL={
 salt:['#e9e4d8','#ded8ca','#8c98a8','#7a8696','#4f5a69','#c9c2b2'],tide:['#d9c99a','#cdbd8c','#3f7f8c','#336d79','#1f4a53','#b7a774'],coral:['#ecd2c8','#e2c4b8','#2f5f8a','#264f76','#173653','#d3a99c'],
 brine:['#b9d3c4','#abc7b7','#4a5d6a','#3e505c','#26343e','#8fb3a1'],shell:['#f0e2c6','#e6d6b6','#b08e66','#9c7c56','#6a5236','#d4bf98'],barn:['#b9b6ae','#adaaa1','#5d6670','#4f5760','#33393f','#8f8b82'],
 drift:['#d6bf94','#cab284','#7b5a3a','#6a4c30','#45311e','#b49766'],fault:['#b6a888','#aa9b7b','#2f3f5c','#26344d','#151e30','#8e8064'],moss:['#8fa36a','#84985f','#4c5a3a','#404d31','#29321f','#6c8048'],
 echo:['#a9aeb8','#9da2ac','#555d6e','#485060','#2d3340','#868b96'],root:['#a88a66','#9c7e5a','#5a4028','#4c3520','#2f2013','#86694a'],glow:['#56707a','#4d666f','#22343c','#1b2b32','#0e181d','#6fd6d0'],
 still:['#8fa4b8','#8398ac','#3c4c62','#324154','#1d2736','#b9d0e6'],bat:['#8a8296','#7e768a','#3d3548','#332c3d','#1e1926','#6a6276'],ivory:['#efe8da','#e5ddcd','#b8ad98','#a69a84','#766b58','#d1c6b0'],
 needle:['#cbb490','#bfa884','#7d6447','#6d563b','#46371f','#a88f6a'],stone:['#b8b2a8','#aca69c','#6c665e','#5d5850','#3b3732','#948e84'],drip:['#a8b4bc','#9ca8b0','#59666f','#4b575f','#2e373d','#c6d6e0'],
 razor:['#8f8f96','#84848b','#3e3e46','#33333a','#1d1d22','#b8b8c4'],slate:['#5d6676','#555e6d','#262c36','#1f242d','#101318','#7c8698'],soot:['#4f4844','#48423e','#211d1b','#1a1715','#0c0a09','#6e6560'],
 blackglass:['#3d3848','#373242','#17141d','#110f16','#08070b','#8f7fb8'],iron:['#7a6658','#705d50','#3e2f26','#33261f','#1d1510','#b06a3e'],gloom:['#4f5a52','#48524b','#1f2621','#19201b','#0c100d','#6e7d72'],
 fossil:['#d8cbb0','#cdbfa3','#8a7a5e','#78694f','#4d4231','#b8a888'],archive:['#6f8aa3','#657f97','#2c3d55','#243349','#121c2b','#a9c3dc','tiles'],reef:['#4f8f96','#47858c','#1d4258','#17374a','#0b1f2c','#ff9fb0'],
 abyss:['#33485f','#2e4258','#121c2a','#0e1622','#060a10','#5a7ca0'],pearl:['#c9c0dc','#bdb3d2','#5c5378','#4e4668','#302a45','#f2ecff'],wreck:['#8a6a48','#7e603f','#3a4f62','#2f4253','#182532','#a9865e','planks'],
 pale:['#a9c4a6','#9dba9a','#3e5c55','#334e48','#1d302c','#d8ead2'],sunless:['#6f6a62','#66615a','#262833','#1f212a','#0e0f14','#8c867c'],fizz:['#b9d7cf','#acccc3','#4f6d78','#435e68','#273b42','#e8fbff'],
 sulfur:['#e3d27a','#d8c66c','#8a7a32','#776928','#4a4015','#fff2a0'],steam:['#c4c2bd','#b8b6b1','#6a6762','#5c5954','#3a3835','#eeeeea'],caustic:['#a9c46a','#9db95e','#4b5e2a','#3f5022','#253013','#d8ff7a'],
 mire:['#8f7454','#84694a','#4a3824','#3e2e1d','#241a10','#6d5638'],quick:['#b7bcc6','#abb0ba','#5c6270','#4f5461','#30343d','#e8ecf4'],blister:['#c98a7a','#be7e6e','#6e3a32','#5e3029','#3a1b17','#f0b0a0'],
 cinder:['#6e3a30','#64332a','#2e1714','#25120f','#120807','#ff7a3c','bricks'],basalt:['#4a4a52','#42424a','#1f1f25','#19191e','#0b0b0e','#ff8a4a','bricks'],slag:['#8a5a3a','#7f5233','#3a2416','#301d11','#180e08','#ffaa3c'],
 obsid:['#2f2a38','#2a2532','#121016','#0e0c11','#050407','#b06aff','bricks'],forge:['#9a4a2a','#8f4325','#3e1a0e','#33150b','#1a0905','#ffcc4a','bricks'],ash:['#8c8682','#827c78','#3e3a38','#33302e','#1a1817','#b8b0aa','bricks'],
 crown:['#5a3a22','#52341e','#22140b','#1b1008','#0d0804','#ffd24a','bricks'],blackflame:['#2c2236','#271e30','#0f0b14','#0b0810','#040306','#9a5aff','bricks'],scar:['#5a2a26','#522522','#200e0c','#1a0b0a','#0a0404','#ff5a2a'],
 heart:['#a8442a','#9c3c24','#451608','#391206','#1c0803','#ffd06a'],seal:['#3a3248','#342d41','#16121d','#110e17','#07060a','#ffd86a','tiles']};
// Each sublayer: name, icon, palette, floor props, wall decoration, obstacle [kind, share of room tiles], effects.
// Effects: b = move types that hit harder, w = move types that hit softer, def = Pokémon types that take less damage,
// chip = [damage, safe types, banner, icon] after each round, heal = HP your team heals after each round,
// en = Stamina your team gains after each round, dark = you only see close by, mv = change to how far your team moves,
// tix = Ticket multiplier, items = extra items on the ground, foes = wild Pokémon types that show up more,
// single = multi-hit moves hit once, hz = [hazard, how many, damage, safe types].
const MD_SUBS={
 saltstone:{name:'Saltstone Shelf',icon:'🧂',pal:'salt',props:['salt','pebble','shell'],wall:'salt',obs:['saltpillar',.04],fx:{b:{ground:1.15},w:{grass:.85}}},
 tidal:{name:'Tidal Hollows',icon:'🌊',pal:'tide',props:['puddle','shell','pebble'],wall:'drips',obs:['boulder',.03],fx:{b:{water:1.2}}},
 coralgrave:{name:'Coral Graveyard',icon:'🪸',pal:'coral',props:['coral','bone','shell'],wall:'coral',obs:['bigcoral',.06],fx:{b:{ghost:1.15,rock:1.1}}},
 brine:{name:'Brine Pockets',icon:'💧',pal:'brine',props:['puddle','salt','bubble'],wall:'salt',obs:['boulder',.02],fx:{hz:['brine',5,1,['water','steel','poison']]}},
 shellstone:{name:'Shellstone Passage',icon:'🐚',pal:'shell',props:['shell','pebble','ammonite'],wall:'shells',obs:['boulder',.04],fx:{def:{rock:.9,water:.9}}},
 barnacle:{name:'Barnacle Burrows',icon:'🪨',pal:'barn',props:['barnacle','pebble'],wall:'barnacles',obs:['bigbarnacle',.05],fx:{b:{bug:1.2,rock:1.1}}},
 driftwood:{name:'Driftwood Vein',icon:'🪵',pal:'drift',props:['driftwood','shell','pebble'],wall:'roots',obs:['log',.05],fx:{b:{grass:1.15},items:2}},
 undertow:{name:'Undertow Fault',icon:'🌀',pal:'fault',props:['puddle','crack','pebble'],wall:'cracks',obs:['boulder',.03],fx:{b:{water:1.15},mv:-1}},
 mossmouth:{name:'Mossmouth Grotto',icon:'🌿',pal:'moss',props:['moss','pebble','root'],wall:'moss',obs:['boulder',.04],fx:{heal:1}},
 echoing:{name:'Echoing Tunnels',icon:'🔊',pal:'echo',props:['pebble','rubble'],wall:'cracks',obs:['boulder',.03],fx:{b:{normal:1.2}}},
 rootbound:{name:'Rootbound Hollow',icon:'🌳',pal:'root',props:['root','moss','mushroom'],wall:'roots',obs:['roots',.06],fx:{b:{grass:1.2},mv:-1}},
 glowcap:{name:'Glowcap Gallery',icon:'🍄',pal:'glow',props:['glowcap','moss'],wall:'glowcaps',obs:['bigshroom',.04],fx:{b:{fairy:1.15,poison:1.15},en:5}},
 stillwater:{name:'Stillwater Passage',icon:'💧',pal:'still',props:['puddle','drip'],wall:'drips',obs:['boulder',.03],fx:{b:{water:1.2},w:{fire:.85}}},
 batwing:{name:'Batwing Burrows',icon:'🦇',pal:'bat',props:['pebble','bone'],wall:'bats',obs:['stalag',.03],fx:{dark:1,b:{flying:1.15},foes:['flying','dark']}},
 needle:{name:'Needle Forest',icon:'🪡',pal:'needle',props:['pebble','stalaglet'],wall:'fangs',obs:['stalag',.12],fx:{b:{rock:1.15}}},
 ivory:{name:'Ivory Spires',icon:'🦷',pal:'ivory',props:['pebble','whitecrystal'],wall:'fangs',obs:['ivoryspire',.08],fx:{b:{ice:1.15,fairy:1.1}}},
 shattered:{name:'Shattered Columns',icon:'🏛',pal:'stone',props:['rubble','brokencol'],wall:'bricks',obs:['column',.06],fx:{b:{fighting:1.15},items:2}},
 dripstone:{name:'Dripstone Cathedral',icon:'⛲',pal:'drip',props:['drip','puddle'],wall:'drips',obs:['stalag',.06],fx:{heal:1,b:{water:1.1}}},
 crooked:{name:'Crooked Pinnacles',icon:'⛰',pal:'needle',props:['pebble','rubble'],wall:'cracks',obs:['crooked',.08],fx:{b:{ground:1.2}}},
 razor:{name:'Razorstone Maze',icon:'🗡',pal:'razor',props:['shard','rubble'],wall:'cracks',obs:['razor',.1],fx:{chip:[1,['rock','steel','ground'],'🗡 Razor-sharp stones nick everyone…','🗡']}},
 hanging:{name:'Hanging Fangs',icon:'🦷',pal:'stone',props:['pebble','rubble'],wall:'fangs',obs:['stalag',.03],fx:{hz:['dripfall',6,2,['rock','steel']]}},
 thousand:{name:'Thousand Teeth',icon:'🦷',pal:'razor',props:['stalaglet','pebble'],wall:'fangs',obs:['stalag',.1],fx:{b:{dark:1.2,bug:1.1}}},
 pillarfall:{name:'Pillarfall Passage',icon:'🧱',pal:'stone',props:['rubble','brokencol'],wall:'bricks',obs:['column',.05],fx:{hz:['rubble',5,1,['rock','steel']]}},
 monoliths:{name:'Hollow Monoliths',icon:'🗿',pal:'ivory',props:['rune','pebble'],wall:'runes',obs:['monolith',.05],fx:{b:{psychic:1.2,ghost:1.1}}},
 midnight:{name:'Midnight Quarry',icon:'⛏',pal:'slate',props:['ore','rubble','rail'],wall:'veins',obs:['boulder',.05],fx:{dark:1,tix:1.25}},
 sootstone:{name:'Sootstone Galleries',icon:'💨',pal:'soot',props:['soot','rubble'],wall:'soot',obs:['boulder',.04],fx:{b:{fire:1.15,dark:1.1}}},
 silent:{name:'Silent Fault',icon:'🔇',pal:'slate',props:['crack','pebble'],wall:'cracks',obs:['boulder',.03],fx:{single:1,b:{psychic:1.1}}},
 blackglass:{name:'Blackglass Vein',icon:'💎',pal:'blackglass',props:['obsidian','shard'],wall:'glassvein',obs:['glass',.05],fx:{b:{dark:1.2,steel:1.1}}},
 foundry:{name:'Buried Foundry',icon:'⚙',pal:'iron',props:['gear','rail','ore'],wall:'pipes',obs:['anvil',.04],fx:{b:{steel:1.2,fire:1.1},items:1}},
 ironroot:{name:'Ironroot Tunnels',icon:'🌳',pal:'iron',props:['root','ore'],wall:'roots',obs:['roots',.06],fx:{def:{steel:.9,grass:.9}}},
 pressure:{name:'Pressure Vault',icon:'🔒',pal:'slate',props:['crack','rubble'],wall:'bricks',obs:['boulder',.03],fx:{chip:[1,['steel','rock','ground'],'🔒 The pressure squeezes everyone…','🔒']}},
 excavation:{name:'Forgotten Excavation',icon:'🦴',pal:'fossil',props:['bone','rail','ore'],wall:'veins',obs:['boulder',.04],fx:{items:3,tix:1.15}},
 gloomstone:{name:'Gloomstone Labyrinth',icon:'🌑',pal:'gloom',props:['pebble','moss'],wall:'cracks',obs:['boulder',.1],fx:{dark:1,b:{ghost:1.15}}},
 sealed:{name:'Sealed Stratum',icon:'🧱',pal:'soot',props:['rune','rubble'],wall:'bricks',obs:['boulder',.03],fx:{b:{rock:1.15},w:{flying:.8}}},
 resonant:{name:'Resonant Chasm',icon:'🔔',pal:'echo',props:['whitecrystal','pebble'],wall:'crystals',obs:['glass',.03],fx:{en:8,b:{normal:1.1}}},
 lightless:{name:'Lightless Crossing',icon:'🌑',pal:'blackglass',props:['pebble'],wall:'cracks',obs:['boulder',.03],fx:{dark:1,b:{dark:1.2}}},
 fossilzone:{name:'Fossil Zone',icon:'🦴',pal:'fossil',props:['fossil','ammonite','bone'],wall:'fossils',obs:['boulder',.04],fx:{b:{rock:1.2},foes:['rock']}},
 archives:{name:'Drowned Archives',icon:'📜',pal:'archive',props:['scroll','puddle','rubble'],wall:'shelves',obs:['shelf',.05],fx:{b:{psychic:1.2},items:1}},
 abyssal:{name:'Abyssal Reef',icon:'🪸',pal:'reef',props:['coral','kelp','bubble'],wall:'coral',obs:['bigcoral',.06],fx:{b:{water:1.2,poison:1.1}}},
 whalefall:{name:'Whale Fall',icon:'🐋',pal:'abyss',props:['bone','ribbone'],wall:'drips',obs:['rib',.05],fx:{heal:1,b:{ghost:1.1}}},
 pearlgrave:{name:'Pearlgrave Basin',icon:'🦪',pal:'pearl',props:['pearl','shell'],wall:'shells',obs:['boulder',.03],fx:{tix:1.4}},
 blackwater:{name:'Blackwater Trench',icon:'🌑',pal:'abyss',props:['bubble'],wall:'drips',obs:['boulder',.03],fx:{dark:1,b:{water:1.15,dark:1.15}}},
 lanternfish:{name:'Lanternfish Passage',icon:'🏮',pal:'abyss',props:['lantern','kelp'],wall:'lanterns',obs:['kelpwall',.04],fx:{b:{electric:1.2},en:5}},
 shipwreck:{name:'Shipwreck Hollow',icon:'⚓',pal:'wreck',props:['plank','crate','chain'],wall:'drips',obs:['mast',.04],fx:{items:3,tix:1.15}},
 saltbound:{name:'Saltbound Ruins',icon:'🏛',pal:'salt',props:['salt','rubble','brokencol'],wall:'bricks',obs:['column',.05],fx:{b:{steel:1.1,ground:1.1},w:{grass:.85}}},
 palekelp:{name:'Pale Kelp Forest',icon:'🌿',pal:'pale',props:['kelp','bubble'],wall:'moss',obs:['kelpwall',.08],fx:{b:{grass:1.2,water:1.1}}},
 leviathan:{name:'Leviathan’s Rest',icon:'🐉',pal:'abyss',props:['ribbone','bone'],wall:'drips',obs:['rib',.06],fx:{b:{dragon:1.2},def:{dragon:.9}}},
 flooded:{name:'Flooded Cathedral',icon:'⛲',pal:'archive',props:['puddle','candle'],wall:'windows',obs:['column',.05],fx:{heal:1,b:{fairy:1.15}}},
 ammonite:{name:'Ammonite Spiral',icon:'🐚',pal:'fossil',props:['ammonite','shell'],wall:'fossils',obs:['boulder',.03],fx:{mv:1}},
 sunless:{name:'Sunless Shore',icon:'🌊',pal:'sunless',props:['pebble','shell','driftwood'],wall:'drips',obs:['boulder',.03],fx:{dark:1,w:{fire:.85}}},
 fizzstone:{name:'Fizzstone Hollows',icon:'🫧',pal:'fizz',props:['bubble','pebble'],wall:'crystals',obs:['boulder',.03],fx:{b:{electric:1.15,water:1.1}}},
 sulfur:{name:'Sulfur Springs',icon:'♨',pal:'sulfur',props:['sulfur','bubble'],wall:'sulfur',obs:['boulder',.03],fx:{b:{poison:1.15},chip:[1,['poison','steel'],'☣ Sulfur fumes drift by…','☣']}},
 geyser:{name:'Geyser Gallery',icon:'♨',pal:'steam',props:['vent','puddle'],wall:'cracks',obs:['boulder',.03],fx:{b:{water:1.15},hz:['geyser',7,2,['water','fire']]}},
 caustic:{name:'Caustic Pools',icon:'☣',pal:'caustic',props:['acid','bubble'],wall:'sulfur',obs:['boulder',.03],fx:{b:{poison:1.2},hz:['acid',6,2,['poison','steel']]}},
 frothing:{name:'Frothing Basin',icon:'🌊',pal:'fizz',props:['foam','bubble','puddle'],wall:'drips',obs:['boulder',.03],fx:{b:{water:1.2},mv:-1}},
 steamlock:{name:'Steamlock Tunnels',icon:'💨',pal:'steam',props:['vent','gear'],wall:'pipes',obs:['chimney',.04],fx:{b:{fire:1.15,water:1.15},def:{steel:.9}}},
 quicksilver:{name:'Quicksilver Wells',icon:'⚗',pal:'quick',props:['mercury','pebble'],wall:'veins',obs:['boulder',.03],fx:{mv:1,hz:['mercury',5,1,['steel']]}},
 boilingmire:{name:'Boiling Mire',icon:'🍲',pal:'mire',props:['mud','bubble'],wall:'roots',obs:['boulder',.03],fx:{mv:-1,b:{ground:1.15},hz:['mud',6,1,['ground','fire']]}},
 hissing:{name:'Hissing Chimneys',icon:'🌋',pal:'steam',props:['vent','sulfur'],wall:'cracks',obs:['chimney',.05],fx:{b:{fire:1.2},w:{ice:.85}}},
 blister:{name:'Blisterstone Burrows',icon:'🔥',pal:'blister',props:['blister','pebble'],wall:'cracks',obs:['boulder',.04],fx:{chip:[1,['fire','rock','ground'],'🔥 The hot stone blisters underfoot…','🔥']}},
 cinder:{name:'Cinder Corridors',icon:'🔥',pal:'cinder',props:['ember','ash'],wall:'bricks',obs:['pillar',.03],fx:{b:{fire:1.2},w:{grass:.85}}},
 basalt:{name:'Basalt Barracks',icon:'🛡',pal:'basalt',props:['rubble','crate'],wall:'banners',obs:['pillar',.05],fx:{b:{fighting:1.2},def:{rock:.9}}},
 embervault:{name:'Embervault',icon:'💰',pal:'cinder',props:['ember','coin'],wall:'bricks',obs:['pillar',.03],fx:{tix:1.3,chip:[1,['fire'],'🔥 Embers swirl through the vault…','🔥']}},
 slagworks:{name:'Slagworks',icon:'⛏',pal:'slag',props:['slag','gear','rail'],wall:'pipes',obs:['anvil',.03],fx:{b:{steel:1.15},hz:['lava',6,2,['fire']]}},
 obsidian:{name:'Obsidian Cells',icon:'⛓',pal:'obsid',props:['chain','obsidian'],wall:'bars',obs:['obsidspike',.06],fx:{b:{dark:1.2},w:{fairy:.85}}},
 furnace:{name:'Furnaceheart Hall',icon:'🔥',pal:'forge',props:['ember','brazier'],wall:'braziers',obs:['pillar',.04],fx:{b:{fire:1.3},w:{ice:.8}}},
 ashen:{name:'Ashen Ramparts',icon:'🌫',pal:'ash',props:['ash','rubble'],wall:'bricks',obs:['pillar',.04],fx:{dark:1,b:{ground:1.15,flying:1.1}}},
 crucible:{name:'Crucible Crossing',icon:'🌋',pal:'slag',props:['slag','ember'],wall:'cracks',obs:['anvil',.02],fx:{b:{fire:1.15},hz:['lava',9,2,['fire']]}},
 crown:{name:'Crown of Cinders',icon:'👑',pal:'crown',props:['ember','coin'],wall:'braziers',obs:['pillar',.04],fx:{b:{fire:1.2},tix:1.3}},
 lastlight:{name:'Lastlight Forge',icon:'🔨',pal:'forge',props:['gear','ember'],wall:'pipes',obs:['anvil',.05],fx:{b:{steel:1.2,fire:1.2}}},
 blackflame:{name:'Blackflame Sanctum',icon:'🕯',pal:'blackflame',props:['blackfire','candle'],wall:'braziers',obs:['pillar',.04],fx:{dark:1,b:{ghost:1.2,dark:1.2}}},
 worldscar:{name:'Worldscar',icon:'🌋',pal:'scar',props:['crack','slag'],wall:'cracks',obs:['obsidspike',.03],fx:{hz:['lava',8,2,['fire']],chip:[1,['fire','dragon'],'🔥 The Worldscar burns…','🔥']}},
 heartcrucible:{name:'Heart of the Crucible',icon:'❤',pal:'heart',props:['ember','slag'],wall:'cracks',obs:['obsidspike',.03],fx:{b:{fire:1.3,dragon:1.15},en:8}},
 finalseal:{name:'The Final Seal',icon:'🔒',pal:'seal',props:['rune','candle'],wall:'runes',obs:['monolith',.04],fx:{b:{psychic:1.15,fairy:1.15,dragon:1.15},heal:1}}};
const MD_HZ={brine:{name:'brine pool',icon:'💧',pop:'💧 The brine stings!'},dripfall:{name:'falling stalactite',icon:'🦷',pop:'🦷 A stalactite falls!'},rubble:{name:'loose rubble',icon:'🧱',pop:'🧱 Rubble tumbles down!'},
 geyser:{name:'geyser vent',icon:'♨',pop:'♨ The geyser erupts!'},acid:{name:'caustic pool',icon:'☣',pop:'☣ The acid burns!'},mercury:{name:'quicksilver puddle',icon:'⚗',pop:'⚗ Toxic quicksilver!'},mud:{name:'boiling mud',icon:'🍲',pop:'🍲 The mud is scalding!'},lava:{name:'lava crack',icon:'🌋',pop:'🌋 Lava scorches!'}};
// ---------- where you are ----------
function mdLayerAt(f){let s=0;for(let i=0;i<MD_LAYERS.length;i++){if(f<s+MD_LAYERS[i].floors)return {i,start:s,L:MD_LAYERS[i]};s+=MD_LAYERS[i].floors}const i=MD_LAYERS.length-1;return {i,start:MD_TOTAL-MD_LAYERS[i].floors,L:MD_LAYERS[i]}}
function mdRun(r){r=r||runOf();return r&&!r.tower&&r.sub?r:null}
function mdSub(r){r=mdRun(r);return r&&r.sub?MD_SUBS[r.sub.k]:null}
function mdFx(r){const s=mdSub(r);return s?s.fx:{}}
// picks the sublayer for the floor about to be made; returns true when a new sublayer starts (the cutscene plays)
function mdPlan(r){const f=r.floor||0,{i,start,L}=mdLayerAt(f),cur=r.sub;
 if(cur&&cur.layer===i&&cur.left>0&&f>=cur.from){cur.left--;cur.fresh=false;return false}
 const left=start+L.floors-f,pool=L.subs.filter(k=>!cur||k!==cur.k),k=pool[Math.floor(Math.random()*pool.length)],n=Math.min(left,1+Math.floor(Math.random()*3));
 r.sub={k,layer:i,from:f,left:n-1,fresh:true};(r.digs=r.digs||[]).push({f,k});if(r.digs.length>40)r.digs.splice(0,r.digs.length-40);return true}
function mdTheme(r){const s=mdSub(r)||MD_SUBS.saltstone,p=MD_PAL[s.pal]||MD_PAL.salt;return {name:s.name,f1:p[0],f2:p[1],w1:p[2],w2:p[3],e:p[4],g:p[5],pat:p[6]||''}}
function mdIsLast(r){return (r.floor||0)>=MD_TOTAL-1}
// ---------- effect text ----------
function mdTypeList(ts){const n=ts.map(t=>t.charAt(0).toUpperCase()+t.slice(1));return n.length<2?n[0]:n.slice(0,-1).join(', ')+' or '+n[n.length-1]}
function mdAndList(ts){const n=ts.map(t=>t.charAt(0).toUpperCase()+t.slice(1));return n.length<2?n[0]:n.slice(0,-1).join(', ')+' and '+n[n.length-1]}
function mdDesc(fx){const out=[],pct=m=>Math.round(Math.abs(m-1)*100)+'%';
 const grp=(o,up)=>{const by={};Object.entries(o||{}).forEach(([t,m])=>{(by[m]=by[m]||[]).push(t)});return Object.entries(by).map(([m,ts])=>mdAndList(ts)+'-type moves deal '+pct(+m)+(up?' more':' less')+' damage.')};
 out.push(...grp(fx.b,true),...grp(fx.w,false));
 if(fx.def){const by={};Object.entries(fx.def).forEach(([t,m])=>{(by[m]=by[m]||[]).push(t)});Object.entries(by).forEach(([m,ts])=>out.push(mdAndList(ts)+'-type Pokémon take '+pct(+m)+' less damage.'))}
 if(fx.chip)out.push('After each round, every Pokémon that isn’t '+mdTypeList(fx.chip[1])+' type takes '+fx.chip[0]+' damage. It can’t knock out your team.');
 if(fx.hz){const H=MD_HZ[fx.hz[0]];out.push('Watch for '+H.name+'s on the floor: stepping on one costs '+fx.hz[2]+' HP (not for '+mdTypeList(fx.hz[3])+' types, and never your last HP).')}
 if(fx.heal)out.push('Your team heals '+fx.heal+' HP after each round.');
 if(fx.en)out.push('Your team gains '+fx.en+' Stamina after each round.');
 if(fx.dark)out.push('It’s dark: you only see 2 tiles around your team.');
 if(fx.mv)out.push(fx.mv>0?'Your team moves '+fx.mv+' tile farther in battle.':'Your team moves '+(-fx.mv)+' tile less in battle (never below 1).');
 if(fx.single)out.push('Multi-hit moves only hit once.');
 if(fx.tix)out.push('+'+Math.round((fx.tix-1)*100)+'% Tickets from wild Pokémon and Ticket piles.');
 if(fx.items)out.push('More items lie around ('+fx.items+' extra).');
 if(fx.foes)out.push(mdAndList(fx.foes)+'-type wild Pokémon show up more often.');
 return out.length?out:['No special effect.']}
// ---------- battle hooks (called from the shared battle code) ----------
function mdTypeMult(type){const fx=mdFx(),t=String(type).toLowerCase();return ((fx.b||{})[t]||1)*((fx.w||{})[t]||1)}
function mdDefMult(types){const fx=mdFx();if(!fx.def)return 1;let k=1;(types||[]).forEach(t=>{const m=fx.def[String(t).toLowerCase()];if(m)k*=m});return k}
function mdFoeMult(type,types){return mdRun()?mdTypeMult(type)*mdDefMult(types):1}
function mdMoveAdj(){return mdFx().mv||0}
function mdTix(n){const fx=mdFx();return fx.tix?Math.round(n*fx.tix):n}
function mdIsType(types,t){return (types||[]).some(x=>String(x).toLowerCase()===t)}
function mdSp(min,max){const fx=mdFx();if(fx.foes&&Math.random()<.55){const ch=MONS.filter(m=>m[2]>=min&&m[2]<=max&&SPECIES_DATA[m[0]]&&(SPECIES_DATA[m[0]].types||[]).some(t=>fx.foes.includes(t)));if(ch.length)return ch[Math.floor(Math.random()*ch.length)][0]}return speciesOfTier(min,max)}
// after each round: chip damage (never your team's last HP), healing and Stamina
async function mdRoundEnd(r,b){const fx=mdFx(r);if(!mdRun(r))return;const L=gdLit(r),fl=[];let pop='';
 if(fx.chip){const [d,safe,txt,icon]=fx.chip,ok=t=>safe.some(s=>mdIsType(t,s));
  r.party.forEach((m,i)=>{if(m.hp<=0)return;const c=combatant(partyMon(m));if(ok(c.types))return;const k=Math.min(d,m.hp-1);if(k<=0)return;m.hp-=k;dgHurt(b,m,k);fl.push(['.dg-ally[data-i="'+i+'"]','-'+k+' '+icon,'env'])});
  b.enemies.forEach((e,i)=>{if(e.hp<=0||e.done||!e.aware||!L.has(gdKey(e.x,e.y))||ok(e.types))return;const k=Math.min(d,e.hp);e.hp-=k;fl.push(['.dg-foe[data-i="'+i+'"]','-'+k+' '+icon,'env'])});if(fl.length)pop=txt}
 if(fx.heal){let any=0;r.party.forEach((m,i)=>{if(m.hp<=0)return;const c=combatant(partyMon(m)),h=Math.min(fx.heal,c.hp-m.hp);if(h>0){m.hp+=h;any=1;fl.push(['.dg-ally[data-i="'+i+'"]','+'+h+' '+mdSub(r).icon,'heal'])}});if(any&&!pop)pop=mdSub(r).icon+' '+mdSub(r).name+' soothes your team…'}
 if(fx.en)r.party.forEach(m=>{if(m.hp>0)m.energy=Math.min(100,(m.energy||0)+fx.en)});
 if(!fl.length)return;gdKills(r);save();gdDrawBattle();twEnvPop(pop);fl.forEach(([s,t,c],k)=>setTimeout(()=>dgFloat(s,t,c),200+k*60));await dgSleep(1200)}
// a Pokémon that ends its walk on a hazard
function mdHazard(r,u,isFoe,i){const fl=r.fl;if(!fl||!fl.hz)return 0;const k=fl.hz[gdKey(u.x,u.y)];if(!k)return 0;const fx=mdFx(r),H=MD_HZ[k];if(!H||!fx.hz)return 0;
 const types=isFoe?u.types:combatant(partyMon(u)).types;if(fx.hz[3].some(s=>mdIsType(types,s)))return 0;const d=isFoe?Math.min(fx.hz[2],u.hp):Math.min(fx.hz[2],u.hp-1);if(d<=0)return 0;u.hp-=d;
 if(!isFoe)dgHurt(r.battle,u,d);save();setTimeout(()=>{twEnvPop(H.pop);dgFloat((isFoe?'.dg-foe':'.dg-ally')+'[data-i="'+i+'"]','-'+d+' '+H.icon,'env')},80);return d}
// ---------- floor building: obstacles and hazards ----------
function mdDress(r,fl,taken){const s=mdSub(r);if(!s)return;const rooms=fl.rooms,rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),ob=Array(fl.w*fl.h).fill('0'),hz={};
 const ctr=o=>[o[0]+(o[2]>>1),o[1]+(o[3]>>1)],near=(x,y)=>[...taken].some(k=>{const [a,b]=k.split(',').map(Number);return Math.max(Math.abs(a-x),Math.abs(b-y))<=1});
 // obstacles: block a share of room tiles, but never cut a room off or touch a doorway
 if(s.obs){fl.ob=ob.join('');const goal=rooms.map(ctr),start=goal[0];
  rooms.forEach((o,ri)=>{let n=Math.round(o[2]*o[3]*s.obs[1]);for(let t=0;t<n*4&&n>0;t++){const x=rnd(o[0],o[0]+o[2]-1),y=rnd(o[1],o[1]+o[3]-1),k=y*fl.w+x;if(ob[k]==='1'||taken.has(gdKey(x,y))||near(x,y)&&ri===0)continue;
   if(x===o[0]||y===o[1]||x===o[0]+o[2]-1||y===o[1]+o[3]-1){if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>+fl.tiles[y+dy]?.[x+dx]===2))continue}
   if(goal.some(([gx,gy])=>gx===x&&gy===y)||(fl.stairs[0]===x&&fl.stairs[1]===y))continue;ob[k]='1';fl.ob=ob.join('');
   const reach=gdBFS(fl,start,()=>false,999);if(goal.some(g=>!reach.has(gdKey(...g)))||!reach.has(gdKey(...fl.stairs))){ob[k]='0';fl.ob=ob.join('');continue}
   if(--n<=0)break}})}
 // hazards: on open room tiles away from where your team starts
 if(s.fx.hz){const [kind,n]=s.fx.hz;for(let t=0;t<n*6&&Object.keys(hz).length<n;t++){const ri=rnd(1,rooms.length-1),o=rooms[ri];if(!o)break;const x=rnd(o[0],o[0]+o[2]-1),y=rnd(o[1],o[1]+o[3]-1),key=gdKey(x,y);
   if(taken.has(key)||hz[key]||(fl.ob&&fl.ob[y*fl.w+x]==='1')||(fl.stairs[0]===x&&fl.stairs[1]===y))continue;hz[key]=kind}fl.hz=hz}}
// ---------- drawing the floor: patterns, props, obstacles, hazards, wall decorations ----------
function mdShade(hex,k){const n=parseInt(hex.slice(1),16),c=[n>>16,n>>8&255,n&255].map(v=>Math.max(0,Math.min(255,Math.round(k>1?v+(255-v)*(k-1):v*k))));return '#'+c.map(v=>v.toString(16).padStart(2,'0')).join('')}
function mdHash(s){let h=2166136261;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return (h>>>0)||7}
const MD_DRAW={
 pebble(g,x,y,R,P){for(let i=0;i<2+R()*2;i++){g.fillStyle=mdShade(P.w1,1.35+R()*.3);g.beginPath();g.ellipse(x+8+R()*24,y+10+R()*22,3+R()*3,2+R()*2,R()*3,0,7);g.fill()}},
 salt(g,x,y,R){for(let i=0;i<3;i++){const cx=x+10+R()*20,cy=y+12+R()*18,s=3+R()*4;g.save();g.translate(cx,cy);g.rotate(R()*1.5);g.fillStyle='#fbfbf6';g.fillRect(-s,-s,2*s,2*s);g.fillStyle='#d9dde4';g.fillRect(-s,0,2*s,s);g.restore()}},
 shell(g,x,y,R){const cx=x+20+(R()-.5)*14,cy=y+24+(R()-.5)*10;g.fillStyle=R()<.5?'#f6d5c8':'#f3e6c8';g.beginPath();g.moveTo(cx-9,cy+4);g.quadraticCurveTo(cx,cy-14,cx+9,cy+4);g.closePath();g.fill();g.strokeStyle='#c99a86';g.lineWidth=1.2;for(let k=-2;k<=2;k++){g.beginPath();g.moveTo(cx,cy+4);g.lineTo(cx+k*4,cy-6);g.stroke()}},
 puddle(g,x,y,R){g.fillStyle='rgba(90,160,220,.55)';g.beginPath();g.ellipse(x+20,y+24,11+R()*6,5+R()*3,0,0,7);g.fill();g.fillStyle='rgba(255,255,255,.45)';g.fillRect(x+14,y+21,6,2)},
 coral(g,x,y,R){g.strokeStyle=R()<.5?'#f58aa6':'#ffb07a';g.lineWidth=3;g.lineCap='round';const bx=x+20,by=y+34;g.beginPath();g.moveTo(bx,by);g.lineTo(bx,by-14);g.lineTo(bx-7,by-22);g.moveTo(bx,by-12);g.lineTo(bx+8,by-20);g.moveTo(bx-4,by-8);g.lineTo(bx-10,by-12);g.stroke()},
 bone(g,x,y,R){const cx=x+20,cy=y+22,a=R()*3;g.save();g.translate(cx,cy);g.rotate(a);g.fillStyle='#f2ecdc';g.fillRect(-9,-2,18,4);[[-9,-3],[-9,3],[9,-3],[9,3]].forEach(([a,b])=>{g.beginPath();g.arc(a,b,3,0,7);g.fill()});g.restore()},
 bubble(g,x,y,R){g.strokeStyle='rgba(230,248,255,.75)';g.lineWidth=1.5;for(let i=0;i<3;i++){g.beginPath();g.arc(x+8+R()*24,y+8+R()*24,2+R()*4,0,7);g.stroke()}},
 crack(g,x,y,R,P){g.strokeStyle=P.e;g.lineWidth=2;g.beginPath();let px=x+4+R()*8,py=y+6+R()*8;g.moveTo(px,py);for(let i=0;i<4;i++){px+=5+R()*6;py+=4+R()*6;g.lineTo(px,py)}g.stroke()},
 moss(g,x,y,R){for(let i=0;i<4;i++){g.fillStyle=['#6f9a4a','#86b25a','#5c8840'][i%3];g.beginPath();g.arc(x+8+R()*24,y+10+R()*22,3+R()*4,0,7);g.fill()}},
 root(g,x,y,R){g.strokeStyle='#6b4a2c';g.lineWidth=3;g.lineCap='round';g.beginPath();g.moveTo(x+2,y+10+R()*20);g.bezierCurveTo(x+14,y+R()*40,x+26,y+R()*40,x+38,y+10+R()*20);g.stroke()},
 glowcap(g,x,y,R){for(let i=0;i<2;i++){const cx=x+10+R()*20,cy=y+18+R()*14;g.fillStyle='rgba(111,230,224,.25)';g.beginPath();g.arc(cx,cy-3,9,0,7);g.fill();g.fillStyle='#e8f2ea';g.fillRect(cx-1.5,cy-2,3,7);g.fillStyle='#6fe6e0';g.beginPath();g.ellipse(cx,cy-3,6,4,0,Math.PI,0);g.fill()}},
 mushroom(g,x,y,R){const cx=x+20+(R()-.5)*12,cy=y+26;g.fillStyle='#f2e6d8';g.fillRect(cx-2,cy-6,4,9);g.fillStyle='#d9533a';g.beginPath();g.ellipse(cx,cy-6,8,6,0,Math.PI,0);g.fill();g.fillStyle='#fff';g.fillRect(cx-4,cy-10,2,2);g.fillRect(cx+2,cy-9,2,2)},
 drip(g,x,y,R){g.fillStyle='rgba(150,200,240,.6)';g.beginPath();g.ellipse(x+20,y+28,8,3,0,0,7);g.fill();g.fillStyle='#9fd0f2';g.beginPath();g.moveTo(x+20,y+10);g.quadraticCurveTo(x+26,y+20,x+20,y+22);g.quadraticCurveTo(x+14,y+20,x+20,y+10);g.fill()},
 rubble(g,x,y,R,P){for(let i=0;i<3;i++){const cx=x+8+R()*24,cy=y+10+R()*22,s=3+R()*4;g.fillStyle=mdShade(P.w1,1.2+R()*.4);g.beginPath();g.moveTo(cx-s,cy);g.lineTo(cx-s*.3,cy-s);g.lineTo(cx+s,cy-s*.4);g.lineTo(cx+s*.6,cy+s*.7);g.closePath();g.fill()}},
 stalaglet(g,x,y,R,P){const cx=x+20+(R()-.5)*12,cy=y+32;g.fillStyle=mdShade(P.w1,1.25);g.beginPath();g.moveTo(cx-7,cy);g.lineTo(cx,cy-18);g.lineTo(cx+7,cy);g.closePath();g.fill();g.fillStyle='rgba(255,255,255,.25)';g.beginPath();g.moveTo(cx-2,cy-2);g.lineTo(cx,cy-16);g.lineTo(cx+1,cy-2);g.fill()},
 shard(g,x,y,R){const cx=x+20+(R()-.5)*14,cy=y+28;g.fillStyle='#4a4a58';g.beginPath();g.moveTo(cx-5,cy);g.lineTo(cx-1,cy-14);g.lineTo(cx+5,cy);g.closePath();g.fill();g.strokeStyle='#c8c8dc';g.lineWidth=1;g.stroke()},
 whitecrystal(g,x,y,R){const cx=x+20+(R()-.5)*14,cy=y+30;g.fillStyle='#f2f6ff';g.strokeStyle='#9fb2d6';g.lineWidth=1.2;[[-6,-12],[0,-18],[6,-11]].forEach(([dx,h])=>{g.beginPath();g.moveTo(cx+dx-3,cy);g.lineTo(cx+dx,cy+h);g.lineTo(cx+dx+3,cy);g.closePath();g.fill();g.stroke()})},
 brokencol(g,x,y,R,P){g.save();g.translate(x+20,y+24);g.rotate(R()*.8-.4);g.fillStyle=mdShade(P.f1,.9);g.fillRect(-14,-5,28,10);g.strokeStyle=P.e;g.lineWidth=1;for(let k=-8;k<=8;k+=8){g.beginPath();g.moveTo(k,-5);g.lineTo(k,5);g.stroke()}g.restore()},
 rune(g,x,y,R,P){g.strokeStyle=P.g;g.globalAlpha=.75;g.lineWidth=1.6;g.beginPath();g.arc(x+20,y+20,10,0,7);g.stroke();g.beginPath();g.moveTo(x+20,y+12);g.lineTo(x+20,y+28);g.moveTo(x+13,y+16);g.lineTo(x+27,y+24);g.stroke();g.globalAlpha=1},
 ore(g,x,y,R,P){g.fillStyle=mdShade(P.w1,.9);g.beginPath();g.arc(x+20,y+24,8,0,7);g.fill();g.fillStyle=P.g;for(let i=0;i<3;i++)g.fillRect(x+15+R()*8,y+19+R()*8,2,2)},
 rail(g,x,y){g.fillStyle='#6b4a2c';for(let k=4;k<40;k+=9)g.fillRect(x+k,y+14,4,14);g.fillStyle='#8f97a8';g.fillRect(x,y+16,40,2);g.fillRect(x,y+25,40,2)},
 soot(g,x,y,R){g.fillStyle='rgba(10,8,8,.35)';for(let i=0;i<3;i++){g.beginPath();g.ellipse(x+10+R()*20,y+12+R()*18,6+R()*5,3+R()*3,R()*3,0,7);g.fill()}},
 obsidian(g,x,y,R){const cx=x+20+(R()-.5)*12,cy=y+28;g.fillStyle='#1a1422';g.beginPath();g.moveTo(cx-6,cy);g.lineTo(cx-2,cy-15);g.lineTo(cx+4,cy-9);g.lineTo(cx+7,cy);g.closePath();g.fill();g.strokeStyle='#a87ae0';g.lineWidth=1;g.stroke()},
 gear(g,x,y,R){const cx=x+20,cy=y+22,a=R()*6;g.fillStyle='#7d6a5a';g.beginPath();for(let i=0;i<16;i++){const rr=i%2?9:6.5,t=a+i*Math.PI/8;g.lineTo(cx+rr*Math.cos(t),cy+rr*Math.sin(t))}g.closePath();g.fill();g.fillStyle='#3e2f26';g.beginPath();g.arc(cx,cy,3,0,7);g.fill()},
 fossil(g,x,y,R,P){g.strokeStyle=mdShade(P.w1,1.1);g.lineWidth=1.6;const cx=x+20,cy=y+22;g.beginPath();g.moveTo(cx-12,cy);g.lineTo(cx+12,cy);g.stroke();for(let k=-8;k<=8;k+=4){g.beginPath();g.moveTo(cx+k,cy-5);g.lineTo(cx+k,cy+5);g.stroke()}},
 ammonite(g,x,y,R){const cx=x+20,cy=y+22;g.strokeStyle='#b08a5a';g.fillStyle='#e8d2a8';g.lineWidth=1.6;g.beginPath();g.arc(cx,cy,9,0,7);g.fill();g.beginPath();for(let t=0;t<12;t+=.3){const rr=9-t*.7;g.lineTo(cx+rr*Math.cos(t),cy+rr*Math.sin(t))}g.stroke()},
 scroll(g,x,y,R){g.save();g.translate(x+20,y+22);g.rotate(R()-.5);g.fillStyle='#e8dcb8';g.fillRect(-11,-4,22,8);g.fillStyle='#c4b48a';g.beginPath();g.arc(-11,0,4,0,7);g.arc(11,0,4,0,7);g.fill();g.restore()},
 kelp(g,x,y,R){g.strokeStyle='#5f9a5a';g.lineWidth=3;g.lineCap='round';for(let i=0;i<2;i++){const bx=x+12+i*14+R()*4;g.beginPath();g.moveTo(bx,y+36);g.bezierCurveTo(bx-6,y+26,bx+6,y+16,bx-2,y+4);g.stroke()}},
 ribbone(g,x,y,R){g.strokeStyle='#efe6d2';g.lineWidth=4;g.lineCap='round';g.beginPath();g.arc(x+20,y+34,14,Math.PI*1.1,Math.PI*1.9);g.stroke()},
 pearl(g,x,y){g.fillStyle='#d8c4e8';g.beginPath();g.ellipse(x+20,y+26,10,5,0,0,7);g.fill();g.fillStyle='#fffaff';g.beginPath();g.arc(x+20,y+23,4.5,0,7);g.fill();g.fillStyle='#fff';g.fillRect(x+18,y+21,2,2)},
 lantern(g,x,y,R,P){const cx=x+10+R()*20,cy=y+12+R()*16;const gr=g.createRadialGradient(cx,cy,0,cx,cy,12);gr.addColorStop(0,'rgba(255,240,170,.8)');gr.addColorStop(1,'rgba(255,240,170,0)');g.fillStyle=gr;g.beginPath();g.arc(cx,cy,12,0,7);g.fill();g.fillStyle='#fff6c8';g.beginPath();g.arc(cx,cy,3,0,7);g.fill()},
 plank(g,x,y,R){g.save();g.translate(x+20,y+22);g.rotate(R()-.5);g.fillStyle='#9a6e44';g.fillRect(-14,-4,28,8);g.strokeStyle='#5e3e22';g.lineWidth=1;g.strokeRect(-14,-4,28,8);g.restore()},
 crate(g,x,y){g.fillStyle='#a8784a';g.fillRect(x+11,y+12,18,16);g.strokeStyle='#6a4626';g.lineWidth=1.5;g.strokeRect(x+11,y+12,18,16);g.beginPath();g.moveTo(x+11,y+12);g.lineTo(x+29,y+28);g.stroke()},
 chain(g,x,y,R){g.strokeStyle='#8f97a8';g.lineWidth=2;for(let i=0;i<4;i++){g.beginPath();g.ellipse(x+8+i*8,y+22+(i%2)*2,4,2.5,0,0,7);g.stroke()}},
 candle(g,x,y,R){const cx=x+14+R()*12,cy=y+28;g.fillStyle='#f2ead8';g.fillRect(cx-2.5,cy-10,5,10);g.fillStyle='rgba(255,210,110,.35)';g.beginPath();g.arc(cx,cy-13,7,0,7);g.fill();g.fillStyle='#ffb43a';g.beginPath();g.ellipse(cx,cy-13,2,3.5,0,0,7);g.fill()},
 sulfur(g,x,y,R){for(let i=0;i<4;i++){g.fillStyle=['#f2d84a','#e8c83a','#fff09a'][i%3];g.beginPath();g.arc(x+8+R()*24,y+10+R()*22,2+R()*4,0,7);g.fill()}},
 vent(g,x,y,R){g.fillStyle='#3a3835';g.beginPath();g.ellipse(x+20,y+28,7,3,0,0,7);g.fill();g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.arc(x+18,y+18,5,0,7);g.arc(x+23,y+11,4,0,7);g.fill()},
 acid(g,x,y,R){g.fillStyle='rgba(170,230,80,.55)';g.beginPath();g.ellipse(x+20,y+26,9,4,0,0,7);g.fill();g.strokeStyle='#d8ff7a';g.lineWidth=1.2;g.beginPath();g.arc(x+16,y+22,2,0,7);g.stroke()},
 foam(g,x,y,R){g.fillStyle='rgba(255,255,255,.7)';for(let i=0;i<5;i++){g.beginPath();g.arc(x+8+R()*24,y+10+R()*22,2+R()*3,0,7);g.fill()}},
 mercury(g,x,y,R){g.fillStyle='#d4dae6';g.beginPath();g.ellipse(x+20,y+25,7,3.5,0,0,7);g.fill();g.fillStyle='#fff';g.fillRect(x+17,y+23,3,1.5)},
 mud(g,x,y,R){g.fillStyle='#5e4630';g.beginPath();g.ellipse(x+20,y+25,9,4,0,0,7);g.fill();g.strokeStyle='#8f7454';g.lineWidth=1.2;g.beginPath();g.arc(x+22,y+22,2.5,0,7);g.stroke()},
 blister(g,x,y,R){for(let i=0;i<3;i++){const cx=x+8+R()*24,cy=y+10+R()*22;g.fillStyle='#e8a090';g.beginPath();g.arc(cx,cy,3+R()*2,0,7);g.fill();g.fillStyle='#fff0e8';g.fillRect(cx-1,cy-2,2,1.5)}},
 ember(g,x,y,R){for(let i=0;i<3;i++){const cx=x+8+R()*24,cy=y+10+R()*22;g.fillStyle='rgba(255,140,60,.35)';g.beginPath();g.arc(cx,cy,5,0,7);g.fill();g.fillStyle='#ffb43a';g.beginPath();g.arc(cx,cy,2,0,7);g.fill()}},
 ash(g,x,y,R){g.fillStyle='rgba(200,195,190,.45)';for(let i=0;i<3;i++){g.beginPath();g.ellipse(x+10+R()*20,y+14+R()*16,6+R()*4,2.5,0,0,7);g.fill()}},
 brazier(g,x,y){g.fillStyle='#4a3a30';g.fillRect(x+17,y+24,6,10);g.fillStyle='#6b5446';g.beginPath();g.ellipse(x+20,y+24,9,4,0,0,7);g.fill();g.fillStyle='#ff8a3c';g.beginPath();g.moveTo(x+13,y+23);g.quadraticCurveTo(x+20,y+4,x+27,y+23);g.fill();g.fillStyle='#ffd84d';g.beginPath();g.moveTo(x+16,y+23);g.quadraticCurveTo(x+20,y+12,x+24,y+23);g.fill()},
 coin(g,x,y,R){for(let i=0;i<3;i++){const cx=x+10+R()*20,cy=y+14+R()*16;g.fillStyle='#f2c240';g.beginPath();g.ellipse(cx,cy,4,3,0,0,7);g.fill();g.fillStyle='#fff2a0';g.fillRect(cx-1,cy-1.5,2,1)}},
 slag(g,x,y,R){for(let i=0;i<2;i++){const cx=x+10+R()*20,cy=y+14+R()*16;g.fillStyle='#5a3a24';g.beginPath();g.arc(cx,cy,5,0,7);g.fill();g.strokeStyle='#ffaa3c';g.lineWidth=1;g.beginPath();g.moveTo(cx-3,cy);g.lineTo(cx+2,cy-2);g.stroke()}},
 blackfire(g,x,y,R){const cx=x+20+(R()-.5)*12,cy=y+30;g.fillStyle='rgba(154,90,255,.3)';g.beginPath();g.arc(cx,cy-8,10,0,7);g.fill();g.fillStyle='#2a1a3a';g.beginPath();g.moveTo(cx-6,cy);g.quadraticCurveTo(cx,cy-24,cx+6,cy);g.fill();g.fillStyle='#9a5aff';g.beginPath();g.moveTo(cx-3,cy);g.quadraticCurveTo(cx,cy-12,cx+3,cy);g.fill()},
 barnacle(g,x,y,R){for(let i=0;i<4;i++){const cx=x+8+R()*24,cy=y+12+R()*20;g.fillStyle='#e6e2d6';g.beginPath();g.moveTo(cx-4,cy+3);g.lineTo(cx-2,cy-3);g.lineTo(cx+2,cy-3);g.lineTo(cx+4,cy+3);g.closePath();g.fill();g.fillStyle='#6a6e74';g.fillRect(cx-1,cy-3,2,2)}},
 driftwood(g,x,y,R){g.save();g.translate(x+20,y+22);g.rotate(R()*1.2-.6);g.fillStyle='#a8865e';g.beginPath();g.ellipse(0,0,14,4,0,0,7);g.fill();g.strokeStyle='#7a5a3a';g.lineWidth=1;g.beginPath();g.moveTo(-10,0);g.lineTo(10,0);g.stroke();g.restore()}};
// obstacles fill their tile and block movement and lines of attack
const MD_OBS={
 boulder(g,x,y,P){g.fillStyle=mdShade(P.w1,1.1);g.beginPath();g.ellipse(x+20,y+24,16,13,0,0,7);g.fill();g.fillStyle=mdShade(P.w1,1.35);g.beginPath();g.ellipse(x+15,y+19,7,5,-.4,0,7);g.fill();g.strokeStyle=P.e;g.lineWidth=1.5;g.beginPath();g.ellipse(x+20,y+24,16,13,0,0,7);g.stroke()},
 saltpillar(g,x,y){g.fillStyle='#f4f2ea';g.fillRect(x+10,y+6,20,30);g.fillStyle='#d6d8de';g.fillRect(x+20,y+6,10,30);g.strokeStyle='#9aa2ae';g.lineWidth=1.5;g.strokeRect(x+10,y+6,20,30)},
 bigcoral(g,x,y){g.strokeStyle='#f27a9a';g.lineWidth=5;g.lineCap='round';g.beginPath();g.moveTo(x+20,y+38);g.lineTo(x+20,y+18);g.lineTo(x+10,y+6);g.moveTo(x+20,y+20);g.lineTo(x+31,y+8);g.moveTo(x+20,y+28);g.lineTo(x+8,y+22);g.moveTo(x+20,y+26);g.lineTo(x+33,y+22);g.stroke()},
 bigbarnacle(g,x,y){for(let i=0;i<5;i++){const cx=x+8+(i%3)*12,cy=y+14+Math.floor(i/3)*14;g.fillStyle='#ece8dc';g.beginPath();g.moveTo(cx-6,cy+6);g.lineTo(cx-3,cy-5);g.lineTo(cx+3,cy-5);g.lineTo(cx+6,cy+6);g.closePath();g.fill();g.strokeStyle='#8a8e94';g.lineWidth=1;g.stroke()}},
 log(g,x,y){g.fillStyle='#8a6440';g.fillRect(x+3,y+14,34,14);g.fillStyle='#b48c60';g.beginPath();g.ellipse(x+36,y+21,4,7,0,0,7);g.fill();g.strokeStyle='#5a3e22';g.lineWidth=1.5;g.strokeRect(x+3,y+14,34,14)},
 roots(g,x,y){g.strokeStyle='#5a3e22';g.lineWidth=4;g.lineCap='round';for(let i=0;i<4;i++){g.beginPath();g.moveTo(x+2+i*3,y+4+i*9);g.bezierCurveTo(x+16,y+i*10,x+24,y+30-i*6,x+38,y+8+i*8);g.stroke()}},
 bigshroom(g,x,y){g.fillStyle='rgba(111,230,224,.25)';g.beginPath();g.arc(x+20,y+16,18,0,7);g.fill();g.fillStyle='#e8f2ea';g.fillRect(x+16,y+16,8,20);g.fillStyle='#4fd6d0';g.beginPath();g.ellipse(x+20,y+16,17,11,0,Math.PI,0);g.fill();g.fillStyle='#d8fffb';g.fillRect(x+12,y+9,4,3);g.fillRect(x+24,y+7,4,3)},
 stalag(g,x,y,P){g.fillStyle=mdShade(P.w1,1.2);g.beginPath();g.moveTo(x+6,y+38);g.lineTo(x+20,y+2);g.lineTo(x+34,y+38);g.closePath();g.fill();g.fillStyle='rgba(255,255,255,.25)';g.beginPath();g.moveTo(x+16,y+36);g.lineTo(x+20,y+6);g.lineTo(x+22,y+36);g.fill();g.strokeStyle=P.e;g.lineWidth=1.5;g.beginPath();g.moveTo(x+6,y+38);g.lineTo(x+20,y+2);g.lineTo(x+34,y+38);g.stroke()},
 ivoryspire(g,x,y){g.fillStyle='#f6f0e2';g.beginPath();g.moveTo(x+8,y+38);g.lineTo(x+20,y);g.lineTo(x+32,y+38);g.closePath();g.fill();g.strokeStyle='#b8ad98';g.lineWidth=1.5;g.stroke();g.beginPath();g.moveTo(x+12,y+26);g.lineTo(x+28,y+26);g.moveTo(x+15,y+16);g.lineTo(x+25,y+16);g.stroke()},
 column(g,x,y,P){g.fillStyle=mdShade(P.f1,.92);g.fillRect(x+10,y+4,20,32);g.fillStyle=mdShade(P.f1,.75);g.fillRect(x+7,y+2,26,5);g.fillRect(x+7,y+34,26,5);g.strokeStyle=P.e;g.lineWidth=1;for(let k=14;k<=26;k+=6){g.beginPath();g.moveTo(x+k,y+8);g.lineTo(x+k,y+33);g.stroke()}},
 crooked(g,x,y,P){g.fillStyle=mdShade(P.w1,1.15);g.beginPath();g.moveTo(x+8,y+38);g.quadraticCurveTo(x+12,y+18,x+28,y+2);g.quadraticCurveTo(x+22,y+22,x+32,y+38);g.closePath();g.fill();g.strokeStyle=P.e;g.lineWidth=1.5;g.stroke()},
 razor(g,x,y,P){g.fillStyle=mdShade(P.w1,1.2);g.beginPath();[[4,38],[10,14],[16,30],[20,4],[25,28],[31,12],[36,38]].forEach(([a,b],i)=>i?g.lineTo(x+a,y+b):g.moveTo(x+a,y+b));g.closePath();g.fill();g.strokeStyle='#dcdce8';g.lineWidth=1.2;g.stroke()},
 monolith(g,x,y,P){g.fillStyle=mdShade(P.w1,.9);g.fillRect(x+9,y+2,22,36);g.strokeStyle=P.e;g.lineWidth=1.5;g.strokeRect(x+9,y+2,22,36);g.strokeStyle=P.g;g.lineWidth=1.5;g.beginPath();g.arc(x+20,y+16,5,0,7);g.moveTo(x+20,y+24);g.lineTo(x+20,y+32);g.stroke()},
 glass(g,x,y){g.fillStyle='#231c2e';[[8,38,14,8],[18,38,22,2],[27,38,32,12]].forEach(([a,b,c,d])=>{g.beginPath();g.moveTo(x+a-5,y+b);g.lineTo(x+c,y+d);g.lineTo(x+a+5,y+b);g.closePath();g.fill()});g.strokeStyle='#b090e8';g.lineWidth=1.2;g.beginPath();g.moveTo(x+22,y+4);g.lineTo(x+20,y+30);g.stroke()},
 anvil(g,x,y){g.fillStyle='#4a4e58';g.fillRect(x+6,y+12,28,9);g.beginPath();g.moveTo(x+6,y+12);g.lineTo(x,y+14);g.lineTo(x+6,y+19);g.fill();g.fillRect(x+14,y+21,12,9);g.fillRect(x+9,y+30,22,6);g.fillStyle='#8f97a8';g.fillRect(x+6,y+12,28,2)},
 shelf(g,x,y){g.fillStyle='#4a3a2a';g.fillRect(x+4,y+4,32,34);['#7a5ac0','#c05a5a','#5a8ac0','#5ac08a','#c0a05a'].forEach((c,i)=>{g.fillStyle=c;g.fillRect(x+7+i*6,y+8,4,11);g.fillRect(x+7+((i+2)%5)*6,y+23,4,11)});g.fillStyle='#2a2018';g.fillRect(x+4,y+20,32,2)},
 rib(g,x,y){g.strokeStyle='#f0e8d4';g.lineWidth=5;g.lineCap='round';g.beginPath();g.moveTo(x+6,y+38);g.quadraticCurveTo(x+4,y+6,x+24,y+4);g.moveTo(x+18,y+38);g.quadraticCurveTo(x+18,y+14,x+34,y+10);g.stroke()},
 mast(g,x,y){g.fillStyle='#7a5434';g.fillRect(x+16,y,8,38);g.fillStyle='#e8dcc0';g.beginPath();g.moveTo(x+24,y+4);g.lineTo(x+38,y+18);g.lineTo(x+24,y+24);g.closePath();g.fill();g.strokeStyle='#4a321e';g.lineWidth=1;g.strokeRect(x+16,y,8,38)},
 kelpwall(g,x,y){g.strokeStyle='#4f8a4a';g.lineWidth=4;g.lineCap='round';for(let i=0;i<4;i++){const bx=x+6+i*9;g.beginPath();g.moveTo(bx,y+40);g.bezierCurveTo(bx-6,y+28,bx+6,y+14,bx-2,y);g.stroke()}},
 chimney(g,x,y,P){g.fillStyle=mdShade(P.w1,1.1);g.fillRect(x+10,y+10,20,28);g.fillStyle=mdShade(P.w1,.8);g.fillRect(x+8,y+8,24,6);g.fillStyle='rgba(255,255,255,.5)';g.beginPath();g.arc(x+18,y+5,5,0,7);g.arc(x+25,y+1,4,0,7);g.fill()},
 pillar(g,x,y,P){g.fillStyle=mdShade(P.w1,1.25);g.fillRect(x+9,y+4,22,34);g.strokeStyle=P.e;g.lineWidth=1.5;g.strokeRect(x+9,y+4,22,34);g.beginPath();g.moveTo(x+9,y+16);g.lineTo(x+31,y+16);g.moveTo(x+9,y+28);g.lineTo(x+31,y+28);g.stroke()},
 obsidspike(g,x,y){g.fillStyle='#16101e';g.beginPath();g.moveTo(x+5,y+38);g.lineTo(x+14,y+10);g.lineTo(x+20,y+20);g.lineTo(x+26,y+2);g.lineTo(x+35,y+38);g.closePath();g.fill();g.strokeStyle='#ff6a3a';g.lineWidth=1.3;g.stroke()}};
// hazards look like what they are, with a faint warning ring
const MD_HZDRAW={
 brine(g,x,y){g.fillStyle='rgba(60,190,170,.75)';g.beginPath();g.ellipse(x+20,y+21,15,11,0,0,7);g.fill();g.fillStyle='#fff';g.fillRect(x+12,y+16,3,3);g.fillRect(x+24,y+22,2,2)},
 dripfall(g,x,y){g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(x+20,y+24,13,7,0,0,7);g.fill();g.strokeStyle='#ff5a4a';g.setLineDash([3,3]);g.lineWidth=2;g.beginPath();g.ellipse(x+20,y+24,13,7,0,0,7);g.stroke();g.setLineDash([])},
 rubble(g,x,y){g.fillStyle='#8c8478';for(let i=0;i<5;i++){g.beginPath();g.arc(x+8+i*6,y+20+(i%2)*6,4,0,7);g.fill()}g.strokeStyle='#ff5a4a';g.setLineDash([3,3]);g.lineWidth=1.5;g.strokeRect(x+3,y+3,34,34);g.setLineDash([])},
 geyser(g,x,y){g.fillStyle='#3a3835';g.beginPath();g.ellipse(x+20,y+24,12,7,0,0,7);g.fill();g.fillStyle='rgba(160,220,255,.7)';g.beginPath();g.ellipse(x+20,y+23,7,4,0,0,7);g.fill();g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.arc(x+16,y+12,5,0,7);g.arc(x+23,y+7,4,0,7);g.fill()},
 acid(g,x,y){g.fillStyle='rgba(150,230,60,.8)';g.beginPath();g.ellipse(x+20,y+21,15,11,0,0,7);g.fill();g.strokeStyle='#eaffb0';g.lineWidth=1.3;g.beginPath();g.arc(x+15,y+18,3,0,7);g.arc(x+25,y+24,2,0,7);g.stroke()},
 mercury(g,x,y){g.fillStyle='#c8ceda';g.beginPath();g.ellipse(x+20,y+21,14,10,0,0,7);g.fill();g.fillStyle='#ffffff';g.beginPath();g.ellipse(x+15,y+17,5,2,0,0,7);g.fill()},
 mud(g,x,y){g.fillStyle='#5a4028';g.beginPath();g.ellipse(x+20,y+21,15,11,0,0,7);g.fill();g.strokeStyle='#b08a5e';g.lineWidth=1.5;g.beginPath();g.arc(x+15,y+18,3,0,7);g.arc(x+25,y+23,2.5,0,7);g.stroke()},
 lava(g,x,y){const gr=g.createRadialGradient(x+20,y+20,2,x+20,y+20,17);gr.addColorStop(0,'#fff09a');gr.addColorStop(.5,'#ff8a2a');gr.addColorStop(1,'#a82a10');g.fillStyle=gr;g.beginPath();g.ellipse(x+20,y+21,15,11,0,0,7);g.fill();g.strokeStyle='#3a1208';g.lineWidth=1.5;g.stroke()}};
// wall decorations sit on wall tiles that face a floor tile below
const MD_WALL={
 salt(g,x,y,R){g.fillStyle='rgba(250,250,245,.8)';for(let i=0;i<3;i++)g.fillRect(x+4+R()*30,y+26+R()*8,3+R()*3,3)},
 drips(g,x,y,R){g.fillStyle='rgba(160,210,245,.8)';for(let i=0;i<2;i++){const cx=x+8+R()*24;g.fillRect(cx,y+28,2,6+R()*4);g.beginPath();g.arc(cx+1,y+36,2,0,7);g.fill()}},
 coral(g,x,y,R){g.strokeStyle='#f27a9a';g.lineWidth=2.5;g.lineCap='round';const cx=x+10+R()*20;g.beginPath();g.moveTo(cx,y+34);g.lineTo(cx,y+24);g.lineTo(cx-5,y+20);g.moveTo(cx,y+27);g.lineTo(cx+5,y+22);g.stroke()},
 shells(g,x,y,R){const cx=x+10+R()*20;g.fillStyle='#f3dccb';g.beginPath();g.moveTo(cx-5,y+33);g.quadraticCurveTo(cx,y+22,cx+5,y+33);g.fill()},
 barnacles(g,x,y,R){g.fillStyle='#d8d4c8';for(let i=0;i<3;i++){const cx=x+6+R()*28;g.beginPath();g.moveTo(cx-3,y+34);g.lineTo(cx,y+28);g.lineTo(cx+3,y+34);g.fill()}},
 cracks(g,x,y,R,P){g.strokeStyle=P.e;g.lineWidth=1.5;g.beginPath();let px=x+6+R()*20,py=y+6;g.moveTo(px,py);for(let i=0;i<3;i++){px+=(R()-.5)*14;py+=8;g.lineTo(px,py)}g.stroke()},
 moss(g,x,y,R){g.fillStyle='#6f9a4a';for(let i=0;i<4;i++){g.beginPath();g.arc(x+4+R()*32,y+32+R()*4,3+R()*2,0,7);g.fill()}},
 roots(g,x,y,R){g.strokeStyle='#5a3e22';g.lineWidth=2;const cx=x+8+R()*24;g.beginPath();g.moveTo(cx,y+20);g.quadraticCurveTo(cx+5,y+30,cx-2,y+40);g.stroke()},
 glowcaps(g,x,y,R){const cx=x+8+R()*24;g.fillStyle='rgba(111,230,224,.3)';g.beginPath();g.arc(cx,y+31,7,0,7);g.fill();g.fillStyle='#6fe6e0';g.beginPath();g.ellipse(cx,y+31,5,3,0,Math.PI,0);g.fill()},
 bats(g,x,y,R){if(R()<.5)return;const cx=x+10+R()*20,cy=y+30;g.fillStyle='#2a2232';g.beginPath();g.moveTo(cx,cy);g.lineTo(cx-8,cy-4);g.lineTo(cx-4,cy+1);g.lineTo(cx,cy+4);g.lineTo(cx+4,cy+1);g.lineTo(cx+8,cy-4);g.closePath();g.fill();g.fillStyle='#ffd84d';g.fillRect(cx-2,cy,1.5,1.5);g.fillRect(cx+1,cy,1.5,1.5)},
 fangs(g,x,y,R,P){g.fillStyle=mdShade(P.w1,1.3);for(let i=0;i<2;i++){const cx=x+8+R()*24,h=6+R()*10;g.beginPath();g.moveTo(cx-4,y+33);g.lineTo(cx,y+33+h*.6);g.lineTo(cx+4,y+33);g.fill()}},
 veins(g,x,y,R,P){g.strokeStyle=P.g;g.globalAlpha=.7;g.lineWidth=1.5;g.beginPath();g.moveTo(x+4,y+10+R()*20);g.lineTo(x+18,y+14+R()*16);g.lineTo(x+36,y+8+R()*20);g.stroke();g.globalAlpha=1},
 soot(g,x,y,R){g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(x+20,y+30,14,6,0,0,7);g.fill()},
 glassvein(g,x,y,R){g.strokeStyle='#b090e8';g.lineWidth=2;g.beginPath();g.moveTo(x+6+R()*10,y+4);g.lineTo(x+18,y+20);g.lineTo(x+12+R()*20,y+34);g.stroke()},
 pipes(g,x,y){g.fillStyle='#6a5a4e';g.fillRect(x,y+22,40,6);g.fillStyle='#8a7a6e';g.fillRect(x,y+22,40,2);g.fillStyle='#4a3e36';g.fillRect(x+18,y+20,5,10)},
 bricks(g,x,y,R,P){g.strokeStyle=P.e;g.lineWidth=1;for(let r=0;r<3;r++){g.beginPath();g.moveTo(x,y+10+r*10);g.lineTo(x+40,y+10+r*10);g.stroke();for(let c=(r%2)*10;c<40;c+=20){g.beginPath();g.moveTo(x+c,y+r*10);g.lineTo(x+c,y+10+r*10);g.stroke()}}},
 fossils(g,x,y,R){if(R()<.5)return;g.strokeStyle='#d8c8a0';g.lineWidth=1.5;const cx=x+20,cy=y+22;g.beginPath();for(let t=0;t<10;t+=.4){const rr=8-t*.7;g.lineTo(cx+rr*Math.cos(t),cy+rr*Math.sin(t))}g.stroke()},
 shelves(g,x,y,R){g.fillStyle='#3a2c20';g.fillRect(x+3,y+12,34,24);['#7a5ac0','#c05a5a','#5a8ac0','#5ac08a'].forEach((c,i)=>{g.fillStyle=c;g.fillRect(x+6+i*8,y+15,5,19)})},
 lanterns(g,x,y,R){if(R()<.4)return;const cx=x+8+R()*24,cy=y+26;const gr=g.createRadialGradient(cx,cy,0,cx,cy,10);gr.addColorStop(0,'rgba(255,240,170,.9)');gr.addColorStop(1,'rgba(255,240,170,0)');g.fillStyle=gr;g.beginPath();g.arc(cx,cy,10,0,7);g.fill()},
 windows(g,x,y,R){if(R()<.5)return;g.fillStyle='rgba(150,200,255,.55)';g.beginPath();g.moveTo(x+13,y+36);g.lineTo(x+13,y+16);g.arc(x+20,y+16,7,Math.PI,0);g.lineTo(x+27,y+36);g.closePath();g.fill();g.strokeStyle='#d8e8ff';g.lineWidth=1;g.stroke()},
 crystals(g,x,y,R){const cx=x+8+R()*24;g.fillStyle='#cfe8ff';g.beginPath();g.moveTo(cx-4,y+36);g.lineTo(cx,y+22);g.lineTo(cx+4,y+36);g.fill()},
 sulfur(g,x,y,R){g.fillStyle='#e8d04a';for(let i=0;i<3;i++){g.beginPath();g.arc(x+6+R()*28,y+33+R()*4,2+R()*2,0,7);g.fill()}},
 banners(g,x,y,R){if(R()<.5)return;g.fillStyle='#9a2a2a';g.fillRect(x+14,y+6,12,24);g.beginPath();g.moveTo(x+14,y+30);g.lineTo(x+20,y+36);g.lineTo(x+26,y+30);g.fill();g.fillStyle='#ffd24a';g.fillRect(x+18,y+14,4,4)},
 bars(g,x,y){g.fillStyle='#14101a';g.fillRect(x+6,y+8,28,28);g.fillStyle='#7d7a88';for(let k=8;k<34;k+=6)g.fillRect(x+k,y+8,2,28)},
 braziers(g,x,y,R){if(R()<.5)return;const cx=x+20;g.fillStyle='rgba(255,150,60,.35)';g.beginPath();g.arc(cx,y+24,12,0,7);g.fill();g.fillStyle='#ffb43a';g.beginPath();g.moveTo(cx-5,y+30);g.quadraticCurveTo(cx,y+12,cx+5,y+30);g.fill();g.fillStyle='#4a3a30';g.fillRect(cx-6,y+30,12,4)},
 runes(g,x,y,R,P){if(R()<.5)return;g.strokeStyle=P.g;g.globalAlpha=.8;g.lineWidth=1.5;g.beginPath();g.arc(x+20,y+22,7,0,7);g.moveTo(x+20,y+15);g.lineTo(x+20,y+29);g.stroke();g.globalAlpha=1}};
// draws the floor pattern and every decoration onto the floor's tile canvas (seeded by the floor, so it never changes)
function mdDecorate(g,r,fl,th){const s=mdSub(r);if(!s)return;const T=GD_T,P=th;let seed=mdHash(fl.id||'x');const R=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
 const raw=(x,y)=>x<0||y<0||x>=fl.w||y>=fl.h?0:+fl.tiles[y][x],isOb=(x,y)=>fl.ob&&fl.ob[y*fl.w+x]==='1';
 for(let y=0;y<fl.h;y++)for(let x=0;x<fl.w;x++){const X=x*T,Y=y*T;
  if(raw(x,y)){
   if(th.pat==='bricks'){g.strokeStyle='rgba(0,0,0,.18)';g.lineWidth=1;g.beginPath();g.moveTo(X,Y+20);g.lineTo(X+T,Y+20);g.moveTo(X+(y%2?10:30),Y);g.lineTo(X+(y%2?10:30),Y+20);g.moveTo(X+(y%2?30:10),Y+20);g.lineTo(X+(y%2?30:10),Y+T);g.stroke()}
   else if(th.pat==='tiles'){g.strokeStyle='rgba(0,0,0,.16)';g.lineWidth=1;g.strokeRect(X+.5,Y+.5,T-1,T-1)}
   else if(th.pat==='planks'){g.strokeStyle='rgba(0,0,0,.2)';g.lineWidth=1;for(let k=10;k<T;k+=10){g.beginPath();g.moveTo(X,Y+k);g.lineTo(X+T,Y+k);g.stroke()}}
   if(isOb(x,y)){(MD_OBS[s.obs&&s.obs[0]]||MD_OBS.boulder)(g,X,Y,P);continue}
   if(fl.hz&&fl.hz[gdKey(x,y)]){(MD_HZDRAW[fl.hz[gdKey(x,y)]]||MD_HZDRAW.rubble)(g,X,Y);continue}
   if(R()<.13){const k=s.props[Math.floor(R()*s.props.length)];(MD_DRAW[k]||MD_DRAW.pebble)(g,X,Y,R,P)}}
  else if(raw(x,y+1)&&R()<.45&&MD_WALL[s.wall])MD_WALL[s.wall](g,X,Y,R,P)}}
// ---------- the info button ----------
function mdEnvBtn(r){const s=mdSub(r);if(!s)return '';return '<button class="tw-envbtn md-envbtn" onclick="event.stopPropagation();mdEnvInfo()" aria-label="Sublayer">'+s.icon+'<b>B'+((r.floor||0)+1)+'F</b></button>'}
function mdEnvInfo(){const r=mdRun();if(!r||!r.sub)return;const s=mdSub(r),{i,L}=mdLayerAt(r.floor||0),th=mdTheme(r),left=r.sub.left||0;
 modal(s.icon+' '+s.name.toUpperCase(),'<div class="md-envinfo" style="--a:'+th.f1+';--b:'+th.w1+';--c:'+L.col+'"><span>'+s.icon+'</span></div><p><b>B'+((r.floor||0)+1)+'F</b> · '+L.name+' · Layer '+(i+1)+(L.final?' (final layer)':'')+'</p><ul class="md-fx">'+mdDesc(s.fx).map(t=>'<li>'+t+'</li>').join('')+'</ul><p class="small">'+(left?'This sublayer goes on for '+left+' more floor'+(left>1?'s':'')+'.':'The next floor starts a new sublayer.')+'</p><div class="actions"><button class="btn red" onclick="closeModal()">OK</button></div>')}
// ---------- the digging cutscene ----------
// A slice through the planet: 8 coloured bands around a glowing core. A tunnel digs down to the new sublayer, a flag pops
// up with a puff of dust, a line leads to the layer's name, which glitches in. Then the view irises out to black and back
// in on the floor. Tap anywhere to skip.
function mdBands(){const R=1000,core=280,w=MD_LAYERS.map(l=>Math.pow(l.floors,.6)),tot=w.reduce((a,b)=>a+b,0);let r0=R;return MD_LAYERS.map((l,i)=>{const t=(R-core)*w[i]/tot,o={i,ro:r0,ri:r0-t,col:l.col};r0-=t;return o})}
function mdDepth(f){const B=mdBands(),{i,start,L}=mdLayerAt(f),b=B[i];return b.ro-(b.ro-b.ri)*Math.min(.95,Math.max(.12,(f-start+.5)/L.floors))}
function mdDig(r){return new Promise(done=>{const s=mdSub(r),{i:li,L}=mdLayerAt(r.floor||0);if(!s){done();return}
 try{document.fonts&&document.fonts.load('700 30px "Pixelify Sans"')}catch(e){}document.querySelectorAll('.md-dig').forEach(x=>x.remove());const ov=document.createElement('div');ov.className='md-dig';ov.innerHTML='<canvas></canvas><div class="md-skip">Tap to skip</div>';document.body.appendChild(ov);
 const cv=ov.querySelector('canvas'),g=cv.getContext('2d'),dpr=Math.min(2,devicePixelRatio||1);let W=0,H=0;const fit=()=>{W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+'px';cv.style.height=H+'px'};fit();
 const B=mdBands(),ang=-0.88,dir=[Math.cos(ang),Math.sin(ang)],perp=[-dir[1],dir[0]],digs=(r.digs||[]).slice(),prevF=digs.length>1?digs[digs.length-2].f:null,toR=mdDepth(r.floor||0),fromR=prevF==null?1060:mdDepth(prevF);
 const wob=rad=>Math.sin(rad*.045)*10+Math.sin(rad*.013)*16,at=rad=>{const o=wob(rad);return [dir[0]*rad+perp[0]*o,dir[1]*rad+perp[1]*o]};
 let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};const speck=Array.from({length:520},()=>{const a=rnd()*Math.PI*2,rr=Math.sqrt(rnd())*1000;return [Math.cos(a)*rr,Math.sin(a)*rr,rnd()]}),stars=Array.from({length:60},()=>[rnd(),rnd(),rnd()]);
 const dirt=[],fog=[],T0=performance.now(),digMs=Math.min(1700,Math.max(800,Math.abs(fromR-toR)*9)),tl={dig:250,flag:250+digMs,line:250+digMs+420,name:250+digMs+900,sub:250+digMs+1500,hold:250+digMs+2100,out:250+digMs+3300,black:250+digMs+3850};
 let skipAt=null,phase='run',inT=0,scale=1;const ease=t=>t<0?0:t>1?1:1-Math.pow(1-t,3);
 const glyph='▓▒░#@%&$*+=?/\\|<>01ABCDEFXYZ',glitch=(txt,p,t)=>{const n=Math.floor(txt.length*p);return txt.split('').map((c,k)=>k<n||c===' '?c:glyph[Math.floor((Math.sin(t*.05+k*7.3)*.5+.5)*glyph.length)]).join('')};
 const name=L.name,subLine='Layer '+(li+1)+(L.final?' (Final)':'')+' — '+s.name;
 const finish=()=>{ov.remove();done()},A0x=pt=>pt[0]-34;
 ov.addEventListener('click',()=>{if(phase==='run'){skipAt=performance.now();phase='black'}});
 const frame=now=>{if(!ov.isConnected)return;const t=now-T0;if(W!==innerWidth||H!==innerHeight)fit();g.setTransform(dpr,0,0,dpr,0,0);
  if(phase==='black'){g.fillStyle='#000';g.fillRect(0,0,W,H);ov.classList.add('clear');phase='in';inT=now;requestAnimationFrame(frame);return}
  if(phase==='in'){const p=ease((now-inT)/(skipAt?380:620)),rad=Math.hypot(W,H)*p;g.clearRect(0,0,W,H);g.fillStyle='#000';g.fillRect(0,0,W,H);g.globalCompositeOperation='destination-out';g.beginPath();g.arc(W/2,H*.45,rad,0,7);g.fill();g.globalCompositeOperation='source-over';if(p>=1){finish();return}requestAnimationFrame(frame);return}
  // camera follows the digging tip
  const pd=ease((t-tl.dig)/digMs),curR=fromR+(toR-fromR)*pd,tip=at(curR);scale=Math.min(W,H)/430;const cx=W*.74-tip[0]*scale,cy=H*.58-tip[1]*scale,P=([x,y])=>[cx+x*scale,cy+y*scale];
  // space, then the bands and the core
  const sk=g.createLinearGradient(0,0,0,H);sk.addColorStop(0,'#120d22');sk.addColorStop(1,'#1d1530');g.fillStyle=sk;g.fillRect(0,0,W,H);g.fillStyle='#fff';stars.forEach(([a,b,c])=>{g.globalAlpha=.25+c*.5;g.fillRect(a*W,b*H,1.5,1.5)});g.globalAlpha=1;
  const C=P([0,0]);B.forEach(b=>{const gr=g.createRadialGradient(C[0],C[1],b.ri*scale,C[0],C[1],b.ro*scale);gr.addColorStop(0,mdShade(b.col,.8));gr.addColorStop(.6,b.col);gr.addColorStop(1,mdShade(b.col,1.12));g.fillStyle=gr;g.beginPath();g.arc(C[0],C[1],b.ro*scale,0,7);g.fill();g.strokeStyle='rgba(0,0,0,.22)';g.lineWidth=2;g.stroke()});
  const cg=g.createRadialGradient(C[0],C[1],0,C[0],C[1],280*scale);cg.addColorStop(0,'#fffde0');cg.addColorStop(1,MD_CORE);g.fillStyle=cg;g.beginPath();g.arc(C[0],C[1],280*scale,0,7);g.fill();
  g.save();g.beginPath();g.arc(C[0],C[1],1000*scale,0,7);g.clip();speck.forEach(([x,y,c])=>{const q=P([x,y]);if(q[0]<-4||q[1]<-4||q[0]>W+4||q[1]>H+4)return;g.fillStyle=c<.5?'rgba(0,0,0,.12)':'rgba(255,255,255,.1)';g.fillRect(q[0],q[1],3,2)});g.restore();
  // the tunnel from the surface to the tip, old flags along it
  const path=[];for(let rr=1070;rr>=curR;rr-=6)path.push(P(at(rr)));path.push(P(tip));
  [[26,'#2a180a'],[18,'#5a3a1e'],[7,'#7a5230']].forEach(([w,c])=>{g.strokeStyle=c;g.lineWidth=w*scale/2.2;g.lineCap='round';g.lineJoin='round';g.beginPath();path.forEach((q,k)=>k?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.stroke()});
  digs.slice(0,-1).forEach(d=>{const q=P(at(mdDepth(d.f)));g.strokeStyle='#e8e2d6';g.lineWidth=2;g.beginPath();g.moveTo(q[0],q[1]);g.lineTo(q[0],q[1]-16);g.stroke();g.fillStyle='#b8b2a6';g.beginPath();g.moveTo(q[0],q[1]-16);g.lineTo(q[0]+9,q[1]-12);g.lineTo(q[0],q[1]-8);g.fill()});
  const tp=P(tip);if(t>tl.dig&&t<tl.flag&&Math.random()<.8)for(let k=0;k<2;k++)dirt.push({x:tp[0],y:tp[1],vx:(Math.random()-.5)*3,vy:-Math.random()*3-1,l:1,c:['#5a3a1e','#7a5230',B[li].col][k%3]});
  dirt.forEach(d=>{d.x+=d.vx;d.y+=d.vy;d.vy+=.18;d.l-=.025;g.globalAlpha=Math.max(0,d.l);g.fillStyle=d.c;g.fillRect(d.x,d.y,4,4)});g.globalAlpha=1;for(let k=dirt.length-1;k>=0;k--)if(dirt[k].l<=0)dirt.splice(k,1);
  // the flag pops up and plants itself with a puff of dust
  let poleTop=[tp[0],tp[1]-54];if(t>=tl.flag){const pf=(t-tl.flag)/360,sc=pf<1?Math.sin(pf*Math.PI*.5)*1.18-(pf>.7?(pf-.7)*.6:0):1,h=54*sc;poleTop=[tp[0],tp[1]-h];
   if(!fog.length)for(let k=0;k<12;k++)fog.push({a:Math.PI*(1+k/11),s:.6+Math.random()*.8});const fp=Math.min(1,(t-tl.flag)/1000);
   fog.forEach(f=>{const rr=(8+fp*34)*f.s;g.globalAlpha=(1-fp)*.7;g.fillStyle='#f4f0e8';g.beginPath();g.arc(tp[0]+Math.cos(f.a)*rr*1.6,tp[1]+Math.sin(f.a)*rr*.5,6+fp*12*f.s,0,7);g.fill()});g.globalAlpha=1;
   g.strokeStyle='#2a1a10';g.lineWidth=5;g.lineCap='round';g.beginPath();g.moveTo(tp[0],tp[1]);g.lineTo(poleTop[0],poleTop[1]);g.stroke();g.strokeStyle='#e8e2d6';g.lineWidth=2.5;g.stroke();
   const wv=Math.sin(t*.008)*3;g.fillStyle='#e8322a';g.strokeStyle='#5a0a08';g.lineWidth=2;g.beginPath();g.moveTo(poleTop[0],poleTop[1]);g.quadraticCurveTo(poleTop[0]+12,poleTop[1]+4+wv,poleTop[0]+24*sc,poleTop[1]+9+wv);g.lineTo(poleTop[0],poleTop[1]+18*sc);g.closePath();g.fill();g.stroke()}
  // the line out to the name
  if(t>=tl.line){const pl=ease((t-tl.line)/520),A=[poleTop[0]-34,poleTop[1]-46],Lw=Math.max(140,Math.min(340,A0x(poleTop)-18)),Bp=[A[0]-Lw,A[1]],seg1=Math.hypot(A[0]-poleTop[0],A[1]-poleTop[1]),tot=seg1+Lw,dd=pl*tot;
   const pts=[[poleTop[0]-4,poleTop[1]-2]];if(dd<=seg1)pts.push([poleTop[0]+(A[0]-poleTop[0])*dd/seg1,poleTop[1]+(A[1]-poleTop[1])*dd/seg1]);else{pts.push(A);pts.push([A[0]-(dd-seg1),A[1]])}
   [[6,'#000'],[3,'#fff']].forEach(([w,c])=>{g.strokeStyle=c;g.lineWidth=w;g.lineCap='round';g.beginPath();pts.forEach((q,k)=>k?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.stroke()});
   const mid=(A[0]+Bp[0])/2,txt=(str,p,y,size,wgt,tt)=>{const out=glitch(str,p,tt);let fs=size;g.font=wgt+' '+fs+'px "Pixelify Sans",system-ui,sans-serif';while(g.measureText(out).width>Lw+40&&fs>12){fs--;g.font=wgt+' '+fs+'px "Pixelify Sans",system-ui,sans-serif'}g.textAlign='center';g.textBaseline='middle';
    const jit=p<1?(Math.random()-.5)*6:0;if(p<1){g.globalAlpha=.7;g.fillStyle='#ff2a6a';g.fillText(out,mid+jit-3,y);g.fillStyle='#2af0ff';g.fillText(out,mid-jit+3,y);g.globalAlpha=1}
    g.lineWidth=Math.max(3,fs/5);g.strokeStyle='#000';g.lineJoin='round';g.strokeText(out,mid+jit,y);g.fillStyle='#fff';g.fillText(out,mid+jit,y);
    if(p<1&&Math.random()<.5){const sy=y-fs/2+Math.random()*fs,sh=3+Math.random()*5;try{const im=g.getImageData((mid-Lw/2)*dpr,sy*dpr,Lw*dpr,sh*dpr);g.putImageData(im,(mid-Lw/2+(Math.random()-.5)*14)*dpr,sy*dpr)}catch(e){}}};
   if(t>=tl.name)txt(name,Math.min(1,(t-tl.name)/600),A[1]-22,30,'700',t);if(t>=tl.sub)txt(subLine,Math.min(1,(t-tl.sub)/650),A[1]+19,17,'500',t)}
  // iris out on the tip
  if(t>=tl.out){const p=ease((t-tl.out)/550),rad=Math.hypot(W,H)*(1-p);g.save();g.fillStyle='#000';g.beginPath();g.rect(0,0,W,H);g.moveTo(tp[0]+Math.max(0,rad),tp[1]);g.arc(tp[0],tp[1],Math.max(0,rad),0,Math.PI*2,true);g.fill('evenodd');g.restore();if(p>=1){phase='black'}}
  requestAnimationFrame(frame)};
 requestAnimationFrame(frame)})}
// the very last floor: the run ends at the core
function mdFinal(){const r=runOf();r.clearedFloors=(r.clearedFloors||0)+1;save();const bonus=dgFloorBonus(r);
 $('dgStage').innerHTML='<div class="dg-room"><span class="dg-big">🏆</span><h3>The Final Seal is broken!</h3><p>You dug through all 8 layers, all the way to the core. Leave with a <b>'+bonus+' Cog</b> bonus.</p><div class="actions"><button class="btn red" onclick="dgEnd(true)">🏠 LEAVE WITH REWARDS</button></div></div>';$('dgPanel').innerHTML=dgPanelMap()}
