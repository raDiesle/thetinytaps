import { HORIZON, depthScale, transformOf } from "../layout";
import { Cloud, nth } from "../shared";
import { MERMAID_ROCK, OCTO_ROCK, SNAIL_STONE, SURFACE } from "./layout";

// A thin strip of sky above the waves; below it the water gets deeper and bluer. Rays of
// sunlight fall through it. Far away the reef fades into the blue haze; the sea floor runs
// from there to the front and turns from hazy blue-green to warm sand. Ripples, pebbles and
// seagrass grow towards the front.

/** Sand ripples: [x, y] of each ripple's left end. */
const RIPPLES = [
  [60, 420],
  [380, 410],
  [880, 430],
  [1160, 412],
  [180, 500],
  [760, 490],
  [1040, 520],
  [440, 590],
  [1300, 600],
  [80, 760],
  [660, 640],
  [1010, 690],
  [1500, 700],
  [900, 860],
  [1340, 860],
  [560, 990],
  [1260, 990],
  [340, 870],
];

const PEBBLES = [
  [300, 470],
  [980, 470],
  [520, 640],
  [1300, 690],
  [620, 900],
  [1060, 840],
  [1450, 880],
  [120, 880],
  [840, 970],
];

/** Low seagrass tufts on the floor: [x, y]. */
const TUFTS = [
  [140, 440],
  [560, 400],
  [960, 420],
  [1560, 520],
  [40, 620],
  [700, 560],
  [1300, 700],
  [1590, 800],
  [500, 770],
  [1040, 980],
];

/** Shafts of sunlight from the surface down into the deep, slanting away from the sun. */
const RAYS = [
  [180, 80, 120],
  [520, 60, 70],
  [860, 100, 140],
  [1180, 70, 100],
  [1440, 90, 110],
];

function Tuft({ x, y, tall = 1, color = "#40916c" }: { x: number; y: number; tall?: number; color?: string }) {
  return (
    <path
      d={`M0 0 q-10 ${-30 * tall} 0 ${-60 * tall} M14 0 q12 ${-36 * tall} 2 ${-74 * tall} M28 0 q-6 ${-24 * tall} 6 ${-50 * tall}`}
      transform={`translate(${x} ${y}) scale(${depthScale(y)})`}
      stroke={color}
      strokeWidth="9"
      strokeLinecap="round"
      fill="none"
    />
  );
}

/** A rounded rock under water, with a light top and a darker bottom. */
function Rock({ d, top }: { d: string; top: string }) {
  return (
    <>
      <path d={d} fill="#7d8fa3" />
      <path d={top} stroke="#a7b8c9" strokeWidth="10" strokeLinecap="round" fill="none" />
    </>
  );
}

