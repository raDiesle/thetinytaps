import type { ReactNode } from "react";
import { CHEEK, Eye, Face, INK, nth, side } from "../shared";
import { Drops, Hearts, Lid, Lines, Notes, Puffs, Sparkles } from "./parts";

// Toys and things on the floor. Each drawing has its foot point at (0, 0) and is placed with ground().

// ---------- At the back ----------

/** A yellow rubber boot standing on (x, 0), toe to the left. */
function Boot({ x }: { x: number }) {
  return (
    <>
      <path d={`M${x - 16} -96 H${x + 18} V-14 Q${x + 18} 0 ${x + 4} 0 H${x - 40} Q${x - 52} 0 ${x - 50} -12 Q${x - 46} -26 ${x - 16} -30 Z`} fill="#ffd43b" />
      <rect x={x - 20} y="-100" width="42" height="12" rx="4" fill="#fab005" />
      <path d={`M${x - 10} -84 V-34`} stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.5" />
      <rect x={x - 52} y="-6" width="72" height="6" rx="3" fill="#e67700" />
      <circle cx={x + 2} cy="-60" r="7" fill="#ff8787" />
    </>
  );
}

/** Yellow rubber boots below the coat hooks; they stamp, and splash, splash, out come the drops. */
export function Gummistiefel() {
  return (
    <>
      <Drops x={-20} y={-50} count={4} spread={30} />
      {[-12, 46].map((x, i) => (
        <g key={x} className="ki-stiefel" style={{ ...nth(i), transformOrigin: `${x}px 0px` }}>
          <Boot x={x} />
        </g>
      ))}
    </>
  );
}

/** A box in the toy shelf, with a picture of what's inside; `children` is the toy that pops out. */
function ToyBox({ x, colour, i, children }: { x: number; colour: string; i: number; children: ReactNode }) {
  return (
    <g className="ki-kiste-box" style={{ ...nth(i), transformOrigin: `${x + 44}px -14px` }}>
      <rect x={x + 4} y="-92" width="80" height="12" rx="3" fill="#000" opacity="0.2" />
      <g className="ki-kiste-toy" style={nth(i)}>
        {children}
      </g>
      <rect x={x} y="-86" width="88" height="72" rx="8" fill={colour} />
      <rect x={x + 8} y="-80" width="12" height="58" rx="5" fill="#fff" opacity="0.3" />
      <circle cx={x + 44} cy="-50" r="16" fill="#fff" opacity="0.9" />
      <rect x={x + 30} y="-26" width="28" height="7" rx="3" fill="#000" opacity="0.15" />
    </g>
  );
}

/** The low toy shelf in the building corner; the boxes slide out one after another and a toy pops up from each. */
export function Kisten() {
  return (
    <>
      <rect x="-152" y="-216" width="304" height="216" rx="8" fill="#c88b3a" />
      <rect x="-140" y="-204" width="280" height="96" fill="#a0662f" />
      <rect x="-140" y="-100" width="280" height="88" fill="#a0662f" />
      <rect x="-152" y="-108" width="304" height="12" fill="#e9b872" />
      <rect x="-152" y="-220" width="304" height="14" rx="5" fill="#e9b872" />
      {/* Upper shelf: books and a puzzle */}
      {["#ff8787", "#74c0fc", "#ffd43b", "#b197fc", "#69db7c"].map((c, i) => (
        <rect key={c} x={-130 + i * 22} y={-190 + (i % 2) * 10} width="18" height={82 - (i % 2) * 10} rx="3" fill={c} />
      ))}
      <rect x="0" y="-140" width="120" height="32" rx="4" fill="#ffa94d" />
      <path d="M20 -124 h24 M64 -124 h40" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
      <rect x="10" y="-170" width="100" height="30" rx="4" fill="#63e6be" />
      {/* Lower shelf: three boxes */}
      <ToyBox x={-142} colour="#ff6b6b" i={0}>
        <rect x={-120} y={-110} width="44" height="20" rx="6" fill="#4dabf7" />
        <circle cx={-110} cy={-90} r="7" fill={INK} />
        <circle cx={-86} cy={-90} r="7" fill={INK} />
      </ToyBox>
      <ToyBox x={-44} colour="#ffd43b" i={1}>
        <ellipse cx={0} cy={-96} rx="20" ry="13" fill="#ffd43b" stroke="#fab005" strokeWidth="2" />
        <circle cx={-10} cy={-110} r="10" fill="#ffd43b" stroke="#fab005" strokeWidth="2" />
        <path d="M-20 -110 l-8 3 l8 3 Z" fill="#ff922b" />
        <circle cx={-12} cy={-112} r="2" fill={INK} />
      </ToyBox>
      <ToyBox x={54} colour="#4dabf7" i={2}>
        <circle cx={98} cy={-100} r="18" fill="#ff6b6b" />
        <path d="M80 -100 Q98 -88 116 -100" stroke="#fff" strokeWidth="4" fill="none" />
      </ToyBox>
      {/* The pictures on the boxes */}
      <g transform="translate(-98 -50)">
        <rect x="-10" y="-6" width="20" height="8" rx="3" fill="#4dabf7" />
        <circle cx="-5" cy="3" r="3.5" fill={INK} />
        <circle cx="5" cy="3" r="3.5" fill={INK} />
      </g>
      <g transform="translate(0 -50)">
        <ellipse cx="2" cy="3" rx="8" ry="5" fill="#fab005" />
        <circle cx="-4" cy="-4" r="5" fill="#fab005" />
      </g>
      <circle cx="98" cy="-50" r="8" fill="#ff6b6b" />
    </>
  );
}

