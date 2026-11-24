import { describe, expect, test } from "bun:test";
import { TEETH_PER_SIDE } from "./jaw";
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

  test("on the face's framing the sun or moon starts in the sky, clear of the sweet coming on that side", () => {
    const { arc, sweets, focus } = FRAMINGS.face;
    // Where `.origin-sky-body` starts: turned -35° round the point below the top of its arc.
    const a = (-35 * Math.PI) / 180;
    const start = { x: 220 + arc.radius * Math.sin(a), y: arc.top + arc.radius * (1 - Math.cos(a)) };
    expect(start.x).toBeGreaterThan(focus.x);
    expect(start.y).toBeGreaterThan(focus.y);
    const left = sweets.filter((s) => s.x < 220);
    for (const s of left) expect(Math.hypot(s.x - start.x, s.y - start.y)).toBeGreaterThan(70);
  });
});
