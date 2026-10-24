import { CHEEK, Eye, Face, INK, Inside, heartPath, nth } from "../shared";
import { Lid, Notes, Puffs } from "../spielplatz/parts";
import { Blades, eggPath } from "./parts";

// Animals of the Easter garden: the blackbird's nest, the hen on her eggs, the hatching
// chick, the sheep with her lamb, the little bunny, insects and the earthworm.
// Foot point at (0, 0); the nest uses the coordinates of the cherry tree.

/** The blackbird family on the cherry tree's branch (tree coordinates): the chicks stretch up, mum brings a worm. */
export function Amselnest() {
  return (
    <>
      <ellipse cx="206" cy="-262" rx="46" ry="12" fill="#5d4037" />
      {[180, 206, 232].map((x, i) => (
        <g key={x} className="os-amsel-chick" style={{ ...nth(i), transformOrigin: `${x}px -258px` }}>
          <circle cx={x} cy="-268" r="12" fill="#8d7b6a" />
          <circle cx={x - 4} cy="-272" r="2.4" fill={INK} />
          <circle cx={x + 4} cy="-272" r="2.4" fill={INK} />
          <path d={`M${x - 7} -266 L${x} -258 L${x + 7} -266 Z`} fill="#ffd43b" />
          <path className="os-amsel-beak" d={`M${x - 7} -266 L${x} -278 L${x + 7} -266 Z`} fill="#fab005" style={{ transformOrigin: `${x}px -266px` }} />
        </g>
      ))}
      {/* Nest */}
      <path d="M158 -264 Q206 -226 254 -264 L250 -248 Q206 -214 162 -248 Z" fill="#8d6e63" />
      <path d="M162 -258 Q206 -232 250 -258 M168 -250 Q206 -226 244 -250" stroke="#a1887f" strokeWidth="3" fill="none" />
      <path d="M160 -262 L150 -268 M252 -262 L262 -270 M180 -236 L172 -228" stroke="#6d4c41" strokeWidth="3" strokeLinecap="round" />
      {/* Mum blackbird on the left rim */}
      <g className="os-amsel-body" style={{ transformOrigin: "150px -262px" }}>
        <path d="M168 -274 L194 -262 L186 -278 Z" fill="#212529" />
        <ellipse cx="150" cy="-284" rx="22" ry="15" fill="#343a40" />
        <g className="os-amsel-wing" style={{ transformOrigin: "156px -290px" }}>
          <path d="M140 -290 Q160 -298 176 -282 Q158 -278 140 -290 Z" fill="#212529" />
        </g>
        <circle cx="132" cy="-300" r="12" fill="#343a40" />
        <circle cx="128" cy="-302" r="4" fill="#ffa94d" />
        <Eye cx={128} cy={-302} r={2.2} />
        <path d="M121 -300 L106 -297 L121 -294 Z" fill="#ff922b" />
        <path className="os-amsel-worm" d="M110 -297 q-6 6 -2 12 q4 6 -2 12" stroke="#ff8fa3" strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>
      <Notes x={190} y={-310} texts={["Piep!", "Piep!"]} colour="#fff" size={22} />
    </>
  );
}

