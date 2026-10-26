import type { ShadowItem, ShadowTexts } from "./content";

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
    stars: (n) => `Готово: ${n}`,
  };
}
