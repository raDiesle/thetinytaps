import type { Daytime, DaytimeTexts } from "./daytime";

/** The morning and evening texts in Russian. */
export const DAYTIME_RU: Record<Daytime, DaytimeTexts> = {
  morning: {
    hello: "Доброе утро!",
    monsters: "Ой-ой, сахарные монстры после завтрака! Давай прогоним их щёткой!",
    doneTitle: "☀️ Чисто-чисто!",
    after: "Теперь можно начинать день!",
  },
  evening: {
    hello: "Скоро спать.",
    monsters: "Ой-ой, сахарные монстры после ужина! Давай прогоним их щёткой!",
    doneTitle: "🌙 Спокойной ночи!",
    after: "А теперь в кроватку. Спокойной ночи!",
  },
};
