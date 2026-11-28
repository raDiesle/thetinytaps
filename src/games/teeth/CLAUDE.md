# Zähne putzen

Route `/zaehne/`.

Brushing timer in seven steps, as long as its song (no choice of minutes: the song's own length, about two minutes), in KAI order (chewing surfaces, outside, inside). It starts with a short story of where the sugar monsters come from (`origin.tsx`, about 11 s, can be turned off): a child's face fills the screen (on a wide one from the brows to the chin, `framingFor`), a red apple and a lollipop (the same at any time of day, user request, November 2026: everyday food leaves sugar too, X-19) float big beside it for a moment, always whole on the screen (`sweetPlace`), then fly in an arc into the smiling mouth one after the other with no pause between them, are bitten (a few bits break off and fall past the chin), chewed and leave sugar crumbs on the teeth, then each crumb grows into a monster („Aus dem Zucker wachsen kleine Zuckermonster.“, `PRELUDE_TEXTS.grow` – the same morning and evening: no sun or moon crosses the sky and the sky keeps its one calm colour, so the story says nothing of day or night, user request, November 2026), and the camera moves in from the head to the mouth (`.origin-camera`, a CSS zoom to `MOUTH_FOCUS`). The story's teeth stand in a scalloped gum too. The story, the sink and the mirror are one camera looking round the bathroom (`scenes.tsx`): from the face down to the sink, up into the mirror, and down again to tidy up – the old picture slides out while the new one slides in, never a cut. The child is happy about every sweet: its eyes follow it to its corner and down into the mouth, its brows go up; while it chews its eyes close happily and its cheeks glow. Then the sink (`prep.tsx`, can be turned off): a hand on a sleeve widening towards the viewer, coming up open and closing round the handle (its wrist turned against the brush, so the arm always comes up from below and in front of the basin, never out of it) takes the brush (white and blue tufts, rubber grip) out of its cup (it clinks), the tube squeezes a pea-sized, striped dab of toothpaste onto the middle of the bristles; a chrome tap stands behind the basin. The sounds of the story and the sink are `Cue`s (`ORIGIN_CUES`, `PREP_CUES`, ms from the start of their part, `cues.ts`) that `TeethPlay` plays when the clock passes them and skips on a jump: a cheer (`yay`) when the food comes, the apple's crunch, the lollipop's crunch (`lolly`), `chew` after each, „Mmmh“ (`yum`) after the last, the brush `clink`ing in its cup – CC0 recordings in `src/lib/sounds/` with a synth fallback, loaded before the prelude. `prelude.test.ts` checks every cue lies inside its part and every recording has its file. A small 3D mouth model (`jaw.ts`) shows each step from the right angle – mouth open or teeth together, head turned to the side, the jaw being brushed tipped to show its top or tongue side. Arrows on the lips show when to open or close the mouth. Right after the toothpaste, before the mirror is seen, comes the lion (X-26, `lion.tsx`, one scene and one phase of the bar, prelude part `lion`, 37 beats, `LION_MS`; user requests, November 2026: the lion's phase and the roaring's became one, and the lion alone was shortened): the camera fades to a lion (drawn in SVG for now, a painted one may replace it) close up for only a beat, then draws back to the story's child beside it (`StoryHead`, `StoryShoulders` in `storyChild.tsx`, the same child the spitting shows) by beat 3 (`BOTH_SEEN_BEAT`), about as big as the lion and already in its lion costume – the mane is on from the start. Meanwhile Tapsi's voice says what comes („Before we brush, let's roar like a lion – three times!“, `PRELUDE_TEXTS.lion`), and before each of the three rounds (`ROUNDS`, roars on beats 13, 21 and 30) a call of its own tells the child to roar now, `CALL_BEATS` before it („Open wide – and roar!“, „Once more – even louder!“, „And one last time – really loud!“, `LION_CALLS` in `lines.ts`, queued after what is still being said). Nothing on the picture counts or shows when: three marks in the sky that filled before each roar were taken out (user request, November 2026) – the voice says it. On each roar both mouths are wide open and both roar together (`ROAR_CUES`), and soft waves go out from both mouths. Each round is louder (`gain`) and a little longer (`open`, and its own longer recordings) than the one before. The six roars – the lion's and the child's of each round, `lion-roar-1…3` and `child-roar-1…3` – are ElevenLabs sound effects (made 27 November 2026, `src/lib/sounds/README.md`: the lion's at about −18 LUFS, the child's a little under at −20, each round's as long as its mouths stay open), played at the round's loudness (`playRecorded`'s `volume`); the synthesized `playRoar` and `playLittleRoar` sound only where a recording could not load. After the last roar the child's mouth stays open. Only then the mirror (prelude part `monsters`, nine beats plus the 3, 2, 1): the mouth is already wide open from the front (`ROAR_VIEW` in `steps.ts`), the sugar monsters on the teeth and the voice's „Oh no, there they are!“, with no arrows on the lips, and it stays open through the countdown, so the first step, also open, only tips the lower jaw – the child in front of the screen roars along and its mouth is open before the brush comes. A song loading late is waited for before the lion (`waitAt`), so the lion's roaring, mirror, 3, 2, 1 and the song run straight on. The teeth grow out of the gum: the gum line (`GUM_LINE` in `jaw.ts`) rises into a papilla between neighbouring teeth and arches down over each crown on the cheek side (on the tongue side it is one smooth arc, `innerGumAt`), each tooth's faces end there, and the gum's walls reach a little over the crown's foot (`GUM_OVERLAP`) with a darker rim (`GUM_RIM`); each tooth is drawn between its own piece of gum's top and its walls, so it stands in the gum. The gum's cheek-side wall reaches far past the lips (`GUM_CHEEK`), which cut it off, and the mouth's inside round the teeth is the cheek's pink, a little darker than the gum (`CHEEK_INSIDE` in `mouth.tsx`), stretched taut from the upper row to the lower beside the last teeth: the dark of the mouth (`INSIDE.dark` in `inside.tsx`) shows only in the opening between the rows of an open mouth (`cavityPath`), and in it the throat, the tongue and the palate (`MouthInside`, see the rule on the inside of the mouth). The brush is a small 3D model too (`brush.tsx`: white and light-blue bristle tufts with a longer tip row, a rounded head, a thin neck, a green rubber grip; its foam grows over the first half minute, and the gum round the teeth brushed foams too: see the rule on toothpaste foam), held as dentists teach it for each side (flat on the chewing surfaces, in the cheek pocket with the handle out of the corner of the mouth, tipped towards the gum inside) and glides along the row scrubbing, circling or wiping from gum to tooth. The brush is a layer of its own above the mirror (`.brush-layer`, an HTML layer with its own svg): React draws it only when it reaches the next tooth or turns, and the scrubbing, circling and wiping are CSS animations of that layer (`brush-swing`, `brush-wipe`), so a phone only moves a finished picture. There is no text on the picture at all, before, while or after brushing: only the picture, the controls (pause, „Von vorn“ – drawn signs, `ControlIcon`), the progress bar and the time right next to it (`.teeth-time`, hidden on narrow screens), all on one slim, quiet strip of paper (`.teeth-controls`), the part running now bigger with a golden ring: on a screen wider than tall it stands along the left edge under the ✕ with the bar running from top to bottom (`seekFromPointer` reads the bar's direction), so the mouth gets the whole height beside it; only held upright it lies along the bottom. The progress bar shows the routine's phases apart (user feedback, November 2026), each with its symbol beside it: eating sweets (the story, lilac, the sweet), getting the brush with its toothpaste (the sink, blue, the tube), roaring with the lion (orange, the painted roaring lion `bruellen`; the open mouth in the mirror with the monsters and its 3, 2, 1 belong to it), the brushing itself – its seven steps in a green frame of their own (`.teeth-brushing`), the toothbrush riding along them to the clean tooth at its end –, spitting out the foam (the cheer and the spitting, blue like the sink, foam spat into the basin `spucken`) and putting the brush away (the tidying, blue, the cup) (`preludeTiles`, `PHASE_SYMBOL`). On a screen wider than tall the two buttons stand side by side on top, the symbols in one column left of the bar, the grooves in one lane. The time before the brushing has a clock of its own in the same place: while it runs the time shows how long until the brushing starts (lilac pill), then the brushing time left. Sugar monsters sit on every tooth not brushed yet (only where the lip opening shows the tooth, see `insideBy` in `jaw.ts`), from the first look in the mirror, after the lion; the ones to brush now dance like jelly to the song (`teeth-monster-jelly`: squashed on each beat), the next one ducks and shivers (`teeth-monster-cower`), and each dissolves as the brush reaches it: for a beat squeezed flat under the brush so it bulges out past the head on both sides (`squeezedBy`), then stretched upwards, blurring and fading, while it falls apart from the top down into sugar grains in its colour and foam bubbles that drift off and melt (`MonsterDust`, `teeth-monster-dissolve`, `teeth-dust`, three beats each), silently: only the song plays while brushing. The mirror (and the story and the sink before it) fills the whole screen behind the heading and the controls: `useRoom` measures `.teeth-room`, the free part between them, and `fitBox` (`mouth.tsx`) zooms so what matters just fits there and the rest of the screen shows more face or wall around it. For the mouth that is the lips with the arrows on them (`mouthFocus`), taken from the view of the moment, so a closed mouth or one seen from the side zooms in as far as an open one; the frame keeps its thickness in px. The song always plays, no tapping needed, keeps the screen on; arrow keys skip parts (on the dev server ← and → jump five seconds back or on instead, held too, anywhere in the game: `DEV_SKIP_MS`, user request, November 2026; ↑ and ↓ still skip parts), Space, the pause button next to the progress bar or a tap anywhere on the picture pauses (a tapped monster only giggles; user request, November 2026), „Von vorn“ beside it starts again from the story, and tapping or dragging on the progress bar jumps to the start of the section under the finger – a part of the prelude, a step, or the end's cheer, spitting and tidying (`sectionStart` in `seekBar.ts`; also while paused; the bar sits above the pause screen). At the end (`Ending` in `TeethPlay.tsx`) it is unmistakable that the brushing is done: the camera draws back to the whole laughing head (`faceFocus`, blended from the lips by `blendBox`), its teeth shining bright with white glints coming and going on them, a fanfare and children cheering (`cheer`) for two bars; then the mirror shows the child leaning over the basin (`spit.tsx`, X-18, two bars): its lips purse, a blob of the foam falls into the basin with a soft „ptü“ (`playSpit`, `SPIT_CUES`) and lands there as a flat splat, the foam on the gum gone with it – no cup of water to rinse the mouth, since the fluoride should stay on the teeth; then the sink once more (`Prep` part `tidy`, 16 beats): the foamy brush is scrubbed under the running tap until the foam is gone, goes back into its cup with a rattle and a clink, and the hand lets go, with twinkles round the cup (`PREP_CUES.tidy`, played by the end's clock like the prelude's); the controls and the bar stay through the cheer, the spitting and the tidying, the bar's last phase, so a grown-up can jump there too; then the grin again with the daytime's goodbye (spoken), the week chart's new star and the buttons, on a sheet of paper of their own (`.teeth-end`: the week above the trophy and „Menü“, everything on it sized by the sheet's width, `cqw`) – on a wide screen the head fills the left half and the sheet stands on the right, held upright it lies under the head – nothing else beside them (a cheering fox family stood there and was taken out, decoration a child wanted to tap, user feedback, November 2026). → skips to the buttons, Space starts again. The book on the shelf starts the brushing at once, with no start screen – its clock stands at the start (`held`, not paused) until the book lies open (`usePageStill`); ✕ and Esc go back to the shelf. Settings (`tinytaps.teeth.v3`) are which phases of the bar are shown – eating sweets (`origin`), getting the brush (`prep`), spitting out the foam (`spit`) and putting the brush away (`tidy`: rinsing it and putting it back), each switched on its own, the brushing to the song always (a locked row, roaring like a lion and 3, 2, 1 with it) – and the week chart, changed while playing behind ⚙️ at the end of the strip of controls, right by the bar (`PlayOptions inline`, held like ✕; user request, November 2026). The phases before the brushing are taken at the start of each brushing so the clock never jumps: switched while that prelude still runs, the brushing starts again with them, later they apply to the next one; spitting and putting the brush away follow their switches until the brushing is done. Left out, the cheer at the clean grin still comes – with spitting's phase where that is on, else with the tidying's, else ending the brushing's frame at its clean tooth – and then the buttons. Sounds always play and there is no read aloud (root `CLAUDE.md`).

