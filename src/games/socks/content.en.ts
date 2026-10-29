import type { SockTexts } from "./content";

// English texts for "Socken-Paare". The praise has no verb in the past, like the Russian.

/** The English texts; a sentence added later without its English is said in German (content.ts fills the gaps). */
export const ENGLISH_TEXTS: Partial<SockTexts> = {
  start: "Find two socks that match!",
  pair: ["A pair!", "They match!", "Just the same!", "Two the same!"],
  done: "All the socks are on the line!",
  sock: (n) => `Sock ${n}`,
};
