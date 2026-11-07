import { memo, useEffect, useMemo, useState, type CSSProperties } from "react";
import { runSeconds } from "./pieces";
import { Draw, INK, Layer, LeftGlow, STAGE_H, STAGE_W } from "./scenes";

// Raupe (H-46): a little caterpillar eats a big leaf, one bite a second. Its head goes to each spot before it bites it
// off (user request, November 2026), reaching up and down the bitten edge, its neck stretching after it. It starts at
// the leaf's tip and works back to the stalk, each bite a round crescent of its own size taken out of the edge, a
// little higher or lower than the last – so the edge is a row of uneven scallops with points between them, as a real
// caterpillar leaves it (user feedback, November 2026: even, round fingers of leaf looked unnatural). At the end it
// spins itself in on the branch, the cocoon bursts open and a butterfly flutters out and flies back and forth in the air.
//
// The bites are planned once for the run (`planBites`) and counted once a second from the clock (`useBites`): the leaf
// is drawn as it is left, its shape and lines cut at the bites, once a second, and the head, neck and body glide to
// their next place by a CSS transition – a change a second on small layers, never React drawing per frame. The leaf is
// one piece: cutting it into bands let the sky shine through a hairline between them (user feedback, November 2026).

/** The leaf: where it lies on the stage (its stalk at the left, its tip at the right). */
export const LEAF = { x: 400, y: 250, w: 760, h: 320 } as const;

/** The meadow's front. */
export const LEAF_FLOOR = 790;

/** The branch the leaf grows on: its height at the stalk, and where the cocoon hangs. */
const BRANCH_Y = LEAF.y + LEAF.h / 2;
const COCOON = { x: 300, y: BRANCH_Y + 6, w: 64, h: 116 } as const;

/** The caterpillar's head (its mouth at `mouth`), the small segments of its neck and its body (front segment at `front`). */
const HEAD = { w: 62, h: 78, mouth: { x: 54, y: 52 }, neck: { x: 30, y: 50 } } as const;
const NECK = { n: 4, size: 38 } as const;
const BODY = { w: 130, h: 84, front: { x: 100, y: 50 } } as const;
/** How far the head may reach from the body's front segment, in the leaf's units. */
export const REACH = 200;

/** The butterfly, and where it flies back and forth at the end: from `left` to `right` (its left edge), high in the air, short of the sun. */
export const BUTTERFLY = { w: 110, h: 90, left: 330, right: 1080, y: 150 } as const;

// ---------------------------------------------------------------------------------------------------------------
// The leaf's outline: its upper edge is one curve from the stalk (x 40) to the tip (x 754), the lower edge its mirror.

const MID = LEAF.h / 2;
const TIP = LEAF.w - 6;
/** Half the outline's stroke: the drawn leaf reaches this far past its path. */
const STROKE = 3;

/** The upper edge, sampled from stalk to tip as [x, y] (x grows along it). */
const UPPER: [number, number][] = Array.from({ length: 801 }, (_, i) => {
  const t = i / 800;
  const u = 1 - t;
  const bez = (a: number, b: number, c: number, d: number) => u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
  return [bez(40, 160, 560, TIP), bez(MID, -20, -10, MID)];
});

/** From where to where the leaf reaches at height `y`, stroke included; undefined above or below it. */
export function leafSpan(y: number): [number, number] | undefined {
  const up = y > MID ? LEAF.h - y : y;
  let from = Number.POSITIVE_INFINITY;
  let to = Number.NEGATIVE_INFINITY;
  for (const [x, top] of UPPER) {
    if (top - STROKE > up) continue;
    from = Math.min(from, x);
    to = Math.max(to, x);
  }
  return from <= to ? [from - STROKE, to + STROKE] : undefined;
}

// ---------------------------------------------------------------------------------------------------------------
// The bites. The leaf is looked at in thin rows; what is left of a row is the leaf left of its edge `front[k]`. A bite
// is a circle: it moves every row it covers back to the circle's left rim, taking a crescent out of the edge.

