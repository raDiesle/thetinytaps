import type { Localized } from "@/lib/language";

// Names kept here rather than in `games.ts` while they are German only: so the game's own row in the language table says
// they are missing, not the home page's (`inlineTexts.test.ts`).

/** The third book in the slipcase of Belohnungstafel and Zeitplan (H-05): it opens on a Countdown to a big day. */
export const WAIT_BOOK: Localized = { de: "Wie lange warten?" };
