import { describe, expect, test } from "bun:test";
import { BOOK_ASPECT, planShelf } from "./shelfLayout";

/** The home page's books: three categories, four games of „Weitere“. */
const GROUPS = [3, 4];

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
    expect(planShelf(width, height, GROUPS).rows.flat()).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  test.each(ROOMS)("the books fit between the posts and under the boards in a %i × %i room", (width, height) => {
    const { rows, bookHeight, tierHeight, gap, width: shelfWidth, frame } = planShelf(width, height, GROUPS);
    expect(shelfWidth).toBeLessThanOrEqual(width);
    expect(bookHeight).toBeLessThan(tierHeight);
    for (const row of rows) expect(row.length * bookHeight * BOOK_ASPECT + (row.length + 1) * gap).toBeLessThanOrEqual(shelfWidth - 2 * frame.post);
    expect(frame.crown + frame.plinth + rows.length * (tierHeight + frame.board)).toBeCloseTo(height);
  });

  // A group stays together: „Weitere“ never shares a board with a category, so its label names only its own books.
  test("no board mixes the categories with „Weitere“", () => {
    for (const [width, height] of ROOMS)
      for (const row of planShelf(width, height, GROUPS).rows) expect(row.every((i) => i < 3) || row.every((i) => i >= 3)).toBe(true);
  });

  test("a phone held upright puts „Weitere“ on two boards, so its books get bigger", () => {
    expect(planShelf(300, 700, GROUPS).rows.length).toBeGreaterThan(2);
    expect(planShelf(740, 300, GROUPS).rows.length).toBe(2);
  });
});
