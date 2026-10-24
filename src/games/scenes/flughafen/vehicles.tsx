import { Hideout } from "../hideout";
import { Face, GLASS, INK, Inside, Pane, Rider, SKIN, STEEL, nth } from "../shared";
import { Beacon, NAVY, RAIL_RED, SIGNAL_ORANGE, Suitcase, Toot, TurningWheel, guard } from "./parts";

// Vehicles on the apron and the forecourt. Each drawing has its foot point (between the
// wheels, on the ground) at (0, 0). On the apron they face right, on the road left.

const STEPS = Array.from({ length: 8 }, (_, i) => i);
const STAIR_CAB = "M-126 -128 H-84 Q-74 -128 -74 -118 V-92 H-126 Z";

/** The stairs truck: its stairs lift up as if reaching a plane's door, the beacon flashes. */
export function Treppenwagen() {
  return (
    <>
      <g className="fh-treppe-stairs" style={{ transformOrigin: "-60px -64px" }}>
        <path
          d={`M-60 -64 ${STEPS.map((i) => `L${-60 + i * 22} ${-82 - i * 17} H${-38 + i * 22}`).join(" ")} L118 -200 H146 V-188 H122 L-20 -64 Z`}
          fill="#f8f9fa"
          stroke="#ced4da"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M-56 -120 L106 -246 M106 -246 V-200 M146 -246 V-188 M106 -246 H146 M-4 -160 V-118 M50 -202 V-160"
          stroke={STEEL}
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <circle className="fh-treppe-guest" cx="128" cy="-222" r="12" fill={SKIN} />
      </g>
      <rect x="-130" y="-70" width="270" height="34" rx="8" fill="#3a86ff" />
      <rect x="-130" y="-58" width="270" height="8" fill="#fff" />
      <path d="M-130 -60 V-122 Q-130 -136 -116 -136 H-84 Q-64 -136 -64 -116 V-60 Z" fill="#3a86ff" />
      <path d={STAIR_CAB} fill={GLASS} />
      <Inside d={STAIR_CAB}>
        <g className="fh-treppe-driver">
          <Rider cx={-102} cy={-104} shirt={SIGNAL_ORANGE} hair="#6b4423" />
        </g>
      </Inside>
      <Beacon x={-98} y={-136} name="treppe" />
      <path d={`${guard(-92, -36, 30)} ${guard(96, -36, 30)}`} stroke="#2b2d42" strokeWidth="7" fill="none" />
      <TurningWheel cx={-92} cy={-24} r={24} />
      <TurningWheel cx={96} cy={-24} r={24} />
    </>
  );
}

const VEST_GREEN = "#2dc653";
const TANK_CAB = "M100 -140 H134 Q156 -140 162 -104 H100 Z";

