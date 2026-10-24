---
name: neues-abenteuer
description: Make a new trail level ("Weg-Abenteuer") for the game „Kleine Abenteuer“ in The Tiny Taps – a scrolling world, a goal that goes away, a bag of three things, obstacles, stairs and a small party at the end. Use when the user asks for a new Abenteuer, a new level for Kleine Abenteuer, a trail level, or wants to build one of the G ideas (e.g. "mach G-03", "neues Abenteuer", "neues Level für Kleine Abenteuer").
---

# New trail level for „Kleine Abenteuer“

A trail level is a picture adventure of 3–5 minutes for 2–3-year-olds: something the
child loves goes away, the child follows it through a long world seen from the side
that scrolls along, picks things up into a bag and uses them at obstacles. „Der
Drachen“ (`src/games/elevator/trail/`) is the reference – read it before starting and
copy its patterns.

Read first, every time:

- `src/games/elevator/CLAUDE.md`, the sections **„Rules for every story“** and
  **„What the parent wants next“**. They are the parent's feedback; a level that
  breaks one of them is not done. New feedback on a level goes there as a general
  rule, in the same commit as the fix.
- The ideas in `src/content/ideas/g-little-adventures.ts` (area „G“). Pick the one
  the user named, or the next open one that fits a side-scrolling world.

## Files

```
src/games/elevator/trail/
  types.ts        // the level format: TrailLevel, Pickup, Obstacle, Climb, SceneryProps – read it
  levels.ts       // TRAIL_LEVELS: each level's data (stations, ground, start, away, finale)
  levels.test.ts  // checks every level in TRAIL_LEVELS (see "Checks")
  drachen.tsx     // the world drawing of „Der Drachen“: DrachenScenery, DrachenBackdrop, ground constants
  <level>.tsx     // the world drawing of the new level, same shape
  items.tsx       // ItemId, the bag's things (ITEMS) and the goals (GOALS), drawn standing on (0, 0)
  TrailPlay.tsx   // the script: walking, bag, choosing, nudges, the end – usually no change needed
  trail.css       // all classes and @keyframes, prefixed `tl-`
src/games/elevator/ElevatorGame.tsx  // modes on the start screen
src/games/elevator/cards.tsx         // the picture cards at the end; picks up TRAIL_LEVELS by itself
```

The child (`Kid` from `../kid`), the thought bubble and the action button (`../house`)
come from `elevator.css`, which the game always loads. Shared drawing helpers (`INK`,
`Cloud`, `Face` …) come from `@/games/scenes/shared`; sounds from `@/lib/sfx`.

## The level format, with „Der Drachen“

`levels.ts` holds one `TrailLevel` per level:

```ts
const drachen: TrailLevel = {
  id: "drachen",                  // also the mode id on the start screen and the card id
  title: "Der Drachen",           // parents' start screen only – the child never sees text
  goal: "kite",                   // a key of GOALS: the card and the thought bubble show it
  Scenery: DrachenScenery,        // the world near the path (scrolls with the child)
  Backdrop: DrachenBackdrop,      // far hills, clouds, sun (scroll at 0.3 of the speed, for depth)
  ground: [[-3000, GROUND_Y], [4420, GROUND_Y], ...STAIRS, [9000, TOP_Y]], // the line the child walks on
  start: 300,                     // where the child stands at the start
  away: { to: [5420, 150], ms: 3600, pose: "reach", sounds: [...], say: "Huch! Der Wind nimmt den Drachen mit. Hinterher!" },
  stations: [ /* in walking order, see below */ ],
  finale: { to: [5820, -200], ms: 2600, say: "Der Drachen fliegt! Hurra!" },
};
```

World points: x to the right, y down, the ground at y = 740 at the start. The screen is
1600 × 900 and keeps the child's feet at (760, 740), so about 760 points left and 840
right of the child are visible. `away.to` is where the goal ends up: next to the last
obstacle, which keeps it until it is solved.

Stations (`types.ts`), each with a unique `id`, the child's stop `x` on the ground, and
two spoken sentences `ask` (on arrival) and `done` – only with „Vorlesen“:

- **`pickup`** – a thing lying on the way: `item` (an `ItemId`), `at` (where it lies, it
  flies from there into the bag), `sound`. Drachen: ball in the grass, carrot from the
  vegetable patch, plank at the shed, lantern at the hut, apple from the tree.
- **`obstacle`** – something in the way: `need` (the thing that helps), `at` (where the
  thing flies to), `meet` (sounds on arrival), `sounds` + `ms` (while it is solved),
  `nope` (the funny sound for a wrong thing), `frees: true` only on the last one, which
  gives the goal back. Drachen: dog → ball, horse → carrot, stream → plank, dark
  tunnel → lantern, squirrel with the kite → apple.
- **`climb`** – stairs or a ladder: `steps` are ground points from the bottom up; the
  first tap climbs half, the second the rest. They must also be in `ground`
  (Drachen exports `STAIRS` from `drachen.tsx` and uses it in both).

The world drawing (`drachen.tsx`) exports the ground constants, `<Level>Scenery` and
`<Level>Backdrop`. `Scenery` gets `{ done, here, nope }` and draws every station from
them:

