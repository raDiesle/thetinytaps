import type { ShadowItem, ShadowTexts, ShadowTranslation } from "./content";

// Russian texts for "Schatten finden" and "Wer schaut da raus?", by the ids of
// the pictures in content.ts. Russian has no article to carry the case, so each
// picture brings its name twice: as it is said on its own ("слон") and after
// "тень" ("тень слона"), so the praise needs no past tense ("нашёл/нашла").

/** A picture's name in Russian. */
export interface RussianName {
  /** Nominative, lower case: "слон". Shown capitalized under the picture. */
  name: string;
  /** Genitive, for "Вот тень слона!". */
  of: string;
  /** The word is plural ("ножницы"), so the verb is too: "ищут". */
  many?: true;
}

/** Pictures of content.ts by their id; one without an entry is said in German (russianTexts). */
export const RUSSIAN_NAMES: Record<string, RussianName> = {
  elefant: { name: "слон", of: "слона" },
  giraffe: { name: "жираф", of: "жирафа" },
  schildkroete: { name: "черепаха", of: "черепахи" },
  schnecke: { name: "улитка", of: "улитки" },
  schmetterling: { name: "бабочка", of: "бабочки" },
  fisch: { name: "рыбка", of: "рыбки" },
  hahn: { name: "петушок", of: "петушка" },
  ente: { name: "уточка", of: "уточки" },
  hase: { name: "зайчик", of: "зайчика" },
  katze: { name: "кошка", of: "кошки" },
  hund: { name: "собачка", of: "собачки" },
  pferd: { name: "лошадка", of: "лошадки" },
  kuh: { name: "корова", of: "коровы" },
  schwein: { name: "свинка", of: "свинки" },
  schaf: { name: "овечка", of: "овечки" },
  igel: { name: "ёжик", of: "ёжика" },
  krebs: { name: "краб", of: "краба" },
  tintenfisch: { name: "осьминог", of: "осьминога" },
  dino: { name: "динозавр", of: "динозавра" },
  krokodil: { name: "крокодил", of: "крокодила" },
  eichhoernchen: { name: "белочка", of: "белочки" },
  eule: { name: "сова", of: "совы" },
  biene: { name: "пчёлка", of: "пчёлки" },
  wal: { name: "кит", of: "кита" },
  flamingo: { name: "фламинго", of: "фламинго" },
  pinguin: { name: "пингвин", of: "пингвина" },
  maus: { name: "мышка", of: "мышки" },

  auto: { name: "машина", of: "машины" },
  fahrrad: { name: "велосипед", of: "велосипеда" },
  lok: { name: "паровоз", of: "паровоза" },
  flugzeug: { name: "самолёт", of: "самолёта" },
  hubschrauber: { name: "вертолёт", of: "вертолёта" },
  segelboot: { name: "кораблик", of: "кораблика" },
  rakete: { name: "ракета", of: "ракеты" },
  traktor: { name: "трактор", of: "трактора" },
  roller: { name: "самокат", of: "самоката" },
  feuerwehr: { name: "пожарная машина", of: "пожарной машины" },
  motorrad: { name: "мотоцикл", of: "мотоцикла" },

  banane: { name: "банан", of: "банана" },
  apfel: { name: "яблоко", of: "яблока" },
  birne: { name: "груша", of: "груши" },
  moehre: { name: "морковка", of: "морковки" },
  erdbeere: { name: "клубника", of: "клубники" },
  melone: { name: "арбуз", of: "арбуза" },
  kaese: { name: "сыр", of: "сыра" },
  brezel: { name: "крендель", of: "кренделя" },
  eis: { name: "мороженое", of: "мороженого" },
  pilz: { name: "грибок", of: "грибка" },
  mais: { name: "кукуруза", of: "кукурузы" },
  brokkoli: { name: "брокколи", of: "брокколи" },
  pizza: { name: "пицца", of: "пиццы" },

  stern: { name: "звёздочка", of: "звёздочки" },
  schirm: { name: "зонтик", of: "зонтика" },
  schluessel: { name: "ключ", of: "ключа" },
  ballon: { name: "шарик", of: "шарика" },
  mond: { name: "месяц", of: "месяца" },
  baum: { name: "дерево", of: "дерева" },
  haus: { name: "домик", of: "домика" },
  schere: { name: "ножницы", of: "ножниц", many: true },
  gitarre: { name: "гитара", of: "гитары" },
  schuh: { name: "кроссовок", of: "кроссовка" },
  teddy: { name: "мишка", of: "мишки" },
  drachen: { name: "воздушный змей", of: "воздушного змея" },
  glocke: { name: "колокольчик", of: "колокольчика" },
  herz: { name: "сердечко", of: "сердечка" },

  tiger: { name: "тигр", of: "тигра" },
  zebra: { name: "зебра", of: "зебры" },
  kamel: { name: "верблюд", of: "верблюда" },
  nashorn: { name: "носорог", of: "носорога" },
  nilpferd: { name: "бегемот", of: "бегемота" },
  kaenguru: { name: "кенгуру", of: "кенгуру" },
  affe: { name: "обезьянка", of: "обезьянки" },
  gorilla: { name: "горилла", of: "гориллы" },
  ziege: { name: "козочка", of: "козочки" },
  lama: { name: "лама", of: "ламы" },
  hirsch: { name: "олень", of: "оленя" },
  pfau: { name: "павлин", of: "павлина" },
  papagei: { name: "попугай", of: "попугая" },
  schwan: { name: "лебедь", of: "лебедя" },
  delfin: { name: "дельфин", of: "дельфина" },
  robbe: { name: "тюлень", of: "тюленя" },
  marienkaefer: { name: "божья коровка", of: "божьей коровки" },
  ameise: { name: "муравей", of: "муравья" },
  raupe: { name: "гусеница", of: "гусеницы" },
  eidechse: { name: "ящерица", of: "ящерицы" },
  trex: { name: "тираннозавр", of: "тираннозавра" },
  spinne: { name: "паучок", of: "паучка" },
  wurm: { name: "червячок", of: "червячка" },
  grashuepfer: { name: "кузнечик", of: "кузнечика" },
  hummer: { name: "омар", of: "омара" },

  bus: { name: "автобус", of: "автобуса" },
  polizei: { name: "полицейская машина", of: "полицейской машины" },
  lastwagen: { name: "грузовик", of: "грузовика" },
  strassenbahn: { name: "трамвай", of: "трамвая" },
  rennauto: { name: "гоночная машина", of: "гоночной машины" },
  motorroller: { name: "мопед", of: "мопеда" },
  motorboot: { name: "катер", of: "катера" },
  kanu: { name: "каноэ", of: "каноэ" },
  schiff: { name: "корабль", of: "корабля" },
  seilbahn: { name: "канатная дорога", of: "канатной дороги" },
  fallschirm: { name: "парашют", of: "парашюта" },
  skateboard: { name: "скейтборд", of: "скейтборда" },
  schlitten: { name: "санки", of: "санок", many: true },

  trauben: { name: "виноград", of: "винограда" },
  kirschen: { name: "вишенки", of: "вишенок", many: true },
  ananas: { name: "ананас", of: "ананаса" },
  spaghetti: { name: "спагетти", of: "спагетти", many: true },
  spiegelei: { name: "яичница", of: "яичницы" },
  keule: { name: "куриная ножка", of: "куриной ножки" },
  flaeschchen: { name: "бутылочка", of: "бутылочки" },
  saft: { name: "сок", of: "сока" },
  becher: { name: "стаканчик", of: "стаканчика" },
  bonbon: { name: "конфета", of: "конфеты" },
  torte: { name: "торт", of: "торта" },
  kuchen: { name: "кусочек торта", of: "кусочка торта" },
  muffin: { name: "маффин", of: "маффина" },
  donut: { name: "пончик", of: "пончика" },

  puzzle: { name: "пазл", of: "пазла" },
  stift: { name: "карандаш", of: "карандаша" },
  eimer: { name: "ведёрко", of: "ведёрка" },
  rutsche: { name: "горка", of: "горки" },
  karussell: { name: "карусель", of: "карусели" },
  riesenrad: { name: "колесо обозрения", of: "колеса обозрения" },
  trompete: { name: "труба", of: "трубы" },
  trommel: { name: "барабан", of: "барабана" },
  geige: { name: "скрипка", of: "скрипки" },
  kopfhoerer: { name: "наушники", of: "наушников", many: true },
  zahnbuerste: { name: "зубная щётка", of: "зубной щётки" },
  badewanne: { name: "ванна", of: "ванны" },
  dusche: { name: "душ", of: "душа" },
  klo: { name: "унитаз", of: "унитаза" },
  stuhl: { name: "стул", of: "стула" },
  bett: { name: "кроватка", of: "кроватки" },
  sofa: { name: "диван", of: "дивана" },
  kerze: { name: "свеча", of: "свечи" },
  gluehbirne: { name: "лампочка", of: "лампочки" },
  wecker: { name: "будильник", of: "будильника" },
  geschenk: { name: "подарок", of: "подарка" },
  korb: { name: "корзина", of: "корзины" },
  einkaufswagen: { name: "тележка", of: "тележки" },
  teekanne: { name: "чайник", of: "чайника" },
  tasse: { name: "чашка", of: "чашки" },
  loeffel: { name: "ложка", of: "ложки" },
  besteck: { name: "столовые приборы", of: "столовых приборов", many: true },
  besen: { name: "метла", of: "метлы" },
  hammer: { name: "молоток", of: "молотка" },
  saege: { name: "пила", of: "пилы" },
  leiter: { name: "лестница", of: "лестницы" },
  kran: { name: "подъёмный кран", of: "подъёмного крана" },
  tshirt: { name: "футболка", of: "футболки" },
  hose: { name: "штанишки", of: "штанишек", many: true },
  kleid: { name: "платье", of: "платья" },
  socke: { name: "носок", of: "носка" },
  handschuhe: { name: "перчатки", of: "перчаток", many: true },
  kappe: { name: "кепка", of: "кепки" },
  hut: { name: "шляпа", of: "шляпы" },
  stiefel: { name: "сапожок", of: "сапожка" },
  flipflop: { name: "шлёпанец", of: "шлёпанца" },
  schlittschuh: { name: "конёк", of: "конька" },
  rollschuh: { name: "ролик", of: "ролика" },
  brille: { name: "очки", of: "очков", many: true },
  krone: { name: "корона", of: "короны" },
  zelt: { name: "палатка", of: "палатки" },
  burg: { name: "замок", of: "замка" },
  tanne: { name: "ёлка", of: "ёлки" },
  palme: { name: "пальма", of: "пальмы" },
  kaktus: { name: "кактус", of: "кактуса" },
  sonnenblume: { name: "подсолнух", of: "подсолнуха" },
  tulpe: { name: "тюльпан", of: "тюльпана" },
  blatt: { name: "листик", of: "листика" },
  berg: { name: "гора", of: "горы" },
  sonne: { name: "солнышко", of: "солнышка" },
  wolke: { name: "облачко", of: "облачка" },
  regenbogen: { name: "радуга", of: "радуги" },
  blitz: { name: "молния", of: "молнии" },
  tropfen: { name: "капля", of: "капли" },
  schneeflocke: { name: "снежинка", of: "снежинки" },
  schneemann: { name: "снеговик", of: "снеговика" },
  feuer: { name: "огонь", of: "огня" },
};

