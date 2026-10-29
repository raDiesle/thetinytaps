// Fullscreen for the whole app, menus included, and Keyboard Lock while a game
// runs, so key mashing can't close or leave the page.

import { useEffect, useState } from "react";
import { touchOnly } from "@/lib/device";

interface KeyboardLock {
  lock?: (keys?: string[]) => Promise<void>;
  unlock?: () => void;
}

function keyboardApi(): KeyboardLock | undefined {
  return (navigator as Navigator & { keyboard?: KeyboardLock }).keyboard;
}

// Whether this page locked the keyboard, so leaving a game only unlocks what it locked.
let keyboardLocked = false;

// Older iPad Safari only has the prefixed API (iPhone Safari has none at all).
type WebkitElement = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
type WebkitDocument = Document & {
  webkitFullscreenEnabled?: boolean;
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};

function requestFullscreen(el: WebkitElement) {
  if (el.requestFullscreen) return el.requestFullscreen({ navigationUI: "hide" });
  if (el.webkitRequestFullscreen) return Promise.resolve(el.webkitRequestFullscreen());
  return Promise.reject(new Error("Fullscreen is not supported"));
}

/** Whether this browser can show the page in fullscreen (iPhone Safari can't). */
export function canFullscreen(): boolean {
  const doc = document as WebkitDocument;
  return Boolean(doc.fullscreenEnabled || doc.webkitFullscreenEnabled);
}

/** Whether the page is in fullscreen right now. */
export function isFullscreen(): boolean {
  const doc = document as WebkitDocument;
  return Boolean(doc.fullscreenElement || doc.webkitFullscreenElement);
}

// Not in every TypeScript DOM library: Chrome on Android has it, Safari not.
type LockableOrientation = ScreenOrientation & { lock?: (orientation: "landscape") => Promise<void> };

/**
 * Phones and tablets stay in landscape while in fullscreen (Chrome on Android),
 * so the child can't turn the picture into a narrow portrait one.
 */
async function lockLandscape() {
  if (!touchOnly()) return;
  try {
    await (screen.orientation as LockableOrientation | undefined)?.lock?.("landscape");
  } catch {
    // Not supported here (Safari, some tablets): the "Bitte quer halten" note remains.
  }
}

/**
 * Put the whole page into fullscreen; it stays there while moving between
 * menus and games. Needs a tap or key as user gesture. Returns whether the
 * page is in fullscreen afterwards.
 */
export async function enterFullscreen(): Promise<boolean> {
  if (isFullscreen()) return true;
  try {
    await requestFullscreen(document.documentElement);
  } catch {
    return false;
  }
  await lockLandscape();
  return true;
}

/** Leave fullscreen, e.g. when the grown-up taps the button on the home page. */
export async function exitFullscreen() {
  exitKidMode();
  if (!isFullscreen()) return;
  const doc = document as WebkitDocument;
  try {
    await (doc.exitFullscreen ? doc.exitFullscreen() : doc.webkitExitFullscreen?.());
  } catch {
    // Already left fullscreen.
  }
}

/**
 * Enter fullscreen and, where supported (Chrome/Edge), lock the keyboard so
 * shortcuts like Cmd+W or Esc reach the game instead of the browser.
 * Phones and tablets get no lock: they have no keys to guard, and Chrome shows
 * its "how to leave fullscreen" note again on every lock and unlock, so it
 * would pop up over each game start and each way back to the menu.
 * Returns whether fullscreen was entered.
 */
export async function enterKidMode(): Promise<boolean> {
  if (!(await enterFullscreen())) return false;
  if (touchOnly()) return true;
  try {
    await keyboardApi()?.lock?.();
    keyboardLocked = true;
  } catch {
    // Keyboard Lock is optional; fullscreen alone is still useful.
  }
  return true;
}

/**
 * Back to the menus: the keyboard belongs to the browser again (a single Esc
 * leaves fullscreen), but the page stays in fullscreen.
 */
export function exitKidMode() {
  if (!keyboardLocked) return;
  keyboardLocked = false;
  keyboardApi()?.unlock?.();
}

/** Whether the page is in fullscreen, updated when it enters or leaves it. */
export function useFullscreen(): boolean {
  const [on, setOn] = useState(isFullscreen);
  useEffect(() => {
    const update = () => setOn(isFullscreen());
    document.addEventListener("fullscreenchange", update);
    document.addEventListener("webkitfullscreenchange", update);
    return () => {
      document.removeEventListener("fullscreenchange", update);
      document.removeEventListener("webkitfullscreenchange", update);
    };
  }, []);
  return on;
}
