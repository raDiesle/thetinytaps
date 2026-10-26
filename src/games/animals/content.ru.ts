import type { Animal, AnimalTexts, Food } from "./content";
import type { HomeId } from "./homes";

// Russian texts for "Was gehört zum Tier?", by the ids of the animals, foods and
// homes in content.ts and homes.tsx. The sentences are built so that no word has
// to agree with the animal's gender: "Мишка любит мёд", "Где живёт лиса?".

/** Each animal's Russian name in the nominative, lower case, warm diminutives where a child would say them. */
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
};

/** A food in Russian. */
export interface RussianFood {
  /** Nominative, lower case, shown under the plate: "морковка". */
  name: string;
  /** Accusative, for "Зайка любит морковку.": plural where one eats many ("яблоки"). */
  likes: string;
}

/** Each food by its id. */
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
  kartoffel: { name: "картошка", likes: "картошку" },
  banane: { name: "банан", likes: "бананы" },
  mais: { name: "кукуруза", likes: "кукурузу" },
  bambus: { name: "бамбук", likes: "бамбук" },
  salat: { name: "салат", likes: "салат" },
  fleisch: { name: "мясо", likes: "мясо" },
  blaetter: { name: "листочки", likes: "листочки" },
};

/** A home in Russian. */
export interface RussianHome {
  /** Nominative, lower case, shown under the drawing: "будка". */
  name: string;
  /** Where one lives, for "Собачка живёт в будке.". */
  inPhrase: string;
}

/** Every home; a Record over HomeId, so a new home doesn't compile without its Russian. */
export const RUSSIAN_HOMES: Record<HomeId, RussianHome> = {
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
};

const capital = (text: string) => text.charAt(0).toLocaleUpperCase("ru-RU") + text.slice(1);

// The German word only if an entry is missing; content.test.ts makes sure none is.
const animal = (a: Animal) => RUSSIAN_ANIMALS[a.id] ?? a.name;
const food = (f: Food) => RUSSIAN_FOODS[f.id] ?? { name: f.name, likes: f.plural };

export const RUSSIAN_TEXTS: AnimalTexts = {
  animal: (a) => capital(animal(a)),
  food: (f) => capital(food(f).name),
  home: (h) => capital(RUSSIAN_HOMES[h.id].name),
  hungry: (a) => `${capital(animal(a))} хочет кушать!`,
  yummy: (a, f) => `Ням-ням, вкусно! ${capital(animal(a))} любит ${food(f).likes}. Спасибо!`,
  yuck: (a) => `Фу! ${capital(animal(a))} такое не ест.`,
  whereLives: (a) => `Где живёт ${animal(a)}?`,
  movedIn: (a, h) => `Ура! ${capital(animal(a))} живёт ${RUSSIAN_HOMES[h.id].inPhrase}.`,
  livesHere: (resident) => `Нет, тут живёт ${animal(resident)}!`,
  yuckBubble: "Фу!",
  thanksBubble: "Спасибо!",
  stars: (n) => `Готово: ${n}`,
};
