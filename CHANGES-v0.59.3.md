# PokémonCollege v0.59.3

## Better error log
- **What changed:** on iPhone, errors that happen in the background (timers, animations, images loading, screen updates) were only logged as a bare "Script error." with no details.
- **Now:** the app catches those itself first, so Settings → Error log shows the real message, what kind of callback it came from, and the function name and stack.
- **Why:** this is to track down the "Script error." that shows up on the Box page. It also appeared back in v0.39, so it's older than this update.
