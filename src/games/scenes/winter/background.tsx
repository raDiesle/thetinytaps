import type { ReactNode } from "react";
import { HORIZON, depthScale } from "../layout";
import { Cloud } from "../shared";
import { Poke } from "../spots";
import { Snow } from "../weather";
import { Cap, SNOW, SNOW_SHADE } from "../winterbaustelle/parts";
import { POND } from "./layout";

// A snowy village edge: hills with a fir forest and the village far back, a garden fence,
// the frozen pond in the middle, the sledging hill on the right and a trodden path in front.
// Nothing here is an item, but firs, houses, the fence, bushes, reeds and sparkles move when tapped.

/** Small firs of the far forest: [x, y, scale]. */
const FOREST = [
  [20, 318, 0.5],
  [62, 312, 0.62],
  [104, 320, 0.46],
  [196, 314, 0.56],
  [240, 322, 0.42],
  [380, 316, 0.5],
  [424, 322, 0.4],
  [470, 312, 0.58],
  [700, 318, 0.44],
  [742, 312, 0.54],
  [1350, 316, 0.5],
  [1396, 322, 0.42],
  [1452, 312, 0.6],
  [1506, 318, 0.48],
  [1560, 314, 0.56],
] as const;

/** Houses of the far village around the church: [x, width, wall height, roof colour, lit window]. */
const VILLAGE = [
  [846, 54, 30, "#b5525a", true],
  [912, 46, 26, "#7d6b9e", false],
  [1196, 52, 32, "#b5525a", false],
  [1262, 44, 24, "#5f7f9e", true],
] as const;

/** A small far fir with snow on its tiers. */
function Fir({ x, y, scale, colour = "#5d8a80" }: { x: number; y: number; scale: number; colour?: string }) {
  return (
    <Poke kind="sway">
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <rect x="-5" y="0" width="10" height="16" fill="#8d6e53" />
        <path d="M-34 6 L0 -44 L34 6 Z M-26 -22 L0 -66 L26 -22 Z" fill={colour} />
        <path d="M-34 6 Q0 -4 34 6 Q0 12 -34 6 Z M-26 -22 Q0 -30 26 -22 Q0 -16 -26 -22 Z M-10 -52 L0 -66 L10 -52 Z" fill={SNOW} />
      </g>
    </Poke>
  );
}

function Village() {
  const base = HORIZON + 14;
  return (
    <g>
      {VILLAGE.map(([x, w, h, roof, lit]) => (
        <Poke key={x} kind="wobble">
          <rect x={x} y={base - h} width={w} height={h} fill="#efe6da" />
          <rect x={x + w - 10} y={base - h} width="10" height={h} fill="#ddd2c4" />
          <path d={`M${x - 6} ${base - h + 2} L${x + w / 2} ${base - h - 26} L${x + w + 6} ${base - h + 2} Z`} fill={roof} />
          <path
            d={`M${x - 6} ${base - h + 2} L${x + w / 2} ${base - h - 26} L${x + w + 6} ${base - h + 2} Q${x + w / 2} ${base - h - 12} ${x - 6} ${base - h + 2} Z`}
            fill={SNOW}
          />
          <rect x={x + 10} y={base - h + 8} width="10" height="10" rx="2" fill={lit ? "#ffe08a" : "#a9bfd6"} />
          <rect x={x + w - 24} y={base - h + 8} width="10" height="10" rx="2" fill="#a9bfd6" />
        </Poke>
      ))}
      {/* Chimney smoke of the far houses: still, it only hangs there. */}
      <g fill="#fff" opacity="0.8">
        <circle cx="866" cy="282" r="6" />
        <circle cx="872" cy="270" r="8" />
        <circle cx="1282" cy="290" r="5" />
        <circle cx="1288" cy="279" r="7" />
      </g>
    </g>
  );
}

/** Things lying around, drawn with their foot at (0, 0) and scaled for where they stand. */
function OnGround({ x, y, size = 1, children }: { x: number; y: number; size?: number; children: ReactNode }) {
  return <g transform={`translate(${x} ${y}) scale(${depthScale(y) * size})`}>{children}</g>;
}

