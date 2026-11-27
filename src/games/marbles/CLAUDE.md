# Kettenreaktion

Route `/kettenreaktion/` (`/kugelbahn/`, its old address and then the marble run's, leads here). The „Klingende Kugelbahn“
was a game of its own for a while and is the first level here again, so marble run and machines are one game on the home menu.

Twenty-one levels in turn, each about a minute long, beginning with the one picked on the start screen; after each one the shared `GameEnd` with „Nochmal“ as the drawn round arrow and „Weiter“ as the next level's picture (any key goes on; after the last level the first), and at any moment the level can be paused and skipped from there (see Pause and skip).
**After the tap that starts it, every machine runs to its end by itself** (user request, 24 November 2026: „alle Level
sollen von selbst durchlaufen, nur am Anfang sind Klicks nötig“): nothing on the way waits for another tap – no machine
holds at a stop, the Wasserbahn's gates after the first open by themselves, the marble runs' barrier stays up and their
switch flips itself. The child may still join in everywhere – every tap answers – but never has to. There is no choice
for it either: „Mitmachen“ (👆 Kind tippt / 🔄 Von selbst) over the cards was taken out with this. A new machine keeps
to it: one tap to start, then it plays through; never a place that waits for the child, nor an option to bring one back.
**But one tap lets out exactly one ball, in every level, and no ball leaves by itself** (user decision, 25 November
2026: the marble runs' shelf let out the next thing every two seconds after the first tap, and on the first level it
looked as if one tap on a phone had dropped several marbles; asked, the user chose one ball per tap over the levels
running through). So the marble runs and the Nagelbrett wait for a tap for each ball: once a run is empty its camera
goes back up to the shelf (`LOOK_UP_AFTER_MS`), and once no marble falls the Nagelbrett's hint marks the top again, each
with the shared `TapHint`. A key is one tap too (`useAnyKey` skips a held key's repeats). `oneBallPerTap.test.ts` fails
when anything a level's frame step reaches lets a ball out; a new level that lets out balls joins its list.
Only the level's end waits: `GameEnd`'s „Weiter“ is never pressed for the child – the next level never starts by itself
(user decision, 24 November 2026, asked when the levels began to run through).
One ball in the goal is enough for a level's trophy (user decision, November 2026): where several balls are played (the
marble runs' basket or tubes, the Nagelbrett's bins) the first one landing calls `LevelProps.onGoal`, which awards it at
once; a new level with such a goal calls it too. Kettenreaktion's trophies hold a ball lying in their cup (`BALL_GAMES` in
`Trophy.tsx`). Shared by the marble run and the
machines: the points-along-a-way helpers in `path.ts`, the marble and rail drawings in `parts.tsx`, `useFrames`/`useAnyKey` and the level clock in `level.ts`.
Nothing a level sets off for later outlives it nor runs on behind the pause: a sound, a line or `onDone` after a delay
goes through `later` of `useLevelTimers` (`level.ts`, on the level clock), never a bare `setTimeout` nor `useTimers` – the
end's tune once played in the menu when ✕ was tapped right after the last ball (`timers.test.ts`, `pause.test.ts`).

## How long a level lasts

**Every level lasts about a minute** (user request, 22 November 2026): a machine 56–64 s, a level to join in about as
long if the child plays along at once, a marble run's round 55–65 s – checked by each level's own test. A level only
ever grows longer, never shorter, and it grows by new links or sections that are interesting and varied – each set off
visibly by the one before and setting off the next with a sound – never by stretching old moves or adding pauses.
Before → after the rebuild of 22 November 2026, in seconds:

| Level                         | Before           | After             | Measured as                                                                                           |
| ----------------------------- | ---------------- | ----------------- | ----------------------------------------------------------------------------------------------------- |
| Große Maschine (`machine`)    | 41.4             | 59.4              | `build…().duration`                                                                                   |
| Verrückte Küche (`kitchen`)   | 41.0             | 60.1              | `build…().duration`                                                                                   |
| Im Garten (`garden`)          | 40.4             | 61.3              | `build…().duration`                                                                                   |
| Baustelle (`building`)        | 42.0             | 60.1              | `build…().duration`                                                                                   |
| Zirkus (`circus`)             | 40.1             | 59.2              | `build…().duration`                                                                                   |
| Raketenstart (`space`)        | 40.0             | 60.6              | `build…().duration`                                                                                   |
| Licht-Kette (`light`)         | 40.9             | 59.3              | `build…().duration`                                                                                   |
| Badezimmer (`bath`)           | 38.2             | 58.9              | `build…().duration`                                                                                   |
| Bauernhof (`farm`)            | 38.2             | 59.5              | `build…().duration`                                                                                   |
| Gute-Nacht-Maschine (`night`) | 44.7             | 61.3              | `build…().duration` (29 → 39 events)                                                                  |
| Aufräum-Maschine (`tidy`)     | 33.2             | 59.5              | `build…().duration`                                                                                   |
| Alles fällt um (`topple`)     | ~14              | 58.9–60.2         | fixed-step simulation, 12 rounds (`topple.test.ts`)                                                   |
| Hatschi-Kette (`sneeze`)      | 25–26            | 57.9–58.4         | `plannedSeconds`, every row of animals (`sneeze.test.ts`)                                             |
| Wasserbahn (`water`)          | 29.0             | 59.0              | sum of its stretches, the child tapping at once (`water.test.ts`)                                     |
| Nagelbrett (`pegs`)           | ~30 (10 marbles) | 61.0 (20 marbles) | seeded simulation of 30 rounds, one marble at a time (a tap a second: 13.0 → 24.7); no test bounds it |
| Klingende Kugelbahn (`track`) | ~35.6            | 61.9              | whole round simulated in `track.test.ts` (+4 s on 25 November 2026 for the song, K-11)                |
| Farbenbahn (`colortrack`)     | ~35.6            | 61.7              | as above                                                                                              |
| Schneebahn (`snowtrack`)      | ~35.6            | 60.3              | as above                                                                                              |
| Weltraumbahn (`spacetrack`)   | ~35.6            | 59.9              | as above (63.1 until the orbit went once round, 26 November 2026)                                     |
| Wasserrutsche (`slidetrack`)  | ~35.6            | 64.0              | as above                                                                                              |
| Baustellen-Bahn (`sitetrack`) | ~35.6            | 60.8              | as above                                                                                              |

## Pause and skip

The child can pause at any moment and skip to the next level from there (user request, November 2026; `PauseVeil.tsx`):
a round paper ⏸ button in the bottom right corner, mounted while a level plays (not at its party or end). Paused, a veil
lies over the picture with two things only and no words – children don't read: a big ▶ goes on, and the next level's
picture (the same as „Weiter“ at the end, its card's cut from `vorschau/`) skips to it („Skip“ only as its `aria-label`,
in all seven languages inline). A tap anywhere else on the veil, or any key but Esc, goes on too, so a child who paused
by chance is never stuck; the veil catches keys before the level's own (`capture`).
- A level runs on the **level clock** (`level.ts`): the wall's time without the time spent paused (`paused`, a store;
  `levelNow()`). While paused, `useFrames` runs no step and the waits of `useLevelTimers` stand still, so a machine, a
  falling marble, a sound or the level's end all hold where they are and go on from there.
- So a level never reads `performance.now()` or `Date.now()` itself and never waits with `setTimeout` or `useTimers`: it
  takes `now` from `useFrames`, `levelNow()` in a tap's handler, and `later` of `useLevelTimers`. `pause.test.ts` checks
  every level file; a new level keeps to it, or it moves, sounds or ends behind the veil.

## The end of a level

