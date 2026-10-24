import { CHEEK, INK, SKIN, nth } from "../shared";
import { Eyes, Sparkles, SleepyFace, Yawn, Zzz, star } from "./parts";

// The bed and the bedside table. Bed, blanket, child and teddy share the bed's placement
// (BED): the foot of the bed is at (0, 0), the mattress top at y -165. Table, lamp and alarm
// clock share NIGHTSTAND: the table's foot is at (0, 0), its top at y -150.

const WOOD = "#e9a46b";
const WOOD_DARK = "#c98250";

/** The wooden bed: headboard with a heart, footboard, mattress and a side rail with stars. */
export function Bett() {
  return (
    <>
      {/* Under the bed */}
      <rect x="-210" y="-44" width="420" height="40" fill="#8a6142" opacity="0.5" />
      {/* Mattress and sheet */}
      <rect x="-214" y="-170" width="428" height="64" rx="14" fill="#f8f9fa" />
      <path d="M-210 -128 H210" stroke="#dee2e6" strokeWidth="4" />
      {/* Side rail */}
      <rect x="-216" y="-114" width="432" height="72" rx="10" fill={WOOD} />
      <rect x="-216" y="-56" width="432" height="14" rx="6" fill={WOOD_DARK} />
      <path d="M-200 -104 H200" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.35" />
      {[-150, -50, 50, 150].map((x, i) => (
        <path key={x} className="gn-bett-star" style={{ ...nth(i), transformOrigin: `${x}px -80px` }} d={star(x, -80, 16)} fill="#ffe066" />
      ))}
      {/* Headboard */}
      <g className="gn-bett-head" style={{ transformOrigin: "-240px 0px" }}>
        <path d="M-272 0 V-300 Q-272 -340 -240 -340 Q-208 -340 -208 -300 V0 Z" fill={WOOD} />
        <path d="M-262 -10 V-296 Q-262 -326 -240 -328" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.3" fill="none" />
        <path
          d="M-240 -258 C-258 -272 -256 -292 -240 -284 C-224 -292 -222 -272 -240 -258 Z"
          fill="#ff8fa3"
          className="gn-bett-heart"
          style={{ transformOrigin: "-240px -274px" }}
        />
        <rect x="-272" y="-20" width="64" height="20" rx="4" fill={WOOD_DARK} />
      </g>
      {/* Footboard */}
      <g className="gn-bett-foot" style={{ transformOrigin: "236px 0px" }}>
        <path d="M206 0 V-220 Q206 -252 236 -252 Q266 -252 266 -220 V0 Z" fill={WOOD} />
        <path d="M216 -10 V-216 Q216 -240 236 -242" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.3" fill="none" />
        <path d={star(236, -200, 14)} fill="#ffe066" />
        <rect x="206" y="-20" width="60" height="20" rx="4" fill={WOOD_DARK} />
      </g>
      <Sparkles x={0} y={-90} spread={180} count={4} colour="#fff3bf" size={1.2} />
    </>
  );
}

/** The blue blanket with yellow stars; it rises and falls as the child breathes. */
export function Decke() {
  return (
    <g className="gn-decke" style={{ transformOrigin: "40px -100px" }}>
      <path
        d="M-148 -150 Q-120 -200 -40 -204 Q40 -208 90 -188 Q160 -176 214 -168 V-104 q-18 12 -36 0 t-36 0 t-36 0 t-36 0 t-36 0 t-36 0 t-36 0 t-36 0 t-36 0 t-36 0 Q-150 -100 -148 -150 Z"
        fill="#748ffc"
      />
      <path d="M-140 -150 Q-110 -196 -40 -198" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.4" fill="none" />
      <path d="M-150 -112 Q30 -128 214 -118" stroke="#5c7cfa" strokeWidth="4" fill="none" />
      {[
        [-90, -170, 10],
        [-20, -180, 12],
        [60, -172, 10],
        [140, -150, 11],
        [-60, -130, 9],
        [30, -138, 10],
        [110, -124, 9],
        [180, -132, 8],
      ].map(([x, y, r], i) => (
        <path key={i} className="gn-decke-star" style={{ ...nth(i % 4), transformOrigin: `${x}px ${y}px` }} d={star(x, y, r)} fill="#ffe066" />
      ))}
      {/* Sheet folded over the top */}
      <path d="M-148 -150 Q-132 -186 -96 -196 L-84 -170 Q-120 -164 -132 -134 Z" fill="#fff" />
    </g>
  );
}

