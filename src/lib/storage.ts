import { useCallback, useState } from "react";

/** The saved value merged into `defaults`, so adding a new setting later keeps the old ones. */
export function loadStored<T extends object>(key: string, defaults: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return { ...defaults, ...(JSON.parse(raw) as Partial<T>) };
  } catch {
    // Ignore broken or unavailable storage and keep the defaults.
  }
  return defaults;
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
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // Storage full or disabled: the setting still applies for this visit.
        }
        return next;
      });
    },
    [key],
  );

  return [value, update] as const;
}
