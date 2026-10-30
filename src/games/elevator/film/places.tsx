import { INK } from "@/games/scenes/shared";
import { GROUND } from "./types";

// The places of the fire brigade film, drawn standing on their ground at (0, 0) unless said otherwise. The sky and
// the ground reach far beyond the 1600 × 900 picture, so a screen of any shape sees no edge.

const FAR = 2400;

/** A still cloud of three puffs, centred on (x, y). */
function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M-90 20 Q-112 20 -110 0 Q-108 -22 -80 -20 Q-74 -54 -36 -52 Q-14 -80 22 -66 Q52 -78 66 -44 Q104 -46 106 -12 Q110 20 82 20 Z"
        fill="#fff"
        stroke="#d0ebff"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path d="M-70 4 Q-20 14 60 4" stroke="#e7f5ff" strokeWidth="10" strokeLinecap="round" fill="none" />
    </g>
  );
}

/** Tufts of grass along the bottom of the meadow, from far left to far right. */
const TUFTS = (() => {
  let d = "";
  for (let x = -FAR; x < FAR * 2; x += 170) {
    const y = GROUND - 6;
    d += `M${x} ${y} l-6 -22 M${x} ${y} l2 -28 M${x} ${y} l10 -20 `;
  }
  return d;
})();

/** Sky with clouds and the sun, two rows of hills and grass, from far left to far right; the ground below `GROUND`. */
export function Outdoors({ ground = "#ced4da" }: { ground?: string }) {
  return (
    <g>
      <rect x={-FAR} y={-FAR} width={FAR * 3} height={FAR + GROUND} fill="#a5d8ff" />
      <rect x={-FAR} y="300" width={FAR * 3} height={GROUND - 300} fill="#bfe3ff" />
      <g fill="#ffe066" stroke="#fab005" strokeWidth="4">
        <path
          d="M1420 20 V-6 M1420 200 V226 M1330 110 H1304 M1510 110 H1536 M1356 46 L1338 28 M1484 174 L1502 192 M1484 46 L1502 28 M1356 174 L1338 192"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <circle cx="1420" cy="110" r="60" />
      </g>
      <Cloud x={220} y={170} />
      <Cloud x={820} y={110} s={0.8} />
      <Cloud x={1840} y={190} s={0.9} />
      <path d={`M${-FAR} 560 Q-300 420 200 500 Q600 400 1000 490 Q1400 410 1800 500 Q2300 420 ${FAR * 2} 500 V${GROUND} H${-FAR} Z`} fill="#d3f9d8" />
      <path
        d={`M${-FAR} 600 Q-200 470 300 560 Q700 460 1100 550 Q1500 470 1900 560 Q2300 480 ${FAR * 2} 560 V${GROUND} H${-FAR} Z`}
        fill="#b2f2bb"
        stroke="#8ce99a"
        strokeWidth="4"
      />
      <rect x={-FAR} y={GROUND - 90} width={FAR * 3} height="90" fill="#8ce99a" />
      <path d={`M${-FAR} ${GROUND - 90} H${FAR * 2}`} stroke="#69db7c" strokeWidth="4" />
      <path d={TUFTS} stroke="#51cf66" strokeWidth="5" strokeLinecap="round" />
      <rect x={-FAR} y={GROUND} width={FAR * 3} height={FAR} fill={ground} />
    </g>
  );
}

/** The road in front of the houses: pavement with its slabs and a kerb, then the lanes with a dashed middle line. */
export function Road({ top = GROUND }: { top?: number }) {
  return (
    <g>
      <rect x={-FAR} y={top} width={FAR * 3} height="22" fill="#dee2e6" stroke={INK} strokeWidth="3" />
      <path d={`M${-FAR} ${top + 3} H${FAR * 2}`} stroke="#fff" strokeWidth="4" />
      <path d={`M${-FAR} ${top + 11} H${FAR * 2}`} stroke="#adb5bd" strokeWidth="18" strokeDasharray="3 117" />
      <rect x={-FAR} y={top + 22} width={FAR * 3} height="10" fill="#495057" />
      <rect x={-FAR} y={top + 32} width={FAR * 3} height={FAR} fill="#868e96" />
      <path d={`M${-FAR} ${top + 92} H${FAR * 2}`} stroke="#fff" strokeWidth="8" strokeDasharray="60 50" />
    </g>
  );
}

