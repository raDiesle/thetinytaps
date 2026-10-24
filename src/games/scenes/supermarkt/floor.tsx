import { Hideout } from "../hideout";
import { Face, INK, SKIN, STEEL, Wheel, nth } from "../shared";
import { Lid, Lines, Mist, Notes, Sparkles } from "./parts";

// Things standing on the floor. Each drawing has its foot point at (0, 0).

const FLOWERS = [
  { x: -58, head: "#fa5252", stem: -120, kind: "tulip" },
  { x: 0, head: "#fcc419", stem: -150, kind: "sun" },
  { x: 58, head: "#f783ac", stem: -124, kind: "daisy" },
];

/** Buckets of flowers at the entrance; they sway, the blossoms open and a bee buzzes round. */
export function Blumen() {
  return (
    <>
      {FLOWERS.map(({ x, head, stem, kind }, i) => (
        <g key={x} className="sm-blume" style={{ ...nth(i), transformOrigin: `${x}px -48px` }}>
          {[-14, 0, 14].map((dx, k) => {
            const hx = x + dx * 1.4;
            const hy = stem + Math.abs(dx) * 1.2 + (k === 1 ? -6 : 0);
            return (
              <g key={dx}>
                <path d={`M${x + dx * 0.3} -46 Q${x + dx} ${(hy - 46) / 2} ${hx} ${hy}`} stroke="#40c057" strokeWidth="4" fill="none" />
                <path
                  d={`M${x + dx * 0.5} -70 q${dx >= 0 ? 12 : -12} -4 ${dx >= 0 ? 16 : -16} -14 q${dx >= 0 ? -10 : 10} 0 ${dx >= 0 ? -16 : 16} 10 Z`}
                  fill="#51cf66"
                />
                <g className="sm-blume-head" style={{ ...nth(k), transformOrigin: `${hx}px ${hy}px` }}>
                  {kind === "tulip" ? (
                    <path
                      d={`M${hx - 10} ${hy - 4} L${hx - 10} ${hy - 20} L${hx - 4} ${hy - 12} L${hx} ${hy - 22} L${hx + 4} ${hy - 12} L${hx + 10} ${hy - 20} L${hx + 10} ${hy - 4} Q${hx} ${hy + 6} ${hx - 10} ${hy - 4} Z`}
                      fill={head}
                    />
                  ) : (
                    <>
                      {[0, 60, 120, 180, 240, 300].map((a) => (
                        <ellipse
                          key={a}
                          cx={hx}
                          cy={hy - (kind === "sun" ? 12 : 9)}
                          rx={kind === "sun" ? 6 : 5}
                          ry={kind === "sun" ? 9 : 7}
                          fill={kind === "sun" ? head : "#fff"}
                          transform={`rotate(${a} ${hx} ${hy})`}
                        />
                      ))}
                      <circle cx={hx} cy={hy} r={kind === "sun" ? 8 : 6} fill={kind === "sun" ? "#8d5a2b" : head} />
                    </>
                  )}
                </g>
              </g>
            );
          })}
        </g>
      ))}
      {FLOWERS.map(({ x }) => (
        <g key={x}>
          <path d={`M${x - 24} -50 H${x + 24} L${x + 18} 0 H${x - 18} Z`} fill="#adb5bd" />
          <path d={`M${x - 24} -50 H${x + 24}`} stroke="#868e96" strokeWidth="5" strokeLinecap="round" />
          <path d={`M${x - 12} -40 L${x - 9} -8`} stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
        </g>
      ))}
      <g className="sm-blumen-biene" style={{ transformOrigin: "40px -150px" }}>
        <ellipse cx="34" cy="-162" rx="6" ry="4" fill="#e7f5ff" stroke="#a5d8ff" strokeWidth="1.2" />
        <ellipse cx="44" cy="-162" rx="6" ry="4" fill="#e7f5ff" stroke="#a5d8ff" strokeWidth="1.2" />
        <ellipse cx="40" cy="-152" rx="10" ry="7" fill="#fcc419" />
        <path d="M37 -158 V-146 M43 -158 V-146" stroke={INK} strokeWidth="2.5" />
        <circle cx="49" cy="-153" r="1.6" fill={INK} />
      </g>
    </>
  );
}

