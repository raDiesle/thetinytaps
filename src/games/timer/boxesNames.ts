import type { EnglishFirst } from "@/lib/language";

// „Five Boxes“ (H-120, 22 November 2026), the second picture for tidying up: written English first and translated into
// every app language in the same commit. Its texts stand here on their own, so the language table
// (`languageStatus.ts`) can name them as a part of their own.

/** The picture's name, read out and as the card's tooltip. */
export const BOXES_NAME: EnglishFirst = {
  en: "Five Boxes",
  de: "Fünf Kisten",
  zh: "五个箱子",
  hi: "पाँच डिब्बे",
  es: "Cinco cajas",
  ar: "خمسة صناديق",
  ru: "Пять ящиков",
};

/** What it says as it starts, where it goes, and at the end, what is there now (H-72). */
export const BOXES_LINES: { start: EnglishFirst; end: EnglishFirst } = {
  start: {
    en: "Every toy goes into its box.",
    de: "Jedes Spielzeug kommt in seine Kiste.",
    zh: "每个玩具都回到自己的箱子里。",
    hi: "हर खिलौना अपने डिब्बे में जाता है।",
    es: "Cada juguete va a su caja.",
    ar: "كل لعبة تذهب إلى صندوقها.",
    ru: "Каждая игрушка идёт в свой ящик.",
  },
  end: {
    en: "All the boxes are closed!",
    de: "Alle Kisten sind zu!",
    zh: "箱子都关好了！",
    hi: "सारे डिब्बे बंद हो गए!",
    es: "¡Todas las cajas están cerradas!",
    ar: "كل الصناديق مغلقة!",
    ru: "Все ящики закрыты!",
  },
};
