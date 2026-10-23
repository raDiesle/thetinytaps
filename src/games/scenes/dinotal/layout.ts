import { float, ground } from "../layout";

// Every drawing of this scene has its foot point at (0, 0) and is placed with `ground`.
// From back to front: the friendly volcano at the horizon; the cliff with the cave, the
// big tree and the Brachiosaurus eating from it; the lake with the swimming saurian;
// the meadow with Stegosaurus, Triceratops and the nest; the front with the T-Rex,
// the puddle, the hatching egg, ferns and flowers.

/** The volcano at the horizon; it smokes only when tapped. */
export const VULKAN = ground(0, 0, 470, 356, 1.55);
/** The big tree on the right and the Urvogel on its branch. */
export const BAUM = ground(0, 0, 1480, 450, 1.25);
/** The Brachiosaurus eating at the edge of the tree's crown. */
export const BRACHIO = ground(0, 0, 1250, 462, 1.25);
/** The cliff with the cave, the pterosaur baby's nest on top. */
export const HOEHLE = ground(0, 0, 135, 492, 1.15);
/** The flying pterosaur in the sky, over the cliff. */
export const FLUG = float(0, 0, 260, 150, 0.7);

/** The lake: centre and radii at the water line. */
export const LAKE = { cx: 1030, cy: 598, rx: 290, ry: 64 };
/** The lily pad and the frog sitting on it. */
export const SEEROSE = ground(0, 0, 1180, 606, 1.3);
/** The hollow log and the lizard sunbathing on it. */
export const STAMM = ground(0, 0, 1060, 772, 1);
/** The flower and the butterfly above it. */
export const BLUME = ground(0, 0, 610, 990, 1);

/** The sandy trail from the front up to the volcano: [x, y] points, back to front. */
export const TRAIL = [
  [520, 360],
  [560, 430],
  [520, 520],
  [610, 600],
  [760, 690],
  [740, 800],
  [800, 900],
  [770, 1000],
] as const;
