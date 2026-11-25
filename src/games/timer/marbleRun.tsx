import { memo, type ReactNode, useEffect, useMemo, useState } from "react";
import { MASCOT_COLORS } from "@/components/Mascot";
import { playKnock } from "@/lib/sfx";
import { type Frame, keyframes } from "./keyframes";
import { useRunClock } from "./pause";
import { Bleed, INK, Layer, STAGE_H, STAGE_W } from "./scenes";
import { PlayerPatch } from "./players";
import type { PlayerLook, Players, TurnChild, TurnCount } from "./settings";

// Kugelbahn (H-117 with H-115; reworked on 25 November 2026, user request: a basket at the top and one at the bottom on
// one side of the board, a crank at its side, and as a marble has run in, the crank turns, the board turns over and the
// marble rolls back down from the basket now on top): two to four children take turns, reihum. A wooden marble run hangs
// on the playroom's wall on an axle through its middle. Its zigzag of grooved ramps runs from a basket hanging at its
// top left down to one hanging at its bottom left, and it is the same upside down (`marbleWay` is symmetric about the
// axle), so the board can turn over around it and still be the same run. The whole turn long the one marble rolls down
// into the bottom basket; as the turn changes, the crank on the right winds once round, the board turns over (the
// baskets hang on their pins and stay upright, the full one coming up in front), the basket now on top tips the marble
// onto the first ramp, and it rolls down again. So the marble's way is the time, plain from afar – the higher it still
// is, the longer it takes. Whose turn it is shows across the room (the rules): each child's place is a children's cup
// in its own colour with its animal's ears (fox, bear, rabbit, frog – no faces, as Abwechseln's cushions); the cup of
// the child whose turn it is stands in a warm glow of light, and every other one, with its strip of the room, lies in
// shade. Everything that moves is a small layer on keyframes written for the turn, so React draws nothing per frame.

/** A marble's radius. */
export const MARBLE_R = 22;

/** The axle the board turns round: its height on the stage (the board and its run are symmetric about it). */
export const AXLE_Y = 310;

/** The run's zigzag: its ramps' ends (the marble's middle), how much each ramp falls, and the radius of the curves between them. */
export const RUN = { left: 392, right: 1150, drop: 22, bend: 28 } as const;

/** How many ramps: an even number, so the run starts and ends on the baskets' side. */
export const RAMPS = 4;

/** From one ramp's start to the next one's. */
const LEVEL = RUN.drop + 2 * RUN.bend;

/** The run's height, from the first ramp's start to the last one's end. */
const HEIGHT = (RAMPS - 1) * LEVEL + RUN.drop;

/** Where the first ramp starts and the last ends (the marble's middle): as far above the axle as below it. */
export const RUN_TOP = AXLE_Y - HEIGHT / 2;
export const RUN_END = AXLE_Y + HEIGHT / 2;

/** Half the width of the grooved band a ramp is: the marble rolls in its groove, so the run looks the same upside down. */
const BAND = 28;

/**
 * The baskets: where they hang on the board (their pins, the top one and the bottom one, as far from the axle), and
 * how far below its pin the marble lies in one. The top one's marble lies just above the first ramp's start.
 */
export const BASKET = { x: 312, hang: 48, top: RUN_TOP - 8 - 48, bottom: 2 * AXLE_Y - (RUN_TOP - 8 - 48) } as const;

/** Where the marble lies in the top basket and in the bottom one. */
export const REST_TOP = BASKET.top + BASKET.hang;
export const REST_BOTTOM = BASKET.bottom + BASKET.hang;

/** The cups: their rims' middle and their bottom. */
export const CUP = { rim: 648, bottom: 772 } as const;

/** Where the children's cups stand, left to right in the order of their turns: as far apart as the picture allows, clear of the bottom basket. */
export const CUP_XS: Record<TurnCount, readonly number[]> = { 2: [500, 1110], 3: [470, 800, 1130], 4: [450, 706, 962, 1218] };

/** How wide each cup is for that many children. */
export const CUP_W: Record<TurnCount, number> = { 2: 250, 3: 240, 4: 200 };

/** The marble's colour. */
export const MARBLE_COLOR = "#e03131";

/** How the points of a curve are sampled. */
const BEND_STEPS = 10;

/** One point on the marble's way down the run; `bend` lies on a curve. */
export interface WayPoint {
  x: number;
  y: number;
  bend?: boolean;
}

