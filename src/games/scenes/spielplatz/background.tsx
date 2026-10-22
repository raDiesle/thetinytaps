import { HORIZON, depthScale, towardsHorizon } from "../layout";
import { Cloud } from "../shared";
import { FENCE, GATE_X, PATH_BOTTOM, PATH_TOP } from "./layout";

// Behind the fence the town fades into the haze; trees and a hedge stand right
// behind the fence. In front of it lies the lawn with soft sand under the climbing
// things, a sandy path across and daisies, pebbles and tufts that grow towards the front.

// Far-away houses: [x, top, width, roof colour].
const HOUSES = [
  [40, 236, 70, "#e5c2c6"],
  [250, 250, 60, "#d8c8e8"],
  [690, 244, 64, "#e5c2c6"],
  [1010, 232, 78, "#d4dcef"],
  [1240, 256, 58, "#d8c8e8"],
  [1420, 238, 72, "#e5c2c6"],
] as const;

// Trees behind the fence: [x, crown radius, colour].
const BACK_TREES = [
  [200, 44, "#95d5b2"],
  [330, 34, "#a7dcbd"],
  [800, 40, "#95d5b2"],
  [1050, 48, "#a7dcbd"],
  [1390, 38, "#95d5b2"],
  [1560, 46, "#a7dcbd"],
] as const;

/** Grass tufts: [x, y]; they grow with depth like everything else. */
const TUFTS = [
  [250, 430],
  [760, 452],
  [1180, 470],
  [1560, 560],
  [40, 560],
  [860, 610],
  [1110, 690],
  [20, 840],
  [560, 880],
  [1340, 870],
  [1590, 960],
  [900, 996],
  [40, 996],
];

/** Daisies on the lawn: [x, y]. */
const DAISIES = [
  [330, 440],
  [1000, 455],
  [1450, 600],
  [480, 640],
  [1200, 700],
  [60, 760],
  [600, 840],
  [1080, 850],
  [1580, 820],
  [1290, 970],
  [580, 990],
];

/** Pebbles on the path: [x, y]. */
const PEBBLES = [
  [80, 730],
  [260, 770],
  [520, 724],
  [700, 780],
  [930, 740],
  [1180, 786],
  [1420, 728],
  [1540, 778],
];

/** Soft sand under the climbing things, so falling down doesn't hurt: [cx, cy, rx, ry]. */
const SOFT_SAND = [
  [400, 548, 270, 34],
  [180, 694, 140, 28],
  [700, 660, 150, 28],
  [1000, 666, 150, 30],
  [1370, 646, 160, 28],
] as const;

function Town() {
  return (
    <g>
      {HOUSES.map(([x, y, w, roof]) => (
        <g key={x}>
          <rect x={x} y={y} width={w} height={HORIZON + 20 - y} fill="#eef1f8" />
          <path d={`M${x - 6} ${y} L${x + w / 2} ${y - 30} L${x + w + 6} ${y} Z`} fill={roof} />
          <g fill="#d3def4">
            <rect x={x + 12} y={y + 14} width="14" height="16" rx="2" />
            <rect x={x + w - 26} y={y + 14} width="14" height="16" rx="2" />
            <rect x={x + 12} y={y + 44} width="14" height="16" rx="2" />
            <rect x={x + w - 26} y={y + 44} width="14" height="16" rx="2" />
          </g>
        </g>
      ))}
      {/* A church tower far away */}
      <rect x="540" y="176" width="34" height="170" fill="#e3e8f3" />
      <path d="M534 178 L557 112 L580 178 Z" fill="#c9d3ea" />
      <circle cx="557" cy="200" r="9" fill="#f8f9fa" />
    </g>
  );
}

function BackTree({ x, r, fill }: { x: number; r: number; fill: string }) {
  return (
    <g>
      <rect x={x - 5} y={FENCE - 50} width="10" height="44" fill="#b08968" />
      <circle cx={x} cy={FENCE - 48 - r * 0.6} r={r} fill={fill} />
      <circle cx={x - r * 0.6} cy={FENCE - 40 - r * 0.3} r={r * 0.6} fill={fill} />
      <circle cx={x + r * 0.6} cy={FENCE - 42 - r * 0.3} r={r * 0.65} fill={fill} />
      <circle cx={x - r * 0.3} cy={FENCE - 60 - r} r={r * 0.3} fill="#fff" opacity="0.25" />
    </g>
  );
}

/** The wooden picket fence along the back, with a gap where the gate hangs. */
function Fence() {
  const s = depthScale(FENCE);
  const gap = 46 * s * 1.15;
  const h = 70 * s * 1.15;
  const pickets: number[] = [];
  for (let x = 4; x < 1600; x += 26) if (Math.abs(x - GATE_X) > gap + 14) pickets.push(x);
  const rails = [
    [0, GATE_X - gap],
    [GATE_X + gap, 1600],
  ];
  return (
    <g>
      {rails.map(([x1, x2]) => (
        <g key={x1} fill="#c08552">
          <rect x={x1} y={FENCE - h * 0.75} width={x2 - x1} height="6" />
          <rect x={x1} y={FENCE - h * 0.3} width={x2 - x1} height="6" />
        </g>
      ))}
      {pickets.map((x) => (
        <g key={x}>
          <path d={`M${x - 8} ${FENCE} V${FENCE - h + 6} L${x} ${FENCE - h} L${x + 8} ${FENCE - h + 6} V${FENCE} Z`} fill="#e6b88a" />
          <path d={`M${x + 4} ${FENCE} V${FENCE - h + 3} L${x + 8} ${FENCE - h + 6} V${FENCE} Z`} fill="#c99a6b" />
        </g>
      ))}
      <rect y={FENCE - 2} width="1600" height="5" fill="#86c99a" />
    </g>
  );
}

