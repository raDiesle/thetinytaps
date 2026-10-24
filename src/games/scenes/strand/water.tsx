import { CHEEK, Eye, INK, Inside, SKIN, nth } from "../shared";
import { Arm, Drops, FOAM, Head, Lid, Notes, Puffs, Ripples, SEA } from "./parts";

// At the water's edge: the waves, the child in the swim ring, the inflatable duck and dad on
// his air mattress. Foot point (0, 0) on the water line.

/** One rolling wave crest around x, curling over to the right. */
const crest = (x: number, h: number) =>
  `M${x - 90} 0 Q${x - 70} ${-h * 0.8} ${x - 4} ${-h} Q${x + 44} ${-h * 1.02} ${x + 62} ${-h * 0.66} Q${x + 40} ${-h * 0.74} ${x + 28} ${-h * 0.5} Q${x + 44} ${-h * 0.16} ${x + 90} 0 Z`;
const CRESTS = [
  [-150, 64],
  [0, 80],
  [150, 60],
];

/** The waves: they roll in one after the other, curl over and splash white foam. */
export function Wellen() {
  return (
    <>
      {CRESTS.map(([x, h], i) => (
        <g key={x} className="sd-welle" style={{ ...nth(i), transformOrigin: `${x}px 0px` }}>
          <path d={crest(x, h)} fill="#3d9be9" />
          <path d={crest(x, h * 0.62)} fill={SEA} opacity="0.8" transform={`translate(14 0)`} />
          <path
            d={`M${x - 70} ${-h * 0.8} Q${x - 30} ${-h * 1.04} ${x + 20} ${-h * 0.98} Q${x + 50} ${-h * 0.9} ${x + 62} ${-h * 0.66}`}
            stroke={FOAM}
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx={x + 58} cy={-h * 0.6} r="6" fill={FOAM} />
        </g>
      ))}
      <path d="M-240 0 Q-120 -10 0 0 Q120 10 240 0" stroke={FOAM} strokeWidth="8" strokeLinecap="round" fill="none" />
      <Puffs
        className="sd-welle-foam"
        spots={[
          [-200, -10],
          [-90, -20],
          [-20, -14],
          [60, -26],
          [130, -12],
          [210, -18],
        ]}
        r={13}
        fill={FOAM}
      />
      <Drops
        className="sd-welle-spray"
        spots={[
          [-100, -84],
          [-60, -100],
          [50, -110],
          [90, -96],
          [200, -80],
        ]}
        r={7}
        fill="#d0ebff"
      />
      <Notes x={-60} y={-110} texts={["Rausch!", "Platsch!"]} colour="#d0ebff" size={28} />
    </>
  );
}

/** The child in the swim ring: it bobs up and down, splashes with both arms and laughs. */
export function Schwimmring() {
  return (
    <>
      <Ripples cx={0} cy={-2} rx={70} />
      <g className="sd-ring-bob" style={{ transformOrigin: "0px 0px" }}>
        <rect x="-26" y="-74" width="52" height="40" rx="16" fill="#4dabf7" />
        <Head cx={0} cy={-96} r={24} hair="#6b4423" style="pigtails" />
        {/* The ring: red and white, the back half behind the child, the front half in front */}
        <g className="sd-ring-arm" style={{ transformOrigin: "-22px -52px" }}>
          <Arm x1={-22} y1={-52} x2={-58} y2={-74} sleeve={SKIN} w={11} />
        </g>
        <g className="sd-ring-arm sd-ring-arm-right" style={{ transformOrigin: "22px -52px" }}>
          <Arm x1={22} y1={-52} x2={58} y2={-74} sleeve={SKIN} w={11} />
        </g>
        <path
          d="M-60 -30 Q-60 -54 0 -54 Q60 -54 60 -30 Q60 -6 0 -6 Q-60 -6 -60 -30 Z M-30 -30 Q0 -20 30 -30 Q30 -40 0 -40 Q-30 -40 -30 -30 Z"
          fill="#e63946"
          fillRule="evenodd"
        />
        <path d="M-60 -30 Q-58 -18 -40 -12 L-30 -26 Z M40 -12 Q58 -18 60 -30 L30 -26 Z M-10 -6 H10 L8 -22 H-8 Z" fill="#fff" />
        <path d="M-48 -44 Q-30 -52 -10 -52" stroke="#fff" strokeOpacity="0.5" strokeWidth="5" strokeLinecap="round" fill="none" />
        <Inside d="M-60 -30 Q-60 -6 0 -6 Q60 -6 60 -30 Q60 -54 0 -54 Q-60 -54 -60 -30 Z">
          <rect x="-70" y="-18" width="140" height="20" fill={SEA} opacity="0.45" />
        </Inside>
      </g>
      <Drops
        className="sd-ring-splash"
        spots={[
          [-70, -60],
          [-56, -84],
          [62, -86],
          [76, -62],
        ]}
        r={7}
      />
      <Notes x={36} y={-140} texts={["Juhu!"]} colour="#ffd43b" size={24} />
    </>
  );
}

const MATTRESS = "M-126 -6 Q-130 -30 -110 -30 H110 Q130 -30 126 -6 Q124 6 106 6 H-108 Q-124 6 -126 -6 Z";

