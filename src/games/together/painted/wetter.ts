import type { PaintedPair } from ".";

// The painted pairs of the topic „wetter“ (topics.ts); how to write one is in index.ts and the game's CLAUDE.md.

export const PAINTED: PaintedPair[] = [
  {
    id: "schneemann-karotte",
    topic: "wetter",
    name: "Schneemann",
    the: "der Schneemann",
    toThe: "zum Schneemann",
    partner: { name: "Karotte", the: "die Karotte", acc: "die Karotte", emoji: "🥕" },
    cast: "bear",
    before:
      "A snowy garden with a few snow-covered fir trees. In the middle a big snowman of three snowballs with coal eyes, a coal smile and twig arms – where its nose should be there is nothing. Beside it a little bear child in a red winter jacket, a woolly hat and mittens looks at the snowman's face, puzzled.",
    after: "An orange carrot now sits in the snowman's face as its nose. The bear child claps its mittens, laughing happily.",
    sounds: ["pop"],
    made: true,
  },
];
