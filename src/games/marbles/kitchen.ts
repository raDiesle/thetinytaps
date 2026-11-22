// The crazy kitchen ("Verrückte Küche"), a Rube Goldberg machine along a long
// kitchen counter: one tap lets a marble out of the spice jar, and one thing
// sets off the next for about a minute while the camera travels along:
// spoon, paper towel roll, rolling pin down the cutting board, the ladle that
// throws a meatball against a plate, the plate rolling into the salad
// spinner's crank – the spinner whirls, its lid pops off and lettuce flies,
// one leaf slaps the egg timer on the cookie jar, which turns, ticks, rings
// and rattles off onto the pancake pan's handle – the pancake somersaults
// high onto the jelly, whose wobble tips the pepper mill against the coffee
// machine's button; the machine grinds, pours a cup and puffs steam under a
// bottle of apple fizz, whose cork pops onto the egg in its egg cup; the egg
// tips out, wobbles down the baking tray into the honey jar, the jar falls
// over and its honey oozes onto the cooktop's touch field, popcorn pops into
// the mug on the toaster lever, and the toast flies onto the bunny's plate.
// Everything is worked out ahead as a function of the seconds since the tap,
// so KitchenLevel.tsx only asks where each thing is at a moment. Coordinates
// are those of the kitchen, 8654 × 900; the screen shows 1600 of it at a time.

import {
  playAlarm,
  playBeeps,
  playBoing,
  playClick,
  playClonk,
  playCreak,
  playDing,
  playGlug,
  playHum,
  playKnock,
  playPlop,
  playPop,
  playPuff,
  playRattle,
  playRing,
  playRumble,
  playRustle,
  playSlide,
  playSwirl,
  playThump,
  playTick,
  playTrickle,
  playTwinkle,
  playWhirr,
  playWhistle,
  playWhoosh,
} from "@/lib/sfx";
import { SETTLE_S, wobble } from "./level";
import {
  along,
  beside,
  cameraOn,
  deg,
  distAt,
  easeIn,
  easeInOut,
  easeOut,
  hop,
  lerp,
  pathOf,
  rad,
  roll,
  type Run,
  seg,
  STEP,
  timeline,
  timeWhen,
  turn,
} from "./machineKit";
import { arc, BALL_R, line, quad, type Pt } from "./path";

export const WORLD_W = 8654;
export const FLOOR = 800;
/** The top of the worktop: everything on the counter stands at this height. */
export const COUNTER = 640;

/* ---------- Layout ---------- */

/** The upside-down spice jar; the marble comes out of its shaker cap at (x, y). */
export const HOPPER = { x: 200, y: 150 };

/** The big wooden spoon: its top from the bowl end (upper left) to the tip of the handle. */
export const SPOON = { from: { x: 112, y: 244 }, to: { x: 770, y: 318 }, bowlX: 196 };
export const spoonY = (x: number) => SPOON.from.y + ((x - SPOON.from.x) * (SPOON.to.y - SPOON.from.y)) / (SPOON.to.x - SPOON.from.x);

/** The paper towel roll on its wall holder, seen from its end; `depth` is how far back its other end is drawn. */
export const ROLL = { cx: 850, cy: 384, r: 50, depth: { x: 34, y: -24 } };

/** The wall shelf the paper towel falls onto and the rolling pin lies on. */
export const SHELF = { x0: 700, x1: 1140, y: 480, h: 18 };

/** The rolling pin, also seen from its end, lying at the very edge of the shelf. */
export const PIN = { r: 30, x0: SHELF.x1 - 30, depth: { x: 30, y: -21 } };

/** The cutting board hangs from the shelf by its hole and leans down onto the counter. */
export const BOARD = { from: { x: 1144, y: 508 }, to: { x: 1720, y: 628 }, h: 12 };
export const boardY = (x: number) => BOARD.from.y + ((x - BOARD.from.x) * (BOARD.to.y - BOARD.from.y)) / (BOARD.to.x - BOARD.from.x);

/**
 * The soup ladle hangs from a hook on the rail; its bowl sits `bowl` from the
 * hook (to the right of the handle) with the meatball in it. A peg in the wall
 * stops the handle when the ladle has swung up by `stop` degrees.
 */
export const LADLE = { hook: { x: 2000, y: 250 }, bowl: { x: 38, y: 330 }, bowlR: 38, stop: 50, pegAt: 150 };
export const MEATBALL = { r: 24 };
/** The meatball's middle in the ladle bowl, measured from the hook while the ladle hangs straight. */
const MEAT_IN_BOWL = { x: LADLE.bowl.x, y: LADLE.bowl.y + LADLE.bowlR - MEATBALL.r };
/** The wall peg, just right of the handle `pegAt` below the hook when the ladle is at its stop. */
export const PEG = turn({ x: LADLE.hook.x + 13, y: LADLE.hook.y + LADLE.pegAt }, LADLE.hook, -rad(LADLE.stop));

/** A plate standing on its rim between two little pegs, ready to roll like a wheel. */
export const PLATE = { r: 80, x0: 3000, pegW: 14, pegH: 10 };
export const PLATE_Y = COUNTER - PLATE.r;
/** How far either peg's inner edge is from the plate's middle: they touch the rim. */
export const PLATE_PEG_DX = Math.sqrt(PLATE.r ** 2 - (PLATE.r - PLATE.pegH) ** 2);

export const SPAGHETTI = { cx: 2845, rimY: 598, w: 140 };

/**
 * The salad spinner on the counter: a see-through bowl from `top` down to the
 * counter (`w` wide at the top, `foot` at the bottom) and its lid, whose
 * middle sits at `lidY` with the crank on top.
 */
export const SPINNER = { cx: 4350, top: 528, w: 164, foot: 136, lidY: 522 };
/** The crank on the lid: its arm `r` long, the knob standing `knobUp` above the lid's middle; it starts pointing left. */
export const CRANK = { r: 112, knobUp: 28, knobR: 11 };
export const KNOB_Y = SPINNER.lidY - CRANK.knobUp;

/** The wooden wedge under the pancake pan: the pan tips over its tip (`x`, `h` above the counter). */
export const WEDGE = { x: 4700, h: 40, w: 60 };
/**
 * The pancake pan, measured from the wedge's tip along the pan's bottom: the
 * bottom reaches `back` to the left, the handle `handle` to the right.
 */
export const PAN = { back: 150, rimH: 30, handle: 190, handleH: 14 };
/** The pan's tilt in degrees (right side up): at rest its left edge is on the counter, then its handle. */
export const PAN_REST = deg(Math.asin(WEDGE.h / PAN.back));
export const PAN_DOWN = -deg(Math.asin(WEDGE.h / PAN.handle));
/** The pancake: its radius and thickness, and where it lies in the pan (from the wedge's tip). */
export const PANCAKE = { r: 52, h: 14, inPan: -78 };

