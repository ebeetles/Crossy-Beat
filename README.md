# CROSSBEAT

A rhythm game on Crossy Road's skeleton: a 2.5D voxel hopper where the whole world
advances **one step per beat**, and you may commit exactly one move per beat inside a
strict timing window. Crypt of the NecroDancer applied to Crossy Road.

- **Static site, no build step.** Plain HTML/CSS/JS ES modules.
- **Everything procedural.** All geometry is `BoxGeometry`; all audio is synthesized at
  runtime with Tone.js. No model, texture, or audio files.
- **Desktop + keyboard.** WASD / arrows to hop, on the beat.

## Run locally

ES modules and import maps do **not** work over `file://`. Serve the folder:

```bash
python3 -m http.server 8123
```

Then open <http://localhost:8123>. Click **PRESS TO START** (this unlocks audio) and run
the one-time calibration.

## Deploy to GitHub Pages

Push these files to a repo and enable Pages (Settings → Pages → deploy from branch).
No build/CI needed — Pages serves the static files directly. Three.js and Tone.js load
from CDNs via the import map / a script tag.

## How it works (architecture)

| File | Role |
|------|------|
| `src/config.js` | Every tunable: BPM curve, groove window, densities, palettes, camera. |
| `src/clock.js`  | Tone `Transport` wrapper — the single source of truth for timing. |
| `src/audio.js`  | Generative layered stems + reactive hooks (near-miss, combo, death). |
| `src/world.js`  | Discrete grid sim; entity positions are a pure function of the beat index. |
| `src/generator.js` | Procedural rows + a solvability **BFS** that rejects unbeatable batches. |
| `src/player.js` | Beat-gated input latching and on-beat grading. |
| `src/render.js` | Three.js scene; interpolates the discrete sim every frame (wraps snap). |
| `src/juice.js`  | Particle bursts. |
| `src/hud.js`    | Score, combo, the visible beat pulse, feedback, game-over. |
| `src/main.js`   | Bootstrap + state machine wiring it all together. |

Two layers are kept strictly separate: the **simulation** only changes on beat
boundaries and never reads frame time; the **renderer** runs every `requestAnimationFrame`
and only interpolates. All beat timing comes from the audio clock, never rAF deltas.