/** A house of a street in the back, `w` wide and `h` high, standing on `base`: a roof with a chimney, framed windows
 * with sills, and a door with a step and a little lamp. */
export function BackHouse({ x, w, h, wall, roof, base = GROUND }: { x: number; w: number; h: number; wall: string; roof: string; base?: number }) {
  const rows = Math.floor((h - 110) / 110);
  return (
    <g transform={`translate(${x} ${base})`}>
      <rect x={w * 0.18} y={-h - w * 0.36} width={w * 0.14} height={w * 0.3} fill="#c2410c" stroke={INK} strokeWidth="3" />
      <rect x={w * 0.16} y={-h - w * 0.38} width={w * 0.18} height="10" fill="#a5a5a5" stroke={INK} strokeWidth="2.5" />
      <rect x={-w / 2} y={-h} width={w} height={h} fill={wall} stroke={INK} strokeWidth="3" />
      <path d={`M${-w / 2} -14 H${w / 2}`} stroke={INK} strokeOpacity="0.15" strokeWidth="24" />
      <path d={`M${-w / 2 - 16} ${-h} L0 ${-h - w * 0.4} L${w / 2 + 16} ${-h} Z`} fill={roof} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path
        d={`M${-w / 4 - 8} ${-h - w * 0.2} H${w / 4 + 8} M${-w / 2 + 6} ${-h - w * 0.07} H${w / 2 - 6}`}
        stroke={INK}
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      {Array.from({ length: rows }, (_, row) =>
        [-w / 4, w / 4].map((wx) => {
          const y = -h + 34 + row * 110;
          return (
            <g key={`${row}${wx}`}>
              <rect x={wx - 22} y={y} width="44" height="54" rx="4" fill="#fff3bf" stroke={INK} strokeWidth="2.5" />
              <path d={`M${wx} ${y} V${y + 54} M${wx - 22} ${y + 24} H${wx + 22}`} stroke={INK} strokeWidth="2" />
              <rect x={wx - 28} y={y + 54} width="56" height="8" rx="3" fill="#fff" stroke={INK} strokeWidth="2" />
            </g>
          );
        }),
      )}
      <rect x="-24" y="-92" width="48" height="92" rx="6" fill={roof} stroke={INK} strokeWidth="3" />
      <rect x="-14" y="-80" width="28" height="22" rx="3" fill="#fff3bf" stroke={INK} strokeWidth="2" />
      <circle cx="14" cy="-42" r="4" fill="#ffd43b" stroke={INK} strokeWidth="1.5" />
      <rect x="-32" y="-6" width="64" height="6" fill="#adb5bd" stroke={INK} strokeWidth="2" />
      <circle cx="-36" cy="-100" r="7" fill="#ffe066" stroke={INK} strokeWidth="2" />
      {w > 160 && (
        <g transform={`translate(${-w / 2 + 30} 0)`}>
          <circle cx="0" cy="-22" r="24" fill="#51cf66" stroke={INK} strokeWidth="2.5" />
          <circle cx="-6" cy="-30" r="4" fill="#ff8787" />
          <circle cx="8" cy="-18" r="4" fill="#ff8787" />
        </g>
      )}
    </g>
  );
}

