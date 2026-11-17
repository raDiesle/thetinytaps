import { useSyncExternalStore } from "react";

/*
 * One value shared by the whole app (the language, the trophies, the shared options …), which every component using it
 * sees change at once. Several modules kept such a value with a set of listeners, a subscribe and a loop of their own;
 * this is that pattern once. A store whose listeners must hear only some of its changes, or whose value changes
 * without telling them (the play time counting each second, `playtime.ts`), keeps its own.
 */

/** A value shared by the app, its setter and the way to hear its changes. */
export interface Store<T> {
  /** The value now. */
  get: () => T;
  /** Changes the value and tells every listener, unless it stays the same (`Object.is`, or the store's `same`). */
  set: (next: T) => void;
  /** Calls `listener` after every change; returns how to stop. Stable, so React can take it as it is. */
  subscribe: (listener: () => void) => () => void;
}

/** How a store tells two values apart. */
export interface StoreOptions<T> {
  /** True when `next` is no change from `before`: then nobody is told. `Object.is` when left out. */
  same?: (before: T, next: T) => boolean;
}

/**
 * A store holding `initial`. Given a function, it is called once at the first `get` instead, so a value read from
 * storage is read only when something uses it (a store holding a function itself wraps it in another).
 */
export function createStore<T>(initial: T | (() => T), { same = Object.is }: StoreOptions<T> = {}): Store<T> {
  let loaded = typeof initial !== "function";
  let value = initial as T;
  const listeners = new Set<() => void>();
  const get = () => {
    if (!loaded) {
      loaded = true;
      value = (initial as () => T)();
    }
    return value;
  };
  return {
    get,
    set(next) {
      if (same(get(), next)) return;
      value = next;
      // A copy, so a listener that stops itself while told (`afterPageMotion`) doesn't change the round.
      for (const listener of [...listeners]) listener();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

/**
 * The store's value in a component, which renders again when it changes. `select` picks a part of it; it must give
 * the same value for the same store value (a number, a flag, a part of the object – never a new object each call).
 */
export function useStore<T>(store: Store<T>): T;
export function useStore<T, S>(store: Store<T>, select: (value: T) => S): S;
export function useStore<T, S>(store: Store<T>, select?: (value: T) => S): T | S {
  const snapshot = select ? () => select(store.get()) : store.get;
  return useSyncExternalStore<T | S>(store.subscribe, snapshot, snapshot);
}
