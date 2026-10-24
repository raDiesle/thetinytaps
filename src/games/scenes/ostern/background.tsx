import { HORIZON, depthScale, transformOf } from "../layout";
import { Cloud, INK } from "../shared";
import { BUSH, POT, TABLE, TREE, WILLOW } from "./layout";

// A spring garden behind a white picket fence. Beyond it lie green hills with blossoming
// trees and a little church in the haze; in front of it a gravel path winds from the garden
// gate down to the front. Daisies and tufts get bigger towards the front, so the picture looks deep.

const FENCE_TOP = HORIZON - 62;
/** The gap in the fence where the garden gate (an item) stands. */
const GATE: [number, number] = [944, 1016];

/** Middle of the gravel path at height y, from the gate down to the front. */
function pathX(y: number) {
  const t = (y - HORIZON) / (1000 - HORIZON);
  return 980 - 250 * t + 60 * t * t;
}

/** Half the width of the path at height y. */
const pathHalf = (y: number) => 80 * depthScale(y);

function pathOutline() {
  const ys = Array.from({ length: 23 }, (_, i) => HORIZON + 4 + (i * (1000 - HORIZON)) / 22);
  const left = ys.map((y) => `${pathX(y) - pathHalf(y)} ${y}`);
  const right = ys.map((y) => `${pathX(y) + pathHalf(y)} ${y}`).reverse();
  return `M${left.join(" L")} L${right.join(" L")} Z`;
}

/** Stepping stones along the path. */
const STONES = [372, 410, 455, 505, 560, 620, 690, 770, 860, 960];

/** Daisies in the meadow: [x, y]. */
const DAISIES = [
  [60, 360],
  [300, 352],
  [560, 368],
  [1080, 356],
  [1350, 372],
  [440, 410],
  [860, 420],
  [1560, 430],
  [40, 470],
  [620, 520],
  [1010, 470],
  [1300, 470],
  [180, 560],
  [560, 600],
  [1090, 680],
  [1600, 640],
  [40, 700],
  [520, 720],
  [1210, 780],
  [360, 830],
  [960, 780],
  [1560, 900],
  [210, 990],
  [560, 990],
  [1000, 990],
  [1420, 980],
  [740, 870],
];

/** Little violets and buttercups: [x, y, colour]. */
const SPECKS: [number, number, string][] = [
  [200, 380, "#b197fc"],
  [700, 380, "#ffd43b"],
  [1500, 400, "#b197fc"],
  [330, 470, "#ffd43b"],
  [1150, 520, "#b197fc"],
  [760, 560, "#ffd43b"],
  [280, 760, "#b197fc"],
  [1000, 840, "#ffd43b"],
  [1500, 760, "#b197fc"],
  [80, 800, "#ffd43b"],
  [600, 800, "#b197fc"],
  [1240, 900, "#b197fc"],
  [880, 960, "#ffd43b"],
];

/** Grass tufts: [x, y]. */
const TUFTS = [
  [140, 350],
  [420, 360],
  [1250, 352],
  [1530, 360],
  [600, 440],
  [1080, 430],
  [250, 500],
  [1260, 560],
  [130, 680],
  [560, 690],
  [1080, 620],
  [1600, 700],
  [10, 860],
  [300, 900],
  [700, 1000],
  [1180, 960],
  [1600, 990],
  [880, 700],
];

function Hills() {
  return (
    <g>
      <path d="M0 236 Q140 196 300 222 T640 214 T1000 220 T1340 206 T1600 224 V300 H0 Z" fill="#cfe9d3" />
      {/* A little church far away, the Easter bells ring there */}
      <g fill="#e3ecf6">
        <rect x="508" y="214" width="62" height="40" />
        <path d="M502 216 L539 192 L576 216 Z" fill="#d8b4b4" />
        <rect x="474" y="190" width="30" height="64" />
        <path d="M470 192 L489 146 L508 192 Z" fill="#d8b4b4" />
        <circle cx="489" cy="206" r="6" fill="#c5d3e6" />
      </g>
      <path d="M0 256 Q200 228 420 250 T860 244 T1300 238 T1600 250 V320 H0 Z" fill="#b9e2c0" />
      {/* Blossoming trees on the hills */}
      {[
        [80, 246, "#ffd6e7"],
        [140, 250, "#fff"],
        [700, 244, "#ffd6e7"],
        [1320, 238, "#fff"],
        [1380, 242, "#ffd6e7"],
        [1500, 248, "#ffd6e7"],
      ].map(([x, y, colour]) => (
        <g key={`${x}`}>
          <rect x={Number(x) - 2} y={Number(y) - 4} width="4" height="12" fill="#a68a7a" />
          <circle cx={x} cy={Number(y) - 12} r="12" fill={String(colour)} />
          <circle cx={Number(x) + 6} cy={Number(y) - 16} r="6" fill="#fff" opacity="0.6" />
        </g>
      ))}
      <path d="M0 282 Q260 262 520 278 T1040 272 T1600 280 V330 H0 Z" fill="#a8dcb0" />
    </g>
  );
}

