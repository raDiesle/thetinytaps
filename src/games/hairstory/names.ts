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

/**
 * Its name in the book's choice of stories (`HairStoryGame.tsx`), over its title: where the hair is washed, beside „Unter
 * der Dusche“ (src/games/hairshower). English first, since it came with that second story (23 November 2026).
 */
export const HAIR_BATH_KIND: EnglishFirst = {
  en: "In the bathtub",
  de: "In der Badewanne",
  zh: "在浴缸里",
  hi: "बाथटब में",
  es: "En la bañera",
  ar: "في حوض الاستحمام",
  ru: "В ванне",
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
  en: "In the bath or the shower – in chapters",
  de: "Wanne oder Dusche – in Kapiteln",
  zh: "在浴缸里或淋浴下——分章节讲",
  hi: "टब में या शावर में – अध्यायों में",
  es: "En la bañera o en la ducha, en capítulos",
  ar: "في الحوض أو تحت الدُّش – على فصول",
  ru: "В ванне или под душем – по главам",
};
