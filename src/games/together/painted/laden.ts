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
      "A pizzeria kitchen: a round brick pizza oven with a glowing fire inside, a wooden table in front with a raw pizza on it, topped with tomato and cheese. The pizza baker, a grown-up fox in a white chef's coat, a white chef's hat and a green neckerchief, stands at the table with empty paws, looking from the pizza to the hot oven, brows raised, mouth a small o.",
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
      "A cake shop's bright kitchen with shelves of cake tins behind. On the table in the middle a round chocolate cake, plain, nothing on top. The pastry cook, a grown-up bear woman with eyelashes in a light-pink chef's coat, a white chef's hat and an apron, stands behind it with empty paws, looking at the plain cake, brows raised, mouth a small o.",
    after: "The pastry cook now holds a piping bag and pipes white cream swirls onto the cake, a ring of them already on top, and smiles happily.",
    sounds: ["twinkle", "yum"],
    alsoFits: ["baecker"],
    made: true,
  },
  {
    id: "koch",
    topic: "laden",
    name: "Koch",
    the: "der Koch",
    toThe: "der Koch",
    partner: { name: "Schöpfkelle", the: "die Schöpfkelle", acc: "die Schöpfkelle" },
    part: "a silver soup ladle: a deep round bowl on a long handle with a hook at its end",
    cast: "both",
    before:
      "A restaurant kitchen with a steel counter. On the stove a big pot of steaming orange soup; on the counter a row of three empty white bowls. At the counter waits a fox child in a striped T-shirt, holding out an empty bowl and a spoon, hungry. The cook, a grown-up bear in a white chef's coat, a white chef's hat and a red neckerchief, stands at the pot with empty paws, looking from the soup to the empty bowls, brows raised, mouth a small o.",
    after: "The cook now ladles soup with a big silver ladle into the child's bowl; steam rises, and the child and the cook smile happily.",
    sounds: ["trickle", "yum"],
  },
  {
    id: "eisverkaeuferin",
    topic: "laden",
    name: "Eisverkäuferin",
    the: "die Eisverkäuferin",
    toThe: "die Eisverkäuferin",
    partner: { name: "Eisportionierer", the: "der Eisportionierer", acc: "den Eisportionierer" },
    part: "a silver ice-cream scoop: a round half-ball scoop on a short handle, with a little pink ice cream ball in it",
    cast: "both",
    before:
      "An ice-cream cart on a sunny beach under a striped sunshade, its glass top showing three open tubs of ice cream: pink strawberry, brown chocolate and yellow vanilla. In front of it a bear child in a sun hat holds up an empty waffle cone, waiting. The ice-cream seller, a grown-up fox woman with eyelashes in a pink-and-white striped shirt, a white cap and an apron, stands behind the cart with empty paws, looking from the tubs to the empty cone, brows raised, mouth a small o.",
    after:
      "The ice-cream seller now scoops a round ball of pink strawberry ice cream with a silver ice-cream scoop onto the child's cone; the child beams and she smiles happily.",
    sounds: ["ring", "yum"],
    made: "frames",
  },
  {
    id: "kassierer",
    topic: "laden",
    name: "Kassierer",
    the: "der Kassierer",
    toThe: "der Kassierer",
    partner: { name: "Kasse", the: "die Kasse", acc: "die Kasse" },
    part: "a shop till: a grey cash register with big round coloured buttons, a little screen without numbers and a cash drawer",
    cast: "both",
    before:
      "A small grocery shop with shelves of fruit and bread. At the checkout counter, whose top is bare and empty, a fox child stands with a basket of apples, a banana and bread, holding out a coin. The cashier, a grown-up bear in a blue shirt and a white apron, stands behind the bare counter with empty paws, looking at the basket, brows raised, mouth a small o.",
    after:
      "A grey cash register with big coloured buttons now stands on the counter; the cashier presses its buttons, its drawer opens, and the child drops its coin in. Both smile happily.",
    sounds: ["ding", "ring"],
    made: "frames",
    alsoFits: ["marktfrau"],
  },
  {
    id: "kellnerin",
    topic: "laden",
    name: "Kellnerin",
    the: "die Kellnerin",
    toThe: "die Kellnerin",
    partner: { name: "Tablett", the: "das Tablett", acc: "das Tablett" },
    part: "a round silver serving tray, empty",
    cast: "both",
    before:
      "A cosy café with little round tables. At one table in the back sits a bear child, waiting. On the counter in front stand three full cups of hot cocoa and a plate with a slice of cake. The waitress, a grown-up fox woman with eyelashes in a black dress with a white apron, stands at the counter with empty paws, looking from the many cups to the far table, brows raised, mouth a small o: too many to carry.",
    after:
      "The waitress now carries the three cups and the cake on a round silver tray to the child's table; the counter is empty, and the child and she smile happily.",
    sounds: ["clonk", "yum"],
    made: "frames",
  },
  {
    id: "marktfrau",
    topic: "laden",
    name: "Marktfrau",
    the: "die Marktfrau",
    toThe: "die Marktfrau",
    partner: { name: "Waage", the: "die Waage", acc: "die Waage" },
    part: "a red market scale: a flat silver pan on top of a red stand with a round dial without numbers",
    cast: "both",
    before:
      "A market stall under a green-and-white striped awning, with crates of red apples, carrots and pears; the corner of the stall's table in front is bare. A fox child with a little basket points at the apples. The market seller, a grown-up bear woman with eyelashes in a green apron and a yellow headscarf, holds a heap of apples in both paws, looking at them, brows raised, mouth a small o: how many does the child get?",
    after:
      "A red market scale now stands on the bare corner of the table, the apples on its silver pan and its needle turned; the market seller tips them into the child's basket. Both smile happily.",
    sounds: ["clonk", "ding"],
    alsoFits: ["kassierer"],
  },
  {
    id: "waffelbaeckerin",
    topic: "laden",
    name: "Waffelbäckerin",
    the: "die Waffelbäckerin",
    toThe: "die Waffelbäckerin",
    partner: { name: "Waffeleisen", the: "das Waffeleisen", acc: "das Waffeleisen" },
    part: "an open round waffle iron: two black round plates with heart-shaped hollows, hinged together, a handle on each",
    cast: "both",
    before:
      "A little waffle stand at a winter market with a wooden counter and a string of lights. On the counter a big bowl of golden batter with a ladle in it and an empty plate. A bear child in a red woolly hat stands at the counter holding the empty plate's edge, waiting. The waffle baker, a grown-up fox woman with eyelashes in a cream-coloured apron and a red headband, stands behind the counter with empty paws, looking at the batter, brows raised, mouth a small o.",
    after:
      "An open round waffle iron now stands on the counter, a golden heart-shaped waffle steaming in it; the waffle baker lifts the waffle onto the child's plate. Both smile happily.",
    sounds: ["sizzle", "yum"],
  },
];
