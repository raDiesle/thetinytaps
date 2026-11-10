import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { BOOK_ASPECT, BOOK_GAP, planShelf, SHELF_THINGS, SIGN_CLEAR, SIGN_DIP, type ShelfRect, TAKE_OUT } from "./shelfLayout";

/** The home page's places: the everyday helpers' books with the words carved beside them, then three picture books. */
const BOOKS = [3, 1, 1, 1];

/** Of the everyday helpers' place, the words carved beside their books (`CARVINGS` in Bookshelf.tsx). */
const CARVED = 1.4;

/** A phone on its side, upright, a tablet, a laptop, a big monitor (the room the shelf gets in each). */
const ROOMS = [
  [820, 310],
  [370, 700],
  [1000, 650],
  [1250, 640],
  [1880, 900],
  [740, 1000],
];

/** The letters' size of the sign with the app's name in a room this high (`SIGN_SIZE` in Bookshelf.tsx). */
const SIGN = (height: number) => Math.min(64, Math.max(20, height * 0.09));

/** What the home page asks for besides the room: the sign hanging in front of a wide shelf, the carved words, the legs' least height. */
const OPTIONS = (height: number) => ({
  sign: { width: SIGN(height) * 7.8, height: SIGN(height) * 1.5, rise: SIGN(height) * 0.4 },
  carved: CARVED,
  legs: height * 0.1,
});

const overlap = (a: ShelfRect, b: ShelfRect) => a.x < b.x + b.w - 0.01 && b.x < a.x + a.w - 0.01 && a.y < b.y + b.h - 0.01 && b.y < a.y + a.h - 0.01;

