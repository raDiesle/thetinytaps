import { type CSSProperties, memo, type ReactNode, useMemo } from "react";
import { FOX_POSES, type FoxPose, FoxJetpack, FoxPoseArt, HANG_PAWS } from "./jumpFox";
import { type Frame, holdToEnd, keyframes } from "./keyframes";
import { INK, LeftGlow, STAGE_H, STAGE_W } from "./scenes";

// Up to the Moon (H-127, rebuilt on user request, 23 November 2026: „nach oben hüpfen, und das Bild scrollt mit“): a
// jump-and-run going up, through a world many screens tall that the picture follows like a camera. A little fox (the
// app's own, `jumpFox.tsx`) starts at the bottom of a lake and swims up to the surface with a snorkel and a mermaid's
// tail, walks ashore over the meadow to the tree, hops up its trunk from one wooden step to the next – nailed to it left
// and right in turn, as for a treehouse – and up through the hatch into the treehouse, climbs into the cable car's basket
// waiting there and rides it up the rope to the skyscraper's open window, hops through it into the glass lift and rides
// up to the roof (user request, 23 November 2026: „auf Holzstücken … den Stamm hochhüpfen“, „ein Baumhaus“, „einen
// Seilaufzug zum Nebenfenster … dann mit dem Aufzug nach oben“). There the balloons wait, and it takes those very
// balloons and floats past the clouds hanging from them, up to the highest cloud, where it floats in front of the
// jetpack waiting there and the jetpack docks onto its back; it flies by the ringed planet and once round the moon
// before landing on it – each height its own way to move, and each way of moving its own pose. It never stands still:
// a hop is quick, its body squashing and stretching like a rubber ball (user request, 23 November 2026), and the slow
// ways – swimming, the lift, the balloons, space – take the time the hops leave, so the time is seen going up all the
// way. From the moon it leaps off and sails down on a parachute, the picture going down with it past everything it
// climbed, and drops into the cake that stood on the meadow from the start: the goal seen from the first second. A star
// hangs over every move, caught on the way as in a platform game. Round it the world lives a little (birds, wind, fish,
// a swaying crown, twinkling stars). Everything stands where it could stand: the lake lies on the left, and tree, cake
// and skyscraper on the meadow beside it (user feedback, 23 November 2026: houses standing in the water made no sense).
// A genre's look of our own – nothing of one game.

/** The fox's layer, a square standing with its feet's middle on its spot. */
export const RUNNER = 120;

/** The world's height in stage units: many screens of 900, from the moon at the top to the lake's floor. */
export const WORLD_H = 5400;

/** The lake's surface, and the meadow beside it (a little higher), where the tree, the cake and the skyscraper stand. */
export const SURFACE = 4740;
export const GROUND = 4720;

/** The lake reaches from the left to here; the meadow lies right of it. */
export const SHORE = 500;

/** How a move goes: swimming in the lake, walking on the meadow, hopping, riding the cable car, riding the lift, floating on balloons, flying with the jetpack. */
export type MoveKind = "swim" | "walk" | "hop" | "ride" | "lift" | "fly" | "jet";

/** The fox's pose for each way of moving (user request, 23 November 2026: every move should fit what it does). */
export const POSE_OF: Record<MoveKind, FoxPose> = { swim: "swim", walk: "walk", hop: "hop", ride: "ride", lift: "lift", fly: "hang", jet: "jet" };

/**
 * How long one leap of a hop takes, whatever the time set (user feedback, 23 November 2026: hops stretched over a long
 * share looked odd – a hop is quick): a short push off, the arc and the landing. The slow ways of moving – swimming,
 * the lift, the balloons, the jetpack – take the time the quick hops leave.
 */
export const HOP_MS = 1100;

/** How much of the time left after the hops each other way of moving gets, for one move of it: the slow ones a bit more. */
export const PACE: Record<Exclude<MoveKind, "hop">, number> = { swim: 1.3, walk: 1, ride: 1, lift: 1.2, fly: 1.3, jet: 1.3 };

/** The share of a leap it stands squashed on its feet pushing off, before it leaves the ground. */
export const PUSH = 0.2;

/** The tree: its trunk's middle and half its width, and the wooden steps nailed to it, left and right in turn, to hop up on. */
export const TREE = { x: 660, half: 56, foot: GROUND } as const;
export const STEPS: readonly { x: number; y: number }[] = [4605, 4490, 4375, 4260, 4145, 4030].map((y, i) => ({ x: TREE.x + (i % 2 ? 50 : -50), y }));

/** The treehouse's floor (its top, and how far it reaches), with the hatch in it that the fox hops up through. */
export const DECK = { y: 3915, left: 470, right: 860 } as const;
const HATCH = { left: 690, right: 780 } as const;

/** The cable car: where its basket waits by the treehouse and where it stops at the skyscraper's window (its floor, where the fox stands). */
const BASKET_START = { x: 905, y: 3935 } as const;
const BASKET_END = { x: 1025, y: 3795 } as const;

/** How far above the basket's floor it hangs from the rope. */
const HANG = 170;

/** The skyscraper on the meadow, its open window at the cable car's end, and the glass lift's shaft from the meadow to its roof. */
export const SKYSCRAPER = { x: 1090, w: 330, top: 2060 } as const;
export const SHAFT = { x: 1240, half: 60 } as const;
const WINDOW = { left: 1098, right: 1178, floor: BASKET_END.y, top: BASKET_END.y - 155 } as const;

/** The moon: the top of it, where the fox lands, its middle and size, and the way once round it before landing (user request, 23 November 2026). */
const MOON_TOP = { x: 990, y: 440 } as const;
export const MOON = { cx: MOON_TOP.x, r: 130, cy: MOON_TOP.y + 130 } as const;
export const ORBIT_R = 235;

/**
 * The points of the way once round the moon: from its left side up over its top, down its right side, under it and
 * up its left side again – a whole circle – and over to its top once more, from where it comes down onto it.
 */
export const ORBIT: readonly { x: number; y: number }[] = Array.from({ length: 16 }, (_, i) => {
  const a = Math.PI + (i * Math.PI) / 6;
  return { x: Math.round(MOON.cx + ORBIT_R * Math.cos(a)), y: Math.round(MOON.cy + ORBIT_R * Math.sin(a)) };
});

/** The lift's stops on its way up, from the window's floor to the roof. */
const LIFT_STOPS = 5;
const liftStop = (i: number) => WINDOW.floor - ((WINDOW.floor - SKYSCRAPER.top) * i) / LIFT_STOPS;

/**
 * Where the fox stands, one spot after the other from the lake's floor up to the moon, with how it gets to each and
 * the points its way passes on the way there (`via`; a hop goes from point to point, one leap each). Every way goes
 * along something to walk or hop on – the meadow, the tree's steps, the treehouse's floor, the window's sill – or
 * through water or air where it swims or floats, or in the cable car's basket or the lift, so it is on its way all the
 * time.
 */
export const SPOTS: readonly { x: number; y: number; by?: MoveKind; via?: readonly { x: number; y: number }[]; slow?: number }[] = [
  // In the lake: on its floor, then swimming up to float at the surface by the shore.
  { x: 390, y: 5270 },
  { x: 300, y: 5100, by: "swim" },
  { x: 420, y: 4940, by: "swim" },
  { x: 410, y: 4778, by: "swim" },
  // Out of the water up the bank, walking on the meadow to the tree (user request, 23 November 2026: first walk on
  // the meadow, then hop), and up the tree's steps, two at a time.
  { x: 556, y: GROUND, by: "walk", via: [{ x: SHORE - 4, y: GROUND }] },
  { x: STEPS[0].x, y: STEPS[0].y, by: "hop" },
  { x: STEPS[2].x, y: STEPS[2].y, by: "hop", via: [STEPS[1]] },
  { x: STEPS[4].x, y: STEPS[4].y, by: "hop", via: [STEPS[3]] },
  // Through the hatch into the treehouse, and across its floor into the cable car's basket.
  { x: 735, y: DECK.y, by: "hop", via: [STEPS[5]] },
  { x: BASKET_START.x, y: BASKET_START.y, by: "hop", via: [{ x: 815, y: DECK.y }] },
  // Up the rope to the skyscraper's window.
  { x: (BASKET_START.x + BASKET_END.x) / 2, y: (BASKET_START.y + BASKET_END.y) / 2, by: "ride" },
  { x: BASKET_END.x, y: BASKET_END.y, by: "ride" },
  // Over the sill into the glass lift, and up in it to the roof.
  { x: SHAFT.x, y: WINDOW.floor, by: "hop", via: [{ x: 1130, y: WINDOW.floor }] },
  ...Array.from({ length: LIFT_STOPS }, (_, i) => ({ x: SHAFT.x, y: Math.round(liftStop(i + 1)), by: "lift" as const })),
  // Out onto the roof, where the balloons wait.
  { x: 1150, y: SKYSCRAPER.top, by: "hop" },
  // On the balloons from cloud to cloud; the jetpack waits on the highest.
  { x: 800, y: 1760, by: "fly" },
  { x: 1060, y: 1500, by: "fly" },
  { x: 770, y: 1250, by: "fly" },
  // With the jetpack: up into space, to the ringed planet, and once round the moon before landing on top of it.
  { x: 1030, y: 990, by: "jet" },
  { x: 690, y: 720, by: "jet" },
  { ...MOON_TOP, by: "jet", via: ORBIT, slow: 2.5 },
];

/** How many moves the whole way has: five minutes take all of them, one about every 10 seconds. */
export const MAX_MOVES = SPOTS.length - 1;

/** The fewest moves a run makes: a short time starts further up. */
export const MIN_MOVES = 5;

/** The time a move gets at least: a shorter run starts further up rather than hurrying. */
export const MIN_UNIT = 1500;

/**
 * The share of the time the way down from the moon takes (user feedback, 23 November 2026: the jump into the cake was
 * so quick it looked as if it teleported, and none of the places it passed were seen): a fifth of every run, a minute
 * of five, sailing down on a parachute past everything it climbed.
 */
export const DIVE_SHARE = 0.2;

/** How long the way down takes in a run of `total` ms. */
export const diveMs = (total: number) => total * DIVE_SHARE;

/** How many moves a run of `ms` makes. */
export function moveCount(ms: number): number {
  return Math.max(MIN_MOVES, Math.min(MAX_MOVES, Math.floor((ms - diveMs(ms)) / MIN_UNIT)));
}

/** The points of move `k`'s way, from its spot over any `via` to the next spot: one leap from each to the next when it hops. */
export function wayOf(k: number): { x: number; y: number }[] {
  const to = SPOTS[k + 1];
  return [SPOTS[k], ...(to.via ?? []), to];
}

/**
 * When move `k` reaches each point of its way, as a share of its time from 0 to 1: by length along a way it goes at an
 * even pace, and one leap after the other in the same time when it hops.
 */
export function timeShares(k: number): number[] {
  const way = wayOf(k);
  if (SPOTS[k + 1].by === "hop") return way.map((_, i) => i / (way.length - 1));
  const steps = way.slice(1).map((p, i) => Math.hypot(p.x - way[i].x, p.y - way[i].y));
  const length = steps.reduce((a, b) => a + b, 0) || 1;
  const at = [0];
  for (const s of steps) at.push(at[at.length - 1] + s / length);
  return at;
}

/** How high a hop rises over the higher of its two ends. */
export const LIFT = 46;

/** A hop from `a` to `b`: the top of its arc, and when it is reached (a share of the hop's time – longer the higher it rises, as a thrown thing does). */
export function hopArc(a: { x: number; y: number }, b: { x: number; y: number }): { x: number; y: number; at: number } {
  const y = Math.min(a.y, b.y) - LIFT;
  const [rise, fall] = [Math.sqrt(a.y - y), Math.sqrt(b.y - y)];
  const at = rise / (rise + fall);
  return { x: a.x + (b.x - a.x) * at, y, at };
}

