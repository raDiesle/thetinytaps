import type { PaintedPair } from ".";

// The painted pairs of the topic „feste“ (topics.ts); how to write one is in index.ts and the game's CLAUDE.md.

export const PAINTED: PaintedPair[] = [
  {
    id: "torte-kerze",
    topic: "feste",
    name: "Torte",
    the: "die Torte",
    toThe: "zur Torte",
    partner: { name: "Kerzen", the: "die Kerzen", acc: "die Kerzen", plural: true },
    part: "three thin birthday candles with spiral stripes in pink, yellow and light blue, each with a small flame, standing together – no cake, no holder, no plate",
    cast: "fox",
    before:
      "A birthday party: a table with a light tablecloth, a paper garland of little flags on the wall behind. On the table in the middle a big round birthday cake with white icing and strawberries on top – nothing stands on it. Behind the table a fox child in a paper party hat and a light-blue T-shirt looks at the cake, puzzled, one paw at its chin.",
    after:
      "Three thin birthday candles with spiral stripes now stand on top of the cake, each with a small burning flame. The fox child smiles happily with shining eyes, cheeks puffed, about to blow.",
    sounds: ["clonk", "twinkle"],
    alsoFits: ["tannenbaum-weihnachtsstern"],
    made: true,
  },
  {
    id: "tannenbaum-weihnachtsstern",
    topic: "feste",
    name: "Tannenbaum",
    the: "der Tannenbaum",
    toThe: "zum Tannenbaum",
    partner: { name: "Weihnachtsstern", the: "der Weihnachtsstern", acc: "den Weihnachtsstern", emoji: "🌟" },
    cast: "fox",
    before:
      "A cosy living room at Christmas with a window showing falling snow outside. In the middle a big Christmas tree decorated with red and golden baubles and a garland; the very tip of its top is bare. A grown-up fox in a red jumper lifts a fox child in green pyjamas up towards the top of the tree; the child's paws are empty, and both look at the bare tip, puzzled.",
    after: "The fox child now puts a big shining golden star onto the tree's tip, and it glows. The child and the grown-up fox smile happily.",
    sounds: ["twinkle", "chime"],
    // Candles would go on a Christmas tree too.
    alsoFits: ["torte-kerze"],
  },
  {
    id: "osterei-pinsel",
    topic: "feste",
    name: "Osterei",
    the: "das Osterei",
    toThe: "zum Osterei",
    partner: { name: "Pinsel", the: "der Pinsel", acc: "den Pinsel" },
    part: "a thin paintbrush with a wooden handle, a little red paint on its bristles",
    cast: "bear",
    before:
      "A kitchen table at Easter, a window with spring sunshine behind. In the middle a plain white egg in an egg cup, beside it three little open pots of paint: red, blue and yellow. A bear child in a striped T-shirt and a little apron sits at the table with empty paws, looking at the white egg and the paint pots, puzzled.",
    after: "The bear child now holds a thin paintbrush with a wooden handle and paints colourful stripes and dots on the egg, smiling happily.",
    sounds: ["swirl"],
    // The handmade paper's crayons would colour an egg too, and the Easter nest's eggs are painted ones.
    alsoFits: ["papier", "osternest-ostereier"],
  },
  {
    id: "laterne-licht",
    topic: "feste",
    name: "Laterne",
    the: "die Laterne",
    toThe: "zur Laterne",
    partner: { name: "Licht", the: "das Licht", acc: "das Licht", emoji: "💡" },
    cast: "fox",
    before:
      "St. Martin's evening on a street: the sky dark blue, the dark shapes of houses and trees behind. In the middle a fox child in a warm jacket and a woolly hat holds up a round orange paper lantern on a thin stick; the lantern is dark inside. The child looks at the dark lantern, puzzled. Everything around is dark.",
    after:
      "A small yellow light bulb now glows inside the lantern, seen through its thin paper, and the lantern shines warm orange in the dark. The fox child smiles happily, holding it up high.",
    sounds: ["click", "chime"],
    // The birthday candles, the campfire's flame and the torch would light a lantern too.
    alsoFits: ["torte-kerze", "feuerstelle-feuer", "zelt-taschenlampe"],
  },
  {
    id: "blumenstrauss-vase",
    topic: "feste",
    name: "Blumenstrauß",
    the: "der Blumenstrauß",
    toThe: "zum Blumenstrauß",
    partner: { name: "Vase", the: "die Vase", acc: "die Vase" },
    part: "a tall blue glass vase",
    cast: "bear",
    before:
      "A sunny living room, a window behind and a table with a white tablecloth. In the middle of the table a bunch of colourful tulips and daisies tied with a ribbon lies flat, its flower heads beginning to droop. A bear child in a light-blue T-shirt stands at the table with empty paws, looking at the drooping flowers, puzzled.",
    after: "The flowers now stand upright and fresh in a tall blue glass vase full of water. The bear child smiles happily, both paws on the vase.",
    sounds: ["rustle", "plop"],
    // The handmade flower's watering can would water a bouquet too.
    alsoFits: ["blume"],
  },
  {
    id: "osternest-ostereier",
    topic: "feste",
    name: "Osternest",
    the: "das Osternest",
    toThe: "zum Osternest",
    partner: { name: "Ostereier", the: "die Ostereier", acc: "die Ostereier", plural: true },
    part: "three colourful Easter eggs painted with stripes and dots",
    cast: "fox",
    before:
      "A spring garden with green grass, a bush and yellow daffodils. In the middle in the grass a round nest of straw, empty. A fox child in a light-green T-shirt kneels beside it with empty paws, looking into the empty nest, puzzled.",
    after: "Three colourful Easter eggs painted with stripes and dots now lie in the nest, and the fox child points at them, smiling happily.",
    sounds: ["plop", "twinkle"],
    alsoFits: ["osterei-pinsel"],
  },
  {
    id: "plaetzchenteig-ausstechform",
    topic: "feste",
    name: "Plätzchenteig",
    the: "der Plätzchenteig",
    toThe: "zum Plätzchenteig",
    partner: { name: "Ausstechform", the: "die Ausstechform", acc: "die Ausstechform" },
    part: "a star-shaped metal biscuit cutter",
    cast: "bear",
    before:
      "A kitchen at Christmas time, a window with snow outside. On the table in the middle a smooth rolled-out sheet of biscuit dough on a floured board, a rolling pin beside it and an empty baking tray. A bear child in a red apron stands at the table with empty paws beside a grown-up bear in a green apron; both look at the plain dough, puzzled.",
    after:
      "The bear child now presses a star-shaped metal biscuit cutter into the dough; star-shaped biscuits lie on the baking tray, and star-shaped holes are left in the dough. Both bears smile happily.",
    sounds: ["stamp", "yum"],
  },
  {
    id: "clownskostuem-clownsnase",
    topic: "feste",
    name: "Clownskostüm",
    the: "das Clownskostüm",
    toThe: "zum Clownskostüm",
    partner: { name: "Clownsnase", the: "die Clownsnase", acc: "die Clownsnase" },
    part: "a round red foam clown nose",
    cast: "fox",
    before:
      "A children's room on carnival day with colourful paper streamers on the wall. In the middle a fox child in a colourful clown costume with big dots, a ruffled collar and a small pointed clown hat stands touching its own plain dark nose with one empty paw, puzzled.",
    after: "The fox child now wears a round red clown nose over its own nose and laughs happily, arms spread out.",
    sounds: ["boing", "giggle"],
    // A red nose could be a snowman's nose too.
    alsoFits: ["schneemann-karotte"],
  },
];
