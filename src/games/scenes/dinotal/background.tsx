import { HORIZON, depthScale } from "../layout";
import { Cloud } from "../shared";
import { Poke } from "../spots";
import { LAKE, TRAIL, trailHalf, trailX } from "./layout";

// A green valley long ago. Far away soft purple mountains and green hills fade into the
// warm haze; a herd of long-necked dinosaurs walks along the horizon as tiny shadows.
// A sandy trail winds from the front up to the volcano, with big three-toed footprints.
// The lake lies in the middle right, with a sandy shore, stones and reeds; ferns, tufts,
// pebbles and little flowers grow on the meadow. Nothing here is an item, but trees, ferns, flowers
// and stones move when tapped.

function trailPath() {
  const ys = Array.from({ length: 33 }, (_, i) => TRAIL[0][1] + ((1000 - TRAIL[0][1]) * i) / 32);
  const left = ys.map((y) => `${(trailX(y) - trailHalf(y)).toFixed(1)} ${y.toFixed(1)}`);
  const right = ys.map((y) => `${(trailX(y) + trailHalf(y)).toFixed(1)} ${y.toFixed(1)}`).reverse();
  return `M${left.join(" L")} L${right.join(" L")} Z`;
}

// Footprints along the trail: [ground height, left (-1) or right (1)].
const PRINTS = [
  [470, -1],
  [520, 1],
  [575, -1],
  [635, 1],
  [700, -1],
  [770, 1],
  [845, -1],
] as const;

/** A big, round three-toed footprint, pointing up the trail. */
function Print({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#c9a46a" opacity="0.8">
      <ellipse cx="0" cy="0" rx="12" ry="8" />
      <ellipse cx="-13" cy="-11" rx="5" ry="7" transform="rotate(-25 -13 -11)" />
      <ellipse cx="0" cy="-15" rx="5" ry="7" />
      <ellipse cx="13" cy="-11" rx="5" ry="7" transform="rotate(25 13 -11)" />
    </g>
  );
}

// Far mountains and hills: [x, height, width].
const MOUNTAINS = [
  [60, 120, 260],
  [250, 90, 220],
  [780, 110, 280],
  [990, 150, 320],
  [1210, 100, 260],
  [1420, 130, 300],
  [1600, 90, 240],
];

// The herd of long-necks walking far away on the horizon: [x, size, facing].
const HERD = [
  [840, 1, 1],
  [905, 0.8, 1],
  [950, 0.6, 1],
] as const;

/** A tiny long-neck dinosaur shadow far away, foot at (x, y). */
function FarDino({ x, y, size, dir }: { x: number; y: number; size: number; dir: number }) {
  return (
    <Poke kind="hop">
      <g transform={`translate(${x} ${y}) scale(${size * dir} ${size})`} fill="#93a9a0">
        <ellipse cx="0" cy="-14" rx="20" ry="10" />
        <path d="M12 -18 Q22 -40 30 -46 L34 -42 Q26 -34 20 -12 Z" />
        <circle cx="32" cy="-46" r="4.5" />
        <path d="M-18 -16 Q-32 -12 -40 -4 Q-28 -8 -16 -10 Z" />
        <rect x="-14" y="-8" width="5" height="9" rx="2" />
        <rect x="8" y="-8" width="5" height="9" rx="2" />
      </g>
    </Poke>
  );
}

// Trees between the meadow and the hills: [x, y, size].
const MID_PALMS = [
  [700, 372, 0.8],
  [1080, 380, 0.9],
  [1150, 366, 0.7],
  [20, 400, 0.9],
  [330, 392, 0.75],
] as const;

/** A palm-like tree far away, foot at (x, y). */
function MidPalm({ x, y, size }: { x: number; y: number; size: number }) {
  const s = depthScale(y) * size;
  return (
    <Poke kind="sway">
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M-5 0 Q-10 -60 4 -120 L12 -118 Q2 -60 7 0 Z" fill="#a1887f" />
        <g fill="#7fb77e">
          <path d="M8 -120 Q-30 -150 -70 -120 Q-30 -132 8 -114 Z" />
          <path d="M8 -120 Q46 -150 84 -118 Q44 -130 8 -114 Z" />
          <path d="M8 -122 Q-14 -170 -48 -170 Q-14 -150 4 -116 Z" />
          <path d="M8 -122 Q34 -172 66 -164 Q30 -150 10 -116 Z" />
        </g>
      </g>
    </Poke>
  );
}

// Grass tufts on the meadow: [x, y].
const TUFTS = [
  [60, 560],
  [470, 470],
  [880, 470],
  [1380, 500],
  [300, 700],
  [520, 740],
  [1000, 700],
  [1560, 700],
  [60, 860],
  [460, 890],
  [890, 820],
  [1150, 860],
  [1100, 990],
  [280, 990],
  [700, 860],
];

