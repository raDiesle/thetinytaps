import type { PaintedPair } from ".";

// The painted pairs of the topic „fantasie“ (topics.ts); how to write one is in index.ts and the game's CLAUDE.md.

export const PAINTED: PaintedPair[] = [
  {
    id: "weihnachtsmann",
    topic: "fantasie",
    name: "Weihnachtsmann",
    the: "der Weihnachtsmann",
    toThe: "der Weihnachtsmann",
    partner: { name: "Rentier", the: "das Rentier", acc: "das Rentier", emoji: "🦌" },
    cast: "fox",
    before:
      "A snowy field at night with a few snow-covered fir trees and snowflakes falling. In the middle a red wooden sleigh loaded with wrapped presents; in front of it its empty leather harness lies on the snow, nothing tied to it. In the sleigh sits Father Christmas, a grown-up fox in a red coat with white fur trim, a red hat and a black belt, holding the slack reins and looking puzzled at the empty harness: the sleigh can't move.",
    after:
      "A brown reindeer with antlers now stands harnessed in the empty harness in front of the sleigh, pulling it, and the sleigh glides over the snow. Father Christmas fox laughs happily and waves.",
    sounds: ["bells"],
    made: true,
  },
  {
    id: "zwerg",
    topic: "fantasie",
    name: "Zwerg",
    the: "der Zwerg",
    toThe: "der Zwerg",
    partner: { name: "Spitzhacke", the: "die Spitzhacke", acc: "die Spitzhacke", emoji: "⛏️" },
    cast: "bear",
    before:
      "Inside a mine: a tunnel held up by wooden beams, a lantern hanging from a beam, rails on the ground with an empty wooden mine cart on them. Colourful gems glitter in the rock wall. The dwarf, a grown-up bear in a green coat, a brown belt and a tall red pointed hat, stands at the rock wall with empty paws, looking at the gems in the rock, puzzled.",
    after: "The dwarf now swings a pickaxe against the rock wall; some gems have broken out and lie in the mine cart. The dwarf smiles happily.",
    sounds: ["knock", "knock", "twinkle"],
    alsoFits: ["hoehlenforscher", "bauarbeiterin"],
    made: true,
  },
];