/** The garden fence of the red house: wooden pickets with snow on top, from x0 to x1. */
function Fence({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  const s = depthScale(y);
  const n = Math.floor((x1 - x0) / (34 * s));
  return (
    <Poke kind="wobble">
      <rect x={x0} y={y - 66 * s} width={x1 - x0} height={10 * s} fill="#a0703f" />
      <rect x={x0} y={y - 34 * s} width={x1 - x0} height={10 * s} fill="#a0703f" />
      {Array.from({ length: n + 1 }, (_, i) => {
        const x = x0 + i * 34 * s;
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            <path d="M-9 0 V-84 L0 -96 L9 -84 V0 Z" fill="#c68b59" />
            <path d="M3 0 V-86 L9 -84 V0 Z" fill="#a0703f" />
            <path d="M-10 -84 L0 -98 L10 -84 Q0 -80 -10 -84 Z" fill={SNOW} />
          </g>
        );
      })}
      <path d={`M${x0} ${y - 2} Q${(x0 + x1) / 2} ${y - 22 * s} ${x1} ${y - 2} V${y + 6} H${x0} Z`} fill={SNOW} />
    </Poke>
  );
}

/** A bush of three round lobes, each with a cap of snow, standing in a little drift. */
function Bush({ w }: { w: number }) {
  const lobes = [
    [-w * 0.26, -w * 0.22, w * 0.26],
    [w * 0.26, -w * 0.2, w * 0.24],
    [0, -w * 0.34, w * 0.3],
  ];
  return (
    <>
      {lobes.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={i === 2 ? "#4f7c6b" : "#456f60"} />
      ))}
      {lobes.map(([cx, cy, r], i) => (
        <path
          key={i}
          d={`M${cx - r * 0.92} ${cy - r * 0.3} Q${cx - r * 0.8} ${cy - r * 1.08} ${cx} ${cy - r * 1.06} Q${cx + r * 0.8} ${cy - r * 1.08} ${cx + r * 0.92} ${cy - r * 0.3} Q${cx + r * 0.4} ${cy - r * 0.5} ${cx} ${cy - r * 0.42} Q${cx - r * 0.4} ${cy - r * 0.56} ${cx - r * 0.92} ${cy - r * 0.3} Z`}
          fill={SNOW}
        />
      ))}
      <path d={`M${-w * 0.6} 0 Q${-w * 0.3} ${-w * 0.16} 0 ${-w * 0.12} Q${w * 0.3} ${-w * 0.16} ${w * 0.6} 0 Z`} fill={SNOW} />
    </>
  );
}

/** Dry reeds sticking out of the snow at the edge of the pond. */
function Reeds() {
  return (
    <g strokeLinecap="round" fill="none">
      {[
        [-20, -60, -6],
        [-8, -74, 2],
        [4, -66, 8],
        [16, -54, 14],
      ].map(([x, top, lean]) => (
        <g key={x}>
          <path d={`M${x} 0 Q${x + lean / 2} ${top / 2} ${x + lean} ${top}`} stroke="#b08d57" strokeWidth="4" />
          <ellipse cx={x + lean} cy={top + 8} rx="5" ry="12" fill="#7f5539" stroke="none" />
        </g>
      ))}
      <path d="M-30 0 Q0 -12 30 0 Z" fill={SNOW} stroke="none" />
    </g>
  );
}

