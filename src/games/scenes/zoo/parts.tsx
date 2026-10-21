import { INK, nth } from "../shared";

// Small parts many zoo drawings share.

/** An eyelid over an `Eye`, in the colour around it; it only shows while the item blinks (class zo-lid). */
export function Lid({ cx, cy, r, fill }: { cx: number; cy: number; r: number; fill: string }) {
  return (
    <g className="zo-lid">
      <circle cx={cx} cy={cy} r={r * 1.3} fill={fill} />
      <path d={`M${cx - r} ${cy} Q${cx} ${cy + r * 0.9} ${cx + r} ${cy}`} stroke={INK} strokeWidth={Math.max(1.4, r * 0.4)} fill="none" strokeLinecap="round" />
    </g>
  );
}

/** A few drops or bubbles around (x, y) that only show while the item plays; `className` picks the animation. */
export function Drops({ x, y, className, fill = "#a5d8ff", count = 3, spread = 16 }: { x: number; y: number; className: string; fill?: string; count?: number; spread?: number }) {
  return (
    <g className={className} fill={fill}>
      {Array.from({ length: count }, (_, i) => (
        <circle key={i} cx={x + (i - (count - 1) / 2) * spread} cy={y - (i % 2) * spread * 0.5} r={6 - (i % 3)} style={nth(i)} />
      ))}
    </g>
  );
}
