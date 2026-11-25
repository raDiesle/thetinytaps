import { memo, useId, useState, type CSSProperties } from "react";
import { MASCOT_COLORS } from "@/components/Mascot";
import { useRunClock } from "./pause";
import { PlayerPatch } from "./players";
import { Bleed, HOURGLASS_BOX, Hourglass, Layer, SAND_FLOOR, STAGE_H, STAGE_W } from "./scenes";
import type { PlayerLook, Players, TurnChild, TurnCount } from "./settings";

export type { TurnChild } from "./settings";

// Abwechseln (H-52): two to four children take turns, the hourglass in the middle running one turn and turning itself
// over for the next. Each child's place is a floor cushion in its colours with its animal's ears sewn on, big and plain
// to see (user feedback, 25 November 2026: a toy car sitting on the fox's cushion looked like a car on its head and hid
// its ears, so the toy went). Whose turn it is shows at once from afar: the lamp over that child's cushion is on and
// lights it, every other place lies in shade, and the cushion whose turn it is puffs itself up and pricks up its ears
// as the turn begins („Ohren spitzen“), while the waiting ones sit lower with their ears relaxed. A grown-up may give
// each child its name or photo behind ⚙️, which the cushion then carries on its front like a photo cushion
// (`PlayerPatch`). The hourglass is the Sanduhr's own (`Hourglass`, user request, November 2026: one drawing, not
// two), smaller where three or four cushions share the floor. The children themselves are not drawn: the drawn fox and
// bear standing there looked odd (user feedback, November 2026); the cushions are their places.

const INK = "#3b2a20";

/** The fox's or the bear's side, where a picture has only two (the Rennstrecke's first two). */
export type Holder = "fox" | "bear";

/** Every child that can take turns, in their order; two to four of them play, from the first. */
export const TURN_CHILDREN: readonly TurnChild[] = ["fox", "bear", "rabbit", "frog"];

/** The children's colours: the fox's and the bear's from the mascots, a blue rabbit and a green frog (the Kugelbahn's too). */
export const KID_LOOK: Record<TurnChild, { body: string; shade: string; light: string; ear: string; earIn: string; lamp: string }> = {
  fox: {
    body: MASCOT_COLORS.fox.fur,
    shade: MASCOT_COLORS.fox.shade,
    light: MASCOT_COLORS.fox.light,
    ear: MASCOT_COLORS.fox.fur,
    earIn: MASCOT_COLORS.fox.earIn,
    lamp: "#f08c00",
  },
  bear: {
    body: MASCOT_COLORS.bear.fur,
    shade: MASCOT_COLORS.bear.shade,
    light: MASCOT_COLORS.bear.light,
    ear: MASCOT_COLORS.bear.fur,
    earIn: MASCOT_COLORS.bear.earIn,
    lamp: "#8d5a3b",
  },
  rabbit: { body: "#4dabf7", shade: "#1c7ed6", light: "#a5d8ff", ear: "#f8f9fa", earIn: "#ffc9de", lamp: "#1c7ed6" },
  frog: { body: "#51cf66", shade: "#2f9e44", light: "#b2f2bb", ear: "#51cf66", earIn: "#d3f9d8", lamp: "#2f9e44" },
};

/** The floor the cushions and the hourglass stand on: the Sanduhr's. */
export const SWAP_FLOOR = SAND_FLOOR;

/**
 * Where the children sit with `count` of them: the middles of their cushions left to right in the order of their
 * turns, the cushions' width, and how big the hourglass in the middle is. Two sit either side of a full-size hourglass;
 * three or four share the floor with a smaller one, the first half of them left of it, the rest right – all within
 * x 200–1400, which a tablet's 4 : 3 cut shows (`timer.test.ts`).
 */
export function swapPlaces(count: TurnCount) {
  if (count === 2) return { xs: [390, 1210], w: 250, glass: 1 };
  if (count === 3) return { xs: [315, 535, 1175], w: 210, glass: 0.7 };
  return { xs: [355, 568, 1032, 1245], w: 190, glass: 0.6 };
}

/** The hourglass's box on the floor at its size (`glass`): it shrinks towards the middle of its foot. */
export function glassBox(glass: number) {
  const B = HOURGLASS_BOX;
  const w = B.w * glass;
  const h = (SWAP_FLOOR - B.y) * glass;
  return { x: 800 - w / 2, y: SWAP_FLOOR - h, w, h };
}

