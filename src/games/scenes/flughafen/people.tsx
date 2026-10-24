import { INK, nth } from "../shared";
import { Hand, Head, Legs, NAVY, PuffCheeks, RAIL_RED, SIGNAL_ORANGE, Suitcase, Toot, VEST } from "./parts";

// People. Each drawing has its foot point (between the feet, on the ground) at (0, 0).

/** The conductor: he lifts his signal disc and blows the whistle. */
export function Schaffner() {
  return (
    <g className="fh-schaffner-body" style={{ transformOrigin: "0px 0px" }}>
      <Legs colour={NAVY} hip={84} />
      <rect x="-32" y="-160" width="64" height="88" rx="20" fill={NAVY} />
      <path d="M-8 -158 L0 -140 L8 -158 Z" fill="#fff" />
      <path d="M0 -146 V-112" stroke={RAIL_RED} strokeWidth="6" strokeLinecap="round" />
      <circle cx="-14" cy="-120" r="3" fill="#ffd60a" />
      <circle cx="-14" cy="-100" r="3" fill="#ffd60a" />
      <rect x="10" y="-138" width="16" height="10" rx="2" fill="#ffd60a" />
      <g className="fh-schaffner-kelle" style={{ transformOrigin: "-26px -150px" }}>
        <path d="M-26 -150 L-44 -104" stroke={NAVY} strokeWidth="14" strokeLinecap="round" />
        <Hand cx={-45} cy={-100} />
        <path d="M-46 -98 V-60" stroke="#f8f9fa" strokeWidth="5" strokeLinecap="round" />
        <circle cx="-46" cy="-46" r="18" fill="#f8f9fa" />
        <circle cx="-46" cy="-46" r="12" fill="#2dc653" />
      </g>
      <g className="fh-schaffner-head" style={{ transformOrigin: "0px -160px" }}>
        <Head cx={0} cy={-184} r={24}>
          <path d="M-24 -196 Q-24 -222 0 -222 Q24 -222 24 -196 Z" fill={RAIL_RED} />
          <rect x="-28" y="-200" width="56" height="8" rx="3" fill={INK} />
          <circle cx="0" cy="-210" r="5" fill="#ffd60a" />
        </Head>
        <PuffCheeks cx={0} cy={-174} className="fh-schaffner-cheeks" />
        <g className="fh-schaffner-whistle">
          <rect x="0" y="-174" width="20" height="10" rx="4" fill="#adb5bd" />
          <circle cx="20" cy="-169" r="6" fill="#adb5bd" />
        </g>
        <Toot x={34} y={-172} className="fh-schaffner-toot" />
      </g>
      <g className="fh-schaffner-arm" style={{ transformOrigin: "26px -150px" }}>
        <path d="M26 -150 L36 -102" stroke={NAVY} strokeWidth="14" strokeLinecap="round" />
        <Hand cx={37} cy={-98} />
      </g>
    </g>
  );
}

