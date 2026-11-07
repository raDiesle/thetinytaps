# Timer

Route `/timer/` · idea H-04 („Timer zum Zuschauen“). A book of its own among the Alltagshelfer on the shelf once it is finished. While it is being built (`unfinished` in `games.ts`, user decision, November 2026) it is not on the shelf, only linked from `/management/`, and its way back leads there.

A visual timer for the day, not a game: a grown-up picks the minutes in the row above the cards („Wie lange?“: 1, 2, 3,
5 or 10 Min., `TIMER_MINUTES`) and a picture card starts it. Behind them „Andere …“ opens a sheet for grown-ups
(`OwnTimeSheet`, H-59, H-60): any length from 10 seconds to 3 hours (− and + for hours, minutes and seconds, ready slips
for 15 to 60 minutes, typed on a computer), or „Bis um“ a clock time to end at. The time set there stays as a slip of its
own in the row (`own`, `useOwn`) until another comes. Held ⚙️ while it runs shows the time left in digits for
grown-ups (`TimeLeft`, H-62). The child sees no numbers, only the picture running down:
- „Zug zum Bahnhof“ 🚂: a little train rolls along the track to the buffers at the station.
  From 2 minutes on a post with a bell stands by the track for every minute (`TrainStops`, at most `MAX_STOPS`); the train
  halts there briefly and it chimes (H-45), with keyframes made for the run (`TrainStepKeyframes`, `--tm-roll`).
- „Apfelbaum“ 🍎 (`apples.tsx`, H-45): as many apples as minutes (at most `MAX_APPLES`), one falling a minute with a
  plop into the basket the bear child holds; the heap in it rises a step per apple, the next apple sways each second.
- „Sanduhr“ ⏳: the sand runs from the top bulb into the bottom one.
- „Raupe“ 🐛 (`caterpillar.tsx`, H-46): a caterpillar eats a big leaf from the tip to the stalk, its head chewing each
  second; at the end a cocoon hangs on the branch and a butterfly flies out and settles on the meadow.
- „Blume“ 🌸 (`flower.tsx`, H-53): the bear child waters a sprout in the flower bed, a drop from its can every second;
  the stalk slides up out of the soil along a stake to the red ribbon at its top (the goal, seen from the start), and at
  the end the flower opens. It fills up instead of running out, for waiting for something good.
- „Eimer“ 🪣 (`bucket.tsx`, H-69): in the same garden a watering can hangs from a post over a clear bucket, a drop
  falling every second and a ring spreading on the water; the water rises to a red line, where a little wooden boat
  already hangs waiting on a string from a stick over the bucket (its keel a little under the line). At the end it
  floats and rocks and the flower in the pot beside the bucket opens.
- „Kerze“ 🕯️: a candle burns down on the table; at the end the bear child leans over and blows it out.
- „Sonnenuntergang“ 🌅 (`sunset.tsx`, H-54): for the time before bed – the sun sinks behind the hills and reddens, the
  evening's and the night's sky fade in, the land darkens, the stars come out one by one (`STARS`, each at its share of
  the time), the windows of the little house light up; the moon peeks over the hill from the start and rises. Every
  second the windmill's sails turn a step. At the end the house's windows are lit and the moon stands high.
- „Ameisenstraße“ 🐜 (H-68): a big cookie lies on a picnic blanket, an anthill beside it; ants march from under the
  cookie to the hill, each with a crumb, the cookie shrinks and the hill grows. At the end the ants sit on the hill, the
  last crumbs lie on the blanket.
- „Rote Scheibe“ 🔴 (`disc.tsx`, H-47): the red disc Kitas know from the „Time Timer“, shrinking like a clock's hand goes
  round on a plain white face; the knob in the middle turns a petal each second.
  A ladybug crawls round the face's rim about once a minute, like a second hand, and a dot comes outside the rim each
  time it is back at the top, clockwise from 12 o'clock with a plink (H-67, `ladybugLaps`: the rounds fit the time
  exactly; beyond 30 minutes a dot every second or third round, so they go round once at most, `MAX_DOTS`).
- „Pizza“ 🍕 (`pizza.tsx`, H-47's children's way): eight slices on a wooden board, one lifted off towards its side every
  eighth of the time from 12 o'clock round, with a munch (`SLICES`, `pieceMoments`); a little steam rises every second.
  Each slice is a small layer cut to its wedge by a still `clip-path`, so a tap lights exactly the slices left.
