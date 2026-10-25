import * as THREE from "three";
import { GUIDE_SIZE } from "../../three/guide";
import { TURTLE_BACK, TURTLE_HALF_WIDTH } from "../../three/props";

// Island layout along the path (x ≈ 0), from the sea at +z to the bay at -z:
// beach 31.5 · brook 25.4 · swinging log 21 · drums 15.5 · gate 10.5 ·
// rolling coconuts 6.6 · monkeys 2.4 · apple tree -1.4 · stone door in the
// cliff -9.9 with the cobwebs behind it · hidden bay with the chest around -30.
//
// Shared by the scenery and the story: ground height, positions along the path, small maths helpers.

export const TAU = Math.PI * 2;
export const clamp01 = (k: number) => Math.max(0, Math.min(1, k));
export const smooth = (k: number) => {
  const c = clamp01(k);
  return c * c * (3 - 2 * c);
};
/** Smoothstep that also works with edge0 > edge1. */
export const ss = (edge0: number, edge1: number, x: number) => smooth((x - edge0) / (edge1 - edge0));
export const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

export const LAGOON = new THREE.Vector2(0, -30);
export const LAGOON_LEVEL = 0.34;

/** Island ground height at (x, z); below 0 is under the sea. */
export function groundHeight(x: number, z: number) {
  const dx = x / 28;
  const dz = (z + 4) / 42;
  const theta = Math.atan2(dz, dx);
  const r = Math.hypot(dx, dz) / (1 + 0.05 * Math.sin(3 * theta) + 0.035 * Math.sin(5 * theta + 2) + 0.02 * Math.sin(9 * theta + 1));
  let h = -1.4 + 2.3 * ss(1.08, 0.78, r);
  h += 0.18 * Math.sin(x * 0.31 + 1) * Math.sin(z * 0.23) * ss(1.0, 0.7, r) * ss(1.5, 4, Math.abs(x));
  // The brook across the path.
  h -= 0.85 * Math.exp(-(((z - 25.4) / 1.25) ** 2)) * ss(1.0, 0.85, r);
  // The hill with its cliff, cut through by a narrow gorge where the door is.
  const hill = 8 * ss(-8.6, -10.6, z) * ss(-22, -18, z) * ss(17, 9, Math.abs(x));
  h += hill * ss(1.5, 2.7, Math.abs(x)) * (1 + 0.08 * Math.sin(x * 0.9) * Math.sin(z * 0.7));
  // The hidden bay behind the hill.
  h -= 2.4 * ss(8.5, 5.5, Math.hypot(x - LAGOON.x, z - LAGOON.y));
  return h;
}

/** True where trees and bushes may grow: on land, off the path and away from the stations. */
export function freeSpot(x: number, z: number) {
  const h = groundHeight(x, z);
  if (h < 0.7) return false;
  if (Math.abs(x) < 4 && z > -12) return false;
  if (Math.abs(z - 25.4) < 2.5) return false;
  if (Math.hypot(x - LAGOON.x, z - LAGOON.y) < 9.5) return false;
  if (Math.abs(x) < 3.5) return false;
  // Where the camera stands behind Tapsi at the winch, and beside the brook.
  if (x > -7 && x < 1 && z > 10 && z < 17) return false;
  if (x > 0 && x < 10 && z > 20 && z < 30) return false;
  return true;
}

/** Water or ground at (x, z), whichever is higher: where the trail lies. */
export function surface(x: number, z: number) {
  let y = Math.max(groundHeight(x, z), 0.02);
  if (Math.abs(z - 25.4) < 1.8) y = Math.max(y, 0.44);
  y = Math.max(y, bridgeTop(x, z));
  if (Math.hypot(x - LAGOON.x, z - LAGOON.y) < 7.8) y = Math.max(y, LAGOON_LEVEL + 0.02);
  return y;
}

