# PokémonCollege v0.53.0

## 🃏 Battle Tower perks are now cards
- **Every 5 floors** you're dealt 3 cards and keep one. Tap a card to see it up close, then **TAKE THIS CARD**.
- **45 cards**, each drawn as true pixel art (no blurry edges). Names and text are written on the card in pixel fonts.
- **Card look:**
  - **Element** (frame colour):
    - 🔥 **Fire** (red): offense.
    - 💧 **Water** (blue): defense.
    - 🌿 **Grass** (green): utility.
  - **Rarity** (stars, and the inside of the card is painted like a Poké Ball):
    - ★ **Common**: Poké Ball. Red top fading to white.
    - ★★ **Uncommon**: Great Ball. Blue top with red patches on both sides.
    - ★★★ **Rare**: Ultra Ball. Black top with two yellow stripes.
    - ★★★★ **Super Rare**: Quick Ball. Blue with yellow zigzags top and bottom.
    - ★★★★★ **Legendary**: Master Ball. Purple top with two pink ovals.
- **How often each rarity shows up** (each card slot, around floor 5): Common 60% · Uncommon 29% · Rare 9% · Super Rare 2% · Legendary about 0.4%. Rare and better cards get more common as you climb (up to twice as common by floor 40).
- **Stacking:** cards marked "Stacks" can be taken again. All other cards show up only until you have them.
- **Your cards:** your cards appear as icons under your team. Tap the row to see all of them.
- **Runs in progress:** old perks turn into cards: Power Charm → X Attack ×2, Iron Shell → Sturdy Shell ×2, Battery Pack → Stamina Snack ×2, Lucky Ticket → Miner's Dream ×2.

### All 45 cards
**★ Common**
- 🔥 Net Ball: +5% damage to Bug- and Water-type foes.
- 🔥 Charcoal: Fire-type moves +10%.
- 🔥 Mystic Water: Water-type moves +10%.
- 🔥 Miracle Seed: Grass-type moves +10%.
- 🔥 Muscle Band: physical moves +6%.
- 🔥 Wise Glasses: special moves +6%.
- 💧 Seed Surge: your Grass-types heal 1 HP after each battle.
- 💧 Hot Meal: right away, heal everyone 50%; fainted Pokémon get up with 25%.
- 💧 Revival Herb: right away, fainted Pokémon get up with 50%. Only offered when someone has fainted.
- 💧 Sturdy Shell: take 5% less damage. Stacks up to 4.
- 💧 Leftovers: after each round, your most hurt Pokémon heals 1 HP.
- 💧 Bright Powder: +5% dodge chance.
- 🌿 Miner's Dream: +10% Tickets. Stacks.
- 🌿 Pay Day: +1 Ticket for each foe knocked out.
- 🌿 Stamina Snack: +10 Stamina at the start of each battle. Stacks.
- 🌿 Cram Notes: the timing bar moves 10% slower.
- 🌿 Lucky Egg: +15% EXP. Stacks.
- 🌿 Supply Drop: right away, get 2 random items.

**★★ Uncommon**
- 🔥 X Attack: +5% damage. Stacks.
- 🔥 Quick Claw: fast moves +10%.
- 🔥 Rocky Helmet: foes that hit you take 1 damage back.
- 🔥 Expert Belt: super-effective hits +15%.
- 🔥 First Strike: each Pokémon's first attack in a battle +25%.
- 💧 Tender Love and Care: revived Pokémon get +4 HP. Stacks (+4 each).
- 💧 Guard Up: Guard blocks 10% more.
- 💧 Eviolite: Pokémon that can still evolve take 8% less damage.
- 💧 Protective Pads: take 10% less from physical moves.
- 💧 Assault Vest: take 10% less from special moves.
- 🌿 Double Dip: charged attacks refund 10% of their Stamina, +5% for each extra copy. Stacks.
- 🌿 Amulet Coin: double Tickets from bosses.
- 🌿 Haggler: shop prices 30% lower.

**★★★ Rare**
- 🔥 Fury: +10% damage for each fainted teammate. The bonus goes away when they're revived.
- 🔥 Life Orb: +20% damage, but each attack costs the attacker 1 HP (never below 1).
- 🔥 Scope Lens: the critical-hit zone on the timing bar is 50% wider.
- 💧 Focus Sash: once per battle, each Pokémon at full HP survives a knockout hit with 1 HP.
- 💧 Shell Bell: attacks heal the attacker 8% of the damage dealt (at least 1).
- 🌿 Frenzy: extra damage beyond what a knockout needed turns into Tickets.
- 🌿 Quick Ball: foes skip their first turn in every battle.
- 🌿 Thief: 25% chance after each battle to get a random item.

**★★★★ Super Rare**
- 🔥 Choice Band: charged attacks +25%.
- 💧 Second Wind: once per run, when your whole team faints, everyone gets back up with 30% HP.
- 🌿 Golden Ticket: +40% Tickets, and shop prices 25% lower.
- 🌿 Card Shark: card picks show 4 cards, and cards of 3★ or more show up twice as often.

**★★★★★ Legendary**
- 🔥 Ultra Burst: attacks after a first-try correct answer deal 40% more damage.
- 💧 Sacred Ash: after every battle, fainted Pokémon get up with 50% HP and everyone heals 10%.

## Fonts
- The cards use the Pixelify Sans, Silkscreen and VT323 pixel fonts. All three are free under the SIL Open Font License and are bundled with the app (licence files are in `www/assets/fonts`).