/** Where the fox's feet are `f` (0 to 1) of the time through move `k`: along its way, and over the arc of each hop after pushing off. */
export function trackAt(k: number, f: number): { x: number; y: number } {
  const way = wayOf(k);
  const at = timeShares(k);
  const i = Math.max(
    1,
    at.findIndex((s) => s >= f),
  );
  const [a, b] = [way[i - 1], way[i]];
  const share = (f - at[i - 1]) / (at[i] - at[i - 1] || 1);
  if (SPOTS[k + 1].by !== "hop") return { x: a.x + (b.x - a.x) * share, y: a.y + (b.y - a.y) * share };
  if (share <= PUSH) return { x: a.x, y: a.y };
  const part = (share - PUSH) / (1 - PUSH);
  const top = hopArc(a, b);
  const y = part < top.at ? a.y + (top.y - a.y) * (part / top.at) : top.y + (b.y - top.y) * ((part - top.at) / (1 - top.at));
  return { x: a.x + (b.x - a.x) * part, y };
}

/**
 * One move of a run: from which spot (to the next), its kind, when it leaves and lands, and when its star is caught.
 * A move leaves as the one before lands (user feedback, 23 November 2026: standing still and then a quick hop to the
 * next place hid the time going; now it goes up all the time, a little every second), a hop quickly, the rest slowly.
 */
export interface RunMove {
  k: number;
  kind: MoveKind;
  start: number;
  land: number;
  star: number;
}

/**
 * The way down: it leaps off the moon as the climb ends (`start`), opens its parachute at the top of the leap (`top`),
 * sails down swinging under it past everything it climbed, lets go of it over the cake (`release`) and drops into it,
 * landing as the time is up.
 */
export interface Dive {
  start: number;
  top: number;
  release: number;
  land: number;
}

/** The cake is drawn in units of its own (130 high, standing on the meadow) and shown this much bigger, so it is plainly the goal. */
const CAKE_SCALE = 1.4;

/** The cake on the meadow between the tree and the skyscraper, the goal: its middle, the top of its upper tier, and its tiers' widths. */
export const CAKE = { x: 910, top: GROUND - 130 * CAKE_SCALE, low: 170 * CAKE_SCALE, high: 110 * CAKE_SCALE } as const;

/** The cake's drawing as its own units place it: its top, and its tiers' widths. */
const CAKE_ART = { top: GROUND - 130, low: 170, high: 110 } as const;

/** A box of the cake's drawing (in its own units) placed in the world, grown from the cake's foot by `CAKE_SCALE`. */
const cakeBox = (x: number, y: number, w: number, h: number) => ({
  x: CAKE.x + (x - CAKE.x) * CAKE_SCALE,
  y: GROUND + (y - GROUND) * CAKE_SCALE,
  w: w * CAKE_SCALE,
  h: h * CAKE_SCALE,
});

/** Where the fox ends: sunk deep into the cake, its legs in the crater. */
export const FINAL = { x: CAKE.x, y: CAKE.top + 56 * CAKE_SCALE } as const;

/** How high it leaps off the moon before its parachute opens. */
const LEAP = 130;

/** The leap off the moon takes this long at most, and the drop from the parachute into the cake this long. */
const LEAP_MS = 1600;
const DROP_MS = 900;

/** Where it lets go of the parachute: this high over the cake's top, so the last bit is a real drop with a splash. */
export const RELEASE_Y = CAKE.top - 240;

/** How far it swings to either side under the parachute, how long one swing takes, and how much it tilts then. */
export const SWAY = 70;
const SWING_MS = 2600;
const TILT = 9;

/** The most swings a way down has: a long run swings slower rather than writing ever more keyframes. */
const MAX_SWINGS = 60;

/** How many leaps move `k` makes when it hops: one from each point of its way to the next. */
export const leapsOf = (k: number) => wayOf(k).length - 1;

/**
 * Works out a run of `total` ms making `count` moves: the fox starts on the spot `count` moves below the moon
 * (`first`), then each move follows the last with no wait. A hop takes `HOP_MS` a leap (less where the moves are short
 * on average, `unit`, at most half of it), and the other moves share the rest of the climbing time by their `PACE`
 * (and a long way's `slow`). Then it goes down into the cake, landing as the time is up.
 */
export function jumpPlan(total: number, count: number): { first: number; unit: number; leap: number; moves: RunMove[]; dive: Dive } {
  const first = MAX_MOVES - count;
  const D = diveMs(total);
  const climb = total - D;
  const unit = climb / count;
  const leap = Math.min(HOP_MS, unit / 2);
  const ks = Array.from({ length: count }, (_, i) => first + i);
  const kindOf = (k: number) => SPOTS[k + 1].by ?? "hop";
  const weight = (k: number) => {
    const kind = kindOf(k);
    return kind === "hop" ? 0 : PACE[kind] * (SPOTS[k + 1].slow ?? 1);
  };
  const hops = ks.reduce((sum, k) => sum + (kindOf(k) === "hop" ? leapsOf(k) * leap : 0), 0);
  const weights = ks.reduce((sum, k) => sum + weight(k), 0);
  // Every move but the hops gets its part of what the hops leave; a run of hops alone shares the time evenly.
  const span = (k: number) => (weights ? (kindOf(k) === "hop" ? leapsOf(k) * leap : ((climb - hops) * weight(k)) / weights) : climb / count);
  let at = 0;
  const moves = ks.map((k) => {
    const start = at;
    at += span(k);
    return { k, kind: kindOf(k), start, land: at, star: (start + at) / 2 };
  });
  moves[moves.length - 1].land = climb;
  return {
    first,
    unit,
    leap,
    moves,
    dive: { start: climb, top: climb + Math.min(LEAP_MS, D * 0.15), release: total - Math.min(DROP_MS, D * 0.1), land: total },
  };
}

/** The star of move `k`: where the fox's body is halfway through it, as it passes. */
export function starAt(k: number): { x: number; y: number } {
  const half = trackAt(k, 0.5);
  return { x: half.x, y: half.y - RUNNER / 2 };
}

/** A star's square layer. */
export const STAR = 52;

/** Where the fox's feet stand on the screen while the picture follows it (the stage's y); a little below the middle, so the way up shows. */
export const ANCHOR = 600;

/** How far the picture has moved down the world to show feet standing at `y`: they stand at `ANCHOR`, but it never looks past the top or the bottom. */
export const cameraAt = (y: number) => Math.max(0, Math.min(WORLD_H - STAGE_H, y - ANCHOR));

/** A transform moving the fox from its first spot by `d` stage units, across or up and down, in % of its own size. */
const move = (axis: "X" | "Y", d: number) => `translate${axis}(${((d / RUNNER) * 100).toFixed(2)}%)`;

/** A transform moving the world up so that the stage shows it from `c` down. */
const cam = (c: number) => `translateY(${((-c / WORLD_H) * 100).toFixed(3)}%)`;

/** How the fox turns: facing right (1) or left (−1), and how far round it turns (degrees, as seen). */
const turn = (face: number, spin = 0) => `scaleX(${face}) rotate(${face * spin}deg)`;

/** The swings of the way down from `top` to `release`: how many, each one way, never more than `MAX_SWINGS`. */
export const swingCount = (dive: Dive) => Math.max(1, Math.min(MAX_SWINGS, Math.round((dive.release - dive.top) / SWING_MS)));

/** Where across the fox is after swing `j` of `n` on the way down from `fromX`: on the line to the cake, out to one side and the other, on it at the end. */
export const swingX = (fromX: number, j: number, n: number) => fromX + (FINAL.x - fromX) * (j / n) + (j < n ? (j % 2 ? SWAY : -SWAY) : 0);

/** How a hop rises (slowing towards its top) and falls (speeding up from it). */
const RISE = "cubic-bezier(0.33, 0.66, 0.66, 1)";
const FALL = "cubic-bezier(0.33, 0, 0.66, 0.34)";

/** How the fox's body gives as it hops, like a rubber ball (user request, 23 November 2026): as it stands, squashed pushing off and landing, stretched leaving the ground and coming down. */
const BODY = "scale(1, 1)";
const CROUCH = "scale(1.16, 0.8)";
const STRETCH = "scale(0.88, 1.14)";
const REACH = "scale(0.94, 1.07)";
const LANDED = "scale(1.2, 0.78)";

/** How long it takes to stand up straight again after landing, when no leap follows. */
const RECOVER = 180;

/**
 * Its body squashing and stretching on every leap, as keyframes (at its feet): it crouches, pushes off stretched, is
 * round at the top of its arc, stretches as it comes down and squashes landing – straight into the next crouch when
 * another leap follows, else standing up again.
 */
export function squashFrames(leaps: { from: number; to: number }[]): Frame[] {
  const frames: Frame[] = [{ at: 0, transform: BODY, ease: "ease-out" }];
  leaps.forEach(({ from, to }, i) => {
    const push = (to - from) * PUSH;
    const air = to - from - push;
    if (i === 0 || leaps[i - 1].to < from) frames.push({ at: from, transform: BODY, ease: "ease-out" });
    frames.push(
      { at: from + push * 0.8, transform: CROUCH, ease: "linear" },
      { at: from + push, transform: CROUCH, ease: "ease-out" },
      { at: from + push + air * 0.2, transform: STRETCH, ease: "ease-in-out" },
      { at: from + push + air * 0.5, transform: BODY, ease: "ease-in" },
      { at: to - air * 0.08, transform: REACH, ease: "ease-out" },
      { at: to, transform: LANDED, ease: "ease-out" },
    );
    if (!leaps[i + 1] || leaps[i + 1].from > to) frames.push({ at: to + Math.min(RECOVER, air), transform: BODY, ease: "ease-out" });
  });
  return frames;
}

/**
 * The fox's way and the picture's as lists of keyframes: across and up and down at an even pace along each move's
 * way (it never stands still), each hop a quick push off and an arc from point to point, its body giving like a
 * rubber ball as it does (`squash`), its turn (facing the way it goes, tilting as it swings under the parachute,
 * spinning once as it drops into the cake), and the camera following its feet at an even pace – never up and down
 * with each hop.
 */
