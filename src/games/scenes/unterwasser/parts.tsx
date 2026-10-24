import type { CSSProperties } from "react";
import { INK, nth } from "../shared";

// Small parts many Unterwasser drawings share. They only show while their item plays; the
// timing is in unterwasser.css ("Parts many items share"). `delay` sets --d, when they start.

const after = (delay?: number) => (delay === undefined ? undefined : ({ "--d": `${delay}s` } as CSSProperties));

/** An eyelid over an `Eye`, in the colour around it; the eye blinks twice while the item plays. */
export function Lid({ cx, cy, r, fill }: { cx: number; cy: number; r: number; fill: string }) {
  return (
    <g className="uw-lid">
      <circle cx={cx} cy={cy} r={r * 1.3} fill={fill} />
      <path d={`M${cx - r} ${cy} Q${cx} ${cy + r * 0.9} ${cx + r} ${cy}`} stroke={INK} strokeWidth={Math.max(1.4, r * 0.4)} fill="none" strokeLinecap="round" />
    </g>
  );
}

/** A few bubbles at (x, y) that wobble up and fade. */
export function Bubbles({ x, y, count = 3, size = 6, delay }: { x: number; y: number; count?: number; size?: number; delay?: number }) {
  return (
    <g className="uw-bub" fill="#e7f5ff" fillOpacity="0.6" stroke="#fff" strokeWidth={size / 3} style={after(delay)}>
      {Array.from({ length: count }, (_, i) => (
        <circle key={i} cx={x + (i % 2 ? size : -size) * 0.8} cy={y - i * size * 1.6} r={size * (0.7 + (i % 3) * 0.25)} style={nth(i)} />
      ))}
    </g>
  );
}

/** A little heart at (x, y) that pops up and floats away. */
export function Heart({ x, y, size = 1, delay }: { x: number; y: number; size?: number; delay?: number }) {
  const s = size;
  return (
    <path
      className="uw-pop-heart"
      d={`M${x} ${y} c${-10 * s} ${-14 * s} ${-30 * s} ${-4 * s} ${-20 * s} ${12 * s} l${20 * s} ${18 * s} l${20 * s} ${-18 * s} c${10 * s} ${-16 * s} ${-10 * s} ${-26 * s} ${-20 * s} ${-12 * s} Z`}
      fill="#ff6b8b"
      style={after(delay)}
    />
  );
}

/** Two sound lines in front of a mouth at (x, y); `dir` -1 points them left. */
export function Lines({ x, y, dir = -1, size = 1, delay }: { x: number; y: number; dir?: 1 | -1; size?: number; delay?: number }) {
  const s = size * dir;
  return (
    <g className="uw-lines" stroke="#fff" strokeWidth={4 * size} strokeLinecap="round" fill="none" style={after(delay)}>
      <path d={`M${x} ${y - 8 * size} q${8 * s} ${8 * size} 0 ${16 * size}`} style={nth(0)} />
      <path d={`M${x + 12 * s} ${y - 14 * size} q${12 * s} ${14 * size} 0 ${28 * size}`} style={nth(1)} />
    </g>
  );
}

/** A little four-pointed sparkle at (x, y). */
export function Sparkle({ x, y, r = 10, i = 0 }: { x: number; y: number; r?: number; i?: number }) {
  const t = r * 0.3;
  return (
    <path
      className="uw-sparkle"
      d={`M${x} ${y - r} L${x + t} ${y - t} L${x + r} ${y} L${x + t} ${y + t} L${x} ${y + r} L${x - t} ${y + t} L${x - r} ${y} L${x - t} ${y - t} Z`}
      fill="#fff"
      style={nth(i)}
    />
  );
}

/** Puffs of sand at the given x positions on y; `className` picks when they puff. */
export function Sand({ xs, y, r = 10, className }: { xs: number[]; y: number; r?: number; className: string }) {
  return (
    <g className={`uw-sand ${className}`} fill="#e9d8a6">
      {xs.map((x, i) => (
        <circle key={x} cx={x} cy={y} r={r} style={nth(i)} />
      ))}
    </g>
  );
}
