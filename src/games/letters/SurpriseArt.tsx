import { useEffect, useRef, type CSSProperties } from "react";
import { pick, shuffle } from "@/lib/random";
import { CANVAS_BOX, CANVAS_MAX_DPR, type CanvasParams, canvasEffect } from "./surpriseCanvas";

// More of Frei tippen's surprises (user request, November 2026: effects of the app's own, drawn in SVG and CSS or on a
// canvas, never emojis). Like the first ones, each SVG or CSS kind is a few small HTML layers moved only by transform
// and opacity; the canvas kinds are drawn in `surpriseCanvas.ts`.

/** The kinds drawn here in SVG and CSS. */
export const ART_KINDS = ["comet", "snowflake", "mandala", "splash", "pinwheel", "ball"] as const;

/** One kind drawn here. */
export type ArtKind = (typeof ART_KINDS)[number];

const BRIGHT = ["#ff5d73", "#ffb703", "#3ec300", "#00b4d8", "#8e7dff", "#ff7bd0", "#ff8c42", "#2ec4b6"];
const PALETTES = [
  ["#ff3d5a", "#ffc300", "#ff8c00", "#1e9bff"],
  ["#1e9bff", "#7b5cff", "#00c2ff", "#ff4fb8"],
  ["#2fbf3a", "#ffc300", "#00a86b", "#ff8c00"],
  ["#ff4fb8", "#a24dff", "#ff3d5a", "#ffc300"],
  ["#00b8a9", "#1e9bff", "#2fbf3a", "#ffb000"],
];

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** How one of these surprises looks this time; drawn once in `artParams`, so drawing it again changes nothing. */
export type ArtParams =
  | { kind: "comet"; angle: number; color: string; points: 4 | 5; glints: { x: number; y: number; turn: number }[] }
  | { kind: "snowflake"; color: string; style: 0 | 1 | 2; flakes: { x: number; y: number; turn: number }[] }
  | { kind: "mandala"; colors: string[]; rings: { count: number; shape: "petal" | "dot" | "diamond" | "drop"; turn: number }[] }
  | { kind: "splash"; color: string; second: string; blob: string; small: string; drops: { x: number; y: number; r: number }[] }
  | { kind: "pinwheel"; colors: string[]; blades: 4 | 6; spin: number }
  | { kind: "ball"; drop: number; color: string; stripe: string; dots: boolean; turn: number };

/** A smooth blob round (0, 0): radius about `r`, with `lobes` bulges of chance size. */
function blobPath(r: number, lobes: number, spread: number): string {
  const points = Array.from({ length: lobes }, (_, i) => {
    const a = (i / lobes) * Math.PI * 2;
    const rr = r * rand(1 - spread, 1 + spread * 0.6);
    return [Math.cos(a) * rr, Math.sin(a) * rr];
  });
  const mid = (a: number[], b: number[]) => `${((a[0] + b[0]) / 2).toFixed(1)} ${((a[1] + b[1]) / 2).toFixed(1)}`;
  let d = `M${mid(points[lobes - 1], points[0])}`;
  for (let i = 0; i < lobes; i++) d += ` Q${points[i][0].toFixed(1)} ${points[i][1].toFixed(1)} ${mid(points[i], points[(i + 1) % lobes])}`;
  return `${d} Z`;
}

