# Timer

Route `/timer/` · idea H-04 („Timer zum Zuschauen“). A book of its own among the Alltagshelfer, the very first one on the shelf, top left (user decision, November 2026; it was hidden as `unfinished` while being built).

A visual timer for the day, not a game: a grown-up picks the length in the row above the cards („Wie lange?“: 10 or 30
Sek., 1, 2, 3, 5 or 10 Min., `TIMER_SECONDS`, kept as `seconds`; the seconds asked for by the user, November 2026) and a picture card starts it. Behind them „Andere …“ opens a sheet for grown-ups
(`OwnTimeSheet`, H-59, H-60): any length from 10 seconds to 3 hours (− and + for hours, minutes and seconds, ready slips
for 15 to 60 minutes, typed on a computer), or „Bis um“ a clock time to end at. The time set there stays as a slip of its
own in the row (`own`, `useOwn`) until another comes. Held ⚙️ while it runs shows the time left in digits for
grown-ups (`TimeLeft`, H-62). Every timer but the Wecker (whose screen is the time left) shows the time left in the picture's bottom right corner on a small paper
note (`shown.tsx`, kept as `timeNote`): by default as minutes and seconds („Zahlen“, `digits`, e.g. „4:37“; user
request, November 2026 – the tally marks were the default before). Behind ⚙️ its „Zeit im Bild“ switches to tally marks
in bundles of five that go one by one – „Striche in %“, a full row of `MAX_MARKS` each a share of the run, one a second
for a short time (`percentMarks`), or „Striche in Zeit“, each mark 1 s up to 15 min (`markUnit`, at most
`MAX_MARKS`) – or „Aus“.
The start screen's cards are the pictures themselves as they look at their end, with no words on them (user request,
November 2026; `TimerCardArt` in `cardArt.tsx`, `GameMode.art`): the very drawing of a run (`SceneParts`) in `.tm-done`,
cut as for 5 minutes, every animation in it stopped (`.tm-card-art`), so the menu stands still. The cards come as wide as
the picture (`ART_ASPECT`). Names are only read out and their tooltip. They stand in the order the user chose (November
2026, `PICTURES`): Rote Scheibe, Sanduhr, Kerze, Apfelbaum, Blume, Pizza, Wecker, then the others, on one frame with
no name; after all of them Abwechseln is a category of its own, named on its frame (`GameMode.kind`): its two children
with the toy, the lamps and the hourglass, then Tennis, and that they run on without end is said in their tooltip (`SWAP_NOTE`). Where there is
room, its frame stands beside the pictures' rather than in a row of its own below (`packGroups`' `reserve`), so all
cards still fit on one screen. The row of lengths stands in the menu's head (`levelInHead`), on a phone on its side
beside the ribbon: under the head it left the cards too little room there, and the Abwechseln group fell below the
screen (November 2026; `timer.test.ts` checks). The Ameisenstraße (H-68) was
taken out (user request, November 2026). The pictures:
- „Zug zum Bahnhof“ 🚂: a little train rolls along a long track, from the little house at the left nearly across the
  picture, to the station with its clock, big red and white buffers and a chequered flag at the track's end (the goal,
  seen from the start). From 2 minutes on a post with a bell stands by the track for every minute (`TrainStops`, at most `MAX_STOPS`); the train
  halts there briefly and it chimes (H-45), with keyframes made for the run (`TrainStepKeyframes`, `--tm-roll`).
- „Apfelbaum“ 🍎 (`apples.tsx`, H-45): an apple tree's year (`appleTimes`, `APPLE_YEAR`; user feedback, November
  2026: show more progress). The tree grows from a sapling a step a second (until 15 % of the time), then its blossoms
  open one after the other here and there over the crown (`bloomRank`, each in its own slot, until 30 %) while three
  tiny bees buzz round it from then on (`BEES`, `BEE` smaller than a blossom, each a small layer, its wings a smaller
  one), then each blossom in turn withers as a small green apple swells out of it and reddens (one at a time, until
  45 %), then a little cart rolls back and forth, each time to the free apple farthest away
  (`harvestOrder`, `CartKeyframes` written for the run, the wheels turning with it); the next apple sways a second at a
  time while it waits its turn, and the cart rolls under it just as it lets go, so it falls straight down into the cart
  with a plop (spaced, `PIECE_SOUND_GAP_MS`) and lies there on its own in the heap (`heapSlot`, `HEAP_ROWS`). Always many
  apples, also for a short time (`appleCount`, `MIN_APPLES` to `MAX_APPLES`, as many as the heap holds); the last lands
  as the time is up. A tap rustles the leaves, once the blossoms are out the bees buzz.
