# PokémonCollege v0.5.2 — Companion sprites & Safari foreground

- Bundled 113 PMD Pokémon Base animation sets from the supplied archive, selecting Walk and Idle sprite sheets with the per-species frame dimensions and timing from AnimData.xml.  The original PMD sheets are transparent PNGs; no extra backdrop is drawn over the habitat.
- The homepage wandering companion now uses the local `www/assets/pmd/manifest.json` and sheet PNGs, so supported companions animate without fetching remote sprite sheets. The portrait/fallback remains in place for species without a bundled set.
- Safari now plays the supplied grass GIF **in front of the three Poké Balls** for 0.9 seconds immediately after purchasing a ticket, then removes the foreground overlay to expose selectable balls. Ball selections are blocked while the overlay is active; an already-saved encounter opens directly to choices on reload.
- No changes to Pokémon stats, Safari odds, rewards, academic data, or save formats.
- All changes are local to this ZIP. No public deployment has been made.

## Test notes

Run `node tests/roster-regression.cjs` and `node tests/animated-assets-regression.cjs`.
Both passed in the build environment. Browser/iPhone visual and touch behavior has not been tested on a physical iPhone.

PMD sprites: credit the PMD SpriteCollab contributors; check the specific contributor licenses before distribution. Existing sprite credits screen remains available.
