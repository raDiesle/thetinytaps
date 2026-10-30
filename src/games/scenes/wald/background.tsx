import { HORIZON, depthScale } from "../layout";
import { Cloud } from "../shared";
import { Poke } from "../spots";
import { BRIDGE_Y, BROOK_TOP, DAMM_Y, brookHalf, brookX, pathHalf, pathY } from "./layout";

// A clearing in the forest. Far away rows of fir trees fade into the morning haze, sunbeams
// fall through the trees; the brook winds from the back to the front right, with stones,
// the beaver's dam and reeds; the forest path crosses the picture and the bridge; moss,
// leaves, little mushrooms and flowers lie on the forest floor.

// Rows of far fir trees along the horizon: [x, height].
const FAR_FIRS = Array.from({ length: 34 }, (_, i) => [i * 50 - 10 + (i % 3) * 9, 70 + ((i * 37) % 5) * 12]);
const NEAR_FIRS = Array.from({ length: 22 }, (_, i) => [i * 78 + 20 + (i % 2) * 22, 96 + ((i * 53) % 4) * 18]);

// Trees between the clearing and the far forest, standing at ground height y: [x, y, size].
const MID_TREES = [
  [300, 388, 0.9],
  [740, 372, 0.8],
  [1210, 368, 0.7],
  [1420, 392, 1],
  [1560, 380, 0.85],
] as const;

// Stones in the brook: [ground height, offset from the middle in half widths, size].
const STONES = [
  [420, -0.6, 0.8],
  [478, 0.5, 0.9],
  [600, -0.4, 1],
  [628, 0.7, 0.8],
  [770, 0.6, 1.1],
  [800, -0.75, 0.9],
  [905, 0.15, 1.6],
  [970, -0.7, 1.2],
  [990, 0.8, 1],
] as const;

const TUFTS = [
  [40, 520],
  [420, 500],
  [980, 470],
  [1530, 520],
  [600, 640],
  [180, 610],
  [1100, 660],
  [1560, 590],
  [40, 870],
  [420, 860],
  [640, 870],
  [960, 980],
  [1250, 880],
  [1580, 870],
  [880, 820],
  [1190, 800],
];

// Fallen leaves: [x, y, colour, angle].
const LEAVES = [
  [210, 640, "#f4a261", 20],
  [520, 650, "#e9c46a", -30],
  [880, 660, "#e76f51", 60],
  [1060, 560, "#e9c46a", 10],
  [130, 860, "#e76f51", -40],
  [380, 990, "#f4a261", 30],
  [700, 980, "#e9c46a", -10],
  [940, 860, "#e76f51", 50],
  [1200, 920, "#f4a261", -60],
  [1560, 960, "#e9c46a", 20],
  [1520, 640, "#f4a261", 70],
] as const;

// Wood anemones: [x, y].
const ANEMONES = [
  [60, 600],
  [520, 560],
  [1000, 520],
  [1480, 480],
  [260, 960],
  [620, 900],
  [1000, 990],
  [1580, 780],
  [300, 700],
];

// Tiny mushrooms that are no items (they only wobble when tapped): [x, y].
const SMALL_MUSHROOMS = [
  [450, 640],
  [1110, 610],
  [1580, 720],
  [200, 980],
];

const PEBBLES = [70, 230, 360, 520, 640, 860, 980, 1110, 1450, 1560];

/** A dark green fir as a simple silhouette, foot at (x, y). */
function Fir({ x, y, h, fill }: { x: number; y: number; h: number; fill: string }) {
  const w = h * 0.36;
  return (
    <Poke kind="sway">
      <path
        d={`M${x} ${y - h} L${x + w * 0.55} ${y - h * 0.62} H${x + w * 0.3} L${x + w} ${y - h * 0.22} H${x + w * 0.2} V${y} H${x - w * 0.2} V${y - h * 0.22} H${x - w} L${x - w * 0.3} ${y - h * 0.62} H${x - w * 0.55} Z`}
        fill={fill}
      />
    </Poke>
  );
}

