import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { INK } from "@/games/scenes/shared";
import { useDevice } from "@/lib/device";
import { playCountNote, playGiggle, playMelody, playPop, playRandomNote, playSlide } from "@/lib/sfx";
import type { TargetLanguage } from "@/content/targetLanguages";
import { pick } from "@/lib/language";
import { speak } from "@/lib/speech";
import { tapState } from "@/lib/tapTargets";
import { StoryEnd, nextCard } from "../cards";
import { ActionButton, Confetti } from "../house";
import { HERO, KID_H, Kid, PACK, ThoughtBubble, type Pose } from "../kid";
import { spokenIn } from "../phrases";
import type { ElevatorSettings } from "../settings";
import { allStations, groundY, route } from "./ground";
import { Fitted, GOALS, ITEMS, type Goal, type ItemId, type Picture } from "./items";
import type { Climb, Cue, Flight, Fork, Moment, Obstacle, Pickup, Point, Station, TrailLevel, Way } from "./types";
import { WORRIES } from "./worries";
import "./trail.css";

const VIEW_W = 1600;
const VIEW_H = 900;
/** Where the child's feet are on the screen: the world scrolls so that it stays there. */
const KID_AT: Point = [760, 740];
/** How much slower the far hills move than the world. */
const FAR = 0.3;
/** Walking time per world point. */
const WALK_MS = 2.6;
/** One step up the stairs. */
const STEP_MS = 380;
/** Sliding time per world point: much faster than walking. */
const SLIDE_MS = 0.9;
/** A thing flying from the child's hand to an obstacle. */
const FLY_MS = 650;
/** How big a thing is while the child carries it, in world points. */
const CARRY = 84;
// Where a carried thing is, from the child's feet (facing right): in the hand reaching out, high up in the
// raised hand, just above the backpack's opening on the back, and deep in it.
const HAND_OUT: Point = [72, -128];
const HAND_UP: Point = [44, -196];
const PACK_TOP: Point = [-54, -180];
const PACK_IN: Point = [-51, -96];
/** The backpack on the child's back while nothing goes in or out (the ghost wears it too). */
const PACK_SHUT = { open: false, bump: 0 };
/** Without a tap for so long, the hand pops up again (and while choosing, the right thing glows). */
const NUDGE_MS = 7000;
/** From the end of the level until „Nochmal“ and „Weiter“ come. */
const END_MS = 6000;
/** The backpack on the screen holds three things at most, standing side by side in it. */
const SLOT_COUNT = 3;
/** From one thing's middle to the next, and from the frame's left edge to the first. */
const SLOT_STEP = 150;
const SLOT_IN = 100;
/** The upper edge of the backpack's front: the things stand behind it, their bottoms hidden. */
const RIM = 808;
const ACTION_R = 62;
/** The bag's frame and the button's frame at the bottom of the screen, as high as each other. */
const HUD_TOP = 704;
const HUD_H = 188;
/** On a computer a small key cap under each thing (on its front pocket) and under the action button shows which
 * key does it. */
const KEY_Y = 864;
/** Room kept free between the screen's edge and the frames. */
const EDGE = 18;
/** From the child's feet to its left side (the backpack): the action button stays left of that. */
const KID_BACK = 80;
/** The child moves at most this far right of `KID_AT` to make room for the action button beside the bag. */
const KID_SHIFT = 80;
/** The footprints to where the child goes next are this far apart. */
const PRINT_GAP = 62;
/** The round picture sign of each way at a fork. */
const WAY_R = 66;

/** Where the bag and the action button are on the screen, in the picture's units. */
interface Hud {
  /** The bag's frame: left, top, width, height. */
  bagBox: [number, number, number, number];
  /** Where each thing stands in the backpack: its middle, on the front's upper edge. */
  slots: Point[];
  action: Point;
  actionBox: [number, number, number, number];
  /** Where the child's feet are on the screen across: `KID_AT`, or a little further right to make room for the button. */
  kidX: number;
}

/**
 * Bag and button stay at the screen's edges, not the picture's: the bag sits at the very left and the button right
 * next to it, where one thumb reaches both and the way ahead stays free. On a wide phone the picture leaves room at
 * the sides for that; on a computer or tablet the child stands a little further right so the button fits left of
 * it. Only where even that is too little does the button go to the right corner.
 * `left` and `right` are the screen's free edges in the picture's units.
 */
export function layoutHud(left: number, right: number, keys: boolean): Hud {
  const x0 = left + EDGE;
  const y = keys ? 784 : HUD_TOP + HUD_H / 2;
  const slots = Array.from({ length: SLOT_COUNT }, (_, i): Point => [x0 + SLOT_IN + i * SLOT_STEP, RIM]);
  const bagW = 2 * SLOT_IN + (SLOT_COUNT - 1) * SLOT_STEP;
  const boxW = 2 * ACTION_R + 44;
  const beside = x0 + bagW + 26;
  const kidX = Math.max(KID_AT[0], beside + boxW + KID_BACK);
  const fits = kidX <= KID_AT[0] + KID_SHIFT;
  const boxX = fits ? beside : right - EDGE - boxW;
  return {
    bagBox: [x0, HUD_TOP, bagW, HUD_H],
    slots,
    action: [boxX + boxW / 2, y],
    actionBox: [boxX, HUD_TOP, boxW, HUD_H],
    kidX: fits ? kidX : KID_AT[0],
  };
}

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/** How much bigger a thing is where it lies in the world than while it is carried. */
const natural = (picture: Picture) => 1 / Math.min(CARRY / picture.w, CARRY / picture.h);

/** A thing standing in the open backpack on (0, 0), its bottom behind the front; a long thing (the plank) sticks out slanted. */
function InPack({ picture }: { picture: Picture }) {
  if (picture.w > picture.h * 2.5) return <g transform={`rotate(-58) scale(${150 / picture.w})`}>{picture.draw()}</g>;
  const s = Math.min(118 / picture.w, 104 / picture.h);
  return <g transform={`translate(0 ${Math.min(24, picture.h * s * 0.25)}) scale(${s})`}>{picture.draw()}</g>;
}

