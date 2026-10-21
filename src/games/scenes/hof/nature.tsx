import { nth } from "../shared";

// Plants and the hay. Foot point at (0, 0).

const CROWN = [
  [0, -214, 92, "#52b788"],
  [-74, -168, 62, "#40916c"],
  [74, -172, 64, "#40916c"],
  [-30, -270, 54, "#52b788"],
  [40, -258, 50, "#52b788"],
] as const;

const APPLES = [
  [-50, -190],
  [34, -224],
  [80, -156],
  [-92, -150],
  [8, -160],
  [-20, -250],
  [60, -200],
];

/** Apple tree with a basket below; the crown shakes, a bird flies out, leaves and two apples fall, the apples in the basket hop. */
export function Apfelbaum() {
  return (
    <>
      <path d="M-18 0 Q-10 -70 -12 -124 H12 Q10 -70 18 0 Z" fill="#8d5a2b" />
      <path d="M-4 -40 q4 -8 8 0" stroke="#6b4423" strokeWidth="3" fill="none" />
      <path d="M0 -84 L-36 -128 M2 -100 L34 -142" stroke="#8d5a2b" strokeWidth="10" strokeLinecap="round" />
      <g className="hf-baum-crown" style={{ transformOrigin: "0px -124px" }}>
        {CROWN.map(([cx, cy, r, fill]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={fill} />
        ))}
        <circle cx="-36" cy="-286" r="18" fill="#74c69d" />
        <circle cx="-30" cy="-232" r="26" fill="#74c69d" opacity="0.6" />
        {APPLES.map(([cx, cy]) => (
          <g key={cx}>
            <circle cx={cx} cy={cy} r="10" fill="#e63946" />
            <circle cx={cx - 3} cy={cy - 3} r="3" fill="#fff" opacity="0.6" />
          </g>
        ))}
      </g>
      <g className="hf-baum-leaves" fill="#52b788">
        {[
          [-84, -150],
          [74, -140],
          [10, -136],
        ].map(([cx, cy], i) => (
          <ellipse key={cx} cx={cx} cy={cy} rx="9" ry="5" style={nth(i)} />
        ))}
      </g>
      <g className="hf-baum-bird">
        <path d="M24 -262 L12 -270 L16 -258 Z" fill="#3a86ff" />
        <ellipse cx="34" cy="-260" rx="12" ry="8" fill="#4895ef" />
        <circle cx="44" cy="-266" r="6" fill="#4895ef" />
        <path d="M49 -267 L55 -265 L49 -263 Z" fill="#ffb703" />
        <circle cx="46" cy="-268" r="1.6" fill="#2b2d42" />
      </g>
      <g className="hf-baum-fall">
        {[
          [-64, -140],
          [52, -134],
        ].map(([cx, cy], i) => (
          <circle key={cx} cx={cx} cy={cy} r="10" fill="#e63946" style={nth(i)} />
        ))}
      </g>
      <path d="M44 -34 H104 L96 0 H52 Z" fill="#bc6c25" />
      <path d="M48 -22 H100 M50 -10 H98" stroke="#a0522d" strokeWidth="3" />
      {[56, 70, 84, 98].map((cx, i) => (
        <circle key={cx} className="hf-baum-basket" cx={cx - 2} cy={-38 - (i % 2) * 6} r="9" fill={i % 2 ? "#ffd60a" : "#e63946"} style={nth(i)} />
      ))}
      <path d="M44 -34 Q74 -76 104 -34" stroke="#a0522d" strokeWidth="4" fill="none" />
    </>
  );
}

/** Big orange pumpkin on its vine; it grows a little and wobbles, its leaves flap and a ladybird crawls out. */
export function Kuerbis() {
  return (
    <>
      <path d="M-70 -6 Q-50 -24 -30 -8" stroke="#40916c" strokeWidth="5" fill="none" />
      <path className="hf-kuerbis-vine" d="M-74 -12 Q-90 -30 -70 -40 Q-60 -26 -74 -12 Z" fill="#52b788" style={{ transformOrigin: "-74px -12px" }} />
      {/* A ladybird hiding behind the pumpkin */}
      <g className="hf-kuerbis-bug">
        <circle cx="34" cy="-22" r="9" fill="#e63946" />
        <path d="M34 -31 V-13" stroke="#2b2d42" strokeWidth="1.5" />
        <circle cx="30" cy="-25" r="2" fill="#2b2d42" />
        <circle cx="38" cy="-19" r="2" fill="#2b2d42" />
        <circle cx="43" cy="-22" r="4.5" fill="#2b2d42" />
      </g>
      <g className="hf-kuerbis-body" style={{ transformOrigin: "0px 0px" }}>
        <ellipse cx="-32" cy="-44" rx="30" ry="40" fill="#f77f00" />
        <ellipse cx="32" cy="-44" rx="30" ry="40" fill="#f77f00" />
        <ellipse cx="0" cy="-46" rx="34" ry="46" fill="#fb8b24" />
        <path d="M-16 -86 Q-26 -46 -16 -4 M16 -86 Q26 -46 16 -4" stroke="#e36414" strokeWidth="3" fill="none" />
        <ellipse cx="-8" cy="-70" rx="8" ry="16" fill="#fff" opacity="0.35" />
        <path d="M-4 -88 Q-2 -106 10 -110 L13 -103 Q6 -100 6 -88 Z" fill="#6a994e" />
        <path className="hf-kuerbis-leaf" d="M10 -96 Q30 -112 44 -96 Q30 -86 10 -96 Z" fill="#52b788" style={{ transformOrigin: "10px -96px" }} />
      </g>
    </>
  );
}