/** A round tree: a trunk with a fork and a crown of overlapping leaf balls with light on the upper left. */
export function RoundTree({ x, s = 1 }: { x: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${GROUND}) scale(${s})`}>
      <ellipse cx="0" cy="0" rx="70" ry="10" fill="#000" opacity="0.1" />
      <path d="M-16 0 Q-12 -90 -14 -170 L14 -170 Q12 -90 16 0 Z" fill="#8d5a3b" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M-4 -110 Q-30 -150 -44 -190 M4 -130 Q26 -160 40 -200" stroke="#8d5a3b" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M-4 -40 Q2 -60 -2 -80" stroke="#6b4329" strokeWidth="3" strokeLinecap="round" fill="none" />
      <g fill="#51cf66" stroke={INK} strokeWidth="3">
        <circle cx="-50" cy="-196" r="52" />
        <circle cx="50" cy="-200" r="56" />
        <circle cy="-250" r="64" />
      </g>
      <path d="M-50 -196 m-30 -10 a36 36 0 0 1 30 -28 M-26 -276 a50 50 0 0 1 40 -22" stroke="#8ce99a" strokeWidth="8" strokeLinecap="round" fill="none" />
      <circle cx="30" cy="-176" r="9" fill="#2f9e44" />
      <circle cx="-14" cy="-226" r="7" fill="#2f9e44" />
    </g>
  );
}

/** The cat's tree: a thick trunk, a branch reaching left with the cat on it (`cat`), the crown behind. The cat sits
 * at `CAT_ON_BRANCH`, looking left. */
export const CAT_ON_BRANCH = [-170, -540] as const;

export function CatTree({ cat }: { cat: boolean }) {
  const [cx, cy] = CAT_ON_BRANCH;
  return (
    <g>
      <ellipse cx="0" cy="0" rx="150" ry="16" fill="#000" opacity="0.1" />
      <g fill="#40c057" stroke={INK} strokeWidth="4">
        <circle cx="-120" cy="-560" r="130" />
        <circle cx="120" cy="-560" r="140" />
        <circle cx="0" cy="-680" r="150" />
      </g>
      <path
        d="M-200 -600 a110 110 0 0 1 60 -80 M-70 -760 a130 130 0 0 1 90 -60 M120 -660 a120 120 0 0 1 80 20"
        stroke="#69db7c"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />
      <g fill="#2b8a3e">
        {[
          [-60, -620],
          [60, -720],
          [170, -560],
          [-180, -520],
          [10, -600],
        ].map(([lx, ly]) => (
          <ellipse key={`${lx}`} cx={lx} cy={ly} rx="14" ry="8" transform={`rotate(-30 ${lx} ${ly})`} />
        ))}
      </g>
      <path d="M-40 0 Q-30 -260 -34 -420 L34 -420 Q30 -260 40 0 Z" fill="#8d5a3b" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path
        d="M-14 -40 Q-8 -120 -14 -200 M12 -260 Q18 -320 10 -380 M-4 -120 Q2 -150 -2 -170"
        stroke="#6b4329"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M-40 0 Q-60 -6 -70 4 M40 0 Q64 -6 74 6" stroke="#8d5a3b" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path
        d={`M-20 -470 Q-120 -520 ${cx - 50} ${cy + 10} L${cx - 50} ${cy + 26} Q-120 -500 -10 -440 Z`}
        fill="#8d5a3b"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <g fill="#51cf66" stroke={INK} strokeWidth="4">
        <circle cx="150" cy="-470" r="90" />
        <circle cx="40" cy="-430" r="70" />
      </g>
      {cat && (
        <g className="fm-cat" transform={`translate(${cx} ${cy}) scale(-0.8 0.8)`}>
          <TreeCat />
        </g>
      )}
    </g>
  );
}

/** The cat of the tree: grey with stripes, so it stands out from the leaves. */
export function TreeCat() {
  return (
    <g>
      <path d="M-44 -40 Q-74 -44 -70 -82 Q-68 -96 -58 -96" stroke={INK} strokeWidth="16" strokeLinecap="round" fill="none" />
      <path d="M-44 -40 Q-74 -44 -70 -82 Q-68 -96 -58 -96" stroke="#adb5bd" strokeWidth="9" strokeLinecap="round" fill="none" />
      {[-34, -16, 14, 30].map((x) => (
        <rect key={x} x={x - 6} y="-34" width="12" height="34" rx="5" fill="#adb5bd" stroke={INK} strokeWidth="3.5" />
      ))}
      <ellipse cx="-4" cy="-40" rx="46" ry="22" fill="#adb5bd" stroke={INK} strokeWidth="4" />
      <path d="M-20 -60 V-46 M-6 -62 V-48 M8 -61 V-48" stroke="#495057" strokeWidth="5" strokeLinecap="round" />
      <path d="M26 -84 L24 -112 L44 -92 Z M50 -94 L66 -112 L68 -84 Z" fill="#adb5bd" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <circle cx="44" cy="-70" r="26" fill="#adb5bd" stroke={INK} strokeWidth="4" />
      <ellipse cx="50" cy="-56" rx="14" ry="9" fill="#fff" />
      <circle cx="40" cy="-74" r="3.5" fill={INK} />
      <circle cx="58" cy="-74" r="3.5" fill={INK} />
      <path d="M47 -64 l3 3 l3 -3 Z" fill="#ff8fa3" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M44 -58 q6 4 12 0" stroke={INK} strokeWidth="2" fill="none" />
    </g>
  );
}

/** Where the house's three flames burn: the two upper windows and the roof. */
export const FLAMES: [number, number][] = [
  [-110, -300],
  [110, -300],
  [80, -500],
];

/** A friendly flame standing on (0, 0), `size` 1 big, 0 out: it shrinks away, and a puff of steam rises. */
export function Flame({ size }: { size: number }) {
  return (
    <g>
      <g className="fm-flame-size" style={{ transform: `scale(${size})` }}>
        <g className="fm-flame">
          <path
            d="M0 0 Q-58 -6 -48 -64 Q-40 -100 -10 -136 Q-6 -100 14 -96 Q30 -130 22 -160 Q66 -120 56 -60 Q50 -4 0 0 Z"
            fill="#ff922b"
            stroke="#e8590c"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path d="M0 -6 Q-28 -10 -24 -42 Q-18 -64 0 -80 Q2 -60 14 -58 Q30 -40 22 -20 Q16 -6 0 -6 Z" fill="#ffe066" />
        </g>
      </g>
      {size === 0 && (
        <g className="fm-steam" fill="#f1f3f5" stroke="#ced4da" strokeWidth="3">
          <circle cx="-20" cy="-40" r="30" />
          <circle cx="20" cy="-60" r="34" />
          <circle cx="0" cy="-90" r="28" />
        </g>
      )}
    </g>
  );
}

/** The house that burns: two floors, its door open; `flames` gives each flame's size, and grey smoke rises over the
 * roof while one still burns. */
export function House({ flames }: { flames: number[] }) {
  const burning = flames.some((f) => f > 0);
  return (
    <g>
      <g className={`fm-smoke${burning ? "" : " gone"}`} fill="#adb5bd" opacity="0.8">
        {[
          [60, -620, 50],
          [120, -700, 64],
          [40, -780, 70],
        ].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} style={{ animationDelay: `${i * 0.5}s` }} />
        ))}
      </g>
      <rect x="120" y="-580" width="44" height="90" fill="#c2410c" stroke={INK} strokeWidth="3" />
      <rect x="112" y="-592" width="60" height="16" rx="3" fill="#a5a5a5" stroke={INK} strokeWidth="3" />
      <rect x="-220" y="-420" width="440" height="420" fill="#ffe8cc" stroke={INK} strokeWidth="4" />
      <path d="M-218 -212 H218" stroke="#f4d3ad" strokeWidth="10" />
      <path d="M-218 -20 H218" stroke={INK} strokeOpacity="0.12" strokeWidth="36" />
      <path d="M-260 -410 L0 -610 L260 -410 Z" fill="#c2410c" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M-196 -460 H196 M-130 -510 H130 M-66 -560 H66" stroke="#9a3412" strokeWidth="5" strokeLinecap="round" />
      <path d="M-264 -408 H264" stroke={INK} strokeWidth="10" strokeLinecap="round" />
      <path d="M-264 -408 H264" stroke="#9a3412" strokeWidth="4" strokeLinecap="round" />
      <circle cx="0" cy="-500" r="28" fill="#d0ebff" stroke={INK} strokeWidth="4" />
      <path d="M0 -528 V-472 M-28 -500 H28" stroke={INK} strokeWidth="3" />
      {[
        [-110, -300],
        [110, -300],
        [-110, -130],
      ].map(([x, y]) => (
        <g key={`${x}${y}`}>
          <rect x={x - 50} y={y - 56} width="100" height="100" rx="6" fill={y < -200 && burning ? "#ffd8a8" : "#d0ebff"} stroke={INK} strokeWidth="4" />
          <path d={`M${x - 36} ${y - 40} l20 -10`} stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity={y < -200 && burning ? 0 : 0.8} />
          <path d={`M${x} ${y - 56} V${y + 44} M${x - 50} ${y - 6} H${x + 50}`} stroke={INK} strokeWidth="3" />
          <rect x={x - 60} y={y + 44} width="120" height="12" rx="4" fill="#fff" stroke={INK} strokeWidth="3" />
        </g>
      ))}
      <rect x="-166" y="-74" width="112" height="22" rx="4" fill="#a0522d" stroke={INK} strokeWidth="3" />
      {[-150, -124, -96, -70].map((fx, i) => (
        <circle key={fx} cx={fx} cy="-80" r="10" fill={["#ff6b6b", "#ffd43b", "#f783ac", "#ff922b"][i]} stroke={INK} strokeWidth="2" />
      ))}
      <rect x="50" y="-180" width="120" height="180" rx="4" fill="#fff" stroke={INK} strokeWidth="4" />
      <rect x="60" y="-170" width="100" height="170" fill="#5c3d2e" stroke={INK} strokeWidth="4" />
      <rect x="80" y="-150" width="60" height="150" fill="#3b2a20" />
      <rect x="40" y="-8" width="140" height="8" fill="#adb5bd" stroke={INK} strokeWidth="2.5" />
      {FLAMES.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y + 40})`}>
          <Flame size={flames[i] ?? 0} />
        </g>
      ))}
    </g>
  );
}

