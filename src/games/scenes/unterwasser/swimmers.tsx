import { CHEEK, Eye, Face, GLASS, INK, Inside, Rider, SKIN, nth } from "../shared";
import { Bubbles, Heart, Lid, Lines, Sparkle } from "./parts";

// Everything that swims in the open water. Each drawing has its origin in its middle and is
// placed with `swim`; all face left.

/** A small fish facing left, about 70 × 40 units around (0, 0). */
function Fish({ body, fin, belly, tailClass, blink }: { body: string; fin: string; belly: string; tailClass?: string; blink?: boolean }) {
  return (
    <>
      <path className={tailClass} d="M20 0 L42 -17 L37 0 L42 17 Z" fill={fin} style={tailClass ? { transformOrigin: "20px 0px" } : undefined} />
      <path className="uw-fish-fin" d="M-10 -12 Q2 -26 16 -10 Z" fill={fin} style={{ transformOrigin: "3px -11px" }} />
      <ellipse cx="0" cy="0" rx="27" ry="15" fill={body} />
      <path d="M-20 6 Q0 15 22 4" stroke={belly} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M2 -9 Q8 0 2 9" stroke={fin} strokeWidth="3" fill="none" strokeLinecap="round" />
      <Eye cx={-15} cy={-3} r={3.6} />
      {blink && <Lid cx={-15} cy={-3} r={3.6} fill={body} />}
      <path d="M-26 4 Q-23 7 -19 5" stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </>
  );
}

/** Big blue whale; it bobs, flaps its tail and blows a fountain up through the surface. */
export function Wal() {
  return (
    <>
      <g className="uw-wal-spout" fill="#e7f5ff">
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={-60 + (i % 2 ? 10 : -10)} cy={-96 - i * 22} r={13 - i} style={nth(i)} />
        ))}
      </g>
      <g className="uw-wal-body">
        <g className="uw-wal-tail" style={{ transformOrigin: "150px -6px" }}>
          <path d="M140 -20 Q186 -26 206 -72 Q218 -40 252 -40 Q220 -8 232 32 Q198 10 140 12 Z" fill="#3a6fd8" />
        </g>
        <path d="M-202 0 Q-202 -82 -100 -82 Q40 -86 152 -20 Q164 0 152 12 Q40 72 -100 72 Q-202 72 -202 0 Z" fill="#4895ef" />
        <path d="M-198 16 Q-150 68 -60 68 Q60 64 142 12 Q40 42 -80 38 Q-160 36 -198 16 Z" fill="#c8e7ff" />
        <path d="M-150 46 H0 M-126 56 H-14" stroke="#a8d0f0" strokeWidth="3" strokeLinecap="round" />
        <path d="M-162 -50 Q-112 -78 -40 -76" stroke="#fff" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.45" />
        <g className="uw-wal-flipper" style={{ transformOrigin: "-60px 30px" }}>
          <path d="M-60 30 Q-40 70 0 88 Q-10 50 -30 28 Z" fill="#3a6fd8" />
        </g>
        <ellipse cx="-60" cy="-80" rx="9" ry="3" fill="#3a6fd8" />
        <Eye cx={-140} cy={-12} r={6.5} />
        <Lid cx={-140} cy={-12} r={6.5} fill="#4895ef" />
        <circle cx="-152" cy="8" r="9" fill={CHEEK} opacity="0.5" />
        <path d="M-198 14 Q-172 30 -132 22" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path className="uw-wal-mouth" d="M-196 16 Q-170 40 -134 24 Q-170 30 -196 16 Z" fill="#c9184a" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      {/* The whale sings: notes float out in front of its mouth. */}
      <g className="uw-wal-notes" fill="#fff">
        {[
          [-226, -6],
          [-250, -34],
        ].map(([x, y], i) => (
          <g key={x} style={nth(i)}>
            <ellipse cx={x} cy={y} rx="9" ry="7" />
            <path d={`M${x + 8} ${y} V${y - 30} l10 6`} stroke="#fff" strokeWidth="3.5" fill="none" />
          </g>
        ))}
      </g>
      <Bubbles x={-200} y={30} count={3} size={7} delay={0.9} />
    </>
  );
}

