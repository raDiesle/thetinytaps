// The big machine ("Große Maschine"), a Rube Goldberg machine through a long
// playroom: one tap lets a marble go, and one thing sets off the next for about
// half a minute while the camera travels along. Everything is worked out ahead
// as a function of the seconds since the tap, so MachineLevel.tsx only asks
// where each thing is at a moment. Coordinates are those of the playroom,
// 6900 × 900; the screen shows 1600 of it at a time.

import {
  playBoing,
  playClonk,
  playCountNote,
  playCuckoo,
  playDing,
  playHonk,
  playKnock,
  playPlop,
  playPop,
  playRing,
  playSwirl,
  playThump,
  playTick,
  playTwinkle,
  playWhistle,
  playWhoosh,
} from "@/lib/sfx";
import { wobble } from "./level";
import {
  along,
  cameraOn,
  distAt,
  easeIn,
  easeInOut,
  easeOut,
  hop,
  lerp,
  type MachineEvent,
  pathOf,
  rad,
  roll,
  rounded,
  seg,
  steady,
  timeWhen,
} from "./machineKit";
import { arc, BALL_R, line, quad, type Pt } from "./path";

export const WORLD_W = 6900;
export const FLOOR = 800;

/* ---------- Layout ---------- */

export const HOPPER = { x: 160, y: 60 };

/** The first ramp, with the xylophone on it. */
export const RAMP = { from: { x: 190, y: 180 }, to: { x: 900, y: 330 } };
export const rampY = (x: number) => RAMP.from.y + ((x - RAMP.from.x) * (RAMP.to.y - RAMP.from.y)) / (RAMP.to.x - RAMP.from.x);
export const BARS = Array.from({ length: 6 }, (_, i) => ({ x: 300 + i * 92, w: 84 }));
/** The bell hangs from a bracket on the wall, low enough for the marble to brush it. */
export const BELL = { pivot: { x: 884, y: 244 } };

export const FUNNEL = { cx: 1060, rimY: 400, rx: 110, ry: 26, spoutY: 510, spoutW: 46 };

/** The long table the funnel, the dominoes and the car stand on. */
export const TABLE = { x0: 900, x1: 2140, y: 600 };

export const DOMINO = { n: 10, w: 24, h: 124, left0: 1340, step: 60 };
export const dominoLeft = (i: number) => DOMINO.left0 + i * DOMINO.step;
/** The angle a domino comes to rest at, leaning on the next one. */
export const DOMINO_LEAN = Math.asin((DOMINO.step - DOMINO.w) / DOMINO.h);
/** Seconds for one domino to tip onto the next. */
const DOMINO_FALL = 0.3;

export const CAR = { len: 150, wheelR: 18 };
const CAR_MID0 = dominoLeft(DOMINO.n - 1) + DOMINO.step + CAR.len / 2;

/** Orange toy track: down from the table, round the loop, along the floor and up the jump. */
export const LOOP = { cx: 2960, cy: FLOOR - 120, r: 120 };
export const JUMP = { x0: 3160, x1: 3320, top: 745 };

/** The seesaw catapult; positive tilt tips the right end down. */
export const SEESAW = { cx: 3700, cy: 730, half: 175, rest: 14, flipped: -14 };
const CAR_ON_BEAM = -100;
const BALL_ON_BEAM = 128;

export const BALL = { r: 30 };
/** Toy block stairs going down to the right. */
export const STAIRS = { x0: 4060, w: 110, top0: 430, rise: 80, n: 4 };

export const BUCKET = { cx: 4600, rimY: 560, h: 90, top: 124, bottom: 92, drop: 140 };
export const PULLEYS = { r: 24, a: { x: 4624, y: 140 }, b: { x: 4996, y: 140 } };
/** The gate is pulled up by the rope as far as the bucket goes down. */
export const GATE = { x: 5000, w: 40, h: 160 };

export const TRAIN = { front0: 4985, loco: 160, wagon: 120, gap: 14 };
export const CROSSING_X = 5620;
/** A box with a red push button sticking out `knob` on the side the train comes from. */
export const BUTTON = { x: 6300, w: 80, h: 100, knob: 16, press: 10 };
export const GIFT = { x: 6460, w: 240, h: 190 };
/** The cable from the button to the gift box, along which a spark runs. */
export const CABLE = quad({ x: BUTTON.x + BUTTON.w, y: 770 }, { x: 6420, y: 812 }, { x: GIFT.x, y: 780 });