/** The doll's pram; it rocks, the wheels roll, the hood folds back and the doll sits up and blinks. */
export function Puppenwagen() {
  return (
    <>
      <g className="ki-wagen" style={{ transformOrigin: "0px -20px" }}>
        <path d="M58 -96 L96 -170" stroke="#868e96" strokeWidth="8" strokeLinecap="round" />
        <rect x="84" y="-182" width="30" height="12" rx="6" fill="#495057" />
        <path d="M-48 -40 L-58 -24 M44 -40 L54 -24" stroke="#868e96" strokeWidth="6" />
        {/* The doll, under the blanket */}
        <g className="ki-wagen-doll" style={{ transformOrigin: "-20px -96px" }}>
          <circle cx="-22" cy="-118" r="20" fill="#ffdbac" />
          <path d="M-42 -120 Q-42 -142 -22 -140 Q-2 -142 -2 -120 Q-12 -132 -22 -130 Q-32 -132 -42 -120 Z" fill="#ffd43b" />
          <circle cx="-29" cy="-116" r="2.4" fill={INK} />
          <circle cx="-15" cy="-116" r="2.4" fill={INK} />
          <Lid cx={-29} cy={-116} r={2.6} fill="#ffdbac" />
          <Lid cx={-15} cy={-116} r={2.6} fill="#ffdbac" />
          <circle cx="-33" cy="-109" r="3.5" fill={CHEEK} opacity="0.6" />
          <circle cx="-11" cy="-109" r="3.5" fill={CHEEK} opacity="0.6" />
          <path d="M-26 -108 Q-22 -105 -18 -108" stroke={INK} strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </g>
        <path d="M-72 -100 H64 Q68 -40 4 -40 Q-68 -40 -72 -100 Z" fill="#4dabf7" />
        <path d="M-60 -96 H54" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        <path d="M-62 -84 Q-56 -54 -20 -48" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.4" />
        <circle cx="-4" cy="-70" r="9" fill="#fff" opacity="0.8" />
        {/* The hood, folding back on its hinge */}
        <g className="ki-wagen-hood" style={{ transformOrigin: "-72px -100px" }}>
          <path d="M-72 -100 Q-74 -160 -10 -158 L-4 -100 Z" fill="#339af0" />
          <path d="M-60 -104 Q-58 -144 -20 -146 M-40 -104 Q-40 -132 -16 -136" stroke="#74c0fc" strokeWidth="4" fill="none" />
        </g>
      </g>
      {[-58, 54].map((cx) => (
        <g key={cx} className="ki-wagen-wheel" style={{ transformOrigin: `${cx}px -20px` }}>
          <circle cx={cx} cy="-20" r="20" fill={INK} />
          <circle cx={cx} cy="-20" r="10" fill="#dee2e6" />
          <path d={`M${cx - 20} -20 H${cx + 20} M${cx} -40 V0`} stroke="#adb5bd" strokeWidth="2.5" />
        </g>
      ))}
      <Hearts x={-10} y={-180} count={2} spread={36} colour="#f783ac" />
    </>
  );
}

