# PokémonCollege v0.63.7 — Dungeon counters, signature compatibility and Manaphy Ultimate

- Small Fire, Water and Leaf Stone bubbles at the bottom of the dungeon map show the current run’s inventory, including zero counts.
- Uses the existing stone artwork and inventory values; refreshes with dungeon redraws after collection or spending.
- Counters fade when overlapping party sprites and are included in camera obstruction handling.
- Existing typed-answer hint feedback is retained.

## Signature move compatibility
- Adds 258 new species/move TM permissions under 49 rules, while preserving existing eligibility.
- Implements shell/fire or steam compatibility with Blastoise’s cannon exception; Water plus existing sound moves; Flying plus Ice or martial moves; Flying-wide Beak Blast; axe/blade Stone Axe users including Regirock and Pawniard’s line.
- Combat Torque uses app base Speed >=9, equivalent to source Speed >=90. Chi-Yu qualifies; slower Dark types do not gain it.
- No Grass starter is currently in the roster, so the Flower Trick starter rule has no current matches.
- Other additions use explicitly reviewed anatomy or ability matches. Full rule and eligibility table: SIGNATURE-COMPATIBILITY.md.
- Prerequisites use original Pokémon Showdown learnsets (including earlier stages), not newly granted moves. Signature expansion adds TM compatibility, not random capture moves or altered attack effects.
- Validation: all original TM permissions retained; positive and negative rule checks, app Speed cutoff, Flying roster coverage, Mew behavior and bundled source synchronization; roster, Unix hint and Oceanic boss regressions pass.

## Manaphy Ultimate — Sudden Breath
- Owned Manaphy can unlock Sudden Breath from the Box for the standard 25 Rare Candies. Uses a full Stamina Bar, standard 180-power special Water damage, and the standard all-target Ultimate reach.
- The normal torn-banner Ultimate splash screen shows Manaphy’s sprite and Sudden Breath’s name.
- Hop, downward squash, dive splash, battlefield flood, sinking targets, violent bubbles, geyser launch and water recession. Temporary sprite effects restore on completion or interruption.
- During the following player round only, Water-type moves from Manaphy and all allies gain a multiplicative 10% damage bonus. Does not affect enemy attacks, other move types or the current round; repeated uses refresh rather than stack this bonus.
- Validation: dedicated Ultimate execution, animation choreography/cleanup, standard damage and Stamina, splash dispatch, next-round team damage, expiry and source/bundle parity checks pass. Roster and Oceanic boss regression checks pass. Browser visual and native iPhone animation checks remain outstanding.
