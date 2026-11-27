import { expect, test } from "bun:test";
import { foamyTeeth, GUM_FOAM, GUM_FOAM_SPREAD } from "./foam";
import { toothKey } from "./jaw";
import { dirtyFaces } from "./stains";
import { STEPS } from "./steps";

// Idea X-31, as the user corrected it (November 2026): the foam lies between the lips and the teeth, on the gum, and
// only where the brush has been or is now – never on the lips.

/** A monster on every tooth of every step, none brushed off yet. */
const monsters = STEPS.flatMap((step, k) => step.teeth.map((tooth) => ({ step: k, tooth })));
const dirtyAt = (phase: number) => dirtyFaces(phase, monsters, () => false);

test("no foam before the brushing; then only on the teeth brushed or being brushed", () => {
  expect(foamyTeeth(dirtyAt(-1)).size).toBe(0);
  // In the first step, with its monsters still there, only the tooth the brush is on has foam.
  const first = STEPS[0].teeth[0];
  expect([...foamyTeeth(dirtyAt(0), [toothKey(first)])]).toEqual([toothKey(first)]);
  // After the first step, its teeth have foam and no others.
  const after = foamyTeeth(dirtyAt(1));
  expect([...after].sort()).toEqual(STEPS[0].teeth.map(toothKey).sort());
  // And it spreads with the brush, step by step.
  let last = after.size;
  for (let phase = 2; phase <= STEPS.length; phase++) {
    const size = foamyTeeth(dirtyAt(phase)).size;
    expect(size).toBeGreaterThanOrEqual(last);
    last = size;
  }
});

test("the foam is a few small bubbles along the gum line, between it and the lip", () => {
  for (const b of GUM_FOAM) {
    expect(b.along).toBeGreaterThanOrEqual(0);
    expect(b.along).toBeLessThanOrEqual(1);
    // Down from the gum's edge towards the lip, never up onto the tooth.
    expect(b.down - b.r).toBeGreaterThanOrEqual(-1);
    // Small next to the teeth (about 30 tall) and under half the lip's thickness, so the lip covers what reaches under it.
    expect(b.r * (1 + GUM_FOAM_SPREAD)).toBeLessThanOrEqual(5);
  }
});

// Rows of even white bubbles with a blue ring were too loud (user feedback, November 2026): the foam is faint, big
// bubbles beside tiny ones, and no two teeth alike.
test("the foam's bubbles are unlike each other and faint", async () => {
  const sizes = GUM_FOAM.map((b) => b.r);
  expect(new Set(sizes).size).toBe(GUM_FOAM.length);
  expect(Math.max(...sizes)).toBeGreaterThanOrEqual(3 * Math.min(...sizes));
  const mouth = await Bun.file("src/games/teeth/mouth.tsx").text();
  const bubbles = mouth.match(/function FoamBubbles[\s\S]*?\n\}/)?.[0] ?? "";
  expect(bubbles).toMatch(/<g opacity=\{0\.[0-9]+\}>/);
  expect(bubbles).not.toContain("#bde0fe");
  expect(mouth).toMatch(/if \(n === seed % GUM_FOAM\.length\) return \[\];/);
});

test("the foam is drawn under the lips, in the still picture or a layer of its own that only fades", async () => {
  const mouth = await Bun.file("src/games/teeth/mouth.tsx").text();
  const css = await Bun.file("src/games/teeth/teeth.css").text();
  // Never on the lips again.
  expect(mouth).not.toMatch(/LIP_FOAM|lip-foam|FoamClump/);
  expect(css).not.toContain("lip-foam");
  // The still picture draws it inside the mouth with the teeth, and the layer of the teeth being brushed comes before
  // the lips' layer, so the lips lie over both.
  const still = mouth.match(/const still = useMemo\([\s\S]*?\n {2}\}, \[/)?.[0] ?? "";
  expect(still).toContain("<FoamBubbles");
  const foamLayer = mouth.indexOf('<div className="mouth-foam">');
  const lipsLayer = mouth.indexOf('<g clipPath="url(#mirror-moving)">{lipsAndWaiting}</g>');
  expect(foamLayer).toBeGreaterThan(0);
  expect(foamLayer).toBeLessThan(lipsLayer);
  // Its keyframes change only the opacity.
  const body = css.match(/@keyframes teeth-foam-in \{([\s\S]*?)\n\}/)?.[1] ?? "";
  expect(body).toContain("opacity");
  expect(body).not.toMatch(/transform|filter/);
});
