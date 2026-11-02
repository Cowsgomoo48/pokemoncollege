# PokémonCollege v0.37.0: optional free Gemini AI

## Setup
- **Settings:** Settings → Gemini online AI. Tap "Get a free key ↗" (Google AI Studio), paste the key, tap Save. Test shows which model is in use.
- **Where the key lives:** only on this iPhone. It isn't included in backups or exports.

## What it does
- **Reads the photos:** PokéPics study guides are built by Gemini reading the photos themselves, six per request, instead of the phone's text recognition.
- **Fills in gaps:** Gemini is told to ignore unreadable handwriting and fill in standard textbook facts.
- **The guide:** each guide has an overview, problem types, formulas, concepts, worked examples and 6–10 multiple-choice questions.
- **Practice types:** Gemini picks the matching practice problem types from the app's list. The app still generates and checks every practice answer itself.
- **Typed notes:** the "Build study guide with AI" button also uses Gemini when a key is saved.

## Free limits and fallback
- **Model choice:** the app asks Google which Flash models the key can use and picks the newest.
- **When a limit is hit:** if a model's daily free limit is used up, it moves to the next model and skips that one until tomorrow. Short per-minute limits are waited out (the status shows "waiting N s").
- **Fallback:** with no key, no internet, or every free limit used up, the on-device Apple AI takes over. If that isn't available either, the status says why, with a Retry button.

## Privacy
On Gemini's free tier, Google may use what you send to improve its products.
