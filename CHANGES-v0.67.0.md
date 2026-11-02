# v0.67.0 — Tap Protection and clear dungeon HUD

## Dungeon messages

Battle messages and evolution stone counters now share a stacked bottom HUD. Messages grow upward as they wrap, leaving the stone counters visible below them. Dynamically created messages use the same layout.

## Tap Protection

Every submitted study question uses two consecutive locks, counted from the prompt words (excluding answer choices and instructions):
- Red skim stage: 0.040 seconds per word, with a fast pulsing red surround and red lock over each submission control.
- Blue reading stage: (3 × words) / 2 seconds, with a slower pulsing blue border and blue locks.
- After both stages, answer submission unlocks. A countdown labels each stage. For example, 20 words means 0.8 seconds red, then 30 seconds blue.

Implemented in shared multiple-choice/typed questions, make-up questions, DIY work submission, Speed Round, and the legacy quiz route. This covers dungeon, Battle Tower and Luxor questions. Typing, calculator use and hints remain usable during protection. Flashcard self-assessment and Match-Up tile matching are unchanged. Speed Round's 15-second answer countdown and speed scoring begin after reading protection ends.

Guards block keyboard submission and repeat submission as well as button taps. Each new question receives a fresh timer; detached or replaced cards clean up their timers. Background timer throttling does not extend deadlines. Reduced-motion settings disable pulsing while retaining colors and locks. No new save fields or art assets are required.

## Validation

New timing/state/lifecycle checks and all 14 existing non-browser regression suites pass, including full app syntax and exact JavaScript bundle parity. Physical-device and browser visual playback remain unverified in this environment.
