# v0.8.0
- Sutodo tower grows from the ground up: the ground stays put on screen and the tower rises out of it (no more bobbing down).
- Permeating tasks: tick "Permeate" and pick weekdays (all 7 by default). The task repeats each chosen day; checking it off moves it to the next day. No days-left bonus; rewards are 1.5 Cogs, 20 EXP and 10 min of Pokémon EXP × a streak multiplier (×1, +0.25 for every full week in a row with every repeat done). Missing a day breaks the streak.
- Reminders (native local notifications, offline, app closed): evening before each due date (default 7:00 PM) and morning it's due (default 8:00 AM); permeating tasks remind each morning they repeat. Times, on/off and a TEST button in Settings. iOS allows 64 pending reminders; the app keeps the next 60.
- New dependency @capacitor/local-notifications (installed automatically by the GitHub build).
