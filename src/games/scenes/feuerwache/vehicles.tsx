import { Hideout } from "../hideout";
import { GLASS, INK, Inside, Rider, Wheel, nth } from "../shared";
import { BlueLight, DARK_RED, FIRE_RED, HelmetHead, NAVY, STRIPE, Toot, TurningWheel, guard } from "./parts";

// Vehicles. Each drawing has its foot point (the middle between the wheels, on the
// ground) at (0, 0). The ladder truck faces right, towards the tree with the cat.

const TRUCK_CAB = "M118 -176 H186 Q214 -176 226 -128 H118 Z";

/** The big fire engine: the ladder turns up towards the tree and slides out, the lockers roll open. */
export function Feuerwehrauto() {
  return (
    <g className="fw-truck-body">
      <BlueLight x={204} y={-196} w={40} name="truck" />
      {/* Ladder on its turntable; the pivot is the turntable at (-200, -232) */}
      <rect x="-244" y="-206" width="88" height="28" rx="8" fill="#495057" />
      <rect x="-236" y="-220" width="72" height="16" rx="6" fill="#6c757d" />
      <rect x="140" y="-226" width="14" height="38" rx="4" fill="#495057" />
      <g className="fw-truck-ladder" style={{ transformOrigin: "-200px -232px" }}>
        <g className="fw-truck-ext">
          <path d="M-120 -226 H244 M-120 -238 H244" stroke="#dee2e6" strokeWidth="5" strokeLinecap="round" />
          <path d={Array.from({ length: 15 }, (_, i) => `M${-110 + i * 24} -226 V-238`).join(" ")} stroke="#dee2e6" strokeWidth="3" />
          {/* The rescue basket at the tip */}
          <rect x="236" y="-262" width="54" height="34" rx="6" fill={FIRE_RED} />
          <path d="M236 -278 H290 M240 -278 V-262 M286 -278 V-262 M263 -278 V-262" stroke="#adb5bd" strokeWidth="4" strokeLinecap="round" />
          <rect x="236" y="-252" width="54" height="6" fill="#fff" />
        </g>
        <path d="M-224 -222 H232 M-224 -242 H232" stroke="#adb5bd" strokeWidth="7" strokeLinecap="round" />
        <path d={Array.from({ length: 19 }, (_, i) => `M${-214 + i * 24} -222 V-242`).join(" ")} stroke="#adb5bd" strokeWidth="4" />
        <circle cx="-200" cy="-232" r="12" fill="#495057" />
      </g>
      {/* Body with three roller lockers; inside: hose, helmet and a lamp */}
      <rect x="-262" y="-64" width="520" height="28" rx="8" fill={INK} />
      <rect x="-256" y="-178" width="362" height="126" rx="10" fill={FIRE_RED} />
      {[-242, -128, -14].map((x, i) => (
        <g key={x}>
          <rect x={x} y="-166" width="100" height="78" rx="4" fill="#343a40" />
          {i === 0 && (
            <g fill="none" stroke="#f8f9fa" strokeWidth="7">
              <circle cx={x + 50} cy="-126" r="28" />
              <circle cx={x + 50} cy="-126" r="13" />
            </g>
          )}
          {i === 1 && (
            <>
              <path d={`M${x + 22} -104 Q${x + 22} -140 ${x + 50} -140 Q${x + 78} -140 ${x + 78} -104 Z`} fill={STRIPE} />
              <rect x={x + 16} y="-108" width="68" height="8" rx="3" fill={STRIPE} />
              {/* Who is sitting on the helmet this time? */}
              <Hideout x={x} y={-166} w={100} h={78} size={62} />
            </>
          )}
          {i === 2 && (
            <>
              <rect x={x + 18} y="-150" width="24" height="56" rx="8" fill={FIRE_RED} />
              <rect x={x + 22} y="-160" width="16" height="12" rx="3" fill={INK} />
              <rect x={x + 54} y="-130" width="32" height="36" rx="6" fill="#ffd60a" />
              <circle cx={x + 70} cy="-112" r="9" fill="#fff4d6" />
            </>
          )}
          <g className="fw-truck-shutter" style={{ ...nth(i), transformOrigin: `${x + 50}px -166px` }}>
            <rect x={x} y="-166" width="100" height="78" rx="4" fill={FIRE_RED} />
            <path d={`M${x} -152 h100 M${x} -138 h100 M${x} -124 h100 M${x} -110 h100`} stroke={DARK_RED} strokeWidth="3" />
            <rect x={x + 36} y="-98" width="28" height="6" rx="3" fill="#adb5bd" />
          </g>
        </g>
      ))}
      <rect x="-256" y="-82" width="362" height="12" fill="#fff" />
      <rect x="-256" y="-70" width="362" height="8" fill={STRIPE} />
      {/* Cab */}
      <path d="M100 -50 V-176 Q100 -190 116 -190 H190 Q232 -190 242 -140 L252 -50 Z" fill={FIRE_RED} />
      <path d={TRUCK_CAB} fill={GLASS} />
      <Inside d={TRUCK_CAB}>
        <g className="fw-truck-driver">
          <Rider cx={168} cy={-146} shirt={NAVY} cap={STRIPE} />
        </g>
      </Inside>
      <path d="M180 -172 h8 L172 -132 h-8 Z" fill="#fff" opacity="0.5" />
      <rect x="100" y="-82" width="152" height="12" fill="#fff" />
      <rect x="100" y="-70" width="152" height="8" fill={STRIPE} />
      <rect x="100" y="-64" width="160" height="16" rx="5" fill={DARK_RED} />
      <rect x="242" y="-104" width="12" height="18" rx="4" fill="#fff4d6" />
      <ellipse className="fw-truck-beam" cx="282" cy="-95" rx="28" ry="12" fill="#fff3b0" />
      <Toot x={266} y={-140} className="fw-truck-toot" />
      <path d={`${guard(-196, -34, 40)} ${guard(-112, -34, 40)} ${guard(176, -34, 40)}`} stroke="#2b2d42" strokeWidth="8" fill="none" />
      <TurningWheel cx={-196} cy={-32} r={33} />
      <TurningWheel cx={-112} cy={-32} r={33} />
      <TurningWheel cx={176} cy={-32} r={33} />
    </g>
  );
}

