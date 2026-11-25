import { memo, type CSSProperties } from "react";
import { Draw, INK, Layer, LeftGlow, STAGE_H, STAGE_W } from "./scenes";

// Pizza (H-47, the children's way of the red disc): a pizza on a wooden board, cut in many slices, eaten one by one round the clock from
// 12 o'clock, as the Kita's disc gets smaller – what is still on the board is the time left. Each slice is a small
// layer of its own, cut to its wedge (a still `clip-path`), lifted off towards its side and gone at its time: a CSS
// animation with its moment as `animation-delay`, so React only plays the munch then (`pieceMoments`). Every second a
// little steam rises from the pizza (H-63).

/** The pizza: its middle and radius. */
export const PIZZA = { cx: 700, cy: 445, r: 270 } as const;

/**
 * How many slices it is cut into, one eaten after another: many (user feedback, November 2026: eight were too few to
 * see the time go), so a slice goes every few seconds in a minute.
 */
export const SLICES = 24;

/** How long it takes to lift a slice off, in seconds; it is gone at its moment. */
export const SLICE_SECONDS = 1.4;

/** The ground the board stands on. */
export const PIZZA_FLOOR = 790;

/** A point on the pizza at `angle` (radians from 12 o'clock, clockwise) and `radius`, in stage units. */
function at(angle: number, radius: number) {
  return { x: PIZZA.cx + Math.sin(angle) * radius, y: PIZZA.cy - Math.cos(angle) * radius };
}

/** Slice `i`: its angles, the box round it (with room for the crust's line) and its wedge as stage points. */
export function slice(i: number) {
  const from = (i / SLICES) * 2 * Math.PI;
  const to = ((i + 1) / SLICES) * 2 * Math.PI;
  const outer = PIZZA.r + 8;
  const arc = Array.from({ length: 9 }, (_, k) => at(from + ((to - from) * k) / 8, outer));
  const points = [{ x: PIZZA.cx, y: PIZZA.cy }, ...arc];
  const x = Math.floor(Math.min(...points.map((p) => p.x)));
  const y = Math.floor(Math.min(...points.map((p) => p.y)));
  const w = Math.ceil(Math.max(...points.map((p) => p.x))) - x;
  const h = Math.ceil(Math.max(...points.map((p) => p.y))) - y;
  return { from, to, x, y, w, h, points };
}

/** The table with its checked cloth; drawn once. */
const Kitchen = memo(function Kitchen() {
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-back">
      <Draw w={STAGE_W} h={STAGE_H} bleed>
        <defs>
          <pattern id="tm-cloth" width="80" height="80" patternUnits="userSpaceOnUse">
            <rect width="80" height="80" fill="#fff" />
            <rect width="40" height="40" fill="#ffc9c9" />
            <rect x="40" y="40" width="40" height="40" fill="#ffc9c9" />
          </pattern>
        </defs>
        <rect width={STAGE_W} height={STAGE_H} fill="#fff4e0" />
        <rect y="120" width={STAGE_W} height={STAGE_H} fill="url(#tm-cloth)" />
        <rect y="112" width={STAGE_W} height="12" fill="#e9d8b8" />
      </Draw>
    </Layer>
  );
});

/** The wooden board the pizza lies on, seen where the slices are gone; drawn once. */
const Board = memo(function Board() {
  const { cx, cy, r } = PIZZA;
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H}>
      <Draw w={STAGE_W} h={STAGE_H}>
        <rect x={cx - r - 130} y={cy - 26} width="120" height="52" rx="22" fill="#c98b4a" stroke={INK} strokeWidth="7" />
        <circle cx={cx} cy={cy} r={r + 34} fill="#d9a066" stroke={INK} strokeWidth="8" />
        {[0.45, 0.7, 0.92].map((k) => (
          <circle key={k} cx={cx} cy={cy} r={(r + 34) * k} fill="none" stroke="#c98b4a" strokeWidth="4" />
        ))}
      </Draw>
    </Layer>
  );
});

/** What lies on the pizza: salami, mushrooms, olives, basil and pepper. */
type Topping = "salami" | "mushroom" | "olive" | "basil" | "pepper";

/**
 * The toppings, spread over the whole pizza once (a sunflower's spiral, so they lie evenly and never in rows), each
 * with its place (angle, radius), kind and a turn of its own. Every slice draws those near it and its wedge cuts them,
 * so a salami lying across a cut stays half on the board as its slice is eaten – as in life.
 */
export const TOPPINGS = (() => {
  const kinds: Topping[] = ["salami", "mushroom", "olive", "salami", "basil", "pepper", "olive", "salami", "mushroom", "basil"];
  const n = 46;
  return Array.from({ length: n }, (_, k) => ({
    angle: (k * 2.39996323) % (2 * Math.PI),
    radius: PIZZA.r * (0.14 + 0.66 * Math.sqrt((k + 0.5) / n)),
    kind: kinds[k % kinds.length],
    spin: (k * 47) % 360,
  }));
})();

