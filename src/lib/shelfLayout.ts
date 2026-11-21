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
 * How much taller the everyday helpers' books stand than a picture book, where their compartment lets them
 * (`--daily-tall` in bookshelf-books.css): their board is full in its width, so only their height can grow, and their
 * pictures and names were too small to recognise (user feedback, November 2026).
 */
export const DAILY_TALL = 1.4;

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

/**
 * The room at the right of the carved words, in book heights, that the first of the everyday helpers needs where it
 * leans left towards them (`--lean` in bookshelf-books.css): its top would reach under the sign and over the words.
 */
export const LEAN_CLEAR = 0.34;

/**
 * The room the books spine out keep from the wall with the stickers of the child's figure, in book heights, so the
 * stickers are seen (user feedback, November 2026); a book to take keeps its `BOOK_GAP` from it.
 */
export const STICKERS_ROOM = 0.45;

/**
 * How far the sign at the top board's far left may reach over the shelf's left post, in posts: hanging on its chains in
 * front of the shelf, it may, and every px it takes from the board comes off the books (user feedback, November 2026:
 * the words' place under it was too big and the books too small).
 */
export const SIGN_OVER_POST = 0.5;

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
   * The height of a picture book on this board, in px: each board's books as big as its own width and height allow, so
   * the few picture books below are not as small as the full board of the everyday helpers above them makes its books
   * (user feedback, November 2026). Set on every compartment with books.
   */
  bh?: number;
  /**
   * The grown-ups' things in it: one standing on its board, and the stickers (`figure`) on its right wall – in a
   * compartment of their own, or in the one of the everyday helpers on a wide shelf.
   */
  things?: ShelfThing[];
  /**
   * Room at its left kept for the sign hanging in front of it, in px, beyond the carved words' own width, so that it
   * covers no book to take (`SIGN_DIP`): the sign and the words under it come first on the board, at its far left.
   */
  lead?: number;
  /**
   * How much narrower the carved words stand at their right, in px, beyond `LEAN_CLEAR`, so that they stay centred under
   * the sign where it reaches left over the post (`SIGN_OVER_POST`).
   */
  pull?: number;
  /**
   * Where the top compartment is tall enough that the sign hangs above the everyday helpers' books, the most those books
   * stand high, in px, so their tops keep clear under it (`UNDER_SIGN`). Then the board keeps no room beside the words
   * for the sign (`lead`): it reaches over the books' tops instead, and they get that room – on a tablet the sign took
   * half the board and left the helpers' spines too thin for their pictures (user feedback, November 2026).
   */
  tall?: number;
}

/** The plan of the shelf. */
export interface ShelfLayout {
  width: number;
  height: number;
  frame: ShelfFrame;
  cells: ShelfCell[];
  /** The fronts of the planks between the compartments: the walls and the boards (the outer frame comes from `frame`). */
  planks: ShelfRect[];
  /** The smallest board's picture books' height (each board's own is its cell's `bh`; a book's width is `BOOK_ASPECT` of it). */
  bookHeight: number;
  /** Whether it is planned for an upright screen: the things on top, the sign hanging above the shelf. */
  upright: boolean;
  /** Where the sign with the app's name hangs in front of a wide shelf: its board, without the foxes on it. */
  sign?: ShelfRect;
  /** How high the legs it stands on are, below its `height`. */
  legs: number;
}

/** What the plan is asked for besides the room's size. */
export interface ShelfOptions {
  /** The screen stands upright (its own shape, not the room's, so the room's size can't flip it back and forth). */
  upright?: boolean;
  /**
   * The sign hanging in front of a wide shelf, in px: its board's width and height, and how far the foxes on its o rise
   * above it (`rise`), which must stay inside the shelf's top: the shelf starts right at the screen's top.
   */
  sign?: Sign;
  /**
   * Of the first place (the everyday helpers' books with the words carved before them), how much at its left takes no
   * tap, in picture books' widths: the carved words, which the hanging sign may cover.
   */
  carved?: number;
  /** The least height of the shelf's legs, in px. */
  legs?: number;
}

