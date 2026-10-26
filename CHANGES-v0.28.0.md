# v0.28.0: Move animations
- Every attack in the Mystery Dungeon now plays a type animation, for your Pokémon and for enemies, Basic and Disc moves alike.
- Each of the 18 types has a weak version (moves with 70 power or less, which includes every Basic move) and a strong version (over 70):
  - Normal: step forward + attack animation + small projectile / rush to the target and attack.
  - Fire: fireball that bursts into sparks / the 火 symbol forms in midair, flies at the target and explodes in its shape.
  - Water: water stream / whirlpool drags the target down and lets it back up.
  - Electric: bolt / a thundercloud forms above the target and strikes.
  - Grass: gust of leaves / a sphere of petals encloses the target and bursts.
  - Ice: snowball / the target is frozen in ice, shakes twice, and it shatters.
  - Fighting: rush with a trail + attack animation / rush and a flurry of punches as the target shakes.
  - Poison: fangs clamp down / a stinger slashes from top-left to bottom-right.
  - Ground: the ground shakes under the target / a sand plume tosses it up and it lands hard.
  - Flying: feathers swirl in / a hurricane spins the target up and drops it.
  - Psychic: psychic waves as the target shudders / an eye opens above and a four-pointed purple star bursts.
  - Bug: needle / a horn slides back and rams the target.
  - Rock: thrown boulder / boulders rain down.
  - Ghost: three will-o-wisps circle the target / spirits curve in, circle and burst into particles.
  - Dragon: purple breath / a big purple beam.
  - Dark: cloaked rush and a diagonal slash / rush into a dust cloud that hides both, then run back.
  - Steel: grey beam / leap and slam, then a line of metal spikes erupts toward the target.
  - Fairy: pink energy ball / curving ribbons that burst into particles.
- "Attack animation" uses each Pokémon's own Attack sprite sheet.
- Note: a separate, simpler move-effect edit appeared in the project files at 1:40 AM (one effect per type for Disc moves plus a hit flash for Basic moves). It was not made in this chat; it has been replaced by this full set.

# v0.28.1
- Normal (weak and strong) no longer hide the attacker: the one-time Attack animation now starts fresh and ends on its last frame instead of a blank frame.
- Grass weak leaves fly to the right target (a leftover style from a stopped turn was rotating their flight path; leftover styles removed).
- Bug strong is now Megahorn-style: a horn appears just below the target on the attacker's side, backs off, rams up into it, sprays particles backwards, pushes the target up slightly, then explodes.
- Fairy strong replaced: a crescent moon appears below the target and the attacker fires a narrow cone of starlight at it.
