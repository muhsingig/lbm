# Second Nature — a walkthrough (v2)

**Second Nature**, Superblue at the Art House, Nita Mukesh Ambani Cultural Centre, Jio World Centre, BKC, Mumbai (3 July 2026 – 10 January 2027). An academic field study for Luxury Brand Management.

Two versions are kept side by side:

- `second-nature/` — one continuous scroll with a level rail.
- `second-nature-2/` — **this one.** A room you stand in. The page never scrolls.

---

## Run it

```bash
npm install
```

```bash
npm run dev
```

### For the viva

```bash
npm run build
```

```bash
npm run preview
```

`preview` is a zero-dependency Node server on <http://localhost:4173>. Build at home while you have wifi; `preview` needs nothing but Node.

> Don't double-click `out/index.html` — the export references assets from the site root, so the CSS and fonts won't load over `file://`.
>
> Don't run `npm run build` while `npm run dev` is running. It swaps `.next` out from under the dev server and it starts throwing 500s. If that happens: `rm -rf .next && npm run dev`.

---

## The model

**The page never scrolls.** `body { overflow: hidden }`, one fixed stage, one screen per room. Everything that would be a scroll section in an ordinary site arrives instead as an overlay *over* the room — which is what a gallery actually is: you stand in the space, you approach a work, you step back.

```
.stage                fixed, 100vw × 100svh, never scrolled
 ├── wall / floor / horizon / light / vignette / grain
 ├── chrome           floor mark, Floors (M), status line
 ├── main             the room's title, the hang, the way on
 └── overlay          a work, approached — the only thing that scrolls
```

The room is built from **light, not drawing**: a wall washed from above, a floor holding a little of the same light, one hairline where they meet, and a vignette so the edges fall away. That is what makes a gallery feel considered — the lighting plan, not an outline of the walls.

### Moving

| | |
|---|---|
| Click a work | it comes forward in an overlay, with its label and description |
| Click the lit slot at the end of the hang | the next floor, through the threshold |
| `←` `→` / Page Up / Page Down | floor to floor, also through the threshold |
| `M` | the floor map, a section through the building, reading bottom-up |
| `Esc` | step back from a work, or close the map |

### The corridor — the walk

`/` is not a landing page. It is a corridor, and **scrolling walks you down it**: the wheel drives a camera forward along a real perspective corridor and the door to each floor comes up on an alternating wall as you pass it, under its own lit sign. Click a door and you go through it.

Built from four CSS 3D planes — floor, ceiling, two walls — and a camera on the Z axis. Only `transform` is animated, and the walk is eased so it carries weight instead of snapping. Wheel, touch drag, `↑`/`↓`, Page Up/Down, `Home` and `End` all drive it. Under `prefers-reduced-motion` the corridor is replaced by a plain list of the same doors.

The planes start *behind* the camera so the walls always reach past the edges of the screen, and the corridor is sized from the viewport on load and resize — otherwise its mouth shows as a rectangle floating in the dark.

Geometry lives at the top of [`components/Corridor.tsx`](components/Corridor.tsx): `GAP` (distance between doors), `LEAD` (how far you walk before the first one), `NEAR` (how much corridor sits behind you).

### The threshold — going through a door

Every move between rooms passes through a door. Two leaves close over the room you are leaving, a hairline of light shows in the seam — **and that light is the next floor's accent colour, so you glimpse the room before you are in it** — then they part and you are standing somewhere else.

Measured on the production build:

```
   0 ms   click
  76 ms   leaves shut, seam lit
 654 ms   the room actually changes — behind the closed doors
1064 ms   leaves begin to part
1556 ms   fully open
1621 ms   idle
```

About a second and a half door to door, which is roughly how long a real threshold takes and is what stops the site feeling like tabs. Because the route swaps while the leaves are shut, you never see a flash of the old room or an empty frame.

Behind the doors the arriving room also *settles*: it comes in from 3.5% too close, its pool of light comes up a beat behind it, and the works appear one at a time left to right — the way your eye actually crosses a room, rather than everything landing at once.

The leaves wait for the next room to render, so a slow connection holds the door rather than showing a half-built room. A failsafe opens them regardless after 2.6s so nobody is ever left staring at a shut door. Under `prefers-reduced-motion` the whole thing is skipped and navigation is instant.

Every room has its doorway in the same place, including the hallway, the findings and the exit, so the walk keeps one rhythm all the way through.

### The rooms

`/` entrance · `/hallway` · `/level-0` Random International · `/level-1` teamLab · `/level-2` Heijdens + Murakami · `/level-3` Es Devlin · `/findings` the brief's three answers · `/exit`

---

## Level 3 — the inversion is something you do

You arrive on Level 3 **still in the dark**, because the sketchbook wall is a lit object in a black room and that is exactly what our photograph shows.

