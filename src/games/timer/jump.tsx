import { type CSSProperties, memo, type ReactNode, useMemo } from "react";
import { type Frame, holdToEnd, keyframes } from "./keyframes";
import { INK, LeftGlow, STAGE_H, STAGE_W } from "./scenes";

// Up to the Moon (H-127, rebuilt on user request, 23 November 2026: „nach oben hüpfen, und das Bild scrollt mit“): a
// jump-and-run going up, through a world many screens tall that the picture follows like a camera. A little round
// hopper starts at the bottom of a lake and swims up to the surface, hops ashore over the meadow, climbs a tree's trunk
// and hops through its crown, hops from roof to roof, climbs the ladder up a skyscraper, floats past the clouds on a
// bunch of balloons waiting on its roof and flies on with a jetpack waiting on the highest cloud, from an asteroid to a
// ringed planet up to the moon – each height its own way to move. From the moon it jumps all the way down, the picture
// racing down with it past everything it climbed, into the cake that stood on the meadow by the lake from the start:
// the goal seen from the first second. A star hangs over every move, caught on the way. A genre's look of our own –
// our own figure and world, nothing of one game.

/** The hopper's layer, a square standing with its feet's middle on its spot. */
export const RUNNER = 84;

/** The world's height in stage units: many screens of 900, from the moon at the top to the lake's floor. */
export const WORLD_H = 5400;

/** The lake's surface, and the meadow beside it (a little higher), where the trees and houses stand. */
export const SURFACE = 4740;
export const GROUND = 4720;

/** The meadow reaches from the left to here; the lake lies right of it. */
export const SHORE = 790;

/** How a move goes, one kind for each height: swimming in the lake, hopping, climbing, floating on balloons, flying with the jetpack. */
export type MoveKind = "swim" | "hop" | "climb" | "fly" | "jet";

/** Where the hopper stands, one spot after the other from the lake's floor up to the moon, with how it gets to each. */
export const SPOTS: readonly { x: number; y: number; by?: MoveKind }[] = [
  // In the lake: on its floor, then swimming up to float at the surface.
  { x: 1150, y: 5270 },
  { x: 1000, y: 5100, by: "swim" },
  { x: 1160, y: 4940, by: "swim" },
  { x: 1010, y: 4775, by: "swim" },
  // Out of the water: a stone by the shore, the meadow beside the tree.
  { x: 875, y: 4700, by: "hop" },
  { x: 700, y: GROUND, by: "hop" },
  // Up the tree's trunk, then through its crown: a leafy side, the top.
  { x: 600, y: 4490, by: "climb" },
  { x: 600, y: 4260, by: "climb" },
  { x: 600, y: 3990, by: "climb" },
  { x: 440, y: 3752, by: "hop" },
  { x: 600, y: 3532, by: "hop" },
  // From roof to roof, the houses standing taller one after the other.
  { x: 880, y: 3330, by: "hop" },
  { x: 1080, y: 3110, by: "hop" },
  { x: 1290, y: 2890, by: "hop" },
  // Up the skyscraper's ladder, and onto its roof, where the balloons wait.
  { x: 1215, y: 2660, by: "climb" },
  { x: 1215, y: 2430, by: "climb" },
  { x: 1215, y: 2200, by: "climb" },
  { x: 1060, y: 2050, by: "hop" },
  // On the balloons from cloud to cloud; the jetpack waits on the highest.
  { x: 800, y: 1760, by: "fly" },
  { x: 1060, y: 1500, by: "fly" },
  { x: 770, y: 1250, by: "fly" },
  // With the jetpack: an asteroid, a ringed planet, the moon.
  { x: 1030, y: 990, by: "jet" },
  { x: 690, y: 720, by: "jet" },
  { x: 990, y: 440, by: "jet" },
];

/** How many moves the whole way has: five minutes take all of them, one about every 13 seconds. */
export const MAX_MOVES = SPOTS.length - 1;

/** The fewest moves a run makes: a short time starts further up. */
export const MIN_MOVES = 5;

/** The time a move gets at least: a shorter run starts further up rather than hurrying. */
export const MIN_UNIT = 1500;

/** The jump from the moon into the cake, at most this long: a fifth of a short run. */
export const DIVE_MS = 4500;

/** How long the jump down takes in a run of `total` ms. */
export const diveMs = (total: number) => Math.min(DIVE_MS, total * 0.2);

/** How many moves a run of `ms` makes. */
export function moveCount(ms: number): number {
  return Math.max(MIN_MOVES, Math.min(MAX_MOVES, Math.floor((ms - diveMs(ms)) / MIN_UNIT)));
}

/** How long a move of each kind takes at most: less when the moves come quickly, never more than half its share of the time. */
export const MOVE_MS: Record<MoveKind, number> = { swim: 1800, hop: 750, climb: 1500, fly: 2600, jet: 1700 };

/** How high the hopper's feet go over the higher of its two spots when it hops. */
export const HOP_H = 90;

/** Where in its hop the hopper is at the top of its arc (a share of the hop's time). */
const TOP_AT = 0.45;

/** One move of a run: from which spot (to the next), its kind, when it leaves and lands, how high a hop goes, and when its star is caught. */
export interface RunMove {
  k: number;
  kind: MoveKind;
  start: number;
  land: number;
  peak: number;
  star: number;
}

/** The jump down: it stands on the moon until `leap`, leaps up until `top`, then falls into the cake, landing as the time is up. */
export interface Dive {
  start: number;
  leap: number;
  top: number;
  land: number;
}

/** The cake on the meadow by the lake, the goal: its middle, the top of its upper tier, and its tiers' widths. */
/** The cake is drawn in units of its own (130 high, standing on the meadow) and shown this much bigger, so it is plainly the goal. */
const CAKE_SCALE = 1.4;

export const CAKE = { x: 430, top: GROUND - 130 * CAKE_SCALE, low: 170 * CAKE_SCALE, high: 110 * CAKE_SCALE } as const;

/** The cake's drawing as its own units place it: its top, and its tiers' widths. */
const CAKE_ART = { top: GROUND - 130, low: 170, high: 110 } as const;

/** A box of the cake's drawing (in its own units) placed in the world, grown from the cake's foot by `CAKE_SCALE`. */
const cakeBox = (x: number, y: number, w: number, h: number) => ({
  x: CAKE.x + (x - CAKE.x) * CAKE_SCALE,
  y: GROUND + (y - GROUND) * CAKE_SCALE,
  w: w * CAKE_SCALE,
  h: h * CAKE_SCALE,
});

/** Where the hopper ends: sunk into the cake's top. */
export const FINAL = { x: CAKE.x, y: CAKE.top + 34 * CAKE_SCALE } as const;

