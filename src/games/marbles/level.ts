import { type CSSProperties, useEffect, useRef, useState } from "react";
import { type Localized, useT } from "@/lib/language";
import { createStore } from "@/lib/store";
import { LEVEL_TEXTS } from "./content";
import type { MarbleLevel } from "./settings";

/** What every level gets from the game around it. */
export interface LevelProps {
  /** Plays a sound effect. */
  sound: (play: () => void) => void;
  /** Says a line in the app language, after what is being said; with `queue` false it cuts that off instead (a count that must keep up with the picture). */
  say: (text: Localized, queue?: boolean) => void;
  /** The level is finished: the machine has run, everything has fallen over, or the marble run's basket is full. */
  onDone: () => void;
  /**
   * The first ball has reached the goal (the marble run's basket or tubes, the pegboard's bins): enough for the level's
   * trophy, given here already (user decision, November 2026). Levels without such a goal leave it to their end.
   */
  onGoal?: () => void;
  /** Nothing waits for the child: what would wait for a tap goes on by itself (the start screen's choice: the marble run's barrier and switch, the machines' stops). */
  watch?: boolean;
}

/** The picture's size; every level draws in these coordinates. */
export const VIEW_W = 1600;
export const VIEW_H = 900;

/** A rectangle of a level's world, in its coordinates. */
export interface WorldRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * The whole world drawn once in one big svg, and the camera a CSS transform of it: the svg's size and its transform so
 * that `view` (the part of `world` the camera shows, its top left corner and its size before zooming) fills `box` as
 * `preserveAspectRatio="xMidYMid meet"` would, `zoom` times as big. A phone only moves the finished picture then, where a
 * changed viewBox or a moved group inside the svg made it paint the whole picture again in every frame (the marble run
 * and the machines stuttered on phones). The svg is `.marble-camera` (a layer of its own, `overflow: visible`).
 */
export function cameraLayer(box: HTMLElement | null, world: WorldRect, view: WorldRect, zoom = 1): CSSProperties {
  const { s, dx, dy } = cameraFit(box, world, view, zoom);
  return { width: world.w * s, height: world.h * s, transform: `translate3d(${dx}px, ${dy}px, 0)${zoom === 1 ? "" : ` scale(${zoom})`}` };
}

/** The numbers behind `cameraLayer`: the svg's scale `s` before zooming and where its top left corner lands in `box`. */
function cameraFit(box: HTMLElement | null, world: WorldRect, view: WorldRect, zoom: number) {
  const w = box?.clientWidth || window.innerWidth;
  const h = box?.clientHeight || window.innerHeight;
  const s = Math.min(w / view.w, h / view.h);
  const dx = (w - view.w * s) / 2 - (view.x - world.x) * s * zoom;
  const dy = (h - view.h * s) / 2 - (view.y - world.y) * s * zoom;
  return { s, dx, dy };
}

/**
 * Where a point of the world lands in `box` with the same camera as `cameraLayer`, in pixels, and how many pixels one
 * unit of the world is there (`k`): for what lies over the picture as HTML, like the shared `TapHint`.
 */
export function cameraPoint(box: HTMLElement | null, world: WorldRect, view: WorldRect, zoom = 1) {
  const { s, dx, dy } = cameraFit(box, world, view, zoom);
  const k = s * zoom;
  return (x: number, y: number) => ({ x: dx + (x - world.x) * k, y: dy + (y - world.y) * k, k });
}

/**
 * The shared `TapHint` at a spot of the world (its middle `x`, `y` and radius `r` in world units), placed by `at` from
 * `cameraPoint`. The hand is about as big as a spot's glow, in world units too, so it keeps its size in the picture.
 */
export function worldHint(at: ReturnType<typeof cameraPoint>, spot: { x: number; y: number; r: number }) {
  const p = at(spot.x, spot.y);
  return { x: p.x, y: p.y, r: spot.r * p.k, size: HINT_HAND * p.k };
}

