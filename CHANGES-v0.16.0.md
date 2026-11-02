# v0.16.0
- Cogs are always whole numbers (rewards round to the nearest Cog; existing balances are rounded once). Permeating tasks give 10 Cogs × their streak multiplier.
- Tasks can have a due time and a reminder style:
  - Default: at 75%, 50% and 25% of the time left, plus the evening before.
  - Pester: a day after it was set, at 80/60/40/20% time left, the evening before, and the morning it's due.
  - Urgent: every morning until it's due.
  Percentage reminders that would land at night move to 8 AM / 9 PM. "Time left" counts from when the due date was set.
- Trainer Rewards pass: tap your level bar (🎁 shows when rewards are waiting). Every level 2–100 has a reward; PokeBox every 5, GreaterBox every 10, UltraBox + Shiny Ticket every 25, special rewards at 12, 15, 20, 30, 35, 40, 50, 60, 75, 90, 100 (Rare Pokémon at 30 and 50, a Shiny at 75, a Costumed Pokémon at 100). Replaces the old TM-every-5-levels reward (TMs now come with each PokeBox level).
- Settings → Reset Progress (asks twice) and Full Reset (asks three times): grassy-field send-off with your Pokémon hopping across, your level and currencies counting down to zero, then a black close. Reset keeps tasks, summaries, quiz sets, recordings and photos; Full Reset also deletes them. Both start you with 3 Safari Tickets.

# v0.16.1
- After the app has started, an unexpected error no longer covers the screen with "could not finish loading"; it shows a small notice and is saved in Settings → Error log. Habitat animation errors are caught too.
