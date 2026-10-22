import { nth } from "../shared";
import { Sparkles } from "./parts";

// The big tree at the left edge and the flower bed at the front. Foot point at (0, 0); the
// bird, the squirrel, the butterfly and the ladybird are drawn in the same coordinates.

// Leaf blobs of the crown: [cx, cy, r, colour].
const CROWN = [
  [-70, -250, 92, "#40916c"],
  [70, -258, 96, "#40916c"],
  [0, -330, 104, "#52b788"],
  [-96, -320, 70, "#52b788"],
  [96, -330, 72, "#52b788"],
  [0, -220, 84, "#52b788"],
  [-30, -380, 60, "#74c69d"],
  [40, -360, 50, "#74c69d"],
] as const;

const APPLES = [
  [-80, -270],
  [40, -300],
  [100, -250],
  [-20, -230],
  [-110, -330],
  [60, -380],
];

/** The big apple tree: its crown rustles, the apples bob and a few leaves fall. */
export function Baum() {
  return (
    <>
      <path d="M-26 0 Q-18 -100 -22 -190 H22 Q18 -100 26 0 Z" fill="#8d5a2b" />
      <path d="M-26 0 Q-30 -6 -44 -2 M26 0 Q30 -6 44 -2" stroke="#8d5a2b" strokeWidth="10" strokeLinecap="round" />
      <path d="M-8 -20 Q-4 -90 -8 -170" stroke="#a47148" strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* The branch the bird sits on */}
      <path d="M14 -176 Q80 -196 170 -196" stroke="#8d5a2b" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M130 -196 q16 -16 30 -14" stroke="#40916c" strokeWidth="8" strokeLinecap="round" fill="none" />
      <g className="sp-baum-crown" style={{ transformOrigin: "0px -190px" }}>
        {CROWN.map(([cx, cy, r, colour], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill={colour} />
        ))}
        <circle cx="-50" cy="-380" r="22" fill="#95d5b2" opacity="0.6" />
        {APPLES.map(([cx, cy], i) => (
          <g key={i} className="sp-baum-apple" style={{ transformOrigin: `${cx}px ${cy - 12}px`, ...nth(i) }}>
            <path d={`M${cx} ${cy - 12} v-6`} stroke="#6b4423" strokeWidth="3" strokeLinecap="round" />
            <circle cx={cx} cy={cy} r="12" fill="#e63946" />
            <circle cx={cx - 4} cy={cy - 4} r="3.5" fill="#fff" opacity="0.6" />
          </g>
        ))}
      </g>
      <g className="sp-baum-leaves" fill="#52b788">
        {[
          [-60, -200],
          [40, -190],
          [110, -220],
        ].map(([x, y], i) => (
          <path key={i} d={`M${x - 10} ${y} Q${x} ${y - 8} ${x + 10} ${y} Q${x} ${y + 8} ${x - 10} ${y} Z`} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

// Flowers in the bed: [x, height, colour].
const FLOWERS = [
  [-110, 70, "#ff6b9a"],
  [-60, 96, "#ffd43b"],
  [-6, 80, "#9775fa"],
  [50, 104, "#ff922b"],
  [104, 74, "#4dabf7"],
] as const;

/** The flower bed: the flowers nod, their petals open wide and sparkles shine. */
export function Blumen() {
  return (
    <>
      <ellipse cx="0" cy="0" rx="150" ry="22" fill="#8d5a2b" />
      <ellipse cx="0" cy="-4" rx="140" ry="16" fill="#a0673a" />
      {/* The big leaf the ladybird sits on */}
      <path d="M120 -6 Q160 -40 196 -36 Q176 -4 120 -6 Z" fill="#40916c" />
      <path d="M124 -8 Q160 -26 190 -34" stroke="#2d6a4f" strokeWidth="2.5" fill="none" />
      {FLOWERS.map(([x, h, colour], i) => (
        <g key={x} className="sp-blume" style={{ transformOrigin: `${x}px -6px`, ...nth(i) }}>
          <path d={`M${x} -6 V${-h}`} stroke="#40916c" strokeWidth="6" strokeLinecap="round" />
          <path d={`M${x} ${-h * 0.45} q${i % 2 ? 18 : -18} -14 ${i % 2 ? 26 : -26} -4 q${i % 2 ? -10 : 10} 10 ${i % 2 ? -26 : 26} 4 Z`} fill="#52b788" />
          <g className="sp-blume-petals" style={{ transformOrigin: `${x}px ${-h}px` }}>
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <ellipse key={a} cx={x} cy={-h - 14} rx="9" ry="14" fill={colour} transform={`rotate(${a} ${x} ${-h})`} />
            ))}
          </g>
          <circle cx={x} cy={-h} r="9" fill="#fff3bf" />
          <circle cx={x - 3} cy={-h - 3} r="3" fill="#fff" opacity="0.7" />
        </g>
      ))}
      <Sparkles className="sp-blumen-sparkle" spots={[[-110, -110], [50, -146], [104, -110], [-60, -136]]} r={10} fill="#fff9db" />
    </>
  );
}
