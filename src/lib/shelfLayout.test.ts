import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import {
  BOOK_ASPECT,
  BOOK_GAP,
  DAILY_TALL,
  LEAN_CLEAR,
  planShelf,
  SHELF_THINGS,
  SIGN_DIP,
  SIGN_OVER_POST,
  type ShelfRect,
  TAKE_OUT,
  UNDER_SIGN,
  WORDS_BREATH,
  TOY_SPAN,
} from "./shelfLayout";

/** The home page's places: the everyday helpers' books with the words carved before them, then three picture books. */
const BOOKS = [3, 1, 1, 1];

/** Of the everyday helpers' place, the words carved before their books (`CARVINGS` in Bookshelf.tsx, with `LEAN_CLEAR`). */
const CARVED = 1.4 + LEAN_CLEAR / BOOK_ASPECT;

/** The home page's places as Bookshelf.tsx makes them: the everyday helpers with the carved words, four picture books. */
const BOOKS_ONLY = [3.9 + CARVED, 1, 1, 1, 1];
/** …and the toy's poster after them (`TOY_SPAN`). */
const HOME = [...BOOKS_ONLY, TOY_SPAN];

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
  sign: { width: SIGN(height) * 7.1, height: SIGN(height) * 1.5, rise: SIGN(height) * 0.4 },
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
  // carved words, which stand centred under it at the board's far left, where a visitor looks first (user request,
  // November 2026): the books to take follow at their right, never under the sign, and its foxes stay on the screen;
  // the bottom of the screen's middle, where browsers note how to leave fullscreen, holds only the shelf's legs.
  test.each(ROOMS.filter(([w, h]) => w > h))(
    "a wide shelf's sign hangs at its top board's far left, clear of the books, in a %i × %i room",
    (width, height) => {
      const options = OPTIONS(height);
      const { cells, legs, sign, frame } = planShelf(width, height, BOOKS, options);
      expect(legs).toBeGreaterThanOrEqual(options.legs - 0.01);
      const top = cells.find((c) => c.books) as (typeof cells)[number];
      const bh = top.bh ?? 0;
      expect(sign).toBeDefined();
      if (!sign) return;
      // Down by `SIGN_DIP`, or deeper where the foxes on it would leave the screen.
      const dip = top.y + top.h * SIGN_DIP;
      if (Math.abs(sign.y + sign.h - dip) > 0.01) {
        expect(sign.y + sign.h).toBeGreaterThan(dip);
        expect(sign.y).toBeCloseTo(options.sign.rise);
      }
      // The row (`.shelf-row`): its 2 px padding, a gap from the post, the carved words' place with the lead, then the books.
      const books = top.books ?? [];
      const span = books.reduce((sum, b) => sum + BOOKS[b], 0);
      expect(books[0]).toBe(0);
      const start = top.x + 2 + BOOK_GAP * bh;
      const words = (CARVED * BOOK_ASPECT - LEAN_CLEAR) * bh + (top.lead ?? 0);
      const helpersStart = start + words + LEAN_CLEAR * bh;
      // At the far left, reaching at most half over the post, and clear of the first book to take, which leans towards it.
      expect(sign.x).toBeGreaterThanOrEqual(top.x - frame.post * SIGN_OVER_POST - 0.01);
      expect(sign.x).toBeLessThanOrEqual(top.x + BOOK_GAP * bh + 2.01);
      // Hanging above the helpers' books (`tall`) it keeps clear over their tops, else beside them.
      if (top.tall !== undefined) expect(sign.y + sign.h).toBeLessThanOrEqual(top.y + top.h - top.tall + 0.01);
      else {
        expect(sign.x + sign.w).toBeLessThanOrEqual(helpersStart - LEAN_CLEAR * bh + 0.01);
        // The carved words stand centred under it, narrower by their `pull` at the right.
        expect(start + (words - (top.pull ?? 0)) / 2).toBeCloseTo(sign.x + sign.w / 2, 0);
      }
      // Everything on the board fits it.
      expect((top.lead ?? 0) + span * BOOK_ASPECT * bh + (books.length + 1) * BOOK_GAP * bh).toBeLessThanOrEqual(top.w + 0.01);
      // The foxes on its o rise 0.4 of its letters above it, inside the shelf: it starts right at the screen's top (`--top`;
      // the fullscreen button is nailed onto its corner, user request, November 2026).
      expect(sign.y - 0.4 * SIGN(height)).toBeGreaterThanOrEqual(-0.01);
    },
  );

  // The sign and the carved words at the top board's far left take only the room they need: grown to a heading their
  // place took the books' room (user feedback, November 2026), and the books are what a child looks for. With the home
  // page's places (the everyday helpers about 3.8 picture books wide, four picture books), against the shelf without
  // sign and words; the floors lie just under what the plan gives, above what the bigger place gave.
  test.each([
    [1000, 650, 0.63],
    [1250, 640, 0.77],
    [1880, 900, 0.93],
  ])("the sign and the carved words leave the books big in a %i × %i room", (width, height, floor) => {
    const options = OPTIONS(height);
    const plain = planShelf(width, height, [3.8, 1, 1, 1, 1], { legs: options.legs }).bookHeight;
    expect(planShelf(width, height, [3.8 + CARVED, 1, 1, 1, 1], options).bookHeight).toBeGreaterThanOrEqual(plain * floor);
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
    const { cells } = planShelf(width, height, BOOKS, OPTIONS(height));
    for (const cell of cells.filter((c) => c.books)) {
      const bookHeight = cell.bh ?? 0;
      const n = cell.books?.length ?? 0;
      const span = (cell.books ?? []).reduce((sum, b) => sum + BOOKS[b], 0);
      expect((cell.lead ?? 0) + span * bookHeight * BOOK_ASPECT + (n + 1) * BOOK_GAP * bookHeight).toBeLessThanOrEqual(cell.w + 0.01);
      expect(bookHeight).toBeLessThanOrEqual(cell.h * TAKE_OUT + 0.01);
    }
  });

  // Sized all alike by the full board of the everyday helpers, the four picture books below were small on a tablet and
  // an upright phone, with empty room round them (user feedback, November 2026): each board's books are as big as its
  // own width and height allow, and the everyday helpers' compartment leaves them room to stand taller (`DAILY_TALL`).
  test.each(ROOMS)("each board's books are as big as its own room allows in a %i × %i room", (width, height) => {
    const plan = planShelf(width, height, BOOKS, OPTIONS(height));
    const boards = plan.cells.filter((c) => c.books);
    for (const cell of boards) {
      const n = cell.books?.length ?? 0;
      const span = (cell.books ?? []).reduce((sum, b) => sum + BOOKS[b], 0);
      const bh = cell.bh ?? 0;
      expect(bh).toBeGreaterThanOrEqual(plan.bookHeight);
      // Bound by its width, by its compartment's height, or by the biggest a book gets (380 px).
      const byWidth = (cell.w - (cell.lead ?? 0)) / (span * BOOK_ASPECT + (n + 1) * BOOK_GAP);
      const bound = Math.min(byWidth, (cell.h * TAKE_OUT) / (span > 1 && plan.upright ? DAILY_TALL : 1), 380);
      expect(bh).toBeGreaterThan(bound * (plan.upright ? 0.6 : 0.99));
      if (plan.upright && span > 1) expect(cell.h * TAKE_OUT).toBeGreaterThanOrEqual(bh * DAILY_TALL - 0.01);
    }
  });

  // With the home page's places (the everyday helpers and the words carved before them filling the top board, four
  // picture books below), the picture books on a laptop are clearly bigger than the full top board makes its books.
  test("the picture books below are bigger than the full top board makes its books, in a 1250 × 640 room", () => {
    const plan = planShelf(1250, 640, BOOKS_ONLY, OPTIONS(640));
    const [top, below] = plan.cells.filter((c) => c.books);
    expect(top.bh).toBeCloseTo(plan.bookHeight);
    expect(below.bh ?? 0).toBeGreaterThan(plan.bookHeight * 1.15);
  });

  // The toy's poster stands on the picture books' board (user request, 24 November 2026), and every picture book is as big
  // as that board allows: so the toy is small (`TOY_SPAN`), and the picture books keep most of their size beside it.
  test.each(ROOMS)("the toy's poster leaves the picture books at least 85 %% of their size, in a %i × %i room", (width, height) => {
    const sizes = (spans: number[]) => {
      const plan = planShelf(width, height, spans, OPTIONS(height));
      return plan.cells.filter((c) => c.books?.includes(1)).map((c) => c.bh ?? plan.bookHeight);
    };
    expect(sizes(HOME)[0]).toBeGreaterThanOrEqual(sizes(BOOKS_ONLY)[0] * 0.85);
  });

  // On a tablet the sign beside the carved words took half the top board, and the everyday helpers' spines were too thin
  // for their pictures (user feedback, November 2026): where the top compartment is tall enough, the sign hangs above
  // their books instead, which get the whole board and stand under it, clear of it, at least as high as a picture book.
  test.each([
    [1000, 650],
    [1000, 700],
  ])("on a tablet the sign hangs above the everyday helpers, which get the whole board, in a %i × %i room", (width, height) => {
    const options = OPTIONS(height);
    const plan = planShelf(width, height, HOME, options);
    const top = plan.cells.filter((c) => c.books)[0];
    const bh = top.bh ?? 0;
    expect(top.tall).toBeDefined();
    expect(top.tall ?? 0).toBeGreaterThanOrEqual(bh - 0.01);
    const sign = plan.sign as ShelfRect;
    expect(sign.y + sign.h + UNDER_SIGN * bh).toBeLessThanOrEqual(top.y + top.h - (top.tall ?? 0) + 0.01);
    expect(sign.x).toBeGreaterThanOrEqual(top.x - plan.frame.post * SIGN_OVER_POST - 0.01);
    expect(sign.y - 0.4 * SIGN(height)).toBeGreaterThanOrEqual(-0.01);
    // Bigger than with the sign beside the words: there they were about 100 px high.
    expect(bh).toBeGreaterThan(140);
    // The carved words keep a breath of room beside them, so the first book leaning towards them stays clear.
    expect(top.lead ?? 0).toBeGreaterThanOrEqual(WORDS_BREATH * bh - 0.01);
    // And only where the books get clearly bigger so: a laptop's stand taller beside the sign, under it they would be lower.
    expect(planShelf(1250, 640, HOME, OPTIONS(640)).cells.find((c) => c.books)?.tall).toBeUndefined();
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
    const css = ["bookshelf.css", "bookshelf-books.css"].map((file) => readFileSync(new URL(`../styles/${file}`, import.meta.url), "utf8")).join("\n");
    const rule = (selector: string) => css.match(new RegExp(`\\n${selector.replace(/[.>]/g, "\\$&")} \\{([^}]*)\\}`))?.[1] ?? "";
    expect(rule(".shelf-row")).toContain("justify-content: center");
    expect(rule(".shelf-row")).toContain("gap: calc(var(--bh) * var(--gap))");
    expect(rule(".shelf-end")).toContain("flex: 1 1 0");
    for (const place of [".shelf-row > .shelf-book", ".shelf-daily-row"]) {
      expect(rule(place)).toContain("transform");
      expect(rule(place)).not.toContain("auto");
    }
  });

  // The picture on an everyday helper's spine is how a child finds its book, and it was too small to recognise (user
  // feedback, November 2026): the label takes nearly the spine's width and the picture nearly the label's, and the books
  // stand taller than the picture books where their compartment lets them (`DAILY_TALL`).
  test("the everyday helpers' books stand tall with big pictures on their spines", () => {
    const css = readFileSync(new URL("../styles/bookshelf-books.css", import.meta.url), "utf8");
    const rule = (selector: string) => css.match(new RegExp(`\\n${selector.replace(/[.>]/g, "\\$&")} \\{([^}]*)\\}`))?.[1] ?? "";
    const [, side] = rule(".shelf-daily-label").match(/inset: [\d.]+% ([\d.]+)%/) ?? [];
    expect(Number(side)).toBeLessThanOrEqual(5);
    const [, picture] = rule(".shelf-daily-picture").match(/width: ([\d.]+)cqw/) ?? [];
    expect(Number(picture)).toBeGreaterThanOrEqual(90);
    expect(rule(".shelf-daily-books")).toContain("var(--daily-tall");
    expect(rule(".shelf-daily")).toContain("height: calc(var(--sh)");
    expect(DAILY_TALL).toBeGreaterThanOrEqual(1.3);
  });

  // Leaning, the books tied together with a ribbon looked unnatural (user feedback, November 2026).
  test("books tied together stand upright", () => {
    const css = readFileSync(new URL("../styles/bookshelf-books.css", import.meta.url), "utf8");
    const rule = (selector: string) => css.match(new RegExp(`\\n${selector.replace(/[.>]/g, "\\$&")} \\{([^}]*)\\}`))?.[1] ?? "";
    expect(rule(".shelf-daily-books > .shelf-bundle")).toContain("--lean: 0deg");
    expect(rule(".shelf-bundle")).not.toContain("rotate");
  });
});