/** The rows' height, in the leaf's units. */
const ROW = 2;
/** Each row's height in the leaf, top to bottom. */
const ROW_Y = Array.from({ length: LEAF.h / ROW + 1 }, (_, k) => k * ROW);
/** Where the leaf reaches in each row (undefined where it has none). */
const ROW_SPAN = ROW_Y.map(leafSpan);
/** The whole leaf's area, in the leaf's units. */
const LEAF_AREA = ROW_SPAN.reduce((sum, span) => sum + (span ? (span[1] - span[0]) * ROW : 0), 0);

/** One bite: the circle taken out, and the spot on the edge where the mouth bites. */
export type Bite = { x: number; y: number; r: number; spot: { x: number; y: number } };

/** How much leaf a row still has, with its edge at `front`. */
function rowLeft(k: number, front: number): number {
  const span = ROW_SPAN[k];
  return span ? Math.max(0, Math.min(front, span[1]) - span[0]) : 0;
}

/** Where the leaf ends on the right in a row, with its edge at `front`; -Infinity where nothing is left. */
function rowEdge(k: number, front: number): number {
  const span = ROW_SPAN[k];
  return span && rowLeft(k, front) > 0 ? Math.min(front, span[1]) : Number.NEGATIVE_INFINITY;
}

/** Takes a bite out of the rows' edges, returning how much leaf it took. */
function bite(front: number[], x: number, y: number, r: number, apply: boolean): number {
  let taken = 0;
  const from = Math.max(0, Math.ceil((y - r) / ROW));
  const to = Math.min(ROW_Y.length - 1, Math.floor((y + r) / ROW));
  for (let k = from; k <= to; k++) {
    const rim = x - Math.sqrt(Math.max(0, r * r - (ROW_Y[k] - y) ** 2));
    if (rim >= front[k]) continue;
    taken += (rowLeft(k, front[k]) - rowLeft(k, rim)) * ROW;
    if (apply) front[k] = rim;
  }
  return taken;
}

