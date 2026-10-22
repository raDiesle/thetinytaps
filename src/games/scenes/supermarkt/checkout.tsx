import { Face, INK, Inside, SKIN, STEEL, Wheel, nth } from "../shared";
import { Lid, Lines, Notes, Sparkles } from "./parts";

// The shopping cart with the child (CART coordinates, foot at (0, 0)) and the checkout
// (CHECKOUT coordinates: the counter's foot is at (0, 0), its top at y -190, the belt on the
// left, the till and the cashier on the right).

/** The shopping cart full of groceries; it rolls forward and back, wheels turning, goods hopping. */
export function Einkaufswagen() {
  return (
    <g className="sm-wagen-ride">
      {/* Handle */}
      <path d="M-128 -196 L-154 -228" stroke={STEEL} strokeWidth="6" strokeLinecap="round" />
      <ellipse cx="-157" cy="-232" rx="9" ry="15" fill="#e03131" />
      {/* Inside the basket and the goods in it */}
      <path d="M-130 -200 H150 L132 -100 H-104 Z" fill="#e9ecef" opacity="0.5" />
      <g className="sm-wagen-good" style={{ ...nth(0), transformOrigin: "0px -200px" }}>
        <ellipse cx="0" cy="-214" rx="30" ry="18" fill="#e0a060" />
        <path d="M-14 -222 l6 8 M0 -224 l6 8 M14 -222 l6 8" stroke="#f3d9b1" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="sm-wagen-good" style={{ ...nth(1), transformOrigin: "52px -200px" }}>
        <path d="M40 -200 V-236 L52 -246 L64 -236 V-200 Z" fill="#fff" stroke="#dee2e6" strokeWidth="2" />
        <path d="M40 -236 L52 -246 L64 -236 Z" fill="#4dabf7" />
        <ellipse cx="48" cy="-222" rx="4" ry="3" fill={INK} />
      </g>
      <g className="sm-wagen-good" style={{ ...nth(2), transformOrigin: "92px -200px" }}>
        <rect x="80" y="-238" width="22" height="40" rx="6" fill="#ff922b" />
        <rect x="85" y="-250" width="12" height="14" rx="3" fill="#e8590c" />
      </g>
      <g className="sm-wagen-good" style={{ ...nth(3), transformOrigin: "-50px -200px" }}>
        <path d="M-70 -206 Q-50 -190 -26 -214 Q-48 -200 -70 -206 Z" fill="#ffd43b" stroke="#f59f00" strokeWidth="1.5" />
        <path d="M-68 -212 Q-48 -196 -24 -220 Q-46 -206 -68 -212 Z" fill="#fcc419" stroke="#f59f00" strokeWidth="1.5" />
      </g>
      <g className="sm-wagen-good" style={{ ...nth(4), transformOrigin: "128px -200px" }}>
        <path d="M118 -200 Q114 -224 128 -228 Q142 -224 138 -200 Z" fill="#40c057" />
        <path d="M128 -228 l-6 -12 M128 -228 l0 -14 M128 -228 l6 -12" stroke="#2f9e44" strokeWidth="4" strokeLinecap="round" />
      </g>
      {/* Wire basket */}
      <path d="M-130 -200 H150 L132 -100 H-104 Z" fill="#dee2e6" fillOpacity="0.35" />
      <path
        d="M-110 -200 L-90 -100 M-80 -200 L-64 -100 M-50 -200 L-38 -100 M-20 -200 L-12 -100 M10 -200 L14 -100 M40 -200 L40 -100 M70 -200 L66 -100 M100 -200 L92 -100 M130 -200 L118 -100 M-125 -175 H145 M-119 -150 H141 M-112 -125 H136"
        stroke="#adb5bd"
        strokeWidth="3"
      />
      <path d="M-130 -200 H150 L132 -100 H-104 Z" fill="none" stroke="#868e96" strokeWidth="6" strokeLinejoin="round" />
      {/* Lower tray, frame and wheels */}
      <path d="M-98 -100 L-104 -26 M128 -100 L130 -26 M-110 -26 H140 M-100 -60 H128" stroke="#868e96" strokeWidth="5" strokeLinecap="round" />
      <rect x="-60" y="-80" width="70" height="20" rx="4" fill="#74c0fc" />
      <path d="M-50 -80 V-60 M-36 -80 V-60 M-22 -80 V-60 M-8 -80 V-60" stroke="#fff" strokeWidth="2" opacity="0.7" />
      {[-96, 126].map((x) => (
        <g key={x} className="sm-wagen-wheel" style={{ transformOrigin: `${x}px -14px` }}>
          <Wheel cx={x} cy={-14} r={14} />
        </g>
      ))}
    </g>
  );
}

