import type { Localized } from "@/lib/language";

// The names of the book's games and their lines in its table of contents, kept here rather than in `games.ts`:
// what is new comes German only, so the games' own rows in the language table say it is missing (`inlineTexts.test.ts`).

/** The games of the book „Buchstaben & Zahlen“, each on a page of its own (user feedback, November 2026). */
export type LettersWay = "free" | "count" | "move" | "words" | "case";

/** Frei tippen: every key shows its letter or number. */
export const FREE_TITLE: Localized = {
  de: "Frei tippen",
  ru: "Печатать что хочешь",
  en: "Free typing",
  zh: "随便按",
  hi: "आज़ाद टाइपिंग",
  es: "Teclear libre",
  ar: "كتابة حرة",
};

/** Its line in the book's table of contents. */
export const FREE_BLURB: Localized = {
  de: "Jede Taste zeigt Buchstabe, Bild und Wort",
  ru: "Клавиша – буква, картинка и слово",
  en: "Each key: a letter, a picture, a word",
  zh: "每个键都有字母、图片和词语",
  hi: "हर कुंजी अक्षर, तस्वीर और शब्द दिखाती है",
  es: "Cada tecla muestra letra, dibujo y palabra",
  ar: "كل زر يظهر حرفا وصورة وكلمة",
};

/** Zählen: only numbers come, with things to count. */
export const COUNT_TITLE: Localized = {
  de: "Zählen",
  ru: "Считаем",
  en: "Counting",
  zh: "数一数",
  hi: "गिनती",
  es: "Contar",
  ar: "العدّ",
};

/** Its line in the book's table of contents. */
export const COUNT_BLURB: Localized = {
  de: "Zahlen mit Dingen zum Zählen",
  ru: "Цифры и предметы, чтобы считать",
  en: "Numbers with things to count",
  zh: "数字和可以数的东西",
  hi: "गिनने वाली चीज़ों के साथ अंक",
  es: "Números con cosas para contar",
  ar: "أرقام مع أشياء للعدّ",
};

/** Mitmachen: a number is hopped, clapped or stamped as often as it says, counted aloud, and the child joins in (L-15). */
export const MOVE_TITLE: Localized = {
  de: "Mitmachen",
  ru: "Делай со мной",
  en: "Join in",
  zh: "一起动起来",
  hi: "चलो साथ करें",
  es: "Todos juntos",
  ar: "هيّا نتحرك معا",
};

/** Its line in the book's table of contents. */
export const MOVE_BLURB: Localized = {
  de: "Zahlen hüpfen, klatschen und stampfen",
  ru: "Прыгать, хлопать и топать по счёту",
  en: "Hop, clap and stomp the numbers",
  zh: "跟着数字跳、拍手、跺脚",
  hi: "गिनकर कूदना, ताली बजाना, पैर पटकना",
  es: "Saltar, aplaudir y zapatear los números",
  ar: "نقفز ونصفّق ونضرب بأقدامنا مع الأرقام",
};

/** Wörter tippen: a picture's word letter by letter, or the first letter's key („Wo ist das B?“). */
export const WORDS_TITLE: Localized = {
  de: "Wörter tippen",
  ru: "Печатаем слова",
  en: "Typing words",
  zh: "拼词语",
  hi: "शब्द टाइपिंग",
  es: "Escribir palabras",
  ar: "كتابة كلمات",
};

/** Its line in the book's table of contents. */
export const WORDS_BLURB: Localized = {
  de: "Erste Wörter und Buchstaben suchen",
  ru: "Первые слова и поиск букв",
  en: "First words and finding letters",
  zh: "第一批词语，找字母",
  hi: "पहले शब्द और अक्षर ढूँढना",
  es: "Primeras palabras y buscar letras",
  ar: "كلمات أولى والبحث عن الحروف",
};

/** Wo ist das kleine b?: a big letter looks for its small one among three (L-23). German only until translations are asked for. */
export const CASE_TITLE: Localized = { de: "Wo ist das kleine b?" };

/** Its line in the book's table of contents. */
export const CASE_BLURB: Localized = { de: "Großer Buchstabe sucht sein kleines Kind" };

/** Each game's name, by the way it plays. */
export const WAY_TITLES: Record<LettersWay, Localized> = { free: FREE_TITLE, count: COUNT_TITLE, move: MOVE_TITLE, words: WORDS_TITLE, case: CASE_TITLE };
