import { CHEEK, Eye, INK, nth } from "../shared";
import { Dust, Lid, Sparkles, heartPath, starPath } from "./parts";

// Who lives on the moon: the green alien, the alien baby, the space flower, the moon rabbit and
// the mouse in the cheese. Each drawing has its foot point at (0, 0) and is placed with `ground`.

const ALIEN = "#69db7c";
const ALIEN_LIGHT = "#8ce99a";
const ALIEN_DARK = "#40c057";

/** The friendly green alien: it jumps, waves, wiggles its antennae and blinks its big eyes. */
export function Ausserirdischer() {
  return (
    <>
      <g className="wa-alien-pop">
        <path d={starPath(58, -190, 14)} fill="#ffd60a" />
        <path d={starPath(-58, -176, 10)} fill="#fff3bf" />
      </g>
      <g className="wa-alien-body">
        <ellipse cx="-18" cy="-6" rx="16" ry="8" fill={ALIEN_DARK} />
        <ellipse cx="18" cy="-6" rx="16" ry="8" fill={ALIEN_DARK} />
        <rect x="-24" y="-36" width="12" height="30" rx="6" fill={ALIEN} />
        <rect x="12" y="-36" width="12" height="30" rx="6" fill={ALIEN} />
        <g className="wa-alien-arm" style={{ transformOrigin: "-30px -76px" }}>
          <path d="M-30 -76 Q-52 -66 -54 -44" stroke={ALIEN} strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M-60 -42 l-4 8 M-54 -40 l0 9 M-48 -42 l4 8" stroke={ALIEN} strokeWidth="5" strokeLinecap="round" />
        </g>
        <g className="wa-alien-wave" style={{ transformOrigin: "30px -76px" }}>
          <path d="M30 -76 Q50 -88 54 -112" stroke={ALIEN} strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M48 -118 l-4 -8 M54 -120 l0 -9 M60 -118 l4 -8" stroke={ALIEN} strokeWidth="5" strokeLinecap="round" />
        </g>
        <ellipse cx="0" cy="-60" rx="34" ry="34" fill={ALIEN} />
        <ellipse cx="0" cy="-52" rx="20" ry="18" fill={ALIEN_LIGHT} />
        <path d={starPath(0, -54, 9)} fill="#ffd60a" />
        <g className="wa-alien-head" style={{ transformOrigin: "0px -92px" }}>
          {[-1, 1].map((s, i) => (
            <g key={s} className="wa-alien-ant" style={{ transformOrigin: `${s * 12}px -148px`, ...nth(i) }}>
              <path d={`M${s * 12} -148 Q${s * 18} -166 ${s * 30} -174`} stroke={ALIEN_DARK} strokeWidth="4" fill="none" strokeLinecap="round" />
              <circle cx={s * 31} cy="-176" r="7" fill="#ffd60a" />
            </g>
          ))}
          <ellipse cx="0" cy="-122" rx="42" ry="34" fill={ALIEN_LIGHT} />
          <path d="M-40 -112 Q0 -80 40 -112 Q36 -92 0 -88 Q-36 -92 -40 -112 Z" fill={ALIEN} opacity="0.6" />
          <path d="M-28 -146 Q-12 -156 8 -154" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.5" />
          {[-15, 15].map((x) => (
            <g key={x}>
              <ellipse cx={x} cy="-126" rx="11" ry="13" fill="#fff" />
              <circle cx={x + 2} cy="-124" r="6" fill="#2b2d42" />
              <circle cx={x + 4} cy="-127" r="2" fill="#fff" />
              <Lid cx={x} cy={-126} r={10} fill={ALIEN_LIGHT} />
            </g>
          ))}
          <circle cx="-30" cy="-106" r="6" fill={CHEEK} opacity="0.5" />
          <circle cx="30" cy="-106" r="6" fill={CHEEK} opacity="0.5" />
          <path d="M-10 -104 Q0 -94 10 -104" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      </g>
    </>
  );
}

