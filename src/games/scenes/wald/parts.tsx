import { nth } from "../shared";

// Little parts many drawings of this scene share. Their animations are in wald.css
// ("Parts many items share"); all are hidden until the item plays.

/** An eyelid in the colour of the fur over an eye at (cx, cy); the eye blinks twice while the item plays. */
export function Lid({ cx, cy, r, fill }: { cx: number; cy: number; r: number; fill: string }) {
  return (
    <g className="wd-lid">
      <circle cx={cx} cy={cy} r={r * 1.25} fill={fill} />
      <path
        d={`M${cx - r} ${cy} Q${cx} ${cy + r * 0.8} ${cx + r} ${cy}`}
        stroke="#2b2d42"
        strokeWidth={Math.max(1.2, r * 0.45)}
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

/** Two sound lines in front of a mouth at (x, y), opening to the right (dir 1) or left (-1). */
export function Lines({ x, y, dir = 1, colour = "#fff", size = 1 }: { x: number; y: number; dir?: 1 | -1; colour?: string; size?: number }) {
  const s = size;
  return (
    <g className="wd-lines" fill="none" stroke={colour} strokeWidth={4 * s} strokeLinecap="round">
      <path d={`M${x} ${y - 9 * s} q${7 * s * dir} ${9 * s} 0 ${18 * s}`} style={nth(0)} />
      <path d={`M${x + 11 * s * dir} ${y - 15 * s} q${11 * s * dir} ${15 * s} 0 ${30 * s}`} style={nth(1)} />
    </g>
  );
}

/** Little floating notes or words, e.g. "Kuckuck!", shown one after the other while the item plays. */
export function Notes({ x, y, texts, colour = "#fff", size = 22 }: { x: number; y: number; texts: string[]; colour?: string; size?: number }) {
  return (
    <g className="wd-notes" fill={colour} fontSize={size} fontWeight="800" fontFamily="system-ui, sans-serif" stroke="#2b2d42" strokeWidth={size / 8} paintOrder="stroke">
      {texts.map((text, i) => (
        <text key={i} x={x + i * size * 0.9} y={y - i * size * 0.6} style={nth(i)}>
          {text}
        </text>
      ))}
    </g>
  );
}
