import type { EnglishFirst } from "@/lib/language";

// The story's name and its name in the book's choice of stories, kept here rather than in `games.ts`: the story's own
// row in the language table answers for them, not the home page's (`inlineTexts.test.ts`). English first, translated
// into every app language (root CLAUDE.md, user decision, 22 November 2026).

/** The story's name, in the browser tab and under its name in the book's choice of stories. */
export const CHILDMINDER_TITLE: EnglishFirst = {
  en: "Tapsi Goes to Lotta's",
  de: "Tapsi geht zu Lotta",
  zh: "塔普西去洛塔家",
  hi: "टैप्सी लोट्टा के घर जाता है",
  es: "Tapsi va a casa de Lotta",
  ar: "تابسي يذهب إلى بيت لوتا",
  ru: "Тапси идёт к Лотте",
};

/**
 * Its name in the book „Kita-Start“'s choice of stories (`KitaStoryGame.tsx`), over its title: where the child is looked
 * after, beside „In der Kita“ – for families whose child goes to a childminder (Tagesmutter, Kindertagespflege).
 */
export const CHILDMINDER_KIND: EnglishFirst = {
  en: "At a childminder's",
  de: "Bei der Tagesmutter",
  zh: "在保育阿姨家",
  hi: "होम डेकेयर में",
  es: "Con una cuidadora en su casa",
  ar: "عند مربّية في بيتها",
  ru: "У няни на дому",
};