/** Where things happen; z along the path. */
export const BOAT_START = 62;
/** How long the fishing rod is, where along it the right paw (above) and the left paw (at the end) hold it, and how far ahead the float lands. */
export const ROD_LENGTH = 1.25;
export const ROD_GRIP_R = 0.27;
export const ROD_GRIP_L = 0.08;
export const CAST_REACH = 3.6;
/** Where the rod lies on Ole's back after the fishing (Ole's own space, x to Ole's left): along its left side, behind Tapsi. */
export const ROD_REST = v3(0.5, 0, -0.05);
/** Where the paddle stands in the water beside Ole while Tapsi fishes (Ole's own space): on Tapsi's right and a little behind, low, so it does not hide the island. */
export const PADDLE_STAND = v3(-1.05, 0.7, -0.3);
export const BOAT_END = 35;
/** Where Ole has crawled up the beach after the paddling, with Tapsi still on its back. */
export const BEACH_Z = 32.2;
/** On the beach, where the scorpions come. */
export const STOMP_Z = 31.5;
export const BROOK_FROM = 27.3;
/** The little wooden bridge: where it starts and ends (z), half its width (Ole walks over it), the top of its deck at the ends and how much higher it arches in the middle. */
export const BRIDGE_FROM = BROOK_FROM + 0.75;
export const BRIDGE_TO = BRIDGE_FROM - 4.9;
/**
 * Ole walks from the sand before the bridge over it to the other bank while Tapsi hops on its back:
 * far enough that a box hangs over every jump with room between them.
 */
export const JUMP_FROM = BRIDGE_FROM + 2.35;
export const JUMP_TO = BRIDGE_TO - 0.15;
export const BRIDGE_HALF = 0.98;
const BRIDGE_END = 0.87;
export const BRIDGE_ARCH = 0.12;
/** How high above where Tapsi stands the star boxes float: the head just reaches them at the top of a jump. */
export const BOX_ABOVE = 1.88;
export const SWING_Z = 21;
/** The log hangs right over Tapsi and swings through above the head, from the front towards us and back. */
export const SWING_PIVOT_Z = SWING_Z;
/** How far up in front the log waits (rad), and where it is hooked up afterwards, out of the way. */
export const SWING_HELD = 0.77;
export const SWING_PARKED = 1.1;
export const DRUMS_Z = 15.5;
/** Where the beating paw comes down (measured on the drum clip), from Tapsi: x to Tapsi's left; and how wide the drums are. */
export const DRUM_HAND = v3(0.42, 0.75, 0.32).multiplyScalar(GUIDE_SIZE);
export const DRUM_RADIUS = 0.15;
/** The wooden gate across the path; half its opening, and how high it rises. */
export const GATE_Z = 10.5;
export const GATE_HALF = 1.3;
export const GATE_LIFT = 1.9;
/** The winch beside the gate on the left; its crank turns in front of Tapsi's paws. */
export const WINCH_X = -2.55;
export const WINCH_Z = GATE_Z + 0.35;
/** How far in front of Tapsi and how high the paws turn the crank (measured on the clip). */
export const CRANK_REACH = 0.39 * GUIDE_SIZE;
const CRANK_HEIGHT = 0.86 * GUIDE_SIZE;
export const CRANK_ARM = 0.24 * GUIDE_SIZE;
/** The knob sticking out of the crank towards Tapsi, and the level bar on it that both paws hold. */
export const CRANK_KNOB = 0.12;
export const CRANK_BAR = 0.26;
/** The crank's axle above the ground: Tapsi turns it standing on Ole's back. */
export const CRANK_Y = TURTLE_BACK + CRANK_HEIGHT;
/** How far behind the crank the winch's post stands: beyond Ole's head. */
export const WINCH_POST = 1.15;
export const ROLL_Z = 6.6;
/** How big the rolling coconuts are: small enough to roll under Tapsi's lifted foot and between its feet. */
export const ROLL_RADIUS = 0.11;
/** Seconds from when a monkey holds a coconut up until it rolls past Tapsi. */
export const ROLL_LEAD = 3;
export const MONKEY_Z = 2.4;
export const APPLE_Z = -1.4;
export const DOOR_Z = -9.9;
/** A step back from the door, so the three pictures above it show. */
export const RIDDLE_Z = DOOR_Z + 3;
/** In the doorway where the door was, the cobwebs in front within reach of the sweeping paws. */
export const WEB_STAND = DOOR_Z + 0.15;
/** The cobwebs behind the door: layers one behind the other, each with a left and a right half, one layer for every go of the brush clip. */
export const WEB_Z = DOOR_Z - 0.3;
export const WEB_GAP = 0.1;
export const SHORE = v3(0, 0, -21.8);
/** How deep Ole's belly is under the water while swimming (m). */
export const TURTLE_FLOAT = 0.25;
/** How much lower Tapsi's feet are than Ole's back while sitting on it, legs stretched out forwards (see sitDown in player.ts): so the bottom and the heels just touch the shell. */
export const SIT_DROP = 0.015;
/** In the bay Ole swims at the water's edge, side on, with Tapsi on its back facing the water. */
export const BAY = v3(0.3, 0, -23);
/** Where the lock hangs on the chest (the chest's own space), and where the turning paw is, from Tapsi. */
export const LOCK = v3(0, 0.62, 0.45);
const KEY_HAND = v3(-0.1, 0.95, 0.42).multiplyScalar(GUIDE_SIZE);
/** The camera for the key turn, from the lock: over Tapsi's right shoulder, so the paw and the key's ring show. */
export const KEY_VIEW = v3(1.35, 1.0, 2.4);
/** Where the key's ring is when it is in the lock, from the lock. */
export const KEY_RING = v3(0, 0.05, 0.4);
export const RAFT_FROM = -35;
/** Where the rope is tied to the chest, from the chest. */
export const ROPE_TIE = v3(0, 0.4, 0.45);
/** How far along the rope the paws reach out from the belly (fox units). */
export const ROPE_REACH = 0.26;
/**
 * Where the pulled-in rope goes after the paws: past Tapsi's right side, clear of the body (the first two
 * from the hips), then down onto Ole's back and along it (from Tapsi's feet), all in fox units.
 */
