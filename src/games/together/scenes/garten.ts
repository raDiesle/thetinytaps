import { createElement as h } from "react";
import type { SceneSpec } from "../scene";

// The pairs of the topic „garten“ (topics.ts), written as data (see scene.tsx). The garden's things that have no emoji
// (rake, spade, flower pot, pine cone) are drawn here in the partners' 100 × 100 box, in the picture book's plum-brown
// line.

const OUT = "#5a4636";
const WOOD = "#c08552";
const METAL = "#adb5bd";

/** An empty terracotta flower pot with its rim and the dark earth in it, seen a little from above. */
const flowerPot = h(
  "g",
  { stroke: OUT, strokeWidth: 3, strokeLinejoin: "round" },
  h("path", { d: "M20 38 H80 L70 92 H30 Z", fill: "#e8744f" }),
  h("rect", { x: 12, y: 24, width: 76, height: 18, rx: 4, fill: "#f08c63" }),
  h("ellipse", { cx: 50, cy: 28, rx: 33, ry: 5, fill: "#6b4a32", strokeWidth: 2 }),
  h("path", { d: "M30 54 Q34 70 36 84", fill: "none", stroke: "#f6a582", strokeWidth: 4, strokeLinecap: "round" }),
);

/** A pine cone hanging from its little stalk, its scales in rows. */
const pineCone = h(
  "g",
  { transform: "rotate(-10 50 50)", stroke: OUT, strokeWidth: 3, strokeLinejoin: "round" },
  h("path", { d: "M50 4 V16", strokeLinecap: "round", strokeWidth: 4 }),
  h("path", { d: "M50 14 Q76 22 74 54 Q72 84 50 96 Q28 84 26 54 Q24 22 50 14 Z", fill: "#a0662f" }),
  h("path", {
    d: "M34 32 Q42 38 50 32 Q58 38 66 32 M30 46 Q40 54 50 46 Q60 54 70 46 M29 60 Q39 68 50 60 Q61 68 71 60 M32 74 Q41 82 50 74 Q59 82 68 74 M40 87 Q45 91 50 87 Q55 91 60 87",
    fill: "none",
    stroke: "#5f3a17",
    strokeWidth: 2.5,
    strokeLinecap: "round",
  }),
);

/** A garden rake: a long wooden handle and a metal head with its tines, a little askew. */
const rake = h(
  "g",
  { transform: "rotate(-14 50 50)", stroke: OUT, strokeWidth: 3, strokeLinejoin: "round" },
  h("rect", { x: 46, y: 4, width: 8, height: 68, rx: 4, fill: WOOD }),
  h("rect", { x: 16, y: 68, width: 68, height: 10, rx: 4, fill: METAL }),
  h("path", { d: "M22 78v14M34 78v14M46 78v14M58 78v14M70 78v14M80 78v14", fill: "none", strokeWidth: 4, strokeLinecap: "round" }),
);

/** A spade: a wooden shaft with its T-grip and a rounded metal blade. */
const spade = h(
  "g",
  { transform: "rotate(14 50 50)", stroke: OUT, strokeWidth: 3, strokeLinejoin: "round" },
  h("rect", { x: 45, y: 12, width: 10, height: 50, fill: WOOD }),
  h("rect", { x: 33, y: 5, width: 34, height: 10, rx: 5, fill: WOOD }),
  h("path", { d: "M30 60h40v18q0 14-20 18q-20-4-20-18z", fill: METAL }),
  h("rect", { x: 42, y: 55, width: 16, height: 9, rx: 2, fill: "#868e96" }),
);