What the voice says before and after the brushing (`PRELUDE_TEXTS`, `DONE_SAY`, `TIDY_SAY`) is plain data in `lines.ts`, so src/content/recordedLines.ts reads it without the game's drawings; `TeethPlay` adds the prelude's timing and sounds (`PRELUDE`).

Song (`music.ts`): `musik/musik-zaehneputzen-lied-<lang>.mp3`, one verse per step singing what the picture shows („Mund weit auf … hin und her“), the eighth part „Fertig! Blitzeblank“ on the end screen. It always plays, also when "🎵 Musik" is off on the home page: it is the brushing, not background music. It plays at the brushing time (from its first verse), so it follows pause and jumps. The voice says nothing during the steps and at the end, the song is the hint; only the prelude is spoken, and the song gets quiet while the voice speaks (it watches `talking()` of `src/lib/voice.ts`). Each step lasts as long as its verse (`sungSteps`, from the .json next to the song: where each verse begins), so the brushing lasts as long as the song (German 1:53, English 2:11, Russian 1:58, Spanish 1:49, Italian 1:52, Chinese 1:57, Hindi 2:11, Arabic 2:01); everything goes by `stepStarts`. The song starts loading as soon as the game is chosen in the menu (`preloadSong` in `TeethGame`, streamed so `useSongLoad` knows how far it is), and the story and the sink play while it loads. The brushing never begins without it: if it is still loading just before the countdown, the clock waits there (`Clock.until`, also at a point a grown-up jumps to) and a calm card says „🎵 Musik lädt …“ with a bar of how far it is, then goes on with 3, 2, 1. Only when the file can't be loaded at all, the synthesized `playTuneNote` tune plays and the voice says the steps. It begins with the first step. Before that, while the brush is fetched, the shared background song (`musik-hintergrund.mp3`) runs on from the menu (only while "🎵 Musik" is on); from the first step it is hushed (`useNoBackgroundMusic`), and back in the menu it goes on where it stopped. The last three seconds before the brushing are counted down big (3, 2, 1, under a drum roll that gets louder each second, `playDrumRoll`), and the brushing begins with „Los!“ and a „Tusch“ (`playTusch`) instead of the chime; during the whole prelude the time beside the progress bar shows the time until the start (lilac) instead of the brushing time.

