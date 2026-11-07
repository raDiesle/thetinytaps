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

/**
 * How long one key (or one thing tapped) pressed again and again waits before it is said and sounded again: a child
 * hammering B heard „B wie Ball!“ and a note at every press (user feedback from Buchstaben & Zahlen, November 2026).
 */
export const REPEAT_PAUSE_MS = 3000;

/**
 * A gate for presses of the same key: `pass(key)` is true for another key than the last one passed, and for that same
 * key again only once `gapMs` lie since it passed. Measured from the last pass, so a child hammering one key still
 * hears it now and then. `now` is for tests.
 */
export function repeatPause(gapMs: number = REPEAT_PAUSE_MS, now: () => number = () => performance.now()) {
  let lastKey: string | null = null;
  let last = Number.NEGATIVE_INFINITY;
  return {
    pass: (key: string) => {
      const at = now();
      if (key === lastKey && at - last < gapMs) return false;
      lastKey = key;
      last = at;
      return true;
    },
  };
}
