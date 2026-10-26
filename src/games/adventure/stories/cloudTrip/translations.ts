import type { TargetLanguageId } from "@/content/targetLanguages";
import type { StoryTranslation } from "../story";
import { TRANSLATION as ru } from "./lines.ru";

// Every lines.<language>.ts of „Die Wolkenreise“ (yarn voice finds them by their file name;
// voice.test.ts checks that each one is listed here).

/** What Tapsi says in the languages besides German. */
export const TRANSLATIONS: Partial<Record<TargetLanguageId, StoryTranslation>> = { ru };
