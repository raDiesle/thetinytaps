import { expect, test } from "bun:test";
import { AFTER_END_S, tickClock } from "./MachineStage";

// A machine's picture may move a little behind its end, never for ever: an end that kept moving had an old phone paint
// in every frame for as long as the end was shown (perf, A-36).
test("a machine's clock stands AFTER_END_S after its end", () => {
  const machine = { duration: 60 };
  let t = 0;
  for (let i = 0; i < 60 * 120; i++) t = tickClock(machine, t, 1 / 60);
  expect(t).toBe(60 + AFTER_END_S);
  expect(tickClock(machine, t, 1 / 60)).toBe(t);
  expect(tickClock(machine, 10, 0.5)).toBe(10.5);
  // A seek past the end stays where it was put.
  expect(tickClock(machine, 90, 1 / 60)).toBe(90);
});