/** The marble's way down the run, from the first ramp's start to the last one's end: the same upside down. */
export function marbleWay(): WayPoint[] {
  const way: WayPoint[] = [{ x: RUN.left, y: RUN_TOP }];
  for (let i = 0; i < RAMPS; i++) {
    const y = RUN_TOP + i * LEVEL;
    const right = i % 2 === 0;
    const end = right ? RUN.right : RUN.left;
    way.push({ x: end, y: y + RUN.drop });
    if (i === RAMPS - 1) break;
    // The curve: half a circle down to the next ramp, bulging outwards.
    const cy = y + RUN.drop + RUN.bend;
    for (let s = 1; s <= BEND_STEPS; s++) {
      const a = -Math.PI / 2 + (s / BEND_STEPS) * Math.PI;
      way.push({ x: end + (right ? 1 : -1) * RUN.bend * Math.cos(a), y: cy + RUN.bend * Math.sin(a), bend: true });
    }
  }
  return way;
}

/** What the marble does in a part of its turn: rides up with the board turning over, tips out of the basket, rolls, falls in. */
export type MarblePhase = "flip" | "tip" | "roll" | "fall";

/** One moment of the marble's turn: where it is, how big (nearer while the board turns), and how far it has turned (degrees, clockwise). */
export interface MarbleFrame {
  at: number;
  x: number;
  y: number;
  scale: number;
  turn: number;
  phase: MarblePhase;
}

/** One moment of a basket: how far its pin has moved from where it hangs at the turn's start, its size and its tilt. */
export interface BasketFrame {
  at: number;
  dx: number;
  dy: number;
  scale: number;
  tilt: number;
}

/** The slowest the marble spins, in radians a second, however long the turn: half a turn. */
const MIN_SPIN = Math.PI;

/** How much nearer (bigger) the basket coming up in front looks halfway, and how much farther the other. */
const DEPTH = 0.14;

/** How the board's turn is sampled. */
const FLIP_STEPS = 12;

/** How far the basket tips to pour the marble onto the first ramp. */
const TIP_DEG = 42;

/** The board's turn over at a moment `p` (0–1) of it: its angle, easing in and out. */
const flipAngle = (p: number) => (Math.PI * (1 - Math.cos(Math.PI * p))) / 2;

/**
 * A whole turn of `ms`: the board turning over at its start (`flip`, the crank winding once), the basket now on top
 * tipping the marble onto the first ramp (`tip`), the marble rolling down at an even pace and falling into the bottom
 * basket as the turn ends (`fall`). Gives the marble's frames, the two baskets' (the one coming up from the bottom with
 * the marble, `riser`, and the empty one going down, `sinker`), the board's tilt, and the moments the marble reaches a
 * curve (a soft knock).
 */
export function marblePlan(ms: number) {
  const flip = Math.min(1800, Math.max(600, ms * 0.12));
  const tip = Math.min(700, Math.max(300, ms * 0.06));
  const fall = Math.min(600, Math.max(250, ms * 0.06));
  const rollMs = ms - flip - tip - fall;
  const frames: MarbleFrame[] = [];
  const riser: BasketFrame[] = [];
  const sinker: BasketFrame[] = [];
  const board: { at: number; scale: number }[] = [];

  // The board turns over: the baskets' pins go round the axle, seen from the front as going up and down, the one
  // coming up nearer, the other farther (and a little aside, so they pass each other).
  for (let k = 0; k <= FLIP_STEPS; k++) {
    const at = (k / FLIP_STEPS) * flip;
    const a = flipAngle(k / FLIP_STEPS);
    const near = 1 + DEPTH * Math.sin(a);
    const far = 1 - DEPTH * Math.sin(a);
    const up = AXLE_Y + (BASKET.bottom - AXLE_Y) * Math.cos(a);
    const down = AXLE_Y + (BASKET.top - AXLE_Y) * Math.cos(a);
    board.push({ at, scale: Math.cos(a) });
    riser.push({ at, dx: 0, dy: up - BASKET.bottom, scale: near, tilt: 0 });
    sinker.push({ at, dx: -26 * Math.sin(a), dy: down - BASKET.top, scale: far, tilt: 0 });
    frames.push({ at, x: BASKET.x, y: up + BASKET.hang * near, scale: near, turn: 0, phase: "flip" });
  }

  // The basket on top tips and pours the marble over its rim onto the first ramp's start, then hangs straight again.
  const lift = BASKET.top - BASKET.bottom;
  riser.push(
    { at: flip + tip * 0.45, dx: 0, dy: lift, scale: 1, tilt: TIP_DEG },
    { at: flip + tip, dx: 0, dy: lift, scale: 1, tilt: 0 },
    { at: ms, dx: 0, dy: lift, scale: 1, tilt: 0 },
  );
  sinker.push({ at: ms, dx: 0, dy: BASKET.bottom - BASKET.top, scale: 1, tilt: 0 });
  board.push({ at: ms, scale: -1 });
  let turn = 0;
  const tipWay = [
    { k: 0.4, x: BASKET.x + 10, y: REST_TOP - 6 },
    { k: 0.7, x: (BASKET.x + RUN.left) / 2 + 8, y: RUN_TOP - 4 },
    { k: 1, x: RUN.left, y: RUN_TOP },
  ];
  let last = frames[frames.length - 1];
  for (const p of tipWay) {
    turn += ((p.x - last.x) / MARBLE_R) * (180 / Math.PI);
    last = { at: flip + tip * p.k, x: p.x, y: p.y, scale: 1, turn, phase: "tip" };
    frames.push(last);
  }

  // Down the run at an even pace, spinning at least half a turn a second however long the turn.
  const way = marbleWay();
  const length = (i: number) => Math.hypot(way[i].x - way[i - 1].x, way[i].y - way[i - 1].y);
  let rolled = 0;
  for (let i = 1; i < way.length; i++) rolled += length(i);
  const bends: number[] = [];
  let at = flip + tip;
  let sign = 1;
  for (let i = 1; i < way.length; i++) {
    const dt = (length(i) / rolled) * rollMs;
    const dx = way[i].x - way[i - 1].x;
    if (Math.abs(dx) > 0.5) sign = dx > 0 ? 1 : -1;
    turn += sign * Math.max(length(i) / MARBLE_R, (dt / 1000) * MIN_SPIN) * (180 / Math.PI);
    if (way[i].bend && !way[i - 1].bend) bends.push(at);
    at += dt;
    frames.push({ at, x: way[i].x, y: way[i].y, scale: 1, turn, phase: "roll" });
  }

  // Off the last ramp's end and down into the bottom basket, on a throw's curve.
  const FALL_STEPS = 6;
  for (let k = 1; k <= FALL_STEPS; k++) {
    const u = k / FALL_STEPS;
    turn -= (((RUN.left - BASKET.x) / FALL_STEPS / MARBLE_R) * 180) / Math.PI;
    frames.push({
      at: k === FALL_STEPS ? ms : at + u * fall,
      x: RUN.left - (RUN.left - BASKET.x) * u,
      y: RUN_END + (REST_BOTTOM - RUN_END) * u * u,
      scale: 1,
      turn,
      phase: "fall",
    });
  }
  return { frames, riser, sinker, board, bends, flip, tip, fall };
}

