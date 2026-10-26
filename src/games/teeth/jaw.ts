// A tiny 3D model of a child's mouth: twenty milk teeth on two horseshoe
// arches, the gums under them, tongue, palate and lips. It is turned and
// tilted like a camera would see it and drawn as flat cartoon faces, so the
// picture can show the mouth open or closed, from the front, from the side,
// from above or from below.
//
// Axes: x to the child's left as seen on screen (negative is screen-left),
// y up, z towards the viewer. The arches curve around the y axis.

export type Jaw = "upper" | "lower";
export type Side = "left" | "right";
/** Where on a tooth: the cheek side, the chewing surface, or the tongue side. */
export type Surface = "outer" | "top" | "inner";

export interface ToothId {
  jaw: Jaw;
  side: Side;
  /** 0 is the front tooth, 4 the last molar. */
  n: number;
}

export const toothKey = ({ jaw, side, n }: ToothId) => `${jaw}-${side}-${n}`;

export type Vec3 = [number, number, number];

/** How the mouth is shown: 0 closed (teeth together) to 1 wide open; angles in degrees. */
export interface View {
  open: number;
  /** Positive looks down from above, negative up from below. */
  pitch: number;
  /** Positive turns the head so its screen-left side comes into view. */
  yaw: number;
  /** The point that ends up in the middle of the picture. */
  look: Vec3;
  /** How close up: 1.5 shows the mouth and a bit of the face around it. */
  zoom: number;
  /**
   * Extra tilt for one jaw, like in a picture book: the face stays in front
   * (so the mouth reads as open), while the jaw being brushed tips forward to
   * show its chewing or tongue side. Positive shows it from above.
   */
  tilt: Record<Jaw, number>;
}

export const lerpView = (a: View, b: View, k: number): View => ({
  open: a.open + (b.open - a.open) * k,
  pitch: a.pitch + (b.pitch - a.pitch) * k,
  yaw: a.yaw + (b.yaw - a.yaw) * k,
  zoom: a.zoom + (b.zoom - a.zoom) * k,
  tilt: { upper: a.tilt.upper + (b.tilt.upper - a.tilt.upper) * k, lower: a.tilt.lower + (b.tilt.lower - a.tilt.lower) * k },
  look: [0, 1, 2].map((i) => a.look[i] + (b.look[i] - a.look[i]) * k) as Vec3,
});

export const PICTURE = { width: 440, height: 400 };

// Milk teeth from the front: two incisors, the canine, two molars. Angles are
// positions along the arch in degrees; depth is from cheek side to tongue
// side; edge is how much of that depth is left as chewing surface on top
// (incisors are chisels, molars are flat).
const TEETH = [
  { from: 0.4, to: 14.4, height: 30, depth: 17, edge: 0.22 },
  { from: 15, to: 27.6, height: 28, depth: 17, edge: 0.25 },
  { from: 28.2, to: 42, height: 31, depth: 20, edge: 0.3 },
  { from: 42.6, to: 60.4, height: 24, depth: 28, edge: 0.7 },
  { from: 61, to: 80, height: 23, depth: 30, edge: 0.7 },
];
export const TEETH_PER_SIDE = TEETH.length;

/** Half width and depth of the outer arch curve. */
const ARCH = { lower: { a: 108, b: 100 }, upper: { a: 114, b: 106 } };
const UPPER_SCALE = 1.15;
/** How far the upper front teeth reach down over the lower ones when biting. */
const OVERBITE = 7;
const GAP_OPEN = 124;
const GUM = 18;
const SAMPLES = 4;

const rad = (deg: number) => (deg * Math.PI) / 180;
const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (a: Vec3, k: number): Vec3 => [a[0] * k, a[1] * k, a[2] * k];
const mean = (points: Vec3[]) => scale(points.reduce(add, [0, 0, 0]), 1 / points.length);

