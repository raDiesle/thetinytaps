import { createElement as h } from "react";
import type { SceneSpec } from "../scene";

// The pairs of the topic „kita“ (topics.ts), written as data (see scene.tsx): the Kita and school things a child
// knows from its day there – the school bag, writing in a notebook, cutting coloured paper. Paper, pencils and
// crayons belong loosely to each other and to the painting things of „spielen“, so those name each other in `alsoFits`.

const OUT = "#5a4636";

/** Three sheets of coloured paper fanned out, the top one with a little cut zigzag at its edge. */
const colouredPaper = h(
  "g",
  { stroke: OUT, strokeWidth: 3, strokeLinejoin: "round" },
  h("rect", { x: 14, y: 22, width: 56, height: 66, rx: 2, fill: "#74c0fc", transform: "rotate(-14 42 55)" }),
  h("rect", { x: 26, y: 18, width: 56, height: 66, rx: 2, fill: "#ffd43b", transform: "rotate(-2 54 51)" }),
  h("path", { d: "M36 20 L88 24 L84 90 L32 86 L33 74 L39 70 L33 66 L39 62 L34 58 Z", fill: "#ff8787", transform: "rotate(8 60 55)" }),
);

export const SCENES: SceneSpec[] = [
  {
    id: "schule-schulranzen",
    topic: "kita",
    name: "Schule",
    the: "die Schule",
    toThe: "zur Schule",
    partner: { name: "Schulranzen", the: "der Schulranzen", acc: "den Schulranzen", emoji: "🎒" },
    thing: "🏫",
    backdrop: "strasse",
    act: "beside",
    sounds: ["thump", "ring"],
    // The notebook and the lunch go into the school bag.
    alsoFits: ["heft-stift", "pausenbrot-brotdose"],
  },
  {
    id: "heft-stift",
    topic: "kita",
    name: "Heft",
    the: "das Heft",
    toThe: "zum Heft",
    partner: { name: "Kuli", the: "der Kuli", acc: "den Kuli", emoji: "🖊️" },
    // Not 📓, whose cover carries a printed label.
    thing: "📒",
    backdrop: "schule",
    // The pen writes in the notebook.
    act: "rub",
    sounds: ["rustle", "tick"],
    // The pencil and the crayon write in a notebook too, and the pen on paper.
    alsoFits: ["lineal-bleistift", "papier", "schule-schulranzen"],
  },
  {
    id: "schere-buntpapier",
    topic: "kita",
    name: "Schere",
    the: "die Schere",
    toThe: "zur Schere",
    partner: { name: "Buntpapier", the: "das Buntpapier", acc: "das Buntpapier", draw: colouredPaper },
    thing: "✂️",
    backdrop: "maltisch",
    // The scissors cut the paper, snip by snip, between their blades.
    act: "rub",
    spot: [150, 130, 54],
    sounds: ["snap", "rip"],
    // Scissors cut the printer's paper too.
    alsoFits: ["drucker-papier"],
  },
];
