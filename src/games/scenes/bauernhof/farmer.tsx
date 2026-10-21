import { Face, GLASS, INK, Inside, Rider, SKIN, nth } from "../shared";

// The farmer's things: tractor, wheelbarrow and scarecrow. Foot point at (0, 0).

/** Big tractor wheel with tread blocks, centred on (cx, cy). */
function TractorWheel({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g className="bh-traktor-wheel" style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <circle cx={cx} cy={cy} r={r} fill="#2b2d42" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={cx - r * 0.12} y={cy - r - 3} width={r * 0.24} height={r * 0.2} rx="3" fill="#2b2d42" transform={`rotate(${i * 30} ${cx} ${cy})`} />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.58} fill="#ffd60a" />
      <circle cx={cx} cy={cy} r={r * 0.58} fill="none" stroke="#e9c46a" strokeWidth={r * 0.08} />
      <circle cx={cx} cy={cy} r={r * 0.22} fill="#adb5bd" />
      {[0, 90, 180, 270].map((a) => (
        <circle key={a} cx={cx + r * 0.38 * Math.cos((a * Math.PI) / 180)} cy={cy + r * 0.38 * Math.sin((a * Math.PI) / 180)} r={r * 0.06} fill="#c9a227" />
      ))}
    </g>
  );
}

const CAB = "M-122 -196 H-14 V-112 H-122 Z";

/** Red tractor, facing right, with the farmer in the cab; it drives a bit and puffs. */
export function Traktor() {
  return (
    <g className="bh-traktor-body">
      <g className="bh-traktor-puff" fill="#dee2e6">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={102 + i * 6} cy={-208 - i * 4} r={11 + i * 3} style={nth(i)} />
        ))}
      </g>
      <rect x="96" y="-200" width="11" height="72" rx="3" fill="#495057" />
      <path d="M-14 -134 H140 Q156 -134 158 -118 V-66 H-14 Z" fill="#e63946" />
      <path d="M-10 -126 H136" stroke="#fff" strokeWidth="5" opacity="0.4" strokeLinecap="round" />
      <rect x="146" y="-126" width="13" height="56" rx="3" fill="#343a40" />
      <path d="M149 -116 h7 M149 -104 h7 M149 -92 h7 M149 -80 h7" stroke="#6c757d" strokeWidth="3" />
      <circle cx="140" cy="-140" r="8" fill="#fff4d6" stroke="#adb5bd" strokeWidth="3" />
      <rect x="-136" y="-114" width="140" height="50" rx="6" fill="#e63946" />
      <rect x="-138" y="-218" width="134" height="16" rx="6" fill="#c1121f" />
      <path d={CAB} fill={GLASS} />
      <Inside d={CAB}>
        <Rider cx={-66} cy={-150} shirt="#4895ef" cap="#2d6a4f" />
      </Inside>
      <path d="M-100 -192 h14 L-112 -116 h-14 Z" fill="#fff" opacity="0.5" />
      <path d="M-128 -204 V-112 M-14 -204 V-112" stroke="#c1121f" strokeWidth="10" />
      <path d="M-172 -78 A92 92 0 0 1 12 -78" stroke="#c1121f" strokeWidth="16" fill="none" />
      <TractorWheel cx={-80} cy={-78} r={78} />
      <path d="M68 -42 A46 46 0 0 1 152 -42" stroke="#c1121f" strokeWidth="11" fill="none" />
      <TractorWheel cx={110} cy={-42} r={42} />
    </g>
  );
}

