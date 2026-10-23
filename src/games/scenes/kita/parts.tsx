import { CHEEK, INK, SKIN, nth, sparklePath } from "../shared";

// Little parts many drawings of this scene share. Their animations are in kita.css
// ("Parts many items share"); they are hidden until the item plays.

/** An eyelid in the colour around an eye at (cx, cy); the eye blinks while the item plays. */
export function Lid({ cx, cy, r, fill = SKIN }: { cx: number; cy: number; r: number; fill?: string }) {
  return (
    <g className="ki-lid">
      <circle cx={cx} cy={cy} r={r * 1.3} fill={fill} />
      <path d={`M${cx - r} ${cy} Q${cx} ${cy + r * 0.9} ${cx + r} ${cy}`} stroke={INK} strokeWidth={Math.max(1.4, r * 0.4)} fill="none" strokeLinecap="round" />
    </g>
  );
}

/** Both eyelids of a `Face` of this size at (cx, cy). */
export function Lids({ cx, cy, size = 1, fill = SKIN }: { cx: number; cy: number; size?: number; fill?: string }) {
  return (
    <>
      <Lid cx={cx - 7 * size} cy={cy} r={3.3 * size} fill={fill} />
      <Lid cx={cx + 7 * size} cy={cy} r={3.3 * size} fill={fill} />
    </>
  );
}

/** An open mouth over the smile of a `Face` at (cx, cy); only shown while the item plays (talking, laughing). */
export function Mouth({ cx, cy, size = 1, cls = "ki-mouth" }: { cx: number; cy: number; size?: number; cls?: string }) {
  const s = size;
  return (
    <g className={cls}>
      <ellipse cx={cx} cy={cy + 11 * s} rx={6 * s} ry={6.5 * s} fill="#9c2c3a" />
      <ellipse cx={cx} cy={cy + 14 * s} rx={3.6 * s} ry={2.4 * s} fill="#ff8fa3" />
    </g>
  );
}

/** Closed, sleeping eyes and a small smile, centred on (cx, cy). */
export function SleepFace({ cx, cy, size = 1 }: { cx: number; cy: number; size?: number }) {
  const s = size;
  return (
    <>
      <circle cx={cx - 10 * s} cy={cy + 7 * s} r={4.5 * s} fill={CHEEK} opacity="0.55" />
      <circle cx={cx + 10 * s} cy={cy + 7 * s} r={4.5 * s} fill={CHEEK} opacity="0.55" />
      <g stroke={INK} strokeWidth={2.4 * s} strokeLinecap="round" fill="none">
        <path d={`M${cx - 11 * s} ${cy} Q${cx - 7 * s} ${cy + 4 * s} ${cx - 3 * s} ${cy}`} />
        <path d={`M${cx + 3 * s} ${cy} Q${cx + 7 * s} ${cy + 4 * s} ${cx + 11 * s} ${cy}`} />
        <path d={`M${cx - 4 * s} ${cy + 10 * s} Q${cx} ${cy + 13 * s} ${cx + 4 * s} ${cy + 10 * s}`} />
      </g>
    </>
  );
}

