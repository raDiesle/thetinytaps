# Kettenreaktion

Route `/kettenreaktion/` (`/kugelbahn/`, its old address and then the marble run's, leads here). The „Klingende Kugelbahn“
was a game of its own for a while and is the first level here again, so marble run and machines are one game on the home menu.

Twenty levels in turn, beginning with the one picked on the start screen; after each one „Menü“, „Nochmal“ or „Weiter“ (any key goes on; after the last level the first). Shared by the marble run and the
machines: the points-along-a-way helpers in `path.ts`, the marble and rail drawings in `parts.tsx`, `useFrames`/`useAnyKey` in `level.ts`.

"Alles fällt um" (`ToppleLevel.tsx`): everyday things (`things.tsx`) stand in seven runs, each small to tall, and topple onto each other like dominoes; each round picks other things, and the last one is always the broom, which falls onto the drum, bang, and sparkles burst out of it.

Eleven Rube Goldberg machines: one tap, and for about 40 seconds one thing sets off the next while the camera follows whatever moves. Each has its own world, and no element repeats from another. They share the helpers in `machineKit.ts` (paths, rolling, hops, timeline, camera), the stage in `MachineStage.tsx` (clock, sounds, camera, tap) and wall pictures in `scenery.tsx`; each has a `<name>.test.ts` that checks the order of its moments, that each thing really reaches the next, and its length.
- "Große Maschine" (`machine.ts`, `MachineLevel.tsx`, a 9600 px playroom, about 41 s): the marble plays the xylophone, rings the bell and spirals down the funnel into ten dominoes, which push a toy car through a loop onto a seesaw catapult that flings a beach ball down block stairs into a bucket, which pulls up the gate for the train. The braking train bumps a humming top, which spins and wanders into a tower of stacking cups; the tower tumbles, each cup plinks its own note, and the top cup flicks a paper plane into the air, which loops the loop and glides onto the button for the jack-in-the-box.
- „Verrückte Küche" (`kitchen.ts`, `KitchenLevel.tsx`, about 41 s): the marble falls from the spice jar along the wooden spoon and knocks the rolling pin down the cutting board into the ladle, which flings a meatball into the spaghetti. The plate rolls into the salad spinner's crank: the spinner whirls, its lid pops off, lettuce flies out, and the biggest leaf slaps the egg timer on the cookie jar. The timer ticks back, rings and rattles off onto the pancake pan's handle, so the pancake somersaults onto the cooktop's touch field; the popcorn pops into the mug on the toaster lever, and the toast flies onto the bunny's plate.
- „Im Garten" (`garden.ts`, `GardenLevel.tsx`, about 40 s): a marble rolls out of the birdhouse along the gutter under the wind chimes into the watering can, which tips onto a water wheel; the wheel pushes the wheelbarrow onto a rake, whose handle shakes the apple tree, and the apple rolls down the slide into a croquet ball. The ball bonks the molehill: the dizzy mole digs off under the lawn (a ridge of earth runs along), looks out once, and comes up under the sleeping hedgehog, who curls into a prickly ball and rolls through a pile of leaves; the leaves spin the pinwheel, whose string pulls open the garden tap, and the sprinkler waters the sunflower until it blooms.
- „Baustelle" (`building.ts`, `BuildingLevel.tsx`, about 42 s): the cement mixer tips the marble onto a spirit level, down the chute and up the conveyor belt to knock over a cone, which lets the wrecking ball smash the brick tower; the tower bumps a cable drum along the scaffold into a sand pile, and the drum bonks the excavator awake. The excavator digs, swings round, tips the sand in front of the road roller and pats its roof; the roller presses the heap into a road and bumps the jackhammer, which rattles and hops onto the winch's crank, and the tower crane lowers the roof onto the house.
- „Zirkus" (`circus.ts`, `CircusLevel.tsx`, about 40 s): the marble drops out of the magician's top hat, drums down three drums onto the cymbal and the trampoline, onto the seal's nose and down a chute over the elephant's head; the trunk flings it up to a monkey on a trapeze, who catches it with its feet, swings higher and drops it into the mane of a dozing lion. The lion wakes, roars, leaps onto the next pedestal and shakes the marble into the basket of a teddy on a unicycle, who rides the high wire through a ring of paper flames and pulls the cannon's ribbon: the clown doll flies into the net and the curtain opens.
- „Raketenstart" (`space.ts`, `SpaceLevel.tsx`, about 40 s): the marble drops out of the satellite dish, through the glowing rings and the zigzag pipe onto the robot's button; the robot pushes the moon buggy over the hills into the planet mobile, whose earth bonks the telescope. The telescope swings to the sky, and from where it points a UFO with a little alien floats in, beams up a moon rock, drops it onto the switch and zooms off. The magnet lets go, the iron ball drops into the countdown board, and after „3, 2, 1“ the rocket lifts off to the moon.
- „Licht-Kette" (`light.ts`, `LightLevel.tsx`, R-10, about 41 s): light instead of noise, in a dark children's room – the torch's beam bounces off a mirror onto the disco ball, a golden spot wakes the fireflies in their jar, they fly along the fairy lights down to a lava lamp and switch it on; its warm air turns a paper carousel whose rabbit and bird throw big shadows over the wall, until the paper bird flutters onto the button of a globe, which lights up and turns; its glow calls the fireflies to the star lamp, which throws stars all over the room and wakes the toy owl. The night is a dark veil over the room (`Night`) with soft holes in its mask wherever something shines; every new light needs its hole there.
- „Badezimmer" (`bath.ts`, `BathLevel.tsx`, R-05, about 38 s): the red button on the toothpaste tube is the one thing to tap; a blob tips the toothbrush into the tooth mug, the mug topples onto the squeaky duck (it wears a sailor's hat, so it isn't the Wasserbahn's), the duck bonks the bath tap's lever, and the tub – drawn cut open, so the child sees it fill – foams over. The wave carries the duck against the toilet roll, which rolls away unrolling a paper ribbon into the wind-up whale's key; the whale waddles to the hair dryer and spouts onto its switch, and the dryer blows the shower cap onto the ceiling lamp and soap bubbles out of the bubble wand, which pop one by one at the lamp.
- „Bauernhof" (`farm.ts`, `FarmLevel.tsx`, R-06, about 38 s): every link is an animal – the rooster crows, the pig jumps into the puddle, the mud wakes the cat, her ball of wool rolls onto the cow's nose, the moo wakes the goat, who butts the milk can (the first time it only wobbles) into the kennel; the dog chases the ducks onto the donkey's back, the donkey brays and kicks the barn, which throws the ducks onto the roof; the doors swing open and the animals sing one after the other, then all together. The animals call with their recordings from `src/lib/sounds/`, loaded when the level opens (`FARM_SOUNDS`), the synthesized call until then; goat and donkey have no recording yet (`playBaa`; `playNeigh` then `playMoo`).
- „Gute-Nacht-Maschine" (`night.ts`, `NightLevel.tsx`, R-07, about 45 s): the calm one – a children's room at dusk; the music box's crank nudges a golden star ball down a zigzag gutter into a basket, the basket sinks and its cord over two ceiling pulleys draws the curtain, and the curtain tips the rocking chair until its backrest taps the cuckoo clock's pendulum. The sleepy cuckoo calls a soft „kuckuck“ and yawns, and its beak pushes the arc lamp's pull chain: click, the light goes out, the moon rises in the round window, and teddy, moon, cuckoo, star and the carousel sheep fall asleep („z z z“) while the camera glides back to the music box. The room gets dark as a plain veil, and what is outside or glows is drawn over it. Slow pace and soft sounds only: no background song while it plays and its end plays `playLullaby` instead of the cheerful tune.
- „Aufräum-Maschine" (`tidy.ts`, `TidyLevel.tsx`, R-08, about 33 s): an untidy children's room – the rocking horse kicks the football, which rolls the blocks into the toy chest and itself after them, the lid slams and sets off the wind-up truck, which pushes the books to the shelf, where they hop in. Then the truck bounces on the bellows: each puff runs along the hose and blows a sock into the laundry basket, and the last throws the rolled-up sock ball onto the full basket. It bounces off and rolls along the floor: the crayons it reaches hop into the pencil pot, each with its own note, and the jigsaw pieces hop into the puzzle board until the picture is whole. Last it knocks the plug out of the air cushion – pfffft, the cushion jumps like a balloon let go and throws the cuddly bunny into bed (a bunny, not a teddy, because the circus has the teddy); the blanket spreads over it and everything glitters. Its lines are German only so far.

Everything in a machine is a function of the seconds since the tap; in development `__machine.seek(seconds)` in the console jumps to a moment, and `?level=garden` in the address makes the first card tapped start that level.

## Languages (German, English, Chinese, Hindi, Spanish, Arabic, Russian)

Kettenreaktion follows the app language (home page): start screen, the level names and every spoken line.
- Level names and first lines live in `content.ts` (`LEVEL_TEXTS`), used by the mode cards, the „Weiter“ button and each
  picture's `aria-label` (`useLevelName`). The start screen has only the level cards and the row above them: no „Über das Spiel“ and no „Einstellungen“ (removed October 2026 – the game
  explains itself by playing, and the shelf and the 🔧 spots are always on). Don't add either back.
