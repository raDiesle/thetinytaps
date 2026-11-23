import type { EnglishFirst } from "@/lib/language";

// The story's name and its name in the book's choice of stories, kept here rather than in `games.ts`: the story's own
// row in the language table answers for them, not the home page's (`inlineTexts.test.ts`). English first, translated
// into every app language (root CLAUDE.md, user decision, 22 November 2026).

/** The story's name, in the browser tab and under its name in the book's choice of stories. */
export const SHOWER_TITLE: EnglishFirst = {
  en: "Tapsi and the Warm Rain",
  de: "Tapsi und der warme Regen",
  zh: "塔普西和温暖的雨",
  hi: "टैप्सी और गुनगुनी बारिश",
  es: "Tapsi y la lluvia calentita",
  ar: "تابسي والمطر الدافئ",
  ru: "Тапси и тёплый дождик",
};

/**
 * Its name in the book „Haare waschen“'s choice of stories (`HairStoryGame.tsx`), over its title: where the hair is
 * washed, beside „In der Badewanne“ – for families with a shower and no bathtub.
 */
export const SHOWER_KIND: EnglishFirst = {
  en: "In the shower",
  de: "Unter der Dusche",
  zh: "在淋浴下",
  hi: "शावर में",
  es: "En la ducha",
  ar: "تحت الدُّش",
  ru: "Под душем",
};
