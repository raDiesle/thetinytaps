import { useRef, type CSSProperties } from "react";
import type { Projector, Surface, ToothId, Vec3 } from "./jaw";
import type { Motion } from "./steps";

// The toothbrush as a few small 3D boxes (bristles, head, neck, grip), held
// the way dentists teach it for each side of the teeth, so it turns and
// foreshortens with the mouth:
// - chewing surfaces: bristles down on the teeth, head along the row, handle
//   out of the front of the mouth; scrub back and forth along the row.
// - outside: head in the cheek pocket, along the row, handle forward out of
//   the corner of the mouth (not back through the cheek); circles that cover
//   upper and lower teeth together.
// - inside: handle out of the front of the mouth, bristles tipped towards
//   the gum; wipe from the gum to the tooth ("von Rot nach Weiß").

const INK = "#2a1e5c";

/** Where the brush works now: a point on the tooth, which way the tooth faces, and the tooth row's direction (screen left to right). */
export interface BrushAnchor {
  at: Vec3;
  normal: Vec3;
  along: Vec3;
}

interface Pose {
  at: Vec3;
  /** Along the handle, away from the head. */
  u: Vec3;
  /** From the head through the bristles into the tooth. */
  b: Vec3;
}

const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const scale = (a: Vec3, k: number): Vec3 => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a: Vec3): Vec3 => scale(a, 1 / (Math.hypot(...a) || 1));
/** `a` with the part along the unit vector `n` taken out, made unit length. */
const across = (a: Vec3, n: Vec3) => unit(sub(a, scale(n, dot(a, n))));
export const lerp3 = (a: Vec3, b: Vec3, k: number): Vec3 => add(a, scale(sub(b, a), k));

// Turning from one hold to the next goes through quaternions: blending the
// handle and bristle directions on their own can flip the brush half way.
type Quat = [number, number, number, number];

/** The rotation that takes x to `u` and y to `b`. */
function toQuat(u: Vec3, b: Vec3): Quat {
  const w = cross(u, b);
  const [m00, m10, m20] = u;
  const [m01, m11, m21] = b;
  const [m02, m12, m22] = w;
  const trace = m00 + m11 + m22;
  if (trace > 0) {
    const s = Math.sqrt(trace + 1) * 2;
    return [(m21 - m12) / s, (m02 - m20) / s, (m10 - m01) / s, s / 4];
  }
  if (m00 > m11 && m00 > m22) {
    const s = Math.sqrt(1 + m00 - m11 - m22) * 2;
    return [s / 4, (m01 + m10) / s, (m02 + m20) / s, (m21 - m12) / s];
  }
  if (m11 > m22) {
    const s = Math.sqrt(1 + m11 - m00 - m22) * 2;
    return [(m01 + m10) / s, s / 4, (m12 + m21) / s, (m02 - m20) / s];
  }
  const s = Math.sqrt(1 + m22 - m00 - m11) * 2;
  return [(m02 + m20) / s, (m12 + m21) / s, s / 4, (m10 - m01) / s];
}

function rotate([x, y, z, w]: Quat, v: Vec3): Vec3 {
  const q: Vec3 = [x, y, z];
  return add(v, scale(cross(q, add(cross(q, v), scale(v, w))), 2));
}

/** Part way from one rotation to another, the short way round. */
function blend(a: Quat, b: Quat, k: number): Quat {
  const sign = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3] < 0 ? -1 : 1;
  const q = a.map((x, i) => x + (sign * b[i] - x) * k) as Quat;
  const length = Math.hypot(...q) || 1;
  return q.map((x) => x / length) as Quat;
}

/** How far the handle turns out of the cheek towards the corner of the mouth (0.6 is about 30°). */
const CHEEK_ANGLE = 0.6;

/** How the brush is held on this tooth and side. */
function poseFor(anchor: BrushAnchor, surface: Surface, tooth: ToothId): Pose {
  const into = scale(unit(anchor.normal), -1);
  if (surface === "inner") {
    // The handle comes out of the front of the mouth, between the lips; the bristles tip towards the gum.
    const front: Vec3 = [tooth.side === "left" ? -25 : 25, tooth.jaw === "lower" ? 70 : -70, 240];
    const u = unit(sub(front, anchor.at));
    return { at: anchor.at, u, b: across(into, u) };
  }
  // Front teeth outside: across the front, handle to the side.
  if (surface === "outer" && tooth.n <= 1) return { at: anchor.at, u: across(anchor.along, into), b: into };
  const forward = scale(anchor.along, tooth.side === "left" ? 1 : -1);
  if (surface === "outer") {
    // In the cheek pocket: head along the row, the handle angled out through the corner of the mouth.
    const u = unit(add(forward, scale(anchor.normal, CHEEK_ANGLE)));
    return { at: anchor.at, u, b: across(into, u) };
  }
  // Chewing surfaces: flat on the teeth, along the row, handle out of the front of the mouth.
  return { at: anchor.at, u: across(forward, into), b: into };
}

