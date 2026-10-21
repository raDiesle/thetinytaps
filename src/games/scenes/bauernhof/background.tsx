import { HORIZON, depthScale, towardsHorizon, transformOf } from "../layout";
import { Cloud } from "../shared";
import { FENCE, FENCE_END, FIELD_X, MUD, POND, ROAD_BOTTOM, ROAD_TOP, SUNFLOWER } from "./layout";

// Far away soft hills and woods fade into the haze; then the wheat field with the
// windmill hill, the farmyard, the pasture fence, the meadow, the dirt road and the
// front meadow with the mud puddle and the pond. Fence posts, pebbles, flowers and
// tufts grow towards the front; furrows and wheel tracks run towards the back.

// Little round trees on the far hills: [x, y, scale].
const WOODS = [
  [430, 318, 0.32],
  [470, 314, 0.38],
  [512, 320, 0.3],
  [900, 312, 0.34],
  [940, 318, 0.3],
  [1020, 310, 0.4],
  [1062, 316, 0.32],
];

const TUFTS = [
  [40, 640],
  [660, 600],
  [1010, 640],
  [1590, 670],
  [470, 860],
  [1060, 820],
  [20, 880],
  [790, 990],
  [1290, 990],
  [900, 940],
  [1180, 860],
];

const FLOWERS = [
  [520, 820, "#ff7bd0"],
  [1010, 880, "#ffd60a"],
  [60, 820, "#fff"],
  [740, 860, "#fff"],
  [1600, 700, "#ff7bd0"],
  [960, 990, "#8e7dff"],
  [80, 650, "#ffd60a"],
  [780, 640, "#fff"],
  [1250, 650, "#ff7bd0"],
] as const;

const PEBBLES = Array.from({ length: 40 }, (_, i) => [(i * 97 + 30) % 1600, ROAD_TOP + 12 + ((i * 41) % (ROAD_BOTTOM - ROAD_TOP - 18))]);

function RoundTree({ x, y, scale, light = false }: { x: number; y: number; scale: number; light?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-6" y="-50" width="12" height="50" fill={light ? "#b7a48b" : "#8d5a2b"} />
      <circle cx="0" cy="-64" r="36" fill={light ? "#a8d5ba" : "#52b788"} />
      <circle cx="-20" cy="-48" r="22" fill={light ? "#95c8a8" : "#40916c"} />
      <circle cx="22" cy="-50" r="24" fill={light ? "#95c8a8" : "#40916c"} />
    </g>
  );
}

/** Golden wheat field far back right, with furrows running towards the horizon. */
function Field() {
  const top = HORIZON + 6;
  const bottom = 486;
  const furrows = Array.from({ length: 16 }, (_, i) => {
    const x = FIELD_X + 30 + i * 46;
    return `M${x} ${bottom} L${towardsHorizon(x, bottom, top)} ${top}`;
  });
  return (
    <g>
      <path d={`M${FIELD_X} ${bottom} L${towardsHorizon(FIELD_X, bottom, top)} ${top} H1600 V${bottom} Z`} fill="url(#bh-field)" />
      <path d={furrows.join(" ")} stroke="#e9b949" strokeWidth="3" />
      {/* Already harvested strip behind the combine */}
      <path d={`M1340 ${bottom} L${towardsHorizon(1340, bottom, top)} ${top} H${towardsHorizon(1430, bottom, top)} L1430 ${bottom} Z`} fill="#e6cf8f" opacity="0.8" />
    </g>
  );
}

function Silo() {
  return (
    <g>
      <rect x="54" y="208" width="72" height="262" fill="#a9c1d9" />
      <rect x="104" y="208" width="22" height="262" fill="#8faecb" />
      <path d="M54 210 Q90 160 126 210 Z" fill="#8d99ae" />
      <path d={Array.from({ length: 9 }, (_, i) => `M54 ${240 + i * 26} H126`).join(" ")} stroke="#8faecb" strokeWidth="3" />
      <path d="M72 230 V460" stroke="#fff" strokeOpacity="0.35" strokeWidth="6" />
    </g>
  );
}

