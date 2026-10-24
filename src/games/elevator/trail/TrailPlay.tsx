import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { INK } from "@/games/scenes/shared";
import { playCountNote, playGiggle, playMelody, playPop, playRandomNote } from "@/lib/sfx";
import { speak } from "@/lib/speech";
import { cardForKey, StoryCards } from "../cards";
import { Confetti, TapMark } from "../house";
import { HERO, KID_H, Kid, ThoughtBubble, type Pose } from "../kid";
import type { ElevatorSettings } from "../settings";
import { groundY, route } from "./ground";
import { Fitted, GOALS, ITEMS, Kite, type ItemId } from "./items";
import type { Climb, Cue, Obstacle, Pickup, Point, TrailLevel } from "./types";
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
/** A thing flying between the bag and the world. */
const FLY_MS = 650;
/** Without a tap for so long, the hand pops up again (and while choosing, the right thing glows). */
const NUDGE_MS = 7000;
/** From the end of the level until the picture cards come. */
const END_MS = 6000;
/** The bag's slots on the screen; the bag holds three things at most. */
const SLOTS: Point[] = [
  [262, 822],
  [432, 822],
  [602, 822],
];
const SLOT_R = 74;

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
  /** Where the hand points, in the world; `n` makes it pop up anew. */
  target: { x: number; y: number; n: number } | null;
  /** The thought bubble with the goal pops up anew for every `n`. */
  bubble: number | null;
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
  target: null,
  bubble: null,
  party: false,
});

/** The hand of the child reaching out (pose "reach", facing right), where the string is held. */
const handOf = (kid: KidState): Point => [kid.x + 62, kid.y - 112];
/** Where the goal is while the child holds it by its string. */
const heldOf = (kid: KidState): Point => [kid.x + 140, kid.y - 250];

