# v0.80.2
- Diagnostics for the repeating "Script error." on iOS: render() now draws each section separately (one failing section no longer stops the page) and logs the failing section by name; code added after the boot-time error wrapper (mass select, dungeon vistas/polish) is now wrapped too, so its errors show details.
