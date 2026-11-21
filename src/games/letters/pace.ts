// How quickly Frei tippen and Zählen take the next press. A full second before a new letter or number felt sluggish:
// a child pressed a key and nothing came (user feedback, November 2026), so the gates are short and only keep mashing
// from strobing. `pace.test.ts` keeps them short.

/** Presses closer together than this only ripple: a new letter or number comes at most this often. */
export const MIN_CHANGE_MS = 250;

/**
 * The same key (or the card, or its picture) again is said and sounded only after this pause: hammering B heard „B wie
 * Ball!“ at every press (user feedback, November 2026), but three seconds felt as if the key were dead. Shorter than
 * the app's `REPEAT_PAUSE_MS`, since pressing keys is the whole game here.
 */
export const SAME_KEY_PAUSE_MS = 1200;
