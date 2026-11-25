import type { EnglishFirst } from "@/lib/language";

// „Counting Tower“ (idea L-18), a game of the book „Buchstaben & Zahlen“: its name, its line and the few words it has
// stand here in its own folder, so its row in the language table answers for them. In all seven app languages.

/** The game's name in the book's table of contents and in the browser tab. */
export const TOWER_TITLE: EnglishFirst = {
  en: "Counting Tower",
  de: "Zähl-Turm",
  zh: "数数塔",
  hi: "गिनती की मीनार",
  es: "Torre de contar",
  ar: "برج العدّ",
  ru: "Башня счёта",
};

/** Its line for grown-ups in the book's table of contents. */
export const TOWER_BLURB: EnglishFirst = {
  en: "A house of a hundred blocks, ten on ten",
  de: "Ein Haus bis hundert, Zehner auf Zehner",
  zh: "十个一层，盖一座一百块的房子",
  hi: "सौ ब्लॉक का घर, दस पर दस",
  es: "Una casa de cien bloques, diez sobre diez",
  ar: "بيت من مئة مكعب، عشرة فوق عشرة",
  ru: "Дом из ста кубиков, десяток на десяток",
};

/** The count goes to a hundred: ten floors of ten blocks. */
export const TOTAL = 100;
export const ROW = 10;

/** „one hundred!“, the last number word, which the two-digit words don't have. */
export const HUNDRED: EnglishFirst = {
  en: "one hundred!",
  de: "hundert!",
  zh: "一百！",
  hi: "सौ!",
  es: "¡cien!",
  ar: "مئة!",
  ru: "сто!",
};

/** The small plus beside the next row, read out only: lay the rest of this ten and go on at the next. */
export const ADD_ROW_TEXT: EnglishFirst = {
  en: "Next ten",
  de: "Nächster Zehner",
  zh: "下一个十",
  hi: "अगले दस",
  es: "Siguiente decena",
  ar: "العشرة التالية",
  ru: "Следующий десяток",
};
