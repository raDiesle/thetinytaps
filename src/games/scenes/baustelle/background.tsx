import { HORIZON, depthScale, towardsHorizon, transformOf } from "../layout";
import { DIGGER, FLOWERS, HAMMER, SITE } from "./layout";
import type { ReactNode } from "react";
import { Cloud, INK } from "../shared";

// The sky ends at the fence (HORIZON). Behind it lies the city in a light haze;
// in front of it the ground gets darker and pebbles, tufts and kerb joints get
// bigger towards the front, so the picture looks deep.

const FENCE_TOP = HORIZON - 28;

// Far-away city above the hills: [x, top, width].
const TOWERS = [
  [10, 196, 54],
  [72, 168, 44],
  [124, 214, 62],
  [204, 186, 40],
  [256, 226, 56],
  [1268, 214, 48],
  [1324, 180, 42],
  [1376, 224, 62],
  [1450, 194, 50],
  [1512, 232, 70],
];

// Pebbles: [x, y]; the closer, the bigger.
const PEBBLES = [
  [180, 352],
  [640, 350],
  [880, 362],
  [520, 420],
  [1240, 470],
  [140, 480],
  [760, 620],
  [1500, 640],
  [600, 900],
  [1290, 860],
  [870, 1000],
  [30, 900],
  [1040, 940],
  [1560, 980],
  [350, 820],
];

/** Grass tufts: [x, y]; they grow with depth like everything else. */
const TUFTS = [
  [340, 342],
  [760, 346],
  [1130, 360],
  [500, 520],
  [1280, 610],
  [130, 640],
  [10, 996],
  [330, 998],
  [530, 856],
  [1046, 996],
  [1010, 840],
  [1570, 860],
  [800, 996],
];

function Skyline() {
  return (
    <g>
      {TOWERS.map(([x, y, w]) => (
        <g key={x}>
          <rect x={x} y={y} width={w} height={FENCE_TOP + 10 - y} rx="3" fill="#d3def4" />
          <rect x={x + w - 8} y={y} width="8" height={FENCE_TOP + 10 - y} fill="#c3d1ec" />
          {Array.from({ length: Math.floor((FENCE_TOP - 20 - y) / 20) }, (_, row) => (
            <path
              key={row}
              d={`M${x + 8} ${y + 14 + row * 20} h${w / 2 - 12} M${x + w / 2 + 2} ${y + 14 + row * 20} h${w / 2 - 12}`}
              stroke="#e9f0fb"
              strokeWidth="6"
            />
          ))}
        </g>
      ))}
      {/* Another crane, far away in the city */}
      <g stroke="#b5c4e3" strokeWidth="4" fill="none">
        <path d="M1418 224 V120 M1350 124 H1500 M1418 120 L1360 124 M1418 120 L1490 124 M1480 124 V150" />
        <path d="M1412 220 L1424 200 L1412 180 L1424 160 L1412 140" strokeWidth="2" />
      </g>
      <rect x="1472" y="150" width="16" height="10" fill="#b5c4e3" />
    </g>
  );
}

function Tree({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-6" y="0" width="12" height="50" fill="#8d5a2b" />
      <circle cx="0" cy="-10" r="34" fill="#52b788" />
      <circle cx="-22" cy="6" r="22" fill="#40916c" />
      <circle cx="22" cy="4" r="24" fill="#40916c" />
      <circle cx="-10" cy="-22" r="12" fill="#74c69d" />
    </g>
  );
}

