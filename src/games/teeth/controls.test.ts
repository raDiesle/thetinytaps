import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

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
  expect(play).toContain('{tidy && <PhaseTile phase="tidy"');
  expect(play).toContain('ending === "rest" ? (');
  // The putting away is a section of the bar too: a tap on it starts the cheer and the tidying.
  expect(play).toContain("const segments: [number, number][] = [...tileParts, ...stepParts, ...(tidy ? [tidyPart] : [])];");
  expect(play).toContain("introMs + totalMs + endingMs - 1");
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

// On tablets and phones the strip stood off the edge, its left side under the book's paper margin and short of the
// bottom (user feedback, November 2026): it runs the whole height, one gap from the ✕, the left and the bottom edge.
test("on a wide screen the strip runs the whole height, the same gap from the ✕, the picture's left and its bottom", () => {
  const wide = css.slice(css.indexOf("@media (orientation: landscape) {\n  .teeth-play {"));
  const rule = wide.slice(wide.indexOf(".teeth-controls {"), wide.indexOf("}", wide.indexOf(".teeth-controls {")));
  expect(rule).not.toContain("max-height");
  expect(rule).not.toMatch(/\bheight:/);
  expect(rule).toContain("align-self: stretch;");
  expect(rule).toContain("--teeth-edge: calc(var(--frame, 0px) + var(--teeth-gap));");
  expect(rule).toMatch(/margin: calc\(var\(--play-corner, 0px\) \+ var\(--teeth-gap\)/);
  expect(rule.match(/max\(var\(--teeth-edge\)/g)?.length).toBe(1);
  // On the left it lies at the paper margin even beside a camera's cut-out (user feedback, November 2026).
  expect(rule).toContain("calc(var(--teeth-edge) - max(6px, env(safe-area-inset-left)))");
});

// The brushing's steps were 8 px on a phone, hard to tap (user feedback, November 2026): beside the picture a phase
// takes only its symbol's height and the steps get the rest of the strip, however long each lasts.
test("on a wide screen the brushing's steps get the strip's free height", () => {
  const wide = css.slice(css.indexOf("@media (orientation: landscape) {\n  .teeth-play {"));
  expect(wide).toMatch(/\.teeth-tile \{\s*flex: none;\s*height: calc\(var\(--symbol\) \+ 4px\);/);
  expect(wide).toMatch(/\.teeth-brushing \{\s*flex: 1 1 0;/);
  expect(css).toMatch(/\.teeth-brushing \{\s*flex: 12 1 /);
});

test("the end's week, trophy and „Menü“ lie on a sheet sized by its own width, beside the head on a wide screen", () => {
  expect(css).toMatch(/\.teeth-end \{\s*container-type: inline-size;/);
  expect(css).toMatch(/@media \(orientation: landscape\) \{\s*\.teeth-end \{\s*width: min\(50%/);
});

// Beside the sink the week took the picture's room, and beside the first look in the mirror it pushed the face aside,
// which then jumped to the middle as the brushing began (user feedback, November 2026): the week waits for the end.
test("the week chart shows only at the end, never before the brushing", () => {
  expect(play.match(/<Week\b/g)?.length).toBe(1);
  expect(play).toMatch(/<div className="teeth-end">\s*\{settings\.week && <Week/);
});

// Which phases are shown is chosen behind ⚙️ on the strip itself, beside the progress bar (user request, November 2026),
// kept for every brushing: the story, getting the brush and putting it away can each be left out, the brushing to the
// song never – its row is locked on, and nothing in TeethPlay reads a setting to skip a step.
test("the phases are chosen behind ⚙️ on the strip, the brushing always stays", () => {
  const game = readFileSync("src/games/teeth/TeethGame.tsx", "utf8");
  expect(play).toMatch(/<PlayOptions inline=\{\{ button: "teeth-button teeth-options"/);
  expect(game).not.toContain("PlayOptions");
  for (const key of ["origin", "prep", "tidy"]) expect(game).toContain(`checked={settings.${key}}`);
  expect(game).toMatch(/<Toggle\s+icon=\{<PhaseIcon name="zahn" \/>\}[\s\S]*?checked\s+locked/);
  expect(play).not.toMatch(/settings\.\w+[^;]*STEPS|STEPS[^;]*settings\./);
  // Held, so a child's tap on the strip opens nothing.
  expect(readFileSync("src/components/PlayOptions.tsx", "utf8")).toMatch(/if \(inline\)[\s\S]*className=\{`hold-exit /);
});