- „Sanduhr“ ⏳: a tall hourglass (`GLASS`, about two thirds of the picture's height), the sand runs in a thin stream
  from the top bulb into the bottom one, where its heap rises with a round top (`Hourglass`, one layer, shared with
  Abwechseln, which turns it over as a whole).
- „Raupe“ 🐛 (`caterpillar.tsx`, H-46): a caterpillar eats a big leaf from the tip to the stalk, one bite each second
  (`runSeconds`, `useBites`). The bites are planned once for the run (`planBites`): it starts with the very tip and
  works back to the stalk, always biting where the leaf reaches furthest out, each bite a round notch about as deep as
  its radius, stepping up or down the edge by well over a bite's width, so the edge is a row of uneven scallops with
  points of leaf between them, as a real caterpillar leaves it (user feedback, November 2026). Each bite takes as much
  leaf as the clock asks for (`leafLeft`), so the leaf goes evenly and is gone with the last; a very long run takes
  nibbles. The leaf is drawn as it is left, once a second: its green, outline, midrib and veins cut off at the bites as plain paths (`leafShape`, `cutLine`), a thin dark line along the bites – never a clip path, which dropped out while the page turned. The head goes to each spot before it bites
  it off (`biteSpot`), its neck stretching after it from the body crawling back along the midrib (`bodyFront`, never
  further than `REACH`), and three leaf crumbs fall from the spot bitten (`CRUMBS`). At the end the cocoon hangs on the branch, wiggles and bursts open,
  and the butterfly slips out and flies back and forth in the air above the meadow, bobbing, as long as the end is shown
  (`BUTTERFLY`, user request, November 2026).
- „Blume“ 🌸 (`flower.tsx`, H-53): a garden hose coming from a tap on a post (`TAP`; a can that never ran dry made no
  sense, user feedback, November 2026), laid in a forked stick at the bed's edge (`HOLDER`), drips onto a sprout in the
  flower bed, a drop every second; the plant rises out of the soil, pushing soil crumbs aside each second
  (`SoilCrumbs`), along a tall stake to the red ribbon at its top (the goal, seen from the start), grown at `GROWN_AT`
  of the time, and grows as a whole as it rises (`SPROUT_SIZE` to full: stalk thicker, leaves bigger, the lower leaves
  bigger than the upper ones); then its flower grows from small to big round the bud, all petals at once, until the
  end. It fills up instead of running out, for waiting for something good.
- „Kerze“ 🕯️: three tall candles on the table burn down one after the other (`CANDLE.xs`, each a third of the time,
  `--tm-i`/`--tm-of`), each burning all the way down into its puddle and only then going out, its smoke (`Smoke`: a
  wisp curling up, soft puffs rising one after another) lingering for several seconds as the next lights; at the end the last one goes out with a puff
  too (`blow`).
- „Sonnenaufgang“ 🌅 (`sunset.tsx`, id `sunset`, H-54; „Sonnenuntergang“ until the moon came first, November 2026): one round hill, its meadow full of flowers drawn as coloured dots
  (`FLOWERS`), and a big moon exactly in the picture's middle. First the moon goes down behind the hill (gone at
  `MOON_SET_AT`) while the stars go out one by one (`STARS`, each at its share of the time), the night's sky and then the
  morning's pink fade away and the land grows light; then the big sun rises at the very same place (from `SUN_FROM`),
  red at first and yellow as it climbs, and stands high over the meadow at the end (user feedback, November 2026: the
  windmill and the little house taken out, sun and moon much bigger and in the middle, the moon setting first). Every
  second a soft glow widens past the edge of the moon or the sun (`.tm-ring`).
