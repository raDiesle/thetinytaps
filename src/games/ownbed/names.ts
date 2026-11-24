import type { EnglishFirst } from "@/lib/language";

// The story's name and its name in the book's choice of stories, kept here rather than in `games.ts`: the story's own
// row in the language table answers for them, not the home page's (`inlineTexts.test.ts`). English first, translated
// into every app language (root CLAUDE.md, user decision, 22 November 2026).

/** The story's name, in the browser tab and under its name in the book's choice of stories. */
export const OWN_BED_TITLE: EnglishFirst = {
  en: "Tapsi's Own Bed",
  de: "Tapsis eigenes Bett",
  zh: "塔普西自己的床",
  hi: "टैप्सी का अपना बिस्तर",
  es: "La cama propia de Tapsi",
  ar: "سرير تابسي الخاص",
  ru: "Своя кровать Тапси",
};

/**
 * Its name in the book „Bed“'s choice of stories (`BedStoryGame.tsx` in src/games/bedstory), over its title: where the
 * child moves from, beside „From the cot“ – out of Mama and Papa's bed into a bed of its own.
 */
export const OWN_BED_KIND: EnglishFirst = {
  en: "From Mama and Papa's bed",
  de: "Aus dem Elternbett",
  zh: "从爸爸妈妈的床搬出来",
  hi: "मम्मी-पापा के बिस्तर से",
  es: "De la cama de mamá y papá",
  ar: "من سرير ماما وبابا",
  ru: "Из кровати мамы и папы",
};
