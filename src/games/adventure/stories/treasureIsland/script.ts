import * as THREE from "three";
import { SEQUENCES } from "../../library/sequences";
import {
  BRUSH_PERIOD,
  CAST_PERIOD,
  CRANK_PERIOD,
  DODGE_PERIOD,
  DRUM_PERIOD,
  JUMP_PEAK,
  JUMP_PERIOD,
  KEY_PICKUP,
  KEY_TURN,
  PULL_PERIOD,
  SHAPE_SECONDS,
  TOSS_AT,
  TOSS_PERIOD,
} from "../../three/clips";
import { BEACH_Z, JUMP_FROM, JUMP_TO, clamp01, smooth, v3 } from "./layout";

// The steps of the story and when they happen: the step indices, travel and demo
// times, and the periods the world is timed to. Used by world.ts and build() in index.ts.

export const sequence = SEQUENCES.find((s) => s.id === "treasure_island")!;

/** The step indices of the sequence, by name. */
export const S = {
  hello: 0,
  fish: 1,
  sit: 2,
  paddle: 3,
  stand: 4,
  stomp: 5,
  jump: 6,
  duck: 7,
  drums: 8,
  gate: 9,
  roll: 10,
  rollLeft: 11,
  rollMiddle: 12,
  monkeys: 13,
  apples: 14,
  riddle: 15,
  webs: 16,
  rope: 17,
  key: 18,
  coins: 19,
  hooray: 20,
  bye: 21,
} as const;

/** Seconds of one paddle stroke cycle, as in the paddle clip. */
export const PADDLE_PERIOD = 2.8;
/** The stomp clip: a foot comes down every half period, the left one first. */
export const STOMP_PERIOD = 1.6;
export const LEAN_PERIOD = 3.4;
export const REACH_PERIOD = 2.6;
/** The log swings over Tapsi and back to the front in this many seconds: two ducks. */
export const SWING_PERIOD = 6;

/**
 * Seconds of travel before each step: walking or paddling there, or the camera coming in. Kiki flies in
 * for the hello while the camera comes round to Tapsi's front; before the paddling Tapsi takes the paddle;
 * before the coins the lid opens, Ole turns round, the crabs carry the chest up the beach and Tapsi hops
 * down into the sand behind it (`CARRY`, `HOP_FROM`); before the hooray Tapsi turns round to us.
 */
export const TRAVEL = [4, 3, 1.2, 3, 1, 2, 2.5, 3, 3, 3, 4, 2, 2, 3, 3, 3.5, 2, 6, 2.5, 7.5, 1.5, 1.5];
/**
 * Seconds Tapsi shows each movement alone first: whole loops of its clip, so the world stays in step.
 * Sitting down and getting up are not shown first: Tapsi and the child do them together, once, and the
 * story goes on as soon as they sit or stand.
 */
export const DEMO = [
  2.5,
  CAST_PERIOD,
  0,
  PADDLE_PERIOD,
  0,
  STOMP_PERIOD,
  2 * JUMP_PERIOD,
  3,
  2 * DRUM_PERIOD,
  CRANK_PERIOD,
  DODGE_PERIOD,
  DODGE_PERIOD,
  DODGE_PERIOD,
  LEAN_PERIOD,
  REACH_PERIOD,
  2,
  BRUSH_PERIOD,
  2 * PULL_PERIOD,
  KEY_PICKUP + KEY_TURN,
  TOSS_PERIOD,
  2,
  2,
];
/**
 * One go of each step's clip in which every target is met once (null where there is nothing to count),
 * and where in the clip the first go starts. A step's clip is a whole number of goes, so the last
 * movement still meets its target and none is left over when the praise begins.
 */
