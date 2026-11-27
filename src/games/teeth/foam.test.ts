import { expect, test } from "bun:test";
import { FOAM_FROM_MS, foamStage, LIP_FOAM, LIP_POINTS } from "./foam";

// Idea X-31: the foam grows with the brushing, like real foam, and stays until it is done; quiet, as HTML layers.

const TOTAL = 109_000; // the shortest song's brushing (Spanish, 1:49)

test("no foam on the lips before the brushing, then more and more of it", () => {
  expect(foamStage(-3000, TOTAL, null)).toBe(0);
  expect(foamStage(0, TOTAL, null)).toBe(0);
  let last = 0;
  for (let at = 0; at < TOTAL; at += 500) {
    const stage = foamStage(at, TOTAL, null);
    expect(stage).toBeGreaterThanOrEqual(last);
    last = stage;
  }
  // All of it well before the end of even the shortest song.
  expect(Math.max(...FOAM_FROM_MS)).toBeLessThan(TOTAL * 0.7);
  expect(last).toBe(FOAM_FROM_MS.length);
});

test("the foam stays through the cheer until it is spat out, and is gone once the brush is put away", () => {
  expect(foamStage(TOTAL + 1000, TOTAL, "cheer")).toBe(FOAM_FROM_MS.length);
  expect(foamStage(TOTAL + 4000, TOTAL, "cheer")).toBe(FOAM_FROM_MS.length);
  expect(foamStage(TOTAL + 5000, TOTAL, "spit")).toBe(0);
  expect(foamStage(TOTAL + 5000, TOTAL, "tidy")).toBe(0);
  expect(foamStage(TOTAL + 9000, TOTAL, "rest")).toBe(0);
});

test("the corners foam first, then the lower lip – never the upper lip", () => {
  const lowerHalf = (at: number) => at > LIP_POINTS / 2 && at < LIP_POINTS;
  const corner = (at: number) => at === 0 || at === LIP_POINTS / 2;
  for (const f of LIP_FOAM) {
    expect({ at: f.at, onLowerLipOrCorner: corner(f.at) || lowerHalf(f.at) }).toEqual({ at: f.at, onLowerLipOrCorner: true });
    expect(f.stage).toBeGreaterThanOrEqual(1);
    expect(f.stage).toBeLessThanOrEqual(FOAM_FROM_MS.length);
  }
  const first = Math.min(...LIP_FOAM.map((f) => f.stage));
  expect(LIP_FOAM.filter((f) => f.stage === first).every((f) => corner(f.at))).toBe(true);
  expect(new Set(LIP_FOAM.map((f) => f.at)).size).toBe(LIP_FOAM.length);
});

test("the foam is drawn in small layers of its own that only fade, no bubbles rising or bursting", async () => {
  const mouth = await Bun.file("src/games/teeth/mouth.tsx").text();
  const css = await Bun.file("src/games/teeth/teeth.css").text();
  // Each clump a Sprite with its own little svg, never drawn into the mirror's picture.
  expect(mouth).toMatch(/<Sprite[^>]*className="lip-foam"/);
  // It never fades away in the mirror: it stays until the child spits it out (X-18).
  expect(mouth).not.toContain("lip-foam${");
  expect(css).not.toContain("teeth-foam-away");
  // Its keyframes change only the opacity.
  for (const name of ["teeth-foam-in"]) {
    const body = css.match(new RegExp(`@keyframes ${name} \\{([\\s\\S]*?)\\n\\}`))?.[1] ?? "";
    expect(body).toContain("opacity");
    expect(body).not.toMatch(/transform|filter/);
  }
});
