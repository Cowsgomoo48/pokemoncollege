# PokémonCollege v0.36.0

## Study guides from photos
- **Fewer blocks from Apple's filter:** the on-device AI now uses Apple's relaxed "content transformation" filter, which is meant for working on the user's own text, and writes plain text that the app reads back. Before, it used strict structured output that Apple's filter was blocking. If a part still fails, the app retries it the old way.
- **New instructions for the AI:** it's told the notes may be garbled handwriting. It should ignore nonsense and fill in standard textbook facts where the topic is clear.
- **Error messages:** when the filter still blocks a set, the status line says so plainly, with a Retry button.
- **Cleaning before the AI:** the photo text is cleaned before it reaches the AI. Repeated page headers ("MATH 141 / Section 5.3…", "Name: …") and mostly-garbled lines are dropped.
- **First summary:** the summary shown before the AI finishes (or if it can't run) no longer dumps raw OCR. It lists only lines that read cleanly, plus the practice problem types the set matches.
- **AI button:** "Build study guide with AI" on a PokéPics summary now reads the photos' text, not the placeholder summary.

## Practice problems
- **New physics types:** inclined planes, dot product, tension (single rope and two ropes), and energy unit conversions.
- **Physics types added earlier:** projectile motion, circular motion, work, springs, power, friction, weight, conservation of energy, vectors and relative motion are now included in the app.
- **Total:** 55 problem types.

## Note
New Swift code (StudyAIPlugin). If the GitHub build fails, send the log.
