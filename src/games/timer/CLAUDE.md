# Timer

Route `/timer/` · idea H-04 („Timer zum Zuschauen“). A book of its own among the Alltagshelfer on the shelf once it is finished. While it is being built (`unfinished` in `games.ts`, user decision, November 2026) it is not on the shelf, only linked from `/management/`, and its way back leads there.

A visual timer for the day, not a game: a grown-up picks the length in the row above the cards („Wie lange?“: 10 or 30
Sek., 1, 2, 3, 5 or 10 Min., `TIMER_SECONDS`, kept as `seconds`; the seconds asked for by the user, November 2026) and a picture card starts it. Behind them „Andere …“ opens a sheet for grown-ups
(`OwnTimeSheet`, H-59, H-60): any length from 10 seconds to 3 hours (− and + for hours, minutes and seconds, ready slips
for 15 to 60 minutes, typed on a computer), or „Bis um“ a clock time to end at. The time set there stays as a slip of its
own in the row (`own`, `useOwn`) until another comes. Held ⚙️ while it runs shows the time left in digits for
grown-ups (`TimeLeft`, H-62). Every timer shows the time left in the picture's bottom right corner on a small paper
note, as tally marks in bundles of five that go one by one (`shown.tsx`, kept as `showTime`; user request, November
2026): by default „Striche in %“, ten marks each a tenth of the run (`PERCENT_MARKS`), so a short and a long timer look
alike; behind ⚙️ its „Zeit im Bild“ switches to „Striche in Zeit“ (each mark 10 s up to 15 min, `markUnit`, at most
`MAX_MARKS`), „Zahlen“ (digits) or „Aus“. The child sees no numbers, only the picture and the marks running down.
The start screen shows „Abwechseln“ first, its card saying „Läuft ohne Ende, jeder ist mal dran“ under its name where
there is room (`SWAP_NOTE`, `GameMode.note`; groups with a line over each, tried first, no longer fitted a phone's
screen), then the pictures that run until the time is up:
- „Zug zum Bahnhof“ 🚂: a little train rolls along a long track, from the little house at the left nearly across the
  picture, to the station with its clock, big red and white buffers and a chequered flag at the track's end (the goal,
  seen from the start). From 2 minutes on a post with a bell stands by the track for every minute (`TrainStops`, at most `MAX_STOPS`); the train
  halts there briefly and it chimes (H-45), with keyframes made for the run (`TrainStepKeyframes`, `--tm-roll`).
- „Apfelbaum“ 🍎 (`apples.tsx`, H-45): an apple tree's year (`appleTimes`, `APPLE_YEAR`; user feedback, November
  2026: show more progress). The tree grows from a sapling a step a second (until 15 % of the time), blossoms open all
  over it (`bloomRank`, until 30 %) while three bees buzz round it from then on (`BEES`, each a small layer, its wings a
  smaller one), each blossom drops as a small green apple swells and reddens at its place (until 45 %), then the bear
  child pushes its little cart from the right under one apple after the other (`CartKeyframes`, written for the run,
  the wheels turning with it); the apple sways a second at a time while the cart comes, falls straight down into it with
  a plop (spaced, `PIECE_SOUND_GAP_MS`) and lies there on its own in the heap (`heapSlot`, `HEAP_ROWS`). Always many
  apples, also for a short time (`appleCount`, `MIN_APPLES` to `MAX_APPLES`, as many as the heap holds); the last lands
  as the time is up. A tap rustles the leaves, once the blossoms are out the bees buzz.