/** The pasture fence: posts and two rails, ending at the cock's post. */
function Fence() {
  const s = depthScale(FENCE) * 1.1;
  const posts = Array.from({ length: 12 }, (_, i) => -10 + i * 58).filter((x) => x < FENCE_END - 20);
  return (
    <g>
      <path d={`M-10 ${FENCE - 70 * s} H${FENCE_END} M-10 ${FENCE - 34 * s} H${FENCE_END}`} stroke="#a47148" strokeWidth={9 * s} />
      {posts.map((x) => (
        <g key={x}>
          <rect x={x - 11 * s} y={FENCE - 96 * s} width={22 * s} height={96 * s} fill="#8d5a2b" />
          <rect x={x - 13 * s} y={FENCE - 100 * s} width={26 * s} height={8 * s} rx="2" fill="#7f5539" />
        </g>
      ))}
    </g>
  );
}

/** The dirt road with two wheel tracks and grass in the middle. */
function Road() {
  return (
    <g>
      <rect y={ROAD_TOP} width="1600" height={ROAD_BOTTOM - ROAD_TOP} fill="url(#bh-road)" />
      <path d={`M0 ${ROAD_TOP + 22} H1600`} stroke="#c08552" strokeWidth="10" opacity="0.5" />
      <path d={`M0 ${ROAD_BOTTOM - 22} H1600`} stroke="#c08552" strokeWidth="14" opacity="0.5" />
      <path d={`M0 ${(ROAD_TOP + ROAD_BOTTOM) / 2} H1600`} stroke="#95d5b2" strokeWidth="8" strokeDasharray="30 22" opacity="0.8" />
      <g fill="#b08968">
        {PEBBLES.map(([x, y]) => (
          <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={4 * depthScale(y)} ry={2.5 * depthScale(y)} />
        ))}
      </g>
      <path d={`M0 ${ROAD_TOP} H1600`} stroke="#74c69d" strokeWidth="6" />
      <path d={`M0 ${ROAD_BOTTOM} H1600`} stroke="#52b788" strokeWidth="8" />
    </g>
  );
}

/** The path from the farmyard down to the road; its edges run towards the vanishing point. */
function Path() {
  const [l, r] = [612, 820];
  const top = 486;
  return <path d={`M${towardsHorizon(l, ROAD_TOP, top)} ${top} L${l} ${ROAD_TOP} H${r} L${towardsHorizon(r, ROAD_TOP, top)} ${top} Z`} fill="#e3c08d" />;
}

function Mud() {
  const [cx, cy, rx, ry] = MUD;
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#9c6644" />
      <ellipse cx={cx - 10} cy={cy - 4} rx={rx * 0.8} ry={ry * 0.66} fill="#7f5539" />
      <ellipse cx={cx - 60} cy={cy - 12} rx="30" ry="6" fill="#b08968" opacity="0.6" />
      <circle cx={cx + rx + 10} cy={cy - 10} r="7" fill="#9c6644" />
      <circle cx={cx - rx - 6} cy={cy + 8} r="9" fill="#9c6644" />
    </g>
  );
}

function Pond() {
  const [cx, cy, rx, ry] = POND;
  const pads = [
    [cx - 120, cy + 6],
    [cx - 40, cy + 28],
    [cx + 140, cy - 10],
  ];
  return (
    <g>
      <ellipse cx={cx} cy={cy + 4} rx={rx + 14} ry={ry + 8} fill="#95d5b2" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#bh-pond)" />
      <path d={`M${cx - 150} ${cy - 20} h60 M${cx + 30} ${cy - 30} h50 M${cx - 80} ${cy + 20} h40`} stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      {pads.map(([x, y]) => (
        <g key={x} transform={`translate(${x} ${y}) scale(${depthScale(y)})`}>
          <path d="M-26 0 A26 8 0 1 0 0 -8 L-2 0 Z" fill="#52b788" />
        </g>
      ))}
      <g transform={`translate(${cx - 110} ${cy + 2}) scale(${depthScale(cy)})`}>
        <circle cx="0" cy="-8" r="7" fill="#fff" />
        <circle cx="0" cy="-8" r="3" fill="#ffd60a" />
      </g>
      {/* Reeds on the left bank */}
      <g transform={`translate(${cx - rx + 6} ${cy - 6}) scale(${depthScale(cy)})`}>
        <path d="M-8 0 Q-12 -60 -20 -110 M0 0 V-120 M8 0 Q14 -50 24 -96 M-16 0 Q-26 -30 -40 -60" stroke="#40916c" strokeWidth="5" fill="none" strokeLinecap="round" />
        <rect x="-4" y="-130" width="8" height="26" rx="4" fill="#7f5539" />
        <rect x="-24" y="-118" width="8" height="24" rx="4" fill="#7f5539" />
      </g>
    </g>
  );
}

