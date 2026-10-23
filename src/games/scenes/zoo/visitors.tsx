import { Hideout } from "../hideout";
import { Face, INK, Pane, Rider, SKIN, Wheel, nth } from "../shared";
import { Drops, Lid } from "./parts";

// People and things on the zoo path, and the balloon that flew away. Each drawing has its
// foot point at (0, 0), except the balloon (the knot at (0, 0)).

/** A wagon of the little zoo train with two children; x is its left end. */
function Wagon({ x, color, stripe }: { x: number; color: string; stripe: string }) {
  return (
    <g>
      <path d={`M${x + 8} -164 V-100 M${x + 132} -164 V-100`} stroke="#ced4da" strokeWidth="6" />
      <rect x={x - 6} y="-178" width="152" height="16" rx="7" fill="#fff" />
      <path d={`M${x + 14} -178 h22 v16 h-22 Z M${x + 58} -178 h22 v16 h-22 Z M${x + 102} -178 h22 v16 h-22 Z`} fill="#e63946" />
      {[
        [x + 42, "#6b4423"],
        [x + 100, "#ffb703"],
      ].map(([cx, hair], i) => (
        <g key={cx} className="zo-bahn-kid" style={{ ...nth(i), transformOrigin: `${cx}px -100px` }}>
          <path className="zo-bahn-wave" d={`M${(cx as number) + 12} -102 L${(cx as number) + 22} -136`} stroke={SKIN} strokeWidth="7" strokeLinecap="round" style={{ transformOrigin: `${(cx as number) + 12}px -102px` }} />
          <circle cx={cx} cy="-118" r="17" fill={SKIN} />
          <path d={`M${(cx as number) - 17} -120 Q${(cx as number) - 18} -138 ${cx} -137 Q${(cx as number) + 18} -138 ${(cx as number) + 17} -120 Q${(cx as number) + 4} -130 ${(cx as number) - 17} -120 Z`} fill={hair as string} />
          <Face cx={cx as number} cy={-118} size={0.6} />
        </g>
      ))}
      <rect x={x} y="-104" width="140" height="64" rx="12" fill={color} />
      <rect x={x} y="-80" width="140" height="12" fill={stripe} />
      <path d={`M${x + 10} -98 H${x + 130}`} stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
      <g className="zo-bahn-wheel" style={nth(0)}>
        <Wheel cx={x + 32} cy={-26} r={20} />
      </g>
      <g className="zo-bahn-wheel">
        <Wheel cx={x + 108} cy={-26} r={20} />
      </g>
    </g>
  );
}

