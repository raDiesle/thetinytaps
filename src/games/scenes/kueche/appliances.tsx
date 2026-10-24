import { INK, STEEL, nth } from "../shared";
import { Lines, Steam } from "./parts";

// Things standing on the worktop. Each drawing has its foot point at (0, 0) and is placed with
// onCounter(), so it gets smaller towards the wall.

/** The coffee machine; its light goes on, coffee runs into the cup and steam rises. */
export function Kaffeemaschine() {
  return (
    <>
      <rect x="-56" y="-12" width="112" height="12" rx="4" fill="#343a40" />
      <rect x="-52" y="-168" width="104" height="40" rx="12" fill="#e03131" />
      <rect x="22" y="-168" width="30" height="156" rx="10" fill="#e03131" />
      <path d="M-40 -158 H10" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.45" />
      <rect x="-30" y="-130" width="22" height="14" rx="4" fill="#343a40" />
      <circle className="kc-kaffee-light" cx="37" cy="-146" r="6" fill="#69db7c" />
      <circle cx="37" cy="-146" r="6" fill="none" stroke="#c92a2a" strokeWidth="2" />
      <path className="kc-kaffee-stream" d="M-19 -116 V-60" stroke="#8d5a3b" strokeWidth="6" strokeLinecap="round" />
      {/* Cup */}
      <path d="M2 -46 q16 0 16 12 q0 12 -16 10" stroke="#fff" strokeWidth="6" fill="none" />
      <path d="M-44 -56 H6 V-26 Q6 -14 -6 -14 H-32 Q-44 -14 -44 -26 Z" fill="#fff" stroke="#dee2e6" strokeWidth="2" />
      <g className="kc-kaffee-fill" style={{ transformOrigin: "-19px -20px" }}>
        <path d="M-40 -46 H2 V-26 Q2 -18 -6 -18 H-32 Q-40 -18 -40 -26 Z" fill="#8d5a3b" />
      </g>
      <ellipse cx="-19" cy="-56" rx="25" ry="4" fill="#dee2e6" />
      <Steam x={-19} y={-76} count={3} spread={16} r={9} />
    </>
  );
}

/** The kitchen scale with a bowl of flour; the bowl dips, the numbers count up and it beeps. */
export function Waage() {
  return (
    <>
      <path d="M-62 -4 L-54 -34 H54 L62 -4 Q62 0 58 0 H-58 Q-62 0 -62 -4 Z" fill="#f1f3f5" stroke="#ced4da" strokeWidth="3" />
      <rect x="-30" y="-26" width="60" height="18" rx="3" fill="#343a40" />
      <text className="kc-waage-digits" x="0" y="-12" fontSize="15" fontWeight="700" fontFamily="sans-serif" textAnchor="middle" fill="#69db7c">
        250
      </text>
      <circle cx="44" cy="-17" r="5" fill="#ff8787" />
      <g className="kc-waage-bowl">
        <ellipse cx="0" cy="-38" rx="54" ry="8" fill="#ced4da" />
        <path d="M-50 -76 Q-50 -40 0 -40 Q50 -40 50 -76 Z" fill="#74c0fc" />
        <path d="M-38 -70 Q-36 -52 -20 -46" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.5" />
        <ellipse cx="0" cy="-76" rx="50" ry="9" fill="#fff" />
        <path d="M-34 -78 Q0 -96 34 -78 Z" fill="#fff" />
        <g className="kc-waage-dust" fill="#fff">
          {[-24, 0, 24].map((x, i) => (
            <circle key={x} cx={x} cy="-96" r="6" style={nth(i)} />
          ))}
        </g>
      </g>
    </>
  );
}

/** The red pot on the hob; it bubbles, the lid hops and steam puffs out. */
export function Topf() {
  return (
    <>
      <ellipse cx="0" cy="0" rx="74" ry="12" fill="#e8590c" opacity="0.35" />
      <path
        d="M-82 -70 Q-96 -72 -94 -58 Q-92 -50 -78 -54 M82 -70 Q96 -72 94 -58 Q92 -50 78 -54"
        stroke="#343a40"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M-74 -80 V-12 Q-74 0 -60 0 H60 Q74 0 74 -12 V-80 Z" fill="#e03131" />
      <path d="M-60 -70 V-16" stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity="0.35" />
      <path d="M-74 -40 H74" stroke="#c92a2a" strokeWidth="4" opacity="0.5" />
      <g className="kc-topf-bubbles" fill="#ffd8a8" stroke="#fff" strokeWidth="2">
        {[-40, -10, 22, 48].map((x, i) => (
          <circle key={x} cx={x} cy="-88" r={7 + (i % 2) * 3} style={nth(i)} />
        ))}
      </g>
      <g className="kc-topf-lid" style={{ transformOrigin: "-76px -82px" }}>
        <ellipse cx="0" cy="-82" rx="80" ry="14" fill="#ced4da" />
        <path d="M-80 -82 Q-70 -104 0 -104 Q70 -104 80 -82 Z" fill="#dee2e6" />
        <rect x="-14" y="-116" width="28" height="12" rx="6" fill="#343a40" />
        <path d="M-50 -94 Q-30 -100 -10 -100" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.7" />
      </g>
      <Steam x={0} y={-132} count={3} spread={34} r={14} />
    </>
  );
}

