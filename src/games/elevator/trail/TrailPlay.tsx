import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { INK } from "@/games/scenes/shared";
import { useDevice } from "@/lib/device";
import { playCountNote, playGiggle, playMelody, playPop, playRandomNote, playSlide } from "@/lib/sfx";
import { speak } from "@/lib/speech";
import { StoryEnd, nextCard } from "../cards";
import { ActionButton, Confetti } from "../house";
import { HERO, KID_H, Kid, PACK, ThoughtBubble, type Pose } from "../kid";
import type { ElevatorSettings } from "../settings";
import { groundY, route } from "./ground";
import { Fitted, GOALS, ITEMS, type Goal, type ItemId, type Picture } from "./items";
import type { Climb, Cue, Flight, Moment, Obstacle, Pickup, Point, TrailLevel } from "./types";
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
/** Without a tap for so long, the hand pops up again (and while choosing, the right thing glows). */
const NUDGE_MS = 7000;
/** From the end of the level until „Nochmal“ and „Weiter“ come. */
const END_MS = 6000;
/** The big backpack on the screen holds three things at most, standing side by side in it at these x. */
const POCKETS = [214, 370, 526];
/** The upper edge of the backpack's front: the things stand behind it, their bottoms hidden. */
const RIM = 778;
/** The action button, in the other bottom corner. */
const ACTION: Point = [1494, 800];
/** On a computer a key cap on each front pocket of the backpack and above the action button shows which key does it. */
const SLOT_KEY_Y = 856;
const ACTION_KEY_Y = 676;

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/** How much bigger a thing is where it lies in the world than while it is carried. */
const natural = (picture: Picture) => 1 / Math.min(CARRY / picture.w, CARRY / picture.h);

/** A thing standing in the open backpack on (0, 0), its bottom behind the front; a long thing (the plank) sticks out slanted. */
function InPack({ picture }: { picture: Picture }) {
  if (picture.w > picture.h * 2.5) return <g transform={`rotate(-58) scale(${170 / picture.w})`}>{picture.draw()}</g>;
  const s = Math.min(138 / picture.w, 128 / picture.h);
  return <g transform={`translate(0 ${Math.min(28, picture.h * s * 0.28)}) scale(${s})`}>{picture.draw()}</g>;
}

