import { INK } from "@/games/scenes/shared";
import { GROUND } from "./types";

// The places of the fire brigade film, drawn standing on their ground at (0, 0) unless said otherwise. The sky and
// the ground reach far beyond the 1600 × 900 picture, so a screen of any shape sees no edge.

const FAR = 2400;

/** Sky, far hills and grass, from far left to far right; the ground below `GROUND`. */
export function Outdoors({ ground = "#ced4da" }: { ground?: string }) {
  return (
    <g>
      <rect x={-FAR} y={-FAR} width={FAR * 3} height={FAR + GROUND} fill="#a5d8ff" />
      <path d={`M${-FAR} 600 Q-200 470 300 560 Q700 460 1100 550 Q1500 470 1900 560 Q2300 480 ${FAR * 2} 560 V${GROUND} H${-FAR} Z`} fill="#b2f2bb" />
      <rect x={-FAR} y={GROUND - 90} width={FAR * 3} height="90" fill="#8ce99a" />
      <rect x={-FAR} y={GROUND} width={FAR * 3} height={FAR} fill={ground} />
      <circle cx="1420" cy="110" r="56" fill="#ffe066" />
    </g>
  );
}

/** The road in front of the houses: pavement, then the lanes with a dashed middle line. */
export function Road({ top = GROUND }: { top?: number }) {
  return (
    <g>
      <rect x={-FAR} y={top} width={FAR * 3} height="22" fill="#dee2e6" stroke={INK} strokeWidth="3" />
      <rect x={-FAR} y={top + 22} width={FAR * 3} height={FAR} fill="#868e96" />
      <path d={`M${-FAR} ${top + 90} H${FAR * 2}`} stroke="#fff" strokeWidth="8" strokeDasharray="60 50" />
    </g>
  );
}

/** A house of a street in the back, `w` wide and `h` high. */
export function BackHouse({ x, w, h, wall, roof }: { x: number; w: number; h: number; wall: string; roof: string }) {
  return (
    <g transform={`translate(${x} ${GROUND})`}>
      <rect x={-w / 2} y={-h} width={w} height={h} fill={wall} stroke={INK} strokeWidth="3" />
      <path d={`M${-w / 2 - 16} ${-h} L0 ${-h - w * 0.4} L${w / 2 + 16} ${-h} Z`} fill={roof} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      {Array.from({ length: Math.floor(h / 120) }, (_, row) =>
        [-w / 4, w / 4].map((wx) => (
          <rect key={`${row}${wx}`} x={wx - 22} y={-h + 34 + row * 110} width="44" height="54" rx="4" fill="#fff3bf" stroke={INK} strokeWidth="2.5" />
        )),
      )}
    </g>
  );
}

/** A round tree. */
export function RoundTree({ x, s = 1 }: { x: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${GROUND}) scale(${s})`}>
      <rect x="-14" y="-170" width="28" height="170" fill="#8d5a3b" stroke={INK} strokeWidth="3" />
      <circle cy="-210" r="80" fill="#51cf66" stroke={INK} strokeWidth="3" />
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
      <g fill="#40c057" stroke={INK} strokeWidth="4">
        <circle cx="-120" cy="-560" r="130" />
        <circle cx="120" cy="-560" r="140" />
        <circle cx="0" cy="-680" r="150" />
      </g>
      <path d="M-40 0 Q-30 -260 -34 -420 L34 -420 Q30 -260 40 0 Z" fill="#8d5a3b" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
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
      <rect x="-220" y="-420" width="440" height="420" fill="#ffe8cc" stroke={INK} strokeWidth="4" />
      <path d="M-260 -410 L0 -610 L260 -410 Z" fill="#c2410c" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <rect x="120" y="-580" width="44" height="90" fill="#a5a5a5" stroke={INK} strokeWidth="3" />
      {[
        [-110, -300],
        [110, -300],
        [-110, -130],
      ].map(([x, y]) => (
        <g key={`${x}${y}`}>
          <rect x={x - 50} y={y - 56} width="100" height="100" rx="6" fill={y < -200 && burning ? "#ffd8a8" : "#d0ebff"} stroke={INK} strokeWidth="4" />
          <path d={`M${x} ${y - 56} V${y + 44} M${x - 50} ${y - 6} H${x + 50}`} stroke={INK} strokeWidth="3" />
        </g>
      ))}
      <rect x="60" y="-170" width="100" height="170" fill="#5c3d2e" stroke={INK} strokeWidth="4" />
      <rect x="80" y="-150" width="60" height="150" fill="#3b2a20" />
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
      <circle cx="240" cy="-62" r="8" fill="#ffe066" stroke={INK} strokeWidth="2" />
      <rect x="-6" y="-56" width="12" height="16" rx="3" fill="#fa5252" stroke={INK} strokeWidth="2" />
      {hook && <circle cx="-6" cy="-30" r="7" fill="none" stroke={INK} strokeWidth="4" />}
      {[54, 194].map((x) => (
        <g key={x}>
          <circle cx={x} cy="-26" r="26" fill="#343a40" stroke={INK} strokeWidth="3" />
          <circle cx={x} cy="-26" r="10" fill="#ced4da" />
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
      <path
        d={`M${ROAD_END} ${GROUND} Q${ROAD_END + 120} ${GROUND + 6} ${ROAD_END + 180} ${GROUND + 140} Q${ROAD_END + 300} ${GROUND + 190} ${ROAD_END + 700} ${GROUND + 170} V${GROUND + 1600} H${ROAD_END} Z`}
        fill="#69db7c"
        stroke={INK}
        strokeWidth="4"
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
