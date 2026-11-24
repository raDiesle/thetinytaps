# Timer

Route `/timer/` · idea H-04 („Timer zum Zuschauen“). A book of its own among the Alltagshelfer, the very first one on the shelf, top left (user decision, November 2026; it was hidden as `unfinished` while being built).

A visual timer for the day, not a game: a grown-up picks the length in the row above the cards („Wie lange?“: 10 or 30
Sek., 1, 2, 3, 5 or 10 Min., `TIMER_SECONDS`, kept as `seconds`; the seconds asked for by the user, November 2026) and a picture card starts it.
Every visit starts at 5 minutes: the length picked is kept for the visit only (`visitLength` in `TimerGame.tsx`), never
stored, so the next visit never opens on whatever was picked last (user request, November 2026). Behind them „Andere …“ opens a sheet for grown-ups
(`OwnTimeSheet`, H-59, H-60): any length from 10 seconds to 3 hours (− and + for hours, minutes and seconds, ready slips
for 15 to 60 minutes, typed on a computer), or „Bis um“ a clock time to end at. The time set there stays as a slip of its
own in the row (`own`, stored) until another comes; whether it is the one chosen (`useOwn`) lasts for the visit like the length. Held ⚙️ while it runs shows the time left in digits for
grown-ups (`TimeLeft`, H-62). Every timer but the Wecker (whose screen is the time left) shows the time left in the picture's bottom right corner on a small paper
note (`shown.tsx`, kept as `timeNote`): by default as minutes and seconds („Zahlen“, `digits`, e.g. „4:37“; user
request, November 2026 – the tally marks were the default before). Behind ⚙️ its „Zeit im Bild“ switches to tally marks
in bundles of five that go one by one – „Striche in %“, a full row of `MAX_MARKS` each a share of the run, one a second
for a short time (`percentMarks`), or „Striche in Zeit“, each mark 1 s up to 15 min (`markUnit`, at most
`MAX_MARKS`) – or „Aus“. Once the time is up the note shows a red „0:00“ blinking softly (`up` of `TimeShownNote`,
`.tm-shown-up`), also where tally marks were chosen, and the Wecker's digits turn red and blink alike (`.tm-clock-on`),
until the end is left – only „Aus“ keeps the corner empty.
The start screen's cards are the pictures themselves as they look halfway through a run, with no words on them (user
request, November 2026; the middle rather than the end, user feedback, November 2026; `TimerCardArt` in `cardArt.tsx`,
`GameMode.art`): the very drawing of a run (`SceneParts`), cut as for 5 minutes and started half of it ago, every
animation in it put at that moment and then stopped (`holdAt`, `.tm-card-art.tm-still`), so the menu stands still. The cards come as wide as
the picture (`ART_ASPECT`). Names are only read out and their tooltip. They stand in the order the user chose (November
2026, `PICTURES`): Rote Scheibe, Sanduhr, Kerze, Apfelbaum, Blume, Pizza, Wecker, then Tidy Up, Five Boxes, Block House, Treasure Tunnel, Up to the Moon and the others, the Marble Jar last, on one
frame with no name; after all of them Abwechseln is a category of its own, named on its frame (`GameMode.kind`): its two children
with the toy, the lamps and the hourglass, then the Wippe and the Kugelbahn, and that they run on without end is said in their tooltip (`SWAP_NOTE`). Where there is
room, its frame stands beside the pictures' rather than in a row of its own below (`packGroups`' `reserve`), so all
cards still fit on one screen (with the Marble Jar's sixteenth picture on a tablet only in seven columns, which a
picture card may take: `MIN_PICTURE_WIDTH` in `src/lib/fitGrid.ts`; on a phone on its side the menu scrolls, as it did
before). The row of lengths stands in the menu's head (`levelInHead`), on a phone on its side
beside the ribbon: under the head it left the cards too little room there, and the Abwechseln group fell below the
screen (November 2026; `timer.test.ts` checks). The Ameisenstraße (H-68) was
taken out (user request, November 2026). The pictures:
- „Zug zum Bahnhof“ 🚂: a little train rolls along a long track, from the little house at the left nearly across the
  picture, to the station with its clock, big red and white buffers and a chequered flag at the track's end (the goal,
  seen from the start). Five posts with a bell stand by the track at every length (`TrainStops`, `TRAIN_STOPS`; one a minute
  until 24 November 2026, so a short run had none); the train halts there briefly and it chimes (H-45), with keyframes made for the run (`TrainStepKeyframes`, `--tm-roll`).
