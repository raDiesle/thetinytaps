import { INK, SKIN, nth } from "../shared";
import { Arm, Head, Hearts, Leg, Notes, Sparkles } from "./parts";

// Mum and her chips on the towel (drawn in the towel's coordinates, see TOWEL in layout.ts)
// and the child with the fishing net. Foot point at (0, 0).

/** Mum sits on the towel: she pushes her sunglasses up, blinks, waves and sends hearts. */
export function Mama() {
  return (
    <>
      {/* Legs stretched out to the right */}
      <path d="M10 -20 L104 -14" stroke={SKIN} strokeWidth="18" strokeLinecap="round" />
      <path d="M14 -34 L100 -30" stroke={SKIN} strokeWidth="17" strokeLinecap="round" />
      <ellipse cx="110" cy="-24" rx="8" ry="11" fill={SKIN} />
      <ellipse cx="106" cy="-38" rx="8" ry="11" fill={SKIN} />
      <path d="M-14 -40 Q-16 -10 20 -12 Q40 -14 40 -36 Z" fill="#9775fa" />
      {/* Body in a swimsuit, leaning back on one arm */}
      <Arm x1={-20} y1={-104} x2={-44} y2={-20} sleeve={SKIN} w={12} />
      <path d="M-26 -36 Q-30 -88 -6 -112 Q16 -112 26 -88 Q34 -60 30 -36 Z" fill="#9775fa" />
      <path d="M-12 -100 Q-8 -70 -12 -44" stroke="#fff" strokeOpacity="0.35" strokeWidth="5" strokeLinecap="round" fill="none" />
      <Head cx={0} cy={-136} r={26} hair="#a0522d" style="bun" />
      {/* Sunglasses: on her nose at rest, pushed up while she plays */}
      <g className="sd-mama-glasses">
        <rect x="-21" y="-145" width="18" height="12" rx="5" fill={INK} />
        <rect x="3" y="-145" width="18" height="12" rx="5" fill={INK} />
        <path d="M-3 -140 H3" stroke={INK} strokeWidth="3" />
        <path d="M-17 -142 l6 0" stroke="#fff" strokeOpacity="0.6" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <g className="sd-mama-arm" style={{ transformOrigin: "22px -100px" }}>
        <Arm x1={22} y1={-100} x2={52} y2={-60} sleeve={SKIN} w={12} />
      </g>
      <Hearts
        className="sd-mama-hearts"
        spots={[
          [40, -170],
          [64, -150],
          [20, -190],
        ]}
        r={9}
      />
    </>
  );
}

// Chips standing up in the tray: [x, height, tilt].
const CHIPS = [
  [-22, 34, -14],
  [-12, 40, -6],
  [-2, 44, 2],
  [8, 38, 10],
  [18, 32, 16],
  [-6, 30, -20],
];

/** The chips in their tray, on the towel: the chips hop out one after the other, the ketchup glistens. */
export function Pommes() {
  return (
    <g transform="translate(170 0)">
      {CHIPS.map(([x, h, tilt], i) => (
        <g key={i} className="sd-pommes-chip" style={{ ...nth(i), transformOrigin: `${x}px -20px` }}>
          <rect x={x - 4} y={-20 - h} width="9" height={h} rx="3" fill="#ffd43b" transform={`rotate(${tilt} ${x} -20)`} />
        </g>
      ))}
      <path d="M-34 -26 H34 L28 -2 Q26 2 20 2 H-20 Q-26 2 -28 -2 Z" fill="#fff" />
      <path d="M-30 -18 H30 M-28 -8 H28" stroke="#e63946" strokeWidth="5" />
      <path d="M36 -10 Q36 -24 50 -22 Q62 -18 56 -6 Q48 2 36 -10 Z" fill="#e63946" />
      <circle cx="46" cy="-17" r="3" fill="#fff" opacity="0.7" />
      <Sparkles
        className="sd-pommes-sparkle"
        spots={[
          [-30, -70],
          [24, -76],
          [52, -36],
        ]}
        r={8}
        fill="#fff9db"
      />
      <Notes x={-30} y={-80} texts={["Mmh!"]} colour="#ffd43b" size={22} />
    </g>
  );
}

/** The child with the fishing net: it jumps, swings the net, waves and calls out. */
export function Kind() {
  return (
    <g className="sd-kind-hop">
      <Leg x1={-10} y1={-66} x2={-14} y2={-8} trousers={SKIN} shoe="#4dabf7" w={13} />
      <Leg x1={10} y1={-66} x2={14} y2={-8} trousers={SKIN} shoe="#4dabf7" w={13} />
      <path d="M-24 -76 H24 L26 -56 Q14 -50 0 -54 Q-14 -50 -26 -56 Z" fill="#1d3557" />
      <rect x="-24" y="-124" width="48" height="54" rx="16" fill="#40c057" />
      <path d="M-10 -110 l6 8 l6 -8 l6 8" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* The net on its long stick */}
      <g className="sd-kind-net" style={{ transformOrigin: "-44px -92px" }}>
        <path d="M-44 -92 L-92 -186" stroke="#c08552" strokeWidth="6" strokeLinecap="round" />
        <path d="M-114 -200 Q-110 -158 -96 -150 Q-80 -158 -78 -200 Z" fill="#fff" opacity="0.7" />
        <path d="M-108 -194 L-86 -160 M-96 -200 L-100 -152 M-84 -196 L-104 -162" stroke="#dee2e6" strokeWidth="2" />
        <ellipse cx="-96" cy="-200" rx="19" ry="7" fill="none" stroke="#ff922b" strokeWidth="5" />
      </g>
      <Arm x1={-22} y1={-112} x2={-44} y2={-92} sleeve="#40c057" w={12} />
      <g className="sd-kind-arm" style={{ transformOrigin: "22px -112px" }}>
        <Arm x1={22} y1={-112} x2={46} y2={-146} sleeve="#40c057" w={12} />
      </g>
      <Head cx={0} cy={-150} r={26} hair="#e9c46a" cap="#ff6b6b" />
      <Notes x={-70} y={-196} texts={["He!", "Hallo!"]} colour="#fff" size={26} />
    </g>
  );
}
