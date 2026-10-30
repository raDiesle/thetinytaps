// The circus machine ("Zirkus"), a Rube Goldberg machine in a circus tent:
// one tap lets a marble drop out of the magician's top hat, and one act sets
// off the next for about forty seconds – a drum roll, a trampoline, a seal, an
// elephant's trunk that flings the marble up to a monkey on a trapeze, who
// swings high and drops it into a dozing lion's mane, the lion that wakes with
// a start, roars and leaps onto the next pedestal and shakes the marble out
// into the basket of a teddy on a unicycle on the high wire, a cannon that
// shoots the clown into the net – while the camera travels along. Everything
// is worked out ahead as a function of the seconds since the tap, so
// CircusLevel.tsx only asks where each thing is at a moment. Coordinates are
// those of the tent, 6860 × 900; the screen shows 1600 of it at a time.

import {
  playBark,
  playBoing,
  playChatter,
  playCreak,
  playDing,
  playDrum,
  playGiggle,
  playKnock,
  playLaunch,
  playLeaves,
  playMelody,
  playPlop,
  playPop,
  playRing,
  playRoar,
  playSqueak,
  playThump,
  playTick,
  playTrumpet,
  playTwinkle,
  playWhoosh,
} from "@/lib/sfx";
import { wobble } from "./level";
import {
  along,
  beside,
  cameraOn,
  distAt,
  easeIn,
  easeInOut,
  easeOut,
  GRAVITY,
  hop,
  lerp,
  pathOf,
  rad,
  roll,
  rounded,
  seg,
  STEP,
  timeline,
  timeWhen,
  turn,
} from "./machineKit";
import { arc, BALL_R, line, quad, type Pt } from "./path";

export const WORLD_W = 6860;
export const FLOOR = 800;

/* ---------- Layout ---------- */

/** The magician's top hat hangs upside down from the tent; the marble drops out of a hole in its crown at (x, y). */
export const HAT = { x: 190, y: 150 };

/** The candy-striped rail from the hat down to the drums (where the marble's middle goes). */
export const RAIL = { from: { x: 225, y: 232 }, to: { x: 620, y: 330 } };

/** Three drums on stands, each lower than the one before; `top` is the middle of the drumhead. */
export const DRUMS = [
  { cx: 760, top: 450, r: 70, h: 78 },
  { cx: 945, top: 530, r: 62, h: 70 },
  { cx: 1120, top: 605, r: 56, h: 62 },
];

/** The cymbal on its stand, tilted a little; the marble bounces off its middle. */
export const CYMBAL = { cx: 1275, y: 655, r: 64, tilt: -8 };

/** The trampoline's frame; the bed sinks `dip` in the middle when the marble lands. */
export const TRAMPOLINE = { cx: 1455, y: 730, half: 115, dip: 30 };

/** The toy seal sits on a tall tub; it balances the marble on its nose and nods it onto the chute. */
export const SEAL = { x: 1820, base: 520, tubW: 170 };
/** The joint the seal's head turns around. */
export const NECK = { x: SEAL.x, y: SEAL.base - 140 };
/** Where the marble's middle is when it lies on the seal's nose (head up). */
const ON_NOSE: Pt = { x: SEAL.x + 26, y: SEAL.base - 240 - BALL_R };
/** How far the seal nods to let the marble go, in degrees. */
const NOD = 40;

/** The toy elephant on its tub; the marble rolls over its head and down its trunk. */
export const ELEPHANT = { x: 2190, tubTop: 660, tubW: 220 };
export const HEAD = { x: 2340, y: 490, r: 78 };
/** The trunk's thickness; it lies under the marble's way down. */
export const TRUNK_W = 36;
/** Where on the head (degrees round its middle) the chute ends and where the trunk starts. */
const HEAD_IN = -100;
const HEAD_OUT = -35;
const onHead = (a: number): Pt => ({ x: HEAD.x + (HEAD.r + BALL_R) * Math.cos(rad(a)), y: HEAD.y + (HEAD.r + BALL_R) * Math.sin(rad(a)) });