/** The lamps hanging over the cushions: where the shade's rim is, and how high it hangs. */
export const LAMP = { rim: 190, top: 120 } as const;

/**
 * The strips of the room that lie in shade while it is not that child's turn: from the stage's edge or the hourglass
 * to halfway to the next cushion. The hourglass itself belongs to no one and is never shaded.
 */
export function shadeStrips(count: TurnCount) {
  const { xs, glass } = swapPlaces(count);
  const g = glassBox(glass);
  return xs.map((x, i) => {
    const leftSide = x < 800;
    const before = xs[i - 1];
    const after = xs[i + 1];
    const from = before !== undefined && before < 800 === leftSide ? (before + x) / 2 : leftSide ? 0 : g.x + g.w;
    const to = after !== undefined && after < 800 === leftSide ? (x + after) / 2 : leftSide ? g.x : STAGE_W;
    return { from, to };
  });
}

/** The ears of a child's cushion, in its own units (184 wide, its bottom's middle at 0 0): big, so they're seen from afar. */
function CushionEars({ kind }: { kind: TurnChild }) {
  const c = KID_LOOK[kind];
  return (
    <g strokeLinejoin="round">
      {[-1, 1].map((side) =>
        kind === "fox" ? (
          <g key={side}>
            <path d={`M${side * 20} -60 L${side * 52} -138 L${side * 76} -50 Z`} fill={c.ear} stroke={INK} strokeWidth="5" />
            <path d={`M${side * 36} -66 L${side * 52} -112 L${side * 62} -60 Z`} fill={c.earIn} />
          </g>
        ) : kind === "bear" ? (
          <g key={side}>
            <circle cx={side * 54} cy="-82" r="30" fill={c.ear} stroke={INK} strokeWidth="5" />
            <circle cx={side * 54} cy="-82" r="15" fill={c.earIn} />
          </g>
        ) : kind === "rabbit" ? (
          <g key={side} transform={`rotate(${side * 12} ${side * 30} -70)`}>
            <ellipse cx={side * 30} cy="-130" rx="22" ry="66" fill={c.ear} stroke={INK} strokeWidth="5" />
            <ellipse cx={side * 30} cy="-126" rx="10" ry="48" fill={c.earIn} />
          </g>
        ) : (
          <g key={side}>
            <circle cx={side * 46} cy="-84" r="30" fill={c.ear} stroke={INK} strokeWidth="5" />
            <circle cx={side * 46} cy="-88" r="16" fill="#fff" stroke={INK} strokeWidth="3" />
            <circle cx={side * 46 + side * 3} cy="-86" r="7" fill={INK} />
          </g>
        ),
      )}
    </g>
  );
}

/** A cushion's soft body with its seam and shine, and the child's photo or name on its front. */
function CushionBody({ kind, look }: { kind: TurnChild; look?: PlayerLook }) {
  const c = KID_LOOK[kind];
  return (
    <g>
      <ellipse cx="0" cy="4" rx="96" ry="14" fill="#000" opacity="0.14" />
      <path d="M-88 -14 C-96 -70 -50 -84 0 -84 C50 -84 96 -70 88 -14 C60 2 -60 2 -88 -14 Z" fill={c.body} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M-70 -30 C-30 -18 30 -18 70 -30" fill="none" stroke={c.shade} strokeWidth="4" strokeDasharray="10 8" />
      <ellipse cx="-44" cy="-66" rx="22" ry="8" fill={c.light} opacity="0.8" />
      <PlayerPatch look={look} x={0} y={-46} r={34} color={c.shade} />
    </g>
  );
}

/** How far above a cushion's bottom its tallest ears reach, in its units (the rabbit's), and below it its shadow. */
const CUSHION_TOP = 200;
const CUSHION_FOOT = 20;

/**
 * A child's floor cushion, round and soft, in its colours with its animal's ears sewn on – no face, so it stays a
 * cushion and never a drawn animal standing by – and its photo or name on its front. Drawn into an svg, its bottom's
 * middle at (`x`, `y`), `w` wide (the card's drawing).
 */