The song is sung in the app language (🌐 on the home page, the language of the texts), German when there is no song in it (`sungLanguageFor` in `sung.ts`); there is no choice of song or language here. A language is just its two files: every `musik/musik-zaehneputzen-lied-<lang>.mp3` with its `.json` is found by its name (`sung.ts`); the lyrics for Suno are in `musik/suno-lied.md`. A new language: `/zahnputzlied`. The English song waits for the app to speak English.

Morning or evening (`daytimeOf` in `src/lib/days.ts`, by the clock: until 14:00 is the morning, no choice): the sun rises in the window at the sink (no sun or moon in a corner of the picture while brushing: taken out, user feedback, November 2026, nor in the story's sky, user request, November 2026); in the evening the moon is out in the sink's window, the sleeve is a pyjama and the end says „Gute Nacht“. Only the sink and the words round the story follow the time of day: the story itself and its monsters' line are the same morning and evening. Every finished brushing puts a star on a week chart (`week.tsx`, Monday to Sunday, a place for the morning and one for the evening each day), saved under `tinytaps.teeth.week.v1` for two weeks: a brushing done is a gold star on a bright green disc, one missed (its time over, `missed`) an empty grey disc with a dashed rim and its sun or moon faint in it, one still to come (`later`) only a faint dotted ring; today's column is bigger, says „Heute“ and is tinted yellow in the morning and violet in the evening, and the place of this brushing has a strong ring. It is shown only at the end, next to „Menü“ (`GameEnd menu`, a paper slip with the ribbon's shelf label: once brushed the child is done, so no „Nochmal“ – user request, November 2026 –, and there is no next level, so no „Weiter“; Space or „Von vorn“ still start again), never while brushing (can be turned off).

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
- While a chewing-surface step runs, the front teeth show no monsters waiting for a later step: on the lower ones while
  the lower molars are brushed, on both rows' while the upper ones are (`quietFront` in `steps.ts`, `waitingShown`;
  user feedback, November 2026: seen from above with the mouth wide open they stood in a row before the molars being
  brushed and only crowded the picture). Their stains stay; the monsters are there again when their step comes
  (`stains.test.ts`).
- The monsters grow only in the story at the start. In the mirror they are already on the teeth: never let them pop up or arrive there (they only fade in softly as a side of the teeth turns into view), that would be a second, illogical origin.
- The gum always runs into the lips: never a strip or wedge of the mouth's dark between gum and lips, from the front
  or the side (user feedback, November 2026). Round the teeth lies the inside of the cheek, and dark only between the
  rows of an open mouth; a new part of the mouth keeps it so (`jaw.test.ts` checks the gum's walls in every step).
  Beside the last teeth of the open mouth the cheek is stretched from the upper row to the lower like a band, taut
  (`CHEEK_INSIDE`, a pink a little darker than the gum): the dark is the straight outline round the two rows' chewing
  surfaces with only its corners rounded (`CAVITY_ROUND` in `cavityPath`) – a bulge out beside the last teeth looked
  slack and was taken out again (user feedback, November 2026; `stains.test.ts`). An opening that went on round to the lips, with folds of cheek drawn over the gum's end, left a gap
  between the rows that looked very strange and was taken out again (user feedback, November 2026): never draw the
  dark from the lips nor folds over the gum (`stains.test.ts`).
- On the tongue side the gum's edge is one smooth arc along the whole row, rounded like a bow, never papillae rising
  between the teeth (`innerGumAt`, `INNER_GUM_LINE` in `jaw.ts`): where the gum met the palate or the tongue, the
  papillae stood up as odd spikes (user feedback, November 2026; `jaw.test.ts`). The papillae stay on the cheek side,
  where they show the teeth growing out of the gum; the tongue side's gum shows only where it is brushed (see
  `lipSideOnly` below).
- The inside of an open mouth looks natural and soft, never a flat dark hole (user feedback, November 2026; the look
  „natürlich weich“ picked by the user from four drawn side by side): at the back the throat, darkest in its middle,
  with the soft palate arching over it and the uvula hanging from its middle; the tongue in soft pinks with no hard
  outline, a groove down its middle and a soft light – its whole top where the lower jaw is tipped to show it, else its
  back rising as a hump behind the lower teeth –; the hard palate with a few soft ridges across its front, never lines
  like scratches (`MouthInside` in `inside.tsx`, its colours `INSIDE`). It is part of the still picture built once per
  view, and nothing in it moves.
  The soft palate's sides reach only part way down beside the throat (`SOFT_PALATE_REACH`), never all the way to the
  tongue, where they stood as a thick wall of pink, and its lower edge is a little uneven, each side its own
  (`SOFT_PALATE_BUMPS`) – never ruler-straight, never a wavy line (user pick and feedback, November 2026).
- An open mouth's lips hug the rows, as a child's do (user pick from six drawn side by side, November 2026): wide open
  the corners come in close to the last teeth (the lips' `width` in `buildMouth` narrows as the mouth opens, at most
  1.2 times the outermost tooth wide), the gum shows only as a slim band above and below the teeth, and the lips get
  thinner stretched open (`LIP_STROKE` in `mouth.tsx`) – never a thick ring of pink round the teeth inside thick lips
  (`jaw.test.ts`).
- A jaw tipped to show its chewing or tongue side goes back into the mouth with perspective (`TIPPED_PERSPECTIVE` in
  `projectors`): its back teeth come out smaller and bend in towards the mouth's middle, the further back the more –
  drawn as big as the front teeth the row ran down the sides like a flat horseshoe (user feedback, November 2026). The
  front teeth keep their size and the effect grows with the tip, so nothing jumps as a jaw starts to tip
  (`jaw.test.ts`).
  Yet it lies flat, never a deep U: its back teeth rise above the front teeth only a little (`TIPPED_FLATTEN`) and bend
  in only a little across (`TIPPED_ACROSS`), so the row reaches out towards the lips' corners with no wide band of
  cheek beside it (user feedback, November 2026; `jaw.test.ts`).
- A row tipped to show its chewing surfaces shows its gum only on the cheek side and between its crowns: never a band of
  gum between the lower teeth and the tongue, nor above the upper ones' tongue side, which looked like a second row
  (`lipSideOnly` in `jaw.ts`, user feedback, November 2026). The inner steps, which brush the tongue side, keep that
  gum (`jaw.test.ts`). Nor does any gum lie over a tooth of such a row: seen tipped, a back molar's cheek side is a
  narrow strip, and the gum's wall reaching up its foot – deep and swung back over it by the perspective – covered it
  like flesh lying on the tooth (user feedback, November 2026), so its cheek-side wall is only `GUM_TIPPED` deep and
  drawn under the crown with the gum's top (`wallsUnder`, `jaw.test.ts`).
- The brush's foam is faint and varied (user feedback, November 2026: even white balls with a thick blue ring were too
  loud): small clumps, clear bubbles with a light and tiny dots, of different sizes, with a pale edge, and slightly
  see-through (`FOAM`, `FoamFleck` in `brush.tsx`; `brush.test.ts`). Never a row of equal balls, never so much that it hides
  the brush or the teeth: ten flecks, three at first (twelve were too many, seven then a little too few; user requests,
  November 2026), drawn in the brush's own layer so they ride on the bristles with every stroke and circle.
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
  (`FOAM` in `brush.tsx`), and white foam on the gum of each tooth brushed – between the lips and the teeth, along the
  tooth's gum line, never on the lips (clumps on the lips' corners and middle looked odd, user feedback, November 2026)
  and only on the teeth brushed already or being brushed now (`foamyTeeth` in `foam.ts`: a face no longer stained, or a
  tooth the brush has reached in this step, `reachedTeeth`), so it spreads with the brush. The foam lies only at the
  gum line, on the gum and a little up on the tooth, as the brush pushes it there (user feedback, November 2026), and
  little of it: clearly more on one tooth than on its neighbour, often a single bubble or none, never the same row of bubbles on
  every tooth (`FOAM_AMOUNTS`: none to two next to each other of `GUM_FOAM`, from a place of each tooth's own, about one a tooth – user request, November 2026: fewer foam bubbles; on the brush only a few flecks, three at first, `FOAM`, `FOAM_FIRST`). Its
  bubbles are faint and unlike each other – big beside tiny, sized apart on each tooth, a pale edge, a little
  see-through (user feedback, November 2026: subtler and more varied) – (`GUM_FOAM`, `GUM_FOAM_SPREAD`, `gumFoam`,
  `FoamBubbles`), kept
  only where the lip opening shows them, so the lips lie over the rest. The teeth brushed before carry it in the still
  picture; those of the step running now each in a small HTML layer under the lips (`.mouth-foam`, `GumFoam`,
  `.gum-foam`) that fades in once – quiet and still, no bubbles that rise, burst or bob, and no sound. When all is clean
  it lies on every tooth through the cheer, until the child spits it out (X-18, `spat` of `Mouth`), and is gone from then
  on; the spit picture shows the foam only as the blob leaving the pursed lips, never on them, and its splat lies in the
  basin into the tidying (`.prep-spat`). `foam.test.ts` and `spit.test.ts` check.
- While brushing only the song is heard: a monster dissolves silently, no fizz or other sound of its own (user
  feedback, November 2026; `layers.test.ts` checks `TeethPlay`). A tapped monster's giggle stays, since the child set it off.
- The brush is a child's brush, its head about a milk molar long (`SIZE` in `brush.tsx`, at most 0.75, `brush.test.ts`),
  and on the back teeth' outside its handle comes out of the corner of the mouth towards the viewer (`CHEEK_ANGLE`), so
  it hides as few teeth and monsters as it can: a bigger brush lying along the row covered the molars being brushed
  (user feedback, November 2026, asked twice – the brush was made smaller two times).
- Circling, the brush turns counter-clockwise on the screen (user request, November 2026): the circle is two swings,
  the second a quarter ahead (`.brush-move-across`), and `turnLeft` in `brush.tsx` turns the second's direction so the
  path runs counter-clockwise whatever way the head and the brush lie (`brush.test.ts`).
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
  taken out – their grey-yellow stain and their monsters say which they are. No glow lies
  behind the monsters either (user feedback, November 2026: a glow round each was taken out) – the monsters dancing to the
  song show which are brushed now. `layers.test.ts` checks.
- A monster lies on its tooth's face like a sticker, in the face's perspective, never upright in front of it: on a face
  turned away (the front teeth seen from the side) it is squashed along the way the face turns, as much as it is turned
  (`leanOn`, at most to `MIN_LEAN`), so it clings to the tooth – upright they looked as if they flew before the teeth
  (user feedback, November 2026). The lean is a transform of its `Sprite` (or its group while waiting), never a
  drawing of its own.
- The story's face, the sink and the mirror are cut to the frame by CSS (`FRAME_CLIP` in `mouth.tsx`, `clip-path:
  inset(…)` on the picture's svg), never by an svg `<clipPath>` found by its id: while the book opened, the screen's
  copy on its page held the same ids, and the whole face hanging on that clip vanished – only the eyes and the mouth,
  layers of their own, were left (user feedback, November 2026, reported twice; `layers.test.ts`).
- The story is short (about 11 s): it explains, the brushing is the game. Two foods, one right after the other, no pause between them or before the monsters grow (user feedback, November 2026: three foods with pauses took too long; `ORIGIN_MS`, `ARRIVE_MS`, `prelude.test.ts` keeps the story's two parts at most 11 s). Getting the brush waits for nothing either: each of its parts ends as its last motion does (`PREP_MS`, `prelude.test.ts`).
- What the story's child eats is food a child knows at a glance and really eats – bitten, never a thing it would
  drink from or eat with (user feedback, November 2026: the morning's mug of cocoa read as the child eating a cup, and
  the muesli's spoon on the left looked like a lump of metal; they became a banana and an apple, and later the apple alone). Its shape alone says
  what it is, with no tool, dish or wrapper round it that could be taken for the thing itself; a new one is looked at
  in the preview at 844×390 before it goes in.
- What the story's child eats is the same at any time of day (user request, November 2026, after X-19 had given the
  morning a breakfast of its own): an apple and a lollipop (`TREATS`), everyday food beside a sweet, so the
  child sees that both leave sugar. Never again one food for the morning and another for the evening, nor words about
  breakfast or day and night in the story (`prelude.test.ts`).
- Every picture before the brushing flows into the next (`Scenes`): no cut, the camera slides or zooms (two beats, `SCENE_MS`).
- The end must say „you did it“ without reading: a picture of success (grin, cheer, the trophy handed over) right when the brushing ends, then the routine is finished as at home (spit out, rinse the brush, put it back in its cup) before the buttons come. Spitting is a phase of its own after the song's brushing and before the tidying, with its own place on the bar, and a grown-up switches it off behind ⚙️ as the tidying (user request, November 2026; `spit.test.ts`); the song itself stays as it is. Keep the end about as long as the prelude parts, not longer than the sung finale: cheer, spitting and tidying are 32 beats (17.2 s), within every finale but Hindi's (14.3 s, whose last three seconds of tidying go on without the song).
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
  November 2026: they were 8 px; held upright the steps take twelve shares to a phase's two). The time and ⚙️ share
  the strip's last row as the two buttons share its first: each in a row of its own, the steps shrank to 4 px on a phone
  once the lion became a phase. A class a bar's tile carries (its phase, `eat`, `lion` …) is never a scene's own class
  too: the lion scene's root `.lion` laid the lion tile over the sweets' (`lion.test.ts`). `controls.test.ts` checks.
- What the child should see stays still long enough to be seen (at least two beats, 1.07 s) before it moves on, and no longer: a pause with nothing new is cut (user feedback, November 2026, on the story and the sink); nothing whizzes across.
- Every motion goes with the song (112 BPM): durations are beats (0.536 s), two beats or bars, and nothing loops faster than a beat (a tapped giggle may be quicker). Write new timings that way (`STROKE_S` in `brush.tsx`, the beat comment in `teeth.css`).
- No words on the picture, ever – no heading („Süßes essen“, „Geschafft!“), no hint for grown-ups („Erbsengroß“, „Ausspucken“), no goodbye line (user feedback, November 2026): the picture, the song and the voice say it, the trophy handed over by `GameEnd` says „well done“ (no medal of its own: it was taken out for the trophy, user feedback, November 2026). The names of the prelude parts and the steps live in the progress bar's tooltips. `controls.test.ts` checks.
- The bar shows what each part of the routine is (user feedback, November 2026: a sweet at the start and a tooth at
  the end said nothing of it): every phase is apart and marked by its own picture – eating sweets, getting the brush,
  roaring with the lion, the brushing's steps in a frame of their own, spitting, putting the brush away – and nothing of the routine happens off the
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
  their place: the tube and the cup came on 23 November 2026, the roaring lion on 27 November 2026 (the lion's head
  `loewe` went with the lion's own phase), and the foam spat into the basin (`spucken`) waits in the queue; a
  new symbol not painted yet leaves its place empty (`BarSymbol`) or gets a drawn stand-in in the painted set's manner
  until it comes. Tapping and
  dragging on the bar reads only its `.teeth-segment`s.
- The controls are drawn signs (`ControlIcon`), never emoji (⏸️ ▶️ looked poor, user feedback, November 2026), and each says what it does at a glance: „Von vorn“ is a ring with a real arrowhead turning round (a bent hook didn't look like an arrow, user feedback, November 2026); the time before brushing shows where the brushing time does, as the first part of the progress bar with its own clock, never in a corner of its own.
- A tap or drag on the progress bar lands at the start of a section – a part of the prelude, a step, or the end – never at the
  very second under the finger (`sectionStart`, user feedback, November 2026; `seekBar.test.ts`). The sections are the
  bar's grooves as they are seen (`sectionStarts`), never parts hidden inside one: a tap low on the sweets' groove once
  started only the monsters growing (user feedback, November 2026); a drag jumps only when
  it reaches another section. Everything follows the clock after a jump (user feedback, November 2026), also while
  paused: the part tapped is the one marked and shown at once (user feedback, November 2026: paused, the one before it
  stayed). So which part is on is found on the clock, summed as the sections' starts are (`introMs + at`, `pastEnd`),
  never by subtracting first (`brushed >= at`), which can land a hair under a start; and a paused jump to another
  picture shows it at once instead of sliding, since a paused slide stands on its first frame (`sceneAfter` in
  `scenes.tsx`). `seekBar.test.ts` and `scenes.test.ts` check. The story's and the sink's pictures are CSS
  animations that start with their part (`at-<part>`), so after every jump `TeethPlay` sets them to where the clock is
  in it (`jumps`, `getAnimations`); a new animation there belongs to its part too, never runs on from an earlier one. Their pause
  rules are `!important`, since a part's rule with the `animation` shorthand is more specific and kept them running.
  `controls.test.ts` checks.
- The lion (X-26) comes right after the toothpaste and before the mirror shows the open mouth (user request, November
  2026: first the lion, then the mouth open): the lion is shown first, only for a beat, then the child beside it,
  already in its costume – the mane never grows in later. It is one phase on the bar with the roaring's symbol, never
  two (user request, November 2026: the lion's phase and the roaring's became one, and the lion alone was shortened).
  Tapsi's voice explains it to the child – that we roar three times before brushing, and before each roar a call to
  roar now (`LION_CALLS`, `CALL_BEATS` before the roar) –, and nothing on the picture counts or shows how often or when:
  no numbers, no marks filling up (three marks in the sky were taken out, user request, November 2026). Both roar at
  the same time, never one after the other, each roar louder and a little longer than the one before, each round with
  recordings of its own, and waves go out from both mouths on the roar. Its point is the open mouth: the child's stays
  open from the last roar to the scene's end, the mirror after it shows it already wide open and it never closes before
  the first step. No words on the picture, no chime over the roars. Every moving thing (the camera, the mouths, the
  lion, the waves) is a `Piece` or an HTML layer, its keyframes all `LION_MS` long, with the roars on the beats where
  the mouths are just wide open (`lion.test.ts`, `prelude.test.ts`).
- The story's sugar monsters come whatever the time of day (user request, November 2026): no sun or moon in the
  story's sky, no sky turning to dusk or night, and their line says nothing of day or night (`story.test.ts`). Only
  the sink's window, the sleeve and the words before and after follow it.
- The toothpaste is a pea-sized dab, as much as a child's brush gets – never a stripe along the whole head (user feedback, November 2026).
  No stars or twinkle when it goes on (user feedback, November 2026; `prelude.test.ts`).
- The toothpaste tube never floats (user feedback, November 2026): at rest it stands upright on its wide flip-top cap
  on the counter (`TUBE_REST` in `prep.tsx`), with its shadow under it, and comes back to stand there after the dab –
  never lying with its cap end in the air (`sink.test.ts`).
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
  (user feedback, November 2026, asked twice). Brushed or not is seen across the room (user request, November 2026: a star beside a faint sun or moon didn't say it plainly): a brushing done is a star on a bright filled disc, one missed an empty grey disc, one still to come a faint ring – never told apart only by a faint icon or opacity.
- Translations are made at once (root `CLAUDE.md`, user decision, 22 November 2026): a new text is written English first and gets every other app language, German too, in the same commit – inline as `{ en: "…", de: "…", … }` (`EnglishFirst`, which `t` and `spokenIn` take); the steps' and daytimes' texts are German in `steps.ts` / `daytime.ts` with the other languages by id beside them, so the first English-first one teaches `stepText` / `daytimeText` a text's first language, with a test, never by writing it German first after all. A changed text of the older German-first ones is changed in its German (`{ de: "…" }`) and in its translations (`steps.<language>.ts` / `daytime.<language>.ts`), never keeping a stale one; what is missing goes into `src/content/ideas/languageStatus.ts`. Every translation is short, warm, present tense, "ты"/tú/तुम, no past tense or gendered words about the child ("Сахарных монстров больше нет", not "убежали"); Hindi uses commands and "let's" (चलो), Arabic "we" (هيّا ن…).
- Say every line through `spokenIn`/`stepText`/`daytimeText` and `say`, which plays its ElevenLabs recording (`stimme/`, Tapsi's voice, October 2026; where the language has no recording of a line its English one plays, else nothing – `spokenIn` carries the English text as `english`); two lines that may be in different languages are said one after the other (`queue`), never joined into one string. A line that is not queued cuts off what is being said, so an effect that says something only on a change (going on after a pause) must not say it when the game mounts: that once cut off „Guten Morgen!“ before the first cue. A new or changed line is listed for recording by `src/content/recordedLines.ts` and stays silent until `bun run voice make --only zaehne` (only when the user asks).
- Never switch the song in, or decode it, while brushing: a song that arrives mid-brushing makes the picture stutter on phones. It loads from the start screen on, and the clock waits for it before the countdown (with „Musik lädt …“ and a bar when it is late); the stand-in tune is only for a song that can't load.
- 3D parts drawn as flat faces are stacked by the planes between them, never by sorting their middles: a small part next to a long one (a bristle tuft at the far end of the head) can have its middle nearer and show through the plastic. The brush's boxes all lie apart along one of its axes (`drawOrder` in `brush.tsx`, checked in `brush.test.ts`); a new part has to as well.
- The mirror is pictures on top of each other (`mouth.tsx`), each a layer of its own (`.mouth-moving`) over the still one (face, teeth, gums), which is built once per view (`useMemo`): the stains fading on the teeth being brushed, each a small HTML layer (`ToothStain`); the lips and the waiting monsters, which stand still; the toothpaste foam on the gum of the teeth being brushed (`GumFoam`); the monsters being brushed now and the arrows on the lips, each a small HTML layer of its own (`Sprite`, `.mouth-sprite`) whose sway, tremble, nudge and twinkle move the HTML round its little svg (`.sprite-body`); the end's shine on the teeth (`.teeth-shine`) is an svg of its own, fading in and breathing as a whole, never something inside an svg; the mirror's glass and frame, drawn in screen px (its own viewBox, which never changes, so a turning head doesn't paint it again); then the brush. A CSS animation inside an svg has the phone paint that svg again in every frame, and even small ones kept its main thread busy: never animate anything inside an svg here (the glow once pulsed in one svg with the lips, the monsters swayed and blinked in one the size of the screen, the face blinked in the still picture – each had the phone paint the screen anew many times a second). So nothing blinks in the mirror. Never put something that changes with the clock into the still picture, and keep what the clock passes to the moving parts the same from tick to tick (`PlacedMonster` is `memo`, `tickle` a `useCallback`, places rounded): redrawing the whole mouth with every 200 ms tick made the brushing stutter on phones.
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
  monsters had the camera's whole layer painted 60 times a second). The sky is one still colour (`SKY`); it once changed
  colour by skies fading in over each other, never by an animation of a fill or colour, which painted the whole screen in
  every frame while the monsters grew (November 2026) – until the story stopped following the time of day. Every
  keyframe of `teeth.css` animates only transform, opacity or filter; `layers.test.ts` checks.
- The sink (`prep.tsx`) is built the same way: one still picture (wall, tiles, window sky, basin, tap) and every
  moving thing a `Piece` over it – the sun rising in the window (inside a clip the size of the glass), the tube and its
  squeeze, the brush with its paste and foam, the water and its drops, the hand and the twinkles. The brush and the
  hand move with the same keyframes but in two layers (`BrushMoves` twice), so the cup's glass lies between them: the
  brush stands inside the glass and the hand holds it in front – in one layer the hand vanished behind the glass.
  The brush itself is drawn twice too (`BrushDrawing` `back` and `front`): behind the glass while it stands in its cup,
  and in front of it from the moment it is lifted out above the rim until it hangs over the cup again, the two swapped
  by their opacity at that very keyframe (`teeth-prep-brush-out-*`, `-in-*`) – the glass never lies over a brush held
  outside it (user feedback, November 2026: the handle went behind the glass while the toothpaste went on;
  `sink.test.ts`).
  A new moving thing at the sink is a `Piece` too; `layers.test.ts` reads `prep.tsx` and checks. A layer that only
  lies still on top (`.prep-still`) takes no `will-change`.
- At the end the teeth plainly shine and sparkle (user feedback, November 2026): a bright shine over them, a soft
  light round the lips (`smile-halo`), and white glints of light coming and going slowly on the front teeth one after
  the other (`Glint`, `GLINT_TEETH`, `.tooth-glint`: each a `Sprite` whose HTML grows and fades, about four beats a
  glint, round every four bars). White light only, with a faint cool edge so it shows on white teeth – never gold, never
  fast, never big (gold and quick flashes over a tooth and a half were too strong), never a drawn star with an ink line
  (stars twinkling on the teeth looked out of place) and never an emoji. The end shows the whole laughing head, never only the lips, and no monster comes back there: a sugar
  monster peeking in at the mirror's edge with sunglasses was taken out (user feedback, November 2026) – the clean teeth
  and their glints are the end.
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
  (`brushLeft`), after a beat's pause, and then the faces the brush left last sparkle on while the head holds still:
  one or two in the whole view, one small flash a face, coming and going in turn every two bars
  (`SPARKLES_AT_ONCE`, `SPARKLE_SIZE`, `.tooth-glint.brushed`, `teeth-sparkle`) – never one big glint over the tooth,
  nor a flash while the brush still lies on it, where it was hardly seen, nor a glint on every brushed face, which was
  too much (user feedback, November 2026, twice). Each is a slim four-pointed flash with curved sides like the trophy
  sign's glints on the shelf, white with a faint cool edge (`Flash` in `mouth.tsx`), turning as it comes and goes in a
  short moment and hidden the rest of the time – never the end's star of rays (`Glint`), which was too much while
  brushing (user request, November 2026). `stains.test.ts` checks.
- The story's teeth stand close, neighbours nearly touching (`rowOf`, `story.test.ts`): gaps between them looked like
  teeth lost (November 2026).
- The story shows the mouth as big as it can (user feedback, November 2026: zoom in more, so the child sees more): on a
  screen clearly wider than tall (a phone on its side, a computer) it frames the face from the brows to the chin, the
  sweets appearing beside it at cheek height
  (`FACE_FRAMING`); only where that would show the picture smaller (a tablet, upright) the whole head with the sweets
  beside its top (`HEAD_FRAMING`, `framingFor`). The camera then moves in until the lips fill the height
  (`MOUTH_FOCUS`). A new thing in the story has its place in both framings.
- A sweet appears whole, never cut off by the screen's edge or lying under the frame or the controls (user feedback,
  November 2026: growing to one and a half times its size beside the face, it stood half off the screen): its
  framing's point is only where it would like to be, and `sweetPlace` moves it in just as far as its whole reach at
  its biggest (`SWEET_REACH`: grown, floating, turned and lifted before it flies) needs to stay inside the free room
  (`freeSeen`) with `SWEET_EDGE_PX` to spare. A sweet that grows bigger or moves further in its keyframes widens
  `SWEET_REACH` with it. `story.test.ts` checks it on a phone, a tablet, computers and upright, and that held sideways
  it stays clear of the eyes.
- Animate only with keyframes this game defines (`teeth-…`) or the shared ones in `src/styles/animations.css` (`pop-in` …); another game's keyframes only exist after that game was opened (`css.test.ts` checks).
- The song is the brushing, not background music: it sings the steps and sets how long they last, so it always plays, also when "🎵 Musik" is off, and there is no "plain music" or "no song" choice.
- What the app already decides is never a setting here: the song's language is the app language (the language of the texts), sounds and voice are no switches at all (root `CLAUDE.md`), the daytime is the clock. Never add a second choice for the same thing.
- Settings are few and live behind ⚙️ on the strip of controls beside the bar, never in the corner (user request,
  November 2026: what the bar shows is chosen where the bar is). The phases are one switch each with the bar's own
  painted symbol (`PhaseIcon`), in the bar's order, so a grown-up finds the same phases there – never a choice of
  combinations; the brushing to the song is a locked row, always on: nothing of the song's steps can be left out or
  skipped by a setting. A new phase of the routine gets its switch there. The choice is kept for every brushing.
  `controls.test.ts` checks.
- A sound that comes a moment later (the end's fanfare and cheer) is set through `later` of `useTimers` (`src/lib/timers.ts`), never a bare `setTimeout`, so it is dropped when the game is left before it and never sounds in the menu (`src/lib/timers.test.ts`).
