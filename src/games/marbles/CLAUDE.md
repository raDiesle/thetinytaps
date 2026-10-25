# Kettenreaktion

Route `/kettenreaktion/`. The marble run that used to be a level here is the game „Kugelbahn“ now
(`src/games/marblerun/`, at `/kugelbahn/`, the old address of this game).

Eight levels in turn (or one of them); after each one „Nochmal“ or „Weiter“ (any key goes on). Shared with the Kugelbahn: the
points-along-a-way helpers in `path.ts`, the marble and rail drawings in `parts.tsx`, `useFrames`/`useAnyKey` in `level.ts`. "Alles fällt um" (`ToppleLevel.tsx`): everyday things (`things.tsx`) stand small to tall and topple onto each other like dominoes until the drum; each round picks other things. "Große Maschine" (`MachineLevel.tsx`, layout and timing in `machine.ts`): a Rube Goldberg machine through a 6900 px long playroom – one tap, and for about 30 seconds one thing sets off the next (marble, xylophone, bell, funnel, ten dominoes, a toy car through a loop onto a seesaw catapult, a beach ball down block stairs into a bucket, which pulls up a gate for the train, which presses the button for the jack-in-the-box); the camera follows whatever moves. Everything is a function of the seconds since the tap; in development `__machine.seek(seconds)` in the console jumps to a moment. Six more Rube Goldberg machines run the same way, each with its own world and no element repeated from another: „Verrückte Küche" (`kitchen.ts`, `KitchenLevel.tsx`), „Im Garten" (`garden.ts`), „Baustelle" (`building.ts`), „Zirkus" (`circus.ts`), „Raketenstart" (`space.ts`), „Licht-Kette" (`light.ts`, R-10: light instead of noise – a torch, a mirror, a disco ball, fireflies, fairy lights and a star lamp in a dark room; the night is a dark veil over the room (`Night`) with soft holes in its mask wherever something shines). They share the helpers in `machineKit.ts` (paths, rolling, hops, timeline, camera), the stage in `MachineStage.tsx` (clock, sounds, camera, tap) and wall pictures in `scenery.tsx`; in development `?level=garden` in the address opens one level directly.

## Working on machines

- Everything in a machine level is a pure function of the seconds since the tap, so any moment can be
  looked at with `__machine.seek(seconds)` in the console; `?level=<id>` opens one level directly.
- Each machine has its own world: never reuse an element of another machine.
