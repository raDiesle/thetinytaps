# Hände waschen

Route `/haende-waschen/`, idea H-136 (`src/content/ideas/h-songs.ts`). Still `unfinished` in `CATEGORIES`: players
don't see it; it is reached from „🚧 In Arbeit“ on `/management/`. It is published once its song is made (H-142).

## How it plays

A clear guide to washing hands in thirteen steps (user request, 25 November 2026), all seen through the child's own
eyes, to the beat. The child watches and copies along:
1. `call` – Mama calls from the living room that dinner is nearly ready (painted picture `ruf`).
2. `stool` – into the bathroom and up onto the step stool (pictures `bad`, then `hocker`: the child's own feet on it).
3. `sleeves` – at the basin, seen from above: the sleeves are rolled up.
4. `soap` – the left hand presses the pump, soap lands in the right palm.
5. `palms`, `backs`, `backs2`, `between` – one hand soaps the other: palm on palm, each hand rubbing the back of the
   other, fingers laced. The foam grows bit by bit and the dirt fades bit by bit (`--dirt-hand`, `--dirt-fingers`).
6. `water` – the lever goes on, the fingers dip into the stream and pull back (cold, blue), then dip again (warm).
7. `rinse` – both hands rub under the stream and the foam goes bit by bit, the fingers first.
8. `off` – the lever goes off.
9. `towel` – the hands go into the towel on the right and its free side folds round them while they rub.
10. `run` – off to dinner (picture `essen`).

It plays at once (`startMode="play"`) and ends with `GameEnd` („Nochmal“ only, a game with one level). Its controls
are Zähne putzen's (user request, 26 November 2026): a tap on the picture pauses and a big „Pause“ sheet lies over it
(a tap on it, Space or Enter goes on); a strip of paper holds pause/play, „Von vorn“, the bar with one groove per step
(as long as the step, filling as it runs: rooms lilac, basin blue, rubbing green) and the time left – along the
picture's foot, and on a screen wider than tall as a slim strip down the left edge under the ✕. A tap or drag on the
bar, or the arrow keys, jumps to a step. Other keys make ripples. Nothing is written on the picture but „Pause“ and
nothing is said: the step names stand only in the bar's tooltips and aria labels.

## Files

- `steps.ts`: the steps in order with their beats (112 BPM, the tempo every sing-along helper shares, H-140), their
  names in all seven languages and the painted pictures each shows; `playedSteps` (steps whose pictures are missing
  are left out of the built site, the dev server shows a placeholder), `stepStarts`, `stepAt`. Once the song exists,
  its measured verse starts take the place of `beats`, as in Zähne putzen's `sung.ts`.
- `handwashPictures.ts`: the queued Gemini sheet with the four rooms (`ruf`, `bad`, `hocker`, `essen`), from the
  child's eyes, one shared description of the bathroom so it matches the drawn basin (pump left, mixer tap with a red
  and a blue dot, teal towel with stripes on the right). They land in `bilder/`; the game finds them by glob.