Take the page off the wall — the plate marked **Take one** — and the whole building turns to paper. Warm grey, ink blue, the vignette lifts. The white you end on is the page in your hand. It is an action rather than a scroll position, which is the point: the exhibition ends by *giving you something*, so the site should too.

---

## What is real, and what is lit

Your ten photographs are the only imagery. Nothing here is illustrated, generated or stock.

They hang on the wall of the room, numbered, at a distance — you approach one to see it properly. Works that exist but that we did not photograph (*Presence and Erasure*, *Flowers and People*, *Nirvana*) hang as **empty frames marked "not photographed"**. The gap is stated, not filled.

Two floors are represented by clips rather than stills: *Lightweeds* runs on live weather data and *Resonating Microcosms* is a chain reaction, so a frozen frame of either misrepresents the work. Clips play only inside the overlay, muted and looping, and never under `prefers-reduced-motion`.

### The source clips are mislabelled

Verified by extracting frames — worth fixing in your deck and report too:

| File in `imgs/` | What it actually shows |
|---|---|
| `hallway 4.mp4` | **Lightweeds** (Level 2), not the hallway |
| `hallway 5.mp4` | **the Swadesh handloom** (hallway) |
| `level 1.mp4` | Resonating Microcosms (Level 1) |
| `level 2.mp4` | **New Spring** (Level 2) |
| `level 2'.mp4` | byte-identical duplicate of `hallway 4.mp4` — unused |

---

## Type — two families

| | |
|---|---|
| **Cormorant Garamond** — 300, and italic | the voice. Set large, with air around it. |
| **Inter Tight** — 400/500 | everything else, including the wall labels: uppercase, tracked +0.22em, the way a printed gallery label is. |

Two families and no third. The restraint is the point — a cultural institution does not use four typefaces, and it does not use a handwriting face.

## The rooms' colour

Tokens on `:root`, redeclared per room under `html[data-room="…"]`, registered with `@property` as `<color>` so they interpolate over 900ms while you move between floors.

| Room | Ground | Accent | Light |
|---|---|---|---|
| Entrance / Hallway / Exit | `#0B0B0D` | brass `#C9A227` | warm |
| Level 0 | `#050607` | steel `#7FA6C0` | cold, and it follows your cursor |
| Level 1 | `#05081C` | magenta `#FF4E97` | cyan `#2ED9E6`, with drifting light |
| Level 2 | `#0F1215` | sage `#A9CEAE` | pale blue |
| Level 3 / Findings | `#EFE9DA` | ink blue `#2C4A7C` | paper |

---

## Where to edit

**All copy is in [`content/exhibition.ts`](content/exhibition.ts).** [`content/rooms.ts`](content/rooms.ts) holds only the route order and the sign over each door.

### Still to fill in

Three `TODO:`s at the top of `exhibition.ts`, shown on the Exit page:

1. `authors.names` — the five group members
2. `authors.course` — your college's name
3. `authors.visitDate`

And one marked gap, shown inside the **Take one** overlay on Level 3:

4. A photograph or scan of the page you took home, at `public/media/level-3/02-take-home-page.jpg`.

---

## Files

```
app/
  layout.tsx                fonts, metadata
  globals.css               tokens, the six room skins, the stage
  page.tsx                  entrance
  hallway|level-0|level-1|level-2|level-3|findings|exit/
components/
  Stage.tsx                 the fixed room: wall, floor, light, chrome
  Room.tsx                  the template every floor shares, and the hang
  Threshold.tsx             the door between rooms, and DoorLink
  Doorway.tsx               the lit slot you click to go on
  Overlay.tsx               approaching a work — focus-trapped dialog
  Chrome.tsx                floor mark, Floors (M), status line, floor map
  Media.tsx                 photographs and clips, lazy and visibility-aware
  WallLabel.tsx             the printed museum label
  Particles.tsx             Level 1 only
content/
  exhibition.ts             ← all copy
  rooms.ts                  the route through the building
```

No GSAP, no Lenis, no scroll library — a site that does not scroll does not need one. Dependencies are `next`, `react`, `react-dom`.

## Accessibility

- Every room is a page with one `<h1>` and a `<main>`. Overlays and the floor map are focus-trapped `role="dialog"`, close on `Esc`, and return focus to the plate you came from.
- Every photograph has real alt text in the content file; the small hung thumbnails are `alt=""` because the plate's own button label carries the name.
- Rooms whose text is taller than a short viewport scroll **inside the stage**, so nothing is ever cut off even though the page itself is fixed.
- `prefers-reduced-motion` removes the drifting light, the cursor tracking and all entrance animation; the preloader is skipped entirely.

## Floor numbering

NMACC's own signage: Hallway, then Levels 0–3. Press coverage counts the same floors as first to fourth.