/** One topping drawn at (0, 0), turned by its `spin`. */
function ToppingArt({ kind }: { kind: Topping }) {
  if (kind === "salami")
    return (
      <>
        <circle r="22" fill="#d9480f" stroke={INK} strokeWidth="3.5" />
        <circle cx="-7" cy="-5" r="3.5" fill="#ffa8a8" />
        <circle cx="6" cy="7" r="3" fill="#ffa8a8" />
        <circle cx="8" cy="-8" r="2.5" fill="#ffa8a8" />
      </>
    );
  if (kind === "mushroom")
    return <path d="M-17 2 C-17 -14 17 -14 17 2 Z M-6 2 V14 C-6 18 6 18 6 14 V2" fill="#f1e3d3" stroke={INK} strokeWidth="3" strokeLinejoin="round" />;
  if (kind === "olive")
    return (
      <>
        <circle r="9" fill="#343a40" />
        <circle r="3.5" fill="#ffd166" />
      </>
    );
  if (kind === "basil") return <path d="M-16 0 C-8 -12 8 -12 16 0 C8 12 -8 12 -16 0 Z M-12 0 H12" fill="#51a33a" stroke="#2b6b1f" strokeWidth="2.5" />;
  return <path d="M-16 -4 C-6 -14 8 -12 16 -2 L12 4 C4 -4 -6 -6 -12 2 Z" fill="#37b24d" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />;
}

/** One slice in its own box: cheese with a ring of tomato near the crust, the toppings near it cut by its wedge, the crust with its brown spots. */
function Slice({ i, glow }: { i: number; glow: number }) {
  const s = slice(i);
  const mid = (s.from + s.to) / 2;
  const local = (p: { x: number; y: number }) => ({ x: p.x - s.x, y: p.y - s.y });
  const c = local({ x: PIZZA.cx, y: PIZZA.cy });
  const a = local(at(s.from, PIZZA.r));
  const b = local(at(s.to, PIZZA.r));
  const arc = (radius: number) => {
    const p = local(at(s.from, radius));
    const q = local(at(s.to, radius));
    return `M${p.x} ${p.y} A${radius} ${radius} 0 0 1 ${q.x} ${q.y}`;
  };
  // A topping is near when it may reach into the wedge: its angle within the slice and a topping's width round it.
  const near = TOPPINGS.filter((t) => {
    const reach = 30 / t.radius;
    let d = t.angle - mid;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    return Math.abs(d) <= (s.to - s.from) / 2 + reach;
  });
  const spot = local(at(mid + 0.05, PIZZA.r - 10));
  const style = {
    clipPath: `polygon(${s.points.map((p) => `${(((p.x - s.x) / s.w) * 100).toFixed(2)}% ${(((p.y - s.y) / s.h) * 100).toFixed(2)}%`).join(", ")})`,
    animationDelay: `calc(var(--tm-ms) * ${(i + 1) / SLICES} - ${SLICE_SECONDS}s)`,
    "--tm-dx": `${(Math.sin(mid) * 30).toFixed(1)}%`,
    "--tm-dy": `${(-Math.cos(mid) * 30).toFixed(1)}%`,
  } as CSSProperties;
  return (
    <Layer x={s.x} y={s.y} w={s.w} h={s.h} className="tm-slice tm-move" style={style}>
      <svg viewBox={`0 0 ${s.w} ${s.h}`}>
        <path d={`M${c.x} ${c.y} L${a.x} ${a.y} A${PIZZA.r} ${PIZZA.r} 0 0 1 ${b.x} ${b.y} Z`} fill="#ffd166" />
        <path d={arc(PIZZA.r - 34)} fill="none" stroke="#e8590c" strokeWidth="10" opacity="0.55" />
        {near.map((t, k) => {
          const p = local(at(t.angle, t.radius));
          return (
            <g key={k} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${t.spin})`}>
              <ToppingArt kind={t.kind} />
            </g>
          );
        })}
        <path d={arc(PIZZA.r - 12)} fill="none" stroke="#d08b3c" strokeWidth="26" />
        <circle cx={spot.x} cy={spot.y} r="4" fill="#a0612a" />
        {/* The cuts: thin lines, as a knife leaves them, and the crust's outline. */}
        <path d={`M${a.x} ${a.y} L${c.x} ${c.y} L${b.x} ${b.y}`} fill="none" stroke="#b9792a" strokeWidth="3" strokeLinejoin="round" />
        <path d={arc(PIZZA.r)} fill="none" stroke={INK} strokeWidth="5" />
      </svg>
      <LeftGlow n={glow} />
    </Layer>
  );
}

/** A little steam rising from the pizza every second (H-63). */
function Steam() {
  return (
    <Layer x={PIZZA.cx - 40} y={PIZZA.cy - 100} w={80} h={80}>
      <div className="tm-chug tm-beat tm-steam-puff" />
    </Layer>
  );
}

/** The whole picture: the board, the slices and the steam. */
export function PizzaScene({ glow }: { glow: number }) {
  return (
    <>
      <Kitchen />
      <Board />
      {Array.from({ length: SLICES }, (_, i) => (
        <Slice key={i} i={i} glow={glow} />
      ))}
      <Steam />
    </>
  );
}
