import type { PaintedPair } from ".";

// The painted pairs of the topic „kueche“ (topics.ts); how to write one is in index.ts and the game's CLAUDE.md.

export const PAINTED: PaintedPair[] = [
  {
    id: "saftpresse-orange",
    topic: "kueche",
    name: "Saftpresse",
    the: "die Saftpresse",
    toThe: "zur Saftpresse",
    partner: { name: "Orange", the: "die Orange", acc: "die Orange", emoji: "🍊" },
    cast: "bear",
    before:
      "A kitchen counter in front of a tiled wall with a window. On the counter in the middle: a glass citrus juicer (a ribbed cone on a little bowl), empty, and beside it an empty drinking glass. A little bear child in a light-blue T-shirt and dark blue trousers stands at the counter, holding up the empty glass and looking at the empty juicer, puzzled.",
    after:
      "Half an orange is now pressed down on the juicer's cone, the other orange half lies beside it, and the glass is full of orange juice. The bear child drinks from the glass, smiling happily.",
    sounds: ["squeak", "glug"],
    alsoFits: ["baum-apfel"],
    made: true,
  },
];
