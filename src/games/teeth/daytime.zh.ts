import type { Daytime, DaytimeTexts } from "./daytime";

/** The morning and evening texts in Chinese; a text missing here is said in German (see daytimeText). */
export const DAYTIME_ZH: Record<Daytime, Partial<DaytimeTexts>> = {
  morning: {
    hello: "早上好！",
    grow: "一夜之间，糖就长成了糖怪兽。",
    doneTitle: "☀️ 亮晶晶！",
    after: "新的一天开始啦！",
  },
  evening: {
    hello: "快到睡觉时间了。",
    grow: "一整天里，糖慢慢长成了糖怪兽。",
    doneTitle: "🌙 晚安！",
    after: "现在上床睡觉吧。晚安！",
  },
};
