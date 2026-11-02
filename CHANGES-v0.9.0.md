# v0.9.0: PokéPics + auto summaries
- PokéPics: folders (one per class), add photos from the camera or library, text in each photo is read on the iPhone (Apple Vision, offline). Tap a photo to see/fix its text, read again, or delete.
- Bound summaries: each folder keeps a summary in Summaries that rebuilds itself whenever its photos or their text change. It lists KEY TERMS ("Word: meaning", "Word – meaning", "X is …" sentences) and KEY POINTS (the most central sentences). Key terms feed the quiz minigame directly.
- ChatTalk "Save to Summaries" now makes the same kind of summary instead of pasting the whole transcript (the transcript stays on the recording).
- Fix: recordings/photos are found by name inside the app's folder at launch, so they survive the 7-day re-sign moving the app's folder.
- Native code: plugins/chattalk now also holds PokePicsPlugin.swift. The workflow adds camera and photo-library permission text.
