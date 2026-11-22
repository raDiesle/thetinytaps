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
  return { seats, tree, worldW: x + MEADOW_AFTER_TREE };
}

/** How far the meadow of the first part reaches past the tree: the camera's right edge while the leaves fall. */
export const TREE_ROOM = 320;
/** How far the whole meadow reaches past the tree, with the second part's things on it. */
export const MEADOW_AFTER_TREE = 3050;

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
  return leavesSeconds(row) + PART2_AFTER_LEAVES_S + PART2.laugh + DONE_AFTER_LAUGH_S;
}

/** Seconds from the tap until the elephant's sneeze reaches the tree, when nobody hurries it. */
export function leavesSeconds(row: Row) {
  let t = FEATHER_S;
  row.seats.forEach((seat, i) => {
    t += (i === 0 ? TICKLE_S : REACT_S) + haSeconds(seat.kind) + travelSeconds(noseOf(seat), targetOf(row, i));
  });
  return t;
}

/* ---------- The second part: what the sneezes set off past the tree ---------- */

/** The second part starts once the row has laughed at the leaves: the squirrel they uncovered scolds. */
export const PART2_AFTER_LEAVES_S = LAUGH_AFTER_S + LAUGH_S;

/**
 * The moments of the second part, in seconds since it starts. The squirrel
 * the leaves uncovered drops its acorn, which hops along to a puffball; its
 * spores drift to a tortoise, which sneezes inside its shell and hops against
 * a straw beehive; the bees fly through the dandelions, whose seeds float up
 * to a sleeping cloud; the cloud sneezes a gust that lifts a kite, whose tail
 * tickles the scarecrow's nose, and his sneeze blows his hat off.
 */
export const PART2 = {
  /** The squirrel scolds the row for blowing its leaves away. */
  chatter: 0,
  /** The acorn slips from its paws, bounces three times and rolls to the puffball. */
  slip: 1.2,
  bounces: [1.8, 2.35, 2.8],
  puff: 3.7,
  /** The spores drift to the tortoise: it sniffs, „ha… ha…“, pulls its head in and sneezes inside its shell. */
  sniff: 7,
  ha: 7.5,
  ha2: 8.2,
  hide: 8.9,
  tortoise: 9.3,
  /** The shell hops, spinning once, and lands against the beehive's stool. */
  land: 10.3,
  /** The bees come out, buzz round, and fly through the dandelions one after the other. */
  bees: 10.6,
  flowers: [13, 13.4, 13.8, 14.2],
  /** The seeds float up to the sleeping cloud, which wakes, „ha… ha…“, and sneezes a gust. */
  wake: 17,
  cloudHa: 17.5,
  cloudHa2: 18.3,
  cloud: 19.1,
  /** The gust lifts the kite, which climbs, then swoops so its tail tickles the scarecrow's nose. */
  lift: 20.3,
  high: 23.5,
  tickle: 24.8,
  crowHa: 25.3,
  crowHa2: 26,
  scarecrow: 26.7,
  /** His hat, blown up, lands back on his head, crooked. */
  hat: 29.6,
  /** Everyone past the tree laughs. */
  laugh: 30.2,
} as const;

/*
 * Where the second part's things stand and how they move, `u` seconds into
 * it. Every x is measured from the tree's trunk, every y is the picture's.
 * They are plain functions of the time, so a tap that hurries the chain on
 * just moves the time, and the tests can check that each thing reaches the
 * next.
 */

const clamp01 = (k: number) => Math.min(1, Math.max(0, k));
/** How far `u` is from `a` to `b`, 0 to 1. */
const along = (u: number, a: number, b: number) => clamp01((u - a) / (b - a));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const smooth = (k: number) => (k < 0.5 ? 2 * k * k : 1 - 2 * (1 - k) * (1 - k));
const outward = (k: number) => 1 - (1 - k) * (1 - k);
/** A hop's height at `k` of its way, `h` at the top. */
const arc = (k: number, h: number) => 4 * h * k * (1 - k);

/** The squirrel on the tree's right branch: where its feet hold on. */
export const SQUIRREL = { x: 120, y: 255 } as const;
/** The acorn in its paws. */
export const ACORN_R = 13;
/** The puffball on the grass: its middle and radius. */
export const PUFFBALL = { x: 560, y: FLOOR - 40, r: 46 } as const;
/** Where the acorn's bounces land. */
const ACORN_HOPS = [190, 290, 380, PUFFBALL.x - PUFFBALL.r - ACORN_R + 2];

