import { INK, nth } from "../shared";

// Little parts many drawings of this scene share. Their animations are in kueche.css
// ("Parts many items share"); all but the eyelids' frames are hidden until the item plays.

/** An eyelid in the colour around an eye at (cx, cy); the eye blinks while the item plays. */
export function Lid({ cx, cy, r, fill }: { cx: number; cy: number; r: number; fill: string }) {
  return (
    <g className="kc-lid">
      <circle cx={cx} cy={cy} r={r * 1.3} fill={fill} />
      <path d={`M${cx - r} ${cy} Q${cx} ${cy + r * 0.9} ${cx + r} ${cy}`} stroke={INK} strokeWidth={Math.max(1.4, r * 0.4)} fill="none" strokeLinecap="round" />
    </g>
  );
}

/** Puffs of steam above (x, y) that rise and fade while the item plays. */
export function Steam({ x, y, count = 3, spread = 16, r = 10 }: { x: number; y: number; count?: number; spread?: number; r?: number }) {
  return (
    <g className="kc-steam" fill="#fff">
      {Array.from({ length: count }, (_, i) => (
        <g key={i} style={nth(i)}>
          <circle cx={x + (i - (count - 1) / 2) * spread} cy={y - (i % 2) * r * 0.6} r={r} />
          <circle cx={x + (i - (count - 1) / 2) * spread + r * 0.7} cy={y - (i % 2) * r * 0.6 - r * 0.5} r={r * 0.7} />
        </g>
      ))}
    </g>
  );
}

/** Soap bubbles around (x, y) that rise and pop while the item plays. */
export function Bubbles({ x, y, count = 3, spread = 18, r = 9 }: { x: number; y: number; count?: number; spread?: number; r?: number }) {
  return (
    <g className="kc-bubbles">
      {Array.from({ length: count }, (_, i) => (
        <g key={i} style={nth(i)}>
          <circle
            cx={x + (i - (count - 1) / 2) * spread}
            cy={y - (i % 2) * spread * 0.6}
            r={r - (i % 3) * 2}
            fill="#e7f5ff"
            fillOpacity="0.6"
            stroke="#a5d8ff"
            strokeWidth="2.5"
          />
          <circle cx={x + (i - (count - 1) / 2) * spread - r * 0.35} cy={y - (i % 2) * spread * 0.6 - r * 0.35} r={r * 0.25} fill="#fff" />
        </g>
      ))}
    </g>
  );
}

/** Music notes above (x, y) that float up while the item plays. */
export function Notes({ x, y, colour = "#7950f2", size = 1 }: { x: number; y: number; colour?: string; size?: number }) {
  return (
    <g className="kc-notes" fill={colour}>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${x + (i - 1) * 26 * size} ${y - (i % 2) * 14 * size}) scale(${size})`}>
          <g className="kc-note" style={nth(i)}>
            <ellipse cx="0" cy="0" rx="7" ry="5.5" transform="rotate(-20)" />
            <rect x="5" y="-26" width="3" height="26" />
            <path d="M8 -26 q10 4 10 14 q-4 -6 -10 -6 Z" />
          </g>
        </g>
      ))}
    </g>
  );
}

/** Little sound lines next to (x, y), opening to the right (dir 1) or left (-1). */
export function Lines({ x, y, dir = 1, colour = INK, size = 1 }: { x: number; y: number; dir?: 1 | -1; colour?: string; size?: number }) {
  const s = size;
  return (
    <g className="kc-lines" fill="none" stroke={colour} strokeWidth={4 * s} strokeLinecap="round">
      <path d={`M${x} ${y - 9 * s} q${7 * s * dir} ${9 * s} 0 ${18 * s}`} style={nth(0)} />
      <path d={`M${x + 11 * s * dir} ${y - 15 * s} q${11 * s * dir} ${15 * s} 0 ${30 * s}`} style={nth(1)} />
    </g>
  );
}

/** Small hearts around (x, y) that pop up while the item plays. */
export function Hearts({ x, y, count = 3, spread = 30, colour = "#ff6b6b" }: { x: number; y: number; count?: number; spread?: number; colour?: string }) {
  return (
    <g className="kc-hearts" fill={colour}>
      {Array.from({ length: count }, (_, i) => {
        const hx = x + (i - (count - 1) / 2) * spread;
        const hy = y - (i % 2) * 16;
        return <path key={i} style={nth(i)} d={`M${hx} ${hy} c-6 -9 -18 -2 -9 7 l9 8 l9 -8 c9 -9 -3 -16 -9 -7 Z`} />;
      })}
    </g>
  );
}
