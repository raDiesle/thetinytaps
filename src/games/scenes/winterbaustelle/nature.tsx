import { Lids } from "../baustelle/figures";
import { CHEEK, Cloud, Eye, Face, INK, nth } from "../shared";
import { Cap, Flake, SNOW, SNOW_SHADE, glint, vars } from "./parts";

// Trees, clouds and animals of the winter site. Drawings stand with their foot point on (0, 0),
// except the snow cloud, which uses the coordinates of the rain cloud in ../sky.

/** A cloud with a sleepy smile that lets snowflakes fall. */
export function Schneewolke() {
  return (
    <>
      <g className="wb-wolke-flakes">
        {[
          [180, 204],
          [208, 216],
          [238, 202],
          [268, 218],
          [298, 204],
          [222, 238],
          [284, 240],
        ].map(([x, y], i) => (
          <g key={i} style={nth(i)}>
            <Flake x={x} y={y} r={7} />
          </g>
        ))}
      </g>
      <g className="wb-wolke-body" style={{ transformOrigin: "240px 190px" }}>
        <Cloud x={190} y={150} />
        <Face cx={236} cy={146} size={1.1} />
        <Lids
          eyes={[
            [228.3, 146],
            [243.7, 146],
          ]}
          r={4.4}
          fill="#fff"
        />
      </g>
    </>
  );
}

/** One tier of the fir with the snow lying on its lower edge. */
function Tier({ w, top, bottom }: { w: number; top: number; bottom: number }) {
  return (
    <>
      <path d={`M${-w} ${bottom} L0 ${top} L${w} ${bottom} Z`} fill="#2d6a4f" />
      <path d={`M0 ${top} L${w} ${bottom} H0 Z`} fill="#1b4332" opacity="0.35" />
      <path
        d={`M${-w} ${bottom} Q${-w * 0.66} ${bottom - 13} ${-w * 0.33} ${bottom - 5} Q0 ${bottom - 15} ${w * 0.33} ${bottom - 5} Q${w * 0.66} ${bottom - 13} ${w} ${bottom} Q${w * 0.5} ${bottom + 7} 0 ${bottom + 2} Q${-w * 0.5} ${bottom + 7} ${-w} ${bottom} Z`}
        fill={SNOW}
      />
      <path d={`M${-w * 0.5} ${bottom - 2} Q0 ${bottom - 8} ${w * 0.5} ${bottom - 2}`} stroke={SNOW_SHADE} strokeWidth="3" fill="none" />
    </>
  );
}

// Lumps of snow on the branch tips that fall off when the tree shakes: [x, y, fall distance].
const LUMPS = [
  [-80, -38, "36px"],
  [62, -108, "106px"],
  [-42, -176, "172px"],
] as const;

/** A big fir covered in snow; it shakes and the snow drops off its branches. */
export function Schneetanne() {
  return (
    <>
      <rect x="-10" y="-38" width="20" height="38" rx="3" fill="#8d5a2b" />
      <rect x="2" y="-38" width="8" height="38" fill="#6f4520" />
      <g className="wb-tanne-crown" style={{ transformOrigin: "0px 0px" }}>
        <Tier w={92} top={-140} bottom={-32} />
        <Tier w={74} top={-200} bottom={-100} />
        <Tier w={54} top={-256} bottom={-168} />
        <path d="M-20 -226 L0 -258 L20 -226 Q10 -218 4 -224 Q-4 -216 -10 -224 Q-15 -218 -20 -226 Z" fill={SNOW} />
        <g fill={SNOW}>
          <ellipse cx="-36" cy="-112" rx="12" ry="5" />
          <ellipse cx="30" cy="-64" rx="14" ry="5" />
          <ellipse cx="-24" cy="-180" rx="10" ry="4" />
        </g>
        {LUMPS.map(([x, y, d], i) => (
          <ellipse key={x} className="wb-tanne-lump" cx={x} cy={y} rx="13" ry="7" fill={SNOW} style={vars(i, { "--d": d })} />
        ))}
      </g>
      <g className="wb-tanne-puff" fill={SNOW}>
        {LUMPS.map(([x], i) => (
          <circle key={x} cx={x} cy="-6" r="12" style={nth(i)} />
        ))}
      </g>
    </>
  );
}

const FOX = "#e8743b";

