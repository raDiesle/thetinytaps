import type { PaintedPair } from ".";

// The painted pairs of the topic „bad“ (topics.ts); how to write one is in index.ts and the game's CLAUDE.md.
// Soap, sponge, towel and the rubber duck belong loosely to the bath and to washing, so those name each other.
// Nobody showers or bathes in a picture: everyone wears clothes, so a child stands at the basin or kneels at the tub.

export const PAINTED: PaintedPair[] = [
  {
    id: "toilette-klopapier",
    topic: "bad",
    name: "Toilette",
    the: "die Toilette",
    toThe: "zur Toilette",
    wish: "Fertig auf der Toilette! Jetzt wollen wir uns abputzen.",
    partner: { name: "Klopapier", the: "das Klopapier", acc: "das Klopapier", emoji: "🧻" },
    cast: "bear",
    before:
      "A small bright bathroom with light tiles. In the middle a white toilet with its lid up; on the wall beside it a toilet roll holder – the holder is bare, nothing hangs on it. A little bear child in a striped T-shirt and dark blue trousers stands beside the toilet, one paw reaching towards the bare holder, looking at it, brows raised, mouth a small o.",
    after: "A white roll of toilet paper now hangs on the holder, a strip of it hanging down. The bear child tears off a piece and smiles happily.",
    sounds: ["rustle", "splash"],
    made: true,
  },
  {
    id: "wasserhahn-seife",
    topic: "bad",
    name: "Wasserhahn",
    the: "der Wasserhahn",
    toThe: "zum Wasserhahn",
    wish: "Die Pfoten sind voller Matsch. Wir wollen sie sauber waschen.",
    partner: { name: "Seife", the: "die Seife", acc: "die Seife", emoji: "🧼" },
    cast: "fox",
    before:
      "A bathroom washbasin under a mirror, its tap running with a stream of water, an empty white soap dish on the basin's edge. A fox child in a green T-shirt with rolled-up sleeves stands on a little step stool at the basin, holding its muddy brown paws under the water – the mud stays on – and looks at the empty soap dish, brows raised, mouth a small o.",
    after: "The fox child now rubs a pink bar of soap between its paws, white foam all over them, the mud washing away, and smiles happily.",
    sounds: ["trickle", "wash"],
    alsoFits: ["eimer-schwamm", "badewanne-badeente"],
    made: true,
  },
  {
    id: "eimer-schwamm",
    topic: "bad",
    name: "Eimer",
    the: "der Eimer",
    toThe: "zum Eimer",
    wish: "Lauter schmutzige Pfotenspuren! Wir wollen sie wegschrubben.",
    partner: { name: "Schwamm", the: "der Schwamm", acc: "den Schwamm", emoji: "🧽" },
    cast: "bear",
    before:
      "A bathroom with a white bathtub; muddy brown paw prints run across the tiled floor and up the tub's white side. On the floor in front of it a blue bucket full of soapy water with white foam on top. A bear child in yellow dungarees with rolled-up sleeves kneels beside the bucket with empty paws, looking at the muddy prints, brows raised, mouth a small o.",
    after:
      "The bear child now dips a big yellow sponge into the foam and scrubs the paw prints off the tub's side; half of them are gone already, and it smiles happily.",
    sounds: ["splash", "scrub"],
    // Soap scrubs too, the sponge goes into the bath, and a blackboard is wiped with it.
    alsoFits: ["wasserhahn-seife", "badewanne-badeente", "tafel-kreide"],
    made: true,
  },
  {
    id: "handtuchhalter-handtuch",
    topic: "bad",
    name: "Handtuchhalter",
    the: "der Handtuchhalter",
    toThe: "zum Handtuchhalter",
    wish: "Die Pfoten sind nass. Wir wollen sie abtrocknen.",
    partner: { name: "Handtuch", the: "das Handtuch", acc: "das Handtuch" },
    part: "a fluffy light-green hand towel, folded once",
    cast: "fox",
    before:
      "A bathroom washbasin with a mirror above it, its tap turned off. On the tiled wall beside the basin a towel rail – bare, nothing hangs on it. A fox child in a light-blue pyjama top stands at the basin holding up its dripping wet paws, water drops falling from them, and looks at the bare rail, brows raised, mouth a small o.",
    after: "A fluffy light-green towel now hangs from the rail, and the fox child dries its paws in it, smiling happily.",
    sounds: ["swirl", "rustle"],
    alsoFits: ["badewanne-badeente"],
    made: true,
  },
  {
    id: "badewanne-badeente",
    topic: "bad",
    name: "Badewanne",
    the: "die Badewanne",
    toThe: "zur Badewanne",
    wish: "Die Wanne ist voll. Wir wollen etwas schwimmen lassen.",
    partner: { name: "Badeente", the: "die Badeente", acc: "die Badeente" },
    part: "a yellow rubber duck with an orange beak",
    cast: "bear",
    before:
      "A cosy bathroom with light tiles and a little window. In the middle a white bathtub filled with warm water and a soft heap of white foam; between the foam the water lies calm and bare, nothing floats on it. A bear child in a white bathrobe kneels at the tub, its arms on the rim, looking at the bare water, brows raised, mouth a small o.",
    after: "A yellow rubber duck with an orange beak now floats on the water among the foam; the bear child pushes it along with one paw and laughs happily.",
    sounds: ["splash", "squeak"],
    // Soap, the sponge and the towel belong to the bath too.
    alsoFits: ["wasserhahn-seife", "eimer-schwamm", "handtuchhalter-handtuch"],
    made: true,
  },
];
