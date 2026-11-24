import { expect, test } from "bun:test";
import { frameTicker } from "./level";

// A level draws only while something moves (code review R-G7, November 2026): every level rendered 60 times a second
// also while it waited for the first tap, at a stop and behind the end.

/** Runs `frameTicker` over one frame per entry of `moving` (`ms` apart, a 60 Hz screen by default) and returns which frames were drawn. */
function drawnFrames(moving: boolean[], ms = 16) {
  const drawn: number[] = [];
  let frame = 0;
  const tick = frameTicker(
    () => moving[frame],
    () => drawn.push(frame),
    0,
  );
  for (; frame < moving.length; frame++) tick((frame + 1) * ms);
  return drawn;
}

// A gaming phone's 120 Hz screen drew the level twice as often, and it stuttered now and then (user feedback, November 2026).
test("on a 120 or 144 Hz screen a level is drawn every second frame, evenly", () => {
  expect(drawnFrames(Array(8).fill(true), 1000 / 120)).toEqual([0, 2, 4, 6]);
  expect(drawnFrames(Array(8).fill(true), 1000 / 144)).toEqual([0, 2, 4, 6]);
});

test("a 90 Hz screen still draws every frame", () => {
  expect(drawnFrames(Array(6).fill(true), 1000 / 90)).toEqual([0, 1, 2, 3, 4, 5]);
});

test("on a 120 Hz screen the frame things come to rest in is drawn with the next one", () => {
  // Frame 1 brings things to rest, but comes too soon after frame 0: frame 2 draws it, then nothing.
  expect(drawnFrames([true, false, false, false, false], 1000 / 120)).toEqual([0, 2]);
});

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
