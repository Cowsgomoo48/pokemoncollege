# v0.90.0 — Battle Tower signature cards

All 41 supplied signature cards are in DC_SIG (tools/deck.js), fixed-type, offered as rewards only when the run's party has that type. Values are exactly as supplied.

## New mechanics
- Enemy statuses: Poison (loses HP = stacks at the END of its turn, ignores Block, then −1), Chill (its next hit deals 4 less per stack, min 0; all Chill is used up on that hit). Burn unchanged (start of its turn).
- Team resources: Charge (kept all fight), Seeds (Block at the start of your next turn), Ward (stops the next enemy debuff or status card), Dodge (next damaging hit this enemy turn), Bedrock keep (up to 6 Block survives the next reset).
- Ability buffs: Flame Body, Pyromania, Swarm Signal, Haunting, Polished Plate. Copies stack (trigger amounts × stacks); "first time each turn" triggers fire once per turn regardless of stacks; recursion guard.
- Choices before the question: Void Offering (1 hand card), Blazing Inferno (any number), Clean Slate (a status card), Hex Relay (second enemy), Make Do (target an enemy = damage, an ally = Block). Cancel / ✕ backs out with nothing spent.
- Choices after resolving (saved, re-asked on reopen): Undertow (discard 1), Foresee (take 1 of top 3, order the rest).
- Dynamic costs: Pompeii, Scald, Dragon's Descent (never below 0; shown in green when discounted).

## Interpretations (please check)
- "Any target" (Extinguish, Incineration, Superflux, Scald, Hydroflux) = any enemy.
- Scald applies 1 Burn. Flame Body triggers when an enemy attack makes one of your Pokémon lose HP (fully Blocked hits don't count).
- Ability trigger damage (Pyromania 2, Swarm Signal 5, Haunting 3, Polished Plate 4) and Burn/Poison get no type bonus. X cards (Superflux, Hydroflux, Blazing Inferno, Rivet Shot, Final Form) treat X as the base, then apply the type bonus once.
- Rivet Shot spends Block from your Pokémon with the most Block first. Dragon's Descent and Clean Slate Block go to the card's user (first Pokémon of its type, else the lead).
- Seeds planted on a fainted Pokémon go to the lead. Seed Block counts as Block gained that turn (Reinforce) but doesn't trigger Polished Plate.
- Early Harvest resolves the oldest Seed. Foresee/Undertow choices can't be skipped once the card resolves.
- "Attack card" (Final Form) = any card that deals damage.
- Status cards from enemies: Wound doesn't exist in this build; Void Offering/Clean Slate work on Scorch and Daze.
