import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { BOOK_ASPECT, BOOK_GAP, planShelf, SHELF_THINGS, type ShelfRect, TAKE_OUT } from "./shelfLayout";

/** The home page's places: the everyday helpers' books with the words carved beside them, then three picture books. */
const BOOKS = [2.2, 1, 1, 1];

/** A phone on its side, upright, a tablet, a laptop, a big monitor (the room the shelf gets in each). */
const ROOMS = [
  [820, 310],
  [370, 700],
  [1000, 650],
  [1250, 640],
  [1880, 900],
  [740, 1000],
];

const overlap = (a: ShelfRect, b: ShelfRect) => a.x < b.x + b.w - 0.01 && b.x < a.x + a.w - 0.01 && a.y < b.y + b.h - 0.01 && b.y < a.y + a.h - 0.01;

describe("the bookshelf", () => {
  test.each(ROOMS)("every book stands in a compartment, once, in order, in a %i × %i room", (width, height) => {
    expect(planShelf(width, height, BOOKS).cells.flatMap((c) => c.books ?? [])).toEqual([0, 1, 2, 3]);
  });

  test.each(ROOMS)("each of the grown-ups' things has a compartment of its own in a %i × %i room", (width, height) => {
    const { cells } = planShelf(width, height, BOOKS);
    expect(cells.flatMap((c) => (c.thing ? [c.thing] : [])).sort()).toEqual([...SHELF_THINGS].sort());
    for (const cell of cells) expect(Boolean(cell.books) !== Boolean(cell.thing)).toBe(true);
  });

  // The stickers of the child's figure are stuck on the shelf's right inner side, the globe in a compartment of its own
  // (user feedback, October 2026): theirs is the rightmost at the top, so its right wall is the shelf's.
  test.each(ROOMS)("the stickers' compartment lies at the shelf's right side, the globe apart from it, in a %i × %i room", (width, height) => {
    const { cells, frame, width: w } = planShelf(width, height, BOOKS);
    const figure = cells.find((c) => c.thing === "figure");
    const globe = cells.find((c) => c.thing === "language");
    expect(figure && figure.x + figure.w).toBeCloseTo(w - frame.post);
    expect(figure?.y).toBeCloseTo(frame.crown);
    expect(globe).not.toEqual(figure);
  });

  test.each(ROOMS)("compartments and planks lie inside the frame and never on each other in a %i × %i room", (width, height) => {
    const { cells, planks, frame, width: w, height: h } = planShelf(width, height, BOOKS);
    expect(w).toBeLessThanOrEqual(width + 0.01);
    expect(h).toBeCloseTo(height);
    const all = [...cells, ...planks];
    for (const r of all) {
      expect(r.x).toBeGreaterThanOrEqual(frame.post - 0.01);
      expect(r.x + r.w).toBeLessThanOrEqual(w - frame.post + 0.01);
      expect(r.y).toBeGreaterThanOrEqual(frame.crown - 0.01);
      expect(r.y + r.h).toBeLessThanOrEqual(h - frame.plinth + 0.01);
    }
    all.forEach((a, i) => {
      for (const b of all.slice(i + 1)) expect(overlap(a, b)).toBe(false);
    });
    // Together they fill the frame's inside: no hole the back panel would show through the front.
    const area = all.reduce((sum, r) => sum + r.w * r.h, 0);
    expect(area).toBeCloseTo((w - 2 * frame.post) * (h - frame.crown - frame.plinth), 0);
  });

  // Books pressed together were hard to see and a child's tap could catch the neighbour (user feedback, October 2026).
  test.each(ROOMS)("the books stand with room round each and can be taken out in a %i × %i room", (width, height) => {
    const { cells, bookHeight } = planShelf(width, height, BOOKS);
    for (const cell of cells.filter((c) => c.books)) {
      const n = cell.books?.length ?? 0;
      const span = (cell.books ?? []).reduce((sum, b) => sum + BOOKS[b], 0);
      expect(span * bookHeight * BOOK_ASPECT + (n + 1) * BOOK_GAP * bookHeight).toBeLessThanOrEqual(cell.w + 0.01);
      expect(bookHeight).toBeLessThanOrEqual(cell.h * TAKE_OUT + 0.01);
    }
  });

  // A board above the books holding only spines to fill the shelf looked odd: nothing up there could be tapped.
  test.each(ROOMS)("the top board of the books holds books, and two of them where there is room, in a %i × %i room", (width, height) => {
    const books = planShelf(width, height, BOOKS).cells.filter((c) => c.books);
    expect(books.length).toBeGreaterThan(1);
    expect(books[0].books?.length).toBeGreaterThanOrEqual(1);
  });

  test("on a computer and a tablet two books stand up top and two below", () => {
    for (const [width, height] of [
      [1000, 650],
      [1250, 640],
    ])
      expect(planShelf(width, height, BOOKS).cells.flatMap((c) => (c.books ? [c.books.length] : []))).toEqual([2, 2]);
  });

  // Spread over a wide board, the books stood with big empty room between them and looked lost on a big monitor (user
  // feedback, November 2026): they stand together in the middle, BOOK_GAP apart, and books spine out fill the ends.
  test("the books of a board stand together in the middle, not spread over it", () => {
    const css = readFileSync(new URL("../styles/bookshelf.css", import.meta.url), "utf8");
    const rule = (selector: string) => css.match(new RegExp(`\\n${selector.replace(/[.>]/g, "\\$&")} \\{([^}]*)\\}`))?.[1] ?? "";
    expect(rule(".shelf-row")).toContain("justify-content: center");
    expect(rule(".shelf-row")).toContain("gap: calc(var(--bh) * var(--gap))");
    expect(rule(".shelf-end")).toContain("flex: 1 1 0");
    for (const place of [".shelf-row > .shelf-book", ".shelf-daily-row"]) {
      expect(rule(place)).toContain("transform");
      expect(rule(place)).not.toContain("auto");
    }
  });
});
