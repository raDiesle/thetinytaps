// The garden machine ("Im Garten"), a Rube Goldberg machine through a long
// garden: one tap lets a marble roll out of the birdhouse, and one thing sets
// off the next for about half a minute while the camera travels along – wind
// chimes, a watering can, a water wheel, a wheelbarrow, a rake, an apple tree,
// a slide, a croquet ball, the garden tap and the sprinkler, until the
// sunflower blooms. Everything is worked out ahead as a function of the
// seconds since the tap, so GardenLevel.tsx only asks where each thing is at a
// moment. Coordinates are those of the garden, 5200 × 900; the screen shows
// 1600 of it at a time.

import {
  playBlub,
  playClonk,
  playCountNote,
  playCreak,
  playDing,
  playDrops,
  playFlush,
  playKnock,
  playLeaves,
  playPlop,
  playPop,
  playRumble,
  playSniff,
  playSplash,
  playThump,
  playTrill,
  playTweet,
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
  type Path,
} from "./machineKit";
import { BALL_R, line, quad, type Pt } from "./path";

export const WORLD_W = 5200;
export const FLOOR = 800;

/* ---------- Layout ---------- */

/** The raised lawn on the left: flat until `edge`, then a grassy bank down to the floor at `foot`. */
export const TERRACE = { y: 740, edge: 1420, foot: 1640 };
const GROUND_CORNERS = [
  { x: TERRACE.edge, y: TERRACE.y },
  { x: TERRACE.foot, y: FLOOR },
];
/** The top of the lawn from one end of the garden to the other. */
export const GROUND = rounded([{ x: -400, y: TERRACE.y }, ...GROUND_CORNERS, { x: WORLD_W + 400, y: FLOOR }], 30);

/** The birdhouse on its pole; the marble comes out of the round door at (x, doorY). */
export const BIRDHOUSE = { x: 170, doorY: 88 };

/** The rain gutter: where the marble's middle runs, from under the birdhouse to the downpipe. */
export const GUTTER = { from: { x: 140, y: 163 }, to: { x: 895, y: 240 } };
export const gutterY = (x: number) => GUTTER.from.y + ((x - GUTTER.from.x) * (GUTTER.to.y - GUTTER.from.y)) / (GUTTER.to.x - GUTTER.from.x);

/** The old tree's long branch the wind chimes hang from. */
export const branchY = (x: number) => 52 - (x - 70) * 0.03;
/** Wind chime tubes, hanging just low enough for the marble to brush their ends; the further down the gutter, the longer. */
export const CHIMES = Array.from({ length: 5 }, (_, i) => {
  const x = 360 + i * 105;
  const bottom = gutterY(x) - BALL_R + 6;
  return { x, bottom, top: bottom - 58 - i * 10 };
});

/** The watering can turns on a pin at `pivot` in a forked stick; `tilt` degrees is how far it tips forward. */
export const CAN = { pivot: { x: 900, y: 392 }, tilt: 45 };
/** In the can's own frame (around the pivot): the middle of the marble lying in the tin cup on top, and the rose at the spout's tip. */
export const CAN_CUP = { x: 50, y: -80 };
export const CAN_ROSE = { x: 158, y: -52 };
const atCan = (p: Pt, tilt: number) => turn({ x: CAN.pivot.x + p.x, y: CAN.pivot.y + p.y }, CAN.pivot, rad(tilt));
/** Where the marble lands: in the cup, under the end of the downpipe. */
export const CUP = atCan(CAN_CUP, 0);
const ROSE_POURING = atCan(CAN_ROSE, CAN.tilt);

/** The wheelbarrow, in its own frame around the axle of its wheel, facing right: the foot of its leg and the end of its handles. */
export const BARROW = { wheelR: 24, legX: -112, handle: { x: -200, y: -20 }, grip: 7 };
/** The arm on the water wheel's axle: from `start` degrees it turns backwards (anticlockwise) and meets the barrow's handles at `push`. */
export const ARM = { len: 115, knob: 9, start: -145, push: 55 };

