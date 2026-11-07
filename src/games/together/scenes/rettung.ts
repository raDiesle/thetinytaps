import type { SceneSpec } from "../scene";

import { lifeRing } from "../tools";

// The helpers of the topic „Feuerwehr, Polizei & Rettung“ (topics.ts): who comes when help is needed, written as data
// (see scene.tsx). The fire fighter with the hose is handmade in pairs.tsx; each other one has its own vehicle or tool.

export const SCENES: SceneSpec[] = [
  {
    id: "polizist",
    topic: "rettung",
    name: "Polizist",
    the: "der Polizist",
    toThe: "der Polizist",
    partner: { name: "Polizeiauto", the: "das Polizeiauto", acc: "das Polizeiauto", emoji: "🚓" },
    helper: { fur: "bear", outfit: { coat: "#1d4e89", hat: "peaked", detail: "badge" } },
    // The police car comes down onto the road.
    backdrop: "strasse",
    act: "onto",
    spot: [222, 156, 80],
    sounds: ["siren"],
  },
  {
    id: "sanitaeter",
    topic: "rettung",
    name: "Sanitäter",
    the: "der Sanitäter",
    toThe: "der Sanitäter",
    partner: { name: "Krankenwagen", the: "der Krankenwagen", acc: "den Krankenwagen", emoji: "🚑" },
    helper: { fur: "bear", outfit: { coat: "#ff6b6b", detail: "stripes", detailColor: "#f8f9fa" } },
    // The ambulance comes down onto the road.
    backdrop: "strasse",
    act: "onto",
    spot: [222, 156, 80],
    sounds: ["siren"],
    // A doctor may ride in it too.
    alsoFits: ["aerztin"],
  },
  {
    id: "hubschrauberpilotin",
    topic: "rettung",
    name: "Hubschrauberpilotin",
    the: "die Hubschrauberpilotin",
    toThe: "die Hubschrauberpilotin",
    partner: { name: "Hubschrauber", the: "der Hubschrauber", acc: "den Hubschrauber", emoji: "🚁" },
    helper: { fur: "bear", outfit: { coat: "#e03131", hat: "cap", hatColor: "#f8f9fa", detail: "strap", detailColor: "#ffd43b" }, lashes: true },
    // The helicopter lands on the meadow in the mountains.
    backdrop: "berg",
    act: "onto",
    spot: [222, 120, 80],
    sounds: ["rotor"],
    // A pilot may fly it too, and a paramedic rides in it.
    alsoFits: ["pilot", "sanitaeter"],
  },
  {
    id: "feuerwehrfrau",
    topic: "rettung",
    name: "Feuerwehrfrau",
    the: "die Feuerwehrfrau",
    toThe: "die Feuerwehrfrau",
    partner: { name: "Feuerwehrauto", the: "das Feuerwehrauto", acc: "das Feuerwehrauto", emoji: "🚒" },
    helper: { fur: "bear", outfit: { coat: "#212529", hat: "helmet", detail: "stripes" }, lashes: true },
    // The fire engine comes down onto the street.
    backdrop: "strasse",
    act: "onto",
    spot: [218, 152, 86],
    sounds: ["siren"],
    // The fire fighter with the hose drives it too.
    alsoFits: ["feuerwehr"],
  },
  {
    id: "rettungsschwimmerin",
    topic: "rettung",
    name: "Rettungsschwimmerin",
    the: "die Rettungsschwimmerin",
    toThe: "die Rettungsschwimmerin",
    partner: { name: "Rettungsring", the: "der Rettungsring", acc: "den Rettungsring", draw: lifeRing },
    helper: { fur: "fox", outfit: { coat: "#f03e3e", hat: "cap", hatColor: "#ffd43b", detail: "cross", detailColor: "#f8f9fa" }, lashes: true },
    // The life ring comes down onto the sea.
    backdrop: "strand",
    act: "onto",
    spot: [226, 118, 50],
    sounds: ["whoosh", "splash"],
    // Every ship has a life ring, swimmers and their teacher use one too.
    alsoFits: ["kapitaen", "matrose", "schwimmer", "schwimmlehrer"],
  },
];