// Little flowers on the meadow (no items, they only sway): [x, y, colour].
const FLOWERS = [
  [250, 560, "#ffd6e0"],
  [560, 520, "#fff3b0"],
  [1360, 560, "#ffd6e0"],
  [40, 700, "#fff3b0"],
  [1000, 860, "#ffd6e0"],
  [1180, 990, "#fff3b0"],
  [230, 900, "#ffd6e0"],
  [1600, 880, "#fff3b0"],
  [700, 940, "#fff3b0"],
] as const;

// Small background ferns: [x, y, size, flip].
const SMALL_FERNS = [
  [520, 470, 0.8, 1],
  [1350, 520, 0.9, -1],
  [1580, 760, 1, 1],
  [300, 800, 0.9, -1],
  [1140, 990, 0.8, 1],
] as const;

/** A low fern of five fronds, foot at (x, y). */
function SmallFern({ x, y, size, flip }: { x: number; y: number; size: number; flip: number }) {
  const s = depthScale(y) * size;
  return (
    <Poke kind="sway">
      <g transform={`translate(${x} ${y}) scale(${s * flip} ${s})`} fill="none" stroke="#4f9d5d" strokeWidth="7" strokeLinecap="round">
        <path d="M0 0 Q-20 -40 -60 -50 M0 0 Q-6 -50 -24 -76 M0 0 Q6 -54 20 -80 M0 0 Q24 -40 60 -48 M0 0 Q30 -14 62 -10" />
        <path d="M-30 -42 l-6 -10 M-46 -48 l-4 -10 M-12 -52 l-8 -6 M10 -56 l8 -6 M34 -42 l6 -10 M46 -46 l4 -10" strokeWidth="5" stroke="#6bb26f" />
      </g>
    </Poke>
  );
}

// Pebbles on the meadow and the trail: [x, y].
const PEBBLES = [
  [600, 470],
  [180, 640],
  [440, 680],
  [880, 760],
  [1180, 720],
  [1500, 860],
  [40, 940],
  [690, 880],
  [840, 980],
  [1250, 1000],
];

// Stones in and at the lake: [x, y, size].
const LAKE_STONES = [
  [770, 610, 1],
  [1290, 590, 0.9],
  [880, 652, 0.8],
] as const;

/** Reeds with cattails, foot at (x, y). */
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
        <ellipse cx="-12" cy="-90" rx="5" ry="13" fill="#9c6644" />
        <ellipse cx="16" cy="-108" rx="5" ry="13" fill="#9c6644" />
      </g>
    </Poke>
  );
}

