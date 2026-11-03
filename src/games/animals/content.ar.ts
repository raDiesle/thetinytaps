import type { Animal, AnimalTexts, AnimalTranslation, Food, GiftTexts } from "./content";
import type { Gift, GiftId } from "./gifts";
import type { Growth, GrowTexts, GrowthId } from "./growth";
import type { Home, HomeId } from "./homes";

// Arabic (Modern Standard, without vowel marks) texts for "Was gehört zum Tier?", by the ids of the animals, foods
// and homes in content.ts and homes.tsx. Verbs and adjectives follow the animal word's gender (الأرنب جائع، القطة
// جائعة; يعيش/تعيش), so each animal says whether its word is feminine; the article ال is added in the sentences.

/** An animal in Arabic. */
export interface ArabicAnimal {
  /** Without article, shown under it: "أرنب". */
  name: string;
  /** The word is feminine (قطة، بقرة), so verbs and adjectives take the feminine form. */
  female?: true;
}

/** Animals by their id; one without an entry is said in German. */
export const ARABIC_ANIMALS: Record<string, ArabicAnimal> = {
  hase: { name: "أرنب" },
  hund: { name: "كلب" },
  katze: { name: "قطة", female: true },
  maus: { name: "فأر" },
  vogel: { name: "عصفور" },
  baer: { name: "دب" },
  biene: { name: "نحلة", female: true },
  frosch: { name: "ضفدع" },
  kuh: { name: "بقرة", female: true },
  pferd: { name: "حصان" },
  eichhoernchen: { name: "سنجاب" },
  pinguin: { name: "بطريق" },
  fisch: { name: "سمكة", female: true },
  spinne: { name: "عنكبوت" },
  ente: { name: "بطة", female: true },
  fuchs: { name: "ثعلب" },
  schwein: { name: "خنزير" },
  affe: { name: "قرد" },
  huhn: { name: "دجاجة", female: true },
  panda: { name: "باندا" },
  schnecke: { name: "حلزون" },
  loewe: { name: "أسد" },
  giraffe: { name: "زرافة", female: true },
  schaf: { name: "خروف" },
};

/** A food in Arabic. */
export interface ArabicFood {
  /** Without article, shown under the plate: "جزرة". */
  name: string;
  /** With article, for "الأرنب يحب الجزر.": the kind of food, not one piece. */
  likes: string;
}

/** Foods by their id; one without an entry is said in German. */
export const ARABIC_FOODS: Record<string, ArabicFood> = {
  moehre: { name: "جزرة", likes: "الجزر" },
  knochen: { name: "عظمة", likes: "العظام" },
  fisch: { name: "سمك", likes: "السمك" },
  kaese: { name: "جبن", likes: "الجبن" },
  wurm: { name: "دودة", likes: "الديدان" },
  honig: { name: "عسل", likes: "العسل" },
  blume: { name: "زهرة", likes: "الزهور" },
  fliege: { name: "ذبابة", likes: "الذباب" },
  heu: { name: "تبن", likes: "التبن" },
  apfel: { name: "تفاحة", likes: "التفاح" },
  nuss: { name: "جوزة", likes: "الجوز" },
  banane: { name: "موزة", likes: "الموز" },
  mais: { name: "ذرة", likes: "الذرة" },
  bambus: { name: "خيزران", likes: "الخيزران" },
  salat: { name: "خس", likes: "الخس" },
  fleisch: { name: "لحم", likes: "اللحم" },
  blaetter: { name: "أوراق", likes: "أوراق الشجر" },
};

/** A home in Arabic. */
export interface ArabicHome {
  /** Without article, shown under the drawing: "عش". */
  name: string;
  /** Where one lives, for "العصفور يعيش في العش.". */
  inPhrase: string;
}

/** Homes by their id; one without an entry is said in German. */
export const ARABIC_HOMES: Partial<Record<HomeId, ArabicHome>> = {
  huette: { name: "كوخ", inPhrase: "في الكوخ" },
  nest: { name: "عش", inPhrase: "في العش" },
  aquarium: { name: "حوض سمك", inPhrase: "في حوض السمك" },
  bienenstock: { name: "خلية", inPhrase: "في الخلية" },
  stall: { name: "إسطبل", inPhrase: "في الإسطبل" },
  hoehle: { name: "كهف", inPhrase: "في الكهف" },
  teich: { name: "بركة", inPhrase: "في البركة" },
  bau: { name: "وكر", inPhrase: "في الوكر" },
  mauseloch: { name: "جحر", inPhrase: "في الجحر" },
  koerbchen: { name: "سلة", inPhrase: "في السلة" },
  baum: { name: "شجرة", inPhrase: "في الشجرة" },
  netz: { name: "شبكة", inPhrase: "في الشبكة" },
  eis: { name: "جليد", inPhrase: "على الجليد" },
};

