# PokémonCollege v0.42.0

## Gemini free-limit alerts
- **Pop-up bar:** a small bar slides down from the top of the screen at about 50%, 25% and 10% of today's free Gemini limit left. Tap it to dismiss, or it hides on its own after 5 seconds.
- **When a model runs out:** a bar says so, for example "Gemini 3 Flash is used up for today. Switching to Gemini 3 Flash-Lite."
- **When everything runs out:** a red bar says Apple's on-device AI is taking over until midnight Pacific.
- **Settings → Gemini:** shows "Today's free limit: about X of Y requests left" and which models are used up.
- **How it's counted:** Google doesn't tell apps how much free limit is left, so the app counts its own Gemini requests per model per day (the limits reset at midnight Pacific).
  - Starting guesses are 20 a day for Flash and 500 a day for Flash-Lite, the numbers developers report.
  - When a model actually hits its limit, the app saves that count as the model's real limit, so the estimate gets more accurate over time.
  - The app can't see requests made from other apps or sites with the same key.
