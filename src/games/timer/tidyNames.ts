import type { EnglishFirst } from "@/lib/language";

// „Tidy Up“ (H-118, 21 November 2026), the timer's picture for tidying up: written English first, as everything new
// is, and translated into every app language on 22 November 2026. Its texts stand here on their own, so the language
// table (`languageStatus.ts`) can name them as a part of their own.

/** The picture's name, read out and as the card's tooltip. */
export const TIDY_NAME: EnglishFirst = { en: "Tidy Up", de: "Aufräumen", zh: "收拾玩具", hi: "खिलौने समेटना", es: "Recoger", ar: "الترتيب", ru: "Уборка" };

/** What it says as it starts, where it goes, and at the end, what is there now (H-72). */
export const TIDY_LINES: { start: EnglishFirst; end: EnglishFirst } = {
  start: {
    en: "Let's tidy up! The crane helps.",
    de: "Wir räumen auf! Der Kran hilft.",
    zh: "我们来收拾吧！吊车来帮忙。",
    hi: "चलो, खिलौने समेटें! क्रेन मदद करती है।",
    es: "¡Vamos a recoger! La grúa ayuda.",
    ar: "هيّا نرتّب! الرافعة تساعدنا.",
    ru: "Давай наведём порядок! Кран помогает.",
  },
  end: {
    en: "All the toys are in the box!",
    de: "Alle Spielsachen sind in der Kiste!",
    zh: "玩具都放进箱子里了！",
    hi: "सारे खिलौने डिब्बे में हैं!",
    es: "¡Todos los juguetes están en la caja!",
    ar: "كل الألعاب في الصندوق!",
    ru: "Все игрушки в ящике!",
  },
};
