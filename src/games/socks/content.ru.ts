import type { SockTexts } from "./content";

// Russian texts for "Socken-Paare". "Носочек" is what one says to a small child;
// the praise has no verb in the past, so it fits every child.

/** The Russian texts; a sentence added later without its Russian is said in German (content.ts fills the gaps). */
export const RUSSIAN_TEXTS: Partial<SockTexts> = {
  start: "Найди два одинаковых носочка!",
  pair: ["Вот пара!", "Они одинаковые!", "Подходят!", "Два одинаковых!"],
  done: "Все носочки висят на верёвке!",
  sock: (n) => `Носочек ${n}`,
};