/** A small car, standing on (0, 0) with its back at x 0 and its front to the right. */
export function SmallCar({ colour, hook = false }: { colour: string; hook?: boolean }) {
  return (
    <g>
      <path
        d="M0 -40 Q0 -78 30 -80 L70 -84 L100 -132 H180 L218 -84 Q246 -80 246 -50 V-30 H0 Z"
        fill={colour}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M108 -124 H140 V-86 H84 Z M148 -124 H176 L206 -86 H148 Z" fill="#d0ebff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M100 -116 l14 -4 M154 -116 l12 -4" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <path d="M144 -86 V-34 M86 -84 Q80 -60 84 -34" stroke={INK} strokeOpacity="0.45" strokeWidth="3" fill="none" />
      <rect x="152" y="-74" width="18" height="6" rx="3" fill={INK} opacity="0.5" />
      <rect x="96" y="-74" width="18" height="6" rx="3" fill={INK} opacity="0.5" />
      <path d="M6 -66 Q60 -74 120 -72 Q190 -72 240 -64" stroke="#fff" strokeOpacity="0.4" strokeWidth="6" strokeLinecap="round" fill="none" />
      <circle cx="238" cy="-62" r="9" fill="#ffe066" stroke={INK} strokeWidth="2" />
      <rect x="-6" y="-58" width="12" height="18" rx="3" fill="#fa5252" stroke={INK} strokeWidth="2" />
      <rect x="-8" y="-38" width="38" height="12" rx="5" fill="#ced4da" stroke={INK} strokeWidth="2.5" />
      <rect x="216" y="-38" width="38" height="12" rx="5" fill="#ced4da" stroke={INK} strokeWidth="2.5" />
      {hook && <circle cx="-6" cy="-30" r="7" fill="none" stroke={INK} strokeWidth="4" />}
      {[54, 194].map((x) => (
        <g key={x}>
          <circle cx={x} cy="-26" r="26" fill="#343a40" stroke={INK} strokeWidth="3" />
          <circle cx={x} cy="-26" r="12" fill="#ced4da" stroke={INK} strokeWidth="2" />
          <circle cx={x} cy="-26" r="4" fill="#868e96" />
        </g>
      ))}
    </g>
  );
}