/** A small random generator, so a run's bites are uneven yet the same every second it is drawn. */
function random(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The smallest and biggest bite's radius, in the leaf's units. */
export const BITE_R = { min: 10, max: 120 } as const;

/** The bites' usual radius for a run of `count` bites: a half round bite taking the leaf shared out over them. */
function biteRadius(count: number): number {
  return Math.min(BITE_R.max, Math.max(BITE_R.min, Math.sqrt((2 * LEAF_AREA) / count / Math.PI)));
}

/**
 * The run's `count` bites, planned once. Each bite takes as much leaf as the clock asks for, so the leaf goes evenly
 * and is gone with the last one. It starts at the tip and always bites where the leaf reaches furthest out (the rows
 * whose edge is near the outermost one), stepping up or down the edge from the last bite by well over a bite's width,
 * so the bites stand apart with points of leaf between them, and turning where that part of the edge ends. Each bite
 * is a round notch about as deep as its radius, its size following the clock; depth and step vary a little. A long
 * run, whose bites would be smaller than `BITE_R.min`, takes shallow nibbles instead.
 */
export function planBites(count: number, seed = count): Bite[] {
  const rand = random(seed);
  const front = ROW_Y.map(() => LEAF.w + 10);
  const base = biteRadius(count);
  let left = LEAF_AREA;
  let y = MID;
  let r = base;
  let dir = rand() < 0.5 ? -1 : 1;
  const bites: Bite[] = [];
  for (let j = 1; j <= count; j++) {
    const edges = front.map((f, k) => rowEdge(k, f));
    const outer = Math.max(...edges);
    if (outer === Number.NEGATIVE_INFINITY) {
      bites.push({ x: -r, y, r, spot: bites[bites.length - 1]?.spot ?? { x: LEAF.w, y } });
      continue;
    }
    // The part of the edge near the outermost: the rows the caterpillar bites in now.
    const near = edges.map((e) => e >= outer - 2.5 * base);
    const lo = ROW_Y[near.indexOf(true)];
    const hi = ROW_Y[near.lastIndexOf(true)];
    // The first bite takes the very tip.
    if (j > 1) y += dir * r * (1.3 + 0.6 * rand());
    if (y >= hi) [y, dir] = [hi - rand() * base * 0.4, -1];
    if (y <= lo) [y, dir] = [lo + rand() * base * 0.4, 1];
    y = Math.min(hi, Math.max(lo, y));
    // The edge where the mouth lands: the row nearest `y` that still has leaf.
    const at = Math.round(y / ROW);
    let k = at;
    for (let d = 0; edges[k] === Number.NEGATIVE_INFINITY; d++) k = edges[at + d] > Number.NEGATIVE_INFINITY ? at + d : at - d;
    const edge = edges[k];
    const want = left - LEAF_AREA * (1 - j / count);
    // A round notch `deep` radii deep, as big as the clock asks for.
    const deep = 0.8 + 0.3 * rand();
    const takes = (size: number) => bite(front, edge + (1 - deep) * size, y, size, false);
    let x: number;
    if (takes(BITE_R.min) >= want) {
      // A nibble: the smallest bite, only as deep as the clock asks.
      r = BITE_R.min;
      let inner = edge - r;
      let outer = edge + r;
      for (let n = 0; n < 24; n++) {
        const mid = (inner + outer) / 2;
        if (bite(front, mid, y, r, false) > want) inner = mid;
        else outer = mid;
      }
      x = outer;
    } else {
      let small: number = BITE_R.min;
      let big: number = BITE_R.max;
      for (let n = 0; n < 24; n++) {
        const mid = (small + big) / 2;
        if (takes(mid) > want) big = mid;
        else small = mid;
      }
      r = small;
      x = edge + (1 - deep) * r;
    }
    left -= bite(front, x, y, r, true);
    bites.push({ x, y, r, spot: { x: edge - 3, y: ROW_Y[k] } });
  }
  return bites;
}

/** The rows' edges after the first `n` bites of a plan. */
export function frontAfter(bites: readonly Bite[], n: number): number[] {
  const front = ROW_Y.map(() => LEAF.w + 10);
  for (const b of bites.slice(0, n)) bite(front, b.x, b.y, b.r, true);
  return front;
}

/** How much leaf is left after the first `n` bites of a plan, as a share of the whole leaf. */
export function leafLeft(bites: readonly Bite[], n: number): number {
  return frontAfter(bites, n).reduce((sum, f, k) => sum + rowLeft(k, f) * ROW, 0) / LEAF_AREA;
}

/** Where the mouth bites next: the spot of the next bite, or of the last one once all are done. */
export function biteSpot(bites: readonly Bite[], n: number): { x: number; y: number } {
  return bites[Math.min(n, bites.length - 1)].spot;
}

/**
 * Where the body's front segment sits: on the midrib, a little behind the middle of the bitten edge – but always within
 * reach of the next spot and never in front of it, so the head never stretches further than `REACH` nor bites behind it.
 */
export function bodyFront(bites: readonly Bite[], n: number): { x: number; y: number } {
  const edges = frontAfter(bites, n)
    .map((f, k) => rowEdge(k, f))
    .filter((e) => e > Number.NEGATIVE_INFINITY);
  const spot = biteSpot(bites, n);
  const y = MID - 8;
  const middle = edges.length ? edges.reduce((a, b) => a + b, 0) / edges.length : spot.x;
  const dx = Math.sqrt(Math.max(0, (REACH - 10) ** 2 - (spot.y - y) ** 2));
  const x = Math.min(Math.max(middle - 60, spot.x - dx), spot.x - 20);
  return { x, y };
}

// ---------------------------------------------------------------------------------------------------------------
// The leaf as it is left: its shape, outline, midrib and veins cut off at the rows' edges, drawn as plain paths. No
// clip path: while a page turns, the app is taken as a picture of its own, and in it every clip path – a CSS one or one
// inside the svg – dropped out and showed the whole leaf again (user feedback, November 2026).

type Pt = readonly [number, number];

/** A quadratic or cubic curve from its points, sampled into `n` steps. */
function curve(points: Pt[], n = 32): Pt[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    let ps = points;
    while (ps.length > 1) ps = ps.slice(1).map((p, j): Pt => [ps[j][0] + (p[0] - ps[j][0]) * t, ps[j][1] + (p[1] - ps[j][1]) * t]);
    return ps[0];
  });
}