/** The sign with the app's name, in px: its board's width and height, and how far the foxes on its o rise above it. */
export interface Sign {
  width: number;
  height: number;
  rise?: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * The room kept between the sign and the tops of the everyday helpers' books under it, in book heights, where the sign
 * hangs above them (`ShelfCell.tall`): they lean and tip out under a mouse, and never touch it.
 */
export const UNDER_SIGN = 0.08;

/**
 * Where the sign hangs above the everyday helpers, the room the carved words still get beside their own width, in book
 * heights: without the sign's room beside them the first book, leaning towards them, reached into „Für Groß & Klein“.
 */
export const WORDS_BREATH = 0.15;

/**
 * How much wider the top board's books must get for the sign to hang above them rather than beside the words: under the
 * sign they stand lower, so a few px more width was not worth it (on a laptop 3 px wider pictures cost 50 px of height).
 */
export const ABOVE_GAIN = 1.15;

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
 * carved before them alone up top, the picture books together below, where a child's eye finds them side by side (user
 * decision, November 2026). Evenly split where there are no such books or the picture books would be too many for one board.
 */
function boardsOf(spans: number[], rows: number): number[][] {
  const wide = spans.flatMap((s, i) => (s > 1 ? [i] : []));
  const rest = spans.flatMap((s, i) => (s > 1 ? [] : [i]));
  if (rows !== 2 || !wide.length || !rest.length || rest.length > 4) return split(spans.length, rows);
  return [wide, rest];
}

/**
 * The places on an upright shelf's boards: the everyday helpers' books (wider than a picture book) alone on theirs, the
 * picture books two side by side on each board below – never one picture book on each board, which left the shelf a tall
 * column of single books (user feedback, November 2026).
 */
function uprightBoards(spans: number[]): number[][] {
  const wide = spans.flatMap((s, i) => (s > 1 ? [[i]] : []));
  const rest = spans.flatMap((s, i) => (s > 1 ? [] : [i]));
  const pairs = Array.from({ length: Math.ceil(rest.length / 2) }, (_, r) => rest.slice(2 * r, 2 * r + 2));
  return [...wide, ...pairs];
}

/** Of two ways, the one with more boards unless the other's books are much bigger: two books up top, not an empty board. */
function prefer<T extends { bh: number }>(more: T, fewer: T) {
  return more.bh * 1.25 >= fewer.bh ? more : fewer;
}

/**
 * The plan for a room of `width` × `height` and the places of the books, each `spans[i]` picture books wide (1 for a
 * picture book; the everyday helpers' books with the words carved before them take more). A screen wider than tall gets
 * a narrow column at the right for the grown-ups' things (`SIDE_COLUMN`) and the books left of it, two boards of them
 * where that keeps them nearly as big (every board holds books, none only fills the shelf). An upright screen gets the
 * things in compartments on top and the books below (`uprightBoards`). Both stand on legs, with „Offline spielen“
 * hanging under the shelf at its right, at the screen's bottom right (RoomOffline).
 */
export function planShelf(width: number, height: number, spans: number[], options: ShelfOptions = {}): ShelfLayout {
  const upright = options.upright ?? width / height < 0.95;
  const legs = options.legs ?? 0;
  if (upright) return planUpright(width, height - legs, spans, legs);
  return planWide(width, height - legs, spans, legs, options.sign ?? { width: 0, height: 0 }, options.carved ?? 0);
}

/**
 * The places on `rows` boards and the biggest book each board leaves room for (`bhs`), and the smallest of them (`bh`).
 * A wide shelf's boards hold the books by kind (`boardsOf`), and its first keeps `lead` free at its left.
 */
function rowsOf(spans: number[], rows: number, width: number, tier: number, wide = false, lead = 0, given?: number[][]) {
  const boards = given ?? (wide ? boardsOf(spans, rows) : split(spans.length, rows));
  const leadOf = (r: number) => (r === 0 ? lead : 0);
  const bhs = boards.map((books, r) => bookFor(width - leadOf(r), tier, spanOf(spans, books), books.length));
  const middle = Math.max(...boards.map((books, r) => leadOf(r) + rowWidth(spanOf(spans, books), books.length, bhs[r])));
  return { boards, bhs, bh: Math.min(...bhs), leadOf, middle };
}

