import { nth, sparklePath } from "../shared";
import { Cheek, Puff, leafPath } from "./parts";

// Plants of the valley: the big tree, the palm fern, the fern, the horsetail, the flower
// and the mushrooms. Each drawing has its foot point at (0, 0).

// ---------- Baum ----------

// Leaf clusters of the crown: [x, y, r].
const CROWN: [number, number, number][] = [
  [-100, -446, 78],
  [100, -448, 80],
  [0, -496, 118],
  [-66, -560, 72],
  [72, -566, 70],
  [0, -598, 54],
];

/** A tall leafy tree; its crown rustles, fruits bounce and leaves float down. */
export function Baum() {
  return (
    <>
      <path d="M-24 0 Q-14 -200 -18 -420 H18 Q12 -200 26 0 Z" fill="#9c6b4e" />
      <path d="M-40 0 Q-30 -20 -20 -30 M40 0 Q30 -20 22 -30" stroke="#9c6b4e" strokeWidth="14" strokeLinecap="round" />
      <path d="M-6 -60 Q-10 -120 -4 -180 M6 -240 Q2 -300 8 -360" stroke="#7f5539" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M10 -330 Q60 -334 146 -346" stroke="#8b5a3c" strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d={leafPath(146, -346, 14, 30)} transform="rotate(70 146 -346)" fill="#5fae6b" />
      <g className="dt-baum-crown" style={{ transformOrigin: "0px -400px" }}>
        {CROWN.map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y + 10} r={r} fill="#4e9a5c" />
        ))}
        {CROWN.map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#5fae6b" />
        ))}
        {CROWN.map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x - r * 0.3} cy={y - r * 0.35} r={r * 0.4} fill="#7cc47f" />
        ))}
        {[
          [-40, -470],
          [60, -520],
          [-110, -440],
          [110, -430],
          [0, -580],
        ].map(([x, y], i) => (
          <g key={i} className="dt-baum-fruit" style={nth(i)}>
            <circle cx={x} cy={y} r="11" fill="#ff8c42" />
            <circle cx={x - 3} cy={y - 4} r="3.5" fill="#fff" opacity="0.5" />
          </g>
        ))}
      </g>
      <g className="dt-baum-fall" fill="#7cc47f">
        {[
          [-120, -400],
          [40, -390],
          [150, -420],
        ].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="12" ry="7" style={nth(i)} />
        ))}
      </g>
    </>
  );
}

// ---------- Palmfarn ----------

// Fronds of the palm fern: [angle from straight up, length].
const FRONDS: [number, number][] = [
  [-75, 120],
  [-45, 130],
  [-15, 120],
  [15, 124],
  [45, 130],
  [75, 118],
];

/** A palm fern with a short stout trunk; its fronds swing out one after the other and the cone in the middle bounces. */
export function Palmfarn() {
  return (
    <>
      <path d="M-26 0 Q-32 -60 -20 -108 H20 Q32 -60 26 0 Z" fill="#b08968" />
      <path d="M-24 -20 L24 -44 M-28 -50 L26 -74 M-22 -80 L20 -100 M-26 -36 L20 -12 M-28 -70 L26 -46 M-20 -98 L22 -78" stroke="#8d6e63" strokeWidth="3" />
      {FRONDS.map(([a, len], i) => (
        <g key={a} transform={`rotate(${a} 0 -108)`}>
          <g className="dt-palm-frond" style={{ ...nth(i), transformOrigin: "0px -108px" }}>
            <path
              d={`M0 -108 Q${len * 0.1} ${-108 - len * 0.6} ${len * 0.3} ${-108 - len}`}
              stroke="#4f9d5d"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            {Array.from({ length: 6 }, (_, k) => {
              const t = (k + 1) / 7;
              const x = len * (0.2 * t * (1 - t) + 0.3 * t * t);
              const y = -108 - len * (1.2 * t * (1 - t) + t * t);
              return (
                <g key={k}>
                  <ellipse cx={x - 14} cy={y + 4} rx="16" ry="6" transform={`rotate(-30 ${x - 14} ${y + 4})`} fill={k % 2 ? "#6bb26f" : "#5fae6b"} />
                  <ellipse cx={x + 14} cy={y + 4} rx="16" ry="6" transform={`rotate(30 ${x + 14} ${y + 4})`} fill={k % 2 ? "#5fae6b" : "#6bb26f"} />
                </g>
              );
            })}
          </g>
        </g>
      ))}
      <g className="dt-palm-cone" style={{ transformOrigin: "0px -106px" }}>
        <ellipse cx="0" cy="-122" rx="16" ry="20" fill="#e9a35b" />
        <path d="M-10 -130 l10 6 l10 -6 M-12 -116 l12 6 l12 -6" stroke="#c97c3a" strokeWidth="2.5" fill="none" />
      </g>
    </>
  );
}

