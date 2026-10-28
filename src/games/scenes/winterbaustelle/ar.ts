import type { SceneTranslation } from "../types";

// The Arabic words of the Winter-Baustelle picture (Modern Standard Arabic, simple, no vowel marks): names with
// the article ال and their gender, what each item says and the chain sentences. The names of the machines are the
// Baustelle picture's, since the drawings are the same. The robin is „أبو الحناء“, as in the Winter picture.

/** „Winter-Baustelle“ in Arabic. */
export const AR: SceneTranslation = {
  title: "ورشة البناء في الشتاء",
  description: "كاسحة الثلج ورجل الثلج والزلاجة في ورشة البناء تحت الثلج.",
  items: {
    sonne: { name: "الشمس", gender: "f", sentences: ["شمس الشتاء تشرق!", "الشمس تبتسم، لكن الجو بارد."] },
    schneewolke: {
      name: "غيمة الثلج",
      gender: "f",
      sentences: ["الغيمة تنزل الثلج!", "ندف الثلج تسقط بهدوء شديد.", "الغيمة بيضاء وناعمة."],
    },
    heli: { name: "المروحية", gender: "f", sentences: ["المروحية تطير فوق الثلج.", "طرطر، طرطر، المروحية."] },
    hase: { name: "الأرنب", gender: "m", sentences: ["أوه، أرنب في الشجيرة المغطاة بالثلج!", "هوب، هوب، الأرنب يقفز."] },
    klo: {
      name: "المرحاض",
      gender: "m",
      sentences: ["طق، طق! المرحاض مشغول.", "على المرحاض ثلج.", "الباب يفتح. من في الداخل؟"],
    },
    bauwagen: {
      name: "الكرفان",
      gender: "m",
      sentences: ["في الكرفان دفء جميل.", "ممم، في الكرفان كاكاو ساخن!", "على الكرفان تضيء سلسلة أضواء."],
    },
    schneetanne: {
      name: "الصنوبرة",
      gender: "f",
      sentences: ["الصنوبرة تهتز. الثلج يسقط إلى تحت!", "الصنوبرة خضراء في الشتاء أيضا.", "بوم! ثلج كثير جدا."],
    },
    eichhoernchen: { name: "السنجاب", gender: "m", sentences: ["السنجاب يجلس في الصنوبرة.", "السنجاب يقضم جوزة من مخزونه."] },
    container: { name: "الحاوية", gender: "f", sentences: ["الحاوية مليئة بالثلج.", "بوم! الثلج ينزلق إلى تحت."] },
    gabelstapler: { name: "الرافعة الشوكية", gender: "f", sentences: ["الرافعة الشوكية ترفع الصناديق.", "إلى فوق وإلى تحت، حتى في الثلج!"] },
    iglu: { name: "بيت الثلج", gender: "m", sentences: ["بيت الثلج مبني من الثلج.", "من يسكن في بيت الثلج؟ مرحبا!", "في بيت الثلج يضيء النور."] },
    haus: { name: "البيت", gender: "m", sentences: ["هنا يبنون بيتا، حتى في الشتاء!", "على البيت ثلج.", "قريبا يسكن هنا أحد."] },
    eiszapfen: {
      name: "قطع الجليد",
      gender: "f",
      plural: true,
      sentences: ["على النافذة تتدلى قطع الجليد.", "قطع الجليد تلمع. طق، طق!", "قطع الجليد باردة وملساء."],
    },
    katze: { name: "القطة", gender: "f", sentences: ["مياو! أقدام القطة باردة.", "القطة تجلس على الجدار في الثلج."] },
    kran: { name: "الرافعة", gender: "f", sentences: ["الرافعة ترفع الحجارة!", "على الرافعة ثلج.", "إلى فوق، إلى فوق مع الرافعة!"] },
    weihnachtsbaum: {
      name: "شجرة العيد",
      gender: "f",
      sentences: ["فوق الرافعة شجرة العيد!", "أضواء الشجرة تومض.", "النجمة تلمع."],
    },
    radio: { name: "الراديو", gender: "m", sentences: ["الراديو يغني أغنية شتاء. لا، لا، لا!", "مع الموسيقى نشعر بالدفء."] },
    bagger: {
      name: "الحفارة",
      gender: "f",
      sentences: ["الحفارة تجرف الثلج!", "برر، برر! الحفارة تصنع جبلا من الثلج.", "الحفارة صفراء."],
    },
    karre: { name: "عربة اليد", gender: "f", sentences: ["عربة اليد تتدحرج!", "في عربة اليد ثلج."] },
    schild: { name: "اللافتة", gender: "f", sentences: ["انتباه، ورشة بناء!", "انتباه، الأرض ملساء!"] },
    teearbeiter: {
      name: "عامل البناء",
      gender: "m",
      sentences: ["عامل البناء يشرب شايا ساخنا. فوو، فوو!", "يلبس قبعة دافئة.", "عند النار تدفأ اليدان."],
    },
    feuertonne: {
      name: "برميل النار",
      gender: "m",
      sentences: ["في البرميل تشتعل نار.", "طقطق، طقطق! النار دافئة.", "لا نلمسه، إنه ساخن!"],
    },
    vogelhaus: { name: "بيت العصافير", gender: "m", sentences: ["في بيت العصافير حبوب للعصافير.", "كرة الحبوب تتأرجح."] },
    meise: { name: "القرقف", gender: "m", sentences: ["صوصو! القرقف ينقر الحبوب.", "للقرقف رأس أزرق وبطن أصفر."] },
    schneeschaufel: { name: "مجرفة الثلج", gender: "f", sentences: ["بالمجرفة نجرف الثلج.", "هيلا هوب! الثلج يطير إلى فوق."] },
    laterne: { name: "الفانوس", gender: "m", sentences: ["الفانوس يضيء. في الشتاء يأتي الظلام مبكرا.", "للفانوس قبعة من الثلج."] },
    streuwagen: {
      name: "شاحنة الملح",
      gender: "f",
      sentences: ["شاحنة الملح ترش الملح على الشارع.", "الآن الشارع لم يعد أملس.", "القرص يدور بسرعة."],
    },
    kipper: { name: "الشاحنة القلابة", gender: "f", sentences: ["الشاحنة القلابة تأخذ الثلج بعيدا!", "انتباه، الشاحنة القلابة تفرغ الثلج!"] },
    schneepflug: {
      name: "كاسحة الثلج",
      gender: "f",
      sentences: ["كاسحة الثلج تدفع الثلج بعيدا!", "برر! كاسحة الثلج تفتح الشارع.", "كاسحة الثلج برتقالية."],
    },
    winterfuchs: {
      name: "الثعلب",
      gender: "m",
      sentences: ["هوب! الثعلب يقفز في الثلج.", "الثعلب يسمع فأرة تحت الثلج.", "للثعلب ذيل كثيف."],
    },
    schlitten: { name: "الزلاجة", gender: "f", sentences: ["مرحى! الطفل يركب الزلاجة.", "الزلاجة تنطلق في الثلج.", "رن، رن، يقول الجرس."] },
    rotkehlchen: { name: "أبو الحناء", gender: "m", sentences: ["أبو الحناء يقفز في الثلج.", "تيريلي! أبو الحناء يغني."] },
    schneemann: { name: "رجل الثلج", gender: "m", sentences: ["مرحبا يا رجل الثلج!", "أنف رجل الثلج من الجزر.", "رجل الثلج يرفع قبعته."] },
    schneeballkinder: {
      name: "الأطفال",
      gender: "m",
      plural: true,
      sentences: ["الأطفال يلعبون بكرات الثلج!", "طش! لم تصب!", "الأطفال يضحكون."],
    },
    hund: { name: "الكلب", gender: "m", sentences: ["هو، هو! الكلب يلعب في الثلج.", "الكلب يهز ذيله."] },
    fussspuren: { name: "آثار الأقدام", gender: "f", plural: true, sentences: ["هنا آثار في الثلج. من كان هنا؟", "قرش، قرش! آثار في الثلج."] },
    huetchen: { name: "المخروط", gender: "m", sentences: ["المخروط يقفز!", "للمخروط قبعة من الثلج."] },
    maus: { name: "الفأرة", gender: "f", sentences: ["زيق! الفأرة تسكن في الأنبوب.", "في الأنبوب دفء، تقول الفأرة."] },
  },
  chains: [
    ["الآن تأتي شاحنة الملح وترش الملح.", "والشاحنة القلابة تأخذ الثلج بعيدا."],
    ["من كان هنا؟ الثعلب! هوب، يقفز في الثلج.", "الفأرة تختبئ بسرعة في الأنبوب."],
    ["أبو الحناء يخاف ويقفز بعيدا.", "بوم! المخروط يتمايل."],
  ],
};
