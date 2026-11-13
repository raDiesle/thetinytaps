import { HAIR_STORY_DE as hairStory } from "@/games/hairstory/de";
import type { LanguageTexts } from ".";

// The German translations of what is written English first (root CLAUDE.md, since November 2026), one chunk loaded
// only when the app plays in German (see index.ts). The older games are written German first into their own code and
// need nothing here. A new German file is listed here; texts.test.ts checks that none is missing.

/** The German texts. */
export const TEXTS: LanguageTexts = {
  hairStory,
};
