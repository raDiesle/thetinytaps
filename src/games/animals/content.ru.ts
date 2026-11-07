import type { Animal, AnimalTexts, AnimalTranslation, Food, GiftTexts } from "./content";
import type { Gift, GiftId } from "./gifts";
import type { Growth, GrowTexts, GrowthId } from "./growth";
import type { Home, HomeId } from "./homes";

// Russian texts for "Was gehört zum Tier?", by the ids of the animals, foods and
// homes in content.ts and homes.tsx. The sentences are built so that no word has
// to agree with the animal's gender: "Мишка любит мёд", "Где живёт лиса?".

/** Animals by their id (one without an entry is said in German): the Russian name in the nominative, lower case, warm diminutives where a child would say them. */
export const RUSSIAN_ANIMALS: Record<string, string> = {
  hase: "зайка",
  hund: "собачка",
  katze: "кошка",
  maus: "мышка",
  vogel: "птичка",
  baer: "мишка",
  biene: "пчёлка",
  frosch: "лягушка",
  kuh: "корова",
  pferd: "лошадка",
  eichhoernchen: "белочка",
  pinguin: "пингвин",
  fisch: "рыбка",
  spinne: "паучок",
  ente: "уточка",
  fuchs: "лиса",
  schwein: "свинка",
  affe: "обезьянка",
  huhn: "курочка",
  panda: "панда",
  schnecke: "улитка",
  loewe: "лев",
  giraffe: "жираф",
  schaf: "овечка",
  biber: "бобёр",
  ameise: "муравей",
  wal: "кит",
  krebs: "краб",
  schildkroete: "черепаха",
  kamel: "верблюд",
  eule: "сова",
  fledermaus: "летучая мышь",
  ziege: "козочка",
  gans: "гусь",
  lama: "лама",
  elefant: "слон",
  gorilla: "горилла",
  koala: "коала",
  seehund: "тюлень",
  delfin: "дельфин",
  eisbaer: "белый медведь",
  krokodil: "крокодил",
  tiger: "тигр",
  wolf: "волк",
  igel: "ёжик",
  schmetterling: "бабочка",
  raupe: "гусеница",
  papagei: "попугай",
  zebra: "зебра",
  esel: "ослик",
  hamster: "хомячок",
  nilpferd: "бегемот",
  nashorn: "носорог",
  kaenguru: "кенгуру",
  hirsch: "олень",
  elch: "лось",
  faultier: "ленивец",
  otter: "выдра",
  hai: "акула",
  kugelfisch: "рыба-фугу",
  oktopus: "осьминог",
  flamingo: "фламинго",
  adler: "орёл",
  marienkaefer: "божья коровка",
  grashuepfer: "кузнечик",
  wildschwein: "кабан",
  waschbaer: "енот",
  dachs: "барсук",
  qualle: "медуза",
  schwan: "лебедь",
};

/** A food in Russian. */
export interface RussianFood {
  /** Nominative, lower case, shown under the plate: "морковка". */
  name: string;
  /** Accusative, for "Зайка любит морковку.": plural where one eats many ("яблоки"). */
  likes: string;
}

/** Foods by their id; one without an entry is said in German. */
export const RUSSIAN_FOODS: Record<string, RussianFood> = {
  moehre: { name: "морковка", likes: "морковку" },
  knochen: { name: "косточка", likes: "косточки" },
  fisch: { name: "рыбка", likes: "рыбку" },
  kaese: { name: "сыр", likes: "сыр" },
  wurm: { name: "червячок", likes: "червячков" },
  honig: { name: "мёд", likes: "мёд" },
  blume: { name: "цветочек", likes: "цветочки" },
  fliege: { name: "муха", likes: "мух" },
  heu: { name: "сено", likes: "сено" },
  apfel: { name: "яблоко", likes: "яблоки" },
  nuss: { name: "орешек", likes: "орешки" },
  banane: { name: "банан", likes: "бананы" },
  mais: { name: "кукуруза", likes: "кукурузу" },
  bambus: { name: "бамбук", likes: "бамбук" },
  salat: { name: "салат", likes: "салат" },
  fleisch: { name: "мясо", likes: "мясо" },
  blaetter: { name: "листочки", likes: "листочки" },
  erdnuss: { name: "арахис", likes: "арахис" },
  trauben: { name: "виноград", likes: "виноград" },
  melone: { name: "арбуз", likes: "арбуз" },
  garnele: { name: "креветка", likes: "креветок" },
  holz: { name: "брёвнышко", likes: "брёвнышки" },
};

/** A home in Russian. */
export interface RussianHome {
  /** Nominative, lower case, shown under the drawing: "будка". */
  name: string;
  /** Where one lives, for "Собачка живёт в будке.". */
  inPhrase: string;
}

