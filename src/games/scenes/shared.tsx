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

/** The app's mascots as they turn up among the people of the pictures. */
export type Mascot = "fox" | "bear";

/** Head and shoulders of someone sitting inside; `cap` draws a cap or helmet instead of hair. */
export function Rider({
  cx,
  cy,
  shirt,
  hair = "#6b4423",
  cap,
  animal,
  child = false,
}: {
  cx: number;
  cy: number;
  shirt: string;
  hair?: string;
  cap?: string;
  /** A fox or a bear instead of a person: the mascots come back in every picture as drivers and passengers. */
  animal?: Mascot;
  /** Smaller and sitting lower, a child beside its grown-up. */
  child?: boolean;
}) {
  if (child) {
    return (
      <g transform={`translate(${cx} ${cy + 7}) scale(0.78) translate(${-cx} ${-cy})`}>
        <Rider cx={cx} cy={cy} shirt={shirt} hair={hair} cap={cap} animal={animal} />
      </g>
    );
  }
  if (animal) return <MascotRider cx={cx} cy={cy} shirt={shirt} cap={cap} animal={animal} />;
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
        <path
          d={`M${cx - 13} ${cy - 1} Q${cx - 15} ${cy - 16} ${cx} ${cy - 15} Q${cx + 15} ${cy - 16} ${cx + 13} ${cy - 1} Q${cx + 2} ${cy - 10} ${cx - 13} ${cy - 1} Z`}
          fill={hair}
        />
      )}
      <circle cx={cx - 4.5} cy={cy + 1} r="1.8" fill="#2b2d42" />
      <circle cx={cx + 4.5} cy={cy + 1} r="1.8" fill="#2b2d42" />
      <path d={`M${cx - 4} ${cy + 6} Q${cx} ${cy + 9} ${cx + 4} ${cy + 6}`} stroke="#2b2d42" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </>
  );
}

const FOX_FUR = "#e8743b";
const BEAR_FUR = "#a0663a";

/** A fox or bear rider, the same size as a person's head so it fits every window; a cap sits small between the ears. */
function MascotRider({ cx, cy, shirt, cap, animal }: { cx: number; cy: number; shirt: string; cap?: string; animal: Mascot }) {
  const fox = animal === "fox";
  const fur = fox ? FOX_FUR : BEAR_FUR;
  // The head is drawn in a 100 × 100 box like the fox and bear heads elsewhere, then scaled to a person's head.
  const head = `translate(${cx - 19} ${cy - 21.5}) scale(0.38)`;
  return (
    <>
      <rect x={cx - 15} y={cy + 11} width="30" height="22" rx="8" fill={shirt} />
      <g transform={head}>
        {fox ? (
          <>
            <path fill={fur} d="M17 50 L21 9 L45 29 Z M83 50 L79 9 L55 29 Z" />
            <path fill="#f7c9a8" d="M24 39 L26 18 L38 30 Z M76 39 L74 18 L62 30 Z" />
            <path fill={fur} d="M13 52 C13 31 31 24 50 24 C69 24 87 31 87 52 C87 72 69 90 50 92 C31 90 13 72 13 52 Z" />
            <path fill="#fff6ec" d="M21 61 C33 58 44 63 50 73 C56 63 67 58 79 61 C75 78 63 90 50 92 C37 90 25 78 21 61 Z" />
          </>
        ) : (
          <>
            <circle fill={fur} cx="22" cy="32" r="12" />
            <circle fill={fur} cx="78" cy="32" r="12" />
            <circle fill="#e3b98a" cx="22" cy="32" r="6" />
            <circle fill="#e3b98a" cx="78" cy="32" r="6" />
            <circle fill={fur} cx="50" cy="57" r="35" />
            <ellipse fill="#e3b98a" cx="50" cy="72" rx="16" ry="12" />
          </>
        )}
        {cap && (
          <>
            <path fill={cap} d="M27 38 C27 12 73 12 73 38 Z" />
            <path fill={cap} d="M22 40 Q50 31 78 40 Q50 46 22 40 Z" />
          </>
        )}
        <circle fill="#2b2d42" cx="37" cy="53" r="4.6" />
        <circle fill="#2b2d42" cx="63" cy="53" r="4.6" />
        <circle fill="#fff" cx="38.5" cy="51.5" r="1.4" />
        <circle fill="#fff" cx="64.5" cy="51.5" r="1.4" />
        <ellipse fill="#2b2d42" cx="50" cy={fox ? 72 : 66} rx="5.4" ry="3.8" />
        <path
          d={fox ? "M50 76 V79 M45 81 Q50 84 55 81" : "M50 70 V74 M44 76 Q50 80 56 76"}
          fill="none"
          stroke="#2b2d42"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </g>
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
/** A white cloud; tapped or caught by a gust of wind it drifts a little way (`data-poke`, see spots.tsx). */
export function Cloud({ x, y, scale = 1, className }: { x: number; y: number; scale?: number; className?: string }) {
  return (
    <g className={className} data-poke="drift">
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

/** A four-pointed sparkle centred on (x, y). */
export function sparklePath(x: number, y: number, r: number) {
  return `M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r} Z`;
}

/** A little heart with its middle at (x, y). */
export function heartPath(x: number, y: number, r: number) {
  return `M${x} ${y + r * 0.9} C${x - r * 1.6} ${y - r * 0.2} ${x - r * 0.6} ${y - r * 1.3} ${x} ${y - r * 0.4} C${x + r * 0.6} ${y - r * 1.3} ${x + r * 1.6} ${y - r * 0.2} ${x} ${y + r * 0.9} Z`;
}