export function Cushion({ kind, x, y, w, look }: { kind: TurnChild; x: number; y: number; w: number; look?: PlayerLook }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${w / 184})`}>
      <CushionEars kind={kind} />
      <CushionBody kind={kind} look={look} />
    </g>
  );
}

/** A lamp hanging from the ceiling over a cushion, switched off (its light is a layer of its own, `SwapLight`). */
function Lamp({ kind, x, w }: { kind: TurnChild; x: number; w: number }) {
  const { rim, top } = LAMP;
  return (
    <g strokeLinejoin="round">
      <path d={`M${x} 0 V${top}`} stroke={INK} strokeWidth="5" />
      <circle cx={x} cy={rim + 4} r="20" fill="#fff9db" stroke={INK} strokeWidth="4" />
      <path d={`M${x - 22} ${top} H${x + 22} L${x + w / 2} ${rim} H${x - w / 2} Z`} fill={KID_LOOK[kind].lamp} stroke={INK} strokeWidth="5" />
    </g>
  );
}

/** The width of a lamp's shade over a cushion `w` wide. */
const lampW = (w: number) => w * 0.44;

/** A playroom with a rug and a lamp hanging over each child's place; drawn once for that many children. */
export const SwapBackdrop = memo(function SwapBackdrop({ kids }: { kids: readonly TurnChild[] }) {
  const { xs, w } = swapPlaces(kids.length as TurnCount);
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-back">
      <svg viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} preserveAspectRatio="none">
        <Bleed>
          <rect width={STAGE_W} height={STAGE_H} fill="#e6f4ea" />
          <rect y={SWAP_FLOOR - 16} width={STAGE_W} height={STAGE_H} fill="#d9a066" />
          <path d={`M0 ${SWAP_FLOOR - 16} H${STAGE_W}`} stroke="#a8743f" strokeWidth="6" />
          <ellipse cx="800" cy={SWAP_FLOOR + 10} rx="640" ry="44" fill="#91a7ff" opacity="0.6" />
          {kids.map((kind, i) => (
            <Lamp key={kind} kind={kind} x={xs[i]} w={lampW(w)} />
          ))}
        </Bleed>
      </svg>
    </Layer>
  );
});

/**
 * One child's cushion as a layer of its own, its ears another inside it: while it is that child's turn (`on`) the
 * cushion puffs itself up and its ears stand up tall („Ohren spitzen“), with a little wiggle as the turn begins; while
 * it waits it sits a little lower with its ears relaxed – still plainly seen. Both move by `transform` only.
 */
export const SwapSeat = memo(function SwapSeat({ kind, x, w, on, look }: { kind: TurnChild; x: number; w: number; on: boolean; look?: PlayerLook }) {
  const k = w / 184;
  const top = SWAP_FLOOR + 6 - CUSHION_TOP * k;
  const h = (CUSHION_TOP + CUSHION_FOOT) * k;
  const view = `-110 ${-CUSHION_TOP} 220 ${CUSHION_TOP + CUSHION_FOOT}`;
  const left = x - 110 * k;
  const origin = (from: number) => `50% ${(((CUSHION_TOP - from) / (CUSHION_TOP + CUSHION_FOOT)) * 100).toFixed(1)}%`;
  return (
    <Layer
      x={left}
      y={top}
      w={220 * k}
      h={h}
      className={`tm-seat${on ? " tm-on" : ""}`}
      style={{ "--tm-seat-foot": origin(0), "--tm-seat-ear-base": origin(60) } as CSSProperties}
    >
      <div className="tm-seat-puff">
        <div className="tm-seat-ears">
          <svg viewBox={view}>
            <CushionEars kind={kind} />
          </svg>
        </div>
        <svg viewBox={view}>
          <CushionBody kind={kind} look={look} />
        </svg>
      </div>
    </Layer>
  );
});

/** Every child's cushion, the one whose turn it is puffed up (`lit`), each with its photo or name (`players`). */
export function SwapCushions({ kids, lit, players }: { kids: readonly TurnChild[]; lit: readonly boolean[]; players: Players }) {
  const { xs, w } = swapPlaces(kids.length as TurnCount);
  return (
    <>
      {kids.map((kind, i) => (
        <SwapSeat key={kind} kind={kind} x={xs[i]} w={w} on={lit[i]} look={players[kind]} />
      ))}
    </>
  );
}

/**
 * The light of one lamp: the bulb glowing, a warm cone down to the cushion and a pool of light round it. On while it
 * is that child's turn, fading in and out as a whole (`opacity`).
 */
export function SwapLight({ x, w, on }: { x: number; w: number; on: boolean }) {
  const { rim } = LAMP;
  const shade = lampW(w);
  const floorW = w * 1.5;
  const left = x - floorW / 2 - 40;
  const width = floorW + 80;
  const top = rim - 30;
  const h = SWAP_FLOOR + 40 - top;
  const id = `tm-swap-light-${useId().replace(/[^\w-]/g, "")}`;
  return (
    <Layer x={left} y={top} w={width} h={h} className={`tm-swap-light${on ? " tm-on" : ""}`}>
      <svg viewBox={`${left} ${top} ${width} ${h}`}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff3bf" stopOpacity="0.95" />
            <stop offset="1" stopColor="#ffec99" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        <path d={`M${x - shade / 2 + 6} ${rim} L${x + shade / 2 - 6} ${rim} L${x + floorW / 2} ${SWAP_FLOOR + 10} H${x - floorW / 2} Z`} fill={`url(#${id})`} />
        <ellipse cx={x} cy={SWAP_FLOOR + 10} rx={floorW / 2 + 30} ry="34" fill="#fff3bf" opacity="0.8" />
        <circle cx={x} cy={rim + 4} r="34" fill="#fff9db" opacity="0.7" />
        <circle cx={x} cy={rim + 4} r="20" fill="#fffbe6" stroke={INK} strokeWidth="4" />
      </svg>
    </Layer>
  );
}