- „Rote Scheibe“ 🔴 (`disc.tsx`, H-47): the red disc Kitas know from the „Time Timer“, shrinking like a clock's hand goes
  round on a plain white face; the knob in the middle turns a petal each second.
  A ladybug crawls round the face's rim about once a minute, like a second hand – a real seven-spot one seen from above
  (black head with short feelers, the black shield with its two white patches, shiny red wing cases parted by their
  seam, seven spots), its two sets of three legs stepping in turn and its body swaying a little, each a small layer in
  the box riding round (`.tm-bug`; user feedback, November 2026: a flat round bug only slid round) – and a dot comes outside the rim each
  time it is back at the top, clockwise from 12 o'clock with a plink (H-67, `ladybugLaps`: the rounds fit the time
  exactly; beyond 30 minutes a dot every second or third round, so they go round once at most, `MAX_DOTS`).
- „Pizza“ 🍕 (`pizza.tsx`, H-47's children's way): 24 slices on a wooden board, one lifted off towards its side at each
  24th of the time from 12 o'clock round, with a munch (spaced) (`SLICES`, `pieceMoments`); a little steam rises every second.
  Each slice is a small layer cut to its wedge by a still `clip-path`, so a tap lights exactly the slices left.
- „Wecker“ ⏰ (`clock.tsx`, H-70, user request, November 2026): a children's digital radio alarm clock on the bedside
  table – a chunky, rounded turquoise case with a big yellow snooze bar on top, little feet, a star and a heart sticker,
  the radio mast and the alarm's bell glowing in the screen's corners – whose orange segment digits count the time left
  down to 0:00 (`clockText`: the digits never shift, a blank before one-digit minutes from 10 minutes on, the hours in
  front from an hour on). The digits are the time left, so it shows no note in the corner and has no „Zeit im Bild“
  behind ⚙️. Under them a row of `CLOCK_BLOCKS` light blocks goes out one by one from the right, so a child who can't
  read digits sees the time go too. A tap presses the snooze bar with a click; at the end it beeps and rings on its feet.
