import type { PaintedPair } from ".";

// The painted pairs of the topic „spielen“ (topics.ts); how to write one is in index.ts and the game's CLAUDE.md.

export const PAINTED: PaintedPair[] = [
  {
    id: "zauberhut-zauberstab",
    topic: "spielen",
    name: "Zauberhut",
    the: "der Zauberhut",
    toThe: "zum Zauberhut",
    partner: { name: "Zauberstab", the: "der Zauberstab", acc: "den Zauberstab", emoji: "🪄" },
    cast: "fox",
    before:
      "A children's room set up for a little magic show: a curtain of dark blue cloth hung on a cord behind, a small table with a dark-red cloth in front of it. On the table in the middle a black top hat stands upside down, its opening up, empty inside. Behind the table a fox child in a black cape with a red collar stands with empty paws, looking down into the empty hat, puzzled.",
    after:
      "The fox child now holds a black magic wand with a white tip and taps the hat's rim with it, and a long chain of colourful knotted silk scarves rises out of the hat. The fox child beams happily.",
    sounds: ["twinkle", "poof"],
  },
  {
    id: "burg-fahne",
    topic: "spielen",
    name: "Burg",
    the: "die Burg",
    toThe: "zur Burg",
    partner: { name: "Fahne", the: "die Fahne", acc: "die Fahne", emoji: "🚩" },
    cast: "bear",
    before:
      "A sunny sandy beach with the calm sea behind. In the middle a big sandcastle with four towers round a high middle tower, a red bucket and a small yellow spade lying beside it. The top of the high middle tower is bare. A bear child in a striped swim shirt and swimming trunks kneels beside the castle with empty paws, looking at the top of the middle tower, puzzled.",
    after:
      "The bear child now pushes a small red triangular flag on a thin wooden stick into the top of the middle tower; the flag flutters in the breeze. The bear child smiles proudly.",
    sounds: ["whoosh", "chime"],
  },
  {
    id: "tor-ball",
    topic: "spielen",
    name: "Tor",
    the: "das Tor",
    toThe: "zum Tor",
    partner: { name: "Fußball", the: "der Fußball", acc: "den Fußball", emoji: "⚽" },
    cast: "fox",
    before:
      "A green meadow in a park with a few trees at the back. In the middle a small white football goal with its net. A fox child in a red football shirt, shorts and trainers stands in front of the goal with empty paws, one foot drawn back ready to kick, looking at the bare grass in front of its foot, puzzled.",
    after: "A black-and-white football now flies from the fox child's foot into the goal, the net bulging. The fox child cheers with both arms up.",
    sounds: ["thump", "whoosh"],
    made: true,
  },
  {
    id: "puzzle-puzzleteil",
    topic: "spielen",
    name: "Puzzle",
    the: "das Puzzle",
    toThe: "zum Puzzle",
    partner: { name: "Puzzleteil", the: "das Puzzleteil", acc: "das Puzzleteil", emoji: "🧩" },
    cast: "bear",
    before:
      "A children's room with a soft rug. On the rug in the middle a big floor puzzle of a green meadow with a yellow sun in a blue sky, all its pieces laid together except one gap in the green meadow, through which the rug shows. A bear child in a yellow T-shirt and red trousers kneels beside it with empty paws, looking at the gap, puzzled.",
    after: "The bear child now presses the last green puzzle piece into the gap, and the picture of the meadow is whole. The bear child smiles happily.",
    sounds: ["click", "twinkle"],
  },
  {
    id: "trommel-trommelstoecke",
    topic: "spielen",
    name: "Trommel",
    the: "die Trommel",
    toThe: "zur Trommel",
    partner: { name: "Trommelstöcke", the: "die Trommelstöcke", acc: "die Trommelstöcke", plural: true },
    part: "two wooden drumsticks with round tips, crossed",
    cast: "fox",
    before:
      "A living room with a sofa and a rug. On the rug in the middle a red toy drum with a white top and gold zigzag cords round its side. A fox child in a light-green T-shirt and blue trousers sits behind it with its empty paws on its knees, looking at the silent drum, puzzled.",
    after: "The fox child now holds two wooden drumsticks with round tips and beats the drum with them, laughing happily.",
    sounds: ["drum", "drum"],
  },
];
