# audio/

All sound. MP3 (192 kbps) or AAC. Ambience loops must be seamless; bells keep natural decay.

| Subfolder | Purpose |
|---|---|
| `ambience/` | temple / wind / fire / water beds — 60–120 s seamless loops |
| `instruments/` | bells, singing bowls, prayer wheels, wood — one-shots with full decay |
| `foley/` | footsteps, incense strikes — short details |
| `ui/` | interaction sounds: quiet, organic, **never gamified** |
| `notifications/` | gentle reminder tones |
| `offerings/` | one-shot per offering type, matched to the offering videos |
| `voice/deities/<slug>/` | chanted mantra recordings per deity |
| `voice/guided/` | spoken guidance (merit dedication) |
| `meditation/` | drones and pacing tones |
| `music/` | ambient musical beds, 2–4 min loopable |
| `silence/` | room tone |

## Note on the temple bell
The practice-screen bell is **synthesized via Web Audio API**. Files in `instruments/bells/`
are fallbacks and alternates only. Budget ≤ 2 MB per file; long mantra loops may exceed this —
flag them in the manifest if so.
