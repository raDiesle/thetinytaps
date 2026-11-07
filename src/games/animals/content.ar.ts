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
  /** With article where a plain "ال" before the name is not right (a name with an adjective: "الدب القطبي"). */
  the?: string;
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
  biber: { name: "قندس" },
  ameise: { name: "نملة", female: true },
  wal: { name: "حوت" },
  krebs: { name: "سلطعون" },
  schildkroete: { name: "سلحفاة", female: true },
  kamel: { name: "جمل" },
  eule: { name: "بومة", female: true },
  fledermaus: { name: "خفاش" },
  ziege: { name: "عنزة", female: true },
  gans: { name: "إوزة", female: true },
  lama: { name: "لاما" },
  elefant: { name: "فيل" },
  gorilla: { name: "غوريلا" },
  koala: { name: "كوالا" },
  seehund: { name: "فقمة", female: true },
  delfin: { name: "دلفين" },
  eisbaer: { name: "دب قطبي", the: "الدب القطبي" },
  krokodil: { name: "تمساح" },
  tiger: { name: "نمر" },
  wolf: { name: "ذئب" },
  igel: { name: "قنفذ" },
  schmetterling: { name: "فراشة", female: true },
  raupe: { name: "يرقة", female: true },
  papagei: { name: "ببغاء" },
  zebra: { name: "حمار وحشي", the: "الحمار الوحشي" },
  esel: { name: "حمار" },
  hamster: { name: "هامستر" },
  nilpferd: { name: "فرس النهر", the: "فرس النهر" },
  nashorn: { name: "وحيد القرن", the: "وحيد القرن" },
  kaenguru: { name: "كنغر" },
  hirsch: { name: "أيل" },
  elch: { name: "موظ" },
  faultier: { name: "كسلان" },
  otter: { name: "قضاعة", female: true },
  hai: { name: "قرش" },
  kugelfisch: { name: "سمكة منتفخة", the: "السمكة المنتفخة", female: true },
  oktopus: { name: "أخطبوط" },
  flamingo: { name: "فلامنغو" },
  adler: { name: "نسر" },
  marienkaefer: { name: "دعسوقة", female: true },
  grashuepfer: { name: "جندب" },
  wildschwein: { name: "خنزير بري", the: "الخنزير البري" },
  waschbaer: { name: "راكون" },
  dachs: { name: "غرير" },
  qualle: { name: "قنديل بحر", the: "قنديل البحر" },
  schwan: { name: "بجعة", female: true },
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
  erdnuss: { name: "فول سوداني", likes: "الفول السوداني" },
  trauben: { name: "عنب", likes: "العنب" },
  melone: { name: "بطيخة", likes: "البطيخ" },
  garnele: { name: "جمبري", likes: "الجمبري" },
  holz: { name: "خشب", likes: "الخشب" },
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
  biberburg: { name: "بيت القندس", inPhrase: "في بيت القندس" },
  ameisenhaufen: { name: "بيت النمل", inPhrase: "في بيت النمل" },
  meer: { name: "بحر", inPhrase: "في البحر" },
  wueste: { name: "صحراء", inPhrase: "في الصحراء" },
  dschungel: { name: "أدغال", inPhrase: "في الأدغال" },
  savanne: { name: "سافانا", inPhrase: "في السافانا" },
  bambuswald: { name: "غابة الخيزران", inPhrase: "في غابة الخيزران" },
  kaefig: { name: "قفص", inPhrase: "في القفص" },
  laubhaufen: { name: "كومة أوراق", inPhrase: "في كومة الأوراق" },
  wiese: { name: "مرج", inPhrase: "في المرج" },
  garten: { name: "حديقة", inPhrase: "في الحديقة" },
  fluss: { name: "نهر", inPhrase: "في النهر" },
  berg: { name: "جبل", inPhrase: "على الجبل" },
  wald: { name: "غابة", inPhrase: "في الغابة" },
  riff: { name: "شعاب مرجانية", inPhrase: "في الشعاب المرجانية" },
};

/** The Arabic texts; what has no Arabic words yet is the whole German sentence. */
export function arabicTexts(german: AnimalTexts): AnimalTexts {
  const animal = (a: Animal) => ARABIC_ANIMALS[a.id];
  const the = (a: Animal) => animal(a).the ?? `ال${animal(a).name}`;
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
  kaese: { name: "جبن", the: "الجبن", gives: "الجبن" },
};

