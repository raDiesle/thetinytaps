import { memo, useEffect, useState, type CSSProperties } from "react";
import { runSeconds } from "./pieces";
import { Draw, INK, Layer, LeftGlow, STAGE_H, STAGE_W } from "./scenes";

// Raupe (H-46): a little caterpillar eats a big leaf, one bite a second. Its head goes to each spot before it bites it
// off (user request, November 2026): the leaf is cut in bands, and each second one band loses a bite, the head
// reaching up and down the bitten edge in turn, its neck stretching after it. Every band is eaten from the leaf's
// outline at the tip to its outline at the stalk over the whole run, so every bite takes leaf, never air, and what is
// left always looks like a smaller leaf. At the end it spins itself in on the branch, the cocoon bursts open and a
// butterfly flutters out and flies back and forth in the air.
//
// The bites are worked out once a second from the clock (`useBites`): the bands' clipping boxes step back by a style
// change, and the head, neck and body glide to their next place by a CSS transition – a change a second on small
// layers, never React drawing per frame. Each band is a box with a round end sliding back over the leaf while the leaf
// inside slides forward by as much (`overflow: hidden`), so the leaf stands still and nothing is painted again.

/** The leaf: where it lies on the stage (its stalk at the left, its tip at the right). */
export const LEAF = { x: 400, y: 250, w: 760, h: 320 } as const;

/** How many bands the leaf is cut into, top to bottom; each band's edge is one spot the head bites. */
export const BAND_COUNT = 6;
const BAND_H = LEAF.h / BAND_COUNT;
/** The round end of a band's clipping box. */
const BAND_R = BAND_H / 2;

/** The order the head bites the bands in: down the edge and back up again, so it never jumps from bottom to top. */
export const BITE_ORDER = [0, 1, 2, 3, 4, 5, 4, 3, 2, 1] as const;

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

/** The leaf's upper edge at `x` (its lower edge is `LEAF.h` minus it); `MID` beyond its ends. */
export function leafTop(x: number): number {
  if (x <= UPPER[0][0] || x >= UPPER[UPPER.length - 1][0]) return MID;
  let i = 1;
  while (UPPER[i][0] < x) i++;
  const [x0, y0] = UPPER[i - 1];
  const [x1, y1] = UPPER[i];
  return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
}

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

/** How far a band's round end reaches left of its tip at height `dy` from the band's middle. */
function roundIn(dy: number): number {
  return BAND_R - Math.sqrt(Math.max(0, BAND_R * BAND_R - dy * dy));
}

/**
 * Each band's edge (the tip of its round end, in the leaf's units) at the start and at the end: at the start just far
 * enough out that the box holds all of the band's leaf, at the end just far enough in that it holds none of it.
 */
export const BANDS = Array.from({ length: BAND_COUNT }, (_, i) => {
  const top = i * BAND_H;
  let start = 0;
  let end: number = LEAF.w;
  for (let k = 0; k <= 40; k++) {
    const y = top + (k / 40) * BAND_H;
    const span = leafSpan(y);
    if (!span) continue;
    const dy = y - (top + BAND_R);
    start = Math.max(start, span[1] + roundIn(dy));
    end = Math.min(end, span[0] + roundIn(dy));
  }
  return { top, start: start + 1, end: end - 1 };
});

// ---------------------------------------------------------------------------------------------------------------
// The bites: bite j (1 … the run's seconds) comes half a second before second j ends, on band BITE_ORDER[(j - 1) % 10].

/** How many of the first `bites` bites fall on each band. */
export function bitesPerBand(bites: number): number[] {
  const rounds = Math.floor(bites / BITE_ORDER.length);
  const counts = Array.from({ length: BAND_COUNT }, (_, i) => rounds * BITE_ORDER.filter((b) => b === i).length);
  for (let j = 0; j < bites % BITE_ORDER.length; j++) counts[BITE_ORDER[j]]++;
  return counts;
}

/** Every band's edge after `bites` of the run's `count` bites; at the end (`done`) every band is eaten. */
export function edgesAt(bites: number, count: number, done = false): number[] {
  const all = bitesPerBand(count);
  const had = bitesPerBand(bites);
  return BANDS.map((b, i) => (done || all[i] === 0 ? (done ? b.end : b.start) : b.start - ((b.start - b.end) * had[i]) / all[i]));
}

