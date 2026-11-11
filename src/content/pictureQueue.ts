import { DAY_PICTURE_QUEUE } from "@/games/feelings/dayPictures";
import { MOOD_PICTURE_QUEUE } from "@/games/feelings/moodPictures";
import { RITUAL_PICTURE_QUEUE } from "@/games/rewards/bilder/prompts";
import { TOGETHER_PICTURE_QUEUE } from "@/games/together/picturePrompts";
import { MILK_CHAIN_PICTURE_QUEUE } from "@/games/milkchain/milkChainPictures";
import { PACIFIER_PICTURE_QUEUE } from "@/games/pacifierstory/pacifierStoryPictures";
import { KITA_PICTURE_QUEUE } from "@/games/kitastory/kitaStoryPictures";
import { CAUSE_PICTURE_QUEUE } from "@/games/cause/causePictures";

// Pictures asked for that wait until they can be made cheaply (/bild-erzeugen). Every picture asked for comes in
// here first; `bun run image queue` then makes at once what is already as cheap as it gets (a full sheet of
// small pictures, or a picture that never shares one) and leaves the rest until later sessions bring partners for
// its sheet – unless the grown-up says to make it now. The management page shows what waits and what for.
// A made picture leaves the queue in the same commit (pictureQueue.test.ts fails while its file exists).

/**
 * The only reasons a picture may take a request of its own where a sheet could hold it (user feedback, November 2026:
 * frames and cut-outs sent one by one cost twice what sheets would have). Small things share 2x2 sheets, the moments of
 * one scene go in one request as `panels`; a new reason comes here only once a check proved a sheet fails for it.
 */
export const ALONE_REASONS = {
  /** A second frame drawn from a first that is already made, so the two stay one scene (Lebendige Bilder). */
  "second frame": "drawn from its first frame, which is already made",
  /** A page of a story drawn from its scene's first picture, keeping the place (Gefühle's days). */
  "story picture": "drawn from its scene's first picture, so the place stays the same",
} as const;

/** One of `ALONE_REASONS`. */
export type AloneReason = keyof typeof ALONE_REASONS;

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
  /**
   * Pictures of one scene drawn together in one request, one under the other, and cut apart – the frames of a scene,
   * so they match and cost one request: each panel's file and words. `file` is the first panel's, `prompt` what all
   * panels share, and `aspect` and `size` are each panel's. Cut out (`transparent`), they are frames of one animation
   * and keep their whole cells, so they line up (`--frames`).
   */
  panels?: { file: string; prompt: string }[];
  /** Why it must be drawn alone, so it never shares a sheet – only a reason from `ALONE_REASONS`. */
  alone?: AloneReason;
  /** When it was asked for, YYYY-MM-DD. */
  date: string;
}

/** Every picture waiting, oldest first. */
export const PICTURE_QUEUE: QueuedPicture[] = [
  ...RITUAL_PICTURE_QUEUE,
  ...DAY_PICTURE_QUEUE,
  ...MOOD_PICTURE_QUEUE,
  ...TOGETHER_PICTURE_QUEUE,
  ...MILK_CHAIN_PICTURE_QUEUE,
  ...PACIFIER_PICTURE_QUEUE,
  ...KITA_PICTURE_QUEUE,
  ...CAUSE_PICTURE_QUEUE,
];
