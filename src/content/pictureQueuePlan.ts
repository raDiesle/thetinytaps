// Which waiting pictures are cheap to make now, and which are better kept for later (/bild-erzeugen).
// A request to Gemini costs the same whether it brings one picture or a sheet of two or four (`--grid`), which
// `bun run image` cuts apart. So pictures that look alike (same style, aspect, size, cut-out and references) share a
// sheet, and each sheet goes to the engine that makes its pictures for the least money: small ones four to a 1K sheet of
// the Lite model, big ones four to a 2K sheet of Nano Banana 2.1 (idea A-33, measured November 2026). A full sheet is
// as cheap as it gets and is made at once, a sheet still short of pictures waits for partners, and only a picture that
// can never share one (drawn from its own story's first picture, `alone`) is a request of its own. Used by
// the management page and by `bun run image queue`, so this file imports nothing from the app.

import type { QueuedPicture } from "./pictureQueue";

/** The book's style block, put before every picture's prompt (see the skill /bild-erzeugen). */
export const BOOK_STYLE =
  "Children's picture-book illustration for 2–4 year olds, like a page of a printed picture book. Soft, flat, rounded shapes with thick dark plum ink outlines (#3d3045), warm friendly colours softened like gouache printed on matte paper – still clear and easy to tell apart, never dull or grey – gentle shading. Simple, uncluttered background. Every fox and bear wears clothes. Faces are friendly and relaxed, never frowning or with angry brows unless the picture asks for that feeling. No text, no letters, no numbers, no speech bubbles, no frames, no book, page or paper edge drawn around the picture.";

/** The style block for cut-outs: no background and no paper texture, which would spoil the cut. */
export const CUTOUT_STYLE =
  "Children's picture-book illustration for 2–4 year olds, like a page of a printed picture book. Soft, flat, rounded shapes with thick dark plum ink outlines (#3d3045), warm friendly colours softened like gouache – still clear and easy to tell apart, never dull or grey – gentle shading. Every fox and bear wears clothes. Faces are friendly and relaxed, never frowning or with angry brows unless the picture asks for that feeling. No text, no letters, no numbers, no speech bubbles, no frames, no book, page or paper edge drawn around the picture.";

/** The pixels of a 1K picture per aspect Gemini can make (the Lite model's only size). */
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

/** The pixels of a 2K picture per aspect (Nano Banana 2.1 with `imageSize: "2K"`; 4:3 measured as 2400 × 1792). */
export const PICTURE_2K: Record<string, [number, number]> = {
  "1:1": [2048, 2048],
  "2:3": [1696, 2528],
  "3:2": [2528, 1696],
  "3:4": [1792, 2400],
  "4:3": [2400, 1792],
  "4:5": [1856, 2304],
  "5:4": [2304, 1856],
  "9:16": [1536, 2752],
  "16:9": [2752, 1536],
  "21:9": [3168, 1344],
};

/** A way to ask Gemini: its model, the resolution it is asked for and what a request costs. */
export interface Engine {
  /** Gemini's model id. */
  model: string;
  /** The resolution asked for; none for a model that knows only 1K. */
  imageSize?: "2K";
  /** How long the model thinks first: the least, since it only costs and the sheets came out as well without. */
  thinking?: "minimal";
  /** Its pixels per aspect. */
  pixels: Record<string, [number, number]>;
  /** US dollars per request in a batch, as measured from Gemini's own token counts (November 2026); at once it is twice that. */
  price: number;
}

/**
 * The engines the queue picks from, the cheapest request first. Nano Banana 2.1 asks the same for a 1K picture as Lite
 * but can make 2K, where four big pictures fit on one sheet: 0.029 $ a sheet, 0.0073 $ a 1200 × 900 picture against
 * 0.017 $ alone from Lite (A-33, research „gemini-bildpreise“).
 */
export const ENGINES = {
  lite: { model: "gemini-3.1-flash-lite-image", pixels: PICTURE_1K, price: 0.017 },
  sheet2k: { model: "gemini-nano-banana-2.1", imageSize: "2K", thinking: "minimal", pixels: PICTURE_2K, price: 0.029 },
} satisfies Record<string, Engine>;

/** One of `ENGINES`. */
export type EngineId = keyof typeof ENGINES;

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

/** Roughly the longest side of one panel of this sheet (or of the whole picture), in pixels; undefined when Gemini can't make it. */
export function panelSide(aspect: string, grid: Grid | undefined, engine: EngineId = "lite"): number | undefined {
  const [cols, rows] = grid ? gridSize(grid) : [1, 1];
  const whole = gridAspect(aspect, cols, rows);
  if (!whole) return undefined;
  const [w, h] = ENGINES[engine].pixels[whole];
  return Math.floor(Math.max(w / cols, h / rows) * (grid ? GAP_SHARE : 1));
}

/** The longest side a picture needs: its size, or without one a whole 1K picture (which a 2K sheet's panel has too). */
const neededSide = ({ size, aspect = "1:1" }: QueuedPicture) => (size ? Math.max(...size.split("x").map(Number)) : Math.max(...(PICTURE_1K[aspect] ?? [1024])));

/** Whether a picture of this size comes out well enough from that panel. */
const fits = (picture: QueuedPicture, grid: Grid | undefined, engine: EngineId) =>
  (panelSide(picture.aspect ?? "1:1", grid, engine) ?? 0) >= neededSide(picture) * SMALLER_OK;

