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
// (incisors are chisels, molars are flat). From the last molar to the front
// tooth the chewing surface gets narrower step by step (21, 17.5, 13.5, 9, 5.4):
// a jump from the two broad molars to three equally thin teeth looked odd from
// above (user feedback, November 2026; `jaw.test.ts`).
const TEETH = [
  { from: 0.4, to: 14.4, height: 30, depth: 18, edge: 0.3 },
  { from: 15, to: 27.6, height: 28, depth: 21, edge: 0.43 },
  { from: 28.2, to: 42, height: 31, depth: 25, edge: 0.54 },
  { from: 42.6, to: 60.4, height: 24, depth: 28, edge: 0.625 },
  { from: 61, to: 80, height: 23, depth: 30, edge: 0.7 },
];
export const TEETH_PER_SIDE = TEETH.length;
/** Where each tooth stands along the arch (degrees from the middle) and how tall it is, front tooth first: the story's teeth come from it too. */
export const TOOTH_ARCS = TEETH.map(({ from, to, height }) => ({ from, to, height }));

/** How deep each tooth's chewing surface is, front tooth first, in model units. */
export const CHEWING_DEPTHS = TEETH.map((t) => t.depth * t.edge);

/** Half width and depth of the outer arch curve. */
const ARCH = { lower: { a: 108, b: 100 }, upper: { a: 114, b: 106 } };
/**
 * How much wider than deep the whole mouth is drawn – arches, teeth, gums, tongue, palate and lips alike: the mirror
 * is seen on a screen held sideways, and a wider mouth fills more of it, so the teeth and the brushing show bigger
 * (user request, November 2026). The teeth grow wider with it, never taller.
 */
export const MOUTH_WIDE = 1.3;
const UPPER_SCALE = 1.15;
/** How far the upper front teeth reach down over the lower ones when biting. */
const OVERBITE = 7;
const GAP_OPEN = 104;
const GUM = 18;
/**
 * How far the gum's cheek-side wall reaches from the tooth's foot: far past the lips, which cut it off, so the gum
 * always runs into the lips with no dark gap between them, seen from the front or the side (user feedback, November 2026).
 */
const GUM_CHEEK = 110;
const SAMPLES = 4;
/**
 * The gum line, as a share of the tooth's height from its base: the gum
 * reaches furthest up between the teeth (the papillae) and arches down to
 * show the crown in the middle of each tooth, so the teeth grow out of the
 * gum instead of standing on it. Front teeth arch more than molars.
 */
const GUM_LINE = { papilla: [0.36, 0.34, 0.32, 0.24, 0.22], middle: 0.06 };
/**
 * How far the gum's walls reach up over the foot of the crown, as a share of the tooth's height. They are drawn
 * over the tooth, so its ink outline ends under the gum and the tooth grows out of it instead of standing in it.
 */
const GUM_OVERLAP = 0.08;
/**
 * On the tongue side the gum has no papillae: its edge runs along the whole row as one smooth arc (`innerGumAt`), as
 * high as this share of each tooth's height. Seen into the open mouth that edge is where the gum meets the palate or
 * the tongue, and papillae there made a row of sharp spikes (user feedback, November 2026).
 */
const INNER_GUM_LINE = 0.14;

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
  /** The tooth it holds (same key as the tooth). */
  key: string;
  center: Vec3;
  /** The top between the walls lies under the tooth; the outer and inner walls go over its foot. */
  faces: Face[];
  /** The gum's edge on the cheek side and on the tongue side, drawn darker so the line where the tooth comes out shows. */
  rims: Record<"outer" | "inner", Vec3[]>;
  /**
   * The gum's top only from its cheek-side rim to the tooth's tongue side, filling the gaps between the crowns and
   * reaching neither past the tooth towards the tongue nor behind the last molar (`lipSideOnly`).
   */
  bite: Face;
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
  return [MOUTH_WIDE * (a - inset) * Math.sin(rad(t)), y, (b - inset) * Math.cos(rad(t))];
}

