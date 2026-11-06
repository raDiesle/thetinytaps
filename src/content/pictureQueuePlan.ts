// Which waiting pictures are cheap to make now, and which are better kept for later (/bild-erzeugen).
// A request to Gemini costs the same whether it brings one picture or a sheet of two or four (`--grid`), which
// `bun run image` cuts apart. So small pictures that look alike (same style, aspect, size, cut-out and references)
// share a sheet: a full sheet is as cheap as it gets and is made at once, a sheet still short of pictures waits for
// partners. A picture too big for any sheet gains nothing by waiting and is made at once. Used by the management
// page and by `bun run image queue`, so this file imports nothing from the app.

import type { QueuedPicture } from "./pictureQueue";

/** The book's style block, put before every picture's prompt (see the skill /bild-erzeugen). */
export const BOOK_STYLE =
  "Children's picture-book illustration for 2–4 year olds, like a page of a printed picture book. Soft, flat, rounded shapes with thick dark plum ink outlines (#3d3045), warm friendly colours softened like gouache printed on matte paper – still clear and easy to tell apart, never dull or grey – gentle shading. Simple, uncluttered background. Every fox and bear wears clothes. No text, no letters, no numbers, no speech bubbles, no frames, no book, page or paper edge drawn around the picture.";

/** The style block for cut-outs: no background and no paper texture, which would spoil the cut. */
export const CUTOUT_STYLE =
  "Children's picture-book illustration for 2–4 year olds, like a page of a printed picture book. Soft, flat, rounded shapes with thick dark plum ink outlines (#3d3045), warm friendly colours softened like gouache – still clear and easy to tell apart, never dull or grey – gentle shading. Every fox and bear wears clothes. No text, no letters, no numbers, no speech bubbles, no frames, no book, page or paper edge drawn around the picture.";

/** US dollars per request with the default model (gemini-3.1-flash-lite-image, October 2026): batch, and at once with `--now`. */
export const REQUEST_PRICE = { batch: 0.017, now: 0.034 };

/** The pixels of a 1K picture per aspect Gemini can make (the default model's only size). */
export const PICTURE_1K: Record<string, [number, number]> = {
  "1:1": [1024, 1024],
  "2:3": [832, 1248],
  "3:2": [1248, 832],
  "3:4": [864, 1184],
  "4:3": [1184, 864],
  "4:5": [896, 1152],
  "5:4": [1152, 896],
  "9:16": [768, 1344],
  "16:9": [1344, 768],
  "21:9": [1536, 672],
};

/** A sheet of several pictures in one request: columns x rows. */
export type Grid = "2x2" | "1x2" | "2x1";
const GRIDS: Grid[] = ["2x2", "1x2", "2x1"];

/** What the magenta gaps between the panels take off a panel's side. */
const GAP_SHARE = 0.96;
/** A panel a little smaller than the size asked for is still fine (the picture comes out that much smaller, never blurred). */
const SMALLER_OK = 0.9;

const gridSize = (grid: Grid) => grid.split("x").map(Number) as [number, number];
/** How many pictures a sheet holds. */
export const panelsOf = (grid: Grid) => gridSize(grid)[0] * gridSize(grid)[1];

/** The whole sheet's aspect for panels of this aspect, if Gemini can make it. */
export function gridAspect(aspect: string, cols: number, rows: number): string | undefined {
  const [w, h] = aspect.split(":").map(Number);
  return Object.keys(PICTURE_1K).find((a) => {
    const [aw, ah] = a.split(":").map(Number);
    return aw * h * rows === ah * w * cols;
  });
}

/** Roughly the longest side of one panel of this sheet, in pixels; undefined when Gemini can't make the sheet. */
export function panelSide(aspect: string, grid: Grid): number | undefined {
  const [cols, rows] = gridSize(grid);
  const whole = gridAspect(aspect, cols, rows);
  if (!whole) return undefined;
  const [w, h] = PICTURE_1K[whole];
  return Math.floor(Math.max(w / cols, h / rows) * GAP_SHARE);
}

/** The longest side a picture needs, or undefined for the whole picture. */
const neededSide = (size?: string) => (size ? Math.max(...size.split("x").map(Number)) : undefined);

/** The sheets a picture fits in, the most pictures per request first. */
function gridsFor(picture: QueuedPicture): Grid[] {
  const side = neededSide(picture.size);
  if (picture.alone || !side) return [];
  return GRIDS.map((grid) => ({ grid, panel: panelSide(picture.aspect ?? "1:1", grid) ?? 0 }))
    .filter(({ panel }) => panel >= side * SMALLER_OK)
    .sort((a, b) => panelsOf(b.grid) - panelsOf(a.grid) || b.panel - a.panel)
    .map(({ grid }) => grid);
}

/** The shared start of a picture's prompt. */
export const styleOf = (picture: QueuedPicture) => picture.style ?? (picture.transparent ? CUTOUT_STYLE : BOOK_STYLE);

