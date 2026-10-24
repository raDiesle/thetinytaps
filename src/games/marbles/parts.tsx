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

/** The pattern on a marble; the Kugelbahn's magic tunnel gives it one (K-06). */
export type BallLook = "plain" | "stripes" | "dots" | "star";

/** A five-pointed star around 0, 0, about as wide as a marble's middle. */
export const STAR_POINTS = Array.from({ length: 10 }, (_, i) => {
  const a = (i * Math.PI) / 5 - Math.PI / 2;
  const r = i % 2 ? 6 : 14;
  return `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`;
}).join(" ");

/** A marble with a shine and a pattern (a stripe unless `look` says otherwise) that turns by `spin` radians as it rolls. */
export function Ball({ color, x, y, spin, look = "plain" }: { color: string; x: number; y: number; spin: number; look?: BallLook }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={BALL_R} fill={color} stroke={INK} strokeWidth="3" />
      <g transform={`rotate(${(spin * 180) / Math.PI})`}>
        {look === "plain" && <path d={`M${-BALL_R + 4} 0 A${BALL_R - 4} ${BALL_R - 4} 0 0 0 ${BALL_R - 4} 0`} fill="none" stroke="#fff6" strokeWidth="5" />}
        {look === "stripes" && <path d="M-17 -8 L17 -8 M-17 8 L17 8" stroke="#fff" strokeWidth="6" strokeLinecap="round" />}
        {look === "dots" &&
          [0, 120, 240].map((a) => <circle key={a} cx={11 * Math.cos((a * Math.PI) / 180)} cy={11 * Math.sin((a * Math.PI) / 180)} r="4.5" fill="#fff" />)}
        {look === "star" && <polygon points={STAR_POINTS} fill="#fff" stroke="#e09a00" strokeWidth="2" strokeLinejoin="round" />}
      </g>
      <circle cx="-7" cy="-8" r="5.5" fill="#fff" opacity="0.75" />
    </g>
  );
}
