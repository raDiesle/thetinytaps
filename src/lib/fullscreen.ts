// Fullscreen for the whole app, menus included, and Keyboard Lock while a game
// runs, so key mashing can't close or leave the page.

import { useEffect, useState } from "react";

interface KeyboardLock {
  lock?: (keys?: string[]) => Promise<void>;
  unlock?: () => void;
}

function keyboardApi(): KeyboardLock | undefined {
  return (navigator as Navigator & { keyboard?: KeyboardLock }).keyboard;
}

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

/**
 * Put the whole page into fullscreen; it stays there while moving between
 * menus and games. Needs a tap or key as user gesture. Returns whether the
 * page is in fullscreen afterwards.
 */
export async function enterFullscreen(): Promise<boolean> {
  if (isFullscreen()) return true;
  try {
    await requestFullscreen(document.documentElement);
    return true;
  } catch {
    return false;
  }
}

/** Leave fullscreen, e.g. when the grown-up taps the button on the home page. */
export async function exitFullscreen() {
  keyboardApi()?.unlock?.();
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
 * Returns whether fullscreen was entered.
 */
export async function enterKidMode(): Promise<boolean> {
  if (!(await enterFullscreen())) return false;
  try {
    await keyboardApi()?.lock?.();
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
