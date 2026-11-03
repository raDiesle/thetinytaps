/**
 * How the bookshelf of the home page (book look, Bookshelf.tsx) is laid out in the room it gets: its compartments, the
 * picture books standing in the wide ones and the grown-ups' things (RoomOptions) in narrow ones beside them, and how
 * big it all is. A pure function of the room's size, so it can be checked.
 */

/** A picture book's width for its height: a little taller than wide. */
export const BOOK_ASPECT = 0.82;

/** The biggest a book gets, also on a huge screen: a real shelf's books, not posters. */
const MAX_BOOK = 380;

/** The least room beside each picture book, in book heights: a child's finger finds one book, never two. */
export const BOOK_GAP = 0.3;

/**
 * A picture book's height for its compartment's: room above it to take it out. Only a little: the books are what a
 * child looks for, as big as the shelf allows (user feedback, October 2026).
 */
export const TAKE_OUT = 0.9;

/**
 * The things for grown-ups in the shelf's compartments (RoomOptions): the stickers of the child's figure (`figure`) are
 * stuck on the inner side of the shelf's right wall, the others stand on a board.
 */
export type ShelfThing = "music" | "playtime" | "figure" | "language";

/** In this order where they stand in a row (on top of an upright screen's shelf), the stickers at the right side. */
export const SHELF_THINGS: ShelfThing[] = ["music", "playtime", "language", "figure"];

/**
 * On a screen wider than tall all of them stand in one column at the shelf's right side, one compartment over the other
 * (user decision, November 2026): the hourglass on top in the tallest, the most needed; the speaker in the middle with
 * the stickers on the shelf's right wall beside it; the globe at the bottom.
 */
const SIDE_COLUMN: { things: ShelfThing[]; share: number }[] = [
  { things: ["playtime"], share: 0.38 },
  { things: ["music", "figure"], share: 0.31 },
  { things: ["language"], share: 0.31 },
];

/**
 * The sign with the app's name, on a screen wider than tall: it stands on the floor in front of the shelf's bottom left
 * corner, and Papa Fox with his child on the o of „Both“ (Logo) rises above it. Where the legs are short, they rise in
 * front of the bottom board's left end, so the board keeps that much room free of books (`ShelfCell.lead`), in the
 * sign's widths: up to the o. Where that would cost the books more (a screen nearly square), the legs grow instead and
 * the sign with its foxes stands wholly below the shelf.
 */
const SIGN_REACH = 0.86;

/** The shelf's planks, in px: the side posts, the walls between compartments, the top board, each board, the plinth. */
export interface ShelfFrame {
  post: number;
  wall: number;
  crown: number;
  board: number;
  plinth: number;
}

/** A rectangle in the shelf's front, in px from its top left corner. */
export interface ShelfRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** A compartment's opening: picture books standing in it, or grown-ups' things. */
export interface ShelfCell extends ShelfRect {
  /** The picture books in it, by their place in the list of books. */
  books?: number[];
  /** The grown-ups' things in it: one standing on its board, and the stickers (`figure`) on its right wall. */
  things?: ShelfThing[];
  /** Room at its left kept free of books, in px: the sign standing in front of it covers it (`SIGN_REACH`). */
  lead?: number;
}

/** The plan of the shelf. */
export interface ShelfLayout {
  width: number;
  height: number;
  frame: ShelfFrame;
  cells: ShelfCell[];
  /** The fronts of the planks between the compartments: the walls and the boards (the outer frame comes from `frame`). */
  planks: ShelfRect[];
  /** Each picture book's height (its width is `BOOK_ASPECT` of it). */
  bookHeight: number;
  /** Whether it is planned for an upright screen: the things on top, the sign hanging above the shelf. */
  upright: boolean;
  /** How high the legs it stands on are, below its `height` (a wide shelf's; 0 for an upright one). */
  legs: number;
}

