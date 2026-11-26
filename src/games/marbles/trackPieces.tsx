// The moving pieces of a marble run's lower wall (a planet that rocks, a swirl that turns, a slat that lifts), each a
// small layer of its own. A world's stretch (`TrackTheme.StretchArt`) is drawn inside the run's two big svgs, as big as
// the whole wall: anything that moved in there had a phone paint that whole svg again in every frame and raster bands
// as wide as the screen round it – the Weltraumbahn's planet, rocking while things circled it, made it stutter on a
// gaming phone (user feedback, 26 November 2026). A `Piece` is drawn in the stretch like the rest, in world units, but
// lands in the run's HTML layer, behind or in front of the rolling things, and a turn is a CSS transform of that small
// layer, which the compositor runs alone.

import { createContext, type ReactNode, useContext, useId } from "react";
import { createPortal } from "react-dom";

/** A box of the world, in its units. */
export interface WorldBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Where a run's pieces go: its two hosts in the HTML layer and how the layer maps the world. */
export interface PieceRoomValue {
  /** Behind the rolling things. */
  back: HTMLElement | null;
  /** In front of the rolling things. */
  front: HTMLElement | null;
  /** How many pixels one world unit is in the layer. */
  unit: number;
  /** How far above the wall's top the layer begins, in world units (the run's `TOP_ROOM`). */
  top: number;
}

/** The run's room for pieces (`Run` in `TrackLevel.tsx`); without it a piece is drawn inline in the svg. */
export const PieceRoom = createContext<PieceRoomValue | null>(null);

/** A turn of a whole piece: `deg` degrees round the world point `x`, `y`, and grown by `scale` round it (1 if left out). */
export interface PieceTurn {
  deg: number;
  x: number;
  y: number;
  scale?: number;
}

/**
 * Part of a stretch drawn as a layer of its own: `children` draw in world units inside `box` (nothing may reach out of
 * it, or it is cut off), behind (`back`) or in front of (`front`) the rolling things. `turn` turns the whole piece by a
 * transform, so a piece that only rocks or spins never paints again: keep what is drawn inside it the same from frame to
 * frame and turn it this way. `clip` cuts it to a box of the world that stays still while the piece turns (the planet's
 * upper half in front of the things on the far side of their orbit).
 */
export function Piece({
  layer,
  box,
  turn,
  clip,
  children,
}: {
  layer: "back" | "front";
  box: WorldBox;
  turn?: PieceTurn;
  clip?: WorldBox;
  children: ReactNode;
}) {
  const room = useContext(PieceRoom);
  const id = useId();
  const host = room?.[layer];
  if (!room || !host) {
    // Inline in the stretch's svg (tests, and the moment before the layer is there).
    const turned = (
      <g transform={turn ? `translate(${turn.x} ${turn.y}) rotate(${turn.deg}) scale(${turn.scale ?? 1}) translate(${-turn.x} ${-turn.y})` : undefined}>
        {children}
      </g>
    );
    if (!clip) return turned;
    return (
      <g>
        <defs>
          <clipPath id={`${id}clip`}>
            <rect x={clip.x} y={clip.y} width={clip.w} height={clip.h} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${id}clip)`}>{turned}</g>
      </g>
    );
  }
  const u = room.unit;
  const outer = clip ?? box;
  return createPortal(
    <div
      className="run-piece"
      style={{ left: outer.x * u, top: (outer.y + room.top) * u, width: outer.w * u, height: outer.h * u, overflow: clip ? "hidden" : "visible" }}
    >
      <svg
        className="run-piece-art"
        viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
        style={{
          left: (box.x - outer.x) * u,
          top: (box.y - outer.y) * u,
          width: box.w * u,
          height: box.h * u,
          transform: turn ? `rotate(${turn.deg}deg)${turn.scale !== undefined && turn.scale !== 1 ? ` scale(${turn.scale})` : ""}` : undefined,
          transformOrigin: turn ? `${(turn.x - box.x) * u}px ${(turn.y - box.y) * u}px` : undefined,
        }}
        aria-hidden
      >
        {children}
      </svg>
    </div>,
    host,
  );
}
