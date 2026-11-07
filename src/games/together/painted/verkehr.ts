import type { PaintedPair } from ".";

// The painted pairs of the topic „verkehr“ (topics.ts); how to write one is in index.ts and the game's CLAUDE.md.

export const PAINTED: PaintedPair[] = [
  {
    id: "pilot",
    topic: "verkehr",
    name: "Pilot",
    the: "der Pilot",
    toThe: "der Pilot",
    partner: { name: "Flugzeug", the: "das Flugzeug", acc: "das Flugzeug", emoji: "✈️" },
    cast: "fox",
    before:
      "An airport on a sunny day: a control tower in the back, a wide grey runway, and in front a set of white wheeled passenger stairs standing alone, nothing at the top of them. The pilot, a grown-up fox in a white shirt with a dark-blue tie, golden stripes on his shoulders and a peaked captain's cap, stands at the foot of the stairs with a small suitcase beside him and empty paws, looking at the empty top of the stairs, brows raised, mouth a small o.",
    after:
      "A big white passenger plane now stands at the stairs, its door open at their top; the pilot stands in the doorway and waves happily, his suitcase gone with him.",
    sounds: ["jet"],
    alsoFits: ["hubschrauberpilotin"],
    made: true,
  },
  {
    id: "busfahrerin",
    topic: "verkehr",
    name: "Busfahrerin",
    the: "die Busfahrerin",
    toThe: "die Busfahrerin",
    partner: { name: "Bus", the: "der Bus", acc: "den Bus", emoji: "🚌" },
    cast: "both",
    before:
      "A town street with a roadside stop: a pole with a round sign without letters and a little glass shelter with a bench. On the bench sits a bear child with a small backpack, waiting and looking down the road. Beside the stop stands the driver, a grown-up fox woman with eyelashes in a blue uniform jacket and a dark-blue cap, her paws empty, looking down the empty road too, brows raised, mouth a small o.",
    after:
      "A long bus now stands at the stop with its door open; the fox driver sits at its big steering wheel behind the windscreen, and the bear child climbs in. Both smile happily.",
    sounds: ["engine", "honk"],
    made: true,
  },
  {
    id: "lokfuehrer",
    topic: "verkehr",
    name: "Lokführer",
    the: "der Lokführer",
    toThe: "der Lokführer",
    partner: { name: "Lok", the: "die Lok", acc: "die Lok", emoji: "🚂" },
    cast: "bear",
    before:
      "A small country station with a platform and a station roof. On the rails stand three carriages coupled together, and in front of the first one the rails are empty: nothing there to pull them. The train driver, a grown-up bear in a dark-blue uniform with golden buttons and a black peaked cap, stands on the platform at the front of the first carriage with empty paws, looking at the empty rails ahead, brows raised, mouth a small o.",
    after:
      "A steam locomotive now stands coupled in front of the carriages, puffing white steam from its chimney; the train driver leans out of its cab and waves happily.",
    sounds: ["train"],
    made: true,
  },
  {
    id: "taxifahrer",
    topic: "verkehr",
    name: "Taxifahrer",
    the: "der Taxifahrer",
    toThe: "der Taxifahrer",
    partner: { name: "Taxi", the: "das Taxi", acc: "das Taxi", emoji: "🚕" },
    cast: "both",
    before:
      "In front of a train station building, by the kerb. A bear child stands there with a big suitcase and a teddy under one arm, waving down the road. Beside it stands the driver, a grown-up fox in a white shirt with a black cap with a yellow-and-black chequered band, his paws empty, looking down the empty road, brows raised, mouth a small o.",
    after:
      "A yellow car with a sign on its roof now stands at the kerb, its back door open; the fox driver stands where he was and holds the door. The bear child stands where it was with its one suitcase and teddy, smiling happily.",
    sounds: ["engine", "honk"],
  },
  {
    id: "kapitaen",
    topic: "verkehr",
    name: "Kapitän",
    the: "der Kapitän",
    toThe: "der Kapitän",
    partner: { name: "Schiff", the: "das Schiff", acc: "das Schiff", emoji: "🚢" },
    cast: "bear",
    before:
      "A harbour quay with an iron bollard, a few wooden crates and a gangway that leads out over the water to nothing. The water beside the quay is empty. The captain, a grown-up bear in a dark-blue coat with golden buttons and a white captain's cap, stands at the gangway with empty paws, looking at the empty water, brows raised, mouth a small o.",
    after:
      "A big ship with a white hull and a funnel now lies at the quay, the gangway leading onto it; the captain stays on the quay where he was, one paw on the gangway's rail, and waves happily, smoke rising from the funnel.",
    sounds: ["splash", "honk"],
    alsoFits: ["pirat", "segler", "matrose", "rettungsschwimmerin", "sternguckerin"],
  },
  {
    id: "lkw-fahrerin",
    topic: "verkehr",
    name: "Lkw-Fahrerin",
    the: "die Lkw-Fahrerin",
    toThe: "die Lkw-Fahrerin",
    partner: { name: "Lastwagen", the: "der Lastwagen", acc: "den Lastwagen", emoji: "🚛" },
    cast: "bear",
    before:
      "A warehouse with a raised loading ramp, a big stack of wooden crates on pallets standing on the ramp, ready to go; the place in front of the ramp is empty. The driver, a grown-up bear woman with eyelashes in a green jacket, blue dungarees and a red cap, stands on the ramp beside the crates with empty paws, looking at the empty place in front, brows raised, mouth a small o.",
    after: "A big lorry with a long trailer now stands backed up to the ramp, the crates loaded into it; the driver leans out of its cab and waves happily.",
    sounds: ["engine", "honk"],
    alsoFits: ["paketbotin", "muellwerker"],
    made: true,
  },
  {
    id: "strassenbahnfahrer",
    topic: "verkehr",
    name: "Straßenbahnfahrer",
    the: "der Straßenbahnfahrer",
    toThe: "der Straßenbahnfahrer",
    partner: { name: "Straßenbahn", the: "die Straßenbahn", acc: "die Straßenbahn", emoji: "🚊" },
    cast: "fox",
    before:
      "A city street with two rails set into the cobbles and a wire hanging above them, and a low raised platform between the rails and the pavement. The driver, a grown-up fox in a red uniform jacket, a yellow tie and a dark peaked cap, stands on the platform with empty paws, looking along the empty rails, brows raised, mouth a small o.",
    after:
      "A tram now stands on the rails at the platform, its pole touching the wire above and its front door open; the fox stays on the platform where he was, one paw on the open door, smiling happily.",
    sounds: ["bells", "train"],
  },
  {
    id: "motorradfahrerin",
    topic: "verkehr",
    name: "Motorradfahrerin",
    the: "die Motorradfahrerin",
    toThe: "die Motorradfahrerin",
    partner: { name: "Motorrad", the: "das Motorrad", acc: "das Motorrad", emoji: "🏍️" },
    cast: "fox",
    before:
      "A country road that winds away over green hills. At the roadside stands the rider, a grown-up fox woman with eyelashes in a black leather jacket with red stripes, a red helmet under one arm, the other paw empty, looking along the long winding road, brows raised, mouth a small o.",
    after: "The rider now sits on a red motorbike on the road, her helmet on, and rides off along it, smiling happily.",
    sounds: ["engine"],
    alsoFits: ["rennfahrerin", "radfahrerin"],
    made: true,
  },
  {
    id: "matrose",
    topic: "verkehr",
    name: "Matrose",
    the: "der Matrose",
    toThe: "der Matrose",
    partner: { name: "Anker", the: "der Anker", acc: "den Anker", emoji: "⚓" },
    cast: "bear",
    before:
      "The deck of a small sailing ship in a calm bay, a sandy beach close by. At the ship's bow a heavy iron chain runs out over the rail, its end hanging empty. The sailor, a grown-up bear in a white sailor's shirt with a blue collar and a white sailor's cap, stands at the bow with empty paws, looking at the empty end of the chain and the drifting water, brows raised, mouth a small o.",
    after: "The sailor now lowers a big black anchor on the chain over the bow into the water, and the ship stays still in the bay. He smiles happily.",
    sounds: ["rattle", "splash"],
    alsoFits: ["kapitaen", "pirat", "segler"],
    made: true,
  },
  {
    id: "seilbahnfuehrerin",
    topic: "verkehr",
    name: "Seilbahnführerin",
    the: "die Seilbahnführerin",
    toThe: "die Seilbahnführerin",
    partner: { name: "Seilbahn", the: "die Seilbahn", acc: "die Seilbahn", emoji: "🚡" },
    cast: "bear",
    before:
      "A little wooden valley station at the foot of a high snowy mountain; from it a steel cable runs up to the summit, nothing hanging on it. The operator, a grown-up bear woman with eyelashes in a pink jacket, a blue woolly hat and a blue scarf, stands on the station's platform with empty paws, looking up along the empty cable, brows raised, mouth a small o.",
    after: "A red cable car cabin now hangs on the cable at the platform; the operator holds its door open and smiles happily.",
    sounds: ["whirr", "ding"],
    alsoFits: ["skifahrerin"],
  },
  {
    id: "abschleppfahrer",
    topic: "verkehr",
    name: "Abschleppfahrer",
    the: "der Abschleppfahrer",
    toThe: "der Abschleppfahrer",
    partner: { name: "Abschleppwagen", the: "der Abschleppwagen", acc: "den Abschleppwagen" },
    part: "a yellow tow truck seen from the side: a cab with an orange light on top and a crane arm with a hook at its back",
    cast: "bear",
    before:
      "A country road. At the roadside a small blue car has broken down, its bonnet open and a little steam rising from the engine, a red warning triangle on the road behind it. The breakdown driver, a grown-up bear in orange overalls and an orange cap, stands beside the car with empty paws, looking at the broken car, brows raised, mouth a small o.",
    after:
      "A yellow tow truck with an orange light on its cab now stands in front of the car and lifts the car's front up on its hook; the bear works its lever and smiles happily.",
    sounds: ["engine", "rattle"],
    alsoFits: ["mechanikerin"],
    made: true,
  },
  {
    id: "schneepflugfahrer",
    topic: "verkehr",
    name: "Schneepflugfahrer",
    the: "der Schneepflugfahrer",
    toThe: "der Schneepflugfahrer",
    partner: { name: "Schneepflug", the: "der Schneepflug", acc: "den Schneepflug" },
    part: "an orange snowplough lorry seen from the side with a big slanted orange blade at its front",
    cast: "fox",
    before:
      "A village road in winter, buried deep in fresh snow; a small red car is stuck in it up to its wheels, snow piled high. The road worker, a grown-up fox in an orange winter jacket with reflective stripes and a woolly hat, stands at the edge of the road with empty paws, looking at the deep snow, brows raised, mouth a small o.",
    after:
      "An orange snowplough lorry with a big slanted blade at its front now drives along the road and pushes the snow aside; the fox waves from its cab, and behind it the road is clear. He smiles happily.",
    sounds: ["engine", "whoosh"],
    alsoFits: ["strassenkehrer"],
    made: "frames",
  },
];
