import type { CSSProperties } from "react";
import { Wheel, nth } from "../shared";

// Little drawing helpers of the winter site: snow caps, flakes, sparkles and wheels.

export const SNOW = "#ffffff";
export const SNOW_SHADE = "#dbe7f3";
export const ICE = "#cfeaff";

/** --i for staggering plus any other custom properties (--dx, --dy …) used by the CSS. */
export const vars = (i: number, more: Record<string, string> = {}) => ({ ...nth(i), ...more }) as CSSProperties;

/** A cap of snow lying on a flat top edge from (x, y) to (x + w, y), hanging over a little. */
export function Cap({ x, y, w, h = 7 }: { x: number; y: number; w: number; h?: number }) {
  const d =
    `M${x - 2} ${y + 1} Q${x} ${y - h} ${x + w * 0.3} ${y - h * 0.9} Q${x + w * 0.5} ${y - h * 1.2} ${x + w * 0.72} ${y - h * 0.9} ` +
    `Q${x + w + 1} ${y - h} ${x + w + 2} ${y + 1} Q${x + w * 0.8} ${y + h * 0.55} ${x + w * 0.6} ${y + 1.5} ` +
    `Q${x + w * 0.42} ${y + h * 0.7} ${x + w * 0.25} ${y + 1.5} Q${x + w * 0.1} ${y + h * 0.45} ${x - 2} ${y + 1} Z`;
  return (
    <>
      <path d={d} fill={SNOW_SHADE} transform="translate(0 1.5)" />
      <path d={d} fill={SNOW} />
    </>
  );
}

/** A six-armed snowflake centred on (x, y). */
export function Flake({ x, y, r = 6, colour = SNOW }: { x: number; y: number; r?: number; colour?: string }) {
  const a = r * 0.5;
  const b = r * 0.87;
  return (
    <path
      d={`M${x - r} ${y} H${x + r} M${x - a} ${y - b} L${x + a} ${y + b} M${x + a} ${y - b} L${x - a} ${y + b}`}
      stroke={colour}
      strokeWidth={r * 0.34}
      strokeLinecap="round"
    />
  );
}

/** A four-pointed glint centred on (x, y). */
export const glint = (x: number, y: number, r: number) =>
  `M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r} Z`;

/** A wheel that turns while its vehicle rolls; `className` picks the turning animation. */
export function TurningWheel({ cx, cy, r, className }: { cx: number; cy: number; r?: number; className: string }) {
  return (
    <g className={className} style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <Wheel cx={cx} cy={cy} r={r} />
    </g>
  );
}

/** Mudguard arc over a wheel. */
export const guard = (cx: number, cy: number, r: number) => `M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}`;