/** The little purple alien baby: it bounces, shakes its rattle, blinks and sends hearts. */
export function AlienBaby() {
  return (
    <>
      <g className="wa-baby-hearts" fill="#ff8fa3">
        {[
          [-34, -98],
          [0, -116],
          [34, -98],
        ].map(([x, y], i) => (
          <path key={i} d={heartPath(x, y, 8)} style={nth(i)} />
        ))}
      </g>
      <g className="wa-baby-body" style={{ transformOrigin: "0px 0px" }}>
        <ellipse cx="-14" cy="-5" rx="12" ry="6" fill="#9775fa" />
        <ellipse cx="14" cy="-5" rx="12" ry="6" fill="#9775fa" />
        <g className="wa-baby-ant" style={{ transformOrigin: "0px -62px" }}>
          <path d="M0 -62 Q6 -72 0 -82" stroke="#9775fa" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d={heartPath(0, -86, 6)} fill="#ff8fa3" />
        </g>
        <ellipse cx="0" cy="-34" rx="32" ry="30" fill="#b197fc" />
        <ellipse cx="0" cy="-22" rx="18" ry="12" fill="#d0bfff" />
        <path d="M-22 -50 Q-10 -60 6 -60" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.5" />
        {[-11, 11].map((x) => (
          <g key={x}>
            <circle cx={x} cy="-40" r="7" fill="#fff" />
            <circle cx={x + 1} cy="-39" r="4" fill="#2b2d42" />
            <circle cx={x + 2.4} cy="-41" r="1.4" fill="#fff" />
            <Lid cx={x} cy={-40} r={6.2} fill="#b197fc" />
          </g>
        ))}
        <circle cx="-20" cy="-28" r="4.5" fill={CHEEK} opacity="0.55" />
        <circle cx="20" cy="-28" r="4.5" fill={CHEEK} opacity="0.55" />
        <path d="M-6 -26 Q0 -19 6 -26" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="-30" cy="-24" r="7" fill="#9775fa" />
        <g className="wa-baby-rattle" style={{ transformOrigin: "30px -26px" }}>
          <path d="M30 -26 L44 -48" stroke="#ffd60a" strokeWidth="4" strokeLinecap="round" />
          <circle cx="46" cy="-53" r="9" fill="#ff8c42" />
          <circle cx="43" cy="-56" r="2.6" fill="#fff" opacity="0.7" />
          <circle cx="30" cy="-26" r="7" fill="#9775fa" />
        </g>
      </g>
    </>
  );
}

/** A space flower with a face: it spins its petals, nods, waves its leaves and scatters glitter. */
export function Weltraumblume() {
  return (
    <>
      <Sparkles className="wa-blume-pollen" spots={[[-44, -176], [0, -204], [44, -172], [-36, -120], [38, -116]]} r={8} fill="#fff3bf" />
      <path d="M0 0 Q-10 -60 0 -112" stroke="#40c057" strokeWidth="8" fill="none" strokeLinecap="round" />
      <g className="wa-blume-leaf" style={{ transformOrigin: "-4px -40px" }}>
        <path d="M-4 -40 Q-40 -60 -50 -36 Q-26 -26 -4 -40 Z" fill="#69db7c" />
      </g>
      <g className="wa-blume-leaf" style={{ transformOrigin: "0px -70px", ...nth(1) }}>
        <path d="M0 -70 Q36 -92 48 -68 Q24 -58 0 -70 Z" fill="#69db7c" />
      </g>
      <g className="wa-blume-head" style={{ transformOrigin: "0px -112px" }}>
        <g className="wa-blume-petals" style={{ transformOrigin: "0px -136px" }}>
          {Array.from({ length: 7 }, (_, i) => (
            <ellipse key={i} cx="0" cy="-166" rx="13" ry="24" fill={i % 2 ? "#f783ac" : "#da77f2"} transform={`rotate(${(i * 360) / 7} 0 -136)`} />
          ))}
        </g>
        <circle cx="0" cy="-136" r="22" fill="#ffd43b" />
        <Eye cx={-8} cy={-140} r={3.6} />
        <Eye cx={8} cy={-140} r={3.6} />
        <circle cx="-14" cy="-130" r="4" fill={CHEEK} opacity="0.6" />
        <circle cx="14" cy="-130" r="4" fill={CHEEK} opacity="0.6" />
        <path d="M-6 -130 Q0 -124 6 -130" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </g>
    </>
  );
}

const BUNNY = "#fff";
const BUNNY_LINE = "#c5c8d6";

