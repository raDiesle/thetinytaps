import type { ReactElement } from "react";
import { HORIZON, depthScale } from "../layout";
import { STEEL } from "../shared";
import { onFloor } from "./layout";

// The back wall: painted at the top, small tiles below with a blue border, and a skirting
// at the bottom. The floor is a checkered tiled floor; its tiles get smaller and paler towards
// the wall. On it the round bath mat in front of the tub and a few drops. On the wall: the
// rail for the towel, the shelf above the toilet and the hook for the toilet paper.

/** Floor tiles: how far each row of tiles is from the eye (bigger is further back). */
const FOCAL = 820;
const TILE = 120;
const ROWS = Array.from({ length: 10 }, (_, k) => FOCAL / 0.45 - k * TILE);
const COLUMNS = Array.from({ length: 31 }, (_, k) => (k - 15) * TILE);

/** Wall tiles: their size at the back wall. */
const WALL_TILE = TILE * 0.45;
const WALL_TILE_TOP = HORIZON - 3 * WALL_TILE;

function FloorTiles() {
  const cells: ReactElement[] = [];
  ROWS.forEach((z, row) => {
    const far = FOCAL / z;
    const near = FOCAL / (z - TILE);
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
  return <g fill="#e7d8c4">{cells}</g>;
}

function FloorJoints() {
  const lines = ROWS.map((z) => {
    const [, y] = onFloor(0, FOCAL / z);
    return `M0 ${y} H1600`;
  });
  const columns = COLUMNS.map((x) => {
    const [xa, ya] = onFloor(x, 0.45);
    const [xb, yb] = onFloor(x, 1.2);
    return `M${xa} ${ya} L${xb} ${yb}`;
  });
  return <path d={[...lines, ...columns].join(" ")} stroke="#fff" strokeWidth="2" opacity="0.6" />;
}

function WallTiles() {
  const rows = Array.from({ length: 4 }, (_, i) => `M0 ${HORIZON - i * WALL_TILE} H1600`);
  const columns = Array.from({ length: Math.ceil(1600 / WALL_TILE) + 1 }, (_, i) => `M${i * WALL_TILE} ${WALL_TILE_TOP} V${HORIZON}`);
  return <path d={[...rows, ...columns].join(" ")} stroke="#fff" strokeWidth="2.5" opacity="0.85" />;
}

/** A puddle of water on the floor at (x, y). */
function Puddle({ x, y, w }: { x: number; y: number; w: number }) {
  const s = depthScale(y);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M${-w} 0 Q${-w} -14 ${-w * 0.4} -16 Q0 -24 ${w * 0.5} -16 Q${w} -12 ${w} 0 Q${w * 0.6} 12 0 10 Q${-w * 0.7} 14 ${-w} 0 Z`} fill="#a5d8ff" opacity="0.7" />
      <path d={`M${-w * 0.5} -8 Q0 -14 ${w * 0.3} -10`} stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.8" />
    </g>
  );
}

export function Background() {
  const matScale = depthScale(690);
  return (
    <>
      <defs>
        <linearGradient id="bz-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff4e0" />
          <stop offset="1" stopColor="#fdebd0" />
        </linearGradient>
        <linearGradient id="bz-floor" gradientUnits="userSpaceOnUse" x1="0" y1={HORIZON} x2="0" y2="1000">
          <stop offset="0" stopColor="#efe6da" />
          <stop offset="1" stopColor="#f8f1e7" />
        </linearGradient>
        <linearGradient id="bz-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efe6da" stopOpacity="0.8" />
          <stop offset="1" stopColor="#efe6da" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Wall: paint above, tiles below */}
      <rect width="1600" height={HORIZON} fill="url(#bz-wall)" />
      <rect y={WALL_TILE_TOP} width="1600" height={HORIZON - WALL_TILE_TOP} fill="#c5ecef" />
      <WallTiles />
      <rect y={WALL_TILE_TOP - 14} width="1600" height="14" fill="#74c0fc" />
      <path d={`M0 ${WALL_TILE_TOP - 14} H1600`} stroke="#fff" strokeWidth="3" opacity="0.6" />
      {/* Little fish on some tiles */}
      {[160, 560, 980, 1360].map((x) => (
        <g key={x} transform={`translate(${x} ${HORIZON - WALL_TILE * 1.5}) scale(0.45)`} fill="#74c0fc">
          <ellipse cx="0" cy="0" rx="22" ry="13" />
          <path d="M18 0 L36 -12 V12 Z" />
          <circle cx="-10" cy="-3" r="3" fill="#fff" />
        </g>
      ))}
      <rect y={HORIZON - 8} width="1600" height="8" fill="#99d5db" />

      {/* Floor */}
      <rect y={HORIZON} width="1600" height={1000 - HORIZON} fill="url(#bz-floor)" />
      <FloorTiles />
      <FloorJoints />
      <rect y={HORIZON} width="1600" height="60" fill="url(#bz-haze)" />

      {/* Towel rail and the toilet paper holder's plate */}
      <rect x="852" y="124" width="10" height="18" rx="4" fill={STEEL} />
      <rect x="958" y="124" width="10" height="18" rx="4" fill={STEEL} />
      <rect x="852" y="128" width="116" height="8" rx="4" fill="#ced4da" />
      <rect x="1136" y="242" width="52" height="10" rx="4" fill={STEEL} />

      {/* Shelf above the toilet */}
      <rect x="990" y="196" width="190" height="12" rx="4" fill="#ffd6a5" />
      <rect x="990" y="204" width="190" height="4" rx="2" fill="#e9b872" />
      <path d="M1012 208 v14 h10 M1158 208 v14 h-10" stroke={STEEL} strokeWidth="4" fill="none" />

      {/* Bath mat in front of the tub */}
      <g transform={`translate(300 690) scale(${matScale})`}>
        <ellipse cx="0" cy="0" rx="190" ry="58" fill="#ffafcc" />
        <ellipse cx="0" cy="0" rx="150" ry="42" fill="none" stroke="#fff" strokeWidth="6" strokeDasharray="4 12" strokeLinecap="round" />
        <ellipse cx="0" cy="-4" rx="190" ry="58" fill="none" stroke="#ffc8dd" strokeWidth="6" />
      </g>

      {/* Drops and puddles on the floor */}
      <Puddle x={640} y={975} w={90} />
      <Puddle x={1350} y={930} w={110} />
      <Puddle x={150} y={910} w={70} />
    </>
  );
}
