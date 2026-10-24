import * as THREE from "three";
import { SEQUENCES } from "../../library/sequences";
import { BRUSH_PERIOD, CRANK_PERIOD, JUMP_PEAK, JUMP_PERIOD, KEY_PICKUP, KEY_TURN, STOP_DANCE } from "../../three/clips";
import { BEACH_Z, JUMP_FROM, JUMP_TO, clamp01, smooth, v3 } from "./layout";

// The steps of the story and when they happen: the step indices, travel and demo
// times, and the periods the world is timed to. Used by world.ts and build() in index.ts.

export const sequence = SEQUENCES.find((s) => s.id === "treasure_island")!;

/** The step indices of the sequence, by name. */
export const S = {
  hello: 0,
  paddle: 1,
  stomp: 2,
  jump: 3,
  duck: 4,
  flowers: 5,
  gate: 6,
  roll: 7,
  monkeys: 8,
  apples: 9,
  riddle: 10,
  webs: 11,
  rope: 12,
  key: 13,
  hooray: 14,
  party: 15,
  bye: 16,
} as const;

/** Seconds of travel before each step: walking or paddling there, or the camera coming in. */
export const TRAVEL = [2.5, 3, 3, 3.5, 3, 3, 3, 4, 3, 3, 3.5, 2, 3.5, 2.5, 2.5, 2, 1];
/** Seconds Tapsi shows each movement alone first: whole loops of its clip, so the world stays in step. */
export const DEMO = [
  2.5,
  2.8,
  1.6,
  3 * JUMP_PERIOD,
  3,
  4,
  CRANK_PERIOD,
  3,
  3.4,
  2.6,
  2,
  BRUSH_PERIOD,
  3.6,
  KEY_PICKUP + KEY_TURN,
  2,
  STOP_DANCE[0].dance + STOP_DANCE[0].hold,
  2,
];
export const LEAD = TRAVEL.map((t, i) => t + DEMO[i]);
export const PRAISE = 2.5;
/** Seconds the child moves along in a step, after Tapsi has shown it. */
export const actLength = (step: number) => sequence.steps[step].seconds - TRAVEL[step] - PRAISE;
/** Seconds of a step's clip that the world follows: from when Tapsi shows it until the praise. */
export const clipLength = (step: number) => DEMO[step] + actLength(step);
/** Seconds into the jump clip when the head bumps star box `n`: at the top of every third jump. */
export const bumpTime = (n: number) => (n * 3 + 2) * JUMP_PERIOD + JUMP_PEAK;
/** Where Ole is on the bridge (z) `clip` seconds into the jump clip: walking steadily across while Tapsi hops on its back. */
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

/** Seconds of one paddle stroke cycle, as in the paddle clip. */
export const PADDLE_PERIOD = 2.8;
/** How much more the paddle tips than the line between the hands. */
export const PADDLE_TILT = 1.3;
/** How far from its middle each paw holds the paddle while it lies on the lap (m). */
export const PADDLE_GRIP = 0.22;
/** The paddle lying across Tapsi's lap: its shaft (y) along x, the blades flat (z up); and on the sand, along z. */
export const ACROSS = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(v3(0, 0, 1), v3(1, 0, 0), v3(0, 1, 0)));
export const ON_SAND = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(v3(-1, 0, 0), v3(0, 0, 1), v3(0, 1, 0)));
/** Where Tapsi lets the paddle fall onto the beach, beside Ole on the right. */
export const PADDLE_DROP = v3(1.35, 0, BEACH_Z + 0.3);
/** The stomp clip: a foot comes down every half period, the left one first. */
export const STOMP_PERIOD = 1.6;
export const SIDE_STEP_PERIOD = 3;
export const LEAN_PERIOD = 3.4;
export const REACH_PERIOD = 2.6;

export const ROLLERS = 4;
export const THROWS = 8;
export const APPLES = 8;
