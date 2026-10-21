import { CHEEK, Eye, INK, nth } from "../shared";
import { Drops, Lid } from "./parts";

// Monkeys, birds and the smaller animals of the middle enclosures and the path. Each drawing
// has its foot point at (0, 0), except those that sit in a tree: the monkeys and the parrot
// (monkey tree), the koala (eucalyptus), and the butterfly (centred on its body).

const MONKEY = "#8d5a2b";
const MONKEY_FACE = "#f1c27d";

/** Monkey hanging from the rope of the monkey tree (in the tree's coordinates); it swings. */
export function Affe() {
  return (
    <g className="zo-affe-swing" style={{ transformOrigin: "-150px -318px" }}>
      <path d="M-150 -318 V-176" stroke="#d4a373" strokeWidth="6" strokeLinecap="round" />
      <circle cx="-150" cy="-176" r="5" fill="#bc8a5f" />
      <path d="M-164 -128 Q-170 -160 -156 -180 M-136 -128 Q-130 -160 -144 -180" stroke={MONKEY} strokeWidth="10" strokeLinecap="round" fill="none" />
      <path className="zo-affe-tail" d="M-150 -84 Q-150 -50 -122 -54 Q-104 -60 -114 -76 Q-122 -84 -128 -74" stroke={MONKEY} strokeWidth="6" strokeLinecap="round" fill="none" style={{ transformOrigin: "-150px -84px" }} />
      <g className="zo-affe-legs" style={{ transformOrigin: "-150px -92px" }}>
        <path d="M-160 -90 Q-176 -70 -170 -54 M-140 -90 Q-124 -70 -130 -54" stroke={MONKEY} strokeWidth="10" strokeLinecap="round" fill="none" />
        <ellipse cx="-172" cy="-52" rx="8" ry="5" fill={MONKEY_FACE} />
        <ellipse cx="-128" cy="-52" rx="8" ry="5" fill={MONKEY_FACE} />
      </g>
      <ellipse cx="-150" cy="-108" rx="22" ry="28" fill={MONKEY} />
      <ellipse cx="-150" cy="-102" rx="13" ry="18" fill="#d4a373" />
      <circle cx="-171" cy="-150" r="9" fill={MONKEY} />
      <circle cx="-129" cy="-150" r="9" fill={MONKEY} />
      <circle cx="-171" cy="-150" r="4.5" fill="#ffc8dd" />
      <circle cx="-129" cy="-150" r="4.5" fill="#ffc8dd" />
      <circle cx="-150" cy="-148" r="20" fill={MONKEY} />
      <path d="M-150 -156 Q-164 -162 -166 -148 Q-166 -132 -150 -130 Q-134 -132 -134 -148 Q-136 -162 -150 -156 Z" fill={MONKEY_FACE} />
      <Eye cx={-157} cy={-150} r={3} />
      <Eye cx={-143} cy={-150} r={3} />
      <Lid cx={-157} cy={-150} r={3} fill={MONKEY_FACE} />
      <Lid cx={-143} cy={-150} r={3} fill={MONKEY_FACE} />
      <path d="M-156 -139 Q-150 -134 -144 -139" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse className="zo-affe-mouth" cx="-150" cy="-137" rx="5" ry="6" fill="#9d0208" />
    </g>
  );
}

