import type { StepId, StepTexts } from "./steps";

// The brushing steps in Arabic: the same pictures, said in Modern Standard Arabic with "let's" (هيّا نفتح الفم) instead of commands, which would differ for a boy and a girl; أضراس are the back teeth, وحوش السكر the sugar monsters.

/** Title, hint and spoken cue of the steps in Arabic, by step id; a text missing here is said in German (see stepText). */
export const STEP_TEXTS_AR: Partial<Record<StepId, Partial<StepTexts>>> = {
  "lower-top": {
    title: "⬇️ الأضراس السفلية",
    hint: "أسطح المضغ السفلية: ذهابًا وإيابًا",
    cue: "هيّا نفتح الفم واسعًا! على الأضراس السفلية. نفرك ذهابًا وإيابًا!",
  },
  "upper-top": {
    title: "⬆️ الأضراس العلوية",
    hint: "أسطح المضغ العلوية: ذهابًا وإيابًا",
    cue: "والآن على الأضراس العلوية. ذهابًا وإيابًا!",
  },
  "outer-left": {
    title: "⬅️ من الخارج على الجانب",
    hint: "الأسطح الخارجية: دوائر صغيرة",
    cue: "هيّا نُطبق الأسنان! من الخارج على الجانب. دوائر صغيرة!",
  },
  "outer-front": {
    title: "😁 من الخارج في الأمام",
    hint: "الأسطح الخارجية: دوائر صغيرة",
    cue: "الآن في الأمام. دوائر، دوائر، دوائر!",
  },
  "outer-right": {
    title: "➡️ من الخارج على الجانب الآخر",
    hint: "الأسطح الخارجية: دوائر صغيرة",
    cue: "والجانب الآخر. دوائر جميلة!",
  },
  "inner-lower": {
    title: "👅 من الداخل في الأسفل",
    hint: "الأسطح الداخلية: من الأحمر إلى الأبيض",
    cue: "هيّا نفتح الفم واسعًا! الآن من الداخل في الأسفل، حيث اللسان.",
  },
  "inner-upper": {
    title: "👅 من الداخل في الأعلى",
    hint: "الأسطح الداخلية: من الأحمر إلى الأبيض",
    cue: "ومن الداخل في الأعلى. اقتربنا من النهاية!",
  },
};