/** How big the ring round a thing lying in the world is: about as big as the thing. */
const ringOf = (picture: Picture) => Math.min(110, Math.max(56, Math.max(picture.w, picture.h) / 2 + 14));

/** A dashed yellow ring round the thing the next tap picks up, in the world and in the backpack on the screen. */
function WantRing({ at: [x, y], r }: { at: Point; r: number }) {
  return (
    <g className="tl-want">
      <circle cx={x} cy={y} r={r} stroke={INK} strokeWidth="13" />
      <circle cx={x} cy={y} r={r} stroke="#ffd43b" strokeWidth="7" />
    </g>
  );
}

/** A small key of the keyboard, drawn around its middle; `on` while it does something now, `down` while it is held. */
function KeyCap({ x, y, w, on, down, children }: { x: number; y: number; w: number; on: boolean; down: boolean; children: ReactNode }) {
  return (
    <g className={`tl-key${on ? " on" : ""}${down ? " down" : ""}`}>
      <rect x={x - w / 2} y={y - 14} width={w} height={34} rx="8" className="tl-key-base" />
      <g className="tl-key-top">
        <rect x={x - w / 2} y={y - 18} width={w} height={32} rx="8" className="tl-key-face" stroke={INK} strokeWidth="3" />
        <g transform={`translate(${x} ${y - 2})`}>{children}</g>
      </g>
    </g>
  );
}

/** What the next tap does: the child walks along the footprints to its pale ghost and does what the ghost does
 * there; the button shows the thing it gets there, or feet or stairs. */
interface Next {
  prints: Point[];
  ghost: Point;
  pose: Pose;
  icon: ItemId | "walk" | "climb";
  /** Where the thing lies that the tap picks up: a yellow ring goes round it, and its pale picture waits in the
   * backpack where it will go. */
  at?: Point;
}

/** The picture on the action button for what the next tap does. */
function NextIcon({ icon }: { icon: Next["icon"] }) {
  if (icon === "climb")
    return <path d="M-30 26 H-12 V8 H6 V-10 H24 V-28" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />;
  if (icon === "walk")
    return (
      <g fill="#fff" stroke={INK} strokeWidth="4">
        {[
          [-13, 8, -12],
          [13, -8, 12],
        ].map(([x, y, turn]) => (
          <g key={x} transform={`translate(${x} ${y}) rotate(${turn})`}>
            <ellipse cy="-6" rx="10" ry="15" fill="#4263eb" />
            <ellipse cy="16" rx="8" ry="7" fill="#4263eb" />
          </g>
        ))}
      </g>
    );
  return <Fitted picture={ITEMS[icon]} width={70} />;
}

interface KidState {
  x: number;
  y: number;
  /** Length of the current walk (and scroll) in ms; 0 while standing. */
  walk: number;
  pose: Pose;
  face: 1 | -1;
  /** Bumped to make it hop when tapped. */
  hop: number;
}

interface View {
  picking: boolean;
  kid: KidState;
  /** The things in the bag, one per slot. */
  bag: (ItemId | null)[];
  /** The slot a thing is just dropping into, or rising out of, on the screen. */
  entering: number | null;
  leaving: number | null;
  /** Bumped to bounce the backpack on the screen when a thing goes in or out. */
  bagBump: number;
  /** The thing the child carries in the world, between where it lies, the hands and the backpack. */
  carry: ItemId | null;
  /** The backpack on the child's back: its lid is open while a thing goes in or out; `bump` bounces it. */
  pack: { open: boolean; bump: number };
  done: string[];
  here: string | null;
  nope: { id: string; n: number } | null;
  /** The bag is open: the child picks a thing. */
  choosing: boolean;
  /** The thing that helps glows. */
  hint: ItemId | null;
  /** Bumped to bounce the slots. */
  shake: number;
  /** The action button waits for a tap; `nudge` makes it jump anew, `next` shows what the tap will do. */
  action: { nudge: number; next: Next } | null;
  /** A thought bubble: the child's (`at` null) with the goal when it goes away, or at an obstacle why a thing helps –
   * the child's worry, or the creature's wish above its head at `at`. `nudge` counts the reminders. */
  bubble: { picture: Picture; at: Point | null; nudge: number } | null;
  /** At a fork: the child picks a way by its sign; each shows where it goes first. `nudge` makes the signs hop. */
  fork: { id: string; ways: Next[]; nudge: number } | null;
  party: boolean;
}

const startView = (level: TrailLevel): View => ({
  picking: false,
  kid: { x: level.start, y: groundY(level.ground, level.start), walk: 0, pose: "stand", face: 1, hop: 0 },
  bag: [null, null, null],
  entering: null,
  leaving: null,
  bagBump: 0,
  carry: null,
  pack: PACK_SHUT,
  done: [],
  here: null,
  nope: null,
  choosing: false,
  hint: null,
  shake: 0,
  action: null,
  bubble: null,
  fork: null,
  party: false,
});

/** The hand of the child reaching out (pose "reach", facing right), where the string is held. */
const handOf = (kid: KidState): Point => [kid.x + 62, kid.y - 112];
/** Where the goal is while the child holds it: high up on its string, or in the reaching hand. */
const heldOf = (kid: KidState, goal: Goal): Point => (goal.carry === "string" ? [kid.x + 140, kid.y - 250] : [kid.x + 66, kid.y - 78]);

