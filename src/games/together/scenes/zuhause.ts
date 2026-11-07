import { createElement as h } from "react";
import type { SceneSpec } from "../scene";

// The pairs of the topic „zuhause“ (topics.ts), written as data (see scene.tsx): the bedroom, the living room,
// reading, the computer corner, tidying up and the tools of the little workbench at home. Kitchen, bathroom and garden
// things are their own topics'; the torch and its battery went to „unterwegs“, needle and thread, the jacket and the
// handbag to „kleidung“, the bucket and sponge to „bad“. The partners without an emoji (the remote, the dustpan, the
// table, the cushion, the banana peel, the board, the curtain) are drawn here in the partners' 100 × 100 box, in the
// picture book's plum-brown line.

const OUT = "#5a4636";
const WOOD = "#d9a066";
const WOOD_DARK = "#b5793a";
const LINE = { stroke: OUT, strokeWidth: 3, strokeLinejoin: "round", strokeLinecap: "round" } as const;

/** A TV remote, a little askew: a dark body, a red button on top, rows of grey buttons and four coloured ones. */
const remote = h(
  "g",
  { transform: "rotate(-14 50 50)" },
  h("rect", { x: 31, y: 6, width: 38, height: 88, rx: 12, fill: "#495057", ...LINE }),
  h("circle", { cx: 50, cy: 20, r: 6, fill: "#fa5252", ...LINE, strokeWidth: 2 }),
  ...[36, 48, 60].flatMap((y) => [38, 50, 62].map((x) => h("circle", { cx: x, cy: y, r: 3.6, fill: "#ced4da" }))),
  ...["#ff8787", "#69db7c", "#ffd43b", "#74c0fc"].map((fill, i) => h("rect", { x: 36 + i * 7.6, y: 74, width: 5.6, height: 8, rx: 2, fill })),
);

/** A dustpan seen from the front: its wide flat scoop and the handle standing up from its back. */
const dustpan = h(
  "g",
  { transform: "rotate(-8 50 50)" },
  h("rect", { x: 42, y: 6, width: 16, height: 36, rx: 7, fill: "#f76707", ...LINE }),
  h("path", { d: "M8 84 L20 38 Q50 30 80 38 L92 84 Z", fill: "#ff922b", ...LINE }),
  h("path", { d: "M22 78 L29 46 Q50 41 71 46 L78 78 Z", fill: "#ffc078" }),
  h("rect", { x: 4, y: 80, width: 92, height: 8, rx: 4, fill: "#f76707", ...LINE }),
);

/** A small wooden table seen from the front: its top, the frame below it and its legs. */
const table = h(
  "g",
  LINE,
  h("rect", { x: 18, y: 44, width: 10, height: 46, rx: 2, fill: WOOD_DARK }),
  h("rect", { x: 72, y: 44, width: 10, height: 46, rx: 2, fill: WOOD_DARK }),
  h("rect", { x: 14, y: 40, width: 72, height: 10, fill: WOOD_DARK }),
  h("rect", { x: 6, y: 28, width: 88, height: 14, rx: 4, fill: WOOD }),
  h("path", { d: "M14 34 H60", stroke: "#f0c48a" }),
);

/** A soft square cushion, its sides a little drawn in, a button in its middle and a dot pattern. */
const cushion = h(
  "g",
  { transform: "rotate(-6 50 50)" },
  h("path", { d: "M12 16 Q50 26 88 16 Q78 50 88 84 Q50 74 12 84 Q22 50 12 16 Z", fill: "#f783ac", ...LINE }),
  ...[
    [32, 34],
    [68, 34],
    [32, 66],
    [68, 66],
    [50, 32],
    [50, 68],
    [30, 50],
    [70, 50],
  ].map(([cx, cy]) => h("circle", { cx, cy, r: 3, fill: "#fcc2d7" })),
  h("circle", { cx: 50, cy: 50, r: 5, fill: "#d6336c", ...LINE, strokeWidth: 2 }),
);

/** A banana peel lying open: three yellow flaps from its brown stalk, pale on their insides. */
const bananaPeel = h(
  "g",
  { transform: "rotate(-6 50 50)" },
  h("path", { d: "M50 36 Q30 42 14 84 Q24 88 34 72 Q44 56 52 50 Z", fill: "#ffd43b", ...LINE }),
  h("path", { d: "M50 36 Q70 42 86 84 Q76 88 66 72 Q56 56 48 50 Z", fill: "#ffd43b", ...LINE }),
  h("path", { d: "M44 46 Q30 60 22 78 Q30 72 38 62 Z", fill: "#fff3bf" }),
  h("path", { d: "M56 46 Q70 60 78 78 Q70 72 62 62 Z", fill: "#fff3bf" }),
  h("path", { d: "M43 40 Q41 72 50 94 Q59 72 57 40 Z", fill: "#fcc419", ...LINE }),
  h("circle", { cx: 15, cy: 84, r: 3, fill: "#8f5b2e" }),
  h("circle", { cx: 85, cy: 84, r: 3, fill: "#8f5b2e" }),
  h("rect", { x: 45, y: 16, width: 10, height: 24, rx: 4, fill: "#a9864e", ...LINE }),
);