/** How high it leaps off the moon before it falls. */
const LEAP = 130;

/**
 * Works out a run of `total` ms making `count` moves: the hopper starts on the spot `count` moves below the moon
 * (`first`), each move has the same share of the climbing time (`unit`) and lands at its end; then it jumps down into
 * the cake, landing as the time is up.
 */
export function jumpPlan(total: number, count: number): { first: number; unit: number; moves: RunMove[]; dive: Dive } {
  const first = MAX_MOVES - count;
  const D = diveMs(total);
  const climb = total - D;
  const unit = climb / count;
  const moves = Array.from({ length: count }, (_, i) => {
    const k = first + i;
    const kind = SPOTS[k + 1].by ?? "hop";
    const ms = Math.min(MOVE_MS[kind], unit * 0.5);
    const land = (i + 1) * unit;
    const start = land - ms;
    const peak = Math.min(SPOTS[k].y, SPOTS[k + 1].y) - HOP_H;
    return { k, kind, start, land, peak, star: start + ms * (kind === "hop" ? TOP_AT : 0.5) };
  });
  return { first, unit, moves, dive: { start: climb, leap: climb + D * 0.25, top: climb + D * 0.4, land: total } };
}

/** The star of a move: where the hopper's body is when it catches it – the top of a hop's arc, else halfway. */
export function starAt(m: Pick<RunMove, "k" | "kind" | "peak">): { x: number; y: number } {
  const from = SPOTS[m.k];
  const to = SPOTS[m.k + 1];
  if (m.kind === "hop") return { x: from.x + (to.x - from.x) * TOP_AT, y: m.peak - RUNNER / 2 };
  return { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 - RUNNER / 2 };
}

/** A star's square layer. */
export const STAR = 52;

/** Where the hopper's feet stand on the screen while the picture follows it (the stage's y); a little below the middle, so the way up shows. */
export const ANCHOR = 600;

/** How far the picture has moved down the world to show feet standing at `y`: they stand at `ANCHOR`, but it never looks past the top or the bottom. */
export const cameraAt = (y: number) => Math.max(0, Math.min(WORLD_H - STAGE_H, y - ANCHOR));

/** A transform moving the hopper from its first spot by `d` stage units, across or up and down, in % of its own size. */
const move = (axis: "X" | "Y", d: number) => `translate${axis}(${((d / RUNNER) * 100).toFixed(2)}%)`;

/** A transform moving the world up so that the stage shows it from `c` down. */
const cam = (c: number) => `translateY(${((-c / WORLD_H) * 100).toFixed(3)}%)`;

/** How the hopper turns: facing right (1) or left (−1), and how far round it spins (degrees). */
const turn = (face: number, spin = 0) => `scaleX(${face}) rotate(${spin}deg)`;

/** The fall's curve, the same for the hopper and the picture following it, so it stays on the screen. */
const FALL = "cubic-bezier(0.4, 0, 0.6, 1)";

/** How the hopper goes up and down in a move of each kind: a hop rising slower and falling faster (as `hop.tsx`), the others gliding. */
const GLIDE: Record<Exclude<MoveKind, "hop" | "climb">, string> = {
  swim: "ease-in-out",
  fly: "ease-in-out",
  jet: "cubic-bezier(0.45, 0, 0.3, 1)",
};

/**
 * The hopper's way and the picture's as lists of keyframes: across, up and down (in arcs, glides or the climb's three
 * pulls), its turn (facing the way it goes, spinning once as it falls), and the camera following it.
 */
export function jumpFrames(first: number, moves: RunMove[], dive: Dive): { across: Frame[]; upDown: Frame[]; turning: Frame[]; camera: Frame[] } {
  const origin = SPOTS[first];
  const across: Frame[] = [{ at: 0, transform: move("X", 0) }];
  const upDown: Frame[] = [{ at: 0, transform: move("Y", 0) }];
  let face = 1;
  const turning: Frame[] = [{ at: 0, transform: turn(face) }];
  const camera: Frame[] = [{ at: 0, transform: cam(cameraAt(origin.y)) }];
  const faceTo = (at: number, to: number, within: number) => {
    if (to === face) return;
    turning.push({ at, transform: turn(face) }, { at: at + Math.min(150, within / 3), transform: turn(to) });
    face = to;
  };
  for (const m of moves) {
    const from = SPOTS[m.k];
    const to = SPOTS[m.k + 1];
    const ms = m.land - m.start;
    // It faces the way it goes; climbing straight up it keeps facing as it was.
    if (Math.abs(to.x - from.x) > 30) faceTo(m.start, Math.sign(to.x - from.x), ms);
    across.push(
      { at: m.start, transform: move("X", from.x - origin.x), ease: m.kind === "hop" ? "linear" : "ease-in-out" },
      { at: m.land, transform: move("X", to.x - origin.x) },
    );
    if (m.kind === "hop")
      upDown.push(
        { at: m.start, transform: move("Y", from.y - origin.y), ease: "cubic-bezier(0.2, 0.7, 0.4, 1)" },
        { at: m.start + ms * TOP_AT, transform: move("Y", m.peak - origin.y), ease: "cubic-bezier(0.6, 0, 0.8, 0.4)" },
        { at: m.land, transform: move("Y", to.y - origin.y) },
      );
    else if (m.kind === "climb")
      // Three pulls up, each quick at first and slowing as the paws take hold.
      for (let j = 0; j <= 3; j++)
        upDown.push({ at: m.start + (ms * j) / 3, transform: move("Y", from.y + ((to.y - from.y) * j) / 3 - origin.y), ease: "cubic-bezier(0.3, 0, 0.2, 1)" });
    else upDown.push({ at: m.start, transform: move("Y", from.y - origin.y), ease: GLIDE[m.kind] }, { at: m.land, transform: move("Y", to.y - origin.y) });
    camera.push({ at: m.start, transform: cam(cameraAt(from.y)), ease: "ease-in-out" }, { at: m.land, transform: cam(cameraAt(to.y)) });
  }
  // The jump down: a leap up off the moon, turning towards the cake, then the fall, spinning once, the picture with it.
  const moon = SPOTS[MAX_MOVES];
  const leapX = moon.x + Math.sign(FINAL.x - moon.x) * 40;
  faceTo(dive.leap, Math.sign(FINAL.x - moon.x), dive.top - dive.leap);
  across.push(
    { at: dive.leap, transform: move("X", moon.x - origin.x), ease: "ease-out" },
    { at: dive.top, transform: move("X", leapX - origin.x), ease: FALL },
    { at: dive.land, transform: move("X", FINAL.x - origin.x) },
  );
  upDown.push(
    { at: dive.leap, transform: move("Y", moon.y - origin.y), ease: "cubic-bezier(0.2, 0.7, 0.4, 1)" },
    { at: dive.top, transform: move("Y", moon.y - LEAP - origin.y), ease: FALL },
    { at: dive.land, transform: move("Y", FINAL.y - origin.y) },
  );
  turning.push({ at: dive.top, transform: turn(face), ease: FALL }, { at: dive.land, transform: turn(face, 360) });
  camera.push({ at: dive.top, transform: cam(cameraAt(moon.y)), ease: FALL }, { at: dive.land, transform: cam(cameraAt(FINAL.y)) });
  return { across, upDown, turning, camera };
}