/** The leaf's outline: the upper edge from stalk to tip, then the lower edge (its mirror) back. */
const OUTLINE: Pt[] = [
  ...UPPER.filter((_, i) => i % 4 === 0),
  ...UPPER.filter((_, i) => i % 4 === 0)
    .map(([x, y]): Pt => [x, LEAF.h - y])
    .reverse(),
];
/** The soft light along the leaf's upper half. */
const SHINE = curve([
  [40, MID],
  [160, 30],
  [520, 30],
  [LEAF.w - 40, MID - 4],
]);
/** The midrib from the stalk to the tip. */
const RIB = curve([
  [40, MID],
  [400, MID - 10],
  [LEAF.w - 12, MID],
]);
/** The veins, a pair from each of these places along the midrib. */
const VEINS = [150, 270, 390, 510, 620].flatMap((x) =>
  [-1, 1].map((s) =>
    curve(
      [
        [x, MID + s * 3],
        [x + 50, MID + s * 60],
        [x + 90, MID + s * (100 - (x > 500 ? 40 : 0))],
      ],
      16,
    ),
  ),
);

/** The rows' edge at height `y`. */
function frontAt(front: readonly number[], y: number): number {
  return front[Math.min(front.length - 1, Math.max(0, Math.round(y / ROW)))];
}

/** The pieces of a line left of the rows' edges, each ending exactly at the edge. */
export function cutLine(line: readonly Pt[], front: readonly number[]): Pt[][] {
  const runs: Pt[][] = [];
  let run: Pt[] = [];
  const room = (p: Pt) => frontAt(front, p[1]) - p[0];
  line.forEach((p, i) => {
    const prev = line[i - 1];
    if (prev && room(prev) > 0 !== room(p) > 0) {
      const t = room(prev) / (room(prev) - room(p));
      run.push([prev[0] + (p[0] - prev[0]) * t, prev[1] + (p[1] - prev[1]) * t]);
      if (room(p) <= 0) {
        runs.push(run);
        run = [];
      }
    }
    if (room(p) > 0) run.push(p);
  });
  if (run.length) runs.push(run);
  return runs.filter((r) => r.length > 1);
}

/** Lines as one path. */
function pathOf(runs: readonly Pt[][], close = false): string {
  return runs.map((r) => `M${r.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L")}${close ? " Z" : ""}`).join(" ");
}

/** What is left of the leaf's green: each row from the leaf's left outline to its edge or right outline. */
export function leafShape(front: readonly number[]): string {
  const rows = ROW_Y.flatMap((y, k) => {
    const span = ROW_SPAN[k];
    if (!span) return [];
    const from = span[0] + STROKE;
    return [{ y, from, to: Math.max(from, Math.min(front[k], span[1] - STROKE)) }];
  });
  if (!rows.some((r) => r.to > r.from)) return "";
  return pathOf([[...rows.map((r): Pt => [r.to, r.y]), ...rows.reverse().map((r): Pt => [r.from, r.y])]], true);
}

/** The bitten edges: where a row's edge lies inside the leaf. */
function bittenEdge(front: readonly number[]): Pt[][] {
  const runs: Pt[][] = [];
  let run: Pt[] = [];
  ROW_Y.forEach((y, k) => {
    const span = ROW_SPAN[k];
    if (span && front[k] > span[0] + STROKE && front[k] < span[1] - STROKE) run.push([front[k], y]);
    else if (run.length) {
      runs.push(run);
      run = [];
    }
  });
  if (run.length) runs.push(run);
  return runs.filter((r) => r.length > 1);
}

/** The same as a CSS polygon, in percent of the leaf's box. */
function leafPolygon(front: readonly number[]): string {
  const pc = (v: number, of: number) => `${((Math.min(of, Math.max(0, v)) / of) * 100).toFixed(2)}%`;
  return `polygon(0% 0%, ${front.map((f, k) => `${pc(f, LEAF.w)} ${pc(ROW_Y[k], LEAF.h)}`).join(", ")}, 0% 100%)`;
}

