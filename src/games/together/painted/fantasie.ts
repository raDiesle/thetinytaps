import type { PaintedPair } from ".";

// The painted pairs of the topic „fantasie“ (topics.ts); how to write one is in index.ts and the game's CLAUDE.md.

export const PAINTED: PaintedPair[] = [
  {
    id: "weihnachtsmann",
    topic: "fantasie",
    name: "Weihnachtsmann",
    the: "der Weihnachtsmann",
    toThe: "der Weihnachtsmann",
    partner: { name: "Rentier", the: "das Rentier", acc: "das Rentier", emoji: "🦌" },
    cast: "fox",
    before:
      "A snowy field at night with a few snow-covered fir trees and snowflakes falling. In the middle a red wooden sleigh loaded with wrapped presents; in front of it its empty leather harness lies on the snow, nothing tied to it. In the sleigh sits Father Christmas, a grown-up fox in a red coat with white fur trim, a red hat and a black belt, holding the slack reins and looking unsure at the empty harness: the sleigh can't move.",
    after:
      "A brown reindeer with antlers now stands harnessed in the empty harness in front of the sleigh, pulling it, and the sleigh glides over the snow. Father Christmas fox laughs happily and waves.",
    sounds: ["bells"],
    made: true,
  },
  {
    id: "zwerg",
    topic: "fantasie",
    name: "Zwerg",
    the: "der Zwerg",
    toThe: "der Zwerg",
    partner: { name: "Spitzhacke", the: "die Spitzhacke", acc: "die Spitzhacke", emoji: "⛏️" },
    cast: "bear",
    before:
      "Inside a mine: a tunnel held up by wooden beams, a lantern hanging from a beam, rails on the ground with an empty wooden mine cart on them. Colourful gems glitter in the rock wall. The dwarf, a grown-up bear in a green coat, a brown belt and a tall red pointed hat, stands at the rock wall with empty paws, looking at the gems in the rock, brows raised, mouth a small o.",
    after: "The dwarf now swings a pickaxe against the rock wall; some gems have broken out and lie in the mine cart. The dwarf smiles happily.",
    sounds: ["knock", "knock", "twinkle"],
    alsoFits: ["hoehlenforscher", "bauarbeiterin"],
    made: true,
  },
  {
    id: "koenig",
    topic: "fantasie",
    name: "König",
    the: "der König",
    toThe: "der König",
    partner: { name: "Krone", the: "die Krone", acc: "die Krone", emoji: "👑" },
    cast: "bear",
    before:
      "A throne room with red banners on the stone walls and a red carpet leading up to a golden throne. Beside the throne stands a little table with an empty red velvet cushion on it. On the throne sits the king, a grown-up bear in a purple robe and a red cape trimmed with white fur, his head bare, one paw feeling the top of his bare head, looking at the empty cushion, brows raised, mouth a small o.",
    after: "A golden crown with red jewels now sits on the king's head; he sits up proudly and smiles. The cushion stays empty.",
    sounds: ["clonk", "twinkle"],
    // A king may carry a shield too.
    alsoFits: ["ritter"],
  },
  {
    id: "ritter",
    topic: "fantasie",
    name: "Ritter",
    the: "der Ritter",
    toThe: "der Ritter",
    partner: { name: "Schild", the: "der Schild", acc: "den Schild" },
    part: "a knight's shield: blue with a silver rim and a big golden star on it (no cross, no letters)",
    cast: "fox",
    before:
      "Green grass in front of a castle gate with two towers and flags. On the left sits a small friendly green dragon, playfully puffing a little orange flame towards the knight. The knight, a grown-up fox in silver armour with a blue cape, stands with both empty paws raised in front of his face, peeking at the little flame, brows raised, mouth a small o.",
    after:
      "The knight now holds a blue shield with a silver rim and a big golden star in front of him, and the little flame bounces off it harmlessly; the knight laughs and the dragon giggles.",
    sounds: ["clonk", "giggle"],
    // A king may carry the shield, and a knight rides a horse.
    alsoFits: ["koenig", "reiterin"],
  },
  {
    id: "fee",
    topic: "fantasie",
    name: "Fee",
    the: "die Fee",
    toThe: "die Fee",
    partner: { name: "Zauberstab", the: "der Zauberstab", acc: "den Zauberstab" },
    part: "a slim white magic wand with a little golden star at its tip",
    cast: "fox",
    before:
      "A garden at night under a full moon, a big round orange pumpkin lying on the grass in the middle. Beside the pumpkin stands the fairy, a grown-up fox woman with eyelashes in a pink dress with gauzy lilac wings and a flower wreath in her hair, her paws empty, looking at the pumpkin, brows raised, mouth a small o.",
    after:
      "The fairy now points a slim white magic wand with a little golden star at its tip at the pumpkin, and the pumpkin has turned into a round golden coach with little windows. The fairy smiles happily.",
    sounds: ["twinkle", "chime"],
    made: "frames",
    // A magician and a witch may have a wand too; the princess's coach stands in the second picture.
    alsoFits: ["zauberkuenstler", "hexe", "prinzessin"],
  },
  {
    id: "zauberkuenstler",
    topic: "fantasie",
    name: "Zauberkünstler",
    the: "der Zauberkünstler",
    toThe: "der Zauberkünstler",
    partner: { name: "Zylinder", the: "der Zylinder", acc: "den Zylinder", emoji: "🎩" },
    cast: "both",
    before:
      "A small stage with red curtains and a spotlight; on it a little round table covered with a red cloth down to the floor, nothing on it. On a bench in front of the stage sits a little bear child, waiting. Behind the table stands the magician, a grown-up fox in a black tailcoat with a red bow tie, his head bare, his empty paws spread over the empty table, brows raised, mouth a small o.",
    after:
      "The magician now holds a black top hat upside down on the table, and a little white rabbit peeks out of it; the magician beams and the bear child claps, laughing.",
    sounds: ["poof", "drumRoll"],
    alsoFits: ["fee"],
  },
  {
    id: "hexe",
    topic: "fantasie",
    name: "Hexe",
    the: "die Hexe",
    toThe: "die Hexe",
    partner: { name: "Besen", the: "der Besen", acc: "den Besen", emoji: "🧹" },
    cast: "bear",
    before:
      "A hilltop at night under a big full moon and stars, a crooked little wooden cottage with a crooked chimney behind, a black cat sitting ready on a stone, looking up at the moon. In front of the cottage stands the witch, a grown-up bear woman with eyelashes in a purple dress, a tall black pointed hat and a green scarf, her paws empty, looking at them, brows raised, mouth a small o.",
    after:
      "The witch now sits astride a broom – a wooden stick with a bundle of straw bristles – and flies up past the moon with the black cat sitting behind her; both laugh.",
    sounds: ["whoosh", "giggle"],
    made: true,
    // A witch may have a wand too, and brooms sweep chimneys and floors.
    alsoFits: ["fee", "schornsteinfeger", "raumpflegerin", "strassenkehrer"],
  },
  {
    id: "pirat",
    topic: "fantasie",
    name: "Pirat",
    the: "der Pirat",
    toThe: "der Pirat",
    partner: { name: "Schatzkarte", the: "die Schatzkarte", acc: "die Schatzkarte" },
    part: "an old treasure map: yellowed paper with torn edges, a little palm tree and a red X drawn on it",
    cast: "fox",
    before:
      "A small sandy island with two palm trees and a big grey rock, the blue sea all round. A wooden spade stands stuck in the sand. In the middle stands the pirate, a grown-up fox in a white shirt, a black waistcoat, a red bandana and an eye patch, his paws empty, looking round the island, brows raised, mouth a small o: where should he dig?",
    after:
      "The pirate now holds an old treasure map with a palm tree and a red X on it in one paw and points with the other at the big rock; at its foot the lid of a treasure chest peeks out of the sand. He grins happily.",
    sounds: ["rustle", "twinkle"],
    made: "frames",
    // A pirate sails a ship, drops an anchor and looks through a telescope.
    alsoFits: ["kapitaen", "matrose", "sternguckerin"],
  },
  {
    id: "detektivin",
    topic: "fantasie",
    name: "Detektivin",
    the: "die Detektivin",
    toThe: "die Detektivin",
    partner: { name: "Lupe", the: "die Lupe", acc: "die Lupe", emoji: "🔍" },
    cast: "bear",
    before:
      "A garden path after the rain: a trail of tiny muddy paw prints leads across it to a big flowerpot, the tip of a grey cat's tail just peeking out behind the pot. The detective, a grown-up bear woman with eyelashes in a beige trench coat and a brown checked cap, bends over the tiny paw prints, squinting, her paws empty, brows raised, mouth a small o: they are so small.",
    after:
      "The detective now holds a big magnifying glass with a black handle over the paw prints, one eye big behind the glass, and follows the trail, smiling. A little grey kitten peeks out from behind the flowerpot.",
    sounds: ["slide", "tick"],
    made: true,
    // A microscope or a torch may help a detective look too.
    alsoFits: ["forscherin", "hoehlenforscher"],
  },
  {
    id: "sternguckerin",
    topic: "fantasie",
    name: "Sternguckerin",
    the: "die Sternguckerin",
    toThe: "die Sternguckerin",
    partner: { name: "Fernrohr", the: "das Fernrohr", acc: "das Fernrohr" },
    part: "a telescope: a long blue tube on a three-legged wooden stand",
    cast: "fox",
    before:
      "A hilltop at night, a dark-blue sky full of stars and a big round moon far away. A wooden bench stands on the hill. Beside the bench stands a grown-up fox woman with eyelashes in a blue coat, a yellow bobble hat and a yellow scarf, her paws empty, squinting up at the far moon, brows raised, mouth a small o.",
    after: "She now looks through a telescope – a long blue tube on a three-legged wooden stand – pointed up at the moon, and smiles in wonder.",
    sounds: ["twinkle"],
    made: true,
    // A pirate and a captain look through one too, and a rocket flies to the moon.
    alsoFits: ["pirat", "kapitaen", "astronautin"],
  },
  {
    id: "hoehlenforscher",
    topic: "fantasie",
    name: "Höhlenforscher",
    the: "der Höhlenforscher",
    toThe: "der Höhlenforscher",
    partner: { name: "Taschenlampe", the: "die Taschenlampe", acc: "die Taschenlampe", emoji: "🔦" },
    cast: "fox",
    before:
      "The entrance of a cave in a rocky mountainside; inside the cave it is pitch dark, only a faint glitter deep in the darkness. At the entrance stands the cave explorer, a grown-up fox in a grey overall with brown straps and a plain yellow helmet, his paws empty, peering into the dark, brows raised, mouth a small o.",
    after:
      "The explorer now holds a black torch and shines its bright beam into the cave: purple and blue crystals sparkle on the cave walls, and the fox smiles in wonder.",
    sounds: ["click", "twinkle"],
    // A detective may search with a torch, and the dwarf's pickaxe fits a cave too.
    alsoFits: ["detektivin", "zwerg"],
  },
  {
    id: "abenteurerin",
    topic: "fantasie",
    name: "Abenteurerin",
    the: "die Abenteurerin",
    toThe: "die Abenteurerin",
    partner: { name: "Zelt", the: "das Zelt", acc: "das Zelt" },
    part: "a small orange tent with its door flap open",
    cast: "bear",
    before:
      "A forest clearing in the evening, the sky turning orange behind the trees, a small campfire burning in a ring of stones, a big backpack lying on the grass. Beside the fire stands a grown-up bear woman with eyelashes in a green jacket and an orange bobble hat, yawning, her paws empty, looking at the empty grass beside the fire, brows raised, mouth a small o: where will she sleep?",
    after: "A small orange tent now stands on the grass beside the fire, its door open; she kneels at its entrance, ready to crawl in, smiling sleepily.",
    sounds: ["rustle", "thump"],
    // A warm duvet is for sleeping too.
    alsoFits: ["frau-holle"],
  },
  {
    id: "ballonfahrerin",
    topic: "fantasie",
    name: "Ballonfahrerin",
    the: "die Ballonfahrerin",
    toThe: "die Ballonfahrerin",
    partner: { name: "Heißluftballon", the: "der Heißluftballon", acc: "den Heißluftballon" },
    part: "a big red-and-yellow striped hot-air balloon",
    cast: "bear",
    before:
      "A green meadow on a hill on a sunny morning, a wide blue sky with a few clouds. On the meadow stands a big wicker basket with a gas burner on a frame above it, loose ropes hanging from its corners. In the basket stands a grown-up bear woman with eyelashes in a yellow jacket, a brown leather flying cap and a red scarf, her paws empty, looking up at the empty sky above the basket, brows raised, mouth a small o.",
    after:
      "A big red-and-yellow striped hot-air balloon now fills the sky above the basket, tied to its ropes, and lifts the basket off the meadow; she waves happily from it.",
    sounds: ["hiss", "whoosh"],
    made: true,
  },
  {
    id: "prinzessin",
    topic: "fantasie",
    name: "Prinzessin",
    the: "die Prinzessin",
    toThe: "die Prinzessin",
    partner: { name: "Kutsche", the: "die Kutsche", acc: "die Kutsche" },
    part: "a golden coach with round windows and big wheels, pulled by a white horse",
    cast: "fox",
    before:
      "A country road in the evening, winding up a long green hill to a castle far away with lit windows and flags. At the foot of the hill stands the princess, a grown-up fox woman with eyelashes in a long pink ball gown and a small golden tiara, her paws empty, looking up the long road at the far castle, brows raised, mouth a small o: it is such a long way.",
    after:
      "A golden coach with round windows and big wheels, pulled by a white horse, now stands on the road; the princess sits in it and waves happily from its window as it sets off towards the castle.",
    sounds: ["neigh", "hop"],
    made: "frames",
    // A horse could carry her there, and the fairy's pumpkin turns into such a coach.
    alsoFits: ["reiterin", "fee"],
  },
  {
    id: "sandmann",
    topic: "fantasie",
    name: "Sandmann",
    the: "der Sandmann",
    toThe: "der Sandmann",
    partner: { name: "Schlafsand", the: "der Schlafsand", acc: "den Schlafsand" },
    part: "a small open brown cloth sack full of shimmering golden sand",
    cast: "both",
    before:
      "A cosy child's bedroom at night: a wooden bed with a patchwork quilt, a small window with the moon, a little lamp glowing softly. In the bed lies a little bear child in striped pyjamas, wide awake, its eyes wide open. Beside the bed stands a small old grown-up fox with a white pointed beard, a red pointed cap and a blue cloak, his paws empty, looking at the wide-awake child, brows raised, mouth a small o.",
    after:
      "The old fox now sprinkles shimmering golden sand from a small brown cloth sack over the child, who lies with closed eyes, smiling in its sleep. The fox smiles contently.",
    sounds: ["trickle", "musicbox"],
  },
  {
    id: "frau-holle",
    topic: "fantasie",
    name: "Frau Holle",
    the: "Frau Holle",
    toThe: "Frau Holle",
    partner: { name: "Federbett", the: "das Federbett", acc: "das Federbett" },
    part: "a big fluffy white feather duvet",
    cast: "bear",
    before:
      "High up above the clouds: the open window of a little wooden cottage that sits on a cloud, a window box of red flowers on its sill. Far below, through a gap in the clouds, a green village with red roofs and fields, no snow anywhere. At the window leans an old grown-up bear woman with eyelashes, grey fur on her head, a white bonnet and a blue apron over a red dress, her paws empty on the windowsill, looking down at the green village, brows raised, mouth a small o.",
    after:
      "The old bear woman now shakes a big fluffy white feather duvet out of the window, and snowflakes fall from it onto the village below, whose roofs and fields turn white; she smiles happily.",
    sounds: ["rustle", "whoosh"],
    made: "frames",
    // A tent is for sleeping too.
    alsoFits: ["abenteurerin"],
  },
  {
    id: "tiefseeforscherin",
    topic: "fantasie",
    name: "Tiefseeforscherin",
    the: "die Tiefseeforscherin",
    toThe: "die Tiefseeforscherin",
    partner: { name: "U-Boot", the: "das U-Boot", acc: "das U-Boot" },
    part: "a little yellow submarine with round windows and a small propeller",
    cast: "fox",
    before:
      "The end of a wooden jetty over a clear blue sea. Deep below the surface, on the sandy sea floor between coral and swaying seaweed, lie an old wooden treasure chest and a few colourful fish. On the jetty kneels the explorer, a grown-up fox woman with eyelashes in a red-and-white striped shirt and a white cap, her paws empty, looking down at the chest deep below, brows raised, mouth a small o.",
    after:
      "A little yellow submarine with round windows and a small propeller now floats deep down beside the treasure chest; the explorer sits inside it and waves happily through its round front window. The jetty is empty now.",
    sounds: ["plop", "hum"],
    // Swimming goggles let one look under water too.
    alsoFits: ["schwimmer"],
  },
];
