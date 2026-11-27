import { describe, expect, test } from "bun:test";
import { TEETH_PER_SIDE } from "./jaw";
import { PRELUDE_TEXTS } from "./lines";
import { FRAMINGS, MOUTH, STORY_TEETH } from "./origin";

// The story's mouth once showed six teeth above and four below, and the face stood small in the middle of a wide
// screen (user feedback, November 2026: show the right number of teeth and the mouth bigger).

describe("the story's teeth", () => {
  test.each(Object.entries(STORY_TEETH))("%s row: a child's ten milk teeth, narrowing towards the corners", (_, row) => {
    expect(row).toHaveLength(2 * TEETH_PER_SIDE);
    for (let i = 1; i < row.length; i++) {
      // Neighbours nearly touch: no overlap, no gap that looks like a lost tooth.
      const gap = row[i].x - row[i].width / 2 - (row[i - 1].x + row[i - 1].width / 2);
      expect(gap).toBeGreaterThanOrEqual(0);
      expect(gap).toBeLessThan(2);
    }
    const right = row.slice(TEETH_PER_SIDE);
    for (let i = 1; i < right.length; i++) expect(right[i].width).toBeLessThan(right[i - 1].width);
    for (const t of row) {
      expect(t.x - t.width / 2).toBeGreaterThan(MOUTH.left);
      expect(t.x + t.width / 2).toBeLessThan(MOUTH.right);
    }
  });

  test("the lower row stands inside the upper one", () => {
    const span = (row: typeof STORY_TEETH.upper) => row[row.length - 1].x - row[0].x;
    expect(span(STORY_TEETH.lower)).toBeLessThan(span(STORY_TEETH.upper));
  });
});

describe("the story's framings", () => {
  test.each(Object.entries(FRAMINGS))("%s: every sweet appears inside what is framed", (_, { focus, sweets }) => {
    for (const { x, y } of sweets) {
      expect(x).toBeGreaterThanOrEqual(focus.x);
      expect(x).toBeLessThanOrEqual(focus.x + focus.width);
      expect(y).toBeGreaterThanOrEqual(focus.y);
      expect(y).toBeLessThanOrEqual(focus.y + focus.height);
    }
  });

  test("the face's framing shows the face bigger than the head's", () => {
    expect(FRAMINGS.face.focus.height).toBeLessThan(FRAMINGS.head.focus.height * 0.85);
  });

  // The story is the same whatever the time of day (user request, November 2026): no sun or moon crossing its sky,
  // no sky turning to dusk or night, and the monsters' line „Aus dem Zucker wachsen …“ says nothing of day or night.
  test("has no sun or moon and one calm sky, whatever the time of day", async () => {
    const origin = await Bun.file("src/games/teeth/origin.tsx").text();
    const css = await Bun.file("src/games/teeth/teeth.css").text();
    for (const framing of Object.values(FRAMINGS)) expect(Object.keys(framing).sort()).toEqual(["focus", "sweets"]);
    expect(origin).not.toMatch(/SkyBody|origin-sky|STAR_PATH/);
    expect(css).not.toMatch(/\.origin-(sky|sun|moon)/);
    expect(css).not.toContain("teeth-origin-sky");
    for (const text of Object.values(PRELUDE_TEXTS.grow.cue ?? {})) expect(text).not.toMatch(/Nacht|Tag\b|night|day\b/i);
  });
});
