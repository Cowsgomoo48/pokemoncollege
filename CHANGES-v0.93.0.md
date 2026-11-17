# v0.93.0: Tower cards: Ice, Fighting, Poison and Grass additions; new keywords and statuses

## Keywords
- **Discarding** means removing a card from your hand without playing it.
  - It happens through Meditate, Bounty, Gone Fishin', Mulch and Full Harvest.
  - Playing a card never counts as discarding, and neither does the end-of-turn hand discard.
- **Brittle:** the card's Brittle effect fires when it is Exiled or discarded. The end-of-turn hand discard doesn't trigger it.
- **Retain:** the card stays in your hand at the end of the turn.
- **Isekai:** when the card is Exiled or discarded, it hovers around your team as a small winged card. It returns to your hand next turn and loses Isekai.
- **Morbid:** the card can't be given Isekai.
- **Scry X:** a panel shows the top X cards, numbered in draw order. Drag a card to reorder it, or drag it into the "Bottom of deck" zone. Tapping a card also moves it to the bottom and back.
- Retain, Isekai, Morbid and Scry are in the engine, but no card uses them yet. Tests cover them with stand-in cards.

## Buffs and debuffs (work on your team and on enemies)
- **Strength:** +10% damage per stack, and it doesn't fade.
  - This replaces the old enemy Strength, which was a flat +1 per hit.
  - Your Strength boosts the live numbers on your cards.
- **Weakened:** −15% damage. It replaces Weak, which was −25%.
- **Vulnerable:** +25% damage taken. It shows in enemy intents when it's on your team.
- **Enfeebled:** −25% Block. It also lowers enemy Block intents.
- **Toxin X:** X damage at the end of the afflicted side's turn, then −1. Toxin on your team can't knock you out, the same as Burn.
- Weakened, Vulnerable and Enfeebled drop by 1 at the end of the afflicted side's own turn.

## New cards
- **Ice:** Frost Armor, Brittle Barrier, Brave the Storm, Blizzard, Snowrazor, Ice Spinner, Absolutely Overkill, Ice Shard, Embrittlement.
- **Fighting:**
  - Upper Hand, Close Combat, Focus Punch, Beatdown, Flurry of Blows, Eviscerate, Mat Block, The Best Defense….
  - Final Form is reworked: gain 10 Strength, lose it at the end of the turn, then Exile.
- **Poison:** Outbreak, Cross Poison, Venoshock.
- **Grass:** Full Harvest, Fertilize.
- Hex Relay and Opportunist now count the new debuffs.

## Card text
- Removed the extra parenthetical notes I had added, such as "(now 5)", "(Target an enemy, or your team.)" and "(×1.25)". Card text now matches the list.
- Live damage and Block numbers stay.

## Judgment calls
- **Frost Armor:** it lasts through the next enemy turn. Each enemy that hits you takes the damage once. Hits count even if Block absorbs them.
- **Focus Punch:** "took damage last turn" means your team lost HP during the last enemy turn.
- **Eviscerate / The Best Defense…:** every hit, Ability trigger and Pressure/Haunting-style damage on your turn counts as an instance. An AoE counts once per enemy hit.
- **Vulnerable** boosts card, trigger and reflected damage. It doesn't boost Burn, Poison or Toxin ticks.
- **Snowrazor:**
  - Its damage drops by 2 after each play, down to a minimum of 0.
  - Its Brittle effect asks for a target when more than one enemy is alive.
- **Ice Spinner:** one hit of 8 × the number of Planted cards. It does nothing if you have none.
