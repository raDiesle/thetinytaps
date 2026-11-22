# Aufs Töpfchen

Route `/toepfchen/` · idea H-06 (Töpfchen-Partys; built in the style of „Zähne putzen“, but tapped step by step).

A picture story like „Gefühle“: every step is a Gemini picture (`bilder/`, see its README) filling the screen,
its second frame (`-b`) fading in and out so the foxes move a little; a new picture fades in over the one before
(which stays below it meanwhile) and settles from a little closer. A step can play a tiny animation once before its
picture (`Step.moves`: trousers going down, sitting down; `StoryPicture`'s `moves`); with `Step.again` it plays again
after that pause, over and over until the story goes on (trousers down, so the child sees what to do while doing it). Drawn on top (SVG and CSS):
the picture shaking when the tummy rumbles, the call bubble (`CallBubble.tsx`: a speech bubble beside Tapsi's head
with only the potty in it, `fox-toepfchen`, cut out of `fox-bad`), while sitting the clock on the wall and the thought
bubble, and at the bottom the row of step icons (each one jumps there) with the
grown-ups' buttons on the right next to it.

The story (`PottyPlay.tsx`, once called „Muss mal!“): one story for both needs, since a child often can't tell beforehand.
The game has no modes. Opening it (its tile on the home menu) starts the story at once (`GameShell`'s `startMode`); it has
no start screen: ✕ goes back to the shelf, where the game stands as a book of its own. It opens on the first step, `eat`: Tapsi the fox
(`TAPSI` in `content.ts`) at the kitchen table, eating and drinking by turns (the `essen` and `trinken` pictures are that step's
frames, moving at once), and plays it like every other step once the book lies open (never while it still flies, `usePageStill`; its
step timers count from then too, `later`) – its line „Mmh! Tapsi isst Nudeln und trinkt Wasser.“
and its sounds (the tap on the card was the act; until November 2026 it waited for a tap and the line was never heard).
Every tap on the picture or background (anything but a button) and every key does the most sensible thing there
(`act`): „Weiter“ on every step, at once also while the step's sounds still run; while sitting a tap pauses the
waiting or goes on with it, like Zähne putzen (see the pause below), and a key brings the next thought (Space pauses,
Enter is the ✓ of what the child said). The first steps (eating, the need, calling, going to the bathroom; `Step.nudge`) never go on
by themselves, and there „Weiter“ ▶ swells and sends out a ring, since everybody waits for it. Sitting down goes on
into the waiting by itself and „fertig“ to wiping (`Step.auto`). „Weiter“ is on every step but sitting, where the ✓
are, and while the buttons for what the child said show.
While Tapsi calls Mama and Papa, a framed group „Was muss dein Kind?“ with three buttons (`SAID`: pipi, kaka, both – their symbols, both side by side) asks a
grown-up what the child said: a tap on one keeps the pick and begins the next step at once. So there is no „Weiter“
then; the three are yellow like it, each with its ▶, swelling one after the other. A tap on the picture still goes on,
with nothing picked. There is no ❓:
not knowing is the same as both (the user's choice), so `unsure` – the state before anybody picked, and after jumping
past calling in the row, when the group asks again on the way to the bathroom – plays like both, only saying „muss mal“.
The steps: eating and drinking, the bladder presses or the tummy rumbles (`need`; when
unsure – before calling, nobody has said anything yet – Tapsi „muss mal“, the bladder and the tummy picture take turns as frames, `picturesFor`, and the row shows both symbols, `symbolsFor`),
calling „Mama! Papa!“ – they come in together and stay in every picture from then on – into the bathroom together,
trousers down, sit down, then the waiting, done (whatever the grown-up's ✓ chose is in the potty, the parents cheer),
wipe, trousers up, flush, wash hands, party, the week's stars (`stars`, see below), then `GameEnd` with „Menü“ only (`menu`: one story, so no „Weiter“, and once on the potty the child is done, so no
„Nochmal“ – user request, November 2026), small in the bottom corner (`GameEnd`'s `corners`: „Menü“ bottom right with
the ribbon's shelf label beside the word, the party picture free beside it; the ribbon in the top left leads there too),
which closes the book and puts it back on the shelf. Only a tap within `TAP_GUARD_MS` of a step's start
sparkles (a double tap), and while sitting one within `SIT_GUARD_MS` of sitting down.

When nothing comes, the „nichts“ next to the ✓ takes the other story (`NOTHING_STEPS`, `storyFor`, `At.nothing`):
„Heute kommt nichts. Macht nichts!“ and washing hands (the usual `waschen` picture), then `play`: Tapsi plays with
blocks in its room and Mama and Papa look in at the open door and ask „Musst du Pipi oder Kaka?“ (`spielen`, a new room
drawn from `rufen` for the three, see `bilder/README.md`); a tap there ends with the same `GameEnd`. The row of steps
shows that story's steps; jumping back to sitting or before takes the usual story again. A fox instead of a child, so „Hose runter“
shows only fur.

The strip at the bottom (user request, November 2026: it looked poor) is one strip of paper like Zähne putzen's: the
row of steps as small paper discs (done ones green-tinted, the one now yellow with a golden ring, a bit bigger), and
the grown-ups' choices as square tiles on a paper card with their question. Every step and button shows a small
Gemini symbol (`bilder/symbole/<name>.webp`, `StripSymbol.tsx`, queued in `symbolPictures.ts` as one set with Zähne
putzen's bar), the trousers with a drawn blue arrow down or up (`StepArrow`); until a symbol's picture is made it shows
its emoji (`SYMBOL_EMOJI`). The row of step symbols is a row of buttons (`jump`): a tap on one jumps there at once, also while a step
still plays (its pending sounds stop). Jumping to „fertig“ or later without a ✓ takes what the child said as what came
(both when nobody knew); jumping back before it forgets the ✓. They are plain buttons without `data-tap`, so only a tap
right on one jumps: a tap beside the row goes on with the story, and the grown-ups' buttons next to it keep their reach.

The waiting (`WAIT_SCENES`, `scenesFor`): while Tapsi sits, the bathroom picture (`sitzen`, Mama and Papa clapping
softly) stays as it is, a clock ticks on the wall above the bathtub (`WaitClock.tsx`, SVG in
`.pt-scene`, a layer cut exactly like the pictures so it stays on the wall on every screen) and a big thought bubble top
left (`.pt-think`, filling the room left of Tapsi up to its ear, found from where the picture lies on the screen, its
picture zoomed past the white edges) shows
what Tapsi thinks of: the next thought comes by itself every `WAIT_SCENE_MS` (14 s, its two frames taking turns every
`THOUGHT_FRAME_MS`, 3.5 s), or at once on a key, round and round without end – only thoughts for what the child said: for pipi
things that flow and splash (a fountain, a balloon let go, a garden hose, pouring tea for the teddy, an elephant's
trunk, a whale's fountain, a funnel into a bottle, a garden pump, an hourglass), for kaka things that are pressed until something comes (ketchup, blowing up a
balloon, a hen laying an egg, play dough through a press, a piping bag, peas from their pod, a carrot pulled out,
a honey bottle, a chestnut out of its case, a mole out of its hill) and one that only waits
until something comes out (a tortoise; for children afraid of kaka), all with Tapsi alone and away from the bathroom; for both or when unsure both kinds.
A thought's picture can be cut differently in the bubble (`WaitScene.focus`: the point that goes in the bubble's
middle and a zoom, its edges faded): the tortoise's head, bottom left in its picture, was cut off (user feedback,
November 2026).

The pause (user request, November 2026, like Zähne putzen): while sitting a round paper button ⏸/▶ (`.pt-pause`, the
shared `ControlIcon` of `src/components/`) stands left of the ✓, and a tap anywhere on the picture does the same (only
not within `SIT_GUARD_MS` of sitting down, the tap that sat Tapsi down). Paused, a white veil says „Pause“ and how to
go on, the thoughts and their frames stand still, the clock's hands, the mouse and the time till the next thought or
mouse stop, the voice is hushed and the song stops, going on where it stopped (`loopPosition`, `useWaitingMusic`).

The mouse (`WaitMouse.tsx`, user request, November 2026): after `MOUSE_FIRST_MS` (20 s) of waiting, and then every
`MOUSE_AGAIN_MS` (45 s), a little grey mouse drawn in SVG runs in from the right across the bathroom floor, stops in
front of the potty to sniff and runs off left – an HTML layer in `.pt-scene`, moved by a transform, silent.
The hen, the whale, the mole, the hourglass and the funnel come first, in this order, as far as they fit what was said
(`FIRST_SCENES`, the user's favourites), the others after them in a random order, shuffled anew each round (`scenesFor`).
The wheelbarrow, the water slide, the dandelion, the tube slide, the paper boat, the kite and the rain with its puddle
were taken out with their pictures (user feedback, November 2026; their ideas are `rejected`), and so, later that
month, were the butterfly, the water wheel, the sandcastle's bucket, the train in the tunnel, the chick and the
watered flower, with their pictures and recordings. A thought shows its picture `fox-denken-<id>` (two frames, away from the bathroom) once there is one,
else its emoji (`WaitScene.emoji`); `prompts.py think` and `frames-think` make them. The old full-screen waiting pictures
(`fox-warten-*`) are no longer shown. The silly scenes (dancing, juggling, peekaboo, soap bubbles; `need: "silly"`) are kept but not shown
since the user wanted only the helping ones. Nothing speaks or
sounds while the waiting song plays (user feedback, November 2026: the song couldn't be listened to): sitting down hushes
a line still said from the step before and says none of its own, no thought is said (tapped or not) and nothing explains
the ✓, no sound comes with a thought, none on a tap that only ripples, no plop on sitting down. The thoughts' lines and
`finish` stay in `POTTY_TEXTS` as recorded data, said by nothing.
Only one of the two green ✓ (a framed group „Was ist im Töpfchen?“, ✓💧 and ✓💩, a yellow ring on the one the child
said; Enter on a keyboard is that one, else ✓💧) or „nichts“ under them ends the waiting. So a child can sit on the real
potty and play along, and a grown-up taps the ✓ of what really came – that picks `fertig-pipi` or `fertig-kaka`. There is
no ✓ for both (the user's choice: for both, either one); `Went` keeps `both` only for jumping in the row after the child
said both, where both endings take turns as frames.

The stars (`stars`, the last step, once the mode „Hat geklappt!“): over the party picture (still moving) this week's
chart pops in at the top (`WeekStars.tsx`, a column per day, today marked; `stars.ts`, `tinytaps.potty.stars.v1`,
counts per day, kept two weeks; `dayKey`/`weekOf` come from `src/lib/days.ts`). When a grown-up tapped a ✓
in this round (`checked`), a new star pops onto today with a twinkle and „Hat geklappt! Hurra, ein Stern für dich!“;
one round, one star (`starred`), also when the row jumps to the end again. Reached without a ✓ (jumping in the row,
or a ✓ forgotten by jumping back before „fertig“), the chart shows only the stars there are. The story when nothing
came ends on `play` and never shows the chart.

Files: `content.ts` (Tapsi, steps with their pictures and icons, waiting scenes, texts in every language), `images.ts` (finds
`bilder/fox-<picture>.webp` and its `-b` frame), `StoryPicture.tsx` (the picture with its frames, also in the bubble),
`PottyPlay.tsx` (steps, sounds, voice, the ✓, the star), `WeekStars.tsx`, `potty.css` (no settings: the story has
nothing to choose). `potty.test.ts` fails when a picture of the story is missing, a
thought's picture lacks its second frame, or `bilder/` holds a picture of anybody else.

German, English, Chinese, Hindi, Spanish, Arabic and Russian (`POTTY_TEXTS` is `Localized`; start screen and week chart
inline `t({ … })`): a new line is written English first and gets the other six languages in the same commit
(root `CLAUDE.md`, user decision, 22 November 2026: inline `t({ en: "…", de: "…", … })`, and the first English-first
line of `POTTY_TEXTS`, German first so far, teaches it a line's first language, with a test), and a changed German line
is changed in its German and in its translations. Everything Tapsi's story says is played from its ElevenLabs recording (`voice.ts`, files in `stimme/`),
recorded in every app language (November 2026). Two sentences in a row (what the child said, then the
next step; „nichts“, then washing hands) go one after the other (`queue`), never as one joined sentence, which
would have no recording. A new or changed line is listed by `src/content/recordedLines.ts` (`toepfchen`) and recorded
with `bun run voice make --only toepfchen`, only when the user asks. Tapsi (`TAPSI.name` is `Localized`) is „Tapsi“ in English and Spanish, „塔普西“, „टैप्सी“,
„تابسي“, „Тапси“. „Pipi“ and „Kaka“ are pee/poop, pipí/popó, 尿尿/便便, सू-सू/पॉटी, بيبي/كاكا, „пи-пи“/„ка-ка“ (as in the
Russian song); the potty chair is potty, orinal, 小马桶, पॉटी-सीट, النونية, горшок. To the grown-up: usted, आप, Arabic
plural, „вы“; to the child: tú, तुम, „ты“. Hindi verbs agree with the subject's gender, so Tapsi and the child are
never the subject of a gendered verb („टैप्सी को सू-सू जाना है“); Arabic says "we" (هيّا نغسل), "I" or „بحاجة إلى“.
`potty.test.ts` checks that every language has every line, Chinese, Hindi and Arabic with no Latin letters.

The waiting song (`waitMusic.ts`, `useWaitingMusic`): `musik/musik-toepfchen-warten-<lang>.mp3`, found by its file name, sung in the app language, else German; it loops without end and plays alone (nothing speaks while Tapsi sits; it would still get quiet for a voice). In all seven languages (`LOOPS` holds where each song repeats, a whole number of bars from just before the first word). While there is no file or it loads, the synthesized tune (`playWaitNote`, four bars on `BEAT_MS`) repeats instead. Like the brushing song it is part of the game and plays even with Töne or Musik off. Songs come from Suno (`/musik-erzeugen`, see `musik/README.md`: a seamless loop, no fade-out); `languageStatus.ts` lists the sung languages, `potty.test.ts` checks that against the files.

For a YouTube video (idea Y-21, November 2026) `/management/video-toepfchen/` (linked at the top of `/management/`,
`PottyVideo.tsx`, noindex) plays the whole story once on the shared 16 : 9 stage (`VideoRecorder` in `src/components/`,
as Zähne putzen's video): `PottyPlay video` shows only the picture – no row of steps, no buttons, no pause, no week's
stars (the story ends with the party), no `GameEnd` – answers no tap or key, keeps nothing (no star, no play time) and
puts no `?seite=` into the address. What a grown-up taps in the game is chosen on the page before (`PottyVideoRun`):
what Tapsi needs (said from the first step on, so the need's picture and the call already say it), what is in the
potty, and how many whole passes of the waiting song Tapsi sits (`WaitPasses`, `passesEndMs`: the waiting ends where
the song would begin its first verse again, never inside one). Every other step goes on by itself once its movement
has played once (`moves`, without `again`), its line is said (`voiceQuiet`) and `VIDEO_LOOK_MS` has passed; the party
stays `VIDEO_TAIL_MS` more, then the recording ends. The page fetches the pictures, the thoughts that fit, the sounds
(`preloadPottySounds`), the waiting song (`loadWaitSong`) and every line before it lets the recording start.
„nichts“ beside the two ✓ there (idea Y-24) plays the story when nothing came (`NOTHING_STEPS`), ending a moment after
Tapsi plays and Mama and Papa ask at the door. „Nur Sitzen“ (Y-23, `PottyVideoRun.sittingOnly`) is a potty song to leave
running while the child sits on the real potty: the video starts as Tapsi sits down, shows the thoughts for what was
chosen (pipi, kaka or both) and ends with the last pass of the song (3 or 5 passes, about 5 and 10 minutes). Every step
that begins a chapter (`STEP_CHAPTERS`, `NOTHING_CHAPTERS` in `videoChapters.ts`, English first, in every app language) – sitting only, every
thought, named by its line – is a chapter mark for YouTube's description (Y-26, `VideoRecorder`'s `chapter`).
A new thing shown beside the picture (a button, a chart) stays out of the video (`potty.test.ts`).

The video for parents (idea Y-29, November 2026): `/management/video-toepfchen-eltern/` (linked at the top of
`/management/`, `ParentsVideo.tsx`, noindex) shows the real game on a drawn tablet lying on a table, and a grown-up's
drawn hand in a jumper sleeve (`ParentHand`) comes up from below and taps it through after a fixed script
(`PARENTS_SCRIPT` in `parentsScript.ts`): the story starting at once, ▶, the 💧 of what the child said, sitting with the
song and the thoughts, ⏸ and ▶ again, the ✓💧, the steps after it, the week's stars – about a minute and a half, a short
line for grown-ups on a sheet beside the tablet at each part (English first, in every app language, grown-ups addressed
formally), then 15 s of the name
and the game's address (`END_SLATE_MS`) for YouTube's end screen, since this video is „not made for kids“. Each beat waits
for its step (`pt-at-<step>`), and the hand presses the button (`pt-pressed`, its look under a finger) and sends it a
pointer event, so the game answers as to a finger. `PottyPlay demo` keeps nothing: the week shown is made up
(`sampleWeek`), the round's star is never saved, no `GameEnd` (no trophy, no game counted), no step in the address, and
a real click or key of the one recording changes nothing. The background song stays out; voice, sounds and the waiting
song are fetched before (`loadWaitSong`). Recorded in the same shared frame as the children's video (`VideoRecorder`).

## Rules

- The parents' video shows only the tablet and a grown-up's hand – never a real child, not from behind nor blurred
  (Y-29). The game in it is laid out at a real tablet's size (`SCREEN`, 1280 × 800) and scaled to the drawn screen:
  laid out in the small screen itself, it sized buttons from the window and the ✓ ran off the tablet. Record it in a
  window of 1080p or more, where the game's sizes come out as on a tablet. A new button the story needs a grown-up to
  tap gets its beat in `PARENTS_SCRIPT` (`parentsScript.test.ts` checks the buttons it taps exist).

- „Junge / Mädchen“ on the home page changes nothing here: the child of the story is Tapsi, an animal in Gemini
  pictures (root `CLAUDE.md`: animals stay as they are, and a painted picture is never made a second time for the
  figure), and the game's own svg (clock, mouse, bubble, week chart) draws no child. A girl Tapsi would mean the whole
  story of about 50 pictures and their frames drawn again: that is idea H-88, **parked** (user decision, November 2026).
  Never generate those pictures with others, never put them into the picture queue or a batch, and never offer them –
  only when the user says in so many words to generate the pictures for „Töpfchen gehen“ for the girl.
- Only Tapsi goes to the potty (the user's choice, to save pictures and tokens): every animal more would need the
  whole story of about 50 pictures drawn again. Never add another animal or family unless the user asks for it.
- The game is opened when the child has to go now: the tile starts the story at once, with no start screen or
  submenu before it, and the game has no modes – everything (the star too) is a step of the one story, and ✕ goes
  back to the shelf, never to a start screen with only „Los geht’s!“. Never add a mode card for something the story can show as a step.
- So unlike other games the picture moves before any tap (the user's choice): Tapsi eats and drinks by turns. Eating
  and drinking are one step, never two.
- The first steps never go on by themselves (`Step.nudge`; going on alone after three seconds was too fast for the user),
  and „Weiter“ calls for attention there, since everybody waits for it. But any tap or key always does the most
  sensible thing – „Weiter“, or while sitting pause and go on – never only a sparkle (a sparkle-only tap on the
  first steps felt broken to the user). A tap anywhere on the picture that is not on a button is „Weiter“, on every
  step and at once – also while the step's sounds still run and while the buttons for what the child said show
  (the user asked for it after both a sparkle-only tap and a tap that only shook those buttons); only a double tap
  (`TAP_GUARD_MS`, the shared value of `src/lib/tapGuard.ts`) and the last step sparkle. Where a grown-up's choice goes on (what the child said), there is no
  „Weiter“ beside it: the choice's buttons look like „Weiter“ (yellow, ▶) and call for attention instead. Only
  going into and out of the waiting goes on by itself (`Step.auto`); where the child does something itself it waits
  for a tap or „Weiter“. Every step without its own buttons for going on has „Weiter“ (`potty.test.ts` checks which
  steps wait).
- A choice that is the only thing left to do on a step (what the child said) goes on by itself when picked, as
  „Weiter“ would; never make a grown-up pick and then press „Weiter“ as well. Never offer a choice that means what
  another one means (a ❓ next to 💧💩 – not knowing is both), and none the grown-up doesn't need (a ✓💧💩 next to ✓💧
  and ✓💩): each button is a different way on. A button whose emoji isn't plain at once says it in a word for the
  grown-up („nichts“; a 🤷 was unclear to the user).
- The grown-ups' buttons sit on the right level with the row of steps and must read as buttons at once (white or
  coloured, dark outline, raised with a shadow, pressed in on a tap); pale see-through circles were too faint for the
  user. An either-or choice (what was said, what came) is one framed group with its question on top
  („Was muss dein Kind?“, „Was ist im Töpfchen?“) and buttons all alike, „Weiter“ apart next to it (but never next to the
  buttons for what the child said, see above); all in one row where it fits (a computer), else the group stands on the
  right above „Weiter“, reaching up from the bottom. Only the way on moves on the first steps („Weiter“, or the buttons
  for what the child said); everything else there stays still, the child looks at the story.
- The strip's symbols are pictures of one set, painted with Gemini (`StripSymbol.tsx`, `bilder/symbole/`), never a mix of
  emoji and drawings: an emoji stands in only until its picture is made. A new symbol goes into `SYMBOL_EMOJI` and its
  picture into the queue (`symbolPictures.ts`), in the same style line (`ICON`); `potty.test.ts` checks every symbol
  has its picture or waits for it.
- A grown-up can jump to any step at any time by tapping it in the row; keep every step reachable that way. The row
  is small and right at the bottom (the user's choice): it is for the grown-up, the picture is the story.
- The end of the story keeps its picture free: „Menü“ with its shelf label small in the bottom corner (`corners`,
  `menu`), never big in the middle over the party, and no „Nochmal“ (user request, November 2026).
- What the child has to do is chosen inside the story, never on the start screen (neither a card each nor a choice
  above the cards): „Muss mal!“ starts at once, what the child said is picked while Tapsi calls (pipi, kaka, both)
  and once more on the way when calling was jumped past – the next step, never a jump further; what came on the
  two ✓ while sitting (pipi, kaka) – a child saying „Pipi“ may still do kaka.
- What the child really does (sitting on the potty) has no fixed length: it never ends on a timer or on an ordinary
  tap. Sometimes nothing comes: „nichts“ next to the ✓ leads to a story of its own (washing hands, playing, Mama and
  Papa asking again later), never a sad ending. The thoughts follow each other by themselves (and on every key), endlessly; only the ✓ say „fertig“.
- The waiting can always be paused, by its ⏸ button and by a tap on the picture, and goes on from where it stood
  (thought, frame, clock, mouse, song) – a tap there never skips to the next thought (user request, November 2026).
- While sitting the full picture never changes: pictures drawn one by one never match exactly, and swapping them every
  few seconds made the room jump. What changes goes into the thought bubble, drawn away from the bathroom, and a clear
  animation shows that everybody waits: a clock drawn into the room (on the wall, no frame round it), always moving.
  Something drawn into a picture goes into `.pt-scene` at its place in the picture's 1376 × 768, never at a screen corner.
- The thoughts are only for what was said – flowing water and letting go for pipi, pressing for kaka, both kinds for
  both or when nobody said. A new one goes into `WAIT_SCENES` (with an emoji) and `POTTY_TEXTS.scenes`; its picture,
  when made, gets two frames. A thought taken out takes its pictures with it (`potty.test.ts`).
- While the waiting song plays (step 6, sitting), it plays alone: no voice and no sound at all – not the step's own
  line, no thought, nothing about the ✓, no sound on a thought or a tap (sounds over the song disturbed the user, and
  then the voice did too, November 2026: the song couldn't be listened to). Sitting down hushes what the step before
  still says. Never bring a line or sound back into the waiting (`potty.test.ts`).
- A thought stays long enough for a toddler to look at it (`WAIT_SCENE_MS`, 14 s, and each frame `THOUGHT_FRAME_MS`,
  3.5 s; 2.6 s and then 8 s were too short for the user) – `potty.test.ts` keeps both from getting shorter.
- What matters in a thought's picture is whole and in the middle of the bubble: where the bubble's round cut hides it
  (the tortoise's head), give the thought a `focus` rather than drawing it again.
- Something going on in the bathroom while everybody waits (the mouse) runs on the floor, silent, rarely (first after
  20 s), and stops with the pause; never more than one at a time, never in the bubble or over Tapsi.
- In a thought the child watches what flows or comes out, dry and happy – never wet, never a puddle under it (the
  elephant once soaked Tapsi). What comes out is seen only coming out, wholly hidden before: the tortoise's head right
  inside its shell, then stretched far out.
- The thought bubble is as big as the room beside Tapsi allows (the user asked twice for it bigger) and never covers
  Tapsi (not its ears or tail either), its puffs leading right to Tapsi's head; look at it on a phone on its side, a
  tablet and a computer after changing it.
- A picture of a movement (`moves`) is drawn from the step's own picture as its only reference, changing only the
  child's trousers and pose, so it blends into it without anything jumping (`prompts.py moves`).
- What Tapsi feels or wants is shown by its picture, and where it says something, by one picture in a speech bubble
  placed beside its head in the picture (`.pt-scene`) – never by emoji floating over the picture or a row of symbols
  (💦 🌀 over the need, 📣 💧 💩 in the call bubble were taken out, user feedback, November 2026). What the grown-up
  picks stays on the buttons below. A thing in a bubble is cut out of one of the story's own pictures, so it looks the
  same as in the bathroom (`bilder/README.md`).
- Mama and Papa stand together and, once called, stay in every picture to the end, cheering or being silly.
  Nobody else comes in; every picture of a place is drawn from that place's first picture (`essen` for the
  kitchen, `bad` for the bathroom) as its only reference, so the room never changes (see `bilder/README.md`).
- The pictures are 16:9 and cover the screen: everything that matters stays in the middle, the edges are only
  wall and floor, since phones on their side cut the top and bottom and tablets the sides.
- A song that waits for a tap is recorded as a seamless loop and played with `playLoop`, never as a fixed-length piece.
- The waiting song is long and cheerful, and every line is about going to the potty: no nappy any more, being big,
  Mama and Papa on the toilet too, waiting as long as it takes, the cheering after – no side stories (toes, sneezes,
  glasses, tails, animals). It never sings the thought bubble's stand-ins for pipi and kaka (water, rain, balloon,
  ketchup, the hen …) or „drücken“ – `potty.test.ts` checks the lyrics in `musik/suno-lied.md`.
- A star comes only for what really came: at the end of the story, after a grown-up tapped a ✓ in that round, one per
  round (never for jumping to the end, never for „nichts“). No empty fields that say „not done“.
