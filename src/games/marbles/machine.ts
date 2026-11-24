// The big machine ("Große Maschine"), a Rube Goldberg machine through a long
// playroom: one tap lets a marble go, and one thing sets off the next for about
// a minute while the camera travels along – xylophone, bell, funnel, a Newton's
// cradle whose last ball taps a roly-poly penguin until it rocks into a toy car,
// the car through a loop onto a seesaw, a beach ball down block stairs into a
// bucket that pulls up the gate for the train. The train bumps a humming top,
// which hums and wanders across the floor into a tower of stacking cups; the
// tower sways and tumbles, every cup plinks its own note as it lands, and the
// top cup flicks a paper plane off, which loops the loop and glides onto the key
// of a toy cash register. Its drawer shoots out and sends a hula hoop rolling
// across the room into the lowest gondola of a toy Ferris wheel, which carries a
// little parachutist up to the top; he jumps, floats down on his parachute and
// lands on the button for the jack-in-the-box. Everything is worked out ahead as
// a function of the seconds since the tap, so MachineLevel.tsx only asks where
// each thing is at a moment. Coordinates are those of the playroom,
// 12600 × 900; the screen shows 1600 of it at a time.

import {
  playBoing,
  playChimeNote,
  playClick,
  playClonk,
  playCountNote,
  playCreak,
  playDing,
  playHum,
  playInflate,
  playKnock,
  playPing,
  playPlink,
  playPlop,
  playPop,
  playRattle,
  playRing,
  playSlide,
  playSwirl,
  playThump,
  playTick,
  playTwinkle,
  playWhirr,
  playWhoosh,
} from "@/lib/sfx";
import { playCuckoo, playHonk, playWhistle } from "@/lib/realSounds";
import { wobble, decay } from "./level";
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
  STEP,
  steady,
  timeWhen,
  turn,
  hump,
} from "./machineKit";
import { arc, BALL_R, line, quad, type Pt } from "./path";

export const WORLD_W = 12600;
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

/** The long table the funnel, the Newton's cradle, the penguin and the car stand on. */
export const TABLE = { x0: 900, x1: 2140, y: 600 };

export const CAR = { len: 150, wheelR: 18 };
/** Where the car waits on the table, its middle between the wheels. */
export const CAR_MID0 = 2015;
/** The top of the car's back (its outline's corner there), where the penguin's head bonks it. */
export const CAR_BACK = { x: CAR_MID0 - 73, y: TABLE.y - 59 };

/**
 * The Newton's cradle on the table: five steel balls the marble's size hang side by side on strings `string` long,
 * so the marble rolls right into the first one. The ball at the other end swings out, up to `swing` degrees, back
 * in `half` seconds and knocks the first one out, and so on, clacking each time.
 */
export const CRADLE = { n: 5, r: BALL_R, string: 150, swing: 16, half: 0.6 };
/** The height of the bar the cradle's balls hang from. */
export const CRADLE_TOP = TABLE.y - CRADLE.r - CRADLE.string;

/**
 * The roly-poly penguin (Stehaufmännchen) beside the cradle: it rocks on the bottom of its round belly (`body` its
 * radius), its head `head` round and `headUp` above the spot it rocks on. Each time the cradle's last ball swings out
 * it taps the penguin, which rocks a little further each time (`leans`, degrees towards the car, one rock in the
 * cradle's beat) until the last rock's head bonks the car's back.
 */
export const PENGUIN = { body: 42, head: 26, headUp: 92, leans: [10, 18, 27, 40], period: 2 * CRADLE.half };
const LAST_LEAN = rad(PENGUIN.leans[PENGUIN.leans.length - 1]);
/** Where the penguin stands: so that, leaning furthest, its head just touches the car's back. */
export const PENGUIN_X =
  CAR_BACK.x -
  PENGUIN.body * LAST_LEAN -
  (PENGUIN.headUp - PENGUIN.body) * Math.sin(LAST_LEAN) -
  Math.sqrt(PENGUIN.head ** 2 - (CAR_BACK.y - (TABLE.y - PENGUIN.body - (PENGUIN.headUp - PENGUIN.body) * Math.cos(LAST_LEAN))) ** 2);
