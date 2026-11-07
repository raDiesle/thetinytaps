import type { SceneSpec } from "../scene";

// The helpers of the topic „Laden, Café & Küche“ (topics.ts): who cooks, bakes, serves and sells, written as data
// (see scene.tsx). The baker with his roll is handmade in pairs.tsx. Much of what they hand over fits the waitress
// too, so she names those in `alsoFits`.

export const SCENES: SceneSpec[] = [
  {
    id: "koch",
    topic: "laden",
    name: "Koch",
    the: "der Koch",
    toThe: "der Koch",
    partner: { name: "Kochlöffel", the: "der Kochlöffel", acc: "den Kochlöffel", emoji: "🥄" },
    helper: { fur: "bear", outfit: { coat: "#f8f9fa", hat: "chef", detail: "scarf", detailColor: "#e03131" } },
    // The spoon stirs the soup on the worktop.
    thing: "🍲",
    backdrop: "kueche",
    act: "turn",
    sounds: ["swirl", "yum"],
    // A baker stirs his dough with a wooden spoon too.
    alsoFits: ["baecker"],
  },
  {
    id: "eisverkaeuferin",
    topic: "laden",
    name: "Eisverkäuferin",
    the: "die Eisverkäuferin",
    toThe: "die Eisverkäuferin",
    partner: { name: "Eis", the: "das Eis", acc: "das Eis", emoji: "🍦" },
    helper: { fur: "fox", outfit: { coat: "#ffc9c9", hat: "cap", hatColor: "#f8f9fa", detail: "apron" }, lashes: true },
    backdrop: "strand",
    act: "hold",
    sounds: ["ring", "yum"],
  },
  {
    id: "kassierer",
    topic: "laden",
    name: "Kassierer",
    the: "der Kassierer",
    toThe: "der Kassierer",
    partner: { name: "Geld", the: "das Geld", acc: "das Geld", emoji: "💶" },
    helper: { fur: "bear", outfit: { coat: "#4dabf7", detail: "apron", detailColor: "#f8f9fa" } },
    backdrop: "laden",
    act: "hold",
    sounds: ["ding", "rustle"],
  },
  {
    id: "kellnerin",
    topic: "laden",
    name: "Kellnerin",
    the: "die Kellnerin",
    toThe: "die Kellnerin",
    partner: { name: "Kaffee", the: "der Kaffee", acc: "den Kaffee", emoji: "☕" },
    helper: { fur: "fox", outfit: { coat: "#343a40", detail: "apron", detailColor: "#f8f9fa" }, lashes: true },
    // The cup of coffee is put down on the café's little table.
    backdrop: "cafe",
    act: "onto",
    spot: [226, 118, 38],
    sounds: ["clonk", "yum"],
    // She brings ice cream and a spoon too, and takes the money.
    alsoFits: ["eisverkaeuferin", "koch", "kassierer"],
  },
  {
    id: "floristin",
    topic: "laden",
    name: "Floristin",
    the: "die Floristin",
    toThe: "die Floristin",
    partner: { name: "Blumenstrauß", the: "der Blumenstrauß", acc: "den Blumenstrauß", emoji: "💐" },
    helper: { fur: "bear", outfit: { coat: "#8ce99a", detail: "apron", detailColor: "#f783ac" }, lashes: true },
    // The flowers come into the vase on the table.
    thing: "🏺",
    thingAt: [222, 128, 64],
    backdrop: "esstisch",
    act: "onto",
    spot: [222, 92, 52],
    sounds: ["rustle", "chime"],
    // A gardener brings flowers too.
    alsoFits: ["gaertner"],
  },
];
