# Aufs Töpfchen

Route `/toepfchen/` · idea H-06 (Töpfchen-Partys; built in the style of „Zähne putzen“, but tapped step by step).

A picture story like „Gefühle“: every step is a Gemini picture (`bilder/`, see its README) filling the screen,
its second frame (`-b`) fading in and out so the foxes move a little. Drawn on top (emoji and CSS): what Tapsi
feels (💦 for pipi, the picture shakes when the tummy rumbles), the call bubble, the green ✓ while sitting,
the row of step icons at the bottom, confetti.

„Muss Pipi!“ and „Muss Kaka!“ (`PottyPlay.tsx`, `settings.mode`): Tapsi the fox (`TAPSI` in `content.ts`) sits at the kitchen
table, still and silent. Every tap or key is the next step (`STEPS`): eat, drink, the bladder presses or the tummy rumbles (`need`),
calling „Mama! Papa!“ – they come in together and stay in every picture from then on – into the bathroom together,
trousers down, sit down, then the waiting, done (pipi or kaka in the potty, the parents cheer), wipe, trousers up,
flush, wash hands, party, then `GameEnd`. „Weiter“ brings the other need. A tap while a step's sounds still run only sparkles (`busy`). A fox instead of a child, so „Hose runter“
shows only fur.

The waiting (`WAIT_SCENES`, `scenesFor`): while Tapsi sits, every tap brings the next thing Mama and Papa do,
round and round without end – for pipi things that flow and splash (watering can, tap, balloon let go, jug, shower),
for kaka things that are pressed (toothpaste, blowing up a balloon, pushing a basket, sponge, a train through a
tunnel), taking turns with plain silliness (dancing, juggling, peekaboo, soap bubbles). Only the big green ✓
(bottom right, pulsing, a hand points at it; Enter on a keyboard) ends the waiting. So a child can sit on the real
potty and play along, and a grown-up taps the ✓ when it worked.

„Hat geklappt!“ (`PartyPlay.tsx`): for real successes. A grown-up opens it after the child went; the first tap brings applause, confetti, Tapsi's party picture moving and a star on today's column of a week chart (`stars.ts`, `tinytaps.potty.stars.v1`, counts per day, kept two weeks; `dayKey`/`weekOf` come from Zähne putzen's `daytime.ts`). One opening is one star; further taps only sparkle, „Nochmal“ celebrates again without a star, „Weiter“ goes to „Muss Pipi!“.

Files: `content.ts` (Tapsi, steps with their pictures and icons, waiting scenes, German texts), `images.ts` (finds
`bilder/fox-<picture>.webp` and its `-b` frame), `StoryPicture.tsx` (the picture with its frames),
`PottyPlay.tsx` (steps, sounds, speech, the ✓), `potty.css`, `settings.ts` (`tinytaps.potty.v2`: mode;
speech and sounds from the home page). `potty.test.ts` fails when a picture of the story is missing, a
waiting scene lacks its second frame, or `bilder/` holds a picture of anybody else.

German only so far (`POTTY_TEXTS` is `Localized`, a translation goes next to `de` when asked for).

The waiting song (`waitMusic.ts`, `useWaitingMusic`): `musik/musik-toepfchen-warten-<lang>.mp3`, found by its file name, sung in the app language, else German; it loops without end and gets quiet while the voice speaks. While there is no file (none yet) or it loads, the synthesized tune (`playWaitNote`, four bars on `BEAT_MS`) repeats instead. Like the brushing song it is part of the game and plays even with Töne or Musik off. Songs come from Suno (`/musik-erzeugen`, see `musik/README.md`: a seamless loop, no fade-out); `languageStatus.ts` lists the sung languages, `potty.test.ts` checks that against the files.

## Rules

- Only Tapsi goes to the potty (the user's choice, to save pictures and tokens): every animal more would need the
  whole story of about 50 pictures drawn again. Never add another animal or family unless the user asks for it.
- Every step is one tap. What the child really does (sitting on the potty) has no fixed length: it never ends on a
  timer or on an ordinary tap. Taps while sitting keep the child there (a new waiting scene each, endlessly); only
  the clearly marked ✓ says „fertig“, and it must be seen at once (big, green, pulsing, a pointing hand).
- Sitting needs variety: every waiting tap brings a different scene with its own sound, and the scenes fit the
  need – flowing water and letting go for pipi, pressing for kaka – between silly ones. A new scene goes into
  `WAIT_SCENES`, `POTTY_TEXTS.scenes` and gets its two frames.
- Mama and Papa stand together and, once called, stay in every picture to the end, cheering or being silly.
  Nobody else comes in; every picture of a place is drawn from that place's first picture (`essen` for the
  kitchen, `bad` for the bathroom) as its only reference, so the room never changes – and the waiting scenes
  from `sitzen`, where Tapsi already sits on the one potty (see `bilder/README.md`).
- The pictures are 16:9 and cover the screen: everything that matters stays in the middle, the edges are only
  wall and floor, since phones on their side cut the top and bottom and tablets the sides.
- A song that waits for a tap is recorded as a seamless loop and played with `playLoop`, never as a fixed-length piece.
- The story never gives a star; only „Hat geklappt!“ does, once per opening. No empty fields that say „not done“.