/**
 * Where the penguin's belly and head are while it leans `tilt` degrees (to the right, towards the car): it rolls on its
 * round belly, so the belly's middle moves along as far as the belly's edge has rolled, and the head turns round it.
 */
export function penguinParts(tilt: number) {
  const a = rad(tilt);
  const body = { x: PENGUIN_X + PENGUIN.body * a, y: TABLE.y - PENGUIN.body };
  const up = PENGUIN.headUp - PENGUIN.body;
  return { body, head: { x: body.x + up * Math.sin(a), y: body.y - up * Math.cos(a) } };
}
const SWING_OUT = { dx: CRADLE.string * Math.sin(rad(CRADLE.swing)), lift: CRADLE.string * (1 - Math.cos(rad(CRADLE.swing))) };
/** Where the last ball hangs: swung out all the way, it just touches the upright penguin's belly. */
const LAST_BALL_X = PENGUIN_X - Math.sqrt((PENGUIN.body + CRADLE.r) ** 2 - (PENGUIN.body - CRADLE.r - SWING_OUT.lift) ** 2) - SWING_OUT.dx;
/** Where ball `i` of the cradle hangs from the bar, counted from the marble's side. */
export const cradleX = (i: number) => LAST_BALL_X - (CRADLE.n - 1 - i) * 2 * CRADLE.r;
/** How far the first ball, swinging out, nudges the marble back: further than the ball swings, so they part again. */
const MARBLE_BACK = 75;

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
/** Where the train's front comes to a stop, against the spinning top; the rails end here. */
export const TRAIN_STOP = 6300;

/**
 * The humming top (Brummkreisel), drawn standing on its tip: a round body `rx` × `ry` whose middle is `mid` above
 * the tip, and a plunger `rod` long on top. The locomotive's boiler touches its body when the train's front is
 * `push` short of the top's tip.
 */
export const KREISEL = { x0: 6320, rx: 48, ry: 38, mid: 50, rod: 128, push: 44 };
/** The angle the top lies at once it has flopped over (degrees, to the left): body and plunger knob on the floor. */
export const KREISEL_FALLEN = -115;

/** The tower of stacking cups, standing upside down on the floor around `x`, biggest at the bottom. */
export const TOWER = { x: 7000 };
/** Each cup's width at its open end (`W`, at the bottom while stacked), at its closed end (`w`) and its height. */
export const CUPS = Array.from({ length: 6 }, (_, i) => ({ W: 120 - i * 14, w: 0.72 * (120 - i * 14), H: 64 - i * 4 }));
/** How high up the tower each cup stands: the heights of all cups below it. */
export const cupBase = (i: number) => CUPS.slice(0, i).reduce((sum, c) => sum + c.H, 0);
export const TOWER_TOP = FLOOR - cupBase(CUPS.length);
/** Half a stacked cup's width `h` above its open end. */
export const cupHalf = (i: number, h: number) => CUPS[i].W / 2 - ((CUPS[i].W - CUPS[i].w) / 2) * (h / CUPS[i].H);
/**
 * A cup lying on its side: turned a little past 90°, so its slanting side lies flat on the floor, with its middle
 * `lift` above the floor.
 */
export function cupLying(i: number) {
  const { W, w, H } = CUPS[i];
  const slant = (W - w) / 2;
  return { angle: 90 + (Math.atan2(slant, H) * 180) / Math.PI, lift: (H * (W + w)) / 4 / Math.hypot(H, slant) };
}

/** The paper plane loops the loop round this circle on its way from the tower to the button. */
export const PLANE_LOOP = { cx: 7470, cy: 330, r: 105 };

/**
 * The toy cash register on the floor: a big red key sticks out `key` on its left side, where the paper plane comes
 * from, and pushed in `press` it rings and shoots the drawer out `drawer` on its right side, low above the floor.
 */
export const REGISTER = { x: 9000, w: 220, h: 170, key: 16, press: 10, drawer: 100 };
/** The height of the middle of the red key. */
export const KEY_Y = FLOOR - 54;
/** The drawer's middle height and its height. */
export const DRAWER = { y: FLOOR - 32, h: 40 };

