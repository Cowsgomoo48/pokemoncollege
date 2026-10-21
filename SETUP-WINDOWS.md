# PokémonCollege: build and install from Windows (free)

The app code in `www/` is your v0.4 web app. It still works as a PWA (Safari > Add to Home Screen).
This project also wraps the same code as a real iPhone app. Apple only lets Macs compile iPhone apps,
so GitHub's free cloud Mac does the compiling, and you install the result from your laptop with a cable.

## One-time setup

1. Make a free GitHub account and create a **public** repository named `pokemoncollege`.
   Public means the *code* is visible. Your tasks, Pokémon and backups are never in the repo.
2. Upload everything in this folder to the repo. On the repo page choose Add file > Upload files, then DRAG the
   folders and files in from File Explorer (the "choose your files" button flattens folders). Check afterwards that the
   repo shows `www` (with `assets/sudo` inside), `plugins/chattalk` and `.github/workflows/build-ios.yml`.
3. On your laptop, install **Sideloadly** (sideloadly.io). Sideloadly also needs the Apple-provided
   iTunes and iCloud for Windows; download those from Apple's site, not the Microsoft Store versions
   if Sideloadly's page says otherwise. Follow Sideloadly's current instructions, since they change.
4. On your iPhone: Settings > Privacy & Security > turn on **Developer Mode** (it will restart the phone).

## Build the app

1. On GitHub open your repo > **Actions** > "Build iPhone app (unsigned IPA)" > **Run workflow**.
2. Wait several minutes. When it finishes, open the run and download the **PokemonCollege-ipa** artifact.
   Unzip it to get `PokemonCollege.ipa`.
3. If the run fails, copy the red error text from the log and bring it to me. The first run is the most
   likely to need a small fix.

## Install on the iPhone

1. Plug in the iPhone with the USB-C cable and tap **Trust** on the phone.
2. Open Sideloadly, drag in `PokemonCollege.ipa`, enter your Apple ID, press **Start**.
3. On the phone: Settings > General > VPN & Device Management > your Apple ID > **Trust**.
4. Open PokémonCollege from its home screen icon.

## Every 7 days

A free Apple ID signs the app for 7 days. When it stops opening, plug in and press Start in Sideloadly
again with the same `.ipa`. Re-installing over the old copy normally keeps your data, but **export a backup
from Settings in the app first**, every time.

## Moving your old progress in

In the old Scriptable app: Settings > Export your backup. In the new app: Settings > Import.
