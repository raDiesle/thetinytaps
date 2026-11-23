import { createContext, type PointerEvent, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ControlIcon } from "@/components/ControlIcon";
import { type EnglishFirst, useT } from "@/lib/language";
import { noPointerClick } from "@/lib/press";
import { PAUSE } from "@/lib/sharedTexts";

// Pause and start over (user request, 23 November 2026: „jeder Timer sollte pausiert und wiederholt werden können,
// verbunden mit der Fortschrittsleiste“): a round paper button at the bar's start stops the whole timer – the picture,
// the bar, the note in the corner, the pieces' sounds – and a veil over it then offers the big ▶ to go on and the round
// arrow to start the same timer over. The run keeps its own clock (`RunClock`): the real clock minus the time spent
// paused, so everything worked out from the clock (the end, the caterpillar's bites, the alarm clock's digits, whose
// turn it is) stands still while paused and goes on from there, while the CSS animations simply stand still too.

/** „Go on“: read out on the big ▶ in the pause. */
export const RESUME: EnglishFirst = {
  en: "Go on",
  de: "Weiter",
  zh: "继续",
  hi: "जारी रखें",
  es: "Seguir",
  ar: "متابعة",
  ru: "Продолжить",
};

/** „Start over“: read out on the round arrow in the pause. */
export const START_OVER: EnglishFirst = {
  en: "Start over",
  de: "Von vorn",
  zh: "重新开始",
  hi: "फिर से शुरू करें",
  es: "Empezar de nuevo",
  ar: "البدء من جديد",
  ru: "Сначала",
};

/** A run's clock: the time it has run, as a moment like `Date.now()`, standing still while paused. */
export interface RunClock {
  /** Now, on the run's clock: `Date.now()` less every pause so far, held where a pause began. */
  now: () => number;
  /** Paused right now. */
  paused: boolean;
}

/** Outside a run (a menu's card), the run's clock is the real one. */
const RunClockContext = createContext<RunClock>({ now: Date.now, paused: false });

/** Hands a run's clock to the pictures drawn in it. */
export const RunClockProvider = RunClockContext.Provider;

/** The run's clock the pictures count by (the real clock on a menu's card). */
export function useRunClock() {
  return useContext(RunClockContext);
}

/**
 * A run's clock that can be paused: `clock` for the run and its pictures, `pause` and `resume` for the controls, and
 * `pausedOnce` telling whether it ever stopped (a clock time set, „bis 17:30“, is then no longer where it ends).
 */
export function usePausableClock() {
  const state = useRef<{ off: number; at: number | null }>({ off: 0, at: null });
  const [paused, setPaused] = useState(false);
  const now = useCallback(() => (state.current.at ?? Date.now()) - state.current.off, []);
  const pause = useCallback(() => {
    if (state.current.at !== null) return;
    state.current.at = Date.now();
    setPaused(true);
  }, []);
  const resume = useCallback(() => {
    const s = state.current;
    if (s.at === null) return;
    s.off += Date.now() - s.at;
    s.at = null;
    setPaused(false);
  }, []);
  const clock = useMemo<RunClock>(() => ({ now, paused }), [now, paused]);
  return { clock, pause, resume, pausedOnce: paused || state.current.off > 0 };
}

/**
 * The pause's controls. Running, the round button with two bars at the bar's start (`.tm-pause-button`, also where the
 * bar is switched off). Paused, a veil over the picture with the big ▶ to go on and the round arrow to start over, side
 * by side and no words – children don't read. A tap anywhere else on the veil, or any key but Esc, goes on too, so a
 * child who paused by chance is never stuck; starting over takes two taps (pause, then the arrow), never one by chance.
 */
export function PauseControls({ paused, onPause, onResume, onRestart }: { paused: boolean; onPause: () => void; onResume: () => void; onRestart: () => void }) {
  const t = useT();

  // Paused, a key only goes on – caught before the timer's own keys, which answer every key while it runs.
  useEffect(() => {
    if (!paused) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.repeat) return;
      e.stopPropagation();
      e.preventDefault();
      onResume();
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [paused, onResume]);

  const stop = (e: PointerEvent) => e.stopPropagation();

  if (!paused)
    return (
      <button
        type="button"
        className="tm-pause-button"
        data-tap=""
        aria-label={t(PAUSE)}
        onPointerDown={(e) => {
          stop(e);
          onPause();
        }}
        onClick={noPointerClick(onPause)}
      >
        <ControlIcon kind="pause" className="tm-pause-icon" />
      </button>
    );

  return (
    <div
      className="tm-pause"
      data-tap-root
      onPointerDown={(e) => {
        stop(e);
        onResume();
      }}
    >
      <button
        type="button"
        className="tm-pause-go-on"
        data-tap="goal"
        aria-label={t(RESUME)}
        onPointerDown={(e) => {
          stop(e);
          onResume();
        }}
        onClick={noPointerClick(onResume)}
      >
        <ControlIcon kind="play" className="tm-pause-play" />
      </button>
      <button
        type="button"
        className="tm-pause-again"
        data-tap=""
        aria-label={t(START_OVER)}
        onPointerDown={(e) => {
          stop(e);
          onRestart();
        }}
        onClick={noPointerClick(onRestart)}
      >
        <ControlIcon kind="again" className="tm-pause-again-arrow" />
      </button>
    </div>
  );
}
