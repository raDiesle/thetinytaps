import { HORIZON, depthScale, towardsHorizon, transformOf } from "../layout";
import { Cloud } from "../shared";
import {
  ACACIA,
  BACK_FENCE,
  ELEPHANT_POOL,
  EUCALYPTUS,
  FLAMINGO_POND,
  FLOWERS,
  ICE_ROCK,
  LION_ROCK,
  MONKEY_TREE,
  PATH_BOTTOM,
  PATH_TOP,
  PENGUIN_POOL,
  RIVER_TOP,
  RIVER_X,
  WALL,
} from "./layout";

// Far away soft hills and the glass dome of the tropical house fade into the haze; then the
// savanna and the elephants' sand behind a wooden fence, the monkey tree, the stone wall
// behind the middle enclosures, the paved zoo path and at the front the penguin pool and the
// hippo river. Posts, stones, flowers and tufts grow towards the front; path joints run
// towards the back.

// Little round trees on the far hills: [x, y, scale].
const WOODS = [
  [300, 318, 0.32],
  [340, 314, 0.38],
  [1180, 316, 0.34],
  [1220, 312, 0.4],
  [1262, 318, 0.3],
  [1500, 314, 0.36],
];

const TUFTS = [
  [620, 660],
  [1010, 670],
  [1600, 690],
  [640, 880],
  [990, 840],
  [560, 990],
  [20, 650],
  [1180, 560],
  [700, 540],
];

const FLOWER_DOTS = [
  [600, 846, "#ff7bd0"],
  [1170, 672, "#ffd60a"],
  [380, 664, "#fff"],
  [980, 664, "#ff7bd0"],
  [540, 860, "#fff"],
  [1120, 556, "#ffd60a"],
] as const;

/** Flagstones of the zoo path: rows of joints across, joints along it run towards the back. */
const PATH_ROWS = [PATH_TOP + 26, PATH_TOP + 58, PATH_TOP + 94];
const PATH_JOINTS = Array.from({ length: 22 }, (_, i) => -260 + i * 100);

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

/** The glass dome of the tropical house, far away in the haze. */
function Dome() {
  return (
    <g opacity="0.75">
      <path d="M600 330 Q600 238 700 238 Q800 238 800 330 Z" fill="#cfe8f3" />
      <path d="M700 238 V330 M650 250 Q640 290 640 330 M750 250 Q760 290 760 330 M612 290 H788" stroke="#a9cbdc" strokeWidth="3" fill="none" />
      <path d="M626 300 Q630 262 664 248" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.7" />
      <rect x="690" y="222" width="20" height="18" rx="4" fill="#a9cbdc" />
      <path d="M700 222 V200" stroke="#a9cbdc" strokeWidth="3" />
      <path d="M700 200 l18 6 l-18 6 Z" fill="#ffadad" />
    </g>
  );
}

/** The wooden fence behind the savanna and the elephants. */
function BackFence() {
  const s = depthScale(BACK_FENCE) * 1.1;
  const posts = Array.from({ length: 21 }, (_, i) => -10 + i * 56);
  return (
    <g>
      <path d={`M-10 ${BACK_FENCE - 64 * s} H1150 M-10 ${BACK_FENCE - 30 * s} H1150`} stroke="#b08968" strokeWidth={9 * s} />
      {posts.map((x) => (
        <g key={x}>
          <rect x={x - 9 * s} y={BACK_FENCE - 88 * s} width={18 * s} height={88 * s} fill="#9c6644" />
          <path d={`M${x - 9 * s} ${BACK_FENCE - 88 * s} l${9 * s} ${-8 * s} l${9 * s} ${8 * s} Z`} fill="#7f5539" />
        </g>
      ))}
    </g>
  );
}

function Acacia() {
  return (
    <g transform={transformOf(ACACIA)}>
      <path d="M-8 0 Q-4 -150 -20 -250 M-4 -170 Q30 -230 80 -280 M-14 -220 Q-60 -260 -90 -290" stroke="#8d5a2b" strokeWidth="16" strokeLinecap="round" fill="none" />
      <path d="M-14 0 Q-10 -120 -14 -200 L4 -200 Q8 -120 12 0 Z" fill="#8d5a2b" />
      <ellipse cx="20" cy="-312" rx="150" ry="34" fill="#74a957" />
      <ellipse cx="-70" cy="-300" rx="70" ry="24" fill="#6a994e" />
      <ellipse cx="96" cy="-296" rx="80" ry="22" fill="#6a994e" />
      <ellipse cx="0" cy="-332" rx="96" ry="18" fill="#90be6d" />
      <ellipse cx="-40" cy="-336" rx="40" ry="8" fill="#fff" opacity="0.2" />
    </g>
  );
}

