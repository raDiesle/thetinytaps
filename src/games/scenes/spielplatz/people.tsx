import { INK, SKIN, Wheel, nth } from "../shared";
import { Arm, Head, Leg, Lid, Notes, Puffs } from "./parts";

// Grown-ups and children on the playground: grandpa on the bench, the ice cream man, mum
// with the pram, the balance bike, the scooter, the bubbles and the child in the sandpit.
// Foot point at (0, 0).

/** Grandpa on the park bench behind his newspaper: he lowers it, smiles, lifts his cap and reads on. */
export function Opa() {
  return (
    <>
      {/* Bench: backrest, seat and iron legs */}
      <path d="M-120 0 V-58 M120 0 V-58 M-112 -56 L-118 -128 M112 -56 L118 -128" stroke="#495057" strokeWidth="9" strokeLinecap="round" />
      {[-124, -106, -88].map((y) => (
        <rect key={y} x="-132" y={y} width="264" height="13" rx="5" fill="#40916c" />
      ))}
      <rect x="-136" y="-66" width="272" height="16" rx="6" fill="#2d6a4f" />
      <rect x="-132" y="-66" width="264" height="5" rx="2.5" fill="#52b788" />
      {/* Grandpa */}
      <Leg x1={-28} y1={-60} x2={-34} y2={-6} trousers="#6c757d" shoe="#5c3d2e" w={16} />
      <Leg x1={4} y1={-60} x2={0} y2={-6} trousers="#6c757d" shoe="#5c3d2e" w={16} />
      <path d="M-44 -64 H18" stroke="#6c757d" strokeWidth="22" strokeLinecap="round" />
      <rect x="-48" y="-150" width="62" height="92" rx="20" fill="#a5d8ff" />
      <g className="sp-opa-head" style={{ transformOrigin: "-17px -150px" }}>
        <Head cx={-17} cy={-174} r={23} hair="#dee2e6" style="bald" />
        <path d="M-27 -158 q10 6 20 0" stroke="#f1f3f5" strokeWidth="5" strokeLinecap="round" fill="none" />
        <g className="sp-opa-cap" style={{ transformOrigin: "-17px -194px" }}>
          <path d="M-40 -186 Q-40 -206 -17 -206 Q8 -206 8 -186 Z" fill="#8d6e63" />
          <path d="M-4 -188 Q18 -190 22 -182 L-4 -182 Z" fill="#6d4c41" />
        </g>
      </g>
      {/* The newspaper; it hides his face until he lowers it */}
      <g className="sp-opa-paper">
        <path d="M-62 -112 L-56 -180 L22 -176 L18 -108 Z" fill="#f8f9fa" />
        <path d="M-17 -178 L-20 -110" stroke="#dee2e6" strokeWidth="2" />
        <path
          d="M-50 -166 H-26 M-50 -156 H-28 M-52 -146 H-26 M-10 -164 H10 M-10 -154 H8 M-11 -144 H10 M-11 -134 H8"
          stroke="#adb5bd"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <rect x="-52" y="-136" width="24" height="18" fill="#74c0fc" />
        <circle cx="-60" cy="-140" r="7" fill={SKIN} />
        <circle cx="22" cy="-136" r="7" fill={SKIN} />
      </g>
      <Notes x={30} y={-200} texts={["Hallo!"]} colour="#ffd43b" />
    </>
  );
}