The shared `GameEnd` with the level's trophy, as in every game, but drawn for children who don't read (user request,
22 November 2026): „Weiter“ is the next level's picture taped onto the page (`next.picture`, the vorschau webp of its
card) and „Nochmal“ the drawn round arrow (`ControlIcon`). The same picture is the pause's skip, so a child knows it.
After a world grows, run `bun run previews kettenreaktion` and look at every picture before keeping it: the cut picks
the busiest part of the whole world, and in the longer worlds it landed on empty stretches (a fence, a toilet) and on
the marble runs' tap hand (22 November 2026). Keep the old picture where what it shows is still in the level, take the
new one where the old shows something gone (the machine's dominoes), or give the level a cut in `CUTS` of
`tools/previews.ts`.

## Machines

„Alles fällt um“ (`ToppleLevel.tsx`, simulation in `topple.ts` – `layOut`, `stepSim` –, links drawn in `toppleLinks.tsx`, things picked by `pickRuns` in `things.tsx`; about 60 s): everyday things (`things.tsx`) stand in seven runs, each small to tall, and topple onto each other like dominoes; each round picks other things, and the last one is always the broom, which falls onto the drum, bang, and sparkles burst out of it. Between each two runs stands a link of its own kind, in a fixed order (`LINK_KINDS` in `topple.ts`): a bench tips a bolster into a pop-up tent; a space hopper bounces over; a toy hot-air balloon drops its sandbag; a roly-poly rocks a skateboard through a tunnel and up a ramp; a fan blows a sailboat on wheels; a hanging egg chair swings and flings the teddy. Each link stands still until the run's last thing falls against it, sounds when hit and again when it pushes the next run's first thing. A link's stand is what the run's last thing falls against; links that move away let it fall on.

Eleven Rube Goldberg machines: one tap, and for about a minute one thing sets off the next while the camera follows whatever moves. Nothing on the way waits: the stations where a machine once held still until a tap (R-03, `stops`) were taken out on 24 November 2026. Each has its own world, and no element repeats from another level. They share the helpers in `machineKit.ts` (paths, rolling, hops, timeline, camera), the stage in `MachineStage.tsx` (clock, sounds, camera, tap) and wall pictures in `scenery.tsx`; each has a `<name>.test.ts` that checks the order of its moments, that each thing really reaches the next, and its length (56–64 s).
- "Große Maschine" (`machine.ts`, `MachineLevel.tsx`, a 12600 px playroom, about 59 s): the marble plays the xylophone, rings the bell and spirals down the funnel onto a Newton's cradle. The cradle's last ball taps a roly-poly penguin, which rocks on its round belly until it nudges the toy car. The car goes through a loop onto a seesaw catapult, which flings a beach ball down block stairs into a bucket that pulls up the gate for the train. The train bumps a humming top into a tower of stacking cups that plink as they tumble, and the top cup flicks off a paper plane that loops the loop. The plane glides onto the key of a toy cash register, whose drawer shoots out and sends a hula hoop rolling across the room into the lowest gondola of a toy Ferris wheel. The wheel carries a little parachutist up to the top; he jumps, floats down on his parachute and lands on the button of the jack-in-the-box. The cradle and penguin replace the ten dominoes, which were „Alles fällt um“'s idea. The cash register has coloured keys and coins, but no digits. Its line „Oh, a parachute!“ is new (22 November 2026).
- „Verrückte Küche" (`kitchen.ts`, `KitchenLevel.tsx`, an 8654 px kitchen, about 60 s): the marble falls from the spice jar along the wooden spoon and knocks the rolling pin down the cutting board into the ladle, which flings a meatball into the spaghetti. The plate rolls into the salad spinner's crank: the spinner whirls, its lid pops off, lettuce flies out, and the biggest leaf slaps the egg timer on the cookie jar. The timer ticks back, rings and rattles off onto the pancake pan's handle, and the pancake somersaults onto a raspberry jelly. The jelly wobbles under it, and each sway to the right nudges the pepper mill: it rocks twice and falls the third time, coming to rest against the coffee machine's red button. The machine grinds and shakes, pours a cup, then puffs steam under a bottle of apple fizz. The fizz bubbles up, the cork creeps out and pops, flies onto an egg in its egg cup on the bread box, and drops onto the box. The egg tips out over the cup's rim onto a baking tray and rolls end over end, so it wobbles, down the tray and along the counter, and stops lying flat against the honey jar. The jar teeters, falls onto its side, and its lid pops off backwards. The honey oozes slowly to the cooktop's touch field: the popcorn pops into the mug on the toaster lever, and the toast flies onto the bunny's plate. Its line „Pop! There goes the cork!“ is new (22 November 2026).
- „Im Garten" (`garden.ts`, `GardenLevel.tsx`, 8925 wide, about 61 s): a marble rolls out of the birdhouse along the gutter under the wind chimes into the watering can, which tips onto a water wheel; the wheel pushes the wheelbarrow onto a rake, whose handle shakes the apple tree, and the apple rolls down the slide into the robot mower, which beeps on and mows a stripe across the lawn to the bird feeder's pole. The bump swings the feeder, six nuts trickle out between pole and nut tree; the squirrel wakes, runs down, eats them from the tree outward, climbs back and leaps onto the head of a croquet mallet leaning on the trunk; its weight tips the mallet, whose head hits the croquet ball (knock, thump). The ball bonks the molehill: the dizzy mole digs off under the lawn (a ridge of earth runs along), looks out once, and comes up under the sleeping hedgehog, who curls into a prickly ball and rolls through a pile of leaves; the leaves spin the pinwheel, whose string pulls open the garden tap, and the sprinkler waters the sunflower until it blooms.
- „Baustelle" (`building.ts`, `BuildingLevel.tsx`, 8520 wide, about 60 s): the cement mixer tips the marble onto a spirit level, down the chute and up the conveyor belt to knock over a cone, which lets the wrecking ball smash the brick tower; the tower bumps a cable drum along the scaffold into a sand pile, and the drum bonks the excavator awake. The excavator digs, swings round, tips the sand in front of the road roller and pats its roof; the roller presses the heap into a road and bumps the jackhammer, whose last hop presses the generator's start button. The generator puffs, a spark runs along its cable to the pile driver, which thumps a post into the ground three times, deeper each time; the last thump makes a concrete pipe jump off its chocks, it rolls through a puddle (splash) against the ladder's foot, the ladder's top lifts the cement sack's overhang off the brick stack, the sack tips onto the winch's crank, and the tower crane lowers the roof onto the house.
- „Zirkus" (`circus.ts`, `CircusLevel.tsx`, 8760 × 900, about 59 s): the marble drops out of the magician's top hat, drums down three drums onto the cymbal and the trampoline, onto the seal's nose and down a chute over the elephant's head; the trunk flings it up to a monkey on a trapeze, who catches it with its feet, swings higher and drops it into the mane of a dozing lion. The lion wakes, roars, leaps onto the next pedestal and shakes the marble into the basket of a bear acrobat on a unicycle, who rides the high wire through a ring of paper flames and pulls the cannon's ribbon: the clown doll flies into the net. The net throws the doll with a somersault onto a big blue starry ball; treading it (a rising note per stride) the clown rolls it onto the pad of a high striker, the puck shoots up and rings, the box on top flips open and three balloons rise to the swing of a dozing red parrot under the roof, bumping its bar; the parrot wakes with a squawk, flies a loop, grips the curtain's cord and pulls it: the curtain opens („Bravo“), the clown hops off onto its spot in front of the stage, bows to a tusch and claps under the two spotlights.
- „Raketenstart" (`space.ts`, `SpaceLevel.tsx`, 8350 × 900, about 61 s): the marble drops out of the satellite dish, through the glowing rings and the zigzag pipe onto the robot's button; the robot pushes the moon buggy over the hills, and its bumper presses the red button of an intercom on a post (lamp, chime). In a glass dome a space kangaroo in a bubble helmet dozing on a cushion pricks its ears, the hatch slides up, it comes out through the tunnel and makes three floaty hops, the last onto the green pedal of a radio mast; the mast's three lamps light bottom up, its antenna sends three radio-wave arcs to a sleeping satellite, which wakes, unfolds its solar wings and lets go of a capsule whose striped parachute opens; the capsule lands between mast and mobile and a puff from its nozzle drifts to the planet mobile and turns it, whose earth bonks the telescope. The telescope swings to the sky, and from where it points a UFO with a little alien floats in, beams up a moon rock, drops it onto the switch and zooms off. The magnet lets go, the iron ball drops into the countdown board, and after „3, 2, 1“ the rocket lifts off; as a coda it lands, small and far, on top of the moon, which wakes smiling, and a little flag pops out.
- „Licht-Kette" (`light.ts`, `LightLevel.tsx`, R-10, 7100 wide, about 59 s): light instead of noise, in a dark children's room – the torch's beam bounces off a mirror onto the disco ball, a golden spot wakes the fireflies in their jar, they fly along the fairy lights down to a lava lamp and switch it on; its warm air turns a paper carousel whose rabbit and bird throw big shadows over the wall, until the paper bird flutters onto the button of a globe, which lights up and turns. Its glow calls the fireflies into the lantern of a toy lighthouse; their light becomes its beam, the lighthouse turns and its spot sweeps twice over the wall, waking glow-in-the-dark stickers as it passes, then rests on a prism in the starlit window; the prism throws a rainbow onto a solar flower, which dances, sways and bows until its face snaps a glow stick; the stick's green glow calls the fireflies over the roof to the star lamp, which throws stars all over the room and wakes the toy owl. Its line „Look, a rainbow!“ is new (22 November 2026). The night is a dark veil over the room, a small canvas (`NightVeil`) with soft holes wherever something shines (`nightHoles`); every new light needs its hole there, and what shines is drawn in the `front` layer over the veil, or, while it moves
  or fades, as a `Sprite` in `top` (lantern, fireflies, waking stickers).
- „Badezimmer" (`bath.ts`, `BathLevel.tsx`, R-05, about 7700 wide, about 59 s): the red button on the toothpaste tube is the first thing to tap; a blob tips the toothbrush into the tooth mug, the mug topples onto the squeaky duck (it wears a sailor's hat, so it isn't the Wasserbahn's), the duck bonks the bath tap's lever, and the tub – drawn cut open, so the child sees it fill – foams over. The wave carries the duck onto a bar of soap on the floor; the soap slides off with the duck riding it and bumps a plunger on its cup, which falls with its knob onto the pull handle of a high cistern's chain: the toilet flushes, water runs down the pipe, the lid bursts open and knocks the toilet roll off its holder, which rolls away unrolling a paper ribbon into the wind-up whale's key. The whale waddles off and its spout arcs over the rim of a washing machine onto its start button: it fills, tumbles a sock and a shirt, spins and walks on its feet until its side presses the hair dryer's switch, and the dryer blows the shower cap onto the ceiling lamp and soap bubbles out of the bubble wand, which pop one by one at the lamp. Its line „The washing machine walks off!“ is new (22 November 2026).
- „Bauernhof" (`farm.ts`, `FarmLevel.tsx`, R-06, 9080 × 900, about 60 s): every link is an animal – the rooster crows, the pig jumps into the puddle, the mud wakes the cat, her ball of wool rolls onto the cow's nose, the moo wakes the goat, who butts the milk can (the first time it only wobbles) into the kennel. The barking dog rouses a turkey, which gobbles and fans its tail into seven feathers; the last tips over a grain sack, a rolling grain wakes the hen in her nest with three chicks, she pecks along four grains onto the tractor's mudguard and pecks the bulb horn; the fox farmer (`CabDriver`, only his straw hat shows) drives off to the pond, a second honk wakes the goose, who jumps into the pond and honks the ducks up onto the donkey's back; the donkey brays and kicks the barn, which throws the ducks onto the roof; a swallow darts out of her nest and turns the latch on the left door's edge, the doors swing open and the animals sing one after the other, then all together. Every call is a real recording from `src/lib/sounds/` (goat, heehaw, gobble, peep, goose and the tractor's engine among them), loaded when the level opens (`FARM_SOUNDS`), the synthesized call until then.
- „Gute-Nacht-Maschine" (`night.ts`, `NightLevel.tsx`, R-07, 4650 × 900, about 61 s): the calm one – a children's room at dusk; the music box's crank nudges a golden star ball down a zigzag gutter into a basket, the basket sinks and its cord over two ceiling pulleys draws the curtain, and the curtain tips the rocking chair until its backrest taps the cuckoo clock's pendulum. The sleepy cuckoo calls a soft „kuckuck“ and yawns, and its beak pushes the arc lamp's pull chain: click, the light goes out. The camera turns to a hamster cage on a chest of drawers; the hamster wakes (`hamster.mp3`), drinks two sips, climbs into its wheel and runs; the wheel's axle drives a small cable car whose red cabin rides slowly up the rope to the round window and bumps the wooden shutter with a crescent cut-out; the shutter swings open, the moon rises, and a soft beam of moonlight slides down to the teddy, which yawns. Teddy, moon, cuckoo, star and the carousel sheep fall asleep („z z z“) while the camera glides back to the music box, and the hamster curls up asleep in its wheel. The room gets dark as a plain veil, and what is outside or glows is drawn over it. Slow pace and soft sounds only: no background song while it plays and its end plays `playLullaby` instead of the cheerful tune.
- „Aufräum-Maschine" (`tidy.ts`, `TidyLevel.tsx`, R-08, about 59 s): an untidy children's room – the rocking horse kicks the football, which rolls the blocks into the toy chest and itself after them, the lid slams and sets off the wind-up truck, which pushes the books to the shelf, where they hop in. Then the truck bounces on the bellows: each puff runs along the hose and blows a sock into the laundry basket, each sock its own way in the same time (flip, over the rim, corkscrew …), and the last throws the rolled-up sock ball onto the full basket. It bounces off and rolls along the floor: the crayons it reaches hop into the pencil pot, each with its own note and its own way (hop, cartwheel, rocket …), and the jigsaw pieces go into the puzzle board until the picture is whole (hop, frisbee, scoot, tumble …). Then the sock ball bumps a rolled-up rug: it unrolls and turns the crank of a jack-in-the-box; the clown pops out and nudges the pyjamas, which zip down the clothes line, swing and kick a slinky; it walks down a four-step stool onto a ruler across an eraser; the ruler flings a paper plane through a loop onto the robot vacuum's button; the vacuum sweeps up seven crumbs and knocks the plug out of the air cushion – pfffft, the cushion jumps like a balloon let go and throws the cuddly bunny into bed (a bunny, not a teddy, so it isn't the circus's bear); the blanket spreads over it and everything glitters.

Everything in a machine is a function of the seconds since the tap; in development `__machine.seek(seconds)` in the console jumps to a moment, and each level has its own address, `/kettenreaktion/garden/` opening that one (`?level=` is gone).

## Languages (German, English, Chinese, Hindi, Spanish, Arabic, Russian)

Kettenreaktion follows the app language (home page): start screen, the level names and every spoken line.
- Level names and first lines live in `content.ts` (`LEVEL_TEXTS`), used by the mode cards, the „Weiter“ button and each
  picture's `aria-label` (`useLevelName`). The start screen has only the level cards – no row above them since its „Mitmachen“ choice went on 24 November 2026 (see the top) –, no „Über das Spiel“ and no „Einstellungen“ (removed October 2026 – the game
  explains itself by playing, and the shelf and the 🔧 spots are always on). Don't add either back.
