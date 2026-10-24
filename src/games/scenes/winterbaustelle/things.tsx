import { Hideout } from "../hideout";
import { INK, Inside, nth } from "../shared";
import { ICE, SNOW, SNOW_SHADE, glint, vars } from "./parts";

// Things of the winter site. Each drawing stands with its foot point on (0, 0), except the icicles
// and the Christmas tree, which hang on the house and stand on the crane and use their coordinates.

/** Half the width of the igloo's dome at height y (it is half an ellipse). */
const domeX = (y: number) => 120 * Math.sqrt(1 - (y / 108) ** 2);
const DOOR = "M-40 0 V-30 Q-40 -50 -10 -50 Q20 -50 20 -30 V0 Z";

/** An igloo of snow blocks; the light goes on inside and someone peeks out of the door. */
export function Iglu() {
  return (
    <>
      <path d="M36 -102 V-150" stroke={INK} strokeWidth="3" />
      <path className="wb-iglu-flag" d="M36 -150 L66 -141 L36 -132 Z" fill="#e63946" style={{ transformOrigin: "36px -141px" }} />
      <g className="wb-iglu-dome" style={{ transformOrigin: "0px 0px" }}>
        <path d="M-120 0 A120 108 0 0 1 120 0 Z" fill="#eef5fc" />
        <path d="M40 -102 A120 108 0 0 1 120 0 H92 Q96 -60 40 -102 Z" fill={SNOW_SHADE} />
        <g stroke="#c9dcf0" strokeWidth="3" fill="none" strokeLinecap="round">
          {[-30, -60, -84].map((y) => (
            <path key={y} d={`M${-domeX(y)} ${y} Q0 ${y - 8} ${domeX(y)} ${y}`} />
          ))}
          <path d="M-80 0 V-30 M-30 -30 V-60 M30 -30 V-60 M80 0 V-30 M-60 -60 V-84 M0 -60 V-84 M56 -60 V-84 M-26 -84 V-104 M28 -84 V-102 M100 -30 V0" />
        </g>
        <ellipse cx="-52" cy="-68" rx="24" ry="10" fill="#fff" transform="rotate(-35 -52 -68)" />
        <path d="M-64 0 V-38 Q-64 -72 -10 -72 Q44 -72 44 -38 V0 Z" fill="#f7fbff" stroke="#c9dcf0" strokeWidth="3" />
        <path d={DOOR} fill="#35577a" />
        <path className="wb-iglu-glow" d={DOOR} fill="#ffd166" />
        {/* Who lives in the igloo? Someone else every time. */}
        <Inside d={DOOR}>
          <Hideout x={-40} y={-50} w={60} h={50} size={44} />
        </Inside>
      </g>
      <g className="wb-iglu-sparkle" fill="#fff">
        {[
          [-96, -84],
          [70, -112],
          [104, -40],
        ].map(([x, y], i) => (
          <path key={x} d={glint(x, y, 9)} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** A fire barrel to warm your hands at; the fire flares, sparks fly and smoke rises. */
export function Feuertonne() {
  return (
    <>
      <ellipse cx="0" cy="2" rx="50" ry="7" fill="#b8cde3" />
      <g className="wb-feuer-smoke" fill="#ced4da">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={-4 + i * 6} cy="-150" r="11" style={nth(i)} />
        ))}
      </g>
      <g className="wb-feuer-sparks" fill="#ffb703">
        {[
          [-12, -112],
          [4, -120],
          [14, -110],
          [-2, -126],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="3.5" style={vars(i, { "--dx": `${(i % 2 ? 1 : -1) * (10 + i * 6)}px` })} />
        ))}
      </g>
      <g className="wb-feuer-flames" style={{ transformOrigin: "0px -98px" }}>
        <path d="M-28 -98 Q-32 -122 -14 -132 Q-14 -118 -4 -114 Q-8 -140 8 -152 Q8 -132 18 -126 Q24 -138 22 -146 Q38 -122 28 -98 Z" fill="#ff8c42" />
        <path d="M-16 -98 Q-18 -114 -6 -120 Q-2 -110 4 -108 Q4 -126 14 -132 Q24 -114 16 -98 Z" fill="#ffd60a" />
      </g>
      <rect x="-34" y="-100" width="68" height="100" rx="6" fill="#5c677d" />
      <rect x="10" y="-100" width="24" height="100" fill="#2b2d42" opacity="0.18" />
      <rect x="-38" y="-106" width="76" height="10" rx="4" fill="#495057" />
      <rect x="-34" y="-70" width="68" height="6" fill="#495057" />
      <rect x="-34" y="-28" width="68" height="6" fill="#495057" />
      <ellipse cx="-18" cy="-44" rx="9" ry="6" fill="#b5651d" opacity="0.5" />
      <ellipse cx="20" cy="-12" rx="7" ry="4" fill="#b5651d" opacity="0.5" />
      <rect x="-28" y="-94" width="6" height="88" rx="3" fill="#fff" opacity="0.2" />
      {[
        [-16, -50],
        [0, -56],
        [16, -50],
        [-6, -40],
        [8, -40],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4.5" fill="#ff8c42" />
      ))}
      <g className="wb-feuer-glow" fill="#ffe066">
        {[
          [-16, -50],
          [0, -56],
          [16, -50],
          [-6, -40],
          [8, -40],
        ].map(([cx, cy], i) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="6.5" style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** A snow shovel stuck in a heap of snow; it scoops and throws the snow up. */
export function Schneeschaufel() {
  return (
    <>
      <g className="wb-schaufel-snow" fill={SNOW} stroke={SNOW_SHADE} strokeWidth="2">
        {[
          [4, -44],
          [16, -50],
          [-6, -48],
          [24, -40],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={6 + (i % 2) * 2} style={vars(i, { "--dx": `${-30 + i * 22}px` })} />
        ))}
      </g>
      <g className="wb-schaufel-heap" style={{ transformOrigin: "0px 0px" }}>
        <path d="M-74 0 Q-62 -40 -22 -46 Q18 -58 52 -30 Q70 -14 74 0 Z" fill={SNOW} />
        <path d="M20 -44 Q56 -30 74 0 H40 Q46 -24 20 -44 Z" fill={SNOW_SHADE} />
      </g>
      <g className="wb-schaufel-tool" style={{ transformOrigin: "-4px -22px" }}>
        <path d="M-4 -24 L-42 -122" stroke="#a0522d" strokeWidth="7" strokeLinecap="round" />
        <path d="M-56 -118 L-30 -128" stroke={INK} strokeWidth="7" strokeLinecap="round" />
        <path d="M-22 -30 L14 -42 L22 -12 L-10 0 Z" fill="#4895ef" />
        <path d="M-22 -30 L14 -42" stroke="#3a7bd5" strokeWidth="4" strokeLinecap="round" />
        <path d="M-14 -24 Q0 -36 14 -32 L16 -24 Q2 -20 -12 -18 Z" fill={SNOW} />
      </g>
      <path d="M-62 0 Q-30 -24 0 -20 Q30 -24 62 0 Z" fill={SNOW} />
    </>
  );
}

// Paw prints of the fox, heading right: [x, y].
const PRINTS = [
  [-196, -6],
  [-156, -20],
  [-116, -6],
  [-76, -20],
  [-36, -6],
  [4, -20],
  [44, -6],
  [84, -20],
] as const;

/** A trail of fox paw prints in the snow; they light up one after the other. */
export function Fussspuren() {
  return (
    <>
      {PRINTS.map(([x, y], i) => (
        <g key={x} className="wb-spur" style={vars(i)}>
          <ellipse cx={x} cy={y} rx="9" ry="6" fill="#a9c1da" />
          {[
            [10, -6],
            [14, -2],
            [14, 3],
            [10, 7],
          ].map(([dx, dy]) => (
            <circle key={dy} cx={x + dx} cy={y + dy} r="2.6" fill="#a9c1da" />
          ))}
          <ellipse className="wb-spur-glow" cx={x + 4} cy={y} rx="16" ry="11" fill="#4dabf7" />
        </g>
      ))}
      <g className="wb-spur-sparkle" fill="#fff">
        <path d={glint(120, -24, 12)} />
      </g>
    </>
  );
}

// Icicles under the window sills of the house: [x, length], in the house's coordinates.
const ICICLES = [
  [942, 16],
  [953, 30],
  [964, 14],
  [976, 26],
  [988, 18],
  [1000, 32],
  [1010, 12],
  [1112, 22],
  [1124, 34],
  [1136, 16],
  [1148, 28],
  [1160, 14],
  [1172, 30],
] as const;

/** Icicles hanging under both window sills; they wobble, glitter and drip. */
export function Eiszapfen() {
  return (
    <>
      {ICICLES.map(([x, len], i) => (
        <g key={x} className="wb-eis-zapfen" style={nth(i % 5)}>
          <path
            d={`M${x - 5} 492 Q${x - 1} ${492 + len * 0.5} ${x} ${492 + len} Q${x + 1} ${492 + len * 0.5} ${x + 5} 492 Z`}
            fill={ICE}
            stroke="#9fd3f5"
            strokeWidth="1"
          />
          <path d={`M${x - 2} 494 L${x - 1} ${492 + len * 0.6}`} stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      ))}
      <g className="wb-eis-drop" fill="#8ecae6">
        {[
          [953, 526],
          [1124, 530],
          [1000, 528],
        ].map(([cx, cy], i) => (
          <circle key={cx} cx={cx} cy={cy} r="3" style={nth(i)} />
        ))}
      </g>
      <g className="wb-eis-glint" fill="#fff">
        {[
          [970, 506],
          [1142, 508],
        ].map(([x, y], i) => (
          <path key={x} d={glint(x, y, 9)} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

// Coloured lights on the Christmas tree: [x, y, colour].
const LIGHTS = [
  [542, 102, "#ff5d73"],
  [556, 98, "#ffd60a"],
  [571, 102, "#4dabf7"],
  [584, 106, "#69db7c"],
  [546, 80, "#ffd60a"],
  [561, 82, "#ff5d73"],
  [575, 78, "#69db7c"],
  [552, 58, "#4dabf7"],
  [567, 56, "#ff5d73"],
] as const;

/** A little Christmas tree on top of the crane's jib, in the crane's coordinates; its lights blink and the star spins. */
export function Weihnachtsbaum() {
  return (
    <>
      <circle className="wb-xmas-glow" cx="560" cy="28" r="22" fill="#fff3b0" />
      <g className="wb-xmas-tree" style={{ transformOrigin: "560px 118px" }}>
        <rect x="555" y="104" width="10" height="14" fill="#8d5a2b" />
        <path d="M530 108 L560 70 L590 108 Z" fill="#2d6a4f" />
        <path d="M535 88 L560 50 L585 88 Z" fill="#40916c" />
        <path d="M541 66 L560 32 L579 66 Z" fill="#52b788" />
        <g fill={SNOW}>
          <path d="M530 108 Q545 102 560 106 Q575 102 590 108 Q575 112 560 109 Q545 112 530 108 Z" />
          <path d="M535 88 Q548 83 560 86 Q572 83 585 88 Q572 91 560 89 Q548 91 535 88 Z" />
          <path d="M541 66 Q550 62 560 65 Q570 62 579 66 Q570 69 560 67 Q550 69 541 66 Z" />
        </g>
        <path d="M538 100 Q560 92 586 104 M542 80 Q560 74 580 78 M548 58 Q560 54 572 56" stroke="#ffd60a" strokeWidth="1.5" fill="none" />
        {LIGHTS.map(([cx, cy, colour], i) => (
          <circle key={`${cx}-${cy}`} className="wb-xmas-light" cx={cx} cy={cy} r="3.6" fill={colour} style={nth(i % 3)} />
        ))}
        <path
          className="wb-xmas-star"
          d="M560 18 L563.5 25.5 L572 26 L565.5 31.5 L567.5 40 L560 35.5 L552.5 40 L554.5 31.5 L548 26 L556.5 25.5 Z"
          fill="#ffd60a"
          stroke="#f4a100"
          strokeWidth="1.5"
          strokeLinejoin="round"
          style={{ transformOrigin: "560px 30px" }}
        />
      </g>
    </>
  );
}
