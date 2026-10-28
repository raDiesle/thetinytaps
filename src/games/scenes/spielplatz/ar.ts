import type { SceneTranslation } from "../types";

// The Arabic words of the Spielplatz picture (Modern Standard Arabic, simple, no vowel marks): names with the
// article ال and their gender, what each item says and the chain sentences. The seesaw is „السيسو“, the word
// children use across the Arab countries.

/** „Spielplatz“ in Arabic. */
export const AR: SceneTranslation = {
  title: "ساحة اللعب",
  description: "الزحليقة والأرجوحة والسيسو وصندوق الرمل.",
  items: {
    sonne: { name: "الشمس", gender: "f", sentences: ["الشمس تشرق!", "الشمس تبتسم."] },
    wolke: { name: "الغيمة", gender: "f", sentences: ["الغيمة تمطر. طق، طق!", "الغيمة بيضاء وناعمة."] },
    flugzeug: {
      name: "الطائرة",
      gender: "f",
      sentences: ["الطائرة تطير عاليا في السماء.", "ززز! المروحة تدور.", "قائدة الطائرة تلوح بالجناحين."],
    },
    drachen: {
      name: "الطائرة الورقية",
      gender: "f",
      sentences: ["الطائرة الورقية تطير في الريح!", "واو! الطائرة الورقية تندفع هنا وهناك.", "للطائرة الورقية ذيل طويل."],
    },
    luftballon: { name: "البالون", gender: "m", sentences: ["البالون الأحمر يطير بعيدا!", "البالون يرتفع إلى فوق."] },
    opa: { name: "الجد", gender: "m", sentences: ["الجد يقرأ الجريدة.", "مرحبا يا جدو! الجد يرفع قبعته.", "الجد يجلس على المقعد."] },
    muelleimer: { name: "سلة المهملات", gender: "f", sentences: ["طاخ! سلة المهملات تفتح.", "القمامة في سلة المهملات."] },
    eiswagen: { name: "سيارة المثلجات", gender: "f", sentences: ["تن، تن! سيارة المثلجات وصلت.", "ممم، مثلجات بالفراولة!", "بائع المثلجات يلوح."] },
    baum: { name: "الشجرة", gender: "f", sentences: ["الريح تهز أوراق الشجرة.", "على الشجرة ينمو تفاح أحمر.", "الشجرة كبيرة وخضراء."] },
    vogel: { name: "العصفور", gender: "m", sentences: ["صوصو! العصفور يطير.", "العصفور يجلس على الغصن."] },
    eichhoernchen: { name: "السنجاب", gender: "m", sentences: ["هوب! السنجاب يتسلق الشجرة.", "السنجاب يقضم جوزة."] },
    schaukel: {
      name: "الأرجوحة",
      gender: "f",
      sentences: ["واو! الأرجوحة تطير عاليا.", "إلى الأمام وإلى الخلف، ما أسهل ذلك!", "زيق، زيق، تقول الأرجوحة."],
    },
    kletterturm: { name: "برج التسلق", gender: "m", sentences: ["أهوي! هذه سفينة قراصنة.", "السلم يصعد إلى البرج.", "من ينظر من النافذة؟"] },
    rutsche: { name: "الزحليقة", gender: "f", sentences: ["واو! نتزحلق إلى تحت!", "الزحليقة صفراء وملساء.", "مرة أخرى!"] },
    katze: { name: "القطة", gender: "f", sentences: ["مياو! القطة تجلس على السطح.", "القطة تنظف كفها."] },
    seifenblasen: {
      name: "فقاعات الصابون",
      gender: "f",
      plural: true,
      sentences: ["فوو! فقاعات صابون كثيرة تطير.", "الفقاعات تلمع بألوان كثيرة.", "بوب! الفقاعة انفجرت."],
    },
    wippe: { name: "السيسو", gender: "m", sentences: ["إلى فوق وإلى تحت مع السيسو!", "على السيسو يجلس طفلان.", "فوق، تحت، مرحى!"] },
    karussell: { name: "الدوارة", gender: "f", sentences: ["الدوارة تدور وتدور!", "الأطفال يمسكون جيدا.", "ندور وندور، ما أحلى الدوران!"] },
    hund: { name: "الكلب", gender: "m", sentences: ["هو، هو! الكلب يريد أن يلعب.", "الكلب يهز ذيله."] },
    schaukelpferd: {
      name: "الحصان الهزاز",
      gender: "m",
      sentences: ["هيّا هيّا! الحصان الهزاز يتأرجح.", "للحصان عرف بنفسجي.", "هوب، هوب، هوب، اركض يا حصاني!"],
    },
    ball: { name: "الكرة", gender: "f", sentences: ["بوينغ! الكرة تقفز عاليا.", "الكرة حمراء وزرقاء وصفراء."] },
    mama: { name: "ماما", gender: "f", sentences: ["ماما تدفع عربة الأطفال.", "مرحبا! ماما تلوح."] },
    kinderwagen: {
      name: "عربة الأطفال",
      gender: "f",
      sentences: ["في عربة الأطفال رضيع.", "الرضيع يضحك ويهز الخشخيشة.", "عربة الأطفال تتدحرج."],
    },
    tauben: { name: "الحمامات", gender: "f", plural: true, sentences: ["قرر، قرر! الحمامات تنقر الفتات.", "الحمامات تبحث عن طعام."] },
    roller: { name: "السكوتر", gender: "m", sentences: ["ووش! السكوتر ينطلق.", "دفعة بالقدم، وننطلق!"] },
    laufrad: {
      name: "دراجة التوازن",
      gender: "f",
      sentences: ["دراجة التوازن تتدحرج. هيّا، هيّا!", "رن، رن! جرس دراجة التوازن.", "الطفل يلبس خوذة."],
    },
    pumpe: { name: "مضخة الماء", gender: "f", sentences: ["نضخ، نضخ! الماء يأتي.", "طش، طش! الماء يجري إلى الجدول."] },
    sandburg: {
      name: "قلعة الرمل",
      gender: "f",
      sentences: ["هذه قلعة رمل!", "البوابة تفتح. من يسكن هناك؟", "العلم يرفرف على قلعة الرمل."],
    },
    kind: { name: "الطفل", gender: "m", sentences: ["الطفل يحفر في الرمل.", "هيهي! الرمل يطير عاليا.", "الطفل يلبس قبعة شمس."] },
    schnecke: { name: "الحلزون", gender: "m", sentences: ["الحلزون يزحف ببطء شديد.", "الحلزون يحمل بيته على ظهره."] },
    blumen: { name: "الأزهار", gender: "f", plural: true, sentences: ["الأزهار ملونة.", "الأزهار تومئ في الريح."] },
    schmetterling: { name: "الفراشة", gender: "f", sentences: ["الفراشة ترفرف هنا وهناك.", "الفراشة تحب الأزهار."] },
    marienkaefer: { name: "الدعسوقة", gender: "f", sentences: ["الدعسوقة تطير!", "للدعسوقة نقاط سوداء."] },
    eimer: { name: "الدلو", gender: "m", sentences: ["الدلو ينقلب. الرمل ينسكب!", "الدلو أحمر."] },
    bagger: { name: "الحفارة الصغيرة", gender: "f", sentences: ["الحفارة الصغيرة تحفر الرمل.", "برر، برر! الحفارة صفراء."] },
    foermchen: { name: "القوالب", gender: "f", plural: true, sentences: ["بالقوالب نصنع كعك الرمل.", "نجمة وسمكة وقلب!"] },
  },
  chains: [
    ["القطة تخاف!", "والعصفور يطير بعيدا بسرعة!"],
    ["مثلجات! دراجة التوازن تسرع إلى هناك.", "والسكوتر يندفع خلفها!"],
    ["مطر! الحلزون يفرح.", "بسرعة، غطاء عربة الأطفال ينغلق."],
  ],
};
