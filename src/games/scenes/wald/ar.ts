import type { SceneTranslation } from "../types";

// The Arabic words of the Wald picture (Modern Standard Arabic, simple, no vowel marks): names with the
// article ال and their gender, what each item says and the chain sentences. Birch, oak and fir have names of
// their own (البتولا، البلوطة، الصنوبرة), so the keys mode doesn't start all three with ش of „شجرة“.

/** „Wald“ in Arabic. */
export const AR: SceneTranslation = {
  title: "الغابة",
  description: "البومة ونقار الخشب والظبية والثعلب عند الجدول في الغابة.",
  items: {
    sonne: { name: "الشمس", gender: "f", sentences: ["الشمس تشرق بين الأشجار.", "الشمس تبتسم."] },
    wolke: { name: "الغيمة", gender: "f", sentences: ["الغيمة تمطر. طق، طق!", "بعد المطر ينمو الفطر."] },
    birke: { name: "البتولا", gender: "f", sentences: ["لشجرة البتولا جذع أبيض.", "أوراق البتولا تلمع في الريح."] },
    specht: { name: "نقار الخشب", gender: "m", sentences: ["طق، طق، طق! نقار الخشب ينقر الشجرة.", "لنقار الخشب قبعة حمراء."] },
    vogelnest: { name: "العش", gender: "m", sentences: ["صوصو! الفراخ جائعة.", "الأم تحضر دودة."] },
    eiche: { name: "البلوطة", gender: "f", sentences: ["البلوطة شجرة قديمة وسميكة.", "بوم! ثمار البلوط تسقط."] },
    eule: { name: "البومة", gender: "f", sentences: ["هوو، هوو! البومة تدير رأسها.", "البومة تسكن في حفرة الشجرة.", "للبومة عينان كبيرتان."] },
    hirsch: { name: "الأيل", gender: "m", sentences: ["أووو! الأيل ينادي بصوت عال.", "للأيل قرون كبيرة."] },
    tanne: { name: "الصنوبرة", gender: "f", sentences: ["الصنوبرة كبيرة وخضراء.", "بوم! كوز صنوبر يسقط."] },
    kuckuck: { name: "الوقواق", gender: "m", sentences: ["كوكو، كوكو! نسمعه في الغابة.", "الوقواق يجلس على الصنوبرة."] },
    ameisenhaufen: { name: "بيت النمل", gender: "m", sentences: ["في بيت النمل يعيش نمل كثير جدا.", "النمل يمشي واحدة خلف الأخرى."] },
    dachs: { name: "الغرير", gender: "m", sentences: ["الغرير يطل من جحره.", "شم، شم! للغرير أنف مخطط."] },
    eichhoernchen: { name: "السنجاب", gender: "m", sentences: ["السنجاب يخبئ جوزة.", "للسنجاب ذيل كثيف."] },
    biber: { name: "القندس", gender: "m", sentences: ["القندس يقضم غصنا.", "طش! القندس يضرب الماء بذيله.", "القندس يبني سدا."] },
    reh: { name: "الظبية", gender: "f", sentences: ["واو! الظبية تقفز.", "للظبية أذنان كبيرتان."] },
    fuchs: { name: "الثعلب", gender: "m", sentences: ["هوب! الثعلب يقفز عاليا.", "للثعلب ذيل كثيف.", "الثعلب ينبح: واو!"] },
    rehkitz: { name: "صغير الظبية", gender: "m", sentences: ["صغير الظبية هو طفل الظبية.", "فيب! لصغير الظبية نقاط بيضاء."] },
    wildschwein: { name: "الخنزير البري", gender: "m", sentences: ["أنخ، أنخ! الخنزير البري يحفر في التراب.", "الخنزير البري يبحث عن البلوط."] },
    frischlinge: {
      name: "صغار الخنزير",
      gender: "f",
      plural: true,
      sentences: ["صغار الخنزير هي أطفال الخنزير البري.", "لصغار الخنزير خطوط."],
    },
    bruecke: { name: "الجسر", gender: "m", sentences: ["طق، طق! نعبر الجسر فوق الجدول.", "تحت الجسر يخرخر الماء."] },
    holzstapel: { name: "كومة الخشب", gender: "f", sentences: ["حارس الغابة يكوم الخشب.", "بوم، طاخ! الجذوع تتمايل."] },
    hirschkaefer: { name: "خنفساء الأيل", gender: "f", sentences: ["لخنفساء الأيل كماشتان كبيرتان.", "طق! الخنفساء تفتح كماشتيها وتغلقهما."] },
    wegweiser: { name: "لافتة الطريق", gender: "f", sentences: ["لافتة الطريق تدل على الطريق.", "من هنا إلى الغابة، ومن هناك إلى الجدول."] },
    rabe: { name: "الغراب", gender: "m", sentences: ["غاق، غاق! الغراب ينادي.", "الغراب أسود تماما."] },
    kind: { name: "الطفل", gender: "m", sentences: ["الطفل يجمع أوراقا ملونة.", "هوب! الطفل يقفز في الأوراق.", "مرحبا! الطفل يلوح."] },
    hase: { name: "الأرنب", gender: "m", sentences: ["هوب، هوب! الأرنب يقفز.", "الأرنب يقضم ورقة."] },
    foersterin: {
      name: "حارسة الغابة",
      gender: "f",
      sentences: ["حارسة الغابة تنظر في المنظار.", "حارسة الغابة تحمي الغابة.", "مرحبا! حارسة الغابة تصفر أغنية."],
    },
    libelle: { name: "اليعسوب", gender: "m", sentences: ["ززز! اليعسوب يطير فوق الجدول.", "اليعسوب أزرق."] },
    fisch: { name: "السمكة", gender: "f", sentences: ["طش! السمكة تقفز من الماء.", "السمكة تسبح في الجدول. بلب!"] },
    igel: { name: "القنفذ", gender: "m", sentences: ["القنفذ يتكور مثل الكرة.", "للقنفذ أشواك كثيرة.", "شم! القنفذ يحمل تفاحة."] },
    baumstumpf: { name: "جذع الشجرة", gender: "m", sentences: ["طق، طق! من يسكن في جذع الشجرة؟", "على جذع الشجرة ينمو فطر صغير."] },
    maus: { name: "الفأرة", gender: "f", sentences: ["زيق! الفأرة تسكن في جذع الشجرة.", "مرحبا أيتها الفأرة الصغيرة!"] },
    beerenstrauch: { name: "شجيرة التوت", gender: "f", sentences: ["على الشجيرة ينمو توت أزرق وتوت أحمر.", "ممم، التوت لذيذ!"] },
    schmetterling: { name: "الفراشة", gender: "f", sentences: ["الفراشة زرقاء.", "الفراشة ترفرف فوق التوت."] },
    frosch: { name: "الضفدع", gender: "m", sentences: ["نق! الضفدع يجلس على حجر.", "هوب! الضفدع يصطاد ذبابة."] },
    fliegenpilz: { name: "الفطر الأحمر", gender: "m", sentences: ["الفطر الأحمر فيه نقاط بيضاء.", "الفطر الأحمر سام. ننظر إليه فقط!"] },
    farn: { name: "السرخس", gender: "m", sentences: ["للسرخس أوراق طويلة وخضراء.", "السرخس يفرد ورقته."] },
    marienkaefer: { name: "الدعسوقة", gender: "f", sentences: ["الدعسوقة حمراء بنقاط سوداء.", "طيري يا دعسوقة، طيري!"] },
    schnecke: { name: "الحلزون", gender: "m", sentences: ["الحلزون يزحف ببطء شديد.", "الحلزون يحمل بيته على ظهره."] },
    maulwurf: { name: "الخلد", gender: "m", sentences: ["أوبس! الخلد يطل من التراب.", "الخلد يحفر بيديه مثل المجرفة."] },
  },
  chains: [
    ["البومة تستيقظ: هوو، هوو! من يطرق هناك؟", "والوقواق ينادي: كوكو!"],
    ["صغار الخنزير تشخر معه.", "والغرير ينظر: ماذا يحدث هناك؟"],
    ["الفأرة تطل: من يطرق هناك؟", "والقنفذ يتكور بسرعة مثل الكرة."],
  ],
};
