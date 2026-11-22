import { TRANSLATION as fireRescue } from "@/games/adventure/stories/fireRescue/lines.de";
import { HAIR_STORY_DE as hairStory } from "@/games/hairstory/de";
import { NIGHT_MILK_DE as nightMilk } from "@/games/nightmilk/de";
import { GOODBYE_MILK_DE as goodbyeMilk } from "@/games/milkgoodbye/de";
import { BOTTLE_STORY_DE as bottleStory } from "@/games/bottlestory/de";
import { BED_STORY_DE as bedStory } from "@/games/bedstory/de";
import type { LanguageTexts } from ".";

// The German translations of what is written English first (root CLAUDE.md, since November 2026), one chunk loaded
// only when the app plays in German (see index.ts). The older games are written German first into their own code and
// need nothing here. A new German file is listed here; texts.test.ts checks that none is missing.

/** The German texts. */
export const TEXTS: LanguageTexts = {
  hairStory,
  nightMilk,
  goodbyeMilk,
  bottleStory,
  bedStory,
  stories: { fireRescue },
};
