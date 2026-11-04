import { expect, test } from "bun:test";

// Zähne putzen shows no words on its picture and draws its controls (user feedback, November 2026, see CLAUDE.md):
// no headings or hints came back, and the pause button has no emoji.

const play = await Bun.file("src/games/teeth/TeethPlay.tsx").text();

test("no heading or hint for grown-ups on the picture", () => {
  for (const words of ["Erbsengroß", "Ausspucken", "teeth-cue", "teeth-mouth", "teeth-clock"]) expect(play.includes(words) ? words : "").toBe("");
});

test("the controls are drawn, with no emoji", () => {
  for (const emoji of ["⏸️", "▶️", "🔁", "⏯️"]) expect(play.includes(emoji) ? emoji : "").toBe("");
});

test("the progress bar shows the time before the brushing as its first part", () => {
  expect(play).toContain("teeth-segment intro");
  expect(play).toContain("teeth-time intro");
});