/** One keyframe of a thing coming or going: when, and its look then (any CSS), and how it goes on to the next. */
type Look = { at: number; css: string; ease?: string };

/** A `@keyframes` rule for a run of `total` ms from looks in time order, the last held to the end (a rule without a 100% frame goes back to the element's own look). */
function looks(name: string, total: number, given: Look[]): string {
  const last = given.at(-1);
  const frames = last && last.at < total ? [...given, { at: total, css: last.css }] : given;
  const percent = (ms: number) => ((Math.max(0, Math.min(ms, total)) / total) * 100).toFixed(3);
  return `@keyframes ${name} {${frames.map((f) => `${percent(f.at)}% { ${f.css}; animation-timing-function: ${f.ease ?? "linear"}; }`).join(" ")}}`;
}

/** How long a thing taken or put down takes to come or go. */
const FADE = 250;

/**
 * When a thing is shown in a run starting on spot `first`: from the start of move `from` until the start of move
 * `until` (−1: from before the run, `MAX_MOVES`: to its end). A thing whose moment came before the run is already as
 * it is after it. Every frame names every property it changes (`shown`, `gone`): a property left out of a keyframe is
 * not held there but passed over, so the balloons once stayed lifted while they were held.
 */
export function shownFrames(first: number, moves: RunMove[], from: number, until: number, gone = "opacity: 0", shown = "opacity: 1"): Look[] {
  const startOf = (k: number) => moves.find((m) => m.k === k)?.start;
  const on = from < first && until >= first;
  const frames: Look[] = [{ at: 0, css: on ? shown : gone }];
  const came = from >= first ? startOf(from) : undefined;
  if (came !== undefined) frames.push({ at: came, css: gone }, { at: came + FADE, css: shown });
  const went = until < MAX_MOVES && until >= first ? startOf(until) : undefined;
  if (went !== undefined) frames.push({ at: went, css: shown, ease: "ease-in" }, { at: went + FADE * 4, css: gone });
  return frames;
}

/** The moves that take the hopper out of the lake, onto the balloons and onto the jetpack. */
const OUT_OF_WATER = 3;
const BALLOONS_FROM = 17;
const JETPACK_FROM = 20;

/** What the hopper carries and what waits for it, each its own layer coming and going by keyframes written for the run. */
const GEAR = ["mask", "balloons", "jetpack", "flame", "waiting-balloons", "waiting-jetpack"] as const;
type Gear = (typeof GEAR)[number];

/** Each thing's keyframes for a run starting on spot `first`, and how it is left at the end (shown or not). */
export function gearLooks(first: number, moves: RunMove[]): Record<Gear, { frames: Look[]; end: number }> {
  const flame: Look[] = [{ at: 0, css: "opacity: 0" }];
  for (const m of moves)
    if (m.kind === "jet")
      flame.push(
        { at: m.start, css: "opacity: 0" },
        { at: m.start + FADE, css: "opacity: 1" },
        { at: m.land - FADE, css: "opacity: 1" },
        { at: m.land, css: "opacity: 0" },
      );
  return {
    // A diving mask in the lake, taken off as it hops ashore.
    mask: { frames: shownFrames(first, moves, -1, OUT_OF_WATER), end: 0 },
    // The balloons from the skyscraper's roof to the highest cloud, let go there: they float up and away.
    balloons: {
      frames: shownFrames(first, moves, BALLOONS_FROM, JETPACK_FROM, "opacity: 0; transform: translateY(-60%)", "opacity: 1; transform: none"),
      end: 0,
    },
    jetpack: { frames: shownFrames(first, moves, JETPACK_FROM, MAX_MOVES), end: 1 },
    flame: { frames: flame, end: 0 },
    "waiting-balloons": { frames: shownFrames(first, moves, -1, BALLOONS_FROM), end: 0 },
    "waiting-jetpack": { frames: shownFrames(first, moves, -1, JETPACK_FROM), end: 0 },
  };
}

/** The ways of the hopper, the picture and the things it takes along, as keyframes made for this run. */
function JumpKeyframes({ total, first, moves, dive }: { total: number; first: number; moves: RunMove[]; dive: Dive }) {
  const { across, upDown, turning, camera } = jumpFrames(first, moves, dive);
  const gear = gearLooks(first, moves);
  const rules = [
    keyframes("tm-jump-x", total, holdToEnd(across, total)),
    keyframes("tm-jump-y", total, holdToEnd(upDown, total)),
    keyframes("tm-jump-turn", total, holdToEnd(turning, total)),
    keyframes("tm-jump-cam", total, holdToEnd(camera, total)),
    ...GEAR.map((g) => looks(`tm-jump-${g}`, total, gear[g].frames)),
  ];
  return <style>{rules.join("\n")}</style>;
}

/** A piece of the world as an HTML layer of its own, placed in stage units within the world's height (as `Layer` is on the stage). */
function At({
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
  children?: ReactNode;
}) {
  return (
    <div
      className={`tm-layer${className ? ` ${className}` : ""}`}
      style={{ left: `${(x / STAGE_W) * 100}%`, top: `${(y / WORLD_H) * 100}%`, width: `${(w / STAGE_W) * 100}%`, height: `${(h / WORLD_H) * 100}%`, ...style }}
      aria-hidden
    >
      {children}
    </div>
  );
}

/** An SVG of a band of the world from `top`, `h` high, drawn in the world's own units. */
function Band({ top, h, className, children }: { top: number; h: number; className?: string; children: ReactNode }) {
  return (
    <At x={0} y={top} w={STAGE_W} h={h} className={className}>
      <svg viewBox={`0 ${top} ${STAGE_W} ${h}`} preserveAspectRatio="none">
        {children}
      </svg>
    </At>
  );
}

