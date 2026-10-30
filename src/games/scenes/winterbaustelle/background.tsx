import type { ReactNode } from "react";
import { HORIZON, depthScale, towardsHorizon, transformOf } from "../layout";
import { Cloud, INK } from "../shared";
import { Poke } from "../spots";
import { DIGGER, PAVEMENT, ROAD_BOTTOM, ROAD_TOP, SITE } from "./layout";
import { Cap, SNOW, SNOW_SHADE } from "./parts";

// The Baustelle in winter: a pale sky, snowy roofs in the city, white hills and a site covered
// in snow. The road has been ploughed and has snow banks on both sides.

const FENCE_TOP = HORIZON - 28;

// Far-away city above the hills: [x, top, width].
const TOWERS = [
  [10, 196, 54],
  [72, 168, 44],
  [124, 214, 62],
  [204, 186, 40],
  [256, 226, 56],
  [1268, 214, 48],
  [1324, 180, 42],
  [1376, 224, 62],
  [1450, 194, 50],
  [1512, 232, 70],
];

/** Snow sparkles on the ground: [x, y]; the closer, the bigger. */
const SPARKLES = [
  [180, 352],
  [640, 350],
  [880, 362],
  [520, 420],
  [1240, 470],
  [140, 480],
  [760, 620],
  [1500, 640],
  [600, 900],
  [1290, 860],
  [870, 1000],
  [30, 900],
  [1040, 940],
  [1560, 980],
  [350, 820],
  [1120, 820],
  [460, 470],
];

/** Snow drifts: [x, y, width]; little white hills with a blue shadow. */
const DRIFTS = [
  [330, 352, 70],
  [760, 352, 80],
  [1130, 368, 70],
  [500, 520, 90],
  [1290, 618, 90],
  [140, 650, 110],
  [10, 998, 120],
  [1050, 996, 120],
  [1590, 880, 110],
  [560, 846, 100],
];

function Skyline() {
  return (
    <g>
      {TOWERS.map(([x, y, w], i) => (
        <Poke key={x} kind="wobble">
          <rect x={x} y={y} width={w} height={FENCE_TOP + 10 - y} rx="3" fill="#cfd9ea" />
          <rect x={x + w - 8} y={y} width="8" height={FENCE_TOP + 10 - y} fill="#bfcbe0" />
          {Array.from({ length: Math.floor((FENCE_TOP - 20 - y) / 20) }, (_, row) => (
            <path
              key={row}
              d={`M${x + 8} ${y + 14 + row * 20} h${w / 2 - 12} M${x + w / 2 + 2} ${y + 14 + row * 20} h${w / 2 - 12}`}
              stroke={(row + i) % 3 === 0 ? "#fff1c4" : "#e6edf7"}
              strokeWidth="6"
            />
          ))}
          <rect x={x - 2} y={y - 5} width={w + 4} height="8" rx="4" fill={SNOW} />
        </Poke>
      ))}
      {/* Another crane, far away in the city */}
      <g stroke="#b5c4e3" strokeWidth="4" fill="none">
        <path d="M1418 224 V120 M1350 124 H1500 M1418 120 L1360 124 M1418 120 L1490 124 M1480 124 V150" />
        <path d="M1412 220 L1424 200 L1412 180 L1424 160 L1412 140" strokeWidth="2" />
      </g>
      <path d="M1350 121 H1500" stroke={SNOW} strokeWidth="3" />
      <rect x="1472" y="150" width="16" height="10" fill="#b5c4e3" />
    </g>
  );
}

/** A small fir far away, with snow on its tiers. */
function Fir({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <Poke kind="sway">
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <rect x="-5" y="0" width="10" height="20" fill="#8d6e53" />
        <path d="M-34 4 L0 -44 L34 4 Z M-26 -24 L0 -64 L26 -24 Z" fill="#52796f" />
        <path d="M-34 4 Q0 -6 34 4 Q0 10 -34 4 Z M-26 -24 Q0 -32 26 -24 Q0 -18 -26 -24 Z M-10 -50 L0 -64 L10 -50 Z" fill={SNOW} />
      </g>
    </Poke>
  );
}