/** One stroke, circle or wipe takes two beats of the song (112 BPM), calm enough to follow along; `.brush-move` in teeth.css. */
const STROKE_S = 120 / 112;

/** How far each motion pushes the brush, in brush units: along the handle to scrub, round in a circle, from the gum up to wipe. */
const REACH = { scrub: 8, circle: 11, wipe: 10 };

/** A part of the brush: its extent along the handle (u), across the head (w) and along the bristles (b), in brush units. */
export interface Box {
  u: [number, number];
  w: [number, number];
  b: [number, number];
  /** Fills for the faces across the bristles, the sides and the ends. */
  fills: [string, string, string];
  /** Outline width; the small bristle tufts get a thinner one so they don't drown in ink. */
  line?: number;
}

const BLUE: Box["fills"] = ["#4cc9f0", "#33b0d9", "#2797bf"];
const WHITE: Box["fills"] = ["#ffffff", "#e3f3ff", "#d2e9f8"];
const SKY: Box["fills"] = ["#bfe9fb", "#9fd8f2", "#8acbe9"];
const GRIP: Box["fills"] = ["#80ed99", "#57cc99", "#3fa97f"];
/** A child's brush head covers about two milk molars. */
const SIZE = 1.25;

/** Rows of bristle tufts from the tip of the head towards the neck, alternating white and light blue like a real child's brush. */
const TUFT_ROWS: [number, number][] = [
  [-23, -17],
  [-15.5, -9.5],
  [-8, -2],
  [-0.5, 5.5],
  [7, 13],
  [14.5, 20.5],
];

// The bristles stick out a little round the head, so it reads as a brush even from the back.
// Two tufts per row with a gap between them; the tip row is the longest, as on a real brush.
const TUFTS: Box[] = TUFT_ROWS.flatMap((u, row) =>
  [
    [-11.5, -0.8],
    [0.8, 11.5],
  ].map((w): Box => ({ u, w: w as [number, number], b: [-11, row === 0 ? 0 : -1.5 - (row % 2)], fills: row % 2 ? SKY : WHITE, line: 1.5 })),
);

/** The brush's parts, all apart from each other along one of its axes, so `drawOrder` can stack them. */
export const BOXES: Box[] = [
  ...TUFTS,
  // Head, with a rounded-off tip.
  { u: [-21, 22], w: [-9.5, 9.5], b: [-17, -11], fills: BLUE },
  { u: [-25, -21], w: [-6.5, 6.5], b: [-16.5, -11.5], fills: BLUE },
  // A thin neck, then the handle: blue, a soft green grip for the thumb, a blue end.
  { u: [22, 60], w: [-3.5, 3.5], b: [-16, -11], fills: BLUE },
  { u: [60, 84], w: [-6, 6], b: [-17.5, -10.5], fills: BLUE },
  { u: [84, 118], w: [-7.5, 7.5], b: [-19, -9], fills: GRIP },
  { u: [118, 142], w: [-6, 6], b: [-17.5, -10.5], fills: BLUE },
];

/** Foam round the bristle tips, in (u, w, b); more of it shows the longer the child brushes. */
const FOAM: Vec3[] = [
  [-15, 8, -3],
  [-3, -9, -2],
  [9, 9, -4],
  [16, -7, -2],
  [2, 2, 1],
  [-20, -6, -1],
  [-9, 11, 0],
  [13, 1, 0],
  [-12, -1, 1],
  [20, 10, -3],
  [4, -12, -1],
  [-24, 3, -4],
];
/** Seconds of brushing until all the foam is there. */
const FOAM_FULL_S = 30;

type Axis = "u" | "w" | "b";
/** How much each of the brush's own axes points at the viewer (above 0: towards, below 0: away). */
export type Facing = Record<Axis, number>;