/** The ice cream cart: the bell rings, the lid opens and an ice cream pops up, the ice cream man waves, the umbrella bobs. */
export function Eiswagen() {
  return (
    <>
      {/* Umbrella */}
      <g className="sp-eis-umbrella" style={{ transformOrigin: "0px -170px" }}>
        <rect x="-4" y="-330" width="8" height="160" fill="#adb5bd" />
        <path d="M-150 -296 Q0 -380 150 -296 Z" fill="#fff" />
        {[-150, -75, 0, 75].map((x, i) => (
          <path key={x} d={`M0 -352 L${x} -296 Q${x + 18} ${-300 + (i % 2) * 2} ${x + 37} -298 Z`} fill="#ff6b6b" />
        ))}
        <path
          d="M-150 -296 Q-131 -282 -112 -296 Q-93 -282 -75 -296 Q-56 -282 -37 -296 Q-18 -282 0 -296 Q18 -282 37 -296 Q56 -282 75 -296 Q94 -282 112 -296 Q131 -282 150 -296"
          stroke="#ff6b6b"
          strokeWidth="6"
          fill="none"
        />
        <circle cx="0" cy="-354" r="7" fill="#ffd60a" />
      </g>
      {/* The ice cream man behind the cart */}
      <g className="sp-eis-man">
        <rect x="-92" y="-232" width="64" height="80" rx="20" fill="#f8f9fa" />
        <rect x="-82" y="-212" width="44" height="60" rx="6" fill="#ffc9e0" />
        <Head cx={-60} cy={-256} r={23} hair="#2b2d42" />
        <path d="M-82 -268 Q-84 -300 -60 -298 Q-36 -300 -38 -268 Z" fill="#fff" />
        <rect x="-84" y="-274" width="48" height="10" rx="4" fill="#ffc9e0" />
        <path d="M-60 -242 q-8 4 -12 0 M-60 -242 q8 4 12 0" stroke="#6b4423" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <g className="sp-eis-arm" style={{ transformOrigin: "-34px -216px" }}>
          <Arm x1={-34} y1={-216} x2={-6} y2={-256} sleeve="#f8f9fa" w={13} />
        </g>
      </g>
      {/* The ice cream that pops out of the freezer */}
      <g className="sp-eis-cone">
        <path d="M44 -176 L60 -124 L76 -176 Z" fill="#e9a35b" />
        <path d="M48 -168 L72 -168 M52 -156 L68 -156" stroke="#c97b37" strokeWidth="2.5" />
        <circle cx="60" cy="-186" r="17" fill="#ffc9e0" />
        <circle cx="60" cy="-204" r="14" fill="#b2f2bb" />
        <circle cx="56" cy="-210" r="4" fill="#fff" opacity="0.7" />
        <path d="M60 -218 l-4 -10" stroke="#e63946" strokeWidth="3" strokeLinecap="round" />
        <circle cx="55" cy="-230" r="5" fill="#e63946" />
      </g>
      {/* Freezer box */}
      <rect x="-120" y="-174" width="240" height="122" rx="16" fill="#fff" />
      <rect x="-120" y="-130" width="240" height="22" fill="#74c0fc" />
      <rect x="-120" y="-174" width="240" height="14" rx="7" fill="#e7f5ff" />
      <path d="M-120 -66 h240 v4 Q120 -52 104 -52 H-104 Q-120 -52 -120 -62 Z" fill="#dee2e6" />
      {/* A big ice cream picture on the side */}
      <path d="M-24 -116 L-10 -72 L4 -116 Z" fill="#e9a35b" />
      <circle cx="-10" cy="-124" r="14" fill="#ffc9e0" />
      <circle cx="-10" cy="-138" r="11" fill="#fff3bf" />
      <text x="34" y="-90" fontSize="26" fontWeight="800" fontFamily="system-ui, sans-serif" fill="#1971c2">
        EIS
      </text>
      {/* Lid: it swings up on its back hinge */}
      <g className="sp-eis-lid" style={{ transformOrigin: "20px -176px" }}>
        <rect x="20" y="-184" width="94" height="14" rx="6" fill="#4dabf7" />
        <rect x="56" y="-192" width="22" height="8" rx="4" fill="#1971c2" />
      </g>
      <rect x="-114" y="-184" width="132" height="14" rx="6" fill="#4dabf7" />
      {/* Bell on a bracket */}
      <path d="M120 -150 H140 V-176" stroke="#868e96" strokeWidth="5" strokeLinecap="round" fill="none" />
      <g className="sp-eis-bell" style={{ transformOrigin: "140px -176px" }}>
        <path d="M128 -150 Q128 -174 140 -174 Q152 -174 152 -150 Z" fill="#ffd43b" />
        <rect x="124" y="-152" width="32" height="6" rx="3" fill="#fab005" />
        <circle cx="140" cy="-144" r="4" fill="#fab005" />
      </g>
      {/* Handle and wheels */}
      <path d="M-120 -120 L-168 -134 V-150" stroke="#495057" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="-176" y="-160" width="16" height="22" rx="6" fill="#e63946" />
      <path d="M90 -52 V-10" stroke="#495057" strokeWidth="8" strokeLinecap="round" />
      <ellipse cx="90" cy="-8" rx="14" ry="8" fill="#495057" />
      <g className="sp-eis-wheel" style={{ transformOrigin: "-64px -40px" }}>
        <Wheel cx={-64} cy={-40} r={40} />
      </g>
      <Notes x={150} y={-200} texts={["Bimm!", "Eis!"]} colour="#ffd43b" />
    </>
  );
}