/** A wooden board lying askew, with its grain and a knot. */
const board = h(
  "g",
  { transform: "rotate(-18 50 50)" },
  h("rect", { x: 4, y: 36, width: 92, height: 28, rx: 3, fill: "#e8bd84", ...LINE }),
  h("path", { d: "M10 45 Q40 41 60 46 T92 44 M10 56 Q34 52 56 57 T92 55", fill: "none", stroke: "#c99559", strokeWidth: 2 }),
  h("ellipse", { cx: 70, cy: 50, rx: 5, ry: 3, fill: "#c99559" }),
);

/** A curtain: a rod with round ends and two drapes hanging from it, each held back by a yellow tie. */
const curtain = h(
  "g",
  null,
  h("path", { d: "M6 12 H27 Q26 30 18 48 Q25 66 27 92 H6 Z", fill: "#ff8787", ...LINE }),
  h("path", { d: "M94 12 H73 Q74 30 82 48 Q75 66 73 92 H94 Z", fill: "#ff8787", ...LINE }),
  h("path", { d: "M14 16 Q16 34 12 46 M17 54 Q19 74 15 90 M86 16 Q84 34 88 46 M83 54 Q81 74 85 90", fill: "none", stroke: "#e35d5d", strokeWidth: 3 }),
  h("path", { d: "M6 48 H20 M94 48 H80", stroke: "#fab005", strokeWidth: 5, strokeLinecap: "round" }),
  h("rect", { x: 4, y: 7, width: 92, height: 7, rx: 3.5, fill: WOOD_DARK, ...LINE, strokeWidth: 2.5 }),
  h("circle", { cx: 5, cy: 10.5, r: 5, fill: WOOD, ...LINE, strokeWidth: 2.5 }),
  h("circle", { cx: 95, cy: 10.5, r: 5, fill: WOOD, ...LINE, strokeWidth: 2.5 }),
);

