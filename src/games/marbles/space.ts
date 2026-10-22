// The rocket launch ("Raketenstart"), a Rube Goldberg machine on a toy space
// station at night: one tap lets a marble out of the satellite dish, and one
// thing sets off the next for about half a minute until the rocket lifts off.
// Everything is worked out ahead as a function of the seconds since the tap,
// so SpaceLevel.tsx only asks where each thing is at a moment. Coordinates are
// those of the launch site, 6000 × 900; the screen shows 1600 of it at a time.

import {
  playAlien,
  playBoing,
  playClonk,
  playCountNote,
  playCreak,
  playHiss,
  playHum,
  playKnock,
  playLaunch,
  playPing,
  playPoof,
  playPop,
  playRobot,
  playRumble,
  playThump,
  playTwinkle,
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
  GRAVITY,
  lerp,
  pathOf,
  rad,
  roll,
  rounded,
  seg,
  STEP,
  timeline,
  timeWhen,
} from "./machineKit";
import { arc, BALL_R, line, quad, type Pt } from "./track";

export const WORLD_W = 6000;
export const FLOOR = 800;

/* ---------- Layout ---------- */

/** The satellite dish the marble waits in, at (x, y); it drops out through a hole in the middle. */
export const DISH = { x: 170, y: 132, rx: 92 };

/** The rail with the glowing rings the marble rolls through. */
export const RAMP = { from: { x: 210, y: 250 }, to: { x: 880, y: 370 } };
export const rampY = (x: number) => RAMP.from.y + ((x - RAMP.from.x) * (RAMP.to.y - RAMP.from.y)) / (RAMP.to.x - RAMP.from.x);
export const RINGS = Array.from({ length: 6 }, (_, i) => ({ x: 330 + i * 92 }));

/**
 * The see-through pipe zigzagging from the rail down to the deck: right, round
 * a hairpin bend at `right`, back left, round a bend at `left`, and right again.
 * It is clamped to a metal panel standing on the deck behind it.
 */
export const PIPE = { right: 1110, left: 930, topA: 400, topB: 490, bend: 30 };
export const PANEL = { x0: 860, x1: 1170, top: 330 };

/** The metal deck the pipe's panel, the robot and the moon buggy stand on. */
export const DECK = { x0: 880, x1: 1720, y: 660 };

/** The robot, its middle at `cx`; the marble presses the red button sticking out of its back. */
export const ROBOT = { cx: 1330, half: 55, button: 14 };
/** The robot's front arm hangs from the shoulder and swings forward `push` degrees to nudge the buggy. */
export const ARM = { x: ROBOT.cx + 40, y: DECK.y - 100, len: 80, push: 58, hand: 12 };

/** The moon buggy, drawn around the middle between its wheels; the arm touches its back, its bumper the planet. */
export const BUGGY = { back: 80, nose: 82, bumper: 54, wheelR: 18, wheelX: 50 };
const BUGGY_MID0 = ARM.x + ARM.len * Math.sin(rad(ARM.push)) + ARM.hand + BUGGY.back;

/** Where the ramp from the deck meets the moon, and the little hills the buggy bumps over. */
export const DOWN = { x1: 2120 };
export const HILLS = [
  { x: 2480, w: 240, h: 40 },
  { x: 2840, w: 220, h: 34 },
  { x: 3200, w: 200, h: 26 },
];
/** The top of the moon's ground at `x`. */
export const groundY = (x: number) =>
  FLOOR - HILLS.reduce((up, h) => up + (Math.abs(x - h.x) < h.w / 2 ? (h.h * (1 + Math.cos((2 * Math.PI * (x - h.x)) / h.w))) / 2 : 0), 0);

/** The planet mobile hanging from the station truss; it turns round its cord. */
export const MOBILE = { cx: 3750, barY: 490, sun: { y: 552, r: 38 } };
/**
 * The planets on the mobile: how far out on the bars (R), how low they hang
 * (y), how big (r) and where they are at rest (radians; 0 is on the left, a
 * quarter turn on is nearest to us). The earth hangs lowest, where the buggy
 * bumps into it.
 */
export const PLANETS = [
  { kind: "earth", R: 150, y: FLOOR - 82, r: 40, at: 0 },
  { kind: "mars", R: 96, y: 652, r: 22, at: Math.PI / 2 },
  { kind: "saturn", R: 150, y: 596, r: 30, at: Math.PI },
  { kind: "moon", R: 96, y: 624, r: 17, at: (3 * Math.PI) / 2 },
] as const;
export type Planet = (typeof PLANETS)[number];