/** Mesh fence panels along the back of the site, with snow on top. */
function Fence() {
  return (
    <Poke kind="wobble">
      <defs>
        <pattern id="wb-mesh" width="7" height="7" patternUnits="userSpaceOnUse">
          <path d="M0 0 L7 7 M7 0 L0 7" stroke="#b6c2d0" strokeWidth="1" />
        </pattern>
      </defs>
      {Array.from({ length: 34 }, (_, i) => (
        <g key={i}>
          <rect x={i * 48} y={FENCE_TOP} width="47" height="28" fill="url(#wb-mesh)" stroke="#b6c2d0" strokeWidth="2" />
          <rect x={i * 48 - 4} y={HORIZON - 2} width="9" height="5" rx="1.5" fill="#ff8c42" />
        </g>
      ))}
      <path d={`M0 ${FENCE_TOP + 8} H1600`} stroke="#fff" strokeWidth="5" />
      <path d={`M0 ${FENCE_TOP + 8} H1600`} stroke="#e63946" strokeWidth="5" strokeDasharray="16 16" />
      <path
        d={`M0 ${FENCE_TOP + 1} ${Array.from({ length: 32 }, (_, i) => `Q${i * 50 + 25} ${FENCE_TOP - 5 + (i % 2) * 2} ${i * 50 + 50} ${FENCE_TOP + 1}`).join(" ")} V${FENCE_TOP + 3} H0 Z`}
        fill={SNOW}
      />
    </Poke>
  );
}

/** Things lying around, drawn with their foot at (0, 0) and scaled for where they stand. */
function OnGround({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return <g transform={`translate(${x} ${y}) scale(${depthScale(y)})`}>{children}</g>;
}

/** A stack of planks under a thick layer of snow. */
function Planks() {
  return (
    <>
      <ellipse cx="0" cy="0" rx="78" ry="8" fill={INK} opacity="0.1" />
      <rect x="-60" y="-12" width="14" height="12" fill="#8d5a2b" />
      <rect x="44" y="-12" width="14" height="12" fill="#8d5a2b" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={-74 + (i % 2) * 6} y={-24 - i * 12} width="146" height="12" rx="2" fill={i % 2 ? "#e9c46a" : "#ddb05a"} />
      ))}
      <Cap x={-72} y={-48} w={142} h={12} />
    </>
  );
}

/** A snow drift with its foot at (0, 0). */
function Drift({ w }: { w: number }) {
  return (
    <>
      <path d={`M${-w / 2} 0 Q${-w / 4} ${-w * 0.22} 0 ${-w * 0.16} Q${w / 4} ${-w * 0.24} ${w / 2} 0 Z`} fill={SNOW} />
      <path
        d={`M${w * 0.05} ${-w * 0.14} Q${w * 0.3} ${-w * 0.18} ${w / 2} 0 H${w * 0.18} Q${w * 0.26} ${-w * 0.08} ${w * 0.05} ${-w * 0.14} Z`}
        fill={SNOW_SHADE}
      />
    </>
  );
}

/** A bumpy bank of ploughed snow along y, from left to right. */
function Bank({ y, h, shade }: { y: number; h: number; shade?: boolean }) {
  const bumps = Array.from({ length: 33 }, (_, i) => `Q${i * 50 + 25} ${y - h - (i % 3) * 3} ${i * 50 + 50} ${y - h * 0.6}`).join(" ");
  return (
    <>
      {shade && <path d={`M0 ${y + 4} V${y - h * 0.6} ${bumps} V${y + 4} Z`} fill={SNOW_SHADE} transform="translate(0 4)" />}
      <path d={`M0 ${y + 4} V${y - h * 0.6} ${bumps} V${y + 4} Z`} fill={SNOW} />
    </>
  );
}

