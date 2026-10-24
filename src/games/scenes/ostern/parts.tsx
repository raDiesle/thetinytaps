import { Inside, heartPath, nth } from "../shared";

// Little parts many drawings of the Easter picture share: painted eggs and grass blades.
// Heads, arms, legs, eyelids, words, puffs and sparkles come from ../spielplatz/parts.

/** An egg standing on (cx, by), w wide and h tall: narrow at the top, round at the bottom. */
export function eggPath(cx: number, by: number, w: number, h: number) {
  const r = w / 2;
  return [
    `M${cx} ${by - h}`,
    `C${cx + 0.8 * r} ${by - h} ${cx + 1.07 * r} ${by - 0.53 * h} ${cx + r} ${by - 0.34 * h}`,
    `C${cx + 0.93 * r} ${by - 0.1 * h} ${cx + 0.5 * r} ${by} ${cx} ${by}`,
    `C${cx - 0.5 * r} ${by} ${cx - 0.93 * r} ${by - 0.1 * h} ${cx - r} ${by - 0.34 * h}`,
    `C${cx - 1.07 * r} ${by - 0.53 * h} ${cx - 0.8 * r} ${by - h} ${cx} ${by - h} Z`,
  ].join(" ");
}

export type EggPattern = "zigzag" | "dots" | "stripes" | "waves" | "hearts" | "plain";

/** A painted Easter egg standing on (cx, by), with a pattern in `deco` clipped to its shape. */
export function Egg({
  cx,
  by,
  w,
  h,
  fill,
  deco = "#fff",
  pattern = "plain",
}: {
  cx: number;
  by: number;
  w: number;
  h: number;
  fill: string;
  deco?: string;
  pattern?: EggPattern;
}) {
  const d = eggPath(cx, by, w, h);
  const top = by - h;
  const x0 = cx - w / 2;
  const sw = Math.max(2, w * 0.1);
  const zig = (y: number) =>
    `M${x0 - 4} ${y} ` + Array.from({ length: 6 }, (_, i) => `L${x0 + ((i + 0.5) * w) / 6} ${y + (i % 2 ? sw : -sw) * 1.4}`).join(" ") + ` L${x0 + w + 4} ${y}`;
  const wave = (y: number) => `M${x0 - 4} ${y} q${w / 8} ${-sw * 1.6} ${w / 4} 0 t${w / 4} 0 t${w / 4} 0 t${w / 4} 0 t${w / 4} 0`;
  return (
    <>
      <path d={d} fill={fill} />
      <Inside d={d}>
        {pattern === "zigzag" && <path d={`${zig(top + h * 0.38)} ${zig(top + h * 0.68)}`} stroke={deco} strokeWidth={sw} strokeLinejoin="round" fill="none" />}
        {pattern === "waves" && <path d={`${wave(top + h * 0.34)} ${wave(top + h * 0.62)}`} stroke={deco} strokeWidth={sw} fill="none" />}
        {pattern === "stripes" && (
          <>
            <rect x={x0} y={top + h * 0.3} width={w} height={h * 0.12} fill={deco} />
            <rect x={x0} y={top + h * 0.56} width={w} height={h * 0.12} fill={deco} />
            <rect x={x0} y={top + h * 0.47} width={w} height={h * 0.04} fill={deco} opacity="0.7" />
          </>
        )}
        {pattern === "dots" &&
          [
            [0, 0.2],
            [-0.26, 0.42],
            [0.24, 0.4],
            [0, 0.6],
            [-0.3, 0.74],
            [0.3, 0.76],
            [0, 0.9],
          ].map(([dx, dy], i) => <circle key={i} cx={cx + dx * w} cy={top + dy * h} r={w * 0.09} fill={deco} />)}
        {pattern === "hearts" &&
          [
            [-0.2, 0.36],
            [0.22, 0.52],
            [-0.12, 0.76],
          ].map(([dx, dy], i) => <path key={i} d={heartPath(cx + dx * w, top + dy * h, w * 0.12)} fill={deco} />)}
        {/* Darker bottom for volume */}
        <ellipse cx={cx + w * 0.12} cy={by + h * 0.04} rx={w * 0.6} ry={h * 0.22} fill="#2b2d42" opacity="0.12" />
      </Inside>
      <path
        d={`M${cx - w * 0.22} ${top + h * 0.16} Q${cx - w * 0.36} ${top + h * 0.32} ${cx - w * 0.36} ${top + h * 0.48}`}
        stroke="#fff"
        strokeOpacity="0.6"
        strokeWidth={Math.max(2, w * 0.1)}
        strokeLinecap="round"
        fill="none"
      />
    </>
  );
}

/** Pointed grass blades standing on y = 0 at the given x positions. */
export function Blades({ xs, shade, height = 36 }: { xs: number[]; shade: string; height?: number }) {
  const k = height / 36;
  return (
    <>
      {xs.map((x, i) => (
        <path
          key={x}
          d={`M${x - 6 * k} 0 Q${x - 2 * k} ${(-24 - (i % 3) * 8) * k} ${x + (i % 2 ? 8 : -6) * k} ${(-36 - (i % 3) * 8) * k} Q${x + 2 * k} ${-18 * k} ${x + 6 * k} 0 Z`}
          fill={shade}
        />
      ))}
    </>
  );
}

/** A little five-petal flower (primrose, daisy) centred on (x, y). */
export function Blossom({ x, y, r, fill, centre = "#ffd43b", className, i }: { x: number; y: number; r: number; fill: string; centre?: string; className?: string; i?: number }) {
  return (
    <g className={className} style={i === undefined ? undefined : nth(i)}>
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx={x} cy={y - r * 0.62} r={r * 0.52} fill={fill} transform={`rotate(${a} ${x} ${y})`} />
      ))}
      <circle cx={x} cy={y} r={r * 0.36} fill={centre} />
    </g>
  );
}
