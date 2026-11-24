// The tidy-up machine ("Aufräum-Maschine", R-08), a Rube Goldberg machine in
// an untidy children's room: one tap rocks the rocking horse, its rocker kicks
// the football, the football rolls the scattered building blocks into the toy
// chest and rolls up the open lid into the chest itself, the lid slams shut and
// the jolt sets off the wind-up toy truck. The truck scoops up the books lying
// on the floor into a pile and pushes it to the bookshelf, where the books hop
// into the shelf one by one; free again, the truck rolls onto the bellows and
// bounces on it, its wheels still whirring: every bounce sends a puff along the
// hose to the heap of socks, and the socks fly into the laundry basket one by
// one, each its own way (a flip, over the rim, a corkscrew, a flat throw, one
// teetering on the rim). The last puff throws the rolled-up sock ball onto the
// full basket; it bounces off and rolls along the floor, and the crayons it gets
// to go into the pencil pot on the stool (a hop, a cartwheel, a bounce off the
// stool, straight up like a rocket), then the jigsaw pieces into the puzzle board
// (a hop, a frisbee spin, a scoot along the floor, a tumble) until the picture is
// whole. At the end of its way the ball bumps the rolled-up rug, which unrolls
// across the floor and turns the crank of the jack-in-the-box: pop, the clown
// springs out, leans over and nudges the pyjamas on their hanger, which zip down
// the clothes line; their legs swing on and kick the slinky off the step stool,
// it walks down the steps onto a ruler lying on an eraser, and the ruler flings
// the paper plane, which loops once and lands on the robot vacuum's button. The
// vacuum wakes, sweeps up the crumbs and knocks the plug out of the air cushion:
// pfffft, the cushion jumps like a balloon let go and throws the cuddly bunny
// into bed, the blanket spreads over it, and everything is tidy and glitters.
// Everything is worked out ahead as a function of the seconds since the tap,
// so TidyLevel.tsx only asks where each thing is at a moment. Coordinates are
// those of the room, `WORLD_W` × 900; the screen shows 1600 of it at a time.

import {
  playBoing,
  playChime,
  playClick,
  playClonk,
  playCountNote,
  playCrackle,
  playCreak,
  playHop,
  playKnock,
  playPlink,
  playPlop,
  playPop,
  playPuff,
  playRattle,
  playRobot,
  playRustle,
  playSlide,
  playSqueak,
  playThump,
  playTwinkle,
  playWhirr,
  playWhoosh,
} from "@/lib/sfx";
import { playNeigh } from "@/lib/realSounds";
import { VIEW_W, wobble, decay } from "./level";
import {
  along,
  cameraOn,
  clamp01,
  distAt,
  easeIn,
  easeInOut,
  easeOut,
  hop,
  lerp,
  pathOf,
  rad,
  roll,
  rounded,
  seg,
  timeline,
  timeWhen,
  turn,
  hump,
} from "./machineKit";
import { arc, line, quad, type Pt } from "./path";

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

/** The hose's open end, under the heap of socks lying next to the laundry basket. */
export const NOZZLE = { x: 4000, y: FLOOR - 8 };
/** The socks lying in a heap on the nozzle, the top one first (it flies first): middle, tilt (degrees) and colours. */
export const SOCKS = [
  { x: 4004, y: FLOOR - 66, tilt: 100, color: "#ff5d73", stripe: "#fff" },
  { x: 3966, y: FLOOR - 46, tilt: -80, color: "#3a86ff", stripe: "#ffd23f" },
  { x: 4040, y: FLOOR - 42, tilt: 76, color: "#3ec300", stripe: "#fff" },
  { x: 3946, y: FLOOR - 20, tilt: -94, color: "#ffb703", stripe: "#ff5d73" },
  { x: 4056, y: FLOOR - 20, tilt: 88, color: "#8e7dff", stripe: "#fff" },
];
/** Half the size of a sock lying on its side. */
export const SOCK_HALF = 20;
/** The rolled-up sock ball at the bottom of the heap, right on the nozzle; it goes last. */
export const SOCK_BALL_R = 24;
export const SOCK_BALL0 = { x: NOZZLE.x, y: FLOOR - SOCK_BALL_R };

/** The laundry basket (Wäschekorb), a little wider at the top than at the bottom. */
export const BASKET = { x0: 4170, x1: 4350, top: 640 };
const BASKET_MID = (BASKET.x0 + BASKET.x1) / 2;
/** Where each sock lands in the basket (unturned): the first at the bottom, the last ones peeking over the rim. */
const IN_BASKET = SOCKS.map((_, k) => ({ x: BASKET_MID + [-34, 30, -8, 36, -2][k], y: FLOOR - 40 - 30 * k, angle: [80, -100, 96, -84, 90][k] }));

/** The crayons lying on the floor, in the order the sock ball gets to them; they are all `CRAYON.len` long. */
export const CRAYON = { len: 60, th: 13 };
export const CRAYONS = ["#ff5d73", "#ff8c42", "#ffd23f", "#3ec300", "#00b4d8", "#3a86ff", "#ff7bd0"].map((color, k) => ({
  x: 4660 + k * 72,
  tilt: [8, -6, 4, -10, 6, -4, 10][k],
  color,
}));
/** The little stool by the wall that the pencil pot stands on, and the pot (Stiftedose). */
export const STOOL = { x: 4870, w: 130, top: 680 };
export const POT = { x: STOOL.x, w: 72, h: 80 };
/** Where each crayon stands in the pot (unturned), fanned out a little. */
const IN_POT = CRAYONS.map((_, k) => ({ x: POT.x - 24 + k * 8, y: STOOL.top - POT.h + 6 - (k % 2) * 6, angle: -90 + (k - 3) * 6 }));

