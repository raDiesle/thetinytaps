import { useSyncExternalStore } from "react";
import { type TargetLanguage, type TargetLanguageId, targetLanguageFor } from "@/content/targetLanguages";

// The language of the whole app, chosen once on the home page: the grown-ups'
// screens (home page, start screens, settings) and what the child hears and sees
// in every game that speaks it. A text gives the German and the translations next
// to each other, t({ de: "Musik", ru: "Музыка" }); a language a text lacks falls
// back to German. Games that let grown-ups pick a language of their own (the
// letters and words games, the Bewegungsabenteuer) keep that choice.

/** The same thing in several languages; German is always there and is used for the others missing. */
export type Localized<T = string> = { de: T } & Partial<Record<TargetLanguageId, T>>;

/** Languages the whole app (grown-up screens included) can be switched to, in menu order. */
export const APP_LANGUAGES: TargetLanguageId[] = ["de", "ru"];

/** The thing in `language`, or the German one when there is none. */
export const pick = <T>(texts: Localized<T>, language: TargetLanguageId): T => texts[language] ?? texts.de;

const KEY = "tinytaps.applanguage.v1";
const listeners = new Set<() => void>();

function load(): TargetLanguageId {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved && APP_LANGUAGES.includes(saved as TargetLanguageId)) return saved as TargetLanguageId;
  } catch {
    // Storage unavailable: German.
  }
  return "de";
}

let current = load();

function apply(id: TargetLanguageId) {
  if (typeof document !== "undefined") document.documentElement.lang = id;
}
apply(current);

/** Switches the whole app to `id` and remembers it; every component using the language renders again. */
export function setAppLanguage(id: TargetLanguageId) {
  current = id;
  apply(id);
  try {
    localStorage.setItem(KEY, id);
  } catch {
    // Storage full or disabled: the language still applies for this visit.
  }
  for (const listener of listeners) listener();
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

/** Each wanted language named in Russian, for language choices on Russian screens. */
const RUSSIAN_NAMES: Record<TargetLanguageId, string> = {
  de: "🇩🇪 Немецкий",
  en: "🇺🇸 Английский",
  zh: "🇨🇳 Китайский",
  hi: "🇮🇳 Хинди",
  es: "🇪🇸 Испанский",
  ar: "🇸🇦 Арабский",
  ru: "🇷🇺 Русский",
  it: "🇮🇹 Итальянский",
};

/** Flag and name of `language` in the app language: "🇷🇺 Russisch" on German screens, "🇷🇺 Русский" on Russian ones. */
export function languageLabel(language: TargetLanguage, appLanguageId: TargetLanguageId) {
  return appLanguageId === "ru" ? RUSSIAN_NAMES[language.id] : language.label;
}
