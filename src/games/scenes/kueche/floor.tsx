import { Eye, INK, Wheel, nth } from "../shared";
import { Hearts, Lid, Lines } from "./parts";

// Things on the floor. Each drawing has its foot point at (0, 0) and is placed with ground().

/** The broom leaning on the counter; it sweeps back and forth and the dust puffs away. */
export function Besen() {
  return (
    <>
      <g className="kc-besen" style={{ transformOrigin: "-10px -400px" }}>
        <path d="M-10 -400 L6 -70" stroke="#c88b3a" strokeWidth="12" strokeLinecap="round" />
        <path d="M-2 -86 H18 L40 -10 Q42 0 32 0 H-22 Q-32 0 -28 -10 Z" fill="#ffd43b" />
        <path d="M-14 -4 L-4 -60 M2 -4 L6 -60 M18 -4 L14 -60 M30 -4 L20 -60" stroke="#fab005" strokeWidth="3" />
        <rect x="-6" y="-96" width="28" height="16" rx="4" fill="#e03131" />
        <circle cx="-10" cy="-404" r="7" fill="#e03131" />
      </g>
      <g className="kc-besen-dust" fill="#dee2e6">
        {[-40, 50, 80].map((x, i) => (
          <circle key={x} cx={x} cy={-14 - i * 6} r={10 - i * 2} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** The green pedal bin; the pedal goes down, the lid flips up and a banana peel flies in. */
export function Muelleimer() {
  return (
    <>
      <g className="kc-eimer-peel">
        <path d="M-6 -168 Q-20 -150 -16 -136 Q-6 -150 0 -150 Q6 -150 16 -136 Q20 -150 6 -168 Z" fill="#ffd43b" />
        <rect x="-4" y="-174" width="8" height="8" rx="2" fill="#8d5a3b" />
      </g>
      <path d="M-42 -104 H42 L36 -6 Q36 0 30 0 H-30 Q-36 0 -36 -6 Z" fill="#51cf66" />
      <rect x="-41" y="-66" width="82" height="10" fill="#2f9e44" />
      <path d="M-28 -94 L-24 -16" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.5" />
      <g className="kc-eimer-pedal" style={{ transformOrigin: "0px -4px" }}>
        <rect x="-20" y="-14" width="40" height="10" rx="3" fill="#495057" />
      </g>
      <g className="kc-eimer-lid" style={{ transformOrigin: "44px -104px" }}>
        <path d="M-46 -102 Q-46 -124 0 -126 Q46 -124 46 -102 Z" fill="#40c057" stroke="#2f9e44" strokeWidth="2" />
        <path d="M-28 -116 Q-12 -122 6 -122" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
      </g>
    </>
  );
}

const BEAR = "#c88b3a";

/** The teddy bear sitting on the floor; it waves, wiggles its ears, hops and hearts pop up. */
export function Teddy() {
  return (
    <>
      <g className="kc-teddy-body" style={{ transformOrigin: "0px 0px" }}>
        <ellipse cx="-34" cy="-14" rx="22" ry="16" fill={BEAR} />
        <ellipse cx="34" cy="-14" rx="22" ry="16" fill={BEAR} />
        <ellipse cx="-38" cy="-12" rx="11" ry="9" fill="#ffe8cc" />
        <ellipse cx="38" cy="-12" rx="11" ry="9" fill="#ffe8cc" />
        <ellipse cx="0" cy="-58" rx="46" ry="52" fill={BEAR} />
        <ellipse cx="0" cy="-50" rx="28" ry="32" fill="#ffe8cc" />
        <path d="M-40 -84 Q-62 -64 -50 -44" stroke={BEAR} strokeWidth="20" strokeLinecap="round" fill="none" />
        <g className="kc-teddy-arm" style={{ transformOrigin: "38px -86px" }}>
          <path d="M38 -86 Q62 -70 56 -46" stroke={BEAR} strokeWidth="20" strokeLinecap="round" fill="none" />
        </g>
        <path d="M-18 -104 L0 -96 L18 -104 L18 -88 L0 -96 L-18 -88 Z" fill="#e03131" />
        {[
          { cx: -32, origin: "-28px -164px" },
          { cx: 32, origin: "28px -164px" },
        ].map(({ cx, origin }, i) => (
          <g key={cx} className="kc-teddy-ear" style={{ ...nth(i), transformOrigin: origin }}>
            <circle cx={cx} cy="-170" r="16" fill={BEAR} />
            <circle cx={cx} cy="-170" r="8" fill="#ffe8cc" />
          </g>
        ))}
        <circle cx="0" cy="-140" r="40" fill={BEAR} />
        <ellipse cx="0" cy="-126" rx="18" ry="13" fill="#ffe8cc" />
        <ellipse cx="0" cy="-132" rx="7" ry="5" fill={INK} />
        <path d="M-6 -122 Q0 -116 6 -122" stroke={INK} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <Eye cx={-14} cy={-148} r={4.5} />
        <Eye cx={14} cy={-148} r={4.5} />
        <Lid cx={-14} cy={-148} r={4.5} fill={BEAR} />
        <Lid cx={14} cy={-148} r={4.5} fill={BEAR} />
      </g>
      <Hearts x={0} y={-200} count={3} spread={40} />
    </>
  );
}

/** The shopping basket; a carrot pops up, the leek wobbles and an orange rolls about. */
export function Korb() {
  return (
    <>
      <g className="kc-korb-leek" style={{ transformOrigin: "40px -60px" }}>
        <path d="M30 -60 L60 -150" stroke="#f8f9fa" strokeWidth="18" strokeLinecap="round" />
        <path d="M56 -140 L70 -190 M60 -140 L84 -176 M54 -138 L50 -186" stroke="#51cf66" strokeWidth="10" strokeLinecap="round" />
      </g>
      <g className="kc-korb-carrot" style={{ transformOrigin: "-30px -60px" }}>
        <path d="M-42 -60 L-30 -136 L-18 -60 Z" fill="#ff922b" />
        <path d="M-36 -110 h10 M-38 -90 h12" stroke="#e8590c" strokeWidth="3" strokeLinecap="round" />
        <path d="M-30 -136 L-40 -160 M-30 -136 L-30 -164 M-30 -136 L-18 -158" stroke="#40c057" strokeWidth="6" strokeLinecap="round" />
      </g>
      <g className="kc-korb-orange" style={{ transformOrigin: "0px -70px" }}>
        <circle cx="0" cy="-70" r="20" fill="#ffa94d" />
        <circle cx="-6" cy="-76" r="5" fill="#fff" opacity="0.5" />
      </g>
      <path d="M-76 -64 H76 L64 -6 Q62 0 54 0 H-54 Q-62 0 -64 -6 Z" fill="#e9b872" />
      <path d="M-72 -46 H72 M-68 -28 H68 M-66 -12 H66" stroke="#c88b3a" strokeWidth="4" />
      <path d="M-50 -64 L-40 0 M-16 -64 L-12 0 M16 -64 L12 0 M50 -64 L40 0" stroke="#c88b3a" strokeWidth="3" opacity="0.6" />
      <path d="M-66 -64 Q-60 -130 0 -132 Q60 -130 66 -64" stroke="#c88b3a" strokeWidth="9" fill="none" />
      <rect x="-80" y="-70" width="160" height="12" rx="5" fill="#d9a05b" />
    </>
  );
}

/** A colourful ball; it bounces and spins. */
export function Ball() {
  return (
    <g className="kc-ball" style={{ transformOrigin: "0px -40px" }}>
      <circle cx="0" cy="-40" r="40" fill="#4dabf7" />
      <path d="M-40 -40 A40 40 0 0 1 0 -80 V-40 Z" fill="#ff6b6b" />
      <path d="M0 0 A40 40 0 0 1 -40 -40 H0 Z" fill="#ffd43b" />
      <path d="M40 -40 A40 40 0 0 1 0 0 V-40 Z" fill="#51cf66" />
      <circle cx="0" cy="-40" r="7" fill="#fff" />
      <circle cx="-16" cy="-62" r="8" fill="#fff" opacity="0.6" />
    </g>
  );
}

/** The red ride-on car; it rolls forward and back, its wheels turn, the steering wheel turns and it honks. */
export function Bobbycar() {
  return (
    <>
      <g className="kc-bobby" style={{ transformOrigin: "0px 0px" }}>
        <path d="M-96 -40 Q-104 -84 -70 -88 H-20 Q0 -88 10 -110 H44 Q60 -110 64 -96 L100 -64 Q110 -40 96 -30 H-90 Z" fill="#fa5252" />
        <path d="M-80 -78 H-28" stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity="0.45" />
        <path d="M-74 -90 Q-60 -116 -26 -112 Q-14 -110 -16 -92 Z" fill="#c92a2a" />
        <circle cx="86" cy="-56" r="9" fill="#fff3bf" stroke="#fcc419" strokeWidth="3" />
        <path d="M20 -110 L4 -150" stroke="#495057" strokeWidth="8" strokeLinecap="round" />
        <g className="kc-bobby-steer" style={{ transformOrigin: "2px -154px" }}>
          <ellipse cx="2" cy="-154" rx="28" ry="10" fill="none" stroke="#343a40" strokeWidth="8" />
          <circle cx="2" cy="-154" r="7" fill="#ffd43b" />
        </g>
        {[-60, 62].map((x) => (
          <g key={x} className="kc-bobby-wheel" style={{ transformOrigin: `${x}px -24px` }}>
            <Wheel cx={x} cy={-24} r={24} />
          </g>
        ))}
      </g>
      <Lines x={112} y={-110} colour="#fa5252" />
    </>
  );
}