export function jumpFrames(
  first: number,
  moves: RunMove[],
  dive: Dive,
): { across: Frame[]; upDown: Frame[]; turning: Frame[]; camera: Frame[]; squash: Frame[] } {
  const origin = SPOTS[first];
  const leaps: { from: number; to: number }[] = [];
  const across: Frame[] = [{ at: 0, transform: move("X", 0), ease: "linear" }];
  const upDown: Frame[] = [{ at: 0, transform: move("Y", 0), ease: "linear" }];
  let face = 1;
  const turning: Frame[] = [{ at: 0, transform: turn(face) }];
  const camera: Frame[] = [{ at: 0, transform: cam(cameraAt(origin.y)), ease: "linear" }];
  const faceTo = (at: number, to: number, within: number) => {
    if (to === face) return;
    turning.push({ at, transform: turn(face) }, { at: at + Math.min(300, within / 3), transform: turn(to) });
    face = to;
  };
  const point = (at: number, p: { x: number; y: number }) => {
    across.push({ at, transform: move("X", p.x - origin.x), ease: "linear" });
    upDown.push({ at, transform: move("Y", p.y - origin.y), ease: "linear" });
    camera.push({ at, transform: cam(cameraAt(p.y)), ease: "linear" });
  };
  for (const m of moves) {
    const way = wayOf(m.k);
    const at = timeShares(m.k);
    for (let j = 1; j < way.length; j++) {
      const [a, b] = [way[j - 1], way[j]];
      const [t0, t1] = [m.start + (m.land - m.start) * at[j - 1], m.start + (m.land - m.start) * at[j]];
      // It faces the way it goes, turning at each step up the trunk; going straight up it keeps facing as it was.
      if (Math.abs(b.x - a.x) > 30) faceTo(t0, Math.sign(b.x - a.x), t1 - t0);
      if (m.kind === "hop") {
        // A leap: pushing off where it stands, then rising to the top of its arc and falling from it, while it goes
        // across at an even pace.
        const off = t0 + (t1 - t0) * PUSH;
        const top = hopArc(a, b);
        const mid = off + (t1 - off) * top.at;
        across.push({ at: off, transform: move("X", a.x - origin.x), ease: "linear" });
        upDown.push({ at: off, transform: move("Y", a.y - origin.y), ease: RISE });
        across.push({ at: mid, transform: move("X", top.x - origin.x), ease: "linear" });
        upDown.push({ at: mid, transform: move("Y", top.y - origin.y), ease: FALL });
        leaps.push({ from: t0, to: t1 });
      }
      point(t1, b);
    }
  }
  // The way down: a leap up off the moon towards the cake, the parachute opening at its top.
  const moon = SPOTS[MAX_MOVES];
  const dir = Math.sign(FINAL.x - moon.x);
  const topX = moon.x + dir * 50;
  faceTo(dive.start, dir, dive.top - dive.start);
  across.push({ at: dive.start, transform: move("X", moon.x - origin.x), ease: "ease-out" });
  upDown.push({ at: dive.start, transform: move("Y", moon.y - origin.y), ease: "cubic-bezier(0.2, 0.7, 0.4, 1)" });
  camera.push({ at: dive.start, transform: cam(cameraAt(moon.y)), ease: "cubic-bezier(0.2, 0.7, 0.4, 1)" });
  across.push({ at: dive.top, transform: move("X", topX - origin.x), ease: "ease-in-out" });
  upDown.push({ at: dive.top, transform: move("Y", moon.y - LEAP - origin.y), ease: "linear" });
  camera.push({ at: dive.top, transform: cam(cameraAt(moon.y - LEAP)), ease: "linear" });
  // Sailing down at an even pace, swinging from side to side and tilting with each swing.
  const n = swingCount(dive);
  for (let j = 1; j <= n; j++) {
    const at = dive.top + ((dive.release - dive.top) * j) / n;
    const x = swingX(topX, j, n);
    across.push({ at, transform: move("X", x - origin.x), ease: "ease-in-out" });
    turning.push({ at, transform: turn(face, j < n ? (j % 2 ? -TILT : TILT) : 0), ease: "ease-in-out" });
  }
  upDown.push({ at: dive.release, transform: move("Y", RELEASE_Y - origin.y), ease: "cubic-bezier(0.5, 0, 1, 1)" });
  camera.push({ at: dive.release, transform: cam(cameraAt(RELEASE_Y)), ease: "cubic-bezier(0.5, 0, 1, 1)" });
  // Letting go of the parachute: the drop into the cake, spinning once.
  across.push({ at: dive.land, transform: move("X", FINAL.x - origin.x) });
  upDown.push({ at: dive.land, transform: move("Y", FINAL.y - origin.y) });
  camera.push({ at: dive.land, transform: cam(cameraAt(FINAL.y)) });
  turning.push({ at: dive.land, transform: turn(face, 360) });
  return { across, upDown, turning, camera, squash: squashFrames(leaps) };
}

/** One keyframe of a thing coming or going: when, and its look then (any CSS), and how it goes on to the next. */
export type Look = { at: number; css: string; ease?: string };

