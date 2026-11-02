# PokémonCollege v0.40.0

## Study guides keep your outline
- **Your topics stay in:** if your notes have numbered headings and bullet points, the study guide keeps every one of them under **TOPICS TO STUDY**, with sub-bullets indented. The AI can no longer drop topics or replace them with something generic.
- **Better summary:** when the AI writes a summary that just repeats its own instructions (like "identify the type of problem… underlying ideas… Problem Solving"), it's thrown out. You get a summary built from your headings and items instead.
- **LaTeX becomes symbols:** `\Sigma \vec{F}`, `f_s \le \mu_s N`, `\frac{mv^2}{r}` and `\frac{1}{2}kx^2` become ΣF, fₛ ≤ μₛN, (mv²)/r and ½kx². The AI gets this clean version too.
- **Fractions read cleanly:** `dW/dt` instead of `(dW)/(dt)`, and ½ instead of 1/2.
- **Edited notes are used:** "Build study guide" now uses what's in the box if you changed it, instead of an older copy of the notes.
- **Flashcards from the outline:** bullets written as "Name: description" become flashcards and matching questions.
- **Practice problems found:** the outline is scanned for practice problem types (Newton's 2nd law, inclines, friction, tension, circular motion, work, springs, energy, vectors and more).
- **Fewer wrong matches:** "slope" in physics no longer adds slope-of-a-line problems, and "Directional Motion Limits" no longer adds calculus limits.

## Hints walk you through the problem
- **One step at a time:** every practice problem type (56 of them) now has step-by-step hints. Each 💡 tap shows the next step. For example, for 7ˣ = 30: "The variable is in the exponent, so use a log to undo it: take the log of both sides." The answer itself isn't given away.
- **Last hint:** after the final step, the button offers to remove wrong answers, like the old hint did.
- **Term and quiz questions:** these get a gentle hint first, such as the answer's first letter and word count, or a word the right definition uses.
- **Everywhere:** hints now work in every question pop-up: fights, guard, revive, items, treasure rooms and Luxor.

## Short and long answers
- **After a wrong answer,** a practice problem shows two parts:
  - **Answer:** the short result.
  - **Full solution:** the worked steps with your numbers plugged in.
- **Flashcards:** the back of a practice-problem card lists the worked steps.
- **Summary editor:** "Try a sample problem" shows the worked steps.

## New problem type
- **Exponential equations (use logs):** three kinds of problem:
  - same-base equations like 2^(x+1) = 8
  - natural-log equations like 3e^(2x) = 30
  - log-of-both-sides equations like 7ˣ = 30
