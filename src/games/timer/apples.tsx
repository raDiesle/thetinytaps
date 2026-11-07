import { memo, useMemo, type CSSProperties, type ReactNode } from "react";
import { Mascot } from "@/components/Mascot";
import { type AppleTimes, appleTimes, applePlaces, harvestOrder } from "./pieces";
import { Draw, INK, Layer, LeftGlow, STAGE_H, STAGE_W } from "./scenes";

// Apfelbaum (H-45): an apple tree's year, so the time shows its progress in stages (user feedback, November 2026) –
// the tree grows out of the meadow, blossoms open all over it while bees buzz round them, each blossom turns into a
// small green apple that grows and reddens, and then the bear child pushes its cart under one apple after the other,
// which falls straight down into it and stays there, each apple on its own in the heap. Every piece is a small layer
// of its own on its own clock (`animation-delay` from `appleTimes`), so nothing is drawn again while it runs; the cart's
// way is keyframes written once for the run (`CartKeyframes`).

/** The tree's crown: its middle and radii. */
export const CROWN = { cx: 600, cy: 300, rx: 300, ry: 200 } as const;

/** The ground the tree, the child and the cart stand on. */
export const APPLE_FLOOR = 770;

/** The tree's layer, from the crown's bumps to the ground; it grows from the trunk's foot (`.tm-tree`). */
const TREE = { x: CROWN.cx - CROWN.rx - 60, y: CROWN.cy - CROWN.ry - 60, w: 2 * CROWN.rx + 120, h: APPLE_FLOOR + 10 - (CROWN.cy - CROWN.ry - 60) } as const;

/**
 * The bear child's cart where it waits, right of the tree, while the tree grows and blossoms: the layer (cart, heap and
 * the child pushing it from behind) and in it, in stage units at rest, the box, its wheels and the child.
 */
export const CART = {
  x: 860,
  y: 500,
  w: 480,
  /** The box: its left and right edge, its rim and its bottom. */
  box: { left: 860, right: 1150, rim: 680, bottom: 735 },
  /** The wheels' middles and radius. */
  wheels: { xs: [905, 1105], cy: APPLE_FLOOR - 22, r: 22 },
  /** The child's left edge, behind the cart's handle. */
  child: 1220,
} as const;

/** The middle of the cart's box at rest: it goes under an apple by moving this point under it. */
export const CART_MIDDLE = (CART.box.left + CART.box.right) / 2;

/** The child's size in the cart's layer, as `Child` draws it elsewhere. */
const KID = { w: 120, h: 180 } as const;

/** An apple's radius in the cart: they lie side by side in rows (`HEAP_ROWS`), each one to be seen. */
export const HEAP_R = 22;

/** How many apples lie in each row of the cart's heap, from the bottom up: as many as `MAX_APPLES`. */
export const HEAP_ROWS = [6, 5, 4, 3, 2] as const;

/** Where the n-th apple to land lies in the cart, in stage units with the cart at rest: rows from the bottom up. */
export function heapSlot(n: number): { x: number; y: number } {
  let row = 0;
  let i = n;
  while (row < HEAP_ROWS.length - 1 && i >= HEAP_ROWS[row]) i -= HEAP_ROWS[row++];
  const inRow = HEAP_ROWS[row];
  // A small stagger, so the heap looks piled up by hand, not set in a grid.
  const wobble = ((n * 7) % 5) - 2;
  // The bottom row lies high enough that more than half of each apple shows over the box's front.
  return { x: CART_MIDDLE + (i - (inRow - 1) / 2) * 2 * HEAP_R + wobble, y: CART.box.rim - 14 - row * 34 + Math.abs(wobble) };
}

/** Where a falling apple's middle stops, deep in the box behind its front, before it lies in the heap. */
const LAND_Y = CART.box.rim + 20;

/** An apple's radius on the tree: smaller when many hang there, so they all fit. */
export function appleRadius(count: number) {
  return count <= 6 ? 40 : count <= 12 ? 34 : 27;
}

/** Where each apple hangs, in the order the bear child harvests them (`harvestOrder`). */
export function treeApples(count: number) {
  const r = appleRadius(count);
  return harvestOrder(applePlaces(count, CROWN.rx - r - 24, CROWN.ry - r - 24), r).map((p) => ({ x: CROWN.cx + p.x, y: CROWN.cy + p.y }));
}

