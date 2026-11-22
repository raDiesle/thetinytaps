import { type CSSProperties, memo, useMemo } from "react";
import { type Frame, holdToEnd, keyframes } from "./keyframes";
import { Draw, INK, Layer, LeftGlow, STAGE_H, STAGE_W } from "./scenes";

// The block house (H-125, user request, 22 November 2026: timers that look like watching a well-known kind of game,
// starting with a block-building world, for tidying up): a meadow of blocks under a blue sky, a jumble of loose blocks –
// stone, wood and red roof tiles – lying on the left, and on the right a house's plan, its blocks' places drawn dashed
// like a blueprint (the goal, seen from the start). A crystal floats in the sky over the jumble, and its beam carries one
// block after the other onto its place in the house as if by telekinesis, from the bottom row up as one builds: the
// beam turns onto the block, lifts it, carries it floating across – now and then it lets go for a moment, the block
// slips and is caught again – and lowers it onto its place, while a block outline like a game's cursor already stands
// there. Every block is on its way all its share of the time (user request, 22 November 2026: the more movement towards
// the goal is seen, the better). When the roof is shut, the light goes on inside. The jumble getting smaller is the time
// left, the house growing the time gone. A genre's look of our own – own blocks and colours, no figure, nothing of one
// game.

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

/** How many blocks the beam carries into the house in a run of `ms`. */
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

/**
 * The crystal floating in the sky over the jumble, whose beam carries the blocks one after the other like telekinesis
 * (user request, 22 November 2026: blocks wander slowly to their place, moving all the time, rather than hopping at the
 * end of their share): its box and the tip at its foot where the beam starts.
 */
export const GEM = { x: 520, y: 110, w: 80, h: 96, tip: { x: 560, y: 202 } } as const;

/** The beam's layer: as wide as its glow, `BEAM_L` long pointing straight down, turned and stretched onto its block. */
export const BEAM_W = 96;
export const BEAM_L = 100;

/** How high a block's foot floats over the jumble, clear of every block lying there. */
export const FLOAT_FOOT = 430;

/** How far above its place a block comes before it is lowered onto it. */
export const OVER_PLACE = 110;

/** Each block's share of the time, in parts: the beam turns onto it, lifts it, carries it over, lowers it. */
export const PHASES = { aim: 0.07, lift: 0.3, lower: 0.8 } as const;

/** How far a block slips down when the beam lets go for a moment, how long it falls, and from what share it does. */
export const SLIP = 60;
export const SLIP_FALL_MS = 380;
const DROP_FROM_MS = 6000;

/** The gentle bob of a floating block, one up and down this long. */
export const BOB_MS = 2000;

/** One block the beam carries: the place of the house it goes to (`SLOTS`), its kind and its way. */
export interface MovingBlock {
  k: number;
  kind: BlockKind;
  /** Its foot's middle in the jumble, and how askew it lies there (degrees). */
  from: { x: number; y: number };
  tilt: number;
  /** Its foot's middle on its place in the house. */
  to: { x: number; y: number };
  /** How high its foot comes over its place before it is lowered. */
  over: number;
  /** When the beam leaves the block before it and turns onto this one (the one before has just landed). */
  start: number;
  /** When it lands on its place: at the end of its share. */
  land: number;
  /** When the beam lets go of it for a moment and it slips down a little, caught again; none for most. */
  drop?: number;
}

/** When each phase of a block's share begins after the beam has turned onto it: lifted, carried across, lowered. */
export function phaseTimes(b: MovingBlock) {
  const share = b.land - b.start;
  return {
    lift: b.start + share * PHASES.aim,
    carry: b.start + share * PHASES.lift,
    lower: b.start + share * PHASES.lower,
  };
}

/** How long the beam takes to catch a block that slipped and lift it back up. */
export const catchMs = (b: MovingBlock) => Math.min(1400, (b.land - b.start) * 0.15);

/**
 * Works out a run of `total` ms moving `count` blocks: the house's first places beyond those stand from the start
 * (`built`), and each block moved has the same share of the time, all of it on its way – the beam turns onto it, lifts
 * it out of the jumble, carries it over floating and lowers it onto its place, landing at the end of its share, the
 * last as the time is up. Every third block slips once on its way where its share is long enough.
 */