/** The road ends at `ROAD_END` of the car's place, and the ditch dips down after it. */
export const ROAD_END = 1290;

/** The ditch beside the road, drawn in the picture's units. */
export function Ditch() {
  return (
    <g>
      {/* The road ends in a rounded edge of asphalt; after it the meadow, and the grass bank falls away into the ditch */}
      <path
        d={`M${ROAD_END - 30} ${GROUND} H${FAR * 2} V${GROUND + 1600} H${ROAD_END - 60} Q${ROAD_END - 10} ${GROUND + 200} ${ROAD_END - 30} ${GROUND} Z`}
        fill="#8ce99a"
      />
      <path
        d={`M${ROAD_END - 30} ${GROUND} Q${ROAD_END + 120} ${GROUND + 6} ${ROAD_END + 180} ${GROUND + 140} Q${ROAD_END + 300} ${GROUND + 190} ${ROAD_END + 700} ${GROUND + 170} V${GROUND + 1600} H${ROAD_END - 60} Q${ROAD_END - 10} ${GROUND + 200} ${ROAD_END - 30} ${GROUND} Z`}
        fill="#69db7c"
      />
      <path
        d={`M${ROAD_END - 60} ${GROUND + 1600} Q${ROAD_END - 10} ${GROUND + 200} ${ROAD_END - 30} ${GROUND}`}
        stroke="#495057"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M${ROAD_END - 30} ${GROUND} Q${ROAD_END + 120} ${GROUND + 6} ${ROAD_END + 180} ${GROUND + 140} Q${ROAD_END + 300} ${GROUND + 190} ${ROAD_END + 700} ${GROUND + 170}`}
        stroke={INK}
        strokeWidth="4"
        fill="none"
      />
      <path
        d={`M${ROAD_END + 40} ${GROUND + 120} q30 -20 60 0 M${ROAD_END + 80} ${GROUND + 260} q30 -20 60 0 M${ROAD_END + 400} ${GROUND + 260} q30 -20 60 0`}
        stroke="#51cf66"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M${ROAD_END + 190} ${GROUND + 150} Q${ROAD_END + 320} ${GROUND + 176} ${ROAD_END + 700} ${GROUND + 160}`}
        stroke="#4dabf7"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />
      {[30, 90, 400, 520].map((x) => (
        <path
          key={x}
          d={`M${ROAD_END + x} ${GROUND + (x > 200 ? 160 : 20)} l-8 -24 M${ROAD_END + x} ${GROUND + (x > 200 ? 160 : 20)} l8 -26`}
          stroke="#2b8a3e"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}

/** The car in the ditch: its back hook at `IN_DITCH`, tilted down into it; on the road it stands level with its
 * hook at `ON_ROAD`. Both lie on one line from the truck's winch, so the winch pulls it straight along the rope. */
export const IN_DITCH: [number, number] = [1296, 846];
export const ON_ROAD: [number, number] = [1008, 750];
export const DITCH_TILT = 18;
/** Where the hook is drawn from the car's back wheel line: the car stands on (0, 0) with its hook at (-6, -30). */
export const HOOK: [number, number] = [-6, -30];

/** The warning triangle, standing on (0, 0). */
export function WarningTriangle() {
  return (
    <g>
      <path d="M-8 0 L-30 18 M8 0 L30 18" stroke="#495057" strokeWidth="5" strokeLinecap="round" />
      <path d="M0 -84 L46 0 H-46 Z" fill="#fff" stroke="#e03131" strokeWidth="12" strokeLinejoin="round" />
      <path d="M0 -84 L46 0 H-46 Z" fill="none" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </g>
  );
}

/** The bell of the fire station, ringing while `ring`. */
export function AlarmBell({ ring }: { ring: boolean }) {
  return (
    <g>
      <rect x="-8" y="-70" width="16" height="30" fill="#495057" />
      <g className={ring ? "fm-ring" : undefined} style={{ transformOrigin: "0px -50px" }}>
        <path d="M-50 20 Q-50 -50 0 -50 Q50 -50 50 20 Z" fill="#e03131" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <circle cx="0" cy="26" r="12" fill="#fab005" stroke={INK} strokeWidth="3" />
      </g>
      {ring && (
        <g className="fm-ring-lines" stroke={INK} strokeWidth="5" strokeLinecap="round">
          <path d="M-70 -30 l-26 -14 M-74 4 h-30 M70 -30 l26 -14 M74 4 h30" />
        </g>
      )}
    </g>
  );
}

/** A jacket and helmet hanging on a hook of the station's wall, at (0, 0). */
export function Hook({ full }: { full: boolean }) {
  return (
    <g>
      <path d="M0 -10 V8 Q0 18 10 16" stroke="#495057" strokeWidth="6" strokeLinecap="round" fill="none" />
      {full && (
        <g>
          <path d="M-44 10 Q0 -6 44 10 L50 130 H-50 Z" fill="#2b3a8c" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M-48 90 H48 M-46 70 H46" stroke="#ffd43b" strokeWidth="6" />
          <path d="M-34 -6 Q-36 -44 0 -46 Q36 -44 34 -6 Z" fill="#e03131" stroke={INK} strokeWidth="3" />
          <path d="M-42 -6 H42" stroke="#c92a2a" strokeWidth="8" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
}
