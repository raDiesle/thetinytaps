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
