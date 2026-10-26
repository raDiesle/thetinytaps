# Aufs Töpfchen

Route `/toepfchen/` · idea H-06 (Töpfchen-Partys; built in the style of „Zähne putzen“, but tapped step by step).

„Muss mal!“: an animal – Tapsi the fox, Bruno the bear or Hoppel the bunny (`ANIMALS` in `content.ts`, chosen on the start screen; „Weiter“ brings the next) – waits by the bathroom door with a thought bubble of a potty, still and silent. Every tap or key is the next step (`STEPS`): walk to the potty, trousers down, sit down (then the waiting, as long as it takes: the head sways and the waiting song repeats until a tap; that tap brings the trickle, `playTrickle`, happy eyes and drops; the next tap goes on), tear off paper and wipe, stand up and trousers up, carry the potty to the toilet, empty it and flush (the water swirls), wash hands at the sink (water, foam), party (applause and confetti), then `GameEnd`. A tap while a step still runs only sparkles (`busy`). Animals instead of a child, so „Hose runter“ shows only fur. The row of step icons at the bottom shows where the story is (no text).

„Hat geklappt!“ (`PartyPlay.tsx`): for real successes. A grown-up opens it after the child went; the first tap brings applause, confetti, the animal jumping and a star on today's column of a week chart (`stars.ts`, `tinytaps.potty.stars.v1`, counts per day, kept two weeks; `dayKey`/`weekOf` come from Zähne putzen's `daytime.ts`). One opening is one star; further taps only sparkle, „Nochmal“ celebrates again without a star, „Weiter“ goes to „Muss mal!“.

Files: `drawings.tsx` (bathroom, potty, toilet, sink, paper roll, the animal, all front views in world units with the floor at y = 600), `PottyPlay.tsx` (steps, sounds, speech, the camera), `potty.css` (all motion, switched by `pt-at-<step>` and flags like `pt-sitting`, `pt-pants-down`, `pt-peed` on the root; durations match `STEPS[].ms` and the sound times), `content.ts` (animals, steps, German texts), `settings.ts` (`tinytaps.potty.v1`: mode, animal; speech and sounds from the home page). The camera (`camera()` in `PottyPlay.tsx`) zooms each step's `FOCUS` box into the screen above the row of steps, so the picture fills phones on their side as well as tablets; the wall and floor are drawn far wider than the room.

German only so far (`POTTY_TEXTS` is `Localized`, a translation goes next to `de` when asked for).

The waiting song (`waitMusic.ts`, `useWaitingMusic`): `musik/musik-toepfchen-warten-<lang>.mp3`, found by its file name, sung in the app language, else German; it loops without end and gets quiet while the voice speaks. While there is no file (none yet) or it loads, the synthesized tune (`playWaitNote`, four bars on `BEAT_MS`) repeats instead. Like the brushing song it is part of the game and plays even with Töne or Musik off. Songs come from Suno (`/musik-erzeugen`, see `musik/README.md`: a seamless loop, no fade-out); `languageStatus.ts` lists the sung languages, `potty.test.ts` checks that against the files.

## Rules

- Every step is one tap. What the child really does (sitting on the potty) has no fixed length: it loops – motion and music – until the tap that says „fertig“, never ends on a timer. Only a short guard after sitting down (`SIT_GUARD_MS`) keeps the tap that sat down from ending it.
- A song that waits for a tap is recorded as a seamless loop and played with `playLoop`, never as a fixed-length piece.
- The potty must show while the animal sits: `PottyFront` is drawn over the animal between its knees. Whatever sits in front of something must leave the thing visible.
- An animation with a delay whose 0 % keyframe is visible uses `forwards`, not `both`: `both` shows the first keyframe during the delay (the swirl once showed in the toilet before the flush).
- A new step: its motion in `potty.css` under `.pt-at-<id>`, its sounds in `begin()` at the same times, its `FOCUS`, and `ms` long enough for both.
- The story never gives a star; only „Hat geklappt!“ does, once per opening. No empty fields that say „not done“.
