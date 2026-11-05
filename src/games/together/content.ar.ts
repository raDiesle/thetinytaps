import type { TogetherTranslation } from "./pairs";

// Arabic (Modern Standard, without vowel marks) sentences for "Was gehört zusammen?", by the ids of the pairs in
// pairs.tsx: things "يناسب" each other (تناسب for a feminine partner), helpers "يحتاج إلى" their tools (تحتاج for
// the doctor and the hairdresser, who are women as in German).

/** Arabic, for the table of languages in pairs.tsx. */
export const ARABIC: TogetherTranslation = {
  zahnbuerste: {
    name: "فرشاة أسنان",
    partner: "معجون أسنان",
    question: "ماذا يناسب فرشاة الأسنان؟",
    right: "معجون الأسنان يناسب فرشاة الأسنان. رائع!",
    belongs: "معجون الأسنان يناسب فرشاة الأسنان!",
  },
  tuer: {
    name: "باب",
    partner: "مفتاح",
    question: "ماذا يناسب الباب؟",
    right: "المفتاح يناسب الباب. رائع!",
    belongs: "المفتاح يناسب الباب!",
  },
  topf: {
    name: "قدر",
    partner: "غطاء",
    question: "ماذا يناسب القدر؟",
    right: "الغطاء يناسب القدر. رائع!",
    belongs: "الغطاء يناسب القدر!",
  },
  blume: {
    name: "زهرة",
    partner: "مرشة",
    question: "ماذا يناسب الزهرة؟",
    right: "المرشة تناسب الزهرة. رائع!",
    belongs: "المرشة تناسب الزهرة!",
  },
  papier: {
    name: "ورقة",
    partner: "قلم تلوين",
    question: "ماذا يناسب الورقة؟",
    right: "قلم التلوين يناسب الورقة. رائع!",
    belongs: "قلم التلوين يناسب الورقة!",
  },
  feuerwehr: {
    name: "رجل إطفاء",
    partner: "خرطوم",
    question: "إلى ماذا يحتاج رجل الإطفاء؟",
    right: "رجل الإطفاء يحتاج إلى الخرطوم. رائع!",
    belongs: "رجل الإطفاء يحتاج إلى الخرطوم!",
  },
  aerztin: {
    name: "طبيبة",
    partner: "سماعة طبية",
    question: "إلى ماذا تحتاج الطبيبة؟",
    right: "الطبيبة تحتاج إلى السماعة الطبية. رائع!",
    belongs: "الطبيبة تحتاج إلى السماعة الطبية!",
  },
  baecker: {
    name: "خباز",
    partner: "رغيف",
    question: "إلى ماذا يحتاج الخباز؟",
    right: "الخباز يحتاج إلى الرغيف. رائع!",
    belongs: "الخباز يحتاج إلى الرغيف!",
  },
  friseurin: {
    name: "مصففة شعر",
    partner: "مقص",
    question: "إلى ماذا تحتاج مصففة الشعر؟",
    right: "مصففة الشعر تحتاج إلى المقص. رائع!",
    belongs: "مصففة الشعر تحتاج إلى المقص!",
  },
  post: {
    name: "ساعي بريد",
    partner: "طرد",
    question: "إلى ماذا يحتاج ساعي البريد؟",
    right: "ساعي البريد يحتاج إلى الطرد. رائع!",
    belongs: "ساعي البريد يحتاج إلى الطرد!",
  },
};