/** Mum pushing the pram: she nods, waves with her free hand and blinks. */
export function Mama() {
  return (
    <g className="sp-mama-body">
      <Leg x1={-88} y1={-86} x2={-100} y2={-6} trousers="#343a40" shoe="#7048e8" w={14} />
      <Leg x1={-70} y1={-86} x2={-58} y2={-6} trousers="#343a40" shoe="#7048e8" w={14} />
      <path d="M-110 -100 Q-114 -160 -100 -196 Q-80 -206 -60 -196 Q-46 -160 -50 -100 Z" fill="#20c997" />
      <path d="M-112 -100 H-48 L-44 -80 H-116 Z" fill="#12b886" />
      <Arm x1={-62} y1={-184} x2={-14} y2={-162} sleeve="#20c997" w={13} />
      <g className="sp-mama-arm" style={{ transformOrigin: "-100px -184px" }}>
        <Arm x1={-100} y1={-184} x2={-124} y2={-136} sleeve="#20c997" w={13} />
      </g>
      <g className="sp-mama-head" style={{ transformOrigin: "-80px -200px" }}>
        <Head cx={-80} cy={-226} r={25} hair="#9c4a1a" style="bun" />
      </g>
    </g>
  );
}

/** The pram: it rolls to and fro, the baby shakes its rattle and giggles, the hood closes and opens. */
export function Kinderwagen() {
  return (
    <>
      <g className="sp-wagen-roll">
        {/* Handle */}
        <path d="M6 -98 L-18 -166" stroke="#495057" strokeWidth="7" strokeLinecap="round" />
        <rect x="-30" y="-176" width="26" height="12" rx="6" fill="#343a40" />
        {/* Wheels and chassis */}
        <path d="M30 -24 L60 -50 L136 -24 M60 -50 V-60" stroke="#495057" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <g className="sp-wagen-wheel" style={{ transformOrigin: "30px -24px" }}>
          <Wheel cx={30} cy={-24} r={24} />
        </g>
        <g className="sp-wagen-wheel" style={{ transformOrigin: "136px -24px" }}>
          <Wheel cx={136} cy={-24} r={24} />
        </g>
        {/* Tub, baby and blanket */}
        <path d="M0 -112 H166 Q170 -56 120 -54 H36 Q0 -56 0 -112 Z" fill="#364fc7" />
        <path d="M6 -104 H160" stroke="#5c7cfa" strokeWidth="5" strokeLinecap="round" />
        <g className="sp-wagen-baby" style={{ transformOrigin: "104px -112px" }}>
          <circle cx="104" cy="-124" r="17" fill={SKIN} />
          <path d="M90 -132 Q104 -146 118 -132 Q104 -138 90 -132 Z" fill="#e9c46a" />
          <circle cx="98" cy="-125" r="2.2" fill={INK} />
          <circle cx="110" cy="-125" r="2.2" fill={INK} />
          <Lid cx={98} cy={-125} r={2.3} fill={SKIN} />
          <Lid cx={110} cy={-125} r={2.3} fill={SKIN} />
          <ellipse cx="104" cy="-116" rx="4" ry="3" fill="#e5383b" />
          <circle cx="94" cy="-118" r="3.4" fill="#ff8fa3" opacity="0.6" />
          <circle cx="114" cy="-118" r="3.4" fill="#ff8fa3" opacity="0.6" />
        </g>
        <g className="sp-wagen-rattle" style={{ transformOrigin: "140px -110px" }}>
          <path d="M140 -110 L148 -136" stroke="#fab005" strokeWidth="4" strokeLinecap="round" />
          <circle cx="150" cy="-142" r="9" fill="#ff6b9a" />
          <circle cx="147" cy="-145" r="3" fill="#fff" opacity="0.7" />
          <circle cx="140" cy="-110" r="5" fill={SKIN} />
        </g>
        <path d="M70 -114 Q120 -122 166 -114 V-104 H70 Z" fill="#ffd8a8" />
        <path d="M80 -112 H160" stroke="#ffc078" strokeWidth="3" strokeDasharray="6 6" />
        {/* Hood: it folds forward over the baby when it rains */}
        <g className="sp-wagen-hood" style={{ transformOrigin: "10px -112px" }}>
          <path d="M2 -112 Q0 -186 74 -182 L84 -112 Z" fill="#e64980" />
          <path d="M10 -116 Q14 -170 66 -172" stroke="#f783ac" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M28 -112 Q28 -166 74 -172 M52 -112 Q52 -164 78 -168" stroke="#c2255c" strokeWidth="3" fill="none" />
        </g>
      </g>
      <Notes x={150} y={-170} texts={["Hihi!"]} colour="#ffc9e0" />
    </>
  );
}

