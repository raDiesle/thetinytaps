import { INK, nth } from "../shared";

// The big farm animals. Each drawing has its foot point at (0, 0).

const SPOT = "#2b2d42";

/** Hoof at the bottom of a leg. */
function Leg({ x, top, w, fill, hoof = "#495057" }: { x: number; top: number; w: number; fill: string; hoof?: string }) {
  return (
    <>
      <rect x={x - w / 2} y={top} width={w} height={-top} rx={w / 2.6} fill={fill} />
      <rect x={x - w / 2} y="-13" width={w} height="13" rx="4" fill={hoof} />
    </>
  );
}

/** Black-and-white cow, facing right; she nods, swishes her tail and rings her bell. */
export function Kuh() {
  return (
    <>
      <g className="bh-kuh-tail" style={{ transformOrigin: "-118px -136px" }}>
        <path d="M-118 -136 Q-136 -104 -128 -64" stroke="#f1f3f5" strokeWidth="7" strokeLinecap="round" fill="none" />
        <ellipse cx="-128" cy="-56" rx="8" ry="13" fill={SPOT} />
      </g>
      <Leg x={-86} top={-84} w={20} fill="#dee2e6" />
      <Leg x={66} top={-84} w={20} fill="#dee2e6" />
      <rect x="-126" y="-162" width="236" height="98" rx="46" fill="#fff" />
      <path d="M-92 -160 Q-58 -154 -50 -128 Q-56 -102 -86 -106 Q-114 -112 -104 -142 Z" fill={SPOT} />
      <ellipse cx="22" cy="-104" rx="28" ry="20" fill={SPOT} />
      <path d="M40 -162 Q66 -160 72 -142 Q58 -130 40 -140 Z" fill={SPOT} />
      <path d="M-120 -90 Q0 -62 104 -90 Q100 -66 60 -64 H-80 Q-118 -66 -120 -90 Z" fill="#e9ecef" />
      <ellipse cx="-38" cy="-62" rx="22" ry="12" fill="#ffb3c1" />
      <path d="M-48 -54 v8 M-38 -52 v8 M-28 -54 v8" stroke="#ff8fa3" strokeWidth="5" strokeLinecap="round" />
      <Leg x={-64} top={-84} w={22} fill="#fff" />
      <Leg x={90} top={-84} w={22} fill="#fff" />
      <g className="bh-kuh-head" style={{ transformOrigin: "96px -124px" }}>
        <path d="M78 -152 Q118 -156 128 -114 L102 -82 Q86 -100 78 -152 Z" fill="#fff" />
        <ellipse cx="98" cy="-158" rx="19" ry="9" transform="rotate(-24 98 -158)" fill="#fff" />
        <ellipse cx="98" cy="-158" rx="11" ry="5" transform="rotate(-24 98 -158)" fill="#ffb3c1" />
        <ellipse cx="168" cy="-158" rx="19" ry="9" transform="rotate(24 168 -158)" fill="#fff" />
        <ellipse cx="168" cy="-158" rx="11" ry="5" transform="rotate(24 168 -158)" fill="#ffb3c1" />
        <path d="M114 -164 Q106 -182 114 -192 Q118 -178 126 -170 Z M152 -164 Q160 -182 152 -192 Q148 -178 140 -170 Z" fill="#fefae0" />
        <ellipse cx="133" cy="-130" rx="34" ry="40" fill="#fff" />
        <ellipse cx="148" cy="-142" rx="14" ry="17" fill={SPOT} />
        <ellipse cx="133" cy="-100" rx="30" ry="19" fill="#ffb3c1" />
        <ellipse cx="122" cy="-102" rx="4" ry="3" fill="#e5989b" />
        <ellipse cx="144" cy="-102" rx="4" ry="3" fill="#e5989b" />
        <path d="M124 -91 Q133 -85 142 -91" stroke="#e5989b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="120" cy="-136" r="4.5" fill={SPOT} />
        <circle cx="146" cy="-136" r="4.5" fill="#fff" />
        <circle cx="146" cy="-136" r="4" fill={SPOT} />
        <circle cx="121.4" cy="-137.4" r="1.4" fill="#fff" />
        <circle cx="147.4" cy="-137.4" r="1.4" fill="#fff" />
        <path d="M110 -84 Q133 -70 156 -84" stroke="#e63946" strokeWidth="6" fill="none" />
        <g className="bh-kuh-bell" style={{ transformOrigin: "133px -77px" }}>
          <path d="M126 -77 H140 L145 -58 H121 Z" fill="#ffd60a" />
          <circle cx="133" cy="-56" r="3.5" fill="#c9a227" />
          <path d="M129 -74 L127 -62" stroke="#fff" strokeWidth="2" opacity="0.6" />
        </g>
      </g>
    </>
  );
}