/** The hen on her straw nest: she stands up, shows her egg, flaps and sits down again. */
export function Henne() {
  return (
    <>
      <ellipse cx="0" cy="-22" rx="74" ry="18" fill="#e9c46a" />
      <path d="M-60 -30 l14 -10 M-30 -34 l10 -12 M20 -36 l12 -10 M50 -32 l12 -8" stroke="#d4a373" strokeWidth="3" strokeLinecap="round" />
      <path d={eggPath(14, -20, 38, 46)} fill="#f3d9b1" />
      <path d="M6 -56 Q2 -50 2 -42" stroke="#fff" strokeOpacity="0.6" strokeWidth="4" strokeLinecap="round" fill="none" />
      <g className="os-henne-body" style={{ transformOrigin: "0px -20px" }}>
        <path d="M-6 -24 V0 M10 -24 V0 M-14 0 H2 M2 0 H18" stroke="#f08c00" strokeWidth="4" strokeLinecap="round" />
        <path d="M-46 -64 Q-90 -100 -70 -132 Q-56 -104 -36 -88 Z" fill="#8c4a2f" />
        <path d="M-50 -60 Q-100 -76 -92 -108 Q-70 -86 -40 -76 Z" fill="#a0522d" />
        <ellipse cx="-2" cy="-58" rx="58" ry="40" fill="#d08c60" />
        <ellipse cx="18" cy="-46" rx="30" ry="22" fill="#e6a77a" />
        <g className="os-henne-wing" style={{ transformOrigin: "10px -72px" }}>
          <path d="M10 -72 Q-30 -80 -42 -52 Q-14 -34 14 -52 Z" fill="#b5653a" />
          <path d="M-30 -58 Q-14 -50 4 -58 M-24 -66 Q-8 -60 6 -66" stroke="#9c5532" strokeWidth="3" fill="none" />
        </g>
        <g className="os-henne-head" style={{ transformOrigin: "36px -80px" }}>
          <path d="M28 -88 Q34 -70 50 -74 L58 -100 Z" fill="#d08c60" />
          <path d="M36 -124 q4 -12 10 -2 q4 -12 10 -2 q6 -10 10 2 L60 -116 Z" fill="#e03131" />
          <circle cx="50" cy="-106" r="20" fill="#d08c60" />
          <path d="M68 -108 L84 -102 L68 -96 Z" fill="#f59f00" />
          <path d="M66 -94 q4 10 -4 12 q-6 -4 -2 -12 Z" fill="#e03131" />
          <circle cx="56" cy="-110" r="3.4" fill={INK} />
          <circle cx="57" cy="-111" r="1.1" fill="#fff" />
          <Lid cx={56} cy={-110} r={3.4} fill="#d08c60" />
          <circle cx="50" cy="-98" r="4" fill={CHEEK} opacity="0.5" />
        </g>
      </g>
      {/* The front of the straw nest */}
      <path d="M-80 -26 Q0 8 80 -26 L76 -2 Q0 16 -76 -2 Z" fill="#e9c46a" />
      <path d="M-70 -14 l18 6 M-40 -6 l16 2 M10 -4 l16 -2 M44 -10 l18 -6 M-20 2 l14 0" stroke="#d4a373" strokeWidth="3" strokeLinecap="round" />
      <Notes x={70} y={-150} texts={["Gack!", "Gack!"]} colour="#fff" size={26} />
    </>
  );
}

const SHELL = eggPath(0, -4, 84, 104);
const CRACK = "M-48 -60 L-30 -50 L-18 -64 L-4 -50 L10 -66 L24 -52 L36 -64 L48 -56";

/** A big egg with a crack: the top lifts, the chick peeks out and looks around, then hides again. */
export function Eikueken() {
  return (
    <>
      <Blades xs={[-40, -20, 18, 40]} shade="#40916c" height={28} />
      {/* The chick inside, hidden behind the shell until the top lifts */}
      <Inside d={`${CRACK} V-140 H-48 Z`}>
        <g className="os-kueken-chick" style={{ transformOrigin: "0px -40px" }}>
          <ellipse cx="0" cy="-60" rx="30" ry="28" fill="#ffd43b" />
          <path d="M-4 -86 q2 -12 8 -4 q4 -10 8 0" stroke="#fab005" strokeWidth="4" strokeLinecap="round" fill="none" />
          <Eye cx={-10} cy={-66} r={4} />
          <Eye cx={10} cy={-66} r={4} />
          <path d="M-7 -58 L0 -48 L7 -58 Z" fill="#fd7e14" />
          <circle cx="-18" cy="-56" r="4.5" fill={CHEEK} opacity="0.55" />
          <circle cx="18" cy="-56" r="4.5" fill={CHEEK} opacity="0.55" />
        </g>
      </Inside>
      {/* Lower shell */}
      <Inside d={SHELL}>
        <path d={`${CRACK} V10 H-48 Z`} fill="#fff8e7" />
        <ellipse cx="10" cy="0" rx="50" ry="22" fill="#e9d8b4" opacity="0.6" />
      </Inside>
      {/* Top of the shell */}
      <g className="os-kueken-top" style={{ transformOrigin: "44px -58px" }}>
        <Inside d={SHELL}>
          <path d={`${CRACK} V-120 H-48 Z`} fill="#fff8e7" />
          <path d="M-20 -94 Q-30 -84 -32 -70" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" />
        </Inside>
        <path d={CRACK} stroke="#c9b48a" strokeWidth="3" strokeLinejoin="round" fill="none" />
      </g>
      <Blades xs={[-30, -6, 12, 30, 46]} shade="#52b788" height={20} />
      <Notes x={30} y={-120} texts={["Piep!"]} colour="#ffe066" size={26} />
    </>
  );
}

