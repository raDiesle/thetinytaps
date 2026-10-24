# Kugelbahn

Route `/kugelbahn/`, its own category „Kugelbahn“ on the home menu. Ideas N-34, X-08, K-19 (more in the K area of the ideas page).

A wooden marble run down a wall 1600 × 2250 (`TRACK_W`/`TRACK_H`, two and a half screens). One tap or key opens the hopper,
and six marbles come out one after the other. Each rolls over a xylophone, through six spots (bell, funnel, paddle wheel,
trampoline, bell, funnel by default), rides the seesaw, goes through the tunnel, zigzags down past bumpers, loops the loop,
hops over three drums, knocks five chimes and plays a whole scale on the second xylophone before it drops into the basket.
A full basket raises the flag and ends the round („Nochmal“; any key starts again). A first marble takes about 21 s, the
whole round about 35 s. Tapping a spot swaps its part (bell, trampoline, funnel, paddle wheel); a setting turns this off.

- `track.ts`: all the numbers. The route comes in sections – a fixed stretch before every spot, one section per part and
  spot, and the stretch to the basket – so a marble takes whatever part is in a spot when it gets there. `TURNS` are the walls
  the marble bounces off to change direction. `track.test.ts` checks that sections join up, nothing leaves the wall and spot
  boards don't overlap: run it after moving anything.
- `TrackLevel.tsx`: the marbles (rolling downhill with gravity and friction, fixed speed on wheel, funnel, seesaw and loop),
  the drawing, and the camera. The camera follows the marbles down: on a tall screen it shows more of the wall (up to all of
  it), before the tap the hopper, after the last marble the basket.
- `MarbleRunPlay.tsx`: the round, party and „Nochmal“; `MarbleRunGame.tsx`: start screen and the rebuild setting.
- Shared with Kettenreaktion (`src/games/marbles/`): `path.ts` (line, quad, arc), `parts.tsx` (Ball, Rail, BAR_COLORS) and
  `level.ts` (useFrames, useAnyKey, wobble).

To look at the whole wall at once, make the browser window tall and narrow (e.g. 640 × 900).