export const ROPE_TAIL = [v3(-0.22, 0.22, 0.17), v3(-0.3, -0.05, 0.08), v3(-0.36, 0.03, 0.02), v3(-0.42, 0.03, -0.4)];
/** Pulled in to Ole's side, the chest right in front of Tapsi: x so the lock is at the turning paw, z just clear of the shell. */
export const RAFT_TO = BAY.z - TURTLE_HALF_WIDTH - 1.12;
export const RAFT_X = BAY.x - KEY_HAND.x - LOCK.x;
/**
 * The chest on its crate at the near end of the raft (the raft's own space): high enough that the
 * lock is where Tapsi's paw turns the key, standing on Ole's back, and close enough to reach.
 */
export const CHEST_Y = TURTLE_BACK - TURTLE_FLOAT + KEY_HAND.y - LOCK.y;
export const CHEST_Z = BAY.z - KEY_HAND.z - LOCK.z - RAFT_TO;
/** Where Tapsi celebrates, facing us: Ole has turned round and crawled up the beach. */
export const PARTY = v3(BAY.x, 0, BAY.z + 1.9);
/** At the end Tapsi stands in the sand here, beside Ole on the right as we see it, facing the bay … */
export const COIN_STAND = v3(PARTY.x + 1.4, 0, PARTY.z);
/** … before the open chest the crabs have set down, its front to Tapsi and the lid open away, so the paws reach down into it. */
export const CHEST_SAND = v3(COIN_STAND.x, 0, COIN_STAND.z - 0.62);
/** The way the crabs carry the chest from the raft (x, z): out past Ole on the right and up the beach. */
export const CARRY_PATH: [number, number][] = [
  [RAFT_X + 1.3, CHEST_Z + RAFT_TO + 0.3],
  [CHEST_SAND.x + 0.2, CHEST_SAND.z - 0.8],
  [CHEST_SAND.x, CHEST_SAND.z],
];
/** Coins at every throw at the end; they fall this fast (m/s²), slower than real, so they can be seen. */
export const COINS_PER_TOSS = 8;
export const COIN_FALL = 6;

/** The top of the bridge's deck at (x, z), or -Infinity off the bridge. */
export function bridgeTop(x: number, z: number) {
  if (Math.abs(x) > BRIDGE_HALF || z > BRIDGE_FROM || z < BRIDGE_TO) return -Infinity;
  return BRIDGE_END + BRIDGE_ARCH * Math.sin((Math.PI * (BRIDGE_FROM - z)) / (BRIDGE_FROM - BRIDGE_TO));
}