/** The chute from the seal to the elephant's head (the marble's middle). */
export const CHUTE = { from: { x: 1975, y: 340 }, to: onHead(HEAD_IN) };
export const chuteY = (x: number) => CHUTE.from.y + ((x - CHUTE.from.x) * (CHUTE.to.y - CHUTE.from.y)) / (CHUTE.to.x - CHUTE.from.x);

/** How steeply the curled-up tip of the trunk points upwards, in degrees: it flings the marble up to the monkey. */
const TIP_ANGLE = 60;

/**
 * The trapeze hangs from a hook in the tent roof at (x, y); its bar is `len`
 * below the hook. The monkey hangs from the bar by its hands and catches the
 * marble with its feet, `FEET` from the hook (trapeze hanging straight down).
 */
export const TRAPEZE = { x: 3000, y: 56, len: 250 };
export const FEET: Pt = { x: -16, y: 404 };
/** How high the trapeze swings at last, in degrees either side, and how long one swing there and back takes. */
const SWING = 58;
const SWING_T = 1.8;
/** Where something `local` on the trapeze (from the hook, hanging straight) is when it has swung `angle` degrees to the right. */
export const onTrapeze = (local: Pt, angle: number): Pt =>
  turn({ x: TRAPEZE.x + local.x, y: TRAPEZE.y + local.y }, { x: TRAPEZE.x, y: TRAPEZE.y }, rad(-angle));

/** The lion's two pedestals; `x` is the middle and `top` where the lion's paws stand. */
export const LION_FROM = { x: 3320, top: 620 };
export const LION_TO = { x: 3700, top: 590 };
export const PEDESTAL_W = 170;
/**
 * The lion is drawn facing right in its own units, its paws' middle at 0 0:
 * its mane round `MANE` with radius `r`, its head turning round `LION_NECK`.
 * The marble lands in the top of the mane and sits in its fluff.
 */
export const MANE = { x: 14, y: -128, r: 58 };
export const LION_NECK: Pt = { x: 14, y: -88 };

/** How the lion looks at a moment: where its paws are, and how it squashes, turns, puffs up and roars. */
export interface LionPose {
  /** The middle of its paws. */
  x: number;
  y: number;
  /** The whole lion turned, in degrees (negative lifts its nose). */
  tilt: number;
  /** Squashed or stretched: wider and lower, or longer and flatter in a leap. */
  sx: number;
  sy: number;
  /** The head turned round the neck, in degrees. */
  head: number;
  /** How fluffed up the mane is (1 is calm). */
  puff: number;
  /** How wide the mouth is open, 0–1. */
  roar: number;
  /** 0 sitting, 1 legs stretched out in the leap. */
  stretch: number;
  eyes: "sleep" | "wide" | "open" | "squint";
}

/** Where a spot of the lion (in its own units) is in the tent, its head's spots turning with the head. */
export function onLion(pose: LionPose, local: Pt, withHead: boolean): Pt {
  const p = withHead ? turn(local, LION_NECK, rad(pose.head)) : local;
  const scaled = { x: p.x * pose.sx, y: p.y * pose.sy };
  const turned = turn(scaled, { x: 0, y: 0 }, rad(pose.tilt));
  return { x: pose.x + turned.x, y: pose.y + turned.y };
}
/** Where the marble's middle sits in the top of the mane, in the lion's units. */
const nestOf = (puff: number): Pt => ({ x: MANE.x, y: MANE.y - MANE.r * puff + 10 });

/** The little platform where the unicycle waits, in front of the elephant. */
export const PLATFORM = { x0: 3900, x1: 4060, y: 640 };
export const UNICYCLE = { x0: 4000, r: 34 };
/** Where the marble's middle is in the teddy's basket, from the middle of the wheel (unicycle upright). */
export const BASKET: Pt = { x: 75, y: -150 };
/** The basket's front rim, from the marble's middle: it catches the ribbon. */
export const BASKET_RIM: Pt = { x: 30, y: -4 };

