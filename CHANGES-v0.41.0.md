# PokémonCollege v0.41.0

## AI tutor for every question
- **Which questions:** questions that don't come with built-in steps, like the AI quiz questions from your study guides and your term lines.
- **How to use it:** tap **💡 Walk me through it**. The AI works out 3 to 5 steps for that exact question, and each tap shows the next one. The first step names the idea or formula to use and why it fits, and the hints never give away the final answer.
- **After a wrong answer:** you get **Answer** (just the result) plus a **Full solution** that lists each step's explanation with the work underneath it. The full solution fills in by itself a moment after you answer.
- **Which AI:** it uses Gemini if you've saved a key; otherwise Apple Intelligence on your iPhone, through a new `tutor` method in `StudyAIPlugin.swift`.
- **Saved:** each question is only worked out once, so it's instant the next time and doesn't use up Gemini's free limit.
- **Practice problems:** the code-made practice problems keep their built-in steps, and their full solutions now show each step's explanation too.
- **Without AI:** questions with a number answer get real problem-solving nudges instead of "starts with 1, two words long":
  1. List what's given and what's asked.
  2. Pick and rearrange the formula.
  3. Plug in and check the units.
- **Word answers:** without AI, these still get the small first-letter clue.

Needs a GitHub build, since the Swift plugin changed.