/** Dad on the air mattress: it rocks and tips, he waves his arms, his hat flies up and lands again. */
export function Luftmatratze() {
  return (
    <>
      <Ripples cx={0} cy={0} rx={120} />
      <g className="sd-matratze-rock" style={{ transformOrigin: "0px 0px" }}>
        <path d={MATTRESS} fill="#ffd43b" />
        <path d="M-80 -28 V4 M-40 -28 V4 M0 -28 V4 M40 -28 V4 M80 -28 V4" stroke="#fab005" strokeWidth="5" />
        <path d="M-106 -24 H100" stroke="#fff" strokeOpacity="0.5" strokeWidth="5" strokeLinecap="round" />
        <path d="M-126 -12 Q-128 -36 -100 -40 Q-80 -40 -82 -28 Z" fill="#ffe066" />
        {/* Dad lies on his back, his head on the left */}
        <g className="sd-matratze-leg" style={{ transformOrigin: "50px -40px" }}>
          <path d="M50 -40 L110 -46" stroke={SKIN} strokeWidth="14" strokeLinecap="round" />
          <ellipse cx="114" cy="-52" rx="7" ry="10" fill={SKIN} />
        </g>
        <path d="M30 -36 L104 -36" stroke={SKIN} strokeWidth="14" strokeLinecap="round" />
        <path d="M-50 -30 Q-50 -66 0 -66 Q44 -66 50 -30 Z" fill="#40c057" />
        <path d="M-50 -30 Q-20 -40 50 -30 L50 -24 H-50 Z" fill="#2f9e44" />
        <path d="M-30 -60 Q0 -70 30 -58" stroke="#fff" strokeOpacity="0.4" strokeWidth="4" strokeLinecap="round" fill="none" />
        <circle cx="-74" cy="-50" r="22" fill={SKIN} />
        <path d="M-90 -64 Q-74 -76 -56 -62" stroke="#6b4423" strokeWidth="7" strokeLinecap="round" fill="none" />
        <rect x="-88" y="-56" width="12" height="8" rx="3" fill={INK} />
        <rect x="-72" y="-56" width="12" height="8" rx="3" fill={INK} />
        <path d="M-76 -52 H-72" stroke={INK} strokeWidth="2" />
        <path d="M-80 -40 Q-72 -34 -64 -40" stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="-58" cy="-44" r="4" fill={CHEEK} opacity="0.55" />
        <g className="sd-matratze-arm" style={{ transformOrigin: "-40px -50px" }}>
          <path d="M-40 -50 L-30 -92" stroke={SKIN} strokeWidth="11" strokeLinecap="round" />
          <circle cx="-29" cy="-96" r="7" fill={SKIN} />
        </g>
        <g className="sd-matratze-hat" style={{ transformOrigin: "-76px -70px" }}>
          <ellipse cx="-76" cy="-70" rx="30" ry="8" fill="#f4d58d" />
          <path d="M-94 -72 Q-94 -94 -76 -94 Q-58 -94 -58 -72 Z" fill="#e9c46a" />
          <path d="M-94 -76 H-58" stroke="#e63946" strokeWidth="5" />
        </g>
        <Inside d={MATTRESS}>
          <rect x="-130" y="-4" width="260" height="14" fill={SEA} opacity="0.45" />
        </Inside>
      </g>
      <Drops
        className="sd-matratze-splash"
        spots={[
          [-134, -14],
          [-118, -32],
          [122, -30],
          [138, -12],
        ]}
        r={7}
      />
      <Notes x={-20} y={-110} texts={["Hoppla!"]} colour="#ffd43b" size={24} />
    </>
  );
}

const DUCK_RING = "M-66 -24 Q-68 -56 -30 -58 H40 Q72 -56 70 -24 Q68 4 30 6 H-30 Q-64 4 -66 -24 Z";

/** The inflatable duck: it bobs, nods its head, opens its beak and quacks. */
export function Badeente() {
  return (
    <>
      <Ripples cx={0} cy={0} rx={70} />
      <g className="sd-ente-bob" style={{ transformOrigin: "0px 0px" }}>
        <path d="M-66 -40 L-92 -64 L-74 -26 Z" fill="#fab005" />
        <path d={DUCK_RING} fill="#ffd43b" />
        <path d="M-44 -48 Q0 -58 40 -50" stroke="#fff" strokeOpacity="0.55" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M-36 -30 Q0 -20 40 -30" stroke="#fab005" strokeWidth="5" strokeLinecap="round" fill="none" />
        <g className="sd-ente-head" style={{ transformOrigin: "44px -52px" }}>
          <path d="M28 -54 Q24 -90 40 -104 L58 -104 Q62 -84 58 -54 Z" fill="#ffd43b" />
          <circle cx="50" cy="-110" r="24" fill="#ffd43b" />
          <circle cx="42" cy="-120" r="8" fill="#fff" opacity="0.5" />
          <path d="M66 -112 Q92 -112 92 -104 L68 -102 Z" fill="#ff922b" />
          <path className="sd-ente-beak" d="M68 -102 L90 -102 Q88 -94 68 -96 Z" fill="#f76707" style={{ transformOrigin: "68px -100px" }} />
          <Eye cx={56} cy={-116} r={4} />
          <Lid cx={56} cy={-116} r={4} fill="#ffd43b" />
          <circle cx="60" cy="-104" r="5" fill={CHEEK} opacity="0.5" />
        </g>
        <Inside d={DUCK_RING}>
          <rect x="-70" y="-6" width="140" height="14" fill={SEA} opacity="0.45" />
        </Inside>
      </g>
      <Drops
        className="sd-ente-splash"
        spots={[
          [-74, -14],
          [-60, -30],
          [72, -26],
        ]}
        r={6}
      />
      <Notes x={84} y={-130} texts={["Quak!", "Quak!"]} colour="#ffd43b" size={24} />
    </>
  );
}
