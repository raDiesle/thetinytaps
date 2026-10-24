# Kleine Abenteuer

Route `/kleine-abenteuer/` (the old `/aufzug/` redirects there) · ideas N-37 and area G („Kleine Abenteuer“), in „Lebendige Stories“. Was called „Spaß im Aufzug“; the folder, the code names (`Elevator…`) and the settings key `tinytaps.elevator.v2` keep the old name so saved settings and other branches still fit.

Picture adventures of a few minutes for 2–3-year-olds. Two kinds of levels, all picked on the start screen and again on picture cards at the end (`cards.tsx`):

## Lift stories (`content.ts`, `ElevatorPlay.tsx`)

A house in cross-section with four floors and a lift. A thought bubble above the child shows what it needs next (the same drawing as the thing in the room), and the child rides the lift to that floor – big buttons 1–4 beside the house, a tap on the room, or the number keys and arrows. A wrong floor: the child looks out, shakes its head and the right room starts to glow; after a while without a tap the bubble pops up again and the room glows too. Three stories: „Pfannkuchen“ (hungry: fridge in the cellar, pancakes in the kitchen, fetch the little brother, his juice, eat together on the roof terrace), „Gute Nacht“ (bath, warm milk, brushing teeth, teddy, bed – the house goes dark) and „Pfützen“ (rain: boots, raincoat, umbrella, paper boat, jump in the garden puddles until the rainbow comes). The children with their poses and clothes and the thought bubble are in `kid.tsx`, the things in `things.tsx`, the ten rooms in `rooms.tsx`, house, lift and buttons in `house.tsx`, sizes in `layout.ts`; the story runs as a script of waits in `ElevatorPlay.tsx`.

## Trail adventures („Weg-Abenteuer“, `trail/`)

A long world seen from the side that scrolls along with the child (far hills slower, for depth). Something the child loves goes away at the start (the kite flies off), and the child follows it. A hand shows where to tap; any tap or key walks on. Things lying on the way go into the bag in the bottom corner (three slots); at an obstacle the bag opens and the child taps the thing that helps (or 1–3) – it flies there and is used by itself. A wrong thing is tried: the obstacle shakes its head with a funny sound, the thing flies back and the right one glows (it also glows after a while without a tap). Stairs take one step per tap. At the end the goal is back in the hands, confetti, cards.

- `types.ts` – the level format: `TrailLevel` with its ground line, stations (`pickup`, `obstacle`, `climb`) and finale.
- `levels.ts` – the levels' data (`TRAIL_LEVELS`); `levels.test.ts` checks it (bag never over three, every need is in the bag, stations left to right, steps on the ground, the last station frees the goal).
- `<level>.tsx` – one world drawing per level (`drachen.tsx`): a `Scenery` that draws the stations from `done`/`here`/`nope`, and a `Backdrop`.
- `items.tsx` – the bag's things and the goals, drawn standing on (0, 0); `TrailPlay.tsx` – the script; `trail.css` – classes `tl-`.
- The child (`Kid` from `kid.tsx`) and its pose classes come from `elevator.css`, which the game always loads.

Levels so far: „Der Drachen“ (garden: ball, carrot, plank → dog wants the ball → lantern at the hut → horse wants the carrot → apple from the tree → plank over the stream → lantern in the dark tunnel → stairs up the hill → the squirrel trades the kite for the apple).

## What the parent wants next (read before making a level)

New levels of this game should be **trail adventures**, not more lift stories (keep the lift stories as they are):

- Point-and-click like Monkey Island, but for a 2-year-old: one tap does one thing, no inventory juggling.
- Anywhere, not only a house: stairs, nature, street, beach, snow, forest, water … A world that scrolls sideways (or up, for stairs and towers) is the default.
- The Disney-style bag: up to three things; at an obstacle the child is asked what to use (bag opens, voice asks if „Vorlesen“ is on), taps one, and the child uses it automatically. Mix in a thing that is not needed yet, so there is a real choice; every wrong try is funny, never an error.
- **No text anywhere the child looks: the child can't read.** Pictures, movement, sounds and the (optional) voice only. Titles exist only for the parents' start screen and screen readers.
- Shape of a level: a goal goes away at the start → 8–12 stations (pickups, obstacles, one climb) → the goal comes back → a small party. About 3–5 minutes.
- Ideas for further levels and mechanics are in `src/content/ideas.ts`, area „G“ (G-02 onward). Mark them done there when built.
