import { byLanguage } from "@/content/texts";
import { type TargetLanguage, type TargetLanguageId, targetLanguageFor } from "@/content/targetLanguages";

// The stories and levels are written in German (`content.ts`, `trail/levels.ts`); each other language
// has a phrasebook with the same sentences, by the German text (`en.ts`, `zh.ts`, `hi.ts`, `es.ts`, `ar.ts`,
// `ru.ts`), loaded with the app language (src/content/texts). The films written English first are keyed by their
// English text in those books, and German has a book of them too (`de.ts`). Speech always uses the voice of the language the sentence is in, so a sentence missing from a
// phrasebook is said in German by the German voice, never German words by another language's voice.

/** The phrasebook of each language; German's holds only the films written English first, by their English text (`de.ts`). */
export const PHRASEBOOKS: Partial<Record<TargetLanguageId, Record<string, string>>> = byLanguage((texts) => texts.elevator);

const GERMAN = targetLanguageFor("de");
const ENGLISH = targetLanguageFor("en");

/** The language a story, level or film is written in: German for the older ones, English for what is new (`Film.first`). */
export type FirstLanguage = "de" | "en";

/** `text`, written in the first language `first`, in the language `id`; undefined when that language has no translation of it. */
export function translationOf(text: string, id: TargetLanguageId, first: FirstLanguage = "de"): string | undefined {
  return id === first ? text : PHRASEBOOKS[id]?.[text];
}

/** A title or label for grown-ups in the language `id`, in its first language when it has no translation. */
export const titleIn = (text: string, id: TargetLanguageId, first: FirstLanguage = "de") => translationOf(text, id, first) ?? text;

/** What to speak for `text` (written in `first`) in `language`: the text and the speech language that reads it. A text without
 * a translation is said in its first language, and its English recording stands in where there is none of the language's. */
export function spokenIn(text: string, language: TargetLanguage, first: FirstLanguage = "de"): { text: string; speechLang: string; english?: string } {
  const own = first === "en" ? ENGLISH : GERMAN;
  const translated = translationOf(text, language.id, first);
  const english = language.id === "en" ? undefined : first === "en" ? text : translationOf(text, "en");
  return translated === undefined ? { text, speechLang: own.speechLang, english } : { text: translated, speechLang: language.speechLang, english };
}