/** A red drum with two sticks; the sticks drum, the drum hops and bumm, bumm! */
export function Trommel() {
  return (
    <>
      <g className="ki-trommel" style={{ transformOrigin: "0px 0px" }}>
        <path d="M-56 -96 V-16 Q0 4 56 -16 V-96 Z" fill="#ff6b6b" />
        <path d="M-56 -96 L-28 -12 L0 -96 L28 -10 L56 -96" stroke="#fff" strokeWidth="4" fill="none" />
        <path d="M-56 -24 Q0 -4 56 -24 V-14 Q0 6 -56 -14 Z" fill="#fab005" />
        <ellipse cx="0" cy="-96" rx="58" ry="18" fill="#fab005" />
        <ellipse cx="0" cy="-98" rx="50" ry="14" fill="#fff4e6" />
        <path d="M-40 -48 V-30" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.4" />
      </g>
      {[-1, 1].map((s, i) => (
        <g key={s} className="ki-trommel-stick" style={{ ...nth(i), ...side(s as 1 | -1), transformOrigin: `${s * 70}px -124px` }}>
          <path d={`M${s * 70} -124 L${s * 14} -104`} stroke="#c88b3a" strokeWidth="6" strokeLinecap="round" />
          <circle cx={s * 14} cy="-104" r="7" fill="#e9b872" />
        </g>
      ))}
      <Lines x={66} y={-96} colour="#ff6b6b" />
      <Lines x={-66} y={-96} dir={-1} colour="#ff6b6b" />
    </>
  );
}

/** The music box on a stool by the mats; the lid opens, the crank turns and a little moon spins to a soft tune. */
export function Spieluhr() {
  return (
    <>
      {/* Stool */}
      <path d="M-40 -66 L-46 0 M40 -66 L46 0" stroke="#e9b872" strokeWidth="9" strokeLinecap="round" />
      <path d="M-42 -28 H42" stroke="#e9b872" strokeWidth="6" />
      <rect x="-52" y="-78" width="104" height="14" rx="6" fill="#f3cf94" />
      {/* The moon that comes up on its spindle */}
      <g className="ki-spieluhr-moon" style={{ transformOrigin: "0px -108px" }}>
        <path d="M0 -124 V-108" stroke="#adb5bd" strokeWidth="3" />
        <path d="M2 -150 A14 14 0 1 0 2 -122 A10 10 0 1 1 2 -150 Z" fill="#ffd43b" />
        <circle cx="-6" cy="-140" r="1.6" fill={INK} />
      </g>
      <rect x="-40" y="-120" width="80" height="44" rx="6" fill="#da77f2" />
      <path d="M-40 -98 H40" stroke="#be4bdb" strokeWidth="4" />
      <path d="M-30 -112 V-86" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
      {[-18, 0, 18].map((x) => (
        <circle key={x} cx={x} cy="-88" r="3" fill="#fff" opacity="0.8" />
      ))}
      <g className="ki-spieluhr-crank" style={{ transformOrigin: "42px -98px" }}>
        <path d="M42 -98 H52 V-86" stroke="#868e96" strokeWidth="4" strokeLinecap="round" fill="none" />
        <circle cx="52" cy="-84" r="4" fill="#ffd43b" />
      </g>
      <g className="ki-spieluhr-lid" style={{ transformOrigin: "0px -120px" }}>
        <rect x="-44" y="-130" width="88" height="12" rx="5" fill="#be4bdb" />
        <path d="M0 -130 l3 -6 l3 6 Z" fill="#ffd43b" />
      </g>
      <Notes x={0} y={-160} colour="#be4bdb" size={0.8} />
    </>
  );
}

// ---------- The building corner ----------

const BLOCKS = [
  { w: 110, h: 56, colour: "#ff6b6b" },
  { w: 90, h: 50, colour: "#ffd43b" },
  { w: 100, h: 46, colour: "#4dabf7" },
  { w: 72, h: 54, colour: "#51cf66" },
  { w: 84, h: 40, colour: "#ff922b" },
];

/** A tall tower of blocks; it wobbles more and more, and the little roof hops off and lands again. */
export function Turm() {
  let y = 0;
  return (
    <>
      {BLOCKS.map(({ w, h, colour }, i) => {
        y -= h;
        return (
          <g key={i} className="ki-turm-block" style={{ ...nth(i), transformOrigin: `0px ${y + h}px` }}>
            <rect x={-w / 2} y={y} width={w} height={h} rx="5" fill={colour} />
            <rect x={-w / 2 + 6} y={y + 6} width={w * 0.25} height={h * 0.3} rx="3" fill="#fff" opacity="0.4" />
            {i % 2 === 0 && <circle cx="0" cy={y + h / 2} r={h * 0.22} fill="#fff" opacity="0.6" />}
          </g>
        );
      })}
      <g className="ki-turm-roof" style={{ transformOrigin: "0px -246px" }}>
        <path d="M-48 -246 L0 -300 L48 -246 Z" fill="#da77f2" />
        <path d="M-30 -252 L0 -286" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.4" />
        <path d="M0 -300 V-318" stroke={INK} strokeWidth="3" />
        <path d="M0 -318 H20 L14 -311 L20 -304 H0 Z" fill="#ff6b6b" />
      </g>
    </>
  );
}

