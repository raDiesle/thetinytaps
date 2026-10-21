import { Eye, Face, INK, Inside, SKIN, nth, side } from "../shared";
import { Bubbles, Heart, Lid, Sand } from "./parts";

// Things that sit on the sea floor at the back and in the middle: the old ship, the reef and
// the rocks of the mermaid and the octopus (drawn in the background, same placement), the
// seagrass and the bubbles. Each drawing has its foot point at (0, 0).

/** The old sunken ship with a broken mast; its flag waves, its bell rings and a fish looks out. */
export function Schiff() {
  return (
    <g>
      <g transform="rotate(-5)">
        <rect x="-52" y="-252" width="14" height="110" fill="#7f5539" />
        <path d="M-52 -252 l5 -12 l4 8 l5 -6 Z" fill="#7f5539" />
        <rect x="-96" y="-212" width="100" height="8" rx="3" fill="#7f5539" />
        <g className="uw-schiff-flag" style={{ transformOrigin: "-38px -246px" }}>
          <path d="M-38 -248 Q-8 -258 22 -246 Q12 -234 22 -222 Q-8 -232 -38 -224 Z" fill="#e63946" />
          <circle cx="-10" cy="-236" r="6" fill="#fff" />
        </g>
        <g className="uw-schiff-bell" style={{ transformOrigin: "-82px -204px" }}>
          <path d="M-82 -204 V-194" stroke={INK} strokeWidth="3" />
          <path d="M-95 -170 Q-95 -196 -82 -196 Q-69 -196 -69 -170 Z" fill="#ffc300" />
          <circle cx="-82" cy="-167" r="4.5" fill="#e09f3e" />
        </g>
        <path d="M120 -150 V-200 H218 V-150 Z" fill="#b08968" />
        {[140, 178].map((x, i) => (
          <g key={x}>
            <rect x={x} y="-188" width="24" height="22" rx="4" fill="#583101" />
            <rect className="uw-glow" x={x} y="-188" width="24" height="22" rx="4" fill="#ffe066" style={nth(i)} />
            <g className="uw-schiff-shutter" style={{ ...nth(i), transformOrigin: `${x}px -177px` }}>
              <rect x={x} y="-188" width="24" height="22" rx="4" fill="#7f5539" />
              <path d={`M${x + 4} -181 H${x + 20} M${x + 4} -173 H${x + 20}`} stroke="#583101" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          </g>
        ))}
        <path d="M112 -204 H226 V-196 H112 Z" fill="#7f5539" />
        <path d="M-240 -150 H230 Q238 -150 228 -128 Q200 -40 150 0 H-170 Q-220 -60 -240 -150 Z" fill="#9c6644" />
        <path d="M-226 -112 H214 M-208 -72 H198 M-188 -34 H178" stroke="#7f5539" strokeWidth="4" />
        <path d="M-246 -160 H238 V-146 H-246 Z" fill="#7f5539" />
        <path d="M-220 -140 H180" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.25" />
        {[-150, -70, 10].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy={-100} r="20" fill="#1b4965" />
            <circle cx={cx} cy={-100} r="20" stroke="#e9c46a" strokeWidth="5" fill="none" />
          </g>
        ))}
        {/* Someone peeks out of the first porthole: two big eyes in the dark. */}
        <g className="uw-schiff-eyes">
          <circle cx="-157" cy="-100" r="6" fill="#fff" />
          <circle cx="-143" cy="-100" r="6" fill="#fff" />
          <circle cx="-156" cy="-99" r="3" fill="#2b2d42" />
          <circle cx="-142" cy="-99" r="3" fill="#2b2d42" />
        </g>
        <g className="uw-schiff-fish">
          <Inside d="M-90 -100 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0 Z">
            <g className="uw-schiff-fish-swim">
              <ellipse cx="-62" cy="-100" rx="16" ry="10" fill="#ffd166" />
              <Eye cx={-70} cy={-102} r={2.8} />
            </g>
          </Inside>
        </g>
        <path d="M60 -70 l18 -24 l24 10 l14 -18 l18 26 l-10 26 Z" fill="#583101" />
        <path className="uw-schiff-weed" d="M-200 -120 q10 -14 0 -30 M-188 -116 q12 -12 6 -30" stroke="#52b788" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path className="uw-schiff-weed" d="M170 -56 q8 -16 0 -30" stroke="#52b788" strokeWidth="5" fill="none" strokeLinecap="round" />
        <Bubbles x={88} y={-84} count={4} size={8} delay={0.5} />
        <Bubbles x={10} y={-110} count={3} size={6} delay={0.8} />
        {[
          [-120, -50],
          [-100, -40],
          [100, -120],
        ].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r="5" fill="#ddb892" />
        ))}
      </g>
      <path d="M-262 4 Q-200 -40 -120 -22 Q0 -48 120 -24 Q200 -40 262 4 Z" fill="#d8d3a8" />
      <path d="M-200 -14 q20 -8 40 0 M60 -16 q20 -8 40 0" stroke="#c9c08c" strokeWidth="4" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** Pink and orange coral with a purple brain coral; it sways and sparkles. */