/** A leafy tree between the clearing and the far forest. */
function MidTree({ x, y, size }: { x: number; y: number; size: number }) {
  const s = depthScale(y) * size;
  return (
    <Poke kind="sway">
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x="-9" y="-110" width="18" height="110" fill="#8b7765" />
        <circle cx="0" cy="-150" r="62" fill="#6fa57d" />
        <circle cx="-40" cy="-118" r="40" fill="#66997a" />
        <circle cx="42" cy="-122" r="42" fill="#66997a" />
        <circle cx="-14" cy="-176" r="26" fill="#8dbd96" opacity="0.7" />
      </g>
    </Poke>
  );
}

/** Edge of the brook at ground height y; side -1 is the left bank, 1 the right. */
const bank = (y: number, side: -1 | 1) => brookX(y) + side * brookHalf(y);

/** The brook as a band from the back to the bottom edge, sampled every few pixels so it winds smoothly. */
function brookPath(grow = 0) {
  const ys = Array.from({ length: 67 }, (_, i) => BROOK_TOP + ((1000 - BROOK_TOP) * i) / 66);
  const left = ys.map((y) => `${(bank(y, -1) - grow * depthScale(y)).toFixed(1)} ${y.toFixed(1)}`);
  const right = ys.map((y) => `${(bank(y, 1) + grow * depthScale(y)).toFixed(1)} ${y.toFixed(1)}`).reverse();
  return `M${left.join(" L")} L${right.join(" L")} Z`;
}

/** The forest path from the left edge to the right edge, sampled along x. */
function forestPath() {
  const xs = Array.from({ length: 41 }, (_, i) => i * 40);
  const top = xs.map((x) => `${x} ${(pathY(x) - pathHalf(x)).toFixed(1)}`);
  const bottom = xs.map((x) => `${x} ${(pathY(x) + pathHalf(x)).toFixed(1)}`).reverse();
  return `M${top.join(" L")} L${bottom.join(" L")} Z`;
}

/** Ripples: little white lines running along the brook. */
function Ripples() {
  const lines = [
    [440, 0.2],
    [520, -0.3],
    [660, 0.1],
    [720, -0.4],
    [840, 0.3],
    [930, -0.3],
    [960, 0.45],
  ].map(([y, off]) => {
    const s = depthScale(y);
    const x = brookX(y) + off * brookHalf(y);
    return `M${x - 18 * s} ${y} q${18 * s} ${-6 * s} ${36 * s} 0`;
  });
  return <path className="wd-ripples" d={lines.join(" ")} stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.6" fill="none" />;
}

/** The beaver's dam: a heap of sticks across the brook. */
function Dam() {
  const y = DAMM_Y;
  const s = depthScale(y);
  const [x1, x2] = [bank(y, -1) - 10 * s, bank(y, 1) + 10 * s];
  const sticks = Array.from({ length: 9 }, (_, i) => {
    const x = x1 + ((x2 - x1) * i) / 8;
    return `M${x - 20 * s} ${y + (i % 3) * 5 * s - 6 * s} L${x + 26 * s} ${y - (i % 2) * 8 * s - 12 * s}`;
  });
  return (
    <Poke kind="wobble">
      <path d={`M${x1} ${y + 6 * s} Q${(x1 + x2) / 2} ${y - 34 * s} ${x2} ${y + 6 * s} Z`} fill="#7f5539" />
      <path d={sticks.join(" ")} stroke="#9c6644" strokeWidth={8 * s} strokeLinecap="round" />
      <path d={`M${x1 + 10 * s} ${y - 6 * s} L${x2 - 4 * s} ${y - 18 * s}`} stroke="#b08968" strokeWidth={6 * s} strokeLinecap="round" />
      {/* A little waterfall over the dam */}
      <path
        d={`M${x1 + 30 * s} ${y + 8 * s} q4 ${10 * s} 0 ${18 * s} M${x2 - 34 * s} ${y + 8 * s} q4 ${10 * s} 0 ${18 * s}`}
        stroke="#fff"
        strokeWidth={4 * s}
        strokeLinecap="round"
        opacity="0.7"
        fill="none"
      />
    </Poke>
  );
}

