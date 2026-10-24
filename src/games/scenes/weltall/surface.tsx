import { Hideout } from "../hideout";
import { Eye, Face, Inside, nth } from "../shared";
import { Dust, Helmet, SUIT, SUIT_SHADE, Sparkles, ellipsePath, starPath } from "./parts";

// Things on the moon's surface: crater, crystal, astronaut, ball, crate, telescope and the spare
// helmet. Each drawing has its foot point at (0, 0) and is placed with `ground`.

const STONES = [
  [-50, -22, 12],
  [6, -18, 9],
  [54, -24, 11],
];

/** A big crater: moon stones hop out and fall back in, and dust puffs up. */
export function Krater() {
  return (
    <>
      <Dust
        className="wa-krater-dust"
        spots={[
          [-84, -36],
          [-30, -48],
          [30, -48],
          [84, -36],
        ]}
        r={18}
      />
      <ellipse cx="0" cy="-22" rx="136" ry="32" fill="#c3c5d3" />
      <ellipse cx="0" cy="-20" rx="112" ry="22" fill="#8f92a8" />
      {/* Something climbs out of the hole */}
      <Hideout x={-60} y={-130} w={120} h={116} size={64} />
      <path d="M-112 -20 A112 22 0 0 0 112 -20 A112 12 0 0 1 -112 -20 Z" fill="#a9abbf" />
      <path d="M-136 -22 A136 32 0 0 0 136 -22" stroke="#e2e3ec" strokeWidth="6" fill="none" />
      <path d="M-120 -36 A136 32 0 0 1 -40 -52" stroke="#a9abbf" strokeWidth="5" fill="none" strokeLinecap="round" />
      {STONES.map(([x, y, r], i) => (
        <g key={x} className="wa-krater-stone" style={{ transformOrigin: `${x}px ${y}px`, ...nth(i) }}>
          <ellipse cx={x} cy={y} rx={r} ry={r * 0.72} fill="#7d8096" />
          <ellipse cx={x - r * 0.3} cy={y - r * 0.25} rx={r * 0.4} ry={r * 0.25} fill="#a5a8bc" />
        </g>
      ))}
      <Sparkles
        className="wa-krater-sparkle"
        spots={[
          [-70, -70],
          [0, -84],
          [70, -70],
        ]}
        r={10}
      />
    </>
  );
}

const SHARDS = [
  { d: "M-30 -30 L-40 -78 L-22 -96 L-10 -34 Z", fill: "#74c0fc", shine: "M-32 -42 L-38 -76" },
  { d: "M-12 -34 L-8 -104 L12 -114 L18 -36 Z", fill: "#4dabf7", shine: "M-4 -46 L-2 -100" },
  { d: "M14 -32 L30 -86 L46 -76 L34 -28 Z", fill: "#a5d8ff", shine: "M22 -40 L32 -78" },
];

/** A blue moon crystal on a rock: it glows, shimmers and sparkles. */
export function Kristall() {
  return (
    <>
      <circle className="wa-kristall-glow" cx="0" cy="-60" r="62" fill="#a5d8ff" />
      <path d="M-54 0 Q-58 -30 -30 -38 Q0 -44 30 -38 Q58 -30 54 0 Z" fill="#8f92a8" />
      <path d="M-40 -30 Q-10 -40 24 -36" stroke="#b5b8ca" strokeWidth="6" fill="none" strokeLinecap="round" />
      {SHARDS.map(({ d, fill, shine }, i) => (
        <g key={d} className="wa-kristall-shard" style={{ transformOrigin: "0px -34px", ...nth(i) }}>
          <path d={d} fill={fill} />
          <path d={shine} stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
        </g>
      ))}
      <Sparkles
        className="wa-kristall-sparkle"
        spots={[
          [-46, -100],
          [20, -128],
          [56, -92],
          [-6, -64],
        ]}
        r={9}
      />
    </>
  );
}