/** Angles from one end of a tooth to the other, in screen order. */
function sweep(side: Side, from: number, to: number, samples = SAMPLES) {
  const angles = Array.from({ length: samples + 1 }, (_, i) => from + ((to - from) * i) / samples);
  return side === "left" ? angles.map((t) => -t).reverse() : angles;
}

/** How far up the gum reaches at angle `t` (degrees, positive) on tooth `n`, as a share of its height; between teeth it is at its highest. */
function gumLine(n: number, t: number) {
  const spec = TEETH[n];
  const s = (t - spec.from) / (spec.to - spec.from);
  // Behind the last molar the gum goes down again.
  if (s > 1 && n === TEETH.length - 1) return GUM_LINE.middle;
  if (s <= 0 || s >= 1) return GUM_LINE.papilla[n];
  return GUM_LINE.papilla[n] - (GUM_LINE.papilla[n] - GUM_LINE.middle) * Math.sin(Math.PI * s) ** 0.7;
}

/**
 * The tongue-side gum at angle `t` (degrees, either sign): how far in from the cheek side it lies (`inset`), and the
 * height of its edge (`rim`) and of its foot. Each tooth's own values hold at its middle and blend smoothly into its
 * neighbour's between them, so the pieces of gum of all teeth meet in one smooth arc, never in steps or spikes.
 */
export function innerGumAt(jaw: Jaw, t: number, open: number) {
  const at = (n: number) => {
    const { top, base, dir } = levels(jaw, n, open);
    return { inset: TEETH[n].depth + 4, rim: base + (top - base) * (INNER_GUM_LINE + GUM_OVERLAP), foot: base - dir * GUM };
  };
  const middles = TEETH.map((s) => (s.from + s.to) / 2);
  const a = Math.abs(t);
  const n = middles.findIndex((_, i) => i === middles.length - 1 || a < middles[i + 1]);
  if (a <= middles[0] || n === middles.length - 1) return at(a <= middles[0] ? 0 : n);
  const s = (a - middles[n]) / (middles[n + 1] - middles[n]);
  const k = s * s * (3 - 2 * s);
  const [p, q] = [at(n), at(n + 1)];
  return { inset: p.inset + (q.inset - p.inset) * k, rim: p.rim + (q.rim - p.rim) * k, foot: p.foot + (q.foot - p.foot) * k };
}

