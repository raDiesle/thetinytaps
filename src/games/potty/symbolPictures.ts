import type { QueuedPicture } from "@/content/pictureQueue";

// The small pictures of the grown-ups' strips at the bottom of „Aufs Töpfchen“ and „Zähne putzen“ (user request,
// 21 November 2026: the emoji in the row of steps and on the buttons looked poor). Cut out, four to a sheet; each is
// one plain thing that still reads at the size of a fingertip. They leave the queue in the commit that adds them.

const DATE = "2026-11-21";

/** What every symbol's prompt ends with, so all of them read as one set of icons. */
export const ICON =
  "Drawn as a small icon: one simple, bold, chunky shape centred with empty room on every side, seen straight from the front, nothing else in the picture, no shadow on the ground, no white outline, sticker edge or halo round it – its dark plum ink line is its outer edge.";

/** A symbol's queue entry: a new symbol of the strips is queued with it, in the set's style line. */
export const symbol = (folder: "potty" | "teeth", id: string, use: string, what: string): QueuedPicture => ({
  id: `symbol-${folder}-${id}`,
  file: `src/games/${folder}/bilder/symbole/${id}.webp`,
  use,
  prompt: `${what} ${ICON}`,
  aspect: "1:1",
  size: "256",
  transparent: true,
  date: DATE,
});

/** The symbols waiting to be made (the first sixteen made on 21 November 2026, Zähne putzen's tube and cup on 23 November 2026, its lion and roaring lion on 27 November 2026); a new one comes in with `symbol(…)`. */
export const SYMBOL_PICTURE_QUEUE: QueuedPicture[] = [
  {
    ...symbol(
      "teeth",
      "spucken",
      "Zähne putzen: Symbol der Leiste und des Schalters hinter ⚙️ für die Phase „Schaum ausspucken“ nach dem Putzlied",
      "A small round white wash basin seen from the front, a few soft blobs of white toothpaste foam falling down into it.",
    ),
    date: "2026-11-27",
    after:
      "Nothing to wire up: `BarSymbol` and `PhaseIcon` show `bilder/symbole/spucken.webp` once it is there. Look at it on the bar at 844×390 next to the cup's symbol.",
  },
];
