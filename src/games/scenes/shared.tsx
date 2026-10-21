import { useId, type CSSProperties, type ReactNode } from "react";

// Drawing helpers shared by all scenes. Everything is drawn in absolute scene coordinates (1600 × 1000),
// so the transform-origin of an animated part is simply its pivot point in the picture.

export const INK = "#3d405b";
export const STEEL = "#8d99ae";
export const GLASS = "#bde0fe";
export const SAND = "#e9b872";
export const SKIN = "#f1c27d";
export const CHEEK = "#ff8fa3";

/** Sets the --i custom property used to stagger animations. */
export const nth = (i: number) => ({ "--i": i }) as CSSProperties;

/** Sets the --s custom property: 1 or -1, so mirrored parts (left and right claws) can turn the other way. */
export const side = (s: 1 | -1) => ({ "--s": s }) as CSSProperties;

export function Wheel({ cx, cy, r = 28 }: { cx: number; cy: number; r?: number }) {
  const bolt = r * 0.42;
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill="#2b2d42" />
      <path
        d={`M${cx - r * 0.75} ${cy - r * 0.45} A${r * 0.88} ${r * 0.88} 0 0 1 ${cx + r * 0.2} ${cy - r * 0.86}`}
        stroke="#fff"
        strokeOpacity="0.18"
        strokeWidth={r * 0.14}
        strokeLinecap="round"
        fill="none"
      />
      <circle cx={cx} cy={cy} r={r * 0.6} fill="#ced4da" />
      <circle cx={cx} cy={cy} r={r * 0.26} fill={STEEL} />
      {[0, 90, 180, 270].map((a) => (
        <circle key={a} cx={cx + bolt * Math.cos((a * Math.PI) / 180)} cy={cy + bolt * Math.sin((a * Math.PI) / 180)} r={r * 0.07} fill={STEEL} />
      ))}
    </>
  );
}

/** Draws `children` (a driver) only where they show through the window `d`, as if they sat inside behind it. */
export function Inside({ d, children }: { d: string; children: ReactNode }) {
  const id = useId();
  return (
    <>
      <defs>
        <clipPath id={id}>
          <path d={d} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>{children}</g>
    </>
  );
}

/** A window with a soft reflection; `children` sit behind it and are only seen through the glass (e.g. a driver). */
export function Pane({ x, y, w, h, rx = 6, children }: { x: number; y: number; w: number; h: number; rx?: number; children?: ReactNode }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={GLASS} />
      {children && <Inside d={`M${x} ${y} h${w} v${h} h${-w} Z`}>{children}</Inside>}
      <path d={`M${x + w * 0.3} ${y + 3} h${w * 0.18} L${x + w * 0.26} ${y + h - 3} h${-w * 0.18} Z`} fill="#fff" opacity="0.55" />
      <path d={`M${x + w * 0.56} ${y + 3} h${w * 0.07} L${x + w * 0.41} ${y + h - 3} h${-w * 0.07} Z`} fill="#fff" opacity="0.4" />
    </>
  );
}

/** Head and shoulders of someone sitting inside; `cap` draws a cap or helmet instead of hair. */
export function Rider({ cx, cy, shirt, hair = "#6b4423", cap }: { cx: number; cy: number; shirt: string; hair?: string; cap?: string }) {
  return (
    <>
      <rect x={cx - 15} y={cy + 11} width="30" height="22" rx="8" fill={shirt} />
      <circle cx={cx} cy={cy} r="13" fill={SKIN} />
      {cap ? (
        <>
          <path d={`M${cx - 14} ${cy - 4} Q${cx - 14} ${cy - 19} ${cx} ${cy - 19} Q${cx + 14} ${cy - 19} ${cx + 14} ${cy - 4} Z`} fill={cap} />
          <rect x={cx - 16} y={cy - 7} width="32" height="5" rx="2" fill={cap} />
        </>
      ) : (
        <path d={`M${cx - 13} ${cy - 1} Q${cx - 15} ${cy - 16} ${cx} ${cy - 15} Q${cx + 15} ${cy - 16} ${cx + 13} ${cy - 1} Q${cx + 2} ${cy - 10} ${cx - 13} ${cy - 1} Z`} fill={hair} />
      )}
      <circle cx={cx - 4.5} cy={cy + 1} r="1.8" fill="#2b2d42" />
      <circle cx={cx + 4.5} cy={cy + 1} r="1.8" fill="#2b2d42" />
      <path d={`M${cx - 4} ${cy + 6} Q${cx} ${cy + 9} ${cx + 4} ${cy + 6}`} stroke="#2b2d42" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </>
  );
}

/** An animal's eye with a highlight. */
export function Eye({ cx, cy, r = 3.2 }: { cx: number; cy: number; r?: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill="#2b2d42" />
      <circle cx={cx + r * 0.3} cy={cy - r * 0.35} r={r * 0.35} fill="#fff" />
    </>
  );
}

/** A small face: eyes with highlights, rosy cheeks and a smile, centred on (cx, cy). */
export function Face({ cx, cy, size = 1 }: { cx: number; cy: number; size?: number }) {
  const s = size;
  return (
    <>
      <circle cx={cx - 9 * s} cy={cy + 8 * s} r={5 * s} fill={CHEEK} opacity="0.55" />
      <circle cx={cx + 9 * s} cy={cy + 8 * s} r={5 * s} fill={CHEEK} opacity="0.55" />
      <circle cx={cx - 7 * s} cy={cy} r={3.2 * s} fill="#2b2d42" />
      <circle cx={cx + 7 * s} cy={cy} r={3.2 * s} fill="#2b2d42" />
      <circle cx={cx - 6 * s} cy={cy - 1.2 * s} r={1.1 * s} fill="#fff" />
      <circle cx={cx + 8 * s} cy={cy - 1.2 * s} r={1.1 * s} fill="#fff" />
      <path
        d={`M${cx - 6 * s} ${cy + 9 * s} Q${cx} ${cy + 15 * s} ${cx + 6 * s} ${cy + 9 * s}`}
        stroke="#2b2d42"
        strokeWidth={2.6 * s}
        strokeLinecap="round"
        fill="none"
      />
    </>
  );
}

/** A cloud whose left puff is centred on (x, y). */
export function Cloud({ x, y, scale = 1, className }: { x: number; y: number; scale?: number; className?: string }) {
  return (
    <g className={className}>
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <g className="cloud-puffs" fill="#fff">
          <circle cx="0" cy="0" r="38" />
          <circle cx="44" cy="-18" r="48" />
          <circle cx="96" cy="0" r="36" />
          <rect x="0" y="0" width="96" height="36" />
        </g>
        <ellipse cx="48" cy="29" rx="62" ry="7" fill="#dbe9fb" />
        <ellipse cx="30" cy="-30" rx="18" ry="9" fill="#fff" opacity="0.8" />
      </g>
    </g>
  );
}
