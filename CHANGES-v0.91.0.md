# v0.91.0 — Tower card battle layout + shared team HP

- Layout (from the sketch): tower floor background; enemies above; team Pokémon stand just in front of the hand; hand fanned in an arc across the width; draw pile bottom-left; Void (top) and discard (below) on the right; team HP bar under the hand; End Turn below.
- Team HP: one pool = the run party's combined Max HP (r.pmax / r.php), kept between floors; run ends at 0. Block, Burn, Seeds, Bedrock, Dodge and Ward are team-wide. Defensive cards no longer pick a Pokémon; Make Do targets an enemy (damage) or the team bar/sprites (Block). Enemy "hit-all" intents hit once per team member.
- Holding a card: Pokémon sharing its type hop and stream type-coloured particles into it.
- Playing a card: those Pokémon run their own attack animation + type move effect at the target. AoE cards have screen-wide effects (Sweep gusts, Flashover flame burst, Blazing Inferno flame wall, Pompeii meteors). Utility/defense: matching Pokémon cheer and the HP bar glows. Reduced motion skips all of it.
- The answer is saved before the animation, so closing the app mid-animation still resolves the card exactly once.
- Signature card text now uses the reworded descriptions.
- Older v2 saves: per-Pokémon Block/Burn are merged into the team values.
