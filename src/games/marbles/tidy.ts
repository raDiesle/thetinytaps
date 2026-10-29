// The tidy-up machine ("Aufräum-Maschine", R-08), a Rube Goldberg machine in
// an untidy children's room: one tap rocks the rocking horse, its rocker kicks
// the football, the football rolls the scattered building blocks into the toy
// chest and rolls up the open lid into the chest itself, the lid slams shut and
// the jolt sets off the wind-up toy truck. The truck scoops up the books lying
// on the floor into a pile and pushes it to the bookshelf, where the books hop
// into the shelf one by one; free again, the truck rolls onto the bellows,
// whose puff of air blows the cuddly bunny off its cushion into bed, and the
// blanket spreads over it. Then everything is tidy and glitters. Everything is
// worked out ahead as a function of the seconds since the tap, so
// TidyLevel.tsx only asks where each thing is at a moment. Coordinates are
// those of the room, 5000 × 900; the screen shows 1600 of it at a time.

import {
  playBoing,
  playChime,
  playClonk,
  playCountNote,
  playCreak,
  playKnock,
  playNeigh,
  playPlop,
  playPuff,
  playRattle,
  playRustle,
  playThump,
  playTwinkle,
  playWhoosh,
} from "@/lib/sfx";
import { VIEW_W } from "./level";
import { along, cameraOn, clamp01, distAt, easeIn, easeInOut, easeOut, hop, lerp, pathOf, rad, roll, rounded, seg, timeline, timeWhen } from "./machineKit";
import { line, type Pt } from "./path";

export const WORLD_W = 5000;
export const FLOOR = 800;

/* ---------- Layout ---------- */

/** The rocking horse: where its rockers touch the floor at rest, the radius of the rockers and how far they reach each way (degrees). */
export const HORSE = { x: 330, r: 420, reach: 30 };

/** The football. */
export const BALL_R = 36;

/** The building blocks lying about on the floor: middle and tilt (degrees). */
export const BLOCK = 64;
export const BLOCKS = [
  { x: 820, tilt: 14 },
  { x: 960, tilt: -22 },
  { x: 1090, tilt: 0 },
  { x: 1230, tilt: 31 },
  { x: 1360, tilt: -8 },
  { x: 1490, tilt: 18 },
];

/** The toy chest; its lid is hinged at the top left corner and lies open as a ramp down to the floor. */
export const CHEST = { x0: 1900, x1: 2190, top: 600, wall: 12 };
export const LID = CHEST.x1 - CHEST.x0;
/** The open lid's slope (radians): from the hinge down to the floor. */
const LID_SLOPE = Math.asin((FLOOR - CHEST.top) / LID);
/** Where the open lid touches the floor. */
export const LID_FOOT = { x: CHEST.x0 - LID * Math.cos(LID_SLOPE), y: FLOOR };
/** The open lid's angle in SVG degrees (pointing from the hinge down to the left), and shut (pointing right). */
export const LID_OPEN = 180 - (LID_SLOPE * 180) / Math.PI;
export const LID_SHUT = 360;
/** Where each block ends up in the chest: four on the bottom, two on top of them. */
const IN_CHEST: Pt[] = [
  ...[0, 1, 2, 3].map((i) => ({ x: CHEST.x0 + CHEST.wall + 34 + i * 68, y: FLOOR - CHEST.wall - BLOCK / 2 })),
  ...[0, 1].map((i) => ({ x: CHEST.x0 + CHEST.wall + 68 + i * 68, y: FLOOR - CHEST.wall - BLOCK * 1.5 })),
];
/** Where the football ends up: on the last block of the bottom row. */
const BALL_IN = { x: IN_CHEST[3].x, y: IN_CHEST[3].y - BLOCK / 2 - BALL_R };
/** How far the slam of the lid shoves the chest to the right. */
export const CHEST_JOLT = 16;

/** The wind-up toy truck, facing right: its back starts against the chest (after the jolt). */
export const TRUCK = { len: 200, wheelR: 22, back0: CHEST.x1 + CHEST_JOLT };
/** Where a front wheel sits behind the truck's nose. */
export const FRONT_WHEEL = 45;