/** Dolphin just below the surface; it leaps out in an arc and splashes back in. */
export function Delfin() {
  return (
    <>
      <g className="uw-delfin-splash" fill="#e7f5ff">
        {[-30, -6, 18, 40].map((x, i) => (
          <circle key={x} cx={x} cy={-104 - (i % 2) * 10} r={9 - (i % 2) * 2} style={nth(i)} />
        ))}
      </g>
      <g className="uw-delfin-jump" style={{ transformOrigin: "0px 0px" }}>
        <g className="uw-delfin-tail" style={{ transformOrigin: "62px 0px" }}>
          <path d="M60 -4 Q88 -8 104 -34 Q108 -10 128 0 Q104 6 96 30 Q86 6 60 8 Z" fill="#5c7cfa" />
        </g>
        <path d="M-20 -42 Q-2 -74 22 -78 Q10 -56 16 -40 Z" fill="#5c7cfa" />
        <path d="M-112 4 Q-114 -6 -96 -10 Q-70 -44 -10 -44 Q50 -42 72 -4 Q50 26 -10 28 Q-60 28 -90 14 Q-112 14 -112 4 Z" fill="#748ffc" />
        <path d="M-96 12 Q-50 26 0 24 Q40 20 64 2 Q30 14 -10 14 Q-60 14 -96 12 Z" fill="#dbe4ff" />
        <path d="M-60 -30 Q-30 -42 10 -40" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.4" />
        <path className="uw-delfin-flipper" d="M-30 18 Q-24 40 -6 46 Q-6 28 -14 16 Z" fill="#5c7cfa" style={{ transformOrigin: "-22px 17px" }} />
        <Eye cx={-70} cy={-14} r={4.6} />
        <Lid cx={-70} cy={-14} r={4.6} fill="#748ffc" />
        <circle cx="-78" cy="0" r="5" fill={CHEEK} opacity="0.5" />
        <path d="M-108 6 Q-94 14 -78 8" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <Lines x={-118} y={2} size={0.8} delay={0.3} />
      </g>
    </>
  );
}

/** Manta ray seen from the front; it beats its wide wings and glides. */
export function Rochen() {
  return (
    <g className="uw-rochen-body">
      <g className="uw-rochen-wing" style={{ transformOrigin: "-30px -4px" }}>
        <path d="M-30 -26 Q-82 -28 -112 -4 Q-130 12 -138 32 Q-102 14 -62 16 Q-42 18 -30 22 Z" fill="#4d6a85" />
        <path d="M-130 26 Q-100 12 -62 14" stroke="#dee2e6" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
      <g className="uw-rochen-wing uw-rochen-wing-right" style={{ transformOrigin: "30px -4px" }}>
        <path d="M30 -26 Q82 -28 112 -4 Q130 12 138 32 Q102 14 62 16 Q42 18 30 22 Z" fill="#4d6a85" />
        <path d="M130 26 Q100 12 62 14" stroke="#dee2e6" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
      <ellipse cx="0" cy="-2" rx="44" ry="28" fill="#577590" />
      <path d="M-26 -18 Q-6 -28 18 -24" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.4" />
      {[
        [-16, -10],
        [14, -14],
        [2, -20],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="3.5" fill="#fff" opacity="0.6" />
      ))}
      <path className="uw-rochen-horn" d="M-24 14 q-8 14 -2 26 q8 -4 8 -20 Z" fill="#4d6a85" style={{ transformOrigin: "-20px 14px" }} />
      <path className="uw-rochen-horn uw-rochen-horn-right" d="M24 14 q8 14 2 26 q-8 -4 -8 -20 Z" fill="#4d6a85" style={{ transformOrigin: "20px 14px" }} />
      <path d="M-12 18 Q0 26 12 18" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      <Eye cx={-30} cy={2} r={4.4} />
      <Eye cx={30} cy={2} r={4.4} />
      <Lid cx={-30} cy={2} r={4.4} fill="#577590" />
      <Lid cx={30} cy={2} r={4.4} fill="#577590" />
      <g className="uw-rochen-spots">
        {[
          [-16, -10],
          [14, -14],
          [2, -20],
        ].map(([x, y], i) => (
          <Sparkle key={x} x={x} y={y} r={7} i={i} />
        ))}
      </g>
      <Bubbles x={0} y={-30} count={3} size={6} delay={0.5} />
    </g>
  );
}