const COAT = "#a0522d";
const MANE = "#4a2511";

/** Brown horse, facing right; it rears up, shakes its mane and swishes its tail. */
export function Pferd() {
  return (
    <g className="bh-pferd-body" style={{ transformOrigin: "-70px 0px" }}>
      <path
        className="bh-pferd-tail"
        d="M-108 -152 Q-142 -140 -140 -90 Q-134 -62 -122 -56 Q-128 -100 -100 -136 Z"
        fill={MANE}
        style={{ transformOrigin: "-108px -150px" }}
      />
      <Leg x={-78} top={-112} w={16} fill="#8a4522" hoof="#3d2314" />
      <Leg x={64} top={-112} w={16} fill="#8a4522" hoof="#3d2314" />
      <ellipse cx="-12" cy="-134" rx="104" ry="44" fill={COAT} />
      <ellipse cx="-12" cy="-104" rx="72" ry="12" fill="#b5653a" />
      <ellipse cx="-40" cy="-160" rx="50" ry="9" fill="#fff" opacity="0.2" />
      <Leg x={-56} top={-112} w={18} fill={COAT} hoof="#3d2314" />
      <Leg x={86} top={-112} w={18} fill={COAT} hoof="#3d2314" />
      <rect x="77" y="-34" width="18" height="21" fill="#fff" />
      <g className="bh-pferd-head" style={{ transformOrigin: "80px -150px" }}>
        <path d="M46 -166 Q70 -214 104 -238 L128 -216 Q104 -176 98 -118 Q60 -108 46 -166 Z" fill={COAT} />
        <path d="M104 -240 Q124 -258 140 -240 L176 -178 Q180 -156 160 -154 Q146 -154 136 -168 L102 -214 Z" fill={COAT} />
        <ellipse cx="163" cy="-166" rx="17" ry="13" fill="#7f3e1d" />
        <ellipse cx="170" cy="-168" rx="3.5" ry="2.5" fill="#3d2314" />
        <path d="M118 -242 Q126 -240 129 -232 L156 -182 Q151 -176 146 -181 L118 -230 Z" fill="#fff" opacity="0.9" />
        <path d="M110 -240 L104 -266 L124 -246 Z" fill={COAT} />
        <path d="M111 -246 L108 -258 L118 -248 Z" fill="#7f3e1d" />
        <circle cx="127" cy="-222" r="5" fill={SPOT} />
        <circle cx="128.6" cy="-223.6" r="1.6" fill="#fff" />
        <path d="M156 -158 Q164 -154 172 -158" stroke="#3d2314" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path
          className="bh-pferd-mane"
          d="M106 -242 Q84 -228 70 -202 Q56 -182 44 -164 Q58 -168 62 -180 Q74 -182 74 -196 Q88 -202 90 -218 Q104 -222 106 -242 Z"
          fill={MANE}
          style={{ transformOrigin: "106px -240px" }}
        />
        <path d="M110 -246 Q120 -238 114 -224 Q106 -232 104 -242 Z" fill={MANE} />
      </g>
    </g>
  );
}

const WOOL = [
  [-44, -62, 26],
  [-14, -74, 30],
  [20, -72, 30],
  [44, -60, 24],
  [-30, -44, 24],
  [8, -42, 26],
  [36, -42, 22],
] as const;

