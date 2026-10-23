import { Hideout } from "../hideout";
import { INK, nth } from "../shared";
import { Bubbles } from "./parts";

// The washstand and the wall above it. Washstand, tap, toothbrush and toothpaste share the
// washstand's placement (SINK, foot at (0, 0), worktop at y -256); mirror, lamp and towel hang
// on the wall and are drawn in picture coordinates.

/** Washstand with a cupboard below; the water gurgles away and the doors open. */
export function Waschbecken() {
  return (
    <>
      <rect x="-146" y="-16" width="292" height="16" rx="4" fill="#9fb3b0" />
      <rect x="-150" y="-208" width="300" height="196" rx="6" fill="#8fcfbf" />
      {/* Inside the cupboard, seen when the doors open */}
      <rect x="-144" y="-200" width="288" height="182" rx="4" fill="#5e8b82" />
      <rect x="-144" y="-112" width="288" height="6" fill="#4a736b" />
      {[-112, -78].map((x) => (
        <g key={x}>
          <rect x={x - 15} y="-150" width="30" height="38" rx="4" fill="#fff" />
          <ellipse cx={x} cy="-150" rx="15" ry="5" fill="#f1f3f5" />
          <circle cx={x} cy="-150" r="4" fill="#ced4da" />
        </g>
      ))}
      <path d="M62 -112 V-160 Q62 -172 74 -172 H86 Q98 -172 98 -160 V-112 Z" fill="#ff8fab" />
      <rect x="70" y="-184" width="20" height="14" rx="3" fill="#fff" />
      <rect x="-40" y="-52" width="70" height="34" rx="6" fill="#ffd60a" />
      <rect x="-40" y="-52" width="70" height="10" rx="4" fill="#40c057" />
      {/* Someone else sits in the cupboard every time */}
      <Hideout x={-140} y={-106} w={90} h={88} size={62} />
      {/* Doors */}
      {[
        { x: -146, hinge: "-146px -110px", knob: -18 },
        { x: 1, hinge: "146px -110px", knob: 18 },
      ].map(({ x, hinge, knob }, i) => (
        <g key={i} className="bz-becken-door" style={{ ...nth(i), transformOrigin: hinge }}>
          <rect x={x} y="-202" width="145" height="186" rx="5" fill="#b8e6d9" stroke="#95d5c4" strokeWidth="3" />
          <rect x={x + 16} y="-186" width="113" height="154" rx="8" fill="none" stroke="#95d5c4" strokeWidth="4" />
          <circle cx={knob} cy="-112" r="7" fill="#ffd166" stroke="#e09f3e" strokeWidth="2" />
        </g>
      ))}
      {/* Worktop and basin */}
      <path d="M-166 -258 H166 L172 -244 H-172 Z" fill="#e9ecef" />
      <rect x="-172" y="-246" width="344" height="40" rx="8" fill="#fff" stroke="#dee2e6" strokeWidth="3" />
      <path d="M-160 -232 H120" stroke="#f1f3f5" strokeWidth="6" strokeLinecap="round" />
      <ellipse cx="0" cy="-250" rx="82" ry="7" fill="#c3ccd5" />
      <ellipse className="bz-becken-water" cx="0" cy="-250" rx="74" ry="5" fill="#74c0fc" style={{ transformOrigin: "0px -250px" }} />
      <Bubbles x={0} y={-262} count={3} spread={34} r={9} />
    </>
  );
}

/** The tap; the lever turns and drops fall into the basin. */
export function Wasserhahn() {
  return (
    <>
      <ellipse cx="-20" cy="-256" rx="18" ry="5" fill="#adb5bd" />
      <path d="M-20 -256 V-310 Q-20 -330 0 -330 Q20 -330 20 -310 V-304" stroke="#dee2e6" strokeWidth="15" strokeLinecap="round" fill="none" />
      <path d="M-24 -262 V-308 Q-24 -322 -10 -326" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.8" />
      <g className="bz-hahn-lever" style={{ transformOrigin: "-20px -330px" }}>
        <path d="M-20 -330 L-46 -340" stroke="#adb5bd" strokeWidth="9" strokeLinecap="round" />
        <circle cx="-48" cy="-341" r="7" fill="#4dabf7" />
      </g>
      <g className="bz-hahn-drops" fill="#4dabf7">
        {[0, 1, 2].map((i) => (
          <path key={i} d="M20 -302 q7 9 0 13 q-7 -4 0 -13 Z" style={nth(i)} />
        ))}
      </g>
      <ellipse className="bz-hahn-ripple" cx="20" cy="-250" rx="14" ry="3.5" fill="none" stroke="#fff" strokeWidth="2.5" />
    </>
  );
}

/** A cup with two toothbrushes; the red one jumps out and scrubs. */
export function Zahnbuerste() {
  return (
    <>
      <path d="M-152 -300 L-162 -350" stroke="#51cf66" strokeWidth="8" strokeLinecap="round" />
      <rect x="-172" y="-372" width="14" height="22" rx="4" fill="#fff" transform="rotate(-11 -165 -361)" />
      <g className="bz-buerste" style={{ transformOrigin: "-134px -300px" }}>
        <path d="M-136 -300 L-126 -352" stroke="#e63946" strokeWidth="8" strokeLinecap="round" />
        <g transform="rotate(11 -123 -364)">
          <rect x="-130" y="-376" width="14" height="22" rx="4" fill="#fff" stroke="#dee2e6" strokeWidth="1.5" />
          <path d="M-129 -370 H-117 M-129 -364 H-117 M-129 -358 H-117" stroke="#a5d8ff" strokeWidth="2" />
          <path d="M-134 -378 q6 -8 12 -2 q6 -6 10 2" stroke="#96f2d7" strokeWidth="6" strokeLinecap="round" fill="none" />
        </g>
        <Bubbles x={-118} y={-384} count={3} spread={16} r={6} />
      </g>
      <g className="bz-becher" style={{ transformOrigin: "-142px -256px" }}>
        <path d="M-170 -310 H-114 L-119 -260 Q-142 -252 -165 -260 Z" fill="#4dabf7" />
        <path d="M-170 -310 H-114" stroke="#74c0fc" strokeWidth="5" strokeLinecap="round" />
        <path d="M-160 -300 L-157 -268" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.5" />
        <circle cx="-148" cy="-288" r="2.6" fill={INK} />
        <circle cx="-134" cy="-288" r="2.6" fill={INK} />
        <path d="M-148 -280 Q-141 -274 -134 -280" stroke={INK} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      </g>
    </>
  );
}