/** The moon rabbit with a carrot: it hops high (the moon makes it light), flops its ears and twitches its nose. */
export function Mondhase() {
  return (
    <>
      <Dust className="wa-hase-dust" spots={[[-30, -6], [30, -6], [0, 2]]} r={12} />
      <g className="wa-hase-body" style={{ transformOrigin: "0px 0px" }}>
        <circle cx="-30" cy="-30" r="11" fill={BUNNY} stroke={BUNNY_LINE} strokeWidth="3" />
        <ellipse cx="-14" cy="-6" rx="16" ry="7" fill="#e9ecef" stroke={BUNNY_LINE} strokeWidth="3" />
        <ellipse cx="16" cy="-6" rx="16" ry="7" fill="#e9ecef" stroke={BUNNY_LINE} strokeWidth="3" />
        <ellipse cx="0" cy="-40" rx="30" ry="34" fill={BUNNY} stroke={BUNNY_LINE} strokeWidth="3" />
        <ellipse cx="0" cy="-34" rx="16" ry="20" fill="#f8f9fa" />
        {[-1, 1].map((s, i) => (
          <g key={s} className="wa-hase-ear" style={{ transformOrigin: `${s * 10}px -110px`, ...nth(i) }}>
            <ellipse cx={s * 14} cy="-140" rx="10" ry="30" fill={BUNNY} stroke={BUNNY_LINE} strokeWidth="3" />
            <ellipse cx={s * 14} cy="-138" rx="5" ry="20" fill="#ffc9d6" />
          </g>
        ))}
        <circle cx="0" cy="-92" r="27" fill={BUNNY} stroke={BUNNY_LINE} strokeWidth="3" />
        <Eye cx={-9} cy={-96} r={3.6} />
        <Eye cx={9} cy={-96} r={3.6} />
        <Lid cx={-9} cy={-96} r={3.6} fill={BUNNY} />
        <Lid cx={9} cy={-96} r={3.6} fill={BUNNY} />
        <circle cx="-16" cy="-84" r="5" fill={CHEEK} opacity="0.5" />
        <circle cx="16" cy="-84" r="5" fill={CHEEK} opacity="0.5" />
        <g className="wa-hase-nose" style={{ transformOrigin: "0px -86px" }}>
          <ellipse cx="0" cy="-86" rx="4.5" ry="3.2" fill="#ff8fa3" />
        </g>
        <path d="M-5 -79 Q0 -76 0 -82 Q0 -76 5 -79" stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M-8 -84 L-24 -88 M-8 -81 L-24 -78 M8 -84 L24 -88 M8 -81 L24 -78" stroke={BUNNY_LINE} strokeWidth="1.6" strokeLinecap="round" />
        <g className="wa-hase-carrot" style={{ transformOrigin: "16px -46px" }}>
          <path d="M8 -54 L40 -30 L14 -42 Z" fill="#ff8c42" />
          <path d="M8 -54 l-8 -10 M10 -56 l-2 -12 M12 -54 l6 -10" stroke="#40c057" strokeWidth="3" strokeLinecap="round" />
          <circle cx="14" cy="-46" r="7" fill={BUNNY} stroke={BUNNY_LINE} strokeWidth="2" />
        </g>
      </g>
    </>
  );
}

/** A mouse in a big piece of moon cheese: it climbs out, nibbles, wiggles its ears and swishes its tail. */
export function Maus() {
  return (
    <>
      <g className="wa-maus-crumbs" fill="#ffd43b">
        {[
          [-20, -104],
          [8, -112],
          [22, -98],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4.5" style={nth(i)} />
        ))}
      </g>
      <g className="wa-maus-body">
        <g className="wa-maus-ear" style={{ transformOrigin: "-26px -90px" }}>
          <circle cx="-30" cy="-98" r="13" fill="#adb5bd" />
          <circle cx="-30" cy="-98" r="7" fill="#ffc9d6" />
        </g>
        <g className="wa-maus-ear" style={{ transformOrigin: "10px -90px", ...nth(1) }}>
          <circle cx="14" cy="-98" r="13" fill="#adb5bd" />
          <circle cx="14" cy="-98" r="7" fill="#ffc9d6" />
        </g>
        <g className="wa-maus-head" style={{ transformOrigin: "-8px -66px" }}>
          <ellipse cx="-8" cy="-80" rx="25" ry="21" fill="#adb5bd" />
          <Eye cx={-17} cy={-84} r={3.4} />
          <Eye cx={1} cy={-84} r={3.4} />
          <Lid cx={-17} cy={-84} r={3.4} fill="#adb5bd" />
          <Lid cx={1} cy={-84} r={3.4} fill="#adb5bd" />
          <circle cx="-8" cy="-73" r="4.5" fill="#ff8fa3" />
          <path d="M-14 -72 L-34 -76 M-14 -70 L-32 -66 M-2 -72 L18 -76 M-2 -70 L16 -66" stroke="#868e96" strokeWidth="1.5" strokeLinecap="round" />
        </g>
        <ellipse cx="-22" cy="-60" rx="7" ry="5" fill="#ced4da" />
        <ellipse cx="6" cy="-58" rx="7" ry="5" fill="#ced4da" />
      </g>
      <path d="M-84 -56 L-60 -72 L92 -42 L76 -30 Z" fill="#ffe066" />
      <path d="M-84 0 V-56 L76 -30 V0 Z" fill="#fcc419" />
      <path d="M76 -30 L92 -42 V-10 L76 0 Z" fill="#f2b705" />
      <g fill="#f2b705">
        <ellipse cx="-52" cy="-26" rx="11" ry="8" />
        <ellipse cx="-12" cy="-34" rx="7" ry="6" />
        <ellipse cx="28" cy="-14" rx="12" ry="8" />
        <ellipse cx="52" cy="-30" rx="6" ry="5" />
        <ellipse cx="-30" cy="-60" rx="8" ry="3" />
      </g>
      <g className="wa-maus-tail" style={{ transformOrigin: "84px -18px" }}>
        <path d="M86 -18 Q110 -10 108 -34 Q106 -50 122 -48" stroke="#ff8fa3" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
    </>
  );
}
