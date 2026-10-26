import { type TargetLanguage, type TargetLanguageId, targetLanguageFor } from "@/content/targetLanguages";
import { RU } from "./ru";

// The stories and levels are written in German (`content.ts`, `trail/levels.ts`); each other language
// has a phrasebook with the same sentences, by the German text (`ru.ts`). Speech always uses the voice of
// the language the sentence is in, so a sentence missing from a phrasebook is said in German by the
// German voice, never German words by a Russian voice.

/** The phrasebook of each language besides German. */
const PHRASEBOOKS: Partial<Record<TargetLanguageId, Record<string, string>>> = { ru: RU };

const GERMAN = targetLanguageFor("de");

/** `german` in the language `id`; undefined when that language has no translation of it. */
export function translationOf(german: string, id: TargetLanguageId): string | undefined {
  return id === "de" ? german : PHRASEBOOKS[id]?.[german];
}

/** A title or label for grown-ups in the language `id`, German when it has no translation. */
export const titleIn = (german: string, id: TargetLanguageId) => translationOf(german, id) ?? german;

/** What to speak for `german` in `language`: the text and the speech language that reads it. */
export function spokenIn(german: string, language: TargetLanguage): { text: string; speechLang: string } {
  const text = translationOf(german, language.id);
  return text === undefined ? { text: german, speechLang: GERMAN.speechLang } : { text, speechLang: language.speechLang };
}
