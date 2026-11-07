import type { PaintedPair } from ".";

// The painted pairs of the topic „musik“ (topics.ts); how to write one is in index.ts and the game's CLAUDE.md.
// Each player is named by their own instrument (der Gitarrist, die Trompeterin), never just „Musiker“, whom every
// instrument would fit. In `before` they are only „the musician“: a word like „guitarist“ would get its guitar drawn.

export const PAINTED: PaintedPair[] = [
  {
    id: "gitarrist",
    topic: "musik",
    name: "Gitarrist",
    the: "der Gitarrist",
    toThe: "der Gitarrist",
    partner: { name: "Gitarre", the: "die Gitarre", acc: "die Gitarre", emoji: "🎸" },
    cast: "both",
    before:
      "A small wooden open-air stage in a park, colourful bunting strung above it and a wooden stool in its middle. On a bench in front of the stage sits a little bear child in a red T-shirt, waiting, its paws ready to clap. On the stool sits the musician, a grown-up fox in a purple shirt with a yellow scarf, his empty paws resting on his knees, looking down at his empty lap, brows raised, mouth a small o.",
    after: "The musician now holds a red guitar on his lap and strums its strings, singing, his eyes happily half closed. The bear child claps and laughs.",
    sounds: ["plink", "melody"],
    // A guitarist may sing into a microphone too.
    alsoFits: ["saengerin"],
    made: true,
  },
  {
    id: "saengerin",
    topic: "musik",
    name: "Sängerin",
    the: "die Sängerin",
    toThe: "die Sängerin",
    partner: { name: "Mikrofon", the: "das Mikrofon", acc: "das Mikrofon", emoji: "🎤" },
    cast: "both",
    before:
      "A theatre stage with red velvet curtains drawn open and a round spotlight on the floor in its middle. Below the stage, in the front row, sits a little fox child in a green jumper on a red seat, waiting. In the spotlight stands the singer, a grown-up bear woman with eyelashes in a long pink dress with a yellow collar, her empty paws held in front of her chest, looking at them, brows raised, mouth a small o.",
    after:
      "The singer now holds a black handheld microphone with a round silver head close to her mouth and sings, her eyes happy. The fox child listens, smiling and swaying.",
    sounds: ["trill", "melody"],
    alsoFits: ["gitarrist"],
    made: true,
  },
  {
    id: "trommler",
    topic: "musik",
    name: "Trommler",
    the: "der Trommler",
    toThe: "der Trommler",
    partner: { name: "Trommel", the: "die Trommel", acc: "die Trommel", emoji: "🥁" },
    cast: "both",
    before:
      "A town street on a festival day, colourful bunting strung between the houses. On the pavement stands a little fox child holding a small flag, waiting for the parade. In the middle of the street stands the musician, a grown-up bear in a blue marching-band uniform with golden buttons and a tall white hat with a red plume; a white strap hangs empty across his chest, and he looks at his empty paws, brows raised, mouth a small o.",
    after:
      "A red drum with a white top now hangs from the strap at his hip, and he marches and beats it with two drumsticks, smiling proudly. The fox child waves its flag and laughs.",
    sounds: ["drum", "drum", "drum"],
    made: true,
  },
  {
    id: "trompeterin",
    topic: "musik",
    name: "Trompeterin",
    the: "die Trompeterin",
    toThe: "die Trompeterin",
    partner: { name: "Trompete", the: "die Trompete", acc: "die Trompete", emoji: "🎺" },
    cast: "fox",
    before:
      "The top of a castle tower with a waving pennant, the morning sun rising over green hills behind. Down in the castle courtyard flags and a long festive table wait for the feast. At the tower's battlement stands the musician, a grown-up fox woman with eyelashes in a red uniform jacket with golden buttons and a dark-blue beret, her paws empty, looking at them, brows raised, mouth a small o.",
    after: "The musician now holds a shining golden trumpet to her mouth and blows it towards the hills, cheeks puffed, eyes happy.",
    sounds: ["tusch"],
    made: true,
  },
  {
    id: "geiger",
    topic: "musik",
    name: "Geiger",
    the: "der Geiger",
    toThe: "der Geiger",
    partner: { name: "Geige", the: "die Geige", acc: "die Geige", emoji: "🎻" },
    cast: "both",
    before:
      "A small concert hall: a wooden stage with a music stand holding open sheet music, rows of red seats below it. In the front row sits a little fox child, waiting. On the stage beside the music stand stands the musician, a grown-up bear in a black tailcoat with a white bow tie, his paws empty, looking from them to the sheet music, brows raised, mouth a small o.",
    after:
      "The musician now holds a brown violin under his chin and draws its bow across the strings, his eyes happily closed. The fox child listens, smiling.",
    sounds: ["melody"],
    made: true,
  },
  {
    id: "pianistin",
    topic: "musik",
    name: "Pianistin",
    the: "die Pianistin",
    toThe: "die Pianistin",
    partner: { name: "Klavier", the: "das Klavier", acc: "das Klavier" },
    part: "a shiny black grand piano with its lid propped open and its black and white keys, black and white only, no other colour",
    cast: "both",
    before:
      "A festive hall with garlands and a polished wooden floor. In its middle stands a round black stool all alone, a big empty space in front of it, no piano anywhere. On a chair at the side sits a little bear child in a party hat, waiting. Nothing floats above anyone's head. On the stool sits the musician, a grown-up fox woman with eyelashes in a lilac dress with a white collar, her empty paws in her lap, looking at the empty space in front of her, brows raised, mouth a small o.",
    after:
      "A shiny black grand piano now stands in front of the stool, its lid propped open; the musician, still on the stool, plays its black and white keys, smiling. The bear child bobs along happily.",
    sounds: ["plink", "melody"],
    made: "part",
  },
  {
    id: "akkordeonspieler",
    topic: "musik",
    name: "Akkordeonspieler",
    the: "der Akkordeonspieler",
    toThe: "der Akkordeonspieler",
    partner: { name: "Akkordeon", the: "das Akkordeon", acc: "das Akkordeon", emoji: "🪗" },
    cast: "both",
    before:
      "A harbour quay on a sunny day: stacked wooden crates, a red-and-white lighthouse in the distance, seagulls sitting on wooden posts by the water. On the quay stands a little fox child in a striped sailor shirt, ready to dance. In front of the crates stands the musician, a grown-up bear in a blue-and-white striped shirt and a black beret, his paws empty, looking at them, brows raised, mouth a small o.",
    after:
      "The musician now holds a red accordion with white keys at his chest and pulls its pleated bellows wide as he plays, smiling. The fox child dances and laughs.",
    sounds: ["melody"],
    made: true,
  },
  {
    id: "saxofonistin",
    topic: "musik",
    name: "Saxofonistin",
    the: "die Saxofonistin",
    toThe: "die Saxofonistin",
    partner: { name: "Saxofon", the: "das Saxofon", acc: "das Saxofon", emoji: "🎷" },
    cast: "both",
    before:
      "A cosy street corner in the evening: cobblestones, a glowing street lamp, the lit window of a café behind. A little bear child in a yellow raincoat stands nearby, waiting, looking up at her. Under the street lamp stands the musician, a grown-up fox woman with eyelashes in a black jacket with a golden scarf, her paws empty, looking at them, brows raised, mouth a small o.",
    after: "The musician now holds a golden saxophone and plays it, cheeks round, eyes happy. The bear child sways along, smiling.",
    sounds: ["melody"],
    fromFirst: true,
    made: true,
  },
  {
    id: "floetenspieler",
    topic: "musik",
    name: "Flötenspieler",
    the: "der Flötenspieler",
    toThe: "der Flötenspieler",
    partner: { name: "Blockflöte", the: "die Blockflöte", acc: "die Blockflöte" },
    part: "a light-wood recorder with a row of finger holes",
    cast: "bear",
    before:
      "A summer meadow with flowers and a wooden fence; three little songbirds sit quietly in a row on the fence, looking at him. In front of the fence stands the musician, a grown-up bear in a green shirt with a white collar and a straw hat, his paws empty, looking at the silent birds, brows raised, mouth a small o.",
    after:
      "The musician now holds a light-wood recorder to his mouth and plays it, his fingers on its holes, smiling. The three birds sing along with open beaks.",
    sounds: ["trill", "melody"],
    made: true,
  },
  {
    id: "harfenspielerin",
    topic: "musik",
    name: "Harfenspielerin",
    the: "die Harfenspielerin",
    toThe: "die Harfenspielerin",
    partner: { name: "Harfe", the: "die Harfe", acc: "die Harfe" },
    part: "a tall golden harp with many thin strings",
    cast: "both",
    before:
      "A castle hall with tall arched windows and a red carpet; a carved golden stool stands in its middle, an empty space beside it. On a cushion in front sits a little fox child, waiting. On the stool sits the musician, a grown-up bear woman with eyelashes in a long flowing light-blue dress with a flower wreath in her hair, her empty paws in her lap, looking at the empty space beside her, brows raised, mouth a small o.",
    after:
      "A tall golden harp with many strings now stands beside the stool; the musician, still on the stool, plucks its strings with both paws, smiling. The fox child listens dreamily.",
    sounds: ["plink", "melody"],
    fromFirst: true,
    made: true,
  },
  {
    id: "xylofonspieler",
    topic: "musik",
    name: "Xylofonspieler",
    the: "der Xylofonspieler",
    toThe: "der Xylofonspieler",
    partner: { name: "Xylofon", the: "das Xylofon", acc: "das Xylofon" },
    part: "a wooden xylophone with rainbow-coloured bars and two mallets lying on it",
    cast: "both",
    before:
      "A bright kindergarten room: a round rug with two floor cushions, a red one and a blue one, a window with a potted plant behind. On the cushions sit a little bear child and a little fox child, waiting. Kneeling on the rug in front of them is the music teacher, a grown-up fox in an orange jumper with a green neckerchief, his paws empty, looking at the empty spot on the rug in front of him, brows raised, mouth a small o.",
    after:
      "A wooden xylophone with rainbow-coloured bars now lies on the rug in front of him, and he taps its bars with two mallets, smiling. The two children clap happily.",
    sounds: ["plink", "melody"],
    made: true,
  },
  {
    id: "tubaspieler",
    topic: "musik",
    name: "Tubaspieler",
    the: "der Tubaspieler",
    toThe: "der Tubaspieler",
    partner: { name: "Tuba", the: "die Tuba", acc: "die Tuba" },
    part: "a big shining golden tuba with a wide bell",
    cast: "both",
    before:
      "A park with a round white bandstand under green trees, bunting hanging from its roof and a music stand on it. On the grass in front sits a little fox child on a picnic blanket, waiting. On the bandstand stands the musician, a grown-up bear in a red band uniform with golden buttons and a peaked cap, his paws empty, looking at them, brows raised, mouth a small o.",
    after:
      "The musician now holds a big shining golden tuba in his arms, its wide bell pointing up over his shoulder, and blows it, cheeks round, eyes happy. The fox child bounces along, laughing.",
    sounds: ["hum", "melody"],
    made: true,
  },
  {
    id: "jongleur",
    topic: "musik",
    name: "Jongleur",
    the: "der Jongleur",
    toThe: "der Jongleur",
    partner: { name: "Jonglierbälle", the: "die Jonglierbälle", acc: "die Jonglierbälle", plural: true },
    part: "three juggling balls: one red, one yellow, one blue",
    cast: "both",
    before:
      "Inside a red-and-white striped circus tent: a round ring with a low red edge, a spotlight on its middle, a row of benches behind. On the front bench sits a little bear child, waiting. In the middle of the ring stands the circus artist, a grown-up fox in a yellow-and-green diamond-patterned costume with a white ruffled collar, his empty paws held open in front of him, looking at them, brows raised, mouth a small o.",
    after: "The circus artist now juggles three balls – a red, a yellow and a blue one – in an arc above his paws, smiling. The bear child claps and laughs.",
    sounds: ["boing", "clap"],
    // A child might juggle a football, a basketball or tennis balls too.
    alsoFits: ["fussballerin", "basketballspieler", "tennisspielerin"],
    made: true,
  },
  {
    id: "puppenspielerin",
    topic: "musik",
    name: "Puppenspielerin",
    the: "die Puppenspielerin",
    toThe: "die Puppenspielerin",
    partner: { name: "Handpuppe", the: "die Handpuppe", acc: "die Handpuppe" },
    part: "a hand puppet: a jolly fellow with a big smile, a round red nose, a red pointed cap with a little bell and a yellow-and-red costume",
    cast: "both",
    before:
      "A little puppet theatre: a wooden booth with red-and-white striped sides and a small stage window high up in it, its curtain open and the window empty. On a low bench in front sit a little fox child and a little bear child, waiting. Beside the booth stands the puppeteer, a grown-up bear woman with eyelashes in a green dress with a yellow scarf, her paws empty, looking up at the empty stage window, brows raised, mouth a small o.",
    after:
      "The puppeteer now stands behind the booth, only her head showing above it, and a hand puppet on her raised paw – a jolly fellow with a red pointed cap with a bell and a yellow-and-red costume – waves out of the stage window. The two children laugh.",
    sounds: ["giggle", "boing"],
    made: true,
  },
];