/** The acorn: in the squirrel's paws, falling, bouncing three times, rolling into the puffball and back a little. */
export function acornAt(u: number): Pt & { turn: number } {
  const [b0, b1, b2] = PART2.bounces;
  let x: number;
  let y: number;
  if (u < PART2.slip) {
    x = SQUIRREL.x + 2;
    y = SQUIRREL.y - 30;
  } else if (u < b0) {
    const k = along(u, PART2.slip, b0);
    x = mix(SQUIRREL.x + 2, ACORN_HOPS[0], k);
    y = mix(SQUIRREL.y - 30, FLOOR - ACORN_R, k * k);
  } else if (u < b1) {
    const k = along(u, b0, b1);
    x = mix(ACORN_HOPS[0], ACORN_HOPS[1], k);
    y = FLOOR - ACORN_R - arc(k, 90);
  } else if (u < b2) {
    const k = along(u, b1, b2);
    x = mix(ACORN_HOPS[1], ACORN_HOPS[2], k);
    y = FLOOR - ACORN_R - arc(k, 45);
  } else if (u < PART2.puff) {
    x = mix(ACORN_HOPS[2], ACORN_HOPS[3], along(u, b2, PART2.puff));
    y = FLOOR - ACORN_R;
  } else {
    x = ACORN_HOPS[3] - 30 * outward(along(u, PART2.puff, PART2.puff + 0.5));
    y = FLOOR - ACORN_R;
  }
  return { x, y, turn: u < b0 ? 0 : (x - ACORN_HOPS[0]) / ACORN_R };
}

/** The tortoise, seen from the side and looking back at the puffball: its shell's middle, half width and its nose. */
export const TORTOISE = { x: 950, rx: 90, h: 86, nose: { dx: -128, y: FLOOR - 50 } } as const;
/** The straw beehive on its stool: the stool's height and how far its legs stand apart. */
export const HIVE = { x: 1250, stool: 80, legs: 60, rx: 74, h: 140 } as const;
/** Where the shell lands after its hop: right against the stool's left leg. */
export const TORTOISE_LANDS = HIVE.x - HIVE.legs - TORTOISE.rx - 12;

/** The cloud of spores puffed from the puffball, drifting over to the tortoise's nose; null when there is none. */
export function sporesAt(u: number): (Pt & { spread: number; fade: number }) | null {
  if (u < PART2.puff || u > PART2.sniff + 0.5) return null;
  const k = along(u, PART2.puff, PART2.sniff);
  const nose = { x: TORTOISE.x + TORTOISE.nose.dx, y: TORTOISE.nose.y };
  const gone = along(u, PART2.sniff, PART2.sniff + 0.5);
  return {
    x: mix(PUFFBALL.x, nose.x, smooth(k)),
    y: mix(PUFFBALL.y - 60, nose.y, k) - 170 * Math.sin(Math.PI * k),
    spread: (20 + 50 * Math.min(1, k * 2)) * (1 - gone),
    fade: 1 - gone,
  };
}

/** The tortoise's shell: where it is, how high it hops and how far it has turned (degrees). */
export function shellAt(u: number): { x: number; lift: number; turn: number } {
  if (u < PART2.tortoise) return { x: TORTOISE.x, lift: 0, turn: 0 };
  const k = along(u, PART2.tortoise, PART2.land);
  return { x: mix(TORTOISE.x, TORTOISE_LANDS, k), lift: arc(k, 140), turn: 360 * smooth(k) };
}

/** The dandelions: their stems' feet and how tall they are. */
export const FLOWERS = [
  { x: 1450, h: 150 },
  { x: 1520, h: 125 },
  { x: 1590, h: 165 },
  { x: 1660, h: 135 },
] as const;
/** A dandelion clock's radius. */
export const FLOWER_R = 26;
const headOf = (i: number): Pt => ({ x: FLOWERS[i].x, y: FLOOR - FLOWERS[i].h });

/** How many bees come out of the hive. */
export const BEES = 3;
/** The hive's little door, where the bees come out. */
export const HIVE_DOOR: Pt = { x: HIVE.x, y: FLOOR - HIVE.stool - 28 };

/** Bee `j`: a loop round the hive, then through the dandelion clocks one after the other, and home; null while it is inside. */
export function beeAt(j: number, u: number): Pt | null {
  const s = u - 0.25 * j;
  const home = PART2.flowers[3] + 1.2;
  if (s < PART2.bees || s > home) return null;
  const loopEnd = 12.4;
  const off = { x: 18 * j, y: -12 * j };
  if (s < loopEnd) {
    const q = along(s, PART2.bees, loopEnd);
    return { x: HIVE_DOOR.x + 150 * Math.sin(2 * Math.PI * q) + off.x * q, y: HIVE_DOOR.y - 160 * Math.sin(Math.PI * q) + off.y * q };
  }
  const start = { x: HIVE_DOOR.x + off.x, y: HIVE_DOOR.y + off.y };
  if (s < PART2.flowers[0]) {
    const k = along(s, loopEnd, PART2.flowers[0]);
    const to = headOf(0);
    return { x: mix(start.x, to.x, k), y: mix(start.y, to.y + off.y, k) - arc(k, 70) };
  }
  if (s < PART2.flowers[3]) {
    const i = Math.min(2, Math.floor((s - PART2.flowers[0]) / 0.4));
    const k = along(s, PART2.flowers[i], PART2.flowers[i + 1]);
    const a = headOf(i);
    const b = headOf(i + 1);
    return { x: mix(a.x, b.x, k), y: mix(a.y, b.y, k) + off.y - arc(k, 40) };
  }
  const k = along(s, PART2.flowers[3], home);
  const from = headOf(3);
  return { x: mix(from.x, HIVE_DOOR.x, smooth(k)), y: mix(from.y + off.y, HIVE_DOOR.y, k) - arc(k, 180) };
}

