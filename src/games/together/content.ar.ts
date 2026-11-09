import type { TogetherTranslation } from "./pairs";

// Arabic (Modern Standard, without vowel marks) sentences for "Was gehört zusammen?", by the ids of the pairs in
// pairs.tsx: things "يناسب" each other (تناسب for a feminine partner), helpers "يحتاج إلى" their tools (تحتاج for
// the doctor and the hairdresser, who are women as in German).

/** Arabic, for the table of languages in pairs.tsx. */
export const ARABIC: TogetherTranslation = {
  zahnbuerste: {
    name: "فرشاة أسنان",
    partner: "معجون أسنان",
    question: "هيّا نغسل أسناننا.",
    right: "معجون الأسنان يناسب فرشاة الأسنان. رائع!",
    belongs: "معجون الأسنان يناسب فرشاة الأسنان!",
    caption: "هيّا نغسل أسناننا. ماذا نضع على الفرشاة لذلك؟",
  },
  tuer: {
    name: "باب",
    partner: "مفتاح",
    question: "الباب مغلق. نريد أن ندخل.",
    right: "المفتاح يناسب الباب. رائع!",
    belongs: "المفتاح يناسب الباب!",
    caption: "الباب مغلق. نريد أن ندخل. بماذا يُفتح؟",
  },
  topf: {
    name: "قدر",
    partner: "غطاء",
    question: "القدر مفتوح. نريد أن نغلقه.",
    right: "الغطاء يناسب القدر. رائع!",
    belongs: "الغطاء يناسب القدر!",
    caption: "القدر مفتوح. نريد أن نغلقه. ماذا يناسب فوقه؟",
  },
  blume: {
    name: "زهرة",
    partner: "مرشة",
    question: "الزهرة عطشانة.",
    right: "المرشة تناسب الزهرة. رائع!",
    belongs: "المرشة تناسب الزهرة!",
    caption: "الزهرة عطشانة. بماذا تحصل على الماء؟",
  },
  papier: {
    name: "ورقة",
    partner: "قلم تلوين",
    question: "نريد أن نرسم صورة.",
    right: "قلم التلوين يناسب الورقة. رائع!",
    belongs: "قلم التلوين يناسب الورقة!",
    caption: "نريد أن نرسم صورة. بماذا تتلون الورقة؟",
  },
  feuerwehr: {
    name: "رجل إطفاء",
    partner: "خرطوم",
    question: "رجل الإطفاء يريد أن يطفئ النيران.",
    right: "رجل الإطفاء يحتاج إلى الخرطوم. رائع!",
    belongs: "رجل الإطفاء يحتاج إلى الخرطوم!",
    caption: "رجل الإطفاء يريد أن يطفئ النيران. بماذا يرش الماء؟",
  },
  aerztin: {
    name: "طبيبة",
    partner: "سماعة طبية",
    question: "الطبيبة تريد أن تسمع قلبك.",
    right: "الطبيبة تحتاج إلى السماعة الطبية. رائع!",
    belongs: "الطبيبة تحتاج إلى السماعة الطبية!",
    caption: "الطبيبة تريد أن تسمع قلبك. بماذا تصغي إليه؟",
  },
  baecker: {
    name: "خباز",
    partner: "رغيف",
    question: "الخباز يريد أن يخبز شيئًا لذيذًا للفطور.",
    right: "الخباز يحتاج إلى الرغيف. رائع!",
    belongs: "الخباز يحتاج إلى الرغيف!",
    caption: "الخباز يريد أن يخبز شيئًا لذيذًا للفطور. ماذا يضع بعد ذلك على الطاولة؟",
  },
  friseurin: {
    name: "مصففة شعر",
    partner: "مقص",
    question: "مصففة الشعر تريد أن تقص الشعر.",
    right: "مصففة الشعر تحتاج إلى المقص. رائع!",
    belongs: "مصففة الشعر تحتاج إلى المقص!",
    caption: "مصففة الشعر تريد أن تقص الشعر. بماذا يتم ذلك؟",
  },
};