/** The fuel truck: the hose reel unwinds, fuel drips from the nozzle and the gauge needle swings. */
export function Tankwagen() {
  return (
    <g className="fh-tank-body" style={{ transformOrigin: "0px 0px" }}>
      <rect x="-166" y="-62" width="340" height="24" rx="6" fill={INK} />
      <rect x="-160" y="-152" width="246" height="96" rx="44" fill="#f8f9fa" />
      <path d="M-150 -86 H76" stroke={RAIL_RED} strokeWidth="12" />
      <ellipse cx="-120" cy="-128" rx="16" ry="6" fill="#fff" opacity="0.8" />
      {/* Fuel drop sign and gauge on the tank */}
      <path d="M-30 -136 Q-46 -114 -30 -104 Q-14 -114 -30 -136 Z" fill="#2dc653" />
      <circle cx="30" cy="-120" r="18" fill="#fff" stroke="#adb5bd" strokeWidth="4" />
      <path d="M16 -120 A14 14 0 0 1 44 -120" stroke="#2dc653" strokeWidth="4" fill="none" />
      <g className="fh-tank-needle" style={{ transformOrigin: "30px -120px" }}>
        <path d="M30 -120 L20 -130" stroke={RAIL_RED} strokeWidth="3" strokeLinecap="round" />
      </g>
      <circle cx="30" cy="-120" r="3" fill={INK} />
      {/* The hose reel at the back, the hose hanging down to the nozzle */}
      <g className="fh-tank-reel" style={{ transformOrigin: "-148px -52px" }}>
        <circle cx="-148" cy="-52" r="22" fill="#495057" />
        <circle cx="-148" cy="-52" r="15" fill="none" stroke="#2b2d42" strokeWidth="6" />
        <path d="M-148 -72 V-32 M-168 -52 H-128" stroke="#868e96" strokeWidth="3" />
      </g>
      <g className="fh-tank-hose" style={{ transformOrigin: "-168px -52px" }}>
        <path d="M-168 -52 Q-196 -40 -192 -12" stroke="#2b2d42" strokeWidth="7" fill="none" strokeLinecap="round" />
        <rect x="-200" y="-14" width="16" height="12" rx="3" fill="#ffd60a" />
        <g className="fh-tank-drops" fill="#ffd60a">
          {[0, 1, 2].map((i) => (
            <ellipse key={i} cx="-192" cy="4" rx="3" ry="5" style={nth(i)} />
          ))}
        </g>
      </g>
      <path d="M86 -38 V-136 Q86 -150 100 -150 H136 Q166 -150 172 -110 L176 -38 Z" fill={RAIL_RED} />
      <path d={TANK_CAB} fill={GLASS} />
      <Inside d={TANK_CAB}>
        <g className="fh-tank-driver">
          <Rider cx={126} cy={-114} shirt={VEST_GREEN} hair="#2b2d42" />
        </g>
      </Inside>
      <path d="M134 -138 h8 L128 -106 h-8 Z" fill="#fff" opacity="0.5" />
      <rect x="168" y="-80" width="10" height="14" rx="4" fill="#fff4d6" />
      <path d={`${guard(-112, -36, 30)} ${guard(-50, -36, 30)} ${guard(124, -36, 30)}`} stroke="#2b2d42" strokeWidth="7" fill="none" />
      <TurningWheel cx={-112} cy={-24} r={24} />
      <TurningWheel cx={-50} cy={-24} r={24} />
      <TurningWheel cx={124} cy={-24} r={24} />
    </g>
  );
}

const FOLLOW_GLASS = "M-14 -78 V-108 H24 Q50 -106 60 -78 Z";

/** The follow-me car: the sign on its roof lights up, it flashes and drives ahead a little. */
export function FollowMe() {
  return (
    <g className="fh-follow-body" style={{ transformOrigin: "0px 0px" }}>
      <g className="fh-follow-sign" style={{ transformOrigin: "-16px -118px" }}>
        <path d="M-30 -118 V-130 M-2 -118 V-130" stroke={INK} strokeWidth="5" />
        <rect x="-76" y="-166" width="120" height="38" rx="6" fill="#ffd60a" stroke={INK} strokeWidth="4" />
        <rect className="fh-follow-signlight" x="-76" y="-166" width="120" height="38" rx="6" fill="#fff3b0" />
        <text x="-16" y="-147" fill={INK} fontSize="15" fontWeight="900" textAnchor="middle" dominantBaseline="central" letterSpacing="1">
          FOLLOW ME
        </text>
      </g>
      <path d="M-74 -74 Q-62 -112 -30 -114 H24 Q56 -112 70 -74 Z" fill="#ffd60a" />
      <path d="M-62 -78 Q-54 -104 -30 -106 H-22 V-78 Z" fill={GLASS} />
      <path d={FOLLOW_GLASS} fill={GLASS} />
      <Inside d={FOLLOW_GLASS}>
        <g className="fh-follow-driver">
          <Rider cx={20} cy={-90} shirt={SIGNAL_ORANGE} cap={NAVY} />
        </g>
      </Inside>
      <rect x="-112" y="-82" width="224" height="56" rx="18" fill="#ffd60a" />
      <g fill={INK}>
        {Array.from({ length: 11 }, (_, i) => (
          <rect key={i} x={-104 + i * 19} y={i % 2 ? -62 : -52} width="10" height="10" />
        ))}
      </g>
      <Beacon x={-46} y={-112} name="follow" />
      <rect x="104" y="-74" width="10" height="13" rx="4" fill="#fff4d6" />
      <ellipse className="fh-follow-beam" cx="130" cy="-68" rx="24" ry="12" fill="#fff3b0" />
      <path d={`${guard(-64, -26, 30)} ${guard(64, -26, 30)}`} stroke="#2b2d42" strokeWidth="7" fill="none" />
      <TurningWheel cx={-64} cy={-24} r={24} />
      <TurningWheel cx={64} cy={-24} r={24} />
    </g>
  );
}