/** A round hay bale and a square one; the round one wobbles, the square one bounces, straw and dust fly. */
export function Heuballen() {
  return (
    <>
      <g className="hf-heu-square" style={{ transformOrigin: "95px 0px" }}>
        <path d="M46 -62 L62 -78 H150 L136 -62 Z" fill="#f4d58d" />
        <path d="M136 -62 L150 -78 V-14 L136 0 Z" fill="#d4a373" />
        <rect x="40" y="-62" width="96" height="62" rx="4" fill="#e9c46a" />
        <path d="M70 -62 V0 M106 -62 V0 M86 -78 L70 -62 M122 -78 L106 -62" stroke="#bc6c25" strokeWidth="3" />
        <path d="M50 -44 h10 M90 -30 h12 M56 -16 h8 M116 -48 h10" stroke="#d4a373" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="hf-heu-round" style={{ transformOrigin: "0px 0px" }}>
        <circle cx="0" cy="-62" r="62" fill="#e9c46a" />
        <path
          d="M0 -62 m-6 0 a6 6 0 1 1 12 0 a14 14 0 1 1 -28 0 a22 22 0 1 1 44 0 a30 30 0 1 1 -60 0 a38 38 0 1 1 76 0 a46 46 0 1 1 -92 0"
          stroke="#d4a373"
          strokeWidth="4"
          fill="none"
        />
        <ellipse cx="-24" cy="-100" rx="18" ry="7" fill="#fff" opacity="0.3" />
      </g>
      <g className="hf-heu-dust" fill="#f4d58d">
        {[-56, 40, 150].map((cx, i) => (
          <circle key={cx} cx={cx} cy="-6" r="10" style={nth(i)} />
        ))}
      </g>
      <g className="hf-heu-straw" stroke="#e9c46a" strokeWidth="4" strokeLinecap="round">
        {[-40, -10, 24, 50].map((x, i) => (
          <path key={x} d={`M${x} -110 l8 -8`} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

const WILD = [
  [-48, -64, "#e63946", "#2b2d42"],
  [-18, -96, "#4895ef", "#1d3557"],
  [14, -74, "#fff", "#ffd60a"],
  [40, -104, "#ffd60a", "#e85d04"],
  [56, -56, "#e63946", "#2b2d42"],
] as const;

/** Wild flowers in the grass: poppies, a cornflower, a daisy and a buttercup; the heads turn, leaves and grass sway and pollen floats up. */
export function Blumen() {
  return (
    <>
      <path d={WILD.map(([x, y]) => `M${x} ${y} Q${x * 0.6} ${y / 2} ${x * 0.3} 0`).join(" ")} stroke="#40916c" strokeWidth="4" fill="none" />
      <path className="hf-blume-leaf" d="M-30 -20 q-14 -10 -22 -4 q10 8 22 4" fill="#52b788" style={{ transformOrigin: "-30px -20px" }} />
      <path className="hf-blume-leaf hf-ear-right" d="M20 -28 q14 -10 22 -4 q-10 8 -22 4" fill="#52b788" style={{ transformOrigin: "20px -28px" }} />
      <g className="hf-blume-pollen" fill="#ffd60a">
        {WILD.map(([cx, cy], i) => (
          <circle key={cx} cx={cx + 6} cy={cy - 14} r="3.5" style={nth(i)} />
        ))}
      </g>
      {WILD.map(([cx, cy, petals, middle], i) => (
        <g key={cx} className="hf-blume-head" style={nth(i)}>
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={a} cx={cx} cy={cy - 9} r="8.5" fill={petals} transform={`rotate(${a} ${cx} ${cy})`} />
          ))}
          <circle cx={cx} cy={cy} r="6" fill={middle} />
        </g>
      ))}
      <path
        className="hf-blume-grass"
        d="M-62 0 q4 -18 10 -24 M-56 0 q0 -20 -4 -28 M60 0 q4 -16 12 -20"
        stroke="#52b788"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        style={{ transformOrigin: "0px 0px" }}
      />
    </>
  );
}
