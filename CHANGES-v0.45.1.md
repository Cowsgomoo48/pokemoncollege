# PokémonCollege v0.45.1

## Attack animations stay on their feet
- **The bug:** Attack frames are usually bigger than Idle frames. The app lined each animation up by its lowest pixel, so many Pokémon jumped up (by as much as 38 px) when they started attacking.
- **The fix:** animations are now lined up the way the sprite sheets are drawn. PMD sprites keep the ground point at the center of every frame, so the Attack frame's center now sits exactly where the Idle frame's center was.
  - The first attack frame now lands within 4 px of the idle feet for 155 of 160 Pokémon.
  - Movement the artist drew into the animation (a lunge forward, a hop, a floating Pokémon hovering) still plays as drawn.
- **Where it's fixed:**
  - Dungeon attacks.
  - The habitat companion's Attack, Eat and Sleep animations. Costume hats follow the shift.
  - The Workout Gym (training and sleeping).
