import { HORIZON, depthScale, towardsHorizon, transformOf } from "../layout";
import { Cloud } from "../shared";
import { FallenLeaves, LEAF_COLOURS, Leaf } from "../weather";
import { BOY, CHESTNUT_TREE, MAPLE, STAND } from "./layout";
import { StandBack } from "./things";

// A windy autumn day at the edge of the village. Far back: hills with colourful
// woods and a few houses in a light haze; the ploughed field and the stubble field;
// in front the meadow with a sandy path, the boy's little hill and fallen leaves.

/** Far-away autumn woods on the hills: [x, y, r, colour]. */
const WOODS: [number, number, number, string][] = [
  [20, 300, 26, "#e9c46a"],
  [60, 296, 30, "#e76f51"],
  [104, 302, 24, "#a7c957"],
  [150, 298, 28, "#f4a261"],
  [196, 304, 22, "#d62828"],
  [236, 300, 26, "#e9c46a"],
  [600, 306, 20, "#f4a261"],
  [636, 302, 24, "#e9c46a"],
  [672, 308, 18, "#a7c957"],
  [1110, 304, 22, "#e76f51"],
  [1150, 300, 28, "#e9c46a"],
  [1196, 306, 20, "#f4a261"],
  [1460, 298, 26, "#a7c957"],
  [1500, 302, 24, "#e9c46a"],
  [1540, 296, 30, "#e76f51"],
  [1584, 302, 24, "#f4a261"],
];

/** Little houses of the village far away: [x, width]. */
const HOUSES = [
  [1250, 34],
  [1292, 28],
  [1330, 38],
];

/** Grass tufts: [x, y]; they grow with depth like everything else. */
const TUFTS = [
  [60, 470],
  [380, 470],
  [820, 400],
  [1180, 470],
  [1560, 520],
  [300, 760],
  [560, 700],
  [920, 560],
  [1300, 610],
  [40, 960],
  [380, 990],
  [760, 990],
  [1120, 820],
  [1580, 980],
  [1250, 900],
  [640, 780],
];

function Woods() {
  return (
    <g>
      {WOODS.map(([x, y, r, fill]) => (
        <g key={x}>
          <rect x={x - 2.5} y={y} width="5" height="16" fill="#a68a64" />
          <circle cx={x} cy={y - r * 0.4} r={r} fill={fill} />
          <circle cx={x - r * 0.3} cy={y - r * 0.7} r={r * 0.35} fill="#fff" opacity="0.25" />
        </g>
      ))}
    </g>
  );
}

function Village() {
  return (
    <g>
      {HOUSES.map(([x, w]) => (
        <g key={x}>
          <rect x={x} y={286} width={w} height={22} fill="#f1e3c8" />
          <path d={`M${x - 4} 288 L${x + w / 2} ${270} L${x + w + 4} 288 Z`} fill="#d08c60" />
          <rect x={x + w / 2 - 4} y={294} width="8" height="8" fill="#a5b8c9" />
        </g>
      ))}
      {/* The church tower */}
      <rect x="1376" y="252" width="22" height="56" fill="#efe1c6" />
      <path d="M1372 254 L1387 222 L1402 254 Z" fill="#8a9a8c" />
      <path d="M1387 222 v-10 M1382 216 h10" stroke="#8a9a8c" strokeWidth="2" />
      <circle cx="1387" cy="268" r="5" fill="#d9c7a4" />
    </g>
  );
}

/** The ploughed field far back: brown furrows running towards the horizon. */
function Field() {
  const bottom = 404;
  const furrows = Array.from({ length: 15 }, (_, i) => {
    const x = 270 + i * 40;
    return `M${x} ${bottom} L${towardsHorizon(x, bottom, HORIZON + 2)} ${HORIZON + 2}`;
  }).join(" ");
  return (
    <g>
      <path d={`M300 ${HORIZON} H780 Q820 370 836 ${bottom} H244 Q270 370 300 ${HORIZON} Z`} fill="#b08968" />
      <path d={furrows} stroke="#8d6e57" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      <path d={`M300 ${HORIZON} H780 Q820 370 836 ${bottom} H244 Q270 370 300 ${HORIZON} Z`} fill="none" stroke="#c8a27a" strokeWidth="4" />
      {/* Stubble field on the right */}
      <path d={`M920 ${HORIZON} H1600 V392 Q1300 400 1040 380 Q960 370 920 ${HORIZON} Z`} fill="#e9d48a" />
      <path
        d={Array.from({ length: 16 }, (_, i) => {
          const x = 980 + i * 40;
          return `M${x} 388 L${towardsHorizon(x, 388, HORIZON + 2)} ${HORIZON + 2}`;
        }).join(" ")}
        stroke="#d4b860"
        strokeWidth="3"
        strokeDasharray="4 6"
        opacity="0.8"
      />
    </g>
  );
}

