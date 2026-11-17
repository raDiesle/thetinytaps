import { RUSSIAN as togetherHandmade } from "@/games/together/content.ru";
import { RUSSIAN_SCENES as togetherScenes } from "@/games/together/content.scenes.ru";
import type { LanguageTexts } from ".";

// Was gehört zusammen? in Russian, a chunk of its own loaded with the game's page (`withTexts` in App.tsx), not before the
// first screen with texts-ru.ts (see index.ts). A new Russian file of the game is listed here; texts.test.ts checks.

/** The Russian texts of Was gehört zusammen?. */
export const TEXTS: LanguageTexts = { together: { ...togetherHandmade, ...togetherScenes } };
