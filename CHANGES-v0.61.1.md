# PokémonCollege v0.61.1

## Mystery Dungeon upgrades: weaker per level
- **What changed:** percentage upgrades now add less per level, so their maximum is lower. Prices are unchanged.
- **Where to tune them:** all the per-level amounts are in one table (`MD_PER` in tools/mdshop.js).

| Upgrade | Per level (was) | At max (was) |
|---|---|---|
| Expert Schooling | 1.5% (3%) | 30% (60%) |
| Punchier Fists | 1% (2%) | 20% (40%) |
| Focused Mind | 1% (2%) | 20% (40%) |
| Opening Strike | 3% (5%) | 30% (50%) |
| Sharp Eye | 3% (5%) | 30% (50%) |
| Charge Up | 3 Stamina (5) | 30 (50) |
| Finisher | 2% (4%) | 20% (40%) |
| Boss Breaker | 1.5% (3%) | 15% (30%) |
| Thick Hide | 1% (1.5%) | 20% (30%) |
| Guard Training | 1% (2%) | 10% (20%) |
| Second Breath | 1% (2%) | 10% (20%) |
| Evasion Drills | 0.5% (1%) | 5% (10%) |
| Sure Footing | 15% (20%) | 75% (100%) |
| Stairwell Rest | +3% (+5%) | heals 50% (70%) |
| Lucky Finds | 4% (5%) | 40% (50%) |
| Ticket Magnet | 3% (5%) | 30% (50%) |
| Bargain Hunter | 3% (4%) | 30% (40%) |
| Forager | 5% (8%) | 25% (40%) |

- **Unchanged:** Weathered Warriors, Rough Skin, Shinier Patches, Deeper Digs, Prospector, Light Bearer and Scout's Map. Each of their levels unlocks a step instead of adding a percentage.
