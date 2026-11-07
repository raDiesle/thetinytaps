import type { PaintedPair } from ".";

// The painted pairs of the topic „unterwegs“ (topics.ts); how to write one is in index.ts and the game's CLAUDE.md.

export const PAINTED: PaintedPair[] = [
  {
    id: "briefkasten-brief",
    topic: "unterwegs",
    name: "Briefkasten",
    the: "der Briefkasten",
    toThe: "zum Briefkasten",
    partner: { name: "Brief", the: "der Brief", acc: "den Brief", emoji: "✉️" },
    cast: "fox",
    before:
      "A quiet street in front of a house. On the pavement a yellow post box on a post, its slot empty, no writing or sign on it. A fox child in a light-blue T-shirt and dark blue trousers stands in front of the post box with empty paws, looking at the slot, puzzled.",
    after: "The fox child now pushes a white envelope into the post box's slot, half of it still sticking out, and smiles happily.",
    sounds: ["whoosh", "plop"],
    made: true,
  },
];
