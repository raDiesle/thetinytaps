import { CHEEK, Eye, Face, INK, nth, side } from "../shared";
import { Bubbles, Heart, Lid, Sand, Sparkle } from "./parts";

// Small things on the sandy sea floor at the front. Each drawing has its foot point at (0, 0);
// the snail sits on its stone (drawn in the background, same placement).

/** Treasure chest; the lid opens, gold coins jump out and it sparkles. */
export function Schatztruhe() {
  return (
    <>
      <ellipse className="uw-truhe-glow" cx="0" cy="-110" rx="110" ry="60" fill="#fff3b0" />
      <rect x="-84" y="-98" width="168" height="14" rx="4" fill="#583101" />
      <path d="M-80 -88 Q-50 -120 -10 -106 Q30 -124 80 -88 Z" fill="#ffd60a" />
      <circle cx="-30" cy="-104" r="6" fill="#ffe066" />
      <circle cx="26" cy="-110" r="6" fill="#ffe066" />
      <rect x="-90" y="-90" width="180" height="90" rx="10" fill="#9c6644" />
      <path d="M-90 -46 H90 M-90 -20 H90" stroke="#7f5539" strokeWidth="4" />
      <rect x="-64" y="-90" width="14" height="90" fill="#e9c46a" />
      <rect x="50" y="-90" width="14" height="90" fill="#e9c46a" />
      <g className="uw-truhe-lock" style={{ transformOrigin: "0px -84px" }}>
        <rect x="-15" y="-84" width="30" height="32" rx="6" fill="#ffd166" />
        <circle cx="0" cy="-74" r="4.5" fill={INK} />
        <path d="M0 -72 V-62" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      </g>
      <path d="M-80 -10 H80" stroke="#583101" strokeWidth="6" opacity="0.4" strokeLinecap="round" />
      <g className="uw-truhe-lid" style={{ transformOrigin: "90px -92px" }}>
        <path d="M-90 -90 V-116 Q-90 -146 -60 -146 H60 Q90 -146 90 -116 V-90 Z" fill="#b08968" />
        <path d="M-64 -90 V-140 H-50 V-90 Z M50 -90 V-140 H64 V-90 Z" fill="#e9c46a" />
        <path d="M-70 -132 Q-30 -140 20 -138" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.4" />
      </g>
      {/* A little crown rises out of the chest. */}
      <g className="uw-truhe-crown">
        <path d="M-22 -96 L-24 -122 L-11 -110 L0 -128 L11 -110 L24 -122 L22 -96 Z" fill="#ffd60a" stroke="#e09f3e" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="0" cy="-106" r="4" fill="#e63946" />
      </g>
      <g className="uw-truhe-sparkles">
        <Sparkle x={-76} y={-140} r={11} i={0} />
        <Sparkle x={78} y={-150} r={9} i={1} />
        <Sparkle x={-4} y={-160} r={12} i={2} />
      </g>
      <g className="uw-truhe-coins">
        {[-40, -10, 22, 50].map((x, i) => (
          <g key={x} style={nth(i)}>
            <circle cx={x} cy={-130} r="12" fill="#ffd60a" stroke="#e09f3e" strokeWidth="3" />
            <path d={`M${x} -136 V-124`} stroke="#e09f3e" strokeWidth="3" strokeLinecap="round" />
          </g>
        ))}
      </g>
    </>
  );
}

const CRAB = "#e63946";