/** The high wire, from the platform down to the end platform. */
export const WIRE = { from: { x: PLATFORM.x1, y: PLATFORM.y }, to: { x: 5240, y: 722 } };
export const wireY = (x: number) => WIRE.from.y + ((x - WIRE.from.x) * (WIRE.to.y - WIRE.from.y)) / (WIRE.to.x - WIRE.from.x);
export const END = { x0: WIRE.to.x, x1: 5370, y: WIRE.to.y };

/** The ring of paper flames on a pole, the high wire running through its middle. */
export const HOOP = { x: 4650, y: wireY(4650) - 100, rx: 24, ry: 130 };

/** Where the unicycle's wheel comes to a stop on the end platform. */
export const STOP_X = END.x1 - 44;

/** The confetti cannon, its barrel turned `angle` degrees up around the axle at (x, y). */
export const CANNON = { x: 5560, y: FLOOR - 62, angle: 56, len: 210, back: 46, r: 38, cord: 150 };
const BARREL: Pt = { x: Math.cos(rad(CANNON.angle)), y: -Math.sin(rad(CANNON.angle)) };
/** A spot on the barrel, `u` along it from the axle and `v` to the side (negative is the top side). */
export const onBarrel = (u: number, v: number): Pt => ({ x: CANNON.x + u * BARREL.x - v * BARREL.y, y: CANNON.y + u * BARREL.y + v * BARREL.x });
export const MUZZLE: Pt = onBarrel(CANNON.len, 0);

/**
 * The mast at the end of the high wire. The cannon's pull cord – a ribbon,
 * like on a party popper – runs from the barrel up through the eye at its top
 * and hangs down to a tassel, just where the teddy's basket comes past.
 */
export const MAST = { x: 5250, top: 300 };
export const EYE: Pt = { x: MAST.x, y: MAST.top + 10 };
export const CORD_END: Pt = onBarrel(CANNON.cord, -CANNON.r);

/** The safety net on two poles; `sag` is how far its middle hangs below the poles' hooks. */
export const NET = { x0: 6090, x1: 6410, y: 640, sag: 24 };
/** The stage with the curtain, behind the net. */
export const STAGE = { x0: 5980, x1: 6520, top: 250 };

/** The clown doll's middle is this far above its seat, and this far below the middle of its head. */
export const CLOWN = { seat: 38, head: 38 };

/* ---------- The machine ---------- */

interface Hop {
  t0: number;
  t1: number;
  a: Pt;
  b: Pt;
  h: number;
}

export type Circus = ReturnType<typeof buildCircus>;

