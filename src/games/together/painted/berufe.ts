import type { PaintedPair } from ".";

// The painted pairs of the topic „berufe“ (topics.ts); how to write one is in index.ts and the game's CLAUDE.md.

export const PAINTED: PaintedPair[] = [
  {
    id: "schornsteinfeger",
    topic: "berufe",
    name: "Schornsteinfeger",
    the: "der Schornsteinfeger",
    toThe: "der Schornsteinfeger",
    partner: { name: "Kaminbesen", the: "der Kaminbesen", acc: "den Kaminbesen" },
    part: "a chimney sweep's brush: a round black bristle ball on a coiled rope",
    cast: "fox",
    before:
      "On a red tiled roof under a blue sky, a tall brick chimney with grey smoke puffing out of its top. The chimney sweep, a grown-up fox in a black suit with golden buttons and a black top hat, stands on the roof beside the chimney with empty paws, looking at the smoke, puzzled.",
    after:
      "The chimney sweep now stands right at the chimney and holds a rope in both paws, lowering a round black chimney-sweep brush on it down into the chimney's top opening, the brush half inside the chimney; the smoke is gone. The fox smiles happily.",
    sounds: ["whoosh", "rustle"],
    alsoFits: ["hexe"],
    made: "frames",
  },
];
