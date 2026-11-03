import type { Animal, AnimalTexts, AnimalTranslation, Food, GiftTexts } from "./content";
import type { Gift, GiftId } from "./gifts";
import type { Growth, GrowTexts, GrowthId } from "./growth";
import type { Home, HomeId } from "./homes";

// Hindi texts for "Was gehört zum Tier?", by the ids of the animals, foods and homes in content.ts and homes.tsx.
// Hindi verbs follow the animal's gender (रहता/रहती), so the sentences are built with को and का instead, which
// need no gender: "भालू को भूख लगी है!", "गुफा भालू का घर है।". Before को and का a masculine noun in -ा takes its
// oblique form (कुत्ता → कुत्ते को), kept as `of`; "पसंद है/हैं" follows the food.

/** An animal in Hindi. */
export interface HindiAnimal {
  /** Shown under it: "कुत्ता". */
  name: string;
  /** Before को and का (oblique), where it differs: "कुत्ते". */
  of?: string;
}

/** Animals by their id; one without an entry is said in German. */
export const HINDI_ANIMALS: Record<string, HindiAnimal> = {
  hase: { name: "खरगोश" },
  hund: { name: "कुत्ता", of: "कुत्ते" },
  katze: { name: "बिल्ली" },
  maus: { name: "चूहा", of: "चूहे" },
  vogel: { name: "चिड़िया" },
  baer: { name: "भालू" },
  biene: { name: "मधुमक्खी" },
  frosch: { name: "मेंढक" },
  kuh: { name: "गाय" },
  pferd: { name: "घोड़ा", of: "घोड़े" },
  eichhoernchen: { name: "गिलहरी" },
  pinguin: { name: "पेंगुइन" },
  fisch: { name: "मछली" },
  spinne: { name: "मकड़ी" },
  ente: { name: "बत्तख" },
  fuchs: { name: "लोमड़ी" },
  schwein: { name: "सूअर" },
  affe: { name: "बंदर" },
  huhn: { name: "मुर्गी" },
  panda: { name: "पांडा" },
  schnecke: { name: "घोंघा", of: "घोंघे" },
  loewe: { name: "शेर" },
  giraffe: { name: "जिराफ़" },
  schaf: { name: "भेड़" },
};

/** A food in Hindi. */
export interface HindiFood {
  /** Shown under the plate: "गाजर". */
  name: string;
  /** For "… को कीड़े पसंद हैं।", where it differs from `name`: the plural where one eats many. */
  likes?: string;
  /** Plural, so the verb is "हैं". */
  many?: true;
}

/** Foods by their id; one without an entry is said in German. */
export const HINDI_FOODS: Record<string, HindiFood> = {
  moehre: { name: "गाजर" },
  knochen: { name: "हड्डी", likes: "हड्डियाँ", many: true },
  fisch: { name: "मछली" },
  kaese: { name: "चीज़" },
  wurm: { name: "कीड़ा", likes: "कीड़े", many: true },
  honig: { name: "शहद" },
  blume: { name: "फूल", many: true },
  fliege: { name: "मक्खी", likes: "मक्खियाँ", many: true },
  heu: { name: "भूसा" },
  apfel: { name: "सेब", many: true },
  nuss: { name: "अखरोट", many: true },
  banane: { name: "केला", likes: "केले", many: true },
  mais: { name: "मक्का" },
  bambus: { name: "बाँस" },
  salat: { name: "सलाद पत्ता", likes: "सलाद पत्ते", many: true },
  fleisch: { name: "मांस" },
  blaetter: { name: "पत्ते", many: true },
};

/** Homes by their id, as they are called under the drawing and in "गुफा भालू का घर है।"; one without an entry is said in German. */
export const HINDI_HOMES: Partial<Record<HomeId, string>> = {
  huette: "झोपड़ी",
  nest: "घोंसला",
  aquarium: "मछलीघर",
  bienenstock: "छत्ता",
  stall: "तबेला",
  hoehle: "गुफा",
  teich: "तालाब",
  bau: "माँद",
  mauseloch: "बिल",
  koerbchen: "टोकरी",
  baum: "पेड़",
  netz: "जाला",
  eis: "बर्फ़",
};

/** The Hindi texts; what has no Hindi words yet is the whole German sentence. */
export function hindiTexts(german: AnimalTexts): AnimalTexts {
  const animal = (a: Animal) => HINDI_ANIMALS[a.id];
  const of = (a: Animal) => animal(a).of ?? animal(a).name;
  const food = (f: Food) => HINDI_FOODS[f.id];
  const home = (h: Home) => HINDI_HOMES[h.id];
  return {
    animal: (a) => animal(a)?.name ?? german.animal(a),
    food: (f) => food(f)?.name ?? german.food(f),
    home: (h) => home(h) ?? german.home(h),
    hungry: (a) => (animal(a) ? `${of(a)} को भूख लगी है!` : german.hungry(a)),
    yummy: (a, f) =>
      animal(a) && food(f) ? `वाह, स्वादिष्ट! ${of(a)} को ${food(f).likes ?? food(f).name} पसंद ${food(f).many ? "हैं" : "है"}। धन्यवाद!` : german.yummy(a, f),
    yuck: (a) => (animal(a) ? `छी! ${of(a)} को यह पसंद नहीं।` : german.yuck(a)),
    whereLives: (a) => (animal(a) ? `${of(a)} का घर कहाँ है?` : german.whereLives(a)),
    movedIn: (a, h) => (animal(a) && home(h) ? `अरे वाह! ${home(h)} ${of(a)} का घर है।` : german.movedIn(a, h)),
    livesHere: (resident) => (animal(resident) ? `नहीं, यह ${of(resident)} का घर है!` : german.livesHere(resident)),
    stars: (n) => `${n} पूरे`,
  };
}

