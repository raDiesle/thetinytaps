import type { CSSProperties } from "react";
import { CHEEK, nth } from "../shared";

// Little parts many drawings of this scene share. Their animations are in dinotal.css
// ("Parts many items share"); lids, lines and notes are hidden until the item plays.

const PUPIL = "#2b2d42";

/**
 * A big friendly eye: white, a dark pupil with two highlights, and a lid in the colour
 * of the skin that blinks twice while the item plays. `look` moves the pupil (-1 left, 1 right).
 */
export function DinoEye({ cx, cy, r, skin, look = 0 }: { cx: number; cy: number; r: number; skin: string; look?: number }) {
  const px = cx + look * r * 0.22;
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill="#fff" />
      <circle cx={px} cy={cy + r * 0.08} r={r * 0.62} fill={PUPIL} />
      <circle cx={px + r * 0.22} cy={cy - r * 0.2} r={r * 0.24} fill="#fff" />
      <circle cx={px - r * 0.2} cy={cy + r * 0.28} r={r * 0.1} fill="#fff" />
      <g className="dt-lid">
        <circle cx={cx} cy={cy} r={r * 1.12} fill={skin} />
        <path d={`M${cx - r * 0.8} ${cy} Q${cx} ${cy + r * 0.7} ${cx + r * 0.8} ${cy}`} stroke={PUPIL} strokeWidth={Math.max(1.4, r * 0.28)} strokeLinecap="round" fill="none" />
      </g>
    </>
  );
}

/** A rosy cheek. */
export function Cheek({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.7} fill={CHEEK} opacity="0.55" />;
}

/** A smile from (x, y), `w` wide, curving down by `d`. */
export function Smile({ x, y, w, d = w * 0.35, width = 3 }: { x: number; y: number; w: number; d?: number; width?: number }) {
  return <path d={`M${x} ${y} Q${x + w / 2} ${y + d * 2} ${x + w} ${y}`} stroke={PUPIL} strokeWidth={width} strokeLinecap="round" fill="none" />;
}

/** Two sound lines in front of a mouth at (x, y), opening to the right (dir 1) or left (-1). */
export function Lines({ x, y, dir = 1, colour = "#fff", size = 1 }: { x: number; y: number; dir?: 1 | -1; colour?: string; size?: number }) {
  const s = size;
  return (
    <g className="dt-lines" fill="none" stroke={colour} strokeWidth={4 * s} strokeLinecap="round">
      <path d={`M${x} ${y - 9 * s} q${7 * s * dir} ${9 * s} 0 ${18 * s}`} style={nth(0)} />
      <path d={`M${x + 11 * s * dir} ${y - 15 * s} q${11 * s * dir} ${15 * s} 0 ${30 * s}`} style={nth(1)} />
    </g>
  );
}

/**
 * Words that float up one after the other while the item plays ("Tröt!", "Hatschi!").
 * `delays` (seconds) times each word; by default one every half second.
 */
export function Notes({
  x,
  y,
  texts,
  colour = "#fff",
  size = 22,
  delays,
  className,
}: {
  x: number;
  y: number;
  texts: string[];
  colour?: string;
  size?: number;
  delays?: number[];
  className?: string;
}) {
  return (
    <g
      className={`dt-notes${className ? ` ${className}` : ""}`}
      fill={colour}
      fontSize={size}
      fontWeight="800"
      fontFamily="system-ui, sans-serif"
      stroke="#2b2d42"
      strokeWidth={size / 8}
      paintOrder="stroke"
    >
      {texts.map((text, i) => (
        <text key={i} x={x + i * size * 0.9} y={y - i * size * 0.6} style={{ "--d": `${delays?.[i] ?? 0.3 + i * 0.5}s` } as CSSProperties}>
          {text}
        </text>
      ))}
    </g>
  );
}

/** A little round cloud of three circles centred on (x, y), for smoke, breath and dust. */
export function Puff({ x, y, r, fill = "#fff", className, i = 0 }: { x: number; y: number; r: number; fill?: string; className: string; i?: number }) {
  return (
    <g className={className} style={nth(i)} fill={fill}>
      <circle cx={x - r * 0.7} cy={y + r * 0.15} r={r * 0.7} />
      <circle cx={x} cy={y - r * 0.2} r={r} />
      <circle cx={x + r * 0.75} cy={y + r * 0.2} r={r * 0.65} />
    </g>
  );
}

/** A small round leaf, pointing up from (x, y). */
export function leafPath(x: number, y: number, w: number, h: number) {
  return `M${x} ${y} C${x - w} ${y - h * 0.3} ${x - w * 0.6} ${y - h} ${x} ${y - h} C${x + w * 0.6} ${y - h} ${x + w} ${y - h * 0.3} ${x} ${y} Z`;
}