/** What the plan is asked for besides the room's size. */
export interface ShelfOptions {
  /** The screen stands upright (its own shape, not the room's, so the room's size can't flip it back and forth). */
  upright?: boolean;
  /** The sign standing in front of a wide shelf, in px: its width, and its height from its feet to the foxes' heads. */
  sign?: { width: number; height: number };
  /** The least height of a wide shelf's legs, in px. */
  legs?: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** The planks' sizes for a shelf in a room of this size. */
function frameFor(width: number, height: number): ShelfFrame {
  const post = clamp(width * 0.018, 10, 22);
  return { post, wall: post * 0.8, crown: clamp(height * 0.03, 12, 20), board: clamp(height * 0.02, 8, 13), plinth: clamp(height * 0.032, 12, 22) };
}

/** How many picture books' widths the places `books` take together. */
const spanOf = (spans: number[], books: number[]) => books.reduce((sum, b) => sum + spans[b], 0);

/**
 * The biggest book whose places, `span` picture books wide together and `n` of them, stand in a row `width` wide with
 * `BOOK_GAP` round each, and that can be taken out of a `tier` high compartment.
 */
function bookFor(width: number, tier: number, span: number, n: number) {
  return Math.min(MAX_BOOK, tier * TAKE_OUT, width / (span * BOOK_ASPECT + (n + 1) * BOOK_GAP));
}

/** How wide a row of `n` places `span` picture books wide is best, books `bh` high: room between them and for a few books spine out at its ends. */
const rowWidth = (span: number, n: number, bh: number) => bh * (span * BOOK_ASPECT + (n - 1) * 0.6 + 1.4);

/** `count` books on `rows` boards, as even as can be, the fuller boards first. */
function split(count: number, rows: number): number[][] {
  const out: number[][] = [];
  let next = 0;
  for (let r = 0; r < rows; r++) {
    const n = Math.ceil((count - next) / (rows - r));
    out.push(Array.from({ length: n }, (_, i) => next + i));
    next += n;
  }
  return out;
}

/**
 * The places on two boards of a wide shelf: the everyday helpers' books (wider than a picture book) with the words
 * carved beside them alone up top, the picture books together below, where a child's eye finds them side by side (user
 * decision, November 2026). Evenly split where there are no such books or the picture books would be too many for one board.
 */
function boardsOf(spans: number[], rows: number): number[][] {
  const wide = spans.flatMap((s, i) => (s > 1 ? [i] : []));
  const rest = spans.flatMap((s, i) => (s > 1 ? [] : [i]));
  if (rows !== 2 || !wide.length || !rest.length || rest.length > 4) return split(spans.length, rows);
  return [wide, rest];
}

/** Of two ways, the one with more boards unless the other's books are much bigger: two books up top, not an empty board. */
function prefer<T extends { bh: number }>(more: T, fewer: T) {
  return more.bh * 1.25 >= fewer.bh ? more : fewer;
}

/**
 * The plan for a room of `width` × `height` and the places of the books, each `spans[i]` picture books wide (1 for a
 * picture book; the everyday helpers' books with the words carved beside them take more). A screen wider than tall gets
 * a narrow column at the right for the grown-ups' things (`SIDE_COLUMN`) and the books left of it, two boards of them
 * where that keeps them nearly as big (every board holds books, none only fills the shelf). An upright screen gets the
 * things in compartments on top and the books below.
 */
export function planShelf(width: number, height: number, spans: number[], options: ShelfOptions = {}): ShelfLayout {
  const upright = options.upright ?? width / height < 0.95;
  if (upright) return planUpright(width, height, spans);
  const sign = options.sign ?? { width: 0, height: 0 };
  const legs = options.legs ?? 0;
  // The sign's foxes in front of the bottom board, or longer legs with the sign wholly below it: what keeps the books bigger.
  const before = planWide(width, height - legs, spans, sign.width * SIGN_REACH, legs);
  const tall = Math.max(legs, sign.height);
  if (tall >= height * 0.4) return before;
  const below = planWide(width, height - tall, spans, 0, tall);
  return below.bookHeight > before.bookHeight ? below : before;
}

/**
 * The places on `rows` boards and the biggest book they leave room for: the widest board decides. A wide shelf's
 * boards hold the books by kind (`boardsOf`), and its last keeps `lead` free at its left.
 */
function rowsOf(spans: number[], rows: number, width: number, tier: number, wide = false, lead = 0) {
  const boards = wide ? boardsOf(spans, rows) : split(spans.length, rows);
  const leadOf = (r: number) => (r === boards.length - 1 ? lead : 0);
  const bh = Math.min(...boards.map((books, r) => bookFor(width - leadOf(r), tier, spanOf(spans, books), books.length)));
  return { boards, bh, leadOf, middle: Math.max(...boards.map((books, r) => leadOf(r) + rowWidth(spanOf(spans, books), books.length, bh))) };
}

function planWide(width: number, height: number, spans: number[], reach: number, legs: number): ShelfLayout {
  const count = spans.length;
  const frame = frameFor(width, height);
  const { post, wall, crown, board } = frame;
  const inner = height - crown - frame.plinth;
  const side = clamp(width * 0.12, 62, 150);
  const room = width - 2 * post - wall - side;
  const option = (rows: number) => {
    const tier = (inner - (rows - 1) * board) / rows;
    // The sign's o reaches this far over the bottom board, less the room left of its first book anyway.
    const first = rowsOf(spans, rows, room, tier, true, reach);
    const lead = Math.max(0, reach - BOOK_GAP * first.bh);
    return { rows, tier, lead, ...rowsOf(spans, rows, room, tier, true, lead) };
  };
  const plan = count > 1 ? prefer(option(2), option(1)) : option(1);
  const middle = Math.min(room, plan.middle);
  const mid = post;
  const right = mid + middle + wall;
  const cells: ShelfCell[] = [];
  const planks: ShelfRect[] = [{ x: mid + middle, y: crown, w: wall, h: inner }];
  const column = inner - (SIDE_COLUMN.length - 1) * board;
  let y = crown;
  SIDE_COLUMN.forEach(({ things, share }, i) => {
    if (i > 0) {
      planks.push({ x: right, y, w: side, h: board });
      y += board;
    }
    const h = i === SIDE_COLUMN.length - 1 ? crown + inner - y : column * share;
    cells.push({ x: right, y, w: side, h, things });
    y += h;
  });
  plan.boards.forEach((books, r) => {
    const y = crown + r * (plan.tier + board);
    const lead = plan.leadOf(r);
    cells.push({ x: mid, y, w: middle, h: plan.tier, books, ...(lead > 0 && { lead }) });
    if (r > 0) planks.push({ x: mid, y: y - board, w: middle, h: board });
  });
  return { width: right + side + post, height, frame, cells, planks, bookHeight: plan.bh, upright: false, legs };
}

function planUpright(width: number, height: number, spans: number[]): ShelfLayout {
  const count = spans.length;
  const frame = frameFor(width, height);
  const { post, wall, crown, board } = frame;
  const inner = height - crown - frame.plinth;
  const room = width - 2 * post;
  const things = clamp(inner * 0.16, 64, 150);
  const rest = inner - things - board;
  const option = (rows: number) => {
    const tier = (rest - (rows - 1) * board) / rows;
    return { rows, tier, ...rowsOf(spans, rows, room, tier) };
  };
  const plan = count > 2 ? prefer(option(count), option(2)) : option(1);
  // The books' boards only as high as they need; what is left goes to the things on top.
  const tier = Math.min(plan.tier, plan.bh / 0.75);
  const top = inner - plan.rows * (tier + board);
  const n = SHELF_THINGS.length;
  const middle = Math.min(room, Math.max(plan.middle, n * 64 + (n - 1) * wall));
  const cells: ShelfCell[] = [];
  const planks: ShelfRect[] = [];
  const cw = (middle - (n - 1) * wall) / n;
  if (top > cw * 3.2) {
    // Tall and narrow: the speaker over the hourglass on the left, the stickers over the globe on the right.
    const half = (middle - wall) / 2;
    const ch = (top - board) / 2;
    cells.push(
      { x: post, y: crown, w: half, h: ch, things: ["music"] },
      { x: post, y: crown + ch + board, w: half, h: ch, things: ["playtime"] },
      { x: post + half + wall, y: crown, w: half, h: ch, things: ["figure"] },
      { x: post + half + wall, y: crown + ch + board, w: half, h: ch, things: ["language"] },
    );
    planks.push(
      { x: post + half, y: crown, w: wall, h: top },
      { x: post, y: crown + ch, w: half, h: board },
      { x: post + half + wall, y: crown + ch, w: half, h: board },
    );
  } else {
    SHELF_THINGS.forEach((thing, i) => {
      cells.push({ x: post + i * (cw + wall), y: crown, w: cw, h: top, things: [thing] });
      if (i > 0) planks.push({ x: post + i * (cw + wall) - wall, y: crown, w: wall, h: top });
    });
  }
  plan.boards.forEach((books, r) => {
    const y = crown + top + r * (tier + board) + board;
    cells.push({ x: post, y, w: middle, h: tier, books });
    planks.push({ x: post, y: y - board, w: middle, h: board });
  });
  return { width: middle + 2 * post, height, frame, cells, planks, bookHeight: plan.bh, upright: true, legs: 0 };
}
