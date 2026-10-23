import { CHEEK, Eye, Face, INK, nth } from "../shared";
import { Drops, Notes, Puffs, SAND, SAND_DARK, Sparkles, SEA } from "./parts";

// Things in the sand at the front: the sand castle, the bucket, the spade, the sand pile with
// the lugworm, the half-buried treasure chest, the cool box, the pinwheel and the sun cream.
// Foot point at (0, 0). Lids, the door of the castle and the pile's cap are separate parts.

// The castle is built from wet sand, a little darker than the beach.
const CASTLE = "#ecc27a";
const CASTLE_LIGHT = "#f3d08f";
const CASTLE_SHADE = "#d9a95a";

const TOWER_TOP = (x: number, y: number, w: number) =>
  Array.from({ length: 3 }, (_, i) => <rect key={i} x={x + (i * (w - 10)) / 2} y={y - 12} width="10" height="13" />);

/** The sand castle grows when tapped: the towers shoot up, a new top tower rises with its flag, sand trickles. */
export function Sandburg() {
  return (
    <>
      <path d="M-134 2 Q-130 -30 -100 -36 H100 Q130 -30 134 2 Z" fill={SAND_DARK} />
      {/* The top tower hides inside the keep until the castle grows */}
      <g className="sd-burg-top" style={{ transformOrigin: "0px -120px" }}>
        <g fill={CASTLE_LIGHT}>
          <rect x="-18" y="-196" width="36" height="80" />
          {TOWER_TOP(-18, -196, 36)}
        </g>
        <path d="M0 -208 V-246" stroke="#868e96" strokeWidth="4" strokeLinecap="round" />
        <path className="sd-burg-flag-top" d="M0 -246 Q14 -252 30 -242 Q20 -236 30 -228 Q14 -234 0 -230 Z" fill="#4dabf7" style={{ transformOrigin: "0px -238px" }} />
      </g>
      {[-1, 1].map((s) => (
        <g key={s} className="sd-burg-tower" style={{ ...nth(s < 0 ? 0 : 1), transformOrigin: `${s * 88}px -30px` }}>
          <g fill={CASTLE}>
            <rect x={s * 88 - 22} y="-134" width="44" height="104" />
            {TOWER_TOP(s * 88 - 22, -134, 44)}
          </g>
          <rect x={s * 88 + 8} y="-134" width="14" height="104" fill={CASTLE_SHADE} />
          <rect x={s * 88 - 7} y="-110" width="14" height="20" rx="7" fill="#a0673a" opacity="0.7" />
          <path d={`M${s * 88 - 16} -60 h32`} stroke={SAND_DARK} strokeWidth="3" />
        </g>
      ))}
      <path d="M88 -146 V-176" stroke="#868e96" strokeWidth="4" strokeLinecap="round" />
      <path className="sd-burg-flag" d="M88 -176 Q102 -182 118 -172 Q108 -166 118 -158 Q102 -164 88 -160 Z" fill="#e63946" style={{ transformOrigin: "88px -168px" }} />
      <g className="sd-burg-keep" style={{ transformOrigin: "0px -30px" }}>
        <g fill={CASTLE}>
          <rect x="-66" y="-94" width="132" height="64" />
          <rect x="48" y="-94" width="18" height="64" fill={CASTLE_SHADE} />
          {Array.from({ length: 6 }, (_, i) => (
            <rect key={i} x={-66 + i * 24.4} y="-106" width="12" height="13" />
          ))}
        </g>
        <g fill={CASTLE_LIGHT}>
          <rect x="-30" y="-140" width="60" height="50" />
          {TOWER_TOP(-30, -140, 60)}
          <rect x="16" y="-140" width="14" height="50" fill={CASTLE_SHADE} />
        </g>
        <path d="M-60 -32 H60" stroke={CASTLE_SHADE} strokeWidth="5" />
        <path d="M-56 -70 h30 M24 -78 h30 M-14 -120 h26" stroke={SAND_DARK} strokeWidth="3" />
        {/* The gate of the castle */}
        <path d="M-16 -30 V-56 Q0 -72 16 -56 V-30 Z" fill="#a0673a" />
        <path d="M-6 -32 V-60 M6 -32 V-60" stroke="#8d5a2b" strokeWidth="2.5" />
        <circle cx="-40" cy="-58" r="6" fill="#fff" />
        <path d="M34 -52 l6 -10 l6 10 Z" fill="#ffa8a8" />
      </g>
      <Puffs className="sd-burg-sand" spots={[[-110, -150], [-70, -146], [70, -150], [108, -144], [0, -160]]} r={7} fill={SAND_DARK} />
      <Sparkles className="sd-burg-sparkle" spots={[[-60, -200], [60, -220], [0, -270]]} r={11} fill="#fff9db" />
    </>
  );
}

