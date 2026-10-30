import { HORIZON, depthScale, towardsHorizon, transformOf } from "../layout";
import { nth, sparklePath } from "../shared";
import { Poke } from "../spots";
import { ROCKET } from "./layout";

// Deep blue space with tiny stars and a soft purple haze; at the horizon the moon's grey hills,
// and the moon itself runs from the hazy back to the light front. Craters, pebbles, rover tracks
// and footprints get bigger towards the front. The rocket's launch pad stands at the back left.

/** Tiny background stars, spread evenly but not in a grid (a fixed pseudo-random sequence). */
const STARS = Array.from({ length: 90 }, (_, i) => {
  const x = (i * 397 + 53) % 1600;
  const y = 8 + ((i * 211 + 17) % (HORIZON - 30));
  return [x, y, 1.2 + (i % 4) * 0.6] as const;
});

/** Twinkly sparkles in the background sky: [x, y, size]. */
const SPARKLES = [
  [380, 120, 9],
  [600, 284, 7],
  [880, 280, 8],
  [1110, 40, 8],
  [1240, 250, 7],
  [1560, 140, 9],
  [40, 270, 8],
  [700, 30, 7],
];

/** Craters in the moon's ground: [x, y, radius x]. */
const CRATERS = [
  [120, 380, 60],
  [880, 372, 46],
  [1440, 470, 50],
  [560, 520, 44],
  [1000, 490, 40],
  [300, 650, 56],
  [1220, 760, 64],
  [1560, 640, 50],
  [60, 800, 60],
  [900, 830, 50],
  [440, 980, 70],
  [1300, 990, 60],
  [1580, 960, 40],
];

const PEBBLES = [
  [260, 400],
  [690, 380],
  [1160, 400],
  [1560, 390],
  [380, 560],
  [660, 640],
  [1000, 620],
  [1380, 650],
  [30, 600],
  [200, 840],
  [760, 860],
  [1000, 900],
  [1220, 870],
  [1580, 880],
  [320, 960],
  [940, 990],
];

/** Footprints from the lander down to the astronaut at the front: [x, y] of each step. */
const STEPS = [
  [660, 470],
  [630, 500],
  [600, 530],
  [560, 660],
  [520, 690],
  [470, 730],
  [420, 770],
  [370, 800],
  [320, 840],
  [270, 880],
  [230, 920],
];

function Crater({ x, y, rx }: { x: number; y: number; rx: number }) {
  const s = depthScale(y);
  const far = y < 520;
  return (
    <Poke kind="wobble">
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <ellipse cx="0" cy="0" rx={rx + 10} ry={(rx + 10) * 0.26} fill={far ? "#aeb1c8" : "#c9cbd8"} />
        <ellipse cx="0" cy="1" rx={rx} ry={rx * 0.2} fill={far ? "#9295b0" : "#a3a6ba"} />
        <path d={`M${-rx} 1 A${rx} ${rx * 0.2} 0 0 0 ${rx} 1 A${rx} ${rx * 0.12} 0 0 1 ${-rx} 1 Z`} fill={far ? "#a2a5bf" : "#b9bbcb"} />
      </g>
    </Poke>
  );
}