/** A stack of red shopping baskets; the top one hops up and its handles flip. */
export function Einkaufskorb() {
  const basket = (y: number) => (
    <>
      <path d={`M-58 ${y - 44} H58 L48 ${y} H-48 Z`} fill="#e03131" />
      {[-36, -18, 0, 18, 36].map((x) => (
        <rect key={x} x={x - 5} y={y - 34} width="10" height="12" rx="3" fill="#c92a2a" />
      ))}
      <rect x="-60" y={y - 48} width="120" height="8" rx="3" fill="#fa5252" />
    </>
  );
  return (
    <>
      {basket(0)}
      {basket(-16)}
      <g className="sm-korb-top" style={{ transformOrigin: "0px -32px" }}>
        <g className="sm-korb-handle" style={{ transformOrigin: "-50px -80px" }}>
          <path d="M-50 -80 Q-46 -110 -10 -110" stroke={INK} strokeWidth="6" strokeLinecap="round" fill="none" />
        </g>
        <g className="sm-korb-handle" style={{ ...nth(1), transformOrigin: "50px -80px" }}>
          <path d="M50 -80 Q46 -110 10 -110" stroke={INK} strokeWidth="6" strokeLinecap="round" fill="none" />
        </g>
        {basket(-32)}
        <path d="M-44 -70 L-38 -40" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
      </g>
    </>
  );
}