/** The bucket full of water: it wobbles, its handle swings and a little fish jumps out and back in. */
export function Eimer() {
  return (
    <>
      <g className="sd-eimer-fish" style={{ transformOrigin: "0px -100px" }}>
        <path d="M-14 -104 Q0 -120 16 -104 Q0 -90 -14 -104 Z" fill="#ff922b" />
        <path d="M-14 -104 L-26 -114 V-94 Z" fill="#ff922b" />
        <circle cx="8" cy="-106" r="2.2" fill={INK} />
      </g>
      <g className="sd-eimer-body" style={{ transformOrigin: "0px 0px" }}>
        <g className="sd-eimer-handle" style={{ transformOrigin: "0px -92px" }}>
          <path d="M-42 -88 Q0 -150 42 -88" stroke="#ffd43b" strokeWidth="6" fill="none" />
        </g>
        <path d="M-44 -92 H44 L34 -4 Q34 2 28 2 H-28 Q-34 2 -34 -4 Z" fill="#4dabf7" />
        <ellipse cx="0" cy="-92" rx="44" ry="11" fill="#339af0" />
        <ellipse className="sd-eimer-water" cx="0" cy="-90" rx="36" ry="7" fill={SEA} />
        <path d="M-40 -62 H40" stroke="#a5d8ff" strokeWidth="6" />
        <path d="M-32 -40 Q-32 -64 -26 -80" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.4" />
        <path d="M6 -40 l6 -8 l6 8 l-6 8 Z" fill="#ffd43b" />
      </g>
      <Drops className="sd-eimer-splash" spots={[[-30, -112], [-10, -126], [24, -120], [40, -106]]} r={6} />
      <Notes x={40} y={-140} texts={["Plitsch!"]} colour="#a5d8ff" size={22} />
    </>
  );
}

/** The spade stuck in the sand: it pulls out, digs, throws sand and sticks back in. */
export function Schaufel() {
  return (
    <>
      <path d="M-40 0 Q-36 -14 -6 -16 Q30 -14 40 0 Z" fill={SAND_DARK} />
      <g className="sd-schaufel-dig" style={{ transformOrigin: "0px -10px" }}>
        <path d="M0 -14 L-40 -150" stroke="#40c057" strokeWidth="10" strokeLinecap="round" />
        <path d="M-56 -162 h30" stroke="#2f9e44" strokeWidth="12" strokeLinecap="round" transform="rotate(-16 -41 -162)" />
        <path d="M-22 -24 Q-22 -40 0 -40 Q22 -40 22 -24 L12 2 H-12 Z" fill="#69db7c" transform="rotate(16 0 -20)" />
        <ellipse cx="2" cy="-30" rx="12" ry="5" fill={SAND} transform="rotate(16 0 -20)" className="sd-schaufel-load" />
      </g>
      <Puffs className="sd-schaufel-sand" spots={[[40, -40], [60, -70], [76, -52], [50, -96]]} r={10} fill={SAND} />
    </>
  );
}

