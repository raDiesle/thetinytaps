# Kettenreaktion

Route `/kettenreaktion/` (`/kugelbahn/`, its old address and then the marble run's, leads here). The „Klingende Kugelbahn“
was a game of its own for a while and is the first level here again, so marble run and machines are one game on the home menu.

Twelve levels in turn, beginning with the one picked on the start screen; after each one „Menü“, „Nochmal“ or „Weiter“ (any key goes on; after the last level the first). Shared by the marble run and the
machines: the points-along-a-way helpers in `path.ts`, the marble and rail drawings in `parts.tsx`, `useFrames`/`useAnyKey` in `level.ts`. "Alles fällt um" (`ToppleLevel.tsx`): everyday things (`things.tsx`) stand small to tall and topple onto each other like dominoes until the drum; each round picks other things. "Große Maschine" (`MachineLevel.tsx`, layout and timing in `machine.ts`): a Rube Goldberg machine through a 6900 px long playroom – one tap, and for about 30 seconds one thing sets off the next (marble, xylophone, bell, funnel, ten dominoes, a toy car through a loop onto a seesaw catapult, a beach ball down block stairs into a bucket, which pulls up a gate for the train, which presses the button for the jack-in-the-box); the camera follows whatever moves. Everything is a function of the seconds since the tap; in development `__machine.seek(seconds)` in the console jumps to a moment. Six more Rube Goldberg machines run the same way, each with its own world and no element repeated from another: „Verrückte Küche" (`kitchen.ts`, `KitchenLevel.tsx`), „Im Garten" (`garden.ts`), „Baustelle" (`building.ts`), „Zirkus" (`circus.ts`), „Raketenstart" (`space.ts`), „Licht-Kette" (`light.ts`, R-10: light instead of noise – a torch, a mirror, a disco ball, fireflies, fairy lights and a star lamp in a dark room; the night is a dark veil over the room (`Night`) with soft holes in its mask wherever something shines). They share the helpers in `machineKit.ts` (paths, rolling, hops, timeline, camera), the stage in `MachineStage.tsx` (clock, sounds, camera, tap) and wall pictures in `scenery.tsx`; in development `?level=garden` in the address opens one level directly.

## Languages (German and Russian)

Kettenreaktion follows the app language (home page): start screen, settings, the level names and every spoken line.
- Level names and first lines live in `content.ts` (`LEVEL_TEXTS`), used by the mode cards, the „Weiter“ button and each
  picture's `aria-label` (`useLevelName`). The start screen's notes are inline `t({ de, ru })` in `MarbleGame.tsx`.
- `say` (in `LevelProps`) and a machine event's `say` take a `Localized` line, `{ de, ru }`, written next to its moment;
  `MarblePlay` picks the app language and speaks it with that language's voice. Never pass a bare German string.
- Text drawn in a picture (the „START!“/„ПУСК!“ on the rocket's board) uses `useT()`; in files where `t` is the time,
  name the helper differently (`tr`, or call `useT()(…)` directly).
- New lines come in German only (`{ de: "…" }`); the Russian is added only when the user asks. When you change a German
  line that has a Russian one, update or drop the Russian with it, so they never say different things.
  `content.test.ts` checks every name, first line and machine line: German there, Russian (if any) in Cyrillic.
  A new machine goes into that test's list.

## Levels to join in

Three levels aren't one-tap machines but let the child set off each step. Like every level here, their first-tap hints
stand still, so nothing moves before the child acts.

„Nagelbrett“ (`PegsLevel.tsx`, numbers and physics in `pegs.ts`, K-13): an upright wooden board with seven staggered rows of nails over five bins, each with an animal waiting in it (five of frog, cow, dog, duck, cat and pig, shuffled each round). Wherever the child taps, only the x counts: a marble pops in at the top above it and falls, bouncing from nail to nail (circle against nail with a bounce and a small random push, so none balances on a nail; side walls and dividers). Each nail it hits glows and plinks a pentatonic note, higher rows higher (`playPlink`). A tap on a bin drops a marble above that bin; a key drops at its place along its keyboard row (`keySpot`, by `KeyboardEvent.code`), other keys at a random place. At most 12 marbles fall at once. In the bin the animal hops and calls, and the marble rolls to its place in a small pile (5 + 4; one more pops in sparkles). After ten marbles the level ends. Everything moves in the frame loop with no CSS animations, so the board is still before the first tap (a still marble and 👆 at the top) and again once all marbles lie. `pegs.test.ts` drops hundreds of marbles to check none gets stuck and all bins can be reached: run it after moving nails or bins.

„Hatschi-Kette“ (`SneezeLevel.tsx`, layout and timing in `sneeze.ts`, R-09): eight animals sit on a meadow facing us, small to big – always the mouse first and the cow and the elephant last, five of chick, duck, rabbit, cat, dog, pig and sheep in between (`pickAnimals`) – with a big tree at the end. A tap lets a feather float down onto the mouse's nose: „ha… ha…“ (head back, eyes squeezing, nose twitching) and HATSCHI – a little cloud with whoosh lines and glittering droplets flies to the next animal's cheek. Its fur ruffles, it makes its own sound and sneezes in turn, a bit bigger and louder (`playHa(size)`/`playHatschi(size)` in `sfx/animals.ts`, size 0 for the mouse to 1 for the elephant). The camera walks along and steps back for the elephant, whose sneeze through its raised trunk blows every leaf off the tree. The leaves whirl down onto the grass, everyone laughs, and the level is done (about 25 s). Unlike the machines it counts its own state frame by frame, because joining in changes the timing: a tap on an animal going „ha…“ makes it sneeze at once, one that has sneezed sniffs or giggles, one still waiting says hello. Any other tap or key moves the chain on one step (at the end the elephant giggles). Every animal is drawn facing us in its own units (100 high, standing on y 0) and scaled to its `height`; the line width is set on its group so all animals get the same lines. `sneeze.test.ts` checks the row order, that animals don't overlap, and that a round takes 20–30 s.

„Wasserbahn“ (`water.ts`, `WaterLevel.tsx`, `water.css`; ideas X-09 and R-03): a yellow rubber duck rides a water run down a sunny hillside 6200 × 2000, four stone basins in steps from the upper left to a paddling pool at the lower right; the camera follows the duck both ways. Unlike the machines, the child sets off every step: the duck waits, all still, at each closed lock gate (a still yellow ring and 👇 mark the handwheel) until any tap or key; then the gate lifts with a creak, the water rushes, the duck rides down to the next basin and the gate shuts again, so everything is still within a couple of seconds. Each stretch has its own thing: a flume and waterfall turning a water wheel whose pegs ring a bell; a brook where a fish leaps over the duck and a frog jumps in from its lily pad; a twisty slide round a tower with a spin through the air; and a pipe the duck pops out of into the pool, where the fountain sprays, three ducklings quack in turn and the level ends (about 30 s if the child taps right away). While the duck moves, a tap on the water makes a ripple and any other tap or key makes it quack and hop (in the pipe, the bump swells). Each stretch is a pure function of the seconds since its gate opened (`Stretch`, `poseAt`, `gateAt`, `flowAt`); in development `__water.seek(stretch, seconds)` jumps there (−1 is waiting at that gate). `water.test.ts` checks that the stretches join up at the wait spots, the duck stays in the world, basins sit on their terraces, and the run lasts about half a minute and ends once.

## Working on machines

- Everything in a machine level is a pure function of the seconds since the tap, so any moment can be
  looked at with `__machine.seek(seconds)` in the console; `?level=<id>` opens one level directly.
- Each machine has its own world: never reuse an element of another machine.

## Klingende Kugelbahn

Level `track` (`TrackLevel.tsx`, `track.ts`). Ideas N-34, X-08, K-19 (more in the K area of the ideas page).

A wooden marble run down a wall 1600 × 2250 (`TRACK_W`/`TRACK_H`, two and a half screens). One tap or key opens the hopper,
and six marbles come out one after the other. Each rolls over a xylophone, through six spots (bell, funnel, paddle wheel,
trampoline, bell, funnel by default), rides the seesaw, goes through the tunnel, zigzags down past bumpers, loops the loop,
hops over three drums, knocks five chimes and plays a whole scale on the second xylophone before it drops into the basket.
A full basket raises the flag and ends the level („Nochmal“ / „Weiter“; any key goes on). A first marble takes about 21 s, the
whole round about 35 s. Tapping a spot swaps its part (bell, trampoline, funnel, paddle wheel); a setting turns this off.
On a computer a yellow space-bar button sits at the bottom in the middle, and Space rebuilds the run to the next
of all its builds, counting like a car's mileage: the first spot takes its next part, and each time it is back at the first
part the next spot moves on too (`rebuildNext`).

„Was rollt denn da?“ (K-07, a setting, on by default): instead of six marbles in a row, a shelf over the first row holds
three of five things (marble, tennis ball, iron ball, apple, soap bubble; `ROLLER` in `track.ts`); tapping one flies it into
the hopper and something else pops up in its place, a key or a tap on the wall takes them in turn. On a computer the keys
1, 2 and 3 hang under the shelf and let out the thing in that place (`ShelfKeys`). A sunny glow behind each place
marks the three things as what to tap, and before the first one a big still 👇 points at the middle thing (`ShelfHint`).
Once the camera has followed the things down, a round yellow ⬆ button in the bottom left corner (or the up arrow key)
takes it back up to the shelf, where it stays, with the 👇 again, until the next thing is let out; from then on it follows
only the things let out since, not the ones further down. Each rolls its own way on
the same route: the tennis ball hops along the rows, the iron ball is slow with deep notes and thumps, the apple bumps, the
soap bubble floats at an even speed and bursts above the basket instead of landing (so it doesn't fill it).

Joining in on the way: a tapped thing hops with a twirl and rolls on faster (K-03; without the shelf, after the hopper is
open, a key hops all rolling marbles, or plays the next bar when none rolls). The bars, seesaw, drums, chimes, looping and
basket react to a tap without a marble, as do bell, trampoline, funnel and wheel when the spots can't be swapped; a tap on
the tunnel lets an animal look out, and the bare wall sparkles where it is tapped (K-04). Taps on parts stop there, so the
wall doesn't also take the next thing or sparkle. In the middle of the tunnel (the `tunnel` event) every marble changes, in
turn from a random start: another colour, stripes, dots, a golden star, or an animal looks out (K-06; `Ball` in `parts.tsx`
takes a `look`); other things keep their look and an animal looks out for them.
- `track.ts`: all the numbers. The route comes in sections – a fixed stretch before every spot, one section per part and
  spot, and the stretch to the basket – so a marble takes whatever part is in a spot when it gets there. `TURNS` are the walls
  the marble bounces off to change direction. `track.test.ts` checks that sections join up, nothing leaves the wall and spot
  boards don't overlap: run it after moving anything.
- `TrackLevel.tsx`: the marbles (rolling downhill with gravity and friction, fixed speed on wheel, funnel, seesaw and loop),
  the drawing, and the camera. The camera follows the marbles down: on a tall screen it shows more of the wall (up to all of
  it), before the tap the hopper, after the last marble the basket.
- The camera may go `TOP_ROOM` above the wall's top, so the shelf and the hopper sit clear of the top edge and the ✕.
  Never put what the child taps right at the wall's top edge: on a phone on its side the picture is cut there.
- `track.css`: its styles (classes `run-`). The pick and rebuild settings are on Kettenreaktion's start screen, and
  `MarblePlay.tsx` draws this level by itself because it takes them; while it is on, the background music is off (the run
  plays its own notes and scales).
- Shared with the machines: `path.ts` (line, quad, arc), `parts.tsx` (Ball, Rail, BAR_COLORS) and `level.ts` (useFrames,
  useAnyKey, wobble).

To look at the whole wall at once, make the browser window tall and narrow (e.g. 640 × 900).