/** Red crab; it scuttles sideways and snaps its claws. */
export function Krabbe() {
  return (
    <>
      <Sand xs={[-54, -20, 20, 54]} y={-4} r={8} className="uw-krabbe-sand" />
      <g className="uw-krabbe-body">
        <path
          className="uw-krabbe-legs"
          d="M-30 -26 L-56 -14 L-62 0 M-28 -18 L-48 -4 L-50 4 M-34 -32 L-62 -28 L-72 -16 M30 -26 L56 -14 L62 0 M28 -18 L48 -4 L50 4 M34 -32 L62 -28 L72 -16"
          stroke="#c1121f"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {([-1, 1] as const).map((dir) => (
          <g key={dir} className="uw-krabbe-claw" style={{ ...side(dir), transformOrigin: `${dir * 34}px -42px` }}>
            <path d={`M${dir * 34} -42 Q${dir * 56} -56 ${dir * 58} -74`} stroke={CRAB} strokeWidth="9" fill="none" strokeLinecap="round" />
            <path d={`M${dir * 58} -76 Q${dir * 76} -78 ${dir * 76} -92 Q${dir * 70} -106 ${dir * 56} -100 Q${dir * 62} -92 ${dir * 58} -84 Z`} fill={CRAB} />
            <g className="uw-krabbe-pincer" style={{ transformOrigin: `${dir * 58}px -78px` }}>
              <path d={`M${dir * 58} -78 Q${dir * 44} -82 ${dir * 44} -96 Q${dir * 50} -94 ${dir * 56} -88 Z`} fill={CRAB} />
            </g>
          </g>
        ))}
        <ellipse cx="0" cy="-34" rx="40" ry="24" fill={CRAB} />
        <path d="M-24 -48 Q-6 -58 16 -54" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.4" />
        {([-12, 12] as const).map((x, i) => (
          <g key={x} className="uw-krabbe-eye" style={{ ...nth(i), transformOrigin: `${x}px -54px` }}>
            <path d={`M${x} -54 V-70`} stroke={CRAB} strokeWidth="6" strokeLinecap="round" />
            <circle cx={x} cy="-74" r="7" fill="#fff" />
            <Eye cx={x} cy={-74} r={3.6} />
            <Lid cx={x} cy={-74} r={3.6} fill="#fff" />
          </g>
        ))}
        <circle cx="-20" cy="-30" r="5" fill={CHEEK} opacity="0.6" />
        <circle cx="20" cy="-30" r="5" fill={CHEEK} opacity="0.6" />
        <path d="M-10 -34 Q0 -26 10 -34" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <Bubbles x={-30} y={-64} count={3} size={5} delay={0.4} />
      </g>
    </>
  );
}

/** A five-armed star with round tips around (0, -48). */
const STAR = Array.from({ length: 10 }, (_, i) => {
  const r = i % 2 ? 20 : 44;
  const a = -Math.PI / 2 + (i * Math.PI) / 5;
  return `${(Math.cos(a) * r).toFixed(1)} ${(-48 + Math.sin(a) * r).toFixed(1)}`;
}).join(" L");

/** Orange starfish standing on two arms; it hops and spins around. */
export function Seestern() {
  return (
    <>
      <Sand xs={[-30, 0, 30]} y={-4} r={9} className="uw-seestern-sand" />
      <g className="uw-seestern-body" style={{ transformOrigin: "0px -48px" }}>
        <path d={`M${STAR} Z`} fill="#f9844a" stroke="#f9844a" strokeWidth="14" strokeLinejoin="round" />
        {[
          [0, -78],
          [-26, -58],
          [26, -58],
          [-16, -24],
          [16, -24],
        ].map(([x, y]) => (
          <circle key={`${x}${y}`} className="uw-seestern-dot" cx={x} cy={y} r="3.5" fill="#ffd8a8" />
        ))}
        <Face cx={0} cy={-50} size={0.9} />
        <Lid cx={-6.3} cy={-50} r={2.9} fill="#f9844a" />
        <Lid cx={6.3} cy={-50} r={2.9} fill="#f9844a" />
      </g>
      <Heart x={40} y={-96} size={0.6} delay={0.7} />
    </>
  );
}

/** Pink clam; it opens and shows its shiny pearl. */
export function Muschel() {
  return (
    <>
      <path d="M-62 -20 Q-58 0 0 0 Q58 0 62 -20 Z" fill="#f4acb7" />
      <path d="M-40 -8 H40" stroke="#e5989b" strokeWidth="3" strokeLinecap="round" />
      <g className="uw-muschel-pearl">
        <circle cx="0" cy="-30" r="12" fill="#fff" />
        <circle cx="-4" cy="-34" r="4" fill="#e7f5ff" />
      </g>
      <g className="uw-muschel-lid" style={{ transformOrigin: "0px -20px" }}>
        <path d="M-62 -20 Q-62 -78 0 -80 Q62 -78 62 -20 Q30 -12 0 -16 Q-30 -12 -62 -20 Z" fill="#ffc8dd" />
        <path d="M0 -18 L-42 -62 M0 -18 L-20 -76 M0 -18 V-80 M0 -18 L20 -76 M0 -18 L42 -62" stroke="#f4acb7" strokeWidth="4" strokeLinecap="round" />
        <path d="M-40 -60 Q-26 -76 -6 -78" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.5" />
      </g>
      <g className="uw-muschel-sparkle" fill="#fff">
        <path d="M24 -64 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z" />
      </g>
      <g className="uw-muschel-sparkles">
        <Sparkle x={-30} y={-48} r={7} i={0} />
        <Sparkle x={8} y={-60} r={6} i={1} />
      </g>
      <Bubbles x={-10} y={-40} count={3} size={5} delay={0.4} />
      <Sand xs={[-56, 56]} y={-4} r={8} className="uw-muschel-sand" />
    </>
  );
}

