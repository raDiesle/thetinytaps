import { memo, useMemo, type CSSProperties, type ReactNode } from "react";
import { Draw, INK, Layer, LeftGlow, STAGE_H, STAGE_W } from "./scenes";

// Tidy Up (H-108, user request, 21 November 2026: a timer for tidying up, best at five minutes): toys lie on the rug
// of a children's room, the open toy box stands at the right, and a toy gantry crane runs along its beam above them.
// One toy after the other it drives over a toy, lets its claw down, grips, lifts it, carries it over the box and lets
// it fall straight down onto its own place in the heap – nearest the box first, so the empty floor grows from the box
// outwards – until the floor is empty and the box full; the last one lands as the time is up. What lies on the floor is
// the time left. Everything that moves is a small layer on keyframes written once for the run (`TidyKeyframes`): the
// trolley, the rope, the claw and its fingers, and each toy, all from one plan (`tidyTimes`), so they move in step.

/** A toy's size on the floor (its layer is TOY × TOY, its bottom on the floor). */
export const TOY = 96;

/**
 * Where the toys lie on the floor, from left to right: `x` the middle, `y` the bottom. Two rows on the rug, the back
 * row half a toy apart from the front row, so none hides another and the claw reaches each from above.
 */
export const TOY_PLACES: { x: number; y: number }[] = [
  ...[250, 355, 465, 575, 685, 795, 905, 1015].map((x) => ({ x, y: 790 })),
  ...[300, 410, 520, 630, 740, 850, 960].map((x) => ({ x, y: 680 })),
].sort((a, b) => a.x - b.x);

/** At least this many toys, also for a few seconds, so the floor is always full of them. */
export const MIN_TOYS = 6;

/** At most this many: one on every place. Five minutes gets them all, one every 20 seconds. */
export const MAX_TOYS = TOY_PLACES.length;

/** How many toys lie on the floor for a run of `ms`: one every 20 seconds, at least `MIN_TOYS`, at most `MAX_TOYS`. */
export function toyCount(ms: number): number {
  return Math.max(MIN_TOYS, Math.min(MAX_TOYS, Math.round(ms / 20_000)));
}

/** The toys there are, each drawn on its own (`ToyArt`). */
export const TOY_KINDS = ["block", "ball", "car", "duck", "rings", "drum", "book", "top"] as const;
export type ToyKind = (typeof TOY_KINDS)[number];

/** The toy box: its front's left and right edge, its rim and the floor it stands on. */
export const BOX = { left: 1070, right: 1310, rim: 590, bottom: 790 } as const;

/** The box's middle: the trolley waits above it before the first toy. */
export const BOX_MIDDLE = (BOX.left + BOX.right) / 2;

/** How big a toy lies in the heap, as a share of its size on the floor, so all of them fit in the box. */
export const HEAP_SCALE = 0.6;

/** How many toys lie in each row of the heap, from the bottom up: as many as `MAX_TOYS`. */
export const HEAP_ROWS = [4, 4, 4, 3] as const;

/**
 * Where the n-th toy to land lies in the box: `x` its middle, `y` its bottom. Rows from the bottom up, each row on the
 * one below, the bottom row half hidden behind the box's front, so the heap is seen growing over the rim.
 */
export function heapSlot(n: number): { x: number; y: number } {
  let row = 0;
  let i = n;
  while (row < HEAP_ROWS.length - 1 && i >= HEAP_ROWS[row]) i -= HEAP_ROWS[row++];
  const inRow = HEAP_ROWS[row];
  // A small stagger, so the heap looks thrown in, not set in a grid.
  const wobble = ((n * 7) % 5) - 2;
  return { x: BOX_MIDDLE + (i - (inRow - 1) / 2) * 46 + 3 * wobble, y: BOX.rim + 12 - row * 40 + Math.abs(wobble) };
}

/** The crane's beam, from its left post to its right one: its top and height. */
export const BEAM = { left: 160, right: 1340, y: 110, h: 34 } as const;