/**
 * How far the sign may reach left of the carved words' place, in px, books `bh` high: over the row's 2 px padding, the
 * `BOOK_GAP` from the post (`.shelf-row`) and part of the post (`SIGN_OVER_POST`).
 */
const overhang = (bh: number, post: number) => 2 + BOOK_GAP * bh + post * SIGN_OVER_POST;

/**
 * The room the top board keeps at its left for the hanging sign, books `bh` high: what the sign is wider than the carved
 * words under it (`words` picture books wide, where they begin the board, less `LEAN_CLEAR` at their right, which keeps
 * it clear of the first book to take) and than what it may reach left of them over the post (`overhang`).
 */
function leadFor(sign: { width: number }, bh: number, words: number, post: number) {
  if (!sign.width || !words) return 0;
  return Math.max(0, sign.width - overhang(bh, post) - (words * BOOK_ASPECT - LEAN_CLEAR) * bh);
}

/**
 * Where the sign hangs in front of the top compartment `top` of a wide shelf: at the board's far left, where a visitor
 * looks first (user request, November 2026), reaching over the post where it is wider than the carved words, which
 * stand centred under it, and the books to take follow at their right. The words' place (`.shelf-carving`) is their own
 * width and the `lead` beside it, after the row's 2 px padding and a `BOOK_GAP` from the post (`.shelf-row`); at its
 * right it keeps `LEAN_CLEAR` and the words' `pull`, so they stand centred under the sign.
 */
function signOver(top: ShelfCell, bh: number, sign: Sign, carved: number, post: number): ShelfRect {
  const y = signY(top, sign);
  const start = top.x + 2 + BOOK_GAP * bh;
  const place = (carved * BOOK_ASPECT - LEAN_CLEAR) * bh + (top.lead ?? 0);
  // Above the helpers' books it is centred over the words where it can be, else it reaches half over the post and on
  // over the books' tops; the words keep their whole place.
  if (top.tall !== undefined) return { x: Math.max(start + place / 2 - sign.width / 2, start - overhang(bh, post)), y, w: sign.width, h: sign.height };
  const pull = clamp(sign.width - place, 0, overhang(bh, post));
  if (pull > 0) top.pull = pull;
  return { x: start + (place - pull) / 2 - sign.width / 2, y, w: sign.width, h: sign.height };
}

/** How high the sign hangs over the compartment `top`: by `SIGN_DIP` into it, a little deeper on a low screen, so the foxes on it stay on the screen (the shelf starts at its top). */
const signY = (top: ShelfRect, sign: Sign) => Math.max(top.y + top.h * SIGN_DIP - sign.height, sign.rise ?? 0);

