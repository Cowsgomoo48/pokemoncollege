# PokémonCollege v0.63.3 — Rescue Drill (art pending)

- Mystery Dungeon only: Rescue Drill is rare study loot. Each completed battle/item/revive or Dig Spot question rolls a 1/80 chance to add one to the run bag. No timed or guaranteed drops. At 30 seconds per completed question, the mean is roughly 40 minutes; actual runs vary widely. This rate needs playtesting.
- Single-use drill rolls 2–5 attempts using the Dig Spot question progression. Only a fully correct first answer adds a floor; make-up answers and Halfsies add no depth. Misses do not stop the remaining questions.
- Shows a scrolling tunnel, upward-flying debris and progress while answering; plays the existing planet-dig/flag transition at the destination.
- May escape a fight and bypass boss floors, but grants no skipped-boss rewards, clear credit, loot or per-floor healing. Never drills beyond the final floor or automatically completes the dungeon.
- Consumes once and saves each completed attempt. Interrupted drilling resumes on reopening the run. An unfinished question is asked again without adding depth.
- Excluded from Tower, generic random item pools and shop stock. New loot is earned through the dungeon study-question rolls.
- Uses the existing tools icon as a temporary placeholder. Final drill artwork awaits the user's reference sheet. The preliminary generated image is not bundled.
- Existing saves are compatible; no migration or reset required.

Validation: JSON/JavaScript syntax; roster/save migration and animation regression tests; Rescue Drill logic tests. Native iPhone build not run. Browser visual QA depends on available browser runtime.
