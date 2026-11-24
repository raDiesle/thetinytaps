import type { EnglishFirst, Localized } from "@/lib/language";

// The story's name and its line for grown-ups, kept here rather than in `games.ts`: the story's own row in the language
// table answers for them, not the home page's (`inlineTexts.test.ts`). Translated on request on 10 November 2026.

/** The story's name, in the browser tab and over its table of contents. */
export const PACIFIER_STORY_TITLE: Localized = {
  de: "Tapsi und die Schnullerfee",
  en: "Tapsi and the Pacifier Fairy",
  zh: "塔普西和奶嘴仙子",
  hi: "टैप्सी और चुसनी परी",
  es: "Tapsi y el hada del chupete",
  ar: "تابسي وجنية اللهاية",
  ru: "Тапси и фея пустышек",
};

/** The name of its book on the shelf, among the Alltagshelfer beside „Abstillen“: what parents look for. */
export const PACIFIER_STORY_BOOK: Localized = {
  de: "Schnullerfee",
  en: "Pacifier Fairy",
  zh: "奶嘴仙子",
  hi: "चुसनी परी",
  es: "Hada del chupete",
  ar: "جنية اللهاية",
  ru: "Фея пустышек",
};

/** Its line for grown-ups. */
export const PACIFIER_STORY_BLURB: Localized = {
  de: "Mit Fee oder Schnullerbaum – in Kapiteln",
  en: "Fairy or pacifier tree – in chapters",
  zh: "仙子或奶嘴树——分章节",
  hi: "परी या चुसनी का पेड़ – अध्यायों में",
  es: "Con hada o en el árbol, por capítulos",
  ar: "مع الجنّية أو عند الشجرة، في فصول",
  ru: "С феей или у дерева, по главам",
};

/**
 * Its name in the book's choice of stories (`PacifierStoryGame.tsx`), over its title: how the pacifiers go, beside „Am
 * Schnullerbaum“ (src/games/pacifiertree). English first, since it came with that second story (23 November 2026).
 */
export const PACIFIER_FAIRY_KIND: EnglishFirst = {
  en: "With the pacifier fairy",
  de: "Mit der Schnullerfee",
  zh: "请奶嘴仙子来",
  hi: "चुसनी परी के साथ",
  es: "Con el hada del chupete",
  ar: "مع جنية اللهاية",
  ru: "С феей пустышек",
};
