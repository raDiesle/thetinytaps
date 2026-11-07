/**
 * How the bookshelf of the home page (Bookshelf.tsx) is laid out in the room it gets: its compartments, the
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
 * stuck on the inner side of a compartment's right wall, the others stand on a board.
 */
export type ShelfThing = "music" | "playtime" | "figure" | "language";

/** In this order where they stand in a row (on top of an upright screen's shelf), the stickers at the right side. */
export const SHELF_THINGS: ShelfThing[] = ["music", "playtime", "language", "figure"];

/**
 * On a screen wider than tall the things on a board stand in one column at the shelf's right side, one compartment over
 * the other (user decision, November 2026): the hourglass on top in the tallest, the most needed; the speaker in the
 * middle; the globe at the bottom. The stickers are stuck on the right wall of the big compartment on top, beside the
 * everyday helpers, where they are seen better than in a narrow one (user feedback, November 2026).
 */
const SIDE_COLUMN: { things: ShelfThing[]; share: number }[] = [
  { things: ["playtime"], share: 0.38 },
  { things: ["music"], share: 0.31 },
  { things: ["language"], share: 0.31 },
];

/**
 * The sign with the app's name, on a screen wider than tall: it hangs on its chains in front of the shelf, down into its
 * top compartment by this share of the compartment's height (user feedback, November 2026), over the words carved
 * there, which move down below it – never over a book to take, nor the wall with the stickers.
 */
export const SIGN_DIP = 0.3;

/** The room the hanging sign keeps from the everyday helpers' books at its left and from the wall at its right, in book heights. */
export const SIGN_CLEAR = { books: 0.1, wall: 0.22 };

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
  /**
   * The grown-ups' things in it: one standing on its board, and the stickers (`figure`) on its right wall – in a
   * compartment of their own, or in the one of the everyday helpers on a wide shelf.
   */
  things?: ShelfThing[];
  /** Room at its right kept for the sign hanging in front of it, in px, so that it covers no book to take (`SIGN_DIP`). */
  trail?: number;
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
  /** Where the sign with the app's name hangs in front of a wide shelf: its board, without the foxes on it. */
  sign?: ShelfRect;
  /**
   * How far right of their place the carved words move, in px, so that they stand centred under the sign (user feedback,
   * November 2026): the sign keeps clear of the books at their left, so it may hang right of their place's middle.
   */
  wordsShift?: number;
  /** How high the legs it stands on are, below its `height` (a wide shelf's; 0 for an upright one). */
  legs: number;
}

/** What the plan is asked for besides the room's size. */
export interface ShelfOptions {
  /** The screen stands upright (its own shape, not the room's, so the room's size can't flip it back and forth). */
  upright?: boolean;
  /** The sign hanging in front of a wide shelf, in px: its board's width and height. */
  sign?: { width: number; height: number };
  /**
   * Of the first place (the everyday helpers' books with the words carved beside them), how much at its right takes no
   * tap, in picture books' widths: the carved words, which the hanging sign may cover.
   */
  carved?: number;
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
  const legs = options.legs ?? 0;
  return planWide(width, height - legs, spans, legs, options.sign ?? { width: 0, height: 0 }, options.carved ?? 0);
}

/**
 * The places on `rows` boards and the biggest book they leave room for: the widest board decides. A wide shelf's
 * boards hold the books by kind (`boardsOf`), and its first keeps `trail` free at its right.
 */
function rowsOf(spans: number[], rows: number, width: number, tier: number, wide = false, trail = 0) {
  const boards = wide ? boardsOf(spans, rows) : split(spans.length, rows);
  const trailOf = (r: number) => (r === 0 ? trail : 0);
  const bh = Math.min(...boards.map((books, r) => bookFor(width - trailOf(r), tier, spanOf(spans, books), books.length)));
  return { boards, bh, trailOf, middle: Math.max(...boards.map((books, r) => trailOf(r) + rowWidth(spanOf(spans, books), books.length, bh))) };
}

/**
 * The room the top board keeps at its right for the hanging sign, books `bh` high: what the sign needs beside the last
 * book to take, less what the carved words (`words` picture books wide, where they end the board) and the gap give.
 */
function trailFor(sign: { width: number }, bh: number, words: number) {
  if (!sign.width) return 0;
  return Math.max(0, sign.width + (SIGN_CLEAR.books + SIGN_CLEAR.wall) * bh - words * BOOK_ASPECT * bh - BOOK_GAP * bh);
}

