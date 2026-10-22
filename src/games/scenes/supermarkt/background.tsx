import type { ReactElement } from "react";
import { HORIZON, depthScale, transformOf, onFloor } from "../layout";
import { INK, STEEL } from "../shared";
import { GONDOLA, STAND } from "./layout";

// The back wall: a ceiling strip with lamps, a fruit border, tiles behind the bakery, the cheese
// and the fish counter, and a skirting at the bottom. The floor has big pale tiles that get smaller
// towards the wall. The two shelf aisles run from the wall towards us; their end caps (with the
// müsli, pasta, juice and sweets) face us. The counters' bodies, the fish tank and the wooden
// fruit stand are drawn here; what is on them can be tapped.

/** Floor tiles: how far each row of tiles is from the eye (bigger is further back). */
const FOCAL = 820;
const TILE = 140;
const ROWS = Array.from({ length: 9 }, (_, k) => FOCAL / 0.45 - k * TILE);
const COLUMNS = Array.from({ length: 27 }, (_, k) => (k - 13) * TILE);

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
  return <g fill="#e3e7ea">{cells}</g>;
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
  return <path d={[...lines, ...columns].join(" ")} stroke="#fff" strokeWidth="2" opacity="0.7" />;
}

const PRODUCT_COLOURS = ["#ff6b6b", "#ffd43b", "#4dabf7", "#69db7c", "#ff922b", "#da77f2", "#f8f9fa", "#38d9a9"];

/** A shelf aisle running from the wall towards us; `side` -1 is the left one, 1 the right one. */
function Gondola({ side }: { side: -1 | 1 }) {
  const { inner, outer, front, height } = GONDOLA;
  const back = 0.45;
  const at = (worldX: number, s: number, up = 0): [number, number] => {
    const [x, y] = onFloor(side * worldX, s);
    return [x, y - height * s * up];
  };
  const poly = (points: [number, number][]) => `M${points.map(([x, y]) => `${x} ${y}`).join(" L")} Z`;
  // The side facing the aisle, with rows of colourful packs going back.
  const shelves = [0.06, 0.37, 0.68];
  const steps = 9;
  const packs: ReactElement[] = [];
  shelves.forEach((f0, row) => {
    for (let j = 0; j < steps; j++) {
      const sa = front - ((front - back) * j) / steps - 0.002;
      const sb = front - ((front - back) * (j + 1)) / steps + 0.002;
      const fh = 0.22 + ((j + row) % 3) * 0.03;
      packs.push(
        <path
          key={`${row}-${j}`}
          d={poly([at(inner, sa, f0), at(inner, sb, f0), at(inner, sb, f0 + fh), at(inner, sa, f0 + fh)])}
          fill={PRODUCT_COLOURS[(j * 3 + row * 5 + (side > 0 ? 2 : 0)) % PRODUCT_COLOURS.length]}
        />,
      );
    }
  });
  const boards = [0.04, 0.35, 0.66, 0.97].map((f) => {
    const [x1, y1] = at(inner, front, f);
    const [x2, y2] = at(inner, back, f);
    return `M${x1} ${y1} L${x2} ${y2}`;
  });
  const [fx1, fBottom] = at(outer, front);
  const [fx2] = at(inner, front);
  const left = Math.min(fx1, fx2);
  const width = Math.abs(fx2 - fx1);
  const top = fBottom - height * front;
  return (
    <g>
      {/* Shadow on the floor */}
      <path d={poly([at(outer, front), at(inner, front), at(inner, back), at(outer, back)])} fill="#adb5bd" opacity="0.35" transform="translate(0 6)" />
      {/* Top */}
      <path d={poly([at(outer, front, 1), at(inner, front, 1), at(inner, back, 1), at(outer, back, 1)])} fill="#ced4da" stroke="#adb5bd" strokeWidth="3" strokeLinejoin="round" />
      {/* Boxes waiting on top */}
      {[0.56, 0.5].map((s, i) => {
        const [x, y] = at((inner + outer) / 2 + (i ? 30 : -20), s, 1);
        const w = 70 * s;
        return (
          <g key={s}>
            <rect x={x - w / 2} y={y - w * 0.7} width={w} height={w * 0.7} fill="#d4a373" />
            <path d={`M${x - w / 2} ${y - w * 0.45} H${x + w / 2}`} stroke="#bc8a5f" strokeWidth="3" />
          </g>
        );
      })}
      {/* Side facing the aisle */}
      <path d={poly([at(inner, front), at(inner, back), at(inner, back, 1), at(inner, front, 1)])} fill="#dee2e6" />
      {packs}
      <path d={boards.join(" ")} stroke="#f8f9fa" strokeWidth="5" strokeLinecap="round" />
      <path d={poly([at(inner, front), at(inner, back), at(inner, back, 0.04), at(inner, front, 0.04)])} fill="#868e96" />
      {/* Front: the end cap with two shelves */}
      <rect x={left} y={top} width={width} height={fBottom - top} fill="#f8f9fa" />
      <rect x={left} y={top} width={width} height="8" fill={side < 0 ? "#ff922b" : "#40c057"} />
      <rect x={left + 4} y={top + 62} width={width - 8} height="7" rx="2" fill="#ced4da" />
      <rect x={left + 4} y={fBottom - 10} width={width - 8} height="10" fill="#868e96" />
      {[top + 62, fBottom - 10].map((y) => (
        <g key={y} fill="#ffe066">
          <rect x={left + 16} y={y + 1} width="14" height="6" rx="1" />
          <rect x={left + width - 34} y={y + 1} width="14" height="6" rx="1" />
        </g>
      ))}
      <path d={`M${left} ${top} V${fBottom} M${left + width} ${top} V${fBottom}`} stroke="#ced4da" strokeWidth="4" />
    </g>
  );
}

