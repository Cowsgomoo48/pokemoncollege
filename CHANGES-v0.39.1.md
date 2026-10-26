# PokémonCollege v0.39.1

## App icon badge
- **Red number on the icon:** like Todoist, the PokemonCollege icon shows how many tasks need doing today: tasks due today, overdue tasks, and routine (permeating) tasks scheduled for today that you haven't checked off.
- **Updates on its own:** the number changes as soon as you add, finish or undo a task. Just after midnight it rolls over to the new day, even if the app stays closed (it plans two weeks ahead each time the app saves).
- **Permission:** it uses notification permission. If reminders are already allowed, nothing new is asked.
- **Setting:** Settings → App icon badge turns it on or off.
- **Native:** new `AppBadgePlugin.swift` in the chattalk plugin. The midnight updates are silent notifications that only change the number: no banner and no sound.
