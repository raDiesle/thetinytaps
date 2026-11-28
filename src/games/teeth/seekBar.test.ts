import { expect, test } from "bun:test";
import { sectionStart } from "./seekBar";

// A tap on the progress bar starts the section tapped from its beginning (user feedback, November 2026).
test("a tap anywhere in a section lands at its start", () => {
  const starts = [0, 15000, 22000, 30000, 46000];
  expect(sectionStart(0, starts)).toBe(0);
  expect(sectionStart(14999, starts)).toBe(0);
  expect(sectionStart(15000, starts)).toBe(15000);
  expect(sectionStart(29999, starts)).toBe(22000);
  expect(sectionStart(99999, starts)).toBe(46000);
  expect(sectionStart(-5, starts)).toBe(0);
});

test("the progress bar seeks only to a section's start", async () => {
  const play = await Bun.file("src/games/teeth/TeethPlay.tsx").text();
  const body = play.slice(play.indexOf("const seekFromPointer"), play.indexOf("useEffect(", play.indexOf("const seekFromPointer")));
  expect(body).toContain("sectionStart(");
  expect(body).not.toMatch(/seek\(Math\.min\(start \+ k \* length/);
});

// A tap low on the sweets' groove once started only the monsters growing, the second part hidden in it: a tap plays the
// groove as it is seen from its start (user feedback, November 2026).
test("the sections are the bar's grooves as they are seen, not the parts inside them", async () => {
  const play = await Bun.file("src/games/teeth/TeethPlay.tsx").text();
  expect(play).toContain("const sectionStarts = segments.map(([start]) => start);");
});

// A step tapped on the bar while paused showed the one before (user feedback, November 2026): the clock lands on
// `introMs + start`, and `(introMs + start) - introMs` can come out a hair under `start`, so a phase reached by
// `brushed >= start` was not reached until the clock ran on. TeethPlay compares on the clock, summed as the bar's
// sections are, and a paused jump to another picture shows it at once (`sceneAfter` in scenes.tsx).
test("the part tapped while paused is the part shown", async () => {
  // Such sums really do lose the start: the reason the comparison is made on the clock.
  const introMs = 0.7;
  const start = 0.1;
  expect(introMs + start - introMs).toBeLessThan(start);
  const play = await Bun.file("src/games/teeth/TeethPlay.tsx").text();
  expect(play).toContain("elapsed >= introMs + at");
  expect(play).toContain("const pastEnd = (at: number) => elapsed >= introMs + totalMs + at;");
  expect(play).not.toMatch(/brushed >= (at|totalMs)\b/);
  expect(play).not.toContain("const after = brushed - totalMs");
});
