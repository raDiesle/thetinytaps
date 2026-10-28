import type { ShadowItem, ShadowTexts, ShadowTranslation } from "./content";

// Arabic (Modern Standard, without vowel marks) texts for "Schatten finden" and "Wer schaut da raus?", by the ids of
// the pictures in content.ts. Verbs and pronouns follow the picture word's gender (يبحث عن ظله / تبحث عن ظلها،
// ها هو / ها هي), so each picture says whether its word is feminine; "the shadow of …" needs none (ظل الفيل).

/** A picture's name in Arabic. */
export interface ArabicName {
  /** Without article, shown under the picture: "فيل". */
  name: string;
  /** With article where ال can't simply go in front (a word with its adjective): "القارب الشراعي". */
  the?: string;
  /** The word is feminine (زرافة، سيارة), so verbs and pronouns take the feminine form. */
  female?: true;
}

/** Pictures of content.ts by their id; one without an entry is said in German. */
export const ARABIC_NAMES: Record<string, ArabicName> = {
  elefant: { name: "فيل" },
  giraffe: { name: "زرافة", female: true },
  schildkroete: { name: "سلحفاة", female: true },
  schnecke: { name: "حلزون" },
  schmetterling: { name: "فراشة", female: true },
  fisch: { name: "سمكة", female: true },
  hahn: { name: "ديك" },
  ente: { name: "بطة", female: true },
  hase: { name: "أرنب" },
  katze: { name: "قطة", female: true },
  hund: { name: "كلب" },
  pferd: { name: "حصان" },
  kuh: { name: "بقرة", female: true },
  schwein: { name: "خنزير" },
  schaf: { name: "خروف" },
  igel: { name: "قنفذ" },
  krebs: { name: "سلطعون" },
  tintenfisch: { name: "أخطبوط" },
  dino: { name: "ديناصور" },
  krokodil: { name: "تمساح" },
  eichhoernchen: { name: "سنجاب" },
  eule: { name: "بومة", female: true },
  biene: { name: "نحلة", female: true },
  wal: { name: "حوت" },
  flamingo: { name: "فلامنغو" },
  pinguin: { name: "بطريق" },
  maus: { name: "فأر" },

  auto: { name: "سيارة", female: true },
  fahrrad: { name: "دراجة", female: true },
  lok: { name: "قطار" },
  flugzeug: { name: "طائرة", female: true },
  hubschrauber: { name: "مروحية", female: true },
  segelboot: { name: "قارب شراعي", the: "القارب الشراعي" },
  rakete: { name: "صاروخ" },
  traktor: { name: "جرار" },
  roller: { name: "سكوتر" },
  feuerwehr: { name: "سيارة إطفاء", the: "سيارة الإطفاء", female: true },
  motorrad: { name: "دراجة نارية", the: "الدراجة النارية", female: true },

  banane: { name: "موزة", female: true },
  apfel: { name: "تفاحة", female: true },
  birne: { name: "إجاصة", female: true },
  moehre: { name: "جزرة", female: true },
  erdbeere: { name: "فراولة", female: true },
  melone: { name: "بطيخة", female: true },
  kaese: { name: "جبن" },
  brezel: { name: "بريتزل" },
  eis: { name: "آيس كريم" },
  pilz: { name: "فطر" },
  mais: { name: "ذرة", female: true },
  brokkoli: { name: "بروكلي" },
  pizza: { name: "بيتزا", female: true },

  stern: { name: "نجمة", female: true },
  schirm: { name: "مظلة", female: true },
  schluessel: { name: "مفتاح" },
  ballon: { name: "بالون" },
  mond: { name: "قمر" },
  baum: { name: "شجرة", female: true },
  haus: { name: "بيت" },
  schere: { name: "مقص" },
  gitarre: { name: "غيتار" },
  schuh: { name: "حذاء" },
  teddy: { name: "دبدوب" },
  drachen: { name: "طائرة ورقية", the: "الطائرة الورقية", female: true },
  glocke: { name: "جرس" },
  herz: { name: "قلب" },
};

/** The Arabic texts; a picture without its Arabic name gets the whole German sentence. */
export function arabicTexts(german: ShadowTexts): ShadowTexts {
  const about =
    (sentence: (ar: ArabicName, the: string) => string, fallback: (item: ShadowItem) => string) =>
    (item: ShadowItem): string => {
      const ar = ARABIC_NAMES[item.id];
      return ar ? sentence(ar, ar.the ?? `ال${ar.name}`) : fallback(item);
    };
  return {
    name: about((ar) => ar.name, german.name),
    search: about((ar, the) => `${the} ${ar.female ? "تبحث عن ظلها" : "يبحث عن ظله"}.`, german.search),
    found: about((_, the) => `رائع! هذا ظل ${the}!`, german.found),
    thatIs: about((ar, the) => `${ar.female ? "هذه هي" : "هذا هو"} ${the}.`, german.thatIs),
    peek: "من يطل من هناك؟",
    there: about((ar, the) => `${ar.female ? "ها هي" : "ها هو"} ${the}!`, german.there),
    shadow: (n) => `الظل ${n}`,
    stars: (n) => `تم ${n}`,
  };
}

/** Arabic, for the table of languages in content.ts. */
export const ARABIC: ShadowTranslation = { names: ARABIC_NAMES, texts: arabicTexts };