/** A sheep facing right; `face` is the colour of its head. */
function Sheep({ face }: { face: string }) {
  return (
    <g className="bh-schaf-body">
      {[-40, -22, 24, 42].map((x) => (
        <rect key={x} x={x - 5} y="-46" width="10" height="46" rx="4" fill="#495057" />
      ))}
      {WOOL.map(([cx, cy, r]) => (
        <circle key={`s${cx}`} cx={cx} cy={cy + 5} r={r} fill="#e9ecef" />
      ))}
      {WOOL.map(([cx, cy, r]) => (
        <circle key={cx} cx={cx} cy={cy} r={r} fill="#fff" />
      ))}
      <ellipse cx="-10" cy="-92" rx="22" ry="7" fill="#fff" opacity="0.8" />
      <g className="bh-schaf-head" style={{ transformOrigin: "56px -66px" }}>
        <ellipse cx="54" cy="-80" rx="13" ry="6" transform="rotate(-24 54 -80)" fill={face} />
        <ellipse cx="88" cy="-80" rx="13" ry="6" transform="rotate(24 88 -80)" fill={face} />
        <ellipse cx="71" cy="-68" rx="18" ry="23" fill={face} />
        <circle cx="64" cy="-90" r="9" fill="#fff" />
        <circle cx="76" cy="-91" r="9" fill="#fff" />
        <circle cx="64" cy="-70" r="4.5" fill="#fff" />
        <circle cx="78" cy="-70" r="4.5" fill="#fff" />
        <circle cx="65" cy="-70" r="2.6" fill={SPOT} />
        <circle cx="79" cy="-70" r="2.6" fill={SPOT} />
        <path d="M66 -54 Q71 -50 76 -54" stroke={SPOT} strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>
    </g>
  );
}

/** Woolly sheep; it hops and bleats. */
export function Schaf() {
  return <Sheep face="#6c757d" />;
}

/** Little lamb, smaller and facing left. */
export function Lamm() {
  return (
    <g transform="scale(-0.72 0.72)">
      <Sheep face="#e5d4c0" />
    </g>
  );
}

const GOAT = "#ede0d4";

/** Goat with horns and a beard, facing left; it butts with its head. */
export function Ziege() {
  return (
    <g className="bh-ziege-body">
      <path d="M58 -98 L74 -116 L66 -92 Z" fill={GOAT} />
      <Leg x={-36} top={-70} w={12} fill="#d6ccc2" />
      <Leg x={46} top={-70} w={12} fill="#d6ccc2" />
      <ellipse cx="6" cy="-82" rx="62" ry="30" fill={GOAT} />
      <ellipse cx="26" cy="-88" rx="22" ry="16" fill="#b08968" />
      <ellipse cx="-4" cy="-60" rx="44" ry="8" fill="#d6ccc2" />
      <Leg x={-22} top={-70} w={13} fill={GOAT} />
      <Leg x={30} top={-70} w={13} fill={GOAT} />
      <g className="bh-ziege-head" style={{ transformOrigin: "-36px -96px" }}>
        <path d="M-28 -104 L-50 -132 L-68 -118 L-46 -84 Z" fill={GOAT} />
        <path d="M-58 -142 Q-46 -170 -22 -162 Q-38 -158 -50 -138 Z" fill="#a5a58d" />
        <path d="M-50 -144 Q-34 -168 -12 -158 Q-28 -154 -42 -136 Z" fill="#b7b7a4" />
        <ellipse cx="-36" cy="-130" rx="15" ry="6" transform="rotate(24 -36 -130)" fill={GOAT} />
        <ellipse cx="-36" cy="-130" rx="9" ry="3.5" transform="rotate(24 -36 -130)" fill="#ffb3c1" />
        <path d="M-50 -146 Q-34 -140 -42 -118 L-72 -94 Q-86 -92 -88 -104 L-70 -138 Q-62 -150 -50 -146 Z" fill={GOAT} />
        <path d="M-78 -96 L-74 -72 L-64 -96 Z" fill="#b08968" />
        <circle cx="-60" cy="-128" r="4" fill={SPOT} />
        <circle cx="-61.2" cy="-129.2" r="1.3" fill="#fff" />
        <ellipse cx="-84" cy="-102" rx="2.5" ry="2" fill="#6c584c" />
        <path d="M-82 -94 Q-76 -92 -72 -96" stroke="#6c584c" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>
    </g>
  );
}

const DOG = "#c68b59";

