import { TRANSLATION as cloudTrip } from "@/games/adventure/stories/cloudTrip/lines.it";
import { TRANSLATION as treasureIsland } from "@/games/adventure/stories/treasureIsland/lines.it";
import inline from "inline-texts:it";
import type { LanguageTexts } from ".";

// Everything in Italian that lives in files of its own, one chunk loaded only when the app plays in Italian
// (see index.ts). A new Italian file is listed here; texts.test.ts checks that none is missing.

/** The Italian texts. */
export const TEXTS: LanguageTexts = { inline, stories: { cloudTrip, treasureIsland } };