/** The yellow toy dump truck; it drives forward, tips its load of blocks and comes back. */
export function Kipplaster() {
  return (
    <>
      <g className="ki-laster" style={{ transformOrigin: "0px 0px" }}>
        <rect x="-110" y="-54" width="220" height="22" rx="6" fill="#495057" />
        {/* The cab */}
        <path d="M40 -54 V-112 Q40 -120 48 -120 H86 Q110 -120 110 -96 V-54 Z" fill="#ffd43b" />
        <rect x="54" y="-110" width="40" height="30" rx="5" fill="#d0ebff" />
        <path d="M62 -84 L74 -106" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
        <circle cx="104" cy="-64" r="6" fill="#fff3bf" />
        {/* The dump bed with blocks, tipping on its back hinge */}
        <g className="ki-laster-bed" style={{ transformOrigin: "-110px -54px" }}>
          <g className="ki-laster-load">
            <rect x="-90" y="-112" width="30" height="30" rx="3" fill="#ff6b6b" />
            <rect x="-56" y="-118" width="30" height="30" rx="3" fill="#4dabf7" />
            <rect x="-22" y="-108" width="28" height="28" rx="3" fill="#51cf66" />
          </g>
          <path d="M-110 -100 H34 L28 -54 H-104 Z" fill="#fab005" />
          <path d="M-96 -88 H22 M-94 -72 H20" stroke="#fff" strokeWidth="4" opacity="0.4" />
        </g>
      </g>
      {[-72, 70].map((cx) => (
        <g key={cx} className="ki-laster-wheel" style={{ transformOrigin: `${cx}px -26px` }}>
          <circle cx={cx} cy="-26" r="26" fill={INK} />
          <circle cx={cx} cy="-26" r="13" fill="#ffd43b" />
          <path d={`M${cx - 13} -26 H${cx + 13}`} stroke="#fab005" strokeWidth="4" />
        </g>
      ))}
      <Puffs x={-122} y={-60} count={2} spread={20} r={9} colour="#e9ecef" />
    </>
  );
}

/** A pop-up picture book on the floor; a page turns and a frog pops up: Quak! */
export function Bilderbuch() {
  return (
    <>
      <path d="M-118 -2 L-100 -62 Q-50 -70 0 -58 Q50 -70 100 -62 L118 -2 Q60 -12 0 2 Q-60 -12 -118 -2 Z" fill="#4dabf7" />
      <path d="M-108 -8 L-92 -58 Q-46 -64 0 -52 V-4 Q-54 -16 -108 -8 Z" fill="#fff" />
      <path d="M108 -8 L92 -58 Q46 -64 0 -52 V-4 Q54 -16 108 -8 Z" fill="#fff" />
      {/* Pond on the left page, flowers on the right */}
      <ellipse cx="-52" cy="-30" rx="32" ry="10" fill="#a5d8ff" />
      <ellipse cx="-62" cy="-32" rx="10" ry="4" fill="#69db7c" />
      {[40, 64, 84].map((x, i) => (
        <g key={x}>
          <path d={`M${x} -18 V-34`} stroke="#51cf66" strokeWidth="3" />
          <circle cx={x} cy={-38} r="6" fill={["#ff8787", "#ffd43b", "#da77f2"][i]} />
        </g>
      ))}
      {/* The frog that pops up from the middle */}
      <g className="ki-buch-frog" style={{ transformOrigin: "0px -30px" }}>
        <path d="M-30 -30 Q-34 -84 0 -86 Q34 -84 30 -30 Z" fill="#51cf66" />
        <circle cx="-14" cy="-86" r="12" fill="#51cf66" />
        <circle cx="14" cy="-86" r="12" fill="#51cf66" />
        <Eye cx={-14} cy={-87} r={5} />
        <Eye cx={14} cy={-87} r={5} />
        <path d="M-16 -62 Q0 -50 16 -62" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
        <ellipse cx="0" cy="-42" rx="18" ry="10" fill="#b2f2bb" />
      </g>
      {/* The page that turns over */}
      <g className="ki-buch-page" style={{ transformOrigin: "0px -30px" }}>
        <path d="M100 -10 L86 -56 Q44 -60 0 -50 V-6 Q50 -16 100 -10 Z" fill="#fff9db" stroke="#dee2e6" strokeWidth="2" />
      </g>
      <path d="M0 -52 V-2" stroke="#e9ecef" strokeWidth="3" />
      <Lines x={40} y={-90} colour="#51cf66" />
    </>
  );
}