- „Kuchen“ 🎂 (`cake.tsx`, H-53's second picture): through the oven's window the dough rises out of its tin up to the
  dashed outline of the finished cake (the goal, seen from the start) and browns in the second half; a puff of warm air
  rises from the vent every second. At the end the oven door opens down and the cake comes out onto the table. The dough moves like the flower's stalk (`tm-stalk`, `tm-to-grow`).
- „Abwechseln“ 🔁 (H-52): two children take turns with a toy. The time set is one turn: the toy lies by the fox child
  while the hourglass runs, then it travels over to the bear child with a whoosh and a chime, and the hourglass turns
  itself over – back and forth until a grown-up leaves with ✕ (with „bis um“ set, until then, each turn as long as the
  row's minutes). Behind ⚙️: the toy (Bobbycar, Puppe, Ball, `SWAP_TOYS`, kept as `toy`), „Wer ist dran?“ (starts that
  child's turn anew, for who begins) and the time to the change. The turn is worked out from the clock (`turnAt`).
  At the end a friendly tune (and the child, where there is one, waves and hops), then `GameEnd` with „Nochmal“ and „Weiter“ (the next picture,
  the same minutes, `nextPicture`). Every tap or key during the run answers (steam and a whistle, twinkling, the flame
  flaring) with a warm light where it was, and what is still left lights up softly for a moment (H-51, „Wie lange
  noch?“: the rail to the station, the sand on top, the wax, the cookie – `LeftGlow`, inside the shrinking part so it is
  exactly as big as what is left); nothing has to be tapped, so there is no glow before it or pointing hand.

Every picture moves a small, soft step every second, so even an hour never looks stuck (H-63): the train's wheels turn
once and a puff rises, a big grain falls through the hourglass's neck, a drop of wax runs a little further. And each
shows where it comes from and where it goes (H-64): the train sets off from a little house and the rail ahead shines
while the rail behind is dark, the glass the sand has left keeps a film of it, the wax that ran down spreads on the holder.
Gleich ist es so weit (H-49): a minute before the end, or in the last fifth of a short time (`soonMs`), a bell rings
once and the child, where there is one, waves once (`tm-soon`), and a picture stepped back from afar comes bright again for it.
Seen from afar (H-48): eight seconds after the last tap the backdrop (`.tm-back`), the child and small things
(`.tm-dims`) fade into the dark and only what runs down stays bright; a tap brings it all back (`tm-far`).

Files: `TimerGame.tsx` (start screen: cards, minutes and the own time's slip), `OwnTimeSheet.tsx` (the sheet behind
„Andere …“), `time.ts` (own times: typing, clock times, labels, digits; tested in `time.test.ts`), `TimerPlay.tsx` (one
run: working out its length, the question when a clock time is past, the clock, the phases `running` →
`blow` (candle only) → `done`, taps, the end, the sounds of the pieces), `pieces.ts` (how a run is cut into pieces, the
train's halts, where the apples hang; tested), `SwapPlay.tsx` and `swap.tsx` („Abwechseln“: its turns, and its room,
hourglass and toys), `apples.tsx`, `caterpillar.tsx`, `disc.tsx`, `flower.tsx`, `bucket.tsx`, `sunset.tsx`, `pizza.tsx`, `cake.tsx` (one picture each), `scenes.tsx` (the other drawings
and the shared `Layer`, `Draw`, `Child`, `LeftGlow`; the fox and bear child is the shared `Mascot`), `timer.css`, `content.ts`
(names, order), `settings.ts`.

## Rules

- **A fox or bear child only where it does the picture's thing** (`Child`): it holds the apples' basket, waters the
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
  Numbers are for grown-ups only: in the row, the sheet and behind ⚙️, never in the picture.
- **Every second a small step, never a blink** (H-63): what beats once a second is a small layer of its own (`.tm-beat`)
  moving by `transform` and `opacity` – the wheels are small layers riding in the train's, not groups in its svg – and
  stands still at the end (`.tm-done`). Anything new that moves the whole run long snaps to its last place there too.
  A row of things walking in step (the ants) is a small layer per thing, all one keyframe walk a second apart
  (`tm-march`, one keyframe per step, `ANTS.n` of them – `timer.test.ts` checks), never one strip of them moved inside
  a bigger layer.
- **What a tap lights is what is left** (H-51): a glow inside the part that shrinks, never a sign or a number, and once
  per tap, fading – never blinking. A new picture puts `LeftGlow` into its own shrinking part; in a picture that grows
  (the flower) that is the way still to go (`StillToGrow`, a box over the stake whose lower end rises with the bud).
- **What sinks or grows behind an edge moves in a box cut off there** (`.tm-sky-box`, `overflow: hidden`): the sun and the
  moon behind the hills' ridge, the stalk out of the soil – the cut lies below what covers it everywhere the thing
  passes (`SKY_CUT` under the ridge, `timer.test.ts` checks), so it never shows, and the thing is never stretched.
  Where the edge is slanted (the bucket's walls), the box also gets a still `clip-path` to its shape – never an
  animated one, which repaints the box every frame.
- **Pieces wait on their own clock, not on React**: an apple's fall is a CSS animation with its minute as
  `animation-delay`, a heap rises by `steps(--tm-n)`, the train's halts are keyframes written once for the run. React
  only plays the plop or bell at those moments (`pieceMoments`), never draws a piece per minute.
- **Seen from afar only what runs down stays bright** (H-48): a new picture puts its backdrop in `.tm-back` and its
  small helpers (posts, decorations) in `.tm-dims`; what runs down gets neither. A clipped edge drawn in the background's
  colour would show once that fades – cut edges with clipping boxes instead (the leaf's bands, the disc's halves).
- Development: `?sekunden=<n>` in the address makes a run take n seconds instead of the minutes chosen; the
  pieces still come from the minutes chosen (5 Min. with `?sekunden=20`: five apples, one every four seconds).
- It says nothing, so there is no voice line to record.
- Its ideas are the area „Timer“ on `/management/` (`src/content/ideas/h-timer.ts`, H numbers shared with the
  Alltagshelfer): any time to set (H-59 to H-62), pictures that visibly change every second and show where they go,
  also over long times (H-45, H-63 to H-69), and new pictures. A new timer idea goes there, not into the Alltagshelfer.
