import { Face, INK, SKIN, nth } from "../shared";
import { Lid } from "./parts";

// The forester, the child collecting leaves and the signpost on the path. Foot point at (0, 0).

const JACKET = "#40916c";

/** The forester with binoculars, a hat with a feather and a braid; she looks through her binoculars, then waves and whistles. */
export function Foersterin() {
  return (
    <g className="wd-foerster-body">
      <rect x="-20" y="-80" width="17" height="70" rx="7" fill="#606c38" />
      <rect x="3" y="-80" width="17" height="70" rx="7" fill="#606c38" />
      <path d="M-24 -14 h22 v14 h-26 Q-28 -8 -24 -14 Z M2 -14 h22 Q28 -8 26 0 h-24 Z" fill="#6b4423" />
      <path d="M-30 -146 Q-34 -110 -32 -76 H32 Q34 -110 30 -146 Q0 -156 -30 -146 Z" fill={JACKET} />
      <path d="M0 -150 V-78" stroke="#2d6a4f" strokeWidth="3" />
      <rect x="-24" y="-104" width="14" height="12" rx="3" fill="#2d6a4f" />
      <rect x="10" y="-104" width="14" height="12" rx="3" fill="#2d6a4f" />
      <path d="M-20 -146 L-4 -118 M20 -146 L4 -118" stroke="#6b4423" strokeWidth="2.5" />
      {/* Braid behind the shoulder */}
      <path d="M-16 -168 Q-28 -150 -24 -126" stroke="#8d5524" strokeWidth="9" strokeLinecap="round" fill="none" />
      <circle cx="-24" cy="-124" r="4" fill="#e63946" />
      <circle cx="0" cy="-174" r="22" fill={SKIN} />
      <path d="M-22 -176 Q-20 -196 0 -196 Q20 -196 22 -176 Q10 -186 -22 -176 Z" fill="#8d5524" />
      <Face cx={0} cy={-174} size={0.7} />
      <Lid cx={-4.9} cy={-174} r={2.3} fill={SKIN} />
      <Lid cx={4.9} cy={-174} r={2.3} fill={SKIN} />
      <g className="wd-foerster-hat" style={{ transformOrigin: "0px -190px" }}>
        <ellipse cx="0" cy="-190" rx="32" ry="6" fill="#2d6a4f" />
        <path d="M-18 -190 Q-18 -214 0 -214 Q18 -214 18 -190 Z" fill="#40916c" />
        <rect x="-18" y="-196" width="36" height="5" fill="#6b4423" />
        <path className="wd-foerster-feather" d="M14 -196 Q30 -222 22 -236 Q16 -218 10 -198 Z" fill="#e9c46a" style={{ transformOrigin: "12px -196px" }} />
      </g>
      <g className="wd-foerster-glass">
        <path d="M-6 -118 Q0 -122 6 -118" stroke={INK} strokeWidth="3" fill="none" />
        <rect x="-14" y="-124" width="11" height="18" rx="4" fill={INK} />
        <rect x="3" y="-124" width="11" height="18" rx="4" fill={INK} />
        <circle cx="-8.5" cy="-108" r="3.5" fill="#74c0fc" />
        <circle cx="8.5" cy="-108" r="3.5" fill="#74c0fc" />
      </g>
      <g className="wd-foerster-arm-l" style={{ transformOrigin: "-26px -140px" }}>
        <path d="M-26 -140 L-34 -88" stroke={JACKET} strokeWidth="14" strokeLinecap="round" />
        <circle cx="-35" cy="-82" r="7" fill={SKIN} />
      </g>
      <g className="wd-foerster-arm-r" style={{ transformOrigin: "26px -140px" }}>
        <path d="M26 -140 L34 -88" stroke={JACKET} strokeWidth="14" strokeLinecap="round" />
        <circle cx="35" cy="-82" r="7" fill={SKIN} />
      </g>
      <g className="wd-foerster-notes" fill={INK} fontSize="24" fontWeight="700">
        <text x="26" y="-180" style={nth(0)}>
          ♪
        </text>
        <text x="44" y="-200" style={nth(1)}>
          ♫
        </text>
      </g>
    </g>
  );
}

const COAT = "#ffd60a";

// Leaves in the child's basket that fly up: [x, y, colour].
const KIND_LEAVES = [
  [-52, -86, "#e76f51"],
  [-40, -92, "#e9c46a"],
  [-60, -80, "#f4a261"],
] as const;

