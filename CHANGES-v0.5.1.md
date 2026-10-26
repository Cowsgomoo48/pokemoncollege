# PokémonCollege v0.5.1 — roster update

Removed Tirtouga, Carracosta, Wo-Chien and Chien-Pao from the Safari roster, evolution options and move-type lookup data at the user's request.

On loading or importing an older save, existing copies of these species leave the active Box and are retained in the backup JSON's retiredPokemon field. An affected selected companion is cleared. Other Pokémon, tasks, notes and rewards are preserved.

An unfinished Safari encounter containing one of these species is archived in retiredSafariEncounters and its ticket cost is refunded once (20/50/100 Cogs according to ticket type). The player can buy a new encounter from the updated pool.

The service-worker cache version is updated so the revised roster is picked up. Build and install through the existing GitHub Actions/Sideloadly workflow. This project archive is source code, not a compiled IPA; it has not been built or tested on an iPhone here.

The separately supplied PMD sprite pack is an asset collection; its animation sheets have not yet been wired into this app update.