const ELW_FRONT = "M-108 -96 Q-94 -136 -60 -138 H-14 V-96 Z";
const ELW_BACK = "M-4 -138 H56 Q90 -136 104 -96 H-4 Z";

/** The small command car (faces left): blue lights, the door opens and the chief waves. */
export function Kommandowagen() {
  return (
    <g className="fw-elw-body">
      <BlueLight x={-10} y={-146} w={70} name="elw" />
      <path className="fw-elw-antenna" d="M70 -136 L84 -196" stroke={INK} strokeWidth="3" strokeLinecap="round" style={{ transformOrigin: "70px -136px" }} />
      <path d="M-118 -90 Q-100 -140 -60 -142 H60 Q100 -140 116 -90 Z" fill={FIRE_RED} />
      <path d={ELW_FRONT} fill={GLASS} />
      <Inside d={ELW_FRONT}>
        <g className="fw-elw-chief">
          <HelmetHead cx={-50} cy={-108} r={15} helmet="#f8f9fa" />
          <rect x="-66" y="-94" width="32" height="20" rx="8" fill={NAVY} />
        </g>
      </Inside>
      <path d={ELW_BACK} fill={GLASS} />
      <path d="M-74 -130 h8 L-80 -100 h-8 Z M30 -132 h8 L26 -100 h-8 Z" fill="#fff" opacity="0.5" />
      <rect x="-138" y="-98" width="270" height="66" rx="20" fill={FIRE_RED} />
      <rect x="-138" y="-74" width="270" height="16" fill="#fff" />
      <text x="40" y="-66" fill={FIRE_RED} fontSize="13" fontWeight="900" textAnchor="middle" dominantBaseline="central" letterSpacing="2">
        FEUERWEHR
      </text>
      {/* The driver's door swings open */}
      <rect x="-104" y="-98" width="84" height="62" fill="#5c1a1a" />
      <Hideout x={-104} y={-98} w={84} h={62} size={52} />
      <g className="fw-elw-door" style={{ transformOrigin: "-104px -66px" }}>
        <rect x="-104" y="-98" width="84" height="62" rx="4" fill={FIRE_RED} />
        <rect x="-104" y="-74" width="84" height="16" fill="#fff" />
        <rect x="-38" y="-90" width="14" height="5" rx="2" fill="#adb5bd" />
        <path d="M-104 -98 V-36 M-20 -98 V-36" stroke={DARK_RED} strokeWidth="3" />
      </g>
      <rect x="-142" y="-90" width="12" height="14" rx="4" fill="#fff4d6" />
      <ellipse className="fw-elw-beam" cx="-168" cy="-82" rx="26" ry="11" fill="#fff3b0" />
      <rect x="124" y="-88" width="10" height="14" rx="4" fill="#ff5d73" />
      <Toot x={-152} y={-112} dir={-1} className="fw-elw-toot" />
      <path d={`${guard(-80, -30, 34)} ${guard(82, -30, 34)}`} stroke="#2b2d42" strokeWidth="7" fill="none" />
      <TurningWheel cx={-80} cy={-28} r={26} />
      <TurningWheel cx={82} cy={-28} r={26} />
    </g>
  );
}