export const CYCLES: ({ seconds: number; from: number } | null)[] = [
  null,
  { seconds: CAST_PERIOD, from: 0 },
  null,
  { seconds: PADDLE_PERIOD, from: 0 },
  null,
  { seconds: STOMP_PERIOD, from: 0 },
  // A star box over every jump.
  { seconds: JUMP_PERIOD, from: 0 },
  { seconds: SWING_PERIOD, from: 0 },
  { seconds: DRUM_PERIOD, from: 0 },
  { seconds: CRANK_PERIOD, from: 0 },
  // A coconut for every step aside, every lifted leg and every straddle.
  { seconds: DODGE_PERIOD, from: 0 },
  { seconds: DODGE_PERIOD, from: 0 },
  { seconds: DODGE_PERIOD, from: 0 },
  { seconds: LEAN_PERIOD, from: 0 },
  { seconds: REACH_PERIOD, from: 0 },
  { seconds: 3 * SHAPE_SECONDS, from: 0 },
  { seconds: BRUSH_PERIOD, from: 0 },
  { seconds: PULL_PERIOD, from: 0 },
  { seconds: KEY_TURN, from: KEY_PICKUP },
  { seconds: TOSS_PERIOD, from: 0 },
  null,
  null,
];
export const LEAD = TRAVEL.map((t, i) => t + DEMO[i]);
/** Seconds of praise at the end of each step; short after sitting down and getting up, so nobody waits sitting or standing. */
export const PRAISE = sequence.steps.map((_, i) => (i === S.sit || i === S.stand ? 0.8 : 2.5));
/** Seconds the child moves along in a step, after Tapsi has shown it. */
export const actLength = (step: number) => sequence.steps[step].seconds - TRAVEL[step] - PRAISE[step];
/** Seconds of a step's clip that the world follows: from when Tapsi shows it until the praise. */
export const clipLength = (step: number) => DEMO[step] + actLength(step);
/** How many times a step's clip meets its target: casts, stomps, beats, nuts … */
export const goes = (step: number) => Math.round((clipLength(step) - CYCLES[step]!.from) / CYCLES[step]!.seconds);
/** Seconds into the jump clip when the head bumps star box `n`: at the top of every jump. */
export const bumpTime = (n: number) => n * JUMP_PERIOD + JUMP_PEAK;
/** Where Ole is (z) `clip` seconds into the jump clip: walking steadily over the bridge while Tapsi hops on its back. */
export function jumpZ(clip: number) {
  const k = clamp01(clip / clipLength(S.jump));
  return JUMP_FROM + (JUMP_TO - JUMP_FROM) * (k * 0.8 + smooth(k) * 0.2);
}
export const OPENING = 8;
/** In the opening: when the trail starts and reaches the chest, and the flash back to Ole at sea. */
export const TRAIL_FROM = 0.6;
export const TRAIL_TO = 5.2;
export const OPENING_CUT = 6.6;

/** Tapsi faces the island (-z); 0 would face the sea. */
export const ISLAND = Math.PI;

/** In each cast (0..1 of it): when the float flies out, when it lands, and when it is reeled in (for this long). */
export const CAST_OUT = 0.5;
export const CAST_LANDS = 0.66;
export const REEL = 0.9;
export const REEL_TIME = 0.18;
/** In each cast: when a fish leaps out beside the float and when it dives in again on the other side. */
export const LEAP_FROM = 0.7;
export const LEAP_TO = 0.92;
/** Seconds into the coins clip when the coins of throw n leave Tapsi's paws. */
export const tossAt = (n: number) => n * TOSS_PERIOD + TOSS_AT;
/** In the coins step (seconds into it): the lid opens, the crabs come up out of the water at the raft, lift the open chest off it, carry it up the beach, set it down and go. */
export const CARRY = { up: 1.6, lift: 2.1, off: 2.6, down: 5.4, set: 5.8, gone: 6.8 };
/** In the coins step (seconds into it): Tapsi hops down from Ole into the sand behind the chest, and lands. */
export const HOP_FROM = 5.9;
export const HOP_LAND = 6.7;

/** How much more the paddle tips than the line between the hands. */
export const PADDLE_TILT = 1.3;
/** How far from its middle each paw holds the paddle while it lies on the lap (m). */
export const PADDLE_GRIP = 0.22;
/** The paddle lying across Tapsi's lap: its shaft (y) along x, the blades flat (z up); and on the sand, along z. */
export const ACROSS = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(v3(0, 0, 1), v3(1, 0, 0), v3(0, 1, 0)));
export const ON_SAND = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(v3(-1, 0, 0), v3(0, 0, 1), v3(0, 1, 0)));
/** The paddle standing beside Ole (Ole's space): its own y, the shaft, down into the water, the top leaning in. */
export const STANDING = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI - 0.12));
/** Where Tapsi lets the paddle fall onto the beach, beside Ole on the right. */
export const PADDLE_DROP = v3(1.35, 0, BEACH_Z + 0.3);
