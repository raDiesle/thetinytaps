import { HORIZON, depthScale, towardsHorizon } from "../layout";
import { Cloud, INK } from "../shared";
import { FENCE, FORECOURT_X, PLATFORM_BOTTOM, PLATFORM_TOP, RUNWAY_BOTTOM, RUNWAY_TOP, TRACK } from "./layout";

// Far away the terminal and a few parked planes in the haze; then the airfield with the
// runway, the railway fence, the track on its gravel bed, the platform; at the front the
// concrete apron on the left and the forecourt road with its pavement on the right.
// Joints, sleepers and tufts grow towards the front.

/** Where the road of the forecourt begins and ends, and the pavement in front of it. */
const ROAD_TOP = 690;
const ROAD_BOTTOM = 884;
/** The kerb between the apron and the forecourt, from the railing down to the bottom edge. */
const KERB_BOTTOM_X = towardsHorizon(FORECOURT_X, PLATFORM_BOTTOM, 1000);
const kerbAt = (y: number) => towardsHorizon(FORECOURT_X, PLATFORM_BOTTOM, y);

const TUFTS = [
  [40, 360],
  [700, 440],
  [1000, 470],
  [1300, 490],
  [1560, 452],
  [260, 470],
  [520, 500],
];

/** Far-away planes parked at the terminal: just their tails show above the haze. [x, colour] */
const FAR_TAILS = [
  [330, "#ffadad"],
  [430, "#a0c4ff"],
  [560, "#caffbf"],
];

function Terminal() {
  return (
    <g>
      <rect x="150" y="296" width="520" height="44" rx="4" fill="#dfe7f3" />
      <rect x="150" y="290" width="520" height="10" rx="4" fill="#c9d6ea" />
      <path d={Array.from({ length: 25 }, (_, i) => `M${166 + i * 20} 306 v24`).join(" ")} stroke="#b8cbe6" strokeWidth="10" />
      <path d="M380 290 Q410 262 440 290 Z" fill="#c9d6ea" />
      {FAR_TAILS.map(([x, colour]) => (
        <g key={x}>
          <path d={`M${x} 336 L${Number(x) - 6} 304 H${Number(x) + 6} L${Number(x) + 20} 336 Z`} fill={String(colour)} />
          <rect x={Number(x) - 30} y="328" width="70" height="10" rx="5" fill="#eef3fb" />
        </g>
      ))}
      <rect x="1180" y="306" width="30" height="34" fill="#dfe7f3" />
      <rect x="1220" y="296" width="44" height="44" fill="#e7ecf5" />
    </g>
  );
}

function FarTree({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-6" y="-50" width="12" height="50" fill="#9c6b3c" />
      <circle cx="0" cy="-64" r="32" fill="#74c69d" />
      <circle cx="-20" cy="-48" r="20" fill="#52b788" />
      <circle cx="20" cy="-50" r="22" fill="#52b788" />
    </g>
  );
}

/** The runway: asphalt with edge lines, threshold stripes and the dashed centre line. */
function Runway() {
  const mid = (RUNWAY_TOP + RUNWAY_BOTTOM) / 2;
  return (
    <g>
      <rect y={RUNWAY_TOP} width="1600" height={RUNWAY_BOTTOM - RUNWAY_TOP} fill="#9aa3ad" />
      <path d={`M0 ${RUNWAY_TOP + 2} H1600 M0 ${RUNWAY_BOTTOM - 2} H1600`} stroke="#f1f3f5" strokeWidth="2.5" />
      <path d={`M120 ${mid} H1600`} stroke="#fff" strokeWidth="3" strokeDasharray="34 26" />
      <path d={Array.from({ length: 6 }, (_, i) => `M${20 + i * 14} ${RUNWAY_TOP + 6} v${RUNWAY_BOTTOM - RUNWAY_TOP - 12}`).join(" ")} stroke="#fff" strokeWidth="6" />
      {/* A taxiway joins the runway from the hangar */}
      <path d={`M1380 ${RUNWAY_BOTTOM} L1350 444 H1460 L1440 ${RUNWAY_BOTTOM} Z`} fill="#a9b1ba" />
      <path d={`M1410 ${RUNWAY_BOTTOM} L1404 444`} stroke="#ffd60a" strokeWidth="2.5" />
    </g>
  );
}