/** A child on a balance bike: it runs forward and back, the wheels turn, the bell rings. */
export function Laufrad() {
  return (
    <g className="sp-laufrad-ride">
      <g className="sp-laufrad-wheel" style={{ transformOrigin: "-62px -28px" }}>
        <Wheel cx={-62} cy={-28} r={28} />
      </g>
      <g className="sp-laufrad-wheel" style={{ transformOrigin: "64px -28px" }}>
        <Wheel cx={64} cy={-28} r={28} />
      </g>
      <path d="M-62 -28 L-22 -70 L44 -70 L64 -28 M44 -70 L36 -112" stroke="#f03e3e" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M22 -116 H52" stroke="#343a40" strokeWidth="7" strokeLinecap="round" />
      <ellipse cx="-22" cy="-78" rx="22" ry="7" fill="#343a40" />
      <g className="sp-laufrad-bell" style={{ transformOrigin: "30px -122px" }}>
        <circle cx="30" cy="-124" r="7" fill="#ffd43b" />
        <circle cx="28" cy="-126" r="2.4" fill="#fff" opacity="0.7" />
      </g>
      {/* The child: legs run while the bike rolls */}
      <g className="sp-laufrad-leg" style={{ transformOrigin: "-20px -84px", ...nth(0) }}>
        <Leg x1={-20} y1={-84} x2={-34} y2={-12} trousers="#1864ab" shoe="#40c057" w={12} />
      </g>
      <g className="sp-laufrad-leg" style={{ transformOrigin: "-14px -84px", ...nth(1) }}>
        <Leg x1={-14} y1={-84} x2={4} y2={-12} trousers="#1864ab" shoe="#40c057" w={12} />
      </g>
      <path d="M-30 -84 Q-36 -130 -14 -146 Q4 -146 8 -128 L-4 -84 Z" fill="#fab005" />
      <Arm x1={-4} y1={-136} x2={34} y2={-116} sleeve="#fab005" w={10} />
      <g className="sp-laufrad-head" style={{ transformOrigin: "-8px -150px" }}>
        <Head cx={-6} cy={-170} r={20} hair="#6b4423" />
        <path d="M-28 -172 Q-28 -200 -6 -200 Q18 -200 16 -172 Z" fill="#4dabf7" />
        <path d="M-20 -188 Q-6 -196 8 -188" stroke="#d0ebff" strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>
      <Notes x={40} y={-170} texts={["Kling!"]} colour="#ffd43b" />
    </g>
  );
}