/** The sleeping cloud the seeds float up to: its middle and half sizes. */
export const CLOUD = { x: 1950, y: 150, rx: 150, ry: 70 } as const;
/** Seeds on each dandelion clock. */
export const SEEDS_EACH = 4;

/** Seed `n` of dandelion `i`: knocked off by the bee, floating up under the cloud, tickling it, and blown away by its sneeze. */
export function seedAt(i: number, n: number, u: number): (Pt & { fade: number }) | null {
  if (u < PART2.flowers[i]) return null;
  const head = headOf(i);
  const from = { x: head.x + (n - 1.5) * 12, y: head.y - 6 + (n % 2) * 10 };
  const slot = i * SEEDS_EACH + n;
  const under = { x: CLOUD.x - 120 + slot * 16, y: CLOUD.y + CLOUD.ry + 14 + (slot % 3) * 10 };
  const arrive = PART2.wake - 0.4 + 0.02 * slot;
  if (u < arrive) {
    const k = along(u, PART2.flowers[i], arrive);
    return { x: mix(from.x, under.x, smooth(k)) + 30 * Math.sin(k * 5 + slot) * (1 - k), y: mix(from.y, under.y, outward(k)), fade: 1 };
  }
  if (u < PART2.cloud) return { x: under.x + 5 * Math.sin(u * 6 + slot), y: under.y + 4 * Math.sin(u * 4 + slot), fade: 1 };
  const k = along(u, PART2.cloud, PART2.cloud + 1.4);
  return { x: under.x + 700 * outward(k) + slot * 6 * k, y: under.y - 260 * k + 40 * Math.sin(k * 6 + slot), fade: 1 - k };
}

/** The kite lying in the grass, tied to its stake. */
export const KITE = { x: 2250, stake: 2110, h: 120 } as const;
/** The scarecrow: where he stands, his head's middle and radius, and his nose. */
export const SCARECROW = { x: 2750, head: FLOOR - 300, r: 42, nose: FLOOR - 292, arms: FLOOR - 230, reach: 115 } as const;
/** How long the kite's tail is. */
export const KITE_TAIL = 200;
/** Where the kite hovers while its tail tickles the scarecrow's nose: the tail's tip hangs right at it. */
const HOVER: Pt = { x: SCARECROW.x - 30, y: SCARECROW.nose - KITE_TAIL - KITE.h / 2 - 4 };
/** Where the scarecrow's sneeze blows the kite, and it stays. */
const BLOWN: Pt = { x: 2560, y: 50 };

/** The gust the cloud sneezes down onto the kite; null when there is none. */
export function gustAt(u: number): (Pt & { k: number }) | null {
  if (u < PART2.cloud || u > PART2.lift + 0.4) return null;
  const k = along(u, PART2.cloud, PART2.lift);
  const from = { x: CLOUD.x + CLOUD.rx * 0.7, y: CLOUD.y + CLOUD.ry * 0.6 };
  const to = { x: KITE.x, y: FLOOR - 40 };
  return { x: mix(from.x, to.x, k), y: mix(from.y, to.y, k * k), k: along(u, PART2.cloud, PART2.lift + 0.4) };
}

/** The kite: where its middle is, how it leans (degrees) and how flat it lies in the grass (1) or flies (0). */
export function kiteAt(u: number): Pt & { turn: number; flat: number } {
  if (u < PART2.lift) return { x: KITE.x, y: FLOOR - 22, turn: 0, flat: 1 };
  if (u < PART2.high) {
    const k = along(u, PART2.lift, PART2.high);
    return { x: mix(KITE.x, 2470, smooth(k)), y: mix(FLOOR - 40, 70, outward(k)), turn: 10 * Math.sin(u * 3) * (1 - k), flat: 1 - Math.min(1, k * 5) };
  }
  if (u < PART2.tickle) {
    const k = along(u, PART2.high, PART2.tickle);
    return { x: mix(2470, HOVER.x, smooth(k)), y: mix(70, HOVER.y, smooth(k)) + arc(k, 40), turn: 18 * Math.sin(Math.PI * k), flat: 0 };
  }
  if (u < PART2.scarecrow) return { x: HOVER.x + 8 * Math.sin((u - PART2.tickle) * 5), y: HOVER.y + 4 * Math.sin((u - PART2.tickle) * 7), turn: 0, flat: 0 };
  const k = along(u, PART2.scarecrow, PART2.scarecrow + 1.5);
  return { x: mix(HOVER.x, BLOWN.x, outward(k)), y: mix(HOVER.y, BLOWN.y, outward(k)), turn: -25 * Math.sin(Math.PI * k), flat: 0 };
}

