import type { ReactNode } from "react";
import { Lids } from "../baustelle/figures";
import { Face, INK, SKIN, nth } from "../shared";
import { SNOW, SNOW_SHADE } from "../winterbaustelle/parts";

// Children and grown-ups playing in the snow. Each drawing stands with its foot point on (0, 0).

/** Head with a woolly hat, its bobble and a scarf; centred on (x, y). */
function Head({ x, y, hat, trim, r = 17 }: { x: number; y: number; hat: string; trim: string; r?: number }) {
  const s = r / 17;
  return (
    <>
      <circle cx={x} cy={y} r={r} fill={SKIN} />
      <Face cx={x} cy={y - 1} size={0.62 * s} />
      <Lids
        eyes={[
          [x - 4.34 * s, y - 1],
          [x + 4.34 * s, y - 1],
        ]}
        r={2.6 * s}
        fill={SKIN}
      />
      <path d={`M${x - r - 1} ${y - 4 * s} Q${x - r - 2} ${y - 24 * s} ${x} ${y - 24 * s} Q${x + r + 2} ${y - 24 * s} ${x + r + 1} ${y - 4 * s} Z`} fill={hat} />
      <rect x={x - r - 2} y={y - 8 * s} width={2 * r + 4} height={7 * s} rx={3.5 * s} fill={trim} />
      <circle className="wi-bobble" cx={x} cy={y - 28 * s} r={6 * s} fill="#fff" />
    </>
  );
}

/** A standing child in winter clothes, facing us; `children` are the arms. */
function Kid({ coat, hat, trim, pants = "#1d3557", children }: { coat: string; hat: string; trim: string; pants?: string; children?: ReactNode }) {
  return (
    <>
      <rect x="-13" y="-48" width="11" height="42" rx="5" fill={pants} />
      <rect x="2" y="-48" width="11" height="42" rx="5" fill={pants} />
      <rect x="-16" y="-10" width="15" height="10" rx="4" fill={INK} />
      <rect x="1" y="-10" width="15" height="10" rx="4" fill={INK} />
      <path d="M-21 -98 Q-29 -66 -26 -40 H26 Q29 -66 21 -98 Q0 -106 -21 -98 Z" fill={coat} />
      <path d="M0 -98 V-42" stroke={trim} strokeWidth="3" />
      {children}
      <rect x="-15" y="-102" width="30" height="7" rx="3.5" fill={trim} />
      <Head x={0} y={-118} hat={hat} trim={trim} />
    </>
  );
}

// ---------- Schneekugel ----------

/** A child rolls a big snowball for a snowman; the ball rolls, grows and crumbs fly. */
export function Schneekugel() {
  return (
    <>
      {/* Where the ball rolled, the grass shows through */}
      <path d="M-20 -2 Q60 -10 116 -2 Q60 4 -20 2 Z" fill="#a3c48f" opacity="0.7" />
      <g className="wi-kugel-crumbs" fill={SNOW} stroke={SNOW_SHADE} strokeWidth="2">
        {[
          [-104, -16],
          [-92, -34],
          [-112, -42],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="7" style={nth(i)} />
        ))}
      </g>
      <g className="wi-kugel-push" style={{ transformOrigin: "0px 0px" }}>
        <g transform="translate(48 0) rotate(-12)">
          <Kid coat="#ff8c42" hat="#3a86ff" trim="#ffd60a">
            <path d="M-14 -88 L-46 -78" stroke="#ff8c42" strokeWidth="11" strokeLinecap="round" />
            <circle cx="-48" cy="-78" r="7" fill="#3a86ff" />
            <path d="M12 -88 L-36 -60" stroke="#ff8c42" strokeWidth="11" strokeLinecap="round" />
            <circle cx="-38" cy="-58" r="7" fill="#3a86ff" />
          </Kid>
        </g>
        <g className="wi-kugel-ball" style={{ transformOrigin: "-46px 0px" }}>
          <circle cx="-46" cy="-50" r="50" fill={SNOW} />
          <path d="M-46 0 A50 50 0 0 0 4 -50 Q-6 -10 -46 0 Z" fill={SNOW_SHADE} />
          <g className="wi-kugel-roll" style={{ transformOrigin: "-46px -50px" }} stroke={SNOW_SHADE} strokeWidth="4" strokeLinecap="round" fill="none">
            <path d="M-80 -66 Q-62 -82 -40 -78" />
            <path d="M-76 -30 Q-58 -20 -38 -26" />
            <path d="M-26 -60 Q-14 -48 -20 -32" />
          </g>
          <ellipse cx="-62" cy="-74" rx="14" ry="8" fill="#fff" transform="rotate(-30 -62 -74)" />
        </g>
      </g>
    </>
  );
}