/** The frying pan with a fried egg; it sizzles, the egg flips up and lands again. */
export function Pfanne() {
  return (
    <>
      <path d="M68 -22 L140 -34" stroke="#343a40" strokeWidth="14" strokeLinecap="round" />
      <path d="M118 -31 L136 -34" stroke="#868e96" strokeWidth="4" strokeLinecap="round" />
      <g className="kc-pfanne-pan" style={{ transformOrigin: "0px -10px" }}>
        <ellipse cx="0" cy="-10" rx="78" ry="28" fill="#495057" />
        <ellipse cx="0" cy="-16" rx="68" ry="22" fill="#343a40" />
        <path d="M-50 -24 Q-30 -34 0 -36" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.2" />
        <g className="kc-pfanne-egg" style={{ transformOrigin: "-4px -16px" }}>
          <path d="M-40 -16 Q-44 -34 -16 -34 Q8 -40 24 -28 Q40 -18 22 -6 Q0 2 -24 -4 Q-40 -6 -40 -16 Z" fill="#fff" />
          <ellipse cx="-4" cy="-19" rx="15" ry="11" fill="#fcc419" />
          <ellipse cx="-8" cy="-23" rx="5" ry="3" fill="#fff" opacity="0.7" />
        </g>
      </g>
      <g className="kc-pfanne-sizzle" fill="#fff3bf">
        {[
          [-56, -48],
          [-20, -62],
          [24, -60],
          [58, -46],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="5" style={nth(i)} />
        ))}
      </g>
      <Lines x={90} y={-60} colour="#ffa94d" />
    </>
  );
}

/** A crock full of spoons; they jump out one after another and land again. */
export function Kochloeffel() {
  return (
    <>
      <g className="kc-loeffel" style={nth(0)}>
        <path d="M-18 -60 L-34 -168" stroke="#c88b3a" strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="-36" cy="-176" rx="12" ry="18" fill="#e9b872" transform="rotate(-8 -36 -176)" />
      </g>
      <g className="kc-loeffel" style={nth(1)}>
        <path d="M0 -60 V-176" stroke={STEEL} strokeWidth="6" strokeLinecap="round" />
        <path d="M0 -176 Q-18 -200 0 -214 Q18 -200 0 -176 Z M0 -176 V-212 M-9 -180 Q0 -206 9 -180" stroke="#adb5bd" strokeWidth="3" fill="none" />
      </g>
      <g className="kc-loeffel" style={nth(2)}>
        <path d="M18 -60 L32 -156" stroke="#e03131" strokeWidth="8" strokeLinecap="round" />
        <rect x="22" y="-196" width="26" height="36" rx="6" fill="#ff6b6b" transform="rotate(8 35 -178)" />
      </g>
      <path d="M-40 -84 H40 L36 -8 Q36 0 28 0 H-28 Q-36 0 -36 -8 Z" fill="#748ffc" />
      <path d="M-44 -88 H44 V-78 H-44 Z" fill="#5c7cfa" />
      <path d="M-26 -70 V-14" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.4" />
      <circle cx="6" cy="-42" r="10" fill="#fff" opacity="0.8" />
      <circle cx="6" cy="-42" r="5" fill="#ffd43b" />
      <Lines x={52} y={-150} colour="#748ffc" />
    </>
  );
}