/** A `@keyframes` rule for a run of `total` ms from looks in time order, the last held to the end (a rule without a 100% frame goes back to the element's own look). */
function looks(name: string, total: number, given: Look[]): string {
  const last = given.at(-1);
  const frames = last && last.at < total ? [...given, { at: total, css: last.css }] : given;
  const percent = (ms: number) => ((Math.max(0, Math.min(ms, total)) / total) * 100).toFixed(4);
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
export function shownFrames(
  first: number,
  moves: RunMove[],
  from: number,
  until: number,
  { gone = "opacity: 0", shown = "opacity: 1", come = FADE, go = FADE * 4 }: { gone?: string; shown?: string; come?: number; go?: number } = {},
): Look[] {
  const startOf = (k: number) => moves.find((m) => m.k === k)?.start;
  const on = from < first && until >= first;
  const frames: Look[] = [{ at: 0, css: on ? shown : gone }];
  const came = from >= first ? startOf(from) : undefined;
  if (came !== undefined) frames.push({ at: came, css: gone }, { at: came + come, css: shown });
  const went = until < MAX_MOVES && until >= first ? startOf(until) : undefined;
  if (went !== undefined) frames.push({ at: went, css: shown, ease: "ease-in" }, { at: went + go, css: gone });
  return frames;
}

/** A swap that is seen as one thing changing hands: one keyframe apart (`looks` writes four decimals of a percent). */
const swapMs = (total: number) => Math.max(1, total * 0.00003);

/** The moves that take the fox onto the balloons and onto the jetpack: from the spot where each waits. */
export const BALLOONS_FROM = SPOTS.findIndex((s) => s.by === "fly") - 1;
export const JETPACK_FROM = SPOTS.findIndex((s) => s.by === "jet") - 1;

/** The way the fox faces as it arrives on spot `k` (right 1, left −1). */
const facingAt = (k: number) => Math.sign(SPOTS[k].x - SPOTS[k - 1].x) || 1;

/** How far below its place on the fox's back the jetpack waits on the cloud, in % of the fox's size, and how long it takes to come up and dock. */
const DOCK_DROP = 32;
const DOCK_MS = 900;

/** What the fox holds and what waits for it, each its own layer coming and going by keyframes written for the run. */
const GEAR = ["balloons", "parachute", "waiting-balloons", "waiting-jetpack"] as const;
type Gear = (typeof GEAR)[number];

/**
 * Each thing's keyframes for a run starting on spot `first`, and how it is left at the end (shown or not). What waits
 * for the fox is the very thing it then takes (user feedback, 23 November 2026: the balloons waiting and the balloons
 * held were seen twice at once): it waits exactly where the fox will hold it, and the two swap in one keyframe, so it
 * is one thing changing hands, never a second one fading in beside the first. The jetpack comes up off the cloud as the
 * fox floats in front of it and docks onto its back (user request, 23 November 2026).
 */
export function gearLooks(first: number, moves: RunMove[], dive: Dive): Record<Gear, { frames: Look[]; end: number }> {
  const swap = swapMs(dive.land);
  // The parachute opens at the top of the leap and is let go over the cake: it floats up and away.
  const opening = Math.min(600, (dive.top - dive.start) / 2);
  const parachute: Look[] = [
    { at: 0, css: "opacity: 0; transform: scale(0.2)" },
    { at: dive.top - opening, css: "opacity: 0; transform: scale(0.2)", ease: "ease-out" },
    { at: dive.top, css: "opacity: 1; transform: none" },
    { at: dive.release, css: "opacity: 1; transform: none", ease: "ease-in" },
    { at: Math.min(dive.land, dive.release + FADE * 3), css: "opacity: 0; transform: translateY(-70%)" },
  ];
  return {
    // The balloons from the skyscraper's roof to the highest cloud, let go there: they float up and away.
    balloons: {
      frames: shownFrames(first, moves, BALLOONS_FROM, JETPACK_FROM, {
        gone: "opacity: 0; transform: translateY(-60%)",
        shown: "opacity: 1; transform: none",
        come: swap,
      }),
      end: 0,
    },
    parachute: { frames: parachute, end: 0 },
    "waiting-balloons": { frames: shownFrames(first, moves, -1, BALLOONS_FROM, { go: swap }), end: 0 },
    "waiting-jetpack": { frames: dockFrames(first, moves, swap), end: 0 },
  };
}

/** The jetpack waiting on the highest cloud: sitting on it, coming up onto the fox's back as it floats in, gone into its pose as it flies off. */
function dockFrames(first: number, moves: RunMove[], swap: number): Look[] {
  const [sitting, docked, gone] = [`opacity: 1; transform: translateY(${DOCK_DROP}%)`, "opacity: 1; transform: none", "opacity: 0; transform: none"];
  if (first > JETPACK_FROM) return [{ at: 0, css: gone }];
  const arrive = moves.find((m) => m.k === JETPACK_FROM - 1);
  const leave = moves.find((m) => m.k === JETPACK_FROM)!.start;
  const frames: Look[] = [{ at: 0, css: arrive ? sitting : docked }];
  if (arrive)
    frames.push(
      { at: arrive.land - Math.min(DOCK_MS, (arrive.land - arrive.start) * 0.4), css: sitting, ease: "ease-in-out" },
      { at: arrive.land, css: docked },
    );
  frames.push({ at: leave, css: docked }, { at: leave + swap, css: gone });
  return frames;
}

/** What the fox does from when on: one entry for each change of pose, from the first move to the drop into the cake. */
export function poseTimeline(moves: RunMove[], dive: Dive): { from: number; pose: FoxPose }[] {
  const all: { from: number; pose: FoxPose }[] = [
    ...moves.map((m) => ({ from: m.start, pose: POSE_OF[m.kind] })),
    // Leaping off the moon with its arms up, hanging from the parachute's cords, dropping into the cake cheering.
    { from: dive.start, pose: "drop" },
    { from: dive.top, pose: "hang" },
    { from: dive.release, pose: "drop" },
  ];
  return all.filter((s, i) => i === 0 || s.pose !== all[i - 1].pose);
}

/** Each pose's keyframes: shown while it fits, swapped for the next at once (a short moment, so no two stand half seen together), and whether it is left shown at the end. */
export function poseLooks(moves: RunMove[], dive: Dive, total: number): Record<FoxPose, { frames: Look[]; end: number }> {
  const line = poseTimeline(moves, dive);
  const swap = Math.max(1, total * 0.00003);
  const last = line.at(-1)!.pose;
  return Object.fromEntries(
    FOX_POSES.map((p) => {
      const frames: Look[] = [{ at: 0, css: `opacity: ${line[0].pose === p ? 1 : 0}` }];
      for (let i = 1; i < line.length; i++) {
        if (line[i - 1].pose === p) frames.push({ at: line[i].from, css: "opacity: 1" }, { at: line[i].from + swap, css: "opacity: 0" });
        if (line[i].pose === p) frames.push({ at: line[i].from, css: "opacity: 0" }, { at: line[i].from + swap, css: "opacity: 1" });
      }
      return [p, { frames, end: last === p ? 1 : 0 }];
    }),
  ) as Record<FoxPose, { frames: Look[]; end: number }>;
}

/**
 * A car the fox rides (the cable car's basket, the lift's cabin): the spots where it waits and where it stops, and its
 * layer's size round the fox's feet. Before its ride it waits at the first spot; while the fox rides it goes along
 * with it, step for step; after it, it stays where it stopped.
 */
interface Car {
  from: number;
  to: number;
  w: number;
  h: number;
  /** How far below the layer's top the fox's feet stand. */
  foot: number;
}

/** The spots the fox rides between in a car of `kind`: where it gets in and where it gets out. */
const rideSpots = (kind: MoveKind) => {
  const ks = SPOTS.flatMap((s, k) => (s.by === kind ? [k] : []));
  return { from: ks[0] - 1, to: ks[ks.length - 1] };
};

export const BASKET: Car = { ...rideSpots("ride"), w: 150, h: 230, foot: 200 };
export const CABIN: Car = { ...rideSpots("lift"), w: 150, h: 214, foot: 202 };

/** Where car `c` is moved from its waiting place to stand at spot `k`, in % of its layer. */
const carShift = (c: Car, k: number) =>
  `translate(${(((SPOTS[k].x - SPOTS[c.from].x) / c.w) * 100).toFixed(2)}%, ${(((SPOTS[k].y - SPOTS[c.from].y) / c.h) * 100).toFixed(2)}%)`;

/** A car's way in a run starting on spot `first`: where it stands at the start, then along with the fox while it rides. */
export function carFrames(c: Car, first: number, moves: RunMove[]): Frame[] {
  const frames: Frame[] = [{ at: 0, transform: carShift(c, Math.max(c.from, Math.min(c.to, first))), ease: "linear" }];
  for (const m of moves)
    if (m.k >= c.from && m.k < c.to)
      frames.push({ at: m.start, transform: carShift(c, m.k), ease: "linear" }, { at: m.land, transform: carShift(c, m.k + 1), ease: "linear" });
  return frames;
}

/** The ways of the fox, the picture, the cars and the things it takes along, and its poses, as keyframes made for this run. */
function JumpKeyframes({ total, first, moves, dive }: { total: number; first: number; moves: RunMove[]; dive: Dive }) {
  const { across, upDown, turning, camera, squash } = jumpFrames(first, moves, dive);
  const gear = gearLooks(first, moves, dive);
  const poses = poseLooks(moves, dive, total);
  const rules = [
    keyframes("tm-jump-x", total, holdToEnd(across, total)),
    keyframes("tm-jump-y", total, holdToEnd(upDown, total)),
    keyframes("tm-jump-turn", total, holdToEnd(turning, total)),
    keyframes("tm-jump-cam", total, holdToEnd(camera, total)),
    keyframes("tm-jump-squash", total, holdToEnd(squash, total)),
    keyframes("tm-jump-basket", total, holdToEnd(carFrames(BASKET, first, moves), total)),
    keyframes("tm-jump-cabin", total, holdToEnd(carFrames(CABIN, first, moves), total)),
    ...GEAR.map((g) => looks(`tm-jump-${g}`, total, gear[g].frames)),
    ...FOX_POSES.map((p) => looks(`tm-jump-pose-${p}`, total, poses[p].frames)),
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

/** Grass and earth, wood and the treehouse's colours. */
const GRASS = "#6cc04a";
const GRASS_LIGHT = "#94d82d";
const EARTH = "#b9783f";
const EARTH_DARK = "#9c6230";
const BARK = "#8a5a2b";
const BARK_DARK = "#6b4423";
const WOOD = "#d9a066";
const WOOD_DARK = "#b07a44";

/** The little stars of space, each twinkling and turning slowly in a layer of its own (`SkyLife`): x, y and size. */
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

/** The spots reached with the jetpack: the ringed planet stands under the second, the moon under the last. */
const JETS = SPOTS.flatMap((s, k) => (s.by === "jet" ? [k] : []));
export const PLANET = { cx: SPOTS[JETS[1]].x, r: 100, cy: SPOTS[JETS[1]].y + 100 } as const;

/**
 * Space: the ringed planet and the moon at the top, drawn once. Nothing else round there may look like a second moon
 * (a grey rock with a flat top was taken out, user feedback, November 2026); the stars twinkle in layers of their own.
 */
const Space = memo(function Space() {
  return (
    <Band top={0} h={1150} className="tm-back">
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

/**
 * The clouds: one under each spot it floats to on the balloons, and soft ones far off – also lower down, beside the
 * skyscraper, so the long ride up in the lift passes something in the sky rather than a plain blue. Drawn once.
 */
const Clouds = memo(function Clouds() {
  return (
    <>
      <Band top={1100} h={800} className="tm-back">
        <Cloud x={360} top={1420} w={200} soft />
        <Cloud x={1330} top={1660} w={180} soft />
        {SPOTS.flatMap((s, k) => (s.by === "fly" ? [<Cloud key={k} x={s.x + 20} top={s.y - 6} w={250} />] : []))}
      </Band>
      <Band top={2000} h={1500} className="tm-back">
        <Cloud x={430} top={2150} w={230} soft />
        <Cloud x={860} top={2420} w={170} soft />
        <Cloud x={330} top={2760} w={190} soft />
        <Cloud x={760} top={3040} w={210} soft />
        <Cloud x={420} top={3330} w={150} soft />
      </Band>
    </>
  );
});

/** Where the rope of the cable car runs: from the pulley on the treehouse's post up to the one over the skyscraper's window, through the basket's hook. */
const ROPE_SLOPE = (BASKET_END.y - BASKET_START.y) / (BASKET_END.x - BASKET_START.x);
const ropeY = (x: number) => BASKET_START.y - HANG + (x - BASKET_START.x) * ROPE_SLOPE;
export const ROPE = { from: { x: 862, y: ropeY(862) }, to: { x: SKYSCRAPER.x + 2, y: ropeY(SKYSCRAPER.x + 2) } } as const;

/** A tall building's front from `top` down to the meadow, with rows of windows in `cols` columns between `x` and `x + w`, leaving out any cell `skip` says. */
function Windows({
  x,
  w,
  top,
  cols,
  glass,
  skip,
}: {
  x: number;
  w: number;
  top: number;
  cols: number;
  glass: string;
  skip?: (x: number, y: number) => boolean;
}) {
  const rows = Math.floor((GROUND - top - 150) / 80);
  const cell = w / cols;
  return (
    <>
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const [cx, cy] = [x + c * cell + 6, top + 40 + r * 80];
          return skip?.(cx + cell / 2, cy + 23) ? null : <rect key={`${r},${c}`} x={cx} y={cy} width={cell - 12} height="46" rx="4" fill={glass} />;
        }),
      )}
    </>
  );
}

/**
 * The skyscraper standing on the meadow: its windows, the open window where the cable car stops with its sill and a
 * warm light inside, the pulley over it, the glass shaft the lift rides up in from the meadow to the roof, and the lift's
 * glass house on the roof. A second, paler tower stands behind it at the right.
 */
function Skyscraper() {
  const { x, w, top } = SKYSCRAPER;
  const shaft = { left: SHAFT.x - SHAFT.half, right: SHAFT.x + SHAFT.half };
  const house = { left: shaft.left - 12, right: shaft.right + 12, top: top - 215 };
  return (
    <g>
      {/* The paler tower behind it. */}
      <rect x="1400" y="2700" width="230" height={GROUND - 2700 + 10} fill="#b6c2d6" stroke={INK} strokeWidth="5" />
      <rect x="1392" y="2686" width="246" height="20" rx="4" fill="#868e96" stroke={INK} strokeWidth="4" />
      <Windows x={1420} w={190} top={2700} cols={2} glass="#dbe4ff" />
      <rect x={x} y={top} width={w} height={GROUND - top + 10} fill="#91a7ff" stroke={INK} strokeWidth="5" />
      <rect x={x - 8} y={top - 14} width={w + 16} height="20" rx="4" fill="#868e96" stroke={INK} strokeWidth="4" />
      <Windows
        x={x + 6}
        w={w - 12}
        top={top}
        cols={4}
        glass="#e7f5ff"
        skip={(cx, cy) => (cx > shaft.left - 10 && cx < shaft.right + 10) || (cx < WINDOW.right + 30 && cy > WINDOW.top - 60 && cy < WINDOW.floor + 50)}
      />
      {/* The lift's shaft: glass with its rails and a band at every floor. */}
      <rect x={shaft.left} y={top} width={shaft.right - shaft.left} height={GROUND - top} fill="#d0ebff" stroke={INK} strokeWidth="5" />
      <path d={`M${shaft.left + 8} ${top} V${GROUND} M${shaft.right - 8} ${top} V${GROUND}`} stroke="#74c0fc" strokeWidth="5" />
      {Array.from({ length: Math.floor((GROUND - top) / 160) }, (_, i) => (
        <path key={i} d={`M${shaft.left} ${top + 160 * (i + 1)} H${shaft.right}`} stroke="#a5d8ff" strokeWidth="4" />
      ))}
      <path d={`M${shaft.left + 20} ${top + 40} V${GROUND - 60}`} stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
      {/* The lift's cable from the pulley in its glass house down the shaft (the cabin itself carries none). */}
      <path d={`M${SHAFT.x} ${top - 205} V${GROUND - 40}`} stroke={INK} strokeWidth="4" opacity="0.7" />
      {/* The lift's glass house on the roof, with its roof and a light on top. */}
      <rect x={house.left} y={house.top} width={house.right - house.left} height={top - house.top} fill="#d0ebff" stroke={INK} strokeWidth="5" />
      <path d={`M${house.left + 18} ${house.top + 20} V${top - 20}`} stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
      <rect x={house.left - 10} y={house.top - 18} width={house.right - house.left + 20} height="22" rx="5" fill="#5c7cfa" stroke={INK} strokeWidth="4" />
      <circle cx={SHAFT.x} cy={house.top - 30} r="12" fill="#ffd43b" stroke={INK} strokeWidth="4" />
      {/* The open window where the cable car stops: a warm room inside, its frame, and the sill to step over. */}
      <rect
        x={WINDOW.left}
        y={WINDOW.top}
        width={WINDOW.right - WINDOW.left}
        height={WINDOW.floor - WINDOW.top}
        rx="6"
        fill="#ffe8cc"
        stroke={INK}
        strokeWidth="5"
      />
      <path
        d={`M${WINDOW.left + 12} ${WINDOW.floor - 4} V${WINDOW.top + 50} Q${WINDOW.left + 40} ${WINDOW.top + 30} ${WINDOW.right - 12} ${WINDOW.top + 50} V${WINDOW.floor - 4}`}
        fill="#ffd8a8"
      />
      <rect x={WINDOW.left - 10} y={WINDOW.floor} width={WINDOW.right - WINDOW.left + 20} height="12" rx="3" fill="#dee2e6" stroke={INK} strokeWidth="4" />
      {/* The door at the bottom. */}
      <rect x={x + 22} y={GROUND - 90} width="56" height="90" rx="8" fill="#5c7cfa" stroke={INK} strokeWidth="4" />
      {/* The pulley over the window the rope runs to. */}
      <path d={`M${x} ${ROPE.to.y - 18} H${ROPE.to.x + 14}`} stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <circle cx={ROPE.to.x + 4} cy={ROPE.to.y} r="13" fill="#adb5bd" stroke={INK} strokeWidth="4" />
    </g>
  );
}

/**
 * The tree and its treehouse: a thick trunk with its roots and bark, wooden steps nailed to it left and right in turn,
 * and in its crown (`TreeCrown`, a layer of its own swaying in the wind behind it) the treehouse – a floor of boards held by two braces with the hatch the fox comes up
 * through (its lid standing open against the trunk), a little hut with a red roof, a round window and a flag, and the
 * cable car's post with its pulley at the floor's right end.
 */
function Tree() {
  const { x, half } = TREE;
  const hut = { left: 486, right: 628, top: 3775 };
  return (
    <g>
      {/* The trunk, wide at its foot, with bark and a knot hole. */}
      <path
        d={`M${x - half - 34} ${GROUND + 8} Q${x - half} ${GROUND - 30} ${x - half} ${GROUND - 130} L${x - half + 6} 3600 H${x + half - 6} L${x + half} ${GROUND - 130} Q${x + half} ${GROUND - 30} ${x + half + 34} ${GROUND + 8} Z`}
        fill={BARK}
        stroke={INK}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <g fill="none" stroke={BARK_DARK} strokeWidth="5" strokeLinecap="round">
        <path d={`M${x - 28} 4660 q-8 -60 2 -120 q8 -50 -2 -110`} />
        <path d={`M${x + 24} 4520 q8 -70 -2 -130`} />
        <path d={`M${x - 6} 4300 q-8 -60 2 -110`} />
        <path d={`M${x + 30} 4140 q-6 -50 2 -90`} />
        <path d={`M${x - 30} 3880 q6 -50 -2 -100`} />
      </g>
      <ellipse cx={x + 6} cy="4440" rx="13" ry="18" fill="#4a2c1a" stroke={BARK_DARK} strokeWidth="4" />
      {/* The steps nailed to the trunk, each a short board with two nails, where the fox lands. */}
      {STEPS.map((s) => (
        <g key={s.y}>
          <rect x={s.x - 46} y={s.y} width="92" height="17" rx="4" fill={WOOD} stroke={INK} strokeWidth="4" />
          <path d={`M${s.x - 38} ${s.y + 12} H${s.x + 38}`} stroke={WOOD_DARK} strokeWidth="3" strokeLinecap="round" />
          <circle cx={s.x + (s.x < x ? 26 : -26)} cy={s.y + 8} r="3.5" fill="#495057" />
          <circle cx={s.x + (s.x < x ? 38 : -38)} cy={s.y + 8} r="3.5" fill="#495057" />
        </g>
      ))}
      {/* The braces holding the floor. */}
      <path d={`M${DECK.left + 40} ${DECK.y + 22} L${x - half + 2} ${DECK.y + 120}`} stroke={INK} strokeWidth="18" strokeLinecap="round" />
      <path d={`M${DECK.left + 40} ${DECK.y + 22} L${x - half + 2} ${DECK.y + 120}`} stroke={WOOD_DARK} strokeWidth="10" strokeLinecap="round" />
      <path d={`M${DECK.right - 30} ${DECK.y + 22} L${x + half - 2} ${DECK.y + 140}`} stroke={INK} strokeWidth="18" strokeLinecap="round" />
      <path d={`M${DECK.right - 30} ${DECK.y + 22} L${x + half - 2} ${DECK.y + 140}`} stroke={WOOD_DARK} strokeWidth="10" strokeLinecap="round" />
      {/* The hut: plank walls, a round window, a door, a red roof with a flag on top. */}
      <rect x={hut.left} y={hut.top} width={hut.right - hut.left} height={DECK.y - hut.top} fill="#e8b27a" stroke={INK} strokeWidth="5" />
      {[3805, 3835, 3865, 3895].map((y) => (
        <path key={y} d={`M${hut.left + 4} ${y} H${hut.right - 4}`} stroke={WOOD_DARK} strokeWidth="3" />
      ))}
      <circle cx={hut.left + 38} cy="3832" r="20" fill="#fff3bf" stroke={INK} strokeWidth="5" />
      <path d={`M${hut.left + 38} 3812 V3852 M${hut.left + 18} 3832 H${hut.left + 58}`} stroke={INK} strokeWidth="3" />
      <rect x={hut.right - 54} y="3838" width="40" height={DECK.y - 3838} rx="10" fill="#c3fae8" stroke={INK} strokeWidth="4" />
      <circle cx={hut.right - 22} cy="3880" r="3.5" fill={INK} />
      <path
        d={`M${hut.left - 16} ${hut.top + 6} L${(hut.left + hut.right) / 2} 3694 L${hut.right + 16} ${hut.top + 6} Z`}
        fill="#e03131"
        stroke={INK}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d={`M${hut.left + 20} ${hut.top - 14} L${(hut.left + hut.right) / 2} 3716 L${hut.right - 20} ${hut.top - 14}`}
        fill="none"
        stroke="#ff8787"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d={`M${(hut.left + hut.right) / 2} 3696 V3640`} stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path
        d={`M${(hut.left + hut.right) / 2} 3642 L${(hut.left + hut.right) / 2 + 34} 3652 L${(hut.left + hut.right) / 2} 3664 Z`}
        fill="#ffd43b"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* The floor of boards, open where the hatch is, its lid standing up against the trunk. */}
      {[
        [DECK.left, HATCH.left],
        [HATCH.right, DECK.right],
      ].map(([a, b]) => (
        <g key={a}>
          <rect x={a} y={DECK.y} width={b - a} height="24" rx="4" fill={WOOD} stroke={INK} strokeWidth="5" />
          {Array.from({ length: Math.floor((b - a) / 44) }, (_, i) => (
            <path key={i} d={`M${a + 44 * (i + 1)} ${DECK.y + 4} V${DECK.y + 20}`} stroke={WOOD_DARK} strokeWidth="3" />
          ))}
        </g>
      ))}
      <rect x={HATCH.left - 14} y={DECK.y - 86} width="14" height="90" rx="3" fill={WOOD} stroke={INK} strokeWidth="4" />
      {/* The cable car's post at the floor's right end, with its pulley. */}
      <rect x={ROPE.from.x - 18} y={ROPE.from.y} width="12" height={DECK.y - ROPE.from.y} fill={WOOD_DARK} stroke={INK} strokeWidth="4" />
      <circle cx={ROPE.from.x} cy={ROPE.from.y} r="13" fill="#adb5bd" stroke={INK} strokeWidth="4" />
      {/* Its roots reaching into the meadow. */}
      <g fill="none" stroke="#7a4a22" strokeWidth="12" strokeLinecap="round">
        <path d={`M${x - 20} ${GROUND + 10} Q${x - 90} ${GROUND + 120} ${x - 170} ${GROUND + 170}`} />
        <path d={`M${x} ${GROUND + 10} Q${x + 10} ${GROUND + 160} ${x - 30} ${GROUND + 280}`} />
        <path d={`M${x + 20} ${GROUND + 10} Q${x + 80} ${GROUND + 90} ${x + 160} ${GROUND + 130}`} />
      </g>
    </g>
  );
}

/** The tree's round crown, four circles of leaves with light on them, in world units. */
const CROWN = [
  { cx: TREE.x - 70, cy: 3660, r: 170 },
  { cx: TREE.x + 120, cy: 3700, r: 150 },
  { cx: TREE.x + 20, cy: 3540, r: 165 },
  { cx: TREE.x - 210, cy: 3760, r: 105 },
] as const;
const CROWN_BOX = { x: 335, y: 3365, w: 605, h: 510 } as const;

/**
 * The tree's crown, a layer of its own behind the trunk and the treehouse, swaying gently in the wind about the trunk's
 * top (`tm-jump-sway`) – the house and its steps stay still, nailed to the trunk. Drawn once.
 */
const TreeCrown = memo(function TreeCrown() {
  const { x, y, w, h } = CROWN_BOX;
  return (
    <At x={x} y={y} w={w} h={h} className="tm-back tm-jump-crown" style={{ transformOrigin: `${(((TREE.x - x) / w) * 100).toFixed(1)}% 100%` }}>
      <svg viewBox={`${x} ${y} ${w} ${h}`} preserveAspectRatio="none">
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
          [470, 3640],
          [640, 3470],
          [760, 3610],
          [560, 3560],
          [830, 3740],
          [380, 3780],
        ].map(([cx, cy]) => (
          <circle key={`${cx},${cy}`} cx={cx} cy={cy} r="12" fill="#2f9e44" />
        ))}
      </svg>
    </At>
  );
});

