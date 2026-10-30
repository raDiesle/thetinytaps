import { depthScale, HORIZON } from "./layout";

// "Straße malen" (idea N-43): the child draws a road with a finger, and a car, a tractor or a train drives exactly
// along it, through bends and loops, honks at its end and waits there for the next road. The numbers and the
// geometry are here; the drawing and the pointer handling in LaneLayer.tsx.

/** A point in picture units. */
export type Point = [number, number];

/** What drives on a road; each has its own road (asphalt, a dirt track, rails), and they take turns. */
export const LANE_KINDS = ["car", "tractor", "train"] as const;
export type LaneKind = (typeof LANE_KINDS)[number];

/** A new point is added once the finger is this far from the last one. */
export const POINT_STEP = 10;
/** A shorter line was a tap: no road, no vehicle. */
export const MIN_LANE = 50;
/** A road begun this close to a waiting vehicle is that vehicle's next road. */
export const PICK_REACH = 140;
/** How fast a vehicle drives, in picture units per second. */
export const LANE_SPEED = 340;
/** An item wakes up when a vehicle comes this close to its tap area. */
export const WAKE_REACH = 70;
/** Roads stay in the picture until there are more than this many; then the oldest goes. */
export const MAX_LANES = 6;
/** Where the first vehicle starts when a key (not a finger) asks for a road: bottom middle. */
export const KEY_START: Point = [800, 930];

/** The new list of points with `p` added, or the same list when `p` is too close to the last point. */
export function addPoint(points: Point[], p: Point): Point[] {
  const last = points[points.length - 1];
  if (last && Math.hypot(p[0] - last[0], p[1] - last[1]) < POINT_STEP) return points;
  return [...points, p];
}

/** Length of the road along all its points. */
export function laneLength(points: readonly Point[]) {
  let length = 0;
  for (let i = 1; i < points.length; i++) length += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
  return length;
}

/** The point `s` along the road (clamped to its ends). */
function along(points: readonly Point[], s: number): Point {
  if (points.length === 1 || s <= 0) return points[0];
  let left = s;
  for (let i = 1; i < points.length; i++) {
    const [ax, ay] = points[i - 1];
    const [bx, by] = points[i];
    const step = Math.hypot(bx - ax, by - ay);
    if (left <= step && step > 0) return [ax + ((bx - ax) * left) / step, ay + ((by - ay) * left) / step];
    left -= step;
  }
  return points[points.length - 1];
}

/** How far ahead and behind the heading is measured, so a shaky line doesn't make the vehicle wobble. */
const HEADING_SPAN = 18;

/** Where a vehicle `s` along the road stands, and where it heads (radians, 0 = to the right, y down). */
export function poseAt(points: readonly Point[], s: number): { x: number; y: number; angle: number } {
  const [x, y] = along(points, s);
  const [bx, by] = along(points, s - HEADING_SPAN);
  const [ax, ay] = along(points, s + HEADING_SPAN);
  const angle = ax === bx && ay === by ? 0 : Math.atan2(ay - by, ax - bx);
  return { x, y, angle };
}

/** A smooth path through the points: straight to the first middle, then curves through each point to the next middle. */
export function laneD(points: readonly Point[]) {
  if (points.length === 0) return "";
  const [first, ...rest] = points;
  if (rest.length === 0) return `M${first[0]} ${first[1]}h0.1`;
  let d = `M${first[0]} ${first[1]}`;
  for (let i = 0; i < rest.length - 1; i++) {
    const [x, y] = rest[i];
    const [nx, ny] = rest[i + 1];
    d += ` Q${x} ${y} ${(x + nx) / 2} ${(y + ny) / 2}`;
  }
  const [lx, ly] = rest[rest.length - 1];
  return `${d} L${lx} ${ly}`;
}

/** A vehicle is never smaller than this, so it stays easy to see and tap far back and in the sky. */
const MIN_VEHICLE_SCALE = 0.62;

/** How big a vehicle is at height y: smaller further back, as the picture's things are, down to MIN_VEHICLE_SCALE. */
export const vehicleScale = (y: number) => Math.max(MIN_VEHICLE_SCALE, depthScale(Math.min(1000, Math.max(HORIZON, y))));

/**
 * The vehicle's drawing (facing right, standing on its origin) at the pose: turned along the road, and mirrored
 * when the road goes left, so it never drives upside down.
 */
export function vehicleTransform({ x, y, angle }: { x: number; y: number; angle: number }) {
  const deg = (angle * 180) / Math.PI;
  const left = Math.cos(angle) < 0;
  const scale = vehicleScale(y);
  return left ? `translate(${x} ${y}) rotate(${deg - 180}) scale(${-scale} ${scale})` : `translate(${x} ${y}) rotate(${deg}) scale(${scale})`;
}

/** A road from `from` to `to` for a key press: a gentle bend, so it looks drawn, with points POINT_STEP apart. */
export function bendTo(from: Point, to: Point): Point[] {
  const [ax, ay] = from;
  const [bx, by] = to;
  const length = Math.hypot(bx - ax, by - ay);
  // The bend's control point lies off the middle, at right angles to the straight way.
  const cx = (ax + bx) / 2 + (by - ay) * 0.25;
  const cy = (ay + by) / 2 - (bx - ax) * 0.25;
  const steps = Math.max(2, Math.ceil(length / POINT_STEP));
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const u = 1 - t;
    return [u * u * ax + 2 * u * t * cx + t * t * bx, u * u * ay + 2 * u * t * cy + t * t * by] as Point;
  });
}
