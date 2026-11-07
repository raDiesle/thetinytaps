import { memo, useId, useState, type CSSProperties } from "react";
import { MASCOT_COLORS } from "@/components/Mascot";
import type { Localized } from "@/lib/language";
import { HOURGLASS_BOX, Hourglass, Layer, SAND_FLOOR, STAGE_H, STAGE_W } from "./scenes";
import type { SwapToy } from "./settings";

// Abwechseln (H-52): a toy lies on the fox child's cushion while the hourglass runs; when it is empty the toy hops over
// to the bear child's cushion and the hourglass turns itself over – back and forth until a grown-up stops it.
// The hourglass is the Sanduhr's own (`Hourglass`, user request, November 2026: one drawing, not two). Whose turn it
// is shows at once from afar (user feedback, November 2026: the toy beside a small cushion was not clear enough): a
// lamp over that child's cushion is on and lights it, the other side lies in soft shade, and the toy sits on the lit
// cushion. Who begins is drawn by the lamps at the start, clicking on and off in turn, slower and slower, until one
// stays on – fair, so no grown-up has to decide. The children themselves are not drawn: the drawn fox and bear standing
// there looked odd (user feedback, November 2026); the cushions in the fox's and the bear's colours are their places.

const INK = "#3b2a20";

/** Who has the toy: the fox child (left) or the bear child (right). */
export type Holder = "fox" | "bear";

/** The floor the cushions and the hourglass stand on: the Sanduhr's. */
export const SWAP_FLOOR = SAND_FLOOR;

/** The two children's places: the middles of their cushions, the same way left and right of the hourglass, and the cushions' width. */
export const SWAP_SEATS = { fox: 390, bear: 1210, w: 250 } as const;

/** The toy's size, and where its bottom lies: on a cushion, sunk into it a little, or in front of the hourglass while the lamps draw. */
export const TOY = { w: 200, h: 162, onCushion: SWAP_FLOOR - 44, waiting: SWAP_FLOOR + 22 } as const;

/** The lamps hanging over the cushions: where the shade's rim is, and how wide the light is there and on the floor. */
export const LAMP = { rim: 190, top: 120, w: 110, floorW: 380 } as const;

/** The edges of the two sides that lie in shade while it is not that child's turn: up to the hourglass's frame. */
const SHADE = { fox: HOURGLASS_BOX.x, bear: HOURGLASS_BOX.x + HOURGLASS_BOX.w } as const;

/**
 * A child's floor cushion, round and soft, in the fox's or the bear's colours with that animal's ears sewn on (pointed
 * or round) – no face, so it stays a cushion and never a drawn animal standing by. Drawn round (0, 0) on the floor,
 * at the size of `SWAP_SEATS.w`.
 */
function Cushion({ kind }: { kind: Holder }) {
  const c = MASCOT_COLORS[kind];
  const k = SWAP_SEATS.w / 184;
  return (
    <g transform={`translate(${SWAP_SEATS[kind]} ${SWAP_FLOOR + 6}) scale(${k})`}>
      <ellipse cx="0" cy="4" rx="96" ry="14" fill="#000" opacity="0.14" />
      {[-1, 1].map((side) =>
        kind === "fox" ? (
          <g key={side} strokeLinejoin="round">
            <path d={`M${side * 26} -66 L${side * 50} -114 L${side * 66} -58 Z`} fill={c.fur} stroke={INK} strokeWidth="5" />
            <path d={`M${side * 38} -70 L${side * 50} -98 L${side * 56} -66 Z`} fill={c.earIn} />
          </g>
        ) : (
          <g key={side}>
            <circle cx={side * 48} cy="-78" r="22" fill={c.fur} stroke={INK} strokeWidth="5" />
            <circle cx={side * 48} cy="-78" r="11" fill={c.earIn} />
          </g>
        ),
      )}
      <path d="M-88 -14 C-96 -70 -50 -84 0 -84 C50 -84 96 -70 88 -14 C60 2 -60 2 -88 -14 Z" fill={c.fur} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M-70 -30 C-30 -18 30 -18 70 -30" fill="none" stroke={c.shade} strokeWidth="4" strokeDasharray="10 8" />
      <ellipse cx="-30" cy="-64" rx="26" ry="9" fill={c.light} opacity="0.8" />
    </g>
  );
}

/** A lamp hanging from the ceiling over a cushion, switched off (its light is a layer of its own, `SwapLight`). */
function Lamp({ kind }: { kind: Holder }) {
  const x = SWAP_SEATS[kind];
  const { rim, top, w } = LAMP;
  return (
    <g strokeLinejoin="round">
      <path d={`M${x} 0 V${top}`} stroke={INK} strokeWidth="5" />
      <circle cx={x} cy={rim + 4} r="20" fill="#fff9db" stroke={INK} strokeWidth="4" />
      <path
        d={`M${x - 22} ${top} H${x + 22} L${x + w / 2} ${rim} H${x - w / 2} Z`}
        fill={kind === "fox" ? "#f08c00" : "#8d5a3b"}
        stroke={INK}
        strokeWidth="5"
      />
    </g>
  );
}

