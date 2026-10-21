// Fullscreen + Keyboard Lock, so key mashing can't close or leave the page.

interface KeyboardLock {
  lock?: (keys?: string[]) => Promise<void>;
  unlock?: () => void;
}

function keyboardApi(): KeyboardLock | undefined {
  return (navigator as Navigator & { keyboard?: KeyboardLock }).keyboard;
}

// Older iPad Safari only has the prefixed API (iPhone Safari has none at all).
type WebkitElement = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
type WebkitDocument = Document & { webkitFullscreenElement?: Element | null; webkitExitFullscreen?: () => Promise<void> | void };

function requestFullscreen(el: WebkitElement) {
  if (el.requestFullscreen) return el.requestFullscreen({ navigationUI: "hide" });
  if (el.webkitRequestFullscreen) return Promise.resolve(el.webkitRequestFullscreen());
  return Promise.reject(new Error("Fullscreen is not supported"));
}

/**
 * Enter fullscreen and, where supported (Chrome/Edge), lock the keyboard so
 * shortcuts like Cmd+W or Esc reach the page instead of the browser.
 * Returns whether fullscreen was entered.
 */
export async function enterKidMode(): Promise<boolean> {
  try {
    await requestFullscreen(document.documentElement);
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
  const doc = document as WebkitDocument;
  if (doc.fullscreenElement || doc.webkitFullscreenElement) {
    try {
      await (doc.exitFullscreen ? doc.exitFullscreen() : doc.webkitExitFullscreen?.());
    } catch {
      // Already left fullscreen.
    }
  }
}
