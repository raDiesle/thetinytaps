import { createElement as h } from "react";
import type { SceneSpec } from "../scene";

// The pairs of the topic „garten“ (topics.ts), written as data (see scene.tsx). The garden's tools that have no emoji
// (rake, spade) are drawn here in the partners' 100 × 100 box, in the picture book's plum-brown line.

const OUT = "#5a4636";
const WOOD = "#c08552";
const METAL = "#adb5bd";

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
];