/** Whether box `a` lies behind box `b`, told by a plane between them across one of the brush's axes; null when none is between them. */
function behind(a: Box, b: Box, facing: Facing): boolean | null {
  for (const axis of ["u", "w", "b"] as const) {
    if (a[axis][1] <= b[axis][0]) return facing[axis] > 0;
    if (b[axis][1] <= a[axis][0]) return facing[axis] < 0;
  }
  return null;
}

/**
 * The order to draw the boxes in, back to front. Sorting by each box's middle goes wrong next to the long head:
 * a small bristle tuft at its far end can have its middle nearer than the head's, and then shows through the
 * plastic. The planes between the boxes always tell which is in front.
 */
export function drawOrder(boxes: Box[], facing: Facing): number[] {
  const back = boxes.map((a) => boxes.map((b) => a !== b && behind(a, b, facing) === true));
  const left = boxes.map((_, i) => i);
  const order: number[] = [];
  while (left.length > 0) {
    // Next the one with no box left behind it (the fewest, should the planes ever go round in a circle).
    const hidden = left.map((i) => left.filter((j) => back[j][i]).length);
    const pick = hidden.indexOf(Math.min(...hidden));
    order.push(left[pick]);
    left.splice(pick, 1);
  }
  return order;
}

/** The brush's order only depends on which way each axis points, so there are just 27 of them: worked out once each. */
const ORDERS = new Map<string, number[]>();
function brushOrder(facing: Facing): number[] {
  const signs = { u: Math.sign(facing.u), w: Math.sign(facing.w), b: Math.sign(facing.b) };
  const key = `${signs.u} ${signs.w} ${signs.b}`;
  const known = ORDERS.get(key);
  if (known) return known;
  const order = drawOrder(BOXES, signs);
  ORDERS.set(key, order);
  return order;
}

const fmt = (p: { x: number; y: number }) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;

/** A point of the brush, (su, sw, sb) brush units from its working point along its three axes. */
const brushPoint = (pose: Pose, w: Vec3, su: number, sw: number, sb: number) =>
  add(pose.at, scale(add(scale(pose.u, su), add(scale(w, sw), scale(pose.b, sb))), SIZE));

function drawBox(box: Box, pose: Pose, w: Vec3, point: (p: Vec3) => { x: number; y: number }, facing: (n: Vec3) => number, key: number) {
  const corner = (su: number, sw: number, sb: number) => point(brushPoint(pose, w, su, sw, sb));
  const [u0, u1] = box.u;
  const [w0, w1] = box.w;
  const [b0, b1] = box.b;
  const faces: { normal: Vec3; fill: string; points: ReturnType<typeof corner>[] }[] = [
    { normal: scale(pose.b, -1), fill: box.fills[0], points: [corner(u0, w0, b0), corner(u1, w0, b0), corner(u1, w1, b0), corner(u0, w1, b0)] },
    { normal: pose.b, fill: box.fills[0], points: [corner(u0, w0, b1), corner(u1, w0, b1), corner(u1, w1, b1), corner(u0, w1, b1)] },
    { normal: scale(w, -1), fill: box.fills[1], points: [corner(u0, w0, b0), corner(u1, w0, b0), corner(u1, w0, b1), corner(u0, w0, b1)] },
    { normal: w, fill: box.fills[1], points: [corner(u0, w1, b0), corner(u1, w1, b0), corner(u1, w1, b1), corner(u0, w1, b1)] },
    { normal: scale(pose.u, -1), fill: box.fills[2], points: [corner(u0, w0, b0), corner(u0, w1, b0), corner(u0, w1, b1), corner(u0, w0, b1)] },
    { normal: pose.u, fill: box.fills[2], points: [corner(u1, w0, b0), corner(u1, w1, b0), corner(u1, w1, b1), corner(u1, w0, b1)] },
  ];
  return (
    <g key={key}>
      {faces
        .filter((f) => facing(f.normal) > 0.02)
        .map((f, i) => (
          <path key={i} d={`M${f.points.map(fmt).join(" L")} Z`} fill={f.fill} stroke={INK} strokeWidth={box.line ?? 2.2} strokeLinejoin="round" />
        ))}
    </g>
  );
}

/** How quickly the brush turns to its next hold: unhurried, like a hand. */
const FOLLOW_S = 0.3;

/** The picture the brush is drawn over: its viewBox and how many picture units one screen pixel is. */
export interface BrushFrame {
  viewBox: string;
  box: { x: number; y: number; width: number; height: number };
  unit: number;
}

