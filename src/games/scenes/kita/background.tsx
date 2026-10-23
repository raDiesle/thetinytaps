import type { ReactElement } from "react";
import { HORIZON, depthScale, onFloor, towardsHorizon } from "../layout";
import { INK } from "../shared";

// The back wall: sunny yellow paint with little dots, a mint band below with the wooden rail
// and the skirting; the bench with the shoe cubbies below the coat hooks, the light switch,
// the giraffe growth chart and a few stickers. The floor is made of light wooden planks that
// run towards the back; the building rug with its road, the round reading rug and the soft
// blue carpet of the sleeping corner lie on it.

const RAIL = 250;

/** Dots on the wall paint, every other row shifted. */
function Dots() {
  const dots: ReactElement[] = [];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 24; col++) {
      const x = col * 70 + (row % 2) * 35 + 20;
      dots.push(<circle key={`${row}-${col}`} cx={x} cy={26 + row * 48} r="4" />);
    }
  }
  return <g fill="#ffe8a3">{dots}</g>;
}

/** Floor planks: their joints run towards the back, with short cross joints. */
function Planks() {
  const long = Array.from({ length: 25 }, (_, i) => {
    const x = -640 + i * 120;
    return `M${towardsHorizon(x, 1000, HORIZON + 2)} ${HORIZON + 2} L${x} 1000`;
  });
  const rows = [352, 384, 424, 474, 534, 606, 690, 788, 900];
  const cross = rows.flatMap((y, r) =>
    Array.from({ length: 25 }, (_, i) => {
      if ((i + r) % 3) return "";
      const x = -640 + i * 120;
      return `M${towardsHorizon(x, 1000, y)} ${y} L${towardsHorizon(x + 120, 1000, y)} ${y}`;
    }),
  );
  return (
    <>
      <path d={long.join(" ")} stroke="#e0b98a" strokeWidth="2.5" opacity="0.6" />
      <path d={cross.join(" ")} stroke="#e0b98a" strokeWidth="2" opacity="0.45" />
    </>
  );
}

/** A four-cornered patch on the floor between world x `x1`..`x2` and depth scales `s1` (back) .. `s2` (front). */
function floorQuad(x1: number, x2: number, s1: number, s2: number) {
  const [ax, ay] = onFloor(x1, s1);
  const [bx] = onFloor(x2, s1);
  const [cx, cy] = onFloor(x2, s2);
  const [dx] = onFloor(x1, s2);
  return `M${ax} ${ay} L${bx} ${ay} L${cx} ${cy} L${dx} ${cy} Z`;
}

/** A line on the floor at depth scale `s` from world x `x1` to `x2`. */
function floorLine(x1: number, x2: number, s: number) {
  const [ax, ay] = onFloor(x1, s);
  const [bx] = onFloor(x2, s);
  return `M${ax} ${ay} L${bx} ${ay}`;
}

/** The building rug with a road on it, under the tower, the builder and the truck. */
function BuildingRug() {
  const back = depthScale(560);
  const front = depthScale(840);
  const mid = (back + front) / 2;
  return (
    <>
      <path d={floorQuad(-1400, -560, back, front)} fill="#b2f2bb" />
      <path d={floorQuad(-1360, -600, back + 0.01, front - 0.01)} fill="none" stroke="#8ce99a" strokeWidth="6" />
      {/* Road across the rug, with a dashed middle line */}
      <path d={floorQuad(-1400, -560, mid - 0.035, mid + 0.035)} fill="#868e96" />
      <path d={floorLine(-1400, -560, mid)} stroke="#fff" strokeWidth="5" strokeDasharray="22 18" />
      {/* A little pond and two trees painted on the rug */}
      <ellipse cx="60" cy={onFloor(0, back + 0.04)[1]} rx="42" ry="10" fill="#74c0fc" />
      {[
        [300, back + 0.025],
        [380, front - 0.02],
      ].map(([x, s]) => (
        <g key={x}>
          <ellipse cx={x} cy={onFloor(0, s)[1]} rx="22" ry="8" fill="#51cf66" />
          <ellipse cx={x - 4} cy={onFloor(0, s)[1] - 2} rx="10" ry="4" fill="#69db7c" />
        </g>
      ))}
    </>
  );
}

/** The bench under the coat hooks, with cubbies for the shoes. */
function Bench() {
  return (
    <>
      <rect x="210" y="272" width="330" height="58" fill="#c88b3a" />
      {[0, 1, 2, 3].map((k) => (
        <g key={k}>
          <rect x={218 + k * 80} y="288" width="74" height="40" rx="3" fill="#8f6544" />
          {/* A pair of small shoes in each cubby */}
          <ellipse cx={240 + k * 80} cy="320" rx="12" ry="7" fill={["#4dabf7", "#ff8787", "#69db7c", "#ffd43b"][k]} />
          <ellipse cx={266 + k * 80} cy="320" rx="12" ry="7" fill={["#4dabf7", "#ff8787", "#69db7c", "#ffd43b"][k]} />
        </g>
      ))}
      <rect x="206" y="266" width="338" height="14" rx="5" fill="#e9b872" />
    </>
  );
}