/** A marble's shine and outline, standing still over its turning swirl. */
function MarbleShine() {
  const r = MARBLE_R;
  return (
    <svg viewBox={`0 0 ${2 * r} ${2 * r}`} className="tm-mr-shine">
      <ellipse cx={r - 7} cy={r - 9} rx="7" ry="5" fill="#fff" opacity="0.85" transform={`rotate(-30 ${r - 7} ${r - 9})`} />
      <circle cx={r} cy={r} r={r - 2} fill="none" stroke={INK} strokeWidth="3" />
    </svg>
  );
}

/** A marble's glass with its coloured swirl, the part that turns as it rolls. */
function MarbleSwirl() {
  const r = MARBLE_R;
  return (
    <svg viewBox={`0 0 ${2 * r} ${2 * r}`}>
      <circle cx={r} cy={r} r={r - 2} fill="#e7f5ff" />
      <path
        d={`M${r - 16} ${r + 4} C${r - 8} ${r - 14} ${r + 6} ${r + 14} ${r + 16} ${r - 6}`}
        fill="none"
        stroke={MARBLE_COLOR}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d={`M${r - 6} ${r - 16} C${r + 2} ${r - 8} ${r - 2} ${r + 6} ${r + 8} ${r + 16}`}
        fill="none"
        stroke={MARBLE_COLOR}
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

/** A basket's box round its pin, in stage units: wide enough for it tipped. */
const BOX = { left: 60, top: 16, w: 120, h: 104 } as const;

/** A basket's layer round its pin at `y`, moved by `animation` (or still), turning round the pin. */
function BasketLayer({ y, animation, className, children }: { y: number; animation?: string; className: string; children: ReactNode }) {
  return (
    <Layer
      x={BASKET.x - BOX.left}
      y={y - BOX.top}
      w={BOX.w}
      h={BOX.h}
      className={`tm-mr-basket ${className}`}
      style={{ animation, transformOrigin: `${(BOX.left / BOX.w) * 100}% ${(BOX.top / BOX.h) * 100}%` }}
    >
      <svg viewBox={`${-BOX.left} ${-BOX.top} ${BOX.w} ${BOX.h}`}>{children}</svg>
    </Layer>
  );
}

/** The basket's size round its pin: the rim's height, half its width there, and its bottom's height and half width. */
const BK = { rim: 28, half: 44, ry: 9, bottom: 74, foot: 34 } as const;

/** A basket's back: its handle hooked on the pin, the far rim and the dark inside. */
function BasketBack() {
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <path d={`M${-BK.half + 6} ${BK.rim} C${-BK.half + 6} -6 ${BK.half - 6} -6 ${BK.half - 6} ${BK.rim}`} fill="none" stroke={INK} strokeWidth="9" />
      <path d={`M${-BK.half + 6} ${BK.rim} C${-BK.half + 6} -6 ${BK.half - 6} -6 ${BK.half - 6} ${BK.rim}`} fill="none" stroke="#c98a45" strokeWidth="4" />
      <ellipse cx="0" cy={BK.rim} rx={BK.half} ry={BK.ry} fill="#e8b46a" stroke={INK} strokeWidth="4" />
      <ellipse cx="0" cy={BK.rim + 2} rx={BK.half - 8} ry={BK.ry - 4} fill="#6b3f17" />
    </g>
  );
}

/** A basket's front over the marble lying in it: woven sides and the near rim. */
function BasketFront() {
  const body = `M${-BK.half} ${BK.rim} L${-BK.foot} ${BK.bottom - 8} Q${-BK.foot} ${BK.bottom} ${-BK.foot + 8} ${BK.bottom} H${BK.foot - 8} Q${BK.foot} ${BK.bottom} ${BK.foot} ${BK.bottom - 8} L${BK.half} ${BK.rim} A${BK.half} ${BK.ry} 0 0 1 ${-BK.half} ${BK.rim} Z`;
  const rows = [BK.rim + 18, BK.rim + 30, BK.rim + 42];
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <path d={body} fill="#d99a4e" stroke={INK} strokeWidth="4" />
      {rows.map((y) => {
        const w = BK.half - ((BK.half - BK.foot) * (y - BK.rim)) / (BK.bottom - BK.rim) - 4;
        return <path key={y} d={`M${-w} ${y} Q0 ${y + 6} ${w} ${y}`} fill="none" stroke="#a8692c" strokeWidth="3" />;
      })}
      {[-22, 0, 22].map((x) => (
        <path key={x} d={`M${x} ${BK.rim + BK.ry + 2} L${x * 0.8} ${BK.bottom - 3}`} stroke="#a8692c" strokeWidth="3" />
      ))}
      <path d={`M${-BK.half} ${BK.rim} A${BK.half} ${BK.ry} 0 0 0 ${BK.half} ${BK.rim}`} fill="none" stroke="#f3c98a" strokeWidth="5" />
    </g>
  );
}

