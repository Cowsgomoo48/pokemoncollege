# v0.65.0 — Caves guardian: Regirock

The final Caves floor (B25F) now leads into a named Regirock encounter, using Manaphy's guardian flow.

- An enemy-free northern wing replaces the ladder exit, with a left shop, right healing room, and a mountainous cliff with a crimson, stone-arched Regi door.
- The door offers “A dangerous boss approaches! Proceed?” No returns the party one tile away. Proceed closes an iris over the team, shows a rocky/crystal VS intro with new Regirock art, then uses the existing distortion, black-line, and tile-flip transition.
- The arena has 19×19 walkable tiles inside a one-tile wall border. Regirock starts in its center; the party starts in a horizontal line at the bottom. Its rocky sanctuary has no inherited sublayer battle modifiers.
- Regirock is a named guardian, cannot be snagged, and keeps the existing named-boss Rescue Drill restriction. Existing saves on the final Cave floor receive the entrance wing once.

| Difficulty | HP | ATK | DEF | SPA | SPD | SPE |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Easy | 125 | 12 | 24 | 6 | 12 | 6 |
| Balanced | 150 | 15 | 29 | 7 | 15 | 7 |
| Hard | 175 | 17 | 33 | 8 | 17 | 8 |

Non-HP stats use Regirock's canonical species bases divided by 10, multiplied by 1.2/1.45/1.65, and rounded like the rest of the game.

## Combat

- Stone Pillars: 55-power Physical Rock attack, piercing the three forward tiles in any of eight directions.
- Phase one occasionally casts a special and can still make a basic attack afterward. Charging Earth Wave or Rubble Rush ends that turn.
- Rubble Rouser: next-turn 65-power Rock drops; Easy 4–5 single-tile zones, Balanced 3–4 five-tile crosses, Hard 2–3 nine-tile squares. The resulting rocks block movement and ordinary attack lines and cannot be targeted as Pokémon.
- Shatter: leap beside a living target within seven tiles, then a 45-power Rock eruption over the surrounding 3×3 square.
- Earth Wave requires rock cover. Regirock moves to a random cardinal edge and charges twice. On the next turn, a 90-power wave advances toward the opposite side. Each lane stops at the first rock and breaks that cover; units behind it are protected.
- At or below half HP, Regirock hops, flashes red, steams, and switches permanently to phase two.
- With three living party members within two tiles, the next basic becomes Spiked Retreat: leap back 4–5 tiles if space permits, then send a three-tile-wide spike wave toward the group for 65-power Rock damage. Steam appears/disappears on redraw as that proximity changes.
- Giga Boulders: 1/2/3 next-turn 3×3 landing zones by difficulty, 65-power Rock damage, and displacement of occupants to the closest free tile outside the footprint.
- Rubble Rush requires a Giant Boulder. Regirock leaps to a non-corner edge, marks a party member, and displays a warning corridor spanning three tiles either side of that target's lane. The warning tracks the selected member. On the next turn it realigns with their current position and charges across for 70-power Rock damage. It breaks ordinary rubble, stops at the first Giant Boulder, bounces back, and loses its following turn while dazed.
- Temporary ordinary rubble lasts through five subsequent guardian turns; Giant Boulders through seven. These durations and the two-tile proximity threshold fill details not specified in the request.
- Saved telegraphs, cover, timers, phase, and per-round execution guards prevent replaying attacks on resume.
- Defeat shows the PMD Sleep pose and shaking, then rock particles converge into the central ladder. Rewards are granted once.

All temporary squash, leap, dash, and charge animations release their animation handles, preserving the sprite-cleanup fix from v0.64.0.

## Art and validation

The transparent Regirock illustration is bundled at `www/assets/boss/caves/regirock_intro.png`. Generated using the built-in image tool; its prompt is recorded alongside the asset. Rocky patches, crystals, cliff, door, warnings, and combat particles use CSS and the existing renderer. No fourth reference file was attached in this chat, so the current Manaphy transition was reused.

`tests/rocky-regression.cjs` checks difficulty stats, arena geometry, attack shapes, telegraph timing, cover occlusion, displacement, rush targeting, phase transitions, daze, resume guards, and bundle/offline asset parity. `tests/rocky-browser.cjs` exercises 60 floor generations, door refusal, the intro/arena transition, boulders, rush collision, live proximity steam, and the defeat ladder in Chromium. The eleven pre-existing suites also pass. Physical iPhone playback remains to be checked.

## Box sorting and run payout

- Friendship puts nicknamed Pokémon first, with descending total companion time within both groups, including the active companion's current session.
- Viability uses a weighted score: BST 35%, equipped TM power 20%, basic power 5%, defensive typing 20%, unlocked Ultimate 10%, growth stats 10%. Typing uses the game's actual dual-type damage multipliers; move power includes expected multi-hit counts. Level and nickname do not affect this ranking. The weights appear under the sort selector.
- Mystery Dungeon now pays Cogs equal to 10% of cumulative Tickets earned during the run, rounded to the nearest whole Cog. Spending Tickets does not reduce this payout. This replaces the old conversion of unspent Tickets; existing boss-clear bonuses remain additional.