function Pond() {
  const { cx, cy, rx, ry } = POND;
  return (
    <g>
      <ellipse cx={cx} cy={cy + 6} rx={rx + 26} ry={ry + 14} fill={SNOW_SHADE} />
      <ellipse cx={cx} cy={cy} rx={rx + 20} ry={ry + 10} fill={SNOW} />
      <ellipse cx={cx} cy={cy + 2} rx={rx} ry={ry} fill="url(#wi-ice)" />
      <ellipse cx={cx} cy={cy - ry * 0.55} rx={rx * 0.9} ry={ry * 0.35} fill="#d6eefc" opacity="0.6" />
      {/* Shine on the ice */}
      <g stroke="#fff" strokeLinecap="round" opacity="0.85">
        <path d={`M${cx - 200} ${cy - 10} L${cx - 150} ${cy - 22}`} strokeWidth="6" />
        <path d={`M${cx - 130} ${cy + 6} L${cx - 104} ${cy}`} strokeWidth="4" />
        <path d={`M${cx + 120} ${cy + 22} L${cx + 190} ${cy + 6}`} strokeWidth="6" />
        <path d={`M${cx + 30} ${cy - 30} L${cx + 70} ${cy - 38}`} strokeWidth="4" />
      </g>
      {/* Curly tracks of the skates */}
      <path
        d={`M${cx - 60} ${cy + 30} q40 -30 90 -10 q40 20 20 30 q-30 10 -30 -14 q10 -26 70 -26`}
        stroke="#9fc9e8"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Snow blown onto the edge of the ice */}
      <path
        d={`M${cx - rx} ${cy + 2} Q${cx - rx + 30} ${cy - 18} ${cx - rx + 90} ${cy - 30} Q${cx - rx + 40} ${cy - 8} ${cx - rx + 30} ${cy + 20} Z`}
        fill={SNOW}
      />
      <path
        d={`M${cx + rx} ${cy + 2} Q${cx + rx - 40} ${cy + 30} ${cx + rx - 120} ${cy + 48} Q${cx + rx - 60} ${cy + 24} ${cx + rx - 10} ${cy - 20} Z`}
        fill={SNOW}
      />
      <Poke kind="sway">
        <OnGround x={cx - rx + 6} y={cy - 8} size={1.2}>
          <Reeds />
        </OnGround>
      </Poke>
      <Poke kind="sway">
        <OnGround x={cx + rx - 30} y={cy - 20} size={1}>
          <Reeds />
        </OnGround>
      </Poke>
    </g>
  );
}

const HILL = "M840 696 C960 684 1040 640 1116 584 C1196 524 1252 452 1336 418 C1400 394 1500 388 1610 390 V708 Q1240 716 840 696 Z";

function Hill() {
  return (
    <g>
      <path d={HILL} fill={SNOW_SHADE} transform="translate(-14 8)" />
      <path d={HILL} fill="url(#wi-hill)" />
      {/* Light from the right: the far side of the top is brighter */}
      <path d="M1336 418 C1400 394 1500 388 1610 390 V430 Q1480 420 1336 418 Z" fill="#fff" />
      {/* Sledge tracks and ski tracks down the slope */}
      <g stroke="#cfdeee" strokeLinecap="round" fill="none">
        <path d="M1470 440 C1340 470 1200 560 1060 640 C1000 672 940 690 880 698" strokeWidth="5" />
        <path d="M1484 452 C1352 484 1214 572 1074 652 C1014 684 954 700 892 708" strokeWidth="5" />
        <path d="M1520 470 C1420 520 1340 560 1260 640" strokeWidth="3" />
        <path d="M1532 476 C1432 528 1352 568 1272 646" strokeWidth="3" />
      </g>
      {/* Little firs on top of the hill */}
      <Fir x={1590} y={396} scale={0.72} colour="#40916c" />
      <Fir x={1350} y={424} scale={0.5} colour="#40916c" />
    </g>
  );
}

/** The trodden path in front, with runner tracks of the sleigh and hoof prints. */
function Path() {
  const top = "M-10 792 Q400 768 800 780 T1610 800";
  return (
    <g>
      <path d={`${top} V858 Q800 846 400 862 T-10 852 Z`} fill="#e2ebf5" />
      <path d={top} stroke={SNOW} strokeWidth="10" fill="none" />
      <g stroke="#c9d8e8" strokeWidth="4" fill="none" strokeLinecap="round">
        <path d="M-10 814 Q400 794 800 802 T1610 820" />
        <path d="M-10 834 Q400 816 800 822 T1610 840" />
      </g>
      <g fill="#c9d8e8">
        {Array.from({ length: 14 }, (_, i) => (
          <ellipse key={i} cx={40 + i * 46} cy={822 - i * 1.6 + (i % 2) * 6} rx="7" ry="4" />
        ))}
      </g>
    </g>
  );
}