/** Homes by their id; one without an entry is said in German (russianTexts). */
export const RUSSIAN_HOMES: Partial<Record<HomeId, RussianHome>> = {
  huette: { name: "будка", inPhrase: "в будке" },
  nest: { name: "гнездо", inPhrase: "в гнезде" },
  aquarium: { name: "аквариум", inPhrase: "в аквариуме" },
  bienenstock: { name: "улей", inPhrase: "в улье" },
  stall: { name: "хлев", inPhrase: "в хлеву" },
  hoehle: { name: "берлога", inPhrase: "в берлоге" },
  teich: { name: "пруд", inPhrase: "в пруду" },
  bau: { name: "нора", inPhrase: "в норе" },
  mauseloch: { name: "норка", inPhrase: "в норке" },
  koerbchen: { name: "корзинка", inPhrase: "в корзинке" },
  baum: { name: "дупло", inPhrase: "в дупле" },
  netz: { name: "паутина", inPhrase: "в паутине" },
  eis: { name: "льдина", inPhrase: "на льдине" },
  biberburg: { name: "бобровая хатка", inPhrase: "в бобровой хатке" },
  ameisenhaufen: { name: "муравейник", inPhrase: "в муравейнике" },
  meer: { name: "море", inPhrase: "в море" },
  wueste: { name: "пустыня", inPhrase: "в пустыне" },
  dschungel: { name: "джунгли", inPhrase: "в джунглях" },
  savanne: { name: "саванна", inPhrase: "в саванне" },
  bambuswald: { name: "бамбуковый лес", inPhrase: "в бамбуковом лесу" },
  kaefig: { name: "клетка", inPhrase: "в клетке" },
  laubhaufen: { name: "куча листьев", inPhrase: "в куче листьев" },
  wiese: { name: "луг", inPhrase: "на лугу" },
  garten: { name: "сад", inPhrase: "в саду" },
  fluss: { name: "река", inPhrase: "в реке" },
  berg: { name: "гора", inPhrase: "на горе" },
  wald: { name: "лес", inPhrase: "в лесу" },
  riff: { name: "коралловый риф", inPhrase: "на коралловом рифе" },
};

const capital = (text: string) => text.charAt(0).toLocaleUpperCase("ru-RU") + text.slice(1);

/**
 * The Russian texts. Translations come only when asked for, so an animal, food or home
 * may have no Russian word yet: then the whole sentence comes from `german` (and is read
 * by the German voice), never a German word inside a Russian sentence.
 */
export function russianTexts(german: AnimalTexts): AnimalTexts {
  const animal = (a: Animal) => RUSSIAN_ANIMALS[a.id];
  const food = (f: Food) => RUSSIAN_FOODS[f.id];
  const home = (h: Home) => RUSSIAN_HOMES[h.id];
  return {
    animal: (a) => (animal(a) ? capital(animal(a)) : german.animal(a)),
    food: (f) => (food(f) ? capital(food(f)!.name) : german.food(f)),
    home: (h) => (home(h) ? capital(home(h)!.name) : german.home(h)),
    hungry: (a) => (animal(a) ? `${capital(animal(a))} хочет кушать!` : german.hungry(a)),
    yummy: (a, f) => (animal(a) && food(f) ? `Ням-ням, вкусно! ${capital(animal(a))} любит ${food(f)!.likes}. Спасибо!` : german.yummy(a, f)),
    yuck: (a) => (animal(a) ? `Фу! ${capital(animal(a))} такое не ест.` : german.yuck(a)),
    whereLives: (a) => (animal(a) ? `Где живёт ${animal(a)}?` : german.whereLives(a)),
    movedIn: (a, h) => (animal(a) && home(h) ? `Ура! ${capital(animal(a))} живёт ${home(h)!.inPhrase}.` : german.movedIn(a, h)),
    livesHere: (resident) => (animal(resident) ? `Нет, тут живёт ${animal(resident)}!` : german.livesHere(resident)),
    stars: (n) => `Готово: ${n}`,
  };
}

/** A gift in Russian. */
export interface RussianGift {
  /** Nominative, lower case, for screen readers and "Яйцо – от курочки!": "яйцо". */
  name: string;
  /** Accusative, for "Курочка даёт нам яйца.": plural where one gets many. */
  gives: string;
}

/** What the animals give us, by gift id ("Was gibt uns das Tier?"); one without an entry is said in German. */
export const RUSSIAN_GIFTS: Partial<Record<GiftId, RussianGift>> = {
  milch: { name: "молоко", gives: "молоко" },
  ei: { name: "яйцо", gives: "яйца" },
  honig: { name: "мёд", gives: "мёд" },
  wolle: { name: "шерсть", gives: "шерсть" },
  kaese: { name: "сыр", gives: "сыр" },
};

/** The animals that give us something in the genitive, for "Яйцо – от курочки!"; one without an entry is said in German. */
export const RUSSIAN_FROM: Record<string, string> = {
  kuh: "коровы",
  huhn: "курочки",
  biene: "пчёлки",
  schaf: "овечки",
};

