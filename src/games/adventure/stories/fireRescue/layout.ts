import * as THREE from "three";

// The way of „Fire Rescue“, from the fire station's yard at +z down the street towards -z:
// the station building 35 · Robo in the yard 31 · the yard's wall with the roller gate 25 ·
// the street with houses on both sides and washing lines across it 24.6 … -4 · the square, where
// Robo stops before the house with the smoke -8 · the house's front -13, the kittens on its roof.
// Robo hovers straight along x = 0; it only rises (floor by floor at the house) and turns round at the end.
//
// Shared by the scenery and the story: heights, positions along the way, small maths helpers.

export const TAU = Math.PI * 2;
export const clamp01 = (k: number) => Math.max(0, Math.min(1, k));
export const smooth = (k: number) => {
  const c = clamp01(k);
  return c * c * (3 - 2 * c);
};
export const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/** Tapsi faces the way ahead (-z); 0 would face home. */
export const AHEAD = Math.PI;

/** Robo's middle above the ground while it hovers: its glowing ring well clear of the ground. */
export const HOVER = 0.75;
/** Robo's flat deck, where Tapsi stands, above its middle. */
export const ROBO_TOP = 0.3;
/** Robo's radius at its widest. */
export const ROBO_RADIUS = 0.82;

/** Where Robo waits in the yard, under the fire bell. */
export const YARD_Z = 31;
/** The yard's front wall with the roller gate: far enough before Robo that the opening's camera comes down over it in front of Tapsi. */
export const GATE_Z = 25;
/** Half the width of the gate's opening. */
export const GATE_HALF = 1.9;
/** How high the open gate is: well above Tapsi's ears on Robo (checked by fireRescue.test.ts). */
export const GATE_OPEN = 3.4;
/** How high the yard's wall is. */
export const WALL_HEIGHT = 3.9;
/** The fire station's front, behind Robo. */
export const STATION_Z = 35;

/** Where the street's house fronts stand, either side of the way. */
export const STREET_X = 5.5;
/** Where the street's houses end and the square begins. */
export const STREET_END = -4;
/** How fast Robo hovers down the street while the washing lines come (m/s). */
export const DUCK_SPEED = 2;

/** Where Robo stops before the house with the smoke, and sprays. */
export const SPRAY_Z = -8;
/** The front of the house with the smoke. */
export const HOUSE_Z = -13;
/** How deep the house is. */
export const HOUSE_DEPTH = 4.5;
/** Half the house's width. */
export const HOUSE_HALF = 3.4;
/** How high one floor is: Robo rises by one after every go of the hose. */
export const FLOOR = 1.7;
/** How far from the house's front Tapsi stands to catch the kittens. */
export const CATCH_GAP = 1.55;
/** Where Robo hovers back to and turns round to us for the hooray, before the house. */
export const PARTY_GAP = 3.6;

/** Colours of the street's houses, in turn. */
export const HOUSE_COLORS = ["#f4d28a", "#9fd3c7", "#f2a7a0", "#c7b8ea", "#a8d58a", "#f7c59f"];
/** The kittens' fur, one each. */
export const KITTEN_COLORS = ["#f39c4a", "#9aa0a8", "#f4ead8", "#4a4a52"];
