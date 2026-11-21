# v1.6.5

- **ChatTalk: recordings are saved if the app closes.**
  - If the app is closed while a recording is running (swiped away, or iOS shuts it down), the recording is stopped and the audio file finished properly, so it stays playable.
  - The next time you open the app, it's filed like a normal recording, with a message and the label "saved when the app closed".
  - If the app is killed too suddenly to stop cleanly, the app still picks up whatever audio is on disk the next time it opens.
- **Native change:** this is in the ChatTalk plugin (`plugins/chattalk/ios/Plugin/ChatTalkPlugin.swift`), so it needs a new GitHub build and reinstall with Sideloadly. Export a backup first.
- Service worker cache bumped to 1046.