/** "Weg-Abenteuer": the goal goes away, the child follows it through a scrolling world and uses what it finds. */
export function TrailPlay({
  language,
  settings,
  level,
  onPick,
}: {
  /** The app language: what the child hears is spoken in it. */
  language: TargetLanguage;
  settings: ElevatorSettings;
  level: TrailLevel;
  onPick: (id: string) => void;
}) {
  const theGoal = GOALS[level.goal];
  const onString = theGoal.carry === "string";
  const [view, setView] = useState<View>(() => startView(level));
  const viewRef = useRef<View>(view);
  const { bursts, spawn } = useBursts();
  const { touchOnly } = useDevice();
  /** The key held down right now, so its cap on the screen goes down too. */
  const [held, setHeld] = useState<string | null>(null);

  // The screen's free edges (without a notch) in the picture's units, measured whenever the screen turns or resizes.
  const playEl = useRef<HTMLDivElement>(null);
  const svgEl = useRef<SVGSVGElement>(null);
  const safeEl = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState<[number, number]>([0, VIEW_W]);
  useLayoutEffect(() => {
    const measure = () => {
      const box = svgEl.current?.getBoundingClientRect();
      const free = safeEl.current?.getBoundingClientRect();
      if (!box || !free) return;
      const scale = Math.min(box.width / VIEW_W, box.height / VIEW_H);
      if (!scale) return;
      const toView = (px: number) => VIEW_W / 2 + (px - box.left - box.width / 2) / scale;
      setEdges([Math.round(toView(free.left)), Math.round(toView(free.right))]);
    };
    measure();
    const watch = new ResizeObserver(measure);
    if (playEl.current) watch.observe(playEl.current);
    return () => watch.disconnect();
  }, []);
  /** Where bag and button are now; the script reads it when a thing flies to or from the bag. */
  const hud = useRef<Hud>(layoutHud(0, VIEW_W, !touchOnly));
  hud.current = layoutHud(edges[0], edges[1], !touchOnly);

  // The level is a script of waits; leaving bumps the generation and drops its timers.
  const generation = useRef(0);
  const timers = useRef(new Set<number>());
  /** Set while the script waits for a tap anywhere. */
  const tapper = useRef<(() => void) | null>(null);
  /** Set while the bag is open: it gets the slot. */
  const chooser = useRef<((slot: number) => void) | null>(null);
  /** Set at a fork while the child picks a way: it gets the way's number. */
  const picker = useRef<((way: number) => void) | null>(null);
  /** The ground the child walks on: the level's, and from a fork on the picked way's. */
  const ground = useRef(level.ground);

  // The goal (the kite, the ball, the balloon) moves along curves, so it is moved frame by frame, not by React.
  const goalEl = useRef<SVGGElement>(null);
  const spinEl = useRef<SVGGElement>(null);
  const stringEl = useRef<SVGLineElement>(null);
  const goal = useRef<{ at: Point; hand: Point | null }>({ at: [0, 0], hand: null });
  // The carried thing moves frame by frame too. It is drawn in front of the child, or behind it (and its
  // backpack) while it sinks into the backpack or comes up out of it; `mover` stops an older move.
  const carryFront = useRef<SVGGElement>(null);
  const carryBack = useRef<SVGGElement>(null);
  const carried = useRef<{ at: Point; s: number; behind: boolean }>({ at: [0, 0], s: 1, behind: false });
  const mover = useRef(0);

  const put = useCallback((change: Partial<View> | ((v: View) => Partial<View>)) => {
    const patch = typeof change === "function" ? change(viewRef.current) : change;
    viewRef.current = { ...viewRef.current, ...patch };
    setView(viewRef.current);
  }, []);

  const kid = (patch: Partial<KidState>) => put((v) => ({ kid: { ...v.kid, ...patch } }));

  const later = (ms: number, run: () => void) => {
    const g = generation.current;
    const timer = window.setTimeout(() => {
      timers.current.delete(timer);
      if (g === generation.current) run();
    }, ms);
    timers.current.add(timer);
    return () => {
      clearTimeout(timer);
      timers.current.delete(timer);
    };
  };

  /** Resolves after `ms`; never, once the child has left, so the script just stops. */
  const wait = (ms: number) => new Promise<void>((resolve) => later(ms, resolve));

  useEffect(
    () => () => {
      generation.current++;
      timers.current.forEach(clearTimeout);
    },
    [],
  );

  /** Speaks a German sentence of the level in the app language (only with "Vorlesen"). */
  const say = (german: string) => {
    if (!settings.speech) return;
    const { text, speechLang } = spokenIn(german, language);
    speak(text, speechLang, { rate: 0.85 });
  };

  const sound = (play: () => void) => {
    if (settings.sounds) play();
  };

  const cue = (sounds: Cue[]) => sounds.forEach(([ms, play]) => later(ms, () => sound(play)));

  /** Draws the goal at `at`, with its string to `hand` if it is held; a ball turns as far as it has rolled. */
  const drawGoal = (at: Point, hand: Point | null) => {
    goal.current = { at, hand };
    goalEl.current?.setAttribute("transform", `translate(${at[0]} ${at[1]})`);
    const r = theGoal.roll;
    if (r) spinEl.current?.setAttribute("transform", `rotate(${((at[0] / r) * 180) / Math.PI} 0 ${-r})`);
    const line = stringEl.current;
    if (!line) return;
    line.style.display = hand ? "" : "none";
    if (hand) {
      line.setAttribute("x1", `${hand[0]}`);
      line.setAttribute("y1", `${hand[1]}`);
      line.setAttribute("x2", `${at[0]}`);
      line.setAttribute("y2", `${at[1]}`);
    }
  };

  /** Moves the goal to `to` in `ms`, swaying sideways by `sway` on the way. */
  const moveGoal = (to: Point, ms: number, hand: Point | null, sway = 0) => {
    const [x0, y0] = goal.current.at;
    const g = generation.current;
    const begin = performance.now();
    const frame = (now: number) => {
      if (g !== generation.current) return;
      const t = Math.min(1, (now - begin) / ms);
      const e = ease(t);
      const side = Math.sin(t * Math.PI * 3) * sway * (1 - t);
      drawGoal([x0 + (to[0] - x0) * e, y0 + (to[1] - y0) * e + side], hand);
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return wait(ms);
  };

  /** Moves the goal along a flight: through its `via` points, then to `to`. */
  const flyGoal = async (flight: Flight, hand: Point | null) => {
    for (const [at, ms] of flight.via ?? []) await moveGoal(at, ms, hand, flight.sway);
    await moveGoal(flight.to, flight.ms, hand, flight.sway);
  };

  /** The camera: the world moves so that the child stays at `KID_AT` (moved right by the HUD's `kidX`). */
  const camOf = (k: KidState): Point => [k.x - hud.current.kidX, k.y - KID_AT[1]];

  /** Walks the child along the ground to `x`; the world scrolls along. */
  const walkTo = async (x: number) => {
    for (const [px, py] of route(ground.current, viewRef.current.kid.x, x)) {
      const k = viewRef.current.kid;
      const ms = Math.hypot(px - k.x, py - k.y) * WALK_MS;
      if (ms < 1) continue;
      kid({ x: px, y: py, walk: ms, pose: "walk", face: px >= k.x ? 1 : -1 });
      await wait(ms);
    }
    kid({ walk: 0, pose: "stand", face: 1 });
  };

  /** Draws the carried thing at `at`, `s` times its carrying size, in front of the child or `behind` it. */
  const drawCarry = (at: Point, s: number, behind = carried.current.behind) => {
    carried.current = { at, s, behind };
    const [shown, hidden] = behind ? [carryBack.current, carryFront.current] : [carryFront.current, carryBack.current];
    if (hidden) hidden.style.display = "none";
    if (!shown) return;
    shown.style.display = "";
    shown.setAttribute("transform", `translate(${at[0]} ${at[1]}) scale(${s})`);
  };

  /** Moves the carried thing to `to` in `ms` along a bow `arc` points high, growing or shrinking to `s`. */
  const moveCarry = (to: Point, ms: number, s = carried.current.s, arc = 0) => {
    const {
      at: [x0, y0],
      s: s0,
    } = carried.current;
    const g = generation.current;
    const move = ++mover.current;
    const begin = performance.now();
    const frame = (now: number) => {
      if (g !== generation.current || move !== mover.current) return;
      const t = Math.min(1, (now - begin) / ms);
      const e = ease(t);
      drawCarry([x0 + (to[0] - x0) * e, y0 + (to[1] - y0) * e - arc * 4 * t * (1 - t)], s0 + (s - s0) * e);
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    // Frames can lag behind the clock: the thing is where it should be when the next step starts.
    return wait(ms).then(() => {
      if (move === mover.current) drawCarry(to, s);
    });
  };

  /** A point next to the child, from its feet: `HAND_UP`, `PACK_TOP` … */
  const byKid = ([dx, dy]: Point): Point => {
    const k = viewRef.current.kid;
    return [k.x + dx * k.face, k.y + dy];
  };

  /** The child holds the thing in its hand up high, then throws it over its shoulder into the open backpack;
   * the backpack bounces, and on the screen the thing drops into the big backpack at `slot`. */
  const packAway = async (item: ItemId, slot: number) => {
    kid({ pose: "lift" });
    await moveCarry(byKid(HAND_UP), 320, 1);
    await wait(420);
    put((v) => ({ pack: { ...v.pack, open: true } }));
    kid({ pose: "pack" });
    await moveCarry(byKid(PACK_TOP), 440, 0.9, 60);
    drawCarry(carried.current.at, carried.current.s, true);
    await moveCarry(byKid(PACK_IN), 280, 0.6);
    put((v) => ({
      carry: null,
      pack: { open: false, bump: v.pack.bump + 1 },
      bag: v.bag.map((thing, i) => (i === slot ? item : thing)),
      entering: slot,
      bagBump: v.bagBump + 1,
    }));
    sound(playPop);
    kid({ pose: "stand" });
    await wait(500);
    put({ entering: null });
  };

  /** The thing rises out of the big backpack on the screen, and the child reaches back into its backpack and
   * holds the thing up high. */
  const takeOut = async (item: ItemId, slot: number) => {
    put((v) => ({ leaving: slot, bagBump: v.bagBump + 1 }));
    sound(playPop);
    await wait(320);
    put((v) => ({ leaving: null, carry: item, bag: v.bag.map((thing, i) => (i === slot ? null : thing)), pack: { ...v.pack, open: true } }));
    kid({ pose: "pack" });
    drawCarry(byKid(PACK_IN), 0.6, true);
    await moveCarry(byKid(PACK_TOP), 300, 0.9);
    drawCarry(carried.current.at, carried.current.s, false);
    put((v) => ({ pack: { ...v.pack, open: false } }));
    kid({ pose: "lift" });
    await moveCarry(byKid(HAND_UP), 380, 1, 50);
    await wait(260);
  };

  const nextTap = () => new Promise<void>((resolve) => (tapper.current = resolve));

  /** A tap, a click or a key while the script waits for one. */
  const tap = () => {
    const resolve = tapper.current;
    if (resolve) {
      tapper.current = null;
      resolve();
    }
  };

  /** Footprints along `on` (the ground) from the child to `x`, then one on each of `steps`. */
  const printsTo = (x: number, steps: Point[] = [], on = ground.current): Point[] => {
    const prints: Point[] = [];
    for (let px = viewRef.current.kid.x + PRINT_GAP; px < x - PRINT_GAP / 2; px += PRINT_GAP) prints.push([px, groundY(on, px)]);
    return [...prints, ...steps];
  };

  /** Walking on to `x` and doing `pose` there, shown before the tap. */
  const nextAt = (x: number, pose: Pose, icon: Next["icon"], on = ground.current): Next => ({
    prints: printsTo(x, [], on),
    ghost: [x, groundY(on, x)],
    pose,
    icon,
  });

  /** What the first tap at `station` does: for stairs, walking there and up the first half of the steps. */
  const nextOf = (station: Station, on = ground.current): Next => {
    if (station.kind === "pickup") return { ...nextAt(station.x, "take", station.item, on), at: station.at };
    if (station.kind === "moment") return nextAt(station.x, station.pose, "walk", on);
    if (station.kind === "obstacle") return nextAt(station.x, "stand", "walk", on);
    const half = station.steps.slice(0, Math.ceil(station.steps.length / 2));
    return { prints: printsTo(station.x, half, on), ghost: half[half.length - 1], pose: "stand", icon: "climb" };
  };

  /** The action button lights up until the child taps (it, anywhere, or any key), and footprints and the child's
   * ghost show where the tap takes it; after a while the button jumps and the footprints and the ghost come again.
   * The reminder shows only the next step, never the goal at the end: that is far away and doesn't help now. */
  const go = async (next: Next) => {
    put({ action: { nudge: 0, next } });
    let stop = () => {};
    const nudge = () => {
      put((v) => ({ action: v.action && { ...v.action, nudge: v.action.nudge + 1 } }));
      stop = later(NUDGE_MS, nudge);
    };
    stop = later(NUDGE_MS, nudge);
    await nextTap();
    stop();
    put({ action: null });
  };

  // Each station starts with a tap that walks there, unless the child already tapped its way at a fork (`picked`).
  const pickup = async (station: Pickup, picked: boolean) => {
    if (!picked) await go(nextOf(station));
    await walkTo(station.x);
    say(station.ask);
    // The child takes the thing, holds it up high and puts it into the backpack.
    kid({ pose: "take" });
    sound(station.sound);
    put((v) => ({ done: [...v.done, station.id], carry: station.item }));
    drawCarry(station.at, natural(ITEMS[station.item]), false);
    await moveCarry(byKid(HAND_OUT), 450, 1);
    await packAway(station.item, viewRef.current.bag.indexOf(null));
    say(station.done);
    await wait(200);
  };

  const nextChoice = () => new Promise<number>((resolve) => (chooser.current = resolve));

  const obstacle = async (station: Obstacle, picked: boolean) => {
    if (!picked) await go(nextOf(station));
    await walkTo(station.x);
    // Why a thing helps: the creature thinks of what it wants, or the child of what would happen.
    const { why } = station;
    const bubble = "wants" in why ? { picture: ITEMS[station.need], at: why.wants, nudge: 0 } : { picture: WORRIES[why.worry], at: null, nudge: 0 };
    put({ here: station.id, choosing: true, shake: viewRef.current.shake + 1, bubble });
    cue(station.meet);
    say(station.ask);
    for (;;) {
      let stop = () => {};
      const nudge = () => {
        put((v) => ({ hint: station.need, shake: v.shake + 1, bubble: v.bubble && { ...v.bubble, nudge: v.bubble.nudge + 1 } }));
        say(station.ask);
        stop = later(NUDGE_MS, nudge);
      };
      stop = later(NUDGE_MS, nudge);
      const slot = await nextChoice();
      stop();
      const item = viewRef.current.bag[slot]!;
      put({ choosing: false, hint: null });
      // Out of the backpack, up high, and over to the obstacle.
      await takeOut(item, slot);
      kid({ pose: "take" });
      await moveCarry(station.at, FLY_MS, natural(ITEMS[item]), 50);
      if (item === station.need) break;
      // Not this one: something funny happens, the thing comes back into the backpack and the right one glows.
      put((v) => ({ nope: { id: station.id, n: (v.nope?.n ?? 0) + 1 } }));
      sound(station.nope);
      kid({ pose: "shake" });
      await wait(1000);
      kid({ pose: "take" });
      await moveCarry(byKid(HAND_OUT), 500, 1, 50);
      await packAway(item, slot);
      put({ nope: null, hint: station.need, choosing: true });
    }
    put((v) => ({ carry: null, done: [...v.done, station.id], bubble: null }));
    cue(station.sounds);
    say(station.done);
    await wait(500);
    kid({ pose: "cheer" });
    await wait(Math.max(0, station.ms - 500));
    if (station.frees) {
      kid({ pose: "reach" });
      await moveGoal(heldOf(viewRef.current.kid, theGoal), 1200, null, onString ? 30 : 0);
      if (onString) drawGoal(goal.current.at, handOf(viewRef.current.kid));
    } else kid({ pose: "stand" });
    put({ here: null });
  };

  /** Two taps: the first walks to the stairs and climbs half of them, the second the rest; a note per step. */
  const climb = async (station: Climb, picked: boolean) => {
    const half = Math.ceil(station.steps.length / 2);
    const { steps } = station;
    if (!picked) await go(nextOf(station));
    await walkTo(station.x);
    say(station.ask);
    for (const [i, [x, y]] of steps.entries()) {
      if (i === half) await go({ prints: steps.slice(half), ghost: steps[steps.length - 1], pose: "stand", icon: "climb" });
      kid({ x, y, walk: STEP_MS, pose: "walk" });
      sound(() => playCountNote(i));
      await wait(STEP_MS);
      kid({ walk: 0, pose: "stand" });
    }
    if (station.slide) {
      // Down the slide by itself: "Huiii!"
      sound(playSlide);
      kid({ pose: "cheer" });
      for (const [x, y] of station.slide) {
        const k = viewRef.current.kid;
        const ms = Math.hypot(x - k.x, y - k.y) * SLIDE_MS;
        kid({ x, y, walk: ms });
        await wait(ms);
      }
      kid({ walk: 0, pose: "cheer" });
      sound(playGiggle);
      await wait(700);
      kid({ pose: "stand" });
    }
    say(station.done);
  };

  /** The child gets there and something happens by itself (the light turns green); the walk was the tap. */
  const moment = async (station: Moment, picked: boolean) => {
    if (!picked) await go(nextOf(station));
    await walkTo(station.x);
    put({ here: station.id });
    kid({ pose: station.pose });
    cue(station.sounds);
    say(station.ask);
    await wait(700);
    kid({ pose: "stand" });
    await wait(Math.max(0, station.ms - 700));
    put((v) => ({ done: [...v.done, station.id], here: null }));
    kid({ pose: "cheer" });
    say(station.done);
    await wait(900);
    kid({ pose: "stand" });
  };

  const station = (s: Station, picked = false) => {
    if (s.kind === "pickup") return pickup(s, picked);
    if (s.kind === "obstacle") return obstacle(s, picked);
    if (s.kind === "moment") return moment(s, picked);
    return climb(s, picked);
  };

  /** Two ways: the child walks to the fork, then both ways show where they go first (footprints to a ghost each)
   * and the child taps a sign (or 1 / 2). The picked way's stations follow, starting right away. */
  const fork = async (at: Fork) => {
    await go(nextAt(at.x, "stand", "walk"));
    await walkTo(at.x);
    put({ here: at.id, fork: { id: at.id, ways: at.ways.map((way) => nextOf(way.stations[0], way.ground ?? ground.current)), nudge: 0 } });
    say(at.ask);
    let stop = () => {};
    const nudge = () => {
      put((v) => ({ fork: v.fork && { ...v.fork, nudge: v.fork.nudge + 1 } }));
      say(at.ask);
      stop = later(NUDGE_MS, nudge);
    };
    stop = later(NUDGE_MS, nudge);
    const way: Way = at.ways[await new Promise<number>((resolve) => (picker.current = resolve))];
    stop();
    put((v) => ({ fork: null, here: null, done: [...v.done, at.id, way.id] }));
    if (way.ground) ground.current = way.ground;
    sound(playPop);
    say(way.say);
    for (const [i, s] of way.stations.entries()) await station(s, i === 0);
  };

  const funBurst = useCallback(
    (x?: number, y?: number) => {
      spawn(x, y);
      if (settings.sounds) playRandomNote();
    },
    [spawn, settings.sounds],
  );

  const play = async () => {
    const k = viewRef.current.kid;
    drawGoal(heldOf(k, theGoal), onString ? handOf(k) : null);
    kid({ pose: level.away.pose });
    await wait(900);
    cue(level.away.sounds);
    kid({ pose: "shake" });
    await flyGoal(level.away, null);
    kid({ pose: "stand" });
    put({ bubble: { picture: theGoal, at: null, nudge: 0 } });
    say(level.away.say);
    await wait(1800);
    put({ bubble: null });
    for (const s of level.stations) await (s.kind === "fork" ? fork(s) : station(s));
    // The goal is back in the child's hands: up it goes.
    put({ party: true });
    sound(playMelody);
    say(level.finale.say);
    for (let i = 0; i < 8; i++) later(i * 250, () => spawn());
    const finaleMs = level.finale.ms + (level.finale.via ?? []).reduce((sum, [, ms]) => sum + ms, 0);
    await flyGoal(level.finale, onString ? handOf(viewRef.current.kid) : null);
    await wait(Math.max(0, END_MS - finaleMs));
    put({ picking: true });
  };

  useEffect(() => {
    void play();
  }, []);

  /** A slot of the bag was tapped: the thing in it is used, or it just bounces. */
  const pressSlot = (slot: number) => (e: PointerEvent) => {
    e.stopPropagation();
    const v = viewRef.current;
    const pick = chooser.current;
    if (pick && v.bag[slot]) {
      chooser.current = null;
      pick(slot);
    } else if (tapper.current) {
      spawn(e.clientX, e.clientY);
      tap();
    } else funBurst(e.clientX, e.clientY);
  };

  /** While the bag is open, a tap elsewhere or another key shows which thing helps; at a fork the signs hop. */
  const showHint = () => {
    if (viewRef.current.fork) return put((v) => ({ fork: v.fork && { ...v.fork, nudge: v.fork.nudge + 1 } }));
    const here = allStations(level).find((s) => s.id === viewRef.current.here);
    if (here?.kind === "obstacle") put((v) => ({ hint: here.need, shake: v.shake + 1, bubble: v.bubble && { ...v.bubble, nudge: v.bubble.nudge + 1 } }));
  };

  /** A way was picked at a fork: by its sign, its ghost, or the key 1 / 2. */
  const pickWay = (way: number) => {
    const pick = picker.current;
    picker.current = null;
    pick?.(way);
  };

  const pressWay = (way: number) => (e: PointerEvent) => {
    if (!picker.current) return;
    e.stopPropagation();
    spawn(e.clientX, e.clientY);
    pickWay(way);
  };

  const tapKid = (e: PointerEvent) => {
    e.stopPropagation();
    if (tapper.current) return tap();
    const k = viewRef.current.kid;
    // Not while walking, nor while the child carries a thing: the thing would stay behind in the air.
    if (k.walk || viewRef.current.carry) return;
    kid({ hop: k.hop + 1 });
    sound(playGiggle);
  };

  // Any key goes on when the action button lights up (the space bar is the one shown on it); 1–3 take a thing out
  // of the open bag; any key at the end goes on to the next story.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.key === "Escape") return;
      setHeld(e.key);
      const v = viewRef.current;
      if (v.picking) {
        onPick(nextCard(level.id).id);
        return;
      }
      if (tapper.current) return tap();
      const way = Number(e.key) - 1;
      if (picker.current && (way === 0 || way === 1)) return pickWay(way);
      const pick = chooser.current;
      const slot = Number(e.key) - 1;
      if (pick && slot >= 0 && slot < SLOT_COUNT && v.bag[slot]) {
        chooser.current = null;
        pick(slot);
      } else {
        if (pick || picker.current) showHint();
        funBurst();
      }
    };
    const onKeyUp = () => setHeld(null);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  });

  const { kid: k } = view;
  const carry = view.carry && <Fitted picture={ITEMS[view.carry]} width={CARRY} />;
  const next = view.action?.next;
  /** Where the next tap may take the child: one way, or both at a fork. */
  const shown = next ? [next] : (view.fork?.ways ?? []);
  /** Bumped by the reminders: the footprints, the ghost and the ring come again. */
  const again = view.action?.nudge ?? 0;
  /** The free place in the backpack where the next thing goes, when the next tap picks one up. */
  const packing = next?.at && next.icon !== "walk" && next.icon !== "climb" ? { item: next.icon, slot: view.bag.indexOf(null) } : null;
  const forks = level.stations.filter((s): s is Fork => s.kind === "fork");
  const { bagBox, slots, action, actionBox } = hud.current;
  const [bx, , bw] = bagBox;
  const [cx, cy] = camOf(k);
  const pan = (depth: number): CSSProperties => ({ transform: `translate(${-cx * depth}px, ${-cy * depth}px)`, transitionDuration: `${k.walk}ms` });
  const { Scenery, Front, Backdrop } = level;
  // While the child picks from the bag at an obstacle, the thing that helps is the right one to tap.
  const stop = view.choosing ? allStations(level).find((s) => s.id === view.here) : undefined;
  const need = stop?.kind === "obstacle" ? stop.need : null;
  // Where the goal is drawn before the script moves it: in the hands at the start. React sets these
  // once; after that the script moves goal and string by itself.
  const [startHand, startHeld] = [handOf(startView(level).kid), heldOf(startView(level).kid, theGoal)];
  const firstGoal = `translate(${startHeld[0]} ${startHeld[1]})`;
  const firstString = { x1: startHand[0], y1: startHand[1], x2: startHeld[0], y2: startHeld[1], display: onString ? undefined : "none" };

  return (
    <div
      ref={playEl}
      className="tl-play"
      onPointerDown={(e) => {
        if (tapper.current) {
          spawn(e.clientX, e.clientY);
          return tap();
        }
        if (chooser.current || picker.current) showHint();
        funBurst(e.clientX, e.clientY);
      }}
    >
      <div ref={safeEl} className="tl-safe" />
      <svg ref={svgEl} className="el-svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet">
        <g className="tl-pan" style={pan(FAR)}>
          <Backdrop />
        </g>
        <g className="tl-pan" style={pan(1)}>
          <Scenery done={view.done} here={view.here} nope={view.nope} />
          <line ref={stringEl} className="tl-string" stroke={INK} strokeWidth="3" {...firstString} />
          <g ref={goalEl} className="tl-goal" transform={firstGoal}>
            <g className={view.party && onString ? "tl-sway" : undefined}>
              <g ref={spinEl}>{(theGoal.world ?? theGoal.draw)()}</g>
            </g>
          </g>
          {Front && <Front done={view.done} here={view.here} nope={view.nope} />}
          {shown.map((n, w) => (
            <g key={`${n.ghost}-${again}`} className="tl-next">
              {n.at && n.icon !== "walk" && n.icon !== "climb" && <WantRing at={n.at} r={ringOf(ITEMS[n.icon])} />}
              {n.prints.map(([x, y], i) => (
                <ellipse key={`${x}-${y}`} className="tl-print" cx={x + (i % 2 ? 6 : -6)} cy={y - 4} rx="18" ry="7" style={{ animationDelay: `${i * 90}ms` }} />
              ))}
              <g transform={`translate(${n.ghost[0]} ${n.ghost[1]})`} className={view.fork ? "tl-way-ghost" : undefined} data-tap onPointerDown={pressWay(w)}>
                <g className="tl-ghost" style={{ animationDelay: `${n.prints.length * 90}ms` }}>
                  <Kid look={HERO} pose={n.pose} holding={null} wear={[]} face={1} backpack={PACK_SHUT} />
                </g>
              </g>
            </g>
          ))}
          {/* The picture signs of the ways at a fork: always there; while the child picks a way they hop and glow */}
          {forks.flatMap((f) =>
            f.ways.map(({ id, Sign, sign: [x, y], say: wayName }, w) => {
              const on = view.fork?.id === f.id;
              return (
                <g
                  key={`${id}-${on ? view.fork?.nudge : "off"}`}
                  className={`tl-way${on ? " on" : ""}`}
                  data-tap
                  onPointerDown={pressWay(w)}
                  role="button"
                  aria-label={spokenIn(wayName, language).text}
                >
                  <g className="tl-way-board" style={{ transformOrigin: `${x}px ${y}px`, animationDelay: `${w * 120}ms` }}>
                    <circle cx={x} cy={y} r={WAY_R + 12} className="tl-way-glow" fill="none" strokeWidth="14" />
                    <circle cx={x} cy={y} r={WAY_R} className="tl-way-face" stroke={INK} strokeWidth="6" />
                    <g transform={`translate(${x} ${y})`}>
                      <Sign />
                    </g>
                  </g>
                  {on && !touchOnly && (
                    <KeyCap x={x} y={y + WAY_R + 40} w={40} on down={held === `${w + 1}`}>
                      <text y="9" textAnchor="middle" fontSize="24" fontWeight="800" fontFamily="inherit" fill={INK}>
                        {w + 1}
                      </text>
                    </KeyCap>
                  )}
                </g>
              );
            }),
          )}
          <g ref={carryBack} className="tl-carry">
            {carry}
          </g>
          <g className="tl-walker" style={{ transform: `translate(${k.x}px, ${k.y}px)`, transitionDuration: `${k.walk}ms` }}>
            <g className={k.hop ? `el-hopper hop-${k.hop % 2}` : "el-hopper"} data-tap onPointerDown={tapKid}>
              <Kid look={HERO} pose={k.pose} holding={null} wear={[]} face={k.face} backpack={view.pack} />
            </g>
            {view.bubble && !view.bubble.at && <ThoughtBubble picture={view.bubble.picture} height={KID_H} nudge={view.bubble.nudge} />}
          </g>
          <g ref={carryFront} className="tl-carry">
            {carry}
          </g>
          {view.bubble?.at && (
            <g transform={`translate(${view.bubble.at[0]} ${view.bubble.at[1]})`}>
              <ThoughtBubble picture={view.bubble.picture} height={0} nudge={view.bubble.nudge} right />
            </g>
          )}
        </g>

        <ActionButton
          waiting={!!view.action}
          nudge={view.action?.nudge ?? 0}
          x={action[0]}
          y={action[1]}
          r={ACTION_R}
          box={actionBox}
          picture={next && <NextIcon icon={next.icon} />}
        />
        {!touchOnly && (
          <KeyCap x={action[0]} y={KEY_Y} w={110} on={!!view.action} down={held === " "}>
            <path d="M-24 -5 V5 H24 V-5" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </KeyCap>
        )}
        {/* The child's backpack again, big and open in its frame at the bottom left: the things in it stand side by side */}
        <g className={`tl-bag${view.choosing ? " open" : ""}`}>
          <rect x={bx + 8} y={bagBox[1] + 8} width={bw} height={bagBox[3]} rx="36" className="tl-bag-shadow" />
          <rect x={bx} y={bagBox[1]} width={bw} height={bagBox[3]} rx="36" className="tl-bag-box" strokeWidth="6" />
          <g key={view.bagBump} className={view.bagBump ? "tl-bag-bump" : undefined} style={{ transformOrigin: `${bx + bw / 2}px 888px` }}>
            {/* The lid folded back, the straps at the sides and the inside, all behind the things */}
            <path
              d={`M${bx + 62} 784 Q${bx + 58} 734 ${bx + 116} 730 H${bx + bw - 116} Q${bx + bw - 58} 734 ${bx + bw - 62} 784 Z`}
              fill={PACK.lining}
              stroke={INK}
              strokeWidth="6"
              strokeLinejoin="round"
            />
            <path d={`M${bx + 96} 744 H${bx + bw - 96}`} stroke={PACK.dark} strokeWidth="4" strokeDasharray="10 8" opacity="0.6" />
            <path
              d={`M${bx + 40} 822 Q${bx + 12} 830 ${bx + 16} 856 Q${bx + 20} 880 ${bx + 40} 876 M${bx + bw - 40} 822 Q${bx + bw - 12} 830 ${bx + bw - 16} 856 Q${bx + bw - 20} 880 ${bx + bw - 40} 876`}
              stroke={PACK.dark}
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={`M${bx + 42} ${RIM + 4} Q${bx + 42} 778 ${bx + 76} 776 H${bx + bw - 76} Q${bx + bw - 42} 778 ${bx + bw - 42} ${RIM + 4} Z`}
              fill={PACK.inside}
              stroke={INK}
              strokeWidth="6"
              strokeLinejoin="round"
            />
            {slots.map(([x, y], i) => {
              const item = view.bag[i];
              if (!item) return null;
              const moving = view.entering === i ? " in" : view.leaving === i ? " out" : "";
              return (
                <g
                  key={`${i}-${view.shake}`}
                  className={`tl-slot${item === view.hint ? " hint" : ""}`}
                  style={{ transformOrigin: `${x}px ${y}px`, animationDelay: `${i * 80}ms` }}
                >
                  <g transform={`translate(${x} ${y})`}>
                    <g key={item} className={`tl-thing${moving}`}>
                      <ellipse className="tl-glow" cx="0" cy="-48" rx="70" ry="64" />
                      <InPack picture={ITEMS[item]} />
                    </g>
                  </g>
                </g>
              );
            })}
            {/* The thing the next tap picks up, pale and ringed like in the world, already over where it will go */}
            {packing && slots[packing.slot] && (
              <g key={again} transform={`translate(${slots[packing.slot][0]} ${slots[packing.slot][1] - 30})`}>
                <WantRing at={[0, -50]} r={62} />
                <g className="tl-pack-ghost">
                  <InPack picture={ITEMS[packing.item]} />
                </g>
              </g>
            )}
            {/* The front with a pocket under each thing: its number key on a computer, a buckle on a tablet */}
            <path
              d={`M${bx + 34} ${RIM} H${bx + bw - 34} Q${bx + bw - 24} ${RIM} ${bx + bw - 26} ${RIM + 18} L${bx + bw - 32} 872 Q${bx + bw - 36} 888 ${bx + bw - 60} 888 H${bx + 60} Q${bx + 36} 888 ${bx + 32} 872 L${bx + 26} ${RIM + 18} Q${bx + 24} ${RIM} ${bx + 34} ${RIM} Z`}
              fill={PACK.body}
              stroke={INK}
              strokeWidth="6"
              strokeLinejoin="round"
            />
            <path d={`M${bx + 40} ${RIM + 12} H${bx + bw - 40}`} stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.35" />
            {slots.map(([x], i) => (
              <g key={x}>
                <rect x={x - 44} y="828" width="88" height="54" rx="14" fill={PACK.pocket} stroke={INK} strokeWidth="4" />
                {touchOnly ? (
                  <>
                    <path d={`M${x - 44} 846 Q${x} 856 ${x + 44} 846`} stroke={INK} strokeWidth="3" fill="none" opacity="0.5" />
                    <rect x={x - 11} y="842" width="22" height="18" rx="4" fill={PACK.buckle} stroke={INK} strokeWidth="3" />
                  </>
                ) : (
                  <KeyCap x={x} y={KEY_Y} w={40} on={view.choosing && !!view.bag[i]} down={held === `${i + 1}`}>
                    <text y="9" textAnchor="middle" fontSize="24" fontWeight="800" fontFamily="inherit" fill={INK}>
                      {i + 1}
                    </text>
                  </KeyCap>
                )}
              </g>
            ))}
          </g>
          {/* What a tap hits: a thing with its pocket below it */}
          {slots.map(([x], i) => (
            <rect
              key={x}
              x={x - SLOT_STEP / 2}
              y={bagBox[1] - 60}
              width={SLOT_STEP}
              height={bagBox[3] + 60}
              fill="transparent"
              data-tap={tapState({ goal: need !== null && view.bag[i] === need })}
              onPointerDown={pressSlot(i)}
              role="button"
              aria-label={view.bag[i] ?? pick({ de: "leer", ru: "пусто" }, language.id)}
              className="tl-slot-tap"
            />
          ))}
        </g>
        {view.party && (
          <g transform={`scale(${VIEW_W / 1400} 1)`}>
            <Confetti />
          </g>
        )}
      </svg>

      {view.picking && <StoryEnd id={level.id} onPick={onPick} />}
      <BurstLayer bursts={bursts} />
    </div>
  );
}
