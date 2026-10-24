// An emoji as a picture cut to its own outline. Each system draws emojis
// differently and leaves different space around them, so to let exactly a
// part of an animal peek out, it is drawn once on a canvas and cropped there.

export interface Glyph {
  /** PNG data URL; empty if the canvas could not be used. */
  url: string;
  /** Width / height of the drawn shape. */
  aspect: number;
}

const FONT_PX = 320;
const cache = new Map<string, Glyph>();

export function emojiGlyph(emoji: string): Glyph {
  const known = cache.get(emoji);
  if (known) return known;

  const glyph = draw(emoji) ?? { url: "", aspect: 1 };
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
  return { url: crop.toDataURL("image/png"), aspect: width / height };
}
