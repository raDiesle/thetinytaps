import type { PaintedPair } from ".";

// The painted pairs of the topic „kueche“ (topics.ts); how to write one is in index.ts and the game's CLAUDE.md.

export const PAINTED: PaintedPair[] = [
  {
    id: "saftpresse-orange",
    topic: "kueche",
    name: "Saftpresse",
    the: "die Saftpresse",
    toThe: "zur Saftpresse",
    partner: { name: "Orange", the: "die Orange", acc: "die Orange", emoji: "🍊" },
    cast: "bear",
    before:
      "A kitchen counter in front of a tiled wall with a window. On the counter in the middle: a glass citrus juicer (a ribbed cone on a little bowl), empty, and beside it an empty drinking glass. A little bear child in a light-blue T-shirt and dark blue trousers stands at the counter, holding up the empty glass and looking at the empty juicer, brows raised, mouth a small o.",
    after:
      "Half an orange is now pressed down on the juicer's cone, the other orange half lies beside it, and the glass is full of orange juice. The bear child drinks from the glass, smiling happily.",
    sounds: ["squeak", "glug"],
    made: true,
  },
  {
    id: "muesli-milch",
    topic: "kueche",
    name: "Müsli",
    the: "das Müsli",
    toThe: "zum Müsli",
    partner: { name: "Milch", the: "die Milch", acc: "die Milch", emoji: "🥛" },
    cast: "fox",
    before:
      "A breakfast table by a sunny window. On the table in the middle a bowl of dry muesli flakes with a spoon standing in it. A fox child in pyjamas with little stars sits at the table, one paw on the spoon, looking into the dry bowl, brows raised, mouth a small o.",
    after: "The fox child now pours milk from a glass of milk over the flakes, the bowl filling up white, and smiles happily.",
    sounds: ["glug", "trickle"],
    // Milk goes into the empty teacup too, and a spoon belongs to muesli.
    alsoFits: ["tasse-teekanne", "suppe-loeffel"],
    made: true,
  },
  {
    id: "tasse-teekanne",
    topic: "kueche",
    name: "Tasse",
    the: "die Tasse",
    toThe: "zur Tasse",
    partner: { name: "Teekanne", the: "die Teekanne", acc: "die Teekanne" },
    part: "a round white teapot with blue dots",
    cast: "bear",
    before:
      "A little tea table with a lace tablecloth in a cosy living room. On it an empty white teacup on its saucer. A bear child in a pink T-shirt sits at the table holding the empty cup up and looking into it, brows raised, mouth a small o; opposite sits a grown-up grandma bear in a lilac cardigan with empty paws.",
    after: "Grandma bear now pours steaming tea from a round white teapot with blue dots into the child's cup; both smile happily.",
    sounds: ["trickle"],
    alsoFits: ["muesli-milch"],
    made: true,
  },
  {
    id: "suppe-loeffel",
    topic: "kueche",
    name: "Suppe",
    the: "die Suppe",
    toThe: "zur Suppe",
    partner: { name: "Löffel", the: "der Löffel", acc: "den Löffel", emoji: "🥄" },
    cast: "fox",
    before:
      "A kitchen table with a checked tablecloth. In the middle a deep bowl of steaming noodle soup with peas. A fox child in a red T-shirt sits in front of it with empty paws, looking at the hot soup, brows raised, mouth a small o.",
    after: "The fox child now holds a silver spoon, scoops up some soup and blows on it, smiling happily.",
    sounds: ["plop", "yum"],
    // A spoon is for muesli and the egg too, and the handmade pot is stirred with it.
    alsoFits: ["muesli-milch", "eierbecher-ei", "topf"],
    made: true,
  },
  {
    id: "pausenbrot-brotdose",
    topic: "kueche",
    name: "Pausenbrot",
    the: "das Pausenbrot",
    toThe: "zum Pausenbrot",
    partner: { name: "Brotdose", the: "die Brotdose", acc: "die Brotdose" },
    part: "a closed green plastic lunch box with a click lid",
    cast: "bear",
    before:
      "A kitchen counter in the morning sun. On a wooden board in the middle lies a sandwich cut into two halves. A bear child in a green jacket, ready to go out, stands at the counter with empty paws, looking at the sandwich, brows raised, mouth a small o: how to take it along?",
    after: "The bear child now puts the sandwich halves into a green plastic lunch box and clicks its lid shut, smiling happily.",
    sounds: ["plop", "click"],
    // The lunch box goes into the school bag.
    alsoFits: ["schule-schulranzen", "picknickdecke-picknickkorb"],
    made: true,
  },
  {
    id: "pfanne-pfannenwender",
    topic: "kueche",
    name: "Pfanne",
    the: "die Pfanne",
    toThe: "zur Pfanne",
    partner: { name: "Pfannenwender", the: "der Pfannenwender", acc: "den Pfannenwender" },
    part: "a kitchen turner: a wide silver slotted blade on a wooden handle",
    cast: "fox",
    before:
      "A kitchen stove with a frying pan on it; in the pan a pancake, its top side still pale, its edges turning golden. A grown-up fox in an apron stands at the stove, a fox child in a yellow T-shirt on a little step beside him; both have empty paws and look at the pancake, brows raised, mouth a small o.",
    after:
      "The fox child now holds a kitchen turner with a silver slotted blade, the blade under the pancake in the pan, lifting it a little so its golden underside shows; the grown-up fox's paw lies over the child's paw on the handle. Both laugh happily.",
    sounds: ["sizzle", "whoosh"],
    fromFirst: true,
    made: true,
  },
  {
    id: "toaster-toast",
    topic: "kueche",
    name: "Toaster",
    the: "der Toaster",
    toThe: "zum Toaster",
    partner: { name: "Toast", the: "der Toast", acc: "den Toast" },
    part: "a golden-brown slice of toast",
    cast: "bear",
    before:
      "A breakfast counter in a kitchen with a jar of jam on it. In the middle a shiny silver toaster, its two slots empty, its lever up. A bear child in pyjamas holds up an empty plate, looking into the empty slots, brows raised, mouth a small o.",
    after: "Two golden-brown slices of toast now pop up out of the toaster's slots, and the bear child catches one on its plate, smiling happily.",
    sounds: ["click", "pop"],
    made: true,
  },
  {
    id: "eierbecher-ei",
    topic: "kueche",
    name: "Eierbecher",
    the: "der Eierbecher",
    toThe: "zum Eierbecher",
    partner: { name: "Ei", the: "das Ei", acc: "das Ei" },
    // Not 🥚: the Easter egg of „feste“ has that emoji.
    part: "a brown egg",
    cast: "fox",
    before:
      "A breakfast table by a window. In the middle a yellow egg cup on a little plate – empty, its hollow bare. A fox child in a blue pyjama sits at the table with empty paws, looking into the empty egg cup, brows raised, mouth a small o.",
    after: "A brown egg now stands in the egg cup, and the fox child taps its top with a little spoon, smiling happily.",
    sounds: ["knock", "yum"],
    alsoFits: ["suppe-loeffel"],
    made: true,
  },
  {
    id: "teig-ausstecher",
    topic: "kueche",
    name: "Teig",
    the: "der Teig",
    toThe: "zum Teig",
    partner: { name: "Ausstecher", the: "der Ausstecher", acc: "den Ausstecher" },
    part: "a metal star-shaped cookie cutter",
    cast: "bear",
    before:
      "A kitchen table dusted with flour. In the middle a big sheet of rolled-out cookie dough, smooth and whole, a rolling pin lying beside it and an empty baking tray. A bear child in a red apron sits at the table with floury empty paws, looking at the smooth dough, brows raised, mouth a small o.",
    after:
      "The bear child now presses a metal star-shaped cookie cutter into the dough; star-shaped holes are in the dough and a few dough stars lie on the baking tray, and the child smiles happily.",
    sounds: ["stamp", "yum"],
    made: true,
  },
  {
    id: "hochstuhl-laetzchen",
    topic: "kueche",
    name: "Hochstuhl",
    the: "der Hochstuhl",
    toThe: "zum Hochstuhl",
    partner: { name: "Lätzchen", the: "das Lätzchen", acc: "das Lätzchen" },
    part: "a light-blue bib with white dots and two ties",
    cast: "fox",
    before:
      "A kitchen with a wooden high chair in the middle. In it sits a little fox child in a clean white T-shirt, a bowl of spaghetti with red tomato sauce on its tray and a little fork in its paw; a drop of red sauce has just fallen onto the white T-shirt. The fox child looks down at the red spot on its shirt, brows raised, mouth a small o.",
    after: "A light-blue bib with white dots now hangs round the fox child's neck, covering the T-shirt, and the child eats on happily, sauce on its chin.",
    sounds: ["rustle", "yum"],
    made: true,
  },
];
