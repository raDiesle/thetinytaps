import { INK, nth } from "../shared";

// Little parts many drawings of this scene share. Their animations are in badezimmer.css
// ("Parts many items share"); all are hidden until the item plays.

/** An eyelid in the colour around an eye at (cx, cy); the eye blinks while the item plays. */
export function Lid({ cx, cy, r, fill }: { cx: number; cy: number; r: number; fill: string }) {
  return (
    <g className="bz-lid">
      <circle cx={cx} cy={cy} r={r * 1.3} fill={fill} />
      <path d={`M${cx - r} ${cy} Q${cx} ${cy + r * 0.9} ${cx + r} ${cy}`} stroke={INK} strokeWidth={Math.max(1.4, r * 0.4)} fill="none" strokeLinecap="round" />
    </g>
  );
}

/** Soap bubbles around (x, y) that rise and pop while the item plays. */
export function Bubbles({ x, y, count = 3, spread = 18, r = 9 }: { x: number; y: number; count?: number; spread?: number; r?: number }) {
  return (
    <g className="bz-bubbles">
      {Array.from({ length: count }, (_, i) => (
        <g key={i} style={nth(i)}>
          <circle cx={x + (i - (count - 1) / 2) * spread} cy={y - (i % 2) * spread * 0.6} r={r - (i % 3) * 2} fill="#e7f5ff" fillOpacity="0.55" stroke="#a5d8ff" strokeWidth="2.5" />
          <circle cx={x + (i - (count - 1) / 2) * spread - r * 0.35} cy={y - (i % 2) * spread * 0.6 - r * 0.35} r={r * 0.25} fill="#fff" />
        </g>
      ))}
    </g>
  );
}

/** Water drops around (x, y) that fly off while the item plays. */
export function Splash({ x, y, count = 4, spread = 16, className = "bz-splash" }: { x: number; y: number; count?: number; spread?: number; className?: string }) {
  return (
    <g className={className} fill="#74c0fc">
      {Array.from({ length: count }, (_, i) => (
        <path
          key={i}
          d={`M${x + (i - (count - 1) / 2) * spread} ${y - 9} q6 8 0 12 q-6 -4 0 -12 Z`}
          style={nth(i)}
        />
      ))}
    </g>
  );
}

/** Two little sound lines next to (x, y), opening to the right (dir 1) or left (-1). */
export function Lines({ x, y, dir = 1, colour = "#fff", size = 1 }: { x: number; y: number; dir?: 1 | -1; colour?: string; size?: number }) {
  const s = size;
  return (
    <g className="bz-lines" fill="none" stroke={colour} strokeWidth={4 * s} strokeLinecap="round">
      <path d={`M${x} ${y - 9 * s} q${7 * s * dir} ${9 * s} 0 ${18 * s}`} style={nth(0)} />
      <path d={`M${x + 11 * s * dir} ${y - 15 * s} q${11 * s * dir} ${15 * s} 0 ${30 * s}`} style={nth(1)} />
    </g>
  );
}
