# PokémonCollege v0.63.8 — Manaphy boss stat scale

Manaphy’s boss used unscaled non-HP stats against player stats scaled by ten. Both defenses were excessively high, forcing many attacks to the 1-damage floor; attack and Speed used the same mismatched scale.

| Difficulty | HP (unchanged) | Attack / Defense / Sp. Atk / Sp. Def / Speed |
|---|---|---|
| Easy | 100 | 12 (was 120) |
| Balanced | 125 | 15 (was 145) |
| Hard | 145 | 17 (was 165) |

Existing arena saves receive corrected non-HP stats when the guardian is accessed on resume. Current HP, phase, dive state, pending attacks, party HP/Stamina, position and battle progress are preserved. No change to owned Manaphy, move power, damage formulas or rewards.