/** Sky, clouds, meadow with a few flowers; drawn once. */
export const AppleBackdrop = memo(function AppleBackdrop() {
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-back">
      <Draw w={STAGE_W} h={STAGE_H}>
        <defs>
          <linearGradient id="tm-apple-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9ad8ff" />
            <stop offset="1" stopColor="#eaf8ff" />
          </linearGradient>
        </defs>
        <rect width={STAGE_W} height={STAGE_H} fill="url(#tm-apple-sky)" />
        <circle cx="1260" cy="170" r="66" fill="#ffe066" />
        {[
          [1010, 120],
          [1420, 290],
          [180, 150],
        ].map(([cx, cy]) => (
          <g key={cx} fill="#fff">
            <ellipse cx={cx} cy={cy} rx="66" ry="28" />
            <ellipse cx={cx + 42} cy={cy - 16} rx="42" ry="28" />
            <ellipse cx={cx - 38} cy={cy - 8} rx="34" ry="22" />
          </g>
        ))}
        <path d="M0 600 Q420 520 820 590 T1600 560 V900 H0 Z" fill="#a9dc84" />
        <rect y={APPLE_FLOOR - 10} width={STAGE_W} height={STAGE_H} fill="#7cc35a" />
        {/* A few flowers in the grass, for the bees' meadow. */}
        {[
          [240, 700, "#ff8fab"],
          [330, 745, "#fff"],
          [1380, 690, "#ffd43b"],
          [1460, 740, "#ff8fab"],
          [150, 790, "#ffd43b"],
          [1250, 815, "#fff"],
        ].map(([x, y, color]) => (
          <g key={`${x}`}>
            <path d={`M${x} ${y} V${Number(y) + 34}`} stroke="#3f9b4f" strokeWidth="5" />
            {[0, 72, 144, 216, 288].map((a) => (
              <circle
                key={a}
                cx={Number(x) + 11 * Math.cos((a * Math.PI) / 180)}
                cy={Number(y) + 11 * Math.sin((a * Math.PI) / 180)}
                r="8"
                fill={String(color)}
              />
            ))}
            <circle cx={x} cy={y} r="6" fill="#f59f00" />
          </g>
        ))}
      </Draw>
    </Layer>
  );
});

/** The crown's outline: a cloud of round clumps of leaves on the ellipse's edge round a full middle. */
const CLUMPS = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * 2 * Math.PI;
  return { x: Math.cos(a) * (CROWN.rx - 40), y: Math.sin(a) * (CROWN.ry - 30), r: 70 + ((i * 5) % 3) * 8 };
});

/** The tree, trunk and crown, in its own layer: it grows from a small sapling to its full size (`.tm-tree`). */
const Tree = memo(function Tree({ style }: { style: CSSProperties }) {
  const cx = CROWN.cx - TREE.x;
  const cy = CROWN.cy - TREE.y;
  const floor = APPLE_FLOOR - TREE.y;
  return (
    <Layer x={TREE.x} y={TREE.y} w={TREE.w} h={TREE.h} className="tm-tree tm-back" style={style}>
      <Draw w={TREE.w} h={TREE.h}>
        <path
          d={`M${cx - 46} ${floor} Q${cx - 30} ${floor - 140} ${cx - 40} ${cy + 150} L${cx - 110} ${cy + 60} L${cx - 90} ${cy + 50} L${cx - 20} ${cy + 120} L${cx} ${cy + 40} L${cx + 20} ${cy + 120} L${cx + 100} ${cy + 50} L${cx + 116} ${cy + 64} L${cx + 40} ${cy + 150} Q${cx + 30} ${floor - 140} ${cx + 46} ${floor} Z`}
          fill="#8a5a2b"
          stroke={INK}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d={`M${cx - 10} ${floor - 30} Q${cx - 4} ${floor - 120} ${cx - 16} ${cy + 170}`}
          stroke="#6b4320"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        {/* The outline first, then the same clumps filled over it, so only the outer edge keeps its line. */}
        <g stroke={INK} strokeWidth="12">
          <ellipse cx={cx} cy={cy} rx={CROWN.rx - 40} ry={CROWN.ry - 30} fill="#3f9b4f" />
          {CLUMPS.map((c, i) => (
            <circle key={i} cx={cx + c.x} cy={cy + c.y} r={c.r} fill="#3f9b4f" />
          ))}
        </g>
        <ellipse cx={cx} cy={cy} rx={CROWN.rx - 40} ry={CROWN.ry - 30} fill="#3f9b4f" />
        {CLUMPS.map((c, i) => (
          <circle key={i} cx={cx + c.x} cy={cy + c.y} r={c.r - 6} fill="#3f9b4f" />
        ))}
        {[
          [-170, -90, 80],
          [60, -130, 90],
          [190, 10, 80],
          [-60, 70, 100],
          [-210, 50, 60],
        ].map(([dx, dy, r]) => (
          <circle key={dx} cx={cx + dx} cy={cy + dy} r={r} fill="#52b062" opacity="0.7" />
        ))}
      </Draw>
    </Layer>
  );
});