// ---------- Farn ----------

/** One fern frond along a gentle curve from (0, 0) to (ex, ey) through (qx, qy), with leaflets on both sides. */
function Frond({ qx, qy, ex, ey, n = 8 }: { qx: number; qy: number; ex: number; ey: number; n?: number }) {
  return (
    <>
      <path d={`M0 0 Q${qx} ${qy} ${ex} ${ey}`} stroke="#3f8f4f" strokeWidth="6" strokeLinecap="round" fill="none" />
      {Array.from({ length: n }, (_, k) => {
        const t = (k + 1.5) / (n + 1);
        const x = 2 * t * (1 - t) * qx + t * t * ex;
        const y = 2 * t * (1 - t) * qy + t * t * ey;
        const dx = 2 * (1 - t) * qx + 2 * t * (ex - qx);
        const dy = 2 * (1 - t) * qy + 2 * t * (ey - qy);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        const size = 20 * (1 - t * 0.6);
        return (
          <g key={k} transform={`translate(${x} ${y}) rotate(${angle})`}>
            <ellipse cx={size * 0.3} cy={-size * 0.7} rx={size * 0.4} ry={size * 0.8} transform={`rotate(30 ${size * 0.3} ${-size * 0.7})`} fill="#5fae6b" />
            <ellipse cx={size * 0.3} cy={size * 0.7} rx={size * 0.4} ry={size * 0.8} transform={`rotate(-30 ${size * 0.3} ${size * 0.7})`} fill="#6fbf72" />
          </g>
        );
      })}
    </>
  );
}

const FERN: [number, number, number, number][] = [
  [-60, -30, -126, -20],
  [-50, -110, -104, -150],
  [-10, -130, -30, -206],
  [30, -130, 50, -200],
  [70, -100, 112, -140],
];

/** A big fern in front; its fronds sway one after the other and a curled young frond unrolls. */
export function Farn() {
  return (
    <>
      {FERN.map(([qx, qy, ex, ey], i) => (
        <g key={i} className="dt-farn-frond" style={{ ...nth(i), transformOrigin: "0px 0px" }}>
          <Frond qx={qx} qy={qy} ex={ex} ey={ey} />
        </g>
      ))}
      <g className="dt-farn-curl" style={{ transformOrigin: "90px -60px" }}>
        <path d="M10 0 Q60 -20 90 -60 Q104 -84 88 -92 Q74 -94 76 -80 Q80 -72 88 -76" stroke="#4f9d5d" strokeWidth="7" strokeLinecap="round" fill="none" />
      </g>
    </>
  );
}

// ---------- Schachtelhalm ----------

// Stems: [x offset at the top, height].
const STEMS: [number, number][] = [
  [-26, 180],
  [4, 216],
  [30, 160],
];