/** The little zoo train ("Bimmelbahn"): a red engine with two wagons, driving right; its bell rings. */
export function Bimmelbahn() {
  return (
    <g className="zo-bahn-ride">
      <g className="zo-bahn-body">
        <path d="M-120 -54 H-100 M40 -54 H62" stroke="#495057" strokeWidth="8" strokeLinecap="round" />
        <Wagon x={-260} color="#3a86ff" stripe="#ffd60a" />
        <Wagon x={-100} color="#ffd60a" stripe="#3a86ff" />
        <Drops x={205} y={-184} className="zo-bahn-smoke" fill="#e9ecef" count={3} spread={14} />
        <rect x="196" y="-162" width="18" height="34" rx="3" fill="#343a40" />
        <rect x="190" y="-168" width="30" height="10" rx="4" fill="#495057" />
        <rect x="140" y="-132" width="94" height="70" rx="20" fill="#e63946" />
        <path d="M150 -120 H226" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.4" />
        <rect x="58" y="-172" width="88" height="110" rx="10" fill="#d62839" />
        <Pane x={70} y={-160} w={64} h={46}>
          <g className="zo-bahn-driver" style={{ transformOrigin: "102px -110px" }}>
            <Rider cx={102} cy={-136} shirt="#2a9d8f" cap="#2a9d8f" />
          </g>
        </Pane>
        <rect x="48" y="-188" width="108" height="18" rx="7" fill="#ffd60a" />
        <rect x="56" y="-74" width="180" height="40" rx="10" fill="#c1121f" />
        <circle cx="236" cy="-104" r="10" fill="#fff3b0" />
        <circle cx="236" cy="-104" r="5" fill="#fff" />
        <circle className="zo-bahn-light" cx="236" cy="-104" r="22" fill="#fff3b0" />
        <path d="M100 -188 V-200 M88 -200 H112" stroke="#495057" strokeWidth="4" strokeLinecap="round" />
        <g className="zo-bahn-bell" style={{ transformOrigin: "100px -206px" }}>
          <path d="M100 -200 V-206 M88 -206 Q88 -226 100 -226 Q112 -226 112 -206 Z" stroke="#495057" strokeWidth="2" fill="#ffb703" />
        </g>
        <g className="zo-bahn-wheel" style={nth(1)}>
          <Wheel cx={96} cy={-26} r={26} />
        </g>
        <g className="zo-bahn-wheel">
          <Wheel cx={196} cy={-26} r={26} />
        </g>
      </g>
      <g className="zo-bahn-notes" fill={INK}>
        {[0, 1, 2].map((i) => (
          <g key={i} style={nth(i)}>
            <circle cx={130 + i * 22} cy={-224 - i * 12} r="5" />
            <path d={`M${135 + i * 22} ${-224 - i * 12} V${-244 - i * 12}`} stroke={INK} strokeWidth="2.5" />
          </g>
        ))}
      </g>
    </g>
  );
}

/** The zoo keeper with a bucket of fish; she waves and throws a fish. */
export function Tierpfleger() {
  return (
    <g className="zo-pfleger-body" style={{ transformOrigin: "0px 0px" }}>
      <rect x="-22" y="-90" width="18" height="80" rx="6" fill="#2d6a4f" />
      <rect x="4" y="-90" width="18" height="80" rx="6" fill="#2d6a4f" />
      <rect x="-26" y="-14" width="24" height="14" rx="5" fill="#5e3a1f" />
      <rect x="2" y="-14" width="24" height="14" rx="5" fill="#5e3a1f" />
      <path d="M-30 -150 Q-30 -164 -16 -164 H16 Q30 -164 30 -150 V-84 H-30 Z" fill="#c9a66b" />
      <path d="M-6 -164 L0 -150 L6 -164" stroke="#a98a52" strokeWidth="3" fill="none" />
      <rect x="10" y="-140" width="14" height="12" rx="2" fill="#a98a52" />
      <g className="zo-pfleger-bucket" style={{ transformOrigin: "-28px -150px" }}>
        <path d="M-28 -150 Q-48 -120 -46 -88" stroke="#c9a66b" strokeWidth="13" strokeLinecap="round" fill="none" />
        <circle cx="-46" cy="-84" r="7" fill={SKIN} />
        {/* The bucket of fish */}
        <path d="M-74 -84 Q-46 -110 -20 -84" stroke="#495057" strokeWidth="3" fill="none" />
        <path className="zo-pfleger-bucketfish" d="M-60 -84 l-6 -12 l12 4 Z M-40 -84 l4 -14 l6 12 Z" fill="#4dabf7" />
        {/* Who sits in the bucket today? */}
        <Hideout x={-68} y={-130} w={42} h={46} size={36} />
        <path d="M-72 -84 H-22 L-28 -40 H-66 Z" fill="#adb5bd" />
        <path d="M-70 -76 H-24" stroke="#ced4da" strokeWidth="4" />
      </g>
      <g className="zo-pfleger-arm" style={{ transformOrigin: "26px -148px" }}>
        <path d="M26 -148 Q46 -124 44 -96" stroke="#c9a66b" strokeWidth="13" strokeLinecap="round" fill="none" />
        <circle cx="44" cy="-90" r="7" fill={SKIN} />
      </g>
      <circle cx="0" cy="-186" r="24" fill={SKIN} />
      <path d="M-22 -196 Q-26 -170 -18 -160 M22 -196 Q26 -170 18 -160" stroke="#6b4423" strokeWidth="8" strokeLinecap="round" fill="none" />
      <Face cx={0} cy={-188} size={0.9} />
      <Lid cx={-6.3} cy={-188} r={2.9} fill={SKIN} />
      <Lid cx={6.3} cy={-188} r={2.9} fill={SKIN} />
      <g className="zo-pfleger-hat" style={{ transformOrigin: "20px -204px" }}>
        <path d="M-40 -204 Q0 -214 40 -204 Q30 -196 0 -198 Q-30 -196 -40 -204 Z" fill="#a98a52" />
        <path d="M-22 -204 Q-20 -232 0 -232 Q20 -232 22 -204 Z" fill="#c9a66b" />
        <path d="M-22 -210 H22" stroke="#6b4423" strokeWidth="4" />
      </g>
      <g className="zo-pfleger-fish" style={{ transformOrigin: "44px -96px" }} fill="#4dabf7">
        <ellipse cx="44" cy="-100" rx="14" ry="7" />
        <path d="M56 -100 l12 -7 v14 Z" />
      </g>
    </g>
  );
}

