import { useSyncExternalStore } from "react";
import { type TargetLanguage, type TargetLanguageId, targetLanguageFor } from "@/content/targetLanguages";
import { hasTexts, loadTexts } from "@/content/texts";
import { LANGUAGE_KEY, playLanguage } from "@/lib/locale";
import { addressLanguage } from "@/lib/pageAddress";
import { keepTextsOffline } from "@/lib/pwa";

// The language of the whole app, chosen once on the home page: the grown-ups'
// screens (home page, start screens, settings) and what the child hears and sees
// in every game, the letters and words games and Tapsi included: one language,
// never mixed. A text gives its first language and the translations next to each other,
// t({ en: "Music", ru: "Музыка" }). What is new is written in English first (user decision, November 2026), what
// came before in German; a language a text lacks falls back to German where the text has it, else to English.

/** The same thing in several languages, written German first (before November 2026): German stands in for the others missing. */
export type Localized<T = string> = { de: T } & Partial<Record<TargetLanguageId, T>>;

/** The same thing in several languages, written English first, as everything new is: English stands in for the others missing. */
export type EnglishFirst<T = string> = { en: T } & Partial<Record<TargetLanguageId, T>>;

/** A text written in either first language; what `t`, `pick` and `spokenIn` take. */
export type Texts<T = string> = Localized<T> | EnglishFirst<T>;

/** Languages the whole app (grown-up screens included) can be switched to, in menu order. */
export const APP_LANGUAGES: TargetLanguageId[] = ["de", "en", "zh", "hi", "es", "ar", "ru"];

/** The language a text stands in with where it lacks one: German where it has it (the older texts), else English. */
export const firstLanguage = (texts: Texts<unknown>): "de" | "en" => (texts.de === undefined ? "en" : "de");

/** The thing in `language`, or in its first language when there is none (`firstLanguage`). */
export function pick<T>(texts: Localized<T>, language: TargetLanguageId): T;
export function pick<T>(texts: EnglishFirst<T>, language: TargetLanguageId): T;
export function pick<T>(texts: Texts<T>, language: TargetLanguageId): T;
export function pick<T>(texts: Texts<T>, language: TargetLanguageId): T {
  return (texts[language] ?? texts[firstLanguage(texts)]) as T;
}

/** `t`: a text in the app language; one signature per first language, so `T` is read from the text as it is. */
export interface Translate {
  <T>(texts: Localized<T>): T;
  <T>(texts: EnglishFirst<T>): T;
  <T>(texts: Texts<T>): T;
}

const KEY = LANGUAGE_KEY;
const listeners = new Set<() => void>();

/** The saved app language; until a grown-up picks one, the browser's language if the app speaks it (playLanguage). */
function load(): TargetLanguageId {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved && APP_LANGUAGES.includes(saved as TargetLanguageId)) return saved as TargetLanguageId;
  } catch {
    // Storage unavailable: the default below.
  }
  return playLanguage(APP_LANGUAGES, undefined, undefined, addressLanguage());
}

let current = load();

function apply(id: TargetLanguageId) {
  // `lang` also lets Arabic text run right to left while pictures and layout stay as they are (base.css).
  if (typeof document !== "undefined") document.documentElement.lang = id;
}
apply(current);

/**
 * Loads the texts of the app language (src/content/texts) before the first screen shows (index.tsx), so
 * nothing starts in German and turns into another language. Where they can't be loaded (offline before the
 * service worker kept them), this visit plays in German, never half in one language and half in another.
 */
export async function loadAppLanguage() {
  try {
    await loadTexts(current);
    keepTextsOffline(current);
  } catch {
    current = "de";
    apply(current);
  }
}

/**
 * Switches the whole app to `id` and remembers it; every component using the language renders again. A language
 * not loaded yet switches once its texts are there; offline without them, the app stays in the language it has.
 */
export function setAppLanguage(id: TargetLanguageId) {
  const switchTo = () => {
    current = id;
    apply(id);
    try {
      localStorage.setItem(KEY, id);
    } catch {
      // Storage full or disabled: the language still applies for this visit.
    }
    keepTextsOffline(id);
    for (const listener of listeners) listener();
  };
  if (hasTexts(id)) switchTo();
  // German plays without its texts (only the English-first stories' translations are missing, and show in English).
  else loadTexts(id).then(switchTo, id === "de" ? switchTo : () => {});
}

/** The app language outside React, e.g. in a sound helper; components use useAppLanguage. */
export const appLanguage = () => current;

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** The app language (id, speech language, label); shared by all components, so switching it updates every screen at once. */
export function useAppLanguage(): TargetLanguage {
  return targetLanguageFor(useSyncExternalStore(subscribe, appLanguage));
}

/** A line to speak and the voice for it. */
export interface Spoken<T = string> {
  text: T;
  /** Speech language, e.g. "ru-RU". */
  lang: string;
  /** The same line in English, for a voice that has no recording of `text` (`say`'s `english`); none in German or English. */
  english?: string;
}

/**
 * A line in `language` and its voice; where the translation is missing, the line in its first language with that
 * language's voice (translations come only on request, and a Russian voice reading German words would be neither).
 */
export function spokenIn<T>(texts: Localized<T>, language: TargetLanguage): Spoken<T>;
export function spokenIn<T>(texts: EnglishFirst<T>, language: TargetLanguage): Spoken<T>;
export function spokenIn<T>(texts: Texts<T>, language: TargetLanguage): Spoken<T>;
export function spokenIn<T>(texts: Texts<T>, language: TargetLanguage): Spoken<T> {
  const own = texts[language.id];
  const english = language.id !== "en" && language.id !== "de" && typeof texts.en === "string" ? texts.en : undefined;
  if (own !== undefined) return { text: own, lang: language.speechLang, english };
  const first = firstLanguage(texts);
  return { text: texts[first] as T, lang: targetLanguageFor(first).speechLang, english };
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

/** `t` for the app language: t({ en: "Music", ru: "Музыка" }) → the text in the chosen language. */
export function useT(): Translate {
  const { id } = useAppLanguage();
  return <T>(texts: Texts<T>) => pick(texts, id);
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