/** The elephants' sandy ground with rocks and their pool. */
function ElephantYard() {
  const [cx, cy, rx, ry] = ELEPHANT_POOL;
  return (
    <g>
      <path d="M640 520 Q650 430 720 412 H1130 Q1150 470 1120 528 Z" fill="#e3cfae" />
      <path d="M690 430 Q720 380 780 396 Q800 420 770 432 Z" fill="#b8a88f" />
      <path d="M1060 418 Q1086 370 1130 392 V430 Z" fill="#a9998a" />
      <path d="M1074 404 Q1090 386 1112 392" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.4" />
      <ellipse cx={cx} cy={cy + 3} rx={rx + 10} ry={ry + 5} fill="#c9b18e" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#zo-water)" />
      <path d={`M${cx - 50} ${cy - 4} h34 M${cx + 10} ${cy + 6} h30`} stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
    </g>
  );
}

function MonkeyTree() {
  return (
    <g transform={transformOf(MONKEY_TREE)}>
      <circle cx="-30" cy="-420" r="80" fill="#40916c" />
      <circle cx="70" cy="-440" r="74" fill="#52b788" />
      <circle cx="-150" cy="-380" r="56" fill="#52b788" />
      <path d="M-18 0 Q-12 -180 -22 -340 L24 -340 Q16 -180 22 0 Z" fill="#7f5539" />
      <path d="M-10 -300 Q-90 -330 -200 -318" stroke="#7f5539" strokeWidth="20" strokeLinecap="round" fill="none" />
      <path d="M14 -340 Q70 -366 140 -366" stroke="#7f5539" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M-6 -60 Q0 -160 -8 -300" stroke="#9c6644" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.6" />
      <circle cx="40" cy="-470" r="40" fill="#74c69d" />
      <circle cx="-80" cy="-450" r="30" fill="#74c69d" />
      {/* The little monkey's platform */}
      <rect x="10" y="-168" width="170" height="16" rx="5" fill="#b08968" />
      <path d="M40 -152 L70 -20 M160 -152 L140 -20" stroke="#9c6644" strokeWidth="10" strokeLinecap="round" />
      <rect x="130" y="-152" width="12" height="152" fill="#9c6644" />
      {/* A climbing net between trunk and platform post */}
      <path d="M22 -140 L136 -20 M22 -100 L136 -60 M22 -60 L100 -20 M60 -150 L22 -110 M100 -150 L22 -70 M136 -140 L22 -30" stroke="#d4a373" strokeWidth="4" />
    </g>
  );
}

/** A low wall of round stones behind the middle enclosures. */
function Wall() {
  const s = depthScale(WALL);
  const stones = Array.from({ length: 34 }, (_, i) => i * 50 + (i % 2) * 10);
  return (
    <g>
      <rect y={WALL - 40 * s} width="1600" height={40 * s} fill="#ced4da" />
      {stones.map((x) => (
        <ellipse key={x} cx={x} cy={WALL - 30 * s} rx={26 * s} ry={13 * s} fill="#adb5bd" />
      ))}
      {stones.map((x) => (
        <ellipse key={x} cx={x + 25} cy={WALL - 10 * s} rx={26 * s} ry={12 * s} fill="#b8c0c8" />
      ))}
      <path d={`M0 ${WALL - 40 * s} H1600`} stroke="#e9ecef" strokeWidth={6 * s} />
    </g>
  );
}

