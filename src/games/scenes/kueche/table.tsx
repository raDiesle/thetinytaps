import { INK, STEEL, nth } from "../shared";
import { Lines, Steam } from "./parts";

// The table and what is on it. The table has its front foot point at (0, 0) and stands at TABLE;
// the things on it have their foot at (0, 0) and are placed with onTable().

/** The fruit bowl, in the table's own coordinates; the apple and the banana lie in it. */
function FruitBowl() {
  return (
    <g transform="translate(-199 -311) scale(0.96)">
      <ellipse cx="0" cy="4" rx="70" ry="12" fill="#000" opacity="0.08" />
      <path d="M-66 -24 Q-62 6 0 6 Q62 6 66 -24 Z" fill="#69db7c" />
      <path d="M-50 -16 Q-40 0 -16 2" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.5" />
      <ellipse cx="0" cy="-24" rx="66" ry="12" fill="#40c057" />
      <ellipse cx="0" cy="-24" rx="58" ry="9" fill="#2b8a3e" />
      <circle cx="-30" cy="-34" r="16" fill="#ffa94d" />
      <circle cx="-36" cy="-40" r="4" fill="#fff" opacity="0.5" />
    </g>
  );
}

/** The kitchen table with a checked cloth; it wobbles, the cloth flutters and the plates clatter. */
export function Tisch() {
  return (
    <>
      {/* Back legs */}
      <rect x="-256" y="-372" width="20" height="250" rx="6" fill="#a0662f" />
      <rect x="236" y="-372" width="20" height="250" rx="6" fill="#a0662f" />
      <g className="kc-tisch-top" style={{ transformOrigin: "0px -276px" }}>
        {/* Table top with a checked cloth */}
        <path d="M-296 -276 L-268 -374 H268 L296 -276 Z" fill="#fff" />
        <g fill="#ff8787" opacity="0.8">
          {[-216, -120, -24, 72, 168].map((x) => (
            <path key={x} d={`M${x * 1.04} -276 L${x * 0.95} -374 H${x * 0.95 + 46} L${x * 1.04 + 50} -276 Z`} />
          ))}
          <path d="M-282 -326 H282 L286 -306 H-286 Z" />
        </g>
        {/* Plates */}
        {[-60, 160].map((x, i) => (
          <g key={x} className="kc-tisch-plate" style={nth(i)}>
            <ellipse cx={x} cy="-342" rx="40" ry="12" fill="#fff" stroke="#a5d8ff" strokeWidth="3" />
            <ellipse cx={x} cy="-342" rx="24" ry="7" fill="none" stroke="#d0ebff" strokeWidth="3" />
          </g>
        ))}
        <path d="M-96 -320 L-92 -366 M100 -320 L104 -366" stroke={STEEL} strokeWidth="4" strokeLinecap="round" />
        <FruitBowl />
        {/* The cloth's front hem */}
        <g className="kc-tisch-hem" style={{ transformOrigin: "0px -276px" }}>
          <path d="M-300 -280 H300 V-252 q-15 12 -30 0 t-30 0 t-30 0 t-30 0 t-30 0 t-30 0 t-30 0 t-30 0 t-30 0 t-30 0 t-30 0 t-30 0 t-30 0 t-30 0 t-30 0 t-30 0 t-30 0 t-30 0 t-30 0 t-30 0 Z" fill="#fff" />
          <path d="M-300 -268 H300" stroke="#ff8787" strokeWidth="8" opacity="0.8" />
        </g>
      </g>
      {/* Front legs */}
      <rect x="-286" y="-252" width="24" height="252" rx="7" fill="#c88b3a" />
      <rect x="262" y="-252" width="24" height="252" rx="7" fill="#c88b3a" />
      <path d="M-280 -240 V-12" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.3" />
    </>
  );
}

