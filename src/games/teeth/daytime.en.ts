import type { Daytime } from "@/lib/days";
import type { DaytimeTexts } from "./daytime";

/** The morning and evening texts in English; a text missing here is said in German (see daytimeText). */
export const DAYTIME_EN: Record<Daytime, Partial<DaytimeTexts>> = {
  morning: {
    hello: "Good morning!",
    after: "Now the day can begin!",
  },
  evening: {
    hello: "It's almost bedtime.",
    after: "Now off to bed. Good night!",
  },
};
