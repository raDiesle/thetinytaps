# Kugelbahn

Route `/kugelbahn/`, its own category „Kugelbahn“ on the home menu. Ideas N-34, X-08, K-19 (more in the K area of the ideas page).

A wooden marble run down a wall 1600 × 2250 (`TRACK_W`/`TRACK_H`, two and a half screens). One tap or key opens the hopper,
and six marbles come out one after the other. Each rolls over a xylophone, through six spots (bell, funnel, paddle wheel,
trampoline, bell, funnel by default), rides the seesaw, goes through the tunnel, zigzags down past bumpers, loops the loop,
hops over three drums, knocks five chimes and plays a whole scale on the second xylophone before it drops into the basket.
A full basket raises the flag and ends the round („Nochmal“; any key starts again). A first marble takes about 21 s, the
whole round about 35 s. Tapping a spot swaps its part (bell, trampoline, funnel, paddle wheel); a setting turns this off.

„Was rollt denn da?“ (K-07, a setting, on by default): instead of six marbles in a row, a shelf over the first row holds
three of five things (marble, tennis ball, iron ball, apple, soap bubble; `ROLLER` in `track.ts`); tapping one flies it into
the hopper and something else pops up in its place, a key or a tap on the wall takes them in turn. Each rolls its own way on
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
- `MarbleRunPlay.tsx`: the round, party and „Nochmal“; `MarbleRunGame.tsx`: start screen with the pick and rebuild settings.
- Shared with Kettenreaktion (`src/games/marbles/`): `path.ts` (line, quad, arc), `parts.tsx` (Ball, Rail, BAR_COLORS) and
  `level.ts` (useFrames, useAnyKey, wobble).

To look at the whole wall at once, make the browser window tall and narrow (e.g. 640 × 900).