/**
 * The land: far hills behind the lake, the skyscraper and the tree with its treehouse on the meadow, the cable car's
 * rope between them, the lake on the left with its floor, seaweed and a starfish (its fish and bubbles move in
 * `LakeLife`), and the meadow with its earth. Drawn once.
 */
const Land = memo(function Land() {
  const top = 1760;
  return (
    <Band top={top} h={WORLD_H - top} className="tm-back">
      {/* Far hills behind the lake and the meadow. */}
      <path
        d={`M-30 ${SURFACE + 2} Q80 4560 260 4620 Q400 4540 560 4640 Q700 4560 900 4650 V${SURFACE + 2} Z`}
        fill="#b2f2bb"
        stroke="#8ce99a"
        strokeWidth="5"
      />
      <Skyscraper />
      <Tree />
      {/* The rope from the treehouse's pulley to the window's. */}
      <path d={`M${ROPE.from.x} ${ROPE.from.y} L${ROPE.to.x + 4} ${ROPE.to.y}`} stroke={INK} strokeWidth="5" strokeLinecap="round" />
      {/* The lake from the left to the shore and down to its sandy floor, with soft light on top. */}
      <rect x={-30} y={SURFACE} width={SHORE + 60} height={WORLD_H - SURFACE + 10} fill="#4dabf7" />
      <rect x={-30} y={SURFACE - 4} width={SHORE + 30} height="14" fill="#a5d8ff" />
      <path d={`M-30 5300 Q160 5270 300 5300 Q400 5320 ${SHORE - 40} 5290 V${WORLD_H + 10} H-30 Z`} fill="#ffe8a1" stroke="#e0b860" strokeWidth="5" />
      {[
        [80, 5300, 1],
        [160, 5290, -1],
        [440, 5300, 1],
      ].map(([x, y, s]) => (
        <path key={x} d={`M${x} ${y} q${14 * s} -50 0 -100 q${-14 * s} -50 0 -100`} fill="none" stroke="#2f9e44" strokeWidth="9" strokeLinecap="round" />
      ))}
      {/* A starfish on the floor. */}
      <path d="M250 5272 l9 18 20 2 -15 13 5 20 -19 -10 -19 10 5 -20 -15 -13 20 -2 Z" fill="#ff922b" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {/* The meadow and the earth under it, its bank sloping down into the lake. */}
      <path
        d={`M${SHORE} ${GROUND} H1630 V${WORLD_H + 10} H${SHORE - 90} Q${SHORE - 40} ${GROUND + 160} ${SHORE} ${GROUND} Z`}
        fill={EARTH}
        stroke={INK}
        strokeWidth="5"
      />
      {[
        [620, 4900],
        [900, 4960],
        [1180, 5060],
        [1420, 4900],
        [760, 5200],
        [1300, 5300],
      ].map(([x, y]) => (
        <ellipse key={`${x},${y}`} cx={x} cy={y} rx="16" ry="10" fill={EARTH_DARK} />
      ))}
      {[
        [1000, 5120, 34, 22],
        [1460, 5180, 44, 28],
        [600, 5320, 30, 20],
      ].map(([x, y, rx, ry]) => (
        <ellipse key={x} cx={x} cy={y} rx={rx} ry={ry} fill="#ced4da" stroke={INK} strokeWidth="4" />
      ))}
      <path
        d={`M${SHORE - 6} ${GROUND + 26} Q${SHORE - 14} ${GROUND + 4} ${SHORE - 6} ${GROUND - 10} H1630 V${GROUND + 26} Z`}
        fill={GRASS}
        stroke={INK}
        strokeWidth="5"
      />
      <rect x={SHORE + 4} y={GROUND - 4} width={1600 - SHORE} height="6" fill={GRASS_LIGHT} />
      {/* Flowers on the meadow. */}
      {[
        [548, "#ff8787"],
        [1066, "#ffd43b"],
        [1450, "#f783ac"],
        [1530, "#ff8787"],
      ].map(([x, c]) => (
        <g key={x as number}>
          <path d={`M${x} ${GROUND} V${GROUND - 26}`} stroke="#2f9e44" strokeWidth="4" />
          <circle cx={x as number} cy={GROUND - 30} r="10" fill={c as string} stroke={INK} strokeWidth="3" />
        </g>
      ))}
    </Band>
  );
});

/** A star of space with four points, `r` = 1, centred on 0 0. */
const SPACE_STAR = "M0 -2 Q0 0 2 0 Q0 0 0 2 Q0 0 -2 0 Q0 0 0 -2 Z";

/** The birds over the land: where each starts (world units), how far it flies (+ to the right) and in how many seconds. */
const BIRDS = [
  { x: -90, y: 3260, dx: 1780, s: 30, delay: 4 },
  { x: 1690, y: 2860, dx: -1780, s: 36, delay: 19 },
  { x: -90, y: 2420, dx: 1780, s: 27, delay: 12 },
] as const;
const BIRD = { w: 70, h: 40 } as const;

/** Puffs of wind drifting through the sky: where each starts, and its seconds. */
const WINDS = [
  { x: 120, y: 1480, s: 11, delay: 2 },
  { x: 820, y: 1950, s: 13, delay: 7 },
  { x: 260, y: 2560, s: 12, delay: 0 },
  { x: 900, y: 3080, s: 14, delay: 5 },
  { x: 140, y: 3480, s: 12, delay: 9 },
] as const;
const WIND = { w: 240, h: 70, dx: 260 } as const;

/** The lake's two fish: their spot, how far they swim and back (+ to the right first), in how many seconds. */
const FISH = [
  { x: 60, y: 5040, dx: 300, s: 15, color: "#ffd43b", delay: 0 },
  { x: 360, y: 4880, dx: -290, s: 19, color: "#ff8787", delay: 6 },
] as const;
const FISH_BOX = { w: 70, h: 40 } as const;