/** The crane's posts: their left edges and width; they stand on the floor at `foot`. */
export const POSTS = { xs: [168, 1314], w: 26, foot: 830 } as const;

/** The trolley hanging under the beam: its size, its top at the beam's bottom. */
export const TROLLEY = { w: 100, h: 46, y: BEAM.y + BEAM.h } as const;

/** Where the rope leaves the trolley. */
const ROPE_TOP = TROLLEY.y + TROLLEY.h;

/**
 * The claw: its box, where a toy's top lies in it when gripped (`grip` below its top), and its top at rest, high
 * enough that a toy it carries passes over the full heap.
 */
export const CLAW = { w: 140, h: 100, grip: 50, rest: 234 } as const;

/** The bottom of a toy the claw carries: above the heap's top, so it never passes through it. */
export const CARRY_BOTTOM = CLAW.rest + CLAW.grip + TOY;

/** The claw's top when it grips the toy at `place`. */
export const gripTop = (place: { y: number }) => place.y - TOY - CLAW.grip;

/** The longest the rope gets: down to the front row. */
const ROPE_MAX = Math.max(...TOY_PLACES.map(gripTop)) - ROPE_TOP + 8;

/** The rope's length when the claw's top is at `top`, as a share of `ROPE_MAX` (it is a line scaled from the trolley). */
const ropeScale = (top: number) => (top - ROPE_TOP + 6) / ROPE_MAX;

/** How far the claw's fingers turn out when open, in degrees. */
const OPEN_DEG = 24;

/** A toy on the floor, where it lies in the heap, and what it is. */
export interface TidyToy {
  x: number;
  y: number;
  kind: ToyKind;
  slot: { x: number; y: number };
}

/**
 * The toys of a run with `count` of them, in the order the crane takes them: spread over the places, the one
 * nearest the box first, so the empty floor grows from the box outwards.
 */
export function tidyToys(count: number): TidyToy[] {
  const n = TOY_PLACES.length;
  const picked = Array.from({ length: count }, (_, i) => (count === 1 ? n - 1 : Math.round((i * (n - 1)) / (count - 1))));
  return (
    picked
      // Kinds by the n-th toy picked, so even six toys are six different ones and neighbours never match.
      .map((i, n) => ({ ...TOY_PLACES[i], kind: TOY_KINDS[(n * 3) % TOY_KINDS.length] }))
      .sort((a, b) => b.x - a.x)
      .map((toy, k) => ({ ...toy, slot: heapSlot(k) }))
  );
}

/**
 * How one toy's turn is shared out, after its fall is set aside: a short rest above the box, the way to the toy, the
 * claw going down, gripping, coming up and the way back to the box. They add up to one.
 */
export const CYCLE = { rest: 0.04, move: 0.28, lower: 0.15, grip: 0.08, raise: 0.15, carry: 0.3 } as const;

/** How long a toy falls from the open claw into the box at most, in ms (less when toys come quickly). */
export const FALL_MS = 600;

/** One toy's turn, in ms after the start. */
export interface ToyTimes {
  /** The trolley sets off from where the toy before landed. */
  leave: number;
  /** It stands over the toy, and the claw starts down. */
  over: number;
  /** The claw is down round the toy and closes. */
  down: number;
  /** It has gripped the toy and lifts it. */
  gripped: number;
  /** The toy is up, and the trolley carries it to the box. */
  up: number;
  /** Over its place in the box the claw opens, and the toy falls straight down. */
  open: number;
  /** It lies in the box. */
  land: number;
}

/** Works out every toy's turn for a run of `total` ms with `count` toys: each gets the same share, the last lands at the end. */
export function tidyTimes(total: number, count: number): ToyTimes[] {
  const unit = total / count;
  const fall = Math.min(FALL_MS, unit * 0.07);
  const work = unit - fall;
  return Array.from({ length: count }, (_, k) => {
    let at = k * unit;
    const step = (share: number) => {
      at += share * work;
      return at;
    };
    const leave = step(CYCLE.rest);
    const over = step(CYCLE.move);
    const down = step(CYCLE.lower);
    const gripped = step(CYCLE.grip);
    const up = step(CYCLE.raise);
    const open = step(CYCLE.carry);
    return { leave, over, down, gripped, up, open, land: (k + 1) * unit };
  });
}