/** The switch for the magnet: a handle on a box, tilted `rest` degrees (left) until the earth knocks it over. */
export const LEVER = { x: 3950, y: FLOOR - 30, len: 64, knob: 13, rest: -28, flipped: 32 };
/** The middle of the lever's knob at `tilt` degrees. */
export const leverKnob = (tilt: number): Pt => ({ x: LEVER.x + LEVER.len * Math.sin(rad(tilt)), y: LEVER.y - LEVER.len * Math.cos(rad(tilt)) });

/** The space-station truss: a mast at `x` carrying a long beam with solar wings; the mobile hangs from its left end, the magnet from its right. */
export const TRUSS = { x: 4120, w: 70, jibY: 170, jibH: 26, jib0: 3670, jib1: 4640 };
/** The magnet's bottom, where the iron ball sticks. */
export const MAGNET = { x: 4560, y: 280 };
export const IRON = { r: 34 };

/** The countdown board with three lamps and a screen; the iron ball drops into the slot on its top, right under the magnet. */
export const BOARD = { x: 4480, y: 500, w: 380, h: 220 };
export const SLOT = { x: MAGNET.x, w: 100, h: 46 };

/** The launch tower and its arm, which reaches over to the rocket's window. */
export const TOWER = { x: 5280, w: 70, top: 230 };
export const ROCKET = { x: 5500, w: 130, h: 400, nose: 120, bottom: FLOOR - 44 };
export const PAD = { x0: 5360, x1: 5640 };
/** The window's middle, measured up from the rocket's bottom. */
export const WINDOW_UP = 30 + ROCKET.h * 0.72;
export const TOWER_ARM = { x: TOWER.x + TOWER.w / 2, y: ROCKET.bottom - WINDOW_UP };
/** The fuel tank and the hose to the rocket's side. */
export const TANK = { x: 5740, w: 120, h: 230 };
export const HOSE = {
  from: { x: TANK.x, y: FLOOR - 180 },
  plug: { x: ROCKET.x + ROCKET.w / 2 + 6, y: ROCKET.bottom - 200 },
  dropped: { x: 5660, y: FLOOR - 9 },
};
export const MOON = { x: 5060, y: 150, r: 70 };

/* ---------- Helpers ---------- */

/** Where a planet of the mobile is, the mobile turned by `spin` radians: `z` is 1 nearest to us, -1 furthest away. */
export function planetSpot(p: Planet, spin: number) {
  const a = p.at + spin;
  const z = Math.sin(a);
  return { x: MOBILE.cx - p.R * Math.cos(a), y: p.y, z, scale: 1 + 0.12 * z };
}

/* ---------- The machine ---------- */

export type Space = ReturnType<typeof buildSpace>;