- „Abwechseln“ 🔁 (H-52): two children take turns with a toy. The time set is one turn. Its hourglass is the
  Sanduhr's own (`Hourglass` in `scenes.tsx`, user request, November 2026: one drawing, never a second one built
  beside it), standing between two floor cushions (`SWAP_SEATS`, the same way left and right of it): the fox child's
  (orange, with pointed ears sewn on) and the bear child's (brown, round ears). A lamp hangs over each. Whose turn it is
  shows at once from afar (user feedback, November 2026): that child's lamp is on and shines on its cushion
  (`SwapLight`), the other side lies in soft shade (`SwapShade`), and the toy sits on the lit cushion. Who begins is
  drawn at the start, once the page lies still: the lamps click on and off in turn, slower and slower (`DRAW_STEPS`),
  the last one on is the first child's, and the toy hops from in front of the hourglass onto that cushion – the sand
  only starts as it lands. When the sand is through the lamps change, the toy hops over with a whoosh and a chime and
  the hourglass turns itself over – back and forth until a grown-up leaves with ✕ (with „bis um“ set, until then, each
  turn as long as the row's minutes; at the end both lamps shine). Behind ⚙️: the toy (Bobbycar, Puppe, Ball,
  `SWAP_TOYS`, kept as `toy`), „Wer ist dran?“ (starts that child's turn anew, also during the draw) and the time to the
  change. The turn is worked out from the clock (`turnAt`).
- „Tennis“ 🎾 (`tennis.tsx`, H-71, user request, November 2026: „zwei die Tennis spielen und der Ball fliegt langsam auf
  die Seite vom anderen“): Abwechseln's turns (`SwapPlay.tsx`, the same draw, ⚙️ and clock, without the toy) as the fox
  child and the bear child playing tennis on a blue court, the net in the middle. Whose turn it is shows from afar: the
  ball is on that child's racket, hopping on it once a second, and that half of the court lies in the light, the other in
  shade (`SwapShade` with `edge` at the net). At the change the racket swings, the ball flies slowly in a high arc over
  the net (`FLIGHT_MS`, 2.4 s, a knock as it is hit and as it lands) and the shade changes sides only as it crosses the net
  (`tm-cross`), so the light follows the ball. The draw lights the sides in turn while the ball waits at the net's foot.
  The time of a turn shows as ten lights on a board over the net going out one by one (`TennisBoard`), worked out from
  the turn's start so a reload keeps them right. The players stand still: only rackets and ball move, each a layer of
  its own (`Racket`, `Ball`).
  At the end the picture's own sound, then children cheer (the `cheer` recording) while a warm light spreads over the
  picture (`.tm-done-light`) and a few hearts, stars and notes rise slowly (`celebrate`), a friendly tune after it, then `GameEnd` with „Nochmal“ and „Weiter“ (the next picture,
  the same minutes, `nextPicture`). Every tap or key during the run answers (steam and a whistle, twinkling, the flame
  flaring) with a warm light where it was, and what is still left lights up softly for a moment (H-51, „Wie lange
  noch?“: the rail to the station, the sand on top, the wax, the slices – `LeftGlow`, inside the shrinking part so it is
  exactly as big as what is left); nothing has to be tapped, so there is no glow before it or pointing hand.

Every picture moves a small, soft step every second, so even an hour never looks stuck (H-63): the train's wheels turn
once and a puff rises, the sand pours through the hourglass's neck, a drop of wax runs a little further. And each
shows where it comes from and where it goes (H-64): the train sets off from a little house and the rail ahead shines
while the rail behind is dark, the hourglass's bottom heap grows, the wax that ran down spreads on the holder.
Gleich ist es so weit (H-49): a minute before the end, or in the last fifth of a short time (`soonMs`), a bell rings
once, and a picture stepped back from afar comes bright again for it.
Seen from afar (H-48): eight seconds after the last tap the backdrop (`.tm-back`) and small things
(`.tm-dims`) fade into the dark and only what runs down stays bright; a tap brings it all back (`tm-far`).

Files: `TimerGame.tsx` (start screen: cards, minutes and the own time's slip), `cardArt.tsx` (a card's picture), `OwnTimeSheet.tsx` (the sheet behind
„Andere …“), `time.ts` (own times: typing, clock times, labels, digits; tested in `time.test.ts`), `TimerPlay.tsx` (one
run: working out its length, the question when a clock time is past, the clock, the phases `running` →
`blow` (candle only) → `done`, taps, the end, the sounds of the pieces), `pieces.ts` (how a run is cut into pieces, the
train's halts, where the apples hang; tested), `SwapPlay.tsx` and `swap.tsx` („Abwechseln“ and „Tennis“: the draw and its turns, and Abwechseln's room,
lamps, cushions and toys), `tennis.tsx` (Tennis's court, players, rackets, ball and board), `apples.tsx`, `caterpillar.tsx`, `clock.tsx`, `disc.tsx`, `flower.tsx`, `sunset.tsx`, `pizza.tsx` (one picture each), `shown.tsx`
(„Zeit im Bild“: its choice, the note with digits or tally marks), `scenes.tsx` (the other drawings
and the shared `Layer`, `Draw`, `LeftGlow`), `timer.css`, `content.ts`
(names, order), `settings.ts`.

## Rules

- The row of lengths stays one line on a phone on its side (844×390), with the own time's slip too: when it wraps, the
  last row of cards falls off the screen. A new length means narrower slips (`.tm-lengths`), never a second line.
- **Progress is seen every second** (user feedback, November 2026): every picture moves a step a second that a child
  can see from the sofa – a bite, a crumb, an apple, a slice – not only a tiny wobble. Pieces come many, also for a
  short time (they come more often then, never fewer), the way to go is long (the train across the picture, the stalk
  nearly to the top), and a goal shows from the start (the flag, the ribbon). What is cut into pieces
  over the time gets enough of them (24 slices, three candles one after the other, petals opening after the stalk has
  grown). Many pieces mean many moments: their sounds are spaced (`PIECE_SOUND_GAP_MS`), never a din.
- **The end is plain to see and hear**: the picture's own last step, then children cheering, a warm light over the
  picture and the calm `celebrate` – for every picture, Abwechseln's clock time too. Never a storm of confetti.
- **A picture makes sense as it is**: where something comes from and why it happens is plain (the water from a tap and a
  hose, never an endless can; no boat in a bucket, no flower opening for no reason – Eimer and Kuchen were taken out,
  user feedback, November 2026). A new picture is one whole small story a child knows from life, and shows nothing
  beside it: what runs down stands big where the eye goes first, and things only standing by (a windmill and a little
  house beside the moon and the sun) come out (user feedback, November 2026).
- **What runs out runs out wholly before it ends** (user feedback, November 2026): a candle burns down to its puddle
  before its flame goes out (`CANDLE.stub` a thin rim, the going out after its turn, never before), and what follows
  an ending (the smoke) lingers slow and soft for seconds, never a puff gone at once. `timer.test.ts` checks the candle.
- **What happens, happens as in life** (user feedback on the Apfelbaum, November 2026): things fall straight down,
  never across to where they are wanted – what catches them comes under them first (the cart under the apple), arriving
  as the thing lets go, never standing under it for seconds before; it goes back and forth between pieces rather than
  creeping along one way (`harvestOrder`). What is
  collected stays to be seen one by one (each apple on its own in the heap, never a lump that grows: a rising heap in a
  basket held at the chest looked like something else entirely), and a picture that runs a long while tells a whole
  story in stages (the tree grows, blossoms, bears apples, is harvested), so there is always something new to see.
  Within a stage the pieces come one at a time, each finished before the next begins (every blossom opens on its own,
  then every blossom becomes its apple on its own), never several half done at once, and a stage starts only once the
  one before is over (`appleTimes`, `timer.test.ts` checks). Small helpers that only liven the picture (the bees) are
  tiny beside what runs down, as in life – big bees took the eye from the blossoms (user feedback, November 2026).
- **Whose turn it is, is seen from across the room, from the very first second** (user feedback, November 2026: a
  toy lying beside one of two small cushions did not tell it): the child's whole side changes – its lamp on and its
  light on the cushion, the other side in shade – and the toy sits on that cushion, not beside it. Who begins is never
  left unsaid: the lamps draw it before the sand runs, and only then does the time start. A new way to show a turn
  keeps that: a big change of the whole side, never a small sign.
- **One drawing for one thing**: a thing two pictures show (the hourglass) is one component both use, never copied and
  drawn again with its own sizes (user request, November 2026; `timer.test.ts` checks the hourglass).
- **The cards' order is the user's** (November 2026: Rote Scheibe, Sanduhr, Kerze, Apfelbaum, Blume, Pizza, then the
  Wecker; Abwechseln and Tennis last): keep it when adding a picture (a new one goes after these, before Abwechseln, unless the
  user says otherwise), and add it to the perf scenarios' list in `tools/perfScenarios.ts`, which taps each card by its
  name (`timer.test.ts` checks the order). Abwechseln is another thing to do than the pictures that run until the time
  is up – taking turns without end – so it stands in a group of its own after them (`GameMode.kind`, user request,
  November 2026), its tooltip says so (`SWAP_NOTE`) and „Weiter“ never leads into it (`TIMED_PICTURES`, `nextPicture`).
- **A card is its picture at the end, no words** (user request, November 2026): a new picture gets its card from
  `SceneParts` by itself; what its end needs from an animation that runs on at `.tm-done` (the butterfly flying over)
  is set still under `.tm-card-art` – look at the card, since every animation there is stopped (`timer.test.ts`).

- **No fox or bear figure in any picture** (user feedback, November 2026): first a family standing by every picture was
  taken out (children wanted to tap it, and a timer to watch needs as few things and movements as can be), then the
  children that pushed the cart, held the hose and blew out the candle – drawn in SVG they looked odd, a bear with two
  brown circles for paws on the hose. A picture tells its story by itself (the cart rolling by itself, the hose in a forked
  stick, the last candle going out by itself); where it is about the real children (Abwechseln), a thing of theirs
  stands for them (the cushions in fox and bear colours, no face). `timer.test.ts` checks that no picture draws one. The
  one exception is Tennis (user request, November 2026): the two players are what the picture is about, so they are the
  shared `Mascot` children, standing still, while only their rackets and the ball move – never a figure of its own,
  and never a third one watching.
- **What grows, grows as a whole** (user feedback, November 2026): a plant rising gets bigger as it rises – its stalk
  thicker, its leaves bigger – scaled from its foot (`transform-origin` at the soil, never stretched one way), and a
  flower grows open from small to big with all its petals at once, never petal after petal.

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
  The time left stands small in the picture's bottom right corner, letting taps through: minutes and seconds by default,
  tally marks or nothing when a grown-up chooses so behind ⚙️ („Zeit im Bild“).
- **Tally marks start many** (user feedback, November 2026: ten were too few to see them go): every way of marks starts
  with a full row or, for a short time, one a second (10 s: ten marks), never a handful (`timer.test.ts` checks). A
  changed default of `timeNote` gets the field a new name, or everyone who played before keeps the old one.
- **Every second a small step, never a blink** (H-63): what beats once a second is a small layer of its own (`.tm-beat`)
  moving by `transform` and `opacity` – the wheels are small layers riding in the train's, not groups in its svg – and
  stands still at the end (`.tm-done`). Anything new that moves the whole run long snaps to its last place there too.
  A row of things walking in step is a small layer per thing, all one keyframe walk a second apart (one keyframe per
  step), never one strip of them moved inside a bigger layer.
- **A drawing never touches its svg's edge unless that svg lets it out** (user feedback, November 2026: the knob's flower
  in the Rote Scheibe's middle lost the tips of its top and bottom petals): an svg cuts off what lies past its
  `viewBox`, half a stroke's width too, wherever it sits (only `.tm-layer > svg` is `overflow: visible`). A small
  drawing inside a `div` of its own gets `overflow: visible` on its svg or keeps its strokes inside the `viewBox`, and
  something that turns is looked at magnified in the preview at several angles.
- **A creature that goes somewhere walks** (user feedback, November 2026): legs that step in turn and a body that
  sways a little, as small layers moving by `transform`, never a stiff figure sliding along (the ladybug).
- **Only what runs and where it goes** (user feedback, November 2026): the hourglass shows the sand still to run and
  the heap below, nothing else – no film or grains on the glass the sand has left, no grain or disc over the stream at
  the neck, no white streaks for the glass's shine (all taken out: they looked odd or bad; Abwechseln's hourglass too). A trace of what is over (H-64) is only drawn where it is plainly a
  thing of its own (the dark rail, the wax puddle), never a pale copy of what was there.
- **No `clip-path` round what is in view while the page turns**: a turning page is a picture of the app (view
  transition), and in it the clip-path round a moving layer dropped out – the hourglass's sand showed as a square
  before it began (user feedback, November 2026). A shape something moves inside is a still drawing of that shape in a
  window with `overflow: hidden`: the window slides, the drawing in it slides back the same way and stays put, both by
  `transform` (`BulbSand`, `bulbBelow`; `timer.test.ts` checks). Every clip path drops out there, also on a layer that
  stands still and also a `<clipPath>` inside the svg: the Raupe's bitten leaf showed whole again while the page turned
  (November 2026). A cut that changes as the picture runs is drawn into the shape itself (`leafShape`; `timer.test.ts`
  checks). A still clip-path is fine
  where nothing it cuts shows as the page turns, or on a light mounted only after a tap.
- **What is eaten or cut looks as in life, and one thing stays one piece** (user feedback on the Raupe, November
  2026): bites are uneven round notches that stand apart, starting where an animal really starts (the leaf's tip),
  never a row of even round fingers. A thing cut away bit by bit is one drawing with one cut, never strips or bands
  laid side by side – between two boxes the background shone through as a hairline across the leaf.
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
  second (`useBites`) and the leaf's paths, head, neck and body are set once a second, the figure gliding by a
  CSS transition – small layers, a change a second, never per frame, and the leaf's drawing `memo` so it is never drawn
  again (`bun run perf timer-raupe`).
- **What takes a piece goes to it first** (user request, November 2026): the caterpillar's head moves to each spot of
  the leaf before that spot goes, and bites it off there – never a head chewing in one place while the leaf goes
  somewhere else. A new picture where someone eats, picks or carries pieces does the same.
- **Seen from afar only what runs down stays bright** (H-48): a new picture puts its backdrop in `.tm-back` and its
  small helpers (posts, decorations) in `.tm-dims`; what runs down gets neither. A clipped edge drawn in the background's
  colour would show once that fades – cut edges with clipping boxes instead (the leaf drawn as it is left, the disc's halves).
- Development: `?sekunden=<n>` in the address makes a run take n seconds instead of the minutes chosen; the
  pieces still come from the minutes chosen (2 Min. with `?sekunden=25`: twenty apples, its whole year in 25 seconds).
- It says nothing, so there is no voice line to record.
- Its ideas are the area „Timer“ on `/management/` (`src/content/ideas/h-timer.ts`, H numbers shared with the
  Alltagshelfer): any time to set (H-59 to H-62), pictures that visibly change every second and show where they go,
  also over long times (H-45, H-63 to H-69), and new pictures. A new timer idea goes there, not into the Alltagshelfer.
