# Aufs Töpfchen

Route `/toepfchen/` · idea H-06 (Töpfchen-Partys; built in the style of „Zähne putzen“, but tapped step by step).

A picture story like „Gefühle“: every step is a Gemini picture (`bilder/`, see its README) filling the screen,
its second frame (`-b`) fading in and out so the foxes move a little; a new picture fades in over the one before
(which stays below it meanwhile) and settles from a little closer. A step can play a tiny animation once before its
picture (`Step.moves`: trousers going down, sitting down; `StoryPicture`'s `moves`); with `Step.again` it plays again
after that pause, over and over until the story goes on (trousers down, so the child sees what to do while doing it). Drawn on top (emoji and CSS):
what Tapsi feels (💦 for pipi, the picture shakes when the tummy rumbles), the call bubble, while sitting the clock on
the wall and the thought bubble, confetti, and at the bottom the row of step icons (each one jumps there) with the
grown-ups' buttons on the right next to it.

The story (`PottyPlay.tsx`, once called „Muss mal!“): one story for both needs, since a child often can't tell beforehand.
The game has no modes. Opening it (its tile on the home menu) starts the story at once (`GameShell`'s `startMode`); the
start screen, with only „Los geht’s!“ and the info, shows only after leaving with ✕ or „Menü“. It opens on the first step, `eat`: Tapsi the fox
(`TAPSI` in `content.ts`) at the kitchen table, eating and drinking by turns (the `essen` and `trinken` pictures are that step's
frames, moving at once).
Every tap on the picture or background (anything but a button) and every key does the most sensible thing there
(`act`): „Weiter“ on every step, at once also while the step's sounds still run, and the next thought while sitting
(Enter there is the ✓ of what the child said). The first steps (eating, the need, calling, going to the bathroom; `Step.nudge`) never go on
by themselves, and there „Weiter“ ▶ swells and sends out a ring, since everybody waits for it. Sitting down goes on
into the waiting by itself and „fertig“ to wiping (`Step.auto`). „Weiter“ is on every step but sitting, where the ✓
are, and while the buttons for what the child said show.
While Tapsi calls Mama and Papa, a framed group „Was muss dein Kind?“ with three buttons (`SAID`: 💧, 💩, 💧💩) asks a
grown-up what the child said: a tap on one keeps the pick and begins the next step at once. So there is no „Weiter“
then; the three are yellow like it, each with its ▶, swelling one after the other. A tap on the picture still goes on,
with nothing picked. There is no ❓:
not knowing is the same as both (the user's choice), so `unsure` – the state before anybody picked, and after jumping
past calling in the row, when the group asks again on the way to the bathroom – plays like both, only saying „muss mal“.
The steps: eating and drinking, the bladder presses or the tummy rumbles (`need`; when
unsure – before calling, nobody has said anything yet – Tapsi „muss mal“, the bladder and the tummy picture take turns as frames, `picturesFor`, and the row shows ❓),
calling „Mama! Papa!“ – they come in together and stay in every picture from then on – into the bathroom together,
trousers down, sit down, then the waiting, done (whatever the grown-up's ✓ chose is in the potty, the parents cheer),
wipe, trousers up, flush, wash hands, party, the week's stars (`stars`, see below), then `GameEnd` with „Menü“ and „Nochmal“ only (one story, so „Weiter“
would be „Nochmal“ again), small in the bottom corners (`GameEnd`'s `corners`: „Menü“ left, „Nochmal“ right, the party
picture free between them), which starts a new round, unsure again. Only a tap within `TAP_GUARD_MS` of a step's start
sparkles (a double tap), and while sitting one while a thought still runs.

When nothing comes, the „nichts“ next to the ✓ takes the other story (`NOTHING_STEPS`, `storyFor`, `At.nothing`):
„Heute kommt nichts. Macht nichts!“ and washing hands (the usual `waschen` picture), then `play`: Tapsi plays with
blocks in its room and Mama and Papa look in at the open door and ask „Musst du Pipi oder Kaka?“ (`spielen`, a new room
drawn from `rufen` for the three, see `bilder/README.md`); a tap there ends with the same `GameEnd`. The row of steps
shows that story's steps; jumping back to sitting or before takes the usual story again. A fox instead of a child, so „Hose runter“
shows only fur.

The row of step icons at the bottom is a row of buttons (`jump`): a tap on one jumps there at once, also while a step
still plays (its pending sounds stop). Jumping to „fertig“ or later without a ✓ takes what the child said as what came
(both when nobody knew); jumping back before it forgets the ✓. They are plain buttons without `data-tap`, so only a tap
right on one jumps: a tap beside the row goes on with the story, and the grown-ups' buttons next to it keep their reach.

The waiting (`WAIT_SCENES`, `scenesFor`): while Tapsi sits, the bathroom picture (`sitzen`, Mama and Papa clapping
softly) stays as it is, a clock ticks on the wall above the bathtub (`WaitClock.tsx`, SVG in
`.pt-scene`, a layer cut exactly like the pictures so it stays on the wall on every screen) and a big thought bubble top
left (`.pt-think`, as wide as the room left of Tapsi, its picture zoomed past the white edges) shows
what Tapsi thinks of: the next thought comes by itself every `WAIT_SCENE_MS`, or at once on a tap, round and round
without end – only thoughts for what the child said: for pipi
things that flow and splash (watering a flower, a fountain, a balloon let go, rain and a puddle, a garden hose, a water
wheel, pouring tea for the teddy), for kaka things that are pressed until something comes (ketchup, blowing up a
balloon, a hen laying an egg, play dough through a press, a piping bag, peas from their pod) and one that only waits
until something comes out (a toy train in a tunnel, for children afraid of kaka), all with Tapsi alone and away from the bathroom; for both or when unsure the two
taking turns. A thought shows its picture `fox-denken-<id>` (two frames, away from the bathroom) once there is one,
else its emoji (`WaitScene.emoji`); `prompts.py think` and `frames-think` make them. The old full-screen waiting pictures
(`fox-warten-*`) are no longer shown. The silly scenes (dancing, juggling, peekaboo, soap bubbles; `need: "silly"`) are kept but not shown
since the user wanted only the helping ones. Only tapped scenes speak (and the first, which explains the ✓).
Only one of the two green ✓ (a framed group „Was ist im Töpfchen?“, ✓💧 and ✓💩, a yellow ring on the one the child
said; Enter on a keyboard is that one, else ✓💧) or „nichts“ under them ends the waiting. So a child can sit on the real
potty and play along, and a grown-up taps the ✓ of what really came – that picks `fertig-pipi` or `fertig-kaka`. There is
no ✓ for both (the user's choice: for both, either one); `Went` keeps `both` only for jumping in the row after the child
said both, where both endings take turns as frames.

The stars (`stars`, the last step, once the mode „Hat geklappt!“): over the party picture (still moving) this week's
chart pops in at the top (`WeekStars.tsx`, a column per day, today marked; `stars.ts`, `tinytaps.potty.stars.v1`,
counts per day, kept two weeks; `dayKey`/`weekOf` come from Zähne putzen's `daytime.ts`). When a grown-up tapped a ✓
in this round (`checked`), a new star pops onto today with a twinkle and „Hat geklappt! Hurra, ein Stern für dich!“;
one round, one star (`starred`), also when the row jumps to the end again. Reached without a ✓ (jumping in the row,
or a ✓ forgotten by jumping back before „fertig“), the chart shows only the stars there are. The story when nothing
came ends on `play` and never shows the chart.

Files: `content.ts` (Tapsi, steps with their pictures and icons, waiting scenes, German texts), `images.ts` (finds
`bilder/fox-<picture>.webp` and its `-b` frame), `StoryPicture.tsx` (the picture with its frames, also in the bubble),
`PottyPlay.tsx` (steps, sounds, speech, the ✓, the star), `WeekStars.tsx`, `potty.css`, `settings.ts`
(`tinytaps.potty.v3`: only speech and sounds, from the home page). `potty.test.ts` fails when a picture of the story is missing, a
thought's picture lacks its second frame, or `bilder/` holds a picture of anybody else.

German only so far (`POTTY_TEXTS` is `Localized`, a translation goes next to `de` when asked for).

The waiting song (`waitMusic.ts`, `useWaitingMusic`): `musik/musik-toepfchen-warten-<lang>.mp3`, found by its file name, sung in the app language, else German; it loops without end and gets quiet while the voice speaks. German and Russian so far (`LOOPS` holds where each song repeats, a whole number of bars from just before the first word). While there is no file or it loads, the synthesized tune (`playWaitNote`, four bars on `BEAT_MS`) repeats instead. Like the brushing song it is part of the game and plays even with Töne or Musik off. Songs come from Suno (`/musik-erzeugen`, see `musik/README.md`: a seamless loop, no fade-out); `languageStatus.ts` lists the sung languages, `potty.test.ts` checks that against the files.

## Rules

- Only Tapsi goes to the potty (the user's choice, to save pictures and tokens): every animal more would need the
  whole story of about 50 pictures drawn again. Never add another animal or family unless the user asks for it.
- The game is opened when the child has to go now: the tile starts the story at once, with no start screen or
  submenu before it, and the game has no modes – everything (the star too) is a step of the one story, the start
  screen behind ✕ has only „Los geht’s!“ and the info. Never add a mode card for something the story can show as a step.
- So unlike other games the picture moves before any tap (the user's choice): Tapsi eats and drinks by turns. Eating
  and drinking are one step, never two.
- The first steps never go on by themselves (`Step.nudge`; going on alone after three seconds was too fast for the user),
  and „Weiter“ calls for attention there, since everybody waits for it. But any tap or key always does the most
  sensible thing – „Weiter“, or the next thought while sitting – never only a sparkle (a sparkle-only tap on the
  first steps felt broken to the user). A tap anywhere on the picture that is not on a button is „Weiter“, on every
  step and at once – also while the step's sounds still run and while the buttons for what the child said show
  (the user asked for it after both a sparkle-only tap and a tap that only shook those buttons); only a double tap
  (`TAP_GUARD_MS`) and the last step sparkle. Where a grown-up's choice goes on (what the child said), there is no
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
- A grown-up can jump to any step at any time by tapping it in the row; keep every step reachable that way. The row
  is small and right at the bottom (the user's choice): it is for the grown-up, the picture is the story.
- The end of the story keeps its picture free: „Menü“ and „Nochmal“ small in the bottom corners (`corners`), never big
  in the middle over the party.
- What the child has to do is chosen inside the story, never on the start screen (neither a card each nor a choice
  above the cards): „Muss mal!“ starts at once, what the child said is picked while Tapsi calls (💧, 💩, 💧💩)
  and once more on the way when calling was jumped past – the next step, never a jump further; what came on the
  two ✓ while sitting (pipi, kaka) – a child saying „Pipi“ may still do kaka.
- What the child really does (sitting on the potty) has no fixed length: it never ends on a timer or on an ordinary
  tap. Sometimes nothing comes: „nichts“ next to the ✓ leads to a story of its own (washing hands, playing, Mama and
  Papa asking again later), never a sad ending. The thoughts follow each other by themselves (and on every tap), endlessly; only the ✓ say „fertig“.
- While sitting the full picture never changes: pictures drawn one by one never match exactly, and swapping them every
  few seconds made the room jump. What changes goes into the thought bubble, drawn away from the bathroom, and a clear
  animation shows that everybody waits: a clock drawn into the room (on the wall, no frame round it), always moving.
  Something drawn into a picture goes into `.pt-scene` at its place in the picture's 1376 × 768, never at a screen corner.
- The thoughts are only for what was said – flowing water and letting go for pipi, pressing for kaka, both
  taking turns for both or when nobody said – each with its own sound. A new one goes into `WAIT_SCENES` (with an emoji) and
  `POTTY_TEXTS.scenes`; its picture, when made, gets two frames.
- The thought bubble is as big as the room beside Tapsi allows and never covers Tapsi (not its ears either), its puffs
  leading down to Tapsi's head; look at it on a phone on its side and a tablet after changing it.
- A picture of a movement (`moves`) is drawn from the step's own picture as its only reference, changing only the
  child's trousers and pose, so it blends into it without anything jumping (`prompts.py moves`).
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
