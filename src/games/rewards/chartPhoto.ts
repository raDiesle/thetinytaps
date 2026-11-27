/**
 * A photo of the child on a chart (user request, November 2026): where it sits and how its frame is shaped. Pure data –
 * the picture itself never lives here but only in the browser's IndexedDB on this device (`photoStore.ts`), found by
 * `key`; a chart carries only that key, the place and the frame's shape, so a later photo poster can lay it out too.
 */

/**
 * Where the photo sits on the sheet: big in the top left or top right corner of the sheet's head, or small right
 * beside the heading. The sheet's cards make room for it – the head grows to the photo's height – never lie under it.
 */
export type PhotoPlace = "top-left" | "top-right" | "title";

/** Every place, in the order the photo's window offers them; the first is the default. */
export const PHOTO_PLACES: readonly PhotoPlace[] = ["top-left", "top-right", "title"];

/** Where a new photo goes: the top left corner, where the eye starts. */
export const DEFAULT_PHOTO_PLACE: PhotoPlace = "top-left";

/** A photo on a chart: its key in the photo store, its place and the shape of its frame. */
export interface ChartPhoto {
  /** Its key in `photoStore` (`newPhotoKey`): a random id, never the picture or anything about it. */
  key: string;
  /** Missing (or unknown): `DEFAULT_PHOTO_PLACE`. */
  place?: PhotoPlace;
  /** Width / height of the photo as stored, so the sheet lays its frame out before the picture is read. */
  ratio?: number;
}

/** The longest side a photo is stored with: about 10 cm on paper at 300 dpi, far more than a sheet ever prints it. */
export const PHOTO_MAX_SIDE = 1200;

/** The JPEG quality it is stored with. */
export const PHOTO_QUALITY = 0.85;

/** The narrowest and widest frame: a very tall or wide photo is cut to these, its middle kept. */
export const FRAME_RATIOS = { min: 3 / 4, max: 4 / 3 } as const;

/** The photo's place, the default where none (or an unknown one) is saved – old charts need no migration. */
export const photoPlaceOf = (photo: ChartPhoto | undefined): PhotoPlace =>
  photo?.place && PHOTO_PLACES.includes(photo.place) ? photo.place : DEFAULT_PHOTO_PLACE;

/** The frame's width / height: the photo's own shape within `FRAME_RATIOS`, a portrait's 4 : 5 where it is unknown. */
export function frameRatio(photo: ChartPhoto | undefined): number {
  const ratio = photo?.ratio;
  if (!ratio || !Number.isFinite(ratio) || ratio <= 0) return 4 / 5;
  return Math.min(FRAME_RATIOS.max, Math.max(FRAME_RATIOS.min, ratio));
}

/** The size a photo of `width` × `height` is stored at: its longest side at most `max`, never made bigger. */
export function scaledSize(width: number, height: number, max = PHOTO_MAX_SIDE): { width: number; height: number } {
  const scale = Math.min(1, max / Math.max(width, height, 1));
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

/** What a photo's key looks like: `foto-` and random letters and digits, nothing taken from the picture or the child. */
export const PHOTO_KEY = /^foto-[a-z0-9]+-[a-z0-9]+$/;

/** A new key for a photo just chosen: each upload its own, so ↶ after a replaced photo brings the old one back. */
export const newPhotoKey = (): string => `foto-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10) || "0"}`;

/** A chart as far as its photos go: the child's, and the own photos of a board's tasks or a plan's cards (T-13). */
interface WithPhotos {
  photo?: ChartPhoto;
  tasks?: readonly { photo?: string }[];
  /** A plan's cards day by day; a board's `days` are weekday numbers and hold none. */
  days?: readonly unknown[];
  /** The parts' own signs (`daySigns.tsx`), which may be own photos too. */
  partSigns?: Partial<Record<string, { photo?: string }>>;
}

/** The own photo's key of a plan's card, if it has one. */
const stepPhoto = (step: unknown): string[] =>
  step && typeof step === "object" && "photo" in step && typeof step.photo === "string" && step.photo ? [step.photo] : [];

/**
 * The keys of the photos on these charts – the child's, every task's or card's own and the parts' own signs – everything else in the store
 * belongs to nothing and is deleted.
 */
export const photoKeysOf = (charts: readonly WithPhotos[]): Set<string> =>
  new Set(
    charts.flatMap((chart) => [
      ...(chart.photo?.key ? [chart.photo.key] : []),
      ...(chart.tasks ?? []).flatMap((task) => (task.photo ? [task.photo] : [])),
      ...(chart.days ?? []).flatMap((day) => (Array.isArray(day) ? day.flatMap(stepPhoto) : [])),
      ...Object.values(chart.partSigns ?? {}).flatMap((sign) => (sign?.photo ? [sign.photo] : [])),
    ]),
  );