/** How tall the hint's hand is, in world units (the picture is 1600 × 900). */
export const HINT_HAND = 150;

/** Seconds after a hit until its wobble, flash or sparkles are over (`wobble`, `Sparkles`): a level still from then on can stop drawing. */
export const SETTLE_S = 4;

/**
 * `Math.exp(-x)` that reaches 0: once it is below about 1/8000 it is 0. Whatever dies away with a plain exponential
 * (a net's sag, a crank slowing down, a lid settling) never comes to rest and changed the picture by a fraction of a
 * pixel in every frame for the rest of the level, which kept the phone painting it (perf, November 2026;
 * `decay.test.ts` keeps the levels on it).
 */
export const decay = (x: number) => (x > 9 ? 0 : Math.exp(-x));

/**
 * What is left of a wobble when it stops: below this share of its start it is too small to see. Until `SETTLE_S` the
 * farm's barn kept turning by 0.0001° and the phone painted the whole barn again in every frame (perf, A-36).
 */
export const WOBBLE_REST = 0.005;

/** A wobble that starts at `amp` and dies away, `age` seconds after a hit; exactly 0 once it is too small to see. */
export const wobble = (age: number, amp: number, freq: number, damp: number) => {
  if (age < 0 || age > SETTLE_S) return 0;
  const left = Math.exp(-age * damp);
  return left < WOBBLE_REST ? 0 : amp * left * Math.sin(age * freq);
};

/** True while a camera (or anything gliding after a target) is still visibly on its way, in world units. */
export const gliding = (from: number, to: number) => Math.abs(to - from) > 0.1;

/**
 * The least time between two drawings of a level, in ms: a screen of 60 or 90 Hz draws every frame, one of 120 or 144 Hz
 * (a gaming phone) every second one, so a level is drawn at most about 60–72 times a second. Each drawing renders the
 * level's svg again and has the phone paint and raster what changed, and at 120 Hz that work doubled – a fast gaming
 * phone stuttered now and then where a 60 Hz one did not (user feedback, November 2026). Motion stays even, since every
 * second frame of a 120 Hz screen is drawn.
 */
export const MIN_DRAW_MS = 10;

/**
 * One frame of `useFrames`: steps the level and says whether to draw it again. The first step returning `false`
 * (nothing moves after it) is still drawn, so the picture shows where things came to rest, and then nothing until a
 * step moves again. A level is drawn at most every `MIN_DRAW_MS`; a change in a frame left out is drawn with the next.
 * `dt` is capped, so a tab coming back from the background doesn't jump.
 */
export function frameTicker(step: (dt: number, now: number) => boolean, draw: () => void, start: number) {
  let last = start;
  let moved = true;
  /** Something changed since the last drawing. */
  let owed = true;
  let drawn = Number.NEGATIVE_INFINITY;
  return (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const moving = step(dt, now);
    if (moving || moved) owed = true;
    moved = moving;
    // A frame timestamp may come a hair early; half a millisecond of slack keeps a 90 Hz screen (11.1 ms) on every frame.
    if (owed && now - drawn >= MIN_DRAW_MS - 0.5) {
      owed = false;
      drawn = now;
      draw();
    }
  };
}

/**
 * Calls `step(dt, now)` on every animation frame and renders again after it – but only while `step` says something
 * moves (code review R-G7, November 2026: every level rendered 60 times a second also while it waited for the first
 * tap, at a stop and behind the end). A step that returns `false` must count everything that changes the picture as
 * moving: the clock, a camera gliding (`gliding`), an age-driven wobble or flash not yet over (`SETTLE_S`). The step
 * itself runs every frame either way, so what it times never misses a beat; a tap only changes refs, and the next step
 * sees it moving. A resize draws once, since the camera's layer is measured from the box.
 */
