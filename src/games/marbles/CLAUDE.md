# Kettenreaktion

Route `/kettenreaktion/` (`/kugelbahn/`, its old address and then the marble run's, leads here). The „Klingende Kugelbahn“
was a game of its own for a while and is the first level here again, so marble run and machines are one game on the home menu.

Nine levels in turn (or one of them); after each one „Nochmal“ or „Weiter“ (any key goes on). Shared by the marble run and the
machines: the points-along-a-way helpers in `path.ts`, the marble and rail drawings in `parts.tsx`, `useFrames`/`useAnyKey` in `level.ts`. "Alles fällt um" (`ToppleLevel.tsx`): everyday things (`things.tsx`) stand small to tall and topple onto each other like dominoes until the drum; each round picks other things. "Große Maschine" (`MachineLevel.tsx`, layout and timing in `machine.ts`): a Rube Goldberg machine through a 6900 px long playroom – one tap, and for about 30 seconds one thing sets off the next (marble, xylophone, bell, funnel, ten dominoes, a toy car through a loop onto a seesaw catapult, a beach ball down block stairs into a bucket, which pulls up a gate for the train, which presses the button for the jack-in-the-box); the camera follows whatever moves. Everything is a function of the seconds since the tap; in development `__machine.seek(seconds)` in the console jumps to a moment. Six more Rube Goldberg machines run the same way, each with its own world and no element repeated from another: „Verrückte Küche" (`kitchen.ts`, `KitchenLevel.tsx`), „Im Garten" (`garden.ts`), „Baustelle" (`building.ts`), „Zirkus" (`circus.ts`), „Raketenstart" (`space.ts`), „Licht-Kette" (`light.ts`, R-10: light instead of noise – a torch, a mirror, a disco ball, fireflies, fairy lights and a star lamp in a dark room; the night is a dark veil over the room (`Night`) with soft holes in its mask wherever something shines). They share the helpers in `machineKit.ts` (paths, rolling, hops, timeline, camera), the stage in `MachineStage.tsx` (clock, sounds, camera, tap) and wall pictures in `scenery.tsx`; in development `?level=garden` in the address opens one level directly.

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
1, 2 and 3 hang under the shelf and let out the thing in that place (`ShelfKeys`). Each rolls its own way on
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
- `track.css`: its styles (classes `run-`). The pick and rebuild settings are on Kettenreaktion's start screen, and
  `MarblePlay.tsx` draws this level by itself because it takes them; while it is on, the background music is off (the run
  plays its own notes and scales).
- Shared with the machines: `path.ts` (line, quad, arc), `parts.tsx` (Ball, Rail, BAR_COLORS) and `level.ts` (useFrames,
  useAnyKey, wobble).

To look at the whole wall at once, make the browser window tall and narrow (e.g. 640 × 900).