/** The giraffe growth chart between the cupboard and the sleeping corner's window. */
function Giraffe() {
  return (
    <>
      <rect x="1240" y="96" width="34" height="220" rx="10" fill="#ffd43b" />
      {[130, 176, 222, 268].map((y, i) => (
        <circle key={y} cx={1250 + (i % 2) * 14} cy={y} r="7" fill="#e67700" opacity="0.6" />
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <path key={i} d={`M1240 ${116 + i * 20} h${i % 2 ? 7 : 12}`} stroke="#c88b3a" strokeWidth="2.5" />
      ))}
      <ellipse cx="1257" cy="86" rx="22" ry="16" fill="#ffd43b" />
      <path d="M1248 72 V62 M1266 72 V62" stroke="#c88b3a" strokeWidth="3" strokeLinecap="round" />
      <circle cx="1250" cy="84" r="2.5" fill={INK} />
      <circle cx="1264" cy="84" r="2.5" fill={INK} />
      <ellipse cx="1257" cy="94" rx="9" ry="5" fill="#fab005" />
    </>
  );
}

export function Background() {
  return (
    <>
      <defs>
        <linearGradient id="ki-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff6d8" />
          <stop offset="1" stopColor="#fff0c2" />
        </linearGradient>
        <linearGradient id="ki-floor" gradientUnits="userSpaceOnUse" x1="0" y1={HORIZON} x2="0" y2="1000">
          <stop offset="0" stopColor="#f1d3a6" />
          <stop offset="1" stopColor="#f9e3c0" />
        </linearGradient>
        <linearGradient id="ki-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d6a978" stopOpacity="0.45" />
          <stop offset="1" stopColor="#d6a978" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Wall: dotted paint, a mint band below the rail, the skirting at the bottom */}
      <rect width="1600" height={HORIZON} fill="url(#ki-wall)" />
      <Dots />
      <rect y={RAIL} width="1600" height={HORIZON - RAIL} fill="#c3fae8" />
      <rect y={RAIL - 5} width="1600" height="9" rx="3" fill="#96f2d7" />
      <rect y={HORIZON - 14} width="1600" height="14" fill="#fff" />
      <path d={`M0 ${HORIZON - 14} H1600`} stroke="#e9ecef" strokeWidth="3" />

      <Bench />
      {/* Light switch next to the door */}
      <rect x="200" y="176" width="16" height="24" rx="4" fill="#fff" stroke="#dee2e6" strokeWidth="2" />
      <rect x="205" y="182" width="6" height="8" rx="2" fill="#ced4da" />
      <Giraffe />
      {/* Stickers right of the sleeping corner's window */}
      <path d="M1574 120 A16 16 0 1 0 1574 152 A12 12 0 1 1 1574 120 Z" fill="#91a7ff" />
      <path d="M1572 186 l4 9 h10 l-8 6 l3 10 l-9 -6 l-9 6 l3 -10 l-8 -6 h10 Z" fill="#ffd43b" />
      {/* A rainbow sticker between the coat hooks and the window */}
      <g fill="none" strokeWidth="6" strokeLinecap="round">
        <path d="M562 232 A22 22 0 0 1 606 232" stroke="#ff8787" />
        <path d="M569 232 A15 15 0 0 1 599 232" stroke="#ffd43b" />
        <path d="M576 232 A8 8 0 0 1 592 232" stroke="#74c0fc" />
      </g>

      {/* Floor */}
      <rect y={HORIZON} width="1600" height={1000 - HORIZON} fill="url(#ki-floor)" />
      <Planks />
      <rect y={HORIZON} width="1600" height="44" fill="url(#ki-haze)" />

      {/* The sleeping corner's soft carpet */}
      <path d={floorQuad(640, 2200, depthScale(388), depthScale(780))} fill="#d0ebff" />
      <path d={floorQuad(680, 2200, depthScale(398), depthScale(770))} fill="none" stroke="#a5d8ff" strokeWidth="5" strokeDasharray="14 12" />
      <BuildingRug />
      {/* The round reading rug */}
      <g transform={`translate(770 668) scale(${depthScale(668)})`}>
        <ellipse cx="0" cy="0" rx="250" ry="66" fill="#ffd8a8" />
        <ellipse cx="0" cy="0" rx="200" ry="50" fill="none" stroke="#fff" strokeWidth="8" strokeDasharray="6 16" strokeLinecap="round" />
        <ellipse cx="0" cy="0" rx="110" ry="26" fill="#ffc078" />
        <ellipse cx="0" cy="-3" rx="250" ry="66" fill="none" stroke="#ffa94d" strokeWidth="8" />
      </g>
    </>
  );
}
