import type { StepId, StepTexts } from "./steps";

// The brushing steps in Chinese: the same pictures, said the way a kindergarten says it: 大牙 (back teeth), 画小圈 (small circles), 糖怪兽 (sugar monsters).

/** Title, hint and spoken cue of the steps in Chinese, by step id; a text missing here is said in German (see stepText). */
export const STEP_TEXTS_ZH: Partial<Record<StepId, Partial<StepTexts>>> = {
  "lower-top": {
    title: "⬇️ 下面的大牙",
    hint: "下牙咬合面：前后刷",
    cue: "嘴巴张大！刷下面的大牙。前后刷，前后刷！",
  },
  "upper-top": {
    title: "⬆️ 上面的大牙",
    hint: "上牙咬合面：前后刷",
    cue: "现在刷上面的大牙。前后刷！",
  },
  "outer-left": {
    title: "⬅️ 侧面外边",
    hint: "外侧面：画小圈",
    cue: "牙齿咬起来！刷侧面外边。画小圈圈！",
  },
  "outer-front": {
    title: "😁 前面外边",
    hint: "外侧面：画小圈",
    cue: "现在刷前面。画圈，画圈，画圈！",
  },
  "outer-right": {
    title: "➡️ 侧面外边",
    hint: "外侧面：画小圈",
    cue: "再刷另一边。好好画圈！",
  },
  "inner-lower": {
    title: "👅 下面里边",
    hint: "内侧面：从红刷到白",
    cue: "嘴巴张大！现在刷下面里边，舌头在的地方。",
  },
  "inner-upper": {
    title: "👅 上面里边",
    hint: "内侧面：从红刷到白",
    cue: "再刷上面里边。快好啦！",
  },
};
