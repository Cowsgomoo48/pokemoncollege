# v0.71.3 — Eternabeam rework

- When Eternabeam fires (Mystery Dungeon), it first works out the full damage for every Pokémon in its lane (foes, and allies in the way) and adds it into one damage pool.
- The beam charges: a pink orb grows and a thin beam swells, then a massive beam releases with a shake and crackling red/pink lightning along it.
- The beam stays on while it pays out the pool **1 HP at a time** across everything in the lane in turn: every 0.1 s for the first third, every 0.03 s for the second third, and every 0.01 s for the last third. HP bars drain live, damage numbers pop as it goes, and anything brought to 0 bursts.
- It ends when the pool is spent or nothing in the lane is left standing. The camera holds still the whole time.