export function Background() {
  return (
    <>
      <defs>
        <linearGradient id="wb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9cc3e6" />
          <stop offset="1" stopColor="#eaf3fb" />
        </linearGradient>
        <linearGradient id="wb-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7fbff" />
          <stop offset="0.45" stopColor="#eaf1f8" />
          <stop offset="1" stopColor="#d9e5f1" />
        </linearGradient>
        <linearGradient id="wb-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eaf3fb" stopOpacity="0" />
          <stop offset="1" stopColor="#eaf3fb" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="wb-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7d858c" />
          <stop offset="1" stopColor="#5f676f" />
        </linearGradient>
        <radialGradient id="wb-sunglow">
          <stop offset="0" stopColor="#fff6d6" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff6d6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height={HORIZON + 10} fill="url(#wb-sky)" />
      <circle cx="1470" cy="96" r="140" fill="url(#wb-sunglow)" />
      <Cloud x={1080} y={150} scale={0.42} className="wb-cloud" />
      <Cloud x={720} y={210} scale={0.3} className="wb-cloud wb-cloud-slow" />
      <Skyline />
      <path d="M0 290 Q160 250 360 280 T760 268 T1180 272 T1600 268 V340 H0 Z" fill="#f4f8fc" />
      <rect y="230" width="1600" height="80" fill="url(#wb-haze)" />
      <path d="M0 306 Q200 270 420 300 T860 292 T1300 288 T1600 296 V340 H0 Z" fill="#e3ecf6" />
      <Fir x={600} y={290} scale={0.5} />
      <Fir x={634} y={296} scale={0.38} />
      <Fir x={1180} y={286} scale={0.44} />
      <Fir x={300} y={300} scale={0.34} />
      <Fence />
      <rect y={HORIZON} width="1600" height={1000 - HORIZON} fill="url(#wb-ground)" />

      {/* Blue shadows in the snow, sled tracks and drifts */}
      <g fill="#d3e1ef" opacity="0.6">
        <ellipse cx="760" cy="372" rx="60" ry="5" />
        <ellipse cx="1150" cy="520" rx="100" ry="9" />
        <ellipse cx="300" cy="630" rx="140" ry="11" />
        <ellipse cx="420" cy="940" rx="160" ry="18" />
        <ellipse cx="1150" cy="900" rx="120" ry="14" />
      </g>
      <g stroke="#cddbea" strokeLinecap="round" fill="none" strokeWidth="5">
        <path d={`M860 640 L${towardsHorizon(860, 640, 470)} 470 M900 640 L${towardsHorizon(900, 640, 470)} 470`} />
      </g>
      {DRIFTS.map(([x, y, w]) => (
        <Poke key={`${x}-${y}`} kind="wobble">
          <OnGround x={x} y={y}>
            <Drift w={w} />
          </OnGround>
        </Poke>
      ))}

      {/* Snow heap the digger is working on */}
      <Poke kind="wobble">
        <g transform={transformOf(DIGGER)}>
          <ellipse cx="562" cy="714" rx="120" ry="12" fill={INK} opacity="0.08" />
          <path d="M455 714 Q560 596 670 714 Z" fill={SNOW} />
          <path d="M562 650 Q630 660 670 714 H600 Q600 680 562 650 Z" fill={SNOW_SHADE} />
          <path d="M500 700 Q540 650 580 656" stroke="#fff" strokeWidth="8" fill="none" strokeLinecap="round" />
        </g>
      </Poke>

      <Poke kind="wobble">
        <OnGround x={1214} y={522}>
          <Planks />
        </OnGround>
      </Poke>

      {/* Pallet of bricks below the crane, with snow on top */}
      <Poke kind="wobble">
        <g transform={transformOf(SITE)}>
          <ellipse cx="720" cy="655" rx="52" ry="7" fill={INK} opacity="0.12" />
          <rect x="676" y="644" width="88" height="10" rx="2" fill="#8d5a2b" />
          <g fill="#e76f51" stroke="#f4a261" strokeWidth="2">
            {[0, 1, 2].map((row) =>
              [0, 1, 2].map((col) => <rect key={`${row}-${col}`} x={680 + col * 27 + (row % 2) * 6} y={626 - row * 18} width="27" height="18" />),
            )}
          </g>
          <Cap x={686} y={590} w={82} h={10} />
        </g>
      </Poke>

      {/* The ploughed road with snow banks on both sides */}
      <rect y={ROAD_TOP} width="1600" height={ROAD_BOTTOM - ROAD_TOP} fill="url(#wb-road)" />
      <g fill="#566068">
        {Array.from({ length: 48 }, (_, i) => (
          <circle key={i} cx={(i * 97) % 1600} cy={ROAD_TOP + 16 + ((i * 37) % 96)} r={1.5 + ((i * 37) % 96) / 60} />
        ))}
      </g>
      {/* Wet tyre tracks and slush */}
      <path
        d={`M0 ${ROAD_TOP + 30} H1600 M0 ${ROAD_TOP + 50} H1600 M0 ${ROAD_TOP + 84} H1600 M0 ${ROAD_TOP + 106} H1600`}
        stroke="#535b63"
        strokeWidth="7"
        opacity="0.6"
      />
      <path d="M0 712 H1600" stroke="#fff" strokeWidth="5" strokeDasharray="44 36" opacity="0.8" />
      <g fill="#c9d6e3" opacity="0.8">
        <ellipse cx="380" cy="690" rx="40" ry="5" />
        <ellipse cx="1000" cy="736" rx="56" ry="6" />
        <ellipse cx="1460" cy="700" rx="36" ry="4" />
      </g>
      <Bank y={ROAD_TOP + 4} h={12} />
      <Bank y={ROAD_BOTTOM + 8} h={14} shade />
      <rect y={ROAD_BOTTOM + 8} width="1600" height={PAVEMENT - ROAD_BOTTOM - 4} fill="#eef3f9" />
      <path d={`M0 ${PAVEMENT - 8} H1600`} stroke="#dbe5ef" strokeWidth="8" />
      <path
        d={Array.from({ length: 28 }, (_, i) => `M${i * 60} ${PAVEMENT - 12} L${towardsHorizon(i * 60, PAVEMENT - 12, PAVEMENT - 4)} ${PAVEMENT - 4}`).join(
          " ",
        )}
        stroke="#cbd7e3"
        strokeWidth="2"
      />
      <Bank y={PAVEMENT + 6} h={8} shade />

      {/* Sparkles in the snow */}
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
      <g fill="#b8cde3" opacity="0.7">
        {SPARKLES.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x + 30} cy={y + 6} r={2.5 * depthScale(y)} />
        ))}
      </g>
    </>
  );
}
