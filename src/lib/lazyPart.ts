/**
 * A part of a game loaded by its own `import()` only when it is played (a level, a story, a heavy player).
 */
export interface LazyPart<T> {
  /** Loads it once (the same promise every time, as `use()` needs); a failed download (offline) is tried again next time. */
  load(): Promise<T>;
  /**
   * It, once it is loaded. A screen reads it as `part.loaded() ?? use(part.load())`: `use()` suspends for a moment even
   * on a promise long settled, so without this a level fetched ahead still showed the loading paper first and was drawn
   * in the middle of the page's turn instead of before it (a 450 ms frame on an old phone, `bun run perf`, November 2026).
   */
  loaded(): T | undefined;
}

/** Wraps a part's `import()` so it is fetched once and can be drawn at once when it is there. */
export function lazyPart<T>(fetch: () => Promise<T>): LazyPart<T> {
  let promise: Promise<T> | undefined;
  let value: { it: T } | undefined;
  return {
    load() {
      if (!promise) {
        const started = fetch();
        promise = started;
        started.then(
          (it) => {
            value = { it };
          },
          () => {
            if (promise === started) promise = undefined;
          },
        );
      }
      return promise;
    },
    loaded: () => value?.it,
  };
}

/** How long a tap on a card waits for its level's code before the page turns to the loading paper instead. */
export const CODE_WAIT_MS = 400;

/** Resolves when `code` is there or after `CODE_WAIT_MS`, whichever comes first; a failed download counts as not there. */
export const codeSoon = (code: Promise<unknown>): Promise<unknown> =>
  Promise.race([code.catch(() => undefined), new Promise((done) => setTimeout(done, CODE_WAIT_MS))]);
