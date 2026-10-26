// The circus machine ("Zirkus"), a Rube Goldberg machine in a circus tent:
// one tap lets a marble drop out of the magician's top hat, and one act sets
// off the next for about half a minute – a drum roll, a trampoline, a seal, an
// elephant's trunk, a teddy on a unicycle on the high wire, a cannon that
// shoots the clown into the net – while the camera travels along. Everything
// is worked out ahead as a function of the seconds since the tap, so
// CircusLevel.tsx only asks where each thing is at a moment. Coordinates are
// those of the tent, 5600 × 900; the screen shows 1600 of it at a time.

import {
  playBark,
  playBoing,
  playDing,
  playDrum,
  playGiggle,
  playKnock,
  playLaunch,
  playMelody,
  playPlop,
  playPop,
  playRing,
  playSqueak,
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
  hop,
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

export const WORLD_W = 5600;
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

/** How steeply the curled-up tip of the trunk points upwards, in degrees: it flings the marble over the teddy. */
const TIP_ANGLE = 60;

/** The little platform where the unicycle waits, in front of the elephant. */
export const PLATFORM = { x0: 2640, x1: 2800, y: 640 };
export const UNICYCLE = { x0: 2740, r: 34 };
/** Where the marble's middle is in the teddy's basket, from the middle of the wheel (unicycle upright). */
export const BASKET: Pt = { x: 75, y: -150 };
/** The basket's front rim, from the marble's middle: it catches the ribbon. */
export const BASKET_RIM: Pt = { x: 30, y: -4 };

/** The high wire, from the platform down to the end platform. */
export const WIRE = { from: { x: PLATFORM.x1, y: PLATFORM.y }, to: { x: 3980, y: 722 } };
export const wireY = (x: number) => WIRE.from.y + ((x - WIRE.from.x) * (WIRE.to.y - WIRE.from.y)) / (WIRE.to.x - WIRE.from.x);
export const END = { x0: WIRE.to.x, x1: 4110, y: WIRE.to.y };

/** The ring of paper flames on a pole, the high wire running through its middle. */
export const HOOP = { x: 3390, y: wireY(3390) - 100, rx: 24, ry: 130 };

/** Where the unicycle's wheel comes to a stop on the end platform. */
export const STOP_X = END.x1 - 44;

/** The confetti cannon, its barrel turned `angle` degrees up around the axle at (x, y). */
export const CANNON = { x: 4300, y: FLOOR - 62, angle: 56, len: 210, back: 46, r: 38, cord: 150 };
const BARREL: Pt = { x: Math.cos(rad(CANNON.angle)), y: -Math.sin(rad(CANNON.angle)) };
/** A spot on the barrel, `u` along it from the axle and `v` to the side (negative is the top side). */
export const onBarrel = (u: number, v: number): Pt => ({ x: CANNON.x + u * BARREL.x - v * BARREL.y, y: CANNON.y + u * BARREL.y + v * BARREL.x });
export const MUZZLE: Pt = onBarrel(CANNON.len, 0);

/**
 * The mast at the end of the high wire. The cannon's pull cord – a ribbon,
 * like on a party popper – runs from the barrel up through the eye at its top
 * and hangs down to a tassel, just where the teddy's basket comes past.
 */
export const MAST = { x: 3990, top: 300 };
export const EYE: Pt = { x: MAST.x, y: MAST.top + 10 };
export const CORD_END: Pt = onBarrel(CANNON.cord, -CANNON.r);

/** The safety net on two poles; `sag` is how far its middle hangs below the poles' hooks. */
export const NET = { x0: 4830, x1: 5150, y: 640, sag: 24 };
/** The stage with the curtain, behind the net. */
export const STAGE = { x0: 4720, x1: 5260, top: 250 };

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

  /* Over the teddy's head into its basket: the teddy catches the marble. */
  const caught = { x: UNICYCLE.x0 + BASKET.x, y: PLATFORM.y - UNICYCLE.r + BASKET.y };
  // Rise just enough above the straight line that it leaves along the tip of the trunk.
  const tossRise = (caught.y - tip.y + Math.tan(rad(TIP_ANGLE)) * (caught.x - tip.x)) / 4;
  const tCatch = tTip + 0.85;
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
    if (t >= tTip) {
      const pt = hop(tip, caught, tossRise, seg(t, tTip, tCatch));
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
  at(tShow + 0.3, { say: { de: "Tusch! Bravo, kleiner Clown!", ru: "Та-дам! Браво, клоун!" } });
  at(tShow + 1.2, { sound: playTwinkle });
  at(tShow + 1.6, { sound: playGiggle });
  at(tDone, { done: true });

  /** Where the camera looks: the thing that moves right now. */
  const focusX = (t: number) => {
    if (t < 0) return 0;
    if (t < tNose) return Math.max(600, marbleAt(t).pt.x);
    if (t < tLetGo) return SEAL.x + 100;
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
    unicycleAt,
    tasselAt,
    pulledAt,
    clownAt,
    sagAt,
    cameraTarget,
  };
}
