import type { ReactElement } from "react";
import { HORIZON, depthScale, onFloor } from "../layout";
import { STEEL } from "../shared";
import { COUNTER_END, COUNTER_END_BACK, COUNTER_FOOT, WORKTOP_BACK, WORKTOP_FRONT } from "./layout";

// The back wall: warm paint, a band of small tiles behind the worktop and a shelf strip. The
// kitchen counter runs in front of it: the worktop seen from above, the cupboard fronts that
// are no items, the hob on the stove and the plinth with a mouse hole. The floor is checkered;
// its tiles get smaller and paler towards the counter, and a round rug lies under the table.

export const CUPBOARD = "#b2e2c4";
export const CUPBOARD_DARK = "#8cc9a3";
export const WORKTOP = "#e9b872";

/** Floor tiles: how far each row of tiles is from the eye (bigger is further back). */
const FOCAL = 820;
const TILE = 130;
const ROWS = Array.from({ length: 9 }, (_, k) => FOCAL / depthScale(COUNTER_FOOT) - k * TILE);
const COLUMNS = Array.from({ length: 29 }, (_, k) => (k - 14) * TILE);

function FloorTiles() {
  const cells: ReactElement[] = [];
  ROWS.forEach((z, row) => {
    const far = FOCAL / z;
    const near = FOCAL / Math.max(z - TILE, 1);
    COLUMNS.forEach((x, col) => {
      if ((row + col) % 2) return;
      const [x1, y1] = onFloor(x, far);
      const [x2] = onFloor(x + TILE, far);
      const [x3, y3] = onFloor(x + TILE, near);
      const [x4] = onFloor(x, near);
      if (x3 < -40 || x4 > 1640) return;
      cells.push(<path key={`${row}-${col}`} d={`M${x1} ${y1} H${x2} L${x3} ${y3} H${x4} Z`} />);
    });
  });
  return <g fill="#ecd3a8">{cells}</g>;
}

/** Small tiles behind the worktop, between the wall cupboards and the worktop. */
function Backsplash() {
  const top = 112;
  const size = 26;
  const rows = Array.from({ length: Math.ceil((WORKTOP_BACK - top) / size) + 1 }, (_, i) => `M0 ${top + i * size} H1400`);
  const columns = Array.from({ length: Math.ceil(1400 / size) + 1 }, (_, i) => `M${i * size} ${top} V${WORKTOP_BACK}`);
  return (
    <>
      <rect y={top} width="1400" height={WORKTOP_BACK - top} fill="#d3f9d8" />
      <path d={[...rows, ...columns].join(" ")} stroke="#fff" strokeWidth="2.5" opacity="0.9" />
      {/* A few tiles with a little red heart */}
      {[78, 650, 1180].map((x, i) => (
        <path key={x} d={`M${x} ${top + 44 + (i % 2) * 26} c-6 -8 -16 -2 -8 6 l8 7 l8 -7 c8 -8 -2 -14 -8 -6 Z`} fill="#ff8787" opacity="0.8" />
      ))}
    </>
  );
}

/** A cupboard door (picture coordinates) with a knob; for the cupboards that are no items. */
export function CupboardDoor({ x, y, w, h, knob }: { x: number; y: number; w: number; h: number; knob: "left" | "right" }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx="6" fill={CUPBOARD} stroke={CUPBOARD_DARK} strokeWidth="3" />
      <rect x={x + 10} y={y + 10} width={w - 20} height={h - 20} rx="5" fill="none" stroke="#fff" strokeWidth="3" opacity="0.5" />
      <circle cx={knob === "left" ? x + 18 : x + w - 18} cy={y + 24} r="6" fill="#ffd166" stroke="#e9a23b" strokeWidth="2" />
    </>
  );
}