/** The sky from the night of space at the top through deep blue to the pale morning over the lake, one gradient behind the whole world. */
const SKY = `linear-gradient(to bottom, #141838 0%, #1f2463 ${((600 / WORLD_H) * 100).toFixed(1)}%, #364fc7 ${((1300 / WORLD_H) * 100).toFixed(1)}%, #5c9ded ${((1900 / WORLD_H) * 100).toFixed(1)}%, #8ccbfd ${((2700 / WORLD_H) * 100).toFixed(1)}%, #e7f5ff ${((SURFACE / WORLD_H) * 100).toFixed(1)}%)`;

/** Grass and earth. */
const GRASS = "#6cc04a";
const GRASS_LIGHT = "#94d82d";
const EARTH = "#b9783f";
const EARTH_DARK = "#9c6230";

/** The little stars of space, still: x, y and size. */
const SPACE_STARS: readonly [number, number, number][] = [
  [260, 60, 5],
  [470, 150, 4],
  [700, 80, 6],
  [1210, 120, 5],
  [1360, 260, 4],
  [330, 330, 6],
  [560, 420, 4],
  [1260, 470, 6],
  [270, 600, 4],
  [470, 760, 5],
  [1310, 700, 4],
  [880, 260, 4],
  [1190, 860, 5],
  [380, 930, 4],
  [560, 1040, 3],
  [1340, 1050, 3],
];

/** The asteroid, the ringed planet and the moon in space, each standing under its spot. */
const ASTEROID = { x: SPOTS[21].x, top: SPOTS[21].y } as const;
export const PLANET = { cx: SPOTS[22].x, r: 100, cy: SPOTS[22].y + 100 } as const;
export const MOON = { cx: SPOTS[23].x, r: 130, cy: SPOTS[23].y + 130 } as const;

/** Space: little stars, the asteroid, the ringed planet and the moon at the top. Drawn once. */
const Space = memo(function Space() {
  return (
    <Band top={0} h={1150} className="tm-back">
      {SPACE_STARS.map(([x, y, r]) => (
        <path
          key={`${x},${y}`}
          d={`M${x} ${y - r * 2} Q${x} ${y} ${x + r * 2} ${y} Q${x} ${y} ${x} ${y + r * 2} Q${x} ${y} ${x - r * 2} ${y} Q${x} ${y} ${x} ${y - r * 2} Z`}
          fill="#fff3bf"
        />
      ))}
      {/* The moon, pale and round, with soft craters. */}
      <circle cx={MOON.cx} cy={MOON.cy} r={MOON.r + 26} fill="#fff9db" opacity="0.18" />
      <circle cx={MOON.cx} cy={MOON.cy} r={MOON.r} fill="#fff3bf" stroke={INK} strokeWidth="5" />
      {[
        [-50, 20, 26],
        [40, 50, 18],
        [30, -40, 14],
        [-20, 80, 12],
      ].map(([dx, dy, r]) => (
        <circle key={`${dx},${dy}`} cx={MOON.cx + dx} cy={MOON.cy + dy} r={r} fill="#ffe8a1" stroke="#f0c76b" strokeWidth="3" />
      ))}
      {/* The ringed planet: its ring's far half behind it, the near half in front. */}
      <ellipse cx={PLANET.cx} cy={PLANET.cy} rx={PLANET.r * 1.7} ry={PLANET.r * 0.36} fill="none" stroke="#ffc078" strokeWidth="14" />
      <circle cx={PLANET.cx} cy={PLANET.cy} r={PLANET.r} fill="#ff922b" stroke={INK} strokeWidth="5" />
      <path
        d={`M${PLANET.cx - 92} ${PLANET.cy - 30} Q${PLANET.cx} ${PLANET.cy - 48} ${PLANET.cx + 92} ${PLANET.cy - 30}`}
        fill="none"
        stroke="#ffc078"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d={`M${PLANET.cx - 96} ${PLANET.cy + 20} Q${PLANET.cx} ${PLANET.cy + 2} ${PLANET.cx + 96} ${PLANET.cy + 20}`}
        fill="none"
        stroke="#e8590c"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d={`M${PLANET.cx - PLANET.r * 1.7} ${PLANET.cy} A${PLANET.r * 1.7} ${PLANET.r * 0.36} 0 0 0 ${PLANET.cx + PLANET.r * 1.7} ${PLANET.cy}`}
        fill="none"
        stroke="#ffc078"
        strokeWidth="14"
      />
      {/* The asteroid, a grey rock with a flat top and craters. */}
      <path
        d={`M${ASTEROID.x - 80} ${ASTEROID.top + 8} Q${ASTEROID.x - 70} ${ASTEROID.top} ${ASTEROID.x - 40} ${ASTEROID.top} H${ASTEROID.x + 50} Q${ASTEROID.x + 84} ${ASTEROID.top + 2} ${ASTEROID.x + 86} ${ASTEROID.top + 30} Q${ASTEROID.x + 70} ${ASTEROID.top + 96} ${ASTEROID.x} ${ASTEROID.top + 100} Q${ASTEROID.x - 76} ${ASTEROID.top + 90} ${ASTEROID.x - 80} ${ASTEROID.top + 8} Z`}
        fill="#adb5bd"
        stroke={INK}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <circle cx={ASTEROID.x - 26} cy={ASTEROID.top + 44} r="14" fill="#868e96" />
      <circle cx={ASTEROID.x + 34} cy={ASTEROID.top + 60} r="10" fill="#868e96" />
    </Band>
  );
});

/** A fluffy cloud with its flat top at `top`, `w` wide. */
function Cloud({ x, top, w, soft }: { x: number; top: number; w: number; soft?: boolean }) {
  const h = w * 0.42;
  return (
    <path
      d={`M${x - w / 2} ${top + h * 0.7} Q${x - w / 2 - 10} ${top + h * 0.25} ${x - w * 0.3} ${top + h * 0.2} Q${x - w * 0.22} ${top - h * 0.12} ${x} ${top} Q${x + w * 0.22} ${top - h * 0.12} ${x + w * 0.3} ${top + h * 0.2} Q${x + w / 2 + 10} ${top + h * 0.25} ${x + w / 2} ${top + h * 0.7} Q${x + w * 0.3} ${top + h + 8} ${x} ${top + h * 0.95} Q${x - w * 0.3} ${top + h + 8} ${x - w / 2} ${top + h * 0.7} Z`}
      fill="#fff"
      stroke={soft ? "none" : "#a5d8ff"}
      strokeWidth="5"
      opacity={soft ? 0.55 : 1}
    />
  );
}

/** The clouds: the three to stand on and two soft ones far off. Drawn once. */
const Clouds = memo(function Clouds() {
  return (
    <Band top={1100} h={800} className="tm-back">
      <Cloud x={360} top={1420} w={200} soft />
      <Cloud x={1330} top={1660} w={180} soft />
      {[18, 19, 20].map((k) => (
        <Cloud key={k} x={SPOTS[k].x + 20} top={SPOTS[k].y - 6} w={250} />
      ))}
    </Band>
  );
});