/** The sand pile: its top lifts and a little lugworm pops out, looks around and slips back in. */
export function Sandhaufen() {
  return (
    <>
      <path d="M-100 2 Q-80 -40 -40 -56 Q0 -68 40 -56 Q84 -40 100 2 Z" fill={CASTLE} />
      <path d="M20 -60 Q70 -44 100 2 H40 Q50 -30 20 -60 Z" fill={CASTLE_SHADE} opacity="0.7" />
      <path d="M-70 -24 Q-40 -46 -6 -50" stroke="#fff" strokeOpacity="0.45" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M-100 2 Q0 -8 100 2" stroke={CASTLE_SHADE} strokeWidth="5" fill="none" />
      <path d="M-56 -18 Q-48 -30 -40 -18 Z" fill="#ffc9c9" />
      <circle cx="56" cy="-14" r="5" fill="#ced4da" />
      {/* The worm waits inside the hole until the top lifts */}
      <g className="sd-haufen-worm" style={{ transformOrigin: "0px -60px" }}>
        <path d="M-10 -56 Q-14 -90 0 -104 Q16 -112 16 -94 Q14 -76 10 -56 Z" fill="#ff8fab" />
        <path d="M-10 -72 H12 M-8 -86 H14" stroke="#f06595" strokeWidth="3" strokeLinecap="round" />
        <Eye cx={0} cy={-98} r={3} />
        <Eye cx={10} cy={-98} r={3} />
        <circle cx="12" cy="-90" r="3" fill={CHEEK} opacity="0.7" />
      </g>
      <ellipse cx="0" cy="-58" rx="22" ry="6" fill={SAND_DARK} />
      <g className="sd-haufen-cap" style={{ transformOrigin: "24px -60px" }}>
        <path d="M-30 -58 Q-24 -76 0 -78 Q24 -76 30 -58 Q0 -50 -30 -58 Z" fill={CASTLE_LIGHT} />
      </g>
      <Puffs className="sd-haufen-sand" spots={[[-40, -70], [-20, -90], [30, -88], [46, -66]]} r={7} fill={SAND_DARK} />
      <Notes x={30} y={-120} texts={["Kuckuck!"]} colour="#ffc9e0" size={20} />
    </>
  );
}

/** The treasure chest, half in the sand: the lid flies open, it glows, and coins and sparkles jump out. */
export function Schatztruhe() {
  return (
    <>
      <g className="sd-truhe-glow">
        <ellipse cx="0" cy="-74" rx="74" ry="34" fill="#fff3b0" />
      </g>
      <g className="sd-truhe-coins" fill="#ffd43b" stroke="#f08c00" strokeWidth="3">
        {[-34, -12, 10, 32].map((x, i) => (
          <circle key={x} cx={x} cy={-70} r="10" style={nth(i)} />
        ))}
      </g>
      <rect x="-70" y="-72" width="140" height="70" rx="6" fill="#a0673a" />
      <path d="M-70 -52 H70 M-70 -28 H70" stroke="#8d5a2b" strokeWidth="4" />
      <path d="M-56 -72 V-2 M56 -72 V-2" stroke="#fab005" strokeWidth="9" />
      <rect x="-12" y="-62" width="24" height="24" rx="5" fill="#fab005" />
      <circle cx="0" cy="-52" r="4" fill={INK} />
      <path d="M0 -50 V-44" stroke={INK} strokeWidth="3" />
      <g className="sd-truhe-lid" style={{ transformOrigin: "-70px -72px" }}>
        <path d="M-74 -72 Q-74 -118 0 -120 Q74 -118 74 -72 Z" fill="#c08552" />
        <path d="M-56 -76 Q-56 -110 -50 -114 M56 -76 Q56 -110 50 -114" stroke="#fab005" strokeWidth="9" fill="none" />
        <path d="M-74 -72 H74" stroke="#8d5a2b" strokeWidth="6" />
        <path d="M-40 -100 Q-10 -114 20 -112" stroke="#fff" strokeOpacity="0.3" strokeWidth="6" strokeLinecap="round" fill="none" />
      </g>
      {/* Sand piled up in front of the chest */}
      <path d="M-100 4 Q-90 -30 -50 -26 Q-20 -40 10 -24 Q60 -36 100 4 Z" fill={SAND} />
      <path d="M-70 -14 Q-40 -26 -10 -18" stroke="#fff" strokeOpacity="0.4" strokeWidth="5" strokeLinecap="round" fill="none" />
      <Sparkles className="sd-truhe-sparkle" spots={[[-60, -140], [0, -170], [62, -140], [-30, -190], [36, -196]]} r={12} fill="#fff9db" />
    </>
  );
}