/** Where the fish of the school swim, around the school's middle. */
const SCHOOL = [
  [-110, -32],
  [-58, -52],
  [-8, -22],
  [44, -48],
  [96, -22],
  [-84, 22],
  [-30, 34],
  [22, 12],
  [78, 32],
];

/** A school of little orange fish; they swirl around together. */
export function Fischschwarm() {
  return (
    <>
      <Bubbles x={-130} y={-50} count={3} size={6} delay={0.4} />
      <Bubbles x={110} y={-50} count={3} size={5} delay={0.6} />
      {SCHOOL.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <g className="uw-schwarm-fish" style={nth(i)}>
            <Fish body={i % 3 ? "#f8961e" : "#f9c74f"} fin="#f3722c" belly="#ffd8a8" tailClass="uw-schwarm-tail" blink={i % 2 === 0} />
          </g>
        </g>
      ))}
    </>
  );
}

/** Pink jellyfish; it pulses up and sinks down again. */
export function Qualle() {
  return (
    <g className="uw-qualle-body">
      <g className="uw-qualle-tentacles" stroke="#f9a8d4" strokeWidth="6" fill="none" strokeLinecap="round">
        {[-32, -12, 8, 28].map((x, i) => (
          <path key={x} d={`M${x} -6 q-10 20 0 40 q10 20 0 40`} style={{ ...nth(i), transformOrigin: `${x}px -6px` }} />
        ))}
      </g>
      <ellipse className="uw-qualle-glow" cx="0" cy="-36" rx="70" ry="56" fill="#ffdeeb" />
      <g className="uw-qualle-bell" style={{ transformOrigin: "0px -4px" }}>
        <path d="M-52 -4 Q-52 -74 0 -74 Q52 -74 52 -4 Q40 4 26 -4 Q13 4 0 -4 Q-13 4 -26 -4 Q-40 4 -52 -4 Z" fill="#f783ac" />
        <path d="M-50 -8 Q0 4 50 -8" stroke="#e64980" strokeWidth="3" fill="none" opacity="0.5" />
        <path d="M-36 -40 Q-30 -62 -8 -66" stroke="#fff" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.5" />
        <Face cx={0} cy={-34} size={1.1} />
        <Lid cx={-7.7} cy={-34} r={3.5} fill="#f783ac" />
        <Lid cx={7.7} cy={-34} r={3.5} fill="#f783ac" />
      </g>
      <Heart x={44} y={-80} size={0.8} delay={0.6} />
      <Bubbles x={-40} y={-80} count={3} size={5} delay={0.3} />
    </g>
  );
}