/** The hula hoop, standing on its edge right of the register until the drawer pushes it. */
export const HOOP = { r: 95 };
/** Where the hoop's middle starts: the drawer meets it half way out. */
export const HOOP_X0 = REGISTER.x + REGISTER.w + REGISTER.drawer / 2 + Math.sqrt(HOOP.r ** 2 - (DRAWER.y - (FLOOR - HOOP.r)) ** 2);

/**
 * The toy Ferris wheel: `n` gondolas hang round its hub `r` out, each `w` × `h` and `hang` below its pin. The hoop
 * runs into the lowest gondola, where the little parachutist sits, and the wheel carries him up to the top.
 */
export const WHEEL = { cx: 11470, cy: 480, r: 210, n: 3, w: 80, h: 56, hang: 34 };
/** Where the hoop's middle is when it reaches the lowest gondola's top left corner. */
export const HOOP_X1 = WHEEL.cx - WHEEL.w / 2 - Math.sqrt(HOOP.r ** 2 - (WHEEL.cy + WHEEL.r + WHEEL.hang - (FLOOR - HOOP.r)) ** 2);
/**
 * The parachutist's height from his feet to the top of his head; sitting in a gondola his feet are `seat` above its
 * floor, so his head looks out over its side.
 */
export const JUMPER = { h: 81, seat: 14 };

