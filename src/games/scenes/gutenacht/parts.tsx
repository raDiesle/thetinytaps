import { CHEEK, Eye, INK, nth } from "../shared";

// Little parts many drawings of this scene share. Their animations are in gutenacht.css
// ("Falling asleep"): open eyes (gn-open) close for good once the item is asleep, sleeping
// eyes (gn-shut) and the "z Z" (gn-zzz) only show then, and lights (gn-on) go out.

/** Two eyes at (cx ± gap, cy) that close when the item falls asleep. */
export function Eyes({ cx, cy, gap, r = 3.5 }: { cx: number; cy: number; gap: number; r?: number }) {
  return (
    <>
      <g className="gn-open">
        <Eye cx={cx - gap} cy={cy} r={r} />
        <Eye cx={cx + gap} cy={cy} r={r} />
      </g>
      <g className="gn-shut" stroke={INK} strokeWidth={Math.max(1.6, r * 0.6)} strokeLinecap="round" fill="none">
        <path d={`M${cx - gap - r * 1.1} ${cy} Q${cx - gap} ${cy + r * 1.1} ${cx - gap + r * 1.1} ${cy}`} />
        <path d={`M${cx + gap - r * 1.1} ${cy} Q${cx + gap} ${cy + r * 1.1} ${cx + gap + r * 1.1} ${cy}`} />
      </g>
    </>
  );
}

/** A wide-open yawning mouth centred on (cx, cy); only shown while the item plays. */
export function Yawn({ cx, cy, r = 6 }: { cx: number; cy: number; r?: number }) {
  return (
    <g className="gn-yawn">
      <ellipse cx={cx} cy={cy} rx={r * 0.8} ry={r} fill="#6b2737" />
      <ellipse cx={cx} cy={cy + r * 0.45} rx={r * 0.55} ry={r * 0.4} fill="#ff8fa3" />
    </g>
  );
}

/** A sleepy face: eyes that close, rosy cheeks, a little smile and a yawn. */
export function SleepyFace({ cx, cy, size = 1, cheeks = true }: { cx: number; cy: number; size?: number; cheeks?: boolean }) {
  const s = size;
  return (
    <>
      {cheeks && (
        <>
          <circle cx={cx - 10 * s} cy={cy + 7 * s} r={4.5 * s} fill={CHEEK} opacity="0.55" />
          <circle cx={cx + 10 * s} cy={cy + 7 * s} r={4.5 * s} fill={CHEEK} opacity="0.55" />
        </>
      )}
      <Eyes cx={cx} cy={cy} gap={7 * s} r={3 * s} />
      <path
        d={`M${cx - 4.5 * s} ${cy + 9 * s} Q${cx} ${cy + 13 * s} ${cx + 4.5 * s} ${cy + 9 * s}`}
        stroke={INK}
        strokeWidth={2.2 * s}
        strokeLinecap="round"
        fill="none"
      />
      <Yawn cx={cx} cy={cy + 11 * s} r={5.5 * s} />
    </>
  );
}

/** "z Z" next to a sleeper at (x, y), rising to the upper right; shown while the item is asleep. */
export function Zzz({ x, y, size = 1, colour = "#7c83c9" }: { x: number; y: number; size?: number; colour?: string }) {
  const s = size;
  const z = (zx: number, zy: number, w: number) => `M${zx} ${zy} h${w} l${-w} ${w} h${w}`;
  return (
    <g className="gn-zzz" stroke={colour} strokeWidth={3 * s} strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d={z(x, y, 9 * s)} />
      <path d={z(x + 12 * s, y - 18 * s, 13 * s)} />
    </g>
  );
}

/** Music notes rising above (x, y) while the item plays. */
export function Notes({ x, y, colour = "#9775fa", count = 3, size = 1 }: { x: number; y: number; colour?: string; count?: number; size?: number }) {
  const s = size;
  return (
    <g className="gn-notes" fill={colour}>
      {Array.from({ length: count }, (_, i) => {
        const nx = x + (i - (count - 1) / 2) * 22 * s;
        const ny = y - (i % 2) * 10 * s;
        return (
          <g key={i} style={nth(i)}>
            <ellipse cx={nx} cy={ny} rx={6 * s} ry={4.5 * s} transform={`rotate(-20 ${nx} ${ny})`} />
            <rect x={nx + 4.2 * s} y={ny - 20 * s} width={2.4 * s} height={20 * s} />
            <path d={`M${nx + 5.4 * s} ${ny - 20 * s} q${8 * s} ${3 * s} ${7 * s} ${10 * s}`} stroke={colour} strokeWidth={2.4 * s} fill="none" />
          </g>
        );
      })}
    </g>
  );
}

/** A four-pointed star centred on (x, y). */
export const sparkle = (x: number, y: number, r: number) =>
  `M${x} ${y - r} L${x + r * 0.3} ${y - r * 0.3} L${x + r} ${y} L${x + r * 0.3} ${y + r * 0.3} L${x} ${y + r} L${x - r * 0.3} ${y + r * 0.3} L${x - r} ${y} L${x - r * 0.3} ${y - r * 0.3} Z`;

/** A five-pointed star centred on (x, y), with round-ish proportions. */
export function star(x: number, y: number, r: number) {
  const points = Array.from({ length: 10 }, (_, i) => {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const d = i % 2 ? r * 0.48 : r;
    return `${(x + Math.cos(a) * d).toFixed(1)} ${(y + Math.sin(a) * d).toFixed(1)}`;
  });
  return `M${points.join(" L")} Z`;
}

/** Little sparkles around (x, y) that twinkle while the item plays. */
export function Sparkles({
  x,
  y,
  spread = 30,
  count = 3,
  colour = "#ffe066",
  size = 1,
}: {
  x: number;
  y: number;
  spread?: number;
  count?: number;
  colour?: string;
  size?: number;
}) {
  return (
    <g className="gn-sparkles" fill={colour}>
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2 - Math.PI / 2;
        return <path key={i} style={nth(i)} d={sparkle(x + Math.cos(a) * spread, y + Math.sin(a) * spread * 0.7, 8 * size)} />;
      })}
    </g>
  );
}

/** A heart at (x, y) that rises while the item plays (a good-night kiss). */
export function Heart({ x, y, size = 1 }: { x: number; y: number; size?: number }) {
  const s = size;
  return (
    <path
      className="gn-heart"
      d={`M${x} ${y + 8 * s} C${x - 14 * s} ${y - 2 * s} ${x - 10 * s} ${y - 14 * s} ${x} ${y - 6 * s} C${x + 10 * s} ${y - 14 * s} ${x + 14 * s} ${y - 2 * s} ${x} ${y + 8 * s} Z`}
      fill="#ff8fa3"
    />
  );
}
