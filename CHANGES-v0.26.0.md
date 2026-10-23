# v0.26.0: Dungeon run styles and rebalance
- New "Run style" choice when starting a run:
  - Casual (default, study mode): every floor plays the same length and level; deeper floors add no extra rewards. Leaving gives a flat floor bonus (8 / 12 / 18 Cogs by difficulty) once you've cleared a floor. Go as long as you like.
  - Videogamey (competitive): each deeper floor is a row longer with enemies +2 / +3 / +4 levels (Easy / Balanced / Hard); battle rewards grow with depth; the floor bonus is floors cleared × 8 / 12 / 18 but is lost if your team faints.
- Enemy level caps lowered back to +1 (Easy), +2 (Balanced), +4 (Hard) over your team's average level; bosses are 1 level above the cap (Alphas 2).
- Boss length and odds retuned by simulation (attack bar off, no guarding or items, full-HP team; averaged over three different teams):
  - Easy: bosses fall in about 3 rounds (2–4), about 84% win.
  - Balanced: about 5 rounds (4–6), about 70% win.
  - Hard: about 6.5–7 rounds, about 52% win.
- Dungeon sprites are drawn at one fixed scale instead of being stretched to the same height, so real size differences show (Gyarados towers over Joltik), and each of your Pokémon's own size variant (XXS–XXXL) is applied too. Bosses are drawn a little larger.

# v0.26.1
- Dungeon sprites now stand on their feet: each sprite is lined up by the lowest visible pixel of the Pokémon instead of the bottom of its frame. Tall frames (like Gyarados) no longer float forward of the team.
