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

// A jump on the progress bar into the story or the sink once played that part's pictures from its start, while the
// clock and the song were further on, and pausing there left the sky and the brows running (user feedback, November 2026).
const css = await Bun.file("src/games/teeth/teeth.css").text();

test("a jump moves the story's and the sink's animations to where the clock is", () => {
  expect(play).toMatch(/getAnimations\(\{ subtree: true \}\)[^\n]*animation\.currentTime = into/);
  expect(play).toContain("setJumps((n) => n + 1)");
});

test("pausing stops every animation of the story and the sink, also those a part's more specific rule sets", () => {
  for (const scene of ["origin", "prep"]) {
    expect(css).toMatch(new RegExp(`\\.teeth-play\\.paused \\.${scene} \\*[^{]*\\{\\s*animation-play-state: paused !important;`));
  }
});
