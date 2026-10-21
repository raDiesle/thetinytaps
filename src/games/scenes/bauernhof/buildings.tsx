import { Face, GLASS, INK, Inside, Pane, SKIN, nth } from "../shared";

// Buildings of the farm. Each drawing has its foot point (the middle of its front, on
// the ground) at (0, 0).

const PLANKS = [-150, -120, -90, 90, 120, 150];

/** Red barn; the big doors swing open and a swallow flies out. */
export function Scheune() {
  return (
    <>
      <rect x="-180" y="-236" width="360" height="236" fill="#d62828" />
      <path d={PLANKS.map((x) => `M${x} -230 V0`).join(" ")} stroke="#b51d1d" strokeWidth="3" />
      <rect x="-180" y="-30" width="360" height="30" fill="#ae2012" />
      <path d="M-206 -228 L-156 -320 L0 -374 L156 -320 L206 -228 Z" fill="#5c677d" />
      <path d="M-180 -270 H180 M-160 -310 H160 M-100 -346 H100" stroke="#4a5568" strokeWidth="3" />
      <path d="M-206 -228 L-156 -320 L0 -374 L156 -320 L206 -228" stroke="#f8f9fa" strokeWidth="9" strokeLinejoin="round" fill="none" />
      <path d="M-196 -226 H196" stroke="#495057" strokeWidth="8" />
      {/* Hayloft with hay */}
      <rect x="-40" y="-310" width="80" height="64" fill="#3d2314" />
      <path d="M-40 -246 Q-30 -280 -6 -272 Q10 -292 40 -268 V-246 Z" fill="#e9c46a" />
      <path d="M-26 -262 l-6 -10 M0 -270 l2 -12 M22 -264 l6 -10" stroke="#d4a373" strokeWidth="3" strokeLinecap="round" />
      <rect x="-40" y="-310" width="80" height="64" fill="none" stroke="#f8f9fa" strokeWidth="7" />
      {/* Inside: hay and the swallow */}
      <rect x="-92" y="-178" width="184" height="178" fill="#3d2314" />
      <path d="M-92 0 Q-70 -84 -20 -72 Q30 -104 92 -38 V0 Z" fill="#e9c46a" />
      <path d="M-60 -50 l-8 -14 M-20 -60 l2 -14 M30 -66 l8 -12 M60 -40 l10 -10" stroke="#d4a373" strokeWidth="3" strokeLinecap="round" />
      <g className="bh-scheune-bird">
        <path d="M-14 -124 L-34 -132 L-26 -120 L-36 -112 Z" fill="#1d3557" />
        <ellipse cx="0" cy="-120" rx="16" ry="8" fill="#1d3557" />
        <ellipse cx="2" cy="-116" rx="9" ry="4" fill="#f8f9fa" />
        <circle cx="13" cy="-124" r="6" fill="#1d3557" />
        <circle cx="12" cy="-120" r="3" fill="#e63946" />
        <path d="M18 -125 L24 -123 L18 -121 Z" fill={INK} />
        <path d="M-6 -124 Q4 -144 12 -150 Q8 -132 4 -122 Z" fill="#274c77" />
      </g>
      {[
        [-92, 1],
        [92, -1],
      ].map(([hinge, dir]) => (
        <g key={hinge} className="bh-scheune-door" style={{ transformOrigin: `${hinge}px -89px` }}>
          <rect x={Math.min(hinge, 0)} y="-178" width="92" height="178" fill="#c1121f" />
          <rect x={Math.min(hinge, 0) + 5} y="-173" width="82" height="168" fill="none" stroke="#f8f9fa" strokeWidth="7" />
          <path d={`M${hinge + 5 * dir} -173 L${-5 * dir} -5 M${-5 * dir} -173 L${hinge + 5 * dir} -5`} stroke="#f8f9fa" strokeWidth="7" />
          <circle cx={-12 * dir} cy="-90" r="4" fill="#495057" />
        </g>
      ))}
      <rect x="-96" y="-182" width="192" height="8" fill="#f8f9fa" />
      <ellipse cx="-120" cy="-150" rx="40" ry="6" fill="#fff" opacity="0.18" />
    </>
  );
}

const WINDOW = "M-36 -226 H36 V-152 H-36 Z";

