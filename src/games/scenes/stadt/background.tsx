import { HORIZON, depthScale, towardsHorizon } from "../layout";
import { Cloud, INK } from "../shared";
import { HOUSES, PARK_X, PAVEMENT, ROAD_BOTTOM, ROAD_TOP, ZEBRA } from "./layout";

// Far away the city fades into the haze; then a row of light houses behind the
// tappable ones, the pavement and the park, the road with a zebra crossing and
// the front pavement. Tiles, kerb joints and tufts grow towards the front.

// Far-away towers: [x, top, width].
const TOWERS = [
  [0, 210, 60],
  [70, 180, 44],
  [128, 226, 70],
  [520, 196, 52],
  [590, 232, 60],
  [880, 214, 46],
  [1120, 190, 54],
  [1190, 224, 64],
  [1380, 200, 48],
  [1450, 236, 70],
  [1540, 206, 52],
];

// Houses right behind the tappable ones, lighter because they are further back: [x, width, height, colour].
const BACK_ROW = [
  [-20, 110, 150, "#e8dff5"],
  [196, 110, 170, "#fde2e4"],
  [480, 90, 150, "#dfe7fd"],
  [740, 100, 190, "#fff1e6"],
  [1020, 80, 160, "#e2ece9"],
];

const TUFTS = [
  [1110, 450],
  [1330, 470],
  [1580, 500],
  [1220, 600],
  [10, 990],
  [452, 800],
  [700, 996],
  [1250, 990],
  [1590, 870],
];

function Skyline() {
  return (
    <g>
      {TOWERS.map(([x, y, w]) => (
        <g key={x}>
          <rect x={x} y={y} width={w} height={HORIZON + 20 - y} rx="3" fill="#d3def4" />
          <rect x={x + w - 8} y={y} width="8" height={HORIZON + 20 - y} fill="#c3d1ec" />
          {Array.from({ length: Math.floor((HORIZON - 10 - y) / 22) }, (_, row) => (
            <path
              key={row}
              d={`M${x + 8} ${y + 14 + row * 22} h${w / 2 - 12} M${x + w / 2 + 2} ${y + 14 + row * 22} h${w / 2 - 12}`}
              stroke="#e9f0fb"
              strokeWidth="6"
            />
          ))}
        </g>
      ))}
      {/* TV tower */}
      <path d="M1300 340 L1306 120 H1314 L1320 340 Z" fill="#c3d1ec" />
      <circle cx="1310" cy="140" r="22" fill="#c3d1ec" />
      <rect x="1296" y="150" width="28" height="8" rx="3" fill="#b5c4e3" />
      <path d="M1310 118 V60" stroke="#c3d1ec" strokeWidth="5" />
    </g>
  );
}

/** Light houses behind the tappable ones, so no sky shows between them. */
function BackRow() {
  return (
    <g>
      {BACK_ROW.map(([x, w, h, color]) => (
        <g key={x}>
          <rect x={x} y={HOUSES - Number(h)} width={w} height={h} fill={String(color)} />
          <path
            d={`M${Number(x) - 6} ${HOUSES - Number(h)} L${Number(x) + Number(w) / 2} ${HOUSES - Number(h) - 40} L${Number(x) + Number(w) + 6} ${HOUSES - Number(h)} Z`}
            fill="#d6ccd8"
          />
          {[0, 1, 2].map((row) => (
            <g key={row} fill="#eef3fb">
              <rect x={Number(x) + 16} y={HOUSES - Number(h) + 20 + row * 44} width="22" height="26" rx="3" />
              <rect x={Number(x) + Number(w) - 38} y={HOUSES - Number(h) + 20 + row * 44} width="22" height="26" rx="3" />
            </g>
          ))}
        </g>
      ))}
    </g>
  );
}

function ParkTree({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-6" y="-50" width="12" height="50" fill="#8d5a2b" />
      <circle cx="0" cy="-60" r="34" fill="#52b788" />
      <circle cx="-22" cy="-44" r="22" fill="#40916c" />
      <circle cx="22" cy="-46" r="24" fill="#40916c" />
      <circle cx="-10" cy="-72" r="12" fill="#74c69d" />
    </g>
  );
}

