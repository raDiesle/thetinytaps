import { type CSSProperties, useEffect, useRef, useState } from "react";
import { type Localized, useT } from "@/lib/language";
import { LEVEL_TEXTS } from "./content";
import type { MarbleLevel } from "./settings";

/** What every level gets from the game around it. */
export interface LevelProps {
  /** Plays a sound effect, unless sounds are off. */
  sound: (play: () => void) => void;
  /** Says a line in the app language, after what is being said; with `queue` false it cuts that off instead (a count that must keep up with the picture). */
  say: (text: Localized, queue?: boolean) => void;
  /** The level is finished: the machine has run, everything has fallen over, or the marble run's basket is full. */
  onDone: () => void;
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

/** A wobble that starts at `amp` and dies away, `age` seconds after a hit. */
export const wobble = (age: number, amp: number, freq: number, damp: number) => (age < 0 || age > 4 ? 0 : amp * Math.exp(-age * damp) * Math.sin(age * freq));

/**
 * Calls `step(dt, now)` on every animation frame and renders again after it.
 * `dt` is capped, so a tab coming back from the background doesn't jump.
 */
export function useFrames(step: (dt: number, now: number) => void) {
  const [, setFrame] = useState(0);
  const stepRef = useRef(step);
  stepRef.current = step;
  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      stepRef.current(dt, now);
      setFrame((f) => f + 1);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);
}

/** Any key but Esc (which leaves the game) counts as a tap; `onKey` gets the key's event for games that give some keys their own job. */
export function useAnyKey(onKey: (e: KeyboardEvent) => void) {
  const ref = useRef(onKey);
  ref.current = onKey;
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.repeat) return;
      ref.current(e);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}

/** The level's name in the app language, for its picture's label. */
export function useLevelName(level: MarbleLevel) {
  const t = useT();
  return t(LEVEL_TEXTS[level].name);
}
