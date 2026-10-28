import type { SceneTranslation } from "../types";

// The Arabic words of the Kita picture (Modern Standard Arabic, simple, no vowel marks): names with the
// article ال and their gender, what each item says and the chain sentences. The children are told apart by what
// they do (الطفل النائم) or by a construct (طفل المعكرونة); a plural of people is masculine.

/** „Kita“ in Arabic. */
export const AR: SceneTranslation = {
  title: "الروضة",
  description: "السترات على المشاجب وركن المكعبات والقصة والغداء وقيلولة الظهر.",
  items: {
    wimpelkette: { name: "سلسلة الأعلام", gender: "f", sentences: ["الأعلام الملونة تتمايل هنا وهناك.", "اليوم حفلة في الروضة!"] },
    bilder: { name: "الرسومات", gender: "f", plural: true, sentences: ["هذه رسمها الأطفال!", "ها هو بيت وقوس قزح وقطة."] },
    tuer: { name: "الباب", gender: "m", sentences: ["الباب يفتح. مرحبا يا ماما!", "ماما ستأتي قريبا."] },
    geburtstagszug: { name: "قطار عيد الميلاد", gender: "m", sentences: ["تشو، تشو! قطار عيد الميلاد يسير.", "على القطار كعكة فيها شمعة."] },
    uhr: { name: "الساعة", gender: "f", sentences: ["تك، تك! الساعة تدق.", "بعد قليل وقت الغداء."] },
    garderobe: { name: "المشجب", gender: "m", sentences: ["هنا تتدلى السترات.", "لكل طفل صورة على المشجب: شمس، بطة، نجمة."] },
    rucksack: { name: "حقيبة الظهر", gender: "f", sentences: ["حقيبة الظهر تفتح. فيها تفاحة!", "والدبدوب يأتي معنا إلى الروضة."] },
    fenster: { name: "النافذة", gender: "f", sentences: ["النافذة تفتح. هواء نقي!", "بابا يلوح في الحديقة: مع السلامة!"] },
    vogel: { name: "العصفور", gender: "m", sentences: ["صوصو! العصفور ينقر حبة.", "العصفور الصغير يجلس عند بيت الطعام."] },
    hamster: { name: "الهامستر", gender: "m", sentences: ["الهامستر يركض في العجلة.", "يا سلام، خداه منتفخان!", "الباب الصغير يفتح."] },
    schrank: { name: "خزانة الأشغال", gender: "f", sentences: ["خزانة الأشغال تفتح.", "فيها ألوان وفرش ولمعان.", "من يجلس خلف الألوان؟"] },
    rollo: { name: "الستارة", gender: "f", sentences: ["الستارة تنزل. الآن وقت النوم.", "وترتفع من جديد. صباح الخير!"] },
    gummistiefel: {
      name: "الجزمات المطاطية",
      gender: "f",
      plural: true,
      sentences: ["طش، طش! الجزمات المطاطية تدب.", "بالجزمات المطاطية نذهب إلى البرك."],
    },
    winkekinder: {
      name: "الأطفال عند النافذة",
      gender: "m",
      plural: true,
      sentences: ["مع السلامة يا بابا! الأطفال يلوحون.", "إلى اللقاء بعد الظهر!"],
    },
    schlafkind: { name: "الطفل النائم", gender: "m", sentences: ["هسس! الطفل نائم.", "يحلم بنجمة."] },
    kisten: { name: "صناديق الألعاب", gender: "f", plural: true, sentences: ["الصناديق تفتح.", "فيها سيارة وبطة وكرة."] },
    puppenwagen: { name: "عربة الدمية", gender: "f", sentences: ["الدمية تتأرجح في عربة الدمية.", "مرحبا يا دمية! هي تفتح عينيها."] },
    trommel: { name: "الطبل", gender: "m", sentences: ["بوم، بوم! الطبل عالي الصوت.", "نطبل أغنية."] },
    spieluhr: { name: "صندوق الموسيقى", gender: "m", sentences: ["صندوق الموسيقى يعزف تهويدة.", "القمر الصغير يدور."] },
    erzieherin: { name: "المعلمة", gender: "f", sentences: ["المعلمة تقرأ قصة.", "كان يا ما كان، بطة صغيرة.", "ها هو ضفدع في الصفحة التالية!"] },
    junge: { name: "الولد", gender: "m", sentences: ["الولد يعانق دبدوبه.", "الدبدوب يستمع أيضا."] },
    baukind: { name: "الطفل البناء", gender: "m", sentences: ["طق، طق! الطفل يبني بالمكعبات.", "إلى فوق، إلى فوق جدا!"] },
    maedchen: { name: "البنت", gender: "f", sentences: ["البنت تصفق.", "القصة مضحكة!"] },
    aufwachkind: { name: "الطفل النعسان", gender: "m", sentences: ["آآآه! الطفل استيقظ.", "يتمطى طويلا."] },
    turm: { name: "البرج", gender: "m", sentences: ["البرج يتمايل. واو!", "البرج عال جدا."] },
    nudelkind: { name: "طفل المعكرونة", gender: "m", sentences: ["هم! الطفل يأكل المعكرونة.", "سلرب! المعكرونة اختفت."] },
    becherkind: { name: "طفل الكوب", gender: "m", sentences: ["بلب، بلب! الطفل يشرب العصير.", "بالمصاصة يصنع فقاعات."] },
    kipplaster: { name: "الشاحنة القلابة", gender: "f", sentences: ["برر، برر! الشاحنة القلابة تسير.", "هي تفرغ المكعبات."] },
    bilderbuch: { name: "كتاب الصور", gender: "m", sentences: ["الكتاب يفتح. نق! ضفدع!", "الضفدع يقفز من الكتاب."] },
    kuscheltier: { name: "الأرنب القطني", gender: "m", sentences: ["الأرنب القطني يقفز.", "هو ناعم جدا ودافئ."] },
    tisch: { name: "الطاولة", gender: "f", sentences: ["طق، طق! الطاولة تهتز.", "على الطاولة غداء."] },
    topf: { name: "قدر الحساء", gender: "m", sentences: ["ممم، رائحة الحساء طيبة!", "الغطاء يقفز. جزرة تقفز منه."] },
    pudding: { name: "البودنغ", gender: "m", sentences: ["يهتز، يهتز! البودنغ يهتز.", "فوقه كرزة."] },
    kanne: { name: "إبريق الماء", gender: "m", sentences: ["قلوب، قلوب! ماء في الكوب.", "الآن الكوب ممتلئ."] },
    xylophon: { name: "الإكسيلفون", gender: "m", sentences: ["بلينغ، بلانغ، بلونغ! الإكسيلفون يعزف.", "لكل نغمة لون."] },
    ball: { name: "الكرة", gender: "f", sentences: ["بوينغ، بوينغ! الكرة تقفز.", "الكرة ملونة جدا."] },
    spielzeugkiste: { name: "صندوق الألعاب", gender: "m", sentences: ["الصندوق يفتح. بوينغ! مهرج!", "المهرج يقفز ويلوح."] },
    hausschuhe: { name: "الشباشب", gender: "f", plural: true, sentences: ["تب، تب! الشباشب تقفز.", "في الروضة نلبس الشباشب."] },
  },
  chains: [
    ["بابا يلوح أيضا: مع السلامة!", "والعصفور يغني: صوصو!"],
    ["واو، البرج يتمايل! الطفل يواصل البناء.", "الشاحنة القلابة تحضر مكعبات جديدة."],
    ["الطفل يسمع التهويدة ويحلم.", "والأرنب القطني يندس بجانبه."],
  ],
};
