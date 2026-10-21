import { Face, GLASS, INK, Inside, Pane, Rider, SKIN, Wheel, nth } from "../shared";

// Vehicles. Each drawing has its foot point (the middle between the wheels, on the
// ground) at (0, 0). In the far lane they drive left, in the near lane right.

/** A wheel that turns while its vehicle plays (class st-wheel). */
function TurningWheel({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g className="st-wheel" style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <Wheel cx={cx} cy={cy} r={r} />
    </g>
  );
}

/** Sound lines in front of a horn or a bell, shown while it sounds. */
function Toot({ x, y, dir = 1, className }: { x: number; y: number; dir?: 1 | -1; className: string }) {
  return (
    <g className={className} fill="none" stroke="#ffd60a" strokeWidth="4" strokeLinecap="round">
      <path d={`M${x} ${y - 10} q${8 * dir} 10 0 20`} style={nth(0)} />
      <path d={`M${x + 12 * dir} ${y - 16} q${12 * dir} 16 0 32`} style={nth(1)} />
    </g>
  );
}

/** Mudguard arc over a wheel. */
const guard = (cx: number, cy: number, r: number) => `M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}`;

const PASSENGERS = [
  { x: -92, shirt: "#ff5d73", hair: "#e9c46a" },
  { x: -22, shirt: "#06d6a0", hair: "#2b2d42" },
  { x: 48, shirt: "#9d4edd", hair: "#dee2e6" },
  { x: 118, shirt: "#ffb703", hair: "#bc6c25" },
];

/** City bus, driving left; the doors fold open. */
export function Bus() {
  return (
    <g className="st-bus-body">
      <rect x="-212" y="-206" width="424" height="172" rx="24" fill="#4cc9f0" />
      <rect x="-212" y="-84" width="424" height="50" rx="16" fill="#3aa6c9" />
      <rect x="-212" y="-94" width="424" height="10" fill="#fff" />
      <rect x="-196" y="-201" width="392" height="9" rx="4" fill="#90e0ef" />
      <Pane x={-206} y={-186} w={50} h={86} rx={10}>
        <g className="st-bus-driver">
          <Rider cx={-178} cy={-140} shirt="#3a86ff" cap="#1d3557" />
        </g>
      </Pane>
      {/* Behind the doors: a passenger getting on */}
      <Inside d="M-150 -186 h48 v152 h-48 Z">
        <rect x="-150" y="-186" width="48" height="152" fill="#495057" />
        <g className="st-bus-guest">
          <rect x="-140" y="-118" width="28" height="56" rx="10" fill="#ff8fab" />
          <rect x="-138" y="-64" width="10" height="30" rx="4" fill={INK} />
          <rect x="-124" y="-64" width="10" height="30" rx="4" fill={INK} />
          <circle cx="-126" cy="-132" r="14" fill={SKIN} />
          <path d="M-140 -134 Q-140 -150 -126 -149 Q-112 -150 -112 -134 Q-120 -142 -140 -134 Z" fill="#2b2d42" />
          <Face cx={-126} cy={-133} size={0.5} />
        </g>
      </Inside>
      <rect className="st-bus-door" x="-150" y="-186" width="24" height="152" rx="3" fill={GLASS} stroke="#3aa6c9" strokeWidth="4" style={{ transformOrigin: "-150px -110px" }} />
      <rect className="st-bus-door" x="-126" y="-186" width="24" height="152" rx="3" fill={GLASS} stroke="#3aa6c9" strokeWidth="4" style={{ transformOrigin: "-102px -110px" }} />
      {PASSENGERS.map(({ x, shirt, hair }, i) => (
        <Pane key={x} x={x} y={-186} w={60} h={70} rx={8}>
          <g className="st-bus-passenger" style={nth(i)}>
            <Rider cx={x + 30} cy={-148} shirt={shirt} hair={hair} />
          </g>
        </Pane>
      ))}
      <rect x="-214" y="-74" width="10" height="16" rx="4" fill="#fff4d6" />
      <rect className="st-bus-blink" x="-216" y="-52" width="10" height="10" rx="3" fill="#ffb703" />
      <rect className="st-bus-blink" x="206" y="-52" width="10" height="10" rx="3" fill="#ffb703" />
      <rect x="204" y="-74" width="10" height="16" rx="4" fill="#ff5d73" />
      <path d={`${guard(-60, -32, 38)} ${guard(130, -32, 38)}`} stroke="#2b2d42" strokeWidth="8" fill="none" />
      <TurningWheel cx={-60} cy={-30} r={30} />
      <TurningWheel cx={130} cy={-30} r={30} />
    </g>
  );
}