/** The books on the floor: left edge, thickness, colour and tilt (degrees). They are all `BOOK_LEN` long. */
export const BOOK_LEN = 120;
export const BOOKS = [
  { x: 2560, th: 26, color: "#ff5d73", tilt: 8 },
  { x: 2760, th: 20, color: "#3a86ff", tilt: -6 },
  { x: 2950, th: 30, color: "#3ec300", tilt: 0 },
  { x: 3130, th: 22, color: "#ffb703", tilt: 12 },
  { x: 3300, th: 28, color: "#8e7dff", tilt: -10 },
];

/** The bellows (Blasebalg) on the floor in front of the shelf: its height at rest and squashed. */
export const BELLOWS = { x0: 3460, x1: 3560, h: 40, flat: 14 };

/** The bookshelf, standing on legs so the hose fits under it; the books stand on the board at `board`. */
export const SHELF = { x0: 3600, x1: 3900, top: 380, board: 600, bottom: 760 };

/** The air cushion on the floor, flat until the puff comes; the bunny lies on it. */
export const CUSHION = { x0: 3960, x1: 4100, flat: 14, full: 64 };
/** The bed with its head end on the right; the bunny lands with its head on the pillow. */
export const BED = { x0: 4250, x1: 4920, top: 600 };
export const PILLOW = { x: 4790, y: 585 };
/** Where the bunny lies in bed, head to the right. */
export const IN_BED = { x: 4700, y: BED.top - 34 };

/* ---------- The machine ---------- */

/** The horse's first push goes back, then it rocks forward and kicks: seconds for one swing there and back, and how far (degrees). */
const ROCK_PERIOD = 1.6;
const ROCK = 16;
/** The truck's top speed, and seconds to get up to it or to stop. */
const TRUCK_SPEED = 220;
const TRUCK_RAMP = 0.4;
/** Seconds a book takes onto the pile, and up into the shelf. */
const BOOK_HOP = 0.35;
const BOOK_UP = 0.45;
const BOOK_GAP = 0.38;
/** Seconds a block flies into the chest. */
const BLOCK_HOP = 0.7;
/** Seconds the bunny flies into bed. */
const FLIGHT = 1.2;

/** Where a thing driving `dist` px at top speed `v` is `u` seconds after it set off, speeding up and slowing down over `ramp` seconds. */
function drive(dist: number, v: number, ramp: number) {
  const duration = dist / v + ramp;
  const at = (u: number) => {
    if (u <= 0) return 0;
    if (u >= duration) return dist;
    if (u < ramp) return (v * u * u) / (2 * ramp);
    if (u < duration - ramp) return (v * ramp) / 2 + v * (u - ramp);
    return dist - (v * (duration - u) ** 2) / (2 * ramp);
  };
  /** Seconds until it has come `d` px. */
  const when = (d: number) => {
    let u = 0;
    while (u < duration && at(u) < d) u += 1 / 240;
    return u;
  };
  return { duration, at, when };
}

/** The rocking horse's tilt in degrees at `t` seconds since its first push (positive: nose down, to the right). */
function rockAt(t: number) {
  if (t <= 0) return 0;
  // Back first, then forward: the kick comes at the first forward swing, and the rocking dies away.
  return -ROCK * Math.exp(-0.55 * t) * Math.sin((2 * Math.PI * t) / ROCK_PERIOD);
}

/** The front end of the rockers in the room, at a tilt of `tilt` degrees: the rockers roll along the floor as they tilt. */
export function rockerTip(tilt: number): Pt {
  const a = rad(tilt);
  const c = { x: HORSE.x + HORSE.r * a, y: FLOOR - HORSE.r };
  const p = { x: HORSE.r * Math.sin(rad(HORSE.reach)), y: HORSE.r * Math.cos(rad(HORSE.reach)) };
  return { x: c.x + p.x * Math.cos(a) - p.y * Math.sin(a), y: c.y + p.x * Math.sin(a) + p.y * Math.cos(a) };
}

export type Tidy = ReturnType<typeof buildTidy>;

