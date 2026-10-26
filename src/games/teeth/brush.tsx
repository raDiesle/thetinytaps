import { useEffect, useRef, useState } from "react";
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

/** One stroke, circle or wipe takes two beats of the song (112 BPM), calm enough to follow along. */
const STROKE_S = 120 / 112;
const SCRUB_S = STROKE_S;
const CIRCLE_S = STROKE_S;
const WIPE_S = STROKE_S;

/** Where the brush is pushed to by its motion, `t` seconds in. */
function motionOffset(pose: Pose, motion: Motion, jawUp: Vec3, t: number): Vec3 {
  if (motion === "scrub") return scale(pose.u, 8 * Math.sin((2 * Math.PI * t) / SCRUB_S));
  if (motion === "circle") {
    const a = (2 * Math.PI * t) / CIRCLE_S;
    const v = across([0, 1, 0], pose.b);
    return add(scale(pose.u, 11 * Math.cos(a)), scale(v, 11 * Math.sin(a)));
  }
  // Slowly from the gum to the tip of the tooth, then quickly back.
  const k = (t / WIPE_S) % 1;
  const s = k < 0.7 ? 1 - (1 - k / 0.7) ** 2 : 1 - (k - 0.7) / 0.3;
  return scale(jawUp, -10 + 20 * s);
}

interface Box {
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

const BOXES: Box[] = [
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
/** How far the brush rocks on its handle while it scrubs or circles (0.15 is about 9°). */
const ROCK = 0.15;

const fmt = (p: { x: number; y: number }) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;

function drawBox(box: Box, pose: Pose, w: Vec3, project: Projector, key: number) {
  const corner = (su: number, sw: number, sb: number) => project.point(add(pose.at, scale(add(scale(pose.u, su), add(scale(w, sw), scale(pose.b, sb))), SIZE)));
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
        .filter((f) => project.facing(f.normal) > 0.02)
        .map((f, i) => (
          <path key={i} d={`M${f.points.map(fmt).join(" L")} Z`} fill={f.fill} stroke={INK} strokeWidth={box.line ?? 2.2} strokeLinejoin="round" />
        ))}
    </g>
  );
}

/** Seconds of brushing, standing still while paused. */
function useBrushTime(paused: boolean, speed: number) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (paused) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      setT((prev) => prev + ((now - last) / 1000) * speed);
      last = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [paused, speed]);
  return t;
}

/** How quickly the brush follows to its next place: unhurried, like a hand. */
const FOLLOW_S = 0.3;

export function Brush({
  anchor,
  surface,
  tooth,
  motion,
  project,
  paused,
}: {
  anchor: BrushAnchor;
  surface: Surface;
  tooth: ToothId;
  motion: Motion;
  project: Projector;
  paused: boolean;
}) {
  const slow = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const t = useBrushTime(paused, slow ? 0.5 : 1);
  const target = poseFor(anchor, surface, tooth);
  const current = useRef<{ pose: Pose; at: number } | null>(null);

  // Follow the target smoothly: along the row as the step goes on, and over to the next side when it changes.
  // On the wall clock, so it still arrives when animation frames stop (paused, or a background tab).
  const now = performance.now();
  let pose = target;
  if (current.current) {
    const dt = Math.max(0, now - current.current.at) / 1000;
    const k = 1 - Math.exp(-dt / FOLLOW_S);
    const from = current.current.pose;
    const turn = blend(toQuat(from.u, from.b), toQuat(target.u, target.b), k);
    pose = { at: lerp3(from.at, target.at, k), u: rotate(turn, [1, 0, 0]), b: rotate(turn, [0, 1, 0]) };
  }
  current.current = { pose, at: now };

  const jawUp: Vec3 = tooth.jaw === "lower" ? [0, 1, 0] : [0, -1, 0];
  // A real hand rocks the brush a little on its handle as it scrubs or circles; wiping keeps it steady.
  const tilt = motion === "wipe" ? 0 : ROCK * Math.sin((2 * Math.PI * t) / (motion === "scrub" ? SCRUB_S : CIRCLE_S));
  const side = cross(pose.u, pose.b);
  const rocked = add(scale(pose.b, Math.cos(tilt)), scale(side, Math.sin(tilt)));
  const moved = { u: pose.u, b: rocked, at: add(pose.at, motionOffset(pose, motion, jawUp, t)) };
  const w = cross(moved.u, moved.b);
  const center = (box: Box) =>
    project.point(
      add(
        moved.at,
        scale(add(scale(moved.u, (box.u[0] + box.u[1]) / 2), add(scale(w, (box.w[0] + box.w[1]) / 2), scale(moved.b, (box.b[0] + box.b[1]) / 2))), SIZE),
      ),
    ).depth;
  const boxes = BOXES.map((box, i) => ({ box, i, depth: center(box) })).sort((a, b) => a.depth - b.depth);
  const backShows = project.facing(scale(moved.b, -1)) > 0;
  const foamCount = Math.min(FOAM.length, 4 + Math.floor(((FOAM.length - 4) * t) / FOAM_FULL_S));
  const foam = (
    <g className="brush-foam" fill="#fff" stroke="#bde0fe" strokeWidth={2}>
      {FOAM.slice(0, foamCount).map(([su, sw, sb], i) => {
        const p = project.point(add(moved.at, scale(add(scale(moved.u, su), add(scale(w, sw), scale(moved.b, sb))), SIZE)));
        return <circle key={i} cx={p.x} cy={p.y} r={(3.5 + (i % 3)) * project.zoom} />;
      })}
    </g>
  );

  return (
    <g className="brush" pointerEvents="none">
      {/* Seen from the back of the head, the foam is behind it. */}
      {backShows && foam}
      {boxes.map(({ box, i }) => drawBox(box, moved, w, project, i))}
      {!backShows && foam}
    </g>
  );
}
