// The rocket launch ("Raketenstart"), a Rube Goldberg machine on a toy space
// station at night: one tap lets a marble out of the satellite dish, and one
// thing sets off the next for about a minute until the rocket lands on the
// moon – the marble wakes the robot, the robot pushes the moon buggy against
// the intercom of a glass dome, a space kangaroo hops out onto the pedal of a
// radio mast, whose waves wake a satellite, the satellite drops a capsule on a
// parachute, the capsule's puff of air sets the planet mobile turning, the
// earth bonks the telescope, which spins round and points at the sky, a UFO
// comes to have a look, beams up a moon rock and drops it onto the switch, the
// magnet lets go of its iron ball and the countdown begins. Everything is
// worked out ahead as a function of the seconds since the tap, so
// SpaceLevel.tsx only asks where each thing is at a moment. Coordinates are
// those of the launch site, 8350 × 900; the screen shows 1600 of it at a time.

import {
  playAlien,
  playBeam,
  playBeeps,
  playBoing,
  playClick,
  playClimbNote,
  playClonk,
  playCountNote,
  playCreak,
  playDoorbell,
  playHiss,
  playHop,
  playHum,
  playKnock,
  playPing,
  playPlop,
  playPoof,
  playPop,
  playPuff,
  playRobot,
  playRumble,
  playSlide,
  playThump,
  playTrill,
  playTwinkle,
  playWhirr,
  playWhoosh,
} from "@/lib/sfx";
import { playGiggle, playLaunch } from "@/lib/realSounds";
import { wobble } from "./level";
import {
  along,
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
} from "./machineKit";
import { arc, BALL_R, line, quad, type Pt } from "./path";

/** How far everything from the planet mobile on stands right of where it stood before the dome, the radio mast and the satellite came. */
const GAP = 1450;

export const WORLD_W = 6900 + GAP;
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

/**
 * The intercom on its post left of the glass dome, a box with a lamp and a
 * speaker grille on top: the buggy's bumper presses the round button sticking
 * out of the post's left side, `r` its radius, at the bumper's height.
 */
export const INTERCOM = { x: 3550, r: 12, post: 16, h: 150, y: FLOOR - 53 };
/** The glass dome where the space kangaroo dozes, its middle at `x` on the ground, and the tunnel out to its hatch at `x1`, `door` high. */
export const HUT = { x: 3760, r: 150, tunnel0: 3880, x1: 3970, door: 124 };
/** The radio mast: its antenna's tip at (x, top), three lamps up the mast and the foot pedal left of it. */
export const RADIO = { x: 4640, top: 300, pedal: 4560, pedalW: 76, pedalH: 24, press: 10 };
export const RADIO_LAMPS = [FLOOR - 140, FLOOR - 270, FLOOR - 400];
/** The space kangaroo: where its feet stand inside the dome, outside the hatch, after each hop and on the pedal. */
export const KANGAROO_SPOTS: Pt[] = [
  { x: HUT.x - 30, y: FLOOR },
  { x: HUT.x1 + 50, y: FLOOR },
  { x: HUT.x1 + 230, y: FLOOR },
  { x: HUT.x1 + 410, y: FLOOR },
  { x: RADIO.pedal, y: FLOOR - RADIO.pedalH },
];

/** The planet mobile hanging from the station truss; it turns round its cord. */
export const MOBILE = { cx: 3750 + GAP, barY: 490, sun: { y: 552, r: 38 } };
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

/**
 * The telescope on its tripod, looking down at the mobile: it turns round its
 * `pivot`, the objective `front` ahead of it (at `rest` degrees, 0 is to the
 * right and 90 down) and the eyepiece `back` behind. The earth bonks the
 * objective, and the telescope swings down and round until it points up at
 * the sky (`sky`), wobbling. It swings the way the push sends it and never
 * comes round to the left again, where the earth is still turning.
 */