/** Pictures with the same key can share a sheet: one request has one style, aspect, size, cut-out and set of references. */
function sheetKey(picture: QueuedPicture) {
  const { aspect = "1:1", size, transparent = false, key = "ff00ff", quality = 80, ref = [] } = picture;
  return JSON.stringify([styleOf(picture), aspect, size, transparent, key, quality, [...ref].sort()]);
}

/** One request to make now: a single picture, or a sheet of several. */
export interface Sheet {
  /** The sheet, or undefined for one picture alone. */
  grid?: Grid;
  pictures: QueuedPicture[];
  /** Panels left over, filled with another version of a picture to choose from (`.image-raw/variants/`). */
  variants: number;
  /** Made now although it isn't full, because the grown-up said so. */
  forced?: boolean;
}

/** Pictures that wait for partners to fill their sheet. */
export interface WaitingSheet {
  grid: Grid;
  pictures: QueuedPicture[];
  /** How many more pictures of the same kind would fill it. */
  missing: number;
}

/** What to make now and what waits. */
export interface QueuePlan {
  /** As cheap as it gets now: full sheets, pictures that never share one, and what was forced. */
  now: Sheet[];
  /** Sheets not yet full; making them now would cost one request more each than waiting. */
  waiting: WaitingSheet[];
  /** Pictures whose reference is still in the queue itself, so they come after it. */
  blocked: { picture: QueuedPicture; ref: string }[];
}

/**
 * Splits the queue into what is cheap to make now and what waits for more pictures of its kind. `force` names
 * pictures (or "all") the grown-up wants now anyway: their whole sheet comes now, with spare panels as variants.
 */
export function planQueue(queue: QueuedPicture[], force: string[] | "all" = []): QueuePlan {
  const queued = new Set(queue.map((p) => p.file));
  const plan: QueuePlan = { now: [], waiting: [], blocked: [] };
  const groups = new Map<string, QueuedPicture[]>();
  for (const picture of queue) {
    const ref = picture.ref?.find((r) => queued.has(r) && r !== picture.file);
    if (ref) plan.blocked.push({ picture, ref });
    else if (!gridsFor(picture).length) plan.now.push({ pictures: [picture], variants: 0 });
    else groups.set(sheetKey(picture), [...(groups.get(sheetKey(picture)) ?? []), picture]);
  }
  for (const pictures of groups.values()) {
    const fits = gridsFor(pictures[0]);
    const grid = fits[0];
    const full = panelsOf(grid);
    let i = 0;
    for (; i + full <= pictures.length; i += full) plan.now.push({ grid, pictures: pictures.slice(i, i + full), variants: 0 });
    const rest = pictures.slice(i);
    if (!rest.length) continue;
    if (force === "all" || rest.some((p) => force.includes(p.id))) {
      // The same price whatever the sheet: the smallest that holds them has the biggest panels.
      const smallest = fits.filter((g) => panelsOf(g) >= rest.length).sort((a, b) => panelsOf(a) - panelsOf(b))[0];
      const sheet = rest.length === 1 ? undefined : smallest;
      plan.now.push({ grid: sheet, pictures: rest, variants: sheet ? panelsOf(sheet) - rest.length : 0, forced: true });
    } else plan.waiting.push({ grid, pictures: rest, missing: full - rest.length });
  }
  return plan;
}

/** One job for `bun run image --jobs` (the script's field names). */
export interface ImageJob {
  out: string[];
  prompt: string;
  panels?: string[];
  grid?: Grid;
  aspect?: string;
  size?: string;
  quality?: number;
  transparent?: boolean;
  key?: string;
  ref?: string[];
}

/** Where a spare panel's other version of a picture goes: kept out of the game, to choose from. */
export function variantFile(picture: QueuedPicture, n: number) {
  const name = picture.file.split("/").pop() as string;
  const dot = name.lastIndexOf(".");
  return `.image-raw/variants/${name.slice(0, dot)}-${n + 2}${name.slice(dot)}`;
}

/** The job that makes a sheet. */
export function jobOf(sheet: Sheet): ImageJob {
  const [first] = sheet.pictures;
  const { aspect, size, quality, transparent, key, ref } = first;
  const shared = Object.fromEntries(Object.entries({ aspect, size, quality, transparent, key, ref }).filter(([, v]) => v !== undefined));
  if (!sheet.grid) return { ...shared, out: [first.file], prompt: `${styleOf(first)} ${first.prompt}` };
  const spare = Array.from({ length: sheet.variants }, (_, i) => sheet.pictures[i % sheet.pictures.length]);
  return {
    ...shared,
    grid: sheet.grid,
    out: [...sheet.pictures.map((p) => p.file), ...spare.map((p, i) => variantFile(p, Math.floor(i / sheet.pictures.length)))],
    prompt: `${styleOf(first)} Each panel is a picture of its own, as described below, all in this same style.`,
    panels: [...sheet.pictures.map((p) => p.prompt), ...spare.map((p) => `Another version of this picture: ${p.prompt}`)],
  };
}
