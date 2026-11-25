import type { ReactNode } from "react";
import type { Theme } from "./catalog";
import { DECOR_MM, type PosterDecor } from "./poster";

// The drawn decoration round a photo poster (T-33, T-40): a frame in the band of `DECOR_MM` along the poster's edge,
// drawn in the poster's layout millimetres so its motifs keep their shape on every format (a panorama gets more of
// them, never wider ones). Still, like everything on paper; the sheet itself stays exactly as on A4 inside it.

/** Centres of `n` motifs spread evenly along a length, at least `gap` apart, starting half a gap in. */
function along(length: number, gap: number): number[] {
  const n = Math.max(1, Math.floor(length / gap));
  const step = length / n;
  return Array.from({ length: n }, (_, i) => step * (i + 0.5));
}

/** Every motif's place round the frame, its edge, and its number (to vary colours and turns without randomness). */
function round(width: number, height: number, gap: number): { x: number; y: number; edge: "top" | "bottom" | "left" | "right"; i: number }[] {
  const d = DECOR_MM / 2;
  let i = 0;
  return [
    ...along(width, gap).map((x) => ({ x, y: d, edge: "top" as const, i: i++ })),
    ...along(width, gap).map((x) => ({ x, y: height - d, edge: "bottom" as const, i: i++ })),
    ...along(height - 2 * DECOR_MM, gap).map((y) => ({ x: d, y: y + DECOR_MM, edge: "left" as const, i: i++ })),
    ...along(height - 2 * DECOR_MM, gap).map((y) => ({ x: width - d, y: y + DECOR_MM, edge: "right" as const, i: i++ })),
  ];
}

/** Bright colours for pennants, eggs and balloons, the theme's own first. */
const party = (theme: Theme) => [theme.main, "#ff8fab", "#7cc8f2", "#ffd23f", "#9bd77a", "#b3a8ff"];

/** A garland of pennants hanging from a string across the top, sagging a little between its ends. */
function Pennants({ width, colors, y = 1.5 }: { width: number; colors: string[]; y?: number }) {
  const flags = along(width - 8, 9);
  const sag = (x: number) => y + 2.2 * Math.sin((Math.PI * x) / (width - 8));
  return (
    <g>
      <path d={`M2 ${y} Q ${width / 2} ${y + 5} ${width - 2} ${y}`} fill="none" stroke="#7a5b3a" strokeWidth="0.5" />
      {flags.map((x, i) => {
        const top = sag(x + 4);
        return (
          <path key={x} d={`M${x} ${top} L${x + 8} ${top} L${x + 4} ${top + 9} Z`} fill={colors[i % colors.length]} stroke="#00000022" strokeWidth="0.3" />
        );
      })}
    </g>
  );
}

/** A leaf turned by `turn` degrees: a pointed oval with its vein. */
function Leaf({ x, y, turn, color, size = 1 }: { x: number; y: number; turn: number; color: string; size?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${turn}) scale(${size})`}>
      <path d="M0 -5 C3.5 -2.5 3.5 2.5 0 5 C-3.5 2.5 -3.5 -2.5 0 -5 Z" fill={color} />
      <path d="M0 -4.2 L0 4.6" stroke="#00000030" strokeWidth="0.35" />
    </g>
  );
}

/** A maple-ish autumn leaf: five points round a stalk. */
function MapleLeaf({ x, y, turn, color }: { x: number; y: number; turn: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${turn})`}>
      <path
        d="M0 -5.5 L1.4 -2.4 L4.6 -3.4 L3.2 -0.4 L5.4 1 L2 1.6 L2.4 4 L0 2.8 L-2.4 4 L-2 1.6 L-5.4 1 L-3.2 -0.4 L-4.6 -3.4 L-1.4 -2.4 Z"
        fill={color}
        stroke="#00000022"
        strokeWidth="0.25"
        strokeLinejoin="round"
      />
      <path d="M0 2.8 L0 6" stroke="#7a4b20" strokeWidth="0.45" strokeLinecap="round" />
    </g>
  );
}

/** A soft cloud of three puffs. */
function Cloud({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`} fill="#fff" stroke="#9cc7e6" strokeWidth="0.45">
      <path d="M-7 2 C-9 2 -9 -1.5 -6.5 -1.5 C-6 -4.5 -2 -5 -1 -2.6 C0 -5.6 5 -5 5 -1.6 C8 -1.8 8.6 2 6 2 Z" />
    </g>
  );
}

/** An Easter egg with a stripe and dots. */
function Egg({ x, y, color, turn }: { x: number; y: number; color: string; turn: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${turn})`}>
      <ellipse rx="3.4" ry="4.4" fill={color} stroke="#00000026" strokeWidth="0.3" />
      <path d="M-3.3 0 Q 0 1.4 3.3 0" fill="none" stroke="#ffffffcc" strokeWidth="0.8" />
      <circle cx="-1.2" cy="-2.2" r="0.5" fill="#ffffffcc" />
      <circle cx="1.3" cy="2.3" r="0.5" fill="#ffffffcc" />
    </g>
  );
}

