import type { CSSProperties, ReactNode } from "react";
import { CHEEK, Face, SKIN, Wheel, nth } from "../shared";

// Small parts used by several drawings of the airport and the station.

export const NAVY = "#1d3557";
export const SIGNAL_ORANGE = "#ff8c42";
export const VEST = "#ffb703";
export const RAIL_RED = "#e63946";

/** A wheel that turns while its vehicle plays (class fh-wheel). */
export function TurningWheel({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g className="fh-wheel" style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <Wheel cx={cx} cy={cy} r={r} />
    </g>
  );
}

/** Mudguard arc over a wheel. */
export const guard = (cx: number, cy: number, r: number) => `M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}`;

/** Sound lines next to a horn or a whistle, shown while it sounds. */
export function Toot({ x, y, dir = 1, className, colour = "#ffd60a" }: { x: number; y: number; dir?: 1 | -1; className: string; colour?: string }) {
  return (
    <g className={className} fill="none" stroke={colour} strokeWidth="4" strokeLinecap="round">
      <path d={`M${x} ${y - 10} q${8 * dir} 10 0 20`} style={nth(0)} />
      <path d={`M${x + 12 * dir} ${y - 16} q${12 * dir} 16 0 32`} style={nth(1)} />
    </g>
  );
}

/** An orange beacon on a roof, with its glow (classes fh-<name>-glow and fh-<name>-light). */
export function Beacon({ x, y, name, colour = SIGNAL_ORANGE }: { x: number; y: number; name: string; colour?: string }) {
  return (
    <>
      <ellipse className={`fh-${name}-glow`} cx={x} cy={y - 6} rx="30" ry="16" fill={colour} />
      <rect x={x - 10} y={y - 14} width="20" height="14" rx="5" fill={colour} />
      <rect className={`fh-${name}-light`} x={x - 10} y={y - 14} width="20" height="14" rx="5" fill="#fff3b0" />
      <rect x={x - 14} y={y - 2} width="28" height="5" rx="2" fill="#495057" />
    </>
  );
}

/** Two legs with shoes, the hips at y = -hip. */
export function Legs({ colour, hip = 80, shoe = "#2b2d42" }: { colour: string; hip?: number; shoe?: string }) {
  return (
    <>
      <rect x="-19" y={-hip} width="16" height={hip - 8} rx="6" fill={colour} />
      <rect x="3" y={-hip} width="16" height={hip - 8} rx="6" fill={colour} />
      <path d="M-24 0 v-8 q0 -6 6 -6 h14 v14 Z M3 0 v-14 h14 q8 0 9 7 v7 Z" fill={shoe} />
    </>
  );
}

/** A round head with a friendly face; `children` (a cap, a hat) are drawn on top. */
export function Head({ cx, cy, r = 22, hair, children }: { cx: number; cy: number; r?: number; hair?: string; children?: ReactNode }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill={SKIN} />
      {hair && (
        <path
          d={`M${cx - r} ${cy - 2} Q${cx - r - 2} ${cy - r - 4} ${cx} ${cy - r} Q${cx + r + 2} ${cy - r - 4} ${cx + r} ${cy - 2} Q${cx + 4} ${cy - r * 0.55} ${cx - r} ${cy - 2} Z`}
          fill={hair}
        />
      )}
      <Face cx={cx} cy={cy + 1} size={r / 26} />
      {children}
    </>
  );
}

/** A hand at the end of an arm. */
export const Hand = ({ cx, cy, r = 8 }: { cx: number; cy: number; r?: number }) => <circle cx={cx} cy={cy} r={r} fill={SKIN} />;

/** Rosy puffed cheeks, shown while someone blows a whistle. */
export function PuffCheeks({ cx, cy, className }: { cx: number; cy: number; className: string }) {
  return (
    <g className={className} fill={CHEEK}>
      <circle cx={cx - 11} cy={cy} r="7" />
      <circle cx={cx + 11} cy={cy} r="7" />
    </g>
  );
}

/** A suitcase standing upright, with a handle on top; (x, y) is its top left corner. */
export function Suitcase({
  x,
  y,
  w,
  h,
  colour,
  className,
  style,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  colour: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <g className={className} style={style}>
      <path d={`M${x + w * 0.35} ${y} v-8 h${w * 0.3} v8`} stroke="#495057" strokeWidth="4" fill="none" />
      <rect x={x} y={y} width={w} height={h} rx="6" fill={colour} />
      <rect x={x} y={y + h - 6} width={w} height="6" rx="3" fill="#000" opacity="0.15" />
      <path d={`M${x + w * 0.3} ${y + 4} V${y + h - 4} M${x + w * 0.7} ${y + 4} V${y + h - 4}`} stroke="#fff" strokeOpacity="0.45" strokeWidth="3" />
    </g>
  );
}