/** A child on a scooter, riding to the left: it pushes off with one foot, glides and the scarf flutters. */
export function Roller() {
  return (
    <g className="sp-roller-ride">
      <path d="M-52 -14 L-40 -150" stroke="#868e96" strokeWidth="8" strokeLinecap="round" />
      <path d="M-58 -150 H-22" stroke="#343a40" strokeWidth="8" strokeLinecap="round" />
      <rect x="-56" y="-22" width="106" height="12" rx="6" fill="#7950f2" />
      <g className="sp-roller-wheel" style={{ transformOrigin: "-50px -8px" }}>
        <circle cx="-50" cy="-8" r="10" fill="#343a40" />
        <circle cx="-50" cy="-8" r="4" fill="#ced4da" />
      </g>
      <g className="sp-roller-wheel" style={{ transformOrigin: "42px -8px" }}>
        <circle cx="42" cy="-8" r="10" fill="#343a40" />
        <circle cx="42" cy="-8" r="4" fill="#ced4da" />
      </g>
      {/* The child stands on one foot and kicks off with the other */}
      <Leg x1={0} y1={-84} x2={-6} y2={-30} trousers="#e8590c" shoe="#343a40" w={12} />
      <g className="sp-roller-kick" style={{ transformOrigin: "10px -84px" }}>
        <Leg x1={10} y1={-84} x2={28} y2={-30} trousers="#e8590c" shoe="#343a40" w={12} />
      </g>
      <rect x="-14" y="-146" width="36" height="66" rx="13" fill="#15aabf" />
      <Arm x1={-6} y1={-136} x2={-40} y2={-150} sleeve="#15aabf" w={10} />
      <g className="sp-roller-scarf" style={{ transformOrigin: "10px -144px" }}>
        <path d="M10 -146 Q36 -150 56 -136 Q40 -134 30 -128 Q20 -138 10 -138 Z" fill="#e64980" />
      </g>
      <path d="M-10 -148 Q4 -140 24 -148" stroke="#e64980" strokeWidth="8" strokeLinecap="round" fill="none" />
      <Head cx={4} cy={-170} r={20} hair="#2b2d42" style="pigtails" />
      <Notes x={-90} y={-180} texts={["Wusch!"]} colour="#99e9f2" />
    </g>
  );
}

// Soap bubbles: [x, y, radius]; they float up from the wand one after the other.
const BUBBLES = [
  [64, -170, 16],
  [92, -206, 22],
  [58, -238, 13],
  [118, -252, 18],
  [84, -284, 12],
];

