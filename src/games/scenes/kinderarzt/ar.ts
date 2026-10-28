import type { SceneTranslation } from "../types";

// The Arabic words of the Kinderarzt picture (Modern Standard Arabic, simple, no vowel marks): names with the
// article ال and their gender, what each item says and the chain sentences. Lines that speak to the child in German
// („Stell dich drauf!“) use „let's“ (هيّا نقف) or speak about everyone, since Arabic imperatives are gendered.

/** „Kinderarzt“ in Arabic. */
export const AR: SceneTranslation = {
  title: "عند الطبيب",
  description: "الميزان والسماعة وفي النهاية ملصق.",
  items: {
    mobile: { name: "الدوارة", gender: "f", sentences: ["الدوارة تدور. بلينغ، بلينغ!", "الغيمة والنجمة والقمر تتأرجح."] },
    fenster: { name: "النافذة", gender: "f", sentences: ["النافذة تفتح. هواء نقي!", "صوصو! عصفور ينظر إلى الداخل."] },
    hampelmann: { name: "الدمية الراقصة", gender: "f", sentences: ["هيّا نشد الخيط! الدمية الراقصة ترقص.", "الأيدي إلى فوق، الأرجل إلى فوق!"] },
    uhr: { name: "الساعة", gender: "f", sentences: ["تك، تك! الساعة تدق.", "العقارب تدور وتدور."] },
    tuer: { name: "الباب", gender: "m", sentences: ["طق، طق! من هناك؟", "الباب يفتح. أهلا وسهلا!"] },
    sehtafel: { name: "لوحة النظر", gender: "f", sentences: ["ماذا نرى؟ شمس، بيت، سيارة!", "الصور تصبح أصغر وأصغر."] },
    messlatte: { name: "مقياس الطول", gender: "m", sentences: ["الزرافة تقيس الطول.", "هوب! اللوح ينزل.", "واو، الطول كبير جدا!"] },
    schrank: { name: "الخزانة", gender: "f", sentences: ["الأبواب تفتح. ماذا في الخزانة؟", "هنا لصقات وضمادات."] },
    seifenspender: { name: "الصابون", gender: "m", sentences: ["هيّا نضغط! تخرج رغوة.", "أولا نغسل الأيدي!"] },
    lampe: { name: "المصباح", gender: "m", sentences: ["تك! المصباح يضيء.", "الآن المكان منير جدا."] },
    papa: { name: "بابا", gender: "m", sentences: ["بابا ينتظر ويقرأ كتابا.", "آآآه! بابا يتثاءب ويتمطى."] },
    waschbecken: { name: "المغسلة", gender: "f", sentences: ["طش، طش! الماء يجري.", "في الخزانة مناشف وبطة. ومن أيضا؟"] },
    aquarium: { name: "حوض السمك", gender: "m", sentences: ["بلب، بلب! السمك يسبح.", "صندوق الكنز يفتح.", "في الخزانة تحت طعام السمك."] },
    waage: { name: "الميزان", gender: "m", sentences: ["هيّا نقف عليه! بيب، بيب!", "المؤشر يدور. كم الوزن؟"] },
    wasserspender: { name: "براد الماء", gender: "m", sentences: ["قلوب، قلوب! كوب ماء.", "بلب! الفقاعات تصعد."] },
    arzthelferin: { name: "الممرضة", gender: "f", sentences: ["مرحبا! الممرضة تلوح.", "هي تدندن أغنية: لا، لا، لا!"] },
    empfang: { name: "الاستقبال", gender: "m", sentences: ["هنا نسجل الاسم.", "الدرج يفتح. هنا أقلام!"] },
    telefon: { name: "الهاتف", gender: "m", sentences: ["رن، رن! الهاتف يرن.", "ألو، هنا عيادة طبيب الأطفال!"] },
    aufkleber: { name: "الملصقات", gender: "f", plural: true, sentences: ["في النهاية يوجد ملصق!", "نجوم وقلوب تطير منها.", "أي واحد هو الأجمل؟"] },
    liege: { name: "سرير الفحص", gender: "m", sentences: ["على سرير الفحص نستلقي.", "خش! الورق يتدحرج.", "الدرج يفتح ويغلق."] },
    kind: { name: "الطفل", gender: "m", sentences: ["الطفل يجلس على سرير الفحص. هيهي!", "الطفل شجاع جدا.", "على الركبة لصقة."] },
    kinderwagen: { name: "عربة الأطفال", gender: "f", sentences: ["عربة الأطفال تتأرجح.", "الرضيع يضحك: هيهي!"] },
    spielkiste: { name: "صندوق الألعاب", gender: "m", sentences: ["الغطاء يفتح.", "بوينغ! أرنب يقفز منه.", "في الصندوق كرة وبطة."] },
    aerztin: { name: "الطبيبة", gender: "f", sentences: ["مرحبا! أنا طبيبة الأطفال.", "الطبيبة تلوح وتضحك.", "هنا يتعافى الجميع."] },
    rollwagen: { name: "العربة", gender: "f", sentences: ["زيق! العربة تتدحرج.", "الأدراج تفتح، واحدا بعد الآخر."] },
    stethoskop: { name: "السماعة", gender: "f", sentences: ["دم دم، دم دم! هكذا يدق القلب.", "بالسماعة تسمع الطبيبة."] },
    ohrenlampe: { name: "مصباح الأذن", gender: "m", sentences: ["بلينغ! الضوء يضيء.", "بالمصباح تنظر الطبيبة في الأذن.", "كل شيء نظيف!"] },
    pflaster: { name: "اللصقات", gender: "f", plural: true, sentences: ["العلبة تفتح. لصقات!", "لصقة فيها نجوم. ملونة وجميلة!"] },
    muelleimer: { name: "سلة المهملات", gender: "f", sentences: ["هيّا ندوس عليها! الغطاء يفتح.", "الورقة تطير في سلة المهملات."] },
    schaukelpferd: { name: "الحصان الهزاز", gender: "m", sentences: ["هيّا هيّا! الحصان الهزاز يتأرجح.", "هيييي! الحصان يهز رأسه."] },
    pflanze: { name: "النبتة", gender: "f", sentences: ["خش، خش! الأوراق تهتز.", "هنا دعسوقة تمشي."] },
    arzttasche: { name: "حقيبة الطبيبة", gender: "f", sentences: ["طق! حقيبة الطبيبة تفتح.", "في الداخل مطرقة صغيرة. طق، طق!"] },
    bauklotz: { name: "البرج", gender: "m", sentences: ["واو! البرج يتمايل.", "لكنه لا يسقط!"] },
    teddy: { name: "الدبدوب", gender: "m", sentences: ["الدبدوب عليه ضماد.", "الدبدوب يلوح. لم يعد يؤلمه!", "الدبدوب تعافى."] },
    kugelbahn: { name: "مسار الكرات", gender: "m", sentences: ["الكرة تتدحرج هنا وهناك.", "طق، طق! وصلت إلى تحت."] },
    ball: { name: "الكرة", gender: "f", sentences: ["بوينغ، بوينغ! الكرة تقفز.", "الكرة ملونة جدا."] },
    feuerwehr: { name: "سيارة الإطفاء", gender: "f", sentences: ["وي وو! سيارة الإطفاء تنطلق.", "السلم يرتفع."] },
    bilderbuch: { name: "كتاب الصور", gender: "m", sentences: ["الصفحات تقلب. خش!", "في الكتاب قلب ونجمة."] },
  },
  chains: [
    ["الممرضة ترد على الهاتف.", "وها هو الطفل التالي!"],
    ["الطبيبة تسمع: دم دم! كل شيء بخير.", "الطفل يضحك: هذا يدغدغ!"],
    ["أوه! البرج يتمايل.", "وسيارة الإطفاء تنطلق: وي وو!"],
  ],
};
