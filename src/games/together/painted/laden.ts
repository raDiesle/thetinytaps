import type { PaintedPair } from ".";

// The painted pairs of the topic „laden“ (topics.ts); how to write one is in index.ts and the game's CLAUDE.md.

export const PAINTED: PaintedPair[] = [
  {
    id: "pizzabaecker",
    topic: "laden",
    name: "Pizzabäcker",
    the: "der Pizzabäcker",
    toThe: "der Pizzabäcker",
    partner: { name: "Pizzaschieber", the: "der Pizzaschieber", acc: "den Pizzaschieber" },
    part: "a wooden pizza peel: a wide flat round wooden paddle on a long handle, lying diagonally, empty",
    cast: "fox",
    before:
      "A pizzeria kitchen: a round brick pizza oven with a glowing fire inside, a wooden table in front with a raw pizza on it, topped with tomato and cheese. The pizza baker, a grown-up fox in a white chef's coat, a white chef's hat and a green neckerchief, stands at the table with empty paws, looking from the pizza to the hot oven, puzzled.",
    after:
      "The pizza baker now holds a long wooden pizza peel with the pizza on it and slides it into the oven, smiling happily. The table is empty now: only ONE pizza in the whole picture.",
    sounds: ["whoosh", "crackle"],
    alsoFits: ["baecker"],
    made: true,
  },
  {
    id: "konditorin",
    topic: "laden",
    name: "Konditorin",
    the: "die Konditorin",
    toThe: "die Konditorin",
    partner: { name: "Spritzbeutel", the: "der Spritzbeutel", acc: "den Spritzbeutel" },
    part: "a baker's piping bag: a white cone-shaped cloth bag filled with cream, a metal star nozzle at its tip, a little cream swirl coming out",
    cast: "bear",
    before:
      "A cake shop's bright kitchen with shelves of cake tins behind. On the table in the middle a round chocolate cake, plain, nothing on top. The pastry cook, a grown-up bear woman with eyelashes in a light-pink chef's coat, a white chef's hat and an apron, stands behind it with empty paws, looking at the plain cake, puzzled.",
    after: "The pastry cook now holds a piping bag and pipes white cream swirls onto the cake, a ring of them already on top, and smiles happily.",
    sounds: ["twinkle", "yum"],
    alsoFits: ["baecker"],
    made: true,
  },
];
