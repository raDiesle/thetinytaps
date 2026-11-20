import type { StoryTranslation } from "../story";

// What Tapsi says in „Fire Rescue“ in Modern Standard Arabic: the English lines of lines.ts, step by step (translated
// on request, 19 November 2026). Tapsi mostly says "let's" (هيّا ن…) and "your turn" (دورك), because commands to the
// child would differ for a boy and a girl ("حذارِ" instead of "انتبه"). Robo, the hover robot, is روبو.

/** „Fire Rescue“ in Arabic. */
export const TRANSLATION: StoryTranslation = {
  title: "مهمة الإطفاء",
  defaultTurn: "دورك الآن!",
  opening: ["أوه! هناك دخان!", "وعلى السطح قطط صغيرة.", "سنساعد! هل نذهب معًا؟"],
  steps: [
    // 👋
    {
      name: "التلويح لكيكي",
      situation: "مرحبًا! أنا تابسي. وهذا روبو، روبوتي الطائر!",
      instruction: "ها هو كيكي قادم! نلوّح بأيدينا – هكذا!",
      turn: "هيّا نلوّح لكيكي معًا!",
      again: "مرحبًا، كيكي!",
      praise: "كيكي يأتي معنا!",
    },
    // 🔔
    {
      name: "قرع جرس الإطفاء",
      situation: "البوابة مغلقة. هيّا نقرع جرس الإطفاء!",
      instruction: "نمدّ أيدينا إلى الأعلى ونسحب إلى الأسفل – هكذا!",
      turn: "دورك الآن – هيّا نسحب!",
      again: "دينغ دونغ! البوابة ترتفع!",
      praise: "البوابة مفتوحة. هيّا ننطلق!",
    },
    // 👕
    {
      name: "الانحناء تحت حبال الغسيل",
      situation: "روبو يطير في الشارع. ها هي حبال الغسيل!",
      instruction: "عندما يأتي حبل، ننحني – هكذا!",
      turn: "حذارِ! هيّا ننحني!",
      again: "وننحني مرة أخرى!",
      praise: "مررنا بسلام!",
    },
    // 💧
    {
      name: "ضخّ الماء",
      situation: "روبو يحتاج إلى ماء للخرطوم. ها هي نافورة!",
      instruction: "نمسك المقبض ونضغطه إلى الأسفل – هكذا!",
      turn: "دورك الآن – هيّا نضخّ!",
      again: "بُق، بُق! الماء يدخل!",
      praise: "خزّانات روبو ممتلئة!",
    },
    // 💦
    {
      name: "رشّ الدخان بالماء",
      situation: "ها هو البيت الذي فيه الدخان!",
      instruction: "نمسك الخرطوم ونرشّ – إلى اليسار، وإلى اليمين! هكذا!",
      turn: "دورك الآن – هيّا نرشّ الماء!",
      again: "بشششش! الدخان يختفي!",
      praise: "اختفى كل الدخان!",
    },
    // 🐱
    {
      name: "التقاط القطط الصغيرة",
      situation: "القطط الصغيرة على السطح. روبو يطير إلى الأعلى!",
      instruction: "نفتح ذراعينا ونلتقط – هكذا!",
      turn: "ها هي قطّة تقفز – هيّا نلتقطها!",
      again: "وواحدة أخرى!",
      praise: "كل القطط الصغيرة بأمان!",
    },
    // 🎉
    {
      name: "مرحى!",
      situation: "نجحنا!",
      instruction: "الأيدي إلى الأعلى – مرحى!",
      turn: "هيّا معًا – مرحى!",
      praise: "مرحى لفريق الإطفاء!",
    },
    // 👋
    {
      name: "التلويح للوداع",
      situation: "روبو يأخذ القطط الصغيرة إلى البيت.",
      instruction: "نلوّح مودّعين – هكذا!",
      turn: "هيّا نلوّح معًا!",
      again: "مع السلامة أيتها القطط! مع السلامة يا كيكي!",
      praise: "شكرًا على المساعدة! إلى اللقاء قريبًا!",
    },
  ],
};
