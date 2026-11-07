import type { SceneSpec } from "../scene";

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
];
