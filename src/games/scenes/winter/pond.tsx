import { Lids } from "../baustelle/figures";
import { CHEEK, Eye, Face, SKIN, nth } from "../shared";
import { glint } from "../winterbaustelle/parts";

// On and at the frozen pond: the skater, a duck sliding on the ice and a pair of ice skates.
// Each drawing stands with its foot point on (0, 0).

const BLADE = "#adb5bd";

/** One ice skate, toe to the left: white boot, laces and a blade. */
function Skate({ boot = "#fff", shade = "#dee2e6" }: { boot?: string; shade?: string }) {
  return (
    <>
      <path d="M-26 0 H28 M-26 0 Q-34 0 -34 -8" stroke={BLADE} strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M-14 0 V-8 M18 0 V-8" stroke={BLADE} strokeWidth="4" />
      <path d="M-26 -8 Q-28 -24 -12 -26 L4 -28 V-58 Q4 -62 8 -62 H24 Q28 -62 28 -58 V-8 Z" fill={boot} stroke={shade} strokeWidth="2" />
      <path d="M6 -52 l8 6 M14 -52 l-8 6 M6 -42 l8 6 M14 -42 l-8 6 M2 -32 l8 6 M10 -32 l-8 6" stroke="#e63946" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 -60 H26" stroke={shade} strokeWidth="4" />
    </>
  );
}

/** A girl skating on one leg with her arms out; she spins round twice and the ice glitters. */
export function Eislaeuferin() {
  return (
    <>
      <g className="wi-eis-glint" fill="#fff">
        {[
          [-56, -14],
          [54, -8],
          [-40, -150],
          [44, -156],
        ].map(([x, y], i) => (
          <path key={`${x}-${y}`} d={glint(x, y, 10)} style={nth(i)} />
        ))}
      </g>
      <g className="wi-eis-spin" style={{ transformOrigin: "0px 0px" }}>
        {/* The leg stretched out behind her */}
        <g className="wi-eis-leg" style={{ transformOrigin: "8px -58px" }}>
          <path d="M8 -58 L44 -44" stroke="#c77dff" strokeWidth="11" strokeLinecap="round" />
          <g transform="translate(56 -36) rotate(-62) scale(0.62)">
            <Skate />
          </g>
        </g>
        <path d="M-4 -60 L-4 -24" stroke="#c77dff" strokeWidth="12" strokeLinecap="round" />
        <g transform="translate(-8 0) scale(0.62)">
          <Skate />
        </g>
        <g className="wi-eis-arm" style={{ transformOrigin: "-10px -98px" }}>
          <path d="M-10 -98 L-50 -92" stroke="#ff5d8f" strokeWidth="10" strokeLinecap="round" />
          <circle cx="-53" cy="-92" r="6.5" fill="#fff" />
        </g>
        <path d="M-22 -60 Q-26 -96 -10 -110 Q8 -114 18 -104 Q30 -84 28 -60 Q2 -50 -22 -60 Z" fill="#ff5d8f" />
        <path d="M-22 -60 Q2 -50 28 -60" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path className="wi-eis-scarf" d="M10 -110 L40 -116 L38 -104 L8 -102 Z" fill="#4dabf7" style={{ transformOrigin: "9px -106px" }} />
        <g className="wi-eis-arm wi-eis-arm-r" style={{ transformOrigin: "12px -100px" }}>
          <path d="M12 -100 L48 -112" stroke="#ff5d8f" strokeWidth="10" strokeLinecap="round" />
          <circle cx="51" cy="-113" r="6.5" fill="#fff" />
        </g>
        <rect x="-14" y="-114" width="26" height="7" rx="3.5" fill="#fff" />
        <circle cx="-4" cy="-130" r="16" fill={SKIN} />
        <path d="M-20 -132 Q-20 -150 -4 -150 Q12 -150 12 -132 Q-2 -142 -20 -132 Z" fill="#7f4f24" />
        <circle cx="-4" cy="-154" r="8" fill="#7f4f24" />
        <Face cx={-4} cy={-130} size={0.6} />
        <Lids
          eyes={[
            [-8.2, -130],
            [0.2, -130],
          ]}
          r={2.6}
          fill={SKIN}
        />
        {/* Earmuffs */}
        <path d="M-20 -134 Q-4 -158 12 -134" stroke="#ff5d8f" strokeWidth="3" fill="none" />
        <circle cx="-20" cy="-130" r="7" fill="#fff" />
        <circle cx="12" cy="-130" r="7" fill="#fff" />
      </g>
    </>
  );
}

