import type { Daytime, DaytimeTexts } from "./daytime";

/** The morning and evening texts in Arabic; a text missing here is said in German (see daytimeText). */
export const DAYTIME_AR: Record<Daytime, Partial<DaytimeTexts>> = {
  morning: {
    hello: "صباح الخير!",
    grow: "في الليل ينمو من السكر وحوش السكر.",
    doneTitle: "☀️ نظيفة لامعة!",
    after: "الآن يمكن أن يبدأ اليوم!",
  },
  evening: {
    hello: "اقترب وقت النوم.",
    grow: "طوال اليوم ينمو من السكر وحوش السكر.",
    doneTitle: "🌙 ليلة سعيدة!",
    after: "الآن إلى السرير. ليلة سعيدة!",
  },
};