/** A red fox in deep snow, facing left; it pounces head first into the snow like after a mouse. */
export function Winterfuchs() {
  return (
    <>
      <g className="wb-fuchs-snow" fill={SNOW} stroke={SNOW_SHADE} strokeWidth="2">
        {[
          [-176, -12],
          [-156, -26],
          [-192, -30],
          [-140, -10],
        ].map(([cx, cy], i) => (
          <circle key={cx} cx={cx} cy={cy} r="11" style={nth(i)} />
        ))}
      </g>
      <g className="wb-fuchs-jump" style={{ transformOrigin: "0px -50px" }}>
        <g className="wb-fuchs-tail" style={{ transformOrigin: "46px -52px" }}>
          <path d="M44 -58 Q96 -92 112 -50 Q114 -22 88 -30 Q72 -48 44 -46 Z" fill={FOX} />
          <path d="M98 -42 Q112 -42 112 -50 Q114 -22 88 -30 Q96 -32 98 -42 Z" fill="#fff" />
        </g>
        <rect x="26" y="-42" width="11" height="40" rx="5" fill="#a64d24" />
        <rect x="-46" y="-42" width="11" height="40" rx="5" fill="#a64d24" />
        <ellipse cx="0" cy="-54" rx="52" ry="24" fill={FOX} />
        <path d="M-40 -46 Q-10 -30 30 -40 Q0 -34 -40 -46 Z" fill="#fff" />
        <path d="M-6 -76 Q8 -80 22 -74" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.6" fill="none" />
        <rect x="-34" y="-40" width="11" height="40" rx="5" fill="#2b2d42" />
        <rect x="38" y="-40" width="11" height="40" rx="5" fill="#2b2d42" />
        <g className="wb-fuchs-head" style={{ transformOrigin: "-40px -68px" }}>
          <g className="wb-fuchs-ear" style={{ transformOrigin: "-56px -98px" }}>
            <path d="M-66 -96 L-70 -126 L-50 -104 Z" fill={FOX} />
            <path d="M-66 -104 L-69 -124 L-60 -114 Z" fill="#2b2d42" />
            <path d="M-44 -104 L-30 -126 L-30 -96 Z" fill={FOX} />
            <path d="M-38 -112 L-30 -124 L-31 -110 Z" fill="#2b2d42" />
          </g>
          <path d="M-26 -96 Q-30 -66 -60 -62 Q-84 -66 -100 -80 Q-80 -86 -70 -98 Q-50 -110 -26 -96 Z" fill={FOX} />
          <path d="M-40 -66 Q-60 -60 -84 -72 Q-62 -70 -48 -80 Z" fill="#fff" />
          <circle cx="-100" cy="-80" r="5" fill="#2b2d42" />
          <circle cx="-68" cy="-74" r="4" fill={CHEEK} opacity="0.5" />
          <Eye cx={-62} cy={-88} r={3.6} />
          <Lids eyes={[[-62, -88]]} r={4.6} fill={FOX} />
        </g>
      </g>
      {/* Deep snow in front of the paws */}
      <path d="M-104 0 Q-90 -18 -66 -10 Q-44 -22 -18 -8 Q14 -20 40 -8 Q62 -18 80 0 Z" fill={SNOW} />
      <path d="M-80 -4 Q-56 -12 -30 -4 M10 -6 Q34 -14 56 -4" stroke={SNOW_SHADE} strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  );
}

const ROBIN = "#8d6e53";

/** A robin with an orange breast, hopping in the snow. */
export function Rotkehlchen() {
  return (
    <>
      <g className="wb-robin-notes" fill={INK}>
        {[0, 1].map((i) => (
          <g key={i} style={nth(i)}>
            <circle cx={-30 + i * 14} cy="-62" r="3.5" />
            <path d={`M${-27 + i * 14} -62 V-76 l6 3`} stroke={INK} strokeWidth="2" fill="none" />
          </g>
        ))}
      </g>
      <g className="wb-robin-hop">
        <path d="M-4 -1 V-12 M6 -1 V-12" stroke="#b5651d" strokeWidth="2.5" strokeLinecap="round" />
        <path className="wb-robin-tail" d="M16 -24 L38 -32 L34 -18 Z" fill="#6f523b" style={{ transformOrigin: "16px -22px" }} />
        <ellipse cx="2" cy="-24" rx="20" ry="15" fill={ROBIN} />
        <path d="M-16 -32 Q-22 -14 -4 -11 Q6 -22 -2 -36 Q-10 -40 -16 -32 Z" fill="#ff6b35" />
        <ellipse cx="6" cy="-13" rx="10" ry="4.5" fill="#f1e3d3" />
        <ellipse className="wb-robin-wing" cx="9" cy="-26" rx="12" ry="7" fill="#6f523b" style={{ transformOrigin: "2px -28px" }} />
        <g className="wb-robin-head" style={{ transformOrigin: "-8px -34px" }}>
          <circle cx="-11" cy="-40" r="11" fill={ROBIN} />
          <path d="M-22 -40 Q-22 -30 -12 -29 Q-6 -36 -12 -44 Q-18 -46 -22 -40 Z" fill="#ff6b35" />
          <path d="M-21 -43 L-30 -41 L-21 -38 Z" fill={INK} />
          <Eye cx={-14} cy={-44} r={2.4} />
          <Lids eyes={[[-14, -44]]} r={3.2} fill={ROBIN} />
        </g>
      </g>
    </>
  );
}

