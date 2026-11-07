import { createElement as h } from "react";
import type { SceneSpec } from "../scene";

// The pairs of the topic „bad“ (topics.ts), written as data (see scene.tsx).
//
// Soap, sponge and shower gel belong loosely to every washing place, so each names the others it fits in `alsoFits`
// and they are never dealt together. The toothbrush and its toothpaste are handmade in pairs.tsx, so the toothpaste is
// no partner here; the tooth gets the toothbrush's emoji. The washing machine has no emoji and is drawn here in the
// partners' 100 × 100 box. Everything worn goes into it, so it names every pair of „kleidung“ in `alsoFits`.

const OUT = "#5a4636";

/** A washing machine from the front: a white box, a strip of knobs on top and a round door of blue water. */
const washingMachine = h(
  "g",
  { stroke: OUT, strokeWidth: 3, strokeLinejoin: "round" },
  h("rect", { x: 14, y: 8, width: 72, height: 86, rx: 6, fill: "#f8f9fa" }),
  h("path", { d: "M14 26 H86", fill: "none" }),
  h("circle", { cx: 72, cy: 17, r: 4.5, fill: "#ced4da", strokeWidth: 2 }),
  h("rect", { x: 22, y: 13, width: 26, height: 8, rx: 2, fill: "#dee2e6", strokeWidth: 2 }),
  h("circle", { cx: 50, cy: 58, r: 25, fill: "#ced4da" }),
  h("circle", { cx: 50, cy: 58, r: 18, fill: "#a5d8ff" }),
  h("path", { d: "M33 62 Q41 56 50 62 T67 62", fill: "none", stroke: "#4dabf7", strokeWidth: 3, strokeLinecap: "round" }),
  h("path", { d: "M40 48 Q44 44 49 44", fill: "none", stroke: "#fff", strokeWidth: 3, strokeLinecap: "round" }),
);

/** Every pair whose thing (or partner) is worn and washed. */
const CLOTHES = [
  "tshirt-hose",
  "unterhose-unterhemd",
  "kleid-ballerinas",
  "jacke-kappe",
  "schal-handschuhe",
  "badehose-flipflops",
  "badeanzug-schwimmbrille",
  "schuh-socken",
];

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
  {
    id: "zahn-zahnbuerste",
    topic: "bad",
    name: "Zahn",
    the: "der Zahn",
    toThe: "zum Zahn",
    partner: { name: "Zahnbürste", the: "die Zahnbürste", acc: "die Zahnbürste", emoji: "🪥" },
    thing: "🦷",
    backdrop: "bad",
    // The brush goes to and fro over the tooth.
    act: "rub",
    sounds: ["scrub"],
    // The toothbrush's own toothpaste belongs to the tooth too.
    alsoFits: ["zahnbuerste"],
  },
  {
    id: "waeschekorb-waschmaschine",
    topic: "bad",
    name: "Wäschekorb",
    the: "der Wäschekorb",
    toThe: "zum Wäschekorb",
    partner: { name: "Waschmaschine", the: "die Waschmaschine", acc: "die Waschmaschine", draw: washingMachine },
    thing: "🧺",
    backdrop: "bad",
    act: "beside",
    sounds: ["thump", "wash"],
    alsoFits: CLOTHES,
  },
];