/** The cookie jar the egg timer stands on; `top` is the top of its lid. */
export const JAR = { x0: 4910, x1: 5040, top: 450 };
/** The egg timer, drawn round its middle: `foot` down to the bottom of its feet; it lands `onHandle` along the pan's handle. */
export const TIMER = { rx: 36, ry: 44, foot: 48, onHandle: 172 };
/** How far the egg timer's dial turns when it is wound up, in degrees. */
export const DIAL_MAX = 300;

/**
 * The raspberry jelly on its little plate, which catches the pancake: `foot` and
 * `top` are its widths at the bottom and the top, `h` its height on the plate.
 */
export const JELLY = { cx: 5260, h: 96, foot: 120, top: 90, plate: 140, plateH: 8 };
export const JELLY_TOP = COUNTER - JELLY.plateH - JELLY.h;
/** How far the jelly's top sways to either side while it wobbles, and how long one sway there and back takes. */
export const SWAY = { amp: 30, period: 0.62 };

/** The tall pepper mill beside the jelly, just where the jelly's top reaches as it sways; it tips over its bottom right corner. */
export const MILL = { x0: JELLY.cx + JELLY.top / 2 + SWAY.amp, w: 54, h: 210 };
/** How far the mill leans, in degrees, once it lies against the coffee machine's button. */
export const MILL_LEAN = 28;
/** The mill's top right corner when it leans: it rests there on the button. */
const MILL_TIP = { x: MILL.x0 + MILL.w + MILL.h * Math.sin(rad(MILL_LEAN)), y: COUNTER - MILL.h * Math.cos(rad(MILL_LEAN)) };

/**
 * The coffee machine: its button sticks out of the left side `button` far (pushed in, `pressed`) just where the
 * leaning mill's corner comes to rest; the cup stands under the spout, the bottle of apple fizz on top.
 */
export const COFFEE = { x0: MILL_TIP.x + 4, w: 200, top: 380, buttonY: MILL_TIP.y, button: 12, pressed: 4, buttonR: 13 };
export const CUP = { cx: COFFEE.x0 + 104, w: 56, h: 48 };
/** The drip tray the cup stands on, and the spout above it. */
export const DRIP_Y = COUNTER - 12;
export const SPOUT_Y = 512;
export const BOTTLE = { cx: COFFEE.x0 + COFFEE.w - 46, w: 50, h: 128 };
export const CORK = { w: 28, h: 34, sunk: 12 };
/** The cork's middle while it sits in the bottle's neck. */
export const CORK0 = { x: BOTTLE.cx, y: COFFEE.top - BOTTLE.h - CORK.h / 2 + CORK.sunk };

/** The bread box; an egg stands in its egg cup on the lid, near the right end. */
export const BREADBOX = { x0: 5800, x1: 6020, top: 530 };
export const EGG_CUP = { cx: BREADBOX.x1 - 50, w: 36, h: 30 };
/** The egg: half its width and half its length; it sits `sunk` deep in the cup. */
export const EGG = { rx: 22, ry: 30, sunk: 16 };
export const EGG0 = { x: EGG_CUP.cx, y: BREADBOX.top - EGG_CUP.h + EGG.sunk - EGG.ry };

/** The baking tray leans from the bread box's top right corner down onto the counter: `from` and `to` are the ends of its top, `h` thick. */
export const TRAY = { from: { x: BREADBOX.x1, y: BREADBOX.top }, to: { x: 6330, y: COUNTER - 8 }, h: 8 };

/** The honey jar the egg rolls against; once it lies on its side its mouth is at `mouthX`. */
export const HONEY = { x0: 6680, w: 84, h: 100, lid: 16 };
export const HONEY_MOUTH_X = HONEY.x0 + HONEY.w + HONEY.h;

/** The cooktop set into the worktop, with its touch field at the left end, where the honey runs to. */
export const COOKTOP = { x0: 6974, x1: 7554, touchX: 7034 };
export const KETTLE = { cx: 7254, h: 120 };
export const POT = { cx: 7434, w: 150, h: 84 };
export const POT_RIM = COUNTER - POT.h;

/** The toaster; its lever knob sticks out of the left side and goes down from `up` to `down`. */
export const TOASTER = { x0: 7644, x1: 7864, top: 470, slotX: 7754 };
export const LEVER = { knobW: 28, up: 500, down: 576 };
export const KNOB_X = TOASTER.x0 - LEVER.knobW;
/** The mug hangs by its handle from the lever knob; `x` is its middle. */
export const MUG = { x: 7572, w: 60, h: 58 };
export const mugTop = (knobY: number) => knobY - 4;
/** Popcorn in the mug that makes it heavy enough to pull the lever down. */
export const MUG_FULL = 9;

export const TOAST = { w: 92, h: 96 };
/** The toast's middle while it sticks out of the slot, and how far it sinks with the lever. */
const TOAST_UP = TOASTER.top - 30 + TOAST.h / 2;
const TOAST_SINK = 46;

/** The breakfast plate (lying flat) and the toy bunny waiting for the toast. */
export const BREAKFAST = { cx: 8234, top: 622 };
export const BUNNY = { x: 8424 };

/* ---------- Helpers ---------- */

/** Speed at the end of a run, to carry on with the next. */
function endSpeed(run: Run) {
  const n = run.d.length - 1;
  return n > 0 ? (run.d[n] - run.d[n - 1]) / STEP : 0;
}

/** Where a thing on a run is `t` seconds after the run started at `t0`. */
const onRun = (run: Run, t0: number, t: number) => along(run.path, distAt(run, t - t0)).pt;

/** A spot on the ladle (measured from the hook while it hangs straight) when it has swung up by `angle` degrees. */
export function onLadle(p: Pt, angle: number): Pt {
  return turn({ x: LADLE.hook.x + p.x, y: LADLE.hook.y + p.y }, LADLE.hook, -rad(angle));
}

/** A spot on the pancake pan (measured from the wedge's tip along its bottom) when the pan is tilted by `angle` degrees. */
export function onPan(p: Pt, angle: number): Pt {
  return turn({ x: WEDGE.x + p.x, y: COUNTER - WEDGE.h + p.y }, { x: WEDGE.x, y: COUNTER - WEDGE.h }, -rad(angle));
}

/** Pseudo-random but fixed numbers between -1 and 1, so the popcorn flies the same way every time. */
const jitter = (i: number) => Math.sin(i * 12.9898 + 4.1) * 0.5 + Math.sin(i * 7.233 + 1.3) * 0.5;

interface Flight {
  t0: number;
  t1: number;
  a: Pt;
  b: Pt;
  h: number;
}

/** A lettuce leaf flung out of the salad spinner: its flight, its turns in the air and how it lies once down. */
export interface Leaf extends Flight {
  turns: number;
  rest: number;
}

/** One popped corn: where it flies, and where it ends up. */
export interface Kernel extends Flight {
  to: "pot" | "mug" | "counter";
}

/* ---------- The machine ---------- */

export type Kitchen = ReturnType<typeof buildKitchen>;

