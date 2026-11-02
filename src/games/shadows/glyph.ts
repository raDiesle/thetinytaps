// An emoji as a picture cut to its own outline. Each system draws emojis
// differently and leaves different space around them, so to let exactly a
// part of an animal peek out, it is drawn once on a canvas and cropped there.

export interface Glyph {
  /** PNG data URL; empty if the canvas could not be used. */
  url: string;
  /** Width / height of the drawn shape. */
  aspect: number;
  /** How much of each cell of a `GRID` × `GRID` grid over the shape is drawn (0–1), row by row: where a peephole shows something. */
  cover: number[];
}

/** The cells per side of `Glyph.cover`. */
export const GRID = 5;

const FONT_PX = 320;
const cache = new Map<string, Glyph>();

export function emojiGlyph(emoji: string): Glyph {
  const known = cache.get(emoji);
  if (known) return known;

  const glyph = draw(emoji) ?? { url: "", aspect: 1, cover: [] };
  cache.set(emoji, glyph);
  return glyph;
}

function draw(emoji: string): Glyph | null {
  const side = Math.round(FONT_PX * 1.5);
  const canvas = document.createElement("canvas");
  canvas.width = side;
  canvas.height = side;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-emoji").trim() || "sans-serif";
  ctx.font = `${FONT_PX}px ${family}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji, side / 2, side / 2);

  const { data } = ctx.getImageData(0, 0, side, side);
  let left = side;
  let right = -1;
  let top = side;
  let bottom = -1;
  for (let y = 0; y < side; y++) {
    for (let x = 0; x < side; x++) {
      if (data[(y * side + x) * 4 + 3] < 10) continue;
      if (x < left) left = x;
      if (x > right) right = x;
      if (y < top) top = y;
      if (y > bottom) bottom = y;
    }
  }
  if (right < left) return null;

  const width = right - left + 1;
  const height = bottom - top + 1;
  const crop = document.createElement("canvas");
  crop.width = width;
  crop.height = height;
  crop.getContext("2d")?.drawImage(canvas, left, top, width, height, 0, 0, width, height);
  const cover = Array.from({ length: GRID * GRID }, (_, cell) => {
    const x0 = left + Math.floor(((cell % GRID) * width) / GRID);
    const x1 = left + Math.floor((((cell % GRID) + 1) * width) / GRID);
    const y0 = top + Math.floor((Math.floor(cell / GRID) * height) / GRID);
    const y1 = top + Math.floor(((Math.floor(cell / GRID) + 1) * height) / GRID);
    let drawn = 0;
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) if (data[(y * side + x) * 4 + 3] >= 10) drawn++;
    return drawn / Math.max(1, (x1 - x0) * (y1 - y0));
  });
  return { url: crop.toDataURL("image/png"), aspect: width / height, cover };
}

/** A peephole's middle, as a share of the shape's width and height. */
export interface Peephole {
  x: number;
  y: number;
}

/**
 * Where `count` peepholes go over a shape `width` × `height` (in any unit) so each shows a good piece of it: on cells
 * that are mostly drawn, at least `apart` from each other. Fewer when the shape has no room for more.
 */
export function pickPeepholes(cover: number[], width: number, height: number, count: number, apart: number, random = Math.random): Peephole[] {
  const cells = cover.map((c, i) => ({ c, x: ((i % GRID) + 0.5) / GRID, y: (Math.floor(i / GRID) + 0.5) / GRID, r: random() }));
  const holes: Peephole[] = [];
  // Best cells first; a thin shape (a giraffe) may need the half-drawn ones too.
  for (const least of [0.75, 0.5, 0.25]) {
    for (const cell of cells.filter((p) => p.c >= least).sort((a, b) => a.r - b.r)) {
      if (holes.length === count) return holes;
      if (holes.every((h) => Math.hypot((h.x - cell.x) * width, (h.y - cell.y) * height) >= apart)) holes.push({ x: cell.x, y: cell.y });
    }
  }
  return holes;
}
