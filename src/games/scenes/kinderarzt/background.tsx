import type { ReactElement } from "react";
import { HORIZON, depthScale, onFloor } from "../layout";
import { STEEL } from "../shared";

// The back wall: warm paint at the top, a mint wainscot with a white rail below, a painted
// rainbow and pinned drawings in the waiting room. The waiting chairs stand under the window.
// The floor is pale checkered linoleum; its tiles get smaller and paler towards the wall. A
// round play rug lies in the waiting room, and little footprints lead to the scale.

/** Floor tiles: how far each row of tiles is from the eye (bigger is further back). */
const FOCAL = 820;
const TILE = 120;
const ROWS = Array.from({ length: 10 }, (_, k) => FOCAL / 0.45 - k * TILE);
const COLUMNS = Array.from({ length: 31 }, (_, k) => (k - 15) * TILE);

/** Where the wainscot starts on the wall. */
const RAIL = 238;

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
  return <g fill="#dcecf2">{cells}</g>;
}

/** A plastic waiting chair standing on the floor at (x, y). */
function Chair({ x, y, colour, dark }: { x: number; y: number; colour: string; dark: string }) {
  const s = depthScale(y);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-50 -110 L-56 0 M50 -110 L56 0" stroke={STEEL} strokeWidth="8" strokeLinecap="round" />
      <path d="M-36 -110 L-40 -14 M36 -110 L40 -14" stroke="#adb5bd" strokeWidth="6" strokeLinecap="round" />
      <rect x="-62" y="-250" width="124" height="120" rx="30" fill={colour} />
      <path d="M-44 -232 Q-50 -190 -44 -150" stroke="#fff" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.35" />
      <path d="M-66 -132 H66 Q70 -104 58 -100 H-58 Q-70 -104 -66 -132 Z" fill={dark} />
      <rect x="-66" y="-140" width="132" height="20" rx="10" fill={colour} />
    </g>
  );
}

/** A child's drawing pinned to the wall. */
function Drawing({ x, y, tilt, children }: { x: number; y: number; tilt: number; children: ReactElement }) {
  return (
    <g transform={`rotate(${tilt} ${x + 30} ${y + 24})`}>
      <rect x={x} y={y} width="60" height="48" rx="3" fill="#fff" stroke="#e9ecef" strokeWidth="2" />
      {children}
      <circle cx={x + 30} cy={y + 4} r="4" fill="#ff6b6b" />
    </g>
  );
}

/** A little footprint on the floor at (x, y), pointing towards the back. */
function Foot({ x, y, colour }: { x: number; y: number; colour: string }) {
  const s = depthScale(y);
  return (
    <g transform={`translate(${x} ${y}) scale(${s} ${s * 0.45})`} fill={colour}>
      <ellipse cx="0" cy="0" rx="13" ry="22" />
      {[-10, -4, 2, 8].map((dx, i) => (
        <circle key={dx} cx={dx} cy={-28 - (i === 0 || i === 3 ? 0 : 3)} r={i === 0 ? 5 : 4} />
      ))}
    </g>
  );
}

export function Background() {
  const rugScale = depthScale(820);
  return (
    <>
      <defs>
        <linearGradient id="ka-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff8e1" />
          <stop offset="1" stopColor="#ffefc2" />
        </linearGradient>
        <linearGradient id="ka-floor" gradientUnits="userSpaceOnUse" x1="0" y1={HORIZON} x2="0" y2="1000">
          <stop offset="0" stopColor="#e6f0f3" />
          <stop offset="1" stopColor="#f3f9fb" />
        </linearGradient>
        <linearGradient id="ka-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b8cdd6" stopOpacity="0.45" />
          <stop offset="1" stopColor="#b8cdd6" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Wall: paint above, the wainscot with its rail below */}
      <rect width="1600" height={HORIZON} fill="url(#ka-wall)" />
      <rect y={RAIL} width="1600" height={HORIZON - RAIL} fill="#c3fae8" />
      <path
        d={`M0 ${RAIL + 40} ${Array.from({ length: 33 }, (_, i) => `q25 ${i % 2 ? 14 : -14} 50 0`).join(" ")}`}
        stroke="#96f2d7"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      {Array.from({ length: 16 }, (_, i) => (
        <circle key={i} cx={50 + i * 100} cy={RAIL + 66} r="5" fill={["#ffa8a8", "#ffd43b", "#74c0fc", "#b197fc"][i % 4]} opacity="0.8" />
      ))}
      <rect y={RAIL - 6} width="1600" height="10" rx="3" fill="#fff" />
      <rect y={RAIL + 2} width="1600" height="3" fill="#96f2d7" />
      <rect y={HORIZON - 8} width="1600" height="8" fill="#8ce99a" />

      {/* A rainbow painted on the waiting room wall, and pinned drawings */}
      <g fill="none" strokeWidth="9" strokeLinecap="round">
        {["#ff8787", "#ffc078", "#ffe066", "#8ce99a", "#74c0fc", "#b197fc"].map((c, i) => (
          <path key={c} d={`M${370 + i * 9} 222 A${68 - i * 9} ${68 - i * 9} 0 0 1 ${506 - i * 9} 222`} stroke={c} />
        ))}
      </g>
      <circle cx="372" cy="222" r="14" fill="#fff" />
      <circle cx="386" cy="226" r="11" fill="#fff" />
      <circle cx="504" cy="222" r="14" fill="#fff" />
      <circle cx="490" cy="226" r="11" fill="#fff" />
      <Drawing x={1050} y={178} tilt={-5}>
        <>
          <circle cx="1080" cy="196" r="9" fill="#ffd43b" />
          <path d="M1058 220 H1102" stroke="#51cf66" strokeWidth="5" />
        </>
      </Drawing>
      <Drawing x={690} y={52} tilt={6}>
        <>
          <path d="M704 92 V72 L720 60 L736 72 V92 Z" fill="#ff8787" />
          <rect x="716" y="80" width="8" height="12" fill="#845ef7" />
        </>
      </Drawing>

      {/* Floor */}
      <rect y={HORIZON} width="1600" height={1000 - HORIZON} fill="url(#ka-floor)" />
      <FloorTiles />
      <rect y={HORIZON} width="1600" height="70" fill="url(#ka-haze)" />

      {/* Waiting chairs under the window */}
      <Chair x={150} y={412} colour="#ff8787" dark="#fa5252" />
      <Chair x={226} y={412} colour="#ffd43b" dark="#fab005" />
      <Chair x={302} y={412} colour="#74c0fc" dark="#339af0" />

      {/* The round play rug in the waiting room */}
      <g transform={`translate(430 820) scale(${rugScale})`}>
        <ellipse cx="0" cy="0" rx="500" ry="150" fill="#ffd8a8" />
        <ellipse cx="0" cy="0" rx="430" ry="124" fill="#ffe8cc" />
        <ellipse cx="0" cy="0" rx="340" ry="96" fill="none" stroke="#ff922b" strokeWidth="8" strokeDasharray="10 22" strokeLinecap="round" opacity="0.6" />
        <ellipse cx="0" cy="-5" rx="500" ry="150" fill="none" stroke="#ffc078" strokeWidth="10" />
      </g>

      {/* Footprints on the floor leading to the scale */}
      <Foot x={1085} y={605} colour="#ffa8a8" />
      <Foot x={1125} y={575} colour="#ffa8a8" />
      <Foot x={1078} y={540} colour="#74c0fc" />
      <Foot x={1112} y={512} colour="#74c0fc" />
      <Foot x={1072} y={484} colour="#8ce99a" />
      <Foot x={1102} y={462} colour="#8ce99a" />
    </>
  );
}