/** A traveller with her suitcase: she lifts her hat, waves and her suitcase rolls along. */
export function Reisende() {
  return (
    <g className="fh-reise-body" style={{ transformOrigin: "0px 0px" }}>
      <g className="fh-reise-case" style={{ transformOrigin: "70px 0px" }}>
        <path d="M46 -98 V-70" stroke="#495057" strokeWidth="5" strokeLinecap="round" />
        <Suitcase x={36} y={-72} w={64} h={62} colour="#9d4edd" />
        <circle cx="46" cy="-6" r="6" fill={INK} />
        <circle cx="90" cy="-6" r="6" fill={INK} />
        <path d="M50 -60 h14 v10 h-14 Z" fill="#ffd60a" />
      </g>
      <Legs colour="#495057" hip={66} shoe="#9d4edd" />
      <path d="M-34 -64 L-24 -150 H24 L34 -64 Z" fill="#ff8fab" />
      <path d="M-14 -150 Q0 -140 14 -150 L18 -136 Q0 -126 -18 -136 Z" fill="#ffd60a" />
      <path className="fh-reise-scarf" d="M10 -140 Q28 -128 22 -108 L14 -110 Q18 -126 4 -134 Z" fill="#ffd60a" style={{ transformOrigin: "10px -140px" }} />
      <path d="M22 -140 L44 -100" stroke="#ff8fab" strokeWidth="12" strokeLinecap="round" />
      <Hand cx={46} cy={-98} />
      <g className="fh-reise-arm" style={{ transformOrigin: "-22px -140px" }}>
        <path d="M-22 -140 L-40 -98" stroke="#ff8fab" strokeWidth="12" strokeLinecap="round" />
        <Hand cx={-41} cy={-94} />
      </g>
      <g className="fh-reise-head" style={{ transformOrigin: "0px -152px" }}>
        <path d="M-22 -176 Q-30 -150 -20 -140 H20 Q30 -150 22 -176 Z" fill="#bc6c25" />
        <Head cx={0} cy={-172} r={22} hair="#bc6c25" />
        <g className="fh-reise-hat" style={{ transformOrigin: "0px -190px" }}>
          <ellipse cx="0" cy="-190" rx="36" ry="8" fill="#06d6a0" />
          <path d="M-20 -190 Q-20 -214 0 -214 Q20 -214 20 -190 Z" fill="#06d6a0" />
          <rect x="-20" y="-198" width="40" height="6" fill="#ff5d73" />
        </g>
      </g>
    </g>
  );
}

/** A marshaller on the apron with ear defenders and two paddles: he waves them to show the way. */
export function Einweiser() {
  return (
    <g className="fh-einweiser-body" style={{ transformOrigin: "0px 0px" }}>
      <Legs colour={NAVY} hip={84} />
      <rect x="-32" y="-160" width="64" height="88" rx="18" fill={NAVY} />
      <path d="M-32 -150 Q-32 -160 -20 -160 H20 Q32 -160 32 -150 V-84 H-32 Z" fill={SIGNAL_ORANGE} />
      <path d="M-32 -118 H32 M-32 -100 H32" stroke="#e9ecef" strokeWidth="6" />
      {[-1, 1].map((s) => (
        <g key={s} className={`fh-einweiser-arm ${s < 0 ? "fh-einweiser-arm-l" : "fh-einweiser-arm-r"}`} style={{ transformOrigin: `${s * 26}px -150px` }}>
          <path d={`M${s * 26} -150 L${s * 62} -194`} stroke={SIGNAL_ORANGE} strokeWidth="13" strokeLinecap="round" />
          <Hand cx={s * 64} cy={-198} />
          <path d={`M${s * 64} -200 V-226`} stroke={INK} strokeWidth="5" strokeLinecap="round" />
          <circle cx={s * 64} cy={-240} r="18" fill={VEST} stroke="#e85d04" strokeWidth="4" />
        </g>
      ))}
      <g className="fh-einweiser-head" style={{ transformOrigin: "0px -160px" }}>
        <Head cx={0} cy={-184} r={24} hair="#2b2d42" />
        <path d="M-24 -190 Q-22 -216 0 -216 Q22 -216 24 -190" stroke="#2dc653" strokeWidth="6" fill="none" />
        <rect x="-32" y="-196" width="12" height="22" rx="5" fill="#2dc653" />
        <rect x="20" y="-196" width="12" height="22" rx="5" fill="#2dc653" />
      </g>
    </g>
  );
}

