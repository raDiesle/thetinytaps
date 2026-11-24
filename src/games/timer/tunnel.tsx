import { type CSSProperties, memo, useMemo } from "react";
import { type Frame, holdToEnd, keyframes } from "./keyframes";
import { Draw, INK, Layer, LeftGlow, STAGE_H, STAGE_W } from "./scenes";

// The treasure tunnel (H-126, user request, 22 November 2026: a second timer like a block world played by itself): a
// hill of blocks cut open from the side, as 2D block games show their worlds. At its foot on the left the tunnel's
// way is still blocks of dirt and stone, and at its end on the right a little room with a treasure chest, lit through a
// crack from above – the goal, seen from the start. A pickaxe swings at the next block once a second, the block cracks
// in three steps, then crumbles into little square crumbs, and the tunnel grows. When the last block is gone, the way
// is clear and the chest opens. The blocks still standing are the time left, the tunnel the time gone. A genre's look of
// our own – our own blocks and colours, no figure, nothing of one game.

/** A block's size on the stage: the hill is drawn flat from the side, as a grid of these squares. */
export const S = 80;

/** The tunnel's floor (the meadow's level too), where its entrance is (the hill's left face) and how many columns it has. */
export const TUNNEL = { x: 330, floor: 660, cols: 10, rows: 2 } as const;

/** The room with the chest, right after the tunnel: two columns wide, as high as the tunnel. */
export const ROOM = { x: TUNNEL.x + TUNNEL.cols * S, cols: 2 } as const;

/** How many blocks stand above the floor in each column of the hill, from its left face to the stage's right edge. */
export const HILL: readonly number[] = [3, 4, 4, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 5, 5];

/** What a block is made of: dirt near the grass, stone deeper, and stone with gold in it here and there. */
export type DigKind = "dirt" | "stone" | "gold";

/** The tunnel's blocks in the order they are dug: column by column from the entrance, the top one first, then the floor's. */
export const SPOTS: readonly { c: number; r: number }[] = Array.from({ length: TUNNEL.cols * TUNNEL.rows }, (_, k) => ({
  c: Math.floor(k / 2),
  r: k % 2 ? 0 : 1,
}));

/** The tunnel's blocks with gold in them, by their place in `SPOTS`. */
const GOLD: readonly number[] = [9, 14];

/** What the block at a place of the tunnel is made of: dirt right under the grass, else stone (some with gold). */
export function spotKind(k: number): DigKind {
  const { c, r } = SPOTS[k];
  if (GOLD.includes(k)) return "gold";
  return r >= HILL[c] - 2 ? "dirt" : "stone";
}

/**
 * How many blocks the tunnel has, all dug in a run of any length: five minutes one every 15 seconds, a shorter or longer
 * run only faster or slower – never starting with part of the tunnel already dug (user request, 24 November 2026).
 */
export const MAX_DIG = SPOTS.length;

/** A tunnel place's top left corner on the stage. */
export function spotCorner(k: number): { x: number; y: number } {
  const { c, r } = SPOTS[k];
  return { x: TUNNEL.x + c * S, y: TUNNEL.floor - (r + 1) * S };
}

/** One block dug in a run: its place in `SPOTS`, its kind, when it starts to crumble and when it is gone. */
export interface DugBlock {
  k: number;
  kind: DigKind;
  crumble: number;
  gone: number;
}

/** How long a block takes to crumble away at most, ending as its share of the time ends (less when blocks come quickly). */
export const CRUMBLE_MS = 350;

/**
 * Works out a run of `total` ms digging `count` blocks: the tunnel's first places beyond those are dug from the start
 * (`dug`), and each block dug has the same share of the time (`unit`): it cracks at a quarter, a half and three quarters
 * of it, and is gone at its end, the last as the time is up.
 */
export function tunnelPlan(total: number, count: number): { dug: number; unit: number; blocks: DugBlock[] } {
  const dug = MAX_DIG - count;
  const unit = total / count;
  // It crumbles only after its last crack, three quarters into its share.
  const crumbleMs = Math.min(CRUMBLE_MS, unit * 0.2);
  const blocks = Array.from({ length: count }, (_, i) => ({ k: dug + i, kind: spotKind(dug + i), crumble: (i + 1) * unit - crumbleMs, gone: (i + 1) * unit }));
  return { dug, unit, blocks };
}