- a pickup is drawn only while `!done.includes(id)` (`<Shed plank={!done.includes("plank")} />`);
- an obstacle gets class `tl-meet` while `here === id` and not solved (it looks up
  once), is wrapped in `<Nope id nope>` (it shakes its head at a wrong thing), and
  changes when solved (`.tl-dog.done` trots off and wags, the plank lies over the
  stream, `tl-dark` gets `lit`);
- the goal itself is drawn by `TrailPlay`, not by the scenery.

Things live in `items.tsx`: a component drawn standing on (0, 0), centred, in `ITEMS`
with its size (`{ w, h, draw }`), and its id in `ItemId`. The same drawing is used in
the world, the bag slot and the flight. Goals are in `GOALS` the same way.

## Steps

1. **Pick the idea** from `g-little-adventures.ts` and say in two lines what goes
   away, where the child follows it, and how it comes back.
2. **Plan the stations** before drawing – a list with x positions:
   - 8–12 stations, about 3–5 minutes; something happens by itself between the taps
     (the walk, the obstacle's answer). Never more than two taps in a row.
   - The bag holds three things at most. When the child reaches an obstacle, the bag
     should hold at least one thing that is **not** needed there (a distractor), so
     there is a real choice. Pick up two or three things first, then alternate.
   - Each thing has one obvious use a 2-year-old knows (ball for the dog, carrot for
     the horse, plank over water, lantern in the dark). No combining, no tricks.
   - Exactly one climb in two taps (stairs, ladder, hill path), usually near the end.
   - Only things that can be seen: every thing lies visibly on the way; nothing
     hidden in boxes, nothing fetched from a second place.
   - The last station is an obstacle with `frees: true` that holds the goal.
   - Stops at least ~200 points apart, so every walk is a visible walk.
3. **Draw the scenery** in `src/games/elevator/trail/<level>.tsx`: export the ground
   constants, `<Level>Scenery` and `<Level>Backdrop`, built like `drachen.tsx`
   (ground strip first, then places from left to right, obstacles as their own
   components taking `SceneryProps`). New things go into `items.tsx` (`ItemId`,
   `ITEMS`), a new goal into `GOALS`. Animations and states go into `trail.css`,
   every class and `@keyframes` prefixed `tl-` and unique (`tl-<level>-…` when it is
   level-specific). Nothing moves before the child acts.
   - `TrailPlay.tsx` still draws the goal as `<Kite />` on a string. A level with
     another goal makes it generic first (draw `GOALS[level.goal]`, and let the level
     say whether it hangs on a string), and checks that „Der Drachen“ still plays.
4. **Add the data** to `levels.ts`: the `TrailLevel` with stations, sounds from
   `@/lib/sfx` (add a new sound to the fitting topic file there, built on `note()`),
   short German sentences in the present tense. Append it to `TRAIL_LEVELS`.
5. **Add a mode** in `ElevatorGame.tsx`: `{ id: "<level id>", emoji, title }` after the
   other trail levels. If the start-screen note mentions the levels or keys, keep it true.
6. **The cards pick it up**: `cards.tsx` builds the end cards from `TRAIL_LEVELS` and
   `GOALS[level.goal]` – nothing to add, but check the new card shows the goal.
7. **Mark the idea done**: `done: true` (or `partial: "…"`) in
   `g-little-adventures.ts`, and add the level to „Levels so far“ in
   `src/games/elevator/CLAUDE.md` with its stations in one line.

## Hard rules (from the parent – never break)

- **No text for the child.** Nothing written in the picture, on things, signs or
  buttons. `title` is for the parents' start screen only.
- **German speech only**, and only with „Vorlesen“ on: `ask`, `done`, `away.say`,
  `finale.say`. Short words, present tense.
- **Nothing is pointed at.** No arrows, frames or hands on things in the world; the
  bag's right thing glows, and the thought bubble shows the goal.
- **One fixed action button**, bottom right, the same in every level (drawn by
  `TrailPlay`). Don't add buttons, and no other way to leave than `GameShell`'s.
- **Things stand out from their background**: a colour that differs from the grass,
  wall or wood behind it, and a dark `INK` outline – no green thing on the meadow, no
  brown plank on the brown shed.
- Every wrong try is funny (a head shake and a silly sound), never an error.

## Checks before you finish

1. `yarn verify` – `levels.test.ts` runs for every level in `TRAIL_LEVELS`: unique
   station ids, ground and stations left to right, the bag never over three and
   always holding what the next obstacle needs, only the last station frees the
   goal, stair steps on the ground. Also the unique-`@keyframes` and ideas tests.
2. Play it through in the preview (`preview_start` with `dev`, `/kleine-abenteuer/`,
   pick the level): **Space** walks on at every station, **1–3** pick from the open
   bag. At every obstacle try a wrong thing first (shake, sound, it flies back, the
   right one glows), then the right one. Look at each station: is the thing visible
   and does it stand out, does the obstacle react, does the scenery change when
   solved, is nothing cut off at the screen edges? Climb takes two presses. At the
   end the goal comes back, confetti, and the cards (1–4) include the new level.
   `document.getAnimations()` is empty right after load; the console has no errors.
3. Play „Der Drachen“ once too if `TrailPlay.tsx`, `items.tsx` or `trail.css`
   shared parts changed.
4. Commit on the branch (`Kleine Abenteuer: <what>`), merge into local `main`, never push.
