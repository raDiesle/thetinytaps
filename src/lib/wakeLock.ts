import { useEffect } from "react";

/**
 * Keeps the screen on while `active`, so a tablet standing on the sink doesn't
 * dim or lock while nobody touches it. The browser drops the lock whenever the
 * page is hidden, so it is asked for again when the page comes back.
 */
export function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active || !("wakeLock" in navigator)) return;
    let sentinel: WakeLockSentinel | null = null;
    let cancelled = false;

    const request = async () => {
      try {
        const lock = await navigator.wakeLock.request("screen");
        if (cancelled) void lock.release();
        else sentinel = lock;
      } catch {
        // Denied (e.g. low battery): the screen may dim, the game still works.
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") void request();
    };

    void request();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibility);
      void sentinel?.release();
    };
  }, [active]);
}
