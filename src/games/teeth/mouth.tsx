import type { CSSProperties, PointerEvent } from "react";
import { STAR_PATH } from "@/components/Bursts";

// A wide-open mouth in a 400 × 300 box: six teeth on top, six below. The gum
// lines are parabolas, so the teeth follow the curve of the lips.

export type Row = "top" | "bottom";
export type Side = "left" | "right";

export const TEETH_PER_ROW = 6;

const INK = "#2a1e5c";
const TOOTH_XS = Array.from({ length: TEETH_PER_ROW }, (_, i) => 100 + i * 40);
const TOOTH_WIDTH = 34;
const CURVE = 14;
const TOP_GUM = 100;
const BOTTOM_GUM = 200;

const LIPS = "M30 150 C30 30 370 30 370 150 C370 270 30 270 30 150 Z";
const INSIDE = "M52 150 C52 52 348 52 348 150 C348 248 52 248 52 150 Z";

/** How far the gum line has curved away from the middle at `x`. */
const bend = (x: number) => ((x - 200) / 110) ** 2 * CURVE;

/** Where a tooth grows from the gum, which way it points, and how long it is. */
function toothFrame(row: Row, i: number) {
  const x = TOOTH_XS[i];
  const sign = row === "top" ? 1 : -1;
  const gum = row === "top" ? TOP_GUM + bend(x) : BOTTOM_GUM - bend(x);
  // Turn the tooth to stand at right angles to the gum line.
  const slope = (sign * 2 * (x - 200) * CURVE) / 110 ** 2;
  const angle = (Math.atan(slope) * 180) / Math.PI;
  return { x, gum, angle, length: 40 - bend(x) * 0.5, sign };
}

const toothTransform = (row: Row, i: number) => {
  const { x, gum, angle } = toothFrame(row, i);
  return `translate(${x} ${gum}) rotate(${angle})`;
};

/** The gum edge from corner to corner; a quadratic Bézier draws the parabola exactly. */
function gumPath(row: Row) {
  const edge = bend(52);
  if (row === "top") return `M30 30 H370 V${TOP_GUM + edge} H348 Q200 ${TOP_GUM - edge} 52 ${TOP_GUM + edge} H30 Z`;
  return `M30 270 H370 V${BOTTOM_GUM - edge} H348 Q200 ${BOTTOM_GUM + edge} 52 ${BOTTOM_GUM - edge} H30 Z`;
}

/** Which teeth belong to a side of the mouth, as seen on the screen. */
export const sideTeeth = (side: Side) => (side === "left" ? [0, 1, 2] : [3, 4, 5]);

/** The middle of the teeth on that side, where the brush scrubs. */
function brushSpot(row: Row, side: Side) {
  const { x, gum, length, sign } = toothFrame(row, side === "left" ? 1 : 4);
  return { x, y: gum + sign * length * 0.55 };
}

export interface MonsterSpot {
  id: number;
  row: Row;
  tooth: number;
  color: string;
  /** When it popped up during the intro, so they don't all appear at once. */
  delayMs: number;
  gone: boolean;
  tickled: boolean;
}

interface MouthProps {
  monsters: MonsterSpot[];
  /** The part being brushed now, if any. */
  active: { row: Row; side: Side } | null;
  sparkling: boolean;
  onTickle: (id: number) => void;
}

export function Mouth({ monsters, active, sparkling, onTickle }: MouthProps) {
  const brush = active ? brushSpot(active.row, active.side) : brushSpot("top", "left");
  const glow = active ? brushSpot(active.row, active.side) : null;

  return (
    <svg className="mouth" viewBox="22 22 356 256" role="img" aria-label="Ein offener Mund mit Zähnen">
      <defs>
        <clipPath id="mouth-inside">
          <path d={INSIDE} />
        </clipPath>
      </defs>

      <path d={LIPS} fill="#ff7b8a" stroke={INK} strokeWidth={6} />
      <path d={INSIDE} fill="#7a1f3d" stroke={INK} strokeWidth={4} />

      <g clipPath="url(#mouth-inside)">
        <ellipse cx={200} cy={158} rx={64} ry={16} fill="#ff8fa3" />
        {glow && <ellipse className="mouth-glow" cx={glow.x} cy={glow.y} rx={78} ry={36} fill="#ffd23f" />}
        {(["top", "bottom"] as const).map((row) =>
          TOOTH_XS.map((_, i) => <Tooth key={`${row}${i}`} row={row} i={i} />),
        )}
        <path d={gumPath("top")} fill="#ff9eb5" stroke={INK} strokeWidth={3} />
        <path d={gumPath("bottom")} fill="#ff9eb5" stroke={INK} strokeWidth={3} />
      </g>
      <path d={INSIDE} fill="none" stroke={INK} strokeWidth={4} />

      {monsters.map((m) => {
        const { length, sign } = toothFrame(m.row, m.tooth);
        return (
          <g key={m.id} transform={toothTransform(m.row, m.tooth)}>
            <g transform={`translate(0 ${sign * length * 0.55})`}>
              <Monster
                color={m.color}
                gone={m.gone}
                tickled={m.tickled}
                delayMs={m.delayMs}
                onTickle={() => onTickle(m.id)}
              />
            </g>
          </g>
        );
      })}

      {sparkling &&
        (["top", "bottom"] as const).map((row) =>
          TOOTH_XS.map((_, i) => {
            const { length, sign } = toothFrame(row, i);
            return (
              <g key={`${row}${i}`} transform={`${toothTransform(row, i)} translate(${i % 2 ? -4 : -16} ${sign * length * 0.4 - 10}) scale(0.2)`}>
                {/* The animation's transform would replace a transform attribute, so that sits on the group. */}
                <path
                  className="tooth-sparkle"
                  d={STAR_PATH}
                  fill="#ffd23f"
                  stroke={INK}
                  strokeWidth={8}
                  style={{ "--delay": `${(i * 2 + (row === "top" ? 0 : 1)) * 120}ms` } as CSSProperties}
                />
              </g>
            );
          }),
        )}

      <g className={`brush${active ? " shown" : ""}`} style={{ transform: `translate(${brush.x}px, ${brush.y}px)` }}>
        <g transform={`scale(${brush.x < 200 ? -1 : 1} ${active?.row === "bottom" ? -1 : 1})`}>
          <g className="brush-scrub">
            <Toothbrush />
          </g>
        </g>
      </g>
    </svg>
  );
}

