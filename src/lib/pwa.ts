import { useEffect, useSyncExternalStore } from "react";
import { track } from "@/lib/analytics";
import { BASE_URL, BUILD_TIME, PROD } from "@/lib/buildInfo";
import { loadCommon } from "@/lib/common";
import type { OfflineChoice } from "@/lib/offlineParts";
import { loadStored } from "@/lib/storage";

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

/** What grown-ups chose for playing without internet, stored on the device. */
export interface OfflineSettings {
  /** Keep an offline copy: null until chosen, which means yes for an installed app and no in a browser tab. */
  on: boolean | null;
  /** The languages whose voices and songs to keep; null: the app language, whichever it is. */
  languages: string[] | null;
  /** The books left out (`SHELF` ids). */
  skip: string[];
}

const OFFLINE_KEY = "tinytaps.offline.v1";
const OFFLINE_DEFAULTS: OfflineSettings = { on: null, languages: null, skip: [] };

function loadOfflineSettings(): OfflineSettings {
  return typeof localStorage === "undefined" ? OFFLINE_DEFAULTS : loadStored(OFFLINE_KEY, OFFLINE_DEFAULTS);
}

const state = {
  /** All files are in the browser (only an installed app keeps them all); the games start without network. */
  offlineReady: false,
  installPrompt: null as InstallPromptEvent | null,
  installed: false,
  /** A new version took over in the background; this page still runs the old one until it reloads. */
  updateReady: false,
  /** How far the offline copy has come, in bytes, while it downloads. */
  offlineProgress: null as { done: number; total: number } | null,
  /** Where the offline copy's list is (src/lib/offlineParts.ts), once the worker told; null without a worker. */
  offlineManifest: null as string | null,
  /** What grown-ups chose to keep for playing without internet. */
  offline: loadOfflineSettings(),
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

/**
 * The visitor asked to save data (Chrome's „Datensparmodus“, `Save-Data`) or is on a slow mobile network: then nothing
 * is downloaded ahead that might never be used (other pages' code, the song), only what a tap asks for.
 */
export function savesData() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return connection?.saveData === true || /(^|-)2g$/.test(connection?.effectiveType ?? "");
}

/** Runs `task` after the page has loaded, when the browser has nothing else to do (at the latest after 3 s). */
export function afterLoad(task: () => void) {
  const idle = () => (typeof requestIdleCallback === "function" ? requestIdleCallback(task, { timeout: 3000 }) : setTimeout(task, 200));
  if (document.readyState === "complete") idle();
  else addEventListener("load", idle, { once: true });
}

/**
 * Whether this page's own script is missing from the newest cache, the one of the worker that just took over:
 * the page then runs an older build. Every build's script has a name of its own (a hash).
 */
async function runsOldBuild() {
  const script = document.querySelector<HTMLScriptElement>("script[type=module][src]")?.src;
  const newest = (await caches.keys()).filter((key) => key.startsWith("tinytaps-")).at(-1);
  if (!script || !newest) return true;
  return !(await (await caches.open(newest)).match(script));
}

/** Called once at start-up. */
export function setUpPwa() {
  if (!("serviceWorker" in navigator)) return;
  if (!PROD) {
    // A worker left over from `bun run preview` on the same port would serve the old build.
    void navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((reg) => void reg.unregister()));
    return;
  }

  addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    update({ installPrompt: event as InstallPromptEvent });
  });
  addEventListener("appinstalled", () => {
    update({ installPrompt: null, installed: true });
    track("installiert");
    keepAllOffline({ again: true });
  });

  // The very first worker also takes over the page, but then nothing is old. Nor is it when the page
  // already came from the network with the build the new worker keeps (src/sw.js opens pages so).
  const hadWorker = navigator.serviceWorker.controller !== null;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (hadWorker) void runsOldBuild().then((old) => old && update({ updateReady: true }));
    // A newer worker took over, maybe while the old one was still downloading everything: it goes on.
    keepAllOffline({ again: true });
  });

  const base = `${BASE_URL.replace(/\/$/, "")}/`;
  // Only once the page has loaded and is idle, so on a first visit the worker's start doesn't slow down the page
  // itself (what the visitor and Google measure). It keeps only what is played; an installed app keeps everything.
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
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data?.offlineReady) update({ offlineReady: true, offlineProgress: null });
    if (event.data?.offlineProgress) update({ offlineProgress: event.data.offlineProgress });
    if ("offlineManifest" in (event.data ?? {})) update({ offlineManifest: event.data.offlineManifest });
  });
  void navigator.serviceWorker.ready.then((registration) => {
    // What this page loaded before the worker was there (on a first visit: all of it so far) is kept too.
    const loaded = performance.getEntriesByType("resource").map((entry) => entry.name);
    registration.active?.postMessage({ keep: loaded, offlineManifest: true });
  });
  // The offline copy is asked for once the app language is known (keepTextsOffline, from language.ts).
}

