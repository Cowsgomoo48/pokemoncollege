# v1.2.2: Your equations, from your homework photos

- **New "📐 Your equations" section** in the summary editor.
  - Gemini reads the set's photos (or its notes if there are no photos) and pulls out every equation you need: the formula, when to use it, and its symbols.
  - It then writes practice word problems for those equations.
- **It runs on its own** after Gemini builds a study guide from photos. You can also tap **FIND MY EQUATIONS**, **REDO** or **TRY ONE**.
- **Checked in code:** each problem Gemini writes is a template with a formula for the answer. The app tests that formula against Gemini's own example answer and throws out any that don't match, have missing numbers or can't be computed.
- **Every time it's different:**
  - Fresh numbers each time.
  - All the set's equations are mixed together.
  - The unknown and the setting change, and some problems hide values like "dropped from rest".
  - Equations you miss come up more often.
- **Help me start works on these too:** mark what's given and asked (chips come from your own equations), pick the equation, then solve. Wrong picks explain when to use each one.
- **Where they show up:** in every minigame, the Battle Tower and the Mystery Dungeon, mixed in with your set's other questions. Up to 10 per game, about 2 per equation. They also get a "Your equations" row in Study Data and Weak Spots.
- If a redo fails (for example with no internet), the old equations are kept and the error is shown.
- Service worker cache bumped to 1021. tests/eqpractice-browser.cjs now has 37 checks.
