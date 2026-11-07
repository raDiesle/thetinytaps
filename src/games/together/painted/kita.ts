import type { PaintedPair } from ".";

// The painted pairs of the topic „kita“ (topics.ts); how to write one is in index.ts and the game's CLAUDE.md.
// What a child does at the Kita's tables, in its music corner and on its way to school one day. No crayons or other
// drawing things lie about in these pictures: crayons are the handmade paper's partner.

export const PAINTED: PaintedPair[] = [
  {
    id: "schule-schulranzen",
    topic: "kita",
    name: "Schule",
    the: "die Schule",
    toThe: "zur Schule",
    partner: { name: "Schulranzen", the: "der Schulranzen", acc: "den Schulranzen", emoji: "🎒" },
    cast: "fox",
    before:
      "A school building of red brick with a big front door and a round clock above it, a little path with flowers on both sides leading to the door. On the path in front of the door stands a fox child in a light-blue T-shirt and red trousers, its paws empty and nothing on its back, looking back over its shoulder at its own back, brows raised, mouth a small o.",
    after: "The fox child now wears a red school backpack on its back, holding its straps with both paws, and beams happily.",
    sounds: ["thump", "ring"],
    // The lunch box goes into the school bag.
    alsoFits: ["pausenbrot-brotdose"],
    made: true,
  },
  {
    id: "schere-buntpapier",
    topic: "kita",
    name: "Schere",
    the: "die Schere",
    toThe: "zur Schere",
    partner: { name: "Buntpapier", the: "das Buntpapier", acc: "das Buntpapier" },
    part: "three sheets of coloured paper fanned out: red, yellow and blue",
    cast: "bear",
    before:
      "A bright Kita craft room: a low wooden table, a few colourful paper stars hanging on the wall behind it. At the table sits a bear child in a green sweater, holding a pair of child's scissors with round tips and blue handles and snipping in the air – the table in front of it is bare, nothing to cut – and looks at the bare table, brows raised, mouth a small o.",
    after:
      "The bear child now cuts into a sheet of red paper with the scissors, a few red paper strips already lying on the table and a yellow and a blue sheet beside them, and smiles happily.",
    sounds: ["snap", "rip"],
    made: true,
  },
  {
    id: "tafel-kreide",
    topic: "kita",
    name: "Tafel",
    the: "die Tafel",
    toThe: "zur Tafel",
    partner: { name: "Kreide", the: "die Kreide", acc: "die Kreide" },
    part: "a stick of white chalk",
    cast: "fox",
    before:
      "A Kita room with a low blackboard on the wall, dark green and completely blank, its little ledge at the bottom bare. A fox child in a purple T-shirt and dungarees stands in front of the board with empty paws, looking at the blank board, brows raised, mouth a small o.",
    after: "The fox child now draws a big sun on the board with a stick of white chalk, white chalk lines shining on the green, and smiles happily.",
    sounds: ["tick", "squeak"],
    // A blackboard is wiped with the sponge, and chalk draws on paper too.
    alsoFits: ["eimer-schwamm", "papier"],
    made: true,
  },
  {
    id: "xylofon-schlaegel",
    topic: "kita",
    name: "Xylofon",
    the: "das Xylofon",
    toThe: "zum Xylofon",
    partner: { name: "Schlägel", the: "die Schlägel", acc: "die Schlägel", plural: true },
    part: "two wooden xylophone mallets with round red heads",
    cast: "fox",
    before:
      "A Kita music corner with a soft round rug and a window. On the rug in the middle lies a toy xylophone with rainbow-coloured metal bars on a wooden frame. A fox child in a red sweater sits in front of it, its empty paws hovering over the bars, looking at them, brows raised, mouth a small o.",
    after: "The fox child now holds two wooden mallets with round red heads and plays on the colourful bars, laughing happily.",
    sounds: ["plink", "melody"],
  },
  {
    id: "perlen-schnur",
    topic: "kita",
    name: "Perlen",
    the: "die Perlen",
    toThe: "zu den Perlen",
    partner: { name: "Schnur", the: "die Schnur", acc: "die Schnur" },
    part: "a long red lace with a stiff tip",
    cast: "bear",
    before:
      "A Kita table by a window. In the middle a shallow bowl full of big colourful wooden beads, each with a hole through it. A bear child in a pink T-shirt sits at the table holding up one bead and looking through its hole, brows raised, mouth a small o; nothing else lies on the table.",
    after: "The bear child now threads the beads onto a long red lace, a row of colourful beads already on it like a necklace, and smiles happily.",
    sounds: ["click", "twinkle"],
    made: true,
  },
  {
    id: "bastelbild-klebestift",
    topic: "kita",
    name: "Bastelbild",
    the: "das Bastelbild",
    toThe: "zum Bastelbild",
    partner: { name: "Klebestift", the: "der Klebestift", acc: "den Klebestift" },
    part: "a white glue stick with a red cap, the cap off",
    cast: "bear",
    before:
      "A Kita craft table by a window. In the middle lies a big white sheet with a brown paper tree trunk on it – the tree has no crown yet; beside the sheet lie a few loose green paper leaves. A bear child in a striped T-shirt holds a green leaf against the sheet, but it slides off; it looks at the falling leaf, brows raised, mouth a small o.",
    after:
      "The bear child now rubs a white glue stick over the back of a leaf and presses it onto the sheet; several green leaves already stick round the trunk as a crown, and the child smiles happily.",
    sounds: ["swirl", "pop"],
    made: true,
  },
];
