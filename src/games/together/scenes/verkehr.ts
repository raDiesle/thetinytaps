import type { SceneSpec } from "../scene";

// The helpers of the topic „Fahrzeuge“ (topics.ts): who drives, flies or steers, each with its own vehicle, written
// as data (see scene.tsx). A vehicle comes down as big as what it stands on (`spot`). The ambulance, the police car
// and the fire engine are in rettung.ts, the tractor in hof.ts, the digger in bauen.ts.

export const SCENES: SceneSpec[] = [
  {
    id: "pilot",
    topic: "verkehr",
    name: "Pilot",
    the: "der Pilot",
    toThe: "der Pilot",
    partner: { name: "Flugzeug", the: "das Flugzeug", acc: "das Flugzeug", emoji: "✈️" },
    helper: { fur: "fox", outfit: { coat: "#f8f9fa", hat: "peaked", detail: "tie", detailColor: "#1d3557" } },
    // The plane lands on the runway.
    backdrop: "flughafen",
    act: "onto",
    spot: [222, 150, 90],
    sounds: ["jet"],
  },
  {
    id: "busfahrerin",
    topic: "verkehr",
    name: "Busfahrerin",
    the: "die Busfahrerin",
    toThe: "die Busfahrerin",
    partner: { name: "Bus", the: "der Bus", acc: "den Bus", emoji: "🚌" },
    helper: { fur: "fox", outfit: { coat: "#1c7ed6", hat: "cap", hatColor: "#1d3557", detail: "collar" }, lashes: true },
    // The bus stops beside the bus stop.
    thing: "🚏",
    thingAt: [196, 122, 72],
    backdrop: "strasse",
    act: "beside",
    sounds: ["engine", "honk"],
  },
  {
    id: "lokfuehrer",
    topic: "verkehr",
    name: "Lokführer",
    the: "der Lokführer",
    toThe: "der Lokführer",
    partner: { name: "Lok", the: "die Lok", acc: "die Lok", emoji: "🚂" },
    helper: { fur: "bear", outfit: { coat: "#364fc7", hat: "peaked", hatColor: "#212529", detail: "buttons" } },
    // The engine comes down onto the rails.
    backdrop: "bahnhof",
    act: "onto",
    spot: [222, 118, 80],
    sounds: ["train"],
  },
  {
    id: "taxifahrer",
    topic: "verkehr",
    name: "Taxifahrer",
    the: "der Taxifahrer",
    toThe: "der Taxifahrer",
    partner: { name: "Taxi", the: "das Taxi", acc: "das Taxi", emoji: "🚕" },
    helper: { fur: "fox", outfit: { coat: "#f8f9fa", hat: "cap", hatColor: "#212529", detail: "vest", detailColor: "#ffd43b" } },
    // The taxi comes down onto the road.
    backdrop: "strasse",
    act: "onto",
    spot: [222, 156, 80],
    sounds: ["engine", "honk"],
  },
  {
    id: "kapitaen",
    topic: "verkehr",
    name: "Kapitän",
    the: "der Kapitän",
    toThe: "der Kapitän",
    partner: { name: "Schiff", the: "das Schiff", acc: "das Schiff", emoji: "🚢" },
    helper: { fur: "bear", outfit: { coat: "#1d3557", hat: "peaked", hatColor: "#f8f9fa", detail: "buttons" } },
    // The ship comes down onto the water of the harbour.
    backdrop: "hafen",
    act: "onto",
    spot: [210, 126, 84],
    sounds: ["splash", "honk"],
    // A pirate and a sailor need a ship too.
    alsoFits: ["pirat", "segler", "matrose"],
  },
  {
    id: "lkw-fahrerin",
    topic: "verkehr",
    name: "Lkw-Fahrerin",
    the: "die Lkw-Fahrerin",
    toThe: "die Lkw-Fahrerin",
    partner: { name: "Lastwagen", the: "der Lastwagen", acc: "den Lastwagen", emoji: "🚛" },
    helper: { fur: "bear", outfit: { coat: "#2f9e44", hat: "cap", hatColor: "#e03131", detail: "straps", detailColor: "#1864ab" }, lashes: true },
    // The lorry comes down onto the country road.
    backdrop: "landstrasse",
    act: "onto",
    spot: [216, 152, 88],
    sounds: ["engine", "honk"],
    // A lorry brings parcels too.
    alsoFits: ["paketbotin"],
  },
  {
    id: "strassenbahnfahrer",
    topic: "verkehr",
    name: "Straßenbahnfahrer",
    the: "der Straßenbahnfahrer",
    toThe: "der Straßenbahnfahrer",
    partner: { name: "Straßenbahn", the: "die Straßenbahn", acc: "die Straßenbahn", emoji: "🚊" },
    helper: { fur: "fox", outfit: { coat: "#e03131", hat: "peaked", hatColor: "#343a40", detail: "tie", detailColor: "#ffd43b" } },
    // The tram comes down onto the street.
    backdrop: "strasse",
    act: "onto",
    spot: [222, 150, 84],
    sounds: ["bells", "train"],
  },
  {
    id: "motorradfahrerin",
    topic: "verkehr",
    name: "Motorradfahrerin",
    the: "die Motorradfahrerin",
    toThe: "die Motorradfahrerin",
    partner: { name: "Motorrad", the: "das Motorrad", acc: "das Motorrad", emoji: "🏍️" },
    helper: { fur: "fox", outfit: { coat: "#343a40", hat: "biker", hatColor: "#e03131", detail: "stripes", detailColor: "#e03131" }, lashes: true },
    // The motorbike comes down onto the country road.
    backdrop: "landstrasse",
    act: "onto",
    spot: [220, 154, 80],
    sounds: ["engine"],
  },
  {
    id: "matrose",
    topic: "verkehr",
    name: "Matrose",
    the: "der Matrose",
    toThe: "der Matrose",
    partner: { name: "Anker", the: "der Anker", acc: "den Anker", emoji: "⚓" },
    helper: { fur: "bear", outfit: { coat: "#f8f9fa", hat: "sailor", detail: "collar", detailColor: "#1d3557" } },
    // The anchor goes down into the harbour's water.
    backdrop: "hafen",
    act: "into",
    spot: [214, 150, 50],
    sounds: ["rattle", "splash"],
    // A captain, a pirate and a sailing boat need an anchor too.
    alsoFits: ["kapitaen", "pirat", "segler"],
  },
  {
    id: "seilbahnfuehrerin",
    topic: "verkehr",
    name: "Seilbahnführerin",
    the: "die Seilbahnführerin",
    toThe: "die Seilbahnführerin",
    partner: { name: "Seilbahn", the: "die Seilbahn", acc: "die Seilbahn", emoji: "🚡" },
    helper: { fur: "bear", outfit: { coat: "#e64980", hat: "beanie", hatColor: "#1c7ed6", detail: "scarf", detailColor: "#1c7ed6" }, lashes: true },
    // The cable car comes to hang over the mountain meadow.
    backdrop: "berg",
    act: "onto",
    spot: [222, 92, 76],
    sounds: ["whirr", "ding"],
    // A skier rides up in it too.
    alsoFits: ["skifahrerin"],
  },
];
