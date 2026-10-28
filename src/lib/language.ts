import { type TargetLanguage, type TargetLanguageId, targetLanguageFor } from "@/content/targetLanguages";
import { loadAppTexts, loadTexts } from "@/content/texts";
import { playLanguage } from "@/lib/locale";
import { keepTextsOffline } from "@/lib/pwa";

// The language of the whole app, chosen once on the home page: the grown-ups'
// screens (home page, start screens, settings) and what the child hears and sees
// in every game, the letters and words games and Tapsi included: one language,
// never mixed. A text gives the German and the translations next to each other,
// t({ de: "Musik", ru: "Музыка" }); a language a text lacks falls back to German.
//
// @language-tables: the names of the languages below are needed in every language at once, so the build
// leaves this file's objects by language whole (tools/inlineTexts.ts).

/** The same thing in several languages; German is always there and is used for the others missing. */
export type Localized<T = string> = { de: T } & Partial<Record<TargetLanguageId, T>>;

/** Languages the whole app (grown-up screens included) can be switched to, in menu order. */
export const APP_LANGUAGES: TargetLanguageId[] = ["de", "en", "zh", "hi", "es", "ar", "ru"];

/** The thing in `language`, or the German one when there is none. */
export const pick = <T>(texts: Localized<T>, language: TargetLanguageId): T => texts[language] ?? texts.de;

const KEY = "tinytaps.applanguage.v1";

/** The saved app language; until a grown-up picks one, the browser's language if the app speaks it (playLanguage). */
function load(): TargetLanguageId {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved && APP_LANGUAGES.includes(saved as TargetLanguageId)) return saved as TargetLanguageId;
  } catch {
    // Storage unavailable: the default below.
  }
  return playLanguage(APP_LANGUAGES);
}

let current = load();

function apply(id: TargetLanguageId) {
  // `lang` also lets Arabic text run right to left while pictures and layout stay as they are (base.css).
  if (typeof document !== "undefined") document.documentElement.lang = id;
}
apply(current);

/**
 * Loads the texts of the app language (src/content/texts) before the app's code runs (src/index.tsx), so nothing
 * starts in German and turns into another language. Where they can't be loaded (offline before the service worker
 * kept them), this visit plays in German, never half in one language and half in another.
 */
export async function loadAppLanguage() {
  try {
    await loadAppTexts(current);
    keepTextsOffline(current);
  } catch {
    current = "de";
    apply(current);
    await loadAppTexts(current);
  }
}

/**
 * Switches the whole app to `id` and remembers it. The texts written inline get the app language as the modules
 * run (src/content/texts), so the page starts afresh in the new one – once its texts are there; offline without
 * them, nothing changes.
 */
export function setAppLanguage(id: TargetLanguageId) {
  if (id === current) return;
  loadTexts(id).then(
    () => {
      try {
        localStorage.setItem(KEY, id);
      } catch {
        // Storage full or disabled: a fresh start would come back in the same language.
        return;
      }
      location.reload();
    },
    () => {},
  );
}

/** The app language outside React, e.g. in a sound helper; components use useAppLanguage. */
export const appLanguage = () => current;

/** The app language (id, speech language, label); it stays the same while the page runs (setAppLanguage starts afresh). */
export function useAppLanguage(): TargetLanguage {
  return targetLanguageFor(current);
}

/** A line to speak and the voice for it. */
export interface Spoken<T = string> {
  text: T;
  /** Speech language, e.g. "ru-RU". */
  lang: string;
}

/**
 * A line in `language` and its voice; where the translation is missing, the German line with the German voice
 * (translations come only on request, and a Russian voice reading German words would be neither).
 */
export function spokenIn<T>(texts: Localized<T>, language: TargetLanguage): Spoken<T> {
  const own = texts[language.id];
  return own === undefined ? { text: texts.de, lang: targetLanguageFor("de").speechLang } : { text: own, lang: language.speechLang };
}

/** The script of each language not written in Latin letters: a sentence without it was not translated. */
const SCRIPTS: Partial<Record<TargetLanguageId, RegExp>> = {
  ru: /\p{Script=Cyrillic}/u,
  zh: /\p{Script=Han}/u,
  hi: /\p{Script=Devanagari}/u,
  ar: /\p{Script=Arabic}/u,
};