/** The water wheel, right under the rose of the tipped can, high enough for its arm to reach the barrow's handles. */
export const WATERWHEEL = {
  cx: ROSE_POURING.x + 52,
  cy: TERRACE.y - BARROW.wheelR + BARROW.handle.y - ARM.len * Math.sin(rad(ARM.push)),
  r: 80,
};
/** Where the water from the can meets the paddles. */
const WATER_HIT_Y = WATERWHEEL.cy - Math.sqrt(WATERWHEEL.r ** 2 - (WATERWHEEL.cx - ROSE_POURING.x) ** 2);
const ARM_TIP = { x: WATERWHEEL.cx + ARM.len * Math.cos(rad(ARM.push)), y: WATERWHEEL.cy + ARM.len * Math.sin(rad(ARM.push)) };
/** The barrow's wheel at the start, its handles just touching the arm's knob. */
export const BARROW_START = { x: ARM_TIP.x + ARM.knob + BARROW.grip - BARROW.handle.x, y: TERRACE.y - BARROW.wheelR };

/** The rake lying in the grass, tines up: it turns around its head at (x, FLOOR - 5); `hit` is the angle at which its handle meets the apple tree's low branch. */
export const RAKE = { x: 2050, len: 260, tines: 40, tineAngle: -112, hit: -50 };
export const RAKE_PIVOT = { x: RAKE.x, y: FLOOR - 5 };
/** The end of the rake's handle when it is turned by `angle` degrees. */
export const rakeTip = (angle: number) => ({ x: RAKE_PIVOT.x + RAKE.len * Math.cos(rad(angle)), y: RAKE_PIVOT.y + RAKE.len * Math.sin(rad(angle)) });
const TINE_TIP = { x: RAKE_PIVOT.x + RAKE.tines * Math.cos(rad(RAKE.tineAngle)), y: RAKE_PIVOT.y + RAKE.tines * Math.sin(rad(RAKE.tineAngle)) };
/** The barrow's wheel touches the tines' tips here. */
const RAKE_CONTACT = TINE_TIP.x - Math.sqrt(BARROW.wheelR ** 2 - (FLOOR - BARROW.wheelR - TINE_TIP.y) ** 2);

/** The apple tree; its low branch reaches out left over the rake, just above where the rake's handle swings up to. */
export const TREE = { x: 2350, trunkW: 52, crownY: 540 };
export const LOW_BRANCH = { x0: 2150, y: rakeTip(RAKE.hit).y - 15, w: 18 };
/** The apple that falls: hanging under the crown, right above the slide. */
export const APPLE = { x: 2500, y: 582, r: 22 };

/** The slide, as the line the middle of the apple follows: down from the top to the run-out at `end`. */
export const SLIDE = { top: { x: 2470, y: 672 }, bottom: { x: 2760, y: 752 }, end: 2860 };
export const SLIDE_LINE = rounded([SLIDE.top, SLIDE.bottom, { x: SLIDE.end, y: SLIDE.bottom.y }], 60);
const slideY = (x: number) => SLIDE.top.y + ((x - SLIDE.top.x) * (SLIDE.bottom.y - SLIDE.top.y)) / (SLIDE.bottom.x - SLIDE.top.x);

export const CROQUET = { x: 3060, r: 32 };
export const HOOP = { x: 3300, h: 104 };

export const SHED = { x0: 3480, x1: 3900, wallTop: 540, roofTop: 420 };
/** The garden tap on the shed: its lever hangs down (shut) from the pivot, with a knob at the end; turned up, the water runs. */
export const TAP = { x: 3600, y: 650, lever: 112, knob: 12, open: 80 };
const KNOB_Y = TAP.y + TAP.lever;
/** The croquet ball touches the lever's knob here. */
const LEVER_CONTACT = TAP.x - Math.sqrt((CROQUET.r + TAP.knob) ** 2 - (FLOOR - CROQUET.r - KNOB_Y) ** 2);
/** How far the ball pushes the knob before the lever flips up on its own. */
const LEVER_PUSH = 18;

export const SPRINKLER = { x: 4160, headY: FLOOR - 120, arm: 56 };
/** The orange garden hose from the tap's spout along the grass to the sprinkler. */
export const HOSE = pathOf(
  quad({ x: TAP.x + 24, y: TAP.y + 40 }, { x: TAP.x + 24, y: FLOOR - 8 }, { x: TAP.x + 90, y: FLOOR - 8 }),
  line({ x: TAP.x + 90, y: FLOOR - 8 }, { x: SPRINKLER.x - 36, y: FLOOR - 8 }),
);

export const BED = { x0: 4270, x1: 4780 };
/** The sunflower grows out of the bed at x, up to its head at headY. */
export const SUN = { x: 4440, headY: 300 };
export const FENCE_TOP = 620;

/* ---------- Helpers ---------- */

/** Seconds into a free fall from rest until it has dropped `h`. */
const fallTime = (h: number) => Math.sqrt((2 * h) / GRAVITY);

