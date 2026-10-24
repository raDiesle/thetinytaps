import { Face, SKIN, heartPath, nth, sparklePath } from "../shared";

// Little parts many drawings of this scene share. Their animations are in spielplatz.css
// ("Parts many items share"); lids, notes, puffs, hearts and sparkles are hidden until the item plays.

/** An eyelid in the colour of the skin or fur over an eye at (cx, cy); the eye blinks twice while the item plays. */
export function Lid({ cx, cy, r, fill }: { cx: number; cy: number; r: number; fill: string }) {
  return (
    <g className="sp-lid">
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

export type Hair = "short" | "pigtails" | "bun" | "curly" | "bald";

/**
 * A child's (or grown-up's) head with radius r around (cx, cy): hair, a smiling face and
 * eyelids that blink. `cap` draws a cap in that colour instead of the top of the hair.
 */
export function Head({
  cx,
  cy,
  r = 20,
  hair = "#6b4423",
  style = "short",
  cap,
}: {
  cx: number;
  cy: number;
  r?: number;
  hair?: string;
  style?: Hair;
  cap?: string;
}) {
  const s = r / 20;
  const eye = 7 * (r / 28.6);
  return (
    <>
      {style === "pigtails" && (
        <>
          <circle cx={cx - r * 1.05} cy={cy + r * 0.05} r={r * 0.42} fill={hair} />
          <circle cx={cx + r * 1.05} cy={cy + r * 0.05} r={r * 0.42} fill={hair} />
          <circle cx={cx - r * 0.86} cy={cy - r * 0.2} r={r * 0.14} fill="#ff6b9a" />
          <circle cx={cx + r * 0.86} cy={cy - r * 0.2} r={r * 0.14} fill="#ff6b9a" />
        </>
      )}
      {style === "bun" && <circle cx={cx} cy={cy - r * 1.05} r={r * 0.45} fill={hair} />}
      {style === "curly" &&
        [-0.85, -0.45, 0, 0.45, 0.85].map((dx, i) => <circle key={i} cx={cx + dx * r} cy={cy - r * 0.62 - (i % 2) * r * 0.18} r={r * 0.36} fill={hair} />)}
      <circle cx={cx} cy={cy} r={r} fill={SKIN} />
      <circle cx={cx - r * 0.98} cy={cy + r * 0.12} r={r * 0.2} fill={SKIN} />
      <circle cx={cx + r * 0.98} cy={cy + r * 0.12} r={r * 0.2} fill={SKIN} />
      {style !== "bald" && !cap && (
        <path
          d={`M${cx - r * 0.98} ${cy - r * 0.05} Q${cx - r * 1.05} ${cy - r * 1.1} ${cx} ${cy - r * 1.06} Q${cx + r * 1.05} ${cy - r * 1.1} ${cx + r * 0.98} ${cy - r * 0.05} Q${cx + r * 0.5} ${cy - r * 0.62} ${cx - r * 0.1} ${cy - r * 0.5} Q${cx - r * 0.6} ${cy - r * 0.4} ${cx - r * 0.98} ${cy - r * 0.05} Z`}
          fill={hair}
        />
      )}
      {style === "bald" && (
        <>
          <path
            d={`M${cx - r * 0.98} ${cy + r * 0.1} Q${cx - r} ${cy - r * 0.5} ${cx - r * 0.6} ${cy - r * 0.6}`}
            stroke={hair}
            strokeWidth={r * 0.3}
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M${cx + r * 0.98} ${cy + r * 0.1} Q${cx + r} ${cy - r * 0.5} ${cx + r * 0.6} ${cy - r * 0.6}`}
            stroke={hair}
            strokeWidth={r * 0.3}
            strokeLinecap="round"
            fill="none"
          />
        </>
      )}
      {cap && (
        <>
          <path
            d={`M${cx - r * 0.98} ${cy - r * 0.18} Q${cx - r} ${cy - r * 1.12} ${cx} ${cy - r * 1.1} Q${cx + r} ${cy - r * 1.12} ${cx + r * 0.98} ${cy - r * 0.18} Z`}
            fill={cap}
          />
          <path
            d={`M${cx + r * 0.2} ${cy - r * 0.3} Q${cx + r * 1.2} ${cy - r * 0.42} ${cx + r * 1.5} ${cy - r * 0.1} L${cx + r * 0.6} ${cy - r * 0.06} Z`}
            fill={cap}
          />
          <circle cx={cx} cy={cy - r * 1.08} r={r * 0.12} fill="#fff" opacity="0.7" />
        </>
      )}
      <Face cx={cx} cy={cy - r * 0.05} size={s * 0.7} />
      <Lid cx={cx - eye} cy={cy - r * 0.05} r={2.3 * s} fill={SKIN} />
      <Lid cx={cx + eye} cy={cy - r * 0.05} r={2.3 * s} fill={SKIN} />
    </>
  );
}

/** Little floating words or notes, e.g. "Hui!", shown one after the other while the item plays. */
export function Notes({ x, y, texts, colour = "#fff", size = 26 }: { x: number; y: number; texts: string[]; colour?: string; size?: number }) {
  return (
    <g
      className="sp-notes"
      fill={colour}
      fontSize={size}
      fontWeight="800"
      fontFamily="system-ui, sans-serif"
      stroke="#2b2d42"
      strokeWidth={size / 8}
      paintOrder="stroke"
    >
      {texts.map((text, i) => (
        <text key={i} x={x + i * size * 0.9} y={y - i * size * 0.6} style={nth(i)}>
          {text}
        </text>
      ))}
    </g>
  );
}

/** Round puffs (dust, sand, water) at the given spots; `className` picks the animation. */
export function Puffs({ className, spots, r = 12, fill = "#fff" }: { className: string; spots: number[][]; r?: number; fill?: string }) {
  return (
    <g className={className} fill={fill}>
      {spots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={r} style={nth(i)} />
      ))}
    </g>
  );
}

/** Sparkles that pop up while the item plays. */
export function Sparkles({ className, spots, r = 12, fill = "#fff" }: { className: string; spots: number[][]; r?: number; fill?: string }) {
  return (
    <g className={className} fill={fill}>
      {spots.map(([x, y], i) => (
        <path key={i} d={sparklePath(x, y, r)} style={nth(i)} />
      ))}
    </g>
  );
}

/** Little hearts that float up while the item plays. */
export function Hearts({ className, spots, r = 10, fill = "#ff6b9a" }: { className: string; spots: number[][]; r?: number; fill?: string }) {
  return (
    <g className={className} fill={fill}>
      {spots.map(([x, y], i) => (
        <path key={i} d={heartPath(x, y, r)} style={nth(i)} />
      ))}
    </g>
  );
}

/** A leg in trousers from the hip (x1, y1) to the foot (x2, y2), with a shoe. */
export function Leg({
  x1,
  y1,
  x2,
  y2,
  trousers,
  shoe = "#e63946",
  w = 11,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  trousers: string;
  shoe?: string;
  w?: number;
}) {
  return (
    <>
      <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={trousers} strokeWidth={w} strokeLinecap="round" />
      <ellipse cx={x2 + w * 0.3} cy={y2 + w * 0.2} rx={w * 0.75} ry={w * 0.5} fill={shoe} />
    </>
  );
}

/** An arm in a sleeve from the shoulder (x1, y1) to the hand (x2, y2). */
export function Arm({ x1, y1, x2, y2, sleeve, w = 10 }: { x1: number; y1: number; x2: number; y2: number; sleeve: string; w?: number }) {
  return (
    <>
      <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={sleeve} strokeWidth={w} strokeLinecap="round" />
      <circle cx={x2} cy={y2} r={w * 0.55} fill={SKIN} />
    </>
  );
}
