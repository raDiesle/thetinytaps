import { memo, useMemo, type CSSProperties } from "react";
import { Draw, INK, Layer, LeftGlow, STAGE_H, STAGE_W } from "./scenes";

// Marble Jar (H-149, user request, 24 November 2026: a jar filling with marbles, „wie das Brett bei Kettenreaktion“):
// a glass tube full of marbles hangs over a wooden pegboard, a little latch at its foot. Marble after marble the latch
// opens, the marble drops onto the first nail and bounces from nail to nail down the board (a Galton board: each nail
// sends it half a step left or right), lands on one of two slanted boards that funnel it into the jar's mouth, falls
// through the neck and rolls along the heap to its own place. Row by row from the bottom, each row from its edges
// inwards, the jar fills; the last marble lands as the time is up and the jar is full. The marbles still waiting in the
// tube step down one by one, the one on the latch wiggling once a second while it waits (H-63). Each marble is two
// small layers (across, and up and down) on keyframes written for the run (`JarKeyframes`), so React draws nothing per
// frame; a shorter run starts with the jar's lower rows already filled (`marbleCount`), so the jar is full at every end.

/** A marble's radius and a nail's, in stage units; a marble touches a nail at their sum. */
export const MARBLE_R = 20;
export const NAIL_R = 8;
const TOUCH = MARBLE_R + NAIL_R;

/** The picture's middle, where the tube, the board's first nail and the jar's mouth stand one over the other. */
export const MIDDLE = 800;

/** The tube the marbles wait in: its inner width, the latch at its foot, the marble resting on it and the step between two. */
export const TUBE = { inner: 52, mouth: 192, gate: 170, step: 42 } as const;

/** How many marbles wait in the tube on screen behind the one on the latch; the others wait above the picture. */
export const QUEUE = 4;

/** The nails: their rows' heights, the room between two in a row and the half step a marble goes at each. */
export const NAIL_ROWS = [230, 268, 306, 344, 382] as const;
export const NAIL_STEP = 100;
const HALF = NAIL_STEP / 2;

/** Every nail on the board: even rows on the middle, odd rows half a step aside, filling the board's width. */
export const NAILS: readonly { x: number; y: number }[] = NAIL_ROWS.flatMap((y, r) =>
  r % 2 === 0
    ? Array.from({ length: 7 }, (_, k) => ({ x: MIDDLE + (k - 3) * NAIL_STEP, y }))
    : Array.from({ length: 8 }, (_, k) => ({ x: MIDDLE + (k - 3.5) * NAIL_STEP, y })),
);

/** The pegboard behind the nails. */
export const BOARD = { x: 420, y: 196, w: 760, h: 304 } as const;

/** The left funnel board's top edge, from its outer end to its tip in the jar's mouth (the right one is its mirror). */
export const FUNNEL = { from: { x: 440, y: 420 }, to: { x: 774, y: 476 } } as const;
const FUNNEL_SLOPE = (FUNNEL.to.y - FUNNEL.from.y) / (FUNNEL.to.x - FUNNEL.from.x);
/** How far a marble's middle lies above the slanted board it rolls on. */
const ON_FUNNEL = MARBLE_R * Math.hypot(1, FUNNEL_SLOPE);

/** The funnel board's top at `x`, the left one or the right one's mirror. */
export function funnelY(x: number): number {
  const left = x <= MIDDLE ? x : 2 * MIDDLE - x;
  return FUNNEL.from.y + (left - FUNNEL.from.x) * FUNNEL_SLOPE;
}

/** Where a marble leaves the funnel at its tip and tips over into the jar's mouth, on the left. */
const TIP_X = 770;

/**
 * The jar: its lip, its neck's inner width, its body's inner sides and floor. The body holds `ROWS` rows of marbles packed
 * as marbles lie (each row in the dips of the one below), the lowest on its floor and the highest under its shoulders.
 */
export const JAR = { lip: 466, neckLeft: 738, neckRight: 862, left: 608, right: 992, floor: 790 } as const;

/** How many rows of marbles the jar holds, nine and eight in turn, and how high one lies over the one below. */
export const ROWS = 7;
const ROW_RISE = 2 * MARBLE_R * Math.sin(Math.PI / 3);