/** Horsetails: three jointed stems with whorls of needles; they spring back and forth like springs. */
export function Schachtelhalm() {
  return (
    <>
      {STEMS.map(([dx, h], i) => (
        <g key={dx} className="dt-halm-stem" style={{ ...nth(i), transformOrigin: `${dx * 0.3}px 0px` }}>
          <path d={`M${dx * 0.3} 0 L${dx} ${-h}`} stroke="#76b852" strokeWidth="9" strokeLinecap="round" />
          {Array.from({ length: Math.floor(h / 36) }, (_, k) => {
            const t = (k + 1) / (h / 36 + 0.5);
            const x = dx * 0.3 + (dx - dx * 0.3) * t;
            const y = -h * t;
            return (
              <g key={k}>
                <path d={`M${x - 6} ${y} h12`} stroke="#4f7d3a" strokeWidth="4" strokeLinecap="round" />
                <path d={`M${x} ${y} l-22 12 M${x} ${y} l22 12 M${x} ${y} l-14 16 M${x} ${y} l14 16`} stroke="#8fcf6a" strokeWidth="3" strokeLinecap="round" />
              </g>
            );
          })}
          <ellipse cx={dx} cy={-h - 8} rx="6" ry="11" fill="#c2a15f" />
        </g>
      ))}
    </>
  );
}

// ---------- Blume ----------

/** A big pink flower (a magnolia): its petals open wide, little sparkles of pollen fly. */
export function Blume() {
  return (
    <>
      <path d="M0 0 Q-6 -60 0 -110" stroke="#4f9d5d" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d={leafPath(-2, -40, 20, 46)} transform="rotate(-60 -2 -40)" fill="#5fae6b" />
      <path d={leafPath(0, -64, 18, 40)} transform="rotate(55 0 -64)" fill="#6fbf72" />
      <g transform="translate(0 -110)">
        {[-60, -30, 30, 60].map((a, i) => (
          <g key={a} transform={`rotate(${a})`}>
            <path
              className="dt-blume-petal"
              d={leafPath(0, 0, 14, 40)}
              fill={i % 3 ? "#ffafcc" : "#ffc8dd"}
              style={{ ...nth(i), transformOrigin: "0px 0px" }}
            />
          </g>
        ))}
        <path d={leafPath(0, 0, 16, 44)} fill="#ffd6e6" />
        <circle cx="0" cy="-10" r="7" fill="#ffd166" />
      </g>
      <g className="dt-blume-pollen" fill="#ffd166">
        {[0, 1, 2].map((i) => (
          <path key={i} d={sparklePath(-30 + i * 30, -170 + (i % 2) * 14, 7)} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

// ---------- Pilze ----------

const MUSHROOMS: [number, number, number, string][] = [
  [-34, 0, 1, "#e9a35b"],
  [10, 4, 1.25, "#d98b4c"],
  [44, 2, 0.8, "#f4c27a"],
];

/** Three mushrooms in a row; they hop one after the other and puff little clouds of spores. */
export function Pilze() {
  return (
    <>
      {MUSHROOMS.map(([x, y, s, cap], i) => (
        <g key={x} className="dt-pilz" style={nth(i)}>
          <rect x={x - 8 * s} y={y - 36 * s} width={16 * s} height={36 * s} rx={7 * s} fill="#fff3e0" />
          <path d={`M${x - 28 * s} ${y - 32 * s} Q${x} ${y - 76 * s} ${x + 28 * s} ${y - 32 * s} Z`} fill={cap} />
          <circle cx={x - 8 * s} cy={y - 48 * s} r={4 * s} fill="#fff" opacity="0.8" />
          <circle cx={x + 10 * s} cy={y - 42 * s} r={3 * s} fill="#fff" opacity="0.8" />
          <circle cx={x - 4 * s} cy={y - 22 * s} r={1.8 * s} fill="#2b2d42" />
          <circle cx={x + 4 * s} cy={y - 22 * s} r={1.8 * s} fill="#2b2d42" />
          <Cheek cx={x} cy={y - 16 * s} r={3 * s} />
        </g>
      ))}
      <g className="dt-pilz-spores">
        {[0, 1, 2].map((i) => (
          <Puff key={i} x={-34 + i * 40} y={-80} r={9} fill="#fff6e0" className="dt-pilz-spore" i={i} />
        ))}
      </g>
    </>
  );
}
