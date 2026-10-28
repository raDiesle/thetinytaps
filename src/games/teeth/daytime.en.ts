import type { Daytime, DaytimeTexts } from "./daytime";

/** The morning and evening texts in English; a text missing here is said in German (see daytimeText). */
export const DAYTIME_EN: Record<Daytime, Partial<DaytimeTexts>> = {
  morning: {
    hello: "Good morning!",
    grow: "Overnight the sugar grows into sugar monsters.",
    doneTitle: "☀️ Sparkling clean!",
    after: "Now the day can begin!",
  },
  evening: {
    hello: "It's almost bedtime.",
    grow: "All day long the sugar grows into sugar monsters.",
    doneTitle: "🌙 Good night!",
    after: "Now off to bed. Good night!",
  },
};