function Bamboo() {
  const stalks = [
    [30, 650, 1.1],
    [70, 640, 1],
    [250, 646, 0.95],
    [290, 652, 1.05],
  ];
  return (
    <g>
      {stalks.map(([x, y, h]) => {
        const s = depthScale(y);
        return (
          <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
            <rect x="-7" y={-260 * h} width="14" height={260 * h} rx="6" fill="#95d5b2" />
            {[0.25, 0.5, 0.75].map((t) => (
              <rect key={t} x="-9" y={-260 * h * t - 3} width="18" height="6" rx="3" fill="#74c69d" />
            ))}
            <path d={`M0 ${-200 * h} q30 -10 46 -30 q-30 0 -46 30 M0 ${-120 * h} q-30 -8 -44 -28 q28 2 44 28`} fill="#52b788" />
          </g>
        );
      })}
    </g>
  );
}

function LionRock() {
  return (
    <g transform={transformOf(LION_ROCK)}>
      <path d="M-200 0 Q-210 -70 -150 -100 Q-80 -132 20 -126 Q130 -120 170 -70 Q196 -30 190 0 Z" fill="#c8a27a" />
      <path d="M-150 -98 Q-80 -126 20 -120 Q110 -116 150 -84" stroke="#e6ccb2" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M-200 0 Q-190 -30 -120 -40 Q0 -50 190 0 Z" fill="#a47148" opacity="0.6" />
      <path d="M-70 -70 q20 -10 40 0 M60 -60 q16 -8 30 2" stroke="#9c6644" strokeWidth="5" strokeLinecap="round" fill="none" />
    </g>
  );
}

function Eucalyptus() {
  return (
    <g transform={transformOf(EUCALYPTUS)}>
      <path d="M-12 0 Q-6 -120 -14 -190 L14 -190 Q10 -120 14 0 Z" fill="#d6ccc2" />
      <path d="M-10 -180 Q-50 -230 -70 -280 M8 -186 Q40 -240 60 -300" stroke="#d6ccc2" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M-4 -20 V-170" stroke="#b5a99a" strokeWidth="4" opacity="0.6" />
      <ellipse cx="-74" cy="-300" rx="54" ry="34" fill="#84a98c" />
      <ellipse cx="64" cy="-320" rx="60" ry="36" fill="#84a98c" />
      <ellipse cx="-6" cy="-340" rx="56" ry="30" fill="#95b8a0" />
      <ellipse cx="-100" cy="-260" rx="30" ry="18" fill="#6b9080" />
      <ellipse cx="104" cy="-290" rx="30" ry="18" fill="#6b9080" />
    </g>
  );
}

function FlamingoPond() {
  const [cx, cy, rx, ry] = FLAMINGO_POND;
  return (
    <g>
      <ellipse cx={cx} cy={cy + 4} rx={rx + 12} ry={ry + 6} fill="#95d5b2" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#zo-water)" />
      <path d={`M${cx - 70} ${cy - 6} h40 M${cx + 30} ${cy + 8} h36`} stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      <g transform={`translate(${cx + rx - 8} ${cy - 4}) scale(${depthScale(cy)})`}>
        <path d="M-6 0 Q-10 -50 -18 -90 M2 0 V-100 M10 0 Q16 -44 26 -80" stroke="#40916c" strokeWidth="5" fill="none" strokeLinecap="round" />
        <rect x="-2" y="-112" width="8" height="24" rx="4" fill="#7f5539" />
      </g>
    </g>
  );
}

/** The paved zoo path, with a sign post and two benches. */
function Path() {
  const s = depthScale(PATH_TOP);
  return (
    <g>
      <rect y={PATH_TOP} width="1600" height={PATH_BOTTOM - PATH_TOP} fill="url(#zo-path)" />
      <path d={PATH_ROWS.map((y) => `M0 ${y} H1600`).join(" ")} stroke="#d9c39a" strokeWidth="3" />
      <path
        d={PATH_JOINTS.map((x) => `M${x} ${PATH_BOTTOM} L${towardsHorizon(x, PATH_BOTTOM, PATH_TOP)} ${PATH_TOP}`).join(" ")}
        stroke="#d9c39a"
        strokeWidth="3"
      />
      <path d={`M0 ${PATH_TOP} H1600`} stroke="#b5a48c" strokeWidth="6" />
      <path d={`M0 ${PATH_BOTTOM} H1600`} stroke="#b5a48c" strokeWidth="9" />
      {/* Sign post with arrows to the animals */}
      <g transform={`translate(600 ${PATH_TOP - 2}) scale(${s})`}>
        <rect x="-5" y="-150" width="10" height="150" fill="#7f5539" />
        <path d="M-6 -146 H60 L76 -132 L60 -118 H-6 Z" fill="#f4a261" />
        <path d="M6 -108 H-60 L-76 -94 L-60 -80 H6 Z" fill="#90be6d" />
        <circle cx="34" cy="-132" r="8" fill="#fff" />
        <circle cx="-36" cy="-94" r="8" fill="#fff" />
      </g>
      {[1530, 820].map((x) => (
        <g key={x} transform={`translate(${x} ${PATH_TOP + 4}) scale(${s})`}>
          <rect x="-60" y="-52" width="120" height="12" rx="4" fill="#bc6c25" />
          <rect x="-60" y="-36" width="120" height="12" rx="4" fill="#dda15e" />
          <rect x="-50" y="-24" width="10" height="24" fill="#6c757d" />
          <rect x="40" y="-24" width="10" height="24" fill="#6c757d" />
        </g>
      ))}
    </g>
  );
}

