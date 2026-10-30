// Arabic language pack (Modern Standard Arabic, ar-SA): the 28 letters of the alphabet in their order,
// each named as Arabic children say it (ب → باء), shown in its isolated form. Words are written without
// vowel marks and without the article ال, so they start with their letter; a word on أ or إ starts with
// alif (ا), as the alif key types it. Keys type the letter at their place on the Arabic keyboard
// (src/lib/arabicKeys.ts). Arabic has one form per letter, so the games show no small letters.
// Nothing said to the child depends on whether it is a boy or a girl: praise without "أحسنت", doing
// words as nouns ("رقص") with "هيّا نرقص!" to join in. Counting follows Arabic grammar: "بطة واحدة",
// the dual "بطتان", and from three the number in the other gender before the plural ("ثلاث بطات", "ثلاثة جوارب").

import { ARABIC_KEYBOARD_ROWS, arabicLetterOf } from "@/lib/arabicKeys";
import { de } from "./de";
import { relabel } from "./translate";
import type { Action, Countable, LanguagePack, LetterEntry, ThemeId, WordEntry } from "./types";

const w = (word: string, emoji: string, image?: string): WordEntry => ({ word, emoji, image });
const themed =
  (theme: ThemeId) =>
  (word: string, emoji: string, image?: string): WordEntry => ({ word, emoji, image, theme });
const hayawan = themed("animals");
const markaba = themed("vehicles");
const taam = themed("food");
const jism = themed("body");
const malabis = themed("clothes");
const aila = themed("family");
const musiqa = themed("music");
const tabia = themed("nature");
const eid = themed("holidays");

/** An Arabic letter has one form here, its isolated one. */
const letter = (upper: string, spoken: string, words: WordEntry[]): LetterEntry => ({ upper, lower: upper, spoken, words });

