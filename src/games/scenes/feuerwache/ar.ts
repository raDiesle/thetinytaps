import type { SceneTranslation } from "../types";

// The Arabic words of the Feuerwache picture (Modern Standard Arabic, simple, no vowel marks): names with the
// article ال and their gender, what each item says and the chain sentences.

/** „Feuerwache“ in Arabic. */
export const AR: SceneTranslation = {
  title: "مركز الإطفاء",
  description: "سيارة الإطفاء وصفارة الإنذار وكلب الإطفاء في مركز الإطفاء.",
  items: {
    sonne: { name: "الشمس", gender: "f", sentences: ["الشمس تشرق!", "الشمس تبتسم."] },
    wolke: { name: "الغيمة", gender: "f", sentences: ["الغيمة تمطر. طق، طق!", "الغيمة تساعد رجال الإطفاء."] },
    hubschrauber: { name: "المروحية", gender: "f", sentences: ["المروحية تطير. ترررر!", "في الأسفل يتدلى دلو ماء."] },
    turm: { name: "البرج", gender: "m", sentences: ["في البرج تجف الخراطيم.", "الباب يفتح. مرحبا!", "البرج عال جدا."] },
    sirene: { name: "صفارة الإنذار", gender: "f", sentences: ["وي وو، وي وو! صفارة الإنذار تدوي.", "يا رجال الإطفاء، تعالوا بسرعة!"] },
    wache: {
      name: "مركز الإطفاء",
      gender: "m",
      sentences: ["هذا مركز الإطفاء. هنا تسكن سيارات الإطفاء.", "النوافذ تفتح. مرحبا!", "الساعة تدق: دينغ، دونغ!"],
    },
    tor: { name: "البوابة", gender: "f", sentences: ["البوابة تفتح!", "في الداخل سيارة إطفاء صغيرة.", "البوابة تغلق من جديد."] },
    helme: { name: "الخوذ", gender: "f", plural: true, sentences: ["هنا تتدلى السترات والخوذ.", "نلبس بسرعة، وهيّا ننطلق!"] },
    rutschstange: { name: "العمود", gender: "m", sentences: ["ووووش! الإطفائي ينزلق على العمود.", "هكذا ننزل بسرعة كبيرة."] },
    glocke: { name: "جرس الإنذار", gender: "m", sentences: ["ررررن! جرس الإنذار يرن.", "إنذار! على رجال الإطفاء أن ينطلقوا."] },
    taube: { name: "الحمامة", gender: "f", sentences: ["قرر، قرر! الحمامة تجلس على السطح.", "الحمامة رمادية."] },
    fahne: { name: "العلم", gender: "m", sentences: ["العلم يرفرف في الريح.", "على العلم خوذة."] },
    vogel: { name: "العصفور", gender: "m", sentences: ["صوصو! العصفور يغني.", "العصفور يجلس في أعلى العلم."] },
    blumen: { name: "الأزهار", gender: "f", plural: true, sentences: ["الأزهار حمراء وصفراء.", "رجال الإطفاء يسقون الأزهار."] },
    schmetterling: { name: "الفراشة", gender: "f", sentences: ["الفراشة ترفرف هنا وهناك.", "الفراشة تحب الأزهار."] },
    baum: { name: "الشجرة", gender: "f", sentences: ["الريح تهز أوراق الشجرة.", "على الشجرة ينمو تفاح أحمر."] },
    katze: { name: "القطة", gender: "f", sentences: ["مياو! القطة تجلس في أعلى الشجرة.", "القطة لا تستطيع النزول. رجال الإطفاء يساعدون!"] },
    eichhoernchen: { name: "السنجاب", gender: "m", sentences: ["السنجاب يقضم جوزة.", "مرحبا أيها السنجاب!"] },
    kommandowagen: { name: "سيارة القائدة", gender: "f", sentences: ["في السيارة تجلس القائدة.", "الباب يفتح. بيب، بيب!"] },
    hydrant: { name: "صنبور الإطفاء", gender: "m", sentences: ["من صنبور الإطفاء يأتي الماء للخرطوم.", "بلب، بلب!"] },
    krankenwagen: {
      name: "سيارة الإسعاف",
      gender: "f",
      sentences: ["وي وو! سيارة الإسعاف تساعد عندما يمرض أحد.", "الباب يفتح. الدبدوب يلوح!"],
    },
    grill: { name: "الشواية", gender: "f", sentences: ["الجد يشوي النقانق. ممم!", "الشواية تدخن قليلا."] },
    opa: { name: "الجد", gender: "m", sentences: ["الجد يقلب النقانق.", "مرحبا! الجد يضحك."] },
    puppe: { name: "الدمية", gender: "f", sentences: ["رجال الإطفاء يتدربون مع الدمية.", "أوبس، الدمية تتمايل!"] },
    feuerwehrauto: {
      name: "سيارة الإطفاء",
      gender: "f",
      sentences: ["وي وو! سيارة الإطفاء وصلت.", "السلم يرتفع عاليا جدا.", "سيارة الإطفاء حمراء."],
    },
    feuerwehrfrau: { name: "الإطفائية", gender: "f", sentences: ["الماء! الإطفائية ترش.", "الخرطوم طويل وأحمر."] },
    feuerwehrmann: { name: "الإطفائي", gender: "m", sentences: ["فيييت! الإطفائي يصفر.", "الإطفائي يلوح. مرحبا!"] },
    huetchen: { name: "المخروط", gender: "m", sentences: ["المخروط برتقالي وأبيض.", "هوب! المخروط يقفز."] },
    hund: { name: "كلب الإطفاء", gender: "m", sentences: ["هو، هو! كلب الإطفاء يلبس خوذة.", "للكلب نقاط سوداء."] },
    kind: { name: "الطفل", gender: "m", sentences: ["الطفل يزور رجال الإطفاء.", "مع الطفل خوذة أيضا. مرحى!"] },
    luftballon: { name: "البالون", gender: "m", sentences: ["البالون أصفر.", "هيّا نمسكه جيدا!"] },
    feuerloescher: { name: "طفاية الحريق", gender: "f", sentences: ["فففف! من طفاية الحريق تخرج رغوة بيضاء.", "طفاية الحريق حمراء."] },
    bobbycar: { name: "السيارة الصغيرة", gender: "f", sentences: ["السيارة الصغيرة سيارة إطفاء صغيرة.", "بيب، بيب! السيارة الصغيرة تسير."] },
    ente: { name: "البطة الصغيرة", gender: "f", sentences: ["كواك! البطة الصغيرة تسبح في البركة.", "البطة الصغيرة صفراء."] },
    schlauchrolle: { name: "بكرة الخرطوم", gender: "f", sentences: ["على البكرة خرطوم ملفوف.", "البكرة تدور. تتتت!"] },
    stiefel: { name: "الجزمات", gender: "f", plural: true, sentences: ["الجزمات جاهزة. نقفز فيها وننطلق!", "دب، دب!"] },
    maus: { name: "الفأرة", gender: "f", sentences: ["زيق! الفأرة تعيش في الجزمة.", "مرحبا أيتها الفأرة الصغيرة!"] },
    schnecke: { name: "الحلزون", gender: "m", sentences: ["الحلزون يزحف ببطء شديد.", "الحلزون يحمل بيته على ظهره."] },
  },
  chains: [
    ["ررررن! الشواية تدخن. إنذار!", "الماء! الإطفائية ترش.", "الجد يضحك: شكرا يا رجال الإطفاء!"],
    ["السلم يرتفع إلى القطة!", "مرحى! القطة نجت!"],
    ["بسرعة! الإطفائي ينزلق على العمود.", "البوابة تفتح!", "كلب الإطفاء ينبح: هو، هو!"],
  ],
};
