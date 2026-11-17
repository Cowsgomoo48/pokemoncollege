# v1.4.0: Pokémon movesets, smarter enemies, status card rework

## Enemy movesets (96 notable Pokémon)
- Every fully evolved or competitively notable Pokémon in the enemy pool now has its own **4-step pattern**. Each pattern is built from its common competitive (Smogon) moves, as far as I know them.
- **Choice steps:** a step can be a choice. A low-HP enemy (under 50%) prefers the Block or healing option; otherwise it avoids repeating its last choice.
  - Example, Torkoal: Stealth Rock → Lava Plume (heavy, hits your whole team) → Rapid Spin (weak hit + Block) → Yawn or Protect, then the cycle repeats.
- **Two of the same species** in one fight start their patterns one step apart.
- **Elites and signature bosses:** their own rules still come first. The new moveset only fills in on turns those rules don't plan.
- **Species:**
  - Abomasnow, Absol, Aegislash, Aggron, Araquanid, Archaludon, Armarouge, Beedrill, Bisharp, Blastoise, Carbink, Celebi, Celesteela, Ceruledge, Chandelure, Chi-Yu, Clodsire, Cloyster, Cofagrigus, Cradily, Crawdaunt
  - Delphox, Diancie, Duraludon, Eelektross, Eternatus, Ferrothorn, Flygon, Froslass, Frosmoth, Galvantula, Gardevoir, Gastrodon, Genesect, Gigalith, Golisopod, Gothitelle, Groudon, Gyarados
  - Hatterene, Iron Moth, Iron Valiant, Jirachi, Kingambit, Kingler, Klefki, Kyogre, Leavanny, Lilligant, Lopunny, Lurantis, Magcargo, Magearna, Magnezone, Manaphy, Marshadow, Mawile, Melmetal, Metagross, Mew, Mimikyu
  - Noivern, Ogerpon, Poliwrath, Pyukumuku, Quagsire, Regice, Regidrago, Regieleki, Regigigas, Regirock, Registeel, Reuniclus, Rotom, Runerigus, Salamence, Scyther, Skarmory, Skeledirge, Slither Wing, Spiritomb, Steelix, Sudowoodo, Swampert
  - Torkoal, Trevenant, Tsareena, Tyranitar, Volcanion, Volcarona, Wailord, Xurkitree, Yanmega, Zygarde
- **Everyone else** (basics and middle stages) keeps type-based moves, with smarter rules:
  - no two non-attacks in a row
  - Block and healing are 3× as likely under 35% HP
  - at most one status-card move every 3 turns per enemy
  - no healing at full HP

## Status cards: one per type (your rework)
| Card | Type | Rule |
|---|---|---|
| Daze | Normal | Unplayable. No other text. Discarded normally, so it keeps coming back this fight. |
| Scorch | Fire | Unplayable. **Ghastly**, answer a question: correct = nothing, Make-Up = 2 damage, incorrect = discarded instead of Exiled + 6 damage. |
| Whirlpool | Water | Same as Scorch. |
| Static Cling | Electric | 1 AP, playable. While it's in hand, the first card you play each turn costs +1 AP. Its own cost can't change. Playing it Exiles it. |
| Shrapnel | Rock / hazards | Unplayable. End of turn in hand: lose up to 4 Block, then Exile it. |
| Snare | Grass | 0 AP, playable. You can't draw cards until you play it. When played, answer a question: correct or Make-Up = Exile, incorrect = back to hand with Retain until your next turn. |
| Mind Haze | Psychic | Unplayable. No other text. |

- **Ghastly** is a new keyword with a tooltip: "If this card is in your hand after you end your turn, do its Ghastly effects, then Exile it."
- **Damage:** Scorch and Whirlpool damage goes straight to HP, as before.
- **Snare's opening draw:** Snare doesn't block your opening draw at the start of a turn, only draw effects.
- **Static Cling, more than one copy:** two copies still add only +1 total. Playing any card first, including Static Cling itself, uses up the surcharge for that turn.
- **Question cap:** at most 3 question cards (Scorch, Whirlpool, Snare) are added per fight. Enemies won't choose those moves once the cap is reached.
- **Type moves:**
  - Normal: new Yawn (Daze ×2)
  - Water: new Whirlpool (hit + Whirlpool card)
  - Grass: Stun Spore now adds Snare
  - Psychic: Confusion now adds Mind Haze
  - Ghost: Confuse Ray is now Weakened + Enfeebled
  - Bug: String Shot is now Enfeebled 2
  - Other types keep their debuff stacks until their status cards exist.
- **Removed:** Daze+, and Mind Haze's start-of-turn question.

## Tests
- tower-status suite rewritten for the new rules: 52 checks. They cover all Scorch outcomes, Whirlpool, reload safety, plain Daze/Mind Haze, Static Cling, Snare (blocked draws, both outcomes), the question cap and the Torkoal pattern.
- Every species set checked: all 96 use real moves and plan 8 turns without errors.
- Passing: deck-signature 205, deck-tower 40, tower-map 29, tower-events 44, tower-relics 102, tower-update 69, tower-multi 60, eqpractice 37.
- Sample fights at phone size (bot player):
  - 24 normal: 0 questions
  - 8 Elites: 1 question in 1 fight
  - 8 bosses: 1 question in 1 fight
  - 6 single moveset fights (Torkoal, Ferrothorn, Blastoise, Gothitelle, Magnezone, Lilligant): at most 1 question each
- Fix: a Treasure Room card upgrade could crash if the picked card had just changed. It's now guarded.
- Service worker cache bumped to 1026.
