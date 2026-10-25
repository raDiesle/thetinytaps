import { SEQUENCES } from "../../library/sequences";
import { ARC_PERIOD, CHEER_PERIOD, DUCK_PERIOD, FLAP_PERIOD, LEAN_PERIOD, PUSH_PERIOD, TAP_HIT, TAP_PERIOD } from "../../three/clips";
import { CURVES_TO, SIT_Z } from "./layout";

// The steps of „Die Wolkenreise“ and when they happen: the step indices, travel and demo
// times, and the moments in each clip the world is timed to. Used by world.ts and build() in index.ts.

export const sequence = SEQUENCES.find((s) => s.id === "cloud_trip")!;

/** The step indices of the sequence, by name. */
export const S = {
  hello: 0,
  flap: 1,
  duck: 2,
  balloons: 3,
  sit: 4,
  stars: 5,
  stand: 6,
  push: 7,
  rainbow: 8,
  hooray: 9,
  bye: 10,
} as const;

/**
 * Seconds of travel before each step: Wolle flying on to the next place while the camera comes round.
 * Kiki flies in for the hello; before the hooray Wolle turns round with Tapsi, so both face us.
 */
export const TRAVEL = [4, 2.5, 3, 3, 1.2, 2, 1, 3.5, 2, 2.5, 1.5];
/**
 * Seconds Tapsi shows each movement alone first: whole goes of its clip, so the world stays in step.
 * Sitting down and getting up are not shown first: Tapsi and the child do them together, once.
 */
export const DEMO = [2.5, 2 * FLAP_PERIOD, DUCK_PERIOD, 2 * TAP_PERIOD, 0, LEAN_PERIOD, 0, PUSH_PERIOD, ARC_PERIOD, 3 * CHEER_PERIOD, 2];
/**
 * One go of each step's clip in which every target is met once (null where there is nothing to count):
 * a downstroke lifts Wolle, a plane passes over the ducked head, a balloon pops, a star on the left and
 * one on the right, a grey puff flies off, a band of the rainbow is painted, Wolle bounces under a landing.
 */
export const CYCLES: ({ seconds: number; from: number } | null)[] = [
  null,
  { seconds: FLAP_PERIOD, from: 0 },
  { seconds: DUCK_PERIOD, from: 0 },
  { seconds: TAP_PERIOD, from: 0 },
  null,
  { seconds: LEAN_PERIOD, from: 0 },
  null,
  { seconds: PUSH_PERIOD, from: 0 },
  { seconds: ARC_PERIOD, from: 0 },
  { seconds: CHEER_PERIOD, from: 0 },
  null,
];
export const LEAD = TRAVEL.map((t, i) => t + DEMO[i]);
/** Seconds of praise at the end of each step; short after sitting down and getting up, so nobody waits. */
export const PRAISE = sequence.steps.map((_, i) => (i === S.sit || i === S.stand ? 0.8 : 2.5));
/** Seconds the child moves along in a step, after Tapsi has shown it. */
export const actLength = (step: number) => sequence.steps[step].seconds - TRAVEL[step] - PRAISE[step];
/** Seconds of a step's clip that the world follows: from when Tapsi shows it until the praise. */
export const clipLength = (step: number) => DEMO[step] + actLength(step);
/** How many times a step's clip meets its target: wing beats, planes, balloons … */
export const goes = (step: number) => Math.round((clipLength(step) - CYCLES[step]!.from) / CYCLES[step]!.seconds);

/** Seconds of the opening: from the rain cloud before the sun back over the land to Tapsi on the meadow. */
export const OPENING = 8.5;

/** Seconds into the duck clip when plane n is right over Tapsi: in the middle of every duck. */
export const passTime = (n: number) => (n + 0.5) * DUCK_PERIOD;
/** Seconds into the tap clip when balloon n is at the paw (the left one for even n). */
export const tapTime = (n: number) => n * TAP_PERIOD + TAP_HIT;
/** Seconds into the lean clip when star n is at the paw: leaning furthest left (even n) or right. */
export const starTime = (n: number) => (Math.floor(n / 2) + (n % 2 === 0 ? 0.25 : 0.75)) * LEAN_PERIOD;
/** Where in each push the paws are highest (the push_up clip holds them up from here). */
export const PUSH_TOP = 0.4;
/** Seconds into the push clip when the paws reach grey puff n. */
export const pushTime = (n: number) => (n + PUSH_TOP) * PUSH_PERIOD;
/** Where in each half of the arc clip the arm is at the top, so that half of the band is painted. */
export const ARC_TOP = 0.6;
/** Seconds into the cheer clip when the feet land on Wolle, in every jump. */
export const LANDING = 0.72;

/** How fast Wolle flies through the curves (m/s): it speeds up from the sitting place in the travel, and is at the end of the curves when the praise begins. */
export const CURVE_SPEED = (SIT_Z - CURVES_TO) / (clipLength(S.stars) + TRAVEL[S.stars] / 2);
/** Where Wolle is (z) `local` seconds into the curves step: speeding up, through the curves, slowing down in the praise. */
export function curveZ(local: number) {
  const travel = TRAVEL[S.stars];
  if (local < travel) return SIT_Z - ((CURVE_SPEED * travel) / 2) * (local / travel) ** 2;
  const clip = local - travel;
  if (clip <= clipLength(S.stars)) return SIT_Z - CURVE_SPEED * (travel / 2 + clip);
  const p = Math.min(clip - clipLength(S.stars), PRAISE[S.stars]);
  return CURVES_TO - CURVE_SPEED * (p - (p * p) / (2 * PRAISE[S.stars]));
}
/** Where Tapsi gets up again, after Wolle has slowed down. */
export const STAND_Z = curveZ(Infinity);