export const SCENES: SceneSpec[] = [
  {
    id: "baum-apfel",
    topic: "garten",
    name: "Baum",
    the: "der Baum",
    toThe: "zum Baum",
    partner: { name: "Apfel", the: "der Apfel", acc: "den Apfel", emoji: "🍎" },
    thing: "🌳",
    backdrop: "garten",
    props: [
      ["🌼", 36, 172, 18],
      ["🌷", 266, 170, 20],
    ],
    // The apple comes to hang in the tree's crown.
    act: "onto",
    spot: [170, 92, 32],
    sounds: ["pop"],
  },
  {
    id: "palme-kokosnuss",
    topic: "garten",
    name: "Palme",
    the: "die Palme",
    toThe: "zur Palme",
    partner: { name: "Kokosnuss", the: "die Kokosnuss", acc: "die Kokosnuss", emoji: "🥥" },
    thing: "🌴",
    backdrop: "strand",
    // The coconut hangs under the palm's leaves.
    act: "onto",
    spot: [146, 84, 32],
    sounds: ["thump"],
  },
  {
    id: "laub-rechen",
    topic: "garten",
    name: "Laub",
    the: "das Laub",
    toThe: "zum Laub",
    partner: { name: "Rechen", the: "der Rechen", acc: "den Rechen", draw: rake },
    thing: "🍂",
    backdrop: "herbst",
    props: [["🍁", 52, 172, 18]],
    // The rake rakes the leaves together.
    act: "rub",
    sounds: ["leaves", "rustle"],
  },
  {
    id: "kartoffeln-spaten",
    topic: "garten",
    name: "Kartoffeln",
    the: "die Kartoffeln",
    toThe: "zu den Kartoffeln",
    partner: { name: "Spaten", the: "der Spaten", acc: "den Spaten", draw: spade },
    thing: "🥔",
    backdrop: "gemuesebeet",
    props: [["🌿", 40, 162, 22]],
    // The spade digs the potatoes out of the bed.
    act: "tap",
    sounds: ["crunch", "thump"],
  },
  {
    id: "lagerfeuer-holz",
    topic: "garten",
    name: "Lagerfeuer",
    the: "das Lagerfeuer",
    toThe: "zum Lagerfeuer",
    partner: { name: "Holz", the: "das Holz", acc: "das Holz", emoji: "🪵" },
    thing: "🔥",
    backdrop: "nacht",
    props: [
      ["🪨", 58, 168, 22],
      ["🪨", 242, 168, 22],
    ],
    act: "into",
    sounds: ["thump", "crackle"],
  },
  {
    id: "feld-traktor",
    topic: "garten",
    name: "Feld",
    the: "das Feld",
    toThe: "zum Feld",
    partner: { name: "Traktor", the: "der Traktor", acc: "den Traktor", emoji: "🚜" },
    thing: "🌾",
    backdrop: "bauernhof",
    act: "beside",
    sounds: ["engine"],
  },
  {
    id: "mais-popcorn",
    topic: "garten",
    name: "Mais",
    the: "der Mais",
    toThe: "zum Mais",
    partner: { name: "Popcorn", the: "das Popcorn", acc: "das Popcorn", emoji: "🍿" },
    thing: "🌽",
    backdrop: "bauernhof",
    act: "beside",
    sounds: ["pop", "pop"],
  },
  {
    id: "meer-muschel",
    topic: "garten",
    name: "Meer",
    the: "das Meer",
    toThe: "zum Meer",
    partner: { name: "Muschel", the: "die Muschel", acc: "die Muschel", emoji: "🐚" },
    thing: "🌊",
    backdrop: "strand",
    act: "beside",
    sounds: ["splash"],
    // The bathtub's little boat would sail on the sea too.
    alsoFits: ["badewanne-schiffchen"],
  },
  {
    id: "berg-wanderschuh",
    topic: "garten",
    name: "Berg",
    the: "der Berg",
    toThe: "zum Berg",
    partner: { name: "Wanderschuh", the: "der Wanderschuh", acc: "den Wanderschuh", emoji: "🥾" },
    thing: "⛰️",
    backdrop: "berg",
    props: [["🌲", 40, 150, 26]],
    act: "beside",
    sounds: ["stamp"],
    // A hiking boot goes with the shoe too.
    alsoFits: ["schuh-socken"],
  },
  {
    id: "zelt-taschenlampe",
    topic: "garten",
    name: "Zelt",
    the: "das Zelt",
    toThe: "zum Zelt",
    partner: { name: "Taschenlampe", the: "die Taschenlampe", acc: "die Taschenlampe", emoji: "🔦" },
    thing: "⛺",
    backdrop: "nacht",
    props: [
      ["🌲", 40, 124, 30],
      ["🌲", 262, 124, 30],
    ],
    // Camping in the garden at night: the torch lights the tent up.
    act: "light",
    sounds: ["click", "chime"],
  },
  {
    id: "sonnenblume-biene",
    topic: "garten",
    name: "Sonnenblume",
    the: "die Sonnenblume",
    toThe: "zur Sonnenblume",
    partner: { name: "Biene", the: "die Biene", acc: "die Biene", emoji: "🐝" },
    thing: "🌻",
    backdrop: "garten",
    // The bee lands on the flower's head.
    act: "onto",
    spot: [148, 82, 46],
    sounds: ["buzz", "pop"],
    // Bees fly to every flower and make honey; the sunflower is watered and grows in a pot too.
    alsoFits: ["blume", "blumenstrauss-vase", "pfannkuchen-honig", "pflaenzchen-blumentopf"],
  },
  {
    id: "pflaenzchen-blumentopf",
    topic: "garten",
    name: "Pflänzchen",
    the: "das Pflänzchen",
    toThe: "zum Pflänzchen",
    partner: { name: "Blumentopf", the: "der Blumentopf", acc: "den Blumentopf", draw: flowerPot },
    thing: "🌱",
    backdrop: "fensterbank",
    // The pot comes down round the seedling's foot.
    act: "onto",
    spot: [150, 150, 56],
    sounds: ["thump", "rustle"],
    // A seedling is watered, planted with the spade and could stand in a vase; the flower has a pot already.
    alsoFits: ["blume", "kartoffeln-spaten", "blumenstrauss-vase"],
  },
  {
    id: "tanne-tannenzapfen",
    topic: "garten",
    name: "Tanne",
    the: "die Tanne",
    toThe: "zur Tanne",
    partner: { name: "Tannenzapfen", the: "der Tannenzapfen", acc: "den Tannenzapfen", draw: pineCone },
    thing: "🌲",
    backdrop: "wald",
    // Bigger than usual: the fir's emoji is narrow, and the wood's own firs stand tall round it.
    thingAt: [150, 102, 124],
    // The cone comes to hang in the fir's branches.
    act: "onto",
    spot: [170, 106, 42],
    sounds: ["rustle", "pop"],
    // Cones hang on the Christmas tree and on other trees too, and a fir gives wood for the fire.
    alsoFits: ["tannenbaum-weihnachtsstern", "baum-apfel", "lagerfeuer-holz"],
  },
];