/** A child on the path with an ice cream; it jumps for joy. */
export function Kind() {
  return (
    <g className="zo-kind-body" style={{ transformOrigin: "0px 0px" }}>
      <rect x="-14" y="-50" width="11" height="44" rx="5" fill={SKIN} />
      <rect x="3" y="-50" width="11" height="44" rx="5" fill={SKIN} />
      <rect x="-17" y="-10" width="16" height="10" rx="4" fill="#e63946" />
      <rect x="1" y="-10" width="16" height="10" rx="4" fill="#e63946" />
      <path d="M-16 -106 Q-16 -114 -8 -114 H8 Q16 -114 16 -106 L26 -46 H-26 Z" fill="#9b5de5" />
      <circle cx="-6" cy="-78" r="4" fill="#fff" opacity="0.6" />
      <circle cx="8" cy="-64" r="4" fill="#fff" opacity="0.6" />
      <path d="M-14 -104 Q-30 -86 -28 -66" stroke={SKIN} strokeWidth="9" strokeLinecap="round" fill="none" />
      <g className="zo-kind-arm" style={{ transformOrigin: "14px -104px" }}>
        <path d="M14 -104 Q32 -110 34 -130" stroke={SKIN} strokeWidth="9" strokeLinecap="round" fill="none" />
        <path d="M28 -134 L36 -112 L44 -134 Z" fill="#e9b872" />
        <g className="zo-kind-scoop" style={{ transformOrigin: "36px -134px" }}>
          <circle cx="36" cy="-140" r="9" fill="#ffafcc" />
          <circle cx="36" cy="-152" r="8" fill="#a3d9a5" />
        </g>
      </g>
      <circle className="zo-kind-bun" cx="-22" cy="-140" r="9" fill="#6b4423" style={nth(0)} />
      <circle className="zo-kind-bun" cx="22" cy="-140" r="9" fill="#6b4423" style={nth(1)} />
      <circle cx="0" cy="-136" r="22" fill={SKIN} />
      <path d="M-22 -138 Q-22 -160 0 -160 Q22 -160 22 -138 Q10 -150 -22 -138 Z" fill="#6b4423" />
      <Face cx={0} cy={-136} size={0.8} />
      <Lid cx={-5.6} cy={-136} r={2.6} fill={SKIN} />
      <Lid cx={5.6} cy={-136} r={2.6} fill={SKIN} />
      <path className="zo-kind-heart" d="M-10 -176 c-5 -8 -16 0 0 11 c16 -11 5 -19 0 -11 Z" fill="#ff8fa3" />
    </g>
  );
}

