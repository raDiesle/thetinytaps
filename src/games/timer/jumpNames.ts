import type { EnglishFirst } from "@/lib/language";

// Hop to the Flag (H-127, 22 November 2026), the third timer that looks like a game played by itself and the first
// that is no block world, a jump-and-run: written English first and translated into every app language in the same
// commit. Its texts stand here on their own, so the language table (`languageStatus.ts`) can name them as a part of their own.

/** The picture's name, read out, as the card's tooltip and the trophy's. */
export const JUMP_NAME: EnglishFirst = {
  en: "Hop to the Flag",
  de: "Hüpf zur Fahne",
  zh: "跳到旗子那里",
  hi: "झंडे तक कूदो",
  es: "Saltos hasta la bandera",
  ar: "قفزًا إلى العَلَم",
  ru: "Прыг-скок до флажка",
};

/** What it says as it starts, where it goes, and at the end, what is there now (H-72). */
export const JUMP_LINES: { start: EnglishFirst; end: EnglishFirst } = {
  start: {
    en: "Hop, hop! Let's hop all the way to the flag.",
    de: "Hopp, hopp! Wir hüpfen bis zur Fahne.",
    zh: "跳呀跳！我们一直跳到旗子那里。",
    hi: "हॉप, हॉप! चलो, झंडे तक कूदते हैं।",
    es: "¡Hop, hop! Vamos a saltar hasta la bandera.",
    ar: "هوب، هوب! هيّا نقفز حتى العَلَم.",
    ru: "Прыг-скок! Давай допрыгаем до флажка.",
  },
  end: {
    en: "We made it! The flag goes up.",
    de: "Geschafft! Die Fahne geht hoch.",
    zh: "到啦！旗子升起来了。",
    hi: "झंडा आ गया! झंडा ऊपर जा रहा है।",
    es: "¡Lo logramos! La bandera sube.",
    ar: "وصلنا! العَلَم يرتفع.",
    ru: "Получилось! Флажок поднимается.",
  },
};