const AMBU_CAB = "M84 -160 H130 Q156 -160 166 -112 H84 Z";

/** The ambulance (faces right): its side door slides open and the teddy on the stretcher waves. */
export function Krankenwagen() {
  return (
    <g className="fw-ambu-body">
      <BlueLight x={-150} y={-196} w={34} name="ambu" />
      <BlueLight x={110} y={-172} w={34} name="ambu" />
      <rect x="-186" y="-190" width="262" height="160" rx="14" fill="#f8f9fa" />
      <path d="M70 -36 V-160 Q70 -172 84 -172 H132 Q166 -172 176 -122 L186 -36 Z" fill="#f8f9fa" />
      <path d={AMBU_CAB} fill={GLASS} />
      <Inside d={AMBU_CAB}>
        <g className="fw-ambu-driver">
          <Rider cx={122} cy={-128} shirt="#e63946" cap="#e63946" />
        </g>
      </Inside>
      <path d="M136 -156 h8 L128 -116 h-8 Z" fill="#fff" opacity="0.5" />
      {/* Inside the door: the teddy on the stretcher */}
      <rect x="-128" y="-170" width="104" height="122" rx="6" fill="#ced4da" />
      <g className="fw-ambu-teddy" style={{ transformOrigin: "-76px -86px" }}>
        <circle cx="-96" cy="-128" r="11" fill="#bc6c25" />
        <circle cx="-56" cy="-128" r="11" fill="#bc6c25" />
        <circle cx="-76" cy="-112" r="26" fill="#d68c45" />
        <ellipse cx="-76" cy="-102" rx="11" ry="8" fill="#f4d58d" />
        <circle cx="-85" cy="-116" r="3.4" fill="#2b2d42" />
        <circle cx="-67" cy="-116" r="3.4" fill="#2b2d42" />
        <circle cx="-76" cy="-106" r="3.4" fill="#2b2d42" />
        <path d="M-82 -98 Q-76 -93 -70 -98" stroke="#2b2d42" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M-100 -124 l10 6 M-96 -128 l4 10" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
        <g className="fw-ambu-paw" style={{ transformOrigin: "-54px -92px" }}>
          <path d="M-54 -92 L-36 -116" stroke="#d68c45" strokeWidth="12" strokeLinecap="round" />
        </g>
        <ellipse cx="-76" cy="-74" rx="30" ry="16" fill="#d68c45" />
      </g>
      <rect x="-124" y="-66" width="96" height="12" rx="4" fill="#4dabf7" />
      <path d="M-116 -54 v10 M-36 -54 v10" stroke="#495057" strokeWidth="5" />
      <g className="fw-ambu-door">
        <rect x="-128" y="-170" width="104" height="122" rx="6" fill="#f1f3f5" stroke="#dee2e6" strokeWidth="3" />
        <rect x="-116" y="-160" width="80" height="40" rx="6" fill={GLASS} />
        <rect x="-44" y="-110" width="12" height="18" rx="3" fill="#adb5bd" />
      </g>
      {/* Red stripes and the cross */}
      <rect x="-186" y="-86" width="372" height="16" fill={FIRE_RED} />
      <rect x="-186" y="-64" width="372" height="8" fill={STRIPE} />
      <circle cx="30" cy="-138" r="26" fill="#fff" stroke={FIRE_RED} strokeWidth="5" />
      <path d="M30 -154 V-122 M14 -138 H46" stroke={FIRE_RED} strokeWidth="10" />
      <rect x="-194" y="-42" width="388" height="16" rx="6" fill="#adb5bd" />
      <rect x="178" y="-102" width="10" height="16" rx="4" fill="#fff4d6" />
      <path d={`${guard(-112, -26, 36)} ${guard(120, -26, 36)}`} stroke="#495057" strokeWidth="7" fill="none" />
      <TurningWheel cx={-112} cy={-24} r={28} />
      <TurningWheel cx={120} cy={-24} r={28} />
    </g>
  );
}

