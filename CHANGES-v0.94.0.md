# v0.94.0: Plant system rework

## How planted cards work now
- **Plant X:** a planted card enters the battlefield with X Plant counters. Counters have no cap; Mulch, Fertilize and Doubling Season can push a card above X.
- **Harvest:** at the end of your turn, before your hand is discarded, each planted card runs its Harvest effect, then loses 1 counter.
  - Cards with no Harvest effect still lose a counter.
  - A card that reaches 0 counters goes to the discard pile.
  - Lurking Ivy gains a counter instead of losing one.
- **Reap X:** tap a planted card and pay X AP to use its Reap effect. No question is asked.
- Tiles show 🌱 and the counter count.

## Card changes
- **Oran:** Plant 3. Harvest: heal 2 HP. The heal gets the type bonus.
- **Early Harvest:** select a planted card that has a Reap effect, then trigger its Reap effect twice for free.
  - On Evergreen, each trigger asks for its own discard, and the two discounts stack.
  - Early Harvest triggers don't use up Evergreen's once-per-turn Reap.
- **Miracle Crop:** 2 AP, Plant 4. Harvest: choose Gain 1 Charge, Gain 4 Block, or Draw a card then discard a card.
  - Since Harvest runs before your hand is discarded, the discard can trigger a Brittle card.
  - Block gained this way protects you through the enemy turn.
- **Lurking Ivy:** Plant 1. It gains a counter at the end of each turn. Harvest: deals its counter count in damage to all enemies, with the type bonus.
- **New card, Evergreen:** 0 AP, Plant 2. Reap 0: discard a card; if you do, cards cost 1 less for the rest of your turn. It can be Reaped once per turn, and the discount ends when you end your turn.
- **Mulch** and **Fertilize** no longer stop at the Plant value.
- **Doubling Season** card text now matches the new list.
- Plant counters no longer grow on their own at the start or end of each turn.