/** The marble on its own layer: its swirl turning inside, its shine still over it. */
function Marble({ x, y, go, spin }: { x: number; y: number; go?: string; spin?: string }) {
  return (
    <Layer x={x - MARBLE_R} y={y - MARBLE_R} w={2 * MARBLE_R} h={2 * MARBLE_R} className="tm-mr-roll" style={{ animation: go }}>
      <div className="tm-mr-spin" style={{ animation: spin }}>
        <MarbleSwirl />
      </div>
      <MarbleShine />
    </Layer>
  );
}

/** The turn going on: its name for its keyframes, when it started on the run's clock and how long it is. */
export interface MarbleTurn {
  name: string;
  startedAt: number;
  ms: number;
}

/**
 * The board, its baskets, the crank and the marble – still (the marble lying in the bottom basket, before the first
 * turn and at the end), or in the turn `turn`: the board turning over as it starts, the marble rolling down the rest of
 * it, all on keyframes written for that turn, started `startedAt` on the run's clock – read once as it comes, so give
 * each turn its own `name` (and key). The marble knocks softly at each curve, unless `quiet` (a card).
 */
function Run({ turn, quiet }: { turn: MarbleTurn | null; quiet?: boolean }) {
  const clock = useRunClock();
  const [delay] = useState(() => (turn ? Math.max(0, clock.now() - turn.startedAt) : 0));
  const plan = useMemo(() => (turn ? marblePlan(turn.ms) : null), [turn]);

  // A soft knock as the marble reaches each curve, on the run's clock: none while paused.
  const { paused, now } = clock;
  useEffect(() => {
    if (quiet || paused || !plan || !turn) return;
    const timers = plan.bends
      .map((at) => turn.startedAt + at - now())
      .filter((wait) => wait > 0)
      .map((wait) => setTimeout(() => playKnock(900), wait));
    return () => {
      for (const timer of timers) clearTimeout(timer);
    };
  }, [quiet, paused, now, plan, turn]);

  if (!plan || !turn) {
    return (
      <>
        <Board />
        <Crank />
        <BasketLayer y={BASKET.top} className="tm-mr-basket-top">
          <BasketBack />
        </BasketLayer>
        <BasketLayer y={BASKET.bottom} className="tm-mr-basket-bottom">
          <BasketBack />
        </BasketLayer>
        <Marble x={BASKET.x} y={REST_BOTTOM} />
        <BasketLayer y={BASKET.top} className="tm-mr-basket-top">
          <BasketFront />
        </BasketLayer>
        <BasketLayer y={BASKET.bottom} className="tm-mr-basket-bottom">
          <BasketFront />
        </BasketLayer>
      </>
    );
  }

  const { name, ms } = turn;
  const pctOf = (v: number, size: number) => ((v / size) * 100).toFixed(2);
  const basket = (f: BasketFrame): Frame => ({
    at: f.at,
    transform: `translate(${pctOf(f.dx, BOX.w)}%, ${pctOf(f.dy, BOX.h)}%) scale(${f.scale.toFixed(3)}) rotate(${f.tilt}deg)`,
    ease: "linear",
  });
  const first = plan.frames[0];
  const go: Frame[] = plan.frames.map((f) => ({
    at: f.at,
    transform: `translate(${pctOf(f.x - first.x, 2 * MARBLE_R)}%, ${pctOf(f.y - first.y, 2 * MARBLE_R)}%) scale(${f.scale.toFixed(3)})`,
    ease: "linear",
  }));
  const spin: Frame[] = plan.frames.map((f) => ({ at: f.at, transform: `rotate(${f.turn.toFixed(1)}deg)`, ease: "linear" }));
  const board: Frame[] = plan.board.map((f) => ({ at: f.at, transform: `scaleY(${f.scale.toFixed(3)})`, ease: "linear" }));
  const crank: Frame[] = [
    { at: 0, transform: "rotate(0deg)" },
    { at: plan.flip, transform: "rotate(360deg)" },
    { at: ms, transform: "rotate(360deg)" },
  ];
  const timing = `${ms}ms linear ${-delay}ms both`;
  const run = (part: string) => `${name}-${part} ${timing}`;
  const styles = [
    keyframes(`${name}-go`, ms, go),
    keyframes(`${name}-spin`, ms, spin),
    keyframes(`${name}-board`, ms, board),
    keyframes(`${name}-crank`, ms, crank),
    keyframes(`${name}-up`, ms, plan.riser.map(basket)),
    keyframes(`${name}-down`, ms, plan.sinker.map(basket)),
  ].join("\n");

  // Front to back: the basket coming up with the marble passes in front of the one going down.
  return (
    <>
      <style>{styles}</style>
      <Board animation={run("board")} />
      <Crank animation={run("crank")} />
      <BasketLayer y={BASKET.top} className="tm-mr-basket-down" animation={run("down")}>
        <BasketBack />
      </BasketLayer>
      <BasketLayer y={BASKET.bottom} className="tm-mr-basket-up" animation={run("up")}>
        <BasketBack />
      </BasketLayer>
      <Marble x={first.x} y={first.y} go={run("go")} spin={run("spin")} />
      <BasketLayer y={BASKET.top} className="tm-mr-basket-down" animation={run("down")}>
        <BasketFront />
      </BasketLayer>
      <BasketLayer y={BASKET.bottom} className="tm-mr-basket-up" animation={run("up")}>
        <BasketFront />
      </BasketLayer>
    </>
  );
}