/** Draws this time's look of `kind` (sizes are shares of the surprise's size). */
export function artParams(kind: ArtKind): ArtParams {
  switch (kind) {
    case "comet": {
      // It flies in from the upper left or right, slanting down to the spot.
      const fromLeft = Math.random() < 0.5;
      const count = Math.round(rand(7, 10));
      return {
        kind,
        angle: fromLeft ? rand(20, 40) : rand(140, 160),
        color: pick(["#ffc300", "#ff7bd0", "#00b4d8", "#8e7dff", "#ff8c42"]),
        points: pick([4, 5] as const),
        glints: Array.from({ length: count }, (_, i) => {
          const a = (i / count) * Math.PI * 2 + rand(-0.2, 0.2);
          const r = rand(0.3, 0.48);
          return { x: Math.cos(a) * r, y: Math.sin(a) * r, turn: rand(-120, 120) };
        }),
      };
    }
    case "snowflake":
      return {
        kind,
        color: pick(["#4f9dff", "#7b5cff", "#00a7c4", "#3f7fe0", "#a24dff"]),
        style: pick([0, 1, 2] as const),
        flakes: Array.from({ length: 6 }, (_, i) => {
          const a = (i / 6) * Math.PI * 2 + rand(-0.3, 0.3);
          return { x: Math.cos(a) * rand(0.35, 0.5), y: Math.sin(a) * rand(0.2, 0.35) + rand(0.35, 0.55), turn: rand(-200, 200) };
        }),
      };
    case "mandala": {
      const shapes = shuffle(["petal", "dot", "diamond", "drop"] as const);
      return {
        kind,
        colors: shuffle(pick(PALETTES)),
        rings: [
          { count: pick([5, 6, 8]), shape: shapes[0], turn: rand(40, 90) },
          { count: pick([8, 10, 12]), shape: shapes[1], turn: -rand(40, 90) },
          { count: pick([10, 12, 14]), shape: shapes[2], turn: rand(30, 70) },
        ],
      };
    }
    case "splash": {
      const [color, second] = shuffle(BRIGHT);
      const count = Math.round(rand(6, 10));
      return {
        kind,
        color,
        second,
        blob: blobPath(30, Math.round(rand(9, 14)), 0.28),
        small: blobPath(13, Math.round(rand(6, 9)), 0.25),
        drops: Array.from({ length: count }, (_, i) => {
          const a = (i / count) * Math.PI * 2 + rand(-0.3, 0.3);
          const r = rand(0.34, 0.52);
          return { x: Math.cos(a) * r, y: Math.sin(a) * r, r: rand(0.025, 0.055) };
        }),
      };
    }
    case "pinwheel":
      return { kind, colors: shuffle(BRIGHT).slice(0, 3), blades: pick([4, 6] as const), spin: pick([1, -1]) * rand(720, 1080) };
    case "ball": {
      // One ball dropping onto the spot – never a row of them side by side (user feedback, 25 November 2026).
      const [color, other] = shuffle(BRIGHT);
      return {
        kind,
        drop: rand(0.55, 0.75),
        color,
        stripe: pick(["#ffffff", "#ffd23f", other]),
        dots: Math.random() < 0.4,
        turn: pick([-1, 1]) * rand(90, 270),
      };
    }
  }
}

/** CSS custom properties as a style. */
const vars = (v: Record<string, string | number>) => v as CSSProperties;

/** The outline round every drawing, as on the other surprises. */
const LINE = "#5a3a2a";

/** Draws one of these surprises; `size` is its size in px. */
export function ArtView({ s, size }: { s: ArtParams; size: number }) {
  switch (s.kind) {
    case "comet":
      return <Comet s={s} size={size} />;
    case "snowflake":
      return <Snowflake s={s} size={size} />;
    case "mandala":
      return <Mandala s={s} />;
    case "splash":
      return <Splash s={s} size={size} />;
    case "pinwheel":
      return <Pinwheel s={s} />;
    case "ball":
      return <Ball s={s} size={size} />;
  }
}

/** A star's outline round (0, 0) with `points` points, radius `r` and inner radius `inner`. */
function starPoints(points: number, r: number, inner: number): string {
  return Array.from({ length: points * 2 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / points;
    const rr = i % 2 ? inner : r;
    return `${(Math.cos(a) * rr).toFixed(1)},${(Math.sin(a) * rr).toFixed(1)}`;
  }).join(" ");
}

function Comet({ s, size }: { s: Extract<ArtParams, { kind: "comet" }>; size: number }) {
  return (
    <>
      <div className="ft-comet-path" style={vars({ rotate: `${s.angle}deg` })}>
        <div className="ft-comet">
          <span className="ft-comet-tail" style={vars({ "--c": s.color })} />
          <svg className="ft-comet-head" viewBox="-50 -50 100 100" role="presentation">
            <polygon points={starPoints(s.points, 46, s.points === 4 ? 16 : 20)} fill={s.color} stroke={LINE} strokeWidth="3" strokeLinejoin="round" />
            <circle cx="-8" cy="-10" r="6" fill="#ffffffaa" />
          </svg>
        </div>
      </div>
      <span className="ft-comet-glow" style={vars({ "--c": s.color })} />
      {s.glints.map((g, i) => (
        <svg
          key={i}
          className="ft-comet-glint"
          viewBox="-50 -50 100 100"
          role="presentation"
          style={vars({ "--x": `${g.x * size}px`, "--y": `${g.y * size}px`, "--r": `${g.turn}deg` })}
        >
          <polygon points={starPoints(4, 48, 14)} fill={i % 2 ? s.color : "#ffd23f"} />
        </svg>
      ))}
    </>
  );
}