/** Dog in front of its kennel; it jumps, wags its tail and barks. */
export function Hund() {
  return (
    <>
      <rect x="-118" y="-100" width="104" height="100" fill="#8d5a2b" />
      <path d="M-118 -76 H-14 M-118 -50 H-14 M-118 -24 H-14" stroke="#7f5539" strokeWidth="3" />
      <path d="M-130 -94 L-66 -150 L-2 -94 Z" fill="#bc4749" />
      <path d="M-130 -94 L-66 -150 L-2 -94" stroke="#9d0208" strokeWidth="6" strokeLinejoin="round" fill="none" />
      <path d="M-90 0 V-48 Q-90 -74 -66 -74 Q-42 -74 -42 -48 V0 Z" fill="#3d2314" />
      <rect x="-94" y="-98" width="56" height="16" rx="3" fill="#e9c46a" />
      <text x="-66" y="-90" fill="#7f5539" fontSize="11" fontWeight="800" textAnchor="middle" dominantBaseline="central">
        BELLO
      </text>
      <ellipse cx="-4" cy="-6" rx="18" ry="6" fill="#e63946" />
      <path d="M-14 -10 l4 -6 M-4 -11 l2 -6" stroke="#f1c27d" strokeWidth="4" strokeLinecap="round" />
      <g className="bh-hund-body">
        <path
          className="bh-hund-tail"
          d="M92 -28 Q118 -40 116 -66"
          stroke={DOG}
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          style={{ transformOrigin: "92px -28px" }}
        />
        <ellipse cx="72" cy="-34" rx="32" ry="30" fill={DOG} />
        <ellipse cx="90" cy="-6" rx="16" ry="7" fill="#ede0d4" />
        <ellipse cx="46" cy="-56" rx="26" ry="36" fill={DOG} />
        <ellipse cx="42" cy="-52" rx="14" ry="24" fill="#ede0d4" />
        <rect x="26" y="-48" width="13" height="46" rx="6" fill={DOG} />
        <rect x="48" y="-48" width="13" height="46" rx="6" fill={DOG} />
        <ellipse cx="32" cy="-4" rx="9" ry="5" fill="#ede0d4" />
        <ellipse cx="55" cy="-4" rx="9" ry="5" fill="#ede0d4" />
        <path d="M24 -80 Q46 -70 68 -80" stroke="#3a86ff" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="46" cy="-72" r="5" fill="#ffd60a" />
        <g className="bh-hund-head" style={{ transformOrigin: "46px -84px" }}>
          <path d="M26 -126 Q8 -122 12 -88 Q24 -92 32 -114 Z" fill="#7f5539" />
          <path d="M66 -126 Q84 -122 80 -88 Q68 -92 60 -114 Z" fill="#7f5539" />
          <circle cx="46" cy="-108" r="26" fill={DOG} />
          <ellipse cx="57" cy="-114" rx="10" ry="9" fill="#7f5539" />
          <ellipse cx="46" cy="-93" rx="15" ry="11" fill="#ede0d4" />
          <ellipse className="bh-hund-tongue" cx="48" cy="-80" rx="5" ry="7" fill="#ff5d73" />
          <ellipse cx="46" cy="-99" rx="6" ry="4.5" fill={INK} />
          <circle cx="44.5" cy="-100.5" r="1.5" fill="#fff" />
          <path d="M40 -89 Q46 -84 52 -89" stroke={INK} strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <circle cx="36" cy="-114" r="3.8" fill={SPOT} />
          <circle cx="57" cy="-114" r="3.8" fill={SPOT} />
          <circle cx="37.2" cy="-115.2" r="1.3" fill="#fff" />
          <circle cx="58.2" cy="-115.2" r="1.3" fill="#fff" />
        </g>
      </g>
    </>
  );
}

const PIG = "#ffafcc";
const MUD = "#7f5539";