function PenguinPool() {
  const [cx, cy, rx, ry] = PENGUIN_POOL;
  return (
    <g>
      <ellipse cx={cx} cy={cy + 6} rx={rx + 22} ry={ry + 16} fill="#e9f5fb" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#zo-pool)" />
      <path d={`M${cx - 180} ${cy - 20} h60 M${cx + 40} ${cy - 34} h70 M${cx - 40} ${cy + 22} h50`} stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      {/* Ice floe */}
      <path d={`M${cx + 110} ${cy + 20} l30 -14 h60 l20 14 Z`} fill="#fff" />
    </g>
  );
}

function IceRock() {
  return (
    <g transform={transformOf(ICE_ROCK)}>
      <path d="M-110 0 L-100 -150 L-60 -210 L10 -226 L70 -200 L96 -120 L104 0 Z" fill="#e9f5fb" />
      <path d="M-100 -150 L-60 -210 L10 -226 L-20 -150 Z" fill="#fff" />
      <path d="M70 -200 L96 -120 L104 0 L60 0 Z" fill="#c5e3f0" />
      {/* The slide from the top of the rock down into the pool */}
      <path d="M40 -206 Q110 -180 160 -90 Q190 -30 250 10" stroke="#4dabf7" strokeWidth="26" strokeLinecap="round" fill="none" />
      <path d="M40 -214 Q112 -188 166 -96 Q196 -36 256 2" stroke="#a5d8ff" strokeWidth="8" strokeLinecap="round" fill="none" />
    </g>
  );
}

/** The hippo river at the front right, with reeds on the bank. */
function River() {
  return (
    <g>
      <path d={`M${RIVER_X} 1000 Q${RIVER_X - 70} 940 ${RIVER_X + 30} ${RIVER_TOP + 10} Q${RIVER_X + 80} ${RIVER_TOP - 12} 1200 ${RIVER_TOP - 6} H1600 V1000 Z`} fill="#c9b18e" />
      <path d={`M${RIVER_X + 26} 1000 Q${RIVER_X - 40} 946 ${RIVER_X + 50} ${RIVER_TOP + 20} Q${RIVER_X + 90} ${RIVER_TOP + 2} 1200 ${RIVER_TOP + 6} H1600 V1000 Z`} fill="url(#zo-river)" />
      <path d="M1120 930 h70 M1400 960 h80 M1180 990 h60 M1460 900 h40" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <g transform={`translate(1590 ${RIVER_TOP + 10}) scale(${depthScale(RIVER_TOP)})`}>
        <path d="M-8 0 Q-12 -60 -20 -110 M0 0 V-120 M8 0 Q14 -50 24 -96" stroke="#40916c" strokeWidth="5" fill="none" strokeLinecap="round" />
        <rect x="-4" y="-130" width="8" height="26" rx="4" fill="#7f5539" />
      </g>
    </g>
  );
}

