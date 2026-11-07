import type { PaintedPair } from ".";

// The painted pairs of the topic „zuhause“ (topics.ts); how to write one is in index.ts and the game's CLAUDE.md.
// The bedroom, the living room, sweeping up and the little workbench: grown-ups' devices (computer, printer, TV remote)
// and furniture that lacks nothing by itself (a chair, a sofa, a window) were removed.

export const PAINTED: PaintedPair[] = [
  {
    id: "bett-teddy",
    topic: "zuhause",
    name: "Bett",
    the: "das Bett",
    toThe: "zum Bett",
    partner: { name: "Teddy", the: "der Teddy", acc: "den Teddy", emoji: "🧸" },
    cast: "bear",
    before:
      "A cosy children's room at night, the curtains closed, a small lamp glowing on the bedside table. In the middle a bed with a soft blanket and a pillow. A bear child in light-blue pyjamas lies in the bed, wide awake, its arms empty, looking at the empty place on the pillow beside it, sad and puzzled.",
    after: "The bear child now hugs a brown teddy bear in its arms, its eyes closing, and smiles happily.",
    sounds: ["rustle", "musicbox"],
  },
  {
    id: "zeitung-brille",
    topic: "zuhause",
    name: "Zeitung",
    the: "die Zeitung",
    toThe: "zur Zeitung",
    partner: { name: "Brille", the: "die Brille", acc: "die Brille", emoji: "👓" },
    cast: "fox",
    before:
      "A living room with an armchair and a little side table with a lamp. In the armchair sits a grown-up grandpa fox in a brown cardigan, holding a newspaper far out at arm's length and squinting at it; nothing sits on his nose. A fox child in a green T-shirt leans on the armrest beside him with empty paws, looking at the grandpa's squinting face, puzzled.",
    after:
      "Round black-rimmed reading glasses now sit on the grandpa fox's nose – the fox child has just put them there – and he reads the newspaper close up, the child looking into it with him; both smile happily.",
    sounds: ["rustle", "pop"],
    // Sunglasses look like reading glasses.
    alsoFits: ["sonne-sonnenbrille"],
  },
  {
    id: "schraube-schraubenzieher",
    topic: "zuhause",
    name: "Schraube",
    the: "die Schraube",
    toThe: "zur Schraube",
    partner: { name: "Schraubenzieher", the: "der Schraubenzieher", acc: "den Schraubenzieher" },
    part: "a big toy screwdriver with a chunky red plastic handle",
    cast: "bear",
    before:
      "A children's room with a toy workbench of colourful wood in the middle; one big yellow plastic screw sticks half out of its board. A bear child in blue dungarees stands at the bench with empty paws, pressing on the screw's head with one finger, looking at it, puzzled.",
    after: "The bear child now turns the screw into the board with a big toy screwdriver with a red handle, and smiles happily.",
    sounds: ["click", "squeak"],
    alsoFits: ["nagel-hammer"],
  },
  {
    id: "nagel-hammer",
    topic: "zuhause",
    name: "Nagel",
    the: "der Nagel",
    toThe: "zum Nagel",
    partner: { name: "Hammer", the: "der Hammer", acc: "den Hammer", emoji: "🔨" },
    cast: "fox",
    before:
      "A workshop corner with a wooden workbench. On it a little wooden birdhouse is being built: its roof board lies on top, and one big nail stands up out of the roof board, not yet in. A grown-up fox in a checked shirt holds the roof board steady with both paws; a fox child in a red T-shirt beside him has empty paws and looks at the nail sticking up, puzzled.",
    after:
      "The fox child now hits the nail with a hammer with a wooden handle and a grey metal head, the nail going down into the board; both foxes smile happily.",
    sounds: ["knocks"],
    alsoFits: ["schraube-schraubenzieher"],
  },
  {
    id: "besen-kehrschaufel",
    topic: "zuhause",
    name: "Besen",
    the: "der Besen",
    toThe: "zum Besen",
    partner: { name: "Kehrschaufel", the: "die Kehrschaufel", acc: "die Kehrschaufel" },
    part: "an orange dustpan with a short handle",
    cast: "fox",
    before:
      "A kitchen floor of light tiles with a little heap of breadcrumbs swept together in the middle. A fox child in a yellow T-shirt holds a broom upright beside the heap with one paw, its other paw empty, and looks at the heap, puzzled: where should the crumbs go?",
    after: "The fox child now sweeps the crumbs onto an orange dustpan, the floor clean, and smiles happily.",
    sounds: ["rustle", "clonk"],
    // The rake's leaves go onto the dustpan too.
    alsoFits: ["laub-rechen"],
  },
  {
    id: "roboter-batterie",
    topic: "zuhause",
    name: "Roboter",
    the: "der Roboter",
    toThe: "zum Roboter",
    partner: { name: "Batterie", the: "die Batterie", acc: "die Batterie" },
    part: "a cylindrical battery, black with a copper-coloured top",
    cast: "bear",
    before:
      "A children's room with a rug. In the middle stands a toy robot of red and silver tin, still, its eyes dark; a little flap on its chest is open, and the slot behind it is empty. A bear child in a green T-shirt kneels in front of it with empty paws, looking at the open flap, puzzled.",
    after:
      "A black battery with a copper-coloured top now lies in the robot's slot, the robot's eyes light up and it raises its arms; the bear child claps happily.",
    sounds: ["click", "beeps"],
  },
];
