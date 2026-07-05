# images/

All still imagery. WebP preferred; PNG only when transparency is required; SVG for line art.

| Subfolder | Purpose |
|---|---|
| `shrine/` | Environments: backgrounds, altars, architecture, temple details |
| `deities/<slug>/` | Deity artwork, one folder per deity; `_shared/` for reusable frames/glows |
| `offerings/` | Offering stills by type (water, butter-lamps, incense, flowers, fruit, jewels) |
| `symbols/` | Sacred symbols: lotus, jewels, mudras, `auspicious/` (Eight Auspicious Symbols SVG) |
| `overlays/` | Compositing layers: lighting, smoke, particles (alpha or screen-blend) |
| `decorative/` | Borders, frames, and the endless-knot title dividers |
| `textures/` | Non-tiling texture *imagery* (tileables live in top-level `/textures/`) |
| `materials/` | Material/finish reference imagery |
| `ui/` | Buttons, splash, loading, empty states, illustrations |
| `branding/` | Logos and app-icon masters |

## Guidelines
- Backgrounds: 2048x2732 portrait master, export mobile variant, target < 500 KB WebP (q 80–85)
- Cut-out deity art: transparent WebP, 2048px min edge
- Overlays intended for `mix-blend-mode: screen` should sit on pure black
- Never bake UI text into imagery — all text is rendered live (i18n)

## Replacement
Same path, same filename, update manifest status. Run any optimization before committing —
no source PSDs or raw Midjourney exports in this tree.
