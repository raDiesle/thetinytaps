import type { SceneTranslation } from "../types";

// The Arabic words of the Unterwasser picture (Modern Standard Arabic, simple, no vowel marks): names with the
// article ال and their gender, what each item says and the chain sentences.

/** „Unterwasser“ in Arabic. */
export const AR: SceneTranslation = {
  title: "تحت الماء",
  description: "الحوت والأخطبوط وصندوق الكنز في البحر.",
  items: {
    leuchtturm: { name: "المنارة", gender: "f", sentences: ["المنارة تضيء بقوة.", "هكذا تجد السفن طريقها."] },
    wolke: { name: "الغيمة", gender: "f", sentences: ["الغيمة تمطر. طق، طق!", "المطر يسقط في البحر."] },
    moewe: { name: "النورس", gender: "m", sentences: ["كيا، كيا! النورس يطير فوق البحر.", "النورس يبحث عن سمكة."] },
    sonne: { name: "الشمس", gender: "f", sentences: ["الشمس تشرق!", "الشمس تدفئ الماء."] },
    anker: { name: "المرساة", gender: "f", sentences: ["طق، طق! المرساة ترتفع.", "بوم! المرساة تسقط في الرمل."] },
    boot: { name: "القارب", gender: "m", sentences: ["توت، توت! القارب يتأرجح على الأمواج.", "القبطان يلوح من القارب."] },
    wal: { name: "الحوت", gender: "m", sentences: ["فففف! الحوت يرش نافورة.", "الحوت يغني: ووووو!", "الحوت كبير جدا."] },
    delfin: { name: "الدلفين", gender: "m", sentences: ["واو! الدلفين يقفز من الماء.", "كي كي كي! الدلفين يضحك."] },
    rochen: { name: "سمكة الراي", gender: "f", sentences: ["سمكة الراي تطير في الماء.", "سمكة الراي تحرك زعانفها."] },
    fische: { name: "الأسماك", gender: "f", plural: true, sentences: ["الأسماك تسبح في دائرة.", "أسماك صغيرة كثيرة تسبح معا."] },
    qualle: { name: "قنديل البحر", gender: "m", sentences: ["قنديل البحر يطفو إلى فوق.", "رجرج، رجرج! قنديل البحر وردي."] },
    schiff: {
      name: "السفينة القديمة",
      gender: "f",
      sentences: ["دينغ، دونغ! جرس السفينة القديمة يرن.", "في السفينة القديمة تعيش سمكة.", "السفينة القديمة في قاع البحر."],
    },
    uboot: { name: "الغواصة", gender: "f", sentences: ["بينغ! الغواصة تغوص في البحر.", "الغواصة صفراء.", "القبطان ينظر من النافذة."] },
    seepferdchen: { name: "فرس البحر", gender: "m", sentences: ["هوب، هوب! فرس البحر يقفز في الماء.", "فرس البحر أصفر."] },
    schildkroete: { name: "السلحفاة", gender: "f", sentences: ["السلحفاة تجدف بزعانفها.", "السلحفاة تسبح ببطء شديد."] },
    meerjungfrau: { name: "حورية البحر", gender: "f", sentences: ["حورية البحر تغني أغنية. لا، لا، لا!", "حورية البحر تلوح لك."] },
    taucher: { name: "الغواص", gender: "m", sentences: ["بلب، بلب! الغواص يصنع فقاعات.", "الغواص يلوح."] },
    schnecke: { name: "الحلزون", gender: "m", sentences: ["الحلزون يختبئ في بيته.", "ها هو! الحلزون من جديد."] },
    koralle: { name: "المرجان", gender: "m", sentences: ["المرجان يلمع.", "المرجان ملون."] },
    clownfisch: { name: "سمكة المهرج", gender: "f", sentences: ["أوه! سمكة المهرج تختبئ.", "سمكة المهرج تعيش في شقائق النعمان البحرية."] },
    krake: { name: "الأخطبوط", gender: "m", sentences: ["الأخطبوط يلوح بأذرعه الثماني.", "مرحبا! الأخطبوط أحمر."] },
    hai: { name: "القرش", gender: "m", sentences: ["القرش يسبح دورة.", "القرش يبتسم. هو لطيف جدا."] },
    hummer: { name: "جراد البحر", gender: "m", sentences: ["طق، طق! جراد البحر يرفع مقصاته.", "جراد البحر أحمر."] },
    krabbe: { name: "السلطعون", gender: "m", sentences: ["السلطعون يمشي جانبيا.", "طق، طق! السلطعون يطقطق."] },
    schatztruhe: { name: "صندوق الكنز", gender: "m", sentences: ["صندوق الكنز يفتح. في الداخل ذهب!", "أوه، كم يلمع!"] },
    seestern: { name: "نجمة البحر", gender: "f", sentences: ["نجمة البحر ترقص في دائرة.", "لنجمة البحر خمس أذرع."] },
    flaschenpost: { name: "رسالة الزجاجة", gender: "f", sentences: ["بوب! رسالة الزجاجة تفتح.", "في الزجاجة رسالة."] },
    seegras: { name: "عشب البحر", gender: "m", sentences: ["عشب البحر يتمايل هنا وهناك.", "يا سلام! في عشب البحر تعيش سمكة صغيرة."] },
    flunder: { name: "سمكة موسى", gender: "f", sentences: ["أوه! سمكة موسى كانت مختبئة في الرمل.", "سمكة موسى مسطحة جدا."] },
    kugelfisch: { name: "السمكة المنتفخة", gender: "f", sentences: ["فففف! السمكة المنتفخة تنتفخ كثيرا.", "السمكة المنتفخة صفراء."] },
    blauerfisch: { name: "السمكة الزرقاء", gender: "f", sentences: ["السمكة الزرقاء تسبح هنا وهناك.", "بلب! السمكة الزرقاء تصنع فقاعات."] },
    luftblasen: { name: "الفقاعات", gender: "f", plural: true, sentences: ["بلب، بلب! الفقاعات تصعد إلى فوق.", "بوب! الفقاعات تنفجر."] },
    gruenerfisch: { name: "السمكة الخضراء", gender: "f", sentences: ["السمكة الخضراء تحرك زعنفتها.", "بلب! السمكة الخضراء تصنع فقاعات."] },
    seeigel: { name: "قنفذ البحر", gender: "m", sentences: ["قنفذ البحر يحرك أشواكه.", "هوب! قنفذ البحر بنفسجي."] },
    muschel: { name: "الصدفة", gender: "f", sentences: ["الصدفة تفتح. فيها لؤلؤة!", "اللؤلؤة تلمع."] },
  },
  chains: [
    ["الدلفين يقفز عبر النافورة!", "والقارب يتأرجح على الأمواج."],
    ["الغواص يجد صندوق كنز!", "السلطعون يرقص حول الكنز."],
    ["الأخطبوط يلوح للقرش.", "وسمكة المهرج تختبئ بسرعة!"],
  ],
};
