import { useCallback, useEffect, useState } from "react";

/**
 * Like useState, but saved in localStorage. Starts from `defaults` (so the
 * static HTML matches) and loads the saved value after mount. Saved values
 * are merged into `defaults`, so adding a new setting later keeps old ones.
 */
export function useStoredSettings<T extends object>(key: string, defaults: T) {
  const [value, setValue] = useState<T>(defaults);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue({ ...defaults, ...(JSON.parse(raw) as Partial<T>) });
    } catch {
      // Ignore broken or unavailable storage and keep the defaults.
    }
    // `defaults` is a constant per call site; only reload when the key changes.
  }, [key]);

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
