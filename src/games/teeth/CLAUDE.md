# Zähne putzen

Route `/zaehne/`.

Brushing timer in seven steps, as long as its song (no choice of minutes: the song's own length, about two minutes), in KAI order (chewing surfaces, outside, inside). It starts with a short story of where the sugar monsters come from (`origin.tsx`, about 15 s, can be turned off): a child's face fills the screen (on a wide one from the brows to the chin, `framingFor`), three sweets float big beside it or in the corners for a moment, then fly in an arc into the smiling mouth one by one, are bitten (a few bits break off and fall past the chin), chewed and leave sugar crumbs on the teeth, then the sun crosses the sky (evening: the day goes by) or the moon does and the sun comes up (morning: the night goes by) while each crumb grows into a monster, and the camera moves in from the head to the mouth (`.origin-camera`, a CSS zoom to `MOUTH_FOCUS`). The story's teeth stand in a scalloped gum too. The story, the sink and the mirror are one camera looking round the bathroom (`scenes.tsx`): from the face down to the sink, up into the mirror, and down again to tidy up – the old picture slides out while the new one slides in, never a cut. The child is happy about every sweet: its eyes follow it to its corner and down into the mouth, its brows go up; while it chews its eyes close happily and its cheeks glow. Then the sink (`prep.tsx`, can be turned off): a hand on a sleeve widening towards the viewer, coming up open and closing round the handle (its wrist turned against the brush, so the arm always comes up from below and in front of the basin, never out of it) takes the brush (white and blue tufts, rubber grip) out of its cup (it clinks), the tube squeezes a pea-sized, striped dab of toothpaste onto the middle of the bristles; a chrome tap stands behind the basin. The sounds of the story and the sink are `Cue`s (`ORIGIN_CUES`, `PREP_CUES`, ms from the start of their part, `cues.ts`) that `TeethPlay` plays when the clock passes them and skips on a jump: a cheer (`yay`) when the sweets come, the bonbon's `wrapper`, a crunch (`lolly`) or `munch` and `chew` for each sweet, „Mmmh“ (`yum`) after the last, the brush `clink`ing in its cup – CC0 recordings in `src/lib/sounds/` with a synth fallback, loaded before the prelude. `prelude.test.ts` checks every cue lies inside its part and every recording has its file. A small 3D mouth model (`jaw.ts`) shows each step from the right angle – mouth open or teeth together, head turned to the side, the jaw being brushed tipped to show its top or tongue side. Arrows on the lips show when to open or close the mouth. The teeth grow out of the gum: the gum line (`GUM_LINE` in `jaw.ts`) rises into a papilla between neighbouring teeth and arches down over each crown, each tooth's faces end there, and the gum's walls reach a little over the crown's foot (`GUM_OVERLAP`) with a darker rim (`GUM_RIM`); each tooth is drawn between its own piece of gum's top and its walls, so it stands in the gum. The gum's cheek-side wall reaches far past the lips (`GUM_CHEEK`), which cut it off, and the mouth's inside round the teeth is the cheek's pink (`CHEEK_INSIDE` in `mouth.tsx`): the dark of the mouth (`MOUTH_DARK`) shows only in the opening between the rows of an open mouth (`cavityPath`). The brush is a small 3D model too (`brush.tsx`: white and light-blue bristle tufts with a longer tip row, a rounded head, a thin neck, a green rubber grip; its foam grows over the first half minute, and then the lips foam too: see the rule on toothpaste foam), held as dentists teach it for each side (flat on the chewing surfaces, in the cheek pocket with the handle out of the corner of the mouth, tipped towards the gum inside) and glides along the row scrubbing, circling or wiping from gum to tooth. The brush is a layer of its own above the mirror (`.brush-layer`, an HTML layer with its own svg): React draws it only when it reaches the next tooth or turns, and the scrubbing, circling and wiping are CSS animations of that layer (`brush-swing`, `brush-wipe`), so a phone only moves a finished picture. There is no text on the picture at all, before, while or after brushing: only the picture, the controls (pause, „Von vorn“ – drawn signs, `ControlIcon`), the progress bar and the time right next to it (`.teeth-time`, hidden on narrow screens), all on one slim, quiet strip of paper (`.teeth-controls`), the part running now bigger with a golden ring: on a screen wider than tall it stands along the left edge under the ✕ with the bar running from top to bottom (`seekFromPointer` reads the bar's direction), so the mouth gets the whole height beside it; only held upright it lies along the bottom. The progress bar shows the routine's four phases apart (user feedback, November 2026), each with its symbol beside it: eating sweets (the story, lilac, the sweet), getting the brush with its toothpaste (the sink, blue, the tube), the brushing itself – its seven steps in a green frame of their own (`.teeth-brushing`), the toothbrush riding along them to the clean tooth at its end – and putting the brush away (cheer and tidying up, blue like the sink, the cup); the first look in the mirror with its 3, 2, 1 ends the phase before the brushing (`preludeTiles`). On a screen wider than tall the two buttons stand side by side on top, the symbols in one column left of the bar, the grooves in one lane. The time before the brushing has a clock of its own in the same place: while it runs the time shows how long until the brushing starts (lilac pill), then the brushing time left. Sugar monsters sit on every tooth not brushed yet (only where the lip opening shows the tooth, see `insideBy` in `jaw.ts`), from the first look in the mirror; the ones to brush now glow and dance like jelly to the song (`teeth-monster-jelly`: squashed on each beat), the next one ducks and shivers (`teeth-monster-cower`), and each dissolves as the brush reaches it: for a beat squeezed flat under the brush so it bulges out past the head on both sides (`squeezedBy`), then stretched upwards, blurring and fading, while it falls apart from the top down into sugar grains in its colour and foam bubbles that drift off and melt (`MonsterDust`, `teeth-monster-dissolve`, `teeth-dust`, three beats each), silently: only the song plays while brushing. The mirror (and the story and the sink before it) fills the whole screen behind the heading and the controls: `useRoom` measures `.teeth-room`, the free part between them, and `fitBox` (`mouth.tsx`) zooms so what matters just fits there and the rest of the screen shows more face or wall around it. For the mouth that is the lips with the arrows on them (`mouthFocus`), taken from the view of the moment, so a closed mouth or one seen from the side zooms in as far as an open one; the frame keeps its thickness in px. The song always plays, no tapping needed, keeps the screen on; arrow keys skip steps, Space, the pause button next to the progress bar or a tap anywhere on the picture pauses (a tapped monster only giggles; user request, November 2026), „Von vorn“ beside it starts again from the story, and tapping or dragging on the progress bar jumps to the start of the section under the finger – a part of the prelude, a step, or the end's cheer, spitting and tidying (`sectionStart` in `seekBar.ts`; also while paused; the bar sits above the pause screen). At the end (`Ending` in `TeethPlay.tsx`) it is unmistakable that the brushing is done: the camera draws back to the whole laughing head (`faceFocus`, blended from the lips by `blendBox`), its teeth shining bright with white glints coming and going on them, a last sugar monster peeking in at the mirror's edge, dazzled, putting on sunglasses (`DazzledMonster`), a fanfare and children cheering (`cheer`) for two bars; then the mirror shows the child leaning over the basin (`spit.tsx`, X-18, two bars): its lips purse, a blob of the foam falls into the basin with a soft „ptü“ (`playSpit`, `SPIT_CUES`) and lands there as a flat splat, the foam on its lips gone with it – no cup of water to rinse the mouth, since the fluoride should stay on the teeth; then the sink once more (`Prep` part `tidy`, 16 beats): the foamy brush is scrubbed under the running tap until the foam is gone, goes back into its cup with a rattle and a clink, and the hand lets go, with twinkles round the cup (`PREP_CUES.tidy`, played by the end's clock like the prelude's); the controls and the bar stay through the cheer, the spitting and the tidying, the bar's last phase, so a grown-up can jump there too; then the grin again with the daytime's goodbye (spoken), the week chart's new star and the buttons, on a sheet of paper of their own (`.teeth-end`: the week above the trophy and „Menü“, everything on it sized by the sheet's width, `cqw`) – on a wide screen the head fills the left half and the sheet stands on the right, held upright it lies under the head – nothing else beside them (a cheering fox family stood there and was taken out, decoration a child wanted to tap, user feedback, November 2026). → skips to the buttons, Space starts again. The book on the shelf starts the brushing at once, with no start screen – its clock stands at the start (`held`, not paused) until the book lies open (`usePageStill`); ✕ and Esc go back to the shelf. Settings (`tinytaps.teeth.v3`) are only what is shown before (one choice for the story and the sink, taken at the start of each brushing so the clock never jumps) and the week chart, changed while playing behind ⚙️ held in the corner (`PlayOptions`); sounds always play and there is no read aloud (root `CLAUDE.md`).

What the voice says before and after the brushing (`PRELUDE_TEXTS`, `DONE_SAY`, `TIDY_SAY`) is plain data in `lines.ts`, so src/content/recordedLines.ts reads it without the game's drawings; `TeethPlay` adds the prelude's timing and sounds (`PRELUDE`).

Song (`music.ts`): `musik/musik-zaehneputzen-lied-<lang>.mp3`, one verse per step singing what the picture shows („Mund weit auf … hin und her“), the eighth part „Fertig! Blitzeblank“ on the end screen. It always plays, also when "🎵 Musik" is off on the home page: it is the brushing, not background music. It plays at the brushing time (from its first verse), so it follows pause and jumps. The voice says nothing during the steps and at the end, the song is the hint; only the prelude is spoken, and the song gets quiet while the voice speaks (it watches `talking()` of `src/lib/voice.ts`). Each step lasts as long as its verse (`sungSteps`, from the .json next to the song: where each verse begins), so the brushing lasts as long as the song (German 1:53, English 2:11, Russian 1:58, Spanish 1:49, Italian 1:52, Chinese 1:57, Hindi 2:11, Arabic 2:01); everything goes by `stepStarts`. The song starts loading as soon as the game is chosen in the menu (`preloadSong` in `TeethGame`, streamed so `useSongLoad` knows how far it is), and the story and the sink play while it loads. The brushing never begins without it: if it is still loading just before the countdown, the clock waits there (`Clock.until`, also at a point a grown-up jumps to) and a calm card says „🎵 Musik lädt …“ with a bar of how far it is, then goes on with 3, 2, 1. Only when the file can't be loaded at all, the synthesized `playTuneNote` tune plays and the voice says the steps. It begins with the first step. Before that, while the brush is fetched, the shared background song (`musik-hintergrund.mp3`) runs on from the menu (only while "🎵 Musik" is on); from the first step it is hushed (`useNoBackgroundMusic`), and back in the menu it goes on where it stopped. The last three seconds before the brushing are counted down big (3, 2, 1, under a drum roll that gets louder each second, `playDrumRoll`), and the brushing begins with „Los!“ and a „Tusch“ (`playTusch`) instead of the chime; during the whole prelude the time beside the progress bar shows the time until the start (lilac) instead of the brushing time.

The song is sung in the app language (🌐 on the home page, the language of the texts), German when there is no song in it (`sungLanguageFor` in `sung.ts`); there is no choice of song or language here. A language is just its two files: every `musik/musik-zaehneputzen-lied-<lang>.mp3` with its `.json` is found by its name (`sung.ts`); the lyrics for Suno are in `musik/suno-lied.md`. A new language: `/zahnputzlied`. The English song waits for the app to speak English.

Morning or evening (`daytimeOf` in `src/lib/days.ts`, by the clock: until 14:00 is the morning, no choice): in the morning the sun rises in the window at the sink (no sun or moon in a corner of the picture while brushing: taken out, user feedback, November 2026); in the evening the moon is out, the sleeve is a pyjama, the sky turns dusk and the end says „Gute Nacht“. Every finished brushing puts a star on a week chart (`week.tsx`, Monday to Sunday, a sun and a moon slot per day), saved under `tinytaps.teeth.week.v1` for two weeks; today's column is bigger, says „Heute“ and is tinted yellow in the morning and violet in the evening, and the slot of this brushing has a ring. It is shown only at the end, next to „Menü“ (`GameEnd menu`, a paper slip with the ribbon's shelf label: once brushed the child is done, so no „Nochmal“ – user request, November 2026 –, and there is no next level, so no „Weiter“; Space or „Von vorn“ still start again), never while brushing (can be turned off).