/** Pig wallowing in a mud puddle; it wiggles and the mud splashes. */
export function Schwein() {
  return (
    <>
      <ellipse cx="0" cy="-12" rx="124" ry="22" fill={MUD} />
      <ellipse cx="-30" cy="-16" rx="70" ry="9" fill="#9c6644" />
      <g className="bh-schwein-splash" fill={MUD}>
        {[
          [-96, -30],
          [-66, -36],
          [74, -32],
          [104, -26],
        ].map(([cx, cy], i) => (
          <circle key={cx} cx={cx} cy={cy} r={i % 2 ? 6 : 8} style={nth(i)} />
        ))}
      </g>
      <g className="bh-schwein-body" style={{ transformOrigin: "0px -14px" }}>
        <path
          className="bh-schwein-tail"
          d="M-82 -86 q-16 -4 -14 -18 q4 -12 14 -5 q5 9 -6 11"
          stroke="#ff8fab"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          style={{ transformOrigin: "-82px -86px" }}
        />
        {[-50, 52].map((x) => (
          <rect key={x} x={x - 9} y="-50" width="18" height="40" rx="7" fill="#f497b6" />
        ))}
        <ellipse cx="0" cy="-72" rx="84" ry="48" fill={PIG} />
        <path d="M-70 -48 Q0 -18 70 -48 Q40 -26 0 -24 Q-40 -26 -70 -48 Z" fill="#f497b6" />
        <ellipse cx="-20" cy="-106" rx="40" ry="8" fill="#fff" opacity="0.45" />
        <ellipse cx="-40" cy="-60" rx="14" ry="9" fill="#9c6644" />
        <ellipse cx="18" cy="-94" rx="10" ry="7" fill="#9c6644" />
        <ellipse cx="-62" cy="-86" rx="8" ry="6" fill="#9c6644" />
        {[-28, 60].map((x) => (
          <rect key={x} x={x - 10} y="-48" width="20" height="40" rx="8" fill={PIG} />
        ))}
        <g className="bh-schwein-head" style={{ transformOrigin: "62px -80px" }}>
          <path d="M60 -110 L56 -136 L80 -118 Z" fill="#f497b6" />
          <path d="M96 -114 L108 -134 L110 -108 Z" fill="#f497b6" />
          <circle cx="82" cy="-84" r="36" fill={PIG} />
          <circle cx="76" cy="-72" r="7" fill="#ff8fab" opacity="0.6" />
          <ellipse cx="110" cy="-78" rx="17" ry="14" fill="#ff8fab" />
          <ellipse cx="105" cy="-78" rx="3" ry="4.5" fill="#c9184a" />
          <ellipse cx="115" cy="-78" rx="3" ry="4.5" fill="#c9184a" />
          <circle cx="76" cy="-98" r="4" fill={SPOT} />
          <circle cx="96" cy="-100" r="4" fill={SPOT} />
          <circle cx="77.3" cy="-99.3" r="1.3" fill="#fff" />
          <circle cx="97.3" cy="-101.3" r="1.3" fill="#fff" />
          <path d="M84 -62 Q94 -56 104 -62" stroke="#c9184a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
      </g>
      <path d="M-112 -16 Q0 4 112 -16 Q124 -6 104 4 Q0 14 -104 4 Q-124 -6 -112 -16 Z" fill={MUD} />
      <ellipse cx="40" cy="-4" rx="20" ry="3" fill="#b08968" opacity="0.7" />
    </>
  );
}

/** A piglet at (x, 0); dir 1 faces right, -1 left. */
function Piglet({ x, dir, i }: { x: number; dir: number; i: number }) {
  return (
    <g transform={`translate(${x} 0) scale(${dir} 1)`}>
      <g className="bh-ferkel-pig" style={nth(i)}>
        <path d="M-26 -30 q-10 -2 -8 -10 q4 -6 9 0" stroke="#ff8fab" strokeWidth="3" strokeLinecap="round" fill="none" />
        {[-14, 12].map((lx) => (
          <rect key={lx} x={lx - 5} y="-18" width="10" height="18" rx="4" fill="#ffafcc" />
        ))}
        <ellipse cx="0" cy="-26" rx="26" ry="18" fill="#ffc2d1" />
        <path d="M14 -52 L12 -64 L24 -54 Z" fill="#ffafcc" />
        <circle cx="22" cy="-34" r="15" fill="#ffc2d1" />
        <ellipse cx="35" cy="-31" rx="7" ry="6" fill="#ff8fab" />
        <circle cx="33" cy="-31" r="1.4" fill="#c9184a" />
        <circle cx="37" cy="-31" r="1.4" fill="#c9184a" />
        <circle cx="24" cy="-39" r="2.4" fill={SPOT} />
        <circle cx="24.7" cy="-39.7" r="0.8" fill="#fff" />
      </g>
    </g>
  );
}

/** Two piglets, nose to nose; they hop one after the other. */
export function Ferkel() {
  return (
    <>
      <Piglet x={-38} dir={1} i={0} />
      <Piglet x={40} dir={-1} i={1} />
    </>
  );
}
