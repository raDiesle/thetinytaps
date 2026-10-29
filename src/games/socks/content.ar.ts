import type { SockTexts } from "./content";

// Arabic texts for "Socken-Paare". Talking to the child is "let's" (هيّا نبحث), because a command would differ
// for a boy and a girl. جورب is a sock, زوج a pair.

/** The Arabic texts; a sentence added later without its Arabic is said in German (content.ts fills the gaps). */
export const ARABIC_TEXTS: Partial<SockTexts> = {
  start: "هيّا نبحث عن جوربين متشابهين!",
  pair: ["زوج!", "إنهما متشابهان!", "متطابقان!", "اثنان متشابهان!"],
  done: "كل الجوارب معلّقة على الحبل!",
  sock: (n) => `جورب ${n}`,
};
