import { memo, type CSSProperties } from "react";
import { MASCOT_COLORS } from "@/components/Mascot";
import { applePlaces } from "./pieces";
import { Draw, Family, INK, Layer, STAGE_H, STAGE_W } from "./scenes";

// Apfelbaum (H-45): as many apples hang on the tree as minutes are set, and every minute one falls with a plop into the
// basket the bear child holds. Each apple is a small layer of its own whose fall is a CSS animation waiting for its
// minute (`animation-delay`), so nothing is drawn again while it runs; the heap in the basket rises a step per apple
// (`steps()`), and the apple to fall next sways softly once a second (H-63).

/** The tree's crown: its middle and radii. */
export const CROWN = { cx: 560, cy: 320, rx: 310, ry: 220 } as const;

/** The ground the tree, the family and the basket stand on. */
export const APPLE_FLOOR = 770;

/** The basket in front of the bear child: its middle, width, the rim's height and its bottom. */
export const BASKET = { cx: 1000, w: 210, rim: 715, bottom: APPLE_FLOOR } as const;

/** How long an apple takes to fall into the basket, in ms; it lands as its minute is over. */
export const APPLE_FALL_MS = 1100;

/** How big an apple is when it lands in the basket, against its size on the tree (the basket is small for a big apple). */
export const APPLE_LANDED = 0.6;

/** An apple's radius on the tree: smaller when many hang there, so they all fit. */
export function appleRadius(count: number) {
  return count <= 6 ? 40 : count <= 12 ? 34 : count <= 20 ? 29 : 25;
}

/** Sky, meadow and the tree with its crown; drawn once. */
export const AppleBackdrop = memo(function AppleBackdrop() {
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-back">
      <Draw w={STAGE_W} h={STAGE_H}>
        <defs>
          <linearGradient id="tm-apple-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9ad8ff" />
            <stop offset="1" stopColor="#eaf8ff" />
          </linearGradient>
        </defs>
        <rect width={STAGE_W} height={STAGE_H} fill="url(#tm-apple-sky)" />
        <circle cx="1260" cy="180" r="66" fill="#ffe066" />
        <path d="M0 600 Q420 520 820 590 T1600 560 V900 H0 Z" fill="#a9dc84" />
        <rect y={APPLE_FLOOR - 10} width={STAGE_W} height={STAGE_H} fill="#7cc35a" />
        {/* The trunk and the crown with a few lighter clumps of leaves. */}
        <path
          d={`M${CROWN.cx - 44} ${APPLE_FLOOR} Q${CROWN.cx - 30} 560 ${CROWN.cx - 40} 470 L${CROWN.cx + 40} 470 Q${CROWN.cx + 30} 560 ${CROWN.cx + 44} ${APPLE_FLOOR} Z`}
          fill="#8a5a2b"
          stroke={INK}
          strokeWidth="5"
        />
        <ellipse cx={CROWN.cx} cy={CROWN.cy} rx={CROWN.rx} ry={CROWN.ry} fill="#3f9b4f" stroke={INK} strokeWidth="6" />
        {[
          [-170, -90, 90],
          [60, -140, 100],
          [190, 20, 90],
          [-60, 80, 110],
        ].map(([dx, dy, r]) => (
          <circle key={dx} cx={CROWN.cx + dx} cy={CROWN.cy + dy} r={r} fill="#52b062" opacity="0.7" />
        ))}
      </Draw>
    </Layer>
  );
});

/** One apple, drawn in a 100 × 100 box: red, with a light, a stalk and a leaf. */
function Apple() {
  return (
    <svg viewBox="0 0 100 100">
      <path d="M50 26 C30 12 6 22 8 52 C10 80 32 96 50 88 C68 96 90 80 92 52 C94 22 70 12 50 26 Z" fill="#e8413a" stroke={INK} strokeWidth="5" />
      <ellipse cx="32" cy="42" rx="8" ry="13" fill="#ff9d8f" transform="rotate(20 32 42)" />
      <path d="M50 26 Q52 14 58 6" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M56 14 Q70 4 82 12 Q70 22 56 14 Z" fill="#69c46c" stroke={INK} strokeWidth="3" />
    </svg>
  );
}

/**
 * The apples on the tree, falling one a minute into the basket from left to right. Each falls on its own clock: the
 * layer moves across (`--tm-dx`), the inner box down (`--tm-dy`, faster and faster), and the one to fall next sways for
 * its whole minute, a soft swing every second.
 */
