import { type CSSProperties, memo, useMemo } from "react";
import { type Hop, Hopper, hopKeyframes } from "./hop";
import { type Frame, holdToEnd, keyframes } from "./keyframes";
import { Draw, INK, Layer, LeftGlow, STAGE_H, STAGE_W } from "./scenes";

// The block house (H-125, user request, 22 November 2026: timers that look like watching a well-known kind of game,
// starting with a block-building world, for tidying up): a meadow of blocks under a blue sky, a jumble of loose blocks –
// stone, wood and red roof tiles – lying on the left, and on the right a house's plan, its blocks' places drawn dashed
// like a blueprint (the goal, seen from the start). One after the other a block hops out of the jumble onto its place in
// the house, from the bottom row up as one builds, while a block outline like a game's cursor already stands on the
// place of the next. When the roof is shut, the light goes on inside. The jumble getting smaller is the time left, the
// house growing the time gone. A genre's look of our own – own blocks and colours, no figure, nothing of one game.

/** A block's front face and how deep it is seen (its top and right side), and its square layer. */
export const FACE = 72;
export const DEPTH = 20;
export const BLOCK = FACE + DEPTH;

/** What a block is made of: the stone of the bottom row, the wood of the walls, the red tiles of the roof. */
export type BlockKind = "stone" | "wood" | "roof";

/** The house: its left edge and the foot of its bottom row, on the meadow at the right. */
export const HOUSE = { x: 940, foot: 720 } as const;

/** The house's places in the order they are built, from the bottom row up and left to right: column, row and kind. */
export const SLOTS: readonly { c: number; r: number; kind: BlockKind }[] = [
  // The stone row, with the door's gap in the middle.
  ...[0, 1, 3, 4].map((c) => ({ c, r: 0, kind: "stone" as const })),
  // The wooden walls: beside the two windows and the door, then a whole row over them.
  ...[0, 4].map((c) => ({ c, r: 1, kind: "wood" as const })),
  ...[0, 1, 2, 3, 4].map((c) => ({ c, r: 2, kind: "wood" as const })),
  // The roof in steps up to its top block.
  ...[0, 1, 2, 3, 4].map((c) => ({ c, r: 3, kind: "roof" as const })),
  ...[1, 2, 3].map((c) => ({ c, r: 4, kind: "roof" as const })),
  { c: 2, r: 5, kind: "roof" },
];

/** How many blocks the house has: five minutes build all of them, one every 15 seconds. */
export const MAX_BLOCKS = SLOTS.length;

/** The fewest blocks a run moves: a short time starts with the lower part of the house already standing. */
export const MIN_BLOCKS = 8;

/** How many blocks hop into the house in a run of `ms`. */
export function blockCount(ms: number): number {
  return Math.max(MIN_BLOCKS, Math.min(MAX_BLOCKS, Math.round(ms / 15_000)));
}

/** The openings in the walls, as places of the grid: the door (two rows high) and the two windows. */
export const DOOR = { c: 2, r: 0, h: 2 } as const;
export const WINDOWS: readonly { c: number; r: number }[] = [
  { c: 1, r: 1 },
  { c: 3, r: 1 },
];

/** Where a place's block has its foot's middle (its layer's bottom middle). */
export function slotFoot(c: number, r: number): { x: number; y: number } {
  return { x: HOUSE.x + c * FACE + BLOCK / 2, y: HOUSE.foot - r * FACE };
}

/**
 * Where the loose blocks lie in the jumble, their feet's middles and how askew they lie: three rows on the meadow left
 * of the house, each a little off the next and some blocks tipped, so it looks like blocks dropped anywhere. Back row
 * first.
 */
export const JUMBLE: readonly { x: number; y: number; tilt: number }[] = [
  ...[276, 374, 474, 570, 674, 772, 872].map((x, i) => ({ x, y: 598 + ((i * 7) % 4) * 7, tilt: [-8, 4, 0, 10, -5, 0, 7][i] })),
  ...[322, 420, 518, 616, 716, 818].map((x, i) => ({ x, y: 688 + ((i * 5) % 4) * 6, tilt: [6, 0, -9, 3, 0, -6][i] })),
  ...[280, 378, 478, 576, 676, 774, 874].map((x, i) => ({ x, y: 776 - ((i * 3) % 4) * 4, tilt: [0, -6, 8, 0, 5, -8, 0][i] })),
];

