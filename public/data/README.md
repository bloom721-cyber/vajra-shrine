# data/

Structured JSON consumed by the application. UTF-8, 2-space indent.

| File | Role |
|---|---|
| `asset-manifest.json` | **Master index of every asset** — path, type, purpose, specs, status |
| `deities.json` | Deity registry (active + planned shrines) |
| `offerings.json` | Offering definitions wiring icon + image + video + sound |
| `shrine.json` | Shrine scene composition: layers, z-order, blend modes, ken-burns |
| `prayers.json` | Merit dedication and prayer texts |
| `audio.json` | Audio buses, bell synthesis config, preload list |
| `videos.json` | Playback defaults, reduced-motion fallback, size budgets |
| `settings.json` | Default user settings |
| `theme.json` | Palette, typography, motion philosophy |
| `animations.json` | Animation registry |
| `translations.json` | i18n strings |
| `credits.json` | Credits data |
| `version.json` | Library version + phase marker |

App code reads these files — never hardcode asset paths in components. Changing a path here
must be matched by moving the file, and vice versa.
