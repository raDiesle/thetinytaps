import type { PaintedPair } from ".";

// The painted pairs of the topic „kleidung“ (topics.ts); how to write one is in index.ts and the game's CLAUDE.md.
// Only what plainly lacks one thing: a child dressed for the snow but with bare paws, a shoe with empty holes – never
// a piece of clothing that goes with many others (a T-shirt with trousers, skirt or shorts; a jacket with a cap, hat or
// scarf), which were removed. Weather gear (umbrella, rain boots, sunglasses) is the topic „wetter“'s.

export const PAINTED: PaintedPair[] = [
  {
    id: "schuh-socken",
    topic: "kleidung",
    name: "Schuh",
    the: "der Schuh",
    toThe: "zum Schuh",
    partner: { name: "Socken", the: "die Socken", acc: "die Socken", plural: true },
    part: "a pair of red-and-white striped socks",
    cast: "bear",
    before:
      "A hallway with coat hooks on the wall and a low wooden shoe bench. On the bench sits a bear child in a blue T-shirt and red trousers, its feet bare, holding a small white sneaker in its paws and looking at its bare toes, brows raised, mouth a small o.",
    after: "The bear child now wears a pair of red-and-white striped socks and pulls the sneaker on over one of them, smiling happily.",
    sounds: ["rustle", "pop"],
    made: "frames",
    // Laces go with a shoe too, and the rain boot is a shoe.
    alsoFits: ["turnschuh-schnuersenkel", "pfuetze-gummistiefel"],
  },
  {
    id: "schal-handschuhe",
    topic: "kleidung",
    name: "Schal",
    the: "der Schal",
    toThe: "zum Schal",
    partner: { name: "Handschuhe", the: "die Handschuhe", acc: "die Handschuhe", plural: true },
    part: "a pair of red woolly gloves",
    cast: "fox",
    before:
      "A snowy garden with a snow-covered fence and a few snowballs on the ground. In the middle stands a fox child in a blue winter jacket, a red woolly hat and a long red scarf; its paws are bare and red from the cold, it holds them up and blows on them, looking at them, brows raised, mouth a small o.",
    after: "The fox child now wears a pair of red woolly gloves and pats a snowball, laughing happily.",
    sounds: ["rustle", "pop"],
    made: "frames",
    // Gloves go with the snow too.
    alsoFits: ["schnee-schlitten"],
  },
  {
    id: "turnschuh-schnuersenkel",
    topic: "kleidung",
    name: "Turnschuh",
    the: "der Turnschuh",
    toThe: "zum Turnschuh",
    partner: { name: "Schnürsenkel", the: "die Schnürsenkel", acc: "die Schnürsenkel", plural: true },
    part: "a pair of red shoelaces, loosely coiled",
    cast: "fox",
    before:
      "A children's room with a bed and a toy shelf. On the edge of the bed sits a fox child in a yellow T-shirt, blue trousers and striped socks. In its paws it holds a white sneaker: the little holes along its front are all empty, its tongue flops open. The fox child looks at the shoe, brows raised, mouth a small o.",
    after: "Red shoelaces now run criss-cross through the sneaker's holes, tied in a bow; the fox child wears the sneaker and smiles happily.",
    sounds: ["swirl", "pop"],
    alsoFits: ["schuh-socken"],
  },
  {
    id: "hose-guertel",
    topic: "kleidung",
    name: "Hose",
    the: "die Hose",
    toThe: "zur Hose",
    partner: { name: "Gürtel", the: "der Gürtel", acc: "den Gürtel" },
    part: "a brown leather belt with a silver buckle",
    cast: "bear",
    before:
      "A bedroom with a wardrobe and a tall mirror. In front of the mirror stands a bear child in a white T-shirt and a pair of blue trousers far too wide for it, slipping down; it holds them up at its waist with both paws and looks down at them, brows raised, mouth a small o.",
    after: "A brown belt with a silver buckle now holds the trousers up round the bear child's waist; the child holds both paws up free and laughs happily.",
    sounds: ["click", "giggle"],
  },
  {
    id: "buegelbrett-buegeleisen",
    topic: "kleidung",
    name: "Bügelbrett",
    the: "das Bügelbrett",
    toThe: "zum Bügelbrett",
    partner: { name: "Bügeleisen", the: "das Bügeleisen", acc: "das Bügeleisen" },
    part: "a light-blue steam iron",
    cast: "bear",
    before:
      "A living room corner with an ironing board standing in the middle; on it lies a child's little red party shirt, all crumpled. A grown-up bear in a pink cardigan stands behind the board with empty paws, and a bear child in a yellow vest beside it points at its crumpled shirt; both look at it, brows raised, mouth a small o.",
    after:
      "The grown-up bear now glides a light-blue steam iron over the shirt, half of it already smooth, a little puff of steam rising; the bear child watches and smiles happily.",
    sounds: ["hiss"],
  },
];