/** Which of the jumble's rows a place lies in (0 at the back): a row further front covers the one behind it. */
export const jumbleRow = (place: number): number => (place < 7 ? 0 : place < 13 ? 1 : 2);

/** Which place of the jumble the block for each place of the house lies on: mixed, so stone, wood and tiles lie anywhere. */
const FROM: readonly number[] = [9, 2, 16, 5, 12, 0, 18, 7, 14, 3, 11, 19, 6, 1, 15, 10, 4, 17, 8, 13];

/** One block that hops: the place of the house it goes to (`SLOTS`), its kind and its hop. */
export interface MovingBlock {
  k: number;
  kind: BlockKind;
  hop: Hop;
}

/** How long a hop takes at most (less when blocks come quickly). */
export const BLOCK_HOP_MS = 900;

/**
 * Works out a run of `total` ms moving `count` blocks: the house's first places beyond those stand from the start
 * (`built`), and each block moved has the same share of the time – it waits its turn (wiggling once a second), hops
 * and lands at the end of its share, the last as the time is up.
 */
export function blocksPlan(total: number, count: number): { built: number; blocks: MovingBlock[] } {
  const built = MAX_BLOCKS - count;
  const unit = total / count;
  const hopMs = Math.min(BLOCK_HOP_MS, unit * 0.4);
  const blocks: MovingBlock[] = [];
  for (let i = 0; i < count; i++) {
    const k = built + i;
    const slot = SLOTS[k];
    const { tilt, ...from } = JUMBLE[FROM[k]];
    const to = slotFoot(slot.c, slot.r);
    const land = (i + 1) * unit;
    const start = land - hopMs;
    const since = i * unit + 300;
    blocks.push({
      k,
      kind: slot.kind,
      hop: {
        from,
        to,
        scale: 1,
        start,
        land,
        // High over the jumble's back row, so it never seems to pass behind a block lying there.
        peak: Math.min(from.y, to.y, 600) - 110,
        waitFrom: start - since >= 1000 ? since : undefined,
        tilt: tilt || undefined,
      },
    });
  }
  return { built, blocks };
}

/** A transform moving a layer standing on place `a` of the house to place `b`, in % of its own size. */
function slotShift(a: number, b: number): string {
  const from = slotFoot(SLOTS[a].c, SLOTS[a].r);
  const to = slotFoot(SLOTS[b].c, SLOTS[b].r);
  return `translate(${(((to.x - from.x) / BLOCK) * 100).toFixed(2)}%, ${(((to.y - from.y) / BLOCK) * 100).toFixed(2)}%)`;
}

/** The cursor's keyframes: on the next block's place from the moment the one before has landed, jumping on at once. */
export function cursorFrames(blocks: MovingBlock[]): Frame[] {
  const first = blocks[0].k;
  return blocks.map((b, i) => ({ at: i ? blocks[i - 1].hop.land : 0, transform: slotShift(first, b.k), ease: "step-end" }));
}

/**
 * A block's stacking as keyframes: lying in the jumble by its row (the front rows over the back ones) and under every
 * block of the house, and from the moment it hops over all of them and the jumble, and under the ones built after it –
 * so the house's blocks always cover each other rightly.
 */
function stackKeyframes(name: string, total: number, block: MovingBlock): string {
  const at = ((Math.max(0, block.hop.start) / total) * 100).toFixed(3);
  const row = jumbleRow(FROM[block.k]);
  return `@keyframes ${name} {0% { z-index: ${row}; animation-timing-function: step-end; } ${at}% { z-index: ${100 + block.k}; } 100% { z-index: ${100 + block.k}; }}`;
}

/** The blocks' hops, their stacking and the cursor's way as keyframes made for this run. */
function BlocksKeyframes({ total, blocks }: { total: number; blocks: MovingBlock[] }) {
  const rules = blocks.flatMap((b) => [...hopKeyframes(`tm-blocks-${b.k}`, total, b.hop, BLOCK), stackKeyframes(`tm-blocks-z-${b.k}`, total, b)]);
  rules.push(keyframes("tm-blocks-cursor", total, holdToEnd(cursorFrames(blocks), total)));
  return <style>{rules.join("\n")}</style>;
}

