import type { Daytime, DaytimeTexts } from "./daytime";

/** The morning and evening texts in Russian; a text missing here is said in German (see daytimeText). */
export const DAYTIME_RU: Record<Daytime, Partial<DaytimeTexts>> = {
  morning: {
    hello: "Доброе утро!",
    grow: "За ночь из него вырастают сахарные монстры.",
    doneTitle: "☀️ Чисто-чисто!",
    after: "Теперь можно начинать день!",
  },
  evening: {
    hello: "Скоро спать.",
    grow: "За день из него вырастают сахарные монстры.",
    doneTitle: "🌙 Спокойной ночи!",
    after: "А теперь в кроватку. Спокойной ночи!",
  },
};
