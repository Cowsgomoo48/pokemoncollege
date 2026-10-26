# v0.29.0: Stats that do their jobs
- Physical moves now use Attack vs the target's Defense; special moves use Sp. Atk vs Sp. Def. Each of the app's 107 moves has its official category (from Pokémon Showdown's move data: 54 physical, 53 special); Ultimates use their signature move's category. Before this, every move used the higher of Attack/Sp. Atk, and Defense/Sp. Def were averaged.
- Speed: your Pokémon can dodge enemy attacks (including spread moves). The chance is 0% unless your Pokémon is faster than the attacker, rising to 25% at twice its Speed. Enemies never dodge your attacks. Speed still adds to Guard's Stamina gain. Turn order is unchanged.
- Starf Berry can now boost any of Attack, Sp. Atk, Defense, Sp. Def or Speed (its Speed boost used to do nothing).
- Boss balance re-simulated after these changes (attack bar off, no guarding or items):
  - Easy: about 84% wins, bosses last about 3.5 rounds.
  - Balanced: about 63–69% wins, about 5.5 rounds.
  - Hard: about 55–57% wins, about 6.5 rounds.