/** Tiles on a pavement between y1 and y2: rows get taller, joints run towards the back. */
function Tiles({ x1, x2, y1, y2, stroke }: { x1: number; x2: number; y1: number; y2: number; stroke: string }) {
  const rows: string[] = [];
  for (let y = y1 + 10 * depthScale(y1); y < y2; y += 26 * depthScale(y)) rows.push(`M${x1} ${y} H${x2}`);
  const joints = Array.from({ length: Math.ceil((x2 - x1) / 70) + 1 }, (_, i) => {
    const x = x1 + i * 70;
    return `M${x} ${y2} L${towardsHorizon(x, y2, y1)} ${y1}`;
  });
  return <path d={[...rows, ...joints].join(" ")} stroke={stroke} strokeWidth="2" />;
}

/** The stripes of the zebra crossing: bars across the road, taller towards the front. */
function Zebra() {
  const [left, right] = ZEBRA;
  const bars: string[] = [];
  for (let y = ROAD_TOP + 14; y < ROAD_BOTTOM - 10; ) {
    const h = 15 * depthScale(y);
    const l1 = towardsHorizon(left, ROAD_BOTTOM, y);
    const r1 = towardsHorizon(right, ROAD_BOTTOM, y);
    const l2 = towardsHorizon(left, ROAD_BOTTOM, y + h);
    const r2 = towardsHorizon(right, ROAD_BOTTOM, y + h);
    bars.push(`M${l1} ${y} H${r1} L${r2} ${y + h} H${l2} Z`);
    y += 2 * h;
  }
  return <path d={bars.join(" ")} fill="#f8f9fa" opacity="0.92" />;
}

/** A car that drives past in the far lane now and then (only when the picture may move by itself). */
function Car() {
  return (
    <g transform="translate(1800 640) scale(0.5)">
      <g className="st-car">
        <path d="M-60 -60 Q-50 -90 -20 -92 H30 Q60 -90 70 -60 Z" fill="#8e7dff" />
        <path d="M-46 -62 Q-38 -84 -20 -84 H0 V-62 Z M8 -62 V-84 H28 Q48 -84 56 -62 Z" fill="#bde0fe" />
        <rect x="-90" y="-66" width="180" height="44" rx="16" fill="#8e7dff" />
        <circle cx="-50" cy="-22" r="20" fill="#2b2d42" />
        <circle cx="50" cy="-22" r="20" fill="#2b2d42" />
        <circle cx="-50" cy="-22" r="8" fill="#ced4da" />
        <circle cx="50" cy="-22" r="8" fill="#ced4da" />
      </g>
    </g>
  );
}

