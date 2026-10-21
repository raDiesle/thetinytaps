import { HORIZON, depthScale, towardsHorizon } from "../layout";
import { Cloud } from "../shared";
import { FENCE, HOF, POND, TRACK_BOTTOM, TRACK_TOP } from "./layout";

// Far away rolling hills with a patchwork of fields fade into the haze; the windmill's
// hill and the cornfield behind the fence; the meadow, the dirt track with paths up to
// the farmhouse and the barn; in front the vegetable patch and the pond.

// Little trees on the far hills: [x, y, size].
const FAR_TREES = [
  [60, 312, 1],
  [96, 318, 0.8],
  [330, 300, 0.9],
  [1190, 296, 1],
  [1236, 302, 0.8],
  [1470, 306, 1],
  [1520, 312, 0.7],
];

// Fence sections at the back of the meadow: [from x, to x].
const FENCES = [
  [362, 856],
  [1188, 1600],
];

const TUFTS = [
  [40, 530],
  [640, 540],
  [1120, 600],
  [1360, 530],
  [20, 680],
  [140, 810],
  [470, 830],
  [880, 820],
  [1180, 980],
  [1590, 960],
  [740, 990],
  [1450, 790],
];

// Little meadow flowers: [x, y, colour].
const DOTS = [
  [80, 560, "#fff"],
  [300, 540, "#ffd60a"],
  [620, 600, "#fff"],
  [880, 590, "#ffd60a"],
  [1140, 560, "#fff"],
  [1560, 690, "#ff8fab"],
  [40, 870, "#ffd60a"],
  [450, 990, "#fff"],
  [980, 900, "#ff8fab"],
  [1460, 990, "#ffd60a"],
  [620, 960, "#fff"],
] as const;

const PEBBLES = [
  [80, 700],
  [240, 668],
  [530, 760],
  [700, 680],
  [1000, 762],
  [1180, 676],
  [1300, 720],
  [1520, 690],
];