/** The pickaxe's layer, a square (its drawing is made 120 units big), and where in it the tip of its head and the hand on its handle are. */
export const PICK = { size: 150, tip: { x: 145, y: 90 }, hand: { x: 22.5, y: 135 } } as const;

/** Where the pickaxe's layer stands to strike the block at place `k`: its tip at the middle of the block's left side. */
export function pickCorner(k: number): { x: number; y: number } {
  const block = spotCorner(k);
  return { x: block.x + 4 - PICK.tip.x, y: block.y + S / 2 - PICK.tip.y };
}

/** A transform moving a layer `size` big from where `at(a)` puts it to where `at(b)` does, in % of its own size. */
function shift(at: (k: number) => { x: number; y: number }, a: number, b: number, size: number): string {
  const from = at(a);
  const to = at(b);
  return `translate(${(((to.x - from.x) / size) * 100).toFixed(2)}%, ${(((to.y - from.y) / size) * 100).toFixed(2)}%)`;
}

/** The keyframes of a layer that jumps on to the next block as the one before is gone: the pickaxe's or the cracks'. */
export function toolFrames(blocks: DugBlock[], at: (k: number) => { x: number; y: number }, size: number): Frame[] {
  const first = blocks[0].k;
  return blocks.map((b, i) => ({ at: i ? blocks[i - 1].gone : 0, transform: shift(at, first, b.k, size), ease: "step-end" }));
}

/** The pickaxe's and the cracks' ways as keyframes made for this run. */
function TunnelKeyframes({ total, blocks }: { total: number; blocks: DugBlock[] }) {
  const rules = [
    keyframes("tm-tunnel-pick", total, holdToEnd(toolFrames(blocks, pickCorner, PICK.size), total)),
    keyframes("tm-tunnel-cracks", total, holdToEnd(toolFrames(blocks, spotCorner, S), total)),
  ];
  return <style>{rules.join("\n")}</style>;
}

/** Each kind's colours: its face, the darker and lighter specks of its grain, and the gold of a gold block. */
const KIND_COLORS: Record<DigKind, { face: string; dark: string; light: string }> = {
  dirt: { face: "#a8703c", dark: "#86552b", light: "#c58b52" },
  stone: { face: "#9aa3ab", dark: "#7b848c", light: "#bcc4cb" },
  gold: { face: "#9aa3ab", dark: "#7b848c", light: "#bcc4cb" },
};

/** The specks of a block's grain (x, y, dark or light), so every block looks made of the same stuff. */
const SPECKS: readonly [number, number, boolean][] = [
  [10, 10, true],
  [46, 8, false],
  [26, 32, true],
  [62, 36, true],
  [10, 58, false],
  [42, 62, true],
  [68, 70, false],
];

/** The gold nuggets in a gold block. */
const NUGGETS: readonly [number, number][] = [
  [18, 20],
  [54, 46],
  [24, 64],
];

/** The marks of one block's face, drawn in its own `S` square: its kind's grain, and gold where it has some. */
function BlockMarks({ kind }: { kind: DigKind }) {
  const c = KIND_COLORS[kind];
  return (
    <>
      <rect width={S} height={S} fill={c.face} />
      {SPECKS.map(([x, y, dark]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="11" height="11" fill={dark ? c.dark : c.light} />
      ))}
      {kind === "gold" &&
        NUGGETS.map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <rect x={x} y={y} width="16" height="12" fill="#ffd43b" stroke="#c9860a" strokeWidth="3" />
            <rect x={x + 3} y={y + 2} width="5" height="4" fill="#fff3bf" />
          </g>
        ))}
    </>
  );
}