/** The astronaut walking on the moon: she hops slowly (the moon makes everyone light), waves and her buttons blink. */
export function Astronautin() {
  return (
    <>
      <Dust
        className="wa-astra-dust"
        spots={[
          [-36, -6],
          [0, 2],
          [36, -6],
        ]}
        r={14}
      />
      <g className="wa-astra-body">
        <rect x="-46" y="-158" width="22" height="72" rx="8" fill="#adb5bd" />
        <g className="wa-astra-leg" style={{ transformOrigin: "-14px -74px" }}>
          <rect x="-26" y="-80" width="22" height="68" rx="10" fill={SUIT} />
          <rect x="-30" y="-20" width="30" height="20" rx="8" fill="#868e96" />
        </g>
        <g className="wa-astra-leg" style={{ transformOrigin: "14px -74px", ...nth(1) }}>
          <rect x="4" y="-80" width="22" height="68" rx="10" fill={SUIT} />
          <rect x="2" y="-20" width="30" height="20" rx="8" fill="#868e96" />
        </g>
        <path d="M-30 -144 Q-46 -120 -42 -98" stroke={SUIT} strokeWidth="18" fill="none" strokeLinecap="round" />
        <circle cx="-42" cy="-94" r="10" fill="#ced4da" />
        <rect x="-34" y="-160" width="68" height="90" rx="22" fill={SUIT} />
        <path d="M14 -158 Q34 -150 34 -120 V-92 Q34 -72 14 -70 Z" fill={SUIT_SHADE} />
        <rect x="-34" y="-88" width="68" height="10" fill={SUIT_SHADE} />
        <rect x="-18" y="-138" width="36" height="24" rx="5" fill={SUIT_SHADE} />
        {["#ff6b6b", "#ffd60a", "#4dabf7"].map((colour, i) => (
          <circle key={colour} className="wa-astra-button" cx={-9 + i * 9} cy="-126" r="3.6" fill={colour} style={nth(i)} />
        ))}
        <path d={starPath(-20, -100, 7)} fill="#ff6b6b" />
        <g className="wa-astra-arm" style={{ transformOrigin: "28px -146px" }}>
          <path d="M28 -146 Q50 -162 54 -190" stroke={SUIT} strokeWidth="18" fill="none" strokeLinecap="round" />
          <circle cx="55" cy="-196" r="10" fill="#ced4da" />
        </g>
        <Helmet cx={0} cy={-186} r={38} hair="#a0522d" />
        <Sparkles className="wa-astra-glint" spots={[[-16, -204]]} r={8} />
      </g>
    </>
  );
}

/** A stripy ball that bounces very high on the moon. */
export function Mondball() {
  const ball = ellipsePath(0, -40, 40);
  return (
    <>
      <Dust
        className="wa-ball-dust"
        spots={[
          [-40, -6],
          [0, 0],
          [40, -6],
        ]}
        r={12}
      />
      <g className="wa-ball-body" style={{ transformOrigin: "0px 0px" }}>
        <g className="wa-ball-spin" style={{ transformOrigin: "0px -40px" }}>
          <circle cx="0" cy="-40" r="40" fill="#ff6b6b" />
          <Inside d={ball}>
            <path d="M-44 -62 Q0 -40 44 -62 V-44 Q0 -22 -44 -44 Z" fill="#ffd60a" />
            <path d="M-44 -30 Q0 -8 44 -30 V-12 Q0 10 -44 -12 Z" fill="#4dabf7" />
          </Inside>
        </g>
        <circle cx="0" cy="-40" r="40" fill="none" stroke="#c9184a" strokeWidth="3" opacity="0.4" />
        <ellipse cx="-14" cy="-58" rx="10" ry="7" fill="#fff" opacity="0.6" />
      </g>
    </>
  );
}