/** The child in the cart's seat; it waves both arms, bounces and laughs. */
export function Kind() {
  return (
    <g className="sm-kind-ride">
      <g className="sm-kind-body" style={{ transformOrigin: "-95px -200px" }}>
        <rect x="-130" y="-238" width="70" height="40" rx="6" fill="#e03131" />
        {[
          { cls: "sm-kind-arm", d: "M-116 -232 L-138 -262", hand: [-140, -266], origin: "-116px -232px" },
          { cls: "sm-kind-arm", d: "M-74 -232 L-52 -262", hand: [-50, -266], origin: "-74px -232px" },
        ].map(({ cls, d, hand, origin }, i) => (
          <g key={i} className={cls} style={{ ...nth(i), transformOrigin: origin }}>
            <path d={d} stroke="#4dabf7" strokeWidth="11" strokeLinecap="round" />
            <circle cx={hand[0]} cy={hand[1]} r="7" fill={SKIN} />
          </g>
        ))}
        <rect x="-118" y="-244" width="46" height="48" rx="14" fill="#4dabf7" />
        <path d="M-118 -228 H-72 M-118 -212 H-72" stroke="#fff" strokeWidth="5" />
        <circle cx="-95" cy="-268" r="24" fill={SKIN} />
        <g className="sm-kind-tuft" style={{ transformOrigin: "-95px -290px" }}>
          <path d="M-95 -290 q-4 -12 4 -16 M-95 -290 q6 -10 12 -8" stroke="#fab005" strokeWidth="4" strokeLinecap="round" fill="none" />
        </g>
        <path d="M-118 -272 Q-118 -294 -95 -294 Q-72 -294 -72 -272 Q-84 -284 -95 -282 Q-106 -284 -118 -272 Z" fill="#fcc419" />
        <Face cx={-95} cy={-266} size={0.8} />
        <Lid cx={-100.6} cy={-266} r={2.8} fill={SKIN} />
        <Lid cx={-89.4} cy={-266} r={2.8} fill={SKIN} />
      </g>
      {/* The cart's rim in front of the child */}
      <path d="M-134 -200 H-46" stroke="#868e96" strokeWidth="6" strokeLinecap="round" />
      <Notes x={-60} y={-292} colour="#e64980" size={0.8} />
    </g>
  );
}

/** The cashier behind the till; she waves, nods and her bun bounces. */
export function Kassiererin() {
  return (
    <g className="sm-kass-body" style={{ transformOrigin: "232px -190px" }}>
      <rect x="194" y="-264" width="76" height="80" rx="20" fill="#12b886" />
      <path d="M220 -264 L232 -246 L244 -264" fill="#fff" />
      <rect x="246" y="-238" width="16" height="9" rx="2" fill="#fff" />
      <path d="M200 -232 L170 -204" stroke="#12b886" strokeWidth="13" strokeLinecap="round" />
      <circle cx="166" cy="-202" r="8" fill={SKIN} />
      <g className="sm-kass-arm" style={{ transformOrigin: "264px -246px" }}>
        <path d="M264 -246 L290 -276" stroke="#12b886" strokeWidth="13" strokeLinecap="round" />
        <circle cx="292" cy="-282" r="8" fill={SKIN} />
      </g>
      <g className="sm-kass-head" style={{ transformOrigin: "232px -266px" }}>
        <g className="sm-kass-bun" style={{ transformOrigin: "232px -312px" }}>
          <circle cx="232" cy="-322" r="13" fill="#5c3d2e" />
        </g>
        <circle cx="232" cy="-290" r="26" fill={SKIN} />
        <path d="M206 -292 Q204 -318 232 -318 Q260 -318 258 -292 Q248 -306 232 -304 Q216 -306 206 -292 Z" fill="#5c3d2e" />
        <Face cx={232} cy={-288} size={0.9} />
        <Lid cx={225.7} cy={-288} r={3.1} fill={SKIN} />
        <Lid cx={238.3} cy={-288} r={3.1} fill={SKIN} />
        <circle cx="206" cy="-282" r="3.5" fill="#fcc419" />
        <circle cx="258" cy="-282" r="3.5" fill="#fcc419" />
      </g>
    </g>
  );
}