/** Where the mouth bites next: at the band's edge, in the middle of the leaf there is left in the band. */
export function biteSpot(bites: number, count: number): { x: number; y: number } {
  const band = BITE_ORDER[Math.min(bites, count - 1) % BITE_ORDER.length];
  const before = edgesAt(Math.min(bites, count - 1), count)[band];
  const { top } = BANDS[band];
  const x0 = before - 4;
  const leafUp = leafTop(x0);
  const from = Math.max(top, leafUp);
  const to = Math.min(top + BAND_H, LEAF.h - leafUp);
  const y = from < to ? (from + to) / 2 : band < BAND_COUNT / 2 ? top + BAND_H : top;
  const reach = leafSpan(y)?.[1] ?? x0;
  return { x: Math.min(x0, reach - 2), y };
}

/**
 * Where the body's front segment sits: on the midrib, a little behind the bitten edge's middle – but always within
 * reach of the next spot and never in front of it, so the head never stretches further than `REACH` nor bites behind it.
 */
export function bodyFront(bites: number, count: number): { x: number; y: number } {
  const edges = edgesAt(bites, count);
  const y = MID - 8;
  const spot = biteSpot(bites, count);
  const dx = Math.sqrt(Math.max(0, (REACH - 10) ** 2 - (spot.y - y) ** 2));
  const x = Math.min(Math.max(edges.reduce((a, b) => a + b, 0) / edges.length - 60, spot.x - dx), spot.x - 20);
  return { x, y };
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

/** The leaf's outline in its own units, with its midrib and veins; drawn once and shown through every band. */
const LeafDrawing = memo(function LeafDrawing() {
  const { w, h } = LEAF;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path d={`M40 ${MID} C160 -20 560 -10 ${TIP} ${MID} C560 ${h + 10} 160 ${h + 20} 40 ${MID} Z`} fill="#58b947" stroke={INK} strokeWidth="6" />
      <path d={`M40 ${MID} C160 30 520 30 ${w - 40} ${MID - 4}`} fill="none" stroke="#7fd36b" strokeWidth="14" opacity="0.6" />
      <path d={`M40 ${MID} Q400 ${MID - 10} ${w - 12} ${MID}`} stroke="#3d8a32" strokeWidth="7" fill="none" />
      {[150, 270, 390, 510, 620].map((x) => (
        <g key={x} stroke="#3d8a32" strokeWidth="5" fill="none" strokeLinecap="round">
          <path d={`M${x} ${MID - 3} Q${x + 50} ${MID - 60} ${x + 90} ${MID - 100 + (x > 500 ? 40 : 0)}`} />
          <path d={`M${x} ${MID + 3} Q${x + 50} ${MID + 60} ${x + 90} ${MID + 100 - (x > 500 ? 40 : 0)}`} />
        </g>
      ))}
    </svg>
  );
});

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
 * The leaf in bands, each box with a round right end at its band's edge, the leaf inside it moved back by as much so it
 * stands still. A tap lights up what is still green (H-51): a light inside every band, so it ends at the bites.
 */
function Leaf({ edges, glow }: { edges: number[]; glow: number }) {
  const { w, h } = LEAF;
  return (
    <Layer x={LEAF.x} y={LEAF.y} w={w} h={h}>
      {edges.map((edge, i) => {
        const shift = ((edge - w) / w) * 100;
        const box = { top: `${(BANDS[i].top * 100) / h}%`, height: `${(BAND_H * 100) / h}%`, transform: `translateX(${shift.toFixed(3)}%)` };
        const inner = { top: `${-i * 100}%`, height: `${BAND_COUNT * 100}%`, transform: `translateX(${(-shift).toFixed(3)}%)` };
        return (
          <div key={i} className="tm-band" style={box}>
            <div className="tm-band-leaf" style={inner}>
              <LeafDrawing />
              <div className="tm-leaf-light">
                <LeftGlow n={glow} />
              </div>
            </div>
          </div>
        );
      })}
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
function Caterpillar({ bites, count }: { bites: number; count: number }) {
  const mouth = biteSpot(bites, count);
  const front = bodyFront(bites, count);
  const neckEnd = { x: mouth.x - HEAD.mouth.x + HEAD.neck.x, y: mouth.y - HEAD.mouth.y + HEAD.neck.y };
  const last = bites > 0 ? biteSpot(bites - 1, count) : undefined;
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
  return (
    <>
      <LeafBackdrop />
      <Leaf edges={edgesAt(bites, count, done)} glow={glow} />
      <Cocoon />
      <Caterpillar bites={bites} count={count} />
      <Butterfly />
    </>
  );
}