/** Newell's method, flipped to point away from `inside`. */
function normalOf(points: Vec3[], inside: Vec3): Vec3 {
  const n: Vec3 = [0, 0, 0];
  points.forEach((p, i) => {
    const q = points[(i + 1) % points.length];
    n[0] += (p[1] - q[1]) * (p[2] + q[2]);
    n[1] += (p[2] - q[2]) * (p[0] + q[0]);
    n[2] += (p[0] - q[0]) * (p[1] + q[1]);
  });
  const length = Math.hypot(...n) || 1;
  const out = add(mean(points), scale(inside, -1));
  const sign = n[0] * out[0] + n[1] * out[1] + n[2] * out[2] < 0 ? -1 : 1;
  return scale(n, sign / length);
}

export type FaceKind = Surface | "side";

export interface Face {
  kind: FaceKind;
  points: Vec3[];
  normal: Vec3;
  center: Vec3;
}

export interface Tooth {
  id: ToothId;
  key: string;
  center: Vec3;
  faces: Face[];
  shine: Vec3[];
  /** The groove across a molar's chewing surface. */
  groove?: Vec3[];
}

export interface GumPiece {
  jaw: Jaw;
  center: Vec3;
  faces: Face[];
}

/** Y of the chewing plane and of the gum line for a jaw. */
function levels(jaw: Jaw, n: number, open: number) {
  const gap = GAP_OPEN * open;
  const spec = TEETH[n];
  if (jaw === "lower") {
    const top = -gap / 2;
    return { top, base: top - spec.height, dir: 1 };
  }
  const reach = n <= 2 ? OVERBITE * (1 - open) : 0;
  const top = gap / 2 - reach;
  return { top, base: top + spec.height * UPPER_SCALE + reach, dir: -1 };
}

/** A point on the arch at angle `t` (degrees from the front, negative is screen-left), `inset` in from the cheek side. */
function archPoint(jaw: Jaw, t: number, inset: number, y: number): Vec3 {
  const { a, b } = ARCH[jaw];
  return [(a - inset) * Math.sin(rad(t)), y, (b - inset) * Math.cos(rad(t))];
}

/** Angles from one end of a tooth to the other, in screen order. */
function sweep(side: Side, from: number, to: number) {
  const angles = Array.from({ length: SAMPLES + 1 }, (_, i) => from + ((to - from) * i) / SAMPLES);
  return side === "left" ? angles.map((t) => -t).reverse() : angles;
}

function buildTooth(id: ToothId, open: number): Tooth {
  const spec = TEETH[id.n];
  const { top, base, dir } = levels(id.jaw, id.n, open);
  const angles = sweep(id.side, spec.from, spec.to);
  const outerTop = angles.map((t) => archPoint(id.jaw, t, 0, top));
  const outerBase = angles.map((t) => archPoint(id.jaw, t, 0, base));
  const innerTop = angles.map((t) => archPoint(id.jaw, t, spec.depth * spec.edge, top));
  const innerBase = angles.map((t) => archPoint(id.jaw, t, spec.depth, base));
  const center = mean([...outerTop, ...outerBase, ...innerTop, ...innerBase]);
  const last = SAMPLES;

  const face = (kind: FaceKind, points: Vec3[]): Face => ({ kind, points, normal: normalOf(points, center), center: mean(points) });
  const faces = [
    face("outer", [...outerTop, ...[...outerBase].reverse()]),
    face("top", [...outerTop, ...[...innerTop].reverse()]),
    face("inner", [...innerTop, ...[...innerBase].reverse()]),
    face("side", [outerTop[0], outerBase[0], innerBase[0], innerTop[0]]),
    face("side", [outerTop[last], outerBase[last], innerBase[last], innerTop[last]]),
  ];

  // A shine on the cheek side, a little in from the left edge.
  const shineAt = (k: number) => {
    const t = angles[0] + (angles[last] - angles[0]) * 0.28;
    return archPoint(id.jaw, t, -0.5, top + (base - top) * k);
  };
  const shine = [shineAt(0.35), shineAt(0.62)];

  let groove: Vec3[] | undefined;
  if (spec.edge > 0.5) {
    const middle = (i: number) => mean([outerTop[i], innerTop[i]]);
    groove = [1, 2, 3].map((i) => add(middle(i), [0, dir * 0.5, 0]));
  }
  return { id, key: toothKey(id), center, faces, shine, groove };
}

