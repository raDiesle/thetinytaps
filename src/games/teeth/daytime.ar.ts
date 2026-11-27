import type { Daytime } from "@/lib/days";
import type { DaytimeTexts } from "./daytime";

/** The morning and evening texts in Arabic; a text missing here is said in German (see daytimeText). */
export const DAYTIME_AR: Record<Daytime, Partial<DaytimeTexts>> = {
  morning: {
    hello: "صباح الخير!",
    after: "الآن يمكن أن يبدأ اليوم!",
  },
  evening: {
    hello: "اقترب وقت النوم.",
    after: "الآن إلى السرير. ليلة سعيدة!",
  },
};
