import type { Daytime } from "@/lib/days";
import type { DaytimeTexts } from "./daytime";

/** The morning and evening texts in Chinese; a text missing here is said in German (see daytimeText). */
export const DAYTIME_ZH: Record<Daytime, Partial<DaytimeTexts>> = {
  morning: {
    hello: "早上好！",
    after: "新的一天开始啦！",
  },
  evening: {
    hello: "快到睡觉时间了。",
    after: "现在上床睡觉吧。晚安！",
  },
};