export function blocksPlan(total: number, count: number): { built: number; blocks: MovingBlock[] } {
  const built = MAX_BLOCKS - count;
  const unit = total / count;
  const blocks: MovingBlock[] = [];
  for (let i = 0; i < count; i++) {
    const k = built + i;
    const slot = SLOTS[k];
    const { tilt, ...from } = JUMBLE[FROM[k]];
    const to = slotFoot(slot.c, slot.r);
    const start = i * unit;
    blocks.push({
      k,
      kind: slot.kind,
      from,
      tilt,
      to,
      over: Math.min(FLOAT_FOOT, to.y - OVER_PLACE),
      start,
      land: (i + 1) * unit,
      // Halfway across, while it floats.
      drop: i % 3 === 1 && unit >= DROP_FROM_MS ? start + unit * 0.5 : undefined,
    });
  }
  return { built, blocks };
}

const smooth = (v: number) => v * v * (3 - 2 * v);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Where a carried block's foot is at `t` ms, how it is turned, and whether the beam holds it. */
export interface Pose {
  x: number;
  y: number;
  rot: number;
  held: boolean;
}

/** A carried block's pose on its way at `t` ms after the run's start, without slipping. */
function wayPose(b: MovingBlock, t: number): Pose {
  const p = phaseTimes(b);
  if (t <= p.lift) return { ...b.from, rot: b.tilt, held: t >= p.lift };
  if (t >= b.land) return { ...b.to, rot: 0, held: false };
  if (t <= p.carry) {
    // Straight up out of the jumble, straightening as it rises.
    const v = (t - p.lift) / (p.carry - p.lift);
    return { x: b.from.x, y: b.from.y + (FLOAT_FOOT - b.from.y) * smooth(v), rot: b.tilt * (1 - smooth(v)), held: true };
  }
  if (t <= p.lower) {
    // Across in a gentle arc, leaning back a little as it is pulled along, rising to over its place.
    const v = (t - p.carry) / (p.lower - p.carry);
    const s = smooth(v);
    return {
      x: b.from.x + (b.to.x - b.from.x) * s,
      y: FLOAT_FOOT + (b.over - FLOAT_FOOT) * s - 36 * Math.sin(Math.PI * v),
      rot: -5 * Math.sin(Math.PI * v) * Math.sign(b.to.x - b.from.x),
      held: true,
    };
  }
  // Lowered slowly onto its place.
  const v = (t - p.lower) / (b.land - p.lower);
  return { x: b.to.x, y: b.over + (b.to.y - b.over) * smooth(v), rot: 0, held: true };
}

/**
 * A carried block's pose at `t` ms after the run's start (`MovingBlock`): on its way, except where the beam lets go –
 * then it falls straight down from where it was, and the beam catches it and draws it back onto its way.
 */
export function blockPose(b: MovingBlock, t: number): Pose {
  if (b.drop === undefined || t < b.drop) return wayPose(b, t);
  const fell = t - b.drop;
  const there = wayPose(b, b.drop);
  if (fell <= SLIP_FALL_MS) return { ...there, y: there.y + SLIP * (fell / SLIP_FALL_MS) ** 2, held: false };
  const w = (fell - SLIP_FALL_MS) / catchMs(b);
  if (w >= 1) return wayPose(b, t);
  const back = wayPose(b, t);
  const k = smooth(w);
  return { x: there.x + (back.x - there.x) * k, y: there.y + SLIP + (back.y - there.y - SLIP) * k, rot: there.rot + (back.rot - there.rot) * k, held: true };
}

/**
 * The moments a block's way is written at: the phases cut into even steps, finer where it slips, so the block (on its
 * own keyframes) and the beam's tip (turned and stretched onto it) follow one way and never part.
 */
function poseTimes(b: MovingBlock): number[] {
  const p = phaseTimes(b);
  const steps = (a: number, z: number, n: number) => Array.from({ length: n + 1 }, (_, i) => a + ((z - a) * i) / n);
  const times = [...steps(b.start, p.lift, 4), ...steps(p.lift, p.carry, 8), ...steps(p.carry, p.lower, 18), ...steps(p.lower, b.land, 8)];
  if (b.drop !== undefined) times.push(...steps(b.drop, b.drop + SLIP_FALL_MS, 6), ...steps(b.drop + SLIP_FALL_MS, b.drop + SLIP_FALL_MS + catchMs(b), 8));
  return [...new Set(times)].sort((a, c) => a - c);
}

/** The middle of a block's front at a pose: where the beam's tip lies on it. */
const poseMiddle = (pose: { x: number; y: number }) => ({ x: pose.x, y: pose.y - BLOCK / 2 });