const HELI_BUBBLE = "M-142 -6 Q-146 -50 -96 -56 H-60 V-2 Q-120 4 -142 -6 Z";

/** The red helicopter with its water bucket: the rotor whirls, the bucket swings and drips. */
export function Hubschrauber() {
  return (
    <>
      <g className="fw-heli-swing" style={{ transformOrigin: "-20px 20px" }}>
        <path d="M-20 20 V96" stroke={INK} strokeWidth="3" />
        <path d="M-50 96 H10 L0 136 H-40 Z" fill={STRIPE} />
        <ellipse cx="-20" cy="96" rx="30" ry="7" fill="#4dabf7" />
        <g className="fw-heli-drops" fill="#74c0fc">
          {[-34, -20, -6].map((x, i) => (
            <ellipse key={x} cx={x} cy="142" rx="4" ry="6" style={nth(i)} />
          ))}
        </g>
      </g>
      <g className="fw-heli-body" style={{ transformOrigin: "0px 0px" }}>
        <path d="M60 -24 L190 -34 V-20 L60 -2 Z" fill={FIRE_RED} />
        <path d="M180 -50 L196 -50 L198 -16 L184 -18 Z" fill={DARK_RED} />
        <g className="fw-heli-tail" style={{ transformOrigin: "190px -30px" }}>
          <ellipse cx="190" cy="-30" rx="6" ry="30" fill="#adb5bd" opacity="0.8" />
        </g>
        <path d="M-150 -10 Q-150 -66 -80 -66 H40 Q86 -64 86 -20 Q86 16 30 20 H-110 Q-150 16 -150 -10 Z" fill={FIRE_RED} />
        <path d="M-130 4 H60 Q80 2 84 -12 V0 Q78 18 30 20 H-110 Q-128 18 -130 4 Z" fill="#fff" />
        <path d={HELI_BUBBLE} fill={GLASS} />
        <Inside d={HELI_BUBBLE}>
          <g className="fw-heli-pilot">
            <HelmetHead cx={-96} cy={-26} r={14} helmet="#f8f9fa" />
            <rect x="-110" y="-12" width="28" height="18" rx="7" fill={NAVY} />
          </g>
        </Inside>
        <path d="M-116 -48 q10 -4 20 -4" stroke="#fff" strokeOpacity="0.7" strokeWidth="5" strokeLinecap="round" fill="none" />
        <rect x="-40" y="-52" width="60" height="34" rx="6" fill={GLASS} />
        <path d="M-120 30 H60 M-90 20 V30 M30 20 V30" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <rect x="-14" y="-82" width="20" height="18" rx="4" fill="#495057" />
        <g className="fw-heli-rotor" style={{ transformOrigin: "-4px -84px" }}>
          <rect x="-160" y="-90" width="312" height="10" rx="5" fill="#495057" />
        </g>
        <circle cx="-4" cy="-84" r="9" fill={INK} />
      </g>
    </>
  );
}