function buildGum(jaw: Jaw, side: Side, n: number, open: number): GumPiece {
  const spec = TEETH[n];
  const { base, dir } = levels(jaw, n, open);
  const next = TEETH[n + 1];
  // Reach halfway into the gap to the next tooth so the gum has no holes.
  const to = next ? (spec.to + next.from) / 2 + 0.5 : spec.to + 4;
  const from = n === 0 ? 0 : (TEETH[n - 1].to + spec.from) / 2 - 0.5;
  const angles = sweep(side, from, to);
  const bottom = base - dir * GUM;
  const outerRim = angles.map((t) => archPoint(jaw, t, -3, base));
  const outerFoot = angles.map((t) => archPoint(jaw, t, -3, bottom));
  const innerRim = angles.map((t) => archPoint(jaw, t, spec.depth + 4, base));
  const innerFoot = angles.map((t) => archPoint(jaw, t, spec.depth + 4, bottom));
  const center = mean([...outerRim, ...outerFoot, ...innerRim, ...innerFoot]);
  const face = (kind: FaceKind, points: Vec3[]): Face => ({ kind, points, normal: normalOf(points, center), center: mean(points) });
  return {
    jaw,
    center,
    faces: [
      face("outer", [...outerRim, ...[...outerFoot].reverse()]),
      face("top", [...outerRim, ...[...innerRim].reverse()]),
      face("inner", [...innerRim, ...[...innerFoot].reverse()]),
    ],
  };
}

export interface MouthModel {
  teeth: Tooth[];
  gums: GumPiece[];
  tongue: Vec3[];
  palate: Vec3[];
  lips: Vec3[];
}

const JAWS: Jaw[] = ["upper", "lower"];
const SIDES: Side[] = ["left", "right"];

export const ALL_TEETH: ToothId[] = JAWS.flatMap((jaw) => SIDES.flatMap((side) => TEETH.map((_, n) => ({ jaw, side, n }))));

const ring = (count: number, at: (s: number) => Vec3) => Array.from({ length: count }, (_, i) => at((i / count) * Math.PI * 2));

/** Everything in the mouth, `open` from 0 (biting) to 1 (wide open). */
export function buildMouth(open: number): MouthModel {
  const teeth = ALL_TEETH.map((id) => buildTooth(id, open));
  const gums = JAWS.flatMap((jaw) => SIDES.flatMap((side) => TEETH.map((_, n) => buildGum(jaw, side, n, open))));
  const lowerFloor = levels("lower", 3, open).base;
  const upperRoof = levels("upper", 3, open).base;
  const tongue = ring(28, (s) => [70 * Math.cos(s), lowerFloor + 8 + 6 * Math.max(0, Math.sin(s)), 30 + 58 * Math.sin(s)]);
  const palate = ring(28, (s) => [82 * Math.cos(s), upperRoof + 4, 22 + 66 * Math.sin(s)]);

  // The lips: a wide grin when biting, a big round "Aaah" when open. The corners sit further back.
  const width = 150 + 6 * open;
  const above = 58 + 64 * open;
  const below = 54 + 62 * open;
  const boxy = 3.4 - 1 * open;
  const lips = ring(40, (s) => {
    const c = Math.cos(s);
    const sn = Math.sin(s);
    const x = width * Math.sign(c) * Math.abs(c) ** (2 / boxy);
    const across = (x / width) ** 2;
    // Corners turn up into a smile when the teeth are together.
    const smile = 14 * across * (1 - open);
    const y = (sn > 0 ? above : below) * Math.sign(sn) * Math.abs(sn) ** (2 / boxy) + smile;
    return [x, y, 126 - 56 * across];
  });

  return { teeth, gums, tongue, palate, lips };
}

