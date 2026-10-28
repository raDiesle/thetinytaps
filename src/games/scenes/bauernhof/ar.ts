import type { SceneTranslation } from "../types";

// The Arabic words of the Bauernhof picture (Modern Standard Arabic, simple, no vowel marks): names with the
// article ال and their gender, what each item says and the chain sentences.

/** „Bauernhof“ in Arabic. */
export const AR: SceneTranslation = {
  title: "المزرعة",
  description: "البقرة والجرار والخنزير في المزرعة.",
  items: {
    sonne: { name: "الشمس", gender: "f", sentences: ["الشمس تشرق!", "الشمس تبتسم."] },
    wolke: { name: "الغيمة", gender: "f", sentences: ["الغيمة تمطر. طق، طق!", "المطر مفيد للأزهار."] },
    schwalbe: { name: "السنونو", gender: "m", sentences: ["السنونو يطير بسرعة كبيرة!", "سيو، سيو! السنونو يندفع في الهواء."] },
    windmuehle: { name: "الطاحونة", gender: "f", sentences: ["الطاحونة تدور في الريح.", "في الطاحونة يصنعون الطحين."] },
    maehdrescher: { name: "الحصادة", gender: "f", sentences: ["الحصادة تحصد القمح.", "برر! الحبوب تخرج من فوق."] },
    bauernhaus: {
      name: "البيت",
      gender: "m",
      sentences: ["في البيت تعيش عائلة المزارع.", "مرحبا! المزارعة تلوح من النافذة.", "الباب يفتح. من هناك؟", "النور يضيء!"],
    },
    storch: { name: "اللقلق", gender: "m", sentences: ["طق، طق! اللقلق يطقطق بمنقاره.", "اللقلق يعيش فوق في العش."] },
    katze: { name: "القطة", gender: "f", sentences: ["مياو! القطة تجلس أمام الباب.", "القطة تنظف نفسها."] },
    scheune: { name: "الحظيرة", gender: "f", sentences: ["البوابات تفتح. في الحظيرة تبن!", "الحظيرة كبيرة وحمراء."] },
    eule: { name: "البومة", gender: "f", sentences: ["هوو، هوو! البومة تعيش في الحظيرة.", "للبومة عيون كبيرة."] },
    baum: { name: "شجرة التفاح", gender: "f", sentences: ["بوم! التفاح يسقط على العشب.", "على شجرة التفاح ينمو تفاح أحمر."] },
    hahn: { name: "الديك", gender: "m", sentences: ["كوكوكوكو! الديك يصيح.", "الديك يجلس على السياج."] },
    pferd: { name: "الحصان", gender: "m", sentences: ["هيّا! الحصان يقف على رجليه الخلفيتين.", "الحصان يصهل: هيييي!", "الحصان بني."] },
    heuballen: { name: "بالة التبن", gender: "f", sentences: ["بالة التبن تتدحرج!", "التبن طعام الأبقار."] },
    vogelscheuche: { name: "الفزاعة", gender: "f", sentences: ["الفزاعة تتمايل. هش، هش أيتها الطيور!", "للفزاعة قبعة."] },
    schaf: { name: "الخروف", gender: "m", sentences: ["ماااء! الخروف يقفز.", "للخروف صوف ناعم."] },
    kuh: { name: "البقرة", gender: "f", sentences: ["موو! البقرة تعطي الحليب.", "البقرة تأكل العشب.", "تن، تن! الجرس يرن."] },
    ziege: { name: "العنزة", gender: "f", sentences: ["ماااء! العنزة تقف على رجليها الخلفيتين.", "للعنزة لحية."] },
    bauer: { name: "المزارع", gender: "m", sentences: ["مرحبا! المزارع يلوح.", "مع المزارع مذراة."] },
    schubkarre: { name: "عربة اليد", gender: "f", sentences: ["في عربة اليد يقطين.", "أوبس، اليقطين يقفز!"] },
    gans: { name: "الإوزة", gender: "f", sentences: ["كاك، كاك! الإوزة منزعجة.", "الإوزة بيضاء."] },
    traktor: { name: "الجرار", gender: "m", sentences: ["الجرار ينطلق!", "تك، تك، تك! الجرار أحمر.", "للجرار عجلات كبيرة."] },
    hund: { name: "الكلب", gender: "m", sentences: ["هو، هو! الكلب يحرس المزرعة.", "الكلب يقفز عاليا."] },
    pumpe: { name: "المضخة", gender: "f", sentences: ["نضخ، نضخ! ها هو الماء.", "الماء يتدفق في الدلو."] },
    huhn: { name: "الدجاجة", gender: "f", sentences: ["كاك، كاك! الدجاجة تنقر الحبوب.", "الدجاجة باضت بيضة!"] },
    ente: { name: "البطة", gender: "f", sentences: ["كواك، كواك! البطة تسبح في البركة.", "البطة تغطس رأسها في الماء."] },
    hase: { name: "الأرنب", gender: "m", sentences: ["هوب، هوب! الأرنب يقفز.", "الأرنب يحب الجزر."] },
    schwein: { name: "الخنزير", gender: "m", sentences: ["أوينك، أوينك! الخنزير يتمرغ في الطين.", "الخنزير وردي."] },
    frosch: { name: "الضفدع", gender: "m", sentences: ["نق! الضفدع يقفز عاليا.", "الضفدع يجلس على ورقة زنبق الماء."] },
    kueken: { name: "الكتكوت", gender: "m", sentences: ["صوصو! الكتكوت خرج من البيضة.", "الكتكوت صغير وأصفر."] },
    ferkel: { name: "الخنزير الصغير", gender: "m", sentences: ["الخنزير الصغير هو ابن الخنزير.", "أوينك! الخنزير الصغير يقفز."] },
    biene: { name: "النحلة", gender: "f", sentences: ["ززز! النحلة تطير إلى الزهرة.", "النحلة تصنع العسل."] },
    schnecke: { name: "الحلزون", gender: "m", sentences: ["الحلزون يزحف ببطء شديد.", "الحلزون يحمل بيته على ظهره."] },
  },
  chains: [
    ["الإوزة تخاف: كاك، كاك!", "والعنزة تقفز عاليا!"],
    ["صباح الخير! المزارعة تستيقظ.", "والبقرة تقول: موو!"],
    ["الخنزير الصغير يقفز في الطين أيضا!", "يع، الدجاجة تبتل كلها!"],
  ],
};