// A word stands under one letter only, so the words game doesn't bring it twice.
const letters: LetterEntry[] = [
  letter("ا", "ألف", [
    hayawan("أرنب", "🐰"),
    hayawan("أسد", "🦁"),
    taam("أناناس", "🍍"),
    aila("أم", "👩"),
    aila("أب", "👨"),
    jism("أذن", "👂"),
    jism("أنف", "👃"),
    aila("أخ", "👦"),
    aila("أخت", "👧"),
  ]),
  letter("ب", "باء", [
    hayawan("بطة", "🦆"),
    w("باب", "🚪"),
    hayawan("بقرة", "🐮"),
    w("بيت", "🏠"),
    taam("بيضة", "🥚"),
    taam("برتقال", "🍊"),
    taam("بطيخ", "🍉"),
    eid("بالون", "🎈"),
    hayawan("بومة", "🦉"),
    hayawan("بطريق", "🐧"),
  ]),
  letter("ت", "تاء", [taam("تفاحة", "🍎"), hayawan("تمساح", "🐊"), w("تاج", "👑"), w("تلفاز", "📺")]),
  letter("ث", "ثاء", [hayawan("ثعلب", "🦊"), tabia("ثلج", "❄️"), hayawan("ثور", "🐂"), taam("ثوم", "🧄")]),
  letter("ج", "جيم", [
    hayawan("جمل", "🐫"),
    taam("جزرة", "🥕"),
    tabia("جبل", "⛰️"),
    musiqa("جرس", "🔔"),
    aila("جدة", "👵"),
    aila("جد", "👴"),
    taam("جبن", "🧀"),
    malabis("جوارب", "🧦"),
  ]),
  letter("ح", "حاء", [
    hayawan("حصان", "🐴"),
    taam("حليب", "🥛"),
    markaba("حافلة", "🚌"),
    malabis("حذاء", "👟"),
    taam("حلوى", "🍬"),
    hayawan("حمار", "🫏"),
    hayawan("حوت", "🐳"),
    hayawan("حمامة", "🕊️"),
  ]),
  letter("خ", "خاء", [hayawan("خروف", "🐑"), taam("خبز", "🍞"), taam("خيار", "🥒"), taam("خوخ", "🍑"), w("خاتم", "💍"), w("خيمة", "⛺")]),
  letter("د", "دال", [
    hayawan("دب", "🐻"),
    hayawan("دجاجة", "🐔"),
    hayawan("دلفين", "🐬"),
    markaba("دراجة", "🚲"),
    w("دمية", "🪆"),
    hayawan("ديك", "🐓"),
    hayawan("دودة", "🪱"),
  ]),
  letter("ذ", "ذال", [hayawan("ذئب", "🐺"), taam("ذرة", "🌽"), hayawan("ذبابة", "🪰")]),
  letter("ر", "راء", [w("روبوت", "🤖"), w("ريشة", "🪶"), tabia("رمل", "🏖️"), w("رسالة", "✉️")]),
  letter("ز", "زاي", [hayawan("زرافة", "🦒"), tabia("زهرة", "🌸"), taam("زيتون", "🫒"), taam("زبدة", "🧈"), markaba("زورق", "🚤")]),
  letter("س", "سين", [
    hayawan("سمكة", "🐟"),
    markaba("سيارة", "🚗"),
    hayawan("سلحفاة", "🐢"),
    markaba("سفينة", "🚢"),
    w("ساعة", "⏰"),
    tabia("سحابة", "☁️"),
    hayawan("سنجاب", "🐿️"),
    w("سرير", "🛏️"),
  ]),
  letter("ش", "شين", [tabia("شمس", "☀️"), tabia("شجرة", "🌳"), eid("شمعة", "🕯️"), taam("شوكولاتة", "🍫"), markaba("شاحنة", "🚚"), w("شوكة", "🍴")]),
  letter("ص", "صاد", [hayawan("صقر", "🦅"), markaba("صاروخ", "🚀"), w("صحن", "🍽️"), w("صندوق", "📦"), tabia("صدفة", "🐚"), w("صابون", "🧼")]),
  letter("ض", "ضاد", [hayawan("ضفدع", "🐸"), w("ضوء", "💡")]),
  letter("ط", "طاء", [markaba("طائرة", "✈️"), musiqa("طبل", "🥁"), taam("طماطم", "🍅"), aila("طفل", "👶"), hayawan("طاووس", "🦚"), hayawan("طائر", "🐦")]),
  letter("ظ", "ظاء", [w("ظرف", "✉️"), hayawan("ظبي", "🦌"), jism("ظفر", "💅")]),
  letter("ع", "عين", [hayawan("عصفور", "🐤"), taam("عنب", "🍇"), jism("عين", "👁️"), taam("عسل", "🍯"), hayawan("عنكبوت", "🕷️"), w("علم", "🚩")]),
  letter("غ", "غين", [hayawan("غزال", "🦌"), tabia("غيمة", "☁️"), hayawan("غوريلا", "🦍"), hayawan("غراب", "🐦‍⬛")]),
  letter("ف", "فاء", [
    hayawan("فيل", "🐘"),
    hayawan("فراشة", "🦋"),
    hayawan("فأر", "🐭"),
    tabia("فطر", "🍄"),
    jism("فم", "👄"),
    malabis("فستان", "👗"),
    taam("فراولة", "🍓"),
  ]),
  letter("ق", "قاف", [
    hayawan("قطة", "🐱"),
    tabia("قمر", "🌙"),
    hayawan("قرد", "🐒"),
    markaba("قطار", "🚂"),
    jism("قلب", "❤️"),
    malabis("قبعة", "🧢"),
    w("قلم", "✏️"),
    markaba("قارب", "⛵"),
  ]),
  letter("ك", "كاف", [
    hayawan("كلب", "🐶"),
    w("كرة", "⚽"),
    eid("كعكة", "🎂"),
    w("كتاب", "📖"),
    w("كوب", "🥛"),
    w("كرسي", "🪑"),
    hayawan("كنغر", "🦘"),
    musiqa("كمان", "🎻"),
  ]),
  letter("ل", "لام", [taam("ليمون", "🍋"), w("لعبة", "🧸"), taam("لحم", "🥩")]),
  letter("م", "ميم", [
    taam("موز", "🍌"),
    tabia("مطر", "🌧️"),
    w("مفتاح", "🔑"),
    w("ملعقة", "🥄"),
    w("مظلة", "☂️"),
    tabia("موجة", "🌊"),
    tabia("ماء", "💧"),
    w("مصباح", "💡"),
  ]),
  letter("ن", "نون", [
    hayawan("نمر", "🐯"),
    hayawan("نحلة", "🐝"),
    tabia("نجمة", "⭐"),
    tabia("نار", "🔥"),
    hayawan("نملة", "🐜"),
    w("نظارة", "👓"),
    tabia("نخلة", "🌴"),
    w("نافذة", "🪟"),
  ]),
  letter("ه", "هاء", [eid("هدية", "🎁"), w("هاتف", "📱"), eid("هلال", "🌙")]),
  letter("و", "واو", [tabia("وردة", "🌹"), jism("وجه", "🙂"), tabia("ورقة", "🍃")]),
  letter("ي", "ياء", [jism("يد", "✋"), eid("يقطين", "🎃"), hayawan("يمامة", "🕊️"), markaba("يخت", "🛥️")]),
];