export interface Point2 {
  x: number;
  y: number;
  depth: number;
}

/**
 * Whether `p` lies inside the closed outline `points` and at least `margin`
 * away from its edge – used for "inside the lip opening, not on the lip".
 */
export function insideBy(p: { x: number; y: number }, points: { x: number; y: number }[], margin: number): boolean {
  let inside = false;
  let nearest = Number.POSITIVE_INFINITY;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const a = points[j];
    const b = points[i];
    if (b.y > p.y !== a.y > p.y && p.x < ((a.x - b.x) * (p.y - b.y)) / (a.y - b.y) + b.x) inside = !inside;
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const k = Math.max(0, Math.min(1, ((p.x - b.x) * dx + (p.y - b.y) * dy) / (dx * dx + dy * dy || 1)));
    nearest = Math.min(nearest, Math.hypot(p.x - (b.x + k * dx), p.y - (b.y + k * dy)));
  }
  return inside && nearest >= margin;
}

/** Turns 3D points into picture coordinates for a view. */
export function projector(view: View) {
  const yaw = rad(view.yaw);
  const pitch = rad(view.pitch);
  const [cy, sy, cp, sp] = [Math.cos(yaw), Math.sin(yaw), Math.cos(pitch), Math.sin(pitch)];
  const turn = ([x, y, z]: Vec3) => {
    const x1 = x * cy + z * sy;
    const z1 = -x * sy + z * cy;
    return { x: x1, y: -y * cp + z1 * sp, depth: z1 * cp + y * sp };
  };
  const origin = turn(view.look);
  const point = (p: Vec3): Point2 => {
    const r = turn(p);
    return { x: PICTURE.width / 2 + (r.x - origin.x) * view.zoom, y: PICTURE.height / 2 + (r.y - origin.y) * view.zoom, depth: r.depth };
  };
  /** How much a surface with normal `n` faces the viewer, -1 to 1. */
  const facing = (n: Vec3) => turn(n).depth;
  /** Which way `n` points on the screen. */
  const direction = (n: Vec3) => {
    const r = turn(n);
    return { x: r.x, y: r.y };
  };
  return { point, facing, direction, zoom: view.zoom };
}

export type Projector = ReturnType<typeof projector>;

const TIPPED_OFFSET = 34;
const TIPPED_GROWTH = 0.15;

/** One projector for the face and lips, and one for each jaw, tipped about the middle of its chewing surface. */
export function projectors(view: View): { face: Projector } & Record<Jaw, Projector> {
  const face = projector(view);
  const forJaw = (jaw: Jaw): Projector => {
    const tilt = view.tilt[jaw];
    if (Math.abs(tilt) < 0.01) return face;
    const anchor: Vec3 = [0, levels(jaw, 3, view.open).top, 50];
    // The more it tips, the more it moves into the middle of the open mouth and the bigger it gets.
    const k = Math.min(1, Math.abs(tilt) / 60);
    const at = face.point(anchor);
    const middle = PICTURE.height / 2 + (jaw === "lower" ? 1 : -1) * TIPPED_OFFSET;
    const tipped = projector({ ...view, pitch: view.pitch + tilt, look: anchor, zoom: view.zoom * (1 + TIPPED_GROWTH * k) });
    const dx = at.x - PICTURE.width / 2;
    const dy = at.y + (middle - at.y) * k - PICTURE.height / 2;
    return {
      ...tipped,
      point: (p: Vec3) => {
        const q = tipped.point(p);
        return { x: q.x + dx, y: q.y + dy, depth: q.depth };
      },
    };
  };
  return { face, upper: forJaw("upper"), lower: forJaw("lower") };
}