/** Green bottle with a letter inside, half in the sand; the cork pops and a heart flies out. */
export function Flaschenpost() {
  return (
    <>
      <path className="uw-flasche-heart" d="M80 -78 c-10 -14 -30 -4 -20 12 l20 18 l20 -18 c10 -16 -10 -26 -20 -12 Z" fill="#ff6b8b" />
      <g transform="rotate(-12)">
        <g className="uw-flasche-bottle" style={{ transformOrigin: "-10px -2px" }}>
          <g className="uw-flasche-letter">
            <rect x="-48" y="-36" width="74" height="24" rx="10" fill="#fff8e1" />
            <path d="M-10 -36 V-12" stroke="#e63946" strokeWidth="4" />
          </g>
          <rect x="-70" y="-46" width="112" height="46" rx="20" fill="#74c69d" opacity="0.75" />
          <path d="M38 -38 Q56 -36 62 -30 H82 V-16 H62 Q56 -10 38 -8 Z" fill="#74c69d" opacity="0.85" />
          <g className="uw-flasche-cork" style={{ transformOrigin: "90px -23px" }}>
            <rect x="80" y="-31" width="18" height="16" rx="4" fill="#d4a373" />
          </g>
          <path d="M-56 -38 H20" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
          <Bubbles x={96} y={-30} count={3} size={5} delay={0.4} />
        </g>
      </g>
      <Sand xs={[-60, 0, 60]} y={-2} r={9} className="uw-flasche-sand" />
      <path d="M-86 4 Q-60 -14 -30 -6 Q0 -16 30 -6 Q60 -12 86 4 Z" fill="#f0d39a" />
    </>
  );
}

const LOBSTER = "#d62828";

/** Red lobster facing left; it lifts and snaps its big claws and flips its tail. */
export function Hummer() {
  return (
    <g className="uw-hummer-body">
      <path className="uw-hummer-antenna" d="M-54 -38 Q-96 -76 -70 -118" stroke={LOBSTER} strokeWidth="3" fill="none" strokeLinecap="round" style={{ transformOrigin: "-54px -38px" }} />
      <path className="uw-hummer-antenna uw-hummer-antenna-2" d="M-48 -40 Q-74 -90 -40 -116" stroke={LOBSTER} strokeWidth="3" fill="none" strokeLinecap="round" style={{ transformOrigin: "-48px -40px" }} />
      <path className="uw-hummer-legs" d="M-20 -14 L-30 0 M0 -12 L-4 0 M20 -12 L22 0 M38 -14 L44 0" stroke="#9d0208" strokeWidth="5" strokeLinecap="round" />
      <g className="uw-hummer-tail" style={{ transformOrigin: "40px -24px" }}>
        <ellipse cx="50" cy="-24" rx="18" ry="15" fill={LOBSTER} />
        <ellipse cx="74" cy="-22" rx="15" ry="12" fill="#e63946" />
        <ellipse cx="94" cy="-20" rx="12" ry="10" fill={LOBSTER} />
        <path d="M104 -20 L126 -36 Q132 -20 126 -4 Z" fill="#e63946" />
      </g>
      <ellipse cx="-4" cy="-28" rx="42" ry="20" fill={LOBSTER} />
      <path d="M-36 -40 Q-10 -50 22 -44" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.35" />
      {[0, 1].map((i) => (
        <g key={i} className="uw-hummer-claw" style={{ ...nth(i), transformOrigin: "-36px -30px" }}>
          <path d={`M-36 -30 Q-60 ${-40 - i * 14} -78 ${-54 - i * 22}`} stroke={LOBSTER} strokeWidth="10" fill="none" strokeLinecap="round" />
          <ellipse cx={-96} cy={-62 - i * 22} rx="22" ry="13" fill={LOBSTER} transform={`rotate(-20 -96 ${-62 - i * 22})`} />
          <g className="uw-hummer-pincer" style={{ transformOrigin: `-84px ${-70 - i * 22}px` }}>
            <path d={`M-84 ${-70 - i * 22} Q-104 ${-90 - i * 22} -122 ${-82 - i * 22} Q-110 ${-76 - i * 22} -90 ${-66 - i * 22} Z`} fill="#e63946" />
          </g>
        </g>
      ))}
      <circle cx="-44" cy="-48" r="7" fill="#fff" />
      <Eye cx={-45} cy={-48} r={3.8} />
      <Lid cx={-45} cy={-48} r={3.8} fill="#fff" />
      <circle cx="-34" cy="-26" r="5" fill={CHEEK} opacity="0.6" />
      <path d="M-48 -24 Q-42 -18 -36 -22" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <Bubbles x={-60} y={-30} count={3} size={5} delay={0.4} />
    </g>
  );
}

