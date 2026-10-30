# PokémonCollege v0.64.0 — Zygarde, Volcanion and Eternatus

## Collection and stats
- Adds Zygarde (50% Forme), Volcanion and normal-form Eternatus to the Legendary rarity pool, Box, companion and dungeon systems.
- Uses canonical base stats, types, height and weight with the existing /10 stat scale, growth and nature formula. No custom inflated stat values.
- Bundles PMDCollab directional Idle, Walk, Attack, Sleep, Hop and Rotate sheets, animation timing data, Normal portraits, upstream sprite and portrait credits. All three have eight-direction Idle/Walk/Attack. Eat falls back to Idle when the source has no Eat animation.
- Compatible ordinary moves and TM eligibility are included. Ultimates unlock for the usual 25 Rare Candies and consume a full Stamina Bar; all three use the existing sprite splash banner.

## Ultimates
- Core Enforcer: Dragon, 180 power. After the study question, choose a blast-center tile within 10 tiles (including diagonals); green particles draw inward while aiming. Splash banner, three persistent green segments trace a Z, then a 3×3 enemy-only explosion centered on the selected tile. Canceling aim costs no Stamina.
- Vaporize: Water, 90 power against visible opposing battlers. Steam, three red flashes, expansion/deflation, prolonged red heat distortion, then steam eruptions. Targets strictly below 15% HP before or after damage instantly faint with steam particles; exactly 15% is not below the threshold. Hidden diving targets are excluded.
- Eternabeam: Dragon, 180 power. Choose one of eight directions; a crimson/pink piercing beam extends to the first wall. Every Pokémon in the lane except the caster is hit, including allies. Targets shudder during the beam and burst with crimson/pink energy before damage resolves.
- Classic Battle Tower has no tile grid: these custom Ultimates use its opposing battler layout rather than dungeon tile geometry.

## Pending changes included
- Rescue Drill stops at each Layer’s last floor; extra fully correct answers give one random Fire/Water/Leaf Stone each. Named Boss floors block activation without consuming a Drill. Saved compensation counts prevent duplicate grants.
- Weak Spots reads mistakes and guesses from Study Data, including every generated practice slot. Learn completion is no longer required in minigames, dungeon, Battle Tower or set editing.
- Manaphy dives to a random different free arena tile, gains a single-target Water Stream (50 power, range 7 in any direction), erupts and rotates through PMD direction rows when yanked, and creates landing stars. Its blue health bar follows its head, labels only Manaphy, and disappears while diving.
- Manaphy’s intro party is much larger, arranged two-by-two, with shared fitting for oversized sprite frames and a portrait phone layout.

## Validation
- Roster/save migration, bundled assets, ordinary move compatibility, Ultimate damage/threshold/geometry/stamina/splash flow, Manaphy balance and behavior, and Rescue Drill boundaries are tested.
- Browser/on-device visual playback has not been verified in this environment.

## Sprite restoration fix
- Overlapping Attack sheet animations use ownership tokens. Completion re-renders the current Idle/Walk/Sleep state instead of restoring a stale inline-style snapshot.
- Asynchronous sprite rendering rejects stale loads after direction, species, pose or size changes.
- Temporary Ultimate pose classes clean up on animation completion with a timeout fallback; replacing a pose cancels its previous cleanup. Finite Web Animations release on finish/cancel with a fallback timer.
