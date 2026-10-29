# PokémonCollege v0.61.4

## 💻 Clearer command-line questions
- **Asking for a command:** every command problem now asks "What command would you type to …?". For example, "How many lines containing “warning” appear only once in list.txt?" is now "What command would you type to count how many lines containing “warning” appear only once in list.txt?", so it's clear you're typing a command, not a number.
- **Flashcard terms in command-line sets:**
  - **Kept:** only terms that are real commands or options (like `ls -l`, `-type f`, `grep -v`, `*`). They're asked as **"Which command or option does this: …?"** and **"What does `ls -l` do?"**, with commands as the choices.
  - **Skipped:** vague terms the AI pulled from your notes, like "text presentation" or "size filter".
  - **Formula lines:** "grep – grep "PATTERN" FILE" is shown as `grep "PATTERN" FILE`. Terms with placeholders like PATTERN or FILE stay multiple choice and are never typed.