// ---------- At the front ----------

/** A cuddly bunny by the mats; it hops, an ear flops over, its nose twitches and it gives a hug. */
export function Kuscheltier() {
  return (
    <>
      <g className="ki-hase" style={{ transformOrigin: "0px 0px" }}>
        <ellipse cx="-30" cy="-10" rx="20" ry="11" fill="#f8f9fa" />
        <ellipse cx="30" cy="-10" rx="20" ry="11" fill="#f8f9fa" />
        <ellipse cx="0" cy="-52" rx="40" ry="44" fill="#e9ecef" />
        <ellipse cx="0" cy="-46" rx="24" ry="30" fill="#fff" />
        <g className="ki-hase-ear" style={{ ...nth(0), transformOrigin: "-14px -150px" }}>
          <ellipse cx="-16" cy="-184" rx="12" ry="36" fill="#e9ecef" />
          <ellipse cx="-16" cy="-182" rx="6" ry="26" fill="#ffc9c9" />
        </g>
        <g className="ki-hase-ear" style={{ ...nth(1), transformOrigin: "14px -150px" }}>
          <ellipse cx="16" cy="-184" rx="12" ry="36" fill="#e9ecef" />
          <ellipse cx="16" cy="-182" rx="6" ry="26" fill="#ffc9c9" />
        </g>
        <circle cx="0" cy="-122" r="34" fill="#e9ecef" />
        <Face cx={0} cy={-122} size={0.9} />
        <Lid cx={-6.3} cy={-122} r={3.2} fill="#e9ecef" />
        <Lid cx={6.3} cy={-122} r={3.2} fill="#e9ecef" />
        <g className="ki-hase-nose" style={{ transformOrigin: "0px -112px" }}>
          <ellipse cx="0" cy="-112" rx="4" ry="3" fill="#f783ac" />
        </g>
        <path d="M-30 -64 Q-50 -50 -36 -36 M30 -64 Q50 -50 36 -36" stroke="#e9ecef" strokeWidth="16" strokeLinecap="round" fill="none" />
        <path d="M-18 -92 Q0 -84 18 -92 L14 -80 Q0 -74 -14 -80 Z" fill="#ff8787" />
      </g>
      <Hearts x={0} y={-210} count={3} spread={30} colour="#f783ac" />
    </>
  );
}

const BARS = ["#ff6b6b", "#ff922b", "#ffd43b", "#51cf66", "#4dabf7", "#845ef7"];

/** A xylophone with a mallet; the mallet hops from bar to bar, every bar jumps and the notes fly. */
export function Xylophon() {
  return (
    <>
      <path d="M-116 -70 L118 -56 M-116 -22 L118 -36" stroke="#a0662f" strokeWidth="12" strokeLinecap="round" />
      {BARS.map((c, i) => {
        const x = -104 + i * 36;
        const h = 76 - i * 7;
        return (
          <g key={c} className="ki-xylo-bar" style={nth(i)}>
            <rect x={x} y={-46 - h / 2} width="28" height={h} rx="6" fill={c} />
            <rect x={x + 5} y={-42 - h / 2} width="7" height={h - 12} rx="3" fill="#fff" opacity="0.4" />
            <circle cx={x + 14} cy={-46 - h / 2 + 8} r="3" fill="#868e96" />
            <circle cx={x + 14} cy={-46 + h / 2 - 8} r="3" fill="#868e96" />
          </g>
        );
      })}
      <g className="ki-xylo-mallet" style={{ transformOrigin: "-96px -10px" }}>
        <path d="M-96 -10 L-24 -2" stroke="#c88b3a" strokeWidth="6" strokeLinecap="round" />
        <circle cx="-100" cy="-10" r="11" fill="#ff6b6b" />
      </g>
      <Notes x={0} y={-130} colour="#4dabf7" />
    </>
  );
}