/** Reeds with cattails at the brook, foot at (x, y). */
function Reeds({ x, y, flip = 1 }: { x: number; y: number; flip?: 1 | -1 }) {
  const s = depthScale(y);
  return (
    <Poke kind="sway">
      <g transform={`translate(${x} ${y}) scale(${s * flip} ${s})`}>
        <path
          d="M0 0 q-4 -50 -12 -86 M10 0 q2 -60 6 -104 M20 0 q8 -40 22 -66 M-8 0 q-12 -30 -26 -44"
          stroke="#40916c"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        <ellipse cx="-12" cy="-90" rx="5" ry="13" fill="#7f5539" />
        <ellipse cx="16" cy="-108" rx="5" ry="13" fill="#7f5539" />
      </g>
    </Poke>
  );
}

export function Background() {
  return (
    <>
      <defs>
        <linearGradient id="wd-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8ed1f5" />
          <stop offset="1" stopColor="#e8f7ff" />
        </linearGradient>
        <linearGradient id="wd-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8f7ff" stopOpacity="0" />
          <stop offset="1" stopColor="#e8f7ff" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="wd-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a7d08c" />
          <stop offset="0.5" stopColor="#8cc06f" />
          <stop offset="1" stopColor="#6aa956" />
        </linearGradient>
        <radialGradient id="wd-clearing" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#c7e6a4" stopOpacity="0.9" />
          <stop offset="1" stopColor="#c7e6a4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="wd-brook" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe6fb" />
          <stop offset="1" stopColor="#4ea8de" />
        </linearGradient>
        <linearGradient id="wd-path" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e3c79c" />
          <stop offset="1" stopColor="#cfa877" />
        </linearGradient>
        <linearGradient id="wd-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff6c2" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff6c2" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Sky and the far forest in the haze */}
      <rect width="1600" height={HORIZON + 30} fill="url(#wd-sky)" />
      <Cloud x={160} y={110} scale={0.32} className="wd-cloud wd-cloud-slow" />
      <Cloud x={1080} y={150} scale={0.36} className="wd-cloud" />
      <path d="M760 130 q6 -6 12 0 q6 -6 12 0 M800 116 q5 -5 10 0 q5 -5 10 0" stroke="#5c677d" strokeWidth="2.5" fill="none" />
      <path d="M0 300 Q300 270 640 292 T1260 280 T1600 296 V360 H0 Z" fill="#b9d8c4" />
      {FAR_FIRS.map(([x, h]) => (
        <Fir key={x} x={x} y={HORIZON + 4} h={h} fill="#a7cbb4" />
      ))}
      {NEAR_FIRS.map(([x, h]) => (
        <Fir key={x} x={x} y={HORIZON + 22} h={h} fill="#86b496" />
      ))}
      <rect y="240" width="1600" height="120" fill="url(#wd-haze)" />

      {/* Forest floor with the light clearing in the middle */}
      <rect y={HORIZON + 18} width="1600" height={1000 - HORIZON - 18} fill="url(#wd-floor)" />
      <ellipse cx="820" cy="620" rx="760" ry="300" fill="url(#wd-clearing)" />
      <path d="M0 350 Q400 340 800 352 T1600 346 V380 H0 Z" fill="#9cc98a" opacity="0.7" />
      {MID_TREES.map(([x, y, size]) => (
        <MidTree key={x} x={x} y={y} size={size} />
      ))}

      {/* Sunbeams falling through the trees */}
      <g className="wd-beams" fill="url(#wd-beam)">
        <path d="M1180 0 H1260 L1020 640 H900 Z" />
        <path d="M1340 0 H1390 L1240 560 H1160 Z" />
        <path d="M980 0 H1020 L700 600 H630 Z" opacity="0.7" />
      </g>

      {/* Moss patches and roots */}
      <g fill="#7cb862" opacity="0.7">
        <ellipse cx="240" cy="660" rx="90" ry="20" />
        <ellipse cx="620" cy="540" rx="80" ry="14" />
        <ellipse cx="1000" cy="900" rx="120" ry="26" />
        <ellipse cx="160" cy="930" rx="130" ry="30" />
      </g>

      {/* The brook with its banks, stones, ripples and the beaver's dam */}
      <path d={brookPath(14)} fill="#7a9a52" opacity="0.6" />
      <path d={brookPath()} fill="url(#wd-brook)" />
      <Ripples />
      {STONES.map(([y, off, size]) => {
        const s = depthScale(y) * size;
        const x = brookX(y) + off * brookHalf(y);
        return (
          <Poke key={y} kind="hop">
            <ellipse cx={x} cy={y} rx={20 * s} ry={11 * s} fill="#adb5bd" />
            <ellipse cx={x - 4 * s} cy={y - 4 * s} rx={10 * s} ry={4 * s} fill="#fff" opacity="0.45" />
            <path d={`M${x - 24 * s} ${y + 6 * s} q${24 * s} ${8 * s} ${48 * s} 0`} stroke="#fff" strokeWidth={3 * s} opacity="0.6" fill="none" />
          </Poke>
        );
      })}
      <Dam />
      <Reeds x={bank(880, 1) + 10} y={880} />
      <Reeds x={bank(990, 1) + 20} y={992} flip={-1} />
      <Reeds x={bank(640, -1) - 6} y={640} flip={-1} />

      {/* The forest path; the bridge covers it where it crosses the brook */}
      <path d={forestPath()} fill="url(#wd-path)" />
      <path
        d={Array.from({ length: 41 }, (_, i) => `${i ? "L" : "M"}${i * 40} ${(pathY(i * 40) + pathHalf(i * 40) * 0.45).toFixed(1)}`).join(" ")}
        stroke="#c49a63"
        strokeWidth="5"
        strokeDasharray="22 16"
        fill="none"
      />
      <g fill="#b8956a">
        {PEBBLES.map((x) => {
          const y = pathY(x) - pathHalf(x) * 0.2;
          const s = depthScale(y);
          return (
            <Poke key={x} kind="hop">
              <ellipse cx={x} cy={y} rx={7 * s} ry={4 * s} />
            </Poke>
          );
        })}
      </g>
      {/* Brook water shows under the bridge */}
      <path d={brookPath()} fill="url(#wd-brook)" clipPath="url(#wd-under-bridge)" />
      <clipPath id="wd-under-bridge">
        <rect x={brookX(BRIDGE_Y) - 200} y={BRIDGE_Y - 60} width="400" height="120" />
      </clipPath>

      {/* Grass, flowers, leaves and little mushrooms */}
      <g stroke="#52a35f" strokeWidth="5" strokeLinecap="round" fill="none">
        {TUFTS.map(([x, y]) => (
          <Poke key={`${x}-${y}`} kind="sway">
            <path d="M0 0 q4 -24 12 -30 M10 0 q0 -26 -6 -36 M20 0 q2 -20 12 -26" transform={`translate(${x} ${y}) scale(${depthScale(y)})`} />
          </Poke>
        ))}
      </g>
      {LEAVES.map(([x, y, colour, angle]) => (
        <Poke key={`${x}-${y}`} kind="hop">
          <g transform={`translate(${x} ${y}) scale(${depthScale(y)}) rotate(${angle})`}>
            <path d="M-14 0 Q0 -10 14 0 Q0 10 -14 0 Z" fill={colour} />
            <path d="M-12 0 H12" stroke="#bc6c25" strokeWidth="1.5" />
          </g>
        </Poke>
      ))}
      {ANEMONES.map(([x, y]) => (
        <Poke key={`${x}-${y}`} kind="sway">
          <g transform={`translate(${x} ${y}) scale(${depthScale(y)})`}>
            <path d="M0 0 V-12" stroke="#52a35f" strokeWidth="3" />
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx="0" cy="-19" rx="4" ry="6" fill="#fff" transform={`rotate(${a} 0 -13)`} />
            ))}
            <circle cy="-13" r="3" fill="#ffd60a" />
          </g>
        </Poke>
      ))}
      {SMALL_MUSHROOMS.map(([x, y]) => (
        <Poke key={`${x}-${y}`} kind="wobble">
          <g transform={`translate(${x} ${y}) scale(${depthScale(y)})`}>
            <rect x="-4" y="-14" width="8" height="14" rx="3" fill="#f8f1e5" />
            <path d="M-13 -12 Q0 -30 13 -12 Z" fill="#b5651d" />
            <rect x="12" y="-10" width="6" height="10" rx="3" fill="#f8f1e5" />
            <path d="M8 -8 Q15 -20 22 -8 Z" fill="#c68642" />
          </g>
        </Poke>
      ))}
    </>
  );
}