- „Apfelbaum“ 🍎 (`apples.tsx`, H-45): an apple tree's year (`appleTimes`, `APPLE_YEAR`; user feedback, November
  2026: show more progress). The tree grows from a sapling a step a second (until 15 % of the time), then its blossoms
  open one after the other here and there over the crown (`bloomRank`, each in its own slot, until 30 %) while three
  tiny bees buzz round it from then on (`BEES`, `BEE` smaller than a blossom, each a small layer, its wings a smaller
  one), then each blossom in turn withers as a small green apple swells out of it and reddens (one at a time, until
  45 %), then a little cart rolls back and forth, each time to the free apple farthest away
  (`harvestOrder`, `CartKeyframes` written for the run, the wheels turning with it); the next apple sways a second at a
  time while it waits its turn, and the cart rolls under it just as it lets go, so it falls straight down into the cart
  with a plop (spaced, `PIECE_SOUND_GAP_MS`) and lies there on its own in the heap (`heapSlot`, `HEAP_ROWS`). Always many
  apples at any length (`MAX_APPLES`, as many as the heap holds), a short time only harvesting them faster; the last lands
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
- „Kerze“ 🕯️: six tall candles in six wax colours (`WAX`) stand in brass dishes on a wooden table seen a little from
  above – its top, front edge and legs, the floor behind them (`TABLE`) – and burn down one after the other, linked like
  a chain reaction (user request, 24 November 2026: three were too few, the table lay under the bar so they seemed to
  stand on nothing, and it wasn't plain that one leads to the next): a fuse (`FUSE`, `Fuse`) runs from beside each
  candle's stub over its dish's rim, across the table in a little dip and up the next candle's side to its wick. Each
  candle has a sixth of the time (`candlePlan`): it burns all the way down into its puddle and only then goes out, its
  last flame lights the fuse, and a spark (`.tm-spark`, a small layer riding `tm-fuse-run`, keyframes written once from
  the fuse's points by length, `FUSE_AT`) runs along it with a sizzle while the cord burns away behind it
  (`stroke-dashoffset` of the fuse's own small svg, only for those moments) and leaves a line of ash on the table; the
  next candle lights as the spark reaches its wick. The spark takes the first moments of that candle's share
  (`FUSE_MS`, at most `FUSE_SHARE` of it, so a short run is only quicker). The smoke of the one gone out (`Smoke`: a
  wisp curling up, soft puffs rising one after another) lingers for several seconds meanwhile; at the end the last one
  goes out with a puff too (`blow`). The window that stood at the right went for the six candles; a quiet wallpaper
  pattern stays. Its card shows the spark on its way (`LATER`, 0.506).
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
- „Tidy Up“ 🧸 (`tidy.tsx`, H-118, user request, 21 November 2026: a timer for tidying up, best at five minutes): toys
  lie on the rug of a children's room (`TOY_PLACES`, two rows, block, ball, car, duck, ring pyramid, drum, book and
  spinning top, `TOY_KINDS`), the open toy box stands at the right, and a red and yellow toy gantry crane spans the
  picture above them (`BEAM`, `POSTS`). One toy after the other its trolley drives over a toy, the rope grows, the claw
  opens, goes down, grips, lifts it, carries it over the box and opens, and the toy falls straight down onto its own
  place in the heap (`heapSlot`, `HEAP_ROWS`, smaller there, `HEAP_SCALE`), its top showing over the rim, with a clonk
  (spaced) – nearest the box first, so the empty floor grows from the box outwards (`tidyToys`). All fifteen toys
  at any length, one every 20 seconds at five minutes (`MAX_TOYS`), each toy's turn the same
  share of the time and the last landing as it is up (`tidyTimes`, `CYCLE`). Trolley, rope, claw, its two fingers and
  each toy move on keyframes written for the run from that one plan (`TidyKeyframes`), so they stay in step; the claw
  sways a little every second. A tap makes the motor whirr and lights the toys still on the floor. Its name and lines
  were written English first and translated into every app language on 22 November 2026 (`tidyNames.ts`, their own
  part in `languageStatus.ts`); its lines wait for their recordings. The
  Aufräumlied (H-119, a fixed five minutes with a Suno song) is an idea of its own, not built.
- „Five Boxes“ 📦 (`boxes.tsx`, H-120, user request, 22 November 2026: more timers for tidying up): five open boxes
  stand against the wall side by side, red, green, blue, yellow and purple, each with its sort's picture on a round
  label (block, car, ball, duck, book – the Tidy Up's own `ToyArt`), and in front of each its sort's toys lie on the rug
  in different colours (`hue-rotate`). Box after box from the left, its toys hop into it one at a time in a high arc,
  landing smaller side by side with their tops over the rim (`boxSlot`), and once its last is in, its lid folds shut
  over its hinge – two layers, the half standing behind the toys shrinking to its edge and the half lying over them
  growing from there (`Lid`, `LID_SHUT`). Each box is a fifth of the time, the last lid shuts as it is up
  (`boxesPlan`): five boxes, three toys each, at any length (`PER_BOX`). No figure
  throws them (see the rules): the toys hop by themselves, as Abwechseln's toy does. The toy whose turn comes wiggles
  once a second while it waits (`Hopper`'s `waitFrom`). A hop is three small layers inside each other on keyframes
  written for the run (`hop.tsx`: across at an even pace, up and down slower at the top and faster falling, smaller
  from its foot); `keyframes.ts` writes them, as for the crane. A landing
  clonks, a lid shutting knocks (both spaced); a tap makes a toy hop sound and lights the toys still on the floor.
  Its name and lines (`boxesNames.ts`) were written English first and translated into every app language at once.
- „Block House“ 🧱 (`blocks.tsx`, H-125, user request, 22 November 2026: timers that look like a well-known kind of game
  played by itself, like a video, the first a block-building game for tidying up): on a meadow of square grass a
  jumble of blocks lies in three rows (`JUMBLE`, each a little tilted), beside a house's plan drawn in dashed outlines
  (`HOUSE`, `SLOTS`: stone at the foot, wood walls with a door and two windows, a stepped roof). A cursor's cube
  outline stands on the next place (`cursorFrames`). A crystal floats in the sky over the jumble (`GEM`, its halo
  pulsing softly) and its violet beam carries one block after the other to its place like telekinesis (user request,
  22 November 2026: blocks wander slowly to their place, the more movement towards the goal the better), from the
  bottom up, each **all its share long** (`blocksPlan`: a block starts where the one before lands): the beam swings
  over to it and it glows (`PHASES.aim`), it rises straight up out of the jumble, straightening (`lift`), floats across
  in a low arch, leaning into the way (`carry`), and is lowered onto its place (`lower`), landing with a puff of crumbs
  as its share ends; the last lands as the time is up, and then the windows and the door light up. On a long share
  it bobs gently while held (`.tm-blocks-bob`, a finite CSS animation), and every third block slips once, at any
  length (a short run's slip is quicker, `slipMs`) – the beam flickers off, the block falls `SLIP`, the beam catches it and carries on (`blockPose`,
  `drop`). The block's way and the beam's turn and length are sampled at the same moments into keyframes written for
  the run (`blockFrames`, `beamFrames`, linear between them), so the beam's tip stays on the block; its light and the
  block's glow are opacity keyframes of their own (`beamShades`). Every run carries all twenty blocks (`MAX_BLOCKS`),
  five minutes one every 15 seconds, a shorter run only faster.
  Each block is a layer of its own; that a block further right or higher covers its neighbour comes from an animated
  z-index per block (`stackKeyframes`, stepping as it lifts) inside `.tm-blocks`, which isolates it so none reaches over
  the end's light or trophy. A landing knocks, a tap knocks higher and lights the blocks still lying. Its name and
  lines (`blocksNames.ts`) were written English first and translated into every app language at once. **Such a game
  look is a genre of our own** (user request with H-125): blocks, a cursor, a meadow of squares – never another
  game's name, figures, textures or a picture that copies one game (no Minecraft, no Steve, no creeper); the ideas for
  more of them (H-126 to H-133) say the same.
- „Treasure Tunnel“ ⛏️ (`tunnel.tsx`, H-126, 22 November 2026, the second block world): a hill of blocks cut open from
  the side, as 2D block games show their worlds (`HILL`: grass on top, a block of dirt, then stone, a little darker than
  the blocks to dig), a meadow before it. At its foot the tunnel's way is still blocks (`TUNNEL`, ten columns two high,
  `spotKind`: dirt under the grass, else stone, two with gold), and after it a little room (`ROOM`) with the treasure
  chest, lit through a crack from above – the goal, seen from the start. A pickaxe (`PICK`, a layer of its own) swings at
  the next block once a second from the hand on its handle, a frame round that block as a block game marks it; the
  block cracks a stage at each quarter of its share (`CRACKS`, three opacity steps repeating every `--tm-unit`) and
  crumbles away into square crumbs as its share ends (`CRUMBLE_MS`, the Block House's crumbs). Column by column from
  the entrance, the top block first (`SPOTS`); the pickaxe and the frame jump on together (`toolFrames`, keyframes
  written for the run). The last block goes as the time is up, then the chest's lid turns open on its hinge at the back
  over the gold, with a warm light round it. Every run digs all twenty blocks (`MAX_DIG`), five minutes one every 15
  seconds, a shorter run only faster. A block going cracks, a tap gives the pickaxe's bright tink and
  lights the blocks still standing. Its name and lines (`tunnelNames.ts`) were written English first and translated
  into every app language at once.
- „Up to the Moon“ 🚀 (`jump.tsx`, H-127: first „Hop to the Flag“ on one screen, 22 November 2026; rebuilt on user
  request, 23 November 2026, as a climb through a world many screens tall – the old level was too small and simple –
  and the same day once more with a fox and a world that makes sense): a jump-and-run going **up**, the picture
  following the fox like a camera. The world (`WORLD_H`, six screens of 900) is one HTML layer moved by a transform on
  keyframes written for the run (`tm-jump-cam`, `cameraAt`: the feet stand at `ANCHOR`, never looking past the world's
  top or bottom), never a changing viewBox; its drawings are built once (`memo`). From the bottom: a lake on the left
  (`SURFACE`, left of `SHORE`) with fish, seaweed and a sandy floor; the meadow (`GROUND`) with a
  big tree (`TREE`) with wooden steps nailed to its trunk, left and right in turn as for a treehouse (`STEPS`), and the
  treehouse on its crown (`DECK`, a hatch in its floor, a red roof, a flag), the cake, and the skyscraper (`SKYSCRAPER`)
  with its glass lift's shaft up its side (`SHAFT`) and an open window; a rope from the treehouse's post to that window
  for a cable car (`ROPE`); clouds; space with a ringed planet (`PLANET`) and the moon (`MOON`) at the top,
  the sky's one gradient going from morning to night. Nothing stands in the water (user feedback, 23 November 2026:
  high-rises in the lake made no sense). Each height has its own way to move (`SPOTS`, each with `by`; `MoveKind`): it
  **swims** up from the lake's floor with a snorkel and a mermaid's tail (`Fin`, the legs together beating), **walks**
  out of the water over the meadow to the tree (`walk`, swinging arms and legs), **hops** up the steps two at a time,
  through the hatch into the treehouse and into the cable car's basket, **rides** the basket along the rope to the
  skyscraper's window, hops over the sill into the glass lift and **rides it up** (`lift`) to the roof, takes the very
  balloons waiting there on a wooden stand and **floats** hanging from them from cloud to cloud, floats in front of the
  jetpack waiting on the highest cloud, which comes up and docks onto its back (`dockFrames`) as it lets the balloons
  go, and **flies** with it by the planet and once round the moon (`ORBIT`, `ORBIT_R`, its spot's `slow`) before
  landing on top of it. The figure is a
  fox child (`jumpFox.tsx`, user request, 23 November 2026: arms it uses, better still a fox, „sehr gute Grafik“) drawn
  with the shared `MascotHead`, `Arm`, `Foot` and `FoxTail` in a blue T-shirt with a star, with a pose of its own for
  each kind of move (`FoxPose`, `POSE_OF`): swimming with a mask and snorkel, arms stroking and its fin beating; walking;
  hopping with its arms
  flapping; in the basket waving with a paw on the rim; in the lift pointing up; hanging from the balloons and the
  parachute by both paws (`HANG_PAWS`, where the strings and cords end); flying with the jetpack on its back and its
  flames; dropping with its arms up. Its arms and legs swing at their own pace as small layers (`.tm-jump-limb`), the
  poses swap at once by opacity keyframes written for the run (`poseTimeline`, `poseLooks`). The basket and the lift's
  cabin are cars of their own (`BASKET`, `CABIN`, `carFrames`): each waits where the fox gets in, goes with it step for
  step and stays where it got out, in a back half behind the fox and a front half over it. The moves follow each other
  with no wait (`jumpPlan`, `wayOf`, `trackAt`), with something under its feet all the way and the bounce once a
  second: a hop is quick, `HOP_MS` a leap (user feedback, 23 November 2026: slow leaps looked odd), crouching on the
  spot for its first `PUSH`, then an arc from point to point (`hopArc`, rising slower to its top and falling from it,
  `LIFT` over its higher end, `timeShares`), its body squashing as it pushes off and lands and stretching in the air
  like a rubber ball (`squashFrames`, `.tm-jump-squash` from its feet); the other ways share the time the hops leave by
  their `PACE` – swimming, the lift, the balloons and the jetpack slowest – while the picture follows at an even pace.
  It faces the way it goes (`.tm-jump-turn`). Over every move hangs a star, caught halfway (`starAt`) as in a platform
  game: it pops up turning like a coin and shrinks away while a ring of light widens and six sparkles burst out
  (`.tm-jump-star`, and `.tm-jump-burst`: ring and sparkles one drawing, `Burst`, never a layer per sparkle), with a bright two-note „ba-ding“ (`playCoin`). Round the way the
  world lives a little (user request, 23 November 2026: „Luft … drehende bewegende Sterne … Vögel und Fische“): the
  tree's crown sways in the wind (`TreeCrown`, `.tm-jump-crown`), puffs of wind drift through the sky, three birds flap
  across behind the houses, the stars of space twinkle and turn, now and then a shooting star, and in the lake two fish
  swim to and fro and bubbles rise (`SkyLife`, `LakeLife`) – each a small layer on a CSS loop of its own, standing
  still at the end. The way down is a part of the timer, a fifth of the time (`DIVE_SHARE`): it leaps off the moon,
  opens a parachute and sails down swaying from side to side (`swingCount`, `swingX`, `SWAY`, `SWING_MS`, tilting by
  `TILT`) past everything it climbed, slowly enough to see each height go by, lets go above the cake (`RELEASE_Y`) and
  drops into it spinning once (user feedback, 23 November 2026: the fall straight down in 4.5 s looked like a teleport).
  The cake on the meadow – the goal seen from the first second – bursts: whole layers swap for a smashed one (a cracked
  plate, the torn tiers, lumps and drips; `.tm-jump-cake-whole`, `.tm-jump-cake-smashed`) and pieces of cake, cream and
  cherries fly in every direction over the whole picture and stay where they land, on the meadow, the lake, the tree's
  trunk and steps and the skyscraper's wall (`BITS`, `BURST`, `.tm-jump-bit-x`/`-y`/`-spin`; user feedback: it should
  be broken everywhere). What it carries and what waits for it come and go by opacity keyframes written for the run
  (`gearLooks`, `shownFrames`: every keyframe names every property it changes, since a property left out of one is
  passed over, not held); what waits is drawn exactly as the fox will hold it (`AsFoxAt`, `ownBox`, `FoxJetpack`), so
  the two swap within one keyframe (`swapMs`). Every run makes all 24 moves from the lake to the moon (`MAX_MOVES`), a
  shorter one only quicker. No enemies, no falling off, no count of
  stars. A star caught plays a bright „ba-ding“ climbing the scale (spaced), the leap off the moon a whoosh, the landing a
  plop; a tap boings and lights the stars still hanging. Its card shows the fox in the cable car's basket between the
  treehouse and the skyscraper (`LATER` in `cardArt.tsx`, 0.23 of the run), since its middle is the lift with sky round
  it and in space the fox is too small to see on a card. Its name and lines (`jumpNames.ts`) were written English first
  and translated into every app language at once. The way, its stars and the cake stay within x 235–1340 (a tablet's
  4:3 cut with the paper's margin; `timer.test.ts` checks).
  **A game-look timer may be big** (user feedback with this rebuild): a world many screens tall or wide that the
  picture follows is welcome where it shows how far the way has come (here the heights), moved as one layer, and a
  long way is told by changing what the figure does on it (swim, hop, ride, float, fly) rather than by more of the
  same. A picture that is too simple or does not make sense (the Road Rug, whose car drove on while toys hopped off its
  road into a box, H-122) is taken out rather than kept.
- „Marble Jar“ 🫙 (`jar.tsx`, H-149, user request, 24 November 2026: a glass filling with marbles like Kettenreaktion's
  pegboard): a glass tube at the top holds a row of coloured marbles on a little latch (`TUBE`, `QUEUE`), under it a
  wooden board with five rows of nails (`NAIL_ROWS`, `NAILS`, `BOARD`), two slanting funnel boards (`FUNNEL`,
  `funnelY`) and a big preserving jar with a red ribbon round its neck (`JAR`, `JAR_PATH`). Each marble in turn drops
  from the latch, bounces off one nail in every row to the left or the right (a seeded walk, each bounce touching its
  nail, `wayOf`), rolls down the funnel to the middle, falls through the neck and rolls onto its place: the jar fills
  from its floor up, row by row, each row from its edges inwards (`SLOTS`, nine and eight in turn, 60 places). Every
  run drops all sixty into the empty jar (`MAX_MARBLES`), five minutes one every five seconds, a shorter run only
  quicker – and below ten ways' time each marble's way goes quicker too (`jarPlan`'s `pace`), so only a few fly at
  once. The releases are evenly spaced so the last lands as the time is up; behind it the others step down the tube,
  the latch opens for each (only where they come a second or more apart, else it stays open), and the one waiting on
  it wiggles once a second (`.tm-hop-wait`). Each marble is two layers on keyframes written for the run – across, and up
  and down with the falling and bouncing eases (`tm-jar-x-<i>`, `tm-jar-y-<i>`, `stepsRule`). A landing plinks (spaced),
  the end chimes; a tap plinks and lights the room still free in the jar (`StillToFill`, a box shrinking from the
  jar's shoulders to the marbles' top). Its card shows a marble bouncing down the nails (`LATER`, 0.509). Its name and
  lines (`jarNames.ts`) were written English first and translated into every app language at once; their recordings
  wait. Board, jar and every marble's way stay within x 235–1340, and the latch with the marble on it within what a
  phone on its side shows (y ≥ 120 with the bar: the first try had them cut off at the top; the tube's queue above may
  go off the screen there; `timer.test.ts` checks).
- „Abwechseln“ 🔁 (H-52): two children take turns with a toy. The time set is one turn. Its hourglass is the
  Sanduhr's own (`Hourglass` in `scenes.tsx`, user request, November 2026: one drawing, never a second one built
  beside it), standing between two floor cushions (`SWAP_SEATS`, the same way left and right of it): the fox child's
  (orange, with pointed ears sewn on) and the bear child's (brown, round ears). A lamp hangs over each. Whose turn it is
  shows at once from afar (user feedback, November 2026): that child's lamp is on and shines on its cushion
  (`SwapLight`), the other side lies in shade (`SwapShade`), and the toy sits on the lit cushion. The fox child begins
  (`FIRST_TURN`), its lamp on from the first second: once the page lies still the toy hops from in front of the
  hourglass onto its cushion – the sand only starts as it lands. No draw of who begins (the lamps clicking on and off at
  random were taken out, user feedback, 21 November 2026); a grown-up gives the bear child the first turn behind ⚙️. When the sand is through the lamps change, the toy hops over with a whoosh and a chime and
  the hourglass turns itself over – back and forth until a grown-up leaves with ✕ (with „bis um“ set, until then, each
  turn as long as the row's minutes; at the end both lamps shine). Behind ⚙️: the toy (Bobbycar, Puppe, Ball,
  `SWAP_TOYS`, kept as `toy`), „Wer ist dran?“ (starts that child's turn anew) and the time to the change. The turn is worked out from the clock (`turnAt`).
- „Tennis“ 🎾 (H-71) stood beside Abwechseln from 7 November 2026 and was taken out on 21 November 2026 (user request:
  poorly done). Its id `tennis` is gone from `PICTURES`, so a kept choice falls back to the first picture.
- „Wippe“ ⚖️ (H-109, `seesaw.tsx`, 21 November 2026, chosen as the best of H-108 to H-117; reworked the same day after
  feedback): Abwechseln on a seesaw, in its group after the hourglass, run by the same `SwapRun` (the fox child first,
  turns from the clock, „Wer ist dran?“, the same voice lines) – without a toy (a Bobbycar riding on the seat looked odd,
  so its toy choice is hidden there). The seesaw is the time: the seat of the child whose turn it is starts up high and
  sinks evenly the whole turn long until its underside lies on a tyre half buried under it (`SAW_TILT` worked out from
  `TYRE_TOP`), then the other seat, now up high, sinks – so the waiting child sees its own seat rise towards its turn.
  What tips it is a yellow chick walking along the plank (`Chick`, `WALKER`): from beside the low seat over to the high
  one, as long as the turn, its weight carrying the plank evenly with it; when the seat touches down (a soft bump and a
  chime) it turns round and walks back. Its legs swing and its body bobs at their own pace however long the turn is, so
  a ten-minute turn still plainly moves. The plank is big and steep (`SAW`: thick, the seats as far apart as the
  tablet's 4:3 cut allows, the pivot high, about 26° each way). The plank with its handles, the cushions on its seats
  (the shared `Cushion`, no figures) and its hub is one HTML layer turning round the pivot (`PLANK_BOX`): one CSS
  animation, `infinite alternate` with a turn each way, `alternate-reverse` when the bear child begins, its delay read
  once as the turns start (a delay changed on a running animation moves it); the chick walks in it by a second animation
  as long (`tm-saw-walk-*`), turns back the plank's turn round its feet (`tm-saw-back-*`, so it stays upright) and looks
  the way it walks. Two names of the same keyframes (`tm-saw-a`/`-b`, by `round` and `wake`) start them anew when a
  grown-up gives the turn and when the page comes back (`visibilitychange`: while hidden the animations' time can stand
  still while the clock runs on – the sinking seat was then the waiting child's). Before the first turn the plank already
  stands tipped for the fox child with the chick still beside the bear's seat; at the end it lies level, the chick in the
  middle. Whose turn it is: warm sun over that half (`SeesawSun`), the other half in shade (`SwapShade` with `edge` at
  the pivot). A tap lights the tyre the falling seat goes to (`SeesawGoal`). Its name („Seesaw“, „Wippe“) was written
  English first and translated into every app language on 22 November 2026.
- „Kugelbahn“ 🎱 (H-117 with H-115, `marbleRun.tsx`, 24 November 2026; user request: „von Weitem klar ersichtlich,
  welches Kind gerade dran ist“, two to four children): the last in the Abwechseln group, run by the same `SwapRun`,
  which takes turns among `turnChildren` (`TURN_CHILDREN`: fox, bear, rabbit, frog, the first `kids` of them, set behind
  ⚙️ „Wie viele Kinder?“, `settings.kids`; Abwechseln and the Wippe keep fox and bear). A wooden marble run hangs on the
  playroom's wall: a jar of marbles at its top left, four zigzag ramps (`RUN`, `RAMPS`) with round end pieces, and a
  bottom rail running right to left over the children's cups (`CUP_XS`, `CUP_W` per count), a hole with a flap and a
  funnel over each. The marble is the time: the whole turn long one marble rolls down at an even pace into the cup of
  the child whose turn comes next, its flap hanging open, and falls in as the turn ends (`marblePlan`: the fall a fixed
  quick moment, the rolling the rest; it spins at least half a turn a second however long the turn, and knocks softly
  at each end piece on the run's clock). Its way is two small layers on keyframes written for the turn
  (`tm-mr-<round>-<turn>-<wake>-go`/`-spin`, a new name for a new turn, a grown-up's new start and the page coming back).
  The cups are the children's places (in the mascots' colours for fox and bear, blue with long ears for the rabbit,
  green with eye bumps for the frog, no faces), each drawn as back and front with the marbles lying between them. Whose
  turn it is shows across the room: that child's strip of the room (halfway to the next cups) is lit warm, every other
  one lies in Abwechseln's dark shade, and the bar along the bottom takes that child's colour (`data-tone`). Who had a
  turn (H-115): the marble that fell into a child's cup stays there until every child has had a turn (`heldMarbles`),
  then the cups are empty again and the new round's first marble lies in the first child's; a new turn's marble comes
  in another colour (`MARBLE_COLORS`). The first turn begins with a marble dropping into the fox child's cup (`DROP_MS`).
  „Wer ist dran?“ names all children (`KID_NAMES`); changing the number goes on with the child whose turn it is if it
  still plays, else with the first. A tap lights the cup the marble goes to. The rabbit's and the frog's „Tauschen! …“
  (`MORE_TURN_TO` in `marbleNames.ts`) were written English first and translated at once; they wait for their recording
  (silent until then).
  At the end the picture's own sound, then children cheer (the `cheer` recording) while a warm light spreads over the
  picture (`.tm-done-light`), a friendly tune after it, then `GameEnd` with the picture's trophy (nothing rises, the trophy replaced it, user decision, November 2026) with „Nochmal“ and „Weiter“ (the next picture,
  the same minutes, `nextPicture`; „Weiter“ shows that picture's card, `TimerCardArt` as `next.art`, user request, 23
  November 2026). Every tap or key during the run answers (steam and a whistle, twinkling, the flame
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
train's halts, where the apples hang; tested), `SwapPlay.tsx` and `swap.tsx` („Abwechseln“: its turns, and its room,
lamps, cushions and toys), `seesaw.tsx` (the Wippe's playground, plank, stand and chick), `marbleRun.tsx` (the Kugelbahn's run, cups and marbles; `marbleNames.ts` its texts), `apples.tsx`, `caterpillar.tsx`, `clock.tsx`, `disc.tsx`, `flower.tsx`, `sunset.tsx`, `pizza.tsx`, `tidy.tsx`, `boxes.tsx`, `blocks.tsx`, `tunnel.tsx`, `jump.tsx`, `jar.tsx` (one picture each, `jumpFox.tsx` its fox's poses; `tidyNames.ts`, `boxesNames.ts`, `blocksNames.ts`, `tunnelNames.ts`, `jumpNames.ts` and `jarNames.ts` their texts), `hop.tsx` (a toy hopping
into its box, shared), `pause.tsx` (the run's clock, pause and start over), `keyframes.ts` (keyframes written for a run), `shown.tsx`
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
  over the time gets enough of them (24 slices, six candles one after the other, petals opening after the stalk has
  grown). Many pieces mean many moments: their sounds are spaced (`PIECE_SOUND_GAP_MS`), never a din.
- **Every length plays the whole story, only faster or slower** (user request, 24 November 2026): a picture's run is
  the same at 10 seconds as at 3 hours – every block, toy, apple, move and step of it, in the same order – and the
  length only changes how fast it goes. Never leave a part out for a short time (a house already half built, a climb
  starting further up, fewer toys, a slip that only comes on a long share) nor add parts for a long one; what a step
  takes in fixed milliseconds is capped by its share (`Math.min(X_MS, share * …)`), so it shrinks with it. The counts
  are constants (`MAX_APPLES`, `MAX_TOYS`, `PER_BOX`, `MAX_BLOCKS`, `MAX_DIG`, `MAX_MOVES`), never worked out from the
  time (`timer.test.ts` checks `TimerPlay`'s scenes), the train's stops too (`TRAIN_STOPS`). What counts real minutes
  or seconds keeps doing so: the ladybug's lap, the caterpillar's bite a second.
- **A bar along the bottom** (user request, 22 November 2026, H-124; `bar.tsx`): under every picture a paper track
  over nearly the whole width fills from its start at the left to a little flag at the right, in the picture's own
  colour (`.tm-play[data-picture=…] .tm-bar`, a new picture adds its colours there; Abwechseln the colour of the child
  whose turn it is, `tone`), a round marker at the fill's front. On by default, „Leiste unten“ behind ⚙️ switches it
  off (`settings.bar`). Fill, way still to go and marker each move by one CSS animation of `transform` as long as the
  run, started from the clock (`--tm-bar-delay`) and started again after a page turn or when the page comes back –
  never React per frame (`timer.test.ts`). With it the stage's middle moves up into the room above it
  (`.tm-with-bar .tm-stage`), so it lies under what matters instead of over the picture's foot, while the stage still
  reaches the screen's bottom edge (a dark strip showed under it on a tablet). The digits' note stands in the very
  bottom right corner beside the bar's end, and the bar ends left of it (user feedback, 22 November 2026: above the
  bar it looked set somewhere; `noteRoom` in `shown.tsx` gives `.tm-play` the note's width, `--tm-note-em`, and
  `.tm-note-digits .tm-bar` its room); tally marks, a row too wide for the corner, stay above the bar's right end. At
  the end the bar fades for the end's light, trophy and buttons. A tap lights its way still to go too (H-51).
- **Every timer can be paused and started over** (user request, 23 November 2026: „verbunden mit der
  Prozessleiste“; `pause.tsx`): a round paper button with two drawn bars (`ControlIcon`, like Kettenreaktion's pause)
  sits on the bar's start, the bar running out from under it (`--tm-pause-size`, `--tm-bar-left`; the bar lifted just
  enough that the button stays whole), at the same place where the bar is switched off. Paused, a veil darkens the
  picture with the big ▶ to go on and the round arrow to start the same timer over (`onAgain`), no words; a tap
  anywhere else on the veil or any key but Esc goes on, so a child who paused by chance is never stuck, while starting
  over always takes two taps. A tap on the picture pauses too (user decision, 23 November 2026: first only the bar's
  button was kept, then the user changed their mind): it still answers as always – its sound, the warm light, what is
  left lighting up (H-51) – and then the veil comes; keys only answer, they never pause, since children press them while
  watching. **Everything counts on the run's own clock** (`RunClock`,
  `usePausableClock`, `useRunClock`): the real clock less every pause, standing still while paused – the end, the
  pieces' sounds, the last notes, the caterpillar's bites, the alarm clock's digits, the note in the corner, the bar's
  and the seesaw's delays, whose turn it is. CSS animations stand still under `.tm-paused` and go on in step with it.
  A new picture or anything new worked out from the time reads `useRunClock().now()`, never `Date.now()`
  (`timer.test.ts` checks every file of a run). A clock time set („bis 17:30“) is no longer named behind ⚙️ once
  paused, since it ends later now. `.tm-play` is `overflow: clip`, never `hidden`: focusing the button at its foot
  scrolled the whole picture up.
- **The last moments are felt, never hurried** (H-124): `finalMs` (ten seconds, a quarter of a short run) before the
  end a warm light gathers from the screen's edges (`FinalLight`, one layer by `opacity`), the bar's marker and the
  flag's light swell softly once a second, and the last `FINAL_NOTES` seconds each sound one soft rising note, the
  last a second before the end's own sound. Never a blink, a flash, a faster pace or anything over the picture's
  middle: the picture itself runs on as always.
- **Detail lives in what runs and its own place** (user request, 22 November 2026: „interessanter und detaillierter“):
  a richer picture gets it in the thing itself and where it stands – the hourglass's turned posts and grained plates,
  the red disc's case on its feet, each candle's own wax colour (`WAX`, its top, drop and puddle alike) and brass
  dish, the pizza's mixed toppings lying across the cuts (`TOPPINGS`, drawn by every slice near them and cut by its
  wedge) – and in quiet texture of the backdrop (wallpaper, floorboards, a table's grain, all in `.tm-back`), never a
  new thing standing beside it (see „A picture makes sense as it is“). Still drawings stay `memo`, painted once.
- **The end is plain to see and hear**: the picture's own last step, then children cheering, a warm light over the
  picture and the trophy at the end – for every picture, Abwechseln's clock time too. Never a storm of confetti.
- **A picture makes sense as it is**: where something comes from and why it happens is plain (the water from a tap and a
  hose, never an endless can; no boat in a bucket, no flower opening for no reason – Eimer and Kuchen were taken out,
  user feedback, November 2026). A new picture is one whole small story a child knows from life, and shows nothing
  beside it: what runs down stands big where the eye goes first, and things only standing by (a windmill and a little
  house beside the moon and the sun) come out (user feedback, November 2026).
- **Things that run out one after the other show how one leads to the next** (user request on the Kerze, 24 November
  2026: „ähnlich wie bei Kettenreaktion“): a thing that ends sets off the next one visibly – a fuse from candle to
  candle whose spark lights the next wick – never a next one starting by itself with nothing between them; the link
  lies there from the first second, so the child sees the whole chain still to come.
- **What a thing stands on is seen** (user request on the Kerze, 24 November 2026: the table lay under the bar): the
  table, floor or shelf under what runs down shows whole above the bar on a phone on its side (about y 120–770 of the
  stage there), its edge and legs too, so nothing seems to float (`timer.test.ts` checks the table).
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
  toy lying beside one of two small cushions did not tell it; asked again on 21 November 2026, so the shade is dark,
  `rgb(28 30 70 / 0.6)`): the child's whole side changes – its lamp or sun on, the other side in plain shade – and the
  toy sits on that cushion, not beside it. Who begins is shown from the first second, never drawn at random: the fox
  child, on the left, begins, and a grown-up changes it behind ⚙️ (user feedback, 21 November 2026: the lamps' draw at
  the start was not wanted; `timer.test.ts` checks). A new way to show a turn keeps that: a big change of the whole side,
  never a small sign.
- **What runs slowly shows from afar that it moves, even on a long turn** (user feedback on the Wippe, 21 November
  2026: at bigger numbers its slow tilt looked still): next to the slow motion that is the time, something moves at its
  own steady pace (the chick's steps), and the slow motion itself is made as big as the picture allows (a big board,
  a steep tilt) – evenly, never speeding up or jerking.
- **A picture of taking turns plays out something toddlers know and do themselves** (user feedback, 21 November 2026:
  Tennis was poorly done and is taken out – a game two-year-olds hardly know, seen from the side so the ball's flight is a short arc in
  the middle, the players standing stiff, the ball hopping above the racket instead of lying on it, the time only a row
  of lights): a new one (the Wippe, H-109, and the Kugelbahn, H-117, do it; more ideas in H-108 to H-116) shows a scene from their own day (a
  seesaw, a swing, a ball rolled to each other), seen so the change crosses the whole picture, with what passes over
  really held or sat on, and the time in the very motion where it can be – and it thinks of the waiting child, who
  should see its turn coming. Whatever rides or walks on something that tips or turns stays upright (turned back the
  same way, as the Wippe's chick), and nothing rides along only to be there (the Wippe's toy on the seat looked odd), and a picture of taking turns is added to `TurnPicture`, `isTurns` and `LEVEL_IDS`, after the
  others in the Abwechseln group.
- **One drawing for one thing**: a thing two pictures show (the hourglass) is one component both use, never copied and
  drawn again with its own sizes (user request, November 2026; `timer.test.ts` checks the hourglass).
- **The cards' order is the user's** (November 2026: Rote Scheibe, Sanduhr, Kerze, Apfelbaum, Blume, Pizza, then the
  Wecker, then Tidy Up, Five Boxes, Block House, Treasure Tunnel and Up to the Moon, the Zug, Raupe and Sonnenaufgang, then
  the Marble Jar; Abwechseln last): keep it when adding a picture (a new one goes after these, before Abwechseln, unless the
  user says otherwise), and add it to the perf scenarios' list in `tools/perfScenarios.ts`, which taps each card by its
  name (`timer.test.ts` checks the order). Abwechseln is another thing to do than the pictures that run until the time
  is up – taking turns without end – so it stands in a group of its own after them (`GameMode.kind`, user request,
  November 2026), its tooltip says so (`SWAP_NOTE`) and „Weiter“ never leads into it (`TIMED_PICTURES`, `nextPicture`).
- **A card is its picture halfway through, no words** (user request and feedback, November 2026: the end showed too
  little of how a picture runs): a new picture gets its card from `SceneParts` by itself, its animations seeked to the
  middle (`holdAt`), and what its own clock counts in React (the caterpillar's bites, the Wecker's digits) counts once
  for that moment and no more (`still`). Where the middle shows little (the Sonnenaufgang between moon and sun), the
  card takes a later moment (`LATER`) – look at every card (`timer.test.ts`).

- **A figure on a way moves as it would in life** (user feedback on Up to the Moon, 23 November 2026): every kind of
  move has a pose of its own that uses arms and legs for it – stroking and kicking in the water, flapping while it
  hops, holding on where it hangs or rides – and the kinds differ plainly; it goes only where it could in life (wooden
  steps nailed up a trunk, a cable car on a rope, a lift in its shaft, never a house standing in a lake or a hop higher
  than a fox could leap; `timer.test.ts` checks the steps, the shore and every leap). Coming out of the water it walks
  on the ground before it hops, and its gear fits where it is (a snorkel and a mermaid's tail in the water). A hop is
  quick and bouncy – pushing off from a crouch, the body squashing and stretching like a rubber ball – while gliding
  ways (swimming, a lift, balloons, space) go slowly (user feedback, 23 November 2026: slow hops looked odd).
- **One thing changes hands, never two at once** (user feedback on Up to the Moon, 23 November 2026: the balloons
  waiting and the balloons held were seen at the same time): what waits for a figure is the very thing it then takes,
  drawn where the figure will hold it and swapped in one keyframe; what docks on (the jetpack) waits until the figure
  is right in front of it and comes onto it there (`timer.test.ts` checks both).
- **Nothing beside the goal may look like it** (user feedback, 23 November 2026: a grey rock with a flat top looked
  like half a moon next to the moon) – a second thing of the goal's shape and colour goes.
- **A game-look timer's world may live a little** (user request on Up to the Moon, 23 November 2026): wind, birds,
  fish, a swaying tree or twinkling stars round the way are welcome there, each a small HTML layer on a slow CSS loop
  by `transform` and `opacity`, behind the figure, never over what moves towards the goal, and still at `.tm-done`;
  the calmer pictures keep to „as few things and movements as can be“.
- **No fox or bear figure in any picture** (user feedback, November 2026): first a family standing by every picture was
  taken out (children wanted to tap it, and a timer to watch needs as few things and movements as can be), then the
  children that pushed the cart, held the hose and blew out the candle – drawn in SVG they looked odd, a bear with two
  brown circles for paws on the hose. A picture tells its story by itself (the cart rolling by itself, the hose in a forked
  stick, the last candle going out by itself); where it is about the real children (Abwechseln), a thing of theirs
  stands for them (the cushions in fox and bear colours, no face). `timer.test.ts` checks that no picture draws one.
  Tennis, whose players were the shared `Mascot` children, was the one exception and is taken out (21 November 2026).
  The one exception is Up to the Moon's fox child (`jumpFox.tsx`, user request, 23 November 2026): it is the figure doing
  the run, never one standing by, drawn with the shared head, arms, feet and tail of `Mascot.tsx`.
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
  off there (`RIGHT` in `timer.test.ts`). Many small things that go off together (a caught star's ring and sparkles)
  are one drawing in one layer that grows and fades, never a layer each: Up to the Moon's 24 stars with eight layers
  each, sparkles moved by `var()` in their keyframes, kept an old phone's main thread twice as busy (23 November 2026).
  After changing what moves, run the picture's perf scenario (`bun run perf timer-<name>`) and compare with the commit
  before.
- **A clock time behind us is never quietly tomorrow's** (H-60): the sheet asks „Bis morgen um …?“ and keeps the answer
  for that day only (`tomorrowFrom`); a kept „bis 17:30“ started after 17:30 asks again before it runs (`TimerStart`).
  The time left stands small in the picture's bottom right corner, letting taps through: minutes and seconds by default,
  tally marks or nothing when a grown-up chooses so behind ⚙️ („Zeit im Bild“). **The note never changes its width**
  while it runs (user feedback, 22 November 2026): its digits stand in cells of one width each (`DIGIT_EM`, the colon
  `COLON_EM`), the note as wide as the run's longest text (`digitsEm`), and gone tally bundles keep their room
  (`Tally slots`) – never a box that shrinks as „10:00“ becomes „9:59“ or a narrow 1 follows a wide 4.
- **A game-like picture moves towards its goal all the time** (user feedback on the Block House, 22 November 2026):
  what makes progress (a block carried, a toy put away) is seen moving the whole of its share – slowly, every second a
  little nearer, now and then a playful slip – never standing still and then hopping into place at its share's end.
  A figure moving along a way does the same (user feedback on Up to the Moon, 23 November 2026): each move leaves as
  the one before lands, so it is on its way every second, with something to stand on all the way – quick hops leave
  their time to the slow, gliding ways – and an ending (a fall, a dive) is a real share of the time, slow enough to see
  every station it passes – never a rush of a few seconds that looks like a teleport.
- **Time up is plain in every timer** (user feedback, 23 November 2026): the corner's note stays, showing a red „0:00“
  that blinks softly (the one blink allowed here, asked for by the user; still under `prefers-reduced-motion`), and an
  end that breaks something (the cake) scatters it widely, in every direction, not a small splash.
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
- **What it says** (H-72, `voice.ts`): each picture one short line as it starts, where it goes (said once the page lies
  still – `say` waits for it), „Gleich ist es so weit!“ with the bell (H-49) and one line at the end, what is there
  now; Abwechseln who begins as the first turn starts („Wer fängt an?“, from the draw taken out, is kept with its
  recordings but said by nothing), and „Tauschen! Jetzt ist das … dran.“ at
  every change (and when a grown-up gives the turn behind ⚙️). Nothing speaks before a grown-up starts a run with a
  card, lines after the first are queued so none cuts another off, and leaving stops the voice (`hush`). Every line is
  `Localized` in all app languages (November 2026) and said in the app language through `timerSay` (its English
  recording standing in where the language has none); `timerSaid(language)` lists them for the recordings. Only
  recordings play (`timerVoice`, ./stimme/, `bun run voice make --only timer`), never the browser's voice: a line without its recording stays
  silent (every app language but Russian recorded, November 2026). A new picture gets its two lines in `PICTURE_LINES` (the type asks for them), written
  English first and translated into every app language, German included, in the same commit (root `CLAUDE.md`, user
  decision, 22 November 2026): `PICTURE_LINES` takes `Texts`, the older lines German first and a new picture's English
  first; Tidy Up's stand in a file of its own (`tidyNames.ts`) that its own part in `languageStatus.ts` names in
  `files`. `timerSaid` and the 🎙️ list leave a line out of a language it is not translated into (its English recording
  stands in), and `timer.test.ts` keeps every line in every app language; a changed line of the older ones is changed in its
  German and in its translations.
- Its ideas are the area „Timer“ on `/management/` (`src/content/ideas/h-timer.ts`, H numbers shared with the
  Alltagshelfer): any time to set (H-59 to H-62), pictures that visibly change every second and show where they go,
  also over long times (H-45, H-63 to H-69), timers like a game played by itself (H-125 to H-133; built so far: blocks, tunnel, jump-and-run – a new one takes a genre the others are not, for variety), and new pictures. A new timer idea goes there, not into the Alltagshelfer.