export function Koralle() {
  return (
    <>
      <g className="uw-koralle-pink" style={{ transformOrigin: "-30px 0px" }}>
        <path
          d="M-30 0 V-80 M-30 -60 Q-60 -80 -64 -120 M-30 -80 Q-20 -120 -36 -150 M-30 -96 Q0 -110 4 -140 M-64 -120 Q-82 -134 -78 -156 M-64 -120 Q-56 -140 -50 -152"
          stroke="#ff8fab"
          strokeWidth="18"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M-34 -20 V-76 M-36 -96 Q-26 -120 -38 -144 M-68 -124 Q-80 -136 -78 -150" stroke="#ffc2d1" strokeWidth="5" strokeLinecap="round" fill="none" />
      </g>
      <g className="uw-koralle-orange" style={{ transformOrigin: "60px 0px" }}>
        <path d="M32 0 V-62 M52 0 V-92 M72 0 V-74 M92 0 V-50" stroke="#f9844a" strokeWidth="17" strokeLinecap="round" />
        {[
          [32, -62],
          [52, -92],
          [72, -74],
          [92, -50],
        ].map(([x, y]) => (
          <ellipse key={x} cx={x} cy={y} rx="7" ry="4" fill="#c2410c" />
        ))}
      </g>
      {/* A tiny fish darts out from between the coral branches. */}
      <g className="uw-koralle-fish">
        <ellipse cx="10" cy="-70" rx="13" ry="7" fill="#4cc9f0" />
        <path d="M21 -70 l10 -7 v14 Z" fill="#4895ef" />
        <Eye cx={4} cy={-71} r={2.2} />
      </g>
      <g className="uw-koralle-brain">
        <ellipse cx="6" cy="-14" rx="58" ry="22" fill="#c77dff" />
        <path d="M-40 -16 q10 -10 20 0 t20 0 t20 0 t20 0 M-30 -26 q10 -8 20 0 t20 0 t20 0" stroke="#9d4edd" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M-30 -30 Q0 -40 30 -34" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.4" />
      </g>
      <Bubbles x={6} y={-40} count={3} size={6} delay={0.4} />
      <g className="uw-koralle-sparkles" fill="#fff">
        {[
          [-36, -162],
          [6, -150],
          [52, -106],
          [-82, -166],
          [92, -62],
        ].map(([x, y], i) => (
          <path key={x} d={`M${x} ${y - 10} L${x + 3} ${y - 3} L${x + 10} ${y} L${x + 3} ${y + 3} L${x} ${y + 10} L${x - 3} ${y + 3} L${x - 10} ${y} L${x - 3} ${y - 3} Z`} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

const CLOWN_BODY = "M-30 -96 a30 18 0 1 0 60 0 a30 18 0 1 0 -60 0 Z";

/** Clownfish above its anemone; it hides between the tentacles and pops out again. */
export function Clownfisch() {
  return (
    <>
      <g className="uw-clown-fish" style={{ transformOrigin: "0px -96px" }}>
        <path className="uw-clown-tail" d="M24 -96 L44 -112 Q40 -96 44 -80 Z" fill="#f77f00" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" style={{ transformOrigin: "26px -96px" }} />
        <path className="uw-clown-fin" d="M-10 -111 Q4 -128 18 -109 Z" fill="#f77f00" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" style={{ transformOrigin: "4px -110px" }} />
        <path d={CLOWN_BODY} fill="#f77f00" />
        <Inside d={CLOWN_BODY}>
          <path d="M-14 -118 q-6 22 0 44 h10 q-6 -22 0 -44 Z M10 -118 q-5 22 0 44 h9 q-5 -22 0 -44 Z" fill="#fff" stroke={INK} strokeWidth="2" />
        </Inside>
        <path d={CLOWN_BODY} fill="none" stroke={INK} strokeWidth="2.5" />
        <path d="M-2 -86 Q8 -76 4 -70 Q-4 -76 -2 -86 Z" fill="#f77f00" stroke={INK} strokeWidth="2" />
        <Eye cx={-18} cy={-100} r={4} />
        <Lid cx={-18} cy={-100} r={4} fill="#f77f00" />
        <path d="M-29 -91 Q-25 -88 -21 -90" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
      <Bubbles x={-34} y={-110} count={3} size={5} delay={0.4} />
      <g className="uw-anemone" stroke="#e0aaff" strokeWidth="12" strokeLinecap="round" fill="none">
        {Array.from({ length: 11 }, (_, i) => {
          const x = -60 + i * 12;
          return <path key={i} d={`M${x} -18 q${i % 2 ? 8 : -8} -28 ${(i - 5) * 3} ${-52 - (i % 3) * 8}`} style={{ ...nth(i), transformOrigin: `${x}px -18px` }} />;
        })}
      </g>
      <ellipse cx="0" cy="-12" rx="62" ry="16" fill="#9d4edd" />
      <path d="M-40 -18 Q0 -26 40 -18" stroke="#c77dff" strokeWidth="5" strokeLinecap="round" fill="none" />
    </>
  );
}

const OCTOPUS = "#e5383b";
/** The octopus's arms: start on the head, end on the rock, curling outwards. */
const ARMS = [-112, -84, -50, -18, 18, 50, 84, 112].map((ex, i) => {
  const sx = -35 + i * 10;
  const ey = [-98, -64, -44, -36, -36, -44, -64, -98][i];
  const out = i < 4 ? -1 : 1;
  return { sx, d: `M${sx} -112 Q${(sx + ex) / 2} ${(ey - 112) / 2 + 30} ${ex} ${ey} q${out * 14} -2 ${out * 10} -16` };
});

/** Red octopus on its rock; it waves all eight arms. */
export function Krake() {
  return (
    <g className="uw-krake-body">
      {ARMS.map(({ sx, d }, i) => (
        <g key={i} className="uw-krake-arm" style={{ ...side(i < 4 ? 1 : -1), ...nth(i), transformOrigin: `${sx}px -112px` }}>
          <path d={d} stroke={OCTOPUS} strokeWidth="15" strokeLinecap="round" fill="none" />
          <path d={d} stroke="#ff8fa3" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 10" fill="none" />
        </g>
      ))}
      <g className="uw-krake-head" style={{ transformOrigin: "0px -110px" }}>
        <ellipse cx="0" cy="-152" rx="50" ry="54" fill={OCTOPUS} />
        <ellipse cx="0" cy="-118" rx="40" ry="12" fill="#ba181b" opacity="0.5" />
        <path d="M-30 -184 Q-14 -202 8 -200" stroke="#fff" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.4" />
        {[
          [24, -180],
          [32, -160],
          [-34, -168],
        ].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r="5" fill="#ba181b" opacity="0.6" />
        ))}
        <Face cx={0} cy={-142} size={1.5} />
        <Lid cx={-10.5} cy={-142} r={4.8} fill={OCTOPUS} />
        <Lid cx={10.5} cy={-142} r={4.8} fill={OCTOPUS} />
        <ellipse className="uw-krake-mouth" cx="0" cy="-125" rx="7" ry="6" fill="#9d0208" />
      </g>
      <Heart x={60} y={-200} size={0.9} delay={0.7} />
      <Bubbles x={-56} y={-200} count={3} size={6} delay={0.4} />
    </g>
  );
}

const HAIR = "#e85d04";

/** Mermaid sitting on her rock; she waves, flicks her tail and sings. */
export function Meerjungfrau() {
  return (
    <>
      <g className="uw-mj-notes" fill={INK}>
        {[
          [50, -232],
          [84, -214],
        ].map(([x, y], i) => (
          <g key={x} style={nth(i)}>
            <ellipse cx={x} cy={y} rx="8" ry="6" />
            <path d={`M${x + 7} ${y} V${y - 30} l10 5`} stroke={INK} strokeWidth="3" fill="none" />
          </g>
        ))}
      </g>
      <path className="uw-mj-hair" d="M-30 -196 Q-38 -150 -26 -118 Q-6 -126 0 -136 Q8 -126 28 -118 Q38 -150 30 -196 Z" fill={HAIR} style={{ transformOrigin: "0px -196px" }} />
      <path d="M-22 -106 Q-28 -84 -6 -78 Q40 -72 70 -60 Q92 -50 94 -34 L104 -38 Q104 -64 76 -78 Q44 -92 22 -104 Z" fill="#2ec4b6" />
      <path d="M0 -92 q6 6 12 0 M24 -84 q6 6 12 0 M48 -74 q6 6 12 0 M74 -60 q5 6 10 2" stroke="#00a896" strokeWidth="3" fill="none" strokeLinecap="round" />
      <g className="uw-mj-fin" style={{ transformOrigin: "99px -36px" }}>
        <path d="M99 -36 Q88 -10 102 -2 Q110 -18 124 -16 Q120 -34 99 -36 Z" fill="#00a896" />
      </g>
      <path d="M-20 -104 Q-24 -150 -14 -164 H14 Q24 -150 20 -104 Z" fill={SKIN} />
      <path d="M-15 -148 q7 -13 15 0 Z M0 -148 q7 -13 15 0 Z" fill="#ff8fab" />
      <path d="M-16 -150 Q-34 -126 -38 -100" stroke={SKIN} strokeWidth="10" strokeLinecap="round" fill="none" />
      <g className="uw-mj-arm" style={{ transformOrigin: "14px -154px" }}>
        <path d="M14 -154 Q34 -170 40 -196" stroke={SKIN} strokeWidth="10" strokeLinecap="round" fill="none" />
        <circle cx="41" cy="-200" r="7" fill={SKIN} />
      </g>
      <g className="uw-mj-head" style={{ transformOrigin: "0px -170px" }}>
        <circle cx="0" cy="-192" r="24" fill={SKIN} />
        <path d="M-26 -188 Q-28 -222 0 -222 Q28 -222 26 -188 Q14 -206 0 -204 Q-16 -206 -26 -188 Z" fill={HAIR} />
        <path className="uw-mj-star" d="M18 -214 l3 7 l7 1 l-5 5 l1 7 l-6 -3 l-6 3 l1 -7 l-5 -5 l7 -1 Z" fill="#ffd60a" />
        <Face cx={0} cy={-192} size={0.9} />
        <Lid cx={-6.3} cy={-192} r={2.9} fill={SKIN} />
        <Lid cx={6.3} cy={-192} r={2.9} fill={SKIN} />
      </g>
      <Heart x={-40} y={-196} size={0.6} delay={1.0} />
      <Bubbles x={110} y={-30} count={3} size={5} delay={0.6} />
    </>
  );
}

const BLADES = [
  [-36, "#2d6a4f", 1],
  [-12, "#40916c", 1.1],
  [12, "#52b788", 0.9],
  [34, "#40916c", 1.05],
  [54, "#2d6a4f", 0.8],
] as const;

/** Tall seagrass at the front; it sways, and a little fish swims out of it. */
export function Seegras() {
  return (
    <>
      <g className="uw-seegras-fish uw-seegras-fish-2">
        <ellipse cx="20" cy="-250" rx="12" ry="7" fill="#ff8fab" />
        <path d="M30 -250 l10 -7 v14 Z" fill="#f06595" />
        <Eye cx={14} cy={-251} r={2.2} />
      </g>
      <g className="uw-seegras-fish">
        <ellipse cx="0" cy="-160" rx="16" ry="9" fill="#f9c74f" />
        <path d="M14 -160 l12 -9 v18 Z" fill="#f3722c" />
        <Eye cx={-7} cy={-162} r={2.6} />
      </g>
      {BLADES.map(([x, color, h], i) => (
        <g key={x} className="uw-seegras-blade" style={{ ...nth(i), transformOrigin: `${x}px 0px` }}>
          <path d={`M${x} 0 q-16 ${-60 * h} 0 ${-120 * h} q16 ${-60 * h} 0 ${-120 * h} q-10 ${-40 * h} 4 ${-80 * h}`} stroke={color} strokeWidth="15" strokeLinecap="round" fill="none" />
        </g>
      ))}
      <Bubbles x={0} y={-90} count={3} size={6} delay={0.3} />
      <Bubbles x={40} y={-200} count={3} size={5} delay={0.8} />
    </>
  );
}

/** Where the bubbles above the little vent are: x, y, radius. */
const BUBBLES = [
  [-4, -56, 10],
  [8, -92, 13],
  [-6, -130, 16],
  [6, -166, 12],
] as const;

/** Bubbles rising from a little hole in a stone; they float up and pop. */
export function Luftblasen() {
  return (
    <>
      <Sand xs={[-36, 36]} y={-4} r={9} className="uw-blasen-sand" />
      <g className="uw-blasen-stone" style={{ transformOrigin: "0px 0px" }}>
        <path d="M-40 0 Q-36 -30 -10 -34 Q14 -38 30 -24 Q42 -12 40 0 Z" fill="#6c757d" />
        <path d="M-28 -18 Q-14 -30 4 -30" stroke="#adb5bd" strokeWidth="4" strokeLinecap="round" fill="none" />
        <ellipse cx="0" cy="-31" rx="10" ry="4" fill="#343a40" />
      </g>
      <Bubbles x={14} y={-40} count={4} size={4} delay={0.4} />
      {BUBBLES.map(([x, y, r], i) => (
        <g key={y} className="uw-blase" style={nth(i)}>
          <circle cx={x} cy={y} r={r} fill="#d0ebff" fillOpacity="0.5" stroke="#fff" strokeWidth="3" />
          <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.25} fill="#fff" />
        </g>
      ))}
      <g className="uw-blasen-pops" stroke="#fff" strokeWidth="3" strokeLinecap="round">
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${-12 + i * 12} -196 l-6 -8 M${-12 + i * 12 + 6} -200 v-10 M${-12 + i * 12 + 12} -196 l6 -8`} style={nth(i)} />
        ))}
      </g>
    </>
  );
}
