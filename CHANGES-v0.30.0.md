# v0.30.0: Friendlier reminders + automatic backups
## Reminders
- No more "75% of your time left". Each reminder now has a little line from your companion Pokémon (by nickname), then the task's description and its due date, e.g.
  📚 Read chapter 9 — "Gearie brought a snack and a reminder! / Sections 9.1–9.4… / Due Fri, Oct 30 3:00 PM"
- The lines change with urgency: early 📌, middle 📚, late ⏰, check-in 👀, the night before 🌙 "Tomorrow:", the morning of ☀️ "Today:", Urgent mode 🚨. Repeating (Permeating) tasks get a companion line and their streak.
- Reminder timing and modes (Default / Pester / Urgent) are unchanged.
## Automatic backup
- Every time the app leaves the screen (swipe home, switch apps, lock the phone, which always happens before an app is closed), it saves a full backup to Files → On My iPhone → PokémonCollege → Backups:
  - PokemonCollege-latest.json (always the newest), plus
  - PokemonCollege-YYYY-MM-DD.json, one per day, keeping the last 14 days.
- It only writes when something changed since the last backup. Settings → "Automatic backup" shows the last save time, has an ON/OFF switch and a SAVE NOW button.
- Restore the usual way: Settings → Import backup → pick one of those files.
- Build changes: adds the official @capacitor/filesystem and @capacitor/app plugins (installed automatically by the GitHub build) and turns on Files-app access to the app's Documents folder.
