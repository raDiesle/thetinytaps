import type { SceneSpec } from "../scene";

// The helpers of the topic „Arzt & Krankenhaus“ (topics.ts): who looks after the sick, written as data (see
// scene.tsx). The doctor with her stethoscope is handmade in pairs.tsx. Plasters, pills and the thermometer fit
// most of them, so `alsoFits` keeps those apart; the ambulance's paramedic is in rettung.ts.

export const SCENES: SceneSpec[] = [
  {
    id: "tieraerztin",
    topic: "gesundheit",
    name: "Tierärztin",
    the: "die Tierärztin",
    toThe: "die Tierärztin",
    partner: { name: "Pflaster", the: "das Pflaster", acc: "das Pflaster", emoji: "🩹" },
    helper: { fur: "fox", outfit: { coat: "#f8f9fa", detail: "cross", detailColor: "#40c057" }, lashes: true },
    // The plaster goes onto the little dog's head.
    thing: "🐶",
    backdrop: "praxis",
    act: "onto",
    sounds: ["plop", "giggle"],
    // A doctor and a paramedic need plasters too.
    alsoFits: ["aerztin", "sanitaeter"],
  },
  {
    id: "krankenpfleger",
    topic: "gesundheit",
    name: "Krankenpfleger",
    the: "der Krankenpfleger",
    toThe: "der Krankenpfleger",
    partner: { name: "Fieberthermometer", the: "das Fieberthermometer", acc: "das Fieberthermometer", emoji: "🌡️" },
    helper: { fur: "bear", outfit: { coat: "#74c0fc", detail: "collar", detailColor: "#f8f9fa" } },
    // The thermometer comes to the sick teddy sitting up in the hospital bed.
    thing: "🧸",
    thingAt: [222, 112, 54],
    backdrop: "krankenhaus",
    act: "beside",
    spot: [254, 106, 38],
    sounds: ["whoosh", "ding"],
    // A doctor, a vet and the chemist need a thermometer too, and he needs their plasters and pills.
    alsoFits: ["aerztin", "tieraerztin", "apothekerin"],
  },
  {
    id: "apothekerin",
    topic: "gesundheit",
    name: "Apothekerin",
    the: "die Apothekerin",
    toThe: "die Apothekerin",
    partner: { name: "Tabletten", the: "die Tabletten", acc: "die Tabletten", plural: true, emoji: "💊" },
    helper: { fur: "fox", outfit: { coat: "#f8f9fa", detail: "buttons", detailColor: "#69db7c" }, lashes: true },
    backdrop: "apotheke",
    act: "hold",
    sounds: ["rattle", "ding"],
    // A doctor and a vet give medicine too, and the chemist sells plasters.
    alsoFits: ["aerztin", "tieraerztin"],
  },
  {
    id: "optiker",
    topic: "gesundheit",
    name: "Optiker",
    the: "der Optiker",
    toThe: "der Optiker",
    partner: { name: "Brille", the: "die Brille", acc: "die Brille", emoji: "👓" },
    helper: { fur: "fox", outfit: { coat: "#e7f5ff", detail: "tie", detailColor: "#1c7ed6" } },
    // The glasses come onto his own eyes, in front of the chart of shapes.
    backdrop: "praxis",
    act: "onto",
    spot: [60, 86, 40],
    sounds: ["click", "ding"],
    // Swimming goggles and a magnifying glass are lenses too.
    alsoFits: ["schwimmer", "detektivin"],
  },
];
