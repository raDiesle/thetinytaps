import type { SceneTranslation } from "../types";

// The Arabic words of the Herbst picture (Modern Standard Arabic, simple, no vowel marks): names with the
// article ال and their gender, what each item says and the chain sentences.

/** „Herbst“ in Arabic. */
export const AR: SceneTranslation = {
  title: "الخريف",
  description: "أوراق ملونة ويقطين وطائرة ورقية في الريح.",
  items: {
    sonne: { name: "الشمس", gender: "f", sentences: ["شمس الخريف تشرق!", "الشمس تبتسم.", "الشمس ما زالت تدفئ قليلا."] },
    wolke: { name: "الغيمة", gender: "f", sentences: ["الغيمة تمطر. طق، طق!", "في الخريف تمطر كثيرا."] },
    herbstwind: { name: "الريح", gender: "f", sentences: ["الريح تنفخ: ووووو!", "الريح تطير الأوراق بعيدا.", "وووش! اليوم فيه ريح."] },
    wildgaense: { name: "الإوز البري", gender: "f", plural: true, sentences: ["الإوز البري يطير إلى الجنوب.", "كاك، كاك! مع السلامة يا إوز!"] },
    herbstdrachen: {
      name: "الطائرة الورقية",
      gender: "f",
      sentences: ["الطائرة الورقية تطير عاليا جدا!", "الطائرة الورقية ترقص في الريح.", "للطائرة الورقية وجه يضحك."],
    },
    pflugtraktor: { name: "الجرار", gender: "m", sentences: ["الجرار يحرث الحقل.", "تك، تك، تك، يقول الجرار."] },
    kraehe: { name: "الغراب", gender: "m", sentences: ["قاق، قاق! الغراب ينادي.", "الغراب يجلس على العمود."] },
    schuppen: { name: "السقيفة", gender: "f", sentences: ["في السقيفة تسكن المدمة والمكنسة.", "صرير! الباب يفتح. من في الداخل؟"] },
    spinnennetz: { name: "بيت العنكبوت", gender: "m", sentences: ["في بيت العنكبوت تلمع قطرات الندى.", "العنكبوت ينزل على الخيط."] },
    baeuerin: { name: "المزارعة", gender: "f", sentences: ["مرحبا! من يريد يقطينة؟", "المزارعة تبيع اليقطين."] },
    kuerbisstand: { name: "كشك اليقطين", gender: "m", sentences: ["في كشك اليقطين يقطين كثير.", "يقطين أصفر وأخضر وبرتقالي!", "ماذا في الصندوق؟"] },
    apfelkorb: { name: "سلة التفاح", gender: "f", sentences: ["السلة مليئة بالتفاح.", "تفاح أحمر وأخضر وأصفر. ممم!"] },
    ahorn: {
      name: "شجرة القيقب",
      gender: "f",
      sentences: ["لشجرة القيقب أوراق حمراء.", "البذور تطير مثل مروحيات صغيرة!", "خش، خش! الأوراق تسقط."],
    },
    drachenjunge: { name: "الولد", gender: "m", sentences: ["الولد يطير الطائرة الورقية.", "يا هوو! الولد يمسك الخيط جيدا."] },
    laubopa: { name: "الجد", gender: "m", sentences: ["الجد يجمع الأوراق.", "خرش، خرش، تقول المدمة.", "الجد يقول: مرحبا!"] },
    laubhaufen: {
      name: "كومة الأوراق",
      gender: "f",
      sentences: ["واو! الأوراق تطير عاليا.", "في كومة الأوراق نستطيع أن نختبئ.", "خش، خش! من في الأوراق؟"],
    },
    strickoma: { name: "الجدة", gender: "f", sentences: ["الجدة تحيك وشاحا.", "تك، تك، تقول الإبر.", "الوشاح يصبح طويلا ودافئا."] },
    bankkatze: { name: "القطة", gender: "f", sentences: ["مياو! القطة تلعب بالصوف.", "القطة تجلس على المقعد."] },
    kastanienbaum: { name: "شجرة الكستناء", gender: "f", sentences: ["بوم! الكستناء تسقط.", "الأوراق صفراء وبنية.", "شجرة الكستناء كبيرة."] },
    herbsthoernchen: { name: "السنجاب", gender: "m", sentences: ["السنجاب يجمع الجوز للشتاء.", "قرط، قرط! جوزة لذيذة."] },
    laubigel: { name: "القنفذ", gender: "m", sentences: ["القنفذ يحمل تفاحة على ظهره.", "سنف، سنف! القنفذ يبحث عن سرير من الأوراق."] },
    kuerbiswagen: { name: "العربة", gender: "f", sentences: ["في العربة يقطين.", "طق، طق، العربة تتدحرج."] },
    laubhund: { name: "الكلب", gender: "m", sentences: ["هو، هو! الكلب يريد أن يمسك الورقة.", "الكلب يقفز عاليا!"] },
    kastanie: { name: "حبة الكستناء", gender: "f", sentences: ["حبة الكستناء بنية ولامعة.", "القشرة شائكة. آي!"] },
    steinpilze: { name: "الفطر", gender: "m", sentences: ["بوب، بوب! الفطر ينمو.", "للفطر قبعات بنية."] },
    kastanienmann: { name: "رجل الكستناء", gender: "m", sentences: ["رجل الكستناء يرقص!", "هو مصنوع من الكستناء."] },
    herbstwindrad: { name: "المروحة الورقية", gender: "f", sentences: ["المروحة الورقية تدور في الريح.", "أحمر، أصفر، أزرق وأخضر. ززز!"] },
    amsel: { name: "الشحرور", gender: "m", sentences: ["الشحرور يأكل التوت الأحمر.", "الشحرور يغني أغنية."] },
    riesenkuerbis: {
      name: "اليقطينة",
      gender: "f",
      sentences: ["اليقطينة تقفز! خش، خش!", "اليقطينة سمينة ومستديرة.", "خلف اليقطينة تعيش فأرة."],
    },
    martinslaterne: {
      name: "الفانوس",
      gender: "m",
      sentences: ["يا فانوس، يا فانوس، شمس وقمر ونجوم!", "الفانوس يضيء بقوة.", "الطفل يغني أغنية الفانوس."],
    },
    matschpfuetze: { name: "البركة", gender: "f", sentences: ["طش! البركة ترش.", "ورقة تطفو مثل قارب."] },
    pfuetzenkind: {
      name: "البنت",
      gender: "f",
      sentences: ["هوب! البنت تقفز في البركة.", "مع البنت مظلة.", "بالجزمات المطاطية نستطيع أن نقفز في البرك!"],
    },
    apfelwurm: { name: "الدودة", gender: "f", sentences: ["مرحبا أيتها الدودة الصغيرة!", "الدودة تعيش في التفاحة. هم، هم!"] },
    herbststiefel: {
      name: "الجزمات المطاطية",
      gender: "f",
      plural: true,
      sentences: ["الجزمات المطاطية تقفز!", "جزمات حمراء بنقاط بيضاء.", "من يختبئ في الجزمة؟"],
    },
    regenschnecke: { name: "الحلزون", gender: "m", sentences: ["الحلزون يحب المطر.", "الحلزون يزحف ببطء شديد."] },
  },
  chains: [
    ["الريح ترفع الطائرة الورقية عاليا جدا!", "والمروحة الورقية تدور.", "الأوراق تطير من الشجرة."],
    ["مطر! البنت تقفز في البركة.", "الحلزون يخرج.", "بعد المطر ينمو الفطر."],
    ["بوم! حبة كستناء تسقط.", "السنجاب رآها!"],
  ],
};
