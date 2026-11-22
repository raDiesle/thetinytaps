import { type PointerEvent, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { INK } from "@/components/drawing";
import { useDevice } from "@/lib/device";
import { playCountNote, playMelody, playPop, playRandomNote, playSlide } from "@/lib/sfx";
import { loadRealSounds, playGiggle } from "@/lib/realSounds";
import { TRAIL_SOUNDS } from "./sounds";
import { type TargetLanguage, targetLanguageFor } from "@/content/targetLanguages";
import { tapState } from "@/lib/tapTargets";
import { StoryEnd, nextCard } from "../cards";
import { KID_H, Kid, ThoughtBubble, useHero } from "../kid";
import { translationOf } from "../phrases";
import { linesReady, loadLines, sayIn, trailLines } from "../voice";
import { FRIENDS, type FriendPose } from "./friends";
import { allStations, facing, groundY, placed, route } from "./ground";
import { SLOT_COUNT, type Screen, VIEW_H, VIEW_W, layoutHud } from "./hud";
import { Fitted, GOALS, ITEMS, type ItemId, type Picture } from "./items";
import { BagAndButton, ForkSigns, Layer, WantRing, ringOf } from "./layers";
import type { Climb, Cue, Flight, Fork, Moment, Obstacle, Pickup, Point, Station, TrailLevel, Way } from "./types";
import { type KidState, type Next, PACK_SHUT, type View, afloatAt, carryAt, goalAt, handOf, heldOf, itemOf, nextFrom, startView } from "./view";
import { WORRIES } from "./worries";
import "./trail.css";
import { useStepAddress } from "@/lib/stepAddress";

/** Where the child's feet are on the 1600 × 900 picture the backdrops are drawn for: the world scrolls so that they
 * stay there, and `layoutHud` then puts that point where the screen has room for it (`Hud.feet`). */
const KID_AT: Point = [760, 740];
/** How high the child's feet are on the screen in a world that goes up (`turns`), which keeps the whole width. */
const UP_FEET = 620;
/** How much slower the far hills move than the world. */
const FAR = 0.3;
/** Walking time per world point. */
const WALK_MS = 2.6;
/** One step up the stairs. */
const STEP_MS = 380;
/** Sliding time per world point: much faster than walking. */
const SLIDE_MS = 0.9;
/** Floating time per world point, under the umbrella: much slower than walking. */
const FLOAT_MS = 9;
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
/** A tap while something is still going on makes the next tap's walk go by itself: first the footprints and the
 * ghost show for this long, so the child sees where it goes. */
const QUEUED_MS = 600;
/** From the end of the level until „Nochmal“ and „Weiter“ come. */
const END_MS = 6000;
/** The language a level speaks until it is translated. */
const GERMAN = targetLanguageFor("de");
/** A friend walks this far behind the child, clear of its backpack. */
const FRIEND_GAP = 170;
/** A friend running to help or back, per world point: faster than the child walks. */
const RUN_MS = 1.4;

/** How much bigger a thing is where it lies in the world than while it is carried. */
const natural = (picture: Picture) => 1 / Math.min(CARRY / picture.w, CARRY / picture.h);

/** "Weg-Abenteuer": the goal goes away, the child follows it through a scrolling world and uses what it finds. */
export function TrailPlay({
  language,
  level,
  onPick,
}: {
  /** The app language: what the child hears is spoken in it. */
  language: TargetLanguage;
  level: TrailLevel;
  onPick: (id: string) => void;
}) {
  const hero = useHero();
  const theGoal = GOALS[level.goal];
  const { raft } = level;
  /** On the raft here: from the start until the child gets off at `raft.until`. */
  const afloat = (x: number) => afloatAt(level, x);
  const onString = theGoal.carry === "string";
  const [view, setView] = useState<View>(() => startView(level));
  // How far the child got, in the address (stepAddress.ts): the station it walks to, from 1, or the end.
  useStepAddress(view.picking ? "ende" : view.done.length + 1);
  const viewRef = useRef<View>(view);
  const { effects, ripple, glow } = useTapFeedback();
  const { touchOnly } = useDevice();
  /** The key held down right now, so its cap on the screen goes down too. */
  const [held, setHeld] = useState<string | null>(null);

  // The screen's free edges (without a notch) in the picture's units, measured whenever the screen turns or resizes.
  const playEl = useRef<HTMLDivElement>(null);
  const svgEl = useRef<SVGSVGElement>(null);
  const safeEl = useRef<HTMLDivElement>(null);
  const [screen, setScreen] = useState<Screen>({ left: 0, right: VIEW_W, top: 0, bottom: VIEW_H });
  /** Pixels per unit of the picture, for moving its layers. */
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const measure = () => {
      const box = svgEl.current?.getBoundingClientRect();
      const free = safeEl.current?.getBoundingClientRect();
      if (!box || !free) return;
      const scale = Math.min(box.width / VIEW_W, box.height / VIEW_H);
      if (!scale) return;
      const toX = (px: number) => Math.round(VIEW_W / 2 + (px - box.left - box.width / 2) / scale);
      const toY = (px: number) => Math.round(VIEW_H / 2 + (px - box.top - box.height / 2) / scale);
      setScreen({ left: toX(free.left), right: toX(free.right), top: toY(free.top), bottom: toY(free.bottom) });
      setScale(scale);
    };
    measure();
    const watch = new ResizeObserver(measure);
    if (playEl.current) watch.observe(playEl.current);
    return () => watch.disconnect();
  }, []);

  // The level is a script of waits; leaving bumps the generation and drops its timers.
  const generation = useRef(0);
  const timers = useRef(new Set<number>());
  /** Set while the script waits for a tap anywhere. */
  const tapper = useRef<(() => void) | null>(null);
  /** Set while the bag is open: it gets the slot. */
  const chooser = useRef<((slot: number) => void) | null>(null);
  /** Set at a fork while the child picks a way: it gets the way's number. */
  const picker = useRef<((way: number) => void) | null>(null);
  /** A tap came while the script was busy: the next `nextTap` goes on by itself. */
  const queued = useRef(false);
  /** The ground the child walks on: the level's, and from a fork on the picked way's. */
  const ground = useRef(level.ground);
  /** How far along the ground the child is (its x there); in a world that turns, the child is drawn elsewhere. */
  const along = useRef(level.start);
  /** Where a point of the ground is drawn. */
  const place = (p: Point) => placed(level.turns, p);

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

  useEffect(() => loadRealSounds(TRAIL_SOUNDS), []);

  useEffect(
    () => () => {
      generation.current++;
      timers.current.forEach(clearTimeout);
    },
    [],
  );

  /** A level not yet translated into the app language (its title has no translation) is said all in German, so
   * its new lines and the shared ones („Ab in den Rucksack!“) never come in two languages. */
  const voice = translationOf(level.title, language.id) === undefined ? GERMAN : language;

  /** Says a German sentence of the story in the app language, from its recording. */
  const say = (german: string) => sayIn(german, voice);

  const cue = (sounds: Cue[]) => sounds.forEach(([ms, play]) => later(ms, play));

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
    if (theGoal.turn && to[0] !== x0) spinEl.current?.setAttribute("transform", `scale(${to[0] > x0 ? 1 : -1} 1)`);
    const g = generation.current;
    const begin = performance.now();
    const frame = (now: number) => {
      if (g !== generation.current) return;
      const t = Math.min(1, (now - begin) / ms);
      drawGoal(goalAt([x0, y0], to, t, sway), hand);
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

  /** The camera: the world moves so that the child stays at `KID_AT` of the picture (which the HUD's `feet` and `zoom`
   * then put on the screen); a world that goes up stays put sideways and only follows the child's height. */
  const camOf = (k: KidState): Point => (level.turns ? [0, k.y - UP_FEET] : [k.x - KID_AT[0], k.y - KID_AT[1]]);

  /** Where the ground is drawn at `x` of the way. */
  const onGround = (x: number) => place([x, groundY(ground.current, x)]);

  /** The friend (if there is one) runs to the drawn point `to` in `ms`. */
  const friendTo = ([x, y]: Point, ms: number) => put((v) => ({ friend: v.friend && { ...v.friend, x, y, ms, face: x >= v.friend.x ? 1 : -1, pose: "walk" } }));

  /** The friend stays where it is now, doing `pose`, facing the way on. */
  const friendStays = (pose: FriendPose = "sit") =>
    put((v) => ({ friend: v.friend && { ...v.friend, ms: 0, face: facing(level.turns, along.current), pose } }));

  /** The friend runs to the drawn point `to` (a little faster than the child walks) and does `pose` there. */
  const runFriend = async (to: Point, pose: FriendPose = "sit") => {
    const f = viewRef.current.friend;
    if (!f) return;
    const ms = Math.max(300, Math.hypot(to[0] - f.x, to[1] - f.y) * RUN_MS);
    friendTo(to, ms);
    await wait(ms);
    friendStays(pose);
  };

  const hopFriend = () => put((v) => ({ friend: v.friend && { ...v.friend, hop: v.friend.hop + 1 } }));

  /** Walks the child along the ground to `x`; the world scrolls along, and a friend follows behind. */
  const walkTo = async (x: number) => {
    for (const corner of route(ground.current, along.current, x)) {
      const k = viewRef.current.kid;
      const [px, py] = place(corner);
      along.current = corner[0];
      const ms = Math.hypot(px - k.x, py - k.y) * WALK_MS;
      if (ms < 1) continue;
      kid({ x: px, y: py, walk: ms, pose: afloat(corner[0]) ? "paddle" : "walk", face: px >= k.x ? 1 : -1 });
      friendTo(onGround(corner[0] - FRIEND_GAP), ms);
      await wait(ms);
    }
    kid({ walk: 0, pose: "stand", face: facing(level.turns, x) });
    friendStays();
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

  /** Moves the carried thing to `to` in `ms` along a bow `arc` points high, growing or shrinking to `s`; `linear` keeps
   * pace with the child walking or floating. */
  const moveCarry = (to: Point, ms: number, s = carried.current.s, arc = 0, linear = false) => {
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
      const step = carryAt([x0, y0], s0, to, s, t, arc, linear);
      drawCarry(step.at, step.s);
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
    playPop();
    kid({ pose: "stand" });
    await wait(500);
    put({ entering: null });
  };

  /** The thing rises out of the big backpack on the screen, and the child reaches back into its backpack and
   * holds the thing up high. */
  const takeOut = async (item: ItemId, slot: number) => {
    put((v) => ({ leaving: slot, bagBump: v.bagBump + 1 }));
    playPop();
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

  /** Waits for a tap – or, after a tap that came while something was still going on, goes on by itself. */
  const nextTap = () =>
    new Promise<void>((resolve) => {
      tapper.current = resolve;
      if (queued.current) later(QUEUED_MS, () => tapper.current === resolve && tap());
    });

  /** A tap, a click or a key while the script waits for one. */
  const tap = () => {
    const resolve = tapper.current;
    if (resolve) {
      tapper.current = null;
      unqueue();
      resolve();
    }
  };

  /** Nothing waits for the child: the script is walking, packing, using a thing … */
  const busy = () => !tapper.current && !chooser.current && !picker.current && !viewRef.current.picking;

  /** A tap while busy is kept for the next walk, so the child doesn't have to wait and tap again. */
  const queue = () => {
    queued.current = true;
    if (!viewRef.current.queued) put({ queued: true });
  };

  /** A kept tap is dropped where the child has to pick something itself (a thing at an obstacle, a way). */
  const unqueue = () => {
    queued.current = false;
    if (viewRef.current.queued) put({ queued: false });
  };

  /** What the tap at `station` does, from where the child is now (`nextOf` in `view.ts`). */
  const nextOf = (station: Station, on = ground.current): Next => nextFrom(level, along.current, station, on);

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

  // A station where the child does something starts with a tap that walks there, unless the child already tapped its
  // way at a fork (`picked`). The child walks on to an obstacle or a fork by itself: a tap that only walks is no fun.
  const pickup = async (station: Pickup, picked: boolean) => {
    if (!picked) await go(nextOf(station));
    await walkTo(station.x);
    say(station.ask);
    // The child takes the thing, holds it up high and puts it into the backpack.
    kid({ pose: "take" });
    station.sound();
    put((v) => ({ done: [...v.done, station.id], carry: station.item }));
    drawCarry(station.at, natural(ITEMS[station.item]), false);
    await moveCarry(byKid(HAND_OUT), 450, 1);
    await packAway(station.item, viewRef.current.bag.indexOf(null));
    say(station.done);
    await wait(200);
  };

  const nextChoice = () => new Promise<number>((resolve) => (chooser.current = resolve));

  /** The friend's picture rises out of the backpack on the screen, and the friend barks and runs off to `to` to help. */
  const sendFriend = async (slot: number, to: Point, pose: FriendPose) => {
    const f = viewRef.current.friend!;
    put((v) => ({ leaving: slot, bagBump: v.bagBump + 1 }));
    playPop();
    await wait(320);
    put((v) => ({ leaving: null, bag: v.bag.map((thing, i) => (i === slot ? null : thing)) }));
    kid({ pose: "reach" });
    hopFriend();
    FRIENDS[f.id]!.sound();
    await wait(400);
    await runFriend(to, pose);
  };

  /** The friend runs back behind the child; its picture drops into the backpack again at `slot`. */
  const friendBack = async (slot: number | null) => {
    await runFriend(onGround(along.current - FRIEND_GAP));
    if (slot === null) return;
    const id = viewRef.current.friend!.id;
    put((v) => ({ bag: v.bag.map((thing, i) => (i === slot ? id : thing)), entering: slot, bagBump: v.bagBump + 1 }));
    playPop();
    await wait(500);
    put({ entering: null });
  };

  /** The creature just helped joins (G-10): in its place the friend hops and calls, its picture drops into the
   * backpack, and it runs round behind the child. */
  const befriend = async ({ friend: id, from, say: line }: NonNullable<Obstacle["befriends"]>) => {
    put({ friend: { id, x: from[0], y: from[1], ms: 0, face: -1, pose: "sit", hop: 1 } });
    FRIENDS[id]!.sound();
    say(line);
    kid({ pose: "cheer" });
    await wait(600);
    const slot = viewRef.current.bag.indexOf(null);
    put((v) => ({ bag: v.bag.map((thing, i) => (i === slot ? id : thing)), entering: slot, bagBump: v.bagBump + 1 }));
    playPop();
    await wait(500);
    put({ entering: null });
    kid({ pose: "stand" });
    await runFriend(onGround(along.current - FRIEND_GAP));
  };

  const obstacle = async (station: Obstacle) => {
    await walkTo(station.x);
    // Why a thing helps: the creature thinks of what it wants, or the child of what would happen.
    const { why } = station;
    const bubble = "wants" in why ? { picture: ITEMS[station.need], at: why.wants, nudge: 0 } : { picture: WORRIES[why.worry], at: null, nudge: 0 };
    put({ here: station.id, choosing: true, shake: viewRef.current.shake + 1, bubble });
    cue(station.meet);
    say(station.ask);
    /** A friend helped, instead of a thing: it runs back once its job is done. */
    let helped = false;
    for (;;) {
      let stop = () => {};
      const nudge = () => {
        put((v) => ({ hint: station.need, shake: v.shake + 1, bubble: v.bubble && { ...v.bubble, nudge: v.bubble.nudge + 1 } }));
        say(station.ask);
        stop = later(NUDGE_MS, nudge);
      };
      stop = later(NUDGE_MS, nudge);
      unqueue();
      const slot = await nextChoice();
      stop();
      const item = viewRef.current.bag[slot]!;
      put({ choosing: false, hint: null });
      if (item === viewRef.current.friend?.id) {
        // The friend runs over: it does the job itself, or tries, gets a funny "no" and comes back.
        const right = item === station.need;
        await sendFriend(slot, [station.at[0], viewRef.current.kid.y], right ? "work" : "sit");
        if (right) {
          helped = true;
          break;
        }
        put((v) => ({ nope: { id: station.id, n: (v.nope?.n ?? 0) + 1 } }));
        station.nope();
        kid({ pose: "shake" });
        hopFriend();
        await wait(1000);
        kid({ pose: "stand" });
        await friendBack(slot);
        put({ nope: null, hint: station.need, choosing: true });
        continue;
      }
      // Out of the backpack, up high, and over to the obstacle.
      await takeOut(item, slot);
      kid({ pose: "take" });
      await moveCarry(station.at, FLY_MS, natural(ITEMS[item]), 50);
      if (item === station.need) break;
      // Not this one: something funny happens, the thing comes back into the backpack and the right one glows.
      put((v) => ({ nope: { id: station.id, n: (v.nope?.n ?? 0) + 1 } }));
      station.nope();
      kid({ pose: "shake" });
      await wait(1000);
      kid({ pose: "take" });
      await moveCarry(byKid(HAND_OUT), 500, 1, 50);
      await packAway(item, slot);
      put({ nope: null, hint: station.need, choosing: true });
    }
    put((v) => ({
      carry: station.float ? v.carry : null,
      done: station.float ? v.done : [...v.done, station.id],
      bubble: null,
      wear: station.wear ?? v.wear,
    }));
    cue(station.sounds);
    say(station.done);
    if (station.float) await float(station.float, station.id);
    await wait(500);
    kid({ pose: "cheer" });
    await wait(Math.max(0, station.ms - 500));
    if (helped) await friendBack(null);
    if (station.befriends) await befriend(station.befriends);
    if (station.frees) {
      kid({ pose: "reach" });
      await moveGoal(heldOf(viewRef.current.kid, theGoal), 1200, null, onString ? 30 : 0);
      if (onString) drawGoal(goal.current.at, handOf(viewRef.current.kid));
    } else kid({ pose: "stand" });
    put({ here: null });
  };

  /** The child holds the thing up (the open umbrella) and floats down slowly by itself, the thing going along; then it
   * puts the thing down where the level's drawing shows it (stuck into the raft), and the station is done. */
  const float = async ({ to, put: down }: NonNullable<Obstacle["float"]>, id: string) => {
    const k0 = viewRef.current.kid;
    const [hx, hy] = carried.current.at;
    const held: Point = [hx - k0.x, hy - k0.y];
    kid({ pose: "lift" });
    await wait(400);
    for (const point of to) {
      const [x, y] = place(point);
      along.current = point[0];
      const k = viewRef.current.kid;
      const ms = Math.hypot(x - k.x, y - k.y) * FLOAT_MS;
      kid({ x, y, walk: ms });
      void moveCarry([x + held[0], y + held[1]], ms, carried.current.s, 0, true);
      await wait(ms);
    }
    kid({ walk: 0, pose: "take" });
    await moveCarry(byKid(down), 600);
    put((v) => ({ carry: null, done: [...v.done, id] }));
    kid({ pose: "stand" });
  };

  /** One tap walks to the stairs and climbs all of them; a note per step. */
  const climb = async (station: Climb, picked: boolean) => {
    const { steps } = station;
    if (!picked) await go(nextOf(station));
    await walkTo(station.x);
    say(station.ask);
    for (const [i, step] of steps.entries()) {
      const [x, y] = place(step);
      along.current = step[0];
      kid({ x, y, walk: STEP_MS, pose: "walk" });
      playCountNote(i);
      await wait(STEP_MS);
      kid({ walk: 0, pose: "stand" });
    }
    if (station.slide) {
      // Down the slide by itself: "Huiii!" – on the sled, if there is one. A friend, who waited at the bottom, runs along below.
      playSlide();
      if (station.sled) put({ here: station.id, riding: station.sled });
      kid({ pose: station.sled ? "sit" : "cheer" });
      const { slide } = station;
      const from = [steps[steps.length - 1], ...slide].map(place);
      const slideMs = slide.map(place).reduce((sum, [x, y], i) => sum + Math.hypot(x - from[i][0], y - from[i][1]) * SLIDE_MS, 0);
      friendTo(onGround(slide[slide.length - 1][0] - FRIEND_GAP), slideMs);
      for (const point of slide) {
        const k = viewRef.current.kid;
        const [x, y] = place(point);
        along.current = point[0];
        const ms = Math.hypot(x - k.x, y - k.y) * SLIDE_MS;
        kid({ x, y, walk: ms });
        await wait(ms);
      }
      if (station.sled) put((v) => ({ here: null, riding: null, done: [...v.done, station.id] }));
      kid({ walk: 0, pose: "cheer" });
      friendStays();
      playGiggle();
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
    if (s.kind === "obstacle") return obstacle(s);
    if (s.kind === "moment") return moment(s, picked);
    return climb(s, picked);
  };

  /** Two ways: the child walks to the fork by itself, then both ways show where they go first (footprints to a ghost
   * each) and the child taps a sign (or 1 / 2). The picked way's stations follow, starting right away. */
  const fork = async (at: Fork) => {
    await walkTo(at.x);
    unqueue();
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
    playPop();
    say(way.say);
    for (const [i, s] of way.stations.entries()) await station(s, i === 0);
  };

  const softTap = useCallback(
    (x?: number, y?: number) => {
      ripple(x, y);
      playRandomNote();
    },
    [ripple],
  );

  const play = async () => {
    const k = viewRef.current.kid;
    drawGoal(heldOf(k, theGoal), onString ? handOf(k) : null);
    kid({ pose: level.away.pose });
    // Only this level's lines load; its first one holds the start until it is there, so it comes with the goal going away.
    const ready = linesReady([level.away.say], voice);
    loadLines(trailLines(level), voice);
    const g = generation.current;
    await wait(900);
    await ready();
    if (g !== generation.current) return;
    cue(level.away.sounds);
    kid({ pose: "shake" });
    put({ away: true });
    await flyGoal(level.away, null);
    put({ away: false });
    kid({ pose: "stand" });
    put({ bubble: { picture: theGoal, at: null, nudge: 0 } });
    say(level.away.say);
    await wait(1800);
    put({ bubble: null });
    for (const s of level.stations) await (s.kind === "fork" ? fork(s) : station(s));
    // The goal is back in the child's hands: up it goes.
    put({ party: true });
    playMelody();
    say(level.finale.say);
    const finaleMs = level.finale.ms + (level.finale.via ?? []).reduce((sum, [, ms]) => sum + ms, 0);
    await flyGoal(level.finale, onString ? handOf(viewRef.current.kid) : null);
    const { into } = level.finale;
    if (into) put((v) => ({ done: [...v.done, into] }));
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
      glow(e.clientX, e.clientY);
      tap();
    } else softTap(e.clientX, e.clientY);
  };

  /** A creature's bubble was tapped while the bag is open: it shows the thing it wants, so that thing is given, just
   * as if its slot in the backpack (or the friend) had been tapped. Otherwise the tap goes on to the picture. */
  const tapBubble = (e: PointerEvent) => {
    const pick = chooser.current;
    const here = allStations(level).find((s) => s.id === viewRef.current.here);
    const slot = here?.kind === "obstacle" ? viewRef.current.bag.indexOf(here.need) : -1;
    if (!pick || slot < 0) return;
    e.stopPropagation();
    chooser.current = null;
    glow(e.clientX, e.clientY);
    pick(slot);
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
    glow(e.clientX, e.clientY);
    pickWay(way);
  };

  /** The friend was tapped: while the bag is open it is picked like its picture, otherwise it hops and calls. */
  const tapFriend = (e: PointerEvent) => {
    e.stopPropagation();
    const v = viewRef.current;
    if (!v.friend) return;
    const slot = v.bag.indexOf(v.friend.id);
    const pick = chooser.current;
    if (pick && slot >= 0) {
      chooser.current = null;
      glow(e.clientX, e.clientY);
      return pick(slot);
    }
    if (tapper.current) {
      glow(e.clientX, e.clientY);
      return tap();
    }
    if (pick || picker.current) showHint();
    if (v.friend.ms) return;
    hopFriend();
    FRIENDS[v.friend.id]!.sound();
  };

  const tapKid = (e: PointerEvent) => {
    e.stopPropagation();
    if (tapper.current) return tap();
    const k = viewRef.current.kid;
    // Not while walking, nor while the child carries a thing: the thing would stay behind in the air. The tap is
    // kept for the next walk instead.
    if (k.walk || viewRef.current.carry) {
      if (busy()) queue();
      return;
    }
    kid({ hop: k.hop + 1 });
    playGiggle();
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
      if (busy()) queue();
      const way = Number(e.key) - 1;
      if (picker.current && (way === 0 || way === 1)) return pickWay(way);
      const pick = chooser.current;
      const slot = Number(e.key) - 1;
      if (pick && slot >= 0 && slot < SLOT_COUNT && v.bag[slot]) {
        chooser.current = null;
        pick(slot);
      } else {
        if (pick || picker.current) showHint();
        softTap();
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
  const forks = level.stations.filter((s): s is Fork => s.kind === "fork");
  const hud = layoutHud(screen, !touchOnly);
  const { feet, zoom } = hud;
  const [cx, cy] = camOf(k);
  /** Puts the picture's `KID_AT` where the HUD wants the child's feet, zoomed; a world going up keeps the picture. */
  const stage = level.turns ? undefined : `translate(${feet[0]} ${feet[1]}) scale(${zoom}) translate(${-KID_AT[0]} ${-KID_AT[1]})`;
  /** Pixels per unit of the world, zoomed with it. */
  const worldScale = level.turns ? scale : scale * zoom;
  const { Scenery, Front, Backdrop } = level;
  // The world's drawings are big and change only with a station: they are built again only then, not with every
  // step, tap or key (each build cost a phone several frames).
  const friendId = view.friend?.id;
  const { done, here, nope, party } = view;
  const backdrop = useMemo(() => <Backdrop />, [Backdrop]);
  const [scenery, front] = useMemo(() => {
    const props = { done, here, nope, party, friends: friendId ? [friendId] : [] };
    return [<Scenery key="scenery" {...props} />, Front && <Front key="front" {...props} />];
  }, [Scenery, Front, done, here, nope, party, friendId]);
  const Friend = view.friend && FRIENDS[view.friend.id];
  const Thief = level.away.thief;
  const Sled = view.riding;
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
          glow(e.clientX, e.clientY);
          return tap();
        }
        if (busy()) queue();
        if (chooser.current || picker.current) showHint();
        softTap(e.clientX, e.clientY);
      }}
    >
      <div ref={safeEl} className="tl-safe" />
      {/* The picture in layers that move as a whole: the far hills, the world, the friend, the child, what is in front of
          it, and bag and button on top */}
      <Layer scale={worldScale} stage={stage} pan={[cx * FAR, cy * FAR]} ms={k.walk}>
        {backdrop}
      </Layer>
      <Layer scale={worldScale} stage={stage} pan={[cx, cy]} ms={k.walk}>
        {scenery}
        <line ref={stringEl} className="tl-string" stroke={INK} strokeWidth="3" {...firstString} />
        <g ref={goalEl} className="tl-goal" transform={firstGoal} display={level.finale.into && view.done.includes(level.finale.into) ? "none" : undefined}>
          {view.away && Thief && (
            <g className="tl-thief">
              <Thief />
            </g>
          )}
          <g className={view.party && onString ? "tl-sway" : undefined}>
            <g ref={spinEl}>{(theGoal.world ?? theGoal.draw)()}</g>
          </g>
        </g>
        {front}
        {shown.map((n, w) => (
          <g key={`${n.ghost}-${again}`} className="tl-next">
            {n.at && itemOf(n.icon) && <WantRing at={n.at} r={ringOf(ITEMS[itemOf(n.icon)!])} />}
            {n.prints.map(([x, y], i) => (
              <ellipse key={`${x}-${y}`} className="tl-print" cx={x + (i % 2 ? 6 : -6)} cy={y - 4} rx="18" ry="7" style={{ animationDelay: `${i * 90}ms` }} />
            ))}
            <g transform={`translate(${n.ghost[0]} ${n.ghost[1]})`} className={view.fork ? "tl-way-ghost" : undefined} data-tap onPointerDown={pressWay(w)}>
              <g className="tl-ghost" style={{ animationDelay: `${n.prints.length * 90}ms` }}>
                {raft && afloat(n.ghost[0]) && <raft.Raft paddling={false} done={view.done} />}
                <Kid look={hero} pose={n.pose} holding={null} wear={view.wear} face={n.face} backpack={PACK_SHUT} />
              </g>
            </g>
          </g>
        ))}
        {/* The picture signs of the ways at a fork: always there; while the child picks a way they hop and glow */}
        <ForkSigns forks={forks} fork={view.fork} touchOnly={touchOnly} held={held} language={language} pressWay={pressWay} />
        {/* The raft stays behind where the child got off */}
        {raft && !afloat(k.x) && (
          <g transform={`translate(${raft.until} ${groundY(level.ground, raft.until)})`}>
            <raft.Raft paddling={false} done={view.done} />
          </g>
        )}
        <g ref={carryBack} className="tl-carry">
          {carry}
        </g>
      </Layer>
      {/* The friend walking along, behind the child */}
      {view.friend && Friend && (
        <Layer scale={worldScale} stage={stage} pan={[cx, cy]} ms={k.walk} walker={{ x: view.friend.x, y: view.friend.y, ms: view.friend.ms }}>
          <g transform={view.friend.face < 0 ? "scale(-1 1)" : undefined}>
            <g className={view.party ? "tl-friend-party" : undefined}>
              <g
                className={view.friend.hop ? `el-hopper hop-${view.friend.hop % 2}` : "el-hopper"}
                data-tap={tapState({ goal: need === view.friend.id })}
                onPointerDown={tapFriend}
              >
                <Friend.Body pose={view.friend.pose} />
              </g>
            </g>
          </g>
        </Layer>
      )}
      <Layer scale={worldScale} stage={stage} pan={[cx, cy]} ms={k.walk} walker={{ x: k.x, y: k.y, ms: k.walk }}>
        {raft && afloat(k.x) && <raft.Raft paddling={k.pose === "paddle"} done={view.done} />}
        {Sled && <Sled />}
        <g className={k.hop ? `el-hopper hop-${k.hop % 2}` : "el-hopper"} data-tap onPointerDown={tapKid}>
          <Kid look={hero} pose={k.pose} holding={null} wear={view.wear} face={k.face} backpack={view.pack} />
        </g>
        {view.bubble && !view.bubble.at && <ThoughtBubble picture={view.bubble.picture} height={KID_H} nudge={view.bubble.nudge} />}
      </Layer>
      <Layer scale={worldScale} stage={stage} pan={[cx, cy]} ms={k.walk}>
        <g ref={carryFront} className="tl-carry">
          {carry}
        </g>
        {view.bubble?.at && (
          <g
            transform={`translate(${view.bubble.at[0]} ${view.bubble.at[1]})`}
            data-tap={view.choosing ? tapState({ goal: true }) : undefined}
            onPointerDown={tapBubble}
          >
            <ThoughtBubble picture={view.bubble.picture} height={0} nudge={view.bubble.nudge} right={view.bubble.at[0] >= k.x} />
          </g>
        )}
      </Layer>
      <Layer scale={scale} pan={[0, 0]} ms={0} svgRef={svgEl}>
        <BagAndButton view={view} hud={hud} need={need} held={held} touchOnly={touchOnly} language={language} pressSlot={pressSlot} />
      </Layer>

      {view.picking && <StoryEnd id={level.id} onPick={onPick} />}
      <FeedbackLayer effects={effects} />
    </div>
  );
}
