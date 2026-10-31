/**
 * How the bookshelf of the home page (book look, Bookshelf.tsx) is laid out in the room it gets: its compartments, the
 * picture books standing in the middle ones and the grown-ups' things (RoomOptions) in narrow ones beside them, and how
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
 * The things for grown-ups standing in the shelf's side compartments, one each (RoomOptions). The stickers of the
 * child's figure have none of their own: they are stuck on the back wall above the globe.
 */
export type ShelfThing = "music" | "playtime" | "language";

/** In this order: the speaker and the hourglass on the left, the globe with the stickers above it on the right. */
export const SHELF_THINGS: ShelfThing[] = ["music", "playtime", "language"];

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

/** A compartment's opening: picture books standing in it, or one of the grown-ups' things. */
export interface ShelfCell extends ShelfRect {
  /** The picture books in it, by their place in the list of books. */
  books?: number[];
  thing?: ShelfThing;
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
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** The planks' sizes for a shelf in a room of this size. */
function frameFor(width: number, height: number): ShelfFrame {
  const post = clamp(width * 0.018, 10, 22);
  return { post, wall: post * 0.8, crown: clamp(height * 0.03, 12, 20), board: clamp(height * 0.02, 8, 13), plinth: clamp(height * 0.032, 12, 22) };
}

/** The biggest book that stands `n` in a row `width` wide, with `BOOK_GAP` round each, and can be taken out of a `tier` high compartment. */
function bookFor(width: number, tier: number, n: number) {
  return Math.min(MAX_BOOK, tier * TAKE_OUT, width / (n * BOOK_ASPECT + (n + 1) * BOOK_GAP));
}

/** How wide a row of `n` books `bh` high is best: room between them and for a few books spine out at its ends. */
const rowWidth = (n: number, bh: number) => bh * (n * BOOK_ASPECT + (n - 1) * 0.6 + 1.4);

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

/** Of two ways, the one with more boards unless the other's books are much bigger: two books up top, not an empty board. */
function prefer<T extends { bh: number }>(more: T, fewer: T) {
  return more.bh * 1.25 >= fewer.bh ? more : fewer;
}

/**
 * The plan for a room of `width` × `height` and `count` picture books. A screen wider than tall gets a narrow column on
 * each side for the grown-ups' things – two compartments on the left, one tall one on the right for the globe with the
 * stickers above it – and the books in the middle, two boards of them where that keeps them nearly as big (every board
 * holds books, none only fills the shelf). An upright screen gets the things in compartments on top and the books below.
 */
export function planShelf(width: number, height: number, count: number): ShelfLayout {
  return width / height < 0.95 ? planUpright(width, height, count) : planWide(width, height, count);
}

function planWide(width: number, height: number, count: number): ShelfLayout {
  const frame = frameFor(width, height);
  const { post, wall, crown, board } = frame;
  const inner = height - crown - frame.plinth;
  const side = clamp(width * 0.12, 62, 150);
  const room = width - 2 * post - 2 * wall - 2 * side;
  const option = (rows: number) => {
    const n = Math.ceil(count / rows);
    const tier = (inner - (rows - 1) * board) / rows;
    return { rows, n, tier, bh: bookFor(room, tier, n) };
  };
  const plan = count > 1 ? prefer(option(2), option(1)) : option(1);
  const middle = Math.min(room, rowWidth(plan.n, plan.bh));
  const sideTier = (inner - board) / 2;
  const left = post;
  const mid = left + side + wall;
  const right = mid + middle + wall;
  const cells: ShelfCell[] = [];
  const planks: ShelfRect[] = [
    { x: left + side, y: crown, w: wall, h: inner },
    { x: mid + middle, y: crown, w: wall, h: inner },
  ];
  cells.push(
    { x: left, y: crown, w: side, h: sideTier, thing: "music" },
    { x: left, y: crown + sideTier + board, w: side, h: sideTier, thing: "playtime" },
    { x: right, y: crown, w: side, h: inner, thing: "language" },
  );
  planks.push({ x: left, y: crown + sideTier, w: side, h: board });
  split(count, plan.rows).forEach((books, r) => {
    const y = crown + r * (plan.tier + board);
    cells.push({ x: mid, y, w: middle, h: plan.tier, books });
    if (r > 0) planks.push({ x: mid, y: y - board, w: middle, h: board });
  });
  return { width: right + side + post, height, frame, cells, planks, bookHeight: plan.bh };
}

function planUpright(width: number, height: number, count: number): ShelfLayout {
  const frame = frameFor(width, height);
  const { post, wall, crown, board } = frame;
  const inner = height - crown - frame.plinth;
  const room = width - 2 * post;
  const things = clamp(inner * 0.16, 64, 150);
  const rest = inner - things - board;
  const option = (rows: number) => {
    const n = Math.ceil(count / rows);
    const tier = (rest - (rows - 1) * board) / rows;
    return { rows, n, tier, bh: bookFor(room, tier, n) };
  };
  const plan = count > 2 ? prefer(option(count), option(2)) : option(1);
  // The books' boards only as high as they need; what is left goes to the things on top.
  const tier = Math.min(plan.tier, plan.bh / 0.75);
  const top = inner - plan.rows * (tier + board);
  const middle = Math.min(room, Math.max(rowWidth(plan.n, plan.bh), 3 * 64 + 2 * wall));
  const cells: ShelfCell[] = [];
  const planks: ShelfRect[] = [];
  const cw = (middle - 2 * wall) / 3;
  if (top > cw * 1.6) {
    // Tall and narrow: the speaker over the hourglass on the left, the globe in a tall compartment on the right.
    const half = (middle - wall) / 2;
    const ch = (top - board) / 2;
    cells.push(
      { x: post, y: crown, w: half, h: ch, thing: "music" },
      { x: post, y: crown + ch + board, w: half, h: ch, thing: "playtime" },
      { x: post + half + wall, y: crown, w: half, h: top, thing: "language" },
    );
    planks.push({ x: post + half, y: crown, w: wall, h: top }, { x: post, y: crown + ch, w: half, h: board });
  } else {
    SHELF_THINGS.forEach((thing, i) => {
      cells.push({ x: post + i * (cw + wall), y: crown, w: cw, h: top, thing });
      if (i > 0) planks.push({ x: post + i * (cw + wall) - wall, y: crown, w: wall, h: top });
    });
  }
  split(count, plan.rows).forEach((books, r) => {
    const y = crown + top + r * (tier + board) + board;
    cells.push({ x: post, y, w: middle, h: tier, books });
    planks.push({ x: post, y: y - board, w: middle, h: board });
  });
  return { width: middle + 2 * post, height, frame, cells, planks, bookHeight: plan.bh };
}
