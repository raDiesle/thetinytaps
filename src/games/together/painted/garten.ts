import type { PaintedPair } from ".";

// The painted pairs of the topic „garten“ (topics.ts); how to write one is in index.ts and the game's CLAUDE.md.

export const PAINTED: PaintedPair[] = [
  {
    id: "feuerstelle-feuer",
    topic: "garten",
    name: "Feuerstelle",
    the: "die Feuerstelle",
    toThe: "zur Feuerstelle",
    partner: { name: "Feuer", the: "das Feuer", acc: "das Feuer", emoji: "🔥" },
    cast: "both",
    before:
      "Evening at the edge of a forest, the sky deep blue with the last light of the day. In the middle a ring of round stones on the ground with firewood logs stacked in it like a little tent – cold: no fire, no flame, no smoke, no glow. Around it, on fallen tree trunks, sit exactly four characters: on the left a grown-up fox in a green sweater with a fox child in a light-blue T-shirt beside it, on the right a grown-up bear in a pink cardigan with a bear child in a yellow T-shirt beside it. Each has a blanket round the shoulders; they shiver a little and look at the cold stack of wood, waiting.",
    after:
      "The firewood in the stone ring now burns as a bright, cosy campfire with orange flames, and its warm light falls on everyone. All four smile happily and hold their paws out towards the warm fire.",
    sounds: ["crackle"],
    alsoFits: ["laterne-licht"],
    made: true,
  },
  {
    id: "laub-rechen",
    topic: "garten",
    name: "Laub",
    the: "das Laub",
    toThe: "zum Laub",
    partner: { name: "Rechen", the: "der Rechen", acc: "den Rechen" },
    part: "a garden rake: a long wooden handle and a wide metal head with a row of tines",
    cast: "fox",
    before:
      "An autumn garden with a wooden fence and a tree that has lost most of its leaves. In the middle the lawn is covered all over with orange, red and yellow fallen leaves, an empty wheelbarrow at the side. A fox child in a mustard-yellow jumper, brown trousers and sturdy shoes stands among the leaves with empty paws, looking at the leaf-covered lawn, brows raised, mouth a small o.",
    after:
      "The fox child now holds a garden rake with a long wooden handle and a metal head with tines and rakes the leaves into a big pile; a strip of green lawn shows behind it. The fox child smiles happily.",
    sounds: ["leaves", "rustle"],
    alsoFits: ["besen-kehrschaufel"],
  },
  {
    id: "zelt-taschenlampe",
    topic: "garten",
    name: "Zelt",
    the: "das Zelt",
    toThe: "zum Zelt",
    partner: { name: "Taschenlampe", the: "die Taschenlampe", acc: "die Taschenlampe" },
    part: "a grey hand torch, switched on, a short yellow beam at its front",
    cast: "bear",
    before:
      "Night in a garden: a dark blue sky without moon, the dark shapes of a hedge and a tree. In the middle a small orange tent with its door open; inside it is pitch dark. A bear child in striped pyjamas kneels at the tent's open door with empty paws, peering into the dark inside, brows raised, mouth a small o. Everything is dark and dim.",
    after:
      "The bear child now holds a grey torch whose yellow beam shines into the tent and lights up a rolled-out blue sleeping bag inside. The bear child smiles happily.",
    sounds: ["click", "chime"],
    alsoFits: ["feuerstelle-feuer", "laterne-licht"],
  },
  {
    id: "apfelbaum-leiter",
    topic: "garten",
    name: "Apfelbaum",
    the: "der Apfelbaum",
    toThe: "zum Apfelbaum",
    partner: { name: "Leiter", the: "die Leiter", acc: "die Leiter" },
    part: "a wooden ladder with round rungs, standing upright",
    cast: "fox",
    before:
      "A garden meadow on a sunny autumn day. In the middle a big apple tree, its crown full of red apples, all hanging high up; the tree stands alone on the grass. Under it a fox child in a red jumper and blue dungarees stretches up on tiptoe with empty paws, far too small to reach the apples; beside it a grown-up fox in a green cardigan looks up at the apples, brows raised, mouth a small o.",
    after:
      "A wooden ladder now leans against the tree's trunk; the fox child stands on it, the grown-up fox holds the ladder steady, and the child picks a red apple. Both smile happily.",
    sounds: ["creak", "pop"],
  },
  {
    id: "planschbecken-gartenschlauch",
    topic: "garten",
    name: "Planschbecken",
    the: "das Planschbecken",
    toThe: "zum Planschbecken",
    partner: { name: "Gartenschlauch", the: "der Gartenschlauch", acc: "den Gartenschlauch" },
    part: "a green garden hose in a loose coil with a yellow spray nozzle at its end",
    cast: "bear",
    before:
      "A sunny garden lawn in summer with a hedge behind. In the middle a round blue inflatable paddling pool, empty and dry inside. A bear child in a yellow swim shirt and red swim shorts stands beside it with empty paws, looking into the empty pool, brows raised, mouth a small o.",
    after:
      "The bear child now holds a green garden hose and fills the pool with a stream of water from its yellow nozzle; the pool is half full, and the bear child laughs happily.",
    sounds: ["trickle", "splash"],
    made: "frames",
    // The watering can would fill the pool too, and the hose water the flower.
    alsoFits: ["blume"],
  },
  {
    id: "rasen-rasenmaeher",
    topic: "garten",
    name: "Rasen",
    the: "der Rasen",
    toThe: "zum Rasen",
    partner: { name: "Rasenmäher", the: "der Rasenmäher", acc: "den Rasenmäher" },
    part: "a red push lawn mower with black wheels and a long handle",
    cast: "bear",
    before:
      "A garden in summer with a wooden fence behind. In the middle the lawn has grown long and shaggy, up to the knees of a bear child in a blue T-shirt and green shorts who stands in it with empty paws beside a grown-up bear in red dungarees; both look at the long grass, brows raised, mouth a small o.",
    after:
      "The bear child and the grown-up bear now push a red lawn mower together, their paws on its handle; behind it lies a wide strip of short, neatly cut grass. Both smile happily.",
    sounds: ["engine", "whirr"],
  },
  {
    id: "waescheleine-waescheklammern",
    topic: "garten",
    name: "Wäscheleine",
    the: "die Wäscheleine",
    toThe: "zur Wäscheleine",
    partner: { name: "Wäscheklammern", the: "die Wäscheklammern", acc: "die Wäscheklammern", plural: true },
    part: "two wooden clothes pegs with little metal springs",
    cast: "fox",
    before:
      "A sunny garden with a washing line stretched between two wooden posts; the line is bare. Below it a blue plastic laundry basket of wet clothes. In the middle a fox child in a pink T-shirt and blue trousers holds a wet red T-shirt up against the line with both paws, looking at the bare line, brows raised, mouth a small o: as soon as it lets go, the shirt will fall.",
    after:
      "The fox child now pinches two wooden clothes pegs onto the line, and the red T-shirt hangs from them, swinging in the breeze. The fox child smiles happily.",
    sounds: ["snap", "whoosh"],
    made: "frames",
  },
  {
    id: "picknickdecke-picknickkorb",
    topic: "garten",
    name: "Picknickdecke",
    the: "die Picknickdecke",
    toThe: "zur Picknickdecke",
    partner: { name: "Picknickkorb", the: "der Picknickkorb", acc: "den Picknickkorb" },
    part: "a wicker picnic basket with two lids and a handle, a red-and-white checked cloth peeking out",
    cast: "both",
    before:
      "A park meadow on a sunny day with a big leafy tree behind. In the middle a red-and-white checked blanket spread on the grass, bare. On it sit a fox child in a green T-shirt and a bear child in an orange T-shirt, their empty paws in their laps, looking at the bare blanket, hungry and unsure.",
    after:
      "A wicker picnic basket now stands open on the blanket, sandwiches and red apples coming out of it; the fox child and the bear child each hold a sandwich and smile happily.",
    sounds: ["creak", "munch"],
    made: "frames",
    alsoFits: ["pausenbrot-brotdose"],
  },
];