/**
 * The brush, in a layer of its own over the mirror. Its shape is drawn only when it turns or reaches the next spot
 * (with the clock's tick, or while the head turns); gliding there and scrubbing, circling or wiping are CSS
 * animations of that layer (`.brush-…` in teeth.css), which the browser moves without drawing anything again – drawn
 * anew in every frame it made the brushing stutter on phones. The mouth is projected without perspective, so moving
 * the flat picture is exactly moving the brush in 3D.
 */
export function Brush({
  anchor,
  surface,
  tooth,
  motion,
  project,
  frame,
}: {
  anchor: BrushAnchor;
  surface: Surface;
  tooth: ToothId;
  motion: Motion;
  project: Projector;
  frame: BrushFrame;
}) {
  const target = poseFor(anchor, surface, tooth);
  const current = useRef<{ pose: Pose; at: number } | null>(null);
  const since = useRef(performance.now());

  // Turn to the new hold smoothly when the step changes (the head turns then, drawing every frame).
  // On the wall clock, so it still arrives when animation frames stop (paused, or a background tab).
  const now = performance.now();
  let pose = target;
  if (current.current) {
    const dt = Math.max(0, now - current.current.at) / 1000;
    const k = 1 - Math.exp(-dt / FOLLOW_S);
    const from = current.current.pose;
    const turn = blend(toQuat(from.u, from.b), toQuat(target.u, target.b), k);
    pose = { at: target.at, u: rotate(turn, [1, 0, 0]), b: rotate(turn, [0, 1, 0]) };
  }
  current.current = { pose, at: now };

  // The shape is drawn with its working point in the middle of the picture; the layer is moved to the tooth.
  const { box, unit } = frame;
  const middle = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  const anchorAt = project.point(pose.at);
  const point = (p: Vec3) => {
    const q = project.point(p);
    return { x: q.x - anchorAt.x + middle.x, y: q.y - anchorAt.y + middle.y };
  };
  /** A 3D direction of `length` brush units on the screen, in px. */
  const onScreen = (v: Vec3, length: number) => {
    const q = project.point(add(pose.at, scale(v, length * SIZE)));
    return { x: (q.x - anchorAt.x) / unit, y: (q.y - anchorAt.y) / unit };
  };

  const w = cross(pose.u, pose.b);
  const order = brushOrder({ u: project.facing(pose.u), w: project.facing(w), b: project.facing(pose.b) });
  const backShows = project.facing(scale(pose.b, -1)) > 0;
  const brushed = (now - since.current) / 1000;
  const foamCount = Math.min(FOAM.length, 4 + Math.floor(((FOAM.length - 4) * brushed) / FOAM_FULL_S));
  const foam = (
    <g className="brush-foam" fill="#fff" stroke="#bde0fe" strokeWidth={2}>
      {FOAM.slice(0, foamCount).map(([su, sw, sb], i) => {
        const p = point(brushPoint(pose, w, su, sw, sb));
        return <circle key={i} cx={p.x} cy={p.y} r={(3.5 + (i % 3)) * project.zoom} />;
      })}
    </g>
  );

  // The motion's two directions on the screen: scrubbing goes along the handle, circling also across it (both
  // across the bristles), wiping goes from the gum to the tip of the tooth.
  const up: Vec3 = tooth.jaw === "lower" ? [0, 1, 0] : [0, -1, 0];
  const first = motion === "wipe" ? onScreen(up, REACH.wipe) : onScreen(pose.u, REACH[motion]);
  const second = onScreen(across([0, 1, 0], pose.b), REACH.circle);
  const offset = { x: (anchorAt.x - middle.x) / unit, y: (anchorAt.y - middle.y) / unit };
  const vars = {
    "--brush-x": `${first.x.toFixed(1)}px`,
    "--brush-y": `${first.y.toFixed(1)}px`,
    "--brush-x2": `${second.x.toFixed(1)}px`,
    "--brush-y2": `${second.y.toFixed(1)}px`,
    "--brush-s": `${STROKE_S}s`,
  } as CSSProperties;

  return (
    <div className="brush-layer" style={{ transform: `translate(${offset.x.toFixed(1)}px, ${offset.y.toFixed(1)}px)` }} aria-hidden>
      <div className={`brush-move ${motion}`} style={vars}>
        <div className="brush-move-across">
          <svg className="mouth brush" viewBox={frame.viewBox}>
            {/* Seen from the back of the head, the foam is behind it. */}
            {backShows && foam}
            {order.map((i) => drawBox(BOXES[i], pose, w, point, project.facing, i))}
            {!backShows && foam}
          </svg>
        </div>
      </div>
    </div>
  );
}
