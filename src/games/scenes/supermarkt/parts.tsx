import { INK, nth } from "../shared";

// Little parts many drawings of this scene share. Their animations are in supermarkt.css
// ("Parts many items share"); all but the eyelids are hidden until the item plays.

/** An eyelid in the colour around an eye at (cx, cy); the eye blinks while the item plays. */
export function Lid({ cx, cy, r, fill }: { cx: number; cy: number; r: number; fill: string }) {
  return (
    <g className="sm-lid">
      <circle cx={cx} cy={cy} r={r * 1.3} fill={fill} />
      <path d={`M${cx - r} ${cy} Q${cx} ${cy + r * 0.9} ${cx + r} ${cy}`} stroke={INK} strokeWidth={Math.max(1.4, r * 0.4)} fill="none" strokeLinecap="round" />
    </g>
  );
}

/** Two little sound lines next to (x, y), opening to the right (dir 1) or left (-1). */
export function Lines({ x, y, dir = 1, colour = INK, size = 1 }: { x: number; y: number; dir?: 1 | -1; colour?: string; size?: number }) {
  const s = size;
  return (
    <g className="sm-lines" fill="none" stroke={colour} strokeWidth={4 * s} strokeLinecap="round">
      <path d={`M${x} ${y - 9 * s} q${7 * s * dir} ${9 * s} 0 ${18 * s}`} style={nth(0)} />
      <path d={`M${x + 11 * s * dir} ${y - 15 * s} q${11 * s * dir} ${15 * s} 0 ${30 * s}`} style={nth(1)} />
    </g>
  );
}

/** Cold mist (or warm steam with `colour`) that puffs up from around (x, y) while the item plays. */
export function Mist({ x, y, count = 3, spread = 24, r = 12, colour = "#e7f5ff" }: { x: number; y: number; count?: number; spread?: number; r?: number; colour?: string }) {
  return (
    <g className="sm-mist" fill={colour}>
      {Array.from({ length: count }, (_, i) => (
        <circle key={i} cx={x + (i - (count - 1) / 2) * spread} cy={y - (i % 2) * r * 0.6} r={r + (i % 2) * 3} style={nth(i)} />
      ))}
    </g>
  );
}

/** Music notes that float up from (x, y) while the item plays. */
export function Notes({ x, y, colour = "#7048e8", size = 1 }: { x: number; y: number; colour?: string; size?: number }) {
  return (
    <g className="sm-notes" fill={colour}>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${x + i * 18 * size} ${y - (i % 2) * 12 * size}) scale(${size})`}>
          <g className="sm-note" style={nth(i)}>
            <ellipse cx="0" cy="0" rx="6" ry="4.5" transform="rotate(-20)" />
            <rect x="4" y="-20" width="2.6" height="20" />
            <path d="M6 -20 q8 4 6 12" stroke={colour} strokeWidth="2.6" fill="none" />
          </g>
        </g>
      ))}
    </g>
  );
}

/** Little sparkles around (x, y) that twinkle while the item plays. */
export function Sparkles({ x, y, spread = 30, colour = "#ffd43b", size = 1 }: { x: number; y: number; spread?: number; colour?: string; size?: number }) {
  const spots: [number, number][] = [
    [-1, -0.4],
    [0.9, -0.8],
    [0.3, 0.7],
  ];
  return (
    <g className="sm-sparkles" fill={colour}>
      {spots.map(([dx, dy], i) => (
        <path
          key={i}
          style={nth(i)}
          d={`M${x + dx * spread} ${y + dy * spread - 9 * size} l${2.5 * size} ${6.5 * size} l${6.5 * size} ${2.5 * size} l${-6.5 * size} ${2.5 * size} l${-2.5 * size} ${6.5 * size} l${-2.5 * size} ${-6.5 * size} l${-6.5 * size} ${-2.5 * size} l${6.5 * size} ${-2.5 * size} Z`}
        />
      ))}
    </g>
  );
}