/** Green sea turtle; it paddles with its flippers and swims a bit forward. */
export function Meeresschildkroete() {
  return (
    <g className="uw-turtle-body">
      <g className="uw-turtle-flipper-back" style={{ transformOrigin: "52px 12px" }}>
        <path d="M50 12 Q80 30 98 22 Q86 4 56 2 Z" fill="#74c69d" />
      </g>
      <g className="uw-turtle-flipper uw-turtle-flipper-far" style={{ transformOrigin: "-40px -8px" }}>
        <path d="M-40 -8 Q-62 -44 -32 -62 Q-26 -34 -24 -10 Z" fill="#52b788" />
      </g>
      <g className="uw-turtle-head" style={{ transformOrigin: "-62px 4px" }}>
        <path d="M-64 -2 Q-90 -16 -102 -2 Q-110 16 -90 20 Q-74 20 -60 10 Z" fill="#95d5b2" />
        <Eye cx={-92} cy={-2} r={3.8} />
        <Lid cx={-92} cy={-2} r={3.8} fill="#95d5b2" />
        <circle cx="-86" cy="10" r="4.5" fill={CHEEK} opacity="0.5" />
        <path d="M-106 8 Q-100 13 -93 11" stroke={INK} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </g>
      <path d="M-70 10 Q-66 -52 0 -54 Q66 -52 72 10 Z" fill="#40916c" />
      <path d="M-72 10 Q0 30 74 10 Q60 22 0 26 Q-60 22 -72 10 Z" fill="#b7e4c7" />
      <path
        d="M-30 -48 L-20 -20 H20 L30 -48 M-20 -20 L-46 6 M20 -20 L46 6 M-20 -20 L-8 10 M20 -20 L8 10"
        stroke="#2d6a4f"
        strokeWidth="4"
        fill="none"
        strokeLinejoin="round"
      />
      <path d="M-48 -28 Q-32 -48 -8 -50" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.35" />
      <g className="uw-turtle-flipper" style={{ transformOrigin: "-34px 12px" }}>
        <path d="M-34 12 Q-70 30 -86 56 Q-50 52 -20 20 Z" fill="#95d5b2" />
      </g>
      <Heart x={-100} y={-34} size={0.7} delay={0.8} />
      <Bubbles x={-110} y={-10} count={3} size={5} delay={0.3} />
    </g>
  );
}

/** Yellow seahorse by the seagrass; it bobs up and down and wiggles its fin. */
export function Seepferdchen() {
  return (
    <g className="uw-seepferd-body" style={{ transformOrigin: "0px 0px" }}>
      <g className="uw-seepferd-fin" style={{ transformOrigin: "20px -8px" }}>
        <path d="M18 -26 Q42 -22 40 4 Q28 -2 18 2 Z" fill="#ffe8a3" />
      </g>
      <path className="uw-seepferd-tail" d="M6 24 Q16 50 4 66 Q-10 80 -22 70 Q-30 58 -18 52 Q-8 50 -8 58" stroke="#ffc300" strokeWidth="14" strokeLinecap="round" fill="none" style={{ transformOrigin: "6px 24px" }} />
      <path d="M-14 -42 Q-28 -10 -16 14 Q-6 34 10 28 Q26 18 22 -10 Q20 -36 4 -50 Z" fill="#ffd60a" />
      <path d="M-20 -16 q8 4 16 0 M-19 -2 q8 4 18 0 M-14 12 q8 4 16 -2" stroke="#ffb703" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M-12 -63 L-38 -60 Q-43 -54 -38 -48 L-12 -46 Z" fill="#ffd60a" />
      <circle cx="0" cy="-58" r="18" fill="#ffd60a" />
      <path className="uw-seepferd-crown" d="M-5 -73 l4 -12 l5 10 l5 -8 l3 12 Z" fill="#ffb703" style={{ transformOrigin: "1px -73px" }} />
      <path d="M8 -66 Q14 -56 10 -46" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.5" />
      <Eye cx={-3} cy={-60} r={4.2} />
      <Lid cx={-3} cy={-60} r={4.2} fill="#ffd60a" />
      <circle cx="-6" cy="-49" r="4.5" fill={CHEEK} opacity="0.55" />
      <Bubbles x={-44} y={-62} count={3} size={5} delay={0.3} />
    </g>
  );
}

const porthole = (cx: number) => `M${cx - 17} -4 a17 17 0 1 0 34 0 a17 17 0 1 0 -34 0 Z`;

