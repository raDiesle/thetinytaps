import { BALL_R, type Pt } from "./path";

/** The xylophone's colours, low to high; the machines use them for bright bits too. */
export const BAR_COLORS = ["#ff5d73", "#ff8c42", "#ffb703", "#3ec300", "#00b4d8", "#3a86ff", "#8e7dff", "#ff7bd0"];
const INK = "#2a1e5c";

/** A wooden rail just under the marbles' path from `a` to `b`, with a peg at each end. */
export function Rail({ a, b }: { a: Pt; b: Pt }) {
  const off = BALL_R + 7;
  return (
    <g>
      <line x1={a.x} y1={a.y + off} x2={b.x} y2={b.y + off} stroke={INK} strokeWidth="18" strokeLinecap="round" />
      <line x1={a.x} y1={a.y + off} x2={b.x} y2={b.y + off} stroke="#d08c4b" strokeWidth="12" strokeLinecap="round" />
      <circle cx={a.x + 14} cy={a.y + off + 1} r="3" fill="#8a5a2b" />
      <circle cx={b.x - 14} cy={b.y + off + 1} r="3" fill="#8a5a2b" />
    </g>
  );
}

/** A marble with a shine and a stripe that turns by `spin` radians as it rolls. */
export function Ball({ color, x, y, spin }: { color: string; x: number; y: number; spin: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={BALL_R} fill={color} stroke={INK} strokeWidth="3" />
      <path
        d={`M${-BALL_R + 4} 0 A${BALL_R - 4} ${BALL_R - 4} 0 0 0 ${BALL_R - 4} 0`}
        transform={`rotate(${(spin * 180) / Math.PI})`}
        fill="none"
        stroke="#fff6"
        strokeWidth="5"
      />
      <circle cx="-7" cy="-8" r="5.5" fill="#fff" opacity="0.75" />
    </g>
  );
}