/** A box with a red push button `knob` high on top, which the parachutist lands on. */
export const BUTTON = { x: 11835, w: 110, h: 70, knob: 18, press: 10 };
/** The top of the red knob before it is pressed. */
export const KNOB_TOP = FLOOR - BUTTON.h - BUTTON.knob;
export const GIFT = { x: 12105, w: 240, h: 190 };
/** The cable from the button to the gift box, along which a spark runs. */
export const CABLE = quad({ x: BUTTON.x + BUTTON.w, y: 770 }, { x: GIFT.x - 40, y: 812 }, { x: GIFT.x, y: 780 });

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
  const hitX = cradleX(0) - 2 * CRADLE.r;
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
      // It stops dead at the cradle, until the first ball swings out and nudges it back a little.
      const back = MARBLE_BACK * easeOut(seg(t, tHit + CRADLE.half, tHit + 2 * CRADLE.half));
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

  /*
   * The Newton's cradle and the roly-poly penguin: the marble knocks the first ball, the last one swings out and
   * taps the penguin, swings back and knocks the first one out, and so on. The penguin rocks in the cradle's beat,
   * a little further after every tap, and on its fourth rock its head bonks the car's back.
   */
  const taps = PENGUIN.leans.map((_, k) => tHit + CRADLE.half / 2 + k * PENGUIN.period);
  const tCar = taps[taps.length - 1] + PENGUIN.period / 4;
  /** How far the cradle's balls swing out: as far each time until the car is off, then less and less. */
  const cradleAmp = (t: number) => (t < tCar ? CRADLE.swing : CRADLE.swing * decay((t - tCar) * 1.5));
  /** How far ball `i` has swung out (degrees, to the right): the last one, then the first, in turn. */
  const cradleSwing = (i: number, t: number) => {
    if (t < tHit || (i > 0 && i < CRADLE.n - 1)) return 0;
    const p = (t - tHit) / CRADLE.half;
    const k = Math.floor(p);
    const out = cradleAmp(t) * Math.sin(Math.PI * (p - k));
    if (k % 2 === 0) return i === CRADLE.n - 1 ? out : 0;
    return i === 0 ? -out : 0;
  };
  /** The middle of ball `i` of the cradle. */
  const cradleBall = (i: number, t: number): Pt => {
    const a = rad(cradleSwing(i, t));
    return { x: cradleX(i) + CRADLE.string * Math.sin(a), y: CRADLE_TOP + CRADLE.string * Math.cos(a) };
  };
  /** The penguin's lean (degrees, to the right): rocking away after each tap, and back off the car at the end. */
  const penguinTilt = (t: number) => {
    const { leans, period } = PENGUIN;
    if (t < taps[0]) return 0;
    if (t >= tCar) {
      const a = t - tCar;
      return leans[leans.length - 1] * Math.cos((2 * Math.PI * a) / period) * decay(a * 1.2);
    }
    const k = Math.min(leans.length - 1, Math.floor((t - taps[0]) / period));
    const u = (t - taps[k]) / period;
    // Towards the car a whole rock, back towards the cradle only a little: it stands on its round belly.
    return leans[k] * Math.sin(2 * Math.PI * u) * (u < 0.5 ? 1 : 0.35);
  };
  at(tHit, { sound: () => playKnock(2300) });
  for (let n = 1; tHit + n * CRADLE.half < tCar - 0.05; n++) at(tHit + n * CRADLE.half, { sound: () => playKnock(2300 - n * 60) });
  taps.forEach((t, k) => at(t, { sound: () => playChimeNote(k + 2) }));
  at(tCar, { sound: () => playKnock(900) });

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
    return { pt: hop(h.a, h.b, h.h, seg(t, h.t0, h.t1)), squash: h === hops[0] ? 0 : 0.22 * decay(age * 16) * Math.cos(age * 20) };
  };

  /* The train: once the gate is up it chugs along, past the level crossing, and brakes against the spinning top. */
  const tTrain = tBucket + 1.5;
  const trainLen = TRAIN_STOP - TRAIN.front0;
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
  const tStop = tTrain + trainT;
  at(tTrain, { sound: playWhistle });
  const crossingStart = (x: number) => {
    // When the front gets to `x`: the train is fast by then, so solve the cruising part.
    const gone = x - TRAIN.front0;
    return tTrain + speedUp + (gone - 0.5 * vmax * speedUp) / vmax;
  };
  at(crossingStart(CROSSING_X - 60), { sound: playRing });
  at(crossingStart(CROSSING_X + 400), { sound: playRing });

  /*
   * The humming top: the braking locomotive bumps it along a little, which sets it spinning; it hums, wanders
   * across the floor (dashing off, dithering back, dashing on) into the cup tower, bounces off, wobbles more and
   * more as it slows down and flops onto its side.
   */
  let tContact = tStop;
  for (let t = tTrain; t < tStop; t += STEP) {
    if (trainFront(t) + KREISEL.push >= KREISEL.x0) {
      tContact = t;
      break;
    }
  }
  const pushedTo = (t: number) => Math.max(KREISEL.x0, trainFront(Math.min(t, tStop)) + KREISEL.push);
  const kreiselStart = pushedTo(tStop);
  const tGo = tStop + 0.4;
  const tTower = tGo + 4.2;
  const kreiselHit = TOWER.x - cupHalf(0, KREISEL.mid) - KREISEL.rx;
  const tFlop = tTower + 2.1;
  const flopTime = 0.35;
  /** How far along its way the top is, 0 to 1: quick at first, a little way back in the middle, quick again. */
  const wander = (u: number) => u + 0.24 * Math.sin(2 * Math.PI * u);
  const SPIN = 17;
  const SPIN_LATE = 5;
  /** How far the top has turned (radians): it spins up while the train pushes it and slows down after the tower. */
  const spinAt = (t: number) => {
    const up = tGo - tContact;
    if (t < tContact) return 0;
    if (t < tGo) return (SPIN * (t - tContact) ** 2) / (2 * up);
    const atGo = (SPIN * up) / 2;
    if (t < tTower) return atGo + SPIN * (t - tGo);
    const atTower = atGo + SPIN * (tTower - tGo);
    const slow = tFlop - tTower;
    if (t < tFlop) {
      const a = t - tTower;
      return atTower + SPIN * a - ((SPIN - SPIN_LATE) * a * a) / (2 * slow);
    }
    const atFlop = atTower + ((SPIN + SPIN_LATE) * slow) / 2;
    const a = Math.min(t - tFlop, flopTime);
    return atFlop + SPIN_LATE * a - (SPIN_LATE * a * a) / (2 * flopTime);
  };
  /** The top's lean on its way: into the way it goes, with a slow sway, starting upright. */
  const wanderTilt = (t: number) => {
    const u = seg(t, tGo, tTower);
    const speed = 1 + 0.24 * 2 * Math.PI * Math.cos(2 * Math.PI * u);
    return (5 * speed + 6 * Math.sin((t - tGo) * 6)) * seg(t, tGo, tGo + 0.3);
  };
  /** The top's lean while it wobbles after the tower: wider and wider as it slows down. */
  const lateWobble = (t: number) => {
    const a = t - tTower;
    return (3 + 7 * a) * Math.sin(a * 9) + wanderTilt(tTower) * decay(a * 6);
  };
  /** How far the body of a top leaning `tilt` degrees reaches below its tip, so it never sinks into the floor. */
  const kreiselLift = (tilt: number) => {
    const a = rad(Math.abs(tilt));
    return Math.max(0, -KREISEL.mid * Math.cos(a) + Math.hypot(KREISEL.rx * Math.sin(a), KREISEL.ry * Math.cos(a)));
  };
  const kreiselAt = (t: number): { pt: Pt; tilt: number; spin: number; pump: number } => {
    const spin = spinAt(t);
    if (t < tContact) return { pt: { x: KREISEL.x0, y: FLOOR }, tilt: 0, spin: 0, pump: 0 };
    if (t < tGo) {
      // Bumped: it rocks away from the train, and the plunger bobs as if the push had pumped it.
      const age = t - tContact;
      return { pt: { x: pushedTo(t), y: FLOOR }, tilt: wobble(age, 9, 13, 3.5), spin, pump: 12 * Math.sin(Math.min(Math.PI, age * 6)) };
    }
    if (t < tTower) return { pt: { x: lerp(kreiselStart, kreiselHit, wander(seg(t, tGo, tTower))), y: FLOOR }, tilt: wanderTilt(t), spin, pump: 0 };
    const x = kreiselHit - 70 * easeOut(seg(t, tTower, tTower + 0.6));
    if (t < tFlop) return { pt: { x, y: FLOOR }, tilt: lateWobble(t), spin, pump: 0 };
    const from = lateWobble(tFlop);
    const tilt = lerp(from, KREISEL_FALLEN, easeIn(seg(t, tFlop, tFlop + flopTime))) + wobble(t - tFlop - flopTime, 5, 15, 4);
    return { pt: { x, y: FLOOR - kreiselLift(tilt) }, tilt, spin, pump: 0 };
  };
  at(tContact, { sound: () => playKnock(520) });
  at(tStop, { sound: playHum });
  for (let t = tGo; t < tTower - 0.3; t += 0.8) at(t, { sound: playWhirr });
  at(tTower, { sound: () => playKnock(1300) });
  at(tFlop + flopTime, { sound: playThump });

  /*
   * The stacking cups: the tower sways harder and harder on its edges, tips over to the right and falls apart;
   * each cup tumbles off on its own arc, the higher ones further, lands on its side with its own note (the
   * smallest highest), bounces once and rocks.
   */
  const tTopple = tTower + 0.8;
  const tSplit = tTopple + 0.3;
  const leanAt = (t: number) => {
    if (t < tTower) return 0;
    if (t < tTopple) {
      const a = t - tTower;
      return (3 + 6 * (a / 0.8)) * Math.sin((a / 0.8) * 4 * Math.PI);
    }
    return 26 * easeIn(seg(t, tTopple, tTopple + 0.36));
  };
  const stacked = (i: number, lean: number) => {
    // A tower rocks on the edge it leans towards.
    const pivot = { x: TOWER.x + (lean >= 0 ? 1 : -1) * (CUPS[0].W / 2), y: FLOOR };
    return { pt: turn({ x: TOWER.x, y: FLOOR - cupBase(i) - CUPS[i].H / 2 }, pivot, rad(lean)), angle: lean };
  };
  const cupFlights = CUPS.map((_, i) => {
    const from = stacked(i, leanAt(tSplit));
    const lying = cupLying(i);
    const land = { x: TOWER.x + 110 + i * 90, y: FLOOR - lying.lift };
    const t1 = tSplit + 0.5 + 0.2 * i;
    return { from, land, end: { x: land.x + 34, y: land.y }, t1, t2: t1 + 0.32, h: 40 + 45 * i, angle: lying.angle + 360 * Math.floor(i / 2) };
  });
  const cupAt = (i: number, t: number): { pt: Pt; angle: number } => {
    if (t < tSplit) return stacked(i, leanAt(t));
    const f = cupFlights[i];
    if (t < f.t1) {
      const k = seg(t, tSplit, f.t1);
      return { pt: hop(f.from.pt, f.land, f.h, k), angle: lerp(f.from.angle, f.angle, k) };
    }
    if (t < f.t2) return { pt: hop(f.land, f.end, 26, seg(t, f.t1, f.t2)), angle: f.angle };
    return { pt: f.end, angle: f.angle + wobble(t - f.t2, 9, 13, 3) };
  };
  at(tTower + 0.05, { sound: playRattle });
  cupFlights.forEach((f, i) => at(f.t1, { sound: () => playPlink(i) }));

  /* The paper plane: on top of the tower until it tips, then flicked up, round the loop and gliding across the room onto the register's key. */
  const keyX = REGISTER.x - REGISTER.key;
  /** The plane's nose sitting on the top cup, pointing right. */
  const onTopCup = (t: number) => {
    const top = cupAt(CUPS.length - 1, t);
    const a = rad(top.angle);
    const nose = turn({ x: top.pt.x + 50, y: top.pt.y - CUPS[CUPS.length - 1].H / 2 - 8 }, top.pt, a);
    return { pt: nose, angle: a };
  };
  const launchPt = onTopCup(tSplit).pt;
  const loopBottom = PLANE_LOOP.cy + PLANE_LOOP.r;
  const planePath = pathOf(
    rounded([launchPt, { x: launchPt.x + 70, y: 200 }, { x: PLANE_LOOP.cx - 130, y: loopBottom }, { x: PLANE_LOOP.cx, y: loopBottom }], 70),
    arc(PLANE_LOOP.cx, PLANE_LOOP.cy, PLANE_LOOP.r, 90, -270),
    rounded(
      [
        { x: PLANE_LOOP.cx, y: loopBottom },
        { x: 8000, y: 260 },
        { x: 8480, y: 560 },
        { x: keyX - 220, y: KEY_Y - 10 },
        { x: keyX + REGISTER.press, y: KEY_Y },
      ],
      90,
    ),
  );
  const planeLoopIn = planePath.s[planePath.pts.findIndex((p) => p.x >= PLANE_LOOP.cx - 1 && p.y >= loopBottom - 1)];
  const planeLoopOut = planeLoopIn + 2 * Math.PI * PLANE_LOOP.r;
  const plane = roll(planePath, 650, 260, 620, 0.12, () => 0.4);
  const tLoopOut = tSplit + timeWhen(plane, (_, d) => d >= planeLoopOut);
  const tKey = tSplit + plane.duration;
  const planeAt = (t: number): { pt: Pt; angle: number; squash: number } => {
    if (t < tSplit) return { ...onTopCup(t), squash: 0 };
    if (t < tKey) {
      const { pt, angle } = along(planePath, distAt(plane, t - tSplit));
      // A paper plane wobbles a little as it glides.
      return { pt, angle: angle + rad(4) * Math.sin((t - tSplit) * 9), squash: 0 };
    }
    // Bonk: the nose crumples and the plane drops onto the floor in front of the register.
    const k = seg(t, tKey, tKey + 0.45);
    const last = along(planePath, planePath.total);
    return {
      pt: { x: last.pt.x - 26 * easeOut(k), y: lerp(KEY_Y, FLOOR - 12, easeIn(k)) },
      angle: lerp(last.angle, 0, easeIn(k)) + rad(wobble(t - tKey - 0.45, 8, 16, 4)),
      squash: 0.14 * easeOut(seg(t, tKey, tKey + 0.12)),
    };
  };
  /** How far the plane has pushed the register's red key in. */
  const keyPress = (t: number) => (t >= tKey ? REGISTER.press : Math.min(REGISTER.press, Math.max(0, planeAt(t).pt.x - keyX)));
  at(tSplit, { sound: playWhoosh });
  at(tSplit + 0.3, {
    say: {
      de: "Huiii, ein Papierflieger!",
      en: "Wheee, a paper plane!",
      zh: "呜——纸飞机！",
      hi: "वाह, काग़ज़ का हवाई जहाज़!",
      es: "¡Uiii, un avión de papel!",
      ar: "ووووه، طائرة ورقية!",
      ru: "У-у-ух, бумажный самолётик!",
    },
  });
  at(tSplit + timeWhen(plane, (_, d) => d >= planeLoopIn), { sound: playSwirl });
  at(tLoopOut, { sound: playSlide });
  at(tSplit + timeWhen(plane, (pt) => pt.x >= 8480), { sound: playSlide });

  /* The cash register: the key rings it, and the drawer shoots out against the hula hoop. */
  const tDrawer = tKey + 0.15;
  const drawerOut = (t: number) => REGISTER.drawer * easeOut(seg(t, tDrawer, tDrawer + 0.3));
  /** When the drawer's front reaches the hoop, half way out. */
  const tHoop = tDrawer + 0.3 * (1 - Math.SQRT1_2);
  at(tKey, { sound: playClick });
  at(tKey + 0.06, { sound: playPing });
  at(tDrawer, { sound: playSlide });
  at(tHoop, { sound: () => playKnock(800) });

  /*
   * The hula hoop: it rolls off across the room, slowing down, into the lowest gondola of the Ferris wheel, bounces
   * back a little and falls over flat, clattering like a coin until it lies still.
   */
  const hoopPath = pathOf(line({ x: HOOP_X0, y: FLOOR - HOOP.r }, { x: HOOP_X1, y: FLOOR - HOOP.r }));
  const hoopRun = roll(hoopPath, 620, 250, 700, 0.35);
  const tHoopHit = tHoop + hoopRun.duration;
  const tFlat = tHoopHit + 0.45;
  /** Where the hoop's middle is, how far it has turned (radians), and how round it looks (1 standing, small lying flat). */
  const hoopAt = (t: number): { pt: Pt; turned: number; round: number } => {
    if (t < tHoop) return { pt: { x: HOOP_X0, y: FLOOR - HOOP.r }, turned: 0, round: 1 };
    if (t < tHoopHit) {
      const d = distAt(hoopRun, t - tHoop);
      return { pt: { x: HOOP_X0 + d, y: FLOOR - HOOP.r }, turned: d / HOOP.r, round: 1 };
    }
    const back = 60 * easeOut(seg(t, tHoopHit, tHoopHit + 0.3));
    const fall = easeIn(seg(t, tHoopHit + 0.05, tFlat));
    const flat = 0.13 + Math.abs(wobble(t - tFlat, 0.07, 22, 3.5));
    const round = t < tFlat ? Math.max(flat, Math.cos((fall * Math.PI) / 2)) : flat;
    return { pt: { x: HOOP_X1 - back, y: FLOOR - HOOP.r * round }, turned: (HOOP_X1 - HOOP_X0 - back) / HOOP.r, round };
  };
  at(tHoopHit, { sound: playClonk });
  at(tFlat, { sound: playTick });

  /*
   * The Ferris wheel: the hoop's knock sends the lowest gondola right and up, and the wheel turns half way round,
   * clicking as it goes, slower and slower, until the parachutist's gondola rocks at the very top.
   */
  const tWheel = tHoopHit;
  const TURN = 3.8;
  const tTop = tWheel + TURN;
  /** How far the wheel has turned (degrees): the bottom goes right, so the angle goes down. */
  const wheelTurn = (t: number) => -180 * easeOut(seg(t, tWheel, tTop));
  /** Gondola `i`'s pin on the rim and how far it swings (degrees): it lags as the wheel starts, and rocks when it stops. */
  const gondolaAt = (i: number, t: number): { pin: Pt; sway: number } => {
    const a = rad(90 + (i * 360) / WHEEL.n + wheelTurn(t));
    const pin = { x: WHEEL.cx + WHEEL.r * Math.cos(a), y: WHEEL.cy + WHEEL.r * Math.sin(a) };
    const sway = t < tTop ? -8 * hump(seg(t, tWheel, tWheel + 1)) : wobble(t - tTop, 9, 8, 1.8);
    return { pin, sway: t < tWheel ? 0 : sway };
  };
  for (let n = 1; n <= 6; n++) at(tWheel + TURN * (1 - Math.sqrt(1 - n / 6)), { sound: playClick });
  at(tTop + 0.05, { sound: playCreak });

  /*
   * The parachutist: a little wooden toy man sitting in the lowest gondola. At the top he hops out, his parachute
   * opens, and he floats down, swaying gently, onto the button's red knob.
   */
  const tLeap = tTop + 0.7;
  const tFloat = tLeap + 0.6;
  const seated = (t: number) => {
    const { pin, sway } = gondolaAt(0, t);
    return { feet: turn({ x: pin.x, y: pin.y + WHEEL.hang + WHEEL.h - JUMPER.seat }, pin, rad(sway)), tilt: sway };
  };
  const leap = seated(tLeap).feet;
  const airborne = { x: WHEEL.cx + 170, y: WHEEL.cy - WHEEL.r - 30 };
  const onKnob = { x: BUTTON.x + BUTTON.w / 2, y: KNOB_TOP };
  const tButton = tFloat + (onKnob.y - airborne.y) / 105;
  /** How far the parachutist has pushed the red knob down. */
  const buttonPress = (t: number) => BUTTON.press * easeOut(seg(t, tButton, tButton + 0.15));
  /** Where the parachutist's feet are, how far he leans (degrees), how far his parachute is open and how far it has folded on the floor. */
  const jumperAt = (t: number): { feet: Pt; tilt: number; open: number; fold: number } => {
    if (t < tLeap) return { ...seated(t), open: 0, fold: 0 };
    const open = easeOut(seg(t, tLeap + 0.3, tLeap + 0.75));
    if (t < tFloat) return { feet: hop(leap, airborne, 70, easeOut(seg(t, tLeap, tFloat))), tilt: 12 * (1 - open), open, fold: 0 };
    if (t < tButton) {
      const k = seg(t, tFloat, tButton);
      return {
        feet: { x: lerp(airborne.x, onKnob.x, k) + 25 * Math.sin(3 * Math.PI * k), y: lerp(airborne.y, onKnob.y, k) },
        tilt: -9 * Math.cos(3 * Math.PI * k),
        open,
        fold: 0,
      };
    }
    return { feet: { x: onKnob.x, y: onKnob.y + buttonPress(t) }, tilt: 0, open, fold: easeIn(seg(t, tButton + 0.1, tButton + 0.9)) };
  };
  at(tLeap, { sound: playWhoosh });
  at(tLeap + 0.3, { sound: playInflate });
  at(tLeap + 0.8, {
    say: {
      de: "Oh, ein Fallschirm!",
      en: "Oh, a parachute!",
      zh: "哇，降落伞！",
      hi: "अरे वाह, पैराशूट!",
      es: "¡Oh, un paracaídas!",
      ar: "واو، مظلّة!",
      ru: "Ой, парашют!",
    },
  });

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
    // The cradle clacks and the penguin rocks: show them, the marble behind and the car before.
    if (t < tCar) return hitX + 100;
    if (t < tLaunch) return carAt(t).pt.x;
    if (t < tBucket) return ballAt(t).pt.x;
    if (t < tTrain) return (BUCKET.cx + GATE.x) / 2;
    if (t < tStop) return trainFront(t) - 120;
    if (t < tTower) return kreiselAt(t).pt.x + 80;
    if (t < tSplit) return TOWER.x;
    // The cups land and the plane loops above them: show both.
    if (t < tLoopOut) return TOWER.x + 260;
    if (t < tKey) return planeAt(t).pt.x;
    // The hoop rolls off, with the register behind it at first.
    if (t < tHoopHit) return hoopAt(t).pt.x + 250;
    // The wheel turns, the parachutist floats down to the button, and the jack pops out of the gift box: all in one view.
    return GIFT.x - 400;
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
    tContact,
    tStop,
    tGo,
    tTower,
    tFlop,
    tTopple,
    tSplit,
    cupLandings: cupFlights.map((f) => f.t1),
    tLoopOut,
    tKey,
    tHoop,
    tHoopHit,
    tFlat,
    tWheel,
    tTop,
    tLeap,
    tFloat,
    tButton,
    tPop,
    tHit,
    taps,
    tCar,
    marbleAt,
    cradleSwing,
    cradleBall,
    penguinTilt,
    carAt,
    tiltAt,
    ballAt,
    bucketDrop,
    trainFront,
    kreiselAt,
    cupAt,
    planeAt,
    keyPress,
    drawerOut,
    hoopAt,
    wheelTurn,
    gondolaAt,
    jumperAt,
    buttonPress,
    cameraTarget,
    width: WORLD_W,
  };
}
