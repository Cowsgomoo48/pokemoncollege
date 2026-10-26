# v0.21.0: Box sprites
- The Box no longer uses portraits. Every Pokémon (grid bubbles and the big picture on its detail sheet) is shown by its animated idle sprite facing southwest.
- Each sprite is sized and centred on its visible pixels, so small and large Pokémon both fill their bubble nicely; Rare Costumes use their own sheets (shiny ones in their shiny colours).
- Common Costume hats ride on the sprite's head and move with the idle animation.
- If a sprite can't load, that Pokémon falls back to its old portrait.

# v0.21.1
- Portraits replaced with southwest idle sprites everywhere else too: Pokémon rewards from boxes, Pokémon in Daily Deals, the Mystery Dungeon team picker and "new companion" picker, and the TM Lab.
