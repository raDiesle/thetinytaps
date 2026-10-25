// „Hatschi-Kette“: which animals sit in the row, where they sit, where each
// sneeze starts and lands, and how long each step takes. The level itself
// (`SneezeLevel.tsx`) only counts the seconds and draws.

import type { Pt } from "./path";

/** The meadow the animals sit on. */
export const FLOOR = 800;
/** Room before the first animal, in the picture's pixels. */
const MARGIN = 240;

/** One kind of animal in the row. */
export type AnimalId = "mouse" | "chick" | "duck" | "rabbit" | "cat" | "dog" | "pig" | "sheep" | "cow" | "elephant";

/**
 * How a kind of animal is built. Every animal is drawn sitting, facing us, in
 * its own units: 100 high, the ground at y 0, the middle at x 0. `height` is
 * how tall that comes out in the picture.
 */
export interface AnimalKind {
  id: AnimalId;
  /** Height in the picture's pixels. */
  height: number;
  /** Width in its own units, ears and tail included. */
  width: number;
  /** The body sits on the ground; its half width and half height. */
  body: { rx: number; ry: number };
  /** The head: its radius, and how high its middle is above the ground. */
  head: { r: number; y: number };
}

/** Every animal that can sit in the row, smallest first. */
export const KINDS: Record<AnimalId, AnimalKind> = {
  mouse: { id: "mouse", height: 100, width: 92, body: { rx: 26, ry: 26 }, head: { r: 24, y: 70 } },
  chick: { id: "chick", height: 115, width: 74, body: { rx: 32, ry: 32 }, head: { r: 25, y: 72 } },
  duck: { id: "duck", height: 130, width: 74, body: { rx: 30, ry: 30 }, head: { r: 24, y: 72 } },
  rabbit: { id: "rabbit", height: 150, width: 62, body: { rx: 26, ry: 25 }, head: { r: 22, y: 60 } },
  cat: { id: "cat", height: 170, width: 92, body: { rx: 27, ry: 28 }, head: { r: 26, y: 68 } },
  dog: { id: "dog", height: 200, width: 80, body: { rx: 28, ry: 28 }, head: { r: 27, y: 68 } },
  pig: { id: "pig", height: 205, width: 84, body: { rx: 33, ry: 28 }, head: { r: 27, y: 66 } },
  sheep: { id: "sheep", height: 225, width: 88, body: { rx: 34, ry: 30 }, head: { r: 22, y: 68 } },
  cow: { id: "cow", height: 340, width: 92, body: { rx: 30, ry: 30 }, head: { r: 25, y: 68 } },
  elephant: { id: "elephant", height: 500, width: 116, body: { rx: 36, ry: 30 }, head: { r: 30, y: 62 } },
};

/** The animals that may sit between the mouse and the cow, smallest first. */
const MIDDLE: AnimalId[] = ["chick", "duck", "rabbit", "cat", "dog", "pig", "sheep"];
/** How many of them sit in the row each round. */
const MIDDLE_COUNT = 5;

/**
 * Who sits in the row this round: always the mouse first (the feather tickles
 * it), then five of the middle animals, then the cow and the elephant, so the
 * row always grows from small to big.
 */
export function pickAnimals(random = Math.random): AnimalId[] {
  const pool = [...MIDDLE];
  while (pool.length > MIDDLE_COUNT) pool.splice(Math.floor(random() * pool.length), 1);
  return ["mouse", ...pool, "cow", "elephant"];
}

/** How big an animal is between the mouse (0) and the elephant (1): its sneeze grows with it. */
export const sizeOf = (kind: AnimalKind) => (kind.height - KINDS.mouse.height) / (KINDS.elephant.height - KINDS.mouse.height);

/** An animal in its place in the row. */
export interface Seat {
  kind: AnimalKind;
  /** Its middle, in the picture's pixels. */
  x: number;
  /** Its units times this are the picture's pixels. */
  s: number;
}

/** The tree at the end of the row, whose leaves the elephant blows off. */
export interface Tree {
  /** The middle of the trunk. */
  x: number;
  /** The middle of the crown and its radius. */
  crown: Pt;
  r: number;
}

/** The whole row: the animals, the tree and how wide the meadow is. */
export interface Row {
  seats: Seat[];
  tree: Tree;
  worldW: number;
}

/** The room between two animals: more between big ones, so their sneezes have room to fly. */
const gapBetween = (a: AnimalKind, b: AnimalKind) => 80 + 0.25 * (a.height + b.height);

