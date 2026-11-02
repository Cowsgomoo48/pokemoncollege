# v0.66.0 — Viability sorting

- Potential projects each owned Pokémon to level 50 with its actual growth and nature. Battle Ready uses current stats and level. Both retain equipped moves and unlocked Ultimates.
- Scores use stat distribution 25, equipped moves 35, defensive typing 20, offensive coverage 10, Ultimate 10. Fixed roster ceilings keep rankings independent of collection contents. Scores are heuristic points out of 100, not win probabilities or collection percentiles.
- Moves use physical/special stats, the 1.2 same-type bonus, expected multi-hit counts, and modest bonuses for implemented range, area, piercing and drain effects. Coverage checks both equipped moves against the bundled roster's dual types.
- Ultimate scores include power, attacking stat, target scope and explicit utility/risk estimates. These do not simulate a particular team or arena.
- The Pokémon sheet shows explanatory tags and an expandable numeric breakdown using existing panel styling.
- No save migration, combat changes, or new art assets.

## Validation

The new viability regression and all 12 existing non-browser suites pass. Checks cover actual stat projection, physical/special synergy, same-type bonus, piercing range, complementary coverage, level behavior, growth, Ultimate unlocks, score bounds across the roster, no Pokémon mutation, panel text, bundle parity, and full app syntax. Browser/on-device visual verification was unavailable; an optional Playwright integration test is included.
