// Fullscreen + Keyboard Lock, so key mashing can't close or leave the page.

interface KeyboardLock {
  lock?: (keys?: string[]) => Promise<void>;
  unlock?: () => void;
}

function keyboardApi(): KeyboardLock | undefined {
  return (navigator as Navigator & { keyboard?: KeyboardLock }).keyboard;
}

/**
 * Enter fullscreen and, where supported (Chrome/Edge), lock the keyboard so
 * shortcuts like Cmd+W or Esc reach the page instead of the browser.
 * Returns whether fullscreen was entered.
 */
export async function enterKidMode(): Promise<boolean> {
  const el = document.documentElement;
  if (!el.requestFullscreen) return false;
  try {
    await el.requestFullscreen({ navigationUI: "hide" });
  } catch {
    return false;
  }
  try {
    await keyboardApi()?.lock?.();
  } catch {
    // Keyboard Lock is optional; fullscreen alone is still useful.
  }
  return true;
}

export async function exitKidMode() {
  keyboardApi()?.unlock?.();
  if (document.fullscreenElement) {
    try {
      await document.exitFullscreen();
    } catch {
      // Already left fullscreen.
    }
  }
}