/** Every child's lamp, the one whose turn it is on. */
export function SwapLights({ count, lit }: { count: TurnCount; lit: readonly boolean[] }) {
  const { xs, w } = swapPlaces(count);
  return (
    <>
      {xs.map((x, i) => (
        <SwapLight key={x} x={x} w={w} on={lit[i]} />
      ))}
    </>
  );
}

/** The shade over each child's strip of the room while it is not that child's turn (`lit` false). */
export function SwapShades({ count, lit }: { count: TurnCount; lit: readonly boolean[] }) {
  return (
    <>
      {shadeStrips(count).map(({ from, to }, i) => (
        <SwapShade key={from} from={from} to={to} on={!lit[i]} />
      ))}
    </>
  );
}

/** The soft shade over one strip of the room, from `from` to `to`. */
export function SwapShade({ from, to, on }: { from: number; to: number; on: boolean }) {
  return <Layer x={from} y={0} w={to - from} h={STAGE_H} className={`tm-swap-shade${on ? " tm-on" : ""}`} />;
}

/**
 * The hourglass running one turn – the Sanduhr's own, at its size (`glass`): the top heap sinks, the bottom one rises
 * over `ms`, from `startedAt` on, so it shows the turn's real time even when drawn later (a phone waking up). `flip`
 * turns it over as it comes, the full bottom going up – the hourglass turning itself over for the next child. Both are
 * read once, as it comes: give each turn its own `key`. While `waiting` (the page still turning) it stands full, the
 * sand still.
 */
export function SwapHourglass({
  ms,
  startedAt,
  flip,
  waiting,
  glow,
  glass = 1,
}: {
  ms: number;
  startedAt: number;
  flip: boolean;
  waiting: boolean;
  glow: number;
  glass?: number;
}) {
  const clock = useRunClock();
  const [delay] = useState(() => (waiting ? 0 : Math.max(0, clock.now() - startedAt)));
  const [flipped] = useState(flip);
  return (
    <div
      className="tm-swap-glass-size"
      style={{ transform: glass === 1 ? undefined : `scale(${glass})`, transformOrigin: `50% ${(SWAP_FLOOR / STAGE_H) * 100}%` }}
    >
      <Hourglass
        running={!waiting}
        glow={glow}
        className={`tm-swap-glass${flipped ? " tm-flip" : ""}${waiting ? " tm-wait" : ""}`}
        style={{ "--tm-ms": `${ms}ms`, "--tm-delay": `${-delay}ms` } as CSSProperties}
      />
    </div>
  );
}