function planWide(width: number, height: number, spans: number[], legs: number, sign: Sign, carved: number): ShelfLayout {
  const count = spans.length;
  const frame = frameFor(width, height);
  const { post, wall, crown, board } = frame;
  const inner = height - crown - frame.plinth;
  const side = clamp(width * 0.12, 62, 150);
  const room = width - 2 * post - wall - side;
  const option = (rows: number) => {
    const tier = (inner - (rows - 1) * board) / rows;
    // The carved words begin the top board where the everyday helpers' place stands first on it.
    const words = boardsOf(spans, rows)[0][0] === 0 ? carved : 0;
    // The bigger the books, the less room the sign needs beside the carved words, and the more room it takes, the smaller
    // the books: a few steps settle it.
    let plan = rowsOf(spans, rows, room, tier, true);
    for (let step = 0; step < 20; step++) plan = rowsOf(spans, rows, room, tier, true, leadFor(sign, plan.bhs[0], words, post));
    const beside = { rows, tier, ...plan, tall: undefined as number | undefined };
    if (!words || !sign.width) return beside;
    // Or the sign hangs above the helpers' books, which then have the board but for a breath beside the words
    // (`WORDS_BREATH`) and stand under it at least as high as a picture book: where that makes them clearly bigger.
    let free = rowsOf(spans, rows, room, tier, true);
    for (let step = 0; step < 10; step++) free = rowsOf(spans, rows, room, tier, true, WORDS_BREATH * free.bhs[0]);
    const below = tier - (signY({ x: 0, y: crown, w: 0, h: tier }, sign) + sign.height - crown);
    const top = Math.min(free.bhs[0], below / (1 + UNDER_SIGN));
    if (top < plan.bhs[0] * ABOVE_GAIN) return beside;
    const bhs = [top, ...free.bhs.slice(1)];
    const middle = Math.max(...free.boards.map((books, r) => rowWidth(spanOf(spans, books), books.length, bhs[r])));
    return { rows, tier, ...free, bhs, bh: Math.min(...bhs), middle, tall: below - UNDER_SIGN * top };
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
    // The stickers on the top compartment's right wall.
    const things: ShelfThing[] | undefined = r === 0 ? ["figure"] : undefined;
    const tall = r === 0 ? plan.tall : undefined;
    cells.push({
      x: mid,
      y,
      w: middle,
      h: plan.tier,
      books,
      bh: plan.bhs[r],
      ...(things && { things }),
      ...(lead > 0 && { lead }),
      ...(tall !== undefined && { tall }),
    });
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
    ...(sign.width > 0 && top.books?.[0] === 0 && { sign: signOver(top, plan.bhs[0], sign, carved, post) }),
  };
}

function planUpright(width: number, height: number, spans: number[], legs: number): ShelfLayout {
  const frame = frameFor(width, height);
  const { post, wall, crown, board } = frame;
  const inner = height - crown - frame.plinth;
  const room = width - 2 * post;
  const things = clamp(inner * 0.16, 64, 150);
  const rest = inner - things - board;
  const boards = uprightBoards(spans);
  const rows = boards.length;
  const avail = rest - (rows - 1) * board;
  const plan = rowsOf(spans, rows, room, Infinity, false, 0, boards);
  // Each board only as high as its books need – the everyday helpers' taller (`DAILY_TALL`) –, as big as its width
  // allows; where the boards would not fit so, the biggest books shrink first, and what is left goes to the things on top.
  const tall = boards.map((books) => (spanOf(spans, books) > 1 ? DAILY_TALL : 1));
  const need = (cap: number) => plan.bhs.reduce((sum, bh, r) => sum + (Math.min(bh, cap) * tall[r]) / TAKE_OUT, 0);
  let cap = Math.max(...plan.bhs);
  if (need(cap) > avail) {
    let [lo, hi] = [0, cap];
    for (let step = 0; step < 40; step++) [lo, hi] = need((lo + hi) / 2) > avail ? [lo, (lo + hi) / 2] : [(lo + hi) / 2, hi];
    cap = lo;
  }
  const bhs = plan.bhs.map((bh) => Math.min(bh, cap));
  // Room to spare goes to the boards too, up to a quarter of a book above each, so the books are not pressed under the next board.
  const spare = Math.min(TAKE_OUT / 0.75, avail / need(cap));
  const tiers = bhs.map((bh, r) => ((bh * tall[r]) / TAKE_OUT) * spare);
  const top = inner - tiers.reduce((sum, t) => sum + t + board, 0);
  const n = SHELF_THINGS.length;
  const booksWidth = Math.max(...boards.map((books, r) => rowWidth(spanOf(spans, books), books.length, bhs[r])));
  const middle = Math.min(room, Math.max(booksWidth, n * 64 + (n - 1) * wall));
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
  let y = crown + top;
  plan.boards.forEach((books, r) => {
    y += board;
    cells.push({ x: post, y, w: middle, h: tiers[r], books, bh: bhs[r] });
    planks.push({ x: post, y: y - board, w: middle, h: board });
    y += tiers[r];
  });
  return { width: middle + 2 * post, height, frame, cells, planks, bookHeight: Math.min(...bhs), upright: true, legs };
}