/** "Was gibt uns das Tier?" in Arabic, the verb by the animal word's gender (يعطينا/تعطينا); what has no Arabic words yet is the whole German sentence. */
export function arabicGifts(german: GiftTexts): GiftTexts {
  const animal = (a: Animal) => ARABIC_ANIMALS[a.id];
  const the = (a: Animal) => animal(a).the ?? `ال${animal(a).name}`;
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
  /** The small one with its article where a plain "ال" before it is not right ("حبة الذرة"). */
  theYoung?: string;
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
  eichel: { young: "بلوطة", youngFemale: true, adult: "شجرة", theAdult: "الشجرة", adultFemale: true },
  zwiebel: { young: "بصلة", youngFemale: true, adult: "توليب", theAdult: "التوليب" },
  kuerbiskern: { young: "بذرة", youngFemale: true, adult: "يقطينة", theAdult: "اليقطينة", adultFemale: true },
  kokosnuss: { young: "جوز الهند", theYoung: "جوز الهند", adult: "نخلة", theAdult: "النخلة", adultFemale: true },
  knospe: { young: "برعم", adult: "وردة", theAdult: "الوردة", adultFemale: true },
  schildkroetenei: { young: "بيضة", youngFemale: true, adult: "سلحفاة", theAdult: "السلحفاة", adultFemale: true },
  krokodilei: { young: "بيضة", youngFemale: true, adult: "تمساح", theAdult: "التمساح" },
  dinoei: { young: "بيضة", youngFemale: true, adult: "ديناصور", theAdult: "الديناصور" },
  pinguinei: { young: "بيضة", youngFemale: true, adult: "بطريق", theAdult: "البطريق" },
  schlangenei: { young: "بيضة", youngFemale: true, adult: "ثعبان", theAdult: "الثعبان" },
  fischei: { young: "بيضة", youngFemale: true, adult: "سمكة", theAdult: "السمكة", adultFemale: true },
  larve: { young: "يرقة", youngFemale: true, adult: "نحلة", theAdult: "النحلة", adultFemale: true },
  karottensamen: { young: "بذرة", youngFemale: true, adult: "جزرة", theAdult: "الجزرة", adultFemale: true },
  maiskorn: { young: "حبة ذرة", theYoung: "حبة الذرة", youngFemale: true, adult: "ذرة", theAdult: "الذرة", adultFemale: true },
  schirmchen: { young: "مظلة صغيرة", theYoung: "المظلة الصغيرة", youngFemale: true, adult: "هندباء", theAdult: "الهندباء", adultFemale: true },
  erdbeersamen: { young: "بذرة", youngFemale: true, adult: "فراولة", theAdult: "الفراولة", adultFemale: true },
};

/** "Was wird aus mir?" in Arabic, its verbs by the words' gender; a small one without its Arabic words is the whole German sentence. */
export function arabicGrowth(german: GrowTexts): GrowTexts {
  const word = (g: Growth) => ARABIC_GROWTHS[g.id];
  const theYoung = (g: Growth) => word(g)!.theYoung ?? `ال${word(g)!.young}`;
  const turns = (g: Growth) => (word(g)!.youngFemale ? "تتحول" : "يتحول");
  const comes = (g: Growth) => (word(g)!.adultFemale ? "تأتي" : "يأتي");
  return {
    young: (g) => word(g)?.young ?? german.young(g),
    adult: (g) => word(g)?.adult ?? german.adult(g),
    whatBecomes: (g) => (word(g) ? `إلى ماذا ${turns(g)} ${theYoung(g)}؟` : german.whatBecomes(g)),
    becomes: (g) => (word(g) ? `${theYoung(g)} ${turns(g)} إلى ${word(g)!.adult}. رائع!` : german.becomes(g)),
    comesFrom: (g) => (word(g) ? `${word(g)!.theAdult} ${comes(g)} من ${theYoung(g)}!` : german.comesFrom(g)),
  };
}

/** Arabic, for the table of languages in content.ts. */
export const ARABIC: AnimalTranslation = {
  words: { animals: ARABIC_ANIMALS, foods: ARABIC_FOODS, homes: ARABIC_HOMES },
  texts: arabicTexts,
  gifts: arabicGifts,
  growth: arabicGrowth,
};