/** The faces' colours of each kind: front, top, the shaded right side, and the darker and lighter specks of its grain. */
const KIND_COLORS: Record<BlockKind, { front: string; top: string; side: string; dark: string; light: string }> = {
  stone: { front: "#9aa3ab", top: "#c6cdd3", side: "#7b848c", dark: "#7f8890", light: "#b8c0c7" },
  wood: { front: "#cf8f52", top: "#e6b37a", side: "#a8703c", dark: "#9c632f", light: "#dfa368" },
  roof: { front: "#e2574c", top: "#f3867c", side: "#b63a31", dark: "#a8322a", light: "#f07468" },
};

/** One block, seen from the front and a little from above and the right, in a `BLOCK` square standing on its bottom. */
export function BlockArt({ kind }: { kind: BlockKind }) {
  const c = KIND_COLORS[kind];
  const F = FACE;
  const D = DEPTH;
  const line = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const };
  // The grain of its front: a few square specks, as blocks in a block world have – each kind its own pattern.
  const specks: [number, number, boolean][] =
    kind === "stone"
      ? [
          [8, 10, true],
          [40, 6, false],
          [22, 30, true],
          [52, 34, true],
          [10, 50, false],
          [36, 54, true],
          [56, 58, false],
        ]
      : kind === "wood"
        ? [
            [12, 8, false],
            [46, 26, false],
            [20, 44, false],
            [54, 62, false],
          ]
        : [
            [6, 12, false],
            [42, 12, false],
            [24, 36, false],
            [58, 36, false],
          ];
  return (
    <svg viewBox={`0 0 ${BLOCK} ${BLOCK}`}>
      <path d={`M0 ${D} L${D} 0 H${BLOCK} L${F} ${D} Z`} fill={c.top} {...line} />
      <path d={`M${F} ${D} L${BLOCK} 0 V${F} L${F} ${BLOCK} Z`} fill={c.side} {...line} />
      <g transform={`translate(0 ${D})`}>
        <rect width={F} height={F} fill={c.front} />
        {kind === "wood" && [18, 36, 54].map((y) => <path key={y} d={`M0 ${y} H${F}`} stroke={c.dark} strokeWidth="3" />)}
        {kind === "wood" &&
          [
            [30, 0],
            [52, 18],
            [18, 36],
            [44, 54],
          ].map(([x, y]) => <path key={`${x}-${y}`} d={`M${x} ${y} v18`} stroke={c.dark} strokeWidth="3" />)}
        {kind === "roof" && [24, 48].map((y) => <path key={y} d={`M0 ${y} H${F}`} stroke={c.dark} strokeWidth="3" />)}
        {kind === "roof" &&
          [
            [24, 0],
            [56, 0],
            [12, 24],
            [42, 24],
            [28, 48],
            [58, 48],
          ].map(([x, y]) => <path key={`${x}-${y}`} d={`M${x} ${y} v24`} stroke={c.dark} strokeWidth="3" />)}
        {specks.map(([x, y, dark]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="9" height="9" fill={dark ? c.dark : c.light} />
        ))}
        <rect width={F} height={F} fill="none" {...line} />
      </g>
    </svg>
  );
}

