import type { SockTexts } from "./content";

// Hindi texts for "Socken-Paare". The child gets commands (ढूँढो) and praise without a verb about it,
// because "you found" would differ for a boy and a girl. मोज़ा is a sock, जोड़ा a pair (जोड़े for more).

/** The Hindi texts; a sentence added later without its Hindi is said in German (content.ts fills the gaps). */
export const HINDI_TEXTS: Partial<SockTexts> = {
  start: "दो एक जैसे मोज़े ढूँढो!",
  pair: ["एक जोड़ा!", "ये साथ जाते हैं!", "बिल्कुल एक जैसे!", "दो एक जैसे!"],
  done: "सारे मोज़े रस्सी पर टँगे हैं!",
  sock: (n) => `मोज़ा ${n}`,
};