/** A key on the keyboard, drawn around its middle; `on` while it does something now, `down` while it is held. */
function KeyCap({ x, y, w, on, down, children }: { x: number; y: number; w: number; on: boolean; down: boolean; children: ReactNode }) {
  return (
    <g className={`tl-key${on ? " on" : ""}${down ? " down" : ""}`}>
      <rect x={x - w / 2} y={y - 22} width={w} height={52} rx="12" className="tl-key-base" />
      <g className="tl-key-top">
        <rect x={x - w / 2} y={y - 28} width={w} height={50} rx="12" className="tl-key-face" stroke={INK} strokeWidth="4" />
        <g transform={`translate(${x} ${y - 3})`}>{children}</g>
      </g>
    </g>
  );
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
  /** Where the hand points, in the world; `n` makes it pop up anew. */
  action: { nudge: number } | null;
  /** The thought bubble with the goal; `nudge` counts the reminders. */
  bubble: { nudge: number } | null;
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
  pack: { open: false, bump: 0 },
  done: [],
  here: null,
  nope: null,
  choosing: false,
  hint: null,
  shake: 0,
  action: null,
  bubble: null,
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

  // The level is a script of waits; leaving bumps the generation and drops its timers.
  const generation = useRef(0);
  const timers = useRef(new Set<number>());
  /** Set while the script waits for a tap anywhere. */
  const tapper = useRef<(() => void) | null>(null);
  /** Set while the bag is open: it gets the slot. */
  const chooser = useRef<((slot: number) => void) | null>(null);

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

  /** The camera: the world moves so that the child stays at `KID_AT`. */
  const camOf = (k: KidState): Point => [k.x - KID_AT[0], k.y - KID_AT[1]];

  /** Walks the child along the ground to `x`; the world scrolls along. */
  const walkTo = async (x: number) => {
    for (const [px, py] of route(level.ground, viewRef.current.kid.x, x)) {
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

  /** The action button lights up until the child taps (it, anywhere, or any key); after a while it jumps again and
   * the bubble reminds the child of the goal. Nothing in the picture is pointed at. */
  const go = async () => {
    put({ action: { nudge: 0 } });
    let stop = () => {};
    const nudge = () => {
      put((v) => ({ action: v.action && { nudge: v.action.nudge + 1 }, bubble: v.bubble ? { nudge: v.bubble.nudge + 1 } : { nudge: 0 } }));
      stop = later(NUDGE_MS, nudge);
    };
    stop = later(NUDGE_MS, nudge);
    await nextTap();
    stop();
    put({ action: null, bubble: null });
  };

  const pickup = async (station: Pickup) => {
    await go();
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

  const obstacle = async (station: Obstacle) => {
    await go();
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
    put((v) => ({ carry: null, done: [...v.done, station.id] }));
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
  const climb = async (station: Climb) => {
    await go();
    await walkTo(station.x);
    say(station.ask);
    const half = Math.ceil(station.steps.length / 2);
    for (const [i, [x, y]] of station.steps.entries()) {
      if (i === half) await go();
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
  const moment = async (station: Moment) => {
    await go();
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
    for (const station of level.stations) {
      if (station.kind === "pickup") await pickup(station);
      else if (station.kind === "obstacle") await obstacle(station);
      else if (station.kind === "moment") await moment(station);
      else await climb(station);
    }
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

  /** While the bag is open, a tap elsewhere or another key shows which thing helps. */
  const showHint = () => {
    const station = level.stations.find((s) => s.id === viewRef.current.here);
    if (station?.kind === "obstacle") put((v) => ({ hint: station.need, shake: v.shake + 1 }));
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
      const pick = chooser.current;
      const slot = Number(e.key) - 1;
      if (pick && slot >= 0 && slot < POCKETS.length && v.bag[slot]) {
        chooser.current = null;
        pick(slot);
      } else {
        if (pick) showHint();
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
      className="tl-play"
      onPointerDown={(e) => {
        if (tapper.current) {
          spawn(e.clientX, e.clientY);
          return tap();
        }
        if (chooser.current) showHint();
        funBurst(e.clientX, e.clientY);
      }}
    >
      <svg className="el-svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet">
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
          <g ref={carryBack} className="tl-carry">
            {carry}
          </g>
          <g className="tl-walker" style={{ transform: `translate(${k.x}px, ${k.y}px)`, transitionDuration: `${k.walk}ms` }}>
            <g className={k.hop ? `el-hopper hop-${k.hop % 2}` : "el-hopper"} onPointerDown={tapKid}>
              <Kid look={HERO} pose={k.pose} holding={null} wear={[]} face={k.face} backpack={view.pack} />
            </g>
            {view.bubble && <ThoughtBubble picture={GOALS[level.goal]} height={KID_H} nudge={view.bubble.nudge} />}
          </g>
          <g ref={carryFront} className="tl-carry">
            {carry}
          </g>
        </g>

        <ActionButton waiting={!!view.action} nudge={view.action?.nudge ?? 0} x={ACTION[0]} y={ACTION[1]} r={70} />
        {!touchOnly && (
          <KeyCap x={ACTION[0]} y={ACTION_KEY_Y} w={200} on={!!view.action} down={held === " "}>
            <path d="M-34 -8 V8 H34 V-8" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </KeyCap>
        )}
        {/* The backpack again, big and open in the bottom corner: the things in it stand side by side. */}
        <g className={`tl-bag${view.choosing ? " open" : ""}`}>
          <g key={view.bagBump} className={view.bagBump ? "tl-bag-bump" : undefined} style={{ transformOrigin: "370px 900px" }}>
            {/* The lid folded back, the straps at the sides and the inside, all behind the things */}
            <path d="M150 746 Q146 690 210 686 H530 Q594 690 590 746 Z" fill={PACK.lining} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
            <path d="M190 700 H550" stroke={PACK.dark} strokeWidth="4" strokeDasharray="10 8" opacity="0.6" />
            <path
              d="M124 796 Q66 800 70 852 Q74 892 118 886 M616 796 Q674 800 670 852 Q666 892 622 886"
              stroke={PACK.dark}
              strokeWidth="18"
              strokeLinecap="round"
              fill="none"
            />
            <path d="M104 782 Q104 744 144 742 H596 Q636 744 636 782 Z" fill={PACK.inside} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
            {POCKETS.map((x, i) => {
              const item = view.bag[i];
              if (!item) return null;
              const moving = view.entering === i ? " in" : view.leaving === i ? " out" : "";
              return (
                <g
                  key={`${i}-${view.shake}`}
                  className={`tl-slot${item === view.hint ? " hint" : ""}`}
                  style={{ transformOrigin: `${x}px ${RIM}px`, animationDelay: `${i * 80}ms` }}
                >
                  <g transform={`translate(${x} ${RIM})`}>
                    <g key={item} className={`tl-thing${moving}`}>
                      <ellipse className="tl-glow" cx="0" cy="-56" rx="78" ry="74" />
                      <InPack picture={ITEMS[item]} />
                    </g>
                  </g>
                </g>
              );
            })}
            {/* The front with a pocket under each thing: its number key on a computer, a buckle on a tablet */}
            <path
              d="M92 778 H648 Q660 778 658 798 L650 878 Q646 902 616 902 H124 Q94 902 90 878 L82 798 Q80 778 92 778 Z"
              fill={PACK.body}
              stroke={INK}
              strokeWidth="6"
              strokeLinejoin="round"
            />
            <path d="M98 792 H642" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.35" />
            {POCKETS.map((x, i) => (
              <g key={x}>
                <rect x={x - 50} y="814" width="100" height="74" rx="16" fill={PACK.pocket} stroke={INK} strokeWidth="4" />
                <path d={`M${x - 50} 840 Q${x} 852 ${x + 50} 840`} stroke={INK} strokeWidth="3" fill="none" opacity="0.5" />
                {touchOnly ? (
                  <rect x={x - 11} y="836" width="22" height="20" rx="4" fill={PACK.buckle} stroke={INK} strokeWidth="3" />
                ) : (
                  <KeyCap x={x} y={SLOT_KEY_Y} w={58} on={view.choosing && !!view.bag[i]} down={held === `${i + 1}`}>
                    <text y="15" textAnchor="middle" fontSize="40" fontWeight="800" fontFamily="inherit" fill={INK}>
                      {i + 1}
                    </text>
                  </KeyCap>
                )}
              </g>
            ))}
          </g>
          {/* What a tap hits: a thing with its pocket below it */}
          {POCKETS.map((x, i) => (
            <rect
              key={x}
              x={x - 78}
              y="620"
              width="156"
              height="280"
              fill="transparent"
              onPointerDown={pressSlot(i)}
              role="button"
              aria-label={view.bag[i] ?? "leer"}
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
