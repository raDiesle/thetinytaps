import { expect, test } from "bun:test";
import { clock } from "./clock";

test("the time left reads like a clock, rounded up to the second", () => {
  expect(clock(416.8)).toBe("6:57");
  expect(clock(60)).toBe("1:00");
  expect(clock(9.2)).toBe("0:10");
  expect(clock(0.4)).toBe("0:01");
  expect(clock(0)).toBe("0:00");
  expect(clock(-3)).toBe("0:00");
});
