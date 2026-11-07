import type { PaintedPair } from ".";

// The painted pairs of the topic „hof“ (topics.ts); how to write one is in index.ts and the game's CLAUDE.md.

export const PAINTED: PaintedPair[] = [
  {
    id: "baeuerin",
    topic: "hof",
    name: "Bäuerin",
    the: "die Bäuerin",
    toThe: "die Bäuerin",
    partner: { name: "Traktor", the: "der Traktor", acc: "den Traktor", emoji: "🚜" },
    cast: "fox",
    before:
      "A farm: a red barn in the back, and in front a big brown field, its first rows ploughed. At the edge of the field stands a heavy iron plough, nothing hitched to it. The farmer, a grown-up fox woman with eyelashes in an orange shirt, blue dungarees and a straw hat, stands beside the plough with empty paws, looking at the big field, brows raised, mouth a small o: far too heavy to pull.",
    after:
      "A tractor with big black back wheels now stands hitched to the plough and pulls it over the field, the farmer at its wheel; new furrows lie behind it. She smiles happily.",
    sounds: ["engine"],
    alsoFits: ["reiterin", "bauer", "maehdrescherfahrer"],
    made: true,
  },
  {
    id: "gaertner",
    topic: "hof",
    name: "Gärtner",
    the: "der Gärtner",
    toThe: "der Gärtner",
    partner: { name: "Rasenmäher", the: "der Rasenmäher", acc: "den Rasenmäher" },
    part: "a red push lawn mower: a low body on four wheels with a long bent handle",
    cast: "fox",
    before:
      "A garden with a little garden shed and flower beds. In the middle a lawn of tall shaggy grass, so high it reaches the gardener's knees, a ball half hidden in it. The gardener, a grown-up fox in a light-green shirt, a dark-green apron and a straw hat, stands in the tall grass with empty paws, looking at it, brows raised, mouth a small o.",
    after:
      "The gardener now pushes a red lawn mower over the lawn; behind it lies a wide stripe of short neat grass, and the ball can be seen. He smiles happily.",
    sounds: ["engine", "whirr"],
    made: true,
  },
  {
    id: "imkerin",
    topic: "hof",
    name: "Imkerin",
    the: "die Imkerin",
    toThe: "die Imkerin",
    partner: { name: "Bienenkorb", the: "der Bienenkorb", acc: "den Bienenkorb" },
    part: "a straw beehive: a bell-shaped woven straw basket with a small entrance hole at its bottom",
    cast: "bear",
    before:
      "A flower meadow with an old apple tree. From one low branch hangs a big buzzing cluster of bees, more bees flying round it, with nowhere to live. The beekeeper, a grown-up bear woman with eyelashes in a white beekeeper's suit and a wide hat with a net veil, stands under the branch with empty paws, looking at the cluster of bees, brows raised, mouth a small o.",
    after:
      "The beekeeper now holds a bell-shaped straw beehive under the branch, and the bees fly into it through its little hole; the branch is nearly empty. She smiles happily under her veil.",
    sounds: ["buzz", "thump"],
    made: true,
  },
  {
    id: "holzfaeller",
    topic: "hof",
    name: "Holzfäller",
    the: "der Holzfäller",
    toThe: "der Holzfäller",
    partner: { name: "Axt", the: "die Axt", acc: "die Axt", emoji: "🪓" },
    cast: "bear",
    before:
      "A forest clearing with tall fir trees round it and an empty woodshed. In the middle a thick tree stump used as a chopping block, a big round log standing on it, whole. The woodcutter, a grown-up bear in a red-and-black checked shirt and a dark woolly hat, stands at the chopping block with empty paws, looking at the log, brows raised, mouth a small o.",
    after: "The woodcutter now swings an axe with a wooden handle down onto the log, and it splits in two halves that fall to the sides. He smiles happily.",
    sounds: ["knock", "knock", "creak"],
    alsoFits: ["tischlerin"],
    made: true,
  },
  {
    id: "bauer",
    topic: "hof",
    name: "Bauer",
    the: "der Bauer",
    toThe: "der Bauer",
    partner: { name: "Milcheimer", the: "der Milcheimer", acc: "den Milcheimer" },
    part: "a shiny metal milk pail with a curved handle, a little white milk in it",
    cast: "bear",
    before:
      "Inside a cow barn with straw on the floor and a wooden manger. In the middle a black-and-white cow with a big full udder, waiting to be milked. The farmer, a grown-up bear in a checked shirt, green dungarees and a cap, sits on a little three-legged stool beside the cow's udder with empty paws, looking under the cow at the straw, brows raised, mouth a small o.",
    after:
      "The farmer now milks the cow into a shiny metal milk pail standing under the udder, white milk splashing into it. The cow and the farmer look happy.",
    sounds: ["trickle", "drops"],
    alsoFits: ["baeuerin", "maehdrescherfahrer", "pferdepflegerin"],
    made: true,
  },
  {
    id: "schaefer",
    topic: "hof",
    name: "Schäfer",
    the: "der Schäfer",
    toThe: "der Schäfer",
    partner: { name: "Hütehund", the: "der Hütehund", acc: "den Hütehund" },
    part: "a black-and-white sheepdog standing alert, one front paw raised",
    cast: "fox",
    before:
      "A wide green hilly meadow with a wooden sheep pen on the right, its gate open. Five white sheep are scattered all over the meadow, far apart, grazing in every direction. The shepherd, a grown-up fox in a brown coat and a wide-brimmed hat, stands in the middle with empty paws spread, looking at the scattered sheep, brows raised, mouth a small o.",
    after:
      "A black-and-white sheepdog now runs round the sheep and herds them together towards the open pen, two of them already inside. The shepherd smiles happily.",
    sounds: ["whistle", "hop"],
    alsoFits: ["polizistin"],
    made: true,
  },
  {
    id: "obstbaeuerin",
    topic: "hof",
    name: "Obstbäuerin",
    the: "die Obstbäuerin",
    toThe: "die Obstbäuerin",
    partner: { name: "Leiter", the: "die Leiter", acc: "die Leiter", emoji: "🪜" },
    cast: "fox",
    before:
      "An orchard on a sunny day. In the middle a tall apple tree full of red apples, all hanging high up in its crown; under it an empty wicker basket. The fruit farmer, a grown-up fox woman with eyelashes in a yellow blouse, a green apron and a sun hat, stands under the tree stretching up with empty paws, far too short to reach the apples, brows raised, mouth a small o.",
    after: "A wooden ladder now leans against the tree; the fruit farmer stands on it and picks the red apples, the basket half full. She smiles happily.",
    sounds: ["rustle", "plop"],
    alsoFits: ["feuerwehrfrau", "elektrikerin", "fensterputzer"],
    made: true,
  },
  {
    id: "pferdepflegerin",
    topic: "hof",
    name: "Pferdepflegerin",
    the: "die Pferdepflegerin",
    toThe: "die Pferdepflegerin",
    partner: { name: "Heugabel", the: "die Heugabel", acc: "die Heugabel" },
    part: "a pitchfork: a long wooden handle with three long curved metal prongs",
    cast: "bear",
    before:
      "Inside a horse stable: a brown horse looks hungrily over its stall door at its empty wooden manger. In the corner of the stable lies a big heap of golden hay, too big to carry. The stable keeper, a grown-up bear woman with eyelashes in a blue jacket, riding boots and a green cap, stands between the hay and the manger with empty paws, looking at the hay, brows raised, mouth a small o.",
    after: "The stable keeper now forks hay from the heap into the manger with a pitchfork; the horse munches happily and she smiles.",
    sounds: ["rustle", "munch"],
    alsoFits: ["bauer"],
    made: true,
  },
  {
    id: "maehdrescherfahrer",
    topic: "hof",
    name: "Mähdrescherfahrer",
    the: "der Mähdrescherfahrer",
    toThe: "der Mähdrescherfahrer",
    partner: { name: "Mähdrescher", the: "der Mähdrescher", acc: "den Mähdrescher" },
    part: "a green combine harvester seen from the side: a big body with a cab on top and a wide reel with blades at its front",
    cast: "fox",
    before:
      "A wide field of tall ripe golden wheat in late summer, a farmhouse far behind it. At the edge of the field stands the farmer, a grown-up fox in a blue shirt, brown dungarees and a cap, with empty paws, looking at all the ripe wheat, brows raised, mouth a small o.",
    after:
      "A green combine harvester now drives through the wheat, its wide reel turning at its front, the fox in its high cab; behind it lies a stripe of cut stubble. He smiles happily.",
    sounds: ["engine", "rustle"],
    alsoFits: ["baeuerin", "bauer"],
    made: true,
  },
];