/** The bites done so far, counted by the clock once a second (and again when the page comes back), all at the end. */
function useBites(startedAt: number, count: number, running: boolean): number {
  const due = () => Math.min(count, Math.max(0, Math.floor((Date.now() - startedAt) / 1000 + 0.5)));
  const [bites, setBites] = useState(due);
  useEffect(() => {
    if (!running) return;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const n = due();
      setBites(n);
      if (n < count) timer = setTimeout(tick, Math.max(10, startedAt + (n + 0.5) * 1000 - Date.now()));
    };
    const onVisible = () => {
      clearTimeout(timer);
      tick();
    };
    tick();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [startedAt, count, running]);
  return running ? bites : count;
}

/** A transform moving a layer of `w` × `h` placed at the leaf's corner so its top left lies at (x, y) in the leaf's units. */
function at(x: number, y: number, w: number, h: number): CSSProperties {
  return { transform: `translate(${((x / w) * 100).toFixed(2)}%, ${((y / h) * 100).toFixed(2)}%)` };
}

// ---------------------------------------------------------------------------------------------------------------
// The drawings.

/** Sky, meadow, the branch the leaf hangs from and the leaf's stalk; drawn once. */
export const LeafBackdrop = memo(function LeafBackdrop() {
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-back">
      <Draw w={STAGE_W} h={STAGE_H}>
        <defs>
          <linearGradient id="tm-leaf-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#bfe6ff" />
            <stop offset="1" stopColor="#f2fbff" />
          </linearGradient>
        </defs>
        <rect width={STAGE_W} height={STAGE_H} fill="url(#tm-leaf-sky)" />
        <circle cx="1300" cy="170" r="62" fill="#ffe066" />
        <rect y={LEAF_FLOOR - 20} width={STAGE_W} height={STAGE_H} fill="#86c95f" />
        {[220, 560, 900].map((x) => (
          <g key={x} fill="#ffd8e4" stroke={INK} strokeWidth="3">
            <circle cx={x} cy={LEAF_FLOOR + 30} r="10" />
            <circle cx={x + 18} cy={LEAF_FLOOR + 38} r="8" />
          </g>
        ))}
        {/* The branch from the left edge to the leaf's stalk, with two small leaves of its own. */}
        <path
          d={`M0 ${BRANCH_Y - 30} Q200 ${BRANCH_Y - 20} ${LEAF.x + 10} ${BRANCH_Y - 4} L${LEAF.x + 10} ${BRANCH_Y + 12} Q200 ${BRANCH_Y + 12} 0 ${BRANCH_Y + 10} Z`}
          fill="#8a5a2b"
          stroke={INK}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path d={`M${LEAF.x} ${BRANCH_Y} H${LEAF.x + 50}`} stroke="#5c8a2b" strokeWidth="12" strokeLinecap="round" />
        <path
          d={`M120 ${BRANCH_Y - 24} Q110 ${BRANCH_Y - 90} 170 ${BRANCH_Y - 110} Q190 ${BRANCH_Y - 50} 120 ${BRANCH_Y - 24} Z`}
          fill="#58b947"
          stroke={INK}
          strokeWidth="4"
        />
        <path
          d={`M230 ${BRANCH_Y + 8} Q250 ${BRANCH_Y + 70} 310 ${BRANCH_Y + 76} Q300 ${BRANCH_Y + 20} 230 ${BRANCH_Y + 8} Z`}
          fill="#58b947"
          stroke={INK}
          strokeWidth="4"
        />
      </Draw>
    </Layer>
  );
});

/**
 * The leaf as it is left, drawn anew once a second as plain paths (no clip path, see `leafShape`), with a thin dark
 * line along the bites. A tap lights up what is still green (H-51): a light mounted only after a tap, cut to the same
 * edge by a still CSS polygon, so it ends at the bites.
 */