export function buildKitchen() {
  const { at, sorted } = timeline();

  /* The marble: out of the spice jar into the spoon, down the handle, over the paper towel roll, onto the shelf. */
  const marble0 = { x: HOPPER.x, y: HOPPER.y - 34 };
  const inBowl = { x: SPOON.bowlX, y: spoonY(SPOON.bowlX) - BALL_R + 8 };
  const fall = roll(pathOf(line(marble0, inBowl)), 0, 0, 900, 0);
  const tip = { x: SPOON.to.x, y: SPOON.to.y - BALL_R };
  const overR = ROLL.r + BALL_R;
  const rollIn = { x: ROLL.cx + overR * Math.cos(rad(-125)), y: ROLL.cy + overR * Math.sin(rad(-125)) };
  const rollOut = { x: ROLL.cx + overR * Math.cos(rad(-35)), y: ROLL.cy + overR * Math.sin(rad(-35)) };
  const onShelf = SHELF.y - BALL_R;
  /** Where the marble touches the rolling pin: the pin lies a little higher, its middle 8 above the marble's. */
  const hitX = PIN.x0 - Math.sqrt((BALL_R + PIN.r) ** 2 - (onShelf - (SHELF.y - PIN.r)) ** 2);
  const spoonPath = pathOf(
    line(inBowl, { x: SPOON.bowlX + 50, y: spoonY(SPOON.bowlX + 50) - BALL_R }),
    line({ x: SPOON.bowlX + 50, y: spoonY(SPOON.bowlX + 50) - BALL_R }, tip),
    quad(tip, { x: tip.x + 22, y: tip.y + 2 }, rollIn),
  );
  const spoon = roll(spoonPath, 130, 130, 340, 0.3);
  const overPath = pathOf(
    arc(ROLL.cx, ROLL.cy, overR, -125, -35),
    quad(rollOut, { x: rollOut.x + 15, y: rollOut.y + 22 }, { x: 965, y: onShelf }),
    line({ x: 965, y: onShelf }, { x: hitX, y: onShelf }),
  );
  const over = roll(overPath, endSpeed(spoon) * 0.6, 210, 360, 0.6);
  const tSpoon = 0.15 + fall.duration;
  const tRoll = tSpoon + spoon.duration;
  const tPinHit = tRoll + over.duration;
  const tShelf = tRoll + timeWhen(over, (pt) => pt.x >= 960);
  at(0, { sound: playPop });
  at(tSpoon, { sound: () => playKnock(1500) });
  at(tRoll, { sound: playRustle });
  at(tShelf, { sound: () => playKnock(1200) });
  at(tPinHit, { sound: () => playKnock(900) });

  const marbleAt = (t: number): { pt: Pt; spin: number } => {
    let pt: Pt;
    if (t < 0.15) pt = marble0;
    else if (t < tSpoon) pt = onRun(fall, 0.15, t);
    else if (t < tRoll) pt = onRun(spoon, tSpoon, t);
    else if (t < tPinHit) pt = onRun(over, tRoll, t);
    else pt = { x: hitX - 26 * easeOut(seg(t, tPinHit, tPinHit + 0.6)), y: onShelf };
    return { pt, spin: pt.x / BALL_R };
  };

  /** How far the paper towel roll has turned: the marble drags it round, then it spins on and slows down. */
  const rollAngle = (t: number) => {
    if (t < tRoll) return 0;
    const arcLen = (Math.PI / 2) * overR;
    const d = Math.min(arcLen, distAt(over, t - tRoll));
    const dragged = (d / ROLL.r) * 0.8;
    const tLeave = tRoll + timeWhen(over, (_, s) => s >= arcLen);
    return t < tLeave ? dragged : dragged + 3.2 * (1 - Math.exp(-(t - tLeave) * 1.6));
  };

  /* The rolling pin: over the shelf edge, a short drop onto the board, down it and along the counter to the ladle. */
  const pin0 = { x: PIN.x0, y: SHELF.y - PIN.r };
  const edge = { x: SHELF.x1, y: SHELF.y };
  const tipOver = { x: edge.x + PIN.r * Math.cos(rad(-40)), y: edge.y + PIN.r * Math.sin(rad(-40)) };
  const onBoard = beside(line({ x: 1180, y: boardY(1180) }, BOARD.to), -PIN.r);
  const boardIn = onBoard[0];
  const boardOut = onBoard[onBoard.length - 1];
  const onCounter = COUNTER - PIN.r;
  const bowl0 = onLadle(LADLE.bowl, 0);
  const pinHitX = bowl0.x - Math.sqrt((LADLE.bowlR + PIN.r) ** 2 - (onCounter - bowl0.y) ** 2);
  const pinPath = pathOf(
    line(pin0, { x: edge.x, y: pin0.y }),
    arc(edge.x, edge.y, PIN.r, -90, -40),
    quad(tipOver, { x: tipOver.x + 14, y: tipOver.y + 3 }, boardIn),
    onBoard,
    quad(boardOut, { x: boardOut.x + 22, y: onCounter }, { x: boardOut.x + 46, y: onCounter }),
    line({ x: boardOut.x + 46, y: onCounter }, { x: pinHitX, y: onCounter }),
  );
  const pinRun = roll(pinPath, 120, 100, 380, 0.3);
  const tPinGo = tPinHit;
  const tLadle = tPinGo + pinRun.duration;
  at(tPinGo + timeWhen(pinRun, (pt) => pt.y >= boardIn.y - 1), { sound: playThump });
  at(tPinGo + timeWhen(pinRun, (pt) => pt.x >= 1300), { sound: playRumble });
  at(tPinGo + timeWhen(pinRun, (pt) => pt.y >= onCounter - 0.5), { sound: () => playKnock(500) });
  at(tLadle, { sound: playClonk });

  const pinAt = (t: number): { pt: Pt; turned: number } => {
    if (t < tPinGo) return { pt: pin0, turned: 0 };
    if (t < tLadle) {
      const d = distAt(pinRun, t - tPinGo);
      return { pt: along(pinPath, d).pt, turned: d };
    }
    // It knocks the ladle and rolls back a little, out of the ladle's way.
    const back = 45 * easeOut(seg(t, tLadle, tLadle + 0.8));
    return { pt: { x: pinHitX - back, y: onCounter }, turned: pinPath.total - back };
  };

  /* The ladle swings up until the wall peg stops it; the meatball flies on. */
  const SWING = 0.42;
  const tPeg = tLadle + SWING;
  const ladleAngle = (t: number) => {
    if (t < tLadle) return 0;
    // Still moving when it meets the peg, so the meatball keeps going.
    if (t < tPeg) return (LADLE.stop * Math.sin(seg(t, tLadle, tPeg) * Math.PI * 0.4)) / Math.sin(Math.PI * 0.4);
    const u = t - tPeg;
    return LADLE.stop * (1 - easeInOut(seg(u, 0.1, 1.0))) + wobble(u - 1.0, -5, 6, 2.5);
  };
  at(tPeg, { sound: () => playKnock(800) });
  at(tPeg + 0.03, { sound: playWhoosh });

  const launch = onLadle(MEAT_IN_BOWL, LADLE.stop);
  const plateC = { x: PLATE.x0, y: PLATE_Y };
  const contact = { x: plateC.x + (PLATE.r + MEATBALL.r) * Math.cos(rad(225)), y: plateC.y + (PLATE.r + MEATBALL.r) * Math.sin(rad(225)) };
  // Leave the bowl along the swing, 50° upward: that fixes how high the arc goes and so how long it takes.
  const flyH = (contact.y - launch.y + (contact.x - launch.x) * Math.tan(rad(LADLE.stop))) / 4;
  const meatFly: Flight = { t0: tPeg, t1: tPeg + Math.sqrt((8 * flyH) / 1500), a: launch, b: contact, h: flyH };
  const tPlateHit = meatFly.t1;
  const inSpaghetti = { x: SPAGHETTI.cx, y: SPAGHETTI.rimY - 14 - MEATBALL.r + 10 };
  const meatDrop: Flight = { t0: tPlateHit, t1: tPlateHit + 0.42, a: contact, b: inSpaghetti, h: 30 };
  at(tPlateHit, { sound: () => playKnock(1600) });
  at(meatDrop.t1, { sound: playPlop });

  const meatballAt = (t: number): { pt: Pt; spin: number } => {
    if (t < tPeg) return { pt: onLadle(MEAT_IN_BOWL, ladleAngle(t)), spin: 0 };
    const f = t < meatFly.t1 ? meatFly : meatDrop;
    const k = seg(t, f.t0, f.t1);
    const pt = hop(f.a, f.b, f.h, k);
    // A turn and a bit in the air, then it rolls back down into the spaghetti.
    return { pt, spin: t < meatFly.t1 ? 7 * k : 7 - 2 * k };
  };

  /* The plate: over its peg, along the counter like a wheel, into the knob of the salad spinner's crank. */
  const pegCorner = { x: PLATE.x0 + PLATE_PEG_DX, y: COUNTER - PLATE.pegH };
  const a0 = (Math.atan2(PLATE_Y - pegCorner.y, PLATE.x0 - pegCorner.x) * 180) / Math.PI;
  const knob0 = { x: SPINNER.cx - CRANK.r, y: KNOB_Y };
  /** Where the plate's rim touches the crank's knob. */
  const plateStopX = knob0.x - Math.sqrt((PLATE.r + CRANK.knobR) ** 2 - (PLATE_Y - KNOB_Y) ** 2);
  const platePath = pathOf(
    arc(pegCorner.x, pegCorner.y, PLATE.r, a0, -180 - a0),
    line({ x: pegCorner.x + PLATE_PEG_DX, y: PLATE_Y }, { x: plateStopX, y: PLATE_Y }),
  );
  const plateRun = roll(platePath, 480, 150, 520, 0.25);
  const tCrank = tPlateHit + plateRun.duration;
  /** How far the plate bounces back off the knob before it lies down. */
  const PLATE_BACK = 24;
  const tFlat = tCrank + 0.75;
  at(tPlateHit + 0.25, { sound: playSwirl });
  at(tPlateHit + 2.1, { sound: playSwirl });
  at(tCrank, { sound: () => playKnock(1400) });
  at(tFlat, { sound: playClonk });

  const plateAt = (t: number): { pt: Pt; turned: number; tilt: number; flat: number } => {
    if (t < tPlateHit) return { pt: plateC, turned: 0, tilt: 0, flat: 0 };
    if (t < tCrank) {
      const d = distAt(plateRun, t - tPlateHit);
      return { pt: along(platePath, d).pt, turned: d, tilt: 0, flat: 0 };
    }
    // It bounces back off the knob, wobbles, then lies down backwards (towards the wall).
    const back = PLATE_BACK * easeOut(seg(t, tCrank, tCrank + 0.45));
    const tilt = wobble(t - tCrank, 7, 14, 4);
    return { pt: { x: plateStopX - back, y: PLATE_Y }, turned: platePath.total - back, tilt, flat: easeIn(seg(t, tCrank + 0.5, tFlat)) };
  };

  /* The salad spinner: the knob is knocked round, the basket whirls and slows down; the lid pops off and the lettuce flies. */
  const WHIRL = 15;
  const SLOW = 4;
  /** The crank's angle as seen from above (radians): π points left, towards the plate; it turns on and on, slowing down. */
  const crankAngle = (t: number) => (t < tCrank ? Math.PI : Math.PI - WHIRL * SLOW * (1 - Math.exp(-(t - tCrank) / SLOW)));
  /** How fast the spinner turns, from 0 to 1. */
  const whirl = (t: number) => (t < tCrank ? 0 : Math.exp(-(t - tCrank) / SLOW));
  /** The spinner rattles on the counter while it whirls. */
  const spinnerShake = (t: number) => 2.5 * whirl(t) * Math.sin(t * 61);
  for (let i = 0; i < 6; i++) at(tCrank + 0.05 + i * 0.55, { sound: playWhirr });

  const tLid = tCrank + 3.0;
  const lid0 = { x: SPINNER.cx, y: SPINNER.lidY };
  const lidFly: Flight = { t0: tLid, t1: tLid + Math.sqrt((8 * 240) / 1500), a: lid0, b: { x: lid0.x + 6, y: lid0.y }, h: 240 };
  at(tLid, { sound: playBoing });
  at(tLid + 0.02, { sound: playPop });
  at(lidFly.t1, { sound: () => playKnock(1100) });

  /** The lid with the crank: on the bowl, up in the air with a somersault, then back on, a little crooked. */
  const lidAt = (t: number): { pt: Pt; angle: number } => {
    if (t < tLid) return { pt: { x: lid0.x + spinnerShake(t), y: lid0.y }, angle: 0 };
    if (t < lidFly.t1) {
      const k = seg(t, lidFly.t0, lidFly.t1);
      return { pt: hop(lidFly.a, lidFly.b, lidFly.h, k), angle: -360 * easeInOut(k) };
    }
    return { pt: { x: lidFly.b.x + spinnerShake(t), y: lidFly.b.y }, angle: 4 + wobble(t - lidFly.t1, 10, 15, 3) };
  };

  // Leaves fly out of the open basket one after the other; the last and biggest one flies to the egg timer.
  const TIMER0 = { x: JAR.x0 + 75, y: JAR.top - TIMER.foot };
  const leafFrom = (i: number) => ({ x: SPINNER.cx + jitter(i + 20) * 30, y: SPINNER.top - 6 });
  const plateRest = { x: plateStopX - PLATE_BACK, y: COUNTER - 2 * PLATE.r * 0.18 - 10 };
  const smallLeaves: [Pt, number][] = [
    [{ x: 4060, y: COUNTER - 12 }, 170],
    [{ x: 4472, y: COUNTER - 12 }, 140],
    [plateRest, 210],
    [{ x: 4515, y: COUNTER - 12 }, 230],
    [{ x: 3985, y: COUNTER - 12 }, 280],
  ];
  const leaves: Leaf[] = smallLeaves.map(([b, h], i) => {
    const t0 = tLid + 0.12 + i * 0.13;
    return { t0, t1: t0 + 0.75 + h / 600, a: leafFrom(i), b, h, turns: i % 2 ? 1 : -1, rest: jitter(i + 30) * 12 };
  });
  const tBigLeaf = tLid + 0.12 + smallLeaves.length * 0.13;
  const leafHit = { x: TIMER0.x - TIMER.rx - 24, y: TIMER0.y - 6 };
  leaves.push({ t0: tBigLeaf, t1: tBigLeaf + 1.45, a: leafFrom(9), b: leafHit, h: 230, turns: 2, rest: 0 });
  const tLeafHit = tBigLeaf + 1.45;
  const BIG = leaves.length - 1;
  /** Where the big leaf flutters down to, in front of the cookie jar. */
  const leafDown = { x: JAR.x0 + 40, y: COUNTER - 20 };
  const tLeafDown = tLeafHit + 1.5;
  at(tLid + 0.2, { sound: playRustle });
  at(tLid + 0.75, { sound: playRustle });
  at(tLeafHit, { sound: () => playKnock(2000) });

  /** A lettuce leaf: in the spinner until it flies (null), then in the air, then where it landed. */
  const leafAt = (i: number, t: number): { pt: Pt; angle: number; big: boolean } | null => {
    const leaf = leaves[i];
    const big = i === BIG;
    if (t < leaf.t0) return null;
    if (t < leaf.t1) {
      const k = seg(t, leaf.t0, leaf.t1);
      return { pt: hop(leaf.a, leaf.b, leaf.h, k), angle: (leaf.turns * 360 + leaf.rest) * k, big };
    }
    if (!big) return { pt: leaf.b, angle: leaf.rest, big };
    // The big leaf slaps the timer and flutters down, swaying from side to side.
    const k = seg(t, tLeafHit, tLeafDown);
    const sway = Math.sin(k * Math.PI * 3) * (1 - k);
    return { pt: { x: lerp(leafHit.x, leafDown.x, k) + 22 * sway, y: lerp(leafHit.y, leafDown.y, easeIn(k)) }, angle: 35 * sway, big };
  };

  /* The egg timer: the slap winds it up, it ticks its dial back, rings and rattles off the jar onto the pan's handle. */
  const tWound = tLeafHit + 1.2;
  const TICK = 0.4;
  const TICKS = 11;
  /** It rings where the twelfth tick would be, once the dial is back at zero. */
  const tRing = tWound + TICKS * TICK;
  const HOPS = 3;
  const HOP = 0.36;
  const tHops = tRing + 0.5;
  const tFall = tHops + HOPS * HOP;
  const edgeX = JAR.x0 - 28;
  const onHandle = { x: TIMER.onHandle, y: -PAN.handleH - TIMER.foot };
  const timerLand = onPan(onHandle, PAN_REST);
  const tHandle = tFall + Math.sqrt((2 * (timerLand.y - TIMER0.y)) / 1500);
  at(tLeafHit + 0.05, { sound: playWhirr });
  at(tWound, { sound: playTick });
  at(tWound + 4 * TICK, { sound: playTick });
  at(tWound + 8 * TICK, { sound: playTick });
  at(tRing, { sound: playAlarm });
  at(tRing + 0.96, { sound: playAlarm });
  at(tHandle, { sound: playClonk });
  at(tHandle + 0.05, { sound: playRing });

  /** The pan's tilt in degrees: at rest until the timer lands on its handle, then tipped over with a little bounce. */
  const TIP = 0.13;
  const panAngle = (t: number) => {
    if (t < tHandle) return PAN_REST;
    if (t < tHandle + TIP) return lerp(PAN_REST, PAN_DOWN, easeIn(seg(t, tHandle, tHandle + TIP)));
    return PAN_DOWN + Math.abs(wobble(t - tHandle - TIP, 4, 16, 5));
  };

  const timerAt = (t: number): { pt: Pt; tilt: number; dial: number; ringing: boolean } => {
    if (t < tLeafHit) return { pt: TIMER0, tilt: 0, dial: 0, ringing: false };
    if (t < tWound) {
      // The slap turns its dial round and rocks it.
      return { pt: TIMER0, tilt: wobble(t - tLeafHit, 12, 14, 3), dial: DIAL_MAX * easeOut(seg(t, tLeafHit, tWound)), ringing: false };
    }
    if (t < tRing) {
      // Tick, tack: the dial steps back with every tick and the timer rocks a little to and fro.
      const ticked = Math.min(TICKS, Math.floor((t - tWound) / TICK) + 1);
      const since = t - tWound - (ticked - 1) * TICK;
      const tilt = (ticked % 2 ? 4 : -4) * Math.exp(-since * 8);
      return { pt: TIMER0, tilt, dial: DIAL_MAX * (1 - ticked / TICKS), ringing: false };
    }
    const shake = 7 * Math.sin((t - tRing) * 50);
    if (t < tFall) {
      // Ringing, it rattles and hops towards the jar's edge.
      const n = Math.min(HOPS - 1, Math.max(0, Math.floor((t - tHops) / HOP)));
      const k = t < tHops ? 0 : seg(t, tHops + n * HOP, tHops + (n + 1) * HOP);
      const from = { x: lerp(TIMER0.x, edgeX, n / HOPS), y: TIMER0.y };
      const to = { x: lerp(TIMER0.x, edgeX, (n + 1) / HOPS), y: TIMER0.y };
      const pt = t < tHops ? TIMER0 : hop(from, to, 16, k);
      return { pt: { x: pt.x + 2 * Math.sin(t * 70), y: pt.y }, tilt: shake, dial: 0, ringing: true };
    }
    if (t < tHandle) {
      // Off the edge it tumbles down onto the handle.
      const k = seg(t, tFall, tHandle);
      return {
        pt: { x: lerp(edgeX, timerLand.x, k), y: lerp(TIMER0.y, timerLand.y, k * k) },
        tilt: -PAN_REST * k - 25 * Math.sin(Math.PI * k),
        dial: 0,
        ringing: true,
      };
    }
    // It rides the handle down and stays there.
    const angle = panAngle(t);
    return { pt: onPan(onHandle, angle), tilt: -angle, dial: 0, ringing: false };
  };

  /* The pancake: the pan tips, and it flies high with two somersaults onto the jelly. */
  // It lies in the pan's opening, so its top shows over the rim.
  const inPan = { x: PANCAKE.inPan, y: -PAN.rimH };
  const tToss = tHandle + TIP;
  const onJelly = { x: JELLY.cx, y: JELLY_TOP - PANCAKE.h / 2 };
  const cakeFly: Flight = { t0: tToss, t1: tToss + Math.sqrt((8 * 420) / 1500), a: onPan(inPan, PAN_DOWN), b: onJelly, h: 420 };
  const tCake = cakeFly.t1;
  at(tToss, { sound: () => playKnock(500) });
  at(tToss + 0.02, { sound: playWhoosh });
  at(tToss + 0.1, {
    say: {
      de: "Hui! Der Pfannkuchen fliegt!",
      en: "Whee! The pancake flies!",
      zh: "呼！煎饼飞起来啦！",
      hi: "वाह! पैनकेक उड़ रहा है!",
      es: "¡Uy! ¡El panqueque vuela!",
      ar: "هوب! الفطيرة تطير!",
      ru: "Ух! Блинчик летит!",
    },
  });
  at(tCake, { sound: playPlop });
  at(tCake + 0.04, { sound: playBoing });

  /* The jelly: it wobbles to and fro under the pancake, and each sway to the right nudges the pepper mill. */
  /** The three moments the jelly's top reaches furthest right, against the mill: the third one tips it over. */
  const nudges = [0, 1, 2].map((k) => tCake + SWAY.period / 4 + k * SWAY.period);
  const tNudge = nudges[0];
  const tTopple = nudges[2];
  /** How far the jelly's top is pushed sideways (to the right is positive), and how much it is squashed down. */
  const jellyAt = (t: number): { sway: number; squash: number } => {
    if (t < tCake) return { sway: 0, squash: 1 };
    const fade = t < tTopple ? 1 : Math.exp(-2.4 * (t - tTopple));
    const sway = t - tTopple > SETTLE_S ? 0 : SWAY.amp * fade * Math.sin((2 * Math.PI * (t - tCake)) / SWAY.period);
    return { sway, squash: 1 - Math.abs(wobble(t - tCake, 0.14, 16, 5)) };
  };
  const pancakeAt = (t: number): { pt: Pt; angle: number; squash: number } => {
    if (t < tToss) {
      const angle = panAngle(t);
      return { pt: onPan(inPan, angle), angle: -angle, squash: 1 };
    }
    if (t < tCake) {
      const k = seg(t, cakeFly.t0, cakeFly.t1);
      return { pt: hop(cakeFly.a, cakeFly.b, cakeFly.h, k), angle: lerp(-PAN_DOWN, 720, easeInOut(k)), squash: 1 };
    }
    // Flatsch: it squashes flat on the jelly and rides its wobble.
    const { sway, squash } = jellyAt(t);
    return {
      pt: { x: JELLY.cx + sway, y: COUNTER - JELLY.plateH - JELLY.h * squash - PANCAKE.h / 2 },
      angle: 0,
      squash: 1 - Math.abs(wobble(t - tCake, 0.45, 14, 4)),
    };
  };

  const ROCKS = [5, 9];
  const FALL = 0.55;
  const tPress = tTopple + FALL;
  nudges.forEach((tn, k) => at(tn, { sound: () => playKnock(1000 - 120 * k) }));
  at(tTopple + 0.08, { sound: playCreak });
  at(tPress, { sound: playClick });
  at(tPress + 0.04, { sound: () => playKnock(600) });

  /** The pepper mill's tilt in degrees, to the right over its bottom right corner: it rocks at two nudges and falls at the third. */
  const millTilt = (t: number) => {
    if (t < tNudge) return 0;
    if (t < tTopple) {
      const k = Math.min(ROCKS.length - 1, Math.floor((t - tNudge) / SWAY.period));
      return ROCKS[k] * Math.sin((Math.PI * (t - nudges[k])) / SWAY.period);
    }
    return MILL_LEAN * easeIn(seg(t, tTopple, tPress));
  };
  /** How far the coffee machine's button is pushed in by the mill's corner. */
  const buttonIn = (t: number) => {
    const a = rad(millTilt(t));
    const corner = MILL.x0 + MILL.w + MILL.h * Math.sin(a);
    return Math.min(COFFEE.button - COFFEE.pressed, Math.max(0, corner - (COFFEE.x0 - COFFEE.button)));
  };

  /* The coffee machine: it grinds and shakes, pours a cup, and lets off a puff of steam under the bottle of apple fizz. */
  const GRIND = 3.2;
  const POUR = 3.2;
  const tGrind = tPress + 0.25;
  const tPour = tGrind + GRIND;
  const tBrewed = tPour + POUR;
  at(tGrind, { sound: playWhirr });
  at(tGrind + 1.0, { sound: playRattle });
  at(tGrind + 2.0, { sound: playWhirr });
  at(tPour, { sound: playTrickle });
  at(tPour + 1.5, { sound: playTrickle });
  at(tBrewed, { sound: playPuff });
  /** The machine's shake while it grinds, sideways in px. */
  const coffeeShake = (t: number) => (t > tGrind && t < tPour ? 1.6 * Math.sin(t * 90) : 0);
  /** How full the cup is, from 0 to 1, and whether coffee runs from the spout. */
  const cupFull = (t: number) => easeInOut(seg(t, tPour + 0.2, tBrewed));
  const pouring = (t: number) => t >= tPour && t < tBrewed + 0.1;
  /** How fizzy the bottle is (its bubbles), from 0 to 1, and how high it hops at the puff of steam. */
  const fizz = (t: number) => seg(t, tGrind, tBrewed);
  const bottleHop = (t: number) => 8 * Math.sin(Math.PI * seg(t, tBrewed, tBrewed + 0.3));

  /* The cork: it creeps up out of the shaken bottle, pops at the puff and flies onto the egg. */
  const tCork = tBrewed + 0.45;
  const CREEP = 7;
  const corkStart = { x: CORK0.x, y: CORK0.y - CREEP };
  const corkHit = { x: EGG0.x - EGG.rx - CORK.h / 2 + 2, y: EGG0.y - 14 };
  const corkRest = { x: EGG_CUP.cx - 74, y: BREADBOX.top - CORK.w / 2 };
  const corkFly: Flight = { t0: tCork, t1: tCork + 1.0, a: corkStart, b: corkHit, h: 150 };
  const tEggHit = corkFly.t1;
  const BOUNCE = 0.45;
  at(tCork, { sound: playPop });
  at(tCork + 0.03, { sound: playWhoosh });
  at(tCork + 0.08, {
    say: {
      de: "Plopp! Da fliegt der Korken!",
      en: "Pop! There goes the cork!",
      zh: "砰！瓶塞飞出去啦！",
      hi: "पॉप! कॉर्क उड़ गया!",
      es: "¡Pop! ¡Sale volando el corcho!",
      ar: "بوب! السدادة تطير!",
      ru: "Чпок! Пробка летит!",
    },
  });
  at(tEggHit, { sound: () => playKnock(1400) });
  at(tEggHit + BOUNCE, { sound: () => playKnock(1800) });

  const corkAt = (t: number): { pt: Pt; angle: number } => {
    if (t < tCork) {
      const creep = CREEP * easeIn(seg(t, tPour, tCork));
      return { pt: { x: CORK0.x + coffeeShake(t), y: CORK0.y - creep - bottleHop(t) }, angle: 0 };
    }
    if (t < tEggHit) return { pt: hop(corkFly.a, corkFly.b, corkFly.h, seg(t, corkFly.t0, corkFly.t1)), angle: 540 * seg(t, corkFly.t0, corkFly.t1) };
    // It bounces back off the egg and lies down on the bread box.
    const k = seg(t, tEggHit, tEggHit + BOUNCE);
    return { pt: hop(corkHit, corkRest, 36, k), angle: lerp(540, 630, k) };
  };

  /* The egg: knocked, it tips out of its cup onto the baking tray and wobbles down it and along the counter into the honey jar. */
  const TIP_OUT = 0.45;
  const TIP_TO = 75;
  const tEggOut = tEggHit + TIP_OUT;
  const tTray = tEggOut + 0.35;
  const cupRim = { x: EGG_CUP.cx + EGG_CUP.w / 2, y: BREADBOX.top - EGG_CUP.h };
  const tippedEgg = turn(EGG0, cupRim, rad(TIP_TO));
  const onTray = (x: number): Pt => ({ x, y: TRAY.from.y + ((x - TRAY.from.x) * (TRAY.to.y - TRAY.from.y)) / (TRAY.to.x - TRAY.from.x) });
  const eggPath = pathOf(
    beside(line(onTray(TRAY.from.x + 60), TRAY.to), -EGG.rx),
    line({ x: TRAY.to.x + 10, y: COUNTER - EGG.rx }, { x: HONEY.x0 - EGG.ry, y: COUNTER - EGG.rx }),
  );
  const eggRun = roll(eggPath, 40, 90, 420, 1.1);
  const tJar = tTray + eggRun.duration;
  /** The egg's rolling radius, chosen so it comes to rest lying flat, its long side along the counter. */
  const eggTurns = Math.max(1, Math.round(eggPath.total / (26 * Math.PI)));
  const eggR = eggPath.total / (eggTurns * Math.PI);
  /** How far the egg's middle rises above lying flat when it is turned by `angle` degrees (0: standing on its tip). */
  const eggBob = (angle: number) => Math.hypot(EGG.ry * Math.cos(rad(angle)), EGG.rx * Math.sin(rad(angle))) - EGG.rx;
  at(tEggHit + 0.1, { sound: playCreak });
  at(tTray, { sound: () => playKnock(1500) });
  at(tTray + 0.05, { sound: playSlide });
  at(tJar, { sound: playThump });

  const eggAt = (t: number): { pt: Pt; angle: number } => {
    if (t < tEggHit) return { pt: EGG0, angle: 0 };
    if (t < tEggOut) {
      const a = TIP_TO * easeIn(seg(t, tEggHit, tEggOut));
      return { pt: turn(EGG0, cupRim, rad(a)), angle: a };
    }
    if (t < tTray) {
      const k = seg(t, tEggOut, tTray);
      return { pt: hop(tippedEgg, eggPath.pts[0], 24, k), angle: lerp(TIP_TO, 90, k) };
    }
    const d = distAt(eggRun, t - tTray);
    const angle = 90 + deg(d / eggR) + (t > tJar ? wobble(t - tJar, 8, 14, 4) : 0);
    const pt = along(eggPath, d).pt;
    return { pt: { x: pt.x, y: pt.y - eggBob(angle) }, angle };
  };

  /* The honey jar: bumped, it teeters, tips onto its side, its lid pops off and the honey oozes slowly to the touch field. */
  const TEETER = 0.5;
  const tJarDown = tJar + TEETER + 0.55;
  const tOoze = tJarDown + 0.3;
  const OOZE = 4.0;
  const tBeep = tOoze + OOZE;
  const lidRest = { x: HONEY.x0 - 120, y: COUNTER - HONEY.lid / 2 };
  const LID_FLY = 0.65;
  at(tJar + TEETER, { sound: playCreak });
  at(tJarDown, { sound: playClonk });
  at(tJarDown + 0.05, { sound: () => playKnock(1300) });
  at(tJarDown + LID_FLY, { sound: () => playKnock(800) });
  at(tOoze, { sound: playGlug });
  at(tOoze + 1.8, { sound: playGlug });
  at(tBeep, { sound: playBeeps });
  at(tBeep + 0.9, { sound: playHum });

  const jarPivot = { x: HONEY.x0 + HONEY.w, y: COUNTER };
  /** The honey jar's tilt in degrees, to the right over its bottom right corner. */
  const jarTilt = (t: number) => {
    if (t < tJar) return 0;
    if (t < tJar + TEETER) return 12 * Math.sin(Math.PI * seg(t, tJar, tJar + TEETER));
    if (t < tJarDown) return 90 * easeIn(seg(t, tJar + TEETER, tJarDown));
    return 90 - Math.abs(wobble(t - tJarDown, 4, 18, 6));
  };
  /** The jar's lid: on the jar until it lands, then it pops off backwards over the jar and lies down on the counter. */
  const honeyLidAt = (t: number): { pt: Pt; angle: number } => {
    const onJar = (a: number) => turn({ x: HONEY.x0 + HONEY.w / 2, y: COUNTER - HONEY.h - HONEY.lid / 2 }, jarPivot, rad(a));
    if (t < tJarDown) return { pt: onJar(jarTilt(t)), angle: jarTilt(t) };
    const k = seg(t, tJarDown, tJarDown + LID_FLY);
    return { pt: hop(onJar(90), lidRest, 130, k), angle: lerp(90, 360, k) };
  };
  /** How far right the honey has run out of the jar's mouth, and how much is left in the jar (1 full). */
  const honeyFront = (t: number) => lerp(HONEY_MOUTH_X, COOKTOP.touchX, easeInOut(seg(t, tOoze, tBeep)));
  const honeyLeft = (t: number) => 1 - 0.35 * seg(t, tJarDown, tBeep);

  /** How hot the cooktop is, from 0 to 1. */
  const heat = (t: number) => easeOut(seg(t, tBeep + 0.2, tBeep + 1.6));

  /* Popcorn: it pops faster and faster; some falls back into the pot, some lands on the counter, some in the mug. */
  const tFirstPop = tBeep + 2.0;
  const kernels: Kernel[] = [];
  const pattern = "ppppmpmmcmpmmcmmpmm";
  let tp = tFirstPop;
  let inMug = 0;
  const heapY = (n: number) => Math.max(POT_RIM - 22, POT_RIM + 30 - 2.8 * n);
  const knobAtCount = (n: number) => LEVER.up + 3.5 * n;
  for (let i = 0; inMug < MUG_FULL || kernels.length < 22; i++) {
    const kind = inMug >= MUG_FULL ? "p" : pattern[i % pattern.length];
    const a = { x: POT.cx + jitter(i) * 44, y: heapY(i) - 6 };
    if (kind === "m") {
      const b = { x: MUG.x + jitter(i + 50) * 12, y: mugTop(knobAtCount(inMug)) + 6 - Math.min(inMug, 6) * 3 };
      kernels.push({ t0: tp, t1: tp + 0.62, a, b, h: 120, to: "mug" });
      inMug++;
    } else if (kind === "c") {
      kernels.push({ t0: tp, t1: tp + 0.55, a, b: { x: (KETTLE.cx + 62 + POT.cx - POT.w / 2) / 2 + jitter(i + 9) * 6, y: COUNTER - 8 }, h: 90, to: "counter" });
    } else {
      kernels.push({ t0: tp, t1: tp + 0.45, a, b: { x: POT.cx + jitter(i + 3) * 50, y: heapY(i + 1) - 6 }, h: 50 + 30 * Math.abs(jitter(i + 7)), to: "pot" });
    }
    tp += Math.max(0.15, 0.42 - 0.024 * i);
  }
  kernels.forEach((k) => at(k.t0, { sound: playPop }));
  const mugKernels = kernels.filter((k) => k.to === "mug");
  const tLever = mugKernels[mugKernels.length - 1].t1 + 0.05;
  const popped = (t: number) => kernels.filter((k) => k.t0 <= t).length;
  const mugCount = (t: number) => mugKernels.filter((k) => k.t1 <= t).length;
  at(tLever, { sound: () => playKnock(1300) });

  /* The toaster: the full mug pulls the lever down, it ticks, „Ping!", and the toast flies onto the bunny's plate. */
  const tPop = tLever + 3.0;
  at(tLever + 0.4, { sound: playTick });
  at(tLever + 1.9, { sound: playTick });
  at(tPop, { sound: playDing });
  at(tPop + 0.03, { sound: playBoing });

  const knobY = (t: number) => {
    if (t < tLever) return knobAtCount(mugCount(t));
    if (t < tPop) return lerp(knobAtCount(MUG_FULL - 1), LEVER.down, easeIn(seg(t, tLever, tLever + 0.14)));
    return lerp(LEVER.down, LEVER.up, easeOut(seg(t, tPop, tPop + 0.1)));
  };

  const tOut = tPop + 0.18;
  const toastTop = { x: TOASTER.slotX, y: 380 };
  const onPlate = { x: BREAKFAST.cx, y: BREAKFAST.top - TOAST.h / 2 };
  const toastFly: Flight = { t0: tOut, t1: tOut + 1.33, a: toastTop, b: onPlate, h: 330 };
  const tToast = toastFly.t1;
  const tDone = tToast + 2.4;
  at(tOut, { sound: playWhoosh });
  at(tToast, { sound: playPlop });
  at(tToast + 0.15, { sound: playTwinkle });
  at(tToast + 0.35, { sound: playWhistle });
  at(tToast + 0.5, {
    say: {
      de: "Ping! Der Toast ist fertig!",
      en: "Ding! The toast is ready!",
      zh: "叮！吐司烤好啦！",
      hi: "टिंग! टोस्ट तैयार है!",
      es: "¡Ding! ¡La tostada está lista!",
      ar: "دينغ! الخبز المحمّص جاهز!",
      ru: "Дзинь! Тост готов!",
    },
  });
  at(tDone, { done: true });

  const toastAt = (t: number): { pt: Pt; angle: number; flat: number } => {
    if (t < tPop) return { pt: { x: TOASTER.slotX, y: TOAST_UP + (TOAST_SINK * (knobY(t) - LEVER.up)) / (LEVER.down - LEVER.up) }, angle: 0, flat: 0 };
    if (t < tOut) return { pt: { x: TOASTER.slotX, y: lerp(TOAST_UP + TOAST_SINK, toastTop.y, easeOut(seg(t, tPop, tOut))) }, angle: 0, flat: 0 };
    const k = seg(t, toastFly.t0, toastFly.t1);
    // One somersault in the air, then it lies down flat on the plate.
    return { pt: hop(toastFly.a, toastFly.b, toastFly.h, k), angle: 360 * easeInOut(k), flat: easeIn(seg(t, tToast + 0.05, tToast + 0.3)) };
  };

  /** Where the camera looks: the thing that moves right now. */
  const focusX = (t: number) => {
    if (t < 0) return 0;
    if (t < tPinHit) return marbleAt(t).pt.x;
    if (t < tLadle) return pinAt(t).pt.x;
    if (t < tPeg) return LADLE.hook.x + 100;
    if (t < tPlateHit) return meatballAt(t).pt.x;
    if (t < tCrank) return plateAt(t).pt.x;
    if (t < tLeafHit) return SPINNER.cx + 80;
    if (t < tToss) return TIMER0.x - 250;
    if (t < tCake) return Math.max(TIMER0.x - 250, pancakeAt(t).pt.x);
    if (t < tGrind) return JELLY.cx + 100;
    if (t < tCork) return COFFEE.x0 + 120;
    if (t < tJar) return Math.max(COFFEE.x0 + 120, corkAt(t).pt.x, eggAt(t).pt.x);
    if (t < tBeep) return HONEY.x0 + 120;
    if (t < tLever) return POT.cx;
    return BREAKFAST.cx - 230;
  };
  const cameraTarget = (t: number) => cameraOn(WORLD_W, focusX(t));

  /** Where it could wait for the child's tap (R-03): the rolling pin on the shelf's edge, the salad spinner, the wound-down egg timer, the toast in the toaster. Only the salad spinner waits; the machine runs through the others. */
  const stops = [
    { at: tPinHit, x: pin0.x, y: pin0.y },
    { at: tCrank, x: SPINNER.cx, y: (SPINNER.top + COUNTER) / 2, active: true },
    { at: tRing, x: TIMER0.x, y: TIMER0.y },
    { at: tPop, x: TOASTER.slotX, y: TOAST_UP + TOAST_SINK },
  ];

  return {
    events: sorted(),
    duration: tDone,
    stops,
    tSpoon,
    tRoll,
    tPinHit,
    tLadle,
    tPeg,
    tPlateHit,
    tCrank,
    tFlat,
    tLid,
    tLeafHit,
    tWound,
    tRing,
    tFall,
    tHandle,
    tToss,
    tCake,
    nudges,
    tTopple,
    tPress,
    tGrind,
    tPour,
    tBrewed,
    tCork,
    tEggHit,
    tEggOut,
    tTray,
    tJar,
    tJarDown,
    tOoze,
    tBeep,
    tLever,
    tPop,
    tToast,
    kernels,
    marbleAt,
    rollAngle,
    pinAt,
    ladleAngle,
    meatballAt,
    plateAt,
    plateStopX,
    crankAngle,
    whirl,
    spinnerShake,
    lidAt,
    leaves,
    leafAt,
    timerAt,
    panAngle,
    pancakeAt,
    jellyAt,
    millTilt,
    buttonIn,
    coffeeShake,
    cupFull,
    pouring,
    fizz,
    bottleHop,
    corkAt,
    eggAt,
    jarTilt,
    honeyLidAt,
    honeyFront,
    honeyLeft,
    heat,
    popped,
    heapY,
    mugCount,
    knobY,
    toastAt,
    cameraTarget,
    width: WORLD_W,
  };
}
