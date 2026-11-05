// The names of the two games of the book „Gefühle“, here in the game's folder rather than in the home page's
// `games.ts`, so the game's own row in the language table says which are still missing.

import type { Localized } from "@/lib/language";

/** The book's title on the shelf and above its table of contents. */
export const BOOK_TITLE: Localized = { de: "Gefühle", ru: "Чувства", en: "Feelings", zh: "情绪", hi: "भावनाएँ", es: "Emociones", ar: "المشاعر" };

/** The book's line for grown-ups. */
export const BOOK_BLURB: Localized = {
  de: "Der kleine Bär und seine Gefühle",
  en: "Little Bear and his feelings",
  zh: "小熊和它的心情",
  hi: "भालू और उसकी भावनाएँ",
  es: "El osito y sus emociones",
  ar: "الدبدوب ومشاعره",
  ru: "Мишка и его чувства",
};

/** The child tells how it feels, by a weather. */
export const MOOD_TITLE: Localized = {
  de: "Wie geht's dir?",
  ru: "Как дела?",
  en: "How are you?",
  zh: "心情怎么样？",
  hi: "कैसा लग रहा है?",
  es: "¿Cómo estás?",
  ar: "كيف حالك؟",
};

export const MOOD_BLURB: Localized = {
  de: "Das Kind zeigt, wie es ihm geht",
  en: "Your child shows how they feel",
  zh: "孩子表达自己的心情",
  hi: "बच्चे बताते हैं कि उन्हें कैसा लग रहा है",
  es: "Los peques muestran cómo se sienten",
  ar: "الأطفال يُظهرون مشاعرهم",
  ru: "Ребёнок показывает, как себя чувствует",
};

/** Everyday scenes by feeling: what helps when you're sad, angry, scared … */
export const ALLTAG_TITLE: Localized = {
  de: "Alltagssituationen",
  en: "Everyday situations",
  zh: "日常情景",
  hi: "रोज़ की बातें",
  es: "Situaciones cotidianas",
  ar: "مواقف يومية",
  ru: "Повседневные ситуации",
};

export const ALLTAG_BLURB: Localized = {
  de: "Was hilft bei Wut, Angst und Traurigkeit",
  en: "What helps with anger, fear and sadness",
  zh: "生气、害怕、难过时什么能帮忙",
  hi: "गुस्से, डर और उदासी में क्या मदद करता है",
  es: "Qué ayuda con enojo, miedo y tristeza",
  ar: "ما الذي يساعد في الغضب والخوف والحزن",
  ru: "Что помогает при злости, страхе и грусти",
};
