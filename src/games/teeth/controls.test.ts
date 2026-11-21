import { expect, test } from "bun:test";

// Zähne putzen shows no words on its picture and draws its controls (user feedback, November 2026, see CLAUDE.md):
// no headings or hints came back, and the pause button has no emoji.

const play = await Bun.file("src/games/teeth/TeethPlay.tsx").text();
const css = await Bun.file("src/games/teeth/teeth.css").text();

test("no heading or hint for grown-ups on the picture", () => {
  for (const words of ["Erbsengroß", "Ausspucken", "teeth-cue", "teeth-mouth", "teeth-clock"]) expect(play.includes(words) ? words : "").toBe("");
});

test("the controls are drawn, with no emoji", () => {
  for (const emoji of ["⏸️", "▶️", "🔁", "⏯️"]) expect(play.includes(emoji) ? emoji : "").toBe("");
});

test("the progress bar shows the time before the brushing as its first part", () => {
  expect(play).toContain("teeth-time intro");
});

// A sweet at the start and a tooth at the end said nothing of what each part of the bar is (user feedback, November
// 2026): the bar shows the routine's phases apart – eating sweets, getting the brush, the brushing's steps in a frame of
// their own, and putting the brush away, which keeps the bar until the brush is back in its cup.
test("the progress bar marks eating, getting the brush, brushing and putting the brush away apart", () => {
  expect(play).toContain('const PHASE_SYMBOL: Record<BarPhase, TeethSymbol | null> = { eat: "bonbon", fetch: "zahnpasta", ready: null, tidy: "becher" };');
  expect(play).toMatch(/<div className="teeth-brushing">\s*<div className="teeth-lane teeth-track">\s*\{STEPS\.map/);
  expect(play).toContain('<PhaseTile phase="tidy"');
  expect(play).toContain('ending === "rest" ? (');
  expect(play).toContain("introMs + totalMs + ENDING_MS - SEEK_END_MS");
  expect(css).toMatch(/\.teeth-brushing \{[^}]*background: #dff3e7;/);
});

// A jump on the progress bar into the story or the sink once played that part's pictures from its start, while the
// clock and the song were further on, and pausing there left the sky and the brows running (user feedback, November 2026).

test("a jump moves the story's and the sink's animations to where the clock is", () => {
  expect(play).toMatch(/getAnimations\(\{ subtree: true \}\)[^\n]*animation\.currentTime = into/);
  expect(play).toContain("setJumps((n) => n + 1)");
});

test("pausing stops every animation of the story and the sink, also those a part's more specific rule sets", () => {
  for (const scene of ["origin", "prep"]) {
    expect(css).toMatch(new RegExp(`\\.teeth-play\\.paused \\.${scene} \\*[^{]*\\{\\s*animation-play-state: paused !important;`));
  }
});

// The teeth as big as the screen allows (user request, November 2026): on a screen held sideways the controls stand as a
// slim strip at the left and the end's week, trophy and „Menü“ on a sheet at the right, never in a row under the mouth.
test("on a wide screen the controls stand at the side, with the bar running from top to bottom", () => {
  const wide = css.slice(css.indexOf("@media (orientation: landscape) {\n  .teeth-play {"));
  expect(wide).toMatch(/^@media \(orientation: landscape\) \{\s*\.teeth-play \{\s*flex-direction: row;/);
  expect(wide).toMatch(/\.teeth-controls \{\s*order: -1;\s*flex-direction: column;/);
  expect(wide).toMatch(/\.teeth-progress \{\s*flex-direction: column;/);
  expect(play).toContain('getComputedStyle(e.currentTarget).flexDirection === "column"');
});

test("the end's week, trophy and „Menü“ lie on a sheet sized by its own width, beside the head on a wide screen", () => {
  expect(css).toMatch(/\.teeth-end,\s*\.teeth-week-before \{\s*container-type: inline-size;/);
  expect(css).toMatch(/@media \(orientation: landscape\) \{\s*\.teeth-end,\s*\.teeth-week-before \{\s*width: min\(50%/);
});
