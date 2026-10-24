import { Face, Inside, SKIN, nth, sparklePath } from "../shared";

// Small parts many drawings of the Weltall scene share.

export const SUIT = "#f8f9fa";
export const SUIT_SHADE = "#dee2e6";
export const VISOR = "#cfe3ff";

/** A five-pointed star around (cx, cy). */
export function starPath(cx: number, cy: number, outer: number, inner = outer * 0.5) {
  const points = Array.from({ length: 10 }, (_, i) => {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 ? inner : outer;
    return `${(cx + r * Math.cos(angle)).toFixed(1)} ${(cy + r * Math.sin(angle)).toFixed(1)}`;
  });
  return `M${points.join(" L")} Z`;
}

export function ellipsePath(cx: number, cy: number, rx: number, ry = rx) {
  return `M${cx - rx} ${cy} a${rx} ${ry} 0 1 0 ${2 * rx} 0 a${rx} ${ry} 0 1 0 ${-2 * rx} 0 Z`;
}

/** Sparkles that only show while the item plays; `className` picks the animation. */
export function Sparkles({ className, spots, r = 12, fill = "#fff" }: { className: string; spots: number[][]; r?: number; fill?: string }) {
  return (
    <g className={className} fill={fill}>
      {spots.map(([x, y], i) => (
        <path key={i} d={sparklePath(x, y, r)} style={nth(i)} />
      ))}
    </g>
  );
}

/** Moon dust that puffs up while the item plays. */
export function Dust({ className, spots, r = 14 }: { className: string; spots: number[][]; r?: number }) {
  return (
    <g className={className} fill="#ececf3">
      {spots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={r} style={nth(i)} />
      ))}
    </g>
  );
}

/** An eyelid over an eye, in the colour around it; it only shows while the item blinks (class wa-lid). */
export function Lid({ cx, cy, r, fill }: { cx: number; cy: number; r: number; fill: string }) {
  return (
    <g className="wa-lid">
      <circle cx={cx} cy={cy} r={r * 1.3} fill={fill} />
      <path
        d={`M${cx - r} ${cy} Q${cx} ${cy + r * 0.9} ${cx + r} ${cy}`}
        stroke="#2b2d42"
        strokeWidth={Math.max(1.4, r * 0.4)}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

/** An astronaut's helmet around (cx, cy): a white shell with a light visor, the face shows through it. */
export function Helmet({ cx, cy, r, hair = "#6b4423" }: { cx: number; cy: number; r: number; hair?: string }) {
  const visor = ellipsePath(cx, cy + r * 0.08, r * 0.74, r * 0.6);
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill={SUIT} />
      <path d={`M${cx - r * 0.87} ${cy + r * 0.5} A${r} ${r} 0 0 0 ${cx + r * 0.87} ${cy + r * 0.5} Z`} fill={SUIT_SHADE} />
      <path d={visor} fill={VISOR} />
      <Inside d={visor}>
        <circle cx={cx} cy={cy + r * 0.2} r={r * 0.5} fill={SKIN} />
        <path
          d={`M${cx - r * 0.52} ${cy + r * 0.1} Q${cx} ${cy - r * 0.5} ${cx + r * 0.52} ${cy + r * 0.1} Q${cx} ${cy - r * 0.12} ${cx - r * 0.52} ${cy + r * 0.1} Z`}
          fill={hair}
        />
        <Face cx={cx} cy={cy + r * 0.16} size={r / 42} />
      </Inside>
      <path d={visor} fill="none" stroke="#adb5bd" strokeWidth={r * 0.08} />
      <path
        d={`M${cx - r * 0.52} ${cy - r * 0.22} Q${cx - r * 0.25} ${cy - r * 0.46} ${cx + r * 0.15} ${cy - r * 0.44}`}
        stroke="#fff"
        strokeWidth={r * 0.1}
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />
    </>
  );
}