/** A white duck slithering on the ice with its wings out; it slides, wobbles and quacks. */
export function Eisente() {
  return (
    <>
      <g className="wi-ente-lines" stroke="#fff" strokeWidth="4" strokeLinecap="round">
        <path d="M44 -8 H70" style={nth(0)} />
        <path d="M40 -24 H62" style={nth(1)} />
      </g>
      <g className="wi-ente-slide" style={{ transformOrigin: "0px 0px" }}>
        <g className="wi-ente-foot" style={{ transformOrigin: "-10px -8px" }}>
          <path d="M-10 -10 L-26 2 L-6 2 Z" fill="#f77f00" />
        </g>
        <g className="wi-ente-foot wi-ente-foot-r" style={{ transformOrigin: "14px -8px" }}>
          <path d="M14 -10 L4 2 L26 2 Z" fill="#f4a261" />
        </g>
        <g className="wi-ente-wing wi-ente-wing-back" style={{ transformOrigin: "18px -40px" }}>
          <path d="M18 -40 Q40 -76 58 -64 Q46 -42 18 -36 Z" fill="#e9ecef" />
        </g>
        <path d="M30 -38 L50 -48 L44 -30 Z" fill="#f1f3f5" />
        <ellipse cx="4" cy="-30" rx="34" ry="22" fill="#fff" />
        <path d="M-28 -24 Q4 -2 36 -22 Q20 -8 4 -8 Q-16 -8 -28 -24 Z" fill="#e9ecef" />
        <g className="wi-ente-wing" style={{ transformOrigin: "-8px -38px" }}>
          <path d="M-8 -38 Q-34 -70 -52 -58 Q-40 -36 -8 -32 Z" fill="#f1f3f5" stroke="#dee2e6" strokeWidth="2" />
        </g>
        <g className="wi-ente-head" style={{ transformOrigin: "-20px -48px" }}>
          <circle cx="-22" cy="-62" r="17" fill="#fff" />
          <path d="M-36 -62 Q-52 -62 -56 -56 Q-48 -52 -36 -54 Z" fill="#f77f00" />
          <path d="M-56 -56 Q-48 -52 -36 -54" stroke="#e85d04" strokeWidth="2" fill="none" />
          <Eye cx={-26} cy={-67} r={3.4} />
          <Lids eyes={[[-26, -67]]} r={4.2} fill="#fff" />
          <circle cx="-18" cy="-56" r="4" fill={CHEEK} opacity="0.5" />
          <path d="M-36 -50 Q-22 -42 -8 -50 L-8 -44 Q-22 -36 -36 -44 Z" fill="#e63946" />
          <path d="M-10 -48 L0 -30 L-8 -28 L-14 -44 Z" fill="#e63946" />
        </g>
      </g>
    </>
  );
}

/** A pair of ice skates tied together by their laces; they hop and their blades flash. */
export function Schlittschuhe() {
  return (
    <>
      <path d="M-66 2 Q0 -12 66 2 Z" fill="#fff" />
      <g className="wi-skates-hop" style={{ transformOrigin: "0px 0px" }}>
        <path className="wi-skates-lace" d="M-10 -62 Q-2 -84 8 -60 M-10 -62 Q-26 -80 -14 -84" stroke="#e63946" strokeWidth="2.5" fill="none" style={{ transformOrigin: "-2px -62px" }} />
        <g className="wi-skate-a" style={{ transformOrigin: "-30px 0px" }}>
          <g transform="translate(-30 -2) scale(0.95)">
            <Skate boot="#f1f3f5" shade="#ced4da" />
          </g>
        </g>
        <g className="wi-skate-b" style={{ transformOrigin: "20px 0px" }}>
          <g transform="translate(20 2)">
            <Skate />
          </g>
        </g>
      </g>
      <g className="wi-skates-glint" fill="#fff">
        {[
          [-64, -10],
          [52, 2],
          [10, -78],
        ].map(([x, y], i) => (
          <path key={x} d={glint(x, y, 9)} style={nth(i)} />
        ))}
      </g>
    </>
  );
}