/** One block of the tunnel, seen flat from the side, with its dark outline. */
export function DigBlockArt({ kind }: { kind: DigKind }) {
  return (
    <svg viewBox={`0 0 ${S} ${S}`}>
      <BlockMarks kind={kind} />
      <rect x="1.5" y="1.5" width={S - 3} height={S - 3} fill="none" stroke={INK} strokeWidth="3" />
    </svg>
  );
}

/** The hill's top block in a column: dirt with grass over it. */
function GrassBlock({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <BlockMarks kind="dirt" />
      <rect width={S} height="24" fill="#6cc04a" />
      {[6, 26, 46, 64].map((gx, i) => (
        <rect key={gx} x={gx} y="24" width="12" height={i % 2 ? 14 : 8} fill="#6cc04a" />
      ))}
      <rect width={S} height="7" fill="#8ad66a" />
    </g>
  );
}

/**
 * The sky, the hill cut open with its grass, dirt and stone, the meadow before it, the tunnel's dug back wall and the
 * chest's room with the crack of light above it; drawn once, stepping back from afar (H-48). The blocks still to dig
 * cover the tunnel's back wall.
 */
const TunnelBackdrop = memo(function TunnelBackdrop() {
  const floor = TUNNEL.floor;
  const below = Math.ceil((STAGE_H - floor) / S);
  const roomTop = floor - TUNNEL.rows * S;
  const crack = ROOM.x + S + 22;
  const crackTop = floor - HILL[TUNNEL.cols + 1] * S;
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-back">
      <Draw w={STAGE_W} h={STAGE_H}>
        <defs>
          <linearGradient id="tm-tunnel-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7cc6ff" />
            <stop offset="1" stopColor="#d6efff" />
          </linearGradient>
          <linearGradient id="tm-tunnel-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff3bf" stopOpacity="0.85" />
            <stop offset="1" stopColor="#ffe066" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <rect width={STAGE_W} height={floor} fill="url(#tm-tunnel-sky)" />
        {/* Square clouds, standing still. */}
        {[
          [90, 150],
          [560, 70],
        ].map(([x, y]) => (
          <g key={x} fill="#fff" stroke="#e3f2fd" strokeWidth="3">
            <rect x={x} y={y} width="170" height="38" />
            <rect x={x + 40} y={y - 30} width="92" height="32" />
          </g>
        ))}
        {/* The meadow before the hill: grass over dirt, then stone. */}
        {Array.from({ length: Math.ceil(TUNNEL.x / S) + 1 }, (_, i) => {
          const x = TUNNEL.x - (i + 1) * S;
          return (
            <g key={`m${i}`}>
              <GrassBlock x={x} y={floor} />
              {Array.from({ length: below - 1 }, (_, j) => (
                <g key={j} transform={`translate(${x} ${floor + (j + 1) * S})`}>
                  <BlockMarks kind={j ? "stone" : "dirt"} />
                </g>
              ))}
            </g>
          );
        })}
        {/* The hill, column by column: grass on top, a block of dirt under it, then stone down past the floor. */}
        {HILL.map((n, c) => {
          const x = TUNNEL.x + c * S;
          return (
            <g key={`h${c}`}>
              <GrassBlock x={x} y={floor - n * S} />
              {Array.from({ length: n - 1 + below }, (_, j) => {
                const r = n - 2 - j;
                return (
                  <g key={j} transform={`translate(${x} ${floor - (r + 1) * S})`}>
                    <BlockMarks kind={r >= n - 2 && r >= 0 ? "dirt" : "stone"} />
                  </g>
                );
              })}
            </g>
          );
        })}
        {/* The seams between the blocks, faint. */}
        {Array.from({ length: Math.ceil(STAGE_W / S) + 2 }, (_, i) => (
          <path key={`v${i}`} d={`M${TUNNEL.x + (i - 4) * S} 0 V${STAGE_H}`} stroke="rgb(59 42 32 / 0.25)" strokeWidth="3" />
        ))}
        {Array.from({ length: Math.ceil(STAGE_H / S) + 1 }, (_, i) => (
          <path key={`w${i}`} d={`M0 ${floor - i * S} H${STAGE_W}`} stroke="rgb(59 42 32 / 0.25)" strokeWidth="3" />
        ))}
        {/* The sky again above the hill's steps, so the seams stop at its outline. */}
        <path
          d={`M${TUNNEL.x} 0 ${HILL.map((n, c) => `V${floor - n * S} H${TUNNEL.x + (c + 1) * S}`).join(" ")} V0 Z M0 0 H${TUNNEL.x} V${floor} H0 Z`}
          fill="url(#tm-tunnel-sky)"
        />
        {/* The hill a little darker than the blocks still to dig, so these stand out as what runs down. */}
        <path
          d={`M${TUNNEL.x} ${STAGE_H} ${HILL.map((n, c) => `V${floor - n * S} H${TUNNEL.x + (c + 1) * S}`).join(" ")} V${STAGE_H} Z M0 ${floor} H${TUNNEL.x} V${STAGE_H} H0 Z`}
          fill="rgb(40 28 20 / 0.16)"
        />
        {/* The tunnel's and the room's back wall, dug out: dark, with the faint seams of the blocks that were there. */}
        <rect x={TUNNEL.x} y={roomTop} width={(TUNNEL.cols + ROOM.cols) * S} height={TUNNEL.rows * S} fill="#4d3b2f" />
        {Array.from({ length: TUNNEL.cols + ROOM.cols - 1 }, (_, i) => (
          <path key={`b${i}`} d={`M${TUNNEL.x + (i + 1) * S} ${roomTop} V${floor}`} stroke="#3f3026" strokeWidth="4" />
        ))}
        <path d={`M${TUNNEL.x} ${roomTop + S} H${ROOM.x + ROOM.cols * S}`} stroke="#3f3026" strokeWidth="4" />
        {/* The crack in the hill over the room, and the light falling through it onto the chest. */}
        <path
          d={`M${crack - 8} ${crackTop} L${crack + 10} ${crackTop + 90} L${crack - 4} ${crackTop + 180} L${crack + 8} ${roomTop} H${crack + 26} L${crack + 14} ${crackTop + 180} L${crack + 28} ${crackTop + 90} L${crack + 12} ${crackTop} Z`}
          fill="#fff3bf"
          stroke={INK}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d={`M${crack + 6} ${roomTop} L${ROOM.x + 14} ${floor} H${ROOM.x + ROOM.cols * S - 10} L${crack + 30} ${roomTop} Z`} fill="url(#tm-tunnel-beam)" />
        {/* A frame round the cut, so the hill reads as cut open. */}
        <path d={`M${TUNNEL.x} ${roomTop} H${ROOM.x + ROOM.cols * S} V${floor} H${TUNNEL.x}`} fill="none" stroke={INK} strokeWidth="5" />
        <path d={`M0 ${floor} H${STAGE_W}`} stroke={INK} strokeWidth="5" />
      </Draw>
    </Layer>
  );
});

