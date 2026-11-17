import { useCallback, useState } from "react";

/** The JSON saved under `key`, or `empty` when there is none or storage is broken or unavailable. */
export function readStored<T>(key: string, empty: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // Ignore broken or unavailable storage and start empty.
  }
  return empty;
}

/** Saves `value` as JSON under `key`; when storage is full or off it only lasts this visit. */
export function writeStored(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Nothing to do: what was saved still shows until the page closes.
  }
}

/** The saved value merged into `defaults`, so adding a new setting later keeps the old ones. */
export function loadStored<T extends object>(key: string, defaults: T): T {
  const saved = readStored<Partial<T> | null>(key, null);
  return saved ? { ...defaults, ...saved } : defaults;
}

/**
 * Like useState, but saved in localStorage. The saved value is read on the
 * first render (the app renders only in the browser), so the start screen
 * shows the parent's last choices right away.
 */
export function useStoredSettings<T extends object>(key: string, defaults: T) {
  const [value, setValue] = useState<T>(() => loadStored(key, defaults));

  const update = useCallback(
    (patch: Partial<T>) => {
      setValue((prev) => {
        const next = { ...prev, ...patch };
        writeStored(key, next);
        return next;
      });
    },
    [key],
  );

  return [value, update] as const;
}