/** The mother sheep, facing left: she lifts her head and bleats, flicks her ears and wags her tail. */
export function Mutterschaf() {
  return (
    <>
      {[-46, -24, 34, 54].map((x) => (
        <rect key={x} x={x - 6} y="-50" width="12" height="50" rx="5" fill="#495057" />
      ))}
      <circle className="os-schaf-tail" cx="86" cy="-90" r="14" fill="#f1f3f5" style={{ transformOrigin: "78px -90px" }} />
      <g fill="#f8f9fa">
        <circle cx="-40" cy="-86" r="34" />
        <circle cx="0" cy="-104" r="38" />
        <circle cx="44" cy="-96" r="34" />
        <circle cx="66" cy="-70" r="26" />
        <circle cx="22" cy="-62" r="32" />
        <circle cx="-22" cy="-60" r="30" />
      </g>
      <path d="M-60 -60 Q0 -30 80 -60 Q60 -40 0 -36 Q-50 -40 -60 -60 Z" fill="#dee2e6" />
      <circle cx="-10" cy="-120" r="14" fill="#fff" opacity="0.8" />
      <g className="os-schaf-head" style={{ transformOrigin: "-54px -96px" }}>
        <g className="os-schaf-ear" style={{ transformOrigin: "-64px -122px" }}>
          <ellipse cx="-46" cy="-122" rx="16" ry="7" fill="#495057" transform="rotate(20 -46 -122)" />
        </g>
        <ellipse cx="-80" cy="-110" rx="24" ry="30" fill="#5c5f66" />
        <ellipse cx="-110" cy="-122" rx="16" ry="7" fill="#495057" transform="rotate(-20 -110 -122)" />
        <g fill="#f8f9fa">
          <circle cx="-90" cy="-138" r="10" />
          <circle cx="-76" cy="-142" r="11" />
          <circle cx="-64" cy="-134" r="9" />
        </g>
        <circle cx="-90" cy="-112" r="5" fill="#fff" />
        <circle cx="-72" cy="-112" r="5" fill="#fff" />
        <circle cx="-90" cy="-111" r="2.8" fill={INK} />
        <circle cx="-72" cy="-111" r="2.8" fill={INK} />
        <Lid cx={-90} cy={-112} r={4.4} fill="#5c5f66" />
        <Lid cx={-72} cy={-112} r={4.4} fill="#5c5f66" />
        <ellipse cx="-82" cy="-92" rx="8" ry="5" fill="#343a40" />
        <ellipse className="os-schaf-mouth" cx="-82" cy="-84" rx="6" ry="4" fill="#ff8fa3" style={{ transformOrigin: "-82px -86px" }} />
      </g>
      <Notes x={-150} y={-160} texts={["Mäh!"]} colour="#fff" size={30} />
    </>
  );
}

