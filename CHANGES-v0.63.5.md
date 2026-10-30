# PokémonCollege v0.63.5 — Oceanic Crust guardian

## Manaphy
- Added to the roster as a legendary Water-type Pokémon, with ordinary collection/move support.
- Bundles nine original PMDCollab animation sheets, timing data, portrait and upstream credits. Assets under www/assets/pmd/0490.
- New generated coral-door, sand-platform and Manaphy intro artwork follows the supplied pastel item reference. Existing game fonts, buttons, question cards and PMD sprite renderer are retained.

## Floor 15 and encounter
- An enemy-free northern approach wing joins the original ladder room, with a shop on the left, rest room on the right, and coral double door.
- NO moves the whole team one tile back from the door. PROCEED plays a party-centered iris, southwest-facing party sprites against Manaphy on sandy coral platforms, a scan-line/tile-flip transition, then the arena.
- A circular arena within a 21×21 tile grid, with edge walls, Manaphy in the center and the party lined up at the bottom.
- Saved runs already on floor 15 receive the approach wing. Runs beyond Oceanic Crust continue normally.
- Rescue Drills stop at the undefeated guardian; they cannot tunnel through the encounter.

## Boss rules
- Easy: 100 HP and 120 in each non-HP stat; Balanced: 125 HP and 145; Hard: 145 HP and 165. These are literal multipliers of Manaphy's base 100 stats. Attack damage still passes through the app's existing type, guard, dodge and difficulty calculations.
- Basic Splash: Water, 10 power, 3×3 footprint centered on Manaphy.
- Rain Dance: rotate/hop/squash; 5–10 / 8–14 / 10–18 unique marked tiles, 50-power rain on the next boss turn.
- Drizzle Beam: charging pose, eight full arena rays, 80 power on the next boss turn, no consecutive uses.
- At half HP or below, Dive begins the turn. Previously placed warnings still resolve on their scheduled boss turn.
- Diving Manaphy moves, is hidden except for increasingly frequent location ripples, does not allow free-roam turns, and cannot take normal attack/status damage. Surf can target it within Surf's normal range, deals twice the final hit damage, and yanks it out for one boss turn.
- Standing over Manaphy exposes DIG: 2–5 questions with an early-leave button. Only fully correct answers deal 5 damage each. Any success yanks it out for ceil(correct/2) boss turns; no specials while dazed. At the end of that daze, it immediately dives again.
- Hydro Pumps: fixed plus/diagonal-cross ripple lines, 80-power geysers next boss turn, then Manaphy repositions; no consecutive uses. These warnings cancel when the water recedes.
- Call for Help: 2–3 ripple warnings summon basic or first-evolution Water types next boss turn. Summons remain after a yank but disappear on Manaphy's defeat.
- Water Balloons: 2–3 / 3–4 / 4–5 complete five-tile plus markers; falling balloons splash for 65 power next boss turn. Overlapping warnings from a single move cannot damage the same ally twice.
- Defeat: Sleep animation, stagger, blue particles gather into the central ladder. Standard guardian tickets/party EXP are awarded once. The boss cannot be snagged during this encounter; ordinary roster Manaphy remains collectible.

## Validation
- JSON and all 26 JavaScript/embedded-script syntax checks.
- Roster/save-migration, sprite assets and Rescue Drill regression checks.
- Oceanic boss rules: exact difficulty stats, arena geometry, telegraph scheduling/bounds, phase threshold, anti-repeat specials, Dive targeting, yank timing, and saved-turn replay guards.
- Headless browser: 60 generated approach floors across all three difficulties; door and side-room reachability; no enemies in new wing; actual Surf damage/immunity and three-question dig interaction; NO/PROCEED; intro/arena transition; defeat and central ladder; zero browser exceptions.
- Native iPhone build not run. On-device animation pacing and battle balance still need playtesting.

Not published.