Languages: everything follows the app language (German, English, Chinese, Hindi, Spanish, Arabic, Russian; `useAppLanguage`/`useT` from `@/lib/language`), the start screen as well as what the child sees and hears. The steps' German texts are in `steps.ts`, the translations in `steps.<language>.ts` by step id (`STEP_TRANSLATIONS`, `stepText(step, key, language)`); morning and evening in `daytime.ts` / `daytime.<language>.ts` (`DAYTIME_TRANSLATIONS`, `daytimeText`); the prelude, the end, the buttons and the picture labels inline as `{ de, en, zh, hi, es, ar, ru }`. The sugar monsters are sugar monsters, monstruos del azúcar, 糖怪兽, चीनी-मॉन्स्टर, وحوش السكر, сахарные монстры. Every spoken line goes through `spokenIn` (`src/lib/language.ts`): the line in the app language with its voice, or where it is missing the German line with the German voice, never German words in another voice. `texts.test.ts` checks that the translations that are there belong to a step or daytime text that exists, Russian, Chinese, Hindi and Arabic in their own script with no Latin letters, and that a text with Russian has the other five too; it does not ask a German-only text for any.

The Tagesplan (`/tagesplan/`) opens this game for its 🪥 card (`src/lib/routine.ts`): the brushing starts at once,
outside play time, and ✕ goes back to the plan, which the finished brushing ticks.

