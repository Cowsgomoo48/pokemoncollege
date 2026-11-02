# PokémonCollege v0.50.2

## Fixed
- **Battle Tower, skipping the climb:** tapping to skip the zoom-out between floors could log "The object is in an invalid state." The skip tried to fast-forward animations that loop forever (like your team's idle sprites), which iOS doesn't allow. It now skips only the climb animations, so tapping to skip works cleanly.