/** Hanging sign over an aisle with its number. */
function AisleSign({ x, y, n, colour }: { x: number; y: number; n: number; colour: string }) {
  return (
    <g>
      <path d={`M${x - 16} 26 V${y - 16} M${x + 16} 26 V${y - 16}`} stroke={STEEL} strokeWidth="2" />
      <rect x={x - 26} y={y - 18} width="52" height="38" rx="8" fill={colour} />
      <circle cx={x} cy={y + 1} r="13" fill="#fff" />
      <text x={x} y={y + 7} textAnchor="middle" fontSize="18" fontWeight="bold" fill={colour} fontFamily="sans-serif">
        {n}
      </text>
    </g>
  );
}

/** Round counter sign hanging from the ceiling with a little picture. */
function CounterSign({ x, y, colour, children }: { x: number; y: number; colour: string; children: ReactElement }) {
  return (
    <g>
      <path d={`M${x - 12} 26 L${x - 8} ${y - 26} M${x + 12} 26 L${x + 8} ${y - 26}`} stroke={STEEL} strokeWidth="2" />
      <circle cx={x} cy={y} r="28" fill={colour} />
      <circle cx={x} cy={y} r="22" fill="#fff" />
      {children}
    </g>
  );
}

/** The fish counter: crushed ice with lemons and shells, and the aquarium on top. */
function FishCounter() {
  return (
    <g>
      {/* Aquarium */}
      <rect x="826" y="150" width="168" height="92" rx="6" fill="#4dabf7" />
      <rect x="830" y="158" width="160" height="80" rx="4" fill="#a5d8ff" />
      <path d="M830 168 q10 -5 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" stroke="#fff" strokeWidth="3" fill="none" opacity="0.7" />
      <path d="M830 238 V226 Q860 216 890 224 Q930 214 990 224 V238 Z" fill="#ffe8a3" />
      {[846, 860, 978].map((x, i) => (
        <path key={x} d={`M${x} 228 q-8 -16 0 -30 q8 -14 0 -26`} stroke="#40c057" strokeWidth={6 - i} strokeLinecap="round" fill="none" />
      ))}
      <circle cx="900" cy="228" r="5" fill="#ffa8a8" />
      <circle cx="912" cy="231" r="3.5" fill="#fff" />
      <rect x="822" y="146" width="176" height="10" rx="4" fill="#1c7ed6" />
      {/* Counter */}
      <rect x="805" y="242" width="195" height="88" fill="#e7f5ff" />
      <path d="M810 252 H995 V286 H810 Z" fill="#fff" />
      {[828, 852, 878, 904, 930, 956, 980].map((x, i) => (
        <circle key={x} cx={x} cy={276 - (i % 2) * 4} r={i % 3 ? 7 : 9} fill={i % 2 ? "#ffe066" : "#e9ecef"} />
      ))}
      {[842, 920, 966].map((x) => (
        <path key={x} d={`M${x - 8} 272 Q${x} 258 ${x + 8} 272 Z`} fill="#ffc9c9" />
      ))}
      <rect x="805" y="286" width="195" height="44" fill="#74c0fc" />
      <path d="M805 300 q12 -8 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0" stroke="#fff" strokeWidth="4" fill="none" opacity="0.8" />
      <rect x="800" y="238" width="205" height="8" rx="3" fill="#dee2e6" />
    </g>
  );
}