/** The wire fence between the airfield and the railway. */
function Fence() {
  const h = 34 * depthScale(FENCE);
  return (
    <g>
      <rect y={FENCE - h} width="1600" height={h} fill="#e9ecef" opacity="0.35" />
      <path d={`M0 ${FENCE - h} H1600 M0 ${FENCE - h / 2} H1600`} stroke="#adb5bd" strokeWidth="2" />
      <path d={Array.from({ length: 33 }, (_, i) => `M${i * 50} ${FENCE} v${-h - 4}`).join(" ")} stroke="#868e96" strokeWidth="4" />
    </g>
  );
}

/** Gravel bed, sleepers and the two rails. */
function Track() {
  const top = TRACK - 22;
  const sleepers = Array.from({ length: 54 }, (_, i) => {
    const x = i * 30;
    return `M${towardsHorizon(x, PLATFORM_TOP, TRACK - 16)} ${TRACK - 16} L${towardsHorizon(x, PLATFORM_TOP, TRACK + 4)} ${TRACK + 4}`;
  });
  return (
    <g>
      <rect y={top - 8} width="1600" height={PLATFORM_TOP - top + 8} fill="#a39b8b" />
      <g fill="#8a8274">
        {Array.from({ length: 70 }, (_, i) => (
          <circle key={i} cx={(i * 83) % 1600} cy={top + ((i * 29) % 40)} r={1.5 + ((i * 29) % 40) / 30} />
        ))}
      </g>
      <path d={sleepers.join(" ")} stroke="#8d5a2b" strokeWidth="9" />
      <path d={`M0 ${TRACK - 12} H1600 M0 ${TRACK + 1} H1600`} stroke="#6c757d" strokeWidth="4" />
      <path d={`M0 ${TRACK - 14} H1600 M0 ${TRACK - 1} H1600`} stroke="#ced4da" strokeWidth="1.5" />
    </g>
  );
}

/** The platform: tiles with joints, the white edge and the yellow safety line, a bench and a lamp. */
function Platform() {
  const rows: string[] = [];
  for (let y = PLATFORM_TOP + 22; y < PLATFORM_BOTTOM; y += 22 * depthScale(y)) rows.push(`M0 ${y} H1600`);
  const joints = Array.from({ length: 30 }, (_, i) => {
    const x = -200 + i * 70;
    return `M${towardsHorizon(x, PLATFORM_BOTTOM, PLATFORM_TOP + 14)} ${PLATFORM_TOP + 14} L${x} ${PLATFORM_BOTTOM}`;
  });
  const s = depthScale(640);
  return (
    <g>
      <rect y={PLATFORM_TOP} width="1600" height={PLATFORM_BOTTOM - PLATFORM_TOP} fill="#dee2e6" />
      <rect y={PLATFORM_TOP} width="1600" height="6" fill="#f8f9fa" />
      <rect y={PLATFORM_TOP + 12} width="1600" height="4" fill="#ffd60a" />
      <path d={[...rows, ...joints].join(" ")} stroke="#ced4da" strokeWidth="2" />
      {/* Bench */}
      <g transform={`translate(330 636) scale(${s})`}>
        <rect x="-70" y="-56" width="140" height="12" rx="5" fill="#3a86ff" />
        <rect x="-70" y="-82" width="140" height="12" rx="5" fill="#3a86ff" />
        <path d="M-56 -44 V0 M56 -44 V0 M-50 -70 V-56 M50 -70 V-56" stroke="#495057" strokeWidth="7" />
      </g>
      {/* Platform lamp */}
      <g transform={`translate(1012 628) scale(${depthScale(628)})`}>
        <rect x="-5" y="-210" width="10" height="210" fill="#6c757d" />
        <path d="M0 -206 Q0 -226 26 -226" stroke="#6c757d" strokeWidth="8" fill="none" />
        <path d="M14 -230 H44 L38 -214 H20 Z" fill="#495057" />
        <ellipse cx="29" cy="-212" rx="10" ry="4" fill="#fff3b0" />
      </g>
      {/* Railing at the front of the platform */}
      <g>
        <path d={`M0 ${PLATFORM_BOTTOM - 26} H1600`} stroke="#adb5bd" strokeWidth="5" />
        <path d={Array.from({ length: 23 }, (_, i) => `M${i * 72 + 20} ${PLATFORM_BOTTOM} v-26`).join(" ")} stroke="#868e96" strokeWidth="5" />
      </g>
      <rect y={PLATFORM_BOTTOM} width="1600" height="8" fill="#adb5bd" />
    </g>
  );
}