/** A toy's place in the box as a transform of its layer on the floor (scaled from its middle). */
function inBox(toy: TidyToy) {
  const dx = ((toy.slot.x - toy.x) / TOY) * 100;
  const dy = ((toy.slot.y - (HEAP_SCALE * TOY) / 2 - (toy.y - TOY / 2)) / TOY) * 100;
  return `translate(${dx.toFixed(2)}%, ${dy.toFixed(2)}%) scale(${HEAP_SCALE})`;
}

/** One keyframe: when (ms), the transform then, and how it moves on to the next. */
type Frame = { at: number; transform: string; ease?: string };

/** A `@keyframes` rule for a run of `total` ms from frames in time order. */
function keyframes(name: string, total: number, frames: Frame[]) {
  const percent = (ms: number) => ((Math.max(0, Math.min(ms, total)) / total) * 100).toFixed(3);
  return `@keyframes ${name} {${frames
    .map((f) => `${percent(f.at)}% { transform: ${f.transform}; animation-timing-function: ${f.ease ?? "ease-in-out"}; }`)
    .join(" ")}}`;
}

/**
 * The crane's and the toys' ways as keyframes made for this run, since how many toys there are and when each is
 * carried depends on the time set. The layers name them by `--tm-anim`.
 */
function TidyKeyframes({ total, toys, times }: { total: number; toys: TidyToy[]; times: ToyTimes[] }) {
  const trolley: Frame[] = [{ at: 0, transform: "translateX(0%)" }];
  const claw: Frame[] = [{ at: 0, transform: "translateY(0%)" }];
  const rope: Frame[] = [{ at: 0, transform: `scaleY(${ropeScale(CLAW.rest).toFixed(4)})` }];
  const fingers: Frame[] = [{ at: 0, transform: `rotate(calc(var(--tm-side) * ${OPEN_DEG}deg))` }];
  const along = (x: number) => `translateX(${(((x - BOX_MIDDLE) / TROLLEY.w) * 100).toFixed(2)}%)`;
  const clawAt = (top: number) => `translateY(${(((top - CLAW.rest) / CLAW.h) * 100).toFixed(2)}%)`;
  const ropeAt = (top: number) => `scaleY(${ropeScale(top).toFixed(4)})`;
  const turned = (open: boolean) => `rotate(calc(var(--tm-side) * ${open ? OPEN_DEG : 0}deg))`;
  let x = BOX_MIDDLE;
  toys.forEach((toy, k) => {
    const t = times[k];
    const low = gripTop(toy);
    trolley.push({ at: t.leave, transform: along(x) }, { at: t.over, transform: along(toy.x) }, { at: t.up, transform: along(toy.x) });
    x = toy.slot.x;
    trolley.push({ at: t.open, transform: along(x) });
    for (const [frames, at] of [
      [claw, clawAt],
      [rope, ropeAt],
    ] as const)
      frames.push(
        { at: t.over, transform: at(CLAW.rest) },
        { at: t.down, transform: at(low) },
        { at: t.gripped, transform: at(low) },
        { at: t.up, transform: at(CLAW.rest) },
      );
    fingers.push(
      { at: t.down, transform: turned(true) },
      { at: t.gripped, transform: turned(false) },
      { at: t.open, transform: turned(false) },
      { at: t.open + Math.min(200, (t.land - t.open) / 2), transform: turned(true) },
    );
  });
  const end = (frames: Frame[]) => [...frames, { at: total, transform: frames[frames.length - 1].transform }];
  const toyFrames = toys.map((toy, k) => {
    const t = times[k];
    const lift = ((CARRY_BOTTOM - toy.y) / TOY) * 100;
    const carried = (dx: number) => `translate(${dx.toFixed(2)}%, ${lift.toFixed(2)}%) scale(1)`;
    return keyframes(`tm-tidy-toy-${k}`, total, [
      { at: 0, transform: "translate(0%, 0%) scale(1)" },
      { at: t.gripped, transform: "translate(0%, 0%) scale(1)" },
      { at: t.up, transform: carried(0) },
      { at: t.open, transform: carried(((toy.slot.x - toy.x) / TOY) * 100), ease: "ease-in" },
      { at: t.land, transform: inBox(toy) },
      { at: total, transform: inBox(toy) },
    ]);
  });
  return (
    <style>
      {[
        keyframes("tm-tidy-trolley", total, end(trolley)),
        keyframes("tm-tidy-claw", total, end(claw)),
        keyframes("tm-tidy-rope", total, end(rope)),
        keyframes("tm-tidy-fingers", total, end(fingers)),
        ...toyFrames,
      ].join("\n")}
    </style>
  );
}

