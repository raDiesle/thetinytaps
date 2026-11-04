import { memo, type CSSProperties } from "react";
import { Draw, Family, INK, Layer, STAGE_H, STAGE_W } from "./scenes";

// Raupe (H-46): a little caterpillar eats its way through a big leaf from the tip to the stalk, bite by bite; what is
// still green is the time left. At the end it spins itself in on the branch and a butterfly flies out to the fox child.
// The leaf is cut in bands, each clipped by a box with a round end that slides back over it (`overflow: hidden`, moved
// by `transform` while the leaf inside moves the other way), so the bitten edge is wavy and nothing is painted again.

/** The leaf: where it lies on the stage (its stalk at the left, its tip at the right). */
export const LEAF = { x: 400, y: 250, w: 760, h: 320 } as const;

/** How far the bitten edge goes back over the run, in the leaf's units: from past the tip to just before the stalk. */
export const EATEN = 700;

/** Where each band's edge starts, past the tip, so the bites stand a little apart from each other. */
const BANDS = [10, 34, 0, 26, 6, 30];
const EDGE = LEAF.w - 10;

/** The ground the fox family stands on. */
export const LEAF_FLOOR = 790;

/** The branch the leaf grows on: its height at the stalk, and where the cocoon hangs. */
const BRANCH_Y = LEAF.y + LEAF.h / 2;
const COCOON = { x: 300, y: BRANCH_Y + 6, w: 64, h: 116 } as const;

/** The caterpillar's box: its head at the right end, near the bitten edge. */
const CATERPILLAR = { w: 180, h: 84 } as const;

/** Where the butterfly sits at the end: above the fox child's head (the child stands left of the grown-up at 1200). */
const BUTTERFLY = { w: 110, h: 90, toX: 1095, toY: 505 } as const;

/** The leaf's outline in its own units, with its midrib and veins; the stalk reaches to x 0. */
function LeafDrawing() {
  const { w, h } = LEAF;
  const mid = h / 2;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path d={`M0 ${mid} H50`} stroke="#5c8a2b" strokeWidth="12" strokeLinecap="round" />
      <path d={`M40 ${mid} C160 -20 560 -10 ${w - 6} ${mid} C560 ${h + 10} 160 ${h + 20} 40 ${mid} Z`} fill="#58b947" stroke={INK} strokeWidth="6" />
      <path d={`M40 ${mid} C160 30 520 30 ${w - 40} ${mid - 4}`} fill="none" stroke="#7fd36b" strokeWidth="14" opacity="0.6" />
      <path d={`M40 ${mid} Q400 ${mid - 10} ${w - 12} ${mid}`} stroke="#3d8a32" strokeWidth="7" fill="none" />
      {[150, 270, 390, 510, 620].map((x) => (
        <g key={x} stroke="#3d8a32" strokeWidth="5" fill="none" strokeLinecap="round">
          <path d={`M${x} ${mid - 3} Q${x + 50} ${mid - 60} ${x + 90} ${mid - 100 + (x > 500 ? 40 : 0)}`} />
          <path d={`M${x} ${mid + 3} Q${x + 50} ${mid + 60} ${x + 90} ${mid + 100 - (x > 500 ? 40 : 0)}`} />
        </g>
      ))}
    </svg>
  );
}

/** Sky, meadow and the branch the leaf hangs from; drawn once. */
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
 * The leaf in bands: each band is a box with a round right end, sliding back over the leaf by `EATEN` while the leaf in
 * it slides forward by as much, so the leaf stands still and only the bitten edge moves.
 */