/** Yellow submarine with the captain at the front window; its periscope goes up and it pings. */
export function UBoot() {
  return (
    <>
      <g className="uw-uboot-pings" stroke="#e7f5ff" strokeWidth="5" fill="none" strokeLinecap="round">
        {[0, 1, 2].map((i) => (
          <path key={i} d="M-176 -30 Q-194 0 -176 30" style={nth(i)} />
        ))}
      </g>
      <Bubbles x={200} y={-10} count={4} size={6} delay={0.4} />
      <g className="uw-uboot-body">
        {/* A sailor climbs up out of the hatch; behind the tower until then. */}
        <g className="uw-uboot-sailor">
          <rect x="-4" y="-104" width="24" height="18" rx="7" fill="#3a86ff" />
          <circle cx="8" cy="-110" r="12" fill={SKIN} />
          <path d="M-4 -114 Q8 -128 20 -114 Z" fill="#fff" />
          <circle cx="4" cy="-109" r="1.8" fill="#2b2d42" />
          <circle cx="12" cy="-109" r="1.8" fill="#2b2d42" />
          <path d="M4 -104 Q8 -101 12 -104" stroke="#2b2d42" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <g className="uw-uboot-sailor-arm" style={{ transformOrigin: "20px -96px" }}>
            <path d="M20 -96 L32 -116" stroke="#3a86ff" strokeWidth="7" strokeLinecap="round" />
            <circle cx="33" cy="-119" r="4.5" fill={SKIN} />
          </g>
        </g>
        <g className="uw-uboot-periscope">
          <path d="M18 -44 V-118 H-4" stroke="#adb5bd" strokeWidth="9" fill="none" strokeLinejoin="round" />
          <rect x="-14" y="-125" width="14" height="14" rx="3" fill="#868e96" />
        </g>
        <path d="M-40 -40 L-30 -84 H44 L52 -40 Z" fill="#ffc300" />
        <rect x="-34" y="-90" width="74" height="10" rx="5" fill="#ffb703" />
        <rect className="uw-uboot-hatch" x="-6" y="-96" width="28" height="8" rx="4" fill="#f77f00" style={{ transformOrigin: "-6px -92px" }} />
        <path d="M150 -10 L184 -36 V36 L150 10 Z" fill="#f77f00" />
        <g className="uw-uboot-prop" style={{ transformOrigin: "192px 0px" }}>
          <ellipse cx="192" cy="-14" rx="7" ry="16" fill="#adb5bd" />
          <ellipse cx="192" cy="14" rx="7" ry="16" fill="#868e96" />
          <circle cx="192" cy="0" r="6" fill="#495057" />
        </g>
        <rect x="-160" y="-46" width="320" height="92" rx="46" fill="#ffd60a" />
        <path d="M-152 18 Q0 58 152 18 Q142 46 112 46 H-112 Q-142 46 -152 18 Z" fill="#ffb703" />
        <path d="M-120 -34 H80" stroke="#fff" strokeWidth="8" opacity="0.5" strokeLinecap="round" />
        {[-90, -30, 30, 90].map((cx, i) => (
          <g key={cx}>
            <circle cx={cx} cy={-4} r="22" fill="#adb5bd" />
            <path d={porthole(cx)} fill={GLASS} />
            {i === 0 ? (
              <Inside d={porthole(cx)}>
                <g className="uw-uboot-captain">
                  <Rider cx={cx} cy={-6} shirt="#3a86ff" cap="#e63946" />
                </g>
              </Inside>
            ) : (
              <path className="uw-glow" d={porthole(cx)} fill="#ffe066" style={nth(i - 1)} />
            )}
            <path d={`M${cx - 9} ${-14} q6 -6 14 -6`} stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
          </g>
        ))}
      </g>
    </>
  );
}

