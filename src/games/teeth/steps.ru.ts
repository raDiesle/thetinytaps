import type { StepId, StepTexts } from "./steps";

// The brushing steps in Russian: the same pictures, said the way a Russian
// kindergarten would say it to a two-year-old ("зубки", "язычок", "кружочки").
// "От красного к белому" is how Russian dentists teach the inside too.

/** Title, hint and spoken cue of the steps in Russian, by step id; a text missing here is said in German (see stepText). */
export const STEP_TEXTS_RU: Partial<Record<StepId, Partial<StepTexts>>> = {
  "lower-top": {
    title: "⬇️ Нижние зубки",
    hint: "Жевательные снизу: туда-сюда",
    cue: "Открой ротик широко! Чистим нижние зубки сверху. Туда-сюда, туда-сюда!",
  },
  "upper-top": {
    title: "⬆️ Верхние зубки",
    hint: "Жевательные сверху: туда-сюда",
    cue: "А теперь верхние зубки. Туда-сюда!",
  },
  "outer-left": {
    title: "⬅️ Сбоку снаружи",
    hint: "Наружные: маленькие кружочки",
    cue: "Сожми зубки! Теперь сбоку снаружи. Маленькие кружочки!",
  },
  "outer-front": {
    title: "😁 Спереди",
    hint: "Наружные: маленькие кружочки",
    cue: "Теперь спереди. Кружочки, кружочки, кружочки!",
  },
  "outer-right": {
    title: "➡️ Сбоку снаружи",
    hint: "Наружные: маленькие кружочки",
    cue: "И другой бочок. Кружочки, кружочки!",
  },
  "inner-lower": {
    title: "👅 Внутри внизу",
    hint: "Внутренние: от красного к белому",
    cue: "Открой ротик широко! Теперь внутри внизу, там, где язычок.",
  },
  "inner-upper": {
    title: "👅 Внутри вверху",
    hint: "Внутренние: от красного к белому",
    cue: "И внутри вверху. Почти готово!",
  },
};