/** A playroom with a rug and the lamps hanging over the children's places; drawn once. */
export const SwapBackdrop = memo(function SwapBackdrop() {
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-back">
      <svg viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} preserveAspectRatio="none">
        <rect width={STAGE_W} height={STAGE_H} fill="#e6f4ea" />
        <rect y={SWAP_FLOOR - 16} width={STAGE_W} height={STAGE_H} fill="#d9a066" />
        <path d={`M0 ${SWAP_FLOOR - 16} H${STAGE_W}`} stroke="#a8743f" strokeWidth="6" />
        <ellipse cx="800" cy={SWAP_FLOOR + 10} rx="640" ry="44" fill="#91a7ff" opacity="0.6" />
        <Lamp kind="fox" />
        <Lamp kind="bear" />
      </svg>
    </Layer>
  );
});

/** The two cushions, in front of the lamps' light so it never washes them out; drawn once. */
export const SwapCushions = memo(function SwapCushions() {
  const top = SWAP_FLOOR - 180;
  return (
    <Layer x={0} y={top} w={STAGE_W} h={220}>
      <svg viewBox={`0 ${top} ${STAGE_W} 220`}>
        <Cushion kind="fox" />
        <Cushion kind="bear" />
      </svg>
    </Layer>
  );
});

/**
 * The light of one lamp: the bulb glowing, a warm cone down to the cushion and a pool of light round it. On while it
 * is that child's turn (or while the lamps draw who begins), fading in and out as a whole (`opacity`).
 */
export function SwapLight({ kind, on }: { kind: Holder; on: boolean }) {
  const x = SWAP_SEATS[kind];
  const { rim, w, floorW } = LAMP;
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
        <path d={`M${x - w / 2 + 6} ${rim} L${x + w / 2 - 6} ${rim} L${x + floorW / 2} ${SWAP_FLOOR + 10} H${x - floorW / 2} Z`} fill={`url(#${id})`} />
        <ellipse cx={x} cy={SWAP_FLOOR + 10} rx={floorW / 2 + 30} ry="34" fill="#fff3bf" opacity="0.8" />
        <circle cx={x} cy={rim + 4} r="34" fill="#fff9db" opacity="0.7" />
        <circle cx={x} cy={rim + 4} r="20" fill="#fffbe6" stroke={INK} strokeWidth="4" />
      </svg>
    </Layer>
  );
}

/**
 * The soft shade over one side of the room while it is the other child's turn (or the other lamp's, while they draw):
 * up to the hourglass's frame, or up to `edge` where the two sides meet (Tennis: the net). With `cross` it changes a
 * moment later, as the ball crosses the net (`--tm-cross`).
 */
export function SwapShade({ kind, on, edge, cross = false }: { kind: Holder; on: boolean; edge?: number; cross?: boolean }) {
  const right = edge ?? SHADE.bear;
  const x = kind === "fox" ? 0 : right;
  const w = kind === "fox" ? (edge ?? SHADE.fox) : STAGE_W - right;
  return <Layer x={x} y={0} w={w} h={STAGE_H} className={`tm-swap-shade tm-swap-shade-${kind}${on ? " tm-on" : ""}${cross ? " tm-cross" : ""}`} />;
}

/**
 * The hourglass running one turn – the Sanduhr's own: the top heap sinks, the bottom one rises over `ms`, from
 * `startedAt` on, so it shows the turn's real time even when drawn later (a phone waking up). `flip` turns it over as it
 * comes, the full bottom going up – the hourglass turning itself over for the next child. Both are read once, as it
 * comes: give each turn its own `key`. While `waiting` (the lamps still draw who begins) it stands full, the sand still.
 */
export function SwapHourglass({ ms, startedAt, flip, waiting, glow }: { ms: number; startedAt: number; flip: boolean; waiting: boolean; glow: number }) {
  const [delay] = useState(() => (waiting ? 0 : Math.max(0, Date.now() - startedAt)));
  const [flipped] = useState(flip);
  return (
    <Hourglass
      running={!waiting}
      glow={glow}
      className={`tm-swap-glass${flipped ? " tm-flip" : ""}${waiting ? " tm-wait" : ""}`}
      style={{ "--tm-ms": `${ms}ms`, "--tm-delay": `${-delay}ms` } as CSSProperties}
    />
  );
}

