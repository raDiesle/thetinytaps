import { memo, useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import { BODY, Mascot, MASCOT_COLORS, MASCOT_INK, MascotHead } from "@/components/Mascot";
import { loadRealSounds, playEngine } from "@/lib/realSounds";
import { playCountNote, playDing, playHop } from "@/lib/sfx";
import { type Frame, keyframes } from "./keyframes";
import { useRunClock } from "./pause";
import { ownName, PlayerPatch } from "./players";
import { INK, Layer, STAGE_H, STAGE_W } from "./scenes";
import type { PlayerLook, Players, TurnChild } from "./settings";
import { KID_LOOK } from "./swap";

// Rennstrecke (user request, 24 November 2026): two to four children – the fox's, the bear's, a rabbit's and a frog's
// (25 November 2026) – take turns driving a kart round a race track shaped like an eight, one lap a turn. The track
// lies on a meadow seen from a grandstand's height: its front loop big and near, its back loop far off in the
// picture's depth, the way from one to the other crossing over a bridge – so the way is as long as the picture allows.
// The kart waits on the chequered start and finish line in front, the start light behind it turns red, then yellow,
// then green, and the child whose turn it is drives one lap the whole turn long, at an even pace with a short start and
// stop, and stops on the line as the turn ends. Then it hops out to its mat in the infield, the next child hops in
// from its own, the light counts down again and off it goes. Whose turn it is shows across the room: that child sits
// in the kart (the others stand still on their mats, in a row in the order of their turns), its face or its photo is
// on the big screen behind the track, and the road it has driven this lap is painted in its colour. The kart is a
// small HTML layer on keyframes written for the turn (its place, size and heading on the track), its heading turning
// inside it; the driver bobs and the exhaust puffs at a steady pace, so even a ten-minute lap plainly moves.

// ---------------------------------------------------------------------------------------------------------------
// The view: ground points (x across, z away from us, both in ground units) seen from above the near edge. Everything
// at depth z is drawn `sizeAt(z)` as big as at z = 0, and squashed to `TILT` of its depth, the same everywhere, so a
// kart drawn from above only needs to be turned, squashed and scaled.

/** A child's look with its photo alone. */
const photoOnly = (photo: string): PlayerLook => ({ photo });

/** Where the ground meets the sky, far away. */
const HORIZON = 80;
/** How far down from the horizon the ground's near edge lies (z = 0). */
const DEPTH = 675;
/** How much the ground is squashed in depth: a kart's length seen along the track is this much of its length across. */
export const TILT = 0.55;

/** How big something at depth `z` is drawn, 1 at the front straight. */
export const sizeAt = (z: number) => Math.exp((-TILT * z) / DEPTH);

/** A ground point on the stage, `up` ground units above the ground (the bridge). */
export function project(x: number, z: number, up = 0) {
  const s = sizeAt(z);
  return { x: STAGE_W / 2 + x * s, y: HORIZON + DEPTH * s - up * s, s };
}

/**
 * The track's line through these ground points, in the order it is driven: from the start on the front straight to the
 * right, round the near loop, up across the middle into the far loop, round it and back across the middle over the
 * bridge, round the near loop's left side to the start. A smooth curve passes through each.
 */
const CORNERS: readonly (readonly [number, number])[] = [
  [0, 0],
  [230, 0],
  [410, 14],
  [530, 100],
  [565, 240],
  [500, 380],
  [330, 470],
  [160, 540],
  [0, 650],
  [-200, 800],
  [-600, 950],
  [-950, 1120],
  [-1020, 1340],
  [-720, 1520],
  [0, 1585],
  [720, 1520],
  [1020, 1340],
  [950, 1120],
  [600, 950],
  [200, 800],
  [0, 650],
  [-160, 540],
  [-330, 470],
  [-500, 380],
  [-565, 240],
  [-530, 100],
  [-410, 14],
  [-230, 0],
];

/** Half the road's width, the kerbs' width outside it, and the run-off's beyond them. */
const ROAD = 66;
const KERB = 13;
const RUNOFF = 34;

/** How many points the track is sampled at, evenly along its length. */
const SAMPLES = 600;

/** The bridge the way back from the far loop crosses on: how high, how long it stays up, where its ramps end, how thick. */
const BRIDGE = { up: 95, flat: 120, ramp: 430, deck: 18 } as const;

/** One point on the track: where, its heading (a unit vector), how far along, how high (the bridge) and how sharply it bends. */
export interface TrackPoint {
  x: number;
  z: number;
  dx: number;
  dz: number;
  at: number;
  up: number;
  bend: number;
}

/** The ramps' curve: 1 on the bridge's flat middle, falling softly to 0 at the ramps' ends. */
function lift(d: number) {
  if (d <= BRIDGE.flat) return 1;
  if (d >= BRIDGE.ramp) return 0;
  const t = 1 - (d - BRIDGE.flat) / (BRIDGE.ramp - BRIDGE.flat);
  return t * t * (3 - 2 * t);
}

/** The track sampled evenly, its length and where it crosses itself (under the bridge, then over it). */
function buildTrack() {
  const n = CORNERS.length;
  const dense: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [CORNERS[(i - 1 + n) % n], CORNERS[i], CORNERS[(i + 1) % n], CORNERS[(i + 2) % n]];
    for (let s = 0; s < 32; s++) {
      const t = s / 32;
      const c = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
      dense.push([c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  const lengths = [0];
  for (let i = 1; i <= dense.length; i++) {
    const a = dense[i - 1];
    const b = dense[i % dense.length];
    lengths.push(lengths[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1]));
  }
  const total = lengths[dense.length];
  const points: TrackPoint[] = [];
  let j = 0;
  for (let k = 0; k < SAMPLES; k++) {
    const at = (k / SAMPLES) * total;
    while (lengths[j + 1] < at) j++;
    const f = (at - lengths[j]) / (lengths[j + 1] - lengths[j]);
    const a = dense[j];
    const b = dense[(j + 1) % dense.length];
    points.push({ x: a[0] + (b[0] - a[0]) * f, z: a[1] + (b[1] - a[1]) * f, at, dx: 1, dz: 0, up: 0, bend: 0 });
  }
  const wrap = (k: number) => points[(k + SAMPLES) % SAMPLES];
  for (let k = 0; k < SAMPLES; k++) {
    const dx = wrap(k + 1).x - wrap(k - 1).x;
    const dz = wrap(k + 1).z - wrap(k - 1).z;
    const l = Math.hypot(dx, dz);
    points[k].dx = dx / l;
    points[k].dz = dz / l;
  }
  for (let k = 0; k < SAMPLES; k++) {
    const a = wrap(k - 3);
    const b = wrap(k + 3);
    const turn = Math.abs(Math.atan2(a.dx * b.dz - a.dz * b.dx, a.dx * b.dx + a.dz * b.dz));
    points[k].bend = turn / ((6 * total) / SAMPLES);
  }
  // The two passes through the middle: the first goes under the bridge, the second over it.
  const near = (k: number) => Math.hypot(points[k].x, points[k].z - 650);
  let under = 0;
  let over = SAMPLES / 2;
  for (let k = 0; k < SAMPLES; k++) {
    if (k < SAMPLES / 2 && near(k) < near(under)) under = k;
    if (k >= SAMPLES / 2 && near(k) < near(over)) over = k;
  }
  for (const p of points) p.up = BRIDGE.up * lift(Math.abs(p.at - points[over].at));
  return { points, total, under, over };
}

/** The track: its points, its length, and the samples where it passes under and over the bridge. */
export const TRACK = buildTrack();
const POINTS = TRACK.points;

/** The track's point `k`, counting on past the start. */
const point = (k: number) => POINTS[((k % SAMPLES) + SAMPLES) % SAMPLES];

/** A point `side` ground units to the left of the track's point `p` (negative: to the right), on the stage. */
function beside(p: TrackPoint, side: number, up = p.up) {
  return project(p.x - p.dz * side, p.z + p.dx * side, up);
}

const xy = (q: { x: number; y: number }) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`;

/** A band along the track from point `from` to `to` (inclusive), from `inner` to `outer` ground units off its middle. */
function band(from: number, to: number, inner: number, outer: number, ground = false) {
  const pts: string[] = [];
  for (let k = from; k <= to; k++) pts.push(xy(beside(point(k), outer, ground ? 0 : undefined)));
  for (let k = to; k >= from; k--) pts.push(xy(beside(point(k), inner, ground ? 0 : undefined)));
  return pts.join(" ");
}

/** A stretch split into short pieces, each overlapping the next by a point, so a band drawn from them follows the curve. */
function pieces(from: number, to: number, size = 24): [number, number][] {
  const out: [number, number][] = [];
  for (let a = from; a < to; a += size) out.push([a, Math.min(a + size, to)]);
  return out;
}

/** Whether the track's point `k` lies on the bridge (or its ramps), up off the ground. */
const raised = (k: number) => point(k).up > 0.5;

/** The stretches on the ground and on the bridge, as point ranges (the ground's running on past the start). */
function stretches() {
  let first = 0;
  while (!raised(first)) first++;
  let last = first;
  while (raised(last + 1)) last++;
  return { ground: [[0, first] as [number, number], [last, SAMPLES] as [number, number]], deck: [[first - 1, last + 1] as [number, number]] };
}

const STRETCHES = stretches();

/** The ranges of points between `from` and `to` (along the track) on the ground, or on the bridge. */
function within(from: number, to: number, on: "ground" | "deck"): [number, number][] {
  return STRETCHES[on].map(([a, b]) => [Math.max(a, from), Math.min(b, to)] as [number, number]).filter(([a, b]) => b > a);
}

// ---------------------------------------------------------------------------------------------------------------
// What stands where.

/** Each child's colours: its racing suit, its mat and its colour on the track and the screen (the bar's `tm-bar` tones). */
export const RACE_KIDS: Record<TurnChild, { suit: string; suitShade: string; mat: string; paint: string; light: string }> = {
  fox: { suit: "#4dabf7", suitShade: "#1c7ed6", mat: "#ffc078", paint: "#f76707", light: "#ffe8cc" },
  bear: { suit: "#ffd43b", suitShade: "#f59f00", mat: "#d8b48c", paint: "#9c6334", light: "#f3e3cf" },
  rabbit: { suit: KID_LOOK.rabbit.body, suitShade: KID_LOOK.rabbit.shade, mat: KID_LOOK.rabbit.light, paint: KID_LOOK.rabbit.shade, light: "#e7f5ff" },
  frog: { suit: KID_LOOK.frog.shade, suitShade: "#2b8a3e", mat: KID_LOOK.frog.light, paint: KID_LOOK.frog.shade, light: "#ebfbee" },
};

/**
 * Where the children's mats lie in the near loop's infield, in a row in the order of their turns, by how many play:
 * across (ground units) at the depth `MAT.z`, each `MAT.r` round. None lies behind the start light's post in the middle
 * (its lamps would cover a child's chest), so with three and four children two stand on a side, as close as their mats
 * allow and clear of the road; the kart starting in front stands between the inner two.
 */
export const MAT_XS: Record<2 | 3 | 4, readonly number[]> = {
  2: [-300, 320],
  3: [-345, -165, 320],
  4: [-350, -170, 170, 350],
};

/** The mats' depth and size (ground units). */
export const MAT = { z: 210, r: 88 } as const;

/** Where the mat of `kind` lies among `kids` playing (ground units). */
export function matOf(kids: readonly TurnChild[], kind: TurnChild) {
  const xs = MAT_XS[Math.min(4, Math.max(2, kids.length)) as 2 | 3 | 4];
  return { x: xs[Math.max(0, kids.indexOf(kind))] ?? 0, z: MAT.z };
}

/** A child's standing figure, in ground units at its mat (the Mascot's 2 : 3). */
const KID = { w: 136, h: 204 } as const;

/** The start light's post in the infield behind the start line, and how high its lamps hang. */
export const POST = { x: 0, z: 170, h: 147 } as const;

/**
 * The chequered flag on a short pole on the start light's box, its left end: how tall (pole and all, ground units at
 * the post). It stood on a pole of its own in the infield until 25 November 2026, where the third and fourth child's
 * mats lie now; up there it covers no child, nor the kart waiting on the line.
 */
const FLAG = { h: 72, w: 92 } as const;

/** The kart's box (stage units at the front straight): the kart's middle stands at `cx`, `cy` in it. */
const CAR = { w: 240, h: 300, cx: 120, cy: 180 } as const;

/** How high the kart's body stands over its wheels, and where a child stands in it (its seat), in the kart's box units. */
const BODY_UP = 20;
const SEAT_UP = 30;

/** The big screen behind the track, showing the face of the child driving. */
const SCREEN = { x: 690, y: 104, w: 220, h: 118 } as const;

/** Layers in front of each other: the ground, a kart under the bridge, the bridge, a kart on or beyond it, the post and the children, a kart in front, a child hopping. */
const Z = { ground: 1, under: 2, bridge: 3, over: 4, kids: 5, near: 6, hop: 7 } as const;

/** The kart's layer at the track's point at `at` along it: in front of the children, under or on the bridge, or beyond. */
function layerAt(k: number) {
  const p = point(k);
  if (p.up > 2) return Z.over;
  const from = POINTS[TRACK.under].at - 60;
  if (p.at >= from && p.at <= from + 520) return Z.under;
  return p.z < MAT.z - 10 ? Z.near : Z.over;
}

// ---------------------------------------------------------------------------------------------------------------
// The still drawings.

/** The kerbs: red and white blocks on both sides wherever the track bends sharply. */
function Kerbs({ from, to }: { from: number; to: number }) {
  const blocks: { d: string; fill: string }[] = [];
  for (let k = from; k < to; k += 2) {
    if (point(k).bend < 0.0022 || raised(k)) continue;
    for (const side of [1, -1]) {
      const pts = [
        beside(point(k), side * ROAD),
        beside(point(k), side * (ROAD + KERB)),
        beside(point(k + 2), side * (ROAD + KERB)),
        beside(point(k + 2), side * ROAD),
      ];
      blocks.push({ d: pts.map(xy).join(" "), fill: (k / 2) % 2 === 0 ? "#e03131" : "#f8f9fa" });
    }
  }
  return (
    <g>
      {blocks.map((b) => (
        <polygon key={b.d} points={b.d} fill={b.fill} />
      ))}
    </g>
  );
}

/** The road from `from` to `to`: asphalt, white lines along its edges and dashes down its middle. */
function Road({ from, to, ground }: { from: number; to: number; ground?: boolean }) {
  const parts = pieces(from, to);
  const dashes: string[] = [];
  for (let k = from; k + 3 <= to; k += 8) dashes.push(band(k, k + 3, -2.5, 2.5, ground));
  return (
    <g>
      {parts.map(([a, b]) => (
        <polygon key={`r${a}`} points={band(a, b, -ROAD, ROAD, ground)} fill="#6c737b" />
      ))}
      {parts.map(([a, b]) => (
        <polygon key={`s${a}`} points={band(a, b, -ROAD * 0.2, ROAD * 0.75, ground)} fill="#737a82" />
      ))}
      {parts.flatMap(([a, b]) => [
        <polygon key={`l${a}`} points={band(a, b, ROAD - 9, ROAD - 4, ground)} fill="#f8f9fa" />,
        <polygon key={`m${a}`} points={band(a, b, -ROAD + 4, -ROAD + 9, ground)} fill="#f8f9fa" />,
      ])}
      {dashes.map((d) => (
        <polygon key={d} points={d} fill="#f1f3f5" opacity="0.85" />
      ))}
    </g>
  );
}

/** The chequered start and finish line across the road at the start. */
function StartLine() {
  const p = point(0);
  const cells: { d: string; dark: boolean }[] = [];
  const across = 8;
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < across; c++) {
      const corner = (a: number, b: number) => {
        const along = -14 + a * 14;
        const side = -ROAD + (b * 2 * ROAD) / across;
        return project(p.x + p.dx * along - p.dz * side, p.z + p.dz * along + p.dx * side);
      };
      cells.push({ d: [corner(r, c), corner(r + 1, c), corner(r + 1, c + 1), corner(r, c + 1)].map(xy).join(" "), dark: (r + c) % 2 === 0 });
    }
  }
  return (
    <g>
      {cells.map((cell) => (
        <polygon key={cell.d} points={cell.d} fill={cell.dark ? "#212529" : "#f8f9fa"} />
      ))}
    </g>
  );
}

/** A stack of old tyres at a curve's outside. */
function Tyres({ x, z }: { x: number; z: number }) {
  const q = project(x, z);
  const r = 15 * q.s;
  return (
    <g stroke={INK} strokeWidth={2.5 * q.s}>
      {[-1, 0, 1].map((i) =>
        [0, 1, 2].map((h) => (
          <g key={`${i}-${h}`}>
            <ellipse cx={q.x + i * 2.1 * r} cy={q.y - h * r * 0.9} rx={r} ry={r * 0.55} fill={h === 2 ? "#e03131" : "#343a40"} />
            <ellipse cx={q.x + i * 2.1 * r} cy={q.y - h * r * 0.9 - r * 0.1} rx={r * 0.45} ry={r * 0.22} fill="#121416" stroke="none" />
          </g>
        )),
      )}
    </g>
  );
}

/** A round bush on the meadow. */
function Bush({ x, z }: { x: number; z: number }) {
  const q = project(x, z);
  const r = 34 * q.s;
  return (
    <g stroke={INK} strokeWidth={3 * q.s}>
      <ellipse cx={q.x} cy={q.y} rx={r * 1.3} ry={r * 0.35} fill="#2b8a3e" opacity="0.35" stroke="none" />
      <circle cx={q.x - r * 0.6} cy={q.y - r * 0.6} r={r * 0.75} fill="#40c057" />
      <circle cx={q.x + r * 0.6} cy={q.y - r * 0.55} r={r * 0.7} fill="#37b24d" />
      <circle cx={q.x} cy={q.y - r * 1.05} r={r * 0.85} fill="#51cf66" />
    </g>
  );
}

/** A grandstand along the back, full of little spectators, flags on its roof. */
function Grandstand({ x, w }: { x: number; w: number }) {
  const top = 150;
  const base = 238;
  const rows = 4;
  const colors = ["#ff6b6b", "#4dabf7", "#ffd43b", "#69db7c", "#f783ac", "#ffa94d", "#e9ecef"];
  return (
    <g strokeLinejoin="round">
      <rect x={x} y={top + 12} width={w} height={base - top - 12} fill="#dee2e6" stroke={INK} strokeWidth="3" />
      {Array.from({ length: rows }, (_, r) => (
        <g key={r}>
          <rect x={x + 6} y={top + 22 + r * 18} width={w - 12} height="14" fill={r % 2 ? "#adb5bd" : "#ced4da"} />
          {Array.from({ length: Math.floor((w - 20) / 13) }, (_, i) => (
            <circle key={i} cx={x + 14 + i * 13 + (r % 2) * 6} cy={top + 25 + r * 18} r="5" fill={colors[(i * 3 + r * 5) % colors.length]} />
          ))}
        </g>
      ))}
      <path d={`M${x - 10} ${top + 14} L${x + 14} ${top} H${x + w - 14} L${x + w + 10} ${top + 14} Z`} fill="#1971c2" stroke={INK} strokeWidth="3" />
      {[0.15, 0.5, 0.85].map((f, i) => (
        <g key={f}>
          <path d={`M${x + w * f} ${top} V${top - 26}`} stroke={INK} strokeWidth="2.5" />
          <path d={`M${x + w * f} ${top - 26} l18 5 l-18 5 Z`} fill={["#fa5252", "#fcc419", "#40c057"][i]} stroke={INK} strokeWidth="2" />
        </g>
      ))}
    </g>
  );
}

/**
 * Where a child's photo or name lies on its mat: at the mat's front, between the child's feet and the rim, so the child
 * standing there never covers it and it is seen while the child drives too.
 */
export function patchAt(mat: { x: number; z: number }) {
  const q = project(mat.x, mat.z);
  const r = 24 * q.s;
  return { x: q.x, y: q.y + r + 1, r };
}

/** A child's mat in the infield: a round rug in its colour with a white rim, and its photo or name at its front. */
function Mat({ kind, at, look }: { kind: TurnChild; at: { x: number; z: number }; look: PlayerLook | undefined }) {
  const c = RACE_KIDS[kind];
  const q = project(at.x, at.z);
  const patch = patchAt(at);
  return (
    <g>
      <ellipse cx={q.x} cy={q.y} rx={MAT.r * q.s} ry={MAT.r * q.s * TILT} fill="#f8f9fa" stroke={INK} strokeWidth="3" />
      <ellipse cx={q.x} cy={q.y} rx={(MAT.r - 14) * q.s} ry={(MAT.r - 14) * q.s * TILT} fill={c.mat} />
      <ellipse cx={q.x} cy={q.y} rx={40 * q.s} ry={40 * q.s * TILT} fill={c.paint} opacity="0.35" />
      <PlayerPatch look={look} x={patch.x} y={patch.y} r={patch.r} color={c.paint} />
    </g>
  );
}

/** The mats of the children playing, each with its photo or name. Drawn once for them (`memo`). */
const RaceMats = memo(
  function RaceMats({ kids, players }: { kids: readonly TurnChild[]; players?: Players }) {
    return (
      <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-race-mats">
        <svg viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} preserveAspectRatio="none">
          {kids.map((kind) => (
            <Mat key={kind} kind={kind} at={matOf(kids, kind)} look={players?.[kind]} />
          ))}
        </svg>
      </Layer>
    );
  },
  (a, b) => a.kids.join() === b.kids.join() && a.players === b.players,
);

/** The sky, the trees far off, the meadow mown in stripes, the grandstands, the big screen's frame and the track on the ground. Drawn once. */
export const RaceGround = memo(function RaceGround() {
  const bands: { y0: number; y1: number; i: number }[] = [];
  for (let i = 0, z = -400; z < 5000; i++, z += 150) bands.push({ y0: project(0, z + 150).y, y1: project(0, z).y, i });
  const shadow = band(TRACK.over - 26, TRACK.over + 26, -ROAD - 6, ROAD + 6, true);
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-race-ground">
      <svg viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="tm-race-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#74c0fc" />
            <stop offset="1" stopColor="#d0ebff" />
          </linearGradient>
        </defs>
        <rect width={STAGE_W} height={HORIZON + 40} fill="url(#tm-race-sky)" />
        <path d={`M0 ${HORIZON + 6} Q200 40 420 ${HORIZON - 4} T860 ${HORIZON - 8} T1280 ${HORIZON - 2} T${STAGE_W} 56 V${HORIZON + 30} H0 Z`} fill="#8ce99a" />
        {bands.map((b) => (
          <rect key={b.i} x="0" y={b.y0} width={STAGE_W} height={b.y1 - b.y0 + 0.5} fill={b.i % 2 ? "#69c26b" : "#77cc77"} />
        ))}
        {Array.from({ length: 26 }, (_, i) => (
          <circle
            key={i}
            cx={i * 64 + 10}
            cy={HORIZON + 8 + (i % 3) * 3}
            r={22 + (i % 4) * 5}
            fill={i % 2 ? "#2f9e44" : "#37b24d"}
            stroke={INK}
            strokeWidth="2"
          />
        ))}
        <Grandstand x={300} w={360} />
        <Grandstand x={940} w={360} />
        {/* The big screen's legs and frame; the face in it is a layer of its own. */}
        <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
          <rect x={SCREEN.x + 30} y={SCREEN.y + SCREEN.h - 4} width="14" height="44" fill="#868e96" />
          <rect x={SCREEN.x + SCREEN.w - 44} y={SCREEN.y + SCREEN.h - 4} width="14" height="44" fill="#868e96" />
          <rect x={SCREEN.x} y={SCREEN.y} width={SCREEN.w} height={SCREEN.h} rx="10" fill="#343a40" />
          <rect x={SCREEN.x + 10} y={SCREEN.y + 10} width={SCREEN.w - 20} height={SCREEN.h - 20} rx="4" fill="#1d2a3a" />
        </g>
        {/* Trees and bushes in the infields. */}
        <Bush x={-380} z={1300} />
        <Bush x={420} z={1280} />
        <Bush x={0} z={1250} />
        <Bush x={-60} z={330} />
        <Bush x={60} z={420} />
        {/* The run-off, the kerbs and the road; the stretch over the bridge is the bridge's. */}
        {STRETCHES.ground.flatMap(([a, b]) =>
          pieces(a, b).map(([c, d]) => <polygon key={`o${a}-${c}`} points={band(c, d, -ROAD - KERB - RUNOFF, ROAD + KERB + RUNOFF)} fill="#c3d69b" />),
        )}
        {STRETCHES.ground.map(([a, b]) => (
          <Kerbs key={`k${a}`} from={a} to={b} />
        ))}
        {STRETCHES.ground.map(([a, b]) => (
          <Road key={`r${a}`} from={a} to={b} />
        ))}
        {/* The bridge's shadow across the road under it. */}
        <polygon points={shadow} fill="#1b1f23" opacity="0.28" transform="translate(6 10)" />
        <StartLine />
        <Tyres x={-1150} z={1340} />
        <Tyres x={1150} z={1340} />
        <Tyres x={0} z={1720} />
        <Tyres x={680} z={250} />
        <Tyres x={-680} z={250} />
      </svg>
    </Layer>
  );
});

/** The bridge: its pillars, the deck's side towards us, the road over it and its railings. Drawn once. */
export const RaceBridge = memo(function RaceBridge() {
  const [[from, to]] = STRETCHES.deck;
  const mid = point(TRACK.over);
  // The deck's side we see is the one nearer to us.
  const side = beside(mid, ROAD).y > beside(mid, -ROAD).y ? 1 : -1;
  const face: string[] = [];
  for (let k = from; k <= to; k++) face.push(xy(beside(point(k), side * ROAD)));
  for (let k = to; k >= from; k--) face.push(xy(beside(point(k), side * ROAD, Math.max(0, point(k).up - BRIDGE.deck))));
  const pillars = [-120, 120].flatMap((d) => {
    const k = TRACK.over + Math.round((d / TRACK.total) * SAMPLES);
    return [1, -1].map((s) => {
      const p = point(k);
      const foot = beside(p, s * (ROAD - 10), 0);
      const top = beside(p, s * (ROAD - 10), p.up - BRIDGE.deck);
      return { x: foot.x, y0: top.y, y1: foot.y, w: 18 * foot.s, key: `${d}${s}` };
    });
  });
  const rails = [1, -1].map((s) => {
    const pts: string[] = [];
    for (let k = from; k <= to; k++) if (point(k).up > 24) pts.push(xy(beside(point(k), s * (ROAD + 2), point(k).up + 16)));
    return pts.join(" ");
  });
  const posts: string[] = [];
  for (let k = from; k <= to; k += 4) {
    if (point(k).up <= 24) continue;
    for (const s of [1, -1]) {
      const a = beside(point(k), s * (ROAD + 2));
      const b = beside(point(k), s * (ROAD + 2), point(k).up + 16);
      posts.push(`M${xy(a)} L${xy(b)}`);
    }
  }
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-race-bridge">
      <svg viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} preserveAspectRatio="none">
        {pillars.map((p) => (
          <rect key={p.key} x={p.x - p.w / 2} y={p.y0} width={p.w} height={p.y1 - p.y0} fill="#ced4da" stroke={INK} strokeWidth="3" />
        ))}
        <polygon points={face.join(" ")} fill="#adb5bd" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <Road from={from} to={to} />
        <g fill="none" stroke={INK} strokeLinecap="round" strokeLinejoin="round">
          {posts.map((d) => (
            <path key={d} d={d} strokeWidth="2.5" />
          ))}
          {rails.map((d) => (
            <polyline key={d} points={d} strokeWidth="6" />
          ))}
          {rails.map((d) => (
            <polyline key={`w${d}`} points={d} strokeWidth="2.5" stroke="#ffd43b" />
          ))}
        </g>
      </svg>
    </Layer>
  );
});

/** The start light's post with its three lamps side by side. Drawn once; the lamps' light and the flag on top are layers of their own. */
export const RacePost = memo(function RacePost() {
  const q = project(POST.x, POST.z);
  const box = lampBox();
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-race-post">
      <svg viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} preserveAspectRatio="none">
        <ellipse cx={q.x} cy={q.y} rx={22 * q.s} ry={22 * q.s * TILT} fill="#1b1f23" opacity="0.25" />
        <rect x={q.x - 6 * q.s} y={box.y + box.h / 2} width={12 * q.s} height={q.y - box.y - box.h / 2} fill="#868e96" stroke={INK} strokeWidth="3" />
        <rect x={box.x} y={box.y} width={box.w} height={box.h} rx="9" fill="#343a40" stroke={INK} strokeWidth="3" />
        {LAMPS.map((color, i) => (
          <circle key={color} cx={lampX(i)} cy={box.y + box.h / 2} r={box.r} fill="#495057" stroke="#212529" strokeWidth="2" />
        ))}
      </svg>
    </Layer>
  );
});

/** The start light's lamps from the left: red, yellow, green. */
const LAMPS = ["#ff4d4d", "#ffd43b", "#51cf66"] as const;

/** The chequered flag's layer on the start light's box: its pole stands on the box's left end, the cloth flying to the right over the box. */
export function flagBox() {
  const box = lampBox();
  const s = sizeAt(POST.z);
  return { x: box.x + 6 * s, y: box.y - FLAG.h * s, w: FLAG.w * s, h: FLAG.h * s };
}

/** The start light's box on its post: low enough to stay clear of the roads crossing behind it, high enough over the driver's head. */
export function lampBox() {
  const q = project(POST.x, POST.z);
  const w = 132 * q.s;
  const h = 48 * q.s;
  return { x: q.x - w / 2, y: q.y - POST.h * q.s, w, h, r: 15 * q.s };
}

/** The middle of the start light's lamp `i`, across. */
function lampX(i: number) {
  const box = lampBox();
  return box.x + box.w * (0.2 + i * 0.3);
}

/** A kart seen from above, pointing right in a 240 × 240 box: `low` its wheels, its shadow and the dark side of its body; else its top. */
function Kart({ low }: { low?: boolean }) {
  const body = "M58 98 Q58 84 74 84 L150 92 Q198 100 208 120 Q198 140 150 148 L74 156 Q58 156 58 142 Z";
  const tyres = [
    [148, 66, 36, 22],
    [148, 152, 36, 22],
    [52, 60, 40, 26],
    [52, 154, 40, 26],
  ];
  return low ? (
    <svg viewBox="0 0 240 240">
      <ellipse cx="126" cy="128" rx="96" ry="62" fill="#1b1f23" opacity="0.25" />
      {tyres.map(([x, y, w, h]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="7" fill="#212529" stroke={INK} strokeWidth="4" />
      ))}
      <path d={body} fill="#a51d1d" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 240 240">
      {tyres.map(([x, y, w, h]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width={w} height={h} rx="7" fill="#495057" stroke={INK} strokeWidth="4" />
          <path
            d={`M${x + 8} ${y + 4} V${y + h - 4} M${x + w / 2} ${y + 4} V${y + h - 4} M${x + w - 8} ${y + 4} V${y + h - 4}`}
            stroke="#343a40"
            strokeWidth="3"
          />
        </g>
      ))}
      <rect x="198" y="74" width="18" height="92" rx="5" fill="#343a40" stroke={INK} strokeWidth="4" />
      <rect x="30" y="68" width="20" height="104" rx="5" fill="#e03131" stroke={INK} strokeWidth="4" />
      <path d={body} fill="#e03131" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M92 112 H196 Q200 120 196 128 H92 Z" fill="#f8f9fa" />
      <path d="M74 92 L148 98 Q180 104 192 112" fill="none" stroke="#ff8787" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="108" cy="120" rx="27" ry="22" fill="#343a40" stroke={INK} strokeWidth="4" />
      <circle cx="150" cy="120" r="9" fill="#212529" />
    </svg>
  );
}

// ---------------------------------------------------------------------------------------------------------------
// The rabbit child and the frog child, the third and fourth to take turns: drawn like the shared fox and bear children
// (`Mascot.tsx`, which draws only those two) – a round head facing us with eyes a little below its middle, a warm brown
// iris with two lights, rosy cheeks, the plum-brown line round everything, a soft pear of a body with chubby arms and
// round paws – and dressed: dungarees in the child's colour, the rabbit's blue, the frog's green.

/** The two animals `Mascot` doesn't draw. */
type Animal = "rabbit" | "frog";

/** The rabbit's and the frog's colours: fur (skin), its far side, light on it, the pale belly and muzzle, the ears' inside, and their clothes. */
const ANIMAL: Record<Animal, { fur: string; shade: string; light: string; pale: string; paleShade: string; earIn: string; cloth: string; clothShade: string }> =
  {
    rabbit: {
      fur: "#e9ecef",
      shade: "#c4cad1",
      light: "#ffffff",
      pale: "#ffffff",
      paleShade: "#dee2e6",
      earIn: KID_LOOK.rabbit.earIn,
      cloth: KID_LOOK.rabbit.body,
      clothShade: KID_LOOK.rabbit.shade,
    },
    frog: {
      fur: "#8ce99a",
      shade: "#51cf66",
      light: "#d3f9d8",
      pale: "#ebfbee",
      paleShade: "#c3e6cb",
      earIn: KID_LOOK.frog.earIn,
      cloth: KID_LOOK.frog.shade,
      clothShade: "#2b8a3e",
    },
  };

const isAnimal = (kind: TurnChild): kind is Animal => kind === "rabbit" || kind === "frog";

/** A child's paw colour, for its paws on the wheel. */
const pawOf = (kind: TurnChild) => (isAnimal(kind) ? ANIMAL[kind].fur : MASCOT_COLORS[kind].paw);

/** One eye as the mascots' are: a warm brown iris round a dark pupil, a thin line round it, a big and a small light. */
function Eye({ cx, cy, rx, ry }: { cx: number; cy: number; rx: number; ry: number }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#6b3a20" />
      <ellipse cx={cx} cy={cy + ry * 0.12} rx={rx * 0.62} ry={ry * 0.64} fill="#1f110b" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={MASCOT_INK} strokeWidth="1.2" />
      <circle cx={cx + rx * 0.3} cy={cy - ry * 0.36} r={rx * 0.42} fill="#fff" />
      <circle cx={cx - rx * 0.36} cy={cy + ry * 0.38} r={rx * 0.17} fill="#fff" opacity="0.85" />
    </g>
  );
}

/** The rabbit's head: round, its two long ears standing up behind it (up to y −18), a small pink nose, two front teeth. */
const RABBIT_HEAD = "M50 26 C73 26 87 41 87 60 C87 79 71 91 50 91 C29 91 13 79 13 60 C13 41 27 26 50 26 Z";

/** The frog's head: wide and low, two round bumps on top with its eyes in them. */
const FROG_HEAD =
  "M50 92 C26 92 7 82 7 65 C7 55 10 48 16 43 C12 28 21 17 31 17 C40 17 47 24 48 32 Q50 34 52 32 C53 24 60 17 69 17 C79 17 88 28 84 43 C90 48 93 55 93 65 C93 82 74 92 50 92 Z";

/**
 * The rabbit's or the frog's head facing us in `MascotHead`'s 100 × 100 box, a child's: smiling, or laughing with its
 * mouth open (driving, cheering).
 */
function AnimalHead({ kind, open = false }: { kind: Animal; open?: boolean }) {
  const c = ANIMAL[kind];
  const line = { stroke: MASCOT_INK, strokeWidth: 3.2, strokeLinejoin: "round" as const };
  if (kind === "rabbit") {
    const ear = (side: 1 | -1) => `rotate(${side * 12} ${50 + side * 14} 30)`;
    return (
      <g>
        {([-1, 1] as const).map((side) => (
          <g key={side} transform={ear(side)}>
            <ellipse cx={50 + side * 14} cy="6" rx="10.5" ry="24" fill={c.fur} {...line} />
            <ellipse cx={50 + side * 14} cy="8" rx="5" ry="18" fill={c.earIn} />
          </g>
        ))}
        <path d={RABBIT_HEAD} fill={c.fur} />
        <path d="M74 32 C84 40 88 52 87 62 C86 78 72 90 54 91 C70 84 80 72 80 58 C80 47 78 39 74 32 Z" fill={c.shade} opacity="0.7" />
        <ellipse cx="42" cy="39" rx="14" ry="7" fill={c.light} opacity="0.7" />
        <ellipse cx="43.5" cy="70" rx="8.5" ry="6.5" fill={c.pale} stroke={c.paleShade} strokeWidth="1.2" />
        <ellipse cx="56.5" cy="70" rx="8.5" ry="6.5" fill={c.pale} stroke={c.paleShade} strokeWidth="1.2" />
        <path d={RABBIT_HEAD} fill="none" {...line} />
        <ellipse cx="26" cy="67" rx="6" ry="3.8" fill="#ff8f8f" opacity="0.5" />
        <ellipse cx="74" cy="67" rx="6" ry="3.8" fill="#ff8f8f" opacity="0.5" />
        <path d="M30 45 Q35.5 42 41 44.5 M70 45 Q64.5 42 59 44.5" fill="none" stroke={c.shade} strokeWidth="2.4" strokeLinecap="round" />
        <Eye cx={36} cy={55} rx={6} ry={6.9} />
        <Eye cx={64} cy={55} rx={6} ry={6.9} />
        <g fill={c.paleShade}>
          <circle cx="40" cy="70" r="0.9" />
          <circle cx="38" cy="73" r="0.9" />
          <circle cx="60" cy="70" r="0.9" />
          <circle cx="62" cy="73" r="0.9" />
        </g>
        {open ? (
          <>
            <path d="M44 70 Q50 72 56 70 C55.5 81 44.5 81 44 70 Z" fill="#7a2c2e" stroke={MASCOT_INK} strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M46.5 77 Q50 74.5 53.5 77 Q52.5 79 50 79 Q47.5 79 46.5 77 Z" fill="#f07b85" />
            <rect x="47.4" y="70.6" width="5.2" height="4.4" rx="1" fill="#fff" stroke={MASCOT_INK} strokeWidth="1" />
          </>
        ) : (
          <>
            <rect x="47.4" y="70.4" width="5.2" height="5" rx="1" fill="#fff" stroke={MASCOT_INK} strokeWidth="1.1" />
            <path d="M50 70.6 V75" stroke={MASCOT_INK} strokeWidth="0.8" />
            <path
              d="M50 66.5 L50 70.4 M44.5 70.4 Q47.5 73.5 50 70.4 Q52.5 73.5 55.5 70.4"
              fill="none"
              stroke={MASCOT_INK}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </>
        )}
        <path d="M45.5 62.5 Q50 60.5 54.5 62.5 Q53 67 50 67.5 Q47 67 45.5 62.5 Z" fill="#f783ac" stroke={MASCOT_INK} strokeWidth="1.6" strokeLinejoin="round" />
        <ellipse cx="48.6" cy="62.8" rx="1.5" ry="0.8" fill="#fff" opacity="0.75" />
      </g>
    );
  }
  return (
    <g>
      <path d={FROG_HEAD} fill={c.fur} />
      <path d="M80 44 C88 50 92 58 92 66 C92 81 75 91 54 92 C72 85 84 76 85 64 C85 56 83 50 80 44 Z" fill={c.shade} opacity="0.7" />
      <ellipse cx="50" cy="48" rx="16" ry="6" fill={c.light} opacity="0.6" />
      <path d="M50 92 C34 92 22 86 18 76 C30 82 70 82 82 76 C78 86 66 92 50 92 Z" fill={c.pale} opacity="0.9" />
      <path d={FROG_HEAD} fill="none" {...line} />
      {/* The bumps' rims round the eyes, and light on them. */}
      <circle cx="31" cy="32" r="11.5" fill={c.light} opacity="0.55" />
      <circle cx="69" cy="32" r="11.5" fill={c.light} opacity="0.55" />
      <Eye cx={31} cy={32} rx={8} ry={8.8} />
      <Eye cx={69} cy={32} rx={8} ry={8.8} />
      <ellipse cx="21" cy="68" rx="6.5" ry="4" fill="#ff8f8f" opacity="0.5" />
      <ellipse cx="79" cy="68" rx="6.5" ry="4" fill="#ff8f8f" opacity="0.5" />
      <circle cx="45.5" cy="57" r="1.5" fill={MASCOT_INK} />
      <circle cx="54.5" cy="57" r="1.5" fill={MASCOT_INK} />
      {open ? (
        <>
          <path d="M30 65 Q50 69 70 65 C66 85 34 85 30 65 Z" fill="#7a2c2e" stroke={MASCOT_INK} strokeWidth="2" strokeLinejoin="round" />
          <path d="M41 77 Q50 72 59 77 Q56 81 50 81 Q44 81 41 77 Z" fill="#f07b85" />
        </>
      ) : (
        <path d="M29 66 Q50 82 71 66" fill="none" stroke={MASCOT_INK} strokeWidth="2.6" strokeLinecap="round" />
      )}
    </g>
  );
}

/** One of the rabbit's or frog's arms from the shoulder through the elbow to a round paw, chubby, with the line round it. */
function AnimalArm({ from, via, to, kind }: { from: [number, number]; via: [number, number]; to: [number, number]; kind: Animal }) {
  const c = ANIMAL[kind];
  const d = `M${from[0]} ${from[1]} Q${via[0]} ${via[1]} ${to[0]} ${to[1]}`;
  const turn = (Math.atan2(to[1] - via[1], to[0] - via[0]) * 180) / Math.PI - 90;
  return (
    <>
      <path d={d} stroke={MASCOT_INK} strokeWidth="29" fill="none" strokeLinecap="round" />
      <path d={d} stroke={c.fur} strokeWidth="21" fill="none" strokeLinecap="round" />
      <g transform={`translate(${to[0]} ${to[1]}) rotate(${+turn.toFixed(1)})`}>
        <circle r="14" fill={c.fur} stroke={MASCOT_INK} strokeWidth="4" />
        <circle cx="-4" cy="-4.5" r="3.4" fill="#fff" opacity="0.3" />
        <path d="M-4.5 13 L-4 8.5 M4.5 13 L4 8.5" stroke={c.shade} strokeWidth="2" strokeLinecap="round" />
      </g>
    </>
  );
}

/** One foot at `x`: the rabbit's long one with a pink pad, the frog's wide one with three round toes. */
function AnimalFoot({ x, kind }: { x: number; kind: Animal }) {
  const c = ANIMAL[kind];
  if (kind === "rabbit")
    return (
      <g>
        <ellipse cx={x} cy="284" rx="27" ry="13.5" fill={c.fur} stroke={MASCOT_INK} strokeWidth="4" />
        <ellipse cx={x} cy="288" rx="11" ry="5.5" fill={c.earIn} />
      </g>
    );
  return (
    <g stroke={MASCOT_INK} strokeWidth="3.5">
      {[-17, 0, 17].map((d) => (
        <circle key={d} cx={x + d} cy="291" r="7" fill={c.fur} />
      ))}
      <ellipse cx={x} cy="283" rx="24" ry="11.5" fill={c.fur} strokeWidth="4" />
    </g>
  );
}

/** The arms of `Mascot`'s child, hanging or raised in a cheer. */
const ARMS = {
  stand: [
    { from: [58, 178], via: [40, 210], to: [46, 238] },
    { from: [142, 178], via: [160, 210], to: [154, 238] },
  ],
  cheer: [
    { from: [60, 176], via: [34, 152], to: [30, 114] },
    { from: [140, 176], via: [166, 152], to: [170, 114] },
  ],
} satisfies Record<string, { from: [number, number]; via: [number, number]; to: [number, number] }[]>;

/** The rabbit child or the frog child standing and facing us in `Mascot`'s 200 × 300 box, in dungarees in its colour; cheering with both arms up. */
function AnimalKid({ kind, cheer }: { kind: Animal; cheer?: boolean }) {
  const c = ANIMAL[kind];
  return (
    <svg viewBox="0 0 200 300" overflow="visible">
      <ellipse cx="100" cy="292" rx="66" ry="7" fill="#3a2418" opacity="0.14" />
      {kind === "rabbit" && <circle cx="153" cy="248" r="16" fill={c.light} stroke={MASCOT_INK} strokeWidth="4" />}
      <AnimalFoot x={78} kind={kind} />
      <AnimalFoot x={122} kind={kind} />
      <path d={BODY} fill={c.fur} />
      <path d="M130 152 C151 168 159 196 157 222 C155 247 144 267 121 275 C138 252 144 226 142 200 C140 180 136 164 130 152 Z" fill={c.shade} opacity="0.7" />
      <path d="M100 160 C120 160 133 176 134 196 L66 196 C67 176 80 160 100 160 Z" fill={c.pale} />
      {/* The dungarees: trousers over the body's lower half, the bib and its straps, two yellow buttons and a pocket. */}
      <path d="M43 208 C39 248 58 278 100 279 C142 278 161 248 157 208 Z" fill={c.cloth} />
      <path d="M118 212 C126 232 126 256 112 272 C138 264 150 240 152 214 Z" fill={c.clothShade} opacity="0.6" />
      <rect x="72" y="178" width="56" height="34" fill={c.cloth} />
      <path d="M72 210 V178 H128 V210 M43 208 H72 M128 208 H157" fill="none" stroke={MASCOT_INK} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M77 180 L66 154 M123 180 L134 154" stroke={MASCOT_INK} strokeWidth="11" strokeLinecap="round" />
      <path d="M77 180 L66 154 M123 180 L134 154" stroke={c.cloth} strokeWidth="6" strokeLinecap="round" />
      <rect x="89" y="186" width="22" height="15" rx="3" fill="none" stroke={c.clothShade} strokeWidth="2.5" />
      <circle cx="80" cy="186" r="4.2" fill="#ffd43b" stroke={MASCOT_INK} strokeWidth="2" />
      <circle cx="120" cy="186" r="4.2" fill="#ffd43b" stroke={MASCOT_INK} strokeWidth="2" />
      <path d={BODY} fill="none" stroke={MASCOT_INK} strokeWidth="4.5" strokeLinejoin="round" />
      {(cheer ? ARMS.cheer : ARMS.stand).map((arm) => (
        <AnimalArm key={arm.from.join()} {...arm} kind={kind} />
      ))}
      <g transform="translate(32.5 28) scale(1.35)">
        <AnimalHead kind={kind} open={cheer} />
      </g>
    </svg>
  );
}

/** A child standing on its mat: the shared fox or bear child, or the rabbit or frog child. Drawn once for its pose. */
const KidFigure = memo(function KidFigure({ kind, cheer }: { kind: TurnChild; cheer?: boolean }) {
  return isAnimal(kind) ? <AnimalKid kind={kind} cheer={cheer} /> : <Mascot kind={kind} child pose={cheer ? "cheer" : "stand"} />;
});

/** A child's head in `MascotHead`'s box, laughing: the shared fox's or bear's, or the rabbit's or frog's. */
function LaughingHead({ kind }: { kind: TurnChild }) {
  return isAnimal(kind) ? <AnimalHead kind={kind} open /> : <MascotHead kind={kind} child mouth="open" />;
}

/** A child at the wheel, seen from the front: its racing suit in its colour, its paws on the wheel and its head. Drawn once. */
const Driver = memo(function Driver({ kind }: { kind: TurnChild }) {
  const look = RACE_KIDS[kind];
  const paw = pawOf(kind);
  return (
    // The rabbit's ears reach past the box's top.
    <svg viewBox="0 0 120 150" overflow="visible">
      <path d="M22 150 Q18 112 34 98 Q60 88 86 98 Q102 112 98 150 Z" fill={look.suit} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M60 96 V150" stroke={look.suitShade} strokeWidth="6" />
      <path d="M30 108 Q22 132 40 140 M90 108 Q98 132 80 140" fill="none" stroke={look.suit} strokeWidth="13" strokeLinecap="round" />
      <path d="M30 108 Q22 132 40 140 M90 108 Q98 132 80 140" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <ellipse cx="60" cy="142" rx="30" ry="9" fill="#343a40" stroke={INK} strokeWidth="3" />
      <circle cx="40" cy="139" r="7" fill={paw} stroke={INK} strokeWidth="2.5" />
      <circle cx="80" cy="139" r="7" fill={paw} stroke={INK} strokeWidth="2.5" />
      <g transform="translate(8 2) scale(1.04)">
        <LaughingHead kind={kind} />
      </g>
    </svg>
  );
});

/** Where a child's head sits on the screen (its 200 × 98 box): the rabbit's a little smaller, so its ears stay on the screen. */
const SCREEN_HEAD: Record<TurnChild, string> = {
  fox: "translate(58 6) scale(0.84)",
  bear: "translate(58 6) scale(0.84)",
  rabbit: "translate(64 15) scale(0.72)",
  frog: "translate(58 4) scale(0.84)",
};

/** One child on the big screen: its photo if a grown-up picked one, else its laughing face, and its name on the band below if written. */
const ScreenFace = memo(function ScreenFace({ kind, look }: { kind: TurnChild; look: PlayerLook | undefined }) {
  const c = RACE_KIDS[kind];
  const name = ownName(look);
  return (
    <svg viewBox="0 0 200 98" preserveAspectRatio="none">
      <rect width="200" height="98" fill={c.light} />
      <rect y="78" width="200" height="20" fill={c.paint} />
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={i * 20} y={i % 2 ? 0 : 8} width="10" height="8" fill="#212529" opacity="0.8" />
      ))}
      {look?.photo ? (
        // Only the photo: the name stands on the band below.
        <PlayerPatch look={photoOnly(look.photo)} x={100} y={42} r={30} color={c.paint} />
      ) : (
        <g transform={SCREEN_HEAD[kind]}>
          <LaughingHead kind={kind} />
        </g>
      )}
      {name && (
        <text x="100" y="88.5" textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="800" fill="#fff">
          {name}
        </text>
      )}
    </svg>
  );
});

/** The child driving on the big screen behind the track: every child playing is there, the one driving shows. */
export function RaceScreen({ kids, holder, players }: { kids: readonly TurnChild[]; holder: TurnChild; players?: Players }) {
  return (
    <>
      {kids.map((kind) => (
        <Layer key={kind} x={SCREEN.x + 10} y={SCREEN.y + 10} w={SCREEN.w - 20} h={SCREEN.h - 20} className={`tm-race-face${holder === kind ? " tm-on" : ""}`}>
          <ScreenFace kind={kind} look={players?.[kind]} />
        </Layer>
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------------------------------------------
// A turn: one lap.

/**
 * A turn's moments: the changeover first (when the other child had the turn before: it hops out, this one hops in),
 * then the start light (red, yellow, green), then the lap, with a short start and stop.
 */
export function racePlan(ms: number, handover: boolean) {
  const swap = handover ? Math.min(2400, ms * 0.2) : 0;
  const hop = Math.min(700, swap * 0.38);
  const seated = swap / 2 + hop;
  const lights = Math.min(1800, ms * 0.15);
  const go = swap + lights;
  const drive = Math.max(1, ms - go);
  const a = Math.min(0.12, 1800 / drive);
  const b = Math.min(0.08, 1200 / drive);
  const v = 1 / (1 - a / 2 - b / 2);
  /** How far along the track the kart is `t` ms into the turn. */
  const along = (t: number) => {
    if (t <= go) return 0;
    const f = Math.min(1, (t - go) / drive);
    const share = f < a ? (v * f * f) / (2 * a) : f > 1 - b ? 1 - (v * (1 - f) ** 2) / (2 * b) : v * (a / 2 + f - a);
    return share * TRACK.total;
  };
  return { ms, swap, hop, seated, lights, go, drive, along };
}

/** A turn's moments. */
export type RacePlan = ReturnType<typeof racePlan>;

/** The track's point nearest `at` ground units along it. */
const sampleAt = (at: number) => Math.min(SAMPLES, Math.round((at / TRACK.total) * SAMPLES));

/** Where the kart is `at` ground units along the track: on the stage, its size, its heading and the point it is at. */
function kartAt(at: number) {
  const f = (at / TRACK.total) * SAMPLES;
  const k = Math.floor(f);
  const t = f - k;
  const a = point(k);
  const b = point(k + 1);
  const mix = (u: number, w: number) => u + (w - u) * t;
  const q = project(mix(a.x, b.x), mix(a.z, b.z), mix(a.up, b.up));
  return { ...q, heading: (Math.atan2(-mix(a.dz, b.dz), mix(a.dx, b.dx)) * 180) / Math.PI, k: Math.round(f) };
}

/** A `@keyframes` rule holding each value until the next moment (`steps`), for what switches: shown or not, which layer. */
function switchFrames(name: string, total: number, frames: { at: number; css: string }[]) {
  const percent = (ms: number) => ((Math.max(0, Math.min(ms, total)) / total) * 100).toFixed(3);
  return `@keyframes ${name} {${frames.map((f) => `${percent(f.at)}% { ${f.css}; animation-timing-function: steps(1, end); }`).join(" ")}}`;
}

/** How many moments of the lap the kart's way is written at. */
const LAP_FRAMES = 180;

/** The kart's frames for a turn: where it is (its box's offset and size) and its heading, and the layer it is in. */
function kartFrames(plan: RacePlan) {
  const start = kartAt(0);
  const go: Frame[] = [];
  const turn: Frame[] = [];
  const layer: { at: number; css: string }[] = [];
  let heading = start.heading;
  let lastLayer = 0;
  const add = (at: number, along: number) => {
    const p = kartAt(along);
    let h = p.heading;
    while (h - heading > 180) h -= 360;
    while (h - heading < -180) h += 360;
    heading = h;
    const dx = (((p.x - start.x) / CAR.w) * 100).toFixed(2);
    const dy = (((p.y - start.y) / CAR.h) * 100).toFixed(2);
    go.push({ at, transform: `translate(${dx}%, ${dy}%) scale(${p.s.toFixed(4)})`, ease: "linear" });
    turn.push({ at, transform: `rotate(${h.toFixed(1)}deg)`, ease: "linear" });
    const z = layerAt(p.k);
    if (z !== lastLayer) layer.push({ at, css: `z-index: ${z}` });
    lastLayer = z;
  };
  add(0, 0);
  add(plan.go, 0);
  for (let j = 1; j <= LAP_FRAMES; j++) {
    const at = plan.go + (j / LAP_FRAMES) * plan.drive;
    add(at, plan.along(at));
  }
  layer.push({ at: plan.ms, css: `z-index: ${Z.near}` });
  return { go, turn, layer };
}

/** A child's standing figure at its mat: its box on the stage, and where the kart's seat lies from it (its offset and size). */
export function kidBox(at: { x: number; z: number }) {
  const q = project(at.x, at.z);
  const w = KID.w * q.s;
  const h = KID.h * q.s;
  const seat = kartAt(0);
  return {
    x: q.x - w / 2,
    y: q.y - h,
    w,
    h,
    seat: `translate(${(((seat.x - q.x) / w) * 100).toFixed(2)}%, ${(((seat.y - SEAT_UP - q.y) / h) * 100).toFixed(2)}%) scale(${(1 / q.s).toFixed(3)})`,
    arc: `translate(${(((seat.x - q.x) / 2 / w) * 100).toFixed(2)}%, ${(((seat.y - SEAT_UP - q.y) / 2 / h) * 100 - 70).toFixed(2)}%) scale(${((1 + 1 / q.s) / 2).toFixed(3)})`,
  };
}

/**
 * A child's figure on its mat. In a turn with a changeover the child who drove before (`out`) stands in the kart and
 * hops out to its mat, and the child whose turn it is hops from its mat into the kart, where it is the driver then.
 */
function Kid({
  kind,
  at,
  name,
  plan,
  role,
  cheer,
}: {
  kind: TurnChild;
  at: { x: number; z: number };
  name?: string;
  plan?: RacePlan;
  role: "out" | "in" | "wait" | "drive";
  cheer?: boolean;
}) {
  const box = kidBox(at);
  let style: CSSProperties | undefined;
  let rules = "";
  if (plan && name && (role === "out" || role === "in")) {
    const timing = `${plan.ms}ms linear var(--tm-race-delay) both`;
    const [from, to] = role === "out" ? [0, plan.hop] : [plan.swap / 2, plan.seated];
    const there = role === "out" ? box.seat : "none";
    const back = role === "out" ? "none" : box.seat;
    rules = `${keyframes(`${name}-${kind}-go`, plan.ms, [
      { at: 0, transform: there, ease: "linear" },
      { at: from, transform: there, ease: "ease-out" },
      { at: (from + to) / 2, transform: box.arc, ease: "ease-in" },
      { at: to, transform: back, ease: "linear" },
      { at: plan.ms, transform: back },
    ])}\n${switchFrames(`${name}-${kind}-show`, plan.ms, [
      { at: 0, css: `opacity: 1; z-index: ${role === "out" ? Z.hop : Z.kids}` },
      { at: from, css: `opacity: 1; z-index: ${Z.hop}` },
      { at: to, css: role === "out" ? `opacity: 1; z-index: ${Z.kids}` : `opacity: 0; z-index: ${Z.kids}` },
      { at: plan.ms, css: role === "out" ? `opacity: 1; z-index: ${Z.kids}` : `opacity: 0; z-index: ${Z.kids}` },
    ])}`;
    style = { animation: `${name}-${kind}-go ${timing}, ${name}-${kind}-show ${timing}` };
  } else if (role === "drive" || role === "in") style = { opacity: 0 };
  return (
    <>
      {rules && <style>{rules}</style>}
      <Layer x={box.x} y={box.y} w={box.w} h={box.h} className="tm-race-kid" style={style}>
        <KidFigure kind={kind} cheer={cheer} />
      </Layer>
    </>
  );
}

/**
 * The kart with its driver: standing on the start line (`plan` absent: before the turns, or at the end), or driving the
 * turn's lap on its keyframes. In a turn with a changeover the seat is empty until the child whose turn it is has hopped in.
 */
function RaceKart({ holder, name, plan, still }: { holder: TurnChild; name?: string; plan?: RacePlan; still?: boolean }) {
  const frames = useMemo(() => (plan ? kartFrames(plan) : null), [plan]);
  const timing = plan ? `${plan.ms}ms linear var(--tm-race-delay) both` : "";
  const start = kartAt(0);
  const rules =
    plan && frames && name
      ? [
          keyframes(`${name}-go`, plan.ms, frames.go),
          keyframes(`${name}-turn`, plan.ms, frames.turn),
          switchFrames(`${name}-layer`, plan.ms, frames.layer),
          switchFrames(`${name}-seat`, plan.ms, [
            { at: 0, css: `opacity: ${plan.swap > 0 ? 0 : 1}` },
            { at: plan.seated, css: "opacity: 1" },
            { at: plan.ms, css: "opacity: 1" },
          ]),
        ].join("\n")
      : "";
  // The body's top stands over its wheels: the box it turns in is the kart's square.
  const lift = `${((-BODY_UP / CAR.w) * 100).toFixed(2)}%`;
  return (
    <>
      {rules && <style>{rules}</style>}
      <Layer
        x={start.x - CAR.cx}
        y={start.y - CAR.cy}
        w={CAR.w}
        h={CAR.h}
        className={`tm-race-kart${still ? " tm-still-kart" : ""}`}
        style={plan && name ? { animation: `${name}-go ${timing}, ${name}-layer ${timing}` } : { zIndex: Z.near }}
      >
        <div className="tm-race-flat">
          <div className="tm-race-spin" style={plan && name ? { animation: `${name}-turn ${timing}` } : undefined}>
            <Kart low />
          </div>
        </div>
        <div className="tm-race-flat" style={{ translate: `0 ${lift}` }}>
          <div className="tm-race-spin" style={plan && name ? { animation: `${name}-turn ${timing}` } : undefined}>
            <div className="tm-race-rumble">
              <Kart />
            </div>
            {!still && (
              <>
                <span className="tm-race-puff" />
                <span className="tm-race-puff tm-late" />
              </>
            )}
          </div>
        </div>
        <div className="tm-race-seat" style={plan && name ? { animation: `${name}-seat ${timing}` } : undefined}>
          <div className="tm-race-driver">
            <Driver kind={holder} />
          </div>
        </div>
      </Layer>
    </>
  );
}

/** The start light's lamps shining, and the chequered flag on the post waving the kart home in the lap's last seconds. */
function Lights({ name, plan, done }: { name?: string; plan?: RacePlan; done: boolean }) {
  const box = lampBox();
  const r = box.r * 1.9;
  const cy = box.y + box.h / 2;
  const timing = plan ? `${plan.ms}ms linear var(--tm-race-delay) both` : "";
  const on = (lamp: number) => {
    if (!plan || !name) return { opacity: done ? (lamp === 2 ? 1 : 0) : lamp === 0 ? 1 : 0 };
    return { animation: `${name}-lamp${lamp} ${timing}` };
  };
  const flag = flagBox();
  let rules = "";
  if (plan && name) {
    const yellow = plan.swap + plan.lights / 2;
    rules = [
      switchFrames(`${name}-lamp0`, plan.ms, [
        { at: 0, css: "opacity: 1" },
        { at: plan.go, css: "opacity: 0" },
        { at: plan.ms, css: "opacity: 0" },
      ]),
      switchFrames(`${name}-lamp1`, plan.ms, [
        { at: 0, css: "opacity: 0" },
        { at: yellow, css: "opacity: 1" },
        { at: plan.go, css: "opacity: 0" },
        { at: plan.ms, css: "opacity: 0" },
      ]),
      switchFrames(`${name}-lamp2`, plan.ms, [
        { at: 0, css: "opacity: 0" },
        { at: plan.go, css: "opacity: 1" },
        { at: plan.ms, css: "opacity: 1" },
      ]),
    ].join("\n");
    const wave = Math.min(2600, plan.drive * 0.2);
    const frames: Frame[] = [
      { at: 0, transform: "none" },
      { at: plan.ms - wave, transform: "none" },
    ];
    for (let t = plan.ms - wave + 220, i = 0; t < plan.ms; t += 220, i++) frames.push({ at: t, transform: `rotate(${i % 2 ? -6 : 6}deg)` });
    frames.push({ at: plan.ms, transform: "none" });
    rules += `\n${keyframes(`${name}-flag`, plan.ms, frames)}`;
  }
  return (
    <>
      {rules && <style>{rules}</style>}
      {LAMPS.map((color, i) => (
        <Layer key={color} x={lampX(i) - r} y={cy - r} w={2 * r} h={2 * r} className="tm-race-lamp" style={on(i)}>
          <svg viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="19" fill={color} opacity="0.35" />
            <circle cx="20" cy="20" r="10.5" fill={color} stroke="#212529" strokeWidth="1.5" />
            <circle cx="17" cy="17" r="3" fill="#fff" opacity="0.8" />
          </svg>
        </Layer>
      ))}
      <Layer x={flag.x} y={flag.y} w={flag.w} h={flag.h} className="tm-race-flag" style={plan && name ? { animation: `${name}-flag ${timing}` } : undefined}>
        <svg viewBox={`0 0 ${FLAG.w} ${FLAG.h}`}>
          <path d={`M4 4 V${FLAG.h}`} stroke={INK} strokeWidth="5" strokeLinecap="round" />
          <circle cx="4" cy="4" r="4.5" fill="#ffd43b" stroke={INK} strokeWidth="2" />
          <path d="M6 7 Q32 -1 56 9 T89 10 V44 Q66 38 46 44 T6 42 Z" fill="#f8f9fa" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
          {[0, 1, 2, 3, 4].map((c) =>
            [0, 1, 2].map((r) =>
              (c + r) % 2 === 0 ? <rect key={`${c}-${r}`} x={8 + c * 16} y={9 + r * 11 + Math.sin(c) * 2} width="16" height="11" fill="#212529" /> : null,
            ),
          )}
        </svg>
      </Layer>
    </>
  );
}

/**
 * Part of the track painted from point `from` to `to`: the lap driven so far in the driver's colour, or the way still to
 * go lit for a moment at a tap (H-51). `on` picks the ground's part or the bridge's, each lying in its own layer.
 */
function Paint({ from, to, on, fill, className }: { from: number; to: number; on: "ground" | "deck"; fill: string; className: string }) {
  const parts = within(from, to, on).flatMap(([a, b]) => pieces(a, b));
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className={`${className} tm-race-on-${on}`}>
      <svg viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} preserveAspectRatio="none">
        {parts.map(([a, b]) => (
          <polygon key={a} points={band(a, b, -ROAD + 10, ROAD - 10)} fill={fill} />
        ))}
      </svg>
    </Layer>
  );
}

/** The current turn: its keyframes' name (one for each turn), when it started on the run's clock, how long it is, and whether it begins with a changeover. */
export interface RaceTurn {
  name: string;
  startedAt: number;
  ms: number;
  handover: boolean;
}

/**
 * One lap (or the kart waiting on the line, `turn` null): the trail driven so far, the way still to go at a tap, the
 * start light, the children and the kart. Keyed by the turn, so each reads once how long ago it began.
 */
function Lap({
  kids,
  holder,
  prev,
  turn,
  done,
  poke,
  elapsed,
  quiet,
}: {
  kids: readonly TurnChild[];
  holder: TurnChild;
  prev: TurnChild | null;
  turn: RaceTurn | null;
  done: boolean;
  poke: number;
  elapsed?: number;
  quiet?: boolean;
}) {
  const clock = useRunClock();
  const { paused, now } = clock;
  const ms = turn?.ms;
  const handover = turn?.handover ?? false;
  const startedAt = turn?.startedAt ?? 0;
  const plan = useMemo(() => (ms === undefined ? undefined : racePlan(ms, handover)), [ms, handover]);
  const [delay] = useState(() => (turn ? Math.max(0, now() - turn.startedAt) : 0));
  const name = plan ? turn?.name : undefined;

  // How far along the lap the kart is, checked once a second (paused, not at all) for the trail in the driver's colour.
  const pointNow = useCallback(() => (plan ? sampleAt(plan.along(elapsed ?? now() - startedAt)) : 0), [plan, elapsed, now, startedAt]);
  const [k, setK] = useState(pointNow);
  useEffect(() => {
    if (!plan || paused || elapsed !== undefined) return;
    setK(pointNow());
    const timer = setInterval(() => setK(pointNow()), 1000);
    return () => clearInterval(timer);
  }, [plan, paused, elapsed, pointNow]);

  // The turn's sounds on the run's clock: the hops of the changeover, a note at red and at yellow, a ding and the engine at green.
  useEffect(() => {
    if (quiet || paused || !plan) return;
    const moments: [number, () => void][] = [
      [plan.swap, () => playCountNote(0)],
      [plan.swap + plan.lights / 2, () => playCountNote(2)],
      [
        plan.go,
        () => {
          playDing();
          playEngine();
        },
      ],
    ];
    if (plan.swap > 0) moments.push([0, () => playHop()], [plan.swap / 2, () => playHop()]);
    const timers = moments
      .map(([at, play]) => [startedAt + at - now(), play] as const)
      .filter(([wait]) => wait >= 0)
      .map(([wait, play]) => setTimeout(play, wait));
    return () => {
      for (const timer of timers) clearTimeout(timer);
    };
  }, [quiet, paused, now, plan, startedAt]);

  const paint = RACE_KIDS[holder].paint;
  const swapping = plan !== undefined && plan.swap > 0;
  return (
    <div className="tm-race-lap" style={plan ? ({ "--tm-race-delay": `${-delay}ms` } as CSSProperties) : undefined}>
      {plan && k > 0 && <Paint from={0} to={k} on="ground" fill={paint} className="tm-race-trail" />}
      {plan && k > STRETCHES.deck[0][0] && <Paint from={0} to={k} on="deck" fill={paint} className="tm-race-trail" />}
      {plan && poke > 0 && <Paint key={`g${poke}`} from={k} to={SAMPLES} on="ground" fill="#fff3bf" className="tm-race-ahead" />}
      {plan && poke > 0 && <Paint key={`d${poke}`} from={k} to={SAMPLES} on="deck" fill="#fff3bf" className="tm-race-ahead" />}
      <Lights name={name} plan={plan} done={done} />
      {kids.map((kind) => {
        // The child whose turn it is hops in (or sits in the kart already), the one who drove before hops out, the others wait and cheer at the end.
        const role = kind === holder ? (swapping ? "in" : "drive") : swapping && kind === prev ? "out" : "wait";
        return <Kid key={kind} kind={kind} at={matOf(kids, kind)} name={name} plan={plan} role={role} cheer={done && role === "wait"} />;
      })}
      <RaceKart holder={holder} name={name} plan={plan} still={done} />
    </div>
  );
}

/**
 * The Rennstrecke on the stage for `kids` (2–4, in turn order), each with its mat: `holder` drives (or waits on the
 * start line before the turns), `prev` drove the turn before and hops out at its start (null on the first), the others
 * stand on their mats; `turn` is the lap under way (null before the turns and at the end), `done` the end, where the
 * children on their mats cheer. `players` holds the photos and names grown-ups gave the children, shown on their mats
 * and on the big screen. `poke` counts the taps, each lighting the way still to go (H-51). `elapsed` puts a card's lap
 * at that moment; `quiet` keeps a card silent.
 */
export function RaceScene({
  kids,
  holder,
  prev,
  turn,
  done,
  poke,
  elapsed,
  quiet,
  players,
}: {
  kids: readonly TurnChild[];
  holder: TurnChild;
  prev: TurnChild | null;
  turn: RaceTurn | null;
  done: boolean;
  poke: number;
  elapsed?: number;
  quiet?: boolean;
  players?: Players;
}) {
  useEffect(() => loadRealSounds([playEngine]), []);
  return (
    <div className="tm-race">
      <RaceGround />
      <RaceMats kids={kids} players={players} />
      <RaceScreen kids={kids} holder={holder} players={players} />
      <RaceBridge />
      <RacePost />
      <Lap
        key={`${turn?.name ?? (done ? "done" : "wait")}-${holder}-${kids.join()}`}
        kids={kids}
        holder={holder}
        prev={prev}
        turn={turn}
        done={done}
        poke={poke}
        elapsed={elapsed}
        quiet={quiet}
      />
    </div>
  );
}
