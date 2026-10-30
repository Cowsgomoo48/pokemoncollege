# Expanded signature move compatibility

Adds TM eligibility; existing learners, Mew compatibility, move statistics and capture move pools are preserved. Speed uses the app’s base-stat scale (source /10).

Canonical prerequisite data: Pokémon Showdown learnsets blob 75488936bdf90a2b42d05b56697809cb5332fa34; move flags from its moves.ts. Earlier-stage learnsets are inherited. Rules use this frozen prerequisite data, never other newly granted moves.

| Move | Reason | Eligible current species |
|---|---|---|
| Shell Trap | Shell + Fire move or Scald/Steam Eruption; Blastoise cannon exception | Squirtle, Wartortle, Blastoise, Krabby, Kingler, Magcargo, Torkoal, Corphish, Crawdaunt, Shelgon, Wimpod, Golisopod |
| Sparkling Aria | Water type with an existing sound move | Manaphy, Squirtle, Wartortle, Blastoise, Poliwag, Poliwhirl, Poliwrath, Shellder, Cloyster, Krabby, Kingler, Wooper, Quagsire, Mudkip, Marshtomp, Swampert, Wailmer, Wailord, Barboach, Whiscash, Corphish, Crawdaunt, Kyogre, Shellos, Gastrodon, Pyukumuku, Gyarados, Dewpider, Araquanid, Wimpod, Golisopod |
| Flower Trick | Grass starter evolution lines | None currently in roster |
| Mountain Gale | Flying type with an existing Ice move | Skarmory, Gyarados |
| Flying Press | Flying type with punch, kick, Foul Play or close combat capability | Scyther, Skarmory, Noibat, Noivern, Celesteela, Salamence |
| Combat Torque | Dark type with app base Speed >=9 (source Speed >=90) | Chi-Yu |
| Beak Blast | Any Flying type | Scyther, Skarmory, Noibat, Noivern, Celesteela, Gyarados, Salamence, Yanma, Yanmega |
| Stone Axe | Rock golem or axe/blade anatomy | Scyther, Regirock, Pawniard, Bisharp, Kingambit, Lurantis |
| Pyro Ball | Fire-capable kicking specialists | Lopunny |
| Bitter Blade | Flaming or spectral blade users | Honedge, Doublade, Aegislash, Armarouge, Ceruledge |
| Armor Cannon | Armored artillery, cannons or metal beam emitters | Blastoise, Magnezone, Genesect, Celesteela, Magearna, Armarouge, Duraludon, Archaludon |
| Fishious Rend | Water predators with prominent jaws | Crawdaunt, Gyarados |
| Triple Dive | Large aquatic diving attackers | Blastoise, Swampert, Wailmer, Wailord, Kyogre, Gyarados |
| Snipe Shot | Water cannons or aimed aquatic projectiles | Blastoise |
| Zing Zap | Electric type with physical contact attacks | Magnemite, Magneton, Magnezone, Tynamo, Eelektrik, Eelektross, Xurkitree, Regieleki, Joltik, Galvantula |
| Overdrive | Electric sound/resonance specialists | Magneton, Magnezone, Regieleki, Rotom |
| Double Shock | Electric type with physical discharge moves | Magnemite, Magneton, Magnezone, Tynamo, Eelektrik, Eelektross, Xurkitree, Regieleki, Joltik, Galvantula |
| Electro Shot | Existing Electric beam attackers | Magneton, Magnezone, Genesect, Xurkitree, Regieleki, Duraludon, Archaludon |
| Trop Kick | Grass humanoids with kicking legs | Lilligant, Ogerpon, Leavanny, Lurantis, Steenee, Tsareena |
| Drum Beating | Plant bodies or limbs suited to rhythmic pounding | Sudowoodo, Abomasnow, Trevenant, Maractus |
| Apple Acid | Fruit-bearing plants | Bounsweet, Steenee, Tsareena |
| Grav Apple | Fruit-bearing plants with telekinetic capability | None currently in roster |
| Chloroblast | Powerful plant energy emitters | Celebi, Cradily, Abomasnow, Lilligant, Ogerpon, Maractus, Lurantis |
| Matcha Gotcha | Leaf infusion, drain or tea-themed plant specialists | Petilil, Lilligant |
| Shell Side Arm | Shell-based projectile or claw appendages | Blastoise, Cloyster, Kingler, Crawdaunt, Golisopod |
| Barb Barrage | Poisonous barbs, quills or stingers | Beedrill, Clodsire, Weedle, Paldean Wooper |
| Dire Claw | Clawed attackers with established poison offense | Beedrill, Crawdaunt, Golisopod |
| Mortal Spin | Spinning poison or bladed bodies | Beedrill, Ferroseed, Ferrothorn |
| Floaty Fall | Winged physical aerial divers | Scyther, Skarmory, Gyarados, Salamence, Yanma, Yanmega |
| Lumina Crash | Psychic light emitters | Gardevoir, Jirachi, Elgyem, Delphox, Gothitelle, Hatterene |
| Twin Beam | Paired eyes, arms or heads projecting Psychic energy | Gardevoir, Metang, Metagross, Elgyem, Solosis, Duosion, Reuniclus, Gothorita, Gothitelle |
| Attack Order | Commanding or coordinating swarming insects | Beedrill, Leavanny, Golisopod |
| Accelerock | Rock type with app base Speed >=6 or priority physical attack | Onix, Tyranitar |
| Salt Cure | Sea-salt or mineral bodies | Regirock, Roggenrola, Boldore, Gigalith, Carbink, Diancie |
| Shadow Bone | Bone or ghostly limb weapons | Cofagrigus, Trevenant, Runerigus, Spiritomb |
| Spirit Shackle | Ghost projectiles, blades or binding shadows | Cofagrigus, Aegislash, Trevenant, Marshadow, Runerigus, Ceruledge, Spiritomb |
| Rage Fist | Physical fists channeling rage or spiritual energy | Poliwrath, Marshadow, Melmetal, Regigigas |
| Clanging Scales | Dragon armored scales or metal plates | Regidrago, Duraludon, Archaludon, Gyarados, Bagon, Shelgon, Salamence |
| Order Up | Large aquatic dragons commanding their territory | Kyogre, Gyarados |
| Fickle Beam | Dragon beam users with multiple heads or variable energy | Regidrago, Duraludon, Archaludon |
| Night Daze | Dark type with special shadow attacks | Crawdaunt, Chi-Yu, Tyranitar, Absol, Spiritomb, Pawniard, Bisharp, Kingambit |
| Kowtow Cleave | Bowed head blades or disciplined edged weapons | Aegislash, Iron Valiant, Absol, Pawniard, Bisharp, Kingambit |
| Anchor Shot | Heavy metal hooks, claws or tethered appendages | Metang, Metagross, Celesteela, Melmetal, Ferrothorn |
| Make It Rain | Bodies of treasure or precious metal | Meltan, Melmetal, Diancie |
| Gigaton Hammer | Hammer wielders or established Hammer Arm users | Metagross, Regirock, Registeel, Melmetal, Tinkatink, Tinkatuff, Tinkaton, Regigigas |
| Spirit Break | Physical attackers wielding spiritual or fairy energy | Mawile, Mimikyu, Marshadow, Iron Valiant, Ogerpon |
| Strange Steam | Steam, gases or mist-producing bodies | Magcargo, Torkoal, Volcarona, Iron Moth |
| Magical Torque | Magical Fairy constructs or armored combatants | Mawile, Magearna, Tinkaton, Iron Valiant, Klefki, Diancie |
| Last Respects | Spirits explicitly associated with departed souls | Yamask, Cofagrigus, Runerigus, Spiritomb |