/** Bubbles rising from the lake's floor to its top: x, the floor they start from, size and seconds. */
const BUBBLES = [
  { x: 380, from: 5250, r: 9, s: 7, delay: 0 },
  { x: 270, from: 5230, r: 7, s: 9, delay: 3 },
  { x: 150, from: 5260, r: 8, s: 8, delay: 5.5 },
] as const;

/**
 * What lives in the sky while the fox climbs (user request, November 2026): the stars of space twinkling and turning,
 * now and then a shooting star, puffs of wind drifting by and birds flapping across behind the tree and the houses.
 * Each a small HTML layer moved by `transform` and `opacity` on a CSS loop of its own; drawn once.
 */
const SkyLife = memo(function SkyLife() {
  return (
    <div className="tm-layer tm-back tm-jump-life" aria-hidden>
      {SPACE_STARS.map(([x, y, r], i) => (
        <At
          key={`${x},${y}`}
          x={x - 2 * r}
          y={y - 2 * r}
          w={4 * r}
          h={4 * r}
          className="tm-jump-twinkle"
          style={{ animationDuration: `${5 + (i % 4) * 1.5}s`, animationDelay: `${-((i * 1.7) % 6)}s` }}
        >
          <svg viewBox="-2 -2 4 4">
            <path d={SPACE_STAR} fill="#fff3bf" />
          </svg>
        </At>
      ))}
      <At x={60} y={40} w={160} h={60} className="tm-jump-comet">
        <svg viewBox="0 0 160 60">
          <defs>
            <linearGradient id="tm-jump-comet-tail" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fff3bf" stopOpacity="0" />
              <stop offset="1" stopColor="#fff3bf" />
            </linearGradient>
          </defs>
          <path d="M8 6 L150 54" stroke="url(#tm-jump-comet-tail)" strokeWidth="6" strokeLinecap="round" />
          <circle cx="150" cy="54" r="6" fill="#fff9db" />
        </svg>
      </At>
      {WINDS.map((w) => (
        <At
          key={w.y}
          x={w.x}
          y={w.y}
          w={WIND.w}
          h={WIND.h}
          className="tm-jump-wind"
          style={{ animationDuration: `${w.s}s`, animationDelay: `${-w.delay}s` } as CSSProperties}
        >
          <svg viewBox={`0 0 ${WIND.w} ${WIND.h}`}>
            <path d="M6 30 H160 Q196 30 196 14 Q196 4 184 4 Q172 4 174 16" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
            <path d="M40 52 H210 Q232 52 232 62" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </At>
      ))}
      {BIRDS.map((b) => (
        <At
          key={b.y}
          x={b.x}
          y={b.y}
          w={BIRD.w}
          h={BIRD.h}
          className="tm-jump-bird"
          style={
            {
              "--tm-dx": `${((b.dx / BIRD.w) * 100).toFixed(0)}%`,
              animationDuration: `${b.s}s`,
              animationDelay: `${-b.delay}s`,
            } as CSSProperties
          }
        >
          <div className="tm-jump-wing" style={{ animationDuration: `${0.42 + (b.y % 3) * 0.06}s` }}>
            <svg viewBox={`0 0 ${BIRD.w} ${BIRD.h}`}>
              <path d="M4 22 Q18 6 35 22 Q52 6 66 22" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </At>
      ))}
    </div>
  );
});

/**
 * What lives in the lake: two little fish swimming to and fro, turning at each end, and bubbles rising to the top.
 * Small HTML layers on CSS loops, behind the fox and under the water's tint; drawn once.
 */
const LakeLife = memo(function LakeLife() {
  return (
    <div className="tm-layer tm-back tm-jump-life" aria-hidden>
      {FISH.map((f) => (
        <At
          key={f.y}
          x={f.x}
          y={f.y - FISH_BOX.h / 2}
          w={FISH_BOX.w}
          h={FISH_BOX.h}
          className="tm-jump-fish"
          style={
            {
              "--tm-dx": `${((f.dx / FISH_BOX.w) * 100).toFixed(0)}%`,
              "--tm-face": Math.sign(f.dx),
              animationDuration: `${f.s}s`,
              animationDelay: `${-f.delay}s`,
            } as CSSProperties
          }
        >
          <svg viewBox="-50 -28 100 56">
            <path d="M-30 0 Q0 -24 30 0 Q0 24 -30 0 Z M-30 0 L-48 -14 V14 Z" fill={f.color} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <circle cx="16" cy="-4" r="4" fill={INK} />
          </svg>
        </At>
      ))}
      {BUBBLES.map((b) => (
        <At
          key={b.x}
          x={b.x - b.r}
          y={b.from - b.r}
          w={2 * b.r}
          h={2 * b.r}
          className="tm-jump-bubble"
          style={
            {
              "--tm-dy": `${(((SURFACE + 16 - b.from) / (2 * b.r)) * 100).toFixed(0)}%`,
              animationDuration: `${b.s}s`,
              animationDelay: `${-b.delay}s`,
            } as CSSProperties
          }
        >
          <svg viewBox="-10 -10 20 20">
            <circle r="8" fill="none" stroke="#d0ebff" strokeWidth="3" />
          </svg>
        </At>
      ))}
    </div>
  );
});

