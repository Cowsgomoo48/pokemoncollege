# v1.4.12: merge of the shiny-icon update

- Merged ChatGPT's shiny icon update (built on v1.4.8; its notes are in `CHANGES-v1.4.9-icons.md`) into v1.4.11 without losing any v1.4.9–v1.4.11 changes.
- **From the icon update:**
  - 114 new glossy icons in `www/assets/ico`, including the Elite skull.
  - The emoji map expanded from 193 to 331 entries.
  - Skull on Elite map nodes, the legend, the floor banner and the battle header.
  - Illustrated Haste bolt.
  - Readable labels in dropdowns and notifications.
  - Icon source and preview files in `art-source/`, generator files in `tools/`, and tests `tests/shiny-icons-*.cjs`.
- **Offline cache:** the new icons are cached for offline use. Old app caches are now cleaned up properly (fix from the icon update). Cache bumped to 1039.
- **Kept from v1.4.9–v1.4.11:**
  - Steel card art and the Power Armor name.
  - Tower lengths 14–18 / 16–20 / 14–22.
  - Smoother dragging, steady crosshair, scrollable card lists.
  - Victory screen, damage caps and scaling, deck viewer, type picker, and everything else.
- **Checks:** every Tower suite and the other app suites pass. The icon update's browser test passes 0 failures. Its jsdom test wasn't run here (jsdom isn't installed).