/** The beam's transform reaching from the crystal's tip to `point`: turned from straight down, stretched to its length. */
export function beamTransform(point: { x: number; y: number }): string {
  const dx = point.x - GEM.tip.x;
  const dy = point.y - GEM.tip.y;
  const angle = (Math.atan2(-dx, dy) * 180) / Math.PI;
  return `rotate(${angle.toFixed(2)}deg) scaleY(${(Math.hypot(dx, dy) / BEAM_L).toFixed(3)})`;
}

/** The beam's way as keyframes: onto each block in turn while the one before rests, then along with it to its place. */
export function beamFrames(blocks: MovingBlock[]): Frame[] {
  const frames: Frame[] = [];
  blocks.forEach((b, i) => {
    const target = poseMiddle(b.from);
    // From the place of the block before, or for the first from just under the crystal.
    const before = i ? poseMiddle(blocks[i - 1].to) : { x: GEM.tip.x + (target.x - GEM.tip.x) * 0.15, y: GEM.tip.y + (target.y - GEM.tip.y) * 0.15 };
    const p = phaseTimes(b);
    for (const t of poseTimes(b)) {
      const point =
        t <= p.lift
          ? (() => {
              const v = smooth(clamp01((t - b.start) / (p.lift - b.start)));
              return { x: before.x + (target.x - before.x) * v, y: before.y + (target.y - before.y) * v };
            })()
          : poseMiddle(blockPose(b, t));
      frames.push({ at: t, transform: beamTransform(point), ease: "linear" });
    }
  });
  return frames;
}

/** An opacity at a moment, for keyframes of `opacity` written for the run. */
type Shade = { at: number; o: number };

/** A `@keyframes` rule of `opacity` for a run of `total` ms, linear between its points. */
function opacityKeyframes(name: string, total: number, shades: Shade[]): string {
  const percent = (ms: number) => ((Math.max(0, Math.min(ms, total)) / total) * 100).toFixed(4);
  return `@keyframes ${name} {${shades.map((s) => `${percent(s.at)}% { opacity: ${s.o}; }`).join(" ")}}`;
}

/** The beam's light: coming on at the start, flickering off where a block slips and on as it is caught, off at the end. */
export function beamShades(blocks: MovingBlock[]): Shade[] {
  const first = phaseTimes(blocks[0]).lift;
  const shades: Shade[] = [
    { at: 0, o: 0 },
    { at: Math.min(400, first), o: 1 },
  ];
  for (const b of blocks)
    if (b.drop !== undefined)
      shades.push(
        { at: b.drop, o: 1 },
        { at: b.drop + 40, o: 0.2 },
        { at: b.drop + 80, o: 0.8 },
        { at: b.drop + 120, o: 0 },
        { at: b.drop + SLIP_FALL_MS, o: 0 },
        { at: b.drop + SLIP_FALL_MS + 80, o: 1 },
      );
  const end = blocks[blocks.length - 1].land;
  shades.push({ at: end, o: 1 }, { at: end + 500, o: 0 });
  return shades;
}

/** A carried block's own glow while the beam holds it: on as the beam reaches it, off while it slips, off as it lands. */
function auraShades(b: MovingBlock): Shade[] {
  const held = phaseTimes(b).lift;
  const shades: Shade[] = [
    { at: 0, o: 0 },
    { at: b.start, o: 0 },
    { at: held, o: 1 },
  ];
  if (b.drop !== undefined)
    shades.push({ at: b.drop + 60, o: 1 }, { at: b.drop + 120, o: 0 }, { at: b.drop + SLIP_FALL_MS, o: 0 }, { at: b.drop + SLIP_FALL_MS + 80, o: 1 });
  shades.push({ at: b.land - 1, o: 1 }, { at: b.land + 300, o: 0 });
  return shades;
}

/** A block's way as keyframes: lying in the jumble, then along its pose, resting on its place after it lands. */
function blockFrames(b: MovingBlock): Frame[] {
  const move = (pose: Pose) =>
    `translate(${(((pose.x - b.from.x) / BLOCK) * 100).toFixed(2)}%, ${(((pose.y - b.from.y) / BLOCK) * 100).toFixed(2)}%) rotate(${pose.rot.toFixed(2)}deg)`;
  return [
    { at: 0, transform: move(blockPose(b, 0)), ease: "linear" },
    ...poseTimes(b).map((t) => ({ at: t, transform: move(blockPose(b, t)), ease: "linear" })),
  ];
}

/** Where a block rests after landing, as its layer's transform (for the end, once animations are off). */
const restTransform = (b: MovingBlock) =>
  `translate(${(((b.to.x - b.from.x) / BLOCK) * 100).toFixed(2)}%, ${(((b.to.y - b.from.y) / BLOCK) * 100).toFixed(2)}%) rotate(0deg)`;