/** The main skyscraper with the ladder on its right side, the houses in front of its foot, and a second skyscraper behind the tree. */
export const SKYSCRAPER = { x: 900, w: 290, top: SPOTS[17].y } as const;
const SKYSCRAPER_BACK = { x: 250, w: 250, top: 2350 } as const;
export const LADDER = { x: SPOTS[14].x, top: SKYSCRAPER.top - 10, bottom: 2780 } as const;
export const HOUSES: readonly { x: number; w: number; ridge: number; wall: string; roof: string }[] = [
  { x: 790, w: 180, ridge: SPOTS[11].y, wall: "#ffd8a8", roof: "#e8590c" },
  { x: 985, w: 190, ridge: SPOTS[12].y, wall: "#d0bfff", roof: "#5f3dc4" },
  { x: 1200, w: 180, ridge: SPOTS[13].y, wall: "#c3fae8", roof: "#0b7285" },
];

/** A tall building's front from `top` down to the lake's far shore, with rows of windows. */
function Tower({ x, w, top, cols, wall, glass }: { x: number; w: number; top: number; cols: number; wall: string; glass: string }) {
  const rows = Math.floor((SURFACE - top - 70) / 80);
  const cell = (w - 30) / cols;
  return (
    <g>
      <rect x={x} y={top} width={w} height={SURFACE - top + 20} fill={wall} stroke={INK} strokeWidth="5" />
      <rect x={x - 8} y={top - 14} width={w + 16} height="20" rx="4" fill="#868e96" stroke={INK} strokeWidth="4" />
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => (
          <rect key={`${r},${c}`} x={x + 15 + c * cell + 6} y={top + 40 + r * 80} width={cell - 12} height="46" rx="4" fill={glass} />
        )),
      )}
    </g>
  );
}

/** A house from its gabled roof down to the lake's far shore: windows floor by floor, a door at the bottom. */
function House({ x, w, ridge, wall, roof }: (typeof HOUSES)[number]) {
  const eaves = ridge + 100;
  const floors = Math.floor((SURFACE - eaves - 120) / 200);
  return (
    <g>
      <rect x={x} y={eaves} width={w} height={SURFACE - eaves + 20} fill={wall} stroke={INK} strokeWidth="5" />
      {Array.from({ length: floors }, (_, f) =>
        [0.28, 0.72].map((s) => (
          <g key={`${f},${s}`}>
            <rect x={x + w * s - 26} y={eaves + 50 + f * 200} width="52" height="64" rx="6" fill="#fff3bf" stroke={INK} strokeWidth="4" />
            <path d={`M${x + w * s} ${eaves + 52 + f * 200} V${eaves + 112 + f * 200}`} stroke={INK} strokeWidth="3" />
          </g>
        )),
      )}
      <rect x={x + w / 2 - 28} y={SURFACE - 100} width="56" height="100" rx="8" fill="#8a5a2b" stroke={INK} strokeWidth="4" />
      <path
        d={`M${x - 14} ${eaves + 6} L${x + w / 2} ${ridge} L${x + w + 14} ${eaves + 6} Z`}
        fill={roof}
        stroke={INK}
        strokeWidth="5"
        strokeLinejoin="round"
      />
    </g>
  );
}

/** The tree on the meadow: its trunk to climb and its crown of three leafy blobs, the hopper's spots on their tops. */
export const TREE = { x: SPOTS[6].x, foot: GROUND, crown: SPOTS[10].y } as const;
const CROWN: readonly { cx: number; cy: number; r: number }[] = [
  { cx: SPOTS[9].x, cy: SPOTS[9].y + 128, r: 130 },
  { cx: 770, cy: 3880, r: 120 },
  { cx: SPOTS[10].x, cy: SPOTS[10].y + 188, r: 190 },
];

/**
 * The land: two skyscrapers and three houses on the lake's far shore, the ladder up the big one, the tree on the
 * meadow, the meadow with its earth, the stone by the shore and the lake with its floor, seaweed and fish. Drawn once.
 */