/** The app language, as language.ts last told (keepTextsOffline): pwa.ts can't import it, language.ts imports this. */
let appLanguage = "de";

/** Whether an offline copy is kept: as chosen, else for an installed app only. */
export const keepsOffline = (settings = state.offline) => settings.on ?? isStandalone();

/** What the worker keeps for `settings`: the languages chosen (or the app language), the books not left out, the song while music is on. */
export function offlineChoiceOf(settings: OfflineSettings, language = appLanguage): OfflineChoice {
  return { languages: settings.languages ?? [language], skip: settings.skip, music: loadCommon().music };
}

/**
 * Tells the worker what to keep for playing without network (src/sw.js): an installed app keeps the games of the
 * chosen books in the chosen languages (by default all books, the app language) – never every language's voices, which
 * are over 200 MB. A page in a browser tab keeps only what it played, unless grown-ups asked for the offline copy.
 */
function keepAllOffline({ again = false } = {}) {
  if (!PROD || !("serviceWorker" in navigator) || !keepsOffline()) return;
  const choice = offlineChoiceOf(state.offline);
  // The same choice once per worker: the worker goes on with a download that broke off by itself.
  if (!again && JSON.stringify(choice) === lastSent) return;
  lastSent = JSON.stringify(choice);
  void navigator.serviceWorker.ready.then((registration) => registration.active?.postMessage({ keepAll: choice }));
}

/** The choice last sent to the worker, so the start and a language switch don't ask twice. */
let lastSent = "";

/** Changes what is kept for playing without internet, remembers it and tells the worker. */
export function setOfflineSettings(changes: Partial<OfflineSettings>) {
  const before = keepsOffline();
  update({ offline: { ...state.offline, ...changes } });
  try {
    localStorage.setItem(OFFLINE_KEY, JSON.stringify(state.offline));
  } catch {
    // Storage full or disabled: it still applies for this visit.
  }
  if (keepsOffline()) keepAllOffline();
  else if (before && PROD && "serviceWorker" in navigator) {
    update({ offlineReady: false, offlineProgress: null });
    void navigator.serviceWorker.ready.then((registration) => registration.active?.postMessage({ forgetAll: true }));
  }
}

/**
 * Asks the service worker to keep the texts of `language` (src/content/texts) for offline use: it keeps only the
 * languages pages play in, and on the very first visit the page loads them before the worker is there.
 */
export function keepTextsOffline(language: string) {
  appLanguage = language;
  if (!PROD || !("serviceWorker" in navigator)) return;
  // Told at every start, once the app language is known, and at every switch: the offline copy follows the app
  // language unless grown-ups chose its languages.
  keepAllOffline();
  void navigator.serviceWorker.ready.then((registration) => registration.active?.postMessage({ keepTexts: language }));
}

/** Reloading in fullscreen would end it, and only a tap brings it back; such a page waits for the next start. */
const reloadNow = () => {
  if (state.updateReady && !document.fullscreenElement) location.reload();
};

/**
 * For menu pages, between games: when a new version is ready, the page restarts
 * with it when the app goes to the background on a menu – never in the middle of a
 * game, and never on a tap: restarting the whole app when a menu card was tapped made
 * the next menu take seconds to show. Until then the old version runs on (the worker
 * keeps its files), and the next start has the new one anyway.
 */
export function useUpdateBetweenGames() {
  const { updateReady } = usePwa();
  useEffect(() => {
    if (!updateReady) return;
    if (document.visibilityState === "hidden") return reloadNow();
    const onHide = () => {
      if (document.visibilityState === "hidden") reloadNow();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [updateReady]);
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