/** The tip of the kite's tail: lying in the grass beside the kite, then hanging below it, swinging over the scarecrow's nose. */
export function kiteTailTip(u: number): Pt {
  const kite = kiteAt(u);
  const tickling = u >= PART2.tickle && u < PART2.scarecrow;
  const swing = tickling ? 6 * Math.sin((u - PART2.tickle) * 9) : 0;
  const hang = { x: kite.x + 30 + swing, y: kite.y + KITE.h / 2 + KITE_TAIL };
  return { x: mix(hang.x, kite.x + KITE_TAIL * 0.9, kite.flat), y: mix(hang.y, FLOOR - 8, kite.flat) };
}

/** Where the hat sits on the scarecrow's head. */
const HAT_ON: Pt = { x: SCARECROW.x, y: SCARECROW.head - SCARECROW.r + 4 };

/** The scarecrow's straw hat: on his head, blown up by his sneeze, floating down and landing on his head again, crooked. */
export function hatAt(u: number): Pt & { turn: number } {
  if (u < PART2.scarecrow) return { ...HAT_ON, turn: 0 };
  const top = PART2.scarecrow + 0.8;
  if (u < top) {
    const k = outward(along(u, PART2.scarecrow, top));
    return { x: HAT_ON.x + 40 * k, y: HAT_ON.y - 290 * k, turn: 40 * k };
  }
  if (u < PART2.hat) {
    const k = along(u, top, PART2.hat);
    return {
      x: mix(HAT_ON.x + 40, HAT_ON.x + 6, k) + 60 * Math.sin(k * 3 * Math.PI) * (1 - k),
      y: mix(HAT_ON.y - 290, HAT_ON.y, smooth(k)),
      turn: mix(40, 14, k) * Math.cos(k * 3 * Math.PI),
    };
  }
  return { x: HAT_ON.x + 6, y: HAT_ON.y, turn: 14 };
}

/** How many bits of straw fly out of the scarecrow's sleeves and collar with his sneeze. */
export const STRAWS = 12;

/** Straw bit `n`: flying out with the sneeze and lying in the grass afterwards; null before. */
export function strawAt(n: number, u: number): (Pt & { turn: number }) | null {
  if (u < PART2.scarecrow) return null;
  const from: Pt =
    n % 3 === 0 ? { x: SCARECROW.x, y: SCARECROW.head + SCARECROW.r } : { x: SCARECROW.x + (n % 3 === 1 ? -1 : 1) * SCARECROW.reach, y: SCARECROW.arms };
  const side = n % 3 === 0 ? (n % 2 ? 1 : -1) : n % 3 === 1 ? -1 : 1;
  const reach = 60 + ((n * 37) % 90);
  const k = along(u, PART2.scarecrow, PART2.scarecrow + 1.2 + (n % 4) * 0.12);
  return {
    x: from.x + side * reach * outward(k),
    y: mix(from.y, FLOOR + 6 + (n % 3) * 8, k * k) - arc(k, 80 + (n % 5) * 20),
    turn: (n * 47 + 600 * k * side) % 360,
  };
}

/**
 * The steps a tap or key jumps to in the second part, one at a time: the
 * moments where something new starts, so a hurried chain still shows every
 * link.
 */
export const PART2_STEPS = [
  PART2.slip,
  PART2.puff,
  PART2.sniff,
  PART2.tortoise,
  PART2.bees,
  PART2.flowers[0],
  PART2.wake,
  PART2.cloud,
  PART2.lift,
  PART2.tickle,
  PART2.scarecrow,
  PART2.hat,
  PART2.laugh,
];

/** Where the camera looks (the middle of the picture) `u` seconds into the second part, from the tree's trunk; null while it still looks at the tree from the row. */
export function part2Focus(u: number): number | null {
  if (u < PART2.slip) return null;
  if (u < PART2.puff) return 300;
  if (u < PART2.land) return 700;
  if (u < PART2.flowers[3]) return 1300;
  if (u < PART2.cloud) return 1700;
  return MEADOW_AFTER_TREE - 1000;
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
