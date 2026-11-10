import type { TargetLanguageId } from "@/content/targetLanguages";
import { registerPage } from "@/lib/preloadPages";
import { SCENE_TRANSLATIONS } from "./translations";
import type { Scene } from "./types";

// Every picture is a chunk of its own, loaded only when it is played (or its menu card waits for a tap): all 23
// pictures in one chunk were 1.6 MB of code, which the menu and every single picture downloaded and ran first (perf
// analysis, November 2026). What the menu, the end's „Weiter“ and an exit sign need before a picture is loaded –
// its id, emoji and title – stands here; `scenes.test.ts` checks it against the pictures themselves. Code that
// runs in the game imports pictures only through `loadScene`, never `SCENES` from index.ts (that one is for tests and
// the management page; `scenes.test.ts` checks).

/** A picture as the menu knows it before its drawing is loaded. */
export interface SceneEntry {
  id: string;
  emoji: string;
  /** Its German title (the scene's own `title`). */
  title: string;
  /** Loads the picture's own chunk. */
  load: () => Promise<Scene>;
}

/** All playable pictures, in menu order. */
export const SCENE_ENTRIES: SceneEntry[] = [
  { id: "baustelle", emoji: "🏗️", title: "Baustelle", load: () => import("./baustelle/Baustelle").then((m) => m.baustelle) },
  { id: "stadt", emoji: "🚦", title: "Stadt", load: () => import("./stadt/Stadt").then((m) => m.stadt) },
  { id: "bauernhof", emoji: "🐮", title: "Bauernhof", load: () => import("./bauernhof/Bauernhof").then((m) => m.bauernhof) },
  { id: "hof", emoji: "🐣", title: "Hof am Teich", load: () => import("./hof/Hof").then((m) => m.hof) },
  { id: "zoo", emoji: "🦁", title: "Zoo", load: () => import("./zoo/Zoo").then((m) => m.zoo) },
  { id: "unterwasser", emoji: "🐠", title: "Unterwasser", load: () => import("./unterwasser/Unterwasser").then((m) => m.unterwasser) },
  { id: "badezimmer", emoji: "🛁", title: "Badezimmer", load: () => import("./badezimmer/Badezimmer").then((m) => m.badezimmer) },
  { id: "wald", emoji: "🌲", title: "Wald", load: () => import("./wald/Wald").then((m) => m.wald) },
  { id: "feuerwache", emoji: "🚒", title: "Feuerwache", load: () => import("./feuerwache/Feuerwache").then((m) => m.feuerwache) },
  { id: "weltall", emoji: "🚀", title: "Weltall", load: () => import("./weltall/Weltall").then((m) => m.weltall) },
  { id: "spielplatz", emoji: "🛝", title: "Spielplatz", load: () => import("./spielplatz/Spielplatz").then((m) => m.spielplatz) },
  { id: "kueche", emoji: "🍳", title: "Küche", load: () => import("./kueche/Kueche").then((m) => m.kueche) },
  { id: "supermarkt", emoji: "🛒", title: "Supermarkt", load: () => import("./supermarkt/Supermarkt").then((m) => m.supermarkt) },
  { id: "flughafen", emoji: "✈️", title: "Flughafen & Bahnhof", load: () => import("./flughafen/Flughafen").then((m) => m.flughafen) },
  {
    id: "winterbaustelle",
    emoji: "❄️",
    title: "Winter-Baustelle",
    load: () => import("./winterbaustelle/WinterBaustelle").then((m) => m.winterbaustelle),
  },
  { id: "kita", emoji: "🧸", title: "Kita", load: () => import("./kita/Kita").then((m) => m.kita) },
  { id: "kinderarzt", emoji: "🩺", title: "Kinderarzt", load: () => import("./kinderarzt/Kinderarzt").then((m) => m.kinderarzt) },
  { id: "strand", emoji: "🏖️", title: "Strand", load: () => import("./strand/Strand").then((m) => m.strand) },
  { id: "dinotal", emoji: "🦕", title: "Dinotal", load: () => import("./dinotal/Dinotal").then((m) => m.dinotal) },
  { id: "gutenacht", emoji: "🌜", title: "Gute Nacht", load: () => import("./gutenacht/GuteNacht").then((m) => m.gutenacht) },
  { id: "winter", emoji: "⛄", title: "Winter", load: () => import("./winter/Winter").then((m) => m.winter) },
  { id: "herbst", emoji: "🍂", title: "Herbst", load: () => import("./herbst/Herbst").then((m) => m.herbst) },
  { id: "ostern", emoji: "🐣", title: "Ostern", load: () => import("./ostern/Ostern").then((m) => m.ostern) },
];

/** Shown greyed out in the menu so children (and parents) know more is coming. */
export const UPCOMING_SCENES: { emoji: string; title: string }[] = [];

/** The picture `id` in the catalog, if there is one. */
export const sceneEntry = (id: string) => SCENE_ENTRIES.find((entry) => entry.id === id);

/** The address a picture plays at. */
export const scenePath = (id: string) => `/bilder/${id}/`;

/** Pictures loaded so far, by id. */
const loaded = new Map<string, Scene>();
/** Loads under way or done, by id: one promise per picture, so React's `use` gets the same one every time. */
const loading = new Map<string, Promise<Scene>>();

/** Loads picture `id` (once; later calls get the same promise). */
export function loadScene(id: string): Promise<Scene> {
  const entry = sceneEntry(id);
  if (!entry) return Promise.reject(new Error(`no picture ${id}`));
  let promise = loading.get(id);
  if (!promise) {
    promise = entry.load().then((scene) => {
      loaded.set(id, scene);
      return scene;
    });
    // A failed load (offline before the worker kept it) may be tried again.
    promise.catch(() => loading.delete(id));
    loading.set(id, promise);
  }
  return promise;
}

/** Loads picture `id` in the background; a failure only means the tap will load it again. */
export function preloadScene(id: string) {
  loadScene(id).catch(() => {});
}

/** Picture `id` if it is loaded already. */
export const loadedScene = (id: string) => loaded.get(id);

/**
 * The title of picture `id` in `languageId`, before it is loaded: its translation's title where there is one. A picture
 * translated only in part plays in German (`sceneLanguage`), but its card already shows the translated title.
 */
export function sceneTitle(id: string, languageId: TargetLanguageId) {
  const entry = sceneEntry(id);
  return (languageId === "de" ? undefined : SCENE_TRANSLATIONS[id]?.[languageId]?.title) ?? entry?.title ?? id;
}

// A menu loads the pictures behind its cards while it waits for a tap, and a card loads its picture as the finger
// lands (usePreloadPages, preloadPage), as it does the lazy pages of App.tsx: the picture with the page that plays it.
for (const entry of SCENE_ENTRIES) registerPage([scenePath(entry.id)], () => Promise.all([import("@/pages/ScenePage"), loadScene(entry.id)]));
