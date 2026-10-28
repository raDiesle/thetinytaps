import type { SceneTranslation } from "../types";

// The Arabic words of the Supermarkt picture (Modern Standard Arabic, simple, no vowel marks): names with the
// article ال and their gender, what each item says and the chain sentences. Fruit, vegetables, pasta and sweets
// are collective nouns, singular in Arabic (الموز، الجزر، المعكرونة، الحلوى).

/** „Supermarkt“ in Arabic. */
export const AR: SceneTranslation = {
  title: "السوبرماركت",
  description: "صندوق الدفع يصفر، وعربة التسوق تتدحرج، ونزن الفواكه.",
  items: {
    schiebetuer: { name: "الباب المنزلق", gender: "m", sentences: ["ووش! الباب المنزلق يفتح.", "الجدة تدخل وتلوح."] },
    hund: { name: "الكلب", gender: "m", sentences: ["هو، هو! الكلب ينتظر في الخارج.", "الكلب يهز ذيله."] },
    brezel: { name: "الكعكة", gender: "f", sentences: ["الكعكة الكبيرة تتأرجح هنا وهناك.", "هنا المخبز!"] },
    baeckerin: { name: "الخبازة", gender: "f", sentences: ["رن! الخبازة تضغط الجرس.", "الخبازة تلوح: مرحبا، من يريد خبزا؟"] },
    brottheke: { name: "رف الخبز", gender: "m", sentences: ["شم، شم! رائحة الخبز لذيذة.", "الخبز ما زال دافئا جدا."] },
    kaese: { name: "الجبن", gender: "m", sentences: ["في الجبن ثقوب كثيرة.", "أوه! فأرة صغيرة تطل منه."] },
    fisch: { name: "السمكة", gender: "f", sentences: ["بلب، بلب! السمكة تسبح في الحوض.", "السمكة تصنع فقاعات."] },
    krabbe: { name: "السلطعون", gender: "m", sentences: ["قرص، قرص! السلطعون يقرص.", "السلطعون يمشي دائما جانبيا."] },
    lautsprecher: { name: "مكبر الصوت", gender: "m", sentences: ["دينغ، دانغ، دونغ! إعلان.", "اليوم يوجد فراولة!"] },
    kuehlregal: { name: "الثلاجة", gender: "f", sentences: ["الأبواب تفتح. برر، كم هي باردة!", "في الثلاجة لبن وزبدة."] },
    milch: { name: "الحليب", gender: "m", sentences: ["موو! الحليب يأتي من البقرة.", "علب الحليب تقفز."] },
    pfandautomat: { name: "آلة الزجاجات", gender: "f", sentences: ["الزجاجة تتدحرج في الآلة.", "طق، طق! وتخرج ورقة."] },
    luftballons: { name: "البالونات", gender: "f", plural: true, sentences: ["البالونات الملونة ترقص.", "أحمر، أصفر، أزرق وأخضر!"] },
    muesli: { name: "رقائق الفطور", gender: "f", plural: true, sentences: ["خش، خش! علبة الرقائق تهتز.", "الرقائق تطير منها."] },
    nudeln: { name: "المعكرونة", gender: "f", sentences: ["المعكرونة تقفز. هوب، هوب!", "سباغيتي طويلة ولوالب صغيرة."] },
    saft: { name: "العصير", gender: "m", sentences: ["العصير يتموج في الزجاجة.", "عصير برتقال وعصير تفاح. لذيذ!"] },
    bonbons: { name: "الحلوى", gender: "f", sentences: ["الغطاء يفتح. حلوى!", "حلوى حمراء وصفراء وزرقاء تقفز."] },
    blumen: { name: "الأزهار", gender: "f", plural: true, sentences: ["الأزهار تتمايل هنا وهناك.", "ززز! نحلة تزور الأزهار."] },
    tafel: { name: "اللوح", gender: "m", sentences: ["على اللوح رسم فراولة.", "اللوح يتمايل. تخفيضات اليوم!"] },
    einkaufskorb: { name: "سلة التسوق", gender: "f", sentences: ["هوب! سلة التسوق تقفز.", "السلال حمراء."] },
    verkaeufer: { name: "البائع", gender: "m", sentences: ["البائع يقف على السلم.", "يرتب الرف ويصفر أغنية."] },
    wischmaschine: { name: "آلة التنظيف", gender: "f", sentences: ["برر، برر! آلة التنظيف تنظف الأرض.", "الفرشاة تدور وتصنع رغوة."] },
    dosenturm: { name: "برج العلب", gender: "m", sentences: ["برج العلب يتمايل. انتباه!", "طنغ! العلبة العليا تقفز."] },
    eistruhe: { name: "ثلاجة المثلجات", gender: "f", sentences: ["ثلاجة المثلجات تفتح. برر!", "يا سلام، مثلجات بثلاث كرات!"] },
    kleinerwagen: { name: "العربة الصغيرة", gender: "f", sentences: ["بيب، بيب! البنت تدفع العربة الصغيرة.", "العلم يرفرف في الريح."] },
    bananen: { name: "الموز", gender: "m", sentences: ["الموز يتأرجح.", "الموز أصفر ومعوج."] },
    karotten: { name: "الجزر", gender: "m", sentences: ["بوب، بوب! الجزر يقفز.", "الجزر برتقالي."] },
    tomaten: { name: "الطماطم", gender: "f", sentences: ["الطماطم تقفز.", "حبة طماطم تتدحرج بعيدا ثم ترجع."] },
    aepfel: { name: "التفاح", gender: "m", sentences: ["التفاح يقفز. هوب!", "من يطل من التفاحة؟ دودة صغيرة!"] },
    wassermelone: { name: "البطيخة", gender: "f", sentences: ["البطيخة مستديرة وثقيلة.", "في الداخل هي حمراء ومليئة بالعصير."] },
    waage: { name: "الميزان", gender: "m", sentences: ["بينغ! الميزان يزن الموزة.", "تخرج ورقة عليها السعر."] },
    einkaufswagen: { name: "عربة التسوق", gender: "f", sentences: ["عربة التسوق تتدحرج. طق، طق!", "العربة مليئة جدا."] },
    kind: { name: "الطفل", gender: "m", sentences: ["الطفل يركب في عربة التسوق.", "مرحى! الطفل يلوح بذراعيه."] },
    kaugummiautomat: { name: "آلة العلكة", gender: "f", sentences: ["المقبض يدور. طق، طق!", "كرة علكة تتدحرج منها."] },
    einkaufstuete: { name: "كيس التسوق", gender: "m", sentences: ["كيس التسوق ممتلئ جدا.", "هوب! تفاحة تقفز منه."] },
    warnschild: { name: "لافتة التحذير", gender: "f", sentences: ["انتباه، الأرض مبللة!", "طش! حذار من الانزلاق."] },
    kassiererin: { name: "أمينة الصندوق", gender: "f", sentences: ["أمينة الصندوق تقول: مرحبا!", "أمينة الصندوق تلوح وتضحك."] },
    laufband: { name: "الحزام المتحرك", gender: "m", sentences: ["الحزام المتحرك ينقل الأغراض إلى الصندوق.", "ززز! كل شيء يتحرك معه."] },
    kasse: { name: "صندوق الدفع", gender: "m", sentences: ["بيب، بيب! صندوق الدفع يصفر.", "الدرج يفتح. هنا النقود!"] },
    eierkarton: { name: "علبة البيض", gender: "f", sentences: ["علبة البيض تفتح.", "صوصو! كتكوت يطل منها."] },
  },
  chains: [
    ["الحزام المتحرك ينطلق!", "ومن علبة البيض يصوصو كتكوت."],
    ["انتباه، الآن الأرض مبللة!", "وبرج العلب يتمايل!"],
    ["الكلب ينبح: هو، هو!", "ومكبر الصوت يقول: أهلا وسهلا!"],
  ],
};
