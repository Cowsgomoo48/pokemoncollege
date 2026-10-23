# v0.25.0: Mystery Dungeon, harder and deeper
## Floors
- Runs are one floor at a time now. After each floor's boss you choose: LEAVE WITH REWARDS (floor bonus) or GO DEEPER.
- Each deeper floor (B2F, B3F, …) is one room-row longer (up to +5) and every enemy is stronger: +2 levels per floor on Easy, +3 on Balanced, +4 on Hard. Your team recovers 30% HP on the way down.
- Floor bonus when you leave: floors cleared × 8 (Easy) / 12 (Balanced) / 18 (Hard) Cogs. If your team faints, you keep what you earned in battles but lose the floor bonus.
- Starting floors are a bit longer: Easy 7 rows, Balanced 8, Hard 9.
## Tougher fights
- Enemy level caps raised (Easy +2 over your team's average, Balanced +4, Hard +7). Regular foes have more HP and hit a little harder.
- Bosses have about 3× (Easy) to 4.6× (Hard) normal HP and are 2 levels above the cap, so a boss fight lasts around 5 team rounds instead of 3.
- Bosses use SPREAD MOVES that hit your whole team (named by the boss's type: Surf, Earthquake, Heat Wave, Discharge, …). They're telegraphed: a red "gathering power" warning appears the round before, so you can Guard. A boss charges one every third round or so, plus a random chance.
- To keep fights fair at the app's stat scale, one enemy hit can't take more than a set share of a Pokémon's max HP (regular foes 45–60%, bosses 55–75%, spread moves about 40% per Pokémon), scaled down on Easy and Balanced. Simulated full-HP boss fights with no guarding or items: about 75–90% wins on Easy, about 50% on Balanced, about 25% on Hard.
## Battle feedback
- Action ticker at the top of the field describes every move: who used what on whom, critical hits, super/not very effective, damage, and faints.
- Targets flash and shake when hit; crits, super-effective hits and spread moves shake the whole field; spread moves flash the screen.
- Damage numbers are colour-coded (yellow crit, orange super effective, grey resisted); basic moves show the energy gained.
- HP bars drain smoothly and turn yellow under 50% and red under 20%. Fainted Pokémon sink and fade.
- The party strip under the map shows sprites instead of portraits.
## Rewards (lowered)
- Cogs per win: 3 (battle), 5 (swarm), 12 (boss), 18 (Totem/Alpha), +1 per floor depth (was 6 / 10 / 25 / 40).
- EXP per Pokémon per win: 1,500 / 2,000 (swarm) / 4,500 (boss), +15% per floor depth (was 4,537 / 6,806 / 13,612).
- Rare Candy from bosses 20% (was 50%); treasure rooms give about half the Cogs and a 25% Rare Candy chance on a perfect score (was 50%).
- Old 30/60/120 "tower cleared" bonus replaced by the floor bonus above.
