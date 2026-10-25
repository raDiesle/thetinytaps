/**
 * Tap areas bigger than they look, for small fingers that land a little off.
 *
 * Everything a child can tap carries `data-tap`. A tap up to `TAP_SLOP_PX` next to it still
 * counts as a tap on it: `forwardNearTaps` (installed by `GameShell` on the play area) sends the
 * pointerdown on to the thing. Where the grown areas of several things overlap, the right
 * answer wins (`data-tap="goal"`), then one not tapped yet (anything but `data-tap="done"`),
 * then the nearest; the one right under the finger wins a tie.
 *
 * - `data-tap-area` on children (e.g. invisible rects): measure these instead of the whole drawing.
 * - `data-tap-root`: things are only looked for inside the same root (by default the play area),
 *   so a tap on an overlay never reaches the game behind it.
 * - `data-tap-keep`: a tap here stays here (e.g. tracing a letter), like on buttons that aren't targets.
 */

/** How far, in CSS pixels, a tap may land next to a thing and still count for it. */
export const TAP_SLOP_PX = 30;

/** What a target is right now: the right answer, already tapped, or neither (""). */
export type TapState = "" | "goal" | "done";

/** The `data-tap` value for a thing that may be the right answer and may be tapped already. */
export function tapState({ goal = false, done = false }: { goal?: boolean; done?: boolean }): TapState {
  if (done) return "done";
  return goal ? "goal" : "";
}

/** A thing within reach of a tap. */
export interface TapCandidate<T> {
  target: T;
  /** Its `data-tap` value. */
  state: string;
  /** From the finger to its tap area in CSS pixels, 0 when the finger is on it. */
  distance: number;
}

const RANK: Record<string, number> = { goal: 2, "": 1, done: 0 };
const rank = (state: string) => RANK[state] ?? 1;

/** The thing a tap means: the right answer first, then one not tapped yet, then the nearest; the earlier one wins a tie. */
export function pickTap<T>(candidates: TapCandidate<T>[]): TapCandidate<T> | undefined {
  let best: TapCandidate<T> | undefined;
  for (const c of candidates) {
    if (!best || rank(c.state) > rank(best.state) || (rank(c.state) === rank(best.state) && c.distance < best.distance)) best = c;
  }
  return best;
}

/** Distance from a point to a rectangle, 0 inside it. */
export function distanceToRect(x: number, y: number, r: { left: number; top: number; right: number; bottom: number }): number {
  return Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom));
}

const ROOT = "[data-tap-root], .play-area";
/** Things that keep their own taps unless they are targets themselves. */
const KEEP = "button:not([data-tap]), a, input, select, textarea, label, [role=button]:not([data-tap]), [role=slider], [data-tap-keep]";

function reachable(el: Element): boolean {
  if (el.matches(":disabled")) return false;
  const style = getComputedStyle(el);
  return style.pointerEvents !== "none" && style.visibility !== "hidden";
}

function distanceTo(el: Element, x: number, y: number): number {
  const areas = el.querySelectorAll("[data-tap-area]");
  let best = Number.POSITIVE_INFINITY;
  for (const area of areas.length ? areas : [el]) {
    const r = area.getBoundingClientRect();
    if (r.width > 0 || r.height > 0) best = Math.min(best, distanceToRect(x, y, r));
  }
  return best;
}

/**
 * The target a tap at (x, y) means, given the element right under it (`document.elementFromPoint`
 * or the event's target); null when the tap is for no target, or for a button that isn't one.
 */
export function tapTargetAt(x: number, y: number, hit: Element | null): Element | null {
  if (!hit) return null;
  const under = hit.closest("[data-tap]");
  const keep = hit.closest(KEEP);
  if (keep && (!under || keep.contains(under))) return null;
  const root = hit.closest(ROOT);
  if (!root) return under;
  const candidates: TapCandidate<Element>[] = [];
  if (under && reachable(under)) candidates.push({ target: under, state: under.getAttribute("data-tap") ?? "", distance: 0 });
  for (const el of root.querySelectorAll("[data-tap]")) {
    if (el === under || el.closest(ROOT) !== root) continue;
    const distance = distanceTo(el, x, y);
    if (distance <= TAP_SLOP_PX && reachable(el)) candidates.push({ target: el, state: el.getAttribute("data-tap") ?? "", distance });
  }
  return pickTap(candidates)?.target ?? null;
}

/** The copies sent on, so they aren't looked at again. */
const forwarded = new WeakSet<Event>();

/**
 * Sends every pointerdown inside `area` that is meant for another target than the one under the
 * finger on to that target, before the game sees it. Returns the function that stops it.
 */
export function forwardNearTaps(area: Element): () => void {
  const onDown = (e: PointerEvent) => {
    if (forwarded.has(e) || !(e.target instanceof Element)) return;
    const target = tapTargetAt(e.clientX, e.clientY, e.target);
    if (!target || target.contains(e.target)) return;
    e.stopPropagation();
    e.preventDefault();
    const copy = new PointerEvent("pointerdown", {
      bubbles: true,
      cancelable: true,
      composed: true,
      view: window,
      clientX: e.clientX,
      clientY: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
      button: e.button,
      buttons: e.buttons,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      metaKey: e.metaKey,
      pointerId: e.pointerId,
      pointerType: e.pointerType,
      isPrimary: e.isPrimary,
      width: e.width,
      height: e.height,
      pressure: e.pressure,
    });
    forwarded.add(copy);
    target.dispatchEvent(copy);
  };
  area.addEventListener("pointerdown", onDown as EventListener, { capture: true });
  return () => area.removeEventListener("pointerdown", onDown as EventListener, { capture: true });
}