/** The sky, the far hills of blocks, square clouds and the meadow; drawn once, stepping back from afar (H-48). */
const BlocksBackdrop = memo(function BlocksBackdrop() {
  const ground = 540;
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-back">
      <Draw w={STAGE_W} h={STAGE_H}>
        <defs>
          <linearGradient id="tm-blocks-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7cc6ff" />
            <stop offset="1" stopColor="#d6efff" />
          </linearGradient>
        </defs>
        <rect width={STAGE_W} height={ground} fill="url(#tm-blocks-sky)" />
        {/* Square clouds, standing still. */}
        {[
          [260, 120],
          [700, 80],
          [1240, 140],
        ].map(([x, y]) => (
          <g key={x} fill="#fff" stroke="#e3f2fd" strokeWidth="3">
            <rect x={x} y={y} width="160" height="36" />
            <rect x={x + 36} y={y - 28} width="88" height="30" />
          </g>
        ))}
        {/* Far hills of blocks in steps, pale with distance. */}
        <path
          d={`M0 ${ground} V430 H120 V400 H240 V370 H360 V400 H480 V440 H600 V410 H720 V450 H900 V420 H1020 V380 H1140 V350 H1260 V390 H1380 V420 H1500 V400 H${STAGE_W} V${ground} Z`}
          fill="#a9dca0"
          stroke="#8cc883"
          strokeWidth="4"
        />
        {/* The meadow seen from above: grass with the faint seams of the blocks it is made of, and a few lighter tufts. */}
        <rect y={ground} width={STAGE_W} height={STAGE_H - ground} fill="#7ccf68" />
        {[600, 670, 745, 830].map((y) => (
          <path key={y} d={`M0 ${y} H${STAGE_W}`} stroke="#6fc05b" strokeWidth="3" />
        ))}
        {Array.from({ length: 22 }, (_, i) => (
          <path key={i} d={`M${40 + i * 72} ${ground} V${STAGE_H}`} stroke="#6fc05b" strokeWidth="3" />
        ))}
        {Array.from({ length: 18 }, (_, i) => (
          <rect key={i} x={70 + ((i * 397) % 1460)} y={560 + ((i * 131) % 320)} width="10" height="10" fill="#9be08a" />
        ))}
        <path d={`M0 ${ground} H${STAGE_W}`} stroke="#5aa84a" strokeWidth="5" />
      </Draw>
    </Layer>
  );
});

/**
 * The house's plan, bright from afar since it is where the time goes: its inside – a dark back wall the openings look
 * into – and each block's place drawn dashed, like a blueprint; drawn once. The blocks built cover their places.
 */
const HousePlan = memo(function HousePlan() {
  const x = HOUSE.x;
  const top = HOUSE.foot - 3 * FACE;
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H}>
      <Draw w={STAGE_W} h={STAGE_H}>
        <rect x={x + DEPTH / 2} y={top} width={5 * FACE} height={3 * FACE} fill="#5c3b22" />
        {[1, 2].map((n) => (
          <path key={n} d={`M${x + DEPTH / 2} ${top + n * FACE} h${5 * FACE}`} stroke="#4a2e19" strokeWidth="4" />
        ))}
        {SLOTS.map((s) => {
          const foot = slotFoot(s.c, s.r);
          return (
            <rect
              key={`${s.c}-${s.r}`}
              x={foot.x - BLOCK / 2 + 4}
              y={foot.y - FACE + 4}
              width={FACE - 8}
              height={FACE - 8}
              fill="rgb(255 255 255 / 0.18)"
              stroke="#fff"
              strokeWidth="4"
              strokeDasharray="12 9"
            />
          );
        })}
      </Draw>
    </Layer>
  );
});

/** The light inside, shining out of the windows and the door once the house is built: hidden until the end. */
const HouseLight = memo(function HouseLight() {
  const holes = [...WINDOWS.map((w) => ({ ...w, h: 1 })), DOOR];
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-blocks-light">
      <Draw w={STAGE_W} h={STAGE_H}>
        {holes.map((o) => {
          const foot = slotFoot(o.c, o.r);
          return (
            <rect
              key={`${o.c}-${o.r}`}
              x={foot.x - BLOCK / 2}
              y={foot.y - o.h * FACE}
              width={FACE}
              height={o.h * FACE}
              fill="#ffd866"
              stroke={INK}
              strokeWidth="3"
            />
          );
        })}
      </Draw>
    </Layer>
  );
});

/** The blocks standing from the start in a short run: the house's first `built` places. */
const BuiltBlocks = memo(function BuiltBlocks({ built }: { built: number }) {
  return (
    <>
      {SLOTS.slice(0, built).map((s, k) => {
        const foot = slotFoot(s.c, s.r);
        return (
          <Layer key={k} x={foot.x - BLOCK / 2} y={foot.y - BLOCK} w={BLOCK} h={BLOCK} style={{ zIndex: 100 + k }}>
            <BlockArt kind={s.kind} />
          </Layer>
        );
      })}
    </>
  );
});

