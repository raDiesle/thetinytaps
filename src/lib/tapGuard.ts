/**
 * One tap, one step (user feedback, November 2026): in a game that goes on screen by screen with a tap – a story's next
 * page, a scene's choices, the next scene – a child's hand often lands twice in quick succession, and the second tap
 * then picked a card on the screen the first one had only just brought, or skipped a page unseen. So after the screen
 * changed, taps that would change it again are ignored for a moment, whichever control they hit.
 */

/** How long after a change of screen another tap that changes it is ignored, in ms. */
export const TAP_GUARD_MS = 600;

let changedAt = Number.NEGATIVE_INFINITY;

/** The screen changed by itself (a new picture, the choices coming back): taps in the next `TAP_GUARD_MS` are ignored. */
export function screenChanged(now = performance.now()) {
  changedAt = now;
}

/**
 * Asks whether a tap (or key) that changes the screen may act now. If it may, the screen counts as changed from now on,
 * so a second tap right after it does nothing; if it comes too soon, it must do nothing that changes the screen.
 */
export function screenTap(now = performance.now()): boolean {
  if (now - changedAt < TAP_GUARD_MS) return false;
  changedAt = now;
  return true;
}