/** The jigsaw puzzle board leaning on the wall: its left edge, top, the frame round its pieces and the pieces' grid. */
export const PUZZLE = { x0: 5240, top: 604, frame: 16, cols: 3, rows: 2, w: 88, h: 80 };
export const PUZZLE_X1 = PUZZLE.x0 + 2 * PUZZLE.frame + PUZZLE.cols * PUZZLE.w;
/** The middle of slot `slot` in the board (left to right, top to bottom). */
export const slotCentre = (slot: number): Pt => ({
  x: PUZZLE.x0 + PUZZLE.frame + PUZZLE.w * ((slot % PUZZLE.cols) + 0.5),
  y: PUZZLE.top + PUZZLE.frame + PUZZLE.h * (Math.floor(slot / PUZZLE.cols) + 0.5),
});
/** The pieces lying flat on the floor, in the order the ball gets to them: where, their tilt, and which slot they belong in. */
export const PIECES = [
  { x: 5190, tilt: -6, slot: 4 },
  { x: 5290, tilt: 5, slot: 0 },
  { x: 5390, tilt: -3, slot: 5 },
  { x: 5490, tilt: 6, slot: 2 },
  { x: 5590, tilt: -5, slot: 3 },
  { x: 5690, tilt: 4, slot: 1 },
];
/** How flat a piece lying on the floor is drawn (its height squashed, as if seen lying), and the middle of a lying piece. */
export const PIECE_FLAT = 0.45;
const PIECE_Y = FLOOR - (PUZZLE.h * PIECE_FLAT) / 2 - 4;

/**
 * The rolled-up rug lying on the floor past the puzzle: the middle of its roll at the start, how thick it is rolled up
 * and still is at the end, where the roll's middle stops (against the jack-in-the-box's crank), and how thick the rug lies.
 */
export const RUG = { x: 5880, r0: 40, r1: 14, end: 6621, th: 8 };

/** The jack-in-the-box: its box's left edge and size. */
export const JACK = { x0: 6650, w: 120, h: 120 };
/** The crank on the box's left side: its axle, its arm hanging down at rest, and the knob at the arm's end. */
export const CRANK = { x: JACK.x0 - 6, y: FLOOR - 76, arm: 50, knob: 9 };
/** The clown on its spring: how far the spring comes out of the box, its head's radius, how high its hat stands over
 *  the head's top, and how far it leans right (degrees). */
export const CLOWN = { spring: 190, head: 30, hat: 43, lean: 26 };
/** How far the clown's spring is out of the box while it hides: deep enough that the tip of its hat stays below the rim. */
const CLOWN_HIDDEN = -(2 * CLOWN.head + CLOWN.hat + 3);

/** The clothes line from hook to hook on the wall, sloping down to the right; the pyjamas hang on it on a hanger. */
export const LINE = { x0: 6840, y0: 330, x1: 7650, y1: 495 };
/** The clothes line's height at `x`. */
export const lineY = (x: number) => LINE.y0 + ((x - LINE.x0) * (LINE.y1 - LINE.y0)) / (LINE.x1 - LINE.x0);
/** Where the hanger's hook stops on the line, at the knot before the right hook. */
export const HANGER_STOP = 7590;
/** The pyjamas below the hanger's hook: the hanger's bar, where the top ends and the feet are, how far each leg is from the middle. */
export const PYJAMAS = { bar: 22, top: 90, feet: 160, leg: 22 };

/** The step stool (Tritthocker): four steps down to the right, each with its left and right edge and its top. */
export const STEPS = [
  { x0: 7620, x1: 7745, top: 640 },
  { x0: 7745, x1: 7837, top: 680 },
  { x0: 7837, x1: 7929, top: 720 },
  { x0: 7929, x1: 8021, top: 760 },
];
/** The slinky: its width and height standing, and how many coils it has. */
export const SLINKY = { w: 48, h: 44, coils: 10 };
/** How far each step of the slinky goes to the right. */
export const SLINKY_STEP = 92;

/** The ruler lying across an eraser as a seesaw: its middle on the eraser, half its length, its tilt at rest (left end up, degrees), its thickness. */
export const RULER = { x: 8307, y: 770, half: 150, tilt: 10, th: 8 };
export const ERASER = { w: 54, h: 26 };
/** Where the paper plane lies on the ruler's low end, and how long it is. */
export const PLANE = { x: 8417, len: 76 };
/** The middle of the paper plane's loop and its radius. */
export const LOOP = { x: 8690, y: 320, r: 80 };

/** The robot vacuum asleep on the floor: its middle, width and height; its button is on top. */
export const ROBOT = { x: 9130, w: 170, h: 42 };
/** The crumbs on the floor between the robot vacuum and the cushion, which it sweeps up on its way. */
export const CRUMBS = ["#c98d4e", "#ffd23f", "#ff8c42", "#c98d4e", "#ff5d73", "#ffd23f", "#c98d4e"].map((color, i) => ({
  x: 9330 + i * 86 + (i % 2) * 14,
  r: 5 + (i % 3) * 2,
  color,
}));

