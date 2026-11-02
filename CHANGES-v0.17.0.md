# v0.17.0: On-device AI (Apple Intelligence)
- New native plugin StudyAIPlugin.swift (plugins/chattalk) using Apple's Foundation Models framework. Runs on the iPhone; nothing is uploaded.
- ChatTalk "Save to Summaries" and PokéPics bound summaries are rewritten by the AI: a real SUMMARY paragraph, KEY TERMS with definitions, and KEY POINTS. Long text is summarized in pieces first (the model reads ~4,000 tokens at a time).
- The AI also writes multiple-choice quiz questions (with 3 wrong answers each) for each summary; the minigame mixes them with the key-term questions.
- ChatTalk "Find Tasks" uses the AI to pick out assignments and turn "Friday"/"next week" into dates (falls back to the old keyword finder).
- Any summary can be redone with "✨ Summarize & make quiz with AI" in its editor.
- Settings shows whether the AI is on and, if not, why (needs iOS 26, Apple Intelligence turned on, model still downloading, or device not eligible). Without it, everything falls back to the built-in summaries.
- Build: the workflow now switches to the newest Xcode on the GitHub runner (the AI needs the iOS 26 SDK / Xcode 26). If the runner has no Xcode 26, the app still builds; the AI just reports "needs iOS 26".