/** The room: wall, floor, rug, the crane's posts and beam, and the inside of the toy box; drawn once. */
const TidyBackdrop = memo(function TidyBackdrop() {
  const floor = 540;
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-back">
      <Draw w={STAGE_W} h={STAGE_H}>
        <rect width={STAGE_W} height={floor} fill="#e3f0fb" />
        {/* A soft pattern of dots on the wallpaper. */}
        {Array.from({ length: 9 }, (_, row) =>
          Array.from({ length: 17 }, (_, col) => <circle key={`${row}-${col}`} cx={col * 100 + (row % 2) * 50 + 20} cy={row * 60 + 30} r="6" fill="#cfe3f5" />),
        )}
        <rect y={floor} width={STAGE_W} height={STAGE_H - floor} fill="#e8b980" />
        {[620, 700, 790, 880].map((y) => (
          <path key={y} d={`M0 ${y} H${STAGE_W}`} stroke="#d39e62" strokeWidth="4" />
        ))}
        <rect y={floor - 24} width={STAGE_W} height="28" fill="#fff" stroke="#d8c8b4" strokeWidth="3" />
        {/* The rug the toys lie on. */}
        <ellipse cx="630" cy="735" rx="500" ry="125" fill="#f3cfe2" stroke="#e2a9c8" strokeWidth="8" />
        <ellipse cx="630" cy="735" rx="440" ry="96" fill="none" stroke="#fff" strokeWidth="5" strokeDasharray="16 14" />
        {/* The inside of the toy box, behind the toys falling into it. */}
        <path
          d={`M${BOX.left} ${BOX.rim} L${BOX.left + 18} ${BOX.rim - 34} H${BOX.right - 18} L${BOX.right} ${BOX.rim} Z`}
          fill="#2f5f96"
          stroke={INK}
          strokeWidth="6"
          strokeLinejoin="round"
        />
        {/* The crane: two red posts on feet and a yellow beam with holes, like a toy building set. */}
        {POSTS.xs.map((x) => (
          <g key={x}>
            <rect x={x} y={BEAM.y} width={POSTS.w} height={POSTS.foot - BEAM.y} fill="#e8413a" stroke={INK} strokeWidth="6" />
            <rect x={x - 22} y={POSTS.foot - 12} width={POSTS.w + 44} height="22" rx="8" fill="#c92a2a" stroke={INK} strokeWidth="6" />
          </g>
        ))}
        <rect x={BEAM.left} y={BEAM.y} width={BEAM.right - BEAM.left} height={BEAM.h} rx="6" fill="#ffd43b" stroke={INK} strokeWidth="6" />
        {Array.from({ length: 19 }, (_, i) => (
          <circle key={i} cx={BEAM.left + 40 + i * 61} cy={BEAM.y + BEAM.h / 2} r="7" fill="#e8a400" />
        ))}
      </Draw>
    </Layer>
  );
});

