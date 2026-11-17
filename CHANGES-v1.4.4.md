# v1.4.4

- **Damage cap.**
  - One enemy attack can take at most 22% of your team's max HP (Elites 30%, bosses 35%).
  - On the opening turn of a fight, Elites cap at 18% and bosses at 22%.
  - All enemies together share a budget each turn: 40% in normal fights, 50% for Elites (30% opening turn), 55% for bosses (35% opening turn).
  - Intents show the capped number.
- **Scaling.**
  - Enemy level and HP now follow the floor, not your team's level. Card damage doesn't grow with level, so strong teams no longer face spongier enemies.
  - Enemy damage now scales with your team's HP pool instead.
- **Deck button.**
  - 🃏 with your deck size, in the battle top bar and on the tower map.
  - Opens your whole deck, sorted by cost, with filters in the top left (type, AP cost, kind: Attack/Skill/Ability/Status/Curse) and a "shown of total" count.
  - Tap a card to zoom.
- Service worker cache bumped to 1031.
