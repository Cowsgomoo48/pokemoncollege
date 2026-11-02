# PokémonCollege v0.32.0

## Rewards
- **Tasks:** 5 Cogs plus 5 for each whole day left before the due date, capped at what the task was worth when you created it. Tasks without a due date give 5. Existing open tasks are converted to the new values. Repeating tasks are unchanged.
- **Treasure Rooms:** now also give 2–6 Poképuffs and 1–2 Rare Candy depending on how many you get right (×1.4 on Balanced and Hard). This replaces the old 25% candy chance.
- **Releasing a Pokémon:** also gives Poképuffs equal to its level ÷ 2, rounded up.
- **Study minigames:** every finished game gives 5 Cogs, plus Poképuffs (grade ÷ 10, rounded down) and Rare Candy (grade ÷ 33, rounded to nearest). Grade = answers right on the first try ÷ answers given.

## Minigames
- **Games run until the set is covered.** Smart Study asks everything once, then brings back each item you missed one more time. Learn runs until every item is right twice. Weak Points asks each weak spot once.
- **Endless Mode** for Luxor, Match-Up and Speed Round. Tap 🏁 to stop and turn the game into rewards.
- **New end screen:** shows your grade and rewards, with Study Again (back to setup) and Study Weak Spots (starts right away with those sets' weak spots).
- **Luxor:**
  - Default question timer is now 5 seconds.
  - A chain getting through or being cleared no longer ends the game. A new chain starts (−200 or +500 points).
  - Your companion now shows as its animated south-facing sprite.
- **Match-Up:**
  - 10 cards (5 pairs) on a grid, shuffled. Clear them and 5 new pairs are dealt.
  - Matches within 3 seconds of each other build a combo worth +1 bonus Cog per match.
- **Speed Round (Kahoot style):**
  - 15 seconds per question with a countdown bar.
  - 1000 points for an instant answer, down to 1 at the buzzer, and 0 for a wrong answer.
  - Every 1000 points adds 1 bonus Cog.

## Fixes
- **Export backup** in the iPhone app now saves straight to Files → On My iPhone → PokémonCollege → Backups. The share sheet and download routes didn't work inside the app.
- **Import backup** in the iPhone app now lists the backups in that folder. Tap one to restore it, or use "Choose another file…". The file picker no longer restricts file types, which was the likely cause of the blank sheet.
