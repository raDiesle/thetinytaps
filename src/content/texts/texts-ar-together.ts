import { ARABIC as togetherHandmade } from "@/games/together/content.ar";
import { ARABIC_SCENES as togetherScenes } from "@/games/together/content.scenes.ar";
import type { LanguageTexts } from ".";

// Was gehört zusammen? in Arabic, a chunk of its own loaded with the game's page (`withTexts` in App.tsx), not before the
// first screen with texts-ar.ts (see index.ts). A new Arabic file of the game is listed here; texts.test.ts checks.

/** The Arabic texts of Was gehört zusammen?. */
export const TEXTS: LanguageTexts = { together: { ...togetherHandmade, ...togetherScenes } };
