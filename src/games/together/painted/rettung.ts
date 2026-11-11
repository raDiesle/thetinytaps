import type { PaintedPair } from ".";

// The painted pairs of the topic „rettung“ (topics.ts); how to write one is in index.ts and the game's CLAUDE.md.

export const PAINTED: PaintedPair[] = [
  {
    id: "feuerwehrfrau",
    topic: "rettung",
    name: "Feuerwehrfrau",
    the: "die Feuerwehrfrau",
    toThe: "die Feuerwehrfrau",
    wish: "Das Kätzchen sitzt oben im Baum fest. Die Feuerwehrfrau will es holen.",
    partner: { name: "Feuerwehrauto", the: "das Feuerwehrauto", acc: "das Feuerwehrauto", emoji: "🚒" },
    cast: "bear",
    before:
      "A street in front of a house with a tall leafy tree on the pavement. High up on a branch of the tree sits a small grey kitten. Under the tree stands the firefighter, a grown-up bear woman with eyelashes in a dark firefighter uniform with yellow reflective stripes and a red helmet, looking up at the kitten, both empty paws raised, brows raised, mouth a small o: the branch is far too high.",
    after:
      "A red fire engine now stands on the street beside the tree, its long ladder raised up to the branch. The bear firefighter stands at the top of the ladder holding the kitten safely in her arms; both are happy. The branch where the kitten sat is empty now.",
    sounds: ["siren"],
    alsoFits: ["feuerwehr", "feuerwehrmann", "hubschrauberpilotin", "obstbaeuerin"],
    made: true,
  },
  {
    id: "rettungsschwimmerin",
    topic: "rettung",
    name: "Rettungsschwimmerin",
    the: "die Rettungsschwimmerin",
    toThe: "die Rettungsschwimmerin",
    wish: "Die Rettungsschwimmerin will dem Kind im Wasser etwas zuwerfen.",
    partner: { name: "Rettungsring", the: "der Rettungsring", acc: "den Rettungsring" },
    part: "a red-and-white life ring with a short coiled rope",
    cast: "both",
    before:
      "A sunny beach by the sea. On the sand on the left stands a tall wooden lifeguard tower with a red-and-white flag. In front of it stands the lifeguard, a grown-up fox woman with eyelashes in a red shirt with a white cross and a yellow cap, her paws empty, looking out to sea, worried. In the water on the right, not far out, a little bear child in a yellow swim shirt waves one arm, tired from swimming.",
    after:
      "A red-and-white life ring on a rope now floats in the water at the bear child, who holds on to it and smiles. The fox lifeguard on the beach holds the rope and pulls, smiling.",
    sounds: ["whoosh", "splash"],
    alsoFits: ["kapitaen", "matrose", "schwimmer", "schwimmlehrer", "polizist"],
    made: true,
  },
  {
    id: "polizist",
    topic: "rettung",
    name: "Polizist",
    the: "der Polizist",
    toThe: "der Polizist",
    wish: "Der Polizist will den Autos zeigen, wann sie fahren dürfen.",
    partner: { name: "Trillerpfeife", the: "die Trillerpfeife", acc: "die Trillerpfeife" },
    part: "a shiny silver whistle on a short red cord",
    cast: "bear",
    before:
      "A town crossroads whose traffic light is broken and dark. From all four sides small cars stand jammed nose to nose, nobody knowing who may go. In the middle of the crossing stands the police officer, a grown-up bear in a dark-blue police uniform, a peaked police cap and white gloves, his paws empty, looking from one car to the next, brows raised, mouth a small o.",
    after:
      "The police officer now blows a silver whistle on a red cord and points with his white-gloved arm: the cars on one side drive on in a neat row while the others wait. He and the drivers smile.",
    sounds: ["whistle", "engine"],
    alsoFits: ["rettungsschwimmerin", "schwimmlehrer", "polizistin"],
    made: true,
  },
  {
    id: "sanitaeter",
    topic: "rettung",
    name: "Sanitäter",
    the: "der Sanitäter",
    toThe: "der Sanitäter",
    wish: "Der Sanitäter will das Kind schnell ins Krankenhaus fahren.",
    partner: { name: "Krankenwagen", the: "der Krankenwagen", acc: "den Krankenwagen", emoji: "🚑" },
    cast: "both",
    before:
      "A playground with a slide and a sandpit, a road along its edge. At the foot of the slide sits a fox child in a green T-shirt, holding its knee with both paws, a little teary. The paramedic, a grown-up bear in a red jacket with white reflective stripes, kneels beside the child with empty paws, looking along the empty road, brows raised, mouth a small o.",
    after:
      "A white ambulance with a red stripe and a blue light on its roof now stands on the road at the playground's edge, its back doors open; the paramedic carries the child to it, and the child smiles a little.",
    sounds: ["siren"],
    alsoFits: ["aerztin", "hubschrauberpilotin", "krankenpfleger"],
    made: true,
  },
  {
    id: "hubschrauberpilotin",
    topic: "rettung",
    name: "Hubschrauberpilotin",
    the: "die Hubschrauberpilotin",
    toThe: "die Hubschrauberpilotin",
    wish: "Das Lamm hat sich wehgetan. Die Pilotin will es schnell ins Tal fliegen.",
    partner: { name: "Hubschrauber", the: "der Hubschrauber", acc: "den Hubschrauber", emoji: "🚁" },
    cast: "bear",
    before:
      "A green mountain meadow under a blue sky, snowy peaks behind. On the right lies an empty round landing pad, a flat grey circle with a white ring painted on it. On the left stands the rescue pilot, a grown-up bear woman with eyelashes in a red flight suit and a white flying helmet, her paws empty; beside her a little white lamb with a bandaged front leg sits on a blue blanket. Both look at the empty landing pad, brows raised, mouth a small o.",
    after:
      "A plain red rescue helicopter with no cross, flag or emblem on it now stands on the landing pad, its rotor still, its side door open and its cockpit empty: nobody sits inside it. The pilot and the lamb stay exactly where they were, both smiling at it – the pilot is outside, once, never also in the cockpit.",
    sounds: ["rotor"],
    alsoFits: ["pilot", "sanitaeter", "feuerwehrfrau"],
    fromFirst: true,
  },
  {
    id: "feuerwehrmann",
    topic: "rettung",
    name: "Feuerwehrmann",
    the: "der Feuerwehrmann",
    toThe: "der Feuerwehrmann",
    wish: "Der Grill brennt! Der Feuerwehrmann will die Flammen ausmachen.",
    partner: { name: "Feuerlöscher", the: "der Feuerlöscher", acc: "den Feuerlöscher", emoji: "🧯" },
    cast: "fox",
    before:
      "A garden with a lawn and a hedge. In the middle a round garden barbecue grill, its flames shooting much too high, licking out over the edge. The firefighter, a grown-up fox in a dark firefighter uniform with yellow reflective stripes and a red helmet, stands in front of it with empty paws, looking at the big flames, worried.",
    after:
      "The firefighter now sprays white foam from a red fire extinguisher onto the grill; the flames are out, only a little smoke rises. He smiles happily.",
    sounds: ["hiss", "whoosh"],
    alsoFits: ["feuerwehr", "feuerwehrfrau"],
    made: true,
  },
  {
    id: "polizistin",
    topic: "rettung",
    name: "Polizistin",
    the: "die Polizistin",
    toThe: "die Polizistin",
    wish: "Die Polizistin sucht den Teddy. Eine gute Nase soll ihr helfen.",
    partner: { name: "Polizeihund", the: "der Polizeihund", acc: "den Polizeihund" },
    part: "a brown-and-black shepherd dog in a plain dark-blue harness with no letters, sitting upright, ears pricked",
    cast: "both",
    before:
      "A big park with tall grass and thick bushes. A fox child in a blue T-shirt stands sadly at the bushes, pointing into them: its teddy is lost somewhere in there. Beside it stands the police officer, a grown-up bear woman with eyelashes in a dark-blue police uniform and a police cap, holding an empty leash with nothing on it, looking at the thick bushes, brows raised, mouth a small o.",
    after:
      "A brown-and-black shepherd dog in a plain dark-blue harness with no letters is now on the leash; it sniffs into the bushes and pulls the teddy out. The fox child hugs the teddy, and the officer smiles happily.",
    sounds: ["rustle", "giggle"],
    alsoFits: ["polizist", "schaefer"],
    made: true,
  },
];