/** Sea snail on its stone; it pulls into its shell and peeks out again. */
export function Schnecke() {
  return (
    <>
      <g className="uw-schnecke-body" style={{ transformOrigin: "10px -46px" }}>
        <path d="M-56 -40 Q-60 -64 -46 -66 Q-36 -66 -34 -54 L40 -54 Q50 -48 44 -40 Z" fill="#ffd6a5" />
        <g className="uw-schnecke-stalks" style={{ transformOrigin: "-46px -64px" }}>
          <path d="M-50 -64 L-58 -88 M-42 -64 L-40 -90" stroke="#ffd6a5" strokeWidth="5" strokeLinecap="round" />
          <Eye cx={-58} cy={-90} r={3.6} />
          <Eye cx={-40} cy={-92} r={3.6} />
          <Lid cx={-58} cy={-90} r={3.6} fill="#ffd6a5" />
          <Lid cx={-40} cy={-92} r={3.6} fill="#ffd6a5" />
        </g>
        <path d="M-54 -52 Q-50 -48 -45 -51" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
      <g className="uw-schnecke-shell" style={{ transformOrigin: "8px -46px" }}>
        <circle cx="8" cy="-76" r="30" fill="#c77dff" />
        <path d="M8 -76 a6 6 0 1 1 6 6 a12 12 0 1 1 -12 -12 a18 18 0 1 1 18 18" stroke="#9d4edd" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M-14 -94 Q-2 -104 12 -104" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.5" />
      </g>
      <Bubbles x={24} y={-108} count={3} size={5} delay={0.4} />
    </>
  );
}

/** Purple sea urchin; it wiggles its spines and hops. */
export function Seeigel() {
  return (
    <>
      <Sand xs={[-34, 0, 34]} y={-4} r={8} className="uw-seeigel-sand" />
      <g className="uw-seeigel-body" style={{ transformOrigin: "0px 0px" }}>
        <g className="uw-seeigel-spines" stroke="#7b2cbf" strokeWidth="5" strokeLinecap="round" style={{ transformOrigin: "0px -38px" }}>
          {Array.from({ length: 18 }, (_, i) => {
            const a = Math.PI + (i * Math.PI) / 17;
            return <line key={i} x1={Math.cos(a) * 28} y1={-38 + Math.sin(a) * 28} x2={Math.cos(a) * 56} y2={-38 + Math.sin(a) * 56} />;
          })}
        </g>
        <ellipse cx="0" cy="-30" rx="38" ry="30" fill="#9d4edd" />
        <path d="M-24 -46 Q-10 -56 8 -54" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.4" />
        <Face cx={0} cy={-32} size={0.9} />
        <Lid cx={-6.3} cy={-32} r={2.9} fill="#9d4edd" />
        <Lid cx={6.3} cy={-32} r={2.9} fill="#9d4edd" />
      </g>
      <Heart x={44} y={-92} size={0.6} delay={0.7} />
    </>
  );
}

/** Flat fish hidden in the sand; it jumps up, shakes the sand off and settles again. */
export function Flunder() {
  return (
    <>
      <g className="uw-flunder-sand" fill="#e9c98a">
        {[-60, -20, 20, 60].map((x, i) => (
          <circle key={x} cx={x} cy={-6} r="12" style={nth(i)} />
        ))}
      </g>
      <g className="uw-flunder-body" style={{ transformOrigin: "0px -12px" }}>
        <ellipse cx="0" cy="-12" rx="78" ry="22" fill="#c9a26b" />
        <ellipse cx="0" cy="-12" rx="64" ry="16" fill="#ddb67d" />
        <path className="uw-flunder-tail" d="M62 -12 L90 -28 L84 -12 L90 4 Z" fill="#c9a26b" style={{ transformOrigin: "64px -12px" }} />
        {[
          [10, -16],
          [30, -8],
          [-6, -6],
          [40, -20],
        ].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r="4" fill="#b08968" opacity="0.6" />
        ))}
        <circle cx="-36" cy="-26" r="8" fill="#fff" />
        <circle cx="-16" cy="-30" r="8" fill="#fff" />
        <Eye cx={-37} cy={-26} r={4.2} />
        <Eye cx={-17} cy={-30} r={4.2} />
        <Lid cx={-37} cy={-26} r={4.2} fill="#fff" />
        <Lid cx={-17} cy={-30} r={4.2} fill="#fff" />
        <Bubbles x={-64} y={-24} count={3} size={5} delay={0.4} />
        <path d="M-60 -8 q6 5 12 0" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </g>
      <path d="M-92 2 Q-60 -8 -20 -2 Q20 -10 60 -2 Q80 -6 98 2 Z" fill="#f3d69f" />
    </>
  );
}