/** One toy in a 100 × 100 box standing on its bottom edge. */
function ToyArt({ kind }: { kind: ToyKind }) {
  const line = { stroke: INK, strokeWidth: 4, strokeLinejoin: "round" as const };
  let art: ReactNode;
  if (kind === "block")
    art = (
      <>
        <path d="M14 34 L30 18 H90 L74 34 Z" fill="#ff8787" {...line} />
        <path d="M74 34 L90 18 V80 L74 96 Z" fill="#c92a2a" {...line} />
        <rect x="14" y="34" width="60" height="62" fill="#fa5252" {...line} />
        <path d="M44 48 L49 60 L62 61 L52 69 L56 82 L44 74 L32 82 L36 69 L26 61 L39 60 Z" fill="#ffe066" stroke={INK} strokeWidth="2.5" />
      </>
    );
  else if (kind === "ball")
    art = (
      <>
        <circle cx="50" cy="56" r="40" fill="#4dabf7" {...line} />
        <path d="M14 40 Q50 62 86 40 L90 56 Q50 80 10 56 Z" fill="#ffd43b" />
        <path d="M50 16 Q32 56 50 96 Q68 56 50 16 Z" fill="#ff6b6b" />
        <circle cx="50" cy="56" r="40" fill="none" {...line} />
        <ellipse cx="36" cy="36" rx="9" ry="6" fill="#fff" opacity="0.8" transform="rotate(-30 36 36)" />
      </>
    );
  else if (kind === "car")
    art = (
      <>
        <path d="M28 52 L36 30 H66 L76 52 Z" fill="#a5d8ff" {...line} />
        <path d="M50 30 V52" stroke={INK} strokeWidth="4" />
        <rect x="6" y="50" width="88" height="30" rx="12" fill="#40c057" {...line} />
        <circle cx="94" cy="62" r="4" fill="#ffe066" />
        {[28, 72].map((x) => (
          <g key={x}>
            <circle cx={x} cy="82" r="13" fill="#495057" {...line} />
            <circle cx={x} cy="82" r="5" fill="#dee2e6" />
          </g>
        ))}
      </>
    );
  else if (kind === "duck")
    art = (
      <>
        <path d="M10 66 Q12 96 50 96 Q86 96 90 70 Q80 76 66 70 Q60 52 44 60 Q26 66 10 66 Z" fill="#ffd43b" {...line} />
        <circle cx="62" cy="40" r="22" fill="#ffd43b" {...line} />
        <path d="M80 40 Q96 42 92 50 Q86 54 78 50 Z" fill="#fd7e14" {...line} />
        <circle cx="66" cy="34" r="4" fill={INK} />
        <path d="M30 74 Q44 84 58 72" fill="none" stroke="#e8a400" strokeWidth="4" strokeLinecap="round" />
      </>
    );
  else if (kind === "rings")
    art = (
      <>
        <rect x="46" y="8" width="8" height="80" rx="4" fill="#c48a4f" {...line} />
        {[
          ["#fa5252", 80, 84],
          ["#fd7e14", 66, 70],
          ["#fcc419", 54, 56],
          ["#51cf66", 42, 42],
          ["#4dabf7", 30, 28],
        ].map(([color, w, y]) => (
          <ellipse key={String(color)} cx="50" cy={Number(y)} rx={Number(w) / 2} ry="9" fill={String(color)} {...line} />
        ))}
        <rect x="14" y="88" width="72" height="9" rx="4" fill="#c48a4f" {...line} />
        <circle cx="50" cy="12" r="7" fill="#cc5de8" {...line} />
      </>
    );
  else if (kind === "drum")
    art = (
      <>
        <path d="M12 38 V82 Q50 100 88 82 V38 Z" fill="#e64980" {...line} />
        <path d="M12 46 L24 76 L36 50 L50 80 L64 50 L76 76 L88 46" fill="none" stroke="#fff" strokeWidth="5" strokeLinejoin="round" />
        <ellipse cx="50" cy="38" rx="38" ry="13" fill="#fff4e6" {...line} />
        <path d="M30 26 L62 6 M70 26 L44 4" stroke="#c48a4f" strokeWidth="6" strokeLinecap="round" />
      </>
    );
  else if (kind === "book")
    art = (
      <>
        <path d="M22 18 H84 V92 H22 Z" fill="#fff" {...line} />
        <path d="M14 12 H78 V88 H14 Z" fill="#7950f2" {...line} />
        <rect x="14" y="12" width="12" height="76" fill="#5f3dc4" stroke={INK} strokeWidth="4" />
        <circle cx="52" cy="46" r="14" fill="#ffd43b" stroke={INK} strokeWidth="3" />
        <path d="M78 88 L84 92" stroke={INK} strokeWidth="4" />
      </>
    );
  else
    art = (
      <>
        <rect x="45" y="6" width="10" height="20" rx="4" fill="#c48a4f" {...line} />
        <path d="M50 96 L8 52 Q50 14 92 52 Z" fill="#20c997" {...line} />
        <path d="M23 37 Q50 22 77 37 L84 44 Q50 26 16 44 Z" fill="#ffd43b" />
        <path d="M13 56 Q50 40 87 56 L78 66 Q50 54 22 66 Z" fill="#ff6b6b" />
        <path d="M50 96 L8 52 Q50 14 92 52 Z" fill="none" {...line} />
      </>
    );
  return <svg viewBox="0 0 100 100">{art}</svg>;
}

