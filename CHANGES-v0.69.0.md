# v0.69.0 — KJ Costume Ultimate

- Renamed Masked costumes to KJ. Kept the existing internal costume ID so saved costumes continue working.
- Added KJ Series for Bisharp wearing the KJ costume (normal or shiny). Pawniard does not unlock this Ultimate.
- Unlock in the Box for 25 Rare Candies. Physical Fighting-type, 180 power, one target, full Stamina; follows existing question and damage rules. These are default balance values pending further tuning.
- Costume Ultimate unlocks are saved separately from ordinary Ultimate unlocks. Removing the costume disables use without erasing the unlock.
- Normal splash leads into pixel-canvas red/white lightning, K/J eyes, torn battlefield reveal, side-view uppercut/flurry/kick, rolling stick figure, shoulder close-up, dropkick title and shattering exit. Damage resolves once after the animation.
- Uses the supplied KJ sprites and the selected foe silhouette; preserves existing animation artwork. The finishing pose is interpreted from the text because only the uppercut reference was attached.
- Approximately 11.3 seconds including the normal splash. Skip Animation resolves the attack immediately; reduced-motion mode uses a short title card.
- Guards stale runs and restores filters/overlays on skip, interruption and app backgrounding.

Validation: 19 non-browser suites pass, including new unlock/damage and cinematic-cleanup checks. Pixel-canvas keyframes inspected using the canvas renderer. Browser/iPhone playback verification remains outstanding.