const BUS_GUESTS = [
  { x: -40, shirt: "#ff5d73", hair: "#e9c46a" },
  { x: 30, shirt: "#4361ee", hair: "#2b2d42" },
  { x: 100, shirt: "#ffb703", hair: "#bc6c25" },
];

const BUS_FRONT = "M-212 -186 H-160 V-104 H-212 Z";

/** The green airport bus, driving left: the doors fold open, someone hops on and it toots. */
export function Bus() {
  return (
    <g className="fh-bus-body">
      <rect x="-216" y="-206" width="432" height="172" rx="24" fill="#52b788" />
      <rect x="-216" y="-84" width="432" height="50" rx="16" fill="#40916c" />
      <rect x="-216" y="-94" width="432" height="10" fill="#fff" />
      <rect x="-196" y="-200" width="392" height="9" rx="4" fill="#95d5b2" />
      <path d={BUS_FRONT} fill={GLASS} />
      <Inside d={BUS_FRONT}>
        <g className="fh-bus-driver">
          <Rider cx={-184} cy={-140} shirt="#3a86ff" cap={NAVY} />
        </g>
      </Inside>
      <path d="M-196 -184 h8 L-202 -108 h-8 Z" fill="#fff" opacity="0.5" />
      <Inside d="M-150 -186 h48 v152 h-48 Z">
        <rect x="-150" y="-186" width="48" height="152" fill="#495057" />
        <g className="fh-bus-guest">
          <Suitcase x={-132} y={-80} w={22} h={36} colour={RAIL_RED} />
          <rect x="-144" y="-118" width="28" height="56" rx="10" fill="#9d4edd" />
          <rect x="-142" y="-64" width="10" height="30" rx="4" fill={INK} />
          <rect x="-128" y="-64" width="10" height="30" rx="4" fill={INK} />
          <circle cx="-130" cy="-132" r="14" fill={SKIN} />
          <path d="M-144 -134 Q-144 -150 -130 -149 Q-116 -150 -116 -134 Q-124 -142 -144 -134 Z" fill="#6b4423" />
          <Face cx={-130} cy={-133} size={0.5} />
        </g>
      </Inside>
      <rect
        className="fh-bus-door"
        x="-150"
        y="-186"
        width="24"
        height="152"
        rx="3"
        fill={GLASS}
        stroke="#40916c"
        strokeWidth="4"
        style={{ transformOrigin: "-150px -110px" }}
      />
      <rect
        className="fh-bus-door"
        x="-126"
        y="-186"
        width="24"
        height="152"
        rx="3"
        fill={GLASS}
        stroke="#40916c"
        strokeWidth="4"
        style={{ transformOrigin: "-102px -110px" }}
      />
      {BUS_GUESTS.map(({ x, shirt, hair }, i) => (
        <Pane key={x} x={x} y={-186} w={60} h={70} rx={8}>
          <g className="fh-bus-passenger" style={nth(i)}>
            <Rider cx={x + 30} cy={-148} shirt={shirt} hair={hair} />
          </g>
        </Pane>
      ))}
      <rect x="-216" y="-74" width="10" height="16" rx="4" fill="#fff4d6" />
      <rect className="fh-bus-blink" x="-218" y="-52" width="10" height="10" rx="3" fill="#ffb703" />
      <rect x="206" y="-74" width="10" height="16" rx="4" fill="#ff5d73" />
      <Toot x={-230} y={-130} dir={-1} className="fh-bus-toot" />
      <path d={`${guard(-60, -32, 38)} ${guard(130, -32, 38)}`} stroke="#2b2d42" strokeWidth="8" fill="none" />
      <TurningWheel cx={-60} cy={-30} r={30} />
      <TurningWheel cx={130} cy={-30} r={30} />
    </g>
  );
}

const TAXI_FRONT = "M-66 -74 Q-56 -108 -30 -110 H-4 V-74 Z";
const TAXI_BACK = "M6 -74 V-110 H32 Q60 -108 70 -74 Z";

