/**
 * How the bookshelf of the home page (book look, Bookshelf.tsx) is laid out in the room it gets: how many shelf
 * boards, which books stand on each, and how big they are. A pure function of the room's size, so it can be checked.
 */

/** A picture book's width for its height: a little taller than wide. */
export const BOOK_ASPECT = 0.82;

/** The biggest a book gets, also on a huge screen: a real shelf's books, not posters. */
const MAX_BOOK = 340;

/** The shelf's planks, in px: the side posts, the top board, each shelf board and the plinth on the floor. */
export interface ShelfFrame {
  post: number;
  crown: number;
  board: number;
  plinth: number;
}

/** The plan of the shelf. */
export interface ShelfLayout {
  /**
   * The books on each shelf board, top to bottom, by their place in the list of books; none on a board above them that
   * only holds other books standing with their spines out, filling a shelf taller than its picture books need.
   */
  rows: number[][];
  /** Each book's height (its width is `BOOK_ASPECT` of it). */
  bookHeight: number;
  /** The free height between two boards where picture books stand. */
  tierHeight: number;
  /** The free height above each board, top to bottom: `tierHeight` for the picture books' boards, less for the others. */
  tierHeights: number[];
  /** The gap between two books, and between a book and a post. */
  gap: number;
  /** The whole shelf's width: less than the room's where a wide room would leave the books lost in it. */
  width: number;
  frame: ShelfFrame;
}

/** The planks' sizes for a shelf of this size. */
function frameFor(width: number, height: number): ShelfFrame {
  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
  return {
    post: clamp(width * 0.018, 10, 22),
    crown: clamp(height * 0.035, 12, 26),
    board: clamp(height * 0.024, 8, 16),
    plinth: clamp(height * 0.04, 12, 26),
  };
}

/** `count` books on `rows` boards, as even as can be, the fuller boards first. */
function split(first: number, count: number, rows: number): number[][] {
  const out: number[][] = [];
  let next = first;
  for (let r = 0; r < rows; r++) {
    const n = Math.ceil((count - (next - first)) / (rows - r));
    out.push(Array.from({ length: n }, (_, i) => next + i));
    next += n;
  }
  return out;
}

/**
 * The plan that makes the books biggest in a room of `width` × `height`: each group of books stands on one board of
 * its own, or on two where the room is tall and narrow (a phone held upright). Where the books leave much room above
 * them, the shelf gets more boards up there instead, with smaller books standing spine out – a shelf, not a cupboard.
 */
export function planShelf(width: number, height: number, groups: number[]): ShelfLayout {
  const frame = frameFor(width, height);
  // Every way of putting each group on one or two boards.
  let options: number[][][] = [[]];
  let first = 0;
  for (const count of groups) {
    const ways = [1, 2].filter((rows) => rows <= count).map((rows) => split(first, count, rows));
    options = options.flatMap((rows) => ways.map((way) => [...rows, ...way]));
    first += count;
  }
  let best: ShelfLayout | undefined;
  for (const rows of options) {
    const innerWidth = width - 2 * frame.post;
    const tierHeight = (height - frame.crown - frame.plinth - rows.length * frame.board) / rows.length;
    // Room above the books to take one out, and a gap of a twentieth of the width round each.
    let bookHeight = Math.min(MAX_BOOK, tierHeight * 0.84);
    for (const row of rows) bookHeight = Math.min(bookHeight, (innerWidth * 0.95) / (row.length * BOOK_ASPECT + (row.length + 1) * 0.1));
    if (best && bookHeight <= best.bookHeight) continue;
    const gap = bookHeight * 0.1;
    const widest = Math.max(...rows.map((row) => row.length));
    // Wider than its books need, with room for a few more on the sides, but never as wide as a huge screen.
    const needed = widest * bookHeight * BOOK_ASPECT + (widest + 1) * gap;
    best = { rows, bookHeight, tierHeight, gap, tierHeights: rows.map(() => tierHeight), width: Math.min(width, needed * 1.3 + 2 * frame.post), frame };
  }
  return withSpareBoards(best as ShelfLayout, height);
}

/**
 * The plan with boards above the picture books for what room they leave: their boards as high as they need, the rest
 * shared by boards of smaller books, each at least half as high as a picture book.
 */
function withSpareBoards(plan: ShelfLayout, height: number): ShelfLayout {
  const { frame, bookHeight, rows } = plan;
  const bookTier = Math.min(plan.tierHeight, bookHeight / 0.8);
  const left = height - frame.crown - frame.plinth - rows.length * (bookTier + frame.board);
  const least = bookHeight * 0.5;
  let spare = Math.round(left / (bookTier + frame.board));
  while (spare > 0 && left / spare - frame.board < least) spare--;
  if (spare === 0) return plan;
  const spareTier = left / spare - frame.board;
  return {
    ...plan,
    rows: [...Array.from({ length: spare }, () => []), ...rows],
    tierHeight: bookTier,
    tierHeights: [...Array.from({ length: spare }, () => spareTier), ...rows.map(() => bookTier)],
  };
}
