import { memo, type ReactNode } from "react";
import { BALL_R, type Pt } from "./path";

/** The xylophone's colours, low to high; the machines use them for bright bits too. */
export const BAR_COLORS = ["#ff5d73", "#ff8c42", "#ffb703", "#3ec300", "#00b4d8", "#3a86ff", "#8e7dff", "#ff7bd0"];
const INK = "#2a1e5c";

/** A wooden rail just under the marbles' path from `a` to `b`, with a peg at each end. */
export function Rail({ a, b }: { a: Pt; b: Pt }) {
  const off = BALL_R + 7;
  return (
    <g>
      <line x1={a.x} y1={a.y + off} x2={b.x} y2={b.y + off} stroke={INK} strokeWidth="18" strokeLinecap="round" />
      <line x1={a.x} y1={a.y + off} x2={b.x} y2={b.y + off} stroke="#d08c4b" strokeWidth="12" strokeLinecap="round" />
      <circle cx={a.x + 14} cy={a.y + off + 1} r="3" fill="#8a5a2b" />
      <circle cx={b.x - 14} cy={b.y + off + 1} r="3" fill="#8a5a2b" />
    </g>
  );
}

/** The pattern on a marble; the Kugelbahn's magic tunnel gives it one (K-06). */
export type BallLook = "plain" | "stripes" | "dots" | "star";

/** A five-pointed star around 0, 0, about as wide as a marble's middle. */
export const STAR_POINTS = Array.from({ length: 10 }, (_, i) => {
  const a = (i * Math.PI) / 5 - Math.PI / 2;
  const r = i % 2 ? 6 : 14;
  return `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`;
}).join(" ");

/** A marble with a shine and a pattern (a stripe unless `look` says otherwise) that turns by `spin` radians as it rolls. */
export function Ball({ color, x, y, spin, look = "plain" }: { color: string; x: number; y: number; spin: number; look?: BallLook }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={BALL_R} fill={color} stroke={INK} strokeWidth="3" />
      <g transform={`rotate(${(spin * 180) / Math.PI})`}>
        {look === "plain" && <path d={`M${-BALL_R + 4} 0 A${BALL_R - 4} ${BALL_R - 4} 0 0 0 ${BALL_R - 4} 0`} fill="none" stroke="#fff6" strokeWidth="5" />}
        {look === "stripes" && <path d="M-17 -8 L17 -8 M-17 8 L17 8" stroke="#fff" strokeWidth="6" strokeLinecap="round" />}
        {look === "dots" &&
          [0, 120, 240].map((a) => <circle key={a} cx={11 * Math.cos((a * Math.PI) / 180)} cy={11 * Math.sin((a * Math.PI) / 180)} r="4.5" fill="#fff" />)}
        {look === "star" && <polygon points={STAR_POINTS} fill="#fff" stroke="#e09a00" strokeWidth="2" strokeLinejoin="round" />}
      </g>
      <circle cx="-7" cy="-8" r="5.5" fill="#fff" opacity="0.75" />
    </g>
  );
}

/** Where a world point lands on the screen and how many pixels one world unit is there (`cameraPoint` in level.ts). */
export type ScreenAt = (x: number, y: number) => { x: number; y: number; k: number };

/**
 * A small thing that moves on its own (a falling marble, a turning star) as an HTML layer of its own: a little svg
 * `2 * pad` world units square round its middle, placed at the world point `x`, `y` by `at` and turned by `angle`
 * (radians) with a CSS transform. The phone then only moves the finished little picture, where the same thing drawn
 * inside the level's big svg had it paint and raster bands as wide as the screen in every frame (perf, November 2026).
 * `children` draw round 0, 0 in world units. An `opacity` fades the whole layer, which the compositor does alone, with no
 * painting (the Licht-Kette's stickers waking, A-42).
 */
export function Sprite({
  at,
  x,
  y,
  pad,
  angle = 0,
  opacity,
  children,
}: {
  at: ScreenAt;
  x: number;
  y: number;
  pad: number;
  angle?: number;
  opacity?: number;
  children: ReactNode;
}) {
  const p = at(x, y);
  const half = pad * p.k;
  return (
    <svg
      className="marble-sprite"
      viewBox={`${-pad} ${-pad} ${2 * pad} ${2 * pad}`}
      style={{
        width: 2 * half,
        height: 2 * half,
        transform: `translate3d(${p.x - half}px, ${p.y - half}px, 0)${angle ? ` rotate(${angle}rad)` : ""}`,
        opacity,
      }}
      aria-hidden
    >
      {children}
    </svg>
  );
}

/**
 * Dashes flowing along a line of straight pieces (a power cable's current), the way `strokeDasharray` with a
 * `strokeDashoffset` moved by the clock would draw them, but as HTML layers: each piece is a narrow strip placed and
 * turned by a transform, and its dashes slide by a CSS animation of `transform`, which the compositor runs alone. The
 * Raketenstart's current drawn into the machine's svg changed a cable reaching over two thirds of the picture's height in
 * every frame, and a phone rastered that whole band 60 times a second (perf, November 2026: 52 screens a second, budget
 * 30). Lies over the machine (`MachineStage`'s `over`); `pts` and every length in world units, `speed` in units a second.
 */
export function FlowingDashes({
  at,
  pts,
  dash,
  gap,
  speed,
  width,
  color,
}: {
  at: ScreenAt;
  pts: Pt[];
  dash: number;
  gap: number;
  speed: number;
  width: number;
  color: string;
}) {
  const period = dash + gap;
  let along = 0;
  return pts.slice(1).map((b, i) => {
    const a = pts[i];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    const start = along;
    along += len;
    const p = at(a.x, a.y);
    return (
      <div
        key={i}
        className="marble-flow"
        style={{
          width: len,
          height: width,
          transform: `translate3d(${p.x}px, ${p.y}px, 0) rotate(${Math.atan2(b.y - a.y, b.x - a.x)}rad) scale(${p.k}) translateY(${-width / 2}px)`,
        }}
        aria-hidden
      >
        {/* One period wide, so sliding it by its own width moves the dashes one period on (a `translateX(100%)` the
            compositor runs; a custom property in the keyframes had the main thread restyle it in every frame). It starts
            one period left of the strip, so the slide never shows the dashes' end, shifted by the length before it, so
            they run on round a corner. */}
        <div className="marble-flow-dashes" style={{ left: -period - (start % period), width: period, animationDuration: `${period / speed}s` }}>
          <div style={{ width: len + 2 * period, background: `repeating-linear-gradient(90deg, ${color} 0 ${dash}px, transparent ${dash}px ${period}px)` }} />
        </div>
      </div>
    );
  });
}

/**
 * `memo` for a drawn part whose props are numbers, strings or flat objects of them: skipped by React while they stay the
 * same (objects compared by their contents, functions ignored). A part drawn again in every frame though nothing about
 * it changed cost an old phone's main thread its time (Kettenreaktion's levels draw 60 times a second while they run);
 * give such a part its age only while it changes (`SETTLE_S`), so it settles.
 */
export function still<P extends object>(Part: (props: P) => ReactNode) {
  const sameValue = (a: unknown, b: unknown): boolean => {
    if (Object.is(a, b)) return true;
    if (typeof a !== "object" || typeof b !== "object" || !a || !b) return false;
    const ka = Object.keys(a);
    return ka.length === Object.keys(b).length && ka.every((k) => Object.is((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
  };
  return memo(Part, (before, after) => (Object.keys(after) as (keyof P)[]).every((k) => typeof after[k] === "function" || sameValue(before[k], after[k])));
}
