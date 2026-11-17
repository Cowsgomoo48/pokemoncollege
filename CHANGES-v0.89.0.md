# v0.89.0 — Battle Tower: roguelike deck-builder

New module: tools/deck.js + tools/deck.css (mirrored into www/index.html). Tower runs are save version 2 (`db.tower.v = 2`).

## Rules implemented
- Floor entry: climb animation → Void restored, all owned cards to draw pile, floor effects cleared, shuffle, AP 3, draw exactly 5. Player first. Enemy intents shown immediately.
- Turn: clear your Block → Burn ticks → Ability start hooks → AP 3 → discard shuffled into draw (animated) → draw 5. End Turn: hand discarded (status cards trigger), team Weak ticks down, enemies act left→right (each: its Block expires, Burn ticks, acts, next intent revealed).
- Zones: draw / hand / discard / Void, plus one "committing" slot for the card whose question is open. Every instance is in exactly one place (tested).
- Every play asks a question. Correct/make-up = effect; wrong = AP spent, card discarded, no effect. Safeguard: wrong = base effect, right/make-up = stronger effect.
- AP is paid once at commit and saved before the question opens; it is never refunded.
- Type bonus: damage ×(1+0.25N), Block ×(1+0.15N), N = run party members with the card's type; each event rounded down separately.
- Starter deck 5 Strike + 5 Guard, types spread round-robin over the party's types. One of 3 card rewards (or skip) after every combat floor; rolled once and saved.
- Ability keyword + DC_ABIL hook registry (start / resolved / costMod), duplicates stack, recursion guard. DC_SIG registry for signature cards (empty: no definitions were supplied).
- Enemy intents: attack, multi-hit, hit-all, Block, Strength buff, Weak on your team, Burn on a Pokémon, shuffle Scorch/Daze status cards into your discard.

## Assumptions
- Defensive targeting: Guard/Brace/Reinforce/Emergency Guard ask which Pokémon to protect (auto when only one is conscious). Secondary Block on attack cards (Quick Attack) goes to the first conscious party member with the card's type, else the lead.
- Retarget: if an intent's target fainted, the hit goes to the next conscious party member after it (wrapping). Later hits of a multi-hit do the same.
- Party stats: only HP/Max HP and types are used. Attack/Defense/moves/old formula are not applied.
- Safeguard plays count as "successfully played" for Opening Move / Follow Through, even on a wrong answer (the card resolved).
- Status damage to your team (Burn stacks, Scorch) can't faint a Pokémon.
- Legacy (v1) runs can't be migrated: opening one ends it the normal way (records, bosses, Tickets→Cogs) with an explanation. The rest of the save is untouched.
- Not used in v2 runs: Kecleon shop floors, perk cards, boss challenges, environment effects (environment names/backgrounds remain), item drops.
- Reopening the app with a committed card asks a new question for it (AP stays spent).