function Tooth({ row, i }: { row: Row; i: number }) {
  const { length, sign } = toothFrame(row, i);
  const top = sign > 0 ? -12 : -length;
  return (
    <g transform={toothTransform(row, i)}>
      <rect x={-TOOTH_WIDTH / 2} y={top} width={TOOTH_WIDTH} height={length + 12} rx={11} fill="#fffdf5" stroke={INK} strokeWidth={3} />
      <path d={`M-8 ${sign * 10} q-2 ${sign * 8} 0 ${sign * 16}`} fill="none" stroke="#ffffff" strokeWidth={4} strokeLinecap="round" />
    </g>
  );
}

function Monster({
  color,
  gone,
  tickled,
  delayMs,
  onTickle,
}: {
  color: string;
  gone: boolean;
  tickled: boolean;
  delayMs: number;
  onTickle: () => void;
}) {
  const stop = (e: PointerEvent) => {
    e.stopPropagation();
    if (!gone) onTickle();
  };
  return (
    <g className={`sugar-monster${gone ? " gone" : ""}${tickled ? " tickled" : ""}`} style={{ "--delay": `${delayMs}ms` } as CSSProperties}>
      <g className="monster-body" onPointerDown={stop}>
        <path d="M-9 -12 L-12 -20 L-4 -14 Z M9 -12 L12 -20 L4 -14 Z" fill={color} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
        <path
          d="M-15 8 C-17 -6 -10 -15 0 -15 C10 -15 17 -6 15 8 C12 14 7 11 5 15 C2 11 -2 11 -5 15 C-7 11 -12 14 -15 8 Z"
          fill={color}
          stroke={INK}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <circle cx={-5.5} cy={-4} r={4.2} fill="#fff" stroke={INK} strokeWidth={1.8} />
        <circle cx={5.5} cy={-4} r={4.2} fill="#fff" stroke={INK} strokeWidth={1.8} />
        <circle className="monster-pupil" cx={-4.8} cy={-3.4} r={1.9} fill={INK} />
        <circle className="monster-pupil" cx={6.2} cy={-3.4} r={1.9} fill={INK} />
        <path d="M-6 4 Q0 10 6 4" fill="#7a1f3d" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        <path d="M-3.5 5.6 L-2.2 9 L-0.8 6.6 Z" fill="#fff" />
      </g>
      <g className="monster-puff" fill="#fff" stroke="#bde0fe" strokeWidth={2}>
        <circle cx={-10} cy={-4} r={7} />
        <circle cx={8} cy={-8} r={8} />
        <circle cx={2} cy={7} r={7} />
      </g>
    </g>
  );
}

/** Drawn lying down with the bristles up and the handle to the right; the head sits at the origin. */
function Toothbrush() {
  return (
    <g stroke={INK} strokeLinejoin="round">
      <rect x={26} y={4} width={110} height={16} rx={8} fill="#4cc9f0" strokeWidth={3} />
      <rect x={-38} y={2} width={70} height={14} rx={7} fill="#4cc9f0" strokeWidth={3} />
      <rect x={-34} y={-15} width={58} height={18} rx={3} fill="#fff" strokeWidth={2.5} />
      <path d="M-24 -13 V1 M-14 -13 V1 M-4 -13 V1 M6 -13 V1 M16 -13 V1" stroke="#9fd8f5" strokeWidth={2} />
      <g className="brush-foam" fill="#fff" stroke="#bde0fe" strokeWidth={2}>
        <circle cx={-30} cy={-20} r={6} />
        <circle cx={-12} cy={-24} r={7} />
        <circle cx={8} cy={-21} r={5} />
        <circle cx={22} cy={-25} r={6} />
      </g>
    </g>
  );
}
