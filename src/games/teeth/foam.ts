import { toothKey } from "./jaw";
import { faceKey } from "./stains";
import { STEPS } from "./steps";

// Toothpaste foam in the mirror (idea X-31): as at home it comes where the brush has been. It lies at each tooth's gum line,
// on the gum and a little on the tooth – never on the lips, where it looked odd (user feedback,
// November 2026) – and only on the teeth brushed already or being brushed now, so it spreads with the brush.
//
// Only the data lives here, so a test reads it without the drawings; mouth.tsx draws the bubbles under the lips: in
// the still picture for the teeth brushed before, and for the teeth of the step running now in small layers of their
// own that fade in once (`.gum-foam`), never something animated inside the mirror's svg.

/** A bubble of foam at a tooth's gum line, in model units (the teeth are about 30 tall). */
export interface GumBubble {
  /** Where along the tooth's gum line: 0 at one end, 1 at the other. */
  along: number;
  /** How far from the gum's edge: down the gum towards the lip, or up onto the tooth where it is negative. */
  down: number;
  /** How big. */
  r: number;
}

/**
 * The foam a tooth may get at its gum line, in order along it: each bubble lies on the gum's edge, some a little down
 * the gum, some a little up onto the tooth – where the brush pushes foam as it goes along the gum (user feedback,
 * November 2026: foam only at the gum and a little on the tooth). Faint and unlike each other, big ones beside tiny ones;
 * a tooth takes only a few of them next to each other (`FOAM_AMOUNTS`), so no two teeth match.
 */
export const GUM_FOAM: GumBubble[] = [
  { along: 0.16, down: 1.5, r: 2.4 },
  { along: 0.3, down: -1.5, r: 3.4 },
  { along: 0.44, down: -2.6, r: 1 },
  { along: 0.52, down: 2, r: 1.3 },
  { along: 0.64, down: -0.5, r: 2.8 },
  { along: 0.8, down: 2.5, r: 1.8 },
];

/**
 * How many of `GUM_FOAM`'s bubbles a tooth gets, picked by the tooth: clearly more on one than on its neighbour, often a
 * single bubble or none, and few in all (user feedback, November 2026: the foam's amount should differ clearly from
 * tooth to tooth and be less overall – a tooth may have just one bubble; then, asked again, fewer bubbles still: about
 * one a tooth, half of before). Neighbouring teeth take neighbouring entries.
 */
export const FOAM_AMOUNTS = [1, 2, 0, 1, 2, 0, 2];

/** How much bigger or smaller a bubble may come out on one tooth than in `GUM_FOAM`. */
export const GUM_FOAM_SPREAD = 0.25;

/**
 * The teeth with foam on their gum (`toothKey`): those with a face brushed already – a face a step brushes that is no
 * longer `dirty` (`dirtyFaces` in stains.ts) – and those the brush has `reached` in the step running now.
 */
export function foamyTeeth(dirty: readonly string[], reached: readonly string[] = []): Set<string> {
  const stained = new Set(dirty);
  const foamy = new Set(reached);
  for (const step of STEPS) for (const tooth of step.teeth) if (!stained.has(faceKey(tooth, step.surface))) foamy.add(toothKey(tooth));
  return foamy;
}