function Leaf({ front, glow }: { front: readonly number[]; glow: number }) {
  const parts = useMemo(
    () => ({
      shape: leafShape(front),
      outline: pathOf(cutLine(OUTLINE, front)),
      shine: pathOf(cutLine(SHINE, front)),
      rib: pathOf(cutLine(RIB, front)),
      veins: pathOf(VEINS.flatMap((v) => cutLine(v, front))),
      bitten: pathOf(bittenEdge(front)),
    }),
    [front],
  );
  return (
    <Layer x={LEAF.x} y={LEAF.y} w={LEAF.w} h={LEAF.h}>
      <svg viewBox={`0 0 ${LEAF.w} ${LEAF.h}`} preserveAspectRatio="none">
        <path d={parts.shape} fill="#58b947" />
        <path d={parts.shine} fill="none" stroke="#7fd36b" strokeWidth="14" opacity="0.6" />
        <path d={parts.rib} stroke="#3d8a32" strokeWidth="7" fill="none" />
        <path d={parts.veins} stroke="#3d8a32" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d={parts.bitten} stroke="#3d8a32" strokeWidth="3" fill="none" strokeLinejoin="round" />
        <path d={parts.outline} stroke={INK} strokeWidth="6" fill="none" strokeLinejoin="round" />
      </svg>
      {glow > 0 && (
        <div className="tm-leaf-light" style={{ clipPath: leafPolygon(front) }}>
          <LeftGlow n={glow} />
        </div>
      )}
    </Layer>
  );
}

/** One round segment of the caterpillar, light or dark green. */
function Segment({ cx, cy, r, light }: { cx: number; cy: number; r: number; light: boolean }) {
  return <circle cx={cx} cy={cy} r={r} fill={light ? "#a3d977" : "#8cc95b"} stroke={INK} strokeWidth="4" />;
}

/** The crumbs of leaf falling from the spot just bitten: where they start round the mouth, their size and drift. */
const CRUMBS = [
  { x: -2, y: 4, r: 7, dx: 60 },
  { x: 6, y: -4, r: 5, dx: 160 },
  { x: -10, y: 10, r: 6, dx: -40 },
] as const;
const CRUMB_BOX = 40;

/**
 * The caterpillar: its body crawling back along the midrib as the leaf goes, its head going to each spot before it
 * bites it off – reaching up and down the bitten edge, its neck stretching after it – and crumbs of leaf falling from
 * the spot bitten. Every part is a small layer of its own gliding to its place once a second.
 */