export const Leaf = memo(function Leaf() {
  const band = LEAF.h / BANDS.length;
  return (
    <Layer x={LEAF.x} y={LEAF.y} w={LEAF.w} h={LEAF.h}>
      {BANDS.map((offset, i) => {
        const width = EDGE + offset;
        const style = {
          top: `${(i * band * 100) / LEAF.h}%`,
          height: `${(band * 100) / LEAF.h}%`,
          width: `${(width * 100) / LEAF.w}%`,
          "--tm-eat": `${(-EATEN * 100) / width}%`,
        } as CSSProperties;
        const inner = {
          top: `${-i * 100}%`,
          width: `${(LEAF.w * 100) / width}%`,
          height: `${BANDS.length * 100}%`,
          "--tm-eat": `${(EATEN * 100) / LEAF.w}%`,
        } as CSSProperties;
        return (
          <div key={i} className="tm-band tm-eat" style={style}>
            <div className="tm-band-leaf tm-eat" style={inner}>
              <LeafDrawing />
            </div>
          </div>
        );
      })}
    </Layer>
  );
});

/**
 * The caterpillar on the leaf, its head at the bitten edge, moving back with it. Its head is a small layer of its own
 * that chews once a second (H-63).
 */
export function Caterpillar() {
  const { w, h } = CATERPILLAR;
  const x = LEAF.x + EDGE + 10 - w;
  const y = BRANCH_Y - h + 14;
  return (
    <Layer x={x} y={y} w={w} h={h} className="tm-caterpillar tm-move" style={{ "--tm-eat": `${(-EATEN * 100) / w}%` } as CSSProperties}>
      <Draw w={w} h={h}>
        {[18, 44, 70, 96, 120].map((cx, i) => (
          <g key={cx}>
            <circle cx={cx} cy={i % 2 ? 50 : 54} r="20" fill={i % 2 ? "#a3d977" : "#8cc95b"} stroke={INK} strokeWidth="4" />
            <circle cx={cx - 2} cy={(i % 2 ? 50 : 54) + 22} r="4" fill={INK} />
          </g>
        ))}
      </Draw>
      <div className="tm-cat-head tm-beat" style={{ left: `${(118 / w) * 100}%`, top: "0%", width: `${(62 / w) * 100}%`, height: `${(78 / h) * 100}%` }}>
        <svg viewBox="0 0 62 78">
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
  );
}

/** The cocoon hanging under the branch, spun at the end (shown only then, by its CSS). */
function Cocoon() {
  const { w, h } = COCOON;
  return (
    <Layer x={COCOON.x - w / 2} y={COCOON.y} w={w} h={h} className="tm-cocoon">
      <Draw w={w} h={h}>
        <path d={`M${w / 2} 0 V14`} stroke="#e9e1c9" strokeWidth="4" />
        <path d={`M${w / 2} 12 C${w + 4} 20 ${w} ${h - 20} ${w / 2} ${h - 2} C0 ${h - 20} -4 20 ${w / 2} 12 Z`} fill="#c9b27c" stroke={INK} strokeWidth="4" />
        {[34, 56, 78].map((y) => (
          <path key={y} d={`M10 ${y} Q${w / 2} ${y + 10} ${w - 10} ${y}`} stroke="#a58a52" strokeWidth="3" fill="none" />
        ))}
      </Draw>
    </Layer>
  );
}

/** The butterfly that comes out of the cocoon and flies to the fox child (only at the end); its wings beat a while, then rest. */
function Butterfly() {
  const { w, h, toX, toY } = BUTTERFLY;
  const x = COCOON.x - w / 2;
  const y = COCOON.y + 20;
  const style = { "--tm-fly-x": `${((toX - x) / w) * 100}%`, "--tm-fly-y": `${((toY - y) / h) * 100}%` } as CSSProperties;
  return (
    <Layer x={x} y={y} w={w} h={h} className="tm-butterfly" style={style}>
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
    </Layer>
  );
}

/** The whole picture: the leaf with the caterpillar, and the fox family waiting on the meadow. */
export function CaterpillarScene() {
  return (
    <>
      <LeafBackdrop />
      <Leaf />
      <Cocoon />
      <Caterpillar />
      <Family kind="fox" x={1200} floor={LEAF_FLOOR} childLeft />
      <Butterfly />
    </>
  );
}
