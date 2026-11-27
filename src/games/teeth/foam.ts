import { toothKey } from "./jaw";
import { faceKey } from "./stains";
import { STEPS } from "./steps";

// Toothpaste foam in the mirror (idea X-31): as at home it comes where the brush has been. It lies between the lips
// and the teeth, on the gum along each tooth's gum line – never on the lips, where it looked odd (user feedback,
// November 2026) – and only on the teeth brushed already or being brushed now, so it spreads with the brush.
//
// Only the data lives here, so a test reads it without the drawings; mouth.tsx draws the bubbles under the lips: in
// the still picture for the teeth brushed before, and for the teeth of the step running now in small layers of their
// own that fade in once (`.gum-foam`), never something animated inside the mirror's svg.

/** A bubble of foam on a tooth's gum, in model units (the teeth are about 30 tall). */
export interface GumBubble {
  /** Where along the tooth's gum line: 0 at one end, 1 at the other. */
  along: number;
  /** How far down the gum from its edge, towards the lip. */
  down: number;
  /** How big. */
  r: number;
}

/**
 * The foam on one tooth's gum: a row of bubbles along its gum line, a few a little lower – small enough to stay between
 * the gum line and the lip, so the tooth itself and its monsters stay in sight. Faint and unlike each other, big ones
 * beside tiny ones (user feedback, November 2026: the foam should be subtler and look more varied); `gumFoam` in
 * mouth.tsx leaves out a different one on each tooth and sizes the rest a little differently, so no two teeth match.
 */
export const GUM_FOAM: GumBubble[] = [
  { along: 0.14, down: 3, r: 2.6 },
  { along: 0.36, down: 4, r: 4 },
  { along: 0.57, down: 2.5, r: 1.6 },
  { along: 0.8, down: 4.5, r: 3.2 },
  { along: 0.47, down: 8, r: 1.4 },
  { along: 0.25, down: 8.5, r: 1 },
  { along: 0.68, down: 7.5, r: 2.1 },
];

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