/** Diver swimming with a yellow tank; waves, kicks the flippers and blows bubbles. */
export function Taucher() {
  return (
    <>
      <g className="uw-taucher-bubbles" fill="#e7f5ff" fillOpacity="0.6" stroke="#fff" strokeWidth="2.5">
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={-100 + (i % 2) * 10} cy={-14} r={6 + i * 1.5} style={nth(i)} />
        ))}
      </g>
      <Heart x={-60} y={-60} size={0.8} delay={1.0} />
      <g className="uw-taucher-body">
        <g className="uw-taucher-fin" style={{ transformOrigin: "44px -12px" }}>
          <path d="M40 -12 L94 -22" stroke="#14213d" strokeWidth="16" strokeLinecap="round" />
          <path d="M92 -26 L132 -46 Q140 -28 134 -12 L96 -14 Z" fill="#e85d04" />
        </g>
        <rect x="-44" y="-46" width="88" height="26" rx="13" fill="#ffd166" />
        <rect x="-52" y="-41" width="10" height="16" rx="3" fill="#adb5bd" />
        <path d="M-34 -40 H30" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
        <path d="M-50 -33 Q-84 -46 -96 -4" stroke="#495057" strokeWidth="4" fill="none" />
        <rect x="-66" y="-26" width="124" height="36" rx="18" fill="#1d3557" />
        <path d="M-50 -2 H42" stroke="#fca311" strokeWidth="5" strokeLinecap="round" />
        <g className="uw-taucher-fin uw-taucher-fin-near" style={{ transformOrigin: "44px 2px" }}>
          <path d="M40 0 L96 6" stroke="#1d3557" strokeWidth="18" strokeLinecap="round" />
          <path d="M94 0 L136 -8 Q142 12 134 28 L96 14 Z" fill="#fca311" />
        </g>
        <g className="uw-taucher-head" style={{ transformOrigin: "-74px -6px" }}>
          <circle cx="-80" cy="-12" r="20" fill={SKIN} />
          <path d="M-100 -14 Q-100 -40 -78 -38 Q-58 -36 -60 -12 Q-66 -26 -80 -28 Q-94 -28 -100 -14 Z" fill="#1d3557" />
          <circle cx="-94" cy="-15" r="2.8" fill="#2b2d42" />
          <circle cx="-82" cy="-15" r="2.8" fill="#2b2d42" />
          <Lid cx={-94} cy={-15} r={2.8} fill={SKIN} />
          <Lid cx={-82} cy={-15} r={2.8} fill={SKIN} />
          <rect x="-104" y="-25" width="32" height="20" rx="7" fill={GLASS} fillOpacity="0.5" stroke="#495057" strokeWidth="3" />
          <path d="M-98 -21 h6" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
          <circle cx="-84" cy="2" r="4.5" fill={CHEEK} opacity="0.5" />
          <circle cx="-98" cy="2" r="6" fill="#495057" />
        </g>
        <path className="uw-taucher-lamp" d="M-104 -24 L-170 -50 V2 Z" fill="#fff3b0" />
        <g className="uw-taucher-arm" style={{ transformOrigin: "-54px -6px" }}>
          <path d="M-54 -6 L-74 22" stroke="#1d3557" strokeWidth="12" strokeLinecap="round" />
          <circle cx="-76" cy="25" r="7" fill={SKIN} />
        </g>
      </g>
    </>
  );
}

/** Friendly grey shark; it wags its tail, swims a little loop and grins. */
export function Hai() {
  return (
    <g className="uw-hai-body">
      <g className="uw-hai-tail" style={{ transformOrigin: "98px -4px" }}>
        <path d="M96 -6 Q120 -20 140 -56 Q146 -20 132 -2 Q146 16 144 40 Q120 14 96 6 Z" fill="#6a8db5" />
      </g>
      <path className="uw-hai-fin" d="M-20 -36 Q0 -84 30 -88 Q20 -60 26 -34 Z" fill="#6a8db5" style={{ transformOrigin: "3px -35px" }} />
      <path d="M-132 4 Q-130 -36 -60 -40 Q40 -44 106 -6 Q40 40 -50 38 Q-122 36 -132 4 Z" fill="#8fa9c4" />
      <path d="M-128 12 Q-110 34 -50 36 Q30 34 92 4 Q20 20 -50 18 Q-100 18 -128 12 Z" fill="#eef3f8" />
      <path d="M-100 -28 Q-60 -40 0 -36" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.4" />
      <path className="uw-hai-gills" d="M-56 -14 q-4 10 0 20 M-46 -16 q-4 12 0 22 M-36 -16 q-4 12 0 22" stroke="#5b7ba3" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path className="uw-hai-pfin" d="M-40 20 Q-30 50 -6 60 Q-10 36 -20 20 Z" fill="#6a8db5" style={{ transformOrigin: "-30px 20px" }} />
      <circle cx="-94" cy="-10" r="9" fill="#fff" />
      <Eye cx={-95} cy={-10} r={5.6} />
      <Lid cx={-95} cy={-10} r={7} fill="#8fa9c4" />
      <circle cx="-102" cy="10" r="7" fill={CHEEK} opacity="0.5" />
      <path className="uw-hai-smile" d="M-128 10 Q-114 20 -94 14" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path className="uw-hai-grin" d="M-130 8 Q-112 32 -86 14 Q-108 20 -130 8 Z" fill="#c9184a" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <Bubbles x={-140} y={0} count={3} size={6} delay={0.6} />
    </g>
  );
}

