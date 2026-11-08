// What the app waits for before a sound can play at its moment: a game's line still downloading, the next round's
// recordings. While anything is waited for, `SoundLoading` (mounted once in index.tsx) shows the paw track on a slip of
// paper after a moment, so the child sees the game is coming and the sound plays right when its picture does – instead
// of the picture going on and the line coming late, or never (user request, November 2026). No React here, so
// voice.ts can use it.

let waits = 0;
const listeners = new Set<() => void>();
const notify = () => {
  for (const listener of listeners) listener();
};

/** Calls `listener` whenever waiting starts or ends; returns how to stop. */
export function subscribeWaiting(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** True while some sound the game needs now is still loading. */
export const isWaiting = () => waits > 0;

/** `promise`, counted as waited for (the loader shows) until it settles. */
export function waitingFor<T>(promise: Promise<T>): Promise<T> {
  waits++;
  notify();
  const done = () => {
    waits--;
    notify();
  };
  promise.then(done, done);
  return promise;
}

/**
 * The longest a game waits for its sounds before it goes on without them (a very slow network, a file the offline copy
 * lacks): a child must never be stuck in front of the loader.
 */
export const SOUND_WAIT_MS = 8000;

/** `promise`, or nothing once SOUND_WAIT_MS have passed. */
export function atMost<T>(promise: Promise<T>, ms = SOUND_WAIT_MS): Promise<T | undefined> {
  return Promise.race([promise, new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), ms))]);
}
