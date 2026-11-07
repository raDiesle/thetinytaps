import type { PaintedPair } from ".";

// The painted pairs of the topic „rettung“ (topics.ts); how to write one is in index.ts and the game's CLAUDE.md.

export const PAINTED: PaintedPair[] = [
  {
    id: "feuerwehrfrau",
    topic: "rettung",
    name: "Feuerwehrfrau",
    the: "die Feuerwehrfrau",
    toThe: "die Feuerwehrfrau",
    partner: { name: "Feuerwehrauto", the: "das Feuerwehrauto", acc: "das Feuerwehrauto", emoji: "🚒" },
    cast: "bear",
    before:
      "A street in front of a house with a tall leafy tree on the pavement. High up on a branch of the tree sits a small grey kitten. Under the tree stands the firefighter, a grown-up bear woman with eyelashes in a dark firefighter uniform with yellow reflective stripes and a red helmet, looking up at the kitten, both empty paws raised, puzzled: the branch is far too high.",
    after:
      "A red fire engine now stands on the street beside the tree, its long ladder raised up to the branch. The bear firefighter stands at the top of the ladder holding the kitten safely in her arms; both are happy. The branch where the kitten sat is empty now.",
    sounds: ["siren"],
    alsoFits: ["feuerwehr"],
    made: true,
  },
  {
    id: "rettungsschwimmerin",
    topic: "rettung",
    name: "Rettungsschwimmerin",
    the: "die Rettungsschwimmerin",
    toThe: "die Rettungsschwimmerin",
    partner: { name: "Rettungsring", the: "der Rettungsring", acc: "den Rettungsring" },
    part: "a red-and-white life ring with a short coiled rope",
    cast: "both",
    before:
      "A sunny beach by the sea. On the sand on the left stands a tall wooden lifeguard tower with a red-and-white flag. In front of it stands the lifeguard, a grown-up fox woman with eyelashes in a red shirt with a white cross and a yellow cap, her paws empty, looking out to sea, worried. In the water on the right, not far out, a little bear child in a yellow swim shirt waves one arm, tired from swimming.",
    after:
      "A red-and-white life ring on a rope now floats in the water at the bear child, who holds on to it and smiles. The fox lifeguard on the beach holds the rope and pulls, smiling.",
    sounds: ["whoosh", "splash"],
    alsoFits: ["kapitaen", "matrose", "schwimmer", "schwimmlehrer"],
    made: "frames",
  },
];