/* ---------- Helpers ---------- */

/** A spot on the seesaw beam `u` from its middle, `lift` above the beam's middle line, at `tilt` degrees. */
export function onBeam(u: number, lift: number, tilt: number): Pt {
  const a = rad(tilt);
  return { x: SEESAW.cx + u * Math.cos(a) + lift * Math.sin(a), y: SEESAW.cy + u * Math.sin(a) - lift * Math.cos(a) };
}

/** Round and round down the funnel: the circle shrinks, and its front half is lower (nearer). */
function spiral(): Pt[] {
  const { cx, rimY, spoutY } = FUNNEL;
  const turns = 3;
  const n = 200;
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const a = Math.PI + turns * 2 * Math.PI * t;
    const r = 90 * (1 - t) + 8 * t;
    return { x: cx + r * Math.cos(a), y: rimY + (spoutY - 28 - rimY) * t + r * 0.22 * Math.sin(a) };
  });
}

/* ---------- The machine ---------- */

interface Hop {
  t0: number;
  t1: number;
  a: Pt;
  b: Pt;
  h: number;
}

export type Machine = ReturnType<typeof buildMachine>;

export function buildMachine() {
  const events: MachineEvent[] = [];
  const at = (t: number, e: Omit<MachineEvent, "at">) => events.push({ at: t, ...e });

  /* The marble: out of the hopper, down the xylophone ramp past the bell, round the funnel, along the table. */
  const marble1 = roll(
    pathOf(
      line(HOPPER, { x: HOPPER.x, y: 150 }),
      quad({ x: HOPPER.x, y: 150 }, { x: HOPPER.x + 1, y: 176 }, RAMP.from),
      line(RAMP.from, RAMP.to),
      quad(RAMP.to, { x: 955, y: 340 }, { x: 970, y: 385 }),
      line({ x: 970, y: 385 }, { x: 970, y: FUNNEL.rimY }),
    ),
    0,
    200,
    470,
  );
  const swirl = spiral();
  const marble2 = steady(pathOf(swirl), 330);
  const tableTop = TABLE.y - BALL_R;
  const hitX = DOMINO.left0 - BALL_R;
  const marble3 = roll(
    pathOf(
      line(swirl[swirl.length - 1], { x: FUNNEL.cx, y: FUNNEL.spoutY + 10 }),
      quad({ x: FUNNEL.cx, y: FUNNEL.spoutY + 10 }, { x: FUNNEL.cx + 2, y: tableTop }, { x: FUNNEL.cx + 50, y: tableTop }),
      line({ x: FUNNEL.cx + 50, y: tableTop }, { x: hitX, y: tableTop }),
    ),
    150,
    230,
    460,
  );
  const marbleRuns = [
    { t0: 0.15, run: marble1 },
    { t0: 0.15 + marble1.duration, run: marble2 },
    { t0: 0.15 + marble1.duration + marble2.duration, run: marble3 },
  ];
  const tHit = marbleRuns[2].t0 + marble3.duration;

  at(0, { sound: playPop });
  const barTimes = BARS.map((bar) => marbleRuns[0].t0 + timeWhen(marble1, (pt) => pt.x >= bar.x + bar.w / 2));
  barTimes.forEach((t, i) => at(t, { sound: () => playCountNote(i) }));
  const tBell = marbleRuns[0].t0 + timeWhen(marble1, (pt) => pt.x >= BELL.pivot.x - 24);
  at(tBell, { sound: playDing });
  at(marbleRuns[1].t0, { sound: playSwirl });

  const marbleAt = (t: number): { pt: Pt; spin: number } => {
    if (t >= tHit) {
      // It knocks the first domino and rolls back a little.
      const back = 34 * easeOut(seg(t, tHit, tHit + 0.6));
      return { pt: { x: hitX - back, y: tableTop }, spin: (hitX - back) / BALL_R };
    }
    for (let i = marbleRuns.length - 1; i >= 0; i--) {
      const { t0, run } = marbleRuns[i];
      if (t >= t0) {
        const pt = along(run.path, distAt(run, t - t0)).pt;
        return { pt, spin: pt.x / BALL_R };
      }
    }
    return { pt: HOPPER, spin: 0 };
  };

  /* Ten dominoes, each tipping onto the next; the last one pushes the car. */
  const dominoStart = (i: number) => tHit + i * DOMINO_FALL;
  const tCar = dominoStart(DOMINO.n);
  at(tHit, { sound: () => playKnock(1700) });
  for (let i = 0; i < DOMINO.n; i++) at(dominoStart(i + 1), { sound: () => playKnock(1500 - i * 80) });
  const dominoAngle = (i: number, t: number) => {
    const lean = DOMINO_LEAN * easeIn(seg(t, dominoStart(i), dominoStart(i + 1)));
    // The car rolls away, so the last one falls flat on the table.
    return i === DOMINO.n - 1 ? lean + (Math.PI / 2 - DOMINO_LEAN) * easeIn(seg(t, tCar + 0.15, tCar + 0.55)) : lean;
  };

  /* The car: along the table, down the ramp, round the loop, up the jump and onto the seesaw. */
  const carPath = pathOf(
    rounded(
      [
        { x: CAR_MID0, y: TABLE.y },
        { x: TABLE.x1, y: TABLE.y },
        { x: LOOP.cx - 220, y: FLOOR },
        { x: LOOP.cx, y: FLOOR },
      ],
      40,
    ),
    arc(LOOP.cx, LOOP.cy, LOOP.r, 90, -270),
    rounded(
      [
        { x: LOOP.cx, y: FLOOR },
        { x: JUMP.x0, y: FLOOR },
        { x: JUMP.x1, y: JUMP.top },
      ],
      30,
    ),
  );
  const loopIn = carPath.s[carPath.pts.findIndex((p) => p.x >= LOOP.cx - 1 && p.y >= FLOOR - 1)];
  const loopOut = loopIn + 2 * Math.PI * LOOP.r;
  // In the loop the car keeps going nearly as fast as it came in.
  const car = roll(carPath, 170, 170, 760, 0.2, (d) => (d > loopIn && d < loopOut ? 0.35 : 1));
  const tJump = tCar + car.duration;
  const tLand = tJump + 0.55;
  const launch = along(carPath, carPath.total);
  const landing = onBeam(CAR_ON_BEAM, 7, SEESAW.rest);
  at(tCar + 0.1, { sound: playHonk });
  at(tCar + timeWhen(car, (_, d) => d >= loopIn), { sound: playWhoosh });
  at(tLand, { sound: playThump });

  const tiltAt = (t: number) =>
    t < tLand ? SEESAW.rest : lerp(SEESAW.rest, SEESAW.flipped, easeIn(seg(t, tLand, tLand + 0.18))) + wobble(t - tLand - 0.18, 3, 18, 6);

  const carAt = (t: number): { pt: Pt; angle: number; turned: number } => {
    if (t < tCar) return { pt: { x: CAR_MID0, y: TABLE.y }, angle: 0, turned: 0 };
    if (t < tJump) {
      const d = distAt(car, t - tCar);
      const { pt, angle } = along(carPath, d);
      return { pt, angle, turned: d };
    }
    if (t < tLand) {
      const k = seg(t, tJump, tLand);
      return { pt: hop(launch.pt, landing, 70, k), angle: lerp(launch.angle, rad(SEESAW.rest), k), turned: carPath.total + k * 300 };
    }
    const tilt = tiltAt(t);
    return { pt: onBeam(CAR_ON_BEAM, 7, tilt), angle: rad(tilt), turned: carPath.total + 300 };
  };

  /* The beach ball: flung up by the seesaw, bouncing down the stairs into the bucket. */
  const ball0 = onBeam(BALL_ON_BEAM, 7 + BALL.r, SEESAW.rest);
  const stepSpot = (i: number) => ({ x: STAIRS.x0 + i * STAIRS.w + STAIRS.w / 2, y: STAIRS.top0 + i * STAIRS.rise - BALL.r });
  const inBucket = { x: BUCKET.cx, y: BUCKET.rimY + 18 };
  const tLaunch = tLand + 0.08;
  const hops: Hop[] = [];
  const addHop = (b: Pt, h: number, dur: number) => {
    const prev = hops[hops.length - 1];
    const t0 = prev ? prev.t1 : tLaunch;
    hops.push({ t0, t1: t0 + dur, a: prev ? prev.b : ball0, b, h });
  };
  addHop(stepSpot(0), 260, 1.0);
  for (let i = 1; i < STAIRS.n; i++) addHop(stepSpot(i), 70, 0.42);
  addHop(inBucket, 110, 0.55);
  const tBucket = hops[hops.length - 1].t1;
  at(tLaunch, { sound: playBoing });
  hops.slice(0, -1).forEach((h, i) => at(h.t1, { sound: () => playKnock(1100 - i * 120) }));
  at(tBucket, { sound: playPlop });
  at(tBucket + 0.15, { sound: playTick });

  const bucketDrop = (t: number) => BUCKET.drop * easeInOut(seg(t, tBucket, tBucket + 1.6));

  const ballAt = (t: number): { pt: Pt; squash: number } => {
    if (t >= tBucket) return { pt: { x: inBucket.x, y: inBucket.y + bucketDrop(t) }, squash: 0 };
    const h = hops.find((h) => t < h.t1);
    if (!h || t < tLaunch) return { pt: ball0, squash: 0 };
    const age = t - h.t0;
    return { pt: hop(h.a, h.b, h.h, seg(t, h.t0, h.t1)), squash: h === hops[0] ? 0 : 0.22 * Math.exp(-age * 16) * Math.cos(age * 20) };
  };

  /* The train: once the gate is up it chugs along, past the level crossing, into the button. */
  const tTrain = tBucket + 1.5;
  const trainLen = BUTTON.x - BUTTON.knob + BUTTON.press - TRAIN.front0;
  const trainT = 8;
  const speedUp = 1.6;
  const brake = 0.5;
  const vmax = trainLen / (trainT - speedUp / 2 - brake / 2);
  const trainGone = (t: number) => {
    const u = t - tTrain;
    if (u <= 0) return 0;
    if (u < speedUp) return (0.5 * vmax * u * u) / speedUp;
    if (u < trainT - brake) return 0.5 * vmax * speedUp + vmax * (u - speedUp);
    if (u < trainT) return trainLen - (0.5 * vmax * (trainT - u) ** 2) / brake;
    return trainLen;
  };
  const trainFront = (t: number) => TRAIN.front0 + trainGone(t);
  const tButton = tTrain + trainT;
  at(tTrain, { sound: playWhistle });
  const crossingStart = (x: number) => {
    // When the front gets to `x`: the train is fast by then, so solve the cruising part.
    const gone = x - TRAIN.front0;
    return tTrain + speedUp + (gone - 0.5 * vmax * speedUp) / vmax;
  };
  at(crossingStart(CROSSING_X - 60), { sound: playRing });
  at(crossingStart(CROSSING_X + 400), { sound: playRing });

  /* The finale: a spark runs along the cable and the jack-in-the-box jumps out of the gift box. */
  const tPop = tButton + 0.6;
  const tDone = tPop + 2.2;
  at(tButton, { sound: playClonk });
  at(tPop, { sound: playPop });
  at(tPop + 0.15, { sound: playBoing });
  at(tPop + 0.5, { sound: playCuckoo });
  at(tPop + 1.2, { sound: playTwinkle });
  at(tPop + 0.6, {
    say: {
      de: "Kuckuck! Die Maschine hat es geschafft!",
      en: "Cuckoo! The machine did it!",
      zh: "布谷！机器成功啦！",
      hi: "कू-कू! मशीन ने कर दिखाया!",
      es: "¡Cucú! ¡La máquina lo logró!",
      ar: "كوكو! الآلة نجحت!",
      ru: "Ку-ку! Машина справилась!",
    },
  });
  at(tDone, { done: true });
  events.sort((a, b) => a.at - b.at);

  /** Where the camera looks: the thing that moves right now. */
  const focusX = (t: number) => {
    if (t < 0) return 0;
    if (t < tHit) return marbleAt(t).pt.x;
    if (t < tCar) return dominoLeft(Math.min(DOMINO.n - 1, Math.floor((t - tHit) / DOMINO_FALL)));
    if (t < tLaunch) return carAt(t).pt.x;
    if (t < tBucket) return ballAt(t).pt.x;
    if (t < tTrain) return (BUCKET.cx + GATE.x) / 2;
    if (t < tButton) return trainFront(t) - 120;
    return GIFT.x;
  };
  const cameraTarget = (t: number) => cameraOn(WORLD_W, focusX(t));

  return {
    events,
    duration: tDone,
    swirl,
    carPath,
    loopIn,
    barTimes,
    tBell,
    tLand,
    tBucket,
    tTrain,
    tButton,
    tPop,
    marbleAt,
    dominoAngle,
    carAt,
    tiltAt,
    ballAt,
    bucketDrop,
    trainFront,
    cameraTarget,
  };
}