/** The cool box: the lid lifts, cold air puffs out, an ice lolly pops up and the ice cubes rattle. */
export function Kuehlbox() {
  return (
    <>
      <Puffs className="sd-kuehl-cold" spots={[[-40, -112], [-10, -128], [24, -118], [50, -106]]} r={12} fill="#e7f5ff" />
      {/* The ice lolly sits inside and pops up while it plays */}
      <g className="sd-kuehl-eis">
        <rect x="-4" y="-120" width="8" height="40" rx="3" fill="#e9c46a" />
        <rect x="-20" y="-170" width="40" height="60" rx="18" fill="#ff6b9a" />
        <path d="M-20 -142 H20" stroke="#ffd8e4" strokeWidth="8" />
        <Face cx={0} cy={-152} size={0.55} />
      </g>
      <rect x="-80" y="-92" width="160" height="92" rx="12" fill="#339af0" />
      <rect x="-80" y="-34" width="160" height="34" rx="10" fill="#1c7ed6" />
      <rect x="-56" y="-74" width="112" height="30" rx="8" fill="#fff" />
      <path d="M-44 -60 l8 -6 l8 6 l8 -6 l8 6 l8 -6 l8 6 l8 -6 l8 6 l8 -6 l8 6" stroke="#4dabf7" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M-70 -80 V-20" stroke="#fff" strokeOpacity="0.35" strokeWidth="6" strokeLinecap="round" />
      <g className="sd-kuehl-lid" style={{ transformOrigin: "80px -92px" }}>
        <rect x="-86" y="-110" width="172" height="24" rx="10" fill="#f8f9fa" />
        <path d="M-30 -110 Q-30 -128 0 -128 Q30 -128 30 -110" stroke="#dee2e6" strokeWidth="8" fill="none" />
        <path d="M-74 -102 H60" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      </g>
      <Notes x={60} y={-150} texts={["Brrr!"]} colour="#d0ebff" size={22} />
    </>
  );
}

const BLADES = ["#e63946", "#ffd43b", "#4dabf7", "#40c057"];

/** The pinwheel in the sand: it spins fast, then slows down. */
export function Windrad() {
  return (
    <>
      <path d="M0 0 V-120" stroke="#f8f9fa" strokeWidth="7" strokeLinecap="round" />
      <path d="M-2 -4 V-116" stroke="#adb5bd" strokeWidth="2" />
      <g className="sd-windrad-blades" style={{ transformOrigin: "0px -130px" }}>
        {BLADES.map((colour, i) => (
          <path key={colour} d="M0 -130 L0 -176 Q30 -170 0 -130 Z" fill={colour} transform={`rotate(${i * 90} 0 -130)`} />
        ))}
      </g>
      <circle cx="0" cy="-130" r="6" fill="#fff" stroke="#adb5bd" strokeWidth="2" />
    </>
  );
}

/** The sun cream: the bottle squeezes, its cap pops open and a white blob comes out. */
export function Sonnencreme() {
  return (
    <>
      <g className="sd-creme-blob">
        <path d="M-10 -104 Q-16 -122 0 -130 Q14 -136 18 -120 Q24 -110 10 -104 Z" fill="#fff" />
      </g>
      <g className="sd-creme-bottle" style={{ transformOrigin: "0px 0px" }}>
        <path d="M-26 -8 Q-30 -60 -20 -86 H20 Q30 -60 26 -8 Q24 2 0 2 Q-24 2 -26 -8 Z" fill="#ffd43b" />
        <circle cx="0" cy="-46" r="15" fill="#ff922b" />
        <path d="M0 -66 V-62 M0 -30 V-26 M-20 -46 H-16 M16 -46 H20 M-14 -60 l3 3 M14 -32 l-3 -3 M14 -60 l-3 3 M-14 -32 l3 -3" stroke="#ff922b" strokeWidth="3" strokeLinecap="round" />
        <circle cx="-5" cy="-48" r="1.8" fill={INK} />
        <circle cx="5" cy="-48" r="1.8" fill={INK} />
        <path d="M-5 -42 Q0 -38 5 -42" stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M-18 -16 Q-22 -50 -14 -78" stroke="#fff" strokeOpacity="0.45" strokeWidth="5" strokeLinecap="round" fill="none" />
        <rect x="-14" y="-98" width="28" height="14" rx="4" fill="#fff" />
        <g className="sd-creme-cap" style={{ transformOrigin: "10px -98px" }}>
          <rect x="-10" y="-106" width="20" height="10" rx="4" fill="#e63946" />
        </g>
      </g>
      <Notes x={24} y={-130} texts={["Quietsch!"]} colour="#fff" size={20} />
    </>
  );
}
