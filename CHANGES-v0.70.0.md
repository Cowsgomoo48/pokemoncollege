# v0.70.0 — Task types and Auto-Complete

## Task types
- **Assignment:** unchanged (days-left Cogs, +20 early bonus).
- **General Task:** always gives a flat 5 Cogs.
- **Test:** shows a **Choose Summaries** list. After the test is created, every full minute spent answering questions from those summaries (in any mode that asks study questions) adds +1.7% to the test's Cogs, player EXP and Pokémon EXP when it's completed. Study time is counted from when each question appears until it's answered (up to 5 minutes per question), and only time after the test was created counts.
- Older saved tasks keep their type (Assignment / General).

## Auto-Complete
- New per-task checkbox. Next time the app is opened (or comes back to the foreground) after it's due, the task completes itself and pays out normally: 1 hour after the due time, or at the end of the due day if no time is set (end of the day it was added if it has no due date).
