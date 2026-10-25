import type { TargetLanguageId } from "@/content/targetLanguages";
import type { StoryTranslation } from "../story";
import { TRANSLATION as ar } from "./lines.ar";
import { TRANSLATION as en } from "./lines.en";
import { TRANSLATION as es } from "./lines.es";
import { TRANSLATION as hi } from "./lines.hi";
import { TRANSLATION as it } from "./lines.it";
import { TRANSLATION as ru } from "./lines.ru";
import { TRANSLATION as zh } from "./lines.zh";

// Every lines.<language>.ts of „Die Schatzinsel“ (yarn voice finds them by their file name;
// voice.test.ts checks that each one is listed here).

/** What Tapsi says in the languages besides German. */
export const TRANSLATIONS: Partial<Record<TargetLanguageId, StoryTranslation>> = { en, zh, hi, es, ar, ru, it };
