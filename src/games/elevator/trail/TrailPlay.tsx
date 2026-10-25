import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { INK } from "@/games/scenes/shared";
import { useDevice } from "@/lib/device";
import { playCountNote, playGiggle, playMelody, playPop, playRandomNote, playSlide } from "@/lib/sfx";
import { speak } from "@/lib/speech";
import { StoryEnd, nextCard } from "../cards";
import { ActionButton, Confetti } from "../house";
import { HERO, KID_H, Kid, ThoughtBubble, type Pose } from "../kid";
import type { ElevatorSettings } from "../settings";
import { allStations, groundY, route } from "./ground";
import { Fitted, GOALS, ITEMS, type Goal, type ItemId } from "./items";
import type { Climb, Cue, Flight, Fork, Moment, Obstacle, Pickup, Point, Station, TrailLevel, Way } from "./types";
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
/** A thing flying between the bag and the world. */
const FLY_MS = 650;
/** Without a tap for so long, the hand pops up again (and while choosing, the right thing glows). */
const NUDGE_MS = 7000;
/** From the end of the level until „Nochmal“ and „Weiter“ come. */
const END_MS = 6000;
/** The bag's slots; the bag holds three things at most. */
const SLOT_COUNT = 3;
const SLOT_R = 62;
/** From one slot's middle to the next. */
const SLOT_STEP = 150;
const ACTION_R = 62;
/** The bag's frame and the button's frame at the bottom of the screen, as high as each other. */
const HUD_TOP = 704;
const HUD_H = 188;
/** On a computer a small key cap under each slot and under the action button shows which key does it; then the
 * slots sit a little higher to make room. */
const KEY_Y = 864;
/** Room kept free between the screen's edge and the frames. */
const EDGE = 18;
/** The child's left side on the screen: the action button only goes left of it when it fits there. */
const KID_LEFT = KID_AT[0] - 80;
/** The footprints to where the child goes next are this far apart. */
const PRINT_GAP = 62;
/** The round picture sign of each way at a fork. */
const WAY_R = 66;

/** Where the bag and the action button are on the screen, in the picture's units. */
interface Hud {
  /** The bag's frame: left, top, width, height. */
  bagBox: [number, number, number, number];
  /** The bag's picture at the left of its frame. */
  bag: Point;
  slots: Point[];
  action: Point;
  actionBox: [number, number, number, number];
}

/**
 * Bag and button stay at the screen's edges, not the picture's: on a wide phone the picture leaves room left and
 * right, so the bag sits at the very left and the button right next to it, where one thumb reaches both and the way
 * ahead stays free. Where the button would cover the child (a computer, a tablet) it goes to the right corner.
 * `left` and `right` are the screen's free edges in the picture's units.
 */
function layoutHud(left: number, right: number, keys: boolean): Hud {
  const x0 = left + EDGE;
  const y = keys ? 784 : HUD_TOP + HUD_H / 2;
  const slots = Array.from({ length: SLOT_COUNT }, (_, i): Point => [x0 + 218 + i * SLOT_STEP, y]);
  const bagW = slots[SLOT_COUNT - 1][0] + SLOT_R + 18 - x0;
  const boxW = 2 * ACTION_R + 44;
  const beside = x0 + bagW + 26;
  const boxX = beside + boxW <= KID_LEFT ? beside : right - EDGE - boxW;
  return {
    bagBox: [x0, HUD_TOP, bagW, HUD_H],
    bag: [x0 + 80, y + 8],
    slots,
    action: [boxX + boxW / 2, y],
    actionBox: [boxX, HUD_TOP, boxW, HUD_H],
  };
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
  /** A thing flying on the screen, to or from the bag. */
  flight: { item: ItemId; x: number; y: number; ms: number } | null;
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
  /** The thought bubble with the goal; `nudge` counts the reminders. */
  bubble: { nudge: number } | null;
  /** At a fork: the child picks a way by its sign; each shows where it goes first. `nudge` makes the signs hop. */
  fork: { id: string; ways: Next[]; nudge: number } | null;
  party: boolean;
}