/** The Arabic texts; what has no Arabic words yet is the whole German sentence. */
export function arabicTexts(german: AnimalTexts): AnimalTexts {
  const animal = (a: Animal) => ARABIC_ANIMALS[a.id];
  const the = (a: Animal) => `ال${animal(a).name}`;
  /** The masculine or feminine form, by the animal word. */
  const by = (a: Animal, male: string, female: string) => (animal(a).female ? female : male);
  const food = (f: Food) => ARABIC_FOODS[f.id];
  const home = (h: Home) => ARABIC_HOMES[h.id];
  return {
    animal: (a) => animal(a)?.name ?? german.animal(a),
    food: (f) => food(f)?.name ?? german.food(f),
    home: (h) => home(h)?.name ?? german.home(h),
    hungry: (a) => (animal(a) ? `${the(a)} ${by(a, "جائع", "جائعة")}!` : german.hungry(a)),
    yummy: (a, f) => (animal(a) && food(f) ? `ممم، لذيذ! ${the(a)} ${by(a, "يحب", "تحب")} ${food(f).likes}. شكرا!` : german.yummy(a, f)),
    yuck: (a) => (animal(a) ? `يع! ${the(a)} لا ${by(a, "يحب", "تحب")} هذا.` : german.yuck(a)),
    whereLives: (a) => (animal(a) ? `أين ${by(a, "يعيش", "تعيش")} ${the(a)}؟` : german.whereLives(a)),
    movedIn: (a, h) => (animal(a) && home(h) ? `رائع! ${the(a)} ${by(a, "يعيش", "تعيش")} ${home(h)!.inPhrase}.` : german.movedIn(a, h)),
    livesHere: (resident) => (animal(resident) ? `لا، هنا ${by(resident, "يعيش", "تعيش")} ${the(resident)}!` : german.livesHere(resident)),
    stars: (n) => `تم ${n}`,
  };
}

/** A gift in Arabic. */
export interface ArabicGift {
  /** Without article, for screen readers: "بيضة". */
  name: string;
  /** With article, one of it, for "البيضة من الدجاجة!". */
  the: string;
  /** With article, the kind of thing, for "الدجاجة تعطينا البيض.". */
  gives: string;
}

/** What the animals give us, by gift id ("Was gibt uns das Tier?"); one without an entry is said in German. */
export const ARABIC_GIFTS: Partial<Record<GiftId, ArabicGift>> = {
  milch: { name: "حليب", the: "الحليب", gives: "الحليب" },
  ei: { name: "بيضة", the: "البيضة", gives: "البيض" },
  honig: { name: "عسل", the: "العسل", gives: "العسل" },
  wolle: { name: "صوف", the: "الصوف", gives: "الصوف" },
};

/** "Was gibt uns das Tier?" in Arabic, the verb by the animal word's gender (يعطينا/تعطينا); what has no Arabic words yet is the whole German sentence. */
export function arabicGifts(german: GiftTexts): GiftTexts {
  const animal = (a: Animal) => ARABIC_ANIMALS[a.id];
  const the = (a: Animal) => `ال${animal(a).name}`;
  const gives = (a: Animal) => (animal(a).female ? "تعطينا" : "يعطينا");
  const gift = (g: Gift) => ARABIC_GIFTS[g.id];
  return {
    gift: (g) => gift(g)?.name ?? german.gift(g),
    whatGives: (a) => (animal(a) ? `ماذا ${gives(a)} ${the(a)}؟` : german.whatGives(a)),
    gives: (a, g) => (animal(a) && gift(g) ? `${the(a)} ${gives(a)} ${gift(g)!.gives}. شكرا!` : german.gives(a, g)),
    comesFrom: (g, giver) => (animal(giver) && gift(g) ? `${gift(g)!.the} من ${the(giver)}!` : german.comesFrom(g, giver)),
  };
}

/** A small one and what it becomes, in Arabic ("Was wird aus mir?"). */
export interface ArabicGrowth {
  /** The small one, without article: "يرقة". */
  young: string;
  /** The small one is a feminine word, so the verb is "تتحول". */
  youngFemale?: true;
  /** What it becomes, without article: "فراشة". */
  adult: string;
  /** What it becomes, with article (or made definite otherwise): "الفراشة". */
  theAdult: string;
  /** What it becomes is a feminine word, so the verb is "تأتي". */
  adultFemale?: true;
}

/** The small ones by their id; one without an entry is said in German. */
export const ARABIC_GROWTHS: Partial<Record<GrowthId, ArabicGrowth>> = {
  raupe: { young: "يرقة", youngFemale: true, adult: "فراشة", theAdult: "الفراشة", adultFemale: true },
  ei: { young: "بيضة", youngFemale: true, adult: "كتكوت", theAdult: "الكتكوت" },
  samen: { young: "بذرة", youngFemale: true, adult: "زهرة عباد الشمس", theAdult: "زهرة عباد الشمس", adultFemale: true },
  kaulquappe: { young: "شرغوف", adult: "ضفدع", theAdult: "الضفدع" },
};

/** "Was wird aus mir?" in Arabic, its verbs by the words' gender; a small one without its Arabic words is the whole German sentence. */
export function arabicGrowth(german: GrowTexts): GrowTexts {
  const word = (g: Growth) => ARABIC_GROWTHS[g.id];
  const turns = (g: Growth) => (word(g)!.youngFemale ? "تتحول" : "يتحول");
  const comes = (g: Growth) => (word(g)!.adultFemale ? "تأتي" : "يأتي");
  return {
    young: (g) => word(g)?.young ?? german.young(g),
    adult: (g) => word(g)?.adult ?? german.adult(g),
    whatBecomes: (g) => (word(g) ? `إلى ماذا ${turns(g)} ال${word(g)!.young}؟` : german.whatBecomes(g)),
    becomes: (g) => (word(g) ? `ال${word(g)!.young} ${turns(g)} إلى ${word(g)!.adult}. رائع!` : german.becomes(g)),
    comesFrom: (g) => (word(g) ? `${word(g)!.theAdult} ${comes(g)} من ال${word(g)!.young}!` : german.comesFrom(g)),
  };
}

/** Arabic, for the table of languages in content.ts. */
export const ARABIC: AnimalTranslation = {
  words: { animals: ARABIC_ANIMALS, foods: ARABIC_FOODS, homes: ARABIC_HOMES },
  texts: arabicTexts,
  gifts: arabicGifts,
  growth: arabicGrowth,
};