/** One apple, drawn in a 100 × 100 box with a light, a stalk and a leaf; green while it is still small. */
function Apple({ green = false }: { green?: boolean }) {
  return (
    <svg viewBox="0 0 100 100">
      <path
        d="M50 26 C30 12 6 22 8 52 C10 80 32 96 50 88 C68 96 90 80 92 52 C94 22 70 12 50 26 Z"
        fill={green ? "#9bd14b" : "#e8413a"}
        stroke={INK}
        strokeWidth="5"
      />
      <ellipse cx="32" cy="42" rx="8" ry="13" fill={green ? "#d8f3a0" : "#ff9d8f"} transform="rotate(20 32 42)" />
      <path d="M50 26 Q52 14 58 6" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M56 14 Q70 4 82 12 Q70 22 56 14 Z" fill="#69c46c" stroke={INK} strokeWidth="3" />
    </svg>
  );
}

/** An apple blossom, five white-pink petals round a yellow middle, in a 100 × 100 box. */
function Blossom() {
  return (
    <svg viewBox="0 0 100 100">
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="50" cy="27" rx="17" ry="22" fill="#fff0f5" stroke="#e599b4" strokeWidth="3" transform={`rotate(${a} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="12" fill="#ffd43b" stroke="#e8a400" strokeWidth="3" />
    </svg>
  );
}

/**
 * The blossoms and apples on the tree. At an apple's place its blossom opens (`--tm-at`) and later falls off as a small
 * green apple comes (`--tm-off`), which grows and reddens; while the cart comes under it, it sways once a second, then
 * it falls straight down into the cart (`--tm-dy`) and is gone there, as the same apple lies in the heap.
 */
export const TreeApples = memo(function TreeApples({ count, times, glow }: { count: number; times: AppleTimes; glow: number }) {
  const r = appleRadius(count);
  const places = treeApples(count);
  return (
    <>
      {places.map((p, k) => {
        const h = times.harvest[k];
        const style = {
          "--tm-dy": `${((LAND_Y - p.y) / (2 * r)) * 100}%`,
          "--tm-shrink": HEAP_R / r,
          "--tm-fall-at": `${h.fall}ms`,
          "--tm-fall-ms": `${h.land - h.fall}ms`,
          "--tm-land-at": `${h.land}ms`,
        } as CSSProperties;
        const grow = { "--tm-at": `${times.ripen[k]}ms`, "--tm-grow-ms": `${times.ripenMs}ms` } as CSSProperties;
        const sways = Math.max(0, Math.floor((h.fall - h.leave) / 1000));
        return (
          <Layer key={k} x={p.x - r} y={p.y - r} w={2 * r} h={2 * r} className="tm-apple" style={style}>
            <div className="tm-apple-sway" style={{ animationDelay: `${h.leave}ms`, animationIterationCount: sways }}>
              <div className="tm-apple-grow" style={grow}>
                <Apple green />
                <div className="tm-apple-red">
                  <Apple />
                </div>
                {/* A tap lights up the apples still on the tree (H-51). */}
                <LeftGlow n={glow} />
              </div>
            </div>
          </Layer>
        );
      })}
      {places.map((p, k) => (
        <Layer
          key={`b${k}`}
          x={p.x - r * 1.1}
          y={p.y - r * 1.1}
          w={2.2 * r}
          h={2.2 * r}
          className="tm-blossom"
          style={{ "--tm-at": `${times.bloom[k]}ms`, "--tm-off": `${times.ripen[k]}ms` } as CSSProperties}
        >
          <Blossom />
        </Layer>
      ))}
    </>
  );
});

/** A part of the cart's layer, placed in stage units (with the cart at rest). */
function CartPart({
  x,
  y,
  w,
  h,
  className,
  style,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const height = APPLE_FLOOR - CART.y;
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        left: `${((x - CART.x) / CART.w) * 100}%`,
        top: `${((y - CART.y) / height) * 100}%`,
        width: `${(w / CART.w) * 100}%`,
        height: `${(h / height) * 100}%`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** A wheel with spokes, so it is seen turning as the cart rolls. */
function Wheel() {
  return (
    <svg viewBox="0 0 60 60">
      <circle cx="30" cy="30" r="26" fill="#5c3d22" stroke={INK} strokeWidth="5" />
      <circle cx="30" cy="30" r="17" fill="#c48a4f" />
      {[0, 60, 120].map((a) => (
        <path key={a} d="M30 13 V47" stroke="#5c3d22" strokeWidth="5" transform={`rotate(${a} 30 30)`} />
      ))}
      <circle cx="30" cy="30" r="6" fill="#ffd43b" stroke={INK} strokeWidth="3" />
    </svg>
  );
}

/**
 * The bear child pushing its little cart: the heap's apples (each its own small layer, coming as its apple lands), the
 * box's front, the wheels and the handle, and the child behind it. The whole layer rolls along its keyframes
 * (`CartKeyframes`), the wheels turning with it.
 */
export const Cart = memo(function Cart({ times, end }: { times: AppleTimes; end: string }) {
  const { box, wheels } = CART;
  const front = { w: box.right - box.left, h: box.bottom - box.rim + 8 };
  const handle = { x: box.right - 10, y: box.bottom - 40, w: CART.child + 30 - box.right + 10, h: 70 };
  return (
    <Layer
      x={CART.x}
      y={CART.y}
      w={CART.w}
      h={APPLE_FLOOR - CART.y}
      className="tm-cart"
      style={{ "--tm-cart-end": end, "--tm-cart-way": "tm-cart-way", "--tm-cart-wheels": "tm-cart-wheels" } as CSSProperties}
    >
      {times.harvest.map((h, n) => {
        const slot = heapSlot(n);
        return (
          <CartPart
            key={n}
            x={slot.x - HEAP_R}
            y={slot.y - HEAP_R}
            w={2 * HEAP_R}
            h={2 * HEAP_R}
            className="tm-heap-apple"
            style={{ "--tm-at": `${h.land}ms` } as CSSProperties}
          >
            <Apple />
          </CartPart>
        );
      })}
      {/* The handle reaches back to the child's paw, behind the child. */}
      <CartPart x={handle.x} y={handle.y} w={handle.w} h={handle.h}>
        <Draw w={handle.w} h={handle.h}>
          <path d={`M4 26 L${handle.w - 34} 50`} stroke={INK} strokeWidth="16" strokeLinecap="round" />
          <path d={`M4 26 L${handle.w - 34} 50`} stroke="#c48a4f" strokeWidth="8" strokeLinecap="round" />
        </Draw>
      </CartPart>
      <CartPart x={box.left} y={box.rim - 8} w={front.w} h={front.h}>
        <Draw w={front.w} h={front.h}>
          <path d={`M4 8 H${front.w - 4} L${front.w - 14} ${front.h - 4} H14 Z`} fill="#d9643a" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
          {[0.25, 0.5, 0.75].map((f) => (
            <path key={f} d={`M${front.w * f} 14 V${front.h - 10}`} stroke="#b54a26" strokeWidth="5" />
          ))}
          <rect x="0" y="2" width={front.w} height="14" rx="7" fill="#f08c5a" stroke={INK} strokeWidth="5" />
        </Draw>
      </CartPart>
      {wheels.xs.map((x) => (
        <CartPart key={x} x={x - wheels.r - 4} y={wheels.cy - wheels.r - 4} w={2 * wheels.r + 8} h={2 * wheels.r + 8} className="tm-cart-wheel">
          <Wheel />
        </CartPart>
      ))}
      <CartPart x={CART.child} y={APPLE_FLOOR - KID.h} w={KID.w} h={KID.h} className="tm-mascot">
        <Mascot kind="bear" child />
      </CartPart>
    </Layer>
  );
});

/**
 * The cart's way as keyframes made for this run, since where the apples hang and when they fall depends on the time
 * set: it waits at the right while the tree grows and blossoms, then for each apple it rolls under it, stands there
 * while the apple falls in, and rolls on to the next. The wheels turn as far as it rolls. At the end (`.tm-done`) the
 * cart stands at its way's end, `--tm-cart-end` (`cartEnd`).
 */
export function CartKeyframes({ total, count, times }: { total: number; count: number; times: AppleTimes }) {
  const places = treeApples(count);
  const shift = (x: number) => x - CART_MIDDLE;
  const frames: { at: number; dx: number }[] = [{ at: 0, dx: 0 }];
  let dx = 0;
  times.harvest.forEach((h, k) => {
    frames.push({ at: h.leave, dx });
    dx = shift(places[k].x);
    frames.push({ at: h.under, dx });
  });
  frames.push({ at: total, dx });
  const percent = (ms: number) => ((Math.min(ms, total) / total) * 100).toFixed(3);
  const write = (name: string, at: (dx: number) => string) =>
    `@keyframes ${name} {${frames.map((f) => `${percent(f.at)}% { transform: ${at(f.dx)}; animation-timing-function: ease-in-out; }`).join(" ")}}`;
  return (
    <style>
      {write("tm-cart-way", (d) => `translateX(${((d / CART.w) * 100).toFixed(3)}%)`)}
      {write("tm-cart-wheels", (d) => `rotate(${((d / CART.wheels.r) * (180 / Math.PI)).toFixed(1)}deg)`)}
    </style>
  );
}

/** The cart's place at the end of the run, under the last apple, for `--tm-cart-end`. */
export function cartEnd(count: number): string {
  const last = treeApples(count).at(-1);
  return `${(((last ? last.x - CART_MIDDLE : 0) / CART.w) * 100).toFixed(3)}%`;
}

/** Where the bees fly round, how long a round takes (s), and whether the round is flown mirrored. */
export const BEES = [
  { x: 380, y: 170, s: 7, flip: false },
  { x: 700, y: 360, s: 9, flip: true },
  { x: 330, y: 420, s: 8, flip: false },
] as const;

/** A bee's size on the stage. */
export const BEE = { w: 70, h: 56 } as const;

/** A bee, side on, facing right: striped body and a little sting; its wings beat in a layer of their own. */
function Bee() {
  return (
    <>
      <svg viewBox="0 0 54 44">
        <path d="M6 26 L0 28 L6 31 Z" fill={INK} />
        <ellipse cx="24" cy="28" rx="19" ry="13" fill="#ffd43b" stroke={INK} strokeWidth="3" />
        <path d="M18 16 V40 M28 15 V41" stroke={INK} strokeWidth="5" />
        <circle cx="44" cy="25" r="9" fill={INK} />
        <circle cx="47" cy="22" r="2.4" fill="#fff" />
      </svg>
      <div className="tm-bee-wings">
        <svg viewBox="0 0 54 44">
          <ellipse cx="18" cy="12" rx="9" ry="12" fill="#e7f5ff" stroke={INK} strokeWidth="2.5" opacity="0.9" transform="rotate(-20 18 12)" />
          <ellipse cx="30" cy="12" rx="8" ry="11" fill="#e7f5ff" stroke={INK} strokeWidth="2.5" opacity="0.9" transform="rotate(15 30 12)" />
        </svg>
      </div>
    </>
  );
}

/**
 * Bees buzzing round the tree from when the first blossoms open: each a small layer flying its round (`tm-bee-fly`),
 * its wings beating in a smaller one – never a group moved inside a big svg.
 */
const Bees = memo(function Bees({ from }: { from: number }) {
  return (
    <>
      {BEES.map((b, i) => (
        <Layer key={i} x={b.x} y={b.y} w={BEE.w} h={BEE.h} className="tm-dims" style={b.flip ? { transform: "scaleX(-1)" } : undefined}>
          <div className="tm-bee" style={{ "--tm-at": `${from + i * 900}ms`, "--tm-bee-s": `${b.s}s` } as CSSProperties}>
            <Bee />
          </div>
        </Layer>
      ))}
    </>
  );
});

/** The whole picture: the tree's year, the bees and the bear child with its cart. */
export function AppleScene({ count, total, glow }: { count: number; total: number; glow: number }) {
  // Worked out once for the run, so the memoised parts are not drawn again when a tap lights the apples.
  const times = useMemo(() => appleTimes(total, count), [total, count]);
  const tree = useMemo(
    () => ({ "--tm-grow-ms": `${times.grown}ms`, "--tm-grow-steps": Math.max(1, Math.round(times.grown / 1000)) }) as CSSProperties,
    [times],
  );
  return (
    <>
      <AppleBackdrop />
      <CartKeyframes total={total} count={count} times={times} />
      <Tree style={tree} />
      <TreeApples count={count} times={times} glow={glow} />
      <Cart times={times} end={cartEnd(count)} />
      <Bees from={times.grown} />
    </>
  );
}