- The row above the cards holds one choice for the whole game, „Schranke und Weiche“: „👆 Kind tippt“ (default) or
  „🔄 Von selbst“ (`MarbleSettings.play`, passed to every level as `LevelProps.watch`). With „Von selbst“ nothing waits
  for the child's tap. So far only the marble run uses it (barrier up, switch flips by itself); a level that gets
  something else that waits for a tap should follow it too. Its texts are German only so far (`languageStatus.ts`).
- `say` (in `LevelProps`) and a machine event's `say` take a `Localized` line, `{ de, en, zh, hi, es, ar, ru }`, written next to its moment;
  `MarblePlay` speaks it through `spokenIn`: the app language with its voice, or the German line with the German voice where a translation is missing. Never pass a bare German string.
- Text drawn in a picture (the „START!“/„ПУСК!“/„发射！“ on the rocket's board) uses `useT()`; in files where `t` is the time,
  name the helper differently (`tr`, or call `useT()(…)` directly).
- New lines come in German only (`{ de: "…" }`); translations are added only when the user asks. When you change a German
  line that has translations, update or drop them with it, so they never say different things.
  `content.test.ts` checks every name, first line and machine line: German there, Russian, Chinese, Hindi and Arabic (if
  any) in their own script with no Latin letters, and a line with Russian has all five other languages too.
- The game is „Chain Reaction“ / „连锁反应“ / „चेन रिएक्शन“ / „Reacción en cadena“ / „تفاعل متسلسل“. Arabic lines speak
  as "we" (هيّا ن…), Hindi gives commands or says "let's" (चलो), Spanish says tú: nothing changes for a boy or a girl.
  A new machine goes into that test's list.

## Levels to join in

Three levels aren't one-tap machines but let the child set off each step. Like every level here, their first-tap hints
stand still, so nothing moves before the child acts.

„Nagelbrett“ (`PegsLevel.tsx`, numbers and physics in `pegs.ts`, K-13): an upright wooden board with seven staggered rows of nails over five bins, each with an animal waiting in it (five of frog, cow, dog, duck, cat and pig, shuffled each round). Wherever the child taps, only the x counts: a marble pops in at the top above it and falls, bouncing from nail to nail (circle against nail with a bounce and a small random push, so none balances on a nail; side walls and dividers). Each nail it hits glows and plinks a pentatonic note, higher rows higher (`playPlink`). A tap on a bin drops a marble above that bin; a key drops at its place along its keyboard row (`keySpot`, by `KeyboardEvent.code`), other keys at a random place. At most 12 marbles fall at once. In the bin the animal hops and calls, and the marble rolls to its place in a small pile (5 + 4; one more pops in sparkles). After ten marbles the level ends. Everything moves in the frame loop with no CSS animations, so the board is still before the first tap (a still marble and 👆 at the top) and again once all marbles lie. `pegs.test.ts` drops hundreds of marbles to check none gets stuck and all bins can be reached: run it after moving nails or bins.

„Hatschi-Kette“ (`SneezeLevel.tsx`, layout and timing in `sneeze.ts`, R-09): eight animals sit on a meadow facing us, small to big – always the mouse first and the cow and the elephant last, five of chick, duck, rabbit, cat, dog, pig and sheep in between (`pickAnimals`) – with a big tree at the end. A tap lets a feather float down onto the mouse's nose: „ha… ha…“ (head back, eyes squeezing, nose twitching) and HATSCHI – a little cloud with whoosh lines and glittering droplets flies to the next animal's cheek. Its fur ruffles, it makes its own sound and sneezes in turn, a bit bigger and louder (`playHa(size)`/`playHatschi(size)` in `sfx/animals.ts`, size 0 for the mouse to 1 for the elephant). The camera walks along and steps back for the elephant, whose sneeze through its raised trunk blows every leaf off the tree. The leaves whirl down onto the grass, everyone laughs, and the level is done (about 25 s). Unlike the machines it counts its own state frame by frame, because joining in changes the timing: a tap on an animal going „ha…“ makes it sneeze at once, one that has sneezed sniffs or giggles, one still waiting says hello. Any other tap or key moves the chain on one step (at the end the elephant giggles). Every animal is drawn facing us in its own units (100 high, standing on y 0) and scaled to its `height`; the line width is set on its group so all animals get the same lines. `sneeze.test.ts` checks the row order, that animals don't overlap, and that a round takes 20–30 s.

„Wasserbahn“ (`water.ts`, `WaterLevel.tsx`, `water.css`; ideas X-09 and R-03): a yellow rubber duck rides a water run down a sunny hillside 6200 × 2000, four stone basins in steps from the upper left to a paddling pool at the lower right; the camera follows the duck both ways. Unlike the machines, the child sets off every step: the duck waits, all still, at each closed lock gate (a still yellow ring and 👇 mark the handwheel) until any tap or key; then the gate lifts with a creak, the water rushes, the duck rides down to the next basin and the gate shuts again, so everything is still within a couple of seconds. Each stretch has its own thing: a flume and waterfall turning a water wheel whose pegs ring a bell; a brook where a fish leaps over the duck and a frog jumps in from its lily pad; a twisty slide round a tower with a spin through the air; and a pipe the duck pops out of into the pool, where the fountain sprays, three ducklings quack in turn and the level ends (about 30 s if the child taps right away). While the duck moves, a tap on the water makes a ripple and any other tap or key makes it quack and hop (in the pipe, the bump swells). Each stretch is a pure function of the seconds since its gate opened (`Stretch`, `poseAt`, `gateAt`, `flowAt`); in development `__water.seek(stretch, seconds)` jumps there (−1 is waiting at that gate). `water.test.ts` checks that the stretches join up at the wait spots, the duck stays in the world, basins sit on their terraces, and the run lasts about half a minute and ends once.

## Working on machines

- Everything in a machine level is a pure function of the seconds since the tap, so any moment can be
  looked at with `__machine.seek(seconds)` in the console; with `?level=<id>` in the address, whichever card is tapped
  starts that level (the start screen still comes first).
  The clock runs on after a seek, so a screenshot shows a later moment: to hold one, freeze the frames first
  (`const raf = requestAnimationFrame.bind(window); requestAnimationFrame = (cb) => raf((ts) => cb(window.__frozen ?? ts)); window.__frozen = performance.now()`),
  then seek; set `window.__frozen = undefined` to let it run again.
- Each machine has its own world: never reuse an element of another machine.
- A machine runs about 35–45 s. It grows by new links, each set off visibly by the one before and setting off the next
  with a sound, never by stretching old moves or adding pauses; its test checks the new moments, hits and the length.
- The still 👆 (`TapHint`) and whatever the child taps stay well inside the 1600 × 900 picture: `y` is the emoji's
  baseline and the glyph hangs below it, so a finger near the bottom edge (y > 850) is cut off on a phone on its side.
  `tidy.test.ts`, `light.test.ts` and the like check that each machine ends where it should; a new machine gets such a test.

## Klingende Kugelbahn

Level `track` (`TrackLevel.tsx`, `track.ts`). Ideas N-34, X-08, K-19 (more in the K area of the ideas page).

A wooden marble run down a wall 1600 × 2250 (`TRACK_W`/`TRACK_H`, two and a half screens). One tap or key opens the hopper,
and six marbles come out one after the other. Each rolls over a xylophone, through six spots (bell, paddle wheel, funnel,
trampoline, bell, funnel by default), waits at the barrier, rides the seesaw, goes through the tunnel, takes the switch's way
(zigzag down past bumpers, or the left way over its own xylophone), loops the loop,
hops over three drums, knocks five chimes and plays a whole scale on the second xylophone before it drops into the basket.
A full basket raises the flag and ends the level („Nochmal“ / „Weiter“; any key goes on). A first marble takes about 21 s, the
whole round about 35 s. Tapping a spot swaps its part (bell, trampoline, funnel, paddle wheel), always.
On a computer a yellow space-bar button sits at the bottom in the middle, and Space rebuilds the run to the next
of all its builds, counting like a car's mileage: the first spot takes its next part, and each time it is back at the first
part the next spot moves on too (`rebuildNext`).

„Was rollt denn da?“ (K-07, always on): a shelf over the first row holds
three of five things (marble, tennis ball, iron ball, apple, soap bubble; `ROLLER` in `track.ts`); tapping one flies it into
the hopper and something else pops up in its place, a key or a tap on the wall takes them in turn. On a computer the keys
1, 2 and 3 hang under the shelf and let out the thing in that place (`ShelfKeys`). A sunny glow behind each place
marks the three things as what to tap, and before the first one a big still 👇 points at the middle thing (`ShelfHint`).
Once the camera has followed the things down, a round yellow ⬆ button in the bottom left corner (or the up arrow key)
takes it back up to the shelf, where it stays, with the 👇 again, until the next thing is let out; from then on it follows
only the things let out since, not the ones further down. Each rolls its own way on
the same route: the tennis ball hops along the rows, the iron ball is slow with deep notes and thumps, the apple bumps, the
soap bubble floats at an even speed and bursts above the basket instead of landing (so it doesn't fill it).

„Schranke und Stau“ (K-02): on row 2, just before the funnel (the default build keeps the funnel in the spot after it),
a red-and-white arm hangs from a round red sign down onto the rail (`GATE`, `Gate`). Whatever rolls up to it stops, „klick“,
and the next one stops behind the last (`waitAtGate`); waiting things fidget and the camera stays up with them and the
shelf, so the child can let out more and see the row grow. While things wait, a sunny glow marks the sign, and until the
barrier has first been lifted a still 👉 points at it. A tap on it (or Enter / ↓): „Achtung, fertig – los!“ – three rising
notes while the arm swings up, then the sign turns green, the bell dings and everything rushes off together into the funnel
(`stepGate`); a little later, once none is under it, the arm comes down again. Should the row ever reach back to the turn
above, the barrier lifts by itself. With „Von selbst“ it stays up, and a tap only wobbles it.

„Weichen umlegen“ (K-01): at the end of row 3 a switch (`SWITCH`, `Switch`): a yellow flap on a hinge and a thick lever with a
red knob that leans the way the marble will go. Lifted, the marble rolls on into the zigzag down the right edge; hanging
down, it knocks against the flap and drops onto the left way (`LEFT1` with four bars of its own, the left wall, `LEFT2`, and
against the zigzag's wall from the other side), and both ways meet on row 4 at `JOIN`. A tap on the switch flips it, „klack“
(← and → set it); a marble takes the way the switch is set to when it gets there, so flipping it while one rolls up
changes where it goes. With „Von selbst“ it flips by itself after each marble.

Joining in on the way: a tapped thing hops with a twirl and rolls on faster (K-03; without the shelf, after the hopper is
open, a key hops all rolling marbles, or plays the next bar when none rolls). The bars, seesaw, drums, chimes, looping and
basket react to a tap without a marble, as do bell, trampoline, funnel and wheel when the spots can't be swapped; a tap on
the tunnel lets an animal look out, and the bare wall sparkles where it is tapped (K-04). Taps on parts stop there, so the
wall doesn't also take the next thing or sparkle. In the middle of the tunnel (the `tunnel` event) every marble changes, in
turn from a random start: another colour, stripes, dots, a golden star, or an animal looks out (K-06; `Ball` in `parts.tsx`
takes a `look`); other things keep their look and an animal looks out for them.
- `track.ts`: all the numbers. The route comes in sections (`Routes.sections`) – fixed stretches, one per spot with a way
  for every part, and one for the switch with a way for each side – so a marble takes whatever part is in a spot, and the way
  the switch is set to, when it gets there. `TURNS` are the walls the marble bounces off to change direction (`bottom` ends a
  wall above a row that passes under it). `track.test.ts` checks that every way through a section joins every way through
  the next, nothing leaves the wall, spot boards don't overlap, the lifted flap is clear of the right way, and the barrier
  has room for a long row: run it after moving anything.
- `TrackLevel.tsx`: the marbles (rolling downhill with gravity and friction, fixed speed on wheel, funnel, seesaw and loop),
  the drawing, and the camera. The camera follows the marbles down: on a tall screen it shows more of the wall (up to all of
  it), before the tap the hopper, after the last marble the basket.
- The camera may go `TOP_ROOM` above the wall's top, so the shelf and the hopper sit clear of the top edge and the ✕.
  Never put what the child taps right at the wall's top edge: on a phone on its side the picture is cut there.
- The camera never follows what waits for the child's tap (marbles at the barrier): it stays where the child can see
  both that thing and what it taps, or it runs off and leaves the child looking at a waiting picture it can't reach.
- A pointing hand or glow added for a new tap target sits beside it, not over another part (the bars, a spot): check it
  next to its neighbours in the preview, a 👇 above the barrier once covered row 1's xylophone.
- `track.css`: its styles (classes `run-`). While it is on, the background music is off (the run
  plays its own notes and scales).
- Shared with the machines: `path.ts` (line, quad, arc), `parts.tsx` (Ball, Rail, BAR_COLORS) and `level.ts` (useFrames,
  useAnyKey, wobble).

To look at the whole wall at once, make the browser window tall and narrow (e.g. 640 × 900).

## Bahnen mit Thema (K-18)

Four more marble runs follow the wooden one, each its own card and level: the same wall, route, spots, shelf, keys and
camera (`Run` in `TrackLevel.tsx`), only drawn in another world, with other things on the shelf and another end.
- „Schneebahn“ (`snowTrack.tsx`, `snowtrack`): icy rails over snowy hills; a snowball (it grows from small to big along
  the way, `grow`), a penguin, a curling stone, a pine cone and a snowflake. What arrives builds a snowman part by part
  (three balls, face with carrot, arms and buttons, hat and scarf); full, it waves and its hat hops.
- „Weltraumbahn“ (`spaceTrack.tsx`, `spacetrack`): glowing rails in the starry sky; planets, a ringed planet, the moon, a
  smiling star and a comet land in a little moon's crater; full, three shooting stars fly over it.
- „Wasserrutsche“ (`slideTrack.tsx`, `slidetrack`): blue water chutes in a tiled swimming hall; a beach ball, a swim ring,
  a melon, a rubber duck and a water drop splash into a pool; full, three fountains spray up.
- „Baustellen-Bahn“ (`siteTrack.tsx`, `sitetrack`): conveyor belts on a brick wall; a log, a tyre, a stone, a big nut and a
  balloon fall into a skip; full, the crane's hook comes down and lifts the skip with everything in it (`pileLift`).

A world is a `TrackTheme` (`trackTheme.ts`): its backdrop, rail, colours of boards, posts, shelf, hopper and tunnel, one
thing per `Roller` behaviour (`Thing`; the five behaviours stay as they are, only the drawing changes), its sounds, the line
when full, the animals in the tunnel, and its `End` (drawn behind and in front of what landed, told how many have arrived,
`fullAge` and `tapAge`). `TrackLook` hands it to every drawing in the run; the wooden run is `WOODEN` in `TrackLevel.tsx`.
- A new world is a new file with a `TrackTheme`, a `MarbleLevel`, a card in `MODES`, a `LEVELS` entry, `LEVEL_TEXTS` and
  `RUNS` in `MarblePlay.tsx` (no background music). Give it five things that look different from every other world's, and
  an end that does something of its own when full – never the wooden basket and flag again.
- Their names, first lines and the line when full are German only so far (a part of its own in `languageStatus.ts`);
  everything shared with the wooden run speaks every language. The tunnel's colour-changing magic is the wooden run's only
  (`magic`); the other worlds keep each thing's own look.
- `trackTheme.test.ts` checks each world's level, its texts, the tunnel animals and that its landing spots stay on the wall.