/** White pickets with two rails; the gap is filled by the garden gate. */
function Fence() {
  const pickets = Array.from({ length: 100 }, (_, i) => i * 17 - 4).filter((x) => x + 12 < GATE[0] || x > GATE[1]);
  return (
    <g>
      <rect x="0" y={FENCE_TOP + 14} width={GATE[0]} height="7" fill="#e9ecef" />
      <rect x={GATE[1]} y={FENCE_TOP + 14} width={1600 - GATE[1]} height="7" fill="#e9ecef" />
      <rect x="0" y={FENCE_TOP + 44} width={GATE[0]} height="7" fill="#e9ecef" />
      <rect x={GATE[1]} y={FENCE_TOP + 44} width={1600 - GATE[1]} height="7" fill="#e9ecef" />
      {pickets.map((x) => (
        <g key={x}>
          <path d={`M${x} ${HORIZON} V${FENCE_TOP + 6} L${x + 6} ${FENCE_TOP} L${x + 12} ${FENCE_TOP + 6} V${HORIZON} Z`} fill="#fff" />
          <rect x={x + 9} y={FENCE_TOP + 6} width="3" height={HORIZON - FENCE_TOP - 6} fill="#dee2e6" />
        </g>
      ))}
    </g>
  );
}

function Path() {
  return (
    <g>
      <path d={pathOutline()} fill="#f3e6c8" />
      <path d={pathOutline()} fill="none" stroke="#e2cfa4" strokeWidth="4" />
      {STONES.map((y, i) => {
        const s = depthScale(y);
        const x = pathX(y) + (i % 2 ? 14 : -14) * s;
        return (
          <g key={y}>
            <ellipse cx={x} cy={y + 3 * s} rx={46 * s} ry={14 * s} fill="#c9b48a" opacity="0.6" />
            <ellipse cx={x} cy={y} rx={44 * s} ry={13 * s} fill="#e9ecef" />
            <ellipse cx={x - 10 * s} cy={y - 3 * s} rx={20 * s} ry={4 * s} fill="#fff" opacity="0.7" />
          </g>
        );
      })}
    </g>
  );
}

function Daisy({ x, y }: { x: number; y: number }) {
  const s = depthScale(y);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse key={a} cx="0" cy="-7" rx="3.4" ry="6" fill="#fff" transform={`rotate(${a})`} />
      ))}
      <circle r="3.6" fill="#ffd43b" />
    </g>
  );
}

export function Background() {
  return (
    <>
      <defs>
        <linearGradient id="os-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fd4fb" />
          <stop offset="1" stopColor="#eaf6ff" />
        </linearGradient>
        <linearGradient id="os-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c8ecb4" />
          <stop offset="0.4" stopColor="#a3dc8e" />
          <stop offset="1" stopColor="#7cc870" />
        </linearGradient>
        <linearGradient id="os-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eaf6ff" stopOpacity="0" />
          <stop offset="1" stopColor="#eaf6ff" stopOpacity="0.6" />
        </linearGradient>
        <radialGradient id="os-sunglow">
          <stop offset="0" stopColor="#fff3b0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff3b0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height={HORIZON + 10} fill="url(#os-sky)" />
      <circle cx="1470" cy="96" r="150" fill="url(#os-sunglow)" />
      <Cloud x={1040} y={120} scale={0.4} className="os-cloud" />
      <Cloud x={620} y={92} scale={0.3} className="os-cloud os-cloud-slow" />
      <path d="M860 170 q6 -6 12 0 q6 -6 12 0 M900 156 q5 -5 10 0 q5 -5 10 0" stroke="#5c677d" strokeWidth="2.5" fill="none" />
      <Hills />
      <rect y="190" width="1600" height="110" fill="url(#os-haze)" />
      <Fence />
      <rect y={HORIZON} width="1600" height={1000 - HORIZON} fill="url(#os-ground)" />
      <rect y={HORIZON} width="1600" height="6" fill="#b5dfa0" />

      {/* Mown stripes in the lawn and soft darker patches */}
      <g fill="#94d27f" opacity="0.45">
        <ellipse cx="300" cy="400" rx="200" ry="10" />
        <ellipse cx="1350" cy="470" rx="180" ry="12" />
        <ellipse cx="420" cy="760" rx="260" ry="20" />
        <ellipse cx="1300" cy="860" rx="260" ry="22" />
        <ellipse cx="160" cy="950" rx="200" ry="22" />
      </g>
      <Path />

      {/* Shadows under the things that stand together */}
      <g fill={INK} opacity="0.1">
        <ellipse cx={TREE.x} cy={TREE.y} rx={150 * TREE.scale} ry={14 * TREE.scale} />
        <ellipse cx={WILLOW.x + 6} cy={WILLOW.y} rx={110 * WILLOW.scale} ry={14 * WILLOW.scale} />
        <ellipse cx={BUSH.x} cy={BUSH.y} rx={170 * BUSH.scale} ry={16 * BUSH.scale} />
        <ellipse cx={TABLE.x} cy={TABLE.y} rx={140 * TABLE.scale} ry={12 * TABLE.scale} />
        <ellipse cx={POT.x} cy={POT.y} rx={56 * POT.scale} ry={8 * POT.scale} />
      </g>

      <g opacity="0.85">
        {SPECKS.map(([x, y, colour]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={5 * depthScale(y)} fill={colour} />
        ))}
      </g>
      {DAISIES.map(([x, y]) => (
        <Daisy key={`${x}-${y}`} x={x} y={y} />
      ))}
      <g stroke="#52b788" strokeWidth="5" strokeLinecap="round" fill="none">
        {TUFTS.map(([x, y]) => (
          <path key={`${x}-${y}`} d="M0 0 q4 -24 12 -30 M10 0 q0 -26 -6 -36 M20 0 q2 -20 12 -26" transform={`translate(${x} ${y}) scale(${depthScale(y)})`} />
        ))}
      </g>
      {/* Roots of the cherry tree on the lawn */}
      <g transform={transformOf(TREE)} fill="#8d5f45">
        <path d="M-60 0 Q-40 -20 -30 -40 L-10 -40 Q-20 -10 -60 0 Z M60 0 Q40 -20 32 -40 L12 -40 Q22 -10 60 0 Z" />
      </g>
    </>
  );
}