export function Background() {
  const rugScale = depthScale(800);
  return (
    <>
      <defs>
        <linearGradient id="kc-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff3cf" />
          <stop offset="1" stopColor="#ffe8b0" />
        </linearGradient>
        <linearGradient id="kc-floor" gradientUnits="userSpaceOnUse" x1="0" y1={COUNTER_FOOT} x2="0" y2="1000">
          <stop offset="0" stopColor="#f6e6c8" />
          <stop offset="1" stopColor="#fbf0dc" />
        </linearGradient>
        <linearGradient id="kc-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9a87a" stopOpacity="0.35" />
          <stop offset="1" stopColor="#c9a87a" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Wall and the tiles behind the worktop */}
      <rect width="1600" height={HORIZON} fill="url(#kc-wall)" />
      <Backsplash />
      {/* The wall right of the fridge */}
      <rect x="1590" width="10" height={HORIZON} fill="#ffe8b0" />

      {/* Floor */}
      <rect y={COUNTER_FOOT - 2} width="1600" height={1002 - COUNTER_FOOT} fill="url(#kc-floor)" />
      <FloorTiles />
      <rect y={COUNTER_FOOT} width="1600" height="40" fill="url(#kc-haze)" />

      {/* Round rug under the table */}
      <g transform={`translate(760 800) scale(${rugScale})`}>
        <ellipse cx="0" cy="0" rx="440" ry="110" fill="#ffc9c9" />
        <ellipse cx="0" cy="0" rx="380" ry="88" fill="none" stroke="#fff" strokeWidth="8" strokeDasharray="6 16" strokeLinecap="round" />
        <ellipse cx="0" cy="-4" rx="440" ry="110" fill="none" stroke="#ffa8a8" strokeWidth="8" />
      </g>

      {/* Worktop, seen from above, and its front edge */}
      <path d={`M0 ${WORKTOP_BACK} H${COUNTER_END_BACK} L${COUNTER_END} ${WORKTOP_FRONT} H0 Z`} fill="#f3cf94" />
      <path d={`M0 ${WORKTOP_BACK + 3} H${COUNTER_END_BACK}`} stroke="#d9a75e" strokeWidth="4" opacity="0.5" />
      {/* Wood grain */}
      <path
        d={`M40 ${WORKTOP_BACK + 22} h180 M300 ${WORKTOP_BACK + 40} h140 M620 ${WORKTOP_BACK + 18} h120 M1080 ${WORKTOP_BACK + 46} h160 M60 ${WORKTOP_BACK + 58} h90`}
        stroke="#e2b673"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect y={WORKTOP_FRONT - 2} width={COUNTER_END} height="12" rx="3" fill={WORKTOP} />
      <rect y={WORKTOP_FRONT + 7} width={COUNTER_END} height="4" fill="#d4a35a" />

      {/* Hob on the stove: black glass with four rings */}
      <path d={`M792 ${WORKTOP_FRONT - 6} L806 ${WORKTOP_BACK + 6} H1022 L1036 ${WORKTOP_FRONT - 6} Z`} fill="#343a40" />
      <path d={`M812 ${WORKTOP_BACK + 12} L800 ${WORKTOP_FRONT - 12}`} stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.15" />
      {[
        [862, WORKTOP_BACK + 22, 34],
        [966, WORKTOP_BACK + 22, 30],
        [850, WORKTOP_FRONT - 26, 44],
        [978, WORKTOP_FRONT - 26, 40],
      ].map(([cx, cy, rx], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={rx * 0.32} fill="none" stroke="#868e96" strokeWidth="3" />
      ))}

      {/* Cupboard fronts below the worktop */}
      <rect y={WORKTOP_FRONT + 11} width={COUNTER_END} height={COUNTER_FOOT - 14 - WORKTOP_FRONT - 11} fill={CUPBOARD_DARK} />
      <CupboardDoor x={4} y={WORKTOP_FRONT + 16} w={84} h={128} knob="right" />
      <CupboardDoor x={92} y={WORKTOP_FRONT + 16} w={84} h={128} knob="left" />
      <CupboardDoor x={584} y={WORKTOP_FRONT + 16} w={84} h={128} knob="right" />
      <CupboardDoor x={672} y={WORKTOP_FRONT + 16} w={84} h={128} knob="left" />
      <CupboardDoor x={1244} y={WORKTOP_FRONT + 16} w={150} h={128} knob="left" />
      {/* Plinth with a mouse hole */}
      <rect y={COUNTER_FOOT - 14} width={COUNTER_END} height="14" fill="#6f9b7d" />
      <path
        d={`M1222 ${COUNTER_FOOT} V${COUNTER_FOOT - 8} Q1222 ${COUNTER_FOOT - 20} 1236 ${COUNTER_FOOT - 20} Q1250 ${COUNTER_FOOT - 20} 1250 ${COUNTER_FOOT - 8} V${COUNTER_FOOT} Z`}
        fill="#3d405b"
      />

      {/* The lamp's ceiling rose */}
      <rect x="742" y="0" width="36" height="8" rx="3" fill={STEEL} />
    </>
  );
}
