// The moving pieces of a marble run's lower wall (a planet that rocks, a swirl that turns, a slat that lifts), each a
// small layer of its own. A world's stretch (`TrackTheme.StretchArt`) is drawn inside the run's two big svgs, as big as
// the whole wall: anything that moved in there had a phone paint that whole svg again in every frame and raster bands
// as wide as the screen round it – the Weltraumbahn's planet, rocking while things circled it, made it stutter on a
// gaming phone (user feedback, 26 November 2026). A `Piece` is drawn in the stretch like the rest, in world units, but
// lands in the run's HTML layer, behind or in front of the rolling things, and a turn is a CSS transform of that small
// layer, which the compositor runs alone.

import { createContext, type ReactNode, useContext, useId } from "react";
import { createPortal } from "react-dom";

/** Seconds since a hit, held at `SETTLED_S`: by then every wobble and flash is over, so a part nobody hit stops changing and `still` can skip it. */
export const SETTLED_S = 8;

/**
 * True while a part hit `age` seconds ago still moves (`until` seconds after its hit, at most `SETTLED_S`, where the
 * run holds every age): the time a `Piece` of it is a layer of its own (see `rest`).
 */
export const stirring = (age: number, until = SETTLED_S) => age >= 0 && age < Math.min(until, SETTLED_S);

/**
 * True while any of a stretch's or row's parts still moves. Parts a thing hits one after the other (a row's bars, a
 * stretch's planks and funnels) are layers all together while this holds: each part going into its layer and back
 * painted the whole wall twice, and a marble rolling over a row did that at every bar (November 2026).
 */
export const anyStirring = (ages: readonly number[], until = SETTLED_S) => ages.some((age) => stirring(age, until));

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

/**
 * A turn of a whole piece round the world point `x`, `y`: `deg` degrees, grown by `scale` (1 if left out), squashed
 * upright by `sy` after turning (a swirl seen at a slant turns inside its ellipse) and moved by `dx`, `dy` world units
 * (a slat lifting, a disc bobbing, a chain running).
 */
export interface PieceTurn {
  deg: number;
  x: number;
  y: number;
  scale?: number;
  sy?: number;
  dx?: number;
  dy?: number;
}

/** The svg transform of a turn, for a piece drawn inline. */
const svgTurn = (t: PieceTurn) =>
  `translate(${t.x + (t.dx ?? 0)} ${t.y + (t.dy ?? 0)}) scale(1 ${t.sy ?? 1}) rotate(${t.deg}) scale(${t.scale ?? 1}) translate(${-t.x} ${-t.y})`;

/** The CSS transform of a turn, `u` pixels to a world unit, round the turn's point as the transform's origin. */
function cssTurn(t: PieceTurn, u: number) {
  const parts: string[] = [];
  if (t.dx || t.dy) parts.push(`translate(${(t.dx ?? 0) * u}px, ${(t.dy ?? 0) * u}px)`);
  if (t.sy !== undefined && t.sy !== 1) parts.push(`scale(1, ${t.sy})`);
  if (t.deg) parts.push(`rotate(${t.deg}deg)`);
  if (t.scale !== undefined && t.scale !== 1) parts.push(`scale(${t.scale})`);
  // Never "none": switching between a transform and none could have the browser drop and rebuild the layer.
  return parts.length ? parts.join(" ") : "translate(0, 0)";
}

/**
 * Part of a stretch drawn as a layer of its own: `children` draw in world units inside `box` (nothing may reach out of
 * it, or it is cut off), behind (`back`) or in front of (`front`) the rolling things. `turn` turns the whole piece by a
 * transform, so a piece that only rocks or spins never paints again: keep what is drawn inside it the same from frame to
 * frame and turn it this way. `clip` cuts it to a box of the world that stays still while the piece turns (the planet's
 * upper half in front of the things on the far side of their orbit, a chain running in its frame). `fade` is the whole
 * piece's opacity (a glow coming and going), another thing the compositor does alone. A piece whose drawing does change
 * from frame to frame (a board bending, drops flying) is still worth it: only its small layer is painted again.
 * `rest` draws it inline in the stretch's svg instead, like the rest of the wall: pass it while the part lies still
 * (`!stirring(age)`). Each layer costs the phone's compositor in every frame, even still and off the screen – the
 * building site's 26 pieces kept its main thread a tenth busier at the top of the run, far from them (November 2026) –,
 * while the wall's svg is painted again only once as a part starts moving and once as it stops.
 */
export function Piece({
  layer,
  box,
  turn,
  clip,
  fade,
  rest,
  children,
}: {
  layer: "back" | "front";
  box: WorldBox;
  turn?: PieceTurn;
  clip?: WorldBox;
  fade?: number;
  rest?: boolean;
  children: ReactNode;
}) {
  const room = useContext(PieceRoom);
  const id = useId();
  const host = room?.[layer];
  if (!room || !host || rest) {
    // Inline in the stretch's svg (at rest, in tests, and the moment before the layer is there).
    const turned = (
      <g transform={turn ? svgTurn(turn) : undefined} opacity={fade}>
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
      style={{
        left: outer.x * u,
        top: (outer.y + room.top) * u,
        width: outer.w * u,
        height: outer.h * u,
        overflow: clip ? "hidden" : "visible",
        opacity: fade,
      }}
    >
      <svg
        className="run-piece-art"
        viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
        style={{
          left: (box.x - outer.x) * u,
          top: (box.y - outer.y) * u,
          width: box.w * u,
          height: box.h * u,
          transform: turn ? cssTurn(turn, u) : undefined,
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
