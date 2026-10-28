import type { SceneTranslation } from "../types";

// The Arabic words of the Zoo picture (Modern Standard Arabic, simple, no vowel marks): names with the
// article ال and their gender, what each item says and the chain sentences.

/** „Zoo“ in Arabic. */
export const AR: SceneTranslation = {
  title: "حديقة الحيوان",
  description: "الأسد والفيل والبطاريق في حديقة الحيوان.",
  items: {
    sonne: { name: "الشمس", gender: "f", sentences: ["الشمس تشرق!", "الشمس تبتسم."] },
    wolke: { name: "الغيمة", gender: "f", sentences: ["الغيمة تمطر. طق، طق!", "الحيوانات تبتل."] },
    luftballon: { name: "البالون", gender: "m", sentences: ["البالون يطير بعيدا!", "البالون أحمر."] },
    giraffe: { name: "الزرافة", gender: "f", sentences: ["الزرافة تأكل الأوراق في أعلى الشجرة.", "هم، هم! للزرافة رقبة طويلة."] },
    strauss: { name: "النعامة", gender: "f", sentences: ["النعامة تركض بسرعة كبيرة!", "النعامة طائر كبير."] },
    zebra: { name: "الحمار الوحشي", gender: "m", sentences: ["واو! الحمار الوحشي يقفز.", "للحمار الوحشي خطوط سوداء وبيضاء."] },
    elefant: { name: "الفيل", gender: "m", sentences: ["تووووت! الفيل يرش الماء.", "للفيل خرطوم طويل.", "الفيل كبير جدا."] },
    elefantenbaby: { name: "الفيل الصغير", gender: "m", sentences: ["الفيل الصغير يرش أيضا!", "توت! الفيل الصغير يحرك أذنيه."] },
    papagei: { name: "الببغاء", gender: "m", sentences: ["مرحبا! الببغاء يتكلم.", "الببغاء أحمر وملون."] },
    affe: { name: "القرد", gender: "m", sentences: ["واو! القرد يتأرجح على الحبل.", "أو، أو، آ، آ! القرد مضحك."] },
    aeffchen: { name: "القرد الصغير", gender: "m", sentences: ["القرد الصغير يأكل موزة.", "ممم، لذيذ! القرد الصغير يصفق."] },
    panda: { name: "الباندا", gender: "m", sentences: ["الباندا يأكل الخيزران.", "هم، هم! الباندا أبيض وأسود."] },
    loewe: { name: "الأسد", gender: "m", sentences: ["رااار! الأسد يتثاءب بصوت عال.", "الأسد مستلق على صخرته.", "للأسد لبدة كبيرة."] },
    loewenbaby: { name: "الشبل", gender: "m", sentences: ["الشبل يلعب.", "الشبل يزأر بصوت خافت: غرر!"] },
    nashorn: { name: "وحيد القرن", gender: "m", sentences: ["فففف! وحيد القرن يدق الأرض بقدمه.", "لوحيد القرن قرن على أنفه."] },
    kaenguru: { name: "الكنغر", gender: "m", sentences: ["هوب، هوب! الكنغر يقفز.", "في الجيب يعيش صغير الكنغر."] },
    koala: { name: "الكوالا", gender: "m", sentences: ["الكوالا يستيقظ ويلوح.", "الكوالا يحب النوم في الشجرة."] },
    flamingo: { name: "الفلامنغو", gender: "m", sentences: ["الفلامنغو يقف على رجل واحدة.", "الفلامنغو وردي."] },
    bimmelbahn: { name: "القطار الصغير", gender: "m", sentences: ["تن، تن! القطار الصغير يسير في حديقة الحيوان.", "الأطفال يلوحون من القطار الصغير."] },
    pfau: { name: "الطاووس", gender: "m", sentences: ["يا سلام! الطاووس يفتح ذيله.", "للطاووس ريش جميل."] },
    tierpfleger: { name: "الحارسة", gender: "f", sentences: ["مرحبا! الحارسة تحضر الطعام.", "الحارسة ترمي سمكة."] },
    taube: { name: "الحمامة", gender: "f", sentences: ["قرر، قرر! الحمامة تنقر الفتات.", "الحمامة ترفرف."] },
    kind: { name: "الطفل", gender: "m", sentences: ["مع الطفل مثلجات. لذيذ!", "الطفل يقفز من الفرح."] },
    eiswagen: { name: "سيارة المثلجات", gender: "f", sentences: ["رن، رن! سيارة المثلجات وصلت.", "هناك مثلجات بالفراولة ومثلجات بالشوكولاتة."] },
    pinguin: { name: "البطريق", gender: "m", sentences: ["وييي! البطريق ينزلق في الماء.", "البطريق يسبح جيدا."] },
    pinguinkueken: { name: "البطريق الصغير", gender: "m", sentences: ["البطريق الصغير يتمايل في مشيته.", "البطريق الصغير ناعم جدا."] },
    fisch: { name: "السمكة", gender: "f", sentences: ["طش! السمكة تقفز من الماء.", "السمكة زرقاء."] },
    seehund: { name: "الفقمة", gender: "f", sentences: ["أو، أو! الفقمة تلعب بالكرة.", "الفقمة تصفق بزعانفها."] },
    erdmaennchen: { name: "الميركات", gender: "m", sentences: ["أوه! الميركات ينظر من الحفرة.", "الميركات ينتبه جيدا."] },
    schmetterling: { name: "الفراشة", gender: "f", sentences: ["الفراشة تطير إلى الأزهار.", "الفراشة صفراء."] },
    schildkroete: { name: "السلحفاة", gender: "f", sentences: ["السلحفاة تختبئ في صدفتها.", "مرحبا! ها هي من جديد."] },
    krokodil: { name: "التمساح", gender: "m", sentences: ["طق! التمساح يفتح فمه ويغلقه.", "التمساح أخضر."] },
    nilpferd: { name: "فرس النهر", gender: "m", sentences: ["فرس النهر يفتح فمه واسعا جدا.", "بلب! فرس النهر يستحم في النهر."] },
    pelikan: { name: "طائر البجع", gender: "m", sentences: ["هوب! طائر البجع يصطاد سمكة.", "لطائر البجع منقار كبير."] },
  },
  chains: [
    ["الفقمة تمسك السمكة. أو، أو!", "والبطريق ينزلق خلفها بسرعة!"],
    ["أوه! النعامة تركض بعيدا بسرعة.", "والشبل يزأر أيضا – بصوت خافت جدا."],
    ["الفيل الصغير يرش هو أيضا!", "أوه! وحيد القرن يبتل كله."],
  ],
};