- „Sanduhr“ ⏳: a tall hourglass (`GLASS`, about two thirds of the picture's height), the sand runs in a thin stream
  from the top bulb into the bottom one, where its heap rises with a round top (`BulbSand`, shared with Abwechseln).
- „Raupe“ 🐛 (`caterpillar.tsx`, H-46): a caterpillar eats a big leaf from the tip to the stalk, one bite each second
  (`runSeconds`, `useBites`). The leaf is cut in six bands (`BANDS`), each eaten from the leaf's outline at the tip to
  its outline at the stalk, so every bite takes leaf and what is left still looks like a leaf; the bites go down the
  edge and back up (`BITE_ORDER`), and the head goes to each spot before it bites it off (`biteSpot`), its neck
  stretching after it from the body crawling back along the midrib (`bodyFront`, never further than `REACH`), and three
  leaf crumbs fall from the spot bitten (`CRUMBS`). At the end the cocoon hangs on the branch, wiggles and bursts open,
  and the butterfly slips out and flies back and forth in the air above the meadow, bobbing, as long as the end is shown
  (`BUTTERFLY`, user request, November 2026).
- „Blume“ 🌸 (`flower.tsx`, H-53): the bear child waters a sprout in the flower bed with a garden hose coming from a
  tap on a post (`TAP`; a can that never ran dry made no sense, user feedback, November 2026), a drop from its nozzle
  every second; the stalk slides up out of the soil, pushing soil crumbs aside each second (`SoilCrumbs`), along a tall
  stake to the red ribbon at its top (the goal, seen from the start), grown at `GROWN_AT` of the time; then its petals
  open one after the other (`PETALS`), the yellow middle last. It fills up instead of running out, for waiting for
  something good.
- „Kerze“ 🕯️: three tall candles on the table burn down one after the other (`CANDLE.xs`, each a third of the time,
  `--tm-i`/`--tm-of`), each burning all the way down into its puddle and only then going out, its smoke (`Smoke`: a
  wisp curling up, soft puffs rising one after another) lingering for several seconds as the next lights; at the end the bear child leans over and blows
  the last one out.
- „Sonnenuntergang“ 🌅 (`sunset.tsx`, H-54): for the time before bed – one round hill over the whole picture, a big sun
  sinking behind it and reddening (gone at `SUN_SET_AT`), the evening's and the night's sky fade in, the land darkens,
  and once the sun is down the moon rises from behind the hill (`MOON_FROM`); the stars come out one by one (`STARS`,
  each at its share of the time), the windows of the little house light up. Every
  second the windmill's sails turn a step. At the end the house's windows are lit and the moon stands high.
- „Ameisenstraße“ 🐜 (H-68): a big cookie lies on a picnic blanket at the left, an anthill far off at the right; ants march from under the
  cookie to the hill, each with a crumb, the cookie shrinks and the hill grows. At the end the ants sit on the hill, the
  last crumbs lie on the blanket.
- „Rote Scheibe“ 🔴 (`disc.tsx`, H-47): the red disc Kitas know from the „Time Timer“, shrinking like a clock's hand goes
  round on a plain white face; the knob in the middle turns a petal each second.
  A ladybug crawls round the face's rim about once a minute, like a second hand, and a dot comes outside the rim each
  time it is back at the top, clockwise from 12 o'clock with a plink (H-67, `ladybugLaps`: the rounds fit the time
  exactly; beyond 30 minutes a dot every second or third round, so they go round once at most, `MAX_DOTS`).
- „Pizza“ 🍕 (`pizza.tsx`, H-47's children's way): 24 slices on a wooden board, one lifted off towards its side at each
  24th of the time from 12 o'clock round, with a munch (spaced) (`SLICES`, `pieceMoments`); a little steam rises every second.
  Each slice is a small layer cut to its wedge by a still `clip-path`, so a tap lights exactly the slices left.
