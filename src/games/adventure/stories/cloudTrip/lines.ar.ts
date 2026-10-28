import type { StoryTranslation } from "../story";

// What Tapsi says in „Die Wolkenreise“ in Modern Standard Arabic: the lines of lines.ts, step by step.
// Tapsi mostly says "let's" (هيّا ن…) and "your turn" (دورك), because commands to the child
// would differ for a boy and a girl ("حذارِ" instead of "انتبه"). The little cloud Wolle is قطنة (a bit of cotton).

/** „Die Wolkenreise“ in Arabic. */
export const TRANSLATION: StoryTranslation = {
  title: "رحلة الغيمة",
  defaultTurn: "دورك الآن!",
  opening: ["أوه! أين الشمس؟", "إنها مختبئة خلف سحابة المطر الكبيرة.", "هيّا نُخرجها! هل نذهب معًا؟"],
  steps: [
    // 👋
    {
      name: "التلويح لكيكي",
      situation: "مرحبًا! أنا تابسي. وهذه قطنة، غيمتي الصغيرة!",
      instruction: "ها هو كيكي قادم! نلوّح بأيدينا – هكذا!",
      turn: "هيّا نلوّح لكيكي معًا!",
      again: "مرحبًا، كيكي!",
      praise: "كيكي يطير معنا!",
    },
    // 🐦
    {
      name: "الرفرفة مثل العصفور",
      situation: "قطنة تريد أن تطير. هيّا نساعدها!",
      instruction: "نرفرف بذراعينا مثل العصفور – هكذا!",
      turn: "دورك الآن – هيّا نرفرف!",
      again: "نرفرف، نرفرف – إلى الأعلى!",
      praise: "نطير عاليًا جدًّا!",
    },
    // ✈️
    {
      name: "الانحناء تحت الطائرات",
      situation: "أوه، طائرات صغيرة قادمة!",
      instruction: "عندما تأتي طائرة، ننحني – هكذا!",
      turn: "حذارِ! هيّا ننحني!",
      again: "وننحني مرة أخرى!",
      praise: "مرّت كل الطائرات.",
    },
    // 🎈
    {
      name: "لمس البالونات",
      situation: "بالونات كثيرة!",
      instruction: "نلمسها – بوب! هكذا!",
      turn: "دورك الآن – هيّا نلمسها!",
      again: "بوب! وبوب!",
      praise: "قصاصات ملوّنة كثيرة!",
    },
    // 🪑
    { name: "الجلوس", instruction: "الآن نسرع! هيّا نجلس معًا – هكذا!", praise: "نتمسّك جيدًا!" },
    // ⭐
    {
      name: "الميل في المنعطفات لالتقاط النجوم",
      situation: "هنا نجوم كثيرة معلّقة!",
      instruction: "نميل إلى الجانب ونأخذ النجمة – هكذا!",
      turn: "دورك الآن – هيّا نميل إلى الجانب!",
      again: "وإلى الجانب الآخر!",
      praise: "أخذنا كل النجوم!",
    },
    // 🧍
    { name: "الوقوف", instruction: "ها هي سحابة المطر! هيّا نقف معًا – هكذا!", praise: "الآن نُخرج الشمس!" },
    // 🌧️
    {
      name: "دفع غيمة المطر إلى الأعلى",
      situation: "هنا تمطر! والشمس هناك في الأعلى.",
      instruction: "ندفع السحابة إلى الأعلى بذراعينا – هكذا!",
      turn: "دورك الآن – هيّا ندفع معًا!",
      again: "إلى الأعلى، إلى الأعلى – الشمس قادمة!",
      praise: "ها هي الشمس!",
    },
    // 🌈
    {
      name: "رسم قوس قزح",
      situation: "الآن ينقصنا قوس قزح فقط.",
      instruction: "نرسم بذراعنا قوسًا كبيرًا – هكذا!",
      turn: "دورك الآن – هيّا نرسم معًا!",
      again: "لون آخر!",
      praise: "قوس قزح!",
    },
    // 🙌
    {
      name: "مرحى!",
      situation: "الشمس تبتسم!",
      instruction: "الأيدي إلى الأعلى – مرحى!",
      turn: "هيّا معًا – مرحى!",
      praise: "عادت الشمس!",
    },
    // 🏡
    {
      name: "التلويح للوداع",
      situation: "قطنة تأخذنا إلى البيت.",
      instruction: "نلوّح مودّعين – هكذا!",
      turn: "هيّا نلوّح معًا!",
      again: "مع السلامة يا شمس! مع السلامة يا كيكي!",
      praise: "شكرًا على الرحلة معنا! إلى اللقاء قريبًا!",
    },
  ],
};
