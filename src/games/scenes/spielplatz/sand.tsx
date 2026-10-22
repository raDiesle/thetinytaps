import { INK, SAND, Wheel, nth } from "../shared";

// The sandpit with its toys, and the water pump with the mud table. The toys share
// the sandpit's coordinates (SANDPIT), pump and table share MUD; the front edge
// of the sandpit is at y = 0.

const PLANK = "#d4a373";
const PLANK_DARK = "#a47148";

/** The sandpit: wooden frame, sand and a sandcastle whose flag pops up. */
export function Sandkasten() {
  return (
    <>
      {/* Back and side planks, seen from the inside */}
      <path d="M-226 -118 H226 L264 -24 H-264 Z" fill={PLANK_DARK} />
      <path d="M-214 -104 H214 L248 -26 H-248 Z" fill="#f1d39b" />
      <path d="M-214 -104 H214 L220 -92 H-220 Z" fill="#d9b77c" />
      {/* Bumps and dents in the sand */}
      <g fill="#e9c98c">
        <ellipse cx="-120" cy="-36" rx="40" ry="6" />
        <ellipse cx="96" cy="-82" rx="30" ry="5" />
        <ellipse cx="200" cy="-40" rx="24" ry="4" />
      </g>
      {/* Sandcastle at the back left */}
      <g className="sp-sk-castle" transform="translate(-300 0)">
        <path d="M150 -86 V-118 H158 V-110 H166 V-118 H174 V-110 H182 V-118 H190 V-110 H198 V-118 H206 V-86 Z" fill="#e9c46a" />
        <rect x="166" y="-138" width="24" height="26" fill="#e9c46a" />
        <path d="M164 -138 h6 v-6 h6 v6 h4 v-6 h6 v6 h6 v4 h-28 Z" fill="#e9c46a" />
        <path d="M172 -100 Q178 -110 184 -100 V-86 H172 Z" fill="#a47148" />
        <g className="sp-sk-flag" style={{ transformOrigin: "178px -144px" }}>
          <path d="M178 -144 V-170" stroke={INK} strokeWidth="2.5" />
          <path d="M179 -170 L198 -164 L179 -158 Z" fill="#ef476f" />
        </g>
      </g>
      {/* Front plank and corner seats */}
      <path d="M-272 -30 H272 V0 H-272 Z" fill={PLANK} />
      <path d="M-272 -30 H272 V-24 H-272 Z" fill="#e6c08f" />
      <path d="M-272 -4 H272 V0 H-272 Z" fill={PLANK_DARK} />
      <path d="M-272 -30 L-226 -118 L-214 -118 L-258 -30 Z M272 -30 L226 -118 L214 -118 L258 -30 Z" fill={PLANK} />
      <path d="M-272 -34 L-218 -34 L-238 -70 L-256 -64 Z M272 -34 L218 -34 L238 -70 L256 -64 Z" fill="#e6c08f" />
      {[-180, -60, 60, 180].map((x) => (
        <circle key={x} cx={x} cy="-15" r="2.5" fill={PLANK_DARK} />
      ))}
      <g className="sp-sk-grains" fill="#e9c46a">
        {[-150, -60, 30, 120, 210].map((x, i) => (
          <circle key={x} cx={x} cy={-60 + (i % 2) * 16} r="7" style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** Sand moulds: a star, a fish and a heart; they hop and turn over. */
export function Foermchen() {
  const moulds = [
    { x: -190, fill: "#ef476f", d: "M0 -20 L6 -6 L20 -6 L9 3 L13 18 L0 9 L-13 18 L-9 3 L-20 -6 L-6 -6 Z" },
    { x: -150, fill: "#4cc9f0", d: "M-18 0 Q-6 -16 10 -6 L20 -14 V14 L10 6 Q-6 16 -18 0 Z" },
    { x: -110, fill: "#06d6a0", d: "M0 14 C-22 0 -18 -18 -6 -16 C-2 -15 0 -12 0 -10 C0 -12 2 -15 6 -16 C18 -18 22 0 0 14 Z" },
  ];
  return (
    <>
      {moulds.map(({ x, d }) => (
        <g key={x} className="sp-fo-cake" style={{ transformOrigin: `${x}px -54px` }}>
          <path d={d} transform={`translate(${x} -68)`} fill="#e9c46a" />
          <path d={d} transform={`translate(${x} -70) scale(0.7)`} fill="#f4d58d" />
        </g>
      ))}
      {moulds.map(({ x, fill, d }, i) => (
        <g key={x} className="sp-fo-mould" style={{ ...nth(i), transformOrigin: `${x + 12}px -38px` }}>
          <path d={d} transform={`translate(${x + 12} -40) scale(1.05)`} fill={fill} />
          <path d={d} transform={`translate(${x + 10} -42) scale(0.55)`} fill="#fff" opacity="0.35" />
        </g>
      ))}
    </>
  );
}

/** Toy digger in the sand: the arm scoops, sand trickles from the shovel. */
export function Bagger() {
  return (
    <g className="sp-bg-body" style={{ transformOrigin: "-10px -40px" }}>
      <rect x="-64" y="-58" width="92" height="22" rx="11" fill={INK} />
      {[-52, -30, -8, 14].map((x) => (
        <g key={x} className="sp-bg-wheel" style={{ transformOrigin: `${x}px -47px` }}>
          <Wheel cx={x} cy={-47} r={9} />
        </g>
      ))}
      <rect x="-62" y="-92" width="70" height="34" rx="8" fill="#ffd60a" />
      <rect x="-60" y="-66" width="66" height="8" fill="#f4a261" opacity="0.6" />
      <rect x="-50" y="-120" width="36" height="32" rx="6" fill="#ffc300" />
      <rect x="-44" y="-114" width="24" height="18" rx="4" fill="#bde0fe" />
      <path d="M-40 -112 l6 -2 M-38 -106 l10 -4" stroke="#fff" strokeWidth="2" opacity="0.7" />
      <g className="sp-bg-arm" style={{ transformOrigin: "4px -86px" }}>
        <path d="M4 -86 L48 -112 L70 -76" stroke="#ffc300" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="48" cy="-112" r="4" fill="#f4a261" />
        <path d="M58 -84 L84 -80 L80 -60 Q66 -56 60 -66 Z" fill="#adb5bd" />
        <path d="M60 -66 Q68 -74 80 -70 L80 -62 Q66 -58 60 -66 Z" fill="#e9c46a" />
        <g className="sp-bg-trickle" fill="#e9c46a">
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={66 + i * 6} cy={-58} r="3" style={nth(i)} />
          ))}
        </g>
      </g>
    </g>
  );
}

/** Red bucket with a spade stuck in the sand: the spade digs, the bucket wobbles. */
export function Eimer() {
  return (
    <>
      <g className="sp-ei-spade" style={{ transformOrigin: "100px -48px" }}>
        <path d="M100 -48 L120 -122" stroke="#4361ee" strokeWidth="6" strokeLinecap="round" />
        <path d="M112 -130 h18" stroke="#4361ee" strokeWidth="7" strokeLinecap="round" />
        <path d="M88 -56 Q92 -32 100 -26 Q110 -30 112 -50 Z" fill="#4cc9f0" />
      </g>
      <g className="sp-ei-sand" fill="#e9c46a">
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={96 + i * 8} cy={-40 - (i % 2) * 8} r={5 - i * 0.6} style={nth(i)} />
        ))}
      </g>
      <g className="sp-ei-bucket" style={{ transformOrigin: "164px -34px" }}>
        <g className="sp-ei-handle" style={{ transformOrigin: "164px -84px" }}>
          <path d="M138 -84 Q164 -124 190 -84" stroke="#495057" strokeWidth="3.5" fill="none" />
        </g>
        <path d="M134 -88 H194 L186 -34 H142 Z" fill="#e63946" />
        <ellipse cx="164" cy="-88" rx="30" ry="8" fill="#c1121f" />
        <ellipse cx="164" cy="-87" rx="24" ry="5" fill="#e9c46a" />
        <path d="M134 -72 H192" stroke="#ffd60a" strokeWidth="5" />
        <path d="M142 -80 L146 -42" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.45" />
      </g>
    </>
  );
}