/** "Was gibt uns das Tier?" in Russian; "даёт" doesn't follow the animal's gender. What has no Russian words yet is the whole German sentence. */
export function russianGifts(german: GiftTexts): GiftTexts {
  const animal = (a: Animal) => RUSSIAN_ANIMALS[a.id];
  const gift = (g: Gift) => RUSSIAN_GIFTS[g.id];
  return {
    gift: (g) => (gift(g) ? capital(gift(g)!.name) : german.gift(g)),
    whatGives: (a) => (animal(a) ? `Что нам даёт ${animal(a)}?` : german.whatGives(a)),
    gives: (a, g) => (animal(a) && gift(g) ? `${capital(animal(a))} даёт нам ${gift(g)!.gives}. Спасибо!` : german.gives(a, g)),
    comesFrom: (g, giver) => (RUSSIAN_FROM[giver.id] && gift(g) ? `${capital(gift(g)!.name)} – от ${RUSSIAN_FROM[giver.id]}!` : german.comesFrom(g, giver)),
  };
}

/** A small one and what it becomes, in Russian ("Was wird aus mir?"). */
export interface RussianGrowth {
  /** The small one, nominative, lower case: "гусеница". */
  young: string;
  /** The small one in the genitive, for "Бабочка – из гусеницы!". */
  ofYoung: string;
  /** What it becomes, nominative, lower case: "бабочка". */
  adult: string;
  /** What it becomes in the accusative, for "Гусеница превращается в бабочку.". */
  intoAdult: string;
}

/** The small ones by their id; one without an entry is said in German. */
export const RUSSIAN_GROWTHS: Partial<Record<GrowthId, RussianGrowth>> = {
  raupe: { young: "гусеница", ofYoung: "гусеницы", adult: "бабочка", intoAdult: "бабочку" },
  ei: { young: "яйцо", ofYoung: "яйца", adult: "цыплёнок", intoAdult: "цыплёнка" },
  samen: { young: "семечко", ofYoung: "семечка", adult: "подсолнух", intoAdult: "подсолнух" },
  kaulquappe: { young: "головастик", ofYoung: "головастика", adult: "лягушка", intoAdult: "лягушку" },
  eichel: { young: "жёлудь", ofYoung: "жёлудя", adult: "дерево", intoAdult: "дерево" },
  zwiebel: { young: "луковица", ofYoung: "луковицы", adult: "тюльпан", intoAdult: "тюльпан" },
  kuerbiskern: { young: "тыквенное семечко", ofYoung: "тыквенного семечка", adult: "тыква", intoAdult: "тыкву" },
  kokosnuss: { young: "кокос", ofYoung: "кокоса", adult: "пальма", intoAdult: "пальму" },
  knospe: { young: "бутон", ofYoung: "бутона", adult: "роза", intoAdult: "розу" },
  schildkroetenei: { young: "яйцо", ofYoung: "яйца", adult: "черепаха", intoAdult: "черепаху" },
  krokodilei: { young: "яйцо", ofYoung: "яйца", adult: "крокодил", intoAdult: "крокодила" },
  dinoei: { young: "яйцо", ofYoung: "яйца", adult: "динозавр", intoAdult: "динозавра" },
  pinguinei: { young: "яйцо", ofYoung: "яйца", adult: "пингвин", intoAdult: "пингвина" },
  schlangenei: { young: "яйцо", ofYoung: "яйца", adult: "змея", intoAdult: "змею" },
  fischei: { young: "яйцо", ofYoung: "яйца", adult: "рыбка", intoAdult: "рыбку" },
  larve: { young: "личинка", ofYoung: "личинки", adult: "пчёлка", intoAdult: "пчёлку" },
  karottensamen: { young: "семечко", ofYoung: "семечка", adult: "морковка", intoAdult: "морковку" },
  maiskorn: { young: "кукурузное зёрнышко", ofYoung: "кукурузного зёрнышка", adult: "кукуруза", intoAdult: "кукурузу" },
  schirmchen: { young: "пушинка", ofYoung: "пушинки", adult: "одуванчик", intoAdult: "одуванчик" },
  erdbeersamen: { young: "семечко", ofYoung: "семечка", adult: "клубника", intoAdult: "клубнику" },
};

/** "Was wird aus mir?" in Russian, in the present tense, so no verb follows a gender. */
export function russianGrowth(german: GrowTexts): GrowTexts {
  const word = (g: Growth) => RUSSIAN_GROWTHS[g.id];
  return {
    young: (g) => (word(g) ? capital(word(g)!.young) : german.young(g)),
    adult: (g) => (word(g) ? capital(word(g)!.adult) : german.adult(g)),
    whatBecomes: (g) => (word(g) ? `Во что превращается ${word(g)!.young}?` : german.whatBecomes(g)),
    becomes: (g) => (word(g) ? `${capital(word(g)!.young)} превращается в ${word(g)!.intoAdult}. Здорово!` : german.becomes(g)),
    comesFrom: (g) => (word(g) ? `${capital(word(g)!.adult)} – из ${word(g)!.ofYoung}!` : german.comesFrom(g)),
  };
}

/** Russian, for the table of languages in content.ts. */
export const RUSSIAN: AnimalTranslation = {
  words: { animals: RUSSIAN_ANIMALS, foods: RUSSIAN_FOODS, homes: RUSSIAN_HOMES },
  texts: russianTexts,
  gifts: russianGifts,
  growth: russianGrowth,
};
