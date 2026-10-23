import type { CSSProperties, ReactNode } from "react";
import { Hideout } from "../hideout";
import { Inside, nth } from "../shared";

// The big trees, the stump and the log pile. Foot point at (0, 0). The birds and the
// mouse that live in them are drawn in birds.tsx and animals.tsx, in the same coordinates.

/** Tiers of the fir from bottom to top: [bottom, top, half width]. */
const TIERS = [
  [-70, -272, 150],
  [-190, -382, 122],
  [-300, -482, 94],
  [-410, -568, 62],
] as const;

function tier(bottom: number, top: number, hw: number) {
  const mid = (top + bottom) / 2;
  return `M0 ${top} Q${hw * 0.4} ${mid} ${hw} ${bottom} Q${hw * 0.5} ${bottom - 16} 0 ${bottom - 4} Q${-hw * 0.5} ${bottom - 16} ${-hw} ${bottom} Q${-hw * 0.4} ${mid} 0 ${top} Z`;
}

/** Tall fir with cones; its tiers sway one after the other, needles trickle and two cones drop to the ground. */
export function Tanne() {
  return (
    <>
      <path d="M-16 0 L-12 -110 H12 L16 0 Z" fill="#7f5539" />
      <path d="M-6 -20 v-30 M6 -60 v-26" stroke="#6b4423" strokeWidth="3" strokeLinecap="round" />
      {TIERS.map(([bottom, top, hw], i) => (
        <g key={top} className="wd-tanne-tier" style={{ transformOrigin: `0px ${bottom}px`, ...nth(i) }}>
          <path d={tier(bottom, top, hw)} fill="#2d6a4f" />
          <path d={`M0 ${top} Q${-hw * 0.4} ${(top + bottom) / 2} ${-hw} ${bottom} Q${-hw * 0.5} ${bottom - 16} 0 ${bottom - 4} Z`} fill="#40916c" />
          <path d={`M${-hw * 0.5} ${bottom - 30} q12 -8 24 0 M${hw * 0.2} ${bottom - 44} q12 -8 24 0`} stroke="#1b4332" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      ))}
      {[
        [-96, -78],
        [70, -196],
        [-56, -306],
        [44, -416],
      ].map(([cx, cy], i) => (
        <g key={cx} className="wd-tanne-cone" style={{ transformOrigin: `${cx}px ${cy - 10}px`, ...nth(i) }}>
          <ellipse cx={cx} cy={cy} rx="7" ry="13" fill="#9c6644" />
          <path d={`M${cx - 5} ${cy - 4} h10 M${cx - 5} ${cy + 4} h10`} stroke="#7f5539" strokeWidth="2" />
        </g>
      ))}
      <g className="wd-tanne-fall">
        {[
          [-80, -84],
          [90, -200],
        ].map(([cx, cy], i) => (
          <ellipse key={cx} cx={cx} cy={cy} rx="7" ry="13" fill="#9c6644" style={{ ...nth(i), "--fall": `${-cy - 8}px` } as CSSProperties} />
        ))}
      </g>
      <g className="wd-tanne-needles" stroke="#2d6a4f" strokeWidth="3" strokeLinecap="round">
        {[-60, -20, 30, 80].map((x, i) => (
          <path key={x} d={`M${x} ${-120 - i * 40} l5 6`} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

const CROWN = [
  [0, -370, 140, "#40916c"],
  [-140, -318, 95, "#2d6a4f"],
  [140, -318, 95, "#2d6a4f"],
  [-60, -440, 85, "#52b788"],
  [70, -440, 80, "#40916c"],
] as const;

const ACORNS = [
  [-110, -300],
  [120, -280],
  [-30, -340],
  [60, -380],
  [-160, -350],
  [10, -460],
];

/** Old oak with a hollow for the owl; the crown shakes, leaves flutter down and acorns drop. */
export function Eiche() {
  return (
    <>
      <path d="M-62 0 Q-30 -8 -30 -60 L-26 -250 H26 L30 -60 Q30 -8 62 0 Z" fill="#8d6346" />
      <path d="M-14 -20 q-6 -40 0 -80 M14 -40 q6 -40 0 -70 M-12 -210 q-4 -20 2 -36" stroke="#6f4e37" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M-20 -230 Q-90 -260 -150 -296 M20 -222 Q90 -256 150 -296" stroke="#8d6346" strokeWidth="22" strokeLinecap="round" fill="none" />
      {/* The hollow the owl lives in */}
      <ellipse cx="0" cy="-160" rx="31" ry="41" fill="#6f4e37" />
      <ellipse cx="0" cy="-158" rx="25" ry="35" fill="#3d2b1f" />
      <g className="wd-eiche-crown" style={{ transformOrigin: "0px -240px" }}>
        {CROWN.map(([cx, cy, r, fill]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={fill} />
        ))}
        <circle cx="-80" cy="-470" r="26" fill="#74c69d" opacity="0.7" />
        <circle cx="40" cy="-400" r="40" fill="#74c69d" opacity="0.4" />
        {ACORNS.map(([cx, cy]) => (
          <g key={cx}>
            <ellipse cx={cx} cy={cy + 4} rx="7" ry="9" fill="#bc6c25" />
            <path d={`M${cx - 8} ${cy} Q${cx} ${cy - 10} ${cx + 8} ${cy} Z`} fill="#7f5539" />
          </g>
        ))}
      </g>
      <g className="wd-eiche-leaves" fill="#52b788">
        {[
          [-170, -240],
          [150, -236],
          [-60, -250],
        ].map(([cx, cy], i) => (
          <path key={cx} d={`M${cx - 12} ${cy} Q${cx} ${cy - 9} ${cx + 12} ${cy} Q${cx} ${cy + 9} ${cx - 12} ${cy} Z`} style={nth(i)} />
        ))}
      </g>
      <g className="wd-eiche-fall">
        {[
          [-120, -236],
          [110, -230],
        ].map(([cx, cy], i) => (
          <g key={cx} style={{ ...nth(i), "--fall": `${-cy - 8}px` } as CSSProperties}>
            <ellipse cx={cx} cy={cy + 4} rx="7" ry="9" fill="#bc6c25" />
            <path d={`M${cx - 8} ${cy} Q${cx} ${cy - 10} ${cx + 8} ${cy} Z`} fill="#7f5539" />
          </g>
        ))}
      </g>
    </>
  );
}

const BIRCH_LEAVES = [
  [-90, -440],
  [-50, -500],
  [0, -530],
  [56, -500],
  [96, -440],
  [-110, -380],
  [110, -380],
  [-30, -430],
  [36, -450],
  [0, -470],
] as const;

/** Slim birch with a white trunk; it sways, its little leaves shimmer and a few float down. */
export function Birke() {
  return (
    <>
      <g className="wd-birke-sway" style={{ transformOrigin: "0px 0px" }}>
        <path d="M-14 0 L-10 -470 H10 L14 0 Z" fill="#f8f9fa" />
        <path d="M-14 0 L-10 -470 H-3 L-4 0 Z" fill="#dee2e6" />
        <path
          d="M-12 -40 h10 M2 -90 h10 M-11 -130 h8 M4 -250 h8 M-10 -290 h12 M-8 -390 h8 M2 -420 h8 M-12 -60 h4 M6 -200 h6"
          stroke="#343a40"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path d="M0 -330 Q-50 -380 -84 -440 M0 -300 Q60 -350 92 -428" stroke="#f1f3f5" strokeWidth="9" strokeLinecap="round" fill="none" />
        <path d="M-40 -386 h6 M50 -360 h6" stroke="#343a40" strokeWidth="4" strokeLinecap="round" />
        {BIRCH_LEAVES.map(([cx, cy], i) => (
          <g key={`${cx}-${cy}`} className="wd-birke-leaf" style={{ transformOrigin: `${cx}px ${cy}px`, ...nth(i % 4) }}>
            <ellipse cx={cx} cy={cy} rx="34" ry="28" fill={i % 2 ? "#95d5b2" : "#74c69d"} />
            <ellipse cx={cx - 8} cy={cy - 8} rx="12" ry="8" fill="#d8f3dc" opacity="0.6" />
          </g>
        ))}
      </g>
      <g className="wd-birke-fall" fill="#b7e4c7">
        {[
          [-70, -360],
          [80, -350],
          [20, -400],
        ].map(([cx, cy], i) => (
          <ellipse key={cx} cx={cx} cy={cy} rx="8" ry="5" style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** Where the mouse lives: a hole low in the stump, as one clip path (the hole plus everything left of it). */
export const STUMP_HOLE = { cx: -80, cy: -20, rx: 16, ry: 17 };

/** Old tree stump with rings, moss and two little mushrooms; it wobbles, the mushrooms bounce and the rings glow. */
export function Baumstumpf() {
  const { cx, cy, rx, ry } = STUMP_HOLE;
  return (
    <>
      {/* Someone else peeks out from behind the stump every time */}
      <Hideout x={-55} y={-222} w={110} h={118} size={86} />
      <path d="M-104 0 Q-90 -14 -84 -30 L-82 -96 H82 L84 -30 Q90 -14 104 0 Z" fill="#9c6644" />
      <path d="M-60 -10 q-4 -40 0 -76 M-20 -6 q-4 -40 0 -80 M30 -8 q4 -40 0 -80 M64 -10 q4 -36 0 -74" stroke="#7f5539" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M-104 0 Q-120 -4 -128 6 M104 0 Q124 -2 132 8" stroke="#9c6644" strokeWidth="12" strokeLinecap="round" />
      <ellipse cx={cx} cy={cy} rx={rx + 5} ry={ry + 5} fill="#7f5539" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#3d2b1f" />
      <g className="wd-stumpf-top" style={{ transformOrigin: "0px -96px" }}>
        <ellipse cx="0" cy="-96" rx="84" ry="24" fill="#e6c79c" />
        <g fill="none" stroke="#c49a6c" strokeWidth="3">
          {[16, 32, 48, 64].map((r) => (
            <ellipse key={r} className="wd-stumpf-ring" cx="0" cy="-96" rx={r} ry={r * 0.28} style={nth(r / 16)} />
          ))}
        </g>
        <path d="M-84 -96 Q-70 -112 -40 -110 Q-50 -98 -84 -96 Z" fill="#74c69d" />
      </g>
      {[
        [62, -40, 1],
        [82, -24, 0.8],
      ].map(([x, y, s], i) => (
        <g key={x} className="wd-stumpf-mushroom" style={{ transformOrigin: `${x}px ${y + 14 * s}px`, ...nth(i) }}>
          <rect x={x - 4 * s} y={y} width={8 * s} height={14 * s} rx="3" fill="#f8f1e5" />
          <path d={`M${x - 15 * s} ${y + 2 * s} Q${x} ${y - 20 * s} ${x + 15 * s} ${y + 2 * s} Z`} fill="#dda15e" />
        </g>
      ))}
      <path d="M-70 -60 q8 -6 14 0 M40 -70 q8 -6 14 0" stroke="#74c69d" strokeWidth="6" strokeLinecap="round" fill="none" />
    </>
  );
}

/** Clip for the mouse in the stump: the hole and everything to its left, so it can run out of it. */
export function StumpHole({ children }: { children: ReactNode }) {
  const { cx, cy, rx, ry } = STUMP_HOLE;
  return <Inside d={`M-260 -140 H${cx} V20 H-260 Z M${cx - rx} ${cy} a${rx} ${ry} 0 1 1 ${2 * rx} 0 a${rx} ${ry} 0 1 1 ${-2 * rx} 0 Z`}>{children}</Inside>;
}

/** A log end with rings, centred on (cx, cy). */
function LogEnd({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill="#e6c79c" stroke="#9c6644" strokeWidth="6" />
      <circle cx={cx} cy={cy} r={r * 0.62} fill="none" stroke="#c49a6c" strokeWidth="3" />
      <circle cx={cx} cy={cy} r={r * 0.28} fill="none" stroke="#c49a6c" strokeWidth="3" />
    </>
  );
}

const LOGS = [
  [-64, -30],
  [0, -30],
  [64, -30],
  [-32, -84],
  [32, -84],
  [0, -138],
] as const;

/** A pile of logs; the logs roll and bounce one after the other and sawdust puffs out. */
export function Holzstapel() {
  return (
    <>
      <path d="M-94 -2 L-60 -24 H130 L104 -2 Z" fill="#7f5539" opacity="0.4" />
      {/* Someone else peeks out from behind the logs every time */}
      <Hideout x={82} y={-150} w={64} h={92} size={64} />
      {LOGS.map(([cx, cy], i) => (
        <g key={`${cx}-${cy}`} className="wd-holz-log" style={{ transformOrigin: `${cx}px ${cy}px`, ...nth(i) }}>
          <path d={`M${cx} ${cy - 30} H${cx + 46} A12 30 0 0 1 ${cx + 46} ${cy + 30} H${cx} Z`} fill="#9c6644" />
          <path d={`M${cx + 10} ${cy - 14} H${cx + 40} M${cx + 14} ${cy + 12} H${cx + 42}`} stroke="#7f5539" strokeWidth="3" strokeLinecap="round" />
          <LogEnd cx={cx} cy={cy} r={30} />
        </g>
      ))}
      <g className="wd-holz-dust" fill="#e6c79c">
        {[-90, 0, 100].map((cx, i) => (
          <circle key={cx} cx={cx} cy="-10" r="11" style={nth(i)} />
        ))}
      </g>
    </>
  );
}
