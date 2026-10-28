import type { SockTexts } from "./content";

// Arabic texts for "Socken-Paare". Talking to the child is "let's" (هيّا نبحث), because a command would differ
// for a boy and a girl. جورب is a sock, زوج a pair; numbers ask for their own form (see `pairs`).

/** "زوج" after a number, the form Arabic asks for: 3 أزواج, 11 زوجًا, 100 زوج (1 and 2 have words of their own). */
const PAIR_FORMS: Record<string, string> = { zero: "أزواج", few: "أزواج", many: "زوجًا", other: "زوج" };
const plural = new Intl.PluralRules("ar");

/** The Arabic texts; a sentence added later without its Arabic is said in German (content.ts fills the gaps). */
export const ARABIC_TEXTS: Partial<SockTexts> = {
  start: "هيّا نبحث عن جوربين متشابهين!",
  pair: ["زوج!", "إنهما متشابهان!", "متطابقان!", "اثنان متشابهان!"],
  done: "كل الجوارب معلّقة على الحبل!",
  pairs: (n) => {
    const form = plural.select(n);
    if (form === "one") return "زوج واحد";
    if (form === "two") return "زوجان";
    return `${n} ${PAIR_FORMS[form]}`;
  },
  sock: (n) => `جورب ${n}`,
};
