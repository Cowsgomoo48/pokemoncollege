# v1.4.9 — Shiny illustrated icons

Built from the supplied v1.4.8 project.

- Added 113 glossy pastel icon designs and a bespoke horned Elite skull, all with transparent backgrounds. Existing illustrated icons cover synonymous symbols.
- Expanded the shared replacement map from 193 to 331 emoji tokens, covering card fallbacks, relics, statuses, rewards, events, and general app screens. Game data retains its existing tokens; the renderer substitutes artwork.
- Elite room nodes, the map legend, floor-entry banner, and combat header use the new skull. Boss rooms keep their crown.
- The CSS Haste badge uses the illustrated lightning bolt instead of a system emoji.
- Added readable image labels and support for both emoji/text variation selectors. Native dropdowns and notification text use readable text where inline illustrations are unsupported. Editable user text, code, mathematical content, and SVG content are preserved.
- Bundled the new icons in the offline cache and fixed cleanup of older app-shell cache versions.
- Prepared app assets at 256px (Elite skull at 512px). The original Elite skull is in `art-source/elite-skull.png`; open `art-source/icon-preview.html` to review the full new collection.
- Generation descriptions and style instructions are in `tools/icons_prompts.json` and `tools/icon-generation-style.txt`. `tools/icons_extra.json` keeps the added mappings when the existing icon generator is rerun.

No card mechanics, balance values, progression, or save schema were changed.

Validation results are recorded in `ICON-VALIDATION.md`.
