# images/deities/

One folder per deity, named by slug: `yellow-dzambhala/`, later `white-tara/`, `green-tara/`,
`mahakala/`, `medicine-buddha/`, `vajrasattva/`, `guru-rinpoche/`, `avalokiteshvara/`.

Required set per deity (mirror the yellow-dzambhala filenames, swapping the slug):
- `<slug>.webp` — primary shrine artwork
- `<slug>-portrait.webp`, `<slug>-full-body.webp`
- detail crops as needed (`-face-detail`, attribute details like `-mongoose-detail`)
- `<slug>-halo.webp`, `<slug>-silhouette.webp`

`_shared/` holds deity-agnostic frames and glow overlays. Register every new deity in
`/data/deities.json` — the app reads that file, not the folder tree.
