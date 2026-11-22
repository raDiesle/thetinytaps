/**
 * A part of a game loaded by its own `import()` only when it is played (a level, a story, a heavy player).
 */
export interface LazyPart<T> {
  /** Loads it once (the same promise every time, as `use()` needs); a failed download (offline) is tried again next time. */
  load(): Promise<T>;
}

/** A promise as React's `use()` reads it: once it says it is fulfilled, `use()` returns its value without suspending. */
type Tracked<T> = Promise<T> & { status?: "fulfilled"; value?: T };

/**
 * Wraps a part's `import()` so it is fetched once and can be drawn at once when it is there. A screen reads it as
 * `use(part.load())`: the promise is marked fulfilled as it settles, so `use()` returns a part fetched ahead in the
 * same render – an unmarked promise suspended for a moment even when long settled, and the level showed the loading
 * paper first and was drawn in the middle of the page's turn (a 450 ms frame on an old phone, `bun run perf`, November
 * 2026). Never read it beside `use()` (`loaded ?? use(…)`): that calls `use()` in one render and not in the next,
 * which React warns about.
 */
export function lazyPart<T>(fetch: () => Promise<T>): LazyPart<T> {
  let promise: Tracked<T> | undefined;
  return {
    load() {
      if (!promise) {
        const started: Tracked<T> = fetch();
        promise = started;
        started.then(
          (it) => {
            started.status = "fulfilled";
            started.value = it;
          },
          () => {
            if (promise === started) promise = undefined;
          },
        );
      }
      return promise;
    },
  };
}

/** How long a tap on a card waits for its level's code before the page turns to the loading paper instead. */
export const CODE_WAIT_MS = 400;

/** Resolves when `code` is there or after `CODE_WAIT_MS`, whichever comes first; a failed download counts as not there. */
export const codeSoon = (code: Promise<unknown>): Promise<unknown> =>
  Promise.race([code.catch(() => undefined), new Promise((done) => setTimeout(done, CODE_WAIT_MS))]);