const startView = (level: TrailLevel): View => ({
  picking: false,
  kid: { x: level.start, y: groundY(level.ground, level.start), walk: 0, pose: "stand", face: 1, hop: 0 },
  bag: [null, null, null],
  flight: null,
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
export function TrailPlay({ lang, settings, level, onPick }: { lang: string; settings: ElevatorSettings; level: TrailLevel; onPick: (id: string) => void }) {
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

  const say = (text: string) => {
    if (settings.speech) speak(text, lang, { rate: 0.85 });
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
      const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
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

  /** The camera: the world moves so that the child stays at `KID_AT`. */
  const camOf = (k: KidState): Point => [k.x - KID_AT[0], k.y - KID_AT[1]];
  const onScreen = ([x, y]: Point): Point => {
    const [cx, cy] = camOf(viewRef.current.kid);
    return [x - cx, y - cy];
  };

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

  /** A thing flies on the screen from `from` to `to`. */
  const fly = async (item: ItemId, from: Point, to: Point) => {
    put({ flight: { item, x: from[0], y: from[1], ms: 0 } });
    await wait(40);
    put({ flight: { item, x: to[0], y: to[1], ms: FLY_MS } });
    await wait(FLY_MS);
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
    if (station.kind === "pickup") return nextAt(station.x, "reach", station.item, on);
    if (station.kind === "moment") return nextAt(station.x, station.pose, "walk", on);
    if (station.kind === "obstacle") return nextAt(station.x, "stand", "walk", on);
    const half = station.steps.slice(0, Math.ceil(station.steps.length / 2));
    return { prints: printsTo(station.x, half, on), ghost: half[half.length - 1], pose: "stand", icon: "climb" };
  };

  /** The action button lights up until the child taps (it, anywhere, or any key), and footprints and the child's
   * ghost show where the tap takes it; after a while it jumps again and the bubble reminds the child of the goal. */
  const go = async (next: Next) => {
    put({ action: { nudge: 0, next } });
    let stop = () => {};
    const nudge = () => {
      put((v) => ({ action: v.action && { ...v.action, nudge: v.action.nudge + 1 }, bubble: v.bubble ? { nudge: v.bubble.nudge + 1 } : { nudge: 0 } }));
      stop = later(NUDGE_MS, nudge);
    };
    stop = later(NUDGE_MS, nudge);
    await nextTap();
    stop();
    put({ action: null, bubble: null });
  };

  // Each station starts with a tap that walks there, unless the child already tapped its way at a fork (`picked`).
  const pickup = async (station: Pickup, picked: boolean) => {
    if (!picked) await go(nextOf(station));
    await walkTo(station.x);
    say(station.ask);
    kid({ pose: "reach" });
    sound(station.sound);
    const slot = viewRef.current.bag.indexOf(null);
    put((v) => ({ done: [...v.done, station.id] }));
    await fly(station.item, onScreen(station.at), hud.current.slots[slot]);
    put((v) => ({ flight: null, bag: v.bag.map((thing, i) => (i === slot ? station.item : thing)) }));
    sound(playPop);
    say(station.done);
    kid({ pose: "stand" });
    await wait(300);
  };

  const nextChoice = () => new Promise<number>((resolve) => (chooser.current = resolve));

  const obstacle = async (station: Obstacle, picked: boolean) => {
    if (!picked) await go(nextOf(station));
    await walkTo(station.x);
    put({ here: station.id, choosing: true, shake: viewRef.current.shake + 1 });
    cue(station.meet);
    say(station.ask);
    for (;;) {
      let stop = () => {};
      const nudge = () => {
        put((v) => ({ hint: station.need, shake: v.shake + 1 }));
        say(station.ask);
        stop = later(NUDGE_MS, nudge);
      };
      stop = later(NUDGE_MS, nudge);
      const slot = await nextChoice();
      stop();
      const item = viewRef.current.bag[slot]!;
      put((v) => ({ choosing: false, hint: null, bag: v.bag.map((thing, i) => (i === slot ? null : thing)) }));
      kid({ pose: "reach" });
      await fly(item, hud.current.slots[slot], onScreen(station.at));
      if (item === station.need) break;
      // Not this one: something funny happens, the thing comes back and the right one glows.
      put((v) => ({ nope: { id: station.id, n: (v.nope?.n ?? 0) + 1 } }));
      sound(station.nope);
      kid({ pose: "shake" });
      await wait(1000);
      await fly(item, onScreen(station.at), hud.current.slots[slot]);
      put((v) => ({ flight: null, nope: null, bag: v.bag.map((thing, i) => (i === slot ? item : thing)), hint: station.need, choosing: true }));
      kid({ pose: "stand" });
    }
    put((v) => ({ flight: null, done: [...v.done, station.id] }));
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
    put({ bubble: { nudge: 0 } });
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
    if (here?.kind === "obstacle") put((v) => ({ hint: here.need, shake: v.shake + 1 }));
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
    if (k.walk) return;
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

  const { kid: k, flight } = view;
  const next = view.action?.next;
  /** Where the next tap may take the child: one way, or both at a fork. */
  const shown = next ? [next] : (view.fork?.ways ?? []);
  const forks = level.stations.filter((s): s is Fork => s.kind === "fork");
  const { bagBox, bag, slots, action, actionBox } = hud.current;
  const [cx, cy] = camOf(k);
  const pan = (depth: number): CSSProperties => ({ transform: `translate(${-cx * depth}px, ${-cy * depth}px)`, transitionDuration: `${k.walk}ms` });
  const { Scenery, Front, Backdrop } = level;
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
            <g key={`${n.ghost}`} className="tl-next">
              {n.prints.map(([x, y], i) => (
                <ellipse key={`${x}-${y}`} className="tl-print" cx={x + (i % 2 ? 6 : -6)} cy={y - 4} rx="18" ry="7" style={{ animationDelay: `${i * 90}ms` }} />
              ))}
              <g transform={`translate(${n.ghost[0]} ${n.ghost[1]})`} className={view.fork ? "tl-way-ghost" : undefined} onPointerDown={pressWay(w)}>
                <g className="tl-ghost" style={{ animationDelay: `${n.prints.length * 90}ms` }}>
                  <Kid look={HERO} pose={n.pose} holding={null} wear={[]} face={1} />
                </g>
              </g>
            </g>
          ))}
          {/* The picture signs of the ways at a fork: always there; while the child picks a way they hop and glow */}
          {forks.flatMap((f) =>
            f.ways.map(({ id, Sign, sign: [x, y] }, w) => {
              const on = view.fork?.id === f.id;
              return (
                <g
                  key={`${id}-${on ? view.fork?.nudge : "off"}`}
                  className={`tl-way${on ? " on" : ""}`}
                  onPointerDown={pressWay(w)}
                  role="button"
                  aria-label={id}
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
          <g className="tl-walker" style={{ transform: `translate(${k.x}px, ${k.y}px)`, transitionDuration: `${k.walk}ms` }}>
            <g className={k.hop ? `el-hopper hop-${k.hop % 2}` : "el-hopper"} onPointerDown={tapKid}>
              <Kid look={HERO} pose={k.pose} holding={null} wear={[]} face={k.face} />
            </g>
            {view.bubble && <ThoughtBubble picture={GOALS[level.goal]} height={KID_H} nudge={view.bubble.nudge} />}
          </g>
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
        {/* The bag in its frame with its three slots, always at the bottom left */}
        <g className={`tl-bag${view.choosing ? " open" : ""}`}>
          <rect x={bagBox[0] + 8} y={bagBox[1] + 8} width={bagBox[2]} height={bagBox[3]} rx="36" className="tl-bag-shadow" />
          <rect x={bagBox[0]} y={bagBox[1]} width={bagBox[2]} height={bagBox[3]} rx="36" className="tl-bag-box" strokeWidth="6" />
          <g transform={`translate(${bag[0]} ${bag[1]}) scale(1.15)`}>
            <path d="M-56 -40 Q-60 40 0 44 Q60 40 56 -40 Q30 -56 0 -56 Q-30 -56 -56 -40 Z" fill="#c08552" stroke={INK} strokeWidth="5" />
            <path d="M-50 -42 Q0 -20 50 -42" stroke={INK} strokeWidth="5" fill="none" />
            <path d="M-20 -54 Q0 -84 20 -54" stroke="#8d5a3b" strokeWidth="8" fill="none" />
          </g>
          {slots.map(([x, y], i) => {
            const item = view.bag[i];
            return (
              <g
                key={`${i}-${view.shake}`}
                className={`tl-slot${item ? " full" : ""}${item && item === view.hint ? " hint" : ""}`}
                style={{ transformOrigin: `${x}px ${y}px`, animationDelay: `${i * 80}ms` }}
                onPointerDown={pressSlot(i)}
                role="button"
                aria-label={item ?? "leer"}
              >
                <circle cx={x} cy={y} r={SLOT_R} className="tl-slot-face" stroke={INK} strokeWidth="6" />
                {!touchOnly && (
                  <KeyCap x={x} y={KEY_Y} w={40} on={view.choosing && !!item} down={held === `${i + 1}`}>
                    <text y="9" textAnchor="middle" fontSize="24" fontWeight="800" fontFamily="inherit" fill={INK}>
                      {i + 1}
                    </text>
                  </KeyCap>
                )}
                {item && (
                  <g transform={`translate(${x} ${y})`}>
                    <Fitted picture={ITEMS[item]} width={88} />
                  </g>
                )}
              </g>
            );
          })}
        </g>
        {flight && (
          <g className="tl-flight" style={{ transform: `translate(${flight.x}px, ${flight.y}px)`, transitionDuration: `${flight.ms}ms` }}>
            <Fitted picture={ITEMS[flight.item]} width={110} />
          </g>
        )}
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