export function Background() {
  return (
    <>
      <defs>
        <linearGradient id="uw-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fd3ff" />
          <stop offset="1" stopColor="#e3f6ff" />
        </linearGradient>
        <linearGradient id="uw-water" gradientUnits="userSpaceOnUse" x1="0" y1={SURFACE} x2="0" y2="1000">
          <stop offset="0" stopColor="#7ee0f5" />
          <stop offset="0.3" stopColor="#3fb3e0" />
          <stop offset="1" stopColor="#2a8fd0" />
        </linearGradient>
        <linearGradient id="uw-floor" gradientUnits="userSpaceOnUse" x1="0" y1={HORIZON} x2="0" y2="1000">
          <stop offset="0" stopColor="#6fb2cf" />
          <stop offset="0.2" stopColor="#b3cdb8" />
          <stop offset="0.5" stopColor="#e8d4a2" />
          <stop offset="1" stopColor="#f3d69f" />
        </linearGradient>
        <linearGradient id="uw-ray" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.32" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="uw-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4fb0dc" stopOpacity="0.7" />
          <stop offset="1" stopColor="#4fb0dc" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Sky and waves */}
      <rect width="1600" height={SURFACE + 10} fill="url(#uw-sky)" />
      <Cloud x={900} y={44} scale={0.26} className="uw-cloud" />
      <rect y={SURFACE} width="1600" height={1000 - SURFACE} fill="url(#uw-water)" />
      <path d={`M0 ${SURFACE} ${Array.from({ length: 40 }, () => "q20 -8 40 0").join(" ")} V${SURFACE + 10} H0 Z`} fill="#7ee0f5" className="uw-waves" />
      <path d={`M0 ${SURFACE} ${Array.from({ length: 40 }, () => "q20 -8 40 0").join(" ")}`} stroke="#fff" strokeWidth="3" fill="none" opacity="0.8" />
      <path
        d={`M0 ${SURFACE + 8} ${Array.from({ length: 32 }, (_, i) => `q25 ${i % 2 ? 8 : 4} 50 0`).join(" ")}`}
        stroke="#c5f6fa"
        strokeWidth="5"
        fill="none"
        opacity="0.5"
      />

      {/* Sun rays falling through the water */}
      <g className="uw-rays">
        {RAYS.map(([x, w, lean], i) => (
          <path key={x} className="uw-ray" d={`M${x} ${SURFACE + 6} h${w} L${x + w * 2.2 - lean} 780 h${-w * 3} Z`} fill="url(#uw-ray)" style={nth(i)} />
        ))}
      </g>

      {/* The far reef in the haze */}
      <path
        d="M0 340 Q60 296 130 318 Q190 280 260 310 Q330 300 380 326 Q470 290 560 320 Q660 300 740 330 Q860 292 960 318 Q1060 286 1140 316 Q1240 300 1320 326 Q1420 288 1500 312 Q1560 300 1600 316 V350 H0 Z"
        fill="#5aaacf"
        opacity="0.75"
      />
      <g stroke="#62b3d6" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.8">
        <path d="M200 318 V286 M200 300 l-14 -14 M200 296 l12 -16" />
        <path d="M1040 316 V280 M1040 296 l-12 -12 M1040 290 l14 -14" />
        <path d="M1380 320 V292 M1380 304 l-12 -10" />
      </g>

      {/* The sea floor */}
      <path
        d={`M0 ${HORIZON + 4} Q200 ${HORIZON - 8} 400 ${HORIZON + 2} T800 ${HORIZON} T1200 ${HORIZON + 4} T1600 ${HORIZON - 2} V1000 H0 Z`}
        fill="url(#uw-floor)"
      />
      <rect y={HORIZON - 30} width="1600" height="200" fill="url(#uw-haze)" />

      {/* Rocks at the back left, behind the submarine */}
      <path d="M-20 480 Q-10 420 40 410 Q90 400 120 440 Q140 470 130 486 Z" fill="#7f9fb5" />
      <path d="M10 424 Q50 408 90 418" stroke="#a3bfd0" strokeWidth="8" strokeLinecap="round" fill="none" />

      {/* Seagrass meadow behind the seahorse */}
      {[1100, 1124, 1150, 1176, 1200].map((x, i) => (
        <path
          key={x}
          d={`M0 0 q-14 -60 0 -120 q14 -60 -2 -${110 + (i % 2) * 40}`}
          transform={`translate(${x} 470) scale(${depthScale(470)})`}
          stroke={i % 2 ? "#52b788" : "#40916c"}
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
      ))}

      {RIPPLES.map(([x, y]) => (
        <path
          key={`${x}-${y}`}
          d="M0 0 q20 -8 40 0 t40 0 t40 0"
          transform={`translate(${x} ${y}) scale(${depthScale(y)})`}
          stroke={y < 520 ? "#a2c2b4" : "#d9bd85"}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      ))}
      {PEBBLES.map(([x, y], i) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${depthScale(y)})`}>
          <ellipse cx="0" cy="-6" rx={14 + (i % 3) * 4} ry="9" fill={y < 520 ? "#9fb6b8" : "#c8b28a"} />
          <ellipse cx="22" cy="-4" rx="8" ry="6" fill={y < 520 ? "#b3c7c4" : "#ddc69b"} />
        </g>
      ))}
      {TUFTS.map(([x, y]) => (
        <Tuft key={`${x}-${y}`} x={x} y={y} color={y < 520 ? "#4f9f86" : "#40916c"} />
      ))}

      {/* The mermaid's rock, the octopus's rock and the snail's stone */}
      <g transform={transformOf(MERMAID_ROCK)}>
        <Rock d="M-132 0 Q-142 -60 -82 -88 Q0 -106 82 -90 Q142 -66 134 0 Z" top="M-90 -76 Q-10 -96 70 -82" />
        <path d="M-132 0 Q-60 -30 134 0 Z" fill="#6b7d91" />
        <path d="M100 -60 q10 -20 0 -40 M112 -56 q12 -16 6 -36" stroke="#52b788" strokeWidth="6" fill="none" strokeLinecap="round" />
      </g>
      <g transform={transformOf(OCTO_ROCK)}>
        <Rock d="M-140 0 Q-150 -58 -92 -84 Q0 -102 92 -86 Q150 -60 140 0 Z" top="M-100 -72 Q0 -92 90 -76" />
        <path d="M-140 0 Q-60 -26 140 0 Z" fill="#6b7d91" />
      </g>
      <g transform={transformOf(SNAIL_STONE)}>
        <Rock d="M-72 0 Q-76 -32 -40 -42 Q0 -50 40 -42 Q76 -32 72 0 Z" top="M-46 -34 Q0 -46 40 -36" />
      </g>
    </>
  );
}
