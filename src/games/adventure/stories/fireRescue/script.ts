import { SEQUENCES } from "../../library/sequences";
import {
  CATCH_CLOSED,
  CATCH_OPEN,
  CATCH_PERIOD,
  CHEER_PERIOD,
  DUCK_PERIOD,
  PULL_DOWN_AT,
  PULL_DOWN_PERIOD,
  PUMP_DOWN_AT,
  PUMP_PERIOD,
  SPRAY_PERIOD,
} from "../../three/clips";
import { DUCK_SPEED, YARD_Z } from "./layout";

// The steps of „Fire Rescue“ and when they happen: the step indices, travel and demo times, and
// the moments in each clip the world is timed to. Used by world.ts and build() in index.ts.

export const sequence = SEQUENCES.find((s) => s.id === "fire_rescue")!;

/** The step indices of the sequence, by name. */
export const S = {
  hello: 0,
  bell: 1,
  duck: 2,
  pump: 3,
  spray: 4,
  catch: 5,
  hooray: 6,
  bye: 7,
} as const;

/**
 * Seconds of travel before each step: Robo hovering on to the next place while the camera comes round.
 * Kiki flies in for the hello; Robo speeds up through the gate before the washing lines, lets its hose down into the
 * fountain and the pump comes up out of its hatch before the pumping, rises to the roof before the kittens, and turns
 * round with Tapsi before the hooray, so both face us.
 */
export const TRAVEL = [4, 2.5, 4, 2.5, 3, 3.5, 2.5, 1.5];
/** Seconds Tapsi shows each movement alone first: whole goes of its clip, so the world stays in step. */
export const DEMO = [2.5, 2 * PULL_DOWN_PERIOD, DUCK_PERIOD, 2 * PUMP_PERIOD, SPRAY_PERIOD, CATCH_PERIOD, 3 * CHEER_PERIOD, 2];
/**
 * One go of each step's clip in which every target is met once (null where there is nothing to count):
 * a pull rings the bell and rolls the gate up a bit, a washing line passes over the ducked head, a push of the pump
 * gushes water into Robo's tanks, the hose puts out a smoke puff on the left and one on the right, a kitten jumps
 * into the arms, Robo bounces under a landing.
 */
export const CYCLES: ({ seconds: number; from: number } | null)[] = [
  null,
  { seconds: PULL_DOWN_PERIOD, from: 0 },
  { seconds: DUCK_PERIOD, from: 0 },
  { seconds: PUMP_PERIOD, from: 0 },
  { seconds: SPRAY_PERIOD, from: 0 },
  { seconds: CATCH_PERIOD, from: 0 },
  { seconds: CHEER_PERIOD, from: 0 },
  null,
];
export const LEAD = TRAVEL.map((t, i) => t + DEMO[i]);
/** Seconds of praise at the end of each step. */
export const PRAISE = sequence.steps.map(() => 2.5);
/** Seconds the child moves along in a step, after Tapsi has shown it. */
export const actLength = (step: number) => sequence.steps[step].seconds - TRAVEL[step] - PRAISE[step];
/** Seconds of a step's clip that the world follows: from when Tapsi shows it until the praise. */
export const clipLength = (step: number) => DEMO[step] + actLength(step);
/** How many times a step's clip meets its target: pulls, washing lines, pushes of the pump, goes of the hose, kittens … */
export const goes = (step: number) => Math.round((clipLength(step) - CYCLES[step]!.from) / CYCLES[step]!.seconds);

/** Seconds of the opening: at the house with the smoke and the kittens, then back down the street to Tapsi. */
export const OPENING = 9;

/** Seconds into the bell clip when pull n has brought the rope down: the bell rings, the gate has gone up a bit. */
export const pullTime = (n: number) => (n + PULL_DOWN_AT) * PULL_DOWN_PERIOD;
/** Seconds into the pump clip when push n has the handle down: the water gushes into Robo's tanks. */
export const pumpTime = (n: number) => (n + PUMP_DOWN_AT) * PUMP_PERIOD;
/** Seconds into the duck clip when washing line n is right over Tapsi: in the middle of every duck. */
export const passTime = (n: number) => (n + 0.5) * DUCK_PERIOD;
/** Seconds into the spray clip when the water reaches smoke puff n: furthest left (even n), then right. */
export const sprayTime = (n: number) => (Math.floor(n / 2) + (n % 2 === 0 ? 0.25 : 0.75)) * SPRAY_PERIOD;
/** Seconds into the catch clip when the arms have closed round kitten n. */
export const catchTime = (n: number) => (n + CATCH_CLOSED) * CATCH_PERIOD;
/** Seconds into the catch clip when the arms open again and kitten n hops down onto Robo. */
export const releaseTime = (n: number) => (n + CATCH_OPEN) * CATCH_PERIOD;
/** Seconds into the cheer clip when the feet land on Robo, in every jump. */
export const LANDING = 0.72;

/** Where Robo is when the washing lines begin to come: it sped up from the yard through the gate. */
export const DUCK_START = YARD_Z - (DUCK_SPEED * TRAVEL[S.duck]) / 2;
/** Where Robo is (z) `local` seconds into the duck step: speeding up, steady under the lines, slowing down in the praise. */
export function duckZ(local: number) {
  const travel = TRAVEL[S.duck];
  if (local < travel) return YARD_Z - ((DUCK_SPEED * travel) / 2) * (local / travel) ** 2;
  const clip = local - travel;
  if (clip <= clipLength(S.duck)) return DUCK_START - DUCK_SPEED * clip;
  const p = Math.min(clip - clipLength(S.duck), PRAISE[S.duck]);
  return DUCK_START - DUCK_SPEED * (clipLength(S.duck) + p - (p * p) / (2 * PRAISE[S.duck]));
}
/** Where washing line n hangs across the street: where Robo is when Tapsi is ducked deepest under it. */
export const lineZ = (n: number) => duckZ(TRAVEL[S.duck] + passTime(n));
/** Where Robo has slowed down at the end of the street. */
export const DUCK_END = duckZ(Infinity);

/**
 * How many floors Robo has risen `clip` seconds into the hose: one between each go and the next (around the end
 * of a go, after the right puff and before the next left one), never while the water is on a puff.
 */
export function floorsUp(clip: number) {
  let floors = 0;
  for (let n = 1; n < goes(S.spray); n++) {
    const k = (clip - (n - 0.15) * SPRAY_PERIOD) / (0.3 * SPRAY_PERIOD);
    floors += k <= 0 ? 0 : k >= 1 ? 1 : k * k * (3 - 2 * k);
  }
  return floors;
}
