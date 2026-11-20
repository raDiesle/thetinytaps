import type { CSSProperties, ReactNode } from "react";
import type { Box } from "./mouth";

// The pictures before the brushing (the story, the sink) are still pictures with small moving ones on them. Each moving
// part is an HTML layer of its own that its keyframes move as a whole: something animated inside an svg has the phone
// paint that svg again in every frame, and with all of it in one picture the size of the screen the story and the sink
// painted far more than an old phone keeps up with.

/** Picture units on the screen, for the moving pieces of a picture showing `box` at `unit` picture units per px. */
export function pictureSpace(box: Box, unit: number): CSSProperties {
  return { transform: `scale(${(1 / unit).toFixed(5)}) translate(${(-box.x).toFixed(1)}px, ${(-box.y).toFixed(1)}px)` };
}

/**
 * A moving part of a picture in an HTML layer of its own (`.teeth-piece`), so the phone moves a finished picture
 * instead of painting the whole one again: `area` is where it lies in picture units, inside `.teeth-space` (picture
 * units on the screen, `pictureSpace`) or inside the piece `within`, and its svg draws in picture units too, so the
 * drawing, the transform origins and the keyframes stay those of the one picture. `pivot` is the point of the picture
 * it turns and grows round (by default the middle of `area`). `over` goes on top, inside it (pieces moving with it).
 */
export function Piece({
  area,
  within,
  pivot,
  className,
  style,
  over,
  children,
}: {
  area: Box;
  within?: Box;
  pivot?: { x: number; y: number };
  className: string;
  style?: CSSProperties;
  over?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div
      className={`teeth-piece ${className}`}
      style={{
        left: area.x - (within?.x ?? 0),
        top: area.y - (within?.y ?? 0),
        width: area.width,
        height: area.height,
        ...(pivot && { transformOrigin: `${pivot.x - area.x}px ${pivot.y - area.y}px` }),
        ...style,
      }}
    >
      {children && <svg viewBox={`${area.x} ${area.y} ${area.width} ${area.height}`}>{children}</svg>}
      {over}
    </div>
  );
}
