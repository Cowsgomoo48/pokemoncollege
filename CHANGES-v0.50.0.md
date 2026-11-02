# PokémonCollege v0.50.0

## 🗼 Eight more Battle Tower environments
- 🦇 **Dank Depths:** Dark-types dodge as if they had +4 Speed. Foe Dark-types can dodge your attack: 20% of the time after a Make-Up answer, 40% after a wrong answer (a first-try answer always lands).
- 💎 **Crystal Mines:** Rock- and Ground-type foes show up much more often (about 7 in 10 instead of 2 in 10). After both sides have moved, every Pokémon that isn't Ground, Steel or Rock type takes 1 damage.
- ❄️ **Snowscape:** Ice-types take 10% less damage from attacks.
- 🎲 **Dice Arena:** moves that hit 2–5 times (Bullet Seed, Rock Blast and similar) always hit at least 3 times. Moves with a set number of hits, like Dual Wingbeat or Triple Axel, don't change.
- 👻 **Spook Zone:** every attack heals the attacker 10% of each hit's damage, rounded down, hit by hit. Hits under 10 damage heal nothing.
- 👑 **King's Battlefield:** the highest-level Pokémon on each side glows gold. It deals 15% more damage and takes 5% less. If it faints, each of its teammates loses 20% of their max HP, and nothing can block or reduce that.
- 🏥 **Pokémon Center:** revived Pokémon get back up with 15% of their max HP instead of 1 HP.
- 🧱 **Lifeblock Gym:** guarding also heals the guard for half the Stamina it gains, rounded down.
- **For both sides:** like the others, these apply to foes too, except Pokémon Center and Lifeblock Gym, which only matter for your team because foes don't revive or guard.
- **Backgrounds:** each has its own battlefield background.
- **Runs in progress:** these are added to the end of the environment order.

## Changed
- 🕊️ **Holy Sanctum** now heals 2 HP at the end of your turn (was 3).

## Fixed
- **Double attack:** tapping a move twice quickly could make a Pokémon attack twice and start two enemy turns at once, which could freeze the battle. This was also in the old Mystery Dungeon battles. A Pokémon now only attacks once per turn.
