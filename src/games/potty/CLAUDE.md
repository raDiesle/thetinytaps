# Aufs Töpfchen

Route `/toepfchen/` · idea H-06 (Töpfchen-Partys; built in the style of „Zähne putzen“, but tapped step by step).

A picture story like „Gefühle“: every step is a Gemini picture (`bilder/`, see its README) filling the screen,
its second frame (`-b`) fading in and out so the foxes move a little; a new picture fades in over the one before
(which stays below it meanwhile) and settles from a little closer. A step can play a tiny animation once before its
picture (`Step.moves`: trousers going down, sitting down; `StoryPicture`'s `moves`). Drawn on top (emoji and CSS):
what Tapsi feels (💦 for pipi, the picture shakes when the tummy rumbles), the call bubble, while sitting the clock on
the wall and the thought bubble, confetti, and at the bottom the row of step icons (each one jumps there) with the
grown-ups' buttons on the right next to it.

„Muss mal!“ (`PottyPlay.tsx`, mode `story`): one story for both needs, since a child often can't tell beforehand.
Opening the game (its tile on the home menu) starts it at once (`GameShell`'s `startMode`); the start screen with
„Hat geklappt!“, the info and the cards shows only after leaving with ✕ or „Menü“. It opens on the first step, `eat`: Tapsi the fox
(`TAPSI` in `content.ts`) at the kitchen table, eating and drinking by turns (the `essen` and `trinken` pictures are that step's
frames, moving at once).
The first steps (eating, the need, calling, going to the bathroom; `Step.nudge`) go on only on „Weiter“ ▶ (or Enter),
which swells and sends out a ring there, since nothing else moves the story on: a grown-up tells them at their own pace,
and a tap on the picture only sparkles. Sitting down goes on into the waiting by itself and „fertig“ to wiping
(`Step.auto`); where the child really does something (trousers down, wipe, trousers up, flush, wash) every tap or key,
and the still „Weiter“, is the next step (`STEPS`). „Weiter“ is on every step but sitting, where the ✓ are.
While Tapsi calls Mama and Papa, a framed group „Was muss dein Kind?“ with four buttons (`SAID`: 💧, 💩, 💧💩, ❓)
lets a grown-up note what the child said – only noted; on the way to the bathroom it shows again while nothing but ❓
was picked. Untouched it stays `unsure`.
The steps: eating and drinking, the bladder presses or the tummy rumbles (`need`; when
unsure Tapsi „muss mal“, the bladder and the tummy picture take turns as frames, `picturesFor`, and the row shows ❓),
calling „Mama! Papa!“ – they come in together and stay in every picture from then on – into the bathroom together,
trousers down, sit down, then the waiting, done (whatever the grown-up's ✓ chose is in the potty, the parents cheer),
wipe, trousers up, flush, wash hands, party, then `GameEnd`. „Nochmal“ and „Weiter“ start a new round, unsure again. A tap while a step's sounds still run only sparkles (`busy`). A fox instead of a child, so „Hose runter“
shows only fur.

The row of step icons at the bottom is a row of buttons (`jump`): a tap on one jumps there at once, also while a step
still plays (its pending sounds stop). Jumping to „fertig“ or later without a ✓ takes what the child said as what came
(pipi when nobody knew); jumping back before it forgets the ✓. They are plain buttons without `data-tap`, so only a tap
right on one jumps: a tap beside the row goes on with the story, and the grown-ups' buttons next to it keep their reach.

The waiting (`WAIT_SCENES`, `scenesFor`): while Tapsi sits, the bathroom picture (`sitzen`, Mama and Papa clapping
softly) stays as it is, a clock ticks on the wall above the bathtub (`WaitClock.tsx`, SVG in
`.pt-scene`, a layer cut exactly like the pictures so it stays on the wall on every screen) and a thought bubble top left (`.pt-think`) shows
what Tapsi thinks of: the next thought comes by itself every `WAIT_SCENE_MS`, or at once on a tap, round and round
without end – only thoughts for what the child said: for pipi
things that flow and splash (watering a flower, a fountain, a balloon let go, rain and a puddle, a garden hose), for
kaka things that are pressed until something comes (ketchup, blowing up a balloon, a hen laying an egg, play dough
through a press), all with Tapsi alone and away from the bathroom; for both or when unsure the two
taking turns. A thought shows its picture `fox-denken-<id>` (two frames, away from the bathroom) once there is one,
else its emoji (`WaitScene.emoji`); `prompts.py think` and `frames-think` make them. The old full-screen waiting pictures
(`fox-warten-*`) are no longer shown. The silly scenes (dancing, juggling, peekaboo, soap bubbles; `need: "silly"`) are kept but not shown
since the user wanted only the helping ones. Only tapped scenes speak (and the first, which explains the ✓).
Only one of the three green ✓ (a framed group „Was ist im Töpfchen?“, ✓💧, ✓💩 and ✓💧💩, a yellow ring on the one
the child said; Enter on a keyboard is that one) ends the waiting. So a child can sit on the real potty and play along, and a
grown-up taps the ✓ of what really came (`Went`) – that picks `fertig-pipi` or `fertig-kaka`, or both taking turns as frames.

„Hat geklappt!“ (`PartyPlay.tsx`): for real successes. A grown-up opens it after the child went; the first tap brings applause, confetti, Tapsi's party picture moving and a star on today's column of a week chart (`stars.ts`, `tinytaps.potty.stars.v1`, counts per day, kept two weeks; `dayKey`/`weekOf` come from Zähne putzen's `daytime.ts`). One opening is one star; further taps only sparkle, „Nochmal“ celebrates again without a star, „Weiter“ goes to „Muss mal!“.

Files: `content.ts` (Tapsi, steps with their pictures and icons, waiting scenes, German texts), `images.ts` (finds
`bilder/fox-<picture>.webp` and its `-b` frame), `StoryPicture.tsx` (the picture with its frames, also in the bubble),
`PottyPlay.tsx` (steps, sounds, speech, the ✓), `potty.css`, `settings.ts` (`tinytaps.potty.v3`: mode;
speech and sounds from the home page). `potty.test.ts` fails when a picture of the story is missing, a
thought's picture lacks its second frame, or `bilder/` holds a picture of anybody else.

German only so far (`POTTY_TEXTS` is `Localized`, a translation goes next to `de` when asked for).

The waiting song (`waitMusic.ts`, `useWaitingMusic`): `musik/musik-toepfchen-warten-<lang>.mp3`, found by its file name, sung in the app language, else German; it loops without end and gets quiet while the voice speaks. While there is no file (none yet) or it loads, the synthesized tune (`playWaitNote`, four bars on `BEAT_MS`) repeats instead. Like the brushing song it is part of the game and plays even with Töne or Musik off. Songs come from Suno (`/musik-erzeugen`, see `musik/README.md`: a seamless loop, no fade-out); `languageStatus.ts` lists the sung languages, `potty.test.ts` checks that against the files.

## Rules

- Only Tapsi goes to the potty (the user's choice, to save pictures and tokens): every animal more would need the
  whole story of about 50 pictures drawn again. Never add another animal or family unless the user asks for it.
- The game is opened when the child has to go now: the tile starts „Muss mal!“ at once, with no start screen or
  submenu before it. Anything else (the star, the info) lives on the start screen behind ✕.
- So unlike other games the picture moves before any tap (the user's choice): Tapsi eats and drinks by turns. Eating
  and drinking are one step, never two.
- The first steps never go on by themselves, only on „Weiter“ (`Step.nudge`; going on alone after three seconds was
  too fast for the user), and „Weiter“ calls for attention there, since everybody waits for it. Only going into and
  out of the waiting goes on by itself (`Step.auto`); where the child does something itself it waits for a tap or
  „Weiter“. Every step without its own buttons for going on has „Weiter“ (`potty.test.ts` checks which steps wait).
- The grown-ups' buttons sit on the right level with the row of steps and must read as buttons at once (white or
  coloured, dark outline, raised with a shadow, pressed in on a tap); pale see-through circles were too faint for the
  user. An either-or choice (what was said, what came) is one framed group with its question on top
  („Was muss dein Kind?“, „Was ist im Töpfchen?“) and buttons all alike, „Weiter“ apart next to it; all in one row
  where it fits (a computer), else the group stands on the right above „Weiter“, reaching up from the bottom. Only
  „Weiter“ on the first steps moves; everything else there stays still, the child looks at the story.
- A grown-up can jump to any step at any time by tapping it in the row; keep every step reachable that way.
- What the child has to do is chosen inside the story, never on the start screen (neither a card each nor a choice
  above the cards): „Muss mal!“ starts at once, what the child said is noted while Tapsi calls (💧, 💩, 💧💩, ❓,
  unsure when untouched) and once more on the way while it is still ❓ – a note, never a jump; what came on the
  three ✓ while sitting (pipi, kaka, both) – a child saying „Pipi“ may still do kaka, or both.
- What the child really does (sitting on the potty) has no fixed length: it never ends on a timer or on an ordinary
  tap. The thoughts follow each other by themselves (and on every tap), endlessly; only the ✓ say „fertig“.
- While sitting the full picture never changes: pictures drawn one by one never match exactly, and swapping them every
  few seconds made the room jump. What changes goes into the thought bubble, drawn away from the bathroom, and a clear
  animation shows that everybody waits: a clock drawn into the room (on the wall, no frame round it), always moving.
  Something drawn into a picture goes into `.pt-scene` at its place in the picture's 1376 × 768, never at a screen corner.
- The thoughts are only for what was said – flowing water and letting go for pipi, pressing for kaka, both
  taking turns for both or ❓ – each with its own sound. A new one goes into `WAIT_SCENES` (with an emoji) and
  `POTTY_TEXTS.scenes`; its picture, when made, gets two frames.
- A picture of a movement (`moves`) is drawn from the step's own picture as its only reference, changing only the
  child's trousers and pose, so it blends into it without anything jumping (`prompts.py moves`).
- Mama and Papa stand together and, once called, stay in every picture to the end, cheering or being silly.
  Nobody else comes in; every picture of a place is drawn from that place's first picture (`essen` for the
  kitchen, `bad` for the bathroom) as its only reference, so the room never changes (see `bilder/README.md`).
- The pictures are 16:9 and cover the screen: everything that matters stays in the middle, the edges are only
  wall and floor, since phones on their side cut the top and bottom and tablets the sides.
- A song that waits for a tap is recorded as a seamless loop and played with `playLoop`, never as a fixed-length piece.
- The story never gives a star; only „Hat geklappt!“ does, once per opening. No empty fields that say „not done“.
