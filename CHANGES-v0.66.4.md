# v0.66.4 — Remember Box sorting

The Box now immediately saves the selected sort with normal app progress and restores it whenever the Box renders, including after app restarts. All eight options are supported. Older saves and invalid values fall back to Newest first. Preference is retained in normal backup/recovery data. Selecting a new sort still resets pagination.

Validation: all eight sorts pass persistence checks using the app save bridge, including menu re-entry, simulated restart, legacy/invalid fallback, and progress preservation. Viability regression, bundle parity, and full app syntax also pass.
