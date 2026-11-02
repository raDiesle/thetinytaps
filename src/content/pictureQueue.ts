// Pictures asked for that wait until they can be made cheaply (/bild-erzeugen). Every picture asked for comes in
// here first; `bun run image queue` then makes at once what is already as cheap as it gets (a full sheet of
// small pictures, or a picture that never shares one) and leaves the rest until later sessions bring partners for
// its sheet – unless the grown-up says to make it now. The management page shows what waits and what for.
// A made picture leaves the queue in the same commit (pictureQueue.test.ts fails while its file exists).

/** One picture someone asked for, waiting to be made with `bun run image`. */
export interface QueuedPicture {
  /** Unique in the queue; usually the file's name without folder and extension. */
  id: string;
  /** Where the picture goes, relative to the repository (.webp, .png or .jpg). */
  file: string;
  /** What it is for, in German, for the grown-up. */
  use: string;
  /** What this picture shows, in English, without the style block: `style` (or the book's default) goes before it. */
  prompt: string;
  /** The shared start of the prompt, when not the book's style block (`BOOK_STYLE`, `CUTOUT_STYLE` for cut-outs). */
  style?: string;
  /** Its aspect, like "1:1" or "4:3" (`--aspect`). */
  aspect?: string;
  /** Its size: "512" for the longest side, "1200x900" exactly (`--size`); without one it needs the whole picture and never shares a sheet. */
  size?: string;
  /** Cut out on a flat backdrop (`--transparent`). */
  transparent?: boolean;
  /** The backdrop colour to cut out, when not ff00ff (`--key`). */
  key?: string;
  /** WebP quality, when not 80 (`--quality`). */
  quality?: number;
  /** Pictures passed as `--ref`, relative to the repository; one still in the queue holds this one back until it is made. */
  ref?: string[];
  /** Why it must be drawn alone (a second frame, a story picture keeping its room), so it never shares a sheet. */
  alone?: string;
  /** When it was asked for, YYYY-MM-DD. */
  date: string;
}

/** Every picture waiting, oldest first. */
export const PICTURE_QUEUE: QueuedPicture[] = [];
