// Drawings the machines share: ink and wood colours, and things on the wall.

import { BAR_COLORS } from "./parts";

export const INK = "#2a1e5c";
export const WOOD = "#d08c4b";
export const DARK_WOOD = "#8a5a2b";
export const MID_WOOD = "#b8763d";
export const MARBLE_COLOR = "#3a86ff";

export function Window({ x, y = 60 }: { x: number; y?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="280" height="200" rx="10" fill="#bfe9ff" stroke={INK} strokeWidth="5" />
      <circle cx="210" cy="56" r="26" fill="#ffd23f" />
      <path d="M36 140 q20 -30 50 -10 q25 -25 55 0 q25 0 25 20 h-130 z" fill="#fff" />
      <line x1="140" y1="0" x2="140" y2="200" stroke={INK} strokeWidth="5" />
      <line x1="0" y1="100" x2="280" y2="100" stroke={INK} strokeWidth="5" />
    </g>
  );
}

export function Picture({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="190" height="140" rx="6" fill="#fff" stroke={MID_WOOD} strokeWidth="12" />
      <path d="M28 112 L76 56 L104 88 L128 64 L166 112 Z" fill="#3ec300" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="146" cy="38" r="13" fill="#ff8c42" />
    </g>
  );
}

export function WallClock({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="52" fill="#fff" stroke="#ff8c42" strokeWidth="10" />
      {Array.from({ length: 12 }, (_, i) => (
        <circle key={i} cx={38 * Math.cos((i * Math.PI) / 6)} cy={38 * Math.sin((i * Math.PI) / 6)} r="3" fill={INK} />
      ))}
      <line x1="0" y1="0" x2="0" y2="-30" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <line x1="0" y1="0" x2="22" y2="8" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <circle r="5" fill={INK} />
    </g>
  );
}

/** A string of coloured pennants from `x0` to `x1`, hanging at `y`. */
export function Bunting({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  const n = Math.floor((x1 - x0) / 64);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + 20 + i * 64;
        return <path key={i} d={`M${x} ${y + 4} L${x + 64} ${y + 4} L${x + 32} ${y + 60} Z`} fill={BAR_COLORS[i % BAR_COLORS.length]} stroke={INK} strokeWidth="3" strokeLinejoin="round" />;
      })}
      <path d={`M${x0} ${y} Q${(x0 + x1) / 2} ${y + 24} ${x1} ${y}`} stroke={INK} strokeWidth="4" fill="none" />
    </g>
  );
}

/** A small marble hopper hanging at the top, the marble's way out at (x, y). */
export function Hopper({ x, y, color = "#8e7dff" }: { x: number; y: number; color?: string }) {
  return (
    <g>
      <path d={`M${x - 58} ${y - 70} L${x + 58} ${y - 70} L${x + 28} ${y + 2} L${x - 28} ${y + 2} Z`} fill={color} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d={`M${x - 36} ${y - 52} L${x + 36} ${y - 52}`} stroke="#fff8" strokeWidth="6" strokeLinecap="round" />
    </g>
  );
}

/** Twinkling stars around (x, y), `age` seconds after they appeared. */
export function Sparkles({ x, y, age, n = 10, spread = 220 }: { x: number; y: number; age: number; n?: number; spread?: number }) {
  if (age < 0 || age > 3) return null;
  return (
    <g opacity={Math.min(1, 3 - age)}>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * 2 * Math.PI + 0.4;
        const r = spread * (0.35 + 0.65 * (1 - Math.exp(-age * 3))) * (0.7 + 0.3 * ((i * 7) % 3));
        const s = 0.6 + 0.4 * Math.sin(age * 9 + i);
        return (
          <path
            key={i}
            transform={`translate(${x + r * Math.cos(a)} ${y + r * Math.sin(a) * 0.7}) scale(${s}) rotate(${age * 120})`}
            d="M0 -16 L4 -4 L16 0 L4 4 L0 16 L-4 4 L-16 0 L-4 -4 Z"
            fill={BAR_COLORS[i % BAR_COLORS.length]}
            stroke={INK}
            strokeWidth="2"
          />
        );
      })}
    </g>
  );
}