/** The chest in its room: its middle and foot, its body's width and height and its lid's. */
export const CHEST = { cx: ROOM.x + S, foot: TUNNEL.floor, w: 150, body: 72, lid: 42 } as const;

/** The chest's body with the gold heaped in it, which its lid covers until it opens; drawn once. */
const ChestBody = memo(function ChestBody() {
  const w = CHEST.w + 20;
  const h = CHEST.body + CHEST.lid + 24;
  const x0 = 10;
  const top = h - CHEST.body;
  return (
    <Layer x={CHEST.cx - w / 2} y={CHEST.foot - h} w={w} h={h}>
      <svg viewBox={`0 0 ${w} ${h}`}>
        {/* The gold inside, heaped a little over the rim. */}
        <path
          d={`M${x0 + 10} ${top + 4} Q${x0 + 30} ${top - 22} ${w / 2} ${top - 26} Q${w - 40} ${top - 22} ${w - x0 - 10} ${top + 4} Z`}
          fill="#ffd43b"
          stroke="#c9860a"
          strokeWidth="4"
        />
        {[
          [x0 + 34, top - 12],
          [w / 2 - 6, top - 20],
          [w / 2 + 28, top - 10],
        ].map(([cx, cy]) => (
          <circle key={cx} cx={cx} cy={cy} r="8" fill="#ffe066" stroke="#c9860a" strokeWidth="3" />
        ))}
        <rect x={x0} y={top} width={CHEST.w} height={CHEST.body} rx="6" fill="#b5652e" stroke={INK} strokeWidth="5" />
        {[0.25, 0.75].map((f) => (
          <rect key={f} x={x0 + CHEST.w * f - 9} y={top} width="18" height={CHEST.body} fill="#868e96" stroke={INK} strokeWidth="3" />
        ))}
        <path d={`M${x0 + 6} ${top + CHEST.body / 2} H${x0 + CHEST.w - 6}`} stroke="#8a4a1f" strokeWidth="4" />
        <rect x={w / 2 - 13} y={top + 6} width="26" height="28" rx="4" fill="#ffd43b" stroke={INK} strokeWidth="4" />
        <circle cx={w / 2} cy={top + 18} r="4" fill={INK} />
      </svg>
    </Layer>
  );
});