export function buildTidy() {
  const { at, sorted } = timeline();

  /* The rocking horse: a push back, and on its way forward the rocker kicks the ball. */
  const tKick = (ROCK_PERIOD * 3) / 4;
  at(0, { sound: playNeigh });
  at(0.15, { sound: playCreak });
  at(tKick, { sound: () => playKnock(500) });
  const ball0 = { x: rockerTip(rockAt(tKick)).x + BALL_R, y: FLOOR - BALL_R };

  /* The football rolls along the floor and up the open lid, then drops into the chest. */
  const s = Math.sin(LID_SLOPE);
  const c = Math.cos(LID_SLOPE);
  const up = (u: number): Pt => ({ x: LID_FOOT.x - BALL_R * s + u * c, y: LID_FOOT.y - BALL_R * c - u * s });
  const onLid = up((BALL_R * (1 - c)) / s);
  const lidTop = up(LID);
  const ballPath = pathOf(rounded([ball0, onLid, lidTop], 60));
  const ballRun = roll(ballPath, 560, 330, 640, 0.15);
  const tTop = tKick + ballRun.duration;
  const tBallIn = tTop + 0.5;
  at(tTop - 0.4, { sound: playWhoosh });
  at(tBallIn, { sound: playThump });
  /** Where the ball is and how far it has turned (degrees). */
  const ballAt = (t: number): { pt: Pt; spin: number } => {
    if (t < tKick) return { pt: ball0, spin: 0 };
    if (t < tTop) {
      const d = distAt(ballRun, t - tKick);
      return { pt: along(ballPath, d).pt, spin: (d / BALL_R) * (180 / Math.PI) };
    }
    const k = seg(t, tTop, tBallIn);
    return { pt: hop(lidTop, BALL_IN, 70, easeIn(k)), spin: (ballPath.total / BALL_R) * (180 / Math.PI) + 200 * k };
  };

  /* Each block hops off into the chest as the ball gets to it, a note higher each time. */
  const tBlock = BLOCKS.map((b) => tKick + timeWhen(ballRun, (pt) => pt.x + BALL_R >= b.x - BLOCK / 2));
  tBlock.forEach((tb, i) => {
    at(tb, { sound: () => playCountNote(i) });
    at(tb + BLOCK_HOP, { sound: () => playKnock(900 + 80 * i) });
  });
  /** Where block `i` is and its turn (degrees). */
  const blockAt = (i: number, t: number): { pt: Pt; angle: number } => {
    const b = BLOCKS[i];
    const from = { x: b.x, y: FLOOR - BLOCK / 2 };
    const k = seg(t, tBlock[i], tBlock[i] + BLOCK_HOP);
    if (k <= 0) return { pt: from, angle: b.tilt };
    return { pt: hop(from, IN_CHEST[i], 220 + 20 * i, k), angle: lerp(b.tilt, 360, easeOut(k)) };
  };

  /* The lid swings up and over and slams shut; the chest jumps and shoves the truck. */
  const tLid = tBallIn + 0.15;
  const tShut = tLid + 0.55;
  at(tShut, { sound: playClonk });
  const lidAngle = (t: number) => lerp(LID_OPEN, LID_SHUT, easeIn(seg(t, tLid, tShut)));
  const chestShift = (t: number) => CHEST_JOLT * easeOut(seg(t, tShut, tShut + 0.15));
  const chestHop = (t: number) => 14 * Math.sin(Math.PI * seg(t, tShut, tShut + 0.25));

  /* The truck drives off, scooping the books into a pile, until the pile bumps into the bellows. */
  const tGo = tShut + 0.08;
  const front0 = TRUCK.back0 + TRUCK.len;
  const frontStop = BELLOWS.x0 - 2 - BOOK_LEN;
  const run1 = drive(frontStop - front0, TRUCK_SPEED, TRUCK_RAMP);
  const tStop = tGo + run1.duration;
  at(tGo, { sound: playRattle });
  at(tStop, { sound: playThump });
  /** Book `j` joins the pile when the truck's nose (the first book) or the pile's front (the others) gets to it. */
  const tPile = BOOKS.map((b, j) => tGo + run1.when((j === 0 ? b.x : b.x - BOOK_LEN) - front0));
  tPile.forEach((tp, j) => {
    at(tp + BOOK_HOP, { sound: () => playKnock(600 + 60 * j) });
  });

  /* Top book first, the books hop up into the shelf and stand there side by side; then the truck rolls on onto the bellows. */
  const tUp = (j: number) => tStop + 0.3 + BOOK_GAP * (BOOKS.length - 1 - j);
  BOOKS.forEach((_, j) => {
    at(tUp(j) + BOOK_UP, { sound: () => playCountNote(BOOKS.length - 1 - j + 2) });
  });
  const tRollOn = tUp(0) + BOOK_UP + 0.25;
  const frontEnd = SHELF.x0 - 40;
  const run2 = drive(frontEnd - frontStop, TRUCK_SPEED, 0.3);
  at(tRollOn, { sound: playRattle });

  /** The truck's nose at a moment. */
  const truckFront = (t: number) => (t < tRollOn ? front0 + run1.at(t - tGo) : frontStop + run2.at(t - tRollOn));

  /** Where the pile of books in front of the truck has its bottom middle. */
  const pileBelow = (j: number) => BOOKS.slice(0, j).reduce((sum, b) => sum + b.th, 0);
  /** Where each book stands in the shelf, left to right in the order they hop in. */
  const slotX: number[] = [];
  {
    let x = SHELF.x0 + 34;
    for (let j = BOOKS.length - 1; j >= 0; j--) {
      slotX[j] = x + BOOKS[j].th / 2;
      x += BOOKS[j].th + 6;
    }
  }
  /** Where book `j` is (its middle) and its turn (degrees; 0 lying, -90 standing). */
  const bookAt = (j: number, t: number): { pt: Pt; angle: number } => {
    const b = BOOKS[j];
    const rest = { x: b.x + BOOK_LEN / 2, y: FLOOR - b.th / 2 };
    const onPile = (time: number) => ({ x: truckFront(Math.min(time, tStop)) + BOOK_LEN / 2, y: FLOOR - pileBelow(j) - b.th / 2 });
    if (t < tPile[j]) return { pt: rest, angle: b.tilt };
    const k = seg(t, tPile[j], tPile[j] + BOOK_HOP);
    if (t < tUp(j)) return { pt: hop(rest, onPile(t), 70, k), angle: lerp(b.tilt, 0, k) };
    const u = easeInOut(seg(t, tUp(j), tUp(j) + BOOK_UP));
    const slot = { x: slotX[j], y: SHELF.board - BOOK_LEN / 2 };
    return { pt: hop(onPile(tStop), slot, 150, u), angle: lerp(0, -90, u) };
  };

  /* The truck's front wheels squash the bellows: pfff, the air runs along the hose and blows up the cushion. */
  const tPump = tRollOn + run2.when(BELLOWS.x0 + 10 + FRONT_WHEEL - frontStop);
  const tPuffed = tPump + 0.35;
  const tLaunch = tPuffed + 0.08;
  const tLand = tLaunch + FLIGHT;
  at(tPump, { sound: playPuff });
  at(tLaunch, { sound: playWhoosh });
  at(tLand, { sound: playBoing });
  /** How squashed the bellows is, 0 to 1. */
  const squash = (t: number) => easeOut(seg(t, tPump, tPump + 0.12));
  /** How far the puff of air has got along the hose, 0 to 1 (and gone once it is at the cushion). */
  const puff = (t: number) => (t < tPump || t > tPuffed + 0.1 ? -1 : seg(t, tPump, tPuffed));
  /** How full the cushion is: it blows up, throws the bunny and goes flat again slowly. */
  const cushion = (t: number) => easeOut(seg(t, tPuffed, tPuffed + 0.12)) * (1 - 0.7 * seg(t, tLaunch + 0.3, tLaunch + 2));

  /** Where the bunny is (its middle) and its turn: lying on its back on the cushion (head left), a somersault and a half, lying in bed (head right). */
  const bunny0 = { x: (CUSHION.x0 + CUSHION.x1) / 2, y: FLOOR - CUSHION.flat - 32 };
  const bunnyAt = (t: number): { pt: Pt; angle: number } => {
    if (t < tPuffed) return { pt: bunny0, angle: -90 };
    const lift = { x: bunny0.x, y: bunny0.y - (CUSHION.full - CUSHION.flat) };
    if (t < tLaunch) return { pt: { x: bunny0.x, y: lerp(bunny0.y, lift.y, seg(t, tPuffed, tLaunch)) }, angle: -90 };
    const k = seg(t, tLaunch, tLand);
    // The mattress gives a little as it lands.
    const sink = 10 * Math.sin(Math.PI * seg(t, tLand, tLand + 0.3));
    const p = hop(lift, IN_BED, 300, k);
    return { pt: { x: p.x, y: p.y + sink }, angle: lerp(-90, 450, easeOut(k)) };
  };

  /* The blanket spreads over the bunny, and then everything sparkles. */
  const tBlanket = tLand + 0.45;
  const blanket = (t: number) => easeInOut(seg(t, tBlanket, tBlanket + 0.7));
  const tGlitter = tBlanket + 1;
  const tDone = tGlitter + 3;
  at(tBlanket, { sound: playRustle });
  at(tBlanket + 0.7, { sound: playPlop });
  at(tGlitter, { sound: playTwinkle });
  at(tGlitter + 0.4, { sound: playChime });
  at(tGlitter + 0.5, { say: { de: "Alles aufgeräumt! Alles glitzert!" } });
  at(tDone, { done: true });

  /** The truck's wheels: how far they have turned (degrees), and how far the front wheels are lifted by the bellows. */
  const wheelTurn = (t: number) => ((truckFront(t) - front0) / TRUCK.wheelR) * (180 / Math.PI);
  /** The wind-up key turns while the truck drives. */
  const keyTurn = (t: number) => (t < tGo ? 0 : 140 * (Math.min(t, tPump + 0.4) - tGo));

  /** Where the camera looks: the horse, the ball, the chest while the lid shuts, the truck, then the shelf, and the bed. */
  // The camera's left edge is 0.42 of the screen left of what it looks at, so this shows the shelf, the truck and the whole bed.
  const finale = BED.x1 + 10 - VIEW_W * 0.58;
  const focusX = (t: number) => {
    if (t < tKick) return 0;
    if (t < tTop) return Math.max(0, ballAt(t).pt.x - 150);
    if (t < tGo) return CHEST.x0 + 160;
    if (t < tStop) return Math.max(CHEST.x0 + 160, truckFront(t) - 60);
    if (t < tRollOn) return lerp(frontStop - 60, (SHELF.x0 + SHELF.x1) / 2, clamp01((t - tStop) / 1.5));
    return finale;
  };
  const cameraTarget = (t: number) => cameraOn(WORLD_W, focusX(t));

  return {
    events: sorted(),
    duration: tDone,
    tKick,
    tTop,
    tBallIn,
    tShut,
    tGo,
    tStop,
    tRollOn,
    tPump,
    tLaunch,
    tLand,
    tBlanket,
    tGlitter,
    rock: rockAt,
    ballAt,
    blockAt,
    lidAngle,
    chestShift,
    chestHop,
    truckFront,
    wheelTurn,
    keyTurn,
    bookAt,
    squash,
    puff,
    cushion,
    bunnyAt,
    blanket,
    cameraTarget,
    /** The hose from the bellows under the shelf to the cushion. */
    hose: [
      ...line({ x: BELLOWS.x1, y: FLOOR - 10 }, { x: BELLOWS.x1 + 30, y: FLOOR - 8 }),
      ...line({ x: BELLOWS.x1 + 30, y: FLOOR - 8 }, { x: CUSHION.x0 + 6, y: FLOOR - 8 }).slice(1),
    ],
  };
}

/** For the tests: where each block lands in the chest, and the ball's spot there. */
export const IN_THE_CHEST = { blocks: IN_CHEST, ball: BALL_IN };
