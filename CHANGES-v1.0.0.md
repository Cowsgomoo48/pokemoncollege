# v1.0.0 — Signature bosses, curses, potions, balance

## Signature bosses (Boss rooms on the map only; about half of Boss rooms, unmet ones first; other bosses stay in rotation; Elites and event fights unchanged)
- Aggron · Iron Fortress: Fortify (Block) ↔ Siege Breaker. Fortify's leftover Block survives the reset before Siege Breaker and adds half of it to the hit, then is spent. Preview updates live as hits or Block removal chip it.
- Gardevoir · Future Sight: announces a heavy hit with a countdown and damage, takes a light action in between, the hit replaces its action on the announced turn, canceled if Gardevoir faints, one recovery turn before the next.
- Tinkaton · Gigaton Hammer: telegraphed a turn ahead (🔨 next), lands as 2 separate hits, then Tinkaton sets the hammer down: no action next turn and Vulnerable during your turn.
- Volcarona · Quiver Dance: +1 Strength and charges Fiery Sweep (hits the whole team). Shows a damage threshold (🦋 dealt/needed, 12 at the first boss, scales 10 × (1 + floor/40)); reaching it during your turn swaps the sweep for a weaker attack.
- Counters, queued hits, Block and phase are saved with the run. Boss room wins still give normal rewards + one boss relic choice.

## Curses (lasting deck cards; Daze and Scorch stay temporary)
- Broken Chord (Meloetta's deal), Sunstroke (Cinderace's Sun), Sleight of Paw (Meowscarada's trick card). One copy per bargain, exact text shown before you choose, labeled CURSE, removable with the Merchant's card removal. Clean Slate can't exile curses.

## Potions
- 2 slots per run, shown in combat. Drops: 30% after normal fights, 50% after Elites (TW_POTION_DROP in towermap.js). Full slots: replace one or leave it. Free to use on your turn; targeted potions are only spent after a valid target.
- Potion (heal 8), Guard Tonic (10 Block), AP Tonic (+1 AP), Focus Tonic (draw 2), Full Heal (clear one chosen debuff), Exposure Tonic (Vulnerable 2 on an enemy).

## Card changes
- Raze: X capped at 12. Rage Fist: doubling capped at 32. Feed the Swarm: 1 Strength per counter (was 2). Twineedle: 3 damage + Poison 1, twice (was 4 + Poison 2). Outbreak: Toxin capped at 10.
- Crosswind (your update): Gain 6 Block. Spend a Fly counter (Exile effects trigger as if a card was Exiled) or Exile a card in hand (gain 2 Fly).
- Melmetal (Elite): Double Iron Bash caps at 4 hits, and Melmetal cools down (no action, announced) the turn after each Bash.

## Fixes
- Your team's Vulnerable now wears off after the enemy turn, so it applies to the attacks the intents show (it used to expire first, making shown damage too high).