export function Background() {
  return (
    <>
      <defs>
        <linearGradient id="st-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7cc8fb" />
          <stop offset="1" stopColor="#e3f4ff" />
        </linearGradient>
        <linearGradient id="st-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e3f4ff" stopOpacity="0" />
          <stop offset="1" stopColor="#e3f4ff" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="st-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c7ebd0" />
          <stop offset="1" stopColor="#8fd19e" />
        </linearGradient>
        <linearGradient id="st-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#868e96" />
          <stop offset="1" stopColor="#626a72" />
        </linearGradient>
        <linearGradient id="st-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9ecef" />
          <stop offset="1" stopColor="#d6dade" />
        </linearGradient>
        <radialGradient id="st-sunglow">
          <stop offset="0" stopColor="#fff3b0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff3b0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height={HORIZON + 20} fill="url(#st-sky)" />
      <circle cx="1520" cy="88" r="140" fill="url(#st-sunglow)" />
      <Cloud x={300} y={210} scale={0.3} className="st-cloud st-cloud-slow" />
      <Cloud x={1160} y={170} scale={0.4} className="st-cloud" />
      <path d="M760 170 q6 -6 12 0 q6 -6 12 0 M800 156 q5 -5 10 0 q5 -5 10 0" stroke="#5c677d" strokeWidth="2.5" fill="none" />
      <Skyline />
      <rect y="230" width="1600" height="120" fill="url(#st-haze)" />

      {/* Park: grass from the horizon down to the kerb, trees and a hedge far back */}
      <rect x={PARK_X} y={HORIZON} width={1600 - PARK_X} height={ROAD_TOP - HORIZON} fill="url(#st-grass)" />
      <ParkTree x={1130} y={352} scale={0.42} />
      <ParkTree x={1250} y={346} scale={0.36} />
      <ParkTree x={1560} y={350} scale={0.44} />
      <path d={`M${PARK_X} 376 Q1200 356 1320 372 T1600 368 V392 H${PARK_X} Z`} fill="#74c69d" />
      <path d={`M${PARK_X} 590 Q1160 520 1260 500 T1600 470 V520 Q1420 540 1300 560 T${PARK_X + 120} 590 Z`} fill="#f4e1b8" />
      <ellipse cx="1180" cy="474" rx="90" ry="12" fill="#f4d58d" />

      {/* Back pavement in front of the houses */}
      <BackRow />
      <rect y={HOUSES} width={PARK_X} height={ROAD_TOP - HOUSES} fill="#e9ecef" />
      <rect y={HOUSES} width={PARK_X} height="5" fill="#ced4da" />
      <Tiles x1={0} x2={PARK_X} y1={HOUSES} y2={ROAD_TOP} stroke="#dee2e6" />

      {/* Road with kerbs, centre line and the zebra crossing */}
      <rect y={ROAD_TOP} width="1600" height="10" fill="#ced4da" />
      <path d={Array.from({ length: 32 }, (_, i) => `M${i * 52} ${ROAD_TOP} v10`).join(" ")} stroke="#adb5bd" strokeWidth="1.5" />
      <rect y={ROAD_TOP + 10} width="1600" height={ROAD_BOTTOM - ROAD_TOP - 10} fill="url(#st-road)" />
      <g fill="#5a6168">
        {Array.from({ length: 48 }, (_, i) => (
          <circle key={i} cx={(i * 97) % 1600} cy={ROAD_TOP + 18 + ((i * 37) % 150)} r={1.5 + ((i * 37) % 150) / 80} />
        ))}
      </g>
      <path d="M0 682 H1600" stroke="#fff" strokeWidth="5" strokeDasharray="44 36" />
      <Zebra />
      <Car />
      <ellipse cx="380" cy="752" rx="30" ry="7" fill="#495057" />
      <path d="M360 752 H400 M366 747 H394 M366 757 H394" stroke="#6c757d" strokeWidth="2" />
      <rect y={ROAD_BOTTOM} width="1600" height={PAVEMENT - ROAD_BOTTOM} fill="#dee2e6" />
      <rect y={ROAD_BOTTOM} width="1600" height="3" fill="#ced4da" />
      <path
        d={Array.from({ length: 28 }, (_, i) => `M${i * 60} ${ROAD_BOTTOM} L${towardsHorizon(i * 60, ROAD_BOTTOM, PAVEMENT)} ${PAVEMENT}`).join(" ")}
        stroke="#adb5bd"
        strokeWidth="2"
      />

      {/* Front pavement */}
      <rect y={PAVEMENT} width="1600" height={1000 - PAVEMENT} fill="url(#st-front)" />
      <Tiles x1={-200} x2={1800} y1={PAVEMENT} y2={1000} stroke="#ced4da" />
      {/* A tree pit with a little bush, and bollards by the crossing */}
      <g transform={`translate(1380 872) scale(${depthScale(872)})`}>
        <ellipse cx="0" cy="0" rx="70" ry="14" fill="#a98467" />
        <circle cx="-26" cy="-26" r="28" fill="#40916c" />
        <circle cx="22" cy="-30" r="32" fill="#52b788" />
        <circle cx="0" cy="-50" r="26" fill="#74c69d" />
      </g>
      {[640, 920].map((x) => (
        <g key={x} transform={`translate(${x} 806) scale(${depthScale(806)})`}>
          <ellipse cx="0" cy="0" rx="12" ry="4" fill={INK} opacity="0.15" />
          <rect x="-8" y="-50" width="16" height="50" rx="6" fill="#495057" />
          <rect x="-8" y="-40" width="16" height="7" fill="#f8f9fa" />
        </g>
      ))}

      {/* Grass tufts */}
      <g stroke="#52b788" strokeWidth="5" strokeLinecap="round" fill="none">
        {TUFTS.map(([x, y]) => (
          <path key={`${x}-${y}`} d="M0 0 q4 -24 12 -30 M10 0 q0 -26 -6 -36 M20 0 q2 -20 12 -26" transform={`translate(${x} ${y}) scale(${depthScale(y)})`} />
        ))}
      </g>
    </>
  );
}