const lerp3 = (a: Vec3, b: Vec3, k: number): Vec3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];

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
  // Only the crown shows: the faces end where the gum begins.
  const line = angles.map((t) => gumLine(id.n, Math.abs(t)));
  const outerGum = outerBase.map((p, i) => lerp3(p, outerTop[i], line[i]));
  // The tongue side's gum runs in a smooth arc with no papillae (`innerGumAt`), always above this.
  const innerGum = innerBase.map((p, i) => lerp3(p, innerTop[i], GUM_LINE.middle));

  const face = (kind: FaceKind, points: Vec3[]): Face => ({ kind, points, normal: normalOf(points, center), center: mean(points) });
  const faces = [
    face("outer", [...outerTop, ...[...outerGum].reverse()]),
    face("top", [...outerTop, ...[...innerTop].reverse()]),
    face("inner", [...innerTop, ...[...innerGum].reverse()]),
    face("side", [outerTop[0], outerGum[0], innerGum[0], innerTop[0]]),
    face("side", [outerTop[last], outerGum[last], innerGum[last], innerTop[last]]),
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
  const { top, base, dir } = levels(jaw, n, open);
  const next = TEETH[n + 1];
  // Reach halfway into the gap to the next tooth so the gum has no holes.
  const to = next ? (spec.to + next.from) / 2 + 0.5 : spec.to + 4;
  const from = n === 0 ? 0 : (TEETH[n - 1].to + spec.from) / 2 - 0.5;
  // More points than a tooth has, so the gum line arches smoothly up between the teeth.
  const angles = sweep(side, from, to, 4 * SAMPLES);
  const rim = (t: number) => base + (top - base) * (gumLine(n, Math.abs(t)) + GUM_OVERLAP);
  const outerRim = angles.map((t) => archPoint(jaw, t, -3, rim(t)));
  const outerFoot = angles.map((t) => archPoint(jaw, t, -3, base - dir * GUM_CHEEK));
  const inner = angles.map((t) => innerGumAt(jaw, t, open));
  const innerRim = angles.map((t, i) => archPoint(jaw, t, inner[i].inset, inner[i].rim));
  const innerFoot = angles.map((t, i) => archPoint(jaw, t, inner[i].inset, inner[i].foot));
  const center = mean([...outerRim, ...outerFoot, ...innerRim, ...innerFoot]);
  const face = (kind: FaceKind, points: Vec3[]): Face => ({ kind, points, normal: normalOf(points, center), center: mean(points) });
  // The bite's tongue-side edge runs along the tooth's own tongue side at the rim's height, so the crown covers it.
  const biteAngles = angles.filter((t) => Math.abs(t) <= spec.to);
  const toothInside = (t: number) => spec.depth - spec.depth * (1 - spec.edge) * Math.min(1, gumLine(n, Math.abs(t)) + GUM_OVERLAP);
  const bite = face("top", [
    ...biteAngles.map((t) => archPoint(jaw, t, -3, rim(t))),
    ...[...biteAngles].reverse().map((t) => archPoint(jaw, t, toothInside(t), rim(t))),
  ]);
  return {
    jaw,
    key: toothKey({ jaw, side, n }),
    center,
    bite,
    rims: { outer: outerRim, inner: innerRim },
    faces: [
      face("outer", [...outerRim, ...[...outerFoot].reverse()]),
      face("top", [...outerRim, ...[...innerRim].reverse()]),
      face("inner", [...innerRim, ...[...innerFoot].reverse()]),
    ],
  };
}

/**
 * A piece of gum with nothing of it on the tongue side of its tooth: its cheek-side wall and its `bite`. A row tipped
 * to show its chewing surfaces shows no gum past the teeth towards the tongue – above the lower teeth, below the upper
 * ones – and none behind the last molar (user feedback, November 2026): a band of lighter gum there lay between the
 * teeth and the tongue like a second row.
 */
