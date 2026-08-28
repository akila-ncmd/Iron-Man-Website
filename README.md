# Avengers: Doomsday — a scroll-driven concept site

A single-page cinematic teaser that hands the projector to the scrollbar. The
page opens as an Iron Man retrospective in Stark red, then hands the accent
colour over to Doctor Doom's Latverian green as the countdown to **18 December
2026** takes over.

**Live:** https://iron-man-website-flame.vercel.app

Fan work. Non-commercial, unaffiliated with Marvel or Disney — see
[Rights](#rights).

---

## What it is

There is one route and no backend. The whole build is a front-end exercise in
pacing: how much of a film trailer's grammar — the hold, the cut, the reveal —
survives being driven by a scroll position instead of a timeline.

Two full-screen sequences are scrubbed frame by frame as you scroll:

| Sequence | Frames | Section | Beat |
| --- | --- | --- | --- |
| `public/frames` | 169 | `Hero` | The armour, in Stark red |
| `public/frames2` | 169 | `CinematicReveal` | The sacrifice, into the handover |

Each sequence is decoded into an `HTMLImageElement` array up front, then painted
to a full-viewport `<canvas>` on a `requestAnimationFrame`-throttled scroll
handler. Frame index is derived from the section's own
`getBoundingClientRect()`, so the sequence is pinned to how far through *that*
section you are, not to absolute page offset. Dialogue cards, the progress bar
and the power readout all read from the same normalised `0→1` progress value, so
the whole section stays in step with a single number.

## The rest of the surface

- **Loading screen** — the `Avengers: Doomsday` logo as a real GLB, lit by two
  spotlights sweeping in opposition, with the camera pushing slowly inward.
- **3D mask** — Doctor Doom's mask (`doctor_dooms_mask.glb`) tracking the cursor
  through a lerped rotation, floating on `@react-three/drei`'s `Float`.
- **HUD chrome** — a custom scrollbar, scroll-progress rail, cursor, mouse
  spotlight and drifting embers, all built rather than borrowed.
- **Type effects** — `ScrambleText` for the countdown digits so each tick
  resolves out of noise instead of just changing.
- **Countdown** — live to `2026-12-18T00:00:00`, zero-padded and tabular so the
  digits do not jitter as they change.

## Design system

Two accents on one page, swapped by CSS custom property rather than by class:

| Token | Value | Used for |
| --- | --- | --- |
| `--accent` | `#10b981` | Doom / Latverian green |
| `--iron-red` | `#ef4444` | Stark red |
| `--iron-gold` | `#facc15` | Cursor glow in Iron mode |
| `--background` | `#08090a` | Near-black ground |

The cursor colours are declared with `@property` and a `<color>` syntax, which
makes them interpolatable — the cursor *transitions* between the two palettes
across the handover instead of snapping. The Hero and `CinematicReveal` are
wrapped in a scope that rebinds `--accent` to the iron palette, so the same
components render in either identity without a prop.

Type is Bebas Neue for display, Inter for body, Orbitron for the HUD readouts.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS v4 ·
Framer Motion 12 · React Three Fiber 9 + drei 10 · three.js · Lenis ·
TypeScript

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build   # production build
npm run lint    # eslint
```

## Known trade-offs

Worth stating plainly, since this is a portfolio piece rather than a product:

- **Both frame sequences preload in full.** That is roughly 25 MB of JPEG before
  the hero is interactive. It buys a scrub that never stutters and never shows a
  gap, which is the entire point of the piece — but it is the wrong default for
  anything with real users, and a progressive or keyframe-first load would be
  the first thing to change.
- **No `prefers-reduced-motion` path.** The site is almost entirely motion, so
  this is the most meaningful accessibility gap in it.
- **Two further frame sequences are still in the history.** `public/frames3`
  and `public/frames4`, from earlier cuts of the edit, were deleted once it was
  clear nothing imported them. That takes 80MB out of a fresh checkout but not
  out of the repository — the blobs stay reachable through earlier commits, and
  only a history rewrite would remove them.

## Rights

Iron Man, Doctor Doom, Avengers and all related characters, names and imagery
are trademarks of Marvel Characters, Inc. / The Walt Disney Company. This is
unofficial, non-commercial fan work made as a design and front-end exercise, and
is not affiliated with, endorsed by, or sponsored by Marvel or Disney. The
source code is mine; the referenced characters and any film-derived frames are
not.
