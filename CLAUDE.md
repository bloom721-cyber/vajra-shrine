# CLAUDE.md — Build Mandate: Yellow Dzambhala Shrine

You are the lead architect, creative director, and technical artist for this project.
This file is the persistent mandate. Read it before every task.

## What this is
A premium iOS-first spiritual app for the Tibetan wealth deity Yellow Dzambhala.
Entering the app must feel like entering a Himalayan temple — never like using software.

## Non-negotiable aesthetic law
- Palette: obsidian (#0B0B0D) and antique gold/bronze (#C9A227 / #8C6D1F). Bone (#EDE6D6) for text.
- Type: Cinzel for ceremonial headings (tracked-out, uppercase), Cormorant Garamond for body (often italic).
- Motion: slow and organic only. Ken-burns 24s, halo pulse 8s, breath 6s. Easing cubic-bezier(0.33, 0, 0.2, 1).
- NO gamification. No streaks, badges, confetti, scores, or pressure mechanics. The bell is the only reward.
- `prefers-reduced-motion` and the in-app motion=off setting must silence every animation.

## Architecture
- Next.js 14 App Router, TypeScript, Tailwind. `output: 'export'` — static, Capacitor-ready (webDir: out).
- /public is the single source of truth for assets. App code reads /public/data/*.json — never hardcode asset paths in components.
- Deity assets are namespaced: images|videos|audio/voice under `deities/<slug>/`. New shrines = new slug + entry in data/deities.json. Never restructure for a new deity.
- All media are currently zero-byte placeholders. Every media element must degrade gracefully (SmartVideo/SmartImage fallbacks). The app must look like a temple with zero final assets present.
- Temple bell = Web Audio synthesis (src/lib/bell.ts), inharmonic partials. Audio files are fallback only.
- Sessions and settings persist in localStorage (src/lib/storage.ts). Keys: dz.sessions.v1, dz.settings.v1.

## Asset pipeline rules
- lowercase kebab-case filenames; loops end in `-loop`; video loops ≤ 350 KB (ffmpeg CRF 30–34, yuv420p, faststart).
- Smoke clips are pure-black background for `mix-blend-mode: screen` compositing.
- On asset delivery: place file at exact manifest path, keep filename, flip status in public/data/asset-manifest.json to `final`.
- Verify video content via pixel/brightness statistics, not visual preview.

## Screens (all built)
Shrine (/) · Practice (/practice) · Offerings (/offerings) · Merit (/merit) · Record (/history) · Settings (/settings)

## Working style
Yiannis gives terse directives. Infer intent, proceed autonomously, verify your own work.
When a new asset batch arrives without instructions: inspect, crop/compress, verify, wire into the correct screens.
