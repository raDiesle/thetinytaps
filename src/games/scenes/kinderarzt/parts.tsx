import { INK, heartPath, nth, sparklePath } from "../shared";

// Little parts many drawings of this scene share. Their animations are in kinderarzt.css
// ("Parts many items share"); all are hidden until the item plays.

/** An eyelid in the colour around an eye at (cx, cy); the eye blinks while the item plays. */
export function Lid({ cx, cy, r, fill }: { cx: number; cy: number; r: number; fill: string }) {
  return (
    <g className="ka-lid">
      <circle cx={cx} cy={cy} r={r * 1.3} fill={fill} />
      <path d={`M${cx - r} ${cy} Q${cx} ${cy + r * 0.9} ${cx + r} ${cy}`} stroke={INK} strokeWidth={Math.max(1.4, r * 0.4)} fill="none" strokeLinecap="round" />
    </g>
  );
}

/** Little hearts above (x, y) that rise and fade while the item plays. */
export function Hearts({ x, y, count = 3, spread = 30, r = 12, colour = "#ff6b8b" }: { x: number; y: number; count?: number; spread?: number; r?: number; colour?: string }) {
  return (
    <g className="ka-hearts" fill={colour}>
      {Array.from({ length: count }, (_, i) => (
        <path key={i} d={heartPath(x + (i - (count - 1) / 2) * spread, y - (i % 2) * r, r)} style={nth(i)} />
      ))}
    </g>
  );
}

/** Sparkles around (x, y) that twinkle while the item plays. */
export function Sparkles({ x, y, count = 3, spread = 30, r = 10, colour = "#ffd43b" }: { x: number; y: number; count?: number; spread?: number; r?: number; colour?: string }) {
  return (
    <g className="ka-sparkles" fill={colour}>
      {Array.from({ length: count }, (_, i) => (
        <path key={i} d={sparklePath(x + (i - (count - 1) / 2) * spread, y - (i % 2) * spread * 0.6, r - (i % 2) * 3)} style={nth(i)} />
      ))}
    </g>
  );
}

/** Two little sound lines next to (x, y), opening to the right (dir 1) or left (-1). */
export function Lines({ x, y, dir = 1, colour = "#fff", size = 1 }: { x: number; y: number; dir?: 1 | -1; colour?: string; size?: number }) {
  const s = size;
  return (
    <g className="ka-lines" fill="none" stroke={colour} strokeWidth={4 * s} strokeLinecap="round">
      <path d={`M${x} ${y - 9 * s} q${7 * s * dir} ${9 * s} 0 ${18 * s}`} style={nth(0)} />
      <path d={`M${x + 11 * s * dir} ${y - 15 * s} q${11 * s * dir} ${15 * s} 0 ${30 * s}`} style={nth(1)} />
    </g>
  );
}

/** Music notes above (x, y) that float up while the item plays. */
export function Notes({ x, y, colour = "#7950f2", size = 1 }: { x: number; y: number; colour?: string; size?: number }) {
  return (
    <g className="ka-notes" fill={colour}>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${x + (i - 1) * 26 * size} ${y - (i % 2) * 14 * size}) scale(${size})`}>
          <g className="ka-note" style={nth(i)}>
            <ellipse cx="0" cy="0" rx="7" ry="5.5" transform="rotate(-20)" />
            <rect x="5" y="-26" width="3" height="26" />
            <path d="M8 -26 q10 4 10 14 q-4 -6 -10 -6 Z" />
          </g>
        </g>
      ))}
    </g>
  );
}

/** Bubbles around (x, y) that rise and pop while the item plays. */
export function Bubbles({ x, y, count = 3, spread = 14, r = 7 }: { x: number; y: number; count?: number; spread?: number; r?: number }) {
  return (
    <g className="ka-bubbles">
      {Array.from({ length: count }, (_, i) => (
        <g key={i} style={nth(i)}>
          <circle cx={x + (i - (count - 1) / 2) * spread} cy={y - (i % 2) * spread * 0.7} r={r - (i % 3) * 1.5} fill="#e7f5ff" fillOpacity="0.6" stroke="#a5d8ff" strokeWidth="2" />
          <circle cx={x + (i - (count - 1) / 2) * spread - r * 0.35} cy={y - (i % 2) * spread * 0.7 - r * 0.35} r={r * 0.25} fill="#fff" />
        </g>
      ))}
    </g>
  );
}

/** A plaster with rounded ends and a pad in the middle, centred on (x, y), tilted by `angle`. */
export function Plaster({ x, y, w = 40, angle = 0, colour = "#ffc9a8" }: { x: number; y: number; w?: number; angle?: number; colour?: string }) {
  const h = w * 0.36;
  return (
    <g transform={`rotate(${angle} ${x} ${y})`}>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} fill={colour} />
      <rect x={x - w * 0.18} y={y - h / 2} width={w * 0.36} height={h} fill="#fff" opacity="0.75" />
      {[-0.36, -0.28, 0.28, 0.36].map((k) => (
        <circle key={k} cx={x + k * w} cy={y} r={h * 0.09} fill="#e8a07c" />
      ))}
    </g>
  );
}