const BELT = "M-292 -212 H20 V-192 H-292 Z";

/** The checkout counter with its belt; the belt runs, the goods ride along and the rollers turn. */
export function Laufband() {
  return (
    <>
      {/* Counter top and belt */}
      <path d="M-300 -190 L-292 -218 H292 L300 -190 Z" fill="#dee2e6" />
      <Inside d={BELT}>
        <rect x="-292" y="-212" width="312" height="20" fill="#343a40" />
        <path
          className="sm-band-stripes"
          d={Array.from({ length: 18 }, (_, i) => `M${-300 + i * 20} -212 l6 20`).join(" ")}
          stroke="#495057"
          strokeWidth="5"
        />
      </Inside>
      {[-292, 20].map((x) => (
        <g key={x} className="sm-band-roller" style={{ transformOrigin: `${x}px -202px` }}>
          <circle cx={x} cy="-202" r="10" fill="#868e96" />
          <path d={`M${x - 7} -202 H${x + 7} M${x} -209 V-195`} stroke="#495057" strokeWidth="3" />
        </g>
      ))}
      <g className="sm-band-goods">
        <rect x="-118" y="-216" width="44" height="8" rx="3" fill="#adb5bd" />
        <rect x="-60" y="-252" width="30" height="42" rx="2" fill="#ff922b" />
        <circle cx="-45" cy="-234" r="8" fill="#ffe066" />
        <path d="M-14 -210 V-238 L-4 -246 L6 -238 V-210 Z" fill="#fff" stroke="#dee2e6" strokeWidth="2" />
        <path d="M-14 -238 L-4 -246 L6 -238 Z" fill="#ff8787" />
      </g>
      {/* Counter front */}
      <rect x="-300" y="-190" width="600" height="190" fill="#f1f3f5" />
      <rect x="-300" y="-150" width="600" height="20" fill="#40c057" />
      <rect x="-300" y="-24" width="600" height="24" fill="#868e96" />
      <path d="M-284 -176 H280" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      {/* Bag hook with paper bags */}
      <rect x="-250" y="-112" width="60" height="70" rx="4" fill="#d4a373" />
      <path d="M-250 -112 L-244 -120 H-196 L-190 -112 Z" fill="#bc8a5f" />
      <rect x="-180" y="-112" width="60" height="70" rx="4" fill="#d4a373" />
      <path d="M-180 -112 L-174 -120 H-126 L-120 -112 Z" fill="#bc8a5f" />
      {/* Checkout number on its lamp */}
      <rect x="-298" y="-300" width="8" height="90" fill={STEEL} />
      <circle className="sm-band-lamp" cx="-294" cy="-312" r="20" fill="#69db7c" />
      <text x="-294" y="-305" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#fff" fontFamily="sans-serif">
        1
      </text>
    </>
  );
}