function FarTree({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size * 0.4})`}>
      <rect x="-5" y="-30" width="10" height="30" fill="#b5a48b" />
      <circle cx="0" cy="-44" r="26" fill="#9fc79a" />
      <circle cx="-12" cy="-34" r="16" fill="#92bd8c" />
    </g>
  );
}

/** Wooden fence between x1 and x2 at the back of the meadow. */
function Fence({ x1, x2 }: { x1: number; x2: number }) {
  const s = depthScale(FENCE);
  const posts = Array.from({ length: Math.floor((x2 - x1) / 56) + 1 }, (_, i) => x1 + 10 + i * 56);
  return (
    <g>
      <path d={`M${x1} ${FENCE - 44 * s} H${x2} M${x1} ${FENCE - 22 * s} H${x2}`} stroke="#c8a27a" strokeWidth={9 * s} />
      {posts.map((x) => (
        <rect key={x} x={x - 6 * s} y={FENCE - 60 * s} width={12 * s} height={60 * s} rx={3 * s} fill="#a47e5a" />
      ))}
    </g>
  );
}

/** The cornfield behind the fence: golden rows that run towards the back. */
function Cornfield() {
  const [x1, x2, top] = [362, 856, 404];
  const rows = Array.from({ length: 22 }, (_, i) => {
    const x = x1 - 40 + i * 28;
    return `M${x} ${FENCE} L${towardsHorizon(x, FENCE, top)} ${top}`;
  });
  const ears = Array.from({ length: 40 }, (_, i) => `M${x1 + 6 + i * 12.4} ${top + 2} l${i % 2 ? 3 : -3} -9`);
  return (
    <g>
      <path d={`M${x1} ${top} H${x2} V${FENCE} H${x1} Z`} fill="url(#bh-field)" />
      <path d={rows.join(" ")} stroke="#e9b949" strokeWidth="3" />
      <path d={ears.join(" ")} stroke="#e9c46a" strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

/** Soil rows with lettuce and carrot tops, where the pumpkin grows. */
function VegetablePatch() {
  const [x1, x2, y1, y2] = [560, 780, 800, 872];
  const rows = [812, 832, 852];
  return (
    <g>
      <path d={`M${x1 + 10} ${y1} H${x2 - 10} Q${x2} ${y1} ${x2 + 6} ${y2} H${x1 - 6} Q${x1} ${y1} ${x1 + 10} ${y1} Z`} fill="#8d6346" />
      <path d={rows.map((y) => `M${x1 + 4} ${y} H${x2 - 4}`).join(" ")} stroke="#6f4e37" strokeWidth="4" />
      {rows.map((y, r) =>
        Array.from({ length: 6 }, (_, i) => {
          const x = x1 + 22 + i * 36 + (r % 2) * 14;
          return r === 1 ? (
            <path key={`${r}-${i}`} d={`M${x} ${y} l-5 -12 M${x} ${y} l0 -14 M${x} ${y} l5 -12`} stroke="#40916c" strokeWidth="3" strokeLinecap="round" />
          ) : (
            <g key={`${r}-${i}`}>
              <circle cx={x} cy={y - 5} r="8" fill="#95d5b2" />
              <circle cx={x} cy={y - 6} r="4" fill="#b7e4c7" />
            </g>
          );
        }),
      )}
    </g>
  );
}

function Pond() {
  const [cx, cy, rx, ry] = POND;
  return (
    <g>
      <ellipse cx={cx} cy={cy + 4} rx={rx + 12} ry={ry + 10} fill="#6a994e" opacity="0.5" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#bh-pond)" />
      <path d={`M${cx - rx + 30} ${cy - 18} q30 -10 60 0 M${cx + 40} ${cy + 26} q30 -8 56 0`} stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.5" fill="none" />
      {[
        [cx - 120, cy + 22],
        [cx + 30, cy - 34],
      ].map(([x, y]) => (
        <path key={x} d={`M${x} ${y} l26 -6 a30 9 0 1 1 2 8 Z`} fill="#52b788" />
      ))}
      <g transform={`translate(${cx - rx + 4} ${cy - 2})`}>
        <path d="M0 0 q-4 -40 -10 -60 M8 0 q2 -46 6 -70 M16 0 q8 -30 18 -44" stroke="#40916c" strokeWidth="4" strokeLinecap="round" fill="none" />
        <ellipse cx="-10" cy="-62" rx="4" ry="10" fill="#7f5539" />
        <ellipse cx="14" cy="-72" rx="4" ry="10" fill="#7f5539" />
      </g>
      <g transform={`translate(${cx + rx - 20} ${cy - 6})`}>
        <path d="M0 0 q-6 -36 -14 -52 M8 0 q0 -44 2 -64 M16 0 q8 -26 20 -38" stroke="#40916c" strokeWidth="4" strokeLinecap="round" fill="none" />
        <ellipse cx="10" cy="-66" rx="4" ry="10" fill="#7f5539" />
      </g>
    </g>
  );
}

export function Background() {
  return (
    <>
      <defs>
        <linearGradient id="bh-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7cc8fb" />
          <stop offset="1" stopColor="#e3f4ff" />
        </linearGradient>
        <linearGradient id="bh-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e3f4ff" stopOpacity="0" />
          <stop offset="1" stopColor="#e3f4ff" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="bh-meadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b5e3a1" />
          <stop offset="1" stopColor="#74c365" />
        </linearGradient>
        <linearGradient id="bh-field" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6e3a1" />
          <stop offset="1" stopColor="#f4d35e" />
        </linearGradient>
        <linearGradient id="bh-track" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e6c99a" />
          <stop offset="1" stopColor="#d4ac74" />
        </linearGradient>
        <radialGradient id="bh-pond" cx="0.45" cy="0.4">
          <stop offset="0" stopColor="#8fd3ff" />
          <stop offset="1" stopColor="#4ea8de" />
        </radialGradient>
        <radialGradient id="bh-sunglow">
          <stop offset="0" stopColor="#fff3b0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff3b0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height={HORIZON + 20} fill="url(#bh-sky)" />
      <circle cx="1520" cy="88" r="140" fill="url(#bh-sunglow)" />
      <Cloud x={250} y={200} scale={0.3} className="bh-cloud bh-cloud-slow" />
      <Cloud x={1200} y={176} scale={0.4} className="bh-cloud" />
      <path d="M700 160 q6 -6 12 0 q6 -6 12 0 M740 146 q5 -5 10 0 q5 -5 10 0" stroke="#5c677d" strokeWidth="2.5" fill="none" />

      {/* Far hills with a patchwork of fields */}
      <path d="M0 300 Q180 262 400 290 T820 284 T1240 272 T1600 292 V350 H0 Z" fill="#cfe8c4" />
      <path d="M140 300 L300 286 L360 300 L220 316 Z M960 286 L1100 276 L1150 292 L1000 300 Z" fill="#efe6b8" />
      <path d="M420 300 L560 292 L600 310 L470 316 Z M1300 290 L1420 282 L1480 300 L1340 306 Z" fill="#bfe0b1" />
      {FAR_TREES.map(([x, y, size]) => (
        <FarTree key={x} x={x} y={y} size={size} />
      ))}
      <path d="M0 330 Q240 300 520 326 T1000 318 T1600 324 V360 H0 Z" fill="#bfe3b0" />
      {/* The windmill's hill */}
      <path d="M560 410 Q760 350 990 410 Z" fill="#a9d99a" />
      <rect y="250" width="1600" height="110" fill="url(#bh-haze)" />

      {/* Ground, cornfield and fence */}
      <rect y={HORIZON + 20} width="1600" height={1000 - HORIZON - 20} fill="url(#bh-meadow)" />
      <path d="M0 340 Q400 330 800 344 T1600 338 V420 H0 Z" fill="#a8dc93" opacity="0.6" />
      <Cornfield />
      {FENCES.map(([x1, x2]) => (
        <Fence key={x1} x1={x1} x2={x2} />
      ))}

      {/* Dirt track across the yard, with paths up to the farmhouse door and the barn */}
      <path d={`M210 ${HOF - 6} H250 L300 ${TRACK_TOP + 4} H150 Z`} fill="url(#bh-track)" />
      <path d={`M944 ${HOF} H1096 L1150 ${TRACK_TOP + 4} H900 Z`} fill="url(#bh-track)" />
      <path
        d={`M0 ${TRACK_TOP + 6} Q400 ${TRACK_TOP - 8} 800 ${TRACK_TOP + 2} T1600 ${TRACK_TOP} V${TRACK_BOTTOM - 4} Q1200 ${TRACK_BOTTOM + 10} 800 ${TRACK_BOTTOM} T0 ${TRACK_BOTTOM + 4} Z`}
        fill="url(#bh-track)"
      />
      <path d={`M0 ${TRACK_TOP + 34} Q400 ${TRACK_TOP + 22} 800 ${TRACK_TOP + 32} T1600 ${TRACK_TOP + 30}`} stroke="#c49a63" strokeWidth="5" fill="none" />
      <path d={`M0 ${TRACK_BOTTOM - 26} Q400 ${TRACK_BOTTOM - 36} 800 ${TRACK_BOTTOM - 28} T1600 ${TRACK_BOTTOM - 30}`} stroke="#c49a63" strokeWidth="7" fill="none" />
      <path d={`M0 ${TRACK_TOP + 62} Q400 ${TRACK_TOP + 50} 800 ${TRACK_TOP + 60} T1600 ${TRACK_TOP + 58}`} stroke="#9bd17a" strokeWidth="8" strokeDasharray="14 10" fill="none" />
      <g fill="#bf9a6a">
        {PEBBLES.map(([x, y]) => (
          <ellipse key={x} cx={x} cy={y} rx={7 * depthScale(y)} ry={4 * depthScale(y)} />
        ))}
      </g>

      <VegetablePatch />
      <Pond />

      {/* Grass tufts and little flowers */}
      <g stroke="#52b788" strokeWidth="5" strokeLinecap="round" fill="none">
        {TUFTS.map(([x, y]) => (
          <path
            key={`${x}-${y}`}
            d="M0 0 q4 -24 12 -30 M10 0 q0 -26 -6 -36 M20 0 q2 -20 12 -26"
            transform={`translate(${x} ${y}) scale(${depthScale(y)})`}
          />
        ))}
      </g>
      {DOTS.map(([x, y, color]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${depthScale(y)})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={a} cx="0" cy="-6" r="4.5" fill={color} transform={`rotate(${a})`} />
          ))}
          <circle r="3.5" fill="#ffb703" />
        </g>
      ))}
    </>
  );
}