const POLICE_FRONT = "M-72 -76 Q-62 -114 -34 -116 H4 V-76 Z";
const POLICE_BACK = "M14 -76 V-116 H44 Q72 -114 84 -76 Z";

/** Police car, driving left; the blue light glows. */
export function Polizei() {
  return (
    <g className="st-polizei-body">
      <ellipse className="st-polizei-glow" cx="0" cy="-131" rx="44" ry="20" fill="#4cc9f0" />
      <rect x="-22" y="-138" width="44" height="14" rx="6" fill="#3a86ff" />
      <rect className="st-polizei-light" x="-22" y="-138" width="44" height="14" rx="6" fill="#9bf6ff" />
      <path className="st-polizei-antenna" d="M70 -118 L80 -170" stroke={INK} strokeWidth="3" strokeLinecap="round" style={{ transformOrigin: "70px -118px" }} />
      <path d="M-86 -72 Q-74 -124 -36 -126 H46 Q82 -124 98 -72 Z" fill="#f8f9fa" />
      <path d={POLICE_FRONT} fill={GLASS} />
      <Inside d={POLICE_FRONT}>
        <g className="st-polizei-driver">
          <Rider cx={-22} cy={-94} shirt="#1d3557" cap="#1d3557" />
        </g>
      </Inside>
      <path d={POLICE_BACK} fill={GLASS} />
      <path d="M-44 -110 h8 L-48 -78 h-8 Z M28 -112 h8 L24 -78 h-8 Z" fill="#fff" opacity="0.5" />
      <rect x="-130" y="-82" width="260" height="58" rx="18" fill="#f8f9fa" />
      <rect x="-130" y="-64" width="260" height="15" fill="#3a86ff" />
      <text x="10" y="-56" fill="#fff" fontSize="12" fontWeight="800" textAnchor="middle" dominantBaseline="central" letterSpacing="1.5">
        POLIZEI
      </text>
      <path d="M4 -82 V-28" stroke="#dee2e6" strokeWidth="3" />
      <ellipse className="st-polizei-beam" cx="-150" cy="-72" rx="26" ry="12" fill="#fff3b0" />
      <rect x="-132" y="-78" width="10" height="12" rx="3" fill="#fff4d6" />
      <rect x="122" y="-78" width="10" height="12" rx="3" fill="#ff5d73" />
      <path d={`${guard(-80, -24, 32)} ${guard(82, -24, 32)}`} stroke="#2b2d42" strokeWidth="7" fill="none" />
      <TurningWheel cx={-80} cy={-24} r={24} />
      <TurningWheel cx={82} cy={-24} r={24} />
    </g>
  );
}

const CAR_BACK = "M-66 -74 Q-56 -108 -30 -110 H-4 V-74 Z";
const CAR_FRONT = "M6 -74 V-110 H32 Q60 -108 70 -74 Z";

/** Little red car, driving right; it hops and toots. */
export function Auto() {
  return (
    <g className="st-auto-body">
      <g className="st-auto-puff" fill="#dee2e6">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx="-132" cy="-34" r="10" style={nth(i)} />
        ))}
      </g>
      <path d="M-80 -70 Q-66 -118 -30 -120 H34 Q70 -118 84 -70 Z" fill="#ff5d73" />
      <path d={CAR_BACK} fill={GLASS} />
      <path d={CAR_FRONT} fill={GLASS} />
      <Inside d={CAR_FRONT}>
        <g className="st-auto-driver">
          <Rider cx={32} cy={-92} shirt="#ffd60a" hair="#2b2d42" />
        </g>
      </Inside>
      <path d="M-30 -106 h8 L-34 -78 h-8 Z M44 -106 h8 L40 -78 h-8 Z" fill="#fff" opacity="0.5" />
      <rect x="-120" y="-80" width="240" height="56" rx="18" fill="#ff5d73" />
      <rect x="-110" y="-76" width="220" height="6" rx="3" fill="#ff8fa3" />
      <path d="M0 -80 V-30" stroke="#e63950" strokeWidth="3" />
      <rect x="10" y="-70" width="14" height="4" rx="2" fill="#e63950" />
      <rect x="-128" y="-38" width="12" height="7" rx="2" fill="#6c757d" />
      <rect x="112" y="-72" width="10" height="13" rx="4" fill="#fff4d6" />
      <rect x="-122" y="-72" width="8" height="12" rx="3" fill="#c1121f" />
      <ellipse className="st-auto-beam" cx="140" cy="-66" rx="24" ry="12" fill="#fff3b0" />
      <Toot x={136} y={-96} className="st-auto-toot" />
      <path d={`${guard(-70, -24, 32)} ${guard(70, -24, 32)}`} stroke="#2b2d42" strokeWidth="7" fill="none" />
      <TurningWheel cx={-70} cy={-24} r={24} />
      <TurningWheel cx={70} cy={-24} r={24} />
    </g>
  );
}