/** A snowflake of three crossed lines with small twigs. */
function Snowflake({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`} stroke="#8fb8de" strokeWidth="0.55" strokeLinecap="round">
      {[0, 60, 120].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path d="M0 -4 L0 4 M-1.2 -3 L0 -2 L1.2 -3 M-1.2 3 L0 2 L1.2 3" fill="none" />
        </g>
      ))}
    </g>
  );
}

/** A string of fairy lights across the top, each bulb in its own colour. */
function FairyLights({ width }: { width: number }) {
  const bulbs = along(width - 6, 7);
  const sag = (x: number) => 3 + 2.5 * Math.sin((Math.PI * x) / (width - 6));
  const colors = ["#ffd23f", "#ff6b6b", "#7cc8f2", "#9bd77a", "#ffa8cc"];
  return (
    <g>
      <path d={`M2 3 Q ${width / 2} 8 ${width - 2} 3`} fill="none" stroke="#2f6b1f" strokeWidth="0.5" />
      {bulbs.map((x, i) => {
        const y = sag(x + 3);
        return (
          <g key={x} transform={`translate(${x + 3} ${y})`}>
            <rect x="-0.8" y="0" width="1.6" height="1.2" fill="#555" />
            <ellipse cx="0" cy="3" rx="1.6" ry="2.2" fill={colors[i % colors.length]} />
            <ellipse cx="-0.5" cy="2.3" rx="0.4" ry="0.7" fill="#ffffffb0" />
          </g>
        );
      })}
    </g>
  );
}

/** A balloon on a string, its knot at the bottom. */
function Balloon({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 6 C1 10 -1 13 0.5 17" fill="none" stroke="#7a5b3a" strokeWidth="0.35" />
      <ellipse cy="0" rx="4.4" ry="5.6" fill={color} stroke="#00000026" strokeWidth="0.3" />
      <path d="M-0.8 5.4 L0 6.4 L0.8 5.4 Z" fill={color} />
      <ellipse cx="-1.6" cy="-2.2" rx="0.9" ry="1.6" fill="#ffffff90" />
    </g>
  );
}

/** Grass blades along the bottom, for the Easter eggs to sit in. */
function Grass({ width, height }: { width: number; height: number }) {
  const blades = along(width, 1.6);
  return (
    <path
      d={blades.map((x, i) => `M${x} ${height} L${x + (i % 2 ? 0.8 : -0.8)} ${height - 5 - (i % 3)}`).join(" ")}
      stroke="#7fbf5a"
      strokeWidth="0.7"
      strokeLinecap="round"
      fill="none"
    />
  );
}

/** The frame's motifs for one decoration on a poster `width` × `height` layout millimetres. */
function motifs(decor: PosterDecor, width: number, height: number, theme: Theme): ReactNode {
  const colors = party(theme);
  switch (decor) {
    case "plain":
      return null;
    case "vines": {
      const d = DECOR_MM / 2;
      // A stem waving gently from `from` to `to` along a line at `fixed`.
      const wave = (from: number, to: number, fixed: number, horizontal: boolean) => {
        const n = Math.max(1, Math.floor((to - from) / 10));
        const step = (to - from) / n;
        let path = horizontal ? `M${from} ${fixed}` : `M${fixed} ${from}`;
        for (let i = 0; i < n; i++) {
          const mid = from + step * (i + 0.5);
          const end = from + step * (i + 1);
          const off = i % 2 ? 2 : -2;
          path += horizontal ? ` Q${mid} ${fixed + off} ${end} ${fixed}` : ` Q${fixed + off} ${mid} ${fixed} ${end}`;
        }
        return path;
      };
      return (
        <g>
          <g fill="none" stroke="#5a8f3c" strokeWidth="0.7">
            <path d={wave(d, width - d, d, true)} />
            <path d={wave(d, width - d, height - d, true)} />
            <path d={wave(d, height - d, d, false)} />
            <path d={wave(d, height - d, width - d, false)} />
          </g>
          {round(width, height, 6).map(({ x, y, edge, i }) => (
            <Leaf key={i} x={x} y={y} turn={(edge === "top" || edge === "bottom" ? 60 : -30) + (i % 2) * 70} color={i % 3 ? "#8cc56a" : "#6aa84f"} size={0.8} />
          ))}
          {round(width, height, 24).map(({ x, y, i }) => (
            <g key={`f${i}`} transform={`translate(${x + 3} ${y})`}>
              {[0, 72, 144, 216, 288].map((a) => (
                <circle key={a} cx={1.4 * Math.cos((a * Math.PI) / 180)} cy={1.4 * Math.sin((a * Math.PI) / 180)} r="1.1" fill={colors[i % colors.length]} />
              ))}
              <circle r="0.8" fill="#ffd23f" />
            </g>
          ))}
        </g>
      );
    }
    case "pennants":
      return (
        <g>
          <Pennants width={width} colors={colors} />
          <g transform={`translate(0 ${height - DECOR_MM + 1})`}>
            <Pennants width={width} colors={[...colors].reverse()} />
          </g>
        </g>
      );
    case "clouds":
      return (
        <g>
          {round(width, height, 22).map(({ x, y, i }) => (
            <Cloud key={i} x={x} y={y} size={0.8 + (i % 3) * 0.12} />
          ))}
        </g>
      );
    case "autumn": {
      const reds = ["#e8590c", "#c92a2a", "#f59f00", "#a0522d", "#d9480f"];
      return (
        <g>
          {round(width, height, 9).map(({ x, y, i }) => (
            <MapleLeaf key={i} x={x} y={y} turn={(i * 47) % 360} color={reds[i % reds.length]} />
          ))}
        </g>
      );
    }
    case "advent":
      return (
        <g>
          <FairyLights width={width} />
          {round(width, height, 14)
            .filter(({ edge }) => edge !== "top")
            .map(({ x, y, i }) => (
              <Snowflake key={i} x={x} y={y} size={0.8 + (i % 2) * 0.25} />
            ))}
        </g>
      );
    case "easter":
      return (
        <g>
          <Grass width={width} height={height} />
          {along(width, 11).map((x, i) => (
            <Egg key={x} x={x} y={height - 6} color={colors[i % colors.length]} turn={(i % 3) * 12 - 12} />
          ))}
          {round(width, height, 26)
            .filter(({ edge }) => edge !== "bottom")
            .map(({ x, y, i }) => (
              <g key={`f${i}`} transform={`translate(${x} ${y})`}>
                {[0, 72, 144, 216, 288].map((a) => (
                  <ellipse key={a} cx="0" cy="-1.6" rx="0.9" ry="1.6" fill="#fff" stroke="#f3c4d6" strokeWidth="0.25" transform={`rotate(${a})`} />
                ))}
                <circle r="0.9" fill="#ffd23f" />
              </g>
            ))}
        </g>
      );
    case "birthday":
      return (
        <g>
          <Pennants width={width} colors={colors} />
          <Balloon x={DECOR_MM * 0.5} y={DECOR_MM * 1.4} color={colors[1]} />
          <Balloon x={width - DECOR_MM * 0.5} y={DECOR_MM * 1.4} color={colors[2]} />
          {round(width, height, 5)
            .filter(({ edge }) => edge !== "top")
            .map(({ x, y, i }) => (
              <rect
                key={i}
                x={x + ((i * 7) % 5) - 2}
                y={y + ((i * 3) % 5) - 2}
                width="1.6"
                height="0.8"
                rx="0.2"
                fill={colors[i % colors.length]}
                transform={`rotate(${(i * 37) % 180} ${x} ${y})`}
              />
            ))}
        </g>
      );
  }
}

/** The frame laid over the poster's edge: a drawing of `width` × `height` layout millimetres. */
export function PosterFrame({ decor, width, height, theme }: { decor: PosterDecor; width: number; height: number; theme: Theme }) {
  if (decor === "plain") return null;
  return (
    <svg className="rw-poster-frame" viewBox={`0 0 ${width} ${height}`} aria-hidden>
      {motifs(decor, width, height, theme)}
    </svg>
  );
}

/** A small square of a decoration, for its choice: the frame's top left corner. */
export function DecorPic({ decor, theme }: { decor: PosterDecor; theme: Theme }) {
  const size = 44;
  return (
    <svg className="rw-poster-decor-pic" viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <rect width={size} height={size} fill={theme.paper} />
      <rect x={DECOR_MM} y={DECOR_MM} width={size - DECOR_MM} height={size - DECOR_MM} rx="3" fill="#fff" stroke={theme.ink} strokeWidth="0.6" />
      {motifs(decor, size * 2, size * 2, theme)}
    </svg>
  );
}