/** The sandy path across the playground, and the bit that leads from the gate down to it. */
function Path() {
  const top = `M-10 ${PATH_TOP + 8} Q400 ${PATH_TOP - 14} 800 ${PATH_TOP} T1610 ${PATH_TOP - 6}`;
  const s = depthScale(FENCE);
  const gate = 40 * s * 1.15;
  return (
    <g>
      {/* From the gate the path widens towards the front */}
      <path
        d={`M${GATE_X - gate} ${FENCE} L${GATE_X + gate} ${FENCE} Q${GATE_X + 40} 560 ${GATE_X + 150} ${PATH_TOP + 2} L${GATE_X - 120} ${PATH_TOP + 2} Q${GATE_X - 50} 560 ${GATE_X - gate} ${FENCE} Z`}
        fill="#f1d9a7"
      />
      <path d={`${top} V${PATH_BOTTOM + 10} Q1200 ${PATH_BOTTOM - 8} 800 ${PATH_BOTTOM} T-10 ${PATH_BOTTOM + 4} Z`} fill="#f1d9a7" />
      <path d={`M-10 ${PATH_BOTTOM + 4} Q400 ${PATH_BOTTOM + 12} 800 ${PATH_BOTTOM} T1610 ${PATH_BOTTOM + 10}`} stroke="#d9b77c" strokeWidth="5" fill="none" />
      <path d={top} stroke="#e4c48d" strokeWidth="3" fill="none" />
      {/* Tyre tracks of the tricycle, running towards the back */}
      {[260, 300].map((x) => (
        <path key={x} d={`M${x} ${PATH_BOTTOM} L${towardsHorizon(x, PATH_BOTTOM, PATH_TOP + 10)} ${PATH_TOP + 10}`} stroke="#e4c48d" strokeWidth="2" opacity="0.7" />
      ))}
      <g fill="#d9b77c">
        {PEBBLES.map(([x, y]) => (
          <ellipse key={x} cx={x} cy={y} rx={7 * depthScale(y)} ry={4 * depthScale(y)} />
        ))}
      </g>
    </g>
  );
}

export function Background() {
  return (
    <>
      <defs>
        <linearGradient id="sp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#74c0fc" />
          <stop offset="1" stopColor="#e3f4ff" />
        </linearGradient>
        <linearGradient id="sp-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e3f4ff" stopOpacity="0" />
          <stop offset="1" stopColor="#e3f4ff" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="sp-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b7e4c7" />
          <stop offset="0.4" stopColor="#95d5a6" />
          <stop offset="1" stopColor="#69c17f" />
        </linearGradient>
        <radialGradient id="sp-sunglow">
          <stop offset="0" stopColor="#fff3b0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff3b0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sp-softsand">
          <stop offset="0.6" stopColor="#f4dfae" />
          <stop offset="1" stopColor="#f4dfae" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height={HORIZON + 30} fill="url(#sp-sky)" />
      <circle cx="1480" cy="80" r="150" fill="url(#sp-sunglow)" />
      <Cloud x={240} y={190} scale={0.32} className="sp-cloud sp-cloud-slow" />
      <Cloud x={1150} y={150} scale={0.42} className="sp-cloud" />
      <path d="M1290 220 q6 -6 12 0 q6 -6 12 0 M1330 206 q5 -5 10 0 q5 -5 10 0" stroke="#5c677d" strokeWidth="2.5" fill="none" />
      {/* Hills and the town far away */}
      <path d="M0 300 Q200 240 420 286 T860 270 T1300 280 T1600 262 V360 H0 Z" fill="#cde9d6" />
      <Town />
      <rect y="220" width="1600" height="140" fill="url(#sp-haze)" />

      {/* Lawn */}
      <rect y={HORIZON} width="1600" height={1000 - HORIZON} fill="url(#sp-grass)" />
      {/* Hedge and trees right behind the fence */}
      <path d={`M0 ${FENCE - 22} Q120 ${FENCE - 44} 260 ${FENCE - 30} T560 ${FENCE - 34} T900 ${FENCE - 28} T1240 ${FENCE - 36} T1600 ${FENCE - 30} V${FENCE} H0 Z`} fill="#74c69d" />
      {BACK_TREES.map(([x, r, fill]) => (
        <BackTree key={x} x={x} r={r} fill={fill} />
      ))}
      <path d={`M0 ${FENCE - 8} Q200 ${FENCE - 26} 420 ${FENCE - 14} T900 ${FENCE - 16} T1360 ${FENCE - 20} T1600 ${FENCE - 12} V${FENCE} H0 Z`} fill="#52b788" />
      <Fence />

      {/* Soft sand under the climbing things */}
      {SOFT_SAND.map(([cx, cy, rx, ry]) => (
        <ellipse key={cx} cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#sp-softsand)" />
      ))}
      <Path />

      {/* Daisies and grass tufts, bigger towards the front */}
      {DAISIES.map(([x, y]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${depthScale(y)})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="0" cy="-7" rx="4" ry="7" fill="#fff" transform={`rotate(${a})`} />
          ))}
          <circle r="4.5" fill="#ffd60a" />
        </g>
      ))}
      <g stroke="#40916c" strokeWidth="5" strokeLinecap="round" fill="none">
        {TUFTS.map(([x, y]) => (
          <path
            key={`${x}-${y}`}
            d="M0 0 q4 -24 12 -30 M10 0 q0 -26 -6 -36 M20 0 q2 -20 12 -26"
            transform={`translate(${x} ${y}) scale(${depthScale(y)})`}
          />
        ))}
      </g>
    </>
  );
}