/** The yellow taxi, facing left: the TAXI sign lights up, the back door opens and the passenger waves. */
export function Taxi() {
  return (
    <g className="fh-taxi-body" style={{ transformOrigin: "0px 0px" }}>
      <rect x="-26" y="-140" width="52" height="22" rx="6" fill="#f8f9fa" stroke={INK} strokeWidth="3" />
      <rect className="fh-taxi-signlight" x="-26" y="-140" width="52" height="22" rx="6" fill="#fff3b0" />
      <text x="0" y="-129" fill={INK} fontSize="13" fontWeight="900" textAnchor="middle" dominantBaseline="central">
        TAXI
      </text>
      <path d="M-80 -70 Q-66 -118 -30 -120 H34 Q70 -118 84 -70 Z" fill="#ffd60a" />
      <path d={TAXI_FRONT} fill={GLASS} />
      <Inside d={TAXI_FRONT}>
        <g className="fh-taxi-driver">
          <Rider cx={-32} cy={-92} shirt="#4361ee" hair="#2b2d42" />
        </g>
      </Inside>
      <path d={TAXI_BACK} fill={GLASS} />
      <Inside d={TAXI_BACK}>
        <g className="fh-taxi-guest">
          <Rider cx={34} cy={-92} shirt="#ff5d73" hair="#e9c46a" />
        </g>
      </Inside>
      <path d="M-40 -106 h8 L-44 -78 h-8 Z M44 -106 h8 L40 -78 h-8 Z" fill="#fff" opacity="0.5" />
      <rect x="-120" y="-80" width="240" height="56" rx="18" fill="#ffd60a" />
      <g fill={INK}>
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={-112 + i * 19} y="-60" width="9.5" height="8" opacity={i % 2 ? 1 : 0} />
        ))}
      </g>
      <g className="fh-taxi-door" style={{ transformOrigin: "108px -52px" }}>
        <rect x="4" y="-80" width="104" height="52" rx="10" fill="#ffd60a" stroke="#e5a800" strokeWidth="3" />
        <rect x="18" y="-70" width="16" height="4" rx="2" fill="#e5a800" />
      </g>
      <rect x="-122" y="-72" width="10" height="13" rx="4" fill="#fff4d6" />
      <rect x="112" y="-72" width="8" height="12" rx="3" fill="#c1121f" />
      <Toot x={-136} y={-96} dir={-1} className="fh-taxi-toot" />
      <path d={`${guard(-70, -24, 32)} ${guard(70, -24, 32)}`} stroke="#2b2d42" strokeWidth="7" fill="none" />
      <TurningWheel cx={-70} cy={-24} r={24} />
      <TurningWheel cx={70} cy={-24} r={24} />
    </g>
  );
}

const TUG_CAB = "M150 -132 H200 Q214 -132 214 -118 V-92 H150 Z";

const CART_CASES = [
  [
    { x: -226, w: 44, h: 52, colour: "#4361ee" },
    { x: -176, w: 40, h: 40, colour: "#ff5d73" },
    { x: -132, w: 30, h: 58, colour: "#ffb703" },
  ],
  [
    { x: -60, w: 40, h: 58, colour: "#06d6a0" },
    { x: -14, w: 46, h: 44, colour: "#9d4edd" },
    { x: 38, w: 34, h: 52, colour: "#4cc9f0" },
  ],
];

