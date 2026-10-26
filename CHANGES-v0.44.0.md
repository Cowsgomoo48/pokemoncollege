# PokémonCollege v0.44.0

## New dungeon items
- **Pocket Voltorb** 💥 (Uncommon, 18 Cogs): 3 damage to every enemy.
- **Stellar Storm** 🌠 (Rare, 35 Cogs): 6 damage to every enemy.
- **Thundurus' Might** 🌩️ (Rare, 35 Cogs): 10 damage split between all enemies on the field, with any leftover going to the first ones. A lone enemy takes all 10.
- **How the damage items work:** they use the normal item question. A Make-Up has a 25% fumble chance, and missing both uses the item up with no effect.
- **Snag Machine** 🧲 (Legendary, 120 Cogs): tap an enemy to try to catch it.
  - **Odds:** it uses the main games' Poké Ball formula (Gen III/IV, with the four shake checks). It throws Ultra Ball odds at normal Pokémon and Poké Ball odds at bosses. Low HP and status effects make it easier.
  - **Catch rate by rarity:** Common 190, Uncommon 120, Rare 60, Very Rare 30, Legendary 3.
  - **Questions:** it can't be fumbled. A Make-Up keeps the full odds, and missing both halves the odds.
  - **On a catch:** the Pokémon counts as defeated, leaves the battle and joins your Box at its battle level.
- **Item rarity:** items now have a rarity. Dungeon shops show rarer items less often, and perfect treasure rooms can drop the new items (6% chance of a Snag Machine).

## Facilities
- **What they are:** Facilities are new tabs in your habitat (◉ HABITAT · 🏋️ GYM). They're unlocked by a Legendary-tier Box prize. If you already own that Facility, the prize becomes a Facility Ticket.
- **Who trains there:** one Pokémon trains in each Facility. Your main companion stays home, and making a training Pokémon your companion takes it out of the Facility.
- **Task EXP:** Pokémon in Facilities also get EXP from your completed tasks, the same amount your companion gets. Undoing the task takes it back.
- **Facility EXP:** whenever a Pokémon gains EXP inside, the Facility gains the same EXP. Facilities go up to Lv 10. Each level's bonuses are the total for that level, not added on top of the level before.
- **Facility Ticket** (Rare-tier Box prize, only once you own a Facility): +1 Facility level.
- **Decor:** Facilities hold small and medium decor (✎ DECOR). Their background can't be changed.

### Workout Gym
- **Hourly check:** every hour it's awake, the gym rolls a check that starts at 5%. A miss doubles the chance (5 → 10 → 20 → 40 → 80 → 100%).
- **A hit:**
  - It raises one random growth rate by a grade.
  - It pays EXP for the hours trained since the last hit, at the same rate as an hour as your companion.
  - It resets the chance back to the starting value.
- **Sleep:** after 3 hits, the lights go out and the Pokémon sleeps for 6 hours, then training starts again.
- **While you're away:** it keeps counting while the app is closed, and the next time you open it, a bar tells you what happened.
- **Levels (start chance / EXP / sleep time):**
  - Lv 1: 5% / — / —
  - Lv 2: 5% / — / −2%
  - Lv 3: 5% / +5% / −4%
  - Lv 4: 6% / +5% / −6%
  - Lv 5: 6% / +10% / −8%
  - Lv 6: 7% / +10% / −10%
  - Lv 7: 7% / +15% / −12%
  - Lv 8: 8% / +15% / −15%
  - Lv 9: 9% / +20% / −18%
  - Lv 10: 10% / +25% / −20%
- **Facility EXP needed for each level:** 60k, 160k, 320k, 560k, 900k, 1.36M, 1.96M, 2.72M and 3.7M. Lv 10 takes roughly a month of steady training without tickets.
- **LV · INFO:** shows the level table, progress to the next level and recent boosts.
