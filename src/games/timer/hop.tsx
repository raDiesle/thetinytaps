import type { CSSProperties, ReactNode } from "react";
import { type Frame, holdToEnd, keyframes } from "./keyframes";
import { Layer } from "./scenes";

// A toy hopping from the floor into its box (Five Boxes, the road rug): one hop in a high arc, as a child tosses it,
// landing smaller where it lies in the box. Three small layers inside each other, each on one keyframe rule written for
// the run: the outer moves it across at an even pace, the middle up and down (rising slower at the top, falling faster,
// as a thrown thing does), the inner makes it smaller from its foot (and straightens one lying askew, `tilt`). While it waits its turn it wiggles a second at a
// time (`wait`), so the picture shows every second that something is about to happen (H-63).

/** One hop: where the toy's foot is before and after (stage units), how big it lies there, and when it goes and lands. */
export interface Hop {
  /** Its foot's middle on the floor. */
  from: { x: number; y: number };
  /** Its foot's middle where it lands. */
  to: { x: number; y: number };
  /** Its size where it lands, as a share of its size on the floor. */
  scale: number;
  /** When it leaves the floor, in ms after the start. */
  start: number;
  /** When it lands. */
  land: number;
  /** How high its foot goes at the top of the arc (a stage y). */
  peak: number;
  /** When it starts waiting its turn, wiggling once a second until it goes; none for a toy that goes at once. */
  waitFrom?: number;
  /** How far it lies askew before it goes (degrees, from its foot), straightened during the hop; none for upright. */
  tilt?: number;
}

/** The three transforms a hop ends on, as percentages of the toy's own box `size`: across, up or down, and its size. */
export function hopEnd(hop: Hop, size: number) {
  return {
    x: `translateX(${(((hop.to.x - hop.from.x) / size) * 100).toFixed(2)}%)`,
    y: `translateY(${(((hop.to.y - hop.from.y) / size) * 100).toFixed(2)}%)`,
    s: `scale(${hop.scale})`,
  };
}

/** The keyframes of one hop, `<name>-x`, `<name>-y` and `<name>-s`, for a run of `total` ms. */
export function hopKeyframes(name: string, total: number, hop: Hop, size: number): string[] {
  const end = hopEnd(hop, size);
  const top = `translateY(${(((hop.peak - hop.from.y) / size) * 100).toFixed(2)}%)`;
  const mid = hop.start + (hop.land - hop.start) * 0.45;
  const across: Frame[] = [
    { at: 0, transform: "translateX(0%)" },
    { at: hop.start, transform: "translateX(0%)", ease: "linear" },
    { at: hop.land, transform: end.x },
  ];
  const upDown: Frame[] = [
    { at: 0, transform: "translateY(0%)" },
    { at: hop.start, transform: "translateY(0%)", ease: "cubic-bezier(0.2, 0.7, 0.4, 1)" },
    { at: mid, transform: top, ease: "cubic-bezier(0.6, 0, 0.8, 0.4)" },
    { at: hop.land, transform: end.y },
  ];
  const lying = hop.tilt ? `scale(1) rotate(${hop.tilt}deg)` : "scale(1)";
  const size_: Frame[] = [
    { at: 0, transform: lying },
    { at: hop.start, transform: lying },
    { at: hop.land, transform: end.s },
  ];
  return [
    keyframes(`${name}-x`, total, holdToEnd(across, total)),
    keyframes(`${name}-y`, total, holdToEnd(upDown, total)),
    keyframes(`${name}-s`, total, holdToEnd(size_, total)),
  ];
}

/**
 * A toy on its hop: a square layer `size` big standing with its foot's middle on `hop.from`, running the keyframes
 * named `name` (`hopKeyframes`). `children` is its drawing; `extra` lies over it unscaled (the light a tap gives).
 */
export function Hopper({
  name,
  hop,
  size,
  children,
  extra,
  artStyle,
}: {
  name: string;
  hop: Hop;
  size: number;
  children: ReactNode;
  extra?: ReactNode;
  artStyle?: CSSProperties;
}) {
  const end = hopEnd(hop, size);
  const waits = hop.waitFrom === undefined ? 0 : Math.floor((hop.start - hop.waitFrom) / 1000);
  return (
    <Layer
      x={hop.from.x - size / 2}
      y={hop.from.y - size}
      w={size}
      h={size}
      className="tm-hop tm-hop-x"
      style={{ "--tm-anim": `${name}-x`, "--tm-end": end.x } as CSSProperties}
    >
      <div className="tm-hop tm-hop-y" style={{ "--tm-anim": `${name}-y`, "--tm-end": end.y } as CSSProperties}>
        <div className="tm-hop tm-hop-s" style={{ "--tm-anim": `${name}-s`, "--tm-end": end.s } as CSSProperties}>
          <div
            className="tm-hop-wait"
            style={{ ...artStyle, ...(waits > 0 && { "--tm-wait": `${hop.waitFrom}ms`, "--tm-waits": waits }) } as CSSProperties}
            data-waits={waits > 0 ? "" : undefined}
          >
            {children}
          </div>
        </div>
      </div>
      {extra && (
        <div className="tm-toy-left" style={{ "--tm-at": `${hop.start}ms` } as CSSProperties}>
          {extra}
        </div>
      )}
    </Layer>
  );
}