const FIRE_CAB = "M110 -178 H166 Q190 -178 198 -130 H110 Z";

/** Fire engine, driving right; the ladder goes up. */
export function Feuerwehr() {
  return (
    <g className="st-feuer-body">
      <g className="st-feuer-ladder" style={{ transformOrigin: "-176px -170px" }}>
        <path d="M-196 -168 H86 M-196 -188 H86" stroke="#adb5bd" strokeWidth="6" strokeLinecap="round" />
        <path d={Array.from({ length: 13 }, (_, i) => `M${-186 + i * 22} -168 V-188`).join(" ")} stroke="#adb5bd" strokeWidth="4" />
      </g>
      <rect x="-186" y="-172" width="22" height="18" rx="3" fill={INK} />
      <path d="M62 -160 V-170" stroke={INK} strokeWidth="6" />
      <rect x="-212" y="-62" width="424" height="26" rx="6" fill={INK} />
      <rect x="-204" y="-160" width="296" height="112" rx="10" fill="#e63946" />
      {/* A locker with a roller shutter: hose and helmet inside */}
      <rect x="-126" y="-148" width="66" height="48" rx="3" fill="#343a40" />
      <path d="M-116 -110 Q-112 -140 -100 -140" stroke="#adb5bd" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M-90 -112 Q-90 -132 -78 -132 Q-66 -132 -66 -112 Z" fill="#ffd60a" />
      <g className="st-feuer-shutter" style={{ transformOrigin: "-93px -148px" }}>
        <rect x="-126" y="-148" width="66" height="48" rx="3" fill="#e63946" />
        <path d="M-126 -136 H-60 M-126 -124 H-60 M-126 -112 H-60" stroke="#c1121f" strokeWidth="3" />
      </g>
      <path d="M-130 -150 V-62 M-56 -150 V-62 M18 -150 V-62" stroke="#c1121f" strokeWidth="4" />
      <rect x="-204" y="-98" width="296" height="10" fill="#fff" />
      <g className="st-feuer-reel" style={{ transformOrigin: "54px -124px" }}>
        <circle cx="54" cy="-124" r="20" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="4" />
        <circle cx="54" cy="-124" r="8" fill="none" stroke="#adb5bd" strokeWidth="3" />
        <path d="M54 -142 V-132 M54 -116 V-106 M36 -124 H46 M62 -124 H72" stroke="#adb5bd" strokeWidth="3" />
      </g>
      <circle className="st-feuer-glow" cx="146" cy="-198" r="34" fill="#4cc9f0" />
      <rect x="118" y="-204" width="56" height="12" rx="5" fill="#3a86ff" />
      <rect className="st-feuer-light" x="118" y="-204" width="56" height="12" rx="5" fill="#9bf6ff" />
      <path d="M96 -48 V-178 Q96 -192 112 -192 H170 Q202 -192 208 -146 L214 -48 Z" fill="#e63946" />
      <path d={FIRE_CAB} fill={GLASS} />
      <Inside d={FIRE_CAB}>
        <g className="st-feuer-driver">
          <Rider cx={150} cy={-148} shirt="#1d3557" cap="#ffd60a" />
        </g>
      </Inside>
      <path d="M170 -176 h8 L162 -132 h-8 Z" fill="#fff" opacity="0.5" />
      <rect x="96" y="-62" width="120" height="14" rx="4" fill="#c1121f" />
      <rect x="206" y="-88" width="10" height="16" rx="4" fill="#fff4d6" />
      <path d={`${guard(-140, -34, 38)} ${guard(-64, -34, 38)} ${guard(150, -34, 38)}`} stroke="#2b2d42" strokeWidth="8" fill="none" />
      <TurningWheel cx={-140} cy={-32} r={32} />
      <TurningWheel cx={-64} cy={-32} r={32} />
      <TurningWheel cx={150} cy={-32} r={32} />
    </g>
  );
}