export function Background() {
  return (
    <>
      <defs>
        <linearGradient id="wa-space" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={HORIZON + 20}>
          <stop offset="0" stopColor="#141a3d" />
          <stop offset="0.6" stopColor="#232c6b" />
          <stop offset="1" stopColor="#3d4592" />
        </linearGradient>
        <linearGradient id="wa-moon" gradientUnits="userSpaceOnUse" x1="0" y1={HORIZON} x2="0" y2="1000">
          <stop offset="0" stopColor="#9fa3c2" />
          <stop offset="0.3" stopColor="#bcbfd3" />
          <stop offset="1" stopColor="#dcdce6" />
        </linearGradient>
        <linearGradient id="wa-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b9bde6" stopOpacity="0.7" />
          <stop offset="1" stopColor="#b9bde6" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Space with a soft purple and pink haze and many tiny stars */}
      <rect width="1600" height={HORIZON + 20} fill="url(#wa-space)" />
      <ellipse cx="700" cy="150" rx="520" ry="70" fill="#9775fa" opacity="0.12" transform="rotate(-8 700 150)" />
      <ellipse cx="1260" cy="260" rx="300" ry="50" fill="#f783ac" opacity="0.1" />
      <g fill="#fff">
        {STARS.map(([x, y, r], i) => (
          <Poke key={i} kind="glow">
            <circle cx={x} cy={y} r={r} opacity={0.4 + (i % 3) * 0.2} />
          </Poke>
        ))}
      </g>
      <g fill="#fff3bf">
        {SPARKLES.map(([x, y, r], i) => (
          <Poke key={i} kind="glow">
            <path className="wa-bgstar" d={sparklePath(x, y, r)} style={nth(i)} />
          </Poke>
        ))}
      </g>

      {/* The moon's far hills at the horizon, pale in the haze */}
      <path
        d={`M0 ${HORIZON + 6} Q80 ${HORIZON - 26} 170 ${HORIZON - 4} Q240 ${HORIZON - 30} 330 ${HORIZON - 2} Q430 ${HORIZON - 16} 520 ${HORIZON} Q640 ${HORIZON - 36} 760 ${HORIZON - 2} Q860 ${HORIZON - 18} 960 ${HORIZON} Q1080 ${HORIZON - 34} 1180 ${HORIZON - 4} Q1300 ${HORIZON - 22} 1400 ${HORIZON} Q1500 ${HORIZON - 30} 1600 ${HORIZON - 6} V${HORIZON + 30} H0 Z`}
        fill="#8d91b4"
      />
      <path d={`M0 ${HORIZON + 2} Q400 ${HORIZON - 10} 800 ${HORIZON} T1600 ${HORIZON} V1000 H0 Z`} fill="url(#wa-moon)" />
      <rect y={HORIZON - 4} width="1600" height="150" fill="url(#wa-haze)" />

      {CRATERS.map(([x, y, rx]) => (
        <Crater key={`${x}-${y}`} x={x} y={y} rx={rx} />
      ))}
      {PEBBLES.map(([x, y], i) => (
        <Poke key={`${x}-${y}`} kind="hop">
          <g transform={`translate(${x} ${y}) scale(${depthScale(y)})`}>
            <ellipse cx="0" cy="-6" rx={12 + (i % 3) * 4} ry="8" fill={y < 520 ? "#9a9db8" : "#a9abbf"} />
            <ellipse cx="-3" cy="-9" rx={5 + (i % 3) * 2} ry="3" fill={y < 520 ? "#b2b5cc" : "#c7c9d7"} />
            <ellipse cx="22" cy="-3" rx="7" ry="5" fill={y < 520 ? "#a3a6bf" : "#b5b7c8"} />
          </g>
        </Poke>
      ))}

      {/* Tracks of the rover, running back towards the horizon */}
      {[1057, 1203].map((x) => (
        <path key={x} d={`M${x} 632 L${towardsHorizon(x, 632, 400)} 400`} stroke="#a9abc0" strokeWidth="10" strokeDasharray="8 7" opacity="0.7" />
      ))}

      {/* Footprints from the lander to the astronaut */}
      {STEPS.map(([x, y], i) => (
        <ellipse
          key={`${x}-${y}`}
          cx={x + (i % 2 ? 9 : -9) * depthScale(y)}
          cy={y}
          rx={9 * depthScale(y)}
          ry={4 * depthScale(y)}
          fill="#a3a6ba"
          opacity="0.8"
        />
      ))}

      {/* The rocket's launch pad and tower */}
      <Poke kind="wobble">
        <g transform={transformOf(ROCKET)}>
          <path d="M-150 -6 V-330 M-118 -6 V-330" stroke="#868e96" strokeWidth="8" strokeLinecap="round" />
          <path
            d={`M-150 -20 ${Array.from({ length: 8 }, (_, i) => `L${i % 2 ? -150 : -118} ${-20 - (i + 1) * 38}`).join(" ")}`}
            stroke="#adb5bd"
            strokeWidth="5"
            fill="none"
          />
          <rect x="-118" y="-306" width="72" height="12" rx="4" fill="#868e96" />
          <rect x="-118" y="-186" width="72" height="12" rx="4" fill="#868e96" />
          <rect x="-160" y="-344" width="52" height="16" rx="5" fill="#495057" />
          <circle cx="-134" cy="-352" r="7" fill="#ff6b6b" />
          <rect x="-176" y="-10" width="352" height="24" rx="6" fill="#868e96" />
          <rect x="-176" y="-10" width="352" height="8" rx="4" fill="#adb5bd" />
          <rect x="-44" y="-2" width="88" height="16" fill="#495057" />
          <path d="M-160 14 H-120 M120 14 H160" stroke="#ffd60a" strokeWidth="6" strokeDasharray="10 10" />
        </g>
      </Poke>
    </>
  );
}