/** The concrete apron on the left with its slabs and the yellow lead-in line. */
function Apron() {
  const rows: string[] = [];
  for (let y = PLATFORM_BOTTOM + 30 * depthScale(PLATFORM_BOTTOM); y < 1000; y += 70 * depthScale(y)) rows.push(`M0 ${y} H${kerbAt(y)}`);
  const joints = Array.from({ length: 10 }, (_, i) => {
    const x = -300 + i * 130;
    return `M${towardsHorizon(x, 1000, PLATFORM_BOTTOM + 8)} ${PLATFORM_BOTTOM + 8} L${x} 1000`;
  });
  return (
    <g>
      <path d={`M0 ${PLATFORM_BOTTOM + 8} H${FORECOURT_X} L${KERB_BOTTOM_X} 1000 H0 Z`} fill="url(#fh-apron)" />
      <path d={[...rows, ...joints].join(" ")} stroke="#c3c9cf" strokeWidth="2" />
      <path d="M-20 1000 Q300 840 560 760 T880 690" stroke="#ffd60a" strokeWidth="7" fill="none" />
      <path d="M80 940 l40 -14 M300 840 l34 -12" stroke="#ffd60a" strokeWidth="12" />
      <ellipse cx="250" cy="760" rx="44" ry="7" fill="#adb5bd" opacity="0.6" />
      <ellipse cx="700" cy="900" rx="56" ry="9" fill="#adb5bd" opacity="0.5" />
    </g>
  );
}

/** The forecourt: grass verge along the kerb, the road with its lane line and the pavement. */
function Forecourt() {
  const road = `M${kerbAt(ROAD_TOP)} ${ROAD_TOP} H1600 V${ROAD_BOTTOM} H${kerbAt(ROAD_BOTTOM)} Z`;
  const pavement = `M${kerbAt(ROAD_BOTTOM)} ${ROAD_BOTTOM} H1600 V1000 H${KERB_BOTTOM_X} Z`;
  const tiles: string[] = [];
  for (let y = ROAD_BOTTOM + 14; y < 1000; y += 30 * depthScale(y)) tiles.push(`M${kerbAt(y)} ${y} H1600`);
  for (let i = 0; i < 16; i++) {
    const x = 980 + i * 70;
    tiles.push(`M${towardsHorizon(x, 1000, ROAD_BOTTOM + 8)} ${ROAD_BOTTOM + 8} L${x} 1000`);
  }
  return (
    <g>
      <path d={`M${FORECOURT_X} ${PLATFORM_BOTTOM + 8} H1600 V${ROAD_TOP} H${kerbAt(ROAD_TOP)} Z`} fill="#95d5a6" />
      <path d={road} fill="url(#fh-road)" />
      <path d={`M${kerbAt(ROAD_TOP)} ${ROAD_TOP} H1600`} stroke="#ced4da" strokeWidth="6" />
      <path d={`M${kerbAt(790) + 20} 790 H1600`} stroke="#fff" strokeWidth="5" strokeDasharray="44 36" />
      <path d={pavement} fill="#e9ecef" />
      <path d={`M${kerbAt(ROAD_BOTTOM)} ${ROAD_BOTTOM} H1600`} stroke="#ced4da" strokeWidth="7" />
      <path d={tiles.join(" ")} stroke="#dee2e6" strokeWidth="2" />
      {/* The kerb between apron and forecourt */}
      <path d={`M${FORECOURT_X} ${PLATFORM_BOTTOM + 8} L${KERB_BOTTOM_X} 1000`} stroke="#adb5bd" strokeWidth="10" />
      <path d={`M${FORECOURT_X + 6} ${PLATFORM_BOTTOM + 8} L${KERB_BOTTOM_X + 8} 1000`} stroke="#ced4da" strokeWidth="4" />
      {/* Taxi sign by the road */}
      <g transform={`translate(1576 ${ROAD_TOP - 2}) scale(${depthScale(ROAD_TOP - 2)})`}>
        <rect x="-4" y="-150" width="8" height="150" fill="#6c757d" />
        <rect x="-34" y="-180" width="68" height="34" rx="6" fill="#ffd60a" stroke={INK} strokeWidth="3" />
        <text x="0" y="-163" fill={INK} fontSize="16" fontWeight="900" textAnchor="middle" dominantBaseline="central">
          TAXI
        </text>
      </g>
    </g>
  );
}