describe("the bookshelf", () => {
  test.each(ROOMS)("every book stands in a compartment, once, in order, in a %i × %i room", (width, height) => {
    expect(planShelf(width, height, BOOKS).cells.flatMap((c) => c.books ?? [])).toEqual([0, 1, 2, 3]);
  });

  test.each(ROOMS)("each of the grown-ups' things stands in the shelf once in a %i × %i room", (width, height) => {
    const { cells } = planShelf(width, height, BOOKS);
    expect(cells.flatMap((c) => c.things ?? []).sort()).toEqual([...SHELF_THINGS].sort());
    for (const cell of cells) {
      expect(Boolean(cell.books || cell.things?.length)).toBe(true);
      // Among books there are only the stickers, on the compartment's wall: the other things stand on a board of their own.
      if (cell.books) expect(cell.things?.filter((t) => t !== "figure") ?? []).toEqual([]);
    }
  });

  // The stickers of the child's figure are stuck on a compartment's right wall, the globe in a compartment of its own
  // (user feedback, October 2026): on an upright shelf the shelf's right side; on a wide one the right wall of the big
  // compartment on top, beside the everyday helpers, where they are seen better (user feedback, November 2026).
  test.each(ROOMS)("the stickers are on the right wall of their compartment, the globe apart from them, in a %i × %i room", (width, height) => {
    const { cells, frame, width: w, upright } = planShelf(width, height, BOOKS);
    const figure = cells.find((c) => c.things?.includes("figure"));
    const globe = cells.find((c) => c.things?.includes("language"));
    if (upright) expect(figure && figure.x + figure.w).toBeCloseTo(w - frame.post);
    else expect(figure).toEqual(cells.find((c) => c.books));
    expect(globe).not.toEqual(figure);
  });

  // All the grown-ups' things in one column at the right, the hourglass – the most needed – on top in the tallest
  // compartment, the speaker beside the stickers (user decision, November 2026).
  test.each(ROOMS.filter(([w, h]) => w > h))(
    "a wide shelf has the things in one column at its right, the hourglass on top, in a %i × %i room",
    (width, height) => {
      const { cells, frame, width: w } = planShelf(width, height, BOOKS);
      const things = cells.filter((c) => c.things && !c.books);
      for (const cell of things) expect(cell.x + cell.w).toBeCloseTo(w - frame.post);
      expect(things.map((c) => c.things)).toEqual([["playtime"], ["music"], ["language"]]);
      expect(things[0].y).toBeCloseTo(frame.crown);
      expect(things[0].h).toBe(Math.max(...things.map((c) => c.h)));
    },
  );

  // The sign with the app's name hangs on its chains in front of a wide shelf, down into its top compartment over the
  // carved words, which stand centred under it (user feedback, November 2026): never over a book to take or the wall with the stickers, its foxes
  // still on the screen; and the bottom of the screen's middle, where browsers note how to leave fullscreen, holds only
  // the shelf's legs.
  test.each(ROOMS.filter(([w, h]) => w > h))("a wide shelf's sign hangs into its top compartment, clear of the books, in a %i × %i room", (width, height) => {
    const options = OPTIONS(height);
    const { cells, bookHeight: bh, legs, sign, wordsShift } = planShelf(width, height, BOOKS, options);
    expect(legs).toBeGreaterThanOrEqual(options.legs - 0.01);
    const top = cells.find((c) => c.books) as (typeof cells)[number];
    expect(sign).toBeDefined();
    if (!sign) return;
    // Down by `SIGN_DIP`, or deeper where the foxes on it would leave the screen.
    const dip = top.y + top.h * SIGN_DIP;
    if (Math.abs(sign.y + sign.h - dip) > 0.01) {
      expect(sign.y + sign.h).toBeGreaterThan(dip);
      expect(sign.y).toBeCloseTo(options.sign.rise);
    }
    // The books stand together in the middle of what the trail leaves (`.shelf-row`): where the helpers' books end.
    const books = top.books ?? [];
    const span = books.reduce((sum, b) => sum + BOOKS[b], 0);
    const free = top.w - 4 - span * BOOK_ASPECT * bh - (books.length + 1) * BOOK_GAP * bh - (top.trail ?? 0);
    // Only the row's 2 px padding may be wanting, which the plan leaves out.
    expect(free).toBeGreaterThanOrEqual(-4.01);
    const helpersEnd = top.x + 2 + free / 2 + BOOK_GAP * bh + (BOOKS[0] - CARVED) * BOOK_ASPECT * bh;
    expect(books[0]).toBe(0);
    expect(sign.x).toBeGreaterThanOrEqual(helpersEnd + SIGN_CLEAR.books * bh - 0.01);
    expect(sign.x + sign.w).toBeLessThanOrEqual(top.x + top.w - SIGN_CLEAR.wall * bh + 0.01);
    // The carved words stand centred under it (user feedback, November 2026), moved right where it hangs right of them.
    const wordsMiddle = helpersEnd + (CARVED * BOOK_ASPECT * bh) / 2 + 0.05 * bh + (wordsShift ?? 0);
    expect(wordsMiddle).toBeCloseTo(sign.x + sign.w / 2, 0);
    // The foxes on its o rise 0.4 of its letters above it, inside the shelf: it starts right at the screen's top (`--top`;
    // the fullscreen button is nailed onto its corner, user request, November 2026).
    expect(sign.y - 0.4 * SIGN(height)).toBeGreaterThanOrEqual(-0.01);
    // Sign and words hang far right, so the books at their left come towards the shelf's middle (user feedback,
    // November 2026): right at the wall with the stickers, or no room is left at the board's right to move them into.
    const atWall = sign.x + sign.w > top.x + top.w - SIGN_CLEAR.wall * bh - 1;
    const noRoomRight = !top.trail;
    expect(atWall || noRoomRight).toBe(true);
  });

  test.each(ROOMS)("compartments and planks lie inside the frame and never on each other in a %i × %i room", (width, height) => {
    const { cells, planks, frame, width: w, height: h, legs } = planShelf(width, height, BOOKS, OPTIONS(height));
    expect(w).toBeLessThanOrEqual(width + 0.01);
    expect(h + legs).toBeCloseTo(height);
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
    const { cells, bookHeight } = planShelf(width, height, BOOKS, OPTIONS(height));
    for (const cell of cells.filter((c) => c.books)) {
      const n = cell.books?.length ?? 0;
      const span = (cell.books ?? []).reduce((sum, b) => sum + BOOKS[b], 0);
      expect((cell.trail ?? 0) + span * bookHeight * BOOK_ASPECT + (n + 1) * BOOK_GAP * bookHeight).toBeLessThanOrEqual(cell.w + 0.01);
      expect(bookHeight).toBeLessThanOrEqual(cell.h * TAKE_OUT + 0.01);
    }
  });

  // A board above the books holding only spines to fill the shelf looked odd: nothing up there could be tapped.
  test.each(ROOMS)("the top board of the books holds books, and two of them where there is room, in a %i × %i room", (width, height) => {
    const books = planShelf(width, height, BOOKS).cells.filter((c) => c.books);
    expect(books.length).toBeGreaterThan(1);
    expect(books[0].books?.length).toBeGreaterThanOrEqual(1);
  });

  // The everyday helpers with the carved words up top for the grown-ups, the picture books side by side below, where a
  // child's eye finds them together (user decision, November 2026).
  test("on a computer and a tablet the everyday helpers stand up top and the picture books together below", () => {
    for (const [width, height] of [
      [1000, 650],
      [1250, 640],
      [1880, 900],
      [820, 310],
    ])
      expect(planShelf(width, height, BOOKS, OPTIONS(height)).cells.flatMap((c) => (c.books ? [c.books] : []))).toEqual([[0], [1, 2, 3]]);
  });

  // On an upright phone one picture book on each board made a tall column of single books, and „Offline spielen“ hung in
  // the top compartment (user feedback, November 2026): the picture books stand two side by side, the everyday helpers
  // alone on their board, and the shelf stands on legs, with the sign hanging under it at the screen's bottom right.
  test.each([
    [370, 700],
    [740, 1000],
  ])("on an upright screen the picture books stand two on a board and the shelf on legs, in a %i × %i room", (width, height) => {
    for (const [books, boards] of [
      [BOOKS, [[0], [1, 2], [3]]],
      [
        [3, 1, 1, 1, 1],
        [[0], [1, 2], [3, 4]],
      ],
    ] as const) {
      const plan = planShelf(width, height, [...books], OPTIONS(height));
      expect(plan.upright).toBe(true);
      expect(plan.cells.flatMap((c) => (c.books ? [c.books] : []))).toEqual(boards.map((b) => [...b]));
      expect(plan.legs).toBeGreaterThanOrEqual(OPTIONS(height).legs - 0.01);
    }
    const css = readFileSync(new URL("../styles/bookshelf.css", import.meta.url), "utf8");
    expect(css).not.toMatch(/upright"\] \.shelf-offline/);
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

  // Leaning, the books tied together with a ribbon looked unnatural (user feedback, November 2026).
  test("books tied together stand upright", () => {
    const css = readFileSync(new URL("../styles/bookshelf.css", import.meta.url), "utf8");
    const rule = (selector: string) => css.match(new RegExp(`\\n${selector.replace(/[.>]/g, "\\$&")} \\{([^}]*)\\}`))?.[1] ?? "";
    expect(rule(".shelf-daily-books > .shelf-bundle")).toContain("--lean: 0deg");
    expect(rule(".shelf-bundle")).not.toContain("rotate");
  });
});