export function buildCircus() {
  const { at, sorted } = timeline();

  /* The marble: out of the hat and down the striped rail. */
  const railRun = roll(
    pathOf(line(HAT, { x: HAT.x, y: 200 }), quad({ x: HAT.x, y: 200 }, { x: HAT.x + 1, y: RAIL.from.y - 2 }, RAIL.from), line(RAIL.from, RAIL.to)),
    0,
    150,
    380,
  );
  const t0 = 0.15;
  const tRailEnd = t0 + railRun.duration;
  at(0, { sound: playPop });
  at(0.1, { sound: playTwinkle });

  /* A drum roll: three drums, then the cymbal, then the trampoline. */
  const drumSpot = (i: number) => ({ x: DRUMS[i].cx, y: DRUMS[i].top - BALL_R });
  const cymbalSpot = { x: CYMBAL.cx, y: CYMBAL.y - 5 - BALL_R };
  const bedSpot = { x: TRAMPOLINE.cx, y: TRAMPOLINE.y - BALL_R };
  const hops: Hop[] = [];
  const addHop = (b: Pt, h: number, dur: number, from?: Pt, start?: number) => {
    const prev = hops[hops.length - 1];
    const t = start ?? prev.t1;
    hops.push({ t0: t, t1: t + dur, a: from ?? prev.b, b, h });
  };
  addHop(drumSpot(0), 26, 0.4, RAIL.to, tRailEnd);
  addHop(drumSpot(1), 80, 0.6);
  addHop(drumSpot(2), 72, 0.56);
  addHop(cymbalSpot, 60, 0.5);
  addHop(bedSpot, 50, 0.48);
  const drumTimes = hops.slice(0, 3).map((h) => h.t1);
  const tCymbal = hops[3].t1;
  const tBed = hops[4].t1;
  drumTimes.forEach((t) => at(t, { sound: playDrum }));
  at(tCymbal, { sound: playDing });

  /* The trampoline sinks with the marble and flings it high up onto the seal's nose. */
  const tFling = tBed + 0.14;
  const dipAt = (t: number) => {
    if (t < tBed) return 0;
    if (t < tFling) return TRAMPOLINE.dip * easeOut(seg(t, tBed, tFling));
    return TRAMPOLINE.dip * Math.max(0, 1 - seg(t, tFling, tFling + 0.08)) + wobble(t - tFling - 0.08, 10, 26, 6);
  };
  addHop(ON_NOSE, 230, 1.25, { x: bedSpot.x, y: bedSpot.y + TRAMPOLINE.dip }, tFling);
  const tNose = hops[5].t1;
  at(tFling, { sound: playBoing });

  /* The seal balances the marble, barks, claps and nods it onto the chute. */
  const tBark = tNose + 0.5;
  const tClap = tNose + 1.1;
  const tNod = tNose + 2.8;
  const tLetGo = tNod + 0.5;
  at(tNose, { sound: playSqueak });
  at(tBark, { sound: playBark });
  at(tClap, { sound: () => playKnock(1800) });
  at(tClap + 0.3, { sound: () => playKnock(1800) });
  const nodAt = (t: number) => {
    if (t < tNose) return 0;
    // A little balancing wobble, then the nod, then back up.
    const balance = 7 * Math.sin((t - tNose) * 7) * Math.exp(-(t - tNose) * 0.9) * (1 - seg(t, tNod - 0.3, tNod));
    const nod = NOD * easeIn(seg(t, tNod, tLetGo)) * (1 - easeInOut(seg(t, tLetGo + 0.5, tLetGo + 1.3)));
    return balance + nod;
  };
  const clapAt = (t: number) => (t > tClap && t < tClap + 0.6 ? Math.abs(Math.sin(((t - tClap) * Math.PI) / 0.3)) : 0);
  const letGo = turn(ON_NOSE, NECK, rad(NOD));
  const chuteLand = { x: CHUTE.from.x + 15, y: chuteY(CHUTE.from.x + 15) };
  addHop(chuteLand, 18, 0.34, letGo, tLetGo);
  const tChute = hops[6].t1;
  at(tChute, { sound: playTick });

  /* Down the chute, over the elephant's head, down its trunk and up its curled tip, which flings the marble up. */
  const trunkTop = onHead(HEAD_OUT);
  const tangent = { x: -Math.sin(rad(HEAD_OUT)), y: Math.cos(rad(HEAD_OUT)) };
  const low = { x: trunkTop.x + tangent.x * 100, y: trunkTop.y + tangent.y * 100 };
  const tip = { x: low.x + 110 * Math.cos(rad(TIP_ANGLE)), y: low.y - 110 * Math.sin(rad(TIP_ANGLE)) };
  /** The marble's way along the trunk; the trunk itself lies under it. */
  const trunkWay = [...arc(HEAD.x, HEAD.y, HEAD.r + BALL_R, HEAD_IN, HEAD_OUT), ...rounded([trunkTop, low, tip], 45).slice(1)];
  const elephantPath = pathOf(line(chuteLand, CHUTE.to), trunkWay);
  const elephantRun = roll(elephantPath, 120, 170, 520, 0.4);
  const tHead = tChute + timeWhen(elephantRun, (pt) => pt.x >= CHUTE.to.x);
  const tTip = tChute + elephantRun.duration;
  at(tTip, { sound: playTrumpet });

  /* High up to the monkey on the trapeze, who catches the marble with its feet. */
  const grabbed = onTrapeze(FEET, 0);
  // Rise just enough above the straight line that it leaves along the tip of the trunk.
  const tossRise = (grabbed.y - tip.y + Math.tan(rad(TIP_ANGLE)) * (grabbed.x - tip.x)) / 4;
  const tGrab = tTip + 1;
  at(tGrab, { sound: playPlop });
  at(tGrab + 0.15, { sound: playChatter });

  /*
   * The catch gives the trapeze a push, and the monkey swings higher and
   * higher, three times there and back; at the top of the last swing forward
   * it opens its feet and lets the marble drop.
   */
  const tDrop = tGrab + 3.25 * SWING_T;
  const swingAt = (t: number) => {
    if (t < tGrab) return 0;
    const w = (2 * Math.PI) / SWING_T;
    if (t < tDrop) return SWING * (0.3 + 0.7 * easeOut(seg(t, tGrab, tDrop))) * Math.sin(w * (t - tGrab));
    // Swinging out slowly once the monkey has let go.
    return SWING * Math.cos(w * (t - tDrop)) * Math.exp(-(t - tDrop) * 0.45) * (1 - seg(t, tDrop + 5, tDrop + 8));
  };
  for (let k = 0; k < 3; k++) at(tGrab + 0.35 + k * SWING_T, { sound: playCreak });
  at(tDrop - SWING_T / 4, { sound: playWhoosh });
  at(tDrop, { sound: playGiggle });

  /*
   * The marble drops into the mane of the lion dozing on its pedestal. The lion
   * wakes with a start, looks up at the monkey, roars (a small, friendly roar),
   * crouches and leaps onto the next pedestal, higher up. There it shakes its
   * mane, and the marble flies out into the teddy's basket.
   */
  const released = onTrapeze(FEET, SWING);
  const restPose: LionPose = { x: LION_FROM.x, y: LION_FROM.top, tilt: 0, sx: 1, sy: 1, head: 0, puff: 1, roar: 0, stretch: 0, eyes: "sleep" };
  const landed = onLion(restPose, nestOf(1), true);
  const tPlop = tDrop + Math.sqrt((2 * (landed.y - released.y)) / GRAVITY);
  const tLook = tPlop + 0.8;
  const tRoar = tPlop + 1.6;
  const tCrouch = tRoar + 1.3;
  const tLeap = tCrouch + 0.45;
  const tLand = tLeap + 0.9;
  const tShake = tLand + 0.5;
  const tOut = tShake + 0.4;
  at(tPlop, { sound: playPlop });
  at(tPlop + 0.05, { sound: playSqueak });
  at(tPlop + 0.7, { sound: playChatter });
  at(tRoar, { sound: playRoar });
  at(tLeap, { sound: playWhoosh });
  at(tLand, { sound: playThump });
  at(tShake, { sound: playLeaves });
  at(tOut, { sound: playPop });

  const lionAt = (t: number): LionPose => {
    if (t < tPlop) return restPose;
    const leapK = seg(t, tLeap, tLand);
    const spot = t < tLeap ? { x: LION_FROM.x, y: LION_FROM.top } : hop({ x: LION_FROM.x, y: LION_FROM.top }, { x: LION_TO.x, y: LION_TO.top }, 160, leapK);
    // A jump in place with the fright.
    const startle = t < tPlop + 0.55 ? 46 * Math.sin(Math.PI * seg(t, tPlop, tPlop + 0.55)) : 0;
    const roar = easeOut(seg(t, tRoar, tRoar + 0.15)) * (1 - seg(t, tRoar + 0.9, tRoar + 1.1));
    const fright = seg(t, tPlop, tPlop + 0.1) * Math.exp(-Math.max(0, t - tPlop - 0.1) * 2.5);
    const crouch = easeInOut(seg(t, tCrouch, tCrouch + 0.35)) * (1 - seg(t, tLeap, tLeap + 0.12));
    const flying = t >= tLeap && t < tLand ? Math.sin(Math.PI * leapK) : 0;
    const squash = 0.2 * crouch - 0.06 * flying + wobble(t - tLand, 0.2, 16, 5);
    const look = -14 * easeInOut(seg(t, tLook, tLook + 0.3)) * (1 - easeInOut(seg(t, tCrouch, tCrouch + 0.3)));
    const shake = t >= tShake && t < tShake + 0.8 ? 20 * Math.sin(seg(t, tShake, tShake + 0.8) * 6 * Math.PI) : 0;
    let eyes: LionPose["eyes"] = "open";
    if (t < tLook) eyes = "wide";
    else if (roar > 0.3 || (t >= tShake && t < tShake + 0.8)) eyes = "squint";
    return {
      x: spot.x,
      y: spot.y - startle,
      // The bottom wiggles before the leap; the nose goes up, then down to land.
      tilt: -14 * Math.sin(2 * Math.PI * leapK) + 3 * crouch * Math.sin((t - tCrouch) * 22),
      sx: 1 + squash * 0.6,
      sy: 1 - squash,
      head: look - 8 * roar + shake,
      puff: 1 + 0.32 * fright + 0.18 * roar,
      roar,
      stretch: flying,
      eyes,
    };
  };
  /** Where the marble sits in the lion's mane. */
  const nestAt = (t: number) => {
    const pose = lionAt(t);
    return onLion(pose, nestOf(pose.puff), true);
  };

  /* Out of the mane into the teddy's basket: the teddy catches the marble. */
  const caught = { x: UNICYCLE.x0 + BASKET.x, y: PLATFORM.y - UNICYCLE.r + BASKET.y };
  const flungFrom = nestAt(tOut);
  const tCatch = tOut + 0.85;
  at(tCatch, { sound: playPlop });
  at(tCatch + 0.2, { sound: playGiggle });

  /*
   * Caught! The teddy rocks forward with the catch and pedals off: down the
   * high wire through the hoop. At the end its basket hooks the ribbon's
   * tassel and pulls the ribbon tight, which brakes it.
   */
  const wheelPath = pathOf(beside(rounded([{ x: UNICYCLE.x0, y: PLATFORM.y }, WIRE.from, WIRE.to, { x: STOP_X, y: END.y }], 40), -UNICYCLE.r));
  const tUni = tCatch + 0.6;
  const uni = roll(wheelPath, 40, 40, 190, 0.3);
  const freeD = (t: number) => (t < tUni ? 0 : distAt(uni, t - tUni));
  /** Rocking forward with the catch, then swaying to keep its balance. */
  const rideLean = (t: number) =>
    10 * easeOut(seg(t, tCatch, tUni)) * (1 - easeInOut(seg(t, tUni, tUni + 0.9))) + 5 * Math.sin((t - tUni) * 4.2) * seg(t, tUni, tUni + 0.8);
  const basketOf = (wheel: Pt, lean: number) => turn({ x: wheel.x + BASKET.x, y: wheel.y + BASKET.y }, wheel, rad(lean));
  const rimOf = (basket: Pt, lean: number) => turn({ x: basket.x + BASKET_RIM.x, y: basket.y + BASKET_RIM.y }, basket, rad(lean));
  const freeRim = (t: number) => {
    const lean = rideLean(t);
    return rimOf(basketOf(along(wheelPath, freeD(t)).pt, lean), lean);
  };
  let tHook = tUni;
  while (tHook < tUni + uni.duration && freeRim(tHook).x < EYE.x) tHook += STEP;
  const tassel0 = freeRim(tHook);
  const dHook = freeD(tHook);
  const vHook = (freeD(tHook + STEP) - dHook) / STEP;
  const brake = wheelPath.total - dHook;
  const tStop = tHook + (2 * brake) / vHook;
  const wheelD = (t: number) => {
    if (t < tHook) return freeD(t);
    const u = Math.min(t, tStop) - tHook;
    return dHook + vHook * u - ((vHook * vHook) / (4 * brake)) * u * u;
  };
  const tHoop = tUni + timeWhen(uni, (pt) => pt.x >= HOOP.x - 40);
  at(tUni, { sound: playSqueak });
  at(tHoop, { sound: playWhoosh });
  at(tHook, { sound: playRing });

  const unicycleAt = (t: number): { pt: Pt; turned: number; lean: number } => {
    const d = wheelD(t);
    // Held by the ribbon, it stops with a little nod forward.
    const lean = t < tStop ? rideLean(t) * (1 - seg(t, tHook, tStop)) : wobble(t - tStop, 8, 9, 2.5);
    return { pt: along(wheelPath, d).pt, turned: d, lean };
  };
  const basketAt = (t: number) => {
    const { pt, lean } = unicycleAt(t);
    return basketOf(pt, lean);
  };
  /** The ribbon's tassel: hanging under the eye until the basket takes it along. */
  const tasselAt = (t: number) => {
    if (t < tHook) return tassel0;
    const { lean } = unicycleAt(t);
    return rimOf(basketAt(t), lean);
  };
  /** How much ribbon has been pulled through the eye. */
  const pulledAt = (t: number) => Math.hypot(tasselAt(t).x - EYE.x, tasselAt(t).y - EYE.y) - Math.hypot(tassel0.x - EYE.x, tassel0.y - EYE.y);

  const marbleAt = (t: number): { pt: Pt; spin: number } => {
    if (t < t0) return { pt: HAT, spin: 0 };
    if (t < tRailEnd) {
      const pt = along(railRun.path, distAt(railRun, t - t0)).pt;
      return { pt, spin: pt.x / BALL_R };
    }
    if (t >= tCatch) return { pt: basketAt(t), spin: caught.x / BALL_R };
    if (t >= tOut) {
      const pt = hop(flungFrom, caught, 120, seg(t, tOut, tCatch));
      return { pt, spin: pt.x / BALL_R };
    }
    if (t >= tPlop) return { pt: nestAt(t), spin: landed.x / BALL_R };
    if (t >= tDrop) {
      // Straight down with gravity, from the top of the swing into the mane.
      const u = t - tDrop;
      const pt = { x: lerp(released.x, landed.x, seg(t, tDrop, tPlop)), y: released.y + (GRAVITY / 2) * u * u };
      return { pt, spin: released.x / BALL_R };
    }
    if (t >= tGrab) return { pt: onTrapeze(FEET, swingAt(t)), spin: grabbed.x / BALL_R };
    if (t >= tTip) {
      const pt = hop(tip, grabbed, tossRise, seg(t, tTip, tGrab));
      return { pt, spin: pt.x / BALL_R };
    }
    if (t >= tChute) {
      const d = distAt(elephantRun, t - tChute);
      return { pt: along(elephantPath, d).pt, spin: (chuteLand.x + d) / BALL_R };
    }
    if (t >= tNose && t < tLetGo) {
      const pt = turn(ON_NOSE, NECK, rad(nodAt(t)));
      return { pt, spin: pt.x / BALL_R };
    }
    if (t >= tBed && t < tFling) return { pt: { x: bedSpot.x, y: bedSpot.y + dipAt(t) }, spin: bedSpot.x / BALL_R };
    const h = hops.find((h) => t < h.t1) ?? hops[hops.length - 1];
    const pt = hop(h.a, h.b, h.h, seg(t, h.t0, h.t1));
    return { pt, spin: pt.x / BALL_R };
  };

  /* The ribbon pulls the cannon's cord: pop! The clown flies into the net. */
  const tFire = tStop + 0.4;
  at(tFire, { sound: playLaunch });
  at(tFire, { sound: playPop });

  const clownIn = { x: MUZZLE.x - 12 * BARREL.x, y: MUZZLE.y - 12 * BARREL.y };
  const clownLand = { x: (NET.x0 + NET.x1) / 2, y: NET.y + NET.sag - CLOWN.seat };
  // Rise just enough above the straight line that it leaves along the barrel.
  const clownRise = (clownLand.y - clownIn.y + Math.tan(rad(CANNON.angle)) * (clownLand.x - clownIn.x)) / 4;
  const tNet = tFire + 1.5;
  at(tNet, { sound: playBoing });

  /** How far the middle of the net hangs down: it gives with the clown and springs back. */
  const sagAt = (t: number) => NET.sag + (t < tNet ? 0 : 46 * Math.sin((t - tNet) * 9) * Math.exp(-(t - tNet) * 3));

  const clownAt = (t: number): { pt: Pt; turn: number } => {
    const aim = 90 - CANNON.angle;
    if (t < tFire) return { pt: clownIn, turn: aim };
    if (t < tNet) {
      const k = seg(t, tFire, tNet);
      return { pt: hop(clownIn, clownLand, clownRise, k), turn: aim + (360 - aim) * easeInOut(k) };
    }
    return { pt: { x: clownLand.x, y: NET.y + sagAt(t) - CLOWN.seat }, turn: 0 };
  };

  /* The finale: the curtain opens, the spotlights come on, confetti rains, „Tusch“. */
  const tShow = tNet + 0.7;
  const tDone = tShow + 2.4;
  at(tShow, { sound: playWhoosh });
  at(tShow + 0.15, { sound: playMelody });
  at(tShow + 0.3, {
    say: {
      de: "Tusch! Bravo, kleiner Clown!",
      en: "Ta-da! Bravo, little clown!",
      zh: "锵锵！小丑真棒！",
      hi: "टा-डा! वाह, छोटे जोकर!",
      es: "¡Tachán! ¡Bravo, payasito!",
      ar: "تا-دا! برافو أيها المهرّج الصغير!",
      ru: "Та-дам! Браво, клоун!",
    },
  });
  at(tShow + 1.2, { sound: playTwinkle });
  at(tShow + 1.6, { sound: playGiggle });
  at(tDone, { done: true });

  /** Where the camera looks: the thing that moves right now. */
  const focusX = (t: number) => {
    if (t < 0) return 0;
    if (t < tNose) return Math.max(600, marbleAt(t).pt.x);
    if (t < tLetGo) return SEAL.x + 100;
    if (t < tGrab) return marbleAt(t).pt.x;
    // The whole swing, the lion's pedestal under it and the next one stay in sight.
    if (t < tLeap) return TRAPEZE.x + 200;
    if (t < tOut) return lionAt(t).x + 60;
    if (t < tUni) return marbleAt(t).pt.x;
    if (t < tStop) return unicycleAt(t).pt.x;
    if (t < tFire) return CANNON.x;
    if (t < tNet) return clownAt(t).pt.x;
    return clownLand.x;
  };
  const cameraTarget = (t: number) => cameraOn(WORLD_W, focusX(t));

  return {
    events: sorted(),
    duration: tDone,
    trunkWay,
    drumTimes,
    tCymbal,
    tBed,
    tNose,
    tClap,
    tHead,
    tTip,
    tGrab,
    tDrop,
    tPlop,
    tRoar,
    tLeap,
    tLand,
    tShake,
    tOut,
    tCatch,
    tHoop,
    tHook,
    tStop,
    tFire,
    tNet,
    tShow,
    marbleAt,
    dipAt,
    nodAt,
    clapAt,
    swingAt,
    lionAt,
    unicycleAt,
    tasselAt,
    pulledAt,
    clownAt,
    sagAt,
    cameraTarget,
  };
}
