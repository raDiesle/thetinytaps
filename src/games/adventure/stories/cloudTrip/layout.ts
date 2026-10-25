import * as THREE from "three";

// The way of "Die Wolkenreise", from the meadow at +z into the sky towards -z:
// meadow 40 · up into the sky until 33 · little planes 26 · balloons 19 ·
// sitting down 15 · the curves round the cloud towers until -21 · slowing down
// and getting up · the rain cloud with the sun behind it -30, where the rainbow is painted.
// Wolle flies straight along x = 0; only in the curves does it swing out.
//
// Shared by the scenery and the story: heights, positions along the way, small maths helpers.

export const TAU = Math.PI * 2;
export const clamp01 = (k: number) => Math.max(0, Math.min(1, k));
export const smooth = (k: number) => {
  const c = clamp01(k);
  return c * c * (3 - 2 * c);
};
/** Smoothstep that also works with edge0 > edge1. */
export const ss = (edge0: number, edge1: number, x: number) => smooth((x - edge0) / (edge1 - edge0));
export const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/** Tapsi faces the way ahead (-z); 0 would face home. */
export const AHEAD = Math.PI;

/** Height of the meadow at (x, z): flat where Wolle starts, soft hills further out. */
export function groundHeight(x: number, z: number) {
  const far = ss(6, 30, Math.hypot(x, z - 40));
  return far * (1.6 * Math.sin(x * 0.045 + 1) * Math.sin(z * 0.05) + 1.2 * Math.sin(x * 0.11 + z * 0.07) + 1.4);
}

/** Wolle's middle above the ground while it lies on the meadow, so its belly just touches the grass. */
export const WOLLE_REST = 0.62;
/** Wolle's top, where Tapsi stands, above its middle. */
export const WOLLE_TOP = 0.42;
/** How far Tapsi sinks into Wolle sitting down. */
export const SIT_DROP = 0.02;
/** How high Wolle flies (its middle). */
export const ALT = 14;

/** Where Wolle lies on the meadow, at the start. */
export const MEADOW_Z = 40;
/** Where the flapping has lifted Wolle up into the sky. */
export const FLAP_TO = 33;
/** Where the little planes come over. */
export const DUCK_Z = 26;
/** Where the balloons float up. */
export const BALLOON_Z = 19;
/** Where Tapsi sits down, and where the curves begin. */
export const SIT_Z = 15;
/** Where the curves end. */
export const CURVES_TO = -21;
/** How far Wolle swings out to either side in the curves. */
export const CURVE_SWING = 0.9;
/** Under the rain cloud: pushing it up, painting the rainbow, cheering and waving goodbye. */
export const SUN_Z = -30;

/** The sun, hidden in the rain cloud ahead, above and a little to the right, clear of the rainbow's top. */
export const SUN = v3(6, ALT + 13, SUN_Z - 20);
export const SUN_RADIUS = 3.2;
/** How far apart the grey puffs hanging down from the rain cloud sit, one above the other. */
export const PUFF_GAP = 1.15;
/** The size of the grey puffs Tapsi pushes away. */
export const PUFF_RADIUS = 0.85;

/** The middle of the rainbow's circle, far ahead below Wolle, and the outer band's radius. */
export const RAINBOW_CENTER = v3(0, ALT - 9, SUN_Z - 34);
export const RAINBOW_RADIUS = 21;
/** How wide each band is. */
export const RAINBOW_BAND = 1.5;
/** The rainbow's colours from the outside in: one band for every half circle the arms paint. */
export const RAINBOW_COLORS = ["#ff4d4d", "#ff9a2e", "#ffd93b", "#5ccf5c", "#3fa3ff", "#9b6bff"];