/** Half-timbered farmhouse; the shutters open and the farmer's wife waves, the chimney smokes. */
export function Bauernhaus() {
  return (
    <>
      <g className="bh-haus-smoke" fill="#fff">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={88 + i * 4} cy={-384 - i * 6} r={12 + i * 3} style={nth(i)} />
        ))}
      </g>
      <rect x="70" y="-376" width="34" height="80" fill="#bc4749" />
      <rect x="64" y="-384" width="46" height="12" rx="3" fill="#9d0208" />
      <path d="M-150 -250 L0 -372 L150 -250 Z" fill="#fff1d6" />
      <rect x="-150" y="-252" width="300" height="252" fill="#fff1d6" />
      {/* Timber frame */}
      <g stroke="#7f5539" strokeWidth="10" strokeLinecap="square">
        <path d="M-150 -250 H150 M-150 -130 H150 M-150 -4 H150" />
        <path d="M-145 -250 V0 M145 -250 V0 M-60 -250 V-130 M60 -250 V-130 M0 -372 V-250" />
        <path d="M-145 -190 L-100 -250 M145 -190 L100 -250 M-145 -70 L-100 -130 M145 -70 L100 -130 M-60 -250 L-100 -300 M60 -250 L100 -300" />
      </g>
      <path d="M-184 -238 L0 -398 L184 -238 L156 -238 L0 -366 L-156 -238 Z" fill="#e76f51" />
      <path d="M-170 -244 L0 -388 M170 -244 L0 -388" stroke="#cf5c36" strokeWidth="4" />
      <path d="M-184 -238 L0 -398 L184 -238" stroke="#b5462d" strokeWidth="6" strokeLinejoin="round" fill="none" />
      {/* Round gable window */}
      <circle cx="0" cy="-306" r="20" fill={GLASS} stroke="#7f5539" strokeWidth="6" />
      <path d="M0 -326 V-286 M-20 -306 H20" stroke="#7f5539" strokeWidth="4" />
      {/* Upper window: the farmer's wife behind closed shutters */}
      <path d={WINDOW} fill={GLASS} />
      <Inside d={WINDOW}>
        <rect x="-20" y="-168" width="40" height="30" rx="10" fill="#e63946" />
        <circle cx="0" cy="-184" r="16" fill={SKIN} />
        <path d="M-17 -186 Q-18 -206 0 -206 Q18 -206 17 -186 Q8 -196 -17 -186 Z" fill="#c9184a" />
        <circle cx="-8" cy="-200" r="2" fill="#fff" />
        <circle cx="6" cy="-202" r="2" fill="#fff" />
        <Face cx={0} cy={-184} size={0.6} />
        <g className="bh-haus-arm" style={{ transformOrigin: "16px -160px" }}>
          <path d="M16 -160 L28 -194" stroke="#e63946" strokeWidth="9" strokeLinecap="round" />
          <circle cx="29" cy="-198" r="6" fill={SKIN} />
        </g>
      </Inside>
      <path d="M-36 -226 H36 V-152 H-36 Z M0 -226 V-152" stroke="#7f5539" strokeWidth="5" fill="none" />
      {[
        [-36, 1],
        [36, -1],
      ].map(([hinge, dir]) => (
        <g key={hinge} className="bh-haus-shutter" style={{ transformOrigin: `${hinge}px -189px` }}>
          <rect x={Math.min(hinge, 0)} y="-226" width="36" height="74" fill="#2a9d8f" stroke="#21867a" strokeWidth="3" />
          <path d={`M${hinge + 8 * dir} -214 H${-8 * dir} M${hinge + 8 * dir} -189 H${-8 * dir} M${hinge + 8 * dir} -164 H${-8 * dir}`} stroke="#21867a" strokeWidth="4" />
        </g>
      ))}
      <rect x="-44" y="-152" width="88" height="10" rx="3" fill="#bc6c25" />
      {/* Ground floor: windows with flower boxes, the door */}
      {[-112, 62].map((x) => (
        <g key={x}>
          <Pane x={x} y={-110} w={50} h={56} rx={4} />
          <path d={`M${x} -110 h50 v56 h-50 Z M${x + 25} -110 v56`} stroke="#7f5539" strokeWidth="4" fill="none" />
          {[8, 20, 32, 44].map((dx, i) => (
            <circle key={dx} cx={x + dx} cy={-56} r="6" fill={i % 2 ? "#ff5d73" : "#ffd60a"} />
          ))}
          <rect x={x - 4} y="-52" width="58" height="12" rx="3" fill="#bc6c25" />
        </g>
      ))}
      <path d="M-30 0 V-86 Q-30 -116 0 -116 Q30 -116 30 -86 V0 Z" fill="#2d6a4f" />
      <path d="M-22 -10 V-84 Q-22 -106 0 -106 Q22 -106 22 -84 V-10 Z" fill="none" stroke="#1b4332" strokeWidth="4" />
      <circle cx="18" cy="-52" r="4" fill="#ffd60a" />
      <circle cx="0" cy="-86" r="9" fill={GLASS} />
      <rect x="-42" y="-6" width="84" height="8" rx="3" fill="#adb5bd" />
    </>
  );
}

const STALL_DOOR = "M-26 -50 V-96 Q-26 -116 0 -116 Q26 -116 26 -96 V-50 Z";