/** A green supply crate: the lid opens and a smiling star on a spring jumps out. */
export function Kiste() {
  return (
    <>
      <Sparkles
        className="wa-kiste-sparkle"
        spots={[
          [-50, -124],
          [0, -156],
          [50, -124],
        ]}
        r={10}
        fill="#ffe066"
      />
      <g className="wa-kiste-surprise">
        <path d="M0 -10 l-10 -6 l20 -8 l-20 -8 l20 -8 l-10 -6" stroke="#adb5bd" strokeWidth="4" fill="none" strokeLinejoin="round" />
        <path d={starPath(0, -50, 24)} fill="#ffd60a" />
        <Face cx={0} cy={-50} size={0.6} />
      </g>
      <g className="wa-kiste-box">
        <rect x="-70" y="-84" width="140" height="84" rx="6" fill="#52b788" />
        <path d="M-58 -56 H58 M-58 -28 H58" stroke="#40916c" strokeWidth="4" />
        <rect x="-70" y="-84" width="12" height="84" rx="3" fill="#2d6a4f" />
        <rect x="58" y="-84" width="12" height="84" rx="3" fill="#2d6a4f" />
        <path d={starPath(0, -42, 15)} fill="#ffd60a" opacity="0.9" />
        {[-64, 64].map((x) => (
          <g key={x} fill="#95d5b2">
            <circle cx={x} cy="-74" r="2.5" />
            <circle cx={x} cy="-10" r="2.5" />
          </g>
        ))}
      </g>
      <g className="wa-kiste-lid" style={{ transformOrigin: "-72px -86px" }}>
        <rect x="-74" y="-98" width="148" height="16" rx="5" fill="#40916c" />
        <rect x="-74" y="-98" width="148" height="5" rx="2" fill="#74c69d" />
        <rect x="-12" y="-104" width="24" height="7" rx="3" fill="#2d6a4f" />
      </g>
    </>
  );
}

/** The telescope on its tripod: it looks up to the sky, the lens glints and a star appears. */
export function Fernrohr() {
  return (
    <>
      <Sparkles
        className="wa-tele-star"
        spots={[
          [122, -206],
          [150, -170],
        ]}
        r={16}
        fill="#ffd60a"
      />
      <path d="M0 -92 L-52 0 M0 -92 L52 0 M0 -92 L6 0" stroke="#495057" strokeWidth="7" strokeLinecap="round" />
      <g className="wa-tele-tube" style={{ transformOrigin: "0px -96px" }}>
        <g transform="rotate(-28 0 -96)">
          <rect x="-66" y="-108" width="40" height="24" rx="6" fill="#343a40" />
          <rect x="-40" y="-114" width="110" height="36" rx="10" fill="#5c7cfa" />
          <rect x="10" y="-116" width="8" height="40" fill="#ffd60a" />
          <rect x="62" y="-120" width="26" height="48" rx="8" fill="#4263eb" />
          <ellipse cx="88" cy="-96" rx="7" ry="22" fill="#bde0fe" />
          <path d="M-30 -106 H56" stroke="#fff" strokeWidth="5" opacity="0.5" strokeLinecap="round" />
          <circle className="wa-tele-glint" cx="90" cy="-104" r="7" fill="#fff" />
        </g>
      </g>
      <circle cx="0" cy="-94" r="9" fill="#343a40" />
    </>
  );
}

/** A spare helmet on the ground: it wobbles and – peekaboo! – a little alien peeks out from behind it. */
export function Helm() {
  const visor = ellipsePath(0, -42, 28, 22);
  return (
    <>
      <g className="wa-helm-guest">
        <path d="M0 -74 Q4 -86 -2 -94" stroke="#9775fa" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="-2" cy="-96" r="4" fill="#ffd60a" />
        <ellipse cx="0" cy="-58" rx="20" ry="18" fill="#b197fc" />
        <Eye cx={-7} cy={-62} r={3.2} />
        <Eye cx={7} cy={-62} r={3.2} />
        <path d="M-4 -54 Q0 -50 4 -54" stroke="#2b2d42" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
      <g className="wa-helm-body" style={{ transformOrigin: "0px 0px" }}>
        <circle cx="0" cy="-40" r="40" fill={SUIT} />
        <path d="M-35 -20 A40 40 0 0 0 35 -20 Z" fill={SUIT_SHADE} />
        <ellipse cx="0" cy="-4" rx="30" ry="6" fill="#adb5bd" />
        <path d={visor} fill="#3b4a7a" />
        <path d={visor} fill="none" stroke="#adb5bd" strokeWidth="3" />
        <circle cx="-10" cy="-48" r="1.8" fill="#fff" />
        <circle cx="12" cy="-38" r="1.4" fill="#fff" />
        <circle cx="4" cy="-52" r="1.2" fill="#fff" />
        <path d="M-18 -52 Q-8 -60 6 -60" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
        <Sparkles
          className="wa-helm-glint"
          spots={[
            [-16, -56],
            [18, -30],
          ]}
          r={8}
        />
      </g>
    </>
  );
}