const BIN_CAB = "M98 -170 H146 Q170 -170 178 -126 H98 Z";

/** Garbage truck, driving right; it lifts the bin at the back over the hopper and empties it. */
export function Muellauto() {
  return (
    <>
      <g className="st-muell-body">
        <rect x="-186" y="-62" width="380" height="26" rx="6" fill={INK} />
        <path d="M-176 -60 L-200 -60 L-204 -122 L-176 -132 Z" fill="#f77f00" />
        <path className="st-muell-lid" d="M-176 -132 L-206 -122 L-204 -114 L-176 -124 Z" fill="#e06c00" style={{ transformOrigin: "-176px -128px" }} />
        <path d="M-176 -48 V-176 Q-176 -196 -156 -196 H80 V-48 Z" fill="#ff8c42" />
        <path d="M-120 -190 V-56 M-60 -192 V-56 M0 -192 V-56" stroke="#f77f00" strokeWidth="6" />
        <path d="M-160 -184 H70" stroke="#ffb07c" strokeWidth="5" strokeLinecap="round" />
        <rect x="-176" y="-88" width="256" height="9" fill="#fff" />
        <ellipse className="st-muell-glow" cx="133" cy="-196" rx="26" ry="14" fill="#ffd60a" />
        <rect className="st-muell-beacon" x="120" y="-194" width="26" height="10" rx="4" fill="#ffd60a" style={{ transformOrigin: "133px -189px" }} />
        <path d="M84 -48 V-170 Q84 -184 100 -184 H150 Q182 -184 188 -140 L194 -48 Z" fill="#ff8c42" />
        <path d={BIN_CAB} fill={GLASS} />
        <Inside d={BIN_CAB}>
          <g className="st-muell-driver">
            <Rider cx={132} cy={-142} shirt="#ff8c42" hair="#8d5a2b" />
          </g>
        </Inside>
        <path d="M150 -168 h8 L144 -128 h-8 Z" fill="#fff" opacity="0.5" />
        <rect x="186" y="-86" width="10" height="16" rx="4" fill="#fff4d6" />
        <path d={`${guard(-110, -34, 38)} ${guard(136, -34, 38)}`} stroke="#2b2d42" strokeWidth="8" fill="none" />
        <TurningWheel cx={-110} cy={-32} r={32} />
        <TurningWheel cx={136} cy={-32} r={32} />
      </g>
      <g className="st-muell-bin" style={{ transformOrigin: "-200px -128px" }}>
        <path d="M-200 -128 L-212 -110" stroke={INK} strokeWidth="6" strokeLinecap="round" />
        <rect x="-236" y="-110" width="36" height="52" rx="4" fill="#2a9d8f" />
        <rect x="-240" y="-116" width="44" height="8" rx="3" fill="#21867a" />
        <circle cx="-226" cy="-56" r="5" fill={INK} />
        {/* Rubbish that tumbles out when the bin is upside down */}
        <g className="st-muell-junk">
          <circle cx="-226" cy="-100" r="7" fill="#f8f9fa" stroke="#ced4da" strokeWidth="2" style={nth(0)} />
          <path d="M-214 -96 q-2 -14 6 -18 q2 10 -2 18 Z" fill="#ffd60a" style={nth(1)} />
          <rect x="-234" y="-90" width="10" height="12" rx="2" fill="#4cc9f0" style={nth(2)} />
        </g>
      </g>
    </>
  );
}

/** Wheel of the bicycle with spokes that turn. */
function Spokes({ cx }: { cx: number }) {
  return (
    <>
      <circle cx={cx} cy="-30" r="28" fill="none" stroke="#2b2d42" strokeWidth="6" />
      <g className="st-rad-wheel" style={{ transformOrigin: `${cx}px -30px` }} stroke="#adb5bd" strokeWidth="2">
        <path d={`M${cx - 25} -30 H${cx + 25} M${cx} -55 V-5 M${cx - 18} -48 L${cx + 18} -12 M${cx + 18} -48 L${cx - 18} -12`} />
      </g>
      <circle cx={cx} cy="-30" r="4" fill={INK} />
    </>
  );
}