/** Hen house on stilts; the little door opens and an egg rolls down the ramp. */
export function Huehnerstall() {
  return (
    <>
      <rect x="-82" y="-54" width="12" height="54" fill="#7f5539" />
      <rect x="70" y="-54" width="12" height="54" fill="#7f5539" />
      <rect x="-92" y="-150" width="184" height="104" rx="4" fill="#dda15e" />
      <path d="M-92 -124 H92 M-92 -98 H92 M-92 -72 H92" stroke="#bc8a5f" strokeWidth="3" />
      <rect x="-92" y="-56" width="184" height="10" fill="#bc8a5f" />
      <path d="M-114 -144 L0 -214 L114 -144 Z" fill="#c1121f" />
      <path d="M-114 -144 L0 -214 L114 -144" stroke="#9d0208" strokeWidth="6" strokeLinejoin="round" fill="none" />
      <circle cx="56" cy="-108" r="15" fill="#3d2314" />
      <path d="M48 -116 Q56 -126 64 -116" stroke="#e9c46a" strokeWidth="3" fill="none" />
      <path d={STALL_DOOR} fill="#3d2314" />
      <ellipse className="bh-stall-egg" cx="0" cy="-62" rx="9" ry="12" fill="#fff8e7" />
      <path className="bh-stall-door" d={STALL_DOOR} fill="#a0522d" style={{ transformOrigin: "-26px -83px" }} />
      <path d="M-30 -50 L-100 0 H-72 L-6 -50 Z" fill="#bc8a5f" />
      <path d="M-34 -40 h22 M-48 -30 h22 M-62 -20 h22 M-76 -10 h22" stroke="#8d5a2b" strokeWidth="3" />
      <path d="M-58 -130 c-6 -8 -16 0 -8 8 l8 8 l8 -8 c8 -8 -2 -16 -8 -8 Z" fill="#ff5d73" />
    </>
  );
}

/** Windmill on the hill far behind the field, in light colours; the sails turn. */
export function Windmuehle() {
  return (
    <>
      <path d="M-52 0 L-34 -196 H34 L52 0 Z" fill="#f4ece2" />
      <path d="M14 0 L12 -196 H34 L52 0 Z" fill="#e6d9c8" />
      <path d="M-12 0 V-30 Q-12 -44 0 -44 Q12 -44 12 -30 V0 Z" fill="#a98467" />
      <rect x="-8" y="-128" width="16" height="22" rx="3" fill="#a98467" />
      <rect x="-48" y="-152" width="96" height="8" rx="3" fill="#a98467" />
      <path d="M-42 -192 Q0 -252 42 -192 Z" fill="#b08968" />
      <g className="bh-muehle-sails" style={{ transformOrigin: "0px -214px" }}>
        {[45, 135, 225, 315].map((a) => (
          <g key={a} transform={`rotate(${a} 0 -214)`}>
            <rect x="-4" y="-334" width="8" height="120" fill="#9c6644" />
            <rect x="4" y="-326" width="26" height="98" fill="#fdfaf3" stroke="#b08968" strokeWidth="3" />
            <path d="M4 -302 h26 M4 -278 h26 M4 -254 h26 M17 -326 v98" stroke="#d5bdaf" strokeWidth="2" />
          </g>
        ))}
      </g>
      <circle cx="0" cy="-214" r="10" fill="#7f5539" />
    </>
  );
}

const COILS = [-36, -50, -64, -78, -92];

/** Straw beehive on a little stool; it wobbles and bees fly out. */
export function Bienenkorb() {
  return (
    <>
      <rect x="-38" y="-16" width="9" height="16" fill="#7f5539" />
      <rect x="29" y="-16" width="9" height="16" fill="#7f5539" />
      <rect x="-48" y="-26" width="96" height="11" rx="3" fill="#8d5a2b" />
      <g className="bh-korb-body" style={{ transformOrigin: "0px -26px" }}>
        <path d="M-42 -26 Q-46 -104 0 -108 Q46 -104 42 -26 Z" fill="#e9c46a" />
        {COILS.map((y) => {
          const w = 44 - ((y + 36) * (y + 36)) / 160;
          return <path key={y} d={`M${-w} ${y} Q0 ${y + 6} ${w} ${y}`} stroke="#d4a373" strokeWidth="4" fill="none" />;
        })}
        <ellipse cx="-14" cy="-84" rx="8" ry="14" fill="#fff" opacity="0.35" />
        <ellipse cx="0" cy="-38" rx="11" ry="8" fill="#3d2314" />
      </g>
      <g className="bh-korb-bees">
        {[0, 1, 2].map((i) => (
          <g key={i} style={nth(i)}>
            <ellipse cx="0" cy="-42" rx="6" ry="4.5" fill="#ffd60a" />
            <path d="M-1 -46 v8 M3 -46 v8" stroke={INK} strokeWidth="1.6" />
            <ellipse cx="-1" cy="-48" rx="4" ry="3" fill="#fff" opacity="0.8" />
          </g>
        ))}
      </g>
    </>
  );
}