export const SCOPE = { pivot: { x: 4024 + GAP, y: 652 }, front: 120, back: 50, lens: 16, rest: 150, sky: -40 };
/** The objective's middle, the telescope turned to `angle` degrees. */
export const scopeTip = (angle: number): Pt => ({
  x: SCOPE.pivot.x + SCOPE.front * Math.cos(rad(angle)),
  y: SCOPE.pivot.y + SCOPE.front * Math.sin(rad(angle)),
});

/** The moon rock lying on the ground, which the UFO beams up; `r` is about its radius. */
export const ROCK = { x: 4270 + GAP, r: 22 };
/** The UFO's spot above the moon rock, where it hovers while it beams it up. */
export const UFO_HOVER = { x: ROCK.x, y: 430 };
/** How far below the UFO's middle its beam starts, and how far below that the moon rock hangs in the beam. */
export const UFO_BELOW = 22;
export const ROCK_HANG = 70;

/** How far the parts from the switch on stand right of where they stood before the telescope and the UFO came. */
const MOVED = 900 + GAP;

/** The switch for the magnet: a handle on a box, tilted `rest` degrees (left) until the moon rock knocks it down flat. */
export const LEVER = { x: 3950 + MOVED, y: FLOOR - 30, len: 64, knob: 13, rest: -28, flipped: -76 };
/** The middle of the lever's knob at `tilt` degrees. */
export const leverKnob = (tilt: number): Pt => ({ x: LEVER.x + LEVER.len * Math.sin(rad(tilt)), y: LEVER.y - LEVER.len * Math.cos(rad(tilt)) });

/** The space-station truss: a mast at `x` carrying a long beam with solar wings; the mobile hangs from its left end, the magnet from its right. */
export const TRUSS = { x: 4120 + MOVED, w: 70, jibY: 170, jibH: 26, jib0: 3670 + GAP, jib1: 4640 + MOVED };
/** The magnet's bottom, where the iron ball sticks. */
export const MAGNET = { x: 4560 + MOVED, y: 280 };
export const IRON = { r: 34 };

/** The countdown board with three lamps and a screen; the iron ball drops into the slot on its top, right under the magnet. */
export const BOARD = { x: 4480 + MOVED, y: 500, w: 380, h: 220 };
export const SLOT = { x: MAGNET.x, w: 100, h: 46 };

/** The launch tower and its arm, which reaches over to the rocket's window. */
export const TOWER = { x: 5280 + MOVED, w: 70, top: 230 };
export const ROCKET = { x: 5500 + MOVED, w: 130, h: 400, nose: 120, bottom: FLOOR - 44 };
export const PAD = { x0: 5360 + MOVED, x1: 5640 + MOVED };
/** The window's middle, measured up from the rocket's bottom. */
export const WINDOW_UP = 30 + ROCKET.h * 0.72;
export const TOWER_ARM = { x: TOWER.x + TOWER.w / 2, y: ROCKET.bottom - WINDOW_UP };
/** The fuel tank and the hose to the rocket's side. */
export const TANK = { x: 5740 + MOVED, w: 120, h: 230 };
export const HOSE = {
  from: { x: TANK.x, y: FLOOR - 180 },
  plug: { x: ROCKET.x + ROCKET.w / 2 + 6, y: ROCKET.bottom - 200 },
  dropped: { x: 5660 + MOVED, y: FLOOR - 9 },
};
/** The moon in the sky, low enough that the rocket, small far away, can be seen landing on it. */
export const MOON = { x: 5060 + MOVED, y: 250, r: 70 };

/* ---------- The satellite and its capsule ---------- */

