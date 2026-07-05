# Yellow Dzambhala Shrine

A living shrine, not an app. Next.js 14 · TypeScript · Tailwind · Capacitor.

## Run
```
npm install
npm run dev
```

## Ship to iOS
```
npm install @capacitor/core @capacitor/cli @capacitor/ios
npx cap add ios
npm run cap:ios
```

## Structure
- `public/` — the complete asset library (see `public/README.md` and `public/data/asset-manifest.json`)
- `src/app/` — screens: shrine, practice, offerings, merit, history, settings
- `src/lib/` — bell synthesis, storage, data loaders
- `CLAUDE.md` — the persistent build mandate for Claude Code

All media are placeholders; the app renders complete procedural fallbacks until the final asset ZIP is dropped in.