function Sunflower() {
  return (
    <g transform={transformOf(SUNFLOWER)}>
      <path d="M0 0 Q-6 -100 0 -190" stroke="#40916c" strokeWidth="8" fill="none" />
      <path d="M-2 -70 Q-30 -90 -46 -76 Q-26 -60 -2 -70 Z M0 -120 Q30 -140 44 -124 Q24 -108 0 -120 Z" fill="#52b788" />
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse key={i} cx="0" cy="-226" rx="9" ry="20" fill="#ffd60a" transform={`rotate(${i * 30} 0 -200)`} />
      ))}
      <circle cx="0" cy="-200" r="18" fill="#7f5539" />
      <circle cx="-5" cy="-205" r="5" fill="#9c6644" />
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
          <stop offset="0" stopColor="#b7e4c7" />
          <stop offset="0.4" stopColor="#95d5b2" />
          <stop offset="1" stopColor="#74c69d" />
        </linearGradient>
        <linearGradient id="bh-field" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbe7a6" />
          <stop offset="1" stopColor="#f4d06f" />
        </linearGradient>
        <linearGradient id="bh-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e3c08d" />
          <stop offset="1" stopColor="#d4a373" />
        </linearGradient>
        <radialGradient id="bh-pond">
          <stop offset="0" stopColor="#a5d8ff" />
          <stop offset="1" stopColor="#4dabf7" />
        </radialGradient>
        <radialGradient id="bh-sunglow">
          <stop offset="0" stopColor="#fff3b0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff3b0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height={HORIZON + 20} fill="url(#bh-sky)" />
      <circle cx="1300" cy="80" r="140" fill="url(#bh-sunglow)" />
      <Cloud x={320} y={200} scale={0.32} className="bh-cloud bh-cloud-slow" />
      <Cloud x={1000} y={170} scale={0.42} className="bh-cloud" />
      <path d="M700 190 q6 -6 12 0 q6 -6 12 0 M736 176 q5 -5 10 0 q5 -5 10 0" stroke="#5c677d" strokeWidth="2.5" fill="none" />

      {/* Far hills and woods in the haze */}
      <path d="M0 312 Q200 262 420 300 T860 290 T1300 296 T1600 280 V360 H0 Z" fill="#c5e3cf" />
      <path d="M0 330 Q260 300 560 324 T1100 318 T1600 322 V360 H0 Z" fill="#b2dbbf" />
      {WOODS.map(([x, y, s]) => (
        <RoundTree key={x} x={x} y={y} scale={s} light />
      ))}
      <rect y="250" width="1600" height="100" fill="url(#bh-haze)" />

      <rect y={HORIZON} width="1600" height={1000 - HORIZON} fill="url(#bh-meadow)" />
      {/* Patchwork fields far back left */}
      <path d={`M0 ${HORIZON + 4} H420 L400 360 H0 Z`} fill="#d8f3dc" />
      <path d="M0 360 H400 L380 392 H0 Z" fill="#f1e4b3" opacity="0.8" />
      <Field />
      {/* The windmill's hill */}
      <path d="M1240 488 Q1360 410 1470 418 Q1560 424 1600 436 V488 Z" fill="#95d5b2" />
      <path d="M1300 470 Q1380 430 1470 430" stroke="#b7e4c7" strokeWidth="6" fill="none" strokeLinecap="round" />
      <RoundTree x={1580} y={436} scale={0.5} />
      <Silo />
      {/* Farmyard in front of the barn and the farmhouse */}
      <path d="M90 470 Q120 450 300 452 H860 Q920 456 930 480 Q900 510 620 512 H200 Q110 508 90 470 Z" fill="#e3c08d" />
      <Path />
      <Fence />
      <Road />
      <Mud />
      <Pond />
      <Sunflower />

      {/* Flowers and grass tufts */}
      {FLOWERS.map(([x, y, color]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${depthScale(y)})`}>
          <path d="M0 0 V-22" stroke="#40916c" strokeWidth="3" />
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={a} cx="0" cy="-30" r="5" fill={color} transform={`rotate(${a} 0 -24)`} />
          ))}
          <circle cx="0" cy="-24" r="4" fill="#ffb703" />
        </g>
      ))}
      <g stroke="#40916c" strokeWidth="5" strokeLinecap="round" fill="none">
        {TUFTS.map(([x, y]) => (
          <path key={`${x}-${y}`} d="M0 0 q4 -24 12 -30 M10 0 q0 -26 -6 -36 M20 0 q2 -20 12 -26" transform={`translate(${x} ${y}) scale(${depthScale(y)})`} />
        ))}
      </g>
    </>
  );
}
