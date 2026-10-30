import type { Localized } from "@/lib/language";

/**
 * In menu order – Explore ("Freies Entdecken", the first and default): tap anything to see and hear it.
 * Colour: the picture starts grey, every tapped item gets its colour back.
 * Find: "Wo ist der Bagger?" Questions: "Was ist rot?", several right answers.
 * Torch ("Taschenlampe", idea B-17): the picture is dark, a round light follows the finger, the mouse or the arrow
 * keys, and what comes into the light wakes up.
 */
export type SceneMode = "explore" | "colour" | "find" | "questions" | "torch";

/** Modes in which the child looks for something that was asked. */
export const isQuestMode = (mode: SceneMode) => mode === "find" || mode === "questions";

/** Quest modes that can mark an answer; in find mode that would make it too easy. */
export const hasHints = (mode: SceneMode) => mode === "questions";

export interface ScenesSettings {
  /** Picked in the row above the pictures on `/bilder/`; a tap on a picture plays it in this mode. */
  mode: SceneMode;
  /** Speak names, sentences and questions. */
  speech: boolean;
  /** Engine noises, beeps and chimes. */
  sounds: boolean;
  /**
   * Every item has its own key, shown in the picture, wherever there is a keyboard (tapping still works).
   * Switched off and on with ⌨️ in the picture, and kept so for the next pictures.
   */
  keys: boolean;
}

export const DEFAULT_SCENES_SETTINGS: ScenesSettings = {
  mode: "explore",
  speech: false,
  sounds: true,
  keys: true,
};

// v2: speech is off and the picture stands still by default now, so old saved settings start fresh.
// v3: every picture is still and silent until the child does something.
export const SCENES_SETTINGS_KEY = "tinytaps.scenes.v3";
const OLD_SCENES_SETTINGS_KEY = "tinytaps.scenes.v2";

/** Takes over the settings saved under v2. Call before reading the settings. */
export function carryOverScenesSettings() {
  try {
    const old = localStorage.getItem(OLD_SCENES_SETTINGS_KEY);
    if (old === null || localStorage.getItem(SCENES_SETTINGS_KEY) !== null) return;
    localStorage.setItem(SCENES_SETTINGS_KEY, old);
    localStorage.removeItem(OLD_SCENES_SETTINGS_KEY);
  } catch {
    // Broken or unavailable storage: the defaults apply.
  }
}

/** The modes in the row above the pictures on `/bilder/`, in menu order, with their labels. */
export const SCENE_MODES: { value: SceneMode; label: Localized }[] = [
  {
    value: "explore",
    label: {
      de: "👆 Freies Entdecken",
      ru: "👆 Свободная игра",
      en: "👆 Free exploring",
      zh: "👆 自由探索",
      hi: "👆 खुलकर खोजें",
      es: "👆 Explorar libremente",
      ar: "👆 استكشاف حر",
    },
  },
  { value: "colour", label: { de: "🖍️ Ausmalen", ru: "🖍️ Раскраска", en: "🖍️ Coloring", zh: "🖍️ 涂颜色", hi: "🖍️ रंग भरें", es: "🖍️ Colorear", ar: "🖍️ تلوين" } },
  { value: "find", label: { de: "🔍 Suchen", ru: "🔍 Поиск", en: "🔍 Find it", zh: "🔍 找一找", hi: "🔍 ढूँढें", es: "🔍 Buscar", ar: "🔍 بحث" } },
  { value: "questions", label: { de: "❓ Fragen", ru: "❓ Вопросы", en: "❓ Questions", zh: "❓ 问一问", hi: "❓ सवाल", es: "❓ Preguntas", ar: "❓ أسئلة" } },
  { value: "torch", label: { de: "🔦 Taschenlampe" } },
];