/** "Weg-Abenteuer": the goal goes away, the child follows it through a scrolling world and uses what it finds. */
export function TrailPlay({
  lang,
  settings,
  level,
  onPick,
}: {
  lang: string;
  settings: ElevatorSettings;
  level: TrailLevel;
  onPick: (id: string) => void;
}) {
  const [view, setView] = useState<View>(() => startView(level));
  const viewRef = useRef<View>(view);
  const { bursts, spawn } = useBursts();

  // The level is a script of waits; leaving bumps the generation and drops its timers.
  const generation = useRef(0);
  const timers = useRef(new Set<number>());
  /** Set while the script waits for a tap anywhere. */
  const tapper = useRef<(() => void) | null>(null);
  /** Set while the bag is open: it gets the slot. */
  const chooser = useRef<((slot: number) => void) | null>(null);

  // The goal (the kite) moves along curves, so it is moved frame by frame, not by React.
  const goalEl = useRef<SVGGElement>(null);
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

  /** Draws the goal at `at`, with its string to `hand` if it is held. */
  const drawGoal = (at: Point, hand: Point | null) => {
    goal.current = { at, hand };
    goalEl.current?.setAttribute("transform", `translate(${at[0]} ${at[1]})`);
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

  /** The camera: the world moves so that the child stays at `KID_AT`. */
  const camOf = (k: KidState): Point => [k.x - KID_AT[0], k.y - KID_AT[1]];
  const onScreen = ([x, y]: Point): Point => {
    const [cx, cy] = camOf(viewRef.current.kid);
    return [x - cx, y - cy];
  };

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

  /** The hand points at `at` until the child taps (anywhere); it pops up again after a while. */
  const tapAt = async ([x, y]: Point) => {
    put((v) => ({ target: { x, y, n: (v.target?.n ?? 0) + 1 } }));
    let stop = () => {};
    const nudge = () => {
      put((v) => ({ target: v.target && { ...v.target, n: v.target.n + 1 }, bubble: (v.bubble ?? 0) + 1 }));
      stop = later(NUDGE_MS, nudge);
    };
    stop = later(NUDGE_MS, nudge);
    await nextTap();
    stop();
    put({ target: null, bubble: null });
  };

  const pickup = async (station: Pickup) => {
    await tapAt(station.at);
    await walkTo(station.x);
    say(station.ask);
    kid({ pose: "reach" });
    sound(station.sound);
    const slot = viewRef.current.bag.indexOf(null);
    put((v) => ({ done: [...v.done, station.id] }));
    await fly(station.item, onScreen(station.at), SLOTS[slot]);
    put((v) => ({ flight: null, bag: v.bag.map((thing, i) => (i === slot ? station.item : thing)) }));
    sound(playPop);
    say(station.done);
    kid({ pose: "stand" });
    await wait(300);
  };

  const nextChoice = () => new Promise<number>((resolve) => (chooser.current = resolve));

  const obstacle = async (station: Obstacle) => {
    await tapAt([station.at[0], Math.max(station.at[1], viewRef.current.kid.y - 120)]);
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
      await fly(item, SLOTS[slot], onScreen(station.at));
      if (item === station.need) break;
      // Not this one: something funny happens, the thing comes back and the right one glows.
      put((v) => ({ nope: { id: station.id, n: (v.nope?.n ?? 0) + 1 } }));
      sound(station.nope);
      kid({ pose: "shake" });
      await wait(1000);
      await fly(item, onScreen(station.at), SLOTS[slot]);
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
      await moveGoal(heldOf(viewRef.current.kid), 1200, null, 30);
      drawGoal(goal.current.at, handOf(viewRef.current.kid));
    } else kid({ pose: "stand" });
    put({ here: null });
  };

  const climb = async (station: Climb) => {
    await tapAt([station.steps[0][0], station.steps[0][1] - 40]);
    await walkTo(station.x);
    say(station.ask);
    for (const [i, [x, y]] of station.steps.entries()) {
      if (i > 0) await tapAt([x, y - 40]);
      kid({ x, y, walk: STEP_MS, pose: "walk" });
      sound(() => playCountNote(i));
      await wait(STEP_MS);
      kid({ walk: 0, pose: "stand" });
    }
    say(station.done);
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
    drawGoal(heldOf(k), handOf(k));
    kid({ pose: level.away.pose });
    await wait(900);
    cue(level.away.sounds);
    kid({ pose: "shake" });
    await moveGoal(level.away.to, level.away.ms, null, 120);
    kid({ pose: "stand" });
    put({ bubble: 1 });
    say(level.away.say);
    await wait(1800);
    put({ bubble: null });
    for (const station of level.stations) {
      if (station.kind === "pickup") await pickup(station);
      else if (station.kind === "obstacle") await obstacle(station);
      else await climb(station);
    }
    // The goal is back in the child's hands: up it goes.
    put({ party: true });
    sound(playMelody);
    say(level.finale.say);
    for (let i = 0; i < 8; i++) later(i * 250, () => spawn());
    await moveGoal(level.finale.to, level.finale.ms, handOf(viewRef.current.kid), 60);
    await wait(END_MS - level.finale.ms);
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
    if (k.walk) return;
    kid({ hop: k.hop + 1 });
    sound(playGiggle);
  };

  // Any key goes on when the hand shows; 1–3 take a thing out of the open bag; 1–4 pick a card at the end.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.key === "Escape") return;
      const v = viewRef.current;
      if (v.picking) {
        const card = cardForKey(e.key);
        if (card) onPick(card.id);
        else funBurst();
        return;
      }
      if (tapper.current) return tap();
      const pick = chooser.current;
      const slot = Number(e.key) - 1;
      if (pick && slot >= 0 && slot < SLOTS.length && v.bag[slot]) {
        chooser.current = null;
        pick(slot);
      } else {
        if (pick) showHint();
        funBurst();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const { kid: k, flight } = view;
  const [cx, cy] = camOf(k);
  const pan = (depth: number): CSSProperties => ({ transform: `translate(${-cx * depth}px, ${-cy * depth}px)`, transitionDuration: `${k.walk}ms` });
  const { Scenery, Backdrop } = level;
  // Where the goal is drawn before the script moves it: in the hands at the start. React sets these
  // once; after that the script moves goal and string by itself.
  const [startHand, startHeld] = [handOf(startView(level).kid), heldOf(startView(level).kid)];
  const firstGoal = `translate(${startHeld[0]} ${startHeld[1]})`;
  const firstString = { x1: startHand[0], y1: startHand[1], x2: startHeld[0], y2: startHeld[1] };

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
            <g className={view.party ? "tl-sway" : undefined}>
              <Kite />
            </g>
          </g>
          <g className="tl-walker" style={{ transform: `translate(${k.x}px, ${k.y}px)`, transitionDuration: `${k.walk}ms` }}>
            <g className={k.hop ? `el-hopper hop-${k.hop % 2}` : "el-hopper"} onPointerDown={tapKid}>
              <Kid look={HERO} pose={k.pose} holding={null} wear={[]} face={k.face} />
            </g>
            {view.bubble !== null && <ThoughtBubble key={view.bubble} picture={GOALS[level.goal]} height={KID_H} />}
          </g>
          {view.target && <TapMark key={view.target.n} x={view.target.x} y={view.target.y} />}
        </g>

        {/* The bag with its three slots, always in the bottom corner */}
        <g className={`tl-bag${view.choosing ? " open" : ""}`}>
          <g transform="translate(96 836)">
            <path d="M-56 -40 Q-60 40 0 44 Q60 40 56 -40 Q30 -56 0 -56 Q-30 -56 -56 -40 Z" fill="#c08552" stroke={INK} strokeWidth="5" />
            <path d="M-50 -42 Q0 -20 50 -42" stroke={INK} strokeWidth="5" fill="none" />
            <path d="M-20 -54 Q0 -84 20 -54" stroke="#8d5a3b" strokeWidth="8" fill="none" />
          </g>
          {SLOTS.map(([x, y], i) => {
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
                {item && (
                  <g transform={`translate(${x} ${y})`}>
                    <Fitted picture={ITEMS[item]} width={104} />
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

      {view.picking && <StoryCards again onPick={onPick} />}
      <BurstLayer bursts={bursts} />
    </div>
  );
}