/** The child in bed in a striped nightcap; it sits up, yawns, waves and snuggles down again. */
export function Kind() {
  return (
    <>
      {/* Pillow */}
      <path d="M-206 -168 Q-212 -204 -180 -206 H-120 Q-96 -204 -100 -168 Q-150 -158 -206 -168 Z" fill="#fff" />
      <path d="M-200 -170 Q-150 -162 -104 -170" stroke="#d0ebff" strokeWidth="4" fill="none" />
      <g className="gn-kind" style={{ transformOrigin: "-130px -160px" }}>
        <g className="gn-kind-head" style={{ transformOrigin: "-150px -160px" }}>
          <circle cx="-152" cy="-186" r="28" fill={SKIN} />
          <path d="M-180 -188 Q-182 -214 -152 -214 Q-124 -214 -124 -190 Q-140 -200 -152 -196 Q-166 -202 -180 -188 Z" fill="#8d5524" />
          {/* Nightcap */}
          <path d="M-182 -196 Q-176 -224 -146 -222 Q-120 -220 -122 -200 Q-150 -212 -182 -196 Z" fill="#ff8787" />
          <path d="M-170 -214 L-160 -219 M-152 -221 L-140 -218 M-132 -212 L-126 -206" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
          <path d="M-146 -222 Q-180 -236 -196 -218" stroke="#ff8787" strokeWidth="10" strokeLinecap="round" fill="none" />
          <circle cx="-198" cy="-214" r="7" fill="#fff" />
          <SleepyFace cx={-150} cy={-186} size={1.1} />
        </g>
        {/* Arm over the blanket, waving */}
        <g className="gn-kind-arm" style={{ transformOrigin: "-118px -160px" }}>
          <path d="M-118 -160 Q-100 -168 -84 -182" stroke="#ffd43b" strokeWidth="14" strokeLinecap="round" fill="none" />
          <circle cx="-80" cy="-186" r="8" fill={SKIN} />
        </g>
      </g>
      <Zzz x={-118} y={-224} size={1.1} />
    </>
  );
}

/** The teddy sitting on the blanket; it waves, tilts its head and yawns. */
export function Teddy() {
  const fur = "#c08552";
  return (
    <>
      <g className="gn-teddy" style={{ transformOrigin: "70px -186px" }}>
        <ellipse cx="54" cy="-188" rx="12" ry="8" fill={fur} />
        <ellipse cx="88" cy="-188" rx="12" ry="8" fill={fur} />
        <ellipse cx="70" cy="-214" rx="24" ry="28" fill={fur} />
        <ellipse cx="70" cy="-208" rx="14" ry="16" fill="#e6b88a" />
        <g className="gn-teddy-arm" style={{ transformOrigin: "90px -226px" }}>
          <path d="M90 -226 Q104 -236 108 -252" stroke={fur} strokeWidth="12" strokeLinecap="round" fill="none" />
        </g>
        <path d="M50 -226 Q40 -214 44 -200" stroke={fur} strokeWidth="12" strokeLinecap="round" fill="none" />
        <g className="gn-teddy-head" style={{ transformOrigin: "70px -240px" }}>
          <circle cx="49" cy="-278" r="10" fill={fur} />
          <circle cx="91" cy="-278" r="10" fill={fur} />
          <circle cx="49" cy="-278" r="5" fill="#e6b88a" />
          <circle cx="91" cy="-278" r="5" fill="#e6b88a" />
          <circle cx="70" cy="-258" r="25" fill={fur} />
          <ellipse cx="70" cy="-250" rx="11" ry="8" fill="#e6b88a" />
          <ellipse cx="70" cy="-254" rx="4" ry="3" fill={INK} />
          <Eyes cx={70} cy={-264} gap={9} r={3} />
          <circle cx="56" cy="-252" r="4" fill={CHEEK} opacity="0.5" />
          <circle cx="84" cy="-252" r="4" fill={CHEEK} opacity="0.5" />
          <Yawn cx={70} cy={-245} r={4.5} />
        </g>
        <path d="M60 -234 L70 -229 L80 -234 L80 -224 L70 -229 L60 -224 Z" fill="#e63946" />
      </g>
      <Zzz x={98} y={-290} />
    </>
  );
}

