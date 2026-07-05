# animations/

- `lottie/` — vector UI animation (mantra ring, endless-knot draw, lotus bloom, bell ripple)
- `rive/` — interactive state-machine animation
- `sprites/` — raster spritesheets (power-of-two, WebP)

All animation must respect `prefers-reduced-motion`: every animated element needs a static
fallback (poster frame or first frame). Slow, organic timing only — see `/data/theme.json`.
