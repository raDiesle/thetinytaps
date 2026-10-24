import { nth } from "../shared";

// Small parts the drawings of the beach share. Heads, eyelids, floating words, puffs and
// sparkles come from the playground (their blink and float animations are in spielplatz.css);
// water drops and ripples are this scene's own and animated in strand.css.

export { Arm, Head, Hearts, Leg, Lid, Notes, Puffs, Sparkles } from "../spielplatz/parts";

export const SAND = "#f6d89c";
export const SAND_DARK = "#e2b46a";
export const SEA = "#4dabf7";
export const FOAM = "#e7f5ff";

/** A drop of water with its tip up, centred on (x, y). */
export const dropPath = (x: number, y: number, r: number) =>
  `M${x} ${y - r * 1.6} Q${x + r} ${y - r * 0.2} ${x} ${y + r} Q${x - r} ${y - r * 0.2} ${x} ${y - r * 1.6} Z`;

/** Water drops that splash up while the item plays (fill-box, so each one can fly on its own). */
export function Drops({ className, spots, r = 7, fill = "#a5d8ff" }: { className: string; spots: number[][]; r?: number; fill?: string }) {
  return (
    <g className={`sd-drops ${className}`} fill={fill}>
      {spots.map(([x, y], i) => (
        <path key={i} d={dropPath(x, y, r)} style={nth(i)} />
      ))}
    </g>
  );
}

/** Rings on the water around (cx, cy) that spread out while the item plays. */
export function Ripples({ cx, cy, rx, count = 2 }: { cx: number; cy: number; rx: number; count?: number }) {
  return (
    <g className="sd-ripples" fill="none" stroke={FOAM} strokeWidth="4">
      {Array.from({ length: count }, (_, i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={rx * 0.22} style={nth(i)} />
      ))}
    </g>
  );
}
