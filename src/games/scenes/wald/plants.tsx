import { nth } from "../shared";

// Mushroom, berry bush and fern at the front. Foot point at (0, 0).

const DOTS = [
  [-30, -78, 6],
  [-8, -92, 5],
  [18, -86, 7],
  [36, -70, 5],
  [-40, -62, 4],
  [4, -70, 4],
] as const;

/** Big red fly agaric with white dots; its cap boings up and down, the dots pop and spores puff out. */
export function Fliegenpilz() {
  return (
    <>
      <path d="M-14 0 Q-18 -30 -12 -56 H12 Q18 -30 14 0 Z" fill="#f8f1e5" />
      <path d="M-6 -6 q-3 -20 0 -44" stroke="#e9dcc9" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M-18 -44 Q0 -36 18 -44 L16 -36 Q0 -30 -16 -36 Z" fill="#fff" />
      <g className="wd-pilz-spores" fill="#fff">
        {[-40, 0, 40].map((cx, i) => (
          <circle key={cx} cx={cx} cy={-60} r="5" style={nth(i)} />
        ))}
      </g>
      <g className="wd-pilz-cap" style={{ transformOrigin: "0px -54px" }}>
        <path d="M-52 -52 Q-52 -104 0 -106 Q52 -104 52 -52 Q0 -60 -52 -52 Z" fill="#e63946" />
        <path d="M-52 -52 Q0 -60 52 -52 Q46 -46 0 -48 Q-46 -46 -52 -52 Z" fill="#f8f1e5" />
        <ellipse cx="-22" cy="-92" rx="14" ry="6" fill="#fff" opacity="0.35" />
        {DOTS.map(([cx, cy, r], i) => (
          <circle key={cx} className="wd-pilz-dot" cx={cx} cy={cy} r={r} fill="#fff" style={nth(i)} />
        ))}
      </g>
    </>
  );
}

const LEAVES = [
  [-60, -60, 42],
  [0, -90, 50],
  [62, -62, 40],
  [-30, -40, 40],
  [34, -36, 42],
] as const;

const BLUEBERRIES = [
  [-72, -70],
  [-48, -96],
  [-20, -110],
  [10, -78],
  [40, -102],
  [70, -74],
  [-40, -46],
  [24, -48],
  [56, -40],
];

const RASPBERRIES = [
  [-12, -52],
  [-66, -40],
  [80, -54],
];

/** Berry bush with blueberries and raspberries; it rustles, the berries hop, its leaves flick and one berry rolls away. */
export function Beerenstrauch() {
  return (
    <>
      <g className="wd-beeren-bush" style={{ transformOrigin: "0px 0px" }}>
        {LEAVES.map(([cx, cy, r], i) => (
          <circle key={cx} cx={cx} cy={cy} r={r} fill={i % 2 ? "#2d6a4f" : "#40916c"} />
        ))}
        <circle cx="-20" cy="-110" r="18" fill="#52b788" opacity="0.6" />
        <path d="M-90 -20 q-10 -10 -4 -24 q10 8 4 24 M92 -24 q12 -8 6 -24 q-10 6 -6 24" fill="#40916c" />
      </g>
      <path className="wd-beeren-leaf" d="M-60 -100 q-20 -14 -32 -4 q14 12 32 4 Z" fill="#52b788" style={{ transformOrigin: "-60px -100px" }} />
      <path className="wd-beeren-leaf wd-leaf-right" d="M64 -98 q20 -14 32 -4 q-14 12 -32 4 Z" fill="#52b788" style={{ transformOrigin: "64px -98px" }} />
      {BLUEBERRIES.map(([cx, cy], i) => (
        <g key={`${cx}-${cy}`} className="wd-beere" style={nth(i % 4)}>
          <circle cx={cx} cy={cy} r="8" fill="#3a0ca3" />
          <circle cx={cx - 2.5} cy={cy - 2.5} r="2.4" fill="#fff" opacity="0.5" />
          <path d={`M${cx - 2} ${cy + 6} h4`} stroke="#240046" strokeWidth="1.6" />
        </g>
      ))}
      {RASPBERRIES.map(([cx, cy], i) => (
        <g key={cx} className="wd-beere" style={nth(i + 1)}>
          <circle cx={cx} cy={cy} r="9" fill="#e5383b" />
          {[
            [-3, -3],
            [3, -3],
            [0, 2],
            [-4, 3],
            [4, 3],
          ].map(([dx, dy]) => (
            <circle key={`${dx}-${dy}`} cx={cx + dx} cy={cy + dy} r="2.2" fill="#ba181b" />
          ))}
        </g>
      ))}
      <g className="wd-beeren-roll">
        <circle cx="74" cy="-74" r="8" fill="#3a0ca3" />
        <circle cx="71.5" cy="-76.5" r="2.4" fill="#fff" opacity="0.5" />
      </g>
    </>
  );
}

/** A point on the quadratic curve from (0, 0) via (cx, cy) to (tx, ty). */
function onCurve(t: number, cx: number, cy: number, tx: number, ty: number) {
  const u = 1 - t;
  return [2 * u * t * cx + t * t * tx, 2 * u * t * cy + t * t * ty];
}

// Fronds of the fern: control point and tip.
const FRONDS = [
  [-50, -40, -110, -60],
  [-40, -110, -60, -150],
  [10, -120, 6, -160],
  [50, -100, 74, -128],
  [60, -40, 110, -56],
] as const;

/** Fern with five fronds and a curled fiddlehead; the fronds sway one after the other and the fiddlehead unrolls. */
export function Farn() {
  return (
    <>
      {FRONDS.map(([cx, cy, tx, ty], i) => {
        const leaflets = Array.from({ length: 8 }, (_, j) => {
          const t = 0.2 + j * 0.1;
          const [x, y] = onCurve(t, cx, cy, tx, ty);
          const [x2, y2] = onCurve(t + 0.02, cx, cy, tx, ty);
          const angle = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;
          const size = 16 * (1.1 - t);
          return (
            <g key={j} transform={`translate(${x} ${y}) rotate(${angle})`}>
              <ellipse cx="0" cy={-size * 0.8} rx={size * 0.35} ry={size} fill="#52b788" transform="rotate(30)" />
              <ellipse cx="0" cy={size * 0.8} rx={size * 0.35} ry={size} fill="#40916c" transform="rotate(-30)" />
            </g>
          );
        });
        return (
          <g key={tx} className="wd-farn-frond" style={{ transformOrigin: "0px 0px", ...nth(i) }}>
            <path d={`M0 0 Q${cx} ${cy} ${tx} ${ty}`} stroke="#2d6a4f" strokeWidth="4" strokeLinecap="round" fill="none" />
            {leaflets}
          </g>
        );
      })}
      <g className="wd-farn-curl" style={{ transformOrigin: "-16px -40px" }}>
        <path d="M-6 0 Q-14 -30 -16 -50 Q-18 -64 -8 -66 Q0 -64 -4 -56 Q-8 -52 -10 -58" stroke="#74c69d" strokeWidth="5" strokeLinecap="round" fill="none" />
      </g>
    </>
  );
}