/** Yellow pufferfish; it puffs up into a spiky ball and lets the air out again. */
export function Kugelfisch() {
  return (
    <g className="uw-kugel-body" style={{ transformOrigin: "0px 0px" }}>
      <g className="uw-kugel-spikes" stroke="#e09f3e" strokeWidth="5" strokeLinecap="round">
        {Array.from({ length: 14 }, (_, i) => {
          const a = (i * Math.PI * 2) / 14;
          return <line key={i} x1={Math.cos(a) * 36} y1={Math.sin(a) * 36} x2={Math.cos(a) * 52} y2={Math.sin(a) * 52} />;
        })}
      </g>
      <path className="uw-kugel-tail" d="M36 0 L58 -16 Q54 0 58 16 Z" fill="#f4a261" style={{ transformOrigin: "36px 0px" }} />
      <circle r="40" fill="#ffd166" />
      <path d="M-36 12 Q0 48 36 12 Q30 40 0 40 Q-30 40 -36 12 Z" fill="#fff3bf" />
      {[
        [6, -26],
        [20, -14],
        [-2, -12],
        [22, 6],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="3.5" fill="#e09f3e" opacity="0.55" />
      ))}
      <path d="M-20 -30 Q-8 -38 6 -36" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.5" />
      <path className="uw-kugel-fin" d="M6 6 Q22 10 20 26 Q10 20 6 6 Z" fill="#f4a261" style={{ transformOrigin: "6px 6px" }} />
      <Eye cx={-18} cy={-8} r={5.2} />
      <Lid cx={-18} cy={-8} r={5.2} fill="#ffd166" />
      <circle cx="-24" cy="10" r="5" fill={CHEEK} opacity="0.55" />
      <ellipse className="uw-kugel-mouth" cx="-39" cy="6" rx="4" ry="5" fill="#e76f51" />
      <Bubbles x={-50} y={-4} count={3} size={5} delay={0.6} />
    </g>
  );
}

/** A bigger fish of one colour, near the front; it wags its tail and swims to and fro. */
function BigFish({ body, fin, belly, prefix }: { body: string; fin: string; belly: string; prefix: string }) {
  return (
    <>
      <g className="uw-fish-bubbles" fill="#e7f5ff" fillOpacity="0.6" stroke="#fff" strokeWidth="1.5">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={-56 + i * 4} cy={-6 - i * 6} r={4 + i} style={nth(i)} />
        ))}
      </g>
      <g className={`uw-fish-swim ${prefix}-swim`}>
        <g transform="scale(1.7)">
          <Fish body={body} fin={fin} belly={belly} tailClass="uw-fish-tail" blink />
          <Heart x={-30} y={-26} size={0.45} delay={0.7} />
        </g>
      </g>
    </>
  );
}

export function BlauerFisch() {
  return <BigFish body="#4dabf7" fin="#1c7ed6" belly="#a5d8ff" prefix="uw-blau" />;
}

export function GruenerFisch() {
  return <BigFish body="#69db7c" fin="#2f9e44" belly="#d3f9d8" prefix="uw-gruen" />;
}
