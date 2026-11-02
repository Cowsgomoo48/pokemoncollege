# PokémonCollege v0.54.0

## 🧠 Autopilot check (Mystery Dungeon and Battle Tower)
- **What it watches:** how fast you answer compared with how long the question and its choices take to read. Answers you opened a hint for never count as rushed.
- **When it steps in:** if most of your last few answers came in faster than you could have read them (especially fast wrong ones), the game pauses and offers **SAVE & TAKE A BREAK**. Your run saves exactly where it is. **KEEP GOING** closes the message.
- **How often:** at most once every 12 answers, and never in your first 12, so it won't nag while you're warming up.

## 🎲 More varied questions
- **No back-to-back repeats:** the last few questions you saw (up to 10, depending on the set's size) are kept out of the draw.
- **Fair spread:** the more often a question has come up in a session, the less likely it is to come up again.
- **Weak spots still come back more often, but they can't take over.** Before, 3 weak items in a 12-item set could take up about 85% of the questions after the first pass. Now it's about a third, and every item in the set shows up.