/** The hose reel cart: the drum spins and the cart rocks back and forth. */
export function Schlauchrolle() {
  return (
    <g className="fw-reel-body" style={{ transformOrigin: "0px 0px" }}>
      <path d="M-20 -60 L-118 -138" stroke="#495057" strokeWidth="10" strokeLinecap="round" />
      <path d="M-130 -150 L-104 -128" stroke={INK} strokeWidth="14" strokeLinecap="round" />
      <path d="M-62 -6 L-20 -60 L22 -6" stroke="#6c757d" strokeWidth="9" strokeLinecap="round" fill="none" />
      <g className="fw-reel-drum" style={{ transformOrigin: "0px -64px" }}>
        <Wheel cx={0} cy={-64} r={62} />
        <circle cx="0" cy="-64" r="48" fill={FIRE_RED} />
        <g fill="none" stroke={DARK_RED} strokeWidth="4">
          <circle cx="0" cy="-64" r="38" />
          <circle cx="0" cy="-64" r="28" />
          <circle cx="0" cy="-64" r="18" />
        </g>
        <rect x="-4" y="-112" width="8" height="96" fill="#adb5bd" opacity="0.6" />
        <circle cx="0" cy="-64" r="10" fill="#adb5bd" />
      </g>
      {/* The hose end with the nozzle lies on the grass */}
      <path className="fw-reel-hose" d="M40 -32 Q70 -2 112 -4" stroke={FIRE_RED} strokeWidth="11" strokeLinecap="round" fill="none" />
      <g className="fw-reel-nozzle" style={{ transformOrigin: "112px -4px" }}>
        <rect x="108" y="-14" width="34" height="18" rx="5" fill="#adb5bd" />
        <rect x="140" y="-11" width="10" height="12" rx="3" fill="#6c757d" />
      </g>
      <g className="fw-reel-drops" fill="#74c0fc">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={156} cy={-6} r="5" style={nth(i)} />
        ))}
      </g>
    </g>
  );
}

/** A child's red ride-on car with a little blue light: it rolls, steers and toots. */
export function Bobbycar() {
  return (
    <g className="fw-bobby-body">
      <BlueLight x={-32} y={-92} w={24} name="bobby" />
      <path d="M-78 -30 Q-86 -66 -50 -72 H20 Q30 -72 34 -62 L54 -62 Q80 -60 82 -34 V-26 H-78 Z" fill={FIRE_RED} />
      <path d="M-60 -58 Q-40 -66 -10 -64" stroke="#fff" strokeOpacity="0.5" strokeWidth="6" strokeLinecap="round" fill="none" />
      <rect x="-52" y="-86" width="40" height="14" rx="7" fill={DARK_RED} />
      <g className="fw-bobby-steer" style={{ transformOrigin: "44px -96px" }}>
        <path d="M40 -62 L44 -96" stroke={INK} strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="44" cy="-98" rx="20" ry="7" fill="none" stroke={INK} strokeWidth="6" />
      </g>
      <circle cx="74" cy="-46" r="7" fill="#fff4d6" />
      <Toot x={92} y={-60} className="fw-bobby-toot" />
      <TurningWheel cx={-52} cy={-22} r={22} />
      <TurningWheel cx={54} cy={-22} r={22} />
    </g>
  );
}