/** A cyclist with a helmet, riding left. */
export function Fahrrad() {
  return (
    <g className="st-rad-body">
      <Spokes cx={44} />
      <Spokes cx={-50} />
      <path d="M44 -30 L0 -30 L30 -86 Z M0 -30 L-30 -90 M30 -84 L-28 -88 M-30 -90 L-50 -30" stroke="#ff5d73" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" fill="none" />
      <path d="M-30 -90 L-36 -106 H-50" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
      <circle className="st-rad-bell" cx="-44" cy="-110" r="4" fill="#ffd60a" />
      <Toot x={-56} y={-118} dir={-1} className="st-rad-ring" />
      <rect x="20" y="-96" width="26" height="7" rx="3" fill={INK} />
      {/* Rider */}
      <path d="M30 -98 L6 -62 L4 -36" stroke="#1d3557" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M30 -98 L-4 -138" stroke="#ffb703" strokeWidth="24" strokeLinecap="round" />
      <path d="M-4 -132 L-40 -108" stroke="#ffb703" strokeWidth="9" strokeLinecap="round" />
      <circle cx="-42" cy="-107" r="5" fill={SKIN} />
      <g className="st-rad-head" style={{ transformOrigin: "-10px -142px" }}>
        <circle cx="-14" cy="-156" r="16" fill={SKIN} />
        <path d="M-32 -158 Q-32 -178 -12 -178 Q8 -178 6 -156 Z" fill="#06d6a0" />
        <circle cx="-23" cy="-155" r="2.4" fill="#2b2d42" />
        <circle cx="-20" cy="-148" r="4" fill="#ff8fa3" opacity="0.55" />
        <path d="M-26 -147 Q-22 -144 -19 -146" stroke="#2b2d42" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      </g>
      <g className="st-rad-pedal" style={{ transformOrigin: "0px -30px" }}>
        <path d="M-12 -30 H12" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <rect x="-18" y="-33" width="10" height="6" rx="2" fill="#495057" />
        <rect x="8" y="-33" width="10" height="6" rx="2" fill="#495057" />
      </g>
    </g>
  );
}

const COCKPIT = "M-24 -22 Q-16 -40 8 -40 Q22 -40 26 -22 Z";

/** A small propeller plane, flying left. Its middle is at (0, 0). */
export function Flugzeug() {
  return (
    <g className="st-flug-body">
      <g className="st-flug-puffs" fill="#fff">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx="100" cy="0" r="9" style={nth(i)} />
        ))}
      </g>
      <path className="st-flug-rudder" d="M58 -4 L80 -36 H94 L88 2 Z" fill="#ff5d73" style={{ transformOrigin: "70px 0px" }} />
      <path d={COCKPIT} fill={GLASS} />
      <Inside d={COCKPIT}>
        <g className="st-flug-pilot">
          <circle cx="2" cy="-28" r="9" fill={SKIN} />
          <path d="M-8 -30 Q-8 -40 2 -40 Q12 -40 12 -30 Z" fill="#8d5a2b" />
          <rect x="-8" y="-32" width="10" height="5" rx="2" fill="#4cc9f0" />
        </g>
      </Inside>
      <path d="M-62 0 Q-62 -20 -36 -22 H60 Q92 -16 92 0 Q88 14 60 14 H-36 Q-62 14 -62 0 Z" fill="#fff" />
      <rect x="-50" y="-4" width="134" height="6" rx="3" fill="#ff5d73" />
      <path d="M-20 6 H14 L38 30 H8 Z" fill="#ffd60a" />
      <path d="M-26 -10 H20 L6 -18 H-16 Z" fill="#ffc300" />
      <circle cx="-64" cy="0" r="6" fill={INK} />
      <path className="st-flug-prop" d="M-66 -24 V24" stroke={INK} strokeWidth="6" strokeLinecap="round" style={{ transformOrigin: "-66px 0px" }} />
    </g>
  );
}