/** A child in a yellow raincoat with a basket of cones and leaves; it jumps, the leaves fly up, it waves and blinks. */
export function Kind() {
  return (
    <g className="wd-kind-body">
      <rect x="-15" y="-40" width="12" height="30" rx="5" fill="#3a6ea5" />
      <rect x="3" y="-40" width="12" height="30" rx="5" fill="#3a6ea5" />
      <path d="M-19 -22 h16 v22 h-20 Q-22 -8 -19 -22 Z M3 -22 h16 Q22 -8 20 0 h-17 Z" fill="#e63946" />
      <path d="M-24 -108 Q-34 -70 -32 -34 H32 Q34 -70 24 -108 Q0 -116 -24 -108 Z" fill={COAT} />
      <path d="M0 -110 V-36" stroke="#e9c46a" strokeWidth="3" />
      {[-92, -74, -56].map((y) => (
        <circle key={y} cx="4" cy={y} r="2.6" fill="#e9c46a" />
      ))}
      {/* Basket on the left arm */}
      <g className="wd-kind-leaves">
        {KIND_LEAVES.map(([cx, cy, colour], i) => (
          <path key={cx} d={`M${cx - 9} ${cy} Q${cx} ${cy - 7} ${cx + 9} ${cy} Q${cx} ${cy + 7} ${cx - 9} ${cy} Z`} fill={colour} style={nth(i)} />
        ))}
      </g>
      <path d="M-22 -96 L-40 -70" stroke={COAT} strokeWidth="11" strokeLinecap="round" />
      <ellipse cx="-50" cy="-76" rx="9" ry="12" fill="#9c6644" />
      <path d="M-56 -80 h12 M-56 -72 h12" stroke="#7f5539" strokeWidth="2" />
      <path d="M-40 -74 q4 -8 12 -6" stroke="#e76f51" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M-66 -70 H-30 L-34 -46 H-62 Z" fill="#bc6c25" />
      <path d="M-64 -62 H-32 M-63 -54 H-33" stroke="#a0522d" strokeWidth="2.5" />
      <path d="M-66 -70 Q-48 -100 -30 -70" stroke="#a0522d" strokeWidth="3.5" fill="none" />
      <g className="wd-kind-arm" style={{ transformOrigin: "20px -100px" }}>
        <path d="M20 -100 L32 -66" stroke={COAT} strokeWidth="11" strokeLinecap="round" />
        <circle cx="33" cy="-61" r="6" fill={SKIN} />
      </g>
      <g className="wd-kind-head" style={{ transformOrigin: "0px -108px" }}>
        <path d="M-25 -124 Q-26 -156 0 -158 Q26 -156 25 -124 Q22 -104 0 -104 Q-22 -104 -25 -124 Z" fill={COAT} />
        <circle cx="0" cy="-128" r="18" fill={SKIN} />
        <path d="M-17 -134 Q-10 -146 0 -144 Q12 -146 17 -134 Q6 -140 -17 -134 Z" fill="#6b4423" />
        <Face cx={0} cy={-130} size={0.62} />
        <Lid cx={-4.3} cy={-130} r={2} fill={SKIN} />
        <Lid cx={4.3} cy={-130} r={2} fill={SKIN} />
      </g>
    </g>
  );
}

/** Wooden signpost at the path, one arrow with a fir, one with a fish; the arrows swing, the post wobbles. */
export function Wegweiser() {
  return (
    <g className="wd-wegweiser-post" style={{ transformOrigin: "0px 0px" }}>
      <rect x="-7" y="-184" width="14" height="184" rx="3" fill="#7f5539" />
      <path d="M-3 -170 v40 M3 -90 v40" stroke="#6b4423" strokeWidth="2" />
      <g className="wd-schild" style={{ transformOrigin: "0px -164px", ...nth(0) }}>
        <path d="M6 -176 H80 L96 -164 L80 -152 H6 Z" fill="#e6c79c" stroke="#9c6644" strokeWidth="3" strokeLinejoin="round" />
        <path d="M40 -174 L52 -156 H28 Z" fill="#2d6a4f" />
        <rect x="38" y="-156" width="4" height="4" fill="#7f5539" />
        <path d="M58 -170 L68 -156 H48 Z" fill="#40916c" />
      </g>
      <g className="wd-schild" style={{ transformOrigin: "0px -124px", ...nth(1) }}>
        <path d="M-6 -136 H-80 L-96 -124 L-80 -112 H-6 Z" fill="#e6c79c" stroke="#9c6644" strokeWidth="3" strokeLinejoin="round" />
        <ellipse cx="-46" cy="-124" rx="12" ry="7" fill="#4dabf7" />
        <path d="M-34 -124 L-26 -130 V-118 Z" fill="#4dabf7" />
        <circle cx="-52" cy="-126" r="1.6" fill={INK} />
        <path d="M-74 -118 q4 -3 8 0" stroke="#4dabf7" strokeWidth="2" fill="none" />
      </g>
      <rect x="-9" y="-188" width="18" height="6" rx="2" fill="#6b4423" />
    </g>
  );
}