/** The Easter lamb with a blue ribbon and a golden bell: it jumps for joy and the bell rings. */
export function Laemmchen() {
  return (
    <g className="os-lamm-body" style={{ transformOrigin: "0px 0px" }}>
      {[-34, -18, 22, 38].map((x, i) => (
        <rect key={x} className={i % 2 ? "os-lamm-leg-b" : "os-lamm-leg-a"} x={x - 5} y="-40" width="10" height="40" rx="4" fill="#ffe8d6" style={{ transformOrigin: `${x}px -40px` }} />
      ))}
      <g fill="#fff">
        <circle cx="-20" cy="-60" r="26" />
        <circle cx="12" cy="-70" r="28" />
        <circle cx="38" cy="-56" r="22" />
        <circle cx="0" cy="-44" r="22" />
      </g>
      <circle cx="-42" cy="-62" r="10" fill="#fff" />
      <g className="os-lamm-head" style={{ transformOrigin: "50px -80px" }}>
        <ellipse cx="68" cy="-92" rx="20" ry="23" fill="#ffe8d6" />
        <g fill="#fff">
          <circle cx="60" cy="-112" r="9" />
          <circle cx="72" cy="-116" r="9" />
          <circle cx="82" cy="-108" r="7" />
        </g>
        <g className="os-lamm-ear" style={{ transformOrigin: "52px -100px" }}>
          <ellipse cx="44" cy="-100" rx="14" ry="6" fill="#ffe8d6" transform="rotate(-20 44 -100)" />
          <ellipse cx="44" cy="-100" rx="8" ry="3" fill="#ffc9d6" transform="rotate(-20 44 -100)" />
        </g>
        <Eye cx={64} cy={-94} r={3.2} />
        <Eye cx={78} cy={-94} r={3.2} />
        <Lid cx={64} cy={-94} r={3.2} fill="#ffe8d6" />
        <Lid cx={78} cy={-94} r={3.2} fill="#ffe8d6" />
        <ellipse cx="74" cy="-80" rx="5" ry="3.5" fill="#e599a8" />
        <circle cx="60" cy="-82" r="4" fill={CHEEK} opacity="0.5" />
      </g>
      {/* Ribbon with the golden bell */}
      <path d="M44 -84 Q56 -70 70 -72" stroke="#4dabf7" strokeWidth="7" strokeLinecap="round" fill="none" />
      <g className="os-lamm-bell" style={{ transformOrigin: "58px -74px" }}>
        <path d="M50 -60 Q50 -74 58 -74 Q66 -74 66 -60 Z" fill="#fcc419" />
        <rect x="48" y="-62" width="20" height="4" rx="2" fill="#f59f00" />
        <circle cx="58" cy="-56" r="3" fill="#f59f00" />
      </g>
      <Notes x={70} y={-140} texts={["Mäh!"]} colour="#fff" size={26} />
    </g>
  );
}

/** A bumblebee buzzing above the tulips: it flies a loop with whirring wings. */
export function Hummel() {
  return (
    <g className="os-hummel-fly" style={{ transformOrigin: "0px -170px" }}>
      <path className="os-hummel-trail" d="M-90 -150 q20 -30 40 -10 q20 20 40 -6" stroke="#adb5bd" strokeWidth="3" strokeDasharray="4 7" strokeLinecap="round" fill="none" />
      <g className="os-hummel-wing" style={{ transformOrigin: "0px -184px" }}>
        <ellipse cx="-8" cy="-198" rx="10" ry="16" fill="#e7f5ff" opacity="0.9" transform="rotate(-20 -8 -198)" />
        <ellipse cx="10" cy="-196" rx="10" ry="16" fill="#e7f5ff" opacity="0.9" transform="rotate(20 10 -196)" />
      </g>
      <Inside d="M-24 -170 a24 18 0 1 0 48 0 a24 18 0 1 0 -48 0 Z">
        <rect x="-24" y="-190" width="48" height="40" fill="#ffd43b" />
        <path d="M-8 -190 V-150 M8 -190 V-150" stroke="#343a40" strokeWidth="8" />
      </Inside>
      <path d="M24 -170 l8 0" stroke="#343a40" strokeWidth="4" strokeLinecap="round" />
      <circle cx="-26" cy="-172" r="12" fill="#343a40" />
      <circle cx="-30" cy="-176" r="3.4" fill="#fff" />
      <circle cx="-30" cy="-176" r="1.8" fill={INK} />
      <path d="M-30 -182 q-6 -12 -12 -10 M-24 -184 q-2 -12 -8 -14" stroke="#343a40" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="-34" cy="-166" r="3" fill={CHEEK} opacity="0.7" />
    </g>
  );
}

