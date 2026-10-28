import type { TargetLanguageId } from "@/content/targetLanguages";
import { byLanguage } from "@/content/texts";
import type { StoryTranslation } from "../story";

// Every lines.<language>.ts of „Die Wolkenreise“, loaded with the app language: each is listed in
// src/content/texts/texts-<language>.ts (bun run voice finds them by their file name; voice.test.ts checks that each one is there).

/** What Tapsi says in the languages besides German. */
export const TRANSLATIONS: Partial<Record<TargetLanguageId, StoryTranslation>> = byLanguage((texts) => texts.stories?.cloudTrip);