export function Background() {
  const { cx, cy, rx, ry } = LAKE;
  return (
    <>
      <defs>
        <linearGradient id="dt-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fd3f4" />
          <stop offset="0.7" stopColor="#d4effa" />
          <stop offset="1" stopColor="#fff4dc" />
        </linearGradient>
        <linearGradient id="dt-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff4dc" stopOpacity="0" />
          <stop offset="1" stopColor="#fff4dc" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="dt-meadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bcdc8e" />
          <stop offset="0.45" stopColor="#9fcd6f" />
          <stop offset="1" stopColor="#7ab656" />
        </linearGradient>
        <linearGradient id="dt-trail" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2dcae" />
          <stop offset="1" stopColor="#e3c088" />
        </linearGradient>
        <linearGradient id="dt-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe9f7" />
          <stop offset="1" stopColor="#56b4e0" />
        </linearGradient>
      </defs>

      {/* Sky and the far mountains in the warm haze */}
      <rect width="1600" height={HORIZON + 30} fill="url(#dt-sky)" />
      <Cloud x={700} y={190} scale={0.3} className="dt-cloud dt-cloud-slow" />
      <Cloud x={1130} y={130} scale={0.34} className="dt-cloud" />
      <g fill="#c9bfe0">
        {MOUNTAINS.map(([x, h, w]) => (
          <Poke key={x} kind="wobble">
            <path
              d={`M${x - w / 2} ${HORIZON + 4} Q${x - w * 0.22} ${HORIZON - h} ${x} ${HORIZON - h} Q${x + w * 0.22} ${HORIZON - h} ${x + w / 2} ${HORIZON + 4} Z`}
            />
          </Poke>
        ))}
      </g>
      <g fill="#ffffff" opacity="0.6">
        <path d="M960 196 Q990 180 1020 196 Q1000 192 990 200 Z" />
        <path d="M1400 216 Q1420 202 1440 216 Q1426 212 1420 220 Z" />
      </g>
      <path d="M0 312 Q200 280 420 300 T860 296 T1280 290 T1600 300 V360 H0 Z" fill="#a9d39a" />
      {HERD.map(([x, size, dir]) => (
        <FarDino key={x} x={x} y={HORIZON - 6} size={size} dir={dir} />
      ))}
      <path d="M0 330 Q300 312 600 326 T1200 320 T1600 326 V370 H0 Z" fill="#9cc98a" />
      <rect y="250" width="1600" height="110" fill="url(#dt-haze)" />

      {/* The meadow */}
      <rect y={HORIZON + 20} width="1600" height={1000 - HORIZON - 20} fill="url(#dt-meadow)" />
      <path d="M0 360 Q400 346 800 360 T1600 352 V392 H0 Z" fill="#acd47f" opacity="0.7" />
      {MID_PALMS.map(([x, y, size]) => (
        <MidPalm key={x} x={x} y={y} size={size} />
      ))}
      <g fill="#8fc463" opacity="0.6">
        <ellipse cx="240" cy="680" rx="150" ry="24" />
        <ellipse cx="1420" cy="760" rx="160" ry="26" />
        <ellipse cx="420" cy="980" rx="200" ry="30" />
        <ellipse cx="1060" cy="880" rx="140" ry="22" />
      </g>

      {/* The sandy trail with big footprints, winding up to the volcano */}
      <path d={trailPath()} fill="url(#dt-trail)" />
      <path
        d={Array.from({ length: 33 }, (_, i) => {
          const y = TRAIL[0][1] + ((1000 - TRAIL[0][1]) * i) / 32;
          return `${i ? "L" : "M"}${(trailX(y) + trailHalf(y) * 0.92).toFixed(1)} ${y.toFixed(1)}`;
        }).join(" ")}
        stroke="#d4ad72"
        strokeWidth="4"
        fill="none"
        opacity="0.6"
      />
      {PRINTS.map(([y, side]) => (
        <Print key={y} x={trailX(y) + side * trailHalf(y) * 0.4} y={y} s={depthScale(y) * 1.1} />
      ))}

      {/* The lake with its sandy shore, ripples, stones and reeds */}
      <ellipse cx={cx} cy={cy + 6} rx={rx + 26} ry={ry + 14} fill="#ead5a4" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#dt-water)" />
      <ellipse cx={cx - 40} cy={cy - 30} rx={rx * 0.7} ry={ry * 0.22} fill="#fff" opacity="0.35" />
      <path
        className="dt-ripples"
        d={[
          [cx - 200, cy - 10],
          [cx - 80, cy + 30],
          [cx + 60, cy - 18],
          [cx + 200, cy + 20],
          [cx - 10, cy + 48],
        ]
          .map(([x, y]) => `M${x - 16} ${y} q16 -6 32 0`)
          .join(" ")}
        stroke="#fff"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      {LAKE_STONES.map(([x, y, size]) => {
        const s = depthScale(y) * size;
        return (
          <Poke key={x} kind="hop">
            <ellipse cx={x} cy={y} rx={30 * s} ry={14 * s} fill="#b0a8a0" />
            <ellipse cx={x - 6 * s} cy={y - 5 * s} rx={14 * s} ry={5 * s} fill="#fff" opacity="0.4" />
          </Poke>
        );
      })}
      <Reeds x={cx - rx + 10} y={cy - 8} flip={-1} />
      <Reeds x={cx + rx - 30} y={cy + 30} />
      <Reeds x={cx + 120} y={cy - ry + 4} />

      {/* Ferns, grass, flowers and pebbles on the meadow */}
      {SMALL_FERNS.map(([x, y, size, flip]) => (
        <SmallFern key={x} x={x} y={y} size={size} flip={flip} />
      ))}
      <g stroke="#5aa561" strokeWidth="5" strokeLinecap="round" fill="none">
        {TUFTS.map(([x, y]) => (
          <Poke key={`${x}-${y}`} kind="sway">
            <path d="M0 0 q4 -24 12 -30 M10 0 q0 -26 -6 -36 M20 0 q2 -20 12 -26" transform={`translate(${x} ${y}) scale(${depthScale(y)})`} />
          </Poke>
        ))}
      </g>
      {FLOWERS.map(([x, y, colour]) => (
        <Poke key={`${x}-${y}`} kind="sway">
          <g transform={`translate(${x} ${y}) scale(${depthScale(y)})`}>
            <path d="M0 0 V-14" stroke="#52a35f" strokeWidth="3" />
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx="0" cy="-21" rx="4.5" ry="6.5" fill={colour} transform={`rotate(${a} 0 -15)`} />
            ))}
            <circle cy="-15" r="3.2" fill="#ffb703" />
          </g>
        </Poke>
      ))}
      <g fill="#c2b59b">
        {PEBBLES.map(([x, y]) => {
          const s = depthScale(y);
          return (
            <Poke key={`${x}-${y}`} kind="hop">
              <ellipse cx={x} cy={y} rx={9 * s} ry={5 * s} />
            </Poke>
          );
        })}
      </g>
    </>
  );
}
