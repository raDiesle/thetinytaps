import type { EnglishFirst } from "@/lib/language";

// The story's name and its line for grown-ups, kept here rather than in `games.ts`: the story's own row in the language
// table answers for them, not the home page's (`inlineTexts.test.ts`). English first (root CLAUDE.md, user decision,
// 11 November 2026), translated on request (13 November 2026).

/** The story's name, in the browser tab and over its table of contents. */
export const HAIR_STORY_TITLE: EnglishFirst = {
  en: "Tapsi and the Foam Crown",
  de: "Tapsi und die Schaumkrone",
  zh: "塔普西和泡泡王冠",
  hi: "टैप्सी और झाग का ताज",
  es: "Tapsi y la corona de espuma",
  ar: "تابسي وتاج الرغوة",
  ru: "Тапси и корона из пены",
};

/** The name of its book on the shelf, among the Alltagshelfer beside „Kita-Start“: what parents look for. */
export const HAIR_STORY_BOOK: EnglishFirst = {
  en: "Hair Washing",
  de: "Haare waschen",
  zh: "洗头发",
  hi: "बाल धोना",
  es: "Lavar el pelo",
  ar: "غسل الشعر",
  ru: "Мытьё головы",
};

/** Its line for grown-ups. */
export const HAIR_STORY_BLURB: EnglishFirst = {
  en: "Washing hair calmly – in chapters",
  de: "Haare waschen ganz entspannt – in Kapiteln",
  zh: "安安心心洗头发——分章节讲",
  hi: "आराम से बाल धोना – अध्यायों में",
  es: "Lavar el pelo con calma, en capítulos",
  ar: "غسل الشعر بهدوء – على فصول",
  ru: "Спокойно моем голову – по главам",
};