/** The wooden board the run is fixed on: as far above the axle as below it, so it turns over in its own place. */
export const BOARD = { x: 258, y: AXLE_Y - 216, w: 974, h: 432 } as const;

/** The crank's wheel, right of the board on the axle's bracket. */
export const CRANK = { x: 1286, r: 38 } as const;

/** The grooved band of the run: one path down all its ramps and curves. */
function runPath() {
  const way = marbleWay();
  let d = `M${way[0].x} ${way[0].y}`;
  for (let i = 0; i < RAMPS; i++) {
    const y = RUN_TOP + i * LEVEL;
    const right = i % 2 === 0;
    const end = right ? RUN.right : RUN.left;
    d += ` L${end} ${y + RUN.drop}`;
    if (i < RAMPS - 1) d += ` A${RUN.bend} ${RUN.bend} 0 0 ${right ? 1 : 0} ${end} ${y + RUN.drop + 2 * RUN.bend}`;
  }
  return d;
}

/** The board with its run, the baskets' pins and the axle's hub: one layer turning over round the axle; drawn once. */
const BoardArt = memo(function BoardArt() {
  const d = runPath();
  const { x, y, w, h } = BOARD;
  return (
    <svg viewBox={`${x} ${y} ${w} ${h}`}>
      <rect x={x + 3} y={y + 3} width={w - 6} height={h - 6} rx="22" fill="#f1d7a8" stroke={INK} strokeWidth="6" />
      {[-150, -75, 75, 150].map((k) => (
        <path key={k} d={`M${x + 24} ${AXLE_Y + k} H${x + w - 24}`} stroke="#e2bd85" strokeWidth="4" />
      ))}
      {[
        [x + 24, y + 24],
        [x + w - 24, y + 24],
        [x + 24, y + h - 24],
        [x + w - 24, y + h - 24],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="7" fill="#adb5bd" stroke={INK} strokeWidth="3" />
      ))}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} stroke={INK} strokeWidth={2 * BAND + 8} />
        <path d={d} stroke="#e0a458" strokeWidth={2 * BAND} />
        <path d={d} stroke="#b9773a" strokeWidth={MARBLE_R + 8} />
        <path d={d} stroke="#9c6230" strokeWidth={MARBLE_R - 6} />
      </g>
      {[BASKET.top, BASKET.bottom].map((py) => (
        <g key={py}>
          <circle cx={BASKET.x} cy={py} r="9" fill="#868e96" stroke={INK} strokeWidth="3" />
          <circle cx={BASKET.x - 2} cy={py - 2} r="3" fill="#dee2e6" />
        </g>
      ))}
    </svg>
  );
});