/** The chest's lid, a layer of its own that turns open on its hinge at the back (right) at the end. */
const ChestLid = memo(function ChestLid() {
  const w = CHEST.w + 8;
  const h = CHEST.lid + 6;
  return (
    <Layer x={CHEST.cx - w / 2} y={CHEST.foot - CHEST.body - h + 3} w={w} h={h} className="tm-tunnel-lid">
      <svg viewBox={`0 0 ${w} ${h}`}>
        <path d={`M4 ${h - 3} V22 Q4 4 26 4 H${w - 26} Q${w - 4} 4 ${w - 4} 22 V${h - 3} Z`} fill="#c8743a" stroke={INK} strokeWidth="5" />
        {[0.25, 0.75].map((f) => (
          <rect key={f} x={4 + (w - 8) * f - 9} y="5" width="18" height={h - 8} fill="#868e96" stroke={INK} strokeWidth="3" />
        ))}
      </svg>
    </Layer>
  );
});

/** The warm light round the chest once it is open: hidden until the end, one layer fading in. */
const ChestLight = memo(function ChestLight() {
  const size = 360;
  return <Layer x={CHEST.cx - size / 2} y={CHEST.foot - CHEST.body - size / 2} w={size} h={size} className="tm-tunnel-light" />;
});

/** Every block still to dig, each crumbling away at its moment; while it stands a tap lights it (H-51). */
const DigBlocks = memo(function DigBlocks({ blocks, glow }: { blocks: DugBlock[]; glow: number }) {
  return (
    <>
      {blocks.map((b) => {
        const corner = spotCorner(b.k);
        const at = { "--tm-at": `${b.crumble}ms`, "--tm-crumble": `${b.gone - b.crumble}ms` } as CSSProperties;
        return (
          <Layer key={b.k} x={corner.x} y={corner.y} w={S} h={S}>
            <div className="tm-tunnel-block" style={at}>
              <DigBlockArt kind={b.kind} />
            </div>
            <div className="tm-toy-left" style={at}>
              <LeftGlow n={glow} />
            </div>
          </Layer>
        );
      })}
    </>
  );
});

/** The cracks a block gets as it is dug, a stage more at each quarter of its share (their outlines in its `S` square). */
const CRACKS: readonly string[] = [
  "M44 4 L40 22 L50 32 M40 22 L28 30",
  "M50 32 L46 48 L60 58 M28 30 L14 26 M46 48 L32 56",
  "M60 58 L70 76 M32 56 L28 80 M14 26 L4 40 M50 32 L72 24 L84 30",
];

/**
 * The block being dug: a frame round it, as a block game marks the block one points at, and its cracks, each stage
 * showing from its quarter of the block's share on, again for every block (`--tm-unit`). The layer jumps on to the next
 * block as the one before is gone.
 */
