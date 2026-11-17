import { expect, test } from "bun:test";
import { frameTicker } from "./level";

// A level draws only while something moves (code review R-G7, November 2026): every level rendered 60 times a second
// also while it waited for the first tap, at a stop and behind the end.

/** Runs `frameTicker` over one frame per entry of `moving` (16 ms apart) and returns which frames were drawn. */
function drawnFrames(moving: boolean[]) {
  const drawn: number[] = [];
  let frame = 0;
  const tick = frameTicker(
    () => moving[frame],
    () => drawn.push(frame),
    0,
  );
  for (; frame < moving.length; frame++) tick((frame + 1) * 16);
  return drawn;
}

test("a level that moves draws every frame", () => {
  expect(drawnFrames([true, true, true])).toEqual([0, 1, 2]);
});

test("the frame things come to rest in is drawn, then nothing until they move again", () => {
  // Frame 2's step brings things to rest: drawn, so the picture shows where they came to rest; 3–4 are still; 5 moves
  // again (a tap), and 6 draws where that came to rest.
  expect(drawnFrames([true, true, false, false, false, true, false, false])).toEqual([0, 1, 2, 5, 6]);
});

test("a level still from the start draws its first frame only", () => {
  expect(drawnFrames([false, false, false])).toEqual([0]);
});

test("the step runs every frame, drawn or not, with dt capped", () => {
  const dts: number[] = [];
  const tick = frameTicker(
    (dt) => {
      dts.push(dt);
      return false;
    },
    () => {},
    0,
  );
  tick(16);
  tick(32);
  tick(5000);
  expect(dts).toEqual([0.016, 0.016, 0.05]);
});