/** The till: the scanner beeps with its red light, the display counts, the drawer opens and a receipt comes out. */
export function Kasse() {
  return (
    <>
      {/* Scanner window in the counter */}
      <path d="M50 -196 L58 -214 H138 L130 -196 Z" fill="#343a40" />
      <path className="sm-kasse-laser" d="M60 -205 H128" stroke="#ff6b6b" strokeWidth="4" strokeLinecap="round" />
      <g className="sm-kasse-glow" fill="#ff8787">
        <ellipse cx="94" cy="-205" rx="40" ry="12" opacity="0.5" />
      </g>
      {/* Register with keys and receipt printer */}
      <g className="sm-kasse-bon" style={{ transformOrigin: "164px -246px" }}>
        <rect x="154" y="-276" width="20" height="30" fill="#fff" stroke="#ced4da" strokeWidth="1.5" />
        <path d="M158 -268 H170 M158 -262 H166 M158 -256 H170" stroke="#adb5bd" strokeWidth="2" />
      </g>
      <path d="M140 -214 L146 -250 H184 L190 -214 Z" fill="#495057" />
      <rect x="152" y="-250" width="24" height="5" rx="2" fill="#212529" />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} className={i === 4 ? "sm-kasse-key" : undefined} x={152 + (i % 3) * 10} y={-238 + Math.floor(i / 3) * 10} width="7" height="6" rx="1.5" fill={["#ced4da", "#69db7c", "#ff8787"][i % 3]} />
      ))}
      {/* Display for the customer */}
      <rect x="96" y="-264" width="6" height="50" fill={STEEL} />
      <rect x="66" y="-304" width="66" height="44" rx="8" fill="#343a40" />
      <rect x="72" y="-298" width="54" height="32" rx="4" fill="#0b7285" />
      <g className="sm-kasse-zero" fill="#99e9f2">
        <rect x="80" y="-288" width="38" height="4" rx="2" />
        <rect x="80" y="-280" width="24" height="4" rx="2" />
      </g>
      <g className="sm-kasse-digits" stroke="#99e9f2" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M80 -292 l4 -2 v18" style={nth(0)} />
        <path d="M92 -294 h8 v8 h-8 v10 h8" style={nth(1)} />
        <circle cx="106" cy="-276" r="1.5" fill="#99e9f2" style={nth(2)} />
        <path d="M112 -294 h8 v18 h-8 Z M112 -285 h8" style={nth(2)} />
      </g>
      {/* Cash drawer in the counter's front */}
      <g className="sm-kasse-coins">
        {[60, 80, 100, 120].map((x, i) => (
          <circle key={x} cx={x} cy="-184" r="7" fill={i % 2 ? "#ced4da" : "#fcc419"} stroke="#f59f00" strokeWidth="1.5" style={nth(i)} />
        ))}
      </g>
      <g className="sm-kasse-drawer">
        <rect x="40" y="-186" width="104" height="30" rx="4" fill="#495057" />
        <rect x="76" y="-176" width="32" height="7" rx="3" fill="#adb5bd" />
      </g>
      <Lines x={140} y={-224} colour="#e03131" size={0.8} />
      <Sparkles x={98} y={-282} spread={40} colour="#ffd43b" size={0.8} />
    </>
  );
}

/** An egg carton on the belt; the lid opens, an egg cracks and a chick pops out and peeps. */
export function Eierkarton() {
  return (
    <g className="sm-eier-ride">
      <g className="sm-eier-open">
        <path d="M-248 -232 L-244 -262 H-164 L-160 -232 Z" fill="#d8c69a" />
        <path d="M-236 -244 H-172" stroke="#c4b07c" strokeWidth="3" />
      </g>
      {[-228, -206, -184].map((x, i) => (
        <g key={x} className={i === 1 ? "sm-eier-shell" : undefined} style={i === 1 ? { transformOrigin: `${x + 8}px -232px` } : undefined}>
          <ellipse cx={x} cy={-228} rx="10" ry="12" fill={i === 1 ? "#fff4e6" : "#fff"} />
        </g>
      ))}
      <g className="sm-eier-kueken" style={{ transformOrigin: "-206px -226px" }}>
        <circle cx="-206" cy="-236" r="10" fill="#ffe066" />
        <path d="M-216 -232 q-6 -2 -6 -8 M-196 -232 q6 -2 6 -8" className="sm-eier-wing" stroke="#fcc419" strokeWidth="4" strokeLinecap="round" fill="none" />
        <circle cx="-209.5" cy="-239" r="1.8" fill={INK} />
        <circle cx="-202.5" cy="-239" r="1.8" fill={INK} />
        <path d="M-209 -235 L-206 -231 L-203 -235 Z" fill="#ff922b" />
        <path d="M-206 -246 q-2 -6 2 -8" stroke="#fcc419" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </g>
      <path d="M-250 -230 H-160 L-164 -208 H-246 Z" fill="#e9d8a6" />
      {[-228, -206, -184].map((x) => (
        <path key={x} d={`M${x - 10} -226 q10 10 20 0`} stroke="#d8c69a" strokeWidth="3" fill="none" />
      ))}
      <g className="sm-eier-lid">
        <path d="M-252 -230 Q-252 -250 -238 -250 H-172 Q-158 -250 -158 -230 Z" fill="#e9d8a6" stroke="#d8c69a" strokeWidth="2" />
        <circle cx="-205" cy="-240" r="6" fill="#fcc419" />
      </g>
      <Lines x={-150} y={-250} colour="#fab005" size={0.7} />
    </g>
  );
}