/** The green toy chest; the lid opens and boing, a clown on a spring jumps out and waves. */
export function Spielzeugkiste() {
  return (
    <>
      {/* The clown on its spring, inside the chest */}
      <g className="ki-kiste-clown" style={{ transformOrigin: "0px -110px" }}>
        <path d="M0 -110 l-14 -8 l28 -8 l-28 -8 l28 -8 l-14 -6" stroke="#adb5bd" strokeWidth="4" fill="none" strokeLinejoin="round" />
        <circle cx="0" cy="-178" r="28" fill="#fff4e6" />
        <path d="M-28 -184 Q-40 -200 -26 -206 Q-20 -192 -14 -196 Z M28 -184 Q40 -200 26 -206 Q20 -192 14 -196 Z" fill="#ff922b" />
        <path d="M-18 -200 L0 -236 L18 -200 Z" fill="#4dabf7" />
        <circle cx="0" cy="-238" r="6" fill="#ffd43b" />
        <Face cx={0} cy={-180} size={0.85} />
        <circle cx="0" cy="-172" r="6" fill="#ff6b6b" />
        <path d="M-20 -154 Q0 -144 20 -154 L14 -146 Q0 -140 -14 -146 Z" fill="#ffd43b" />
      </g>
      <rect x="-104" y="-122" width="208" height="122" rx="10" fill="#51cf66" />
      <rect x="-104" y="-122" width="208" height="16" fill="#40c057" />
      <path d="M-90 -96 V-14" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.35" />
      {[
        [-50, -60, "#ffd43b"],
        [10, -44, "#fff"],
        [60, -70, "#ff8787"],
      ].map(([x, y, c]) => (
        <path key={x} d={`M${x} ${(y as number) - 14} l4 9 h10 l-8 6 l3 10 l-9 -6 l-9 6 l3 -10 l-8 -6 h10 Z`} fill={c as string} />
      ))}
      <rect x="-16" y="-110" width="32" height="20" rx="4" fill="#ffd43b" />
      <g className="ki-kiste-lid" style={{ transformOrigin: "-108px -122px" }}>
        <path d="M-110 -122 Q-110 -150 -80 -150 H80 Q110 -150 110 -122 Z" fill="#69db7c" />
        <path d="M-90 -138 H80" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.4" />
      </g>
      <Sparkles x={0} y={-200} spread={70} />
    </>
  );
}

/** A big bouncy ball; it hops high and spins. */
export function Ball() {
  return (
    <>
      <Lines x={58} y={-22} colour="#ff6b6b" />
      <Lines x={-58} y={-22} dir={-1} colour="#ff6b6b" />
      <Sparkles x={0} y={-150} spread={50} />
      <g className="ki-ball" style={{ transformOrigin: "0px -44px" }}>
        <circle cx="0" cy="-44" r="44" fill="#ff6b6b" />
        <path d="M-44 -44 Q0 -10 44 -44 Q0 -78 -44 -44 Z" fill="#ffd43b" />
        <path d="M0 -88 Q-24 -44 0 0 Q24 -44 0 -88 Z" fill="#4dabf7" />
        <circle cx="-16" cy="-62" r="9" fill="#fff" opacity="0.6" />
      </g>
    </>
  );
}

/** A bunny slipper standing on (x, 0). */
function Slipper({ x, flip }: { x: number; flip: 1 | -1 }) {
  return (
    <>
      <path d={`M${x - 36} -2 Q${x - 40} -34 ${x} -36 Q${x + 40} -34 ${x + 36} -2 Q${x} 6 ${x - 36} -2 Z`} fill="#f783ac" />
      <ellipse cx={x} cy="-8" rx="26" ry="6" fill="#faa2c1" />
      <g className="ki-schuh-ear" style={{ ...side(flip), transformOrigin: `${x}px -34px` }}>
        <ellipse cx={x - 9} cy="-50" rx="5" ry="14" fill="#f783ac" />
        <ellipse cx={x + 9} cy="-50" rx="5" ry="14" fill="#f783ac" />
      </g>
      <circle cx={x - 7} cy="-24" r="2.5" fill={INK} />
      <circle cx={x + 7} cy="-24" r="2.5" fill={INK} />
      <circle cx={x} cy="-18" r="3" fill="#fff" />
    </>
  );
}

/** Pink bunny slippers; they hop one after the other, tip, tap, and their ears wiggle. */
export function Hausschuhe() {
  return (
    <>
      {[-40, 40].map((x, i) => (
        <g key={x} className="ki-schuh" style={{ ...nth(i), transformOrigin: `${x}px 0px` }}>
          <Slipper x={x} flip={i ? 1 : -1} />
        </g>
      ))}
    </>
  );
}
