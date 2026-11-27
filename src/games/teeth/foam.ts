// Toothpaste foam round the mouth in the mirror (idea X-31): as at home it grows while the child brushes – first a few
// bubbles on the bristles (`FOAM` in brush.tsx), then a rim of foam in the corners of the mouth, then on the lower lip –
// and stays until the child spits it out after the cheer (X-18, `spit.tsx`). A child who sees it on the face in the game knows the foam in its own mouth.
//
// Only the data lives here, so a test reads it without the drawings; mouth.tsx draws each clump as a small HTML layer
// of its own that fades in once (`.lip-foam`), never something inside the mirror's svg.

/** The kinds of clump: a round one for a corner of the mouth, a flat one lying along the lower lip. */
export type FoamShape = "corner" | "lip";

/** A clump of foam on the lips. */
export interface LipFoam {
  /**
   * Where on the lips: an index into the lips' ring of 40 points (`lips` in jaw.ts) – 0 the right corner, 10 the top
   * of the upper lip, 20 the left corner, 30 the middle of the lower lip.
   */
  at: number;
  /** From which stage of the brushing it shows (`foamStage`). */
  stage: number;
  /** How big, as a share of a full clump. */
  size: number;
  shape: FoamShape;
  /** Drawn mirrored, so the two sides of the mouth don't look the same. */
  flip: boolean;
}

/** How many points the lips' ring has (`lips` in jaw.ts). */
export const LIP_POINTS = 40;

/**
 * The foam on the lips, stage by stage: both corners first, then the lower lip's middle, then more along it towards
 * the corners. Never on the upper lip: the foam gathers in the corners and runs onto the lower lip, as it does.
 */
export const LIP_FOAM: LipFoam[] = [
  { at: 0, stage: 1, size: 1, shape: "corner", flip: false },
  { at: 20, stage: 1, size: 1, shape: "corner", flip: true },
  { at: 30, stage: 2, size: 0.9, shape: "lip", flip: false },
  { at: 36, stage: 3, size: 0.75, shape: "lip", flip: true },
  { at: 24, stage: 3, size: 0.75, shape: "lip", flip: false },
];

/**
 * When each stage begins, in ms of brushing: the brush has its bubbles from the start and its full foam after half a
 * minute (`FOAM_FULL_S` in brush.tsx); the corners follow at 20 s, the lower lip at 40 s and the rest of it at 65 s,
 * so the foam grows slowly over the first half of the song (the shortest, Spanish, lasts 1:49).
 */
export const FOAM_FROM_MS = [20_000, 40_000, 65_000];

/**
 * How much foam is on the lips `brushedMs` into the brushing (below 0: before it): 0 none, up to the number of stages.
 * At the end it stays through the cheer, until the child spits it out (`spit`, a picture of its own that draws the foam
 * itself); when the mirror comes back after tidying up (`rest`), the face is clean.
 */
export function foamStage(brushedMs: number, totalMs: number, ending: "cheer" | "spit" | "tidy" | "rest" | null): number {
  if (brushedMs < 0 || (ending !== null && ending !== "cheer")) return 0;
  const at = Math.min(brushedMs, totalMs);
  return FOAM_FROM_MS.filter((from) => at >= from).length;
}