/**
 * The toys, each a small layer on its own keyframes (`tm-tidy-toy-<n>`): it lies on the floor until the claw has it,
 * goes up and across with the claw and falls straight down onto its place in the heap. While it lies on the floor a tap
 * lights it (H-51: what is left); once it is taken, that light is gone with it.
 */
const TidyToys = memo(function TidyToys({ toys, times, glow }: { toys: TidyToy[]; times: ToyTimes[]; glow: number }) {
  return (
    <>
      {toys.map((toy, k) => (
        <Layer
          key={k}
          x={toy.x - TOY / 2}
          y={toy.y - TOY}
          w={TOY}
          h={TOY}
          className="tm-toy"
          style={{ "--tm-anim": `tm-tidy-toy-${k}`, "--tm-end": inBox(toy) } as CSSProperties}
        >
          <ToyArt kind={toy.kind} />
          <div className="tm-toy-left" style={{ "--tm-at": `${times[k].gripped}ms` } as CSSProperties}>
            <LeftGlow n={glow} />
          </div>
        </Layer>
      ))}
    </>
  );
});

/** The box's front, over the toys that fell in: painted planks and a big star; drawn once. */
const BoxFront = memo(function BoxFront() {
  const w = BOX.right - BOX.left;
  const h = BOX.bottom - BOX.rim + 6;
  return (
    <Layer x={BOX.left} y={BOX.rim - 4} w={w} h={h}>
      <Draw w={w} h={h}>
        <rect x="3" y="6" width={w - 6} height={h - 9} rx="10" fill="#4c8fd6" stroke={INK} strokeWidth="6" />
        {[0.33, 0.66].map((f) => (
          <path key={f} d={`M10 ${h * f} H${w - 10}`} stroke="#3b78bd" strokeWidth="5" />
        ))}
        <rect x="0" y="0" width={w} height="22" rx="10" fill="#74b0ee" stroke={INK} strokeWidth="6" />
        <path
          d={`M${w / 2} ${h * 0.3} l14 30 32 3 -24 21 8 32 -30 -17 -30 17 8 -32 -24 -21 32 -3 Z`}
          fill="#ffd43b"
          stroke={INK}
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </Draw>
    </Layer>
  );
});

/**
 * The crane's moving part: the trolley running along the beam, its rope growing down and the claw at its end, whose
 * two fingers open and close (each a small layer turning round its pivot). The claw sways a little every second, so
 * even a long run never looks stuck (H-63).
 */