For a YouTube video (user request, November 2026) `/management/video-zaehne/` (linked at the top of `/management/`,
`TeethVideo.tsx`, noindex, in the shared frame `VideoRecorder` of `src/components/`, which Aufs Töpfchen's video uses too) plays the whole routine once on a 16 : 9 stage: `TeethPlay video` shows only the picture – no
controls, week chart, end buttons or trophy, a click on the picture pauses nothing – and keeps nothing (no star, no
routine step, no play time: a `/management` address is a tool for `PlaytimeLock`). Morning or evening is chosen there
(`VideoRun.daytime`), language and child follow the shelf. In Chrome „🎬 Aufnehmen“ records its own tab with its sound
(`getDisplayMedia` with `preferCurrentTab`, cut to the stage by Region Capture, `MediaRecorder` as MP4, else WebM) and
saves the file once the sung finale has rung out (`songEndMs`); „▶ Nur abspielen“ plays in fullscreen for a recorder of
one's own; Esc stops. Voice, sounds and song are fetched while the page is read (`preloadBrushing`), so nothing comes
late in the video. A new thing shown beside the picture (a control, a chart, a button) stays out of the video.

## Rules

- Every drawing of the child (the face in the mirror, `mouth.tsx`; the face and shoulders in the story, `origin.tsx`;
  the arm in its sleeve at the sink, `prep.tsx`) follows „Junge / Mädchen“ from the home page (`useFigure()`, F-04): the
  girl has two pigtails with pink bands and lashes at her eyes – in the mirror often only the eyes are in sight – and
  wears clothes of her own (`clothes.tsx`: a pink T-shirt in the morning, berry pyjamas with little hearts in the
  evening, where the boy wears violet and blue pyjamas with yellow dots; user request, November 2026). Only colours and
  the pyjama's pattern differ, never shapes or poses; a new drawing of the child's clothes takes them from
  `clothesOf` / `PyjamaPattern`, never a colour of its own. Mouth, teeth, brush and monsters are the same for both; the
  song and the lines say nothing of boy or girl.
- The face is clean skin: nothing sits on it round the mouth or on the chin (breakfast crumbs stuck there in the
  morning and looked like pimples, user feedback, November 2026). The cheeks are a soft blush that fades into the skin,
  and they keep a gap of skin to the lips: in the mirror a wide open or stretched mouth pushes them up and out
  (`cheekSpots` in `jaw.ts`), and the story's sit beside the eyes, clear of the open mouth's corners even while they
  glow bigger (`CHEEKS`) – they once lay right on the corners and looked odd (user feedback, November 2026;
  `cheeks.test.ts` checks every step and the story).
- The monsters grow only in the story at the start. In the mirror they are already on the teeth: never let them pop up or arrive there (they only fade in softly as a side of the teeth turns into view), that would be a second, illogical origin.
- The gum always runs into the lips: never a strip or wedge of the mouth's dark between gum and lips, from the front
  or the side (user feedback, November 2026). Round the teeth lies the inside of the cheek, and dark only between the
  rows of an open mouth; a new part of the mouth keeps it so (`jaw.test.ts` checks the gum's walls in every step).
- A brushed monster dissolves, never just pops away (user request, November 2026): body and grains are HTML layers of
  its sprite (`MonsterDust`), moved by transform, opacity and filter, never an animation inside its svg
  (`layers.test.ts`), and the grains are few and calm – sugar and foam of the picture, no stars or confetti.
- A monster the brush reaches is plainly caught by it, though the brush lies in front of it (user request, November
  2026): for the dissolve's first beat it is squeezed flat and bulges out past the head's edges on both sides, across
  the head where the head is thinnest on the screen (`squeezeOut` in `brush.tsx` measures the head's box there,
  `squeezedBy` in `mouth.tsx` turns that back through the monster's lean and asks for enough stretch to reach
  `SQUEEZE_PAST` of its half-width beyond the head) – never a squeeze so small that the brush hides it. It stays a
  transform of the sprite's HTML (`--squeeze-a`, `--squeeze-k`), and its grains come loose only after that beat.
  `squeeze.test.ts` checks.
- Toothpaste foam grows with the brushing as at home (X-31, user's idea, November 2026): bubbles on the bristles first
  (`FOAM` in `brush.tsx`), then clumps of white foam in both corners of the mouth, then on the lower lip's middle, then
  more along it (`LIP_FOAM`, `FOAM_FROM_MS`, `foamStage` in `foam.ts`) – never on the upper lip, never over the teeth
  being brushed (each clump lies on its point of the lips, set a little out from the mouth's middle, `FOAM_OUT`), and
  never in the far corner a profile doesn't show. Each clump is a small `Sprite` of its own (`.lip-foam`, `FoamClump`)
  that fades in once over two beats and stays through the cheer – quiet and still, no bubbles that rise, burst or bob,
  and no sound – until the child spits it out (X-18, `spit.tsx`): there the spit picture draws the same clumps on its
  own lips, which shrink and fade as the lips purse, and the splat lies in the basin into the tidying (`.prep-spat`).
  It never fades away on its own before. `foam.test.ts` checks.
- While brushing only the song is heard: a monster dissolves silently, no fizz or other sound of its own (user
  feedback, November 2026; `layers.test.ts` checks `TeethPlay`). A tapped monster's giggle stays, since the child set it off.
- The brush is a child's brush, its head about a milk molar long (`SIZE` in `brush.tsx`, at most 0.75, `brush.test.ts`),
  and on the back teeth' outside its handle comes out of the corner of the mouth towards the viewer (`CHEEK_ANGLE`), so
  it hides as few teeth and monsters as it can: a bigger brush lying along the row covered the molars being brushed
  (user feedback, November 2026, asked twice – the brush was made smaller two times).
- The teeth change size step by step from the back molars to the front teeth: each tooth a little narrower and its
  chewing surface a little shallower than the one behind it (`TEETH`, `CHEWING_DEPTHS` in `jaw.ts`), never two big
  molars and then a row of flat ones alike (user feedback, November 2026; `jaw.test.ts` checks).
- The child in the mirror is the child of the story: hair, ears, eyes with brown irises, brows, nose and lips are the
  same parts (`face.tsx`), drawn flat in the story and turned with the head in the mirror (`KidFace` in `mouth.tsx`
  places them with `onHead`). A change to how the child looks is made there once, never in only one of the two (the
  end's face once had a plain fringe and black dot eyes and looked like another child, user feedback, November 2026;
  `face.test.ts` checks both draw from it).
- The story's mouth is a child's happy smile: a soft, rounded shape with lips round it (`TOP_CURVES`, `BOTTOM_CURVES` in
  `origin.tsx`), wider than deep with its corners turned up and tucked in, a small rounded tongue and short, rounded
  milk teeth, never a shape of straight lines and sharp points nor a mouth from cheek to cheek, which looked like a
  grown-up's (user feedback, November 2026, asked twice). It shows a child's real number of teeth, ten above and ten
  below (user feedback, November 2026: six above and four below were too few): each row is the mirror's arch seen from
  the front (`rowOf`, `TOOTH_ARCS` in `jaw.ts`), so the teeth narrow towards the corners as the row curves away and the
  molars are a little shorter, the lower row inside the upper one – never ten equal teeth in a line. `story.test.ts` checks.
- A sweet flies as a thing really flies (user feedback, November 2026): an arc – it lifts a little, then swoops down
  into the mouth faster at the end, turned the way it goes (`.origin-sweet-x` across, `.origin-sweet` up and down, two
  nested `Piece`s) – and at the bite it is squeezed and gone before the lips close over it, while a few bits in its
  colours break off and fall past the chin (`BITS`, `.origin-bit`, each a `Piece`). Never a straight glide, never just
  fading out, and never a celebration round it: no hearts or stars rise (the hearts were taken out, user feedback,
  November 2026) – the child's eyes and the chewing say it is happy.
- The week chart shows only at the end, never before the brushing (user feedback, November 2026): beside the sink it
  took the room and beside the first look in the mirror it pushed the face off-centre, so the face jumped when the song
  began. `controls.test.ts` checks.
- The child's eyes are a picture book's, never staring (user feedback, November 2026: the story's face looked creepy):
  a big warm brown iris filling most of the eye (`FACE.eyes.iris`), a dark brown rim and pupil (never the ink's violet),
  a big light up on the outside; the upper lid (`EyeLid`) is an arc of the eye's own outline, never a line through
  the white, which met the outline in a dark crescent over the pupil (user feedback, November 2026; `face.test.ts`); the iris is clipped to the eye's white (`eyeOpening`; an HTML clip, `.origin-eye-clip`,
  in the story, a clipPath in the mirror) and the lid (`EyeLid`) lies over it, so it never swims free in the white or
  pokes out. Its looks are small and calm, and it goes back to rest only while the eyes are closed happily over the
  chewing (`LOOK` lasts the sweet's showing and 600 ms more): an iris snapping back while seen looked unnatural.
- The story's child chews with its lips closed (`ClosedMouth`, `teeth-origin-chew-lips`): the open mouth closes over
  the sweet and hides, the closed lips chew twice, a beat each, the jaw going down a little to one side and then the
  other, then the mouth opens again – never the open mouth squashed flat into a slot of teeth (user feedback, November 2026).
- Seen from the side (the outside steps, `yaw` 70) the mouth is drawn as a side view (`profileOf`, `viewedLips`,
  `profileLine` in `jaw.ts`, `profileCut` in `mouth.tsx`): the face's outline with its nose runs down the front, past it
  only the mirror's glass shows, the lips are seen from the side – only their near half, ending round at the front – and
  every tooth stays inside the mouth behind them, growing out of its gum, the front teeth too: they show only their
  narrow sides, turning away towards the front, with a band of gum over and under them (`PROFILE_LIPS`: the lips end in
  front of the front teeth, past their gums). Front teeth standing out past the lips with no gum looked plainly wrong
  (user feedback, November 2026, replacing the earlier rule that had them stand out). It comes in as the head turns past
  50°, never at once, and only with the teeth together – never by fading its opacity: half see-through, its glass and
  lips lay over the front view's lips and gum for a moment and looked broken (user feedback, November 2026). Its
  outline slides in from the head's own edge on the far side, where it covers nothing, to the face's front
  (`profileParts`), so the far cheek goes behind it as if the head turned on. The face's outline stops at the upper lip
  and goes on from the lower one, never drawn across the mouth between them (`profileOutline`): a straight ink line
  from lip to lip lay as a black contour in front of the teeth (user feedback, November 2026). `jaw.test.ts` checks the
  lips end in front of the front teeth, `layers.test.ts` that the cut has no opacity and the outline is broken at the mouth.
- A monster sits on its tooth, not over its neighbours: keep `MONSTER_SIZE` (`mouth.tsx`) small, and the story's monsters about a tooth wide.
- A monster clings to its tooth, a little sticky (user feedback, November 2026): a puddle of its sugar under it, drips
  in its colour hanging from its foot (`MONSTER_DRIPS`, a little different per kind), little paws pressed flat onto
  the tooth on both sides (`MONSTER_PAWS`) and a wet shine on its head – all drawn in `Monster`, so the story's are the
  same. `layers.test.ts` checks.
- Nothing yellow marks the teeth to brush (user feedback, November 2026): a gold frame pulsing on each of them was
  taken out – their grey-yellow stain and their monsters say which they are. The glow behind a monster being brushed
  is only just round it (`.sprite-glow`, `monster-glow` r 21), never a wide halo reaching onto the gum. `layers.test.ts` checks.
- A monster lies on its tooth's face like a sticker, in the face's perspective, never upright in front of it: on a face
  turned away (the front teeth seen from the side) it is squashed along the way the face turns, as much as it is turned
  (`leanOn`, at most to `MIN_LEAN`), so it clings to the tooth – upright they looked as if they flew before the teeth
  (user feedback, November 2026). The lean is a transform of its `Sprite` (or its group while waiting), never a
  drawing of its own.
- The story is short (about 15 s): it explains, the brushing is the game.
- Every picture before the brushing flows into the next (`Scenes`): no cut, the camera slides or zooms (two beats, `SCENE_MS`).
- The end must say „you did it“ without reading: a picture of success (grin, cheer, the trophy handed over) right when the brushing ends, then the routine is finished as at home (spit out, rinse the brush, put it back in its cup) before the buttons come. Keep the end about as long as the prelude parts, not longer than the sung finale: cheer, spitting and tidying are 32 beats (17.2 s), within every finale but Hindi's (14.3 s, whose last three seconds of tidying go on without the song).
- Spitting out (X-18) is a picture of its own in the camera's round (`Scenes`: down from the mirror to the child over the basin, down again to the sink), since the sink is seen through the child's own eyes and can't show its face. It is one view of the head, shoulders, counter and basin, every moving thing (the lean, the smile, the pursed lips, the foam, the blob) an HTML `Piece` of its own animated by its transform and opacity over the part's two bars (`teeth-spit-*`, all `SPIT_MS` long), the „ptü“ on the beat where the blob leaves the lips. No cup of water, no words. `spit.test.ts` checks. On the slow phone (`bun run perf zaehne`) the stretch „Ende, Ausspucken und Aufräumen“ first goes back to the cheer's start (`TO_THE_END`), since the jumps before it run on past the end to the buttons – until November 2026 it measured only the still grin; a new part of the end lengthens that stretch.
- Pictures are cute and use the whole screen: big round head, big eyes with shines, soft colours; zoom (`FOCUS`) onto what matters instead of drawing it small in the middle.
- The teeth and the brushing are as big as the screen allows (user request, November 2026): the screen is held
  sideways, so the mouth is drawn wider than deep (`MOUTH_WIDE` in `jaw.ts`: arches, teeth, gums, tongue, palate and
  lips alike) and the open „Aaah“ not much taller than wide (`GAP_OPEN`, the lips' `above`/`below`) – a tall open mouth
  left most of the screen to an empty palate. On a wide screen nothing lies under or over the mouth: the controls stand
  as a slim strip along the left edge, the end's week, trophy and „Menü“ on a sheet at the right – never a row under the
  picture there, which took a fifth of a phone's height from the teeth. `jaw.test.ts` and `controls.test.ts` check.
- That strip runs the whole height, from just under the ✕'s corner to the bottom, with one even gap (`--teeth-gap`) to
  the ✕'s corner, the picture's left edge and its bottom edge – measured inside the book's paper margin (`--frame`),
  never from the screen's edge, and never capped in height (user feedback, November 2026: on tablets and phones it stood
  off the edge, its left side under the paper margin and short of the bottom). On the left it lies at the paper margin
  with a small gap even where a camera's cut-out leaves a safe area, as the ✕'s corner does – stepped in by it the
  strip stood far off the edge on a phone (user feedback, November 2026). Beside the picture each phase outside the
  brushing is only as tall as its symbol and the brushing's seven steps get all the rest of the strip's height, so a
  step is big enough to tap on a phone, though no longer as long as its time against the phases' (user feedback,
  November 2026: they were 8 px; held upright the steps take twelve shares to a phase's two). `controls.test.ts` checks.
- What the child should see stays still long enough to be seen (at least a bar, 2.14 s) before it moves on; nothing whizzes across.
- Every motion goes with the song (112 BPM): durations are beats (0.536 s), two beats or bars, and nothing loops faster than a beat (a tapped giggle may be quicker). Write new timings that way (`STROKE_S` in `brush.tsx`, the beat comment in `teeth.css`).
- No words on the picture, ever – no heading („Süßes essen“, „Geschafft!“), no hint for grown-ups („Erbsengroß“, „Ausspucken“), no goodbye line (user feedback, November 2026): the picture, the song and the voice say it, the trophy handed over by `GameEnd` says „well done“ (no medal of its own: it was taken out for the trophy, user feedback, November 2026). The names of the prelude parts and the steps live in the progress bar's tooltips. `controls.test.ts` checks.
- The bar shows what each part of the routine is (user feedback, November 2026: a sweet at the start and a tooth at
  the end said nothing of it): every phase is apart and marked by its own picture – eating sweets, getting the brush,
  the brushing's steps in a frame of their own, putting the brush away – and nothing of the routine happens off the
  bar (the tidying once came after the bar had gone). A new part of the routine joins the phase it belongs to, or
  becomes a phase of its own with its symbol. `controls.test.ts` checks.
- The bar's pictures (user request, November 2026: the strip should look nicer) are Gemini pictures from
  `bilder/symbole/` (`symbols.ts`, `TEETH_SYMBOLS`, queued with Aufs Töpfchen's in `src/games/potty/symbolPictures.ts`):
  the sweet, the toothpaste tube, the clean tooth at the end of the brushing's frame and the brush in its cup, and the
  toothbrush riding along the brushing's steps to where the clock is (`.teeth-runner`, a small HTML layer moved by its
  transform from `--at`, never a redraw; it comes with the brushing, so it never lies over the groove of getting the
  brush). Along the upright bar (a screen wider than tall) it lies across the steps, handle on the left by the bar's
  symbols, its head pointing from the side like an arrow at the step running now, just short of its groove – never
  turned head down onto the groove, which it hid (user request, November 2026; `layers.test.ts`). Never an emoji in
  their place: all five are painted (the tube and the cup came on 23 November 2026, and their drawn stand-ins went); a
  new symbol not painted yet leaves its place empty (`BarSymbol`) or gets a drawn stand-in in the painted set's manner
  until it comes. Tapping and
  dragging on the bar reads only its `.teeth-segment`s.
- The controls are drawn signs (`ControlIcon`), never emoji (⏸️ ▶️ looked poor, user feedback, November 2026), and each says what it does at a glance: „Von vorn“ is a ring with a real arrowhead turning round (a bent hook didn't look like an arrow, user feedback, November 2026); the time before brushing shows where the brushing time does, as the first part of the progress bar with its own clock, never in a corner of its own.
- A tap or drag on the progress bar lands at the start of a section – a part of the prelude, a step, or the end – never at the
  very second under the finger (`sectionStart`, user feedback, November 2026; `seekBar.test.ts`). The sections are the
  bar's grooves as they are seen (`sectionStarts`), never parts hidden inside one: a tap low on the sweets' groove once
  started only the monsters growing (user feedback, November 2026); a drag jumps only when
  it reaches another section. Everything follows the clock after a jump (user feedback, November 2026). The story's and the sink's pictures are CSS
  animations that start with their part (`at-<part>`), so after every jump `TeethPlay` sets them to where the clock is
  in it (`jumps`, `getAnimations`); a new animation there belongs to its part too, never runs on from an earlier one. Their pause
  rules are `!important`, since a part's rule with the `animation` shorthand is more specific and kept them running.
  `controls.test.ts` checks.
- The toothpaste is a pea-sized dab, as much as a child's brush gets – never a stripe along the whole head (user feedback, November 2026).
  No stars or twinkle when it goes on (user feedback, November 2026; `prelude.test.ts`).
- At the sink the hand comes up open, calmly, while the brush still rattles in its cup, and closes round the handle
  before it lifts the brush (`OpenHand` under `Fist`, `teeth-prep-open-hand` / `teeth-prep-close-hand`); at the end it
  opens again to let go. A fist coming up already closed round nothing looked unreal (user feedback, November 2026).
- The lips never jump while the head turns or the mouth opens: how far the corners are pulled open is worked out for
  where the glide is going and blended from where they were (`glideStretch`, `glide` in `Mouth`), never worked out
  from each in-between picture – the half turned, half open mouth asked for far wider corners than either end, and on
  the turn onto the left outside the lips sprang open and shut (user feedback, November 2026; `jaw.test.ts` checks
  every glide).
- A monster only sits where its tooth shows through the lip opening, at least `LIP_EDGE` inside it (`insideBy`, tested in `jaw.test.ts`); never on the lips. And the teeth being brushed always show whole, with their monsters: seen from the side the near corner of the mouth would hide the back teeth, so the corners are pulled open sideways as far as the step needs, as the brush pulls a cheek (`openCorners`, `TOOTH_CLEAR` in `jaw.ts`; `jaw.test.ts` checks every step – the corner once hid them, user feedback, November 2026). Never draw the lips so a step's teeth hide behind them.
- The week chart always makes clear which day it is and whether it is morning or evening. The days' names are a little
  bigger than their sun and moon (`.teeth-day-name`) in broad columns, never small print under them, and today stands
  out at a glance – much bigger, lifted, a strong colour, a broad frame and a big „Heute“ – yet still, never pulsing
  (user feedback, November 2026, asked twice).
- Translations are made at once (root `CLAUDE.md`, user decision, 22 November 2026): a new text is written English first and gets every other app language, German too, in the same commit – inline as `{ en: "…", de: "…", … }` (`EnglishFirst`, which `t` and `spokenIn` take); the steps' and daytimes' texts are German in `steps.ts` / `daytime.ts` with the other languages by id beside them, so the first English-first one teaches `stepText` / `daytimeText` a text's first language, with a test, never by writing it German first after all. A changed text of the older German-first ones is changed in its German (`{ de: "…" }`) and in its translations (`steps.<language>.ts` / `daytime.<language>.ts`), never keeping a stale one; what is missing goes into `src/content/ideas/languageStatus.ts`. Every translation is short, warm, present tense, "ты"/tú/तुम, no past tense or gendered words about the child ("Сахарных монстров больше нет", not "убежали"); Hindi uses commands and "let's" (चलो), Arabic "we" (هيّا ن…).
- Say every line through `spokenIn`/`stepText`/`daytimeText` and `say`, which plays its ElevenLabs recording (`stimme/`, Tapsi's voice, October 2026; where the language has no recording of a line its English one plays, else nothing – `spokenIn` carries the English text as `english`); two lines that may be in different languages are said one after the other (`queue`), never joined into one string. A line that is not queued cuts off what is being said, so an effect that says something only on a change (going on after a pause) must not say it when the game mounts: that once cut off „Guten Morgen!“ before the first cue. A new or changed line is listed for recording by `src/content/recordedLines.ts` and stays silent until `bun run voice make --only zaehne` (only when the user asks).
- Never switch the song in, or decode it, while brushing: a song that arrives mid-brushing makes the picture stutter on phones. It loads from the start screen on, and the clock waits for it before the countdown (with „Musik lädt …“ and a bar when it is late); the stand-in tune is only for a song that can't load.
- 3D parts drawn as flat faces are stacked by the planes between them, never by sorting their middles: a small part next to a long one (a bristle tuft at the far end of the head) can have its middle nearer and show through the plastic. The brush's boxes all lie apart along one of its axes (`drawOrder` in `brush.tsx`, checked in `brush.test.ts`); a new part has to as well.
- The mirror is pictures on top of each other (`mouth.tsx`), each a layer of its own (`.mouth-moving`) over the still one (face, teeth, gums), which is built once per view (`useMemo`): the stains fading on the teeth being brushed, each a small HTML layer (`ToothStain`); the lips and the waiting monsters, which stand still; the monsters being brushed now, the arrows on the lips and the end's dazzled monster (`DazzledMonster`), each a small HTML layer of its own (`Sprite`, `.mouth-sprite`) whose sway, tremble, glow, nudge and twinkle move the HTML round its little svg (`.sprite-body`, `.sprite-glow`, `.dazzle-body`, `.dazzle-glasses`); the end's shine on the teeth (`.teeth-shine`) is an svg of its own, fading in and breathing as a whole, never something inside an svg; the mirror's glass and frame, drawn in screen px (its own viewBox, which never changes, so a turning head doesn't paint it again); then the brush. A CSS animation inside an svg has the phone paint that svg again in every frame, and even small ones kept its main thread busy: never animate anything inside an svg here (the glow once pulsed in one svg with the lips, the monsters swayed and blinked in one the size of the screen, the face blinked in the still picture – each had the phone paint the screen anew many times a second). So nothing blinks in the mirror. Never put something that changes with the clock into the still picture, and keep what the clock passes to the moving parts the same from tick to tick (`PlacedMonster` is `memo`, `tickle` a `useCallback`, places rounded): redrawing the whole mouth with every 200 ms tick made the brushing stutter on phones.
- The brush's shape is drawn for the stop it is nearest and only turns when it reaches the next one (then it settles, rounded, so a brush holding still writes nothing to the page); gliding between stops only moves its layer. Its layer is only as big as the brush (`reach` in `brush.tsx`): a layer the size of the screen had a phone paint whole bands of the screen again each time the brush turned.
- Phones must keep up (`bun run perf zaehne` stays within its budget on the old Android; run it after changing what
  moves). What moves on every frame is an HTML layer moved by CSS (`transform`, `opacity`): the brush's strokes, the
  scene slides, the story's camera. Never redraw the brush, a monster or a picture per frame from React, and never
  animate an SVG attribute or a big svg's group. Only the monster being brushed now moves; the waiting ones stand
  still (no blink, no sway). The one per-frame redraw is the mirror while the head turns or the mouth opens (`gliding`): keep it
  cheap – the model is built once per step of opening (`mouthAt`), points are formatted by rounding (`fmt`), and a
  monster's drawing is kept while only its place changes (`PlacedMonster`). Every layer with the picture's viewBox is
  painted whole in each of those frames, so as few as possible are drawn then: the stains' layers and the sparkles wait
  until the head holds still, and the lips with the waiting monsters join the still picture meanwhile (one screen per frame
  instead of four, November 2026). Nothing that stays put on the screen (the mirror's frame and glass) takes the
  picture's viewBox. Where a device can't draw such a frame well within its time (an old phone), the glide
  draws every other frame only (`useGlidingView`: after two frames missed or drawn slowly – it renders inside the frame
  with `flushSync`, so it can time the drawing – it paces itself to about 30 a second), so the picture keeps moving
  evenly instead of stuttering; a fast device draws every frame. `bun run perf zaehne` plays the whole routine in
  stretches one after the other, with no waits between them: a stretch started after a wait missed the monsters
  growing, which painted far over budget (November 2026) – a new part of the routine gets its stretch there in its
  place, never after a wait of its own.
- The story (`origin.tsx`) is still pictures – the sky behind, the child – with every moving thing between and on them
  an HTML layer of its own (`Piece` in `piece.tsx`, `.teeth-piece` inside `.teeth-space`, which is picture units on the screen, `pictureSpace`): the
  sun or the moon, the brows, pupils, happy eyes, cheeks, the chewing mouth with its crumbs and monsters, the sweets and
  the bits they break into. A piece draws in picture units and its keyframes stay those of the one picture; its `area` is where it
  lies, and a transform origin is the middle of that area or set on it. All of them once moved inside the one picture
  the size of the screen, and „Süßes“ painted 36–38 screens a second (budget 30). A new moving thing in the story is a
  `Piece` too, and what moves is its HTML, never something inside its svg: the growing monsters sway as their piece's
  svg (`.origin-monster > svg`) and the `Monster` drawn inside is `still` (it once swayed and blinked inside, and the
  monsters had the camera's whole layer painted 60 times a second). The sky changes colour by two more skies, each an
  svg of its own over the first, fading in by their opacity (`SKY`, `.origin-sky-1`, `-2`) – never an animation of a
  fill or colour, which also painted the whole screen in every frame while the monsters grew (November 2026). Every
  keyframe of `teeth.css` animates only transform, opacity or filter; `layers.test.ts` checks.
- The sink (`prep.tsx`) is built the same way: one still picture (wall, tiles, window sky, basin, tap) and every
  moving thing a `Piece` over it – the sun rising in the window (inside a clip the size of the glass), the tube and its
  squeeze, the brush with its paste and foam, the water and its drops, the hand and the twinkles. The brush and the
  hand move with the same keyframes but in two layers (`BrushMoves` twice), so the cup's glass lies between them: the
  brush stands inside the glass and the hand holds it in front – in one layer the hand vanished behind the glass.
  A new moving thing at the sink is a `Piece` too; `layers.test.ts` reads `prep.tsx` and checks. A layer that only
  lies still on top (`.prep-still`) takes no `will-change`.
- At the end the teeth plainly shine and sparkle (user feedback, November 2026): a bright shine over them, a soft
  light round the lips (`smile-halo`), and white glints of light coming and going slowly on the front teeth one after
  the other (`Glint`, `GLINT_TEETH`, `.tooth-glint`: each a `Sprite` whose HTML grows and fades, about four beats a
  glint, round every four bars). White light only, with a faint cool edge so it shows on white teeth – never gold, never
  fast, never big (gold and quick flashes over a tooth and a half were too strong), never a drawn star with an ink line
  (stars twinkling on the teeth looked out of place) and never an emoji. The end shows the whole laughing head, never only the lips, and the surprise is a sugar monster that
  peeks in at the mirror's edge, dazzled by the clean teeth, and puts on sunglasses – never on the teeth themselves, which are
  clean now.
- The teeth start a little yellow and grey and turn white as they are brushed, tooth by tooth, and sparkle (see below)
  (user request, November 2026). In the story the sugar stains them while the monsters grow (`StainedTeeth`, a `Piece`
  fading in by its opacity, `teeth-origin-stain`); in the mirror every face a step brushes is stained until the brush
  has taken all of its monsters off (`dirtyFaces` in `stains.ts`): a soft yellow, grey-yellow plaque along the gum (on a
  chewing surface in its fissure) and two grey spots (`StainedFace`, `STAIN_FILLS`, `STAIN`) – a picture book's stain,
  never brown or rotten – and a stained front has no light on it, so a brushed tooth gains its shine. The still picture
  draws the faces being brushed now white already (only while the head holds still: gliding they are stained in it
  like the rest), and each one's stain lies over it in a small HTML layer of its own the size of that face
  (`ToothStain`, `.tooth-stain`), with everything the still picture draws over that face (its gum's walls, nearer teeth,
  the other row) masked out of it by their outlines in plain black, worked out once (`StainGeometry.cut`, `rims`) – never
  by drawing those things again through a filter that turns them black; once clean it fades in a beat by its opacity.
  Never fade a stain inside the mirror's svg nor rebuild the still picture as each tooth is done (`stains.test.ts`). The
  yellow fill and the gold frame that once marked the teeth to brush are gone: the stain and the monsters mark them.
- A brushed tooth is a beautiful white (user feedback, November 2026): its front pure white, its other faces a cool
  white a breath darker (`TOOTH_FILLS`), never cream. It sparkles only once the brush has reached the next tooth
  (`brushLeft`), after a beat's pause, and then every brushed face of the view sparkles on while the head holds still,
  not only the last one (`sparkling`): two small glints a face, faint and slow, coming and going in turn every two
  bars (`SPARKLE_SIZE`, `.tooth-glint.brushed`, `teeth-sparkle`) – never one big glint over the tooth, nor a flash while
  the brush still lies on it, where it was hardly seen (user feedback, November 2026). `stains.test.ts` checks.
- The story's teeth stand close, neighbours nearly touching (`rowOf`, `story.test.ts`): gaps between them looked like
  teeth lost (November 2026).
- The story shows the mouth as big as it can (user feedback, November 2026: zoom in more, so the child sees more): on a
  screen clearly wider than tall (a phone on its side, a computer) it frames the face from the brows to the chin, the
  sweets appearing beside it at cheek height and the sun or moon starting in the top left corner clear of them
  (`FACE_FRAMING`); only where that would show the picture smaller (a tablet, upright) the whole head with the sweets
  in the corners above it (`HEAD_FRAMING`, `framingFor`). The camera then moves in until the lips fill the height
  (`MOUTH_FOCUS`). A new thing in the story has its place in both framings.
- Animate only with keyframes this game defines (`teeth-…`) or the shared ones in `src/styles/animations.css` (`pop-in` …); another game's keyframes only exist after that game was opened (`css.test.ts` checks).
- The song is the brushing, not background music: it sings the steps and sets how long they last, so it always plays, also when "🎵 Musik" is off, and there is no "plain music" or "no song" choice.
- What the app already decides is never a setting here: the song's language is the app language (the language of the texts), sounds and voice are no switches at all (root `CLAUDE.md`), the daytime is the clock. Never add a second choice for the same thing.
- Settings are few, with short labels that start with an emoji; options that belong together are one `Choice` („Vorher zeigen“: 🍬 + 🪥 / 🍬 / 🪥 / ⏩), explained in one short `setting-note` below.
- A sound that comes a moment later (the end's fanfare and cheer) is set through `later` of `useTimers` (`src/lib/timers.ts`), never a bare `setTimeout`, so it is dropped when the game is left before it and never sounds in the menu (`src/lib/timers.test.ts`).
