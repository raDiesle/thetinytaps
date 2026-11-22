# Hände waschen

Route `/haende-waschen/`, idea H-136 (`src/content/ideas/h-songs.ts`). Still `unfinished` in `CATEGORIES`: players
don't see it; it is reached from „🚧 In Arbeit“ on `/management/`. It is published once its song is made (H-142).

## How it plays

The child looks down at its own hands over the basin, as it sees them, and the hands wash themselves step by step to
the beat. The child watches and copies along: sleeves up, water on, hands wet, soap from the pump, then the five rubbing
steps learned in the Kita (palms, backs, between the fingers, thumbs, fingertips). Each rubbing step dissolves the dirt
monsters sitting on the hands in the foam. Then rinse, water off and the towel, and the clean hands shine. It plays at
once (`startMode="play"`) and ends with `GameEnd` („Nochmal“ only, a game with one level).

A tap on a monster makes it giggle and wobble (it never dies from a tap: the hands wash it off). A tap elsewhere on
the picture, or another key, makes the next waiting monster giggle. Only the button at the bar's start and Space pause; once paused, a tap on the picture goes on. The bar of segments along the bottom shows how
far it is: a tap on a segment, or the arrow keys, jumps to that step. Nothing is written on the picture and nothing is
said: the step names stand only in the bar's tooltips and aria labels.

## Files

- `steps.ts`: the steps in order with their beats (112 BPM, the tempo every sing-along helper shares, H-140) and their
  names in all seven languages; `STEP_STARTS`, `TOTAL_MS`, `stepAt`. Once the song exists, its measured verse starts
  take the place of `beats`, as in Zähne putzen's `sung.ts`.
- `sink.tsx`: the still picture (tiles, counter, basin, tap, soap bottle), 1600 × 900 units, and the moving layers
  over it (lever, stream, splash, pump head, towel), each placed with `place(AREAS.x)`.
- `hands.tsx`: one hand (`HandArt`, the left; the right is its mirror), the sleeve in the figure's colours
  (`useFigure()`, `topFill` and `PyjamaPattern` from Zähne putzen's `clothes.tsx`), foam, wet shine, the soap dab and
  the dirt monsters (`DIRT_MONSTERS`: which hand, which rubbing step, where).
- `HandwashPlay.tsx`: the clock (`later` of `useTimers`, the time left of a paused step kept in a ref), the sounds of
  each step, the placeholder tune, keys, the bar, the end. Takes `video` from the video page.
- `handwash.css`: every state and motion. Lasting states (sleeves up, water on, hands under, wet, foamy, clean) are
  classes on `.hw-stage` and move by `transition`. The motion within a step runs on `at-<stepId>` keyframes.
- `HandwashVideo.tsx`: the YouTube page `/management/video-haende/` in the shared `VideoRecorder` (Y-36), choosing
  morning or evening and naming the file by language, daytime and figure. Without a song it has no `youtube` texts yet.

## Rules

- A tap on the picture never pauses or stops the washing: a child alone would not know how to go on (the first version
  paused on a tap beside a monster, and the perf run's taps stopped it). Pausing is the bar's button and Space only.
- Every moving thing is an HTML layer of its own around its own small svg, and moves only by `transform`, `opacity`
  or `filter` (a hand, its rubbing, each monster, the foam, the stream's stripes). Never animate inside an svg, and
  never redraw the hands per beat: all drawings are `memo` and the clock only changes classes.
- The rubbing steps together last at least 20 seconds (`handwash.test.ts`): that is what hand washing asks for. When
  the song comes, keep its rubbing verses at least that long.
- The water is off while soaping and rubbing, as children learn it in the Kita, and on again for rinsing.
- Monsters dissolve silently in the foam, like Zähne putzen's sugar monsters: no burst, no sound of their own, nothing
  floating up.
- The stage covers the screen at 16 : 9 but is capped (`.hw-stage` width) so both hands stay whole, on a phone on its
  side (844 × 390) and upright.

## Dev helpers

- `?seite=<step id>` (`sleeves`, `water`, … `shine`) starts at that step; the address follows the step on screen.
- Arrow keys jump a step, Space pauses.