/** A gift in Hindi. */
export interface HindiGift {
  /** Shown for screen readers and in "अंडा मुर्गी से आता है!": "अंडा". */
  name: string;
  /** What we get, for "मुर्गी से हमें अंडे मिलते हैं।", where it differs from `name`: the plural where one gets many. */
  gives?: string;
  /** Plural, so the verb is "मिलते हैं". */
  many?: true;
  /** A feminine word (ऊन), so the verbs are "मिलती" and "आती". */
  female?: true;
}

/** What the animals give us, by gift id ("Was gibt uns das Tier?"); one without an entry is said in German. */
export const HINDI_GIFTS: Partial<Record<GiftId, HindiGift>> = {
  milch: { name: "दूध" },
  ei: { name: "अंडा", gives: "अंडे", many: true },
  honig: { name: "शहद" },
  wolle: { name: "ऊन", female: true },
};

/**
 * "Was gibt uns das Tier?" in Hindi, built with से and मिलना ("गाय से हमें दूध मिलता है।"), so the verb follows the
 * gift, never the animal. What has no Hindi words yet is the whole German sentence.
 */
export function hindiGifts(german: GiftTexts): GiftTexts {
  const animal = (a: Animal) => HINDI_ANIMALS[a.id];
  const of = (a: Animal) => animal(a).of ?? animal(a).name;
  const gift = (g: Gift) => HINDI_GIFTS[g.id];
  /** "मिलता है", "मिलते हैं" or "मिलती है", by what we get. */
  const get = (g: Gift) => (gift(g)!.many ? "मिलते हैं" : gift(g)!.female ? "मिलती है" : "मिलता है");
  /** "आता है" or "आती है", by the gift's name (one of it). */
  const comes = (g: Gift) => (gift(g)!.female ? "आती है" : "आता है");
  return {
    gift: (g) => gift(g)?.name ?? german.gift(g),
    whatGives: (a) => (animal(a) ? `${of(a)} से हमें क्या मिलता है?` : german.whatGives(a)),
    gives: (a, g) => (animal(a) && gift(g) ? `${of(a)} से हमें ${gift(g)!.gives ?? gift(g)!.name} ${get(g)}। धन्यवाद!` : german.gives(a, g)),
    comesFrom: (g, giver) => (animal(giver) && gift(g) ? `${gift(g)!.name} ${of(giver)} से ${comes(g)}!` : german.comesFrom(g, giver)),
  };
}

/** A small one and what it becomes, in Hindi ("Was wird aus mir?"). */
export interface HindiGrowth {
  /** The small one: "इल्ली". */
  young: string;
  /** Before से (oblique), where it differs: "अंडे". */
  of?: string;
  /** What it becomes: "तितली". */
  adult: string;
  /** What it becomes is a feminine word (तितली), so the verb is "बनती". */
  female?: true;
}

/** The small ones by their id; one without an entry is said in German. */
export const HINDI_GROWTHS: Partial<Record<GrowthId, HindiGrowth>> = {
  raupe: { young: "इल्ली", adult: "तितली", female: true },
  ei: { young: "अंडा", of: "अंडे", adult: "चूज़ा" },
  samen: { young: "बीज", adult: "सूरजमुखी" },
  kaulquappe: { young: "बेंगची", adult: "मेंढक" },
};

/** "Was wird aus mir?" in Hindi, built with से and बनना ("इल्ली से तितली बनती है।"). */
export function hindiGrowth(german: GrowTexts): GrowTexts {
  const word = (g: Growth) => HINDI_GROWTHS[g.id];
  const of = (g: Growth) => word(g)!.of ?? word(g)!.young;
  const becomes = (g: Growth) => (word(g)!.female ? "बनती है" : "बनता है");
  return {
    young: (g) => word(g)?.young ?? german.young(g),
    adult: (g) => word(g)?.adult ?? german.adult(g),
    whatBecomes: (g) => (word(g) ? `${of(g)} से क्या बनता है?` : german.whatBecomes(g)),
    becomes: (g) => (word(g) ? `${of(g)} से ${word(g)!.adult} ${becomes(g)}। बहुत बढ़िया!` : german.becomes(g)),
    comesFrom: (g) => (word(g) ? `${word(g)!.adult} ${of(g)} से ${becomes(g)}!` : german.comesFrom(g)),
  };
}

/** Hindi, for the table of languages in content.ts. */
export const HINDI: AnimalTranslation = {
  words: { animals: HINDI_ANIMALS, foods: HINDI_FOODS, homes: HINDI_HOMES },
  texts: hindiTexts,
  gifts: hindiGifts,
  growth: hindiGrowth,
};
