import type { PaintedPair } from ".";

// The painted pairs of the topic „feste“ (topics.ts); how to write one is in index.ts and the game's CLAUDE.md.

export const PAINTED: PaintedPair[] = [
  {
    id: "torte-kerze",
    topic: "feste",
    name: "Torte",
    the: "die Torte",
    toThe: "zur Torte",
    partner: { name: "Kerzen", the: "die Kerzen", acc: "die Kerzen", plural: true },
    part: "three thin birthday candles with spiral stripes in pink, yellow and light blue, each with a small flame, standing together – no cake, no holder, no plate",
    cast: "fox",
    before:
      "A birthday party: a table with a light tablecloth, a paper garland of little flags on the wall behind. On the table in the middle a big round birthday cake with white icing and strawberries on top – nothing stands on it. Behind the table a fox child in a paper party hat and a light-blue T-shirt looks at the cake, puzzled, one paw at its chin.",
    after:
      "Three thin birthday candles with spiral stripes now stand on top of the cake, each with a small burning flame. The fox child smiles happily with shining eyes, cheeks puffed, about to blow.",
    sounds: ["clonk", "twinkle"],
    alsoFits: ["tannenbaum-weihnachtsstern"],
    made: true,
  },
];