export const Apples = memo(function Apples({ count, total }: { count: number; total: number }) {
  const r = appleRadius(count);
  const unit = total / count;
  const places = applePlaces(count, CROWN.rx - r - 24, CROWN.ry - r - 24);
  // It lands deep in the basket, a little smaller (`tm-apple-down` scales it), hidden by the basket's front.
  const target = { x: BASKET.cx, y: BASKET.bottom - APPLE_LANDED * r - 4 };
  return (
    <>
      {places.map((p, i) => {
        const x = CROWN.cx + p.x;
        const y = CROWN.cy + p.y;
        const fall = (i + 1) * unit - APPLE_FALL_MS;
        const sways = Math.max(0, Math.floor((unit - APPLE_FALL_MS) / 1000));
        const style = {
          "--tm-dx": `${((target.x - x) / (2 * r)) * 100}%`,
          "--tm-dy": `${((target.y - y) / (2 * r)) * 100}%`,
          animationDelay: `${fall}ms`,
        } as CSSProperties;
        return (
          <Layer key={i} x={x - r} y={y - r} w={2 * r} h={2 * r} className="tm-apple" style={style}>
            <div className="tm-apple-drop" style={{ animationDelay: `${fall}ms` }}>
              <div className="tm-apple-sway" style={{ animationDelay: `${i * unit}ms`, animationIterationCount: sways }}>
                <Apple />
              </div>
            </div>
          </Layer>
        );
      })}
    </>
  );
});

/** The heap of apples in the basket, rising a step with every apple that lands (its CSS, `steps(--tm-n)`). */
export function AppleHeap() {
  const left = BASKET.cx - BASKET.w / 2 + 12;
  const w = BASKET.w - 24;
  const top = BASKET.rim - 60;
  const h = BASKET.bottom - top;
  return (
    <Layer x={left} y={top} w={w} h={h} className="tm-heap-box">
      <div className="tm-heap">
        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
          {[
            [32, 92],
            [78, 95],
            [124, 92],
            [160, 96],
            [54, 60],
            [100, 57],
            [142, 63],
            [78, 28],
            [118, 26],
          ].map(([cx, cy]) => (
            <g key={`${cx} ${cy}`}>
              <circle cx={cx} cy={cy} r="24" fill="#e8413a" stroke={INK} strokeWidth="4" />
              <ellipse cx={cx - 8} cy={cy - 8} rx="5" ry="8" fill="#ff9d8f" />
            </g>
          ))}
        </svg>
      </div>
    </Layer>
  );
}

/** The basket's front, woven, with the bear child's paws on its rim: in front of the heap and the apples landing. */
export const BasketFront = memo(function BasketFront() {
  const { cx, w, rim, bottom } = BASKET;
  const paw = MASCOT_COLORS.bear;
  return (
    <Layer x={cx - w / 2 - 10} y={rim - 20} w={w + 20} h={bottom - rim + 30}>
      <Draw w={w + 20} h={bottom - rim + 30}>
        <path d={`M10 20 H${w + 10} L${w - 6} ${bottom - rim + 18} H26 Z`} fill="#d9a066" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        {[38, 56].map((y) => (
          <path key={y} d={`M${18} ${y} H${w + 2}`} stroke="#a8743f" strokeWidth="6" />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <path key={i} d={`M${40 + i * 25} 24 V${bottom - rim + 12}`} stroke="#a8743f" strokeWidth="4" />
        ))}
        <rect x="4" y="12" width={w + 12} height="16" rx="8" fill="#c48a4f" stroke={INK} strokeWidth="5" />
        {/* The bear child's paws holding the rim. */}
        {[w / 2 - 22, w / 2 + 42].map((x) => (
          <ellipse key={x} cx={x} cy="18" rx="17" ry="13" fill={paw.fur} stroke={INK} strokeWidth="4" />
        ))}
      </Draw>
    </Layer>
  );
});

/** The whole picture: the tree with its apples, the bear grown-up and the child with the basket. */
export function AppleScene({ count, total }: { count: number; total: number }) {
  return (
    <>
      <AppleBackdrop />
      <Family kind="bear" x={BASKET.cx + 50} floor={APPLE_FLOOR} childLeft />
      <AppleHeap />
      <Apples count={count} total={total} />
      <BasketFront />
    </>
  );
}
