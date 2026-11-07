import type { PaintedPair } from ".";

// The painted pairs of the topic „garten“ (topics.ts); how to write one is in index.ts and the game's CLAUDE.md.

export const PAINTED: PaintedPair[] = [
  {
    id: "feuerstelle-feuer",
    topic: "garten",
    name: "Feuerstelle",
    the: "die Feuerstelle",
    toThe: "zur Feuerstelle",
    partner: { name: "Feuer", the: "das Feuer", acc: "das Feuer", emoji: "🔥" },
    cast: "both",
    before:
      "Evening at the edge of a forest, the sky deep blue with the last light of the day. In the middle a ring of round stones on the ground with firewood logs stacked in it like a little tent – cold: no fire, no flame, no smoke, no glow. Around it, on fallen tree trunks, sit exactly four characters: on the left a grown-up fox in a green sweater with a fox child in a light-blue T-shirt beside it, on the right a grown-up bear in a pink cardigan with a bear child in a yellow T-shirt beside it. Each has a blanket round the shoulders; they shiver a little and look at the cold stack of wood, waiting.",
    after:
      "The firewood in the stone ring now burns as a bright, cosy campfire with orange flames, and its warm light falls on everyone. All four smile happily and hold their paws out towards the warm fire.",
    sounds: ["crackle"],
    alsoFits: ["laterne-licht"],
    made: true,
  },
];