const Land = memo(function Land() {
  const top = 1900;
  return (
    <Band top={top} h={WORLD_H - top} className="tm-back">
      <Tower x={SKYSCRAPER_BACK.x} w={SKYSCRAPER_BACK.w} top={SKYSCRAPER_BACK.top} cols={3} wall="#b6c2d6" glass="#dbe4ff" />
      <Tower x={SKYSCRAPER.x} w={SKYSCRAPER.w} top={SKYSCRAPER.top} cols={4} wall="#91a7ff" glass="#e7f5ff" />
      {/* The ladder up the skyscraper's right side, from the last house's roof to the top. */}
      <g stroke={INK} strokeWidth="5" strokeLinecap="round">
        <path d={`M${LADDER.x - 26} ${LADDER.top} V${LADDER.bottom} M${LADDER.x + 26} ${LADDER.top} V${LADDER.bottom}`} />
        {Array.from({ length: Math.floor((LADDER.bottom - LADDER.top) / 46) }, (_, i) => (
          <path key={i} d={`M${LADDER.x - 26} ${LADDER.top + 30 + i * 46} H${LADDER.x + 26}`} stroke="#e03131" />
        ))}
      </g>
      {HOUSES.map((h) => (
        <House key={h.x} {...h} />
      ))}
      {/* The tree: its trunk with a branch, and its crown. */}
      <path
        d={`M${TREE.x - 34} ${GROUND + 6} Q${TREE.x - 28} ${TREE.crown + 500} ${TREE.x - 24} ${TREE.crown + 300} H${TREE.x + 24} Q${TREE.x + 28} ${TREE.crown + 500} ${TREE.x + 34} ${GROUND + 6} Z`}
        fill="#8a5a2b"
        stroke={INK}
        strokeWidth="5"
      />
      {[4380, 4140].map((y, i) => (
        <path
          key={y}
          d={`M${TREE.x - 12} ${y + 14} Q${TREE.x - 2} ${y} ${TREE.x + 10} ${y + 30 + i * 10}`}
          fill="none"
          stroke="#6b4423"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}
      {CROWN.map((c) => (
        <circle key={c.cx} cx={c.cx} cy={c.cy} r={c.r} fill="#51cf66" stroke={INK} strokeWidth="5" />
      ))}
      {CROWN.map((c) => (
        <path
          key={c.cx}
          d={`M${c.cx - c.r * 0.55} ${c.cy - c.r * 0.45} Q${c.cx - c.r * 0.2} ${c.cy - c.r * 0.8} ${c.cx + c.r * 0.2} ${c.cy - c.r * 0.7}`}
          fill="none"
          stroke="#8ce99a"
          strokeWidth="8"
          strokeLinecap="round"
        />
      ))}
      {[
        [520, 3800],
        [690, 3700],
        [610, 3900],
        [780, 3850],
      ].map(([x, y]) => (
        <circle key={`${x},${y}`} cx={x} cy={y} r="11" fill="#2f9e44" />
      ))}
      {/* The lake from the far shore down to its sandy floor, with soft waves on top. */}
      <rect x={0} y={SURFACE} width={STAGE_W} height={WORLD_H - SURFACE} fill="#4dabf7" />
      <rect x={0} y={SURFACE - 4} width={STAGE_W} height="14" fill="#a5d8ff" />
      <path d={`M${SHORE + 60} ${WORLD_H} Q${SHORE + 260} ${5290} ${1600} ${5300} V${WORLD_H} Z`} fill="#ffe8a1" stroke="#e0b860" strokeWidth="5" />
      {[
        [1350, 5300, 1],
        [1420, 5290, -1],
        [960, 5340, 1],
      ].map(([x, y, s]) => (
        <path key={x} d={`M${x} ${y} q${14 * s} -50 0 -100 q${-14 * s} -50 0 -100`} fill="none" stroke="#2f9e44" strokeWidth="9" strokeLinecap="round" />
      ))}
      {/* Two little fish and a starfish on the floor. */}
      {[
        [1300, 5060, -1, "#ffd43b"],
        [880, 4920, 1, "#ff8787"],
      ].map(([x, y, s, c]) => (
        <g key={x as number} transform={`translate(${x} ${y}) scale(${s} 1)`}>
          <path d="M-30 0 Q0 -24 30 0 Q0 24 -30 0 Z M-30 0 L-48 -14 V14 Z" fill={c as string} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <circle cx="16" cy="-4" r="4" fill={INK} />
        </g>
      ))}
      <path d="M1250 5262 l9 18 20 2 -15 13 5 20 -19 -10 -19 10 5 -20 -15 -13 20 -2 Z" fill="#ff922b" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {[
        [1080, 4990, 8],
        [1100, 4890, 6],
        [1180, 5150, 7],
      ].map(([x, y, r]) => (
        <circle key={`${x},${y}`} cx={x} cy={y} r={r} fill="none" stroke="#d0ebff" strokeWidth="3" />
      ))}
      {/* The meadow and the earth under it, its bank sloping down into the lake. */}
      <path d={`M-30 ${GROUND} H${SHORE} Q${SHORE + 40} ${GROUND + 160} ${SHORE + 80} ${WORLD_H + 10} H-30 Z`} fill={EARTH} stroke={INK} strokeWidth="5" />
      {[
        [120, 4880],
        [420, 4960],
        [260, 5160],
        [600, 5100],
        [520, 5300],
      ].map(([x, y]) => (
        <ellipse key={`${x},${y}`} cx={x} cy={y} rx="16" ry="10" fill={EARTH_DARK} />
      ))}
      {/* The tree's roots reaching down into the earth, and a few stones in it. */}
      <g fill="none" stroke="#7a4a22" strokeWidth="12" strokeLinecap="round">
        <path d={`M${TREE.x - 20} ${GROUND + 10} Q${TREE.x - 90} ${GROUND + 120} ${TREE.x - 200} ${GROUND + 170}`} />
        <path d={`M${TREE.x} ${GROUND + 10} Q${TREE.x + 10} ${GROUND + 160} ${TREE.x - 30} ${GROUND + 280}`} />
        <path d={`M${TREE.x + 20} ${GROUND + 10} Q${TREE.x + 80} ${GROUND + 90} ${TREE.x + 140} ${GROUND + 120}`} />
      </g>
      {[
        [300, 5020, 34, 22],
        [140, 5240, 44, 28],
        [660, 5320, 30, 20],
      ].map(([x, y, rx, ry]) => (
        <ellipse key={x} cx={x} cy={y} rx={rx} ry={ry} fill="#ced4da" stroke={INK} strokeWidth="4" />
      ))}
      <path d={`M-30 ${GROUND - 10} H${SHORE + 6} Q${SHORE + 14} ${GROUND + 4} ${SHORE + 6} ${GROUND + 26} H-30 Z`} fill={GRASS} stroke={INK} strokeWidth="5" />
      <rect x="0" y={GROUND - 4} width={SHORE - 10} height="6" fill={GRASS_LIGHT} />
      {/* The stone by the shore. */}
      <ellipse cx={SPOTS[4].x} cy={SPOTS[4].y + 40} rx="52" ry="42" fill="#adb5bd" stroke={INK} strokeWidth="5" />
      <path
        d={`M${SPOTS[4].x - 26} ${SPOTS[4].y + 20} Q${SPOTS[4].x - 8} ${SPOTS[4].y + 8} ${SPOTS[4].x + 12} ${SPOTS[4].y + 12}`}
        fill="none"
        stroke="#e9ecef"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Flowers on the meadow. */}
      {[
        [130, "#ff8787"],
        [250, "#ffd43b"],
        [760, "#f783ac"],
      ].map(([x, c]) => (
        <g key={x as number}>
          <path d={`M${x} ${GROUND} V${GROUND - 26}`} stroke="#2f9e44" strokeWidth="4" />
          <circle cx={x as number} cy={GROUND - 30} r="10" fill={c as string} stroke={INK} strokeWidth="3" />
        </g>
      ))}
    </Band>
  );
});

/** The lake's water in front of the hopper while it swims, a pale tint, so it is plainly under water. Drawn once. */
const WaterFront = memo(function WaterFront() {
  return <At x={SHORE + 40} y={SURFACE + 6} w={STAGE_W - SHORE - 40} h={WORLD_H - SURFACE - 6} className="tm-jump-water" />;
});

/** The cake on the meadow, the goal from the start: two tiers with pink icing, cream and a cherry; drawn once. */
function CakeArt({ front }: { front?: boolean }) {
  const { top, low, high } = CAKE_ART;
  const x = CAKE.x;
  const mid = top + 54;
  return (
    <svg viewBox={`${x - 110} ${top - 40} 220 ${GROUND - top + 50}`} preserveAspectRatio="none">
      {!front && (
        <>
          <ellipse cx={x} cy={GROUND - 2} rx={low / 2 + 24} ry="12" fill="#e9ecef" stroke={INK} strokeWidth="4" />
          <rect x={x - low / 2} y={mid} width={low} height={GROUND - 6 - mid} rx="10" fill="#ffe3e3" stroke={INK} strokeWidth="5" />
          <path
            d={`M${x - low / 2} ${mid + 8} H${x + low / 2} V${mid + 24} Q${x + 60} ${mid + 44} ${x + 44} ${mid + 24} Q${x + 20} ${mid + 50} ${x} ${mid + 24} Q${x - 24} ${mid + 46} ${x - 44} ${mid + 24} Q${x - 64} ${mid + 42} ${x - low / 2} ${mid + 24} Z`}
            fill="#f783ac"
          />
          <rect x={x - high / 2} y={top} width={high} height={mid - top + 6} rx="10" fill="#fff0f6" stroke={INK} strokeWidth="5" />
        </>
      )}
      {/* The upper tier's icing, lying over the hopper's feet once it has landed in the cake. */}
      <path
        d={`M${x - high / 2 - 4} ${top + 18} H${x + high / 2 + 4} V${top + 30} Q${x + 36} ${top + 50} ${x + 26} ${top + 30} Q${x + 10} ${top + 48} ${x - 4} ${top + 30} Q${x - 20} ${top + 46} ${x - 30} ${top + 30} Q${x - 44} ${top + 44} ${x - high / 2 - 4} ${top + 30} Z`}
        fill="#f783ac"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {!front &&
        [-36, 0, 36].map((dx) => (
          <path key={dx} d={`M${x + dx - 12} ${top + 4} Q${x + dx} ${top - 22} ${x + dx + 12} ${top + 4} Z`} fill="#fff" stroke={INK} strokeWidth="3" />
        ))}
    </svg>
  );
}

/** The cake's layers: its body behind the hopper, the upper icing in front of it, the cherry (gone once it is landed on) and the cream splashing at the end. */
const CAKE_BOX = cakeBox(CAKE.x - 110, CAKE_ART.top - 40, 220, GROUND - CAKE_ART.top + 50);

const Cake = memo(function Cake() {
  return (
    <>
      <At {...CAKE_BOX}>
        <CakeArt />
      </At>
      <At {...cakeBox(CAKE.x - 16, CAKE_ART.top - 40, 32, 34)} className="tm-jump-cherry">
        <svg viewBox="0 0 32 34">
          <path d="M16 18 Q18 6 26 2" fill="none" stroke="#2f9e44" strokeWidth="3" strokeLinecap="round" />
          <circle cx="15" cy="22" r="11" fill="#e03131" stroke={INK} strokeWidth="3" />
          <circle cx="11" cy="18" r="3" fill="#ffc9c9" />
        </svg>
      </At>
    </>
  );
});

const CakeFront = memo(function CakeFront() {
  return (
    <>
      <At {...CAKE_BOX}>
        <CakeArt front />
      </At>
      <At {...cakeBox(CAKE.x - 130, CAKE_ART.top - 70, 260, 110)} className="tm-jump-splash">
        <svg viewBox="0 0 260 110">
          {[
            [30, 70, 16],
            [62, 36, 12],
            [104, 18, 10],
            [160, 22, 11],
            [204, 40, 13],
            [232, 74, 15],
          ].map(([x, y, r]) => (
            <circle key={x} cx={x} cy={y} r={r} fill="#fff" stroke={INK} strokeWidth="3" />
          ))}
          <circle cx="128" cy="8" r="9" fill="#e03131" stroke={INK} strokeWidth="3" />
        </svg>
      </At>
    </>
  );
});

/** The balloons waiting tied to a post on the skyscraper's roof, and the jetpack waiting on the highest cloud, until the hopper takes them. */
const BALLOON_POST = { x: SPOTS[17].x + 70, y: SPOTS[17].y } as const;
const JETPACK_WAITS = { x: SPOTS[20].x + 90, y: SPOTS[20].y } as const;

/** Three balloons on strings meeting at the bottom middle of their box, `0 0 120 190`. */
function BalloonsArt() {
  return (
    <>
      {[
        [30, 46, "#ff6b6b", -8],
        [90, 40, "#4dabf7", 8],
        [60, 22, "#ffd43b", 0],
      ].map(([x, y, c, tilt]) => (
        <g key={c as string}>
          <path d={`M${x} ${(y as number) + 36} Q${(x as number) + (tilt as number)} 130 60 186`} fill="none" stroke={INK} strokeWidth="2.5" />
          <ellipse cx={x as number} cy={y as number} rx="26" ry="32" fill={c as string} stroke={INK} strokeWidth="4" />
          <ellipse cx={(x as number) - 9} cy={(y as number) - 12} rx="6" ry="9" fill="#fff" opacity="0.6" />
        </g>
      ))}
    </>
  );
}

/** The jetpack: two small tanks with red caps, in its box `0 0 60 80`. */
function JetpackArt() {
  return (
    <>
      {[4, 30].map((x) => (
        <g key={x}>
          <rect x={x} y="12" width="26" height="56" rx="12" fill="#adb5bd" stroke={INK} strokeWidth="4" />
          <path d={`M${x} 26 Q${x + 13} 2 ${x + 26} 26 Z`} fill="#e03131" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <rect x={x + 6} y="66" width="14" height="12" rx="3" fill="#495057" stroke={INK} strokeWidth="3" />
        </g>
      ))}
    </>
  );
}

const Waiting = memo(function Waiting() {
  const gear = (g: Gear) => ({ "--tm-anim": `tm-jump-${g}`, "--tm-end-o": 0 }) as CSSProperties;
  return (
    <>
      <At x={BALLOON_POST.x - 60} y={BALLOON_POST.y - 250} w={120} h={250} className="tm-jump-fade" style={gear("waiting-balloons")}>
        <svg viewBox="0 0 120 250">
          <BalloonsArt />
          <rect x="56" y="186" width="8" height="64" rx="3" fill="#868e96" stroke={INK} strokeWidth="3" />
        </svg>
      </At>
      <At x={JETPACK_WAITS.x - 30} y={JETPACK_WAITS.y - 76} w={60} h={80} className="tm-jump-fade" style={gear("waiting-jetpack")}>
        <svg viewBox="0 0 60 80">
          <JetpackArt />
        </svg>
      </At>
    </>
  );
});

/** The stars still to catch, one over every move of the run, each caught on the way; while it hangs a tap lights it (H-51). */
const Stars = memo(function Stars({ moves, glow }: { moves: RunMove[]; glow: number }) {
  return (
    <>
      {moves.map((m) => {
        const c = starAt(m);
        const at = { "--tm-at": `${m.star}ms` } as CSSProperties;
        return (
          <At key={m.k} x={c.x - STAR / 2} y={c.y - STAR / 2} w={STAR} h={STAR}>
            <div className="tm-jump-star" style={at}>
              <StarArt />
            </div>
            <div className="tm-toy-left" style={at}>
              <LeftGlow n={glow} />
            </div>
          </At>
        );
      })}
    </>
  );
});

/** One star of the trail, five round points, golden with a light on it. */
export function StarArt() {
  return (
    <svg viewBox="0 0 52 52">
      <path
        d="M26 3 L32.5 17.5 L48 19 L36.5 29.5 L40 45 L26 37 L12 45 L15.5 29.5 L4 19 L19.5 17.5 Z"
        fill="#ffd43b"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M20 20 Q24 15 28 16" fill="none" stroke="#fff9db" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

/** The hopper: a round little ball with big eyes looking ahead (right), rosy cheeks and two small feet. */
function HopperArt() {
  return (
    <svg viewBox={`0 0 ${RUNNER} ${RUNNER}`}>
      {/* Its feet, under it. */}
      <ellipse cx="30" cy="77" rx="13" ry="7" fill="#364fc7" stroke={INK} strokeWidth="4" />
      <ellipse cx="56" cy="77" rx="13" ry="7" fill="#364fc7" stroke={INK} strokeWidth="4" />
      <circle cx="42" cy="42" r="32" fill="#ff922b" stroke={INK} strokeWidth="5" />
      <path d="M22 26 Q30 16 42 15" fill="none" stroke="#ffd8a8" strokeWidth="6" strokeLinecap="round" />
      {/* Big eyes looking ahead, each with a light. */}
      {[42, 60].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy="36" rx="8" ry="11" fill="#fff" stroke={INK} strokeWidth="3" />
          <ellipse cx={x + 3} cy="38" rx="4.5" ry="6.5" fill={INK} />
          <circle cx={x + 4.5} cy="35" r="1.8" fill="#fff" />
        </g>
      ))}
      <ellipse cx="34" cy="52" rx="6" ry="4" fill="#ff6b6b" opacity="0.6" />
      <path d="M48 52 Q54 58 61 52" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

/** A thing the hopper carries: a layer round it in its own units (`x`, `y`, `w`, `h` in the hopper's 84), coming and going by its keyframes. */
function Carried({ gear, x, y, w, h, end, children }: { gear: Gear; x: number; y: number; w: number; h: number; end: number; children: ReactNode }) {
  const pct = (v: number) => `${((v / RUNNER) * 100).toFixed(2)}%`;
  return (
    <div
      className="tm-jump-fade tm-jump-carried"
      style={{ left: pct(x), top: pct(y), width: pct(w), height: pct(h), "--tm-anim": `tm-jump-${gear}`, "--tm-end-o": end } as CSSProperties}
    >
      {children}
    </div>
  );
}

/**
 * The hopper on its way: layers inside each other on keyframes written for the run (across, up and down, its turn),
 * and inside them its bounce once a second while it waits, squashing on its feet (H-63), with what it carries: the
 * diving mask, the balloons over it, the jetpack on its back with its flame.
 */
const Runner = memo(function Runner({ first }: { first: number }) {
  const start = SPOTS[first];
  return (
    <At
      x={start.x - RUNNER / 2}
      y={start.y - RUNNER}
      w={RUNNER}
      h={RUNNER}
      className="tm-hop tm-jump-runner"
      style={{ "--tm-anim": "tm-jump-x", "--tm-end": move("X", FINAL.x - start.x) } as CSSProperties}
    >
      <div className="tm-hop tm-hop-y" style={{ "--tm-anim": "tm-jump-y", "--tm-end": move("Y", FINAL.y - start.y) } as CSSProperties}>
        <div
          className="tm-hop tm-jump-turn"
          style={{ "--tm-anim": "tm-jump-turn", "--tm-end": turn(Math.sign(FINAL.x - SPOTS[MAX_MOVES].x)) } as CSSProperties}
        >
          <div className="tm-jump-bob">
            <Carried gear="balloons" x={-18} y={-170} w={120} h={190} end={0}>
              <svg viewBox="0 0 120 190">
                <BalloonsArt />
              </svg>
            </Carried>
            <Carried gear="flame" x={-14} y={64} w={40} h={50} end={0}>
              <svg viewBox="0 0 40 50">
                <path d="M6 0 Q2 24 12 44 Q16 30 20 44 Q26 30 28 44 Q38 24 34 0 Z" fill="#ffa94d" stroke="#e8590c" strokeWidth="3" strokeLinejoin="round" />
                <path d="M12 0 Q12 18 20 30 Q28 18 28 0 Z" fill="#ffe066" />
              </svg>
            </Carried>
            <Carried gear="jetpack" x={-20} y={8} w={48} h={64} end={1}>
              <svg viewBox="0 0 60 80">
                <JetpackArt />
              </svg>
            </Carried>
            <HopperArt />
            <Carried gear="mask" x={28} y={20} w={46} h={34} end={0}>
              <svg viewBox="0 0 46 34">
                <rect x="1" y="12" width="44" height="8" rx="4" fill="#1971c2" />
                <rect x="4" y="3" width="38" height="28" rx="12" fill="#a5d8ff" fillOpacity="0.55" stroke="#1971c2" strokeWidth="4" />
                <path d="M23 6 V28" stroke="#1971c2" strokeWidth="3" />
              </svg>
            </Carried>
          </div>
        </div>
      </div>
    </At>
  );
});

/**
 * The world, many screens tall, moved up and down as a whole by one layer on keyframes written for the run (the camera,
 * `tm-jump-cam`), with the hopper and everything in it.
 */
export function JumpScene({ count, total, glow }: { count: number; total: number; glow: number }) {
  // Worked out once for the run, so the memoised parts are not drawn again when a tap lights the stars.
  const { first, moves, dive } = useMemo(() => jumpPlan(total, count), [total, count]);
  return (
    <>
      <JumpKeyframes total={total} first={first} moves={moves} dive={dive} />
      <div
        className="tm-layer tm-hop tm-jump-world"
        style={
          {
            left: 0,
            top: 0,
            width: "100%",
            height: `${(WORLD_H / STAGE_H) * 100}%`,
            "--tm-anim": "tm-jump-cam",
            "--tm-end": cam(cameraAt(FINAL.y)),
          } as CSSProperties
        }
        aria-hidden
      >
        <div className="tm-jump-sky tm-back" style={{ background: SKY }} />
        <Space />
        <Clouds />
        <Land />
        <Cake />
        <Waiting />
        <Stars moves={moves} glow={glow} />
        <Runner first={first} />
        <WaterFront />
        <CakeFront />
      </div>
    </>
  );
}