/** The floor cleaning machine with its driver; brushes spin, the light blinks and foam bubbles. */
export function Wischmaschine() {
  return (
    <>
      <ellipse className="sm-wisch-wet" cx="-150" cy="-4" rx="46" ry="8" fill="#a5d8ff" />
      <g className="sm-wisch-body" style={{ transformOrigin: "0px 0px" }}>
        {/* Beacon on its pole */}
        <rect x="-94" y="-196" width="6" height="60" fill={STEEL} />
        <path d="M-102 -192 Q-102 -212 -91 -212 Q-80 -212 -80 -192 Z" fill="#ff922b" />
        <ellipse className="sm-wisch-beacon" cx="-91" cy="-200" rx="22" ry="18" fill="#ffd8a8" opacity="0" />
        {/* Water tank */}
        <rect x="-112" y="-150" width="54" height="34" rx="8" fill="#74c0fc" opacity="0.85" />
        <path d="M-104 -132 q8 -5 16 0 t16 0 t16 0" stroke="#fff" strokeWidth="3" fill="none" />
        {/* Driver */}
        <g className="sm-wisch-driver" style={{ transformOrigin: "-24px -130px" }}>
          <rect x="-48" y="-190" width="48" height="64" rx="16" fill="#1c7ed6" />
          <path d="M-36 -190 V-140 M-12 -190 V-140" stroke="#fcc419" strokeWidth="4" />
          <circle cx="-24" cy="-212" r="20" fill={SKIN} />
          <Face cx={-22} cy={-211} size={0.7} />
          <Lid cx={-26.9} cy={-211} r={2.5} fill={SKIN} />
          <Lid cx={-17.1} cy={-211} r={2.5} fill={SKIN} />
          <path d="M-45 -216 Q-44 -236 -24 -236 Q-4 -236 -3 -216 Z" fill="#e03131" />
          <path d="M-6 -220 H14" stroke="#e03131" strokeWidth="6" strokeLinecap="round" />
          <g className="sm-wisch-arm" style={{ transformOrigin: "-6px -178px" }}>
            <path d="M-6 -178 L20 -164" stroke="#1c7ed6" strokeWidth="11" strokeLinecap="round" />
            <circle cx="22" cy="-164" r="6.5" fill={SKIN} />
          </g>
        </g>
        {/* Steering wheel */}
        <path d="M34 -118 L22 -160" stroke="#495057" strokeWidth="7" strokeLinecap="round" />
        <ellipse cx="20" cy="-164" rx="16" ry="5" fill="none" stroke="#343a40" strokeWidth="5" />
        {/* Body and seat */}
        <rect x="-60" y="-138" width="40" height="16" rx="6" fill="#343a40" />
        <path d="M-112 -122 H72 Q96 -122 96 -98 V-40 Q96 -28 84 -28 H-100 Q-112 -28 -112 -40 Z" fill="#fcc419" />
        <path d="M-112 -56 H96 V-40 Q96 -28 84 -28 H-100 Q-112 -28 -112 -40 Z" fill="#f59f00" />
        <path d="M-96 -110 H60" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.5" />
        <rect x="-82" y="-100" width="60" height="30" rx="6" fill="#fff" opacity="0.8" />
        <circle cx="-66" cy="-85" r="7" fill="#74c0fc" />
        <circle cx="-48" cy="-89" r="5" fill="#a5d8ff" />
        <circle cx="-38" cy="-80" r="4" fill="#74c0fc" />
        <circle className="sm-wisch-lamp" cx="88" cy="-86" r="6" fill="#fff9db" />
      </g>
      <g className="sm-wisch-wheel" style={{ transformOrigin: "-66px -24px" }}>
        <Wheel cx={-66} cy={-24} r={24} />
      </g>
      <g className="sm-wisch-wheel" style={{ transformOrigin: "54px -18px" }}>
        <Wheel cx={54} cy={-18} r={18} />
      </g>
      {/* Round brush at the front */}
      <g className="sm-wisch-brush" style={{ transformOrigin: "100px -20px" }}>
        <circle cx="100" cy="-20" r="20" fill="#1971c2" />
        {[0, 45, 90, 135].map((a) => (
          <path key={a} d="M100 -38 V-2" stroke="#74c0fc" strokeWidth="4" transform={`rotate(${a} 100 -20)`} />
        ))}
        <circle cx="100" cy="-20" r="6" fill="#343a40" />
      </g>
      <g className="sm-wisch-foam" fill="#fff" stroke="#d0ebff" strokeWidth="2">
        {[76, 100, 124, 112, 88].map((x, i) => (
          <circle key={i} cx={x} cy={-6 - (i % 2) * 12} r={7 + (i % 3) * 2} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** A chalkboard sign; it rocks on its legs, the drawn strawberry glows and a chalk star appears. */
export function Tafel() {
  return (
    <g className="sm-tafel-body" style={{ transformOrigin: "0px 0px" }}>
      <path d="M-30 -150 L-40 0 M30 -150 L40 0" stroke="#8d5a2b" strokeWidth="5" />
      <path d="M-44 -152 H44 L48 0 H38 L36 -10 H-36 L-38 0 H-48 Z" fill="#c8814a" />
      <rect x="-36" y="-144" width="72" height="126" rx="4" fill="#2b8a3e" />
      <rect x="-14" y="-160" width="28" height="12" rx="6" fill="#8d5a2b" />
      <g className="sm-tafel-chalk" style={{ transformOrigin: "0px -96px" }}>
        <path d="M-16 -112 Q0 -120 16 -112 Q14 -82 0 -72 Q-14 -82 -16 -112 Z" fill="#ff6b6b" />
        <path d="M-10 -116 l4 -10 l6 8 l6 -8 l4 10" fill="#69db7c" />
        {[
          [-6, -104],
          [6, -100],
          [0, -90],
          [-6, -86],
          [6, -84],
        ].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r="1.6" fill="#fff9db" />
        ))}
      </g>
      <path d="M-24 -54 Q-12 -62 0 -54 T24 -54 M-20 -38 H20" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.85" />
      <path className="sm-tafel-star" d="M22 -134 l3 7 l7 1 l-5 5 l1 7 l-6 -3 l-6 3 l1 -7 l-5 -5 l7 -1 Z" fill="#fff" />
    </g>
  );
}

/** The shop assistant on his stepladder; he lifts a box onto the shelf, whistles and the ladder wobbles. */
export function Verkaeufer() {
  return (
    <g className="sm-verk-ladder" style={{ transformOrigin: "0px 0px" }}>
      <path d="M-36 0 L-18 -96 M36 0 L18 -96" stroke="#868e96" strokeWidth="7" strokeLinecap="round" />
      <path d="M-30 -32 H30 M-24 -64 H24" stroke="#adb5bd" strokeWidth="6" strokeLinecap="round" />
      <rect x="-26" y="-102" width="52" height="10" rx="3" fill="#495057" />
      <g className="sm-verk-body" style={{ transformOrigin: "0px -100px" }}>
        <rect x="-17" y="-154" width="15" height="54" rx="5" fill="#364fc7" />
        <rect x="2" y="-154" width="15" height="54" rx="5" fill="#364fc7" />
        <rect x="-21" y="-106" width="20" height="9" rx="4" fill={INK} />
        <rect x="1" y="-106" width="20" height="9" rx="4" fill={INK} />
        <rect x="-26" y="-218" width="52" height="72" rx="16" fill="#40c057" />
        <path d="M-18 -200 H18 V-146 H-18 Z" fill="#e03131" />
        <rect x="6" y="-196" width="12" height="7" rx="2" fill="#fff" />
        <circle cx="0" cy="-240" r="22" fill={SKIN} />
        <path d="M-22 -242 Q-22 -266 0 -266 Q22 -266 22 -242 Q14 -254 0 -254 Q-14 -254 -22 -242 Z" fill="#343a40" />
        <Face cx={0} cy={-240} size={0.78} />
        <Lid cx={-5.46} cy={-240} r={2.8} fill={SKIN} />
        <Lid cx={5.46} cy={-240} r={2.8} fill={SKIN} />
        <g className="sm-verk-lift" style={{ transformOrigin: "0px -206px" }}>
          <path d="M-20 -208 L-46 -254 M18 -208 L-20 -258" stroke="#40c057" strokeWidth="11" strokeLinecap="round" />
          <rect x="-82" y="-296" width="54" height="40" rx="3" fill="#d4a373" />
          <path d="M-82 -282 H-28 M-55 -296 V-282" stroke="#bc8a5f" strokeWidth="3" />
          <path d="M-74 -270 l5 -6 l5 6 l5 -6 l5 6" stroke="#e03131" strokeWidth="2.5" fill="none" />
          <circle cx="-46" cy="-258" r="7" fill={SKIN} />
          <circle cx="-22" cy="-260" r="7" fill={SKIN} />
        </g>
      </g>
      <Notes x={18} y={-268} colour="#1c7ed6" size={0.9} />
    </g>
  );
}

const CAN_LABELS = ["#fa5252", "#40c057", "#fcc419", "#4dabf7"];

/** A tower of cans; it wobbles, the cans jiggle one row after the other and the top can hops. */
export function Dosenturm() {
  const can = (x: number, y: number, label: string, key: string) => (
    <g key={key}>
      <rect x={x - 19} y={y - 42} width="38" height="42" rx="4" fill="#ced4da" />
      <rect x={x - 19} y={y - 33} width="38" height="24" fill={label} />
      <circle cx={x} cy={y - 21} r="7" fill="#fff" opacity="0.85" />
      <ellipse cx={x} cy={y - 42} rx="19" ry="4" fill="#e9ecef" />
      <path d={`M${x - 13} ${y - 36} V${y - 6}`} stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
    </g>
  );
  const rows = [4, 3, 2];
  return (
    <g className="sm-dosen-tower" style={{ transformOrigin: "0px 0px" }}>
      {rows.map((n, row) => (
        <g key={row} className="sm-dosen-row" style={{ ...nth(row), transformOrigin: `0px ${-row * 42}px` }}>
          {Array.from({ length: n }, (_, i) => can((i - (n - 1) / 2) * 42, -row * 42, CAN_LABELS[(i + row) % 4], `${row}-${i}`))}
        </g>
      ))}
      <g className="sm-dosen-top" style={{ transformOrigin: "0px -147px" }}>
        {can(0, -126, "#fa5252", "top")}
      </g>
    </g>
  );
}

/** A girl pushes a little shopping cart with a flag; the cart rolls, the flag waves and she honks the horn. */
export function KleinerWagen() {
  return (
    <g className="sm-kwagen-ride">
      {/* Flag */}
      <path d="M68 -92 V-212" stroke={STEEL} strokeWidth="3.5" />
      <g className="sm-kwagen-flag" style={{ transformOrigin: "68px -210px" }}>
        <path d="M68 -212 L108 -200 L68 -186 Z" fill="#ff922b" />
      </g>
      {/* Girl */}
      <g className="sm-kwagen-girl" style={{ transformOrigin: "-58px 0px" }}>
        <rect x="-70" y="-62" width="9" height="60" rx="4" fill={SKIN} />
        <rect x="-54" y="-62" width="9" height="60" rx="4" fill={SKIN} />
        <rect x="-74" y="-8" width="16" height="9" rx="4" fill="#e64980" />
        <rect x="-56" y="-8" width="16" height="9" rx="4" fill="#e64980" />
        <path d="M-78 -56 L-70 -118 H-46 L-38 -56 Z" fill="#fcc419" />
        <path d="M-48 -108 L-26 -96" stroke={SKIN} strokeWidth="8" strokeLinecap="round" />
        <circle cx="-58" cy="-140" r="20" fill={SKIN} />
        <path d="M-78 -140 Q-78 -162 -58 -162 Q-38 -162 -38 -140 Q-48 -152 -58 -150 Q-68 -152 -78 -140 Z" fill="#8d5a2b" />
        <g className="sm-kwagen-tail" style={{ transformOrigin: "-78px -146px" }}>
          <path d="M-78 -146 Q-92 -146 -94 -128" stroke="#8d5a2b" strokeWidth="7" strokeLinecap="round" fill="none" />
        </g>
        <g className="sm-kwagen-tail" style={{ ...nth(1), transformOrigin: "-38px -146px" }}>
          <path d="M-38 -146 Q-24 -146 -22 -128" stroke="#8d5a2b" strokeWidth="7" strokeLinecap="round" fill="none" />
        </g>
        <Face cx={-58} cy={-139} size={0.7} />
        <Lid cx={-62.9} cy={-139} r={2.5} fill={SKIN} />
        <Lid cx={-53.1} cy={-139} r={2.5} fill={SKIN} />
      </g>
      {/* Cart */}
      <path d="M-30 -104 V-16" stroke={STEEL} strokeWidth="4" />
      <rect x="-36" y="-110" width="14" height="8" rx="4" fill="#e03131" />
      <g className="sm-kwagen-horn" style={{ transformOrigin: "-22px -106px" }}>
        <circle cx="-16" cy="-112" r="6" fill="#e03131" />
        <path d="M-12 -110 L4 -118 V-102 Z" fill="#fcc419" />
      </g>
      <Lines x={10} y={-110} colour="#868e96" size={0.7} />
      <rect x="-12" y="-104" width="10" height="16" rx="3" fill="#ff922b" transform="rotate(-20 -7 -96)" />
      <ellipse cx="34" cy="-96" rx="14" ry="9" fill="#ffd43b" />
      <path d="M-30 -92 H78 L70 -40 H-22 Z" fill="#4dabf7" />
      <path d="M-14 -80 V-48 M6 -82 V-46 M26 -82 V-46 M46 -82 V-46 M64 -82 V-46 M-24 -66 H74" stroke="#a5d8ff" strokeWidth="3" />
      <path d="M-32 -94 H80" stroke="#1c7ed6" strokeWidth="5" strokeLinecap="round" />
      <path d="M-22 -40 L-16 -14 M70 -40 L64 -14" stroke={STEEL} strokeWidth="4" />
      <g className="sm-kwagen-wheel" style={{ transformOrigin: "-16px -10px" }}>
        <Wheel cx={-16} cy={-10} r={10} />
      </g>
      <g className="sm-kwagen-wheel" style={{ transformOrigin: "64px -10px" }}>
        <Wheel cx={64} cy={-10} r={10} />
      </g>
    </g>
  );
}

/** The freezer chest; a glass lid slides open, cold mist rises and an ice cream pops up and wiggles. */
export function Eistruhe() {
  return (
    <>
      {/* Ice cream sign on a stick */}
      <g className="sm-eis-sign" style={{ transformOrigin: "124px -100px" }}>
        <rect x="121" y="-150" width="6" height="52" fill={STEEL} />
        <path d="M110 -150 L124 -116 L138 -150 Z" fill="#e0a060" />
        <path d="M114 -146 L134 -146 M118 -136 L130 -136" stroke="#c8814a" strokeWidth="2" />
        <circle cx="124" cy="-158" r="15" fill="#f783ac" />
        <circle cx="118" cy="-162" r="4" fill="#fff" opacity="0.5" />
      </g>
      {/* The ice cream that pops up */}
      <g className="sm-eis-cone" style={{ transformOrigin: "-70px -116px" }}>
        <path d="M-82 -150 L-70 -112 L-58 -150 Z" fill="#e0a060" />
        <circle cx="-70" cy="-156" r="12" fill="#ffd8a8" />
        <circle cx="-70" cy="-172" r="11" fill="#b2f2bb" />
        <circle cx="-70" cy="-186" r="10" fill="#f783ac" />
        <circle cx="-70" cy="-198" r="4" fill="#e03131" />
        <circle cx="-74" cy="-171" r="1.8" fill={INK} />
        <circle cx="-66" cy="-171" r="1.8" fill={INK} />
        <path d="M-74 -166 q4 3 8 0" stroke={INK} strokeWidth="1.5" fill="none" />
      </g>
      {/* Someone else climbs out of the open side every time */}
      <Hideout x={28} y={-210} w={100} h={100} size={64} />
      {/* Rim and what is inside */}
      <path d="M-150 -96 L-138 -130 H138 L150 -96 Z" fill="#f8f9fa" />
      <path d="M-136 -100 L-128 -124 H128 L136 -100 Z" fill="#d0ebff" />
      {Array.from({ length: 10 }, (_, i) => (
        <rect
          key={i}
          x={-122 + i * 25}
          y={-120 + (i % 2) * 6}
          width="20"
          height="14"
          rx="3"
          fill={["#ffc9c9", "#fff3bf", "#d3f9d8", "#e5dbff", "#ffd8a8"][i % 5]}
        />
      ))}
      <path d="M-128 -124 L-136 -100 H0 V-124 Z" fill="#e7f5ff" fillOpacity="0.5" stroke="#adb5bd" strokeWidth="3" />
      <g className="sm-eis-lid">
        <path d="M0 -124 V-100 H136 L128 -124 Z" fill="#e7f5ff" fillOpacity="0.55" stroke="#adb5bd" strokeWidth="3" />
        <path d="M30 -104 L44 -122 M60 -104 L74 -122" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
        <rect x="8" y="-116" width="5" height="10" rx="2" fill={STEEL} />
      </g>
      {/* Body */}
      <rect x="-150" y="-98" width="300" height="94" rx="10" fill="#4dabf7" />
      <rect x="-150" y="-30" width="300" height="26" rx="8" fill="#1c7ed6" />
      <path d="M-134 -86 H134" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
      {[-100, 0, 100].map((x) => (
        <g key={x} stroke="#fff" strokeWidth="3.5" strokeLinecap="round" transform={`translate(${x} -60)`}>
          <path d="M0 -14 V14 M-12 -7 L12 7 M-12 7 L12 -7" />
        </g>
      ))}
      <Mist x={-60} y={-130} count={4} spread={34} r={14} />
      <Sparkles x={40} y={-70} spread={60} colour="#fff" />
    </>
  );
}

const GUMBALLS = ["#fa5252", "#fcc419", "#4dabf7", "#69db7c", "#f783ac", "#ff922b", "#fff"];

/** A red gumball machine; the crank turns, the balls jiggle and one rolls out and bounces. */
export function Kaugummiautomat() {
  return (
    <>
      <ellipse cx="0" cy="-6" rx="34" ry="8" fill="#c92a2a" />
      <rect x="-8" y="-124" width="16" height="120" fill="#e03131" />
      <path d="M-3 -118 V-12" stroke="#fff" strokeWidth="3" opacity="0.4" />
      {/* Glass globe */}
      <circle cx="0" cy="-200" r="46" fill="#e7f5ff" fillOpacity="0.6" stroke="#ced4da" strokeWidth="3" />
      <g className="sm-kaugummi-balls" style={{ transformOrigin: "0px -170px" }}>
        {Array.from({ length: 17 }, (_, i) => {
          const row = Math.floor(i / 5);
          const col = i % 5;
          const x = (col - 2) * 15 + (row % 2) * 7;
          const y = -172 - row * 14;
          return Math.hypot(x, y + 200) < 38 ? <circle key={i} cx={x} cy={y} r="7" fill={GUMBALLS[i % GUMBALLS.length]} /> : null;
        })}
      </g>
      <path d="M-28 -228 Q-20 -240 -6 -242" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M-14 -246 Q0 -256 14 -246 Z" fill="#e03131" />
      <circle cx="0" cy="-252" r="5" fill="#e03131" />
      {/* Head with the crank */}
      <rect x="-36" y="-164" width="72" height="42" rx="8" fill="#e03131" />
      <rect x="-30" y="-158" width="10" height="4" rx="2" fill="#343a40" />
      <g className="sm-kaugummi-crank" style={{ transformOrigin: "8px -143px" }}>
        <circle cx="8" cy="-143" r="11" fill="#dee2e6" stroke="#adb5bd" strokeWidth="2" />
        <rect x="5" y="-157" width="6" height="28" rx="3" fill="#868e96" />
      </g>
      <path d="M-14 -126 h28 v10 h-28 Z" fill="#adb5bd" />
      <circle className="sm-kaugummi-ball" cx="0" cy="-122" r="7" fill="#4dabf7" />
    </>
  );
}

/** A full paper shopping bag; it wobbles, the baguette pops up, the leek waves and an apple jumps. */
export function Einkaufstuete() {
  return (
    <>
      <g className="sm-tuete-lauch" style={{ transformOrigin: "26px -100px" }}>
        <rect x="20" y="-150" width="12" height="52" fill="#fff" />
        <path
          d="M26 -146 Q16 -170 8 -176 M26 -146 Q28 -172 24 -182 M26 -146 Q38 -168 46 -170"
          stroke="#40c057"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
      </g>
      <g className="sm-tuete-baguette" style={{ transformOrigin: "-22px -100px" }}>
        <path d="M-40 -100 L-18 -168 Q-12 -176 -6 -166 L-22 -100 Z" fill="#e0a060" />
        <path d="M-24 -152 l8 3 M-29 -137 l8 3 M-33 -122 l8 3" stroke="#f3d9b1" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="sm-tuete-apfel" style={{ transformOrigin: "0px -104px" }}>
        <circle cx="0" cy="-110" r="13" fill="#f03e3e" />
        <path d="M0 -122 q2 -6 6 -8" stroke="#8d5a2b" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>
      <g className="sm-tuete-bag" style={{ transformOrigin: "0px 0px" }}>
        <path d="M-54 -104 H54 L58 0 H-58 Z" fill="#d4a373" />
        <path d="M-54 -104 L-46 -114 H46 L54 -104 Z" fill="#bc8a5f" />
        <path d="M-58 0 H58 L56 -10 H-56 Z" fill="#bc8a5f" />
        <path d="M-40 -90 L-44 -14" stroke="#e9c69a" strokeWidth="6" strokeLinecap="round" />
        <circle cx="10" cy="-56" r="18" fill="#fff" opacity="0.8" />
        <path d="M2 -58 q8 10 16 0" stroke="#40c057" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="4" cy="-62" r="2" fill="#40c057" />
        <circle cx="16" cy="-62" r="2" fill="#40c057" />
      </g>
    </>
  );
}

/** The yellow "wet floor" sign by a puddle; it wobbles, the little man slips and drops splash. */
export function Warnschild() {
  return (
    <>
      <ellipse className="sm-warn-puddle" cx="10" cy="2" rx="66" ry="12" fill="#a5d8ff" opacity="0.8" style={{ transformOrigin: "10px 2px" }} />
      <ellipse cx="-6" cy="-1" rx="28" ry="4" fill="#fff" opacity="0.7" />
      <g className="sm-warn-sign" style={{ transformOrigin: "0px 0px" }}>
        <path d="M-30 -150 L-44 0 M30 -150 L44 0" stroke="#f59f00" strokeWidth="6" />
        <path d="M-34 -156 H34 L48 0 H-48 Z" fill="#fcc419" />
        <rect x="-12" y="-150" width="24" height="10" rx="5" fill="#f59f00" />
        <path d="M-28 -124 L0 -76 H-56 Z" transform="translate(28 0)" fill="#fff" stroke="#e03131" strokeWidth="5" strokeLinejoin="round" />
        <g className="sm-warn-man" style={{ transformOrigin: "0px -84px" }}>
          <circle cx="4" cy="-108" r="4.5" fill={INK} />
          <path
            d="M2 -102 L-4 -92 L6 -86 M-4 -92 L-12 -86 M2 -100 L12 -104"
            stroke={INK}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
        <path d="M-12 -82 q6 -4 12 0 t12 0" stroke="#4dabf7" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M-30 -50 H30 M-26 -34 H26" stroke="#f59f00" strokeWidth="5" strokeLinecap="round" />
      </g>
      <g className="sm-warn-drops" fill="#74c0fc">
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${-30 + i * 22} -12 q5 7 0 10 q-5 -3 0 -10 Z`} style={nth(i)} />
        ))}
      </g>
    </>
  );
}
