import { nth } from "../shared";
import { TABLE_TOP_BACK, TABLE_TOP_FRONT } from "./layout";
import { Drops, Lines, Puffs } from "./parts";

// The little lunch table and what stands on it. The table's foot point is the middle of its
// front edge on the floor; the things on it have their foot at (0, 0) and are placed with onTable().

const F = TABLE_TOP_FRONT;
const B = TABLE_TOP_BACK;

/** The low lunch table with two plates; it wobbles, the plates jump and the cutlery clinks. */
export function Tisch() {
  return (
    <g className="ki-tisch" style={{ transformOrigin: "0px 0px" }}>
      {/* Back legs, then the top seen from above, its edge and the front legs */}
      <path d="M-210 -228 V-52 M210 -228 V-52" stroke="#ffa94d" strokeWidth="18" strokeLinecap="round" />
      <path d={`M-252 ${F} L-222 ${B} H222 L252 ${F} Z`} fill="#fff4e6" />
      <path d={`M-236 ${F - 8} L-214 ${B + 6} H214 L236 ${F - 8} Z`} fill="none" stroke="#ffe8cc" strokeWidth="6" />
      {[-140, 140].map((x, i) => (
        <g key={x} className="ki-tisch-plate" style={nth(i)}>
          <ellipse cx={x} cy={B + 22} rx="44" ry="11" fill="#fff" stroke={i ? "#ffc9c9" : "#a5d8ff"} strokeWidth="4" />
          {i === 0 && <path d={`M${x - 20} ${B + 22} q8 -8 14 0 t14 0 t14 0`} stroke="#ffe066" strokeWidth="5" strokeLinecap="round" fill="none" />}
          {i === 1 && <circle cx={x + 6} cy={B + 20} r="8" fill="#ff8787" />}
        </g>
      ))}
      <g className="ki-tisch-spoon" style={{ transformOrigin: "-60px -214px" }}>
        <path d={`M-84 ${B + 30} L-44 ${B + 20}`} stroke="#adb5bd" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="-90" cy={B + 31} rx="8" ry="5" fill="#adb5bd" />
      </g>
      <rect x="-256" y={F - 2} width="512" height="18" rx="6" fill="#51cf66" />
      <rect x="-256" y={F + 12} width="512" height="5" rx="2" fill="#2f9e44" />
      <path d={`M-236 ${F + 14} V-8 M236 ${F + 14} V-8`} stroke="#ff922b" strokeWidth="22" strokeLinecap="round" />
      <path d={`M-242 ${F + 30} V-40 M230 ${F + 30} V-40`} stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.35" />
    </g>
  );
}

/** The green soup pot; the lid hops, steam rises and a carrot jumps out: it smells good! */
export function Topf() {
  return (
    <>
      <Puffs x={0} y={-110} count={3} spread={30} r={11} />
      <g className="ki-topf-carrot" style={{ transformOrigin: "10px -70px" }}>
        <path d="M2 -82 L22 -82 L12 -60 Z" fill="#ff922b" />
        <path d="M12 -82 l-4 -10 M12 -82 l4 -10" stroke="#51cf66" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="ki-topf-pot" style={{ transformOrigin: "0px 0px" }}>
        <rect x="-78" y="-62" width="20" height="10" rx="5" fill="#2f9e44" />
        <rect x="58" y="-62" width="20" height="10" rx="5" fill="#2f9e44" />
        <path d="M-62 -70 H62 V-14 Q62 0 48 0 H-48 Q-62 0 -62 -14 Z" fill="#51cf66" />
        <path d="M-50 -58 V-16" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.4" />
        {[-24, 0, 24].map((x) => (
          <circle key={x} cx={x} cy="-36" r="6" fill="#fff" opacity="0.8" />
        ))}
      </g>
      <g className="ki-topf-lid" style={{ transformOrigin: "-60px -70px" }}>
        <path d="M-68 -70 Q-64 -88 0 -90 Q64 -88 68 -70 Z" fill="#40c057" />
        <rect x="-12" y="-100" width="24" height="12" rx="6" fill="#2f9e44" />
      </g>
    </>
  );
}

/** The blue water jug and a cup; the jug tips, the water pours and the cup fills up. */
export function Kanne() {
  return (
    <>
      {/* The cup */}
      <path d="M-74 -46 H-30 L-34 -2 Q-35 2 -40 2 H-64 Q-69 2 -70 -2 Z" fill="#fff" stroke="#ced4da" strokeWidth="2.5" />
      <g className="ki-kanne-fill" style={{ transformOrigin: "-52px 0px" }}>
        <path d="M-71 -30 H-33 L-35 -4 Q-36 -1 -40 -1 H-64 Q-68 -1 -69 -4 Z" fill="#74c0fc" />
      </g>
      <path className="ki-kanne-stream" d="M-26 -104 Q-44 -90 -50 -46" stroke="#74c0fc" strokeWidth="7" strokeLinecap="round" fill="none" />
      <Drops x={-52} y={-50} count={3} spread={14} size={0.7} />
      <g className="ki-kanne-jug" style={{ transformOrigin: "40px 0px" }}>
        <path d="M54 -94 Q86 -92 82 -60 Q78 -36 56 -30" stroke="#339af0" strokeWidth="9" fill="none" />
        <path d="M2 -110 L-12 -100 L10 -96 Q4 -60 10 -4 Q12 2 20 2 H56 Q64 2 64 -6 Q70 -60 58 -108 Z" fill="#74c0fc" />
        <path d="M10 -78 Q8 -50 14 -14" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.5" />
        <path d="M14 -64 Q36 -60 60 -64 V-10 Q60 -4 54 -4 H22 Q16 -4 15 -10 Z" fill="#4dabf7" opacity="0.6" />
        <ellipse cx="30" cy="-108" rx="28" ry="6" fill="#a5d8ff" />
      </g>
    </>
  );
}

/** A raspberry pudding with cream and a cherry; it wobbles, wibble, wobble, and the cherry hops. */
export function Pudding() {
  return (
    <>
      <ellipse cx="0" cy="-4" rx="52" ry="11" fill="#fff" stroke="#dee2e6" strokeWidth="3" />
      <Lines x={50} y={-46} colour="#fa5252" size={0.8} />
      <Lines x={-50} y={-46} dir={-1} colour="#fa5252" size={0.8} />
      <g className="ki-pudding" style={{ transformOrigin: "0px -6px" }}>
        <path d="M-38 -6 L-32 -56 Q0 -66 32 -56 L38 -6 Q0 2 -38 -6 Z" fill="#fa5252" />
        <path d="M-26 -50 L-30 -14" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.45" />
        <path d="M-32 -56 Q-26 -70 -10 -66 Q0 -78 12 -66 Q28 -70 32 -56 Q0 -48 -32 -56 Z" fill="#fff" />
      </g>
      <g className="ki-pudding-cherry" style={{ transformOrigin: "2px -72px" }}>
        <circle cx="2" cy="-78" r="9" fill="#c92a2a" />
        <circle cx="-1" cy="-81" r="2.5" fill="#fff" opacity="0.7" />
        <path d="M2 -86 Q6 -98 14 -100" stroke="#2f9e44" strokeWidth="2.5" fill="none" />
      </g>
    </>
  );
}