export const SCENES: SceneSpec[] = [
  {
    id: "bett-teddy",
    topic: "zuhause",
    name: "Bett",
    the: "das Bett",
    toThe: "zum Bett",
    partner: { name: "Teddy", the: "der Teddy", acc: "den Teddy", emoji: "🧸" },
    thing: "🛏️",
    backdrop: "kinderzimmer",
    act: "onto",
    sounds: ["hop", "rustle"],
  },
  {
    id: "buch-lesezeichen",
    topic: "zuhause",
    name: "Buch",
    the: "das Buch",
    toThe: "zum Buch",
    partner: { name: "Lesezeichen", the: "das Lesezeichen", acc: "das Lesezeichen", emoji: "🔖" },
    thing: "📖",
    backdrop: "schlafzimmer",
    act: "into",
    sounds: ["rustle", "plop"],
  },
  {
    id: "zeitung-brille",
    topic: "zuhause",
    name: "Zeitung",
    the: "die Zeitung",
    toThe: "zur Zeitung",
    partner: { name: "Brille", the: "die Brille", acc: "die Brille", emoji: "👓" },
    thing: "📰",
    backdrop: "wohnzimmer",
    act: "beside",
    sounds: ["rustle", "pop"],
    // Grown-ups read a book with their glasses too.
    alsoFits: ["buch-lesezeichen"],
  },
  {
    id: "computer-tastatur",
    topic: "zuhause",
    name: "Computer",
    the: "der Computer",
    toThe: "zum Computer",
    partner: { name: "Tastatur", the: "die Tastatur", acc: "die Tastatur", emoji: "⌨️" },
    thing: "🖥️",
    backdrop: "wohnzimmer",
    act: "beside",
    sounds: ["click", "tick"],
    alsoFits: ["laptop-maus"],
  },
  {
    id: "laptop-maus",
    topic: "zuhause",
    name: "Laptop",
    the: "der Laptop",
    toThe: "zum Laptop",
    partner: { name: "Maus", the: "die Maus", acc: "die Maus", emoji: "🖱️" },
    thing: "💻",
    backdrop: "wohnzimmer",
    act: "beside",
    sounds: ["click"],
    alsoFits: ["computer-tastatur"],
  },
  {
    id: "handy-ladekabel",
    topic: "zuhause",
    name: "Handy",
    the: "das Handy",
    toThe: "zum Handy",
    partner: { name: "Ladekabel", the: "das Ladekabel", acc: "das Ladekabel", emoji: "🔌" },
    thing: "📱",
    backdrop: "wohnzimmer",
    // Plugged in, the phone lights up.
    act: "light",
    sounds: ["click", "chime"],
    // The computer and the laptop are charged with a cable too.
    alsoFits: ["computer-tastatur", "laptop-maus"],
  },
  {
    id: "drucker-papier",
    topic: "zuhause",
    name: "Drucker",
    the: "der Drucker",
    toThe: "zum Drucker",
    partner: { name: "Blatt Papier", the: "das Blatt Papier", acc: "das Blatt Papier", emoji: "📄" },
    thing: "🖨️",
    backdrop: "wohnzimmer",
    act: "into",
    sounds: ["whirr", "rustle"],
  },
  {
    id: "schraube-schraubenzieher",
    topic: "zuhause",
    name: "Schraube",
    the: "die Schraube",
    toThe: "zur Schraube",
    partner: { name: "Schraubenzieher", the: "der Schraubenzieher", acc: "den Schraubenzieher", emoji: "🪛" },
    thing: "🔩",
    backdrop: "werkstatt",
    act: "turn",
    sounds: ["click", "squeak"],
  },
  {
    id: "werkzeugkasten-hammer",
    topic: "zuhause",
    name: "Werkzeugkasten",
    the: "der Werkzeugkasten",
    toThe: "zum Werkzeugkasten",
    partner: { name: "Hammer", the: "der Hammer", acc: "den Hammer", emoji: "🔨" },
    thing: "🧰",
    backdrop: "werkstatt",
    act: "into",
    sounds: ["clonk"],
    // The screwdriver lives in the toolbox too.
    alsoFits: ["schraube-schraubenzieher"],
  },
  {
    id: "fernseher-fernbedienung",
    topic: "zuhause",
    name: "Fernseher",
    the: "der Fernseher",
    toThe: "zum Fernseher",
    partner: { name: "Fernbedienung", the: "die Fernbedienung", acc: "die Fernbedienung", draw: remote },
    thing: "📺",
    backdrop: "wohnzimmer",
    act: "beside",
    sounds: ["click", "ding"],
  },
  {
    id: "besen-kehrschaufel",
    topic: "zuhause",
    name: "Besen",
    the: "der Besen",
    toThe: "zum Besen",
    partner: { name: "Kehrschaufel", the: "die Kehrschaufel", acc: "die Kehrschaufel", draw: dustpan },
    thing: "🧹",
    backdrop: "flur",
    act: "beside",
    sounds: ["rustle", "clonk"],
    // The broom sweeps leaves too, and the rake's leaves go onto the dustpan.
    alsoFits: ["laub-rechen"],
  },
  {
    id: "stuhl-tisch",
    topic: "zuhause",
    name: "Stuhl",
    the: "der Stuhl",
    toThe: "zum Stuhl",
    partner: { name: "Tisch", the: "der Tisch", acc: "den Tisch", draw: table },
    thing: "🪑",
    // A children's room with no table in it yet (the dining room and the Kita room have one).
    backdrop: "kinderzimmer",
    act: "beside",
    spot: [220, 134, 80],
    sounds: ["thump", "knock"],
    // A cushion goes onto a chair too, and a little table stands by the sofa.
    alsoFits: ["sofa-kissen"],
  },
  {
    id: "sofa-kissen",
    topic: "zuhause",
    name: "Sofa",
    the: "das Sofa",
    toThe: "zum Sofa",
    partner: { name: "Kissen", the: "das Kissen", acc: "das Kissen", draw: cushion },
    thing: "🛋️",
    // In front of the big window: the living room has a sofa of its own already.
    backdrop: "fensterbank",
    // The cushion comes to lean against the sofa's back.
    act: "onto",
    spot: [132, 100, 46],
    sounds: ["puff", "hop"],
    // A cushion belongs on the bed too, and the teddy on the sofa.
    alsoFits: ["bett-teddy"],
  },
  {
    id: "muelleimer-bananenschale",
    topic: "zuhause",
    name: "Mülleimer",
    the: "der Mülleimer",
    toThe: "zum Mülleimer",
    partner: { name: "Bananenschale", the: "die Bananenschale", acc: "die Bananenschale", draw: bananaPeel },
    thing: "🗑️",
    backdrop: "kueche",
    act: "into",
    sounds: ["whoosh", "plop"],
    // An old sheet of paper goes into the bin too.
    alsoFits: ["drucker-papier"],
  },
  {
    id: "saege-brett",
    topic: "zuhause",
    name: "Säge",
    the: "die Säge",
    toThe: "zur Säge",
    partner: { name: "Brett", the: "das Brett", acc: "das Brett", draw: board },
    thing: "🪚",
    backdrop: "werkstatt",
    // The board goes to and fro under the saw.
    act: "rub",
    sounds: ["saw"],
    // The campfire's wood is sawn too, and the saw lies with the hammer and the screwdriver in the toolbox.
    alsoFits: ["lagerfeuer-holz", "werkzeugkasten-hammer", "schraube-schraubenzieher"],
  },
  {
    id: "fenster-vorhang",
    topic: "zuhause",
    name: "Fenster",
    the: "das Fenster",
    toThe: "zum Fenster",
    partner: { name: "Vorhang", the: "der Vorhang", acc: "den Vorhang", draw: curtain },
    thing: "🪟",
    // The hallway's plain wall: the other rooms' windows have their curtains already.
    backdrop: "flur",
    // The curtain comes down round the window, framing it.
    act: "onto",
    spot: [150, 104, 150],
    sounds: ["swirl", "rustle"],
    // A window is washed with the sponge.
    alsoFits: ["eimer-schwamm"],
  },
];