function Caterpillar({ plan, bites }: { plan: readonly Bite[]; bites: number }) {
  const mouth = biteSpot(plan, bites);
  const front = bodyFront(plan, bites);
  const neckEnd = { x: mouth.x - HEAD.mouth.x + HEAD.neck.x, y: mouth.y - HEAD.mouth.y + HEAD.neck.y };
  const last = bites > 0 ? biteSpot(plan, bites - 1) : undefined;
  return (
    <>
      <Layer
        x={LEAF.x}
        y={LEAF.y}
        w={BODY.w}
        h={BODY.h}
        className="tm-cat tm-cat-glide"
        style={at(front.x - BODY.front.x, front.y - BODY.front.y, BODY.w, BODY.h)}
      >
        <Draw w={BODY.w} h={BODY.h}>
          {[22, 48, 74, 100].map((cx, i) => (
            <g key={cx}>
              <Segment cx={cx} cy={i % 2 ? 50 : 54} r={20} light={i % 2 === 1} />
              <circle cx={cx - 2} cy={(i % 2 ? 50 : 54) + 22} r="4" fill={INK} />
            </g>
          ))}
        </Draw>
      </Layer>
      {Array.from({ length: NECK.n }, (_, k) => {
        const f = (k + 1) / (NECK.n + 1);
        const x = front.x + (neckEnd.x - front.x) * f - NECK.size / 2;
        const y = front.y + (neckEnd.y - front.y) * f - NECK.size / 2;
        return (
          <Layer key={k} x={LEAF.x} y={LEAF.y} w={NECK.size} h={NECK.size} className="tm-cat tm-cat-glide" style={at(x, y, NECK.size, NECK.size)}>
            <Draw w={NECK.size} h={NECK.size}>
              <Segment cx={NECK.size / 2} cy={NECK.size / 2} r={NECK.size / 2 - 3} light={k % 2 === 0} />
            </Draw>
          </Layer>
        );
      })}
      <Layer
        x={LEAF.x}
        y={LEAF.y}
        w={HEAD.w}
        h={HEAD.h}
        className="tm-cat tm-cat-glide"
        style={at(mouth.x - HEAD.mouth.x, mouth.y - HEAD.mouth.y, HEAD.w, HEAD.h)}
      >
        {/* It bites down as a bite comes, and lifts its head again on the way to the next spot. */}
        <div key={bites} className="tm-cat-head">
          <svg viewBox={`0 0 ${HEAD.w} ${HEAD.h}`}>
            <path d="M22 18 Q16 4 8 2 M38 18 Q42 4 52 2" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
            <circle cx="8" cy="3" r="4" fill="#ffd43b" />
            <circle cx="52" cy="3" r="4" fill="#ffd43b" />
            <circle cx="30" cy="46" r="27" fill="#f4a340" stroke={INK} strokeWidth="4" />
            <circle cx="38" cy="40" r="5" fill={INK} />
            <circle cx="39.5" cy="38.5" r="1.8" fill="#fff" />
            <path d="M40 58 Q48 60 52 54" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
            <circle cx="24" cy="56" r="5" fill="#ff8f8f" opacity="0.7" />
          </svg>
        </div>
      </Layer>
      {last && (
        <Layer key={bites} x={LEAF.x} y={LEAF.y} w={CRUMB_BOX} h={CRUMB_BOX} style={at(last.x - CRUMB_BOX / 2, last.y - CRUMB_BOX / 2, CRUMB_BOX, CRUMB_BOX)}>
          {CRUMBS.map((c, i) => (
            <div
              key={i}
              className="tm-crumb tm-beat"
              style={
                {
                  left: `${((CRUMB_BOX / 2 + c.x) / CRUMB_BOX) * 100}%`,
                  top: `${((CRUMB_BOX / 2 + c.y) / CRUMB_BOX) * 100}%`,
                  width: `${(c.r / CRUMB_BOX) * 200}%`,
                  "--tm-dx": `${c.dx}%`,
                } as CSSProperties
              }
            />
          ))}
        </Layer>
      )}
    </>
  );
}

/** The cocoon hanging under the branch, spun at the end, and the same cocoon burst open once the butterfly is out. */
function Cocoon() {
  const { w, h } = COCOON;
  const x = COCOON.x - w / 2;
  return (
    <>
      <Layer x={x} y={COCOON.y} w={w} h={h} className="tm-cocoon">
        <Draw w={w} h={h}>
          <path d={`M${w / 2} 0 V14`} stroke="#e9e1c9" strokeWidth="4" />
          <path d={`M${w / 2} 12 C${w + 4} 20 ${w} ${h - 20} ${w / 2} ${h - 2} C0 ${h - 20} -4 20 ${w / 2} 12 Z`} fill="#c9b27c" stroke={INK} strokeWidth="4" />
          {[34, 56, 78].map((y) => (
            <path key={y} d={`M10 ${y} Q${w / 2} ${y + 10} ${w - 10} ${y}`} stroke="#a58a52" strokeWidth="3" fill="none" />
          ))}
        </Draw>
      </Layer>
      <Layer x={x} y={COCOON.y} w={w} h={h} className="tm-cocoon-open">
        <Draw w={w} h={h}>
          <path d={`M${w / 2} 0 V14`} stroke="#e9e1c9" strokeWidth="4" />
          {/* Empty inside, its two halves curled apart at the bottom. */}
          <path d={`M${w / 2} 16 C${w - 8} 30 ${w - 10} 80 ${w / 2 + 6} 96 L${w / 2 - 6} 96 C10 80 8 30 ${w / 2} 16 Z`} fill="#4f3d22" />
          <path
            d={`M${w / 2} 12 C4 22 -2 70 6 ${h - 6} Q14 ${h - 20} 22 ${h - 12} C18 74 20 40 ${w / 2} 12 Z`}
            fill="#c9b27c"
            stroke={INK}
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d={`M${w / 2} 12 C${w - 4} 22 ${w + 2} 70 ${w - 6} ${h - 6} Q${w - 14} ${h - 20} ${w - 22} ${h - 12} C${w - 18} 74 ${w - 20} 40 ${w / 2} 12 Z`}
            fill="#c9b27c"
            stroke={INK}
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {[36, 60].map((y) => (
            <g key={y} stroke="#a58a52" strokeWidth="3" fill="none">
              <path d={`M10 ${y} Q16 ${y + 6} 22 ${y + 4}`} />
              <path d={`M${w - 10} ${y} Q${w - 16} ${y + 6} ${w - 22} ${y + 4}`} />
            </g>
          ))}
        </Draw>
      </Layer>
    </>
  );
}

