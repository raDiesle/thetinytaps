import type { SceneTranslation } from "../types";

// The Arabic words of the Weltall picture (Modern Standard Arabic, simple, no vowel marks): names with the
// article ال and their gender, what each item says and the chain sentences. Saturn is „زحل“, a name that takes
// no article in Arabic. „Wünsch dir was!“ becomes „هيّا نتمنى أمنية!“, so it fits a girl and a boy alike.

/** „Weltall“ in Arabic. */
export const AR: SceneTranslation = {
  title: "الفضاء",
  description: "صاروخ وصحن طائر وكواكب على القمر.",
  items: {
    erde: { name: "الأرض", gender: "f", sentences: ["مرحبا أيتها الأرض! هنا نعيش.", "الأرض تدور.", "الأرض زرقاء وخضراء."] },
    mars: { name: "المريخ", gender: "m", sentences: ["المريخ أحمر.", "المريخ يدور. قمره الصغير يطير معه."] },
    saturn: { name: "زحل", gender: "m", sentences: ["لزحل حلقة.", "الحلقة تدور وتدور.", "زحل يغمز."] },
    sterne: { name: "النجوم", gender: "f", plural: true, sentences: ["النجوم تلمع.", "تلألئي يا نجمة صغيرة!"] },
    stern: { name: "النجمة", gender: "f", sentences: ["النجمة تضيء بقوة.", "النجمة تدور وتغمز."] },
    sternschnuppe: { name: "الشهاب", gender: "m", sentences: ["ووش! الشهاب يمر بسرعة.", "هيّا نتمنى أمنية!"] },
    komet: { name: "المذنب", gender: "m", sentences: ["للمذنب ذيل طويل.", "ووش! المذنب يطير في الفضاء."] },
    asteroid: { name: "الكويكب", gender: "m", sentences: ["الكويكب يتشقلب في الفضاء.", "بوم، طاخ!"] },
    satellit: { name: "القمر الصناعي", gender: "m", sentences: ["بيب، بيب! القمر الصناعي يرسل رسائل.", "القمر الصناعي يفتح جناحيه."] },
    raumstation: { name: "المحطة الفضائية", gender: "f", sentences: ["في المحطة الفضائية يعيش رواد فضاء.", "النوافذ تضيء. مرحبا!"] },
    astronaut: { name: "رائد الفضاء", gender: "m", sentences: ["رائد الفضاء يطفو في الفضاء.", "رائد الفضاء يلوح لك!"] },
    ufo: {
      name: "الصحن الطائر",
      gender: "m",
      sentences: ["ويو، ويو! الصحن الطائر يضيء.", "في الصحن الطائر كائن فضائي صغير.", "الصحن الطائر يطفو."],
    },
    flagge: { name: "العلم", gender: "m", sentences: ["العلم يرفرف.", "على العلم نجمة."] },
    solarzellen: { name: "الألواح الشمسية", gender: "f", plural: true, sentences: ["الألواح الشمسية تلتقط ضوء الشمس.", "هكذا تصنع الكهرباء."] },
    antenne: { name: "الهوائي", gender: "m", sentences: ["الهوائي يرسل التحية إلى الأرض.", "بينغ! الهوائي يدور."] },
    landefaehre: { name: "مركبة الهبوط", gender: "f", sentences: ["مركبة الهبوط هبطت على القمر.", "الباب يفتح. من يطل من هناك؟"] },
    mondbasis: {
      name: "محطة القمر",
      gender: "f",
      sentences: ["دينغ، دونغ! في محطة القمر يعيش رواد فضاء.", "الباب يفتح وأحد يلوح.", "النوافذ تضيء."],
    },
    rakete: {
      name: "الصاروخ",
      gender: "m",
      sentences: ["ثلاثة، اثنان، واحد، انطلق! الصاروخ يطير.", "الصاروخ يطير عاليا جدا ثم يهبط من جديد.", "الصاروخ أحمر وأبيض."],
    },
    weltraumblume: { name: "الزهرة الفضائية", gender: "f", sentences: ["الزهرة الفضائية تدير بتلاتها.", "الزهرة تضحك وتلمع!"] },
    gewaechshaus: { name: "البيت الزجاجي", gender: "m", sentences: ["في البيت الزجاجي تنمو الطماطم.", "طق، طق! النباتات تشرب الماء."] },
    ausserirdischer: {
      name: "الكائن الفضائي",
      gender: "m",
      sentences: ["بليب، بلوب! الكائن الفضائي يقول: مرحبا!", "الكائن الفضائي يقفز ويلوح.", "له قرنا استشعار."],
    },
    mondbagger: { name: "حفارة القمر", gender: "f", sentences: ["برر! حفارة القمر تحفر غبار القمر.", "حفارة القمر صفراء."] },
    alienbaby: { name: "الطفل الفضائي", gender: "m", sentences: ["الطفل الفضائي يضحك.", "خش، خش! الطفل الفضائي يلعب بالخشخيشة."] },
    buggy: { name: "سيارة القمر", gender: "f", sentences: ["سيارة القمر تسير على القمر.", "هوب، هوب! بيب، بيب!"] },
    mondhase: {
      name: "أرنب القمر",
      gender: "m",
      sentences: ["هوب! أرنب القمر يقفز عاليا جدا.", "على القمر نستطيع أن نقفز عاليا.", "مع أرنب القمر جزرة."],
    },
    krater: { name: "الحفرة", gender: "f", sentences: ["هذه حفرة في القمر.", "هوب، هوب! الحجارة تقفز."] },
    roboterhund: { name: "الكلب الآلي", gender: "m", sentences: ["هو، بيب! الكلب الآلي ينبح.", "الكلب الآلي يهز ذيله."] },
    kristall: { name: "البلورة", gender: "f", sentences: ["البلورة تلمع باللون الأزرق.", "البلورة تضيء."] },
    helm: { name: "الخوذة", gender: "f", sentences: ["ها هو! خلف الخوذة يسكن كائن فضائي صغير.", "الخوذة تتمايل."] },
    mondball: { name: "الكرة", gender: "f", sentences: ["بوينغ، بوينغ! الكرة تقفز.", "على القمر تقفز الكرة عاليا جدا."] },
    kiste: { name: "الصندوق", gender: "m", sentences: ["الصندوق يفتح. ماذا في الداخل؟", "نجمة تقفز منه!"] },
    maus: { name: "الفأرة", gender: "f", sentences: ["زيق! الفأرة تقضم جبن القمر.", "القمر مصنوع من الجبن، تقول الفأرة."] },
    astronautin: { name: "رائدة الفضاء", gender: "f", sentences: ["رائدة الفضاء تقفز على القمر.", "رائدة الفضاء تلوح. مرحبا!"] },
    fernrohr: { name: "المنظار", gender: "m", sentences: ["بالمنظار نرى النجوم.", "المنظار ينظر إلى فوق."] },
    roboter: { name: "الروبوت", gender: "m", sentences: ["بيب، بوب، بيب! الروبوت يتكلم.", "الروبوت يرفع ذراعيه.", "الروبوت أزرق."] },
  },
  chains: [
    ["الكائن الفضائي يلوح للصحن الطائر!", "والطفل الفضائي يضحك ويقفز."],
    ["في المنظار نرى زحل!", "وهناك يطير مذنب."],
    ["أرنب القمر يخاف ويقفز عاليا جدا!", "الفأرة تطل من الجبن."],
  ],
};