/** A brimstone butterfly: it flaps its yellow wings and flutters around. */
export function Zitronenfalter() {
  return (
    <g className="os-falter-fly" style={{ transformOrigin: "0px -180px" }}>
      <g className="os-falter-wing" style={{ transformOrigin: "0px -180px" }}>
        <path d="M-2 -182 Q-40 -230 -44 -196 Q-46 -176 -2 -178 Z" fill="#ffe066" />
        <path d="M-2 -178 Q-36 -170 -30 -150 Q-16 -142 -2 -172 Z" fill="#fcc419" />
        <path d="M2 -182 Q40 -230 44 -196 Q46 -176 2 -178 Z" fill="#ffe066" />
        <path d="M2 -178 Q36 -170 30 -150 Q16 -142 2 -172 Z" fill="#fcc419" />
        <circle cx="-24" cy="-196" r="4" fill="#ff922b" />
        <circle cx="24" cy="-196" r="4" fill="#ff922b" />
      </g>
      <ellipse cx="0" cy="-174" rx="4" ry="16" fill="#5c4033" />
      <path d="M-2 -190 q-6 -12 -12 -12 M2 -190 q6 -12 12 -12" stroke="#5c4033" strokeWidth="2" strokeLinecap="round" fill="none" />
    </g>
  );
}

/** A ladybird on a leaf, seen from above: it opens its red shell, flies a little round and lands again. */
export function Glueckskaefer() {
  return (
    <>
      <path d="M-56 -6 Q-20 -44 40 -24 Q58 -14 60 0 Q10 10 -56 -6 Z" fill="#52b788" />
      <path d="M-50 -6 Q0 -18 58 -2" stroke="#2d6a4f" strokeWidth="2.5" fill="none" />
      <g className="os-kaefer-body">
        <g className="os-kaefer-wings" fill="#e7f5ff" opacity="0.9">
          <ellipse cx="16" cy="-40" rx="22" ry="9" transform="rotate(-24 16 -40)" />
          <ellipse cx="16" cy="-6" rx="22" ry="9" transform="rotate(24 16 -6)" />
        </g>
        <circle cx="-20" cy="-23" r="9" fill="#212529" />
        <circle cx="-23" cy="-27" r="2.2" fill="#fff" />
        <circle cx="-23" cy="-19" r="2.2" fill="#fff" />
        <path d="M-26 -30 l-8 -6 M-26 -16 l-8 6" stroke="#212529" strokeWidth="2" strokeLinecap="round" />
        <g className="os-kaefer-shell-t" style={{ transformOrigin: "-12px -23px" }}>
          <path d="M-13 -23 A22 17 0 0 1 25 -23 Z" fill="#e03131" />
          <circle cx="0" cy="-31" r="3.6" fill="#212529" />
          <circle cx="14" cy="-30" r="3" fill="#212529" />
          <path d="M-6 -34 q6 -4 12 -3" stroke="#fff" strokeOpacity="0.6" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
        <g className="os-kaefer-shell-b" style={{ transformOrigin: "-12px -23px" }}>
          <path d="M-13 -23 A22 17 0 0 0 25 -23 Z" fill="#f03e3e" />
          <circle cx="0" cy="-15" r="3.6" fill="#212529" />
          <circle cx="14" cy="-16" r="3" fill="#212529" />
        </g>
        <path d="M-12 -23 H25" stroke="#212529" strokeWidth="2" />
      </g>
    </>
  );
}