/** Arabic counting needs the gender (واحد / واحدة, ثلاثة / ثلاث) and the dual for two. */
interface ArabicCountable extends Countable {
  gender: "m" | "f";
  /** Two of it: "بطتان". `plural` is the form after 3–9: "بطات". */
  dual: string;
}

const thing = (emoji: string, gender: ArabicCountable["gender"], singular: string, dual: string, plural: string, theme?: ThemeId): ArabicCountable => ({
  emoji,
  gender,
  singular,
  dual,
  plural,
  theme,
});

const countables: ArabicCountable[] = [
  thing("🦆", "f", "بطة", "بطتان", "بطات", "animals"),
  thing("🐟", "f", "سمكة", "سمكتان", "سمكات", "animals"),
  thing("🐝", "f", "نحلة", "نحلتان", "نحلات", "animals"),
  thing("🐸", "m", "ضفدع", "ضفدعان", "ضفادع", "animals"),
  thing("🐥", "m", "كتكوت", "كتكوتان", "كتاكيت", "animals"),
  thing("🚗", "f", "سيارة", "سيارتان", "سيارات", "vehicles"),
  thing("🚌", "f", "حافلة", "حافلتان", "حافلات", "vehicles"),
  thing("🚜", "m", "جرار", "جراران", "جرارات", "vehicles"),
  thing("🚲", "f", "دراجة", "دراجتان", "دراجات", "vehicles"),
  thing("✈️", "f", "طائرة", "طائرتان", "طائرات", "vehicles"),
  thing("🍎", "f", "تفاحة", "تفاحتان", "تفاحات", "food"),
  thing("🍌", "f", "موزة", "موزتان", "موزات", "food"),
  thing("🥕", "f", "جزرة", "جزرتان", "جزرات", "food"),
  thing("🍪", "f", "كعكة", "كعكتان", "كعكات", "food"),
  thing("👂", "f", "أذن", "أذنان", "آذان", "body"),
  thing("🦶", "f", "قدم", "قدمان", "أقدام", "body"),
  thing("🧦", "m", "جورب", "جوربان", "جوارب", "clothes"),
  thing("🧢", "f", "قبعة", "قبعتان", "قبعات", "clothes"),
  thing("👕", "m", "قميص", "قميصان", "قمصان", "clothes"),
  thing("🔔", "m", "جرس", "جرسان", "أجراس", "music"),
  thing("🥁", "m", "طبل", "طبلان", "طبول", "music"),
  thing("🌳", "f", "شجرة", "شجرتان", "أشجار", "nature"),
  thing("🌼", "f", "زهرة", "زهرتان", "زهرات", "nature"),
  thing("🎈", "m", "بالون", "بالونان", "بالونات", "holidays"),
  thing("🎁", "f", "هدية", "هديتان", "هدايا", "holidays"),
  thing("🕯️", "f", "شمعة", "شمعتان", "شموع", "holidays"),
  thing("⭐", "f", "نجمة", "نجمتان", "نجوم"),
];

