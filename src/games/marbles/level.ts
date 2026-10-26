import { useEffect, useRef, useState } from "react";
import { type Localized, useT } from "@/lib/language";
import { LEVEL_TEXTS } from "./content";
import type { MarbleLevel } from "./settings";

/** What every level gets from the game around it. */
export interface LevelProps {
  /** Plays a sound effect, unless sounds are off. */
  sound: (play: () => void) => void;
  /** Says a line in the app language, if speech is on; every line comes in German and Russian. */
  say: (text: Localized) => void;
  /** The level is finished: the machine has run, everything has fallen over, or the marble run's basket is full. */
  onDone: () => void;
}

/** The picture's size; every level draws in these coordinates. */
export const VIEW_W = 1600;
export const VIEW_H = 900;

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