function Flowers() {
  return (
    <g transform={transformOf(FLOWERS)}>
      {[
        [-40, 0, "#ff7bd0"],
        [0, 6, "#ffd60a"],
        [40, -2, "#8e7dff"],
        [-14, 10, "#fff"],
      ].map(([x, y, color]) => (
        <g key={`${x}`} transform={`translate(${x} ${y})`}>
          <path d="M0 0 V-40" stroke="#40916c" strokeWidth="4" />
          <path d="M0 -16 q-14 -4 -18 -16 q14 2 18 16" fill="#52b788" />
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={a} cx="0" cy="-52" r="8" fill={color as string} transform={`rotate(${a} 0 -44)`} />
          ))}
          <circle cx="0" cy="-44" r="6" fill="#ffb703" />
        </g>
      ))}
    </g>
  );
}

export function Background() {
  return (
    <>
      <defs>
        <linearGradient id="zo-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7cc8fb" />
          <stop offset="1" stopColor="#e3f4ff" />
        </linearGradient>
        <linearGradient id="zo-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e3f4ff" stopOpacity="0" />
          <stop offset="1" stopColor="#e3f4ff" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="zo-meadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b7e4c7" />
          <stop offset="0.4" stopColor="#95d5b2" />
          <stop offset="1" stopColor="#74c69d" />
        </linearGradient>
        <linearGradient id="zo-savanna" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8e7b0" />
          <stop offset="1" stopColor="#ecd082" />
        </linearGradient>
        <linearGradient id="zo-path" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6ead0" />
          <stop offset="1" stopColor="#eddcb6" />
        </linearGradient>
        <radialGradient id="zo-water">
          <stop offset="0" stopColor="#a5d8ff" />
          <stop offset="1" stopColor="#4dabf7" />
        </radialGradient>
        <radialGradient id="zo-pool">
          <stop offset="0" stopColor="#c5f0ff" />
          <stop offset="1" stopColor="#48b5e0" />
        </radialGradient>
        <linearGradient id="zo-river" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fd0c8" />
          <stop offset="1" stopColor="#3fa3a0" />
        </linearGradient>
        <radialGradient id="zo-sunglow">
          <stop offset="0" stopColor="#fff3b0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff3b0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height={HORIZON + 20} fill="url(#zo-sky)" />
      <circle cx="1530" cy="74" r="140" fill="url(#zo-sunglow)" />
      <Cloud x={980} y={190} scale={0.36} className="zo-cloud zo-cloud-slow" />
      <Cloud x={360} y={160} scale={0.3} className="zo-cloud" />
      <path d="M1040 120 q6 -6 12 0 q6 -6 12 0 M1076 106 q5 -5 10 0 q5 -5 10 0" stroke="#5c677d" strokeWidth="2.5" fill="none" />

      {/* Far hills, woods and the tropical house in the haze */}
      <path d="M0 312 Q200 270 420 300 T860 292 T1300 300 T1600 284 V360 H0 Z" fill="#c5e3cf" />
      <path d="M0 330 Q260 304 560 324 T1100 318 T1600 322 V360 H0 Z" fill="#b2dbbf" />
      {WOODS.map(([x, y, s]) => (
        <RoundTree key={x} x={x} y={y} scale={s} light />
      ))}
      <Dome />
      <rect y="250" width="1600" height="100" fill="url(#zo-haze)" />

      <rect y={HORIZON} width="1600" height={1000 - HORIZON} fill="url(#zo-meadow)" />
      {/* Savanna far back left */}
      <path d={`M0 ${HORIZON + 4} H640 Q680 430 660 528 Q400 540 0 530 Z`} fill="url(#zo-savanna)" />
      <path d="M40 500 q20 -16 40 0 M300 470 q16 -12 32 0 M520 512 q18 -14 36 0" stroke="#d4a373" strokeWidth="4" fill="none" strokeLinecap="round" />
      <ElephantYard />
      <BackFence />
      <Acacia />
      <MonkeyTree />
      <Wall />
      {/* Sand of the lion enclosure and the kangaroo's red earth */}
      <ellipse cx="410" cy="656" rx="220" ry="36" fill="#ecd082" opacity="0.8" />
      <ellipse cx="1150" cy="650" rx="130" ry="26" fill="#e0a370" opacity="0.6" />
      <Bamboo />
      <LionRock />
      <Eucalyptus />
      <FlamingoPond />
      <Path />
      <PenguinPool />
      <IceRock />
      <River />
      <Flowers />

      {FLOWER_DOTS.map(([x, y, color]) => (
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
