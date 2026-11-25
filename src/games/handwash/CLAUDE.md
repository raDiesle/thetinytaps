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
   other, fingers laced. The foam grows and the dirt fades (`--dirt`).
6. `water` – the lever goes on, the fingers dip into the stream and pull back (cold, blue), then dip again (warm).
7. `rinse` – both hands rub under the stream and the foam goes.
8. `off` – the lever goes off.
9. `towel` – the hands go into the towel on the right and its free side folds round them while they rub.
10. `run` – off to dinner (picture `essen`).

It plays at once (`startMode="play"`) and ends with `GameEnd` („Nochmal“ only, a game with one level). A tap on the
picture or a key makes ripples; only the button at the bar's start and Space pause. The bar of segments along the
bottom shows how far it is: a tap on a segment, or the arrow keys, jumps to that step. Nothing is written on the
picture and nothing is said: the step names stand only in the bar's tooltips and aria labels.

## Files

- `steps.ts`: the steps in order with their beats (112 BPM, the tempo every sing-along helper shares, H-140), their
  names in all seven languages and the painted pictures each shows; `playedSteps` (steps whose pictures are missing
  are left out of the built site, the dev server shows a placeholder), `stepStarts`, `stepAt`. Once the song exists,
  its measured verse starts take the place of `beats`, as in Zähne putzen's `sung.ts`.
- `handwashPictures.ts`: the queued Gemini sheet with the four rooms (`ruf`, `bad`, `hocker`, `essen`), from the
  child's eyes, one shared description of the bathroom so it matches the drawn basin (pump left, mixer tap with a red
  and a blue dot, teal towel with stripes on the right). They land in `bilder/`; the game finds them by glob.
- `sink.tsx`: the still picture (tiles, counter, basin, tap, soap bottle, towel on its hook), 1600 × 900 units, and
  the moving layers over it (lever, stream, splash, pump head, the towel's free side), each placed with `place(AREAS.x)`.
- `hands.tsx`: one hand (`HandArt`, the left; the right is its mirror) seen from its back or its palm, closed or
  spread (`HandView`), with nails, knuckles, creases, palm lines, a rim light and a soft cast shadow; the sleeve in the
  figure's colours (`useFigure()`, `topFill` and `PyjamaPattern` from Zähne putzen's `clothes.tsx`) and its roll; foam,
  wet shine, dirt and the soap dab, each for the same views.
- `HandwashPlay.tsx`: the clock (`later` of `useTimers`, the time left of a paused step kept in a ref), which views
  each hand shows per step (`VIEWS`), how much dirt is left (`DIRT`), the sounds, the placeholder tune, keys, the bar,
  the end. Takes `video` from the video page.
- `handwash.css`: every state and motion. Lasting states (sleeves up, water on, wet, foamy) are classes on `.hw-stage`
  and move by `transition`; each step's pose is `.at-<stepId> .hw-left/.hw-right .hw-pose`, its motion keyframes on
  `.hw-rub`. Transforms turn round the wrist (`transform-origin` at 68.6 %).
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
- A tap on the picture never pauses or stops the washing: a child alone would not know how to go on. Pausing is the
  bar's button and Space only.
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