/** The cheese counter's body, with cheese wedges behind the glass. */
function CheeseCounter() {
  return (
    <g>
      <rect x="600" y="242" width="195" height="88" fill="#fff9db" />
      <path d="M606 252 H789 V290 H606 Z" fill="#fff" opacity="0.8" />
      {[620, 668, 716, 760].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 286 L${x + 34} 286 L${x + 34} 266 Z`} fill={i % 2 ? "#ffd43b" : "#fcc419"} />
          <circle cx={x + 26} cy="279" r="3" fill="#fab005" />
        </g>
      ))}
      <rect x="600" y="290" width="195" height="40" fill="#ffd43b" />
      <path d="M612 304 H783" stroke="#fff" strokeWidth="5" strokeDasharray="12 10" strokeLinecap="round" opacity="0.7" />
      <rect x="595" y="238" width="205" height="8" rx="3" fill="#dee2e6" />
    </g>
  );
}

/** The bakery: a wooden wall shelf with loaves behind the counter. */
function BakeryShelf() {
  return (
    <g>
      <rect x="232" y="118" width="178" height="130" fill="#f3d9b1" />
      {[150, 202].map((y) => (
        <g key={y}>
          <rect x="232" y={y} width="178" height="9" fill="#b07d48" />
          {[252, 296, 340, 384].map((x, i) => (
            <g key={x}>
              <ellipse cx={x} cy={y - 11} rx={i % 2 ? 18 : 20} ry="12" fill={i % 2 ? "#c8814a" : "#e0a060"} />
              <path d={`M${x - 9} ${y - 16} l5 8 M${x - 1} ${y - 18} l5 8 M${x + 7} ${y - 16} l5 8`} stroke="#f3d9b1" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          ))}
        </g>
      ))}
      <rect x="228" y="112" width="186" height="10" rx="3" fill="#b07d48" />
    </g>
  );
}

/** The wooden fruit stand, in STAND coordinates. */
function FruitStand() {
  return (
    <g transform={transformOf(STAND)}>
      <rect x="-240" y="-290" width="480" height="140" fill="#b07d48" />
      <path d="M-240 -255 H240 M-240 -220 H240 M-240 -185 H240" stroke="#9c6b3c" strokeWidth="4" />
      <rect x="-256" y="-300" width="22" height="300" rx="6" fill="#8d5a2b" />
      <rect x="234" y="-300" width="22" height="300" rx="6" fill="#8d5a2b" />
      <rect x="-250" y="-164" width="500" height="18" rx="4" fill="#c8814a" />
      <rect x="-250" y="-46" width="500" height="20" rx="4" fill="#c8814a" />
      <rect x="-244" y="-28" width="488" height="22" fill="#9c6b3c" />
      {/* Sign on top: an apple and a carrot */}
      <rect x="-70" y="-338" width="140" height="48" rx="10" fill="#2b8a3e" stroke="#e9ecef" strokeWidth="5" />
      <circle cx="-26" cy="-312" r="14" fill="#ff6b6b" />
      <path d="M-26 -326 q4 -8 10 -8" stroke="#69db7c" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M16 -324 L44 -300 L10 -312 Z" fill="#ff922b" />
      <path d="M14 -324 l-6 -8 M16 -324 l2 -10" stroke="#69db7c" strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

export function Background() {
  return (
    <>
      <defs>
        <linearGradient id="sm-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8f4ec" />
          <stop offset="1" stopColor="#efe8da" />
        </linearGradient>
        <linearGradient id="sm-floor" gradientUnits="userSpaceOnUse" x1="0" y1={HORIZON} x2="0" y2="1000">
          <stop offset="0" stopColor="#eceff1" />
          <stop offset="1" stopColor="#f6f7f8" />
        </linearGradient>
        <linearGradient id="sm-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9ecef" stopOpacity="0.85" />
          <stop offset="1" stopColor="#e9ecef" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Wall */}
      <rect width="1600" height={HORIZON} fill="url(#sm-wall)" />
      {/* A green band with fruit along the top */}
      <rect y="26" width="1600" height="12" fill="#69db7c" />
      {Array.from({ length: 20 }, (_, i) => (
        <circle key={i} cx={40 + i * 80} cy="32" r="5" fill={["#ff6b6b", "#ffd43b", "#ff922b", "#fff"][i % 4]} />
      ))}
      {/* Tiles behind the cheese and the fish counter */}
      <rect x="596" y="118" width="204" height="124" fill="#fff3bf" />
      <rect x="800" y="118" width="204" height="124" fill="#d0ebff" />
      <path
        d={[...Array.from({ length: 5 }, (_, i) => `M596 ${118 + i * 31} H1004`), ...Array.from({ length: 14 }, (_, i) => `M${596 + i * 31.4} 118 V242`)].join(" ")}
        stroke="#fff"
        strokeWidth="2"
        opacity="0.8"
      />
      <BakeryShelf />
      {/* Ceiling with lamps */}
      <rect width="1600" height="26" fill="#ced4da" />
      {[120, 440, 760, 1080, 1400].map((x) => (
        <g key={x}>
          <rect x={x} y="14" width="120" height="12" rx="4" fill="#fff" />
          <rect x={x + 8} y="24" width="104" height="4" rx="2" fill="#fff9db" />
        </g>
      ))}

      {/* Window next to the entrance: outside the sun shines on the pavement */}
      <rect x="2" y="114" width="96" height="216" fill="#dee2e6" />
      <rect x="8" y="120" width="84" height="202" fill="#a5d8ff" />
      <circle cx="70" cy="150" r="14" fill="#ffe066" />
      <circle cx="26" cy="232" r="30" fill="#69db7c" />
      <circle cx="66" cy="240" r="26" fill="#51cf66" />
      <rect x="8" y="258" width="84" height="64" fill="#ced4da" />
      <path d="M8 280 H92 M8 302 H92 M36 258 V322 M66 258 V322" stroke="#adb5bd" strokeWidth="2" />

      {/* Counter signs and aisle signs */}
      <CounterSign x={697} y={110} colour="#fab005">
        <g>
          <path d="M680 120 L714 120 L714 100 Z" fill="#ffd43b" />
          <circle cx="706" cy="112" r="3" fill="#fab005" />
          <circle cx="698" cy="116" r="2" fill="#fab005" />
        </g>
      </CounterSign>
      <CounterSign x={903} y={110} colour="#1c7ed6">
        <g>
          <ellipse cx="900" cy="110" rx="13" ry="8" fill="#4dabf7" />
          <path d="M912 110 L922 102 V118 Z" fill="#4dabf7" />
          <circle cx="894" cy="108" r="2" fill={INK} />
        </g>
      </CounterSign>
      <AisleSign x={540} y={118} n={1} colour="#ff922b" />
      <AisleSign x={1060} y={118} n={2} colour="#40c057" />

      <CheeseCounter />
      <FishCounter />

      {/* Skirting */}
      <rect y={HORIZON - 8} width="1600" height="8" fill="#ced4da" />

      {/* Floor */}
      <rect y={HORIZON} width="1600" height={1000 - HORIZON} fill="url(#sm-floor)" />
      <FloorTiles />
      <FloorJoints />
      <rect y={HORIZON} width="1600" height="50" fill="url(#sm-haze)" />

      {/* Doormat at the entrance */}
      <g transform={`translate(164 ${HORIZON + 14}) scale(${depthScale(HORIZON + 14)})`}>
        <rect x="-150" y="-22" width="300" height="44" rx="10" fill="#868e96" />
        <rect x="-136" y="-14" width="272" height="28" rx="6" fill="none" stroke="#adb5bd" strokeWidth="4" strokeDasharray="8 8" />
      </g>

      <Gondola side={-1} />
      <Gondola side={1} />
      <FruitStand />
    </>
  );
}