/** The places in the jar in the order they fill: row by row from the floor, each row from its edges inwards. */
export const SLOTS: readonly { x: number; y: number }[] = Array.from({ length: ROWS }, (_, k) => {
  const count = k % 2 === 0 ? 9 : 8;
  const y = JAR.floor - MARBLE_R - k * ROW_RISE;
  const order = Array.from({ length: count }, (_, n) => (n % 2 === 0 ? n / 2 : count - 1 - (n - 1) / 2));
  return order.map((j) => ({ x: MIDDLE + (j - (count - 1) / 2) * 2 * MARBLE_R, y }));
}).flat();

/** A full jar, and the fewest marbles that fall in a run. */
export const MAX_MARBLES = SLOTS.length;
export const MIN_MARBLES = 20;

/**
 * How many marbles fall in a run of `ms`: one every five seconds, so five minutes fill the whole jar, at least
 * `MIN_MARBLES` (a short run's come quicker, never fewer), at most a full jar. The places they don't take are filled
 * from the start.
 */
export function marbleCount(ms: number): number {
  return Math.max(MIN_MARBLES, Math.min(MAX_MARBLES, Math.round(ms / 5000)));
}

/** The marbles' colours, taken in turn three apart, so two marbles side by side in the jar never share one. */
const COLORS = ["#ff4d4d", "#ffd23f", "#3a86ff", "#51cf66", "#cc5de8", "#ff922b", "#22b8cf"];
const colorOf = (slot: number) => COLORS[(slot * 3) % COLORS.length];

/** How fast things fall in the picture (stage units per ms²): slower than in life, so a child can follow a marble. */
const GRAVITY = 0.0012;
const fallMs = (h: number) => Math.sqrt((2 * Math.max(0, h)) / GRAVITY);

/** A bounce from one nail to the next row's, and the last one off the board onto the funnel. */
export const BOUNCE_MS = 420;
const LAST_BOUNCE_MS = 520;

/** Eases of a marble's way: dropping, bouncing up a little and falling onto the next nail, rolling down a board. */
const DROP = "cubic-bezier(0.5,0,0.75,0.4)";
const BOUNCE = "cubic-bezier(0.3,-0.75,0.75,0.4)";
const ROLL_DOWN = "ease-in";
const ROLL_OUT = "ease-out";

/** A value of one of a marble's two layers at a moment, and how it moves on to the next. */
interface Step {
  at: number;
  v: number;
  ease?: string;
}

/** One marble falling in a run: its place in the jar, its colour and its way as the two layers' steps. */
export interface JarMarble {
  /** Its place in the jar (`SLOTS`) and where that is. */
  slot: number;
  to: { x: number; y: number };
  color: string;
  /** Where it waits in the tube at the start (0 on the latch), stage units. */
  from: { x: number; y: number };
  /** When the latch lets it go, when it hits each nail, and when it lies on its place. */
  release: number;
  impacts: { at: number; x: number; y: number }[];
  land: number;
  /** When it came onto the latch (it wiggles from then on, once a second); none for the first. */
  waitFrom?: number;
  across: Step[];
  upDown: Step[];
}

/** The latch's moments: when it opens for each marble and when it is shut again; none when the marbles come too quickly. */
export interface Latch {
  open: number[];
  shut: number[];
}

/** A small seeded random, so a run, its card and the tests see the same bounces. */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A marble's way from the latch to its place, as moments after its release (ms) and points (stage units). */
function wayOf(slot: { x: number; y: number }, random: () => number, pace: number) {
  const impacts: { at: number; x: number; y: number }[] = [];
  let at = fallMs(NAIL_ROWS[0] - TOUCH - TUBE.gate) * pace;
  let m = 0;
  for (let r = 0; r < NAIL_ROWS.length; r++) {
    if (r > 0) at += BOUNCE_MS * pace;
    impacts.push({ at, x: MIDDLE + m * HALF, y: NAIL_ROWS[r] - TOUCH });
    // Each nail sends it half a step to the left or the right.
    m += random() < 0.5 ? -1 : 1;
  }
  // Off the last nail onto the funnel board, down it to the tip, through the mouth and along the heap to its place.
  const landX = MIDDLE + m * HALF;
  const onFunnel = { at: at + LAST_BOUNCE_MS * pace, x: landX, y: funnelY(landX) - ON_FUNNEL };
  const tipX = landX < MIDDLE ? TIP_X : 2 * MIDDLE - TIP_X;
  const tip = { at: onFunnel.at + (300 + Math.abs(tipX - landX) * 1.5) * pace, x: tipX, y: funnelY(tipX) - ON_FUNNEL };
  const columnX = Math.max(MIDDLE - MARBLE_R, Math.min(MIDDLE + MARBLE_R, slot.x));
  const down = { at: tip.at + fallMs(slot.y - tip.y) * pace, x: columnX, y: slot.y };
  const land = down.at + (Math.abs(slot.x - columnX) > 1 ? (180 + Math.abs(slot.x - columnX) * 3) * pace : 0);
  return { impacts, onFunnel, tip, down, land };
}

