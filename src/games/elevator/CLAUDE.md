# Kleine Abenteuer

Route `/kleine-abenteuer/` (the old `/aufzug/` redirects there) · ideas N-37 and area G („Kleine Abenteuer“), in „Lebendige Welten“. Was called „Spaß im Aufzug“; the folder, the code names (`Elevator…`) and the settings key `tinytaps.elevator.v2` keep the old name so saved settings and other branches still fit.

Picture adventures of a few minutes for 2–3-year-olds. Two kinds of levels, picked on the start screen; at the end „Nochmal“ plays the same one again and „Weiter“ (with the next one's picture, any key too) goes on to the next in `CARDS` order, after the last back to the first (`cards.tsx`, the shared `GameEnd`):

## Lift stories (`content.ts`, `ElevatorPlay.tsx`)

Picture stories of about two minutes in a house in cross-section with four floors and a lift. A thought bubble above the child shows what it needs next (the same drawing as the thing in the room), and the child rides the lift to that floor – big buttons 1–4 right of the house, a tap on the room, or the number keys and arrows. A wrong floor: the child looks out and shakes its head (pose `shake`: the face slides from side to side so the head seems to turn, with swish lines, frowning brows and pressed lips), a light runs along the outline of the bubble and the right room starts to glow; after a while without a tap the same happens again. In the room the moves happen by themselves. There is no action button: only a move that matters for the story and can clearly be seen is wished for in the bubble, just like a floor, and the number of the floor the child is on lights up to be pressed again (or a tap on the room or the child) – cracking the two eggs, the mixer, each pancake, flushing the toilet, tidying the blocks, putting the boat into the puddle. Another number then: the child shakes its head („Erst hier!“). Three stories (`content.ts`): „Pfannkuchen“ (hungry: chef's hat, eggs from the fridge in the cellar, batter and pancakes in the kitchen, fetch the little brother, his juice, eat together on the roof terrace), „Gute Nacht“ (bath, pyjama, warm milk, brushing teeth, teddy, bed – the house goes dark) and „Pfützen“ (rain: boots, raincoat, umbrella, rain hat, paper boat, jump in the garden puddles until the rainbow comes). The children with their poses and clothes and the thought bubble are in `kid.tsx`, the things in `things.tsx`, the ten rooms in `rooms.tsx`, house, lift and floor buttons in `house.tsx`, sizes in `layout.ts`; the story runs as a script of waits in `ElevatorPlay.tsx`. All drawn in SVG, no emojis, nothing to read.

## Trail adventures („Weg-Abenteuer“, `trail/`)

A long world seen from the side that scrolls along with the child (far hills slower, for depth). Something the child loves goes away at the start (the kite flies off), and the child follows it. The action button in the bottom-right corner lights up when the child can walk on; a tap on it, anywhere, or any key walks to the next station (after a while it jumps and a light runs along the thought bubble with the goal). Things lying on the way go into the bag in the bottom-left corner (three slots); at an obstacle the bag opens and the child taps the thing that helps (or 1–3) – it flies there and is used by itself. A wrong thing is tried: the obstacle wobbles and tosses its head three times with a funny sound, the thing flies back and the right one glows (it also glows after a while without a tap). Stairs take two taps, half of the steps each. At the end the goal is back in the hands, confetti, then „Nochmal“ and „Weiter“. On a computer (not on touch-only devices) key caps show the keys: a space bar above the action button and 1, 2, 3 above the bag's slots; a cap turns yellow while its key does something and goes down while the key is held. Any key still walks on – the space bar is only the one shown.
- `types.ts` – the level format: `TrailLevel` with its ground line, stations (`pickup`, `obstacle`, `climb`) and finale.
- `levels.ts` – the levels' data (`TRAIL_LEVELS`); `levels.test.ts` checks it (bag never over three, every need is in the bag, stations left to right, steps on the ground, the last station frees the goal).
- `<level>.tsx` – one world drawing per level (`drachen.tsx`): a `Scenery` that draws the stations from `done`/`here`/`nope`, and a `Backdrop`.
- `items.tsx` – the bag's things and the goals, drawn standing on (0, 0); `TrailPlay.tsx` – the script; `trail.css` – classes `tl-`.
- The child (`Kid` from `kid.tsx`), the thought bubble and the action button (`house.tsx`) and their classes come from `elevator.css`, which the game always loads.

Levels so far: „Der Drachen“ (garden: ball, carrot, plank → dog wants the ball → lantern at the hut → horse wants the carrot → apple from the tree → plank over the stream → lantern in the dark tunnel → stairs up the hill → the squirrel trades the kite for the apple).

## Rules for every story (from feedback; follow them in new stories and trail levels too)

- **The first thing in a room happens by itself.** Getting out of the lift, the child does the first move on its own (puts the hat on, opens the fridge, sits down) – the ride was the child's tap. A step whose whole point is one move needs no tap at all.
- **Only ask for moves that matter.** A move in the room is wished for (a task with `wish`) only when it really belongs to what the child is doing and can clearly be seen: cracking eggs, pouring a pancake, flushing, tidying. Waving, chewing, blowing, putting on, looking in the mirror are only shown – they do themselves. No wish while the child is hidden in the tub or the bed (`content.test.ts`).
- **A move in the room is asked like a floor.** The bubble shows the thing, and the number of the floor the child is on lights up to be pressed again – no extra action button in the lift stories (the trails keep theirs, bottom-right).
- **At most two presses in a row**, and several only where the child can count what each one does: two eggs, one press per pancake. Between runs something happens by itself (a task without `wish`, a `wait`, or a walk to a new `spot`). `content.test.ts` checks this.
- Nothing is framed or pointed at in the picture; only the floor buttons light up.
- **Only wish for what can be seen.** The thing in the bubble stands visibly in its room – nothing in a cupboard, nothing to find in a second place, no trip to fetch something forgotten.
- **Things stand out from their room.** A thing to use has a colour (and a dark outline) that differs from the wall, worktop or furniture behind it – no blue bowl in front of blue cupboards, no white bag on white tiles.
- **Show what happens.** What goes into a bowl, a pot or a puddle stays visible (glass bowl, layers, the mixer in the batter), not hidden behind the thing.
- **The thought bubble pops up once per wish.** Reminders don't pop it again; a light runs along its outline instead.

## What the parent wants next (read before making a level)

New levels of this game should be **trail adventures**, not more lift stories (keep the lift stories as they are):
- Point-and-click like Monkey Island, but for a 2-year-old: one tap does one thing, no inventory juggling.
- Anywhere, not only a house: stairs, nature, street, beach, snow, forest, water … A world that scrolls sideways (or up, for stairs and towers) is the default.
- The Disney-style bag: up to three things; at an obstacle the child is asked what to use (bag opens, voice asks if „Vorlesen“ is on), taps one, and the child uses it automatically. Mix in a thing that is not needed yet, so there is a real choice; every wrong try is funny, never an error.
- **No text anywhere the child looks: the child can't read.** Pictures, movement, sounds and the (optional) voice only. Titles exist only for the parents' start screen and screen readers.
- Shape of a level: a goal goes away at the start → 8–12 stations (pickups, obstacles, one climb) → the goal comes back → a small party. About 3–5 minutes.
- Make a new level with the skill `/neues-abenteuer` (`.claude/skills/neues-abenteuer/SKILL.md`).
- Ideas for further levels and mechanics are in `src/content/ideas/g-little-adventures.ts`, area „G“ (G-02 onward). Mark them done there when built.
