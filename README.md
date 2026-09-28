# MacGameHub

An independent, macOS-inspired dark game-launcher **UI prototype** made with HTML, CSS, and vanilla JavaScript. Inspired by the general launcher experience of GameHub/Highball; not affiliated with either product.

## Open Path of Exile on your Mac

The Path of Exile card has an **Open in GameHub** button using `gamehub://launch/steam/238960`. It hands off to the installed GameHub macOS application; approve the browser app-opening prompt if shown. GameHub and the Steam game must already be installed and configured. This is a real app handoff, not browser execution. The website cannot detect installation, launch success or game performance. Other cards remain fictional demos. No local server, custom helper, uploaded files or credentials are required.

If the browser remains on the page after the launch request, MacGameHub assumes GameHub is unavailable and redirects to the official GameHub for Mac page at `https://www.gamemac.com/en`. Browser security prevents definitive installed-app detection, so switching focus to GameHub cancels this fallback.

On the configured Mac, **Performance / Balanced / Quality** use the locally installed `MacGameHub Bridge.app` and the `macgamehub://` URL scheme. The bridge updates the real Path of Exile `production_Config.ini` inside GameHub container 5 and creates `production_Config.ini.macgamehub-backup` before every change. Close the game before changing preset and reopen it afterward. These controls require the bridge installed at `~/Applications/MacGameHub Bridge.app`; on other computers they remain unavailable until that local helper is installed and configured for the correct GameHub container.

## What works
- Responsive game library, title search, alphabetical sorting, installed/favorites views and compatibility filters.
- Add Game dialog with title, genre, and source. Entries stay in this browser.
- Game details, favorites, and simulated Install → Installed → Play → Stop states.
- Per-game Performance / Balanced / Quality presets; default preset for newly added games.
- Settings with reduced animation. Library and preferences persist via localStorage when available.
- Keyboard-accessible buttons, native modal dialogs, focus outlines and status announcements.

## Important limitations
This is **not a general Windows-game launcher**. A normal browser cannot directly invoke Wine or run Windows `.exe` files. Demo-game Install and Play remain UI-only. Only the Path of Exile card on the configured Mac connects to the installed bridge; other game presets do not change system or game performance. There is no bundled Wine runtime, account connection, hardware detection, or general compatibility testing.

Except for the Path of Exile app-launch card, bundled games and compatibility labels are fictional demo data. Ready / Experimental are not real test results. User-added games are Untested. No paid services, analytics, external images or dependencies are used.

## Preview locally
Open `index.html` in a modern browser, or serve this folder:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```
Then open http://127.0.0.1:8765. Data is scoped to the browser and origin; local-file storage behavior varies by browser.

## GitHub Pages
Upload `index.html`, `style.css`, `app.js`, `README.md`, and `.nojekyll` to a GitHub repository named `MacGameHub`. In **Settings → Pages**, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then Save. The site will be available at `https://YOUR-USERNAME.github.io/MacGameHub/` after deployment succeeds. This address is a template, not a verified live deployment.

No build step or secrets are required. All asset paths are relative and work under a Pages repository subpath.

## Manual verification
1. Search and filter games; verify the empty state for an unmatched query.
2. Open details, select a preset, favorite a game and check Favorites.
3. Install an uninstalled game, then Play demo and Stop demo.
4. Add a game, reload and verify persistence.
5. Change default preset, add another game and check the inherited preset.
6. Test narrow screens, keyboard navigation and Escape to dismiss dialogs.

## Future native implementation
Real launching would require a separately designed native host, carefully scoped local IPC, runtime management, per-game environments, executable selection and actual compatibility tests. None are implemented here.