// ---------- Schneeengel ----------

/** A child lying in the snow making a snow angel: arms and legs sweep up and down. */
export function Schneeengel() {
  return (
    <>
      <ellipse cx="0" cy="-8" rx="104" ry="14" fill={SNOW_SHADE} />
      <g className="wi-engel-print" fill="#cfe0f1">
        <path d="M-6 -64 L-96 -104 Q-110 -60 -52 -40 Z" />
        <path d="M6 -64 L96 -104 Q110 -60 52 -40 Z" />
        <path d="M-10 -40 L-54 -6 Q0 10 54 -6 L10 -40 Z" />
      </g>
      <g className="wi-engel-leg wi-engel-leg-l" style={{ transformOrigin: "-6px -36px" }}>
        <path d="M-6 -36 L-32 -10" stroke="#1d3557" strokeWidth="13" strokeLinecap="round" />
        <circle cx="-35" cy="-7" r="8" fill={INK} />
      </g>
      <g className="wi-engel-leg wi-engel-leg-r" style={{ transformOrigin: "6px -36px" }}>
        <path d="M6 -36 L32 -10" stroke="#1d3557" strokeWidth="13" strokeLinecap="round" />
        <circle cx="35" cy="-7" r="8" fill={INK} />
      </g>
      <g className="wi-engel-arm wi-engel-arm-l" style={{ transformOrigin: "-14px -66px" }}>
        <path d="M-14 -66 L-62 -86" stroke="#ff5d8f" strokeWidth="11" strokeLinecap="round" />
        <circle cx="-66" cy="-88" r="7" fill="#ffd60a" />
      </g>
      <g className="wi-engel-arm wi-engel-arm-r" style={{ transformOrigin: "14px -66px" }}>
        <path d="M14 -66 L62 -86" stroke="#ff5d8f" strokeWidth="11" strokeLinecap="round" />
        <circle cx="66" cy="-88" r="7" fill="#ffd60a" />
      </g>
      <rect x="-19" y="-76" width="38" height="46" rx="15" fill="#ff5d8f" />
      <path d="M0 -74 V-32" stroke="#ffd60a" strokeWidth="3" />
      <rect x="-14" y="-80" width="28" height="7" rx="3.5" fill="#ffd60a" />
      <Head x={0} y={-96} hat="#9d4edd" trim="#ffd60a" r={16} />
      <g className="wi-engel-sparkle" fill="#fff">
        {[
          [-90, -112],
          [92, -110],
          [0, -136],
        ].map(([x, y], i) => (
          <path key={x} d={`M${x} ${y - 10} L${x + 3} ${y} L${x} ${y + 10} L${x - 3} ${y} Z M${x - 10} ${y} L${x} ${y + 3} L${x + 10} ${y} L${x} ${y - 3} Z`} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

// ---------- Skifahrer ----------

/** A child on skis going down the hill, facing left; it glides, pushes with the poles and snow sprays. */
export function Skifahrer() {
  return (
    <>
      <g className="wi-ski-spray" fill={SNOW} stroke={SNOW_SHADE} strokeWidth="2">
        {[
          [72, -10],
          [86, -22],
          [100, -8],
        ].map(([cx, cy], i) => (
          <circle key={cx} cx={cx} cy={cy} r="8" style={nth(i)} />
        ))}
      </g>
      <g className="wi-ski-body" style={{ transformOrigin: "0px 0px" }}>
        <path d="M70 -6 H-50 Q-66 -6 -70 -18" stroke="#c1121f" strokeWidth="6" strokeLinecap="round" fill="none" />
        <g className="wi-ski-pole wi-ski-pole-back" style={{ transformOrigin: "-14px -86px" }}>
          <path d="M-22 -74 L2 -4" stroke="#495057" strokeWidth="3.5" strokeLinecap="round" />
          <ellipse cx="0" cy="-10" rx="6" ry="2.5" fill="#495057" />
          <path d="M-8 -90 L-24 -74" stroke="#e85d04" strokeWidth="10" strokeLinecap="round" />
          <circle cx="-25" cy="-72" r="6" fill="#3a86ff" />
        </g>
        <rect x="-14" y="-22" width="22" height="16" rx="5" fill="#3a86ff" />
        <path d="M-2 -20 L-18 -42 L4 -62" stroke="#1d3557" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M-10 -58 Q-26 -84 -12 -104 Q6 -110 18 -98 Q22 -76 12 -56 Z" fill="#ffb703" />
        <path d="M-12 -70 Q2 -66 14 -68" stroke="#e85d04" strokeWidth="5" fill="none" />
        <path className="wi-ski-scarf" d="M4 -104 L32 -100 L30 -90 L2 -96 Z" fill="#e63946" style={{ transformOrigin: "4px -100px" }} />
        <Head x={-12} y={-120} hat="#e63946" trim="#fff" r={16} />
        <rect x="-28" y="-138" width="30" height="9" rx="4.5" fill="#4dabf7" stroke={INK} strokeWidth="2" />
        <g className="wi-ski-pole" style={{ transformOrigin: "-4px -92px" }}>
          <path d="M-4 -92 L-34 -76" stroke="#ffb703" strokeWidth="10" strokeLinecap="round" />
          <path d="M-36 -78 L-16 -4" stroke="#6c757d" strokeWidth="3.5" strokeLinecap="round" />
          <ellipse cx="-18" cy="-10" rx="6" ry="2.5" fill="#6c757d" />
          <circle cx="-36" cy="-76" r="6" fill="#3a86ff" />
        </g>
        <path d="M76 -2 H-56 Q-72 -2 -76 -14" stroke="#e63946" strokeWidth="6" strokeLinecap="round" fill="none" />
      </g>
    </>
  );
}

// ---------- Po-Rutscher ----------

/** A child on a red sledging disc; it spins round, cheers with both arms and the snow sprays. */
export function Rutscher() {
  return (
    <>
      <g className="wi-rutscher-spray" fill={SNOW} stroke={SNOW_SHADE} strokeWidth="2">
        {[
          [62, -10],
          [74, -24],
          [-64, -14],
        ].map(([cx, cy], i) => (
          <circle key={cx} cx={cx} cy={cy} r="8" style={nth(i)} />
        ))}
      </g>
      <g className="wi-rutscher-spin" style={{ transformOrigin: "0px -30px" }}>
        <ellipse cx="0" cy="-12" rx="56" ry="16" fill="#c1121f" />
        <ellipse cx="0" cy="-16" rx="50" ry="12" fill="#e63946" />
        <path d="M-56 -14 q-8 -10 2 -14 M56 -14 q8 -10 -2 -14" stroke="#c1121f" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M-28 -22 Q-10 -26 4 -24" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.5" fill="none" />
        <path d="M-20 -28 Q-26 -66 0 -72 Q26 -66 20 -28 Z" fill="#2a9d8f" />
        <path d="M-12 -30 L-16 -10 M12 -30 L16 -10" stroke="#1d3557" strokeWidth="13" strokeLinecap="round" />
        <ellipse cx="-17" cy="-8" rx="10" ry="7" fill={INK} />
        <ellipse cx="17" cy="-8" rx="10" ry="7" fill={INK} />
        <g className="wi-rutscher-arm" style={{ transformOrigin: "-14px -62px" }}>
          <path d="M-14 -62 L-36 -92" stroke="#2a9d8f" strokeWidth="10" strokeLinecap="round" />
          <circle cx="-38" cy="-95" r="7" fill="#e63946" />
        </g>
        <g className="wi-rutscher-arm wi-rutscher-arm-r" style={{ transformOrigin: "14px -62px" }}>
          <path d="M14 -62 L36 -92" stroke="#2a9d8f" strokeWidth="10" strokeLinecap="round" />
          <circle cx="38" cy="-95" r="7" fill="#e63946" />
        </g>
        <rect x="-14" y="-74" width="28" height="7" rx="3.5" fill="#ffd60a" />
        <Head x={0} y={-90} hat="#ffd60a" trim="#e63946" r={16} />
      </g>
    </>
  );
}

// ---------- Opa ----------

/** Grandpa pushes the snow away from the house with a big snow pusher; snow flies, he puffs. */
export function Schneeopa() {
  return (
    <>
      <g className="wi-opa-heap" style={{ transformOrigin: "-96px 0px" }}>
        <path d="M-130 0 Q-124 -34 -100 -32 Q-88 -46 -72 -26 Q-64 -14 -64 0 Z" fill={SNOW} />
        <path d="M-90 -36 Q-70 -30 -64 0 H-80 Q-80 -22 -90 -36 Z" fill={SNOW_SHADE} />
      </g>
      <g className="wi-opa-snow" fill={SNOW} stroke={SNOW_SHADE} strokeWidth="2">
        {[
          [-96, -40],
          [-110, -50],
          [-84, -54],
        ].map(([cx, cy], i) => (
          <circle key={cx} cx={cx} cy={cy} r="7" style={nth(i)} />
        ))}
      </g>
      <g className="wi-opa-push" style={{ transformOrigin: "0px 0px" }}>
        <rect x="-16" y="-62" width="14" height="56" rx="6" fill="#495057" />
        <rect x="4" y="-62" width="14" height="56" rx="6" fill="#495057" />
        <rect x="-22" y="-10" width="22" height="10" rx="4" fill="#5c3a2e" />
        <rect x="2" y="-10" width="22" height="10" rx="4" fill="#5c3a2e" />
        {/* The snow pusher */}
        <path d="M-34 -120 L-74 -14" stroke="#a0522d" strokeWidth="7" strokeLinecap="round" />
        <path d="M-42 -124 L-26 -116" stroke={INK} strokeWidth="7" strokeLinecap="round" />
        <path d="M-96 -2 L-82 -44 L-62 -38 L-74 0 Z" fill="#ffb703" />
        <path d="M-82 -44 L-62 -38" stroke="#e85d04" strokeWidth="4" strokeLinecap="round" />
        <path d="M-26 -136 Q-36 -92 -32 -54 H30 Q34 -92 26 -136 Q0 -144 -26 -136 Z" fill="#2a9d8f" />
        <path d="M0 -136 V-56" stroke="#21867a" strokeWidth="3" />
        {[-120, -100, -80].map((y) => (
          <circle key={y} cx="6" cy={y} r="3" fill="#ffd166" />
        ))}
        <path d="M-14 -126 L-36 -112" stroke="#2a9d8f" strokeWidth="13" strokeLinecap="round" />
        <circle cx="-38" cy="-110" r="7.5" fill="#7f4f24" />
        <path d="M14 -124 L-50 -76" stroke="#2a9d8f" strokeWidth="13" strokeLinecap="round" />
        <circle cx="-52" cy="-74" r="7.5" fill="#7f4f24" />
        <rect x="-22" y="-142" width="44" height="10" rx="5" fill="#e63946" />
        <circle cx="0" cy="-162" r="22" fill={SKIN} />
        <Face cx={0} cy={-164} size={0.9} />
        <Lids
          eyes={[
            [-6.3, -164],
            [6.3, -164],
          ]}
          r={3.8}
          fill={SKIN}
        />
        <circle cx="-6.3" cy="-164" r="7" fill="none" stroke={INK} strokeWidth="2" />
        <circle cx="6.3" cy="-164" r="7" fill="none" stroke={INK} strokeWidth="2" />
        <path d="M-0.7 -164 h1.4" stroke={INK} strokeWidth="2" />
        <path d="M-18 -152 Q-20 -128 0 -124 Q20 -128 18 -152 Q10 -144 0 -146 Q-10 -144 -18 -152 Z" fill="#f1f3f5" />
        <path d="M-10 -150 Q0 -156 10 -150 Q0 -146 -10 -150 Z" fill="#dee2e6" />
        <g className="wi-opa-hat" style={{ transformOrigin: "0px -176px" }}>
          <path d="M-23 -170 Q-24 -198 0 -198 Q24 -198 23 -170 Z" fill="#3a86ff" />
          <rect x="-25" y="-176" width="50" height="10" rx="5" fill="#1d4ed8" />
          <circle className="wi-bobble" cx="0" cy="-202" r="8" fill="#fff" />
        </g>
        <g className="wi-opa-breath" fill="#fff">
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={-28 - i * 9} cy={-146 - i * 5} r={5 + i} style={nth(i)} />
          ))}
        </g>
      </g>
    </>
  );
}

// ---------- Mama mit Schlitten ----------

/** Mama walks to the left and pulls a little one on a wooden sledge; the little one waves. */
export function Schlittenmama() {
  return (
    <>
      <g className="wi-mama-sled" style={{ transformOrigin: "90px 0px" }}>
        <path d="M150 -4 H44 Q28 -4 28 -18" stroke="#6f4520" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M60 -4 V-26 M100 -4 V-26 M140 -4 V-26" stroke="#8d5a2b" strokeWidth="5" />
        <path d="M100 -60 Q78 -62 80 -32 H124 Q126 -58 100 -60 Z" fill="#74c0fc" />
        <path d="M84 -36 L58 -38" stroke="#74c0fc" strokeWidth="12" strokeLinecap="round" />
        <ellipse cx="54" cy="-38" rx="7" ry="6" fill={INK} />
        <g className="wi-mama-baby-arm" style={{ transformOrigin: "110px -54px" }}>
          <path d="M110 -54 L126 -78" stroke="#74c0fc" strokeWidth="9" strokeLinecap="round" />
          <circle cx="128" cy="-81" r="6" fill="#ffd60a" />
        </g>
        <path d="M90 -54 L76 -44" stroke="#74c0fc" strokeWidth="9" strokeLinecap="round" />
        <rect x="34" y="-32" width="116" height="10" rx="3" fill="#c68b59" />
        <rect x="38" y="-32" width="108" height="3" rx="1.5" fill="#e0a96d" />
        <Head x={102} y={-76} hat="#ffd60a" trim="#ff8fa3" r={14} />
      </g>
      <path className="wi-mama-rope" d="M22 -84 Q30 -40 30 -20" stroke="#a0522d" strokeWidth="2.5" fill="none" />
      <g className="wi-mama-walk" style={{ transformOrigin: "0px 0px" }}>
        <path d="M-6 -64 L-20 -6 M6 -64 L14 -6" stroke={INK} strokeWidth="12" strokeLinecap="round" />
        <rect x="-30" y="-10" width="20" height="10" rx="4" fill="#5c3a2e" />
        <rect x="6" y="-10" width="20" height="10" rx="4" fill="#5c3a2e" />
        <path d="M-12 -164 Q-36 -150 -30 -116 L-14 -120 Z" fill="#7f4f24" />
        <path d="M-24 -140 Q-34 -92 -30 -56 H28 Q32 -92 22 -140 Q0 -148 -24 -140 Z" fill="#9d4edd" />
        <path d="M0 -140 V-58" stroke="#7b2cbf" strokeWidth="3" />
        <path d="M12 -132 L22 -86" stroke="#9d4edd" strokeWidth="12" strokeLinecap="round" />
        <circle cx="22" cy="-84" r="7" fill="#e63946" />
        <g className="wi-mama-arm" style={{ transformOrigin: "-14px -132px" }}>
          <path d="M-14 -132 L-30 -92" stroke="#9d4edd" strokeWidth="12" strokeLinecap="round" />
          <circle cx="-31" cy="-88" r="7" fill="#e63946" />
        </g>
        <rect x="-20" y="-146" width="40" height="10" rx="5" fill="#ffd60a" />
        <path d="M8 -142 L16 -112 L26 -114 L18 -144 Z" fill="#ffd60a" />
        <Head x={-2} y={-164} hat="#e63946" trim="#fff" r={20} />
        <g className="wi-mama-breath" fill="#fff">
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={-30 - i * 8} cy={-152 - i * 5} r={4 + i} style={nth(i)} />
          ))}
        </g>
      </g>
    </>
  );
}
