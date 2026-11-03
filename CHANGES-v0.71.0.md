# v0.71.0 — Shop and enemy update

## Upgrade Shop
- **New: Demotivate** (Fire, max Lv 10, 1🟠 9🎟️ at Lv 1): +1% per level chance that your attacks drain the target's Stamina by half the damage dealt (10% at max).
- **Scout's Map → Scout's Compass** (Leaf, max Lv 3; existing levels carry over):
  - Lv 1: the minimap shows the stairs, or a red skull where the boss waits.
  - Lv 2: near the stairs or boss room (within 12 tiles), blue sparkles start at your team every 6.5 s and trace the quickest path there.
  - Lv 3: the sparkles show whenever you're in move mode with no foes around, at any distance.
  - The minimap no longer reveals dig spots and items.

## Enemies
- Foes keep their Stamina system: basic attacks build Stamina, charged moves spend it.
- Moves that always lower a stat (Snarl, Spirit Break, Struggle Bug, Icy Wind, Mud Shot, Mud-Slap and similar) have a 10% chance to drain the target's Stamina by half the damage dealt. This works both ways: foes using them on your team, and you using them on foes. For your attacks the chance stacks with Demotivate.
