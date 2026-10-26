import type { SockTexts } from "./content";

// Russian texts for "Socken-Paare". "Носочек" is what one says to a small child;
// the praise has no verb in the past, so it fits every child.

/** "пара", "пары" or "пар", the form Russian numbers ask for: 1 пара, 3 пары, 5 пар. */
const PAIR_FORMS: Record<string, string> = { one: "пара", few: "пары", many: "пар", other: "пары" };
const plural = new Intl.PluralRules("ru-RU");

/** The Russian texts; a sentence added later without its Russian is said in German (content.ts fills the gaps). */
export const RUSSIAN_TEXTS: Partial<SockTexts> = {
  start: "Найди два одинаковых носочка!",
  pair: ["Вот пара!", "Они одинаковые!", "Подходят!", "Два одинаковых!"],
  done: "Все носочки висят на верёвке!",
  pairs: (n) => `${n} ${PAIR_FORMS[plural.select(n)]}`,
  sock: (n) => `Носочек ${n}`,
};