const numberWords = ["صفر", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة"];
/** 3–9 before a feminine noun (the number takes the other gender): "ثلاث بطات". */
const FEMININE_COUNT = ["", "", "", "ثلاث", "أربع", "خمس", "ست", "سبع", "ثماني", "تسع"];

/** "بطة واحدة", "بطتان", "ثلاث بطات", "ثلاثة جوارب". */
function countSentence(n: number, countable: Countable) {
  const item = countable as ArabicCountable;
  if (n === 1) return `${item.singular} ${item.gender === "f" ? "واحدة" : "واحد"}!`;
  if (n === 2) return `${item.dual}!`;
  if (n === 0) return `${numberWords[0]} ${item.plural}!`;
  return `${item.gender === "f" ? FEMININE_COUNT[n] : numberWords[n]} ${item.plural}!`;
}

/** "هيّا نقفز!" – joining in as "let's", which is the same for boys and girls. */
const LETS: Record<Action, string> = {
  hop: "هيّا نقفز معا!",
  run: "هيّا نركض معا!",
  sleep: "هيّا ننام!",
  dance: "هيّا نرقص معا!",
  wave: "هيّا نلوّح معا!",
  spin: "هيّا ندور معا!",
  fly: "هيّا نطير معا!",
  swim: "هيّا نسبح معا!",
  clap: "هيّا نصفّق معا!",
};

export const ar: LanguagePack = {
  speechLang: "ar-SA",
  themes: [
    { id: "animals", label: "حيوانات", emoji: "🐾" },
    { id: "vehicles", label: "مركبات", emoji: "🚗" },
    { id: "food", label: "طعام", emoji: "🍎" },
    { id: "body", label: "الجسم", emoji: "🖐️" },
    { id: "clothes", label: "ملابس", emoji: "👕" },
    { id: "family", label: "العائلة", emoji: "👪" },
    { id: "music", label: "موسيقى", emoji: "🎵" },
    { id: "nature", label: "الطبيعة", emoji: "🌳" },
    { id: "holidays", label: "أعياد", emoji: "🎄" },
  ],
  letters,
  numberWords,
  countables,
  zero: { emoji: "🪹", sentence: "العش فارغ!" },
  // "باء، بطة!" as in the alphabet songs.
  letterSentence: (l, word) => `${l.spoken}، ${word.word}!`,
  // "أين حرف الباء؟"
  findPrompt: (l) => `أين حرف ال${l.spoken}؟`,
  // The Arabic keyboard as printed: ذ left of 1, and the forms on the bottom row (ئ ء ؤ لا ى ة).
  keyboardRows: ["ذ1234567890", ARABIC_KEYBOARD_ROWS[0], ARABIC_KEYBOARD_ROWS[1], "ئءؤرﻻىةوزظ"],
  letterOfKey: arabicLetterOf,
  exampleLetter: "ب",
  countSentence,
  praise: ["رائع!", "ممتاز!", "مرحى!", "عظيم!", "يا سلام!"],
  colors: relabel(de.colors, {
    "🔴": "أحمر",
    "🔵": "أزرق",
    "🟡": "أصفر",
    "🟢": "أخضر",
    "🟣": "بنفسجي",
    "🩷": "وردي",
    "🟠": "برتقالي",
  }),
  // Doing words as nouns (jumping, dancing): an order would be for a boy or a girl.
  actions: relabel(de.actions, {
    "🐸": "قفز",
    "🏃": "ركض",
    "😴": "نوم",
    "💃": "رقص",
    "👋": "تلويح",
    "🐱": "دوران",
    "🐦": "طيران",
    "🐟": "سباحة",
    "👏": "تصفيق",
  }),
  joinIn: (word) => LETS[word.action],
  whistle: "تشو تشو!",
};