/** A girl blowing soap bubbles: they float up shimmering and pop one after the other. */
export function Seifenblasen() {
  return (
    <>
      <g className="sp-blasen-bubbles">
        {BUBBLES.map(([cx, cy, r], i) => (
          <g key={i} style={nth(i)}>
            <circle cx={cx} cy={cy} r={r} fill="#e7f5ff" fillOpacity="0.35" stroke="#a5d8ff" strokeWidth="3" />
            <path
              d={`M${cx - r * 0.55} ${cy - r * 0.2} Q${cx - r * 0.45} ${cy - r * 0.6} ${cx - r * 0.1} ${cy - r * 0.62}`}
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={`M${cx + r * 0.3} ${cy + r * 0.5} Q${cx + r * 0.55} ${cy + r * 0.3} ${cx + r * 0.6} ${cy}`}
              stroke="#e599f7"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        ))}
      </g>
      <Leg x1={-8} y1={-70} x2={-12} y2={-6} trousers={SKIN} shoe="#e64980" w={11} />
      <Leg x1={8} y1={-70} x2={12} y2={-6} trousers={SKIN} shoe="#e64980" w={11} />
      <path d="M-26 -60 Q-30 -100 -18 -132 H18 Q30 -100 26 -60 Z" fill="#f783ac" />
      <path d="M-26 -60 H26" stroke="#e64980" strokeWidth="5" strokeLinecap="round" />
      {/* Bottle in the left hand, wand in the right */}
      <Arm x1={-14} y1={-122} x2={-32} y2={-90} sleeve="#f783ac" w={10} />
      <rect x="-42" y="-112" width="18" height="28" rx="5" fill="#74c0fc" />
      <rect x="-38" y="-118" width="10" height="8" rx="2" fill="#e64980" />
      <g className="sp-blasen-arm" style={{ transformOrigin: "14px -122px" }}>
        <Arm x1={14} y1={-122} x2={30} y2={-148} sleeve="#f783ac" w={10} />
        <path d="M30 -148 L44 -164" stroke="#fab005" strokeWidth="4" strokeLinecap="round" />
        <circle cx="48" cy="-168" r="8" fill="none" stroke="#fab005" strokeWidth="4" />
      </g>
      <g className="sp-blasen-head" style={{ transformOrigin: "0px -134px" }}>
        <Head cx={0} cy={-154} r={21} hair="#e9c46a" style="pigtails" />
      </g>
      <Puffs
        className="sp-blasen-pop"
        spots={[
          [92, -206],
          [118, -252],
          [84, -284],
        ]}
        r={8}
        fill="#d0ebff"
      />
    </>
  );
}

/** A small child sitting in the sand under a sun hat: it digs, throws sand in the air and laughs. */
export function Kind() {
  return (
    <>
      <Puffs
        className="sp-kind-sand"
        spots={[
          [64, -150],
          [84, -168],
          [50, -176],
          [76, -196],
        ]}
        r={9}
        fill="#f1c87a"
      />
      <Leg x1={-14} y1={-34} x2={-46} y2={-10} trousers="#ffd43b" shoe="#4dabf7" w={13} />
      <Leg x1={14} y1={-34} x2={44} y2={-10} trousers="#ffd43b" shoe="#4dabf7" w={13} />
      <path d="M-26 -30 Q-30 -76 -16 -96 H16 Q30 -76 26 -30 Z" fill="#ff8787" />
      <path d="M-26 -30 Q0 -20 26 -30" stroke="#fa5252" strokeWidth="4" fill="none" />
      <Arm x1={-16} y1={-80} x2={-36} y2={-44} sleeve="#ff8787" w={11} />
      <g className="sp-kind-arm" style={{ transformOrigin: "16px -80px" }}>
        <Arm x1={16} y1={-80} x2={40} y2={-52} sleeve="#ff8787" w={11} />
        {/* The shovel with a little sand on it */}
        <path d="M40 -52 L66 -22" stroke="#228be6" strokeWidth="6" strokeLinecap="round" />
        <path d="M58 -30 L80 -6 Q88 -16 82 -28 L68 -36 Z" fill="#339af0" />
        <ellipse cx="74" cy="-22" rx="8" ry="5" fill="#f1c87a" />
      </g>
      <g className="sp-kind-head" style={{ transformOrigin: "0px -98px" }}>
        <Head cx={0} cy={-118} r={22} hair="#e9c46a" />
        <ellipse cx="0" cy="-134" rx="38" ry="9" fill="#fff3bf" />
        <path d="M-22 -136 Q-22 -160 0 -160 Q22 -160 22 -136 Z" fill="#ffe066" />
        <path d="M-22 -138 H22" stroke="#ff6b6b" strokeWidth="5" />
      </g>
      <Notes x={-70} y={-150} texts={["Hihi!"]} colour="#ffd43b" />
    </>
  );
}