/** The lake's water in front of the fox while it swims, a pale tint, so it is plainly under water. Drawn once. */
const WaterFront = memo(function WaterFront() {
  return <At x={0} y={SURFACE + 6} w={SHORE - 50} h={WORLD_H - SURFACE - 6} className="tm-jump-water" />;
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
      {/* The upper tier's icing, lying over the fox's feet once it has landed in the cake. */}
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

/** The cake's layers: its body behind the fox, the upper icing in front of it, the cherry (gone once it is landed on), and the smashed cake that takes their place at the end. */
const CAKE_BOX = cakeBox(CAKE.x - 110, CAKE_ART.top - 40, 220, GROUND - CAKE_ART.top + 50);

const Cake = memo(function Cake() {
  return (
    <>
      <At {...CAKE_BOX} className="tm-jump-cake-whole">
        <CakeArt />
      </At>
      <At {...CAKE_BOX} className="tm-jump-cake-smashed">
        <SmashedCakeArt />
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
      <At {...CAKE_BOX} className="tm-jump-cake-whole">
        <CakeArt front />
      </At>
      <At {...CAKE_BOX} className="tm-jump-cake-smashed">
        <SmashedCakeArt front />
      </At>
    </>
  );
});

/**
 * The cake once the fox has dropped into it (user feedback, 23 November 2026: it should be broken all over): the
 * upper tier burst apart, the lower one cracked with a jagged crater where the fox sits, cream and icing smeared down
 * its sides and crumbs on the plate; `front` is the crater's broken rim lying over the fox's feet. In the cake's own
 * units, like `CakeArt`.
 */
function SmashedCakeArt({ front }: { front?: boolean }) {
  const { top } = CAKE_ART;
  const x = CAKE.x;
  if (front)
    return (
      <svg viewBox={`${x - 110} ${top - 40} 220 ${GROUND - top + 50}`} preserveAspectRatio="none">
        <path
          d={`M${x - 44} ${top + 60} L${x - 40} ${top + 34} L${x - 28} ${top + 40} L${x - 18} ${top + 28} L${x - 6} ${top + 38} L${x + 6} ${top + 26} L${x + 18} ${top + 36} L${x + 30} ${top + 30} L${x + 42} ${top + 42} L${x + 46} ${top + 60} Z`}
          fill="#ffe3e3"
          stroke={INK}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        {[-30, -8, 16, 36].map((dx, i) => (
          <circle key={dx} cx={x + dx} cy={top + 34 - (i % 2) * 4} r={8 + (i % 2) * 3} fill="#fff" stroke={INK} strokeWidth="3" />
        ))}
        <path d={`M${x - 36} ${top + 48} l10 -5 8 6 10 -6 8 5`} fill="none" stroke="#f783ac" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  const jag = [
    [-85, 92],
    [-76, 66],
    [-62, 76],
    [-50, 52],
    [-36, 64],
    [-22, 48],
    [-8, 58],
    [8, 46],
    [24, 60],
    [38, 50],
    [52, 66],
    [66, 56],
    [78, 72],
    [85, 94],
  ];
  return (
    <svg viewBox={`${x - 110} ${top - 40} 220 ${GROUND - top + 50}`} preserveAspectRatio="none">
      {/* The plate, cracked, with crumbs and cream all round on it. */}
      <ellipse cx={x} cy={GROUND - 2} rx="109" ry="12" fill="#e9ecef" stroke={INK} strokeWidth="4" />
      <path d={`M${x + 60} ${GROUND - 12} l-8 8 6 4 -6 8`} fill="none" stroke={INK} strokeWidth="2.5" />
      {/* The lower tier, broken open at the top, leaning a little, with a crack down its side. */}
      <path
        d={`M${x - 85} ${GROUND - 6} ${jag.map(([dx, dy]) => `L${x + dx} ${top + dy}`).join(" ")} L${x + 85} ${GROUND - 6} Z`}
        fill="#ffe3e3"
        stroke={INK}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path d={`M${x - 8} ${top + 58} V${top + 66} L${x + 4} ${top + 64}`} fill="#ffd8a8" />
      <path d={`M${x - 50} ${top + 54} l6 18 -8 14 7 20 -5 14`} fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M${x + 52} ${top + 68} l-5 16 7 14 -6 18`} fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Its pink icing torn into pieces, sliding down. */}
      {[
        [-80, 80, 26],
        [-42, 74, 20],
        [10, 70, 30],
        [56, 82, 22],
      ].map(([dx, dy, w]) => (
        <path
          key={dx}
          d={`M${x + dx} ${top + dy} h${w} l-3 12 q-${w / 4} 10 -${w / 2} 2 q-${w / 4} 12 -${w / 2 - 3} -2 Z`}
          fill="#f783ac"
          stroke={INK}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      ))}
      {/* Cream running down its sides. */}
      {[
        [-70, 70, 34],
        [-20, 54, 46],
        [30, 60, 40],
        [70, 64, 30],
      ].map(([dx, dy, h]) => (
        <path key={dx} d={`M${x + dx - 8} ${top + dy} q8 -8 16 0 v${h} q-8 8 -16 0 Z`} fill="#fff" stroke={INK} strokeWidth="2.5" opacity="0.95" />
      ))}
      {/* What is left of the upper tier: two broken lumps lying askew beside the fox. */}
      <path
        d={`M${x - 66} ${top + 50} L${x - 70} ${top + 22} L${x - 50} ${top + 12} L${x - 30} ${top + 20} L${x - 28} ${top + 48} Z`}
        fill="#fff0f6"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d={`M${x - 70} ${top + 22} L${x - 50} ${top + 12} L${x - 30} ${top + 20} L${x - 34} ${top + 30} L${x - 52} ${top + 24} Z`} fill="#f783ac" />
      <path
        d={`M${x + 28} ${top + 50} L${x + 26} ${top + 18} L${x + 48} ${top + 24} L${x + 68} ${top + 16} L${x + 70} ${top + 48} Z`}
        fill="#fff0f6"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d={`M${x + 26} ${top + 18} L${x + 48} ${top + 24} L${x + 68} ${top + 16} L${x + 66} ${top + 28} L${x + 30} ${top + 30} Z`} fill="#f783ac" />
      {/* Crumbs and blobs of cream on the plate round its foot. */}
      {[
        [-100, -10, 9, "#fff"],
        [-92, -4, 6, "#ffe3e3"],
        [96, -8, 10, "#fff"],
        [102, -2, 6, "#f783ac"],
        [-60, 2, 7, "#ffe3e3"],
        [64, 4, 8, "#fff"],
      ].map(([dx, dy, r, c]) => (
        <circle key={`${dx},${dy}`} cx={x + (dx as number)} cy={GROUND + (dy as number)} r={r as number} fill={c as string} stroke={INK} strokeWidth="2.5" />
      ))}
    </svg>
  );
}

/** What a piece flying out of the cake is: a blob of cream, a chunk of sponge with icing, a shard of icing, a crumb, a splat stuck on a wall or trunk, or the cherry. */
type BitKind = "cream" | "sponge" | "icing" | "crumb" | "splat" | "cherry";

/**
 * Where the pieces of the cake land as the fox drops into it, in all directions (user feedback, 23 November 2026: the
 * cake should be broken and scattered everywhere): on the meadow to both sides, floating far off on the lake, on the
 * bank, on a step of the tree, stuck on its trunk and on the skyscraper's wall. Each its middle, size and kind.
 */
export const BITS: readonly { x: number; y: number; size: number; kind: BitKind }[] = [
  // Far left, floating on the lake.
  { x: 270, y: SURFACE, size: 40, kind: "sponge" },
  { x: 345, y: SURFACE, size: 34, kind: "cream" },
  { x: 415, y: SURFACE, size: 30, kind: "icing" },
  // On the meadow by the tree and between it and the cake, and the cherry on one of its steps.
  { x: 552, y: GROUND - 14, size: 38, kind: "cream" },
  { x: 595, y: GROUND - 6, size: 16, kind: "crumb" },
  { x: 770, y: GROUND - 8, size: 22, kind: "crumb" },
  { x: STEPS[2].x, y: STEPS[2].y - 14, size: 30, kind: "cherry" },
  // Stuck on the tree's trunk.
  { x: 650, y: 4420, size: 46, kind: "splat" },
  { x: 676, y: 4560, size: 34, kind: "splat" },
  { x: 640, y: 4290, size: 38, kind: "splat" },
  // On the meadow right of it, in front of the skyscraper.
  { x: 1040, y: GROUND - 8, size: 18, kind: "crumb" },
  { x: 1080, y: GROUND - 16, size: 42, kind: "sponge" },
  { x: 1145, y: GROUND - 6, size: 18, kind: "crumb" },
  { x: 1210, y: GROUND - 16, size: 46, kind: "cream" },
  { x: 1270, y: GROUND - 12, size: 34, kind: "icing" },
  { x: 1318, y: GROUND - 6, size: 16, kind: "crumb" },
  // Stuck on the skyscraper's wall and its glass shaft, high above.
  { x: 1120, y: 4110, size: 38, kind: "splat" },
  { x: 1140, y: 4330, size: 52, kind: "splat" },
  { x: 1250, y: 4200, size: 46, kind: "splat" },
  { x: 1310, y: 4420, size: 44, kind: "splat" },
  { x: 1180, y: 4560, size: 40, kind: "splat" },
  { x: 1290, y: 4620, size: 36, kind: "splat" },
];

/** Where the pieces fly from: the cake's top, as the fox lands in it. */
export const BURST = { x: CAKE.x, y: CAKE.top + 20 } as const;

/** One piece's drawing in its box `0 0 100 100`. */
function BitArt({ kind }: { kind: BitKind }) {
  if (kind === "cherry")
    return (
      <svg viewBox="0 0 100 100">
        <path d="M50 52 Q56 18 80 6" fill="none" stroke="#2f9e44" strokeWidth="8" strokeLinecap="round" />
        <circle cx="46" cy="64" r="32" fill="#e03131" stroke={INK} strokeWidth="7" />
        <circle cx="34" cy="52" r="8" fill="#ffc9c9" />
      </svg>
    );
  if (kind === "sponge")
    return (
      <svg viewBox="0 0 100 100">
        <path d="M8 34 L30 20 L62 26 L92 16 L90 84 L12 90 Z" fill="#ffe3e3" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
        <path d="M8 34 L30 20 L62 26 L92 16 L91 36 Q70 46 52 38 Q30 48 9 46 Z" fill="#f783ac" />
        <circle cx="38" cy="62" r="4" fill="#ffd8a8" />
        <circle cx="64" cy="70" r="3" fill="#ffd8a8" />
        <circle cx="54" cy="18" r="12" fill="#fff" stroke={INK} strokeWidth="5" />
      </svg>
    );
  if (kind === "icing")
    return (
      <svg viewBox="0 0 100 100">
        <path d="M6 40 L44 22 L94 34 L78 58 Q60 76 46 60 Q30 78 14 62 Z" fill="#f783ac" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
        <path d="M30 38 Q46 30 62 36" fill="none" stroke="#fcc2d7" strokeWidth="6" strokeLinecap="round" />
      </svg>
    );
  if (kind === "crumb")
    return (
      <svg viewBox="0 0 100 100">
        <path d="M14 30 L60 10 L90 50 L56 92 L10 70 Z" fill="#ffe3e3" stroke={INK} strokeWidth="10" strokeLinejoin="round" />
      </svg>
    );
  if (kind === "splat")
    return (
      <svg viewBox="0 0 100 100">
        <path
          d="M50 10 Q60 28 74 14 Q74 34 92 34 Q78 46 90 62 Q70 60 66 76 L64 96 Q56 98 56 78 Q48 92 36 80 Q38 64 18 70 Q26 54 8 44 Q28 38 22 20 Q40 30 50 10 Z"
          fill="#fff"
          stroke={INK}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <circle cx="44" cy="48" r="9" fill="#f783ac" />
        <circle cx="62" cy="40" r="5" fill="#ffe3e3" stroke={INK} strokeWidth="2" />
      </svg>
    );
  return (
    <svg viewBox="0 0 100 100">
      <path d="M10 78 Q4 56 24 50 Q20 26 44 26 Q52 6 70 22 Q92 24 86 48 Q98 64 84 80 Z" fill="#fff" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
      <path d="M34 56 Q46 44 60 52" fill="none" stroke="#dee2e6" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * The pieces of the cake flying out as the fox lands in it, shown only at the end (`.tm-done`): each a small layer at
 * its landing place, thrown there once from the cake's top in an arc, turning as it flies – three nested layers moved
 * by `transform` alone (across, up and down, turning), then still.
 */
const CakeBits = memo(function CakeBits() {
  return (
    <div className="tm-jump-bits">
      {BITS.map((b, i) => {
        const pct = (d: number) => `${((d / b.size) * 100).toFixed(1)}%`;
        const far = Math.hypot(b.x - BURST.x, b.y - BURST.y);
        const peak = Math.min(b.y, BURST.y) - 90 - far * 0.35;
        const spin = (i % 2 ? 1 : -1) * (200 + (i % 4) * 90);
        const style = {
          "--fx": pct(BURST.x - b.x),
          "--fy": pct(BURST.y - b.y),
          "--py": pct(peak - b.y),
          "--spin": `${spin}deg`,
          "--rest": `${((i * 47) % 60) - 30}deg`,
          "--tm-fly": `${Math.round(620 + far * 0.45)}ms`,
          "--tm-delay": `${(i % 6) * 35}ms`,
        } as CSSProperties;
        return (
          <At key={`${b.x},${b.y}`} x={b.x - b.size / 2} y={b.y - b.size / 2} w={b.size} h={b.size} style={style}>
            <div className="tm-jump-bit-x">
              <div className="tm-jump-bit-y">
                <div className="tm-jump-bit-spin">
                  <BitArt kind={b.kind} />
                </div>
              </div>
            </div>
          </At>
        );
      })}
    </div>
  );
});

/** Where the fox's paws hold on in the `hang` pose, in its own units: the balloons' strings and the parachute's cords end there. */
const PAWS = {
  left: { x: HANG_PAWS.left[0] * RUNNER, y: HANG_PAWS.left[1] * RUNNER },
  right: { x: HANG_PAWS.right[0] * RUNNER, y: HANG_PAWS.right[1] * RUNNER },
};

/** The box of the balloons it holds, in its own units round it. */
const HELD = { x: -50, y: -240, w: 220, h: 300 } as const;

/** The balloons it hangs from, the strings of two in its left paw and of one in its right, in its own units (`HELD`). */
function HeldBalloonsArt() {
  return (
    <svg viewBox={`${HELD.x} ${HELD.y} ${HELD.w} ${HELD.h}`}>
      {[
        [8, -138, "#ff6b6b", PAWS.left],
        [112, -142, "#4dabf7", PAWS.right],
        [58, -186, "#ffd43b", PAWS.left],
      ].map(([x, y, c, paw]) => {
        const [bx, by, p] = [x as number, y as number, paw as { x: number; y: number }];
        return (
          <g key={c as string}>
            <path d={`M${bx} ${by + 40} Q${(bx + p.x) / 2 + 8} ${(by + p.y) / 2} ${p.x} ${p.y}`} fill="none" stroke={INK} strokeWidth="2.5" />
            <ellipse cx={bx} cy={by} rx="32" ry="39" fill={c as string} stroke={INK} strokeWidth="4" />
            <ellipse cx={bx - 11} cy={by - 14} rx="7" ry="11" fill="#fff" opacity="0.6" />
            <path d={`M${bx - 5} ${by + 38} l5 6 5 -6 Z`} fill={c as string} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          </g>
        );
      })}
    </svg>
  );
}

/** The parachute over the fox, red and white, its cords meeting at the two points it holds, in its box `0 0 164 170`. */
function ParachuteArt() {
  const rim = [6, 44, 82, 120, 158];
  return (
    <svg viewBox="0 0 164 170">
      {PARACHUTE_HOLDS.map((x) => (
        <g key={x}>
          {rim.map((r) => (
            <path key={r} d={`M${r} 66 L${x} 166`} stroke={INK} strokeWidth="2" opacity="0.7" />
          ))}
        </g>
      ))}
      <path
        d="M6 66 Q6 4 82 4 Q158 4 158 66 Q139 54 120 66 Q101 54 82 66 Q63 54 44 66 Q25 54 6 66 Z"
        fill="#fff"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M44 66 Q38 20 82 4 Q63 22 63 60 Q54 56 44 66 Z M120 66 Q126 20 82 4 Q101 22 101 60 Q110 56 120 66 Z" fill="#ff6b6b" />
      <path d="M6 66 Q6 4 82 4 Q158 4 158 66" fill="none" stroke={INK} strokeWidth="4" />
      <path d="M30 30 Q46 14 66 12" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

/** Where the parachute's cords meet (across its box, at its foot), and the box placed so that they meet in the fox's paws. */
const PARACHUTE_HOLDS = [54, 110] as const;
const CHUTE_SCALE = (PAWS.right.x - PAWS.left.x) / (PARACHUTE_HOLDS[1] - PARACHUTE_HOLDS[0]);
const CHUTE = { x: PAWS.left.x - PARACHUTE_HOLDS[0] * CHUTE_SCALE, y: PAWS.left.y - 166 * CHUTE_SCALE, w: 164 * CHUTE_SCALE, h: 170 * CHUTE_SCALE } as const;

/** A box in the fox's own units (`RUNNER`), as % of its layer. */
const ownBox = (x: number, y: number, w: number, h: number): CSSProperties => {
  const pct = (v: number) => `${((v / RUNNER) * 100).toFixed(2)}%`;
  return { position: "absolute", left: pct(x), top: pct(y), width: pct(w), height: pct(h) };
};

/** A layer standing where the fox stands on spot `k`, facing the way it arrives there – so what is drawn in it lies where the fox will hold it. */
function AsFoxAt({ k, className, style, children }: { k: number; className?: string; style?: CSSProperties; children: ReactNode }) {
  const at = SPOTS[k];
  return (
    <At x={at.x - RUNNER / 2} y={at.y - RUNNER} w={RUNNER} h={RUNNER} className={className} style={style}>
      <div className="tm-jump-part" style={{ transform: `scaleX(${facingAt(k)})` }}>
        {children}
      </div>
    </At>
  );
}

/**
 * The balloons waiting on the skyscraper's roof, tied to the crossbar of a little wooden stand exactly where the fox's
 * paws will take their strings, and the jetpack sitting on the highest cloud right where the fox's back will be – each
 * the very thing the fox then takes (`gearLooks`). The stand stays on the roof.
 */
const Waiting = memo(function Waiting() {
  const gear = (g: Gear) => ({ "--tm-anim": `tm-jump-${g}`, "--tm-end-o": 0 }) as CSSProperties;
  const bar = PAWS.left.y;
  return (
    <>
      <AsFoxAt k={BALLOONS_FROM}>
        <svg viewBox={`0 0 ${RUNNER} ${RUNNER}`} style={ownBox(0, 0, RUNNER, RUNNER)}>
          {[PAWS.left.x, PAWS.right.x].map((x) => (
            <rect key={x} x={x - 4} y={bar - 4} width="8" height={RUNNER - bar + 4} rx="3" fill={WOOD} stroke={INK} strokeWidth="3" />
          ))}
          <rect x={PAWS.left.x - 10} y={bar - 6} width={PAWS.right.x - PAWS.left.x + 20} height="9" rx="4" fill={WOOD_DARK} stroke={INK} strokeWidth="3" />
        </svg>
      </AsFoxAt>
      <AsFoxAt k={BALLOONS_FROM} className="tm-jump-fade" style={gear("waiting-balloons")}>
        <div className="tm-jump-carried" style={ownBox(HELD.x, HELD.y, HELD.w, HELD.h)}>
          <HeldBalloonsArt />
        </div>
      </AsFoxAt>
      <AsFoxAt k={JETPACK_FROM} className="tm-jump-fade" style={gear("waiting-jetpack")}>
        <FoxJetpack />
      </AsFoxAt>
    </>
  );
});

/**
 * The cable car's basket in its box (`BASKET`, the fox's feet at its floor): `back` is the hook running on the rope, the
 * rods down to the basket and its inner side, behind the fox; the front is the woven wall it looks out over.
 */
function BasketArt({ front }: { front?: boolean }) {
  const { w, foot } = BASKET;
  // Low enough that the fox shows from the chest up, its paw on the rim.
  const rim = foot - 32;
  if (front)
    return (
      <svg viewBox={`0 0 ${w} ${BASKET.h}`}>
        <path
          d={`M10 ${rim} H${w - 10} L${w - 18} ${foot + 16} Q${w / 2} ${foot + 26} 18 ${foot + 16} Z`}
          fill="#e9a23b"
          stroke={INK}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        {[rim + 13, rim + 28, rim + 43].map((y) => (
          <path key={y} d={`M16 ${y} Q${w / 2} ${y + 6} ${w - 16} ${y}`} fill="none" stroke="#b97818" strokeWidth="3.5" />
        ))}
        {[34, 58, 82, 106].map((x) => (
          <path key={x} d={`M${x + 6} ${rim + 4} L${x + 2} ${foot + 14}`} stroke="#b97818" strokeWidth="3" />
        ))}
        <rect x="4" y={rim - 8} width={w - 8} height="14" rx="7" fill="#c4772a" stroke={INK} strokeWidth="4" />
      </svg>
    );
  return (
    <svg viewBox={`0 0 ${w} ${BASKET.h}`}>
      {/* The hook's two wheels on the rope, and its rods down to the basket's corners. */}
      <path
        d={`M${w / 2} ${foot - HANG} V${foot - HANG + 26} M${w / 2} ${foot - HANG + 26} L12 ${rim} M${w / 2} ${foot - HANG + 26} L${w - 12} ${rim}`}
        fill="none"
        stroke={INK}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d={`M${w / 2} ${foot - HANG + 26} L12 ${rim} M${w / 2} ${foot - HANG + 26} L${w - 12} ${rim}`}
        fill="none"
        stroke="#868e96"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <rect x={w / 2 - 22} y={foot - HANG - 10} width="44" height="18" rx="6" fill="#495057" stroke={INK} strokeWidth="4" />
      <circle cx={w / 2 - 11} cy={foot - HANG - 4} r="7" fill="#adb5bd" stroke={INK} strokeWidth="3" />
      <circle cx={w / 2 + 11} cy={foot - HANG - 4} r="7" fill="#adb5bd" stroke={INK} strokeWidth="3" />
      {/* The basket's far side, seen over its front. */}
      <path
        d={`M10 ${rim} Q${w / 2} ${rim - 14} ${w - 10} ${rim} L${w - 14} ${rim + 20} H14 Z`}
        fill="#b97818"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The lift's cabin in its box (`CABIN`, the fox's feet on its floor): `back` is its back wall with a warm lamp, its
 * floor and lamp (the rope runs in the shaft, drawn with the house, so none pokes out above the roof); the front is its glass door in a frame, the fox seen through it.
 */
function CabinArt({ front }: { front?: boolean }) {
  const { w, h, foot } = CABIN;
  if (front)
    return (
      <svg viewBox={`0 0 ${w} ${h}`}>
        <rect x="12" y="20" width={w - 24} height={foot - 20} fill="#e7f5ff" fillOpacity="0.28" stroke="#5c7cfa" strokeWidth="6" />
        <path d={`M${w / 2} 22 V${foot - 2}`} stroke="#5c7cfa" strokeWidth="4" />
        <path d={`M28 40 L46 ${foot - 40} M38 34 L50 70`} stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.55" />
        <rect x="4" y="8" width={w - 8} height="18" rx="5" fill="#5c7cfa" stroke={INK} strokeWidth="4" />
        <rect x="4" y={foot} width={w - 8} height="12" rx="3" fill="#495057" stroke={INK} strokeWidth="4" />
      </svg>
    );
  return (
    <svg viewBox={`0 0 ${w} ${h}`}>
      <rect x="10" y="16" width={w - 20} height={foot - 16} fill="#fff4e6" stroke={INK} strokeWidth="5" />
      <path d={`M10 ${foot - 50} H${w - 10}`} stroke="#ffd8a8" strokeWidth="6" />
      <ellipse cx={w / 2} cy="30" rx="22" ry="8" fill="#ffe066" stroke={INK} strokeWidth="3" />
    </svg>
  );
}

/** A car's layer (`back` behind the fox or the front over it), placed at its waiting spot and moved by its keyframes. */
function CarLayer({ car, name, front }: { car: Car; name: string; front?: boolean }) {
  const at = SPOTS[car.from];
  const Art = car === BASKET ? BasketArt : CabinArt;
  return (
    <At
      x={at.x - car.w / 2}
      y={at.y - car.foot}
      w={car.w}
      h={car.h}
      className="tm-hop tm-jump-car"
      style={{ "--tm-anim": `tm-jump-${name}`, "--tm-end": carShift(car, car.to) } as CSSProperties}
    >
      <Art front={front} />
    </At>
  );
}

/** The cars behind the fox (their back halves) and over it (their fronts). Drawn once. */
const CarsBack = memo(function CarsBack() {
  return (
    <>
      <CarLayer car={BASKET} name="basket" />
      <CarLayer car={CABIN} name="cabin" />
    </>
  );
});

const CarsFront = memo(function CarsFront() {
  return (
    <>
      <CarLayer car={BASKET} name="basket" front />
      <CarLayer car={CABIN} name="cabin" front />
    </>
  );
});

/** The sparkles bursting out of a star as it is caught: where each ends (in % of the star from its middle) and how big it is. */
const SPARKS: readonly [number, number, number][] = [
  [0, -150, 1],
  [130, -80, 0.8],
  [140, 60, 0.9],
  [0, 140, 0.7],
  [-140, 60, 0.9],
  [-130, -80, 0.8],
];

/**
 * The stars still to catch, one over every move of the run, each caught on the way as in a platform game (user request,
 * 23 November 2026, „wie in Spielen, z. B. Super Mario“): it pops up out of the fox's reach turning like a coin, while a
 * ring of light widens and sparkles burst out round it (`Burst`), then it is gone. Two small layers a star, by
 * `transform` and `opacity` – the ring and its sparkles one drawing, never a layer each: 24 stars with eight layers
 * each kept an old phone's main thread twice as busy (`bun run perf timer-mond`). While it hangs a tap lights it (H-51).
 */
const Stars = memo(function Stars({ moves, glow }: { moves: RunMove[]; glow: number }) {
  return (
    <>
      {moves.map((m) => {
        const c = starAt(m.k);
        const at = { "--tm-at": `${m.star}ms` } as CSSProperties;
        return (
          <At key={m.k} x={c.x - STAR / 2} y={c.y - STAR / 2} w={STAR} h={STAR}>
            <div className="tm-jump-burst" style={at}>
              <Burst />
            </div>
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

/**
 * A caught star's ring of light and its six sparkles (white with a golden rim) as they lie at the burst's widest, in %
 * of the star round its middle; the layer grows into it and fades (`tm-jump-burst`).
 */
function Burst() {
  const line = (10 / STAR) * 100;
  return (
    <svg viewBox="-150 -150 300 300">
      <circle r={110 - line / 2} fill="none" stroke="#ffe066" strokeWidth={line} />
      {SPARKS.map(([dx, dy, size]) => (
        <path
          key={`${dx},${dy}`}
          transform={`translate(${dx} ${dy}) scale(${2.5 * size}) translate(-10 -10)`}
          d="M10 0 Q11 9 20 10 Q11 11 10 20 Q9 11 0 10 Q9 9 10 0 Z"
          fill="#fff9db"
          stroke="#fab005"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

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

/** A thing the fox holds: a layer round it in its own units (`x`, `y`, `w`, `h` in the fox's `RUNNER`), coming and going by its keyframes. */
function Carried({
  gear,
  x,
  y,
  w,
  h,
  end,
  origin,
  children,
}: {
  gear: Gear;
  x: number;
  y: number;
  w: number;
  h: number;
  end: number;
  origin?: string;
  children: ReactNode;
}) {
  const pct = (v: number) => `${((v / RUNNER) * 100).toFixed(2)}%`;
  return (
    <div
      className="tm-jump-fade tm-jump-carried"
      style={
        {
          left: pct(x),
          top: pct(y),
          width: pct(w),
          height: pct(h),
          transformOrigin: origin,
          "--tm-anim": `tm-jump-${gear}`,
          "--tm-end-o": end,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

/**
 * The fox on its way: layers inside each other on keyframes written for the run (across, up and down, its turn), and
 * inside them a gentle float once a second, with what it holds behind it (the parachute, the balloons) and its poses,
 * one shown at a time (`poseLooks`), each moving its arms and legs as it does what it does.
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
          <div className="tm-hop tm-jump-squash" style={{ "--tm-anim": "tm-jump-squash", "--tm-end": BODY } as CSSProperties}>
            <div className="tm-jump-bob">
              <Carried gear="parachute" x={CHUTE.x} y={CHUTE.y} w={CHUTE.w} h={CHUTE.h} end={0} origin="50% 100%">
                <ParachuteArt />
              </Carried>
              <Carried gear="balloons" {...HELD} end={0}>
                <HeldBalloonsArt />
              </Carried>
              {FOX_POSES.map((p) => (
                <div
                  key={p}
                  className="tm-jump-fade tm-jump-pose"
                  style={{ "--tm-anim": `tm-jump-pose-${p}`, "--tm-end-o": p === "drop" ? 1 : 0 } as CSSProperties}
                >
                  <FoxPoseArt pose={p} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </At>
  );
});

/**
 * The world, many screens tall, moved up and down as a whole by one layer on keyframes written for the run (the camera,
 * `tm-jump-cam`), with the fox and everything in it.
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
        <SkyLife />
        <Clouds />
        <TreeCrown />
        <Land />
        <LakeLife />
        <Cake />
        <Waiting />
        <CarsBack />
        <Stars moves={moves} glow={glow} />
        <Runner first={first} />
        <CarsFront />
        <CakeFront />
        <CakeBits />
        <WaterFront />
      </div>
    </>
  );
}