- „Abwechseln“ 🔁 (H-52): two children take turns with a toy. The time set is one turn: the toy lies by the fox child
  while the hourglass runs, then it travels over to the bear child with a whoosh and a chime, and the hourglass turns
  itself over – back and forth until a grown-up leaves with ✕ (with „bis um“ set, until then, each turn as long as the
  row's minutes). Behind ⚙️: the toy (Bobbycar, Puppe, Ball, `SWAP_TOYS`, kept as `toy`), „Wer ist dran?“ (starts that
  child's turn anew, for who begins) and the time to the change. The turn is worked out from the clock (`turnAt`).
  At the end the picture's own sound, then children cheer (the `cheer` recording) while a warm light spreads over the
  picture (`.tm-done-light`) and a few hearts, stars and notes rise slowly (`celebrate`), a friendly tune after it (and
  the child, where there is one, waves and hops), then `GameEnd` with „Nochmal“ and „Weiter“ (the next picture,
  the same minutes, `nextPicture`). Every tap or key during the run answers (steam and a whistle, twinkling, the flame
  flaring) with a warm light where it was, and what is still left lights up softly for a moment (H-51, „Wie lange
  noch?“: the rail to the station, the sand on top, the wax, the cookie – `LeftGlow`, inside the shrinking part so it is
  exactly as big as what is left); nothing has to be tapped, so there is no glow before it or pointing hand.

Every picture moves a small, soft step every second, so even an hour never looks stuck (H-63): the train's wheels turn
once and a puff rises, the sand pours through the hourglass's neck, a drop of wax runs a little further. And each
shows where it comes from and where it goes (H-64): the train sets off from a little house and the rail ahead shines
while the rail behind is dark, the hourglass's bottom heap grows, the wax that ran down spreads on the holder.
Gleich ist es so weit (H-49): a minute before the end, or in the last fifth of a short time (`soonMs`), a bell rings
once and the child, where there is one, waves once (`tm-soon`), and a picture stepped back from afar comes bright again for it.
Seen from afar (H-48): eight seconds after the last tap the backdrop (`.tm-back`), the child and small things
(`.tm-dims`) fade into the dark and only what runs down stays bright; a tap brings it all back (`tm-far`).

Files: `TimerGame.tsx` (start screen: cards, minutes and the own time's slip), `OwnTimeSheet.tsx` (the sheet behind
„Andere …“), `time.ts` (own times: typing, clock times, labels, digits; tested in `time.test.ts`), `TimerPlay.tsx` (one
run: working out its length, the question when a clock time is past, the clock, the phases `running` →
`blow` (candle only) → `done`, taps, the end, the sounds of the pieces), `pieces.ts` (how a run is cut into pieces, the
train's halts, where the apples hang; tested), `SwapPlay.tsx` and `swap.tsx` („Abwechseln“: its turns, and its room,
hourglass and toys), `apples.tsx`, `caterpillar.tsx`, `disc.tsx`, `flower.tsx`, `sunset.tsx`, `pizza.tsx` (one picture each), `shown.tsx`
(„Zeit im Bild“: its choice, the note with digits or tally marks), `scenes.tsx` (the other drawings
and the shared `Layer`, `Draw`, `Child`, `LeftGlow`; the fox and bear child is the shared `Mascot`), `timer.css`, `content.ts`
(names, order), `settings.ts`.

## Rules

- The row of lengths stays one line on a phone on its side (844×390), with the own time's slip too: when it wraps, the
  last row of cards falls off the screen. A new length means narrower slips (`.tm-lengths`), never a second line.
- **Progress is seen every second** (user feedback, November 2026): every picture moves a step a second that a child
  can see from the sofa – a bite, a crumb, an apple, a slice – not only a tiny wobble. Pieces come many, also for a
  short time (they come more often then, never fewer), the way to go is long (the train across the picture, the ants'
  road, the stalk nearly to the top), and a goal shows from the start (the flag, the ribbon). What is cut into pieces
  over the time gets enough of them (24 slices, three candles one after the other, petals opening after the stalk has
  grown). Many pieces mean many moments: their sounds are spaced (`PIECE_SOUND_GAP_MS`), never a din.
- **The end is plain to see and hear**: the picture's own last step, then children cheering, a warm light over the
  picture and the calm `celebrate` – for every picture, Abwechseln's clock time too. Never a storm of confetti.
- **A picture makes sense as it is**: where something comes from and why it happens is plain (the water from a tap and a
  hose, never an endless can; no boat in a bucket, no flower opening for no reason – Eimer and Kuchen were taken out,
  user feedback, November 2026). A new picture is one whole small story a child knows from life.
- **What runs out runs out wholly before it ends** (user feedback, November 2026): a candle burns down to its puddle
  before its flame goes out (`CANDLE.stub` a thin rim, the going out after its turn, never before), and what follows
  an ending (the smoke) lingers slow and soft for seconds, never a puff gone at once. `timer.test.ts` checks the candle.
- **What happens, happens as in life** (user feedback on the Apfelbaum, November 2026): things fall straight down,
  never across to where they are wanted – what catches them comes under them first (the cart under the apple). What is
  collected stays to be seen one by one (each apple on its own in the heap, never a lump that grows: a rising heap in a
  basket held at the chest looked like something else entirely), and a picture that runs a long while tells a whole
  story in stages (the tree grows, blossoms, bears apples, is harvested), so there is always something new to see.
- **Abwechseln stands first, apart**: it runs without end, so its card comes first and says so (`SWAP_NOTE`), and
  „Weiter“ never leads into it (`TIMED_PICTURES`, `nextPicture`).

- **A fox or bear child only where it does the picture's thing** (`Child`): it pushes the apples' cart, waters the
  flower, blows out the candle, takes its turn with the toy. Never a family standing by to watch or cheer: one stood
  beside every picture and was taken out (user feedback, November 2026) – children wanted to tap it, and a timer to
  watch needs as few things and movements as can be.

- **A tool, not a game** (`GameShell tool`, `/timer` in `PlaytimeLock`): it counts no play time, never says good night
  and still runs when play time is over – „noch fünf Minuten spielen“ is about the real world. Its „Nochmal“ and
  „Weiter“ count no game either (`useCountsPlaytime`).
- **Real minutes**: the end is `Date.now()` past `endsAt`, checked every second and again when the page comes back, so
  a phone that slept in between still ends on time; the screen is kept on while it runs (`useWakeLock`). At the end the
  CSS snaps every moving part to its last place (`.tm-done`), whatever the animation's clock says.
- **Phones keep up**: everything that moves is an HTML layer of its own (`Layer`), moved by one CSS animation as long
  as the timer (`--tm-ms` on the stage), never React drawing per frame; the backdrops are `memo` and drawn once. The
  stage is 1600 × 900 covering the screen: keep what matters within x 200–1400 and y 80–820, and a figure's right edge within 1340 – the book's paper margin and the ⚙️ note lie over the right edge, and a fox standing to 1380 was cut
  off there (`RIGHT` in `timer.test.ts`).
- **A clock time behind us is never quietly tomorrow's** (H-60): the sheet asks „Bis morgen um …?“ and keeps the answer
  for that day only (`tomorrowFrom`); a kept „bis 17:30“ started after 17:30 asks again before it runs (`TimerStart`).
  Numbers are for grown-ups: in the row, the sheet and behind ⚙️; in the picture only when a grown-up chose „Zeit im
  Bild“ there (off by default, user request, November 2026), small in the bottom left corner, letting taps through.
- **Every second a small step, never a blink** (H-63): what beats once a second is a small layer of its own (`.tm-beat`)
  moving by `transform` and `opacity` – the wheels are small layers riding in the train's, not groups in its svg – and
  stands still at the end (`.tm-done`). Anything new that moves the whole run long snaps to its last place there too.
  A row of things walking in step (the ants) is a small layer per thing, all one keyframe walk a second apart
  (`tm-march`, one keyframe per step, `ANTS.n` of them – `timer.test.ts` checks), never one strip of them moved inside
  a bigger layer.
- **Only what runs and where it goes** (user feedback, November 2026): the hourglass shows the sand still to run and
  the heap below, nothing else – no film or grains on the glass the sand has left, no grain or disc over the stream at
  the neck (both were taken out: they looked odd). A trace of what is over (H-64) is only drawn where it is plainly a
  thing of its own (the dark rail, the wax puddle), never a pale copy of what was there.
- **No `clip-path` round what is in view while the page turns**: a turning page is a picture of the app (view
  transition), and in it the clip-path round a moving layer dropped out – the hourglass's sand showed as a square
  before it began (user feedback, November 2026). A shape something moves inside is a still drawing of that shape in a
  window with `overflow: hidden`: the window slides, the drawing in it slides back the same way and stays put, both by
  `transform` (`BulbSand`, `bulbBelow`; `timer.test.ts` checks). A still clip-path is fine where nothing it cuts shows
  as the page turns, or on a light mounted only after a tap.
- **What a tap lights is what is left** (H-51): a glow inside the part that shrinks, never a sign or a number, and once
  per tap, fading – never blinking. A new picture puts `LeftGlow` into its own shrinking part; in a picture that grows
  (the flower) that is the way still to go (`StillToGrow`, a box over the stake whose lower end rises with the bud).
- **What sinks or grows behind an edge moves in a box cut off there** (`.tm-sky-box`, `overflow: hidden`): the sun and the
  moon behind the hills' ridge, the stalk out of the soil – the cut lies below what covers it everywhere the thing
  passes (`SKY_CUT` under the ridge, `timer.test.ts` checks), so it never shows, and the thing is never stretched.
  Where the edge is slanted, the box also gets a still `clip-path` to its shape – never an
  animated one, which repaints the box every frame.
- **Pieces wait on their own clock, not on React**: an apple's blossom, growing and fall are CSS animations with their
  moments as `animation-delay`, each apple in the cart appears at its landing, the cart's way and the train's halts are
  keyframes written once for the run. React
  only plays the plop or bell at those moments (`pieceMoments`), never draws a piece per minute. The one exception is
  the caterpillar, whose head must know where the next bite is: there the bites are counted from the clock once a
  second (`useBites`) and the bands, head, neck and body are set by a style change a second, the figure gliding by a
  CSS transition – small layers, a change a second, never per frame, and the leaf's drawing `memo` so it is never drawn
  again (`bun run perf timer-raupe`).
- **What takes a piece goes to it first** (user request, November 2026): the caterpillar's head moves to each spot of
  the leaf before that spot goes, and bites it off there – never a head chewing in one place while the leaf goes
  somewhere else. A new picture where someone eats, picks or carries pieces does the same.
- **Seen from afar only what runs down stays bright** (H-48): a new picture puts its backdrop in `.tm-back` and its
  small helpers (posts, decorations) in `.tm-dims`; what runs down gets neither. A clipped edge drawn in the background's
  colour would show once that fades – cut edges with clipping boxes instead (the leaf's bands, the disc's halves).
- Development: `?sekunden=<n>` in the address makes a run take n seconds instead of the minutes chosen; the
  pieces still come from the minutes chosen (2 Min. with `?sekunden=25`: twenty apples, its whole year in 25 seconds).
- It says nothing, so there is no voice line to record.
- Its ideas are the area „Timer“ on `/management/` (`src/content/ideas/h-timer.ts`, H numbers shared with the
  Alltagshelfer): any time to set (H-59 to H-62), pictures that visibly change every second and show where they go,
  also over long times (H-45, H-63 to H-69), and new pictures. A new timer idea goes there, not into the Alltagshelfer.