/** The board on its layer, turning over by `animation` (or still). */
function Board({ animation }: { animation?: string }) {
  return (
    <Layer x={BOARD.x} y={BOARD.y} w={BOARD.w} h={BOARD.h} className="tm-mr-board" style={{ animation }}>
      <BoardArt />
    </Layer>
  );
}

/** The crank's wheel and handle: one small layer winding round by `animation` (or still). */
function Crank({ animation }: { animation?: string }) {
  const r = CRANK.r;
  const s = r + 14;
  return (
    <Layer x={CRANK.x - s} y={AXLE_Y - s} w={2 * s} h={2 * s} className="tm-mr-crank" style={{ animation }}>
      <svg viewBox={`${-s} ${-s} ${2 * s} ${2 * s}`}>
        <circle r={r} fill="#e0a458" stroke={INK} strokeWidth="5" />
        <circle r={r - 9} fill="none" stroke="#c98a45" strokeWidth="4" />
        {[0, 60, 120].map((a) => (
          <path key={a} d={`M${-(r - 6)} 0 H${r - 6}`} stroke="#c98a45" strokeWidth="5" transform={`rotate(${a})`} />
        ))}
        <circle r="8" fill="#868e96" stroke={INK} strokeWidth="3" />
        <path d={`M0 0 L0 ${-(r - 4)}`} stroke={INK} strokeWidth="9" strokeLinecap="round" />
        <path d={`M0 0 L0 ${-(r - 4)}`} stroke="#ced4da" strokeWidth="4" strokeLinecap="round" />
        <circle cy={-(r - 4)} r="11" fill="#e03131" stroke={INK} strokeWidth="4" />
        <circle cx="-3" cy={-(r - 4) - 3} r="3" fill="#fff" opacity="0.8" />
      </svg>
    </Layer>
  );
}

/** Each child's cup: its colours, and the colour seen inside it. Fox and bear in the mascots' own colours. */
const CUP_LOOK: Record<TurnChild, { body: string; shade: string; light: string; inside: string; ear: string; earIn: string }> = {
  fox: {
    body: MASCOT_COLORS.fox.fur,
    shade: MASCOT_COLORS.fox.shade,
    light: MASCOT_COLORS.fox.light,
    inside: "#5c2a10",
    ear: MASCOT_COLORS.fox.fur,
    earIn: MASCOT_COLORS.fox.earIn,
  },
  bear: {
    body: MASCOT_COLORS.bear.fur,
    shade: MASCOT_COLORS.bear.shade,
    light: MASCOT_COLORS.bear.light,
    inside: "#3f2312",
    ear: MASCOT_COLORS.bear.fur,
    earIn: MASCOT_COLORS.bear.earIn,
  },
  rabbit: { body: "#4dabf7", shade: "#1c7ed6", light: "#a5d8ff", inside: "#0b3d6b", ear: "#f8f9fa", earIn: "#ffc9de" },
  frog: { body: "#51cf66", shade: "#2f9e44", light: "#b2f2bb", inside: "#14532d", ear: "#51cf66", earIn: "#d3f9d8" },
};