/** A transform moving a layer standing on place `a` of the house to place `b`, in % of its own size. */
function slotShift(a: number, b: number): string {
  const from = slotFoot(SLOTS[a].c, SLOTS[a].r);
  const to = slotFoot(SLOTS[b].c, SLOTS[b].r);
  return `translate(${(((to.x - from.x) / BLOCK) * 100).toFixed(2)}%, ${(((to.y - from.y) / BLOCK) * 100).toFixed(2)}%)`;
}

/** The cursor's keyframes: on the next block's place from the moment the one before has landed, jumping on at once. */
export function cursorFrames(blocks: MovingBlock[]): Frame[] {
  const first = blocks[0].k;
  return blocks.map((b, i) => ({ at: i ? blocks[i - 1].land : 0, transform: slotShift(first, b.k), ease: "step-end" }));
}

/**
 * A block's stacking as keyframes: lying in the jumble by its row (the front rows over the back ones) and under every
 * block of the house, and from the moment it rises over all of them and the jumble, and under the ones built after it –
 * so the house's blocks always cover each other rightly.
 */
function stackKeyframes(name: string, total: number, block: MovingBlock): string {
  const at = ((phaseTimes(block).lift / total) * 100).toFixed(3);
  const row = jumbleRow(FROM[block.k]);
  return `@keyframes ${name} {0% { z-index: ${row}; animation-timing-function: step-end; } ${at}% { z-index: ${100 + block.k}; } 100% { z-index: ${100 + block.k}; }}`;
}

