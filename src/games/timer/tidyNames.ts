import type { EnglishFirst } from "@/lib/language";

// „Tidy Up“ (H-118, 21 November 2026), the timer's picture for tidying up: written English first, as everything new
// is, and translated only when asked for – German included. Its texts stand here on their own, so the language table
// (`languageStatus.ts`) can say they are English only while the Timer's other texts are in every language.

/** The picture's name, read out and as the card's tooltip. */
export const TIDY_NAME: EnglishFirst = { en: "Tidy Up" };

/** What it says as it starts, where it goes, and at the end, what is there now (H-72). */
export const TIDY_LINES: { start: EnglishFirst; end: EnglishFirst } = {
  start: { en: "Let's tidy up! The crane helps." },
  end: { en: "All the toys are in the box!" },
};