/**
 * The voice for `text`, a sentence built for `language`: the German voice where a screen in another script fell
 * back to a German sentence (none of its own letters in it), for games that build whole sentences from translated
 * words. Languages in Latin letters can't tell this way and always get their own voice.
 */
export function voiceFor(text: string, language: TargetLanguage) {
  const script = SCRIPTS[language.id];
  return script && !script.test(text) ? targetLanguageFor("de").speechLang : language.speechLang;
}

/** `t` for the app language: t({ de: "Musik", ru: "Музыка" }) → the text in the chosen language. */
export function useT() {
  const { id } = useAppLanguage();
  return <T>(texts: Localized<T>) => pick(texts, id);
}

/** Each wanted language by its own name, for the app's language choice (people look for their language in their language). */
export const OWN_NAMES: Record<TargetLanguageId, string> = {
  de: "🇩🇪 Deutsch",
  en: "🇺🇸 English",
  zh: "🇨🇳 中文",
  hi: "🇮🇳 हिन्दी",
  es: "🇪🇸 Español",
  ar: "🇸🇦 العربية",
  ru: "🇷🇺 Русский",
  it: "🇮🇹 Italiano",
};

/** Each wanted language named in the other app languages, for language choices on their screens (German: `TargetLanguage.label`). */
const NAMES: Partial<Record<TargetLanguageId, Record<TargetLanguageId, string>>> = {
  en: {
    de: "🇩🇪 German",
    en: "🇺🇸 English",
    zh: "🇨🇳 Chinese",
    hi: "🇮🇳 Hindi",
    es: "🇪🇸 Spanish",
    ar: "🇸🇦 Arabic",
    ru: "🇷🇺 Russian",
    it: "🇮🇹 Italian",
  },
  zh: {
    de: "🇩🇪 德语",
    en: "🇺🇸 英语",
    zh: "🇨🇳 中文",
    hi: "🇮🇳 印地语",
    es: "🇪🇸 西班牙语",
    ar: "🇸🇦 阿拉伯语",
    ru: "🇷🇺 俄语",
    it: "🇮🇹 意大利语",
  },
  hi: {
    de: "🇩🇪 जर्मन",
    en: "🇺🇸 अंग्रेज़ी",
    zh: "🇨🇳 चीनी",
    hi: "🇮🇳 हिन्दी",
    es: "🇪🇸 स्पैनिश",
    ar: "🇸🇦 अरबी",
    ru: "🇷🇺 रूसी",
    it: "🇮🇹 इतालवी",
  },
  es: {
    de: "🇩🇪 Alemán",
    en: "🇺🇸 Inglés",
    zh: "🇨🇳 Chino",
    hi: "🇮🇳 Hindi",
    es: "🇪🇸 Español",
    ar: "🇸🇦 Árabe",
    ru: "🇷🇺 Ruso",
    it: "🇮🇹 Italiano",
  },
  ar: {
    de: "🇩🇪 الألمانية",
    en: "🇺🇸 الإنجليزية",
    zh: "🇨🇳 الصينية",
    hi: "🇮🇳 الهندية",
    es: "🇪🇸 الإسبانية",
    ar: "🇸🇦 العربية",
    ru: "🇷🇺 الروسية",
    it: "🇮🇹 الإيطالية",
  },
  ru: {
    de: "🇩🇪 Немецкий",
    en: "🇺🇸 Английский",
    zh: "🇨🇳 Китайский",
    hi: "🇮🇳 Хинди",
    es: "🇪🇸 Испанский",
    ar: "🇸🇦 Арабский",
    ru: "🇷🇺 Русский",
    it: "🇮🇹 Итальянский",
  },
};

/** Flag and name of `language` in the app language: "🇷🇺 Russisch" on German screens, "🇷🇺 Русский" on Russian ones. */
export function languageLabel(language: TargetLanguage, appLanguageId: TargetLanguageId) {
  return NAMES[appLanguageId]?.[language.id] ?? language.label;
}
