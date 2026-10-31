import { describe, expect, test } from "bun:test";
import { BOOK_ASPECT, planShelf } from "./shelfLayout";

/** The home page's books: one per category, all one group. */
const GROUPS = [4];
/** Books in two groups that must not share a board. */
const TWO_GROUPS = [3, 4];

/** A phone on its side, upright, a tablet, a laptop, a big monitor (the room the shelf gets in each). */
const ROOMS = [
  [740, 300],
  [300, 700],
  [900, 640],
  [1150, 640],
  [1700, 900],
];

describe("the bookshelf", () => {
  test.each(ROOMS)("every book is on a board, once, in order, in a %i × %i room", (width, height) => {
    expect(planShelf(width, height, GROUPS).rows.flat()).toEqual([0, 1, 2, 3]);
    expect(planShelf(width, height, TWO_GROUPS).rows.flat()).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  test.each(ROOMS)("the books fit between the posts and under the boards in a %i × %i room", (width, height) => {
    const { rows, bookHeight, tierHeight, tierHeights, gap, width: shelfWidth, frame } = planShelf(width, height, GROUPS);
    expect(shelfWidth).toBeLessThanOrEqual(width);
    expect(bookHeight).toBeLessThan(tierHeight);
    for (const row of rows) expect(row.length * bookHeight * BOOK_ASPECT + (row.length + 1) * gap).toBeLessThanOrEqual(shelfWidth - 2 * frame.post);
    expect(tierHeights.length).toBe(rows.length);
    expect(frame.crown + frame.plinth + tierHeights.reduce((sum, tier) => sum + tier + frame.board, 0)).toBeCloseTo(height);
    rows.forEach((row, r) => {
      if (row.length) expect(tierHeights[r]).toBe(tierHeight);
    });
  });

  // A group stays together: a board never holds books of two groups.
  test("no board mixes two groups", () => {
    for (const [width, height] of ROOMS)
      for (const row of planShelf(width, height, TWO_GROUPS).rows) expect(row.every((i) => i < 3) || row.every((i) => i >= 3)).toBe(true);
  });

  // A tall shelf with its books on one board looked like an empty cupboard: the room above them gets boards of its own.
  test("the picture books leave no more than a little room above them", () => {
    for (const [width, height] of ROOMS) {
      const { bookHeight, tierHeight, frame } = planShelf(width, height, GROUPS);
      // Less than half a book's height over what they need: too little for a board of smaller books.
      expect(tierHeight).toBeLessThan(bookHeight / 0.8 + bookHeight * 0.5 + frame.board);
    }
  });

  test("a phone held upright stacks the books on more boards than one on its side, so they get bigger", () => {
    expect(planShelf(300, 700, GROUPS).rows.length).toBeGreaterThan(planShelf(740, 300, GROUPS).rows.length);
  });
});
