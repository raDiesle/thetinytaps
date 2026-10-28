import type { SceneTranslation } from "../types";

// The Arabic words of the Stadt picture (Modern Standard Arabic, simple, no vowel marks): names with the
// article ال and their gender, what each item says and the chain sentences.

/** „Stadt“ in Arabic. */
export const AR: SceneTranslation = {
  title: "المدينة",
  description: "الحافلة وسيارة الإطفاء والمخبز في المدينة.",
  items: {
    sonne: { name: "الشمس", gender: "f", sentences: ["الشمس تشرق!", "الشمس تبتسم."] },
    wolke: { name: "الغيمة", gender: "f", sentences: ["الغيمة تمطر. طق، طق!", "الغيمة بيضاء وناعمة."] },
    flugzeug: { name: "الطائرة", gender: "f", sentences: ["الطائرة تدور دورة في الهواء!", "ززز! الطائرة تطير فوق المدينة."] },
    kirche: { name: "الكنيسة", gender: "f", sentences: ["دينغ، دونغ! الجرس يرن.", "فوق البرج يجلس ديك.", "الساعة تدل على الوقت."] },
    haus: { name: "البيت", gender: "m", sentences: ["في البيت يسكن ناس كثيرون.", "النور يضيء!", "مرحبا! الطفل يلوح من النافذة."] },
    katze: { name: "القطة", gender: "f", sentences: ["مياو! القطة تجلس عند النافذة.", "القطة تنظر إلى الشارع."] },
    baeckerei: { name: "المخبز", gender: "m", sentences: ["ممم، في المخبز كعك طازج!", "الخباز يخبز الخبز والكعك."] },
    feuerwache: { name: "مركز الإطفاء", gender: "m", sentences: ["هذا مركز الإطفاء.", "البوابة تفتح. هنا تسكن سيارة الإطفاء."] },
    baum: { name: "الشجرة", gender: "f", sentences: ["على الشجرة ينمو تفاح أحمر.", "الريح تهز أوراق الشجرة."] },
    vogel: { name: "العصفور", gender: "m", sentences: ["صوصو! العصفور يطير.", "العصفور يعيش في الشجرة."] },
    schaukel: { name: "الأرجوحة", gender: "f", sentences: ["واو! الطفل يتأرجح عاليا.", "إلى الأمام وإلى الخلف، إلى الأمام وإلى الخلف."] },
    eiswagen: { name: "سيارة المثلجات", gender: "f", sentences: ["لذيذ، مثلجات!", "فراولة أم شوكولاتة أم فانيلا؟"] },
    oma: { name: "الجدة", gender: "f", sentences: ["مرحبا! الجدة تلوح.", "الجدة تجلس على المقعد."] },
    briefkasten: { name: "صندوق البريد", gender: "m", sentences: ["رسالة لك!", "صندوق البريد أصفر."] },
    spatz: { name: "الدوري", gender: "m", sentences: ["تشيب! الدوري يجلس على صندوق البريد.", "الدوري صغير وبني."] },
    laterne: { name: "عمود الإنارة", gender: "m", sentences: ["عمود الإنارة يشتعل. الآن المكان منير!", "عمود الإنارة يضيء في الليل."] },
    hydrant: { name: "صنبور الإطفاء", gender: "m", sentences: ["من صنبور الإطفاء يأتي الماء لرجال الإطفاء.", "طش، طش!"] },
    bus: { name: "الحافلة", gender: "f", sentences: ["الحافلة تتوقف. اصعدوا جميعا!", "الأبواب تفتح وتغلق.", "بيب، بيب! الحافلة تنطلق."] },
    polizei: { name: "سيارة الشرطة", gender: "f", sentences: ["وي وو! الشرطة قادمة.", "الضوء الأزرق يلمع."] },
    fahrrad: { name: "الدراجة", gender: "f", sentences: ["رن، رن! ها هي الدراجة.", "مع الخوذة نكون في أمان."] },
    enten: { name: "عائلة البط", gender: "f", sentences: ["كواك، كواك! البط يعبر الشارع.", "السيارات تنتظر البط."] },
    auto: { name: "السيارة", gender: "f", sentences: ["بيب، بيب! السيارة تزمر.", "السيارة حمراء."] },
    feuerwehr: { name: "سيارة الإطفاء", gender: "f", sentences: ["وي وو! سيارة الإطفاء تنطلق.", "السلم يرتفع عاليا جدا.", "سيارة الإطفاء حمراء."] },
    muellauto: { name: "شاحنة القمامة", gender: "f", sentences: ["شاحنة القمامة تأخذ القمامة.", "الحاوية إلى فوق، والقمامة إلى الداخل!"] },
    ampel: { name: "إشارة المرور", gender: "f", sentences: ["الرجل الأحمر: نقف!", "الرجل الأخضر: الآن نمشي."] },
    muelleimer: { name: "سلة المهملات", gender: "f", sentences: ["القمامة في سلة المهملات.", "أوبس، سلة المهملات تتمايل!"] },
    blumen: { name: "الأزهار", gender: "f", plural: true, sentences: ["الأزهار ملونة.", "وردي وأصفر وبنفسجي."] },
    falter: { name: "الفراشة", gender: "f", sentences: ["الفراشة ترفرف هنا وهناك.", "الفراشة تحب الأزهار."] },
    roller: { name: "السكوتر", gender: "m", sentences: ["السكوتر يسير!", "بالسكوتر نصل بسرعة."] },
    kinderwagen: { name: "عربة الأطفال", gender: "f", sentences: ["في عربة الأطفال رضيع.", "الرضيع يضحك. هيهي!"] },
    brunnen: { name: "النافورة", gender: "f", sentences: ["النافورة ترش الماء عاليا جدا!", "طش، طش!"] },
    luftballon: { name: "البالون", gender: "m", sentences: ["البالون أحمر.", "هيّا نمسكه جيدا!"] },
    hund: { name: "الكلب", gender: "m", sentences: ["هو، هو! الكلب يريد أن يلعب.", "الكلب يهز ذيله."] },
    marienkaefer: { name: "الدعسوقة", gender: "f", sentences: ["الدعسوقة تطير!", "للدعسوقة نقاط سوداء."] },
    taube: { name: "الحمامة", gender: "f", sentences: ["قرر، قرر! الحمامة تنقر الفتات.", "الحمامة رمادية."] },
    maus: { name: "الفأرة", gender: "f", sentences: ["زيق! الفأرة تعيش في البالوعة.", "مرحبا أيتها الفأرة الصغيرة!"] },
  },
  chains: [
    ["القطة عند النافذة تقوس ظهرها!", "والعصفور يطير بعيدا بسرعة!"],
    ["وي وو! سيارة الإطفاء تنطلق.", "الماء يتدفق!"],
    ["أخضر! البط يعبر الشارع.", "السيارة تنتظر وتزمر: بيب، بيب!"],
  ],
};