/** The sandy path from the front up to the pumpkin stall. */
function Path() {
  const d = "M700 1010 C760 880 870 790 846 680 C828 600 850 520 872 452 L936 452 C948 520 968 600 976 690 C990 820 1060 900 1130 1010 Z";
  return (
    <g>
      <path d={d} fill="#e6c48f" />
      <path d={d} fill="none" stroke="#d4a373" strokeWidth="5" />
      <g fill="#c99a63" opacity="0.7">
        {[
          [880, 500],
          [904, 560],
          [870, 640],
          [930, 700],
          [880, 780],
          [960, 830],
          [850, 900],
          [1000, 960],
          [900, 990],
        ].map(([x, y]) => (
          <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={7 * depthScale(y)} ry={4 * depthScale(y)} />
        ))}
      </g>
    </g>
  );
}

/** A carpet of leaves below a tree crown, around (x, y). */
function LeafCarpet({ x, y, rx, colours, seed }: { x: number; y: number; rx: number; colours: string[]; seed: number }) {
  const s = depthScale(y);
  return (
    <g>
      <ellipse cx={x} cy={y} rx={rx} ry={rx * 0.16} fill={colours[0]} opacity="0.35" />
      {Array.from({ length: 22 }, (_, i) => {
        const a = ((i * 137.5 + seed) * Math.PI) / 180;
        const d = ((i * 37) % 100) / 100;
        return (
          <Leaf
            key={i}
            x={x + Math.cos(a) * rx * d}
            y={y + Math.sin(a) * rx * 0.15 * d}
            angle={(i * 71 + seed) % 360}
            scale={s * 1.8}
            colour={colours[i % colours.length]}
          />
        );
      })}
    </g>
  );
}

const TREE_FOOT = (place: { x: number; y: number }) => [place.x, place.y] as const;

export function Background() {
  const [kx, ky] = TREE_FOOT(CHESTNUT_TREE);
  const [mx, my] = TREE_FOOT(MAPLE);
  return (
    <>
      <defs>
        <linearGradient id="he-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8ec5e8" />
          <stop offset="1" stopColor="#fde8cf" />
        </linearGradient>
        <linearGradient id="he-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9d38f" />
          <stop offset="0.4" stopColor="#bcc66f" />
          <stop offset="1" stopColor="#94ad56" />
        </linearGradient>
        <linearGradient id="he-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde8cf" stopOpacity="0" />
          <stop offset="1" stopColor="#fde8cf" stopOpacity="0.75" />
        </linearGradient>
        <radialGradient id="he-sunglow">
          <stop offset="0" stopColor="#fff3b0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff3b0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height={HORIZON + 10} fill="url(#he-sky)" />
      <circle cx="1540" cy="150" r="130" fill="url(#he-sunglow)" />
      <Cloud x={1180} y={200} scale={0.34} className="he-cloud" />
      <Cloud x={300} y={222} scale={0.26} className="he-cloud he-cloud-slow" />
      <path d="M0 292 Q180 256 380 280 T780 270 T1180 268 T1600 262 V340 H0 Z" fill="#e8d9b0" />
      <Village />
      <Woods />
      <rect y="236" width="1600" height="80" fill="url(#he-haze)" />
      <path d="M0 312 Q220 290 460 306 T900 300 T1300 300 T1600 306 V340 H0 Z" fill="#cdbf7e" />
      <rect y={HORIZON} width="1600" height={1000 - HORIZON} fill="url(#he-ground)" />
      <Field />
      {/* The boy's little hill */}
      <ellipse cx={BOY.x} cy={BOY.y + 6} rx="128" ry="34" fill="#a9bd60" />
      <ellipse cx={BOY.x - 20} cy={BOY.y - 4} rx="80" ry="16" fill="#c7d57e" opacity="0.7" />
      <Path />
      {/* Small puddles from the last rain */}
      <ellipse cx="420" cy="716" rx="40" ry="8" fill="#9cc3dd" opacity="0.8" />
      <ellipse cx="1296" cy="770" rx="34" ry="7" fill="#9cc3dd" opacity="0.8" />
      <LeafCarpet x={kx} y={ky + 4} rx={190} colours={["#e9c46a", "#f4a261", "#bc6c25"]} seed={10} />
      <LeafCarpet x={mx} y={my + 4} rx={150} colours={["#d62828", "#e85d04", "#faa307"]} seed={40} />
      <FallenLeaves seed="herbst" />
      <g stroke="#7f9a45" strokeWidth="5" strokeLinecap="round" fill="none">
        {TUFTS.map(([x, y]) => (
          <path key={`${x}-${y}`} d="M0 0 q4 -24 12 -30 M10 0 q0 -26 -6 -36 M20 0 q2 -20 12 -26" transform={`translate(${x} ${y}) scale(${depthScale(y)})`} />
        ))}
      </g>
      <g transform={transformOf(STAND)}>
        <StandBack />
      </g>
      {/* A few more leaves in the wind colours, near the front */}
      {[
        [140, 990, 0],
        [1460, 996, 2],
        [820, 940, 4],
      ].map(([x, y, c]) => (
        <Leaf key={x} x={x} y={y} angle={x % 360} scale={2.2} colour={LEAF_COLOURS[c]} />
      ))}
    </>
  );
}
