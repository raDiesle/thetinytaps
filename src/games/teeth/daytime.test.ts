import { expect, test } from "bun:test";
import { addBrushing } from "./daytime";

// No double stars, and the log keeps only the last two weeks. The dates themselves are checked in `src/lib/days.test.ts`.

test("a brushing counts once a day and old days go", () => {
  const today = new Date(2026, 9, 24, 19);
  let log = addBrushing({ "2026-09-01": ["morning"], "2026-10-20": ["evening"] }, today, "evening");
  log = addBrushing(log, today, "evening");
  log = addBrushing(log, today, "morning");
  expect(log).toEqual({ "2026-10-20": ["evening"], "2026-10-24": ["evening", "morning"] });
});