const capital = (text: string) => text.charAt(0).toLocaleUpperCase("ru-RU") + text.slice(1);

/**
 * The Russian texts. Translations come only when asked for, so a picture may have no
 * Russian name yet: then the whole sentence comes from `german` (and is read by the
 * German voice), never a German word inside a Russian sentence.
 */
export function russianTexts(german: ShadowTexts): ShadowTexts {
  const about =
    (sentence: (ru: RussianName) => string, fallback: (item: ShadowItem) => string) =>
    (item: ShadowItem): string => {
      const ru = RUSSIAN_NAMES[item.id];
      return ru ? sentence(ru) : fallback(item);
    };
  return {
    name: about((ru) => capital(ru.name), german.name),
    search: about((ru) => `${capital(ru.name)} ${ru.many ? "ищут" : "ищет"} свою тень.`, german.search),
    found: about((ru) => `Ура! Вот тень ${ru.of}!`, german.found),
    thatIs: about((ru) => `Это ${ru.name}.`, german.thatIs),
    peek: "Кто там выглядывает?",
    there: about((ru) => `А вот и ${ru.name}!`, german.there),
    shadow: (n) => `Тень ${n}`,
  };
}

/** Russian, for the table of languages in content.ts. */
export const RUSSIAN: ShadowTranslation = { names: RUSSIAN_NAMES, texts: russianTexts };
