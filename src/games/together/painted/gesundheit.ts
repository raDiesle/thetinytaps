import type { PaintedPair } from ".";

// The painted pairs of the topic „gesundheit“ (topics.ts); how to write one is in index.ts and the game's CLAUDE.md.

export const PAINTED: PaintedPair[] = [
  {
    id: "zahnaerztin",
    topic: "gesundheit",
    name: "Zahnärztin",
    the: "die Zahnärztin",
    toThe: "die Zahnärztin",
    wish: "Die Zahnärztin will hinten in deinen Mund schauen.",
    partner: { name: "Zahnarztspiegel", the: "der Zahnarztspiegel", acc: "den Zahnarztspiegel" },
    part: "a dentist's mouth mirror: a small round mirror on a long thin silver handle, lying diagonally",
    cast: "bear",
    before:
      "A friendly dentist's room: a dentist's chair with a round lamp above it, a small cabinet behind. A little bear child in a light-blue T-shirt sits in the chair with its mouth wide open. Beside the chair stands the dentist, a grown-up bear woman with eyelashes in a white coat with a light-blue collar, her paws empty and open, looking unsure at the open mouth.",
    after:
      "The dentist now holds a small round dental mirror on a thin silver handle into the child's open mouth and looks at the teeth, smiling contently. The child is relaxed and its eyes smile.",
    sounds: ["scrub", "squeak"],
    made: true,
  },
  {
    id: "krankenpfleger",
    topic: "gesundheit",
    name: "Krankenpfleger",
    the: "der Krankenpfleger",
    toThe: "der Krankenpfleger",
    wish: "Das Bärenkind hat ein Gipsbein. Der Pfleger will es hinausfahren.",
    partner: { name: "Rollstuhl", the: "der Rollstuhl", acc: "den Rollstuhl" },
    part: "a blue wheelchair: a seat with a backrest, two big wheels at its sides and two small wheels in front, empty",
    cast: "bear",
    before:
      "A bright hospital room with one bed and an open door to a sunny hospital garden. A bear child in striped pyjamas sits on the edge of the bed, one leg in a white plaster cast, looking longingly at the garden. The nurse, a grown-up bear in light-blue scrubs, stands beside the bed with empty paws, looking at the cast leg, brows raised, mouth a small o.",
    after: "The bear child now sits in a blue wheelchair with its cast leg stretched out, and the nurse pushes it towards the open door; both smile happily.",
    sounds: ["squeak", "giggle"],
    alsoFits: ["sanitaeter"],
    made: true,
  },
  {
    id: "ohrenaerztin",
    topic: "gesundheit",
    name: "Ohrenärztin",
    the: "die Ohrenärztin",
    toThe: "die Ohrenärztin",
    wish: "Die Ohrenärztin will in dein Ohr schauen.",
    partner: { name: "Ohrenspiegel", the: "der Ohrenspiegel", acc: "den Ohrenspiegel" },
    part: "a doctor's ear light: a black handle with a little light at its top and a short pointed white funnel tip",
    cast: "both",
    before:
      "A friendly doctor's room with a cabinet and a poster of a smiling sun. A bear child in a yellow T-shirt sits on the examination couch holding one paw against its ear, a little worried. The ear doctor, a grown-up fox woman with eyelashes in a white coat with a green collar, bends to the child's ear with empty paws, looking at it, brows raised, mouth a small o.",
    after:
      "The ear doctor now looks into the child's ear through a small black ear light with a little lamp and a pointed white tip; the child lowers its paw and smiles.",
    sounds: ["click", "ding"],
    alsoFits: ["aerztin"],
    made: true,
  },
  {
    id: "augenaerztin",
    topic: "gesundheit",
    name: "Augenärztin",
    the: "die Augenärztin",
    toThe: "die Augenärztin",
    wish: "Die Augenärztin will dir an der Wand Bilder zeigen.",
    partner: { name: "Sehtafel", the: "die Sehtafel", acc: "die Sehtafel" },
    part: "a white board with rows of little black pictures – a house, an apple, a car, a star – each row smaller than the one above; only pictures, nothing written",
    cast: "both",
    before:
      "An eye doctor's room: a fox child in a green T-shirt sits on a chair at one end, ready, one eye covered with its paw; the wall at the other end of the room is bare and white. The eye doctor, a grown-up bear woman with eyelashes in a white coat with a blue collar, stands between them with a long thin pointer stick in her paw, looking at the bare wall, brows raised, mouth a small o.",
    after:
      "An eye chart with rows of simple black pictures (a house, an apple, a car, a star), each row smaller, no letters, now hangs on the bare wall; the eye doctor points at the house with her stick and the fox child names it, happily.",
    sounds: ["ding", "giggle"],
    made: true,
  },
];