/** The toys a grown-up can pick behind ⚙️, in their order there. */
export const SWAP_TOYS: { id: SwapToy; emoji: string; name: Localized }[] = [
  {
    id: "bobbycar",
    emoji: "🚗",
    name: { de: "Bobbycar", en: "Ride-on car", zh: "扭扭车", hi: "खिलौना कार", es: "Correpasillos", ar: "سيارة الأطفال", ru: "Каталка" },
  },
  { id: "doll", emoji: "🪆", name: { de: "Puppe", en: "Doll", zh: "娃娃", hi: "गुड़िया", es: "Muñeca", ar: "الدمية", ru: "Кукла" } },
  { id: "ball", emoji: "⚽", name: { de: "Ball", en: "Ball", zh: "球", hi: "गेंद", es: "Pelota", ar: "الكرة", ru: "Мяч" } },
];

/** The toy's drawing, in 160 × 130 units scaled to its layer, standing on its bottom edge. */
function ToyDrawing({ toy }: { toy: SwapToy }) {
  if (toy === "bobbycar")
    return (
      <svg viewBox="0 0 160 130">
        <path
          d="M14 88 C10 60 30 52 56 52 H96 L112 30 H130 L126 56 C146 60 152 74 148 90 Z"
          fill="#e03131"
          stroke={INK}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path d="M118 30 V14 M108 14 H130" stroke={INK} strokeWidth="6" strokeLinecap="round" />
        <rect x="52" y="40" width="40" height="16" rx="7" fill="#c92a2a" stroke={INK} strokeWidth="4" />
        <circle cx="138" cy="70" r="7" fill="#ffd43b" stroke={INK} strokeWidth="3" />
        {[40, 120].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="104" r="22" fill="#343a40" stroke={INK} strokeWidth="4" />
            <circle cx={cx} cy="104" r="9" fill="#f8f9fa" />
          </g>
        ))}
      </svg>
    );
  if (toy === "doll")
    return (
      <svg viewBox="0 0 160 130">
        <path d="M54 126 L64 70 H96 L106 126 Z" fill="#cc5de8" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M58 82 L40 104 M102 82 L120 104" stroke={INK} strokeWidth="10" strokeLinecap="round" />
        <path d="M58 82 L40 104 M102 82 L120 104" stroke="#ffd8a8" strokeWidth="5" strokeLinecap="round" />
        <circle cx="80" cy="44" r="30" fill="#ffd8a8" stroke={INK} strokeWidth="5" />
        <path d="M50 42 C50 14 110 14 110 42 C104 28 94 24 80 26 C66 24 56 28 50 42 Z" fill="#f59f00" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <circle cx="70" cy="46" r="4" fill={INK} />
        <circle cx="90" cy="46" r="4" fill={INK} />
        <path d="M72 58 Q80 64 88 58" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <circle cx="64" cy="56" r="5" fill="#ffa8a8" opacity="0.8" />
        <circle cx="96" cy="56" r="5" fill="#ffa8a8" opacity="0.8" />
      </svg>
    );
  return (
    <svg viewBox="0 0 160 130">
      <circle cx="80" cy="72" r="54" fill="#fff" stroke={INK} strokeWidth="5" />
      <path d="M80 50 L101 65 L93 90 H67 L59 65 Z" fill="#343a40" />
      <path d="M80 50 V20 M101 65 L130 56 M93 90 L110 116 M67 90 L50 116 M59 65 L30 56" stroke="#343a40" strokeWidth="5" />
    </svg>
  );
}

/** Where the toy is: on a child's cushion, or in front of the hourglass while the lamps draw who begins. */
export type ToyPlace = Holder | "middle";

/**
 * The toy, sitting on the cushion of the child whose turn it is. It travels by `transform` (a CSS transition), and
 * hops up on its way (`hop`, a new number for every move), so the move is seen and heard from afar.
 */
export function Toy({ toy, place, hop = 0 }: { toy: SwapToy; place: ToyPlace; hop?: number }) {
  const x = (p: ToyPlace) => (p === "middle" ? 800 : SWAP_SEATS[p]);
  const bottom = place === "middle" ? TOY.waiting : TOY.onCushion;
  const dx = ((x(place) - x("fox")) / TOY.w) * 100;
  const dy = ((bottom - TOY.onCushion) / TOY.h) * 100;
  return (
    <Layer x={x("fox") - TOY.w / 2} y={TOY.onCushion - TOY.h} w={TOY.w} h={TOY.h} className="tm-toy tm-move" style={{ transform: `translate(${dx}%, ${dy}%)` }}>
      <div key={hop} className={hop ? "tm-toy-hop" : undefined}>
        <ToyDrawing toy={toy} />
      </div>
    </Layer>
  );
}