/** The blocks' ways, glows and stacking, the beam's way and light and the cursor's way as keyframes made for this run. */
function BlocksKeyframes({ total, blocks }: { total: number; blocks: MovingBlock[] }) {
  const rules = blocks.flatMap((b) => [
    keyframes(`tm-blocks-${b.k}`, total, holdToEnd(blockFrames(b), total)),
    opacityKeyframes(`tm-blocks-aura-${b.k}`, total, auraShades(b)),
    stackKeyframes(`tm-blocks-z-${b.k}`, total, b),
  ]);
  rules.push(keyframes("tm-blocks-beam", total, holdToEnd(beamFrames(blocks), total)));
  rules.push(opacityKeyframes("tm-blocks-beam-on", total, beamShades(blocks)));
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
  const { to } = block;
  const colors = KIND_COLORS[block.kind];
  return (
    <Layer
      x={to.x - BLOCK}
      y={to.y - BLOCK}
      w={2 * BLOCK}
      h={BLOCK}
      className="tm-blocks-crumbs"
      style={{ "--tm-at": `${block.land}ms`, zIndex: 200 } as CSSProperties}
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

/** The beam's colours: a violet magic light, unlike anything else in the picture and clear on the blue sky and the grass. */
const BEAM = { glow: "#b197fc", core: "#ffffff", deep: "#7048e8" } as const;

/**
 * The crystal floating over the jumble: a cut gem of facets in cool blues and violets, a soft halo round it that pulses
 * once a second while it works (a layer of its own), its tip where the beam starts. Drawn once.
 */
const Gem = memo(function Gem() {
  const { x, y, w, h } = GEM;
  const line = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const };
  return (
    <>
      <Layer x={x - 50} y={y - 40} w={w + 100} h={h + 80} className="tm-blocks-halo" style={{ zIndex: 97 }}>
        <svg viewBox={`0 0 ${w + 100} ${h + 80}`}>
          <defs>
            <radialGradient id="tm-blocks-halo">
              <stop offset="0" stopColor={BEAM.glow} stopOpacity="0.95" />
              <stop offset="0.55" stopColor={BEAM.glow} stopOpacity="0.4" />
              <stop offset="1" stopColor={BEAM.glow} stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx={(w + 100) / 2} cy={(h + 80) / 2} rx={(w + 100) / 2} ry={(h + 80) / 2} fill="url(#tm-blocks-halo)" />
        </svg>
      </Layer>
      <Layer x={x} y={y} w={w} h={h} style={{ zIndex: 98 }}>
        <svg viewBox={`0 0 ${w} ${h}`}>
          {/* Top half: a flat table and two slanting facets; bottom half: three long facets down to the tip. */}
          <path d={`M14 30 L26 8 H54 L66 30 Z`} fill="#c5f6fa" {...line} />
          <path d={`M14 30 L40 ${h - 4} L2 30 Z`} fill="#4c6ef5" {...line} />
          <path d={`M66 30 L40 ${h - 4} L78 30 Z`} fill="#364fc7" {...line} />
          <path d={`M14 30 H66 L40 ${h - 4} Z`} fill="#74c0fc" {...line} />
          <path d={`M2 30 L14 30 L26 8 Z`} fill="#91a7ff" {...line} />
          <path d={`M78 30 L66 30 L54 8 Z`} fill="#5c7cfa" {...line} />
          <path d="M30 34 L40 70" stroke="#e7f5ff" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
          <path d="M32 14 H44" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </Layer>
    </>
  );
});

/**
 * The beam from the crystal's tip to the block it carries: a layer pointing straight down, turned and stretched onto
 * the block by keyframes written for the run (`beamFrames`), its light on its own (`beamShades`), and little sparks
 * running along it to the block, so the pull is seen all the time. Drawn once.
 */
const Beam = memo(function Beam() {
  return (
    <Layer
      x={GEM.tip.x - BEAM_W / 2}
      y={GEM.tip.y}
      w={BEAM_W}
      h={BEAM_L}
      className="tm-blocks-beam"
      style={{ "--tm-anim": "tm-blocks-beam", zIndex: 99 } as CSSProperties}
    >
      <div className="tm-blocks-beam-on" style={{ "--tm-light": "tm-blocks-beam-on" } as CSSProperties}>
        <svg viewBox={`0 0 ${BEAM_W} ${BEAM_L}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="tm-blocks-beam" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={BEAM.glow} stopOpacity="0" />
              <stop offset="0.22" stopColor={BEAM.glow} stopOpacity="0.45" />
              <stop offset="0.4" stopColor={BEAM.deep} stopOpacity="0.8" />
              <stop offset="0.6" stopColor={BEAM.deep} stopOpacity="0.8" />
              <stop offset="0.78" stopColor={BEAM.glow} stopOpacity="0.45" />
              <stop offset="1" stopColor={BEAM.glow} stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width={BEAM_W} height={BEAM_L} fill="url(#tm-blocks-beam)" />
          <rect x={BEAM_W / 2 - 7} width="14" height={BEAM_L} fill={BEAM.core} />
        </svg>
        <div className="tm-blocks-sparks">
          <svg viewBox="0 0 20 200" preserveAspectRatio="none">
            {Array.from({ length: 8 }, (_, i) => (
              <rect key={i} x={i % 2 ? 3 : 11} y={i * 25 + 4} width="6" height="9" rx="3" fill={BEAM.deep} />
            ))}
          </svg>
        </div>
      </div>
    </Layer>
  );
});

/**
 * Each carried block on its way inside a stacking box of its own: its layer on keyframes written for the run, a gentle
 * bob while it floats, a cool glow round it while the beam holds it; while it lies in the jumble a tap lights it (H-51).
 */
const MovingBlocks = memo(function MovingBlocks({ blocks, glow }: { blocks: MovingBlock[]; glow: number }) {
  return (
    <>
      {blocks.map((b) => {
        const p = phaseTimes(b);
        const bobs = Math.floor((p.lower - p.lift) / BOB_MS);
        return (
          <div key={b.k} className="tm-blocks-z" style={{ "--tm-anim": `tm-blocks-z-${b.k}`, "--tm-z-end": 100 + b.k } as CSSProperties}>
            <Layer
              x={b.from.x - BLOCK / 2}
              y={b.from.y - BLOCK}
              w={BLOCK}
              h={BLOCK}
              className="tm-blocks-block"
              style={{ "--tm-anim": `tm-blocks-${b.k}`, "--tm-end": restTransform(b) } as CSSProperties}
            >
              <div className="tm-blocks-bob" style={{ "--tm-at": `${p.lift}ms`, "--tm-bobs": bobs } as CSSProperties} data-bobs={bobs > 0 ? "" : undefined}>
                <div className="tm-blocks-aura" style={{ "--tm-anim": `tm-blocks-aura-${b.k}` } as CSSProperties} />
                <BlockArt kind={b.kind} />
              </div>
              <div className="tm-toy-left" style={{ "--tm-at": `${p.lift}ms` } as CSSProperties}>
                <LeftGlow n={glow} />
              </div>
            </Layer>
          </div>
        );
      })}
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

/** The whole picture: the meadow, the house's plan and its light, the blocks built and those still to come, the cursor, the crystal and its beam. */
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
        <Gem />
        <Beam />
        <MovingBlocks blocks={blocks} glow={glow} />
        <AllCrumbs blocks={blocks} />
      </div>
    </>
  );
}