/** Mesh fence panels with orange feet along the back of the site, small because it is far away. */
function Fence() {
  return (
    <g>
      <defs>
        <pattern id="bs-mesh" width="7" height="7" patternUnits="userSpaceOnUse">
          <path d="M0 0 L7 7 M7 0 L0 7" stroke="#adb5bd" strokeWidth="1" />
        </pattern>
      </defs>
      {Array.from({ length: 34 }, (_, i) => (
        <g key={i}>
          <rect x={i * 48} y={FENCE_TOP} width="47" height="28" fill="url(#bs-mesh)" stroke="#adb5bd" strokeWidth="2" />
          <rect x={i * 48 - 4} y={HORIZON - 2} width="9" height="5" rx="1.5" fill="#ff8c42" />
        </g>
      ))}
      {/* A red-white barrier tape on the fence */}
      <path d={`M0 ${FENCE_TOP + 8} H1600`} stroke="#fff" strokeWidth="5" />
      <path d={`M0 ${FENCE_TOP + 8} H1600`} stroke="#e63946" strokeWidth="5" strokeDasharray="16 16" />
    </g>
  );
}

/** A red car that drives past behind the trucks now and then (only when the picture may move by itself). */
function Car() {
  return (
    <g transform="translate(0 151) scale(0.72)">
      <g className="bs-car">
        <path d="M-160 728 Q-150 708 -125 708 H-95 Q-75 708 -66 728 Z" fill="#ff5d73" />
        <path d="M-148 727 Q-140 714 -124 714 H-112 V727 Z M-106 727 V714 H-96 Q-82 714 -76 727 Z" fill="#bde0fe" />
        <rect x="-172" y="726" width="120" height="24" rx="10" fill="#ff5d73" />
        <rect x="-172" y="728" width="120" height="6" rx="3" fill="#ff8fa3" />
        <circle cx="-56" cy="736" r="4" fill="#ffd60a" />
        <circle cx="-150" cy="752" r="11" fill="#2b2d42" />
        <circle cx="-76" cy="752" r="11" fill="#2b2d42" />
        <circle cx="-150" cy="752" r="4" fill="#ced4da" />
        <circle cx="-76" cy="752" r="4" fill="#ced4da" />
      </g>
    </g>
  );
}

function Flowers() {
  return (
    <g transform={transformOf(FLOWERS)}>
      <ellipse cx="1548" cy="996" rx="52" ry="7" fill="#8d5a2b" opacity="0.5" />
      <path d="M1512 995 V950 M1548 995 V935 M1584 995 V955" stroke="#40916c" strokeWidth="5" />
      <path d="M1530 978 q10 -14 18 -4 M1566 984 q10 -14 18 -4" stroke="#40916c" strokeWidth="5" fill="none" />
      {[
        [1512, 946, "#ff7bd0"],
        [1548, 931, "#ffd60a"],
        [1584, 951, "#8e7dff"],
      ].map(([cx, cy, color]) => (
        <g key={cx}>
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={a} cx={cx} cy={Number(cy) - 10} r="7" fill={String(color)} transform={`rotate(${a} ${cx} ${cy})`} />
          ))}
          <circle cx={cx} cy={cy} r="6" fill="#fff4d6" />
        </g>
      ))}
    </g>
  );
}

/** Tyre tracks across the site, running towards the back like the rest of the ground. */
function Tracks() {
  const track = (x: number, from: number, to: number) => `M${x} ${from} L${towardsHorizon(x, from, to)} ${to}`;
  return (
    <g stroke="#dcaa68" strokeLinecap="round" fill="none" opacity="0.55">
      <path d={`${track(860, 646, 560)} ${track(930, 646, 560)}`} strokeWidth="10" strokeDasharray="6 8" />
      <path d={`${track(1260, 646, 470)} ${track(1320, 646, 470)}`} strokeWidth="8" strokeDasharray="5 7" />
    </g>
  );
}

/** Things lying around, drawn with their foot at (0, 0) and scaled for where they stand. */
function OnGround({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return <g transform={`translate(${x} ${y}) scale(${depthScale(y)})`}>{children}</g>;
}

/** A stack of planks on two beams. */
function Planks() {
  return (
    <>
      <ellipse cx="0" cy="0" rx="78" ry="8" fill={INK} opacity="0.12" />
      <rect x="-60" y="-12" width="14" height="12" fill="#8d5a2b" />
      <rect x="44" y="-12" width="14" height="12" fill="#8d5a2b" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={-74 + (i % 2) * 6} y={-24 - i * 12} width="146" height="12" rx="2" fill={i % 2 ? "#e9c46a" : "#ddb05a"} />
          <circle cx={-68 + (i % 2) * 6} cy={-18 - i * 12} r="3" fill="#c08f3e" />
        </g>
      ))}
    </>
  );
}

