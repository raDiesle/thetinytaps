# Aufs Töpfchen

Route `/toepfchen/` · idea H-06 (Töpfchen-Partys; built in the style of „Zähne putzen“, but tapped step by step).

„Muss mal!“: an animal – Tapsi the fox, Bruno the bear or Hoppel the bunny (`ANIMALS` in `content.ts`, chosen on the start screen; „Weiter“ brings the next) – waits by the bathroom door with a thought bubble of a potty, still and silent. Every tap or key is the next step (`STEPS`): walk to the potty, trousers down, sit down (a short synthesized waiting tune, `playWaitNote`, 16 beats; the head sways; then the trickle comes by itself, `playTrickle`, happy eyes and drops), tear off paper and wipe, stand up and trousers up, carry the potty to the toilet, empty it and flush (the water swirls), wash hands at the sink (water, foam), party (applause and confetti), then `GameEnd`. A tap while a step still runs only sparkles (`busy`). Animals instead of a child, so „Hose runter“ shows only fur. The row of step icons at the bottom shows where the story is (no text).

„Hat geklappt!“ (`PartyPlay.tsx`): for real successes. A grown-up opens it after the child went; the first tap brings applause, confetti, the animal jumping and a star on today's column of a week chart (`stars.ts`, `tinytaps.potty.stars.v1`, counts per day, kept two weeks; `dayKey`/`weekOf` come from Zähne putzen's `daytime.ts`). One opening is one star; further taps only sparkle, „Nochmal“ celebrates again without a star, „Weiter“ goes to „Muss mal!“.

Files: `drawings.tsx` (bathroom, potty, toilet, sink, paper roll, the animal, all front views in world units with the floor at y = 600), `PottyPlay.tsx` (steps, sounds, speech, the camera), `potty.css` (all motion, switched by `pt-at-<step>` and flags like `pt-sitting`, `pt-pants-down`, `pt-peed` on the root; durations match `STEPS[].ms` and the sound times), `content.ts` (animals, steps, German texts), `settings.ts` (`tinytaps.potty.v1`: mode, animal; speech and sounds from the home page). The camera (`camera()` in `PottyPlay.tsx`) zooms each step's `FOCUS` box into the screen above the row of steps, so the picture fills phones on their side as well as tablets; the wall and floor are drawn far wider than the room.

German only so far (`POTTY_TEXTS` is `Localized`, a translation goes next to `de` when asked for). The waiting tune is synthesized; a sung Suno song (`/musik-erzeugen`) would be made only when the user asks.

## Rules

- Every step is one tap; what happens by itself is only what can't be tapped (the waiting and the trickle after sitting down). Waiting is part of the lesson: keep the tune, don't skip it on a tap.
- The potty must show while the animal sits: `PottyFront` is drawn over the animal between its knees. Whatever sits in front of something must leave the thing visible.
- An animation with a delay whose 0 % keyframe is visible uses `forwards`, not `both`: `both` shows the first keyframe during the delay (the swirl once showed in the toilet before the flush).
- A new step: its motion in `potty.css` under `.pt-at-<id>`, its sounds in `begin()` at the same times, its `FOCUS`, and `ms` long enough for both.
- The story never gives a star; only „Hat geklappt!“ does, once per opening. No empty fields that say „not done“.