/** Little monkey with a banana on the platform of the monkey tree (in the tree's coordinates). */
export function Aeffchen() {
  return (
    <g className="zo-aeffchen-body" style={{ transformOrigin: "120px -168px" }}>
      <path className="zo-aeffchen-tail" d="M104 -172 Q90 -150 96 -126 Q104 -114 112 -126" stroke={MONKEY} strokeWidth="5" strokeLinecap="round" fill="none" style={{ transformOrigin: "104px -172px" }} />
      <ellipse cx="106" cy="-172" rx="10" ry="6" fill={MONKEY} />
      <ellipse cx="134" cy="-172" rx="10" ry="6" fill={MONKEY} />
      <ellipse cx="120" cy="-194" rx="18" ry="22" fill={MONKEY} />
      <ellipse cx="120" cy="-190" rx="10" ry="14" fill="#d4a373" />
      <path d="M106 -200 Q96 -186 108 -178" stroke={MONKEY} strokeWidth="7" strokeLinecap="round" fill="none" />
      <g className="zo-aeffchen-arm" style={{ transformOrigin: "132px -204px" }}>
        <path d="M132 -204 Q148 -196 146 -182" stroke={MONKEY} strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M140 -176 Q156 -190 152 -214 Q160 -194 146 -172 Z" fill="#ffd60a" />
        <path d="M152 -214 l2 -5" stroke="#7f5539" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="zo-aeffchen-head" style={{ transformOrigin: "120px -216px" }}>
        <circle cx="103" cy="-230" r="7" fill={MONKEY} />
        <circle cx="137" cy="-230" r="7" fill={MONKEY} />
        <circle cx="103" cy="-230" r="3.5" fill="#ffc8dd" />
        <circle cx="137" cy="-230" r="3.5" fill="#ffc8dd" />
        <circle cx="120" cy="-230" r="17" fill={MONKEY} />
        <path d="M120 -236 Q108 -242 106 -230 Q106 -216 120 -214 Q134 -216 134 -230 Q132 -242 120 -236 Z" fill={MONKEY_FACE} />
        <Eye cx={114} cy={-231} r={2.6} />
        <Eye cx={126} cy={-231} r={2.6} />
        <Lid cx={114} cy={-231} r={2.6} fill={MONKEY_FACE} />
        <Lid cx={126} cy={-231} r={2.6} fill={MONKEY_FACE} />
        <path d="M115 -222 Q120 -218 125 -222" stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
}

/** Red parrot on the top branch of the monkey tree (in the tree's coordinates), facing left. */
export function Papagei() {
  return (
    <g className="zo-papagei-body" style={{ transformOrigin: "110px -366px" }}>
      <g className="zo-papagei-tail" style={{ transformOrigin: "112px -380px" }}>
        <path d="M112 -380 L124 -318 L134 -322 Z" fill="#3a86ff" />
        <path d="M108 -380 L114 -322 L124 -320 Z" fill="#e63946" />
      </g>
      <path d="M102 -368 v-6 M116 -368 v-6" stroke="#495057" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="110" cy="-396" rx="17" ry="27" fill="#e63946" />
      <g className="zo-papagei-wing" style={{ transformOrigin: "118px -410px" }}>
        <path d="M112 -414 Q134 -404 132 -372 Q118 -376 110 -392 Z" fill="#3a86ff" />
        <path d="M116 -406 Q130 -400 130 -388 Q120 -392 116 -400 Z" fill="#ffd60a" />
      </g>
      <g className="zo-papagei-head" style={{ transformOrigin: "106px -414px" }}>
        <circle cx="104" cy="-426" r="15" fill="#e63946" />
        <ellipse cx="98" cy="-424" rx="7" ry="8" fill="#fff" />
        <path d="M90 -430 Q78 -428 80 -414 Q86 -418 92 -418 Z" fill="#ffd166" />
        <path d="M80 -414 Q84 -412 88 -418" stroke="#495057" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <Eye cx={99} cy={-426} r={2.6} />
        <Lid cx={99} cy={-426} r={2.6} fill="#fff" />
      </g>
      <g className="zo-papagei-bubble" style={{ transformOrigin: "70px -440px" }}>
        <path d="M70 -440 L60 -456 H8 Q-2 -456 -2 -466 V-482 Q-2 -492 8 -492 H76 Q86 -492 86 -482 V-466 Q86 -456 76 -456 H70 Z" fill="#fff" />
        <text x="42" y="-468" textAnchor="middle" dominantBaseline="central" fontSize="17" fontWeight="800" fill={INK}>
          Hallo!
        </text>
      </g>
    </g>
  );
}

/** Panda sitting in its bamboo, facing right; it munches bamboo. */
export function Panda() {
  return (
    <g className="zo-panda-body" style={{ transformOrigin: "0px 0px" }}>
      <ellipse cx="0" cy="-62" rx="52" ry="60" fill="#f8f9fa" />
      <ellipse cx="-10" cy="-100" rx="30" ry="8" fill="#fff" />
      {[-34, 34].map((x) => (
        <g key={x} className="zo-panda-foot" style={{ transformOrigin: `${x}px -4px` }}>
          <ellipse cx={x} cy="-16" rx="26" ry="18" fill={INK} />
          <ellipse cx={x} cy="-12" rx="12" ry="8" fill="#6c757d" />
        </g>
      ))}
      <path d="M-40 -96 Q-62 -70 -40 -50" stroke={INK} strokeWidth="22" strokeLinecap="round" fill="none" />
      <g className="zo-panda-arm" style={{ transformOrigin: "36px -94px" }}>
        <path d="M66 -12 L80 -170" stroke="#74c69d" strokeWidth="10" strokeLinecap="round" />
        <path d="M68 -50 h12 M72 -100 h12 M76 -146 h10" stroke="#52b788" strokeWidth="4" />
        <path className="zo-panda-leaves" d="M78 -150 q24 -14 30 -36 q-24 8 -30 36 Z M76 -120 q-24 -8 -34 -28 q24 4 34 28 Z" fill="#52b788" style={{ transformOrigin: "77px -135px" }} />
        <path d="M36 -94 Q60 -86 72 -64" stroke={INK} strokeWidth="22" strokeLinecap="round" fill="none" />
      </g>
      <g className="zo-panda-head" style={{ transformOrigin: "0px -110px" }}>
        {[-32, 32].map((x) => (
          <circle key={x} className="zo-panda-ear" cx={x} cy="-170" r="14" fill={INK} style={{ transformOrigin: `${x}px -160px` }} />
        ))}
        <circle cx="0" cy="-138" r="42" fill="#f8f9fa" />
        <ellipse cx="-16" cy="-142" rx="11" ry="15" fill={INK} transform="rotate(30 -16 -142)" />
        <ellipse cx="16" cy="-142" rx="11" ry="15" fill={INK} transform="rotate(-30 16 -142)" />
        <circle cx="-14" cy="-144" r="4.5" fill="#fff" />
        <circle cx="14" cy="-144" r="4.5" fill="#fff" />
        <circle cx="-13" cy="-145" r="2.6" fill="#2b2d42" />
        <circle cx="15" cy="-145" r="2.6" fill="#2b2d42" />
        <Lid cx={-14} cy={-144} r={3.6} fill={INK} />
        <Lid cx={14} cy={-144} r={3.6} fill={INK} />
        <ellipse cx="0" cy="-124" rx="7" ry="5" fill={INK} />
        <path d="M-7 -116 Q0 -110 7 -116" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="-26" cy="-122" r="6" fill={CHEEK} opacity="0.5" />
        <circle cx="26" cy="-122" r="6" fill={CHEEK} opacity="0.5" />
      </g>
    </g>
  );
}

const KANGAROO = "#c9773a";

/** Kangaroo with a joey in its pouch, facing left; it hops twice. */
export function Kaenguru() {
  return (
    <>
      <Drops x={10} y={-6} className="zo-dust" fill="#d6c3a5" count={4} spread={30} />
      <g className="zo-kaenguru-body" style={{ transformOrigin: "0px 0px" }}>
        <path className="zo-kaenguru-tail" d="M30 -40 Q90 -30 130 -4" stroke={KANGAROO} strokeWidth="20" strokeLinecap="round" fill="none" style={{ transformOrigin: "30px -40px" }} />
        <path d="M-30 -4 H16 Q24 -20 10 -60 Q0 -80 -14 -60 Z" fill="#b5652c" />
        <ellipse cx="6" cy="-92" rx="44" ry="66" fill={KANGAROO} transform="rotate(12 6 -92)" />
        <ellipse cx="-6" cy="-84" rx="24" ry="40" fill="#f1c9a0" transform="rotate(12 -6 -84)" />
        <g className="zo-joey" style={{ transformOrigin: "-14px -80px" }}>
          <ellipse cx="-16" cy="-102" rx="9" ry="5" fill={KANGAROO} transform="rotate(-30 -16 -102)" />
          <circle cx="-22" cy="-90" r="12" fill={KANGAROO} />
          <ellipse cx="-30" cy="-86" rx="6" ry="4.5" fill="#f1c9a0" />
          <Eye cx={-24} cy={-93} r={2.2} />
          <Lid cx={-24} cy={-93} r={2.2} fill={KANGAROO} />
        </g>
        <path d="M-34 -84 Q-14 -66 14 -82 Q10 -56 -12 -54 Q-30 -58 -34 -84 Z" fill="#e0a370" />
        <path d="M-30 -130 Q-46 -116 -44 -100 M-22 -126 Q-34 -112 -32 -98" stroke={KANGAROO} strokeWidth="8" strokeLinecap="round" fill="none" />
        <g className="zo-kaenguru-head" style={{ transformOrigin: "-10px -150px" }}>
          <g className="zo-kaenguru-ears" style={{ transformOrigin: "-10px -176px" }}>
            <path d="M-10 -176 L-4 -214 L6 -178 Z M-24 -176 L-26 -212 L-12 -178 Z" fill={KANGAROO} />
            <path d="M-8 -184 L-5 -204 L1 -184 Z" fill="#ffc8dd" />
          </g>
          <path d="M0 -172 Q-14 -186 -32 -170 L-56 -150 Q-62 -138 -48 -134 Q-20 -136 2 -146 Z" fill={KANGAROO} />
          <ellipse cx="-54" cy="-146" rx="4" ry="3" fill="#5e3a1f" />
          <path d="M-52 -136 Q-44 -132 -38 -138" stroke="#5e3a1f" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="-30" cy="-148" r="5" fill={CHEEK} opacity="0.45" />
          <Eye cx={-22} cy={-162} r={3.6} />
          <Lid cx={-22} cy={-162} r={3.6} fill={KANGAROO} />
        </g>
      </g>
    </>
  );
}

/** Koala hugging the eucalyptus trunk (in the tree's coordinates); it wakes up and waves. */
export function Koala() {
  return (
    <g className="zo-koala-body">
      <ellipse cx="0" cy="-196" rx="28" ry="34" fill="#a5a5a5" />
      <ellipse cx="2" cy="-188" rx="16" ry="22" fill="#e9ecef" />
      <path d="M-22 -170 Q-8 -160 8 -164" stroke="#8d8d8d" strokeWidth="11" strokeLinecap="round" fill="none" />
      <g className="zo-koala-paw" style={{ transformOrigin: "20px -214px" }}>
        <path d="M20 -214 Q40 -220 44 -240" stroke="#8d8d8d" strokeWidth="11" strokeLinecap="round" fill="none" />
        <circle cx="45" cy="-243" r="7" fill="#8d8d8d" />
      </g>
      <g className="zo-koala-head" style={{ transformOrigin: "0px -226px" }}>
        {[-28, 28].map((x) => (
          <g key={x} className="zo-koala-ear" style={{ transformOrigin: `${x * 0.6}px -244px` }}>
            <circle cx={x} cy="-252" r="17" fill="#a5a5a5" />
            <circle cx={x} cy="-252" r="10" fill="#f8f9fa" />
          </g>
        ))}
        <circle cx="0" cy="-240" r="26" fill="#a5a5a5" />
        <ellipse cx="0" cy="-234" rx="8" ry="11" fill="#343a40" />
        <ellipse cx="-3" cy="-238" rx="2.5" ry="3" fill="#fff" opacity="0.5" />
        <path className="zo-koala-sleep" d="M-17 -246 q5 4 10 0 M7 -246 q5 4 10 0" stroke="#343a40" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <g className="zo-koala-eyes">
          <Eye cx={-12} cy={-246} r={3.4} />
          <Eye cx={12} cy={-246} r={3.4} />
        </g>
        <path d="M-5 -220 Q0 -216 5 -220" stroke="#343a40" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="-17" cy="-230" r="5" fill={CHEEK} opacity="0.5" />
        <circle cx="17" cy="-230" r="5" fill={CHEEK} opacity="0.5" />
      </g>
      <g className="zo-koala-zzz" fill={INK} fontSize="16" fontWeight="800">
        {[0, 1].map((i) => (
          <text key={i} x={30 + i * 14} y={-276 - i * 14} style={nth(i)}>
            z
          </text>
        ))}
      </g>
    </g>
  );
}

const FLAMINGO = "#ff8fab";

/** Pink flamingo on one leg in its pond, facing left; it flaps its wings. */
export function Flamingo() {
  return (
    <g className="zo-flamingo-body" style={{ transformOrigin: "0px 0px" }}>
      <g className="zo-flamingo-ripples" stroke="#fff" strokeWidth="3" fill="none">
        <ellipse cx="0" cy="0" rx="24" ry="5" style={nth(0)} />
        <ellipse cx="0" cy="0" rx="40" ry="8" style={nth(1)} />
      </g>
      <path d="M0 0 L2 -60 L-2 -116" stroke="#fb6f92" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <g className="zo-flamingo-leg" style={{ transformOrigin: "10px -116px" }}>
        <path d="M10 -116 L34 -88 L12 -72" stroke="#fb6f92" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
      <path d="M46 -150 Q70 -150 76 -132 Q60 -132 46 -138 Z" fill="#fb6f92" />
      <ellipse cx="14" cy="-144" rx="42" ry="25" fill={FLAMINGO} />
      <g className="zo-flamingo-wing" style={{ transformOrigin: "10px -152px" }}>
        <path d="M-6 -152 Q30 -168 56 -146 Q30 -128 -6 -140 Z" fill="#fb6f92" />
      </g>
      <g className="zo-flamingo-neck" style={{ transformOrigin: "-20px -150px" }}>
        <path d="M-22 -150 Q-44 -180 -22 -206 Q-4 -228 -18 -244" stroke={FLAMINGO} strokeWidth="10" strokeLinecap="round" fill="none" />
        <circle cx="-26" cy="-248" r="12" fill={FLAMINGO} />
        <path d="M-36 -252 Q-50 -250 -50 -234 Q-44 -238 -38 -242 Z" fill="#fff" />
        <path d="M-50 -238 Q-50 -232 -46 -230 Q-44 -236 -44 -240 Z" fill={INK} />
        <Eye cx={-28} cy={-251} r={2.4} />
        <Lid cx={-28} cy={-251} r={2.4} fill={FLAMINGO} />
      </g>
    </g>
  );
}

const PEACOCK = "#3a86ff";

/** Peacock on the zoo path, facing left; it opens its big fan of feathers. */
export function Pfau() {
  return (
    <g className="zo-pfau-body" style={{ transformOrigin: "0px 0px" }}>
      <g className="zo-pfau-fan" style={{ transformOrigin: "24px -50px" }}>
        {Array.from({ length: 11 }, (_, i) => {
          const a = ((-170 + i * 16) * Math.PI) / 180;
          const x = 24 + 120 * Math.cos(a);
          const y = -50 + 110 * Math.sin(a);
          return (
            <g key={i}>
              <path d={`M24 -50 L${x} ${y}`} stroke="#2d6a4f" strokeWidth="18" strokeLinecap="round" />
              <circle cx={x} cy={y} r="13" fill="#40916c" />
              <circle cx={x} cy={y} r="8" fill="#ffd60a" />
              <circle cx={x} cy={y} r="4.5" fill="#1d3557" />
            </g>
          );
        })}
      </g>
      <g className="zo-pfau-tail">
        <path d="M14 -40 Q80 -40 130 -8 Q80 -16 14 -24 Z" fill="#2d6a4f" />
        <circle cx="70" cy="-26" r="5" fill="#ffd60a" />
        <circle cx="104" cy="-16" r="5" fill="#ffd60a" />
      </g>
      <path d="M-4 -30 V0 M8 -30 V0" stroke="#adb5bd" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="4" cy="-46" rx="26" ry="22" fill={PEACOCK} />
      <path d="M-8 -60 Q-20 -84 -14 -106" stroke={PEACOCK} strokeWidth="13" strokeLinecap="round" fill="none" />
      <g className="zo-pfau-head" style={{ transformOrigin: "-14px -104px" }}>
        <circle cx="-16" cy="-110" r="10" fill={PEACOCK} />
        <g className="zo-pfau-crest" style={{ transformOrigin: "-14px -120px" }}>
          <path d="M-16 -120 L-20 -134 M-14 -120 L-12 -136 M-12 -120 L-4 -132" stroke="#1d3557" strokeWidth="1.6" />
          <circle cx="-20" cy="-134" r="2.6" fill="#3a86ff" />
          <circle cx="-12" cy="-136" r="2.6" fill="#3a86ff" />
          <circle cx="-4" cy="-132" r="2.6" fill="#3a86ff" />
        </g>
        <path d="M-24 -112 l-10 3 l10 3 Z" fill="#adb5bd" />
        <path d="M-22 -114 h8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        <Eye cx={-19} cy={-111} r={2} />
        <Lid cx={-19} cy={-111} r={2} fill={PEACOCK} />
      </g>
    </g>
  );
}

/** Grey pigeon on the path, facing right; it pecks crumbs and flutters. */
export function Taube() {
  return (
    <g className="zo-taube-body" style={{ transformOrigin: "0px 0px" }}>
      <path d="M-4 -12 V0 M6 -12 V0" stroke="#ff8fa3" strokeWidth="3" strokeLinecap="round" />
      <path className="zo-taube-tail" d="M-26 -30 L-50 -38 L-44 -24 Z" fill="#6c757d" style={{ transformOrigin: "-26px -30px" }} />
      <ellipse cx="0" cy="-26" rx="28" ry="16" fill="#adb5bd" />
      <g className="zo-taube-wing" style={{ transformOrigin: "-2px -32px" }}>
        <path d="M-20 -30 Q0 -44 18 -28 Q0 -18 -20 -30 Z" fill="#8d99ae" />
        <path d="M-12 -28 h8 M0 -26 h8" stroke="#495057" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g className="zo-taube-head" style={{ transformOrigin: "16px -32px" }}>
        <path d="M14 -34 Q20 -44 26 -40 L28 -26 Q20 -24 14 -30 Z" fill="#52b788" opacity="0.8" />
        <circle cx="26" cy="-44" r="10" fill="#8d99ae" />
        <path d="M34 -45 L42 -42 L34 -40 Z" fill="#ffb703" />
        <Eye cx={28} cy={-46} r={2} />
        <Lid cx={28} cy={-46} r={2} fill="#8d99ae" />
      </g>
      <g className="zo-taube-crumbs" fill="#e9b872">
        <circle cx="42" cy="-2" r="2.5" style={nth(0)} />
        <circle cx="50" cy="-1" r="2" style={nth(1)} />
        <circle cx="36" cy="-1" r="2" style={nth(2)} />
      </g>
    </g>
  );
}

/** Yellow butterfly over the flowers, centred on its body; it flutters round in a loop. */
export function Schmetterling() {
  return (
    <g className="zo-schmetterling-flight">
      <g className="zo-schmetterling-wings">
        <path d="M0 -4 Q-30 -40 -40 -14 Q-42 4 0 0 Z" fill="#ffd60a" />
        <path d="M0 -4 Q30 -40 40 -14 Q42 4 0 0 Z" fill="#ffd60a" />
        <path d="M0 2 Q-26 30 -16 34 Q-4 32 0 4 Z" fill="#ffb703" />
        <path d="M0 2 Q26 30 16 34 Q4 32 0 4 Z" fill="#ffb703" />
        <circle cx="-22" cy="-16" r="6" fill="#f77f00" />
        <circle cx="22" cy="-16" r="6" fill="#f77f00" />
      </g>
      <ellipse cx="0" cy="4" rx="3.5" ry="16" fill={INK} />
      <path className="zo-schmetterling-antennae" d="M-1 -10 Q-6 -22 -12 -26 M1 -10 Q6 -22 12 -26" stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" style={{ transformOrigin: "0px -10px" }} />
      <g className="zo-schmetterling-hearts" fill="#ff8fa3">
        {[0, 1].map((i) => (
          <path key={i} d={`M${-8 + i * 16} -36 c-4 -6 -12 0 0 8 c12 -8 4 -14 0 -8 Z`} style={nth(i)} />
        ))}
      </g>
    </g>
  );
}