/**
 * Where the sign hangs in front of the top compartment `top` of a wide shelf: over the carved words' middle where it can,
 * else as near to it as the books to take at its left and the wall with the stickers at its right let it – and how far
 * the words then move right to stand centred under it. The board's books and words move right as far as the wall with
 * the stickers lets the sign, so the sign and the words under it hang far right and the books at their left come
 * towards the shelf's middle (user feedback, November 2026): `top.trail` shrinks by twice what they move right.
 */
function signOver(top: ShelfCell, spans: number[], bh: number, sign: { width: number; height: number }, carved: number) {
  // Where the last book to take ends: the books stand together in the middle of what the trail leaves (`.shelf-row` in
  // bookshelf.css: 2 px padding, `BOOK_GAP` between each and the ends), the carved words the end of the helpers' place.
  const books = top.books ?? [];
  const span = spanOf(spans, books);
  const words = books.at(-1) === 0 ? carved * BOOK_ASPECT * bh : 0;
  const freeOf = () => top.w - 4 - span * BOOK_ASPECT * bh - (books.length + 1) * BOOK_GAP * bh - (top.trail ?? 0);
  const endOf = () => top.x + 2 + freeOf() / 2 + books.length * BOOK_GAP * bh + span * BOOK_ASPECT * bh;
  if (words > 0) {
    const trail = top.trail ?? 0;
    const target = top.x + top.w - SIGN_CLEAR.wall * bh - sign.width / 2;
    // Moving right, they take room from the trail, and the sign at their right must still keep clear of the wall.
    const slack = top.x + top.w - SIGN_CLEAR.wall * bh - sign.width - (endOf() - words + SIGN_CLEAR.books * bh);
    // The sign's middle: over the words' where it can, else kept clear of the books (as below).
    const at = Math.max(endOf() - words / 2 + 0.05 * bh, endOf() - words + SIGN_CLEAR.books * bh + sign.width / 2);
    const move = clamp(at - target, -Math.min(trail / 2, Math.max(0, slack)), Math.max(0, freeOf() / 2));
    if (trail + 2 * move > 0) top.trail = trail + 2 * move;
    else delete top.trail;
  }
  const end = endOf();
  const lo = end - words + SIGN_CLEAR.books * bh;
  const hi = top.x + top.w - SIGN_CLEAR.wall * bh - sign.width;
  const x = Math.max(lo, Math.min(hi, end - words / 2 - sign.width / 2));
  const rect: ShelfRect = { x, y: top.y + top.h * SIGN_DIP - sign.height, w: sign.width, h: sign.height };
  // The words' middle lies a little right of their place's, past the padding at their left (`.shelf-carving`).
  const middle = end - words / 2 + 0.05 * bh;
  return { sign: rect, wordsShift: words > 0 ? Math.max(0, x + sign.width / 2 - middle) : 0 };
}

function planWide(width: number, height: number, spans: number[], legs: number, sign: { width: number; height: number }, carved: number): ShelfLayout {
  const count = spans.length;
  const frame = frameFor(width, height);
  const { post, wall, crown, board } = frame;
  const inner = height - crown - frame.plinth;
  const side = clamp(width * 0.12, 62, 150);
  const room = width - 2 * post - wall - side;
  const option = (rows: number) => {
    const tier = (inner - (rows - 1) * board) / rows;
    // The carved words end the top board only where the everyday helpers' place stands last on it.
    const words = boardsOf(spans, rows)[0].at(-1) === 0 ? carved : 0;
    // The bigger the books, the less room the sign needs beside the carved words, and the more room it takes, the smaller
    // the books: a few steps settle it.
    let plan = rowsOf(spans, rows, room, tier, true);
    for (let step = 0; step < 20; step++) plan = rowsOf(spans, rows, room, tier, true, trailFor(sign, plan.bh, words));
    return { rows, tier, ...plan };
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
    const trail = plan.trailOf(r);
    // The stickers on the top compartment's right wall.
    const things: ShelfThing[] | undefined = r === 0 ? ["figure"] : undefined;
    cells.push({ x: mid, y, w: middle, h: plan.tier, books, ...(things && { things }), ...(trail > 0 && { trail }) });
    if (r > 0) planks.push({ x: mid, y: y - board, w: middle, h: board });
  });
  const top = cells[SIDE_COLUMN.length];
  return {
    width: right + side + post,
    height,
    frame,
    cells,
    planks,
    bookHeight: plan.bh,
    upright: false,
    legs,
    ...(sign.width > 0 && signOver(top, spans, plan.bh, sign, carved)),
  };
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
