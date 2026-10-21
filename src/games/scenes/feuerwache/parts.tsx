import { Face, SKIN, Wheel, nth } from "../shared";

// Small parts used by several drawings of the fire station.

export const FIRE_RED = "#e63946";
export const DARK_RED = "#c1121f";
export const NAVY = "#1d3557";
export const STRIPE = "#ffd60a";

/** A wheel that turns while its vehicle plays (class fw-wheel). */
export function TurningWheel({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g className="fw-wheel" style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <Wheel cx={cx} cy={cy} r={r} />
    </g>
  );
}

/** Mudguard arc over a wheel. */
export const guard = (cx: number, cy: number, r: number) => `M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}`;

/** Sound lines next to a horn, bell or whistle, shown while it sounds. */
export function Toot({ x, y, dir = 1, className, colour = STRIPE }: { x: number; y: number; dir?: 1 | -1; className: string; colour?: string }) {
  return (
    <g className={className} fill="none" stroke={colour} strokeWidth="4" strokeLinecap="round">
      <path d={`M${x} ${y - 10} q${8 * dir} 10 0 20`} style={nth(0)} />
      <path d={`M${x + 12 * dir} ${y - 16} q${12 * dir} 16 0 32`} style={nth(1)} />
    </g>
  );
}

/** A blue light on a roof, with its glow (classes fw-<name>-glow and fw-<name>-light). */
export function BlueLight({ x, y, w = 44, name }: { x: number; y: number; w?: number; name: string }) {
  return (
    <>
      <ellipse className={`fw-${name}-glow`} cx={x} cy={y} rx={w} ry={w * 0.5} fill="#4cc9f0" />
      <rect x={x - w / 2} y={y - 7} width={w} height="14" rx="6" fill="#3a86ff" />
      <rect className={`fw-${name}-light`} x={x - w / 2} y={y - 7} width={w} height="14" rx="6" fill="#9bf6ff" />
    </>
  );
}

/**
 * A firefighter's head: face, a helmet with a shining visor band and a neck guard.
 * `r` is the head radius; the helmet colour tells people apart.
 */
export function HelmetHead({ cx, cy, r = 16, helmet, hair }: { cx: number; cy: number; r?: number; helmet: string; hair?: string }) {
  return (
    <>
      {hair && <path d={`M${cx - r * 0.9} ${cy - r * 0.1} Q${cx - r * 1.5} ${cy + r * 0.9} ${cx - r * 0.6} ${cy + r * 1.1} L${cx - r * 0.5} ${cy}`} fill={hair} />}
      <path d={`M${cx - r * 1.05} ${cy - r * 0.2} Q${cx - r * 1.2} ${cy + r * 0.6} ${cx - r * 0.7} ${cy + r * 0.7} V${cy - r * 0.2} Z`} fill={helmet} opacity="0.85" />
      <circle cx={cx} cy={cy} r={r} fill={SKIN} />
      <Face cx={cx} cy={cy + r * 0.1} size={r / 26} />
      <path d={`M${cx - r * 1.1} ${cy - r * 0.35} Q${cx - r * 1.1} ${cy - r * 1.45} ${cx} ${cy - r * 1.45} Q${cx + r * 1.1} ${cy - r * 1.45} ${cx + r * 1.1} ${cy - r * 0.35} Z`} fill={helmet} />
      <path d={`M${cx - r * 0.2} ${cy - r * 1.45} Q${cx} ${cy - r * 1.6} ${cx + r * 0.2} ${cy - r * 1.45}`} stroke={helmet} strokeWidth={r * 0.3} fill="none" />
      <rect x={cx - r * 1.25} y={cy - r * 0.5} width={r * 2.5} height={r * 0.28} rx={r * 0.12} fill={helmet} />
      <path d={`M${cx - r * 0.95} ${cy - r * 0.8} Q${cx} ${cy - r * 1.05} ${cx + r * 0.95} ${cy - r * 0.8}`} stroke="#dee2e6" strokeWidth={r * 0.18} fill="none" />
      <path d={`M${cx - r * 0.5} ${cy - r * 1.25} Q${cx - r * 0.2} ${cy - r * 1.4} ${cx + r * 0.1} ${cy - r * 1.35}`} stroke="#fff" strokeOpacity="0.55" strokeWidth={r * 0.14} strokeLinecap="round" fill="none" />
    </>
  );
}

/** A firefighter's jacket from the shoulders down to the hips, with reflective stripes. */
export function Jacket({ x, y, w, h, colour = NAVY }: { x: number; y: number; w: number; h: number; colour?: string }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={w * 0.3} fill={colour} />
      <rect x={x} y={y + h * 0.55} width={w} height={h * 0.09} fill={STRIPE} />
      <rect x={x} y={y + h * 0.72} width={w} height={h * 0.06} fill="#dee2e6" />
      <path d={`M${x + w / 2} ${y + 4} V${y + h - 4}`} stroke="#000" strokeOpacity="0.15" strokeWidth="2" />
    </>
  );
}