const Crane = memo(function Crane({ end }: { end: string }) {
  const part = (x: number, y: number, w: number, h: number): CSSProperties => ({
    left: `${(x / TROLLEY.w) * 100}%`,
    top: `${(y / TROLLEY.h) * 100}%`,
    width: `${(w / TROLLEY.w) * 100}%`,
    height: `${(h / TROLLEY.h) * 100}%`,
  });
  // One finger, drawn on the left; the right one is the same mirrored, each turning round its own pivot.
  const finger = (mirror: boolean) => (
    <svg viewBox={`0 0 ${CLAW.w} ${CLAW.h}`} style={mirror ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M46 34 Q20 52 16 74 Q16 90 30 97" fill="none" stroke={INK} strokeWidth="15" strokeLinecap="round" />
      <path d="M46 34 Q20 52 16 74 Q16 90 30 97" fill="none" stroke="#adb5bd" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
  return (
    <Layer
      x={BOX_MIDDLE - TROLLEY.w / 2}
      y={TROLLEY.y}
      w={TROLLEY.w}
      h={TROLLEY.h}
      className="tm-tidy-trolley"
      style={{ "--tm-anim": "tm-tidy-trolley", "--tm-trolley-end": end } as CSSProperties}
    >
      <div
        className="tm-tidy-rope"
        style={{ ...part(TROLLEY.w / 2 - 3, TROLLEY.h, 6, ROPE_MAX), "--tm-anim": "tm-tidy-rope", "--tm-rope-rest": ropeScale(CLAW.rest) } as CSSProperties}
      />
      <div
        className="tm-tidy-claw"
        style={{ ...part((TROLLEY.w - CLAW.w) / 2, CLAW.rest - TROLLEY.y, CLAW.w, CLAW.h), "--tm-anim": "tm-tidy-claw" } as CSSProperties}
      >
        <div className="tm-tidy-sway">
          <div className="tm-tidy-finger tm-tidy-left" style={FINGERS}>
            {finger(false)}
          </div>
          <div className="tm-tidy-finger tm-tidy-right" style={FINGERS}>
            {finger(true)}
          </div>
          <svg viewBox={`0 0 ${CLAW.w} ${CLAW.h}`}>
            <rect x="36" y="2" width="68" height="36" rx="12" fill="#fd7e14" stroke={INK} strokeWidth="5" />
            <circle cx="70" cy="20" r="8" fill="#ffd43b" stroke={INK} strokeWidth="3" />
          </svg>
        </div>
      </div>
      <Draw w={TROLLEY.w} h={TROLLEY.h}>
        {[24, 76].map((cx) => (
          <circle key={cx} cx={cx} cy="4" r="11" fill="#495057" stroke={INK} strokeWidth="4" />
        ))}
        <rect x="6" y="10" width={TROLLEY.w - 12} height={TROLLEY.h - 12} rx="10" fill="#fd7e14" stroke={INK} strokeWidth="5" />
      </Draw>
    </Layer>
  );
});

/** The fingers' keyframes, named on each finger (the claw names its own, which they would take over). */
const FINGERS = { "--tm-anim": "tm-tidy-fingers" } as CSSProperties;

/** Where the trolley stands at the end, over the last toy's place, for `--tm-trolley-end`. */
function trolleyEnd(toys: TidyToy[]) {
  const last = toys.at(-1);
  return `${((((last ? last.slot.x : BOX_MIDDLE) - BOX_MIDDLE) / TROLLEY.w) * 100).toFixed(2)}%`;
}

/** The whole picture: the room, the toys, the box's front and the crane. */
export function TidyScene({ count, total, glow }: { count: number; total: number; glow: number }) {
  // Worked out once for the run, so the memoised parts are not drawn again when a tap lights the toys.
  const toys = useMemo(() => tidyToys(count), [count]);
  const times = useMemo(() => tidyTimes(total, count), [total, count]);
  return (
    <>
      <TidyBackdrop />
      <TidyKeyframes total={total} toys={toys} times={times} />
      <TidyToys toys={toys} times={times} glow={glow} />
      <BoxFront />
      <Crane end={trolleyEnd(toys)} />
    </>
  );
}