/** Puts the animals in a row on the meadow, with the tree after the last one. */
export function layOutRow(ids: AnimalId[]): Row {
  const seats: Seat[] = [];
  let right = MARGIN;
  ids.forEach((id, i) => {
    const kind = KINDS[id];
    const s = kind.height / 100;
    const half = (kind.width * s) / 2;
    if (i > 0) right += gapBetween(KINDS[ids[i - 1]], kind);
    seats.push({ kind, x: right + half, s });
    right += 2 * half;
  });
  const x = right + 380;
  const tree = { x, crown: { x: x - 20, y: 300 }, r: 210 };
  return { seats, tree, worldW: x + 320 };
}

/** Where on an animal's face its sneeze comes out: the nose, or the tip of the elephant's raised trunk. */
export function noseOf({ kind, x, s }: Seat): Pt {
  if (kind.id === "elephant") return { x: x + 54 * s, y: FLOOR - 94 * s };
  return { x: x + kind.head.r * 0.35 * s, y: FLOOR - (kind.head.y - kind.head.r * 0.2) * s };
}

/** Where a sneeze hits an animal: the cheek on the side it comes from. */
export function cheekOf({ kind, x, s }: Seat): Pt {
  return { x: x - kind.head.r * 0.6 * s, y: FLOOR - kind.head.y * s };
}

/** Where the elephant's sneeze hits the tree: the left side of its crown. */
export const leafyOf = (tree: Tree): Pt => ({ x: tree.crown.x - tree.r * 0.55, y: tree.crown.y + 20 });

/** Seconds from being hit (or tickled) to the first „ha…“: the animal looks surprised and its fur ruffles. */
export const REACT_S = 0.55;
/** The mouse takes a little longer: the feather tickles its nose first. */
export const TICKLE_S = 0.9;
/** Seconds the feather floats down to the mouse's nose after the tap. */
export const FEATHER_S = 2;
/** Seconds of „ha… ha…“ before the sneeze: longer for bigger animals. */
export const haSeconds = (kind: AnimalKind) => 1 + 0.8 * sizeOf(kind);
/** Seconds a sneeze flies from `from` to `to`. */
export const travelSeconds = (from: Pt, to: Pt) => 0.45 + Math.hypot(to.x - from.x, to.y - from.y) / 1600;
/** After the elephant's sneeze reaches the tree: seconds until everyone laughs, and how long they laugh. */
export const LAUGH_AFTER_S = 1;
export const LAUGH_S = 2.4;
/** Seconds after the laughing starts until the level is done. */
export const DONE_AFTER_LAUGH_S = 2.6;

/** Where the sneeze of the animal in seat `i` flies to: the next animal's cheek, or the tree. */
export const targetOf = (row: Row, i: number): Pt => (i + 1 < row.seats.length ? cheekOf(row.seats[i + 1]) : leafyOf(row.tree));

/** How long a round takes when the child only taps once, in seconds. */
export function plannedSeconds(row: Row) {
  let t = FEATHER_S;
  row.seats.forEach((seat, i) => {
    t += (i === 0 ? TICKLE_S : REACT_S) + haSeconds(seat.kind) + travelSeconds(noseOf(seat), targetOf(row, i));
  });
  return t + LAUGH_AFTER_S + DONE_AFTER_LAUGH_S;
}

/** A leaf blown off the tree: where it starts in the crown, where it lands, and how it whirls on the way. */
export interface Leaf {
  from: Pt;
  to: Pt;
  /** Seconds from the tree to the grass. */
  fall: number;
  /** How high it is blown up first, and how wide it swings to and fro on the way down. */
  lift: number;
  swing: number;
  /** Turns while it whirls (radians), and where in its swing it starts. */
  spin: number;
  phase: number;
  /** 0 and 1 are greens, 2 yellow, 3 orange. */
  color: number;
}

/** How many leaves the crown has. */
export const LEAF_COUNT = 40;

/**
 * The leaves of the tree, the same every round. They land on the grass
 * between the cow and the tree, and some on the animals' way, so it rains
 * leaves on everyone.
 */
export function leavesOf(tree: Tree): Leaf[] {
  // A small fixed sequence instead of Math.random, so the leaves look the same each time and tests can check them.
  let seed = 7;
  const next = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  return Array.from({ length: LEAF_COUNT }, (_, i) => {
    const a = next() * 2 * Math.PI;
    const d = Math.sqrt(next()) * tree.r * 0.85;
    return {
      from: { x: tree.crown.x + d * Math.cos(a), y: tree.crown.y + d * Math.sin(a) * 0.8 },
      to: { x: tree.x - 1150 + next() * 1450, y: FLOOR + 6 + next() * 70 },
      fall: 2.2 + next() * 1.1,
      lift: 80 + next() * 220,
      swing: 30 + next() * 50,
      spin: (next() < 0.5 ? -1 : 1) * (4 + next() * 6),
      phase: next() * 2 * Math.PI,
      color: i % 7 === 3 ? 2 : i % 7 === 5 ? 3 : i % 2,
    };
  });
}