/** A cup's ears (or the frog's bumps), behind its back rim: no face, so it stays a cup and never an animal standing by. */
function CupEars({ kind, x, w }: { kind: TurnChild; x: number; w: number }) {
  const look = CUP_LOOK[kind];
  const top = CUP.rim - w * 0.13;
  return (
    <g strokeLinejoin="round">
      {[-1, 1].map((side) =>
        kind === "fox" ? (
          <g key={side}>
            <path
              d={`M${x + side * w * 0.18} ${top + 8} L${x + side * w * 0.3} ${top - 62} L${x + side * w * 0.42} ${top + 14} Z`}
              fill={look.ear}
              stroke={INK}
              strokeWidth="5"
            />
            <path d={`M${x + side * w * 0.25} ${top + 4} L${x + side * w * 0.3} ${top - 38} L${x + side * w * 0.36} ${top + 6} Z`} fill={look.earIn} />
          </g>
        ) : kind === "bear" ? (
          <g key={side}>
            <circle cx={x + side * w * 0.32} cy={top - 14} r="26" fill={look.ear} stroke={INK} strokeWidth="5" />
            <circle cx={x + side * w * 0.32} cy={top - 14} r="13" fill={look.earIn} />
          </g>
        ) : kind === "rabbit" ? (
          <g key={side} transform={`rotate(${side * 10} ${x + side * w * 0.2} ${top + 10})`}>
            <ellipse cx={x + side * w * 0.2} cy={top - 44} rx="19" ry="56" fill={look.ear} stroke={INK} strokeWidth="5" />
            <ellipse cx={x + side * w * 0.2} cy={top - 40} rx="9" ry="40" fill={look.earIn} />
          </g>
        ) : (
          <g key={side}>
            <circle cx={x + side * w * 0.27} cy={top - 6} r="28" fill={look.ear} stroke={INK} strokeWidth="5" />
            <circle cx={x + side * w * 0.27 - 6} cy={top - 14} r="9" fill={look.earIn} opacity="0.9" />
          </g>
        ),
      )}
    </g>
  );
}

/** A whole cup: its ears, its rim with the dark inside, its body with a pale band round it, a soft shine and the child's photo or name. */
function CupArt({ kind, x, w, player }: { kind: TurnChild; x: number; w: number; player?: PlayerLook }) {
  const look = CUP_LOOK[kind];
  const rx = w / 2;
  const ry = w * 0.13;
  const b = (w * 0.84) / 2;
  const { rim, bottom } = CUP;
  const body = `M${x - rx} ${rim} L${x - b} ${bottom - 26} Q${x - b} ${bottom} ${x - b + 26} ${bottom} H${x + b - 26} Q${x + b} ${bottom} ${x + b} ${bottom - 26} L${x + rx} ${rim} A${rx} ${ry} 0 0 1 ${x - rx} ${rim} Z`;
  const band = rim + (bottom - rim) * 0.55;
  return (
    <g strokeLinejoin="round">
      <CupEars kind={kind} x={x} w={w} />
      <ellipse cx={x} cy={rim} rx={rx} ry={ry} fill={look.light} stroke={INK} strokeWidth="5" />
      <ellipse cx={x} cy={rim + 3} rx={rx - 12} ry={ry - 6} fill={look.inside} />
      <ellipse cx={x} cy={bottom + 4} rx={b + 20} ry="12" fill="#000" opacity="0.16" />
      <path d={body} fill={look.body} stroke={INK} strokeWidth="5" />
      <path d={`M${x - rx * 0.93} ${band - 14} Q${x} ${band + 10} ${x + rx * 0.93} ${band - 14}`} fill="none" stroke="#fff" strokeWidth="14" opacity="0.55" />
      <path d={`M${x + b - 14} ${rim + ry + 12} L${x + b - 24} ${bottom - 22}`} stroke={look.shade} strokeWidth="10" strokeLinecap="round" opacity="0.6" />
      <path d={`M${x - rx + 26} ${rim + ry + 10} L${x - b + 20} ${bottom - 40}`} stroke={look.light} strokeWidth="8" strokeLinecap="round" opacity="0.8" />
      <path
        d={`M${x - rx} ${rim} A${rx} ${ry} 0 0 0 ${x + rx} ${rim}`}
        fill="none"
        stroke={look.light}
        strokeWidth="4"
        transform="translate(0 3)"
        opacity="0.9"
      />
      <PlayerPatch look={player} x={x} y={band - 4} r={w * 0.16} color={look.shade} />
    </g>
  );
}

/** A cup's box on the stage: from above the tallest ears to below its shadow. */
const CUP_TOP = CUP.rim - 140;
const CUP_H = CUP.bottom + 30 - CUP_TOP;

/**
 * One child's place: its glow of light behind it and its cup, each a small layer of its own. `on`, the child whose turn
 * it is: the glow shines warm round the cup; otherwise the cup lies dimmed in the shade.
 */
