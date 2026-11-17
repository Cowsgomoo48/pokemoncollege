# v0.92.0: Tower cards: Plant, Harvest, Haste, Chill, Charge, new Burn

## New mechanics
- **Plant X:** a played Plant card stays on the battlefield as a small tile above your team. It gains 1 counter at the end of each of your turns, up to X.
- **Harvest:** tap a planted tile, then pay its Harvest AP cost. No question is asked.
- **Haste:** Haste cards stay in your hand through the enemy turn. Each time an enemy starts its action, a "Play a Haste card?" bar appears before the hit lands. For a Block intent, the bar appears after the enemy's Block lands. Unspent AP from your turn can pay for Haste cards. Leftover Haste cards are discarded at the start of your next turn.
- **Chill X:** takes X off the enemy's next attack in total, starting from the first hit (minimum 0). Chill then drops by 1.
- **Burn:** an enemy takes 2 damage at the end of its own turn, then loses 1 stack. Burn on your team does 2 at the end of your turn (it can't knock you out), then loses 1 stack.
- **Charge** is shown in the status row.
- **Live numbers:** damage and Block on every card are recalculated from:
  - your team's type bonus,
  - Weak,
  - Roiling Storm,
  - Schooling.

  Boosted numbers show in green and reduced numbers in red. Costs also update: green when cheaper, red when dearer. Tap a number in the enlarged card to see the math.

## Card list
Matches the new list.
- Renamed cards: Make Do → Coin Flip, Undertow → Meditate, Bramble Seed → Oran. Cards with the old names in saved decks are converted.
- New cards:
  - Moonlight, Gone Fishin', Schooling
  - Parabolic Charge, Roiling Storm, Zapback, Static, Ionization, Styled On, Flash Mob
  - Oran, Early Harvest (new effect), Mulch, Doubling Season, Bounty, Miracle Crop, Bramble Barricade, Lurking Ivy
  - Helping Hand, Stockpile, TLC, Judgement, Dominating Chords, Pressure
- Cold Snap now applies Chill 4.

## Card art
- Superflux, High Tide, Moonlight and Hydroflux use the painted art. The live cost and text are drawn over the art's own circle and text box.
- Other cards keep the emoji design until they get art.

## Judgment calls
- Healing restores the shared team HP up to its maximum. Heals don't get the type bonus.
- **Bramble Barricade:** applies to the next hit of that enemy's action. It prevents half of the hit, rounded up, and sends that much back to the attacker. The returned damage gets the Grass type bonus.
- **Dominating Chords and Pressure** trigger on any enemy action other than a basic single hit or a Block. That includes multi-hit attacks, AoE, Strength, Weak, Burn and status cards.
- **Flash Mob:** a chosen enemy skips its whole next turn. Its intent shows "📸 Skips".
- **Styled On:** counts an enemy fainting during your turn.
- **Gone Fishin':** "haven't discarded" means you haven't discarded a card this turn.
