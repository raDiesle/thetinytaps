// Cards as photo prints („Fotoabzug“): the pictures of a plan or the board's stars, laid out on a photo format that
// every drugstore, photo kiosk and online shop prints (in other countries the same sizes in inches), saved as JPG.
// Photo paper is firm and wipeable, so the cards need no laminating before they get their Velcro dots.
// Pure layout here; drawing on a canvas is in PhotoPrint.tsx.

/** A photo format to order, in millimetres, portrait. */
export interface PhotoFormat {
  id: "10x15" | "13x18" | "20x30";
  /** How shops name it („10 × 15“). */
  label: string;
  /** The same size in inches, as shops abroad name it. */
  inches: string;
  /** The exact inch size: 10 × 15 cm is printed as 4 × 6″ almost everywhere, so the picture has that shape. */
  width: number;
  height: number;
}

/** The formats offered, the cheapest and most common first. */
export const PHOTO_FORMATS: PhotoFormat[] = [
  { id: "10x15", label: "10 × 15 cm", inches: "4 × 6″", width: 101.6, height: 152.4 },
  { id: "13x18", label: "13 × 18 cm", inches: "5 × 7″", width: 127, height: 177.8 },
  { id: "20x30", label: "20 × 30 cm", inches: "8 × 12″", width: 203.2, height: 304.8 },
];

/** A format by id; an unknown or missing one (saved before photo prints existed) is the first. */
export const photoFormat = (id: string | undefined): PhotoFormat => PHOTO_FORMATS.find((f) => f.id === id) ?? PHOTO_FORMATS[0];

/** Dots per inch of the saved picture: what photo printers print. */
export const PHOTO_DPI = 300;

/**
 * White round the cards: photo printers trim a little even when told not to, and 13 × 18 cm is not exactly 5 × 7″.
 * Nothing that matters lies there.
 */
export const PHOTO_MARGIN_MM = 5;

/** The smallest card for a plan's pictures: big enough to grab and for a 20 mm Velcro dot on its back. */
export const MIN_CARD_MM = 45;
/** The smallest star to stick on a board: a 20 mm Velcro dot still fits. */
export const MIN_STAR_MM = 30;

/** Where the cards lie on one photo: a grid of square cells, centred, cut apart along the cells' edges. */
export interface PhotoLayout {
  cols: number;
  rows: number;
  /** The side of a cell, in millimetres. */
  cell: number;
  /** The grid's top left corner, in millimetres. */
  left: number;
  top: number;
}

/** The most cards of at least `min` mm that fit on a photo, and as big as they can be with that many. */
export function photoLayout(format: PhotoFormat, min: number): PhotoLayout {
  const width = format.width - 2 * PHOTO_MARGIN_MM;
  const height = format.height - 2 * PHOTO_MARGIN_MM;
  const cols = Math.max(1, Math.floor(width / min));
  const rows = Math.max(1, Math.floor(height / min));
  // Whole tenths of a millimetre, so the cut lines fall the same in every picture.
  const cell = Math.floor(Math.min(width / cols, height / rows) * 10) / 10;
  return { cols, rows, cell, left: (format.width - cols * cell) / 2, top: (format.height - rows * cell) / 2 };
}

/** The cards split into photos of `perPhoto` each; at least one photo, even an empty one. */
export function photoSheets<T>(cards: T[], perPhoto: number): T[][] {
  if (cards.length === 0) return [[]];
  return Array.from({ length: Math.ceil(cards.length / perPhoto) }, (_, i) => cards.slice(i * perPhoto, (i + 1) * perPhoto));
}

/** Pixels of a length in millimetres at `PHOTO_DPI`. */
export const photoPx = (mm: number) => Math.round((mm / 25.4) * PHOTO_DPI);