/** The longest a marble's way can take at an even pace, from the latch to the jar's highest corner. */
export const LONGEST_WAY = Math.max(...SLOTS.map((slot) => wayOf(slot, () => 0, 1).land));

/**
 * Works out a run of `total` ms with `count` marbles: the jar's places they don't take are filled from the start, the
 * others fall one after the other with even room between their releases, the last landing as the time is up. A run
 * shorter than two marbles' ways goes at a quicker pace.
 */
export function jarPlan(total: number, count: number): { marbles: JarMarble[]; latch: Latch | null; prefilled: number; pace: number } {
  const n = Math.max(1, Math.min(MAX_MARBLES, count));
  const prefilled = MAX_MARBLES - n;
  const pace = Math.min(1, total / (2 * LONGEST_WAY));
  const random = seeded(total * 7 + n);
  const ways = SLOTS.slice(prefilled).map((slot) => wayOf(slot, random, pace));
  const lead = Math.min(1000, total * 0.05);
  const gap = n > 1 ? (total - lead - ways[n - 1].land) / (n - 1) : 0;
  const releases = ways.map((_, i) => lead + i * gap);
  // The marbles behind step down once the one ahead has dropped clear of the latch.
  const clear = Math.min(fallMs(TUBE.step) * pace, gap * 0.5);
  const stepMs = Math.min(300, gap * 0.45);
  const latch = gap >= 900 ? { open: releases.map((r) => r - 120), shut: releases.map((r) => r + clear + 150) } : null;
  const marbles = ways.map((way, i): JarMarble => {
    const slotIndex = prefilled + i;
    const to = SLOTS[slotIndex];
    const queueY = (pos: number) => TUBE.gate - pos * TUBE.step;
    const startPos = Math.min(i, QUEUE + 1);
    const release = releases[i];
    const upDown: Step[] = [{ at: 0, v: queueY(startPos) }];
    for (let j = Math.max(0, i - QUEUE - 1); j < i; j++) {
      upDown.push({ at: releases[j] + clear, v: queueY(i - j), ease: "ease-in-out" }, { at: releases[j] + clear + stepMs, v: queueY(i - j - 1) });
    }
    upDown.push({ at: release, v: TUBE.gate, ease: DROP });
    const impacts = way.impacts.map((p) => ({ ...p, at: release + p.at }));
    for (const p of impacts) upDown.push({ at: p.at, v: p.y, ease: BOUNCE });
    upDown.push(
      { at: release + way.onFunnel.at, v: way.onFunnel.y, ease: ROLL_DOWN },
      { at: release + way.tip.at, v: way.tip.y, ease: DROP },
      { at: release + way.down.at, v: way.down.y },
    );
    const across: Step[] = [{ at: 0, v: MIDDLE }, ...impacts.map((p) => ({ at: p.at, v: p.x }))];
    across.push(
      { at: release + way.onFunnel.at, v: way.onFunnel.x, ease: ROLL_DOWN },
      { at: release + way.tip.at, v: way.tip.x },
      { at: release + way.down.at, v: way.down.x, ease: ROLL_OUT },
      { at: release + way.land, v: to.x },
    );
    const onLatch = i === 0 ? 0 : releases[i - 1] + clear + stepMs;
    return {
      slot: slotIndex,
      to,
      color: colorOf(slotIndex),
      from: { x: MIDDLE, y: queueY(startPos) },
      release,
      impacts,
      land: release + way.land,
      waitFrom: release - onLatch >= 1300 ? onLatch + 300 : undefined,
      across,
      upDown,
    };
  });
  return { marbles, latch, prefilled, pace };
}

/** How far the latch turns down on its hinge to let a marble go. */
const LATCH_OPEN = 80;