export function buildSpace() {
  const { at, sorted } = timeline();

  /* The marble: out of the dish, through the glowing rings, zigzag down the pipe, along the deck into the robot. */
  const deckTop = DECK.y - BALL_R;
  const hitX = ROBOT.cx - ROBOT.half - ROBOT.button - BALL_R;
  const { right, left, topA, topB, bend } = PIPE;
  const pipe = [
    ...line(RAMP.to, { x: right, y: topA }),
    ...arc(right, topA + bend, bend, -90, 90),
    ...line({ x: right, y: topA + 2 * bend }, { x: left, y: topB }),
    ...arc(left, topB + bend, bend, 270, 90),
    ...rounded(
      [
        { x: left, y: topB + 2 * bend },
        { x: right + 20, y: deckTop },
        { x: PANEL.x1 + 10, y: deckTop },
      ],
      40,
    ),
  ];
  const marble = roll(
    pathOf(
      line(DISH, { x: DISH.x, y: 220 }),
      quad({ x: DISH.x, y: 220 }, { x: DISH.x + 1, y: RAMP.from.y - 4 }, RAMP.from),
      line(RAMP.from, RAMP.to),
      pipe,
      line({ x: PANEL.x1 + 10, y: deckTop }, { x: hitX, y: deckTop }),
    ),
    0,
    180,
    380,
  );
  const t0 = 0.15;
  const tRobot = t0 + marble.duration;
  const tPipe = t0 + timeWhen(marble, (pt) => pt.x >= RAMP.to.x);
  const tOut = t0 + timeWhen(marble, (pt) => pt.x > PANEL.x1);

  at(0, { sound: playPop });
  const ringTimes = RINGS.map((ring) => t0 + timeWhen(marble, (pt) => pt.x >= ring.x));
  ringTimes.forEach((t, i) => at(t, { sound: () => playCountNote(i) }));
  at(tPipe, { sound: playWhoosh });
  [topA + bend, topB + bend].forEach((y, i) => at(t0 + timeWhen(marble, (pt) => pt.y >= y), { sound: () => playKnock(1200 - i * 200) }));

  const marbleAt = (t: number): { pt: Pt; spin: number } => {
    if (t >= tRobot) {
      // It presses the robot's button and rolls back a little.
      const back = 26 * easeOut(seg(t, tRobot, tRobot + 0.6));
      return { pt: { x: hitX - back, y: deckTop }, spin: (hitX - back) / BALL_R };
    }
    if (t < t0) return { pt: DISH, spin: 0 };
    const pt = along(marble.path, distAt(marble, t - t0)).pt;
    return { pt, spin: pt.x / BALL_R };
  };

  /* The robot wakes up, swings its arm forward into the buggy, and waves it goodbye. */
  const tSwing = tRobot + 1.8;
  const tPush = tSwing + 0.45;
  at(tRobot, { sound: () => playKnock(1500) });
  at(tRobot + 0.25, { sound: playRobot });
  at(tPush, { sound: () => playKnock(900) });
  const frontArm = (t: number) => {
    if (t < tPush) return ARM.push * easeIn(seg(t, tSwing, tPush));
    if (t < tPush + 0.3) return lerp(ARM.push, ARM.push + 18, easeOut(seg(t, tPush, tPush + 0.3)));
    return lerp(ARM.push + 18, 0, easeInOut(seg(t, tPush + 0.5, tPush + 1.1)));
  };
  const backArm = (t: number) => {
    const u = t - tPush - 0.3;
    if (u < 0) return 0;
    return lerp(0, 145, easeOut(seg(u, 0, 0.4))) * (1 - easeInOut(seg(u, 2.2, 2.7))) + 22 * Math.sin(u * 11) * seg(u, 0.3, 0.6) * (1 - seg(u, 2, 2.3));
  };

  /* The moon buggy: off the deck, down the ramp and over three hills into the earth of the mobile. */
  const earth = PLANETS[0];
  const bumperY = FLOOR - BUGGY.bumper - earth.y;
  const buggyStop = MOBILE.cx - earth.R - Math.sqrt(earth.r ** 2 - bumperY ** 2) - BUGGY.nose;
  const groundFrom = DOWN.x1 + 100;
  const buggyPath = pathOf(
    rounded(
      [
        { x: BUGGY_MID0, y: DECK.y },
        { x: DECK.x1, y: DECK.y },
        { x: DOWN.x1, y: FLOOR },
        { x: groundFrom, y: FLOOR },
      ],
      40,
    ),
    Array.from({ length: Math.ceil((buggyStop - groundFrom) / 8) + 1 }, (_, i) => {
      const x = Math.min(buggyStop, groundFrom + i * 8);
      return { x, y: groundY(x) };
    }),
  );
  const buggy = roll(buggyPath, 170, 170, 480, 0.3);
  const tBump = tPush + buggy.duration;
  const tDown = tPush + timeWhen(buggy, (pt) => pt.x >= DECK.x1);
  const tFloor = tPush + timeWhen(buggy, (pt) => pt.x >= DOWN.x1);
  const crestTimes = HILLS.map((h) => tPush + timeWhen(buggy, (pt) => pt.x >= h.x));
  at(tPush + 0.3, { sound: playAlien });
  at(tDown, { sound: playWhoosh });
  crestTimes.forEach((t) => at(t, { sound: playBoing }));

  const buggyAt = (t: number): { pt: Pt; angle: number; turned: number; bob: number } => {
    const bob = wobble(t - tFloor, 6, 20, 5) + crestTimes.reduce((sum, tc) => sum + wobble(t - tc, 7, 18, 5), 0);
    if (t < tPush) return { pt: { x: BUGGY_MID0, y: DECK.y }, angle: 0, turned: 0, bob: 0 };
    if (t < tBump) {
      const d = distAt(buggy, t - tPush);
      const { pt, angle } = along(buggyPath, d);
      return { pt, angle, turned: d, bob };
    }
    // It bumps into the earth and rolls back a little.
    const back = 30 * easeOut(seg(t, tBump, tBump + 0.7));
    return { pt: { x: buggyStop - back, y: FLOOR }, angle: 0, turned: buggyPath.total - back, bob: bob + wobble(t - tBump, 5, 22, 6) };
  };

  /* The mobile turns; half a turn on, the earth comes round and knocks the lever over. */
  const SPIN = 2.4 * Math.PI;
  const SPIN_SLOW = 3.4;
  const spinAt = (t: number) => (t < tBump ? 0 : SPIN * (1 - Math.exp(-(t - tBump) / SPIN_SLOW)));
  const knob0 = leverKnob(LEVER.rest);
  let u = 0;
  for (; u < 6; u += STEP) {
    const e = planetSpot(earth, spinAt(tBump + u));
    if (Math.hypot(e.x - knob0.x, e.y - knob0.y) <= earth.r * e.scale + LEVER.knob) break;
  }
  const tLever = tBump + u;
  at(tBump, { sound: () => playKnock(1300) });
  at(tBump + 0.15, { sound: playTwinkle });
  at(tLever, { sound: playClonk });
  const leverTilt = (t: number) =>
    t < tLever ? LEVER.rest : lerp(LEVER.rest, LEVER.flipped, easeOut(seg(t, tLever, tLever + 0.16))) + wobble(t - tLever - 0.16, 5, 22, 6);

  /* The lever switches the magnet off: the iron ball drops into the slot on top of the countdown board, which wakes up. */
  const tOff = tLever + 0.2;
  const tDrop = tOff + 0.12;
  const iron0 = { x: MAGNET.x, y: MAGNET.y + IRON.r };
  const ironIn = BOARD.y + 40;
  const fall = (y: number) => tDrop + Math.sqrt((2 * (y - iron0.y)) / GRAVITY);
  const tSlot = fall(BOARD.y - SLOT.h + IRON.r);
  const tIn = fall(ironIn);
  const tWake = tIn + 0.25;
  at(tOff, { sound: playPoof });
  at(tSlot, { sound: () => playKnock(600) });
  at(tIn, { sound: playThump });
  at(tWake, { sound: playHum });

  const ironAt = (t: number): Pt => (t < tDrop ? iron0 : { x: iron0.x, y: Math.min(ironIn, iron0.y + 0.5 * GRAVITY * (t - tDrop) ** 2) });

  /* The countdown: 3 – the hose lets go, 2 – the tower's arm swings away, 1 – the engine lights, start! */
  const tCount = [tWake + 1.5, tWake + 3.1, tWake + 4.7];
  const tLift = tWake + 6.3;
  const tHose = tCount[0] + 0.45;
  const tArm = tCount[1] + 0.35;
  const tIgnite = tCount[2] + 0.4;
  const tDone = tLift + 2.8;
  ["Drei!", "Zwei!", "Eins!"].forEach((word, i) => {
    at(tCount[i], { sound: playPing });
    at(tCount[i] + 0.05, { say: word });
  });
  at(tHose, { sound: playHiss });
  at(tArm, { sound: playCreak });
  at(tIgnite, { sound: playRumble });
  at(tLift, { sound: playLaunch });
  at(tLift + 0.05, { say: "Start! Die Rakete fliegt zum Mond!" });
  at(tLift + 1.2, { sound: playTwinkle });
  at(tLift + 1.8, { sound: playTwinkle });
  at(tDone, { done: true });

  /** How far the countdown is: 0 before it starts, then 1, 2, 3 for „3, 2, 1“ and 4 for „Start!“. */
  const countAt = (t: number) => (t >= tLift ? 4 : tCount.filter((tc) => t >= tc).length);
  /** 0 while the hose is plugged into the rocket, 1 once it lies on the ground. */
  const hoseDrop = (t: number) => easeIn(seg(t, tHose, tHose + 0.6));
  /** The tower arm's angle: 0 at the rocket's window, -95 folded up. */
  const armAngle = (t: number) => -95 * easeInOut(seg(t, tArm, tArm + 1.1));
  /** How far the rocket has risen. */
  const rocketRise = (t: number) => 1400 * easeIn(seg(t, tLift, tLift + 2.6));
  /** How big the flame is: a small flicker once the engine lights, full size once it lifts off. */
  const flameAt = (t: number) => (t < tIgnite ? 0 : t < tLift ? 0.35 * easeOut(seg(t, tIgnite, tIgnite + 0.4)) : lerp(0.35, 1, easeOut(seg(t, tLift, tLift + 0.4))));

  /** Where the camera looks: the thing that moves right now. */
  const focusX = (t: number) => {
    if (t < 0) return 0;
    if (t < tPipe) return marbleAt(t).pt.x;
    if (t < tOut) return (PANEL.x0 + PANEL.x1) / 2;
    if (t < tRobot) return marbleAt(t).pt.x;
    if (t < tPush) return ROBOT.cx + 100;
    if (t < tBump) return buggyAt(t).pt.x;
    if (t < tLever) return MOBILE.cx + 120;
    if (t < tWake) return (LEVER.x + MAGNET.x) / 2;
    return ROCKET.x;
  };
  const cameraTarget = (t: number) => cameraOn(WORLD_W, focusX(t));

  return {
    events: sorted(),
    duration: tDone,
    pipe,
    buggyPath,
    ringTimes,
    tRobot,
    tPush,
    tBump,
    tLever,
    tOff,
    tWake,
    tCount,
    tIgnite,
    tLift,
    marbleAt,
    frontArm,
    backArm,
    buggyAt,
    spinAt,
    leverTilt,
    ironAt,
    countAt,
    hoseDrop,
    armAngle,
    rocketRise,
    flameAt,
    cameraTarget,
  };
}