/** Music notes above (x, y) that float up while the item plays. */
export function Notes({ x, y, colour = "#7950f2", size = 1 }: { x: number; y: number; colour?: string; size?: number }) {
  return (
    <g className="ki-notes" fill={colour}>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${x + (i - 1) * 26 * size} ${y - (i % 2) * 14 * size}) scale(${size})`}>
          <g className="ki-note" style={nth(i)}>
            <ellipse cx="0" cy="0" rx="7" ry="5.5" transform="rotate(-20)" />
            <rect x="5" y="-26" width="3" height="26" />
            <path d="M8 -26 q10 4 10 14 q-4 -6 -10 -6 Z" />
          </g>
        </g>
      ))}
    </g>
  );
}

/** Small hearts around (x, y) that pop up while the item plays. */
export function Hearts({ x, y, count = 3, spread = 30, colour = "#ff6b6b", size = 1 }: { x: number; y: number; count?: number; spread?: number; colour?: string; size?: number }) {
  const s = size;
  return (
    <g className="ki-hearts" fill={colour}>
      {Array.from({ length: count }, (_, i) => {
        const hx = x + (i - (count - 1) / 2) * spread;
        const hy = y - (i % 2) * 16 * s;
        return <path key={i} style={nth(i)} d={`M${hx} ${hy} c${-6 * s} ${-9 * s} ${-18 * s} ${-2 * s} ${-9 * s} ${7 * s} l${9 * s} ${8 * s} l${9 * s} ${-8 * s} c${9 * s} ${-9 * s} ${-3 * s} ${-16 * s} ${-9 * s} ${-7 * s} Z`} />;
      })}
    </g>
  );
}

/** Little sound lines next to (x, y), opening to the right (dir 1) or left (-1). */
export function Lines({ x, y, dir = 1, colour = INK, size = 1 }: { x: number; y: number; dir?: 1 | -1; colour?: string; size?: number }) {
  const s = size;
  return (
    <g className="ki-lines" fill="none" stroke={colour} strokeWidth={4 * s} strokeLinecap="round">
      <path d={`M${x} ${y - 9 * s} q${7 * s * dir} ${9 * s} 0 ${18 * s}`} style={nth(0)} />
      <path d={`M${x + 11 * s * dir} ${y - 15 * s} q${11 * s * dir} ${15 * s} 0 ${30 * s}`} style={nth(1)} />
    </g>
  );
}

/** Sparkles around (x, y) that pop up and fade while the item plays. */
export function Sparkles({ x, y, spread = 40, size = 1, colour = "#fcc419" }: { x: number; y: number; spread?: number; size?: number; colour?: string }) {
  const spots = [
    [-1, 0.2],
    [0, -0.6],
    [1, 0.1],
    [0.5, 0.8],
  ];
  return (
    <g className="ki-sparkles" fill={colour}>
      {spots.map(([dx, dy], i) => (
        <path key={i} style={nth(i)} d={sparklePath(x + dx * spread, y + dy * spread, (9 - (i % 2) * 3) * size)} />
      ))}
    </g>
  );
}

/** Puffs (steam, smoke, dust) above (x, y) that rise and fade while the item plays. */
export function Puffs({ x, y, count = 3, spread = 16, r = 10, colour = "#fff" }: { x: number; y: number; count?: number; spread?: number; r?: number; colour?: string }) {
  return (
    <g className="ki-puffs" fill={colour}>
      {Array.from({ length: count }, (_, i) => (
        <g key={i} style={nth(i)}>
          <circle cx={x + (i - (count - 1) / 2) * spread} cy={y - (i % 2) * r * 0.6} r={r} />
          <circle cx={x + (i - (count - 1) / 2) * spread + r * 0.7} cy={y - (i % 2) * r * 0.6 - r * 0.5} r={r * 0.7} />
        </g>
      ))}
    </g>
  );
}

/** Water drops around (x, y) that splash up and fall while the item plays. */
export function Drops({ x, y, count = 4, spread = 20, colour = "#74c0fc", size = 1 }: { x: number; y: number; count?: number; spread?: number; colour?: string; size?: number }) {
  const s = size;
  return (
    <g className="ki-drops" fill={colour}>
      {Array.from({ length: count }, (_, i) => {
        const dx = x + (i - (count - 1) / 2) * spread;
        return <path key={i} style={nth(i)} d={`M${dx} ${y - 8 * s} q${5 * s} ${7 * s} 0 ${10 * s} q${-5 * s} ${-3 * s} 0 ${-10 * s} Z`} />;
      })}
    </g>
  );
}

/** "z Z" next to a sleeper at (x, y), rising to the upper right while the item plays. */
export function Zzz({ x, y, size = 1, colour = "#7c83c9" }: { x: number; y: number; size?: number; colour?: string }) {
  const z = (zx: number, zy: number, w: number) => `M${zx} ${zy} h${w} l${-w} ${w} h${w}`;
  return (
    <g className="ki-zzz" stroke={colour} strokeWidth={3.5 * size} strokeLinecap="round" strokeLinejoin="round" fill="none">
      {[0, 1, 2].map((i) => (
        <path key={i} style={nth(i)} d={z(x + i * 18 * size, y - i * 20 * size, (10 + i * 4) * size)} />
      ))}
    </g>
  );
}
