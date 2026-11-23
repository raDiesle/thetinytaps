import type { EnglishFirst } from "@/lib/language";

// The story's name and its name in the book's choice of stories, kept here rather than in `games.ts`: the story's own
// row in the language table answers for them, not the home page's (`inlineTexts.test.ts`). English first, translated
// into every app language (root CLAUDE.md, user decision, 22 November 2026).

/** The story's name, in the browser tab and under its name in the book's choice of stories. */
export const TREE_TITLE: EnglishFirst = {
  en: "Tapsi and the Pacifier Tree",
  de: "Tapsi und der Schnullerbaum",
  zh: "塔普西和奶嘴树",
  hi: "टैप्सी और चुसनी का पेड़",
  es: "Tapsi y el árbol de los chupetes",
  ar: "تابسي وشجرة اللهايات",
  ru: "Тапси и дерево пустышек",
};

/**
 * Its name in the book „Schnullerfee“'s choice of stories (`PacifierStoryGame.tsx`), over its title: how the pacifiers
 * go, beside „Mit der Schnullerfee“ – hung on the tree in the park, without a fairy.
 */
export const TREE_KIND: EnglishFirst = {
  en: "At the pacifier tree",
  de: "Am Schnullerbaum",
  zh: "挂上奶嘴树",
  hi: "चुसनी के पेड़ पर",
  es: "En el árbol de los chupetes",
  ar: "عند شجرة اللهايات",
  ru: "У дерева пустышек",
};