/** One arm of a snowflake, pointing up from (0, 0), in one of three styles. */
function FlakeArm({ style }: { style: 0 | 1 | 2 }) {
  if (style === 0)
    return (
      <>
        <line x1="0" y1="0" x2="0" y2="-44" />
        <polyline points="-11,-30 0,-20 11,-30" fill="none" />
        <polyline points="-8,-42 0,-34 8,-42" fill="none" />
      </>
    );
  if (style === 1)
    return (
      <>
        <line x1="0" y1="0" x2="0" y2="-36" />
        <polygon points="0,-48 6,-40 0,-32 -6,-40" />
        <line x1="0" y1="-18" x2="-10" y2="-26" />
        <line x1="0" y1="-18" x2="10" y2="-26" />
      </>
    );
  return (
    <>
      <line x1="0" y1="0" x2="0" y2="-40" />
      <circle cx="0" cy="-44" r="4" />
      <line x1="0" y1="-24" x2="-12" y2="-32" />
      <line x1="0" y1="-24" x2="12" y2="-32" />
      <circle cx="-13" cy="-33" r="2.5" />
      <circle cx="13" cy="-33" r="2.5" />
    </>
  );
}

function FlakeDrawing({ color, style, className, style2 }: { color: string; style: 0 | 1 | 2; className: string; style2?: CSSProperties }) {
  return (
    <svg className={className} viewBox="-50 -50 100 100" role="presentation" style={style2}>
      <g stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill={color}>
        {[0, 60, 120, 180, 240, 300].map((turn) => (
          <g key={turn} transform={`rotate(${turn})`}>
            <FlakeArm style={style} />
          </g>
        ))}
        <circle r="7" fill="#ffffff" />
      </g>
    </svg>
  );
}

function Snowflake({ s, size }: { s: Extract<ArtParams, { kind: "snowflake" }>; size: number }) {
  return (
    <>
      <FlakeDrawing color={s.color} style={s.style} className="ft-snowflake" />
      {s.flakes.map((f, i) => (
        <FlakeDrawing
          key={i}
          color={s.color}
          style={((s.style + i) % 3) as 0 | 1 | 2}
          className="ft-snowflake-small"
          style2={vars({ "--x": `${f.x * size}px`, "--y": `${f.y * size}px`, "--r": `${f.turn}deg` })}
        />
      ))}
    </>
  );
}

/** The mandala's rings' radii, in its svg's units. */
export const MANDALA_RADII = [14, 28, 41];
/**
 * Half the side of each ring's svg box: the outer ring's shapes reach past 50 (41 plus a petal of 1.5 × its size), and
 * in a box of 100 their tips were cut off (user feedback, 25 November 2026; `surprises.test.ts`).
 */
export const MANDALA_VIEW = 60;
/** A ring shape's size at radius `r`; it reaches 1.5 times that past `r`. */
export const ringShapeSize = (r: number) => 3 + r * 0.16;

/** One shape of a mandala's ring, pointing outwards from (0, -r). */
function RingShape({ shape, r, color }: { shape: "petal" | "dot" | "diamond" | "drop"; r: number; color: string }) {
  const s = ringShapeSize(r);
  if (shape === "petal") return <ellipse cx="0" cy={-r} rx={s * 0.75} ry={s * 1.5} fill={color} stroke={LINE} strokeWidth="1.5" />;
  if (shape === "dot") return <circle cx="0" cy={-r} r={s * 0.9} fill={color} stroke={LINE} strokeWidth="1.5" />;
  if (shape === "diamond")
    return (
      <polygon points={`0,${-r - s * 1.4} ${s},${-r} 0,${-r + s * 1.4} ${-s},${-r}`} fill={color} stroke={LINE} strokeWidth="1.5" strokeLinejoin="round" />
    );
  return (
    <path
      d={`M0 ${-r - s * 1.5} C${s} ${-r - s * 0.3} ${s} ${-r + s} 0 ${-r + s} C${-s} ${-r + s} ${-s} ${-r - s * 0.3} 0 ${-r - s * 1.5} Z`}
      fill={color}
      stroke={LINE}
      strokeWidth="1.5"
    />
  );
}