/** Green hand pump: the handle goes up and down and water gushes out of the spout. */
export function Pumpe() {
  return (
    <>
      <rect x="-142" y="-8" width="56" height="12" rx="4" fill="#adb5bd" />
      <path d="M-128 -4 V-150 Q-128 -162 -114 -162 Q-100 -162 -100 -150 V-4 Z" fill="#2d6a4f" />
      <path d="M-124 -12 V-148" stroke="#fff" strokeWidth="4" opacity="0.25" strokeLinecap="round" />
      <path d="M-100 -118 H-70 Q-62 -118 -62 -108 V-100" stroke="#2d6a4f" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="-114" cy="-166" r="8" fill="#40916c" />
      <g className="sp-pu-handle" style={{ transformOrigin: "-118px -150px" }}>
        <path d="M-118 -150 L-178 -184" stroke="#1b4332" strokeWidth="8" strokeLinecap="round" />
        <circle cx="-180" cy="-185" r="7" fill="#e63946" />
      </g>
      <circle cx="-118" cy="-150" r="5" fill="#95d5b2" />
      <g className="sp-pu-water" fill="#4dabf7">
        {[0, 1, 2, 3, 4].map((i) => (
          <ellipse key={i} cx="-62" cy="-96" rx="4" ry="6" style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** Mud table: a channel with water, a water wheel and a little boat. */
export function Matschtisch() {
  return (
    <>
      <path d="M-40 0 V-62 M150 0 V-50 M-20 -4 V-60 M130 -4 V-48" stroke={PLANK_DARK} strokeWidth="9" strokeLinecap="round" />
      <path d="M-56 -92 L166 -70 L166 -48 L-56 -64 Z" fill={PLANK} />
      <path d="M-50 -88 L160 -68 L160 -58 L-50 -74 Z" fill="#4dabf7" />
      <path className="sp-mt-flow" d="M-40 -80 L20 -74 M40 -72 L100 -66 M110 -65 L150 -62" stroke="#a5d8ff" strokeWidth="3" strokeLinecap="round" strokeDasharray="12 12" />
      <path d="M-56 -64 L166 -48 V-42 L-56 -58 Z" fill={PLANK_DARK} />
      {/* Mud splashes on the legs */}
      <g fill="#8d6e4f" opacity="0.8">
        <circle cx="-38" cy="-20" r="5" />
        <circle cx="146" cy="-14" r="4" />
        <ellipse cx="60" cy="-2" rx="40" ry="6" />
      </g>
      <g className="sp-mt-boat">
        <path d="M-10 -84 H22 L16 -74 H-4 Z" fill="#ffd60a" />
        <path d="M6 -84 V-104 L18 -88 Z" fill="#fff" />
        <path d="M6 -84 V-104" stroke={INK} strokeWidth="1.5" />
      </g>
      <g className="sp-mt-wheel" style={{ transformOrigin: "136px -70px" }}>
        {[0, 45, 90, 135].map((a) => (
          <rect key={a} x="133" y="-94" width="6" height="48" rx="2" fill="#ef476f" transform={`rotate(${a} 136 -70)`} />
        ))}
        <circle cx="136" cy="-70" r="7" fill="#ffd60a" />
      </g>
      <g className="sp-mt-splash" fill="#4dabf7">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={150 + i * 10} cy={-80 - i * 6} r="4" style={nth(i)} />
        ))}
      </g>
    </>
  );
}
