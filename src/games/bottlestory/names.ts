import type { EnglishFirst } from "@/lib/language";

// The story's name and its line for grown-ups, kept here rather than in `games.ts`: the story's own row in the language
// table answers for them, not the home page's (`inlineTexts.test.ts`). English first (root CLAUDE.md, user decision,
// 11 November 2026), translated on request (21 November 2026).

/** The story's name, in the browser tab and over its table of contents. */
export const BOTTLE_STORY_TITLE: EnglishFirst = {
  en: "Bye-Bye, Bottle!",
  de: "Tschüss, Fläschchen!",
  zh: "再见，奶瓶！",
  hi: "बाय-बाय, बोतल!",
  es: "¡Adiós, biberón!",
  ar: "وداعًا يا رضّاعة!",
  ru: "Пока-пока, бутылочка!",
};

/** The name of its book on the shelf, among the Alltagshelfer beside „Abstillen“: what parents look for. */
export const BOTTLE_STORY_BOOK: EnglishFirst = {
  en: "Bottle to Cup",
  de: "Flasche abgewöhnen",
  zh: "从奶瓶到杯子",
  hi: "बोतल से कप तक",
  es: "Del biberón al vaso",
  ar: "من الرضّاعة إلى الكوب",
  ru: "От бутылочки к чашке",
};

/** Its line for grown-ups. */
export const BOTTLE_STORY_BLURB: EnglishFirst = {
  en: "From bottle to cup, gently – in chapters",
  de: "Vom Fläschchen zum Becher – in Kapiteln",
  zh: "从奶瓶到杯子，慢慢来——分章节讲",
  hi: "प्यार से बोतल से कप तक – अध्यायों में",
  es: "Adiós al biberón, con calma, en capítulos",
  ar: "من الرضّاعة إلى الكوب بلطف – على فصول",
  ru: "Бережно от бутылочки к чашке – по главам",
};