/** A toothpaste tube lying on the worktop; it is squeezed, the cap pops and a blob comes out. */
export function Zahnpasta() {
  return (
    <>
      <path
        className="bz-paste-blob"
        d="M66 -264 q-14 -2 -18 -12 q-2 -12 10 -10 q10 2 6 12"
        fill="#fff"
        stroke="#63e6be"
        strokeWidth="4"
        strokeLinecap="round"
        style={{ transformOrigin: "66px -264px" }}
      />
      <g className="bz-paste-tube" style={{ transformOrigin: "120px -262px" }}>
        <path d="M80 -274 Q80 -278 86 -278 L150 -282 V-246 L86 -250 Q80 -250 80 -254 Z" fill="#fff" stroke="#dee2e6" strokeWidth="2" />
        <path d="M92 -270 L146 -272 V-258 L92 -258 Z" fill="#4dabf7" />
        <path d="M100 -264 H136" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        <path d="M150 -284 L166 -286 L162 -276 L168 -268 L162 -258 L168 -250 L150 -244 Z" fill="#e63946" />
        <rect x="74" y="-269" width="8" height="10" rx="2" fill="#dee2e6" />
      </g>
      <g className="bz-paste-cap" style={{ transformOrigin: "70px -264px" }}>
        <rect x="60" y="-273" width="16" height="18" rx="4" fill="#e63946" />
        <path d="M64 -270 V-258" stroke="#fff" strokeWidth="2" opacity="0.5" />
      </g>
    </>
  );
}

/** The mirror (picture coordinates); it fogs up, a smiley appears in the fog and it sparkles. */
export function Spiegel() {
  return (
    <>
      <defs>
        <linearGradient id="bz-mirror" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e7f5ff" />
          <stop offset="1" stopColor="#c5d6f5" />
        </linearGradient>
      </defs>
      <rect x="636" y="62" width="168" height="128" rx="30" fill="#f1f3f5" stroke="#ced4da" strokeWidth="3" />
      <rect x="646" y="72" width="148" height="108" rx="22" fill="url(#bz-mirror)" />
      <path d="M672 168 L716 80 H740 L696 168 Z M716 168 L756 86 H768 L728 168 Z" fill="#fff" opacity="0.45" />
      <rect className="bz-spiegel-fog" x="646" y="72" width="148" height="108" rx="22" fill="#fff" />
      <g className="bz-spiegel-smile" stroke="#74c0fc" strokeWidth="6" strokeLinecap="round" fill="none">
        <circle cx="702" cy="110" r="4" />
        <circle cx="738" cy="110" r="4" />
        <path d="M692 132 Q720 158 748 132" pathLength={1} strokeDasharray="1" />
      </g>
      <g className="bz-spiegel-sparkle" fill="#fff">
        <path d="M778 88 q0 12 12 12 q-12 0 -12 12 q0 -12 -12 -12 q12 0 12 -12 Z" />
      </g>
    </>
  );
}

/** The lamp above the mirror (picture coordinates); it lights up. */
export function Lampe() {
  return (
    <>
      <ellipse className="bz-lampe-glow" cx="720" cy="56" rx="130" ry="44" fill="#fff9db" />
      <rect x="706" y="12" width="28" height="12" rx="4" fill="#adb5bd" />
      <rect x="668" y="24" width="104" height="24" rx="12" fill="#fff3bf" stroke="#ffe066" strokeWidth="3" />
      <rect className="bz-lampe-light" x="668" y="24" width="104" height="24" rx="12" fill="#ffe066" />
      <path d="M682 32 H730" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      <g className="bz-lampe-rays" stroke="#ffd43b" strokeWidth="4" strokeLinecap="round">
        {[
          [680, 54, -10],
          [720, 56, 0],
          [760, 54, 10],
        ].map(([x, y, dx], i) => (
          <path key={i} d={`M${x} ${y} l${dx} 14`} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** Blue towel on the rail (picture coordinates); it swings and flutters. */
export function Handtuch() {
  return (
    <g className="bz-tuch" style={{ transformOrigin: "910px 132px" }}>
      <path d="M866 132 H954 V204 Q910 210 866 204 Z" fill="#228be6" />
      <path d="M862 128 H958 V282 q-12 9 -24 0 t-24 0 t-24 0 t-24 0 V128 Z" fill="#4dabf7" />
      <rect x="862" y="236" width="96" height="7" fill="#fff" />
      <rect x="862" y="250" width="96" height="7" fill="#fff" />
      <path d="M874 146 V220" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.4" />
      <g className="bz-tuch-fringe" stroke="#a5d8ff" strokeWidth="3" strokeLinecap="round" style={{ transformOrigin: "910px 284px" }}>
        {[868, 882, 896, 910, 924, 938, 952].map((x) => (
          <path key={x} d={`M${x} 284 v8`} />
        ))}
      </g>
    </g>
  );
}