- `say` (in `LevelProps`) and a machine event's `say` take a `Localized` line, `{ de, en, zh, hi, es, ar, ru }`, written next to its moment;
  `MarblePlay` plays its ElevenLabs recording (`voice.ts`, files in `stimme/`) in the app language, or the German line's where a translation is missing. Never pass a bare German string.
  Recorded in every app language (November 2026), but for the four lines the longer machines brought on 22 November
  2026 (Große Maschine, Küche, Licht-Kette, Badezimmer), translated into all seven and waiting for their recording
  (`languageStatus.ts`, „⏱️ Die Level werden eine Minute lang“). A new or changed line is listed on `/management/` (`voiceLines.ts`: machine events and level intros are
  read from the data, a line written inline in a level goes into `INLINE_LINES`, or it is never recorded) and recorded
  with `bun run voice make --only kettenreaktion`, only when the user asks.
- Text drawn in a picture (the „START!“/„ПУСК!“/„发射！“ on the rocket's board) uses `useT()`; in files where `t` is the time,
  name the helper differently (`tr`, or call `useT()(…)` directly).
- New lines are written English first (root `CLAUDE.md`, Language): inline texts as `t({ en: "…", de: "…", … })`; `say`
  and the levels' texts take a `Localized` (`{ de: "…" }`, German first) so far, so the first English-first line there
  teaches them a line's first language (`EnglishFirst`/`Texts` in `src/lib/language.ts`), with a test. Translations,
  German included, are added in the same commit (user decision, 22 November 2026). A changed line of the older
  German-first ones is changed in its German and its translations are updated with it, so they never say different things.
  `content.test.ts` checks every name, first line and machine line: German there, Russian, Chinese, Hindi and Arabic (if
  any) in their own script with no Latin letters, and a line with Russian has all five other languages too.
- The game is „Chain Reaction“ / „连锁反应“ / „चेन रिएक्शन“ / „Reacción en cadena“ / „تفاعل متسلسل“. Arabic lines speak
  as "we" (هيّا ن…), Hindi gives commands or says "let's" (चलो), Spanish says tú: nothing changes for a boy or a girl.
  A new machine goes into that test's list.

## Levels to join in

Three levels aren't one-tap machines but let the child join in along the way. Hatschi-Kette and Wasserbahn run to their end by themselves all the same; the Nagelbrett drops a marble for each tap only (see the top). Like every level here, their first-tap hints
are the shared `TapHint`, still until the child has waited a few seconds.

„Nagelbrett“ (`PegsLevel.tsx`, numbers and physics in `pegs.ts`, K-13): an upright wooden board with seven staggered rows of nails over five bins, each with an animal waiting in it (five of frog, cow, dog, duck, cat and pig, shuffled each round). Wherever the child taps, only the x counts: a marble pops in at the top above it and falls, bouncing from nail to nail (circle against nail with a bounce and a small random push, so none balances on a nail; side walls and dividers). Each nail it hits glows and plinks a pentatonic note, higher rows higher (`playPlink`). A star spinner turns among the nails and flicks marbles aside, and after the fourth marble a ladybug crawls to and fro along a vine (buzz) as a moving bumper, only while marbles fall. A tap on a bin drops a marble above that bin; a key drops at its place along its keyboard row (`keySpot`, by `KeyboardEvent.code`), other keys at a random place. At most 12 marbles fall at once. In the bin the animal hops and calls, and the marble rolls to its place in a small pile (5 + 4; one more pops in sparkles); at a bin's third marble its animal does its own trick, at the fifth it climbs onto its pile. Each tap or key drops one marble, none drops by itself (25 November 2026; from 24 November until then the next dropped by itself once none fell): while none falls the `TapHint` marks the top again. After twenty marbles every animal does its trick once more in turn with a trill, and the level ends 3 s later (about a minute dropping one marble at a time, about 25 s with a tap a second). Everything moves in the frame loop with no CSS animations, so the board is still before the first tap (a still marble at the top, marked by the `TapHint`) and again once all marbles lie. `pegs.test.ts` drops hundreds of marbles, with the star turning and the ladybug crawling, to check none gets stuck and all bins can be reached: run it after moving nails, bins, the star or the vine.

„Hatschi-Kette“ (`SneezeLevel.tsx`, layout and timing in `sneeze.ts`, R-09, about 58 s): eight animals sit on a meadow facing us, small to big – always the mouse first and the cow and the elephant last, five of chick, duck, rabbit, cat, dog, pig and sheep in between (`pickAnimals`) – with a big tree at the end. A tap lets a feather float down onto the mouse's nose: „ha… ha…“ (head back, eyes squeezing, nose twitching) and HATSCHI – a little cloud with whoosh lines and glittering droplets flies to the next animal's cheek. Its fur ruffles, it makes its own sound and sneezes in turn, a bit bigger and louder (`playHa(size)`/`playHatschi(size)` in `sfx/animals.ts`, size 0 for the mouse to 1 for the elephant). The camera walks along and steps back for the elephant, whose sneeze through its raised trunk blows every leaf off the tree. In its first part it counts its own state frame by frame, because joining in changes the timing: a tap on an animal going „ha…“ makes it sneeze at once, one that has sneezed sniffs or giggles, one still waiting says hello. Any other tap or key moves the chain on one step.
Then a second part past the tree (`PART2`, `acornAt`, `beeAt`, `kiteAt`; a pure function of the seconds since it began): a squirrel chatters and drops its acorn, which bounces three times into a puffball (puff); its spores drift to a sleeping tortoise's nose, it sneezes and pulls into its shell, the shell hops to a beehive's stool, three bees come out and the first flies through four dandelion clocks; the seeds float up under a sleeping cloud, which wakes, sneezes and blows a gust; the gust lifts a kite whose tail tickles a scarecrow until he sneezes his hat off and the straw out. The hat lands crooked and everyone laughs, each animal of the row with its own move (mouse and pig tip back, birds flap, the rabbit's ears go up, cat and sheep puff up, the dog shakes, the cow's bell swings, the elephant's ears flap), and the level is done. There a tap jumps to the next moment in `PART2_STEPS` and marks the sounds it skipped as played, silently; each thing answers a tap with its own sound, and tapped during its „ha…“ it sneezes early. The second part's sound keys are prefixed `p2:`. Every animal is drawn facing us in its own units (100 high, standing on y 0) and scaled to its `height`; the line width is set on its group so all animals get the same lines. `sneeze.test.ts` checks the row order, that animals don't overlap, and that a round without joining in takes 56–64 s for every row of animals.

„Wasserbahn“ (`water.ts`, `WaterLevel.tsx`, `water.css`; ideas X-09 and R-03): a yellow rubber duck rides a water run down a sunny hillside 9700 × 2400 – four stone basins on terraces from the upper left down to a paddling pool at the lower right, three wild ponds between them; the camera follows the duck both ways. About a minute. The child sets off the run: the duck waits, all still, at the first lock gate (the `TapHint` marks the handwheel, its hand to the right) until any tap or key; every other gate opens by itself once it has settled; as a gate opens it lifts with a creak, the water rushes, the duck rides down and the gate shuts again, so everything is still within a couple of seconds. Each stretch has its own things: 1, a flume past the water wheel, whose pegs ring a bell, into the reed pond, where a stork takes the duck by the head, flies it over the hill, drops it into basin 2 and clatters in its nest; 2, a brook where a fish leaps over the duck, then the still turtle pond – a turtle surfaces under the duck, paddles it across, climbs a rock and bows so the duck slides into basin 3, where a frog jumps in; 3, a twisty slide round a tower into a warm spring, where a hiccup lifts the duck a little, then a geyser shoots it up, it rides the column's top and hops into the last basin; 4, a green pipe the duck pops out of into the pool, where the fountain sprays, three ducklings quack, the duck leads them back in a row, each quacking as it arrives, the fountain sprays once more and the level ends. While the duck moves, a tap on the water makes a ripple and any other tap or key makes it quack and hop (in the pipe, the bump swells). Each stretch is a pure function of the seconds since its gate opened (`Stretch`, `poseAt`, `gateAt`, `flowAt`); in development `__water.seek(stretch, seconds)` jumps there (−1 is waiting at that gate). A wild pond lies on a terrace of its own, lower than the one before. `water.test.ts` checks that the stretches join up at the wait spots, the duck stays in the world, basins and ponds sit on their terraces, whatever carries the duck stays on it, and the run lasts 56–64 s and ends once.

## Loading and drawing only what is needed

- **Every level is a chunk of its own** (R-P12, November 2026: all 21 levels in the start screen's chunk were 454 KB):
  the cards' data (id, emoji) lives in `catalog.ts` with one `import()` per level (the six marble runs share
  `TrackLevel`'s), names in `content.ts`; `MarblePlay` waits for a level's code behind a `Suspense` showing
  `PageLoading` (`PlayedLevel`, which also says the level's first line once its picture is there). A level's code
  loads only once its card is pressed (`prepare`, as the finger lands) – the start screen fetches no level ahead in idle
  moments (user request, November 2026: load only what the child picks) –, and a level's end fetches the next one
  during its party, since „Weiter“ asks for it – never while a level runs, nor when `savesData()`. A new level gets its entry in `LEVELS`,
  never a static import in `MarbleGame.tsx` or `MarblePlay.tsx`, and imports its own CSS (`track.css` in
  `TrackLevel.tsx`) (`catalog.test.ts`).
- **A level draws only while something moves** (R-G7, November 2026: every level rendered 60 times a second also while
  it waited for the first tap, at a stop and behind the end): `useFrames`' step runs every frame and returns whether
  the picture changes – its clock running, a camera still `gliding`, a wobble, flash or sparkle younger than `SETTLE_S`
  (the marble run's parts: `SETTLED_S`, and any tap or key stirs it) – and the frame where things come to rest is drawn
  last (`frameTicker`, `frames.test.ts`). It is drawn at most every `MIN_DRAW_MS` (`level.ts`): a 120 or 144 Hz screen
  draws every second frame, so a fast gaming phone does no more drawing than a 60 Hz one – at 120 Hz each drawing and
  its raster came twice as often, and the game stuttered now and then on a gaming phone (user feedback, 24 November
  2026); never take the cap out to make motion smoother, nor time anything by drawn frames. A new thing that changes with time or with a tap counts itself in its level's
  step, or it freezes. Machines and the runs draw on after their end, since some ends keep moving (the good-night
  machine's „z z z“, the pool's fountains).
- **What changes in a frame is painted and rastered again, as wide as the screen** (perf of every level, November
  2026: Raketenstart rastered 99 screens a second, the Licht-Kette 158, the Nagelbrett 57, budget 30): any change inside
  an svg has the phone paint that svg again, and it rasters bands as wide as the screen round each change, so a few small
  things moving at different heights raster nearly the whole screen in every frame. So:
  - What never changes goes into a layer of its own, drawn once: `MachineStage`'s `back` (behind the world) and `front`
    (over it) take `WorldLayer`s, each its own svg moved by the same camera; a sky or room that no frame changes goes
    there, and a layer's content is built once (`useMemo`), never again per frame. A level with a stage of its own
    (Wasserbahn, Hatschi-Kette, Alles fällt um, Nagelbrett) does the same: its sky, meadow or room is an svg of its own
    under the one where things move, with the same `cameraLayer` style (A-36).
  - A small thing that moves for long (a falling marble, a turning star, a crawling ladybug, a hopping animal) is a
    `Sprite` (`parts.tsx`): a little svg of its own over the picture, placed and turned by a CSS transform, as the
    marble runs' `.run-marble`. Its drawing is `still(…)` with numbers as props, so it is drawn again only while it
    really changes (a glow passes `-1` once over) – the Nagelbrett went from 57 to 13 screens a second this way.
  - Many things blinking or twinkling at once (the Raketenstart's stars) are a few groups, each a layer with a CSS
    `opacity` animation (`marble-twinkle`), never each star's opacity set per frame.
  - A darkness with holes of light (the Licht-Kette's night) is a small canvas stretched over the picture
    (`NightVeil`, `VEIL_PX`), never an svg mask over the whole world, which repainted the whole room in every frame.
    The canvas itself costs nearly nothing to raster (A-42, `--trace`); its cost is drawing it, so it is drawn again
    only when what it shows changes, rounded to its own pixels and to 1/256 of darkness, never for a change no one sees.
  - **Something that moves only for a while is a layer only for that while** (A-42): the Licht-Kette's globe is drawn
    in the machine's svg, and only while it turns (`globeMoving`) its ball is a `Sprite` in `over`, under the night; a
    sticker waking is a `Sprite` in `top` faded by the sprite's `opacity` (the compositor fades it, nothing is painted)
    while `stickerWaking`, and drawn lit in `front` once it rests. `top` is `MachineStage`'s slot over `front`, for
    sprites that must lie over what `front` draws (fireflies over the fairy lights, the lantern's light). A part's
    numbers stay exactly the same outside its moving window (`light.test.ts`) – a `-0` against `0` once kept a
    `still` part drawing (`+ 0` turns it into `0`).
  - A machine's backdrop (room, sky, fence, tent) goes into `back`, never into the machine's svg, and its parts that
    change only now and then are `still(…)` with numbers as props, never `t` itself (perf, 23 November 2026: the
    Baustelle and the Zirkus were 70–82 % busy drawing their rooms in every frame).
  - **Nothing moves for ever.** What flickers, bobs or turns for the rest of the level (flames, a disco ball, foam, a
    satellite) passes a constant time while it is off screen (`seen(x0, x1)`, given to `children`, `back` and `front`),
    and stops a few seconds after its job, also behind the end (a kettle's steam, a sprinkler, ribbons, a vehicle
    driving off – which drove on to x 66 000). What dies away uses `decay()` (never `Math.exp(-…)` of an age) and a
    half sine over a segment `hump(seg(…))` (never `Math.sin(Math.PI * seg(…))`, which ends at 1.2e-16, not 0): both
    reach exactly 0, while a fraction of a pixel changing kept the phone painting (`decay.test.ts`). To find what still
    changes, `KETTEN_SCAN=1 bun test src/games/marbles/stillness.scan.test.tsx` renders every machine a frame apart and
    lists it; the line at the end + 4 s shows what still moves behind the end. As a last guard a machine's clock stands
    `AFTER_END_S` after its end (`tickClock` in `MachineStage.tsx`, `afterEnd.test.ts`), so nothing is drawn behind the
    end for ever – but each level lets its own end settle before that (the garden's birds stop singing and its mole
    stops waving at `tQuiet`, the excavator stops humming after its last move). A `wobble()` is exactly 0 once what is
    left of it is under `WOBBLE_REST` of its start (the barn kept turning by 0.0001° until `SETTLE_S`).
    Something set turning that slows to a stop over seconds (the Raketenstart's mobile) eases out over a fixed time, a
    cubic of `seg(…)` starting as fast, never `1 - decay(t / slow)` with a slow rate: `decay` reaches 0 only at nine
    times that rate, and the mobile turned by fractions of a pixel for 30 s, to the level's end, with the phone
    painting the machine for it (A-49; `space.test.ts`).
    `TIMES=30,40` scans those seconds, `ALL=1` lists every change rather than the first eight.
    **Beside the screen counts too**: a phone rasters the big svg half a screen and more beside what it shows, so what
    swings or rocks on there for long (Gute Nacht's pendulum and rocking chair while the camera stays with the hamster
    and the moon) is rastered as if on the screen – it was two thirds of that level's middle (A-43). `seen` counts that
    room as near on purpose; what only swings on after its job holds a fixed moment unless `seen.shown(x0, x1)` (on the
    screen itself, with `wide`), with a margin round its box, so the jump back to its real moment happens off the screen.
    Something that keeps turning or wobbling only as an echo of the moment it was set off – a globe still spinning
    behind the lighthouse, wings flapping on a firefly that sits still – comes to rest once its job is done (`GLOBE_SPIN`,
    the fireflies' `flying`, and their wings rest while they sit in the lantern), and what turns only while it is on
    screen (the Licht-Kette's lamp, carousels and shadows, `lamp()`) takes a still time once it is left behind for good
    (`lampRest`): `seen` counts half a view beside the screen as near, so it needs `seen.wide`, how far a screen wider
    than 16 : 9 really shows – the lamp kept turning far off the screen, half the Licht-Kette's middle (A-42).
  - A long thing sweeping across the world (the Licht-Kette's lighthouse beam) is never drawn into a world-sized svg,
    where each frame rasters the whole band it crosses: it is a few small sprites in `over`, a band stretched by
    `scaleX`, its spot and its glare each moved by a transform (`LighthouseBeam`).
  - Dashes flowing along a long line (a power cable's current, a hose's water, a conveyor belt) are `FlowingDashes`
    (`parts.tsx`) in `over`: strips of HTML whose dashes slide by a compositor animation of `transform` – never a
    `strokeDashoffset` moved by the clock in the machine's svg, which rasters the whole band the line spans in every
    frame (the Raketenstart's current: 52 → 43 screens a second). Their keyframes move by `translateX(100%)` of a strip
    one period wide, never by a custom property, which the compositor can't run alone. They suit only a flow nothing
    else follows: a few short or thin ones still flow by `strokeDashoffset` (the garden's hose, the bath's air, the
    Wasserbahn's streams under the duck, which `over` would lie on), and they cost little – measure before converting
    one, since the big costs were elsewhere (24 November 2026: what moved big and long in the svg, below).
  - **A big or long thing that moves while something else follows it** (a belt's cleats pushing a marble, a rope's
    knots and its pulley, a ball a clown stands on) is a row of `Sprite`s in `over`, each placed from the machine's
    clock like the drawing was – never a CSS animation, which would drift from what it pushes. The Baustelle's belt drawn
    in the svg rastered the band from x 754 to 1300 in every frame, 48 screens a second; as sprites (`BeltMoving`) 14.
    The still part (frame, band, legs) stays in the svg, `memo`, drawn once. Since `over` lies over the whole machine:
    - over a darkened room (Gute Nacht's `dark`) each sprite carries a shade of its own shape in `NIGHT` at `dark`'s
      opacity (`RopeRunning`'s `shade(r)`), never a square shade over its whole box;
    - a thing that starts hidden behind a part of the svg (the clown in the cannon) is drawn in the svg until it comes
      out (`tFire`) and only then as a sprite (`BallAndClown`);
    - a thing that moves behind a part that stands still in front of it (the hamster wheel behind its cage's bars) takes
      that part's piece with it into a sprite on top, clipped to the thing (a disk round the wheel), while the svg leaves
      the same piece out with a clip of the opposite shape (`BarsHole`); the clip's edge lies on ink (the wheel's rim),
      so no seam shows. Laid over the veil, sprites that show more than a dot take the darkness as a colour matrix
      (`Veiled`, exactly what `NIGHT` at `dark`'s opacity does to each pixel, half-clear ones too) rather than a shade
      drawn after them. Gute Nacht's wheel, hamster, bars and cable car are such sprites only while the rope runs
      (`ropeMoving`, A-43): the middle went from 41 to 13 screens a second.
  - **A machine's parts never take the clock**: each is `still(…)` and gets only the numbers it draws (an angle, a
    glow, which lamp is on, `-1` for „none“), worked out from `t` where the level draws its machine or in a small
    `…Now` wrapper beside the part (`RobotNow`, `UfoNow`, `CountdownNow` in `SpaceLevel.tsx`), so React skips every part
    whose numbers stay the same in a frame. A glow that dies away passes its `decay` (exactly 0 at rest), a blinking lamp
    a boolean (dark while `seen` says it is off the screen), a stretch of smoke a `t` held outside the seconds it shows.
    Drawn with `t` itself, the Raketenstart's whole machine went through React in every frame while only a few
    attributes changed: 71–78 % busy on the old phone, 61–62 % once its parts were still and its flying things sprites (A-38).
    The Hatschi-Kette is drawn alike (A-44): each animal, the tree, its falling leaves and the feather are `still`,
    the tree's wobble and the leaves' fall held once they rest (`wobbleSeconds`), the feather by its numbers, never by
    the ref the level counts in; and each thing past the tree gets the second part's clock `u` only inside its spans
    (`PART2_SPANS`, `held`), between them the moment its last span ended – a new thing there gets its spans, and
    `sneezeStill.test.tsx` checks that every held moment draws exactly what the moment itself would (a span ending too
    early would freeze a thing mid-move). Tap ages pass capped at 1 s, or every part tapped once was drawn again in
    every frame. Drawn with `t` and `u` themselves, every animal and thing went through React in every frame: 56 % /
    66 % busy (script 23 / 25 %), now 43 % / 46–53 % (script 9–11 %). Props are compared one level deep, so a list of things
    that move (radio waves) is a row of `still` parts, never an array of objects. What flies or bobs on its own across
    the sky (the Raketenstart's satellite, capsule and radio waves, its UFO with its beam and the moon rock it carries),
    and what drives or turns for seconds (its moon buggy, its planet mobile), is a `Sprite` in `over` (`SkyFall`,
    `RadioWaves`, `UfoSky`, `BuggyDriving`, `MobileTurning`), drawn round its own 0,0 and moved and turned by the
    sprite, so the machine's big svg is not painted again for it; what of it never moves (the mobile's cord) stays in
    the svg, and a beam reaching from the thing down to the ground is a sprite of its own round a point above the
    ground, under the thing's sprite (`BeamLight`). Laid over the machine,
    such a thing passes in front of a crane's jib or a box it once passed behind: look at it at 844×390 and keep it only
    where that looks right.
  - Decorative flicker (the Zirkus hoop's flames) changes a few times a second (`FLICKER.steps`, a stepped `t`), not
    in every frame, and only round its moment (`seen` and a window round `tHoop`): 16 flame paths flickering in every
    frame were most of the Zirkus's 44 screens a second (now 31). The Raketenstart's blinking lamps pass only on or off
    (`blinking`) and its magnet's waves pulse in ten steps a second (`magnetPulse`), so their parts stay still between steps.
  - `bun run perf ketten-<id>` (`KETTEN_LEVELS` in `tools/perfScenarios.ts`) measures each level's first seconds and
    its middle, and a marble run its lower wall too („Unten“); run it for the level after changing what moves in it (`ketten-` runs all 21, about 15 minutes). A
    level the scenario keeps playing by keys (the Nagelbrett) must still be running at „Mitte“: at a key every 600 ms its
    twenty marbles were gone before it, and „Mitte“ measured the turn to the next level – look at its `--shots` when a
    number seems too good (A-36) Which seconds of a level a stretch measured is what its `--shots` picture shows, never worked out
    from the scenario's waits: collecting a trace between two stretches takes seconds, and the Raketenstart's „Mitte“
    lay at about 40–50 s (the UFO) while A-49 was written for 24–37 s (the capsule). `KETTEN_SCAN=1 LEVELS=<id>
    TIMES=…` then lists what still changes in the machine's svg at those seconds. `--trace` tells which layer is
    rastered how much: a tile is found by its address and layer (`tools/perfTrace.ts`), since Chrome
    reuses a tile's address in every layer – counted by address alone, the Licht-Kette's night looked like the cost
    (A-42) and the runs' start swung from 21 to 39 (A-41). `--profile` names each function with its line and column in the built chunk
    (one long line in `out/static/`), so a function of the level is found there by its column.

## Working on machines

- Everything in a machine level is a pure function of the seconds since the tap, so any moment can be
  looked at with `__machine.seek(seconds)` in the console; `/kettenreaktion/<id>/` opens that level at once, and
  the address follows „Weiter“ (`useLevelOnScreen`).
  The clock runs on after a seek, so a screenshot shows a later moment: to hold one, freeze the frames first
  (`const raf = requestAnimationFrame.bind(window); requestAnimationFrame = (cb) => raf((ts) => cb(window.__frozen ?? ts)); window.__frozen = performance.now()`),
  then seek; set `window.__frozen = undefined` to let it run again.
- The camera is never a changing `viewBox` nor a moved `<g>`: the whole world is drawn once in one svg as big as the
  world (`.marble-camera`, a layer of its own) and the camera moves and zooms that svg by a CSS transform
  (`cameraLayer` in `level.ts`), so a phone only moves a finished picture. A changing viewBox had it paint the whole
  picture again in every frame, and the marble run and the machines stuttered on phones (November 2026).
  `camera.test.ts` checks every level; `bun run perf kugelbahn maschine` measures the camera following.
- Who drives or stands in a machine is one of the app's mascots, a fox or a bear (root `CLAUDE.md`): the Baustelle's
  excavator, roller and crane have `CabDriver` (`scenery.tsx`, a head under a hard hat) at the wheel, the circus doll is
  a fox in a clown's suit, the acrobat on the circus's unicycle a bear in a striped suit, the astronaut at the rocket's
  window a bear in a white space suit (`MascotHead`, never a teddy's head of circles), and 🦊 and 🐻 look out of the
  tunnels. A new driver takes `CabDriver` rather than a person. The toys of the playrooms (the teddy at the toy car's
  wheel, the good-night teddy) stay toys.
- A machine runs 56–64 s (see How long a level lasts). It grows by new links, each set off visibly by the one before and setting off the next
  with a sound, never by stretching old moves or adding pauses; its test checks the new moments, hits and the length.
  A stretch inserted into a machine shifts everything after it by one constant amount; positions drawn as literal
  numbers rather than from the shifted ones (the Küche's `Room` windows) must then be checked by hand.
- Each machine has its own world and **no element repeats from another level**, not only from another machine: the Große
  Maschine's ten dominoes were „Alles fällt um“'s idea and became a Newton's cradle and a roly-poly penguin.
- **A link that touches the next thing gets a test of its contact**: the moment of touching is exact, and over the
  whole move (for a contact computed from geometry, an angle where two things meet: over many angles) the one never
  goes into the other nor leaves a gap (a coarse check once left a 2.7 px gap).
- What carries something (a beak, a shell, a column of water, a chair lift's chair, a bucket) is computed from the
  carried thing's own path, so the two never come apart (`Carrier` in the marble runs, `water.test.ts`).
- A thing rolling end over end (an egg) gets a rolling radius of its own, so it comes to rest lying flat, not on its tip.
- A tall thing that tips onto a handle needs the handle to be a crosswise bar that only moves down: one that followed
  the knob sideways moved into the lid's swing (the Badezimmer's cistern chain).
- Where a machine repeats one kind of thing (socks, crayons, puzzle pieces), each goes its own way in the same time
  (`SOCK_WAYS` in `tidy.ts`), never the same hop again and again.
- Whatever flies or hops stays inside the world's picture, head included – under the circus tent's scalloped edge, below
  a room's ceiling – and a test checks it.
- Something inside another thing is drawn behind its front (glass, a rim, a tunnel) while it is inside and in front
  once out (the Raketenstart's kangaroo in its dome), and something hidden in a box stays wholly below its rim until its
  moment (the Aufräum-Maschine's jack-in-the-box, tested).
- What the child taps to start is the machine's `start` spot (`StartSpot` for `MachineStage`: its middle, radius and the
  side for the hand), and the shared `TapHint` marks it as an HTML layer over the picture, placed by `cameraPoint` /
  `worldHint` (`level.ts`) from world units – never a hint drawn inside the world's svg, which a phone would paint again
  in every frame of the hint's taps. Spot and hand stay well inside the 1600 × 900 picture: a hand pointing from below at
  a thing standing on the floor is cut off on a phone on its side (the rocking horse's went to the left).
  `tidy.test.ts`, `light.test.ts` and the like check that each machine ends where it should; a new machine gets such a test.

## Klingende Kugelbahn

Level `track` (`TrackLevel.tsx`, `trackParts.tsx`, `track.ts`). Ideas N-34, X-08, K-19 (more in the K area of the ideas page).

A wooden marble run down a wall 1600 × 3700 (`TRACK_W`/`TRACK_H`, about four screens; 2250 until 22 November 2026). One tap or key opens the hopper,
and six marbles come out one after the other. Each rolls over a xylophone, through six spots (bell, paddle wheel, funnel,
trampoline, bell, funnel by default), passes under the barrier, rides the seesaw, goes through the tunnel, takes the switch's way
(zigzag down past bumpers, or the left way over its own xylophone), loops the loop,
hops over three drums, knocks five chimes and plays a whole scale on the second xylophone; then it runs the wooden run's lower wall (helix tower, step lifter,
tipping troughs, see Every run's lower wall) and drops into the basket.
A full basket raises the flag and ends the level (the round arrow / the next level's picture; any key goes on). Each tap
or key lets out one thing, and nothing leaves the shelf by itself (25 November 2026; from 24 November until then the
shelf let out the next every two seconds): once nothing is on the run, the camera goes back up to the shelf after
`LOOK_UP_AFTER_MS`, quietly, and the hint marks the next thing to tap. A first marble alone takes about 46 s, a round
about 62 s when the child lets out the next thing every two seconds, once the one before has played its line of the song. Tapping a spot swaps its part (bell, trampoline, funnel, paddle wheel), always.
On a computer a yellow space-bar button sits at the bottom in the middle, and Space rebuilds the run to the next
of all its builds, counting like a car's mileage: the first spot takes its next part, and each time it is back at the first
part the next spot moves on too (`rebuildNext`).

„Kugel-Lied“ (K-11, `song.ts`, in every world of the run): the eight bars of row 1 – four on 1a, four on 1b after the
first spot – play a song, one line per thing: the first thing to reach bar 0 takes line 1, the next line 2, and so on
round the song (`singBar`). Each bar strikes the line's next beat (`songBeat`): a note that rings on through the held
beats after it, or on a held beat only the bar lights up. Over those bars a thing rolls at the even `SONG_SPEED` (times
its `pace`), so the beat is steady at a little under a quarter of a second (rolling downhill it was 0.15 s, too fast for
a tune); the iron ball plays its line two octaves deeper and slower, the tennis ball still hops. A thing let out once the one
before has struck bar `SONG_HANDOVER` starts its line on the beat after the last one ends (let out every two seconds,
lines sounded half into each other); since each thing waits for its own tap (see the top), a child tapping fast hears
lines overlap – that is the child's play, never held back. When the song's last line is through,
every part of the run sways, swings or flashes once at the same moment with a soft twinkle (`dance`), nothing rising.
German children hear „Alle meine Entchen“ (five lines), every other app language „Twinkle, Twinkle, Little Star“ (six
lines; 小星星, „Estrellita“, the alphabet song), both traditional tunes; a tap on a bar still plays the bar's own note.
- A song's line has exactly eight beats, one per bar, and starts on a note (`song.test.ts`); a new song for a language
  goes into `songFor`, written in the eight-beat grid with `null` for held beats.
- Anything that slows row 1 or changes what lies between the shelf and bar 0 changes when the next line comes: check it
  in `track.test.ts`, whose round must stay 55–65 s.

„Was rollt denn da?“ (K-07, always on): a shelf over the first row holds
three of five things (marble, tennis ball, iron ball, apple, soap bubble; `ROLLER` in `track.ts`); tapping one flies it into
the hopper and something else pops up in its place, a key or a tap on the wall takes them in turn. On a computer the keys
1, 2 and 3 hang under the shelf and let out the thing in that place (`ShelfKeys`). A sunny glow behind each place
marks the three things as what to tap, and before the first one the `TapHint` marks the last thing, its hand on the free wall to its right (above, it left a phone's screen; below, it covered row 1's xylophone).
Once the camera has followed the things down, a round yellow ⬆ button in the bottom left corner (or the up arrow key)
takes it back up to the shelf, where it stays, with the hint again, until the next thing is let out; from then on it follows
only the things let out since, not the ones further down. Each rolls its own way on
the same route: the tennis ball hops along the rows, the iron ball is slow with deep notes and thumps, the apple bumps, the
soap bubble floats at an even speed and bursts above the basket instead of landing (so it doesn't fill it).

„Schranke und Stau“ (K-02): on row 2, just before the funnel (the default build keeps the funnel in the spot after it),
a red-and-white arm hangs from a round green sign with a tick (`GATE`, `Gate`). It always stays up, so nothing waits behind it
(24 November 2026; until then things queued there until the child tapped „Achtung, fertig – los!“); a tap or Enter / ↓
wobbles it and rings its bell.

„Weichen umlegen“ (K-01): at the end of row 3 a switch (`SWITCH`, `Switch`): a yellow flap on a hinge and a thick lever with a
red knob that leans the way the marble will go. Lifted, the marble rolls on into the zigzag down the right edge; hanging
down, it knocks against the flap and drops onto the left way (`LEFT1` with four bars of its own, the left wall, `LEFT2`, and
against the zigzag's wall from the other side), and both ways meet on row 4 at `JOIN`. A tap on the switch flips it, „klack“
(← and → set it); a marble takes the way the switch is set to when it gets there, so flipping it while one rolls up
changes where it goes. It also flips by itself after each marble, so the next takes the other way.

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
  the layers they are drawn in, and the camera (`Run`). `trackParts.tsx`: the drawn parts of the wall (spots, shelf,
  xylophones, switch, barrier, looping, drums, chimes, tunnel, `still`) and the wooden world `WOODEN`. The camera follows
  the marbles down: on a tall screen it shows more of the wall (up to all of it), before the tap the hopper, after the last
  marble the basket.
- The camera may go `TOP_ROOM` above the wall's top, so the shelf and the hopper sit clear of the top edge and the ✕.
  Never put what the child taps right at the wall's top edge: on a phone on its side the picture is cut there.
- A pointing hand or glow added for a new tap target sits beside it, not over another part (the bars, a spot): check it
  next to its neighbours in the preview: a finger above the barrier once covered row 1's xylophone.
- **The run is drawn in layers** (A-29, perf November 2026: 47–58 screens/s rastered while the camera followed, limit 30): the
  still wall is one big svg whose parts are `still(…)` (`trackParts.tsx`, a `memo` that compares props by content and ignores handlers; ages
  are held at `SETTLED_S`, so a part nobody hit stops changing), each rolling thing is a small svg layer of its own moved by a
  `translate3d` (`.run-marble`, `MARBLE_PAD`), and what lies in front of them is a second big svg. Never draw a moving thing
  inside the big svg (the whole svg is painted again), and a new part with a wobble or flash takes its age as a prop,
  never `t`. `bun run perf kugelbahn` checks it (now about 20 screens/s).
  **A part that moves or lights up is a `Piece`** (`trackPieces.tsx`; user feedback, 26 November 2026: the Weltraumbahn
  still stuttered on a gaming phone while things circled its planet): it is drawn in world units like the rest, but lands
  as a small layer of its own in the run's HTML layer, behind (`back`) or in front of (`front`) the rolling things, and a
  turn (rocking, spinning, popping up) is a CSS transform of that layer (`turn`: `deg` and `scale`, `dx`/`dy` to lift or
  bob it, `sy` to squash a turning thing seen at a slant into its ellipse), and a flash coming and going is its `fade`,
  so its drawing stays the same from frame to frame – draw it still (`memo`) and turn it whole, and cut it with `clip`
  where only part of it lies in front (the planet's far side) or where it runs in a frame (the elevator's chain, drawn
  one link longer than its frame and moved by `dy`). What bends or flies apart (a plank sagging, a puff of snow, drops)
  can't be turned whole: it is a piece too, whose small layer alone is painted again, and one that comes and goes is
  only mounted while it shows. The xylophone bars, the paddle wheel and every world's lower wall that moves are pieces
  (A-40, 26 November 2026: the helix's discs, the lifter's slats and the troughs; the colour run's bells and the
  rainbow's flash; the chair lift's wheels and the puffs; the whirlpool's swirl, the diving board and the drops; the
  planks, the chain, its wheels and buckets and the funnels); the backdrop pattern is an svg of its own under the wall,
  drawn once. A piece lies over the whole wall svg (or under the whole front svg), so make only what nothing on the wall
  must cover into one, and where a still part of the wall lay over a moving one (the waiting bucket over the elevator's
  wheel), that still part becomes a piece too, after it. **A piece is a layer only while it moves**: pass `rest` while
  it lies still, and it is drawn inline in the wall's svg like the rest – every layer costs the compositor in every
  frame, still or off the screen (A-40: the building site's 26 pieces, all layers for good, kept the run's top a tenth
  busier, far away from them). But each switch between wall and layer paints the whole wall again, so parts a thing
  hits one after the other switch together: a stretch's pieces rest while none of its cues stirs
  (`rest={!anyStirring(ages)}`), a xylophone row's bars while none of its bars dips – one bar at a time made a marble
  rolling over a row paint the wall twice per bar (A-40, a first try with each part on its own rastered 22–24 screens a
  second where a stretch was busy). Parts that overlap (the funnels hanging into the next) keep their order that way
  too. A piece only mounted while it shows (puffs, drops, the rainbow's flash) needs no `rest`; `trackPieces.test.ts`
  fails on a piece with neither. A piece is a portal, and React sends a portal's events up
  through the tree it was written in: never put it inside a `data-tap` group, or one tap sets its cue off twice – give
  the piece its own `data-tap` beside the group. The parts the first rows hit are pieces while they stir (A-41, 26
  November 2026): the spots' bell (swinging round its hook) and funnel (shaking by `scale`), the walls' bumpers and the
  seesaw's plank – each a wobble or glide that painted the whole wall in every frame of the run's start. A wobble's
  piece rests once the wobble is exactly 0, `wobbleSeconds(damp)` after the hit (`level.ts`), never at a guessed
  number of seconds, or it switches back to the wall while still moving and the wall paints again. A wobbling part
  still drawn in the big svg costs about 100 ms of painting a second on the old phone while it moves: turn it into a
  piece when `bun run perf ketten-<run>` finds its stretch over.
- `track.css`: its styles (classes `run-`). While it is on, the background music is off (the run
  plays its own notes and scales).
- Shared with the machines: `path.ts` (line, quad, arc), `parts.tsx` (Ball, Rail, BAR_COLORS) and `level.ts` (useFrames,
  useAnyKey, wobble).

To look at the whole wall at once, make the browser window tall and narrow (e.g. 640 × 900).

## Bahnen mit Thema (K-18)

Four more marble runs follow the wooden one, each its own card and level: the same wall, route, spots, shelf, keys and
camera (`Run` in `TrackLevel.tsx`), only drawn in another world, with other things on the shelf, a lower wall of its
own (see Every run's lower wall) and another end.
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
`fullAge` and `tapAge`). `TrackLook` hands it to every drawing in the run; the wooden run is `WOODEN` in `trackParts.tsx`.
- A new world is a new file with a `TrackTheme`, a `MarbleLevel`, a `LEVELS` entry, `LEVEL_TEXTS`, its own lower
  stretch in `STRETCHES` and `RUNS` in `catalog.ts` (no background music). Give it five things that look different from every other world's, and
  an end that does something of its own when full – never the wooden basket and flag again.
- Their names, first lines and the line when full (`full` in each world's `TrackTheme`) speak every language, like
  everything shared with the wooden run. The tunnel's colour-changing magic is the wooden run's only
  (`magic`); the other worlds keep each thing's own look.
- `trackTheme.test.ts` checks each world's level, its texts, the tunnel animals and that its landing spots stay on the wall.

## Farbenbahn (K-10)

„Farbenbahn“ (`colorTrack.tsx`, numbers and lines in `colors.ts`, `colortrack`, second card after the wooden run): a world
of the same run (`TrackTheme.sort`) where the shelf always holds a red, a yellow and a blue marble – the one taken pops up
again – so the child picks each marble's colour instead of a thing. At the end, where the basket would be, three glass
tubes stand on a stand, each with its colour as a ring at the rim and a dot on the stand. A marble hops off the last row
in an arc to above the tube of its colour and drops straight in (`hop`), a note one step higher for each marble already
there (`playCountNote`), and the voice counts „Eine rote!“ … „Fünf rote!“ (`countLine`; said with `say(line, false)`, so
a newer count cuts off the one before and the voice never lags behind the tubes). The first tube with `TUBE_FULL` marbles
is the end: it glows in its colour (nothing rises: the level's trophy at the end replaced that, user decision, November 2026), „Die Röhre ist
voll!“, and the level is done. Marbles still on the way pile up out of their tube's top. No tunnel magic here (it would
change a marble's colour).
- Nothing can be wrong: every colour has its tube, and any tube full ends the run.
- The tubes stand `TUBES.bottom` well above the wall's lower edge: at its very edge the bottom marbles were cut off by
  the frame on a tablet, and the stand in front must not cover the lowest marble either.
- Its texts stand in all seven languages (translated 19 November 2026; the counting lines per language in `COUNTS`, each
  with its own agreement of number and colour), recorded only in German so far (`languageStatus.ts`, „🎨 Farbenbahn“);
  where a recording is missing only the notes count. `trackTheme.test.ts` checks the tubes, the counting and the hop.

## Every run's lower wall (22 November 2026)

The wall is 1600 × 3700 (`TRACK_H`, was 2250), so a round lasts about a minute (55–65 s, simulated in `track.test.ts`).
Rows 1–9 with shelf, barrier, switch, spots and second xylophone are the same in every world. After row 9 each world
runs a lower stretch of its own, built in `trackStretches.ts` (`STRETCHES`) from a short row and the right wall and
passed to `buildRoutes(stretch)`. Each section fires numbered cues, which the world's theme draws and sounds
(`TrackTheme.StretchArt` in a back and a front layer, `cue`, and `Carrier` for a thing riding in a chair or bucket);
tapping a section's drawing sets it off too.
- Wooden run (`track`): a helix tower four times round a pole (a higher note each round, a disc bobs); a step lifter
  whose eleven slats lift each thing up a staircase with rising notes; six tipping troughs zigzag down the right edge
  with a clonk each, the last into the basket.
- Farbenbahn (`colortrack`): three arches, red, yellow and blue, each with a little bell that swings and plinks; a
  striped ramp up over a three-band rainbow that flashes with a trill between two clouds; three more arches; three rows
  to the colour tubes.
- Schneebahn (`snowtrack`): an icy inrun on a wooden scaffold, the ski jump's lip with a whoosh and a puff of snow, the
  landing hill; a chair lift with red stations and turning wheels carries each one up in a chair while it hums; two
  steep banked bobsleigh curves to the snowman.
- Weltraumbahn (`spacetrack`): a dotted orbit once round a big striped planet with a friendly face, and a quarter more
  to come off on its near side (behind it on the far side), a higher note each round while the planet rocks; a
  wormhole's swirl swallows each thing and a second one far below pops it out; rows to the moon. **Once round only**
  (user request, 26 November 2026: twice and a quarter was too long, and it stuttered on a gaming phone there) – never
  more laps again (`ORBIT.laps`, `trackStretches.test.ts`); the round stays within 55–65 s without them.
- Wasserrutsche (`slidetrack`): a wave slide with four humps, splashing; a diving board that bends and boings; a
  whirlpool basin seen from above, circling two and a quarter times inward behind its see-through wall; the drain glugs
  each thing down a glass pipe; a second wave slide with three humps to the pool.
- Baustellen-Bahn (`sitetrack`): three conveyor belts zigzag; eight scaffold planks as a stair, each bending with a
  knock; a bucket elevator whirs each thing up (about 5.8 s) and tips it with a clonk onto a belt; a rubble chute of
  seven hanging funnels swinging and knocking into the skip.

Rules:
- Each world's lower wall is its own (`trackTheme.test.ts` requires them distinct), and a new world gets one.
- A theme's backdrop and end are placed relative to `TRACK_H`, never at a fixed y, so the wall can grow again.
- What a thing passes through is drawn in two layers – what it goes into at the back, its near rim in front; a thing
  riding along uses `carry` and `Carrier`, a thing shrinking into the distance `scale`.
- `bun run perf ketten-<run>` measures each run's top („Anfang“, „Mitte“) and its lower wall („Unten“, added 26 November
  2026 after the planet's stutter, which no stretch had caught); `bun run perf kugelbahn` still measures only the top
  12 s of the wooden run. A heavy new section further down shows in „Unten“; look at its `--shots` too, since the
  camera has gone back up to the shelf by the end of it.