/** A frame round the next block's place, as a block game marks the block one points at: dark with a light rim. */
const Cursor = memo(function Cursor({ blocks }: { blocks: MovingBlock[] }) {
  const first = SLOTS[blocks[0].k];
  const foot = slotFoot(first.c, first.r);
  const F = FACE;
  const D = DEPTH;
  const outline = `M0 ${D} H${F} V${BLOCK} H0 Z M0 ${D} L${D} 0 H${BLOCK} L${F} ${D} M${BLOCK} 0 V${F} L${F} ${BLOCK}`;
  return (
    <Layer
      x={foot.x - BLOCK / 2}
      y={foot.y - BLOCK}
      w={BLOCK}
      h={BLOCK}
      className="tm-hop tm-blocks-cursor"
      style={{ "--tm-anim": "tm-blocks-cursor", zIndex: 300 } as CSSProperties}
    >
      <svg viewBox={`0 0 ${BLOCK} ${BLOCK}`}>
        <path d={outline} fill="none" stroke="#fff" strokeWidth="9" strokeLinejoin="round" />
        <path d={outline} fill="none" stroke="#212529" strokeWidth="4" strokeLinejoin="round" />
      </svg>
    </Layer>
  );
});

/** Little square crumbs springing off a block as it lands, as in a block game: one small layer per block, at its landing. */
function Crumbs({ block }: { block: MovingBlock }) {
  const { to } = block.hop;
  const colors = KIND_COLORS[block.kind];
  return (
    <Layer
      x={to.x - BLOCK}
      y={to.y - BLOCK}
      w={2 * BLOCK}
      h={BLOCK}
      className="tm-blocks-crumbs"
      style={{ "--tm-at": `${block.hop.land}ms`, zIndex: 200 } as CSSProperties}
    >
      <svg viewBox={`0 0 ${2 * BLOCK} ${BLOCK}`}>
        {[
          [30, 70],
          [52, 50],
          [140, 52],
          [158, 74],
          [44, 84],
          [148, 86],
        ].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="12" height="12" fill={i % 2 ? colors.dark : colors.top} stroke={INK} strokeWidth="2" />
        ))}
      </svg>
    </Layer>
  );
}

/** Each moving block on its hop inside a stacking box of its own; while it lies in the jumble a tap lights it (H-51). */
const MovingBlocks = memo(function MovingBlocks({ blocks, glow }: { blocks: MovingBlock[]; glow: number }) {
  return (
    <>
      {blocks.map((b) => (
        <div key={b.k} className="tm-blocks-z" style={{ "--tm-anim": `tm-blocks-z-${b.k}`, "--tm-z-end": 100 + b.k } as CSSProperties}>
          <Hopper name={`tm-blocks-${b.k}`} hop={b.hop} size={BLOCK} extra={<LeftGlow n={glow} />}>
            <BlockArt kind={b.kind} />
          </Hopper>
        </div>
      ))}
    </>
  );
});

/** The landing crumbs of every moving block; drawn once. */
const AllCrumbs = memo(function AllCrumbs({ blocks }: { blocks: MovingBlock[] }) {
  return (
    <>
      {blocks.map((b) => (
        <Crumbs key={b.k} block={b} />
      ))}
    </>
  );
});

/** The whole picture: the meadow, the house's plan and its light, the blocks built and those still to come, the cursor. */
export function BlocksScene({ count, total, glow }: { count: number; total: number; glow: number }) {
  // Worked out once for the run, so the memoised parts are not drawn again when a tap lights the blocks.
  const { built, blocks } = useMemo(() => blocksPlan(total, count), [total, count]);
  return (
    <>
      <BlocksBackdrop />
      <div className="tm-blocks">
        <HousePlan />
        <HouseLight />
        <BlocksKeyframes total={total} blocks={blocks} />
        <BuiltBlocks built={built} />
        <Cursor blocks={blocks} />
        <MovingBlocks blocks={blocks} glow={glow} />
        <AllCrumbs blocks={blocks} />
      </div>
    </>
  );
}