/** Snow sparkles: [x, y]; the closer, the bigger. */
const SPARKLES = [
  [180, 352],
  [620, 360],
  [980, 372],
  [520, 470],
  [1030, 480],
  [40, 520],
  [1460, 520],
  [1290, 600],
  [320, 760],
  [980, 740],
  [600, 900],
  [1290, 860],
  [870, 1000],
  [30, 900],
  [1040, 940],
  [1560, 980],
  [250, 560],
  [1190, 740],
];

export function Background() {
  return (
    <>
      <defs>
        <linearGradient id="wi-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fbce6" />
          <stop offset="1" stopColor="#eaf3fb" />
        </linearGradient>
        <linearGradient id="wi-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6faff" />
          <stop offset="0.5" stopColor="#eaf1f8" />
          <stop offset="1" stopColor="#dce7f2" />
        </linearGradient>
        <linearGradient id="wi-ice" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe3fa" />
          <stop offset="1" stopColor="#8cc8ee" />
        </linearGradient>
        <linearGradient id="wi-hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e6eef7" />
        </linearGradient>
        <linearGradient id="wi-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eaf3fb" stopOpacity="0" />
          <stop offset="1" stopColor="#eaf3fb" stopOpacity="0.85" />
        </linearGradient>
        <radialGradient id="wi-sunglow">
          <stop offset="0" stopColor="#fff6d6" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff6d6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height={HORIZON + 10} fill="url(#wi-sky)" />
      <circle cx="1470" cy="96" r="150" fill="url(#wi-sunglow)" />
      <Cloud x={1060} y={70} scale={0.36} className="wi-cloud" />
      <Cloud x={300} y={210} scale={0.28} className="wi-cloud wi-cloud-slow" />
      {/* Far white hills */}
      <path d="M0 270 Q180 214 380 252 T780 240 T1200 236 T1600 250 V340 H0 Z" fill="#f4f8fc" />
      <path d="M0 270 Q180 214 380 252 T780 240 T1200 236 T1600 250" stroke="#dce7f2" strokeWidth="4" fill="none" />
      <rect y="220" width="1600" height="100" fill="url(#wi-haze)" />
      <path d="M0 300 Q220 272 460 296 T900 292 T1320 286 T1600 296 V340 H0 Z" fill="#e8f0f8" />
      {FOREST.map(([x, y, s]) => (
        <Fir key={x} x={x} y={y} scale={s} />
      ))}
      <Village />
      <rect y={HORIZON} width="1600" height={1000 - HORIZON} fill="url(#wi-ground)" />
      <Snow seed="winter" />
      <Fence x0={150} x1={505} y={552} />
      <Poke kind="sway">
        <OnGround x={616} y={558} size={1.2}>
          <Bush w={90} />
        </OnGround>
      </Poke>
      <Poke kind="sway">
        <OnGround x={34} y={760} size={1.3}>
          <Bush w={110} />
        </OnGround>
      </Poke>
      <Poke kind="sway">
        <OnGround x={1010} y={432}>
          <Bush w={100} />
        </OnGround>
      </Poke>
      <Pond />
      <Hill />
      <Path />
      {/* The church stands on a little white rise; snow lies on the low wall around it. */}
      <path d="M1000 352 Q1110 326 1220 352 Z" fill={SNOW} />
      <rect x="1004" y="346" width="210" height="8" rx="3" fill="#cfc3b3" />
      <Cap x={1004} y={346} w={210} h={5} />
      <g fill="#fff">
        {SPARKLES.map(([x, y]) => {
          const s = depthScale(y) * 6;
          return (
            <Poke key={`${x}-${y}`} kind="glow">
              <path
                d={`M${x} ${y - s} L${x + s * 0.3} ${y} L${x} ${y + s} L${x - s * 0.3} ${y} Z M${x - s} ${y} L${x} ${y + s * 0.3} L${x + s} ${y} L${x} ${y - s * 0.3} Z`}
              />
            </Poke>
          );
        })}
      </g>
    </>
  );
}