/** A sheet a picture could be drawn on. */
interface Option {
  engine: EngineId;
  grid: Grid;
}

/** The sheets a picture fits in, the cheapest picture first, then the biggest panels; none for a picture drawn alone. */
function optionsFor(picture: QueuedPicture): Option[] {
  if (picture.alone) return [];
  const each = ({ engine, grid }: Option) => ENGINES[engine].price / panelsOf(grid);
  return (Object.keys(ENGINES) as EngineId[])
    .flatMap((engine) => GRIDS.map((grid) => ({ engine, grid })))
    .filter(({ engine, grid }) => fits(picture, grid, engine))
    .sort(
      (a, b) => each(a) - each(b) || (panelSide(picture.aspect ?? "1:1", b.grid, b.engine) ?? 0) - (panelSide(picture.aspect ?? "1:1", a.grid, a.engine) ?? 0),
    );
}

/** The cheapest engine whose sheet (or whole picture) is big enough, else the one with the most pixels. */
function engineFor(picture: QueuedPicture, grid: Grid | undefined): EngineId {
  const engines = Object.keys(ENGINES) as EngineId[];
  return engines.find((engine) => fits(picture, grid, engine)) ?? engines[engines.length - 1];
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
  /** Who makes it. */
  engine: EngineId;
  pictures: QueuedPicture[];
  /** Panels left over, filled with another version of a picture to choose from (`.image-raw/variants/`). */
  variants: number;
  /** Made now although it isn't full, because the grown-up said so. */
  forced?: boolean;
}

/** Pictures that wait for partners to fill their sheet. */
export interface WaitingSheet {
  grid: Grid;
  /** Who will make it. */
  engine: EngineId;
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

/** US dollars these requests cost in a batch. */
export const costOf = (sheets: { engine: EngineId }[]) => sheets.reduce((sum, s) => sum + ENGINES[s.engine].price, 0);

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
    else if (picture.panels) {
      const grid = picture.panels.length > 2 ? "2x2" : "1x2";
      plan.now.push({ grid, engine: engineFor(picture, grid), pictures: [picture], variants: 0 });
    } else if (!optionsFor(picture).length) plan.now.push({ engine: engineFor(picture, undefined), pictures: [picture], variants: 0 });
    else groups.set(sheetKey(picture), [...(groups.get(sheetKey(picture)) ?? []), picture]);
  }
  for (const pictures of groups.values()) {
    const options = optionsFor(pictures[0]);
    const { engine, grid } = options[0];
    const full = panelsOf(grid);
    let i = 0;
    for (; i + full <= pictures.length; i += full) plan.now.push({ grid, engine, pictures: pictures.slice(i, i + full), variants: 0 });
    const rest = pictures.slice(i);
    if (!rest.length) continue;
    if (force === "all" || rest.some((p) => force.includes(p.id))) {
      // One request either way: the cheapest that holds them, and of those the biggest panels (options' order).
      const holds = options.filter((o) => panelsOf(o.grid) >= rest.length);
      const cheapest = holds.sort((a, b) => ENGINES[a.engine].price - ENGINES[b.engine].price || panelsOf(a.grid) - panelsOf(b.grid))[0];
      if (rest.length === 1) plan.now.push({ engine: engineFor(rest[0], undefined), pictures: rest, variants: 0, forced: true });
      else plan.now.push({ grid: cheapest.grid, engine: cheapest.engine, pictures: rest, variants: panelsOf(cheapest.grid) - rest.length, forced: true });
    } else plan.waiting.push({ grid, engine, pictures: rest, missing: full - rest.length });
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
  /** Cut-out frames of one animation: each keeps its whole cell, so they line up (`--frames`). */
  frames?: boolean;
  /** Gemini's model, its resolution and thinking (`ENGINES`). */
  model?: string;
  imageSize?: string;
  thinking?: string;
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
  const { model, ...engine } = ENGINES[sheet.engine] as Engine;
  const shared = Object.fromEntries(
    Object.entries({ aspect, size, quality, transparent, key, ref, model, imageSize: engine.imageSize, thinking: engine.thinking }).filter(
      ([, v]) => v !== undefined,
    ),
  );
  if (!sheet.grid) return { ...shared, out: [first.file], prompt: `${styleOf(first)} ${first.prompt}` };
  if (first.panels)
    return {
      ...shared,
      grid: sheet.grid,
      ...(first.transparent && { frames: true }),
      out: first.panels.map((p) => p.file),
      prompt: `${styleOf(first)} ${first.prompt}`,
      panels: first.panels.map((p) => p.prompt),
    };
  const spare = Array.from({ length: sheet.variants }, (_, i) => sheet.pictures[i % sheet.pictures.length]);
  return {
    ...shared,
    grid: sheet.grid,
    out: [...sheet.pictures.map((p) => p.file), ...spare.map((p, i) => variantFile(p, Math.floor(i / sheet.pictures.length)))],
    prompt: `${styleOf(first)} Each panel is a picture of its own, as described below, all in this same style.`,
    panels: [...sheet.pictures.map((p) => p.prompt), ...spare.map((p) => `Another version of this picture: ${p.prompt}`)],
  };
}