/** Where the capsule lands: left of the earth hanging at rest, with room for its puff of air. */
export const CAPSULE_X = MOBILE.cx - PLANETS[0].R - PLANETS[0].r - 110;
/** The sleeping satellite in the sky, right above where its capsule lands; `wing` is how far its solar wings reach out. */
export const SAT = { x: CAPSULE_X, y: 170, wing: 120 };
/** The capsule: half its width, its height, and where its puff nozzle sits on its right side (up from the ground). */
export const CAPSULE = { half: 30, h: 64, nozzle: 30 };

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

  /* The moon buggy: off the deck, down the ramp and over three hills against the intercom of the glass dome. */
  const earth = PLANETS[0];
  const buggyStop = INTERCOM.x - INTERCOM.post / 2 - 2 * INTERCOM.r - BUGGY.nose;
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
    // It bumps into the intercom button and rolls back a little.
    const back = 30 * easeOut(seg(t, tBump, tBump + 0.7));
    return { pt: { x: buggyStop - back, y: FLOOR }, angle: 0, turned: buggyPath.total - back, bob: bob + wobble(t - tBump, 5, 22, 6) };
  };

  /* The bumper presses the intercom button, which chimes; in the glass dome the space kangaroo wakes, its hatch slides up and it comes out. */
  const tPerk = tBump + 0.6;
  const tDoor = tBump + 1.3;
  const tExit = tDoor + 0.6;
  const OUT_S = 1.3;
  at(tBump, { sound: () => playKnock(1300) });
  at(tBump + 0.1, { sound: playDoorbell });
  at(tPerk, { sound: playTrill });
  at(tDoor, { sound: playSlide });
  /** How far the hatch at the tunnel's end is open: 0 shut, 1 slid all the way up. */
  const hatchAt = (t: number) => easeInOut(seg(t, tDoor, tDoor + 0.5));

  /* Three big, floaty hops along the moon, the last one onto the pedal at the foot of the radio mast. */
  const HOP_S = 1.2;
  const HOP_PAUSE = 0.25;
  const hopTimes = [0, 1, 2].map((i) => tExit + OUT_S + 0.3 + i * (HOP_S + HOP_PAUSE));
  const tPedal = hopTimes[2] + HOP_S;
  hopTimes.forEach((t) => at(t, { sound: () => playHop(HOP_S) }));
  at(tPedal + 0.02, { sound: playClonk });
  /** The kangaroo: where its feet are, whether it is awake, how far it crouches (0–1) and how far it leans into a hop (degrees). */
  const kangarooAt = (t: number): { pt: Pt; awake: boolean; crouch: number; lean: number } => {
    const [inside, outside] = KANGAROO_SPOTS;
    const awake = t >= tPerk;
    if (t < tExit) return { pt: inside, awake, crouch: awake ? 0 : 1, lean: 0 };
    if (t < tExit + OUT_S) {
      // Little steps through the tunnel, low enough to keep its ears in it.
      const k = seg(t, tExit, tExit + OUT_S);
      return { pt: { x: lerp(inside.x, outside.x, easeInOut(k)), y: FLOOR - 6 * Math.abs(Math.sin(3 * Math.PI * k)) }, awake, crouch: 0, lean: 6 };
    }
    for (let i = 2; i >= 0; i--) {
      if (t < hopTimes[i]) continue;
      const from = KANGAROO_SPOTS[i + 1];
      const to = KANGAROO_SPOTS[i + 2];
      const k = seg(t, hopTimes[i], hopTimes[i] + HOP_S);
      const since = t - hopTimes[i] - HOP_S;
      // Its feet sink with the pedal once it stands on it.
      const press = i === 2 && since >= 0 ? RADIO.press * easeOut(seg(since, 0, 0.12)) : 0;
      const crouch = since >= 0 ? Math.max(0, 1 - since / 0.25) : k < 0.15 ? 1 - k / 0.15 : 0;
      const pt = k < 1 ? hop(from, to, 200, easeInOut(k)) : { x: to.x, y: to.y + press };
      return { pt, awake, crouch, lean: k < 1 ? 18 * Math.sin(Math.PI * k) : 0 };
    }
    // Waiting outside the hatch, crouched for its first hop.
    return { pt: outside, awake, crouch: seg(t, hopTimes[0] - 0.25, hopTimes[0]), lean: 0 };
  };
  /** How far the pedal is pressed down: 0–1. */
  const pedalAt = (t: number) => easeOut(seg(t, tPedal, tPedal + 0.12));

  /* The pedal lights the mast's lamps from the bottom up; its antenna sends three radio waves up to the satellite. */
  const lampTimes = RADIO_LAMPS.map((_, i) => tPedal + 0.3 + i * 0.3);
  lampTimes.forEach((t, i) => at(t, { sound: () => playClimbNote(i * 2) }));
  const WAVE_S = 1.0;
  const waveTimes = [0, 1, 2].map((i) => lampTimes[2] + 0.3 + i * 0.5);
  at(waveTimes[0], { sound: playBeeps });
  const antenna = { x: RADIO.x, y: RADIO.top };
  /** The radio waves on their way: where each arc's middle is, and how far it has gone (0–1). */
  const waveAt = (t: number) =>
    waveTimes
      .filter((tw) => t >= tw && t < tw + WAVE_S)
      .map((tw) => {
        const k = seg(t, tw, tw + WAVE_S);
        return { pt: { x: lerp(antenna.x, SAT.x, k), y: lerp(antenna.y, SAT.y, k) }, k };
      });

  /* The last wave wakes the satellite: it opens its eyes and its solar wings, then lets its capsule go. */
  const tSatWake = waveTimes[2] + WAVE_S;
  const tCapsule = tSatWake + 1.2;
  at(tSatWake, { sound: playPing });
  at(tSatWake + 0.15, { sound: playWhirr });
  at(tCapsule, { sound: playPop });
  /** The satellite: awake or asleep, and how far its wings have unfolded (0–1). */
  const satAt = (t: number) => ({ awake: t >= tSatWake, wings: easeInOut(seg(t, tSatWake + 0.15, tSatWake + 0.95)) });

  /* The capsule falls, its striped parachute opens and it floats down, swaying, to land beside the mobile. */
  const tChute = tCapsule + 0.4;
  const tLand = tChute + 4.2;
  at(tChute, { sound: playWhoosh });
  at(tLand, { sound: playThump });
  const held = { x: SAT.x, y: SAT.y + 30 + CAPSULE.h };
  const chuteFrom = { x: held.x, y: held.y + 0.5 * GRAVITY * (tChute - tCapsule) ** 2 };
  const landed = { x: CAPSULE_X, y: FLOOR };
  /** The capsule: the middle of its bottom, how far its parachute is open (0–1) and how far it sways (degrees). */
  const capsuleAt = (t: number): { pt: Pt; chute: number; sway: number } => {
    if (t < tCapsule) return { pt: held, chute: 0, sway: 0 };
    if (t < tChute) return { pt: { x: held.x, y: held.y + 0.5 * GRAVITY * (t - tCapsule) ** 2 }, chute: 0, sway: 0 };
    if (t < tLand) {
      const k = seg(t, tChute, tLand);
      const swing = Math.sin(k * 3 * Math.PI) * (1 - k);
      return {
        pt: { x: landed.x + 40 * swing, y: lerp(chuteFrom.y, landed.y, easeOut(k) * 0.4 + k * 0.6) },
        chute: easeOut(seg(t, tChute, tChute + 0.3)),
        sway: 10 * swing,
      };
    }
    // Landed, the parachute sinks down behind it.
    return { pt: landed, chute: 1 - easeIn(seg(t, tLand, tLand + 0.8)), sway: 0 };
  };

  /* A puff of air from the capsule's nozzle pushes the earth, and the mobile starts to turn. */
  const tPuff = tLand + 0.9;
  const tSpin = tPuff + 0.4;
  at(tPuff, { sound: playPuff });
  const nozzle = { x: CAPSULE_X + CAPSULE.half, y: FLOOR - CAPSULE.nozzle };
  const earthLeft = { x: planetSpot(earth, 0).x - earth.r, y: earth.y };
  /** The puff of air on its way to the earth: its middle, its size and how faded it is (null when there is none). */
  const puffAt = (t: number) => {
    if (t < tPuff || t >= tSpin + 0.5) return null;
    const k = seg(t, tPuff, tSpin);
    return {
      pt: { x: lerp(nozzle.x, earthLeft.x - 10, easeOut(k)), y: lerp(nozzle.y, earthLeft.y, easeOut(k)) },
      size: lerp(0.4, 1, k),
      fade: seg(t, tSpin, tSpin + 0.5),
    };
  };

  /* The mobile turns; half a turn on, the earth comes round and bonks the telescope's objective. */
  const SPIN = 2.4 * Math.PI;
  const SPIN_SLOW = 3.4;
  const spinAt = (t: number) => (t < tSpin ? 0 : SPIN * (1 - Math.exp(-(t - tSpin) / SPIN_SLOW)));
  const tip0 = scopeTip(SCOPE.rest);
  let u = 0;
  for (; u < 6; u += STEP) {
    const e = planetSpot(earth, spinAt(tSpin + u));
    if (Math.hypot(e.x - tip0.x, e.y - tip0.y) <= earth.r * e.scale + SCOPE.lens) break;
  }
  const tScope = tSpin + u;
  at(tSpin, { sound: () => playKnock(1300) });
  at(tSpin + 0.15, { sound: playTwinkle });

  /* The telescope swings down and round, overshoots, wobbles and stays pointing at the sky; its lens glints. */
  const SCOPE_SPIN = 1.4;
  const tSettle = tScope + SCOPE_SPIN;
  const tGlint = tSettle + 0.3;
  at(tScope, { sound: playBoing });
  at(tScope + 0.05, { sound: playWhirr });
  at(tSettle, { sound: playClick });
  at(tGlint, { sound: playTwinkle });
  /** The telescope's angle in degrees (0 to the right, 90 down). */
  const scopeAngle = (t: number) => (t < tScope ? SCOPE.rest : lerp(SCOPE.rest, SCOPE.sky, easeOut(seg(t, tScope, tSettle))) - wobble(t - tSettle, 14, 12, 3));

  /*
   * A UFO saw it: it comes floating in from far away where the telescope
   * points (small, growing as it comes near), hovers over the moon rock, beams
   * it up, carries it to the switch and drops it onto the knob; then its alien
   * waves and it zooms off.
   */
  const SKY_DIR = rad(SCOPE.sky);
  const far = { x: SCOPE.pivot.x + 600 * Math.cos(SKY_DIR), y: SCOPE.pivot.y + 600 * Math.sin(SKY_DIR) };
  const tAppear = tGlint + 0.6;
  const tArrive = tAppear + 3.6;
  const tBeam = tArrive + 1.5;
  const tLift0 = tBeam + 0.4;
  const tGrab = tLift0 + 2;
  const tCarry = tGrab + 0.3;
  const tOver = tCarry + 3.2;
  const tRelease = tOver + 0.4;
  const tLeave = tRelease + 1.6;
  const tGone = tLeave + 1.6;
  const knob0 = leverKnob(LEVER.rest);
  const away = { x: LEVER.x + 700, y: -160 };

  /** The UFO's middle and size along its way, without the tilt. */
  const ufoSpot = (t: number): { pt: Pt; scale: number } => {
    if (t < tArrive) {
      // A swoop in from far away: an S-curve sideways, a little hop up, growing as it comes near.
      const e = easeInOut(seg(t, tAppear, tArrive));
      return {
        pt: { x: lerp(far.x, UFO_HOVER.x, e) + 140 * Math.sin(2 * Math.PI * e) * (1 - e), y: lerp(far.y, UFO_HOVER.y, e) - 70 * Math.sin(Math.PI * e) },
        scale: lerp(0.18, 1, e),
      };
    }
    const bob = 5 * Math.sin((t - tArrive) * 5);
    if (t < tLeave) {
      const k = easeInOut(seg(t, tCarry, tOver));
      return { pt: { x: lerp(UFO_HOVER.x, knob0.x, k), y: UFO_HOVER.y - 30 * Math.sin(Math.PI * k) + bob }, scale: 1 };
    }
    const k = easeIn(seg(t, tLeave, tGone));
    const from = ufoSpot(tLeave - 1e-6).pt;
    return { pt: { x: lerp(from.x, away.x, k), y: lerp(from.y, away.y, k) }, scale: lerp(1, 0.2, k) };
  };
  /** The UFO while it is there (null before it comes and after it has gone): middle, size, tilt (degrees), and how its alien looks and waves. */
  const ufoAt = (t: number) => {
    if (t < tAppear || t >= tGone) return null;
    const { pt, scale } = ufoSpot(t);
    // It leans into the way it goes, as a flying saucer does.
    const vx = (ufoSpot(t + 0.02).pt.x - ufoSpot(t - 0.02).pt.x) / 0.04;
    const tilt = Math.max(-18, Math.min(18, vx / 30));
    const waving = (t >= tArrive && t < tBeam - 0.2) || t >= tRelease + 0.2;
    /** Where the alien's eye looks: at the telescope while it comes, at the moon rock while it beams, at us when it waves. */
    const look: Pt = waving ? { x: 0, y: 0 } : t < tArrive ? { x: -1, y: 0.6 } : { x: 0, y: 1 };
    return { pt, scale, tilt, waving, look };
  };
  /** How bright the UFO's beam is: 0 off, 1 on. */
  const beamAt = (t: number) => (t < tBeam ? 0 : t < tRelease ? easeOut(seg(t, tBeam, tBeam + 0.3)) : 1 - seg(t, tRelease, tRelease + 0.2));

  /* The moon rock: trembles in the beam, floats up, hangs under the UFO, falls onto the knob and bounces off to the left. */
  const rockGround = { x: ROCK.x, y: FLOOR - ROCK.r };
  const hangAt = (t: number): Pt => {
    const { pt } = ufoSpot(t);
    return { x: pt.x, y: pt.y + UFO_BELOW + ROCK_HANG + 4 * Math.sin(t * 6) };
  };
  const dropFrom = hangAt(tRelease);
  const hitY = knob0.y - LEVER.knob - ROCK.r;
  const tLever = tRelease + Math.sqrt((2 * (hitY - dropFrom.y)) / GRAVITY);
  const rockRest = { x: knob0.x - 120, y: FLOOR - ROCK.r };
  const tRest = tLever + 0.7;
  /** Where the moon rock is and how far it has turned (degrees). */
  const rockAt = (t: number): { pt: Pt; spin: number } => {
    if (t < tLift0) return { pt: { x: rockGround.x + (t >= tBeam ? 3 * Math.sin(t * 45) : 0), y: rockGround.y }, spin: 0 };
    if (t < tGrab) {
      const k = easeInOut(seg(t, tLift0, tGrab));
      const top = hangAt(t);
      return { pt: { x: lerp(rockGround.x, top.x, k), y: lerp(rockGround.y, top.y, k) }, spin: 200 * k };
    }
    if (t < tRelease) return { pt: hangAt(t), spin: 200 + 60 * (t - tGrab) };
    const spinOff = 200 + 60 * (tRelease - tGrab);
    if (t < tLever) return { pt: { x: dropFrom.x, y: dropFrom.y + 0.5 * GRAVITY * (t - tRelease) ** 2 }, spin: spinOff };
    const k = seg(t, tLever, tRest);
    return { pt: hop({ x: dropFrom.x, y: hitY }, rockRest, 50, k), spin: spinOff - 360 * k };
  };

  at(tAppear, { sound: playAlien });
  at(tAppear + 0.1, {
    say: {
      de: "Oh, ein Ufo!",
      en: "Oh, a UFO!",
      zh: "哇，一个飞碟！",
      hi: "अरे, एक उड़न तश्तरी!",
      es: "¡Oh, un ovni!",
      ar: "أوه، صحن طائر!",
      ru: "Ой, летающая тарелка!",
    },
  });
  at(tAppear + 0.5, { sound: playWhoosh });
  at(tArrive, { sound: playTrill });
  at(tBeam, { sound: playBeam });
  at(tLift0, { sound: playTwinkle });
  at(tGrab, { sound: playPop });
  at(tCarry, { sound: playBeeps });
  at(tRelease, { sound: playPlop });
  at(tLever, { sound: playClonk });
  at(tRelease + 0.3, { sound: playGiggle });
  at(tRest, { sound: playThump });
  at(tLeave, { sound: playWhoosh });

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
  [
    { de: "Drei!", en: "Three!", zh: "三！", hi: "तीन!", es: "¡Tres!", ar: "ثلاثة!", ru: "Три!" },
    { de: "Zwei!", en: "Two!", zh: "二！", hi: "दो!", es: "¡Dos!", ar: "اثنان!", ru: "Два!" },
    { de: "Eins!", en: "One!", zh: "一！", hi: "एक!", es: "¡Uno!", ar: "واحد!", ru: "Один!" },
  ].forEach((word, i) => {
    at(tCount[i], { sound: playPing });
    at(tCount[i] + 0.05, { say: word });
  });
  at(tHose, { sound: playHiss });
  at(tArm, { sound: playCreak });
  at(tIgnite, { sound: playRumble });
  at(tLift, { sound: playLaunch });
  at(tLift + 0.05, {
    say: {
      de: "Start! Die Rakete fliegt zum Mond!",
      en: "Liftoff! The rocket flies to the moon!",
      zh: "发射！火箭飞向月亮！",
      hi: "उड़ान! रॉकेट चाँद की ओर उड़ता है!",
      es: "¡Despegue! ¡El cohete vuela a la luna!",
      ar: "انطلاق! الصاروخ يطير إلى القمر!",
      ru: "Пуск! Ракета летит на Луну!",
    },
  });
  at(tLift + 1.2, { sound: playTwinkle });
  at(tLift + 1.8, { sound: playTwinkle });

  /* Far away, small, the rocket comes down on the moon, which wakes up and smiles; a little flag pops out. */
  const tMoonIn = tLift + 2.1;
  const tMoonLand = tMoonIn + 1.6;
  const tFlag = tMoonLand + 0.45;
  const tDone = tFlag + 1.6;
  at(tMoonLand, { sound: playThump });
  at(tFlag, { sound: playPop });
  at(tFlag + 0.4, { sound: playGiggle });
  at(tDone, { done: true });
  /** The little rocket on its way down to the moon: the middle of its bottom and its flame (null before it shows). */
  const miniRocketAt = (t: number) => {
    if (t < tMoonIn) return null;
    const k = easeOut(seg(t, tMoonIn, tMoonLand));
    return { pt: { x: MOON.x, y: lerp(-80, MOON.y - MOON.r, k) }, flame: 1 - seg(t, tMoonLand - 0.2, tMoonLand + 0.1) };
  };
  /** How far the flag has come out of the little rocket: 0–1. */
  const flagAt = (t: number) => easeOut(seg(t, tFlag, tFlag + 0.35));

  /** How far the countdown is: 0 before it starts, then 1, 2, 3 for „3, 2, 1“ and 4 for „Start!“. */
  const countAt = (t: number) => (t >= tLift ? 4 : tCount.filter((tc) => t >= tc).length);
  /** 0 while the hose is plugged into the rocket, 1 once it lies on the ground. */
  const hoseDrop = (t: number) => easeIn(seg(t, tHose, tHose + 0.6));
  /** The tower arm's angle: 0 at the rocket's window, -95 folded up. */
  const armAngle = (t: number) => -95 * easeInOut(seg(t, tArm, tArm + 1.1));
  /** How far the rocket has risen. */
  const rocketRise = (t: number) => 1400 * easeIn(seg(t, tLift, tLift + 2.6));
  /** How big the flame is: a small flicker once the engine lights, full size once it lifts off. */
  const flameAt = (t: number) =>
    t < tIgnite ? 0 : t < tLift ? 0.35 * easeOut(seg(t, tIgnite, tIgnite + 0.4)) : lerp(0.35, 1, easeOut(seg(t, tLift, tLift + 0.4)));

  /** Where the camera looks: the thing that moves right now. */
  const focusX = (t: number) => {
    if (t < 0) return 0;
    if (t < tPipe) return marbleAt(t).pt.x;
    if (t < tOut) return (PANEL.x0 + PANEL.x1) / 2;
    if (t < tRobot) return marbleAt(t).pt.x;
    if (t < tPush) return ROBOT.cx + 100;
    if (t < tBump) return buggyAt(t).pt.x;
    if (t < tExit) return HUT.x;
    if (t < tPedal) return kangarooAt(t).pt.x + 120;
    if (t < tSatWake) return (RADIO.x + SAT.x) / 2;
    if (t < tLand) return SAT.x;
    if (t < tScope) return MOBILE.cx + 120;
    if (t < tGrab) return (SCOPE.pivot.x + ROCK.x) / 2 + 40;
    if (t < tLever) return ufoSpot(t).pt.x;
    if (t < tWake) return (LEVER.x + MAGNET.x) / 2;
    return ROCKET.x;
  };
  const cameraTarget = (t: number) => cameraOn(WORLD_W, focusX(t));

  /** Where it could wait for the child's tap (R-03): the sleeping robot, the capsule just landed, the hovering UFO, the countdown board with the iron ball in it. Only the countdown board waits; the machine runs through the others. */
  const stops = [
    { at: tRobot, x: ROBOT.cx, y: DECK.y - 110 },
    { at: tLand, x: CAPSULE_X, y: FLOOR - CAPSULE.h / 2 },
    { at: tBeam, x: UFO_HOVER.x, y: UFO_HOVER.y },
    { at: tWake, x: BOARD.x + BOARD.w / 2, y: BOARD.y + BOARD.h / 2, active: true },
  ];

  return {
    events: sorted(),
    duration: tDone,
    stops,
    pipe,
    buggyPath,
    ringTimes,
    tRobot,
    tPush,
    tBump,
    tDoor,
    tExit,
    hopTimes,
    tPedal,
    lampTimes,
    waveTimes,
    tSatWake,
    tCapsule,
    tChute,
    tLand,
    tPuff,
    tSpin,
    tScope,
    tSettle,
    tGlint,
    tAppear,
    tArrive,
    tBeam,
    tGrab,
    tRelease,
    tLeave,
    tGone,
    tLever,
    tRest,
    tOff,
    tWake,
    tCount,
    tIgnite,
    tLift,
    tMoonIn,
    tMoonLand,
    tFlag,
    marbleAt,
    frontArm,
    backArm,
    buggyAt,
    hatchAt,
    kangarooAt,
    pedalAt,
    waveAt,
    satAt,
    capsuleAt,
    puffAt,
    spinAt,
    scopeAngle,
    ufoAt,
    beamAt,
    rockAt,
    leverTilt,
    ironAt,
    countAt,
    hoseDrop,
    armAngle,
    rocketRise,
    flameAt,
    miniRocketAt,
    flagAt,
    cameraTarget,
    width: WORLD_W,
  };
}