/** One layer's steps as a `@keyframes` rule over the run, short: only the eases that are not linear are named. */
function stepsRule(name: string, total: number, steps: Step[], axis: "X" | "Y", origin: number): string {
  const percent = (ms: number) => +((Math.max(0, Math.min(ms, total)) / total) * 100).toFixed(3);
  const move = (v: number) => `translate${axis}(${+(((v - origin) / (2 * MARBLE_R)) * 100).toFixed(1)}%)`;
  const all = [...steps, { at: total, v: steps[steps.length - 1].v }];
  return `@keyframes ${name}{${all.map((s) => `${percent(s.at)}%{transform:${move(s.v)}${s.ease ? `;animation-timing-function:${s.ease}` : ""}}`).join("")}}`;
}

/** Where a marble's layers end: across and up or down to its place, as the keyframes' last transforms. */
export function marbleEnd(marble: JarMarble) {
  return {
    x: `translateX(${+(((marble.to.x - marble.from.x) / (2 * MARBLE_R)) * 100).toFixed(1)}%)`,
    y: `translateY(${+(((marble.to.y - marble.from.y) / (2 * MARBLE_R)) * 100).toFixed(1)}%)`,
  };
}

/** The marbles' ways and the latch as keyframes made for this run. */
function JarKeyframes({ total, marbles, latch }: { total: number; marbles: JarMarble[]; latch: Latch | null }) {
  const rules = marbles.flatMap((m, i) => [
    stepsRule(`tm-jar-x-${i}`, total, m.across, "X", m.from.x),
    stepsRule(`tm-jar-y-${i}`, total, m.upDown, "Y", m.from.y),
  ]);
  if (latch) {
    const percent = (ms: number) => +((Math.max(0, Math.min(ms, total)) / total) * 100).toFixed(3);
    const frames = latch.open.flatMap((open, k) => {
      const shut = latch.shut[k];
      return [
        `${percent(open)}%{transform:rotate(0deg);animation-timing-function:ease-out}`,
        `${percent(open + 120)}%{transform:rotate(${LATCH_OPEN}deg);animation-timing-function:ease-in-out}`,
        `${percent(shut - 150)}%{transform:rotate(${LATCH_OPEN}deg);animation-timing-function:ease-in}`,
        `${percent(shut)}%{transform:rotate(0deg)}`,
      ];
    });
    rules.push(`@keyframes tm-jar-latch{0%{transform:rotate(0deg)}${frames.join("")}100%{transform:rotate(0deg)}}`);
  }
  return <style>{rules.join("\n")}</style>;
}

/** One marble's drawing: a round glass ball in its colour with a small light on it. */
function MarbleArt({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="18" fill={color} stroke={INK} strokeWidth="4" />
      <circle cx="24" cy="25" r="9" fill="#000" opacity="0.12" />
      <circle cx="14" cy="14" r="4.5" fill="#fff" opacity="0.8" />
    </svg>
  );
}

/** The room: a light blue wall with a soft pattern and the wooden table the jar stands on; drawn once. */
const JarBackdrop = memo(function JarBackdrop() {
  const table = 800;
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-back">
      <Draw w={STAGE_W} h={STAGE_H}>
        <rect width={STAGE_W} height={table} fill="#bfe3f5" />
        {Array.from({ length: 9 }, (_, row) =>
          Array.from({ length: 17 }, (_, k) => <circle key={`${row}-${k}`} cx={k * 100 + (row % 2) * 50} cy={row * 90 + 40} r="9" fill="#d8eefa" />),
        )}
        <rect y={table} width={STAGE_W} height={STAGE_H - table} fill="#c98a55" />
        <rect y={table} width={STAGE_W} height="18" fill="#e0a46e" stroke={INK} strokeWidth="5" />
        {[840, 872].map((y) => (
          <path key={y} d={`M0 ${y} H${STAGE_W}`} stroke="#b37645" strokeWidth="4" />
        ))}
      </Draw>
    </Layer>
  );
});

/** The left funnel board as a plank under its top edge; the right one is its mirror. */
function FunnelBoard({ right }: { right?: boolean }) {
  const { from, to } = FUNNEL;
  const flip = (x: number) => (right ? 2 * MIDDLE - x : x);
  return (
    <path
      d={`M${flip(from.x)} ${from.y} L${flip(to.x)} ${to.y} L${flip(to.x)} ${to.y + 16} L${flip(from.x)} ${from.y + 16} Z`}
      fill="#d9955b"
      stroke={INK}
      strokeWidth="5"
      strokeLinejoin="round"
    />
  );
}