/**
 * The butterfly at the end: it slips out of the cocoon's open bottom, flies up into the air and then back and forth
 * over the meadow, bobbing and beating its wings – an outer layer flies out, one inside it goes back and forth, one
 * inside that bobs, and the wings beat inside that.
 */
function Butterfly() {
  const { w, h, left, right, y: flyY } = BUTTERFLY;
  const x = COCOON.x - w / 2;
  const y = COCOON.y + COCOON.h - h / 2 - 10;
  const style = {
    "--tm-fly-x": `${((left - x) / w) * 100}%`,
    "--tm-fly-y": `${((flyY - y) / h) * 100}%`,
    "--tm-sweep": `${((right - left) / w) * 100}%`,
  } as CSSProperties;
  return (
    <Layer x={x} y={y} w={w} h={h} className="tm-butterfly" style={style}>
      <div className="tm-sweep">
        <div className="tm-bob">
          <div className="tm-wings">
            <svg viewBox="0 0 110 90">
              <path d="M55 45 C40 10 6 0 6 28 C6 46 30 50 55 45 Z" fill="#ffa8d0" stroke={INK} strokeWidth="4" />
              <path d="M55 45 C70 10 104 0 104 28 C104 46 80 50 55 45 Z" fill="#ffa8d0" stroke={INK} strokeWidth="4" />
              <path d="M55 47 C38 52 18 66 28 80 C38 88 50 70 55 47 Z" fill="#ffd43b" stroke={INK} strokeWidth="4" />
              <path d="M55 47 C72 52 92 66 82 80 C72 88 60 70 55 47 Z" fill="#ffd43b" stroke={INK} strokeWidth="4" />
              <circle cx="26" cy="24" r="7" fill="#fff" opacity="0.8" />
              <circle cx="84" cy="24" r="7" fill="#fff" opacity="0.8" />
            </svg>
          </div>
          <svg className="tm-butterfly-body" viewBox="0 0 110 90">
            <path d="M51 22 Q44 8 38 6 M59 22 Q66 8 72 6" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
            <ellipse cx="55" cy="48" rx="6" ry="26" fill="#5c3b2e" stroke={INK} strokeWidth="3" />
          </svg>
        </div>
      </div>
    </Layer>
  );
}

/** The whole picture: the leaf with the caterpillar on its branch over the meadow; the cocoon and butterfly at the end. */
export function CaterpillarScene({ glow, startedAt, total, done }: { glow: number; startedAt: number; total: number; done: boolean }) {
  const count = runSeconds(total);
  const bites = useBites(startedAt, count, !done);
  const plan = useMemo(() => planBites(count, startedAt), [count, startedAt]);
  const front = useMemo(() => (done ? ROW_Y.map(() => 0) : frontAfter(plan, bites)), [plan, bites, done]);
  return (
    <>
      <LeafBackdrop />
      <Leaf front={front} glow={glow} />
      <Cocoon />
      <Caterpillar plan={plan} bites={bites} />
      <Butterfly />
    </>
  );
}
