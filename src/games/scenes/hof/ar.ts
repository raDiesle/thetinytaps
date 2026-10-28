import type { SceneTranslation } from "../types";

// The Arabic words of the Hof-am-Teich picture (Modern Standard Arabic, simple, no vowel marks): names with the
// article ال and their gender, what each item says and the chain sentences. The dog Bello is „بوبي“.

/** „Hof am Teich“ in Arabic. */
export const AR: SceneTranslation = {
  title: "البركة في المزرعة",
  description: "البطة والضفدع والخنازير الصغيرة عند البركة في المزرعة.",
  items: {
    sonne: { name: "الشمس", gender: "f", sentences: ["الشمس تشرق!", "الشمس تبتسم."] },
    wolke: { name: "الغيمة", gender: "f", sentences: ["الغيمة تمطر. طق، طق!", "المطر مفيد للنباتات."] },
    windmuehle: { name: "الطاحونة", gender: "f", sentences: ["الريح تدير الطاحونة.", "في الطاحونة يصنعون الطحين."] },
    vogelscheuche: { name: "الفزاعة", gender: "f", sentences: ["الفزاعة تتمايل. هش، هش أيتها الغربان!", "الفزاعة تحرس الحقل."] },
    bauernhaus: { name: "البيت", gender: "m", sentences: ["في البيت تعيش عائلة المزارع.", "المزارعة تلوح من النافذة. مرحبا!"] },
    scheune: { name: "الحظيرة", gender: "f", sentences: ["أبواب الحظيرة تفتح.", "في الحظيرة تبن.", "سنونو يطير منها!"] },
    storch: { name: "اللقلق", gender: "m", sentences: ["طق، طق! اللقلق يطقطق بمنقاره.", "اللقلق يعيش فوق في العش."] },
    apfelbaum: { name: "شجرة التفاح", gender: "f", sentences: ["على شجرة التفاح ينمو تفاح أحمر.", "بوم! تفاحة تسقط."] },
    schaf: { name: "الخروف", gender: "m", sentences: ["ماااء! الخروف يقفز.", "للخروف صوف ناعم."] },
    lamm: { name: "الحمل", gender: "m", sentences: ["ماااء! الحمل الصغير ينادي أمه.", "الحمل ما زال صغيرا جدا."] },
    huehnerstall: { name: "قن الدجاج", gender: "m", sentences: ["في قن الدجاج تنام الدجاجات.", "الباب يفتح. بيضة تتدحرج منه!"] },
    hahn: { name: "الديك", gender: "m", sentences: ["كوكوكوكو! الديك يصيح.", "الديك يوقظ الجميع."] },
    kuh: { name: "البقرة", gender: "f", sentences: ["موو! البقرة تعطي الحليب.", "البقرة تأكل العشب.", "تن، تن، يقول الجرس."] },
    ziege: { name: "العنزة", gender: "f", sentences: ["ماااء! العنزة تنطح برأسها.", "للعنزة لحية."] },
    pferd: { name: "الحصان", gender: "m", sentences: ["هيييي! الحصان يقف على رجليه الخلفيتين.", "للحصان عرف طويل.", "الحصان يركض بسرعة كبيرة."] },
    hund: { name: "الكلب", gender: "m", sentences: ["هو، هو! اسم الكلب بوبي.", "الكلب يحرس المزرعة."] },
    huhn: { name: "الدجاجة", gender: "f", sentences: ["كاك، كاك! الدجاجة تنقر الحبوب.", "الدجاجة تبيض."] },
    gans: { name: "الإوزة", gender: "f", sentences: ["كاك، كاك! الإوزة تمد رقبتها الطويلة.", "للإوزة شريطة زرقاء."] },
    kueken: { name: "الكتاكيت", gender: "f", plural: true, sentences: ["صوصو! الكتاكيت تقفز.", "الكتاكيت صغيرة وصفراء."] },
    bauer: { name: "المزارع", gender: "m", sentences: ["المزارع يصفر أغنية.", "في عربة اليد خضار.", "مرحبا! المزارع يلوح بقبعته."] },
    traktor: { name: "الجرار", gender: "m", sentences: ["تك، تك، تك! الجرار ينطلق.", "الجرار أحمر.", "للجرار عجلات كبيرة."] },
    heuballen: { name: "بالة التبن", gender: "f", sentences: ["التبن طعام الحيوانات.", "بالة التبن مستديرة."] },
    katze: { name: "القطة", gender: "f", sentences: ["مياو! القطة استيقظت.", "القطة تحب النوم في التبن."] },
    kuerbis: { name: "اليقطينة", gender: "f", sentences: ["اليقطينة كبيرة وبرتقالية.", "اليقطينة تنمو في الحديقة."] },
    schwein: { name: "الخنزير", gender: "m", sentences: ["أوينك، أوينك! الخنزير يلعب في الطين.", "الطين يفرح الخنزير.", "للخنزير ذيل ملفوف."] },
    ente: { name: "البطة", gender: "f", sentences: ["الرأس في الماء، والذيل إلى فوق!", "كواك، كواك! البطة تسبح في البركة."] },
    frosch: { name: "الضفدع", gender: "m", sentences: ["نق! الضفدع يقفز عاليا.", "الضفدع يجلس على ورقة زنبق الماء."] },
    bienenkorb: { name: "خلية النحل", gender: "f", sentences: ["في خلية النحل يعيش النحل.", "ززز! النحل يخرج منها."] },
    biene: { name: "النحلة", gender: "f", sentences: ["ززز! النحلة تطير.", "النحلة تصنع العسل."] },
    blumen: { name: "الأزهار", gender: "f", plural: true, sentences: ["الأزهار تتفتح في المرج.", "أحمر، أزرق، أصفر وأبيض."] },
    schmetterling: { name: "الفراشة", gender: "f", sentences: ["الفراشة صفراء مثل الليمونة.", "الفراشة ترفرف من زهرة إلى زهرة."] },
    ferkel: { name: "الخنازير الصغيرة", gender: "f", plural: true, sentences: ["الخنازير الصغيرة أولاد الخنزير.", "أوينك! الخنازير الصغيرة تقفز."] },
    hase: { name: "الأرنب", gender: "m", sentences: ["هوب، هوب! الأرنب يقفز.", "الأرنب يقضم جزرة."] },
    schnecke: { name: "الحلزون", gender: "m", sentences: ["الحلزون يزحف ببطء شديد.", "الحلزون يحمل بيته على ظهره."] },
    maus: { name: "الفأرة", gender: "f", sentences: ["زيق! الفأرة وجدت سنبلة.", "مرحبا أيتها الفأرة الصغيرة!"] },
  },
  chains: [
    ["الدجاجة تقول: صباح الخير!", "والكتاكيت تصوصو معها!"],
    ["القطة تستيقظ: مياو!", "والفأرة تصرخ: النجدة، القطة!"],
    ["البطة تغطس رأسها في الماء.", "واللقلق يطقطق: أين الضفدع؟"],
  ],
};