function Mandala({ s }: { s: Extract<ArtParams, { kind: "mandala" }> }) {
  const radii = MANDALA_RADII;
  return (
    <>
      {s.rings.map((ring, i) => (
        <svg
          key={i}
          className="ft-mandala-ring"
          viewBox={`${-MANDALA_VIEW} ${-MANDALA_VIEW} ${MANDALA_VIEW * 2} ${MANDALA_VIEW * 2}`}
          role="presentation"
          style={vars({ "--turn": `${ring.turn}deg`, "--delay": `${i * 0.12}s` })}
        >
          {Array.from({ length: ring.count }, (_, k) => (
            <g key={k} transform={`rotate(${(k * 360) / ring.count})`}>
              <RingShape shape={ring.shape} r={radii[i]} color={s.colors[(i + k) % 2 ? i : (i + 1) % s.colors.length]} />
            </g>
          ))}
          {i === 0 && <circle r="7" fill={s.colors[3] ?? s.colors[0]} stroke={LINE} strokeWidth="1.5" />}
        </svg>
      ))}
    </>
  );
}

function Splash({ s, size }: { s: Extract<ArtParams, { kind: "splash" }>; size: number }) {
  return (
    <>
      <svg className="ft-splash-blob" viewBox="-50 -50 100 100" role="presentation">
        <path d={s.blob} fill={s.color} stroke={LINE} strokeWidth="1.5" />
        <path d={s.small} fill={s.second} stroke={LINE} strokeWidth="1.2" transform="translate(6 4)" />
        <ellipse cx="-12" cy="-14" rx="7" ry="4" fill="#ffffff88" transform="rotate(-30 -12 -14)" />
      </svg>
      {s.drops.map((d, i) => (
        <span
          key={i}
          className="ft-splash-drop"
          style={vars({ "--x": `${d.x * size}px`, "--y": `${d.y * size}px`, "--d": `${d.r * size * 2}px`, "--c": i % 3 ? s.color : s.second })}
        />
      ))}
    </>
  );
}

function Pinwheel({ s }: { s: Extract<ArtParams, { kind: "pinwheel" }> }) {
  return (
    <div className="ft-pinwheel-box" style={vars({ "--spin": `${s.spin}deg` })}>
      <svg className="ft-pinwheel" viewBox="-50 -50 100 100" role="presentation">
        {Array.from({ length: s.blades }, (_, i) => (
          <g key={i} transform={`rotate(${(i * 360) / s.blades})`}>
            <path d="M0 0 L0 -46 C24 -46 38 -30 34 -10 Z" fill={s.colors[i % s.colors.length]} stroke={LINE} strokeWidth="2" strokeLinejoin="round" />
            <path d="M0 0 L34 -10 C30 -22 22 -26 14 -26 Z" fill="#00000022" />
          </g>
        ))}
        <circle r="6" fill="#ffd23f" stroke={LINE} strokeWidth="2" />
      </svg>
    </div>
  );
}

function Ball({ s, size }: { s: Extract<ArtParams, { kind: "ball" }>; size: number }) {
  return (
    <svg className="ft-ball" viewBox="-50 -50 100 100" role="presentation" style={vars({ "--drop": `${-s.drop * size}px`, "--turn": `${s.turn}deg` })}>
      <circle r="46" fill={s.color} stroke={LINE} strokeWidth="3" />
      {s.dots ? (
        [
          [-18, -16],
          [16, -20],
          [-4, 10],
          [22, 16],
          [-22, 22],
        ].map(([cx, cy]) => <circle key={`${cx}`} cx={cx} cy={cy} r="7" fill={s.stripe} />)
      ) : (
        <path d="M-44 -12 C-20 -2 20 -2 44 -12 L45 6 C20 16 -20 16 -45 6 Z" fill={s.stripe} />
      )}
      <ellipse cx="-18" cy="-24" rx="10" ry="6" fill="#ffffff88" transform="rotate(-30 -18 -24)" />
    </svg>
  );
}

/**
 * A surprise drawn on a canvas: the canvas is only as big as its sparks fly (`CANVAS_BOX`), drawn at most at
 * `CANVAS_MAX_DPR`, by its own animation frame loop that stops when the effect is over or the surprise goes.
 */
export function CanvasArt({ s, size }: { s: CanvasParams; size: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const box = CANVAS_BOX * size;
    const dpr = Math.min(window.devicePixelRatio || 1, CANVAS_MAX_DPR);
    canvas.width = Math.round(box * dpr);
    canvas.height = Math.round(box * dpr);
    const effect = canvasEffect(s, size);
    let last = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      const alive = effect.step(dt);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!alive) return;
      ctx.setTransform(dpr, 0, 0, dpr, (box / 2) * dpr, (box / 2) * dpr);
      effect.draw(ctx);
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [s, size]);
  return <canvas ref={ref} className="ft-canvas" style={vars({ "--box": `${CANVAS_BOX * size}px` })} />;
}
