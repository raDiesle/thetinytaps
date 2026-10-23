import { Hideout } from "../hideout";
import { Face, INK, nth } from "../shared";
import { Bubbles, Lid, Splash } from "./parts";

// Things on the tiled floor. Each drawing has its foot point at (0, 0).

/** Hair dryer lying on a pink stool; it buzzes, its fan whirls and warm air blows out. */
export function Foehn() {
  return (
    <>
      {/* Stool */}
      <path d="M-46 -106 L-58 -2 M46 -106 L58 -2 M0 -106 V-4" stroke="#f783ac" strokeWidth="10" strokeLinecap="round" />
      <path d="M-50 -50 H50" stroke="#f783ac" strokeWidth="6" strokeLinecap="round" />
      <rect x="-64" y="-122" width="128" height="18" rx="8" fill="#f06595" />
      <ellipse cx="0" cy="-122" rx="64" ry="12" fill="#faa2c1" />
      {/* Cord down to the plug */}
      <path d="M-28 -128 Q-84 -112 -72 -64 Q-62 -22 -88 -6" stroke="#495057" strokeWidth="4" strokeLinecap="round" fill="none" />
      <rect x="-104" y="-14" width="18" height="12" rx="3" fill="#868e96" />
      <g className="bz-foehn-body" style={{ transformOrigin: "0px -130px" }}>
        <path d="M-20 -152 L-34 -128 Q-32 -120 -22 -124 L-2 -152 Z" fill="#20c997" />
        <circle className="bz-foehn-btn" cx="-18" cy="-140" r="4.5" fill="#ffd43b" />
        <rect x="-50" y="-190" width="82" height="52" rx="26" fill="#38d9a9" />
        <path d="M-30 -180 H16" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.5" />
        <rect x="28" y="-176" width="38" height="24" rx="6" fill="#20c997" />
        <rect x="62" y="-178" width="8" height="28" rx="3" fill="#12b886" />
        <circle cx="-50" cy="-164" r="24" fill="#96f2d7" stroke="#20c997" strokeWidth="4" />
        <g className="bz-foehn-fan" style={{ transformOrigin: "-50px -164px" }} stroke="#20c997" strokeWidth="4" strokeLinecap="round">
          {[0, 120, 240].map((a) => (
            <path key={a} d="M-50 -164 L-50 -180" transform={`rotate(${a} -50 -164)`} />
          ))}
        </g>
      </g>
      <g className="bz-foehn-air" stroke="#ffc9c9" strokeWidth="5" strokeLinecap="round" fill="none">
        {[-176, -164, -152].map((y, i) => (
          <path key={y} d={`M80 ${y} q10 -6 20 0 t20 0 t20 0`} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** Pedal bin; the pedal goes down, the lid flips up and a paper ball flies in. */
export function Muelleimer() {
  return (
    <>
      {/* Someone else peeks out of the bin every time */}
      <Hideout x={-36} y={-170} w={72} h={70} size={50} />
      <g className="bz-eimer-ball">
        <circle cx="0" cy="-150" r="13" fill="#fff" stroke="#adb5bd" strokeWidth="2" />
        <path d="M-6 -156 L2 -148 L-4 -142 M4 -158 L8 -150" stroke="#adb5bd" strokeWidth="2" fill="none" />
      </g>
      <path d="M-40 -100 H40 L34 -4 Q34 0 30 0 H-30 Q-34 0 -34 -4 Z" fill="#ced4da" />
      <rect x="-39" y="-64" width="78" height="10" fill="#ff8fab" />
      <path d="M-28 -90 L-24 -14" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.5" />
      <rect className="bz-eimer-pedal" x="-18" y="-12" width="36" height="9" rx="3" fill="#868e96" style={{ transformOrigin: "0px -4px" }} />
      <g className="bz-eimer-lid" style={{ transformOrigin: "42px -101px" }}>
        <path d="M-44 -98 Q-44 -120 0 -122 Q44 -120 44 -98 Z" fill="#dee2e6" stroke="#adb5bd" strokeWidth="2" />
        <path d="M-26 -112 Q-10 -118 8 -118" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
      </g>
    </>
  );
}

/** Blue potty with a smiling face; it hops and stars sparkle. */
export function Toepfchen() {
  return (
    <>
      <g className="bz-topf" style={{ transformOrigin: "0px 0px" }}>
        <path d="M-50 -60 Q-50 -98 0 -98 Q50 -98 50 -60 Z" fill="#339af0" />
        <path d="M-60 -62 H60 Q58 -14 40 -4 Q0 4 -40 -4 Q-58 -14 -60 -62 Z" fill="#4dabf7" />
        <ellipse cx="0" cy="-62" rx="60" ry="10" fill="#74c0fc" />
        <ellipse cx="0" cy="-62" rx="44" ry="6" fill="#1c7ed6" />
        <path d="M-46 -48 Q-44 -22 -30 -12" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.45" />
        <Face cx={0} cy={-38} size={0.9} />
        <Lid cx={-6.3} cy={-38} r={2.9} fill="#4dabf7" />
        <Lid cx={6.3} cy={-38} r={2.9} fill="#4dabf7" />
      </g>
      <g className="bz-topf-stars" fill="#ffd43b">
        {[
          [-50, -110],
          [0, -130],
          [50, -110],
        ].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y - 12} l4 8 l9 1 l-7 6 l2 9 l-8 -5 l-8 5 l2 -9 l-7 -6 l9 -1 Z`} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** Bathroom scale; it is pressed down, the display lights up and shows numbers and a heart. */
export function Waage() {
  return (
    <>
      <path d="M-70 -12 H70 V-4 Q70 0 66 0 H-66 Q-70 0 -70 -4 Z" fill="#ced4da" />
      <g className="bz-waage-top" style={{ transformOrigin: "0px -4px" }}>
        <path d="M-58 -38 H58 L70 -12 H-70 Z" fill="#f8f9fa" stroke="#dee2e6" strokeWidth="2" />
        <ellipse cx="-24" cy="-20" rx="14" ry="5" fill="#e9ecef" />
        <ellipse cx="24" cy="-20" rx="14" ry="5" fill="#e9ecef" />
        <rect x="-22" y="-36" width="44" height="12" rx="3" fill="#343a40" />
        <rect className="bz-waage-screen" x="-22" y="-36" width="44" height="12" rx="3" fill="#8ce99a" />
        <g className="bz-waage-digits" fill={INK} fontSize="10" fontWeight="800" textAnchor="middle">
          {["8", "12", "15"].map((digit, i) => (
            <text key={digit} x="0" y="-26.5" style={nth(i)}>
              {digit}
            </text>
          ))}
          <path className="bz-waage-heart" d="M0 -26 l-5 -5 q-3 -4 1 -6 q3 -1 4 2 q1 -3 4 -2 q4 2 1 6 Z" fill="#e63946" />
        </g>
      </g>
    </>
  );
}

/** Wicker laundry basket; the lid lifts and a sock pops out and waves. */
export function Waeschekorb() {
  return (
    <g className="bz-korb" style={{ transformOrigin: "0px 0px" }}>
      <g className="bz-korb-sock" style={{ transformOrigin: "-4px -104px" }}>
        <path d="M-16 -100 V-150 Q-16 -160 -6 -160 H4 Q14 -160 14 -150 V-128 Q14 -120 24 -120 H30 Q40 -120 40 -110 V-100 Z" fill="#fff" />
        <path d="M-16 -140 H14 M-16 -124 H14" stroke="#e63946" strokeWidth="6" />
        <path d="M-16 -160 H14 V-152 H-16 Z" fill="#e63946" />
      </g>
      {/* Next to the sock someone else hides in the laundry */}
      <Hideout x={-56} y={-170} w={42} h={66} size={46} />
      <path d="M-56 -104 H56 L46 -4 Q46 0 40 0 H-40 Q-46 0 -46 -4 Z" fill="#d4a373" />
      <path d="M-54 -80 H54 M-52 -56 H52 M-50 -32 H50" stroke="#bc8a5f" strokeWidth="4" />
      <path d="M-30 -104 L-26 0 M0 -104 V0 M30 -104 L26 0" stroke="#bc8a5f" strokeWidth="3" opacity="0.6" />
      <rect x="-44" y="-96" width="16" height="8" rx="4" fill="#7f5539" />
      <rect x="28" y="-96" width="16" height="8" rx="4" fill="#7f5539" />
      <path d="M30 -104 Q48 -100 52 -74 L40 -70 Q36 -90 24 -100 Z" fill="#74c0fc" />
      <g className="bz-korb-lid" style={{ transformOrigin: "58px -104px" }}>
        <path d="M-60 -102 Q-60 -120 0 -122 Q60 -120 60 -102 Z" fill="#bc8a5f" />
        <path d="M-50 -110 Q0 -118 50 -110" stroke="#d4a373" strokeWidth="3" fill="none" />
        <rect x="-10" y="-130" width="20" height="9" rx="4" fill="#7f5539" />
      </g>
    </g>
  );
}

/** A pair of pink bunny slippers; they hop one after the other and wiggle their ears. */
export function Hausschuhe() {
  return (
    <>
      {[-40, 40].map((x, i) => (
        <g key={x} className="bz-schuh" style={{ ...nth(i), transformOrigin: `${x}px 0px` }}>
          <g className="bz-schuh-ear" style={{ ...nth(i), transformOrigin: `${x}px -36px` }}>
            {[-1, 1].map((s) => (
              <g key={s} transform={`rotate(${s * 14} ${x + s * 9} -40)`}>
                <ellipse cx={x + s * 9} cy="-58" rx="8" ry="20" fill="#ffc9de" />
                <ellipse cx={x + s * 9} cy="-58" rx="4" ry="13" fill="#ff8fab" />
              </g>
            ))}
          </g>
          <ellipse cx={x} cy="-18" rx="36" ry="20" fill="#ffc9de" />
          <ellipse cx={x} cy="-12" rx="34" ry="10" fill="#ffadd2" />
          <ellipse cx={x} cy="-32" rx="18" ry="5" fill="#f783ac" />
          <circle cx={x - 9} cy="-22" r="3" fill={INK} />
          <circle cx={x + 9} cy="-22" r="3" fill={INK} />
          <circle cx={x} cy="-15" r="3.5" fill="#ff6b8b" />
        </g>
      ))}
    </>
  );
}

/** A pink bar of soap on the floor; it slides away – hui! – and comes back with bubbles. */
export function Seife() {
  return (
    <>
      <g className="bz-seife" style={{ transformOrigin: "0px 0px" }}>
        <rect x="-42" y="-38" width="84" height="34" rx="15" fill="#ffa8c5" />
        <rect x="-36" y="-36" width="72" height="12" rx="6" fill="#ffc9de" />
        <Face cx={0} cy={-24} size={0.55} />
      </g>
      <Bubbles x={0} y={-56} count={3} spread={22} r={9} />
    </>
  );
}

const BALL = ["#e63946", "#fff", "#ffd43b", "#fff", "#4dabf7", "#fff"];

/** A colourful beach ball; it bounces and spins. */
export function Wasserball() {
  return (
    <g className="bz-ball" style={{ transformOrigin: "0px 0px" }}>
      <g className="bz-ball-spin" style={{ transformOrigin: "0px -50px" }}>
        {BALL.map((fill, k) => {
          const a0 = ((k * 60 - 90) * Math.PI) / 180;
          const a1 = (((k + 1) * 60 - 90) * Math.PI) / 180;
          return (
            <path
              key={k}
              d={`M0 -50 L${(50 * Math.cos(a0)).toFixed(1)} ${(-50 + 50 * Math.sin(a0)).toFixed(1)} A50 50 0 0 1 ${(50 * Math.cos(a1)).toFixed(1)} ${(-50 + 50 * Math.sin(a1)).toFixed(1)} Z`}
              fill={fill}
            />
          );
        })}
        <circle cx="0" cy="-50" r="9" fill="#fff" stroke="#dee2e6" strokeWidth="2" />
      </g>
      <circle cx="0" cy="-50" r="50" fill="none" stroke="#dee2e6" strokeWidth="2" />
      <ellipse cx="-20" cy="-74" rx="13" ry="7" fill="#fff" opacity="0.6" transform="rotate(-30 -20 -74)" />
    </g>
  );
}

/** Yellow sponge with a green scrubbing side; it is squeezed and water squirts out. */
export function Schwamm() {
  return (
    <>
      <g className="bz-schwamm" style={{ transformOrigin: "0px 0px" }}>
        <rect x="-46" y="-50" width="92" height="48" rx="10" fill="#ffd43b" />
        <rect x="-46" y="-60" width="92" height="16" rx="6" fill="#51cf66" />
        {[
          [-30, -14],
          [32, -18],
          [-36, -36],
          [28, -38],
        ].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r="3.5" fill="#fab005" />
        ))}
        <Face cx={0} cy={-30} size={0.8} />
        <Lid cx={-5.6} cy={-30} r={2.56} fill="#ffd43b" />
        <Lid cx={5.6} cy={-30} r={2.56} fill="#ffd43b" />
      </g>
      <Splash x={0} y={-66} count={5} spread={24} className="bz-schwamm-drops" />
    </>
  );
}

/** A bottle of bubble mix with its wand; the wand lifts and lots of bubbles float up and pop. */
export function Seifenblasen() {
  const rest = [
    [-34, -160, 16],
    [40, -196, 12],
    [-8, -212, 10],
  ];
  return (
    <>
      <g className="bz-blasen-wand" style={{ transformOrigin: "0px -80px" }}>
        <path d="M4 -80 L14 -146" stroke="#e599f7" strokeWidth="5" strokeLinecap="round" />
        <circle cx="16" cy="-160" r="13" fill="#fff" fillOpacity="0.35" stroke="#e599f7" strokeWidth="4" />
      </g>
      <rect x="-14" y="-84" width="28" height="14" rx="3" fill="#be4bdb" />
      <rect x="-24" y="-74" width="48" height="74" rx="10" fill="#da77f2" />
      <rect x="-16" y="-54" width="32" height="30" rx="5" fill="#fff" />
      <circle cx="-4" cy="-42" r="7" fill="none" stroke="#74c0fc" strokeWidth="2.5" />
      <circle cx="6" cy="-34" r="4" fill="none" stroke="#74c0fc" strokeWidth="2" />
      <path d="M-16 -66 V-10" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
      {rest.map(([x, y, r], i) => (
        <g key={i} className="bz-blasen-rest" style={nth(i)}>
          <circle cx={x} cy={y} r={r} fill="#e7f5ff" fillOpacity="0.4" stroke="#a5d8ff" strokeWidth="2.5" />
          <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.25} fill="#fff" />
        </g>
      ))}
      <g className="bz-blasen-new">
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} style={nth(i)}>
            <circle cx={16} cy={-160} r={10 + (i % 3) * 3} fill="#fff0f6" fillOpacity="0.4" stroke={i % 2 ? "#a5d8ff" : "#fcc2d7"} strokeWidth="2.5" />
            <circle cx={12} cy={-164} r="2.5" fill="#fff" />
          </g>
        ))}
      </g>
    </>
  );
}
