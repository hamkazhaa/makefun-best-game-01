# Harbour Line

A round-based tactical FPS on the docks of Port Meridian, built with
three.js. Two teams of four fight over a container dock at dusk: Vanguard
attacks, planting a charge at Site A (under the gantry crane) or Site B
(beside the warehouse); Ember defends. First to 7 rounds takes the match.

## How it plays

- **Goal:** plant the charge and let it blow, or eliminate the other team.
- **Economy:** kills, plants and round wins pay money; spend it in the buy
  phase on six original guns (including the new Kestrel DMR), frag
  grenades and Kevlar. Losing rounds pay a growing streak bonus.
- **Bots:** nine AI teammates and opponents with waypoint routing, flanking,
  reaction delays, burst fire, planting, defusing and falling back when hurt.
- **Feel:** hitscan gunplay with spread, recoil, headshots (4×), damage
  falloff, tracers, sparks, explosion rings, a live minimap, killfeed,
  round-history pips and fully synthesised WebAudio sound — no audio files.
- **Controls:** WASD move, mouse look, click fire, right-click aim,
  R reload, G grenade, E plant/defuse, B buy, 1–6 weapons, Q swap,
  Ctrl crouch, Space jump, M mute.

## Run it

```
node serve.ts
```

Then open http://localhost:8080 in desktop Chrome. No build step, no
network: every file the game loads lives under `game/`.

## Files

- `game/index.html` — page shell and HUD
- `game/src/boot.js` — boot, the fixed-step loop, shooting, shot scenes
- `game/src/dock.js` — the Port Meridian map and waypoint graph
- `game/src/squad.js` — bot AI
- `game/src/series.js` — the match state machine (rounds, money, charge)
- `game/src/runner.js` — player movement and collision
- `game/src/arsenal.js` — weapons, viewmodels, spread and falloff
- `game/src/overlay.js` — HUD, buy menu, minimap
- `game/src/fx.js` — tracers, sparks, explosions, grenades
- `game/src/sound.js` — synthesised sound effects
- `game/src/controls.js` — keyboard, mouse and pointer lock
- `game/src/theme.js` — the dusk colour table
- `game/vendor/three/three.module.min.js` — three.js 0.187.0 (vendored)
- `main.ts` — copies `game/` and `screenshots/` to `/output` and writes
  `dossier.json` with the kit's vendored library

## Screenshots

`?shot=start|play|buy|end&seed=1` stages deterministic frames: the title
screen, play in progress, the buy menu, and the match-results screen with
its restart button.