/** The bedside table; its drawer slides open and a sock peeks out. */
export function Nachttisch() {
  return (
    <>
      <rect x="-76" y="-40" width="10" height="40" rx="3" fill={WOOD_DARK} />
      <rect x="66" y="-40" width="10" height="40" rx="3" fill={WOOD_DARK} />
      <rect x="-78" y="-146" width="156" height="110" rx="8" fill={WOOD} />
      <rect x="-86" y="-154" width="172" height="14" rx="5" fill="#f2b880" />
      {/* Open shelf with a book */}
      <rect x="-64" y="-74" width="128" height="30" rx="4" fill={WOOD_DARK} />
      <rect x="-50" y="-60" width="70" height="14" rx="3" fill="#9775fa" />
      <rect x="-44" y="-70" width="56" height="10" rx="3" fill="#ffa94d" />
      {/* Drawer */}
      <g className="gn-tisch-sock" style={{ transformOrigin: "-20px -128px" }}>
        <path d="M-30 -128 V-150 Q-30 -158 -22 -158 H-14 Q-6 -158 -6 -150 V-138 Q4 -138 4 -128 Z" fill="#ff8fa3" />
        <path d="M-30 -146 H-6" stroke="#fff" strokeWidth="3" />
      </g>
      <g className="gn-tisch-drawer" style={{ transformOrigin: "0px -84px" }}>
        <rect x="-66" y="-132" width="132" height="50" rx="6" fill="#f2b880" />
        <circle cx="0" cy="-107" r="7" fill={WOOD_DARK} />
        <path d="M-56 -124 H56" stroke="#fff" strokeWidth="3" opacity="0.4" />
      </g>
    </>
  );
}

/** The bedside lamp: pull the cord and the light goes on – and out again for the night. */
export function Lampe() {
  return (
    <>
      <circle className="gn-on" cx="-40" cy="-236" r="64" fill="#fff3bf" fillOpacity="0.5" />
      <ellipse cx="-40" cy="-154" rx="24" ry="7" fill="#868e96" />
      <rect x="-44" y="-226" width="8" height="72" fill="#adb5bd" />
      <g className="gn-lampe-shade" style={{ transformOrigin: "-40px -222px" }}>
        <path d="M-62 -272 H-18 L0 -222 H-80 Z" fill="#ffe8a3" />
        <path className="gn-on" d="M-62 -272 H-18 L0 -222 H-80 Z" fill="#fff3bf" />
        {[-58, -40, -22].map((x) => (
          <circle key={x} cx={x} cy="-244" r="4" fill="#ffa8a8" />
        ))}
        <path d="M-80 -222 H0" stroke="#fcc419" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g className="gn-lampe-cord" style={{ transformOrigin: "-10px -222px" }}>
        <path d="M-10 -222 V-196" stroke="#868e96" strokeWidth="2" />
        <circle cx="-10" cy="-193" r="4" fill="#ffa8a8" />
      </g>
    </>
  );
}

/** A red alarm clock with a sleepy face; it jiggles, its hands go round and it nods off. */
export function Wecker() {
  return (
    <>
      <g className="gn-wecker" style={{ transformOrigin: "44px -152px" }}>
        <path d="M24 -158 L18 -150 M64 -158 L70 -150" stroke="#495057" strokeWidth="4" strokeLinecap="round" />
        <g className="gn-wecker-bells">
          <path d="M20 -210 a14 14 0 0 1 20 -10 Z" fill="#ffd43b" />
          <path d="M48 -220 a14 14 0 0 1 20 10 Z" fill="#ffd43b" />
          <path d="M44 -214 V-222" stroke="#495057" strokeWidth="3" strokeLinecap="round" />
        </g>
        <circle cx="44" cy="-182" r="27" fill="#e63946" />
        <circle cx="44" cy="-182" r="20" fill="#fff" />
        <path className="gn-wecker-hand" d="M44 -182 V-196" stroke="#adb5bd" strokeWidth="2" strokeLinecap="round" style={{ transformOrigin: "44px -182px" }} />
        <Eyes cx={44} cy={-184} gap={7} r={2.6} />
        <path d="M40 -175 Q44 -172 48 -175" stroke={INK} strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M26 -196 Q32 -204 40 -206" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.5" fill="none" />
      </g>
      <g className="gn-wecker-tick" fill="none" stroke="#e63946" strokeWidth="3" strokeLinecap="round">
        {[0, 1].map((i) => (
          <g key={i} style={nth(i)}>
            <path d={i ? "M10 -192 q-6 10 0 20" : "M78 -192 q6 10 0 20"} />
          </g>
        ))}
      </g>
      <Zzz x={74} y={-216} size={0.9} />
    </>
  );
}