const Place = memo(function Place({ kind, x, w, on, player }: { kind: TurnChild; x: number; w: number; on: boolean; player?: PlayerLook }) {
  const half = w / 2 + 40;
  return (
    <>
      <Layer x={x - w * 0.95} y={CUP.rim - 250} w={w * 1.9} h={420} className={`tm-mr-glow${on ? " tm-on" : ""}`} />
      <Layer x={x - half} y={CUP_TOP} w={2 * half} h={CUP_H} className={`tm-mr-cup${on ? " tm-on" : ""}`}>
        <svg viewBox={`${x - half} ${CUP_TOP} ${2 * half} ${CUP_H}`}>
          <CupArt kind={kind} x={x} w={w} player={player} />
        </svg>
      </Layer>
    </>
  );
});

/** The playroom's wall and floor with a rug, and the brackets holding the board's axle; drawn once. */
export const MarbleBackdrop = memo(function MarbleBackdrop() {
  const floor = 712;
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-back">
      <svg viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} preserveAspectRatio="none">
        <Bleed>
          <rect width={STAGE_W} height={STAGE_H} fill="#fff4e6" />
          {Array.from({ length: 17 }, (_, i) => (
            <path key={i} d={`M${i * 100 + 50} 0 V${floor}`} stroke="#ffe8cc" strokeWidth="26" />
          ))}
          <rect y={floor} width={STAGE_W} height={STAGE_H - floor} fill="#d9a066" />
          <path d={`M0 ${floor} H${STAGE_W}`} stroke="#a8743f" strokeWidth="6" />
          <ellipse cx="800" cy={CUP.bottom + 6} rx="700" ry="54" fill="#91a7ff" opacity="0.55" />
        </Bleed>
        {/* The brackets on the wall holding the axle at both ends of the board, the crank's on the right. */}
        <g strokeLinejoin="round">
          <rect x={BOARD.x - 30} y={AXLE_Y - 34} width="36" height="68" rx="8" fill="#c98a45" stroke={INK} strokeWidth="5" />
          <circle cx={BOARD.x - 12} cy={AXLE_Y} r="9" fill="#868e96" stroke={INK} strokeWidth="3" />
          <path d={`M${BOARD.x + BOARD.w - 6} ${AXLE_Y} H${CRANK.x}`} stroke={INK} strokeWidth="18" strokeLinecap="round" />
          <path d={`M${BOARD.x + BOARD.w - 6} ${AXLE_Y} H${CRANK.x}`} stroke="#adb5bd" strokeWidth="10" strokeLinecap="round" />
          <rect x={BOARD.x + BOARD.w + 4} y={AXLE_Y - 30} width="22" height="96" rx="7" fill="#c98a45" stroke={INK} strokeWidth="5" />
        </g>
      </svg>
    </Layer>
  );
});

/** The edges of each child's strip of the room: halfway between the cups. */
function strips(count: TurnCount) {
  const xs = CUP_XS[count];
  return xs.map((x, i) => ({ x: i === 0 ? 0 : (xs[i - 1] + x) / 2, right: i === xs.length - 1 ? STAGE_W : (x + xs[i + 1]) / 2 }));
}

const NO_PLAYERS: Players = {};

/**
 * The Kugelbahn on the stage for the children `kids` (two to four, left to right): `lit` says whose place and strip of
 * the room is lit (the child whose turn it is, or everyone at the end), `turn` the turn going on (the board turning
 * over and the marble rolling down; null: still, the marble in the bottom basket), and `poke` counts the taps, each
 * lighting the basket the marble goes to (H-51); `players` the children's photos and names, on their cups' fronts.
 */
export function MarbleScene({
  kids,
  lit,
  turn,
  poke,
  quiet,
  players = NO_PLAYERS,
}: {
  kids: readonly TurnChild[];
  lit: readonly boolean[];
  turn: MarbleTurn | null;
  poke: number;
  quiet?: boolean;
  /** The children's photos and names, on their cups' fronts. */
  players?: Players;
}) {
  const count = kids.length as TurnCount;
  const xs = CUP_XS[count];
  return (
    <>
      <MarbleBackdrop />
      {strips(count).map((s, i) => (
        <Layer key={`l${i}`} x={s.x} y={0} w={s.right - s.x} h={STAGE_H} className={`tm-mr-light${lit[i] ? " tm-on" : ""}`} />
      ))}
      {strips(count).map((s, i) => (
        <Layer key={`s${i}`} x={s.x} y={0} w={s.right - s.x} h={STAGE_H} className={`tm-mr-shade${lit[i] ? "" : " tm-on"}`} />
      ))}
      <Run key={turn?.name ?? "still"} turn={turn} quiet={quiet} />
      {poke > 0 && <Layer key={poke} x={BASKET.x - 130} y={REST_BOTTOM - 130} w={260} h={260} className="tm-mr-goal" />}
      {kids.map((kind, i) => (
        <Place key={kind} kind={kind} x={xs[i]} w={CUP_W[count]} on={lit[i]} player={players[kind]} />
      ))}
    </>
  );
}
