import type { EnglishFirst } from "@/lib/language";

// The treasure tunnel (H-126, 22 November 2026), the second timer that looks like a block world played by itself:
// written English first and translated into every app language in the same commit. Its texts stand here on their own,
// so the language table (`languageStatus.ts`) can name them as a part of their own.

/** The picture's name, read out, as the card's tooltip and the trophy's. */
export const TUNNEL_NAME: EnglishFirst = {
  en: "Treasure Tunnel",
  de: "Schatztunnel",
  zh: "寻宝隧道",
  hi: "ख़ज़ाने की सुरंग",
  es: "Túnel del tesoro",
  ar: "نفق الكنز",
  ru: "Туннель к сокровищу",
};

/** What it says as it starts, where it goes, and at the end, what is there now (H-72). */
export const TUNNEL_LINES: { start: EnglishFirst; end: EnglishFirst } = {
  start: {
    en: "Let's dig a tunnel to the treasure chest.",
    de: "Wir graben einen Tunnel zur Schatzkiste.",
    zh: "我们挖一条隧道，一直挖到宝箱那里。",
    hi: "चलो, ख़ज़ाने के बक्से तक सुरंग खोदते हैं।",
    es: "Vamos a cavar un túnel hasta el cofre del tesoro.",
    ar: "هيّا نحفر نفقًا إلى صندوق الكنز.",
    ru: "Давай прокопаем туннель к сундуку с сокровищами.",
  },
  end: {
    en: "The way is clear! The treasure chest is open.",
    de: "Der Weg ist frei! Die Schatzkiste ist offen.",
    zh: "路挖通了！宝箱打开了。",
    hi: "रास्ता खुल गया! ख़ज़ाने का बक्सा खुला है।",
    es: "¡El camino está libre! El cofre del tesoro está abierto.",
    ar: "الطريق مفتوح! وصندوق الكنز مفتوح.",
    ru: "Путь свободен! Сундук открыт.",
  },
};