/** The farmer pushing a wheelbarrow full of vegetables; he whistles and lifts his hat. */
export function Bauer() {
  return (
    <g className="bh-bauer-walk">
      <path d="M-34 -78 L22 -62" stroke="#7f5539" strokeWidth="7" strokeLinecap="round" />
      <circle cx="30" cy="-106" r="16" fill="#95d5b2" />
      <circle cx="30" cy="-106" r="9" fill="#b7e4c7" />
      <circle cx="62" cy="-112" r="18" fill="#74c69d" />
      <circle cx="62" cy="-112" r="10" fill="#95d5b2" />
      {[84, 98].map((x) => (
        <g key={x}>
          <path d={`M${x} -100 L${x + 8} -130 L${x + 16} -100 Z`} fill="#f77f00" transform={`rotate(-20 ${x + 8} -110)`} />
          <path d={`M${x + 4} -128 l-6 -12 M${x + 8} -128 l2 -14`} stroke="#40916c" strokeWidth="4" strokeLinecap="round" transform={`rotate(-20 ${x + 8} -110)`} />
        </g>
      ))}
      <path d="M-2 -100 H122 L102 -50 H20 Z" fill="#2a9d8f" />
      <rect x="-6" y="-104" width="132" height="9" rx="4" fill="#21867a" />
      <path d="M36 -50 L28 0 M64 -50 L100 -24" stroke="#7f5539" strokeWidth="6" strokeLinecap="round" />
      <g className="bh-bauer-wheel" style={{ transformOrigin: "100px -24px" }}>
        <circle cx="100" cy="-24" r="24" fill="#2b2d42" />
        <circle cx="100" cy="-24" r="11" fill="#adb5bd" />
        <path d="M89 -24 H111 M100 -35 V-13" stroke="#6c757d" strokeWidth="3" />
      </g>
      {/* The farmer */}
      <rect x="-86" y="-74" width="18" height="66" rx="7" fill="#1d4e89" />
      <ellipse cx="-74" cy="-6" rx="15" ry="7" fill="#6b4423" />
      <rect x="-64" y="-74" width="18" height="66" rx="7" fill="#3a6ea5" />
      <ellipse cx="-50" cy="-6" rx="15" ry="7" fill="#6b4423" />
      <rect x="-96" y="-150" width="50" height="80" rx="18" fill="#e63946" />
      <path d="M-90 -130 H-52 M-90 -110 H-52 M-82 -146 V-74 M-64 -146 V-74" stroke="#c1121f" strokeWidth="3" />
      <path d="M-92 -116 H-50 V-70 H-92 Z" fill="#3a6ea5" />
      <path d="M-88 -116 L-84 -146 M-54 -116 L-58 -146" stroke="#3a6ea5" strokeWidth="6" />
      <circle cx="-71" cy="-104" r="3" fill="#ffd60a" />
      <path d="M-56 -132 L-34 -84" stroke="#e63946" strokeWidth="13" strokeLinecap="round" />
      <circle cx="-32" cy="-80" r="7.5" fill={SKIN} />
      <circle cx="-70" cy="-170" r="22" fill={SKIN} />
      <path d="M-86 -160 Q-70 -144 -54 -160 Q-60 -148 -70 -148 Q-80 -148 -86 -160 Z" fill="#a0522d" />
      <Face cx={-66} cy={-172} size={0.7} />
      <g className="bh-bauer-hat" style={{ transformOrigin: "-70px -186px" }}>
        <ellipse cx="-70" cy="-186" rx="38" ry="8" fill="#e9c46a" />
        <path d="M-90 -186 Q-90 -212 -70 -212 Q-50 -212 -50 -186 Z" fill="#e9c46a" />
        <rect x="-90" y="-196" width="40" height="7" fill="#e63946" />
        <path d="M-102 -186 h64" stroke="#d4a373" strokeWidth="2" />
      </g>
      <g className="bh-bauer-notes" fill={INK} fontSize="24" fontWeight="700">
        <text x="-44" y="-184" style={nth(0)}>
          ♪
        </text>
        <text x="-26" y="-204" style={nth(1)}>
          ♫
        </text>
      </g>
    </g>
  );
}

/** A crow sitting on the scarecrow's arm at (x, y), facing right if dir is 1. */
function Crow({ x, y, dir, i }: { x: number; y: number; dir: number; i: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${dir} 1)`}>
      <g className="bh-scheuche-crow" style={nth(i)}>
        <path d="M-12 -10 L-24 -4 L-12 -2 Z" fill="#343a40" />
        <ellipse cx="0" cy="-10" rx="13" ry="9" fill="#343a40" />
        <circle cx="10" cy="-20" r="7" fill="#343a40" />
        <path d="M16 -22 L24 -19 L16 -17 Z" fill="#ffb703" />
        <circle cx="12" cy="-22" r="2.2" fill="#fff" />
        <circle cx="12.5" cy="-22" r="1.1" fill={INK} />
      </g>
    </g>
  );
}

/** Scarecrow in the cornfield with two cheeky crows; it wobbles, the hat jumps, the crows hop up. */
export function Vogelscheuche() {
  return (
    <>
      <g className="bh-scheuche-body" style={{ transformOrigin: "0px 0px" }}>
        <rect x="-5" y="-150" width="10" height="150" fill="#8d5a2b" />
        <rect x="-72" y="-152" width="144" height="9" rx="3" fill="#8d5a2b" />
        <path d="M-84 -150 l12 -4 M-84 -146 h12 M-84 -142 l12 4 M84 -150 l-12 -4 M84 -146 h-12 M84 -142 l-12 4" stroke="#e9c46a" strokeWidth="3" strokeLinecap="round" />
        <path d="M-26 -88 H26 L22 -40 H6 L0 -66 L-6 -40 H-22 Z" fill="#4895ef" />
        <path d="M-22 -40 l-4 10 M-14 -40 v10 M14 -40 v10 M22 -40 l4 10" stroke="#e9c46a" strokeWidth="3" strokeLinecap="round" />
        <path d="M-64 -160 H64 L60 -136 H26 L30 -84 H-30 L-26 -136 H-60 Z" fill="#e63946" />
        <path d="M-50 -160 V-136 M-30 -160 V-84 M-10 -160 V-84 M10 -160 V-84 M30 -160 V-84 M50 -160 V-136 M-60 -148 H60 M-28 -120 H28 M-28 -100 H28" stroke="#9d0208" strokeWidth="2.5" />
        <rect x="-18" y="-124" width="14" height="14" fill="#ffd60a" transform="rotate(8 -11 -117)" />
        <circle cx="0" cy="-180" r="22" fill="#ede0d4" />
        <path d="M-12 -182 h6 M6 -182 h6" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <path d="M0 -178 L12 -174 L0 -170 Z" fill="#f77f00" />
        <path d="M-10 -168 Q0 -160 10 -168" stroke={INK} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" fill="none" />
        <g className="bh-scheuche-hat" style={{ transformOrigin: "0px -198px" }}>
          <ellipse cx="0" cy="-198" rx="34" ry="7" fill="#bc6c25" />
          <path d="M-20 -198 Q-20 -226 0 -226 Q20 -226 20 -198 Z" fill="#bc6c25" />
          <rect x="-20" y="-206" width="40" height="6" fill="#e63946" />
          <path d="M14 -206 l10 -12" stroke="#e9c46a" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>
      <Crow x={-52} y={-152} dir={-1} i={0} />
      <Crow x={50} y={-152} dir={1} i={1} />
    </>
  );
}