export function Background() {
  return (
    <>
      <defs>
        <linearGradient id="fh-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7cc8fb" />
          <stop offset="1" stopColor="#e3f4ff" />
        </linearGradient>
        <linearGradient id="fh-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e3f4ff" stopOpacity="0" />
          <stop offset="1" stopColor="#e3f4ff" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="fh-field" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c7ebd0" />
          <stop offset="1" stopColor="#95d5a6" />
        </linearGradient>
        <linearGradient id="fh-apron" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e2e6ea" />
          <stop offset="1" stopColor="#d3d8dd" />
        </linearGradient>
        <linearGradient id="fh-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#868e96" />
          <stop offset="1" stopColor="#626a72" />
        </linearGradient>
        <radialGradient id="fh-sunglow">
          <stop offset="0" stopColor="#fff3b0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff3b0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height={HORIZON + 20} fill="url(#fh-sky)" />
      <circle cx="1500" cy="80" r="140" fill="url(#fh-sunglow)" />
      <Cloud x={250} y={250} scale={0.3} className="fh-cloud fh-cloud-slow" />
      <Cloud x={880} y={220} scale={0.36} className="fh-cloud" />
      <path d="M640 150 q6 -6 12 0 q6 -6 12 0 M680 136 q5 -5 10 0 q5 -5 10 0" stroke="#5c677d" strokeWidth="2.5" fill="none" />
      <Terminal />
      <FarTree x={60} y={344} scale={0.4} />
      <FarTree x={820} y={340} scale={0.36} />
      <FarTree x={1000} y={344} scale={0.42} />
      <FarTree x={1560} y={342} scale={0.4} />
      <rect y="260" width="1600" height="90" fill="url(#fh-haze)" />

      {/* Airfield */}
      <rect y={HORIZON} width="1600" height={FENCE - HORIZON + 20} fill="url(#fh-field)" />
      <Runway />
      <g stroke="#52b788" strokeWidth="5" strokeLinecap="round" fill="none">
        {TUFTS.map(([x, y]) => (
          <path key={`${x}-${y}`} d="M0 0 q4 -24 12 -30 M10 0 q0 -26 -6 -36 M20 0 q2 -20 12 -26" transform={`translate(${x} ${y}) scale(${depthScale(y)})`} />
        ))}
      </g>
      <Fence />

      {/* Railway and platform */}
      <Track />
      <Platform />

      {/* Apron and forecourt */}
      <Apron />
      <Forecourt />
      <g stroke="#52b788" strokeWidth="5" strokeLinecap="round" fill="none">
        {[
          [930, 690],
          [1200, 700],
          [1500, 696],
        ].map(([x, y]) => (
          <path key={x} d="M0 0 q4 -24 12 -30 M10 0 q0 -26 -6 -36 M20 0 q2 -20 12 -26" transform={`translate(${x} ${y}) scale(${depthScale(y)})`} />
        ))}
      </g>
    </>
  );
}
