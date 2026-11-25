// The whole chart as one photo poster („Fotoposter“, T-32): a JPG in the exact shape of a poster size every drugstore
// and photo service prints on photo paper, so the chart hangs firm and wipeable like a bought one. The formats offered
// depend on the chart (T-35: a panorama for a day in one row, T-36: a square for a Countdown and a collecting way).
// Pure layout and arithmetic here; the drawing is in PosterPrint.tsx.

/** The shape a poster has: the usual 2 : 3 and 3 : 4, a long panorama, or a square. */
export type PosterShape = "standard" | "panorama" | "square";

/** A poster size to order, its short and long side in millimetres. */
export interface PosterFormat {
  id: "20x30" | "30x40" | "40x60" | "30x90" | "40x120" | "30x30";
  /** How shops name it in centimetres („30 × 40“). */
  cm: string;
  /** The same size in inches, as shops in English-speaking countries name it (same shape). */
  inches: string;
  short: number;
  long: number;
  /** Dots per inch of the saved JPG: above what photo services ask for, below what old phones' canvases can hold. */
  dpi: number;
  shape: PosterShape;
}

/**
 * Every poster size offered, smallest first in each shape. 50 × 75 cm (13 MP) is left out: too big for a child's room
 * and for an old phone's canvas. The pixels stay above what photo services recommend at least (2, 3 and 4 MP).
 */
export const POSTER_FORMATS: PosterFormat[] = [
  { id: "20x30", cm: "20 × 30", inches: "8 × 12″", short: 200, long: 300, dpi: 200, shape: "standard" },
  { id: "30x40", cm: "30 × 40", inches: "12 × 16″", short: 300, long: 400, dpi: 180, shape: "standard" },
  { id: "40x60", cm: "40 × 60", inches: "16 × 24″", short: 400, long: 600, dpi: 150, shape: "standard" },
  { id: "30x90", cm: "30 × 90", inches: "12 × 36″", short: 300, long: 900, dpi: 150, shape: "panorama" },
  { id: "40x120", cm: "40 × 120", inches: "16 × 48″", short: 400, long: 1200, dpi: 120, shape: "panorama" },
  { id: "30x30", cm: "30 × 30", inches: "12 × 12″", short: 300, long: 300, dpi: 180, shape: "square" },
];

/** The size most charts are ordered in: a week on 30 × 40. */
export const DEFAULT_POSTER: PosterFormat["id"] = "30x40";

/** Photo services trim a few millimetres when they expose the paper: nothing that matters lies closer to the edge. */
export const POSTER_SAFE_MM = 5;

/** The most pixels a canvas may hold on an old phone (iOS Safari's limit is 16.7 MP); every format stays under it. */
export const MAX_CANVAS_PIXELS = 16_000_000;

/** What a chart is, as far as the poster sizes are concerned. */
export interface PosterChart {
  /** A board of stars or a plan of picture cards. */
  kind: "board" | "plan";
  /** The board's kind („collect“) or the plan's view („day“, „countdown“). */
  view: string;
  /** How many parts the day has (1 whole day, 2 morning and evening, 3 with midday); boards have 1. */
  parts: number;
  /** The most cards in one part of the day (a plan's day), 0 where it doesn't apply. */
  cards: number;
}

/** A plan of the day reads from left to right like a way: from five to ten cards in a row a panorama fits it (T-35). */
export const PANORAMA_CARDS = { min: 5, max: 10 };

/**
 * The sizes offered for a chart: the usual three always; a panorama for a day plan in one row of five to ten cards
 * (30 × 90), or morning and evening as two rows (40 × 120); a square for a Countdown and a collecting board, whose
 * way has no rows and columns (T-36).
 */
export function posterFormatsFor(chart: PosterChart): PosterFormat[] {
  const day = chart.kind === "plan" && chart.view === "day" && chart.cards >= (chart.parts === 1 ? PANORAMA_CARDS.min : 3) && chart.cards <= PANORAMA_CARDS.max;
  const square = (chart.kind === "plan" && chart.view === "countdown") || (chart.kind === "board" && chart.view === "collect");
  return POSTER_FORMATS.filter(
    (f) =>
      f.shape === "standard" ||
      (f.shape === "panorama" && day && (f.id === "30x90" ? chart.parts === 1 : chart.parts === 2)) ||
      (f.shape === "square" && square),
  );
}

/** A format by id among those offered; an unknown or missing one is 30 × 40 (or the first offered). */
export function posterFormat(formats: PosterFormat[], id: string | undefined): PosterFormat {
  return formats.find((f) => f.id === id) ?? formats.find((f) => f.id === DEFAULT_POSTER) ?? formats[0];
}

