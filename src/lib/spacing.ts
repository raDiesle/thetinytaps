// Sounds and lines that only accompany the play (a boing and a twinkle as a pair lands, „Ein Paar!“) pile up into
// a din when a child answers quickly, one after the other (user feedback from Socken-Paare, November 2026). A game
// keeps such extras apart with a gap of their own: the answer's own sound always plays, the extras only when the
// last ones lie far enough back.

/** How far apart a game's extra sounds (boing, twinkle, a second knock) come at least. */
export const EXTRA_SOUND_GAP_MS = 1500;

/** How far apart a game's lines that only accompany the play (praise) come at least; see `say`'s `gap` in voice.ts. */
export const ASIDE_LINE_GAP_MS = 8000;

/**
 * A gate that opens at most once every `gapMs`: `pass()` is true (and closes it for `gapMs`) when the last pass lies
 * at least `gapMs` back. `now` is for tests.
 */
export function spaced(gapMs: number, now: () => number = () => performance.now()) {
  let last = Number.NEGATIVE_INFINITY;
  return {
    pass: () => {
      const at = now();
      if (at - last < gapMs) return false;
      last = at;
      return true;
    },
  };
}
