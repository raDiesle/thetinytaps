import { useEffect, useSyncExternalStore } from "react";

// Offline and "install as app" (PWA). The service worker itself is src/sw.js.

/**
 * How often a page that stays open looks for a new version. An installed app is
 * rarely started anew: it waits in the background for days and only comes back.
 */
const UPDATE_CHECK_MS = 60 * 60 * 1000;

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
  /** A new version took over in the background; this page still runs the old one until it reloads. */
  updateReady: false,
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
  matchMedia("(display-mode: standalone), (display-mode: fullscreen)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;

/** iPhone / iPad Safari, where installing only works through the share menu. */
export const isIos = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.platform));

/** Runs `task` after the page has loaded, when the browser has nothing else to do (at the latest after 3 s). */
export function afterLoad(task: () => void) {
  const idle = () => (typeof requestIdleCallback === "function" ? requestIdleCallback(task, { timeout: 3000 }) : setTimeout(task, 200));
  if (document.readyState === "complete") idle();
  else addEventListener("load", idle, { once: true });
}

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

  // The very first worker also takes over the page, but then nothing is old.
  const hadWorker = navigator.serviceWorker.controller !== null;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (hadWorker) update({ updateReady: true });
  });

  const base = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/`;
  // Only once the page has loaded and is idle: the new worker downloads every file of
  // the site for offline use, and on a first visit that must not slow down the page
  // itself (what the visitor and Google measure). Returning visitors already have it.
  afterLoad(() =>
    navigator.serviceWorker
      .register(`${base}sw.js`, { scope: base, updateViaCache: "none" })
      .then((registration) => {
        // The browser only looks for a new sw.js when a page is opened, so an app that
        // stays open or comes back from the background asks itself. Offline that fails quietly.
        const check = () => void registration.update().catch(() => {});
        setInterval(check, UPDATE_CHECK_MS);
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") check();
        });
      })
      .catch(() => {
        // E.g. private mode in Firefox: the site still works online.
      }),
  );
  void navigator.serviceWorker.ready.then(() => update({ offlineReady: true }));
}

/** Reloading in fullscreen would end it, and only a tap brings it back; such a page waits for the next start. */
const reloadNow = () => {
  if (state.updateReady && !document.fullscreenElement) location.reload();
};

/**
 * For menu pages, between games: when a new version is ready, the page restarts
 * with it as soon as it is opened or the app goes to the background – never in
 * the middle of a game. Pages without it switch at the next menu or start.
 */
export function useUpdateBetweenGames() {
  const { updateReady } = usePwa();
  useEffect(() => {
    if (!updateReady) return;
    if (document.visibilityState === "hidden") return reloadNow();
    // Not while someone looks at the menu: a parent may be about to tap a game.
    const onHide = () => {
      if (document.visibilityState === "hidden") reloadNow();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [updateReady]);
  // Opening a menu page (also coming back from a game) is a page change anyway.
  useEffect(reloadNow, []);
}

/** When the running version was built, e.g. "25.10.2026, 14:30" (in the device's time zone). */
export const buildDate = () => new Date(BUILD_TIME).toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" });

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
