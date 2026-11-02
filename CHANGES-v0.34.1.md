# PokémonCollege v0.34.1 — PokéPics fixes

## Adding photos
- **Choose Photos** now opens Apple's own photo picker, run by the app itself instead of the web file picker. The app saves each photo straight into PokéPics: shrunk to 2000 px, turned upright, one at a time. Before, every photo was turned into a huge text string and passed through the web view, which was slow and could stall.
- **Take Photo** opens the camera directly.
- Older builds fall back to the old picker.

## Reading text
- **One at a time:** photos are read one after another instead of all at once, which made every photo slow. Each photo shows WAITING, READING… or ✓.
- **Progress line:** a line shows "Reading text: 2 of 5 photos done…".
- **Resumes:** photos that were still waiting or reading when the app closed carry on the next time it opens.

## AI study guide status
- **Status line:** the bound summary now says where the AI study guide is: about to start, which part it's on, ready, or why it didn't finish (with a Retry button). The simple summary can be used while it works.
- **App closed mid-guide:** if the app closes while a guide is being built, it shows "didn't finish" with a Retry button instead of looking busy forever.

## Note
This includes new Swift code (PokePicsPlugin `pick` and `camera`). If the GitHub build fails, send the log.
