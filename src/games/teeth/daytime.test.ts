import { expect, test } from "bun:test";
import { addBrushing, dayKey, daytimeOf, weekOf } from "./daytime";

// Dates are easy to get wrong by one: the week starts on Monday, local dates, no double stars.

test("the clock picks morning before two and evening after", () => {
  expect(daytimeOf(new Date(2026, 9, 24, 7, 30))).toBe("morning");
  expect(daytimeOf(new Date(2026, 9, 24, 13, 59))).toBe("morning");
  expect(daytimeOf(new Date(2026, 9, 24, 14, 0))).toBe("evening");
  expect(daytimeOf(new Date(2026, 9, 24, 19, 0))).toBe("evening");
});

test("the week runs from Monday to Sunday", () => {
  // 24 October 2026 is a Saturday, 25 a Sunday.
  for (const day of [24, 25, 19]) {
    const week = weekOf(new Date(2026, 9, day, 20));
    expect(week.map(dayKey)).toEqual(["19", "20", "21", "22", "23", "24", "25"].map((d) => `2026-10-${d}`));
  }
  expect(weekOf(new Date(2026, 10, 1)).map(dayKey)[0]).toBe("2026-10-26");
});

test("a brushing counts once a day and old days go", () => {
  const today = new Date(2026, 9, 24, 19);
  let log = addBrushing({ "2026-09-01": ["morning"], "2026-10-20": ["evening"] }, today, "evening");
  log = addBrushing(log, today, "evening");
  log = addBrushing(log, today, "morning");
  expect(log).toEqual({ "2026-10-20": ["evening"], "2026-10-24": ["evening", "morning"] });
});