/** A child with a toy plane: zoom! the plane flies round and the child jumps for joy. */
export function Kind() {
  return (
    <g className="fh-kind-body" style={{ transformOrigin: "0px 0px" }}>
      <rect x="-15" y="-52" width="13" height="44" rx="5" fill="#4361ee" />
      <rect x="2" y="-52" width="13" height="44" rx="5" fill="#4361ee" />
      <ellipse cx="-10" cy="-6" rx="11" ry="6" fill="#ff5d73" />
      <ellipse cx="10" cy="-6" rx="11" ry="6" fill="#ff5d73" />
      <rect x="-24" y="-104" width="48" height="58" rx="16" fill="#ffd60a" />
      <path d="M-24 -86 H24" stroke="#fff" strokeWidth="6" />
      <path d="M-20 -96 L-34 -66" stroke="#ffd60a" strokeWidth="11" strokeLinecap="round" />
      <Hand cx={-35} cy={-62} r={7} />
      <g className="fh-kind-arm" style={{ transformOrigin: "20px -96px" }}>
        <path d="M20 -96 L40 -130" stroke="#ffd60a" strokeWidth="11" strokeLinecap="round" />
        <Hand cx={41} cy={-134} r={7} />
        <g className="fh-kind-plane">
          <path d="M22 -150 H78 Q90 -150 90 -142 Q90 -136 78 -136 H26 Z" fill="#f8f9fa" stroke="#3a86ff" strokeWidth="3" />
          <path d="M44 -144 L34 -122 H48 L60 -144 Z" fill="#3a86ff" />
          <path d="M26 -146 L18 -166 H28 L38 -148 Z" fill={RAIL_RED} />
          <circle cx="72" cy="-145" r="3" fill="#4cc9f0" />
        </g>
      </g>
      <g className="fh-kind-head" style={{ transformOrigin: "0px -104px" }}>
        <Head cx={0} cy={-126} r={22} hair="#6b4423" />
        <path d="M-6 -150 q6 -10 12 0" stroke="#6b4423" strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
      <g className="fh-kind-zoom" fill="none" stroke="#adb5bd" strokeWidth="4" strokeLinecap="round">
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${-4 - i * 10} ${-150 - i * 12} h-22`} style={nth(i)} />
        ))}
      </g>
    </g>
  );
}

/** The pilot with her cap: she salutes, nods and her wings badge sparkles. She holds the dog's lead. */
export function Pilotin() {
  return (
    <g transform="translate(70 0)">
      <g className="fh-pilotin-body" style={{ transformOrigin: "0px 0px" }}>
        <Legs colour={NAVY} hip={80} />
        <rect x="-32" y="-160" width="64" height="90" rx="18" fill={NAVY} />
        <path d="M-6 -158 L0 -136 L6 -158 Z" fill="#fff" />
        <path d="M-32 -82 H32" stroke="#ffd60a" strokeWidth="4" />
        <g className="fh-pilotin-badge" style={{ transformOrigin: "16px -138px" }}>
          <path d="M4 -138 Q16 -146 28 -138 Q16 -142 4 -138 Z" fill="#ffd60a" stroke="#ffd60a" strokeWidth="3" />
          <circle cx="16" cy="-139" r="3" fill="#ffd60a" />
        </g>
        <path d="M-26 -150 L-38 -108" stroke={NAVY} strokeWidth="14" strokeLinecap="round" />
        <path d="M-37 -116 h-6 M-38 -112 h-6" stroke="#ffd60a" strokeWidth="2" />
        <Hand cx={-38} cy={-104} />
        <g className="fh-pilotin-head" style={{ transformOrigin: "0px -160px" }}>
          <path d="M-20 -184 Q-30 -160 -22 -146 H22 Q30 -160 20 -184 Z" fill="#2b2d42" />
          <Head cx={0} cy={-180} r={22} hair="#2b2d42">
            <path d="M-24 -192 Q-22 -214 0 -214 Q22 -214 24 -192 Z" fill={NAVY} />
            <rect x="-28" y="-196" width="56" height="8" rx="3" fill={INK} />
            <path d="M-16 -194 H16" stroke="#ffd60a" strokeWidth="3" />
            <circle cx="0" cy="-204" r="4" fill="#ffd60a" />
          </Head>
        </g>
        <g className="fh-pilotin-arm" style={{ transformOrigin: "26px -150px" }}>
          <path d="M26 -150 L38 -106" stroke={NAVY} strokeWidth="14" strokeLinecap="round" />
          <Hand cx={39} cy={-102} />
        </g>
        <g className="fh-pilotin-sparkle" fill="#fff">
          {[
            [34, -154],
            [0, -148],
          ].map(([x, y], i) => (
            <path
              key={i}
              d={`M${x} ${y - 9} Q${x} ${y} ${x + 9} ${y} Q${x} ${y} ${x} ${y + 9} Q${x} ${y} ${x - 9} ${y} Q${x} ${y} ${x} ${y - 9} Z`}
              style={nth(i)}
            />
          ))}
        </g>
      </g>
    </g>
  );
}