/** Width and height of a poster in millimetres: a panorama always lies, a square has no side, the others follow the chart. */
export function posterSize(format: PosterFormat, orientation: "landscape" | "portrait"): { width: number; height: number } {
  const landscape = format.shape === "panorama" || (format.shape === "standard" && orientation === "landscape");
  return landscape ? { width: format.long, height: format.short } : { width: format.short, height: format.long };
}

/** Pixels of a length in millimetres at a format's dots per inch. */
export const posterPx = (mm: number, dpi: number) => Math.round((mm / 25.4) * dpi);

/**
 * The sheet is laid out at the size of an A4 page's short side (210 mm) and drawn bigger onto the canvas: its words,
 * rings and pictures keep the proportions they have on A4, which were chosen to read well from a child's height.
 */
export const LAYOUT_SHORT_MM = 210;

/** The poster's box in layout millimetres: its short side 210, its long side in the poster's own proportion. */
export function layoutSize(format: PosterFormat, orientation: "landscape" | "portrait"): { width: number; height: number } {
  const real = posterSize(format, orientation);
  const scale = LAYOUT_SHORT_MM / Math.min(real.width, real.height);
  return { width: real.width * scale, height: real.height * scale };
}

/**
 * Dots per inch a picture of `px` pixels across has where it is printed `mm` millimetres wide. Below `SHARP_DPI` a
 * photo printed at arm's length looks soft (photo services warn at about 100).
 */
export const effectiveDpi = (px: number, mm: number) => (mm <= 0 ? Number.POSITIVE_INFINITY : px / (mm / 25.4));

/** A picture on a poster is sharp enough from here on: posters are seen from a step away, not held like a photo. */
export const SHARP_DPI = 100;

/** A picture on the poster as measured: its pixels and the share of the poster's width it takes. */
export interface PosterPicture {
  px: number;
  /** Its printed width over the poster's width, 0 to 1. */
  share: number;
  /** The child's own photo (T-30), named in the warning; else a picture of the chart. */
  photo: boolean;
}

/** The picture printed least sharp on a format (lowest dpi), or none where every one is sharp enough. */
export function blurriest(pictures: PosterPicture[], format: PosterFormat, orientation: "landscape" | "portrait"): PosterPicture | undefined {
  const { width } = posterSize(format, orientation);
  const dpi = (p: PosterPicture) => effectiveDpi(p.px, p.share * width);
  const worst = [...pictures].sort((a, b) => dpi(a) - dpi(b))[0];
  return worst && dpi(worst) < SHARP_DPI ? worst : undefined;
}

/**
 * The largest of the offered formats of the same shape in which every picture stays sharp (T-37), measured by the share
 * of the width each takes on the format shown (the same shape keeps the shares); none where even the smallest is soft.
 */
export function largestSharp(
  pictures: PosterPicture[],
  formats: PosterFormat[],
  shown: PosterFormat,
  orientation: "landscape" | "portrait",
): PosterFormat | undefined {
  return formats
    .filter((f) => f.shape === shown.shape)
    .sort((a, b) => b.long * b.short - a.long * a.short)
    .find((f) => !blurriest(pictures, f, orientation));
}

/** The decoration round a poster (T-33, T-40): none (as on A4), a frame that suits all year, or one for a season. */
export type PosterDecor = "plain" | "vines" | "pennants" | "clouds" | "autumn" | "advent" | "easter" | "birthday";

/** The decorations in the order offered: plain first, then all year, then the seasons through the year. */
export const POSTER_DECORS: PosterDecor[] = ["plain", "vines", "pennants", "clouds", "easter", "birthday", "autumn", "advent"];

/** The decoration that suits a month (0 January): Easter in March and April, autumn leaves from September, Advent in December. */
export function seasonalDecor(month: number): PosterDecor {
  if (month === 2 || month === 3) return "easter";
  if (month >= 8 && month <= 10) return "autumn";
  if (month === 11) return "advent";
  return "vines";
}

/** What the grown-up chose for the poster, saved with the print options. */
export interface PosterOptions {
  /** The poster size (`POSTER_FORMATS`); missing: 30 × 40. */
  poster?: PosterFormat["id"];
  /** The decoration round it; missing: the season's (`seasonalDecor`). */
  decor?: PosterDecor;
  /** Another chart printed under or over this one on 40 × 60 (T-39), by its id; missing: this chart alone. */
  companion?: string;
}

/** How far the decoration reaches in from the poster's edge, in layout millimetres; the sheet keeps inside it. */
export const DECOR_MM = 14;
