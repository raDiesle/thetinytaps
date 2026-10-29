// A game opened as a step of a routine (the Tagesplan's 🪥 card opens Zähne putzen): it plays at once, without its
// start screen, and leaving it (✕, Esc, „Menü“) goes back to the routine instead of the game's menu. Such a step is
// part of the day, not play: it counts no play time and plays also when play time is over (GameShell, PlaytimeLock).

/** The router state a routine passes when it opens a game for one of its steps. */
export interface RoutineVisit {
  /** The page to go back to afterwards, a path of this app. */
  returnTo: string;
}

/** Where a game opened from a routine goes back to (from the router's `location.state`); none when opened from a menu. */
export function routineReturn(state: unknown): string | undefined {
  const to = (state as Partial<RoutineVisit> | null)?.returnTo;
  // Only a path inside the app: never another site (`//host`).
  return typeof to === "string" && to.startsWith("/") && !to.startsWith("//") ? to : undefined;
}

/** A routine's step waiting for its game during this visit: which one, and whether the game finished it. */
interface WaitingStep {
  returnTo: string;
  /** The routine's own key for the step, handed back by `takeFinishedStep`. */
  step: string;
  done: boolean;
}

/** Kept per visit only (sessionStorage): a step opened yesterday must not tick today. */
const WAITING_KEY = "tinytaps.routine.step";

function readWaiting(): WaitingStep | undefined {
  try {
    const raw = sessionStorage.getItem(WAITING_KEY);
    return raw ? (JSON.parse(raw) as WaitingStep) : undefined;
  } catch {
    return undefined;
  }
}

function writeWaiting(waiting: WaitingStep | undefined) {
  try {
    if (waiting) sessionStorage.setItem(WAITING_KEY, JSON.stringify(waiting));
    else sessionStorage.removeItem(WAITING_KEY);
  } catch {
    // Storage unavailable: the step is then ticked only as the game's own log tells.
  }
}

/** A routine opens a game for one of its steps; call it right before navigating there with `RoutineVisit`. */
export function waitForStep(returnTo: string, step: string) {
  writeWaiting({ returnTo, step, done: false });
}

/**
 * The game did what a routine may have opened it for (the brushing is finished): the waiting step counts as done,
 * whatever the game's own log says (Zähne putzen files a brushing by the clock, a morning routine may run late).
 * Nothing happens when no routine is waiting.
 */
export function finishRoutineStep() {
  const waiting = readWaiting();
  if (waiting) writeWaiting({ ...waiting, done: true });
}

/** The step a game finished for this routine, once; none when the game was left before its end. */
export function takeFinishedStep(returnTo: string): string | undefined {
  const waiting = readWaiting();
  if (!waiting || waiting.returnTo !== returnTo) return undefined;
  writeWaiting(undefined);
  return waiting.done ? waiting.step : undefined;
}
