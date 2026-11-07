import type { PaintedPair } from ".";

// The painted pairs of the topic „wetter“ (topics.ts); how to write one is in index.ts and the game's CLAUDE.md.

export const PAINTED: PaintedPair[] = [
  {
    id: "schneemann-karotte",
    topic: "wetter",
    name: "Schneemann",
    the: "der Schneemann",
    toThe: "zum Schneemann",
    partner: { name: "Karotte", the: "die Karotte", acc: "die Karotte", emoji: "🥕" },
    cast: "bear",
    before:
      "A snowy garden with a few snow-covered fir trees. In the middle a big snowman of three snowballs with coal eyes, a coal smile and twig arms – where its nose should be there is nothing. Beside it a little bear child in a red winter jacket, a woolly hat and mittens looks at the snowman's face, puzzled.",
    after: "An orange carrot now sits in the snowman's face as its nose. The bear child claps its mittens, laughing happily.",
    sounds: ["pop"],
    made: true,
  },
  {
    id: "regen-regenschirm",
    topic: "wetter",
    name: "Regen",
    the: "der Regen",
    toThe: "zum Regen",
    partner: { name: "Regenschirm", the: "der Regenschirm", acc: "den Regenschirm" },
    part: "an open red umbrella with a curved handle",
    cast: "fox",
    before:
      "A street on a grey rainy day: grey clouds, rain pouring down, a house front behind. In the middle a fox child in a light-blue T-shirt and dark blue trousers stands in the rain, getting wet, holding both empty paws over its head and looking up at the rain, unhappy.",
    after: "The fox child now holds an open red umbrella over its head; the raindrops bounce off it, and the fox child underneath is dry and smiles happily.",
    sounds: ["pop", "drops"],
    made: "frames",
    alsoFits: ["pfuetze-gummistiefel"],
  },
  {
    id: "pfuetze-gummistiefel",
    topic: "wetter",
    name: "Pfütze",
    the: "die Pfütze",
    toThe: "zur Pfütze",
    partner: { name: "Gummistiefel", the: "der Gummistiefel", acc: "den Gummistiefel" },
    part: "a pair of yellow rubber boots",
    cast: "bear",
    before:
      "A country path after the rain: wet grass at the sides, the grey sky clearing to blue. In the middle of the path a big brown puddle. A bear child in a red jumper and blue trousers stands in its white socks on a flat stone at the puddle's edge, one foot lifted as if to jump, looking at the puddle, puzzled.",
    after:
      "The bear child now wears a pair of yellow rubber boots and jumps into the middle of the puddle, the brown water splashing up high. The bear child laughs happily.",
    sounds: ["splash"],
    alsoFits: ["regen-regenschirm", "schuh-socken"],
  },
  {
    id: "sonne-sonnenbrille",
    topic: "wetter",
    name: "Sonne",
    the: "die Sonne",
    toThe: "zur Sonne",
    partner: { name: "Sonnenbrille", the: "die Sonnenbrille", acc: "die Sonnenbrille", emoji: "🕶️" },
    cast: "fox",
    before:
      "A bright summer meadow under a deep blue sky with a big, blazing yellow sun high up. In the middle a fox child in a white T-shirt and orange shorts squints hard against the bright sun, shading its eyes with one empty paw and blinking.",
    after: "The fox child now wears black sunglasses, looks up at the sun without squinting and smiles happily, both paws down.",
    sounds: ["pop", "twinkle"],
    // A cap shades the eyes from the sun too.
    alsoFits: ["zeitung-brille"],
  },
  {
    id: "schnee-schlitten",
    topic: "wetter",
    name: "Schnee",
    the: "der Schnee",
    toThe: "zum Schnee",
    partner: { name: "Schlitten", the: "der Schlitten", acc: "den Schlitten" },
    part: "a wooden sledge with red metal runners and a rope at its front",
    cast: "bear",
    before:
      "A snowy hill on a winter day with a few snow-covered fir trees beside it. At the top of the long white slope in the middle stands a bear child in a blue winter jacket and a red woolly hat, empty-pawed, looking down the slope, puzzled.",
    after: "The bear child now sits on a wooden sledge with red runners and slides down the slope, snow spraying up, laughing happily.",
    sounds: ["slide", "whoosh"],
    alsoFits: ["see-schlittschuhe", "schal-handschuhe"],
  },
  {
    id: "drachen-wind",
    topic: "wetter",
    name: "Drachen",
    the: "der Drachen",
    toThe: "zum Drachen",
    partner: { name: "Wind", the: "der Wind", acc: "den Wind", emoji: "💨" },
    cast: "fox",
    before:
      "A wide green meadow on a still, calm day: the grass stands straight, the leaves of a tree at the side hang still, a few clouds stand motionless in the blue sky. In the middle on the grass lies a colourful diamond-shaped kite with a long tail of bows, flat on the ground. A fox child in a yellow jumper and blue trousers holds the kite's string, which hangs slack, looking at the kite lying on the grass, puzzled.",
    after:
      "A strong wind now blows across the meadow, shown as white swirling wind lines coming from the left; the grass and the tree's leaves lean with it, and the kite flies high in the sky on its taut string. The fox child holds the string tight and laughs happily.",
    sounds: ["blow", "whoosh"],
  },
  {
    id: "see-schlittschuhe",
    topic: "wetter",
    name: "Zugefrorener See",
    the: "der zugefrorene See",
    toThe: "zum zugefrorenen See",
    partner: { name: "Schlittschuhe", the: "die Schlittschuhe", acc: "die Schlittschuhe", plural: true, emoji: "⛸️" },
    cast: "bear",
    before:
      "A frozen pond on a cold winter day, its ice smooth and light blue, snow on its banks and on a few bare trees. A bear child in a purple winter jacket, a woolly hat and plain brown boots stands at the edge of the ice, empty-pawed, looking out over the smooth ice, puzzled.",
    after: "The bear child now wears a pair of white ice skates with silver blades and glides across the ice on one leg, arms spread out, laughing happily.",
    sounds: ["slide", "twinkle"],
    // A sledge slides on the ice too.
    alsoFits: ["schnee-schlitten"],
  },
  {
    id: "schneeweg-schneeschieber",
    topic: "wetter",
    name: "Verschneiter Weg",
    the: "der verschneite Weg",
    toThe: "zum verschneiten Weg",
    partner: { name: "Schneeschieber", the: "der Schneeschieber", acc: "den Schneeschieber" },
    part: "a snow shovel with a wide red plastic blade and a long wooden handle",
    cast: "fox",
    before:
      "A house front on a winter morning: a wooden front door, and from the door to the garden gate a path buried under deep fresh snow. A fox child in a green snowsuit and a woolly hat and a grown-up fox in a red winter coat stand at the door, empty-pawed, looking at the deep snow on the path, puzzled.",
    after:
      "The fox child now pushes a snow shovel with a wide red blade along the path, the grown-up fox helping with one paw on the handle; a cleared strip of path lies behind them. Both smile happily.",
    sounds: ["crunch", "slide"],
  },
];