/** The baggage tug with two carts full of suitcases: off it goes, and the suitcases hop. */
export function Gepaeckzug() {
  return (
    <g className="fh-gzug-body" style={{ transformOrigin: "0px 0px" }}>
      {/* Someone else rides along behind the purple suitcase every time */}
      <Hideout x={-22} y={-184} w={62} h={94} size={62} />
      {[-170, 6].map((cx, c) => (
        <g key={cx}>
          <rect x={cx - 84} y="-46" width="168" height="14" rx="4" fill="#6c757d" />
          <path d={`M${cx - 84} -46 V-110 M${cx + 84} -46 V-110`} stroke="#adb5bd" strokeWidth="6" strokeLinecap="round" />
          {CART_CASES[c].map(({ x, w, h, colour }, i) => (
            <Suitcase key={x} x={x} y={-46 - h} w={w} h={h} colour={colour} className="fh-gzug-case" style={nth(c * 3 + i)} />
          ))}
          <TurningWheel cx={cx - 56} cy={-16} r={16} />
          <TurningWheel cx={cx + 56} cy={-16} r={16} />
        </g>
      ))}
      <path d="M-86 -36 H-78 M90 -36 H122" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <path d="M118 -40 V-92 Q118 -100 126 -100 H150 V-40 Z" fill="#3a86ff" />
      <rect x="110" y="-62" width="124" height="34" rx="10" fill="#3a86ff" />
      <path d="M150 -132 V-92 M212 -132 V-92" stroke={INK} strokeWidth="5" />
      <rect x="144" y="-138" width="76" height="10" rx="4" fill="#2667cc" />
      <path d={TUG_CAB} fill={GLASS} opacity="0.5" />
      <g className="fh-gzug-driver">
        <Rider cx={180} cy={-106} shirt={SIGNAL_ORANGE} cap={NAVY} />
      </g>
      <rect x="110" y="-62" width="124" height="22" rx="8" fill="#3a86ff" />
      <Beacon x={182} y={-138} name="gzug" />
      <rect x="228" y="-56" width="8" height="12" rx="3" fill="#fff4d6" />
      <TurningWheel cx={140} cy={-22} r={22} />
      <TurningWheel cx={208} cy={-22} r={22} />
    </g>
  );
}

const BELT_CASES = [
  { t: 0, colour: "#ff5d73" },
  { t: 1, colour: "#4cc9f0" },
  { t: 2, colour: "#ffd60a" },
];

/** The belt loader: suitcases ride up the belt towards the plane. */
export function Gepaeckband() {
  return (
    <>
      <rect x="-110" y="-58" width="220" height="26" rx="8" fill="#ffb703" />
      <path d="M-60 -58 L-20 -110 M40 -58 L20 -130" stroke="#495057" strokeWidth="8" strokeLinecap="round" />
      <path d="M-120 -66 L104 -206 L116 -190 L-108 -50 Z" fill="#343a40" />
      <path className="fh-band-belt" d="M-114 -58 L110 -198" stroke="#6c757d" strokeWidth="8" strokeDasharray="10 12" />
      {BELT_CASES.map(({ t, colour }, i) => (
        <g key={t} transform={`translate(${-80 + t * 70} ${-80 - t * 44}) rotate(-32)`}>
          <g className="fh-band-case" style={nth(i)}>
            <Suitcase x={-18} y={-34} w={36} h={30} colour={colour} />
          </g>
        </g>
      ))}
      <path d="M-120 -66 L104 -206" stroke="#ffb703" strokeWidth="6" strokeLinecap="round" />
      <path d="M-108 -50 L116 -190" stroke="#e09f00" strokeWidth="6" strokeLinecap="round" />
      <TurningWheel cx={-70} cy={-20} r={20} />
      <TurningWheel cx={70} cy={-20} r={20} />
    </>
  );
}

/** The luggage trolley with two suitcases: it rocks and the suitcases wobble. */
export function Kofferkuli() {
  return (
    <g className="fh-kuli-body" style={{ transformOrigin: "0px 0px" }}>
      <path d="M-88 -26 L-100 -150 H-80" stroke={STEEL} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="-112" y="-158" width="30" height="12" rx="5" fill={RAIL_RED} />
      <rect x="-92" y="-32" width="184" height="12" rx="4" fill={STEEL} />
      <Suitcase x={-78} y={-98} w={150} h={66} colour="#3a86ff" className="fh-kuli-case" style={nth(0)} />
      <Suitcase x={-62} y={-118} w={116} h={22} colour="#ff8fab" className="fh-kuli-case" style={nth(1)} />
      <TurningWheel cx={-66} cy={-14} r={14} />
      <TurningWheel cx={66} cy={-14} r={14} />
    </g>
  );
}

/** A traffic cone: it wobbles and hops. */
export function Huetchen() {
  return (
    <g className="fh-huet-body" style={{ transformOrigin: "0px 0px" }}>
      <rect x="-32" y="-8" width="64" height="8" rx="3" fill="#e85d04" />
      <path d="M-24 -8 L-8 -68 H8 L24 -8 Z" fill={SIGNAL_ORANGE} />
      <path d="M-17 -34 L-12 -52 H12 L17 -34 Z" fill="#fff" />
      <path d="M-12 -60 l2 -6" stroke="#fff" strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round" />
      <Face cx={0} cy={-26} size={0.42} />
    </g>
  );
}