export function lipSideOnly(gum: GumPiece): GumPiece {
  return { ...gum, faces: [gum.faces.find((f) => f.kind === "outer")!, gum.bite], rims: { outer: gum.rims.outer, inner: [] } };
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
  const tongue = ring(28, (s) => [MOUTH_WIDE * 70 * Math.cos(s), lowerFloor + 8 + 6 * Math.max(0, Math.sin(s)), 30 + 58 * Math.sin(s)]);
  const palate = ring(28, (s) => [MOUTH_WIDE * 82 * Math.cos(s), upperRoof + 4, 22 + 66 * Math.sin(s)]);

  // The lips: a wide grin when biting, a big round "Aaah" when open. The corners sit further back.
  // Wide enough that a band of gum shows above and below the teeth, past the lips' thick outline.
  const width = MOUTH_WIDE * (150 + 6 * open);
  const above = 64 + 50 * open;
  const below = 60 + 48 * open;
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

/**
 * Seen from the side (user feedback, November 2026): with the head turned far, the mouth is a profile – the lips seen
 * only from the side, ending at the face's front, and the teeth inside the mouth behind them, every one growing out of
 * its gum, the front teeth too: they only show their narrow side and their front edge in the gap between the lips'
 * ends. Front teeth standing out past the face with no gum looked plainly wrong (user feedback, November 2026). How far
 * a view is such a profile, 0 to 1: it comes in over the last part of a turn, so nothing jumps while the head glides
 * there, and never with the mouth open.
 */
export const PROFILE_YAW = { from: 50, full: 66 };
export function profileOf(view: View): number {
  const k = Math.min(1, Math.max(0, (Math.abs(view.yaw) - PROFILE_YAW.from) / (PROFILE_YAW.full - PROFILE_YAW.from)));
  return k * k * (3 - 2 * k) * Math.max(0, 1 - 2 * view.open);
}

/**
 * Where the lips' middle lies in a profile: just above the upper gum's edge and below the lower one's, so a band of gum
 * shows over and under the teeth, and a little in front of the front teeth (whose fronts reach `ARCH.upper.b`), where
 * the face's round runs (`midline`): the teeth stay inside the mouth.
 */
const PROFILE_LIPS = { upper: 40, lower: -34, z: 118 };

/** The lips as the view shows them: in a profile the front of the lips is pulled onto the gums, in front of the teeth. */
export function viewedLips(lips: Vec3[], view: View): Vec3[] {
  const k = profileOf(view);
  if (!k) return lips;
  const width = Math.max(...lips.map((p) => Math.abs(p[0])));
  return lips.map(([x, y, z]) => {
    const front = k * Math.max(0, 1 - (x / width) ** 2) ** 2;
    const to = y > 0 ? PROFILE_LIPS.upper : PROFILE_LIPS.lower;
    return [x, y + (to - y) * front, z + (PROFILE_LIPS.z - z) * front];
  });
}

/** A point of the face's middle line (x = 0) at height y on the head, with the nose standing out of it. */
function midline(y: number): Vec3 {
  const v = Math.max(-1, Math.min(1, (HEAD_MIDDLE[1] - y) / HEAD_RADIUS));
  const nose = 26 * Math.exp(-(((y - noseY()) / 20) ** 2));
  return [0, y, HEAD_MIDDLE[2] + FACE_BULGE * HEAD_RADIUS * Math.sqrt(1 - v * v) + nose];
}
/** The nose's height on the head (the story's nose, 10 head units below the middle). */
const noseY = () => HEAD_MIDDLE[1] - (10 / 165) * HEAD_RADIUS;

/**
 * The face's outline in a profile, from the top of the head down to its bottom: the middle line of the face with its
 * nose, running in onto the lips' ends: two runs of equal length, down to the upper lip's end and on from the lower
 * one's. Whatever lies beyond it (and beyond the straight way between the lips' ends, in front of the teeth) is the far
 * side of the head and is not seen; the outline itself is never drawn across the mouth (`profileOutline` in `mouth.tsx`).
 */
export function profileLine(lips: Vec3[]): Vec3[] {
  const ends = lips.filter((p) => Math.abs(p[0]) < 1e-6);
  const upper = ends.reduce((a, b) => (b[1] > a[1] ? b : a));
  const lower = ends.reduce((a, b) => (b[1] < a[1] ? b : a));
  /** Over this height the skin runs in onto a lip's end. */
  const ease = 46;
  const along = (from: number, to: number, end: Vec3) =>
    Array.from({ length: 33 }, (_, i) => {
      const y = from + ((to - from) * i) / 32;
      const p = midline(y);
      const near = Math.max(0, 1 - Math.abs(y - end[1]) / ease) ** 2;
      return [0, y, p[2] + (end[2] - p[2]) * near] as Vec3;
    });
  const top = HEAD_MIDDLE[1] + HEAD_RADIUS;
  const bottom = HEAD_MIDDLE[1] - HEAD_RADIUS;
  return [...along(top, upper[1], upper), ...along(lower[1], bottom, lower)];
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

/** How far a point lies from the closed outline `points`, negative inside it. */
export function distanceOutside(p: { x: number; y: number }, points: { x: number; y: number }[]): number {
  if (insideBy(p, points, 0)) return -1;
  let nearest = Number.POSITIVE_INFINITY;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [a, b] = [points[j], points[i]];
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const k = Math.max(0, Math.min(1, ((p.x - b.x) * dx + (p.y - b.y) * dy) / (dx * dx + dy * dy || 1)));
    nearest = Math.min(nearest, Math.hypot(p.x - (b.x + k * dx), p.y - (b.y + k * dy)));
  }
  return nearest;
}

/**
 * The child's head round the mouth: its middle in the model and its radius. Laid out like the story's child
 * (origin.tsx), the mouth in the lower half and the eyes above the middle, so the end's whole face is the same child
 * (user feedback, November 2026: with the head's middle at the mouth the eyes were squeezed into its top edge).
 */
export const HEAD_MIDDLE: Vec3 = [0, 165, -60];
export const HEAD_RADIUS = 350;
/** How far the face bulges out in front of the head's middle, as a share of its radius: the eyes and nose sit there. */
const FACE_BULGE = 0.55;

/**
 * A point on the face, from where it lies on a flat drawing of the head: `x` across and `y` down, as shares of its
 * radius from its middle (the story's head, face.tsx). It sits on the round of the face, so it turns with the head;
 * past the head's edge (hair, pigtails) it lies in the plane of the head's middle.
 */
export function onHead(x: number, y: number): Vec3 {
  const round = Math.sqrt(Math.max(0, 1 - x * x - y * y));
  return [x * HEAD_RADIUS, HEAD_MIDDLE[1] - y * HEAD_RADIUS, HEAD_MIDDLE[2] + FACE_BULGE * HEAD_RADIUS * round];
}

/** Which way the face looks at a point of `onHead`, for how far a part there faces the viewer. */
export function headNormal(x: number, y: number): Vec3 {
  return [x, -y, Math.sqrt(Math.max(0, 1 - x * x - y * y))];
}

/** The cheeks' size about their middle, across and up, in model units (times the view's zoom on the picture). */
export const CHEEK = { rx: 46, ry: 29 };
/** Room between a cheek's edge and the lips' outline: half the thick lip (34 wide) and a gap of skin. */
export const CHEEK_GAP = 17 + 16;
/** Where a cheek sits on a shut mouth's face: beside the nose, below the eyes. */
const CHEEK_AT: Vec3 = [200, 150, 84];
/** How far a cheek may be pushed up and out by a wide mouth before it would leave the face. */
const CHEEK_PUSH = 90;

/** A cheek in the picture: its middle, its size and how far it is turned towards the viewer. */
export interface CheekSpot {
  x: number;
  y: number;
  rx: number;
  ry: number;
  facing: number;
}

/**
 * Where the cheeks lie, kept clear of the lips: a wide open or stretched mouth pushes them up and out, as a real one
 * does, instead of the blush lying on the corner of the mouth. A cheek turned away, or one that would be pushed off
 * the face, is left out.
 */
export function cheekSpots(project: Projector, lips: { x: number; y: number }[]): CheekSpot[] {
  const head = { ...project.point(HEAD_MIDDLE), r: HEAD_RADIUS * project.zoom };
  const xs = lips.map((p) => p.x);
  const ys = lips.map((p) => p.y);
  const middle = { x: (Math.min(...xs) + Math.max(...xs)) / 2, y: (Math.min(...ys) + Math.max(...ys)) / 2 };
  const spots: CheekSpot[] = [];
  for (const s of [-1, 1]) {
    const [x, y, z] = CHEEK_AT;
    const facing = project.facing([(s * x) / 200, 0.1, 0.95]);
    if (facing <= 0.15) continue;
    const at = project.point([s * x, y, z]);
    const rx = CHEEK.rx * project.zoom * Math.max(0.4, Math.min(1, facing));
    const ry = CHEEK.ry * project.zoom;
    // Measured as a circle as wide as the cheek, so it keeps its gap in every direction.
    const reach = Math.max(rx, ry) + CHEEK_GAP;
    // Away from the mouth's middle, more up than out.
    const away = { x: at.x - middle.x, y: Math.min(at.y - middle.y, 0) - Math.abs(at.x - middle.x) * 0.6 };
    const length = Math.hypot(away.x, away.y) || 1;
    for (let push = 0; push <= CHEEK_PUSH; push += 3) {
      const spot = { x: at.x + (away.x / length) * push, y: at.y + (away.y / length) * push };
      if (distanceOutside(spot, lips) < reach) continue;
      if (Math.hypot(spot.x - head.x, spot.y - head.y) + Math.max(rx, ry) > head.r - 6) break;
      spots.push({ ...spot, rx, ry, facing });
      break;
    }
  }
  return spots;
}

/** A point on a tooth's face, `i` steps along the tooth from one end, half way between its long edges. */
export function alongFace(face: Face, i: number): Vec3 {
  const a = face.points[i];
  const b = face.points[face.points.length - 1 - i];
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
}

/** A face's line from one end of the tooth to the other, half way between its long edges. */
export const midLine = (face: Face): Vec3[] => Array.from({ length: face.points.length / 2 }, (_, i) => alongFace(face, i));

/** How far inside the lips' outline the teeth being brushed stay, from end to end: past the thick lip (34 wide), so all of them shows. */
export const TOOTH_CLEAR = 24;

/** How far a corner of the mouth may be pulled out, as a share of its half width. */
const MAX_STRETCH = 1.8;

/** How far each corner of the mouth is pulled out sideways, as a factor of its half width: 1 not at all. */
export interface CornerStretch {
  left: number;
  right: number;
}

export const NO_STRETCH: CornerStretch = { left: 1, right: 1 };

/** A face counts as seen once it faces the viewer at least this much. */
export const MIN_FACING = 0.03;

/** The teeth being brushed as the mirror shows them: each seen face's line from end to end, in picture coordinates. */
export function brushedPoints(model: MouthModel, all: ReturnType<typeof projectors>, zone: { surface: Surface; teeth: ToothId[] }): Point2[] {
  return zone.teeth.flatMap((id) => {
    const face = model.teeth.find((t) => t.key === toothKey(id))!.faces.find((f) => f.kind === zone.surface)!;
    return all[id.jaw].facing(face.normal) > MIN_FACING ? midLine(face).map(all[id.jaw].point) : [];
  });
}

const middleOf = (lips: Point2[]) => {
  const xs = lips.map((p) => p.x);
  return (Math.min(...xs) + Math.max(...xs)) / 2;
};

/** The lips with each corner pulled out sideways by its factor, about the middle of the mouth. */
export function stretchLips(lips: Point2[], { left, right }: CornerStretch): Point2[] {
  const middle = middleOf(lips);
  return lips.map((p) => (p.x === middle ? p : { ...p, x: middle + (p.x - middle) * (p.x < middle ? left : right) }));
}

/**
 * How far the corners are pulled out, as a cheek is when the brush works behind it, so every point of `keep` (the
 * teeth being brushed) lies at least `margin` inside the opening. Seen from the side the near corner of the mouth
 * would otherwise hide the back teeth and their monsters. Each side stretches on its own about the middle of the
 * mouth, only as far as needed; a point no stretch sideways can free (above or below the lips) is left alone.
 */
export function cornerStretch(lips: Point2[], keep: { x: number; y: number }[], margin: number): CornerStretch {
  const middle = middleOf(lips);
  const stretch = { ...NO_STRETCH };
  for (const side of ["left", "right"] as const) {
    const sign = side === "left" ? -1 : 1;
    const at = (k: number) => stretchLips(lips, { ...stretch, [side]: k });
    const widest = at(MAX_STRETCH);
    const mine = keep.filter((p) => Math.sign(p.x - middle) === sign && insideBy(p, widest, margin));
    const fits = (k: number) => {
      const lipsAt = at(k);
      return mine.every((p) => insideBy(p, lipsAt, margin));
    };
    if (fits(1)) continue;
    let [low, high] = [1, MAX_STRETCH];
    for (let i = 0; i < 12; i++) {
      const k = (low + high) / 2;
      if (fits(k)) high = k;
      else low = k;
    }
    stretch[side] = high;
  }
  return stretch;
}

/** The lips with their corners pulled out as far as the teeth being brushed need (`cornerStretch`). */
export const openCorners = (lips: Point2[], keep: { x: number; y: number }[], margin: number): Point2[] => stretchLips(lips, cornerStretch(lips, keep, margin));

/**
 * The corners while the head turns or the mouth opens: from where they were to where the next step needs them, as far
 * as the glide has come (`k`, 0 to 1). Worked out from each in-between picture instead, the half turned, half open
 * mouth asked for corners far wider than either end, and the lips jumped open and shut within a few frames (user
 * feedback, November 2026, from the turn onto the left outside; `jaw.test.ts`).
 */
export const glideStretch = (from: CornerStretch, to: CornerStretch, k: number): CornerStretch => ({
  left: from.left + (to.left - from.left) * k,
  right: from.right + (to.right - from.right) * k,
});

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

const TIPPED_OFFSET = 30;
const TIPPED_GROWTH = 0.15;
/**
 * How much a tipped jaw's row goes back into the mouth with perspective (1 over the eye's distance, in model units):
 * seen from the front a jaw is projected flat, but tipped to show its chewing or tongue side the back teeth lie much
 * further from the eye, and drawn as big as the front teeth the row ran straight down the sides like a flat horseshoe.
 * With perspective the back teeth grow smaller and bend in towards the mouth's middle – up for the upper row seen from
 * below, down for the lower one seen from above – as if they went away into the mouth (user feedback, November 2026).
 */
export const TIPPED_PERSPECTIVE = 1 / 260;
/**
 * How much flatter a tipped row is drawn than the tip alone would show it, as a share of how far its teeth lie above
 * (or below) the front teeth on the screen: tipped as far as it must be to show the chewing surfaces, the lower row
 * rose in a deep U up the sides, and wide bands of cheek lay between its back teeth and the lips' corners (user
 * feedback, November 2026). Flatter, the back teeth stay lower, out towards the corners.
 */
export const TIPPED_FLATTEN = 0.3;
/** How much of the perspective's bending in a tipped row keeps across: its back teeth still shrink, but stay out towards the corners. */
const TIPPED_ACROSS = 0.6;

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
    // The perspective's middle is the arch's middle, and the front teeth keep their size: only what lies further back
    // than them shrinks towards it, growing in with the tip so nothing jumps as the jaw starts to tip.
    const front = tipped.point([0, anchor[1], ARCH[jaw].b]).depth;
    const far = TIPPED_PERSPECTIVE * k;
    const mid = { x: PICTURE.width / 2, y: PICTURE.height / 2 };
    // The front teeth's height on the screen, which the row is flattened towards (`TIPPED_FLATTEN`).
    const frontY = tipped.point([0, anchor[1], ARCH[jaw].b]).y;
    const flat = 1 - TIPPED_FLATTEN * k;
    return {
      ...tipped,
      point: (p: Vec3) => {
        const q = tipped.point(p);
        const behind = Math.max(0, front - q.depth);
        const f = 1 / (1 + far * behind);
        // Across, the back teeth bend in less, so the row reaches out towards the lips' corners.
        const fx = 1 / (1 + far * TIPPED_ACROSS * behind);
        const y = frontY + (q.y - frontY) * flat;
        return { x: mid.x + (q.x - mid.x) * fx + dx, y: mid.y + (y - mid.y) * f + dy, depth: q.depth };
      },
    };
  };
  return { face, upper: forJaw("upper"), lower: forJaw("lower") };
}

/** From how far open the mouth shows its dark between the rows; with the teeth together only cheek shows round them. */
export const DARK_FROM = 0.3;

/** The smallest convex outline round `points` (Andrew's monotone chain). */
export function convexHullOf<P extends { x: number; y: number }>(points: P[]): P[] {
  const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  if (sorted.length < 3) return sorted;
  const cross = (o: P, a: P, b: P) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const half = (list: P[]) => {
    const out: P[] = [];
    for (const p of list) {
      while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], p) <= 0) out.pop();
      out.push(p);
    }
    out.pop();
    return out;
  };
  return [...half(sorted), ...half([...sorted].reverse())];
}