/** Speed at the end of a run, from its last two steps. */
const endSpeed = (d: number[]) => (d[d.length - 1] - d[d.length - 2]) / STEP;

/** A spot along `path` at distance `d`, carrying on straight left of its start for d < 0. */
function alongOrBefore(path: Path, d: number): Pt {
  if (d >= 0) return along(path, d).pt;
  const p0 = path.pts[0];
  return { x: p0.x + d, y: p0.y };
}

/* ---------- The machine ---------- */

export type Garden = ReturnType<typeof buildGarden>;

export function buildGarden() {
  const { at, sorted } = timeline();

  /* The marble: out of the birdhouse, down the gutter under the wind chimes, round the downpipe into the cup. */
  const tMarble = 0.3;
  const door = { x: BIRDHOUSE.x, y: BIRDHOUSE.doorY };
  const onGutter = { x: BIRDHOUSE.x + 34, y: gutterY(BIRDHOUSE.x + 34) };
  const marblePath = pathOf(
    line(door, { x: door.x, y: door.y + 40 }),
    quad({ x: door.x, y: door.y + 40 }, { x: door.x + 2, y: gutterY(door.x) }, onGutter),
    line(onGutter, GUTTER.to),
    quad(GUTTER.to, { x: CUP.x, y: GUTTER.to.y + 6 }, { x: CUP.x, y: GUTTER.to.y + 44 }),
    line({ x: CUP.x, y: GUTTER.to.y + 44 }, CUP),
  );
  const marble = roll(marblePath, 0, 120, 480, 0.9);
  const tCup = tMarble + marble.duration;
  const chimeTimes = CHIMES.map((c) => tMarble + timeWhen(marble, (pt) => pt.x >= c.x - 10));
  at(tMarble, { sound: playPop });
  at(tMarble + 0.7, { sound: playTweet });
  chimeTimes.forEach((t, i) => at(t, { sound: () => playCountNote(7 - i) }));
  at(tMarble + timeWhen(marble, (pt) => pt.x >= GUTTER.to.x), { sound: playWhoosh });
  at(tCup, { sound: playClonk });

  /* The watering can tips forward and pours onto the water wheel. */
  const tFull = tCup + 0.7;
  const tiltAt = (t: number) => (t < tCup ? 0 : CAN.tilt * easeIn(seg(t, tCup + 0.1, tFull)) + wobble(t - tFull, 3, 14, 5));
  const roseAt = (t: number) => atCan(CAN_ROSE, tiltAt(t));
  const POUR_VX = 30;
  const POUR_VY = 60;
  /** A drop that left the rose at `te`, `age` seconds later; null once it has reached the wheel. */
  const pourDrop = (te: number, age: number): Pt | null => {
    const r = roseAt(te);
    const y = r.y + 12 + POUR_VY * age + 0.5 * GRAVITY * age * age;
    return y > WATER_HIT_Y ? null : { x: r.x + POUR_VX * age, y };
  };
  const fallToWheel = (-POUR_VY + Math.sqrt(POUR_VY ** 2 + 2 * GRAVITY * (WATER_HIT_Y - ROSE_POURING.y - 12))) / GRAVITY;
  const tPour = tFull - 0.1;
  const tWater = tPour + fallToWheel;
  at(tCup + 0.15, { sound: playCreak });
  at(tPour, { sound: playSplash });

  /* The water wheel turns backwards (anticlockwise) while the water falls on it; its arm comes round to the barrow. */
  const W_MAX = 1.6;
  const SPIN_UP = 0.6;
  const SPIN_DOWN = 1.5;
  const wheelTurnedAt = (t: number, tDry: number) => {
    // Radians turned: speeding up, steady while the water runs, then slowing down.
    const u = t - tWater;
    const b = tDry - tWater;
    if (u <= 0) return 0;
    if (u < SPIN_UP) return (W_MAX * u * u) / (2 * SPIN_UP);
    if (u < b) return W_MAX * (SPIN_UP / 2 + u - SPIN_UP);
    const v = Math.min(u - b, SPIN_DOWN);
    return W_MAX * (SPIN_UP / 2 + b - SPIN_UP + v - (v * v) / (2 * SPIN_DOWN));
  };
  const toPush = rad(ARM.start - (ARM.push - 360));
  let tPush = tWater;
  while (wheelTurnedAt(tPush, Infinity) < toPush) tPush += STEP;
  const tDry = tPush + 0.6;
  const wheelAt = (t: number) => -wheelTurnedAt(t, tDry);
  at(tWater, { sound: playDrops });
  at(tWater + 0.5, { sound: playCreak });
  at(tPush, { sound: () => playKnock(600) });

  /* The wheelbarrow: pushed over the edge, down the bank and onto the rake's tines. */
  const barrowGround = rounded([{ x: BARROW_START.x, y: TERRACE.y }, ...GROUND_CORNERS, { x: RAKE_CONTACT, y: FLOOR }], 30);
  const barrowEnd = { x: RAKE.x - 6, y: FLOOR - BARROW.wheelR - 8 };
  const barrowPath = pathOf(
    beside(barrowGround, -BARROW.wheelR),
    quad({ x: RAKE_CONTACT, y: FLOOR - BARROW.wheelR }, { x: RAKE_CONTACT + 16, y: FLOOR - BARROW.wheelR }, barrowEnd),
  );
  const barrow = roll(barrowPath, 170, 170, 560, 0.3);
  const tStop = tPush + barrow.duration;
  const tRake = tPush + timeWhen(barrow, (pt) => pt.x >= RAKE_CONTACT);
  at(tPush + 0.2, { sound: playRumble });
  at(tRake, { sound: () => playKnock(1300) });
  at(tStop, { sound: playThump });

  const barrowAt = (t: number): { pt: Pt; angle: number; turned: number } => {
    const d = t < tPush ? 0 : distAt(barrow, t - tPush);
    const pt = along(barrowPath, d).pt;
    const back = alongOrBefore(barrowPath, d + BARROW.legX);
    // Pushed by the handles, its leg lifts off the grass; when it bumps into the rake it sets down again.
    const lift = t < tPush ? 0 : t < tStop ? 6 * easeOut(seg(t, tPush, tPush + 0.3)) : 6 * (1 - easeIn(seg(t, tStop, tStop + 0.25)));
    return { pt, angle: Math.atan2(pt.y - back.y, pt.x - back.x) + rad(lift), turned: d };
  };

  /* The rake: the wheel presses its tines down, and the handle swings up against the apple tree's low branch. */
  const rakeAt = (t: number) => {
    const x = barrowAt(t).pt.x;
    return RAKE.hit * easeIn(seg(x, RAKE_CONTACT, barrowEnd.x)) + (t > tStop ? wobble(t - tStop, 2, 30, 8) : 0);
  };

  /* The apple tree shakes, and the apple drops onto the slide. */
  const SWAY = { amp: 3.5, freq: 14, damp: 2.2 };
  const swayAt = (t: number) => wobble(t - tStop, SWAY.amp, SWAY.freq, SWAY.damp);
  const tLoose = tStop + (5 * Math.PI) / SWAY.freq;
  const landY = slideY(APPLE.x);
  const tLand = tLoose + fallTime(landY - APPLE.y);
  at(tStop + 0.05, { sound: playLeaves });
  at(tLand, { sound: playPlop });

  const appleLine = rounded([{ x: APPLE.x, y: landY }, SLIDE.bottom, { x: SLIDE.end, y: SLIDE.bottom.y }], 60);
  const appleOnGrass = FLOOR - APPLE.r;
  const appleHit = CROQUET.x - CROQUET.r - APPLE.r;
  const applePath = pathOf(
    appleLine,
    quad({ x: SLIDE.end, y: SLIDE.bottom.y }, { x: SLIDE.end + 20, y: SLIDE.bottom.y }, { x: SLIDE.end + 44, y: appleOnGrass }),
    line({ x: SLIDE.end + 44, y: appleOnGrass }, { x: appleHit, y: appleOnGrass }),
  );
  // On landing, the part of its fall along the slide keeps it going.
  const slope = Math.atan2(SLIDE.bottom.y - SLIDE.top.y, SLIDE.bottom.x - SLIDE.top.x);
  const apple = roll(applePath, GRAVITY * fallTime(landY - APPLE.y) * Math.sin(slope), 150, 560, 0.25);
  const tBall = tLand + apple.duration;
  at(tLand + 0.3, { sound: playWhoosh });
  at(tBall, { sound: () => playKnock(1500) });

  const appleAt = (t: number): { pt: Pt; spin: number; hanging: boolean } => {
    if (t < tLoose) return { pt: turn(APPLE, { x: TREE.x, y: TREE.crownY }, rad(swayAt(t))), spin: 0, hanging: true };
    if (t < tLand) return { pt: { x: APPLE.x, y: APPLE.y + 0.5 * GRAVITY * (t - tLoose) ** 2 }, spin: 0, hanging: false };
    if (t < tBall) {
      const d = distAt(apple, t - tLand);
      return { pt: along(applePath, d).pt, spin: d / APPLE.r, hanging: false };
    }
    // It stops at the ball and rolls back a little.
    const back = 14 * easeOut(seg(t, tBall, tBall + 0.5));
    return { pt: { x: appleHit - back, y: appleOnGrass }, spin: (apple.path.total - back) / APPLE.r, hanging: false };
  };

  /* The croquet ball: through the hoop to the tap's lever. */
  const ballY = FLOOR - CROQUET.r;
  const ballPath = pathOf(line({ x: CROQUET.x, y: ballY }, { x: LEVER_CONTACT, y: ballY }));
  const ball = roll(ballPath, endSpeed(apple.d) * 0.85, 160, 600, 0.15);
  const tLever = tBall + ball.duration;
  const tSnap = tLever + 0.3;
  const tOpen = tSnap + 0.18;
  at(tBall + timeWhen(ball, (pt) => pt.x >= HOOP.x), { sound: playDing });
  at(tLever, { sound: () => playKnock(900) });
  at(tOpen, { sound: playClonk });

  const ballAt = (t: number): { pt: Pt; spin: number } => {
    const d = t < tBall ? 0 : t < tLever ? distAt(ball, t - tBall) : ballPath.total + LEVER_PUSH * easeOut(seg(t, tLever, tSnap));
    return { pt: { x: CROQUET.x + d, y: ballY }, spin: d / CROQUET.r };
  };

  /** How far the lever has turned, in degrees: positive swings its knob to the right. */
  const leverAt = (t: number) => {
    if (t < tLever) return 0;
    const pushed = (Math.asin(LEVER_PUSH / TAP.lever) * 180) / Math.PI;
    if (t < tSnap) return pushed * easeOut(seg(t, tLever, tSnap));
    return lerp(pushed, TAP.open, easeIn(seg(t, tSnap, tOpen))) + wobble(t - tOpen, 6, 22, 7);
  };

  /* Water runs through the hose, and the sprinkler starts turning and spraying. */
  const HOSE_T = 2.2;
  const tSpray = tOpen + 0.1 + HOSE_T;
  const hoseAt = (t: number) => easeInOut(seg(t, tOpen + 0.1, tSpray));
  at(tOpen + 0.1, { sound: playFlush });
  at(tSpray - 0.2, { sound: playBlub });
  at(tSpray, { sound: playSplash });

  const spinAt = (t: number) => {
    const u = t - tSpray;
    if (u <= 0) return 0;
    return u < 0.5 ? (9 * u * u) / (2 * 0.5) : 9 * (u - 0.25);
  };
  /** Every drop the sprinkler throws: from the end of its arm, in an arc to one side or the other. */
  const SPRAY_EVERY = 0.03;
  const sprayAt = (t: number): Pt[] => {
    const drops: Pt[] = [];
    // A drop is in the air for less than a second.
    const first = Math.ceil((t - 1 - tSpray - 0.15) / SPRAY_EVERY);
    for (let i = Math.max(0, first); ; i++) {
      const te = tSpray + 0.15 + i * SPRAY_EVERY;
      if (te > t) break;
      const age = t - te;
      const side = i % 2 ? 1 : -1;
      const vx = side * (250 + 160 * ((i * 0.618) % 1));
      const vy = -380 - 90 * ((i * 0.37) % 1);
      const y = SPRINKLER.headY + vy * age + 0.5 * GRAVITY * age * age;
      if (y > FLOOR - 6) continue;
      drops.push({ x: SPRINKLER.x + side * SPRINKLER.arm + vx * age, y });
    }
    return drops;
  };

  /* The sunflower grows in four spurts and opens: the finale. */
  const tGrow = tSpray + 2.6;
  const SPURTS = 4;
  const growAt = (t: number) => {
    let h = 0;
    for (let i = 0; i < SPURTS; i++) h += easeOut(seg(t, tGrow + i * 1.1, tGrow + i * 1.1 + 0.7));
    return h / SPURTS;
  };
  const tBloom = tGrow + SPURTS * 1.1 + 0.3;
  const bloomAt = (t: number) => {
    const k = seg(t, tBloom, tBloom + 0.7);
    // Opens a little too far, then settles.
    return k <= 0 ? 0 : easeOut(k) + 0.18 * Math.sin(k * Math.PI);
  };
  const tDone = tBloom + 2.4;
  at(tSpray + 0.9, { sound: playDrops });
  for (let i = 0; i < SPURTS; i++) at(tGrow + i * 1.1, { sound: () => playCountNote(i * 2) });
  at(tBloom, { sound: playPop });
  at(tBloom + 0.15, { sound: playTwinkle });
  at(tBloom + 0.4, {
    say: {
      de: "Juhu! Die Sonnenblume blüht!",
      en: "Yay! The sunflower is blooming!",
      zh: "好耶！向日葵开花啦！",
      hi: "वाह! सूरजमुखी खिल गया!",
      es: "¡Bien! ¡El girasol florece!",
      ar: "مرحى! زهرة عبّاد الشمس تتفتّح!",
      ru: "Ура! Подсолнух цветёт!",
    },
  });
  at(tBloom + 1.2, { sound: playTweet });
  at(tBloom + 1.6, { sound: playSniff });
  at(tBloom + 1.9, { sound: playTrill });
  at(tDone, { done: true });

  /** The two birds fly in from the right and sit on the fence. */
  const birdAt = (i: number, t: number): { pt: Pt; flying: boolean } => {
    const from = { x: SUN.x + 900 + i * 140, y: 120 + i * 60 };
    const to = { x: SUN.x + 210 + i * 110, y: FENCE_TOP - 6 };
    const t0 = tBloom + 0.1 + i * 0.25;
    const k = seg(t, t0, t0 + 1.1);
    return { pt: hop(from, to, -60, easeOut(k)), flying: k < 1 };
  };

  /** The butterfly flutters in and round the sunflower's head. */
  const butterflyAt = (t: number): Pt | null => {
    const u = t - tBloom - 0.2;
    if (u < 0) return null;
    const round = { x: SUN.x + 150 * Math.cos(1.7 * u), y: SUN.headY - 20 + 70 * Math.sin(3.4 * u) };
    const k = easeOut(seg(u, 0, 1));
    return { x: lerp(SUN.x - 520, round.x, k), y: lerp(FLOOR - 160, round.y, k) };
  };

  const events = sorted();

  /** Where the camera looks: the thing that moves right now. */
  const focusX = (t: number) => {
    if (t < 0) return 0;
    if (t < tCup) return along(marblePath, distAt(marble, t - tMarble)).pt.x;
    if (t < tPush) return (CAN.pivot.x + WATERWHEEL.cx) / 2 + 120;
    if (t < tStop) return Math.max(barrowAt(t).pt.x, 1100);
    if (t < tLand) return (RAKE.x + APPLE.x) / 2;
    if (t < tBall) return Math.max(appleAt(t).pt.x, (RAKE.x + APPLE.x) / 2);
    if (t < tLever) return ballAt(t).pt.x;
    if (t < tOpen) return TAP.x;
    if (t < tSpray) return TAP.x + HOSE.total * hoseAt(t);
    return SUN.x;
  };
  const cameraTarget = (t: number) => cameraOn(WORLD_W, focusX(t));

  return {
    events,
    duration: tDone,
    chimeTimes,
    tMarble,
    tCup,
    tPush,
    tStop,
    tSpray,
    tGrow,
    tBloom,
    marbleAt: (t: number): { pt: Pt; spin: number } => {
      if (t < tMarble) return { pt: door, spin: 0 };
      if (t < tCup) {
        const d = distAt(marble, t - tMarble);
        return { pt: along(marblePath, d).pt, spin: d / BALL_R };
      }
      return { pt: atCan(CAN_CUP, tiltAt(t)), spin: marblePath.total / BALL_R };
    },
    tiltAt,
    pourAt: (t: number): Pt[] => {
      const drops: Pt[] = [];
      for (let te = tPour; te <= Math.min(t, tDry); te += 0.03) {
        const p = pourDrop(te, t - te);
        if (p) drops.push(p);
      }
      return drops;
    },
    /** Whether water is splashing onto the wheel right now. */
    splashing: (t: number) => t > tWater && t < tDry + fallToWheel,
    waterHit: { x: ROSE_POURING.x + POUR_VX * fallToWheel, y: WATER_HIT_Y },
    wheelAt,
    barrowAt,
    rakeAt,
    swayAt,
    appleAt,
    ballAt,
    leverAt,
    hoseAt,
    spinAt,
    sprayAt,
    growAt,
    bloomAt,
    birdAt,
    butterflyAt,
    cameraTarget,
  };
}
