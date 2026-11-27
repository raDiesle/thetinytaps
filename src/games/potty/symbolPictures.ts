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

/** The symbols waiting to be made (the first sixteen made on 21 November 2026, Zähne putzen's tube and cup on 23 November 2026; the breakfast, the lion and the roaring asked for on 27 November 2026). */
export const SYMBOL_PICTURE_QUEUE: QueuedPicture[] = [
  {
    ...symbol(
      "teeth",
      "fruehstueck",
      "Zähne putzen: Symbol der Leiste für „Frühstück essen“ morgens (X-19), statt des Bonbons am Abend",
      "A slice of bread spread with golden honey, the honey running over its brown crust in two drips.",
    ),
    date: "2026-11-27",
    after:
      "Take the drawn stand-in for „fruehstueck“ out of `BarSymbol` in src/games/teeth/TeethPlay.tsx (the HoneyBread svg) and its import there, if nothing else uses it.",
  },
  {
    ...symbol(
      "teeth",
      "loewe",
      "Zähne putzen: Symbol der Leiste für die Phase „Da kommt der Löwe“ (X-26), gleich nach der Zahnpasta",
      "A friendly young lion's head seen from the front, its round face golden, a fluffy orange-brown mane all round it, two small round ears, its mouth closed in a calm smile.",
    ),
    date: "2026-11-27",
    after:
      "Take the drawn stand-in for „loewe“ out of `BarSymbol` in src/games/teeth/TeethPlay.tsx (the LionSymbol svg there; `LionSymbol` stays in src/games/teeth/lion.tsx, whose roar marks draw it).",
  },
  {
    ...symbol(
      "teeth",
      "bruellen",
      "Zähne putzen: Symbol der Leiste für die Phase „Brüllen wie ein Löwe“ (X-26), nach dem Löwen und vor dem Spiegel",
      "The same friendly young lion's head seen from the front, golden face and fluffy orange-brown mane, its mouth wide open in a big happy roar, with three curved sound lines going out on each side of its mouth.",
    ),
    date: "2026-11-27",
    after:
      "Take the drawn stand-in for „bruellen“ out of `BarSymbol` in src/games/teeth/TeethPlay.tsx (the RoarSymbol svg) and the `RoarSymbol` export in src/games/teeth/lion.tsx, if nothing else uses it.",
  },
];