/** The red toaster; the lever goes down, it glows, and pop! the toast jumps out and drops back. */
export function Toaster() {
  return (
    <>
      {[-24, 22].map((x, i) => (
        <g key={x} className="kc-toast" style={nth(i)}>
          <path
            d={`M${x - 20} -84 V-122 Q${x - 24} -138 ${x - 10} -140 Q${x} -146 ${x + 10} -140 Q${x + 24} -138 ${x + 20} -122 V-84 Z`}
            fill="#e9b872"
            stroke="#c88b3a"
            strokeWidth="3"
          />
          <path d={`M${x - 12} -88 V-122 Q${x} -132 ${x + 12} -122 V-88 Z`} fill="#ffe8b6" />
        </g>
      ))}
      <rect x="-80" y="-112" width="160" height="104" rx="34" fill="#ff6b6b" />
      <rect x="-80" y="-36" width="160" height="28" rx="10" fill="#e03131" />
      <rect x="-50" y="-114" width="40" height="10" rx="4" fill="#343a40" />
      <rect x="-4" y="-114" width="40" height="10" rx="4" fill="#343a40" />
      <path d="M-62 -92 Q-60 -62 -50 -48" stroke="#fff" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.45" />
      <rect className="kc-toaster-glow" x="-46" y="-98" width="76" height="6" rx="3" fill="#ffa94d" />
      <rect x="80" y="-96" width="8" height="64" rx="4" fill="#c92a2a" />
      <g className="kc-toaster-lever">
        <rect x="80" y="-90" width="22" height="12" rx="5" fill="#343a40" />
      </g>
      <rect x="-64" y="-10" width="18" height="10" rx="3" fill="#343a40" />
      <rect x="46" y="-10" width="18" height="10" rx="3" fill="#343a40" />
      <g className="kc-toaster-crumbs" fill="#c88b3a">
        {[-60, -30, 30, 60].map((x, i) => (
          <circle key={x} cx={x} cy="-150" r="4" style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** The blue kettle; its light goes on, the water boils, the whistle flips up and steam whistles out. */
export function Wasserkocher() {
  return (
    <>
      <rect x="-56" y="-16" width="112" height="16" rx="6" fill="#343a40" />
      <circle className="kc-kocher-light" cx="36" cy="-8" r="4" fill="#ff6b6b" />
      <g className="kc-kocher-body" style={{ transformOrigin: "0px -16px" }}>
        <path d="M44 -120 Q86 -116 80 -68 Q78 -50 52 -46" stroke="#1c7ed6" strokeWidth="14" strokeLinecap="round" fill="none" />
        <path d="M-50 -110 L-90 -134 L-86 -120 L-56 -88 Z" fill="#339af0" />
        <path d="M-56 -112 Q-58 -140 0 -144 Q58 -140 56 -112 L60 -28 Q60 -16 46 -16 H-46 Q-60 -16 -60 -28 Z" fill="#4dabf7" />
        <path d="M-40 -120 Q-44 -80 -38 -36" stroke="#fff" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.4" />
        <rect x="-14" y="-96" width="12" height="54" rx="6" fill="#d0ebff" />
        <rect className="kc-kocher-water" x="-12" y="-70" width="8" height="26" rx="4" fill="#1c7ed6" />
        <g className="kc-kocher-lid" style={{ transformOrigin: "-40px -142px" }}>
          <path d="M-40 -142 Q0 -158 40 -142 Z" fill="#339af0" />
          <rect x="-10" y="-160" width="20" height="10" rx="5" fill="#1c7ed6" />
        </g>
        <g className="kc-kocher-whistle" style={{ transformOrigin: "-82px -128px" }}>
          <rect x="-100" y="-142" width="18" height="12" rx="4" fill="#fab005" />
        </g>
      </g>
      <Steam x={-112} y={-160} count={3} spread={18} r={11} />
      <Lines x={-120} y={-140} dir={-1} colour="#1c7ed6" />
    </>
  );
}

/** The stand mixer; it shakes, the whisk whirls and dough splashes out of the bowl. */
export function Mixer() {
  return (
    <>
      <g className="kc-mixer-body" style={{ transformOrigin: "0px 0px" }}>
        <rect x="-66" y="-14" width="132" height="14" rx="6" fill="#e64980" />
        <path d="M40 -14 V-140 Q40 -170 10 -170 H-50 Q-80 -170 -80 -140 Q-80 -118 -56 -116 H10 V-14 Z" fill="#f783ac" />
        <path d="M30 -30 V-140" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.35" />
        <circle cx="-56" cy="-146" r="8" fill="#fff" opacity="0.7" />
        <g className="kc-mixer-dial" style={{ transformOrigin: "24px -110px" }}>
          <circle cx="24" cy="-110" r="9" fill="#fff" />
          <path d="M24 -110 V-118" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        </g>
        {/* Whisk under the head */}
        <g className="kc-mixer-whisk" style={{ transformOrigin: "-30px -80px" }}>
          <path d="M-30 -116 V-100" stroke={STEEL} strokeWidth="6" />
          <path d="M-30 -100 Q-48 -74 -30 -56 Q-12 -74 -30 -100 Z M-30 -100 Q-38 -74 -30 -56 Q-22 -74 -30 -100" stroke="#adb5bd" strokeWidth="3" fill="none" />
        </g>
        {/* Bowl */}
        <path d="M-82 -68 Q-80 -14 -30 -14 Q20 -14 22 -68 Z" fill="#dee2e6" />
        <ellipse cx="-30" cy="-68" rx="52" ry="9" fill="#fff4e6" />
        <path d="M-72 -60 Q-66 -30 -44 -22" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.7" />
      </g>
      <g className="kc-mixer-splash" fill="#fff4e6" stroke="#ffd8a8" strokeWidth="2">
        {[
          [-92, -96],
          [-52, -124],
          [-4, -110],
          [-70, -138],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={7 - (i % 2) * 2} style={nth(i)} />
        ))}
      </g>
    </>
  );
}