/** The ice cream cart with its striped umbrella; the umbrella turns, the bell rings, a cone pops up. */
export function Eiswagen() {
  return (
    <g className="zo-eis-body">
      <g className="zo-eis-umbrella" style={{ transformOrigin: "0px -120px" }}>
        <path d="M0 -120 V-206" stroke="#adb5bd" strokeWidth="5" />
        <path d="M-104 -196 Q0 -264 104 -196 Z" fill="#fff" />
        <path d="M-104 -196 Q-78 -232 -44 -246 L-36 -196 Z M0 -252 Q20 -252 40 -246 L36 -196 H0 Z M104 -196 Q86 -228 72 -238 L70 -196 Z" fill="#ff5d8f" />
        <path d="M-104 -196 Q0 -182 104 -196" stroke="#ff5d8f" strokeWidth="6" fill="none" />
        <circle cx="0" cy="-254" r="6" fill="#ff5d8f" />
      </g>
      <g className="zo-eis-cone" style={{ transformOrigin: "40px -120px" }}>
        <path d="M30 -122 L40 -96 L50 -122 Z" fill="#e9b872" />
        <circle cx="40" cy="-128" r="11" fill="#a0522d" />
        <circle cx="40" cy="-142" r="10" fill="#ffafcc" />
      </g>
      {/* Behind the cart someone else hides every time */}
      <Hideout x={-84} y={-194} w={72} h={70} size={58} />
      <rect x="-90" y="-124" width="180" height="96" rx="16" fill="#fff0f3" />
      <path d="M-90 -100 H90 M-90 -56 H90" stroke="#ffafcc" strokeWidth="10" />
      <g className="zo-eis-sign" style={{ transformOrigin: "-30px -50px" }}>
        <circle cx="-30" cy="-78" r="14" fill="#ffd166" />
        <path d="M-40 -74 L-30 -48 L-20 -74 Z" fill="#e9b872" />
        <circle cx="-30" cy="-82" r="10" fill="#ff8fab" />
      </g>
      <g className="zo-eis-lid" style={{ transformOrigin: "14px -124px" }}>
        <rect x="14" y="-132" width="54" height="10" rx="4" fill="#ff8fab" />
        <rect x="36" y="-138" width="12" height="6" rx="3" fill="#c9184a" />
      </g>
      <path d="M90 -110 H124 V-150" stroke="#6c757d" strokeWidth="7" strokeLinecap="round" fill="none" />
      <g className="zo-eis-bell" style={{ transformOrigin: "124px -148px" }}>
        <path d="M114 -132 Q114 -150 124 -150 Q134 -150 134 -132 Z" fill="#ffd60a" />
        <circle cx="124" cy="-130" r="3" fill="#bc6c25" />
      </g>
      <g className="zo-eis-wheel">
        <Wheel cx={-50} cy={-28} r={28} />
      </g>
      <g className="zo-eis-wheel">
        <Wheel cx={50} cy={-28} r={28} />
      </g>
    </g>
  );
}

/** A red balloon that flew away, its knot at (0, 0); it bobs and sways. */
export function Luftballon() {
  return (
    <g className="zo-ballon-body" style={{ transformOrigin: "0px 0px" }}>
      <path className="zo-ballon-string" d="M0 4 Q-12 30 4 52 Q18 72 4 96" stroke="#6c757d" strokeWidth="2.5" fill="none" style={{ transformOrigin: "0px 4px" }} />
      <ellipse cx="0" cy="-46" rx="36" ry="44" fill="#e63946" />
      <ellipse cx="-12" cy="-64" rx="9" ry="14" fill="#fff" opacity="0.5" transform="rotate(20 -12 -64)" />
      <path className="zo-ballon-twinkle" d="M22 -78 Q22 -68 32 -68 Q22 -68 22 -58 Q22 -68 12 -68 Q22 -68 22 -78 Z" fill="#fff" />
      <path d="M-6 4 L0 -4 L6 4 Z" fill="#c1121f" />
    </g>
  );
}
