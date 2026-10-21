import { useSyncExternalStore } from "react";

// Offline and "install as app" (PWA). The service worker itself is src/sw.js.

/** Chrome / Edge / Android: the event that lets a button open the install dialog. */
interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const state = {
  /** All files are in the browser; the games start without network. */
  offlineReady: false,
  installPrompt: null as InstallPromptEvent | null,
  installed: false,
};
let snapshot = { ...state };
const listeners = new Set<() => void>();

function update(changes: Partial<typeof state>) {
  Object.assign(state, changes);
  snapshot = { ...state };
  for (const listener of listeners) listener();
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** Opened from the home screen (or as an installed desktop app), not in a browser tab. */
export const isStandalone = () =>
  matchMedia("(display-mode: standalone), (display-mode: fullscreen)").matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

/** iPhone / iPad Safari, where installing only works through the share menu. */
export const isIos = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.platform));

/** Called once at start-up. */
export function setUpPwa() {
  if (!("serviceWorker" in navigator)) return;
  if (!import.meta.env.PROD) {
    // A worker left over from `yarn preview` on the same port would serve the old build.
    void navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((reg) => void reg.unregister()));
    return;
  }

  addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    update({ installPrompt: event as InstallPromptEvent });
  });
  addEventListener("appinstalled", () => update({ installPrompt: null, installed: true }));

  const base = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/`;
  navigator.serviceWorker.register(`${base}sw.js`, { scope: base }).catch(() => {
    // E.g. private mode in Firefox: the site still works online.
  });
  void navigator.serviceWorker.ready.then(() => update({ offlineReady: true }));
}

/** Opens the browser's install dialog (only when `installPrompt` is set). */
export async function install() {
  const prompt = state.installPrompt;
  if (!prompt) return;
  await prompt.prompt();
  const { outcome } = await prompt.userChoice;
  update({ installPrompt: null, installed: outcome === "accepted" });
}

export function usePwa() {
  return useSyncExternalStore(subscribe, () => snapshot);
}