/** The bread basket; the rolls hop, the napkin flutters and it smells so good. */
export function Brotkorb() {
  return (
    <>
      <g className="kc-brot-napkin" style={{ transformOrigin: "-50px -40px" }}>
        <path d="M-70 -40 L-92 -10 L-56 -24 Z" fill="#fff" stroke="#ffc9c9" strokeWidth="2" />
      </g>
      {[
        { x: -30, y: -46, c: "#e9b872" },
        { x: 26, y: -48, c: "#d9a05b" },
        { x: -2, y: -58, c: "#f0c27b" },
      ].map(({ x, y, c }, i) => (
        <g key={i} className="kc-brot-roll" style={{ ...nth(i), transformOrigin: `${x}px ${y + 16}px` }}>
          <ellipse cx={x} cy={y} rx="26" ry="18" fill={c} />
          <path d={`M${x - 12} ${y - 6} Q${x} ${y - 14} ${x + 12} ${y - 6}`} stroke="#fff4e6" strokeWidth="4" strokeLinecap="round" fill="none" />
        </g>
      ))}
      <path d="M-68 -40 H68 L56 -4 Q54 0 48 0 H-48 Q-54 0 -56 -4 Z" fill="#c88b3a" />
      <path d="M-62 -30 H62 M-58 -18 H58 M-54 -8 H54" stroke="#a0662f" strokeWidth="3" />
      <path d="M-40 -40 V0 M-14 -40 V0 M14 -40 V0 M40 -40 V0" stroke="#e9b872" strokeWidth="3" opacity="0.7" />
      <ellipse cx="0" cy="-40" rx="70" ry="7" fill="#a0662f" />
      <g className="kc-brot-smell" stroke="#ffa94d" strokeWidth="4" strokeLinecap="round" fill="none">
        {[-30, 0, 30].map((x, i) => (
          <path key={x} d={`M${x} -82 q-8 -10 0 -20 t0 -20`} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** The teapot with blue dots; it tips forward and pours tea into the cup, and the lid hops. */
export function Teekanne() {
  return (
    <>
      {/* Cup in front */}
      <path d="M64 -24 q12 0 12 9 q0 9 -12 7" stroke="#fff" strokeWidth="5" fill="none" />
      <path d="M30 -30 H66 V-12 Q66 0 54 0 H42 Q30 0 30 -12 Z" fill="#fff" stroke="#a5d8ff" strokeWidth="2.5" />
      <g className="kc-tee-cupfill" style={{ transformOrigin: "48px -6px" }}>
        <ellipse cx="48" cy="-26" rx="16" ry="3.5" fill="#e8590c" />
      </g>
      <path className="kc-tee-stream" d="M76 -88 Q62 -60 50 -28" stroke="#e8590c" strokeWidth="5" strokeLinecap="round" fill="none" />
      <g className="kc-tee-pot" style={{ transformOrigin: "-20px 0px" }}>
        <path d="M14 -60 Q40 -66 52 -96 L60 -96 Q52 -60 24 -40 Z" fill="#4dabf7" />
        <path d="M-62 -78 Q-96 -76 -90 -46 Q-86 -30 -62 -30" stroke="#339af0" strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M-66 -40 Q-74 -90 -20 -94 Q34 -90 26 -40 Q22 0 -20 0 Q-62 0 -66 -40 Z" fill="#fff" stroke="#a5d8ff" strokeWidth="3" />
        {[
          [-44, -66],
          [-20, -48],
          [4, -68],
          [-40, -28],
          [6, -26],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="6" fill="#4dabf7" />
        ))}
        <path d="M-56 -60 Q-56 -30 -40 -16" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.8" />
        <g className="kc-tee-lid" style={{ transformOrigin: "-20px -94px" }}>
          <path d="M-48 -92 Q-20 -112 8 -92 Z" fill="#74c0fc" />
          <circle cx="-20" cy="-110" r="7" fill="#339af0" />
        </g>
      </g>
      <Steam x={-20} y={-130} count={2} spread={22} r={10} />
    </>
  );
}

/** A yellow banana in the fruit bowl; it hops and its peel opens like a flower. */
export function Banane() {
  return (
    <g className="kc-banane-body" style={{ transformOrigin: "0px -20px" }}>
      <path d="M-54 -40 Q-20 -6 34 -26 Q48 -32 50 -46 Q30 -26 -8 -34 Q-36 -40 -54 -40 Z" fill="#ffd43b" />
      <path d="M-50 -38 Q-22 -16 30 -30" stroke="#fab005" strokeWidth="3" fill="none" />
      {[-30, 0, 30].map((a, i) => (
        <g key={a} className="kc-banane-peel" style={{ ...nth(i), transformOrigin: "48px -44px" }}>
          <path d="M48 -44 Q54 -60 50 -72 Q44 -60 44 -46 Z" fill="#fcc419" transform={`rotate(${a} 48 -44)`} />
        </g>
      ))}
      <rect x="44" y="-50" width="10" height="8" rx="3" fill="#8d5a3b" />
      <circle cx="-54" cy="-40" r="4" fill="#5c3d2e" />
    </g>
  );
}

/** A red apple in the fruit bowl; it hops and a little worm peeks out and waves. */
export function Apfel() {
  return (
    <>
      <g className="kc-apfel-worm" style={{ transformOrigin: "16px -40px" }}>
        <path d="M14 -40 Q14 -64 26 -68" stroke="#94d82d" strokeWidth="10" strokeLinecap="round" fill="none" />
        <circle cx="28" cy="-70" r="8" fill="#94d82d" />
        <circle cx="30" cy="-72" r="2" fill={INK} />
      </g>
      <g className="kc-apfel-body" style={{ transformOrigin: "0px 0px" }}>
        <path d="M0 -50 Q-12 -58 -26 -52 Q-42 -42 -36 -20 Q-30 2 -10 0 Q0 -4 10 0 Q30 2 36 -20 Q42 -42 26 -52 Q12 -58 0 -50 Z" fill="#fa5252" />
        <path d="M-22 -40 Q-28 -28 -24 -16" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.5" />
        <circle cx="16" cy="-40" r="5" fill="#c92a2a" />
        <path d="M0 -50 Q2 -62 8 -68" stroke="#8d5a3b" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M4 -62 Q16 -72 24 -62 Q14 -56 4 -62 Z" fill="#51cf66" />
      </g>
    </>
  );
}

/** Cookie dough on the table; the rolling pin rolls back and forth, flour puffs and the cookies hop. */
export function Nudelholz() {
  return (
    <>
      <ellipse cx="0" cy="-14" rx="110" ry="22" fill="#fff4e6" stroke="#ffe8cc" strokeWidth="3" />
      <g className="kc-teig" style={{ transformOrigin: "0px -14px" }}>
        <ellipse cx="0" cy="-16" rx="84" ry="15" fill="#ffd8a8" />
      </g>
      {[
        { x: -80, d: "M0 -9 L2.6 -3 L9 -3 L4 1 L6 8 L0 4 L-6 8 L-4 1 L-9 -3 L-2.6 -3 Z", c: "#ffa94d" },
        { x: 82, d: "M0 7 L-8 -1 Q-10 -8 -4 -8 Q0 -8 0 -4 Q0 -8 4 -8 Q10 -8 8 -1 Z", c: "#ff8787" },
      ].map(({ x, d, c }, i) => (
        <g key={x} transform={`translate(${x} -8) scale(1.5)`}>
          <path className="kc-keks" d={d} fill={c} style={nth(i)} />
        </g>
      ))}
      <g className="kc-nudelholz" style={{ transformOrigin: "0px -30px" }}>
        <rect x="-70" y="-44" width="140" height="28" rx="14" fill="#e9b872" />
        <path d="M-60 -38 H60" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.5" />
        <rect x="-104" y="-36" width="36" height="12" rx="6" fill="#c88b3a" />
        <rect x="68" y="-36" width="36" height="12" rx="6" fill="#c88b3a" />
      </g>
      <g className="kc-mehl" fill="#fff">
        {[-60, -20, 30, 70].map((x, i) => (
          <circle key={x} cx={x} cy="-52" r="9" style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** The tomato egg timer; its top turns back, it shakes and rings. */
export function Eieruhr() {
  return (
    <>
      <g className="kc-eieruhr-body" style={{ transformOrigin: "0px 0px" }}>
        <path d="M0 -70 Q-46 -72 -44 -34 Q-42 0 0 0 Q42 0 44 -34 Q46 -72 0 -70 Z" fill="#fa5252" />
        <path d="M-30 -52 Q-36 -36 -28 -18" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.45" />
        <path d="M-44 -38 H44" stroke="#fff" strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" opacity="0.8" />
        <path d="M0 -40 L-4 -46 H4 Z" fill="#fff" />
        <g className="kc-eieruhr-top" style={{ transformOrigin: "0px -60px" }}>
          <path d="M0 -68 L-18 -78 L-8 -70 L-20 -62 L-4 -66 L0 -56 L4 -66 L20 -62 L8 -70 L18 -78 Z" fill="#40c057" />
          <rect x="-3" y="-90" width="6" height="16" rx="3" fill="#2f9e44" />
          <circle cx="-12" cy="-52" r="2.5" fill="#fff" />
        </g>
      </g>
      <Lines x={54} y={-44} colour="#fa5252" />
      <Lines x={-54} y={-44} dir={-1} colour="#fa5252" />
    </>
  );
}