/** The jar's outline, its outer edge: lip, neck, round shoulders, straight sides and a rounded foot. */
const JAR_PATH = "M728 482 V504 C728 532 598 526 598 562 V780 Q598 800 618 800 H982 Q1002 800 1002 780 V562 C1002 526 872 532 872 504 V482 Z";

/**
 * The pegboard with its nails and the two funnel boards, the tube's back and the jar's inside, with the marbles filled
 * from the start already lying in it; drawn once.
 */
const JarBoard = memo(function JarBoard({ prefilled }: { prefilled: number }) {
  const b = BOARD;
  return (
    <>
      <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-dims">
        <Draw w={STAGE_W} h={STAGE_H}>
          <rect x={b.x + 8} y={b.y + 10} width={b.w} height={b.h} rx="20" fill="#0002" />
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="20" fill="#f6d3a0" stroke={INK} strokeWidth="6" />
          <rect x={b.x + 14} y={b.y + 14} width={b.w - 28} height="22" rx="10" fill="#efc289" />
          {[250, 315, 380, 445].map((y, i) => (
            <path key={y} d={`M${b.x + 30 + i * 20} ${y} q120 -10 260 4 t300 -4`} stroke="#e9bb80" strokeWidth="5" fill="none" strokeLinecap="round" />
          ))}
          {NAILS.map((n) => (
            <g key={`${n.x}-${n.y}`}>
              <circle cx={n.x + 3} cy={n.y + 4} r={NAIL_R} fill="#0002" />
              <circle cx={n.x} cy={n.y} r={NAIL_R} fill="#f4c542" stroke={INK} strokeWidth="3.5" />
              <circle cx={n.x - 2.5} cy={n.y - 2.5} r="2.2" fill="#fff" />
            </g>
          ))}
          <FunnelBoard />
          <FunnelBoard right />
        </Draw>
      </Layer>
      <Layer x={0} y={0} w={STAGE_W} h={STAGE_H}>
        <Draw w={STAGE_W} h={STAGE_H}>
          {/* The tube's glass, seen from behind, and the jar's inside. */}
          <rect x={MIDDLE - TUBE.inner / 2 - 6} y="-20" width={TUBE.inner + 12} height={TUBE.mouth + 20} fill="#e6f6fd" opacity="0.7" />
          <path d={JAR_PATH} fill="#e6f6fd" opacity="0.75" />
          <path d="M610 790 H990" stroke="#b6dcee" strokeWidth="6" />
          {SLOTS.slice(0, prefilled).map((s, k) => (
            <g key={k} transform={`translate(${s.x - MARBLE_R} ${s.y - MARBLE_R})`}>
              <circle cx="20" cy="20" r="18" fill={colorOf(k)} stroke={INK} strokeWidth="4" />
              <circle cx="24" cy="25" r="9" fill="#000" opacity="0.12" />
              <circle cx="14" cy="14" r="4.5" fill="#fff" opacity="0.8" />
            </g>
          ))}
        </Draw>
      </Layer>
    </>
  );
});

/** The glass in front of the marbles: the tube with its brass foot, and the jar with its thick lip and a red bow. */
const JarFront = memo(function JarFront() {
  const tubeLeft = MIDDLE - TUBE.inner / 2 - 6;
  const tubeW = TUBE.inner + 12;
  return (
    <>
      <Layer x={tubeLeft - 12} y={-20} w={tubeW + 24} h={TUBE.mouth + 22}>
        <Draw w={tubeW + 24} h={TUBE.mouth + 22}>
          <rect x="12" y="0" width={tubeW} height={TUBE.mouth + 20} fill="#cdeefc" opacity="0.25" stroke={INK} strokeWidth="5" />
          <path d={`M22 10 V${TUBE.mouth}`} stroke="#9fd4ea" strokeWidth="4" />
          <rect x="4" y={TUBE.mouth + 4} width={tubeW + 16} height="16" rx="6" fill="#e9b949" stroke={INK} strokeWidth="5" />
        </Draw>
      </Layer>
      <Layer x={590} y={460} w={420} h={348}>
        <Draw w={420} h={348}>
          <g transform="translate(-590 -460)">
            <path d={JAR_PATH} fill="#cdeefc" fillOpacity="0.22" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
            <path d="M612 574 V770" stroke="#9fd4ea" strokeWidth="5" strokeLinecap="round" />
            <path d="M988 574 V770" stroke="#9fd4ea" strokeWidth="5" strokeLinecap="round" />
            <rect x="718" y={JAR.lip} width="164" height="20" rx="9" fill="#d6f1fc" stroke={INK} strokeWidth="6" />
            {/* A red ribbon round the neck with its bow at the side: the full jar is a present. */}
            <rect x="726" y="490" width="148" height="14" fill="#e03131" stroke={INK} strokeWidth="4" />
            <path d="M738 497 C700 472 690 520 738 497 Z" fill="#e03131" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <path d="M738 497 C706 516 720 538 738 497 Z" fill="#e03131" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <path d="M736 500 L716 536 M740 500 L736 540" stroke="#c92a2a" strokeWidth="7" strokeLinecap="round" />
            <circle cx="738" cy="497" r="8" fill="#c92a2a" stroke={INK} strokeWidth="4" />
          </g>
        </Draw>
      </Layer>
    </>
  );
});

