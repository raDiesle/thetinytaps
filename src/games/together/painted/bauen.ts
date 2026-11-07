import type { PaintedPair } from ".";

// The painted pairs of the topic „bauen“ (topics.ts); how to write one is in index.ts and the game's CLAUDE.md.

export const PAINTED: PaintedPair[] = [
  {
    id: "bauarbeiterin",
    topic: "bauen",
    name: "Bauarbeiterin",
    the: "die Bauarbeiterin",
    toThe: "die Bauarbeiterin",
    partner: { name: "Steine", the: "die Steine", acc: "die Steine", plural: true, emoji: "🧱" },
    cast: "fox",
    before:
      "A building site behind a red-and-white barrier: the walls of a little house half built of red bricks, a cement mixer and a wheelbarrow. In front of the unfinished wall stands the builder, a grown-up fox woman with eyelashes in an orange work jacket, a yellow safety vest and a yellow hard hat, a mason's trowel in one paw and a bucket of mortar at her feet. The wooden pallet beside her is empty, and she looks round puzzled.",
    after: "A stack of red bricks now stands on the pallet beside her, and she sets one brick onto the wall with her trowel, smiling happily.",
    sounds: ["thump", "clonk"],
    made: true,
  },
];
