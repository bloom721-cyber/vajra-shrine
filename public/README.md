# /public — Yellow Dzambhala Shrine Asset Library

**This folder is the single source of truth for every media asset in the application.**

Every asset has exactly one correct location. Every filename describes exactly what it is.
If you are unsure where something belongs, read the README in the nearest folder — never guess,
never create new top-level folders.

## Top-level map

| Folder | Contains |
|---|---|
| `images/` | All still imagery: environments, deities, offerings, overlays, UI, branding |
| `videos/` | All motion video: hero loops, deity loops, offerings, effects, cinematics |
| `audio/` | All sound: ambience, instruments, voice/mantra, UI, offerings |
| `icons/` | Interface SVG icons only (sacred-symbol art lives in `images/symbols/`) |
| `fonts/` | Self-hosted woff2 webfonts (Cinzel, Cormorant Garamond, Noto Serif Tibetan) |
| `animations/` | Lottie JSON, Rive files, raster spritesheets |
| `textures/` | Seamless **tileable** material textures (non-tiling texture *imagery* → `images/textures/`) |
| `particles/` | Particle sprites + emitter config JSON |
| `models/` | 3D assets (glTF/GLB) reserved for future volumetric shrine work |
| `documents/` | Licenses and artist credits |
| `data/` | Structured JSON: manifest, deities, offerings, theme, settings, i18n |

## Multi-deity architecture

Deity-specific assets are namespaced by slug inside each media root:

```
images/deities/<deity-slug>/
videos/deities/<deity-slug>/
audio/voice/deities/<deity-slug>/
```

`yellow-dzambhala` is the first shrine. To add White Tara, Mahakala, Medicine Buddha, etc.,
create the same three folders under a new slug and register the deity in `data/deities.json`.
**Nothing else in the structure changes.** Shared, deity-agnostic art lives in
`images/deities/_shared/`.

## Naming rules (non-negotiable)

- lowercase kebab-case only, never spaces
- descriptive, never generic: `water-offering-loop.mp4`, never `video2.mp4`
- loops end in `-loop`, mobile variants in `-mobile`, dark variants in `-night`/`-dark`
- one logical asset type per folder

## Placeholder → final replacement

All media files are currently **zero-byte placeholders**. To finalize:

1. Drop the final file at the exact same path with the exact same filename.
2. Update its `status` in `data/asset-manifest.json` from `placeholder` to `final`.
3. Respect the `maxFileSizeKB` and format guidance in the manifest and folder READMEs.

The manifest is designed so a script can later scan an uploaded ZIP, match filenames,
replace placeholders, flag missing/duplicate assets, and regenerate itself.

## Format standards (Vercel deployment)

- **Images:** WebP preferred · PNG only when alpha is required · SVG for icons/ornaments
- **Video:** MP4 H.264 preferred · WebM/VP9 as alternate · seamless loops · muted, playsinline
- **Audio:** MP3 or AAC · seamless loops for ambience · natural decay tails for bells
- **JSON:** UTF-8, 2-space indent