/** The latch at the tube's foot, turning down on its hinge at the left to let a marble go. */
function JarLatch({ open }: { open: boolean }) {
  return (
    <Layer
      x={MIDDLE - TUBE.inner / 2}
      y={TUBE.mouth}
      w={TUBE.inner}
      h={10}
      className={`tm-jar-latch${open ? " tm-jar-latch-open" : ""}`}
      style={{ "--tm-anim": "tm-jar-latch", "--tm-end": "rotate(0deg)" } as CSSProperties}
    >
      <Draw w={TUBE.inner} h={10}>
        <rect x="0" y="0" width={TUBE.inner} height="10" rx="5" fill="#e03131" stroke={INK} strokeWidth="4" />
      </Draw>
    </Layer>
  );
}

/**
 * The room in the jar still to fill (H-51: what is left lights up at a tap): a box from under the jar's shoulders down to
 * the marbles, its lower end rising with them over the run.
 */
function StillToFill({ glow, prefilled }: { glow: number; prefilled: number }) {
  const top = SLOTS[MAX_MARBLES - 1].y - MARBLE_R;
  const bottom = prefilled > 0 ? SLOTS[prefilled - 1].y - MARBLE_R : JAR.floor;
  return (
    <Layer x={JAR.left} y={top} w={JAR.right - JAR.left} h={Math.max(1, bottom - top)} className="tm-jar-left">
      <LeftGlow n={glow} />
    </Layer>
  );
}

/** The marbles falling in this run, each on its two layers; the one on the latch wiggles once a second while it waits. */
const Marbles = memo(function Marbles({ marbles }: { marbles: JarMarble[] }) {
  return (
    <>
      {marbles.map((m, i) => {
        const end = marbleEnd(m);
        const waits = m.waitFrom === undefined ? 0 : Math.floor((m.release - m.waitFrom) / 1000);
        return (
          <Layer
            key={i}
            x={m.from.x - MARBLE_R}
            y={m.from.y - MARBLE_R}
            w={2 * MARBLE_R}
            h={2 * MARBLE_R}
            className="tm-jar-x"
            style={{ "--tm-anim": `tm-jar-x-${i}`, "--tm-end": end.x } as CSSProperties}
          >
            <div className="tm-jar-y" style={{ "--tm-anim": `tm-jar-y-${i}`, "--tm-end": end.y } as CSSProperties}>
              <div
                className="tm-hop-wait"
                style={waits > 0 ? ({ "--tm-wait": `${m.waitFrom}ms`, "--tm-waits": waits } as CSSProperties) : undefined}
                data-waits={waits > 0 ? "" : undefined}
              >
                <MarbleArt color={m.color} />
              </div>
            </div>
          </Layer>
        );
      })}
    </>
  );
});

/** The whole picture: the room, the board and the jar's inside, the marbles, the glass in front of them and the latch. */
export function JarScene({ count, total, glow }: { count: number; total: number; glow: number }) {
  // Worked out once for the run, so the memoised parts are not drawn again when a tap lights the room still to fill.
  const { marbles, latch, prefilled } = useMemo(() => jarPlan(total, count), [total, count]);
  return (
    <>
      <JarBackdrop />
      <JarKeyframes total={total} marbles={marbles} latch={latch} />
      <JarBoard prefilled={prefilled} />
      <StillToFill glow={glow} prefilled={prefilled} />
      <Marbles marbles={marbles} />
      <JarFront />
      <JarLatch open={!latch} />
    </>
  );
}