/** A little bunny nibbling a carrot: nose wiggles, ears twitch, it munches and hops. */
export function Haeschen() {
  return (
    <g className="os-haeschen-body" style={{ transformOrigin: "0px 0px" }}>
      <ellipse cx="18" cy="-38" rx="46" ry="36" fill="#b08968" />
      <ellipse cx="34" cy="-8" rx="26" ry="9" fill="#9c7656" />
      <circle className="os-haeschen-tail" cx="64" cy="-44" r="12" fill="#fff" style={{ transformOrigin: "60px -44px" }} />
      <ellipse cx="-2" cy="-26" rx="20" ry="16" fill="#e6ccb2" />
      <g className="os-haeschen-head" style={{ transformOrigin: "-14px -56px" }}>
        <g className="os-haeschen-ear" style={{ transformOrigin: "-26px -88px" }}>
          <ellipse cx="-34" cy="-118" rx="9" ry="28" fill="#b08968" transform="rotate(-14 -34 -118)" />
          <ellipse cx="-34" cy="-118" rx="4.5" ry="20" fill="#ffc9d6" transform="rotate(-14 -34 -118)" />
        </g>
        <g className="os-haeschen-ear2" style={{ transformOrigin: "-14px -88px" }}>
          <ellipse cx="-8" cy="-118" rx="9" ry="28" fill="#9c7656" transform="rotate(12 -8 -118)" />
        </g>
        <circle cx="-28" cy="-72" r="26" fill="#b08968" />
        <ellipse cx="-40" cy="-62" rx="14" ry="11" fill="#e6ccb2" />
        <Eye cx={-34} cy={-80} r={4.2} />
        <Lid cx={-34} cy={-80} r={4.2} fill="#b08968" />
        <ellipse className="os-haeschen-nose" cx="-50" cy="-68" rx="5" ry="4" fill="#ff8fa3" />
        <path d="M-50 -64 l-16 -2 M-50 -62 l-14 6 M-46 -64 l8 -8" stroke="#6b4423" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="-22" cy="-62" r="5" fill={CHEEK} opacity="0.5" />
      </g>
      {/* The carrot in its paws */}
      <g className="os-haeschen-carrot" style={{ transformOrigin: "-34px -34px" }}>
        <path d="M-30 -48 L-72 -30 L-34 -28 Z" fill="#ff922b" />
        <path d="M-44 -42 l4 6 M-56 -36 l3 5" stroke="#e8590c" strokeWidth="2" />
        <path d="M-30 -48 l10 -12 M-30 -46 l14 -4 M-30 -44 l12 6" stroke="#40916c" strokeWidth="4" strokeLinecap="round" />
      </g>
      <ellipse cx="-24" cy="-36" rx="8" ry="6" fill="#e6ccb2" />
      <Puffs className="os-haeschen-crumbs" spots={[[-70, -50], [-78, -38], [-62, -60]]} r={4} fill="#ff922b" />
      <Notes x={-90} y={-120} texts={["Mampf!"]} colour="#fff" size={24} />
    </g>
  );
}

/** An earthworm looking out of its hole: it stretches up, sways and says hello. */
export function Regenwurm() {
  return (
    <>
      <ellipse cx="0" cy="-6" rx="46" ry="14" fill="#8d5a3b" />
      <ellipse cx="0" cy="-8" rx="16" ry="6" fill="#5c3a28" />
      <Inside d="M-80 -8 H80 V-160 H-80 Z">
        <g className="os-wurm-body" style={{ transformOrigin: "0px 0px" }}>
          <path d="M0 30 Q-10 -20 6 -46" stroke="#ff8fa3" strokeWidth="16" strokeLinecap="round" fill="none" />
          <path d="M-4 -12 h10 M-4 -22 h10" stroke="#f06595" strokeWidth="2" opacity="0.6" />
          <circle cx="8" cy="-52" r="13" fill="#ff8fa3" />
          <Face cx={8} cy={-54} size={0.55} />
        </g>
      </Inside>
      {/* The front lip of the hole */}
      <path d="M-46 -6 Q0 14 46 -6 Q40 6 0 8 Q-40 6 -46 -6 Z" fill="#8d5a3b" />
      <g fill="#6b4423">
        <circle cx="-30" cy="-12" r="4" />
        <circle cx="28" cy="-14" r="3" />
        <circle cx="36" cy="-4" r="3.5" />
      </g>
      <path className="os-wurm-heart" d={heartPath(40, -70, 9)} fill="#ff6b9a" />
      <Notes x={-60} y={-90} texts={["Hallo!"]} colour="#fff" size={22} />
    </>
  );
}