/** Cement sacks, one leaning on the others. */
function Sacks() {
  return (
    <>
      <ellipse cx="0" cy="0" rx="60" ry="7" fill={INK} opacity="0.12" />
      {[-34, 6].map((x) => (
        <g key={x}>
          <rect x={x - 20} y="-30" width="48" height="30" rx="10" fill="#e9ecef" />
          <rect x={x - 10} y="-22" width="28" height="12" rx="3" fill="#8d99ae" />
        </g>
      ))}
      <rect x="-26" y="-56" width="48" height="28" rx="10" fill="#f8f9fa" transform="rotate(-8 0 -42)" />
      <rect x="-16" y="-49" width="28" height="11" rx="3" fill="#e76f51" transform="rotate(-8 0 -42)" />
    </>
  );
}

const ROAD_TOP = 648;
const ROAD_BOTTOM = 768;
const PAVEMENT = 792;

export function Background() {
  return (
    <>
      <defs>
        <linearGradient id="bs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7cc8fb" />
          <stop offset="1" stopColor="#e3f4ff" />
        </linearGradient>
        <linearGradient id="bs-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8e6bf" />
          <stop offset="0.45" stopColor="#f2cc8f" />
          <stop offset="1" stopColor="#e2a85d" />
        </linearGradient>
        <linearGradient id="bs-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e3f4ff" stopOpacity="0" />
          <stop offset="1" stopColor="#e3f4ff" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="bs-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7d858c" />
          <stop offset="1" stopColor="#626a72" />
        </linearGradient>
        <radialGradient id="bs-sunglow">
          <stop offset="0" stopColor="#fff3b0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff3b0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height={HORIZON + 10} fill="url(#bs-sky)" />
      <circle cx="1470" cy="96" r="150" fill="url(#bs-sunglow)" />
      <Cloud x={1080} y={150} scale={0.42} className="bs-cloud" />
      <Cloud x={720} y={210} scale={0.3} className="bs-cloud bs-cloud-slow" />
      {/* Birds far away */}
      <path d="M560 150 q6 -6 12 0 q6 -6 12 0 M604 136 q5 -5 10 0 q5 -5 10 0" stroke="#5c677d" strokeWidth="2.5" fill="none" />
      <Skyline />
      <path d="M0 290 Q160 250 360 280 T760 268 T1180 272 T1600 268 V340 H0 Z" fill="#d8f3dc" />
      <rect y="230" width="1600" height="80" fill="url(#bs-haze)" />
      <path d="M0 306 Q200 270 420 300 T860 292 T1300 288 T1600 296 V340 H0 Z" fill="#b7e4c7" />
      <Tree x={600} y={292} scale={0.4} />
      <Tree x={636} y={296} scale={0.32} />
      <Tree x={1180} y={288} scale={0.36} />
      <Fence />
      <rect y={HORIZON} width="1600" height={1000 - HORIZON} fill="url(#bs-ground)" />

      {/* Trodden patches, tyre tracks and pebbles */}
      <g fill="#e0b070" opacity="0.55">
        <ellipse cx="760" cy="372" rx="60" ry="5" />
        <ellipse cx="1150" cy="520" rx="100" ry="9" />
        <ellipse cx="300" cy="630" rx="140" ry="11" />
        <ellipse cx="420" cy="940" rx="160" ry="18" />
        <ellipse cx="1150" cy="900" rx="120" ry="14" />
      </g>
      <Tracks />
      <g fill="#d4a373" opacity="0.7">
        {PEBBLES.map(([cx, cy]) => (
          <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx={7 * depthScale(cy)} ry={5 * depthScale(cy)} />
        ))}
      </g>

      {/* Dirt pile the digger is working on */}
      <g transform={transformOf(DIGGER)}>
        <ellipse cx="562" cy="714" rx="120" ry="12" fill={INK} opacity="0.1" />
        <path d="M455 714 Q560 600 670 714 Z" fill="#c68b59" />
        <path d="M500 700 Q560 630 620 700" stroke="#d9a066" strokeWidth="10" fill="none" opacity="0.7" />
        <g fill="#a86f45">
          <circle cx="520" cy="690" r="6" />
          <circle cx="575" cy="668" r="5" />
          <circle cx="610" cy="700" r="7" />
        </g>
      </g>

      <OnGround x={1214} y={522}>
        <Planks />
      </OnGround>
      <OnGround x={492} y={640}>
        <Sacks />
      </OnGround>

      {/* Pallet of bricks below the crane */}
      <g transform={transformOf(SITE)}>
        <ellipse cx="720" cy="655" rx="52" ry="7" fill={INK} opacity="0.14" />
        <rect x="676" y="644" width="88" height="10" rx="2" fill="#8d5a2b" />
        <g fill="#e76f51" stroke="#f4a261" strokeWidth="2">
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((col) => <rect key={`${row}-${col}`} x={680 + col * 27 + (row % 2) * 6} y={626 - row * 18} width="27" height="18" />),
          )}
        </g>
      </g>

      {/* Road with kerbs on both sides */}
      <rect y={ROAD_TOP} width="1600" height="10" fill="#ced4da" />
      <path d={Array.from({ length: 32 }, (_, i) => `M${i * 52} ${ROAD_TOP} v10`).join(" ")} stroke="#adb5bd" strokeWidth="1.5" />
      <rect y={ROAD_TOP + 10} width="1600" height={ROAD_BOTTOM - ROAD_TOP - 10} fill="url(#bs-road)" />
      <g fill="#5a6168">
        {Array.from({ length: 48 }, (_, i) => (
          <circle key={i} cx={(i * 97) % 1600} cy={ROAD_TOP + 16 + ((i * 37) % 96)} r={1.5 + ((i * 37) % 96) / 60} />
        ))}
      </g>
      <path d="M0 712 H1600" stroke="#fff" strokeWidth="5" strokeDasharray="44 36" />
      <Car />
      <ellipse cx="520" cy="742" rx="28" ry="7" fill="#495057" />
      <path d="M502 742 H538 M508 737 H532 M508 747 H532" stroke="#6c757d" strokeWidth="2" />
      <rect y={ROAD_BOTTOM} width="1600" height={PAVEMENT - ROAD_BOTTOM} fill="#dee2e6" />
      <rect y={ROAD_BOTTOM} width="1600" height="3" fill="#ced4da" />
      <path
        d={Array.from({ length: 28 }, (_, i) => `M${i * 60} ${ROAD_BOTTOM} L${towardsHorizon(i * 60, ROAD_BOTTOM, PAVEMENT)} ${PAVEMENT}`).join(" ")}
        stroke="#adb5bd"
        strokeWidth="2"
      />
      <rect y={PAVEMENT} width="1600" height="6" fill="#c9a36a" opacity="0.5" />

      {/* The hole the jackhammer is making */}
      <g transform={transformOf(HAMMER)}>
        <ellipse cx="1228" cy="997" rx="40" ry="10" fill="#8d5a2b" />
        <ellipse cx="1228" cy="999" rx="28" ry="6" fill="#6b4423" />
        <path d="M1190 1001 l-14 6 M1266 999 l16 5 M1214 1005 l-6 10" stroke="#8d5a2b" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Grass tufts and flowers */}
      <g stroke="#52b788" strokeWidth="5" strokeLinecap="round" fill="none">
        {TUFTS.map(([x, y]) => (
          <path key={`${x}-${y}`} d="M0 0 q4 -24 12 -30 M10 0 q0 -26 -6 -36 M20 0 q2 -20 12 -26" transform={`translate(${x} ${y}) scale(${depthScale(y)})`} />
        ))}
      </g>
      <Flowers />
    </>
  );
}