- `sink.tsx`: the still picture (tiles, counter, basin, tap, soap bottle, towel on its hook), 1600 × 900 units, and
  the moving layers over it. The tap is a gooseneck worked out once as a tube along a curve (`NECK`, `neckStrip`), (lever, stream, splash, pump head, the towel's free side), each placed with `place(AREAS.x)`.
- `hands.tsx`: one child's hand (`HandArt`, the left; the right is its mirror) seen from its back or its palm, closed
  or spread (`HandView`), in two parts (`HandPart`): the hand with its thumb, and the four fingers, each fading into the
  hand by its own mask so no seam shows when they bend; with nails, knuckle dimples, creases, palm lines, wrist folds, a
  rim light and a soft cast shadow; the sleeve in the
  figure's colours (`useFigure()`, `topFill` and `PyjamaPattern` from Zähne putzen's `clothes.tsx`) and its roll; foam,
  foam in three stages (`FoamStage`: patches, the full lather, the fingers'), wet shine, dirt (hand and fingers apart)
  and the soap dab, each for the same views.
- `HandwashPlay.tsx`: the clock (`later` of `useTimers`, the time left of a paused step kept in a ref), which views
  each hand shows per step (`VIEWS`; only the step before, this one and the next are mounted), how much dirt is left on
  hand and fingers (`DIRT`), the sounds, the placeholder tune, keys, the controls, the end. Takes `video` from the video page.
- `handwash.css`: every state and motion. Lasting states (sleeves up, water on, wet, `lather-patches`, `lather-full`,
  `lather-fingers`) are classes on `.hw-stage` and move by `transition`, staggered so foam comes and goes bit by bit;
  `--step` on the stage is the running step's length, so a motion that lasts the step is timed by it; each step's pose is `.at-<stepId> .hw-left/.hw-right .hw-pose`, its motion keyframes on
  `.hw-rub`. Transforms turn round the wrist (`transform-origin` at 68.6 %); the fingers' layer `.hw-fingers` bends
  by `scaleY` round the knuckles (40.7 %).
- `HandwashVideo.tsx`: the YouTube page `/management/video-haende/` in the shared `VideoRecorder` (Y-36), choosing
  morning or evening and naming the file by language, daytime and figure. Without a song it has no `youtube` texts yet.

## Rules

- **One hand soaps the other** (user feedback, 25 November 2026): soap comes from the pump into one palm, and the
  hands spread it by rubbing against each other – palm on palm, a palm over the other's back, fingers laced – never
  open hands side by side that get foam by magic. Rubbing hands overlap and the one on top shows the side that touches.
- **The hands go into the towel** (user feedback, 25 November 2026): they move behind the towel's face and its free
  side folds round them, so only the wrists show – never a towel laid over the hands from above.
- The water's warmth is shown: the fingers feel the stream first, pull back while it is cold (blue tint, lever towards
  the blue dot), and go in once it is warm.
- The order follows the user's list: soap and rub while the water is off, then water on, rinse, water off.
- The rooms are painted by Gemini from the child's eyes; the child itself is never shown in them, only its feet on the
  stool. One human Mama (user decision, 25 November 2026). Players never see a room before its picture is made.
- **Child's hands, never a grown-up's** (user feedback, 26 November 2026): short chubby fingers, a broad soft palm,
  small round nails, dimples over the knuckles, a fold at the wrist.
- **The fingers move, never stiff** (user feedback, 26 November 2026): the fingers are a layer of their own and bend
  round the knuckles while rubbing – the hand on top curls its fingers down over the one below, the one below flexes
  them a little. A new pose bends them too.
- **Foam and dirt change bit by bit** (user feedback, 26 November 2026): foam starts as patches, grows to the full
  lather and spreads onto the fingers over the rubbing steps, and the rinse washes it off in the same steps backwards;
  the dirt fades a little at each rubbing step, the fingers' last, and is gone after the rinse. Never all at once.
- **Every step takes its time** (user feedback, 26 November 2026: the steps were too quick to follow): the rubbing about
  30 seconds together, the other steps long enough to see what happens.
- **A tap on the picture pauses, as in Zähne putzen** (user request, 26 November 2026; it replaced the earlier rule
  that a tap never pauses): the controls are Zähne putzen's, copied with the `hw-` prefix, never its `teeth-` classes.
- **The tap is a real mixer tap in perspective** (user feedback, 26 November 2026): a round foot, a column, and a
  gooseneck arching over and coming down towards the eye, wider as it comes nearer, with chrome light and shade.
- Every class the game sets carries its `hw-` prefix (short modifiers `v-`, `f-`, `p-` only beside one): a bar groove
  called `room` took the bookshelf room's full height (`handwash.test.ts`).
- Every moving thing is an HTML layer of its own around its own small svg, and moves only by `transform`, `opacity`
  or `filter` (a hand, its rubbing, the foam, the dirt, the stream's stripes, the towel's flap). Never animate inside an
  svg, and never redraw the hands per beat: all drawings are `memo` and the clock only changes classes
  (`handwash.test.ts` checks the keyframes).
- The rubbing steps together last at least 20 seconds (`handwash.test.ts`): that is what hand washing asks for. When
  the song comes, keep its rubbing verses at least that long.
- The dirt fades silently while rubbing: no monsters, no burst, nothing floating up.
- The stage covers the screen at 16 : 9 but is capped (`.hw-stage` width) so both hands stay whole, on a phone on its
  side (844 × 390) and upright.

## Dev helpers

- `?seite=<step id>` (`call`, `stool`, `sleeves`, `soap`, … `run`) starts at that step; the address follows the step
  on screen.
- Arrow keys jump a step, Space pauses.
- The Browser pane hidden throttles `requestAnimationFrame`: take a few small screenshots after loading so the clock
  starts before judging a pose.