const Cracks = memo(function Cracks({ blocks, unit }: { blocks: DugBlock[]; unit: number }) {
  const corner = spotCorner(blocks[0].k);
  return (
    <Layer
      x={corner.x}
      y={corner.y}
      w={S}
      h={S}
      className="tm-hop tm-tunnel-cracks"
      style={{ "--tm-anim": "tm-tunnel-cracks", "--tm-unit": `${unit}ms` } as CSSProperties}
    >
      {CRACKS.map((d, i) => (
        <svg key={d} viewBox={`0 0 ${S} ${S}`} className={`tm-tunnel-crack tm-tunnel-crack-${i + 1}`}>
          <path d={d} fill="none" stroke="#2b1d14" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ))}
      <svg viewBox={`0 0 ${S} ${S}`}>
        <rect x="2" y="2" width={S - 4} height={S - 4} fill="none" stroke="#fff" strokeWidth="8" />
        <rect x="2" y="2" width={S - 4} height={S - 4} fill="none" stroke="#212529" strokeWidth="3" />
      </svg>
    </Layer>
  );
});

/** The pickaxe swinging at the block being dug, once a second, from its hand on the handle; it jumps on with the cracks. */
const Pickaxe = memo(function Pickaxe({ blocks }: { blocks: DugBlock[] }) {
  const corner = pickCorner(blocks[0].k);
  const { size, hand } = PICK;
  return (
    <Layer x={corner.x} y={corner.y} w={size} h={size} className="tm-hop tm-tunnel-pick" style={{ "--tm-anim": "tm-tunnel-pick" } as CSSProperties}>
      <div className="tm-tunnel-swing" style={{ transformOrigin: `${(hand.x / size) * 100}% ${(hand.y / size) * 100}%` }}>
        <svg viewBox="0 0 120 120">
          {/* The wooden handle, from the hand up to the head. */}
          <path d="M18 108 L86 40" stroke={INK} strokeWidth="17" strokeLinecap="round" />
          <path d="M18 108 L86 40" stroke="#c58b52" strokeWidth="10" strokeLinecap="round" />
          {/* The iron head, curved, its lower tip striking the block. */}
          <path d="M50 10 Q86 18 116 72 Q94 34 62 26 Z" fill="#adb5bd" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
          <path d="M62 16 Q84 22 100 46" fill="none" stroke="#e9ecef" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
    </Layer>
  );
});

/** Little square crumbs springing off a block as it crumbles away: one small layer per block, at its moment. */
const AllCrumbs = memo(function AllCrumbs({ blocks }: { blocks: DugBlock[] }) {
  return (
    <>
      {blocks.map((b) => {
        const corner = spotCorner(b.k);
        const c = KIND_COLORS[b.kind];
        return (
          <Layer
            key={b.k}
            x={corner.x - S / 2}
            y={corner.y}
            w={2 * S}
            h={S}
            className="tm-blocks-crumbs"
            style={{ "--tm-at": `${b.crumble}ms` } as CSSProperties}
          >
            <svg viewBox={`0 0 ${2 * S} ${S}`}>
              {[
                [30, 60],
                [52, 34],
                [124, 30],
                [146, 58],
                [44, 76],
                [132, 74],
              ].map(([x, y], i) => (
                <rect
                  key={i}
                  x={x}
                  y={y}
                  width="13"
                  height="13"
                  fill={b.kind === "gold" && i % 3 === 0 ? "#ffd43b" : i % 2 ? c.dark : c.light}
                  stroke={INK}
                  strokeWidth="2"
                />
              ))}
            </svg>
          </Layer>
        );
      })}
    </>
  );
});

/** The whole picture: the hill cut open, the chest in its room, the blocks still to dig, the cracks and the pickaxe. */
export function TunnelScene({ count, total, glow }: { count: number; total: number; glow: number }) {
  // Worked out once for the run, so the memoised parts are not drawn again when a tap lights the blocks.
  const { unit, blocks } = useMemo(() => tunnelPlan(total, count), [total, count]);
  return (
    <>
      <TunnelBackdrop />
      <TunnelKeyframes total={total} blocks={blocks} />
      <ChestLight />
      <ChestBody />
      <ChestLid />
      <DigBlocks blocks={blocks} glow={glow} />
      <Cracks blocks={blocks} unit={unit} />
      <Pickaxe blocks={blocks} />
      <AllCrumbs blocks={blocks} />
    </>
  );
}
