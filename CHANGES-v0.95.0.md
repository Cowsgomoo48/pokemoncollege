# v0.95.0: New Tower cards for Poison, Ground, Flying, Psychic, Bug, Rock, Ghost, Dragon, Dark, Steel and Fairy

## New cards (57)
- **Poison:** Toxic Screen, Acid Trip, Sludge Wave
- **Ground:** Trench, Sand Tomb, Tectonic Shift, Aftershock, Rupture, Burrow, Unearth
- **Flying:** Crosswind, Feather Cloak, Slipstream, Divebomb, Hurricane, Rapid Rescue
- **Psychic:** Face the Future, Overwhelm, Simple Beam, Premonition, Rehearsal, Calculated Risk, Future Sight
- **Bug:** Feed the Swarm, Twineedle, Megahorn, Silk Cocoon, Shed Skin, Encircle
- **Rock:** Fossilize, Stone Vault, Avalanche, Standing Stone, Weathered Wall, Rockslide, Faultproof, Geode
- **Ghost:** Rage Fist, Pallbearer, Borrowed Soul, Funeral Veil, Last Rites, Unfinished Business
- **Dragon:** Hoard, Dragon Scales, Awakening, Tyrant's Roar, Dragon Claw, Ancient Pact, Cataclysm
- **Dark:** Blackmail, Cruel Bargain, Shadow Screen, Grudge, Ambush, Dirty Exit
- **Steel:** Scrap Plate, Watchtower, Powered Armor, Dismantle, Spring Coil, Field Repairs
- **Fairy:** Wish Upon a Star, Fairy Bargain, Promise Keeper, Glass Slipper, Ribbon Promise, Gift Exchange

## Existing cards whose text changed (updated to the new list)
- **Cross Poison:** move up to 4 Poison from one enemy to another, then deal 3 damage per stack moved.
- **Venoshock:** you may first remove 2 Poison/Toxin stacks to deal 15 damage instead of 7. You pick the mix of Poison and Toxin.
- **Updraft:** gain 1 Fly counter, then Exile.
- **Tailwind:** now an Ability. After your opening hand each turn, you may discard 1 card to gain 1 Fly.
- **Foresee:** Scry 3, then draw 1.

## New systems
- **Fly counters:**
  - Each damage instance aimed at your team rolls a dodge at 25% per counter. Only the first 4 counters count, so 4 counters means 100%.
  - A successful dodge uses up the counters that rolled. A failed roll keeps them.
- **Constructs (Watchtower, Powered Armor):**
  - When played, you pick the cards to attach from your hand.
  - The Construct stays on the battlefield with its components underneath. Tap it to see them.
  - Built cards trigger their attachment effect when attached.
- **Card-specific effects:**
  - Per-card cost reductions for Rehearsal, Silk Cocoon and Gift Exchange.
  - Morbid and "Exile after playing" given to one card by Borrowed Soul.
  - Retain given to one card by Ribbon Promise.
  - Enemy marks with their own icons for Trench, Sand Tomb, Aftershock, Blackmail, Simple Beam, Last Rites and Sludge Wave.
- **Status row:** shows Fly, Stone Vault, Fossilize, Toxic Screen, Faultproof, Geode, Wish, Glass Slipper, Hoard, Awakening and Future Sight.

## Judgment calls
- **Simple Beam:**
  - Enemies have no "Charged attacks" yet, so the effect only blocks debuff intents: Weakened, Burn and status cards.
  - It will block Charged attacks too once enemies have them.
- **Face the Future:**
  - Scries before your opening draw and before draws from card effects.
  - Hydroflux, High Tide, Stockpile and Calculated Risk draw right away, because their effect reads the card they draw.
- **Last Rites:** you gain the 1 AP only when the marked enemy faints.
- **Shed Skin:** removes stacks in this order: Vulnerable, Weakened, Enfeebled, Toxin, then Burn.
- **Hurricane:** the damage per enemy is capped at 20 before type bonuses.
- **Rage Fist:**
  - "Each turn" counts your turn and the enemy turn separately.
  - Every way your team loses HP counts: enemy hits, Burn, Toxin and Scorch.
- **Dragon Scales:** any card you play after it, even one that fizzles, cancels the bonus.
- **Tyrant's Roar / Ancient Pact:** they only count cards that resolve, not ones that fizzle.
- **Glass Slipper and Silk Cocoon:**
  - Glass Slipper's random discard counts as a discard, so it triggers Brittle.
  - Silk Cocoon goes to the discard pile when its card comes back.