export function useFrames(step: (dt: number, now: number) => boolean) {
  const [, setFrame] = useState(0);
  const stepRef = useRef(step);
  stepRef.current = step;
  useEffect(() => {
    let frame = 0;
    const draw = () => setFrame((f) => f + 1);
    const tick = frameTicker((dt, now) => stepRef.current(dt, now), draw, levelNow());
    // While paused no step runs, so nothing moves, sounds or ends; `now` is the level clock, which stands still meanwhile.
    const loop = () => {
      if (!paused.get()) tick(levelNow());
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    window.addEventListener("resize", draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", draw);
    };
  }, []);
}

/** Any key but Esc (which leaves the game) counts as a tap; `onKey` gets the key's event for games that give some keys their own job. */
export function useAnyKey(onKey: (e: KeyboardEvent) => void) {
  const ref = useRef(onKey);
  ref.current = onKey;
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // While paused a key only goes on with the level (`PauseVeil`), never into it.
      if (e.key === "Escape" || e.repeat || paused.get()) return;
      ref.current(e);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}

/*
 * Pause (user request, November 2026: „jederzeit Pause drücken oder ein Level überspringen“). A level runs on the level
 * clock: the wall's time without the time spent paused. While paused, `useFrames` runs no step and the level timers
 * wait, so a machine, a falling marble, a sound or a level's end all hold where they are and go on from there. A level
 * never reads `performance.now()` or `Date.now()` itself and never waits with `setTimeout`: it takes `now` from
 * `useFrames`, `levelNow()` in a tap's handler, and `later` of `useLevelTimers` (`pause.test.ts`).
 */

/** Whether the level on screen is paused. */
export const paused = createStore(false);
/** When the pause began (wall time), and how long earlier pauses lasted together. */
let pausedSince = 0;
let pausedFor = 0;
paused.subscribe(() => {
  if (paused.get()) pausedSince = performance.now();
  else pausedFor += performance.now() - pausedSince;
});

/** The level clock in milliseconds: the wall's time minus every pause, standing still while paused. */
export const levelNow = () => (paused.get() ? pausedSince : performance.now()) - pausedFor;

/** A handle of `later`, to drop that one wait early. */
export interface LevelTimer {
  cancel: () => void;
}

/**
 * Waits on the level clock, dropped when the level is left (like `useTimers`) and held while paused: `later(fn, ms)`
 * calls `fn` once the level has run `ms` more milliseconds. Stable from render to render.
 */
export function useLevelTimers() {
  const [timers] = useState(levelTimerSet);
  useEffect(() => timers.clearAll, [timers]);
  return timers;
}

/** The part of `useLevelTimers` that needs no component. */
export function levelTimerSet() {
  interface Wait {
    fn: () => void;
    due: number;
    timer?: ReturnType<typeof setTimeout>;
  }
  const waits = new Set<Wait>();
  const arm = (wait: Wait) => {
    wait.timer = setTimeout(
      () => {
        waits.delete(wait);
        wait.fn();
      },
      Math.max(0, wait.due - levelNow()),
    );
  };
  const stop = (wait: Wait) => {
    if (wait.timer !== undefined) clearTimeout(wait.timer);
    wait.timer = undefined;
  };
  // Paused, every wait stops; going on, each is set again for what was left of it.
  let unsubscribe: (() => void) | undefined;
  const follow = () => {
    if (unsubscribe || waits.size === 0) return;
    unsubscribe = paused.subscribe(() => waits.forEach((wait) => (paused.get() ? stop(wait) : arm(wait))));
  };
  return {
    later(fn: () => void, ms: number): LevelTimer {
      const wait: Wait = { fn, due: levelNow() + ms };
      waits.add(wait);
      if (!paused.get()) arm(wait);
      follow();
      return {
        cancel: () => {
          stop(wait);
          waits.delete(wait);
        },
      };
    },
    clearAll() {
      waits.forEach(stop);
      waits.clear();
      unsubscribe?.();
      unsubscribe = undefined;
    },
  };
}

/** The level's name in the app language, for its picture's label. */
export function useLevelName(level: MarbleLevel) {
  const t = useT();
  return t(LEVEL_TEXTS[level].name);
}
