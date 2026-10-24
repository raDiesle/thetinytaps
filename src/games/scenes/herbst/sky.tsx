import { CHEEK, Eye, Face, INK, nth } from "../shared";
import { LEAF_COLOURS, Leaf } from "../weather";
import { BOY, BOY_HAND } from "./layout";

// Things in the autumn sky: the wind as a puffing cloud, the wild geese flying
// south and the kite, whose string runs down into the boy's hand.

/** The wind: a cloud that puffs its cheeks and blows gusts and leaves to the right. Left puff at (0, 0). */
export function Wind() {
  return (
    <>
      <g className="he-wind-gusts" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.85">
        <path className="he-wind-gust" style={nth(0)} d="M150 -22 q40 -14 80 0 q40 14 80 0" />
        <path className="he-wind-gust" style={nth(1)} d="M156 6 q50 -12 100 0 q26 6 38 -10 q6 -16 -10 -16 q-12 0 -10 12" />
        <path className="he-wind-gust" style={nth(2)} d="M146 34 q40 10 80 0 q20 -6 34 0" />
      </g>
      <g className="he-wind-leaves">
        {[
          [170, -10, 0],
          [190, 18, 3],
          [160, 2, 2],
          [180, -30, 1],
        ].map(([x, y, c], i) => (
          <g key={i} className="he-wind-leaf" style={nth(i)}>
            <Leaf x={x} y={y} angle={i * 70} scale={2.2} colour={LEAF_COLOURS[c]} />
          </g>
        ))}
      </g>
      <g className="he-wind-body" style={{ transformOrigin: "120px 0px" }}>
        <g fill="#fff">
          <circle cx="0" cy="0" r="42" />
          <circle cx="50" cy="-26" r="52" />
          <circle cx="104" cy="-6" r="42" />
          <rect x="0" y="-4" width="104" height="42" rx="20" />
        </g>
        <ellipse cx="54" cy="34" rx="66" ry="8" fill="#dbe9fb" />
        <ellipse cx="34" cy="-46" rx="18" ry="9" fill="#fff" opacity="0.8" />
        {/* A face looking right, with the mouth round for blowing */}
        <g className="he-wind-cheeks" style={{ transformOrigin: "84px 2px" }}>
          <circle cx="62" cy="8" r="11" fill={CHEEK} opacity="0.55" />
          <circle cx="112" cy="6" r="9" fill={CHEEK} opacity="0.55" />
        </g>
        <Eye cx={74} cy={-14} r={5} />
        <Eye cx={100} cy={-16} r={5} />
        <path d="M66 -28 q8 -6 16 -2 M94 -30 q8 -5 14 0" stroke={INK} strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <ellipse className="he-wind-mouth" cx="130" cy="8" rx="8" ry="9" fill="#e5383b" style={{ transformOrigin: "130px 8px" }} />
      </g>
    </>
  );
}

/** One goose flying left; (x, y) is the middle of its body. */
function Goose({ x, y, i }: { x: number; y: number; i: number }) {
  return (
    <g className="he-gans" style={nth(i)}>
      <path d={`M${x + 22} ${y - 2} l16 -6 l-2 12 Z`} fill="#6c757d" />
      <ellipse cx={x} cy={y} rx="27" ry="11" fill="#adb5bd" />
      <ellipse cx={x + 2} cy={y + 4} rx="20" ry="6" fill="#f1f3f5" />
      <path d={`M${x - 20} ${y - 4} Q${x - 32} ${y - 10} ${x - 40} ${y - 10}`} stroke="#868e96" strokeWidth="8" strokeLinecap="round" fill="none" />
      <g className="he-gans-head" style={{ transformOrigin: `${x - 30}px ${y - 8}px` }}>
        <circle cx={x - 42} cy={y - 11} r="8" fill="#868e96" />
        <path d={`M${x - 48} ${y - 13} l-12 3 l11 4 Z`} fill="#fb8500" />
        <Eye cx={x - 44} cy={y - 13} r={1.9} />
      </g>
      <path
        className="he-gans-wing"
        d={`M${x - 10} ${y - 6} Q${x - 2} ${y - 40} ${x + 22} ${y - 34} Q${x + 14} ${y - 16} ${x + 8} ${y - 4} Z`}
        fill="#868e96"
        style={{ transformOrigin: `${x - 2}px ${y - 5}px` }}
      />
    </g>
  );
}

const GEESE = [
  [0, 0],
  [56, -30],
  [112, -58],
  [56, 30],
  [112, 58],
];

export function Wildgaense() {
  return (
    <g className="he-gaense-fly">
      {GEESE.map(([x, y], i) => (
        <Goose key={i} x={x} y={y} i={i} />
      ))}
    </g>
  );
}

/** Where the boy holds the string, in the picture. */
const HAND = [BOY.x + BOY_HAND[0] * BOY.scale, BOY.y + BOY_HAND[1] * BOY.scale];
const BOWS = [
  [1026, 244, "#4dabf7"],
  [1020, 290, "#52b788"],
  [1022, 332, "#f77f00"],
] as const;

/** The kite, drawn where it flies (no placement): it sways on its string, which stays in the boy's hand. */
export function Drachen() {
  const [hx, hy] = HAND;
  return (
    <g className="he-drachen-fly" style={{ transformOrigin: `${hx}px ${hy}px` }}>
      <path className="he-drachen-string" d={`M1030 130 Q1044 ${(130 + hy) / 2 + 30} ${hx} ${hy}`} stroke={INK} strokeOpacity="0.55" strokeWidth="2" fill="none" />
      <g className="he-drachen-tail" style={{ transformOrigin: "1030px 200px" }}>
        <path d="M1030 200 q-16 22 -4 44 q12 22 -6 46 q-14 20 -2 42" stroke={INK} strokeOpacity="0.6" strokeWidth="2.5" fill="none" />
        {BOWS.map(([x, y, c], i) => (
          <path key={i} className="he-drachen-bow" style={nth(i)} d={`M${x} ${y} l-14 -8 v16 Z M${x} ${y} l14 -8 v16 Z`} fill={c} />
        ))}
      </g>
      <g className="he-drachen-kite" style={{ transformOrigin: "1030px 124px" }}>
        <path d="M1030 46 L982 112 L1030 112 Z" fill="#e63946" />
        <path d="M1030 46 L1078 112 L1030 112 Z" fill="#ffd60a" />
        <path d="M982 112 L1030 202 L1030 112 Z" fill="#ffd60a" />
        <path d="M1078 112 L1030 202 L1030 112 Z" fill="#e63946" />
        <path d="M1030 46 V202 M982 112 H1078" stroke="#9c6644" strokeWidth="3" />
        <path d="M1030 46 L982 112 L1030 202 L1078 112 Z" fill="none" stroke="#c1121f" strokeWidth="3" strokeLinejoin="round" />
        <path d="M1004 76 L992 96" stroke="#fff" strokeOpacity="0.6" strokeWidth="5" strokeLinecap="round" />
        <circle cx="1030" cy="122" r="22" fill="#fff4d6" />
        <Face cx={1030} cy={118} size={1.05} />
      </g>
    </g>
  );
}
