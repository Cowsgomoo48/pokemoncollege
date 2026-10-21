# v0.7.0: ChatTalk
- Records lectures with the iPhone microphone and keeps recording with the screen locked (iOS "audio" background mode). Phone calls/alarms pause it; it resumes afterwards.
- Auto-stop: stops after 30 seconds with no teacher-level voice. "Teacher-level" means loud/near enough (setting: close / normal distance / far away). It can't truly tell whose voice it is.
- Transcribes on the iPhone (Apple speech recognition, on-device only, 50-second pieces). Needs English dictation available offline on the phone.
- Recordings list: play back, rename, delete, transcribe, save the transcript to Summaries, find tasks.
- Find Tasks (also the bottom-right button on the Sutodo List): picks sentences that sound like assignments and guesses due dates from "tomorrow", weekday names and "next week"; you tick which to add.
- New: plugins/chattalk (native Swift code). Upload the plugins folder to GitHub with everything else. The workflow now adds the microphone/speech permission text and the background-audio setting.
- Backups (JSON) keep transcripts but not audio files.
