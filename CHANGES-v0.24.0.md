# v0.24.0: TM Station (monitor menu)
- The TM Lab is rebuilt from your mockup: monitor on the left, terrarium on the right, TM shelf below (your art, cut into layers).
- Monitor: winks on when you tap a TM and winks off when you tap it again. It shows the TM number, name, type, Basic/Disc slot, power, stamina (+ gained for Basic moves, − spent for Disc moves), rarity, cost, and whether this Pokémon can learn it (and which move it would replace). The screen is moving polka dots: a darker shade of the move's type colour on a lighter shade.
- Terrarium: the Pokémon receiving the TM stands inside the glass dome, its name above. Under it, the TEACH button shows the Cog cost: Common 5, Uncommon 10, Rare 20, Legendary 35. Teaching costs the Cogs and uses up the TM.
- Shelf: scrollable, 4 TMs per row, sortable by Learnable first, Power ↑/↓, Type A–Z/Z–A, Stamina ↑/↓. Each disc's rim is its rarity (red Common, blue Uncommon, yellow Rare, purple Legendary) and its centre is its type colour. ✓ = can learn, ✕ = can't, ● = already known; the selected disc lifts and spins.
- TM rarity comes from move power: Basic moves ≤7 Common, ≤11 Uncommon, ≤15 Rare, higher Legendary; Disc moves ≤65 Common, ≤90 Uncommon, ≤110 Rare, higher Legendary. TM numbers follow the move list order.

# v0.24.1
- TM shelf is now super compact: each shelf cell holds a stack of 11 TMs lying flat (rim = rarity, centre = type), filling a cell top to bottom before moving to the next; 44 TMs per shelf row.
- The selected TM's slot is highlighted with a yellow outline and glow. TMs the Pokémon can't learn (or already knows) are dimmed; details are on the monitor.