/** Ice cream cart with a parasol and an ice cream seller. */
export function Eiswagen() {
  return (
    <>
      <rect x="6" y="-138" width="44" height="50" rx="14" fill="#fff" />
      <g className="st-eis-arm" style={{ transformOrigin: "46px -128px" }}>
        <path d="M46 -128 L62 -148" stroke="#fff" strokeWidth="9" strokeLinecap="round" />
        <circle cx="64" cy="-151" r="5" fill={SKIN} />
      </g>
      <g className="st-eis-seller" style={{ transformOrigin: "28px -140px" }}>
        <circle cx="28" cy="-154" r="16" fill={SKIN} />
        <Face cx={28} cy={-156} size={0.6} />
        <path d="M12 -164 L16 -180 H40 L44 -164 Z" fill="#fff" stroke="#ffafcc" strokeWidth="3" />
      </g>
      <path d="M-30 -100 V-206" stroke="#adb5bd" strokeWidth="5" />
      <g className="st-eis-schirm" style={{ transformOrigin: "-30px -206px" }}>
        <path d="M-110 -188 Q-30 -250 50 -188 Z" fill="#ff8fab" />
        <path d="M-30 -219 L-84 -188 H-57 Z M-30 -219 L-3 -188 H24 Z" fill="#fff" />
        <path d="M-110 -188 q10 8 20 0 q10 8 20 0 q10 8 20 0 q10 8 20 0 q10 8 20 0 q10 8 20 0 q10 8 20 0 q10 8 20 0" fill="#ff8fab" />
        <circle cx="-30" cy="-222" r="5" fill="#ff8fab" />
      </g>
      <g className="st-eis-cones">
        {[
          [-64, "#ff8fab"],
          [-42, "#8d5a2b"],
          [-20, "#fff3b0"],
        ].map(([x, color], i) => (
          <g key={x} style={nth(i)}>
            <path d={`M${Number(x) - 8} -112 L${x} -94 L${Number(x) + 8} -112 Z`} fill="#e9c46a" />
            <circle cx={x} cy="-118" r="10" fill={String(color)} />
          </g>
        ))}
      </g>
      <rect className="st-eis-lid" x="-86" y="-108" width="172" height="12" rx="5" fill="#f8f9fa" style={{ transformOrigin: "86px -102px" }} />
      <rect x="-80" y="-98" width="160" height="72" rx="12" fill="#ffafcc" />
      <path d="M-56 -98 V-26 M-24 -98 V-26 M8 -98 V-26 M40 -98 V-26" stroke="#ffc8dd" strokeWidth="10" />
      <circle cx="0" cy="-64" r="18" fill="#fff" />
      <path d="M-7 -66 L0 -50 L7 -66 Z" fill="#e9c46a" />
      <circle cx="0" cy="-70" r="7" fill="#ff8fab" />
      <path d="M80 -84 H104" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <TurningWheel cx={-48} cy={-22} r={22} />
      <TurningWheel cx={48} cy={-22} r={22} />
    </>
  );
}

/** A pram with a baby; it rocks. */
export function Kinderwagen() {
  return (
    <g className="st-wagen-body" style={{ transformOrigin: "0px -40px" }}>
      <path d="M-64 -92 L-92 -140 H-106" stroke={INK} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M-40 -42 L-46 -20 M40 -42 L46 -20" stroke={INK} strokeWidth="5" />
      <TurningWheel cx={-46} cy={-17} r={17} />
      <TurningWheel cx={46} cy={-17} r={17} />
      <path d="M-64 -92 H64 Q64 -36 0 -36 Q-64 -36 -64 -92 Z" fill="#9d4edd" />
      <path d="M-54 -78 Q0 -50 54 -78" stroke="#c77dff" strokeWidth="5" fill="none" />
      <g className="st-wagen-hand" style={{ transformOrigin: "40px -88px" }}>
        <path d="M40 -88 L46 -108" stroke="#ffafcc" strokeWidth="7" strokeLinecap="round" />
        <circle cx="47" cy="-111" r="5" fill={SKIN} />
      </g>
      <circle cx="20" cy="-102" r="15" fill={SKIN} />
      <path d="M14 -116 q6 -6 10 2" stroke="#e9c46a" strokeWidth="3" strokeLinecap="round" fill="none" />
      <Face cx={20} cy={-104} size={0.55} />
      <path d="M-8 -96 Q24 -84 62 -94 L64 -84 Q22 -76 -8 -86 Z" fill="#ffafcc" />
      <g className="st-wagen-hood" style={{ transformOrigin: "0px -92px" }}>
        <path d="M-66 -92 Q-66 -152 -4 -150 L0 -92 Z" fill="#7b2cbf" />
        <path d="M-34 -146 L-24 -92 M-58 -126 L-34 -92" stroke="#9d4edd" strokeWidth="4" />
        {/* A rattle hangs from the hood and swings */}
        <g className="st-wagen-toy" style={{ transformOrigin: "-4px -146px" }}>
          <path d="M-4 -146 L4 -126" stroke="#adb5bd" strokeWidth="2" />
          <circle cx="5" cy="-120" r="7" fill="#ffd60a" />
          <circle cx="5" cy="-120" r="3" fill="#ff5d73" />
        </g>
      </g>
    </g>
  );
}
