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
      <Draw w={STAGE_W} h={STAGE_H}>
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

/** One slice in its own box: cheese, crust, a slice of salami and an olive, the same on every slice. */
function Slice({ i, glow }: { i: number; glow: number }) {
  const s = slice(i);
  const mid = (s.from + s.to) / 2;
  const local = (p: { x: number; y: number }) => ({ x: p.x - s.x, y: p.y - s.y });
  const c = local({ x: PIZZA.cx, y: PIZZA.cy });
  const a = local(at(s.from, PIZZA.r));
  const b = local(at(s.to, PIZZA.r));
  const salami = local(at(mid, PIZZA.r * 0.66));
  const olive = local(at(mid, PIZZA.r * 0.36));
  const crust = (radius: number) => {
    const p = local(at(s.from, radius));
    const q = local(at(s.to, radius));
    return `M${p.x} ${p.y} A${radius} ${radius} 0 0 1 ${q.x} ${q.y}`;
  };
  const style = {
    clipPath: `polygon(${s.points.map((p) => `${(((p.x - s.x) / s.w) * 100).toFixed(2)}% ${(((p.y - s.y) / s.h) * 100).toFixed(2)}%`).join(", ")})`,
    animationDelay: `calc(var(--tm-ms) * ${(i + 1) / SLICES} - ${SLICE_SECONDS}s)`,
    "--tm-dx": `${(Math.sin(mid) * 30).toFixed(1)}%`,
    "--tm-dy": `${(-Math.cos(mid) * 30).toFixed(1)}%`,
  } as CSSProperties;
  return (
    <Layer x={s.x} y={s.y} w={s.w} h={s.h} className="tm-slice tm-move" style={style}>
      <svg viewBox={`0 0 ${s.w} ${s.h}`}>
        <path
          d={`M${c.x} ${c.y} L${a.x} ${a.y} A${PIZZA.r} ${PIZZA.r} 0 0 1 ${b.x} ${b.y} Z`}
          fill="#ffd166"
          stroke={INK}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path d={crust(PIZZA.r - 12)} fill="none" stroke="#d08b3c" strokeWidth="26" />
        <path d={crust(PIZZA.r)} fill="none" stroke={INK} strokeWidth="5" />
        <circle cx={salami.x} cy={salami.y} r="19" fill="#d9480f" stroke={INK} strokeWidth="3.5" />
        <circle cx={salami.x - 5} cy={salami.y - 4} r="3.5" fill="#ffa8a8" />
        <circle cx={olive.x} cy={olive.y} r="8" fill="#343a40" />
        <circle cx={olive.x} cy={olive.y} r="3" fill="#ffd166" />
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