/** The air cushion on the floor, blown up from the start, with its plug on the left; the bunny lies on it. */
export const CUSHION = { x0: 10020, x1: 10160, flat: 14, full: 64 };
/** The outer end of the plug, where the robot vacuum knocks it out. */
export const PLUG = { x: CUSHION.x0 - 18, y: FLOOR - 30 };
/** The bed with its head end on the right; the bunny lands with its head on the pillow. */
export const BED = { x0: CUSHION.x0 + 270, x1: CUSHION.x0 + 770, top: 600 };
export const PILLOW = { x: CUSHION.x0 + 640, y: 585 };
/** Where the bunny lies in bed, head to the right. */
export const IN_BED = { x: CUSHION.x0 + 550, y: BED.top - 34 };
export const WORLD_W = BED.x1 + 70;

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
/** Seconds between the truck's bounces on the bellows (one puff each), and a puff's way along the hose. */
const PUFF_GAP = 0.8;
const HOSE_TIME = 0.3;
/** Seconds a sock flies into the basket, a crayon into the pot, a piece into the puzzle board. */
const SOCK_FLIGHT = 0.75;
const CRAYON_HOP = 0.6;
const PIECE_HOP = 0.65;
/** How each sock, crayon and piece flies in, so that no two in a row go the same way. */
const SOCK_WAYS = ["flip", "rim", "corkscrew", "flat", "teeter"] as const;
const CRAYON_WAYS = ["hop", "cartwheel", "stool", "rocket", "hop", "stool", "cartwheel"] as const;
const PIECE_WAYS = ["hop", "frisbee", "scoot", "hop", "tumble", "scoot"] as const;
/** Seconds the rug takes to unroll, the crank to turn once, the clown to lean over to the pyjamas, a step of the slinky. */
const RUG_TIME = 3.8;
const CRANK_TURN = 0.9;
const CLOWN_LEAN = 1.6;
const SLINKY_FLIP = 0.8;
/** The robot vacuum's top speed, and seconds to get up to it. */
const ROBOT_SPEED = 115;
const ROBOT_RAMP = 0.5;

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
  return -ROCK * decay(0.55 * t) * Math.sin((2 * Math.PI * t) / ROCK_PERIOD);
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
  const chestHop = (t: number) => 14 * hump(seg(t, tShut, tShut + 0.25));

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

  /* The truck's front wheels squash the bellows, and the truck bounces on it, its wheels still whirring: every
     press sends a puff along the hose, and each puff blows the top sock off the heap into the laundry basket. */
  const tPump = tRollOn + run2.when(BELLOWS.x0 + 10 + FRONT_WHEEL - frontStop);
  const tStand = tRollOn + run2.duration;
  /** One press for each sock, and the last one for the sock ball. */
  const PRESSES = SOCKS.length + 1;
  const tPress = (k: number) => tPump + PUFF_GAP * k;
  const tOff = (k: number) => tPress(k) + HOSE_TIME;
  const tSockIn = (k: number) => tOff(k) + SOCK_FLIGHT;
  const tLastPress = tPress(PRESSES - 1);
  for (let k = 0; k < PRESSES; k++) at(tPress(k), { sound: playPuff });
  SOCKS.forEach((_, k) => {
    at(tSockIn(k), { sound: playPlop });
  });
  /** How squashed the bellows is, 0 to 1: pressed flat, then up and down with each bounce of the truck. */
  const squash = (t: number) => {
    if (t < tPump) return 0;
    if (t >= tLastPress) return 1;
    const bounce = 1 - 0.7 * Math.sin((Math.PI * ((t - tPump) % PUFF_GAP)) / PUFF_GAP);
    return Math.min(easeOut(seg(t, tPump, tPump + 0.12)), bounce);
  };
  /** How far the latest puff of air has got along the hose, 0 to 1 (-1 while there is none). */
  const puff = (t: number) => {
    for (let k = PRESSES - 1; k >= 0; k--) {
      if (t >= tPress(k)) return t <= tOff(k) + 0.05 ? seg(t, tPress(k), tOff(k)) : -1;
    }
    return -1;
  };
  /** Seconds since the latest puff came out of the nozzle, while its little cloud shows (-1 otherwise). */
  const blast = (t: number) => {
    for (let k = PRESSES - 1; k >= 0; k--) {
      if (t >= tOff(k)) return t - tOff(k) < 0.4 ? t - tOff(k) : -1;
    }
    return -1;
  };

  /* The basket wobbles with every sock that lands in it, and once more when the sock ball bumps it. */
  const tBallOff = tOff(PRESSES - 1);
  const tHit = tBallOff + 0.6;
  /** The basket's tilt in degrees, round the middle of its bottom. */
  const basketTilt = (t: number) => SOCKS.reduce((sum, _, k) => sum + wobble(t - tSockIn(k), 4 + k, 13, 3.5), 0) + wobble(t - tHit, -5, 13, 3.5);
  const basketPivot = { x: BASKET_MID, y: FLOOR };
  /** Where sock `k` is (its middle) and its turn (degrees): on the heap, flying, or in the basket, wobbling with it. */
  const sockAt = (k: number, t: number): { pt: Pt; angle: number } => {
    const s0 = SOCKS[k];
    const slot = IN_BASKET[k];
    const tilt = basketTilt(t);
    const inBasket = turn(slot, basketPivot, rad(tilt));
    if (t < tOff(k)) return { pt: { x: s0.x, y: s0.y }, angle: s0.tilt };
    const u = seg(t, tOff(k), tSockIn(k));
    if (u >= 1) return { pt: inBasket, angle: slot.angle + tilt };
    // Each sock flies its own way, in the same time.
    const end = slot.angle + 360;
    switch (SOCK_WAYS[k]) {
      case "rim": {
        // Skims over the near rim and drops in.
        const rim = { x: BASKET.x0 + 30, y: BASKET.top - SOCK_HALF - 8 };
        const pt = u < 0.6 ? hop(s0, rim, 150, u / 0.6) : hop(rim, inBasket, 16, easeIn(seg(u, 0.6, 1)));
        return { pt, angle: lerp(s0.tilt, end - 360, easeOut(u)) };
      }
      case "corkscrew":
        return { pt: hop(s0, inBasket, 320, u), angle: lerp(s0.tilt, end + 360, u) };
      case "flat":
        return { pt: hop(s0, inBasket, 140, easeOut(u)), angle: lerp(s0.tilt, end - 360, u) };
      case "teeter": {
        // Lands on the far rim, rocks there a moment and slips in.
        const rim = { x: BASKET.x1 - 18, y: BASKET.top - SOCK_HALF };
        if (u < 0.5) return { pt: hop(s0, rim, 190, u / 0.5), angle: lerp(s0.tilt, end, easeOut(u / 0.5)) };
        if (u < 0.8) return { pt: rim, angle: end + 18 * Math.sin((2 * Math.PI * (u - 0.5)) / 0.3) * (1 - (u - 0.5) / 0.3) };
        return { pt: hop(rim, inBasket, 8, easeIn(seg(u, 0.8, 1))), angle: end };
      }
      default:
        return { pt: hop(s0, inBasket, 230 + 20 * k, u), angle: lerp(s0.tilt, end, easeOut(u)) };
    }
  };

  /* The last puff throws the sock ball onto the full basket; it bounces off over the edge, bounces once more and rolls
     along the floor past the crayons and the puzzle pieces to the rolled-up rug. */
  const pileTop = { x: BASKET_MID + 16, y: BASKET.top - 22 - SOCK_BALL_R };
  const bounce = { x: BASKET.x1 + 150, y: FLOOR - SOCK_BALL_R };
  const tBounce = tHit + 0.55;
  const roll0 = { x: bounce.x + 90, y: FLOOR - SOCK_BALL_R };
  const tRoll = tBounce + 0.35;
  // Where the ball touches the rug's roll, which is thicker than the ball.
  const rugHit = { x: RUG.x - Math.sqrt((RUG.r0 + SOCK_BALL_R) ** 2 - (RUG.r0 - SOCK_BALL_R) ** 2), y: FLOOR - SOCK_BALL_R };
  const rollPath = pathOf(line(roll0, rugHit));
  const rollRun = roll(rollPath, 250, 145, 400, 0.2);
  const tRug = tRoll + rollRun.duration;
  at(tHit, { sound: playBoing });
  at(tBounce, { sound: playThump });
  const toDeg = 180 / Math.PI;
  const spinRolled = (rollPath.total / SOCK_BALL_R) * toDeg;
  /** Where the sock ball is and how far it has turned (degrees); after bumping the rug it rolls back a little and lies still. */
  const sockBallAt = (t: number): { pt: Pt; spin: number } => {
    if (t < tBallOff) return { pt: SOCK_BALL0, spin: 0 };
    if (t < tHit) return { pt: hop(SOCK_BALL0, pileTop, 200, seg(t, tBallOff, tHit)), spin: 300 * seg(t, tBallOff, tHit) };
    if (t < tBounce) return { pt: hop(pileTop, bounce, 120, seg(t, tHit, tBounce)), spin: 300 + 220 * seg(t, tHit, tBounce) };
    if (t < tRoll) return { pt: hop(bounce, roll0, 36, seg(t, tBounce, tRoll)), spin: 520 + 200 * seg(t, tBounce, tRoll) };
    if (t < tRug) {
      const d = distAt(rollRun, t - tRoll);
      return { pt: along(rollPath, d).pt, spin: 720 + (d / SOCK_BALL_R) * toDeg };
    }
    const back = 40 * easeOut(seg(t, tRug, tRug + 0.7));
    return { pt: { x: rugHit.x - back, y: rugHit.y }, spin: 720 + spinRolled - (back / SOCK_BALL_R) * toDeg };
  };
  /** Seconds after the tap when the rolling sock ball gets to `x` with its front. */
  const ballGetsTo = (x: number) => tRoll + timeWhen(rollRun, (pt) => pt.x + SOCK_BALL_R >= x);

  /* Each crayon the ball gets to hops up into the pencil pot, a note higher each time; the pot wobbles. */
  const tCrayon = CRAYONS.map((c) => ballGetsTo(c.x - CRAYON.len / 2 + 6));
  const tCrayonIn = tCrayon.map((tc) => tc + CRAYON_HOP);
  tCrayonIn.forEach((tc, k) => {
    at(tc, { sound: () => playPlink(k) });
  });
  /** The pot's tilt in degrees, round the middle of its bottom. */
  const potTilt = (t: number) => tCrayonIn.reduce((sum, tc, k) => sum + wobble(t - tc, k % 2 ? -3 : 3, 16, 4), 0);
  const potPivot = { x: POT.x, y: STOOL.top };
  /** Where crayon `k` is (its middle) and its turn (degrees; 0 lying with its tip to the right, -90 standing tip up). */
  const crayonAt = (k: number, t: number): { pt: Pt; angle: number } => {
    const c = CRAYONS[k];
    const rest = { x: c.x, y: FLOOR - CRAYON.th / 2 };
    const slot = IN_POT[k];
    const tilt = potTilt(t);
    const inPot = turn(slot, potPivot, rad(tilt));
    const u = seg(t, tCrayon[k], tCrayonIn[k]);
    if (u <= 0) return { pt: rest, angle: c.tilt };
    if (u >= 1) return { pt: inPot, angle: slot.angle + tilt };
    // Each crayon goes in its own way, in the same time.
    switch (CRAYON_WAYS[k]) {
      case "cartwheel":
        return { pt: hop(rest, inPot, 230, u), angle: lerp(c.tilt, slot.angle - 720, u) };
      case "stool": {
        // A bounce on the stool's edge, then into the pot.
        const edge = { x: STOOL.x + (rest.x < STOOL.x ? -1 : 1) * (STOOL.w / 2 - 12), y: STOOL.top - CRAYON.th / 2 };
        if (u < 0.55) return { pt: hop(rest, edge, 90, u / 0.55), angle: lerp(c.tilt, 0, u / 0.55) };
        return { pt: hop(edge, inPot, 80, seg(u, 0.55, 1)), angle: lerp(0, slot.angle - 360, easeOut(seg(u, 0.55, 1))) };
      }
      case "rocket": {
        // Stands up on the floor and shoots straight up over the pot, then drops in.
        const high = { x: inPot.x, y: STOOL.top - POT.h - 150 };
        if (u < 0.5)
          return {
            pt: { x: lerp(rest.x, high.x, easeInOut(u / 0.5)), y: lerp(rest.y, high.y, easeOut(u / 0.5)) },
            angle: lerp(c.tilt, -90, easeOut(seg(u, 0, 0.2))),
          };
        return { pt: { x: inPot.x, y: lerp(high.y, inPot.y, easeIn(seg(u, 0.5, 1))) }, angle: lerp(-90, slot.angle, seg(u, 0.5, 1)) };
      }
      default:
        return { pt: hop(rest, inPot, 150, u), angle: lerp(c.tilt, slot.angle - 360, easeOut(u)) };
    }
  };

  /* Each puzzle piece the ball gets to hops up into its place in the board, klack; with the last one the picture is whole. */
  const tPiece = PIECES.map((p) => ballGetsTo(p.x - PUZZLE.w / 2 + 10));
  const tPieceIn = tPiece.map((tp) => tp + PIECE_HOP);
  tPieceIn.forEach((tp, i) => {
    at(tp, { sound: () => playKnock(950 + 80 * i) });
  });
  const tPuzzle = Math.max(...tPieceIn) + 0.1;
  at(tPuzzle, { sound: playChime });
  /** Where piece `i` is (its middle), its turn (degrees) and how flat it is drawn (`PIECE_FLAT` lying, 1 in the board). */
  const pieceAt = (i: number, t: number): { pt: Pt; angle: number; flat: number } => {
    const p = PIECES[i];
    const rest = { x: p.x, y: PIECE_Y };
    const slot = slotCentre(p.slot);
    const u = seg(t, tPiece[i], tPieceIn[i]);
    if (u <= 0) return { pt: rest, angle: p.tilt, flat: PIECE_FLAT };
    if (u >= 1) return { pt: slot, angle: 0, flat: 1 };
    // Each piece goes in its own way, in the same time.
    switch (PIECE_WAYS[i]) {
      case "frisbee":
        // Spins lying flat, like a frisbee, and stands up only at the end.
        return { pt: hop(rest, slot, 220, u), angle: lerp(p.tilt, 720, easeOut(u)), flat: lerp(PIECE_FLAT, 1, easeInOut(seg(u, 0.55, 1))) };
      case "scoot": {
        // Slides along the floor to below its hole, then pops up into it.
        const below = { x: slot.x, y: PIECE_Y };
        if (u < 0.45) return { pt: { x: lerp(rest.x, below.x, easeInOut(u / 0.45)), y: PIECE_Y }, angle: lerp(p.tilt, 0, u / 0.45), flat: PIECE_FLAT };
        const k = easeOut(seg(u, 0.45, 1));
        return { pt: { x: slot.x, y: lerp(PIECE_Y, slot.y, k) - 40 * Math.sin(Math.PI * k) }, angle: 0, flat: lerp(PIECE_FLAT, 1, k) };
      }
      case "tumble":
        return { pt: hop(rest, slot, 260, easeInOut(u)), angle: lerp(p.tilt, -1080, easeOut(u)), flat: lerp(PIECE_FLAT, 1, u) };
      default:
        return { pt: hop(rest, slot, 140, easeInOut(u)), angle: lerp(p.tilt, 360 * (i % 2 ? -1 : 1), easeOut(u)), flat: lerp(PIECE_FLAT, 1, easeOut(u)) };
    }
  };

  /* The ball bumps the rolled-up rug: it unrolls across the floor, its roll getting thinner and turning faster, until
     it bumps the knob of the jack-in-the-box's crank. */
  const rugLen = RUG.end - RUG.x;
  const tRugEnd = tRug + RUG_TIME;
  at(tRug, { sound: playThump });
  at(tRug + 0.1, { sound: playRustle });
  /** How far the roll has come: quick at first, slower as it gets thin. */
  const rugGone = (t: number) => {
    const k = seg(t, tRug, tRugEnd);
    return rugLen * k * (1.4 - 0.4 * k);
  };
  /** The roll at a moment: its middle, its radius, and how far it has turned (degrees); the rug lies flat behind it. */
  const rugAt = (t: number) => {
    const d = rugGone(t);
    // Unrolling `d` of the rug takes away that much of the roll's area: r² falls in a straight line, and the turn is ∫ dd / r.
    const c = (RUG.r0 ** 2 - RUG.r1 ** 2) / rugLen;
    const r = Math.sqrt(RUG.r0 ** 2 - c * d);
    return { pt: { x: RUG.x + d, y: FLOOR - r }, r, spin: (2 / c) * (RUG.r0 - r) * toDeg };
  };

  /* The roll turns the crank once round, and at the end of the turn – pop – the lid flies open and the clown springs
     out on its spring, bobs, and leans over to the right until its head nudges the pyjamas on the line. */
  const tJack = tRugEnd + CRANK_TURN;
  at(tRugEnd, { sound: playClick });
  at(tJack, { sound: playPop });
  at(tJack + 0.06, { sound: playBoing });
  /** The crank's turn in degrees (one turn back over the top, as the roll pushes its knob). */
  const crankTurn = (t: number) => -360 * easeOut(seg(t, tRugEnd, tJack));
  /** How far the lid is open (degrees, swinging up and over to the left). */
  const jackLid = (t: number) => -120 * easeOut(seg(t, tJack, tJack + 0.18)) + wobble(t - tJack - 0.18, 10, 18, 5);
  const tNudge = tJack + CLOWN_LEAN;
  /** Where the clown's spring stands in the box, round which it leans. */
  const clownBase = { x: JACK.x0 + JACK.w / 2, y: FLOOR - JACK.h + 6 };
  /** How far the spring is out of the box (hidden below its rim before the pop), and how far it leans right (degrees). */
  const clownAt = (t: number) => {
    const u = t - tJack;
    const out = u < 0 ? CLOWN_HIDDEN : CLOWN_HIDDEN + (CLOWN.spring - CLOWN_HIDDEN) * (1 - decay(6 * u) * Math.cos(14 * u));
    // Leans over slowly, nudges the pyjamas and springs back half way.
    const lean =
      CLOWN.lean * easeInOut(seg(u, 0.55, CLOWN_LEAN)) -
      CLOWN.lean * 0.4 * easeOut(seg(u, CLOWN_LEAN, CLOWN_LEAN + 0.5)) +
      wobble(u - CLOWN_LEAN - 0.5, 5, 9, 2.5);
    return { out, lean };
  };
  /** The middle of the clown's head. */
  const clownHead = (t: number): Pt => {
    const { out, lean } = clownAt(t);
    return turn({ x: clownBase.x, y: clownBase.y - out - CLOWN.head }, clownBase, rad(lean));
  };
  at(tNudge, { sound: playSqueak });

  /* Nudged off their peg, the pyjamas zip down the clothes line on their hanger to the knot at its end; there the legs
     swing on and kick the slinky off the step stool's top step. */
  const nudgeHead = clownHead(tNudge);
  // The hanger hangs where the left leg just touches the clown's head at the nudge.
  const hanger0 = { x: nudgeHead.x + CLOWN.head + PYJAMAS.leg + 18, y: 0 };
  hanger0.y = lineY(hanger0.x);
  const hangerEnd = { x: HANGER_STOP, y: lineY(HANGER_STOP) };
  const zipPath = pathOf(line(hanger0, hangerEnd));
  const zipRun = roll(zipPath, 60, 60, 240, 0.6);
  const tSlide = tNudge + 0.1;
  const tArrive = tSlide + zipRun.duration;
  at(tSlide, { sound: playSlide });
  at(tArrive, { sound: () => playKnock(760) });
  /** The pyjamas' swing (radians; positive: the legs swing forward, to the right). */
  const SWING = 0.5;
  const swingAt = (t: number) => {
    if (t < tSlide) return 0;
    // Trailing a little behind while they zip, then swinging forward at the knot and dying away.
    if (t < tArrive) return -0.12 * easeOut(seg(t, tSlide, tSlide + 0.6));
    const u = t - tArrive;
    if (u < 0.32) return lerp(-0.12, SWING, Math.sin((Math.PI / 2) * (u / 0.32)));
    return SWING * decay(1.4 * (u - 0.32)) * Math.cos((2 * Math.PI * (u - 0.32)) / 1.1);
  };
  /** Where the hanger's hook is on the line, and the pyjamas' swing. */
  const hangerAt = (t: number) => ({
    hook: t < tSlide ? hanger0 : along(zipPath, distAt(zipRun, t - tSlide)).pt,
    swing: swingAt(t),
  });
  /** The front foot of the pyjamas, which kicks the slinky. */
  const footAt = (t: number) => {
    const { hook, swing } = hangerAt(t);
    return {
      x: hook.x + PYJAMAS.leg * Math.cos(swing) + PYJAMAS.feet * Math.sin(swing),
      y: hook.y - PYJAMAS.leg * Math.sin(swing) + PYJAMAS.feet * Math.cos(swing),
    };
  };
  // The kick: the swing reaches the slinky on its way forward.
  const KICK_SWING = 0.38;
  const tFeet = tArrive + (0.32 * Math.asin((KICK_SWING + 0.12) / (SWING + 0.12))) / (Math.PI / 2);

  /* The slinky walks down the step stool, one step at a time – the top end flips over onto the next step and the rest
     follows – and on to the floor and onto the ruler's raised end. */
  const kickFoot = footAt(tFeet);
  // The front leg is about 30 wide: its outer side touches the slinky.
  const slinky0 = { x: kickFoot.x + 15 + SLINKY.w / 2, y: STEPS[0].top };
  /** Where the slinky stands after each step: on the steps, on the floor, and on the ruler's raised end. */
  const rulerTop = (x: number, tilt: number) => RULER.y + (x - RULER.x) * Math.tan(rad(tilt)) - RULER.th / 2;
  const onRuler = { x: RULER.x - RULER.half + 18, y: 0 };
  onRuler.y = rulerTop(onRuler.x, RULER.tilt);
  const slinkySpots: Pt[] = [
    slinky0,
    ...STEPS.slice(1).map((s, k) => ({ x: slinky0.x + SLINKY_STEP * (k + 1), y: s.top })),
    { x: slinky0.x + SLINKY_STEP * STEPS.length, y: FLOOR },
    onRuler,
  ];
  const FLIPS = slinkySpots.length - 1;
  const tFlip = (k: number) => tFeet + SLINKY_FLIP * k;
  const tOnRuler = tFlip(FLIPS);
  for (let k = 0; k < FLIPS; k++) at(tFlip(k), { sound: () => playHop(SLINKY_FLIP - 0.06) });

  /* The slinky lands on the ruler's raised end: it snaps down, the other end flies up and flings the paper plane. */
  const tSnap = tOnRuler + 0.08;
  at(tOnRuler, { sound: () => playKnock(420) });
  at(tSnap, { sound: playWhoosh });
  /** The ruler's tilt in degrees (positive: left end up). */
  const rulerTilt = (t: number) => lerp(RULER.tilt, -RULER.tilt, easeIn(seg(t, tOnRuler, tOnRuler + 0.12))) + wobble(t - tOnRuler - 0.12, 2.5, 30, 6);
  /** The slinky's two ends and how high it arches between them: standing, it is a stack from its foot straight up. */
  const slinkyAt = (t: number): { a: Pt; b: Pt; arch: number } => {
    const up = (p: Pt): Pt => ({ x: p.x, y: p.y - SLINKY.h });
    if (t < tFeet) return { a: slinky0, b: up(slinky0), arch: 0 };
    if (t >= tOnRuler) {
      // Riding the ruler down as it snaps.
      const pivot = { x: RULER.x, y: RULER.y };
      const da = rad(rulerTilt(t) - RULER.tilt);
      return { a: turn(onRuler, pivot, da), b: turn(up(onRuler), pivot, da), arch: 0 };
    }
    const k = Math.min(FLIPS - 1, Math.floor((t - tFeet) / SLINKY_FLIP));
    const u = seg(t, tFlip(k), tFlip(k + 1));
    const from = slinkySpots[k];
    const to = slinkySpots[k + 1];
    // The top end flips over onto the next spot, then the other end comes up and over to stand on it.
    const arch = SLINKY.h * 1.5 * Math.sin(Math.PI * u);
    if (u < 0.55) return { a: from, b: hop(up(from), to, 30, easeInOut(u / 0.55)), arch };
    return { a: hop(from, up(to), 30, easeInOut(seg(u, 0.55, 1))), b: to, arch };
  };

  /* The paper plane flies up, loops once and glides down onto the robot vacuum's button. */
  const plane0 = { x: PLANE.x, y: rulerTop(PLANE.x, RULER.tilt) - 7 };
  const loopIn = { x: LOOP.x, y: LOOP.y + LOOP.r };
  const planeDown = { x: ROBOT.x, y: FLOOR - ROBOT.h - 9 };
  const planePath = pathOf(
    quad(plane0, { x: plane0.x + 70, y: loopIn.y + 30 }, loopIn),
    arc(LOOP.x, LOOP.y, LOOP.r, 90, -270),
    quad(loopIn, { x: loopIn.x + 260, y: loopIn.y }, planeDown),
  );
  const planeRun = roll(planePath, 640, 250, 640, 0.25);
  const tPlaneDown = tSnap + planeRun.duration;
  at(tPlaneDown, { sound: playClick });

  /* The robot vacuum wakes with a little tune, drives off sweeping up the crumbs and knocks the plug out of the cushion. */
  const tWake = tPlaneDown + 0.15;
  const tDrive = tWake + 0.7;
  const robotFront0 = ROBOT.x + ROBOT.w / 2;
  const robotRun = drive(PLUG.x - robotFront0, ROBOT_SPEED, ROBOT_RAMP);
  const tPop = tDrive + robotRun.duration;
  at(tWake, { sound: playRobot });
  at(tDrive, { sound: playWhirr });
  /** When the vacuum's front gets to each crumb, which it then sweeps in. */
  const tCrumb = CRUMBS.map((c) => tDrive + robotRun.when(c.x - 4 - robotFront0));
  at(tCrumb[0], { sound: playCrackle });
  at(tCrumb[4], { sound: playCrackle });
  /** The vacuum's middle; once the plug is out, the air pushes it back a little. */
  const robotX = (t: number) => ROBOT.x + robotRun.at(t - tDrive) - 70 * easeOut(seg(t, tPop + 0.05, tPop + 1.1));
  /** How far its side brush has turned (degrees): it spins while the vacuum is awake and driving. */
  const brushTurn = (t: number) => 600 * Math.max(0, Math.min(t, tPop + 0.4) - tWake);
  /** Crumb `i`: where it is and how big (1 lying, 0 swept in), or null once it is gone. */
  const crumbAt = (i: number, t: number): { pt: Pt; size: number } | null => {
    const c = CRUMBS[i];
    const k = seg(t, tCrumb[i], tCrumb[i] + 0.2);
    if (k >= 1) return null;
    return { pt: { x: c.x + 14 * k, y: FLOOR - c.r }, size: 1 - k };
  };
  /** Where the paper plane is and its heading (degrees): on the ruler, flying, and riding on the vacuum once it is down. */
  const planeAt = (t: number): { pt: Pt; angle: number } => {
    if (t < tSnap) return { pt: plane0, angle: RULER.tilt };
    if (t < tPlaneDown) {
      const { pt, angle } = along(planePath, distAt(planeRun, t - tSnap));
      return { pt, angle: angle * toDeg };
    }
    return { pt: { x: robotX(t), y: planeDown.y }, angle: 0 };
  };

  /* The vacuum knocks the plug out: pfffft, the air rushes out, the cushion jumps like a balloon let go and throws the
     bunny into bed, then lies flat. */
  const tLaunch = tPop + 0.2;
  const tLand = tLaunch + FLIGHT;
  at(tPop, { sound: playPop });
  at(tPop + 0.05, { sound: playPuff });
  at(tPop + 0.45, { sound: playPuff });
  at(tLaunch, { sound: playWhoosh });
  at(tLand, { sound: playBoing });
  /** How full the cushion is, 1 to 0, flapping as the air goes out. */
  const cushion = (t: number) => clamp01(1 - easeIn(seg(t, tPop + 0.15, tPop + 1.6)) + wobble(t - tPop, 0.12, 22, 2.5));
  /** How high the cushion jumps off the floor. */
  const cushionHop = (t: number) => 70 * hump(seg(t, tPop, tPop + 0.5));
  /** Seconds since the plug came out, while the air rushes out of the hole (-1 otherwise). */
  const jet = (t: number) => (t < tPop || t > tPop + 1.6 ? -1 : t - tPop);
  /** Where the plug's cap is and its turn: on the plug, then flying off high over the vacuum and lying on the floor behind it. */
  const capRest = { x: PLUG.x - 340, y: FLOOR - 7 };
  const capAt = (t: number): { pt: Pt; angle: number } => {
    const u = seg(t, tPop, tPop + 0.8);
    return { pt: hop({ x: PLUG.x, y: PLUG.y }, capRest, 230, u), angle: -630 * easeOut(u) };
  };

  /** Where the bunny is (its middle) and its turn: lying on its back on the cushion (head left), a somersault and a half, lying in bed (head right). */
  const bunny0 = { x: (CUSHION.x0 + CUSHION.x1) / 2, y: FLOOR - CUSHION.full - 32 };
  const bunnyAt = (t: number): { pt: Pt; angle: number } => {
    if (t < tLaunch) return { pt: { x: bunny0.x, y: bunny0.y - cushionHop(t) }, angle: -90 };
    const lift = { x: bunny0.x, y: bunny0.y - cushionHop(tLaunch) };
    const k = seg(t, tLaunch, tLand);
    // The mattress gives a little as it lands.
    const sink = 10 * hump(seg(t, tLand, tLand + 0.3));
    const p = hop(lift, IN_BED, 280, k);
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
  at(tGlitter + 0.5, {
    say: {
      de: "Alles aufgeräumt! Alles glitzert!",
      en: "All tidy! Everything sparkles!",
      zh: "都收拾好啦！亮晶晶的！",
      hi: "सब साफ़! सब चमक रहा है!",
      es: "¡Todo ordenado! ¡Todo brilla!",
      ar: "كل شيء مرتّب! كل شيء يلمع!",
      ru: "Всё убрано! Всё блестит!",
    },
  });
  at(tDone, { done: true });

  /** The truck's wheels: how far they have turned (degrees); they go on whirring while it bounces on the bellows. */
  const wheelTurn = (t: number) =>
    ((truckFront(t) - front0) / TRUCK.wheelR) * toDeg + 900 * clamp01((t - tStand) / (tLastPress - tStand)) * (tLastPress - tStand);
  /** The wind-up key turns while the truck drives and bounces. */
  const keyTurn = (t: number) => (t < tGo ? 0 : 140 * (Math.min(t, tLastPress + 0.3) - tGo));

  /** Where the camera looks: the horse, the ball, the chest while the lid shuts, the truck, the shelf, the socks, the sock ball, the rug, the jack-in-the-box and the pyjamas, the slinky, the plane, the robot vacuum, and the bed. */
  // The camera's left edge is 0.42 of the screen left of what it looks at, so the finale shows the vacuum, the cushion and the whole bed.
  const finale = BED.x1 + 10 - VIEW_W * 0.58;
  const shelfFocus = (SHELF.x0 + SHELF.x1) / 2;
  // Shows the bellows, the heap of socks, the basket and where the sock ball comes down.
  const sockFocus = 3900;
  /** From each moment on, what the camera follows; at each change it glides over from the one before within `GLIDE` seconds. */
  const GLIDE = 1;
  const shots: [number, (t: number) => number][] = [
    [
      -Infinity,
      (t) => {
        if (t < tKick) return 0;
        if (t < tTop) return Math.max(0, ballAt(t).pt.x - 150);
        if (t < tGo) return CHEST.x0 + 160;
        if (t < tStop) return Math.max(CHEST.x0 + 160, truckFront(t) - 60);
        if (t < tPump) return lerp(frontStop - 60, shelfFocus, clamp01((t - tStop) / 1.5));
        if (t < tBallOff) return lerp(shelfFocus, sockFocus, clamp01((t - tPump) / 1.2));
        // Then the sock ball, a little ahead of it while it bounces, and soon a little behind it as it rolls.
        return Math.max(sockFocus, sockBallAt(t).pt.x - lerp(380, 80, seg(t, tHit, tRoll + 1.5)));
      },
    ],
    [tRug, (t) => rugAt(t).pt.x - 40],
    [tJack, (t) => Math.max(JACK.x0 + 200, hangerAt(t).hook.x + 60)],
    [tArrive, (t) => Math.max(HANGER_STOP + 60, slinkyAt(t).a.x + 60)],
    [tSnap, (t) => lerp(PLANE.x, ROBOT.x, easeInOut(seg(t, tSnap, tPlaneDown))) + 160],
    [tPlaneDown, (t) => robotX(t) + 40],
    [tPop, () => finale],
  ];
  const focusX = (t: number) => {
    let i = shots.length - 1;
    while (t < shots[i][0]) i--;
    const [from, follow] = shots[i];
    const x = follow(t);
    if (i === 0 || t >= from + GLIDE) return x;
    return lerp(shots[i - 1][1](from), x, easeInOut(seg(t, from, from + GLIDE)));
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
    /** When the last sock lands in the basket. */
    tSocksIn: tSockIn(SOCKS.length - 1),
    tBallOff,
    tHit,
    tRoll,
    /** When the last crayon lands in the pot. */
    tCrayonsIn: Math.max(...tCrayonIn),
    tPuzzle,
    tRug,
    tRugEnd,
    tJack,
    tNudge,
    tSlide,
    tArrive,
    /** When the pyjamas' feet kick the slinky. */
    tFeet,
    tOnRuler,
    tSnap,
    tPlaneDown,
    tWake,
    tDrive,
    tPop,
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
    blast,
    basketTilt,
    sockAt,
    sockBallAt,
    potTilt,
    crayonAt,
    pieceAt,
    rugAt,
    crankTurn,
    jackLid,
    clownAt,
    clownHead,
    hangerAt,
    footAt,
    slinkyAt,
    slinkySpots,
    rulerTilt,
    planeAt,
    robotX,
    brushTurn,
    crumbAt,
    cushion,
    cushionHop,
    jet,
    capAt,
    bunnyAt,
    blanket,
    cameraTarget,
    width: WORLD_W,
    /** The hose from the bellows under the shelf to the heap of socks. */
    hose: [...line({ x: BELLOWS.x1, y: FLOOR - 10 }, { x: BELLOWS.x1 + 30, y: FLOOR - 8 }), ...line({ x: BELLOWS.x1 + 30, y: FLOOR - 8 }, NOZZLE).slice(1)],
  };
}

/** For the tests: where each block lands in the chest, and the ball's spot there. */
export const IN_THE_CHEST = { blocks: IN_CHEST, ball: BALL_IN };
