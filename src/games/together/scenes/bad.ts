import type { SceneSpec } from "../scene";

// The pairs of the topic „bad“ (topics.ts), written as data (see scene.tsx).
//
// Soap, sponge and shower gel belong loosely to every washing place, so each names the others it fits in `alsoFits`
// and they are never dealt together. The toothbrush and its toothpaste are handmade in pairs.tsx, so neither is a
// partner here.

export const SCENES: SceneSpec[] = [
  {
    id: "toilette-klopapier",
    topic: "bad",
    name: "Toilette",
    the: "die Toilette",
    toThe: "zur Toilette",
    partner: { name: "Klopapier", the: "das Klopapier", acc: "das Klopapier", emoji: "🧻" },
    thing: "🚽",
    backdrop: "bad",
    // The roll comes to stand beside the toilet, where its holder is.
    act: "beside",
    sounds: ["rustle", "splash"],
  },
  {
    id: "badewanne-schiffchen",
    topic: "bad",
    name: "Badewanne",
    the: "die Badewanne",
    toThe: "zur Badewanne",
    partner: { name: "Schiffchen", the: "das Schiffchen", acc: "das Schiffchen", emoji: "⛵" },
    thing: "🛁",
    backdrop: "bad",
    // The little boat lands on the bath water and floats.
    act: "onto",
    sounds: ["splash", "plop"],
    // Sponge, shower gel and soap belong in the bath too; a boat belongs on the sea.
    alsoFits: ["dusche-duschgel", "wasserhahn-seife", "eimer-schwamm", "meer-muschel"],
  },
  {
    id: "dusche-duschgel",
    topic: "bad",
    name: "Dusche",
    the: "die Dusche",
    toThe: "zur Dusche",
    partner: { name: "Duschgel", the: "das Duschgel", acc: "das Duschgel", emoji: "🧴" },
    thing: "🚿",
    backdrop: "bad",
    act: "pour",
    sounds: ["glug", "drops"],
    alsoFits: ["wasserhahn-seife", "eimer-schwamm"],
  },
  {
    id: "wasserhahn-seife",
    topic: "bad",
    name: "Wasserhahn",
    the: "der Wasserhahn",
    toThe: "zum Wasserhahn",
    partner: { name: "Seife", the: "die Seife", acc: "die Seife", emoji: "🧼" },
    thing: "🚰",
    backdrop: "bad",
    // Hands are washed with soap under the tap.
    act: "beside",
    sounds: ["trickle", "wash"],
    alsoFits: ["eimer-schwamm"],
  },
  {
    id: "eimer-schwamm",
    topic: "bad",
    name: "Eimer",
    the: "der Eimer",
    toThe: "zum Eimer",
    partner: { name: "Schwamm", the: "der Schwamm", acc: "den Schwamm", emoji: "🧽" },
    thing: "🪣",
    backdrop: "bad",
    // The sponge goes into the bucket of soapy water for cleaning.
    act: "into",
    sounds: ["splash", "scrub"],
    // A sponge washes the car too.
    alsoFits: ["auto-zapfsaeule"],
  },
];
