// Drawing colours and parts several games share (the scenes of Lebendige Bilder, the elevator's pictures).

/** The dark outline and detail colour of drawn things. */
export const INK = "#3d405b";
/** A skin tone for drawn people. */
export const SKIN = "#f1c27d";
/** The pink of a drawn cheek. */
export const CHEEK = "#ff8fa3";

/** A white cloud whose left puff is centred on (x, y); tapped or caught by a gust of wind it drifts a little way (`data-poke="drift"`: Lebendige Bilder's spots.tsx moves it, elsewhere the attribute does nothing; the rain cloud's `.cloud-puffs` is styled in the scenes' sky.css). */
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