// Seeds on the bird table: [x, colour].
const SEEDS = [
  [-32, "#a0522d"],
  [-20, "#e9c46a"],
  [-8, "#6f4520"],
  [6, "#e9c46a"],
  [18, "#a0522d"],
  [30, "#6f4520"],
] as const;

/** A bird table on a pole with seeds and a fat ball; the blue tit (Meise) sits on its edge. */
export function Vogelhaus() {
  return (
    <>
      <path d="M-34 0 Q0 -16 34 0 Z" fill={SNOW} />
      <rect x="-5" y="-152" width="10" height="150" rx="2" fill="#8d5a2b" />
      <rect x="1" y="-152" width="4" height="150" fill="#6f4520" />
      <g className="wb-vh-house" style={{ transformOrigin: "0px -152px" }}>
        <rect x="-44" y="-196" width="88" height="40" fill="#6f4520" opacity="0.55" />
        <rect x="-46" y="-196" width="6" height="42" fill="#8d5a2b" />
        <rect x="40" y="-196" width="6" height="42" fill="#8d5a2b" />
        <g className="wb-vh-seeds">
          {SEEDS.map(([x, colour], i) => (
            <ellipse key={x} cx={x} cy="-160" rx="4" ry="3" fill={colour} style={nth(i)} />
          ))}
        </g>
        <rect x="-56" y="-158" width="132" height="8" rx="2" fill="#a0522d" />
        <path d="M-66 -190 L0 -228 L66 -190 Z" fill="#bc4749" />
        <path d="M-66 -190 L0 -228 L66 -190 L60 -186 L0 -220 L-60 -186 Z" fill="#9b2c2c" />
        <path d="M-70 -188 Q-70 -196 -60 -198 L0 -234 L60 -198 Q70 -196 70 -188 Q62 -184 54 -190 L0 -222 L-54 -190 Q-62 -184 -70 -188 Z" fill={SNOW} />
        <Cap x={-56} y={-150} w={18} h={5} />
        <g className="wb-vh-ball" style={{ transformOrigin: "-58px -190px" }}>
          <path d="M-58 -190 L-62 -152" stroke={INK} strokeWidth="1.5" />
          <circle cx="-62" cy="-143" r="10" fill="#e9c46a" />
          <path d="M-70 -147 L-54 -139 M-70 -139 L-54 -147 M-62 -153 V-133" stroke="#2a9d8f" strokeWidth="1.5" />
        </g>
      </g>
      <g className="wb-vh-flakes">
        {[-40, 0, 40].map((x, i) => (
          <g key={x} style={nth(i)}>
            <Flake x={x} y={-236} r={5} colour="#bcd4ec" />
          </g>
        ))}
      </g>
    </>
  );
}

/** The blue tit on the bird table, drawn in the bird table's coordinates. */
export function Meise() {
  return (
    <>
      <g className="wb-meise-glints" fill="#fff">
        {[
          [44, -214],
          [92, -204],
        ].map(([x, y], i) => (
          <path key={x} d={glint(x, y, 7)} style={nth(i)} />
        ))}
      </g>
      <g className="wb-meise-body" style={{ transformOrigin: "62px -158px" }}>
        <path className="wb-meise-tail" d="M74 -170 L94 -160 L88 -154 Z" fill="#3a86ff" style={{ transformOrigin: "74px -166px" }} />
        <path d="M60 -158 V-153 M68 -158 V-153" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="64" cy="-170" rx="15" ry="12" fill="#ffd60a" />
        <ellipse className="wb-meise-wing" cx="72" cy="-172" rx="11" ry="7" fill="#3a86ff" style={{ transformOrigin: "64px -174px" }} />
        <g className="wb-meise-head" style={{ transformOrigin: "58px -178px" }}>
          <circle cx="53" cy="-185" r="10" fill="#fff" />
          <path d="M43 -187 Q44 -197 53 -196 Q62 -197 63 -187 Z" fill="#3a86ff" />
          <path d="M44 -184 H62" stroke="#1d3557" strokeWidth="2.2" />
          <path d="M50 -178 Q53 -174 56 -178 Z" fill="#1d3557" />
          <path d="M44 -183 L38 -182 L44 -180 Z" fill={INK} />
          <Eye cx={49} cy={-185} r={2} />
          <Lids eyes={[[49, -185]]} r={2.8} fill="#fff" />
        </g>
      </g>
    </>
  );
}
