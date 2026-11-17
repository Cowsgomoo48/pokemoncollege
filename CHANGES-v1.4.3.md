# v1.4.3

- **Battle screen fit.** The battle now sizes itself to end exactly at the bottom bar, so the white strip under it is gone.
- **Build fix.** A build step had been copying the battle scroll-lock code into the app again on every update (17 copies). The app was running the oldest copy, which is why the earlier screen-position fixes didn't take. It now has a single, current copy.
- Service worker cache bumped to 1030.
