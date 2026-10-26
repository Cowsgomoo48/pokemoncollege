# PokémonCollege v0.43.0

## Moodle assignments become tasks automatically
- **Setup:** go to Settings → **Moodle assignments** and paste your Moodle calendar link (Moodle → Calendar → Export calendar → All courses → Get calendar URL).
- **What it adds:**
  - It checks Moodle each time the app opens or comes back to the front, at most once every 10 minutes. **CHECK NOW** checks right away.
  - New due dates become tasks marked "📥 From Moodle · course name", with Moodle's due time, and they earn Cogs like any task.
  - A bar slides down to say what was added, for example "📥 2 new assignments from Moodle: Essay 2, Quiz 4".
- **Never doubled:**
  - Every Moodle event is remembered, so the same assignment is never added twice.
  - A task you delete or finish never comes back.
  - Due dates more than a day in the past are skipped.
- **Skipped events:** "opens" events and teachers' grading reminders.
- **Due date changes:** if a teacher moves a due date, the task's date follows it and you get a notice. Changes you made yourself aren't overwritten unless Moodle changes the date again.
- **Privacy:** the link works like a password, so it's kept on this iPhone only (not in backups). The record of which assignments were already added is in backups.
- **Limit:** only assignments a teacher put into Moodle with a due date show up.
